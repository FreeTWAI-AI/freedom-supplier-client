/** Read canonical supplier state; the server checks the connection on every read. */
export async function loadSupplierWorkspace(client) {
  if (!client || typeof client.read !== 'function') throw new TypeError('A scoped read client is required.');
  const connection = await client.read('connection');
  if (connection?.kind !== 'supplier' || connection.scope !== 'supplier:read' || connection.read_only !== true) {
    throw new Error('A supplier read connection is required.');
  }
  const products = await client.read('products');
  const requests = await client.read('requests');
  if (!Array.isArray(products?.items) || !Array.isArray(requests?.items)) throw new TypeError('Incompatible supplier list response.');
  return { connection, products: products.items, requests: requests.items, read_only: true };
}
