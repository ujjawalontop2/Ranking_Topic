import pool from './pool.js'

pool.on('connect',()=>{
    console.log('Connected to the db');
});

// Creating Tables
const createTopic = () => {

    const createTopicQuery = `CREATE TABLE IF NOT EXISTS topic
    (topic_id SERIAL PRIMARY KEY,
    difficulty VARCHAR(4) NOT NULL,
    time_taken VARCHAR(20) NOT NULL)`;

    pool.query(createTopicQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });  
};

const createRank = () => {

    const createRankQuery = `CREATE TABLE IF NOT EXISTS rank
    (rank_id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topic(topic_id) ON DELETE CASCADE,
    ranked INTEGER NOT NULL)`;

    pool.query(createRankQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });  
};

const createUser = () =>{
    const createUserQuery = `CREATE TABLE IF NOT EXISTS user
    (email VARCHAR(80) PRIMARY KEY,
    password VARCHAR(30) NOT NULL)`;

    pool.query(createUserQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    }); 
};



//Dropping Tables
const dropTopic = () => {
    const dropTopicQuery = `DROP TABLE IF EXISTS topic`;
    pool.query(dropTopicQuery)
    .then((res) => {
        console.log(res);
        pool.end();
    })
    .catch((err)=>{
        console.log(err);
        pool.end();
    })
};

const dropRank = () => {
    const dropRankQuery = `DROP TABLES IF EXISTS rank`;
    pool.query(dropRankQuery)
    .then((res)=>{
        console.log(res);
        pool.end();
    })
    .catch((err)=>{
        console.log(err);
        pool.end();
    })
}


const createAllTables = () => {
    createTopic();
    createRank();
    createUser();
}

const dropAllTables = () => {
    dropTopic();
    dropRank();
}

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});
  

export{
    createAllTables,
    dropAllTables
};

import "make-runnable"