<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Link;
use App\Models\Click;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return inertia('app/index', [
            'stats' => [
                'total_links'   => Link::where('user_id', $user->id)->count(),
                'total_clicks'  => Click::whereHas('link', fn($q) => $q->where('user_id', $user->id))->count(),
                'todays_clicks' => Click::whereHas('link', fn($q) => $q->where('user_id', $user->id))
                                        ->whereDate('created_at', today())
                                        ->count(),
                'recent'        => Click::whereHas('link', fn($q) => $q->where('user_id', $user->id))
                                        ->latest()
                                        ->take(5)
                                        ->get(),
            ],
        ]);
    }

    public function links()
    {
        $user = Auth::user();

        $links = Link::where('user_id', $user->id)
            ->withCount('clicks')
            ->latest()
            ->get();

        return inertia('app/links', [
            'links' => $links,
        ]);
    }
}
