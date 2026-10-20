<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VariantController;
use Illuminate\Support\Facades\Route;

/* Authentication Route */
Route::controller(AuthController::class)->group(function (){
    Route::post("/register", "register");
    Route::post("/login", "login");
    Route::post("/logout", "logout");
});

Route::get('/', function () {
    return view('welcome');
});

/* ONLY AUTHENTICATED USER CAN MAKE THE BELOW REQUEST */
/* Route::middleware('auth:sanctum')->group(function () {  */
    Route::controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'show');
        Route::get('/categoryParent', 'index');
        Route::post('/storeCategory', 'store');
        Route::put('/updateCategory/{category}', 'update');
        Route::delete('/deleteCategory/{category}', 'destroy');
    });
    
    Route::controller(ProductController::class)->prefix('products')->group(function () {
        Route::get('/index', 'index');
        Route::get('/show/{product}', 'show');
        Route::post('/storeProduct', 'store');
        Route::put('/update/{product}', 'update');
        Route::delete('/destroy/{product}', 'destroy');
    });
    
    Route::controller(VariantController::class)->prefix('variants')->group(function () {
        Route::post('/product/{product}', 'store');
        Route::put('/{variant}', 'update');
        Route::delete('/{variant}', 'destroy');
    });
    
    Route::controller(ImageController::class)->prefix('images')->group(function () {
        Route::post('/product/{product}', 'store');
        Route::delete('/{image}', 'destroy');
    });
/* }); */