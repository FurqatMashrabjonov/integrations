<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyStatMetricRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'daily_stat_id' => 'required|integer|exists:daily_stats,id',
            'type' => 'required|string',
            'value' => 'required|numeric',
            'unit' => 'nullable|string',
            'meta' => 'nullable|array',
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'daily_stat_id.exists' => 'The selected daily stat does not exist.',
            'type.required' => 'The metric type is required.',
            'value.required' => 'The metric value is required.',
            'value.numeric' => 'The metric value must be a number.',
        ];
    }
}
