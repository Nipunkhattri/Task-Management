import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import AuthRoute from './routes/AuthRoute.js'
import TaskRoute from './routes/TaskRoute.js'

const app = express();

app.use(express.json({limit:'30mb',extended:true}))
app.use(express.urlencoded({ limit: "30mb", extended: true }));

dotenv.config();

app.use(cors());

app.use('/auth',AuthRoute);
app.use('/api',TaskRoute);

app.get('/',(req,res)=>{
    res.json({
        message:"Contact Management System"
    })
})

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>console.log('Connected to the Database!'))
})
.catch((error) => console.log(`${error} did not connected`))