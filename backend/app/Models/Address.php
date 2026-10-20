<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'type', 'line1', 'line2', 'city', 'state', 'postal_code', 'country'];

    public function user(){
        return $this->belongsTo(User::class, "user_id");
    }
    public function orders(){
        return $this->hasMany(Order::class, "address_id");
    }
}
