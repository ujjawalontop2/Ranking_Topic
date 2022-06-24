import express from 'express';
import 'babel-polyfill';
import cors from 'cors';


import userRoutes from './app/routes/userRoutes.js';
import topicRoutes from './app/routes/topicRoutes.js';
import rankRoutes from './app/routes/rankRoutes.js';


const PORT = process.env.PORT;
const app = express();


app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use('/user', userRoutes);
app.use('/topic', topicRoutes);
app.use('/rank', rankRoutes);

app.listen(PORT,()=>console.log(`Server is listening on ${PORT}`));

export default app;