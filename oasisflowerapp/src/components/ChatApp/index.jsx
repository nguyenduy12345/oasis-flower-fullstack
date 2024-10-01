import { useState } from 'react'
import {marked} from 'marked'

import run from '../../gemini'

import styles from './styles.module.scss'

const ChatApp = ({setIsChat}) => {
  const [chat, setChat] = useState([])
  const [isLoading, setIsLoading] = useState(false)
    const [question, setQuestion] = useState('')
    const handleSendQuestion = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        await run(question)
        .then((res) => {
            setChat([...chat, {user: question, AI: marked.parse(res)}])
            setIsLoading(false)
        })
    }
  return (
    <div className={styles['chat']}>
        <i onClick={() => setIsChat(false)} className='fa-solid fa-xmark'></i>
      <div className={styles["chat__show"]}>
        {chat.map((item, i) => (
            <div className={styles['chat__show--small']} key={i}>
                <p><span>USER: </span>{item.user}?</p>
                <span>AI:</span> <p dangerouslySetInnerHTML={{__html: item.AI}} />
            </div>
        ))}
      </div>
      <div className={styles["chat__input"]}>
        <input placeholder='Enter your question...' onChange={(e) => setQuestion(e.target.value)} value={question} />
        <button onClick={handleSendQuestion}>{isLoading ? 'Loading...' : 'Send'}</button>
      </div>
    </div>
  )
}

export default ChatApp
