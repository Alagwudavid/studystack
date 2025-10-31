"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface SearchItem {
    id: string;
    query: string;
    timestamp?: number;
}

interface SearchResult {
    title?: string;
    description?: string;
    type?: string;
    date?: string;
}

interface SearchContextType {
    searchValue: string;
    setSearchValue: (value: string) => void;
    recentSearches: SearchItem[];
    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;
    removeRecentSearch: (id: string) => void;
    popularSearches: SearchItem[];
    filteredSuggestions: SearchItem[];
    isSearching: boolean;
    performSearch: (query: string) => void;
    searchResults: SearchResult[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const [searchValue, setSearchValue] = useState("");
    const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<SearchItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // Popular searches (these could come from an API in a real app)
    const popularSearches: SearchItem[] = [
        { id: "pop-1", query: "Paper texture" },
        { id: "pop-2", query: "Instagram mockup" },
        { id: "pop-3", query: "Football" },
        { id: "pop-4", query: "Social media icons" },
        { id: "pop-5", query: "Business icons" },
        { id: "pop-6", query: "Arrow icons" },
        { id: "pop-7", query: "User interface" },
        { id: "pop-8", query: "Logo design" },
        { id: "pop-9", query: "Web icons" },
        { id: "pop-10", query: "Mobile app" },
    ];

    // Debounced search effect
    useEffect(() => {
        if (searchValue.trim()) {
            setIsSearching(true);
        }

        const timer = setTimeout(() => {
            if (searchValue.trim()) {
                // Filter suggestions based on search value
                const query = searchValue.toLowerCase().trim();
                const filtered = [
                    ...recentSearches.filter(item =>
                        item.query.toLowerCase().includes(query)
                    ),
                    ...popularSearches.filter(item =>
                        item.query.toLowerCase().includes(query) &&
                        !recentSearches.some(recent => recent.query.toLowerCase() === item.query.toLowerCase())
                    )
                ].slice(0, 6); // Limit to 6 suggestions

                setFilteredSuggestions(filtered);
            } else {
                setFilteredSuggestions([]);
            }
            setIsSearching(false);
        }, 2000); // 2 second debounce

        return () => {
            clearTimeout(timer);
            if (!searchValue.trim()) {
                setIsSearching(false);
            }
        };
    }, [searchValue, recentSearches]);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("bitroot-recent-searches");
            if (saved) {
                const parsed = JSON.parse(saved);
                setRecentSearches(parsed);
            }
        } catch (error) {
            console.error("Failed to load recent searches:", error);
        }
    }, []);

    // Save recent searches to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem("bitroot-recent-searches", JSON.stringify(recentSearches));
        } catch (error) {
            console.error("Failed to save recent searches:", error);
        }
    }, [recentSearches]);

    const addRecentSearch = (query: string) => {
        if (!query.trim()) return;

        const normalizedQuery = query.trim().toLowerCase();

        setRecentSearches(prev => {
            // Remove existing entry if it exists
            const filtered = prev.filter(item => item.query.toLowerCase() !== normalizedQuery);

            // Add new entry at the beginning
            const newItem: SearchItem = {
                id: `recent-${Date.now()}`,
                query: query.trim(),
                timestamp: Date.now()
            };

            // Keep only the last 10 recent searches
            return [newItem, ...filtered].slice(0, 10);
        });
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    const removeRecentSearch = (id: string) => {
        setRecentSearches(prev => prev.filter(item => item.id !== id));
    };

    const performSearch = (query: string) => {
        if (!query.trim()) return;

        // Set searching state
        setIsSearching(true);

        // Add to recent searches
        addRecentSearch(query);

        // Simulate search results (replace with actual API call)
        setTimeout(() => {
            const mockResults: SearchResult[] = [
                {
                    title: `Results for "${query}"`,
                    description: `Finding content related to ${query}`,
                    type: "Search",
                    date: new Date().toISOString()
                },
                {
                    title: `${query} Icons`,
                    description: `Icon collection for ${query}`,
                    type: "Icons",
                    date: new Date().toISOString()
                },
                {
                    title: `${query} Templates`,
                    description: `Design templates related to ${query}`,
                    type: "Templates",
                    date: new Date().toISOString()
                }
            ];

            setSearchResults(mockResults);
            setIsSearching(false);
        }, 1000);

        // Here you would typically perform the actual search API call
        console.log("Performing search for:", query);
    };

    const contextValue: SearchContextType = {
        searchValue,
        setSearchValue,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        removeRecentSearch,
        popularSearches,
        filteredSuggestions,
        isSearching,
        performSearch,
        searchResults,
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}