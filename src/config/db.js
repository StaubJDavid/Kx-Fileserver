const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
    try {
        console.log(process.env.MONGOOSE_URI);
        const conn = await mongoose.connect(process.env.MONGOOSE_URI);

        console.log(`Connected to mongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;