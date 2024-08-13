import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 



const Login = () => {
  
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        
        localStorage.setItem('user', JSON.stringify(data.username)); 
        console.log(JSON.parse(localStorage.getItem('user')))
        navigate('/home');
      }
      
      
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const serverError = error.response.data.error;
        if (serverError === 'Invalid username') {
          setUsernameError('Invalid username');
        } else if (serverError === 'Invalid password') {
          setPasswordError('Invalid password');
        } else {
          setGeneralError(serverError || 'An error occurred. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setGeneralError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setGeneralError('An error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container flex flex-col justify-center items-center  backdrop-blur-lg bg-[url('https://cdn4.vectorstock.com/i/1000x1000/23/98/budget-tracking-set-smartphone-background-vector-35182398.jpg')] bg-cover h-screen">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8  mb-2 w-3/12" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${usernameError ? 'border-red-500' : ''}`}
            value={data.username}
            name="username"
            onChange={handleChange}
            placeholder="Username"
          />
          {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${passwordError ? 'border-red-500' : ''}`}
            type="password"
            onChange={handleChange}
            name="password"
            value={data.password}
            placeholder="******************"
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          <Link to="/forgot-password" className="inline-block align-baseline text-sm font-normal text-red-500 hover:text-blue-800">
            Forgot Password?
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <p className="font-light text-sm">Don't have an account?</p>
          <Link to="/signup" key="register-link">
            <p className="text-blue-500">Register</p>
          </Link>
        </div>
        {generalError && <p className="text-red-500 text-sm mt-1">{generalError}</p>}
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
