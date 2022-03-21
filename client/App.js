import React, { Component } from 'react';
import { 
  BrowserRouter as Router,
  Routes, 
  Route,
} from 'react-router-dom';
import Login from './containers/Login';
import Main from './containers/Main';
import Register from './containers/Register';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      currentUserId: null,
      token: null,
      loggedIn: false,
    };
  }
  
  componentDidMount(){
    // check if user is previously authenticated
    fetch('/users/authenticate', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(response => response.json())
      .then(data => {
        if (data.isAuthenticated === true) {
          this.setState({
            ...this.state,
            loggedIn: true
          })
        }
      })

    // fetch('/api/users/grabUser')
    // .then (res => res.json())
    // .then (data => {
    //   return this.setState({
    //     ...this.state,
    //     currentUser: data.username,
    //     currentUserId: data.user_id
    //   });
    // })
  }

  render() {
    // const navigate = useNavigate();

    return (
      <div id='container'>
        <Router>
          <Routes>
            <Route path='/' element={
              this.state.loggedIn ? <Main /> : <Login />
            }/>
            <Route path='/home' element={<Main />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
