import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadSupplierWorkspace} from '../src/index.mjs';

test('supplier workspace requires a supplier grant before reading member-owned product and request resources',async()=>{
 const calls=[];const connection={kind:'supplier',scope:'supplier:read',read_only:true};
 const client={async read(resource){calls.push(resource);return resource==='connection'?connection:{items:[{source:resource}],read_only:true};}};
 assert.deepEqual(await loadSupplierWorkspace(client),{connection,products:[{source:'products'}],requests:[{source:'requests'}],read_only:true});
 assert.deepEqual(calls,['connection','products','requests']);
});

test('storefront grant is rejected and upstream denial cannot become empty successful supplier data',async()=>{
 let calls=0;
 await assert.rejects(()=>loadSupplierWorkspace({async read(){calls++;return {kind:'storefront',scope:'storefront:read',read_only:true};}}),/supplier read connection/);assert.equal(calls,1);
 await assert.rejects(()=>loadSupplierWorkspace({async read(resource){if(resource==='connection')return {kind:'supplier',scope:'supplier:read',read_only:true};throw Error('Revoked connection');}}),/Revoked connection/);
});
