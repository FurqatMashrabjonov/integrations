<?php

namespace App\Http\Integrations\Leetcode\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;
use Saloon\Contracts\Body\HasBody;
use Saloon\Traits\Body\HasJsonBody;
use App\Http\Integrations\Leetcode\GraphqlQueries\QueryBag;

class GetProblemDifficulty extends Request implements HasBody
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
        protected string $titleSlug
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
            'query'     => QueryBag::getProblemDifficulty(),
            'variables' => [
                'titleSlug' => $this->titleSlug,
            ],
        ];
    }
}
