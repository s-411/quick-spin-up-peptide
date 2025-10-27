-- Protocols table
-- Defines dosing schedules and cycles
CREATE TABLE IF NOT EXISTS protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- User-friendly name like "Daily BPC-157" or "TRT Every 3.5 Days"
  schedule_type VARCHAR(50) NOT NULL, -- 'every_x_days', 'weekly', 'custom'

  -- For 'every_x_days' schedule
  frequency_days INTEGER, -- e.g., 1 for daily, 3.5 for every 3.5 days (stored as decimal)

  -- For 'weekly' schedule
  weekly_days JSONB, -- Array of day numbers [0-6], e.g., [1, 3, 5] for Mon/Wed/Fri

  -- For 'custom' schedule
  custom_schedule JSONB, -- Custom recurrence rules (flexible JSON structure)

  -- Cycle configuration
  cycle_length_weeks INTEGER, -- Length of one cycle (e.g., 8 weeks on)
  off_weeks INTEGER, -- Weeks off between cycles (e.g., 2 weeks off)

  -- Dosing details
  dose_value DECIMAL(10, 4) NOT NULL, -- Amount per dose
  dose_units VARCHAR(20) NOT NULL, -- 'mg', 'IU', 'mcg', 'units', 'mL'

  -- Timing
  start_date DATE NOT NULL,
  end_date DATE, -- Optional end date
  time_of_day TIME, -- Preferred time for reminder (e.g., 08:00:00)

  -- Site rotation
  site_rotation JSONB, -- Array of injection sites to rotate through

  -- Versioning for protocol changes
  supersedes_id UUID REFERENCES protocols(id), -- Points to previous version if edited
  version INTEGER DEFAULT 1,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete

  CONSTRAINT valid_schedule_type CHECK (schedule_type IN ('every_x_days', 'weekly', 'custom')),
  CONSTRAINT valid_dose_units CHECK (dose_units IN ('mg', 'IU', 'mcg', 'units', 'mL')),
  CONSTRAINT positive_dose CHECK (dose_value > 0),
  CONSTRAINT valid_frequency CHECK (
    (schedule_type = 'every_x_days' AND frequency_days IS NOT NULL AND frequency_days > 0) OR
    (schedule_type = 'weekly' AND weekly_days IS NOT NULL) OR
    (schedule_type = 'custom' AND custom_schedule IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_protocols_medication_id ON protocols(medication_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_protocols_active ON protocols(medication_id, is_active) WHERE deleted_at IS NULL AND is_active = TRUE;
CREATE INDEX idx_protocols_supersedes ON protocols(supersedes_id) WHERE supersedes_id IS NOT NULL;

-- Row Level Security (RLS)
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see protocols for their medications
CREATE POLICY protocols_select_policy ON protocols
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = protocols.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Policy: Users can insert protocols for their medications
CREATE POLICY protocols_insert_policy ON protocols
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = protocols.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Policy: Users can update protocols for their medications
CREATE POLICY protocols_update_policy ON protocols
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = protocols.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Policy: Users can delete protocols for their medications
CREATE POLICY protocols_delete_policy ON protocols
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = protocols.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_protocols_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protocols_updated_at_trigger
  BEFORE UPDATE ON protocols
  FOR EACH ROW
  EXECUTE FUNCTION update_protocols_updated_at();

-- Function to calculate next injection date for a protocol
CREATE OR REPLACE FUNCTION calculate_next_injection_date(
  p_protocol_id UUID,
  p_from_date DATE DEFAULT CURRENT_DATE
) RETURNS DATE AS $$
DECLARE
  v_protocol RECORD;
  v_last_injection_date DATE;
  v_next_date DATE;
BEGIN
  -- Get protocol details
  SELECT * INTO v_protocol FROM protocols WHERE id = p_protocol_id;

  IF v_protocol IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get last injection date for this protocol
  SELECT MAX(date_time::DATE) INTO v_last_injection_date
  FROM injections
  WHERE protocol_id = p_protocol_id;

  -- If no injections yet, use start date
  IF v_last_injection_date IS NULL THEN
    v_last_injection_date := v_protocol.start_date;
  END IF;

  -- Calculate next date based on schedule type
  IF v_protocol.schedule_type = 'every_x_days' THEN
    v_next_date := v_last_injection_date + v_protocol.frequency_days;
  ELSIF v_protocol.schedule_type = 'weekly' THEN
    -- For weekly schedules, find next occurrence of any day in weekly_days array
    -- This is simplified; production would need more complex logic
    v_next_date := v_last_injection_date + 7;
  ELSE
    -- Custom schedules would need custom logic
    v_next_date := v_last_injection_date + 1;
  END IF;

  RETURN v_next_date;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE protocols IS 'Dosing schedules and protocols for medications';
COMMENT ON COLUMN protocols.schedule_type IS 'Type of schedule: every_x_days, weekly, or custom';
COMMENT ON COLUMN protocols.frequency_days IS 'Days between doses for every_x_days schedule';
COMMENT ON COLUMN protocols.weekly_days IS 'Array of weekday numbers (0=Sun, 6=Sat) for weekly schedule';
COMMENT ON COLUMN protocols.custom_schedule IS 'Custom JSON recurrence rules for complex schedules';
COMMENT ON COLUMN protocols.site_rotation IS 'Array of injection sites to rotate through (e.g., ["left_glute", "right_glute"])';
COMMENT ON COLUMN protocols.supersedes_id IS 'ID of previous protocol version if this is an update';
COMMENT ON FUNCTION calculate_next_injection_date IS 'Calculate the next scheduled injection date for a protocol';
