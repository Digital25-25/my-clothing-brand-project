<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageStoreRequest;
use App\Models\Image;
use App\Models\Product;
use App\Services\ImageService;

class ImageController extends Controller
{
    public function __construct(
        protected ImageService $imageService
    ) {}

    /**
     * Upload image(s) for an existing product.
     */
    public function store(ImageStoreRequest $request, Product $product) {

        $images = $this->imageService->addImages(
            $product,
            $request->validated()
        );

        return response()->json([
            'message' => 'Image(s) uploaded successfully.',
            'data' => $images,
        ], 201);
    }

    /**
     * Delete an image.
     */
    public function destroy(Image $image)
    {
        $this->imageService->destroy($image);

        return response()->json([
            'message' => 'Image deleted successfully.',
        ]);
    }
}