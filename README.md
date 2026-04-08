# URL Shortener

A URL shortening service with click analytics. Paste a long URL, get a short one, and track how it performs over time.

---

## Getting Started

### Requirements

- PHP 8.1+
- Composer
- Node.js & npm
- A database supported by Laravel (MySQL, PostgreSQL, or SQLite)

### Setup

1. **Install PHP dependencies**

    ```bash
    composer install
    ```

2. **Install JS dependencies and build assets**

    ```bash
    npm install && npm run build
    ```

3. **Copy the environment file**

    ```bash
    cp .env.example .env
    ```

4. **Generate the app key**

    ```bash
    php artisan key:generate
    ```

5. **Configure your database**
   Open `.env` and update the `DB_*` values to match your local setup.

6. **Run migrations and seed the database**
    ```bash
    php artisan migrate --seed
    ```

Once set up, serve the app however you prefer: Laravel Herd, `php artisan serve`, or any other local server.

---

## Default Account

| Field    | Value            |
| -------- | ---------------- |
| Email    | test@example.com |
| Password | password         |

Log in at `/login` to access the dashboard where you can create and manage your shortened URLs.

---

## Features

- Shorten any URL and get a clean, shareable short link
- Automatic redirect when a short link is visited
- Per-link analytics tracking clicks, timestamps, referrers, and user agents
- Analytics dashboard with click totals and a breakdown over time
- Seeded demo data so the app is populated and ready to explore on first run
