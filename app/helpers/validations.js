import jwt from 'jsonwebtoken';
import dbQuery from '../db/dev/dbQuery.js';
import bcrypt from 'bcryptjs'
//validate email
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

//validate password
const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  } return true;
};


const isEmpty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  } return true;
};


const empty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
};

const generateUserToken = (email,id) => {
    const token = jwt.sign({
        email,
        user_id:id
    },
    process.env.SECRET, {expiresIn:'3d'});
    return token;
};

const hashedPassword = async (password) => {
  const hashPassword = await bcrypt.hash(password,10);
  return hashPassword;
}

const comparePassword  = (dbpass,loginpass) => {
  return dbpass == loginpass;
}

const rankTopic = (difficulty,time_taken) => {
  let num1 = (difficulty == "easy") ? 1 : (difficulty == "medium") ? 3 : 5;
  let num2 = time_taken;
  if(num2 > 20)
    num2 = 20;
  
  return num1*num2;
}

export {
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  generateUserToken,
  hashedPassword,
  comparePassword,
  rankTopic
};