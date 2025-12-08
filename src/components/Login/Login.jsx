import React from 'react'
import "./Login.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login(){
    const[email, setemail]=useState("");
    const[password, setpassword]=useState("");
    const[submit, setsubmit]=useState(false);
    const navigate= useNavigate();
    const { login } = useAuth();

    function handleLogin(e){
        const {name,value}=e.target;
        if(name==="email"){
            setemail(value);
        }
        if(name==="password"){
            setpassword(value)
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        setsubmit(true)
        login({ email });
        navigate("/landing")
    }
    
    return(
        <div>
            <form className='loginPage1' onSubmit={handleSubmit}>
                <h1 className="vanira-title">Vanira</h1>
                <input type='email'
                    name='email'
                    autoComplete="off"
                    value={email}
                    onChange={handleLogin}
                    placeholder='please enter your email'/>

                <input type='password'
                    name='password'
                    autoComplete="off"
                    value={password}
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
