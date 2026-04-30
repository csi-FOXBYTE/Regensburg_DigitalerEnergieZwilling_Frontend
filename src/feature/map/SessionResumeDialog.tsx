import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SessionResumeDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation('map');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('sessionResumeDialog.title')}</DialogTitle>
          <DialogDescription>{t('sessionResumeDialog.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary">{t('sessionResumeDialog.dismissButton')}</Button>
          <Button>{t('sessionResumeDialog.continueButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
