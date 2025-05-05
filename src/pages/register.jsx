import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // Animation effect - make components visible after page load
  useEffect(() => {
    setVisible(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic form validation
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to home/dashboard
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative">
          {/* Character SVG - Positioned to not interfere with inputs */}
          <div className={`absolute -top-28 right-0 transition-all duration-500 delay-500 ${visible ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <svg width="100" height="100" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="40" r="25" fill="#4B5563" />
              <path d="M60 65 L60 95 L50 115" stroke="#4B5563" strokeWidth="6" fill="none" />
              <path d="M60 65 L60 95 L70 115" stroke="#4B5563" strokeWidth="6" fill="none" />
              <path d="M60 75 L30 65 L10 40" stroke="#4B5563" strokeWidth="6" fill="none" />
              <path d="M60 75 L90 60 L105 30" stroke="#4B5563" strokeWidth="6" fill="none" />
              <circle cx="53" cy="35" r="3" fill="white" />
              <circle cx="67" cy="35" r="3" fill="white" />
              <path d="M50 48 Q60 55 70 48" stroke="white" strokeWidth="2" fill="none" />
              <path d="M105 30 L110 20" stroke="#4B5563" strokeWidth="6" fill="none" />
              <path d="M110 20 L122 18" stroke="#4B5563" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center relative">
            Create Account
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full mt-2"></div>
          </h1>
          
          <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className={`transition-all duration-500 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className={`transition-all duration-500 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-pulse">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
              
              <div className={`transition-all duration-500 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-md ${loading ? "cursor-not-allowed opacity-80" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className={`mt-6 text-center transition-all duration-500 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-blue-800">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 relative group">
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;