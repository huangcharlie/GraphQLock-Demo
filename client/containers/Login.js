import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = props => {
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value
    e.target.username.value = '';
    e.target.password.value = '';
    if (!username || !password) return;

    fetch('users/login', {
      method: "POST", 
      headers: {'Content-Type': 'application/JSON'},
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated === true) {
          navigate('/home');
        } else {
          alert('Incorrect username or password.');
        }
      });
  }


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">  
        <h2>Login</h2>
        <div>
          <input type='text' name='username' placeholder='username' required></input><br/>
          <input type='password' name='password' placeholder='password' required></input>
        </div>
        <div className='buttons'>
          <button id='loginButton' type='submit'>Login</button>
          <button id='signupNav' type='button' onClick = {() => {navigate('/register')}}>Sign Up</button>
        </div>
      </form>
    </div>
  )
}

export default Login;
