<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Facebook\FacebookLoginController;

// Route::get('/', function () {
//     return Inertia::render('Landing/Teste', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('startServer', function () {
    Artisan::call('migrate:fresh');
    return 'Server started';
});

Route::get('/facebook', [FacebookLoginController::class, 'create'])->name('facebook.login');
Route::get('/facebook/callback', [FacebookLoginController::class, 'callback'])->name('facebook.callback');
Route::post('/facebook/access-token', [FacebookLoginController::class, 'store'])->name('facebook.store');
require __DIR__.'/auth.php';

