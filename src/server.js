import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { createOrder } from "./routes/createOrder.js";
import { getOrder } from "./routes/getOrder.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = Fastify();

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
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

app.ready((err) => {
  if (err) throw err;
  app.swagger();
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(createOrder);
app.register(getOrder);

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
