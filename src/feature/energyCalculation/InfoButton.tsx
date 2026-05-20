import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';

function InfoButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center"
    >
      <Info className="size-3.5" color="#e30613" />
    </button>
  );
}

export function InfoTooltipButton({ content }: { content: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center">
        <Info className="size-3.5" color="#e30613" />
      </TooltipTrigger>
      <TooltipContent
        className="max-w-70 rounded bg-white px-4 py-3 text-sm leading-relaxed shadow-lg"
        style={{ color: '#191919' }}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export function InfoDialogButton({
  title,
  content,
}: {
  title: ReactNode;
  content: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <InfoButton onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{content}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
