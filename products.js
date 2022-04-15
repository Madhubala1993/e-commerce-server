import express from "express";
import {
  getProductsById,
  deleteProducts,
  getAllProducts,
  addProducts,
  updateProductsById,
} from "./helper.js";
import { client } from "./index.js";
const router = express.Router();

// router.get("/", async (request, response) => {
//   console.log(request.query);
//   const product = await getAllProducts(request);
//   response.send(product);
// });

// router.get("/:id", async (request, response) => {
//   const { id } = request.params;
//   console.log(id);
//   const product = await getProductsById(id);

//   product
//     ? response.send(product)
//     : response.status(404).send({ message: "No products found" });
//   console.log(product);
// });

// router.delete("/:id", async (request, response) => {
//   const { id } = request.params;
//   console.log(id);
//   const product = await deleteProducts(id);
//   response.send(product);
//   console.log(product);
// });

// router.put("/:id", async (request, response) => {
//   const { id } = request.params;
//   console.log(id);
//   const updateProduct = request.body;
//   console.log(updateProduct);
//   const product = await updateProductsById(id, updateProduct);
//   response.send(product);
// });

// router.post("/add", async (request, response) => {
//   const newProducts = request.body;
//   console.log(newProducts);
//   const product = await addProducts(newProducts);
//   response.send(product);
// });

router.get("/equipments", async function (req, res) {
  const products = await getProductsList();
  res.send(products);
});

router.get("/cart", async function (req, res) {
  const { user } = req.query;

  const cartItems = await getCartList(user);
  res.send(cartItems);
});

router.post("/equipments", async function (req, res) {
  const data = req.body;
  console.log(data);
  const result = await addProductsList(data);
  res.send(result);
});

router.post("/checkout/:user", async function (req, res) {
  const { user } = req.params;
  const data = req.body;
  console.log(user);
  const result = await client.db("rental").collection(user).deleteMany({});

  const allCart = await getCartList(user);
  res.send(allCart);
});

router.put("/cart", async function (req, res) {
  const product = req.body;
  const { type } = req.query;

  console.log("product", product);
  const user = product.username;
  console.log("user", user);
  const cartItem = await getCartItemById(product, user);
  console.log(cartItem);
  if (cartItem) {
    if (type === "decrement" && cartItem.qty <= 1) {
      await deleteCartItemById(product, user);
    } else {
      await updateQtyById(product, user, type);
    }
  } else {
    console.log("inserting");
    await insertCartItem(product, user);
  }
  const allCart = await getCartList(user);
  res.send(allCart);
});

async function getProductsList() {
  return await client.db("rental").collection("equipments").find({}).toArray();
}

async function getCartList(user) {
  return await client.db("rental").collection(user).find({}).toArray();
}

async function addProductsList(data) {
  return await client.db("rental").collection("equipments").insertMany(data);
}

async function getCartItemById(product, user) {
  return await client
    .db("rental")
    .collection(user)
    .findOne({ _id: product._id });
}

async function deleteCartItemById(product, user) {
  return await client
    .db("rental")
    .collection(user)
    .deleteOne({ _id: product._id });
}

async function updateQtyById(product, user, type) {
  return await client
    .db("rental")
    .collection(user)
    .updateOne(
      { _id: product._id },
      { $inc: { qty: type === "increment" ? +1 : -1 } }
    );
}

async function insertCartItem(product, user) {
  return await client
    .db("rental")
    .collection(user)
    .insertOne({ ...product, qty: 1 });
}

export const productsRouter = router;
