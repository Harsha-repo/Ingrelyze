import React from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [username,setUsername] = React.useState('')
  const [password,setPassword] = React.useState('')
  const [loading,setLoading] = React.useState(false)
  const  navigate = useNavigate()

  const handle_submit = async (e) =>{
    e.preventDefault()
    setLoading(true)
     const login_data = {username, password}
        console.log("form submitted")   

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/token/', login_data)
            // these are the creds stored in browesets local storage that helps in login 
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            console.log('login successfull')
            console.log(response.data)
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
    <div className="col col-md-8">
    <div className="container login-css">
        <div className="row">
            <div className="col-md-6 offset-md-6">
                <h2 className='text-center mt-4 mb-4'>Login to your account</h2>
                <form action="" onSubmit={handle_submit}>
                    <input type='text' className='form-control mb-3' placeholder='username' value={username} onChange={(e)=>setUsername(e.target.value)} required />
                    <input type='password' className='form-control mb-3' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} required />

                    <button className='btn btn-dark mb-3'>Login</button>
                    {loading? <h6>Loading...</h6> : null}

                    <Link to="/register">
                    <button className='btn btn-secondary mb-3 ms-3'>Register</button> </Link>
                    <small>Don't have an Account ?</small>
                </form>
            </div>
        </div>
    </div>
    </div> 
  )
}

export default Login
