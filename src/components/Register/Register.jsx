import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api/api';
import '../Login/Login.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                alert('Registration successful! Please login.');
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <form className='loginPage1' onSubmit={handleSubmit}>
                <h1 className="vanira-title">Create Account</h1>

                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}

                <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Full Name'
                    required
                    disabled={loading}
                />

                <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email'
                    required
                    disabled={loading}
                />

                <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Password'
                    required
                    disabled={loading}
                />

                <input
                    type='password'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm Password'
                    required
                    disabled={loading}
                />

                <button type="submit" className='btn-1' disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                <div className='forgotten-ps'>
                    <a href='#' onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        Already have an account? Login
                    </a>
                </div>
            </form>
        </div>
    );
}

export default Register;