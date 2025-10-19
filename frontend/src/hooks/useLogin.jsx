import { useState , useContext} from "react"
import axios from "axios";
import { toast } from "react-toastify";
import { GlobalContext } from '../context/globalContext'

export const useLogin = () => {

   const { phoneNumber, setPhoneNumber, isLoggedIn, setIsLoggedIn } = useContext(GlobalContext)

  const [loginErr, setLoginErr] = useState(null);

  const emailLogin = async (email, password) => {
    try {
      const response = await axios.post(`/api/auth/login`, {
        email: email,
        password: password
      })
      const data = response.data;


      if (data.success) {
        window.localStorage.setItem("isLoggedIn", true);
        window.localStorage.setItem("user", JSON.stringify(data.data));
        // Decode JWT to get user ID
        try {
          const base64Url = data.data.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          localStorage.setItem('userId', decoded._id);
        } catch (e) {
          console.error('Failed to decode token:', e);
        }

        setIsLoggedIn(true);
        window.location = "/dashboard";
      }

    }
    catch (error) {
      toast.error(error.response.data.msg);
      console.log(error.message);
    }
  }
  return { emailLogin, loginErr };
}