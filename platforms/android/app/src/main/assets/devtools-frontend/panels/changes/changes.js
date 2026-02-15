import*as e from"../../ui/legacy/legacy.js";import*as i from"../../core/i18n/i18n.js";import*as s from"../../models/workspace_diff/workspace_diff.js";import*as o from"../../ui/lit/lit.js";import*as t from"../../ui/visual_logging/visual_logging.js";import*as r from"../../core/common/common.js";import*as d from"../../models/workspace/workspace.js";import*as n from"../snippets/snippets.js";import*as a from"../../models/persistence/persistence.js";import"../../ui/components/buttons/buttons.js";import*as c from"../utils/utils.js";var l=`@scope to (devtools-widget > *){.tree-outline li{min-height:20px}devtools-icon{color:var(--icon-file-default);margin-right:var(--sys-size-4)}.navigator-sm-script-tree-item devtools-icon,\n.navigator-script-tree-item devtools-icon,\n.navigator-snippet-tree-item devtools-icon{color:var(--icon-file-script)}.navigator-sm-stylesheet-tree-item devtools-icon,\n.navigator-stylesheet-tree-item devtools-icon{color:var(--icon-file-styles)}.navigator-image-tree-item devtools-icon{color:var(--icon-file-image)}.navigator-font-tree-item devtools-icon{color:var(--icon-file-font)}.tree-outline li:hover:not(.selected) .selection{display:block;& devtools-icon{color:var(--icon-default-hover)}}@media (forced-colors: active){li,\n  devtools-icon{forced-color-adjust:none;color:ButtonText!important}}}\n/*# sourceURL=${import.meta.resolve("./changesSidebar.css")} */`;const f={sFromSourceMap:"{PH1} (from source map)"},u=i.i18n.registerUIStrings("panels/changes/ChangesSidebar.ts",f),p=i.i18n.getLocalizedString.bind(void 0,u),{render:h,html:m,Directives:{ref:v}}=o,g=(e,i,s)=>{const o=new WeakMap;h(m`<devtools-tree
             @selected=${i=>e.onSelect(o.get(i.detail)??null)}
             navigation-variant
             hide-overflow .template=${m`
               <ul role="tree">
                 ${e.sourceCodes.values().map(i=>m`
                   <li
                     role="treeitem"
                     ${v(e=>e instanceof HTMLLIElement&&o.set(e,i))}
                     ?selected=${i===e.selectedSourceCode}>
                       <style>${l}</style>
                       <div class=${"navigator-"+i.contentType().name()+"-tree-item"}>
                         <devtools-icon name=${(e=>n.ScriptSnippetFileSystem.isSnippetsUISourceCode(e)?"snippet":"document")(i)}></devtools-icon>
                         <span title=${(e=>e.contentType().isFromSourceMap()?p(f.sFromSourceMap,{PH1:e.displayName()}):e.url())(i)}>
                           <span ?hidden=${!i.isDirty()}>*</span>
                           ${i.displayName()}
                         </span>
                       </div>
                   </li>`)}
               </ul>`}></devtools-tree>`,s)};class C extends(r.ObjectWrapper.eventMixin(e.Widget.Widget)){#e=null;#i;#s=new Set;#o=null;constructor(e,i=g){super(e,{jslog:`${t.pane("sidebar").track({resize:!0})}`}),this.#i=i}set workspaceDiff(e){this.#e&&(this.#e.modifiedUISourceCodes().forEach(this.#t.bind(this)),this.#e.removeEventListener("ModifiedStatusChanged",this.uiSourceCodeModifiedStatusChanged,this)),this.#e=e,this.#e.modifiedUISourceCodes().forEach(this.#r.bind(this)),this.#e.addEventListener("ModifiedStatusChanged",this.uiSourceCodeModifiedStatusChanged,this),this.requestUpdate()}selectedUISourceCode(){return this.#o}performUpdate(){const e={onSelect:e=>this.#d(e),sourceCodes:this.#s,selectedSourceCode:this.#o};this.#i(e,{},this.contentElement)}#d(e){this.#o=e,this.dispatchEventToListeners("SelectedUISourceCodeChanged"),this.requestUpdate()}#r(e){this.#s.add(e),e.addEventListener(d.UISourceCode.Events.TitleChanged,this.requestUpdate,this),e.addEventListener(d.UISourceCode.Events.WorkingCopyChanged,this.requestUpdate,this),e.addEventListener(d.UISourceCode.Events.WorkingCopyCommitted,this.requestUpdate,this),this.requestUpdate()}#t(e){if(e.removeEventListener(d.UISourceCode.Events.TitleChanged,this.requestUpdate,this),e.removeEventListener(d.UISourceCode.Events.WorkingCopyChanged,this.requestUpdate,this),e.removeEventListener(d.UISourceCode.Events.WorkingCopyCommitted,this.requestUpdate,this),e===this.#o){let i;for(const s of this.#s.values()){if(s===e)break;i=s}this.#s.delete(e),this.#d(i??this.#s.values().next().value??null)}else this.#s.delete(e);this.requestUpdate()}uiSourceCodeModifiedStatusChanged(e){const{isModified:i,uiSourceCode:s}=e.data;i?this.#r(s):this.#t(s),this.requestUpdate()}}var w=Object.freeze({__proto__:null,ChangesSidebar:C,DEFAULT_VIEW:g}),y=`[slot="main"]{flex-direction:column;display:flex}[slot="sidebar"]{overflow:auto}.diff-container{flex:1;overflow:auto;& .widget:first-child{height:100%}.combined-diff-view{padding-inline:var(--sys-size-6);padding-block:var(--sys-size-4)}}:focus.selected{background-color:var(--sys-color-tonal-container);color:var(--sys-color-on-tonal-container)}.changes-toolbar{background-color:var(--sys-color-cdt-base-container);border-top:1px solid var(--sys-color-divider)}[hidden]{display:none!important}\n/*# sourceURL=${import.meta.resolve("./changesView.css")} */`,S=`.combined-diff-view{display:flex;flex-direction:column;gap:var(--sys-size-5);height:100%;background-color:var(--sys-color-surface3);overflow:auto;details{flex-shrink:0;border-radius:12px;&.selected{outline:var(--sys-size-2) solid var(--sys-color-divider-on-tonal-container)}summary{background-color:var(--sys-color-surface1);border-radius:var(--sys-shape-corner-medium-small);height:var(--sys-size-12);padding:var(--sys-size-3);font:var(--sys-typescale-body5-bold);display:flex;justify-content:space-between;gap:var(--sys-size-2);&:focus-visible{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring);outline-offset:calc(-1 * var(--sys-size-2))}.summary-left{display:flex;align-items:center;min-width:0;flex-grow:0;.file-name-link{margin-left:var(--sys-size-5);width:100%;text-overflow:ellipsis;overflow:hidden;text-wrap-mode:nowrap;border:none;background:none;font:inherit;padding:0;&:hover{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer}&:focus-visible{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring);outline-offset:var(--sys-size-2)}}devtools-icon{transform:rotate(270deg)}devtools-file-source-icon{height:var(--sys-size-8);width:var(--sys-size-8);flex-shrink:0}}.summary-right{flex-shrink:0;display:flex;align-items:center;gap:var(--sys-size-2);padding-right:var(--sys-size-4);.copied{font:var(--sys-typescale-body5-regular)}}&::marker{content:''}}.diff-view-container{overflow-x:auto;background-color:var(--sys-color-cdt-base-container);border-bottom-left-radius:var(--sys-shape-corner-medium-small);border-bottom-right-radius:var(--sys-shape-corner-medium-small)}&[open]{summary{border-radius:0;border-top-left-radius:var(--sys-shape-corner-medium-small);border-top-right-radius:var(--sys-shape-corner-medium-small);devtools-icon{transform:rotate(0deg)}}}}}\n/*# sourceURL=${import.meta.resolve("./combinedDiffView.css")} */`;const{html:U,Directives:{classMap:b}}=o,k={copied:"Copied to clipboard",copyFile:"Copy file {PH1} to clipboard"},D=i.i18n.registerUIStrings("panels/changes/CombinedDiffView.ts",k),I=i.i18n.getLocalizedString.bind(void 0,D);const $=(e,i,s)=>{o.render(U`
      <div class="combined-diff-view">
        ${e.singleDiffViewInputs.map(e=>function(e){const{fileName:i,fileUrl:s,mimeType:r,icon:d,diff:n,copied:a,selectedFileUrl:c,onCopy:l,onFileNameClick:f}=e,u=b({selected:c===s});return U`
    <details open class=${u}>
      <summary>
        <div class="summary-left">
          <devtools-icon class="drop-down-icon" name="arrow-drop-down"></devtools-icon>
          ${d}
          <button class="file-name-link" jslog=${t.action("jump-to-file")} @click=${()=>f(s)}>${i}</button>
        </div>
        <div class="summary-right">
          <devtools-button
            .title=${I(k.copyFile,{PH1:i})}
            .size=${"SMALL"}
            .iconName=${"copy"}
            .jslogContext=${"combined-diff-view.copy"}
            .variant=${"icon"}
            @click=${()=>l(s)}
          ></devtools-button>
          ${a?U`<span class="copied">${I(k.copied)}</span>`:o.nothing}
        </div>
      </summary>
      <div class="diff-view-container">
        <devtools-diff-view
          .data=${{diff:n,mimeType:r}}>
        </devtools-diff-view>
      </div>
    </details>
  `}(e))}
      </div>
    `,s)};class x extends e.Widget.Widget{ignoredUrls=[];#n;#e;#a=[];#c={};#i;#l={};constructor(e,i=$){super(e),this.registerRequiredCSS(S),this.#i=i}wasShown(){super.wasShown(),this.#e?.addEventListener("ModifiedStatusChanged",this.#f,this),this.#u()}willHide(){super.willHide(),this.#e?.removeEventListener("ModifiedStatusChanged",this.#f,this)}set workspaceDiff(e){this.#e=e,this.#u()}set selectedFileUrl(e){this.#n=e,this.requestUpdate(),this.updateComplete.then(()=>{this.#l.scrollToSelectedDiff?.()})}async#p(i){const s=this.#a.find(e=>e.url()===i);if(!s)return;const o=s.workingCopyContentData();o.isTextContent&&(e.UIUtils.copyTextToClipboard(o.text,I(k.copied)),this.#c[i]=!0,this.requestUpdate(),setTimeout(()=>{delete this.#c[i],this.requestUpdate()},1e3))}#h(e){const i=this.#a.find(i=>i.url()===e);r.Revealer.reveal(i)}async#u(){if(!this.#e)return;const e=this.#a,i=this.#e.modifiedUISourceCodes();e.filter(e=>!i.includes(e)).forEach(e=>this.#e?.unsubscribeFromDiffChange(e,this.requestUpdate,this));i.filter(i=>!e.includes(i)).forEach(e=>this.#e?.subscribeToDiffChange(e,this.requestUpdate,this)),this.#a=i,this.isShowing()&&this.requestUpdate()}async#f(){this.#e&&await this.#u()}async performUpdate(){const e=(await Promise.all(this.#a.map(async e=>{for(const i of this.ignoredUrls)if(e.url().startsWith(i))return;const i=await(this.#e?.requestDiff(e));return{diff:i?.diff??[],uiSourceCode:e}}))).filter(e=>!!e).map(({uiSourceCode:e,diff:i})=>{let s=e.fullDisplayName();const o=a.Persistence.PersistenceImpl.instance().fileSystem(e);return o&&(s=[o.project().displayName(),...a.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding.relativePath(o)].join("/")),{diff:i,fileName:`${e.isDirty()?"*":""}${s}`,fileUrl:e.url(),mimeType:e.mimeType(),icon:c.PanelUtils.getIconForSourceFile(e),copied:this.#c[e.url()],selectedFileUrl:this.#n,onCopy:this.#p.bind(this),onFileNameClick:this.#h.bind(this)}});this.#i({singleDiffViewInputs:e},this.#l,this.contentElement)}}var E=Object.freeze({__proto__:null,CombinedDiffView:x});const F={noChanges:"No changes yet",changesViewDescription:"On this page you can track code changes made within DevTools."},z=i.i18n.registerUIStrings("panels/changes/ChangesView.ts",F),L=i.i18n.getLocalizedString.bind(void 0,z),{render:M,html:j}=o,q=(i,s,o)=>{M(j`
      <style>${y}</style>
      <devtools-split-view direction=column>
        <div class=vbox slot="main">
          <devtools-widget
            ?hidden=${i.workspaceDiff.modifiedUISourceCodes().length>0}
            .widgetConfig=${e.Widget.widgetConfig(e.EmptyWidget.EmptyWidget,{header:L(F.noChanges),text:L(F.changesViewDescription),link:"https://developer.chrome.com/docs/devtools/changes"})}>
          </devtools-widget>
          <div class=diff-container role=tabpanel ?hidden=${0===i.workspaceDiff.modifiedUISourceCodes().length}>
            <devtools-widget .widgetConfig=${e.Widget.widgetConfig(x,{selectedFileUrl:i.selectedSourceCode?.url(),workspaceDiff:i.workspaceDiff})}></devtools-widget>
          </div>
        </div>
        <devtools-widget
          slot="sidebar"
          .widgetConfig=${e.Widget.widgetConfig(C,{workspaceDiff:i.workspaceDiff})}
          ${e.Widget.widgetRef(C,e=>{e.addEventListener("SelectedUISourceCodeChanged",()=>i.onSelect(e.selectedUISourceCode()))})}>
        </devtools-widget>
      </devtools-split-view>`,o)};class W extends e.Widget.VBox{#e;#o=null;#i;constructor(e,i=q){super(e,{jslog:`${t.panel("changes").track({resize:!0})}`,useShadowDom:!0}),this.#e=s.WorkspaceDiff.workspaceDiff(),this.#i=i,this.requestUpdate()}performUpdate(){this.#i({workspaceDiff:this.#e,selectedSourceCode:this.#o,onSelect:e=>{this.#o=e,this.requestUpdate()}},{},this.contentElement)}wasShown(){e.Context.Context.instance().setFlavor(W,this),super.wasShown(),this.requestUpdate(),this.#e.addEventListener("ModifiedStatusChanged",this.requestUpdate,this)}willHide(){super.willHide(),e.Context.Context.instance().setFlavor(W,null),this.#e.removeEventListener("ModifiedStatusChanged",this.requestUpdate,this)}}var T=Object.freeze({__proto__:null,ChangesView:W,DEFAULT_VIEW:q});export{w as ChangesSidebar,T as ChangesView,E as CombinedDiffView};
//# sourceMappingURL=changes.js.map
