import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteSubmission } from '@/lib/api/public';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function DeleteConfirmationDialog() {
  const { t } = useTranslation('map');
  const [open, setOpen] = useState(false);
  const [deletionUrl, setDeletionUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('delete');
    if (!raw) return;

    setDeletionUrl(decodeURIComponent(raw));
    setOpen(true);

    params.delete('delete');
    const newSearch = params.toString();
    history.replaceState(null, '', newSearch ? `?${newSearch}` : window.location.pathname);
  }, []);

  async function handleConfirm() {
    if (!deletionUrl) return;
    setLoading(true);
    try {
      await deleteSubmission(deletionUrl);
      toast.success(t('deleteConfirmationDialog.successMessage'));
      setOpen(false);
    } catch {
      toast.error(t('deleteConfirmationDialog.errorMessage'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('deleteConfirmationDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('deleteConfirmationDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            {t('deleteConfirmationDialog.cancelButton')}
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading}>
            {t('deleteConfirmationDialog.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
