import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import instance, {createAxiosResponseInterceptor} from "/src/utils/request.js"

import styles from './styles.module.scss'

const EditProduct = ({dataProduct, setDataProduct}) => {
    const [data, setData] = useState({
      name: dataProduct.name,
      product: dataProduct.product,
      type: dataProduct.type,
      desEN: dataProduct.desEN,
      desVI: dataProduct.desVI,
      priceEN: dataProduct.priceEN,
      priceVI: dataProduct.priceVI
    })
    let [searchParams, setSearchParams] = useSearchParams();
    const pageNumber = searchParams.get('pageNumber')
    const pageSize = searchParams.get('pageSize')
    const [image, setImage] = useState(dataProduct.image)
    const [file, setFile] = useState()
    const [message, setMessage] = useState()
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm()
    const onSubmit = async(payload)=>{
      const formData = new FormData()
      const {name, product, type, desEN, desVI, priceEN, priceVI} = payload
      formData.append('name', name)
      formData.append('product', product)
      formData.append('type', type)
      formData.append('desEN', desEN)
      formData.append('desVI', desVI)
      formData.append('priceEN', priceEN)
      formData.append('priceVI', priceVI)
      if(file){
        formData.append('file', file)
      }else(
        formData.append('image', dataProduct.image)
      )
      await instance.patch(`products/${dataProduct._id}`, formData, {
          headers: {
            'Content-Type': `multipart/form-data`,
          }
        })
      .then((res) => {
          setMessage(res.data.message)
          setTimeout(() => {
              setMessage('')
              setDataProduct(false)
          }, 1000);
        })
      .catch(err => setMessage(err.response.data.message))
    }
    const handleChoseFile = (e) => {
      setMessage('')
      e.preventDefault()
      let file = e.target.files[0];
      let result = URL.createObjectURL(file);
      setImage(result);
      setFile(file)
  }
    const handleClose = (e) =>{
      e.preventDefault(); 
      setDataProduct(false)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
        <h5>EDIT PRODUCT</h5>
        <label htmlFor="name">Name</label>
        <input {...register("name", {required: 'name is required'})} id="name" type="text" name="name" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.name}/>
        {errors.name && <p style={{textAlign:'center', color:'red'}}>{errors.name.message}</p>}
        <label htmlFor="product">Product Type</label>
        <input {...register("product", {required: 'field is required'})} id="product" type="text" name="product" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.product} />
        {errors.product && <p style={{textAlign:'center', color:'red'}}>{errors.product.message}</p>}
        <label htmlFor="type">Type</label>
        <input {...register("type", {required: 'type is required'})} id="type" type="text" name="type" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.type}/>
        {errors.type && <p style={{textAlign:'center', color:'red'}}>{errors.type.message}</p>}
        <label htmlFor="desEN">Description EN</label>
        <input {...register("desEN", {required: 'desEN is required'})} id="desEN" type="text" name="desEN" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.desEN}/><br/>
        {errors.desEN && <p style={{textAlign:'center', color:'red'}}>{errors.desEN.message}</p>}
        <label htmlFor="desVI">Description VI</label>
        <input {...register("desVI", {required: 'desVI is required'})} id="desVI" type="text" name="desVI" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.desVI}/><br/>
        {errors.desVI && <p style={{textAlign:'center', color:'red'}}>{errors.desVI.message}</p>}
        <label htmlFor="priceEN">Price EN</label>
        <input {...register("priceEN", {required: 'priceEN is required'})} id="priceEN" type="text" name="priceEN" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.priceEN} />
        {errors.priceEN && <p style={{textAlign:'center', color:'red'}}>{errors.priceEN.message}</p>}
        <label htmlFor="priceVI">Price VI</label>
        <input {...register("priceVI", {required: 'priceVI is required'})} id="priceVI" type="text" name="priceVI" onChange={(e) => setData({...data, [e.target.name]: e.target.value})} value={data.priceVI}/>
        {errors.priceVI && <p style={{textAlign:'center', color:'red'}}>{errors.priceVI.message}</p>}
        <label htmlFor="image">Image</label>
        <input type='file' id='image' onChange={handleChoseFile}/>
        {image ? <img src={image} style={{width: '100px', height: '100px', marginLeft: '180px'}}/> : <img src={data.image} style={{width: '100px', height: '100px', marginLeft: '180px'}}/> } <br/>
        <button type="submit">{isSubmitting ?  'Updating...' : 'Update'}</button>
        <button onClick={handleClose}>Close</button>
        {message && <p style={{textAlign:'center', color:'red'}}>{message}</p>}
    </form>
  );
};

export default EditProduct;
