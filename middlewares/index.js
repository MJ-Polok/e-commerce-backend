const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use(cors());

    if (process.env.NODE === 'development') {
        app.use(morgan('dev'));
    };

}