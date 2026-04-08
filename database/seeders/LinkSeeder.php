<?php

namespace Database\Seeders;

use App\Models\Link;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LinkSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $urls = [
            'https://www.github.com/torvalds/linux',
            'https://laravel.com/docs/13.x',
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://tailwindcss.com/docs/installation',
            'https://www.amazon.com/dp/B0CHX3QBCH',
            'https://medium.com/@techblog/10-tips-for-better-code',
            'https://www.reddit.com/r/programming/comments/abc123',
            'https://docs.docker.com/get-started/',
            'https://vercel.com/blog/vercel-ai-sdk-3',
            'https://stripe.com/docs/api/payment_intents',
            'https://www.figma.com/file/abc123/design-system',
            'https://www.notion.so/team/project-roadmap',
            'https://calendly.com/johndoe/30min',
            'https://www.dropbox.com/s/abc123/report-q1-2026.pdf',
            'https://www.loom.com/share/abc123def456',
            'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
            'https://www.producthunt.com/posts/shadcn-ui',
            'https://www.npmjs.com/package/zod',
            'https://news.ycombinator.com/item?id=39234567',
            'https://stackoverflow.com/questions/71234567/how-to-fix-cors',
        ];

        foreach ($users as $user) {
            $linkCount = rand(5, 15);

            for ($i = 0; $i < $linkCount; $i++) {
                Link::create([
                    'user_id' => $user->id,
                    'original_url' => $urls[array_rand($urls)],
                    'code' => Str::random(6),
                ]);
            }
        }
    }
}
