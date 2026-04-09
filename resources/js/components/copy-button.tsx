import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CopyButton({ text, label }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            });
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            } finally {
                document.body.removeChild(ta);
            }
        }
    };

    return (
        <Button
            variant="outline"
            size="default"
            onClick={handleCopy}
        >
            {copied ? (
                <Check data-icon="inline-start" className="text-emerald-500" />
            ) : (
                <Copy data-icon="inline-start" />
            )}
            {label && <span>{copied ? 'Copied!' : label}</span>}
        </Button>
    );
}
