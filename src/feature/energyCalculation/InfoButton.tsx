import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

function InfoButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center"
    >
      <Info className="size-3.5 text-muted-foreground group-hover:text-[#e30613]" />
    </button>
  );
}

export function InfoTooltipButton({ content }: { content: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
          className="group text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center"
        >
          <Info className="size-3.5 text-muted-foreground group-hover:text-[#e30613]" />
        </TooltipTrigger>
        <TooltipContent
          className="max-w-70 rounded bg-white px-4 py-3 text-sm leading-relaxed shadow-lg"
          style={{ color: '#191919' }}
          onEscapeKeyDown={() => setOpen(false)}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function InfoDialogButton({
  title,
  content,
  media,
}: {
  title: ReactNode;
  content: ReactNode;
  media?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <InfoButton onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {media}
            <DialogDescription>{content}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
