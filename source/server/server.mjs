import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;
import {router} from './Routers/Router.mjs';
import bodyParser from "body-parser";
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

app.use(bodyParser.json());
app.use(express.static('source/public'));
app.use('/api/notes', router);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB);
        console.log(`MongoDB Connected!`);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}


connectDB().then(() => {
    app.listen(port, () =>{
        console.log(`Example app listening at http://localhost:${port}`);
    })
});

