import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

// suggest search result list
function fuzzyMatch(str, pattern) {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  let patternIdx = 0;
  let strIdx = 0;
  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  return patternIdx === pattern.length;
}

function Navbar({ cartItemsCount, onCartClick, onSearch, products }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredSuggestions = products
        .filter(product => 
          fuzzyMatch(product.name, query) || 
          fuzzyMatch(product.description, query)
        )
        .slice(0, 5); // allow maximum 5  
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    onSearch(productName);
    setShowSuggestions(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');  
  };

  const handleFocus = () => {
    if (isMobile) {
      document.body.classList.add('search-focused');
    }
  };

  const handleBlur = () => {
    if (isMobile) {
      setTimeout(() => {
        document.body.classList.remove('search-focused');
      }, 200); 
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={handleLogoClick}>
            <img src="/tab.png" alt="KingFlex Logo" />
          </Link>
        </div>
        <div className="search-container" ref={searchRef}>
          <form className="search" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button type="submit"><i className="fas fa-search"></i></button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((product, index) => (
                <li key={index} onClick={() => handleSuggestionClick(product.name)}>
                  <img src={product.image} alt={product.name} className="suggestion-image" />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{product.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="nav-right">
          <div className="nav-icons">
            <Link to="/user" aria-label="User Profile">
              <i className="fas fa-user"></i>
            </Link>
            <button className="cart-icon" onClick={onCartClick} aria-label="Shopping Cart">
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && <span className="cart-quantity">{cartItemsCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;