//app/controllers/topicControllers.js

import moment from 'moment';

import dbQuery from '../db/dev/dbQuery.js';

import {
  empty,
  rankTopic
} from '../helpers/validations.js';

// import {
//     verifyRange,
// } from '../middlewares/verifyRange.js'


import {
  errorMessage, successMessage, status,
} from '../helpers/status.js';

//adding topics
const addTopic = async (req, res) => {
  const {
    topic_name,difficulty, time_taken,
  } = req.body;

  if (empty(difficulty) || empty(time_taken) || empty(topic_name) ) {
    errorMessage.error = 'All fields are required';
    return res.status(status.bad).send(errorMessage);
  }

  const createTopicQuery = `INSERT INTO topic(topic_name,difficulty, time_taken) VALUES($1, $2, $3) returning *`;
  
  const values = [
    topic_name,
    difficulty,
    time_taken,
  ];
    
  try {
    const result1 = await dbQuery.query(createTopicQuery, values);

    const dbResponse1 = result1.rows[0];

    const topic_id = dbResponse1.topic_id;
    
    const ranked = rankTopic(difficulty,time_taken);

    const createRankQuery = `INSERT INTO rank(topic_id,ranked) VALUES($1,$2) returning *`;

    const val = [
      topic_id,
      ranked
    ]

    const result2 = await dbQuery.query(createRankQuery, val);

    const dbResponse2 = result2.rows[0];

    successMessage.data = dbResponse1;

    console.log(successMessage);

    return res.status(status.created).send(successMessage);
    
  } catch (error) {
    errorMessage.error = 'Unable to add topic';
    return res.status(status.error).send(errorMessage);
  }
};

//get all topics
const getAllTopics = async (req, res) => {
  const getAllTopicQuery = 'SELECT * FROM topic ORDER BY difficulty DESC';
  try {
    const { rows } = await dbQuery.query(getAllTopicQuery);

    const dbResponse = rows;

    if (dbResponse[0] === undefined) {
      errorMessage.error = 'There are no topics';
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'An error Occured';
    return res.status(status.error).send(errorMessage);
  }
};


export {
  addTopic,
  getAllTopics,
};