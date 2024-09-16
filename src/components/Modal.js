import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ message, isOpen, onClose }) => {
  console.log('Modal rendered, isOpen:', isOpen);

  useEffect(() => {
    console.log('Modal useEffect, isOpen:', isOpen);
    if (isOpen) {
      console.log('Modal opened');
      const timer = setTimeout(() => {
        console.log('Modal auto-close timer triggered');
        onClose();
      }, 3000);  

      return () => {
        console.log('Clearing Modal timeout');
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    console.log('Modal not rendering content due to !isOpen');
    return null;
  }

  console.log('Modal rendering content');
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => {
          console.log('Modal close button clicked');
          onClose();
        }}>
          &times;
        </button>
        <p>{message}</p>
      </div>
    </div>,
    document.body
  );
};

export default Modal;