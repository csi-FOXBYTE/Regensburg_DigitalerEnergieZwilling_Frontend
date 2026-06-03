import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SavedSession } from '@/lib/state/session';
import {
  clearLastActive,
  getLastActiveSession,
  loadSession,
} from '@/lib/state/session';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SessionResumeDialog() {
  const { t } = useTranslation('map');
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SavedSession | null>(null);

  useEffect(() => {
    const s = getLastActiveSession();
    if (s) {
      setSession(s);
      setOpen(true);
    }
  }, []);

  const handleContinue = () => {
    if (!session) return;
    loadSession(session.building.id);
    setOpen(false);
  };

  const handleDismiss = () => {
    clearLastActive();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('sessionResumeDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('sessionResumeDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleDismiss}>
            {t('sessionResumeDialog.dismissButton')}
          </Button>
          <Button onClick={handleContinue}>
            {t('sessionResumeDialog.continueButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
