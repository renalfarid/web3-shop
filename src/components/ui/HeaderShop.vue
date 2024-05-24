<script setup>
  import { ref } from "vue"
  import AddProduct from './AddProduct.vue'

  const show = ref(false)

  const showModal = () => {
    show.value = true
    console.log("show: ", show.value)
  }
</script>
<template>
    <header>
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome Web3 Shop</h1>
    
            <p class="mt-1.5 text-sm text-gray-500">Let's add product 🎉</p>
          </div>
    
          <div class="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <button @click="showModal()"
              class="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
              type="button"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </header>
    <div v-if="show">
      <AddProduct :open="show" />
    </div>
      
    
  </template>