"use client";

import axios from "axios";
import { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ethereum, personal } from "./lib/client";

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>("");

  const onSubmitMetamask: FormEventHandler = async (e) => {
    try {
      e.preventDefault();

      if (!email) return;

      const accounts: any = await ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (accounts) {
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

  return (
    <div className="bg-red-100 min-h-screen p-24">
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
      </div>
    </div>
  );
};

export default Home;
