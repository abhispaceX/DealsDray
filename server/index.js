const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const auth = require('./middleware/auth')
const bodyParser = require('body-parser');
const Employee =require('./models/employee')
require('dotenv').config();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return cb(new Error('Only jpg and png files are allowed'));
    }
    cb(null, true);
  }
});

const app = express();
const port = process.env.PORT || 5001;  // Changed to 5000 to match your curl command

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);


app.get('/api/employees',auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

app.post('/api/employees',auth, upload.single('imgUpload'), async (req, res) => {
    try {
      
  
      // Check if all required fields are present
      const requiredFields = ['name', 'email', 'mobile', 'designation', 'gender', 'course'];
      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'Image upload is required' });
      }
  
      // Convert the image buffer to a Base64 encoded string
      const imgBase64 = req.file.buffer.toString('base64');
  
      const employeeData = {
        ...req.body,
        imgUpload: {
          data: imgBase64,
          contentType: req.file.mimetype
        }
      };
  
      const employee = new Employee(employeeData);
      await employee.save();
      res.status(201).json({ message: 'Employee created successfully', employeeId: employee._id });
    } catch (error) {
      console.error('Error creating employee:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
      }
    }
  });
  
app.get('/api/employees/:id',auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
});

app.put('/api/employees/:id',auth, upload.single('imgUpload'), async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.imgUpload = {
          data: req.file.buffer.toString('base64'),
          contentType: req.file.mimetype
        };
      }
      const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
  });
app.delete('/api/employees/:id', auth,async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
  });
  app.get('/api/employees',auth, async (req, res) => {
    try {
      const employees = await Employee.find().lean();
      const employeesWithIndex = employees.map((employee, index) => ({
        ...employee,
        uniqueId: index + 1,
        imgUpload: employee.imgUpload ? {
          ...employee.imgUpload,
          data: `data:${employee.imgUpload.contentType};base64,${employee.imgUpload.data}`
        } : null
      }));
      res.json(employeesWithIndex);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
  });

app.listen(port, () => console.log(`Server running on port ${port}`));