<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // PRODUCT VALIDATION
            'name' => ['required', 'string', 'max:200'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            
            // VARIANT VALIDATION
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.size' => ['required', 'string', 'max:20'],
            'variants.*.color' => ['required', 'string', 'max:50'],
            'variants.*.price_override' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock_qty' => ['required', 'integer', 'min:0'],
            
            // IMAGE VALIDATION
            'images' => ['required', 'array', 'min:1', 'max:3'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
