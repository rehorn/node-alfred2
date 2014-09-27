#!/bin/bash

if [ "$(uname)" == "Darwin" ]; then
  if [ -d "/Applications/Alfred 2.app" ]; then
    echo "Installing Alfred Workflow for example.alfredworkflow"
    zip -qr example.alfredworkflow *.plist *.js *.xml *.png node_modules/
    open example.alfredworkflow
  else
    echo "Error: Alfred 2 is not installed"
  fi
else
  echo "Installation works only on Mac OS X, not on $(uname)."
fi