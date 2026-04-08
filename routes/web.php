<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\URLShortnerController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'public/landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('links', [DashboardController::class, 'links'])->name('links');
    Route::post('create', [URLShortnerController::class, 'create'])->name('links.create');
});

Route::get('/{code}', [URLShortnerController::class, 'redirect'])->name('short.redirect');

require __DIR__.'/settings.php';
