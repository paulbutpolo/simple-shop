import { Logger } from "meteor/tmq:tools";
import AuthorMethods from "./AuthorMethods";
import Server from "../Server";

const register = (name, methods) => {
    let count = 0;
    for (const key in methods) {
        Server.addFunction(key, methods[key]);
        count++;
    }
    Logger.showStatus(`Registered ${count} methods for ${name}`);
};

// Register all methods
register("AuthorMethods", AuthorMethods);
Server.registerFunctions();