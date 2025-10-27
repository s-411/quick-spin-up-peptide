-- Medications table
-- Stores user-defined medications (TRT, peptides, GLP-1s, etc.)
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'peptide', 'TRT', 'GLP-1', 'other'
  units VARCHAR(20) NOT NULL, -- 'mg', 'IU', 'mcg', 'units'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete for data integrity

  CONSTRAINT valid_medication_type CHECK (type IN ('peptide', 'TRT', 'GLP-1', 'other')),
  CONSTRAINT valid_units CHECK (units IN ('mg', 'IU', 'mcg', 'units', 'mL'))
);

-- Index for faster user queries
CREATE INDEX idx_medications_user_id ON medications(user_id) WHERE deleted_at IS NULL;

-- Row Level Security (RLS)
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own medications
CREATE POLICY medications_select_policy ON medications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own medications
CREATE POLICY medications_insert_policy ON medications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own medications
CREATE POLICY medications_update_policy ON medications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own medications
CREATE POLICY medications_delete_policy ON medications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_medications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER medications_updated_at_trigger
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_medications_updated_at();

-- Comments for documentation
COMMENT ON TABLE medications IS 'User-defined medications including hormones, peptides, and other injectables';
COMMENT ON COLUMN medications.type IS 'Category of medication: peptide, TRT, GLP-1, or other';
COMMENT ON COLUMN medications.units IS 'Unit of measurement for dosing: mg, IU, mcg, units, or mL';
COMMENT ON COLUMN medications.deleted_at IS 'Soft delete timestamp to maintain referential integrity';
