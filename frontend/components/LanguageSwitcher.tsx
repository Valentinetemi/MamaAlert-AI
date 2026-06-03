'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇪' },
  { code: 'pcm', name: 'Pidgin', flag: '🇳🇬' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-gray-300 text-gray-900 hover:bg-gray-50"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${
              language === lang.code ? 'bg-[#a8c5a3]/10' : ''
            }`}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {language === lang.code && (
              <span className="text-[#a8c5a3]">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
