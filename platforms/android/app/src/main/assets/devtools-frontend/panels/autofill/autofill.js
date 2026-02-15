import"../../ui/components/adorners/adorners.js";import"../../ui/legacy/components/data_grid/data_grid.js";import*as e from"../../core/common/common.js";import*as t from"../../core/host/host.js";import*as s from"../../core/i18n/i18n.js";import*as i from"../../core/sdk/sdk.js";import*as l from"../../models/autofill_manager/autofill_manager.js";import*as o from"../../ui/legacy/legacy.js";import*as a from"../../ui/lit/lit.js";import*as r from"../../ui/visual_logging/visual_logging.js";var d=`@scope to (devtools-widget > *){main{height:100%}.header{display:flex;border-bottom:1px solid var(--sys-color-divider);width:100%}.placeholder-container{height:calc(100% - 29px);display:flex;justify-content:center;align-items:center}.address{padding:10px;margin-right:auto}.filled-fields-grid{border-top:1px solid var(--sys-color-divider);box-sizing:border-box}.content-container{display:flex;flex-flow:column;height:100%}.grid-wrapper{flex-grow:1}devtools-data-grid{border:none;height:100%}.checkbox-label{display:flex;align-items:center}.right-to-left{border-bottom:1px solid var(--sys-color-divider);display:flex;flex-flow:row-reverse wrap;justify-content:flex-end}.label-container{padding:5px;display:flex;align-items:flex-start}.top-left-corner{border-bottom:1px solid var(--sys-color-divider);display:flex;padding:5px;gap:10px}.matches-filled-field{background-color:var(--sys-color-tonal-container)}.highlighted{background-color:var(--sys-color-state-focus-select)}.link{color:var(--sys-color-primary);text-decoration-line:underline}.feedback{margin:auto 5px auto auto;font-size:var(--sys-typescale-body4-size)}}\n/*# sourceURL=${import.meta.resolve("./autofillView.css")} */`;const{html:n,render:h,Directives:{styleMap:c}}=a,{FillingStrategy:g}=Protocol.Autofill,{bindToSetting:u}=o.UIUtils,f={noAutofill:"No autofill detected",toStartDebugging:"To start debugging autofill, use Chrome's autofill menu to fill an address form.",value:"Value",predictedAutofillValue:"Predicted autofill value",formField:"Form field",autocompleteAttribute:"Autocomplete attribute",attr:"attr",inferredByHeuristics:"Inferred by heuristics",heur:"heur",autoShow:"Automatically open this panel",showTestAddressesInAutofillMenu:"Show test addresses in autofill menu",autoShowTooltip:"Open the autofill panel automatically when an autofill activity is detected.",addressPreview:"Address preview",formInspector:"Form inspector",learnMore:"Learn more",sendFeedback:"Send feedback"},m="https://crbug.com/329106326",p=s.i18n.registerUIStrings("panels/autofill/AutofillView.ts",f),v=s.i18n.getLocalizedString.bind(void 0,p),w=(e,t,s)=>{e.address||e.filledFields.length?h(n`
      <style>${d}</style>
      <style>${o.inspectorCommonStyles}</style>
      <main>
        <div class="content-container" jslog=${r.pane("autofill")}>
          <div class="right-to-left" role="region" aria-label=${v(f.addressPreview)}>
            <div class="header">
              <div class="label-container">
                <devtools-checkbox
                    ${u(e.showTestAddressesInAutofillMenuSetting)}
                    title=${v(f.showTestAddressesInAutofillMenu)}
                    jslog=${r.toggle(e.showTestAddressesInAutofillMenuSetting.name).track({change:!0})}>
                  ${v(f.showTestAddressesInAutofillMenu)}
                </devtools-checkbox>
              </div>
              <div class="label-container">
                <devtools-checkbox
                    ${u(e.autoOpenViewSetting)}
                    title=${v(f.autoShowTooltip)}
                    jslog=${r.toggle(e.autoOpenViewSetting.name).track({change:!0})}>
                  ${v(f.autoShow)}
                </devtools-checkbox>
              </div>
              <x-link href=${m} class="feedback link" jslog=${r.link("feedback").track({click:!0})}>${v(f.sendFeedback)}</x-link>
            </div>
            ${(()=>{const t=(t,s)=>{const i=e.address.substring(t,s).split("\n"),l=i.map((e,t)=>t===i.length-1?e:n`${e}<br>`),o=e.matches.some(e=>e.startIndex<=t&&e.endIndex>t);if(!o)return n`<span>${l}</span>`;const d=a.Directives.classMap({"matches-filled-field":o,highlighted:e.highlightedMatches.some(e=>e.startIndex<=t&&e.endIndex>t)});return n`
        <span class=${d}
              jslog=${r.item("matched-address-item").track({hover:!0})}
              @mouseenter=${()=>e.onHighlightMatchesInAddress(t)}
              @mouseleave=${e.onClearHighlightedMatches}>
          ${l}
        </span>`},s=[],i=new Set([0,e.address.length]);for(const t of e.matches)i.add(t.startIndex),i.add(t.endIndex);const l=Array.from(i).sort((e,t)=>e-t);for(let e=0;e<l.length-1;e++)s.push(t(l[e],l[e+1]));return n`
      <div class="address">
        ${s}
      </div>
    `})()}
          </div>
          ${(()=>{const t=new Set(e.highlightedMatches.map(e=>e.filledFieldIndex));return n`
      <div class="grid-wrapper" role="region" aria-label=${v(f.formInspector)}>
        <devtools-data-grid striped
                            class="filled-fields-grid">
          <table>
            <tr>
              <th id="name" weight="50" sortable>${v(f.formField)}</th>
              <th id="autofill-type" weight="50" sortable>${v(f.predictedAutofillValue)}</th>
              <th id="value" weight="50" sortable>${v(f.value)}</th>
            </tr>
            ${e.filledFields.map((s,i)=>n`
                <tr style=${c({"font-family":"var(--monospace-font-family)","font-size":"var(--monospace-font-size)","background-color":t.has(i)?"var(--sys-color-state-hover-on-subtle)":null})}
                    @mouseenter=${()=>e.onHighlightMatchesInFilledFiels(i)}
                    @mouseleave=${e.onClearHighlightedMatches}>
                  <td>${s.name||`#${s.id}`} (${s.htmlType})</td>
                  <td>
                      ${s.autofillType}
                      ${"autocompleteAttribute"===s.fillingStrategy?n`<devtools-adorner title=${v(f.autocompleteAttribute)} .data=${{name:s.fillingStrategy}}>
                              <span>${v(f.attr)}</span>
                            </devtools-adorner>`:"autofillInferred"===s.fillingStrategy?n`<devtools-adorner title=${v(f.inferredByHeuristics)} .data=${{name:s.fillingStrategy}}>
                              <span>${v(f.heur)}</span>
                            </devtools-adorner>`:a.nothing}
                  </td>
                  <td>"${s.value}"</td>
                </tr>`)}
          </table>
        </devtools-data-grid>
      </div>
    `})()}
        </div>
      </main>
    `,s):h(n`
        <style>${d}</style>
        <style>${o.inspectorCommonStyles}</style>
        <main>
          <div class="top-left-corner">
            <devtools-checkbox
                ${u(e.showTestAddressesInAutofillMenuSetting)}
                title=${v(f.showTestAddressesInAutofillMenu)}
                jslog=${r.toggle(e.showTestAddressesInAutofillMenuSetting.name).track({change:!0})}>
              ${v(f.showTestAddressesInAutofillMenu)}
            </devtools-checkbox>
            <devtools-checkbox
                ${u(e.autoOpenViewSetting)}
                title=${v(f.autoShowTooltip)}
                jslog=${r.toggle(e.autoOpenViewSetting.name).track({change:!0})}>
              ${v(f.autoShow)}
            </devtools-checkbox>
            <x-link href=${m} class="feedback link" jslog=${r.link("feedback").track({click:!0})}>${v(f.sendFeedback)}</x-link>
          </div>
          <div class="placeholder-container" jslog=${r.pane("autofill-empty")}>
            <div class="empty-state">
              <span class="empty-state-header">${v(f.noAutofill)}</span>
              <div class="empty-state-description">
                <span>${v(f.toStartDebugging)}</span>
                <x-link href=${"https://goo.gle/devtools-autofill-panel"} class="link" jslog=${r.link("learn-more").track({click:!0})}>${v(f.learnMore)}</x-link>
              </div>
            </div>
          </div>
        </main>
      `,s)};class $ extends o.Widget.VBox{#e;#t;#s=e.Settings.Settings.instance().createSetting("auto-open-autofill-view-on-event",!0);#i;#l="";#o=[];#a=[];#r=[];constructor(t=l.AutofillManager.AutofillManager.instance(),s=w){super({useShadowDom:!0}),this.#t=t,this.#e=s,this.#i=e.Settings.Settings.instance().createSetting("show-test-addresses-in-autofill-menu-on-event",!1)}wasShown(){super.wasShown();const e=this.#t.getLastFilledAddressForm();e&&({address:this.#l,filledFields:this.#o,matches:this.#a}=e),this.#t.addEventListener("AddressFormFilled",this.#d,this),i.TargetManager.TargetManager.instance().addModelListener(i.ResourceTreeModel.ResourceTreeModel,i.ResourceTreeModel.Events.PrimaryPageChanged,this.#n,this),this.requestUpdate()}willHide(){i.TargetManager.TargetManager.instance().removeModelListener(i.ResourceTreeModel.ResourceTreeModel,i.ResourceTreeModel.Events.PrimaryPageChanged,this.#n,this),this.#t.removeEventListener("AddressFormFilled",this.#d,this),super.willHide()}#n(){this.#l="",this.#o=[],this.#a=[],this.#r=[],this.requestUpdate()}async#d({data:e}){this.#s.get()?(await o.ViewManager.ViewManager.instance().showView("autofill-view"),t.userMetrics.actionTaken(t.UserMetrics.Action.AutofillReceivedAndTabAutoOpened)):t.userMetrics.actionTaken(t.UserMetrics.Action.AutofillReceived),this.#l=e.address,this.#o=e.filledFields,this.#a=e.matches,this.#r=[],this.requestUpdate()}performUpdate(){const e={autoOpenViewSetting:this.#s,showTestAddressesInAutofillMenuSetting:this.#i,address:this.#l,filledFields:this.#o,matches:this.#a,highlightedMatches:this.#r,onHighlightMatchesInAddress:e=>{this.#r=this.#a.filter(t=>t.startIndex<=e&&t.endIndex>e),this.requestUpdate()},onHighlightMatchesInFilledFiels:e=>{this.#t.highlightFilledField(this.#o[e]),this.#r=this.#a.filter(t=>t.filledFieldIndex===e),this.requestUpdate()},onClearHighlightedMatches:()=>{this.#t.clearHighlightedFilledFields(),this.#r=[],this.requestUpdate()}};this.#e(e,undefined,this.contentElement)}}var y=Object.freeze({__proto__:null,AutofillView:$,i18nString:v});export{y as AutofillView};
//# sourceMappingURL=autofill.js.map
