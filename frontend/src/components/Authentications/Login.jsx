import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { loginUser } from '../../authApi';
import '../styles.css';

const Login = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState('')
  const  navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setLoading(true)
        try {
            const response = await loginUser({username, password});
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            navigate('/Dashboard-Ingrelyze')

        }

        catch (error) {
            console.error("error occured during login", error.response?.data || error.message)
        }

        finally {
            setLoading(false)
        }

    }

  return (
    <div className="auth-container">
      <div className="auth-form-container glass-card">
        <h2 className='auth-title'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type='text' className='form-input' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type='password' className='form-input' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className='form-button' type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="form-footer">
          Don't have an Account? <Link to="/register">Register now!</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
