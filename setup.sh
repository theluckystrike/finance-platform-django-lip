#!/bin/bash

# Move the code for each project to the root directory
# so that Heroku buildpacks can pick it up

# Moving backend files to root
mv backend/* .

# Moving frontend files to a specific directory or the root
mv frontend/* .
