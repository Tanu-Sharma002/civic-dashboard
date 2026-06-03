import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(
        "https://civic-dashboard-vicc.onrender.com/signup",
        {
          name,
          email,
          password
        }
      );

      alert("Account Created Successfully, now you can login");
      navigate("/login");

    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Signup Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-cyan-500 to-green-500 flex items-center justify-center px-4">

      <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Civic Dashboard
        </h1>

        <p className="text-center text-white mb-8">
          Create your account
        </p>

        {/* Name */}
        <div className="relative mb-4">
          <FaUser className="absolute top-4 left-4 text-gray-500" />

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-black focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute top-4 left-4 text-gray-500" />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-black focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <FaLock className="absolute top-4 left-4 text-gray-500" />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-black focus:outline-none"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-xl bg-white text-blue-700 font-bold hover:scale-105 transition duration-300"
        >
          Create Account
        </button>

        <p className="text-center text-white mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;