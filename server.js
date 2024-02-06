require('dotenv/config');
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.MONGODB_URL_LOCAL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((e) => console.error("MongoDB Connection Failed!"))

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log(`App running on port ${port}`);
})