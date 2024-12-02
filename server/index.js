const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const { userRouter } = require('./routes/user')
const { organizerRouter } = require('./routes/organizer')
const { approvalRouter } = require('./routes/approval')
const { eventRouter } = require('./routes/event')
const cors = require('cors')

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/organizer', organizerRouter)
app.use('/api/approval', approvalRouter)
app.use('/api/event', eventRouter)

const main = async () => {
    await mongoose.connect(MONGO_URI);

    app.listen(PORT, () => {
        console.log(`Server listening to port ${PORT}`)
    });
}

main();