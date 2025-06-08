<template>
  <v-card
    class="py-4"
    color="surface-variant"
    image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
    prepend-icon="mdi-rocket-launch-outline"
    rounded="lg"
    variant="tonal"
  >
    <ul v-if="posts && posts.length">
      <li v-for="post of posts" :key="post.id">
        <p><strong>{{ post.name }}</strong></p>
        <p>{{ post.surname }}</p>
        <img
          v-if="post.name === 'Lewis'"
          alt="{{ post.name }}"
          height="20"
          src="https://c.f1news.ru/userfiles/ham-photo.jpg"
          width="20"
        >
      </li>
    </ul>
    <ul v-if="errors && errors.length">
      <li v-for="error of errors" :key="error.id">
        {{ error.message }}
      </li>
    </ul>

  </v-card>

  <!-- <v-pagination v-model="page" :length="4" next-icon="mdi-menu-right" prev-icon="mdi-menu-left" /> -->

</template>

<script>
  import axios from 'axios';
  // import { ref } from 'vue';

  export default {
    data () {
      return {
        posts: [],
        errors: [],
      }
    },

    // Fetches posts when the component is created.
    created () {
      axios.get(`https://f1api.dev/api/2019/drivers?limit=2`)
        .then(response => {
          // JSON responses are automatically parsed.
          this.posts = response.data.drivers
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
  }

  // const page = ref(1)
</script>
