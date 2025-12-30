#!/bin/bash

echo "🧪 Testing Brolli Risk Assessment API"
echo "======================================"
echo ""

# Test GET endpoint
echo "1️⃣ Testing GET /api/risk/assess (list verticals)"
curl -s http://localhost:3000/api/risk/assess | jq '.' || echo "Error: Make sure server is running (yarn dev)"
echo ""
echo ""

# Test POST endpoint - Payments
echo "2️⃣ Testing POST /api/risk/assess (payments vertical)"
curl -s -X POST http://localhost:3000/api/risk/assess \
  -H "Content-Type: application/json" \
  -d '{
    "vertical": "payments",
    "useCases": ["stablecoin"],
    "description": "USDC payment processor"
  }' | jq '.'
echo ""
echo ""

# Test POST endpoint - Lending
echo "3️⃣ Testing POST /api/risk/assess (lending vertical)"
curl -s -X POST http://localhost:3000/api/risk/assess \
  -H "Content-Type: application/json" \
  -d '{
    "vertical": "lending",
    "useCases": ["collateralizedLoans"],
    "description": "Collateralized DeFi lending"
  }' | jq '.'
echo ""
echo ""

# Test POST endpoint - RWA
echo "4️⃣ Testing POST /api/risk/assess (RWA vertical)"
curl -s -X POST http://localhost:3000/api/risk/assess \
  -H "Content-Type: application/json" \
  -d '{
    "vertical": "rwa",
    "useCases": ["securities"],
    "description": "Tokenized securities platform"
  }' | jq '.'
echo ""
echo ""

echo "✅ API tests complete!"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:3000/agents to test the risk calculator widget"
echo "2. Visit http://localhost:3000/agents/docs to see the API documentation"
echo "3. Try purchasing a license at http://localhost:3000/agents/purchase"

