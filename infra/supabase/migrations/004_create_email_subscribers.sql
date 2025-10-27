-- Create email_subscribers table for marketing email lists
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('convertkit', 'mailerlite', 'brevo', 'sender')),
  provider_subscriber_id TEXT,
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  tags TEXT[],
  custom_fields JSONB,
  CONSTRAINT unique_email_provider UNIQUE (email, provider)
);

-- Create indexes
CREATE INDEX idx_email_subscribers_user_id ON email_subscribers(user_id);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_provider ON email_subscribers(provider);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX idx_email_subscribers_provider_subscriber_id ON email_subscribers(provider_subscriber_id);

-- Enable Row Level Security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own subscriptions"
  ON email_subscribers
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own subscriptions"
  ON email_subscribers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own subscriptions"
  ON email_subscribers
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

COMMENT ON TABLE email_subscribers IS 'Tracks email marketing subscriptions across different providers';
