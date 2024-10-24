<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Facebook\FacebookLoginController;
use App\Http\Controllers\PerfectPayController;

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

Route::get('/dashboard', [FacebookLoginController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

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
Route::get('/facebook/profile/info', [FacebookLoginController::class, 'getProfileInfo'])->name('facebook.profile.info');


Route::post('/dashboard/refresh', [FacebookLoginController::class, 'refresh'])->name('dashboard.refresh');
Route::post('/webhook/perfectpay/{userId}', [PerfectPayController::class, 'handleWebhook'])->name('perfectpay.webhook');

// Rotas para configurar a integração e obter as últimas vendas
Route::get('/integrations/perfectpay', [PerfectPayController::class, 'showIntegrationForm'])->name('perfectpay.integration.form');
Route::post('/integrations/perfectpay', [PerfectPayController::class, 'saveIntegration'])->name('perfectpay.integration.save');
Route::get('/perfectpay/sales', [PerfectPayController::class, 'getLatestSales'])->name('perfectpay.sales.get');




Route::get('/integrations/perfectpay', [PerfectPayController::class, 'showIntegrationForm'])->name('perfectpay.integration.form');
Route::post('/integrations/perfectpay', [PerfectPayController::class, 'saveIntegration'])->name('perfectpay.integration.save');
require __DIR__.'/auth.php';

