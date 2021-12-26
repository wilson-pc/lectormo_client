<template>
  <div>
    <q-item v-if="items.length == 0" clickable tag="a" :to="{ name: name }">
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>
          {{ caption }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-expansion-item
      v-else
      :label="title"
      :caption="caption"
      default-opened
      icon="mail"
    >
      <q-item
        v-for="item in items"
        expand-separator
        clickable
        v-bind:key="item.title"
        tag="a"
        @click="to(item)"
      >
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>
            {{ item.caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ""
    },

    name: {
      type: String,
      default: "#"
    },

    icon: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    async to(item) {
      console.log(item);

      await this.$router.replace({
        name: item.name,
        params: { name: item.title }
      });
    }
  }
};
</script>
