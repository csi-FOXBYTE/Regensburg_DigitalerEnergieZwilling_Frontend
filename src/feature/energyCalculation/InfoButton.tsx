import { Info } from 'lucide-react';
import { type ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';

function InfoButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
    >
      <Info className="size-3.5" />
    </button>
  );
}

export function InfoTooltipButton({ content }: { content: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger className="inline-flex cursor-pointer items-center text-muted-foreground hover:text-foreground">
        <Info className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}

export function InfoDialogButton({ onClick }: { onClick: () => void }) {
  return <InfoButton onClick={onClick} />;
}
