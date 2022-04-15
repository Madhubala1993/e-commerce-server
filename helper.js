import { client } from "./index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function getAllUsers(request) {
  return await client
    .db("rental")
    .collection("users")
    .find(request.query)
    .toArray();
}

export async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
export async function genConfirmPwd(confirmPwd) {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedConfirmPwd = await bcrypt.hash(confirmPwd, salt);
  return hashedConfirmPwd;
}

export async function createUser(
  username,
  mailid,
  hashedPassword,
  hashedConfirmPwd
) {
  return await client.db("rental").collection("users").insertOne({
    username: username,
    mailid: mailid,
    password: hashedPassword,
    confirmPwd: hashedConfirmPwd,
  });
}

export async function getUserByName(username) {
  console.log("helper", username);
  return await client
    .db("rental")
    .collection("users")
    .findOne({ username: username });
}

export async function getUserById(username) {
  return await client
    .db("rental")
    .collection("users")
    .findOne({ _id: ObjectId(username) });
}

export async function UpdateQtyById(id, updateQty) {
  return await client
    .db("rental")
    .collection("users")
    .updateOne({ _id: ObjectId(id) }, { $set: { cartQty: updateQty } });
}

export async function getProductsById(id) {
  return await client
    .db("rental")
    .collection("equipments")
    .findOne({ _id: ObjectId(id) });
}
export async function deleteProducts(id) {
  // console.log(id);
  return await client
    .db("rental")
    .collection("equipments")
    .deleteOne({ _id: ObjectId(id) });
}
export async function getAllProducts(request) {
  return await client
    .db("rental")
    .collection("equipments")
    .find(request.query)
    .toArray();
}
export async function addProducts(newProducts) {
  return await client
    .db("rental")
    .collection("equipments")
    .insertMany(newProducts);
}

export async function updateProductsById(id, updateProduct) {
  return await client
    .db("rental")
    .collection("equipments")
    .updateOne({ _id: ObjectId(id) }, { $set: updateProduct });
}
export async function getUserToken() {
  return await client.db("rental").collection("token").find({}).toArray();
}
