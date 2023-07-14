/* esm.sh - esbuild bundle(react@18.2.0/jsx-runtime) es2015 production */
import * as __0$ from "./react.mjs";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"react":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var R=Object.create;var p=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames,m=Object.getOwnPropertySymbols,q=Object.getPrototypeOf,c=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable;var P=(r=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(r,{get:(e,o)=>(typeof require!="undefined"?require:e)[o]}):r)(function(r){if(typeof require!="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var y=(r,e)=>{var o={};for(var t in r)c.call(r,t)&&e.indexOf(t)<0&&(o[t]=r[t]);if(r!=null&&m)for(var t of m(r))e.indexOf(t)<0&&w.call(r,t)&&(o[t]=r[t]);return o};var x=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),h=(r,e)=>{for(var o in e)p(r,o,{get:e[o],enumerable:!0})},l=(r,e,o,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of b(e))!c.call(r,s)&&s!==o&&p(r,s,{get:()=>e[s],enumerable:!(t=S(e,s))||t.enumerable});return r},f=(r,e,o)=>(l(r,e,"default"),o&&l(o,e,"default")),a=(r,e,o)=>(o=r!=null?R(q(r)):{},l(e||!r||!r.__esModule?p(o,"default",{value:r,enumerable:!0}):o,r));var j=x(_=>{"use strict";var D=P("react"),F=Symbol.for("react.element"),I=Symbol.for("react.fragment"),L=Object.prototype.hasOwnProperty,T=D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,g={key:!0,ref:!0,__self:!0,__source:!0};function O(r,e,o){var t,s={},u=null,d=null;o!==void 0&&(u=""+o),e.key!==void 0&&(u=""+e.key),e.ref!==void 0&&(d=e.ref);for(t in e)L.call(e,t)&&!g.hasOwnProperty(t)&&(s[t]=e[t]);if(r&&r.defaultProps)for(t in e=r.defaultProps,e)s[t]===void 0&&(s[t]=e[t]);return{$$typeof:F,type:r,key:u,ref:d,props:s,_owner:T.current}}_.Fragment=I;_.jsx=O;_.jsxs=O});var i=x((Y,v)=>{"use strict";v.exports=j()});var n={};h(n,{Fragment:()=>C,default:()=>B,jsx:()=>U,jsxs:()=>$});var N=a(i());f(n,a(i()));var{Fragment:C,jsx:U,jsxs:$}=N,E=N,{default:k}=E,A=y(E,["default"]),B=k!==void 0?k:A;export{C as Fragment,B as default,U as jsx,$ as jsxs};
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=jsx-runtime.js.map