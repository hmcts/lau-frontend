#!/bin/bash
set -ex

NODE_ENV=test NODE_PATH=. node ./node_modules/codeceptjs/bin/codecept.js run -c ./src/test/smoke/smoke.conf.js
