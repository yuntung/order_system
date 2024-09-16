import React from 'react';
import './ProductList.css';

function ProductItem({ product, onSelect }) {
  return (
    <div className="product-item" onClick={() => onSelect(product)}>
      <div 
        className="product-list-image" 
        style={{backgroundImage: `url(${product.image})`}}
      >
        <div className="product-overlay">
          <button className="order-button-1">ORDER NOW</button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-name-1">{product.name}</span>
      </div>
    </div>
  );
}

function ProductList({ onProductSelect, products }) {
  return (
    <section id="product-list-section" className="product-list-page">
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductItem 
                key={product.id} 
                product={product} 
                onSelect={onProductSelect} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductList;