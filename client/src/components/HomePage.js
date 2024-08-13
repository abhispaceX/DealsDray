import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center  justify-center h-screen bg-gray-100">
      <h1 className="text-6xl  font-bold mb-8 text-gray-800">Welcome to Employee Management</h1>
      <Link to="/add">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg">
          Create New Employee
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
