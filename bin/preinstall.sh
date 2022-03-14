#!/bin/bash

# If git is installed, run the git hook config
if git --version 2>&1 >/dev/null; then
  echo "Setting git hooks path"
  git config core.hooksPath ./bin/githooks
  exit 0
# else echo warning
else
  echo "Git is not available! Skipping git hooks path config..."
  exit 0
fi
