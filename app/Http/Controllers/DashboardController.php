<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Links;
use App\Models\Clicks;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return inertia('app/index', [
            'stats' => [
                'total_links'   => Links::where('user_id', $user->id)->count(),
                'total_clicks'  => Clicks::whereHas('link', fn($q) => $q->where('user_id', $user->id))->count(),
                'todays_clicks' => Clicks::whereHas('link', fn($q) => $q->where('user_id', $user->id))
                                        ->whereDate('created_at', today())
                                        ->count(),
                'recent'        => Clicks::whereHas('link', fn($q) => $q->where('user_id', $user->id))
                                        ->latest()
                                        ->take(5)
                                        ->get(),
            ],
        ]);
    }
}
