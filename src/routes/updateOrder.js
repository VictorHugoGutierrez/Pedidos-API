import { prisma } from "./lib/prisma.js";
import { mapOrderData } from "./utils/mappingData.js";

export async function updateOrder(app) {
  const putSchema = {
    schema: {
      description: "Atualiza um pedido existente",
      tags: ["Orders"],
      params: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "Número do pedido na URL" },
        },
      },
      body: {
        type: "object",
        required: ["numeroPedido", "valorTotal", "dataCriacao", "items"],
        properties: {
          numeroPedido: { type: "string", examples: ["v10089015vdb-01"] },
          valorTotal: { type: "number", examples: [15000] },
          dataCriacao: {
            type: "string",
            format: "date-time",
            examples: ["2023-07-19T12:24:11.5299601+00:00"],
          },
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["idItem", "quantidadeItem", "valorItem"],
              properties: {
                idItem: { type: "string", examples: ["2434"] },
                quantidadeItem: { type: "integer", examples: [2] },
                valorItem: { type: "number", examples: [7500] },
              },
            },
          },
        },
      },
      response: {
        200: {
          description: "Pedido atualizado com sucesso",
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

  app.put("/order/:orderId", putSchema, async (request, reply) => {
    try {
      const { orderId } = request.params;
      const mappedBody = mapOrderData(request.body);

      const updatedOrder = await prisma.order.update({
        where: { orderId: orderId },
        data: {
          value: mappedBody.value,
          creationDate: mappedBody.creationDate,
          items: {
            deleteMany: {},
            create: mappedBody.items,
          },
        },
        include: { items: true },
      });

      return reply.status(200).send(updatedOrder);
    } catch (error) {
      if (error.code === "P2025") {
        return reply
          .status(404)
          .send({ error: "Pedido não encontrado para atualização." });
      }

      return reply.status(500).send({ error: "Erro ao atualizar o pedido." });
    }
  });
}
