"use client";

import axios from "axios";
import { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ethereum, personal, web3 } from "./lib/client";
import MINT_NFT_ABI from "./lib/MINT_NFT_ABI.json";
import MINT_NFT_BYTECODE from "./lib/MINT_NFT_BYTECODE";

const Home: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const onSubmitMetamask: FormEventHandler = async (e) => {
    try {
      e.preventDefault();

      if (!email) return;

      const accounts: any = await ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (accounts) {
        setAccount(accounts[0]);

        const signedToken = await personal.sign(
          `Welcome!\n\n\n${uuidv4()}`,
          accounts[0],
          "Pass"
        );

        await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
          account: accounts[0],
          email,
          signedToken,
        });

        localStorage.setItem("signedToken", signedToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitDeploy: FormEventHandler = async (e) => {
    try {
      e.preventDefault();

      if (!account || !name || !symbol) return;

      const signedToken = localStorage.getItem("signedToken");

      const userCheckRes = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user?signed-token=${signedToken}`
      );

      if (userCheckRes.data.ok) {
        const contract = new web3.eth.Contract(MINT_NFT_ABI);

        const deployRes = await contract
          .deploy({
            data: MINT_NFT_BYTECODE,
            //  @ts-expect-error
            arguments: [
              name,
              symbol,
              "https://olbm.mypinata.cloud/ipfs/QmU52T5t4bXtoUqQYStgx39DdXy3gLQq7KDuF1F9g3E9Qy",
              1000,
            ],
          })
          .send({ from: account });

        if (deployRes["_address"]) {
          console.log(deployRes["_address"]);

          const contractRes = await axios.post(
            `${process.env.NEXT_PUBLIC_URL}/api/contract`,
            {
              address: deployRes["_address"],
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log(contractRes);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-red-100 min-h-screen pt-10 pl-2">
      <div>
        <form onSubmit={onSubmitMetamask}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="ml-2 px-2 py-1 border-2 border-black rounded-md"
            type="submit"
            value="메타마스크로그인"
          />
        </form>
        <form className="mt-2" onSubmit={onSubmitDeploy}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="ml-2"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input
            className="ml-2 px-2 py-1 border-2 border-black rounded-md"
            type="submit"
            value="스마트컨트랙트배포"
          />
        </form>
      </div>
    </div>
  );
};

export default Home;