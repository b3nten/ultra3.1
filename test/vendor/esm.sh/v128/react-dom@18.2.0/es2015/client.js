/* esm.sh - esbuild bundle(react-dom@18.2.0/client) es2015 production */
import * as __0$ from "./react-dom.mjs";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"react-dom":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var h=Object.create;var _=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames,l=Object.getOwnPropertySymbols,N=Object.getPrototypeOf,R=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var g=(t=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(t,{get:(e,o)=>(typeof require!="undefined"?require:e)[o]}):t)(function(t){if(typeof require!="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var f=(t,e)=>{var o={};for(var r in t)R.call(t,r)&&e.indexOf(r)<0&&(o[r]=t[r]);if(t!=null&&l)for(var r of l(t))e.indexOf(r)<0&&O.call(t,r)&&(o[r]=t[r]);return o};var P=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),v=(t,e)=>{for(var o in e)_(t,o,{get:e[o],enumerable:!0})},u=(t,e,o,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of C(e))!R.call(t,a)&&a!==o&&_(t,a,{get:()=>e[a],enumerable:!(r=x(e,a))||r.enumerable});return t},i=(t,e,o)=>(u(t,e,"default"),o&&u(o,e,"default")),y=(t,e,o)=>(o=t!=null?h(N(t)):{},u(e||!t||!t.__esModule?_(o,"default",{value:t,enumerable:!0}):o,t));var c=P(s=>{"use strict";var d=g("react-dom");s.createRoot=d.createRoot,s.hydrateRoot=d.hydrateRoot;var U});var n={};v(n,{createRoot:()=>D,default:()=>S,hydrateRoot:()=>I});var p=y(c());i(n,y(c()));var{createRoot:D,hydrateRoot:I}=p,E=p,{default:m}=E,L=f(E,["default"]),S=m!==void 0?m:L;export{D as createRoot,S as default,I as hydrateRoot};
//# sourceMappingURL=client.js.map