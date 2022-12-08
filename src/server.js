'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');

// Esoteric Resources
const errorHandler = require('../error-handlers/500');
const notFound = require('../error-handlers/404');
const {authRouter} = require('./routes/v2.js');
const logger = require('./middleware/logger');
const {router} = require('./routes/v2.js');
// Prepare the express app

const PORT = process.env.PORT;
const app = express();

// App Level MW
app.use(cors());

app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRouter);
app.use('/api/v2', router); // http://localhost:3000/api/v1/clothes

// Catchalls
app.use('*',notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: () => {
    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });
  },
};
