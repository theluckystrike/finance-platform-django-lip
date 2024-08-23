import React from 'react';
import '../../assest/css/login.css'; // Import the CSS file
import {ReactComponent as Logo}  from '../../assest/svg/logo.svg'
import { Link } from 'react-router-dom';
function SignInComponent() {
  return (
    <div className="container">
		  <div className="form-container">
			  <div className='logo-container'>
				  
         <Logo className="icon" width={230} />
			  </div>
        {/* <p className="paragraph">
          Don&apos;t have an account?{' '}
          <a href="#" className="link">
            Register
          </a>
        </p> */}
        <form action="#" method="POST">
          <div>
            <label htmlFor="email" className="label">Username</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              
            />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              
            />
          </div>
          {/* <div className="checkbox-label">
            <input id="remember-me" name="remember-me" type="checkbox" className="checkbox" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="#" className="link">
              Forgot your password?
            </a>
          </div> */}
				  <Link to="account/upload">
				  
          <button type="submit" className="button">Login</button>
				  </Link>
        </form>
      </div>
    </div>
  );
}

export default SignInComponent;
