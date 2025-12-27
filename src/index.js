import app from "./app.js";
import {connectDB} from "./config/database.js"
import logger from "./logger/winston.logger.js"; 
import cloudinary from "cloudinary";

connectDB();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})



//test for manual genaerte signature

// import crypto from "crypto";

// const body = "order_QN0h91cQnjIA96|pay_123456";
// const secret = process.env.RAZORPAY_API_SECRET;


// const signature = crypto
//   .createHmac("sha256", secret)
//   .update(body)
//   .digest("hex");

// console.log("Generated Signature:", signature);


const Port = process.env.PORT;

app.listen(Port, () => {
    // console.log(`Server is running on port ${Port}`)
    logger.info("⚙️  Server is running on port: " + process.env.PORT);
})



