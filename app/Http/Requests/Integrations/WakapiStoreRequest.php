<?php

namespace App\Http\Requests\Integrations;

use Illuminate\Foundation\Http\FormRequest;

class WakapiStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'api_token' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'api_token.required' => 'API token maydoni to\'ldirilishi shart.',
            'api_token.string'   => 'API token matn ko\'rinishida bo\'lishi kerak.',
            'api_token.max'      => 'API token 255 belgidan uzun bo\'lmasligi kerak.',
        ];
    }
}
