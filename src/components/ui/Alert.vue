<script setup>
  import { ref, onMounted } from 'vue'

  const emit = defineEmits(['close'])
  const props = defineProps(['data'])

  const alerData = ref(null)

  const dismissAlert = () => {
    emit('close')
  }
  onMounted(() => {
    alerData.value = props.data
    console.log("alert data", alerData.value)
  })
</script>
<template>
    <div role="alert" class="rounded-xl border border-gray-100 bg-white p-4">
      <div class="flex items-start gap-4">
        <span class="text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
    
        <div class="flex-1">
          <strong class="block font-medium text-gray-900"> {{ alerData?.title }} </strong>
    
          <p class="mt-1 text-sm text-gray-700 truncate ...">{{ alerData?.msg }}</p>
        </div>
    
        <button @click="dismissAlert()" class="text-gray-500 transition hover:text-gray-600">
          <span class="sr-only">Dismiss popup</span>
    
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </template>