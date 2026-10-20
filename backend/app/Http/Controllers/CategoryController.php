<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = Category::whereNull("parent_id")->get();

        return response()->json([
            'success' => true,
            'parent' => $category
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:100',
            'slug' => 'required|string|min:3|max:120',
            'parent_id' => 'required|integer'
        ]);

        Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $categories = Category::with('parent')->withCount('products')->get();

        return response()->json([
            'success' => true,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validate = $request->validate([
            'name' => 'required|string|min:3|max:100',
            'slug' => 'required|string|min:3|max:120',
            'parent_id' => 'integer'
        ]);
        $category->update($validate);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'Delete all subcategories first.'
            ], 422);
        }

        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Delete or move the products first.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.'
        ]);
    } 
}
