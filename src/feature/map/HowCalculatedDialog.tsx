import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HowCalculatedDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation('map');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pr-8">
          <DialogTitle>{t('howCalculatedDialog.title')}</DialogTitle>
          <DialogDescription>{t('howCalculatedDialog.description')}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
