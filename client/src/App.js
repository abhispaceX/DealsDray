import EmployeeForm from "./components/employeForm";
import EmployeeList from "./components/EmployeeList";
import EditEmployee from "./components/EditEmployee";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Navigate } from 'react-router-dom';
import Navbar from "./Shared/Navbar";
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login if there's no token
      return <Navigate to="/" replace />;
    }
    
    return children;
  };
  const PublicRoute =({children})=>{
    const token = localStorage.getItem('token');
    
    if (token) {
      // Redirect to home if there's a token
      return <Navigate to="/employees" replace />;
    }
    
    return children;
  }
  const NavbarWrapper = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const isPublicRoute = location.pathname === '/' || location.pathname === '/signup';

    if (token && !isPublicRoute) {
      return <Navbar />;
    }
    return null;
  }
  return (
    <BrowserRouter>
    
      <NavbarWrapper/>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
        <Route path="/employees" 
        element={
        <ProtectedRoute> 
          <EmployeeList />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <EmployeeForm />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
          <EditEmployee />
        </ProtectedRoute>
      } />
       {/* </Provider> */}
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
