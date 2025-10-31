"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";

interface SearchBarProps {
    className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use search context
    const {
        searchValue,
        setSearchValue,
        recentSearches,
        popularSearches,
        filteredSuggestions,
        isSearching,
        clearRecentSearches,
        performSearch
    } = useSearch();

    // Determine what to show in the dropdown
    const showFilteredSuggestions = searchValue.trim().length > 0 && filteredSuggestions.length > 0;
    const showDefaultContent = searchValue.trim().length === 0;

    // Get current suggestions for keyboard navigation
    const currentSuggestions = showFilteredSuggestions ? filteredSuggestions :
        showDefaultContent ? [
            ...recentSearches.slice(0, 3),
            ...popularSearches.slice(0, 3)
        ] : [];

    // Reset selected index when suggestions change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [filteredSuggestions, isExpanded]);

    // Handle clicks outside to close the expanded search
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setIsExpanded(true); // Show dropdown when typing
        setSelectedIndex(-1); // Reset selection
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isExpanded) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < currentSuggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < currentSuggestions.length) {
                    handleSuggestionClick(currentSuggestions[selectedIndex].query);
                } else if (searchValue.trim()) {
                    handleSearchSubmit(e as any);
                }
                break;
            case 'Escape':
                setIsExpanded(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            performSearch(searchValue);
            setIsExpanded(false);
        }
    };

    const handleSuggestionClick = (query: string) => {
        setSearchValue(query);
        performSearch(query);
        setIsExpanded(false);
    };

    return (
        <div ref={containerRef} className={cn("relative w-full max-w-lg mx-auto", className)}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="UNN vice chancellor..."
                        value={searchValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full h-12 pl-10 pr-4 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                            "transition-all duration-200",
                            "hover:border-primary/50"
                        )}
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={() => setSearchValue("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            </form>

            {/* Expanded Search Dropdown */}
            {isExpanded && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-2xl shadow-xl z-50 max-h-80 overflow-hidden">
                    <div className="p-3 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                        {/* Filtered Suggestions based on input */}
                        {showFilteredSuggestions && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                    Suggestions for "{searchValue}"
                                </h3>
                                <div className="space-y-0.5">
                                    {filteredSuggestions.map((item, index) => {
                                        const isFromRecent = recentSearches.some(recent => recent.id === item.id);
                                        const isSelected = selectedIndex === index;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSuggestionClick(item.query)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left group",
                                                    isSelected ? "bg-muted" : "hover:bg-muted"
                                                )}
                                            >
                                                {isFromRecent ? (
                                                    <Clock className="size-4 text-muted-foreground group-hover:text-foreground" />
                                                ) : (
                                                    <TrendingUp className="size-4 text-muted-foreground group-hover:text-foreground" />
                                                )}
                                                <span className="text-sm text-foreground">
                                                    {item.query}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Loading state when searching */}
                        {searchValue.trim().length > 0 && isSearching && (
                            <div className="flex items-center justify-center py-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    {/* <span className="text-sm">Finding suggestions...</span> */}
                                </div>
                            </div>
                        )}

                        {/* Default content when no search input */}
                        {showDefaultContent && (
                            <>
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Recents</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearRecentSearches}
                                                className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                                            >
                                                Delete all
                                            </Button>
                                        </div>
                                        <div className="space-y-0.5">
                                            {recentSearches.slice(0, 3).map((item, index) => {
                                                const isSelected = selectedIndex === index;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleSuggestionClick(item.query)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left group",
                                                            isSelected ? "bg-muted" : "hover:bg-muted"
                                                        )}
                                                    >
                                                        <Clock className="size-4 text-muted-foreground group-hover:text-foreground" />
                                                        <span className="text-sm text-foreground">{item.query}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Popular Searches */}
                                {popularSearches.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular searches</h3>
                                        <div className="space-y-0.5">
                                            {popularSearches.slice(0, 3).map((item, index) => {
                                                const adjustedIndex = index + recentSearches.slice(0, 3).length;
                                                const isSelected = selectedIndex === adjustedIndex;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleSuggestionClick(item.query)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left group",
                                                            isSelected ? "bg-muted" : "hover:bg-muted"
                                                        )}
                                                    >
                                                        <TrendingUp className="size-4 text-muted-foreground group-hover:text-foreground" />
                                                        <span className="text-sm text-foreground">{item.query}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* AI-powered suggestions */}
                                <div className="border-t pt-3">
                                    <div className="space-y-0.5">
                                        <button
                                            onClick={() => handleSuggestionClick("Create AI image")}
                                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-left group"
                                        >
                                            <div className="size-4 flex items-center justify-center">
                                                <div className="size-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                                            </div>
                                            <span className="text-sm text-foreground">Create AI Image</span>
                                        </button>
                                        <button
                                            onClick={() => handleSuggestionClick("Create AI icon and sticker")}
                                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-left group"
                                        >
                                            <div className="size-4 flex items-center justify-center">
                                                <div className="size-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
                                            </div>
                                            <span className="text-sm text-foreground">Create AI icon and sticker</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Show message when there are no filtered suggestions */}
                        {searchValue.trim().length > 0 && !isSearching && filteredSuggestions.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">
                                    No suggestions found for "{searchValue}"
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Press Enter to search anyway
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}