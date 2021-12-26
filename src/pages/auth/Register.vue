<template>
  <q-page padding class="window-height window-width row justify-center ">
    <div class="q-gutter-md">
      <q-form ref="myForm">
        <h4>Crea una cuenta</h4>
        <span>accede a tus favoritos desde cualquier dispositivo</span>
        <q-input
          v-model="auth.email"
          label="Email"
          type="email"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Escriba algo',
            val => /\S+@\S+\.\S+/.test(val) || 'Escriba un email valido'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
        <q-input
          v-model="auth.password"
          l
          :type="isPwd ? 'password' : 'text'"
          label="Contraseña"
          lazy-rules
          :rules="[val => (val !== null && val !== '') || 'Escriba algo']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-form>
      <q-btn label="Entrar" @click="login()" color="primary" />
      <q-btn label="registrarse" color="primary" @click="register()" />
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "PageIndex",
  data() {
    return {
      isPwd: true,
      auth: {
        email: "",
        password: ""
      }
    };
  },
  async mounted() {
    // const items = await getBest(1);
  },
  methods: {
    ...mapActions("auth", ["addAuth"]),
    ...mapActions("favorites", ["addFavoritos"]),

    async register() {
      try {
        await this.$refs.myForm.validate();
        const { error, data: datos } = await this.$supabase.auth.signUp(
          this.auth
        );

        if (error) {
          if (error.status == 400) {
            this.$q.notify({
              message:
                "El email ya esta registrado,por favor aga click en entrar"
            });
          } else {
            this.$q.notify({
              message: error.message
            });
          }
        } else {
          console.log("entra", datos.user, datos.access_token);
          this.addAuth({ token: datos.access_token, user: datos.user });
          const { data, error } = await this.$supabase
            .from("favorites")
            .select("*")
            .eq("userId", datos.user.id);

          this.addFavoritos(data);
          this.$router.replace({ name: "index" });
        }
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "complete el formulario de forma correcta"
        });
      }
    },
    async login() {
      try {
        await this.$refs.myForm.validate();
        const { error, data: datos } = await this.$supabase.auth.signIn(
          this.auth
        );
        if (error) {
          this.$q.notify({
            message: "Email o contraseña incorrecta"
          });
        } else {
          this.addAuth({ token: datos.access_token, user: datos.user });
          const { data, error } = await this.$supabase
            .from("favorites")
            .select("*")
            .eq("userId", datos.user.id);

          this.addFavoritos(data);
          this.$router.replace({ name: "index" });
        }
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "complete el formulario de forma correcta"
        });
      }
    }
  }
};
</script>
<style></style>
