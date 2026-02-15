import*as e from"../../../core/host/host.js";import*as t from"../../../core/i18n/i18n.js";import*as r from"../../../models/persistence/persistence.js";import*as o from"../../../models/text_utils/text_utils.js";import*as i from"../../../models/workspace/workspace.js";import"../../../ui/components/buttons/buttons.js";import*as s from"../../../ui/components/helpers/helpers.js";import*as n from"../../../ui/legacy/legacy.js";import*as a from"../../../ui/lit/lit.js";import*as d from"../../../ui/visual_logging/visual_logging.js";var h=`:host{flex-grow:1;padding:6px}.row{display:flex;flex-direction:row;color:var(--sys-color-token-property-special);font-family:var(--monospace-font-family);font-size:var(--monospace-font-size);align-items:center;line-height:24px}.row devtools-button{line-height:1;margin-left:0.1em}.row devtools-button:nth-of-type(1){margin-left:0.8em}.padded{margin-left:2em}.separator{margin-right:0.5em;color:var(--sys-color-on-surface)}.editable{cursor:text;color:var(--sys-color-on-surface);overflow-wrap:break-word;min-height:18px;line-height:18px;min-width:0.5em;background:transparent;border:none;outline:none;display:inline-block}.editable.red{color:var(--sys-color-token-property-special)}.editable:hover,\n.editable:focus{border:1px solid var(--sys-color-neutral-outline);border-radius:2px}.row .inline-button{opacity:0%;visibility:hidden;transition:opacity 200ms}.row:focus-within .inline-button:not([hidden]),\n.row:hover .inline-button:not([hidden]){opacity:100%;visibility:visible}.center-wrapper{height:100%;display:flex;justify-content:center;align-items:center}.centered{margin:1em;max-width:300px;text-align:center}.error-header{font-weight:bold;margin-bottom:1em}.error-body{line-height:1.5em;color:var(--sys-color-token-subtle)}.add-block{margin-top:3px}.header-name,\n.header-value{min-width:min-content}.link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;padding:0}.learn-more-row{line-height:24px}\n/*# sourceURL=${import.meta.resolve("./HeadersView.css")} */`;const{html:l}=a,c={addHeader:"Add a header",removeHeader:"Remove this header",removeBlock:"Remove this '`ApplyTo`'-section",errorWhenParsing:"Error when parsing ''{PH1}''.",parsingErrorExplainer:"This is most likely due to a syntax error in ''{PH1}''. Try opening this file in an external editor to fix the error or delete the file and re-create the override.",addOverrideRule:"Add override rule",learnMore:"Learn more"},u=t.i18n.registerUIStrings("panels/sources/components/HeadersView.ts",c),m=t.i18n.getLocalizedString.bind(void 0,u),p="header value",v=e=>`header-name-${e}`;class g extends n.View.SimpleView{#e=new b;#t;constructor(e){super({title:t.i18n.lockedString("HeadersView"),viewId:"headers-view",jslog:`${d.pane("headers-view")}`}),this.#t=e,this.#t.addEventListener(i.UISourceCode.Events.WorkingCopyChanged,this.#r,this),this.#t.addEventListener(i.UISourceCode.Events.WorkingCopyCommitted,this.#o,this),this.element.appendChild(this.#e),this.#i()}async#i(){const e=await this.#t.requestContentData();this.#s(o.ContentData.ContentData.textOr(e,""))}#s(e){let t=!1,o=[];e=e||"[]";try{if(o=JSON.parse(e),!o.every(r.NetworkPersistenceManager.isHeaderOverride))throw new Error("Type mismatch after parsing")}catch{console.error("Failed to parse",this.#t.url(),"for locally overriding headers."),t=!0}this.#e.data={headerOverrides:o,uiSourceCode:this.#t,parsingError:t}}#r(){this.#s(this.#t.workingCopy())}#o(){this.#s(this.#t.workingCopy())}getComponent(){return this.#e}dispose(){this.#t.removeEventListener(i.UISourceCode.Events.WorkingCopyChanged,this.#r,this),this.#t.removeEventListener(i.UISourceCode.Events.WorkingCopyCommitted,this.#o,this)}}class b extends HTMLElement{#n=this.attachShadow({mode:"open"});#a=[];#t=null;#d=!1;#h=null;#l="";constructor(){super(),this.#n.addEventListener("focusin",this.#c.bind(this)),this.#n.addEventListener("focusout",this.#u.bind(this)),this.#n.addEventListener("click",this.#m.bind(this)),this.#n.addEventListener("input",this.#p.bind(this)),this.#n.addEventListener("keydown",this.#v.bind(this)),this.#n.addEventListener("paste",this.#g.bind(this)),this.addEventListener("contextmenu",this.#b.bind(this))}set data(e){this.#a=e.headerOverrides,this.#t=e.uiSourceCode,this.#d=e.parsingError,s.ScheduledRender.scheduleRender(this,this.#w)}#v(e){const t=e.target;if(!t.matches(".editable"))return;const r=e;!t.matches(".header-name")||""!==t.innerText||"Enter"!==r.key&&"Tab"!==r.key?"Enter"===r.key?(e.preventDefault(),t.blur(),this.#C(t)):"Escape"===r.key&&(e.consume(),t.innerText=this.#l,t.blur(),this.#x(t)):(e.preventDefault(),t.blur())}#C(e){const t=Array.from(this.#n.querySelectorAll(".editable")),r=t.indexOf(e);-1!==r&&r+1<t.length&&t[r+1].focus()}#y(e){const t=window.getSelection(),r=document.createRange();r.selectNodeContents(e),t?.removeAllRanges(),t?.addRange(r)}#c(e){const t=e.target;t.matches(".editable")&&(this.#y(t),this.#l=t.innerText)}#u(e){const t=e.target;if(""===t.innerText){const e=t.closest(".row"),r=Number(e.dataset.blockIndex),o=Number(e.dataset.headerIndex);t.matches(".apply-to")?(t.innerText="*",this.#a[r].applyTo="*",this.#f()):t.matches(".header-name")&&this.#k(r,o)}const r=window.getSelection();r?.removeAllRanges(),this.#t?.commitWorkingCopy()}#b(e){if(!this.#t)return;const t=new n.ContextMenu.ContextMenu(e);t.appendApplicableItems(this.#t),t.show()}#E(e){const t=new Set(e.map(e=>e.name));let r=1;for(;t.has(v(r));)r++;return v(r)}#m(e){const t=e.target,r=t.closest(".row"),o=Number(r?.dataset.blockIndex||0),i=Number(r?.dataset.headerIndex||0);t.matches(".add-header")?(this.#a[o].headers.splice(i+1,0,{name:this.#E(this.#a[o].headers),value:p}),this.#h={blockIndex:o,headerIndex:i+1},this.#f()):t.matches(".remove-header")?this.#k(o,i):t.matches(".add-block")?(this.#a.push({applyTo:"*",headers:[{name:v(1),value:p}]}),this.#h={blockIndex:this.#a.length-1},this.#f()):t.matches(".remove-block")&&(this.#a.splice(o,1),this.#f())}#S(e,t){return!(0===t&&1===this.#a[e].headers.length&&this.#a[e].headers[t].name===v(1)&&this.#a[e].headers[t].value===p)}#k(e,t){this.#a[e].headers.splice(t,1),0===this.#a[e].headers.length&&this.#a[e].headers.push({name:this.#E(this.#a[e].headers),value:p}),this.#f()}#p(e){this.#x(e.target)}#x(e){const t=e.closest(".row"),r=Number(t.dataset.blockIndex),o=Number(t.dataset.headerIndex);e.matches(".header-name")&&(this.#a[r].headers[o].name=e.innerText,this.#f()),e.matches(".header-value")&&(this.#a[r].headers[o].value=e.innerText,this.#f()),e.matches(".apply-to")&&(this.#a[r].applyTo=e.innerText,this.#f())}#f(){this.#t?.setWorkingCopy(JSON.stringify(this.#a,null,2)),e.userMetrics.actionTaken(e.UserMetrics.Action.HeaderOverrideHeadersFileEdited)}#g(e){const t=e;if(e.preventDefault(),t.clipboardData){const r=t.clipboardData.getData("text/plain"),o=this.#n.getSelection()?.getRangeAt(0);if(!o)return;o.deleteContents();const i=document.createTextNode(r);o.insertNode(i),o.selectNodeContents(i),o.collapse(!1);const s=window.getSelection();s?.removeAllRanges(),s?.addRange(o),this.#x(e.target)}}#w(){if(!s.ScheduledRender.isScheduledRender(this))throw new Error("HeadersView render was not scheduled");if(this.#d){const e=this.#t?.name()||".headers";return void a.render(l`
        <style>${h}</style>
        <div class="center-wrapper">
          <div class="centered">
            <div class="error-header">${m(c.errorWhenParsing,{PH1:e})}</div>
            <div class="error-body">${m(c.parsingErrorExplainer,{PH1:e})}</div>
          </div>
        </div>
      `,this.#n,{host:this})}if(a.render(l`
      <style>${h}</style>
      ${this.#a.map((e,t)=>l`
          ${this.#$(e.applyTo,t)}
          ${e.headers.map((e,r)=>l`
              ${this.#H(e,t,r)}
            `)}
        `)}
      <devtools-button
          .variant=${"outlined"}
          .jslogContext=${"headers-view.add-override-rule"}
          class="add-block">
        ${m(c.addOverrideRule)}
      </devtools-button>
      <div class="learn-more-row">
        <x-link
            href="https://goo.gle/devtools-override"
            class="link"
            jslog=${d.link("learn-more").track({click:!0})}>${m(c.learnMore)}</x-link>
      </div>
    `,this.#n,{host:this}),this.#h){let e=null;e=this.#h.headerIndex?this.#n.querySelector(`[data-block-index="${this.#h.blockIndex}"][data-header-index="${this.#h.headerIndex}"] .header-name`):this.#n.querySelector(`[data-block-index="${this.#h.blockIndex}"] .apply-to`),e&&e.focus(),this.#h=null}}#$(e,r){return l`
      <div class="row" data-block-index=${r}
           jslog=${d.treeItem("*"===e?e:void 0)}>
        <div>${t.i18n.lockedString("Apply to")}</div>
        <div class="separator">:</div>
        ${this.#O(e,"apply-to")}
        <devtools-button
        title=${m(c.removeBlock)}
        .size=${"SMALL"}
        .iconName=${"bin"}
        .iconWidth=${"14px"}
        .iconHeight=${"14px"}
        .variant=${"icon"}
        .jslogContext=${"headers-view.remove-apply-to-section"}
        class="remove-block inline-button"
      ></devtools-button>
      </div>
    `}#H(e,t,r){return l`
      <div class="row padded" data-block-index=${t} data-header-index=${r}
           jslog=${d.treeItem(e.name).parent("headers-editor-row-parent")}>
        ${this.#O(e.name,"header-name red",!0)}
        <div class="separator">:</div>
        ${this.#O(e.value,"header-value")}
        <devtools-button
          title=${m(c.addHeader)}
          .size=${"SMALL"}
          .iconName=${"plus"}
          .variant=${"icon"}
          .jslogContext=${"headers-view.add-header"}
          class="add-header inline-button"
        ></devtools-button>
        <devtools-button
          title=${m(c.removeHeader)}
          .size=${"SMALL"}
          .iconName=${"bin"}
          .variant=${"icon"}
          ?hidden=${!this.#S(t,r)}
          .jslogContext=${"headers-view.remove-header"}
          class="remove-header inline-button"
        ></devtools-button>
      </div>
    `}#O(e,t,r){const o=r?d.key():d.value();return l`<span jslog=${o.track({change:!0,keydown:"Enter|Escape|Tab",click:!0})}
                              contenteditable="true"
                              class="editable ${t}"
                              tabindex="0"
                              .innerText=${a.Directives.live(e)}></span>`}}d.registerParentProvider("headers-editor-row-parent",e=>{for(;e.previousElementSibling?.classList?.contains("padded");)e=e.previousElementSibling;return e.previousElementSibling||void 0}),customElements.define("devtools-sources-headers-view",b);var w=Object.freeze({__proto__:null,HeadersView:g,HeadersViewComponent:b});export{w as HeadersView};
//# sourceMappingURL=components.js.map
