import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedPage from './pages/ProtectedPage';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken, setAccessToken } from './accessToken';
import Register from './pages/Register';


interface IState {
  user : {
    username? : string | undefined;
    email? : string | undefined;
    id? : string | undefined;
  } | null


}

function App() {
  const currentUser : IState["user"] | null = JSON.parse(localStorage.getItem("user")!)
  
  const [user, setUser] = useState<IState["user"] | null>(currentUser);
  const [ token, setToken ] = useState(getAccessToken())
  useEffect(() => {

    if (token) {
      // accesstoken will be sent as header in every subsquent request. It is not stored to local storage
      axios.defaults.headers.common["Authorization"] = `Bearer ${getAccessToken()}`
    }

  },[token])

  useEffect(() => {
    // We try to renew access token everytime our website loads
    // If there is no refresh token in cookie then we simply don't do anything
    // Thus, our token state variable would not be set and we won't be able to access protected route
    const refreshToken = async () => {
      // Trying to renew access token 
      console.log("Renew Token Attempt")
      const response = await axios.post("http://localhost:5000/user/renewAccessToken", {} ,{ withCredentials : true})
      
      if (response.data.message === "success") {
        let data = response.data;
        // Renew Successful
        console.log("Renew Successful")
        localStorage.setItem("user", JSON.stringify({
            id : data.id,
            username : data.username,
            email : data.email,
        }))
        setUser({
          username : data.username,
          email : data.email,
          id : data.id
        })

        setAccessToken(data?.accessToken as string);
        // Setting the new access token into the state variable
        setToken(getAccessToken());
        
      }
      
    }
    refreshToken()

    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      async function (error) {
        // This code only executes when there is a 401 unauthorized response from a POST Request
        // Here, it would happen if access protected route after our token has expired
       
        if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
          // AccessToken has expired
          console.log("Token Expired");
          
          refreshToken()
          
        }

        return Promise.reject(error)
      }
    )

  },[])

  return <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login"  exact>
            <Login setToken={setToken} setUser={setUser}/>
          </Route>
           <Route path="/secret" exact>
            <ProtectedPage user={user} setUser={setUser} token={token} />
          </Route>
        </Switch>
      </Router>
    </div>
}

export default App;
