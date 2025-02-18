import RedisVentService from "./modules/RedisVentService"
import meteorwatcher from "meteor/tmq:watcher"
import tmqAccounts from "meteor/tmq:accounts"
import { Meteor } from "meteor/meteor"
import { VENT } from "../common/Vent"
import { AUTHOR } from "../common/Author"

// Basic Setup
class Client extends meteorwatcher{
    #store = null

    constructor(parent) {
      super(parent);
      this.secureTransaction()

      this.#store = this.create(() => ({
        userId: null,
        isUserAdmin: null,
      }))
      tmqAccounts.onLogin(() => {
        this.#store.setState({ userId: Meteor.userId() });
        this.userRole();
      });
      
      tmqAccounts.onLogout(() => {
        this.#store.setState({ userId: null });
        this.#store.setState({ isUserAdmin: null });
      })
    }

    // Getters for zustand reactivity
    get UserId() {
      return this.#store((state) => state.userId);
    }
    get UserRole() {
      return this.#store((state) => state.isUserAdmin);
    }

    // Helpers :/
    async userRole() {
      try {
        const isUserAdmin = await tmqAccounts.checkUserRole(Meteor.userId(), "admin");
        this.#store.setState({ isUserAdmin: isUserAdmin }); 
      } catch (error) {
        console.error("Error updating user admin status:", error);
      }
    }

    async fetchData() {
      console.log()
      try {
        const test = await this.callFunc(AUTHOR.GET_AUTHORS)
        console.log(test)
      } catch (error) { 
        console.log(error)
      }
    }
}

export default new Client();