# JSCII Build foler

This folder contains the tooling needed to build the JSCII app from source.
This is a single page app served from satic files, so this folder serves only
to compile those files from more readable source code.

## Build instructions

Before buidling, node and npm must be installed (currently node major version 14
is being used). The `npm install` command must be run from this direcory, not
the project root directory. In order to compile and run tests, you also must
have a linux-style shell available to run the scripts. No npm scripts have been
provided, and we recommend disabling them globally due to security concerns as
per [https://npm.community/t/add-ignore-script-scripts/4169].


