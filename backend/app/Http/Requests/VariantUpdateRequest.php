<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class VariantUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'size' => ['required', 'string', 'max:20'],
            'color' => ['required', 'string', 'max:50'],
            'price_override' => ['nullable', 'numeric', 'min:0'],
            'stock_qty' => ['required', 'integer', 'min:0'],
        ];
    }
    public function messages(): array
    {
        return [
            'price_override.numeric' => 'Price override must be a valid number.',
            'price_override.min' => 'Price override cannot be negative.',
            'stock_qty.integer' => 'Stock quantity must be an integer.',
            'stock_qty.min' => 'Stock quantity cannot be negative.',
        ];
    }
}
