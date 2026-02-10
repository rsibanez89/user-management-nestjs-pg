#!/bin/bash

# Script to install git hooks from .githooks directory
# Run this after cloning the repository or pulling updates
# run `source ./scripts/tools/install-hooks.sh` to install the hooks

echo "📦 Installing git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy all hooks from .githooks to .git/hooks
for hook in .githooks/*; do
    if [ -f "$hook" ]; then
        hookname=$(basename "$hook")
        echo "Installing $hookname hook..."
        cp "$hook" ".git/hooks/$hookname"
        chmod +x ".git/hooks/$hookname"
    fi
done

echo "✅ Git hooks installed successfully!"
echo "📋 Installed hooks:"
ls -la .git/hooks/ | grep -v sample | grep -v "^total" | grep -v "^d"
