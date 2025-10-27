# Supabase MCP Configuration

This directory contains the Model Context Protocol (MCP) configuration for integrating Supabase with Claude Code and other AI assistants.

## What is MCP?

Model Context Protocol (MCP) is a standard that allows Large Language Models (LLMs) to communicate with external services like Supabase. It enables AI assistants to:

- Query your database schema and tables
- Fetch project configuration
- Execute read operations on your data
- Help with database design and migrations

## Configuration

The `mcp.json` file configures the Supabase MCP server with your project credentials.

### Environment Variables

The MCP server uses these environment variables from your `.env.local` file:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (use with caution)

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Development Only**: This MCP server should only be used with development/testing databases, not production data
2. **Data Safety**: Ensure your development database contains non-production or obfuscated data
3. **Read-Only Mode**: Consider configuring the server in read-only mode for additional safety
4. **Credentials**: Never commit actual credentials to version control - use environment variables

## Usage with Claude Code

Once configured, Claude Code will have access to:
- Database schema information
- Table structures and relationships
- Migration files in `infra/supabase/migrations/`
- Ability to help design and optimize database queries

## Restarting MCP

If you make changes to the MCP configuration:
1. Restart Claude Code
2. The MCP server will automatically reconnect with the new configuration

## Troubleshooting

If the MCP server isn't working:
1. Check that Node.js 22+ is installed: `node --version`
2. Verify your Supabase credentials in `.env.local`
3. Ensure you're connected to the internet
4. Check the Claude Code logs for MCP connection errors

## Available Tables

Based on your current migrations, your database includes:

### Core Application Tables
- `users` - User profiles and authentication
- `subscriptions` - Stripe subscription management
- `email_subscribers` - Email marketing subscribers

### Document & RAG Tables
- `documents` - Uploaded documents for RAG
- `document_chunks` - Vector embeddings for semantic search
- `chat_sessions` - Chat conversation sessions
- `chat_messages` - Individual chat messages

### Peptide Tracker Tables
- `medications` - Peptide medications
- `vials` - Medication vials and inventory
- `protocols` - Treatment protocols
- `injections` - Injection logs
- `reminders` - Medication reminders
- `symptoms` - Symptom tracking
- `measurements` - Body measurements
- `backups` - Data backup tracking
- `ai_context` - AI context view for comprehensive data access

## Learn More

- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [GitHub: supabase-community/supabase-mcp](https://github.com/supabase-community/supabase-mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
