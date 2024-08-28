import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import '../../assest/css/login.css'; // Import the CSS file
import { ReactComponent as Logo } from '../../assest/svg/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Users } from '../../DummyData/UserData';
import useToast from '../../customHook/toast';
 

// Define the types for the form values
interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

function SignInComponent() {
  const handleToast = useToast();
  const navigate = useNavigate()
  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      // Find the user based on email
      const loginuser = Users.find(user => user.email === values.email && user.password === values.password);
    
      if (loginuser) {
        handleToast.SuccessToast(`${loginuser.name} logged in successfully`)
        navigate('account/upload');
        localStorage.setItem('login',JSON.stringify(loginuser))
      } else {
 
        handleToast.ErrorToast('Login failed. Please check your credentials.')

      }
      setSubmitting(false);
    },
    
  });

  return (
    <div className="container">
      <div className="form-container">
        <div className="logo-container">
          <Logo className="icon" width={230} />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="label">Username</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
           
              className={`input ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
       
              className={`input ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="checkbox-label">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              className="checkbox"
              onChange={formik.handleChange}
               
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="#" className="link">
              Forgot your password?
            </a>
          </div>
          {/* <Link to="account/upload"> */}
            <button type="submit" className="button">Login</button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
}

export default SignInComponent;
