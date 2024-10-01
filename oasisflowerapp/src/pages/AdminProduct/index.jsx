import { useState, useEffect, useContext} from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import instance, {createAxiosResponseInterceptor} from "../../utils/request.js"

import { MessageContext } from '/src/stores'
import { goToTop } from "/src/functions";

import CreateProduct from "../../components/CreateProduct";
import EditProduct from "../../components/EditProduct";

import styles from "./styles.module.scss";

const AdminProduct = () => {
  const { setMessageNotifi } = useContext(MessageContext)
  const [products, setProducts] = useState();
  const [pages, setPages] = useState();
  const [ inputSearching, setInputSearching ] = useState()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [isCreateProduct, setIsCreateProduct] = useState(false)
  const [ dataProduct, setDataProduct ] = useState(false)
  const [isDeleted, setIsDelete] = useState()
  const navigate = useNavigate();
  const pageNumber  = searchParams.get('pageNumber')
  const pageSize  = searchParams.get('pageSize')
  const keyWord  = searchParams.get('keyWord')
  const productId = searchParams.get('productId')
  const pageLength = [];
  if (pages) {
    for (let i = 0; i < +pages; i++) {
      pageLength.push(i);
    }
  }
  const userLogin = localStorage.getItem('USER_LOGIN')
  useEffect(() => {
    const userLogin = localStorage.getItem('USER_LOGIN')
    if(!userLogin){
      navigate('/')
      return
    }
  }, [])
  // GET PRODUCTS
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await instance.get(`/admin/products?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        setProducts(result.data.data)
        setPages(result.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [pageNumber, pageSize, productId, userLogin, isCreateProduct, dataProduct, isDeleted]);
   // SEARCHING PRODUCT
  const handleInputSearch = (e) =>{
    setInputSearching(e.target.value)
    setSearchParams({keyWord: e.target.value})
    if(e.target.value.length == ' '){
      setSearchParams({pageNumber: '1', pageSize: '15'})
      return
    }
  }
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await instance.get(`/admin/products?keyWord=${keyWord}`);
        if(!result){
          return
        }
        setProducts(result.data.data.products)
        setPages(result.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [keyWord]);

  // EDIT PRODUCT
  const handleEditProduct = (item) => {
    setDataProduct(item)
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async(id) => {
    // setSearchParams({productId: id})
    try {
      await instance.patch(`/products?productId=${id}`)
      .then(() => {
        setIsDelete(id)
        setMessageNotifi('Deleted product success')
        setTimeout(() => setMessageNotifi(false), 1000)
      });
    } catch (error) {
      setMessageNotifi('Deleted Failed')
      setTimeout(() => setMessageNotifi(false), 1000)
    }
  };
  // PAGINATION 
  const handlePagination = (numb) => {
      setSearchParams({pageNumber: numb, pageSize: '15'})
      goToTop()
  };

  return (
    <div className={styles["profile"]}>
      {isCreateProduct && <CreateProduct setIsCreateProduct={setIsCreateProduct} />}
      {dataProduct && <EditProduct dataProduct={dataProduct} setDataProduct={setDataProduct}/>}
      <div className={styles["profile__menu"]}>
        <Link to="/admin/products?pageNumber=1&pageSize=15">Products</Link>
        <Link to="/admin/users?pageNumber=1&pageSize=15">Users</Link>
      </div>
      {/* {isLogin ? "" : <Navigate to="/signin" />} */}
      <div className={styles["profile__actions"]}>
        <div className={styles["profile__function"]}>
          <input onChange={handleInputSearch} value={inputSearching} placeholder="Searching product name" />
          <div
            onClick={() => setIsCreateProduct(true)}
            className={styles["add__new"]}
          >
            Add new
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Type</th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              ? products.map((item) => (
                  <tr key={item._id}>
                    <th scope="row">{item.name}</th>
                    <td><img src={item.image} style={{width: "100px", height:"100px"}}/></td>
                    <td>{item.type}</td>
                    <td>{item.priceEN + '$'} </td>
                    <td>
                        <i onClick={() => handleEditProduct(item)} className="fa-solid fa-pen-to-square"></i>
                        <i onClick={() => handleDeleteProduct(item._id)} className="fa-solid fa-trash"></i>
                    </td>
                  </tr>
                ))
              : []}
          </tbody>
        </table>
        <div className={styles["profile__pagination"]}>
          {pageLength &&
            pageLength.map((numb) => (
              <button
                onClick={() => {
                  handlePagination(numb + 1);
                }}
                key={numb}
              >
                {+numb + 1}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
