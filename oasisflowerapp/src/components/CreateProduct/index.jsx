import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import instance, {createAxiosResponseInterceptor} from "/src/utils/request.js"

import styles from './styles.module.scss'

const CreateProduct = ({setIsCreateProduct}) => {
    const [image, setImage] = useState(false)
    const [file, setFile] = useState(false)
    const [message, setMessage] = useState()
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm()
    const onSubmit = async(data)=>{
        if(!file){
            setMessage("Please choose one image")
            return
        }
        const formData = new FormData()
        const {name, product, type, desEN, desVI, priceEN, priceVI } = data
        formData.append('name', name)
        formData.append('product', product)
        formData.append('type', type)
        formData.append('desEN', desEN)
        formData.append('desVI', desVI)
        formData.append('priceEN', priceEN)
        formData.append('priceVI', priceVI)
        formData.append('file', file)
        await instance.post('products', formData, {
            headers: {
              'Content-Type': `multipart/form-data`,
            }
          })
        .then((res) => {
            setMessage(res.data.message)
            setTimeout(() => {
                setMessage('')
                setIsCreateProduct(false)
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
        setIsCreateProduct(false)
    }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
        <h5>CREATE PRODUCT</h5>
        <label htmlFor="name">Name</label>
        <input {...register("name", {required: 'name is required'})} id="name" type="text" name="name"/>
        {errors.name && <p style={{textAlign:'center', color:'red'}}>{errors.name.message}</p>}
        <label htmlFor="product">Product Type</label>
        <input {...register("product", {required: 'field is required'})} id="product" type="text" name="product" />
        {errors.product && <p style={{textAlign:'center', color:'red'}}>{errors.product.message}</p>}
        <label htmlFor="type">Type</label>
        <input {...register("type", {required: 'type is required'})} id="type" type="text" name="type"/>
        {errors.type && <p style={{textAlign:'center', color:'red'}}>{errors.type.message}</p>}
        <label htmlFor="desEN">Description EN</label>
        <input {...register("desEN", {required: 'desEN is required'})} id="desEN" type="text" name="desEN"/><br/>
        {errors.desEN && <p style={{textAlign:'center', color:'red'}}>{errors.desEN.message}</p>}
        <label htmlFor="desVI">Description VI</label>
        <input {...register("desVI", {required: 'desVI is required'})} id="desVI" type="text" name="desVI"/><br/>
        {errors.desVI && <p style={{textAlign:'center', color:'red'}}>{errors.desVI.message}</p>}
        <label htmlFor="priceEN">Price EN</label>
        <input {...register("priceEN", {required: 'priceEN is required'})} id="priceEN" type="text" name="priceEN" />
        {errors.priceEN && <p style={{textAlign:'center', color:'red'}}>{errors.priceEN.message}</p>}
        <label htmlFor="priceVI">Price VI</label>
        <input {...register("priceVI", {required: 'priceVI is required'})} id="priceVI" type="text" name="priceVI"/>
        {errors.priceVI && <p style={{textAlign:'center', color:'red'}}>{errors.priceVI.message}</p>}
        <label htmlFor="image">Image</label>
        <input type='file' id='image' onChange={handleChoseFile}/>
        {image && <img src={image} style={{width: '100px', height: '100px', marginLeft: '180px'}}/>} <br/>
        <button type="submit">{isSubmitting ?  'Loading...' : 'Create'}</button>
        <button onClick={handleClose}>Close</button>
        {message && <p style={{textAlign:'center', color:'red'}}>{message}</p>}
    </form>
    </>
  );
};

export default CreateProduct;
