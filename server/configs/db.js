import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));

        await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`)
    }
    catch (erorr) {
        console.log(erorr.message);

    }
}
export default connectDB