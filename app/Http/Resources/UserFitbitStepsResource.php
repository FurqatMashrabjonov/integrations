<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Models\UserFitbitStep;
use Illuminate\Http\Resources\Json\JsonResource;

class UserFitbitStepsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var UserFitbitStep $this */
        return [
            'steps'           => $this->resource->steps,
            'steps_formatted' => number_format($this->resource->steps),
            'date'            => $this->resource->date,
        ];
    }
}
