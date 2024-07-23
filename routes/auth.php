<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Dashboard\GraphController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
                ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
                ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
                ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
                ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
                ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
                ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['signed', 'throttle:6,1'])
                ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware('throttle:6,1')
                ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
                ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');

    Route::get('utms', [GraphController::class, 'create'])->name('utms');

    Route::get('campanhas', function () {
        return \Inertia\Inertia::render('Dashboard/Campanhas');
    })->name('campanhas');

    Route::get('campanhas/contas', function (){
        return \Inertia\Inertia::render('Dashboard/Campanhas/Contas');
    })->name('campanhas.contas');

    Route::get('campanhas/anuncios', function (){
        return \Inertia\Inertia::render('Dashboard/Campanhas/Anuncios');
    })->name('campanhas.anuncios');
    
    Route::get('camapanhas/campanhas', function (){
        return \Inertia\Inertia::render('Dashboard/Campanhas/Sets');
    })->name('campanhas.campanhas');
    
    Route::get('camapanhas/conjuntos', function (){
        return \Inertia\Inertia::render('Dashboard/Campanhas/Conjuntos');
    })->name('campanhas.conjuntos');

    Route::get('integracoes', function () {
        return \Inertia\Inertia::render('Dashboard/Integracoes');
    })->name('integracoes');

    Route::get('taxas', function () {
        return \Inertia\Inertia::render('Taxas/Taxas');
    })->name('taxas');

    Route::get('regras', function () {
        return \Inertia\Inertia::render('Regras/Regras');
    })->name('regras');

    Route::get('assinatura', function () {
        return \Inertia\Inertia::render('Assinatura/Assinatura');
    })->name('assinatura');

    Route::get('minha-conta', function () {
        return 'Minha Conta';
    })->name('minha-conta');

    Route::get('avancado', function () {
        return \Inertia\Inertia::render('Avancado/Avancado');
    })->name('avancado');
    
    Route::get('indique-e-ganhe', function () {
        return \Inertia\Inertia::render('Indique/Indique');
    })->name('indique-e-ganhe');

    Route::get('ajuda', function () {
        return \Inertia\Inertia::render('Ajuda/Ajuda');
    })->name('ajuda');



});


