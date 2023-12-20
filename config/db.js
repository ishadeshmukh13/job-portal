import mongoose from "mongoose";

const URL = `mongodb://localhost:27017/jobportal`
const connectDB = async() => {
    try {
        // mongoose.set({strictQuery : false});
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
         })
    } catch (error) {
        console.log('Failed to connect to MongoDB', error)
    }
}

connectDB();