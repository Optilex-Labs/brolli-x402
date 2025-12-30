#!/bin/bash

# Demo script to show Brolli Risk Assessment API call
# For video recording - includes pauses for readability

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 Brolli Risk Assessment API Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
sleep 2

echo "🔍 Agent Query: Healthcare data platform risk assessment"
echo ""
sleep 2

echo "📤 Sending POST request to /api/risk/assess..."
echo ""
sleep 2

# Make the API call (localhost for demo, change to brolli.vercel.app for production)
curl -s -X POST http://localhost:3000/api/risk/assess \
  -H "Content-Type: application/json" \
  -d '{
    "vertical": "healthcare",
    "useCases": ["healthcareDataPlatform"],
    "description": "Healthcare data platform with HIPAA compliance"
  }' | jq '.'

echo ""
sleep 2

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Risk data received - Agent can now make decision"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

