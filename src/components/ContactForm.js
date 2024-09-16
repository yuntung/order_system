import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactForm.css';
import { sendOrderConfirmationEmail, OrderConfirmationModal } from './OrderConfirmationSystem';

function ContactForm({ cart, onOrderComplete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    craneTruck: 'Yes',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submitted:', formData);
    console.log('Cart data:', cart);
  
    if (!Array.isArray(cart) || cart.length === 0) {
      alert('Your cart is empty. Please add items before proceeding.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const result = await sendOrderConfirmationEmail(formData, cart);
  
      if (result.success) {
        console.log('Order confirmation email sent successfully');
        onOrderComplete();
        setShowModal(true);
      } else {
        console.error('Failed to process order:', result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      alert('An unexpected error occurred. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="contact-form-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>CONTACT</h2>
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryAddress">Delivery Address</label>
          <input
            type="text"
            id="deliveryAddress"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryDate">Delivery Date</label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryTime">Delivery Time</label>
          <input
            type="time"
            id="deliveryTime"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Crane Truck</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="craneTruck"
                value="Yes"
                checked={formData.craneTruck === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="craneTruck"
                value="No"
                checked={formData.craneTruck === 'No'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'SUBMIT'}
        </button>
      </form>
      <OrderConfirmationModal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        onNavigateHome={handleNavigateHome}
      />
    </div>
  );
}

export default ContactForm;