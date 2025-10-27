-- Document Chunk Entity Table
-- Stores chunked text with vector embeddings for semantic search

CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-ada-002 produces 1536-dimensional vectors
  chunk_index INTEGER NOT NULL, -- Position in the original document
  token_count INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}', -- Store page number, section, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_document_chunk_index UNIQUE (document_id, chunk_index)
);

-- Create index on document_id for fast lookups
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);

-- Create index on user_id for filtering
CREATE INDEX idx_document_chunks_user_id ON document_chunks(user_id);

-- Create index on chunk_index for ordering
CREATE INDEX idx_document_chunks_chunk_index ON document_chunks(document_id, chunk_index);

-- Create HNSW index for vector similarity search (cosine distance)
-- HNSW (Hierarchical Navigable Small World) is optimized for high-dimensional vectors
CREATE INDEX idx_document_chunks_embedding ON document_chunks
  USING hnsw (embedding vector_cosine_ops);

-- Alternative: Create IVFFlat index (faster build, but less accurate)
-- Uncomment if HNSW is too slow for large datasets
-- CREATE INDEX idx_document_chunks_embedding_ivfflat ON document_chunks
--   USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);

-- Function to update chunk count on parent document
CREATE OR REPLACE FUNCTION update_document_chunk_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE documents
    SET
      chunk_count = (
        SELECT COUNT(*)
        FROM document_chunks
        WHERE document_id = NEW.document_id
      ),
      total_tokens = (
        SELECT COALESCE(SUM(token_count), 0)
        FROM document_chunks
        WHERE document_id = NEW.document_id
      )
    WHERE id = NEW.document_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE documents
    SET
      chunk_count = (
        SELECT COUNT(*)
        FROM document_chunks
        WHERE document_id = OLD.document_id
      ),
      total_tokens = (
        SELECT COALESCE(SUM(token_count), 0)
        FROM document_chunks
        WHERE document_id = OLD.document_id
      )
    WHERE id = OLD.document_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_chunks_update_count
  AFTER INSERT OR DELETE ON document_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_document_chunk_count();

-- Function for vector similarity search
-- Returns chunks most similar to the query embedding
CREATE OR REPLACE FUNCTION search_document_chunks(
  query_embedding vector(1536),
  match_user_id UUID,
  match_count INT DEFAULT 10,
  similarity_threshold FLOAT DEFAULT 0.0
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  chunk_index INTEGER,
  metadata JSONB,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    dc.chunk_index,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE dc.user_id = match_user_id
    AND 1 - (dc.embedding <=> query_embedding) > similarity_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Users can view their own document chunks
CREATE POLICY "Users can view own document chunks"
  ON document_chunks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own document chunks
CREATE POLICY "Users can insert own document chunks"
  ON document_chunks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own document chunks
CREATE POLICY "Users can update own document chunks"
  ON document_chunks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own document chunks
CREATE POLICY "Users can delete own document chunks"
  ON document_chunks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON document_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION search_document_chunks TO authenticated;
