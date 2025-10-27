-- Injections table
-- Log of all injection events
CREATE TABLE IF NOT EXISTS injections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  vial_id UUID REFERENCES vials(id) ON DELETE SET NULL, -- Which vial was used
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Dose information
  dose_value DECIMAL(10, 4) NOT NULL,
  dose_units VARCHAR(20) NOT NULL,
  volume_ml DECIMAL(10, 4), -- Actual volume injected (calculated or manual)

  -- Injection details
  site VARCHAR(50) NOT NULL, -- 'left_glute', 'right_glute', 'left_delt', 'right_delt', 'abdomen', 'thigh_left', 'thigh_right', etc.

  -- Optional tracking
  notes TEXT,
  side_effects TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete

  CONSTRAINT valid_dose_units CHECK (dose_units IN ('mg', 'IU', 'mcg', 'units', 'mL')),
  CONSTRAINT positive_dose CHECK (dose_value > 0),
  CONSTRAINT positive_volume CHECK (volume_ml IS NULL OR volume_ml > 0),
  CONSTRAINT valid_injection_site CHECK (site IN (
    'left_glute', 'right_glute',
    'left_delt', 'right_delt',
    'left_thigh', 'right_thigh',
    'abdomen_upper_left', 'abdomen_upper_right', 'abdomen_lower_left', 'abdomen_lower_right',
    'left_ventrogluteal', 'right_ventrogluteal'
  ))
);

-- Indexes for performance
CREATE INDEX idx_injections_protocol_id ON injections(protocol_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_injections_date_time ON injections(date_time DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_injections_vial_id ON injections(vial_id) WHERE deleted_at IS NULL AND vial_id IS NOT NULL;
CREATE INDEX idx_injections_protocol_date ON injections(protocol_id, date_time DESC) WHERE deleted_at IS NULL;

-- Row Level Security (RLS)
ALTER TABLE injections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see injections for their protocols
CREATE POLICY injections_select_policy ON injections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = injections.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can insert injections for their protocols
CREATE POLICY injections_insert_policy ON injections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = injections.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can update their injections
CREATE POLICY injections_update_policy ON injections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = injections.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can delete their injections
CREATE POLICY injections_delete_policy ON injections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = injections.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_injections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER injections_updated_at_trigger
  BEFORE UPDATE ON injections
  FOR EACH ROW
  EXECUTE FUNCTION update_injections_updated_at();

-- Trigger to decrement vial volume when injection is logged
CREATE OR REPLACE FUNCTION decrement_vial_volume()
RETURNS TRIGGER AS $$
BEGIN
  -- Only decrement if a vial is specified and volume is provided
  IF NEW.vial_id IS NOT NULL AND NEW.volume_ml IS NOT NULL AND NEW.volume_ml > 0 THEN
    UPDATE vials
    SET remaining_volume = remaining_volume - NEW.volume_ml
    WHERE id = NEW.vial_id
    AND remaining_volume >= NEW.volume_ml; -- Ensure we don't go negative

    -- Check if update was successful
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient volume remaining in vial';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER injections_decrement_vial_trigger
  AFTER INSERT ON injections
  FOR EACH ROW
  EXECUTE FUNCTION decrement_vial_volume();

-- Trigger to restore vial volume if injection is deleted
CREATE OR REPLACE FUNCTION restore_vial_volume()
RETURNS TRIGGER AS $$
BEGIN
  -- Restore volume if a vial was specified and volume was recorded
  IF OLD.vial_id IS NOT NULL AND OLD.volume_ml IS NOT NULL AND OLD.volume_ml > 0 THEN
    UPDATE vials
    SET remaining_volume = remaining_volume + OLD.volume_ml
    WHERE id = OLD.vial_id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER injections_restore_vial_trigger
  BEFORE DELETE ON injections
  FOR EACH ROW
  EXECUTE FUNCTION restore_vial_volume();

-- Function to get adherence percentage for a protocol
CREATE OR REPLACE FUNCTION calculate_adherence(
  p_protocol_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE - 30,
  p_end_date DATE DEFAULT CURRENT_DATE
) RETURNS DECIMAL AS $$
DECLARE
  v_scheduled_count INTEGER;
  v_completed_count INTEGER;
  v_protocol RECORD;
  v_days_diff INTEGER;
BEGIN
  -- Get protocol details
  SELECT * INTO v_protocol FROM protocols WHERE id = p_protocol_id;

  IF v_protocol IS NULL THEN
    RETURN NULL;
  END IF;

  -- Calculate expected injections based on schedule type
  v_days_diff := p_end_date - GREATEST(p_start_date, v_protocol.start_date);

  IF v_protocol.schedule_type = 'every_x_days' THEN
    v_scheduled_count := FLOOR(v_days_diff / v_protocol.frequency_days);
  ELSIF v_protocol.schedule_type = 'weekly' THEN
    v_scheduled_count := FLOOR(v_days_diff / 7) * jsonb_array_length(v_protocol.weekly_days);
  ELSE
    -- For custom schedules, count would need custom logic
    v_scheduled_count := v_days_diff; -- Placeholder
  END IF;

  -- Count actual injections
  SELECT COUNT(*) INTO v_completed_count
  FROM injections
  WHERE protocol_id = p_protocol_id
  AND date_time::DATE BETWEEN p_start_date AND p_end_date
  AND deleted_at IS NULL;

  -- Calculate percentage
  IF v_scheduled_count = 0 THEN
    RETURN 100.0;
  END IF;

  RETURN LEAST(100.0, (v_completed_count::DECIMAL / v_scheduled_count::DECIMAL) * 100.0);
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE injections IS 'Log of all injection events with site tracking and vial deduction';
COMMENT ON COLUMN injections.site IS 'Injection site for rotation tracking';
COMMENT ON COLUMN injections.volume_ml IS 'Actual volume in mL injected (automatically decrements vial)';
COMMENT ON FUNCTION calculate_adherence IS 'Calculate adherence percentage for a protocol over a date range';
