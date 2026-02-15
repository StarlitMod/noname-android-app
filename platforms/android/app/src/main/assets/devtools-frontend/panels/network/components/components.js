import*as e from"../../../core/common/common.js";import*as t from"../../../core/host/host.js";import*as r from"../../../core/i18n/i18n.js";import*as s from"../../../core/sdk/sdk.js";import*as o from"../../../ui/legacy/legacy.js";import*as i from"../../../ui/lit/lit.js";import{render as a,html as n,nothing as d}from"../../../ui/lit/lit.js";import*as l from"../../../ui/visual_logging/visual_logging.js";import*as c from"../../../ui/components/helpers/helpers.js";import*as h from"../../../core/platform/platform.js";import*as u from"../../../third_party/chromium/client-variations/client-variations.js";import"../../../ui/components/buttons/buttons.js";import"../forward/forward.js";import*as p from"../../../models/persistence/persistence.js";import*as v from"../../../models/workspace/workspace.js";import*as m from"../../../ui/components/input/input.js";import*as g from"../../../ui/components/legacy_wrapper/legacy_wrapper.js";import*as f from"../../../ui/components/render_coordinator/render_coordinator.js";import*as w from"../../sources/sources.js";import*as y from"../../../models/issues_manager/issues_manager.js";import*as k from"../../../models/text_utils/text_utils.js";import"../../../ui/components/report_view/report_view.js";import"../../../ui/components/icon_button/icon_button.js";var S=`.header{background-color:var(--sys-color-surface1);border-bottom:1px solid var(--sys-color-divider);border-top:1px solid var(--sys-color-divider);line-height:25px;padding:0 5px}.header::marker{font-size:11px;line-height:1}.header:focus{background-color:var(--sys-color-state-header-hover)}details[open] .header-count{display:none}details .hide-when-closed{display:none}details[open] .hide-when-closed{display:block}details summary input{vertical-align:middle}.row{display:flex;line-height:18px;padding-left:8px;gap:var(--sys-size-6);user-select:text;margin:var(--sys-size-3) 0}div.raw-headers-row{display:block}.row:first-of-type{margin-top:var(--sys-size-5)}.row:last-child{margin-bottom:var(--sys-size-5)}.header-name{color:var(--sys-color-on-surface-subtle);font:var(--sys-typescale-body5-medium);width:30%;min-width:160px;max-width:240px;flex-shrink:0;text-transform:capitalize}.header-value{word-break:break-all;display:flex;align-items:center;gap:2px;font:var(--sys-typescale-body4-regular)}.header-name,\n.header-value{&::selection{color:var(--sys-color-on-tonal-container);background-color:var(--sys-color-tonal-container)}}.green-circle::before,\n.red-circle::before,\n.yellow-circle::before{content:"";display:inline-block;width:12px;height:12px;border-radius:6px;vertical-align:text-top;margin-right:2px}.green-circle::before{background-color:var(--sys-color-green-bright)}.red-circle::before{background-color:var(--sys-color-error-bright)}.yellow-circle::before{background-color:var(--issue-color-yellow)}.status-with-comment{color:var(--sys-color-token-subtle)}.raw-headers{font-family:var(--source-code-font-family);font-size:var(--source-code-font-size);white-space:pre-wrap;word-break:break-all}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}.inline-icon{vertical-align:middle}.header-grid-container{display:inline-grid;grid-template-columns:156px 50px 1fr;gap:4px;width:calc(100% - 15px)}.header-grid-container div:last-child{text-align:right}.header .devtools-link{color:var(--sys-color-on-surface)}x-link{position:relative}x-link .inline-icon{padding-right:3px}.purple.dot::before{background-color:var(--sys-color-purple-bright);content:var(--image-file-empty);width:6px;height:6px;border-radius:50%;outline:1px solid var(--icon-gap-toolbar);left:9px;position:absolute;top:11px;z-index:1}summary label{display:inline-flex;align-items:center;vertical-align:middle;gap:var(--sys-size-3)}summary devtools-checkbox{margin-top:1px}\n/*# sourceURL=${import.meta.resolve("./RequestHeadersView.css")} */`;const{render:b,html:E}=i,x={general:"General",options:"Options",openInfo:"Open Info",type:"DirectSocket Type",errorMessage:"Error message",status:"Status",directSocketTypeTcp:"TCP",directSocketTypeUdpConnected:"UDP (connected)",directSocketTypeUdpBound:"UDP (bound)",directSocketStatusOpening:"Opening",directSocketStatusOpen:"Open",directSocketStatusClosed:"Closed",directSocketStatusAborted:"Aborted"},R=r.i18n.registerUIStrings("panels/network/components/DirectSocketConnectionView.ts",x),H=r.i18n.getLocalizedString.bind(void 0,R);const $="general",q="options",C="open-info",T=(e,t,a)=>{function n(t,r,s){return E`
        <details
          class="direct-socket-category"
          ?open=${function(t){return e.openCategories.includes(t)}(t)}
          @toggle=${r=>e.onToggleCategory(r,t)}
          jslog=${l.sectionHeader(t).track({click:!0})}
          aria-label=${r}
        >
          <summary
            class="header"
            @keydown=${r=>e.onSummaryKeyDown(r,t)}
          >
            <div class="header-grid-container">
              <div>
                ${r}
              </div>
              <div class="hide-when-closed"></div>
            </div>
          </summary>
          ${s}
        </details>
      `}function d(t,r,s){return r?E`
        <div class="row">
          <div class="header-name">${t}:</div>
          <div
            class="header-value ${s?.join(" ")}"
            @copy=${()=>e.onCopyRow()}
          >${r}</div>
        </div>
      `:i.nothing}const c=e.socketInfo,h=E`
      <div jslog=${l.section($)}>
        ${d(H(x.type),function(e){switch(e){case s.NetworkRequest.DirectSocketType.TCP:return H(x.directSocketTypeTcp);case s.NetworkRequest.DirectSocketType.UDP_BOUND:return H(x.directSocketTypeUdpBound);case s.NetworkRequest.DirectSocketType.UDP_CONNECTED:return H(x.directSocketTypeUdpConnected)}}(c.type))}
        ${d(H(x.status),function(e){switch(e){case s.NetworkRequest.DirectSocketStatus.OPENING:return H(x.directSocketStatusOpening);case s.NetworkRequest.DirectSocketStatus.OPEN:return H(x.directSocketStatusOpen);case s.NetworkRequest.DirectSocketStatus.CLOSED:return H(x.directSocketStatusClosed);case s.NetworkRequest.DirectSocketStatus.ABORTED:return H(x.directSocketStatusAborted)}}(c.status))}
        ${d(H(x.errorMessage),c.errorMessage)}
      </div>`,u=E`
      <div jslog=${l.section(q)}>
        ${d(r.i18n.lockedString("remoteAddress"),c.createOptions.remoteAddr)}
        ${d(r.i18n.lockedString("remotePort"),c.createOptions.remotePort?.toString(10))}
        ${d(r.i18n.lockedString("localAddress"),c.createOptions.localAddr)}
        ${d(r.i18n.lockedString("localPort"),c.createOptions.localPort?.toString(10))}
        ${d(r.i18n.lockedString("noDelay"),c.createOptions.noDelay?.toString())}
        ${d(r.i18n.lockedString("keepAliveDelay"),c.createOptions.keepAliveDelay?.toString(10))}
        ${d(r.i18n.lockedString("sendBufferSize"),c.createOptions.sendBufferSize?.toString(10))}
        ${d(r.i18n.lockedString("receiveBufferSize"),c.createOptions.receiveBufferSize?.toString(10))}
        ${d(r.i18n.lockedString("dnsQueryType"),c.createOptions.dnsQueryType)}
      </div>`;let p=i.nothing;c.openInfo&&(p=E`
          <div jslog=${l.section(C)}>
            ${d(r.i18n.lockedString("remoteAddress"),c.openInfo.remoteAddr)}
            ${d(r.i18n.lockedString("remotePort"),c.openInfo?.remotePort?.toString(10))}
            ${d(r.i18n.lockedString("localAddress"),c.openInfo.localAddr)}
            ${d(r.i18n.lockedString("localPort"),c.openInfo?.localPort?.toString(10))}
          </div>`),b(E`
    <style>${o.inspectorCommonStyles}</style>
    <style>${S}</style>
    ${n($,H(x.general),h)}
    ${n(q,H(x.options),u)}
    ${c.openInfo?n(C,H(x.openInfo),p):i.nothing}
  `,a)};class O extends o.Widget.Widget{#e;#t;constructor(e,t=T){super({jslog:`${l.pane("connection-info").track({resize:!0})}`,useShadowDom:!0}),this.#e=e,this.#t=t,this.performUpdate()}wasShown(){super.wasShown(),this.#e.addEventListener(s.NetworkRequest.Events.TIMING_CHANGED,this.requestUpdate,this)}willHide(){super.willHide(),this.#e.removeEventListener(s.NetworkRequest.Events.TIMING_CHANGED,this.requestUpdate,this)}performUpdate(){if(!this.#e||!this.#e.directSocketInfo)return;const e=[$,q,C].filter(e=>this.#r(e).get(),this),r={socketInfo:this.#e.directSocketInfo,openCategories:e,onSummaryKeyDown:(e,t)=>{if(!e.target)return;const r=e.target.parentElement;if(!r)throw new Error("<details> element is not found for a <summary> element");let s;switch(e.key){case"ArrowLeft":s=!1;break;case"ArrowRight":s=!0;break;default:return}r.open!==s&&this.#s(t,s)},onToggleCategory:(e,t)=>{const r=e.target;this.#s(t,r.open)},onCopyRow:()=>{t.userMetrics.actionTaken(t.UserMetrics.Action.NetworkPanelCopyValue)}};this.#t(r,void 0,this.contentElement)}#s(e,t){this.#r(e).set(t),this.requestUpdate()}#r(t){return e.Settings.Settings.instance().createSetting(`connection-info-${t}-category-expanded`,!0)}}var D=Object.freeze({__proto__:null,CATEGORY_NAME_GENERAL:$,CATEGORY_NAME_OPEN_INFO:C,CATEGORY_NAME_OPTIONS:q,DEFAULT_VIEW:T,DirectSocketConnectionView:O}),A=`:host{display:inline}.editable{cursor:text;overflow-wrap:anywhere;min-height:18px;line-height:18px;min-width:0.5em;background:transparent;border:none;border-radius:4px;outline:none;display:inline-block;font-family:var(--monospace-font-family);font-size:var(--monospace-font-size);&:hover{border:1px solid var(--sys-color-neutral-outline)}&:focus{border:1px solid var(--sys-color-state-focus-ring)}}.editable::selection{color:var(--sys-color-on-tonal-container);background-color:var(--sys-color-tonal-container)}\n/*# sourceURL=${import.meta.resolve("./EditableSpan.css")} */`;class N extends HTMLElement{#o=this.attachShadow({mode:"open"});#i="";connectedCallback(){this.#o.addEventListener("focusin",this.#a.bind(this)),this.#o.addEventListener("keydown",this.#n.bind(this)),this.#o.addEventListener("input",this.#d.bind(this))}set data(e){this.#i=e.value,c.ScheduledRender.scheduleRender(this,this.#l)}get value(){return this.#o.querySelector("span")?.innerText||""}set value(e){this.#i=e;const t=this.#o.querySelector("span");t&&(t.innerText=e)}#n(e){"Enter"===e.key&&(e.preventDefault(),e.target?.blur())}#d(e){this.#i=e.target.innerText}#a(e){const t=e.target,r=window.getSelection(),s=document.createRange();s.selectNodeContents(t),r?.removeAllRanges(),r?.addRange(s)}#l(){if(!c.ScheduledRender.isScheduledRender(this))throw new Error("HeaderSectionRow render was not scheduled");a(n`
      <style>${A}</style>
      <span
        contenteditable="plaintext-only"
        class="editable"
        tabindex="0"
        .innerText=${this.#i}
        jslog=${l.value("header-editor").track({change:!0,keydown:"Enter|Escape"})}
      </span>`,this.#o,{host:this})}focus(){requestAnimationFrame(()=>{const e=this.#o.querySelector(".editable");e?.focus()})}}customElements.define("devtools-editable-span",N);var I=Object.freeze({__proto__:null,EditableSpan:N}),L=`:host{display:block}.row{display:flex;line-height:18px;padding-left:8px;gap:var(--sys-size-6);user-select:text;margin:var(--sys-size-3) 0}.row.header-editable{font-family:var(--monospace-font-family);font-size:var(--monospace-font-size)}.header-name{font:var(--sys-typescale-body5-medium);color:var(--sys-color-on-surface-subtle);width:30%;min-width:160px;max-width:240px;flex-shrink:0;text-transform:capitalize;overflow-wrap:break-word}.header-name,\n.header-value{&::selection{color:var(--sys-color-on-tonal-container);background-color:var(--sys-color-tonal-container)}}.header-name.pseudo-header{text-transform:none}.header-editable .header-name{color:var(--sys-color-token-property-special)}.row.header-deleted .header-name{color:var(--sys-color-token-subtle)}.header-value{display:flex;overflow-wrap:anywhere;margin-inline-end:14px;font:var(--sys-typescale-body4-regular)}.header-badge-text{font-variant:small-caps;font-weight:500;white-space:pre-wrap;word-break:break-all;text-transform:none}.header-badge{display:inline;background-color:var(--sys-color-error);color:var(--sys-color-on-error);border-radius:100vh;padding-left:6px;padding-right:6px}.call-to-action{background-color:var(--sys-color-neutral-container);padding:8px;border-radius:5px;margin:4px}.call-to-action-body{padding:6px 0;margin-left:9.5px;border-left:2px solid var(--issue-color-yellow);padding-left:18px;line-height:20px}.call-to-action .explanation{font-weight:bold}.call-to-action code{font-size:90%}.call-to-action .example .comment::before{content:" — "}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}.explanation .link{font-weight:normal}.inline-icon{vertical-align:middle}.row-flex-icon{margin:2px 5px 0}.header-value code{display:block;white-space:pre-wrap;font-size:90%;color:var(--sys-color-token-subtle)}x-link .inline-icon{padding-right:3px}.header-highlight{background-color:var(--sys-color-yellow-container)}.header-warning{color:var(--sys-color-error)}.header-overridden{background-color:var(--sys-color-tertiary-container);border-left:3px solid var(--sys-color-tertiary);padding-left:5px}.header-deleted{background-color:var(--sys-color-surface-error);border-left:3px solid var(--sys-color-error-bright);color:var(--sys-color-token-subtle);text-decoration:line-through}.header-highlight.header-overridden{background-color:var(--sys-color-yellow-container);border-left:3px solid var(--sys-color-tertiary);padding-left:5px}.inline-button{vertical-align:middle}.row .inline-button{opacity:0%;visibility:hidden;transition:opacity 200ms;padding-left:2px}.row.header-overridden:focus-within .inline-button,\n.row.header-overridden:hover .inline-button{opacity:100%;visibility:visible}.row:hover .inline-button.enable-editing{opacity:100%;visibility:visible}.flex-right{margin-left:auto}.flex-columns{flex-direction:column}\n/*# sourceURL=${import.meta.resolve("./HeaderSectionRow.css")} */`;const{render:U,html:P}=i,_={activeClientExperimentVariation:"Active `client experiment variation IDs`.",activeClientExperimentVariationIds:"Active `client experiment variation IDs` that trigger server-side behavior.",decoded:"Decoded:",editHeader:"Override header",headerNamesOnlyLetters:"Header names should contain only letters, digits, hyphens or underscores",learnMore:"Learn more",learnMoreInTheIssuesTab:"Learn more in the issues tab",reloadPrompt:"Refresh the page/request for these changes to take effect",removeOverride:"Remove this header override"},V=r.i18n.registerUIStrings("panels/network/components/HeaderSectionRow.ts",_),M=r.i18n.getLocalizedString.bind(void 0,V),F=e=>/^[a-z0-9_\-]+$/i.test(e),j=(e,t)=>e?.replaceAll(/\s/g," ")===t?.replaceAll(/\s/g," ");class z extends Event{static eventName="headeredited";headerName;headerValue;constructor(e,t){super(z.eventName,{}),this.headerName=e,this.headerValue=t}}class W extends Event{static eventName="headerremoved";headerName;headerValue;constructor(e,t){super(W.eventName,{}),this.headerName=e,this.headerValue=t}}class G extends Event{static eventName="enableheaderediting";constructor(){super(G.eventName,{})}}class B extends HTMLElement{#o=this.attachShadow({mode:"open"});#c=null;#h=!1;#u=!0;set data(e){this.#c=e.header,this.#h=void 0!==this.#c.originalValue&&this.#c.value!==this.#c.originalValue,this.#u=F(this.#c.name),c.ScheduledRender.scheduleRender(this,this.#l)}#l(){if(!c.ScheduledRender.isScheduledRender(this))throw new Error("HeaderSectionRow render was not scheduled");if(!this.#c)return;const e=i.Directives.classMap({row:!0,"header-highlight":Boolean(this.#c.highlight),"header-overridden":Boolean(this.#c.isOverride)||this.#h,"header-editable":1===this.#c.valueEditable,"header-deleted":Boolean(this.#c.isDeleted)}),s=i.Directives.classMap({"header-name":!0,"pseudo-header":this.#c.name.startsWith(":")}),o=i.Directives.classMap({"header-value":!0,"header-warning":Boolean(this.#c.headerValueIncorrect),"flex-columns":"x-client-data"===this.#c.name&&!this.#c.isResponseHeader}),a=this.#c.nameEditable&&1===this.#c.valueEditable,n=this.#c.nameEditable||this.#c.isDeleted||this.#h;U(P`
      <style>${L}</style>
      <div class=${e}>
        <div class=${s}>
          ${this.#c.headerNotSet?P`<div class="header-badge header-badge-text">${r.i18n.lockedString("not-set")}</div> `:i.nothing}
          ${a&&!this.#u?P`<devtools-icon class="inline-icon disallowed-characters medium" title=${_.headerNamesOnlyLetters} name='cross-circle-filled'>
            </devtools-icon>`:i.nothing}
          ${a&&!this.#c.isDeleted?P`<devtools-editable-span
              @focusout=${this.#p}
              @keydown=${this.#n}
              @input=${this.#v}
              @paste=${this.#m}
              .data=${{value:this.#c.name}}
            ></devtools-editable-span>`:this.#c.name}
        </div>
        <div
          class=${o}
          @copy=${()=>t.userMetrics.actionTaken(t.UserMetrics.Action.NetworkPanelCopyValue)}
        >
          ${this.#g()}
        </div>
        ${n?P`<devtools-icon name="info" class="row-flex-icon flex-right medium" title=${_.reloadPrompt}>
          </devtools-icon>`:i.nothing}
      </div>
      ${this.#f(this.#c.blockedDetails)}
    `,this.#o,{host:this}),this.#c.highlight&&this.scrollIntoView({behavior:"auto"})}#g(){if(!this.#c)return i.nothing;if("x-client-data"===this.#c.name&&!this.#c.isResponseHeader)return this.#w(this.#c);if(this.#c.isDeleted||1!==this.#c.valueEditable){const e=this.#c.isResponseHeader&&!this.#c.isDeleted&&2!==this.#c.valueEditable;return P`
      ${this.#c.value||""}
      ${this.#y(this.#c)}
      ${e?P`
        <devtools-button
          title=${M(_.editHeader)}
          .size=${"SMALL"}
          .iconName=${"edit"}
          .variant=${"icon"}
          @click=${()=>{this.dispatchEvent(new G)}}
          jslog=${l.action("enable-header-overrides").track({click:!0})}
          class="enable-editing inline-button"
        ></devtools-button>
      `:i.nothing}
    `}return P`
      <devtools-editable-span
        @focusout=${this.#k}
        @input=${this.#S}
        @paste=${this.#S}
        @keydown=${this.#n}
        .data=${{value:this.#c.value||""}}
      ></devtools-editable-span>
      ${this.#y(this.#c)}
      <devtools-button
        title=${M(_.removeOverride)}
        .size=${"SMALL"}
        .iconName=${"bin"}
        .variant=${"icon"}
        class="remove-header inline-button"
        @click=${this.#b}
        jslog=${l.action("remove-header-override").track({click:!0})}
      ></devtools-button>
    `}#w(e){const t=u.parseClientVariations(e.value||""),r=u.formatClientVariations(t,M(_.activeClientExperimentVariation),M(_.activeClientExperimentVariationIds));return P`
      <div>${e.value||""}</div>
      <div>${M(_.decoded)}</div>
      <code>${r}</code>
    `}focus(){requestAnimationFrame(()=>{const e=this.#o.querySelector(".header-name devtools-editable-span");e?.focus()})}#y(e){if("set-cookie"===e.name&&e.setCookieBlockedReasons){const t=e.setCookieBlockedReasons.map(s.NetworkRequest.setCookieBlockedReasonToUiString).join("\n");return P`
        <devtools-icon class="row-flex-icon medium" title=${t} name='warning-filled'>
        </devtools-icon>
      `}return i.nothing}#f(e){return e?P`
      <div class="call-to-action">
        <div class="call-to-action-body">
          <div class="explanation">${e.explanation()}</div>
          ${e.examples.map(e=>P`
            <div class="example">
              <code>${e.codeSnippet}</code> ${e.comment?P`<span class="comment"> ${e.comment()}</span>`:""}
           </div>`)} ${this.#E(e)}
        </div>
      </div>
    `:i.nothing}#E(e){return e?.reveal?P`
        <div class="devtools-link" @click=${e.reveal}>
          <devtools-icon name="issue-exclamation-filled" class="inline-icon medium">
          </devtools-icon
          >${M(_.learnMoreInTheIssuesTab)}
        </div>
      `:e?.link?P`
        <x-link href=${e.link.url} class="link">
          <devtools-icon name="open-externally" class="inline-icon extra-large" style="color: var(--icon-link);">
          </devtools-icon
          >${M(_.learnMore)}
        </x-link>
      `:i.nothing}#k(e){const t=e.target;if(!this.#c)return;const r=t.value.trim();j(r,this.#c.value?.trim())||(this.#c.value=r,this.dispatchEvent(new z(this.#c.name,r)),c.ScheduledRender.scheduleRender(this,this.#l));const s=window.getSelection();s?.removeAllRanges(),this.#c.originalName=""}#p(e){const t=e.target;if(!this.#c)return;const r=h.StringUtilities.toLowerCaseString(t.value.trim());""===r?t.value=this.#c.name:j(r,this.#c.name.trim())||(this.#c.name=r,this.dispatchEvent(new z(r,this.#c.value||"")),c.ScheduledRender.scheduleRender(this,this.#l));const s=window.getSelection();s?.removeAllRanges()}#b(){if(!this.#c)return;const e=this.#o.querySelector(".header-value devtools-editable-span");this.#c.originalValue&&(e.value=this.#c?.originalValue),this.dispatchEvent(new W(this.#c.name,this.#c.value||""))}#n(e){const t=e.target;if("Escape"===e.key){if(e.consume(),t.matches(".header-name devtools-editable-span"))t.value=this.#c?.name||"",this.#v(e);else if(t.matches(".header-value devtools-editable-span")&&(t.value=this.#c?.value||"",this.#S(e),this.#c?.originalName)){const e=this.#o.querySelector(".header-name devtools-editable-span");return e.value=this.#c.originalName,this.#c.originalName="",e.dispatchEvent(new Event("input")),void e.focus()}t.blur()}}#v(e){const t=e.target,r=F(t.value);this.#u!==r&&(this.#u=r,c.ScheduledRender.scheduleRender(this,this.#l))}#S(e){const t=e.target,r=void 0!==this.#c?.originalValue&&!j(this.#c?.originalValue||"",t.value);this.#h!==r&&(this.#h=r,this.#c&&(this.#c.highlight=!1),c.ScheduledRender.scheduleRender(this,this.#l))}#m(e){if(!e.clipboardData)return;const t=e.target,r=e.clipboardData.getData("text/plain")||"",s=r.indexOf(":");if(s<1)return t.value=r,e.preventDefault(),void t.dispatchEvent(new Event("input",{bubbles:!0}));this.#c&&(this.#c.originalName=this.#c.name);const o=r.substring(s+1,r.length).trim(),i=r.substring(0,s);t.value=i,t.dispatchEvent(new Event("input"));const a=this.#o.querySelector(".header-value devtools-editable-span");a&&(a.focus(),a.value=o,a.dispatchEvent(new Event("input"))),e.preventDefault()}}customElements.define("devtools-header-section-row",B);var K=Object.freeze({__proto__:null,EnableHeaderEditingEvent:G,HeaderEditedEvent:z,HeaderRemovedEvent:W,HeaderSectionRow:B,compareHeaders:j,isValidHeaderName:F}),Y=`:host{display:block}devtools-header-section-row:last-of-type{margin-bottom:10px}devtools-header-section-row:first-of-type{margin-top:2px}.call-to-action{background-color:var(--sys-color-neutral-container);padding:8px;border-radius:5px;margin:4px}.call-to-action-body{padding:6px 0;margin-left:9.5px;border-left:2px solid var(--issue-color-yellow);padding-left:18px;line-height:20px}.call-to-action .explanation{font-weight:bold}.call-to-action code{font-size:90%}.call-to-action .example .comment::before{content:" — "}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}.explanation .link{font-weight:normal}.inline-icon{vertical-align:middle}@media (forced-colors: active){.link,\n  .devtools-link{color:linktext;text-decoration-color:linktext}}\n/*# sourceURL=${import.meta.resolve("./RequestHeaderSection.css")} */`;const{render:Q,html:J}=i,X={learnMore:"Learn more",provisionalHeadersAreShownDisableCache:"Provisional headers are shown. Disable cache to see full headers.",onlyProvisionalHeadersAre:"Only provisional headers are available because this request was not sent over the network and instead was served from a local cache, which doesn’t store the original request headers. Disable cache to see full request headers.",provisionalHeadersAreShown:"Provisional headers are shown."},Z=r.i18n.registerUIStrings("panels/network/components/RequestHeaderSection.ts",X),ee=r.i18n.getLocalizedString.bind(void 0,Z);class te extends HTMLElement{#o=this.attachShadow({mode:"open"});#e;#x=[];set data(e){this.#e=e.request,this.#x=this.#e.requestHeaders().map(e=>({name:h.StringUtilities.toLowerCaseString(e.name),value:e.value,valueEditable:2})),this.#x.sort((e,t)=>h.StringUtilities.compare(e.name,t.name)),"Request"===e.toReveal?.section&&this.#x.filter(t=>t.name===e.toReveal?.header?.toLowerCase()).forEach(e=>{e.highlight=!0}),this.#l()}#l(){this.#e&&Q(J`
      <style>${Y}</style>
      ${this.#R()}
      ${this.#x.map(e=>J`
        <devtools-header-section-row
          .data=${{header:e}}
          jslog=${l.item("request-header")}
        ></devtools-header-section-row>
      `)}
    `,this.#o,{host:this})}#R(){if(!this.#e||void 0!==this.#e.requestHeadersText())return i.nothing;let e,t="";return this.#e.cachedInMemory()||this.#e.cached()?(e=ee(X.provisionalHeadersAreShownDisableCache),t=ee(X.onlyProvisionalHeadersAre)):e=ee(X.provisionalHeadersAreShown),J`
      <div class="call-to-action">
        <div class="call-to-action-body">
          <div class="explanation" title=${t}>
            <devtools-icon class="inline-icon medium" name='warning-filled'>
            </devtools-icon>
            ${e} <x-link href="https://developer.chrome.com/docs/devtools/network/reference/#provisional-headers" class="link">${ee(X.learnMore)}</x-link>
          </div>
        </div>
      </div>
    `}}customElements.define("devtools-request-header-section",te);var re=Object.freeze({__proto__:null,RequestHeaderSection:te}),se=`:host{display:block}devtools-header-section-row:last-of-type{margin-bottom:var(--sys-size-5)}devtools-header-section-row:first-of-type{margin-top:var(--sys-size-5)}.add-header-button{margin:-4px 0 10px 5px}\n/*# sourceURL=${import.meta.resolve("./ResponseHeaderSection.css")} */`;const oe={addHeader:"Add header",chooseThisOptionIfTheResourceAnd:"Choose this option if the resource and the document are served from the same site.",onlyChooseThisOptionIfAn:"Only choose this option if an arbitrary website including this resource does not impose a security risk.",thisDocumentWasBlockedFrom:"The document was blocked from loading in a popup opened by a sandboxed iframe because this document specified a cross-origin opener policy.",toEmbedThisFrameInYourDocument:"To embed this frame in your document, the response needs to enable the cross-origin embedder policy by specifying the following response header:",toUseThisResourceFromADifferent:"To use this resource from a different origin, the server needs to specify a cross-origin resource policy in the response headers:",toUseThisResourceFromADifferentOrigin:"To use this resource from a different origin, the server may relax the cross-origin resource policy response header:",toUseThisResourceFromADifferentSite:"To use this resource from a different site, the server may relax the cross-origin resource policy response header:"},ie=r.i18n.registerUIStrings("panels/network/components/ResponseHeaderSection.ts",oe),ae=r.i18n.getLocalizedString.bind(void 0,ie),ne=r.i18n.getLazilyComputedLocalizedString.bind(void 0,ie),de="ResponseHeaderSection";class le extends HTMLElement{shadow=this.attachShadow({mode:"open"});headerDetails=[];setHeaders(e){e.sort(function(e,t){return h.StringUtilities.compare(e.name.toLowerCase(),t.name.toLowerCase())}),this.headerDetails=e.map(e=>({name:h.StringUtilities.toLowerCaseString(e.name),value:e.value.replace(/\s/g," ")}))}highlightHeaders(e){"Response"===e.toReveal?.section&&this.headerDetails.filter(t=>j(t.name,e.toReveal?.header?.toLowerCase())).forEach(e=>{e.highlight=!0})}}class ce extends le{#e;set data(e){this.#e=e.request,this.setHeaders(this.#e.earlyHintsHeaders),this.highlightHeaders(e),this.#l()}#l(){this.#e&&a(n`
      <style>${se}</style>
      ${this.headerDetails.map(e=>n`
        <devtools-header-section-row .data=${{header:e}}></devtools-header-section-row>
      `)}
    `,this.shadow,{host:this})}}customElements.define("devtools-early-hints-header-section",ce);class he extends le{#e;#H=[];#$=null;#q=[];#C=0;set data(e){this.#e=e.request,this.#C=p.NetworkPersistenceManager.NetworkPersistenceManager.isForbiddenNetworkUrl(this.#e.url())?2:0;const r=this.#e.sortedResponseHeaders.concat(this.#e.setCookieHeaders);this.setHeaders(r);const s=[];if(this.#e.wasBlocked()){const e=ue.get(this.#e.blockedReason());if(e){if(y.RelatedIssue.hasIssueOfCategory(this.#e,"CrossOriginEmbedderPolicy")){const r=()=>{t.userMetrics.issuesPanelOpenedFrom(1),this.#e&&y.RelatedIssue.reveal(this.#e,"CrossOriginEmbedderPolicy")};e.blockedDetails&&(e.blockedDetails.reveal=r)}s.push(e)}}this.headerDetails=function(e,t){let r=0,s=0;const o=[];for(;r<e.length&&s<t.length;)e[r].name<t[s].name?o.push({...e[r++],headerNotSet:!1}):e[r].name>t[s].name?o.push({...t[s++],headerNotSet:!0}):o.push({...t[s++],...e[r++],headerNotSet:!1});for(;r<e.length;)o.push({...e[r++],headerNotSet:!1});for(;s<t.length;)o.push({...t[s++],headerNotSet:!0});return o}(this.headerDetails,s);const o=this.#e.blockedResponseCookies(),i=new Map(o?.map(e=>[e.cookieLine.replace(/\s/g," "),e.blockedReasons]));for(const e of this.headerDetails)if("set-cookie"===e.name&&e.value){const t=i.get(e.value);t&&(e.setCookieBlockedReasons=t)}this.highlightHeaders(e);const a=this.#e.getAssociatedData(de);a?this.#H=a:(this.#H=this.headerDetails.map(e=>({name:e.name,value:e.value,originalValue:e.value,valueEditable:this.#C})),this.#T()),this.#O(),this.#e.setAssociatedData(de,this.#H),this.#l()}#D(){this.#e&&(this.#C=p.NetworkPersistenceManager.NetworkPersistenceManager.isForbiddenNetworkUrl(this.#e.url())?2:0,this.#H=this.headerDetails.map(e=>({name:e.name,value:e.value,originalValue:e.value,valueEditable:this.#C})),this.#T(),this.#e.setAssociatedData(de,this.#H))}async#O(){if(this.#e){if(this.#$=p.NetworkPersistenceManager.NetworkPersistenceManager.instance().getHeadersUISourceCodeFromUrl(this.#e.url()),!this.#$)return this.#D(),void this.#l();try{const t=await this.#$.requestContentData().then(k.ContentData.ContentData.contentDataOrEmpty);if(this.#q=JSON.parse(t.text||"[]"),!this.#q.every(p.NetworkPersistenceManager.isHeaderOverride))throw new Error("Type mismatch after parsing");e.Settings.Settings.instance().moduleSetting("persistence-network-overrides-enabled").get()&&0===this.#C&&(this.#C=1);for(const e of this.#H)e.valueEditable=this.#C}catch{console.error("Failed to parse",this.#$?.url()||"source code file","for locally overriding headers."),this.#D()}finally{this.#l()}}}#T(){if(!this.#e||0===this.#e.originalResponseHeaders.length)return;const e=this.#e.originalResponseHeaders.map(e=>({name:h.StringUtilities.toLowerCaseString(e.name),value:e.value.replace(/\s/g," ")}));e.sort(function(e,t){return h.StringUtilities.compare(e.name,t.name)});let t=0,r=0;for(;t<this.headerDetails.length;){const s=this.headerDetails[t].name;let o=this.headerDetails[t].value||"";const i=this.headerDetails[t].headerNotSet;for(;t<this.headerDetails.length-1&&this.headerDetails[t+1].name===s;)t++,o+=`, ${this.headerDetails[t].value}`;for(;r<e.length&&e[r].name<s;)r++;if(r<e.length&&e[r].name===s){let t=e[r].value;for(;r<e.length-1&&e[r+1].name===s;)r++,t+=`, ${e[r].value}`;r++,"set-cookie"===s||i||j(o,t)||this.#H.filter(e=>j(e.name,s)).forEach(e=>{e.isOverride=!0})}else"set-cookie"===s||i||this.#H.filter(e=>j(e.name,s)).forEach(e=>{e.isOverride=!0});t++}this.#H.filter(e=>"set-cookie"===e.name).forEach(e=>{void 0===this.#e?.originalResponseHeaders.find(t=>"set-cookie"===h.StringUtilities.toLowerCaseString(t.name)&&j(t.value,e.value))&&(e.isOverride=!0)})}#A(e){const r=e.target;if(void 0===r.dataset.index)return;const s=Number(r.dataset.index);F(e.headerName)&&(this.#N(e.headerName,e.headerValue,s),t.userMetrics.actionTaken(t.UserMetrics.Action.HeaderOverrideHeaderEdited))}#I(t){const r=p.NetworkPersistenceManager.NetworkPersistenceManager.instance().rawPathFromUrl(t,!0),s=r.lastIndexOf("/");return e.ParsedURL.ParsedURL.substring(r,s+1)}#L(){this.#$?.setWorkingCopy(JSON.stringify(this.#q,null,2)),this.#$?.commitWorkingCopy()}#U(e,t,r){for(let s=this.#q.length-1;s>=0;s--){const o=this.#q[s];if(o.applyTo!==e)continue;const i=o.headers.findIndex(e=>j(e.name,t)&&j(e.value,r));if(!(i<0))return o.headers.splice(i,1),void(0===o.headers.length&&this.#q.splice(s,1))}}#P(e){const r=e.target;if(void 0===r.dataset.index||!this.#e)return;const s=Number(r.dataset.index),o=this.#I(this.#e.url());this.#U(o,e.headerName,e.headerValue),this.#L(),this.#H[s].isDeleted=!0,this.#l(),t.userMetrics.actionTaken(t.UserMetrics.Action.HeaderOverrideHeaderRemoved)}#N(e,t,r){if(!this.#e)return;0===this.#e.originalResponseHeaders.length&&(this.#e.originalResponseHeaders=this.#e.sortedResponseHeaders.map(e=>({...e})));const s=this.#H[r].name,o=this.#H[r].value;this.#H[r].name=e,this.#H[r].value=t;let i=[];"set-cookie"===e?i.push({name:e,value:t,valueEditable:this.#C}):i=this.#H.filter(t=>j(t.name,e)&&(!j(t.value,t.originalValue)||t.isOverride));const a=this.#I(this.#e.url());let n=null;const[d]=this.#q.slice(-1);if(d?.applyTo===a?n=d:(n={applyTo:a,headers:[]},this.#q.push(n)),"set-cookie"===e){const e=n.headers.findIndex(e=>j(e.name,s)&&j(e.value,o));e>=0&&n.headers.splice(e,1)}else n.headers=n.headers.filter(t=>!j(t.name,e));if(!j(this.#H[r].name,s))for(let e=0;e<n.headers.length;++e)if(j(n.headers[e].name,s)&&j(n.headers[e].value,o)){n.headers.splice(e,1);break}for(const e of i)n.headers.push({name:e.name,value:e.value||""});0===n.headers.length&&this.#q.pop(),this.#L()}#_(){this.#H.push({name:h.StringUtilities.toLowerCaseString(r.i18n.lockedString("header-name")),value:r.i18n.lockedString("header value"),isOverride:!0,nameEditable:!0,valueEditable:1});const e=this.#H.length-1;this.#N(this.#H[e].name,this.#H[e].value||"",e),this.#l();const s=this.shadow.querySelectorAll("devtools-header-section-row"),[o]=Array.from(s).slice(-1);o?.focus(),t.userMetrics.actionTaken(t.UserMetrics.Action.HeaderOverrideHeaderAdded)}#l(){if(!this.#e)return;const e=this.#H.map((e,t)=>({...this.headerDetails[t],...e,isResponseHeader:!0}));a(n`
      <style>${se}</style>
      ${e.map((e,t)=>n`
        <devtools-header-section-row
            .data=${{header:e}}
            @headeredited=${this.#A}
            @headerremoved=${this.#P}
            @enableheaderediting=${this.#V}
            data-index=${t}
            jslog=${l.item("response-header")}
        ></devtools-header-section-row>
      `)}
      ${1===this.#C?n`
        <devtools-button
          class="add-header-button"
          .variant=${"outlined"}
          .iconName=${"plus"}
          @click=${this.#_}
          jslog=${l.action("add-header").track({click:!0})}>
          ${ae(oe.addHeader)}
        </devtools-button>
      `:d}
    `,this.shadow,{host:this})}async#V(){if(!this.#e)return;t.userMetrics.actionTaken(t.UserMetrics.Action.HeaderOverrideEnableEditingClicked);const r=this.#e.url(),s=p.NetworkPersistenceManager.NetworkPersistenceManager.instance();s.project()?(e.Settings.Settings.instance().moduleSetting("persistence-network-overrides-enabled").set(!0),await s.getOrCreateHeadersUISourceCodeFromUrl(r)):o.InspectorView.InspectorView.instance().displaySelectOverrideFolderInfobar(async()=>{await w.SourcesNavigator.OverridesNavigatorView.instance().setupNewWorkspace(),await s.getOrCreateHeadersUISourceCodeFromUrl(r)})}}customElements.define("devtools-response-header-section",he);const ue=new Map([["coep-frame-resource-needs-coep-header",{name:h.StringUtilities.toLowerCaseString("cross-origin-embedder-policy"),value:null,blockedDetails:{explanation:ne(oe.toEmbedThisFrameInYourDocument),examples:[{codeSnippet:"Cross-Origin-Embedder-Policy: require-corp",comment:void 0}],link:{url:"https://web.dev/coop-coep/"}}}],["corp-not-same-origin-after-defaulted-to-same-origin-by-coep",{name:h.StringUtilities.toLowerCaseString("cross-origin-resource-policy"),value:null,blockedDetails:{explanation:ne(oe.toUseThisResourceFromADifferent),examples:[{codeSnippet:"Cross-Origin-Resource-Policy: same-site",comment:ne(oe.chooseThisOptionIfTheResourceAnd)},{codeSnippet:"Cross-Origin-Resource-Policy: cross-origin",comment:ne(oe.onlyChooseThisOptionIfAn)}],link:{url:"https://web.dev/coop-coep/"}}}],["coop-sandboxed-iframe-cannot-navigate-to-coop-page",{name:h.StringUtilities.toLowerCaseString("cross-origin-opener-policy"),value:null,headerValueIncorrect:!1,blockedDetails:{explanation:ne(oe.thisDocumentWasBlockedFrom),examples:[],link:{url:"https://web.dev/coop-coep/"}}}],["corp-not-same-site",{name:h.StringUtilities.toLowerCaseString("cross-origin-resource-policy"),value:null,headerValueIncorrect:!0,blockedDetails:{explanation:ne(oe.toUseThisResourceFromADifferentSite),examples:[{codeSnippet:"Cross-Origin-Resource-Policy: cross-origin",comment:ne(oe.onlyChooseThisOptionIfAn)}],link:null}}],["corp-not-same-origin",{name:h.StringUtilities.toLowerCaseString("cross-origin-resource-policy"),value:null,headerValueIncorrect:!0,blockedDetails:{explanation:ne(oe.toUseThisResourceFromADifferentOrigin),examples:[{codeSnippet:"Cross-Origin-Resource-Policy: same-site",comment:ne(oe.chooseThisOptionIfTheResourceAnd)},{codeSnippet:"Cross-Origin-Resource-Policy: cross-origin",comment:ne(oe.onlyChooseThisOptionIfAn)}],link:null}}]]);var pe=Object.freeze({__proto__:null,EarlyHintsHeaderSection:ce,RESPONSE_HEADER_SECTION_DATA_KEY:de,ResponseHeaderSection:he});const{render:ve,html:me}=i,ge={fromDiskCache:"(from disk cache)",fromMemoryCache:"(from memory cache)",fromEarlyHints:"(from early hints)",fromPrefetchCache:"(from prefetch cache)",fromServiceWorker:"(from `service worker`)",fromSignedexchange:"(from signed-exchange)",general:"General",raw:"Raw",referrerPolicy:"Referrer Policy",remoteAddress:"Remote Address",requestHeaders:"Request Headers",requestMethod:"Request Method",requestUrl:"Request URL",responseHeaders:"Response Headers",earlyHintsHeaders:"Early Hints Headers",revealHeaderOverrides:"Reveal header override definitions",showMore:"Show more",statusCode:"Status Code"},fe=r.i18n.registerUIStrings("panels/network/components/RequestHeadersView.ts",ge),we=r.i18n.getLocalizedString.bind(void 0,fe);class ye extends g.LegacyWrapper.WrappableComponent{#e;#o=this.attachShadow({mode:"open"});#M=!1;#F=!1;#j=!1;#z=!1;#W=void 0;#G=v.Workspace.WorkspaceImpl.instance();constructor(e){super(),this.#e=e,this.setAttribute("jslog",`${l.pane("headers").track({resize:!0})}`)}wasShown(){super.wasShown(),this.#e.addEventListener(s.NetworkRequest.Events.REMOTE_ADDRESS_CHANGED,this.#B,this),this.#e.addEventListener(s.NetworkRequest.Events.FINISHED_LOADING,this.#B,this),this.#e.addEventListener(s.NetworkRequest.Events.REQUEST_HEADERS_CHANGED,this.#B,this),this.#e.addEventListener(s.NetworkRequest.Events.RESPONSE_HEADERS_CHANGED,this.#K,this),this.#W=void 0,this.#B()}willHide(){super.willHide(),this.#e.removeEventListener(s.NetworkRequest.Events.REMOTE_ADDRESS_CHANGED,this.#B,this),this.#e.removeEventListener(s.NetworkRequest.Events.FINISHED_LOADING,this.#B,this),this.#e.removeEventListener(s.NetworkRequest.Events.REQUEST_HEADERS_CHANGED,this.#B,this),this.#e.removeEventListener(s.NetworkRequest.Events.RESPONSE_HEADERS_CHANGED,this.#K,this)}#K(){this.#e.deleteAssociatedData(de),this.render()}#B(){this.render()}revealHeader(e,t){this.#W={section:e,header:t},this.render()}connectedCallback(){this.#G.addEventListener(v.Workspace.Events.UISourceCodeAdded,this.#Y,this),this.#G.addEventListener(v.Workspace.Events.UISourceCodeRemoved,this.#Y,this),e.Settings.Settings.instance().moduleSetting("persistence-network-overrides-enabled").addChangeListener(this.render,this)}disconnectedCallback(){this.#G.removeEventListener(v.Workspace.Events.UISourceCodeAdded,this.#Y,this),this.#G.removeEventListener(v.Workspace.Events.UISourceCodeRemoved,this.#Y,this),e.Settings.Settings.instance().moduleSetting("persistence-network-overrides-enabled").removeChangeListener(this.render,this)}#Y(e){this.#Q()===e.data.url()&&this.render()}async render(){if(this.#e)return await f.write(()=>{ve(me`
        <style>${S}</style>
        ${this.#J()}
        ${this.#X()}
        ${this.#Z()}
        ${this.#ee()}
      `,this.#o,{host:this})})}#X(){if(!this.#e||!this.#e.earlyHintsHeaders||0===this.#e.earlyHintsHeaders.length)return i.nothing;return me`
      <devtools-request-headers-category
        @togglerawevent=${()=>{this.#M=!this.#M,this.render()}}
        .data=${{name:"early-hints-headers",title:we(ge.earlyHintsHeaders),headerCount:this.#e.earlyHintsHeaders.length,checked:void 0,additionalContent:void 0,forceOpen:"EarlyHints"===this.#W?.section,loggingContext:"early-hints-headers"}}
        aria-label=${we(ge.earlyHintsHeaders)}
      >
        ${this.#M?this.#te(this.#e.responseHeadersText,!0):me`
          <devtools-early-hints-header-section .data=${{request:this.#e,toReveal:this.#W}}></devtools-early-hints-header-section>
        `}
      </devtools-request-headers-category>
    `}#Z(){if(!this.#e)return i.nothing;return me`
      <devtools-request-headers-category
        @togglerawevent=${()=>{this.#M=!this.#M,this.render()}}
        .data=${{name:"response-headers",title:we(ge.responseHeaders),headerCount:this.#e.sortedResponseHeaders.length,checked:this.#e.responseHeadersText?this.#M:void 0,additionalContent:this.#re(),forceOpen:"Response"===this.#W?.section,loggingContext:"response-headers"}}
        aria-label=${we(ge.responseHeaders)}
      >
        ${this.#M?this.#te(this.#e.responseHeadersText,!0):me`
          <devtools-response-header-section .data=${{request:this.#e,toReveal:this.#W}} jslog=${l.section("response-headers")}></devtools-response-header-section>
        `}
      </devtools-request-headers-category>
    `}#re(){if(!this.#G.uiSourceCodeForURL(this.#Q()))return i.nothing;const t=e.Settings.Settings.instance().moduleSetting("persistence-network-overrides-enabled"),r=me`
      <devtools-icon name="document" class=${t.get(),"inline-icon dot purple"}>
      </devtools-icon>`;return me`
      <x-link
          href="https://goo.gle/devtools-override"
          class="link devtools-link"
          jslog=${l.link("devtools-override").track({click:!0})}
      >
        <devtools-icon name="help" class="inline-icon medium">
        </devtools-icon>
      </x-link>
      <x-link
          @click=${e=>{e.preventDefault();const t=this.#G.uiSourceCodeForURL(this.#Q());t&&(w.SourcesPanel.SourcesPanel.instance().showUISourceCode(t),w.SourcesPanel.SourcesPanel.instance().revealInNavigator(t))}}
          class="link devtools-link"
          title=${ge.revealHeaderOverrides}
          jslog=${l.link("reveal-header-overrides").track({click:!0})}
      >
        ${r}${p.NetworkPersistenceManager.HEADERS_FILENAME}
      </x-link>
    `}#Q(){if(!this.#e)return h.DevToolsPath.EmptyUrlString;const e=p.NetworkPersistenceManager.NetworkPersistenceManager.instance().fileUrlFromNetworkUrl(this.#e.url(),!0);return e.substring(0,e.lastIndexOf("/"))+"/"+p.NetworkPersistenceManager.HEADERS_FILENAME}#ee(){if(!this.#e)return i.nothing;const e=this.#e.requestHeadersText();return me`
      <devtools-request-headers-category
        @togglerawevent=${()=>{this.#F=!this.#F,this.render()}}
        .data=${{name:"request-headers",title:we(ge.requestHeaders),headerCount:this.#e.requestHeaders().length,checked:e?this.#F:void 0,forceOpen:"Request"===this.#W?.section,loggingContext:"request-headers"}}
        aria-label=${we(ge.requestHeaders)}
      >
        ${this.#F&&e?this.#te(e,!1):me`
          <devtools-request-header-section .data=${{request:this.#e,toReveal:this.#W}} jslog=${l.section("request-headers")}></devtools-request-header-section>
        `}
      </devtools-request-headers-category>
    `}#te(e,t){const r=e.trim(),s=!(t?this.#j:this.#z)&&r.length>3e3,a=()=>{t?this.#j=!0:this.#z=!0,this.render()},n=e=>{if(!(t?this.#j:this.#z)){const t=new o.ContextMenu.ContextMenu(e);t.newSection().appendItem(we(ge.showMore),a,{jslogContext:"show-more"}),t.show()}};return me`
      <div class="row raw-headers-row" on-render=${c.Directives.nodeRenderedCallback(e=>{s&&e.addEventListener("contextmenu",n)})}>
        <div class="raw-headers">${s?r.substring(0,3e3):r}</div>
        ${s?me`
          <devtools-button
            .size=${"SMALL"}
            .variant=${"outlined"}
            @click=${a}
            jslog=${l.action("raw-headers-show-more").track({click:!0})}
          >${we(ge.showMore)}</devtools-button>
        `:i.nothing}
      </div>
    `}#J(){if(!this.#e)return i.nothing;const e=["status"];this.#e.statusCode<300||304===this.#e.statusCode?e.push("green-circle"):this.#e.statusCode<400?e.push("yellow-circle"):e.push("red-circle");let t="";this.#e.cachedInMemory()?t=we(ge.fromMemoryCache):this.#e.fromEarlyHints()?t=we(ge.fromEarlyHints):this.#e.fetchedViaServiceWorker?t=we(ge.fromServiceWorker):this.#e.redirectSourceSignedExchangeInfoHasNoErrors()?t=we(ge.fromSignedexchange):this.#e.fromPrefetchCache()?t=we(ge.fromPrefetchCache):this.#e.cached()&&(t=we(ge.fromDiskCache)),t&&e.push("status-with-comment");const r=[this.#e.statusCode,this.#e.getInferredStatusText(),t].join(" ");return me`
      <devtools-request-headers-category
        .data=${{name:"general",title:we(ge.general),forceOpen:"General"===this.#W?.section,loggingContext:"general"}}
        aria-label=${we(ge.general)}
      >
      <div jslog=${l.section("general")}>
        ${this.#se(we(ge.requestUrl),this.#e.url())}
        ${this.#e.statusCode?this.#se(we(ge.requestMethod),this.#e.requestMethod):i.nothing}
        ${this.#e.statusCode?this.#se(we(ge.statusCode),r,e):i.nothing}
        ${this.#e.remoteAddress()?this.#se(we(ge.remoteAddress),this.#e.remoteAddress()):i.nothing}
        ${this.#e.referrerPolicy()?this.#se(we(ge.referrerPolicy),String(this.#e.referrerPolicy())):i.nothing}
      </div>
      </devtools-request-headers-category>
    `}#se(e,r,s){const o="General"===this.#W?.section&&e.toLowerCase()===this.#W?.header?.toLowerCase();return me`
      <div class="row ${o?"header-highlight":""}">
        <div class="header-name">${e}</div>
        <div
          class="header-value ${s?.join(" ")}"
          @copy=${()=>t.userMetrics.actionTaken(t.UserMetrics.Action.NetworkPanelCopyValue)}
        >${r}</div>
      </div>
    `}}class ke extends Event{static eventName="togglerawevent";constructor(){super(ke.eventName,{})}}class Se extends HTMLElement{#o=this.attachShadow({mode:"open"});#oe;#ie=e.UIString.LocalizedEmptyString;#ae=void 0;#ne=void 0;#de=void 0;#le=void 0;#ce="";set data(t){this.#ie=t.title,this.#oe=e.Settings.Settings.instance().createSetting("request-info-"+t.name+"-category-expanded",!0),this.#ae=t.headerCount,this.#ne=t.checked,this.#de=t.additionalContent,this.#le=t.forceOpen,this.#ce=t.loggingContext,this.#l()}#he(){this.dispatchEvent(new ke)}#l(){const e=!this.#oe||this.#oe.get()||this.#le;ve(me`
      <style>${S}</style>
      <style>${m.checkboxStyles}</style>
      <details ?open=${e} @toggle=${this.#ue}>
        <summary
          class="header"
          @keydown=${this.#pe}
          jslog=${l.sectionHeader().track({click:!0}).context(this.#ce)}
        >
          <div class="header-grid-container">
            <div>
              ${this.#ie}${void 0!==this.#ae?me`<span class="header-count"> (${this.#ae})</span>`:i.nothing}
            </div>
            <div class="hide-when-closed">
              ${void 0!==this.#ne?me`
                <devtools-checkbox .checked=${this.#ne} @change=${this.#he}
                         jslog=${l.toggle("raw-headers").track({change:!0})}>
                  ${we(ge.raw)}
              </devtools-checkbox>`:i.nothing}
            </div>
            <div class="hide-when-closed">${this.#de}</div>
          </div>
        </summary>
        <slot></slot>
      </details>
    `,this.#o,{host:this})}#pe(e){if(!e.target)return;const t=e.target.parentElement;if(!t)throw new Error("<details> element is not found for a <summary> element");switch(e.key){case"ArrowLeft":t.open=!1;break;case"ArrowRight":t.open=!0}}#ue(e){this.#oe?.set(e.target.open)}}customElements.define("devtools-request-headers",ye),customElements.define("devtools-request-headers-category",Se);var be=Object.freeze({__proto__:null,Category:Se,RequestHeadersView:ye,ToggleRawHeadersEvent:ke}),Ee=`.code{font-family:var(--monospace-font-family);font-size:var(--monospace-font-size)}.issuers-list{display:flex;flex-direction:column;list-style-type:none;padding:0;margin:0}.status-icon{margin:0 0.3em 2px 0;vertical-align:middle}\n/*# sourceURL=${import.meta.resolve("./RequestTrustTokensView.css")} */`;const{html:xe}=i,Re={parameters:"Parameters",type:"Type",refreshPolicy:"Refresh policy",issuers:"Issuers",topLevelOrigin:"Top level origin",issuer:"Issuer",result:"Result",status:"Status",numberOfIssuedTokens:"Number of issued tokens",success:"Success",failure:"Failure",theOperationsResultWasServedFrom:"The operations result was served from cache.",theOperationWasFulfilledLocally:"The operation was fulfilled locally, no request was sent.",theKeysForThisPSTIssuerAreUnavailable:"The keys for this PST issuer are unavailable. The issuer may need to be registered via the Chrome registration process.",aClientprovidedArgumentWas:"A client-provided argument was malformed or otherwise invalid.",eitherNoInputsForThisOperation:"Either no inputs for this operation are available or the output exceeds the operations quota.",theServersResponseWasMalformedOr:"The servers response was malformed or otherwise invalid.",theOperationFailedForAnUnknown:"The operation failed for an unknown reason.",perSiteLimit:"Per-site issuer limit reached."},He=r.i18n.registerUIStrings("panels/network/components/RequestTrustTokensView.ts",Re),$e=r.i18n.getLocalizedString.bind(void 0,He);class qe extends g.LegacyWrapper.WrappableComponent{#o=this.attachShadow({mode:"open"});#e;constructor(e){super(),this.#e=e}wasShown(){super.wasShown(),this.#e.addEventListener(s.NetworkRequest.Events.TRUST_TOKEN_RESULT_ADDED,this.render,this),this.render()}willHide(){super.willHide(),this.#e.removeEventListener(s.NetworkRequest.Events.TRUST_TOKEN_RESULT_ADDED,this.render,this)}async render(){if(!this.#e)throw new Error("Trying to render a Trust Token report without providing data");i.render(xe`
      <style>${Ee}</style>
      <devtools-report>
        ${this.#ve()}
        ${this.#me()}
      </devtools-report>
    `,this.#o,{host:this})}#ve(){const e=this.#e.trustTokenParams();return e?xe`
      <devtools-report-section-header jslog=${l.pane("trust-tokens").track({resize:!0})}>${$e(Re.parameters)}</devtools-report-section-header>
      ${Ae($e(Re.type),e.operation.toString())}
      ${this.#ge(e)}
      ${this.#fe(e)}
      ${this.#we()}
      <devtools-report-divider></devtools-report-divider>
    `:i.nothing}#ge(e){return"Redemption"!==e.operation?i.nothing:Ae($e(Re.refreshPolicy),e.refreshPolicy.toString())}#fe(e){return e.issuers&&0!==e.issuers.length?xe`
      <devtools-report-key>${$e(Re.issuers)}</devtools-report-key>
      <devtools-report-value>
        <ul class="issuers-list">
          ${e.issuers.map(e=>xe`<li>${e}</li>`)}
        </ul>
      </devtools-report-value>
    `:i.nothing}#we(){const e=this.#e.trustTokenOperationDoneEvent();return e?xe`
      ${De($e(Re.topLevelOrigin),e.topLevelOrigin)}
      ${De($e(Re.issuer),e.issuerOrigin)}`:i.nothing}#me(){const e=this.#e.trustTokenOperationDoneEvent();return e?xe`
      <devtools-report-section-header>${$e(Re.result)}</devtools-report-section-header>
      <devtools-report-key>${$e(Re.status)}</devtools-report-key>
      <devtools-report-value>
        <span>
          <devtools-icon class="status-icon medium"
            .data=${t=e.status,Oe(t)?Ce:Te}>
          </devtools-icon>
          <strong>${function(e){return Oe(e)?$e(Re.success):$e(Re.failure)}(e.status)}</strong>
          ${function(e){switch(e){case"Ok":return null;case"AlreadyExists":return $e(Re.theOperationsResultWasServedFrom);case"FulfilledLocally":return $e(Re.theOperationWasFulfilledLocally);case"InvalidArgument":return $e(Re.aClientprovidedArgumentWas);case"ResourceExhausted":return $e(Re.eitherNoInputsForThisOperation);case"BadResponse":return $e(Re.theServersResponseWasMalformedOr);case"MissingIssuerKeys":return $e(Re.theKeysForThisPSTIssuerAreUnavailable);case"FailedPrecondition":case"ResourceLimited":case"InternalError":case"Unauthorized":case"UnknownError":return $e(Re.theOperationFailedForAnUnknown);case"SiteIssuerLimit":return $e(Re.perSiteLimit)}}(e.status)}
        </span>
      </devtools-report-value>
      ${this.#ye(e)}
      <devtools-report-divider></devtools-report-divider>
      `:i.nothing;var t}#ye(e){return"Issuance"!==e.type?i.nothing:De($e(Re.numberOfIssuedTokens),e.issuedTokenCount)}}const Ce={color:"var(--icon-checkmark-green)",iconName:"check-circle"},Te={color:"var(--icon-error)",iconName:"cross-circle-filled"};function Oe(e){return"Ok"===e||"AlreadyExists"===e||"FulfilledLocally"===e}function De(e,t){return void 0===t?i.nothing:xe`
    <devtools-report-key>${e}</devtools-report-key>
    <devtools-report-value>${t}</devtools-report-value>
  `}function Ae(e,t){return xe`
    <devtools-report-key>${e}</devtools-report-key>
    <devtools-report-value class="code">${t}</devtools-report-value>
  `}customElements.define("devtools-trust-token-report",qe);var Ne=Object.freeze({__proto__:null,RequestTrustTokensView:qe,statusConsideredSuccess:Oe});export{D as DirectSocketConnectionView,I as EditableSpan,K as HeaderSectionRow,re as RequestHeaderSection,be as RequestHeadersView,Ne as RequestTrustTokensView,pe as ResponseHeaderSection};
//# sourceMappingURL=components.js.map
