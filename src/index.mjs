export { ScopedReadClient,startPairing,pollPairing,platformOrigin } from '../client/read-client.mjs';

// Keep the caller's read client scoped by the platform; no local authorization
// inference and no copy of the platform database or browser session.
export async function loadSupplierWorkspace(client) {
  const connection=await client.read('connection');
  if(connection.kind!=='supplier'||connection.scope!=='supplier:read'||connection.read_only!==true)throw Error('A supplier read connection is required.');
  const products=await client.read('products');
  const requests=await client.read('requests');
  return {connection,products:products.items,requests:requests.items,read_only:true};
}
