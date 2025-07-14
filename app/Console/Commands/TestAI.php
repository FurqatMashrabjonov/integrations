<?php

namespace App\Console\Commands;

use Prism\Prism\Prism;
use Illuminate\Console\Command;
use Prism\Prism\Enums\Provider;

class TestAI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:ai';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Prism::text()
            ->using(Provider::Gemini, 'gemini-2.0-flash')
            ->withPrompt('Tell me a story about a brave knight.')
            ->asStream();

        foreach ($response as $chunk) {
            $this->info($chunk->text);
            ob_flush();
            flush();
        }
    }
}
