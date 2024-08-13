import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white-500 p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/home" className="text-black text-lg font-bold">
          <img src="https://play-lh.googleusercontent.com/Im3CE-kmZJmZMC8pkhpCj7tGznPI6LC1EjhaTJ3E6Cdh_mgW5VxF_joZK31XWwZPmkT5=w240-h480-rw" alt="Home Logo" className="h-16 mr-2 inline" />
        
        </Link>
      </div>
      <div className="flex  gap-40">
        <Link to="/home" className="text-black text-lg" >
          Home
        </Link>
        <Link to="/employees" className="text-black text-lg">
          Employee List
        </Link>
        </div>
          <div className='flex gap-16' >
            <div className=' flex  ' >
            <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81iX4Mo49Z3oCPSx-GtgiMAkdDop2uVmVvw&s" alt="Profile Picture" className=" mr-2 w-9 " />
            <span className="text-black text-lg">{user}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        
    </nav>
  );
};

export default Navbar;
