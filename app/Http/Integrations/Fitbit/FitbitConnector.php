<?php

namespace App\Http\Integrations\Fitbit;

use Saloon\Http\Request;
use Saloon\Http\Connector;
use Saloon\Helpers\OAuth2\OAuthConfig;
use Saloon\Traits\Plugins\AcceptsJson;
use Saloon\Traits\OAuth2\AuthorizationCodeGrant;

class FitbitConnector extends Connector
{
    use AcceptsJson;
    use AuthorizationCodeGrant;

    /**
     * The Base URL of the API.
     */
    public function resolveBaseUrl(): string
    {
        return 'https://api.fitbit.com/1/';
    }

    /**
     * The OAuth2 configuration
     */
    protected function defaultOauthConfig(): OAuthConfig
    {
        return OAuthConfig::make()
            ->setClientId(config('services.fitbit.client_id'))
            ->setClientSecret(config('services.fitbit.client_secret'))
            ->setRedirectUri(config('services.fitbit.redirect_uri'))
            ->setDefaultScopes(config('services.fitbit.scopes', []))
            ->setAuthorizeEndpoint(config('services.fitbit.authorize_url'))
            ->setTokenEndpoint(config('services.fitbit.token_url'))
            ->setUserEndpoint('https://api.fitbit.com/1/user/-/profile.json')
            ->setRequestModifier(function (Request $request) {
                $clientId     = config('services.fitbit.client_id');
                $clientSecret = config('services.fitbit.client_secret');
                $encoded      = base64_encode("{$clientId}:{$clientSecret}");

                $request->headers()->set([
                    'Authorization' => "Basic {$encoded}",
                    'Content-Type'  => 'application/x-www-form-urlencoded',
                    'Accept'        => 'application/json',
                ]);
            });
    }
}
