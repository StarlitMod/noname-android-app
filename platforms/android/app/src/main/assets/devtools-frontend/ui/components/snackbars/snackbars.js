import*as t from"../../../core/i18n/i18n.js";import*as s from"../../visual_logging/visual_logging.js";import*as i from"../../legacy/legacy.js";import*as e from"../../lit/lit.js";import"../buttons/buttons.js";var o=`:host{position:fixed;bottom:var(--sys-size-5);left:var(--sys-size-5);z-index:9999;max-width:calc(100% - 2 * var(--sys-size-5));.container{display:flex;align-items:center;overflow:hidden;width:var(--sys-size-31);padding:var(--sys-size-6);background:var(--sys-color-inverse-surface);box-shadow:var(--sys-elevation-level3);border-radius:var(--sys-shape-corner-small);font:var(--sys-typescale-body4-medium);animation:slideIn 100ms cubic-bezier(0,0,0.3,1);box-sizing:border-box;max-width:100%;&.closable{padding:var(--sys-size-5) var(--sys-size-5) var(--sys-size-5) var(--sys-size-6);&.long-action{padding:var(--sys-size-5) var(--sys-size-6) var(--sys-size-6) var(--sys-size-6)}}&.long-action{flex-direction:column;align-items:flex-start;.long-action-container{margin-left:auto}}.label-container{display:flex;width:100%;align-items:center;gap:var(--sys-size-5);.message{width:100%;color:var(--sys-color-inverse-on-surface);flex:1 0 0;text-wrap:pretty;user-select:text}}devtools-button.dismiss{padding:3px}}}@keyframes slideIn{from{transform:translateY(var(--sys-size-5));opacity:0%}to{opacity:100%}}\n/*# sourceURL=${import.meta.resolve("./snackbar.css")} */`;const{html:a}=e,n={dismiss:"Dismiss"},r=t.i18n.registerUIStrings("ui/components/snackbars/Snackbar.ts",n),l=t.i18n.getLocalizedString.bind(void 0,r);class c extends HTMLElement{#t=this.attachShadow({mode:"open"});#s;#i=null;#e=!1;#o;static snackbarQueue=[];get dismissTimeout(){return this.hasAttribute("dismiss-timeout")?Number(this.getAttribute("dismiss-timeout")):5e3}set dismissTimeout(t){this.setAttribute("dismiss-timeout",t.toString())}get message(){return this.getAttribute("message")}set message(t){this.setAttribute("message",t)}get closable(){return this.hasAttribute("closable")}set closable(t){this.toggleAttribute("closable",t)}get actionButtonLabel(){return this.getAttribute("action-button-label")}set actionButtonLabel(t){this.setAttribute("action-button-label",t)}get actionButtonTitle(){return this.getAttribute("action-button-title")}set actionButtonTitle(t){this.setAttribute("action-button-title",t)}set actionButtonClickHandler(t){this.#o=t}constructor(t,s){super(),this.message=t.message,this.#s=s||i.InspectorView.InspectorView.instance().element,t.closable&&(this.closable=t.closable),t.actionProperties&&(this.actionButtonLabel=t.actionProperties.label,this.#o=t.actionProperties.onClick,t.actionProperties.title&&(this.actionButtonTitle=t.actionProperties.title))}static show(t,s){const i=new c(t,s);return c.snackbarQueue.push(i),1===c.snackbarQueue.length&&i.#a(),i}#a(){this.#s.appendChild(this),this.#i&&window.clearTimeout(this.#i),this.closable||(this.#i=window.setTimeout(()=>{this.#n()},this.dismissTimeout))}#n(){if(this.#i&&window.clearTimeout(this.#i),this.remove(),c.snackbarQueue.shift(),c.snackbarQueue.length>0){const t=c.snackbarQueue[0];t&&t.#a()}}#r(t){this.#o&&(t.preventDefault(),this.#o(),this.#n())}connectedCallback(){this.actionButtonLabel&&(this.#e=this.actionButtonLabel.length>15),this.role="alert";const t=e.Directives.classMap({container:!0,"long-action":Boolean(this.#e),closable:Boolean(this.closable)}),i=this.actionButtonLabel?a`<devtools-button
        class="snackbar-button"
        @click=${this.#r}
        jslog=${s.action("snackbar.action").track({click:!0})}
        .variant=${"text"}
        .title=${this.actionButtonTitle??""}
        .inverseColorTheme=${!0}
    >${this.actionButtonLabel}</devtools-button>`:e.nothing,r=this.closable?a`<devtools-button
        class="dismiss snackbar-button"
        @click=${this.#n}
        jslog=${s.action("snackbar.dismiss").track({click:!0})}
        aria-label=${l(n.dismiss)}
        .iconName=${"cross"}
        .variant=${"icon"}
        .title=${l(n.dismiss)}
        .inverseColorTheme=${!0}
    ></devtools-button>`:e.nothing;e.render(a`
        <style>${o}</style>
        <div class=${t}>
            <div class="label-container">
                <div class="message">${this.message}</div>
                ${this.#e?e.nothing:i}
                ${r}
            </div>
            ${this.#e?a`<div class="long-action-container">${i}</div>`:e.nothing}
        </div>
    `,this.#t,{host:this})}}customElements.define("devtools-snackbar",c);var u=Object.freeze({__proto__:null,DEFAULT_AUTO_DISMISS_MS:5e3,Snackbar:c});export{u as Snackbar};
//# sourceMappingURL=snackbars.js.map
