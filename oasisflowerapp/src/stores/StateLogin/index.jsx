import { createContext, useState} from "react";

export const StateLogin = createContext({});

const StateLoginProvide = ({ children }) => {
  const [stateLogin, setStateLogin] = useState(false);
  return (
    <StateLogin.Provider value={{ stateLogin, setStateLogin }}>
      {children}
    </StateLogin.Provider>
  );
};

export default StateLoginProvide;
