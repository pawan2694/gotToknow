import React from 'react'
import "./Login.css"
import { useState } from 'react';
function Login(){
    const[email, setemail]=useState("");
    const[password, setpassword]=useState("");
    const[submit, setsubmit]=useState(false)
    function handleLogin(e){
        const {name,value}=e.target;
        if(name==="email"){
        setemail(value);
        }
        if(name==="password"){
            setpassword(e.target.value)
        }
        
    }
    function handleSubmit(e){
        e.preventDefault();
     setsubmit(true)
    console.log("email:", email);
    console.log("password:", password);
    }
    
    return(
        <div>
            <form className='loginPage1' onSubmit={handleSubmit} >
                <input type='email'
                name='email'  
                autoComplete="off"
                value={email}
                onChange={handleLogin}
                placeholder='please enter your email'/>


                <input type='password' 
                name='password'
                value={password}
                autoComplete="off"
                onChange={handleLogin}
                placeholder='please enter your password'/>


                <button type="submit" className='btn-1'>Log in</button>
                <div className='forgotten-ps'>
                    <a href=''>Forgotten password?</a>
                </div>

                <button type="submit" className='btn-2'>Create An Account</button>
            </form>
        </div>
    )
}
export default Login;