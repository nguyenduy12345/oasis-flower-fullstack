
const debounce = (callback, delay) => {
    let timeout= null
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        callback(...args) 
      }, delay)
    };
  };

export default debounce
