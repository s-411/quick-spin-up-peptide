-- Chat Message Entity Table
-- Stores individual messages in chat sessions with source citations

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]', -- Array of source chunk references
  token_count INTEGER,
  metadata JSONB DEFAULT '{}', -- Store model, temperature, finish_reason, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_role CHECK (role IN ('user', 'assistant'))
);

-- Create index on session_id for fast lookups
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Create index on user_id for filtering
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Create index on created_at for ordering
CREATE INDEX idx_chat_messages_created_at ON chat_messages(session_id, created_at);

-- Create index on role for filtering
CREATE INDEX idx_chat_messages_role ON chat_messages(role);

-- Function to update message count and last_message_at on parent session
CREATE OR REPLACE FUNCTION update_chat_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_sessions
    SET
      message_count = message_count + 1,
      last_message_at = NEW.created_at,
      -- Auto-generate title from first user message if still default
      title = CASE
        WHEN title = 'New Chat' AND NEW.role = 'user' THEN
          LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
        ELSE title
      END
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chat_sessions
    SET
      message_count = (
        SELECT COUNT(*)
        FROM chat_messages
        WHERE session_id = OLD.session_id
      ),
      last_message_at = (
        SELECT MAX(created_at)
        FROM chat_messages
        WHERE session_id = OLD.session_id
      )
    WHERE id = OLD.session_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_messages_update_session_stats
  AFTER INSERT OR DELETE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_stats();

-- Row Level Security (RLS) Policies

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own chat messages
CREATE POLICY "Users can view own chat messages"
  ON chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own chat messages
CREATE POLICY "Users can insert own chat messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat messages
CREATE POLICY "Users can update own chat messages"
  ON chat_messages
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own chat messages
CREATE POLICY "Users can delete own chat messages"
  ON chat_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_messages TO authenticated;
