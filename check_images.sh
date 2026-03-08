#!/bin/bash
# Check all Unsplash image URLs in index.html and replace broken ones
# Uses node for safe JSON-aware replacement instead of sed

FILE="$(dirname "$0")/index.html"

echo "Checking all image URLs in index.html..."
echo "==========================================="

# Extract all unique image URLs
URLS=$(grep -oE 'https://images\.unsplash\.com/photo-[^"]+' "$FILE" | sort -u)
TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Found $TOTAL unique image URLs to check."
echo ""

declare -a BROKEN
CHECKED=0

for URL in $URLS; do
  CHECKED=$((CHECKED + 1))
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$URL")
  SHORT_ID=$(echo "$URL" | grep -oE 'photo-[^?]+')

  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
    echo "  [$CHECKED/$TOTAL] OK ($HTTP_CODE)  $SHORT_ID"
  else
    echo "  [$CHECKED/$TOTAL] BROKEN ($HTTP_CODE)  $SHORT_ID"
    BROKEN+=("$URL")
  fi
done

echo ""
echo "==========================================="
echo "Results: $((TOTAL - ${#BROKEN[@]})) OK, ${#BROKEN[@]} broken out of $TOTAL"

if [ ${#BROKEN[@]} -eq 0 ]; then
  echo "All images are valid! No replacements needed."
  exit 0
fi

echo ""
echo "Replacing broken URLs with working alternatives..."

# Pool of known working Unsplash food image URLs
REPLACEMENTS=(
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1543339308-d595c4e462ba?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&h=400&fit=crop"
  "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&h=400&fit=crop"
)

# Verify replacement URLs
WORKING_REPLACEMENTS=()
echo "Verifying replacement pool..."
for RURL in "${REPLACEMENTS[@]}"; do
  RC=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$RURL")
  if [ "$RC" -ge 200 ] && [ "$RC" -lt 400 ]; then
    WORKING_REPLACEMENTS+=("$RURL")
  fi
done
echo "  ${#WORKING_REPLACEMENTS[@]} working replacement URLs available."

if [ ${#WORKING_REPLACEMENTS[@]} -eq 0 ]; then
  echo "ERROR: No working replacement URLs found. Check your internet connection."
  exit 1
fi

# Use node for safe string replacement (avoids sed partial-match issues)
REPLACED=0
for BURL in "${BROKEN[@]}"; do
  RIDX=$((REPLACED % ${#WORKING_REPLACEMENTS[@]}))
  REPLACEMENT="${WORKING_REPLACEMENTS[$RIDX]}"

  node -e "
    const fs = require('fs');
    const file = fs.readFileSync('$FILE', 'utf8');
    const updated = file.split($(printf '%q' "\"$BURL\"")).join($(printf '%q' "\"$REPLACEMENT\""));
    fs.writeFileSync('$FILE', updated);
  "

  REPLACED=$((REPLACED + 1))
  SHORT_OLD=$(echo "$BURL" | grep -oE 'photo-[^?]+')
  SHORT_NEW=$(echo "$REPLACEMENT" | grep -oE 'photo-[^?]+')
  echo "  Replaced $SHORT_OLD -> $SHORT_NEW"
done

echo ""
echo "Done! Replaced $REPLACED broken image URL(s) in index.html."
