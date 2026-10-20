<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'address_id', 'status', 'subtotal', 'shipping_fee', 'tax', 'total'];

    public function user(){
        return $this->belongsTo(User::class, "user_id");
    }
    public function address(){
        return $this->belongsTo(Address::class, "address_id");
    }
    public function orderItems(){
        return $this->hasMany(OrderItem::class, "order_id");
    }
    public function payments(){
        return $this->hasMany(Payment::class, "order_id");
    }
}
