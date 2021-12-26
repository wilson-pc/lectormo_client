<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { LocalStorage } from "quasar";
export default {
  name: "App",
  methods: {
    ...mapActions("auth", ["addAuth"])
  },
  created() {
    let token = localStorage.getItem("token");
    let user = this.$supabase.auth.user();

    if (token) {
      this.addAuth({ token, token, user: user });
    }
  }
};
</script>
