<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use App\Http\Requests\ProduSctUpdateRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Dependency Injection
    public function __construct(
        protected ProductService $productService
    ){}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'variants', 'images'])->get();
        return response()->json([
            'success' => true,
            "products" => $products
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
    public function store(StoreRequest $request)
    {
        $this->productService->store($request->validated());
        return response()->json([
            "success" => true,
            "message" => "Product added successfully",
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product->load(['variants', 'images']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProduSctUpdateRequest $request, Product $product)
    {
        $this->productService->update($product, $request->validated());
        return response()->json([
            "success" => true,
            "message" => "Product updated successfully"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->productService->destroy($product);

        return response()->json([
            "success" => true,
            "message" => "Product deleted successfully."
        ]);
    }
}
