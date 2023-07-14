/* esm.sh - esbuild bundle(lit-element@3.3.2/lit-element) es2015 production */
import{ReactiveElement as a}from"./../../@lit/reactive-element@1.6.2/es2015/reactive-element.mjs";export*from"./../../@lit/reactive-element@1.6.2/es2015/reactive-element.mjs";import{render as d,noChange as c}from"./../../lit-html@2.7.4/es2015/lit-html.mjs";export*from"./../../lit-html@2.7.4/es2015/lit-html.mjs";var r,s,u=a,n=class extends a{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;let i=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=i.firstChild),i}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=d(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return c}};n.finalized=!0,n._$litElement$=!0,(r=globalThis.litElementHydrateSupport)===null||r===void 0||r.call(globalThis,{LitElement:n});var l=globalThis.litElementPolyfillSupport;l==null||l({LitElement:n});var m={_$AK:(o,e,t)=>{o._$AK(e,t)},_$AL:o=>o._$AL};((s=globalThis.litElementVersions)!==null&&s!==void 0?s:globalThis.litElementVersions=[]).push("3.3.2");export{n as LitElement,u as UpdatingElement,m as _$LE};
/*! Bundled license information:

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=lit-element.js.map