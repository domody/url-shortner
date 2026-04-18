import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Field, FieldError, FieldGroup } from './ui/field';
import { Label } from './ui/label';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from './ui/input-group';
import { useForm } from '@inertiajs/react';
import { Spinner } from './ui/spinner';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon data-icon="inline-start" />
                            Create Short Link
                        </Button>
                    </DialogTrigger>
                    <CreateLinkDialogContent onSuccess={() => setOpen(false)} />
                </Dialog>
            </div>
        </header>
    );
}

type LinkForm = {
    original_url: string;
    code: string;
};

function CreateLinkDialogContent({ onSuccess }: { onSuccess: () => void }) {
    const { data, setData, post, errors, processing } = useForm<LinkForm>({
        original_url: '',
        code: '',
    });

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post('/create', { onSuccess });
    };

    return (
        <DialogContent className="top-[15%] translate-y-0">
            <form onSubmit={submit} className='grid gap-4'>
                <DialogHeader>
                    <DialogTitle>Create short link</DialogTitle>
                    <DialogDescription>
                        Paste a long URL to generate a short, shareable link.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="original-link">Original URL</Label>
                        <Input
                            id="original-link"
                            name="original-link"
                            placeholder="example.link.com"
                            value={data.original_url}
                            onChange={(e) =>
                                setData('original_url', e.target.value)
                            }
                            required
                        />
                        {errors.original_url && (
                            <FieldError>{errors.original_url}</FieldError>
                        )}
                    </Field>
                    <Field>
                        <Label htmlFor="custom-code">
                            Custom Code (optional)
                        </Label>
                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>
                                    {typeof window !== 'undefined' ? window.location.host + '/' : '/'}
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                id="custom-code"
                                name="custom-code"
                                placeholder="custom"
                                className="pl-0.5!"
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value)
                                }
                            />
                        </InputGroup>
                        {errors.code && <FieldError>{errors.code}</FieldError>}
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={processing}>
                        {processing && <Spinner />}
                        Create
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
