import { memo, useCallback, useRef, useContext} from 'react'
import {  useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Theme } from '/src/stores'
import styles from './styles.module.scss'

const Filter = ({types, setFilter, setProducts, setIsFilPrice, listData, setPage}) => {
    const { isDark } = useContext(Theme)
    const filterBox = useRef()
    const inputMin = useRef(null)
    const inputMax = useRef(null)
    const {t, i18n} = useTranslation('filter')
    const handleOpenFilter = useCallback(() =>{
        filterBox.current.style.display = "block"
      }, [])
      const handleCloseFilter = useCallback(() =>{
        filterBox.current.style.display = "none"
      }, [])
    const keys = Object.keys(types)
    const [searchParams, setSearchParams ] = useSearchParams()
    const handleFilterType = useCallback((key) => {
      const listProduct = listData.filter((item) => item.type == key)
      setSearchParams({type: `${key}`})
      setFilter(key)
      setProducts(listProduct)
      setPage(1)
      setIsFilPrice(false)
    },[])
    const handleFilterAll = useCallback(() =>{
      setSearchParams({type: 'all'})
      setFilter('all')
      setIsFilPrice(false)
      setProducts(listData)
      setPage(1)
    },[])
    const handleFiterAtoZ = useCallback(() =>{
      setSearchParams({type: 'a_z'})
      setFilter('AtoZ')
      setIsFilPrice(false)
      const sortChacracter = listData.sort((a, b) => a.name.localeCompare(b.name))
      setProducts(sortChacracter)
      setPage(1)
    },[])
    const handleFiterZtoA = useCallback(() =>{
      setSearchParams({type: 'z_a'})
      setFilter('ZtoA')
      setIsFilPrice(false)
      const reverseChacracter = listData.sort((a, b) => b.name.localeCompare(a.name))
      setProducts(reverseChacracter)
      setPage(1)
    },[])
    const handleFilterPriceAscending = useCallback(() =>{
      setSearchParams({type: 'price_ascending'})
      setFilter('price_ascending')
      setIsFilPrice(false)
      const sortPriceAscen = listData.sort((a, b) => +a.priceEN - +b.priceEN)
      setProducts(sortPriceAscen)
      setPage(1)
    },[])
    const handleFilterPriceDecreasing = useCallback(() =>{
      setSearchParams({type: 'price_decreasing'})
      setFilter('price_decreasing')
      setIsFilPrice(false)
      const sortPricedecre = listData.sort((a, b) => +b.priceEN - +a.priceEN)
      setProducts(sortPricedecre)
      setPage(1)
    },[])
    const handleFilterPriceRange = useCallback(() =>{
      setSearchParams({min: `${inputMin.current?.value}`, max: `${inputMax.current?.value}`})
      setIsFilPrice(false)
      setPage(1)
      const changePrice = listData.filter((item) => {
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
      changePrice.length == 0 ? setIsFilPrice(true) : setProducts(changePrice)
    },[])
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
                onClick={() => handleFilterType(key)} 
                key={key}
              >{key}</li>
          ))}
        </ul>
      </div>
      <div className={styles["filter__item"]}>
        <p>{t('alpha.title')}</p>
        <button onClick={handleFiterAtoZ}>{t('alpha.charAZ')}</button>
        <button onClick={handleFiterZtoA}>{t('alpha.charZA')}</button>
      </div>
      <div className={styles["filter__item"]}>
        <p>{t('price.title')}</p>
        <button onClick={handleFilterPriceAscending} >{t('price.up')}</button>
        <button onClick={handleFilterPriceDecreasing} >{t('price.down')}</button>
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
