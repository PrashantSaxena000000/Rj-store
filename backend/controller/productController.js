const Product = require("../modles/productModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const slugify = require("slugify");

// create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({ newProduct, msg: "Product created sucessfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const productUpdate = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json(productUpdate);
  } catch (error) {
    throw new Error(error);
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete({ _id: id });
    res.json({ deleteProduct, msg: "product deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// get single products
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const productDetail = await Product.findById(id);
    res.json(productDetail);
  } catch (error) {
    throw new Error(error);
  }
});
// get all products
const productList = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];

    excludeField.forEach((ele) => delete queryObj[ele]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = Product.countDocuments();
      if (skip >= productCount) throw new Error("This page not Exist!");
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  productList,
  updateProduct,
  deleteProduct,
};
