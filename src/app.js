const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PROJ_API_PORT || 1337;
const app = express();

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use(indexRouter);
app.use(userRouter);


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.title,
                "detail": err.message
            }
        ]
    })
})


app.listen(PORT, () => {
    console.log(`API is listening to port ${PORT}`);
})


module.exports = app;
