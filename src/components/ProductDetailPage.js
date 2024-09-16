import React, { useState, useCallback, useEffect } from 'react';
import './ProductDetailPage.css';

const ProductDetailPage = ({ product, onGoBack, updateCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [mainImage, setMainImage] = useState(product.image);

  useEffect(() => {
    console.log('ProductDetailPage: Component mounted or updated');
    return () => console.log('ProductDetailPage: Component will unmount');
  }, []);

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = useCallback(() => {
    console.log('handleAddToCart called');
    const priceAsNumber = Number(product.price);
    const formattedProduct = {
      ...product,
      price: isNaN(priceAsNumber) ? product.price : priceAsNumber,
      selectedSize: product.name === "Duct Chairs" ? selectedSize : undefined
    };
    updateCart(formattedProduct, quantity, selectedSize);
    console.log(`Added ${quantity} ${product.name}${product.name === "Duct Chairs" ? ` (${selectedSize}mm)` : ''} to cart`);
  }, [product, quantity, selectedSize, updateCart]);

  const generateSizeOptions = () => {
    const sizes = [25, 30];
    for (let size = 40; size <= 480; size += 10) {
      sizes.push(size);
    }
    return sizes;
  };

  const renderSizeSelector = () => {
    if (product.name === "Duct Chairs") {
      const sizeOptions = generateSizeOptions();
      return (
        <div className="size-selector">
          <label htmlFor="size-select">Select Size:</label>
          <select 
            id="size-select" 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(Number(e.target.value))}
          >
            {sizeOptions.map(size => (
              <option key={size} value={size}>{size} mm</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  if (!product) {
    console.log('ProductDetailPage: No product data');
    return <div>Loading...</div>;
  }

  console.log('ProductDetailPage: Rendering with product', product.id);

  // Assume product has an array of images
  const thumbnails = product.images || [product.image];

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button className="go-back-btn" onClick={onGoBack}>← Go Back</button>
        <div className="product-content">
          <div className="product-gallery">
            <div className="main-image">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumbnail-list">
              {thumbnails.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`${product.name} thumbnail ${index + 1}`} 
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            {renderSizeSelector()}
            <div className="quantity-selector">
              <span>Quantity</span>
              <button 
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity === 1}
              >
                -
              </button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <button 
              className="add-to-cart-btn" 
              onClick={() => {
                console.log('Add to cart button clicked');
                handleAddToCart();
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;