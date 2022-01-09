import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql/",
  cache: new InMemoryCache(),
});

export default async (req, res) => {
  const search = req.body;

  try {
    const { data } = await client.query({
      query: gql`
        query {
          characters(filter: { name: "${search}" }) {
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
    res.status(200).json({ characters: data.characters.results, error: null });
  } catch (error) {
    if (error.message === "404: Not Found") {
      res.status(400).json({ characters: null, error: "No Character" });
    } else {
      res
        .status(500)
        .json({ characters: null, error: "Internal Error, please try again" });
    }
  }
};
