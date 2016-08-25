#!/bin/bash

echo "### npm install started ###"
npm install
echo "### npm install completed ###"
echo "### bower install started ###"
bower install
echo "### bower install completed ###"
Xvfb :99 -screen 0 1024x768x16 &> xvfb.log &
DISPLAY=:99.0
export DISPLAY
echo $DISPLAY
echo $BROWSER
grunt test