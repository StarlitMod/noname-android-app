import{render as e,html as s,nothing as t}from"../../lit/lit.js";var o=`:host{display:block}.content{background-color:var(--sys-color-cdt-base-container);display:grid;grid-template-columns:min-content 1fr;user-select:text;margin:var(--sys-size-5) 0}.report-title{padding:var(--sys-size-7) var(--sys-size-9);font:var(--sys-typescale-headline4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:1px solid var(--sys-color-divider);color:var(--sys-color-on-surface);background-color:var(--sys-color-cdt-base-container)}\n/*# sourceURL=${import.meta.resolve("./report.css")} */`,r=`:host{margin:var(--sys-size-3) 0 var(--sys-size-3) var(--sys-size-9);min-width:150px}.key{color:var(--sys-color-on-surface-subtle);font:var(--sys-typescale-body5-medium);padding-right:var(--sys-size-6);text-align:left;white-space:pre;user-select:none;line-height:18px}\n/*# sourceURL=${import.meta.resolve("./reportKey.css")} */`,i=`:host{grid-column-start:span 2;min-width:min-content}.section{padding:var(--sys-size-5) var(--sys-size-9);display:flex;flex-direction:row;align-items:center;flex:auto;overflow-wrap:break-word;overflow:hidden}\n/*# sourceURL=${import.meta.resolve("./reportSection.css")} */`,a=`:host{grid-column-start:span 2}:host(.subsection-divider){padding-left:var(--sys-size-9)}.section-divider{margin:var(--sys-size-5) 0;border-bottom:1px solid var(--sys-color-divider)}\n/*# sourceURL=${import.meta.resolve("./reportSectionDivider.css")} */`,l=`:host{grid-column-start:span 2}.section-header{font:var(--sys-typescale-headline5);margin:var(--sys-size-4) 0 var(--sys-size-5) var(--sys-size-9);display:flex;flex-direction:row;align-items:center;flex:auto;text-overflow:ellipsis;overflow:hidden;color:var(--sys-color-on-surface);user-select:none}\n/*# sourceURL=${import.meta.resolve("./reportSectionHeader.css")} */`,n=`:host{margin:var(--sys-size-3) var(--sys-size-9) var(--sys-size-3) var(--sys-size-9);min-width:150px}.value{font:var(--sys-typescale-body4-regular);color:var(--sys-color-on-surface);margin-inline-start:0;padding:0 6px;overflow-wrap:break-word;line-height:18px}\n/*# sourceURL=${import.meta.resolve("./reportValue.css")} */`;class d extends HTMLElement{#e=this.attachShadow({mode:"open"});#s="";set data({reportTitle:e}){this.#s=e,this.#t()}connectedCallback(){this.#t()}#t(){e(s`
      <style>${o}</style>
      ${this.#s?s`<div class="report-title">${this.#s}</div>`:t}
      <div class="content">
        <slot></slot>
      </div>
    `,this.#e,{host:this})}}class c extends HTMLElement{#e=this.attachShadow({mode:"open"});connectedCallback(){this.#t()}#t(){e(s`
      <style>${i}</style>
      <div class="section">
        <slot></slot>
      </div>
    `,this.#e,{host:this})}}class h extends HTMLElement{#e=this.attachShadow({mode:"open"});connectedCallback(){this.#t()}#t(){e(s`
      <style>${l}</style>
      <div class="section-header">
        <slot></slot>
      </div>
    `,this.#e,{host:this})}}class v extends HTMLElement{#e=this.attachShadow({mode:"open"});connectedCallback(){this.#t()}#t(){e(s`
      <style>${a}</style>
      <div class="section-divider">
      </div>
    `,this.#e,{host:this})}}class p extends HTMLElement{#e=this.attachShadow({mode:"open"});connectedCallback(){this.#t()}#t(){e(s`
      <style>${r}</style>
      <div class="key"><slot></slot></div>
    `,this.#e,{host:this})}}class m extends HTMLElement{#e=this.attachShadow({mode:"open"});connectedCallback(){this.#t()}#t(){e(s`
      <style>${n}</style>
      <div class="value"><slot></slot></div>
    `,this.#e,{host:this})}}customElements.define("devtools-report",d),customElements.define("devtools-report-section",c),customElements.define("devtools-report-section-header",h),customElements.define("devtools-report-key",p),customElements.define("devtools-report-value",m),customElements.define("devtools-report-divider",v);var y=Object.freeze({__proto__:null,Report:d,ReportKey:p,ReportSection:c,ReportSectionDivider:v,ReportSectionHeader:h,ReportValue:m});export{y as ReportView};
//# sourceMappingURL=report_view.js.map
