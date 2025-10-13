import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)

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
            const response = await axios.post('http://localhost:8000/api/v1/auth/register/', userData)
            console.log(response.data)
        }
        catch (error) {
            console.error('Error during registration:', error);
        }
        finally {
            setLoading(false);
        }
    }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-body">
          <h2 className="login-title">Register to your account</h2>
          <form onSubmit={handlesubmit}>
            <input type='text' className='form-control mb-3' placeholder='username' required value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type='email' className='form-control mb-3' placeholder='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type='password' className='form-control mb-3' placeholder='password' required value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className='btn btn-dark mb-3' disabled={loading}>Register</button>

            <Link to="/">
              <button type="button" className='btn btn-secondary mb-3 ms-3'>Login</button>
            </Link>
            <small> Already have an Account ?</small>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
