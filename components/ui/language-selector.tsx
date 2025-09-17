"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 text-white hover:text-gray-300 sm:hover:text-gray-400 bg-transparent p-0",
          className
        )}
      >
        <span className="inline">{currentLanguage.flag}</span>
        <span className="text-white inline uppercase">{currentLanguage.code}</span>
      </Button>
      
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
          <div 
            className="max-h-[200px] overflow-y-auto scrollbar-dark"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-150 first:rounded-t-md last:rounded-b-md",
                  currentLocale === language.code && "bg-gray-700 text-gray-100"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {currentLocale === language.code && (
                  <span className="text-xs text-green-400 font-semibold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}