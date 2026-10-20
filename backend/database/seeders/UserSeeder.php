<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'phone' => '+212600000000',
            'password' => 'password',
            'role' => 'admin',
        ]);


        // Create customer
        User::create([
            'name' => 'John Customer',
            'email' => 'john@example.com',
            'phone' => '+212611111111',
            'password' => 'password',
            'role' => 'customer',
        ]);
    }
}
