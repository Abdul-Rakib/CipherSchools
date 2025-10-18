import { useState } from "react"
import axios from "axios";
import { toast } from "react-toastify";

export const useLogin = () => {
  const [loginErr, setLoginErr] = useState(null);

  const emailLogin = async (email, password) => {
    try {
      const response = await axios.post(`/auth/login`, {
        email: email,
        password: password
      })
      const data = response.data;


      if (data.success) {
        window.localStorage.setItem("isLoggedIn", true);
        window.localStorage.setItem("user", JSON.stringify(data.data));
        window.location = "/";
      }

    }
    catch (error) {
      toast.error(error.response.data.msg);
      console.log(error.message);
    }
  }
  return { emailLogin, loginErr };
}