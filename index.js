const express = require("express");
const { userRouter } = require("./Routes/user.routes");
const { connection } = require("./connection/connection");
const cors = require("cors");
const { noteRoter } = require("./Routes/note.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users",userRouter);
app.use("/notes",noteRoter)


app.listen(8080,async()=>{
    
    await connection
    console.log("server is conneted to db");
    console.log("server is running at port 8080");
})