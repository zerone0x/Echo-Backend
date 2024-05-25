require('dotenv').config();
// apply try catch to async func automatically 
require('express-async-errors')
const express = require('express');
const app = express();

const morgan = require('morgan')
// db 
const connectDB = require('./db/connect')

// middlewares
// Attention: notFoundMiddleware should be placed in the front of errorMiddleware
const notFoundMiddleware = require('./middlewares/not-found')
const errorMiddleware = require('./middlewares/error-handler')

// log the requests
app.use(morgan('tiny'))
// convert json data to object
app.use(express.json());

// routes
app.get('/', (req, res)=>{
    res.send('hi')
})


const Port = process.env.PORT || 3000;
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(Port, console.log(`Server running on port ${Port}`));
    } catch (error) {
        console.error(error);
    }
}

start()