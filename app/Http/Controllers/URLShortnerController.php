<?php

namespace App\Http\Controllers;

use App\Models\Click;
use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class URLShortnerController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'original_url' => ['required', 'url:http,https', 'max:2048'],
            'code'         => ['nullable', 'string', 'alpha_dash', 'max:32', 'unique:links,code'],
        ]);

        if (empty($validated['code'])) {
            do {
                $validated['code'] = Str::random(6);
            } while (Link::where('code', $validated['code'])->exists());
        }
        $validated['user_id'] = Auth::id();

        Link::create($validated);

        return redirect()->back()->with('success', 'Link created.');
    }

    public function show(Link $link)
    {
        abort_unless($link->user_id === Auth::id(), 403);

        $link->loadCount('clicks');

        $stats = [
            'clicks_today'     => $link->clicks()->whereDate('created_at', today())->count(),
            'clicks_this_week' => $link->clicks()->where('created_at', '>=', now()->subWeek())->count(),
            'last_click'       => $link->clicks()->latest()->value('created_at'),
        ];

        $chartData = $link->clicks()
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->pluck('count', 'date');

        $referrers = $link->clicks()
            ->select('referrer')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'source' => $row->referrer
                    ? preg_replace('/^www\./', '', parse_url($row->referrer, PHP_URL_HOST) ?: $row->referrer)
                    : 'Direct',
                'count' => $row->count,
            ])
            ->groupBy('source')
            ->map(fn ($group) => [
                'source' => $group->first()['source'],
                'count'  => $group->sum('count'),
            ])
            ->sortByDesc('count')
            ->values();

        $recentClicks = $link->clicks()->latest()->take(50)->get();

        return inertia('app/links/show', [
            'link'         => $link,
            'stats'        => $stats,
            'chartData'    => $chartData,
            'referrers'    => $referrers,
            'recentClicks' => $recentClicks,
        ]);
    }

    public function redirect(Request $request, string $code)
    {
        $link = Link::where('code', $code)->firstOrFail();

        Click::create([
            'link_id' => $link->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referrer' => $request->headers->get('referer'),
        ]);

        return redirect()->away($link->original_url, 302);
    }

    public function update(Request $request, Link $link)
    {
        abort_unless($link->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'original_url' => ['required', 'url:http,https', 'max:2048'],
            'code'         => ['nullable', 'string', 'alpha_dash', 'max:32', 'unique:links,code,' . $link->id],
        ]);

        $link->update($validated);

        return redirect()->back()->with('success', 'Link updated.');
    }

    public function destroy(Link $link)
    {
        abort_unless($link->user_id === Auth::id(), 403);

        $link->delete();

        return redirect()->route('links')->with('success', 'Short URL deleted.');
    }
}
