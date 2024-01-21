import mongoose from "mongoose";

export const connection=async ()=>{

    try {
        await mongoose.connect(process.env.DB_URL as string).then(() => {
           console.log('MongoDB connected');
        })
        
    } catch (error) {
        console.error('Error ============ ON DB Connection')
        console.log(error);
    }
}