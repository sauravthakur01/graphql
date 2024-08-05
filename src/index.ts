import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const server = new ApolloServer({
    typeDefs: `
            type Query {
                hello: String,
                say(name: String): String   
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
    resolvers: {
      Query: {
        hello: () => "Hello World",
        say: (_, { name }: { name: string }) => `Hello ${name || "World"}`,
      },
      Mutation: {
        createUser: async(
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
            await prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                    salt: "salt",
                },
            })
            return true
        },
      },
    },
  });

  await server.start();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

init();
