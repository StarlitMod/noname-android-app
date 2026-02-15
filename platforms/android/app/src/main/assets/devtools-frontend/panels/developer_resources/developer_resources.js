import*as e from"../../ui/legacy/legacy.js";import*as t from"../../core/i18n/i18n.js";import*as r from"../../core/platform/platform.js";import*as s from"../../core/sdk/sdk.js";import{render as o,html as i,nothing as l}from"../../ui/lit/lit.js";import*as a from"../../ui/visual_logging/visual_logging.js";import"../../ui/legacy/components/data_grid/data_grid.js";import"../../ui/components/highlighting/highlighting.js";import*as n from"../../core/host/host.js";var d=`@scope to (devtools-widget > *){.data-grid{border:none}::part(url-outer){width:100%;display:inline-flex;justify-content:flex-start}::part(filter-highlight){font-weight:bold}::part(url-prefix){overflow-x:hidden;text-overflow:ellipsis}::part(url-suffix){flex:none}}\n/*# sourceURL=${import.meta.resolve("./developerResourcesListView.css")} */`;const c={status:"Status",url:"URL",initiator:"Initiator",totalBytes:"Total Bytes",duration:"Duration",error:"Error",developerResources:"Developer resources",copyUrl:"Copy URL",copyInitiatorUrl:"Copy initiator URL",pending:"pending",success:"success",failure:"failure",sBytes:"{n, plural, =1 {# byte} other {# bytes}}",numberOfResourceMatch:"{n, plural, =1 {# resource matches} other {# resources match}}",noResourceMatches:"No resource matches"},u=t.i18n.registerUIStrings("panels/developer_resources/DeveloperResourcesListView.ts",c),p=t.i18n.getLocalizedString.bind(void 0,u),{withThousandsSeparator:h}=r.NumberUtilities,g=(e,r,s)=>{function a(t,r){if(!t)return"";const s=e.filters.find(e=>e.key?.split(",")?.includes(r));if(!s?.regex)return"";const o=s.regex.exec(t??"");return o?.length?`${o.index},${o[0].length}`:""}o(i`
      <style>${d}</style>
      <devtools-data-grid name=${p(c.developerResources)} striped class="flex-auto"
         .filters=${e.filters} @contextmenu=${e.onContextMenu} @selected=${e.onSelect}>
        <table>
          <tr>
            <th id="status" sortable fixed width="60px">
              ${p(c.status)}
            </th>
            <th id="url" sortable width="250px">
              ${p(c.url)}
            </th>
            <th id="initiator" sortable width="80px">
              ${p(c.initiator)}
            </th>
            <th id="size" sortable fixed width="80px" align="right">
              ${p(c.totalBytes)}
            </th>
            <th id="duration" sortable fixed width="80px" align="right">
              ${p(c.duration)}
            </th>
            <th id="error-message" sortable width="200px">
              ${p(c.error)}
            </th>
          </tr>
          ${e.items.map((r,s)=>{const o=/^(.*)(\/[^/]*)$/.exec(r.url);return i`
            <tr selected=${r===e.selectedItem||l}
                data-url=${r.url??l}
                data-initiator-url=${r.initiator.initiatorUrl??l}
                data-index=${s}>
              <td>${!0===r.success?p(c.success):!1===r.success?p(c.failure):p(c.pending)}</td>
              <td title=${r.url} aria-label=${r.url}>
                <devtools-highlight aria-hidden="true" part="url-outer"
                                    ranges=${a(r.url,"url")}>
                  <div part="url-prefix">${o?o[1]:r.url}</div>
                  <div part="url-suffix">${o?o[2]:""}</div>
                </devtools-highlight>
              </td>
              <td title=${r.initiator.initiatorUrl||""}
                  aria-label=${r.initiator.initiatorUrl||""}
                  @mouseenter=${()=>e.onInitiatorMouseEnter(r.initiator.frameId)}
                  @mouseleave=${e.onInitiatorMouseLeave}
              >${r.initiator.initiatorUrl||""}</td>
              <td aria-label=${null!==r.size?p(c.sBytes,{n:r.size}):l}
                  data-value=${r.size??l}>${null!==r.size?i`<span>${h(r.size)}</span>`:""}</td>
              <td aria-label=${null!==r.duration?t.TimeUtilities.millisToString(r.duration):l}
                  data-value=${r.duration??l}>${null!==r.duration?i`<span>${t.TimeUtilities.millisToString(r.duration)}</span>`:""}</td>
              <td class="error-message">
                ${r.errorMessage?i`
                <devtools-highlight ranges=${a(r.errorMessage,"error-message")}>
                  ${r.errorMessage}
                </devtools-highlight>`:l}
              </td>
            </tr>`})}
          </table>
        </devtools-data-grid>`,s)};class v extends e.Widget.VBox{#e=[];#t=null;#r=null;#s;#o=[];constructor(e,t=g){super(e,{useShadowDom:!0}),this.#s=t}set selectedItem(e){this.#t=e,this.requestUpdate()}set onSelect(e){this.#r=e}#i(e,t){const r=t.dataset.url;r&&e.clipboardSection().appendItem(p(c.copyUrl),()=>{n.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(r)},{jslogContext:"copy-url"});const s=t.dataset.initiatorUrl;s&&e.clipboardSection().appendItem(p(c.copyInitiatorUrl),()=>{n.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(s)},{jslogContext:"copy-initiator-url"})}set items(e){this.#e=[...e],this.requestUpdate()}reset(){this.items=[],this.requestUpdate()}set filters(t){this.#o=t,this.requestUpdate(),this.updateComplete.then(()=>{const t=Number(this.contentElement.querySelector("devtools-data-grid")?.getAttribute("aria-rowcount"))??0;let r="";r=0===t?p(c.noResourceMatches):p(c.numberOfResourceMatch,{n:t}),e.ARIAUtils.LiveAnnouncer.alert(r)})}performUpdate(){const e={items:this.#e,selectedItem:this.#t,filters:this.#o,onContextMenu:e=>{e.detail?.element&&this.#i(e.detail.menu,e.detail.element)},onSelect:e=>{this.#t=e.detail?this.#e[Number(e.detail.dataset.index)]:null,this.#r?.(this.#t)},onInitiatorMouseEnter:e=>{const t=e?s.FrameManager.FrameManager.instance().getFrame(e):null;t&&t.highlight()},onInitiatorMouseLeave:()=>{s.OverlayModel.OverlayModel.hideDOMNodeHighlight()}};this.#s(e,{},this.contentElement)}}var m=`@scope to (devtools-widget > *){:scope{overflow:hidden}.developer-resource-view-toolbar-container{display:flex;border-bottom:1px solid var(--sys-color-divider);flex:0 0 auto}.developer-resource-view-toolbar{width:100%}.developer-resource-view-toolbar-summary{background-color:var(--sys-color-cdt-base-container);border-top:1px solid var(--sys-color-divider);padding-left:5px;flex:0 0 19px;display:flex;padding-right:5px}.developer-resource-view-toolbar-summary .developer-resource-view-message{padding-top:2px;padding-left:1ex;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.developer-resource-view-results{overflow-y:auto;display:flex;flex:auto}}\n/*# sourceURL=${import.meta.resolve("./developerResourcesView.css")} */`;const{widgetConfig:f}=e.Widget,{bindToSetting:w}=e.UIUtils,x={filterByText:"Filter by URL and error",loadHttpsDeveloperResources:"Load `HTTP(S)` developer resources through the website you inspect, not through DevTools",enableLoadingThroughTarget:"Load through website",resourcesCurrentlyLoading:"{PH1} resources, {PH2} currently loading",resources:"{n, plural, =1 {# resource} other {# resources}}"},b=t.i18n.registerUIStrings("panels/developer_resources/DeveloperResourcesView.ts",x),y=t.i18n.getLocalizedString.bind(void 0,b);const $=(e,t,r)=>{o(i`
    <style>
      ${m}
    </style>
    <div class="vbox flex-auto" jslog=${a.panel("developer-resources").track({resize:!0})}>
      <div class="developer-resource-view-toolbar-container" jslog=${a.toolbar()}
          role="toolbar">
        <devtools-toolbar class="developer-resource-view-toolbar" role="presentation">
          <devtools-toolbar-input type="filter" placeholder=${y(x.filterByText)}
              @change=${e.onFilterChanged} style="flex-grow:1">
          </devtools-toolbar-input>
          <devtools-checkbox
              title=${y(x.loadHttpsDeveloperResources)}
              ${w(s.PageResourceLoader.getLoadThroughTargetSetting())}>
            ${y(x.enableLoadingThroughTarget)}
          </devtools-checkbox>
        </devtools-toolbar>
      </div>
      <div class="developer-resource-view-results">
        <devtools-widget
          .widgetConfig=${f(v,{items:e.items,selectedItem:e.selectedItem,onSelect:e.onSelect,filters:e.filters})}>
        </devtools-widget>
      </div>
      <div class="developer-resource-view-toolbar-summary">
        <div class="developer-resource-view-message">
          ${e.numLoading>0?y(x.resourcesCurrentlyLoading,{PH1:e.numResources,PH2:e.numLoading}):y(x.resources,{n:e.numResources})}
         </div>
      </div>
    </div>`,r)};class I extends e.Widget.VBox{#l;#s;#t=null;#o=[];constructor(e=$){super({useShadowDom:!0}),this.#s=e,this.#l=s.PageResourceLoader.PageResourceLoader.instance(),this.#l.addEventListener("Update",this.requestUpdate,this),this.requestUpdate()}async performUpdate(){const{loading:e,resources:t}=this.#l.getScopedNumberOfResources(),r={onFilterChanged:e=>{this.onFilterChanged(e.detail)},items:this.#l.getResourcesLoaded().values(),selectedItem:this.#t,onSelect:e=>{this.#t=e},filters:this.#o,numResources:t,numLoading:e};this.#s(r,{},this.contentElement)}async select(e){await this.updateComplete,this.#t=e,this.requestUpdate()}async selectedItem(){return await this.updateComplete,this.#t}onFilterChanged(e){const t=e?r.StringUtilities.createPlainTextSearchRegex(e,"i"):null;this.#o=t?[{key:"url,error-message",regex:t,negative:!1}]:[],this.requestUpdate()}}var U=Object.freeze({__proto__:null,DEFAULT_VIEW:$,DeveloperResourcesRevealer:class{async reveal(t){const r=s.PageResourceLoader.PageResourceLoader.instance().getResourcesLoaded().get(t.key);if(r){await e.ViewManager.ViewManager.instance().showView("developer-resources");const t=await e.ViewManager.ViewManager.instance().view("developer-resources").widget();return await t.select(r)}}},DeveloperResourcesView:I});export{U as DeveloperResourcesView};
//# sourceMappingURL=developer_resources.js.map
