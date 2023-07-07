import Web3, { Personal } from "web3";
import { MetaMaskSDK } from "@metamask/sdk";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Project",
    url: "https://project.project/",
  },
});
const ethereum = MMSDK.getProvider();

export const web3 = new Web3(ethereum);
export const personal = new Personal(ethereum);
