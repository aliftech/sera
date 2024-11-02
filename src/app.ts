import "reflect-metadata";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connection from "./connection";
import cors from "cors";
import contactRouter from "./routers/contactRouter";
import messageRouter from "./routers/messageRouter";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(contactRouter);
app.use(messageRouter);

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const start = async (): Promise<void> => {
  try {
    await connection.sync();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
