#!/bin/sh

echo -e "\nRunning IdAM Importer Setup..."

/scripts/create-services.sh
/scripts/create-roles.sh
/scripts/create-users.sh

echo -e "\nSetup complete!"
