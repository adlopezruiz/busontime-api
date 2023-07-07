const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/userRoutes');
const busLinesRouter = require('./routes/busLineRoutes');
const busStopsRouter = require('./routes/busStopRoutes');

//Framework initialize
const app = express();
const port = process.env.PORT || 3000;

//App use loader
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//Set endpoints

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/lines', busLinesRouter);
app.use('/api/v1/stops', busStopsRouter);

//API listening
app.listen(port, () => console.log(`Listening on port: ${port}`));

module.exports = app;