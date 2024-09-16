import React from 'react';
import './ProductList.css'; 

function SearchResult({ results, onProductSelect }) {
  return (
    <div className="product-list-page">
      <div className="product-list">
        <h2>Search Results</h2>
        {results.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {results.map(product => (
              <div key={product.id} className="product-item" onClick={() => onProductSelect(product)}>
                <div 
                  className="product-list-image" 
                  style={{ backgroundImage: `url(${product.image})` }}
                >
                  <div className="product-overlay">
                    <button className="order-button-1">ORDER NOW</button>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-name-1">{product.name}</span>
                  {/* <span className="product-price">AUD ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResult;