"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

interface Language {
  id: number;
  label: string;
  flag: string;
  code: string;
}

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("us");
  const [searchQuery, setSearchQuery] = useState("");

  const languages: Language[] = [
    { id: 1, label: "English", flag: "us", code: "en" },
    { id: 2, label: "Spanish", flag: "es", code: "es" },
    { id: 3, label: "French", flag: "fr", code: "fr" },
    { id: 4, label: "German", flag: "de", code: "de" },
    { id: 5, label: "Italian", flag: "it", code: "it" },
    { id: 6, label: "Portuguese", flag: "pt", code: "pt" },
  ];

  const getCurrentLanguageData = () => {
    return languages.find(lang => lang.flag === currentLanguage) || languages[0];
  };

  const filteredLanguages = languages.filter(language =>
    language.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex items-center ${className || ""}`}>
      <DropdownMenu
        open={isLanguageOpen}
        onOpenChange={setIsLanguageOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg border-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <img
              src={`/flag/${getCurrentLanguageData().flag}.png`}
              alt={`${getCurrentLanguageData().label} flag`}
              className="w-5 h-5 rounded-sm object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {getCurrentLanguageData().label} (U.S.)
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-0 rounded-xl border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredLanguages.map((language) => (
              <DropdownMenuItem
                key={language.id}
                onClick={() => {
                  setCurrentLanguage(language.flag);
                  setSearchQuery("");
                  setIsLanguageOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src={`/flag/${language.flag}.png`}
                  alt={`${language.label} flag`}
                  className="w-6 h-6 rounded-sm object-cover flex-shrink-0"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {language.label}
                </span>
              </DropdownMenuItem>
            ))}
            {filteredLanguages.length === 0 && (
              <div className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                No languages found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}