"use client";
import { languages } from "@/data/learn";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  List,
  CheckCircle,
  BookOpen,
  Headphones,
  Star,
  X, Volume2, Timer, EllipsisVertical
} from "lucide-react";
import { useIsTablet } from "@/components/ui/use-tablet"; // Make sure this exists
import { useRouter } from "next/navigation";

function sanitizeUrl(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

export default function UnitPage({
  params: paramsPromise,
}: {
  params: Promise<{
    language: string;
    "section-title": string;
    "unit-title": string;
    lessonId?: string | string[];
  }>;
}) {
  const params = React.use(paramsPromise);
  const language = languages[params.language as keyof typeof languages];
  const section = language?.sections.find(
    (s) => sanitizeUrl(s.title) === params["section-title"]
  );
  const unit = section?.units.find((u) => sanitizeUrl(u.title) === params["unit-title"]);
  const isTablet = useIsTablet();
  const isLarge = !isTablet; // You can refine this if you have a useIsLarge hook

  if (!unit || !section) return <div>Unit not found</div>;

  // Use lessons directly from centralized data
  const lessons = unit.lessons.map((lesson, idx) => ({
    ...lesson,
    title: `Lesson ${idx + 1}: ${lesson.phrase}`,
    done: lesson.completed || false,
    href: `/learn/${params.language}/${sanitizeUrl(section.title)}/${sanitizeUrl(unit.title)}/${lesson.id}`,
  }));

  // State for selected lesson and list visibility
  const lessonId = params.lessonId; // get from params if available
  const initialIdx = lessons.findIndex((l) => l.id === lessonId);
  const [selectedIdx, setSelectedIdx] = useState(initialIdx >= 0 ? initialIdx : 0);
  const [showList, setShowList] = useState(isLarge);

  const selectedLesson = lessons[selectedIdx];

  function stepIcon(type: string, done: boolean) {
    if (done) return <CheckCircle className="text-blue-400 w-5 h-5" />;
    switch (type) {
      case "lesson":
        return <BookOpen className="text-blue-400 w-10 h-10" />;
      case "audio":
        return <Headphones className="text-pink-400 w-10 h-10" />;
      case "checkpoint":
        return <Star className="text-yellow-400 w-10 h-10" />;
      case "practice":
        return <BookOpen className="text-green-400 w-10 h-10" />;
      default:
        return <BookOpen className="text-blue-400 w-10 h-10" />;
    }
  }

  // Player component
  function LessonPlayer({ lesson }: { lesson: typeof lessons[0] }) {
    // Add state for answer selection
    const [selected, setSelected] = useState<string[]>([]);
    const [timer] = useState(5);
    const router = useRouter();

    const handleWordClick = (word: string) => {
      if (!selected.includes(word)) setSelected([...selected, word]);
    };
    const handleRemove = (word: string) => {
      setSelected(selected.filter((w) => w !== word));
    };

    return (
      <>
            {/* Progress bar and close */}
            <div className="w-full flex items-center px-8 pt-6">
              <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#22c55e] w-1/3" />
              </div>
              <div className="flex items-center gap-1">
                <Timer className="text-red-500" />
                <span className="text-red-500 font-bold">{timer}s</span>
              </div>
            </div>
      
            {/* Prompt */}
            <div className="mt-8 text-2xl font-bold text-white text-center">
              {lesson.prompt}
            </div>
      
            {/* Mascot and phrase */}
            <div className="flex items-center justify-center mt-6 mb-4">
              <img
                src="/images/mascot.png"
                alt="Mascot"
                className="w-20 h-20 rounded-full bg-[#23263a] mr-4"
              />
              <div className="flex items-center gap-2 bg-[#23263a] px-4 py-2 rounded-lg">
                <Volume2 className="text-[#22c55e]" />
                <span className="text-lg text-white font-mono">{lesson.phrase}</span>
              </div>
            </div>
      
            {/* Answer area */}
            <div className="flex flex-wrap min-h-[48px] items-center justify-center border-b border-gray-700 w-full max-w-xl mx-auto mb-6 pb-2">
              {selected.map((word) => (
                <button
                  key={word}
                  onClick={() => handleRemove(word)}
                  className="bg-[#23263a] text-white px-4 py-2 rounded-lg m-1 border border-[#22c55e] font-semibold"
                >
                  {word}
                </button>
              ))}
            </div>
      
            {/* Word bank */}
            <div className="flex flex-wrap justify-center gap-2 w-full max-w-xl mb-10">
              {lesson.wordBank.map((word) => (
                <button
                  key={word}
                  onClick={() => handleWordClick(word)}
                  disabled={selected.includes(word)}
                  className={`px-4 py-2 rounded-lg border border-gray-600 font-semibold text-white transition ${
                    selected.includes(word)
                      ? "opacity-40 cursor-not-allowed text-black dark:text-gray-400"
                      : "bg-[#23263a] hover:bg-[#22c55e] hover:text-black"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
      
            {/* Bottom buttons */}
            <div className="flex justify-between w-full max-w-xl px-4">
              <button
                className="bg-transparent border border-gray-600 text-gray-400 px-8 py-2 rounded-xl font-bold"
                disabled
              >
                SKIP
              </button>
              <button
                className="bg-[#22c55e] text-black px-8 py-2 rounded-xl font-bold"
                disabled
              >
                CHECK
              </button>
            </div>
      </>
    );
  }

  // Lessons List
  function LessonList({
    onSelect,
    onClose,
  }: {
    onSelect: (idx: number) => void;
    onClose?: () => void;
  }) {
    const router = useRouter();
    return (
      <div className="w-80 max-w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-10%)] flex flex-col relative">
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        )}
        <h3 className="text-lg font-bold mb-4">Lessons</h3>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => {
                onSelect(idx);
                // Update the route to include the lesson id
                router.push(
                  `/learn/${params.language}/${params["section-title"]}/${params["unit-title"]}/${lesson.id}`
                );
                if (onClose) onClose();
              }}
              className={`flex items-center justify-between px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left ${
                selectedIdx === idx ? "bg-sky-100 dark:bg-sky-900" : ""
              }`}
            >
              <span className="font-medium">{lesson.title}</span>
              {stepIcon(lesson.type || "lesson", lesson.done)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Navigation actions
  function handlePrev() {
    setSelectedIdx((idx) => (idx > 0 ? idx - 1 : idx));
  }
  function handleNext() {
    setSelectedIdx((idx) => (idx < lessons.length - 1 ? idx + 1 : idx));
  }
  function handleToggleList() {
    setShowList((v) => !v);
  }

  return (
    <div className="min-h-screen flex flex-col px-2">
      <div className="mb-2 mt-4 px-4 flex items-center flex-wrap gap-2 w-full text-xl font-semibold">
        <Link
          href={`/learn/${params.language}`}
          className="hover:underline text-gray-500"
        >
          {params["language"]}
        </Link>
        <ChevronLeft className="rotate-180 w-5 h-5 text-gray-400" />
        <Link
          href={`/learn/${params.language}/${params["section-title"]}`}
          className="hover:underline text-gray-500"
        >
          {params["section-title"]}
        </Link>
        <ChevronLeft className="rotate-180 w-5 h-5 text-gray-400" />
        <span className="capitalize text-sky-400">{params["unit-title"]}</span>
      </div>
      <div className="flex-1 flex w-full mt-4 relative p-4">
        {/* Sidebar for large screens */}
        {isLarge && showList && (
          <div className="hidden lg:block h-full mr-6">
            <LessonList onSelect={setSelectedIdx} />
          </div>
        )}
        {/* Player */}
        <div className="flex-1 flex flex-col items-center border-2 rounded-xl">
          <LessonPlayer lesson={selectedLesson} />
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handlePrev}
              disabled={selectedIdx === 0}
              variant="outline"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </Button>
            <Button onClick={handleToggleList} variant="secondary" className="text-black">
              <List className="w-5 h-5 mr-2" />
              {showList ? "Hide Lessons" : "Show Lessons"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedIdx === lessons.length - 1}
              variant="outline"
            >
              Next <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Popup for small screens/tablet */}
        {!isLarge && showList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <LessonList
              onSelect={setSelectedIdx}
              onClose={() => setShowList(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
