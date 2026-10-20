<?php

namespace App\Services;

use App\Models\Image;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    /**
     * Add replacement image(s) to an existing product.
     */
    public function addImages(Product $product, array $data)
    {
        $uploadedFiles = [];

        try {
            DB::beginTransaction();

            // Business rule: A product can have a maximum of 3 images
            $currentImageCount = $product->images()->count();
            $newImageCount = count($data['images']);

            if (($currentImageCount + $newImageCount) > 3) {
                throw new Exception('A product cannot have more than 3 images.');
            }

            $images = [];

            foreach ($data['images'] as $index => $image) {

                $path = $image->store('products', 'public');

                // Keep track of uploaded files in case something fails
                $uploadedFiles[] = $path;

                $images[] = $product->images()->create([
                    'url' => $path,
                    'sort_order' => $currentImageCount + $index,
                ]);
            }

            DB::commit();

            return $images;

        } catch (Exception $e) {

            DB::rollBack();

            // Remove uploaded files if transaction fails
            foreach ($uploadedFiles as $file) {
                Storage::disk('public')->delete($file);
            }

            throw $e;
        }
    }

    /**
     * Delete an image.
     */
    public function destroy(Image $image): void
    {
        DB::transaction(function () use ($image) {

            $product = $image->product;

            // Delete the physical file
            if (Storage::disk('public')->exists($image->url)) {
                Storage::disk('public')->delete($image->url);
            }

            // Delete the database record
            $image->delete();

            // Reorder remaining images
            $product->images()
                ->orderBy('sort_order')
                ->get()
                ->each(function ($image, $index) {
                    $image->update([
                        'sort_order' => $index,
                    ]);
                });
        });
    }
}