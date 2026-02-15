import*as e from"../../ui/legacy/legacy.js";import*as t from"../../core/common/common.js";import*as s from"../../core/host/host.js";import*as i from"../../core/i18n/i18n.js";import*as o from"../../core/platform/platform.js";import*as n from"../../core/root/root.js";import*as a from"../../core/sdk/sdk.js";import*as r from"../../models/ai_assistance/ai_assistance.js";import*as l from"../../models/badges/badges.js";import*as c from"../../models/text_utils/text_utils.js";import*as d from"../../models/workspace/workspace.js";import"../../ui/components/buttons/buttons.js";import*as h from"../../ui/components/snackbars/snackbars.js";import*as p from"../../ui/lit/lit.js";import{render as u,html as g,nothing as m,Directives as v}from"../../ui/lit/lit.js";import*as y from"../../ui/visual_logging/visual_logging.js";import*as f from"../network/forward/forward.js";import*as b from"../network/network.js";import*as w from"../timeline/timeline.js";import"../../ui/components/spinners/spinners.js";import*as k from"../elements/elements.js";import*as C from"../utils/utils.js";import*as x from"../../third_party/marked/marked.js";import*as S from"../../ui/i18n/i18n.js";import*as A from"../../ui/components/markdown_view/markdown_view.js";import*as I from"../../models/persistence/persistence.js";import*as T from"../../models/workspace_diff/workspace_diff.js";import*as $ from"../changes/changes.js";import*as j from"../common/common.js";import*as R from"../../models/geometry/geometry.js";import*as F from"../../ui/components/input/input.js";import*as E from"../../models/trace/trace.js";var M=`.toolbar-container{display:flex;background-color:var(--sys-color-cdt-base-container);border-bottom:1px solid var(--sys-color-divider);flex:0 0 auto;justify-content:space-between}.ai-assistance-view-container{display:flex;flex-direction:column;width:100%;height:100%;align-items:center;overflow:hidden;& .explore{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}}.toolbar-feedback-link{color:var(--sys-color-primary);margin:0 var(--sys-size-3);height:auto;font-size:var(--sys-typescale-body4-size)}\n/*# sourceURL=${import.meta.resolve("././aiAssistancePanel.css")} */`,L=`@scope to (devtools-widget > *){:scope{width:100%;box-shadow:none}.dialog-header{margin:var(--sys-size-6) var(--sys-size-8) var(--sys-size-5);font:var(--sys-typescale-headline5)}.buttons{margin:var(--sys-size-6) var(--sys-size-8) var(--sys-size-8);display:flex;justify-content:flex-start;gap:var(--sys-size-5)}.main-content{color:var(--sys-color-on-surface-subtle);margin:0 var(--sys-size-8);line-height:18px}.add-folder-button{margin-left:auto}ul{list-style-type:none;padding:0;margin:var(--sys-size-6) 0 var(--sys-size-4) 0;max-height:var(--sys-size-20);overflow-y:auto}li{display:flex;align-items:center;color:var(--sys-color-on-surface-subtle);border-radius:0 var(--sys-shape-corner-full) var(--sys-shape-corner-full) 0;height:var(--sys-size-10);margin:0 var(--sys-size-8);padding-left:var(--sys-size-9)}li:hover, li.selected{background-color:var(--sys-color-state-hover-on-subtle)}li:focus{background-color:var(--app-color-navigation-drawer-background-selected)}.folder-icon{color:var(--icon-file-default);margin-right:var(--sys-size-4)}li.selected .folder-icon{color:var(--icon-file-authored)}.select-project-root{margin-bottom:var(--sys-size-6)}.theme-with-dark-background, :host-context(.theme-with-dark-background){li:focus{color:var(--app-color-navigation-drawer-label-selected);background-color:var(--app-color-navigation-drawer-background-selected);& .folder-icon{color:var(--app-color-navigation-drawer-label-selected)}}}.ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}\n/*# sourceURL=${import.meta.resolve("././selectWorkspaceDialog.css")} */`;const P="Select folder",z="Select a folder to apply changes",D="Cancel",N="Select",O="Add folder",U="Source code from the selected folder is sent to Google. This data may be seen by human reviewers to improve this feature.",q="Source code from the selected folder is sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",V=i.i18n.lockedString,W=(e,t,s)=>{const i=e.folders.length>0;u(g`
      <style>${L}</style>
      <h2 class="dialog-header">${V(P)}</h2>
      <div class="main-content">
        <div class="select-project-root">${e.selectProjectRootText}</div>
        ${e.showAutomaticWorkspaceNudge?g`
          <!-- Hardcoding, because there is no 'getFormatLocalizedString' equivalent for 'lockedString' -->
          <div>
            Tip: provide a
            <x-link
              class="devtools-link"
              href="https://goo.gle/devtools-automatic-workspace-folders"
              jslog=${y.link().track({click:!0,keydown:"Enter|Space"}).context("automatic-workspaces-documentation")}
            >com.chrome.devtools.json</x-link>
            file to automatically connect your project to DevTools.
          </div>
        `:m}
      </div>
      ${i?g`
        <ul role="listbox" aria-label=${V(P)}
          aria-activedescendant=${e.folders.length>0?`option-${e.selectedIndex}`:""}>
          ${e.folders.map((t,s)=>g`
              <li
                id=${`option-${s}`}
                @mousedown=${()=>e.onProjectSelected(s)}
                @keydown=${e.onListItemKeyDown}
                class=${s===e.selectedIndex?"selected":""}
                aria-selected=${s===e.selectedIndex?"true":"false"}
                title=${t.path}
                role="option"
                tabindex=${s===e.selectedIndex?"0":"-1"}
              >
                <devtools-icon class="folder-icon" name="folder"></devtools-icon>
                <span class="ellipsis">${t.name}</span>
              </li>`)}
        </ul>
      `:m}
      <div class="buttons">
        <devtools-button
          title=${V(D)}
          aria-label="Cancel"
          .jslogContext=${"cancel"}
          @click=${e.onCancelButtonClick}
          .variant=${"outlined"}>${V(D)}</devtools-button>
        <devtools-button
          class="add-folder-button"
          title=${V(O)}
          aria-label="Add folder"
          .iconName=${"plus"}
          .jslogContext=${"add-folder"}
          @click=${e.onAddFolderButtonClick}
          .variant=${i?"tonal":"primary"}>${V(O)}</devtools-button>
        ${i?g`
          <devtools-button
            title=${V(N)}
            aria-label="Select"
            @click=${e.onSelectButtonClick}
            .jslogContext=${"select"}
            .variant=${"primary"}>${V(N)}</devtools-button>
        `:m}
      </div>
    `,s)};class B extends e.Widget.VBox{#e;#t=d.Workspace.WorkspaceImpl.instance();#s=0;#i;#o;#n=I.AutomaticFileSystemManager.AutomaticFileSystemManager.instance();#a=[];constructor(e,t){super(),this.#i=e.onProjectSelected,this.#o=e.dialog,this.#r(),e.currentProject&&(this.#s=Math.max(0,this.#a.findIndex(t=>t.project===e.currentProject))),this.#e=t??W,this.requestUpdate(),this.updateComplete.then(()=>{this.contentElement?.querySelector(".selected")?.focus()})}wasShown(){super.wasShown(),this.#t.addEventListener(d.Workspace.Events.ProjectAdded,this.#l,this),this.#t.addEventListener(d.Workspace.Events.ProjectRemoved,this.#c,this)}willHide(){super.willHide(),this.#t.removeEventListener(d.Workspace.Events.ProjectAdded,this.#l,this),this.#t.removeEventListener(d.Workspace.Events.ProjectRemoved,this.#c,this)}#d(e){switch(e.key){case"ArrowDown":{e.preventDefault(),this.#s=Math.min(this.#s+1,this.#a.length-1);const t=this.contentElement.querySelectorAll("li")[this.#s];t?.scrollIntoView({block:"nearest",inline:"nearest"}),t?.focus({preventScroll:!0}),this.requestUpdate();break}case"ArrowUp":{e.preventDefault(),this.#s=Math.max(this.#s-1,0);const t=this.contentElement.querySelectorAll("li")[this.#s];t?.scrollIntoView({block:"nearest",inline:"nearest"}),t?.focus({preventScroll:!0}),this.requestUpdate();break}case"Enter":e.preventDefault(),this.#h()}}#h(){const e=this.#a[this.#s];e.project?(this.#o.hide(),this.#i(e.project)):this.#p()}performUpdate(){const e=n.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===n.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING,t={folders:this.#a,selectedIndex:this.#s,selectProjectRootText:V(e?q:U),showAutomaticWorkspaceNudge:null===this.#n.automaticFileSystem&&"available"===this.#n.availability,onProjectSelected:e=>{this.#s=e,this.requestUpdate()},onSelectButtonClick:this.#h.bind(this),onCancelButtonClick:()=>{this.#o.hide()},onAddFolderButtonClick:()=>{this.#u()},onListItemKeyDown:this.#d.bind(this)};this.#e(t,void 0,this.contentElement)}async#u(){await I.IsolatedFileSystemManager.IsolatedFileSystemManager.instance().addFileSystem(),this.contentElement?.querySelector('[aria-label="Select"]')?.shadowRoot?.querySelector("button")?.focus()}async#p(){await this.#n.connectAutomaticFileSystem(!0)||this.#o.hide()}#r(){this.#a=[];const e=this.#n.automaticFileSystem;e&&this.#a.push({name:t.ParsedURL.ParsedURL.extractName(e.root),path:e.root,automaticFileSystem:e});const i=this.#t.projectsForType(d.Workspace.projectTypes.FileSystem).filter(e=>e instanceof I.FileSystemWorkspaceBinding.FileSystem&&e.fileSystem().type()===I.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT);for(const o of i)e&&o===this.#t.projectForFileSystemRoot(e.root)?this.#a[0].project=o:this.#a.push({name:t.ParsedURL.ParsedURL.encodedPathToRawPathString(o.displayName()),path:t.ParsedURL.ParsedURL.urlToRawPathString(o.id(),s.Platform.isWin()),project:o})}#l(e){const t=e.data,s=this.#n.automaticFileSystem;if(s&&t===this.#t.projectForFileSystemRoot(s.root))return this.#o.hide(),void this.#i(t);this.#r();const i=this.#a.findIndex(e=>e.project===t);-1!==i&&(this.#s=i),this.requestUpdate(),this.updateComplete.then(()=>{this.contentElement?.querySelector(".selected")?.scrollIntoView()})}#c(){const e=this.#s>=0&&this.#s<this.#a.length?this.#a[this.#s].project:null;if(this.#r(),e){const t=this.#a.findIndex(t=>t.project===e);this.#s=-1===t?Math.min(this.#a.length-1,this.#s):t}else this.#s=0;this.requestUpdate()}static show(t,s){const i=new e.Dialog.Dialog("select-workspace");i.setAriaLabel(z),i.setMaxContentSize(new R.Size(384,340)),i.setSizeBehavior("SetExactWidthMaxHeight"),i.setDimmed(!0),new B({dialog:i,onProjectSelected:t,currentProject:s}).show(i.contentElement),i.show()}}const _="Unsaved changes",H="Applying to workspace…",G="Apply to workspace",K="Change",Y="Change project root folder",Q="Cancel",J="Discard",Z="Save all",X="Saved to disk",ee="Use code snippets with caution",te="Source code from the selected folder is sent to Google to generate code suggestions.",se="Source code from the selected folder is sent to Google to generate code suggestions. This data will not be used to improve Google’s AI models.",ie="Learn more",oe="Apply changes directly to your project’s source code",ne="This feature uses AI and won’t always get it right",ae="To generate code suggestions, source code from the selected folder is sent to Google. This data may be seen by human reviewers to improve this feature.",re="To generate code suggestions, source code from the selected folder is sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",le="Use generated code snippets with caution",ce="View data sent to Google",de="(opens in a new tab)",he="Changes couldn’t be applied to your workspace.",pe=i.i18n.lockedString;var ue,ge;!function(e){e.INITIAL="initial",e.LOADING="loading",e.SUCCESS="success",e.ERROR="error"}(ue||(ue={})),function(e){e.NONE="none",e.REGULAR="regular",e.AUTOMATIC_DISCONNECTED="automaticDisconnected",e.AUTOMATIC_CONNECTED="automaticConnected"}(ge||(ge={}));const me=(t,s,i)=>{if(!t.changeSummary&&t.patchSuggestionState===ue.INITIAL)return;function o(){return t.sources?g`<x-link
          class="link"
          title="${ce} ${de}"
          href="data:text/plain;charset=utf-8,${encodeURIComponent(t.sources)}"
          jslog=${y.link("files-used-in-patching").track({click:!0})}>
          ${ce}
        </x-link>`:m}function n(){return t.savedToDisk?g`
            <devtools-icon class="green-bright-icon summary-badge" name="check-circle"></devtools-icon>
            <span class="header-text">
              ${pe(X)}
            </span>
          `:t.patchSuggestionState===ue.SUCCESS?g`
            <devtools-icon class="on-tonal-icon summary-badge" name="difference"></devtools-icon>
            <span class="header-text">
              ${pe(`File changes in ${t.projectName}`)}
            </span>
            <devtools-icon
              class="arrow"
              name="chevron-down"
            ></devtools-icon>
          `:g`
          <devtools-icon class="on-tonal-icon summary-badge" name="pen-spark"></devtools-icon>
          <span class="header-text">
            ${pe(_)}
          </span>
          <devtools-icon
            class="arrow"
            name="chevron-down"
          ></devtools-icon>
        `}s.changeRef=s.changeRef??v.createRef(),s.summaryRef=s.summaryRef??v.createRef();const a=t.savedToDisk?g`
          <div class="change-summary saved-to-disk" role="status" aria-live="polite">
            <div class="header-container">
             ${n()}
             </div>
          </div>`:g`
          <details class="change-summary" jslog=${y.section("patch-widget")}>
            <summary class="header-container" ${v.ref(s.summaryRef)}>
              ${n()}
            </summary>
            ${!t.changeSummary&&t.patchSuggestionState===ue.INITIAL||t.savedToDisk?m:t.patchSuggestionState===ue.SUCCESS?g`<devtools-widget .widgetConfig=${e.Widget.widgetConfig($.CombinedDiffView.CombinedDiffView,{workspaceDiff:t.workspaceDiff,ignoredUrls:["inspector://"]})}></devtools-widget>`:g`<devtools-code-block
          .code=${t.changeSummary??""}
          .codeLang=${"css"}
          .displayNotice=${!0}
        ></devtools-code-block>
        ${t.patchSuggestionState===ue.ERROR?g`<div class="error-container">
              <devtools-icon name="cross-circle-filled"></devtools-icon>${pe(he)} ${o()}
            </div>`:m}`}
            ${function(){if(t.savedToDisk)return m;if(t.patchSuggestionState===ue.SUCCESS)return g`
          <div class="footer">
            <div class="left-side">
              <x-link class="link disclaimer-link" href="https://support.google.com/legal/answer/13505487" jslog=${y.link("code-disclaimer").track({click:!0})}>
                ${pe(ee)}
              </x-link>
              ${o()}
            </div>
            <div class="save-or-discard-buttons">
              <devtools-button
                @click=${t.onDiscard}
                .jslogContext=${"patch-widget.discard"}
                .variant=${"outlined"}>
                  ${pe(J)}
              </devtools-button>
              <devtools-button
                @click=${t.onSaveAll}
                .jslogContext=${"patch-widget.save-all"}
                .variant=${"primary"}>
                  ${pe(Z)}
              </devtools-button>
            </div>
          </div>
          `;const e=t.projectType===ge.AUTOMATIC_DISCONNECTED?"folder-off":t.projectType===ge.AUTOMATIC_CONNECTED?"folder-asterisk":"folder";return g`
        <div class="footer">
          ${t.projectName?g`
            <div class="change-workspace" jslog=${y.section("patch-widget.workspace")}>
                <devtools-icon .name=${e}></devtools-icon>
                <span class="folder-name" title=${t.projectPath}>${t.projectName}</span>
              ${t.onChangeWorkspaceClick?g`
                <devtools-button
                  @click=${t.onChangeWorkspaceClick}
                  .jslogContext=${"change-workspace"}
                  .variant=${"text"}
                  .title=${pe(Y)}
                  .disabled=${t.patchSuggestionState===ue.LOADING}
                  ${v.ref(s.changeRef)}
                >${pe(K)}</devtools-button>
              `:m}
            </div>
          `:m}
          <div class="apply-to-workspace-container" aria-live="polite">
            ${t.patchSuggestionState===ue.LOADING?g`
              <div class="loading-text-container" jslog=${y.section("patch-widget.apply-to-workspace-loading")}>
                <devtools-spinner></devtools-spinner>
                <span>
                  ${pe(H)}
                </span>
              </div>
            `:g`
                <devtools-button
                @click=${t.onApplyToWorkspace}
                .jslogContext=${"patch-widget.apply-to-workspace"}
                .variant=${"outlined"}>
                ${pe(G)}
              </devtools-button>
            `}
            ${t.patchSuggestionState===ue.LOADING?g`<devtools-button
              @click=${t.onCancel}
              .jslogContext=${"cancel"}
              .variant=${"outlined"}>
              ${pe(Q)}
            </devtools-button>`:m}
            <devtools-button
              aria-details="info-tooltip"
              .jslogContext=${"patch-widget.info-tooltip-trigger"}
              .iconName=${"info"}
              .variant=${"icon"}
            ></devtools-button>
            <devtools-tooltip
                id="info-tooltip"
                variant=${"rich"}
              >
             <div class="info-tooltip-container">
               ${t.applyToWorkspaceTooltipText}
               <button
                 class="link tooltip-link"
                 role="link"
                 jslog=${y.link("open-ai-settings").track({click:!0})}
                 @click=${t.onLearnMoreTooltipClick}
               >${pe(ie)}</button>
             </div>
            </devtools-tooltip>
          </div>
        </div>`}()}
          </details>
        `;u(a,i)};let ve=class extends e.Widget.Widget{changeSummary="";changeManager;#g=t.Settings.Settings.instance().createSetting("ai-assistance-patching-fre-completed",!1);#m=t.Settings.Settings.instance().createSetting("ai-assistance-patching-selected-project-id","");#e;#v={};#y;#f;#b;#w;#k;#C;#x=ue.INITIAL;#S=T.WorkspaceDiff.workspaceDiff();#t=d.Workspace.WorkspaceImpl.instance();#A=I.AutomaticFileSystemManager.AutomaticFileSystemManager.instance().automaticFileSystem;#I=!1;#T=null;constructor(e,t=me,i){super(e),this.#y=i?.aidaClient??new s.AidaClient.AidaClient,this.#C=n.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===n.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING,this.#e=t,this.requestUpdate()}#$(){e.ViewManager.ViewManager.instance().showView("chrome-ai")}#j(){return this.#b?{projectName:t.ParsedURL.ParsedURL.encodedPathToRawPathString(this.#b.displayName()),projectPath:t.ParsedURL.ParsedURL.urlToRawPathString(this.#b.id(),s.Platform.isWin())}:this.#A?{projectName:t.ParsedURL.ParsedURL.extractName(this.#A.root),projectPath:this.#A.root}:{projectName:"",projectPath:o.DevToolsPath.EmptyRawPathString}}#R(){const e=this.#A?this.#t.projectForFileSystemRoot(this.#A.root):null;return this.#t.projectsForType(d.Workspace.projectTypes.FileSystem).filter(e=>e instanceof I.FileSystemWorkspaceBinding.FileSystem&&e.fileSystem().type()===I.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT).filter(t=>t!==e).length>0}#F(e){return this.#A&&this.#A.root===e?this.#b?ge.AUTOMATIC_CONNECTED:ge.AUTOMATIC_DISCONNECTED:this.#b?ge.NONE:ge.REGULAR}performUpdate(){const{projectName:e,projectPath:t}=this.#j();this.#e({workspaceDiff:this.#S,changeSummary:this.changeSummary,patchSuggestionState:this.#x,sources:this.#w,projectName:e,projectPath:t,projectType:this.#F(t),savedToDisk:this.#k,applyToWorkspaceTooltipText:this.#C?pe(se):pe(te),onLearnMoreTooltipClick:this.#$.bind(this),onApplyToWorkspace:this.#E.bind(this),onCancel:()=>{this.#f?.abort()},onDiscard:this.#M.bind(this),onSaveAll:this.#L.bind(this),onChangeWorkspaceClick:this.#R()?this.#P.bind(this,{applyPatch:!1}):void 0},this.#v,this.contentElement)}wasShown(){super.wasShown(),this.#z(),ye()&&(this.#t.addEventListener(d.Workspace.Events.ProjectAdded,this.#l,this),this.#t.addEventListener(d.Workspace.Events.ProjectRemoved,this.#c,this))}willHide(){super.willHide(),this.#I=!1,ye()&&(this.#t.removeEventListener(d.Workspace.Events.ProjectAdded,this.#l,this),this.#t.removeEventListener(d.Workspace.Events.ProjectRemoved,this.#c,this))}async#D(){if(this.#g.get())return!0;const t=await j.FreDialog.show({header:{iconName:"smart-assistant",text:pe(oe)},reminderItems:[{iconName:"psychiatry",content:pe(ne)},{iconName:"google",content:this.#C?pe(re):pe(ae)},{iconName:"warning",content:g`<x-link
            href=${"https://support.google.com/legal/answer/13505487"}
            class="link devtools-link"
            jslog=${y.link("code-snippets-explainer.patch-widget").track({click:!0})}
          >${pe(le)}</x-link>`}],onLearnMoreClick:()=>{e.ViewManager.ViewManager.instance().showView("chrome-ai")},ariaLabel:pe(oe),learnMoreButtonText:pe(ie)});return t&&this.#g.set(!0),t}#z(){const e=this.#A?this.#t.projectForFileSystemRoot(this.#A.root):this.#t.project(this.#m.get());e?this.#b=e:(this.#b=void 0,this.#m.set("")),this.requestUpdate()}#l(e){const t=e.data;this.#I&&this.#A&&t===this.#t.projectForFileSystemRoot(this.#A.root)?(this.#I=!1,this.#b=t,this.#N()):void 0===this.#b&&this.#z()}#c(){this.#b&&!this.#t.project(this.#b.id())&&(this.#m.set(""),this.#b=void 0,this.requestUpdate())}#P(e={applyPatch:!1}){B.show(t=>{this.#b=t,this.#m.set(t.id()),e.applyPatch?this.#N():(this.requestUpdate(),this.updateComplete.then(()=>{this.contentElement?.querySelector(".apply-to-workspace-container devtools-button")?.shadowRoot?.querySelector("button")?.focus()}))},this.#b)}async#E(){if(!ye())return;await this.#D()&&(this.#b?await this.#N():this.#A?(this.#I=!0,await I.AutomaticFileSystemManager.AutomaticFileSystemManager.instance().connectAutomaticFileSystem(!0)):this.#P({applyPatch:!0}))}get#O(){return this.#S.modifiedUISourceCodes().filter(e=>!e.url().startsWith("inspector://"))}async#N(){const e=this.changeSummary;if(!e)throw new Error("Change summary does not exist");this.#x=ue.LOADING,this.#T=null,this.requestUpdate();const{response:t,processedFiles:s}=await this.#U(e);t&&"rpcId"in t&&t.rpcId&&(this.#T=t.rpcId);const i=this.#O.length>0;"answer"===t?.type&&i?this.#x=ue.SUCCESS:"error"===t?.type&&"abort"===t.error?this.#x=ue.INITIAL:this.#x=ue.ERROR,this.#w=`Filenames in ${this.#b?.displayName()}.\nFiles:\n${s.map(e=>`* ${e}`).join("\n")}`,this.requestUpdate(),this.#x===ue.SUCCESS&&this.updateComplete.then(()=>{this.#v.summaryRef?.value?.focus()})}#M(){for(const e of this.#O)e.resetWorkingCopy();this.#x=ue.INITIAL,this.#w=void 0,this.changeManager?.popStashedChanges(),this.#q("NEGATIVE"),this.requestUpdate(),this.updateComplete.then(()=>{this.#v.changeRef?.value?.focus()})}#L(){for(const e of this.#O)e.commitWorkingCopy();this.changeManager?.stashChanges().then(()=>{this.changeManager?.dropStashedChanges()}),this.#k=!0,this.#q("POSITIVE"),this.requestUpdate()}#q(e){this.#T&&this.#y.registerClientEvent({corresponding_aida_rpc_global_id:this.#T,disable_user_content_logging:!0,do_conversation_client_event:{user_feedback:{sentiment:e}}})}async#U(e){if(!this.#b)throw new Error("Project does not exist");this.#f=new AbortController;const t=new r.PatchAgent.PatchAgent({aidaClient:this.#y,serverSideLoggingEnabled:!1,project:this.#b}),{responses:s,processedFiles:i}=await t.applyChanges(e,{signal:this.#f.signal});return{response:s.at(-1),processedFiles:i}}};function ye(){return Boolean(n.Runtime.hostConfig.devToolsFreestyler?.patching)}window.aiAssistanceTestPatchPrompt=async(e,t,i)=>{if(!ye())return;const o=T.WorkspaceDiff.workspaceDiff(),n=d.Workspace.WorkspaceImpl.instance().projectsForType(d.Workspace.projectTypes.FileSystem).filter(e=>e instanceof I.FileSystemWorkspaceBinding.FileSystem&&e.fileSystem().type()===I.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT).find(t=>t.displayName()===e);if(!n)throw new Error("project not found");const a=new s.AidaClient.AidaClient,l=new r.PatchAgent.PatchAgent({aidaClient:a,serverSideLoggingEnabled:!1,project:n});try{const e=[],{processedFiles:s,responses:o}=await l.applyChanges(t);if("error"===o.at(-1)?.type)return{error:"failed to patch",debugInfo:{responses:o,processedFiles:s}};for(const t of s){const s=i.find(e=>e.path===t);if(!s){e.push(`Patched ${t} that was not expected`);break}const o=l.agentProject,n=await o.readFile(t);if(!n)throw new Error(`${t} has no content`);for(const i of s.matches)n.match(new RegExp(i,"gm"))||e.push({message:`Did not match ${i} in ${t}`,file:t,content:n});for(const i of s.doesNotMatch||[])n.match(new RegExp(i,"gm"))&&e.push({message:`Unexpectedly matched ${i} in ${t}`,file:t,content:n})}return{assertionFailures:e,debugInfo:{responses:o,processedFiles:s}}}finally{o.modifiedUISourceCodes().forEach(e=>{e.resetWorkingCopy()})}};var fe=Object.freeze({__proto__:null,get PatchSuggestionState(){return ue},PatchWidget:ve,isAiAssistancePatchingEnabled:ye}),be=`*{box-sizing:border-box;margin:0;padding:0}:host{width:100%;height:100%;user-select:text;display:flex;flex-direction:column;background-color:var(--sys-color-cdt-base-container)}.chat-ui{width:100%;height:100%;max-height:100%;display:flex;flex-direction:column;container-type:size;container-name:--chat-ui-container}.input-form{display:flex;flex-direction:column;padding:0 var(--sys-size-5) 0 var(--sys-size-5);max-width:var(--sys-size-36);background-color:var(--sys-color-cdt-base-container);width:100%;position:sticky;z-index:9999;bottom:0;padding-bottom:var(--sys-size-5);box-shadow:0 1px var(--sys-color-cdt-base-container);@container (width > 688px){--half-scrollbar-width:calc((100cqw - 100%) / 2);margin-left:var(--half-scrollbar-width);margin-right:calc(-1 * var(--half-scrollbar-width))}@container (height < 224px){margin-top:var(--sys-size-4);margin-bottom:var(--sys-size-4);position:static}@container --chat-ui-container (width < 400px){padding-bottom:var(--sys-size-1)}}.chat-readonly-container{display:flex;width:100%;max-width:var(--sys-size-36);justify-content:center;align-items:center;background-color:var(--sys-color-surface3);font:var(--sys-typescale-body4-regular);padding:var(--sys-size-5) 0;border-radius:var(--sys-shape-corner-medium-small);margin-bottom:var(--sys-size-5);color:var(--sys-color-on-surface-subtle)}.info-tooltip-container{max-width:var(--sys-size-28);padding:var(--sys-size-4) var(--sys-size-5)}.tooltip-link{display:block;margin-top:var(--sys-size-4);color:var(--sys-color-primary);padding-left:0}.chat-input-container{width:100%;display:flex;position:relative;flex-direction:column;border:1px solid var(--sys-color-neutral-outline);border-radius:var(--sys-shape-corner-small);&:focus-within{outline:1px solid var(--sys-color-primary);border-color:var(--sys-color-primary)}&.disabled{background-color:var(--sys-color-state-disabled-container);border-color:transparent;& .chat-input-disclaimer{border-color:var(--sys-color-state-disabled)}}&.single-line-layout{flex-direction:row;justify-content:space-between;.chat-input{flex-shrink:1;padding:var(--sys-size-4)}.chat-input-actions{flex-shrink:0;padding-block:0;align-items:flex-end;padding-bottom:var(--sys-size-1)}}& .image-input-container{margin:var(--sys-size-3) var(--sys-size-4) 0;max-width:100%;width:fit-content;position:relative;devtools-button{position:absolute;top:calc(-1 * var(--sys-size-2));right:calc(-1 * var(--sys-size-3));border-radius:var(--sys-shape-corner-full);border:1px solid var(--sys-color-neutral-outline);background-color:var(--sys-color-cdt-base-container)}img{max-height:var(--sys-size-18);max-width:100%;border:1px solid var(--sys-color-neutral-outline);border-radius:var(--sys-shape-corner-small)}.loading{margin:var(--sys-size-4) 0;display:inline-flex;justify-content:center;align-items:center;height:var(--sys-size-18);width:var(--sys-size-19);background-color:var(--sys-color-surface3);border-radius:var(--sys-shape-corner-small);border:1px solid var(--sys-color-neutral-outline);devtools-spinner{color:var(--sys-color-state-disabled)}}}& .chat-input-disclaimer-container{display:flex;align-items:center;padding-right:var(--sys-size-3);flex-shrink:0}& .chat-input-disclaimer{display:flex;justify-content:center;align-items:center;font:var(--sys-typescale-body5-regular);border-right:1px solid var(--sys-color-divider);padding-right:8px;&.hide-divider{border-right:none}}@container --chat-ui-container (width < 400px){& .chat-input-disclaimer-container{display:none}}}.chat-input{scrollbar-width:none;field-sizing:content;resize:none;width:100%;max-height:84px;border:0;border-radius:var(--sys-shape-corner-small);font:var(--sys-typescale-body4-regular);line-height:18px;min-height:var(--sys-size-11);color:var(--sys-color-on-surface);background-color:var(--sys-color-cdt-base-container);padding:var(--sys-size-4) var(--sys-size-4) var(--sys-size-3) var(--sys-size-4);&::placeholder{opacity:60%}&:focus-visible{outline:0}&:disabled{color:var(--sys-color-state-disabled);background-color:transparent;border-color:transparent;&::placeholder{color:var(--sys-color-on-surface-subtle);opacity:100%}}}.chat-input-actions{display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding-left:var(--sys-size-4);padding-right:var(--sys-size-2);gap:var(--sys-size-6);padding-bottom:var(--sys-size-2);& .chat-input-actions-left{flex:1 1 0;min-width:0}& .chat-input-actions-right{flex-shrink:0;display:flex;& .start-new-chat-button{padding-bottom:var(--sys-size-2);padding-right:var(--sys-size-3)}}}.chat-inline-button{padding-left:3px}.chat-cancel-context-button{padding-bottom:3px;padding-right:var(--sys-size-3)}footer.chat-view-footer{display:flex;justify-content:center;padding-block:var(--sys-size-3);font:var(--sys-typescale-body5-regular);border-top:1px solid var(--sys-color-divider);text-wrap:balance;text-align:center;&.has-conversation:not(.is-read-only){display:none;border:none;@container --chat-ui-container (width < 400px){display:flex}}}.messages-container{flex-grow:1;width:100%;max-width:var(--sys-size-36);@container (width > 688px){--half-scrollbar-width:calc((100cqw - 100%) / 2);margin-left:var(--half-scrollbar-width);margin-right:calc(-1 * var(--half-scrollbar-width))}}.chat-message{user-select:text;cursor:initial;display:flex;flex-direction:column;gap:var(--sys-size-5);width:100%;padding:var(--sys-size-7) var(--sys-size-5);font-size:12px;word-break:normal;overflow-wrap:anywhere;border-bottom:var(--sys-size-1) solid var(--sys-color-divider);&:last-of-type{border-bottom:0}.message-info{display:flex;align-items:center;height:var(--sys-size-11);gap:var(--sys-size-4);font:var(--sys-typescale-body4-bold);img{border:0;border-radius:var(--sys-shape-corner-full);display:block;height:var(--sys-size-9);width:var(--sys-size-9)}h2{font:var(--sys-typescale-body4-bold)}}.actions{display:flex;flex-direction:column;gap:var(--sys-size-8);max-width:100%}.aborted{color:var(--sys-color-on-surface-subtle)}.image-link{width:fit-content;border-radius:var(--sys-shape-corner-small);outline-offset:var(--sys-size-2);img{max-height:var(--sys-size-20);max-width:100%;border-radius:var(--sys-shape-corner-small);border:1px solid var(--sys-color-neutral-outline);width:fit-content;vertical-align:bottom}}.unavailable-image{margin:var(--sys-size-4) 0;display:inline-flex;justify-content:center;align-items:center;height:var(--sys-size-17);width:var(--sys-size-18);background-color:var(--sys-color-surface3);border-radius:var(--sys-shape-corner-small);border:1px solid var(--sys-color-neutral-outline);devtools-icon{color:var(--sys-color-state-disabled)}}}.select-element{display:flex;gap:var(--sys-size-3);align-items:center;.resource-link,\n  .resource-task{cursor:pointer;padding:var(--sys-size-2) var(--sys-size-3);font:var(--sys-typescale-body5-regular);border:var(--sys-size-1) solid var(--sys-color-divider);border-radius:var(--sys-shape-corner-extra-small);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;line-height:1;& .title{vertical-align:middle;font:var(--sys-typescale-body5-regular)}&.has-picker-behavior{overflow:visible}&:focus-visible{outline:2px solid var(--sys-color-state-focus-ring)}devtools-icon,\n    devtools-file-source-icon{display:inline-flex;vertical-align:middle;width:var(--sys-size-7);height:var(--sys-size-7)}.network-override-marker{position:relative;float:left}.network-override-marker::before{content:var(--image-file-empty);width:var(--sys-size-4);height:var(--sys-size-4);border-radius:50%;outline:var(--sys-size-1) solid var(--icon-gap-focus-selected);left:11px;position:absolute;top:13px;z-index:1;background-color:var(--sys-color-purple-bright)}.image.icon{display:inline-flex;justify-content:center;align-items:center;vertical-align:middle;margin-right:var(--sys-size-3);img{max-width:var(--sys-size-7);max-height:var(--sys-size-7)}}}.resource-link.disabled,\n  .resource-task.disabled,\n  .resource-link.not-selected,\n  .resource-task.not-selected{color:var(--sys-color-state-disabled);border-color:var(--sys-color-neutral-outline)}.resource-link.disabled,\n  .resource-task.disabled{pointer-events:none}}.indicator{color:var(--sys-color-green-bright)}.summary{display:grid;grid-template-columns:auto 1fr auto;padding:var(--sys-size-3);line-height:var(--sys-size-9);cursor:default;gap:var(--sys-size-3);justify-content:center;align-items:center;.title{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;font:var(--sys-typescale-body4-regular);.paused{font:var(--sys-typescale-body4-bold)}}}.step-code{display:flex;flex-direction:column;gap:var(--sys-size-2)}.js-code-output{devtools-code-block{--code-block-max-code-height:50px}}.context-details{devtools-code-block{--code-block-max-code-height:80px}}.step{width:fit-content;background-color:var(--sys-color-surface3);border-radius:var(--sys-size-6);position:relative;&.empty{pointer-events:none;.arrow{display:none}}&:not(&[open]):hover::after{content:'';height:100%;width:100%;border-radius:inherit;position:absolute;top:0;left:0;pointer-events:none;background-color:var(--sys-color-state-hover-on-subtle)}&.paused{.indicator{color:var(--sys-color-on-surface-subtle)}}&.canceled{.summary{color:var(--sys-color-state-disabled);text-decoration:line-through}.indicator{color:var(--sys-color-state-disabled)}}devtools-markdown-view{--code-background-color:var(--sys-color-surface1)}devtools-icon{vertical-align:bottom}devtools-spinner{width:var(--sys-size-9);height:var(--sys-size-9);padding:var(--sys-size-2)}&[open]{width:auto;.summary .title{white-space:normal;overflow:unset}.summary .arrow{transform:rotate(180deg)}}summary::marker{content:''}summary{border-radius:var(--sys-size-6)}.step-details{padding:0 var(--sys-size-5) var(--sys-size-4) var(--sys-size-12);display:flex;flex-direction:column;gap:var(--sys-size-6);devtools-code-block{--code-block-background-color:var(--sys-color-surface1)}}}.link{color:var(--text-link);text-decoration:underline;cursor:pointer}button.link{border:none;background:none;font:inherit;&:focus-visible{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring);outline-offset:0;border-radius:var(--sys-shape-corner-extra-small)}}.select-an-element-text{margin-left:2px}main{overflow:hidden auto;display:flex;flex-direction:column;align-items:center;height:100%;container-type:size;scrollbar-width:thin;transform:translateZ(1px);scroll-timeline:--scroll-timeline y}.empty-state-container{flex-grow:1;display:grid;align-items:center;justify-content:center;font:var(--sys-typescale-headline4);gap:var(--sys-size-8);padding:var(--sys-size-4);max-width:var(--sys-size-33);@container (width > 688px){--half-scrollbar-width:calc((100cqw - 100%) / 2);margin-left:var(--half-scrollbar-width);margin-right:calc(-1 * var(--half-scrollbar-width))}.header{display:flex;flex-direction:column;width:100%;align-items:center;justify-content:center;align-self:end;gap:var(--sys-size-5);.icon{display:flex;justify-content:center;align-items:center;height:var(--sys-size-14);width:var(--sys-size-14);border-radius:var(--sys-shape-corner-small);background:linear-gradient(135deg,var(--sys-color-gradient-primary),var(--sys-color-gradient-tertiary))}h1{font:var(--sys-typescale-headline4)}p{text-align:center;font:var(--sys-typescale-body4-regular)}}.empty-state-content{display:flex;flex-direction:column;gap:var(--sys-size-5);align-items:center;justify-content:center;align-self:start}}.disabled-view{display:flex;max-width:var(--sys-size-34);border-radius:var(--sys-shape-corner-small);box-shadow:var(--sys-elevation-level3);background-color:var(--app-color-card-background);font:var(--sys-typescale-body4-regular);text-wrap:pretty;padding:var(--sys-size-6) var(--sys-size-8);margin:var(--sys-size-4) 0;line-height:var(--sys-size-9);.disabled-view-icon-container{border-radius:var(--sys-shape-corner-extra-small);width:var(--sys-size-9);height:var(--sys-size-9);background:linear-gradient(135deg,var(--sys-color-gradient-primary),var(--sys-color-gradient-tertiary));margin-right:var(--sys-size-5);devtools-icon{margin:var(--sys-size-2);width:var(--sys-size-8);height:var(--sys-size-8)}}}.error-step{color:var(--sys-color-error)}.side-effect-confirmation{display:flex;flex-direction:column;gap:var(--sys-size-5);padding-bottom:var(--sys-size-4)}.side-effect-buttons-container{display:flex;gap:var(--sys-size-4)}.change-summary{background-color:var(--sys-color-surface3);border-radius:var(--sys-shape-corner-medium-small);position:relative;margin:0 var(--sys-size-5) var(--sys-size-7) var(--sys-size-5);padding:0 var(--sys-size-5);&.saved-to-disk{pointer-events:none}& .header-container{display:flex;align-items:center;gap:var(--sys-size-3);height:var(--sys-size-14);padding-left:var(--sys-size-3);devtools-spinner{width:var(--sys-size-6);height:var(--sys-size-6);margin-left:var(--sys-size-3);margin-right:var(--sys-size-3)}& devtools-icon.summary-badge{width:var(--sys-size-8);height:var(--sys-size-8)}& .green-bright-icon{color:var(--sys-color-green-bright)}& .on-tonal-icon{color:var(--sys-color-on-tonal-container)}& .header-text{font:var(--sys-typescale-body4);color:var(--sys-color-on-surface);white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis}& .arrow{margin-left:auto}&::marker{content:''}}&:not(.saved-to-disk, &[open]):hover::after{content:'';height:100%;width:100%;border-radius:inherit;position:absolute;top:0;left:0;pointer-events:none;background-color:var(--sys-color-state-hover-on-subtle)}&[open]:not(.saved-to-disk){&::details-content{height:fit-content;padding:var(--sys-size-2) 0;border-radius:inherit}summary .arrow{transform:rotate(180deg)}}devtools-code-block{margin-bottom:var(--sys-size-5);--code-block-background-color:var(--sys-color-surface1)}.error-container{display:flex;align-items:center;gap:var(--sys-size-3);color:var(--sys-color-error)}.footer{display:flex;flex-flow:row wrap;justify-content:space-between;margin:var(--sys-size-5) 0 var(--sys-size-5) var(--sys-size-2);gap:var(--sys-size-6) var(--sys-size-5);.disclaimer-link{align-self:center}.left-side{flex-grow:1;display:flex;align-self:center;gap:var(--sys-size-3)}.save-or-discard-buttons{flex-grow:1;display:flex;justify-content:flex-end;gap:var(--sys-size-3)}.change-workspace{display:flex;flex-direction:row;align-items:center;gap:var(--sys-size-3);min-width:var(--sys-size-22);flex:1 1 40%;.folder-name{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis}}.loading-text-container{margin-right:var(--sys-size-3);display:flex;justify-content:center;align-items:center;gap:var(--sys-size-3)}.apply-to-workspace-container{display:flex;align-items:center;gap:var(--sys-size-3);min-width:fit-content;justify-content:flex-end;flex-grow:1;flex-shrink:1;devtools-icon{width:18px;height:18px;margin-left:var(--sys-size-2)}}}}@keyframes reveal{0%,\n  99%{opacity:100%}100%{opacity:0%}}\n/*# sourceURL=${import.meta.resolve("././components/chatView.css")} */`,we=`@scope to (devtools-widget > *){.ai-assistance-feedback-row{font-family:var(--default-font-family);width:100%;display:flex;gap:var(--sys-size-8);justify-content:space-between;align-items:center;margin-block:calc(-1 * var(--sys-size-3));.action-buttons{display:flex;align-items:center;gap:var(--sys-size-2);padding:var(--sys-size-4) 0}.vertical-separator{height:16px;width:1px;vertical-align:top;margin:0 var(--sys-size-2);background:var(--sys-color-divider);display:inline-block}.suggestions-container{overflow:hidden;position:relative;display:flex;.suggestions-scroll-container{display:flex;overflow:auto hidden;scrollbar-width:none;gap:var(--sys-size-3);padding:var(--sys-size-3)}.scroll-button-container{position:absolute;top:0;height:100%;display:flex;align-items:center;width:var(--sys-size-15);z-index:999}.scroll-button-container.hidden{display:none}.scroll-button-container.left{left:0;background:linear-gradient(90deg,var(--sys-color-cdt-base-container) 0%,var(--sys-color-cdt-base-container) 50%,transparent)}.scroll-button-container.right{right:0;background:linear-gradient(90deg,transparent,var(--sys-color-cdt-base-container) 50%);justify-content:flex-end}}}.feedback-form{display:flex;flex-direction:column;gap:var(--sys-size-5);margin-top:var(--sys-size-4);background-color:var(--sys-color-surface3);padding:var(--sys-size-6);border-radius:var(--sys-shape-corner-medium-small);max-width:var(--sys-size-32);.feedback-input{height:var(--sys-size-11);padding:0 var(--sys-size-5);background-color:var(--sys-color-surface3);width:auto}.feedback-input::placeholder{color:var(--sys-color-on-surface-subtle);font:var(--sys-typescale-body4-regular)}.feedback-header{display:flex;justify-content:space-between;align-items:center}.feedback-title{margin:0;font:var(--sys-typescale-body3-medium)}.feedback-disclaimer{padding:0 var(--sys-size-4)}}}\n/*# sourceURL=${import.meta.resolve("././components/userActionRow.css")} */`;const{html:ke,Directives:{ref:Ce}}=p,xe="Good response",Se="Bad response",Ae="Provide additional feedback",Ie="Submitted feedback will also include your conversation",Te="Submit",$e="Why did you choose this rating? (optional)",je="Close",Re="Report legal issue",Fe="Scroll to next suggestions",Ee="Scroll to previous suggestions",Me="Copy response",Le=i.i18n.lockedString,Pe=(e,t,s)=>{p.render(ke`
    <style>${F.textInputStyles}</style>
    <style>${we}</style>
    <div class="ai-assistance-feedback-row">
      <div class="action-buttons">
        ${e.showRateButtons?ke`
          <devtools-button
            .data=${{variant:"icon",size:"SMALL",iconName:"thumb-up",toggledIconName:"thumb-up-filled",toggled:"POSITIVE"===e.currentRating,toggleType:"primary-toggle",title:Le(xe),jslogContext:"thumbs-up"}}
            @click=${()=>e.onRatingClick("POSITIVE")}
          ></devtools-button>
          <devtools-button
            .data=${{variant:"icon",size:"SMALL",iconName:"thumb-down",toggledIconName:"thumb-down-filled",toggled:"NEGATIVE"===e.currentRating,toggleType:"primary-toggle",title:Le(Se),jslogContext:"thumbs-down"}}
            @click=${()=>e.onRatingClick("NEGATIVE")}
          ></devtools-button>
          <div class="vertical-separator"></div>
        `:p.nothing}
        <devtools-button
          .data=${{variant:"icon",size:"SMALL",title:Le(Re),iconName:"report",jslogContext:"report"}}
          @click=${e.onReportClick}
        ></devtools-button>
        <div class="vertical-separator"></div>
          <devtools-button
            .data=${{variant:"icon",size:"SMALL",title:Le(Me),iconName:"copy",jslogContext:"copy-ai-response"}}
            aria-label=${Le(Me)}
            @click=${e.onCopyResponseClick}></devtools-button>
      </div>
      ${e.suggestions?ke`<div class="suggestions-container">
        <div class="scroll-button-container left hidden" ${Ce(e=>{t.suggestionsLeftScrollButtonContainer=e})}>
          <devtools-button
            class='scroll-button'
            .data=${{variant:"icon",size:"SMALL",iconName:"chevron-left",title:Le(Ee),jslogContext:"chevron-left"}}
            @click=${()=>e.scrollSuggestionsScrollContainer("left")}
          ></devtools-button>
        </div>
        <div class="suggestions-scroll-container" @scroll=${e.onSuggestionsScrollOrResize} ${Ce(e=>{t.suggestionsScrollContainer=e})}>
          ${e.suggestions.map(t=>ke`<devtools-button
            class='suggestion'
            .data=${{variant:"outlined",title:t,jslogContext:"suggestion"}}
            @click=${()=>e.onSuggestionClick(t)}
          >${t}</devtools-button>`)}
        </div>
        <div class="scroll-button-container right hidden" ${Ce(e=>{t.suggestionsRightScrollButtonContainer=e})}>
          <devtools-button
            class='scroll-button'
            .data=${{variant:"icon",size:"SMALL",iconName:"chevron-right",title:Le(Fe),jslogContext:"chevron-right"}}
            @click=${()=>e.scrollSuggestionsScrollContainer("right")}
          ></devtools-button>
        </div>
      </div>`:p.nothing}
    </div>
    ${e.isShowingFeedbackForm?ke`
      <form class="feedback-form" @submit=${e.onSubmit}>
        <div class="feedback-header">
          <h4 class="feedback-title">${Le($e)}</h4>
          <devtools-button
            aria-label=${Le(je)}
            @click=${e.onClose}
            .data=${{variant:"icon",iconName:"cross",size:"SMALL",title:Le(je),jslogContext:"close"}}
          ></devtools-button>
        </div>
        <input
          type="text"
          class="devtools-text-input feedback-input"
          @input=${t=>e.onInputChange(t.target.value)}
          placeholder=${Le(Ae)}
          jslog=${y.textField("feedback").track({keydown:"Enter"})}
        >
        <span class="feedback-disclaimer">${Le(Ie)}</span>
        <div>
          <devtools-button
          aria-label=${Le(Te)}
          .data=${{type:"submit",disabled:e.isSubmitButtonDisabled,variant:"outlined",size:"SMALL",title:Le(Te),jslogContext:"send"}}
          >${Le(Te)}</devtools-button>
        </div>
      </div>
    </form>
    `:p.nothing}
  `,s)};let ze=class extends e.Widget.Widget{showRateButtons=!1;onFeedbackSubmit=()=>{};suggestions;onCopyResponseClick=()=>{};onSuggestionClick=()=>{};canShowFeedbackForm=!1;#V=new ResizeObserver(()=>this.#W());#B=new t.Throttler.Throttler(50);#_="";#H;#G=!1;#K=!0;#e;#v={};constructor(e,t){super(e),this.#e=t??Pe}wasShown(){super.wasShown(),this.performUpdate(),this.#Y(),this.#v.suggestionsScrollContainer&&this.#V.observe(this.#v.suggestionsScrollContainer)}performUpdate(){this.#e({onSuggestionClick:this.onSuggestionClick,onRatingClick:this.#Q.bind(this),onReportClick:()=>e.UIUtils.openInNewTab("https://support.google.com/legal/troubleshooter/1114905?hl=en#ts=1115658%2C13380504"),onCopyResponseClick:this.onCopyResponseClick,scrollSuggestionsScrollContainer:this.#J.bind(this),onSuggestionsScrollOrResize:this.#W.bind(this),onSubmit:this.#Z.bind(this),onClose:this.#X.bind(this),onInputChange:this.#ee.bind(this),isSubmitButtonDisabled:this.#K,showRateButtons:this.showRateButtons,suggestions:this.suggestions,currentRating:this.#H,isShowingFeedbackForm:this.#G},this.#v,this.contentElement)}#ee(e){this.#_=e;const t=!e;t!==this.#K&&(this.#K=t,this.performUpdate())}#Y=()=>{const e=this.#v.suggestionsScrollContainer,t=this.#v.suggestionsLeftScrollButtonContainer,s=this.#v.suggestionsRightScrollButtonContainer;if(!e||!t||!s)return;const i=e.scrollLeft>1,o=e.scrollLeft+e.offsetWidth+1<e.scrollWidth;t.classList.toggle("hidden",!i),s.classList.toggle("hidden",!o)};willHide(){super.willHide(),this.#V.disconnect()}#W(){this.#B.schedule(()=>(this.#Y(),Promise.resolve()))}#J(e){const t=this.#v.suggestionsScrollContainer;t&&t.scroll({top:0,left:"left"===e?t.scrollLeft-t.clientWidth:t.scrollLeft+t.clientWidth,behavior:"smooth"})}#Q(e){if(this.#H===e)return this.#H=void 0,this.#G=!1,this.#K=!0,this.onFeedbackSubmit("SENTIMENT_UNSPECIFIED"),void this.performUpdate();this.#H=e,this.#G=this.canShowFeedbackForm,this.onFeedbackSubmit(e),this.performUpdate()}#X(){this.#G=!1,this.#K=!0,this.performUpdate()}#Z(e){e.preventDefault();const t=this.#_;this.#H&&t&&(this.onFeedbackSubmit(this.#H,t),this.#G=!1,this.#K=!0,this.performUpdate())}};var De=Object.freeze({__proto__:null,DEFAULT_VIEW:Pe,UserActionRow:ze});const{html:Ne,Directives:{ifDefined:Oe,ref:Ue}}=p,qe={notLoggedIn:"This feature is only available when you are signed into Chrome with your Google account",offline:"Check your internet connection and try again",settingsLink:"AI assistance in Settings",turnOnForStyles:"Turn on {PH1} to get help with understanding CSS styles",turnOnForStylesAndRequests:"Turn on {PH1} to get help with styles and network requests",turnOnForStylesRequestsAndFiles:"Turn on {PH1} to get help with styles, network requests, and files",turnOnForStylesRequestsPerformanceAndFiles:"Turn on {PH1} to get help with styles, network requests, performance, and files",learnAbout:"Learn about AI in DevTools",notAvailableInIncognitoMode:"AI assistance is not available in Incognito mode or Guest mode",inputTextAriaDescription:"You can also use one of the suggested prompts above to start your conversation",revealContextDescription:"Reveal the selected context item in DevTools"},Ve="Send",We="Start new chat",Be="Cancel",_e="Select an element",He="No element selected",Ge="How can I help you?",Ke="Something unforeseen happened and I can no longer continue. Try your request again and see if that resolves the issue. If this keeps happening, update Chrome to the latest version.",Ye="Seems like I am stuck with the investigation. It would be better if you start over.",Qe="You stopped this response",Je="This code may modify page content. Continue?",Ze="Continue",Xe="Cancel",et="AI",tt="You",st="Investigating",it="Paused",ot="Code executed",nt="Code to execute",at="Data returned",rt="Completed",lt="Canceled",ct="You're viewing a past conversation.",dt="Take screenshot",ht="Remove image input",pt="Image input sent to the model",ut="Account avatar",gt="Open image in a new tab",mt="Image unavailable",vt="Add image",yt=i.i18n.registerUIStrings("panels/ai_assistance/components/ChatView.ts",qe),ft=i.i18n.getLocalizedString.bind(void 0,yt),bt=i.i18n.lockedString,wt="relevant-data-link-chat";class kt extends HTMLElement{#te=this.attachShadow({mode:"open"});#se;#ie;#oe;#ne=p.Directives.createRef();#ae=new ResizeObserver(()=>this.#re());#le=!0;#ce=!1;constructor(e){super(),this.#ie=e}set props(e){this.#ie=e,this.#de()}connectedCallback(){this.#de(),this.#oe&&this.#ae.observe(this.#oe)}disconnectedCallback(){this.#ae.disconnect()}clearTextInput(){const e=this.#te.querySelector(".chat-input");e&&(e.value="")}focusTextInput(){const e=this.#te.querySelector(".chat-input");e&&e.focus()}restoreScrollPosition(){void 0!==this.#se&&this.#ne?.value&&this.#he(this.#se)}scrollToBottom(){this.#ne?.value&&this.#he(this.#ne.value.scrollHeight)}#re(){this.#le&&this.#ne?.value&&this.#le&&this.#he(this.#ne.value.scrollHeight)}#he(e){this.#ne?.value&&(this.#se=e,this.#ce=!0,this.#ne.value.scrollTop=e)}#pe(e){const t=this.#te.querySelector(".chat-input");t&&(t.value=e,this.#ie.onTextInputChange(e))}#ue(e){this.#oe=e,e?this.#ae.observe(e):(this.#le=!0,this.#ae.disconnect())}#ge=e=>{e.target&&e.target instanceof HTMLElement&&(this.#ce?this.#ce=!1:(this.#se=e.target.scrollTop,this.#le=e.target.scrollTop+e.target.clientHeight+1>e.target.scrollHeight))};#Z=e=>{if(e.preventDefault(),this.#ie.imageInput?.isLoading)return;const t=this.#te.querySelector(".chat-input");if(!t?.value)return;const s=!this.#ie.imageInput?.isLoading&&this.#ie.imageInput?.data?{inlineData:{data:this.#ie.imageInput.data,mimeType:this.#ie.imageInput.mimeType}}:void 0;this.#ie.onTextSubmit(t.value,s,this.#ie.imageInput?.inputType),t.value=""};#me=e=>{if(e.target&&e.target instanceof HTMLTextAreaElement&&"Enter"===e.key&&!e.shiftKey&&!e.isComposing){if(e.preventDefault(),!e.target?.value||this.#ie.imageInput?.isLoading)return;const t=!this.#ie.imageInput?.isLoading&&this.#ie.imageInput?.data?{inlineData:{data:this.#ie.imageInput.data,mimeType:this.#ie.imageInput.mimeType}}:void 0;this.#ie.onTextSubmit(e.target.value,t,this.#ie.imageInput?.inputType),e.target.value=""}};#ve=e=>{e.preventDefault(),this.#ie.isLoading&&this.#ie.onCancelClick()};#ye=t=>{if(t.stopPropagation(),this.#ie.onLoadImage){e.UIUtils.createFileSelectorElement(this.#ie.onLoadImage.bind(this),".jpeg,.jpg,.png").click()}};#fe=e=>{this.#pe(e),this.focusTextInput(),s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceDynamicSuggestionClicked)};#de(){p.render(Ne`
      <style>${be}</style>
      <div class="chat-ui">
        <main @scroll=${this.#ge} ${Ue(this.#ne)}>
          ${function({state:t,aidaAvailability:s,messages:i,isLoading:o,isReadOnly:a,canShowFeedbackForm:l,isTextInputDisabled:c,suggestions:d,userInfo:h,markdownRenderer:u,conversationType:g,changeSummary:m,changeManager:v,onSuggestionClick:f,onFeedbackSubmit:b,onCopyResponseClick:w,onMessageContainerRef:k}){if("disabled-view"===t)return St("available"===s?function(){const t=document.createElement("span");let s;t.textContent=ft(qe.settingsLink),t.classList.add("link"),e.ARIAUtils.markAsLink(t),t.addEventListener("click",()=>{e.ViewManager.ViewManager.instance().showView("chrome-ai")}),t.setAttribute("jslog",`${y.action("open-ai-settings").track({click:!0})}`);const i=n.Runtime.hostConfig;if(i.isOffTheRecord)return Ne`${ft(qe.notAvailableInIncognitoMode)}`;s=i.devToolsAiAssistancePerformanceAgent?.enabled?S.getFormatLocalizedString(yt,qe.turnOnForStylesRequestsPerformanceAndFiles,{PH1:t}):i.devToolsAiAssistanceFileAgent?.enabled?S.getFormatLocalizedString(yt,qe.turnOnForStylesRequestsAndFiles,{PH1:t}):i.devToolsAiAssistanceNetworkAgent?.enabled?S.getFormatLocalizedString(yt,qe.turnOnForStylesAndRequests,{PH1:t}):S.getFormatLocalizedString(yt,qe.turnOnForStyles,{PH1:t});return Ne`${s}`}():function(e){switch(e){case"no-account-email":case"sync-is-paused":return Ne`${ft(qe.notLoggedIn)}`;case"no-internet":return Ne`${ft(qe.offline)}`}}(s));if(!g)return p.nothing;if(i.length>0)return function({messages:t,isLoading:s,isReadOnly:i,canShowFeedbackForm:o,userInfo:n,markdownRenderer:a,changeSummary:l,changeManager:c,onSuggestionClick:d,onFeedbackSubmit:h,onCopyResponseClick:u,onMessageContainerRef:g}){function m(){return s?p.nothing:Ne`<devtools-widget
      .widgetConfig=${e.Widget.widgetConfig(ve,{changeSummary:l??"",changeManager:c})}
    ></devtools-widget>`}return Ne`
    <div class="messages-container" ${Ue(g)}>
      ${t.map((t,l,c)=>function({message:t,isLoading:s,isReadOnly:i,canShowFeedbackForm:o,isLast:n,userInfo:a,markdownRenderer:l,onSuggestionClick:c,onFeedbackSubmit:d,onCopyResponseClick:h}){if("user"===t.entity){const e=a.accountFullName||bt(tt),s=a.accountImage?Ne`<img src="data:image/png;base64, ${a.accountImage}" alt=${ut} />`:Ne`<devtools-icon
          name="profile"
        ></devtools-icon>`,i=t.imageInput&&"inlineData"in t.imageInput?function(e){if(e.data===r.AiHistoryStorage.NOT_FOUND_IMAGE_DATA)return Ne`<div class="unavailable-image" title=${mt}>
      <devtools-icon name='file-image'></devtools-icon>
    </div>`;const t=`data:${e.mimeType};base64,${e.data}`;return Ne`<x-link
      class="image-link" title=${gt}
      href=${t}
    >
      <img src=${t} alt=${pt} />
    </x-link>`}(t.imageInput.inlineData):p.nothing;return Ne`<section
      class="chat-message query"
      jslog=${y.section("question")}
    >
      <div class="message-info">
        ${s}
        <div class="message-name">
          <h2>${e}</h2>
        </div>
      </div>
      ${i}
      <div class="message-content">${Ct(t.text,l)}</div>
    </section>`}return Ne`
    <section
      class="chat-message answer"
      jslog=${y.section("answer")}
    >
      <div class="message-info">
        <devtools-icon name="smart-assistant"></devtools-icon>
        <div class="message-name">
          <h2>${bt(et)}</h2>
        </div>
      </div>
      ${p.Directives.repeat(t.steps,(e,t)=>t,e=>function({step:e,isLoading:t,markdownRenderer:s,isLast:i}){const o=p.Directives.classMap({step:!0,empty:!e.thought&&!e.code&&!e.contextDetails,paused:Boolean(e.sideEffect),canceled:Boolean(e.canceled)});return Ne`
    <details class=${o}
      jslog=${y.section("step")}
      .open=${Boolean(e.sideEffect)}>
      <summary>
        <div class="summary">
          ${function({step:e,isLoading:t,isLast:s}){if(t&&s&&!e.sideEffect)return Ne`<devtools-spinner></devtools-spinner>`;let i="checkmark",o=bt(rt),n="button";s&&e.sideEffect?(n=void 0,o=void 0,i="pause-circle"):e.canceled&&(o=bt(lt),i="cross");return Ne`<devtools-icon
      class="indicator"
      role=${Oe(n)}
      aria-label=${Oe(o)}
      .name=${i}
    ></devtools-icon>`}({step:e,isLoading:t,isLast:i})}
          ${function(e){const t=e.sideEffect?Ne`<span class="paused">${bt(it)}: </span>`:p.nothing,s=e.title??`${bt(st)}…`;return Ne`<span class="title">${t}${s}</span>`}(e)}
          <devtools-icon
            class="arrow"
            name="chevron-down"
          ></devtools-icon>
        </div>
      </summary>
      ${function({step:e,markdownRenderer:t,isLast:s}){const i=s&&e.sideEffect?function(e){if(!e.sideEffect)return p.nothing;return Ne`<div
    class="side-effect-confirmation"
    jslog=${y.section("side-effect-confirmation")}
  >
    <p>${bt(Je)}</p>
    <div class="side-effect-buttons-container">
      <devtools-button
        .data=${{variant:"outlined",jslogContext:"decline-execute-code"}}
        @click=${()=>e.sideEffect?.onAnswer(!1)}
      >${bt(Xe)}</devtools-button>
      <devtools-button
        .data=${{variant:"primary",jslogContext:"accept-execute-code",iconName:"play"}}
        @click=${()=>e.sideEffect?.onAnswer(!0)}
      >${bt(Ze)}</devtools-button>
    </div>
  </div>`}(e):p.nothing,o=e.thought?Ne`<p>${Ct(e.thought,t)}</p>`:p.nothing,n=e.contextDetails?Ne`${p.Directives.repeat(e.contextDetails,e=>Ne`<div class="context-details">
      <devtools-code-block
        .code=${e.text}
        .codeLang=${e.codeLang||""}
        .displayNotice=${!1}
        .header=${e.title}
        .showCopyButton=${!0}
      ></devtools-code-block>
    </div>`)}`:p.nothing;return Ne`<div class="step-details">
    ${o}
    ${function(e){if(!e.code&&!e.output)return p.nothing;const t=e.output&&!e.canceled?bt(ot):bt(nt),s=e.code?Ne`<div class="action-result">
      <devtools-code-block
        .code=${e.code.trim()}
        .codeLang=${"js"}
        .displayNotice=${!Boolean(e.output)}
        .header=${t}
        .showCopyButton=${!0}
      ></devtools-code-block>
  </div>`:p.nothing,i=e.output?Ne`<div class="js-code-output">
    <devtools-code-block
      .code=${e.output}
      .codeLang=${"js"}
      .displayNotice=${!0}
      .header=${bt(at)}
      .showCopyButton=${!1}
    ></devtools-code-block>
  </div>`:p.nothing;return Ne`<div class="step-code">${s}${i}</div>`}(e)}
    ${i}
    ${n}
  </div>`}({step:e,markdownRenderer:s,isLast:i})}
    </details>`}({step:e,isLoading:s,markdownRenderer:l,isLast:[...t.steps.values()].at(-1)===e&&n}))}
      ${t.answer?Ne`<p>${Ct(t.answer,l,{animate:!i&&s&&n})}</p>`:p.nothing}
      ${function(e){if(e.error){let t;switch(e.error){case"unknown":case"block":t=Ke;break;case"max-steps":t=Ye;break;case"abort":return Ne`<p class="aborted" jslog=${y.section("aborted")}>${bt(Qe)}</p>`}return Ne`<p class="error" jslog=${y.section("error")}>${bt(t)}</p>`}return p.nothing}(t)}
      ${n&&s?p.nothing:Ne`<devtools-widget class="actions" .widgetConfig=${e.Widget.widgetConfig(ze,{showRateButtons:void 0!==t.rpcId,onFeedbackSubmit:(e,s)=>{t.rpcId&&d(t.rpcId,e,s)},suggestions:n&&!i?t.suggestions:void 0,onSuggestionClick:c,onCopyResponseClick:()=>h(t),canShowFeedbackForm:o})}></devtools-widget>`}
    </section>
  `}({message:t,isLoading:s,isReadOnly:i,canShowFeedbackForm:o,isLast:c.at(-1)===t,userInfo:n,markdownRenderer:a,onSuggestionClick:d,onFeedbackSubmit:h,onCopyResponseClick:u}))}
      ${m()}
    </div>
  `}({messages:i,isLoading:o,isReadOnly:a,canShowFeedbackForm:l,userInfo:h,markdownRenderer:u,changeSummary:m,changeManager:v,onSuggestionClick:f,onFeedbackSubmit:b,onMessageContainerRef:k,onCopyResponseClick:w});return function({isTextInputDisabled:e,suggestions:t,onSuggestionClick:s}){return Ne`<div class="empty-state-container">
    <div class="header">
      <div class="icon">
        <devtools-icon
          name="smart-assistant"
        ></devtools-icon>
      </div>
      <h1>${bt(Ge)}</h1>
    </div>
    <div class="empty-state-content">
      ${t.map(({title:t,jslogContext:i})=>Ne`<devtools-button
          class="suggestion"
          @click=${()=>s(t)}
          .data=${{variant:"outlined",size:"REGULAR",title:t,jslogContext:i??"suggestion",disabled:e}}
        >${t}</devtools-button>`)}
    </div>
  </div>`}({isTextInputDisabled:c,suggestions:d,onSuggestionClick:f})}({state:this.#ie.state,aidaAvailability:this.#ie.aidaAvailability,messages:this.#ie.messages,isLoading:this.#ie.isLoading,isReadOnly:this.#ie.isReadOnly,canShowFeedbackForm:this.#ie.canShowFeedbackForm,isTextInputDisabled:this.#ie.isTextInputDisabled,suggestions:this.#ie.emptyStateSuggestions,userInfo:this.#ie.userInfo,markdownRenderer:this.#ie.markdownRenderer,conversationType:this.#ie.conversationType,changeSummary:this.#ie.changeSummary,changeManager:this.#ie.changeManager,onSuggestionClick:this.#fe,onFeedbackSubmit:this.#ie.onFeedbackSubmit,onMessageContainerRef:this.#ue,onCopyResponseClick:this.#ie.onCopyResponseClick})}
          ${(()=>"chat-view"!==this.#ie.state?p.nothing:this.#ie.conversationType&&this.#ie.isReadOnly?function({onNewConversation:e,conversationType:t}){if(!t)return p.nothing;return Ne`<div
    class="chat-readonly-container"
    jslog=${y.section("read-only")}
  >
    <span>${bt(ct)}</span>
    <devtools-button
      aria-label=${bt(We)}
      class="chat-inline-button"
      @click=${e}
      .data=${{variant:"text",title:bt(We),jslogContext:"start-new-chat"}}
    >${bt(We)}</devtools-button>
  </div>`}({conversationType:this.#ie.conversationType,onNewConversation:this.#ie.onNewConversation}):function({isLoading:t,blockedByCrossOrigin:s,isTextInputDisabled:i,inputPlaceholder:o,selectedContext:n,inspectElementToggled:l,multimodalInputEnabled:c,conversationType:h,imageInput:u,isTextInputEmpty:g,uploadImageInputEnabled:m,aidaAvailability:v,disclaimerText:f,onContextClick:b,onInspectElementClick:w,onSubmit:x,onTextAreaKeyDown:S,onCancel:A,onNewConversation:I,onTakeScreenshot:T,onRemoveImageInput:$,onTextInputChange:j,onImageUpload:R}){if(!h)return p.nothing;const F="available"===v&&n,E=p.Directives.classMap({"chat-input-container":!0,"single-line-layout":!F,disabled:i});return Ne`
  <form class="input-form" @submit=${x}>
    <div class=${E}>
      ${function({multimodalInputEnabled:e,imageInput:t,isTextInputDisabled:s,onRemoveImageInput:i}){if(!e||!t||s)return p.nothing;const o=Ne`<devtools-button
      aria-label=${bt(ht)}
      @click=${i}
      .data=${{variant:"icon",size:"MICRO",iconName:"cross",title:bt(ht)}}
    ></devtools-button>`;if(t.isLoading)return Ne`<div class="image-input-container">
        ${o}
        <div class="loading">
          <devtools-spinner></devtools-spinner>
        </div>
      </div>`;return Ne`
    <div class="image-input-container">
      ${o}
      <img src="data:${t.mimeType};base64, ${t.data}" alt="Image input" />
    </div>`}({multimodalInputEnabled:c,imageInput:u,isTextInputDisabled:i,onRemoveImageInput:$})}
      <textarea class="chat-input"
        .disabled=${i}
        wrap="hard"
        maxlength="10000"
        @keydown=${S}
        @input=${e=>j(e.target.value)}
        placeholder=${o}
        jslog=${y.textField("query").track({change:!0,keydown:"Enter"})}
        aria-description=${ft(qe.inputTextAriaDescription)}
      ></textarea>
      <div class="chat-input-actions">
        <div class="chat-input-actions-left">
          ${F?function({selectedContext:t,inspectElementToggled:s,conversationType:i,isTextInputDisabled:o,onContextClick:n,onInspectElementClick:l}){if(!i)return p.nothing;const c="freestyler"===i,h=p.Directives.classMap({"not-selected":!t,"resource-link":!0,"has-picker-behavior":c,disabled:o});if(!t&&!c)return p.nothing;const u=e=>{"Enter"!==e.key&&" "!==e.key||n()};return Ne`<div class="select-element">
    ${c?Ne`
        <devtools-button
          .data=${{variant:"icon_toggle",size:"SMALL",iconName:"select-element",toggledIconName:"select-element",toggleType:"primary-toggle",toggled:s,title:bt(_e),jslogContext:"select-element",disabled:o}}
          @click=${l}
        ></devtools-button>
      `:p.nothing}
    <div
      role=button
      class=${h}
      tabindex=${c||o?"-1":"0"}
      @click=${n}
      @keydown=${u}
      aria-description=${ft(qe.revealContextDescription)}
    >
      ${function(e){if(!e)return p.nothing;const t=e.getItem();if(t instanceof a.NetworkRequest.NetworkRequest)return C.PanelUtils.getIconForNetworkRequest(t);if(t instanceof d.UISourceCode.UISourceCode)return C.PanelUtils.getIconForSourceFile(t);if(t instanceof r.AIContext.AgentFocus)return Ne`<devtools-icon name="performance" title="Performance"></devtools-icon>`;if(t instanceof a.DOMModel.DOMNode)return p.nothing;return p.nothing}(t)}
      <span class="title">${t?function(t,s){const i=t.getItem();if(i instanceof a.DOMModel.DOMNode){const t=i.classNames().filter(e=>e.startsWith(r.Injected.AI_ASSISTANCE_CSS_CLASS_NAME));return Ne`<devtools-widget .widgetConfig=${e.Widget.widgetConfig(k.DOMLinkifier.DOMNodeLink,{node:i,options:{hiddenClassList:t,disabled:s}})}></devtools-widget>`}return t.getTitle()}(t,o):bt(He)}</span>
    </div>
  </div>`}({selectedContext:n,inspectElementToggled:l,conversationType:h,isTextInputDisabled:i,onContextClick:b,onInspectElementClick:w}):p.nothing}
        </div>
        <div class="chat-input-actions-right">
          <div class="chat-input-disclaimer-container">
            ${xt({isLoading:t,blockedByCrossOrigin:s,tooltipId:wt,disclaimerText:f})}
          </div>
          ${function({multimodalInputEnabled:e,blockedByCrossOrigin:t,isTextInputDisabled:s,imageInput:i,uploadImageInputEnabled:o,onTakeScreenshot:n,onImageUpload:a}){if(!e||t)return p.nothing;const r=o?Ne`<devtools-button
    class="chat-input-button"
    aria-label=${bt(vt)}
    @click=${a}
    .data=${{variant:"icon",size:"REGULAR",disabled:s||i?.isLoading,iconName:"add-photo",title:bt(vt),jslogContext:"upload-image"}}
  ></devtools-button>`:p.nothing;return Ne`${r}<devtools-button
    class="chat-input-button"
    aria-label=${bt(dt)}
    @click=${n}
    .data=${{variant:"icon",size:"REGULAR",disabled:s||i?.isLoading,iconName:"photo-camera",title:bt(dt),jslogContext:"take-screenshot"}}
  ></devtools-button>`}({multimodalInputEnabled:c,blockedByCrossOrigin:s,isTextInputDisabled:i,imageInput:u,uploadImageInputEnabled:m,onTakeScreenshot:T,onImageUpload:R})}
          ${function({isLoading:e,blockedByCrossOrigin:t,isTextInputDisabled:s,isTextInputEmpty:i,imageInput:o,onCancel:n,onNewConversation:a}){if(e)return Ne`<devtools-button
      class="chat-input-button"
      aria-label=${bt(Be)}
      @click=${n}
      .data=${{variant:"icon",size:"REGULAR",iconName:"record-stop",title:bt(Be),jslogContext:"stop"}}
    ></devtools-button>`;if(t)return Ne`
      <devtools-button
        class="start-new-chat-button"
        aria-label=${bt(We)}
        @click=${a}
        .data=${{variant:"outlined",size:"SMALL",title:bt(We),jslogContext:"start-new-chat"}}
      >${bt(We)}</devtools-button>
    `;return Ne`<devtools-button
    class="chat-input-button"
    aria-label=${bt(Ve)}
    .data=${{type:"submit",variant:"icon",size:"REGULAR",disabled:s||i||o?.isLoading,iconName:"send",title:bt(Ve),jslogContext:"send"}}
  ></devtools-button>`}({isLoading:t,blockedByCrossOrigin:s,isTextInputDisabled:i,isTextInputEmpty:g,imageInput:u,onCancel:A,onNewConversation:I})}
        </div>
      </div>
    </div>
  </form>`}({isLoading:this.#ie.isLoading,blockedByCrossOrigin:this.#ie.blockedByCrossOrigin,isTextInputDisabled:this.#ie.isTextInputDisabled,inputPlaceholder:this.#ie.inputPlaceholder,disclaimerText:this.#ie.disclaimerText,selectedContext:this.#ie.selectedContext,inspectElementToggled:this.#ie.inspectElementToggled,multimodalInputEnabled:this.#ie.multimodalInputEnabled,conversationType:this.#ie.conversationType,imageInput:this.#ie.imageInput,aidaAvailability:this.#ie.aidaAvailability,isTextInputEmpty:this.#ie.isTextInputEmpty,uploadImageInputEnabled:this.#ie.uploadImageInputEnabled,onContextClick:this.#ie.onContextClick,onInspectElementClick:this.#ie.onInspectElementClick,onSubmit:this.#Z,onTextAreaKeyDown:this.#me,onCancel:this.#ve,onNewConversation:this.#ie.onNewConversation,onTakeScreenshot:this.#ie.onTakeScreenshot,onRemoveImageInput:this.#ie.onRemoveImageInput,onTextInputChange:this.#ie.onTextInputChange,onImageUpload:this.#ye}))()}
        </main>
       ${(()=>{if("chat-view"!==this.#ie.state)return p.nothing;const e=p.Directives.classMap({"chat-view-footer":!0,"has-conversation":!!this.#ie.conversationType,"is-read-only":this.#ie.isReadOnly});return Ne`
        <footer class=${e} jslog=${y.section("footer")}>
          ${xt({isLoading:this.#ie.isLoading,blockedByCrossOrigin:this.#ie.blockedByCrossOrigin,tooltipId:"relevant-data-link-footer",disclaimerText:this.#ie.disclaimerText})}
        </footer>
      `})()}
      </div>
    `,this.#te,{host:this})}}function Ct(e,t,{animate:s,ref:i}={}){let o=[];try{o=x.Marked.lexer(e);for(const e of o)t.renderToken(e)}catch{return Ne`${e}`}return Ne`<devtools-markdown-view
    .data=${{tokens:o,renderer:t,animationEnabled:s}}
    ${i?Ue(i):p.nothing}>
  </devtools-markdown-view>`}function xt({isLoading:t,blockedByCrossOrigin:s,tooltipId:i,disclaimerText:o}){const n=p.Directives.classMap({"chat-input-disclaimer":!0,"hide-divider":!t&&s});return Ne`
    <p class=${n}>
      <button
        class="link"
        role="link"
        aria-details=${i}
        jslog=${y.link("open-ai-settings").track({click:!0})}
        @click=${()=>{e.ViewManager.ViewManager.instance().showView("chrome-ai")}}
      >${bt("Relevant data")}</button>&nbsp;${bt("is sent to Google")}
      ${function(t,s){return Ne`
    <devtools-tooltip
      id=${t}
      variant=${"rich"}
    >
      <div class="info-tooltip-container">
        ${s}
        <button
          class="link tooltip-link"
          role="link"
          jslog=${y.link("open-ai-settings").track({click:!0})}
          @click=${()=>{e.ViewManager.ViewManager.instance().showView("chrome-ai")}}>${ft(qe.learnAbout)}
        </button>
      </div>
    </devtools-tooltip>`}(i,o)}
    </p>
  `}function St(e){return Ne`
    <div class="empty-state-container">
      <div class="disabled-view">
        <div class="disabled-view-icon-container">
          <devtools-icon
            name="smart-assistant"
          ></devtools-icon>
        </div>
        <div>
          ${e}
        </div>
      </div>
    </div>
  `}customElements.define("devtools-ai-chat-view",kt);var At=`@scope to (devtools-widget > *){.ai-assistance-explore-container{&,\n    *{box-sizing:border-box;margin:0;padding:0}width:100%;height:fit-content;display:flex;flex-direction:column;align-items:center;margin:auto 0;font:var(--sys-typescale-headline4);gap:var(--sys-size-8);padding:var(--sys-size-3);overflow:auto;scrollbar-gutter:stable both-edges;.link{padding:0;margin:0 3px}.header{flex-shrink:0;display:flex;flex-direction:column;width:100%;align-items:center;justify-content:center;justify-self:center;gap:var(--sys-size-4);.icon{display:flex;justify-content:center;align-items:center;height:var(--sys-size-14);width:var(--sys-size-14);border-radius:var(--sys-shape-corner-small);background:linear-gradient(135deg,var(--sys-color-gradient-primary),var(--sys-color-gradient-tertiary))}h1{font:var(--sys-typescale-headline4)}p{text-align:center;font:var(--sys-typescale-body4-regular)}.link{font:var(--sys-typescale-body4-regular)}}.content{flex-shrink:0;display:flex;flex-direction:column;gap:var(--sys-size-5);align-items:center;justify-content:center;justify-self:center}.feature-card{display:flex;padding:var(--sys-size-4) var(--sys-size-6);gap:10px;background-color:var(--sys-color-surface2);border-radius:var(--sys-shape-corner-medium-small);width:100%;align-items:center;.feature-card-icon{min-width:var(--sys-size-12);min-height:var(--sys-size-12);display:flex;justify-content:center;align-items:center;background-color:var(--sys-color-tonal-container);border-radius:var(--sys-shape-corner-full);devtools-icon{width:18px;height:18px}}.feature-card-content{h3{font:var(--sys-typescale-body3-medium)}p{font:var(--sys-typescale-body4-regular);line-height:18px}}}}.ai-assistance-explore-footer{flex-shrink:0;width:100%;display:flex;justify-content:center;align-items:center;padding-block:var(--sys-size-3);font:var(--sys-typescale-body5-regular);border-top:1px solid var(--sys-color-divider);text-wrap:balance;text-align:center;p{margin:0;padding:0}}}\n/*# sourceURL=${import.meta.resolve("././components/exploreWidget.css")} */`;const It="Explore AI assistance",Tt="Learn about AI in DevTools",$t=i.i18n.lockedString,jt=(t,s,i)=>{u(g`
      <style>
        ${At}
      </style>
      <div class="ai-assistance-explore-container">
        <div class="header">
          <div class="icon">
            <devtools-icon name="smart-assistant"></devtools-icon>
          </div>
          <h1>${$t(It)}</h1>
          <p>
            To chat about an item, right-click and select${" "}
            <strong>Ask AI</strong>.
            <button
              class="link"
              role="link"
              jslog=${y.link("open-ai-settings").track({click:!0})}
              @click=${()=>{e.ViewManager.ViewManager.instance().showView("chrome-ai")}}
            >${$t(Tt)}
            </button>
          </p>
        </div>
        <div class="content">
          ${t.featureCards.map(e=>g`
              <div class="feature-card">
                <div class="feature-card-icon">
                  <devtools-icon name=${e.icon}></devtools-icon>
                </div>
                <div class="feature-card-content">
                  <h3>${e.heading}</h3>
                  <p>${function(e){return g`Open
     <button
       class="link"
       role="link"
       jslog=${y.link(e.jslogContext).track({click:!0})}
       @click=${e.onClick}
     >${e.panelName}</button>
     ${e.text}`}(e)}</p>
                </div>
              </div>
            `)}
        </div>
      </div>
    `,i)};let Rt=class extends e.Widget.Widget{view;constructor(e,t){super(e),this.view=t??jt}wasShown(){super.wasShown(),this.requestUpdate()}performUpdate(){const t=n.Runtime.hostConfig,s=[];t.devToolsFreestyler?.enabled&&e.ViewManager.ViewManager.instance().hasView("elements")&&s.push({icon:"brush-2",heading:"CSS styles",jslogContext:"open-elements-panel",onClick:()=>{e.ViewManager.ViewManager.instance().showView("elements")},panelName:"Elements",text:"to ask about CSS styles"}),t.devToolsAiAssistanceNetworkAgent?.enabled&&e.ViewManager.ViewManager.instance().hasView("network")&&s.push({icon:"arrow-up-down",heading:"Network",jslogContext:"open-network-panel",onClick:()=>{e.ViewManager.ViewManager.instance().showView("network")},panelName:"Network",text:"to ask about a request's details"}),t.devToolsAiAssistanceFileAgent?.enabled&&e.ViewManager.ViewManager.instance().hasView("sources")&&s.push({icon:"document",heading:"Files",jslogContext:"open-sources-panel",onClick:()=>{e.ViewManager.ViewManager.instance().showView("sources")},panelName:"Sources",text:"to ask about a file's content"}),t.devToolsAiAssistancePerformanceAgent?.enabled&&e.ViewManager.ViewManager.instance().hasView("timeline")&&s.push({icon:"performance",heading:"Performance",jslogContext:"open-performance-panel",onClick:()=>{e.ViewManager.ViewManager.instance().showView("timeline")},panelName:"Performance",text:"to ask about a trace item"}),this.view({featureCards:s},{},this.contentElement)}};var Ft=Object.freeze({__proto__:null,DEFAULT_VIEW:jt,ExploreWidget:Rt});class Et extends A.MarkdownView.MarkdownInsightRenderer{templateForToken(e){if("code"===e.type){const t=e.text.split("\n");"css"===t[0]?.trim()&&(e.lang="css",e.text=t.slice(1).join("\n"))}return super.templateForToken(e)}}const{html:Mt}=p,{ref:Lt,createRef:Pt}=p.Directives;class zt extends Et{mainFrameId;lookupEvent;constructor(e="",t=()=>null){super(),this.mainFrameId=e,this.lookupEvent=t}templateForToken(e){if("link"===e.type&&e.href.startsWith("#")){if(e.href.startsWith("#node-")){const t=Number(e.href.replace("#node-","")),s=Pt();return this.#be(t,e.text).then(e=>{s.value&&e&&(s.value.textContent="",s.value.append(e))}),Mt`<span ${Lt(s)}>${e.text}</span>`}const s=this.lookupEvent(e.href.slice(1));if(!s)return Mt`${e.text}`;let i=e.text,o="";return E.Types.Events.isSyntheticNetworkRequest(s)?o=s.args.data.url:i+=` (${s.name})`,Mt`<a href="#" draggable=false .title=${o} @click=${e=>{e.stopPropagation(),t.Revealer.reveal(new a.TraceObject.RevealableEvent(s))}}>${i}</a>`}return super.templateForToken(e)}async#be(e,s){if(void 0===e)return;const i=a.TargetManager.TargetManager.instance().primaryPageTarget(),o=i?.model(a.DOMModel.DOMModel);if(!o)return;const n=await o.pushNodesByBackendIdsToFrontend(new Set([e])),r=n?.get(e);if(!r)return;if(r.frameId()!==this.mainFrameId)return;return await t.Linkifier.Linkifier.linkify(r,{textContent:s})}}const{html:Dt}=p,Nt={newChat:"New chat",help:"Help",settings:"Settings",sendFeedback:"Send feedback",newChatCreated:"New chat created",chatDeleted:"Chat deleted",history:"History",deleteChat:"Delete local chat",clearChatHistory:"Clear local chats",exportConversation:"Export conversation",noPastConversations:"No past conversations",followTheSteps:"Follow the steps above to ask a question",inputDisclaimerForEmptyState:"This is an experimental AI feature and won't always get it right.",responseCopiedToClipboard:"Response copied to clipboard"},Ot="Answer loading",Ut="Answer ready",qt="To talk about data from another origin, start a new chat",Vt="Ask a question about the selected element",Wt="Ask a question about the selected network request",Bt="Ask a question about the selected file",_t="Record a performance trace and select an item to ask a question",Ht="Select an element to ask a question",Gt="Select a network request to ask a question",Kt="Select a file to ask a question",Yt="Ask a question about the selected performance trace",Qt="Record or select a performance trace to ask a question",Jt="Chat messages and any data the inspected page can access via Web APIs are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",Zt="Chat messages and any data the inspected page can access via Web APIs are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",Xt="Chat messages and the selected network request are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",es="Chat messages and the selected network request are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",ts="Chat messages and the selected file are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won't always get it right.",ss="Chat messages and the selected file are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",is="Chat messages and trace data from your performance trace are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won't always get it right.",os="Chat messages and data from your performance trace are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",ns="Failed to take a screenshot. Please try again.",as="Failed to upload image. Please try again.",rs=i.i18n.registerUIStrings("panels/ai_assistance/AiAssistancePanel.ts",Nt),ls=i.i18n.getLocalizedString.bind(void 0,rs),cs=i.i18n.lockedString;function ds(e){return e&&e.nodeType()===Node.ELEMENT_NODE?e:null}function hs(t,s,i){p.render(Dt`
      ${function(e){return Dt`
    <div class="toolbar-container" role="toolbar" jslog=${y.toolbar()}>
      <devtools-toolbar class="freestyler-left-toolbar" role="presentation">
      ${e.showChatActions?Dt`<devtools-button
          title=${ls(Nt.newChat)}
          aria-label=${ls(Nt.newChat)}
          .iconName=${"plus"}
          .jslogContext=${"freestyler.new-chat"}
          .variant=${"toolbar"}
          @click=${e.onNewChatClick}></devtools-button>
        <div class="toolbar-divider"></div>
        <devtools-menu-button
          title=${ls(Nt.history)}
          aria-label=${ls(Nt.history)}
          .iconName=${"history"}
          .jslogContext=${"freestyler.history"}
          .populateMenuCall=${e.populateHistoryMenu}
        ></devtools-menu-button>`:p.nothing}
        ${e.showActiveConversationActions?Dt`
          <devtools-button
              title=${ls(Nt.deleteChat)}
              aria-label=${ls(Nt.deleteChat)}
              .iconName=${"bin"}
              .jslogContext=${"freestyler.delete"}
              .variant=${"toolbar"}
              @click=${e.onDeleteClick}>
          </devtools-button>
          <devtools-button
            title=${ls(Nt.exportConversation)}
            aria-label=${ls(Nt.exportConversation)}
            .iconName=${"download"}
            .disabled=${e.isLoading}
            .jslogContext=${"export-ai-conversation"}
            .variant=${"toolbar"}
            @click=${e.onExportConversationClick}>
          </devtools-button>`:p.nothing}
      </devtools-toolbar>
      <devtools-toolbar class="freestyler-right-toolbar" role="presentation">
        <x-link
          class="toolbar-feedback-link devtools-link"
          title=${Nt.sendFeedback}
          href=${"https://crbug.com/364805393"}
          jslog=${y.link().track({click:!0,keydown:"Enter|Space"}).context("freestyler.send-feedback")}
        >${Nt.sendFeedback}</x-link>
        <div class="toolbar-divider"></div>
        <devtools-button
          title=${ls(Nt.help)}
          aria-label=${ls(Nt.help)}
          .iconName=${"help"}
          .jslogContext=${"freestyler.help"}
          .variant=${"toolbar"}
          @click=${e.onHelpClick}></devtools-button>
        <devtools-button
          title=${ls(Nt.settings)}
          aria-label=${ls(Nt.settings)}
          .iconName=${"gear"}
          .jslogContext=${"freestyler.settings"}
          .variant=${"toolbar"}
          @click=${e.onSettingsClick}></devtools-button>
      </devtools-toolbar>
    </div>
  `}(t)}
      <div class="ai-assistance-view-container">
        ${"explore-view"!==t.state?Dt` <devtools-ai-chat-view
              .props=${t}
              ${p.Directives.ref(e=>{e&&e instanceof kt&&(s.chatView=e)})}
            ></devtools-ai-chat-view>`:Dt`<devtools-widget
              class="explore"
              .widgetConfig=${e.Widget.widgetConfig(Rt)}
            ></devtools-widget>`}
      </div>
    `,i)}function ps(e){return e?new r.StylingAgent.NodeContext(e):null}let us;class gs extends e.Panel.Panel{view;static panelName="freestyler";#we;#y;#v={};#ke=function(){return!n.Runtime.hostConfig.aidaAvailability?.disallowLogging}();#Ce;#xe=new r.ChangeManager.ChangeManager;#Se=new t.Mutex.Mutex;#Ae;#Ie;#Te=null;#$e=null;#je=null;#Re=null;#Fe=[];#Ee=!1;#Me=!1;#Le=null;#Pe;#ze;#De;#Ne=!0;#Oe=null;#Ue;#qe=new AbortController;constructor(t=hs,{aidaClient:s,aidaAvailability:i,syncInfo:o}){super(gs.panelName),this.view=t,this.registerRequiredCSS(M),this.#Ce=this.#Ve(),this.#y=s,this.#Pe=i,this.#ze={accountImage:o.accountImage,accountFullName:o.accountFullName},this.#Ue=r.ConversationHandler.ConversationHandler.instance({aidaClient:this.#y,aidaAvailability:i}),e.ActionRegistry.ActionRegistry.instance().hasAction("elements.toggle-element-search")&&(this.#we=e.ActionRegistry.ActionRegistry.instance().getAction("elements.toggle-element-search")),r.AiHistoryStorage.AiHistoryStorage.instance().addEventListener("AiHistoryDeleted",this.#We,this)}#Be(){const e=!0===n.Runtime.hostConfig.aidaAvailability?.blockedByAge;return"available"!==this.#Pe||!this.#Ce?.getIfNotDisabled()||e?"disabled-view":this.#Ie?.type?"chat-view":"explore-view"}#Ve(){try{return t.Settings.moduleSetting("ai-assistance-enabled")}catch{return}}static async instance(e={forceNew:null}){const{forceNew:t}=e;if(!us||t){const e=new s.AidaClient.AidaClient,t=new Promise(e=>s.InspectorFrontendHost.InspectorFrontendHostInstance.getSyncInformation(e)),[i,o]=await Promise.all([s.AidaClient.AidaClient.checkAccessPreconditions(),t]);us=new gs(hs,{aidaClient:e,aidaAvailability:i,syncInfo:o})}return us}#_e(){const t=e.Context.Context.instance().flavor(w.TimelinePanel.TimelinePanel);t!==this.#Oe&&(this.#Oe?.removeEventListener("IsViewingTrace",this.requestUpdate,this),this.#Oe=t,this.#Oe&&this.#Oe.addEventListener("IsViewingTrace",this.requestUpdate,this))}#He(){if(this.#Ae&&this.#Ie&&!this.#Ie.isEmpty||this.#Me)return;const{hostConfig:t}=n.Runtime,s=e.ViewManager.ViewManager.instance(),i=s.isViewVisible("elements"),o=s.isViewVisible("network"),a=s.isViewVisible("sources"),r=s.isViewVisible("timeline");let l;if(i&&t.devToolsFreestyler?.enabled?l="freestyler":o&&t.devToolsAiAssistanceNetworkAgent?.enabled?l="drjones-network-request":a&&t.devToolsAiAssistanceFileAgent?.enabled?l="drjones-file":r&&t.devToolsAiAssistancePerformanceAgent?.enabled&&(l="drjones-performance-full"),this.#Ie?.type===l)return;const c=l?this.#Ue.createAgent(l,this.#xe):void 0;this.#Ge({agent:c})}#Ge(e){this.#Ae!==e?.agent&&(this.#Ke(),this.#Fe=[],this.#Me=!1,this.#Ie?.archiveConversation(),this.#Ae=e?.agent,e?.agent&&(this.#Ie=new r.AiHistoryStorage.Conversation(function(e){if(e instanceof r.StylingAgent.StylingAgent)return"freestyler";if(e instanceof r.NetworkAgent.NetworkAgent)return"drjones-network-request";if(e instanceof r.FileAgent.FileAgent)return"drjones-file";if(e instanceof r.PerformanceAgent.PerformanceAgent)return e.getConversationType();throw new Error("Provided agent does not have a corresponding conversation type")}(e?.agent),[],e?.agent.id,!1))),e?.agent||(this.#Ie=void 0,this.#Fe=[],e?.conversation&&(this.#Ie=e?.conversation)),this.#Ae||this.#Ie||this.#He(),this.#Ye(),this.requestUpdate()}wasShown(){var t,i;super.wasShown(),this.#v.chatView?.restoreScrollPosition(),this.#v.chatView?.focusTextInput(),this.#Qe(),this.#$e=ps(ds(e.Context.Context.instance().flavor(a.DOMModel.DOMNode))),this.#Re=function(e){if(!e)return null;const t=b.NetworkPanel.NetworkPanel.instance().networkLogView.timeCalculator();return new r.NetworkAgent.RequestContext(e,t)}(e.Context.Context.instance().flavor(a.NetworkRequest.NetworkRequest)),this.#je=(t=e.Context.Context.instance().flavor(r.AIContext.AgentFocus))?new r.PerformanceAgent.PerformanceTraceContext(t):null,this.#Te=(i=e.Context.Context.instance().flavor(d.UISourceCode.UISourceCode))?new r.FileAgent.FileContext(i):null,this.#Ge({agent:this.#Ae}),this.#Ce?.addChangeListener(this.requestUpdate,this),s.AidaClient.HostConfigTracker.instance().addEventListener("aidaAvailabilityChanged",this.#Qe),this.#we?.addEventListener("Toggled",this.requestUpdate,this),e.Context.Context.instance().addFlavorChangeListener(a.DOMModel.DOMNode,this.#Je),e.Context.Context.instance().addFlavorChangeListener(a.NetworkRequest.NetworkRequest,this.#Ze),e.Context.Context.instance().addFlavorChangeListener(r.AIContext.AgentFocus,this.#Xe),e.Context.Context.instance().addFlavorChangeListener(d.UISourceCode.UISourceCode,this.#et),e.ViewManager.ViewManager.instance().addEventListener("ViewVisibilityChanged",this.#He,this),a.TargetManager.TargetManager.instance().addModelListener(a.DOMModel.DOMModel,a.DOMModel.Events.AttrModified,this.#tt,this),a.TargetManager.TargetManager.instance().addModelListener(a.DOMModel.DOMModel,a.DOMModel.Events.AttrRemoved,this.#tt,this),a.TargetManager.TargetManager.instance().addModelListener(a.ResourceTreeModel.ResourceTreeModel,a.ResourceTreeModel.Events.PrimaryPageChanged,this.#st,this),e.Context.Context.instance().addFlavorChangeListener(w.TimelinePanel.TimelinePanel,this.#_e,this),this.#_e(),this.#He(),s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistancePanelOpened)}willHide(){super.willHide(),this.#Ce?.removeChangeListener(this.requestUpdate,this),s.AidaClient.HostConfigTracker.instance().removeEventListener("aidaAvailabilityChanged",this.#Qe),this.#we?.removeEventListener("Toggled",this.requestUpdate,this),e.Context.Context.instance().removeFlavorChangeListener(a.DOMModel.DOMNode,this.#Je),e.Context.Context.instance().removeFlavorChangeListener(a.NetworkRequest.NetworkRequest,this.#Ze),e.Context.Context.instance().removeFlavorChangeListener(r.AIContext.AgentFocus,this.#Xe),e.Context.Context.instance().removeFlavorChangeListener(d.UISourceCode.UISourceCode,this.#et),e.ViewManager.ViewManager.instance().removeEventListener("ViewVisibilityChanged",this.#He,this),e.Context.Context.instance().removeFlavorChangeListener(w.TimelinePanel.TimelinePanel,this.#_e,this),a.TargetManager.TargetManager.instance().removeModelListener(a.DOMModel.DOMModel,a.DOMModel.Events.AttrModified,this.#tt,this),a.TargetManager.TargetManager.instance().removeModelListener(a.DOMModel.DOMModel,a.DOMModel.Events.AttrRemoved,this.#tt,this),a.TargetManager.TargetManager.instance().removeModelListener(a.ResourceTreeModel.ResourceTreeModel,a.ResourceTreeModel.Events.PrimaryPageChanged,this.#st,this),this.#Oe&&(this.#Oe.removeEventListener("IsViewingTrace",this.requestUpdate,this),this.#Oe=null)}#Qe=async()=>{const e=await s.AidaClient.AidaClient.checkAccessPreconditions();if(e!==this.#Pe){this.#Pe=e;const t=await new Promise(e=>s.InspectorFrontendHost.InspectorFrontendHostInstance.getSyncInformation(e));this.#ze={accountImage:t.accountImage,accountFullName:t.accountFullName},this.requestUpdate()}};#Je=e=>{this.#$e?.getItem()!==e.data&&(this.#$e=ps(ds(e.data)),this.#Ge({agent:this.#Ae}))};#tt=e=>{this.#$e?.getItem()===e.data.node&&("class"!==e.data.name&&"id"!==e.data.name||this.requestUpdate())};#Ze=e=>{if(this.#Re?.getItem()!==e.data){if(Boolean(e.data)){const t=b.NetworkPanel.NetworkPanel.instance().networkLogView.timeCalculator();this.#Re=new r.NetworkAgent.RequestContext(e.data,t)}else this.#Re=null;this.#Ge({agent:this.#Ae})}};#Xe=e=>{this.#je?.getItem()!==e.data&&(this.#je=Boolean(e.data)?new r.PerformanceAgent.PerformanceTraceContext(e.data):null,this.#Ge({agent:this.#Ae}))};#et=e=>{const t=e.data;t&&this.#Te?.getItem()!==t&&(this.#Te=new r.FileAgent.FileContext(e.data),this.#Ge({agent:this.#Ae}))};#st(){this.#De&&(this.#De=void 0,this.requestUpdate())}#it(){if(ye()&&this.#Ae&&!this.#Ie?.isReadOnly)return this.#xe.formatChangesForPatching(this.#Ae.id,!0)}async performUpdate(){const t=await async function(e,t){if(e){const t=await e.getSuggestions();if(t)return t}if(!t?.type||t.isReadOnly)return[];switch(t.type){case"freestyler":return[{title:"What can you help me with?",jslogContext:"styling-default"},{title:"Why isn’t this element visible?",jslogContext:"styling-default"},{title:"How do I center this element?",jslogContext:"styling-default"}];case"drjones-file":return[{title:"What does this script do?",jslogContext:"file-default"},{title:"Is the script optimized for performance?",jslogContext:"file-default"},{title:"Does the script handle user input safely?",jslogContext:"file-default"}];case"drjones-network-request":return[{title:"Why is this network request taking so long?",jslogContext:"network-default"},{title:"Are there any security headers present?",jslogContext:"network-default"},{title:"Why is the request failing?",jslogContext:"network-default"}];case"drjones-performance-full":return[{title:"What performance issues exist with my page?",jslogContext:"performance-default"}];default:o.assertNever(t.type,"Unknown conversation type")}}(this.#Le,this.#Ie),i=function(e,t){if(e instanceof r.PerformanceAgent.PerformanceTraceContext){if(!e.external){const t=e.getItem();return new zt(t.parsedTrace.data.Meta.mainFrameId,t.lookupEvent.bind(t))}}else if("drjones-performance-full"===t?.type)return new zt;return new Et}(this.#Le,this.#Ie);this.view({state:this.#Be(),blockedByCrossOrigin:this.#Ee,aidaAvailability:this.#Pe,isLoading:this.#Me,messages:this.#Fe,selectedContext:this.#Le,conversationType:this.#Ie?.type,isReadOnly:this.#Ie?.isReadOnly??!1,changeSummary:this.#it(),inspectElementToggled:this.#we?.toggled()??!1,userInfo:this.#ze,canShowFeedbackForm:this.#ke,multimodalInputEnabled:fs()&&"freestyler"===this.#Ie?.type,imageInput:this.#De,showChatActions:this.#ot(),showActiveConversationActions:Boolean(this.#Ie&&!this.#Ie.isEmpty),isTextInputDisabled:this.#nt(),emptyStateSuggestions:t,inputPlaceholder:this.#at(),disclaimerText:this.#rt(),isTextInputEmpty:this.#Ne,changeManager:this.#xe,uploadImageInputEnabled:ys()&&"freestyler"===this.#Ie?.type,markdownRenderer:i,onNewChatClick:this.#lt.bind(this),populateHistoryMenu:this.#ct.bind(this),onDeleteClick:this.#dt.bind(this),onExportConversationClick:this.#ht.bind(this),onHelpClick:()=>{e.UIUtils.openInNewTab("https://developer.chrome.com/docs/devtools/ai-assistance")},onSettingsClick:()=>{e.ViewManager.ViewManager.instance().showView("chrome-ai")},onTextSubmit:async(e,t,i)=>{this.#De=void 0,this.#Ne=!0,s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceQuerySubmitted),await this.#pt(e,t,i)},onInspectElementClick:this.#ut.bind(this),onFeedbackSubmit:this.#gt.bind(this),onCancelClick:this.#Ke.bind(this),onContextClick:this.#mt.bind(this),onNewConversation:this.#lt.bind(this),onTakeScreenshot:fs()?this.#vt.bind(this):void 0,onRemoveImageInput:fs()?this.#yt.bind(this):void 0,onCopyResponseClick:this.#ft.bind(this),onTextInputChange:this.#bt.bind(this),onLoadImage:ys()?this.#wt.bind(this):void 0},this.#v,this.contentElement)}#ft(e){const t=ms(e);t&&(s.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(t),h.Snackbar.Snackbar.show({message:ls(Nt.responseCopiedToClipboard)}))}#ut(){e.Context.Context.instance().setFlavor(t.ReturnToPanel.ReturnToPanelFlavor,new t.ReturnToPanel.ReturnToPanelFlavor(this.panelName)),this.#we?.execute()}#nt(){const e=this.#Ce?.getIfNotDisabled(),t=!0===n.Runtime.hostConfig.aidaAvailability?.blockedByAge;if(!e||t)return!0;return!("available"===this.#Pe)||(!!this.#Ee||(!this.#Ie||!this.#Le))}#ot(){const e=this.#Ce?.getIfNotDisabled(),t=!0===n.Runtime.hostConfig.aidaAvailability?.blockedByAge;return!(!e||t)&&("no-account-email"!==this.#Pe&&"sync-is-paused"!==this.#Pe)}#at(){if("disabled-view"===this.#Be()||!this.#Ie)return ls(Nt.followTheSteps);if(this.#Ee)return cs(qt);switch(this.#Ie.type){case"freestyler":return this.#Le?cs(Vt):cs(Ht);case"drjones-file":return this.#Le?cs(Bt):cs(Kt);case"drjones-network-request":return this.#Le?cs(Wt):cs(Gt);case"drjones-performance-full":{const t=e.Context.Context.instance().flavor(w.TimelinePanel.TimelinePanel);return t?.hasActiveTrace()?this.#Le?cs(Yt):cs(Qt):cs(_t)}}}#rt(){if("disabled-view"===this.#Be()||!this.#Ie||this.#Ie.isReadOnly)return ls(Nt.inputDisclaimerForEmptyState);const e=n.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===n.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;switch(this.#Ie.type){case"freestyler":return cs(e?Zt:Jt);case"drjones-file":return cs(e?ss:ts);case"drjones-network-request":return cs(e?es:Xt);case"drjones-performance-full":return cs(e?os:is)}}#gt(e,t,s){this.#y.registerClientEvent({corresponding_aida_rpc_global_id:e,disable_user_content_logging:!this.#ke,do_conversation_client_event:{user_feedback:{sentiment:t,user_input:{comment:s}}}})}#mt(){const e=this.#Le;if(e instanceof r.NetworkAgent.RequestContext){const s=f.UIRequestLocation.UIRequestLocation.tab(e.getItem(),"headers-component");return t.Revealer.reveal(s)}if(e instanceof r.FileAgent.FileContext)return t.Revealer.reveal(e.getItem().uiLocation(0,0));if(e instanceof r.PerformanceAgent.PerformanceTraceContext){const s=e.getItem();if(s.callTree){const e=s.callTree.selectedNode?.event??s.callTree.rootNode.event,i=new a.TraceObject.RevealableEvent(e);return t.Revealer.reveal(i)}if(s.insight)return t.Revealer.reveal(s.insight)}}#kt(){const e=Boolean(n.Runtime.hostConfig.aidaAvailability?.enabled),t=Boolean(n.Runtime.hostConfig.aidaAvailability?.blockedByAge),s=Boolean("available"===this.#Pe),i=Boolean(this.#Ce?.getIfNotDisabled());return e&&s&&i&&!t}async handleAction(e,t){if(this.#Me&&!t?.prompt)return void this.#v.chatView?.focusTextInput();let i;switch(e){case"freestyler.elements-floating-button":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromElementsPanelFloatingButton),i="freestyler";break;case"freestyler.element-panel-context":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromElementsPanel),i="freestyler";break;case"drjones.network-floating-button":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromNetworkPanelFloatingButton),i="drjones-network-request";break;case"drjones.network-panel-context":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromNetworkPanel),i="drjones-network-request";break;case"drjones.performance-panel-context":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromPerformancePanelCallTree),i="drjones-performance-full";break;case"drjones.sources-floating-button":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromSourcesPanelFloatingButton),i="drjones-file";break;case"drjones.sources-panel-context":s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceOpenedFromSourcesPanel),i="drjones-file"}if(!i)return;let o=this.#Ae;this.#Ie&&this.#Ae&&this.#Ie.type===i&&!this.#Ie?.isEmpty||(o=this.#Ue.createAgent(i,this.#xe)),this.#Ge({agent:o});const n=t?.prompt;if(n&&"string"==typeof n){if(!this.#kt())return;this.#De=void 0,this.#Ne=!0,s.userMetrics.actionTaken(s.UserMetrics.Action.AiAssistanceQuerySubmitted),this.#Ee&&this.#lt(),await this.#pt(n)}else this.#v.chatView?.focusTextInput()}#ct(e){const t=r.AiHistoryStorage.AiHistoryStorage.instance().getHistory().map(e=>r.AiHistoryStorage.Conversation.fromSerializedConversation(e));for(const s of t.reverse()){if(s.isEmpty)continue;const t=s.title;t&&e.defaultSection().appendCheckboxItem(t,()=>{this.#Ct(s)},{checked:this.#Ie===s,jslogContext:"freestyler.history-item"})}const s=0===e.defaultSection().items.length;s&&e.defaultSection().appendItem(ls(Nt.noPastConversations),()=>{},{disabled:!0}),e.footerSection().appendItem(ls(Nt.clearChatHistory),()=>{r.AiHistoryStorage.AiHistoryStorage.instance().deleteAll()},{disabled:s})}#We(){this.#Ge()}#dt(){this.#Ie&&(r.AiHistoryStorage.AiHistoryStorage.instance().deleteHistoryEntry(this.#Ie.id),this.#Ge(),e.ARIAUtils.LiveAnnouncer.alert(ls(Nt.chatDeleted)))}async#ht(){if(!this.#Ie)return;const e=this.#Ie.getConversationMarkdown(),t=new c.ContentData.ContentData(e,!1,"text/markdown"),s="devtools_";let i=o.StringUtilities.toSnakeCase(this.#Ie.title||"")||"conversation";i.length>52&&(i=i.substring(0,52));const n=`${s}${i}.md`;await d.FileManager.FileManager.instance().save(n,t,!0),d.FileManager.FileManager.instance().close(n)}async#Ct(e){this.#Ie!==e&&(this.#Ge({conversation:e}),await this.#xt(e.history))}#lt(){this.#Ge(),e.ARIAUtils.LiveAnnouncer.alert(ls(Nt.newChatCreated))}async#vt(){const e=a.TargetManager.TargetManager.instance().primaryPageTarget();if(!e)throw new Error("Could not find main target");const t=e.model(a.ScreenCaptureModel.ScreenCaptureModel);if(!t)throw new Error("Could not find model");const s=setTimeout(()=>{this.#De={isLoading:!0},this.requestUpdate()},100),i=await t.captureScreenshot("jpeg",100,"fromViewport");clearTimeout(s),i?(this.#De={isLoading:!1,data:i,mimeType:"image/jpeg",inputType:"screenshot"},this.requestUpdate(),this.updateComplete.then(()=>{this.#v.chatView?.focusTextInput()})):(this.#De=void 0,this.requestUpdate(),h.Snackbar.Snackbar.show({message:cs(ns)}))}#yt(){this.#De=void 0,this.requestUpdate(),this.updateComplete.then(()=>{this.#v.chatView?.focusTextInput()})}#bt(e){const t=!e;t!==this.#Ne&&(this.#Ne=t,this.requestUpdate())}async#wt(e){const t=setTimeout(()=>{this.#De={isLoading:!0},this.requestUpdate()},100),s=new FileReader;let i;try{i=await new Promise((t,i)=>{s.onload=()=>{"string"==typeof s.result?t(s.result):i(new Error("FileReader result was not a string."))},s.readAsDataURL(e)})}catch{return clearTimeout(t),this.#De=void 0,this.requestUpdate(),this.updateComplete.then(()=>{this.#v.chatView?.focusTextInput()}),void h.Snackbar.Snackbar.show({message:cs(as)})}if(clearTimeout(t),!i)return;const o=i.indexOf(","),n=i.substring(o+1);this.#De={isLoading:!1,data:n,mimeType:e.type,inputType:"uploaded-image"},this.requestUpdate(),this.updateComplete.then(()=>{this.#v.chatView?.focusTextInput()})}#Ke(){this.#qe.abort(),this.#qe=new AbortController}#Ye(){if(this.#Ae){if(this.#Le=this.#St(this.#Ie),!this.#Le)return this.#Ee=!1,void this.#v.chatView?.clearTextInput();this.#Ee=!this.#Le.isOriginAllowed(this.#Ae.origin)}else this.#Ee=!1}#St(e){if(!e)return null;let t;switch(e.type){case"freestyler":t=this.#$e;break;case"drjones-file":t=this.#Te;break;case"drjones-network-request":t=this.#Re;break;case"drjones-performance-full":t=this.#je}return t}async#pt(e,t,s){if(!this.#Ae)return;this.#Ke();const i=this.#qe.signal,o=this.#St(this.#Ie);if(o&&!o.isOriginAllowed(this.#Ae.origin))throw new Error("cross-origin context data should not be included");this.#Ie?.isEmpty&&l.UserBadges.instance().recordAction(l.BadgeAction.STARTED_AI_CONVERSATION);const n=fs()?t:void 0,a=n?crypto.randomUUID():void 0,r=n&&a&&s?{input:n,id:a,type:s}:void 0;this.#Ie&&y.logFunctionCall(`start-conversation-${this.#Ie.type}`,"ui");const c=this.#Ae.run(e,{signal:i,selected:o},r),d=this.#Ue.handleConversationWithHistory(c,this.#Ie);await this.#xt(d)}async#xt(t){const s=await this.#Se.acquire();try{let i={entity:"model",steps:[]},o={isLoading:!0};function n(){i.steps.at(-1)!==o&&i.steps.push(o)}this.#Me=!0;let a=!1,r=!1;for await(const l of t){switch(o.sideEffect=void 0,l.type){case"user-query":this.#Fe.push({entity:"user",text:l.query,imageInput:l.imageInput}),i={entity:"model",steps:[]},this.#Fe.push(i);break;case"querying":o={isLoading:!0},i.steps.length||i.steps.push(o);break;case"context":o.title=l.title,o.contextDetails=l.details,o.isLoading=!1,n();break;case"title":o.title=l.title,n();break;case"thought":o.isLoading=!1,o.thought=l.thought,n();break;case"suggestions":i.suggestions=l.suggestions;break;case"side-effect":o.isLoading=!1,o.code??=l.code,o.sideEffect={onAnswer:e=>{l.confirm(e),o.sideEffect=void 0,this.requestUpdate()}},n();break;case"action":o.isLoading=!1,o.code??=l.code,o.output??=l.output,o.canceled=l.canceled,n();break;case"answer":i.suggestions??=l.suggestions,i.answer=l.text,i.rpcId=l.rpcId,1===i.steps.length&&i.steps[0].isLoading&&i.steps.pop(),o.isLoading=!1;break;case"error":{i.error=l.error,i.rpcId=void 0;const c=i.steps.at(-1);c&&("abort"===l.error?c.canceled=!0:c.isLoading&&i.steps.pop()),"block"===l.error&&(i.answer=void 0)}}if(!this.#Ie?.isReadOnly)switch(this.requestUpdate(),"context"!==l.type&&"side-effect"!==l.type||this.#v.chatView?.scrollToBottom(),l.type){case"context":e.ARIAUtils.LiveAnnouncer.status(l.title);break;case"answer":l.complete||a?l.complete&&!r&&(r=!0,e.ARIAUtils.LiveAnnouncer.status(cs(Ut))):(a=!0,e.ARIAUtils.LiveAnnouncer.status(cs(Ot)))}}this.#Me=!1,this.requestUpdate()}finally{s()}}}function ms(e){const t=["## AI"];for(const s of e.steps)s.title&&t.push(`### ${s.title}`),s.contextDetails&&t.push(r.AiHistoryStorage.Conversation.generateContextDetailsMarkdown(s.contextDetails)),s.thought&&t.push(s.thought),s.code&&t.push(`**Code executed:**\n\`\`\`\n${s.code.trim()}\n\`\`\``),s.output&&t.push(`**Data returned:**\n\`\`\`\n${s.output}\n\`\`\``);return e.answer&&t.push(`### Answer\n\n${e.answer}`),t.join("\n\n")}class vs{handleAction(t,s,i){switch(s){case"freestyler.elements-floating-button":case"freestyler.element-panel-context":case"freestyler.main-menu":case"drjones.network-floating-button":case"drjones.network-panel-context":case"drjones.performance-panel-context":case"drjones.sources-floating-button":case"drjones.sources-panel-context":return(async()=>{const t=e.ViewManager.ViewManager.instance().view(gs.panelName);if(!t)return;await e.ViewManager.ViewManager.instance().showView(gs.panelName);const o=e.InspectorView.InspectorView.instance().totalSize()/4;e.InspectorView.InspectorView.instance().drawerSize()<o&&e.InspectorView.InspectorView.instance().setDrawerSize(o);(await t.widget()).handleAction(s,i)})(),!0}return!1}}function ys(){return fs()&&Boolean(n.Runtime.hostConfig.devToolsFreestyler?.multimodalUploadInput)}function fs(){return Boolean(n.Runtime.hostConfig.devToolsFreestyler?.multimodal)}export{vs as ActionDelegate,gs as AiAssistancePanel,kt as ChatView,Ft as ExploreWidget,Et as MarkdownRendererWithCodeBlock,fe as PatchWidget,W as SELECT_WORKSPACE_DIALOG_DEFAULT_VIEW,B as SelectWorkspaceDialog,De as UserActionRow,ms as getResponseMarkdown};
//# sourceMappingURL=ai_assistance.js.map
