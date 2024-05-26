<script setup>
  import Announcement from "./ui/Announcement.vue"
  import HeaderShop from "./ui/HeaderShop.vue"
  import Alert from "./ui/Alert.vue"
  import { onMounted, ref } from "vue"
  import { Web3 } from "web3"

  const products = ref([])
  const data = ref(null)
  const isOpen = ref(false)
  const alertData = ref({})

  let web3 = new Web3("https://rpc.sepolia.org");

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

  let abiData = null

  const fetchData = async () => {
    const response = await fetch('/data.json')
    data.value = await response.json()
    abiData = data.value.abi
    //console.log("Data: ", abiData)
  }

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

  const getProduct = async () => {
    await fetchData()
    const contract = new web3.eth.Contract(abiData, contractAddress)
   

    try {
    const itemCount = await contract.methods.itemCount().call(); // Get the total number of items
      const items = [];
      for (let i = 1; i <= itemCount; i++) {
         const item = await contract.methods.getItem(i).call(); // Get each individual item
         products.value.push({
          id: Number(item[0]),  // Convert BigInt to number
          name: item[1],
          thumbnail: item[2],
          price: web3.utils.fromWei(item[3].toString(), 'ether'),  // Convert BigInt to string for fromWei
          owner: item[4]
         })
      }
      return items;
    } catch (error) {
      throw error;
    }

  }

const sendAlertData = (alertObj) => {
  alertData.value = alertObj
}

const buyProduct = async (productId) => {
  await fetchData()
  const contract = new web3.eth.Contract(abiData, contractAddress)
  let alert = {
    title: "",
    msg: ""
  }
  try {
    const product = await contract.methods.items(productId).call();
    const price = product.price.toString();

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      return;
    }
    const transaction = await contract.methods.purchaseItem(productId).send({
      from: accounts[0],
      value: price,  // Send value in Wei
      gas: 500000 // Adjust as necessary
    });

    alert.title = "Product purchased"
    alert.msg = "Product purchased successfully"
    sendAlertData(alert)
    isOpen.value = true

  } catch (error) {
    alert.title = "Error purchase"
    alert.msg = `Error purchasing item:${error.message || error.data.message}`
    sendAlertData(alert)
    isOpen.value = true

    throw error;
  }
};

const closeAlert = () => {
  isOpen.value = false
}
onMounted(async () => {
    await initializeWeb3()
    await getProduct()
})

</script>
<template>
  <Announcement />
  <HeaderShop />
  <div v-if="isOpen">
    <Alert :data="alertData" @close="closeAlert()" />
  </div>
  
  <div class="m-8 px-2 py-2 grid grid-cols-4 gap-4">
    <a v-for="item in products" href="#" class="group block">
    <img
      :src="item.thumbnail"
      alt=""
      class="aspect-square w-full rounded object-cover"
    />
  
    <div class="mt-3">
      <h3 class="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
        {{ item.name }}
      </h3>
  
      <p class="mt-1 text-sm font-bold text-gray-700">ETH {{ item.price }}</p>
      <p class="text-xs truncate ...">Owner : {{ item.owner }}</p>
      <div class="grid justify-items-center">
        <button
          class="mt-5 inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
          @click="buyProduct(item.id)"
        >
          Buy
        </button>
      </div>
      
       
  
    </div>
  </a>
  
  </div>

</template>