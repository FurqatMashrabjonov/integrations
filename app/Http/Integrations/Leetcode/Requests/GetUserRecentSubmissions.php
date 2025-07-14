<?php

namespace App\Http\Integrations\Leetcode\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;
use Saloon\Contracts\Body\HasBody;
use Saloon\Traits\Body\HasJsonBody;
use App\Http\Integrations\Leetcode\GraphqlQueries\QueryBag;

class GetUserRecentSubmissions extends Request implements HasBody
{
    use HasJsonBody;
    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::POST;

    /**
     * Constructor to set the username and limit
     */
    public function __construct(
        protected string $username,
        protected int $limit = 20,
    ) {}

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
            'query'     => QueryBag::getUserRecentSubmissions(),
            'variables' => [
                'username' => $this->username,
                'limit'    => $this->limit,
            ],
        ];
    }
}
