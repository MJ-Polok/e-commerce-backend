require('dotenv/config');
const mongoose = require('mongoose')
const app = require('./app')

const onlineServer = "mongodb+srv://e-comm-mjMongo:<password>@e-commerce-cluster.kw0afbx.mongodb.net/?retryWrites=true&w=majority"

const DB = onlineServer.replace("<password>", process.env.DB_PASSWORD)

mongoose.connect(DB)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((e) => console.error("MongoDB Connection Failed!"))

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log(`App running on port ${port}`);
})