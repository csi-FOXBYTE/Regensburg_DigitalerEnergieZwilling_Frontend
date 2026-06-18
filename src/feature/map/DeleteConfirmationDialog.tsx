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

type Mode = 'delete' | 'download' | 'idle';

export default function DeleteConfirmationDialog() {
  const { t } = useTranslation('map');
  const [mode, setMode] = useState<Mode>('idle');
  const [deletionUrl, setDeletionUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    if (token) {
      setDeletionUrl(decodeURIComponent(token));
      setMode('delete');
      return;
    }

    const encoded = params.get('download-json');
    const filename = params.get('filename') ?? 'download.json';
    if (encoded) {
      setMode('download');
      try {
        // Payload is carried in the link itself (no backend), pretty-print on save.
        const json = JSON.stringify(
          JSON.parse(decodeURIComponent(atob(encoded))),
          null,
          2,
        );
        const blob = new Blob([json], { type: 'application/json' });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      } catch {
        // Malformed payload — nothing to download.
      }
    }
  }, []);

  function handleCancel() {
    window.history.back();
  }

  async function handleConfirm() {
    if (!deletionUrl) return;
    setLoading(true);
    try {
      await deleteSubmission(deletionUrl);
      toast.success(t('deleteConfirmationDialog.successMessage'));
      setTimeout(() => window.history.back(), 1500);
    } catch {
      toast.error(t('deleteConfirmationDialog.errorMessage'));
      setLoading(false);
    }
  }

  if (mode === 'download') {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="flex max-w-sm flex-col gap-4 text-center">
          <p className="text-lg font-semibold">{t('deleteConfirmationDialog.downloadStarted')}</p>
          <Button variant="secondary" onClick={handleCancel}>
            {t('deleteConfirmationDialog.backButton')}
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'idle') return null;

  return (
    <Dialog open onOpenChange={() => handleCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('deleteConfirmationDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('deleteConfirmationDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
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
