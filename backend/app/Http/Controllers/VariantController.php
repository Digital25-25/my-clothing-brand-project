<?php

namespace App\Http\Controllers;

use App\Http\Requests\VariantStoreRequest;
use App\Http\Requests\VariantUpdateRequest;
use App\Models\Product;
use App\Models\Variant;
use App\Services\VariantService;


class VariantController extends Controller
{
    public function __construct(
        protected VariantService $variantService
    ) {}

    /**
     * Store a newly created variant.
     */
    public function store(VariantStoreRequest $request, Product $product) 
    {

        $variant = $this->variantService->store(
            $product,
            $request->validated()
        );

        return response()->json([
            'message' => 'Variant created successfully.',
            'data' => $variant,
        ], 201);
    }

    /**
     * Update the specified variant.
     */
    public function update(VariantUpdateRequest $request, Variant $variant) {

        $variant = $this->variantService->update(
            $variant,
            $request->validated()
        );

        return response()->json([
            'message' => 'Variant updated successfully.',
            'data' => $variant,
        ]);
    }

    /**
     * Remove the specified variant.
     */
    public function destroy(Variant $variant) {

        $this->variantService->destroy($variant);

        return response()->json([
            'message' => 'Variant deleted successfully.',
        ]);
    }
}