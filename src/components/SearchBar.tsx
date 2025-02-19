import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { courses } from '../data/courses';
import { useStore } from '../store/useStore';

const fuse = new Fuse(courses, {
  keys: ['name', 'tags'],
  threshold: 0.3,
});

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof courses>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setTopic, nextStep } = useStore();

  useEffect(() => {
    if (query.length > 1) {
      const results = fuse.search(query).map(result => result.item);
      setSuggestions(results.slice(0, 8));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (course: typeof courses[0]) => {
    setTopic(course);
    setQuery(course.name);
    setIsOpen(false);
    nextStep();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl ml-20">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a course..."
          className="w-full px-4 py-3 pl-12 text-lg rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto">
          {suggestions.map((course) => (
            <button
              key={course.id}
              onClick={() => handleSelect(course)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <h3 className="font-medium text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>
                <div className="flex gap-2 mt-1">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};