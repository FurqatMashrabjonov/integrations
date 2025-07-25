<?php

namespace App\Http\Integrations\Github;

use Saloon\Http\Connector;
use Saloon\Helpers\OAuth2\OAuthConfig;
use Saloon\Traits\Plugins\AcceptsJson;
use Saloon\Traits\OAuth2\AuthorizationCodeGrant;

class GithubConnector extends Connector
{
    use AcceptsJson;
    use AuthorizationCodeGrant;

    /**
     * The Base URL of the API.
     */
    public function resolveBaseUrl(): string
    {
        return 'https://api.github.com';
    }

    /**
     * The OAuth2 configuration
     */
    protected function defaultOauthConfig(): OAuthConfig
    {
        return OAuthConfig::make()
            ->setClientId(config('services.github.client_id'))
            ->setClientSecret(config('services.github.client_secret'))
            ->setRedirectUri(config('services.github.redirect_uri'))
            ->setDefaultScopes(['read:user', 'user:email'])
            ->setAuthorizeEndpoint(config('services.github.authorize_url'))
            ->setTokenEndpoint(config('services.github.token_url'))
            ->setUserEndpoint('/user');
    }
}
