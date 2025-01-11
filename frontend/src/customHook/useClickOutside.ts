import { useEffect } from 'react';

// Custom hook for handling clicks outside of a ref
const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void,
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

export default useClickOutside;
