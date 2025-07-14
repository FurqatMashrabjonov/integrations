<?php

namespace App\Services;

use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;

class AiService
{
    protected $provider;

    public function __construct()
    {
        $this->provider = Prism::text()
            ->using(Provider::Gemini, 'gemini-2.0-flash');
    }

    public function text(string $prompt)
    {
        return $this->provider->withPrompt($prompt)->asText()?->text ?? '';
    }
}
