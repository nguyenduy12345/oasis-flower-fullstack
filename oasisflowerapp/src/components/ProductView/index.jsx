import { useSearchParams } from 'react-router-dom';
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import instance from '../../utils/request.js'

import { CartProduct, MessageContext } from '/src/stores';
import { LoginForm } from '/src/components'
import styles from './styles.module.scss'


const ProductView = ({dataItem, setDataItem }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const accountLogin = localStorage.getItem('USER_LOGIN') ? JSON.parse(localStorage.getItem('USER_LOGIN')) : null
    const { setCartProduct} = useContext(CartProduct)
    const [getImage, setGetImage] = useState()
    const [ getSize, setGetSize] = useState('S')
    const [inputNote, setInputNote] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [isMessage, setIsMessage] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const { setMessageNotifi } = useContext(MessageContext)
    const bigImg = useRef()
    const zoomImg = useRef()
    const { t, i18n } = useTranslation('productview')
    const handleCloseProductView = useCallback(() =>{
        setDataItem(null)
        setSearchParams('')
    },[])
    const handleMinusQuantity = useCallback(() =>{
        if(quantity > 1){
           setQuantity(quantity - 1)
           return;
        }
    }, [quantity])
    const handleAddQuantity = useCallback(() => {
        setQuantity(quantity + 1)
        return;
    }, [quantity])
    const handleGetData = async() =>{
        if(accountLogin){
            try {
                const result = await instance.post('carts', {
                    productId: dataItem._id,
                    quantity,
                    size: getSize,
                    note: inputNote
                })
                setCartProduct(result.data.products)
                setMessageNotifi(i18n.language == 'vi' ? 'Thêm giỏ hàng thành công' : 'Added product successfully')
                setTimeout(() =>{setMessageNotifi(undefined)},1000)
                setIsMessage(false)
            } catch (error) {
                setMessageNotifi(error.response.data.message)
                setTimeout(() =>{setMessageNotifi(undefined)},1000)
            }
        }else{
            setIsMessage(true)
            setIsLogin(true)
            setMessageNotifi(i18n.language == 'vi' ? 'Vui lòng đăng nhập!' : 'Please login!')
            setTimeout(() =>{setMessageNotifi(undefined)},1000)
            setSearchParams('')
            clearTimeout(timeout)
            let timeout = setTimeout(() => setIsMessage(false), 10000)
        }
    }
    const changeZoomUp = useCallback((event) => {
        zoomImg.current.style.opacity = 1
        zoomImg.current.style.zIndex = 99
        // GET POSITION ZOOM IMG
        let positionElementX = event.screenX - bigImg.current.getBoundingClientRect().left
        let positionMouseX = (positionElementX / bigImg.current.offsetWidth) * 100
        let positionElementY = event.screenY - bigImg.current.getBoundingClientRect().top
        let positionMouseY = (positionElementY / bigImg.current.offsetHeight) * 100 
    // // SET POSITION ZOOM IMG
        zoomImg.current.style.setProperty('--zoom-x', `${positionMouseX}%`)
        zoomImg.current.style.setProperty('--zoom-y',`${positionMouseY}%`)
    // // SET TRANSFORM ZOOM IMG
        let translateX = -(positionMouseX - 50) / 2.5
        let translateY = -(positionMouseY - 50) / 2.5
        zoomImg.current.style.transform = `scale(1.9) translate(${translateX}% , ${translateY}%)`
    },[])
    const changeZoomDown = useCallback(() => {
        zoomImg.current.style.opacity = 0
        zoomImg.current.style.transform = `scale(0)`
    },[])
    return (
        <>  
        {isLogin && <LoginForm setIsLogin={setIsLogin} />}
        <div className={styles["view"]} key={dataItem._id}>
        <i onClick={handleCloseProductView} className={`${styles["close__view"]} fa-solid fa-xmark`}></i>
        <div className={`${styles["product"]} row mt-3`}>
            <div className={`${styles["product__image"]} col-sm-12 col-lg-5`}>
                <div className={styles["product__image--big"]}>
                    <img onMouseMove={changeZoomUp} ref={bigImg} loading='lazy' src={getImage || dataItem.image} />
                    <img onMouseOut={changeZoomDown} ref={zoomImg} loading='lazy' src={getImage || dataItem.image} />
                </div>
                <ul className={styles["product__image--small"]}>                   
                    <li><img onClick={(e) => setGetImage(e.target.src)} loading='lazy' src={dataItem.image}/></li>
                    <li><img onClick={(e) => setGetImage(e.target.src)} loading='lazy' src="/img/flower/tulips/mixed_tulip.JPG" /></li>  
                    <li><img onClick={(e) => setGetImage(e.target.src)} loading='lazy' src="/img/flower/roses/spring_mixed_rose.jpg" /></li>             
                </ul>
            </div>
            <div className={`${styles["attribute"]} col-sm-12 col-lg-7`}>
                <h4 className={styles["attribute__name"]}>{dataItem.name}</h4>
                <p className={styles["attribute__des"]}>{i18n.language == 'en' ? dataItem.desEN : dataItem.desVI}</p>
                <span className={styles["attribute__title"]}>{t('price')}</span>
                <span className={styles["attribute__price"]}>{`${i18n.language == 'en' ? `${+dataItem.priceEN * quantity}$`: `${new Intl.NumberFormat().format((+dataItem.priceVI * quantity))} VNĐ`}`}</span><br/>
                <span className={styles["attribute__title"]}>{t('quantity')}</span>
                    <ul className={styles["attribute__quantity"]}>
                        <li><i  onClick={handleMinusQuantity} className="fa-solid fa-minus"></i></li>
                        <li><input type="text" onChange={(e) => setQuantity(+e.target.value)} value={quantity} /></li>
                        <li ><i onClick={handleAddQuantity} className="fa-solid fa-plus"></i></li>
                    </ul>
                    <span className={styles["attribute__title"]}>{t('size')}</span>
                    <ul className={styles["size"]}>
                        <li onClick={(e) => setGetSize(e.target.id)} className={styles["size__option"]} id='S'>S</li>
                        <li onClick={(e) => setGetSize(e.target.id)} className={styles["size__option"]} id='M'>M</li>
                        <li onClick={(e) => setGetSize(e.target.id)} className={styles["size__option"]} id='L'>L</li>
                    </ul>
                <div className={styles["accessories"]}>
                    <span className={styles["attribute__title"]}>{t('accessories')}</span>
                    <ul>
                        <li className={styles["accessories__item"]}>
                            <img loading='lazy' src="/img/accessories/binh-ve-hoa-sen-1579078281135761213270.webp" />
                        </li>
                        <li className={styles["accessories__item"]}>
                            <img loading='lazy' src="/img/accessories/img_60f8e56b8eebc.jpg" />
                        </li>
                        <li className={styles["accessories__item"]}>
                            <img loading='lazy' src="/img/accessories/boxgift.webp" />
                        </li>
                    </ul>
                </div>
                <span className={styles["attribute__title"]}>{t('notes')} </span>
                <input value={inputNote} onChange={(e) => setInputNote(e.target.value)} className={styles["product__note"]} type="text" name="write_note" placeholder={t('notes-input')} />
                <button onClick ={() => handleGetData()} className={styles["product__button"]}>{t('button')}</button>
                { isMessage && <p className={styles['product__message']}>{t('message')}</p>}
                <p className="message_add_cart"></p>
            </div>
        </div> 
        </div>
    </>
  )
}

export default memo(ProductView);
