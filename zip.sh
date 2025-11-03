#!/bin/bash

OUTPUT="project-debug-$(date +%Y%m%d-%H%M%S).zip"

zip -r "$OUTPUT" \
  app/ \
  components/ \
  lib/ \
  public/ \
  package.json \
  package-lock.json \
  tsconfig.json \
  next.config.ts \
  tailwind.config.ts \
  postcss.config.mjs \
  .env.local \
  README.md \
  -x "*/node_modules/*" "*/.next/*" "*.git/*" "*.log" "*/.env.local"

echo "Created: $OUTPUT"