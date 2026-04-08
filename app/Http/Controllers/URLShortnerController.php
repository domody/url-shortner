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
            'original_url' => ['required', 'url', 'max:2048'],
            'code'         => ['nullable', 'string', 'alpha_dash', 'max:32', 'unique:links,code'],
        ]);

        if (empty($validated['code'])) {
            do {
                $validated['code'] = Str::random(6);
            } while (Link::where('code', $validated['code'])->exists());
        }
        $validated['user_id'] = Auth::id();

        Link::create($validated);

        return redirect()->back();
    }

    public function redirect(Request $request, string $code)
    {
        $link = Link::where('code', $code)->firstOrFail();

        Click::create([
            'link_id' => $link->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referrer' => $request->headers->get('referer'), # whichever idiot misspelled this can genuinely blow one
        ]);

        return redirect()->away($link->original_url, 302);
    }
}
