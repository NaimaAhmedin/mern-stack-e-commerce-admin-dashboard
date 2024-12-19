#!/bin/bash

# Set the remote repository URL
REPO_URL="https://github.com/NaimaAhmedin/Markato-Ecommerce-platform-.git"

# Set the branch name
BRANCH_NAME="promotion-link-feature"

# Add all changes
git add .

# Commit changes
git commit -m "Add link functionality to promotions with comprehensive error handling"

# Add remote repository if not exists
git remote add origin "$REPO_URL" 2>/dev/null

# Create and switch to new branch
git checkout -b "$BRANCH_NAME"

# Push the new branch to GitHub
git push -u origin "$BRANCH_NAME"

echo "Successfully pushed to GitHub repository on branch $BRANCH_NAME"
