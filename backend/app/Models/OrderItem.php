<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemFactory> */
    use HasFactory;

    protected $fillable = ['order_id', 'variant_id', 'quantity', 'price_at_purchase'];

    public function order(){
        return $this->belongsTo(Order::class, "order_id");
    }
    public function variant(){
        return $this->belongsTo(Variant::class, "variant_id");
    }
}
