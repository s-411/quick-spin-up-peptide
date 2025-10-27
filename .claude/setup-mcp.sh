#!/bin/bash

# Supabase MCP Setup Script
# This script helps configure the Supabase MCP server for Claude Code

set -e

echo "🚀 Setting up Supabase MCP Configuration"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f "starter-app/.env.local" ]; then
    echo "❌ Error: starter-app/.env.local not found"
    echo "Please create this file with your Supabase credentials first."
    exit 1
fi

# Source the environment variables
set -a
source starter-app/.env.local
set +a

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Required Supabase environment variables not found in .env.local"
    echo ""
    echo "Please ensure the following are set:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Check if mcp.json already exists
if [ -f ".claude/mcp.json" ]; then
    echo "⚠️  Warning: .claude/mcp.json already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create the mcp.json file
cat > .claude/mcp.json << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest"
      ],
      "env": {
        "SUPABASE_URL": "$NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_ANON_KEY": "$NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY": "$SUPABASE_SERVICE_ROLE_KEY"
      }
    }
  }
}
EOF

echo "✅ MCP configuration created successfully!"
echo ""
echo "📝 Next steps:"
echo "  1. Restart Claude Code to load the new MCP configuration"
echo "  2. Claude Code will now have access to your Supabase database schema"
echo "  3. You can ask Claude to help with database queries, migrations, and schema design"
echo ""
echo "⚠️  Security reminder:"
echo "  - This configuration uses your development database credentials"
echo "  - Never use production credentials with MCP"
echo "  - The mcp.json file is in .gitignore and won't be committed"
echo ""
echo "🎉 Setup complete!"
