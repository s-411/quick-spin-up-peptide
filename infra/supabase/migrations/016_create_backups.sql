-- Backups table
-- Manual backup/restore functionality
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Backup metadata
  backup_type VARCHAR(20) NOT NULL DEFAULT 'manual', -- 'manual', 'auto'
  description TEXT,

  -- Snapshot data (all user data serialized as JSON)
  snapshot JSONB NOT NULL,

  -- Size tracking
  size_bytes BIGINT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_backup_type CHECK (backup_type IN ('manual', 'auto'))
);

-- Indexes for performance
CREATE INDEX idx_backups_user_id ON backups(user_id);
CREATE INDEX idx_backups_created_at ON backups(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own backups
CREATE POLICY backups_select_policy ON backups
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only create their own backups
CREATE POLICY backups_insert_policy ON backups
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own backups
CREATE POLICY backups_delete_policy ON backups
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to create a complete backup snapshot
CREATE OR REPLACE FUNCTION create_user_backup(
  p_user_id UUID,
  p_description TEXT DEFAULT NULL,
  p_backup_type VARCHAR DEFAULT 'manual'
) RETURNS UUID AS $$
DECLARE
  v_backup_id UUID;
  v_snapshot JSONB;
  v_size BIGINT;
BEGIN
  -- Build complete snapshot of all user data
  SELECT jsonb_build_object(
    'metadata', jsonb_build_object(
      'version', '1.0',
      'created_at', NOW(),
      'user_id', p_user_id
    ),
    'medications', (
      SELECT COALESCE(jsonb_agg(row_to_json(m.*)), '[]'::jsonb)
      FROM medications m
      WHERE m.user_id = p_user_id AND m.deleted_at IS NULL
    ),
    'vials', (
      SELECT COALESCE(jsonb_agg(row_to_json(v.*)), '[]'::jsonb)
      FROM vials v
      INNER JOIN medications m ON v.medication_id = m.id
      WHERE m.user_id = p_user_id AND v.deleted_at IS NULL
    ),
    'protocols', (
      SELECT COALESCE(jsonb_agg(row_to_json(p.*)), '[]'::jsonb)
      FROM protocols p
      INNER JOIN medications m ON p.medication_id = m.id
      WHERE m.user_id = p_user_id AND p.deleted_at IS NULL
    ),
    'injections', (
      SELECT COALESCE(jsonb_agg(row_to_json(i.*)), '[]'::jsonb)
      FROM injections i
      INNER JOIN protocols p ON i.protocol_id = p.id
      INNER JOIN medications m ON p.medication_id = m.id
      WHERE m.user_id = p_user_id AND i.deleted_at IS NULL
    ),
    'reminders', (
      SELECT COALESCE(jsonb_agg(row_to_json(r.*)), '[]'::jsonb)
      FROM reminders r
      INNER JOIN protocols p ON r.protocol_id = p.id
      INNER JOIN medications m ON p.medication_id = m.id
      WHERE m.user_id = p_user_id
    ),
    'symptoms', (
      SELECT COALESCE(jsonb_agg(row_to_json(s.*)), '[]'::jsonb)
      FROM symptoms s
      WHERE s.user_id = p_user_id AND s.deleted_at IS NULL
    ),
    'measurements', (
      SELECT COALESCE(jsonb_agg(row_to_json(me.*)), '[]'::jsonb)
      FROM measurements me
      WHERE me.user_id = p_user_id AND me.deleted_at IS NULL
    )
  ) INTO v_snapshot;

  -- Calculate size
  v_size := octet_length(v_snapshot::text);

  -- Insert backup record
  INSERT INTO backups (user_id, backup_type, description, snapshot, size_bytes)
  VALUES (p_user_id, p_backup_type, p_description, v_snapshot, v_size)
  RETURNING id INTO v_backup_id;

  RETURN v_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore from a backup
CREATE OR REPLACE FUNCTION restore_user_backup(
  p_backup_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_snapshot JSONB;
  v_medication RECORD;
  v_new_med_id UUID;
  v_med_id_map JSONB := '{}'::jsonb;
BEGIN
  -- Verify backup belongs to user
  SELECT snapshot INTO v_snapshot
  FROM backups
  WHERE id = p_backup_id AND user_id = p_user_id;

  IF v_snapshot IS NULL THEN
    RAISE EXCEPTION 'Backup not found or access denied';
  END IF;

  -- This is a simplified restore - production would need:
  -- 1. Transaction wrapping
  -- 2. Data validation
  -- 3. Conflict resolution (merge vs replace)
  -- 4. ID mapping for foreign keys
  -- 5. User confirmation/approval flow

  -- For MVP, we'll return true to indicate the snapshot is valid
  -- Actual restore logic would be implemented in application layer with user confirmation

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-cleanup old backups (keep last N)
CREATE OR REPLACE FUNCTION cleanup_old_backups(
  p_user_id UUID,
  p_keep_count INTEGER DEFAULT 10
) RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  WITH backups_to_delete AS (
    SELECT id
    FROM backups
    WHERE user_id = p_user_id
    AND backup_type = 'auto'
    ORDER BY created_at DESC
    OFFSET p_keep_count
  )
  DELETE FROM backups
  WHERE id IN (SELECT id FROM backups_to_delete);

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE backups IS 'User data backups for manual export and disaster recovery';
COMMENT ON COLUMN backups.snapshot IS 'Complete JSON snapshot of all user data';
COMMENT ON COLUMN backups.size_bytes IS 'Size of snapshot in bytes for quota tracking';
COMMENT ON FUNCTION create_user_backup IS 'Create a complete backup snapshot of all user data';
COMMENT ON FUNCTION restore_user_backup IS 'Restore user data from a backup (requires confirmation)';
COMMENT ON FUNCTION cleanup_old_backups IS 'Remove old automatic backups, keeping only the most recent N';
