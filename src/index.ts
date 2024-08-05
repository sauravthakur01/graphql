import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {

    const app = express();
    const PORT = Number(process.env.PORT) || 3000;
    
    app.use(express.json());
    
    const server = new ApolloServer({
        typeDefs:`
            type Query {
                hello: String,
                say(name: String): String   
            }
        `,
        resolvers:{
            Query:{
                hello: () => "Hello World",
                say: (_, { name }: { name: string }) => `Hello ${name || "World"}`,
            },
        },
    });
    
    await server.start();

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.use('/graphql', express.json(), expressMiddleware(server));


    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

init()
