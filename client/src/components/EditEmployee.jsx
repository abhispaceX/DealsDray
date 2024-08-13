import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [],
    imgUpload: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/employees/${id}`, {
        headers: {
          'Authorization': localStorage.getItem('token'),
        },
      });
      setEmployee(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employee data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedCourses = checked
      ? [...employee.course, value]
      : employee.course.filter(course => course !== value);
    setEmployee({ ...employee, [name]: updatedCourses });
  };

  const handleImageChange = (e) => {
    setEmployee({ ...employee, imgUpload: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in employee) {
        if (key === 'imgUpload' && employee[key] instanceof File) {
          formData.append(key, employee[key]);
        } else if (key !== 'imgUpload') {
          formData.append(key, employee[key]);
        }
      }

      await axios.put(`http://localhost:5001/api/employees/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('token'),
        },
      });
      navigate('/'); // Redirect to employee list after successful update
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex justify-center items-center mx-auto p-9">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
        <div>
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block">Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={employee.mobile}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block">Designation:</label>
          <select
            name="designation"
            value={employee.designation}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Select Designation</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
          </select>
        </div>
        <div>
          <label className="block">Gender:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={employee.gender === 'male'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={employee.gender === 'female'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={employee.gender === 'other'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Other
            </label>
          </div>
        </div>
        <div>
          <label className="block">Course:</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="Btech"
                checked={employee.course.includes('Btech')}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Btech
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="MCA"
                checked={employee.course.includes('MCA')}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              MCA
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="MBA"
                checked={employee.course.includes('MBA')}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              MBA
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="BCA"
                checked={employee.course.includes('BCA')}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              BCA
            </label>
          </div>
        </div>
        <div>
          <label className="block">Image:</label>
          <input
            type="file"
            name="imgUpload"
            onChange={handleImageChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
       {employee.imgUpload && employee.imgUpload.data && (
          <div>
            <img
              src={`data:${employee.imgUpload.contentType};base64,${employee.imgUpload.data}`}
              alt="Current employee"
              className="w-32 h-32 object-cover"
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
