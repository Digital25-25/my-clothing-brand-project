<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::insert([
            [
                'name' => 'Womenswear',
                'slug' => 'womenswear',
                'parent_id' => null,
            ],
            [
                'name' => 'Menswear',
                'slug' => 'menswear',
                'parent_id' => null,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'parent_id' => null,
            ],
        ]);
    }
}
