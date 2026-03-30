import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export default function FeedbackButton() {
  const { t } = useTranslation('common');

  return (
    <Button className="border-footer-foreground text-footer-foreground hover:bg-footer-foreground hover:text-footer w-full cursor-pointer rounded-none border bg-transparent transition-colors md:w-67.5">
      {t('footer.feedback')}
    </Button>
  );
}
