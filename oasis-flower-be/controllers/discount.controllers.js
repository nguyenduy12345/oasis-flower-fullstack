import { createDiscountDB, getAllDiscountDB, getDiscountDB, editDiscountDB, deleteDiscountDB } from "../models/discount.models.js";

const createDiscount = async(req,res) => {
    const { code, discount, active, startDate, endDate } = req.body
    try {
        if(!code || !discount) throw new Error('Discount code is required!')
        const discountCode = await createDiscountDB({
            code,
            discount,
            active,
            startDate,
            endDate
        })
        res.status(201).send({
            message: 'Create discount code success',
            code: discountCode
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
          });
    }
}
const getAllDiscount = async (req, res) => {
    try {
        const code = await getAllDiscountDB()
        res.status(200).send({
            code
        })
    } catch (error) {
        res.status(404).send({
            message: error.message,
          });
    }
}
const getDiscount = async (req, res) => {
    const { code } = req.query
    try {
        const discountCode = await getDiscountDB({code, active: true})
        if(!discountCode) throw new Error("Discount code is not exist")
        res.status(200).send({
            message: "Discount code was apply",
            code: discountCode
        })
    } catch (error) {
        res.status(404).send({
            message: error.message,
          });
    }
}

const handleStopActiveDiscountCode = async (req, res) => {
    const { code } = req.params
    try {
        if(!code) throw new Error('Discount code is not exist')
        await editDiscountDB({
            code
        },{
            active: false
        })
        res.status(201).send({
            message: 'Stop active discount code success'
        })
    } catch (error) {
        res.status(403).send({
            message: error.message,
          });
    }
}
const handleActiveDiscountCode = async (req, res) => {
    const {code} = req.params
    try {
        if(!code) throw new Error('Discount code is not exist')
        await editDiscountDB({
            code
        },{
            active: true
        })
        res.status(201).send({
            message: 'Active discount code success'
        })
    } catch (error) {
        res.status(403).send({
            message: error.message,
          });
    }
}
const handleDeleteDiscountCode = async (req, res) => {
    const {code} = req.params
    try {
        if(!code) throw new Error('Discount code is not exist')
        await deleteDiscountDB({
            code
        })
        res.status(200).send({
            message: 'Deleted discount code success'
        })
    } catch (error) {
        res.status(403).send({
            message: error.message,
          });
    }
}

export{
    createDiscount,
    getAllDiscount,
    getDiscount,
    handleActiveDiscountCode,
    handleStopActiveDiscountCode,
    handleDeleteDiscountCode
}