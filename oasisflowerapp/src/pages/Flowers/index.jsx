import { memo, useCallback, useEffect, useState, useContext, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

// import { Filter, Product, ProductView, StyleView } from '/src/components';
const Filter = lazy(() => import('/src/components/Filter'))
const Product = lazy(() => import('/src/components/Product'))
const ProductView = lazy(() => import('/src/components/ProductView'))
const StyleView = lazy(() => import('/src/components/StyleView'))

import { goToTop } from "/src/functions";
import { StyleViewContext, Theme} from "/src/stores";

import products from "/src/assets/data";
import styles from "./styles.module.scss";


const flowers = products.filter(
  (product) => product.product == "flowers"
);
const types = {};
flowers.map((item) => (types[item.type] = 1));
const Flowers = () => {
  const { isDark } = useContext(Theme)
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState(flowers);
  const [listProduct, setListProduct] = useState([]);
  const [filter, setFilter] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataItem, setDataItem] = useState();
  const [isFilPrice, setIsFilPrice] = useState(false);
  const viewContext = useContext(StyleViewContext)
  const {i18n} = useTranslation()
  const n = 9;
  const crrPage = searchParams.get("page");
  useEffect(() => {
    setListProduct(
      products.filter(
        (item, index) =>
          index >= (page - 1) * n && index <= page * n - 1
      )
    );
  }, [crrPage || filter]);
  const handleChange = useCallback(
    (event, value) => {
      setSearchParams({ page: `${value}`});
      setPage(value);
      goToTop();
    },
    []
  );
  return (
    <>
    <Suspense fallback={<p>Loading...</p>}>
      {dataItem && (
        <ProductView dataItem={dataItem} setDataItem={setDataItem} />
      )}
    </Suspense>
      <div className={`${styles["product"]} container row g-2 product`} data-theme={isDark ? 'dark' : 'light'}>
      <Suspense fallback={<p>Loading...</p>}>
        <Filter
          types={types}
          setPage={setPage}
          setIsFilPrice={setIsFilPrice}
          setFilter={setFilter}
          listData={flowers}
          setListProduct={setListProduct}
          setProducts={setProducts}
        />
      </Suspense>
        <div
          className={`${styles["product__list"]} col-xs-12 col-sm-12 col-lg-9`}
        >
          <div className={styles["product__header"]}>
          <h3 className={styles["product__title"]}>Flowers</h3>
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
              <Suspense key={item.id} fallback={<p>Loading...</p>}>
                <Product
                  styleList={viewContext.styleList}
                  setDataItem={setDataItem}
                  item={item}
                />
              </Suspense>
              ))}
            {isFilPrice || (
              <Stack spacing={2}>
                <Pagination
                  className={styles["list__page"]}
                  count={Math.ceil(products.length / n)}
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

export default memo(Flowers);
