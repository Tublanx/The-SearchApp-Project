import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import {
  Heading,
  Box,
  Flex,
  Input,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import Characters from "../components/Characters";

export default function Home(results) {
  const initState = results;
  const [characters, setCharacters] = useState(initState.characters);
  const [search, setSearch] = useState("");
  const toast = useToast();

  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>NextJs and GraphQL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty
        </Heading>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const results = await fetch("/api/SearchCharacters", {
              method: "post",
              body: search,
            });
            const { characters, error } = await results.json();
            if (error) {
              toast({
                position: "bottom",
                title: "An error occured",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
            }
          }}
        >
          <Stack maxWidth="350px" width="100%" isInline mb={8}>
            <Input
              placeholder="Search"
              value={search}
              border="none"
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <IconButton
              colorScheme="blue"
              aria-label="Search Database"
              icon={<SearchIcon></SearchIcon>}
              disabled={search === ""}
              type="submit"
            ></IconButton>
            <IconButton
              colorScheme="red"
              aria-label="Reset Button"
              icon={<CloseIcon></CloseIcon>}
              disabled={search === ""}
              onClick={async () => {
                setSearch("");
                setCharacters(initState.characters);
              }}
            ></IconButton>
          </Stack>
        </form>
        <Characters characters={characters}></Characters>
      </Box>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              id
              name
            }
            image
            origin {
              id
              name
            }
            episode {
              id
              episode
              air_date
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data.characters.results,
    },
  };
}
