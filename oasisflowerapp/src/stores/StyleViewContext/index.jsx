import { createContext, useState, useCallback } from 'react'

export const StyleViewContext = createContext({})

const StyleViewProvider = ({ children }) => {
const [styleList, setStyleList] = useState("list");
const handleChangeStyleList = useCallback(
    (event, value) => {
      setStyleList(value);
    },[]);
  return (
    <StyleViewContext.Provider value={{styleList, handleChangeStyleList}}>
        {children}
    </StyleViewContext.Provider>
  )
    
}

export default StyleViewProvider
