import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../authApi';
import '../styles.css';

const Register = () => {
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Perform register logic here (e.g., API call)
        // Simulate a delay for demonstration purposes
        const userData = {
            username: username,
            email: email,
            password: password
        }

        try {
            const response = await registerUser(userData);
            console.log(response.data);
            navigate('/'); // Redirect to login on successful registration
        }
        catch (error) {
            console.error('Error during registration:', error);
        }
        finally {
            setLoading(false);
        }
    }

  return (
    <div className="auth-container">
      <div className="auth-form-container glass-card">
        <h2 className='auth-title'>Create Account</h2>
        <form onSubmit={handlesubmit}>
          <div className="form-group">
            <input type='text' className='form-input' placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <input type='email' className='form-input' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <input type='password' className='form-input' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className='form-button' type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="form-footer">
          Already have an Account? <Link to="/">Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
