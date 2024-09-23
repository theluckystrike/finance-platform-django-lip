import { toast, ToastOptions, ToastPosition, TypeOptions } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';const useToast = () => {
  const showToast = (message: string, options?: ToastOptions) => {
    toast(message, {
      position: 'top-right', // Use string values directly
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options,
    });
  };

  const SuccessToast = (message: string, options?: ToastOptions) => {
    showToast(message, { ...options, type: 'success' });
  };

  const ErrorToast = (message: string, options?: ToastOptions) => {
    showToast(message, { ...options, type: 'error' });
  };

  const InfoToast = (message: string, options?: ToastOptions) => {
    showToast(message, { ...options, type: 'info' });
  };

  const  WarningToast = (message: string, options?: ToastOptions) => {
    showToast(message, { ...options, type: 'warning' });
  };

  return {
    showToast,
    SuccessToast,
    ErrorToast,
    InfoToast,
   WarningToast,
  };
};

export default useToast;
