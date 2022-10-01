import {
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Header } from "../components/Header";
import { Pools } from "../components/Pools";
import { chainsAtom } from "../state/menu";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const setChains = useSetAtom(chainsAtom);
  return (
    <div className={styles.container}>
      <Head>
        <title>Tracy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header />
        <Heading paddingTop={2} paddingBottom={4}>
          Pools
        </Heading>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            backgroundColor="teal.600"
            _hover={{ bg: "teal.600" }}
            _focus={{ bg: "teal.600" }}
            _active={{ bg: "teal.600" }}
          >
            Chains
          </MenuButton>
          <MenuList minWidth="240px" backgroundColor={"black"}>
            <MenuOptionGroup
              title="Chains"
              type="checkbox"
              onChange={(chains) => {
                if (typeof chains !== "object") {
                  setChains([chains]);
                } else {
                  setChains(chains);
                }
              }}
            >
              <MenuItemOption
                value="juno"
                _hover={{ bg: "teal.600" }}
                _focus={{ bg: "black" }}
                _active={{ bg: "teal.600" }}
              >
                Juno
              </MenuItemOption>
              <MenuItemOption
                value="osmosis"
                _hover={{ bg: "teal.600" }}
                _focus={{ bg: "black" }}
                _active={{ bg: "teal.600" }}
              >
                Osmosis
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Pools></Pools>
        <footer className={styles.footer}>
          <a
            href="https://daubit.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image
                src="/images/daubit_apps_logo-opt-256.webp"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </main>
    </div>
  );
};

export default Home;