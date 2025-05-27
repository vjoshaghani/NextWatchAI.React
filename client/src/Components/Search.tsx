// src/Components/Search.tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type SearchProps = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
};

function Search({ searchTerm, setSearchTerm }: SearchProps) {
    return (
        <div className="relative my-6">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="w-5 h-5 opacity-70" />
            </span>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a movie..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-[#0F172A] text-white placeholder-gray-400 shadow-sm"
            />
        </div>
    );
}

export default Search;
