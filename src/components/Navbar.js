import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

// 簡單的模糊匹配函數
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
  const searchRef = useRef(null);
  const navigate = useNavigate();

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
        .slice(0, 5); // 限制建議數量為5個
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
    navigate('/');  // 使用 navigate 函數導航到主頁
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
                    {/* <span className="suggestion-price">AUD ${product.price}</span> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="nav-right">
          <div className="nav-icons">
            <a href="#"><i className="fas fa-user"></i></a>
            <a href="#" className="cart-icon" onClick={onCartClick}>
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && <span className="cart-quantity">{cartItemsCount}</span>}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;