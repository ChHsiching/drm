#!/bin/bash

# Define the recommended Node.js and pnpm versions
NODE_RECOMMENDED_VERSION="18.20.4"
PNPM_RECOMMENDED_VERSION="9.7.1"
PACKAGE_NAME="drm"

# Function to compare version numbers
version_gte() {
  # Check if the first version is greater than or equal to the second version
  echo -e "$1\n$2" | sort -V | head -n1 | grep -q "^$2$"
}

# Check if Node.js is installed
if ! command -v node &>/dev/null; then
  echo "Node.js is not installed."
  echo "Please install Node.js. It is recommended to use version $NODE_RECOMMENDED_VERSION or higher."
  exit 1
fi

# Get the current Node.js version
NODE_VERSION=$(node -v | sed 's/v//') # Remove the 'v' prefix
echo "Detected Node.js version: $NODE_VERSION"

# Check if Node.js version meets the recommended version
if version_gte "$NODE_VERSION" "$NODE_RECOMMENDED_VERSION"; then
  echo "Node.js version meets the recommended requirements."
else
  echo "It is recommended to upgrade Node.js to version $NODE_RECOMMENDED_VERSION or higher. Current version: $NODE_VERSION"
fi

# Check if pnpm is installed
if command -v pnpm &>/dev/null; then
  echo "pnpm is already installed."

  # Get the current pnpm version
  PNPM_VERSION=$(pnpm -v)
  echo "Detected pnpm version: $PNPM_VERSION"

  # Check if pnpm version meets the recommended version
  if version_gte "PNPM_VERSION" "$PNPM_RECOMMENDED_VERSION"; then
    echo "pnpm version meets the recommended requirements."
  else
    echo "installed version of pnpm is $PNPM_VERSION. Recommended version is $PNPM_RECOMMENDED_VERSION."
    echo "Updating pnpm is version $PNPM_RECOMMENDED_VERSION..."
    npm install -g "pnpm@$PNPM_RECOMMENDED_VERSION"
  fi
else
  echo "pnpm is not installed."
  echo "Installing pnpm version $PNPM_RECOMMENDED_VERSION..."
  npm install -g "pnpm@$PNPM_RECOMMENDED_VERSION"
fi

# Execute pnpm install to install project dependencies
echo "Installing project dependencies using pnpm..."
pnpm install

# Link the pacakge globally
echo "Linking the package globally..."
npm link
npm link drm

echo "Setup completed successfully."
