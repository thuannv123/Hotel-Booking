import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('conected', () => console.log("Database Conected")
        );
        await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`)
    }
    catch (erorr) {
        console.log(erorr.message);

    }
}
export default connectDB