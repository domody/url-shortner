import { EditIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from './ui/field';
import { Input } from './ui/input';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export function EditLink({ link }: { link: Link }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        original_url: link.original_url,
        code: link.code,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/links/${link.id}`, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                if (value) {
                    form.setData({
                        original_url: link.original_url,
                        code: link.code,
                    });
                    form.clearErrors();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size={'icon'}>
                    <EditIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit link</DialogTitle>
                    <DialogDescription>
                        Update the destination URL or custom code for this short
                        link.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel htmlFor="edit-original-url">
                            Destination URL
                        </FieldLabel>
                        <Input
                            id="edit-original-url"
                            type="url"
                            value={form.data.original_url}
                            onChange={(e) =>
                                form.setData('original_url', e.target.value)
                            }
                            placeholder="https://example.com"
                        />
                        {form.errors.original_url && (
                            <FieldError>{form.errors.original_url}</FieldError>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="edit-code">
                            Custom code{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Input
                            id="edit-code"
                            value={form.data.code}
                            onChange={(e) =>
                                form.setData('code', e.target.value)
                            }
                            placeholder={link.code}
                        />
                        {form.errors.code && (
                            <FieldError>{form.errors.code}</FieldError>
                        )}
                    </Field>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={form.processing}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
