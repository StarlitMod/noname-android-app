import*as e from"../../core/i18n/i18n.js";import*as t from"../../core/common/common.js";import*as o from"../../core/root/root.js";import*as s from"../../core/sdk/sdk.js";import*as i from"../../ui/legacy/components/color_picker/color_picker.js";import"../../ui/components/buttons/buttons.js";import*as n from"../../ui/legacy/legacy.js";import{render as r,html as a,Directives as l,nothing as d}from"../../ui/lit/lit.js";import"../../ui/legacy/components/data_grid/data_grid.js";import"../../ui/components/icon_button/icon_button.js";import*as c from"../../core/platform/platform.js";import*as u from"../../models/geometry/geometry.js";import*as p from"../../models/text_utils/text_utils.js";import*as h from"../../ui/legacy/components/utils/utils.js";import*as v from"../../ui/visual_logging/visual_logging.js";import*as m from"../../core/host/host.js";import"../../ui/components/panel_feedback/panel_feedback.js";import"../../ui/components/panel_introduction_steps/panel_introduction_steps.js";const g={topAppliedToAStatically:"`Top` applied to a statically positioned element",leftAppliedToAStatically:"`Left` applied to a statically positioned element",rightAppliedToAStatically:"`Right` applied to a statically positioned element",bottomAppliedToAStatically:"`Bottom` applied to a statically positioned element",widthAppliedToAnInlineElement:"`Width` applied to an inline element",heightAppliedToAnInlineElement:"`Height` applied to an inline element",verticalAlignmentAppliedTo:"Vertical alignment applied to element which is neither `inline` nor `table-cell`"},f=e.i18n.registerUIStrings("panels/css_overview/CSSOverviewUnusedDeclarations.ts",g),w=e.i18n.getLocalizedString.bind(void 0,f);class b{static add(e,t,o){const s=e.get(t)||[];s.push(o),e.set(t,s)}static checkForUnusedPositionValues(e,t,o,s,i,n,r,a){if("static"===o[s]){if("auto"!==o[i]){const s=w(g.topAppliedToAStatically);this.add(e,s,{declaration:`top: ${o[i]}`,nodeId:t})}if("auto"!==o[n]){const s=w(g.leftAppliedToAStatically);this.add(e,s,{declaration:`left: ${o[n]}`,nodeId:t})}if("auto"!==o[r]){const s=w(g.rightAppliedToAStatically);this.add(e,s,{declaration:`right: ${o[r]}`,nodeId:t})}if("auto"!==o[a]){const s=w(g.bottomAppliedToAStatically);this.add(e,s,{declaration:`bottom: ${o[a]}`,nodeId:t})}}}static checkForUnusedWidthAndHeightValues(e,t,o,s,i,n){if("inline"===o[s]){if("auto"!==o[i]){const s=w(g.widthAppliedToAnInlineElement);this.add(e,s,{declaration:`width: ${o[i]}`,nodeId:t})}if("auto"!==o[n]){const s=w(g.heightAppliedToAnInlineElement);this.add(e,s,{declaration:`height: ${o[n]}`,nodeId:t})}}}static checkForInvalidVerticalAlignment(e,t,o,s,i){if(o[s]&&!o[s].startsWith("inline")&&!o[s].startsWith("table")&&"baseline"!==o[i]){const s=w(g.verticalAlignmentAppliedTo);this.add(e,s,{declaration:`vertical-align: ${o[i]}`,nodeId:t})}}}var S=Object.freeze({__proto__:null,CSSOverviewUnusedDeclarations:b});class y extends s.SDKModel.SDKModel{#e;#t;#o;constructor(e){super(e),this.#e=e.runtimeAgent(),this.#t=e.cssAgent(),this.#o=e.domsnapshotAgent()}async getNodeStyleStats(){const e=new Map,s=new Map,n=new Map,r=new Map,a=new Map,l=new Map,d=new Map,c=e=>e instanceof t.Color.Legacy?e.hasAlpha()?e.asString("hexa"):e.asString("hex"):e.asString(),u=(e,o,s)=>{if(-1===e)return;const i=f[e];if(!i)return;const n=t.Color.parse(i);if(!n||0===n.asLegacyColor().rgba()[3])return;const r=c(n);if(!r)return;const a=s.get(r)||new Set;return a.add(o),s.set(r,a),n},p=e=>new Set(["altglyph","circle","ellipse","path","polygon","polyline","rect","svg","text","textpath","tref","tspan"]).has(e.toLowerCase()),h=e=>new Set(["iframe","video","embed","img"]).has(e.toLowerCase()),v=(e,t)=>new Set(["tr","td","thead","tbody"]).has(e.toLowerCase())&&t.startsWith("table");let m=0;const{documents:g,strings:f}=await this.#o.invoke_captureSnapshot({computedStyles:["background-color","color","fill","border-top-width","border-top-color","border-bottom-width","border-bottom-color","border-left-width","border-left-color","border-right-width","border-right-color","font-family","font-size","font-weight","line-height","position","top","right","bottom","left","display","width","height","vertical-align"],includeTextColorOpacities:!0,includeBlendedBackgroundColors:!0});for(const{nodes:w,layout:S}of g){m+=S.nodeIndex.length;for(let m=0;m<S.styles.length;m++){const g=S.styles[m],y=S.nodeIndex[m];if(!w.backendNodeId||!w.nodeName)continue;const C=w.backendNodeId[y],x=w.nodeName[y],[$,k,I,M,A,T,U,O,R,_,E,L,z,D,P,V,j,W,q,N,F,H,B,Q]=g;u($,C,e);const G=u(k,C,s);if(p(f[x])&&u(I,C,r),"0px"!==f[M]&&u(A,C,a),"0px"!==f[T]&&u(U,C,a),"0px"!==f[O]&&u(R,C,a),"0px"!==f[_]&&u(E,C,a),L&&-1!==L){const e=f[L],t=l.get(e)||new Map,o="font-size",s="font-weight",i="line-height",n=t.get(o)||new Map,r=t.get(s)||new Map,a=t.get(i)||new Map;if(-1!==z){const e=f[z],t=n.get(e)||[];t.push(C),n.set(e,t)}if(-1!==D){const e=f[D],t=r.get(e)||[];t.push(C),r.set(e,t)}if(-1!==P){const e=f[P],t=a.get(e)||[];t.push(C),a.set(e,t)}t.set(o,n),t.set(s,r),t.set(i,a),l.set(e,t)}const K=G&&S.blendedBackgroundColors&&-1!==S.blendedBackgroundColors[m]?t.Color.parse(f[S.blendedBackgroundColors[m]]):null;if(G&&K){const e=new i.ContrastInfo.ContrastInfo({backgroundColors:[K.asString("hexa")],computedFontSize:-1!==z?f[z]:"",computedFontWeight:-1!==D?f[D]:""}),t=G.asLegacyColor().blendWithAlpha(S.textColorOpacities?S.textColorOpacities[m]:1);e.setColor(t);const s=`${c(t)}_${c(K.asLegacyColor())}`;if(o.Runtime.experiments.isEnabled("apca")){const o=e.contrastRatioAPCA(),i=e.contrastRatioAPCAThreshold();if(!(!(!o||!i)&&Math.abs(o)>=i)&&o){const e={nodeId:C,contrastRatio:o,textColor:t,backgroundColor:K,thresholdsViolated:{aa:!1,aaa:!1,apca:!0}};n.has(s)?n.get(s).push(e):n.set(s,[e])}}else{const o=e.contrastRatioThreshold("aa")||0,i=e.contrastRatioThreshold("aaa")||0,r=e.contrastRatio()||0;if(o>r||i>r){const e={nodeId:C,contrastRatio:r,textColor:t,backgroundColor:K,thresholdsViolated:{aa:o>r,aaa:i>r,apca:!1}};n.has(s)?n.get(s).push(e):n.set(s,[e])}}}b.checkForUnusedPositionValues(d,C,f,V,j,N,W,q),p(f[x])||h(f[x])||b.checkForUnusedWidthAndHeightValues(d,C,f,F,H,B),-1===Q||v(f[x],f[F])||b.checkForInvalidVerticalAlignment(d,C,f,F,Q)}}return{backgroundColors:e,textColors:s,textColorContrastIssues:n,fillColors:r,borderColors:a,fontInfo:l,unusedDeclarations:d,elementCount:m}}getComputedStyleForNode(e){return this.#t.invoke_getComputedStyleForNode({nodeId:e})}async getMediaQueries(){const e=await this.#t.invoke_getMediaQueries(),t=new Map;if(!e)return t;for(const o of e.medias){if("linkedSheet"===o.source)continue;const e=t.get(o.text)||[];e.push(o),t.set(o.text,e)}return t}async getGlobalStylesheetStats(){const{result:e}=await this.#e.invoke_evaluate({expression:"(function() {\n      let styleRules = 0;\n      let inlineStyles = 0;\n      let externalSheets = 0;\n      const stats = {\n        // Simple.\n        type: new Set(),\n        class: new Set(),\n        id: new Set(),\n        universal: new Set(),\n        attribute: new Set(),\n\n        // Non-simple.\n        nonSimple: new Set()\n      };\n\n      for (const styleSheet of document.styleSheets) {\n        if (styleSheet.href) {\n          externalSheets++;\n        } else {\n          inlineStyles++;\n        }\n\n        // Attempting to grab rules can trigger a DOMException.\n        // Try it and if it fails skip to the next stylesheet.\n        let rules;\n        try {\n          rules = styleSheet.rules;\n        } catch (err) {\n          continue;\n        }\n\n        for (const rule of rules) {\n          if ('selectorText' in rule) {\n            styleRules++;\n\n            // Each group that was used.\n            for (const selectorGroup of rule.selectorText.split(',')) {\n              // Each selector in the group.\n              for (const selector of selectorGroup.split(/[\\t\\n\\f\\r ]+/g)) {\n                if (selector.startsWith('.')) {\n                  // Class.\n                  stats.class.add(selector);\n                } else if (selector.startsWith('#')) {\n                  // Id.\n                  stats.id.add(selector);\n                } else if (selector.startsWith('*')) {\n                  // Universal.\n                  stats.universal.add(selector);\n                } else if (selector.startsWith('[')) {\n                  // Attribute.\n                  stats.attribute.add(selector);\n                } else {\n                  // Type or non-simple selector.\n                  const specialChars = /[#.:\\[\\]|\\+>~]/;\n                  if (specialChars.test(selector)) {\n                    stats.nonSimple.add(selector);\n                  } else {\n                    stats.type.add(selector);\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n\n      return {\n        styleRules,\n        inlineStyles,\n        externalSheets,\n        stats: {\n          // Simple.\n          type: stats.type.size,\n          class: stats.class.size,\n          id: stats.id.size,\n          universal: stats.universal.size,\n          attribute: stats.attribute.size,\n\n          // Non-simple.\n          nonSimple: stats.nonSimple.size\n        }\n      }\n    })()",returnByValue:!0});if("object"===e.type)return e.value}}s.SDKModel.SDKModel.register(y,{capabilities:2,autostart:!1});var C=Object.freeze({__proto__:null,CSSOverviewModel:y}),x=`.overview-processing-view{overflow:hidden;padding:16px;justify-content:center;align-items:center;height:100%}.overview-processing-view h1{font-size:16px;text-align:center;font-weight:normal;margin:0;padding:8px}.overview-processing-view h2{font-size:12px;text-align:center;font-weight:normal;margin:0;padding-top:32px}\n/*# sourceURL=${import.meta.resolve("./cssOverviewProcessingView.css")} */`;const $={cancel:"Cancel"},k=e.i18n.registerUIStrings("panels/css_overview/CSSOverviewProcessingView.ts",$),I=e.i18n.getLocalizedString.bind(void 0,k),M=(e,t,o)=>{r(a`
    <style>${x}</style>
    <div style="overflow:auto">
      <div class="vbox overview-processing-view">
        <h1>Processing page</h1>
        <div>
          <devtools-button
              @click=${e.onCancel}
              .jslogContext=${"css-overview.cancel-processing"}
              .variant=${"outlined"}>${I($.cancel)}</devtools-button>
        </div>
      </div>
    </div>`,o)};class A extends n.Widget.Widget{#s=()=>{};#i;constructor(e,t=M){super(e),this.#i=t,this.requestUpdate()}set onCancel(e){this.#s=e,this.requestUpdate()}performUpdate(){this.#i({onCancel:this.#s},{},this.element)}}var T=Object.freeze({__proto__:null,CSSOverviewProcessingView:A,DEFAULT_VIEW:M}),U=`@scope to (devtools-widget > *){.overview-completed-view{overflow:auto;--overview-default-padding:28px;--overview-icon-padding:32px}.overview-completed-view .summary ul,\n  .overview-completed-view .colors ul{display:flex;flex-wrap:wrap;list-style:none;margin:0;padding:0}.overview-completed-view .summary ul{display:grid;grid-template-columns:repeat(auto-fill,140px);gap:16px}.overview-completed-view .colors ul li{display:inline-block;margin:0 0 16px;padding:0 8px 0 0}.overview-completed-view .summary ul li{display:flex;flex-direction:column;grid-column-start:auto}.overview-completed-view li .label{font-size:12px;padding-bottom:2px}.overview-completed-view li .value{font-size:17px}.overview-completed-view ul li span{font-weight:bold}.unused-rules-grid .header-container,\n  .unused-rules-grid .data-container,\n  .unused-rules-grid table.data{position:relative}.unused-rules-grid .data-container{top:0;max-height:350px}.unused-rules-grid{border-left:none;border-right:none}.unused-rules-grid .monospace{display:block;height:18px}.element-grid{flex:1;border-left:none;border-right:none;overflow:auto}.block{width:65px;height:25px;border-radius:3px;margin-right:16px}.block-title{padding-top:4px;font-size:12px;color:var(--sys-color-on-surface);letter-spacing:0;text-transform:uppercase}.block-title.color-text{text-transform:none;max-width:65px;text-overflow:ellipsis;white-space:nowrap;cursor:text;user-select:text;overflow:hidden}.results-section{flex-shrink:0;border-bottom:1px solid var(--sys-color-divider);padding:var(--overview-default-padding) 0 var(--overview-default-padding) 0}.horizontally-padded{padding-left:var(--overview-default-padding);padding-right:var(--overview-default-padding)}.results-section h1{font-size:15px;font-weight:normal;padding:0;margin:0 0 20px;padding-left:calc(var(--overview-default-padding) + var(--overview-icon-padding));position:relative;height:26px;line-height:26px}.results-section h1::before{content:"";display:block;position:absolute;left:var(--overview-default-padding);top:0;width:26px;height:26px;background-image:var(--image-file-cssoverview_icons_2x);background-size:104px 26px}.results-section.horizontally-padded h1{padding-left:var(--overview-icon-padding)}.results-section.horizontally-padded h1::before{left:0}.results-section.summary h1{padding-left:0}.results-section.summary h1::before{display:none}.results-section.colors h1::before{background-position:0 0}.results-section.font-info h1::before{background-position:-26px 0}.results-section.unused-declarations h1::before{background-position:-52px 0}.results-section.media-queries h1::before{background-position:-78px 0}.results-section.colors h2{margin-top:20px;font-size:13px;font-weight:normal}.overview-completed-view .font-info ul,\n  .overview-completed-view .media-queries ul,\n  .overview-completed-view .unused-declarations ul{width:100%;list-style:none;margin:0;padding:0 var(--overview-default-padding)}.overview-completed-view .font-info ul li,\n  .overview-completed-view .media-queries ul li,\n  .overview-completed-view .unused-declarations ul li{display:grid;grid-template-columns:2fr 3fr;gap:12px;margin-bottom:4px;align-items:center}.overview-completed-view .font-info button .details,\n  .overview-completed-view .media-queries button .details,\n  .overview-completed-view .unused-declarations button .details{min-width:100px;text-align:right;margin-right:8px;color:var(--sys-color-primary);pointer-events:none}.overview-completed-view .font-info button .bar-container,\n  .overview-completed-view .media-queries button .bar-container,\n  .overview-completed-view .unused-declarations button .bar-container{flex:1;pointer-events:none}.overview-completed-view .font-info button .bar,\n  .overview-completed-view .media-queries button .bar,\n  .overview-completed-view .unused-declarations button .bar{height:8px;background:var(--sys-color-primary-bright);border-radius:2px;min-width:2px}.overview-completed-view .font-info button,\n  .overview-completed-view .media-queries button,\n  .overview-completed-view .unused-declarations button{border:none;padding:0;padding-right:10px;margin:0;display:flex;align-items:center;border-radius:2px;cursor:pointer;height:28px;background:none;&:focus-visible{outline:2px solid var(--sys-color-state-focus-ring)}&:hover{border-radius:12px;background:var(--sys-color-state-hover-on-subtle)}&:hover .details,\n    &:focus .details{color:color-mix(in srgb,var(--sys-color-primary),var(--sys-color-state-hover-on-prominent) 6%)}&:hover .bar,\n    &:focus .bar{background-color:color-mix(in srgb,var(--sys-color-primary-bright),var(--sys-color-state-hover-on-prominent) 6%);color:var(--sys-color-on-primary)}}.overview-completed-view .font-info .font-metric{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.overview-completed-view .font-info ul{padding:0}.overview-completed-view .font-info ul li{grid-template-columns:1fr 4fr}.overview-completed-view .font-info h2{font-size:14px;font-weight:bold;margin:0 0 1em}.overview-completed-view .font-info h3{font-size:13px;font-weight:normal;font-style:italic;margin:0 0 0.5em}.overview-completed-view .font-info{padding-bottom:0}.overview-completed-view .font-family{padding:var(--overview-default-padding)}.overview-completed-view .font-family:nth-child(2n+1){background:var(--sys-color-cdt-base-container)}.overview-completed-view .font-family:first-of-type{padding-top:0}.contrast-warning{display:flex;align-items:center;margin-top:2px}.contrast-warning .threshold-label{font-weight:normal;width:30px}.contrast-warning devtools-icon{margin-left:2px}.contrast-preview{padding:0 5px}.contrast-container-in-grid{display:flex;align-items:center}.contrast-container-in-grid > *{margin-right:5px;min-width:initial}::part(node-id-column){align-items:center;height:20px;--show-element-display:none}::part(node-id-column):focus,\n  ::part(node-id-column):hover{--show-element-display:inline-block}::part(show-element){display:var(--show-element-display);height:16px;width:16px}.results-section.colors{forced-color-adjust:none}}\n/*# sourceURL=${import.meta.resolve("./cssOverviewCompletedView.css")} */`,O=`@scope to (devtools-widget > *){.overview-sidebar-panel{display:flex;background:var(--sys-color-cdt-base-container);min-width:fit-content;flex-direction:column}.overview-sidebar-panel-item{height:30px;padding-left:30px;display:flex;align-items:center;color:var(--sys-color-on-surface);white-space:nowrap;&:hover{background:var(--sys-color-state-hover-on-subtle)}&:focus{background:var(--sys-color-state-focus-highlight)}&.selected{background:var(--sys-color-tonal-container);color:var(--sys-color-on-tonal-container)}}.overview-toolbar{border-bottom:1px solid var(--sys-color-divider);flex:0 0 auto}.overview-sidebar-panel-item:focus-visible{outline-width:unset}@media (forced-colors: active){.overview-sidebar-panel-item.selected{forced-color-adjust:none;background:Highlight;color:HighlightText}.overview-sidebar-panel-item:hover{forced-color-adjust:none;background:Highlight;color:HighlightText}}}\n/*# sourceURL=${import.meta.resolve("./cssOverviewSidebarPanel.css")} */`;const{classMap:R}=l,_={clearOverview:"Clear overview",cssOverviewPanelSidebar:"CSS overview panel sidebar"},E=e.i18n.registerUIStrings("panels/css_overview/CSSOverviewSidebarPanel.ts",_),L=e.i18n.getLocalizedString.bind(void 0,E),z=(e,t,o)=>{r(a`
      <style>${O}</style>
      <div class="overview-sidebar-panel" @click=${t=>{if(t.target instanceof HTMLElement){const o=t.target.dataset.id;o&&e.onItemClick(o)}}} @keydown=${t=>{if("Enter"===t.key||"ArrowUp"===t.key||"ArrowDown"===t.key){if(t.target instanceof HTMLElement){const o=t.target.dataset.id;o&&e.onItemKeyDown(o,t.key)}t.consume(!0)}}}
           aria-label=${L(_.cssOverviewPanelSidebar)} role="tree">
        <div class="overview-toolbar">
          <devtools-toolbar>
            <devtools-button title=${L(_.clearOverview)} @click=${e.onReset}
                .iconName=${"clear"} .variant=${"toolbar"}
                .jslogContext=${"css-overview.clear-overview"}></devtools-button>
          </devtools-toolbar>
        </div>
        ${e.items.map(({id:t,name:o})=>{const s=t===e.selectedId;return a`
            <div class="overview-sidebar-panel-item ${R({selected:s})}"
                ?autofocus=${s}
                role="treeitem" data-id=${t} tabindex="0"
                jslog=${v.item(`css-overview.${t}`).track({click:!0,keydown:"Enter|ArrowUp|ArrowDown"})}>
              ${o}
            </div>`})}
      </div>`,o)};class D extends n.Widget.VBox{#i;#n=[];#r;#a=(e,t)=>{};#l=()=>{};constructor(e,t=z){super(e,{useShadowDom:!0,delegatesFocus:!0}),this.#i=t}performUpdate(){const e={items:this.#n,selectedId:this.#r,onReset:this.#l,onItemClick:this.#d.bind(this),onItemKeyDown:this.#c.bind(this)};this.#i(e,{},this.contentElement)}set items(e){this.#n=e,this.requestUpdate()}set selectedId(e){this.#u(e)}set onItemSelected(e){this.#a=e,this.requestUpdate()}set onReset(e){this.#l=e,this.requestUpdate()}#u(e,t=!1){return this.#r=e,this.requestUpdate(),this.#a(e,t),this.updateComplete}#d(e){this.#u(e,!1)}#c(e,t){if("Enter"===t)this.#u(e,!0);else{let o=-1;for(let t=0;t<this.#n.length;t++)if(this.#n[t].id===e){o=t;break}if(o<0)return;const s=(o+("ArrowDown"===t?1:-1))%this.#n.length,i=this.#n[s].id;if(!i)return;this.#u(i,!1).then(()=>{this.element.blur(),this.element.focus()})}}}var P=Object.freeze({__proto__:null,CSSOverviewSidebarPanel:D,DEFAULT_VIEW:z});const{styleMap:V,ref:j}=l,{widgetConfig:W}=n.Widget,q={overviewSummary:"Overview summary",colors:"Colors",fontInfo:"Font info",unusedDeclarations:"Unused declarations",mediaQueries:"Media queries",elements:"Elements",externalStylesheets:"External stylesheets",inlineStyleElements:"Inline style elements",styleRules:"Style rules",typeSelectors:"Type selectors",idSelectors:"ID selectors",classSelectors:"Class selectors",universalSelectors:"Universal selectors",attributeSelectors:"Attribute selectors",nonsimpleSelectors:"Non-simple selectors",backgroundColorsS:"Background colors: {PH1}",textColorsS:"Text colors: {PH1}",fillColorsS:"Fill colors: {PH1}",borderColorsS:"Border colors: {PH1}",thereAreNoFonts:"There are no fonts.",thereAreNoUnusedDeclarations:"There are no unused declarations.",thereAreNoMediaQueries:"There are no media queries.",contrastIssues:"Contrast issues",nOccurrences:"{n, plural, =1 {# occurrence} other {# occurrences}}",contrastIssuesS:"Contrast issues: {PH1}",textColorSOverSBackgroundResults:"Text color {PH1} over {PH2} background results in low contrast for {PH3} elements",aa:"AA",aaa:"AAA",apca:"APCA",element:"Element",declaration:"Declaration",source:"Source",contrastRatio:"Contrast ratio",cssOverviewElements:"CSS overview elements",showElement:"Show element",unableToLink:"(unable to link)",unableToLinkToInlineStyle:"(unable to link to inline style)"},N=e.i18n.registerUIStrings("panels/css_overview/CSSOverviewCompletedView.ts",q),F=e.i18n.getLocalizedString.bind(void 0,N);function H(e){let{h:t,s:o,l:s}=e.as("hsl");return t=Math.round(360*t),o=Math.round(100*o),s=Math.round(100*s),s=Math.max(0,s-15),`1px solid hsl(${t}deg ${o}% ${s}%)`}const B=new Intl.NumberFormat("en-US"),Q=(e,t,s)=>{function i(e,t){if(e&&(e.scrollIntoView(),t)){const t=e.querySelector('button, [tabindex="0"]');t?.focus()}}var l,d,c,p,h,m,g,f,w;r(a`
      <style>${U}</style>
      <devtools-split-view direction="column" sidebar-position="first" sidebar-initial-size="200">
        <devtools-widget slot="sidebar" .widgetConfig=${W(D,{minimumSize:new u.Size(100,25),items:[{name:F(q.overviewSummary),id:"summary"},{name:F(q.colors),id:"colors"},{name:F(q.fontInfo),id:"font-info"},{name:F(q.unusedDeclarations),id:"unused-declarations"},{name:F(q.mediaQueries),id:"media-queries"}],selectedId:e.selectedSection,onItemSelected:e.onSectionSelected,onReset:e.onReset})}>
        </devtools-widget>
        <devtools-split-view sidebar-position="second" slot="main" direction="row" sidebar-initial-size="minimized">
          <div class="vbox overview-completed-view" slot="main" @click=${e.onClick}>
            <!-- Dupe the styles into the main container because of the shadow root will prevent outer styles. -->
            <style>${U}</style>
            <div class="results-section horizontally-padded summary"
                  ${j(e=>{t.revealSection.set("summary",i.bind(null,e))})}>
              <h1>${F(q.overviewSummary)}</h1>
              ${function(e,t,o){const s=(e,t)=>a`
    <li>
      <div class="label">${e}</div>
      <div class="value">${B.format(t)}</div>
    </li>`;return a`<ul>
    ${s(F(q.elements),e)}
    ${s(F(q.externalStylesheets),t.externalSheets)}
    ${s(F(q.inlineStyleElements),t.inlineStyles)}
    ${s(F(q.styleRules),t.styleRules)}
    ${s(F(q.mediaQueries),o.length)}
    ${s(F(q.typeSelectors),t.stats.type)}
    ${s(F(q.idSelectors),t.stats.id)}
    ${s(F(q.classSelectors),t.stats.class)}
    ${s(F(q.universalSelectors),t.stats.universal)}
    ${s(F(q.attributeSelectors),t.stats.attribute)}
    ${s(F(q.nonsimpleSelectors),t.stats.nonSimple)}
  </ul>`}(e.elementCount,e.globalStyleStats,e.mediaQueries)}
            </div>
            <div class="results-section horizontally-padded colors"
                ${j(e=>{t.revealSection.set("colors",i.bind(null,e))})}>
                <h1>${F(q.colors)}</h1>
                ${p=e.backgroundColors,h=e.textColors,m=e.textColorContrastIssues,g=e.fillColors,f=e.borderColors,a`
    <h2>${F(q.backgroundColorsS,{PH1:p.length})}</h2>
    <ul>${p.map(e=>K("background",e))}</ul>

    <h2>${F(q.textColorsS,{PH1:h.length})}</h2>
    <ul>${h.map(e=>K("text",e))}</ul>

    ${m.size>0?(w=m,a`
    <h2>${F(q.contrastIssuesS,{PH1:w.size})}</h2>
    <ul>
      ${[...w.entries()].map(([e,t])=>function(e,t){console.assert(t.length>0);let s=t[0];for(const e of t)Math.abs(e.contrastRatio)<Math.abs(s.contrastRatio)&&(s=e);const i=s.textColor.asString("hexa"),n=s.backgroundColor.asString("hexa"),r=o.Runtime.experiments.isEnabled("apca"),l=F(q.textColorSOverSBackgroundResults,{PH1:i,PH2:n,PH3:t.length}),d=H(s.backgroundColor.asLegacyColor());return a`<li>
    <button
      title=${l} aria-label=${l}
      data-type="contrast" data-key=${e} data-section="contrast" class="block"
      style=${V({color:i,backgroundColor:n,border:d})}
      jslog=${v.action("css-overview.contrast").track({click:!0})}>
      Text
    </button>
    <div class="block-title">
      ${r?a`
        <div class="contrast-warning hidden" $="apca">
          <span class="threshold-label">${F(q.apca)}</span>
          ${s.thresholdsViolated.apca?Z():ee()}
        </div>`:a`
        <div class="contrast-warning hidden">
          <span class="threshold-label">${F(q.aa)}</span>
          ${s.thresholdsViolated.aa?Z():ee()}
        </div>
        <div class="contrast-warning hidden" $="aaa">
          <span class="threshold-label">${F(q.aaa)}</span>
          ${s.thresholdsViolated.aaa?Z():ee()}
        </div>`}
    </div>
  </li>`}(e,t))}
    </ul>`):""}

    <h2>${F(q.fillColorsS,{PH1:g.length})}</h2>
    <ul>${g.map(e=>K("fill",e))}</ul>

    <h2>${F(q.borderColorsS,{PH1:f.length})}</h2>
    <ul>${f.map(e=>K("border",e))}</ul>`}
              </div>
              <div class="results-section font-info"
                    ${j(e=>{t.revealSection.set("font-info",i.bind(null,e))})}>
                <h1>${F(q.fontInfo)}</h1>
                ${c=e.fontInfo,c.length>0?a`${c.map(({font:e,fontMetrics:t})=>a`
    <section class="font-family">
      <h2>${e}</h2>
      ${function(e,t){return a`
    <div class="font-metric">
      ${t.map(({label:t,values:o})=>a`
        <div>
          <h3>${t}</h3>
          ${G(o,"font-info",`${e}/${t}`)}
        </div>`)}
    </div>`}(e,t)}
    </section>`)}`:a`<div>${F(q.thereAreNoFonts)}</div>`}
              </div>
              <div class="results-section unused-declarations"
                    ${j(e=>{t.revealSection.set("unused-declarations",i.bind(null,e))})}>
                <h1>${F(q.unusedDeclarations)}</h1>
                ${d=e.unusedDeclarations,d.length>0?G(d,"unused-declarations"):a`<div class="horizontally-padded">${F(q.thereAreNoUnusedDeclarations)}</div>`}
              </div>
              <div class="results-section media-queries"
                    ${j(e=>{t.revealSection.set("media-queries",i.bind(null,e))})}>
              <h1>${F(q.mediaQueries)}</h1>
              ${l=e.mediaQueries,l.length>0?G(l,"media-queries"):a`<div class="horizontally-padded">${F(q.thereAreNoMediaQueries)}</div>`}
            </div>
          </div>
          <devtools-widget slot="sidebar" .widgetConfig=${W(e=>{const o=new n.TabbedPane.TabbedPane(e);return t.closeAllTabs=()=>{o.closeTabs(o.tabIds())},t.addTab=(e,t,s,i)=>{o.hasTab(e)||o.appendTab(e,t,s,void 0,void 0,!0,void 0,void 0,i),o.selectTab(e);o.parentWidget().setSidebarMinimized(!1)},o.addEventListener(n.TabbedPane.Events.TabClosed,e=>{if(0===o.tabIds().length){o.parentWidget().setSidebarMinimized(!0)}}),o})}>
          </devtools-widget>
        </devtools-split-view>
      </devtools-split-view>`,s)};function G(e,t,o=""){const s=e.reduce((e,t)=>e+t.nodes.length,0);return a`
      <ul aria-label=${t}>
        ${e.map(({title:e,nodes:i})=>{const n=100*i.length/s,r=F(q.nOccurrences,{n:i.length});return a`<li>
            <div class="title">${e}</div>
            <button data-type=${t} data-path=${o} data-label=${e}
            jslog=${v.action().track({click:!0}).context(`css-overview.${t}`)}
            aria-label=${`${e}: ${r}`}>
              <div class="details">${r}</div>
              <div class="bar-container">
                <div class="bar" style=${V({width:n})}></div>
              </div>
            </button>
          </li>`})}
  </ul>`}function K(e,o){const s=t.Color.parse(o)?.asLegacyColor();return s?a`<li>
    <button title=${o} data-type="color" data-color=${o}
      data-section=${e} class="block"
      style=${V({backgroundColor:o,border:H(s)})}
      jslog=${v.action("css-overview.color").track({click:!0})}>
    </button>
    <div class="block-title color-text">${o}</div>
  </li>`:d}class J extends n.Widget.VBox{onReset=()=>{};#p="summary";#h;#v;#m;#g;#f;#i;#w={revealSection:new Map,closeAllTabs:()=>{},addTab:(e,t,o,s)=>{}};constructor(e,t=Q){super(e),this.#i=t,this.registerRequiredCSS(U),this.#m=new h.Linkifier.Linkifier(20,!0),this.#g=new Map,this.#f=null}set target(e){if(!e)return;const t=e.model(s.CSSModel.CSSModel),o=e.model(s.DOMModel.DOMModel);if(!t||!o)throw new Error("Target must provide CSS and DOM models");this.#h=t,this.#v=o}#b(e,t){const o=this.#w.revealSection.get(e);o&&o(t)}#l(){this.#S(),this.onReset()}#S(){this.#w.closeAllTabs(),this.#g=new Map,J.pushedNodes.clear(),this.#p="summary",this.requestUpdate()}#y(e){if(!e.target)return;const t=e.target.dataset,o=t.type;if(!o||!this.#f)return;let s;switch(o){case"contrast":{const e=t.section,i=t.key;if(!i)return;s={type:o,key:i,nodes:this.#f.textColorContrastIssues.get(i)||[],section:e};break}case"color":{const e=t.color,i=t.section;if(!e)return;let n;switch(i){case"text":n=this.#f.textColors.get(e);break;case"background":n=this.#f.backgroundColors.get(e);break;case"fill":n=this.#f.fillColors.get(e);break;case"border":n=this.#f.borderColors.get(e)}if(!n)return;n=Array.from(n).map(e=>({nodeId:e})),s={type:o,color:e,nodes:n,section:i};break}case"unused-declarations":{const e=t.label;if(!e)return;const i=this.#f.unusedDeclarations.get(e);if(!i)return;s={type:o,declaration:e,nodes:i};break}case"media-queries":{const e=t.label;if(!e)return;const i=this.#f.mediaQueries.get(e);if(!i)return;s={type:o,text:e,nodes:i};break}case"font-info":{const e=t.label;if(!t.path)return;const[i,n]=t.path.split("/");if(!e)return;const r=this.#f.fontInfo.get(i);if(!r)return;const a=r.get(n);if(!a)return;const l=a.get(e);if(!l)return;s={type:o,name:`${e} (${i}, ${n})`,nodes:l.map(e=>({nodeId:e}))};break}default:return}e.consume(),this.#C(s),this.requestUpdate()}performUpdate(){if(!this.#f||!("backgroundColors"in this.#f)||!("textColors"in this.#f))return;const e={elementCount:this.#f.elementCount,backgroundColors:this.#x(this.#f.backgroundColors),textColors:this.#x(this.#f.textColors),textColorContrastIssues:this.#f.textColorContrastIssues,fillColors:this.#x(this.#f.fillColors),borderColors:this.#x(this.#f.borderColors),globalStyleStats:this.#f.globalStyleStats,mediaQueries:this.#$(this.#f.mediaQueries),unusedDeclarations:this.#$(this.#f.unusedDeclarations),fontInfo:this.#k(this.#f.fontInfo),selectedSection:this.#p,onClick:this.#y.bind(this),onSectionSelected:this.#b.bind(this),onReset:this.#l.bind(this)};this.#i(e,this.#w,this.element)}#C(e){let t="",o="";switch(e.type){case"contrast":{const{section:s,key:i}=e;t=`${s}-${i}`,o=F(q.contrastIssues);break}case"color":{const{section:s,color:i}=e;t=`${s}-${i}`,o=`${i.toUpperCase()} (${s})`;break}case"unused-declarations":{const{declaration:s}=e;t=`${s}`,o=`${s}`;break}case"media-queries":{const{text:s}=e;t=`${s}`,o=`${s}`;break}case"font-info":{const{name:s}=e;t=`${s}`,o=`${s}`;break}}let s=this.#g.get(t);if(!s){if(!this.#v||!this.#h)throw new Error("Unable to initialize CSS overview, missing models");s=new Y(this.#v,this.#h,this.#m),s.data=e.nodes,this.#g.set(t,s)}this.#w.addTab(t,o,s,e.type)}#x(e){return Array.from(e.keys()).sort((e,o)=>{const s=t.Color.parse(e)?.asLegacyColor(),i=t.Color.parse(o)?.asLegacyColor();return s&&i?t.ColorUtils.luminance(i.rgba())-t.ColorUtils.luminance(s.rgba()):0})}#k(e){return Array.from(e.entries()).map(([e,t])=>({font:e,fontMetrics:Array.from(t.entries()).map(([e,t])=>({label:e,values:this.#$(t)}))}))}#$(e){return Array.from(e.entries()).sort((e,t)=>{const o=e[1];return t[1].length-o.length}).map(([e,t])=>({title:e,nodes:t}))}set overviewData(e){this.#f=e,this.requestUpdate()}static pushedNodes=new Set}const X=(e,t,s)=>{const{items:i,visibility:n}=e;r(a`
    <div>
      <devtools-data-grid class="element-grid" striped inline
         name=${F(q.cssOverviewElements)}>
        <table>
          <tr>
            ${n.has("node-id")?a`
              <th id="node-id" weight="50" sortable>
                ${F(q.element)}
              </th>`:d}
            ${n.has("declaration")?a`
              <th id="declaration" weight="50" sortable>
                ${F(q.declaration)}
              </th>`:d}
            ${n.has("source-url")?a`
              <th id="source-url" weight="100">
                ${F(q.source)}
              </th>`:d}
            ${n.has("contrast-ratio")?a`
              <th id="contrast-ratio" weight="25" width="150px" sortable fixed>
                ${F(q.contrastRatio)}
              </th>`:d}
          </tr>
          ${i.map(({data:e,link:t,showNode:s})=>a`
            <tr>
              ${n.has("node-id")?function(e,t,o){if(!t)return d;return a`
    <td>
      ${t}
      <devtools-icon part="show-element" name="select-element"
          title=${F(q.showElement)} tabindex="0"
          @click=${()=>o?.()}></devtools-icon>
    </td>`}(0,t,s):d}
              ${n.has("declaration")?function(e){if(!("declaration"in e))throw new Error("Declaration entry is missing a declaration.");return a`<td>${e.declaration}</td>`}(e):d}
              ${n.has("source-url")?function(e,t){if("range"in e&&e.range)return t?a`<td>${t}</td>`:a`<td>${F(q.unableToLink)}</td>`;return a`<td>${F(q.unableToLinkToInlineStyle)}</td>`}(e,t):d}
              ${n.has("contrast-ratio")?function(e){if(!("contrastRatio"in e))throw new Error("Contrast ratio entry is missing a contrast ratio.");const t=o.Runtime.experiments.isEnabled("apca"),s=c.NumberUtilities.floor(e.contrastRatio,2),i=t?s+"%":s,n=H(e.backgroundColor),r=e.textColor.asString(),l=e.backgroundColor.asString();return a`
    <td>
      <div class="contrast-container-in-grid">
          <span class="contrast-preview" style=${V({border:n,color:r,backgroundColor:l})}>Aa</span>
          <span>${i}</span>
          ${t?a`
            <span>${F(q.apca)}</span>${e.thresholdsViolated.apca?Z():ee()}`:a`
            <span>${F(q.aa)}</span>${e.thresholdsViolated.aa?Z():ee()}
            <span>${F(q.aaa)}</span>${e.thresholdsViolated.aaa?Z():ee()}`}
      </div>
    </td>`}(e):d}
            </tr>`)}
        </table>
      </devtools-data-grid>
    </div>`,s)};class Y extends n.Widget.Widget{#v;#h;#m;#f;#i;constructor(e,t,o,s=X){super(),this.#v=e,this.#h=t,this.#m=o,this.#i=s,this.#f=[]}set data(e){this.#f=e,this.requestUpdate()}async performUpdate(){const e=new Set;if(!this.#f.length)return void this.#i({items:[],visibility:e},{},this.element);const[o]=this.#f;let i;if("nodeId"in o&&o.nodeId&&e.add("node-id"),"declaration"in o&&o.declaration&&e.add("declaration"),"sourceURL"in o&&o.sourceURL&&e.add("source-url"),"contrastRatio"in o&&o.contrastRatio&&e.add("contrast-ratio"),"nodeId"in o&&e.has("node-id")){const e=this.#f.reduce((e,t)=>{const o=t.nodeId;return J.pushedNodes.has(o)?e:(J.pushedNodes.add(o),e.add(o))},new Set);i=await this.#v.pushNodesByBackendIdsToFrontend(e)}const n=await Promise.all(this.#f.map(async o=>{let n,r;if("nodeId"in o&&e.has("node-id")){const e=i?.get(o.nodeId)??null;e&&(n=await t.Linkifier.Linkifier.linkify(e),r=()=>e.scrollIntoView())}if("range"in o&&o.range&&o.styleSheetId&&e.has("source-url")){const e=p.TextRange.TextRange.fromObject(o.range),t=this.#h.styleSheetHeaderForId(o.styleSheetId);if(t){const o=t.lineNumberInSource(e.startLine),i=t.columnNumberInSource(e.startLine,e.startColumn),r=new s.CSSModel.CSSLocation(t,o,i);n=this.#m.linkifyCSSLocation(r)}}return{data:o,link:n,showNode:r}}));this.#i({items:n,visibility:e},{},this.element)}}function Z(){return a`
    <devtools-icon name="clear" class="small" style="color:var(--icon-error);"></devtools-icon>`}function ee(){return a`
    <devtools-icon name="checkmark" class="small"
        style="color:var(--icon-checkmark-green);></devtools-icon>`}var te=Object.freeze({__proto__:null,CSSOverviewCompletedView:J,DEFAULT_VIEW:Q,ELEMENT_DETAILS_DEFAULT_VIEW:X,ElementDetailsView:Y}),oe=`@scope to (devtools-widget > *){h1{font-weight:normal}.css-overview-start-view{padding:24px;display:flex;flex-direction:column;background-color:var(--sys-color-cdt-base-container);overflow:auto}.start-capture-wrapper{width:fit-content}.preview-feature{padding:12px 16px;border:1px solid var(--sys-color-neutral-outline);color:var(--sys-color-on-surface);font-size:13px;line-height:20px;border-radius:12px;margin:42px 0;letter-spacing:0.01em}.preview-header{color:var(--sys-color-primary);font-size:13px;line-height:20px;letter-spacing:0.01em;margin:9px 0 14px}.preview-icon{vertical-align:middle}.feedback-prompt{margin-bottom:24px}.feedback-prompt .devtools-link{color:-webkit-link;cursor:pointer;text-decoration:underline}.resources{display:flex;flex-direction:row}.thumbnail-wrapper{width:144px;height:92px;margin-right:20px}.video-doc-header{font-size:13px;line-height:20px;letter-spacing:0.04em;color:var(--sys-color-on-surface);margin-bottom:2px}devtools-feedback-button{align-self:flex-end}.resources .devtools-link{font-size:14px;line-height:22px;letter-spacing:0.04em;text-decoration-line:underline;color:var(--sys-color-primary)}}\n/*# sourceURL=${import.meta.resolve("./cssOverviewStartView.css")} */`;const se={captureOverview:"Capture overview",identifyCSSImprovements:"Identify potential CSS improvements",capturePageCSSOverview:"Capture an overview of your page’s CSS",identifyCSSImprovementsWithExampleIssues:"Identify potential CSS improvements (e.g. low contrast issues, unused declarations, color or font mismatches)",locateAffectedElements:"Locate the affected elements in the Elements panel",quickStartWithCSSOverview:"Quick start: get started with the new CSS overview panel"},ie=e.i18n.registerUIStrings("panels/css_overview/CSSOverviewStartView.ts",se),ne=e.i18n.getLocalizedString.bind(void 0,ie),re="https://g.co/devtools/css-overview-feedback",ae=(e,t,o)=>{r(a`
    <style>${oe}</style>
    <div class="css-overview-start-view">
      <devtools-panel-introduction-steps>
        <span slot="title">${ne(se.identifyCSSImprovements)}</span>
        <span slot="step-1">${ne(se.capturePageCSSOverview)}</span>
        <span slot="step-2">${ne(se.identifyCSSImprovementsWithExampleIssues)}</span>
        <span slot="step-3">${ne(se.locateAffectedElements)}</span>
      </devtools-panel-introduction-steps>
      <div class="start-capture-wrapper">
        <devtools-button
          class="start-capture"
          autofocus
          .variant=${"primary"}
          .jslogContext=${"css-overview.capture-overview"}
          @click=${e.onStartCapture}>
          ${ne(se.captureOverview)}
        </devtools-button>
      </div>
      <devtools-panel-feedback .data=${{feedbackUrl:re,quickStartUrl:"https://developer.chrome.com/docs/devtools/css-overview",quickStartLinkText:ne(se.quickStartWithCSSOverview)}}>
      </devtools-panel-feedback>
      <devtools-feedback-button .data=${{feedbackUrl:re}}>
      </devtools-feedback-button>
    </div>`,o)};class le extends n.Widget.Widget{#i;onStartCapture=()=>{};constructor(e,t=ae){super(e,{useShadowDom:!0,delegatesFocus:!0}),this.#i=t,this.performUpdate()}performUpdate(){this.#i({onStartCapture:this.onStartCapture},{},this.contentElement)}}const{widgetConfig:de}=n.Widget,ce=(e,t,o)=>{r("start"===e.state?a`
      <devtools-widget .widgetConfig=${de(le,{onStartCapture:e.onStartCapture})}></devtools-widget>`:"processing"===e.state?a`
      <devtools-widget .widgetConfig=${de(A,{onCancel:e.onCancel})}></devtools-widget>`:a`
      <devtools-widget .widgetConfig=${de(J,{onReset:e.onReset,overviewData:e.overviewData,target:e.target})}></devtools-widget>`,o)};class ue extends n.Panel.Panel{#I;#M;#A;#T;#U;#O;#R;#_;#E;#L;#z;#D;#P;#i;constructor(e=ce){super("css-overview"),this.#I=s.TargetManager.TargetManager.instance().inspectedURL(),s.TargetManager.TargetManager.instance().addEventListener("InspectedURLChanged",this.#V,this),this.#i=e,s.TargetManager.TargetManager.instance().observeTargets(this),this.#S()}#j(){m.userMetrics.actionTaken(m.UserMetrics.Action.CaptureCssOverviewClicked),this.#W()}#V(){this.#I!==s.TargetManager.TargetManager.instance().inspectedURL()&&(this.#I=s.TargetManager.TargetManager.instance().inspectedURL(),this.#S())}targetAdded(e){e===s.TargetManager.TargetManager.instance().primaryPageTarget()&&(this.#M=e.model(y)??void 0)}targetRemoved(){}#q(){if(!this.#M)throw new Error("Did not retrieve model information yet.");return this.#M}#S(){this.#A=new Map,this.#T=new Map,this.#U=new Map,this.#O=new Map,this.#R=new Map,this.#_=new Map,this.#E=new Map,this.#L=0,this.#z={styleRules:0,inlineStyles:0,externalSheets:0,stats:{type:0,class:0,id:0,universal:0,attribute:0,nonSimple:0}},this.#D=new Map,this.#N()}#N(){this.#P="start",this.performUpdate()}#F(){this.#P="processing",this.performUpdate()}#H(){this.#P="completed",this.performUpdate()}performUpdate(){const e={state:this.#P,onStartCapture:this.#j.bind(this),onCancel:this.#S.bind(this),onReset:this.#S.bind(this),target:this.#M?.target(),overviewData:{backgroundColors:this.#A,textColors:this.#T,textColorContrastIssues:this.#D,fillColors:this.#U,borderColors:this.#O,globalStyleStats:this.#z,fontInfo:this.#R,elementCount:this.#L,mediaQueries:this.#_,unusedDeclarations:this.#E}};this.#i(e,{},this.contentElement)}async#W(){this.#F();const e=this.#q(),[t,{elementCount:o,backgroundColors:s,textColors:i,textColorContrastIssues:n,fillColors:r,borderColors:a,fontInfo:l,unusedDeclarations:d},c]=await Promise.all([e.getGlobalStylesheetStats(),e.getNodeStyleStats(),e.getMediaQueries()]);o&&(this.#L=o),t&&(this.#z=t),c&&(this.#_=c),s&&(this.#A=s),i&&(this.#T=i),n&&(this.#D=n),r&&(this.#U=r),a&&(this.#O=a),l&&(this.#R=l),d&&(this.#E=d),this.#H()}}var pe=Object.freeze({__proto__:null,CSSOverviewPanel:ue,DEFAULT_VIEW:ce});export{te as CSSOverviewCompletedView,C as CSSOverviewModel,pe as CSSOverviewPanel,T as CSSOverviewProcessingView,P as CSSOverviewSidebarPanel,S as CSSOverviewUnusedDeclarations};
//# sourceMappingURL=css_overview.js.map
