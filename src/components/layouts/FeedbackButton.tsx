import { Check, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Typography } from '../ui/typography';

const CATEGORIES = ['bug', 'improvement', 'general'] as const;
type Category = (typeof CATEGORIES)[number];

export default function FeedbackButton() {
  const { t } = useTranslation('common');

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<Category>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  function resetForm() {
    setSubmitted(false);
    setCategory('bug');
    setMessage('');
    setEmail('');
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    closeTimeout.current = setTimeout(() => setOpen(false), 2000);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="border-footer-foreground text-footer-foreground hover:bg-footer-foreground hover:text-footer w-full cursor-pointer rounded-none border bg-transparent transition-colors md:w-67.5">
          {t('footer.feedback')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3">
          <span className="bg-muted text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <MessageCircle className="size-5" />
          </span>
          <div className="flex flex-col gap-0.5">
            <DialogTitle>{t('feedback.title')}</DialogTitle>
            <DialogDescription>{t('feedback.subtitle')}</DialogDescription>
          </div>
        </DialogHeader>
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="size-8" />
            </span>
            <div className="flex flex-col gap-1">
              <Typography variant="h4">
                {t('feedback.success.title')}
              </Typography>
              <Typography variant="muted">
                {t('feedback.success.message')}
              </Typography>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="feedback-category">
                  {t('feedback.category.label')}
                </FieldLabel>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as Category)}
                >
                  <SelectTrigger id="feedback-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`feedback.category.options.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="feedback-message">
                  {t('feedback.message.label')}{' '}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id="feedback-message"
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t('feedback.message.placeholder')}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="feedback-email">
                  {t('feedback.email.label')}{' '}
                  <Typography as="span" variant="muted">
                    {t('feedback.email.optional')}
                  </Typography>
                </FieldLabel>
                <Input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('feedback.email.placeholder')}
                />
                <FieldDescription>{t('feedback.email.hint')}</FieldDescription>
              </Field>

              <div className="bg-muted border-input-border border p-4">
                <Typography variant="small" className="text-muted-foreground">
                  {t('feedback.privacyNotice')}
                </Typography>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!message.trim()}
              >
                <Send className="size-5" /> {t('feedback.submit')}
              </Button>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
