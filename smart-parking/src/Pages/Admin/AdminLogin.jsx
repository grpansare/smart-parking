import {
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      navigate("/admindashboard")
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-700">
            ParkEase
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please login to access the dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
