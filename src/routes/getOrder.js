import { prisma } from "./lib/prisma.js";

export async function getOrder(app) {
  app.get("/order/:orderId", async (request, reply) => {
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
