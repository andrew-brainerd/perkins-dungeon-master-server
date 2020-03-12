/* eslint node/exports-style: off */

const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const log = require('./log');

const dbUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

var db;

const connectToMongoDB = async () => {
  mongo.connect(dbUri, mongoOptions, (err, client) => {
    if (err) {
      log.error(err);
      connect(false);
      return;
    }

    db = client.db(dbName);

    log.cool(`Connected to DB: ${dbName}`);
    connect(true);
  });
}

const connect = async (connected) => !connected && connectToMongoDB();

const calculateTotalPages = (items, size) => items > size ? Math.ceil(items / size) : 1;

connect();

const insertOne = async (collection, document) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .insertOne(document, (err, { ops }) => {
        err ? reject(err) : resolve(ops[0]);
      });
  });
};

const getById = async (collection, id) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find({ _id: ObjectId(id) })
      .toArray((err, result) =>
        err ? reject(err) : resolve(result[0])
      );
  });
};

const updateOne = async (collection, id, update) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
    .updateOne(
      { _id: ObjectId(id) },
      { $addToSet: update },
      (err, { matchedCount, modifiedCount }) => {
        if (err) reject(err);
        const alreadyExists = matchedCount === 1 && modifiedCount === 0;
        resolve({ alreadyExists, id });
      }
    );
  })
};

module.exports = {
  db,
  calculateTotalPages,
  insertOne,
  getById,
  updateOne
};
