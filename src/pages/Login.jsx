import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); // For animation control
  const navigate = useNavigate();

  // Animation effect - make components visible after page load
  useEffect(() => {
    setVisible(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (error.code === "auth/user-not-found") {
        setError("User not found.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-200 transition-all duration-1000">
      <div className={`transform transition-all duration-700 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h1 className="text-3xl font-bold mb-8 text-green-800 text-center relative">
          Login
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-500 rounded-full mt-2"></div>
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-xl w-80">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className={`transition-all duration-500 delay-100 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <input
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className={`transition-all duration-500 delay-200 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <input
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-pulse">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            
            <div className={`transition-all duration-500 delay-300 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <button
                className={`w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 ${loading ? "cursor-not-allowed opacity-80" : ""}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className={`mt-6 text-center transition-all duration-500 delay-400 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <p className="text-green-800">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 relative group">
              Sign Up
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;