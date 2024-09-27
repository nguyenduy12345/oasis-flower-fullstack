import { memo, useContext } from 'react'
import { MessageContext } from '/src/stores'

import styles from './styles.module.scss'
const MessageNotification = () => {
    const { messageNotifi } = useContext(MessageContext)
  return (
    <>
    {messageNotifi ? <div className={styles["message"]}><i className="fa-sharp fa-solid fa-bell"></i>{messageNotifi}</div> : undefined}
    </>
    
  )
}

export default memo(MessageNotification)
