import React, { useState, useEffect } from 'react';
import './Banner.css';

function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "KING FLEX",
      subtitle: "ONLINE ORDER SYSTEM",
      buttonText: "Order Now",
      image: "/images/banner1.jpg", // make sure route is correct
    },
    {
      title: "QUALITY PRODUCTS",
      subtitle: "EXPLORE OUR RANGE",
      buttonText: "View Products",
      image: "/images/banner2.jpg", // make sure route is correct
    },
    {
      title: "QUALITY PRODUCTS",
      subtitle: "EXPLORE OUR RANGE",
      buttonText: "View Products",
      image: "/images/banner3.jpg", // make sure route is correct
    },
    // Adding more slides
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // change slide in every 5 seconds.

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleBannerButton = () => {
    const productListElement = document.getElementById('product-list-section');
    
    if (productListElement) {
      productListElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index);
  }

  return (
    <section className="banner" style={{backgroundImage: `url(${slides[currentSlide].image})`}}>
      <div className="banner-container">
        <div className="banner-content">
          <h1>{slides[currentSlide].title}</h1>
          <h2>{slides[currentSlide].subtitle}</h2>
          <button className='banner-button' onClick={handleBannerButton}>
            {slides[currentSlide].buttonText}
          </button>
        </div>
      </div>
      <div className="banner-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Banner;