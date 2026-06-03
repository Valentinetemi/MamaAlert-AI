'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations, type TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['en'][key];
  };

  return { t, language };
}
