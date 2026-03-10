import { prisma } from "./lib/prisma.js";

export async function deleteOrder(app) {
  const deleteSchema = {
    schema: {
      description: "Deleta um pedido pelo número",
      tags: ["Orders"],
      params: {
        type: "object",
        properties: { orderId: { type: "string" } },
      },
      response: {
        204: {
          description: "Pedido deletado com sucesso",
          type: "null",
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

  app.delete("/order/:orderId", deleteSchema, async (request, reply) => {
    try {
      const { orderId } = request.params;

      await prisma.order.delete({
        where: { orderId: orderId },
      });

      return reply.status(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        return reply
          .status(404)
          .send({ error: "Pedido não encontrado para exclusão." });
      }

      return reply.status(500).send({ error: "Erro ao excluir o pedido." });
    }
  });
}
