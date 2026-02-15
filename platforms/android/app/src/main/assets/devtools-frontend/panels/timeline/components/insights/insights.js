import"../../../../ui/components/markdown_view/markdown_view.js";import*as e from"../../../../core/i18n/i18n.js";import*as t from"../../../../core/root/root.js";import*as s from"../../../../models/ai_assistance/ai_assistance.js";import*as i from"../../../../models/badges/badges.js";import*as n from"../../../../ui/components/buttons/buttons.js";import*as r from"../../../../ui/components/helpers/helpers.js";import*as o from"../../../../ui/legacy/legacy.js";import*as a from"../../../../ui/lit/lit.js";import*as l from"../../../../ui/visual_logging/visual_logging.js";import*as d from"../../../../models/trace/trace.js";import*as c from"../../../../third_party/marked/marked.js";import*as h from"../../../../core/sdk/sdk.js";import*as m from"../../utils/utils.js";import"../../../../ui/components/icon_button/icon_button.js";import*as u from"../../../../core/common/common.js";import*as g from"../../../../ui/legacy/components/utils/utils.js";import*as v from"../../../../core/platform/platform.js";import*as p from"../../../../ui/i18n/i18n.js";import*as f from"../../../../models/bindings/bindings.js";import"../../../../ui/components/linkifier/linkifier.js";var y=`@keyframes insight-highlight-fade-out{from{background-color:var(--sys-color-yellow-container)}to{background-color:transparent}}:host([highlight-insight]){.insight{animation:insight-highlight-fade-out 2s 0s}}.insight{display:block;position:relative;width:auto;height:auto;margin:var(--sys-size-5) 0;border-radius:var(--sys-shape-corner-extra-small);overflow:hidden;border:var(--sys-size-1) solid var(--sys-color-divider);background-color:var(--sys-color-base);header:focus-visible{outline:none}&.closed{background-color:var(--sys-color-surface3);border:none;&:focus-within{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring)}}header{padding:var(--sys-size-5) var(--sys-size-4);h3{font:var(--sys-typescale-body4-medium)}}&:not(.closed){header{padding-bottom:var(--sys-size-2)}}}.insight-hover-icon{position:absolute;top:var(--sys-size-5);right:var(--sys-size-5);border:none;width:var(--sys-size-9);user-select:none;height:var(--sys-size-9);box-shadow:var(--sys-elevation-level1);border-radius:var(--sys-shape-corner-full);background:var(--sys-color-cdt-base-container);opacity:0%;.insight:hover &,\n  header:focus-within &{opacity:100%}&.active devtools-button{transform:rotate(180deg)}}.insight-description,\n.insight-body,\n.insight-title{user-select:text}.insight-body{padding:0 var(--sys-size-4) var(--sys-size-5);.list-title{margin-top:var(--sys-size-4);margin-bottom:var(--sys-size-3)}ul{padding:0 0 0 var(--sys-size-9);margin:0}}.insight-section{padding-top:var(--sys-size-5);margin-top:var(--sys-size-5)}.insight-description:not(:empty){margin-bottom:var(--sys-size-5)}.insight-section:not(:empty){border-top:var(--sys-size-1) solid var(--sys-color-divider)}.insight-title{color:var(--sys-color-on-base);margin-block:3px}.link{color:var(--sys-color-primary)}.dl-title{font-weight:bold}dd.dl-title{text-align:right}.dl-value{font-weight:bold}.image-ref{display:inline-flex;align-items:center;&:not(:empty){padding-top:var(--sys-size-5)}}.element-img{width:var(--sys-size-13);height:var(--sys-size-13);object-fit:cover;border:var(--sys-size-1) solid var(--sys-color-divider);background:var(--sys-color-divider) -0.054px -12px /100.239% 148.936% no-repeat;margin-right:var(--sys-size-5)}.element-img-details{font:var(--sys-typescale-body4-regular);display:flex;flex-direction:column;word-break:break-all;.element-img-details-size{color:var(--color-text-secondary)}}::slotted(*){font:var(--sys-typescale-body4-regular)}.insight-savings{font:var(--sys-typescale-body4-medium);color:var(--sys-color-green)}.timeline-link{cursor:pointer;text-decoration:var(--override-timeline-link-text-decoration,underline);color:var(--override-timeline-link-text-color,var(--sys-color-primary));background:none;border:none;padding:0;font:inherit;text-align:left}.timeline-link.invalid-link{color:var(--sys-color-state-disabled)}.ask-ai-btn-wrap{border-top:var(--sys-size-1) solid var(--sys-color-divider);padding-top:var(--sys-size-5);margin-top:var(--sys-size-5);text-align:center}\n/*# sourceURL=${import.meta.resolve("./baseInsightComponent.css")} */`;const{html:b}=a;function S(e){const t=c.Marked.lexer(e);return b`<devtools-markdown-view .data=${{tokens:t}}></devtools-markdown-view>`}var T=Object.freeze({__proto__:null,md:S,shouldRenderForCategory:function(e){return e.activeCategory===d.Insights.Types.InsightCategory.ALL||e.activeCategory===e.insightCategory}});class w extends Event{model;insightSetKey;static eventName="insightactivated";constructor(e,t){super(w.eventName,{bubbles:!0,composed:!0}),this.model=e,this.insightSetKey=t}}class k extends Event{static eventName="insightdeactivated";constructor(){super(k.eventName,{bubbles:!0,composed:!0})}}class $ extends Event{bounds;static eventName="insightsethovered";constructor(e){super($.eventName,{bubbles:!0,composed:!0}),this.bounds=e}}class R extends Event{bounds;static eventName="insightsetzoom";constructor(e){super(R.eventName,{bubbles:!0,composed:!0}),this.bounds=e}}class I extends Event{overlays;options;static eventName="insightprovideoverlays";constructor(e,t){super(I.eventName,{bubbles:!0,composed:!0}),this.overlays=e,this.options=t}}var N=Object.freeze({__proto__:null,InsightActivated:w,InsightDeactivated:k,InsightProvideOverlays:I,InsightSetHovered:$,InsightSetZoom:R});const{html:C}=a,x={estimatedSavings:"Est savings: {PH1}",estimatedSavingsTimingAndBytes:"Est savings: {PH1} & {PH2}",estimatedSavingsAriaTiming:"Estimated savings for this insight: {PH1}",estimatedSavingsAriaBytes:"Estimated savings for this insight: {PH1} transfer size",estimatedSavingsTimingAndBytesAria:"Estimated savings for this insight: {PH1} and {PH2} transfer size",viewDetails:"View details for {PH1} insight."},E=e.i18n.registerUIStrings("panels/timeline/components/insights/BaseInsightComponent.ts",x),_=e.i18n.getLocalizedString.bind(void 0,E);class O extends HTMLElement{static litTagName=a.StaticHtml.literal``;shadow=this.attachShadow({mode:"open"});#e=!1;#t=!1;#s=null;#i=null;#n=null;get model(){return this.#s}data={bounds:null,insightSetKey:null};sharedTableState={selectedRowEl:null,selectionIsSticky:!1};#r=null;scheduleRender(){r.ScheduledRender.scheduleRender(this,this.#o)}hasAskAiSupport(){return!1}connectedCallback(){this.setAttribute("jslog",`${l.section(`timeline.insights.${this.internalName}`)}`),this.dataset.insightName=this.internalName;const{devToolsAiAssistancePerformanceAgent:e}=t.Runtime.hostConfig;this.#e=Boolean(e?.enabled)}set selected(e){if(!this.#t&&e){const e=this.getOverlayOptionsForInitialOverlays();this.dispatchEvent(new I(this.getInitialOverlays(),e))}this.#t=e,r.ScheduledRender.scheduleRender(this,this.#o)}get selected(){return this.#t}set model(e){this.#s=e,r.ScheduledRender.scheduleRender(this,this.#o)}set insightSetKey(e){this.data.insightSetKey=e,r.ScheduledRender.scheduleRender(this,this.#o)}get bounds(){return this.data.bounds}set bounds(e){this.data.bounds=e,r.ScheduledRender.scheduleRender(this,this.#o)}set agentFocus(e){this.#i=e}set fieldMetrics(e){this.#n=e}get fieldMetrics(){return this.#n}getOverlayOptionsForInitialOverlays(){return{updateTraceWindow:!0}}#a(){if(!this.data.insightSetKey||!this.model)return;const e=o.Context.Context.instance().flavor(s.AIContext.AgentFocus);if(this.#t)return this.dispatchEvent(new k),void(e&&o.Context.Context.instance().setFlavor(s.AIContext.AgentFocus,e.withInsight(null)));e&&o.Context.Context.instance().setFlavor(s.AIContext.AgentFocus,e.withInsight(this.model)),i.UserBadges.instance().recordAction(i.BadgeAction.PERFORMANCE_INSIGHT_CLICKED),this.sharedTableState.selectedRowEl?.classList.remove("selected"),this.sharedTableState.selectedRowEl=null,this.sharedTableState.selectionIsSticky=!1,this.dispatchEvent(new w(this.model,this.data.insightSetKey))}#l(e){const t=a.Directives.classMap({"insight-hover-icon":!0,active:e});return C`
      <div class=${t} inert>
        <devtools-button .data=${{variant:"icon",iconName:"chevron-down",size:"SMALL"}}
      ></devtools-button>
      </div>

    `}#d(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this.#a())}toggleTemporaryOverlays(e,t){this.#t&&(e?this.dispatchEvent(new I(e,t)):this.dispatchEvent(new I(this.getInitialOverlays(),this.getOverlayOptionsForInitialOverlays())))}getInitialOverlays(){return this.#r||(this.#r=this.createOverlays()),this.#r}createOverlays(){return this.model?.createOverlays?.()??[]}#o(){this.model&&this.#c()}getEstimatedSavingsTime(){return null}getEstimatedSavingsBytes(){return this.model?.wastedBytes??null}#h(){const t=this.getEstimatedSavingsTime(),s=this.getEstimatedSavingsBytes();let i,n;return t&&(i=e.TimeUtilities.millisToString(t)),s&&(n=e.ByteUtilities.bytesToString(s)),{timeString:i,bytesString:n}}#m(){const{bytesString:e,timeString:t}=this.#h();return t&&e?_(x.estimatedSavingsTimingAndBytesAria,{PH1:t,PH2:e}):t?_(x.estimatedSavingsAriaTiming,{PH1:t}):e?_(x.estimatedSavingsAriaBytes,{PH1:e}):null}#u(){const{bytesString:e,timeString:t}=this.#h();return t&&e?_(x.estimatedSavingsTimingAndBytes,{PH1:t,PH2:e}):t?_(x.estimatedSavings,{PH1:t}):e?_(x.estimatedSavings,{PH1:e}):null}#g(){if(!this.#i)return;const e="drjones.performance-panel-context";if(!o.ActionRegistry.ActionRegistry.instance().hasAction(e))return;let t=o.Context.Context.instance().flavor(s.AIContext.AgentFocus);t=t?t.withInsight(this.model):this.#i,o.Context.Context.instance().setFlavor(s.AIContext.AgentFocus,t);o.ActionRegistry.ActionRegistry.instance().getAction(e).execute()}#v(){return t.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue!==t.Runtime.GenAiEnterprisePolicyValue.DISABLE&&this.#e&&!0===t.Runtime.hostConfig.aidaAvailability?.enabled&&this.hasAskAiSupport()}#p(e){if(!this.#t)return a.nothing;const s=t.Runtime.hostConfig.devToolsAiDebugWithAi?.enabled||t.Runtime.hostConfig.devToolsAiSubmenuPrompts?.enabled?"Debug with AI":"Ask AI",i=`${s} about ${e.title} insight`,n=this.renderContent();return C`
      <div class="insight-body">
        <div class="insight-description">${S(e.description)}</div>
        <div class="insight-content">${n}</div>
        ${this.#v()?C`
          <div class="ask-ai-btn-wrap">
            <devtools-button class="ask-ai"
              .variant=${"outlined"}
              .iconName=${"smart-assistant"}
              data-insights-ask-ai
              jslog=${l.action(`timeline.insight-ask-ai.${this.internalName}`).track({click:!0})}
              @click=${this.#g}
              aria-label=${i}
            >${s}</devtools-button>
          </div>
        `:a.nothing}
      </div>`}#c(){if(!this.#s)return void a.render(a.nothing,this.shadow,{host:this});const e=a.Directives.classMap({insight:!0,closed:!this.#t}),t=this.#u(),s=this.#m();let i=`${_(x.viewDetails,{PH1:this.#s.title})}`;s&&(i+=` ${s}`);const n=C`
      <style>${y}</style>
      <div class=${e}>
        <header @click=${this.#a}
          @keydown=${this.#d}
          jslog=${l.action(`timeline.toggle-insight.${this.internalName}`).track({click:!0})}
          data-insight-header-title=${this.#s?.title}
          tabIndex="0"
          role="button"
          aria-expanded=${this.#t}
          aria-label=${i}
        >
          ${this.#l(this.#t)}
          <h3 class="insight-title">${this.#s?.title}</h3>
          ${t?C`
            <slot name="insight-savings" class="insight-savings">
              <span title=${s??""}>${t}</span>
            </slot>
          </div>`:a.nothing}
        </header>
        ${this.#p(this.#s)}
      </div>
    `;a.render(n,this.shadow,{host:this}),this.#t&&requestAnimationFrame(()=>requestAnimationFrame(()=>this.scrollIntoViewIfNeeded()))}}var A=Object.freeze({__proto__:null,BaseInsightComponent:O});const{html:D,Directives:{ifDefined:M}}=a;class L extends Event{event;static eventName="eventreferenceclick";constructor(e){super(L.eventName,{bubbles:!0,composed:!0}),this.event=e}}class U extends HTMLElement{#f=this.attachShadow({mode:"open"});#y=null;#b=null;set text(e){this.#y=e,r.ScheduledRender.scheduleRender(this,this.#o)}set event(e){this.#b=e,r.ScheduledRender.scheduleRender(this,this.#o)}#o(){this.#y&&this.#b&&a.render(D`
      <style>${y}</style>
      <button type="button" class="timeline-link" @click=${e=>{e.stopPropagation(),this.#b&&this.dispatchEvent(new L(this.#b))}}>${this.#y}</button>
    `,this.#f,{host:this})}}function z(e,t){let s=t?.title,i=t?.text;return d.Types.Events.isSyntheticNetworkRequest(e)?(i=i??m.Helpers.shortenUrl(new URL(e.args.data.url)),s=s??e.args.data.url):i||(console.warn("No text given for eventRef"),i=e.name),D`<devtools-performance-event-ref
    .event=${e}
    .text=${i}
    title=${M(s)}
  ></devtools-performance-event-ref>`}class H extends HTMLElement{#f=this.attachShadow({mode:"open"});#S;#T;set request(e){this.#S=e,this.#T=void 0,r.ScheduledRender.scheduleRender(this,this.#o)}async#w(){if(!this.#S)return null;if(void 0!==this.#T)return this.#T;const e=this.#S.args.data.url,t=h.ResourceTreeModel.ResourceTreeModel.resourceForURL(e);if(!t)return this.#T=null,this.#T;const s=await t.requestContentData();return"error"in s?(this.#T=null,this.#T):(this.#T=s.asDataUrl(),this.#T)}async#o(){if(!this.#S)return;const t=this.#S.args.data.mimeType.includes("image")?await this.#w():null,s=t?D`<img src=${t} class="element-img"/>`:a.nothing;a.render(D`
      <style>${y}</style>
      <div class="image-ref">
        ${s}
        <span class="element-img-details">
          ${z(this.#S)}
          <span class="element-img-details-size">${e.ByteUtilities.bytesToString(this.#S.args.data.decodedBodyLength??0)}</span>
        </span>
      </div>
    `,this.#f,{host:this})}}function P(e){return D`
    <devtools-performance-image-ref
      .request=${e}
    ></devtools-performance-image-ref>
  `}customElements.define("devtools-performance-event-ref",U),customElements.define("devtools-performance-image-ref",H);var F=Object.freeze({__proto__:null,EventReferenceClick:L,eventRef:z,imageRef:P}),q=`table{width:100%;padding:5px 0;border-collapse:collapse}thead{white-space:nowrap}table tr > *{text-align:right}table tr > *:first-child{text-align:left}table.interactive tbody tr{cursor:pointer}table.interactive tbody tr:hover,\ntable.interactive tbody tr.hover,\ntable.interactive tbody tr.selected{background-color:var(--sys-color-state-hover-on-subtle)}table thead th{font:var(--sys-typescale-body4-medium)}table tbody th{font-weight:normal}table th[scope='row']{padding:3px 0;word-break:normal;overflow-wrap:anywhere}.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;padding:0;margin-left:var(--sys-size-3);white-space:nowrap}button.devtools-link{border:none;background:none;font-family:inherit;font-size:inherit;height:16px}\n/*# sourceURL=${import.meta.resolve("./table.css")} */`;const B={others:"{PH1} others"},j=e.i18n.registerUIStrings("panels/timeline/components/insights/Table.ts",B),W=e.i18n.getLocalizedString.bind(void 0,j),{html:K}=a;function J(e){return W(B.others,{PH1:e})}function V(e,t,s=10){if(0===e.length||0===s)return[];const i=s-1,n=e.slice(0,i).map(t.mapToRow.bind(t));return e.length>s?n.push(t.createAggregatedTableRow(e.slice(i))):e.length===s&&n.push(t.mapToRow(e[i])),n}class Y extends HTMLElement{#f=this.attachShadow({mode:"open"});#k;#$;#R;#I;#N;#C=new Map;#x=!1;#E=null;set data(e){this.#k=e.insight,this.#$=e.insight.sharedTableState,this.#R=e.headers,this.#I=e.rows,this.#x=this.#I.some(e=>e.overlays||e.subRows?.length),r.ScheduledRender.scheduleRender(this,this.#o)}connectedCallback(){r.ScheduledRender.scheduleRender(this,this.#o)}#_(e){if(!this.#N)return;if(!(e.target instanceof HTMLElement))return;const t=e.target.closest("tr");if(!t?.parentElement)return;const s=[...t.parentElement.children],i=t.sectionRowIndex;if(i===this.#E)return;for(const e of t.parentElement.querySelectorAll(".hover"))e.classList.remove("hover");let n=this.#C.get(this.#N[i]);for(;n;){s[this.#N.indexOf(n)].classList.add("hover"),n=this.#C.get(n)}this.#E=i,this.#O(t,i,{isHover:!0})}#A(e){if(!(e.target instanceof HTMLElement))return;const t=e.target.closest("tr");if(!t?.parentElement)return;const s=[...t.parentElement.children].indexOf(t);if(-1===s)return;const i=this.#N?.[s]?.overlays;1!==i?.length||"ENTRY_OUTLINE"!==i[0].type?this.#O(t,s,{sticky:!0}):this.dispatchEvent(new L(i[0].entry))}#D(){for(const e of this.shadowRoot?.querySelectorAll(".hover")??[])e.classList.remove("hover");this.#E=null,this.#O(null,null)}#O(e,t,s={}){if(this.#N&&this.#$&&this.#k&&(!this.#$.selectionIsSticky||s.sticky)){if(this.#$.selectionIsSticky&&e===this.#$.selectedRowEl&&(e=null,s.sticky=!1),e&&null!==t){const e=this.#N[t].overlays;e&&this.#k.toggleTemporaryOverlays(e,{updateTraceWindow:!s.isHover})}else this.#k.toggleTemporaryOverlays(null,{updateTraceWindow:!1});this.#$.selectedRowEl?.classList.remove("selected"),e?.classList.add("selected"),this.#$.selectedRowEl=e,this.#$.selectionIsSticky=s.sticky??!1}}async#o(){if(!this.#R||!this.#I)return;const e=this.#C;e.clear();const t=this.#R.length,s=[],i=[];function n(r,o,l=0){r&&e.set(o,r);const d=a.Directives.styleMap({paddingLeft:`calc(${l} * var(--sys-size-5))`,backgroundImage:"repeating-linear-gradient(\n              to right,\n              var(--sys-color-tonal-outline) 0 var(--sys-size-1),\n              transparent var(--sys-size-1) var(--sys-size-5)\n            )",backgroundPosition:"0 0",backgroundRepeat:"no-repeat",backgroundSize:`calc(${l} * var(--sys-size-5))`}),c=a.Directives.styleMap({color:l?"var(--sys-color-on-surface-subtle)":""}),h=o.values.map((e,s)=>0===s?K`<th
                scope="row"
                colspan=${s===o.values.length-1?t-s:1}
                style=${d}>${e}
              </th>`:K`<td>${e}</td>`);i.push(K`<tr style=${c}>${h}</tr>`),s.push(o);for(const e of o.subRows??[])n(o,e,l+1)}for(const e of this.#I)n(null,e);this.#N=s,a.render(K`<style>${q}</style>
      <table
          class=${a.Directives.classMap({interactive:this.#x})}
          @mouseleave=${this.#x?this.#D:null}>
        <thead>
          <tr>
          ${this.#R.map(e=>K`<th scope="col">${e}</th>`)}
          </tr>
        </thead>
        <tbody
          @mouseover=${this.#x?this.#_:null}
          @click=${this.#x?this.#A:null}
        >${i}</tbody>
      </table>`,this.#f,{host:this})}}customElements.define("devtools-performance-table",Y);var G=Object.freeze({__proto__:null,Table:Y,createLimitedRows:V,i18nString:W,renderOthersLabel:J});const{UIStrings:X,i18nString:Z,createOverlayForRequest:Q}=d.Insights.Models.Cache,{html:ee}=a;class te extends O{static litTagName=a.StaticHtml.literal`devtools-performance-cache`;internalName="cache";hasAskAiSupport(){return!0}mapToRow(t){return{values:[z(t.request),e.TimeUtilities.secondsToString(t.ttl)],overlays:[Q(t.request)]}}createAggregatedTableRow(e){return{values:[J(e.length),""],overlays:e.flatMap(e=>Q(e.request))}}renderContent(){if(!this.model)return a.nothing;const e=V([...this.model.requests].sort((e,t)=>t.request.args.data.decodedBodyLength-e.request.args.data.decodedBodyLength),this);return e.length?ee`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[Z(X.requestColumn),Z(X.cacheTTL)],rows:e}}>
        </devtools-performance-table>
      </div>`:ee`<div class="insight-section">${Z(X.noRequestsToCache)}</div>`}}customElements.define("devtools-performance-cache",te);var se=Object.freeze({__proto__:null,Cache:te}),ie=`ul{list-style:none;margin:0;padding:0;li{display:flex;align-items:center;justify-content:flex-start;gap:var(--sys-size-3);font:var(--sys-typescale-body4-medium);padding-block:var(--sys-size-3);span{padding-top:2px}}}.check-failed{color:var(--app-color-performance-bad)}.check-passed{color:var(--app-color-performance-good)}\n/*# sourceURL=${import.meta.resolve("./checklist.css")} */`;const ne={successAriaLabel:"Insight check passed: {PH1}",failedAriaLabel:"Insight check failed: {PH1}"},re=e.i18n.registerUIStrings("panels/timeline/components/insights/Checklist.ts",ne),oe=e.i18n.getLocalizedString.bind(void 0,re),{html:ae}=a;class le extends HTMLElement{#f=this.attachShadow({mode:"open"});#M;set checklist(e){this.#M=e,r.ScheduledRender.scheduleRender(this,this.#o)}connectedCallback(){r.ScheduledRender.scheduleRender(this,this.#o)}#L(e){const t=e.value?"check-circle":"clear",s=e.value?oe(ne.successAriaLabel,{PH1:e.label}):oe(ne.failedAriaLabel,{PH1:e.label});return ae`
        <devtools-icon
          aria-label=${s}
          name=${t}
          class=${e.value?"check-passed":"check-failed"}
        ></devtools-icon>
      `}async#o(){this.#M&&a.render(ae`
          <style>${ie}</style>
          <ul>
            ${Object.values(this.#M).map(e=>ae`<li>
                ${this.#L(e)}
                <span data-checklist-label>${e.label}</span>
            </li>`)}
          </ul>`,this.#f,{host:this})}}customElements.define("devtools-performance-checklist",le);var de=Object.freeze({__proto__:null,Checklist:le});const{html:ce}=a;class he extends HTMLElement{#f=this.attachShadow({mode:"open"});#U;#z;#H;#P;#F;#q;#B=new Map;set data(e){this.#U=e.backendNodeId,this.#z=e.frame,this.#H=e.options,this.#P=e.fallbackUrl,this.#F=e.fallbackHtmlSnippet,this.#q=e.fallbackText,r.ScheduledRender.scheduleRender(this,this.#o)}async#j(){if(void 0===this.#U)return;const e=this.#B.get(this.#U);if(e){if("NO_NODE_FOUND"===e)return;return e}const t=h.TargetManager.TargetManager.instance().primaryPageTarget(),s=t?.model(h.DOMModel.DOMModel);if(!s)return;const i=await s.pushNodesByBackendIdsToFrontend(new Set([this.#U])),n=i?.get(this.#U);if(!n)return void this.#B.set(this.#U,"NO_NODE_FOUND");if(n.frameId()!==this.#z)return void this.#B.set(this.#U,"NO_NODE_FOUND");const r=await u.Linkifier.Linkifier.linkify(n,this.#H);return this.#B.set(this.#U,r),r}async#o(){const e=await this.#j();let t;if(e)t=ce`<div class='node-link'>${e}</div>`;else if(this.#P){const e={tabStop:!0,showColumnNumber:!1,inlineFrameIndex:0,maxLength:20},s=g.Linkifier.Linkifier.linkifyURL(this.#P,e);t=ce`<div class='node-link'>
        <style>${n.textButtonStyles}</style>
        ${s}
      </div>`}else t=this.#F?ce`<pre style='text-wrap: auto'>${this.#F}</pre>`:this.#q?ce`<span>${this.#q}</span>`:a.nothing;a.render(t,this.#f,{host:this})}}customElements.define("devtools-performance-node-link",he);var me=Object.freeze({__proto__:null,NodeLink:he});const{UIStrings:ue,i18nString:ge}=d.Insights.Models.CLSCulprits,{html:ve}=a;class pe extends O{static litTagName=a.StaticHtml.literal`devtools-performance-cls-culprits`;internalName="cls-culprits";hasAskAiSupport(){return!0}createOverlays(){return this.model?this.model.createOverlays?.()??[]:[]}#W(e){this.dispatchEvent(new L(e))}#K(e){return 0===e.length?ve`<div class="insight-section">${ge(ue.noCulprits)}</div>`:ve`
      <div class="insight-section">
        <p class="list-title">${ge(ue.topCulprits)}:</p>
        <ul class="worst-culprits">
          ${e.map(e=>3===e.type?ve`
                <li>
                  ${e.description}
                  <devtools-performance-node-link
                    .data=${{backendNodeId:e.backendNodeId,frame:e.frame,fallbackUrl:e.url}}>
                  </devtools-performance-node-link>
                </li>`:ve`<li>${e.description}</li>`)}
        </ul>
      </div>`}renderContent(){if(!this.model||!this.bounds)return a.nothing;if(!this.model.clusters.length||!this.model.worstCluster)return ve`<div class="insight-section">${ge(ue.noLayoutShifts)}</div>`;const t=this.model.worstCluster,s=this.model.topCulpritsByCluster.get(t)??[],i=d.Types.Timing.Micro(t.ts-this.bounds.min),n=e.TimeUtilities.formatMicroSecondsTime(i);return ve`
      <div class="insight-section">
        <span class="worst-cluster">${ge(ue.worstCluster)}: <button type="button" class="timeline-link" @click=${()=>this.#W(t)}>${ge(ue.layoutShiftCluster,{PH1:n})}</button></span>
      </div>
      ${this.#K(s)}
    `}}customElements.define("devtools-performance-cls-culprits",pe);var fe=Object.freeze({__proto__:null,CLSCulprits:pe});const{html:ye}=a;class be extends O{static litTagName=a.StaticHtml.literal`devtools-performance-document-latency`;internalName="document-latency";hasAskAiSupport(){return!0}getEstimatedSavingsTime(){return this.model?.metricSavings?.FCP??null}renderContent(){return this.model?.data?ye`<devtools-performance-checklist .checklist=${this.model.data.checklist}></devtools-performance-checklist>`:a.nothing}}customElements.define("devtools-performance-document-latency",be);var Se=Object.freeze({__proto__:null,DocumentLatency:be});const{UIStrings:Te,i18nString:we}=d.Insights.Models.DOMSize,{html:ke}=a;class $e extends O{static litTagName=a.StaticHtml.literal`devtools-performance-dom-size`;internalName="dom-size";hasAskAiSupport(){return!0}#J(e){const t=[];if(e.maxDepth){const{nodeId:s,nodeName:i}=e.maxDepth,n=ke`
        <devtools-performance-node-link
          .data=${{backendNodeId:s,frame:e.frame,fallbackText:i}}>
        </devtools-performance-node-link>
      `;t.push({values:[we(Te.maxDOMDepth),n]})}if(e.maxChildren){const{nodeId:s,nodeName:i}=e.maxChildren,n=ke`
        <devtools-performance-node-link
          .data=${{backendNodeId:s,frame:e.frame,fallbackText:i}}>
        </devtools-performance-node-link>
      `;t.push({values:[we(Te.maxChildren),n]})}return t.length?ke`<div class="insight-section">
      <devtools-performance-table
        .data=${{insight:this,headers:[we(Te.statistic),we(Te.element)],rows:t}}>
      </devtools-performance-table>
    </div>`:a.nothing}#V(){if(!this.model||!this.model.largeUpdates.length)return null;const t=this.model.largeUpdates.map(t=>({values:[z(t.event,{text:t.label}),e.TimeUtilities.millisToString(t.duration)],overlays:[{type:"ENTRY_OUTLINE",entry:t.event,outlineReason:"INFO"}]}));return ke`<div class="insight-section">
      <div class="insight-description">${S(we(Te.topUpdatesDescription))}</div>
      <devtools-performance-table
        .data=${{insight:this,headers:["",we(Te.duration)],rows:t}}>
      </devtools-performance-table>
    </div>`}renderContent(){if(!this.model)return a.nothing;const e=this.model.maxDOMStats?.args.data;return e?ke`<div class="insight-section">
      <devtools-performance-table
        .data=${{insight:this,headers:[we(Te.statistic),we(Te.value)],rows:[{values:[we(Te.totalElements),e.totalElements]},{values:[we(Te.maxDOMDepth),e.maxDepth?.depth??0]},{values:[we(Te.maxChildren),e.maxChildren?.numChildren??0]}]}}>
      </devtools-performance-table>
    </div>
    ${this.#J(e)}
    ${this.#V()}
    `:a.nothing}}customElements.define("devtools-performance-dom-size",$e);var Re=Object.freeze({__proto__:null,DOMSize:$e});function Ie(e){if(e.request)return e.inline?z(e.request,{text:`(inline) ${v.StringUtilities.trimEndWithMaxLength(e.content??"",15)}`}):z(e.request);if(e.url)try{const t=new URL(e.url);return m.Helpers.shortenUrl(t)}catch{}return e.inline?`(inline) ${v.StringUtilities.trimEndWithMaxLength(e.content??"",15)}`:`script id: ${e.scriptId}`}const{UIStrings:Ne,i18nString:Ce}=d.Insights.Models.DuplicatedJavaScript,{html:xe}=a;class Ee extends O{static litTagName=a.StaticHtml.literal`devtools-performance-duplicated-javascript`;internalName="duplicated-javascript";#Y=null;#G(){return!!this.model&&this.model.scripts.some(e=>!!e.url)}hasAskAiSupport(){return!0}#X(){if(!this.model)return;this.#Y||(this.#Y=m.Treemap.createTreemapData({scripts:this.model.scripts},this.model.duplication));const e=this.insightSetKey??"devtools";m.Treemap.openTreemap(this.#Y,this.model.mainDocumentUrl,e)}getEstimatedSavingsTime(){return this.model?.metricSavings?.FCP??null}renderContent(){if(!this.model)return a.nothing;const t=[...this.model.duplicationGroupedByNodeModules.entries()].slice(0,10).map(([t,s])=>{const i=new Map;for(const{script:e}of s.duplicates)i.set(e,{type:"ENTRY_OUTLINE",entry:e.request,outlineReason:"ERROR"});return{values:[t,e.ByteUtilities.bytesToString(s.estimatedDuplicateBytes)],overlays:[...i.values()],subRows:s.duplicates.map(({script:t,attributedSize:s},n)=>{let r;const o=i.get(t);return o&&(r=[o]),{values:[Ie(t),0===n?"--":e.ByteUtilities.bytesToString(s)],overlays:r}})}});let s;return this.#G()&&(s=xe`<devtools-button
        .variant=${"outlined"}
        jslog=${l.action(`timeline.treemap.${this.internalName}-insight`).track({click:!0})}
        @click=${this.#X}
      >View Treemap</devtools-button>`),xe`
      ${s}
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[Ce(Ne.columnSource),Ce(Ne.columnDuplicatedBytes)],rows:t}}>
        </devtools-performance-table>
      </div>
    `}}customElements.define("devtools-performance-duplicated-javascript",Ee);var _e=Object.freeze({__proto__:null,DuplicatedJavaScript:Ee});const{UIStrings:Oe,i18nString:Ae}=d.Insights.Models.FontDisplay,{html:De}=a;class Me extends O{static litTagName=a.StaticHtml.literal`devtools-performance-font-display`;internalName="font-display";#Z=new Map;hasAskAiSupport(){return!0}createOverlays(){if(this.#Z.clear(),!this.model)return[];const e=this.model.createOverlays?.();if(!e)return[];for(const t of e.filter(e=>"ENTRY_OUTLINE"===e.type))this.#Z.set(t.entry,t);return e}mapToRow(t){const s=this.#Z.get(t.request);return{values:[z(t.request,{text:t.name}),e.TimeUtilities.millisToString(t.wastedTime)],overlays:s?[s]:[]}}createAggregatedTableRow(e){return{values:[J(e.length),""],overlays:e.map(e=>this.#Z.get(e.request)).filter(e=>!!e)}}getEstimatedSavingsTime(){return this.model?.metricSavings?.FCP??null}renderContent(){if(!this.model)return a.nothing;const e=V(this.model.fonts,this);return De`
      <div class="insight-section">
        ${De`<devtools-performance-table
          .data=${{insight:this,headers:[Ae(Oe.fontColumn),Ae(Oe.wastedTimeColumn)],rows:e}}>
        </devtools-performance-table>`}
      </div>`}}customElements.define("devtools-performance-font-display",Me);var Le=Object.freeze({__proto__:null,FontDisplay:Me});const{UIStrings:Ue,i18nString:ze,createOverlayForEvents:He}=d.Insights.Models.ForcedReflow,{html:Pe,nothing:Fe}=a;class qe extends O{static litTagName=a.StaticHtml.literal`devtools-performance-forced-reflow`;internalName="forced-reflow";hasAskAiSupport(){return!0}mapToRow(e){return{values:[this.#Q(e.bottomUpData)],overlays:He(e.relatedEvents)}}createAggregatedTableRow(e){return{values:[J(e.length)],overlays:e.flatMap(e=>He(e.relatedEvents))}}#Q(e){const t="display: flex; gap: 4px; overflow: hidden; white-space: nowrap";if(!e)return Pe`<div style=${t}>${ze(Ue.unattributed)}</div>`;const s=(new g.Linkifier.Linkifier).linkifyScriptLocation(null,e.scriptId,e.url,e.lineNumber,{columnNumber:e.columnNumber,showColumnNumber:!0,inlineFrameIndex:0,tabStop:!0});s instanceof HTMLElement&&(s.style.maxWidth="max-content",s.style.overflow="hidden",s.style.textOverflow="ellipsis",s.style.whiteSpace="normal",s.style.verticalAlign="top",s.style.textAlign="left",s.style.flex="1");const i=e.functionName||ze(Ue.anonymous);return Pe`<div style=${t}>${i}<span> @ </span> ${s}</div>`}renderContent(){if(!this.model)return a.nothing;const t=this.model.topLevelFunctionCallData,s=V(this.model.aggregatedBottomUpData,this);return Pe`
      ${t?Pe`
        <div class="insight-section">
          <devtools-performance-table
            .data=${{insight:this,headers:[ze(Ue.topTimeConsumingFunctionCall),ze(Ue.totalReflowTime)],rows:[{values:[this.#Q(t.topLevelFunctionCall),(i=d.Types.Timing.Micro(t.totalReflowTime),e.TimeUtilities.millisToString(v.Timing.microSecondsToMilliSeconds(i)))],overlays:He(t.topLevelFunctionCallEvents,"INFO")}]}}>
          </devtools-performance-table>
        </div>
      `:Fe}
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[ze(Ue.reflowCallFrames)],rows:s}}>
        </devtools-performance-table>
      </div>`;var i}}customElements.define("devtools-performance-forced-reflow",qe);var Be=Object.freeze({__proto__:null,ForcedReflow:qe});const{UIStrings:je,i18nString:We,createOverlayForRequest:Ke}=d.Insights.Models.ImageDelivery,{html:Je}=a;class Ve extends O{static litTagName=a.StaticHtml.literal`devtools-performance-image-delivery`;internalName="image-delivery";mapToRow(e){return{values:[P(e.request)],overlays:[Ke(e.request)]}}hasAskAiSupport(){return!0}createAggregatedTableRow(e){return{values:[J(e.length)],overlays:e.map(e=>Ke(e.request))}}renderContent(){if(!this.model)return a.nothing;const e=V([...this.model.optimizableImages].sort((e,t)=>t.request.args.data.decodedBodyLength-e.request.args.data.decodedBodyLength),this);return e.length?Je`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[We(je.optimizeFile)],rows:e}}>
        </devtools-performance-table>
      </div>
    `:Je`<div class="insight-section">${We(je.noOptimizableImages)}</div>`}}customElements.define("devtools-performance-image-delivery",Ve);var Ye=Object.freeze({__proto__:null,ImageDelivery:Ve});const{UIStrings:Ge,i18nString:Xe,createOverlaysForSubpart:Ze}=d.Insights.Models.INPBreakdown,{html:Qe}=a;class et extends O{static litTagName=a.StaticHtml.literal`devtools-performance-inp-breakdown`;internalName="inp";hasAskAiSupport(){return void 0!==this.model?.longestInteractionEvent}renderContent(){const t=this.model?.longestInteractionEvent;if(!t)return Qe`<div class="insight-section">${Xe(Ge.noInteractions)}</div>`;const s=t=>e.TimeUtilities.millisToString(v.Timing.microSecondsToMilliSeconds(t));return Qe`
      <div class="insight-section">
        ${Qe`<devtools-performance-table
          .data=${{insight:this,headers:[Xe(Ge.subpart),Xe(Ge.duration)],rows:[{values:[Xe(Ge.inputDelay),s(t.inputDelay)],overlays:Ze(t,0)},{values:[Xe(Ge.processingDuration),s(t.mainThreadHandling)],overlays:Ze(t,1)},{values:[Xe(Ge.presentationDelay),s(t.presentationDelay)],overlays:Ze(t,2)}]}}>
        </devtools-performance-table>`}
      </div>`}}customElements.define("devtools-performance-inp-breakdown",et);var tt=Object.freeze({__proto__:null,INPBreakdown:et});const{UIStrings:st,i18nString:it}=d.Insights.Models.LCPBreakdown,{html:nt}=a;class rt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-lcp-breakdown`;internalName="lcp-by-phase";#ee=null;hasAskAiSupport(){return!0}createOverlays(){if(this.#ee=null,!this.model||!this.model.subparts||!this.model.lcpTs)return[];const e=this.model.createOverlays?.();return e?(this.#ee=e[0],e):[]}#te(){if(!this.fieldMetrics)return null;const{ttfb:t,loadDelay:s,loadDuration:i,renderDelay:n}=this.fieldMetrics.lcpBreakdown;if(!(t&&s&&i&&n))return null;const r=e.TimeUtilities.preciseMillisToString(d.Helpers.Timing.microToMilli(t.value)),o=e.TimeUtilities.preciseMillisToString(d.Helpers.Timing.microToMilli(s.value)),a=e.TimeUtilities.preciseMillisToString(d.Helpers.Timing.microToMilli(i.value)),l=e.TimeUtilities.preciseMillisToString(d.Helpers.Timing.microToMilli(n.value)),c=[{values:[it(st.timeToFirstByte),r]},{values:[it(st.resourceLoadDelay),o]},{values:[it(st.resourceLoadDuration),a]},{values:[it(st.elementRenderDelay),l]}];return nt`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[it(st.subpart),it(st.fieldDuration)],rows:c}}>
        </devtools-performance-table>
      </div>
    `}toggleTemporaryOverlays(e,t){super.toggleTemporaryOverlays(e,{...t,updateTraceWindowPercentage:0})}getOverlayOptionsForInitialOverlays(){return{updateTraceWindow:!0,updateTraceWindowPercentage:0}}renderContent(){if(!this.model)return a.nothing;const{subparts:t}=this.model;if(!t)return nt`<div class="insight-section">${it(st.noLcp)}</div>`;const s=Object.values(t).map(t=>{const s=this.#ee?.sections.find(e=>t.label===e.label),i=d.Helpers.Timing.microToMilli(t.range);return{values:[t.label,e.TimeUtilities.preciseMillisToString(i)],overlays:s&&[{type:"TIMESPAN_BREAKDOWN",sections:[s]}]}}),i=[nt`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[it(st.subpart),it(st.duration)],rows:s}}>
        </devtools-performance-table>
      </div>`],n=this.#te();return n&&i.push(n),nt`${i}`}}customElements.define("devtools-performance-lcp-breakdown",rt);var ot=Object.freeze({__proto__:null,LCPBreakdown:rt});const{UIStrings:at,i18nString:lt,getImageData:dt}=d.Insights.Models.LCPDiscovery,{html:ct}=a,ht=e.i18n.registerUIStrings("models/trace/insights/LCPDiscovery.ts",at);class mt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-lcp-discovery`;internalName="lcp-discovery";hasAskAiSupport(){return!0}createOverlays(){if(!this.model)return[];const e=this.model.createOverlays?.();if(!e)return[];const t=dt(this.model);if(!t?.discoveryDelay)return[];const s=e.find(e=>"TIMESPAN_BREAKDOWN"===e.type)?.sections[0];return s&&(s.label=this.#se(t.discoveryDelay)),e}getEstimatedSavingsTime(){return this.model?dt(this.model)?.estimatedSavings??null:null}#se(t){const s=document.createElement("span");return s.classList.add("discovery-time-ms"),s.innerText=e.TimeUtilities.formatMicroSecondsAsMillisFixed(t),p.getFormatLocalizedString(ht,at.lcpLoadDelay,{PH1:s})}renderContent(){if(!this.model)return a.nothing;const e=dt(this.model);if(!e)return this.model.lcpEvent?ct`<div class="insight-section">${lt(at.noLcpResource)}</div>`:ct`<div class="insight-section">${lt(at.noLcp)}</div>`;let t;return e.discoveryDelay&&(t=ct`<div>${this.#se(e.discoveryDelay)}</div>`),ct`
      <div class="insight-section">
        <devtools-performance-checklist class="insight-section" .checklist=${e.checklist}></devtools-performance-checklist>
        <div class="insight-section">${P(e.request)}${t}</div>
      </div>`}}customElements.define("devtools-performance-lcp-discovery",mt);var ut=Object.freeze({__proto__:null,LCPDiscovery:mt});const{UIStrings:gt,i18nString:vt}=d.Insights.Models.LegacyJavaScript,{html:pt}=a;class ft extends O{static litTagName=a.StaticHtml.literal`devtools-performance-legacy-javascript`;internalName="legacy-javascript";getEstimatedSavingsTime(){return this.model?.metricSavings?.FCP??null}hasAskAiSupport(){return!0}async#ie(e,t){const s=h.TargetManager.TargetManager.instance().primaryPageTarget();if(!s)return;const i=s.model(h.DebuggerModel.DebuggerModel);if(!i)return;const n=new h.DebuggerModel.Location(i,e.scriptId,t.line,t.column);if(!n)return;const r=await f.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().rawLocationToUILocation(n);await u.Revealer.reveal(r)}renderContent(){if(!this.model)return a.nothing;const t=[...this.model.legacyJavaScriptResults.entries()].slice(0,10).map(([t,s])=>{const i=[];return t.request&&i.push({type:"ENTRY_OUTLINE",entry:t.request,outlineReason:"ERROR"}),{values:[Ie(t),e.ByteUtilities.bytesToString(s.estimatedByteSavings)],overlays:i,subRows:s.matches.map(e=>({values:[pt`<span @click=${()=>this.#ie(t,e)} title=${`${t.url}:${e.line}:${e.column}`}>${e.name}</span>`]}))}});return pt`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[vt(gt.columnScript),vt(gt.columnWastedBytes)],rows:t}}>
        </devtools-performance-table>
      </div>
    `}}customElements.define("devtools-performance-legacy-javascript",ft);var yt=Object.freeze({__proto__:null,LegacyJavaScript:ft});const{UIStrings:bt,i18nString:St,createOverlayForRequest:Tt}=d.Insights.Models.ModernHTTP,{html:wt}=a;class kt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-modern-http`;internalName="modern-http";hasAskAiSupport(){return!0}getEstimatedSavingsTime(){return this.model?.metricSavings?.LCP??null}createOverlays(){return this.model?.http1Requests.map(e=>Tt(e))??[]}mapToRow(e){return{values:[z(e),e.args.data.protocol],overlays:[Tt(e)]}}createAggregatedTableRow(e){return{values:[J(e.length),""],overlays:e.map(e=>Tt(e))}}renderContent(){if(!this.model)return a.nothing;const e=V(this.model.http1Requests,this);return e.length?wt`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[St(bt.request),St(bt.protocol)],rows:e}}>
        </devtools-performance-table>
      </div>`:wt`<div class="insight-section">${St(bt.noOldProtocolRequests)}</div>`}}customElements.define("devtools-performance-modern-http",kt);var $t=Object.freeze({__proto__:null,ModernHTTP:kt}),Rt=`.insight-body{--override-timeline-link-text-decoration:none;--override-timeline-link-text-color:var(--sys-color-on-surface);.max-time{text-align:center;.longest{color:var(--sys-color-error)}}.section-title{font:var(--sys-typescale-body4-bold);padding-bottom:var(--sys-size-2)}}\n/*# sourceURL=${import.meta.resolve("./networkDependencyTreeInsight.css")} */`;const{UIStrings:It,i18nString:Nt}=d.Insights.Models.NetworkDependencyTree,{html:Ct}=a;class xt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-long-critical-network-tree`;internalName="long-critical-network-tree";#ne=null;#re=0;hasAskAiSupport(){return!0}#oe(e){const t=[];return e.forEach(e=>t.push({type:"ENTRY_OUTLINE",entry:e,outlineReason:"ERROR"})),t}#ae(t){const s=a.Directives.styleMap({display:"flex","--override-timeline-link-text-color":t.isLongest?"var(--sys-color-error)":"",color:t.isLongest?"var(--sys-color-error)":"",backgroundColor:this.#ne?.has(t.request)?"var(--sys-color-state-hover-on-subtle)":""}),i=a.Directives.styleMap({flex:"auto"});return Ct`
      <div style=${s}>
        <span style=${i}>${z(t.request)}</span>
        <span>
          ${e.TimeUtilities.formatMicroSecondsTime(d.Types.Timing.Micro(t.timeFromInitialRequest))}
        </span>
      </div>
    `}mapNetworkDependencyToRow(e){return this.#re>=5?(0===e.children.length&&this.#re++,null):(0===e.children.length&&this.#re++,{values:[this.#ae(e)],overlays:this.#oe(e.relatedRequests),subRows:e.children.map(e=>this.mapNetworkDependencyToRow(e)).filter(e=>null!==e)})}#le(e){if(0===e.length)return null;const t=[{values:[],subRows:e.map(e=>this.mapNetworkDependencyToRow(e)).filter(e=>null!==e)}];return this.#re>5&&t.push({values:[J(this.#re-5)]}),Ct`
      <devtools-performance-table
          .data=${{insight:this,headers:[Nt(It.columnRequest),Nt(It.columnTime)],rows:t}}>
      </devtools-performance-table>
    `}#de(){return this.model?this.model.rootNodes.length?Ct`
      <style>${Rt}</style>
      <div class="insight-section">
        <div class="max-time">
          ${Nt(It.maxCriticalPathLatency)}
          <br>
          <span class='longest'> ${e.TimeUtilities.formatMicroSecondsTime(this.model.maxTime)}</span>
        </div>
      </div>
      <div class="insight-section">
        ${this.#le(this.model.rootNodes)}
      </div>
    `:Ct`
        <style>${Rt}</style>
        <div class="insight-section">${Nt(It.noNetworkDependencyTree)}</div>
      `:a.nothing}#ce(){if(!this.model)return a.nothing;if(this.model.preconnectedOrigins.length<=d.Insights.Models.NetworkDependencyTree.TOO_MANY_PRECONNECTS_THRESHOLD)return a.nothing;const e=a.Directives.styleMap({backgroundColor:"var(--sys-color-surface-yellow)",padding:" var(--sys-size-5) var(--sys-size-8);",display:"flex"});return Ct`
      <div style=${e}>
        ${S(Nt(It.tooManyPreconnectLinksWarning))}
      </div>
    `}#he(){if(!this.model)return a.nothing;const e=Ct`
      <style>${Rt}</style>
      <div class='section-title'>${Nt(It.preconnectOriginsTableTitle)}</div>
      <div class="insight-description">${S(Nt(It.preconnectOriginsTableDescription))}</div>
    `;if(!this.model.preconnectedOrigins.length)return Ct`
        <div class="insight-section">
          ${e}
          ${Nt(It.noPreconnectOrigins)}
        </div>
      `;const t=this.model.preconnectedOrigins.map(e=>{const t=[];if(e.unused&&t.push({values:[S(Nt(It.unusedWarning))]}),e.crossorigin&&t.push({values:[S(Nt(It.crossoriginWarning))]}),"ResponseHeader"===e.source)return{values:[e.url,z(e.request,{text:e.headerText})],subRows:t};const s=Ct`
        <devtools-performance-node-link
          .data=${{backendNodeId:e.node_id,frame:e.frame,fallbackHtmlSnippet:`<link rel="preconnect" href="${e.url}">`}}>
        </devtools-performance-node-link>`;return{values:[e.url,s],subRows:t}});return Ct`
      <div class="insight-section">
        ${e}
        ${this.#ce()}
        <devtools-performance-table
          .data=${{insight:this,headers:[Nt(It.columnOrigin),Nt(It.columnSource)],rows:t}}>
        </devtools-performance-table>
      </div>
    `}#me(){if(!this.model)return a.nothing;const t=Ct`
      <style>${Rt}</style>
      <div class='section-title'>${Nt(It.estSavingTableTitle)}</div>
      <div class="insight-description">${S(Nt(It.estSavingTableDescription))}</div>
    `;if(!this.model.preconnectCandidates.length)return Ct`
        <div class="insight-section">
          ${t}
          ${Nt(It.noPreconnectCandidates)}
        </div>
      `;const s=this.model.preconnectCandidates.map(t=>({values:[t.origin,e.TimeUtilities.millisToString(t.wastedMs)]}));return Ct`
      <div class="insight-section">
        ${t}
        <devtools-performance-table
          .data=${{insight:this,headers:[Nt(It.columnOrigin),Nt(It.columnWastedMs)],rows:s}}>
        </devtools-performance-table>
      </div>
    `}renderContent(){return Ct`
      ${this.#de()}
      ${this.#he()}
      ${this.#me()}
    `}}customElements.define("devtools-performance-long-critical-network-tree",xt);var Et=Object.freeze({__proto__:null,MAX_CHAINS_TO_SHOW:5,NetworkDependencyTree:xt});const{UIStrings:_t,i18nString:Ot,createOverlayForRequest:At}=d.Insights.Models.RenderBlocking,{html:Dt}=a;class Mt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-render-blocking-requests`;internalName="render-blocking-requests";mapToRow(t){return{values:[z(t),e.TimeUtilities.formatMicroSecondsTime(t.dur)],overlays:[At(t)]}}createAggregatedTableRow(e){return{values:[J(e.length),""],overlays:e.map(e=>At(e))}}hasAskAiSupport(){return!!this.model}getEstimatedSavingsTime(){return this.model?.metricSavings?.FCP??null}renderContent(){if(!this.model)return a.nothing;const e=this.model.renderBlockingRequests;if(!e.length)return Dt`<div class="insight-section">${Ot(_t.noRenderBlocking)}</div>`;const t=V(e,this);return Dt`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[Ot(_t.renderBlockingRequest),Ot(_t.duration)],rows:t}}>
        </devtools-performance-table>
      </div>
    `}}customElements.define("devtools-performance-render-blocking-requests",Mt);var Lt=Object.freeze({__proto__:null,RenderBlocking:Mt});const{UIStrings:Ut,i18nString:zt}=d.Insights.Models.SlowCSSSelector,{html:Ht}=a;class Pt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-slow-css-selector`;internalName="slow-css-selector";#ue=new Map;hasAskAiSupport(){return!0}async toSourceFileLocation(e,t){if(!e)return;const s=e.styleSheetHeaderForId(t.style_sheet_id);if(!s?.resourceURL())return;const i=JSON.stringify({selectorText:t.selector,styleSheetId:t.style_sheet_id});let n=this.#ue.get(i);if(!n){const s=await e.agent.invoke_getLocationForSelector({selectorText:t.selector,styleSheetId:t.style_sheet_id});if(s.getError()||!s.ranges)return;n=s.ranges,this.#ue.set(i,n)}return n.map((e,t)=>({url:s.resourceURL(),lineNumber:e.startLine,columnNumber:e.startColumn,linkText:`[${t+1}]`,title:`${s.id} line ${e.startLine+1}:${e.startColumn+1}`}))}async getSelectorLinks(e,t){if(!e)return a.nothing;if(!t.style_sheet_id)return a.nothing;const s=await this.toSourceFileLocation(e,t);if(!s)return a.nothing;return Ht`
    ${s.map((e,t)=>{const i=t!==s.length-1?", ":"";return Ht`<devtools-linkifier .data=${e}></devtools-linkifier>${i}`})}`}renderContent(){if(!this.model)return a.nothing;const t=h.TargetManager.TargetManager.instance().primaryPageTarget(),s=t?.model(h.CSSModel.CSSModel);if(!this.model.topSelectorMatchAttempts&&!this.model.topSelectorElapsedMs)return Ht`<div class="insight-section">${zt(Ut.enableSelectorData)}</div>`;const i=[Ht`
      <div class="insight-section">
        <devtools-performance-table
          .data=${{insight:this,headers:[zt(Ut.total),""],rows:[{values:[zt(Ut.matchAttempts),this.model.totalMatchAttempts]},{values:[zt(Ut.matchCount),this.model.totalMatchCount]},{values:[zt(Ut.elapsed),e.TimeUtilities.millisToString(this.model.totalElapsedMs)]}]}}>
        </devtools-performance-table>
      </div>
    `];if(this.model.topSelectorElapsedMs){const t=this.model.topSelectorElapsedMs;i.push(Ht`
        <div class="insight-section">
          <devtools-performance-table
            .data=${{insight:this,headers:[`${zt(Ut.topSelectorElapsedTime)}: ${n=d.Types.Timing.Micro(t["elapsed (us)"]),e.TimeUtilities.millisToString(v.Timing.microSecondsToMilliSeconds(n))}`],rows:[{values:[Ht`${t.selector} ${a.Directives.until(this.getSelectorLinks(s,t))}`]}]}} as TableData>
          </devtools-performance-table>
        </div>
      `)}var n;if(this.model.topSelectorMatchAttempts){const e=this.model.topSelectorMatchAttempts;i.push(Ht`
        <div class="insight-section">
          <devtools-performance-table
            .data=${{insight:this,headers:[`${zt(Ut.topSelectorMatchAttempt)}: ${e.match_attempts}`],rows:[{values:[Ht`${e.selector} ${a.Directives.until(this.getSelectorLinks(s,e))}`]}]}} as TableData}>
          </devtools-performance-table>
        </div>
      `)}return Ht`${i}`}}customElements.define("devtools-performance-slow-css-selector",Pt);var Ft=Object.freeze({__proto__:null,SlowCSSSelector:Pt});const{UIStrings:qt,i18nString:Bt,createOverlaysForSummary:jt}=d.Insights.Models.ThirdParties,{html:Wt}=a;class Kt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-third-parties`;internalName="third-parties";#ge={mapToRow:t=>({values:[t.entity.name,e.TimeUtilities.millisToString(t.mainThreadTime)],overlays:jt(t)}),createAggregatedTableRow:t=>{const s=t.reduce((e,t)=>e+t.mainThreadTime,0);return{values:[J(t.length),e.TimeUtilities.millisToString(s)],overlays:t.flatMap(e=>jt(e)??[])}}};#ve={mapToRow:t=>({values:[t.entity.name,e.ByteUtilities.formatBytesToKb(t.transferSize)],overlays:jt(t)}),createAggregatedTableRow:t=>{const s=t.reduce((e,t)=>e+t.transferSize,0);return{values:[J(t.length),e.ByteUtilities.formatBytesToKb(s)],overlays:t.flatMap(e=>jt(e)??[])}}};hasAskAiSupport(){return!0}renderContent(){if(!this.model)return a.nothing;let e=this.model.entitySummaries??[];if(this.model.firstPartyEntity&&(e=e.filter(e=>e.entity!==this.model?.firstPartyEntity||null)),!e.length)return Wt`<div class="insight-section">${Bt(qt.noThirdParties)}</div>`;const t=e.toSorted((e,t)=>t.transferSize-e.transferSize),s=e.toSorted((e,t)=>t.mainThreadTime-e.mainThreadTime),i=[];if(t.length){const e=V(t,this.#ve,5);i.push(Wt`
        <div class="insight-section">
          <devtools-performance-table
            .data=${{insight:this,headers:[Bt(qt.columnThirdParty),Bt(qt.columnTransferSize)],rows:e}}>
          </devtools-performance-table>
        </div>
      `)}if(s.length){const e=V(s,this.#ge,5);i.push(Wt`
        <div class="insight-section">
          <devtools-performance-table
            .data=${{insight:this,headers:[Bt(qt.columnThirdParty),Bt(qt.columnMainThreadTime)],rows:e}}>
          </devtools-performance-table>
        </div>
      `)}return Wt`${i}`}}customElements.define("devtools-performance-third-parties",Kt);var Jt=Object.freeze({__proto__:null,ThirdParties:Kt}),Vt=Object.freeze({__proto__:null});const{html:Yt}=a;class Gt extends O{static litTagName=a.StaticHtml.literal`devtools-performance-viewport`;internalName="viewport";hasAskAiSupport(){return!0}getEstimatedSavingsTime(){return this.model?.metricSavings?.INP??null}renderContent(){if(!this.model||!this.model.viewportEvent)return a.nothing;const e=this.model.viewportEvent.args.data.node_id;return void 0===e?a.nothing:Yt`
      <div>
        <devtools-performance-node-link
          .data=${{backendNodeId:e,frame:this.model.viewportEvent.args.data.frame??"",options:{tooltip:this.model.viewportEvent.args.data.content},fallbackHtmlSnippet:`<meta name=viewport content="${this.model.viewportEvent.args.data.content}">`}}>
        </devtools-performance-node-link>
      </div>`}}customElements.define("devtools-performance-viewport",Gt);var Xt=Object.freeze({__proto__:null,Viewport:Gt});export{A as BaseInsightComponent,fe as CLSCulprits,se as Cache,de as Checklist,Re as DOMSize,Se as DocumentLatency,_e as DuplicatedJavaScript,F as EventRef,Le as FontDisplay,Be as ForcedReflow,T as Helpers,tt as INPBreakdown,Ye as ImageDelivery,ot as LCPBreakdown,ut as LCPDiscovery,yt as LegacyJavaScript,$t as ModernHTTP,Et as NetworkDependencyTree,me as NodeLink,Lt as RenderBlocking,N as SidebarInsight,Ft as SlowCSSSelector,G as Table,Jt as ThirdParties,Vt as Types,Xt as Viewport};
//# sourceMappingURL=insights.js.map
