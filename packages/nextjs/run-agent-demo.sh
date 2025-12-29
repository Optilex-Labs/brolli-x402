#!/bin/bash
# x402 Agent Demo Runner
# This script runs the agent purchase demo with all environment variables set

# Check if environment is set up
if [ -z "$AGENT_PRIVATE_KEY" ]; then
    echo "❌ Environment not set up!"
    echo "Run: source ./setup-agent-env.sh"
    exit 1
fi

echo "🤖 Starting x402 Agent Purchase Demo"
echo "===================================="
echo ""

# Run the agent purchase script
yarn ts-node scripts/agent-purchase.ts

echo ""
echo "✅ Demo complete!"
echo ""


