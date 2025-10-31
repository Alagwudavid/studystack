export function SkeletonSide() {
return( 
    <div role="status" className="max-w-xs mt-14 p-4 space-y-4 rounded-sm shadow-sm animate-pulse">
        <div className="flex items-center justify-between gap-2">
            <div className="h-12 shrink-0 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-4">
            <div className="h-12 shrink-0 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-4">
            <div className="h-12 shrink-0 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-4">
            <div className="h-12 shrink-0 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-4">
            <div className="h-12 shrink-0 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <span className="sr-only">Loading...</span>
    </div>
)};