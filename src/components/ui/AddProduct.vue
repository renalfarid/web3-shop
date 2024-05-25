<script setup>
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { Web3 } from "web3"

const props = defineProps(['open'])

const open = ref(false)
const data = ref(null)
const productName = ref('')
const productThumbnail = ref('')
const productPrice = ref(0)

let web3 = new Web3("https://rpc.sepolia.org")
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

const initializeWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("User denied account access");
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }
};

let abiData = null

const fetchData = async () => {
    const response = await fetch('/data.json')
    data.value = await response.json()
    abiData = data.value.abi
    console.log("Data: ", abiData)
}

const addProduct = async () => {
  await fetchData()
  console.log("price :", productPrice.value.toString())
  const priceInWei = web3.utils.toWei(productPrice.value, 'ether'); // Ensure price is in Wei

  try {
    const contract = new web3.eth.Contract(abiData, contractAddress)
    console.log("Contract instance:", contract);

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error("No accounts found. Ensure the wallet is connected.");
      return;
    }
    console.log("Accounts:", accounts);

    const transaction = await contract.methods.addItem(
      productName.value,
      productThumbnail.value,
      priceInWei
    ).send({
      from: accounts[0],
      gas: 500000 // Adjust gas limit as necessary
    });

    alert('Product added successfully', transaction);
    open.value = false;
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

onMounted(() => {
  open.value = props.open
  initializeWeb3()
})


</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Add Product</DialogTitle>
                    <div class="mt-4 space-y-4 w-full">
                      <div>
                        <label for="ProductName" class="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                          type="text"
                          id="ProductName"
                          v-model="productName"
                          placeholder="Enter product name"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label for="Thumbnail" class="block text-sm font-medium text-gray-700">Thumbnail</label>
                        <input
                          type="text"
                          id="Thumbnail"
                          v-model="productThumbnail"
                          placeholder="Enter thumbnail URL"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label for="Price" class="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="text"
                          id="Price"
                          v-model="productPrice"
                          placeholder="Enter price"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  @click="addProduct()"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="open = false"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
