import { Search } from 'lucide-react';

export default function FeeFilters({ filterStatus, onFilterChange, searchTerm, onSearchChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'partial', label: 'Partial' },
    { value: 'due', label: 'Due' },
  ];
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>
      
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}