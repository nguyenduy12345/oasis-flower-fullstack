import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import instance from "../../utils/request.js"

import { MessageContext } from '/src/stores'
import CreateDiscountCode from "../../components/CreateDiscountCode";

import styles from "./styles.module.scss";

const AdminDiscount = () => {
    const [listDiscount, setListDiscount] = useState([]);
  const [edit, setEdit] = useState();
  const [isCreateDiscount, setIsCreateDiscount] = useState(false)
  const navigate = useNavigate();
  const { setMessageNotifi } = useContext(MessageContext)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await instance.get(`/discount-code-all?pageNumber=1&pageSize=15`);
        setListDiscount(result.data.code)
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  },[edit]);
  const handleReactivateDiscount = async (code) => {
    try {
        await instance.patch(`/discount-code-active/${code}`)
        setEdit(`${code} discount active`)
    } catch (error) {
        
    }
  }
  const handleStopActiveDiscount = async (code) => {
    await instance.patch(`/discount-code/${code}`)
    setEdit(`${code} discount code stop`)
  }
  const handleDeleteDiscount = async(code) => {
    try {
        const res = await instance.delete(`/discount-code/${code}`)
        .then(() => {
            setEdit(`Remove + ${code}`)
            setMessageNotifi(res.data.message)
            setTimeout(() => setMessageNotifi(false), 1000)
        })
    } catch (error) {
        
    }
  }
  return (
    <>
    {isCreateDiscount && <CreateDiscountCode setEdit={setEdit} setIsCreateDiscount={setIsCreateDiscount}/>}
    <div className={styles["profile"]}>
      <div className={styles["profile__menu"]}>
      <Link to="/admin/products?pageNumber=1&pageSize=15">Products</Link>
        <Link to="/admin/users?pageNumber=1&pageSize=15">Users</Link>
        <Link to="/admin/orders?pageNumber=1&pageSize=15">Orders</Link>
        <Link to="/admin/discount?pageNumber=1&pageSize=15">Discount Code</Link>
      </div>
      <div className={styles["profile__actions"]}>
      <div className={styles["profile__function"]}>
          {/* <input placeholder="Searching discount code" /> */}
          <div
            onClick={() => setIsCreateDiscount(true)}
            className={styles["add__new"]}
          >
            Add new
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Discount</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {listDiscount
              ? listDiscount.map((item) => (
                  <tr key={item._id}>
                    <th scope="row">{item.code}</th>
                    <td>{item.discount} %</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>
                        {item.active ? <button onClick={() => handleStopActiveDiscount(item.code)}>Active</button> : <button onClick={() => handleReactivateDiscount(item.code)} style={{background: "red"}}>Reactivate</button>}
                    </td>
                    <td><i onClick={() => handleDeleteDiscount(item.code)} className="fa-solid fa-trash"></i></td>
                  </tr>
                ))
              : []}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default AdminDiscount
