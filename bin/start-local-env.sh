echo "Starting local environment..."

echo "Starting IDAM(ForgeRock)..."
docker-compose -f docker-compose.yml up "$@" -d fr-am
./bin/test-service.sh "fr-am" "http://localhost:2889/openam/isAlive.jsp"

docker-compose -f docker-compose.yml up "$@" -d fr-idm
./bin/test-service.sh "fr-idm" -H "X-OpenIDM-Username: anonymous" -H "X-OpenIDM-Password: anonymous" -X GET "http://localhost:18080/openidm/info/ping"

echo "Starting IDAM..."
docker-compose -f docker-compose.yml up "$@" -d idam-api \
                                                idam-web-public \
                                                idam-web-admin \
                                                idam-importer
./bin/test-service.sh "idam-api" "http://localhost:5000/health"
./bin/test-service.sh "idam-web-public" "http://localhost:9002/health"

echo "Starting Service Auth Provider..."
docker-compose -f docker-compose.yml up "$@" -d service-auth-provider-api
./bin/test-service.sh "service-auth-provider-api" "http://localhost:4552/health"

echo "Testing IDAM Authentication..."
token=$(./bin/utils/idam-authenticate.sh http://localhost:5000 idamowner@hmcts.net Ref0rmIsFun)

[ "_${token}" = "_" ] && echo "Something wrong! Check logs for fr-am, fr-idm, idam-api - restart each in this order, then re-run. Failed to authenticate IDAM admin user. Script terminated." && exit 1

echo "Starting LAU Frontend..."
docker-compose -f docker-compose.yml up "$@" -d redis
docker-compose -f docker-compose.yml up --build "$@" -d lau-frontend
./bin/test-service.sh "lau-frontend" "http://localhost:4000/health"

echo "LOCAL ENVIRONMENT SUCCESSFULLY STARTED!"
