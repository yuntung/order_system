import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetailPage from './components/ProductDetailPage';
import SearchResults from './components/SearchResult';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import ContactForm from './components/ContactForm';
import { OrderConfirmationModal } from './components/OrderConfirmationSystem';
import CartSidebar from './components/CartSidebar';
import Modal from './components/Modal';
import './App.css';
import emailjs from 'emailjs-com';

emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);

function Footer() {
  return (
    <footer className="footer">
      <div className="social-links">
        <a href=""><i className='bx bxl-linkedin-square'></i></a>
        <a href=""><i className='bx bxl-instagram-alt'></i></a>
        <a href=""><i className='bx bxl-facebook-circle'></i></a>
      </div>
      <div className="footer-text">
        <p>Copyright &copy; 2024 KING FLEX</p>
      </div>
    </footer>
  );
}

function AppContent() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const generateSizes = () => {
    const sizes = [25, 30];
    for (let size = 40; size <= 480; size += 10) {
      sizes.push(size);
    }
    return sizes;
  };

  useEffect(() => {
    setAllProducts([
      { id: 1, name: "Duct Tape", image: "/images/305_Wedge_blocks.png", price: '17.00', description: "Roll for Duct Tape" },
      { id: 2, name: "AbleFlex", image: "/images/AbleFlex.png", price: '17.00', description: "Roll for AbleFlex" },
      { id: 3, name: "Anchor Block Set", image: "/images/Anchor_block_Set.png", price: '17.00', description: "Anchor 100 per box/ Blocks 100 per box" },
      { id: 4, name: "Duct Chairs", image: "/images/Duct_chairs.png", price: '17.00', description: "100 per bag for Duct Chairs", sizes: generateSizes() },
      { id: 5, name: "Duct", image: "/images/Duct.png", price: '17.00', description: "70 x 20mm (3770m) for Duct" },
      { id: 6, name: "Grout Tube", image: "/images/Grout_Tube.png", price: '17.00', description: "Roll for Grout Tube" },
      { id: 7, name: "Jack Wedge", image: "/images/Jack_Wedge.png", price: '17.00', description: "Set for 12.7 mm Jack Wedge" },
      { id: 8, name: "PC Strand", image: "/images/PC_strand.png", price: '17.00', description: "Ton for 12.7mm strand" },
      { id: 9, name: "Round Corrugate Duct", image: "/images/Wedge_block_steel.png", price: '17.00', description: "Meter for Round Corrugate Duct" },
      { id: 10, name: "Wedges", image: "/images/Wedges.png", price: '17.00', description: "Pcs for 12.7 mm Wedges (2 pieces)" },
      { id: 11, name: "Staple", image: "/images/Staple_pin.png", price: '17.00', description: "Box for Staple" },
    ]);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    navigate('/search');
  };

  const handleProductSelect = (product) => {
    navigate(`/product/${product.id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    navigate('/');
  };

  const onLogoClick = () => {
    clearSearch();
  };

  const updateCart = (product, quantity, selectedSize) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        (product.name === "Duct Chairs" ? item.selectedSize === selectedSize : true)
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && 
          (product.name === "Duct Chairs" ? item.selectedSize === selectedSize : true)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity, selectedSize }];
      }
    });
    setModalMessage(`Added ${quantity} ${product.name}${product.name === "Duct Chairs" ? ` (${selectedSize}mm)` : ''} to cart.`);
    setIsModalOpen(true);
  };

  const updateCartItemQuantity = (productId, newQuantity, selectedSize) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => 
          !(item.id === productId && 
            (item.name === "Duct Chairs" ? item.selectedSize === selectedSize : true))
        );
      }
      return prevCart.map(item =>
        item.id === productId && 
        (item.name === "Duct Chairs" ? item.selectedSize === selectedSize : true)
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleOrderComplete = () => {
    setIsConfirmationModalOpen(true);
    setCart([]);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setIsCartOpen(false);
  };

  const ProductDetailPageWrapper = () => {
    const { productId } = useParams();
    const product = allProducts.find(p => p.id === parseInt(productId));

    if (!product) {
      return <div>Product not found</div>;
    }

    return (
      <ProductDetailPage 
        product={product} 
        onGoBack={() => navigate('/')} 
        updateCart={updateCart}
      />
    );
  };

  return (
    <div className="App">
      <Navbar 
        cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={toggleCart}
        onSearch={handleSearch}
        products={allProducts}
        onLogoClick={onLogoClick}
      />
      <div className="content">
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <ProductList 
                onProductSelect={handleProductSelect} 
                products={allProducts}
              />
            </>
          } />
          <Route path="/search" element={
            <SearchResults 
              results={searchResults} 
              onProductSelect={handleProductSelect}
            />
          } />
          <Route path="/product/:productId" element={<ProductDetailPageWrapper />} />
          <Route path="/contact" element={
            <ContactForm 
              cart={cart}
              onOrderComplete={handleOrderComplete}
            />
          } />
        </Routes>
      </div>
      <Footer />
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateCartItemQuantity={updateCartItemQuantity}
      />
      <OrderConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
      />
      <Modal 
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;