<?php
namespace App\Services;

use App\Models\Product;
use App\Models\Variant;

class VariantService {

    private function generateSKU(Product $product, string $color, string $size){
        return sprintf(
            '%s-%s-%s', 
            $product->sku, 
            strtoupper(substr($color, 0, 3)),
            strtoupper($size)
        );
    }
    public function store(Product $product, array $data){   
        $variantSku = $this->generateSKU($product, $data['color'], $data['size']);
        $product->variants()->create([
            'size'              => $data['size'],
            'color'             => $data['color'],
            'sku'               => $variantSku,
            'price_override'    => $data['price_override'] ?? null,
            'stock_qty'         => $data['stock_qty'],
        ]);
    }
    public function update(Variant $variant, array $data){
        $size = $data['size'] ?? $variant->size;
        $color = $data['color'] ?? $variant->color;

        $variantSku = $this->generateSKU($variant->product, $color, $size);
        $variant->update([ 
            'size'              => $size,
            'color'             => $color,
            'sku'               => $variantSku,
            'price_override'    => $variant['price_override'] ?? $variant->price_override,
            'stock_qty'         => $variant['stock_qty'] ?? $variant->stock_qty,
        ]);
        return $variant->fresh();
    }
    public function destroy(Variant $variant){
        $variant->delete();
    }
}