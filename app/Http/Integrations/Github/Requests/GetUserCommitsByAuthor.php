<?php

namespace App\Http\Integrations\Github\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserCommitsByAuthor extends Request
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
     * The author username
     */
    protected string $author;

    /**
     * Constructor
     */
    public function __construct(string $owner, string $repo, string $author)
    {
        $this->owner  = $owner;
        $this->repo   = $repo;
        $this->author = $author;
    }

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return "/repos/{$this->owner}/{$this->repo}/commits";
    }

    /**
     * The query parameters for the request
     */
    protected function defaultQuery(): array
    {
        return [
            'author'   => $this->author,
            'per_page' => 100,
            'since'    => now()->startOfDay()->format('c'), // ISO 8601 format
        ];
    }
}
