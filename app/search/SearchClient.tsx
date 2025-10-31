"use client";

import { SearchBar } from "@/components/SearchBar";
import { useSearch } from "@/contexts/SearchContext";

export default function SearchPage() {
    const { searchResults, isSearching } = useSearch();
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <SearchBar className="w-full max-w-2xl mx-auto" />
                    </div>

                    {/* Search Results */}
                    <div className="space-y-6">
                        {isSearching ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-muted-foreground">Searching...</span>
                                </div>
                                
                                <div className="grid grid-cols-3 w-full max-w-2xl mx-auto">
                                    <div className="bg-card animate-pulse w-full h-60"></div>
                                </div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h2>
                                <div className="space-y-4">
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className="bg-card border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                                        >
                                            <h3 className="text-lg font-medium text-foreground mb-2">
                                                {result.title || "Search Result"}
                                            </h3>
                                            <p className="text-muted-foreground mb-3">
                                                {result.description || "No description available"}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="bg-muted px-2 py-1 rounded">
                                                    {result.type || "General"}
                                                </span>
                                                {result.date && (
                                                    <span>• {new Date(result.date).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 max-w-xl mx-auto">
                                <div className="flex flex-col p-4 rounded-xl border mb-4">
                                    <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                                        <svg
                                            className="w-full h-full"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        Start your search
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Use the search bar above to find content, users, and more
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 w-full max-w-2xl mx-auto">
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                    <div className="bg-card w-full h-60"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}