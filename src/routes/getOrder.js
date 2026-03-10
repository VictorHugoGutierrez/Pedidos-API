import { prisma } from "./lib/prisma.js";

export async function getOrder(app) {
  const getSchema = {
    schema: {
      description: "Obter os dados do pedido pelo número",
      tags: ["Orders"],
      params: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "Número do pedido na URL" },
        },
      },
      response: {
        200: {
          description: "Pedido encontrado com sucesso",
          type: "object",
          properties: {
            orderId: { type: "string" },
            value: { type: "number" },
            creationDate: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer" },
                  price: { type: "number" },
                },
              },
            },
          },
        },
        404: {
          description: "Pedido não encontrado",
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
    onRequest: [app.authenticate],
  };

  app.get("/order/:orderId", getSchema, async (request, reply) => {
    try {
      const { orderId } = request.params;

      const order = await prisma.order.findUnique({
        where: { orderId },
        include: { items: true },
      });

      if (order) {
        return reply.status(200).send(order);
      } else {
        return reply.status(404).send({ error: "Pedido não encontrado." });
      }
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar o pedido." });
    }
  });
}
