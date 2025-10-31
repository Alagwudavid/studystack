export function SkeletonTopBar() {
return( 
    <header className="fixed top-0 z-40 w-full h-14 pl-5 lg:pl-8 pr-8 grid grid-cols-[1fr_auto_1fr] gap-1 md:grid-cols-[minmax(100px,_1fr)_minmax(300px,_auto)_minmax(100px,_1fr)] md:gap-4 theme-aware">
        <div role="status" className="max-w-xs space-x-4 rounded-sm shadow-sm animate-pulse flex items-center justify-start">
            <div className="flex items-center">
                <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-700 w-10"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
        <div role="status" className="max-w-xs space-x-4 rounded-sm shadow-sm animate-pulse">
        </div>
        <div role="status" className="max-w-xs space-x-4 rounded-sm shadow-sm animate-pulse flex items-center justify-end">
            <div className="flex items-center">
                <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-700 w-10"></div>
            </div>
            <div className="flex items-center">
                <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-700 w-10"></div>
            </div>
            <div className="flex items-center">
                <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-700 w-10"></div>
            </div>
            <div className="flex items-center">
                <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-700 w-10"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    </header>
)};