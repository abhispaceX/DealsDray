import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    imgUpload: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const mobileRegex = /^\d+$/;
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be numeric';
    }

    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (formData.course.length === 0) {
      newErrors.course = 'At least one course must be selected';
    }

    if (!formData.imgUpload) {
      newErrors.imgUpload = 'Image upload is required';
    } else if (!['image/jpeg', 'image/png'].includes(formData.imgUpload.type)) {
      newErrors.imgUpload = 'Only jpg/png files are allowed';
    }
    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        });

        console.log('Sending data:', Object.fromEntries(formDataToSend));

        const response = await axios.post('http://localhost:5001/api/employees', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem('token')
          },
        });

        console.log('Response:', response);

        if (response.status === 201) {
          alert("Employee created successfully");
          navigate('/');
        }
      } catch (error) {
        console.error('Error creating employee', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          alert(`Failed to create employee: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          console.error('Request config:', error.config);
          alert('Failed to create employee: No response from server');
        } else {
          console.error('Error setting up request:', error.message);
          alert(`Failed to create employee: ${error.message}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedCourses = checked
        ? [...formData.course, value]
        : formData.course.filter(course => course !== value);
      setFormData({
        ...formData,
        course: updatedCourses,
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
}

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Employee Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Mobile No</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select Designation</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Hr">Designer</option>
            <option value="sales">Designer</option>
          </select>
          {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
                className="mr-2"
              />
              Other
            </label>
          </div>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Course</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="Btech"
                checked={formData.course.includes('Btech')}
                onChange={handleChange}
                className="mr-2"
              />
              Btech
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="MCA"
                checked={formData.course.includes('MCA')}
                onChange={handleChange}
                className="mr-2"
              />
              MCA
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="BCA"
                checked={formData.course.includes('BCA')}
                onChange={handleChange}
                className="mr-2"
              />
              BCA
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="course"
                value="MBA"
                checked={formData.course.includes('MBA')}
                onChange={handleChange}
                className="mr-2"
              />
              MBA
            </label>
          </div>
          {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image Upload (jpg/png only)</label>
          <input
            type="file"
            name="imgUpload"
            onChange={handleChange}
            accept="image/jpeg, image/png"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.imgUpload && <p className="text-red-500 text-sm">{errors.imgUpload}</p>}
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:bg-blue-700 ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
