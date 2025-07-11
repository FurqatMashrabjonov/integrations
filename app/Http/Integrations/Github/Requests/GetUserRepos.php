<?php

namespace App\Http\Integrations\Github\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserRepos extends Request
{
    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::GET;

    /**
     * The repository owner
     */
    protected string $owner;

    /**
     * Constructor
     */
    public function __construct(string $owner)
    {
        $this->owner = $owner;
    }

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return "/user/repos?per_page=10";
    }
}
