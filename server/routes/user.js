const { Router } = require('express');
const userRouter = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_HIGHER_SECRET = process.env.JWT_HIGHER_SECRET;
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
const { z } = require('zod');