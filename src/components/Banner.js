import React from 'react';
import './Banner.css';

function Banner() {
  const handleBannerButton = () => {
    const productListElement = document.getElementById('product-list-section');
    
    if (productListElement) {
      productListElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section className="banner">
      <div className="banner-container">
        <div className="banner-content">
          <h1>KING FLEX</h1>
          <h2>ONLINE ORDER SYSTEM</h2>
          <button className='banner-button' onClick={handleBannerButton}>Order Now</button>
        </div>
      </div>
    </section>
  );
}

export default Banner;