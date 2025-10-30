import React, { useState } from 'react'
import { register } from './auth';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const Register = () => {

    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [error,seterror]=useState('');
    const [success,setsucess]=useState('')
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
         e.preventDefault();
         try{
            await register(username,password);
            setsucess('Registered Succuseffly');
            seterror('');
            navigate("/login");
         }catch(err){
            console.log("Registration Error",err);
            seterror("Registration Failed");
            setsucess('');
         }
    }

    return (
        <>
        <Helmet>
            <title>Registration</title>
        </Helmet>
            <form onSubmit={handleSubmit}>
                <label>UserName</label>
                <input 
                    type='text'
                    name='name' 
                    value={username}
                    onChange={(e)=>setusername(e.target.value)}/>

            <br></br><br></br>

            <label>Password</label>
                <input 
                    type='password'
                    name='password' 
                    value={password}
                    onChange={(e)=>setpassword(e.target.value)}/>
        <br></br><br></br>

        <button type='submit'>Register</button>
        {success && <p style={{color:"Green"}}>{success}</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
            </form>
            </>
    )
}

export default Register