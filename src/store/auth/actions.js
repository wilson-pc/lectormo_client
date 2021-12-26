import { LocalStorage } from "quasar";

export function addAuth(context, auth) {
  LocalStorage.set("token", auth.token);
  LocalStorage.set("user", JSON.stringify(auth.user));
  context.commit("saveAuth", auth);
}
