#!/bin/bash
# filepath: /media/igor/Files/dev/mantra-app/mantra-frontend/build_and_deploy.sh

# Set error handling
set -e

# Print colored status messages
function echo_status() {
  echo -e "\e[1;34m[BUILD]\e[0m $1"
}

function echo_success() {
  echo -e "\e[1;32m[SUCCESS]\e[0m $1"
}

function echo_error() {
  echo -e "\e[1;31m[ERROR]\e[0m $1"
}

# Configuration
APP_NAME="mantra-app"
REPO_URL="https://github.com/igorpaiva/mantra-app.git"
BRANCH="gh-pages"
DIST_DIR="dist/${APP_NAME}/browser"
BASE_HREF="/${APP_NAME}/"

echo_status "Starting build and deploy process for ${APP_NAME}"

# Clean any previous build
echo_status "Cleaning previous build..."
rm -rf dist

# Install dependencies if needed
if [ "$1" == "--full" ]; then
  echo_status "Installing dependencies..."
  npm install
fi

# Build the application
echo_status "Building application with production configuration..."
ng build --configuration production --base-href "${BASE_HREF}"

# Check if build was successful
if [ ! -d "${DIST_DIR}" ]; then
  echo_error "Build failed! Directory ${DIST_DIR} does not exist."
  exit 1
fi

# Create a 404.html file that's identical to index.html for GitHub Pages SPA routing
echo_status "Creating 404.html for GitHub Pages SPA routing..."
cp "${DIST_DIR}/index.html" "${DIST_DIR}/404.html"

# Deploy to GitHub Pages
echo_status "Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir="${DIST_DIR}" --branch="${BRANCH}" --repo="${REPO_URL}" --message="Deploy: $(date +'%Y-%m-%d %H:%M:%S')"

# Check deployment status
if [ $? -eq 0 ]; then
  echo_success "Deployment completed successfully!"
  echo_success "Your application is now available at: https://igorpaiva.github.io${BASE_HREF}"
else
  echo_error "Deployment failed!"
  exit 1
fi

echo_status "Build and deploy process completed."