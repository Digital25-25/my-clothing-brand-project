<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    /** @use HasFactory<\Database\Factories\VariantFactory> */
    use HasFactory;

    protected $fillable = ['product_id', 'size', 'color', 'sku', 'price_override', 'stock_qty'];

    public function product(){
        return $this->belongsTo(Product::class, "product_id");
    }
    public function orderItems(){
        return $this->hasMany(OrderItem::class, "variant_id");
    }
    public function cartItems(){
        return $this->hasMany(CartItem::class, "variant_id");
    }
}
