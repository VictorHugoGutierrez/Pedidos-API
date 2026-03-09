export function mapOrderData(inputData) {
  return {
    orderId: inputData.numeroPedido,
    value: inputData.valorTotal,
    creationDate: new Date(inputData.dataCriacao),
    items: inputData.items.map((item) => ({
      productId: parseInt(item.idItem, 10),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}
