const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//@desc     Register user
//@route    POST /api/v1/users/register
//@access   Public
const registerUser = asyncHandler(async(req, res) => {
    
  const { firstName, lastName, email, password } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    res.status(400)
    throw new Error('Please enter all fields')
  }

  // Check for existing user
  const userExists = await User.findOne({ email })
  if (userExists) { 
    res.status(400)
    throw new Error('User already exists')
  }
  // Create salt & hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  }else{
    res.status(400).json({ msg: 'Invalid user data' });

  }
  
})


//@desc     Login user
//@route    POST /api/v1/users/login
//@access   Public
  const loginUser = asyncHandler(async(req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //Check user and password
    if(user && (await bcrypt.compare(password, user.password))){
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      })
    }else{
      res.status(401)
      throw new Error('Invalid credentials')
    }
    
  })

  //@desc     Get user dashboard
  //@route    GET /api/users/dashboard
  //@access   Private
  const getDashboard = asyncHandler(async(req, res) => {
    res.status(200).json({
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    
    })
  })

  // Generate token
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '20d'
    })
  }

  module.exports = {
    registerUser,
    loginUser,
    getDashboard,
  }
