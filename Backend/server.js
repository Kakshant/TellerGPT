import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT=8080;

app.use(express.json());
app.use(cors());

app.use('/api', chatRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to Database");
    }catch(err){
        console.error("Error connecting to Database:", err);
    }
}

// -------------------------Problem while rendering, so copied this from GPT-----------------------------------
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'; // in case not already imported

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

