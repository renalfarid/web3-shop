<script setup>
  import Announcement from "./ui/Announcement.vue"
  import HeaderShop from "./ui/HeaderShop.vue"
  import AddProduct from "./ui/AddProduct.vue"
  import { ethers } from "ethers"
  import { onMounted, ref } from "vue"
  import { Web3 } from "web3"

  const products = ref([])
  const data = ref(null)

  const web3 = new Web3("https://rpc.sepolia.org");

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

  let abiData = null

  const fetchData = async () => {
    const response = await fetch('/data.json')
    data.value = await response.json()
    abiData = data.value.abi
    //console.log("Data: ", abiData)
  }

  const getProduct = async () => {
    await fetchData()
    const contract = new web3.eth.Contract(abiData, contractAddress)
    console.log("Contract instance:", contract);


    try {
    const itemCount = await contract.methods.itemCount().call(); // Get the total number of items
      const items = [];
      for (let i = 1; i <= itemCount; i++) {
         const item = await contract.methods.getItem(i).call(); // Get each individual item
         console.log("item: ", item)
         products.value.push({
          id: Number(item[0]),  // Convert BigInt to number
          name: item[1],
          thumbnail: item[2],
          price: web3.utils.fromWei(item[3].toString(), 'ether'),  // Convert BigInt to string for fromWei
          owner: item[4]
         })
         /* products.value.push({
            id: item[0].toNumber(), // Convert BigNumber to number
            name: item[1],
            thumbnail: item[2],
            price: ethers.utils.formatEther(item[3]), // Convert BigNumber to ether (string)
            owner: item[4]
          }); */
      }
      console.log("All items:", products.value);
      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }

  }


  
  /* let provider = ""
  //await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
  if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    // Proceed with using the provider
  } else {
    // Handle the case where MetaMask is not available
    console.error("MetaMask or Ethereum provider not found.");
  }
  

  console.log("provider: ", provider)

  let abiData = null

  const fetchData = async () => {
    const response = await fetch('/data.json')
    data.value = await response.json()
    abiData = data.value.abi
    //console.log("Data: ", abiData)
  }

  const getProduct = async () => {
   await fetchData();
   const contract = new ethers.Contract(contractAddress, abiData, provider);
   //const wallet = new ethers.Wallet(contractAddress, abiData)
   //console.log("contract: ", contract)
   //const signer = wallet.provider(wallet.address)
   const signer = provider.getSigner();
   const contractWithSigner = contract.connect(signer);

   try {
      const itemCount = await contractWithSigner.itemCount(); // Get the total number of items
      const items = [];
      for (let i = 1; i <= itemCount; i++) {
         const item = await contractWithSigner.getItem(i); // Get each individual item
         console.log("item: ", item)
         products.value.push({
            id: item[0].toNumber(), // Convert BigNumber to number
            name: item[1],
            thumbnail: item[2],
            price: ethers.utils.formatEther(item[3]), // Convert BigNumber to ether (string)
            owner: item[4]
          });
      }
      console.log("All items:", products.value);
      return items;
   } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
   } 
  }*/

const buyProduct = async (productId) => {
  await fetchData();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abiData, signer);

  try {
    // Fetch the product details
    const product = await contract.items(productId);
    const price = product.price;

    console.log("Product details:", product);
    console.log("Sending transaction with price:", ethers.utils.formatEther(price));

    // Check if the item can be purchased
    /*if (product.owner === await signer.getAddress()) {
      alert('You cannot buy your own item.');
      return;
    }*/

    // Execute the purchase
    const transaction = await contract.purchaseItem(productId, {
      value: price,
      gasLimit: ethers.utils.hexlify(500000), // Adjust as necessary
    });

    await transaction.wait(); // Wait for the transaction to be mined
    alert('Product purchased successfully');
  } catch (error) {
    console.error("Error purchasing item:", error);

    // Provide detailed error message
    if (error.data && error.data.message) {
      alert('Error purchasing item: ' + error.data.message);
    } else {
      alert('Error purchasing item: ' + error.message);
    }

    throw error;
  }
};

onMounted(async () => {
    await getProduct()
})

</script>
<template>
  <Announcement />
  <HeaderShop />
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