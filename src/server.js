import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

// Importação das rotas
import { createOrder } from "./routes/createOrder.js";
import { getOrder } from "./routes/getOrder.js";
import { getAllOrders } from "./routes/getAllOrders.js";
import { updateOrder } from "./routes/updateOrder.js";
import { deleteOrder } from "./routes/deleteOrder.js";
import fastifyJwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.js";

const app = Fastify();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Configuração do JWT
app.register(fastifyJwt, {
  secret: process.env.SECRET_KEY,
});

app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Token ausente ou inválido." });
  }
});

// Configuração do Swagger
app.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Order API",
      description: "API para gerenciar pedidos",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: "Insira o token no formato: Bearer <seu_token_aqui>",
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Registro das rotas
app.register(createOrder);
app.register(getOrder);
app.register(getAllOrders);
app.register(updateOrder);
app.register(deleteOrder);
app.register(authRoutes);

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("HTTP Server Running on http://localhost:3000");
    console.log("Swagger Docs at http://localhost:3000/docs");
  });
