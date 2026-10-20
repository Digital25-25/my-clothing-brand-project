<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProduSctUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:200'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.max' => 'The product name may not be greater than 200 characters.',
            'category_id.exists' => 'The selected category does not exist.',
            'price.numeric' => 'The price must be a valid number.',
            'price.min' => 'The price cannot be negative.',
            'is_active.boolean' => 'The product status must be true or false.',
        ];
    }
}