import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const FacebookCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const claims = {};

    for (let [key, value] of params.entries()) {
      claims[key] = value;
    }

    console.log("Facebook claims:", claims);

    // Get name, email, role (from backend redirect)
    const name = claims["name"];
    const email = claims["email"];
    const role = claims["role"] || "Employee"; // fallback

    if (name && email) {
      // Store values in localStorage
      localStorage.setItem("user", name);
      localStorage.setItem("email", email);
      localStorage.setItem("token", "facebook"); // dummy token
      localStorage.setItem("role", role);
      localStorage.setItem("employeeId", "fb");

      Swal.fire({
        icon: 'success',
        title: `Welcome, ${name}!`,
        text: 'Facebook login successful!',
        timer: 2000,
        showConfirmButton: false
      });

      // ✅ Navigate to employee dashboard or profile
      navigate("/employee/dashboard"); 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Facebook Login Failed',
        text: 'Missing user information from Facebook.'
      });
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="text-center mt-5">
      <h4>Logging in with Facebook...</h4>
    </div>
  );
};

export default FacebookCallback;
