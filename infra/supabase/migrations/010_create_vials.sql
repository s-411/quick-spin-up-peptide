-- Vials table
-- Tracks individual vials with concentration and remaining volume
CREATE TABLE IF NOT EXISTS vials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  concentration_value DECIMAL(10, 4) NOT NULL, -- e.g., 5.0 for "5 mg/mL"
  concentration_units VARCHAR(20) NOT NULL, -- e.g., 'mg/mL', 'IU/mL'
  total_volume DECIMAL(10, 4) NOT NULL, -- Total mL in vial
  remaining_volume DECIMAL(10, 4) NOT NULL, -- Remaining mL (decrements with each injection)
  expiration_date DATE,
  batch_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete

  CONSTRAINT positive_concentration CHECK (concentration_value > 0),
  CONSTRAINT positive_total_volume CHECK (total_volume > 0),
  CONSTRAINT valid_remaining_volume CHECK (remaining_volume >= 0 AND remaining_volume <= total_volume),
  CONSTRAINT valid_concentration_units CHECK (concentration_units IN ('mg/mL', 'IU/mL', 'mcg/mL', 'units/mL'))
);

-- Index for faster medication queries
CREATE INDEX idx_vials_medication_id ON vials(medication_id) WHERE deleted_at IS NULL;

-- Index for tracking active vials (not expired, has remaining volume)
CREATE INDEX idx_vials_active ON vials(medication_id, remaining_volume, expiration_date)
  WHERE deleted_at IS NULL AND remaining_volume > 0;

-- Row Level Security (RLS)
ALTER TABLE vials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see vials for their medications
CREATE POLICY vials_select_policy ON vials
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = vials.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Policy: Users can insert vials for their medications
CREATE POLICY vials_insert_policy ON vials
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = vials.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Policy: Users can update vials for their medications
CREATE POLICY vials_update_policy ON vials
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = vials.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Policy: Users can delete vials for their medications
CREATE POLICY vials_delete_policy ON vials
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM medications
      WHERE medications.id = vials.medication_id
      AND medications.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vials_updated_at_trigger
  BEFORE UPDATE ON vials
  FOR EACH ROW
  EXECUTE FUNCTION update_vials_updated_at();

-- Function to calculate remaining doses in a vial
CREATE OR REPLACE FUNCTION calculate_remaining_doses(
  p_vial_id UUID,
  p_dose_volume DECIMAL
) RETURNS INTEGER AS $$
DECLARE
  v_remaining_volume DECIMAL;
BEGIN
  SELECT remaining_volume INTO v_remaining_volume
  FROM vials
  WHERE id = p_vial_id;

  IF v_remaining_volume IS NULL OR p_dose_volume <= 0 THEN
    RETURN 0;
  END IF;

  RETURN FLOOR(v_remaining_volume / p_dose_volume);
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE vials IS 'Individual vial tracking with concentration and volume management';
COMMENT ON COLUMN vials.concentration_value IS 'Numeric value of concentration (e.g., 5 for "5 mg/mL")';
COMMENT ON COLUMN vials.concentration_units IS 'Units of concentration (e.g., mg/mL, IU/mL)';
COMMENT ON COLUMN vials.remaining_volume IS 'Current remaining volume in mL, decrements with each injection';
COMMENT ON FUNCTION calculate_remaining_doses IS 'Calculate how many full doses remain in a vial given dose volume';
