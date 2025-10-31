"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dot } from "@/components/ui/dot";
import { Button } from "@/components/ui/button";
import { Play, BatteryCharging, Clock, Combine, CircleCheck } from "lucide-react";

interface LanguageCardProps {
  language: {
    name: string;
    flag: string;
    country: string;
    level: string;
    progress: number;
    lessons: number;
    learned: number;
    description: string;
  };
  onLanguageSelect: (language: string) => void;
  onCardClick: (languageName: string) => void;
  isContinous?: boolean;
}

export function LanguageCard({
  language,
  onLanguageSelect,
  onCardClick,
  isContinous = false,
}: LanguageCardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Card
      className="rounded-3xl border-2 hover:border-primary dark:bg-[#0d1117] dark:border-gray-700 transition-all duration-200 cursor-pointer-custom group hover:shadow-lg"
      onClick={() => onCardClick(language.name)}
    >
      <CardContent
        className="p-5 px-6 relative"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card's onClick from firing
          onLanguageSelect(language.name);
        }}
      >
        {isContinous && language.learned === language.lessons && (
          <CircleCheck className="size-6 absolute top-2 right-2 text-green-500" />
        )}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center">
            <img
              src={`/flag/${language.flag}.png`}
              alt={`${language.country} flag`}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex flex-col items-center justify-center cursor-pointer-custom">
            <span className="text-xl font-semibold">{language.name}</span>
            <h3 className="text-foreground text-center text-gray-800 dark:text-[#fafafa]">
              {language.country}
            </h3>
          </div>
        </div>
        <div className="w-full flex items-center justify-center flex-col mt-2">
          <div className="w-full flex items-center justify-center space-x-2 mb-1 text-gray-500 dark:text-[#fafafa]/60">
            <div className="flex items-center space-x-1 text-gray-500 dark:text-[#fafafa]/60">
              {language.progress === 0 && (
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3697 4.89109L13.5097 2.28109C12.6497 1.90109 11.3497 1.90109 10.4897 2.28109L4.62969 4.89109C3.14969 5.55109 2.92969 6.45109 2.92969 6.93109C2.92969 7.41109 3.14969 8.31109 4.62969 8.97109L10.4897 11.5811C10.9197 11.7711 11.4597 11.8711 11.9997 11.8711C12.5397 11.8711 13.0797 11.7711 13.5097 11.5811L19.3697 8.97109C20.8497 8.31109 21.0697 7.41109 21.0697 6.93109C21.0697 6.45109 20.8597 5.55109 19.3697 4.89109Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.0003 17.04C11.6203 17.04 11.2403 16.96 10.8903 16.81L4.15031 13.81C3.12031 13.35 2.32031 12.12 2.32031 10.99C2.32031 10.58 2.65031 10.25 3.06031 10.25C3.47031 10.25 3.80031 10.58 3.80031 10.99C3.80031 11.53 4.25031 12.23 4.75031 12.45L11.4903 15.45C11.8103 15.59 12.1803 15.59 12.5003 15.45L19.2403 12.45C19.7403 12.23 20.1903 11.54 20.1903 10.99C20.1903 10.58 20.5203 10.25 20.9303 10.25C21.3403 10.25 21.6703 10.58 21.6703 10.99C21.6703 12.11 20.8703 13.35 19.8403 13.81L13.1003 16.81C12.7603 16.96 12.3803 17.04 12.0003 17.04Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.0003 22.0009C11.6203 22.0009 11.2403 21.9209 10.8903 21.7709L4.15031 18.7709C3.04031 18.2809 2.32031 17.1709 2.32031 15.9509C2.32031 15.5409 2.65031 15.2109 3.06031 15.2109C3.47031 15.2109 3.80031 15.5409 3.80031 15.9509C3.80031 16.5809 4.17031 17.1509 4.75031 17.4109L11.4903 20.4109C11.8103 20.5509 12.1803 20.5509 12.5003 20.4109L19.2403 17.4109C19.8103 17.1609 20.1903 16.5809 20.1903 15.9509C20.1903 15.5409 20.5203 15.2109 20.9303 15.2109C21.3403 15.2109 21.6703 15.5409 21.6703 15.9509C21.6703 17.1709 20.9503 18.2709 19.8403 18.7709L13.1003 21.7709C12.7603 21.9209 12.3803 22.0009 12.0003 22.0009Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {language.progress > 0 ? (
                <span className="text-sm line-clamp-1">{language.learned}/{language.lessons}</span>
              ) : (
                <span className="text-sm line-clamp-1">{language.lessons} Sections</span>
              )}
            </div>
            {language.progress > 0 && (
              <>
                <Dot />
                <div className="flex flex-row items-center gap-2">
                  <div className="flex items-center space-x-1 text-[#ffc600] dark:text-[#8ddeed]">
                    <span className="text-sm font-medium">
                      {Math.floor((language.learned / language.lessons) * 100)}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="w-full dark:text-[#8ddeed] text-sky-500 text-foreground text-center font-semibold">
            {language.learned} Learners
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
