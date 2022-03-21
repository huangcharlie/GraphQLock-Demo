import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = props => {
  const navigate = useNavigate();

  const logout = e => {
    fetch('/users/logout', {
      headers: {'Content-Type': 'application/json'}
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success === true) navigate('/login');
      })
  }

  const handleSubmit = e => {
    e.preventDefault();
    const query = e.target.textarea.value;

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query })
    })
      .then(response => response.json())
      .then(data => {
        // console.log('graphql data returned: ', data);
        const results = document.querySelector('#results');
        const string = JSON.stringify(data)
        .replace(/\[/g, '[\n')
        .replace(/:/g, ':\xa0')
        .replace(/,"/g, ',\n\xa0\xa0"')
        .replace(/{/g, '{\n\xa0\xa0')
        .replace(/},{/g, '\n},{')
        .replace(/}]/g, '\n}]')
        .replace(/"}/g, '"\n}');
        results.value = string;
      });
  }

  return (
    <div className="main-container">
      <header>
        <button id='logout' onClick={logout}>Sign Out</button>
      </header>
      <div className='main-box'>
        <form className="main-input" onSubmit={handleSubmit}>  
          <h2>GraphQL Input</h2>
          {/* <label for="type">Request type: </label>
          <select name="type" id="type">
            <option value="query">Query</option>
            <option value="mutation">Mutation</option>
            <option value="subscription">Subscription</option>
          </select>
          <input type='text' name='table' placeholder='table' required></input> */}
          {/* <input type='text' id='graphql' name='graphql' placeholder='graphql' required></input> */}
          <textarea name="textarea" wrap='off'></textarea>
          <button id='submitButton' type='submit'>Submit</button>
        </form>
        <div className='main-results'>
          <h2>GraphQL Results</h2>
          <textarea name="results" id='results' wrap='off' readOnly></textarea>
        </div>
      </div>
    </div>
  )
}

export default Main;
