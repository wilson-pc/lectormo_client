<template>
  <q-btn flat @click="open()" round dense icon="menu" class="q-mr-sm" />
</template>

<script>
export default {
  name: "SideMenu",
  data() {
    return {};
  },
  methods: {
    open() {
      this.$root.$emit("drawer");
    }
  }
};
</script>
