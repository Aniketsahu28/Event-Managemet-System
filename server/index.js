const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const { userRouter } = require('./routes/user')

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/user', userRouter)
// app.use('/api/event', eventRouter)
// app.use('/api/organizer', organizerRouter)
// app.use('/api/ticket', ticketRouter)
// app.use('/api/approval', approvalRouter)

const main = async () => {
    await mongoose.connect(MONGO_URI);

    app.listen(PORT, () => {
        console.log(`Server listening to port ${PORT}`)
    });
}

main();