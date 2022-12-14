import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Select,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
  Center,
} from "@chakra-ui/react";
import { UpDownIcon } from "@chakra-ui/icons";
import { uniq } from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useCallback, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { usePools } from "../hooks/usePools";
import { fetchQuote } from "../hooks/useQuote";
import styles from "../styles/Home.module.css";
import { Pool } from "../types";

interface LpPool {
  error: string | null;
  pool_address: string | null;
  token_in: number | null;
  token_out: number | null;
}

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { data, isLoading, isError } = usePools();
  const [lpPool, setLpPool] = useState<LpPool[]>([]);
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [amount, setAmount] = useState("");
  const handleSwap = useCallback(() => {
    if (!token1 || !token2 || !amount || !data) {
      toast({
        position: "top",
        duration: 1000,
        isClosable: true,
        render: () => (
          <Box color="black" p={3} bg="red" borderRadius={"md"}>
            Invalid input!
          </Box>
        ),
      });
      return;
    }
    console.log({ token1, token2, amount });
    setLpPool([]);
    fetchQuote(token1, token2, amount).then((r) => {
      console.log(r);
      setLpPool(r);
    });
    onOpen();
  }, [amount, data, onOpen, toast, token1, token2]);
  const swap = useCallback(() => {
    const token1_tmp = token1;
    const token2_tmp = token2;
    setToken1(token2_tmp);
    setToken2(token1_tmp);
  }, [token1, token2]);
  if (!data) {
    return (
      <Center boxSize={"xl"} backgroundColor="black">
        <Image src="/images/tracy.png" alt="Logo" />
      </Center>
    );
  }
  let tokens = uniq(
    (data as Pool[]).flatMap((pool) => {
      if (pool.chain === "juno") {
        return [pool.token1?.symbol, pool.token2?.symbol];
      } else if (pool.chain === "osmosis") {
        return pool.pool_assets?.map((asset) => asset.token.native_name);
      } else {
        return [];
      }
    })
  ).sort();
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
          Scrap
        </Heading>
        {(isLoading || isError) && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            marginTop={"5rem"}
            marginBottom={"5rem"}
          />
        )}
        {!(isLoading || isError) && (
          <>
            <VStack width="50%" maxWidth={"20rem"} gap="5px">
              <Select
                placeholder="Token In"
                onChange={(t) => setToken1(t.target.value)}
              >
                {tokens.map((token, key) => {
                  if (token) {
                    return (
                      <option
                        key={key}
                        value={token!}
                        selected={token1 === token}
                        style={{ color: "black" }}
                      >
                        {token}
                      </option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
              <Button>
                <UpDownIcon color={"black"} onClick={swap}></UpDownIcon>
              </Button>
              <Select
                placeholder="Token Out"
                onChange={(t) => setToken2(t.target.value)}
              >
                {tokens.map((token, key) => {
                  if (token) {
                    return (
                      <option
                        key={key}
                        value={token!}
                        selected={token2 === token}
                        style={{ color: "black" }}
                      >
                        {token}
                      </option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
              <Input
                placeholder="Amount"
                type={"number"}
                onChange={(a) => setAmount(a.target.value)}
              />
            </VStack>
            <Button
              marginTop={"5"}
              backgroundColor={"#ff7fa3"}
              _active={{ backgroundColor: "#ff7fa3" }}
              _hover={{ backgroundColor: "#ff7fa3" }}
              onClick={handleSwap}
            >
              Swap
            </Button>
          </>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Pools</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Container gap="2rem" overflowY={"scroll"} maxHeight={"50%"}>
                <>
                  {lpPool.length === 0 && (
                    <Text>{`Loading for ${token1} and ${token2}`}</Text>
                  )}
                  {lpPool.length > 0 &&
                    lpPool.map(
                      (pool, key) =>
                        pool.error === null && (
                          <>
                            <Box key={key} border={"aqua"}>
                              <Text>Pool Address: {pool.pool_address}</Text>
                              <Text>{`${pool.token_in} ${token1} = ${pool.token_out} ${token2}`}</Text>
                            </Box>
                          </>
                        )
                    )}
                </>
              </Container>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
