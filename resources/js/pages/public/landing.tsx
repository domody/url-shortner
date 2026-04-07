import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Button } from '@/components/ui/button';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-row items-center justify-center gap-2">
                <Button asChild>
                    <Link href={login()} prefetch>Login</Link>
                </Button>
                <Button variant={'secondary'} asChild>
                    <Link href={register()}>Register</Link>
                </Button>
            </div>
        </>
    );
}
