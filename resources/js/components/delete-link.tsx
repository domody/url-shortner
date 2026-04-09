import { Trash2Icon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export function DeleteLink({ link }: { link: Link }) {
    const [check, setCheck] = useState('');

    const handleDelete = (link: Link) => {
        router.delete(`/links/${link.id}`);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size={'icon'}>
                    <Trash2Icon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your URL from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                    <FieldLabel htmlFor="code-verification" className="gap-1">
                        Enter the URL code
                        <span className="font-bold">{link.code}</span> to
                        continue:
                    </FieldLabel>
                    <Input
                        value={check}
                        onChange={(e) => setCheck(e.target.value)}
                        id="code-verification"
                        autoComplete="off"
                    />
                </Field>

                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={check != link.code}
                        onClick={() => handleDelete(link)}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
