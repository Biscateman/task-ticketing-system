import express from "express";
import { Application, Request, Response } from "express";
import userRoutes from './feature/user/user.routes'
import taskRoutes from './feature/task/task.routes'
import auth from './middlewares/auth'
import cookieParser from "cookie-parser";
// import isAdmin from "./middlewares/isAdmin";


const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(cookieParser())

app.use('/users/', userRoutes)
app.use('/tasks/', auth, taskRoutes)

// app.get('/restricted', isAdmin, (req, res) => {
//     res.status(200).json('Welcome to restricted')
// })

app.get("/", (req: Request, res: Response) => {
    res.send(" Express + TypeScript Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})




