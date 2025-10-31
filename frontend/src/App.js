import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import {HelmetProvider} from "react-helmet-async"
import Register from './Component/register';
import Login from './Component/login';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import ProtectedRoute from './Component/ProtectedRoute';
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
const clientId = "276916434451-gs4pi3694fvrm1jere57s41k72f12ti0.apps.googleusercontent.com";

  // const [sum,setsum]=useState(0)

  // useEffect(
  //   ()=>{
      
  //   console.log("welcome",sum)
  //   },[sum]
  // )

  // const inc=()=>setsum(sum+1)

  return (
    <>
    {/* <h1>{sum}</h1>
    <button onClick={inc}>Inc</button> */}
        <GoogleOAuthProvider clientId={clientId}>

    <HelmetProvider>
      <Router>
        <Routes>
            <Route path='/' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/home'  element={
              <ProtectedRoute>
              <Home />
              </ProtectedRoute>} 
          />

         

        </Routes>
      </Router>
    </HelmetProvider>
</GoogleOAuthProvider>
    </>
  );
}

export default App;
