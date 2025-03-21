import User from "../models/user.model.js"
import { getUser } from "../controllers/user.controllers.js";
import { expect } from "chai";
import mongoose from "mongoose";

describe("2) get-user", () => {
  it("should be connect the get user by id.", async() => { 
    mongoose.connect('mongodb+srv://harshal:admin004@cluster0.p9va5.mongodb.net/test-database?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
     return User.create({name: "max", email: "max1234@gmail.com", password: "max@123"})
    })
    .then((user) => {
      const req = {
        userId : user._id.toString()
      } 
      return getUser(req, {}, () => {})
    })
    .then(res => {
      expect(res.json).to.have.property('user')
    })
    .catch(err => {throw err})
  }) 
})