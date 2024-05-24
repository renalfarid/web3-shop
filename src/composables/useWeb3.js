import { Web3 } from "web3"

const provider = import.meta.env.VITE_WEB3_PROVIDER
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);

export default function useWeb3() {
   
    const getEthBlock = () => {
    web3.eth.getBlockNumber().then((result) => {
        console.log("Latest Ethereum Block is ", result);
      });
   }

   return { 
    getEthBlock
   }
   
}