import*as e from"../../../services/trace_bounds/trace_bounds.js";import*as t from"../../../core/i18n/i18n.js";import*as i from"../../../models/trace/trace.js";import*as n from"../../../ui/components/helpers/helpers.js";import*as s from"../../../ui/legacy/legacy.js";import*as o from"../../../ui/lit/lit.js";import*as r from"../../../ui/visual_logging/visual_logging.js";import"../../../ui/components/icon_button/icon_button.js";import"../../../ui/components/menus/menus.js";import*as a from"../../../core/common/common.js";import*as l from"../../../core/sdk/sdk.js";import*as d from"../../mobile_throttling/mobile_throttling.js";import*as c from"../../../core/platform/platform.js";import*as g from"../../../ui/i18n/i18n.js";import"../../../ui/components/tooltips/tooltips.js";import*as h from"../../../ui/components/buttons/buttons.js";import*as p from"../../../core/host/host.js";import"../../../ui/components/dialogs/dialogs.js";import*as u from"../../../models/crux-manager/crux-manager.js";import*as m from"../../../ui/components/render_coordinator/render_coordinator.js";import*as v from"../../../ui/components/input/input.js";import*as b from"../../../models/workspace/workspace.js";import*as f from"../../../models/trace/helpers/helpers.js";import*as y from"../../../ui/legacy/components/utils/utils.js";import*as w from"./insights/insights.js";import"../../../ui/components/settings/settings.js";import*as x from"../../../ui/legacy/theme_support/theme_support.js";import*as S from"../../../core/root/root.js";import*as k from"../../../models/emulation/emulation.js";import*as C from"../../../models/live-metrics/live-metrics.js";import*as $ from"../../../ui/components/legacy_wrapper/legacy_wrapper.js";import"../../../ui/components/markdown_view/markdown_view.js";import*as T from"../../../third_party/marked/marked.js";import"../../../ui/components/request_link_icon/request_link_icon.js";import*as L from"../../../ui/legacy/components/perf_ui/perf_ui.js";import*as P from"../utils/utils.js";import*as I from"../../../models/ai_assistance/ai_assistance.js";function M(e){const t=[e];let i=e;for(;null!==i.child;){const e=i.child;null!==e&&(t.push(e),i=e)}return t}var R=Object.freeze({__proto__:null,Breadcrumbs:class{initialBreadcrumb;activeBreadcrumb;constructor(e){this.initialBreadcrumb={window:e,child:null};let t=this.initialBreadcrumb;for(;null!==t.child;)t=t.child;this.activeBreadcrumb=t}add(e){if(!this.isTraceWindowWithinTraceWindow(e,this.activeBreadcrumb.window))throw new Error("Can not add a breadcrumb that is equal to or is outside of the parent breadcrumb TimeWindow");const t={window:e,child:null};return this.activeBreadcrumb.child=t,this.setActiveBreadcrumb(t,{removeChildBreadcrumbs:!1,updateVisibleWindow:!0}),t}isTraceWindowWithinTraceWindow(e,t){return e.min>=t.min&&e.max<=t.max&&!(e.min===t.min&&e.max===t.max)}setInitialBreadcrumbFromLoadedModifications(e){this.initialBreadcrumb=e;let t=e;for(;null!==t.child;)t=t.child;this.setActiveBreadcrumb(t,{removeChildBreadcrumbs:!1,updateVisibleWindow:!0})}setActiveBreadcrumb(t,i){i.removeChildBreadcrumbs&&(t.child=null),this.activeBreadcrumb=t,e.TraceBounds.BoundsManager.instance().setMiniMapBounds(t.window),i.updateVisibleWindow&&e.TraceBounds.BoundsManager.instance().setTimelineVisibleWindow(t.window)}},flattenBreadcrumbs:M}),E=`.breadcrumbs{display:none;align-items:center;height:29px;padding:3px;overflow:scroll hidden}.breadcrumbs::-webkit-scrollbar{display:none}.breadcrumb{padding:2px 6px;border-radius:4px}.breadcrumb:hover{background-color:var(--sys-color-state-hover-on-subtle)}.range{font-size:12px;white-space:nowrap}.active-breadcrumb{font-weight:bold;color:var(--app-color-active-breadcrumb)}\n/*# sourceURL=${import.meta.resolve("./breadcrumbsUI.css")} */`;const{render:D,html:H}=o,F={activateBreadcrumb:"Activate breadcrumb",removeChildBreadcrumbs:"Remove child breadcrumbs"},N=t.i18n.registerUIStrings("panels/timeline/components/BreadcrumbsUI.ts",F),O=t.i18n.getLocalizedString.bind(void 0,N);class z extends Event{breadcrumb;childBreadcrumbsRemoved;static eventName="breadcrumbactivated";constructor(e,t){super(z.eventName),this.breadcrumb=e,this.childBreadcrumbsRemoved=t}}class A extends HTMLElement{#e=this.attachShadow({mode:"open"});#t=null;#i=null;set data(e){this.#t=e.initialBreadcrumb,this.#i=e.activeBreadcrumb,n.ScheduledRender.scheduleRender(this,this.#n)}#s(e){this.#i=e,this.dispatchEvent(new z(e))}#o(){const e=this.#e.querySelector(".breadcrumbs");e&&(e.style.display="flex",requestAnimationFrame(()=>{e.scrollWidth-e.clientWidth>0&&requestAnimationFrame(()=>{e.scrollLeft=e.scrollWidth-e.clientWidth})}))}#r(e,t){const i=new s.ContextMenu.ContextMenu(e);i.defaultSection().appendItem(O(F.activateBreadcrumb),()=>{this.dispatchEvent(new z(t))}),i.defaultSection().appendItem(O(F.removeChildBreadcrumbs),()=>{this.dispatchEvent(new z(t,!0))}),i.show()}#a(e,n){const s=i.Helpers.Timing.microToMilli(e.window.range);return H`
          <div class="breadcrumb" @contextmenu=${t=>this.#r(t,e)} @click=${()=>this.#s(e)}
          jslog=${r.item("timeline.breadcrumb-select").track({click:!0})}>
           <span class="${e===this.#i?"active-breadcrumb":""} range">
            ${0===n?`Full range (${t.TimeUtilities.preciseMillisToString(s,2)})`:`${t.TimeUtilities.preciseMillisToString(s,2)}`}
            </span>
          </div>
          ${null!==e.child?H`
            <devtools-icon name="chevron-right" class="medium">`:""}
      `}#n(){const e=H`
      <style>${E}</style>
      ${null===this.#t?o.nothing:H`<div class="breadcrumbs" jslog=${r.section("breadcrumbs")}>
        ${M(this.#t).map((e,t)=>this.#a(e,t))}
      </div>`}
    `;D(e,this.#e,{host:this}),this.#t?.child&&this.#o()}}customElements.define("devtools-breadcrumbs-ui",A);var U=Object.freeze({__proto__:null,BreadcrumbActivatedEvent:z,BreadcrumbsUI:A}),_=`@scope to (devtools-widget > *){:scope{display:flex;align-items:center;max-width:100%;height:20px}devtools-icon[name="info"]{margin-left:var(--sys-size-3);width:var(--sys-size-8);height:var(--sys-size-8)}devtools-select-menu{min-width:160px;max-width:100%;height:20px}}\n/*# sourceURL=${import.meta.resolve("./cpuThrottlingSelector.css")} */`;const{render:B,html:V}=o,W={cpu:"CPU: {PH1}",cpuThrottling:"CPU throttling: {PH1}",recommendedThrottling:"{PH1} – recommended",recommendedThrottlingReason:"Consider changing setting to simulate real user environments",calibrate:"Calibrate…",recalibrate:"Recalibrate…",labelCalibratedPresets:"Calibrated presets"},j=t.i18n.registerUIStrings("panels/timeline/components/CPUThrottlingSelector.ts",W),q=t.i18n.getLocalizedString.bind(void 0,j),K=(e,t,i)=>{let n;e.recommendedOption&&e.currentOption===l.CPUThrottlingManager.NoThrottlingOption&&(n=V`<devtools-icon
        title=${q(W.recommendedThrottlingReason)}
        name=info></devtools-icon>`);const s=e.currentOption.title(),a=e.throttling.low||e.throttling.mid,d=q(a?W.recalibrate:W.calibrate),c=V`
    <style>${_}</style>
    <devtools-select-menu
          @selectmenuselected=${e.onMenuItemSelected}
          .showDivider=${!0}
          .showArrow=${!0}
          .sideButton=${!1}
          .showSelectedItem=${!0}
          .jslogContext=${"cpu-throttling"}
          .buttonTitle=${q(W.cpu,{PH1:s})}
          .title=${q(W.cpuThrottling,{PH1:s})}
        >
        ${e.groups.map(t=>V`
            <devtools-menu-group .name=${t.name} .title=${t.name}>
              ${t.items.map(t=>{const i=t===e.recommendedOption?q(W.recommendedThrottling,{PH1:t.title()}):t.title(),n=t.rate();return V`
                  <devtools-menu-item
                    .value=${t.calibratedDeviceType??n}
                    .selected=${e.currentOption===t}
                    .disabled=${0===n}
                    .title=${i}
                    jslog=${r.item(t.jslogContext).track({click:!0})}
                  >
                    ${i}
                  </devtools-menu-item>
                `})}
              ${"Calibrated presets"===t.name?V`<devtools-menu-item
                .value=${-1}
                .title=${d}
                jslog=${r.action("cpu-throttling-selector-calibrate").track({click:!0})}
                @click=${e.onCalibrateClick}
              >
                ${d}
              </devtools-menu-item>`:o.nothing}
            </devtools-menu-group>`)}
    </devtools-select-menu>
    ${n}
  `;B(c,i)};class Y extends s.Widget.Widget{#l;#d=null;#c=[];#g;#h;constructor(e,t=K){super(e),this.#l=l.CPUThrottlingManager.CPUThrottlingManager.instance().cpuThrottlingOption(),this.#g=a.Settings.Settings.instance().createSetting("calibrated-cpu-throttling",{},"Global"),this.#p(),this.#h=t}set recommendedOption(e){this.#d=e,this.requestUpdate()}wasShown(){super.wasShown(),l.CPUThrottlingManager.CPUThrottlingManager.instance().addEventListener("RateChanged",this.#u,this),this.#g.addChangeListener(this.#m,this),this.#u()}willHide(){super.willHide(),this.#g.removeChangeListener(this.#m,this),l.CPUThrottlingManager.CPUThrottlingManager.instance().removeEventListener("RateChanged",this.#u,this)}#u(){this.#l=l.CPUThrottlingManager.CPUThrottlingManager.instance().cpuThrottlingOption(),this.requestUpdate()}#m(){this.#p(),this.requestUpdate()}#v(e){let t;if("string"==typeof e.itemValue)"low-tier-mobile"===e.itemValue?t=l.CPUThrottlingManager.CalibratedLowTierMobileThrottlingOption:"mid-tier-mobile"===e.itemValue&&(t=l.CPUThrottlingManager.CalibratedMidTierMobileThrottlingOption);else{const i=Number(e.itemValue);t=d.ThrottlingPresets.ThrottlingPresets.cpuThrottlingPresets.find(e=>!e.calibratedDeviceType&&e.rate()===i)}t&&d.ThrottlingManager.throttlingManager().setCPUThrottlingOption(t)}#b(){a.Revealer.reveal(this.#g)}#p(){this.#c=[{name:"",items:d.ThrottlingPresets.ThrottlingPresets.cpuThrottlingPresets.filter(e=>!e.calibratedDeviceType)},{name:q(W.labelCalibratedPresets),items:d.ThrottlingPresets.ThrottlingPresets.cpuThrottlingPresets.filter(e=>e.calibratedDeviceType)}]}async performUpdate(){const e={recommendedOption:this.#d,currentOption:this.#l,groups:this.#c,throttling:this.#g.get(),onMenuItemSelected:this.#v.bind(this),onCalibrateClick:this.#b.bind(this)};this.#h(e,void 0,this.contentElement)}}var G=Object.freeze({__proto__:null,CPUThrottlingSelector:Y,DEFAULT_VIEW:K});const X={forcedReflow:"Forced reflow",sIsALikelyPerformanceBottleneck:"{PH1} is a likely performance bottleneck.",idleCallbackExecutionExtended:"Idle callback execution extended beyond deadline by {PH1}",sTookS:"{PH1} took {PH2}.",longTask:"Long task",longInteractionINP:"Long interaction",sIsLikelyPoorPageResponsiveness:"{PH1} is indicating poor page responsiveness.",websocketProtocol:"WebSocket protocol",webSocketBytes:"{PH1} byte(s)",webSocketDataLength:"Data length"},J=t.i18n.registerUIStrings("panels/timeline/components/DetailsView.ts",X),Z=t.i18n.getLocalizedString.bind(void 0,J);var Q=Object.freeze({__proto__:null,buildRowsForWebSocketEvent:function(e,n){const s=[],o=n.data.Initiators.eventToInitiator.get(e);return o&&i.Types.Events.isWebSocketCreate(o)?(s.push({key:t.i18n.lockedString("URL"),value:o.args.data.url}),o.args.data.websocketProtocol&&s.push({key:Z(X.websocketProtocol),value:o.args.data.websocketProtocol})):i.Types.Events.isWebSocketCreate(e)&&(s.push({key:t.i18n.lockedString("URL"),value:e.args.data.url}),e.args.data.websocketProtocol&&s.push({key:Z(X.websocketProtocol),value:e.args.data.websocketProtocol})),i.Types.Events.isWebSocketTransfer(e)&&e.args.data.dataLength&&s.push({key:Z(X.webSocketDataLength),value:`${Z(X.webSocketBytes,{PH1:e.args.data.dataLength})}`}),s},buildWarningElementsForEvent:function(e,n){const o=n.data.Warnings.perEvent.get(e),r=[];if(!o)return r;for(const n of o){const o=i.Helpers.Timing.microToMilli(i.Types.Timing.Micro(e.dur||0)),a=document.createElement("span");switch(n){case"FORCED_REFLOW":{const e=s.XLink.XLink.create("https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#avoid-forced-synchronous-layouts",Z(X.forcedReflow),void 0,void 0,"forced-reflow");a.appendChild(g.getFormatLocalizedString(J,X.sIsALikelyPerformanceBottleneck,{PH1:e}));break}case"IDLE_CALLBACK_OVER_TIME":{if(!i.Types.Events.isFireIdleCallback(e))break;const n=t.TimeUtilities.millisToString((o||0)-e.args.data.allottedMilliseconds,!0);a.textContent=Z(X.idleCallbackExecutionExtended,{PH1:n});break}case"LONG_TASK":{const e=s.XLink.XLink.create("https://web.dev/optimize-long-tasks/",Z(X.longTask),void 0,void 0,"long-tasks");a.appendChild(g.getFormatLocalizedString(J,X.sTookS,{PH1:e,PH2:t.TimeUtilities.millisToString(o||0,!0)}));break}case"LONG_INTERACTION":{const e=s.XLink.XLink.create("https://web.dev/inp",Z(X.longInteractionINP),void 0,void 0,"long-interaction");a.appendChild(g.getFormatLocalizedString(J,X.sIsLikelyPoorPageResponsiveness,{PH1:e}));break}default:c.assertNever(n,`Unhandled warning type ${n}`)}r.push(a)}return r},generateInvalidationsList:function(e){const t={},n=new Set;for(const s of e){n.add(s.args.data.nodeId);let e=s.args.data.reason||"unknown";if("unknown"===e&&i.Types.Events.isScheduleStyleInvalidationTracking(s)&&s.args.data.invalidatedSelectorId)switch(s.args.data.invalidatedSelectorId){case"attribute":e="Attribute",s.args.data.changedAttribute&&(e+=` (${s.args.data.changedAttribute})`);break;case"class":e="Class",s.args.data.changedClass&&(e+=` (${s.args.data.changedClass})`);break;case"id":e="Id",s.args.data.changedId&&(e+=` (${s.args.data.changedId})`)}if("PseudoClass"===e&&i.Types.Events.isStyleRecalcInvalidationTracking(s)&&s.args.data.extraData&&(e+=s.args.data.extraData),"Attribute"===e&&i.Types.Events.isStyleRecalcInvalidationTracking(s)&&s.args.data.extraData&&(e+=` (${s.args.data.extraData})`),"StyleInvalidator"===e)continue;const o=t[e]||[];o.push(s),t[e]=o}return{groupedByReason:t,backendNodeIds:n}}}),ee=`.export-trace-options-content{max-width:var(--sys-size-36)}.export-trace-options-row{display:flex;devtools-checkbox{flex:auto}devtools-button{height:24px}.export-trace-blank{flex:1;min-width:var(--sys-size-25)}}.info-tooltip-container{max-width:var(--sys-size-28);white-space:normal}\n/*# sourceURL=${import.meta.resolve("./exportTraceOptions.css")} */`;const{html:te}=o,ie={exportTraceOptionsDialogTitle:"Save performance trace ",showExportTraceOptionsDialogTitle:"Save trace…",includeResourceContent:"Include resource content",includeSourcemap:"Include script source maps",includeAnnotations:"Include annotations",shouldCompress:"Compress with gzip",saveButtonTitle:"Save",resourceContentPrivacyInfo:"Includes the full content of all loaded HTML, CSS, and scripts (except extensions).",sourceMapsContentPrivacyInfo:"Includes available source maps, which may expose authored code.",moreInfoLabel:"Additional information:"},ne=t.i18n.registerUIStrings("panels/timeline/components/ExportTraceOptions.ts",ie),se=t.i18n.getLocalizedString.bind(void 0,ne),oe=new Set(["resource-content","script-source-maps"]);class re extends HTMLElement{#e=this.attachShadow({mode:"open"});#f=null;static#y="export-performance-trace-include-annotations";static#w="export-performance-trace-include-resources";static#x="export-performance-trace-include-sourcemaps";static#S="export-performance-trace-should-compress";#k=a.Settings.Settings.instance().createSetting(re.#y,!0,"Session");#C=a.Settings.Settings.instance().createSetting(re.#w,!1,"Session");#$=a.Settings.Settings.instance().createSetting(re.#x,!1,"Session");#T=a.Settings.Settings.instance().createSetting(re.#S,!0,"Synced");#L={dialogState:"collapsed",includeAnnotations:this.#k.get(),includeResourceContent:this.#C.get(),includeSourceMaps:this.#$.get(),shouldCompress:this.#T.get()};#P=s.UIUtils.CheckboxLabel.create(se(ie.includeAnnotations),this.#L.includeAnnotations,void 0,"timeline.export-trace-options.annotations-checkbox");#I=s.UIUtils.CheckboxLabel.create(se(ie.includeResourceContent),this.#L.includeResourceContent,void 0,"timeline.export-trace-options.resource-content-checkbox");#M=s.UIUtils.CheckboxLabel.create(se(ie.includeSourcemap),this.#L.includeSourceMaps,void 0,"timeline.export-trace-options.source-maps-checkbox");#R=s.UIUtils.CheckboxLabel.create(se(ie.shouldCompress),this.#L.shouldCompress,void 0,"timeline.export-trace-options.should-compress-checkbox");set data(e){this.#f=e,this.#E()}set state(e){this.#L=e,this.#k.set(e.includeAnnotations),this.#C.set(e.includeResourceContent),this.#$.set(e.includeSourceMaps),this.#T.set(e.shouldCompress),this.#E()}get state(){return this.#L}updateContentVisibility(e){this.state={...this.#L,displayAnnotationsCheckbox:e.annotationsExist,displayResourceContentCheckbox:!0,displaySourceMapsCheckbox:!0}}#E(){n.ScheduledRender.scheduleRender(this,this.#n)}#D(e,t){const i=Object.assign({},this.#L,{dialogState:"expanded"});switch(e){case this.#P:i.includeAnnotations=t;break;case this.#I:i.includeResourceContent=t,i.includeResourceContent||(i.includeSourceMaps=!1);break;case this.#M:i.includeSourceMaps=t;break;case this.#R:i.shouldCompress=t}this.state=i}#H(e){return"script-source-maps"===e?se(ie.moreInfoLabel)+" "+se(ie.sourceMapsContentPrivacyInfo):"resource-content"===e?se(ie.moreInfoLabel)+" "+se(ie.resourceContentPrivacyInfo):""}#F(e,t,i,n){return s.Tooltip.Tooltip.install(t,i),t.ariaLabel=i,t.checked=n,t.addEventListener("change",this.#D.bind(this,t,!n),!1),this.#M.disabled=!this.#L.includeResourceContent,te`
        <div class='export-trace-options-row'>
          ${t}

          ${oe.has(e)?te`
            <devtools-button
              aria-details=${`export-trace-tooltip-${e}`}
              .accessibleLabel=${this.#H(e)}
              class="pen-icon"
              .iconName=${"info"}
              .variant=${"icon"}
              ></devtools-button>
            `:o.nothing}
        </div>
      `}#N(e){return oe.has(e)?te`
    <devtools-tooltip
      variant="rich"
      id=${`export-trace-tooltip-${e}`}
    >
      <div class="info-tooltip-container">
      <p>
        ${"resource-content"===e?se(ie.resourceContentPrivacyInfo):o.nothing}
        ${"script-source-maps"===e?se(ie.sourceMapsContentPrivacyInfo):o.nothing}
      </p>
      </div>
    </devtools-tooltip>`:o.nothing}#n(){if(!n.ScheduledRender.isScheduledRender(this))throw new Error("Export trace options dialog render was not scheduled");const e=te`
      <style>${ee}</style>
      <devtools-button-dialog class="export-trace-dialog"
      @click=${this.#O.bind(this)}
      .data=${{openOnRender:!1,jslogContext:"timeline.export-trace-options",variant:"toolbar",iconName:"download",disabled:!this.#f?.buttonEnabled,iconTitle:se(ie.showExportTraceOptionsDialogTitle),horizontalAlignment:"auto",closeButton:!1,dialogTitle:se(ie.exportTraceOptionsDialogTitle),state:this.#L.dialogState,closeOnESC:!0}}>
        <div class='export-trace-options-content'>

          ${this.#L.displayAnnotationsCheckbox?this.#F("annotations",this.#P,se(ie.includeAnnotations),this.#L.includeAnnotations):""}
          ${this.#L.displayResourceContentCheckbox?this.#F("resource-content",this.#I,se(ie.includeResourceContent),this.#L.includeResourceContent):""}
          ${this.#L.displayResourceContentCheckbox&&this.#L.displaySourceMapsCheckbox?this.#F("script-source-maps",this.#M,se(ie.includeSourcemap),this.#L.includeSourceMaps):""}
          ${this.#F("compress-with-gzip",this.#R,se(ie.shouldCompress),this.#L.shouldCompress)}
          <div class='export-trace-options-row'><div class='export-trace-blank'></div><devtools-button
                  class="setup-button"
                  data-export-button
                  @click=${this.#z.bind(this)}
                  .data=${{variant:"primary",title:se(ie.saveButtonTitle)}}
                >${se(ie.saveButtonTitle)}</devtools-button>
                </div>
          ${this.#L.displayResourceContentCheckbox?this.#N("resource-content"):o.nothing}
          ${this.#L.displayResourceContentCheckbox&&this.#L.displaySourceMapsCheckbox?this.#N("script-source-maps"):o.nothing}
        </div>
      </devtools-button-dialog>
    `;o.render(e,this.#e,{host:this})}async#O(){this.state=Object.assign({},this.#L,{dialogState:"expanded"})}async#A(){await(this.#f?.onExport({includeResourceContent:this.#L.includeResourceContent,includeSourceMaps:this.#L.includeSourceMaps,addModifications:this.#L.includeAnnotations,shouldCompress:this.#L.shouldCompress})),p.userMetrics.actionTaken(p.UserMetrics.Action.PerfPanelTraceExported)}async#z(){await this.#A(),this.state=Object.assign({},this.#L,{dialogState:"collapsed"})}}customElements.define("devtools-perf-export-trace-options",re);var ae=Object.freeze({__proto__:null,ExportTraceOptions:re}),le=`.list{max-height:200px}.list-item:has(.origin-mapping-row.header){position:sticky;top:0;z-index:1;background-color:var(--sys-color-cdt-base-container)}.origin-mapping-row{display:flex;flex-direction:row;width:100%;height:30px}.origin-mapping-row.header{font-weight:var(--ref-typeface-weight-medium);border-bottom:1px solid var(--sys-color-divider)}.origin-mapping-cell{flex:1;display:flex;align-items:center;padding:4px;border-right:1px solid var(--sys-color-divider)}.origin-warning-icon{width:16px;height:16px;margin-right:4px;color:var(--icon-warning)}.origin{text-overflow:ellipsis;overflow-x:hidden}.origin-mapping-cell:last-child{border:none}.origin-mapping-editor{display:flex;flex-direction:row;width:100%;padding:12px 8px;gap:12px}.origin-mapping-editor label{flex:1;font-weight:var(--ref-typeface-weight-medium)}.origin-mapping-editor input{margin-top:4px;width:100%}\n/*# sourceURL=${import.meta.resolve("./originMap.css")} */`;const{html:de}=o,ce={developmentOrigin:"Development origin",productionOrigin:"Production origin",invalidOrigin:'"{PH1}" is not a valid origin or URL.',alreadyMapped:'"{PH1}" is already mapped to a production origin.',pageHasNoData:"The Chrome UX Report does not have sufficient real user data for this page."},ge=t.i18n.registerUIStrings("panels/timeline/components/OriginMap.ts",ce),he=t.i18n.getLocalizedString.bind(void 0,ge),pe="developmentOrigin",ue="productionOrigin";class me extends s.Widget.WidgetElement{#U;#_;constructor(){super(),this.#U=new s.ListWidget.ListWidget(this,!1,!0),u.CrUXManager.instance().getConfigSetting().addChangeListener(this.#B,this),this.#B()}createWidget(){const e=new s.Widget.Widget(this);return this.#U.registerRequiredCSS(le),this.#U.show(e.contentElement),e}#V(){return u.CrUXManager.instance().getConfigSetting().get().originMappings||[]}#W(e){const t=u.CrUXManager.instance().getConfigSetting(),i={...t.get()};i.originMappings=e,t.set(i)}#B(){const e=this.#V();this.#U.clear(),this.#U.appendItem({developmentOrigin:he(ce.developmentOrigin),productionOrigin:he(ce.productionOrigin),isTitleRow:!0},!1);for(const t of e)this.#U.appendItem(t,!0)}#j(e){try{return new URL(e).origin}catch{return null}}#q(e){return m.write(async()=>{if(!u.CrUXManager.instance().isEnabled())return o.nothing;const t=u.CrUXManager.instance(),i=await t.getFieldDataForPage(e);return Object.entries(i).some(([e,t])=>"warnings"!==e&&Boolean(t))?o.nothing:de`
        <devtools-icon
          class="origin-warning-icon"
          name="warning-filled"
          title=${he(ce.pageHasNoData)}
        ></devtools-icon>
      `})}startCreation(){const e=l.TargetManager.TargetManager.instance().inspectedURL(),t=this.#j(e)||"";this.#U.addNewItem(-1,{developmentOrigin:t,productionOrigin:""})}renderItem(e){const t=document.createElement("div");let i,n;return t.classList.add("origin-mapping-row"),t.role="row",e.isTitleRow?(t.classList.add("header"),i="columnheader",n=o.nothing):(i="cell",n=o.Directives.until(this.#q(e.productionOrigin))),o.render(de`
      <div class="origin-mapping-cell development-origin" role=${i}>
        <div class="origin" title=${e.developmentOrigin}>${e.developmentOrigin}</div>
      </div>
      <div class="origin-mapping-cell production-origin" role=${i}>
        ${n}
        <div class="origin" title=${e.productionOrigin}>${e.productionOrigin}</div>
      </div>
    `,t,{host:this}),t}removeItemRequested(e,t){const i=this.#V();i.splice(t-1,1),this.#W(i)}commitEdit(e,t,i){e.developmentOrigin=this.#j(t.control(pe).value)||"",e.productionOrigin=this.#j(t.control(ue).value)||"";const n=this.#V();i&&n.push(e),this.#W(n)}beginEdit(e){const t=this.#K();return t.control(pe).value=e.developmentOrigin,t.control(ue).value=e.productionOrigin,t}#Y(e,t,i){const n=this.#j(i.value);if(!n)return{valid:!1,errorMessage:he(ce.invalidOrigin,{PH1:i.value})};const s=this.#V();for(let e=0;e<s.length;++e){if(e===t-1)continue;if(s[e].developmentOrigin===n)return{valid:!0,errorMessage:he(ce.alreadyMapped,{PH1:n})}}return{valid:!0}}#G(e,t,i){return this.#j(i.value)?{valid:!0}:{valid:!1,errorMessage:he(ce.invalidOrigin,{PH1:i.value})}}#K(){if(this.#_)return this.#_;const e=new s.ListWidget.Editor;this.#_=e;const t=e.contentElement().createChild("div","origin-mapping-editor"),i=e.createInput(pe,"text",he(ce.developmentOrigin),this.#Y.bind(this)),n=e.createInput(ue,"text",he(ce.productionOrigin),this.#G.bind(this));return o.render(de`
      <label class="development-origin-input">
        ${he(ce.developmentOrigin)}
        ${i}
      </label>
      <label class="production-origin-input">
        ${he(ce.productionOrigin)}
        ${n}
      </label>
    `,t,{host:this}),e}}customElements.define("devtools-origin-map",me);var ve=Object.freeze({__proto__:null,OriginMap:me}),be=`:host{display:block}:host *{box-sizing:border-box}devtools-dialog{--override-transparent:color-mix(in srgb,var(--color-background) 80%,transparent)}.section-title{font-size:var(--sys-typescale-headline5-size);line-height:var(--sys-typescale-headline5-line-height);font-weight:var(--ref-typeface-weight-medium);margin:0}.privacy-disclosure{margin:8px 0}.url-override{margin:8px 0;display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;max-width:max-content}details > summary{font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);font-weight:var(--ref-typeface-weight-medium)}.content{max-width:360px;box-sizing:border-box}.open-button-section{display:flex;flex-direction:row}.origin-mapping-grid{border:1px solid var(--sys-color-divider);margin-top:8px}.origin-mapping-description{margin-bottom:8px}.origin-mapping-button-section{display:flex;flex-direction:column;align-items:center;margin-top:var(--sys-size-6)}.config-button{margin-left:auto}.advanced-section-contents{margin:4px 0 14px}.buttons-section{display:flex;justify-content:space-between;margin-top:var(--sys-size-6);margin-bottom:var(--sys-size-2);devtools-button.enable{float:right}}input[type="checkbox"]{height:12px;width:12px;min-height:12px;min-width:12px;margin:6px}input[type="text"][disabled]{color:var(--sys-color-state-disabled)}.warning{margin:2px 8px;color:var(--color-error-text)}x-link{color:var(--sys-color-primary);text-decoration-line:underline}.divider{margin:10px 0;border:none;border-top:1px solid var(--sys-color-divider)}\n/*# sourceURL=${import.meta.resolve("./fieldSettingsDialog.css")} */`;const fe={setUp:"Set up",configure:"Configure",ok:"Ok",optOut:"Opt out",cancel:"Cancel",onlyFetchFieldData:"Always show field metrics for the below URL",url:"URL",doesNotHaveSufficientData:"The Chrome UX Report does not have sufficient real-world speed data for this page.",configureFieldData:"Configure field metrics fetching",fetchAggregated:"Fetch aggregated field metrics from the {PH1} to help you contextualize local measurements with what real users experience on the site.",privacyDisclosure:"Privacy disclosure",whenPerformanceIsShown:"When DevTools is open, the URLs you visit will be sent to Google to query field metrics. These requests are not tied to your Google account.",advanced:"Advanced",mapDevelopmentOrigins:"Set a development origin to automatically get relevant field metrics for its production origin.",new:"New",invalidOrigin:'"{PH1}" is not a valid origin or URL.'},ye=t.i18n.registerUIStrings("panels/timeline/components/FieldSettingsDialog.ts",fe),we=t.i18n.getLocalizedString.bind(void 0,ye),{html:xe,nothing:Se,Directives:{ifDefined:ke}}=o;class Ce extends Event{static eventName="showdialog";constructor(){super(Ce.eventName)}}class $e extends HTMLElement{#e=this.attachShadow({mode:"open"});#X;#J=u.CrUXManager.instance().getConfigSetting();#Z="";#Q=!1;#ee="";#te;constructor(){super();const e=u.CrUXManager.instance();this.#J=e.getConfigSetting(),this.#ie(),this.#n()}#ie(){const e=this.#J.get();this.#Z=e.override||"",this.#Q=e.overrideEnabled||!1,this.#ee=""}#ne(e){const t=this.#J.get();this.#J.set({...t,enabled:e,override:this.#Z,overrideEnabled:this.#Q})}#se(){n.ScheduledRender.scheduleRender(this,this.#n)}async#oe(e){const t=u.CrUXManager.instance(),i=await t.getFieldDataForPage(e);return Object.entries(i).some(([e,t])=>"warnings"!==e&&Boolean(t))}async#re(e){if(e&&this.#Q){if(!this.#j(this.#Z))return this.#ee=we(fe.invalidOrigin,{PH1:this.#Z}),void n.ScheduledRender.scheduleRender(this,this.#n);if(!await this.#oe(this.#Z))return this.#ee=we(fe.doesNotHaveSufficientData),void n.ScheduledRender.scheduleRender(this,this.#n)}this.#ne(e),this.#ae()}#le(){if(!this.#X)throw new Error("Dialog not found");this.#ie(),this.#X.setDialogVisible(!0),n.ScheduledRender.scheduleRender(this,this.#n),this.dispatchEvent(new Ce)}#ae(e){if(!this.#X)throw new Error("Dialog not found");this.#X.setDialogVisible(!1),e&&e.stopImmediatePropagation(),n.ScheduledRender.scheduleRender(this,this.#n)}connectedCallback(){this.#J.addChangeListener(this.#se,this),n.ScheduledRender.scheduleRender(this,this.#n)}disconnectedCallback(){this.#J.removeChangeListener(this.#se,this)}#de(){return this.#J.get().enabled?xe`
        <devtools-button
          class="config-button"
          @click=${this.#le}
          .data=${{variant:"outlined",title:we(fe.configure)}}
        jslog=${r.action("timeline.field-data.configure").track({click:!0})}
        >${we(fe.configure)}</devtools-button>
      `:xe`
      <devtools-button
        class="setup-button"
        @click=${this.#le}
        .data=${{variant:"primary",title:we(fe.setUp)}}
        jslog=${r.action("timeline.field-data.setup").track({click:!0})}
        data-field-data-setup
      >${we(fe.setUp)}</devtools-button>
    `}#ce(){return xe`
      <devtools-button
        @click=${()=>{this.#re(!0)}}
        .data=${{variant:"primary",title:we(fe.ok)}}
        class="enable"
        jslog=${r.action("timeline.field-data.enable").track({click:!0})}
        data-field-data-enable
      >${we(fe.ok)}</devtools-button>
    `}#ge(){const e=this.#J.get().enabled?we(fe.optOut):we(fe.cancel);return xe`
      <devtools-button
        @click=${()=>{this.#re(!1)}}
        .data=${{variant:"outlined",title:e}}
        jslog=${r.action("timeline.field-data.disable").track({click:!0})}
        data-field-data-disable
      >${e}</devtools-button>
    `}#he(e){e.stopPropagation();const t=e.target;this.#Z=t.value,this.#ee="",n.ScheduledRender.scheduleRender(this,this.#n)}#pe(e){e.stopPropagation();const t=e.target;this.#Q=t.checked,this.#ee="",n.ScheduledRender.scheduleRender(this,this.#n)}#j(e){try{return new URL(e).origin}catch{return null}}#ue(){return xe`
      <div class="origin-mapping-description">${we(fe.mapDevelopmentOrigins)}</div>
      <devtools-origin-map
        on-render=${n.Directives.nodeRenderedCallback(e=>{this.#te=e})}
      ></devtools-origin-map>
      <div class="origin-mapping-button-section">
        <devtools-button
          @click=${()=>this.#te?.startCreation()}
          .data=${{variant:"text",title:we(fe.new),iconName:"plus"}}
          jslogContext=${"new-origin-mapping"}
        >${we(fe.new)}</devtools-button>
      </div>
    `}#n=()=>{const e=s.XLink.XLink.create("https://developer.chrome.com/docs/crux",t.i18n.lockedString("Chrome UX Report")),i=g.getFormatLocalizedString(ye,fe.fetchAggregated,{PH1:e}),a=xe`
      <style>${be}</style>
      <style>${v.textInputStyles}</style>
      <style>${v.checkboxStyles}</style>
      <div class="open-button-section">${this.#de()}</div>
      <devtools-dialog
        @clickoutsidedialog=${this.#ae}
        .position=${"auto"}
        .horizontalAlignment=${"center"}
        .jslogContext=${"timeline.field-data.settings"}
        .expectedMutationsSelector=${".timeline-settings-pane option"}
        .dialogTitle=${we(fe.configureFieldData)}
        on-render=${n.Directives.nodeRenderedCallback(e=>{this.#X=e})}
      >
        <div class="content">
          <div>${i}</div>
          <div class="privacy-disclosure">
            <h3 class="section-title">${we(fe.privacyDisclosure)}</h3>
            <div>${we(fe.whenPerformanceIsShown)}</div>
          </div>
          <details aria-label=${we(fe.advanced)}>
            <summary>${we(fe.advanced)}</summary>
            <div class="advanced-section-contents">
              ${this.#ue()}
              <hr class="divider">
              <label class="url-override">
                <input
                  type="checkbox"
                  .checked=${this.#Q}
                  @change=${this.#pe}
                  aria-label=${we(fe.onlyFetchFieldData)}
                  jslog=${r.toggle().track({click:!0}).context("field-url-override-enabled")}
                />
                ${we(fe.onlyFetchFieldData)}
              </label>
              <input
                type="text"
                @keyup=${this.#he}
                @change=${this.#he}
                class="devtools-text-input"
                .disabled=${!this.#Q}
                .value=${this.#Z}
                placeholder=${ke(this.#Q?we(fe.url):void 0)}
              />
              ${this.#ee?xe`<div class="warning" role="alert" aria-label=${this.#ee}>${this.#ee}</div>`:Se}
            </div>
          </details>
          <div class="buttons-section">
            ${this.#ge()}
            ${this.#ce()}
          </div>
        </div>
      </devtools-dialog>
    `;o.render(a,this.#e,{host:this})}}customElements.define("devtools-field-settings-dialog",$e);var Te=Object.freeze({__proto__:null,FieldSettingsDialog:$e,ShowDialog:Ce}),Le=`.ignore-list-setting-content{max-width:var(--sys-size-30)}.ignore-list-setting-description{margin-bottom:5px}.regex-row{display:flex;devtools-checkbox{flex:auto}devtools-button{height:24px}&:not(:hover) devtools-button{display:none}}.new-regex-row{display:flex;.new-regex-text-input{flex:auto}.harmony-input[type="text"]{border:1px solid var(--sys-color-neutral-outline);border-radius:4px;outline:none;&.error-input,\n    &:invalid{border-color:var(--sys-color-error)}&:not(.error-input, :invalid):focus{border-color:var(--sys-color-state-focus-ring)}&:not(.error-input, :invalid):hover:not(:focus){background:var(--sys-color-state-hover-on-subtle)}}}\n/*# sourceURL=${import.meta.resolve("./ignoreListSetting.css")} */`;const{html:Pe}=o,Ie={showIgnoreListSettingDialog:"Show ignore list setting dialog",ignoreList:"Ignore list",ignoreListDescription:"Add regular expression rules to remove matching scripts from the flame chart.",ignoreScriptsWhoseNamesMatchS:"Ignore scripts whose names match ''{regex}''",removeRegex:"Remove the regex: ''{regex}''",addNewRegex:"Add a regular expression rule for the script's URL",ignoreScriptsWhoseNamesMatchNewRegex:"Ignore scripts whose names match the new regex"},Me=t.i18n.registerUIStrings("panels/timeline/components/IgnoreListSetting.ts",Ie),Re=t.i18n.getLocalizedString.bind(void 0,Me);class Ee extends HTMLElement{#e=this.attachShadow({mode:"open"});#me=a.Settings.Settings.instance().moduleSetting("enable-ignore-listing");#ve=this.#be().getAsArray();#fe=s.UIUtils.CheckboxLabel.create(void 0,!1,void 0,"timeline.ignore-list-new-regex.checkbox");#ye=s.UIUtils.createInput("new-regex-text-input","text","timeline.ignore-list-new-regex.text");#we=null;constructor(){super(),this.#xe(),a.Settings.Settings.instance().moduleSetting("skip-stack-frames-pattern").addChangeListener(this.#E.bind(this)),a.Settings.Settings.instance().moduleSetting("enable-ignore-listing").addChangeListener(this.#E.bind(this))}connectedCallback(){this.#E(),this.addEventListener("contextmenu",e=>{e.stopPropagation()})}#E(){n.ScheduledRender.scheduleRender(this,this.#n)}#be(){return a.Settings.Settings.instance().moduleSetting("skip-stack-frames-pattern")}#Se(){this.#we={pattern:this.#ye.value,disabled:!1,disabledForUrl:void 0},this.#ve.push(this.#we)}#ke(){if(!this.#we)return;const e=this.#ve.pop();e&&e!==this.#we&&(console.warn("The last regex is not the editing one."),this.#ve.push(e)),this.#we=null,this.#be().setAsArray(this.#ve)}#Ce(){this.#fe.checked=!1,this.#ye.value=""}#$e(){const e=this.#ye.value.trim();this.#ke(),De(e)&&(b.IgnoreListManager.IgnoreListManager.instance().addRegexToIgnoreList(e),this.#Ce())}#Te(e){if(e.key===c.KeyboardUtilities.ENTER_KEY)return this.#$e(),void this.#Se();e.key===c.KeyboardUtilities.ESCAPE_KEY&&(e.stopImmediatePropagation(),this.#ke(),this.#Ce(),this.#ye.blur())}#Le(){if(this.#we){const e=this.#ve[this.#ve.length-1];if(e&&e===this.#we)return this.#ve.slice(0,-1)}return this.#ve}#Pe(){const e=this.#ye.value.trim();this.#we&&De(e)&&(this.#we.pattern=e,this.#we.disabled=!Boolean(e),this.#be().setAsArray(this.#ve))}#xe(){this.#ye.placeholder="/framework\\.js$";const e=Re(Ie.ignoreScriptsWhoseNamesMatchNewRegex),t=Re(Ie.addNewRegex);s.Tooltip.Tooltip.install(this.#fe,e),s.Tooltip.Tooltip.install(this.#ye,t),this.#ye.addEventListener("blur",this.#$e.bind(this),!1),this.#ye.addEventListener("keydown",this.#Te.bind(this),!1),this.#ye.addEventListener("input",this.#Pe.bind(this),!1),this.#ye.addEventListener("focus",this.#Se.bind(this),!1)}#Ie(){return Pe`
      <div class='new-regex-row'>${this.#fe}${this.#ye}</div>
    `}#Me(e,t){e.disabled=!t.checked,this.#be().setAsArray(this.#ve)}#Re(e){this.#ve.splice(e,1),this.#be().setAsArray(this.#ve)}#Ee(e,t){const i=s.UIUtils.CheckboxLabel.createWithStringLiteral(e.pattern,!e.disabled,"timeline.ignore-list-pattern"),n=Re(Ie.ignoreScriptsWhoseNamesMatchS,{regex:e.pattern});return s.Tooltip.Tooltip.install(i,n),i.ariaLabel=n,i.addEventListener("change",this.#Me.bind(this,e,i),!1),Pe`
      <div class='regex-row'>
        ${i}
        <devtools-button
            @click=${this.#Re.bind(this,t)}
            .data=${{variant:"icon",iconName:"bin",title:Re(Ie.removeRegex,{regex:e.pattern}),jslogContext:"timeline.ignore-list-pattern.remove"}}></devtools-button>
      </div>
    `}#n(){if(!n.ScheduledRender.isScheduledRender(this))throw new Error("Ignore List setting dialog render was not scheduled");const e=Pe`
      <style>${Le}</style>
      <devtools-button-dialog .data=${{openOnRender:!1,jslogContext:"timeline.ignore-list",variant:"toolbar",iconName:"compress",disabled:!this.#me.get(),iconTitle:Re(Ie.showIgnoreListSettingDialog),horizontalAlignment:"auto",closeButton:!0,dialogTitle:Re(Ie.ignoreList)}}>
        <div class='ignore-list-setting-content'>
          <div class='ignore-list-setting-description'>${Re(Ie.ignoreListDescription)}</div>
          ${this.#Le().map(this.#Ee.bind(this))}
          ${this.#Ie()}
        </div>
      </devtools-button-dialog>
    `;o.render(e,this.#e,{host:this})}}function De(e){const t=e.trim();if(!t.length)return!1;let i;try{i=new RegExp(t)}catch{}return Boolean(i)}customElements.define("devtools-perf-ignore-list-setting",Ee);var He=Object.freeze({__proto__:null,IgnoreListSetting:Ee,regexInputIsValid:De}),Fe=`:host{display:block}.breakdown{margin:0;padding:0;list-style:none;color:var(--sys-color-token-subtle)}.value{display:inline-block;padding:0 5px;color:var(--sys-color-on-surface)}\n/*# sourceURL=${import.meta.resolve("./interactionBreakdown.css")} */`;const{html:Ne}=o,Oe={inputDelay:"Input delay",processingDuration:"Processing duration",presentationDelay:"Presentation delay"},ze=t.i18n.registerUIStrings("panels/timeline/components/InteractionBreakdown.ts",Oe),Ae=t.i18n.getLocalizedString.bind(void 0,ze);class Ue extends HTMLElement{#e=this.attachShadow({mode:"open"});#De=null;set entry(e){e!==this.#De&&(this.#De=e,n.ScheduledRender.scheduleRender(this,this.#n))}#n(){if(!this.#De)return;const e=t.TimeUtilities.formatMicroSecondsAsMillisFixed(this.#De.inputDelay),i=t.TimeUtilities.formatMicroSecondsAsMillisFixed(this.#De.mainThreadHandling),n=t.TimeUtilities.formatMicroSecondsAsMillisFixed(this.#De.presentationDelay);o.render(Ne`<style>${Fe}</style>
             <ul class="breakdown">
                     <li data-entry="input-delay">${Ae(Oe.inputDelay)}<span class="value">${e}</span></li>
                     <li data-entry="processing-duration">${Ae(Oe.processingDuration)}<span class="value">${i}</span></li>
                     <li data-entry="presentation-delay">${Ae(Oe.presentationDelay)}<span class="value">${n}</span></li>
                   </ul>
                   `,this.#e,{host:this})}}customElements.define("devtools-interaction-breakdown",Ue);var _e=Object.freeze({__proto__:null,InteractionBreakdown:Ue}),Be=`@scope to (devtools-widget > *){.layout-shift-details-title,\n  .cluster-details-title{padding-bottom:var(--sys-size-5);display:flex;align-items:center;.layout-shift-event-title,\n    .cluster-event-title{background-color:var(--app-color-rendering);width:var(--sys-size-6);height:var(--sys-size-6);border:var(--sys-size-1) solid var(--sys-color-divider);box-sizing:content-box;display:inline-block;margin-right:var(--sys-size-3)}}.layout-shift-details-table{font:var(--sys-typescale-body4-regular);margin-bottom:var(--sys-size-4);text-align:left;border-block:var(--sys-size-1) solid var(--sys-color-divider);border-collapse:collapse;font-variant-numeric:tabular-nums;th,\n    td{padding-right:var(--sys-size-4);min-width:var(--sys-size-20);max-width:var(--sys-size-28)}}.table-title{th{font:var(--sys-typescale-body4-medium)}tr{border-bottom:var(--sys-size-1) solid var(--sys-color-divider)}}.timeline-link{cursor:pointer;text-decoration:underline;color:var(--sys-color-primary);background:none;border:none;padding:0;font:inherit;text-align:left}.parent-cluster-link{margin-left:var(--sys-size-2)}.timeline-link.invalid-link{color:var(--sys-color-state-disabled)}.details-row{display:flex;min-height:var(--sys-size-9)}.title{color:var(--sys-color-token-subtle);overflow:hidden;padding-right:var(--sys-size-5);display:inline-block;vertical-align:top}.culprit{display:inline-flex;flex-direction:row;gap:var(--sys-size-3)}.value{display:inline-block;user-select:text;text-overflow:ellipsis;overflow:hidden;padding:0 var(--sys-size-3)}.layout-shift-summary-details,\n  .layout-shift-cluster-summary-details{font:var(--sys-typescale-body4-regular);display:flex;flex-direction:column;column-gap:var(--sys-size-4);padding:var(--sys-size-5) var(--sys-size-5) 0 var(--sys-size-5)}.culprits{display:flex;flex-direction:column}.shift-row:not(:last-child){border-bottom:var(--sys-size-1) solid var(--sys-color-divider)}.total-row{font:var(--sys-typescale-body4-medium)}}\n/*# sourceURL=${import.meta.resolve("./layoutShiftDetails.css")} */`;const{html:Ve,render:We}=o,je={startTime:"Start time",shiftScore:"Shift score",elementsShifted:"Elements shifted",culprit:"Culprit",injectedIframe:"Injected iframe",fontRequest:"Font request",nonCompositedAnimation:"Non-composited animation",animation:"Animation",parentCluster:"Parent cluster",cluster:"Layout shift cluster @ {PH1}",layoutShift:"Layout shift @ {PH1}",total:"Total",unsizedImage:"Unsized image"},qe=t.i18n.registerUIStrings("panels/timeline/components/LayoutShiftDetails.ts",je),Ke=t.i18n.getLocalizedString.bind(void 0,qe);class Ye extends s.Widget.Widget{#h;#He=null;#Fe=null;#Ne=!1;constructor(e,t=Ge){super(e),this.#h=t}set event(e){this.#He=e,this.requestUpdate()}set parsedTrace(e){this.#Fe=e,this.requestUpdate()}set isFreshRecording(e){this.#Ne=e,this.requestUpdate()}#Oe(e){this.contentElement.dispatchEvent(new w.EventRef.EventReferenceClick(e))}#ze(e){const t="mouseover"===e.type;if("mouseleave"===e.type&&this.contentElement.dispatchEvent(new CustomEvent("toggle-popover",{detail:{show:t},bubbles:!0,composed:!0})),!(e.target instanceof HTMLElement&&this.#He))return;const n=e.target.closest("tbody tr");if(!n?.parentElement)return;const s=i.Types.Events.isSyntheticLayoutShift(this.#He)?this.#He:this.#He.events.find(e=>e.ts===parseInt(n.getAttribute("data-ts")??"",10));this.contentElement.dispatchEvent(new CustomEvent("toggle-popover",{detail:{event:s,show:t},bubbles:!0,composed:!0}))}performUpdate(){this.#h({event:this.#He,parsedTrace:this.#Fe,isFreshRecording:this.#Ne,togglePopover:e=>this.#ze(e),onEventClick:e=>this.#Oe(e)},{},this.contentElement)}}const Ge=(e,n,s)=>{if(!e.event||!e.parsedTrace)return void We(o.nothing,s);const r=i.Name.forEntry(e.event);We(Ve`
        <style>${Be}</style>
        <style>${h.textButtonStyles}</style>

      <div class="layout-shift-summary-details">
        <div
          class="event-details"
          @mouseover=${e.togglePopover}
          @mouseleave=${e.togglePopover}
        >
        <div class="layout-shift-details-title">
          <div class="layout-shift-event-title"></div>
          ${r}
        </div>
        ${i.Types.Events.isSyntheticLayoutShift(e.event)?function(e,n,s,r,a){if(!n)return o.nothing;const l=e.args.data?.navigationId??i.Types.Events.NO_NAVIGATION,d=n.get(l)?.model.CLSCulprits;if(!d||d instanceof Error)return o.nothing;const c=d.shifts.get(e);let g=e.args.data?.impacted_nodes??[];r||(g=g?.filter(e=>e.debug_name));const h=c&&(c.webFonts.length||c.iframes.length||c.nonCompositedAnimations.length||c.unsizedImages.length),p=g?.length,u=d.clusters.find(t=>t.events.find(t=>t===e));return Ve`
      <table class="layout-shift-details-table">
        <thead class="table-title">
          <tr>
            <th>${Ke(je.startTime)}</th>
            <th>${Ke(je.shiftScore)}</th>
            ${p?Ve`
              <th>${Ke(je.elementsShifted)}</th>`:o.nothing}
            ${h?Ve`
              <th>${Ke(je.culprit)}</th> `:o.nothing}
          </tr>
        </thead>
        <tbody>
          ${Xe(e,!0,s,g,a,c)}
        </tbody>
      </table>
      ${function(e,n,s){if(!e)return o.nothing;const r=i.Types.Timing.Micro(e.ts-(s.data.Meta.traceBounds.min??0)),a=t.TimeUtilities.formatMicroSecondsTime(r);return Ve`
      <span class="parent-cluster">${Ke(je.parentCluster)}:<button type="button" class="timeline-link parent-cluster-link" @click=${()=>n(e)}>${Ke(je.cluster,{PH1:a})}</button>
      </span>`}(u,a,s)}
    `}(e.event,e.parsedTrace.insights,e.parsedTrace,e.isFreshRecording,e.onEventClick):function(e,t,n,s){if(!t)return o.nothing;const r=e.navigationId??i.Types.Events.NO_NAVIGATION,a=t.get(r)?.model.CLSCulprits;if(!a||a instanceof Error)return o.nothing;const l=Array.from(a.shifts.entries()).filter(([t])=>e.events.includes(t)).map(([,e])=>e).flatMap(e=>Object.values(e)).flat(),d=Boolean(l.length);return Ve`
    <table class="layout-shift-details-table">
      <thead class="table-title">
        <tr>
          <th>${Ke(je.startTime)}</th>
          <th>${Ke(je.shiftScore)}</th>
          <th>${Ke(je.elementsShifted)}</th>
          ${d?Ve`
            <th>${Ke(je.culprit)}</th> `:o.nothing}
        </tr>
      </thead>
      <tbody>
        ${e.events.map(e=>{const t=a.shifts.get(e),i=e.args.data?.impacted_nodes??[];return Xe(e,!1,n,i,s,t)})}

        <tr>
          <td class="total-row">${Ke(je.total)}</td>
          <td class="total-row">${e.clusterCumulativeScore.toFixed(4)}</td>
        </tr>
      </tbody>
    </table>
  `}(e.event,e.parsedTrace.insights,e.parsedTrace,e.onEventClick)}
        </div>
      </div>
      `,s)};function Xe(e,n,s,r,a,d){const c=e.args.data?.weighted_score_delta;if(!c)return o.nothing;const g=Boolean(d&&(d.webFonts.length||d.iframes.length||d.nonCompositedAnimations.length||d.unsizedImages.length));return Ve`
      <tr class="shift-row" data-ts=${e.ts}>
        <td>${function(e,n,s,o){const r=i.Types.Timing.Micro(e.ts-s.data.Meta.traceBounds.min);if(n)return Ve`${t.TimeUtilities.preciseMillisToString(f.Timing.microToMilli(r))}`;const a=t.TimeUtilities.formatMicroSecondsTime(r);return Ve`
         <button type="button" class="timeline-link" @click=${()=>o(e)}>${Ke(je.layoutShift,{PH1:a})}</button>`}(e,n,s,a)}</td>
        <td>${c.toFixed(4)}</td>
        ${r.length?Ve`
          <td>
            <div class="elements-shifted">
              ${function(e,t){return Ve`
      ${t?.map(t=>void 0!==t.node_id?Ve`
            <devtools-performance-node-link
              .data=${{backendNodeId:t.node_id,frame:e.args.frame,fallbackHtmlSnippet:t.debug_name}}>
            </devtools-performance-node-link>`:o.nothing)}`}(e,r)}
            </div>
          </td>`:o.nothing}
        ${g?Ve`
          <td class="culprits">
            ${d?.webFonts.map(e=>function(e){const t=Je(e.args.data.url);return Ve`
      <span class="culprit">
        <span class="culprit-type">${Ke(je.fontRequest)}: </span>
        <span class="culprit-value">${t}</span>
      </span>`}(e))}
            ${d?.iframes.map(e=>function(e){const t=e.frame,i=l.FrameManager.FrameManager.instance().getFrame(t);let n;n=i?y.Linkifier.Linkifier.linkifyRevealable(i,i.displayName()):Je(e.url);return Ve`
      <span class="culprit">
        <span class="culprit-type"> ${Ke(je.injectedIframe)}: </span>
        <span class="culprit-value">${n}</span>
      </span>`}(e))}
            ${d?.nonCompositedAnimations.map(e=>function(e,t){const i=e.animation;if(!i)return o.nothing;return Ve`
        <span class="culprit">
        <span class="culprit-type">${Ke(je.nonCompositedAnimation)}: </span>
        <button type="button" class="culprit-value timeline-link" @click=${()=>t(i)}>${Ke(je.animation)}</button>
      </span>`}(e,a))}
            ${d?.unsizedImages.map(t=>function(e,t){const i=Ve`
      <devtools-performance-node-link
        .data=${{backendNodeId:t.backendNodeId,frame:e,fallbackUrl:t.paintImageEvent.args.data.url}}>
      </devtools-performance-node-link>`;return Ve`
      <span class="culprit">
        <span class="culprit-type">${Ke(je.unsizedImage)}: </span>
        <span class="culprit-value">${i}</span>
      </span>`}(e.args.frame,t))}
          </td>`:o.nothing}
      </tr>`}function Je(e){return y.Linkifier.Linkifier.linkifyURL(e,{tabStop:!0,showColumnNumber:!1,inlineFrameIndex:0,maxLength:20})}var Ze=Object.freeze({__proto__:null,DEFAULT_VIEW:Ge,LayoutShiftDetails:Ye}),Qe=`:host{display:flex;align-items:center;max-width:100%;height:20px}devtools-icon[name="info"]{margin-left:var(--sys-size-3);width:var(--sys-size-8);height:var(--sys-size-8)}devtools-select-menu{min-width:160px;max-width:100%;height:20px}\n/*# sourceURL=${import.meta.resolve("./networkThrottlingSelector.css")} */`;const{html:et,nothing:tt}=o,it={network:"Network: {PH1}",networkThrottling:"Network throttling: {PH1}",recommendedThrottling:"{PH1} – recommended",recommendedThrottlingReason:"Consider changing setting to simulate real user environments",disabled:"Disabled",presets:"Presets",custom:"Custom",add:"Add…"},nt=t.i18n.registerUIStrings("panels/timeline/components/NetworkThrottlingSelector.ts",it),st=t.i18n.getLocalizedString.bind(void 0,nt);class ot extends HTMLElement{#e=this.attachShadow({mode:"open"});#Ae;#c=[];#Ue;#_e=null;constructor(){super(),this.#Ae=a.Settings.Settings.instance().moduleSetting("custom-network-conditions"),this.#Be(),this.#Ue=l.NetworkManager.MultitargetNetworkManager.instance().networkConditions(),this.#n()}set recommendedConditions(e){this.#_e=e,n.ScheduledRender.scheduleRender(this,this.#n)}connectedCallback(){l.NetworkManager.MultitargetNetworkManager.instance().addEventListener("ConditionsChanged",this.#Ve,this),this.#Ve(),this.#Ae.addChangeListener(this.#We,this)}disconnectedCallback(){l.NetworkManager.MultitargetNetworkManager.instance().removeEventListener("ConditionsChanged",this.#Ve,this),this.#Ae.removeChangeListener(this.#We,this)}#Be(){this.#c=[{name:st(it.disabled),items:[l.NetworkManager.NoThrottlingConditions]},{name:st(it.presets),items:d.ThrottlingPresets.ThrottlingPresets.networkPresets},{name:st(it.custom),items:this.#Ae.get(),showCustomAddOption:!0,jslogContext:"custom-network-throttling-item"}]}#Ve(){this.#Ue=l.NetworkManager.MultitargetNetworkManager.instance().networkConditions(),n.ScheduledRender.scheduleRender(this,this.#n)}#v(e){const t=this.#c.flatMap(e=>e.items).find(t=>this.#je(t)===e.itemValue);t&&l.NetworkManager.MultitargetNetworkManager.instance().setNetworkConditions(t)}#We(){this.#Be(),n.ScheduledRender.scheduleRender(this,this.#n)}#qe(e){return e.title instanceof Function?e.title():e.title}#Ke(){a.Revealer.reveal(this.#Ae)}#je(e){return e.i18nTitleKey||this.#qe(e)}#n=()=>{const e=this.#qe(this.#Ue),t=this.#je(this.#Ue);let i;this.#_e&&this.#Ue===l.NetworkManager.NoThrottlingConditions&&(i=et`<devtools-icon
        title=${st(it.recommendedThrottlingReason)}
        name=info></devtools-icon>`);const n=et`
      <style>${Qe}</style>
      <devtools-select-menu
        @selectmenuselected=${this.#v}
        .showDivider=${!0}
        .showArrow=${!0}
        .sideButton=${!1}
        .showSelectedItem=${!0}
        .jslogContext=${"network-conditions"}
        .buttonTitle=${st(it.network,{PH1:e})}
        .title=${st(it.networkThrottling,{PH1:e})}
      >
        ${this.#c.map(e=>et`
            <devtools-menu-group .name=${e.name} .title=${e.name}>
              ${e.items.map(i=>{let n=this.#qe(i);i===this.#_e&&(n=st(it.recommendedThrottling,{PH1:n}));const s=this.#je(i),o=e.jslogContext||c.StringUtilities.toKebabCase(i.i18nTitleKey||n);return et`
                  <devtools-menu-item
                    .value=${s}
                    .selected=${t===s}
                    .title=${n}
                    jslog=${r.item(o).track({click:!0})}
                  >
                    ${n}
                  </devtools-menu-item>
                `})}
              ${e.showCustomAddOption?et`
                <devtools-menu-item
                  .value=${1}
                  .title=${st(it.add)}
                  jslog=${r.action("add").track({click:!0})}
                  @click=${this.#Ke}
                >
                  ${st(it.add)}
                </devtools-menu-item>
              `:tt}
            </devtools-menu-group>
          `)}
      </devtools-select-menu>
      ${i}
    `;o.render(n,this.#e,{host:this})}}customElements.define("devtools-network-throttling-selector",ot);var rt=Object.freeze({__proto__:null,NetworkThrottlingSelector:ot}),at=`.metric-card{border-radius:var(--sys-shape-corner-small);padding:14px 16px;background-color:var(--sys-color-surface3);height:100%;box-sizing:border-box;&:not(:hover) .title-help{visibility:hidden}}.title{display:flex;justify-content:space-between;font-size:var(--sys-typescale-headline5-size);line-height:var(--sys-typescale-headline5-line-height);font-weight:var(--ref-typeface-weight-medium);margin:0;margin-bottom:6px}.title-help{height:var(--sys-typescale-headline5-line-height);margin-left:4px}.metric-values-section{position:relative;display:flex;column-gap:8px;margin-bottom:8px}.metric-values-section:focus-visible{outline:2px solid -webkit-focus-ring-color}.metric-source-block{flex:1}.metric-source-value{font-size:32px;line-height:36px;font-weight:var(--ref-typeface-weight-regular)}.metric-source-label{font-weight:var(--ref-typeface-weight-medium)}.warning{margin-top:4px;color:var(--sys-color-error);font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);display:flex;&::before{content:" ";width:var(--sys-typescale-body4-line-height);height:var(--sys-typescale-body4-line-height);mask-size:var(--sys-typescale-body4-line-height);mask-image:var(--image-file-warning);background-color:var(--sys-color-error);margin-right:4px;flex-shrink:0}}.good-bg{background-color:var(--app-color-performance-good)}.needs-improvement-bg{background-color:var(--app-color-performance-ok)}.poor-bg{background-color:var(--app-color-performance-bad)}.divider{width:100%;border:0;border-bottom:1px solid var(--sys-color-divider);margin:8px 0;box-sizing:border-box}.compare-text{margin-top:8px}.environment-recs-intro{margin-top:8px}.environment-recs{margin:9px 0}.environment-recs > summary{font-weight:var(--ref-typeface-weight-medium);margin-bottom:4px;font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);display:flex;&::before{content:" ";width:var(--sys-typescale-body4-line-height);height:var(--sys-typescale-body4-line-height);mask-size:var(--sys-typescale-body4-line-height);mask-image:var(--image-file-triangle-right);background-color:var(--icon-default);margin-right:4px;flex-shrink:0}}details.environment-recs[open] > summary::before{mask-image:var(--image-file-triangle-down)}.environment-recs-list{margin:0}.detailed-compare-text{margin-bottom:8px}.bucket-summaries{margin-top:8px;white-space:nowrap}.bucket-summaries.histogram{display:grid;grid-template-columns:minmax(min-content,auto) minmax(40px,60px) max-content;grid-auto-rows:1fr;column-gap:8px;place-items:center flex-end}.bucket-label{justify-self:start;font-weight:var(--ref-typeface-weight-medium);white-space:wrap;> *{white-space:nowrap}}.bucket-range{color:var(--sys-color-token-subtle)}.histogram-bar{height:6px}.histogram-percent{color:var(--sys-color-token-subtle);font-weight:var(--ref-typeface-weight-medium)}.tooltip{display:none;visibility:hidden;transition-property:visibility;width:min(var(--tooltip-container-width,350px),350px);max-width:max-content;position:absolute;top:100%;left:50%;transform:translateX(-50%);z-index:1;box-sizing:border-box;padding:var(--sys-size-5) var(--sys-size-6);border-radius:var(--sys-shape-corner-small);background-color:var(--sys-color-cdt-base-container);box-shadow:var(--drop-shadow-depth-3);.tooltip-scroll{overflow-x:auto;.tooltip-contents{min-width:min-content}}}.phase-table{display:grid;column-gap:var(--sys-size-3);white-space:nowrap}.phase-table-row{display:contents}.phase-table-value{text-align:right}.phase-table-header-row{font-weight:var(--ref-typeface-weight-medium)}\n/*# sourceURL=${import.meta.resolve("./metricCard.css")} */`;const lt={goodBetterCompare:"Your local {PH1} value of {PH2} is good, but is significantly better than your users’ experience.",goodWorseCompare:"Your local {PH1} value of {PH2} is good, but is significantly worse than your users’ experience.",goodSimilarCompare:"Your local {PH1} value of {PH2} is good, and is similar to your users’ experience.",goodSummarized:"Your local {PH1} value of {PH2} is good.",needsImprovementBetterCompare:"Your local {PH1} value of {PH2} needs improvement, but is significantly better than your users’ experience.",needsImprovementWorseCompare:"Your local {PH1} value of {PH2} needs improvement, but is significantly worse than your users’ experience.",needsImprovementSimilarCompare:"Your local {PH1} value of {PH2} needs improvement, and is similar to your users’ experience.",needsImprovementSummarized:"Your local {PH1} value of {PH2} needs improvement.",poorBetterCompare:"Your local {PH1} value of {PH2} is poor, but is significantly better than your users’ experience.",poorWorseCompare:"Your local {PH1} value of {PH2} is poor, but is significantly worse than your users’ experience.",poorSimilarCompare:"Your local {PH1} value of {PH2} is poor, and is similar to your users’ experience.",poorSummarized:"Your local {PH1} value of {PH2} is poor.",goodGoodDetailedCompare:"Your local {PH1} value of {PH2} is good and is rated the same as {PH4} of real-user {PH1} experiences. Additionally, the field metrics 75th percentile {PH1} value of {PH3} is good.",goodNeedsImprovementDetailedCompare:"Your local {PH1} value of {PH2} is good and is rated the same as {PH4} of real-user {PH1} experiences. However, the field metrics 75th percentile {PH1} value of {PH3} needs improvement.",goodPoorDetailedCompare:"Your local {PH1} value of {PH2} is good and is rated the same as {PH4} of real-user {PH1} experiences. However, the field metrics 75th percentile {PH1} value of {PH3} is poor.",needsImprovementGoodDetailedCompare:"Your local {PH1} value of {PH2} needs improvement and is rated the same as {PH4} of real-user {PH1} experiences. However, the field metrics 75th percentile {PH1} value of {PH3} is good.",needsImprovementNeedsImprovementDetailedCompare:"Your local {PH1} value of {PH2} needs improvement and is rated the same as {PH4} of real-user {PH1} experiences. Additionally, the field metrics 75th percentile {PH1} value of {PH3} needs improvement.",needsImprovementPoorDetailedCompare:"Your local {PH1} value of {PH2} needs improvement and is rated the same as {PH4} of real-user {PH1} experiences. However, the field metrics 75th percentile {PH1} value of {PH3} is poor.",poorGoodDetailedCompare:"Your local {PH1} value of {PH2} is poor and is rated the same as {PH4} of real-user {PH1} experiences. However, the field metrics 75th percentile {PH1} value of {PH3} is good.",poorNeedsImprovementDetailedCompare:"Your local {PH1} value of {PH2} is poor and is rated the same as {PH4} of real-user {PH1} experiences. However, the field metrics 75th percentile {PH1} value of {PH3} needs improvement.",poorPoorDetailedCompare:"Your local {PH1} value of {PH2} is poor and is rated the same as {PH4} of real-user {PH1} experiences. Additionally, the field metrics 75th percentile {PH1} value of {PH3} is poor."},dt=t.i18n.registerUIStrings("panels/timeline/components/MetricCompareStrings.ts",lt);var ct=`.metric-value{text-wrap:nowrap}.metric-value.dim{font-weight:var(--ref-typeface-weight-medium)}.metric-value.waiting{color:var(--sys-color-token-subtle)}.metric-value.good{color:var(--app-color-performance-good)}.metric-value.needs-improvement{color:var(--app-color-performance-ok)}.metric-value.poor{color:var(--app-color-performance-bad)}.metric-value.good.dim{color:var(--app-color-performance-good-dim)}.metric-value.needs-improvement.dim{color:var(--app-color-performance-ok-dim)}.metric-value.poor.dim{color:var(--app-color-performance-bad-dim)}\n/*# sourceURL=${import.meta.resolve("./metricValueStyles.css")} */`;const gt={fms:"{PH1}[ms]()",fs:"{PH1}[s]()"},ht=t.i18n.registerUIStrings("panels/timeline/components/Utils.ts",gt),pt=t.i18n.getLocalizedString.bind(void 0,ht);var ut;function mt(e){const{mimeType:t}=e.args.data;switch(e.args.data.resourceType){case"Document":return ut.DOC;case"Stylesheet":return ut.CSS;case"Image":return ut.IMG;case"Media":return ut.MEDIA;case"Font":return ut.FONT;case"Script":case"WebSocket":return ut.JS;default:return void 0===t?ut.OTHER:t.endsWith("/css")?ut.CSS:t.endsWith("javascript")?ut.JS:t.startsWith("image/")?ut.IMG:t.startsWith("audio/")||t.startsWith("video/")?ut.MEDIA:t.startsWith("font/")||t.includes("font-")?ut.FONT:"application/wasm"===t?ut.WASM:t.startsWith("text/")?ut.DOC:ut.OTHER}}function vt(e){let t="--app-color-system";switch(e){case ut.DOC:t="--app-color-doc";break;case ut.JS:t="--app-color-scripting";break;case ut.CSS:t="--app-color-css";break;case ut.IMG:t="--app-color-image";break;case ut.MEDIA:t="--app-color-media";break;case ut.FONT:t="--app-color-font";break;case ut.WASM:t="--app-color-wasm";break;case ut.OTHER:default:t="--app-color-system"}return x.ThemeSupport.instance().getComputedValue(t)}function bt(e){return vt(mt(e))}!function(e){e.DOC="Doc",e.CSS="CSS",e.JS="JS",e.FONT="Font",e.IMG="Img",e.MEDIA="Media",e.WASM="Wasm",e.OTHER="Other"}(ut||(ut={}));const ft=[2500,4e3],yt=[.1,.25],wt=[200,500];function xt(e,t){return e<=t[0]?"good":e<=t[1]?"needs-improvement":"poor"}function St(e,t,i,n,s){const o=document.createElement("span");if(o.classList.add("metric-value"),void 0===t)return o.classList.add("waiting"),o.textContent="-",o;o.textContent=n(t);const a=xt(t,i);return o.classList.add(a),o.setAttribute("jslog",`${r.section(e)}`),s?.dim&&o.classList.add("dim"),o}var kt;function Ct(e,t,i){let n,s;switch(e){case"LCP":n=ft,s=1e3;break;case"CLS":n=yt,s=.1;break;case"INP":n=wt,s=200;break;default:c.assertNever(e,`Unknown metric: ${e}`)}const o=xt(t,n),r=xt(i,n);return"good"===o&&"good"===r?"similar":t-i>s?"worse":i-t>s?"better":"similar"}!function(e){function i(e){const t=e.indexOf("["),i=-1!==t&&e.indexOf("]",t),n=i&&e.indexOf("(",i),s=n&&e.indexOf(")",n);if(!s||-1===s)return null;return{firstPart:e.substring(0,t),unitPart:e.substring(t+1,i),lastPart:e.substring(s+1)}}e.parse=i,e.formatMicroSecondsAsSeconds=function(e){const n=document.createElement("span");n.classList.add("number-with-unit");const s=c.Timing.microSecondsToMilliSeconds(e),o=c.Timing.milliSecondsToSeconds(s),r=pt(gt.fs,{PH1:o.toFixed(2)}),a=i(r);if(!a)return n.textContent=t.TimeUtilities.formatMicroSecondsAsSeconds(e),{text:r,element:n};const{firstPart:l,unitPart:d,lastPart:g}=a;return l&&n.append(l),n.createChild("span","unit").textContent=d,g&&n.append(g),{text:n.textContent??"",element:n}},e.formatMicroSecondsAsMillisFixed=function(e,n=0){const s=document.createElement("span");s.classList.add("number-with-unit");const o=c.Timing.microSecondsToMilliSeconds(e),r=pt(gt.fms,{PH1:o.toFixed(n)}),a=i(r);if(!a)return s.textContent=t.TimeUtilities.formatMicroSecondsAsMillisFixed(e),{text:r,element:s};const{firstPart:l,unitPart:d,lastPart:g}=a;return l&&s.append(l),s.createChild("span","unit").textContent=d,g&&s.append(g),{text:s.textContent??"",element:s}}}(kt||(kt={}));var $t=Object.freeze({__proto__:null,CLS_THRESHOLDS:yt,INP_THRESHOLDS:wt,LCP_THRESHOLDS:ft,get NetworkCategory(){return ut},get NumberWithUnit(){return kt},colorForNetworkCategory:vt,colorForNetworkRequest:bt,determineCompareRating:Ct,networkResourceCategory:mt,rateMetric:xt,renderMetricValue:St});const{html:Tt,nothing:Lt}=o,Pt={localValue:"Local",field75thPercentile:"Field 75th percentile",fieldP75:"Field p75",good:"Good",needsImprovement:"Needs improvement",poor:"Poor",leqRange:"(≤{PH1})",betweenRange:"({PH1}-{PH2})",gtRange:"(>{PH1})",percentage:"{PH1}%",interactToMeasure:"Interact with the page to measure INP.",viewCardDetails:"View card details",considerTesting:"Consider your local test conditions",recThrottlingLCP:"Real users may experience longer page loads due to slower network conditions. Increasing network throttling will simulate slower network conditions.",recThrottlingINP:"Real users may experience longer interactions due to slower CPU speeds. Increasing CPU throttling will simulate a slower device.",recViewportLCP:"Screen size can influence what the LCP element is. Ensure you are testing common viewport sizes.",recViewportCLS:"Screen size can influence what layout shifts happen. Ensure you are testing common viewport sizes.",recJourneyCLS:"How a user interacts with the page can influence layout shifts. Ensure you are testing common interactions like scrolling the page.",recJourneyINP:"How a user interacts with the page influences interaction delays. Ensure you are testing common interactions.",recDynamicContentLCP:"The LCP element can vary between page loads if content is dynamic.",recDynamicContentCLS:"Dynamic content can influence what layout shifts happen.",phase:"Phase",lcpHelpTooltip:"LCP reports the render time of the largest image, text block, or video visible in the viewport. Click here to learn more about LCP.",clsHelpTooltip:"CLS measures the amount of unexpected shifted content. Click here to learn more about CLS.",inpHelpTooltip:"INP measures the overall responsiveness to all click, tap, and keyboard interactions. Click here to learn more about INP."},It=t.i18n.registerUIStrings("panels/timeline/components/MetricCard.ts",Pt),Mt=t.i18n.getLocalizedString.bind(void 0,It);class Rt extends HTMLElement{#e=this.attachShadow({mode:"open"});constructor(){super(),this.#n()}#Ye;#f={metric:"LCP"};set data(e){this.#f=e,n.ScheduledRender.scheduleRender(this,this.#n)}connectedCallback(){n.ScheduledRender.scheduleRender(this,this.#n)}#Ge=e=>{c.KeyboardUtilities.isEscKey(e)&&(e.stopPropagation(),this.#Xe())};#Je(e){const t=e.target;t?.hasFocus()||this.#Xe()}#Ze(e){const t=e.target;if(t?.hasFocus())return;const i=e.relatedTarget;i instanceof Node&&t.contains(i)||this.#Xe()}#Xe(){const e=this.#Ye;e&&(document.body.removeEventListener("keydown",this.#Ge),e.style.removeProperty("left"),e.style.removeProperty("visibility"),e.style.removeProperty("display"),e.style.removeProperty("transition-delay"))}#Qe(e=0){const t=this.#Ye;if(!t||t.style.visibility||t.style.display)return;document.body.addEventListener("keydown",this.#Ge),t.style.display="block",t.style.transitionDelay=`${Math.round(e)}ms`;const i=this.#f.tooltipContainer;if(!i)return;const n=i.getBoundingClientRect();t.style.setProperty("--tooltip-container-width",`${Math.round(n.width)}px`),requestAnimationFrame(()=>{let e=0;const i=t.getBoundingClientRect(),s=i.right-n.right,o=i.left-n.left;o<0?e=Math.round(o):s>0&&(e=Math.round(s)),t.style.left=`calc(50% - ${e}px)`,t.style.visibility="visible"})}#et(){switch(this.#f.metric){case"LCP":return t.i18n.lockedString("Largest Contentful Paint (LCP)");case"CLS":return t.i18n.lockedString("Cumulative Layout Shift (CLS)");case"INP":return t.i18n.lockedString("Interaction to Next Paint (INP)")}}#tt(){switch(this.#f.metric){case"LCP":return ft;case"CLS":return yt;case"INP":return wt}}#it(){switch(this.#f.metric){case"LCP":return e=>{const i=1e3*e;return t.TimeUtilities.formatMicroSecondsAsSeconds(i)};case"CLS":return e=>0===e?"0":e.toFixed(2);case"INP":return e=>t.TimeUtilities.preciseMillisToString(e)}}#nt(){switch(this.#f.metric){case"LCP":return"https://web.dev/articles/lcp";case"CLS":return"https://web.dev/articles/cls";case"INP":return"https://web.dev/articles/inp"}}#st(){switch(this.#f.metric){case"LCP":return Mt(Pt.lcpHelpTooltip);case"CLS":return Mt(Pt.clsHelpTooltip);case"INP":return Mt(Pt.inpHelpTooltip)}}#ot(){const{localValue:e}=this.#f;if(void 0!==e)return e}#rt(){let{fieldValue:e}=this.#f;if(void 0!==e&&("string"==typeof e&&(e=Number(e)),Number.isFinite(e)))return e}#at(){const e=this.#ot(),t=this.#rt();if(void 0!==e&&void 0!==t)return Ct(this.#f.metric,e,t)}#lt(){const e=this.#ot();if(void 0===e)return"INP"===this.#f.metric?Tt`
          <div class="compare-text">${Mt(Pt.interactToMeasure)}</div>
        `:o.nothing;const i=this.#at(),n=xt(e,this.#tt()),s=St(this.#dt(!0),e,this.#tt(),this.#it(),{dim:!0});return Tt`
      <div class="compare-text">
        ${function(e){const{rating:t,compare:i}=e,n={PH1:e.metric,PH2:e.localValue};if("good"===t&&"better"===i)return g.getFormatLocalizedString(dt,lt.goodBetterCompare,n);if("good"===t&&"worse"===i)return g.getFormatLocalizedString(dt,lt.goodWorseCompare,n);if("good"===t&&"similar"===i)return g.getFormatLocalizedString(dt,lt.goodSimilarCompare,n);if("good"===t&&!i)return g.getFormatLocalizedString(dt,lt.goodSummarized,n);if("needs-improvement"===t&&"better"===i)return g.getFormatLocalizedString(dt,lt.needsImprovementBetterCompare,n);if("needs-improvement"===t&&"worse"===i)return g.getFormatLocalizedString(dt,lt.needsImprovementWorseCompare,n);if("needs-improvement"===t&&"similar"===i)return g.getFormatLocalizedString(dt,lt.needsImprovementSimilarCompare,n);if("needs-improvement"===t&&!i)return g.getFormatLocalizedString(dt,lt.needsImprovementSummarized,n);if("poor"===t&&"better"===i)return g.getFormatLocalizedString(dt,lt.poorBetterCompare,n);if("poor"===t&&"worse"===i)return g.getFormatLocalizedString(dt,lt.poorWorseCompare,n);if("poor"===t&&"similar"===i)return g.getFormatLocalizedString(dt,lt.poorSimilarCompare,n);if("poor"===t&&!i)return g.getFormatLocalizedString(dt,lt.poorSummarized,n);throw new Error("Compare string not found")}({metric:t.i18n.lockedString(this.#f.metric),rating:n,compare:i,localValue:s})}
      </div>
    `}#ct(){const e=this.#at();if(!e||"similar"===e)return o.nothing;const t=[],i=this.#f.metric;return"LCP"===i&&"better"===e?t.push(Mt(Pt.recThrottlingLCP)):"INP"===i&&"better"===e&&t.push(Mt(Pt.recThrottlingINP)),"LCP"===i?t.push(Mt(Pt.recViewportLCP)):"CLS"===i&&t.push(Mt(Pt.recViewportCLS)),"CLS"===i?t.push(Mt(Pt.recJourneyCLS)):"INP"===i&&t.push(Mt(Pt.recJourneyINP)),"LCP"===i?t.push(Mt(Pt.recDynamicContentLCP)):"CLS"===i&&t.push(Mt(Pt.recDynamicContentCLS)),t.length?Tt`
      <details class="environment-recs">
        <summary>${Mt(Pt.considerTesting)}</summary>
        <ul class="environment-recs-list">${t.map(e=>Tt`<li>${e}</li>`)}</ul>
      </details>
    `:o.nothing}#dt(e){return`timeline.landing.${e?"local":"field"}-${this.#f.metric.toLowerCase()}`}#gt(){const e=this.#ot();if(void 0===e)return"INP"===this.#f.metric?Tt`
          <div class="detailed-compare-text">${Mt(Pt.interactToMeasure)}</div>
        `:o.nothing;const i=xt(e,this.#tt()),n=this.#rt(),s=void 0!==n?xt(n,this.#tt()):void 0,r=St(this.#dt(!0),e,this.#tt(),this.#it(),{dim:!0}),a=St(this.#dt(!1),n,this.#tt(),this.#it(),{dim:!0});return Tt`
      <div class="detailed-compare-text">${function(e){const{localRating:t,fieldRating:i}=e,n={PH1:e.metric,PH2:e.localValue,PH3:e.fieldValue,PH4:e.percent};if("good"===t&&"good"===i)return g.getFormatLocalizedString(dt,lt.goodGoodDetailedCompare,n);if("good"===t&&"needs-improvement"===i)return g.getFormatLocalizedString(dt,lt.goodNeedsImprovementDetailedCompare,n);if("good"===t&&"poor"===i)return g.getFormatLocalizedString(dt,lt.goodPoorDetailedCompare,n);if("good"===t&&!i)return g.getFormatLocalizedString(dt,lt.goodSummarized,n);if("needs-improvement"===t&&"good"===i)return g.getFormatLocalizedString(dt,lt.needsImprovementGoodDetailedCompare,n);if("needs-improvement"===t&&"needs-improvement"===i)return g.getFormatLocalizedString(dt,lt.needsImprovementNeedsImprovementDetailedCompare,n);if("needs-improvement"===t&&"poor"===i)return g.getFormatLocalizedString(dt,lt.needsImprovementPoorDetailedCompare,n);if("needs-improvement"===t&&!i)return g.getFormatLocalizedString(dt,lt.needsImprovementSummarized,n);if("poor"===t&&"good"===i)return g.getFormatLocalizedString(dt,lt.poorGoodDetailedCompare,n);if("poor"===t&&"needs-improvement"===i)return g.getFormatLocalizedString(dt,lt.poorNeedsImprovementDetailedCompare,n);if("poor"===t&&"poor"===i)return g.getFormatLocalizedString(dt,lt.poorPoorDetailedCompare,n);if("poor"===t&&!i)return g.getFormatLocalizedString(dt,lt.poorSummarized,n);throw new Error("Detailed compare string not found")}({metric:t.i18n.lockedString(this.#f.metric),localRating:i,fieldRating:s,localValue:r,fieldValue:a,percent:this.#ht(i)})}</div>
    `}#pt(e){switch(e){case"good":return 0;case"needs-improvement":return 1;case"poor":return 2}}#ut(e){const t=this.#f.histogram,i=t?.[this.#pt(e)].density||0;return`${Math.round(100*i)}%`}#ht(e){const t=this.#f.histogram;if(void 0===t)return"-";const i=t[this.#pt(e)].density||0,n=Math.round(100*i);return Mt(Pt.percentage,{PH1:n})}#mt(){const e=u.CrUXManager.instance().getConfigSetting().get().enabled,t=this.#it(),i=this.#tt(),n=Tt`
      <div class="bucket-label">
        <span>${Mt(Pt.good)}</span>
        <span class="bucket-range"> ${Mt(Pt.leqRange,{PH1:t(i[0])})}</span>
      </div>
    `,s=Tt`
      <div class="bucket-label">
        <span>${Mt(Pt.needsImprovement)}</span>
        <span class="bucket-range"> ${Mt(Pt.betweenRange,{PH1:t(i[0]),PH2:t(i[1])})}</span>
      </div>
    `,o=Tt`
      <div class="bucket-label">
        <span>${Mt(Pt.poor)}</span>
        <span class="bucket-range"> ${Mt(Pt.gtRange,{PH1:t(i[1])})}</span>
      </div>
    `;return e?Tt`
      <div class="bucket-summaries histogram">
        ${n}
        <div class="histogram-bar good-bg" style="width: ${this.#ut("good")}"></div>
        <div class="histogram-percent">${this.#ht("good")}</div>
        ${s}
        <div class="histogram-bar needs-improvement-bg" style="width: ${this.#ut("needs-improvement")}"></div>
        <div class="histogram-percent">${this.#ht("needs-improvement")}</div>
        ${o}
        <div class="histogram-bar poor-bg" style="width: ${this.#ut("poor")}"></div>
        <div class="histogram-percent">${this.#ht("poor")}</div>
      </div>
    `:Tt`
        <div class="bucket-summaries">
          ${n}
          ${s}
          ${o}
        </div>
      `}#vt(e){const i=e.every(e=>void 0!==e[2]);return Tt`
      <hr class="divider">
      <div class="phase-table" role="table">
        <div class="phase-table-row phase-table-header-row" role="row">
          <div role="columnheader" style="grid-column: 1">${Mt(Pt.phase)}</div>
          <div role="columnheader" class="phase-table-value" style="grid-column: 2">${Mt(Pt.localValue)}</div>
          ${i?Tt`
            <div
              role="columnheader"
              class="phase-table-value"
              style="grid-column: 3"
              title=${Mt(Pt.field75thPercentile)}>${Mt(Pt.fieldP75)}</div>
          `:Lt}
        </div>
        ${e.map(e=>Tt`
          <div class="phase-table-row" role="row">
            <div role="cell">${e[0]}</div>
            <div role="cell" class="phase-table-value">${t.TimeUtilities.preciseMillisToString(e[1])}</div>
            ${void 0!==e[2]?Tt`
              <div role="cell" class="phase-table-value">${t.TimeUtilities.preciseMillisToString(e[2])}</div>
            `:Lt}
          </div>
        `)}
      </div>
    `}#n=()=>{const e=u.CrUXManager.instance().getConfigSetting().get().enabled,t=this.#nt(),i=this.#ot(),r=this.#rt(),a=this.#tt(),l=this.#it(),d=St(this.#dt(!0),i,a,l),c=St(this.#dt(!1),r,a,l),g=Tt`
      <style>${at}</style>
      <style>${ct}</style>
      <div class="metric-card">
        <h3 class="title">
          ${this.#et()}
          <devtools-button
            class="title-help"
            title=${this.#st()}
            .iconName=${"help"}
            .variant=${"icon"}
            @click=${()=>s.UIUtils.openInNewTab(t)}
          ></devtools-button>
        </h3>
        <div tabindex="0" class="metric-values-section"
          @mouseenter=${()=>this.#Qe(500)}
          @mouseleave=${this.#Je}
          @focusin=${this.#Qe}
          @focusout=${this.#Ze}
          aria-describedby="tooltip"
        >
          <div class="metric-source-block">
            <div class="metric-source-value" id="local-value">${d}</div>
            ${e?Tt`<div class="metric-source-label">${Mt(Pt.localValue)}</div>`:Lt}
          </div>
          ${e?Tt`
            <div class="metric-source-block">
              <div class="metric-source-value" id="field-value">${c}</div>
              <div class="metric-source-label">${Mt(Pt.field75thPercentile)}</div>
            </div>
          `:Lt}
          <div
            id="tooltip"
            class="tooltip"
            role="tooltip"
            aria-label=${Mt(Pt.viewCardDetails)}
            on-render=${n.Directives.nodeRenderedCallback(e=>{this.#Ye=e})}
          >
            <div class="tooltip-scroll">
              <div class="tooltip-contents">
                <div>
                  ${this.#gt()}
                  <hr class="divider">
                  ${this.#mt()}
                  ${i&&this.#f.phases?this.#vt(this.#f.phases):Lt}
                </div>
              </div>
            </div>
          </div>
        </div>
        ${e?Tt`<hr class="divider">`:Lt}
        ${this.#lt()}
        ${this.#f.warnings?.map(e=>Tt`
          <div class="warning">${e}</div>
        `)}
        ${this.#ct()}
        <slot name="extra-info"></slot>
      </div>
    `;o.render(g,this.#e,{host:this})}}customElements.define("devtools-metric-card",Rt);var Et=Object.freeze({__proto__:null,MetricCard:Rt});const{html:Dt}=o;function Ht(e){return e.activeCategory===i.Insights.Types.InsightCategory.ALL||e.activeCategory===e.insightCategory}function Ft(e){const t=T.Marked.lexer(e);return Dt`<devtools-markdown-view .data=${{tokens:t}}></devtools-markdown-view>`}var Nt=`.container{container-type:inline-size;height:100%;font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);font-weight:var(--ref-typeface-weight-regular);user-select:text}.live-metrics-view{--min-main-area-size:60%;background-color:var(--sys-color-cdt-base-container);display:flex;flex-direction:row;width:100%;height:100%}.live-metrics,\n.next-steps{padding:16px;height:100%;overflow-y:auto;box-sizing:border-box}.live-metrics{flex:1;display:flex;flex-direction:column}.next-steps{flex:0 0 336px;box-sizing:border-box;border:none;border-left:1px solid var(--sys-color-divider)}@container (max-width: 650px){.live-metrics-view{flex-direction:column}.next-steps{flex-basis:40%;border:none;border-top:1px solid var(--sys-color-divider)}}.metric-cards{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));width:100%}.section-title{font-size:var(--sys-typescale-headline4-size);line-height:var(--sys-typescale-headline4-line-height);font-weight:var(--ref-typeface-weight-medium);margin:0;margin-bottom:10px}.settings-card{border-radius:var(--sys-shape-corner-small);padding:14px 16px 16px;background-color:var(--sys-color-surface3);margin-bottom:16px}.record-action-card{border-radius:var(--sys-shape-corner-small);padding:12px 16px 12px 12px;background-color:var(--sys-color-surface3);margin-bottom:16px}.card-title{font-size:var(--sys-typescale-headline5-size);line-height:var(--sys-typescale-headline5-line-height);font-weight:var(--ref-typeface-weight-medium);margin:0}.settings-card .card-title{margin-bottom:4px}.device-toolbar-description{margin-bottom:12px;display:flex}.network-cache-setting{display:inline-block;max-width:max-content}.throttling-recommendation-value{font-weight:var(--ref-typeface-weight-medium)}.related-info{text-wrap:nowrap;margin-top:8px;display:flex}.related-info-label{font-weight:var(--ref-typeface-weight-medium);margin-right:4px}.related-info-link{background-color:var(--sys-color-cdt-base-container);border-radius:2px;padding:0 2px;min-width:0}.local-field-link{display:inline-block;width:fit-content;margin-top:8px}.logs-section{margin-top:24px;display:flex;flex-direction:column;flex:1 0 300px;overflow:hidden;max-height:max-content;--app-color-toolbar-background:transparent}.logs-section-header{display:flex;align-items:center}.interactions-clear{margin-left:4px;vertical-align:sub}.log{padding:0;margin:0;overflow:auto}.log-item{border:none;border-bottom:1px solid var(--sys-color-divider);&.highlight{animation:highlight-fadeout 2s}}.interaction{--phase-table-margin:120px;--details-indicator-width:18px;summary{display:flex;align-items:center;padding:7px 4px;&::before{content:" ";height:14px;width:var(--details-indicator-width);mask-image:var(--image-file-triangle-right);background-color:var(--icon-default);flex-shrink:0}}details[open] summary::before{mask-image:var(--image-file-triangle-down)}}.interaction-type{font-weight:var(--ref-typeface-weight-medium);width:calc(var(--phase-table-margin) - var(--details-indicator-width));flex-shrink:0}.interaction-inp-chip{background-color:var(--sys-color-yellow-bright);color:var(--sys-color-on-yellow);padding:0 2px}.interaction-node{flex-grow:1;margin-right:32px;min-width:0}.interaction-info{width:var(--sys-typescale-body4-line-height);height:var(--sys-typescale-body4-line-height);margin-right:6px}.interaction-duration{text-align:end;width:max-content;flex-shrink:0;font-weight:var(--ref-typeface-weight-medium)}.layout-shift{display:flex;align-items:flex-start}.layout-shift-score{margin-right:16px;padding:7px 0;width:150px;box-sizing:border-box}.layout-shift-nodes{flex:1;min-width:0}.layout-shift-node{border-bottom:1px solid var(--sys-color-divider);padding:7px 0;&:last-child{border:none}}.record-action{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:8px}.shortcut-label{width:max-content;flex-shrink:0}.field-data-option{margin:8px 0;max-width:100%}.field-setup-buttons{margin-top:14px}.field-data-message{margin-bottom:12px}.field-data-warning{margin-top:4px;color:var(--sys-color-error);font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);display:flex;&::before{content:" ";width:var(--sys-typescale-body4-line-height);height:var(--sys-typescale-body4-line-height);mask-size:var(--sys-typescale-body4-line-height);mask-image:var(--image-file-warning);background-color:var(--sys-color-error);margin-right:4px;flex-shrink:0}}.collection-period-range{font-weight:var(--ref-typeface-weight-medium)}x-link{color:var(--sys-color-primary);text-decoration-line:underline}.environment-option{display:flex;align-items:center;margin-top:8px}.environment-recs-list{margin:0;padding-left:20px}.environment-rec{font-weight:var(--ref-typeface-weight-medium)}.link-to-log{padding:unset;background:unset;border:unset;font:inherit;color:var(--sys-color-primary);text-decoration:underline;cursor:pointer}@keyframes highlight-fadeout{from{background-color:var(--sys-color-yellow-container)}to{background-color:transparent}}.phase-table{border-top:1px solid var(--sys-color-divider);padding:7px 4px;margin-left:var(--phase-table-margin)}.phase-table-row{display:flex;justify-content:space-between}.phase-table-header-row{font-weight:var(--ref-typeface-weight-medium);margin-bottom:4px}.log-extra-details-button{padding:unset;background:unset;border:unset;font:inherit;color:var(--sys-color-primary);text-decoration:underline;cursor:pointer}.node-view{display:flex;align-items:center;justify-content:center;height:100%;font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);font-weight:var(--ref-typeface-weight-regular);user-select:text;main{width:300px;max-width:100%;text-align:center;.section-title{margin-bottom:4px}}}.node-description{margin-bottom:12px}\n/*# sourceURL=${import.meta.resolve("./liveMetricsView.css")} */`;const{html:Ot,nothing:zt}=o,At=["AUTO",...u.DEVICE_SCOPE_LIST],Ut={localAndFieldMetrics:"Local and field metrics",localMetrics:"Local metrics",eventLogs:"Interaction and layout shift logs section",interactions:"Interactions",layoutShifts:"Layout shifts",nextSteps:"Next steps",fieldMetricsTitle:"Field metrics",environmentSettings:"Environment settings",showFieldDataForDevice:"Show field metrics for device type: {PH1}",notEnoughData:"Not enough data",network:"Network: {PH1}",device:"Device: {PH1}",allDevices:"All devices",desktop:"Desktop",mobile:"Mobile",tablet:"Tablet",auto:"Auto ({PH1})",loadingOption:"{PH1} - Loading…",needsDataOption:"{PH1} - No data",urlOption:"URL",originOption:"Origin",urlOptionWithKey:"URL: {PH1}",originOptionWithKey:"Origin: {PH1}",showFieldDataForPage:"Show field metrics for {PH1}",tryDisablingThrottling:"75th percentile is too fast to simulate with throttling",tryUsingThrottling:"75th percentile is similar to {PH1} throttling",percentDevices:"{PH1}% mobile, {PH2}% desktop",useDeviceToolbar:"Use the [device toolbar](https://developer.chrome.com/docs/devtools/device-mode) and configure throttling to simulate real user environments and identify more performance issues.",disableNetworkCache:"Disable network cache",lcpElement:"LCP element",inpInteractionLink:"INP interaction",worstCluster:"Worst cluster",numShifts:"{shiftCount, plural,\n    =1 {{shiftCount} shift}\n    other {{shiftCount} shifts}\n  }",collectionPeriod:"Collection period: {PH1}",dateRange:"{PH1} - {PH2}",seeHowYourLocalMetricsCompare:"See how your local metrics compare to real user data in the {PH1}.",localFieldLearnMoreLink:"Learn more about local and field metrics",localFieldLearnMoreTooltip:"Local metrics are captured from the current page using your network connection and device. field metrics is measured by real users using many different network connections and devices.",interactionExcluded:"INP is calculated using the 98th percentile of interaction delays, so some interaction delays may be larger than the INP value.",clearCurrentLog:"Clear the current log",timeToFirstByte:"Time to first byte",resourceLoadDelay:"Resource load delay",resourceLoadDuration:"Resource load duration",elementRenderDelay:"Element render delay",inputDelay:"Input delay",processingDuration:"Processing duration",presentationDelay:"Presentation delay",inpInteraction:"The INP interaction is at the 98th percentile of interaction delays.",showInpInteraction:"Go to the INP interaction.",showClsCluster:"Go to worst layout shift cluster.",phase:"Phase",duration:"Local duration (ms)",logToConsole:"Log additional interaction data to the console",nodePerformanceTimeline:"Node performance",nodeClickToRecord:"Record a performance timeline of the connected Node process."},_t=t.i18n.registerUIStrings("panels/timeline/components/LiveMetricsView.ts",Ut),Bt=t.i18n.getLocalizedString.bind(void 0,_t);class Vt extends $.LegacyWrapper.WrappableComponent{#e=this.attachShadow({mode:"open"});isNode=S.Runtime.Runtime.isNode();#bt;#ft;#yt;#wt=new Map;#xt=[];#St=u.CrUXManager.instance();#kt;#Ct;#$t;#Tt;#Lt;#Pt;#It=!1;#Mt=k.DeviceModeModel.DeviceModeModel.tryInstance();constructor(){super(),this.#kt=s.ActionRegistry.ActionRegistry.instance().getAction("timeline.toggle-recording"),this.#Ct=s.ActionRegistry.ActionRegistry.instance().getAction("timeline.record-reload")}#Rt(e){this.#bt=e.data.lcp,this.#ft=e.data.cls,this.#yt=e.data.inp;const t=this.#xt.length<e.data.layoutShifts.length;this.#xt=[...e.data.layoutShifts];const i=this.#wt.size<e.data.interactions.size;this.#wt=new Map(e.data.interactions);const s=n.ScheduledRender.scheduleRender(this,this.#n);i&&this.#Lt&&this.#Et(s,this.#Lt),t&&this.#Pt&&this.#Et(s,this.#Pt)}#Et(e,t){if(!t.checkVisibility())return;(Math.abs(t.scrollHeight-t.clientHeight-t.scrollTop)<=1||this.#It)&&e.then(()=>{requestAnimationFrame(()=>{this.#It=!0,t.addEventListener("scrollend",()=>{this.#It=!1},{once:!0}),t.scrollTo({top:t.scrollHeight,behavior:"smooth"})})})}#Dt(){n.ScheduledRender.scheduleRender(this,this.#n)}#Ht(){n.ScheduledRender.scheduleRender(this,this.#n)}async#Ft(){this.isNode||await this.#St.refresh(),n.ScheduledRender.scheduleRender(this,this.#n)}connectedCallback(){const e=C.LiveMetrics.instance();e.addEventListener("status",this.#Rt,this);const t=u.CrUXManager.instance();t.addEventListener("field-data-changed",this.#Dt,this),this.#Mt?.addEventListener("Updated",this.#Ht,this),t.getConfigSetting().get().enabled&&this.#Ft(),this.#bt=e.lcpValue,this.#ft=e.clsValue,this.#yt=e.inpValue,this.#wt=e.interactions,this.#xt=e.layoutShifts,n.ScheduledRender.scheduleRender(this,this.#n)}disconnectedCallback(){C.LiveMetrics.instance().removeEventListener("status",this.#Rt,this);u.CrUXManager.instance().removeEventListener("field-data-changed",this.#Dt,this),this.#Mt?.removeEventListener("Updated",this.#Ht,this)}#Nt(){const e=this.#St.getSelectedFieldMetricData("largest_contentful_paint_image_time_to_first_byte")?.percentiles?.p75,t=this.#St.getSelectedFieldMetricData("largest_contentful_paint_image_resource_load_delay")?.percentiles?.p75,n=this.#St.getSelectedFieldMetricData("largest_contentful_paint_image_resource_load_duration")?.percentiles?.p75,s=this.#St.getSelectedFieldMetricData("largest_contentful_paint_image_element_render_delay")?.percentiles?.p75;return"number"!=typeof e||"number"!=typeof t||"number"!=typeof n||"number"!=typeof s?null:{timeToFirstByte:i.Types.Timing.Milli(e),resourceLoadDelay:i.Types.Timing.Milli(t),resourceLoadTime:i.Types.Timing.Milli(n),elementRenderDelay:i.Types.Timing.Milli(s)}}#Ot(){const e=this.#St.getSelectedFieldMetricData("largest_contentful_paint"),t=this.#bt?.nodeRef?.link,i=this.#bt?.phases,n=this.#Nt();return Ot`
      <devtools-metric-card .data=${{metric:"LCP",localValue:this.#bt?.value,fieldValue:e?.percentiles?.p75,histogram:e?.histogram,tooltipContainer:this.#Tt,warnings:this.#bt?.warnings,phases:i&&[[Bt(Ut.timeToFirstByte),i.timeToFirstByte,n?.timeToFirstByte],[Bt(Ut.resourceLoadDelay),i.resourceLoadDelay,n?.resourceLoadDelay],[Bt(Ut.resourceLoadDuration),i.resourceLoadTime,n?.resourceLoadTime],[Bt(Ut.elementRenderDelay),i.elementRenderDelay,n?.elementRenderDelay]]}}>
        ${t?Ot`
            <div class="related-info" slot="extra-info">
              <span class="related-info-label">${Bt(Ut.lcpElement)}</span>
              <span class="related-info-link">${t}</span>
            </div>
          `:zt}
      </devtools-metric-card>
    `}#zt(){const e=this.#St.getSelectedFieldMetricData("cumulative_layout_shift"),t=new Set(this.#ft?.clusterShiftIds||[]),i=t.size>0&&this.#xt.some(e=>t.has(e.uniqueLayoutShiftId));return Ot`
      <devtools-metric-card .data=${{metric:"CLS",localValue:this.#ft?.value,fieldValue:e?.percentiles?.p75,histogram:e?.histogram,tooltipContainer:this.#Tt,warnings:this.#ft?.warnings}}>
        ${i?Ot`
          <div class="related-info" slot="extra-info">
            <span class="related-info-label">${Bt(Ut.worstCluster)}</span>
            <button
              class="link-to-log"
              title=${Bt(Ut.showClsCluster)}
              @click=${()=>this.#At(t)}
              jslog=${r.action("timeline.landing.show-cls-cluster").track({click:!0})}
            >${Bt(Ut.numShifts,{shiftCount:t.size})}</button>
          </div>
        `:zt}
      </devtools-metric-card>
    `}#Ut(){const e=this.#St.getSelectedFieldMetricData("interaction_to_next_paint"),t=this.#yt?.phases,i=this.#yt&&this.#wt.get(this.#yt.interactionId);return Ot`
      <devtools-metric-card .data=${{metric:"INP",localValue:this.#yt?.value,fieldValue:e?.percentiles?.p75,histogram:e?.histogram,tooltipContainer:this.#Tt,warnings:this.#yt?.warnings,phases:t&&[[Bt(Ut.inputDelay),t.inputDelay],[Bt(Ut.processingDuration),t.processingDuration],[Bt(Ut.presentationDelay),t.presentationDelay]]}}>
        ${i?Ot`
          <div class="related-info" slot="extra-info">
            <span class="related-info-label">${Bt(Ut.inpInteractionLink)}</span>
            <button
              class="link-to-log"
              title=${Bt(Ut.showInpInteraction)}
              @click=${()=>this.#_t(i)}
              jslog=${r.action("timeline.landing.show-inp-interaction").track({click:!0})}
            >${i.interactionType}</button>
          </div>
        `:zt}
      </devtools-metric-card>
    `}#Bt(e){return Ot`
      <div class="record-action">
        <devtools-button @click=${function(){e.execute()}} .data=${{variant:"text",size:"REGULAR",iconName:e.icon(),title:e.title(),jslogContext:e.id()}}>
          ${e.title()}
        </devtools-button>
        <span class="shortcut-label">${s.ShortcutRegistry.ShortcutRegistry.instance().shortcutTitleForAction(e.id())}</span>
      </div>
    `}#Vt(){const e=this.#St.getSelectedFieldMetricData("round_trip_time");if(!e?.percentiles)return null;const t=Number(e.percentiles.p75);if(!Number.isFinite(t))return null;if(t<60)return Bt(Ut.tryDisablingThrottling);const i=l.NetworkManager.getRecommendedNetworkPreset(t);if(!i)return null;const n="function"==typeof i.title?i.title():i.title;return Bt(Ut.tryUsingThrottling,{PH1:n})}#Wt(){const e=this.#St.getFieldResponse(this.#St.fieldPageScope,"ALL")?.record.metrics.form_factors?.fractions;return e?Bt(Ut.percentDevices,{PH1:Math.round(100*e.phone),PH2:Math.round(100*e.desktop)}):null}#jt(){const e=this.#St.getConfigSetting().get().enabled,t=document.createElement("span");t.classList.add("environment-rec"),t.textContent=this.#Wt()||Bt(Ut.notEnoughData);const i=document.createElement("span");i.classList.add("environment-rec"),i.textContent=this.#Vt()||Bt(Ut.notEnoughData);const n=function(){let e=l.CPUThrottlingManager.CalibratedMidTierMobileThrottlingOption;0===e.rate()&&(e=l.CPUThrottlingManager.MidTierThrottlingOption);let t=null;const i=u.CrUXManager.instance().getSelectedFieldMetricData("round_trip_time");if(i?.percentiles){const e=Number(i.percentiles.p75);t=l.NetworkManager.getRecommendedNetworkPreset(e)}return{cpuOption:e,networkConditions:t}}();return Ot`
      <h3 class="card-title">${Bt(Ut.environmentSettings)}</h3>
      <div class="device-toolbar-description">${Ft(Bt(Ut.useDeviceToolbar))}</div>
      ${e?Ot`
        <ul class="environment-recs-list">
          <li>${g.getFormatLocalizedString(_t,Ut.device,{PH1:t})}</li>
          <li>${g.getFormatLocalizedString(_t,Ut.network,{PH1:i})}</li>
        </ul>
      `:zt}
      <div class="environment-option">
        <devtools-widget .widgetConfig=${s.Widget.widgetConfig(Y,{recommendedOption:n.cpuOption})}></devtools-widget>
      </div>
      <div class="environment-option">
        <devtools-network-throttling-selector .recommendedConditions=${n.networkConditions}></devtools-network-throttling-selector>
      </div>
      <div class="environment-option">
        <setting-checkbox
          class="network-cache-setting"
          .data=${{setting:a.Settings.Settings.instance().moduleSetting("cache-disabled"),textOverride:Bt(Ut.disableNetworkCache)}}
        ></setting-checkbox>
      </div>
    `}#qt(e){const t=this.#St.pageResult?.[`${e}-ALL`]?.record.key[e];if(t)return Bt("url"===e?Ut.urlOptionWithKey:Ut.originOptionWithKey,{PH1:t});const i=Bt("url"===e?Ut.urlOption:Ut.originOption);return Bt(Ut.needsDataOption,{PH1:i})}#Kt(e){"url"===e.itemValue?this.#St.fieldPageScope="url":this.#St.fieldPageScope="origin",n.ScheduledRender.scheduleRender(this,this.#n)}#Yt(){if(!this.#St.getConfigSetting().get().enabled)return o.nothing;const e=this.#qt("url"),t=this.#qt("origin"),i="url"===this.#St.fieldPageScope?e:t,n=Bt(Ut.showFieldDataForPage,{PH1:i}),s=!this.#St.pageResult?.["url-ALL"]&&!this.#St.pageResult?.["origin-ALL"];return Ot`
      <devtools-select-menu
        id="page-scope-select"
        class="field-data-option"
        @selectmenuselected=${this.#Kt}
        .showDivider=${!0}
        .showArrow=${!0}
        .sideButton=${!1}
        .showSelectedItem=${!0}
        .buttonTitle=${i}
        .disabled=${s}
        title=${n}
      >
        <devtools-menu-item
          .value=${"url"}
          .selected=${"url"===this.#St.fieldPageScope}
        >
          ${e}
        </devtools-menu-item>
        <devtools-menu-item
          .value=${"origin"}
          .selected=${"origin"===this.#St.fieldPageScope}
        >
          ${t}
        </devtools-menu-item>
      </devtools-select-menu>
    `}#Gt(e){switch(e){case"ALL":return Bt(Ut.allDevices);case"DESKTOP":return Bt(Ut.desktop);case"PHONE":return Bt(Ut.mobile);case"TABLET":return Bt(Ut.tablet)}}#Xt(e){let t;if("AUTO"===e){const i=this.#St.resolveDeviceOptionToScope(e),n=this.#Gt(i);t=Bt(Ut.auto,{PH1:n})}else t=this.#Gt(e);if(!this.#St.pageResult)return Bt(Ut.loadingOption,{PH1:t});return this.#St.getSelectedFieldResponse()?t:Bt(Ut.needsDataOption,{PH1:t})}#Jt(e){this.#St.fieldDeviceOption=e.itemValue,n.ScheduledRender.scheduleRender(this,this.#n)}#Zt(){if(!this.#St.getConfigSetting().get().enabled)return o.nothing;const e=!this.#St.getFieldResponse(this.#St.fieldPageScope,"ALL"),t=this.#Xt(this.#St.fieldDeviceOption);return Ot`
      <devtools-select-menu
        id="device-scope-select"
        class="field-data-option"
        @selectmenuselected=${this.#Jt}
        .showDivider=${!0}
        .showArrow=${!0}
        .sideButton=${!1}
        .showSelectedItem=${!0}
        .buttonTitle=${Bt(Ut.device,{PH1:t})}
        .disabled=${e}
        title=${Bt(Ut.showFieldDataForDevice,{PH1:t})}
      >
        ${At.map(e=>Ot`
            <devtools-menu-item
              .value=${e}
              .selected=${this.#St.fieldDeviceOption===e}
            >
              ${this.#Xt(e)}
            </devtools-menu-item>
          `)}
      </devtools-select-menu>
    `}#Qt(){const e=this.#St.getSelectedFieldResponse();if(!e)return null;const{firstDate:t,lastDate:i}=e.record.collectionPeriod,n=new Date(t.year,t.month-1,t.day),s=new Date(i.year,i.month-1,i.day),o={year:"numeric",month:"short",day:"numeric"};return Bt(Ut.dateRange,{PH1:n.toLocaleDateString(void 0,o),PH2:s.toLocaleDateString(void 0,o)})}#ei(){const e=this.#Qt(),t=document.createElement("span");t.classList.add("collection-period-range"),t.textContent=e||Bt(Ut.notEnoughData);const i=g.getFormatLocalizedString(_t,Ut.collectionPeriod,{PH1:t}),n=this.#St.pageResult?.warnings||[];return Ot`
      <div class="field-data-message">
        <div>${i}</div>
        ${n.map(e=>Ot`
          <div class="field-data-warning">${e}</div>
        `)}
      </div>
    `}#ti(){if(this.#St.getConfigSetting().get().enabled)return this.#ei();const e=s.XLink.XLink.create("https://developer.chrome.com/docs/crux",t.i18n.lockedString("Chrome UX Report")),i=g.getFormatLocalizedString(_t,Ut.seeHowYourLocalMetricsCompare,{PH1:e});return Ot`
      <div class="field-data-message">${i}</div>
    `}#ii(){return Ot`
      <section class="logs-section" aria-label=${Bt(Ut.eventLogs)}>
        <devtools-live-metrics-logs
          on-render=${n.Directives.nodeRenderedCallback(e=>{this.#$t=e})}
        >
          ${this.#ni()}
          ${this.#si()}
        </devtools-live-metrics-logs>
      </section>
    `}async#_t(e){const t=this.#e.getElementById(e.interactionId);if(!t||!this.#$t)return;this.#$t.selectTab("interactions")&&await m.write(()=>{t.scrollIntoView({block:"center"}),t.focus(),s.UIUtils.runCSSAnimationOnce(t,"highlight")})}async#oi(e){await C.LiveMetrics.instance().logInteractionScripts(e)&&await a.Console.Console.instance().showPromise()}#ni(){return this.#wt.size?Ot`
      <ol class="log"
        slot="interactions-log-content"
        on-render=${n.Directives.nodeRenderedCallback(e=>{this.#Lt=e})}
      >
        ${this.#wt.values().map(e=>{const i=St("timeline.landing.interaction-event-timing",e.duration,wt,e=>t.TimeUtilities.preciseMillisToString(e),{dim:!0}),n=this.#yt&&this.#yt.value<e.duration,s=this.#yt?.interactionId===e.interactionId;return Ot`
            <li id=${e.interactionId} class="log-item interaction" tabindex="-1">
              <details>
                <summary>
                  <span class="interaction-type">
                    ${e.interactionType} ${s?Ot`<span class="interaction-inp-chip" title=${Bt(Ut.inpInteraction)}>INP</span>`:zt}
                  </span>
                  <span class="interaction-node">${e.nodeRef?.link}</span>
                  ${n?Ot`<devtools-icon
                    class="interaction-info"
                    name="info"
                    title=${Bt(Ut.interactionExcluded)}
                  ></devtools-icon>`:zt}
                  <span class="interaction-duration">${i}</span>
                </summary>
                <div class="phase-table" role="table">
                  <div class="phase-table-row phase-table-header-row" role="row">
                    <div role="columnheader">${Bt(Ut.phase)}</div>
                    <div role="columnheader">
                      ${e.longAnimationFrameTimings.length?Ot`
                        <button
                          class="log-extra-details-button"
                          title=${Bt(Ut.logToConsole)}
                          @click=${()=>this.#oi(e)}
                        >${Bt(Ut.duration)}</button>
                      `:Bt(Ut.duration)}
                    </div>
                  </div>
                  <div class="phase-table-row" role="row">
                    <div role="cell">${Bt(Ut.inputDelay)}</div>
                    <div role="cell">${Math.round(e.phases.inputDelay)}</div>
                  </div>
                  <div class="phase-table-row" role="row">
                    <div role="cell">${Bt(Ut.processingDuration)}</div>
                    <div role="cell">${Math.round(e.phases.processingDuration)}</div>
                  </div>
                  <div class="phase-table-row" role="row">
                    <div role="cell">${Bt(Ut.presentationDelay)}</div>
                    <div role="cell">${Math.round(e.phases.presentationDelay)}</div>
                  </div>
                </div>
              </details>
            </li>
          `})}
      </ol>
    `:o.nothing}async#At(e){if(!this.#$t)return;const t=[];for(const i of e){const e=this.#e.getElementById(i);e&&t.push(e)}if(!t.length)return;this.#$t.selectTab("layout-shifts")&&await m.write(()=>{t[0].scrollIntoView({block:"start"}),t[0].focus();for(const e of t)s.UIUtils.runCSSAnimationOnce(e,"highlight")})}#si(){return this.#xt.length?Ot`
      <ol class="log"
        slot="layout-shifts-log-content"
        on-render=${n.Directives.nodeRenderedCallback(e=>{this.#Pt=e})}
      >
        ${this.#xt.map(e=>{const t=St("timeline.landing.layout-shift-event-score",e.score,yt,e=>e.toFixed(4),{dim:!0});return Ot`
            <li id=${e.uniqueLayoutShiftId} class="log-item layout-shift" tabindex="-1">
              <div class="layout-shift-score">Layout shift score: ${t}</div>
              <div class="layout-shift-nodes">
                ${e.affectedNodeRefs.map(({link:e})=>Ot`
                  <div class="layout-shift-node">${e}</div>
                `)}
              </div>
            </li>
          `})}
      </ol>
    `:o.nothing}#ri(){return Ot`
      <style>${Nt}</style>
      <style>${ct}</style>
      <div class="node-view">
        <main>
          <h2 class="section-title">${Bt(Ut.nodePerformanceTimeline)}</h2>
          <div class="node-description">${Bt(Ut.nodeClickToRecord)}</div>
          <div class="record-action-card">${this.#Bt(this.#kt)}</div>
        </main>
      </div>
    `}#n=()=>{if(this.isNode)return void o.render(this.#ri(),this.#e,{host:this});const e=this.#St.getConfigSetting().get().enabled,t=Bt(e?Ut.localAndFieldMetrics:Ut.localMetrics),i=Ot`
      <style>${Nt}</style>
      <style>${ct}</style>
      <div class="container">
        <div class="live-metrics-view">
          <main class="live-metrics">
            <h2 class="section-title">${t}</h2>
            <div class="metric-cards"
              on-render=${n.Directives.nodeRenderedCallback(e=>{this.#Tt=e})}
            >
              <div id="lcp">
                ${this.#Ot()}
              </div>
              <div id="cls">
                ${this.#zt()}
              </div>
              <div id="inp">
                ${this.#Ut()}
              </div>
            </div>
            <x-link
              href=${"https://web.dev/articles/lab-and-field-data-differences#lab_data_versus_field_data"}
              class="local-field-link"
              title=${Bt(Ut.localFieldLearnMoreTooltip)}
            >${Bt(Ut.localFieldLearnMoreLink)}</x-link>
            ${this.#ii()}
          </main>
          <aside class="next-steps" aria-labelledby="next-steps-section-title">
            <h2 id="next-steps-section-title" class="section-title">${Bt(Ut.nextSteps)}</h2>
            <div id="field-setup" class="settings-card">
              <h3 class="card-title">${Bt(Ut.fieldMetricsTitle)}</h3>
              ${this.#ti()}
              ${this.#Yt()}
              ${this.#Zt()}
              <div class="field-setup-buttons">
                <devtools-field-settings-dialog></devtools-field-settings-dialog>
              </div>
            </div>
            <div id="recording-settings" class="settings-card">
              ${this.#jt()}
            </div>
            <div id="record" class="record-action-card">
              ${this.#Bt(this.#kt)}
            </div>
            <div id="record-page-load" class="record-action-card">
              ${this.#Bt(this.#Ct)}
            </div>
          </aside>
        </div>
      </div>
    `;o.render(i,this.#e,{host:this})}}class Wt extends s.Widget.WidgetElement{#ai;constructor(){super(),this.style.display="contents"}selectTab(e){return!!this.#ai&&this.#ai.selectTab(e)}#li(){const e=C.LiveMetrics.instance();switch(this.#ai?.selectedTabId){case"interactions":e.clearInteractions();break;case"layout-shifts":e.clearLayoutShifts()}}createWidget(){const e=new s.Widget.Widget(this,{useShadowDom:!0});e.contentElement.style.display="contents",this.#ai=new s.TabbedPane.TabbedPane;const t=document.createElement("slot");t.name="interactions-log-content";const i=s.Widget.Widget.getOrCreateWidget(t);this.#ai.appendTab("interactions",Bt(Ut.interactions),i,void 0,void 0,void 0,void 0,void 0,"timeline.landing.interactions-log");const n=document.createElement("slot");n.name="layout-shifts-log-content";const o=s.Widget.Widget.getOrCreateWidget(n);this.#ai.appendTab("layout-shifts",Bt(Ut.layoutShifts),o,void 0,void 0,void 0,void 0,void 0,"timeline.landing.layout-shifts-log");const r=new s.Toolbar.ToolbarButton(Bt(Ut.clearCurrentLog),"clear",void 0,"timeline.landing.clear-log");return r.addEventListener("Click",this.#li,this),this.#ai.rightToolbar().appendToolbarItem(r),this.#ai.show(e.contentElement),e}}customElements.define("devtools-live-metrics-view",Vt),customElements.define("devtools-live-metrics-logs",Wt);var jt=Object.freeze({__proto__:null,LiveMetricsView:Vt}),qt=`@scope to (devtools-widget > *){.network-request-details-title{font-size:13px;padding:8px;display:flex;align-items:center}.network-request-details-title > div{box-sizing:border-box;width:14px;height:14px;border:1px solid var(--sys-color-divider);display:inline-block;margin-right:4px}.network-request-details-content{border-bottom:1px solid var(--sys-color-divider)}.network-request-details-cols{display:flex;justify-content:space-between;width:fit-content}:host{display:contents}.network-request-details-col{max-width:300px}.column-divider{border-left:1px solid var(--sys-color-divider)}.network-request-details-col.server-timings{display:grid;grid-template-columns:1fr 1fr 1fr;width:fit-content;width:450px;gap:0}.network-request-details-item, .network-request-details-col{padding:5px 10px}.server-timing-column-header{font-weight:var(--ref-typeface-weight-medium)}.network-request-details-row{min-height:min-content;display:flex;justify-content:space-between}.title{color:var(--sys-color-token-subtle);overflow:hidden;padding-right:10px;display:inline-block;vertical-align:top}.value{display:inline-block;user-select:text;text-overflow:ellipsis;overflow:hidden;&.synthetic{font-style:italic}}.focusable-outline{overflow:visible}.devtools-link,\n  .timeline-link{color:var(--text-link);text-decoration:underline;outline-offset:2px;padding:0;text-align:left;.elements-disclosure &{color:var(--text-link)}devtools-icon{vertical-align:baseline;color:var(--sys-color-primary)}:focus .selected & devtools-icon{color:var(--sys-color-tonal-container)}&:focus-visible{outline-width:unset}&.invalid-link{color:var(--text-disabled);text-decoration:none}&:not(.devtools-link-prevent-click, .invalid-link){cursor:pointer}@media (forced-colors: active){&:not(.devtools-link-prevent-click){forced-color-adjust:none;color:linktext}&:focus-visible{background:Highlight;color:HighlightText}}}.text-button.link-style,\n  .text-button.link-style:hover,\n  .text-button.link-style:active{background:none;border:none;font:inherit}}\n/*# sourceURL=${import.meta.resolve("./networkRequestDetails.css")} */`,Kt=`@scope to (devtools-widget > *){.bold{font-weight:bold}.url{margin-left:15px;margin-right:5px}.url--host{color:var(--sys-color-token-subtle)}.priority-row{margin-left:15px}.network-category-chip{box-sizing:border-box;width:10px;height:10px;border:1px solid var(--sys-color-divider);display:inline-block;margin-right:4px}devtools-icon.priority{height:13px;width:13px;color:var(--sys-color-on-surface-subtle)}.render-blocking{margin-left:15px;color:var(--sys-color-error)}.divider{border-top:1px solid var(--sys-color-divider);margin:5px 0}.timings-row{align-self:start;display:flex;align-items:center}.indicator{display:inline-block;width:12px;height:6px;margin-right:5px;border:1px solid var(--sys-color-on-surface-subtle);box-sizing:border-box}.whisker-left{align-self:center;display:inline-flex;width:11px;height:6px;margin-right:5px;border-left:1px solid var(--sys-color-on-surface-subtle);box-sizing:border-box}.whisker-right{align-self:center;display:inline-flex;width:11px;height:6px;margin-right:5px;border-right:1px solid var(--sys-color-on-surface-subtle);box-sizing:border-box}.horizontal{background-color:var(--sys-color-on-surface-subtle);height:1px;width:10px;align-self:center}.time{margin-left:auto;display:inline-block;padding-left:10px}.timings-row--duration{.indicator{border-color:transparent}.time{font-weight:var(--ref-typeface-weight-medium)}}.redirects-row{margin-left:15px}}\n/*# sourceURL=${import.meta.resolve("./networkRequestTooltip.css")} */`;const{html:Yt}=o,Gt={priority:"Priority",duration:"Duration",queuingAndConnecting:"Queuing and connecting",requestSentAndWaiting:"Request sent and waiting",contentDownloading:"Content downloading",waitingOnMainThread:"Waiting on main thread",renderBlocking:"Render blocking",redirects:"Redirects"},Xt=t.i18n.registerUIStrings("panels/timeline/components/NetworkRequestTooltip.ts",Gt),Jt=t.i18n.getLocalizedString.bind(void 0,Xt);class Zt extends HTMLElement{#e=this.attachShadow({mode:"open"});#f={networkRequest:null,entityMapper:null};connectedCallback(){this.#n()}set data(e){this.#f.networkRequest!==e.networkRequest&&this.#f.entityMapper!==e.entityMapper&&(this.#f={networkRequest:e.networkRequest,entityMapper:e.entityMapper},this.#n())}static renderPriorityValue(e){return e.args.data.priority===e.args.data.initialPriority?Yt`${L.NetworkPriorities.uiLabelForNetworkPriority(e.args.data.priority)}`:Yt`${L.NetworkPriorities.uiLabelForNetworkPriority(e.args.data.initialPriority)}
        <devtools-icon name="arrow-forward" class="priority"></devtools-icon>
        ${L.NetworkPriorities.uiLabelForNetworkPriority(e.args.data.priority)}`}static renderTimings(e){const i=e.args.data.syntheticData,n=i.sendStartTime-e.ts,s=i.downloadStart-i.sendStartTime,r=i.finishTime-i.downloadStart,a=e.ts+e.dur-i.finishTime,l=bt(e),d={backgroundColor:`color-mix(in srgb, ${l}, hsla(0, 100%, 100%, 0.8))`},c={backgroundColor:l},g=Yt`<span class="whisker-left"> <span class="horizontal"></span> </span>`,h=Yt`<span class="whisker-right"> <span class="horizontal"></span> </span>`;return Yt`
      <div class="timings-row timings-row--duration">
        <span class="indicator"></span>
        ${Jt(Gt.duration)}
         <span class="time"> ${t.TimeUtilities.formatMicroSecondsTime(e.dur)} </span>
      </div>
      <div class="timings-row">
        ${g}
        ${Jt(Gt.queuingAndConnecting)}
        <span class="time"> ${t.TimeUtilities.formatMicroSecondsTime(n)} </span>
      </div>
      <div class="timings-row">
        <span class="indicator" style=${o.Directives.styleMap(d)}></span>
        ${Jt(Gt.requestSentAndWaiting)}
        <span class="time"> ${t.TimeUtilities.formatMicroSecondsTime(s)} </span>
      </div>
      <div class="timings-row">
        <span class="indicator" style=${o.Directives.styleMap(c)}></span>
        ${Jt(Gt.contentDownloading)}
        <span class="time"> ${t.TimeUtilities.formatMicroSecondsTime(r)} </span>
      </div>
      <div class="timings-row">
        ${h}
        ${Jt(Gt.waitingOnMainThread)}
        <span class="time"> ${t.TimeUtilities.formatMicroSecondsTime(a)} </span>
      </div>
    `}static renderRedirects(e){const t=[];if(e.args.data.redirects.length>0){t.push(Yt`
        <div class="redirects-row">
          ${Jt(Gt.redirects)}
        </div>
      `);for(const i of e.args.data.redirects)t.push(Yt`<div class="redirects-row"> ${i.url}</div>`);return Yt`${t}`}return null}#n(){if(!this.#f.networkRequest)return;const e={backgroundColor:`${bt(this.#f.networkRequest)}`},t=new URL(this.#f.networkRequest.args.data.url),n=this.#f.entityMapper?this.#f.entityMapper.entityForEvent(this.#f.networkRequest):null,s=P.Helpers.formatOriginWithEntity(t,n,!0),r=Zt.renderRedirects(this.#f.networkRequest),a=Yt`
      <style>${Kt}</style>
      <div class="performance-card">
        <div class="url">${c.StringUtilities.trimMiddle(t.href.replace(t.origin,""),60)}</div>
        <div class="url url--host">${s}</div>

        <div class="divider"></div>
        <div class="network-category">
          <span class="network-category-chip" style=${o.Directives.styleMap(e)}>
          </span>${mt(this.#f.networkRequest)}
        </div>
        <div class="priority-row">${Jt(Gt.priority)}: ${Zt.renderPriorityValue(this.#f.networkRequest)}</div>
        ${i.Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(this.#f.networkRequest)?Yt`<div class="render-blocking"> ${Jt(Gt.renderBlocking)} </div>`:o.nothing}
        <div class="divider"></div>

        ${Zt.renderTimings(this.#f.networkRequest)}

        ${r?Yt`
          <div class="divider"></div>
          ${r}
        `:o.nothing}
      </div>
    `;o.render(a,this.#e,{host:this})}}customElements.define("devtools-performance-network-request-tooltip",Zt);var Qt=Object.freeze({__proto__:null,NetworkRequestTooltip:Zt});const{html:ei,render:ti}=o,ii={requestMethod:"Request method",protocol:"Protocol",priority:"Priority",encodedData:"Encoded data",decodedBody:"Decoded body",yes:"Yes",no:"No",networkRequest:"Network request",fromCache:"From cache",mimeType:"MIME type",FromMemoryCache:" (from memory cache)",FromCache:" (from cache)",FromPush:" (from push)",FromServiceWorker:" (from `service worker`)",initiatedBy:"Initiated by",blocking:"Blocking",inBodyParserBlocking:"In-body parser blocking",renderBlocking:"Render blocking",entity:"3rd party",serverTiming:"Server timing",time:"Time",description:"Description"},ni=t.i18n.registerUIStrings("panels/timeline/components/NetworkRequestDetails.ts",ii),si=t.i18n.getLocalizedString.bind(void 0,ni);class oi extends s.Widget.Widget{#h;#di=null;#ci=new WeakMap;#gi=null;#hi=null;#pi=null;#ui=null;#Fe=null;constructor(e,t=ri){super(e),this.#h=t,this.requestUpdate()}set linkifier(e){this.#pi=e,this.requestUpdate()}set parsedTrace(e){this.#Fe=e,this.requestUpdate()}set target(e){this.#hi=e,this.requestUpdate()}set request(e){this.#di=e;for(const t of e.args.data.responseHeaders??[]){const e=t.name.toLocaleLowerCase();if("server-timing"===e||"server-timing-test"===e){t.name="server-timing",this.#ui=l.ServerTiming.ServerTiming.parseHeaders([t]);break}}this.requestUpdate()}set entityMapper(e){this.#gi=e,this.requestUpdate()}performUpdate(){this.#h({request:this.#di,previewElementsCache:this.#ci,target:this.#hi,entityMapper:this.#gi,serverTimings:this.#ui,linkifier:this.#pi,parsedTrace:this.#Fe},{},this.contentElement)}}const ri=(e,n,r)=>{if(!e.request)return void ti(o.nothing,r);const{request:a}=e,{data:d}=a.args,c=Zt.renderRedirects(a);ti(ei`
        <style>${qt}</style>
        <style>${Kt}</style>

        <div class="network-request-details-content">
          ${function(e){const t={backgroundColor:`${bt(e)}`};return ei`
    <div class="network-request-details-title">
      <div style=${o.Directives.styleMap(t)}></div>
      ${si(ii.networkRequest)}
    </div>
  `}(e.request)}
          ${function(e){const t={tabStop:!0,showColumnNumber:!1,inlineFrameIndex:0,maxLength:100},i=y.Linkifier.Linkifier.linkifyURL(e.args.data.url,t),n=l.TraceObject.RevealableNetworkRequest.create(e);if(n){i.addEventListener("contextmenu",e=>{const t=new s.ContextMenu.ContextMenu(e);t.appendApplicableItems(n),t.show()});const e=ei`
        ${i}
        <devtools-request-link-icon .data=${{request:n.networkRequest}}>
        </devtools-request-link-icon>
      `;return ei`<div class="network-request-details-item">${e}</div>`}return ei`<div class="network-request-details-item">${i}</div>`}(e.request)}
          <div class="network-request-details-cols">
            ${o.Directives.until(async function(e,t,i){if(!e.args.data.url||!t)return o.nothing;const n=e.args.data.url;if(!i.get(e)){const t={imageAltText:y.ImagePreview.ImagePreview.defaultAltTextForImageURL(n),precomputedFeatures:void 0,align:"start",hideFileData:!0},s=await y.ImagePreview.ImagePreview.build(n,!1,t);s&&i.set(e,s)}const s=i.get(e);if(s)return ei`
      <div class="network-request-details-col">${s}</div>
      <div class="column-divider"></div>`;return o.nothing}(e.request,e.target,e.previewElementsCache))}
            <div class="network-request-details-col">
              ${ai(si(ii.requestMethod),d.requestMethod)}
              ${ai(si(ii.protocol),d.protocol)}
              ${ai(si(ii.priority),Zt.renderPriorityValue(a))}
              ${ai(si(ii.mimeType),d.mimeType)}
              ${function(e){let i="";e.args.data.syntheticData.isMemoryCached?i+=si(ii.FromMemoryCache):e.args.data.syntheticData.isDiskCached?i+=si(ii.FromCache):e.args.data.timing?.pushStart&&(i+=si(ii.FromPush));e.args.data.fromServiceWorker&&(i+=si(ii.FromServiceWorker));!e.args.data.encodedDataLength&&i||(i=`${t.ByteUtilities.bytesToString(e.args.data.encodedDataLength)}${i}`);return ai(si(ii.encodedData),i)}(a)}
              ${ai(si(ii.decodedBody),t.ByteUtilities.bytesToString(a.args.data.decodedBodyLength))}
              ${function(e){if(!f.Network.isSyntheticNetworkRequestEventRenderBlocking(e))return o.nothing;let t;switch(e.args.data.renderBlocking){case"blocking":t=ii.renderBlocking;break;case"in_body_parser_blocking":t=ii.inBodyParserBlocking;break;default:return o.nothing}return ai(si(ii.blocking),t)}(a)}
              ${function(e){const t=e.args.data.syntheticData.isMemoryCached||e.args.data.syntheticData.isDiskCached;return ai(si(ii.fromCache),si(t?ii.yes:ii.no))}(a)}
              ${function(e,t){if(!t)return o.nothing;const i=t.entityForEvent(e);if(!i)return o.nothing;return ai(si(ii.entity),i.name)}(a,e.entityMapper)}
            </div>
            <div class="column-divider"></div>
            <div class="network-request-details-col">
              <div class="timing-rows">
                ${Zt.renderTimings(a)}
              </div>
            </div>
            ${function(e){if(!e||0===e.length)return o.nothing;return ei`
    <div class="column-divider"></div>
    <div class="network-request-details-col server-timings">
      <div class="server-timing-column-header">${si(ii.serverTiming)}</div>
      <div class="server-timing-column-header">${si(ii.description)}</div>
      <div class="server-timing-column-header">${si(ii.time)}</div>
      ${e.map(e=>{const t=e.metric.startsWith("(c")?"synthetic value":"value";return ei`
          <div class=${t}>${e.metric||"-"}</div>
          <div class=${t}>${e.description||"-"}</div>
          <div class=${t}>${e.value||"-"}</div>
        `})}
    </div>`}(e.serverTimings)}
            ${c?ei`
              <div class="column-divider"></div>
              <div class="network-request-details-col redirect-details">
                ${c}
              </div>
            `:o.nothing}
            </div>
            ${function(e,t,n,s){if(!s)return o.nothing;const r=null!==i.Helpers.Trace.stackTraceInEvent(e);let a=null;const l={tabStop:!0,showColumnNumber:!0,inlineFrameIndex:0};if(r){const t=i.Helpers.Trace.getStackTraceTopCallFrameInEventPayload(e)??null;t&&(a=s.maybeLinkifyConsoleCallFrame(n,t,l))}const d=t?.data.NetworkRequests.eventToInitiator.get(e);d&&(a=s.maybeLinkifyScriptLocation(n,null,d.args.data.url,void 0,l));if(!a)return o.nothing;return ei`
      <div class="network-request-details-item">
        <div class="title">${si(ii.initiatedBy)}</div>
        <div class="value focusable-outline">${a}</div>
      </div>`}(a,e.parsedTrace,e.target,e.linkifier)}
          </div>
        </div>
     `,r)};function ai(e,t){return t?ei`
      <div class="network-request-details-row">
        <div class="title">${e}</div>
        <div class="value">${t}</div>
      </div>`:o.nothing}var li=Object.freeze({__proto__:null,DEFAULT_VIEW:ri,NetworkRequestDetails:oi}),di=`@scope to (devtools-widget > *){:scope{display:block;border-bottom:1px solid var(--sys-color-divider);flex:none}ul{list-style:none;margin:0;display:flex;flex-wrap:wrap;gap:var(--sys-size-4);padding:0 var(--sys-size-4);justify-content:flex-start;align-items:center}.insight-chip button{background:none;user-select:none;font:var(--sys-typescale-body4-regular);border:var(--sys-size-1) solid var(--sys-color-primary);border-radius:var(--sys-shape-corner-extra-small);display:flex;margin:var(--sys-size-4) 0;padding:var(--sys-size-2) var(--sys-size-4) var(--sys-size-2) var(--sys-size-4);width:max-content;white-space:pre;.keyword{color:var(--sys-color-primary);padding-right:var(--sys-size-3)}}.insight-chip button:hover{background-color:var(--sys-color-state-hover-on-subtle);cursor:pointer;transition:opacity 0.2s ease}.insight-message-box{background:var(--sys-color-surface-yellow);border-radius:var(--sys-shape-corner-extra-small);font:var(--sys-typescale-body4-regular);margin:var(--sys-size-4) 0;button{color:var(--sys-color-on-surface-yellow);border:none;text-align:left;background:none;padding:var(--sys-size-4) var(--sys-size-5);width:100%;max-width:500px;.insight-label{color:var(--sys-color-orange-bright);padding-right:var(--sys-size-3);font-weight:var(--ref-typeface-weight-medium);margin-bottom:var(--sys-size-2)}&:hover{background-color:var(--sys-color-state-hover-on-subtle);cursor:pointer;transition:opacity 0.2s ease}}}}\n/*# sourceURL=${import.meta.resolve("./relatedInsightChips.css")} */`;const{html:ci,render:gi}=o,hi={insightKeyword:"Insight",insightWithName:"Insight: {PH1}"},pi=t.i18n.registerUIStrings("panels/timeline/components/RelatedInsightChips.ts",hi),ui=t.i18n.getLocalizedString.bind(void 0,pi);class mi extends s.Widget.Widget{#h;#mi=null;#vi=new Map;constructor(e,t=vi){super(e),this.#h=t}set activeEvent(e){e!==this.#mi&&(this.#mi=e,this.requestUpdate())}set eventToInsightsMap(e){this.#vi=e??new Map,this.requestUpdate()}performUpdate(){const e={activeEvent:this.#mi,eventToInsightsMap:this.#vi,onInsightClick(e){e.activateInsight()}};this.#h(e,{},this.contentElement)}}const vi=(e,t,i)=>{const{activeEvent:n,eventToInsightsMap:s}=e,r=n?s.get(n)??[]:[];if(!n||0===s.size||0===r.length)return void gi(o.nothing,i);const a=r.flatMap(t=>t.messages.map(i=>ci`
          <li class="insight-message-box">
            <button type="button" @click=${i=>{i.preventDefault(),e.onInsightClick(t)}}>
              <div class="insight-label">${ui(hi.insightWithName,{PH1:t.insightLabel})}</div>
              <div class="insight-message">${i}</div>
            </button>
          </li>
        `)),l=r.flatMap(t=>[ci`
          <li class="insight-chip">
            <button type="button" @click=${i=>{i.preventDefault(),e.onInsightClick(t)}}>
              <span class="keyword">${ui(hi.insightKeyword)}</span>
              <span class="insight-label">${t.insightLabel}</span>
            </button>
          </li>
        `]);gi(ci`<style>${di}</style>
        <ul>${a}</ul>
        <ul>${l}</ul>`,i)};var bi=Object.freeze({__proto__:null,DEFAULT_VIEW:vi,RelatedInsightChips:mi});class fi extends Event{model;insightSetKey;static eventName="insightactivated";constructor(e,t){super(fi.eventName,{bubbles:!0,composed:!0}),this.model=e,this.insightSetKey=t}}class yi extends Event{static eventName="insightdeactivated";constructor(){super(yi.eventName,{bubbles:!0,composed:!0})}}Event;Event;Event;var wi=`@scope to (devtools-widget > *){:scope{display:block;height:100%}.annotations{display:flex;flex-direction:column;height:100%;padding:0}.visibility-setting{margin-top:auto}.annotation-container{display:flex;justify-content:space-between;align-items:center;padding:0 var(--sys-size-4);.delete-button{visibility:hidden;border:none;background:none}&:hover,\n    &:focus-within{background-color:var(--sys-color-neutral-container);button.delete-button{visibility:visible}}}.annotation{display:flex;flex-direction:column;align-items:flex-start;word-break:normal;overflow-wrap:anywhere;padding:var(--sys-size-8) 0;gap:6px}.annotation-identifier{padding:4px 8px;border-radius:10px;font-weight:bold;&.time-range{background-color:var(--app-color-performance-sidebar-time-range);color:var(--app-color-performance-sidebar-label-text-light)}}.entries-link{display:flex;flex-wrap:wrap;row-gap:2px;align-items:center}.label{font-size:larger}.annotation-tutorial-container{padding:10px}.tutorial-card{display:block;position:relative;margin:10px 0;padding:10px;border-radius:var(--sys-shape-corner-extra-small);overflow:hidden;border:1px solid var(--sys-color-divider);background-color:var(--sys-color-base)}.tutorial-image{display:flex;justify-content:center;& > img{max-width:100%;height:auto}}.tutorial-title,\n  .tutorial-description{margin:5px 0}}\n/*# sourceURL=${import.meta.resolve("./sidebarAnnotationsTab.css")} */`;const{html:xi,render:Si}=o,ki=new URL("../../../Images/performance-panel-diagram.svg",import.meta.url).toString(),Ci=new URL("../../../Images/performance-panel-entry-label.svg",import.meta.url).toString(),$i=new URL("../../../Images/performance-panel-time-range.svg",import.meta.url).toString(),Ti=new URL("../../../Images/performance-panel-delete-annotation.svg",import.meta.url).toString(),Li={annotationGetStarted:"Annotate a trace for yourself and others",entryLabelTutorialTitle:"Label an item",entryLabelTutorialDescription:"Double-click or press Enter on an item and type to create an item label.",entryLinkTutorialTitle:"Connect two items",entryLinkTutorialDescription:"Double-click on an item, click on the adjacent rightward arrow, then select the destination item.",timeRangeTutorialTitle:"Define a time range",timeRangeTutorialDescription:"Shift-drag in the flamechart then type to create a time range annotation.",deleteAnnotationTutorialTitle:"Delete an annotation",deleteAnnotationTutorialDescription:"Hover over the list in the sidebar with Annotations tab selected to access the delete function.",deleteButton:"Delete annotation: {PH1}",entryLabelDescriptionLabel:'A "{PH1}" event annotated with the text "{PH2}"',timeRangeDescriptionLabel:"A time range starting at {PH1} and ending at {PH2}",entryLinkDescriptionLabel:'A link between a "{PH1}" event and a "{PH2}" event'},Pi=t.i18n.registerUIStrings("panels/timeline/components/SidebarAnnotationsTab.ts",Li),Ii=t.i18n.getLocalizedString.bind(void 0,Pi);class Mi extends s.Widget.Widget{#bi=[];#fi=new Map;#yi;#h;constructor(e=Di){super(),this.#h=e,this.#yi=a.Settings.Settings.instance().moduleSetting("annotations-hidden")}deduplicatedAnnotations(){return this.#bi}setData(e){this.#bi=this.#wi(e.annotations),this.#fi=e.annotationEntryToColorMap,this.requestUpdate()}#wi(e){const t=new Set,i=e.filter(e=>{if(this.#xi(e))return!0;if("ENTRIES_LINK"===e.type||"ENTRY_LABEL"===e.type){const i="ENTRIES_LINK"===e.type?e.entryFrom:e.entry;if(t.has(i))return!1;t.add(i)}return!0});return i.sort((e,t)=>this.#Si(e)-this.#Si(t)),i}#Si(e){switch(e.type){case"ENTRY_LABEL":return e.entry.ts;case"ENTRIES_LINK":return e.entryFrom.ts;case"TIME_RANGE":return e.bounds.min;default:c.assertNever(e,`Invalid annotation type ${e}`)}}#xi(e){switch(e.type){case"ENTRY_LABEL":return e.label.length>0;case"ENTRIES_LINK":return Boolean(e.entryTo);case"TIME_RANGE":return e.bounds.range>0}}performUpdate(){const e={annotations:this.#bi,annotationsHiddenSetting:this.#yi,annotationEntryToColorMap:this.#fi,onAnnotationClick:e=>{this.contentElement.dispatchEvent(new Yi(e))},onAnnotationHover:e=>{this.contentElement.dispatchEvent(new Gi(e))},onAnnotationHoverOut:()=>{this.contentElement.dispatchEvent(new Xi)},onAnnotationDelete:e=>{this.contentElement.dispatchEvent(new Ki(e))}};this.#h(e,{},this.contentElement)}}function Ri(e){const t=a.Color.parse(e)?.asLegacyColor(),i="--app-color-performance-sidebar-label-text-dark",n=a.Color.parse(x.ThemeSupport.instance().getComputedValue(i))?.asLegacyColor();if(!t||!n)return`var(${i})`;return a.ColorUtils.contrastRatio(t.rgba(),n.rgba())>=4.5?`var(${i})`:"var(--app-color-performance-sidebar-label-text-light)"}function Ei(t,n){switch(t.type){case"ENTRY_LABEL":{const e=i.Name.forEntry(t.entry),s=n.get(t.entry)??"",r={backgroundColor:s,color:Ri(s)};return xi`
            <span class="annotation-identifier" style=${o.Directives.styleMap(r)}>
              ${e}
            </span>
      `}case"TIME_RANGE":{const n=e.TraceBounds.BoundsManager.instance().state()?.milli.entireTraceBounds.min??0,s=Math.round(i.Helpers.Timing.microToMilli(t.bounds.min)-n),o=Math.round(i.Helpers.Timing.microToMilli(t.bounds.max)-n);return xi`
            <span class="annotation-identifier time-range">
              ${s} - ${o} ms
            </span>
      `}case"ENTRIES_LINK":{const e=i.Name.forEntry(t.entryFrom),s=n.get(t.entryFrom)??"",r={backgroundColor:s,color:Ri(s)};return xi`
        <div class="entries-link">
          <span class="annotation-identifier" style=${o.Directives.styleMap(r)}>
            ${e}
          </span>
          <devtools-icon name="arrow-forward" class="inline-icon large">
          </devtools-icon>
          ${function(e,t){if(e.entryTo){const n=i.Name.forEntry(e.entryTo),s=t.get(e.entryTo)??"",r={backgroundColor:s,color:Ri(s)};return xi`
      <span class="annotation-identifier" style=${o.Directives.styleMap(r)}>
        ${n}
      </span>`}return o.nothing}(t,n)}
        </div>
    `}default:c.assertNever(t,"Unsupported annotation type")}}const Di=(e,n,s)=>{Si(xi`
      <style>${wi}</style>
      <span class="annotations">
        ${0===e.annotations.length?xi`<div class="annotation-tutorial-container">
    ${Ii(Li.annotationGetStarted)}
      <div class="tutorial-card">
        <div class="tutorial-image"><img src=${Ci}></img></div>
        <div class="tutorial-title">${Ii(Li.entryLabelTutorialTitle)}</div>
        <div class="tutorial-description">${Ii(Li.entryLabelTutorialDescription)}</div>
      </div>
      <div class="tutorial-card">
        <div class="tutorial-image"><img src=${ki}></img></div>
        <div class="tutorial-title">${Ii(Li.entryLinkTutorialTitle)}</div>
        <div class="tutorial-description">${Ii(Li.entryLinkTutorialDescription)}</div>
      </div>
      <div class="tutorial-card">
        <div class="tutorial-image"><img src=${$i}></img></div>
        <div class="tutorial-title">${Ii(Li.timeRangeTutorialTitle)}</div>
        <div class="tutorial-description">${Ii(Li.timeRangeTutorialDescription)}</div>
      </div>
      <div class="tutorial-card">
        <div class="tutorial-image"><img src=${Ti}></img></div>
        <div class="tutorial-title">${Ii(Li.deleteAnnotationTutorialTitle)}</div>
        <div class="tutorial-description">${Ii(Li.deleteAnnotationTutorialDescription)}</div>
      </div>
    </div>`:xi`
            ${e.annotations.map(n=>{const s=function(e){switch(e.type){case"ENTRY_LABEL":{const t=i.Name.forEntry(e.entry);return Ii(Li.entryLabelDescriptionLabel,{PH1:t,PH2:e.label})}case"TIME_RANGE":{const i=t.TimeUtilities.formatMicroSecondsAsMillisFixedExpanded(e.bounds.min),n=t.TimeUtilities.formatMicroSecondsAsMillisFixedExpanded(e.bounds.max);return Ii(Li.timeRangeDescriptionLabel,{PH1:i,PH2:n})}case"ENTRIES_LINK":{if(!e.entryTo)return"";const t=i.Name.forEntry(e.entryFrom),n=i.Name.forEntry(e.entryTo);return Ii(Li.entryLinkDescriptionLabel,{PH1:t,PH2:n})}default:c.assertNever(e,"Unsupported annotation")}}(n);return xi`
                <div class="annotation-container"
                  @click=${()=>e.onAnnotationClick(n)}
                  @mouseover=${()=>"ENTRY_LABEL"===n.type?e.onAnnotationHover(n):null}
                  @mouseout=${()=>"ENTRY_LABEL"===n.type?e.onAnnotationHoverOut():null}
                  aria-label=${s}
                  tabindex="0"
                  jslog=${r.item(`timeline.annotation-sidebar.annotation-${function(e){switch(e.type){case"ENTRY_LABEL":return"entry-label";case"TIME_RANGE":return"time-range";case"ENTRIES_LINK":return"entries-link";default:c.assertNever(e,"unknown annotation type")}}(n)}`).track({click:!0})}
                >
                  <div class="annotation">
                    ${Ei(n,e.annotationEntryToColorMap)}
                    <span class="label">
                      ${"ENTRY_LABEL"===n.type||"TIME_RANGE"===n.type?n.label:""}
                    </span>
                  </div>
                  <button class="delete-button" aria-label=${Ii(Li.deleteButton,{PH1:s})} @click=${t=>{t.stopPropagation(),e.onAnnotationDelete(n)}} jslog=${r.action("timeline.annotation-sidebar.delete").track({click:!0})}>
                    <devtools-icon class="bin-icon extra-large" name="bin"></devtools-icon>
                  </button>
                </div>`})}
            <setting-checkbox class="visibility-setting" .data=${{setting:e.annotationsHiddenSetting,textOverride:"Hide annotations"}}>
            </setting-checkbox>`}
    </span>`,s)};var Hi=Object.freeze({__proto__:null,DEFAULT_VIEW:Di,SidebarAnnotationsTab:Mi}),Fi=`:host{display:block;padding:5px 8px}.metrics{display:grid;align-items:end;grid-template-columns:repeat(3,1fr) 0.5fr;row-gap:5px}.row-border{grid-column:1/5;border-top:var(--sys-size-1) solid var(--sys-color-divider)}.row-label{visibility:hidden;font-size:var(--sys-size-7)}.metrics--field .row-label{visibility:visible}.metrics-row{display:contents}.metric{flex:1;user-select:text;cursor:pointer;background:none;border:none;padding:0;display:block;text-align:left}.metric-value{font-size:var(--sys-size-10)}.metric-value-bad{color:var(--app-color-performance-bad)}.metric-value-ok{color:var(--app-color-performance-ok)}.metric-value-good{color:var(--app-color-performance-good)}.metric-score-unclassified{color:var(--sys-color-token-subtle)}.metric-label{font:var(--sys-typescale-body4-medium)}.number-with-unit{white-space:nowrap;.unit{font-size:14px;padding:0 1px}}.passed-insights-section{margin-top:var(--sys-size-5);summary{font-weight:var(--ref-typeface-weight-medium)}}.field-mismatch-notice{display:grid;grid-template-columns:auto auto;align-items:center;background-color:var(--sys-color-surface3);margin:var(--sys-size-6) 0;border-radius:var(--sys-shape-corner-extra-small);border:var(--sys-size-1) solid var(--sys-color-divider);h3{margin-block:3px;font:var(--sys-typescale-body4-medium);color:var(--sys-color-on-base);padding:var(--sys-size-5) var(--sys-size-6) 0 var(--sys-size-6)}.field-mismatch-notice__body{padding:var(--sys-size-3) var(--sys-size-6) var(--sys-size-5) var(--sys-size-6)}button{padding:5px;background:unset;border:unset;font:inherit;color:var(--sys-color-primary);text-decoration:underline;cursor:pointer}}\n/*# sourceURL=${import.meta.resolve("./sidebarSingleInsightSet.css")} */`;const{html:Ni}=o.StaticHtml,Oi={metricScore:"{PH1}: {PH2} {PH3} score",metricScoreUnavailable:"{PH1}: unavailable",passedInsights:"Passed insights ({PH1})",fieldScoreLabel:"Field ({PH1})",urlOption:"URL",originOption:"Origin",dismissTitle:"Dismiss",fieldMismatchTitle:"Field & local metrics mismatch",fieldMismatchNotice:"There are many reasons why local and field metrics [may not match](https://web.dev/articles/lab-and-field-data-differences). Adjust [throttling settings and device emulation](https://developer.chrome.com/docs/devtools/device-mode) to analyze traces more similar to the average user's environment."},zi=t.i18n.registerUIStrings("panels/timeline/components/SidebarSingleInsightSet.ts",Oi),Ai=t.i18n.getLocalizedString.bind(void 0,zi),Ui={Cache:w.Cache.Cache,CLSCulprits:w.CLSCulprits.CLSCulprits,DocumentLatency:w.DocumentLatency.DocumentLatency,DOMSize:w.DOMSize.DOMSize,DuplicatedJavaScript:w.DuplicatedJavaScript.DuplicatedJavaScript,FontDisplay:w.FontDisplay.FontDisplay,ForcedReflow:w.ForcedReflow.ForcedReflow,ImageDelivery:w.ImageDelivery.ImageDelivery,INPBreakdown:w.INPBreakdown.INPBreakdown,LCPDiscovery:w.LCPDiscovery.LCPDiscovery,LCPBreakdown:w.LCPBreakdown.LCPBreakdown,LegacyJavaScript:w.LegacyJavaScript.LegacyJavaScript,ModernHTTP:w.ModernHTTP.ModernHTTP,NetworkDependencyTree:w.NetworkDependencyTree.NetworkDependencyTree,RenderBlocking:w.RenderBlocking.RenderBlocking,SlowCSSSelector:w.SlowCSSSelector.SlowCSSSelector,ThirdParties:w.ThirdParties.ThirdParties,Viewport:w.Viewport.Viewport};class _i extends HTMLElement{#e=this.attachShadow({mode:"open"});#ki=null;#f={insightSetKey:null,activeCategory:i.Insights.Types.InsightCategory.ALL,activeInsight:null,parsedTrace:null};#Ci=!1;#$i=-1;set data(e){this.#f=e,n.ScheduledRender.scheduleRender(this,this.#n)}connectedCallback(){this.#n()}disconnectedCallback(){window.clearTimeout(this.#$i)}highlightActiveInsight(){this.#ki&&(this.#ki.removeAttribute("highlight-insight"),window.clearTimeout(this.#$i),requestAnimationFrame(()=>{this.#ki?.setAttribute("highlight-insight","true"),this.#$i=window.setTimeout(()=>{this.#ki?.removeAttribute("highlight-insight")},2e3)}))}#Ti(e){return this.#f.activeCategory===i.Insights.Types.InsightCategory.ALL||e===this.#f.activeCategory}#Li(e){this.dispatchEvent(new w.EventRef.EventReferenceClick(e))}#Pi(e,t,n){let s,r,a;if(null===t)s=r="-",a="unclassified";else if("LCP"===e){const e=t,{text:n,element:o}=kt.formatMicroSecondsAsSeconds(e);s=n,r=o,a=i.Handlers.ModelHandlers.PageLoadMetrics.scoreClassificationForLargestContentfulPaint(e)}else if("CLS"===e)s=r=t?t.toFixed(2):"0",a=i.Handlers.ModelHandlers.LayoutShifts.scoreClassificationForLayoutShift(t);else if("INP"===e){const e=t,{text:n,element:o}=kt.formatMicroSecondsAsMillisFixed(e);s=n,r=o,a=i.Handlers.ModelHandlers.UserInteractions.scoreClassificationForInteractionToNextPaint(e)}else c.TypeScriptUtilities.assertNever(e,`Unexpected metric ${e}`);const l=null!==t?Ai(Oi.metricScore,{PH1:e,PH2:s,PH3:a}):Ai(Oi.metricScoreUnavailable,{PH1:e});return this.#Ti(e)?Ni`
      <button class="metric"
        @click=${n?this.#Li.bind(this,n):null}
        title=${l}
        aria-label=${l}
      >
        <div class="metric-value metric-value-${a}">${r}</div>
      </button>
    `:o.nothing}#Ii(e){if(!this.#f.parsedTrace)return{};const t=this.#f.parsedTrace.insights?.get(e);if(!t)return{};return{lcp:i.Insights.Common.getLCP(t),cls:i.Insights.Common.getCLS(t),inp:i.Insights.Common.getINP(t)}}#Mi(e){if(!this.#f.parsedTrace)return null;const t=this.#f.parsedTrace.insights?.get(e);if(!t)return null;const n=i.Insights.Common.getFieldMetricsForInsightSet(t,this.#f.parsedTrace.metadata,u.CrUXManager.instance().getSelectedScope());return n||null}#Ri(e,t){return void 0!==e.lcp&&void 0!==t.lcp&&"better"===Ct("LCP",e.lcp,t.lcp)||void 0!==e.inp&&void 0!==t.inp&&"better"===Ct("LCP",e.inp,t.inp)}#Ei(){this.#Ci=!0,this.#n()}#Di(e){const t=this.#Ii(e),n=this.#Mi(e),s=this.#Pi("LCP",t.lcp?.value??null,t.lcp?.event??null),a=this.#Pi("INP",t.inp?.value??null,t.inp?.event??null),l=this.#Pi("CLS",t.cls?.value??null,t.cls?.worstClusterEvent??null),d=Ni`
      <div class="metrics-row">
        <span>${s}</span>
        <span>${a}</span>
        <span>${l}</span>
        <span class="row-label">Local</span>
      </div>
      <span class="row-border"></span>
    `;let c;if(n){const{lcp:e,inp:t,cls:i}=n,s=this.#Pi("LCP",e?.value??null,null),o=this.#Pi("INP",t?.value??null,null),r=this.#Pi("CLS",i?.value??null,null);let a=Ai(Oi.originOption);"url"!==e?.pageScope&&"url"!==t?.pageScope||(a=Ai(Oi.urlOption)),c=Ni`
        <div class="metrics-row">
          <span>${s}</span>
          <span>${o}</span>
          <span>${r}</span>
          <span class="row-label">${Ai(Oi.fieldScoreLabel,{PH1:a})}</span>
        </div>
        <span class="row-border"></span>
      `}const g={lcp:void 0!==t.lcp?.value?i.Helpers.Timing.microToMilli(t.lcp.value):void 0,inp:void 0!==t.inp?.value?i.Helpers.Timing.microToMilli(t.inp.value):void 0},h=n&&{lcp:void 0!==n.lcp?.value?i.Helpers.Timing.microToMilli(n.lcp.value):void 0,inp:void 0!==n.inp?.value?i.Helpers.Timing.microToMilli(n.inp.value):void 0};let p;!this.#Ci&&h&&this.#Ri(g,h)&&(p=Ni`
        <div class="field-mismatch-notice" jslog=${r.section("timeline.insights.field-mismatch")}>
          <h3>${Ai(Oi.fieldMismatchTitle)}</h3>
          <devtools-button
            title=${Ai(Oi.dismissTitle)}
            .iconName=${"cross"}
            .variant=${"icon"}
            .jslogContext=${"timeline.insights.dismiss-field-mismatch"}
            @click=${this.#Ei}
          ></devtools-button>
          <div class="field-mismatch-notice__body">${Ft(Ai(Oi.fieldMismatchNotice))}</div>
        </div>
      `);const u={metrics:!0,"metrics--field":Boolean(c)},m=Ni`<div class=${o.Directives.classMap(u)}>
      <div class="metrics-row">
        <span class="metric-label">LCP</span>
        <span class="metric-label">INP</span>
        <span class="metric-label">CLS</span>
        <span class="row-label"></span>
      </div>
      ${d}
      ${c}
    </div>`;return Ni`
      ${m}
      ${p}
    `}static categorizeInsights(e,t,i){const n=e?.get(t);if(!n)return{shownInsights:[],passedInsights:[]};const s=[],o=[];for(const[e,t]of Object.entries(n.model)){const n=Ui[e];n&&(t&&Ht({activeCategory:i,insightCategory:t.category})&&(t instanceof Error||("pass"===t.state?o.push({componentClass:n,model:t}):s.push({componentClass:n,model:t}))))}return{shownInsights:s,passedInsights:o}}#Hi(e,t){const i=e?.get(t);if(!i)return o.nothing;const n=this.#Mi(t),{shownInsights:s,passedInsights:r}=_i.categorizeInsights(e,t,this.#f.activeCategory),a=e=>{const{componentClass:s,model:r}=e;if(!this.#f.parsedTrace?.insights)return Ni``;const a=I.AIContext.AgentFocus.fromInsight(this.#f.parsedTrace,r);return Ni`<div>
        <${s.litTagName}
          .selected=${this.#f.activeInsight?.model===r}
          ${o.Directives.ref(e=>{this.#f.activeInsight?.model===r&&e&&(this.#ki=e)})}
          .model=${r}
          .bounds=${i.bounds}
          .insightSetKey=${t}
          .agentFocus=${a}
          .fieldMetrics=${n}>
        </${s.litTagName}>
      </div>`},l=s.map(a),d=r.map(a);return Ni`
      ${l}
      ${d.length?Ni`
        <details class="passed-insights-section">
          <summary>${Ai(Oi.passedInsights,{PH1:d.length})}</summary>
          ${d}
        </details>
      `:o.nothing}
    `}#n(){const{parsedTrace:e,insightSetKey:t}=this.#f;e?.insights&&t?o.render(Ni`
      <style>${Fi}</style>
      <div class="navigation">
        ${this.#Di(t)}
        ${this.#Hi(e.insights,t)}
        </div>
      `,this.#e,{host:this}):o.render(o.nothing,this.#e,{host:this})}}customElements.define("devtools-performance-sidebar-single-navigation",_i);var Bi=Object.freeze({__proto__:null,SidebarSingleInsightSet:_i}),Vi=`:host{display:flex;flex-flow:column nowrap;flex-grow:1}.insight-sets-wrapper{display:flex;flex-flow:column nowrap;flex-grow:1;details{flex-grow:0}details[open]{flex-grow:1;border-bottom:1px solid var(--sys-color-divider)}summary{background-color:var(--sys-color-surface2);border-bottom:1px solid var(--sys-color-divider);overflow:hidden;padding:2px 5px;text-overflow:ellipsis;white-space:nowrap;font:var(--sys-typescale-body4-medium);display:flex;align-items:center;&:focus{background-color:var(--sys-color-tonal-container)}&::marker{color:var(--sys-color-on-surface-subtle);font-size:11px;line-height:1}details:first-child &{border-top:1px solid var(--sys-color-divider)}}}.zoom-button{margin-left:auto}.zoom-icon{visibility:hidden;&.active devtools-button{visibility:visible}}.dropdown-icon{&.active devtools-button{transform:rotate(90deg)}}\n/*# sourceURL=${import.meta.resolve("./sidebarInsightsTab.css")} */`;const{html:Wi}=o;class ji extends HTMLElement{#e=this.attachShadow({mode:"open"});#Fe=null;#Fi=null;#Ni=i.Insights.Types.InsightCategory.ALL;#Oi=null;set parsedTrace(e){e!==this.#Fe&&(this.#Fe=e,this.#Oi=null,this.#Fe?.insights&&(this.#Oi=[...this.#Fe.insights.keys()].at(0)??null),n.ScheduledRender.scheduleRender(this,this.#n))}get activeInsight(){return this.#Fi}set activeInsight(e){e!==this.#Fi&&(this.#Fi=e,this.#Fi&&(this.#Oi=this.#Fi.insightSetKey),n.ScheduledRender.scheduleRender(this,this.#n))}#zi(e){this.#Oi=this.#Oi===e?null:e,this.#Oi!==this.#Fi?.insightSetKey&&this.dispatchEvent(new w.SidebarInsight.InsightDeactivated),n.ScheduledRender.scheduleRender(this,this.#n)}#Ai(e){const t=this.#Fe?.insights?.get(e);t&&this.dispatchEvent(new w.SidebarInsight.InsightSetHovered(t.bounds))}#Ui(){this.dispatchEvent(new w.SidebarInsight.InsightSetHovered)}#_i(e,t){e.stopPropagation();const i=this.#Fe?.insights?.get(t);i&&this.dispatchEvent(new w.SidebarInsight.InsightSetZoom(i.bounds))}#Bi(e){const t=o.Directives.classMap({"zoom-icon":!0,active:e});return Wi`
    <div class=${t}>
        <devtools-button .data=${{variant:"icon",iconName:"center-focus-weak",size:"SMALL"}}
      ></devtools-button></div>`}#Vi(e){const t=o.Directives.classMap({"dropdown-icon":!0,active:e});return Wi`
      <div class=${t}>
        <devtools-button .data=${{variant:"icon",iconName:"chevron-right",size:"SMALL"}}
      ></devtools-button></div>
    `}highlightActiveInsight(){if(!this.#Fi)return;const e=this.#e?.querySelector(`devtools-performance-sidebar-single-navigation[data-insight-set-key="${this.#Fi.insightSetKey}"]`);e&&e.highlightActiveInsight()}#n(){if(!this.#Fe?.insights)return void o.render(o.nothing,this.#e,{host:this});const e=this.#Fe.insights,t=e.size>1,i=P.Helpers.createUrlLabels([...e.values()].map(({url:e})=>e)),n=Wi`
      <style>${Vi}</style>
      <div class="insight-sets-wrapper">
        ${[...e.values()].map(({id:e,url:n},s)=>{const o={insightSetKey:e,activeCategory:this.#Ni,activeInsight:this.#Fi,parsedTrace:this.#Fe},r=Wi`
            <devtools-performance-sidebar-single-navigation
              data-insight-set-key=${e}
              .data=${o}>
            </devtools-performance-sidebar-single-navigation>
          `;return t?Wi`<details
              ?open=${e===this.#Oi}
            >
              <summary
                @click=${()=>this.#zi(e)}
                @mouseenter=${()=>this.#Ai(e)}
                @mouseleave=${()=>this.#Ui()}
                title=${n.href}>
                ${this.#Vi(e===this.#Oi)}
                <span>${i[s]}</span>
                <span class='zoom-button' @click=${t=>this.#_i(t,e)}>${this.#Bi(e===this.#Oi)}</span>
              </summary>
              ${r}
            </details>`:r})}
      </div>
    `,s=o.Directives.repeat([n],()=>this.#Fe,e=>e);o.render(s,this.#e,{host:this})}}customElements.define("devtools-performance-sidebar-insights",ji);var qi=Object.freeze({__proto__:null,SidebarInsightsTab:ji});class Ki extends Event{removedAnnotation;static eventName="removeannotation";constructor(e){super(Ki.eventName,{bubbles:!0,composed:!0}),this.removedAnnotation=e}}class Yi extends Event{annotation;static eventName="revealannotation";constructor(e){super(Yi.eventName,{bubbles:!0,composed:!0}),this.annotation=e}}class Gi extends Event{annotation;static eventName="hoverannotation";constructor(e){super(Gi.eventName,{bubbles:!0,composed:!0}),this.annotation=e}}class Xi extends Event{static eventName="annotationhoverout";constructor(){super(Xi.eventName,{bubbles:!0,composed:!0})}}class Ji extends s.Widget.VBox{#ai=new s.TabbedPane.TabbedPane;#Wi=new Zi;#ji=new Qi;#qi=null;constructor(){super(),this.setMinimumSize(170,0),this.#ai.appendTab("insights","Insights",this.#Wi,void 0,void 0,!1,!1,0,"timeline.insights-tab"),this.#ai.appendTab("annotations","Annotations",this.#ji,void 0,void 0,!1,!1,1,"timeline.annotations-tab"),this.#ai.selectTab("insights")}wasShown(){super.wasShown(),this.#ai.show(this.element),this.#Ki(),this.#qi&&(this.element.dispatchEvent(new fi(this.#qi.model,this.#qi.insightSetKey)),this.#qi=null),"insights"===this.#ai.selectedTabId&&this.#ai.tabIsDisabled("insights")&&this.#ai.selectTab("annotations")}willHide(){super.willHide();const e=this.#Wi.getActiveInsight();this.#qi=e,e&&this.element.dispatchEvent(new yi)}setAnnotations(e,t){this.#ji.setAnnotations(e,t),this.#Ki()}#Ki(){const e=this.#ji.deduplicatedAnnotations();this.#ai.setBadge("annotations",e.length>0?e.length.toString():null)}setParsedTrace(e){this.#Wi.setParsedTrace(e),this.#ai.setTabEnabled("insights",Boolean(e?.insights&&e.insights.size>0))}setActiveInsight(e,t){this.#Wi.setActiveInsight(e,t),e&&this.#ai.selectTab("insights")}}class Zi extends s.Widget.VBox{#Yi=new ji;constructor(){super(),this.element.classList.add("sidebar-insights"),this.element.appendChild(this.#Yi)}setParsedTrace(e){this.#Yi.parsedTrace=e}getActiveInsight(){return this.#Yi.activeInsight}setActiveInsight(e,t){this.#Yi.activeInsight=e,t.highlight&&e&&m.done().then(()=>{this.#Yi.highlightActiveInsight()})}}class Qi extends s.Widget.VBox{#Yi=new Mi;constructor(){super(),this.element.classList.add("sidebar-annotations"),this.#Yi.show(this.element)}setAnnotations(e,t){this.#Yi.setData({annotations:e,annotationEntryToColorMap:t})}deduplicatedAnnotations(){return this.#Yi.deduplicatedAnnotations()}}var en=Object.freeze({__proto__:null,AnnotationHoverOut:Xi,DEFAULT_SIDEBAR_TAB:"insights",DEFAULT_SIDEBAR_WIDTH_PX:240,HoverAnnotation:Gi,RemoveAnnotation:Ki,RevealAnnotation:Yi,SidebarWidget:Ji}),tn=`:host{max-height:100%;overflow:hidden auto;scrollbar-width:thin}.timeline-summary{font-size:var(--sys-typescale-body4-size);flex-direction:column;padding:0 var(--sys-size-6) var(--sys-size-4) var(--sys-size-8)}.summary-range{font-weight:var(--ref-typeface-weight-medium);height:24.5px;line-height:22px}.category-summary{gap:var(--sys-size-4);display:flex;flex-direction:column}.category-row{min-height:16px;line-height:16px}.category-swatch{display:inline-block;width:var(--sys-size-6);height:var(--sys-size-6);margin-right:var(--sys-size-4);top:var(--sys-size-1);position:relative;border:var(--sys-size-1) solid var(--sys-color-neutral-outline)}.category-name{display:inline;word-break:break-all}.category-value{text-align:right;position:relative;float:right;z-index:0;width:var(--sys-size-19)}.background-bar-container{position:absolute;inset:0 0 0 var(--sys-size-3);z-index:-1}.background-bar{width:100%;float:right;height:var(--sys-size-8);background-color:var(--sys-color-surface-yellow);border-bottom:var(--sys-size-1) solid var(--sys-color-yellow-outline)}\n/*# sourceURL=${import.meta.resolve("./timelineSummary.css")} */`;const{render:nn,html:sn}=o,on={total:"Total",rangeSS:"Range:  {PH1} – {PH2}"},rn=t.i18n.registerUIStrings("panels/timeline/components/TimelineSummary.ts",on),an=t.i18n.getLocalizedString.bind(void 0,rn);class ln extends HTMLElement{#e=s.UIUtils.createShadowRootWithCoreStyles(this,{cssFile:tn,delegatesFocus:void 0});#Gi=0;#Xi=0;#Ji=0;#Zi=[];set data(e){this.#Ji=e.total,this.#Zi=e.categories,this.#Gi=e.rangeStart,this.#Xi=e.rangeEnd,this.#n()}#n(){const e=sn`
          <div class="timeline-summary">
              <div class="summary-range">${an(on.rangeSS,{PH1:t.TimeUtilities.millisToString(this.#Gi),PH2:t.TimeUtilities.millisToString(this.#Xi)})}</div>
              <div class="category-summary">
                  ${this.#Zi.map(e=>sn`
                          <div class="category-row">
                          <div class="category-swatch" style="background-color: ${e.color};"></div>
                          <div class="category-name">${e.title}</div>
                          <div class="category-value">
                              ${t.TimeUtilities.preciseMillisToString(e.value)}
                              <div class="background-bar-container">
                                  <div class="background-bar" style='width: ${(100*e.value/this.#Ji).toFixed(1)}%;'></div>
                              </div>
                          </div>
                          </div>`)}
                  <div class="category-row">
                      <div class="category-swatch"></div>
                      <div class="category-name">${an(on.total)}</div>
                      <div class="category-value">
                          ${t.TimeUtilities.preciseMillisToString(this.#Ji)}
                          <div class="background-bar-container">
                              <div class="background-bar"></div>
                          </div>
                      </div>
                  </div>
                </div>
          </div>
          </div>

        </div>`;nn(e,this.#e,{host:this})}}customElements.define("devtools-performance-timeline-summary",ln);var dn=Object.freeze({__proto__:null,CategorySummary:ln});export{R as Breadcrumbs,U as BreadcrumbsUI,G as CPUThrottlingSelector,Q as DetailsView,ae as ExportTraceOptions,Te as FieldSettingsDialog,He as IgnoreListSetting,_e as InteractionBreakdown,Ze as LayoutShiftDetails,jt as LiveMetricsView,Et as MetricCard,li as NetworkRequestDetails,Qt as NetworkRequestTooltip,rt as NetworkThrottlingSelector,ve as OriginMap,bi as RelatedInsightChips,en as Sidebar,Hi as SidebarAnnotationsTab,qi as SidebarInsightsTab,Bi as SidebarSingleInsightSet,dn as TimelineSummary,$t as Utils};
//# sourceMappingURL=components.js.map
