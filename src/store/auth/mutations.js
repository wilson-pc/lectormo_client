export function saveAuth(state, { token, user }) {
  state.token = token;
  state.user = user;
}
