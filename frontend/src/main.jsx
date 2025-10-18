import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { GlobalProvider } from './context/globalContext.jsx';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
 
axios.interceptors.request.use((config) => {
  return config;
}, Promise.reject);

axios.interceptors.response.use((res) => res, (error) => {
  if (error.response?.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <GlobalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
    </GlobalProvider>
  // </StrictMode>,
)
