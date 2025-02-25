import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useUser";
import toast from "react-hot-toast";

const Login = () => {
  const [loginData, setLoginData] = useState({
    phone_number: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://api.barrowpay.com/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      login(data);
      toast.success("Login successful.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-8 bg-white shadow-lg">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-indigo-600 tracking-tight">GoobjoogPay</h1>
            <p className="text-lg text-gray-500">Sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <div className="flex items-center gap-2 pr-3 border-r">
                    <img
                      src="https://flagcdn.com/w40/so.png"
                      width={22}
                      height={16}
                      alt="Somalia flag"
                      className="rounded-sm"
                    />
                    <span className="text-sm font-medium">+252</span>
                  </div>
                </div>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  className="pl-[108px] py-5 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={loginData.phone_number}
                  onChange={(e) => setLoginData({ ...loginData, phone_number: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                className="py-5 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 text-base font-medium rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <div className="text-center mt-4">
              <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                Don't have an account? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Column - Modern Gradient Background */}
      <div className="hidden lg:block">
        <div className="h-full bg-gradient-to-br from-indigo-700 via-indigo-500 to-indigo-400 flex items-center justify-center text-white p-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold">Secure Payments with GoobjoogPay</h2>
            <p className="text-lg max-w-md">Fast, secure, and reliable payment services for all your transactions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
