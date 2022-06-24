//app/controller/usersController.js

import moment from 'moment';

import dbQuery from '../db/dev/dbQuery.js';

import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'topicrank',
  password: '12345',
  port: 5432,
});


import {
  hashedPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from '../helpers/validations.js';

import {
  errorMessage, successMessage, status,
} from '../helpers/status.js';

//signup user
const createUser = async (req, res) => {

  const {
    email, password
  } = req.body;

  // console.log(email,password);

  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = 'Email and password field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }

  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }

  const hashPassword = password;

  console.log(hashPassword, email);

  const createUserQuery = `INSERT INTO users(email,password) VALUES($1, $2) returning *`;

  const values = [
    email,
    hashPassword
  ];

  try {

    const { rows } = await dbQuery.query(createUserQuery, values);

    const dbResponse = rows[0];

    console.log(rows[0]);

    delete dbResponse.password;

    const token = generateUserToken(dbResponse.email,dbResponse.id);

    successMessage.data = dbResponse;

    successMessage.data.token = token;

    return res.status(status.created).send(successMessage);

  } catch (error) {
    // console.log(newuser);
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User with that EMAIL already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }

  // try{
  //   pool.query('INSERT INTO users(email,password) VALUES($1, $2)',[email,password],(err,res)=>{
  //     console.log(res);
  //     if(err){
  //       console.log(err);
  //       return;
  //     }
  //     console.log("Success");
  //   })
  // }catch(err){
  //   return res.status(status.bad).send(err);
  // }

};


//signin user
const siginUser = async (req, res) => {

  const { email, password } = req.body;

  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = 'Email or Password detail is missing';
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email) || !validatePassword(password)) {
    errorMessage.error = 'Please enter a valid Email or Password';
    return res.status(status.bad).send(errorMessage);
  }

  const signinUserQuery = 'SELECT * FROM users WHERE email = $1';

  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);

    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = 'User with this email does not exist';
      return res.status(status.notfound).send(errorMessage);
    }

    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = 'The password you provided is incorrect';
      return res.status(status.bad).send(errorMessage);
    }

    const token = generateUserToken(dbResponse.email, dbResponse.id);

    delete dbResponse.password;

    successMessage.data = dbResponse;

    successMessage.data.token = token;

    return res.status(status.success).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  createUser,
  siginUser,
};