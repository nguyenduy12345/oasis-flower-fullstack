import axios from 'axios'
import { useCallback, useEffect, useState, memo } from 'react'

import { debounce } from '/src/functions'
import styles from './styles.module.scss'

const Weather = () => {
    const [isWeatherBox, setIsWeatherBox] = useState(false)
    const [country, setCountry] = useState('')
    const [icon, setIcon] = useState()
    const [data, setData] = useState()
    const API_KEY = '8767e3df5510e5bd334e25ecf9c9630c'
    const getCountry = useCallback((e) =>{
        setCountry(e.target.value)
    }, [])

    useEffect(() =>{
        switch(data?.weather[0]?.main){
            case 'Clouds':
                setIcon("fa-solid fa-cloud")
                return;
            case 'Rain':
                setIcon("fa-solid fa-cloud-rain")
                return;
            case 'Mist':
            case 'Clear':
                setIcon(false)
        }
    }, [data])
    let url2 = country.length > 0 ? 
    `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${API_KEY}` 
    : `https://api.openweathermap.org/data/2.5/weather?q=HaNoi&appid=${API_KEY}`
    useEffect(() =>{
        async function getData() {
            await axios.get(url2)
                .then(res => setData(res.data)) 
                .catch((err) =>{
                    console.log(err)
                })
        }       
        getData()
    }, [country])
    return (
    <div className={styles['weather']}>
      <ul  onClick={() => setIsWeatherBox(!isWeatherBox)}  className={styles["weather__info"]}>
        <li>{`${data?.name},${data?.sys.country} `} </li>
        <li>{Math.round(+data?.main.temp - 273.15)}ºC</li>
        <li>{icon ? <i className={icon}></i> : data?.weather[0]?.main}</li>
        <li></li>
      </ul>
      {/* <div className={styles["weather__time"]}>
        21/03/2024
      </div> */}
      {isWeatherBox ? 
        <i className={`${styles['weather__icon--state']} fa-solid fa-chevron-up`}></i> 
        :
        <i className={`${styles['weather__icon--state']} fa-solid fa-chevron-down`}></i>
      }
      {isWeatherBox && data &&
        <div className={styles["weather__box"]}>
            <ul className={styles["weather__location"]}>
                <li>
                    <input onChange={debounce(getCountry, 500)} placeholder='Find your location'/>
                </li>
                <li>{icon ? <i className={icon}></i> : ''}</li>
                <li>
                    <p>{`${data?.name},${data?.sys.country}`}</p>
                </li>
                <li>{data?.weather[0]?.main}</li>
                <li>{`"${data?.weather[0]?.description}"`}</li>
            </ul>
            <ul className={styles["weather__detail"]}>
                <li>Temp</li>
                <li>Wind</li>
                <li>Humidity</li>
            </ul>
            <ul className={styles["weather__detail"]}>
                <li>{Math.round(+data?.main.temp - 273.15)}ºC</li>
                <li>{`${data?.wind.speed} m/s`}</li>
                <li>{`${data?.main.humidity}%`}</li>
            </ul>
        </div>
      }
    </div>
    
  )
}

export default memo(Weather);
