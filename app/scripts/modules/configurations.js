angular.module('configurations', [])
    .constant('API_VERSION', '/fineract-provider/api/v1')
    .constant('IDLE_DURATION', 30 * 60)
    .constant('WARN_DURATION', 10)
    .constant('FINERACT_BASE_URL', '$FINERACT_BASE_URL')
    .constant('KEEPALIVE_INTERVAL', 15 * 60)
    .constant('OAUTH_JWT_CLIENT_ID', 'fineract-production')
    .constant('OAUTH_JWT_CLIENT_SECRET', '6NemAHBihX81IpMC5SmAsFrIatFk43k9')
    .constant('OAUTH_JWT_SERVER_URL', 'https://10.2.3.21:8083/auth')
    .constant('OAUTH_REALM', 'corebanking')
    .constant('SECURITY', 'oauth');
// Use SECURITY constant as 'oauth' to enable Oauth2 on community app
// Use SECURITY constant as 'basicauth' to enable basicauth on community app
