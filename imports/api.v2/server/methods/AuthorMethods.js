import DB from "../../../startup.v2/server/DB";
import { AUTHOR } from "../../common/Author";
import { check } from "meteor/check";

export default {
  [AUTHOR.GET_AUTHORS]: function () {
    return "OK"
  },
};
