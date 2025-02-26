import { Lock, User, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    full_name: "",
    phone_number: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    // Check if the phone number is 9 digits and either starts with 07 or is a 9-digit number
    const phonePattern = /^(07\d{7}|61\d{7})$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(registerData.phone_number)) {
      setError("Phone number must be 9 digits and start with 07 or 61.");
      return; // Prevent form submission if validation fails
    }

    setError(""); // Clear any previous error

    try {
      const response = await fetch("https://api.goobjoogpay.com/auth/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: registerData.full_name,
          phone_number: registerData.phone_number,
          password: registerData.password,
        }),
      });
      const data = await response.json();
      console.log("Success:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <div className="text-start mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Goobjoog Pay</h1>
          <p className="text-blue-600 mt-2">Create your account below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-blue-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-blue-700" />
              </span>
              <input
                className="appearance-none border bg-white border-blue-300 rounded-lg w-full py-3 px-3 pl-10 text-primary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={registerData.full_name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, full_name: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              className="block text-blue-700 text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="w-5 h-5 text-blue-700" />
              </span>
              <input
                className="appearance-none border bg-white border-blue-300 rounded-lg w-full py-3 px-3 pl-10 text-primary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={registerData.phone_number}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    phone_number: e.target.value,
                  })
                }
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div>
            <label
              className="block text-blue-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-blue-700" />
              </span>
              <input
                className="appearance-none bg-white border border-blue-300 rounded-lg w-full py-3 px-3 pl-10 text-primary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none transition duration-300"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-primary-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-bold hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
