import { MetaMaskSDK } from "@metamask/sdk";
import Web3, { Personal } from "web3";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Project",
    url: "https://bcs-3-p4-web3-prisma.vercel.app",
  },
});

export const ethereum = MMSDK.getProvider();

export const web3 = new Web3(ethereum);
export const personal = new Personal(ethereum);