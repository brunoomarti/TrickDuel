import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const link = createHttpLink({
    uri: "https://us-west-2.cdn.hygraph.com/content/cmihugm8h00rg07uo60hxe37e/master?",
    headers: {
        "Content-Type": "application/json",
    },
});

export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});
