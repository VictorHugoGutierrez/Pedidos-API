import { prisma } from "./lib/prisma.js";
import { mapOrderData } from "./utils/mappingData.js";

export async function createOrder(app) {
  const postSchema = {
    schema: {
      description: "Cria um novo pedido",
      tags: ["Orders"],
      body: {
        type: "object",
        required: ["numeroPedido", "valorTotal", "dataCriacao", "items"],
        properties: {
          numeroPedido: { type: "string", example: "v10089015vdb-01" },
          valorTotal: { type: "number", example: 10000 },
          dataCriacao: {
            type: "string",
            format: "date-time",
            example: "2023-07-19T12:24:11.529Z",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["idItem", "quantidadeItem", "valorItem"],
              properties: {
                idItem: { type: "string", example: "2434" },
                quantidadeItem: { type: "integer", example: 1 },
                valorItem: { type: "number", example: 1000 },
              },
            },
          },
        },
      },
      response: {
        201: {
          description: "Pedido criado com sucesso",
          type: "object",
          properties: {
            orderId: { type: "string" },
            value: { type: "number" },
            creationDate: { type: "string", format: "date-time" },
          },
        },
      },
    },
  };

  app.post("/order", postSchema, async (request, reply) => {
    try {
      const bodySchema = request.body;
      const mappedBody = mapOrderData(bodySchema);

      const order = await prisma.order.create({
        data: {
          orderId: mappedBody.orderId,
          value: mappedBody.value,
          creationDate: mappedBody.creationDate,
          items: {
            create: mappedBody.items,
          },
        },
        include: { items: true },
      });

      return reply.status(201).send(order);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao criar o pedido." });
    }
  });
}
