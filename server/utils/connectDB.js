import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
        try {
            await mongoose.connect(process.env.MONGODB_URL);
            console.log("✅ DB Connected");
        } catch (error) {
            console.error("❌ DB attempt failed");
        }    
};
export default connectDB;
