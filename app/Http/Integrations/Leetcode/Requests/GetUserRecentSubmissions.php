<?php

namespace App\Http\Integrations\Leetcode\Requests;

use App\Http\Integrations\Leetcode\GraphqlQueries\QueryBag;
use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserRecentSubmissions extends Request
{

    /**
     * Constructor to set the username and limit
     */
    public function __construct(
        protected string $username,
        protected int $limit = 10,
    ) {}

    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::POST;

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return '/';
    }

    protected function defaultBody(): array
    {
        return [
            'query' => QueryBag::getUserProfile(),
            'variables' => [
                'username' => $this->username,
                'limit' => $this->limit,
            ],
        ];
    }
}
