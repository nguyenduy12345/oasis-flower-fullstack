import { useState, createContext, ReactNode }from 'react'


export const MessageContext = createContext({})

const MessageContextProvider = ({children}) => {
    const [messageNotifi, setMessageNotifi] = useState()
  return (
    <MessageContext.Provider value={{messageNotifi, setMessageNotifi}}>
        {children}
    </MessageContext.Provider>
  )
}

export default MessageContextProvider
