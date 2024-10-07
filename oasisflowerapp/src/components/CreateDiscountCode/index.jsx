import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import instance, {createAxiosResponseInterceptor} from "/src/utils/request.js"

import styles from './styles.module.scss'

const CreateDiscountCode = ({setIsCreateDiscount, setEdit}) => {
    const [message, setMessage] = useState()
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm()
    const onSubmit = async(data)=>{
        await instance.post('discount-code', data)
        .then((res) => {
            setMessage(res.data.message)
            setEdit(data)
            setTimeout(() => {
                setMessage('')
                setIsCreateDiscount(false)
            }, 700);
          })
        .catch(err => setMessage(err.response.data.message))
    }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
        <h5>CREATE DISCOUNT CODE</h5>
        <label htmlFor="code">Code</label>
        <input {...register("code", {required: 'This field is required'})} id="code" type="text" name="code" placeholder="blackfriday"/>
        {errors.code && <p style={{textAlign:'center', color:'red'}}>{errors.code.message}</p>}
        <label htmlFor="discount">Discount</label>
        <input {...register("discount", {required: 'This field is required'})} id="discount" type="text" name="discount" placeholder="10" />
        {errors.discount && <p style={{textAlign:'center', color:'red'}}>{errors.discount.message}</p>}
        <label htmlFor="startDate">Start Date</label>
        <input {...register("startDate")} id="startDate" type="text" name="startDate" placeholder="mm/dd/yy"/>
        <label htmlFor="endDate">End Date</label>
        <input {...register("endDate")} id="endDate" type="text" name="endDate" placeholder="mm/dd/yy"/>
        {errors.desEN && <p style={{textAlign:'center', color:'red'}}>{errors.desEN.message}</p>}
        <button type="submit">{isSubmitting ?  'Loading...' : 'Create'}</button>
        <button onClick={() => setIsCreateDiscount(false)}>Close</button>
        {message && <p style={{textAlign:'center', color:'red'}}>{message}</p>}
    </form>
    </>
  );
};

export default CreateDiscountCode;
