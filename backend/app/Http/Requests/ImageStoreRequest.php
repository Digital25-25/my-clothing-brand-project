<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImageStoreRequest extends FormRequest
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
            'images' => ['required', 'array', 'min:1', 'max:3'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120', // 5 MB
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'images.required' => 'Please upload at least one image.',
            'images.array' => 'Images must be sent as an array.',
            'images.min' => 'Upload at least one image.',
            'images.max' => 'You can upload a maximum of 3 images at a time.',

            'images.*.required' => 'Each image is required.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Images must be JPG, JPEG, PNG, or WEBP.',
            'images.*.max' => 'Each image must not exceed 5 MB.',
        ];
    }
}