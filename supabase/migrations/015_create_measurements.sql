-- Measurements table
-- Track body measurements and lab results over time
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Measurement details
  measurement_type VARCHAR(50) NOT NULL, -- 'weight', 'body_fat', 'waist', 'blood_pressure', 'testosterone', 'estradiol', etc.
  value DECIMAL(10, 4) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- 'lbs', 'kg', 'in', 'cm', 'mmHg', 'ng/dL', '%', etc.

  -- For compound measurements like blood pressure (120/80)
  secondary_value DECIMAL(10, 4), -- e.g., diastolic BP

  notes TEXT,

  -- Lab work tracking
  lab_name VARCHAR(255), -- Name of lab if applicable
  test_date DATE, -- Actual test date if different from entry date

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete

  CONSTRAINT valid_measurement_type CHECK (measurement_type IN (
    'weight', 'body_fat', 'waist', 'chest', 'arms', 'thighs',
    'blood_pressure', 'resting_heart_rate',
    'testosterone_total', 'testosterone_free', 'estradiol', 'shbg', 'lh', 'fsh',
    'hematocrit', 'hemoglobin', 'psa',
    'glucose', 'hba1c',
    'hdl', 'ldl', 'triglycerides', 'total_cholesterol',
    'alt', 'ast', 'creatinine', 'egfr'
  ))
);

-- Indexes for performance
CREATE INDEX idx_measurements_user_id ON measurements(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_measurements_date_time ON measurements(date_time DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_measurements_user_date ON measurements(user_id, date_time DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_measurements_type ON measurements(measurement_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_measurements_user_type_date ON measurements(user_id, measurement_type, date_time DESC) WHERE deleted_at IS NULL;

-- Row Level Security (RLS)
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own measurements
CREATE POLICY measurements_select_policy ON measurements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own measurements
CREATE POLICY measurements_insert_policy ON measurements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own measurements
CREATE POLICY measurements_update_policy ON measurements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own measurements
CREATE POLICY measurements_delete_policy ON measurements
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_measurements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER measurements_updated_at_trigger
  BEFORE UPDATE ON measurements
  FOR EACH ROW
  EXECUTE FUNCTION update_measurements_updated_at();

-- Function to get measurement trend (slope)
CREATE OR REPLACE FUNCTION get_measurement_trend(
  p_user_id UUID,
  p_measurement_type VARCHAR,
  p_start_date DATE DEFAULT CURRENT_DATE - 90,
  p_end_date DATE DEFAULT CURRENT_DATE
) RETURNS JSONB AS $$
DECLARE
  v_first_value DECIMAL;
  v_last_value DECIMAL;
  v_first_date DATE;
  v_last_date DATE;
  v_avg DECIMAL;
  v_count INTEGER;
  v_change DECIMAL;
  v_change_percent DECIMAL;
BEGIN
  -- Get first and last measurements
  SELECT value, date_time::DATE INTO v_first_value, v_first_date
  FROM measurements
  WHERE user_id = p_user_id
  AND measurement_type = p_measurement_type
  AND date_time::DATE >= p_start_date
  AND deleted_at IS NULL
  ORDER BY date_time ASC
  LIMIT 1;

  SELECT value, date_time::DATE INTO v_last_value, v_last_date
  FROM measurements
  WHERE user_id = p_user_id
  AND measurement_type = p_measurement_type
  AND date_time::DATE <= p_end_date
  AND deleted_at IS NULL
  ORDER BY date_time DESC
  LIMIT 1;

  -- Calculate statistics
  SELECT AVG(value), COUNT(*) INTO v_avg, v_count
  FROM measurements
  WHERE user_id = p_user_id
  AND measurement_type = p_measurement_type
  AND date_time::DATE BETWEEN p_start_date AND p_end_date
  AND deleted_at IS NULL;

  -- Calculate change
  IF v_first_value IS NOT NULL AND v_last_value IS NOT NULL AND v_first_value != 0 THEN
    v_change := v_last_value - v_first_value;
    v_change_percent := (v_change / v_first_value) * 100;
  END IF;

  RETURN jsonb_build_object(
    'first_value', v_first_value,
    'last_value', v_last_value,
    'first_date', v_first_date,
    'last_date', v_last_date,
    'average', v_avg,
    'count', v_count,
    'change', v_change,
    'change_percent', v_change_percent,
    'trend', CASE
      WHEN v_change > 0 THEN 'increasing'
      WHEN v_change < 0 THEN 'decreasing'
      ELSE 'stable'
    END
  );
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE measurements IS 'Body measurements and lab results tracking over time';
COMMENT ON COLUMN measurements.measurement_type IS 'Type of measurement (weight, labs, body composition, etc.)';
COMMENT ON COLUMN measurements.secondary_value IS 'Secondary value for compound measurements (e.g., diastolic BP)';
COMMENT ON COLUMN measurements.test_date IS 'Actual test/lab date if different from entry date';
COMMENT ON FUNCTION get_measurement_trend IS 'Calculate trend statistics for a measurement type over a date range';
