import Vue from "vue";
import SideMenu from "components/SideMenu";
Vue.component("side-menu", SideMenu);
Vue.prototype.$to = name => {
  this.$router.replace({ name: name });
};
