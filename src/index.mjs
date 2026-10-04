// Deliberately source-valid but behaviorally invalid canary.
export { ScopedReadClient } from '../vendor/freedom-libraries/packages/client-connections/read-client.mjs';
export async function loadSupplierWorkspace() { return { status: 'passed', canary: 'stub' }; }
