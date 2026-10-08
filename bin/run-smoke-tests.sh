#!/bin/bash
set -ex

NODE_ENV=test codeceptjs run -c ./src/test/smoke/smoke.conf.js
