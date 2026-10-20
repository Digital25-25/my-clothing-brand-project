<?php

namespace App\Services;

use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

    class ProductService {
        public function store (array $data) {

            // Keep track of uploaded files in case something fails.
            $uploadedFiles = [];

            try{
                DB::beginTransaction();
                /* 
                ----------------------------------------------------
                |                                                  |
                |                                                  |
                |                 CREATE PRODUCT                   |
                |                                                  |
                |                                                  |
                ----------------------------------------------------
                 */
                $product = Product::create([
                    'name'          => $data['name'],
                    'category_id'   => $data['category_id'],
                    'description'   => $data['description'] ?? null,
                    'price'         => $data['price'], 
                    'sku'           => "", //An empty string because we will generation a sku later
                    'is_active'     => $data['is_active'] ?? true,
                ]);

                /* GENERATING PRODUCT SKU */
                $productSku = 'GD-PR' . str_pad($product->id, 6, '0', STR_PAD_LEFT);
                $product->update(['sku' => $productSku]);
                /* 
                ----------------------------------------------------
                |                                                  |
                |                                                  |
                |                   CREATE VARIANT                 |
                |                                                  |
                |                                                  |
                ----------------------------------------------------
                 */
                if(!empty($data['variants'])){
                    foreach ($data['variants'] as $variant){
                        $variantSku = sprintf(
                            '%s-%s-%s', 
                            $productSku, 
                            strtoupper(substr($variant['color'], 0, 3)),
                            strtoupper($variant['size'])
                        );
                        $product->variants()->create([
                            'size'              => $variant['size'],
                            'color'             => $variant['color'],
                            'sku'               => $variantSku,
                            'price_override'    => $variant['price_override'] ?? null,
                            'stock_qty'         => $variant['stock_qty'],
                        ]);
                    }
                }
                /* 
                ----------------------------------------------------
                |                                                  |
                |                                                  |
                |                   UPLOAD IMAGES                  |
                |                                                  |
                |                                                  |
                ----------------------------------------------------
                */
                if(!empty($data['images'])){
                    foreach ($data['images'] as $index => $image){
                        $path = $image->store('products', 'public');
                                            
                        // Save path in case we need to delete it
                        $uploadedFiles[] = $path;

                        $product->images()->create([
                            'url'           => $path,
                            'sort_order'    => $index
                        ]);
                        
                    }
                }
                DB::commit();
                return $product->load(['variants', 'images']);
            }catch(Exception $e){
                DB::rollBack();
                
                foreach($uploadedFiles as $file){
                    // DELETE THE FILE(S) IF SOMETHING GOES WRONG WITH CREATION OF PRODUCT AND VARIANT
                    Storage::disk('public')->delete($file);
                }
                throw $e;
            };


        }
        public function update(Product $product, array $data) {
            $product->update([
                'name'              => $data['name'] ?? $product->name,
                'category_id'       => $data['category_id'] ?? $product->category_id,
                'description'       => $data['description'] ?? $product->description,
                'price'             => $data['price'] ?? $product->price,
                'is_active'         => $data['is_active'] ?? $product->is_active,
            ]);

            return $product->fresh()->load([
                'variants',
                'images',
            ]);
        }
        public function destroy(Product $product) {
            DB::transaction(function () use ($product) {

                /*
                |--------------------------------------------------------------------------
                | Delete Images From Storage
                |--------------------------------------------------------------------------
                */

                foreach ($product->images as $image) {

                    if (Storage::disk('public')->exists($image->url)) {
                        Storage::disk('public')->delete($image->url);
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Delete Product
                |--------------------------------------------------------------------------
                |
                | If your foreign keys use cascadeOnDelete(),
                | variants and images will be deleted automatically.
                |
                */

                $product->delete();
            });
        }
    }
