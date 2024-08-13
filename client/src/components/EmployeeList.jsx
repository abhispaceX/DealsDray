import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShimmerRow } from '../Shared/Shimmer';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/employees',{
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      console.log('Received data:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees', error);
    }finally{
      setLoading(false);
    }

  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?',)) {
      try {
        await axios.delete(`http://localhost:5001/api/employees/${id}`,{
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        setEmployees(employees.filter(employee => employee._id !== id));
      } catch (error) {
        console.error('Error deleting employee', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Mobile</th>
            <th className="py-2 px-4 border-b">Designation</th>
            <th className="py-2 px-4 border-b">Course</th>
            <th className="py-2 px-4 border-b">Gender</th>
            <th className="py-2 px-4 border-b">Created Date</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
            {
              loading ?(<><ShimmerRow />
              <ShimmerRow />
              <ShimmerRow />
              <ShimmerRow />
               <ShimmerRow/>   
                </> ) 
                :( employees.map((employee, index) => (
                    <tr key={employee._id}>
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">
                    {employee.imgUpload && employee.imgUpload.data ? (
                    <img 
                        src={`data:${employee.imgUpload.contentType};base64,${employee.imgUpload.data}`}
                        alt={`${employee.name}'s photo`} 
                        className="w-16 h-16 object-cover" 
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'path/to/fallback/image.jpg'; // Replace with a path to a default image
                        }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">{employee.name}</td>
              <td className="py-2 px-4 border-b">{employee.email}</td>
              <td className="py-2 px-4 border-b">{employee.mobile}</td>
              <td className="py-2 px-4 border-b">{employee.designation}</td>
              <td className="py-2 px-4 border-b">{employee.course}</td>
              <td className="py-2 px-4 border-b">{employee.gender}</td>
              <td className="py-2 px-4 border-b">
                {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">
                <Link to={`/edit/${employee._id}`} className="text-blue-600 mr-2">Edit</Link>
                <button onClick={() => handleDelete(employee._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))
        )
        }
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;