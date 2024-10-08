import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

import {
  getProductDB,
  createProductDB,
  countProductDB,
  updateProductDB,
} from "../models/product.models.js";

const getProduct = async (req, res) => {
  const { product } = req.params;
  const { keyWord, type, pageNumber, pageSize, productId } = req.query;
  try {
    if (keyWord) {
      let regex = new RegExp(keyWord, "i");
      const products = await getProductDB({ name: regex, deleted: false });
      res.status(200).send({
        data: {
          products,
        },
      });
      return;
    }
    const isProduct = product ? product : {};
    if (type) {
      const products = await getProductDB({
        product: isProduct,
        type,
        deleted: false,
      });
      res.status(200).send({
        data: {
          products,
        },
      });
      return;
    }
    if(productId){
      const product = await getProductDB({_id: productId})
      if(!product) throw new Error("Can't find this product")
        res.status(200).send({
          product
        });
      return
    }
    if (pageNumber && pageSize) {
      const totalProducts = await countProductDB();
      const totalPages = Math.ceil(totalProducts / pageSize);
      const skip = (pageNumber - 1) * pageSize;
      const products = await getProductDB({ deleted: false })
        .skip(skip)
        .limit(pageSize);
      if (!products) throw new Error("Can't find this products name");
      res.status(200).send({
        totalPages,
        pageNumber,
        data: products,
      });
      return;
    }
    const products = await getProductDB({ product, deleted: false });
    res.status(200).send({
      data: products,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const getAllProduct = async (req, res) => {
  const { pageNumber, pageSize, keyWord } = req.query;
  try {
    if (keyWord) {
      let regex = new RegExp(keyWord, "i");
      const products = await getProductDB({ name: regex, deleted: false });
      res.status(200).send({
        data: {
          products,
          totalPages: 0,
        },
      });
      return;
    }
    if (pageNumber && pageSize) {
      const totalProducts = await countProductDB();
      const totalPages = Math.ceil(totalProducts / pageSize);
      const skip = (pageNumber - 1) * pageSize;
      const products = await getProductDB({ deleted: false })
        .skip(skip)
        .limit(pageSize);
      if (!products) throw new Error("Can't find this products name");
      res.status(200).send({
        totalPages,
        pageNumber,
        data: products,
      });
      return;
    }
    const products = await getProductDB({ deleted: false });
    res.status(200).send({
      data: products,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const createProduct = async (req, res) => {
  const { product, name, type, desEN, desVI, priceEN, priceVI, image } =
    req.body;
  const file = req.file;
  try {
    if (!product || !name || !type || !desEN || !desVI || !priceEN || !priceVI)
      throw new Error("Enter all product's information");
    if (!file) throw new Error("Please upload product's image!");
    let urlImage;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    await cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: fileName,
        resource_type: "auto",
      },
      (err, result) => {
        if (err) throw new Error("upload file failed");
        if (result) {
          urlImage = result.secure_url;
          return urlImage;
        }
      }
    );
    const newProduct = await createProductDB({
      product,
      name,
      type,
      desEN,
      desVI,
      priceEN,
      priceVI,
      image: urlImage,
    });
    res.status(201).send({
      message: "Create product success",
      data: newProduct,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const handleUpdateProduct = async (req, res) => {
  const { productId } = req.params;
  const body = req.body;
  const file = req.file;
  try {
    if (file) {
      let urlImage;
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const fileName = file.originalname.split(".")[0];
      await cloudinary.uploader.upload(
        dataUrl,
        {
          public_id: fileName,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) throw new Error("upload file failed");
          if (result) {
            urlImage = result.secure_url;
            return urlImage;
          }
        }
      );
      const product = await updateProductDB({
        _id: productId
      },{
        ...body,
        image: urlImage
      })
      if(!product) throw new Error("can't update product")
    }
    const product = await updateProductDB({
      _id: productId
    },{
      ...body
    })
    if(!product) throw new Error("can't update product")
    res.status(201).send({
      message: "Updated product success",
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const handleDeleteProduct = async (req, res) => {
  const { productId } = req.query;
  try {
    const product = await updateProductDB(
      {
        _id: productId,
      },
      {
        deleted: true,
      }
    );
    if (!product) throw new Error("Can't delete this product");
    res.status(201).send({
      message: "Deleted product success!",
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
export {
  getProduct,
  createProduct,
  getAllProduct,
  handleUpdateProduct,
  handleDeleteProduct,
};
