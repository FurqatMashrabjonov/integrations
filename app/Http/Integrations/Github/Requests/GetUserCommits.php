<?php

namespace App\Http\Integrations\Github\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserCommits extends Request
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
     * The repository name
     */
    protected string $repo;

    /**
     * Constructor
     */
    public function __construct(string $owner, string $repo)
    {
        $this->owner = $owner;
        $this->repo  = $repo;
    }

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return "/repos/{$this->owner}/{$this->repo}/commits";
    }
}
