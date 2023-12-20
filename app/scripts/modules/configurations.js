angular.module('configurations', [])
    .constant('API_VERSION', '/fineract-provider/api/v1')
    .constant('IDLE_DURATION', 30 * 60)
    .constant('WARN_DURATION', 10)
    .constant('FINERACT_BASE_URL', '$FINERACT_BASE_URL')
    .constant('KEEPALIVE_INTERVAL', 15 * 60)
    .constant('OAUTH_JWT_CLIENT_ID', 'mifos-staging')
    .constant('OAUTH_JWT_CLIENT_SECRET', 'rTuer2P0eV20EUus5kp2mowHb9DxRIja')
    .constant('OAUTH_JWT_SERVER_URL', 'http://10.2.3.21:8083/auth')
    .constant('SECURITY', 'oauth');
// Use SECURITY constant as 'oauth' to enable Oauth2 on community app
// Use SECURITY constant as 'basicauth' to enable basicauth on community app
