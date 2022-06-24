//app/controllers/topicControllers.js

import moment from 'moment';

import dbQuery from '../db/dev/dbQuery.js';

import {
  empty,rankTopic
} from '../helpers/validations.js';

// import {
//     checkRange,
// } from '../middlewares/verifyRange.js'


import {
  errorMessage, successMessage, status,
} from '../helpers/status.js';

import pool from '../db/dev/pool.js';

//adding topics
const updateRank = async (req, res) => {
  const {
    topic_id,difficulty,time_taken
  } = req.body;

  if (empty(topic_id) || empty(difficulty) || empty(time_taken)) {
    errorMessage.error = 'All fields are required';
    return res.status(status.bad).send(errorMessage);
  }

  const findTopic = await pool.query('SELECT * FROM topic WHERE topic_id=$1',[topic_id]);

  if(findTopic.rowCount == 0){
    errorMessage.error = `No topic_id with id ${topic_id} in topic table`;
    return res.status(status.bad).send(errorMessage);
  }

  const updateTopic = await pool.query('UPDATE topic SET difficulty = $1,time_taken = $2 WHERE topic_id = $3',[difficulty,time_taken,topic_id])

  if(updateTopic.rowCount == 0){
    errorMessage.error = `Cannot Update Topic Table`;
    return res.status(status.bad).send(errorMessage);
  }

  const findRank = await pool.query('SELECT * FROM rank WHERE topic_id = $1',[topic_id]);

  if(findRank.rowCount == 0){
    errorMessage.error = `No topic_id with id ${topic_id} in rank table`;
    return res.status(status.bad).send(errorMessage);
  }

  const ranked = rankTopic(difficulty,time_taken);

  const updateRankQuery = `UPDATE rank SET ranked = $1 WHERE topic_id = $2`;

  const values =[
    ranked,
    topic_id
  ]

  try {
    const { rows } = await dbQuery.query(updateRankQuery, values);

    const dbResponse = rows[0];
    successMessage.data = dbResponse;

    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to update rank';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  updateRank,
};