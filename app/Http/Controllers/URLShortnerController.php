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
        $user = Auth::user();

        $link = Link::where('id', $link->id)
            ->where('user_id', $user->id)
            ->withCount('clicks')
            ->with(['clicks' => fn ($q) => $q->latest()])
            ->latest()
            ->firstOrFail();

        return inertia('app/links/show', [
            'link' => $link,
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
}
