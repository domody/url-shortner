<?php

namespace Database\Seeders;

use App\Models\Clicks;
use App\Models\Links;
use Illuminate\Database\Seeder;

class ClickSeeder extends Seeder
{
    private array $userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    ];

    private array $referrers = [
        'https://twitter.com',
        'https://www.facebook.com',
        'https://www.linkedin.com',
        'https://www.reddit.com',
        'https://t.co',
        'https://mail.google.com',
        'https://www.google.com',
        'https://www.instagram.com',
        'https://discord.com',
        'https://slack.com',
        null,
        null,
        null,
    ];

    public function run(): void
    {
        $links = Links::all();

        foreach ($links as $link) {
            // Realistic distribution: most links get a few clicks, some get many
            $clickCount = $this->realisticClickCount();

            for ($i = 0; $i < $clickCount; $i++) {
                Clicks::create([
                    'link_id' => $link->id,
                    'ip_address' => fake()->ipv4(),
                    'referrer' => $this->referrers[array_rand($this->referrers)],
                    'user_agent' => $this->userAgents[array_rand($this->userAgents)],
                    'created_at' => fake()->dateTimeBetween($link->created_at, 'now'),
                    'updated_at' => fake()->dateTimeBetween($link->created_at, 'now'),
                ]);
            }
        }
    }

    private function realisticClickCount(): int
    {
        $roll = rand(1, 100);

        return match (true) {
            $roll <= 40 => rand(1, 5),    // 40% of links: low traffic
            $roll <= 70 => rand(6, 20),   // 30% of links: moderate traffic
            $roll <= 90 => rand(21, 75),  // 20% of links: good traffic
            default     => rand(76, 200), // 10% of links: viral/high traffic
        };
    }
}
