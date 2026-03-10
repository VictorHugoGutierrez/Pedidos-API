import { prisma } from "./lib/prisma.js";

export async function getAllOrders(app) {
  const listOptions = {
    schema: {
      description: "Lista todos os pedidos",
      tags: ["Orders"],
      response: {
        200: {
          description: "Lista de pedidos recuperada com sucesso",
          type: "array",
          items: {
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
        },
      },
    },
    onRequest: [app.authenticate],
  };

  app.get("/order/list", listOptions, async (request, reply) => {
    try {
      const orders = await prisma.order.findMany({
        include: { items: true },
      });

      return reply.status(200).send(orders);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar os pedidos." });
    }
  });
}
