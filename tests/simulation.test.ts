import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleCycle,manualResponse} from '../src/simulation.ts';
test('cycle contains contact, separation and reverse induction without physical units',()=>{
 assert.equal(sampleCycle(0).stage,0);assert.equal(sampleCycle(4).separation,0);
 assert.equal(sampleCycle(7.5).stage,2);assert(sampleCycle(7.5).response>0);
 assert.equal(sampleCycle(10.5).stage,3);assert(sampleCycle(10.5).response<0);
 assert(Math.abs(sampleCycle(7.5).separation-.5)<1e-12);
 assert.equal(sampleCycle(12).stage,0);
});
test('cycle joins continuously at motion boundaries',()=>{
 for(const t of [0,3,6,9,12]){const a=sampleCycle(t-1e-6),b=sampleCycle(t+1e-6);assert(Math.abs(a.separation-b.separation)<1e-5);assert(Math.abs(a.response-b.response)<1e-5);}
});
test('manual separation reverses response, clamps extremes, and yields zero at rest',()=>{
 assert(manualResponse(0,.5,.3)>0);assert(manualResponse(.5,0,.3)<0);
 assert.equal(manualResponse(.5,.5,.1),0);assert.equal(manualResponse(0,1,0),0);
 assert.equal(manualResponse(0,1,.001),1);assert.equal(manualResponse(1,0,.001),-1);
});
