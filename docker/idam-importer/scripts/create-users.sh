#!/bin/sh

set -e

echo -e "\nCreating users..."

PASSWORD="Password12"
ROLES='[{"code":"cft-audit-investigator"}]'
/scripts/create-user.sh "test@test.com" "Test" "Test" "${PASSWORD}" "cft-audit-investigator" "${ROLES}"
/scripts/create-user.sh "unauth@test.com" "Unauthorized" "User" "${PASSWORD}" "" "[{}]"

echo -e "\nUsers created!"
