import { memo, useCallback, useEffect, useState, useContext, lazy, Suspense } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

const Filter = lazy(() => import('/src/components/Filter'))
const Product = lazy(() => import('/src/components/Product'))
const ProductView = lazy(() => import('/src/components/ProductView'))
const StyleView = lazy(() => import('/src/components/StyleView'))

import { goToTop } from "/src/functions";
import { StyleViewContext, Theme} from "/src/stores";
import instance  from "../../utils/request.js";

import styles from "./styles.module.scss";

const Products = () => {
  const { productName } = useParams()
  const { isDark } = useContext(Theme)
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([])
  const [listProduct, setListProduct] = useState([]);
  const [filter, setFilter] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataItem, setDataItem] = useState();
  const [isFilPrice, setIsFilPrice] = useState(false);
  const viewContext = useContext(StyleViewContext)
  const {i18n} = useTranslation()
  const n = 9;
  const crrPage = searchParams.get('page')
  const type = searchParams.get('type')
  useEffect(() => {
    const fetchProducts = async() =>{
      const res = await instance.get(`products/${productName}`)
      setProducts(res?.data?.data || [])
      setData(res?.data?.data || [])
      setSearchParams({type: 'all', page: '1'})
    }
    fetchProducts()
  },[productName])
  useEffect(() => {
    setListProduct(
      data.filter(
        (item, index) =>
          index >= (page - 1) * n && index <= page * n - 1
      )
    );
  },[type, crrPage]);
  const handleChange = (event, value) => {
      setSearchParams({type: filter, page: `${value}`});
      setPage(value);
      goToTop()
  }
  const types = {};
  products.map((item) => (types[item.type] = 1));
  return (
    <>
      <div className={`${styles["product"]} container row g-2 product`} data-theme={isDark ? 'dark' : 'light'}>
      <Suspense fallback={<p>Loading...</p>}>
        <Filter
          types={types}
          setPage={setPage}
          setIsFilPrice={setIsFilPrice}
          setFilter={setFilter}
          products={products}
          setData={setData}
          setListProduct={setListProduct}
          setProducts={setProducts}
        />
      </Suspense>
        <div
          className={`${styles["product__list"]} col-xs-12 col-sm-12 col-lg-9`}
        >
          <div className={styles["product__header"]}>
          <h3 className={styles["product__title"]}>{productName}</h3>
          <Suspense fallback={<p>Loading...</p>}><StyleView /></Suspense>
          </div>
          <div
            className={
              viewContext.styleList == "list"
                ? `${styles["product__list--small"]} row`
                : `${styles["product__row--small"]}`
            }
          >
            {(isFilPrice && <h4>{i18n.language == 'vi'? "Không tìm thấy sản phẩm tương ứng" : "can't find product. Please enter again"}</h4>) ||
              listProduct.map((item) => (
              <Suspense key={item._id} fallback={<p>Loading...</p>}>
                <Product
                  styleList={viewContext.styleList}
                  item={item}
                />
              </Suspense>
              ))}
            {isFilPrice || (
              <Stack spacing={2}>
                <Pagination
                  className={styles["list__page"]}
                  count={Math.ceil(data.length / n)}
                  onChange={handleChange}
                  size="large"
                  variant="outlined"
                />
              </Stack>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Products);
