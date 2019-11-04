<template>
  <div>
    <h1>demo component: {{msg}} </h1>
    <ul>
      <li v-for="(product, key) in products" :key="key">
        <input type="number" v-model="product.quantity">
        {{product.quantity}} {{product.name}}

        <span v-if="product.quantity === 0">
          - Out of stock
        </span>
        <button @click="product.quantity += 1">Add</button>
        <button @click="product.quantity -= 1">Sub</button>
      </li>
    </ul>
    <h2> total quantity: {{ totalProducts}} </h2>
  </div>
</template>

<script>
export default {
  name: 'Demo',

  data: function () {
    return {
      products: [],
    };
  },

  created () {
    fetch("https://api.myjson.com/bins/twgy8")
    .then(response => response.json())
    .then(json => {
      this.products = json
    })
  },

  computed: {
    totalProducts () {
      return this.products.reduce((sum, product) => {
        return sum + product.quantity;
      }, 0);
    }
  },

  props: {
    msg: String
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>