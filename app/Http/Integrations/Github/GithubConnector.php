<?php

     namespace App\Http\Integrations\Github;

     use Saloon\Helpers\OAuth2\OAuthConfig;
     use Saloon\Http\Connector;
     use Saloon\Traits\OAuth2\AuthorizationCodeGrant;
     use Saloon\Traits\Plugins\AcceptsJson;

     class GithubConnector extends Connector
     {
         use AuthorizationCodeGrant;
         use AcceptsJson;

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
                 ->setClientId('1593278d31d8116d2cb1')
                 ->setClientSecret('98f6c8bdc78293beb31007b913b1055abbe4fe59')
                 ->setRedirectUri('https://integrations.test/api/github/callback')
                 ->setDefaultScopes(['read:user', 'repo'])
                 ->setAuthorizeEndpoint('https://github.com/login/oauth/authorize')
                 ->setTokenEndpoint('https://github.com/login/oauth/access_token')
                 ->setUserEndpoint('/user');
         }
     }
