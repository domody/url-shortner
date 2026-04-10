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
    Route::get('links/{link}', [URLShortnerController::class, 'show'])->name('links.show');
    Route::post('create', [URLShortnerController::class, 'create'])->middleware('throttle:30,1')->name('links.create');
    Route::put('links/{link}', [URLShortnerController::class, 'update'])->name('links.update');
    Route::delete('links/{link}', [URLShortnerController::class, 'destroy'])->name('links.destroy');
});

Route::get('/{code}', [URLShortnerController::class, 'redirect'])->middleware('throttle:120,1')->name('short.redirect');

require __DIR__.'/settings.php';
