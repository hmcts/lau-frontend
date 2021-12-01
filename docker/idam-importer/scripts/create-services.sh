#!/bin/sh

set -e

echo -e "\nCreating service..."

/scripts/create-service.sh "LAU" "false" "lau" "12345678" "[\"http://localhost:4000/oauth2/callback\",\"https://localhost:4000/oauth2/callback\"]" "[\"cft-audit-investigator\"]"

echo -e "\nService created!"
