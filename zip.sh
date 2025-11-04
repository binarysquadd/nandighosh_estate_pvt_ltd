#!/bin/bash

OUTPUT="project-debug-$(date +%Y%m%d-%H%M%S).zip"

zip -r "$OUTPUT" \
  app/ \
  components/ \
  functions/ \
  hooks/ \
  lib/ \
  public/ \
  package.json \
  package-lock.json \
  tsconfig.json \
  next.config.ts \
  tailwind.config.ts \
  postcss.config.mjs \
  .env.sample.local \
  global.d.ts \
  -x "*/node_modules/*" "*/.next/*" "*.git/*" "*.log" "*/.env.local"

echo "Created: $OUTPUT"