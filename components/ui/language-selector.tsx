"use client";
import { useState } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  currentLocale: string;
  onLanguageChange: (locale: string) => void;
  className?: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'jv', name: 'Basa Jawa', flag: '🇮🇩' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageSelector({ 
  currentLocale, 
  onLanguageChange, 
  className 
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          className={cn(
            "flex items-center gap-2 text-white hover:text-gray-300 sm:hover:text-gray-400 bg-transparent p-0",
            className
          )}
        >
          <span className="inline">{currentLanguage.flag}</span>
          <span className="text-white inline uppercase">{currentLanguage.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 scrollbar-dark bg-gray-900 border-gray-700 max-h-[200px] overflow-y-auto">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              onLanguageChange(language.code);
              setOpen(false);
            }}
            className={cn(
              "flex items-center gap-3 cursor-pointer text-white hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-150",
              currentLocale === language.code && "bg-gray-700 text-gray-100"
            )}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {currentLocale === language.code && (
              <span className="ml-auto text-xs text-green-400 font-semibold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}








