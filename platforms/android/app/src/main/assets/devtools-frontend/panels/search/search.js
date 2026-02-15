import*as e from"../../core/common/common.js";import*as s from"../../core/i18n/i18n.js";import*as t from"../../core/platform/platform.js";import*as a from"../../models/text_utils/text_utils.js";import*as r from"../../ui/legacy/legacy.js";import{render as i,html as o,Directives as n}from"../../ui/lit/lit.js";import"../../ui/components/icon_button/icon_button.js";import*as h from"../../core/host/host.js";import*as c from"../../models/workspace/workspace.js";import"../../ui/components/buttons/buttons.js";import*as l from"../../ui/visual_logging/visual_logging.js";var d=`:host{padding:0;margin:0;overflow-y:auto}.tree-outline{padding:0}.tree-outline ol{padding:0}.tree-outline li{height:16px}li.search-result{cursor:pointer;font-size:12px;margin-top:8px;padding:2px 0 2px 4px;overflow-wrap:normal;white-space:pre}li.search-result .tree-element-title{display:flex;width:100%}li.search-result:hover{background-color:var(--sys-color-state-hover-on-subtle)}li.search-result .search-result-file-name{color:var(--sys-color-on-surface);flex:1 1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}li.search-result .search-result-matches-count{color:var(--sys-color-token-subtle);margin:0 8px}li.search-result.expanded .search-result-matches-count{display:none}li.show-more-matches{color:var(--sys-color-on-surface);cursor:pointer;margin:8px 0 0 -4px}li.show-more-matches:hover{text-decoration:underline}li.search-match{margin:2px 0;overflow-wrap:normal;white-space:pre}li.search-match .tree-element-title{display:flex}li.search-match.selected:focus-visible{background:var(--sys-color-tonal-container)}li.search-match::before{display:none}li.search-match .search-match-line-number{color:var(--sys-color-token-subtle);text-align:right;vertical-align:top;word-break:normal;padding:2px 4px 2px 6px;margin-right:5px}.tree-outline .devtools-link{text-decoration:none;display:block;flex:auto}li.search-match .search-match-content{color:var(--sys-color-on-surface)}ol.children.expanded{padding-bottom:4px}li.search-match .link-style.search-match-link{overflow:hidden;text-overflow:ellipsis;margin-left:9px;text-align:left}.search-result-qualifier{color:var(--sys-color-token-subtle)}.search-result-dash{color:var(--sys-color-surface-variant);margin:0 4px}\n/*# sourceURL=${import.meta.resolve("./searchResultsPane.css")} */`;const u={matchesCountS:"Matches Count {PH1}",lineS:"Line {PH1}",showDMore:"Show {PH1} more"},g=s.i18n.registerUIStrings("panels/search/SearchResultsPane.ts",u),p=s.i18n.getLocalizedString.bind(void 0,g),m=(e,s,t)=>{const{results:a,matches:r,expandedResults:n,onSelectMatch:h,onExpandSearchResult:c,onShowMoreMatches:l}=e;i(o`
    <devtools-tree hide-overflow .template=${o`
      <ul role="tree">
        ${a.map(e=>o`
          <li @expand=${s=>((e,{detail:{expanded:s}})=>{s?(n.add(e),c(e)):n.delete(e)})(e,s)}
              role="treeitem"
              class="search-result">
            <style>${d}</style>
            ${f(e)}
            <ul role="group" ?hidden=${!n.has(e)}>
              ${x(e,r,h,l)}
            </ul>
          </li>`)}
      </ul>
    `}></devtools-tree>`,t)},f=e=>o`
    <span class="search-result-file-name">${e.label()}
      <span class="search-result-dash">${"—"}</span>
      <span class="search-result-qualifier">${e.description()}</span>
    </span>
    <span class="search-result-matches-count"
        aria-label=${p(u.matchesCountS,{PH1:e.matchesCount()})}>
        ${e.matchesCount()}
    </span>`,x=(s,t,a,i)=>{const n=t.get(s)??[],h=s.matchesCount()-n.length;return o`
      ${n.map(({lineContent:t,matchRanges:i,resultLabel:n},h)=>o`
        <li role="treeitem" class="search-match" @click=${()=>a(s,h)}
          @keydown=${e=>{"Enter"===e.key&&a(s,h)}}
        >
          <button class="devtools-link text-button link-style search-match-link"
                  jslog="Link; context: search-match; track: click" role="link" tabindex="0"
                  @click=${()=>{e.Revealer.reveal(s.matchRevealable(h))}}>
            <span class="search-match-line-number"
                aria-label=${"number"!=typeof n||isNaN(n)?n:p(u.lineS,{PH1:n})}>
              ${n}
            </span>
            <span class="search-match-content" aria-label="${t} line"
                  ${r.TreeOutline.TreeSearch.highlight(i,void 0)}>
              ${t}
            </span>
          </button>
        </li>`)}
      ${h>0?o`
        <li role="treeitem" class="show-more-matches" @click=${()=>i(s)}>
          ${p(u.showDMore,{PH1:h})}
        </li>`:""}`};class S extends r.Widget.VBox{#e=null;#s=[];#t=!1;#a=new WeakSet;#r=new WeakMap;#i;constructor(e,s=m){super(e,{useShadowDom:!0}),this.#i=s}get searchResults(){return this.#s}set searchResults(e){if(this.#s!==e){if(this.#s.length!==e.length)this.#t=!0;else if(this.#s.length===e.length)for(let s=0;s<this.#s.length;++s)if(this.#s[s]!==e[s]){this.#t=!0;break}this.#t&&(this.#s=e,this.requestUpdate())}}get searchConfig(){return this.#e}set searchConfig(e){this.#e=e,this.requestUpdate()}showAllMatches(){for(const e of this.#s){const s=this.#r.get(e)?.length??0;this.#o(e,s,e.matchesCount()),this.#a.add(e)}this.requestUpdate()}collapseAllResults(){this.#a=new WeakSet,this.requestUpdate()}#n(e){const s=Math.min(e.matchesCount(),y);this.#o(e,0,s),this.requestUpdate()}#o(e,s,r){if(!this.#e)return;const i=this.#e.queries(),o=[];for(let e=0;e<i.length;++e)o.push(t.StringUtilities.createSearchRegex(i[e],!this.#e.ignoreCase(),this.#e.isRegex()));const n=this.#r.get(e)??[];if(this.#r.set(e,n),!(n.length>=r))for(let t=s;t<r;++t){let s=e.matchLineContent(t),r=[];const i=e.matchColumn(t),h=e.matchLength(t);if(void 0!==i&&void 0!==h){const{matchRange:e,lineSegment:t}=R(s,new a.TextRange.SourceRange(i,h));s=t,r=[e]}else{s=s.trim();for(let e=0;e<o.length;++e)r=r.concat(this.#h(s,o[e]));({lineSegment:s,matchRanges:r}=w(s,r))}const c=e.matchLabel(t);n.push({lineContent:s,matchRanges:r,resultLabel:c})}}performUpdate(){if(this.#t){let e=0;for(const s of this.#s)this.#a.has(s)&&(e+=this.#r.get(s)?.length??0);for(const s of this.#s)e<v&&!this.#a.has(s)&&(this.#a.add(s),this.#n(s),e+=this.#r.get(s)?.length??0);this.#t=!1}this.#i({results:this.#s,matches:this.#r,expandedResults:this.#a,onSelectMatch:(s,t)=>{e.Revealer.reveal(s.matchRevealable(t))},onExpandSearchResult:this.#n.bind(this),onShowMoreMatches:this.#c.bind(this)},{},this.contentElement)}#h(e,s){let t;s.lastIndex=0;const r=[];for(;s.lastIndex<e.length&&(t=s.exec(e));)r.push(new a.TextRange.SourceRange(t.index,t[0].length));return r}#c(e){const s=this.#r.get(e)?.length??0;this.#o(e,s,e.matchesCount()),this.requestUpdate()}}const v=200,y=20,b={prefixLength:25,maxLength:1e3};function R(e,s,t=b){const r={...b,...t},i=e.trimStart(),o=e.length-i.length,n=Math.min(s.offset,o),h=Math.max(n,s.offset-r.prefixLength),c=Math.min(e.length,h+r.maxLength),l=h>n?"…":"",d=l+e.substring(h,c),u=s.offset-h+l.length,g=Math.min(s.length,d.length-u);return{lineSegment:d,matchRange:new a.TextRange.SourceRange(u,g)}}function w(e,s){let t=0,r=s;r.length>0&&r[0].offset>20&&(t=15);let i=e.substring(t,1e3+t);return t&&(r=r.map(e=>new a.TextRange.SourceRange(e.offset-t+1,e.length)),i="…"+i),{lineSegment:i,matchRanges:r}}var C=Object.freeze({__proto__:null,DEFAULT_VIEW:m,SearchResultsPane:S,lineSegmentForMatch:R,matchesExpandedByDefault:v,matchesShownAtOnce:y}),M=Object.freeze({__proto__:null}),$=`.search-drawer-header{flex-shrink:0;overflow:hidden;display:inline-flex;min-width:150px;.search-container{border-bottom:1px solid var(--sys-color-divider);display:flex;align-items:center;flex-grow:1}.toolbar-item-search{flex-grow:1;box-shadow:inset 0 0 0 2px transparent;box-sizing:border-box;height:var(--sys-size-9);margin-left:var(--sys-size-3);padding:0 var(--sys-size-2) 0 var(--sys-size-5);border-radius:100px;position:relative;display:flex;align-items:center;background-color:var(--sys-color-cdt-base);&:has(input:focus){box-shadow:inset 0 0 0 2px var(--sys-color-state-focus-ring)}&:has(input:hover)::before{content:"";box-sizing:inherit;height:100%;width:100%;position:absolute;border-radius:100px;left:0;background-color:var(--sys-color-state-hover-on-subtle)}& > devtools-icon{color:var(--sys-color-on-surface-subtle);width:var(--sys-size-8);height:var(--sys-size-8);margin-right:var(--sys-size-3)}& > devtools-button:last-child{margin-right:var(--sys-size-4)}}.search-toolbar-input{appearance:none;color:var(--sys-color-on-surface);background-color:transparent;border:0;z-index:1;flex:1;&::placeholder{color:var(--sys-color-on-surface-subtle)}&:placeholder-shown + .clear-button{display:none}&::-webkit-search-cancel-button{display:none}}}.search-toolbar{background-color:var(--sys-color-cdt-base-container);border-bottom:1px solid var(--sys-color-divider)}.search-toolbar-summary{background-color:var(--sys-color-cdt-base-container);border-top:1px solid var(--sys-color-divider);padding-left:5px;flex:0 0 19px;display:flex;padding-right:5px}.search-results:has(.empty-state) + .search-toolbar-summary{display:none}.search-toolbar-summary .search-message{padding-top:2px;padding-left:1ex;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.search-results{overflow-y:auto;display:flex;flex:auto}.search-results > div{flex:auto}\n/*# sourceURL=${import.meta.resolve("./searchView.css")} */`;const k={find:"Find",enableCaseSensitive:"Enable case sensitive search",disableCaseSensitive:"Disable case sensitive search",enableRegularExpression:"Enable regular expressions",disableRegularExpression:"Disable regular expressions",refresh:"Refresh",clearInput:"Clear",clear:"Clear search",indexing:"Indexing…",searching:"Searching…",indexingInterrupted:"Indexing interrupted.",foundMatchingLineInFile:"Found 1 matching line in 1 file.",foundDMatchingLinesInFile:"Found {PH1} matching lines in 1 file.",foundDMatchingLinesInDFiles:"Found {PH1} matching lines in {PH2} files.",noMatchesFound:"No matches found",nothingMatchedTheQuery:"Nothing matched your search query",searchFinished:"Search finished.",searchInterrupted:"Search interrupted.",typeAndPressSToSearch:"Type and press {PH1} to search",noSearchResult:"No search results"},I=s.i18n.registerUIStrings("panels/search/SearchView.ts",k),U=s.i18n.getLocalizedString.bind(void 0,I),{ref:P,live:E}=n,{widgetConfig:L,widgetRef:q}=r.Widget,K=(e,s,t)=>{const{query:a,matchCase:n,isRegex:h,searchConfig:c,searchMessage:d,searchResults:u,searchResultsMessage:g,progress:p,onQueryChange:m,onQueryKeyDown:f,onPanelKeyDown:x,onClearSearchInput:v,onToggleRegex:y,onToggleMatchCase:b,onRefresh:R,onClearSearch:w}=e;let C="",M="";a?p?C=U(k.searching):u.length||(C=U(k.noMatchesFound),M=U(k.nothingMatchedTheQuery)):(C=U(k.noSearchResult),M=U(k.typeAndPressSToSearch,{PH1:r.KeyboardShortcut.KeyboardShortcut.shortcutToString(r.KeyboardShortcut.Keys.Enter)})),i(o`
      <style>${r.inspectorCommonStyles}</style>
      <style>${$}</style>
      <div class="search-drawer-header" @keydown=${x}>
        <div class="search-container">
          <div class="toolbar-item-search">
            <devtools-icon name="search"></devtools-icon>
            <input type="text"
                class="search-toolbar-input"
                placeholder=${U(k.find)}
                jslog=${l.textField().track({change:!0,keydown:"ArrowUp|ArrowDown|Enter"})}
                aria-label=${U(k.find)}
                size="100" results="0"
                .value=${E(a)}
                @keydown=${f}
                @input=${e=>m(e.target.value)}
                ${P(e=>{s.focusSearchInput=()=>{e instanceof HTMLInputElement&&(e.focus(),e.select())}})}>
            <devtools-button class="clear-button" tabindex="-1"
                @click=${v}
                .data=${{variant:"icon",iconName:"cross-circle-filled",jslogContext:"clear-input",size:"SMALL",title:U(k.clearInput)}}
            ></devtools-button>
            <devtools-button @click=${y} .data=${{variant:"icon_toggle",iconName:"regular-expression",toggledIconName:"regular-expression",toggleType:"primary-toggle",size:"SMALL",toggled:h,title:U(h?k.disableRegularExpression:k.enableRegularExpression),jslogContext:"regular-expression"}}
              class="regex-button"
            ></devtools-button>
            <devtools-button @click=${b} .data=${{variant:"icon_toggle",iconName:"match-case",toggledIconName:"match-case",toggleType:"primary-toggle",size:"SMALL",toggled:n,title:U(n?k.disableCaseSensitive:k.enableCaseSensitive),jslogContext:"match-case"}}
              class="match-case-button"
            ></devtools-button>
          </div>
        </div>
        <devtools-toolbar class="search-toolbar" jslog=${l.toolbar()}>
          <devtools-button title=${U(k.refresh)} @click=${R}
              .data=${{variant:"toolbar",iconName:"refresh",jslogContext:"search.refresh"}}></devtools-button>
          <devtools-button title=${U(k.clear)} @click=${w}
              .data=${{variant:"toolbar",iconName:"clear",jslogContext:"search.clear"}}></devtools-button>
        </devtools-toolbar>
      </div>
      <div class="search-results" @keydown=${x}>
        ${u.length?o`<devtools-widget .widgetConfig=${L(S,{searchResults:u,searchConfig:c})}
            ${q(S,e=>{s.showAllMatches=()=>{e.showAllMatches()},s.collapseAllResults=()=>{e.collapseAllResults()}})}>
            </devtools-widget>`:o`<devtools-widget .widgetConfig=${L(r.EmptyWidget.EmptyWidget,{header:C,text:M})}>
                  </devtools-widget>`}
      </div>
      <div class="search-toolbar-summary" @keydown=${x}>
        <div class="search-message">${d}</div>
        <div class="flex-centered">
          ${p?o`
            <devtools-progress .title=${p.title??""}
                               .worked=${p.worked} .totalWork=${p.totalWork}>
            </devtools-progress>`:""}
        </div>
        <div class="search-message">${g}</div>
      </div>`,t)};class A extends r.Widget.VBox{#i;#l=()=>{};#d=()=>{};#u=()=>{};#g;#p;#m;#f;#x;#S;#e;#v;#y;#b;#R=!1;#w=!1;#C="";#M="";#$;#k;#s=[];constructor(s,t=K){super({jslog:`${l.panel("search").track({resize:!0})}`,useShadowDom:!0}),this.#i=t,this.setMinimumSize(0,40),this.#g=!1,this.#p=1,this.#b="",this.#m=0,this.#f=0,this.#x=0,this.#S=null,this.#e=null,this.#v=null,this.#y=null,this.#$=e.Settings.Settings.instance().createLocalSetting(s+"-search-config",new c.SearchConfig.SearchConfig("",!0,!1).toPlainObject()),this.performUpdate(),this.#I(),this.performUpdate(),this.#k=null}performUpdate(){const e={query:this.#b,matchCase:this.#R,isRegex:this.#w,searchConfig:this.#e,searchMessage:this.#C,searchResults:this.#s.filter(e=>e.matchesCount()),searchResultsMessage:this.#M,progress:this.#y,onQueryChange:e=>{this.#b=e},onQueryKeyDown:this.#U.bind(this),onPanelKeyDown:this.#P.bind(this),onClearSearchInput:this.#E.bind(this),onToggleRegex:this.#L.bind(this),onToggleMatchCase:this.#q.bind(this),onRefresh:this.#K.bind(this),onClearSearch:this.#A.bind(this)},s=this,t={set focusSearchInput(e){s.#l=e},set showAllMatches(e){s.#d=e},set collapseAllResults(e){s.#u=e}};this.#i(e,t,this.contentElement)}#L(){this.#w=!this.#w,this.performUpdate()}#q(){this.#R=!this.#R,this.performUpdate()}#T(){return new c.SearchConfig.SearchConfig(this.#b,!this.#R,this.#w)}toggle(e,s){this.#b=e,this.requestUpdate(),this.updateComplete.then(()=>{this.focus()}),this.#j(),s?this.#K():this.#D()}createScope(){throw new Error("Not implemented")}#j(){this.#k=this.createScope()}#F(){if(!this.#y)return;const e=!this.#y.canceled;if(this.#y=null,this.#g=!1,this.#C=e?"":U(k.indexingInterrupted),e||(this.#v=null),this.performUpdate(),!this.#v)return;const s=this.#v;this.#v=null,this.#z(s)}#D(){this.#g=!0,this.#y&&(this.#y.done=!0),this.#y=new e.Progress.ProgressProxy(new e.Progress.Progress,this.#F.bind(this),this.requestUpdate.bind(this)),this.#C=U(k.indexing),this.performUpdate(),this.#k&&this.#k.performIndexing(this.#y)}#E(){this.#b="",this.requestUpdate(),this.#_(),this.focus()}#H(e,s){e===this.#p&&this.#y&&(this.#y?.canceled?this.#F():(this.#s.push(s),this.#W(s),this.requestUpdate()))}#N(e,s){e===this.#p&&this.#y&&(this.#y=null,this.#V(s),r.ARIAUtils.LiveAnnouncer.alert(this.#C+" "+this.#M))}#z(s){this.#e=s,this.#y&&(this.#y.done=!0),this.#y=new e.Progress.ProgressProxy(new e.Progress.Progress,void 0,this.requestUpdate.bind(this)),this.#O(),this.#k&&this.#k.performSearch(s,this.#y,this.#H.bind(this,this.#p),this.#N.bind(this,this.#p))}#Q(){this.#B(),this.#s=[],this.#C="",this.#M="",this.performUpdate()}#B(){this.#y&&!this.#g&&(this.#y.canceled=!0),this.#k&&this.#k.stopSearch()}#O(){this.#m=0,this.#f=0,this.#s=[],this.#x=0,this.#S||(this.#S=new r.EmptyWidget.EmptyWidget(U(k.searching),"")),this.#C=U(k.searching),this.performUpdate(),this.#G()}#G(){this.#m&&this.#f?1===this.#m&&1===this.#x?this.#M=U(k.foundMatchingLineInFile):this.#m>1&&1===this.#x?this.#M=U(k.foundDMatchingLinesInFile,{PH1:this.#m}):this.#M=U(k.foundDMatchingLinesInDFiles,{PH1:this.#m,PH2:this.#x}):this.#M="",this.performUpdate()}#W(e){const s=e.matchesCount();this.#m+=s,this.#f++,s&&this.#x++,this.#G()}#V(e){this.#C=U(e?k.searchFinished:k.searchInterrupted),this.requestUpdate()}focus(){this.#l()}willHide(){super.willHide(),this.#B()}#U(e){if(this.#_(),e.keyCode===r.KeyboardShortcut.Keys.Enter.code)this.#K()}#P(e){const s=h.Platform.isMac(),t=s&&e.metaKey&&!e.ctrlKey&&e.altKey&&"BracketRight"===e.code,a=!s&&e.ctrlKey&&!e.metaKey&&e.shiftKey&&"BracketRight"===e.code,r=s&&e.metaKey&&!e.ctrlKey&&e.altKey&&"BracketLeft"===e.code,i=!s&&e.ctrlKey&&!e.metaKey&&e.shiftKey&&"BracketLeft"===e.code;t||a?(this.#d(),l.logKeyDown(e.currentTarget,e,"show-all-matches")):(r||i)&&(this.#u(),l.logKeyDown(e.currentTarget,e,"collapse-all-results"))}#_(){this.#$.set(this.#T().toPlainObject())}#I(){const e=c.SearchConfig.SearchConfig.fromPlainObject(this.#$.get());this.#b=e.query(),this.#R=!e.ignoreCase(),this.#w=e.isRegex(),this.requestUpdate()}#K(){const e=this.#T();e.query()?.length&&(this.#Q(),++this.#p,this.#j(),this.#g||this.#D(),this.#v=e)}#A(){this.#Q(),this.#E()}}var T=Object.freeze({__proto__:null,DEFAULT_VIEW:K,SearchView:A});export{C as SearchResultsPane,M as SearchScope,T as SearchView};
//# sourceMappingURL=search.js.map
