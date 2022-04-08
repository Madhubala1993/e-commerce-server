import { client } from "./index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function getAllUsers(request) {
  return await client
    .db("password")
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
  return await client.db("password").collection("users").insertOne({
    username: username,
    mailid: mailid,
    password: hashedPassword,
    confirmPwd: hashedConfirmPwd,
  });
}

export async function getUserByName(username) {
  return await client
    .db("password")
    .collection("users")
    .findOne({ username: username });
}

export async function getUserById(username) {
  return await client
    .db("password")
    .collection("users")
    .findOne({ _id: ObjectId(username) });
}

export async function UpdateQtyById(id, updateQty) {
  return await client
    .db("password")
    .collection("users")
    .updateOne({ _id: ObjectId(id) }, { $set: { cartQty: updateQty } });
}
