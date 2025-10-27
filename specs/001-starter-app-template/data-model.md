# Data Model: Starter App Template Infrastructure

**Feature**: Starter App Template Infrastructure
**Date**: 2025-10-22
**Phase**: Phase 1 Design

## Entity Definitions

### User Account
Represents authenticated users with profile data, subscription status, and preferences.

**Fields**:
- `id` (UUID, primary key) - Unique user identifier
- `email` (string, unique) - User's email address for authentication
- `created_at` (timestamp) - Account creation timestamp
- `updated_at` (timestamp) - Last profile update timestamp
- `first_name` (string, optional) - User's first name
- `last_name` (string, optional) - User's last name
- `avatar_url` (string, optional) - Profile picture URL
- `email_verified` (boolean, default: false) - Email verification status
- `subscription_status` (enum) - Current subscription state
- `subscription_id` (string, optional) - Stripe subscription ID
- `theme_preference` (enum, default: 'system') - UI theme preference
- `onboarding_completed` (boolean, default: false) - Onboarding flow completion

**Validation Rules**:
- Email must be valid format and unique
- First/last name max 50 characters each
- Avatar URL must be valid HTTPS URL
- Subscription status: 'free', 'active', 'past_due', 'canceled', 'trialing'
- Theme preference: 'light', 'dark', 'system'

**Relationships**:
- One-to-many with Documents (user can upload multiple documents)
- One-to-many with Chat Sessions (user can have multiple chat conversations)
- One-to-one with Subscription (billing relationship)

### Document
Represents uploaded documents for RAG processing and Q&A functionality.

**Fields**:
- `id` (UUID, primary key) - Unique document identifier
- `user_id` (UUID, foreign key) - Owner of the document
- `title` (string) - Document title or filename
- `file_name` (string) - Original uploaded filename
- `file_size` (integer) - File size in bytes
- `file_type` (string) - MIME type (PDF, text, markdown)
- `storage_path` (string) - Supabase Storage file path
- `upload_status` (enum) - Processing status
- `processing_status` (enum) - RAG processing status
- `chunk_count` (integer, default: 0) - Number of text chunks created
- `created_at` (timestamp) - Upload timestamp
- `updated_at` (timestamp) - Last processing update
- `metadata` (jsonb, optional) - Additional document metadata

**Validation Rules**:
- Title max 255 characters
- File size max 10MB for template (configurable)
- File type restricted to: 'application/pdf', 'text/plain', 'text/markdown'
- Upload status: 'uploading', 'uploaded', 'failed'
- Processing status: 'pending', 'processing', 'completed', 'failed'

**Relationships**:
- Many-to-one with User Account (document belongs to user)
- One-to-many with Document Chunks (document split into chunks)
- One-to-many with Chat Sessions (conversations about this document)

### Document Chunk
Represents text segments from documents used for vector embedding and retrieval.

**Fields**:
- `id` (UUID, primary key) - Unique chunk identifier
- `document_id` (UUID, foreign key) - Parent document
- `chunk_index` (integer) - Order within document (0-based)
- `content` (text) - Actual text content of the chunk
- `token_count` (integer) - Number of tokens in content
- `page_number` (integer, optional) - Source page for PDFs
- `embedding` (vector(1536)) - OpenAI text-embedding-3-small vector
- `metadata` (jsonb, optional) - Additional chunk metadata
- `created_at` (timestamp) - Chunk creation timestamp

**Validation Rules**:
- Content max 2000 characters (chunking strategy)
- Token count must be positive integer
- Page number must be positive if specified
- Embedding dimension must be 1536 (OpenAI standard)

**Relationships**:
- Many-to-one with Document (chunk belongs to document)
- One-to-many with Chat Message Sources (chunks referenced in answers)

### Chat Session
Represents Q&A conversation sessions between user and RAG chatbot.

**Fields**:
- `id` (UUID, primary key) - Unique session identifier
- `user_id` (UUID, foreign key) - Session owner
- `document_id` (UUID, foreign key, optional) - Associated document for Q&A
- `title` (string) - Session title (auto-generated or user-set)
- `status` (enum, default: 'active') - Session status
- `created_at` (timestamp) - Session start timestamp
- `updated_at` (timestamp) - Last message timestamp
- `message_count` (integer, default: 0) - Total messages in session
- `settings` (jsonb, optional) - Session-specific settings

**Validation Rules**:
- Title max 100 characters
- Status: 'active', 'archived', 'deleted'
- Message count must be non-negative

**Relationships**:
- Many-to-one with User Account (session belongs to user)
- Many-to-one with Document (session may focus on specific document)
- One-to-many with Chat Messages (conversation messages)

### Chat Message
Represents individual messages within chat sessions (both user questions and AI responses).

**Fields**:
- `id` (UUID, primary key) - Unique message identifier
- `session_id` (UUID, foreign key) - Parent chat session
- `role` (enum) - Message sender role
- `content` (text) - Message content
- `token_count` (integer, optional) - Token count for cost tracking
- `source_chunks` (UUID[], optional) - Referenced document chunks for AI responses
- `model_used` (string, optional) - AI model identifier for responses
- `processing_time_ms` (integer, optional) - Response generation time
- `created_at` (timestamp) - Message timestamp
- `metadata` (jsonb, optional) - Additional message metadata

**Validation Rules**:
- Role: 'user', 'assistant', 'system'
- Content max 10000 characters
- Token count must be positive if specified
- Processing time must be positive if specified

**Relationships**:
- Many-to-one with Chat Session (message belongs to session)
- Many-to-many with Document Chunks (AI responses reference source chunks)

### Subscription
Tracks user billing and subscription information through Stripe integration.

**Fields**:
- `id` (UUID, primary key) - Unique subscription record identifier
- `user_id` (UUID, foreign key) - Subscription owner
- `stripe_subscription_id` (string, unique) - Stripe subscription ID
- `stripe_customer_id` (string) - Stripe customer ID
- `status` (enum) - Current subscription status
- `plan_id` (string) - Stripe price/plan identifier
- `current_period_start` (timestamp) - Billing period start
- `current_period_end` (timestamp) - Billing period end
- `cancel_at_period_end` (boolean, default: false) - Cancellation flag
- `created_at` (timestamp) - Subscription creation timestamp
- `updated_at` (timestamp) - Last status update timestamp

**Validation Rules**:
- Stripe subscription ID must be unique and follow pattern: 'sub_*'
- Stripe customer ID must follow pattern: 'cus_*'
- Status: 'trialing', 'active', 'past_due', 'canceled', 'unpaid'
- Current period end must be after start

**Relationships**:
- One-to-one with User Account (user has one subscription)

### Email Subscriber
Tracks users subscribed to marketing email campaigns through configured email providers.

**Fields**:
- `id` (UUID, primary key) - Unique subscriber record identifier
- `user_id` (UUID, foreign key, optional) - Associated user account
- `email` (string) - Subscriber email address
- `provider` (enum) - Email service provider
- `provider_subscriber_id` (string, optional) - External provider ID
- `status` (enum, default: 'subscribed') - Subscription status
- `subscribed_at` (timestamp) - Initial subscription timestamp
- `unsubscribed_at` (timestamp, optional) - Unsubscription timestamp
- `tags` (string[], optional) - Marketing tags/segments
- `custom_fields` (jsonb, optional) - Provider-specific custom data

**Validation Rules**:
- Email must be valid format
- Provider: 'convertkit', 'mailerlite', 'brevo', 'sender'
- Status: 'subscribed', 'unsubscribed', 'bounced', 'complained'
- Tags max 10 items, each max 50 characters

**Relationships**:
- Many-to-one with User Account (subscriber may be registered user)

## State Transitions

### Document Processing Flow
1. **Upload** → `upload_status: 'uploading'`, `processing_status: 'pending'`
2. **Upload Complete** → `upload_status: 'uploaded'`, `processing_status: 'processing'`
3. **Processing Complete** → `processing_status: 'completed'`, `chunk_count > 0`
4. **Processing Failed** → `processing_status: 'failed'`

### Subscription Lifecycle
1. **Trial Start** → `status: 'trialing'`
2. **Payment Success** → `status: 'active'`
3. **Payment Failed** → `status: 'past_due'`
4. **Cancellation** → `cancel_at_period_end: true`
5. **Period End** → `status: 'canceled'` (if canceled) or renewal

### Chat Session Flow
1. **Create Session** → `status: 'active'`, `message_count: 0`
2. **Add Messages** → `message_count` increments, `updated_at` updates
3. **Archive Session** → `status: 'archived'`
4. **Delete Session** → `status: 'deleted'` (soft delete)

## Database Schema Notes

### Supabase-Specific Considerations
- All tables use Row Level Security (RLS) for multi-tenant data isolation
- User authentication handled by Supabase Auth (separate from user profile table)
- File storage uses Supabase Storage with signed URLs for secure access
- pgvector extension required for `embedding` fields in Document Chunks
- UUID v4 used for all primary keys for security and distribution

### Indexing Strategy
- User email (unique constraint)
- Document user_id and upload_status (query filtering)
- Document Chunk document_id and chunk_index (ordered retrieval)
- Document Chunk embedding (vector similarity search)
- Chat Session user_id and updated_at (recent conversations)
- Chat Message session_id and created_at (conversation history)

### Performance Considerations
- Document chunks limited to 1536-dimension vectors (OpenAI standard)
- Chat sessions auto-archive after 30 days of inactivity
- Soft deletes used for user data retention compliance
- Subscription data synchronized with Stripe webhooks for consistency