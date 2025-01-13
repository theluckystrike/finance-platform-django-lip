export const getToken = () => {
  const storedLoginUser = localStorage.getItem('login');
  if (storedLoginUser) {
    return JSON.parse(storedLoginUser).access;
  }
};
