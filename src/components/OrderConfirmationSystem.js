import emailjs from 'emailjs-com';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './OrderConfirmationSystem.css';

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID;
const SALES_EMAIL = process.env.REACT_APP_SALES_EMAIL;
const CUSTOMER_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID;
const SALES_TEAM_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_SALES_TEMPLATE_ID;

const sendEmail = async (templateId, templateParams) => {
  try {
    const response = await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams, EMAILJS_USER_ID);
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const generateOrderPDF = (formData, cart) => {
  console.log('Generating PDF with formData:', JSON.stringify(formData));
  console.log('Generating PDF with cart:', JSON.stringify(cart));

  if (!formData || !cart) {
    console.error('Invalid formData or cart:', { formData, cart });
    return null;
  }

  try {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Purchase Order', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Company Name: ${formData.companyName || 'N/A'}`, 20, 40);
    doc.text(`Full Name: ${formData.fullName || 'N/A'}`, 20, 50);
    doc.text(`Phone Number: ${formData.phoneNumber || 'N/A'}`, 20, 60);
    doc.text(`Delivery Address: ${formData.deliveryAddress || 'N/A'}`, 20, 70);
    doc.text(`Delivery Date: ${formData.deliveryDate || 'N/A'}`, 20, 80);
    doc.text(`Delivery Time: ${formData.deliveryTime || 'N/A'}`, 20, 90);
    doc.text(`Crane Truck: ${formData.craneTruck || 'N/A'}`, 20, 100);

    if (Array.isArray(cart) && cart.length > 0) {
      const tableData = cart.map(item => {
        if (!item) {
          console.error('Invalid item in cart:', item);
          return ['N/A', 'N/A', 0];
        }
        return [
          item.name || 'N/A',
          item.name === 'Duct Chairs' ? `${item.selectedSize}mm` : 'N/A',
          item.quantity || 0
        ];
      });

      doc.autoTable({
        startY: 110,
        head: [['Item', 'Size', 'Quantity']],
        body: tableData,
      });
    } else {
      doc.text('No items in cart', 20, 110);
    }

    console.log('PDF generated successfully');
    return doc;
  } catch (error) {
    console.error('Error in generateOrderPDF:', error);
    return null;
  }
};

export const sendOrderConfirmationEmail = async (formData, cart) => {
  console.log('Received cart data:', JSON.stringify(cart, null, 2));
  console.log('Received form data:', JSON.stringify(formData, null, 2));

  if (!Array.isArray(cart) || cart.length === 0) {
    console.error('Invalid cart data:', cart);
    return { success: false, error: 'Your cart is empty. Please add items before proceeding.' };
  }

  const invalidItems = cart.filter((item, index) => {
    if (!item || typeof item !== 'object') {
      console.error(`Item ${index} is not an object:`, item);
      return true;
    }
    if (!('quantity' in item)) {
      console.error(`Item ${index} is missing quantity:`, item);
      return true;
    }
    if (isNaN(parseInt(item.quantity))) {
      console.error(`Item ${index} has invalid quantity:`, item);
      return true;
    }
    if (parseInt(item.quantity) <= 0) {
      console.error(`Item ${index} has invalid quantity:`, item);
      return true;
    }
    return false;
  });

  if (invalidItems.length > 0) {
    console.error('Cart contains invalid items:', invalidItems);
    return { 
      success: false, 
      error: `Some items in your cart are invalid. Please review your cart and try again. ${invalidItems.length} item(s) need attention.`
    };
  }

  const pdfDoc = generateOrderPDF(formData, cart);
  if (!pdfDoc) {
    console.error('Failed to generate PDF document');
    return { success: false, error: 'Failed to generate order summary. Please try again or contact support.' };
  }

  let pdfBase64;
  try {
    console.log('Attempting to convert PDF to base64');
    const pdfOutput = pdfDoc.output();
    console.log('PDF output type:', typeof pdfOutput);
    console.log('PDF output length:', pdfOutput.length);
    
    pdfBase64 = btoa(pdfOutput);
    console.log('Base64 conversion completed');
    
    if (!pdfBase64) {
      throw new Error('PDF base64 conversion resulted in null or undefined');
    }
    console.log('PDF base64 data length:', pdfBase64.length);
  } catch (error) {
    console.error('Error generating PDF base64:', error);
    return { success: false, error: 'Failed to process order summary. Please try again or contact support.' };
  }

  const orderNumber = `ORD-${Date.now()}`;
  const orderDate = new Date().toLocaleDateString();

  const customerTemplateParams = {
    to_email: formData.email,
    to_name: formData.fullName,
    order_number: orderNumber,
    order_date: orderDate,
    order_pdf: pdfBase64
  };
  
  const salesTemplateParams = {
    to_email: SALES_EMAIL,
    order_number: orderNumber,
    order_date: orderDate,
    customer_name: formData.fullName,
    company_name: formData.companyName,
    customer_email: formData.email,
    customer_phone: formData.phoneNumber,
    delivery_address: formData.deliveryAddress,
    delivery_date: formData.deliveryDate,
    delivery_time: formData.deliveryTime,
    crane_truck: formData.craneTruck,
    order_pdf: pdfBase64
  };

  console.log('Customer template params:', JSON.stringify({
    ...customerTemplateParams,
    pdf_data: 'PDF_DATA_OMITTED_FOR_LOGGING'
  }, null, 2));
  
  console.log('Sales template params:', JSON.stringify({
    ...salesTemplateParams,
    pdf_data: 'PDF_DATA_OMITTED_FOR_LOGGING'
  }, null, 2));

  try {
    const customerEmailSent = await sendEmail(CUSTOMER_TEMPLATE_ID, customerTemplateParams);
    console.log('Customer email sent:', customerEmailSent);
    
    const salesEmailSent = await sendEmail(SALES_TEAM_TEMPLATE_ID, salesTemplateParams);
    console.log('Sales team email sent:', salesEmailSent);

    if (customerEmailSent && salesEmailSent) {
      console.log('Order confirmation emails sent successfully to customer and sales team');
      return { success: true, orderNumber };
    } else {
      console.error('Failed to send one or both emails');
      return { success: false, error: 'We encountered an issue sending your order confirmation. Please contact our support team.' };
    }
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again or contact our support team.' };
  }
};

export const OrderConfirmationModal = ({ isOpen, onClose, onNavigateHome }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (typeof onNavigateHome === 'function') {
      onNavigateHome();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <h2>Order Completed!</h2>
          <p>Your order has been successfully placed and a confirmation has been sent to your email.</p>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};