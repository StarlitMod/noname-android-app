import*as e from"../../ui/components/markdown_view/markdown_view.js";import*as t from"../../core/i18n/i18n.js";import*as s from"../../third_party/marked/marked.js";import"../../ui/components/buttons/buttons.js";import*as o from"../../ui/legacy/legacy.js";import{render as n,html as i}from"../../ui/lit/lit.js";import*as r from"../../ui/visual_logging/visual_logging.js";import*as a from"../../core/common/common.js";import*as l from"../../core/host/host.js";let c=!1;function d(){if(!c){for(const{key:t,link:s}of v.markdownLinks)e.MarkdownLinksMap.markdownLinks.set(t,s);c=!0}return v}let v={version:83,header:"What's new in DevTools 142",markdownLinks:[{key:"perf-ai-agent",link:"https://developer.chrome.com/blog/new-in-devtools-142/#perf-ai-agent"},{key:"ai-code-completion",link:"https://developer.chrome.com/blog/new-in-devtools-142/#ai-code-completion"},{key:"gdp",link:"https://developer.chrome.com/blog/new-in-devtools-142/#gdp"},{key:"ai-main-button",link:"https://developer.chrome.com/blog/new-in-devtools-142/#ai-main-button"}],videoLinks:[{description:"See past highlights from Chrome 141",link:"https://developer.chrome.com/blog/new-in-devtools-141",type:"WhatsNew"}],link:"https://developer.chrome.com/blog/new-in-devtools-142/"};var m=Object.freeze({__proto__:null,getReleaseNote:d,setReleaseNoteForTest:function(e){v=e}}),g=`@scope to (devtools-widget > *){.whatsnew{background:var(--sys-color-header-container);flex-grow:1;flex-shrink:0;display:flex;width:100%;height:100%;overflow:auto;justify-content:center}.whatsnew-content{max-width:var(--sys-size-35);padding:var(--sys-size-9) 0 0;>*{padding:0 var(--sys-size-9) var(--sys-size-9) var(--sys-size-9)}}.header{display:flex;align-items:center;font:var(--sys-typescale-headline4);&::before{content:"";width:var(--sys-size-9);height:var(--sys-size-9);transform:scale(1.6);margin:0 var(--sys-size-8) 0 var(--sys-size-4);background-image:var(--image-file-devtools);flex-shrink:0}}.feature-container{flex-grow:1;padding:0;background-color:var(--sys-color-surface);border-radius:var(--sys-shape-corner-large) var(--sys-shape-corner-large) 0 0;display:flex;flex-direction:column}.feature{background-color:var(--sys-color-surface3);padding:0 var(--sys-size-8) var(--sys-size-8);border-radius:var(--sys-shape-corner-medium);margin:0 var(--sys-size-9) var(--sys-size-9)}.video-container{margin-bottom:var(--sys-size-9);&:has(.video){--video-bottom-padding:var(--sys-size-6);overflow:auto;display:flex;flex-direction:row;gap:var(--sys-size-5);padding:var(--sys-size-9) var(--sys-size-9) var(--video-bottom-padding);margin-bottom:calc(var(--sys-size-9) - var(--video-bottom-padding));> *{min-width:auto}}}.video{align-items:center;display:flex;flex-direction:row;border-radius:var(--sys-shape-corner-medium);background-color:var(--sys-color-surface3);font:var(--sys-typescale-body5-regular);min-width:var(--sys-size-29);max-width:var(--sys-size-32);overflow:hidden;height:72px;&:hover{box-shadow:var(--sys-elevation-level3)}.thumbnail{border-radius:var(--sys-shape-corner-medium) 0 0 var(--sys-shape-corner-medium);flex-shrink:0}.thumbnail-description{--description-margin:var(--sys-size-6);margin:var(--description-margin);height:calc(100% - var(--description-margin) * 2);overflow:hidden}}x-link:focus .video{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring)}@media (forced-colors: active){.feature,\n    .video{border:var(--sys-size-1) solid ButtonText}}}\n/*# sourceURL=${import.meta.resolve("./releaseNoteView.css")} */`;const h={seeFeatures:"See all new features"},p=t.i18n.registerUIStrings("panels/whats_new/ReleaseNoteView.ts",h),u=t.i18n.getLocalizedString.bind(void 0,p),w="../../Images/whatsnew.svg",f="../../Images/devtools-tips.svg",y="../../Images/devtools-thumbnail.svg";async function k(){const e=await b.getFileContent(),t=s.Marked.lexer(e),o=[];let n=Number.MAX_SAFE_INTEGER;return t.forEach(e=>{"heading"===e.type&&n>=e.depth?(o.push([e]),n=e.depth):o.length>0?o[o.length-1].push(e):o.push([e])}),o}class b extends o.Panel.Panel{#e;constructor(e=(e,t,s)=>{const o=e.getReleaseNote(),a=e.markdownContent;n(i`
      <style>${g}</style>
      <div class="whatsnew" jslog=${r.section().context("release-notes")}>
        <div class="whatsnew-content">
          <div class="header">
            ${o.header}
          </div>
          <div>
            <devtools-button
                  .variant=${"primary"}
                  .jslogContext=${"learn-more"}
                  @click=${()=>e.openNewTab(o.link)}
              >${u(h.seeFeatures)}</devtools-button>
          </div>

          <div class="feature-container">
            <div class="video-container">
              ${o.videoLinks.map(t=>i`
                  <x-link
                  href=${t.link}
                  jslog=${r.link().track({click:!0}).context("learn-more")}>
                    <div class="video">
                      <img class="thumbnail" src=${e.getThumbnailPath(t.type??"WhatsNew")}>
                      <div class="thumbnail-description"><span>${t.description}</span></div>
                    </div>
                </x-link>
                `)}
            </div>
            ${a.map(e=>i`
                  <div class="feature">
                    <devtools-markdown-view slot="content" .data=${{tokens:e}}>
                    </devtools-markdown-view>
                  </div>`)}
          </div>
        </div>
      </div>
    `,s)}){super("whats-new",!0),this.#e=e,this.requestUpdate()}static async getFileContent(){const e=new URL("./resources/WNDT.md",import.meta.url);try{const t=await fetch(e.toString());return await t.text()}catch{throw new Error(`Markdown file ${e.toString()} not found. Make sure it is correctly listed in the relevant BUILD.gn files.`)}}async performUpdate(){const e=await k();this.#e({getReleaseNote:d,openNewTab:o.UIUtils.openInNewTab,markdownContent:e,getThumbnailPath:this.#t},this,this.contentElement)}#t(e){let t;switch(e){case"WhatsNew":t=w;break;case"DevtoolsTips":t=f;break;case"Other":t=y}return new URL(t,import.meta.url).toString()}}var N=Object.freeze({__proto__:null,DEVTOOLS_TIPS_THUMBNAIL:f,GENERAL_THUMBNAIL:y,ReleaseNoteView:b,WHATS_NEW_THUMBNAIL:w,getMarkdownContent:k});const z="releaseNoteVersionSeen",x="release-note";let S,_,T,I;function L(){return function(e,t,s){const n=a.Settings.Settings.instance().createSetting(z,0);if(!e)return n.set(t),!1;if(!s)return!1;if(e>=t)return!1;return n.set(t),o.ViewManager.ViewManager.instance().showView(x,!0),!0}(a.Settings.Settings.instance().createSetting(z,0).get(),d().version,a.Settings.Settings.instance().moduleSetting("help.show-release-note").get())}class U{static instance(e={forceNew:null}){const{forceNew:t}=e;return _&&!t||(_=new U),_}async run(){l.InspectorFrontendHost.isUnderTest()||L()}}class j{handleAction(e,t){const s=d();return o.UIUtils.openInNewTab(s.link),!0}static instance(e={forceNew:null}){const{forceNew:t}=e;return T&&!t||(T=new j),T}}class R{handleAction(e,t){return o.UIUtils.openInNewTab("https://goo.gle/devtools-bug"),!0}static instance(e={forceNew:null}){const{forceNew:t}=e;return I&&!t||(I=new R),I}}var $=Object.freeze({__proto__:null,HelpLateInitialization:U,ReleaseNotesActionDelegate:j,ReportIssueActionDelegate:R,getReleaseNoteVersionSetting:function(){return S||(S=a.Settings.Settings.instance().createSetting(z,0)),S},releaseNoteViewId:x,releaseVersionSeen:z,showReleaseNoteIfNeeded:L});export{m as ReleaseNoteText,N as ReleaseNoteView,$ as WhatsNew};
//# sourceMappingURL=whats_new.js.map
