<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = ['category_id', 'name', 'description', 'price', 'sku', 'is_active'];

    public function category(){
        return $this->belongsTo(Category::class, "category_id");
    }
    public function images(){
        return $this->hasMany(Image::class, "product_id");
    }
    public function variants(){
        return $this->hasMany(Variant::class, 'product_id');
    }
    public function reviews(){
        return $this->hasMany(Review::class, 'product_id');
    }
}
