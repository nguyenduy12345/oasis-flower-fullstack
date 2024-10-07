import { memo, useCallback, useRef, useContext, useState} from 'react'
import {  useSearchParams, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import instance, {createAxiosResponseInterceptor} from '../../utils/request.js';
import { Theme } from '/src/stores'
import styles from './styles.module.scss'

const Filter = ({types, setFilter, setData, setIsFilPrice, products, setPage}) => {
    const { productName } = useParams()
    const { isDark } = useContext(Theme)
    const filterBox = useRef()
    const inputMin = useRef(null)
    const inputMax = useRef(null)
    const [isToggle, setIsToggle] = useState()
    const {t, i18n} = useTranslation('filter')
    const handleOpenFilter = useCallback(() =>{
        filterBox.current.style.display = "block"
      }, [])
      const handleCloseFilter = useCallback(() =>{
        filterBox.current.style.display = "none"
      }, [])
    const keys = Object.keys(types)
    const [searchParams, setSearchParams ] = useSearchParams()
    //FILTER TYPE
    const handleFilterType = (key) => {
      const listProduct = products.filter(item => item.type === key) 
      setData(listProduct)
      setSearchParams({type: key, page:'1'})
      setFilter(key)
      setIsFilPrice(false)
      setPage(1)
      setIsToggle(key)
    }
    // GET ALL PRODUCTS
    const handleFilterAll = () =>{
      setData(products)
      setSearchParams({type: 'all', page:'1'})
      setFilter('all')
      setIsFilPrice(false)
      setPage(1)
    }
    // FILTER CHARACTER
    const handleFilterAtoZ = (e) =>{
      setSearchParams({type: 'a_z', page:'1'})
      setFilter('AtoZ')
      setIsFilPrice(false)
      const sortChacracter = products.sort((a, b) => a.name.localeCompare(b.name))
      setData(sortChacracter)
      setPage(1)
      setIsToggle(e.target.name)
    }
    const handleFilterZtoA = (e) =>{
      setSearchParams({type: 'z_a', page:'1'})
      setFilter('ZtoA')
      setIsFilPrice(false)
      const reverseChacracter = products.sort((a, b) => b.name.localeCompare(a.name))
      setData(reverseChacracter)
      setPage(1)
      setIsToggle(e.target.name)
    }
    // FILTER BY PRICE
    const handleFilterPriceAscending = (e) =>{
      setSearchParams({type: 'price_ascending', page:'1'})
      setFilter('price_ascending')
      setIsFilPrice(false)
      const sortPriceAscen = products.sort((a, b) => +a.priceEN - +b.priceEN)
      setData(sortPriceAscen)
      setPage(1)
      setIsToggle(e.target.name)
    }
    const handleFilterPriceDecreasing = (e) =>{
      setSearchParams({type: 'price_decreasing', page:'1'})
      setFilter('price_decreasing')
      setIsFilPrice(false)
      const sortPricedecre = products.sort((a, b) => +b.priceEN - +a.priceEN)
      setData(sortPricedecre)
      setPage(1)
      setIsToggle(e.target.name)
    }
    const handleFilterPriceRange = () =>{
      setSearchParams({min: `${inputMin.current?.value}`, max: `${inputMax.current?.value}`})
      setIsFilPrice(false)
      setPage(1)
      const changePrice = products.filter((item) => {
        if(inputMin.current?.value && inputMax.current?.value.length > 0){
          return (((i18n.language == 'en' ? item.priceEN : +item.priceVI) >= (+inputMin.current.value)) && ((i18n.language == 'en' ? item.priceEN : +item.priceVI) <= (+inputMax.current.value)))
        }
        if(inputMin.current?.value && inputMax.current.value == '' ){
          return (((i18n.language == 'en' ? item.priceEN : +item.priceVI) >=  (+inputMin.current.value))) ;
        }
        if(inputMax.current?.value && inputMin.current.value == '' ){
          return (((i18n.language == 'en' ? item.priceEN: +item.priceVI) <=  (+inputMax.current.value))) ;
        }
        if(inputMax.current?.value == '' && inputMin.current.value == '' ){
          return true;
        }
      })
      setFilter(`change_price: min${inputMin.current?.value} & max${inputMax.current?.value}`)
      changePrice.length == 0 ? setIsFilPrice(true) : setData(changePrice)
    }
    return (
    <>
    <i onClick={handleOpenFilter} className={`${styles["filter"]} fa-sharp fa-solid fa-bars`}> Sort by</i>
    <div ref={filterBox} className={`${styles["filter"]} col-xs-12 col-sm-12 col-lg-3`} data-theme={isDark ? 'dark' : 'light'}>
    <i onClick={handleCloseFilter} className={`${styles["close__filter"]} fa-solid fa-xmark`}></i>
      <p onClick={handleFilterAll}  className={styles["filter__item"]}>{t('all')}</p>
      <div className={styles["filter__item"]}>
        <p>{t('type')}</p>
        <ul>
          {keys.map((key)=> (
              <li
                className={isToggle === key ? styles['active'] : ''}
                onClick={() => handleFilterType(key)} 
                key={key}
              >{key}</li>
          ))}
        </ul>
      </div>
      <div className={styles["filter__item"]}>
        <p>{t('alpha.title')}</p>
        <button onClick={handleFilterAtoZ} className={isToggle === t('alpha.charAZ') ? styles['active'] : ''} name={t('alpha.charAZ')}>{t('alpha.charAZ')}</button>
        <button onClick={handleFilterZtoA} className={isToggle === t('alpha.charZA') ? styles['active'] : ''} name={t('alpha.charZA')}>{t('alpha.charZA')}</button>
      </div>
      <div className={styles["filter__item"]}>
        <p>{t('price.title')}</p>
        <button onClick={handleFilterPriceAscending} className={isToggle === t('price.up') ? styles['active'] : ''} name={t('price.up')} >{t('price.up')}</button>
        <button onClick={handleFilterPriceDecreasing} className={isToggle === t('price.down') ? styles['active'] : ''} name={t('price.down')} >{t('price.down')}</button>
        <p>{t('price-range.title')}</p>
        <input type="number" placeholder={t('price-range.min')} ref={inputMin}/> <br />
        <input type="number" placeholder={t('price-range.max')} ref={inputMax}/>
        <button onClick={() => handleFilterPriceRange()}>{t('price-range.button')}</button>
      </div>
    </div>
    </>
  )
}

export default memo(Filter)
