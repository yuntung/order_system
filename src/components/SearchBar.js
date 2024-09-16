import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, products }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = products
        .filter(product => 
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
        )
        .map(product => product.name)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar-container" ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;