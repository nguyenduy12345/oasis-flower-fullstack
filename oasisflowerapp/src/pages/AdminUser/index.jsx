import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance, {createAxiosResponseInterceptor} from "../../utils/request.js"

import { MessageContext } from '/src/stores'

import styles from "./styles.module.scss";

const AdminUser = () => {
  const [users, setUsers] = useState();
  const [pages, setPages] = useState();
  const [edit, setEdit] = useState('');
  const navigate = useNavigate();
  const { setMessageNotifi } = useContext(MessageContext)
  const pageLength = [];
  if (pages) {
    for (let i = 0; i < +pages; i++) {
      pageLength.push(i);
    }
  }
  useEffect(() => {
    const userLogin = localStorage.getItem('USER_LOGIN')
    if(!userLogin){
      navigate('/')
      return
    }
  }, [])
  useEffect(() => {
    const fetchPost = async () => {
      try {
        
        const result = await instance.get(`/users?pageNumber=1&pageSize=15`);
        setUsers(result.data.users)
        setPages(result.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  },[edit]);
  const handleBanAccount = async (id) => {
    await instance.patch(`/ban-account?userId=${id}`)
    setEdit(`${id} ban account`)
    setMessageNotifi("Banned account success")
    setTimeout(() => setMessageNotifi(false), 1000)
  }
  const handleReBanAccount = async (id) => {
    await instance.patch(`/re-ban-account?userId=${id}`)
    setEdit(`${id} re-ban account`)
    setMessageNotifi("Re-banned account success")
    setTimeout(() => setMessageNotifi(false), 1000)
  }

  return (
    <div className={styles["profile"]}>
      {/* {isCreatePost && <CreatePost setIsCreatePost={setIsCreatePost} />} */}
      {/* {edit && <EditPost edit={edit} setEdit={setEdit} />} */}
      <div className={styles["profile__menu"]}>

        <Link to="/admin/products?pageNumber=1&pageSize=15">Products</Link>
        <Link to="/admin/users?pageNumber=1&pageSize=15">Users</Link>
      </div>
      {/* {isLogin ? "" : <Navigate to="/signin" />} */}
      <div className={styles["profile__actions"]}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">UserName</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Address</th>
              <th scope="col">Banned</th>
            </tr>
          </thead>
          <tbody>
            {users
              ? users.map((item) => (
                  <tr key={item._id}>
                    <th scope="row">{item.username}</th>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.address}</td>
                    <td>
                        {item.banned ? <button onClick={() => handleReBanAccount(item._id)}>Re-ban</button> : <button onClick={() => handleBanAccount(item._id)} style={{background: "red"}}>Ban</button>}
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

export default AdminUser;
