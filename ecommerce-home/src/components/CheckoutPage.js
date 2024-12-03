import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import ErrorMessages from './ErrorMassages.js'; // Імпортуємо компонент помилок
import "../styles/CheckoutPage.css";

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters long'),
  lastName: Yup.string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters long'),
  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email')
    .test(
      'domain-check',
      'Invalid email format. The domain must include at least 2 letters before and after the dot (e.g., example.com)',
      (value) => {
        if (!value) return false;
        const domain = value.split('@')[1]; 
        if (!domain) return false;
        const domainRegex = /^[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/; 
        return domainRegex.test(domain);
      }
    ),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters long')
});


const CheckoutPage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
    navigate('/success'); 
  };

  // Go Back to Cart
  const handleGoBack = () => {
    navigate('/cart');  
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <Form className="checkout-form">
            {/* Displaying error messages */}
            <ErrorMessages errors={errors} />

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <Field 
                type="text" 
                id="firstName" 
                name="firstName" 
                className="form-input" 
              />
              <ErrorMessage name="firstName" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <Field 
                type="text" 
                id="lastName" 
                name="lastName" 
                className="form-input" 
              />
              <ErrorMessage name="lastName" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field 
                type="email" 
                id="email" 
                name="email" 
                className="form-input" 
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <Field 
                type="text" 
                id="phone" 
                name="phone" 
                className="form-input" 
              />
              <ErrorMessage name="phone" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <Field 
                type="text" 
                id="address" 
                name="address" 
                className="form-input" 
              />
              <ErrorMessage name="address" component="div" className="error-message" />
            </div>

            <button type="submit" className="checkout-button">Continue</button>
          </Form>
        )}
      </Formik>

      {/* Go Back Button */}
      <button className="go-back-button" onClick={handleGoBack}>Go Back to Cart</button>
    </div>
  );
};

export default CheckoutPage;
