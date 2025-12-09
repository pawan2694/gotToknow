import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    function handleLogin(e) {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        }
        if (name === "password") {
            setPassword(value);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg("");

        if (!email || !password) {
            setErrorMsg("Please fill in all fields");
            return;
        }

        const result = await login({ email, password });
        
        if (result.success) {
            navigate("/landing");
        } else {
            setErrorMsg(result.message || "Login failed");
        }
    }

    return (
        <div>
            <form className='loginPage1' onSubmit={handleSubmit}>
                <h1 className="vanira-title">Vanira</h1>

                {errorMsg && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                        {errorMsg}
                    </div>
                )}

                <input 
                    type='email'
                    name='email'
                    autoComplete="off"
                    value={email}
                    onChange={handleLogin}
                    placeholder='Please enter your email'
                    disabled={loading}
                />

                <input 
                    type='password'
                    name='password'
                    autoComplete="off"
                    value={password}
                    onChange={handleLogin}
                    placeholder='Please enter your password'
                    disabled={loading}
                />

                <button type="submit" className='btn-1' disabled={loading}>
                    {loading ? 'Logging in...' : 'Log in'}
                </button>

                <div className='forgotten-ps'>
                    <a href='#'>Forgotten password?</a>
                </div>

                <button type="button" className='btn-2' onClick={() => navigate('/register')}>
                    Create An Account
                </button>
            </form>
        </div>
    );
}

export default Login;