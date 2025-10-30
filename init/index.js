const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://yuval:yuval123@cluster0.fjf8vzg.mongodb.net/"

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:"69035545507c9f75a29adc81" //replace with the id of the user you want to assign as owner
  }))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();