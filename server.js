const express = require('express');
const uuid = require('./helper/uuid');

const PORT = 3001;

const app = express.Router();

app.use(express.json());

app.use(express.static('public'));