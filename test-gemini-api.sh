#!/bin/bash

# Test Gemini API Key
# This script tests if your Gemini API key is working correctly

API_KEY="AIzaSyBcx6atnZF4j_6dlpPcqh8Lj7luVlELsnQ"

echo "Testing Gemini API..."
echo "API Key: ${API_KEY:0:10}..."
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST \
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{"text": "Say hello in one word"}]
    }]
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status Code: $http_code"
echo ""

if [ "$http_code" = "200" ]; then
  echo "✅ SUCCESS! API key is working!"
  echo ""
  echo "Response:"
  echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
  echo "❌ ERROR! API call failed."
  echo ""
  echo "Response:"
  echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check if your API key is valid at: https://makersuite.google.com/app/apikey"
  echo "2. Verify the key hasn't expired or been revoked"
  echo "3. Check if you've hit rate limits (15 requests/minute)"
  echo "4. Try generating a new API key"
fi
