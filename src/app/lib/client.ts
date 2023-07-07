import Web3, { Personal } from "web3";

export const web3 = new Web3(window.ethereum);
export const personal = new Personal(window.ethereum);
