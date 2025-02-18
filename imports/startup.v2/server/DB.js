import { Mongo, MongoInternals } from "meteor/mongo";

const createCollection = (name, option = { idGeneration: "MONGO" }) => {
    return new Mongo.Collection(name, option);
};
export const rawMongoID = MongoInternals.NpmModules.mongodb.module.ObjectId;
export const MongoID = Mongo.ObjectID;

export const INDEXES = {
    // Consumers: [{ key: { createdAt: -1 } }, { key: { index1: -1 } }, { key: { index2: -1 } }, { key: { index3: -1 } }, { key: { index4: -1 } }, { key: { tokens: 1 } }, { key: { tokens: "text" } }],
    Authors: [{ key: { createdAt: -1 } }],
    Genres: [{ key: { createdAt: -1 } }],
    Publishers: [{ key: { createdAt: -1 } }],
    Books: [],
    // Products: [],
};

export default {
    Authors: (() => createCollection("authors"))(),
    Genres: (() => createCollection("genres"))(),
    Publishers: (() => createCollection("publishers"))(),
    Books: (() => createCollection("books"))(),
    // Products: (() => createCollection("products"))(),
};
