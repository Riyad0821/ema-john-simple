import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';



function Login() {
  const [newUser, setNewUser] = useState(false);
const [user, setUser] = useState({
  isSignedIn: false,
  name: '',
  email: '',
  password: '',
  photo: ''
})
initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/"} };

    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if(redirect){
            history.replace(from);
        }
    }

const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
        handleResponse(res, true)
    })
}
const signOut = () =>{
    handleSignOut()
    .then(res => {
        handleResponse(res, false)
    })
  }

  const fbSignIn = () => {
      handleFbSignIn()
      .then(res => {
        handleResponse(res, true)
      })
  }

    const handleSubmit = (e) => {
      //console.log(user.email, user.password);
      if(newUser && user.email && user.password){
        createUserWithEmailAndPassword(user.name, user.email, user.password)
        .then(res => {
            handleResponse(res, true)
        })
      }
      if(!newUser && user.email && user.password){
        signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
            handleResponse(res, true)
        })
      }

      e.preventDefault();
    }
    const handleBlur = (e) => {
      let isFieldValid = true;
      if(e.target.name === 'email'){
         isFieldValid = /\S+@\S+\.\S/.test(e.target.value);
      }
      if(e.target.name === 'password'){
        const isPasswordValid = e.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(e.target.value);
        isFieldValid = (isPasswordValid && passwordHasNumber);
      }
      if(isFieldValid){
        const newUserInfo = {...user};
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
      }
    }

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign Out</button> : <button onClick={googleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={fbSignIn}> Sign In using Facebook</button>
      <br/>
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt={user.name}></img>
          </div>
      }

      <h1>Our own Authentication</h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" placeholder="Your Name" onBlur={handleBlur} required/>}
        <br/>
      <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email Address" required/>
      <br/>
      <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Your Password" required/>
      <br/>
      <input type="submit" value={newUser ? 'Sign up':'Sign in'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green  '}}>User {newUser ? 'created': 'Logged In'} successfully</p>
      }
    </div>
  );
}

export default Login;
