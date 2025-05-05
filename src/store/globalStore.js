import { makeAutoObservable } from "mobx";

class GlobalStore {
	accessToken = null;

	constructor() {
		makeAutoObservable(this);
	}

	saveToken(token) {
		this.accessToken = token;
		localStorage.setItem("accessToken", token);
	}

	loadToken() {
		this.accessToken = localStorage.getItem("accessToken");
	}

	signOut() {
		localStorage.removeItem("email");
		localStorage.removeItem("accessToken");
		this.accessToken = null;
	}
}

export const globalStore = new GlobalStore();