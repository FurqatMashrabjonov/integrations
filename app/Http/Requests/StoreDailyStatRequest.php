<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyStatRequest extends FormRequest
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
            'user_id' => 'required|integer|exists:users,id',
            'date' => 'required|date',
            'provider' => 'required|string|in:github,leetcode,wakapi,fitbit',
            'meta' => 'nullable|array',
            'metrics' => 'nullable|array',
            'metrics.*.type' => 'required_with:metrics|string',
            'metrics.*.value' => 'required_with:metrics|numeric',
            'metrics.*.unit' => 'nullable|string',
            'metrics.*.meta' => 'nullable|array',
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'user_id.exists' => 'The selected user does not exist.',
            'provider.in' => 'The provider must be one of: github, leetcode, wakapi, fitbit.',
            'metrics.*.type.required_with' => 'Each metric must have a type.',
            'metrics.*.value.required_with' => 'Each metric must have a value.',
            'metrics.*.value.numeric' => 'Metric value must be a number.',
        ];
    }
}
