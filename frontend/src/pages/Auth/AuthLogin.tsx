import React, { useEffect } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import '../../assest/css/login.css'; // Import the CSS file
import { ReactComponent as Logo } from '../../assest/svg/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Users } from '../../DummyData/UserData';
import useToast from '../../customHook/toast';
import { useLoginMutation } from '../../Redux/AuthSlice';
 

// Define the types for the form values
interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

function SignInComponent() {

  const [login,{isLoading,isSuccess,isError,data}] = useLoginMutation();




  const handleToast = useToast();
  const navigate = useNavigate()
  const formik = useFormik<FormValues>({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      username: Yup.string()
     
        .required('username is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
console.log(values,'values');


      login(values)




    
   

      // Find the user based on username
      // const loginuser = Users.find(user => user.username === values.username && user.password === values.password);
    
      // if (loginuser) {
      //   handleToast.SuccessToast(`${loginuser.name} logged in successfully`)
      //   navigate('account/upload');
      //   localStorage.setItem('login',JSON.stringify(loginuser))
      // } else {
 
      //   handleToast.ErrorToast('Login failed. Please check your credentials.')

      // }
      setSubmitting(false);
    },

    
    
  });

  useEffect(()=>{
    console.log(data);
    
    if (isSuccess) {
      handleToast.SuccessToast(` logged in successfully`)
      navigate('account/upload');
      localStorage.setItem('login',JSON.stringify(data))
    }
    if (isError) {
      handleToast.ErrorToast('Login failed. Please check your credentials.')
    }

  },[isSuccess,isError])

  return (
    <div className="container">
      <div className="form-container">
        <div className="logo-container">
          <Logo className="icon" width={230} />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="username" className="label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
           
              className={`input ${formik.touched.username && formik.errors.username ? 'input-error' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error-message">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className='mb-3'>
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
