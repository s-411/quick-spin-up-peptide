-- Symptoms table
-- Optional daily symptom tracking for correlation analysis
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Symptom details
  symptom_type VARCHAR(100) NOT NULL, -- 'fatigue', 'energy', 'mood', 'libido', 'sleep_quality', 'joint_pain', etc.
  severity INTEGER NOT NULL, -- 1-5 scale

  notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete

  CONSTRAINT valid_severity CHECK (severity >= 1 AND severity <= 5)
);

-- Indexes for performance
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_symptoms_date_time ON symptoms(date_time DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_symptoms_user_date ON symptoms(user_id, date_time DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_symptoms_type ON symptoms(symptom_type) WHERE deleted_at IS NULL;

-- Row Level Security (RLS)
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own symptoms
CREATE POLICY symptoms_select_policy ON symptoms
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own symptoms
CREATE POLICY symptoms_insert_policy ON symptoms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own symptoms
CREATE POLICY symptoms_update_policy ON symptoms
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own symptoms
CREATE POLICY symptoms_delete_policy ON symptoms
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_symptoms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER symptoms_updated_at_trigger
  BEFORE UPDATE ON symptoms
  FOR EACH ROW
  EXECUTE FUNCTION update_symptoms_updated_at();

-- Function to get average symptom severity over a period
CREATE OR REPLACE FUNCTION get_avg_symptom_severity(
  p_user_id UUID,
  p_symptom_type VARCHAR,
  p_start_date DATE DEFAULT CURRENT_DATE - 30,
  p_end_date DATE DEFAULT CURRENT_DATE
) RETURNS DECIMAL AS $$
DECLARE
  v_avg DECIMAL;
BEGIN
  SELECT AVG(severity) INTO v_avg
  FROM symptoms
  WHERE user_id = p_user_id
  AND symptom_type = p_symptom_type
  AND date_time::DATE BETWEEN p_start_date AND p_end_date
  AND deleted_at IS NULL;

  RETURN COALESCE(v_avg, 0);
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE symptoms IS 'Daily symptom tracking for correlation with injection protocols';
COMMENT ON COLUMN symptoms.symptom_type IS 'Type of symptom being tracked (e.g., fatigue, energy, mood)';
COMMENT ON COLUMN symptoms.severity IS 'Severity rating from 1 (minimal) to 5 (severe)';
COMMENT ON FUNCTION get_avg_symptom_severity IS 'Calculate average severity for a symptom type over a date range';
