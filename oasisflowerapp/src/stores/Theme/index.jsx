import { createContext, useState } from "react"

export const Theme = createContext({})
const ThemeProvider = ({children}) => {
    const getTheme = localStorage.getItem("DARK_MODE") ? JSON.parse(localStorage.getItem("DARK_MODE")) : false
    const [isDark, setIsDark] = useState(getTheme)
  return (
    <Theme.Provider value={{isDark, setIsDark}}>
        {children}
    </Theme.Provider>
  )
}

export default ThemeProvider
