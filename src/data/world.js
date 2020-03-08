const data = require('../utils/data');
const { CHARACTERS_COLLECTION, WORLD_COLLECTION } = require('../constants/collections');

const getNodeNameFromId = _id => {
  return new Promise((resolve, reject) => {
    data.db.collection(WORLD_COLLECTION)
    .find( { _id })
    .toArray((err, result) =>
      err ? reject(err) : resolve(result[0].name)
    );
  });
}

const getNodeByName = async name => {
  const node = await new Promise((resolve, reject) => {
    data.db.collection(WORLD_COLLECTION)
      .find({ name })
      .toArray((err, result) =>
        err ? reject(err) : resolve(result[0])
      );
  });

  const connectedNames = await Promise.all(node.connections.map(x => getNodeNameFromId(x.node)));

  for (let i = 0; i < node.connections.length; i++) {
    node.connections[i].name = connectedNames[i];
  }

  return node;
};

// Should probably commonize...eh, whatev...it's a prototype #yolo
const getNodeById = async _id => {
  const node = await new Promise((resolve, reject) => {
    data.db.collection(WORLD_COLLECTION)
      .find({ _id })
      .toArray((err, result) =>
        err ? reject(err) : resolve(result[0])
      );
  });

  const connectedNames = await Promise.all(node.connections.map(x => getNodeNameFromId(x.node)));

  for (let i = 0; i < node.connections.length; i++) {
    node.connections[i].name = connectedNames[i];
  }

  return node;
};

const getCharactersAtNode = nodeId => {
  return new Promise((resolve, reject) => {
    data.db.collection(CHARACTERS_COLLECTION)
      .find({ location: nodeId })
      .toArray((err, result) =>
        err ? reject(err) : resolve(result)
      );
  });
}

module.exports = {
  getNodeByName,
  getNodeById,
  getCharactersAtNode,
};
