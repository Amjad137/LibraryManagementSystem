const express = require("express");
const {users} = require("./data/users.json");

const userRouter = require("./routes/user.js");
const bookRouter = require("./routes/books");

const app = express();
app.use(express.json());

const port=8081;


app.get("/", (req,res) => {
    res.status(200).send({
        Message: "hello"
    });
});

app.use("/users", userRouter);
app.use("/books",bookRouter);

//to manage invalid routes (this should be kept on very low area)
app.get("*", (req,res) => {
    res.status(404).send({
        Message : "This route Doesn't Exist"
    });
});

app.listen(port, () => {
    console.log(`The Server is Running on ${port}`);
});

//http/localhost:8081