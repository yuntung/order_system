import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        .slice(0, 5);
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

  const renderSearchBar = () => (
    <div className="search-container" ref={searchRef}>
      <form className="search" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search products, brands, and more..." 
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit"><i className="fas fa-search"></i></button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((product, index) => (
            <li key={index} onClick={() => handleSuggestionClick(product.name)}>
              <img src={product.image} alt={product.name} className="suggestion-image" />
              <span className="suggestion-name">{product.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-top">
        {!isMobile && (
          <>
            <div className="logo">
              <Link to="/" onClick={handleLogoClick}>
                <img src="/KING_FLEX.png" alt="KingFlex Logo" />
              </Link>
            </div>
            {renderSearchBar()}
            <div className="navbar-actions">
              <Link to="/user" className="account-icon">
                <i className="fas fa-user"></i>
                <span>Account</span>
              </Link>
              <button className="cart-icon" onClick={onCartClick}>
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
                {cartItemsCount > 0 && <span className="cart-quantity">{cartItemsCount}</span>}
              </button>
            </div>
          </>
        )}
        {isMobile && (
          <>
            <Link to="/user" className="account-icon">
              <i className="fas fa-user"></i>
              <span>Account</span>
            </Link>
            <div className="logo">
              <Link to="/" onClick={handleLogoClick}>
                <img src="/KING_FLEX.png" alt="KingFlex Logo" />
              </Link>
            </div>
            <button className="cart-icon" onClick={onCartClick}>
              <i className="fas fa-shopping-cart"></i>
              <span>Cart</span>
              {cartItemsCount > 0 && <span className="cart-quantity">{cartItemsCount}</span>}
            </button>
          </>
        )}
      </div>
      {isMobile && <div className="navbar-bottom">{renderSearchBar()}</div>}
    </nav>
  );
}

export default Navbar;