import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Deposit = ({ closeModal, fetchBalance, pendingPayment }) => {
  const { method } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [depositData, setDepositData] = useState({
    wallet_name: method || "",
    amount: "",
    phone_number: "", // Initially empty phone number
  });

  const [logedUser, setLogedUser] = useState(null);

  const handlePaymentMethodChange = (event) => {
    const selectedMethod = event.target.value;
    setPaymentMethod(selectedMethod);
    setShowInstructions(true); // Show instructions when a method is selected
    setDepositData((prevData) => ({
      ...prevData,
      wallet_name: selectedMethod,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepositData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCopyUSSD = () => {
    const ussdCode = `*712*${depositData.phone_number}*${depositData.amount}#`; // Updated USSD code
    navigator.clipboard.writeText(ussdCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    });
  };

  const navigate = useNavigate();
  const handleDeposit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;

    if (!access) {
      navigate("/login");
      return;
    }

    if (depositData.amount < 0) {
      toast.error("Amount cannot be negative");
      return;
    }

    try {
      const response = await fetch("https://api.goobjoogpay.com/api/deposit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(depositData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
        setDepositData({
          wallet_name: "",
          amount: "",
          phone_number: "",
        });
        // Show the instructions and delay the redirection
        setTimeout(() => {
          window.location.href = `tel:*712*${depositData.phone_number}*${depositData.amount}#`; // Updated USSD code
        }, 3000); // Delay redirection for 3 seconds (you can adjust this delay)
      } else {
        throw new Error(responseData.message || "Deposit failed");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error:", error);
    }
  };

  const userMe = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;
    try {
      const response = await fetch(
        "https://api.goobjoogpay.com/auth/users/me/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setLogedUser(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    userMe();
  }, []);

  useEffect(() => {
    if (logedUser && logedUser.phone_number) {
      setDepositData((prevData) => ({
        ...prevData,
        phone_number: logedUser.phone_number, // Set the phone number from the API response
      }));
    }
  }, [logedUser]);

  if (method !== "evcplus") {
    return (
      <div className="mt-20 px-5">
        <h2 className="text-xl font-semibold text-primary-700">Coming Soon</h2>
      </div>
    );
  }

  return (
    <div className="mt-20 px-5">
      <h2 className="text-2xl font-semibold text-primary-700 mb-6">
        Deposit Funds
      </h2>

      {/* Deposit Form */}
      <form onSubmit={handleDeposit}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-primary-700 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-500">
              $
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={depositData.amount}
              min="0"
              step="0.01"
              required
              className="block w-full pl-7 pr-12 py-2 border border-green-500 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="0.00"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-primary-700 mb-1"
          >
            Phone Number
          </label>
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
            <input
              type="text" // Changed from "number" to "text" to allow non-numeric characters (like "+" sign)
              id="phone_number"
              name="phone_number"
              value={depositData.phone_number}
              readOnly // Make the field readonly
              className="block w-full pl-24 pr-12 py-2 border border-green-500 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="61635353"
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Instructions section */}
        {showInstructions && (
          <div className="mb-4 p-4 border bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold text-primary-700 mb-2">
              Instructions
            </h3>
            <p className="text-sm text-primary-600">
              To make a deposit, please use the USSD code below:
              <br />
              <strong>
                *712*{depositData.phone_number}*{depositData.amount}#
              </strong>
            </p>
            <button
              type="button"
              className="mt-2 text-blue-500 text-sm"
              onClick={handleCopyUSSD}
            >
              {copySuccess ? "Copied!" : "Copy USSD Code"}
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition duration-300"
          >
            Deposit
          </button>
        </div>
      </form>

      {/* Deposit Summary Table (Moved down and dashed borders) */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-primary-700 mb-2">
          Deposit Summary
        </h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-medium text-primary-600 border-b-2 border-dashed">
                Field
              </th>
              <th className="px-4 py-2 text-left font-medium text-primary-600 border-b-2 border-dashed">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-primary-600 border-b border-dashed">
                Wallet Method
              </td>
              <td className="px-4 py-2 text-primary-600 border-b border-dashed">
                {depositData.wallet_name}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-primary-600 border-b border-dashed">
                Amount
              </td>
              <td className="px-4 py-2 text-primary-600 border-b border-dashed">
                ${depositData.amount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-primary-600 border-b border-dashed">
                Phone Number
              </td>
              <td className="px-4 py-2 text-primary-600 border-b border-dashed">
                {depositData.phone_number}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deposit;
