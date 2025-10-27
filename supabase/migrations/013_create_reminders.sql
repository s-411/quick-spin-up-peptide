-- Reminders table
-- Manages scheduled notifications for injections
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  injection_id UUID REFERENCES injections(id) ON DELETE SET NULL, -- Links to completed injection if applicable

  -- Scheduling
  next_due_date DATE NOT NULL,
  next_due_time TIME, -- Optional specific time

  -- Recurrence (derived from protocol but stored for efficiency)
  recurrence_rule JSONB, -- Stores schedule details for quick lookups

  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'completed', 'snoozed', 'cancelled'

  -- Snooze functionality
  snoozed_until TIMESTAMP WITH TIME ZONE,

  -- Notification details
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  notification_method VARCHAR(50), -- 'email', 'push', 'sms' (future)

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_reminder_status CHECK (status IN ('pending', 'sent', 'completed', 'snoozed', 'cancelled'))
);

-- Indexes for performance
CREATE INDEX idx_reminders_protocol_id ON reminders(protocol_id);
CREATE INDEX idx_reminders_next_due_date ON reminders(next_due_date, status) WHERE status = 'pending';
CREATE INDEX idx_reminders_status ON reminders(status);

-- Row Level Security (RLS)
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see reminders for their protocols
CREATE POLICY reminders_select_policy ON reminders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = reminders.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can insert reminders for their protocols
CREATE POLICY reminders_insert_policy ON reminders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = reminders.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can update their reminders
CREATE POLICY reminders_update_policy ON reminders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = reminders.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Policy: Users can delete their reminders
CREATE POLICY reminders_delete_policy ON reminders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      INNER JOIN medications m ON m.id = p.medication_id
      WHERE p.id = reminders.protocol_id
      AND m.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reminders_updated_at_trigger
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_reminders_updated_at();

-- Function to generate reminders for a protocol
CREATE OR REPLACE FUNCTION generate_protocol_reminders(
  p_protocol_id UUID,
  p_days_ahead INTEGER DEFAULT 30
) RETURNS INTEGER AS $$
DECLARE
  v_protocol RECORD;
  v_next_date DATE;
  v_count INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_end_date DATE;
BEGIN
  -- Get protocol details
  SELECT * INTO v_protocol FROM protocols WHERE id = p_protocol_id AND is_active = TRUE;

  IF v_protocol IS NULL THEN
    RETURN 0;
  END IF;

  v_end_date := CURRENT_DATE + p_days_ahead;

  -- Start from the next calculated injection date
  v_next_date := calculate_next_injection_date(p_protocol_id);

  -- Generate reminders for the specified period
  WHILE v_next_date IS NOT NULL AND v_next_date <= v_end_date LOOP
    -- Insert reminder if it doesn't already exist
    INSERT INTO reminders (protocol_id, next_due_date, recurrence_rule, status)
    VALUES (
      p_protocol_id,
      v_next_date,
      jsonb_build_object(
        'schedule_type', v_protocol.schedule_type,
        'frequency_days', v_protocol.frequency_days
      ),
      'pending'
    )
    ON CONFLICT DO NOTHING;

    v_count := v_count + 1;

    -- Calculate next occurrence
    IF v_protocol.schedule_type = 'every_x_days' THEN
      v_next_date := v_next_date + v_protocol.frequency_days;
    ELSIF v_protocol.schedule_type = 'weekly' THEN
      v_next_date := v_next_date + 7;
    ELSE
      EXIT; -- Exit for custom schedules (would need custom logic)
    END IF;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to mark reminder as completed when injection is logged
CREATE OR REPLACE FUNCTION complete_reminder_on_injection()
RETURNS TRIGGER AS $$
DECLARE
  v_reminder_id UUID;
BEGIN
  -- Find the most recent pending reminder for this protocol around the injection date
  SELECT id INTO v_reminder_id
  FROM reminders
  WHERE protocol_id = NEW.protocol_id
  AND status = 'pending'
  AND next_due_date BETWEEN (NEW.date_time::DATE - 1) AND (NEW.date_time::DATE + 1)
  ORDER BY ABS(EXTRACT(EPOCH FROM (next_due_date - NEW.date_time::DATE)))
  LIMIT 1;

  -- Mark reminder as completed
  IF v_reminder_id IS NOT NULL THEN
    UPDATE reminders
    SET status = 'completed',
        injection_id = NEW.id
    WHERE id = v_reminder_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER injections_complete_reminder_trigger
  AFTER INSERT ON injections
  FOR EACH ROW
  EXECUTE FUNCTION complete_reminder_on_injection();

-- Comments for documentation
COMMENT ON TABLE reminders IS 'Scheduled reminders for upcoming injections';
COMMENT ON COLUMN reminders.status IS 'Status: pending, sent, completed, snoozed, or cancelled';
COMMENT ON COLUMN reminders.recurrence_rule IS 'Cached schedule details from protocol for efficient queries';
COMMENT ON FUNCTION generate_protocol_reminders IS 'Generate reminders for a protocol for the next N days';
