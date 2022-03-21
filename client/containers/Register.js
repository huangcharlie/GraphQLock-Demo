import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = props => {

  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    let role = e.target.role.value;
    
    console.log({username, password, role});

    fetch('users/register', {
      method: "POST", 
      headers: {'Content-Type': 'application/JSON'},
      body: JSON.stringify({ username, password, role }),
    })
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        if (data.user.exists === true) {
          alert('Username already exists, please enter a different username.');
          e.target.username.value = '';
        }
        if (data.user.validSignup === true) {
          navigate('/');
        }
      })
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-box">
        <h2>Register</h2>
        <div>
          <input type='text' name='username' required placeholder='username'></input><br/>
          <input type='password' name='password' required placeholder='password'></input><br/>
          <label htmlFor="role">Permission: </label>
          <select name="role" id="role">
            <option value="admin">Admin</option>
            <option value="read_only">Read-Only</option>
            <option value="contractor">Contractor</option>
          </select>
        </div>
        <div className='buttons'>
          <button type='submit' id='registerButton'>Register</button>
          <button type='button' id='loginNav' onClick = {() => {navigate('/login')}}>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Register;
