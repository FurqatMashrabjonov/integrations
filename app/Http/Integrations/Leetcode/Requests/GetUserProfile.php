<?php

namespace App\Http\Integrations\Leetcode\Requests;

use App\Http\Integrations\Leetcode\GraphqlQueries\QueryBag;
use Saloon\Enums\Method;
use Saloon\Http\Request;
use Saloon\Contracts\Body\HasBody;
use Saloon\Traits\Body\HasJsonBody;

class GetUserProfile extends Request implements HasBody
{
    use HasJsonBody;

    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::POST;

    /**
     * Constructor to set the username
     */
    public function __construct(
        protected string $username
    ) {}

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return '/';
    }

    /**
     * Define the request body
     */
    protected function defaultBody(): array
    {
        return [
            'query' => QueryBag::getUserProfile(),
            'variables' => [
                'username' => $this->username,
                'limit' => 1,
            ],
        ];
    }
}
