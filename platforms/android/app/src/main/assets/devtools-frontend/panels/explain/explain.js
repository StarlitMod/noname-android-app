import"../../ui/components/spinners/spinners.js";import*as e from"../../core/common/common.js";import*as t from"../../core/host/host.js";import*as i from"../../core/i18n/i18n.js";import*as s from"../../core/root/root.js";import*as n from"../../third_party/marked/marked.js";import"../../ui/components/buttons/buttons.js";import*as o from"../../ui/components/input/input.js";import*as a from"../../ui/components/markdown_view/markdown_view.js";import*as r from"../../ui/legacy/legacy.js";import*as l from"../../ui/lit/lit.js";import*as c from"../../ui/visual_logging/visual_logging.js";import*as d from"../console/console.js";var g=`*{padding:0;margin:0;box-sizing:border-box}:host{font-family:var(--default-font-family);font-size:inherit;display:block}.wrapper{background-color:var(--sys-color-cdt-base-container);border-radius:16px;container-type:inline-size;display:grid;animation:expand var(--sys-motion-duration-medium2) var(--sys-motion-easing-emphasized) forwards}:host-context(.closing) .wrapper{animation:collapse var(--sys-motion-duration-medium2) var(--sys-motion-easing-emphasized) forwards}@keyframes expand{from{grid-template-rows:0fr}to{grid-template-rows:1fr}}@keyframes collapse{from{grid-template-rows:1fr}to{grid-template-rows:0fr;padding-top:0;padding-bottom:0}}.animation-wrapper{overflow:hidden;padding:var(--sys-size-6) var(--sys-size-8)}.wrapper.top{border-radius:16px 16px 4px 4px}.wrapper.bottom{margin-top:5px;border-radius:4px 4px 16px 16px}header{display:flex;flex-direction:row;gap:6px;color:var(--sys-color-on-surface);font-size:13px;font-style:normal;font-weight:500;margin-bottom:var(--sys-size-6);align-items:center}header:focus-visible{outline:none}header > .filler{display:flex;flex-direction:row;gap:var(--sys-size-5);align-items:center;flex:1}.reminder-container{border-radius:var(--sys-size-5);background-color:var(--sys-color-surface4);padding:var(--sys-size-8);font-weight:var(--ref-typeface-weight-medium);h3{font:inherit}}.reminder-items{display:grid;grid-template-columns:var(--sys-size-8) auto;gap:var(--sys-size-5) var(--sys-size-6);margin-top:var(--sys-size-6);line-height:var(--sys-size-8);font-weight:var(--ref-typeface-weight-regular)}main{--override-markdown-view-message-color:var(--sys-color-on-surface);color:var(--sys-color-on-surface);font-size:12px;font-style:normal;font-weight:400;line-height:20px;p{margin-block:1em}ul{list-style-type:none;list-style-position:inside;padding-inline-start:0.2em;li{display:list-item;list-style-type:disc;list-style-position:outside;margin-inline-start:1em}li::marker{font-size:11px;line-height:1}}label{display:inline-flex;flex-direction:row;gap:0.5em;input,\n    span{vertical-align:middle}input[type="checkbox"]{margin-top:0.3em}}}.opt-in-teaser{display:flex;gap:var(--sys-size-5)}devtools-markdown-view{margin-bottom:12px}footer{display:flex;flex-direction:row;align-items:center;color:var(--sys-color-on-surface);font-style:normal;font-weight:400;line-height:normal;margin-top:14px;gap:32px}@container (max-width: 600px){footer{gap:8px}}footer > .filler{flex:1}footer .rating{display:flex;flex-direction:row;gap:8px}textarea{height:84px;padding:10px;border-radius:8px;border:1px solid var(--sys-color-neutral-outline);width:100%;font-family:var(--default-font-family);font-size:inherit}.buttons{display:flex;gap:5px}@media (width <= 500px){.buttons{flex-wrap:wrap}}main .buttons{margin-top:12px}.disclaimer{display:flex;gap:2px;color:var(--sys-color-on-surface-subtle);font-size:11px;align-items:flex-start;flex-direction:column}.link{color:var(--sys-color-primary);text-decoration-line:underline;devtools-icon{color:var(--sys-color-primary);width:14px;height:14px}}button.link{border:none;background:none;cursor:pointer;font:inherit}.loader{background:linear-gradient(130deg,transparent 0%,var(--sys-color-gradient-tertiary) 20%,var(--sys-color-gradient-primary) 40%,transparent 60%,var(--sys-color-gradient-tertiary) 80%,var(--sys-color-gradient-primary) 100%);background-position:0% 0%;background-size:250% 250%;animation:gradient 5s infinite linear}@keyframes gradient{0%{background-position:0 0}100%{background-position:100% 100%}}summary{font-size:12px;font-style:normal;font-weight:400;line-height:20px}details{overflow:hidden;margin-top:10px}::details-content{height:0;transition:height var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized),content-visibility var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized) allow-discrete}[open]::details-content{height:auto}details.references{transition:margin-bottom var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized)}details.references[open]{margin-bottom:var(--sys-size-1)}h2{display:block;font-size:var(--sys-size-7);margin:0;font-weight:var(--ref-typeface-weight-medium);line-height:var(--sys-size-9)}h2:focus-visible{outline:none}.info{width:20px;height:20px}.badge{background:linear-gradient(135deg,var(--sys-color-gradient-primary),var(--sys-color-gradient-tertiary));border-radius:var(--sys-size-3);height:var(--sys-size-9);devtools-icon{margin:var(--sys-size-2)}}.header-icon-container{background:linear-gradient(135deg,var(--sys-color-gradient-primary),var(--sys-color-gradient-tertiary));border-radius:var(--sys-size-4);height:36px;width:36px;display:flex;align-items:center;justify-content:center}.close-button{align-self:flex-start}.sources-list{padding-left:var(--sys-size-6);margin-bottom:var(--sys-size-6);list-style:none;counter-reset:sources;display:grid;grid-template-columns:var(--sys-size-9) auto;list-style-position:inside}.sources-list li{display:contents}.sources-list li::before{counter-increment:sources;content:"[" counter(sources) "]";display:table-cell}.sources-list x-link.highlighted{animation:highlight-fadeout 2s}@keyframes highlight-fadeout{from{background-color:var(--sys-color-yellow-container)}to{background-color:transparent}}.references-list{padding-left:var(--sys-size-8)}.references-list li{padding-left:var(--sys-size-3)}details h3{font-size:10px;font-weight:var(--ref-typeface-weight-medium);text-transform:uppercase;color:var(--sys-color-on-surface-subtle);padding-left:var(--sys-size-6)}.error-message{font:var(--sys-typescale-body4-bold)}\n/*# sourceURL=${import.meta.resolve("././components/consoleInsight.css")} */`,h=`*{padding:0;margin:0;box-sizing:border-box}:host{display:block}ul{color:var(--sys-color-primary);font-size:12px;font-style:normal;font-weight:400;line-height:18px;margin-top:8px;padding-left:var(--sys-size-6)}li{list-style-type:none}ul .link{color:var(--sys-color-primary);display:inline-flex!important;align-items:center;gap:4px;text-decoration-line:underline}devtools-icon{height:16px;width:16px;margin-right:var(--sys-size-1)}devtools-icon[name="open-externally"]{color:var(--icon-link)}.source-disclaimer{color:var(--sys-color-on-surface-subtle)}\n/*# sourceURL=${import.meta.resolve("././components/consoleInsightSourcesList.css")} */`;const p={consoleMessage:"Console message",stackTrace:"Stacktrace",networkRequest:"Network request",relatedCode:"Related code",generating:"Generating explanation…",insight:"Explanation",closeInsight:"Close explanation",inputData:"Data used to understand this message",goodResponse:"Good response",badResponse:"Bad response",report:"Report legal issue",error:"DevTools has encountered an error",errorBody:"Something went wrong. Try again.",opensInNewTab:"(opens in a new tab)",learnMore:"Learn more",notLoggedIn:"This feature is only available when you sign into Chrome with your Google account.",signIn:"Sign in",offlineHeader:"DevTools can’t reach the internet",offline:"Check your internet connection and try again.",signInToUse:"Sign in to use this feature",search:"Use search instead",reloadRecommendation:"Reload the page to capture related network request data for this message in order to create a better insight.",turnOnInSettings:"Turn on {PH1} to receive AI assistance for understanding and addressing console warnings and errors.",settingsLink:"`Console insights` in Settings",references:"Sources and related content",relatedContent:"Related content",timedOut:"Generating a response took too long. Please try again.",notAvailableInIncognitoMode:"AI assistance is not available in Incognito mode or Guest mode"},m=i.i18n.registerUIStrings("panels/explain/components/ConsoleInsight.ts",p),u=i.i18n.getLocalizedString.bind(void 0,m),v=l.i18nTemplate.bind(void 0,m),{render:f,html:y,Directives:b}=l;class k extends Event{static eventName="close";constructor(){super(k.eventName,{composed:!0,bubbles:!0})}}function x(e){switch(e){case d.PromptBuilder.SourceType.MESSAGE:return u(p.consoleMessage);case d.PromptBuilder.SourceType.STACKTRACE:return u(p.stackTrace);case d.PromptBuilder.SourceType.NETWORK_REQUEST:return u(p.networkRequest);case d.PromptBuilder.SourceType.RELATED_CODE:return u(p.relatedCode)}}const w="https://goo.gle/devtools-console-messages-ai",I={name:"citation",level:"inline",start:e=>e.match(/\[\^/)?.index,tokenizer(e){const t=e.match(/^\[\^(\d+)\]/);return!!t&&{type:"citation",raw:t[0],linkText:Number(t[1])}},renderer:()=>""};class C extends HTMLElement{static async create(e,i){const s=await t.AidaClient.AidaClient.checkAccessPreconditions();return new C(e,i,s)}#e=this.attachShadow({mode:"open"});disableAnimations=!1;#t;#i;#s;#n;#o=l.Directives.createRef();#a=!1;#r;#l;#c;#d;#g;constructor(e,t,i){super(),this.#t=e,this.#i=t,this.#c=i,this.#l=this.#h(),this.#s=new a.MarkdownView.MarkdownInsightRenderer(this.#p.bind(this)),this.#g=new n.Marked.Marked({extensions:[I]}),this.#n=this.#m(),this.#d=this.#u.bind(this),this.#v(),this.addEventListener("keydown",e=>{e.stopPropagation()}),this.addEventListener("keyup",e=>{e.stopPropagation()}),this.addEventListener("keypress",e=>{e.stopPropagation()}),this.addEventListener("click",e=>{e.stopPropagation()}),this.focus()}#p(e){if("insight"!==this.#n.type||!this.#o.value)return;const t=this.#o.value.open;this.#a=!0,this.#v();const i=this.#e.querySelector(`.sources-list x-link[data-index="${e}"]`);i&&(r.UIUtils.runCSSAnimationOnce(i,"highlighted"),t?(i.scrollIntoView({behavior:"auto"}),i.focus()):this.#o.value.addEventListener("transitionend",()=>{i.scrollIntoView({behavior:"auto"}),i.focus()},{once:!0}))}#m(){switch(this.#c){case"available":{const t=e.Settings.Settings.instance().createSetting("console-insights-skip-reminder",!1,"Session").get();return{type:"loading",consentOnboardingCompleted:this.#f().get()||t}}case"no-account-email":return{type:"not-logged-in"};case"sync-is-paused":return{type:"sync-is-paused"};case"no-internet":return{type:"offline"}}}#h(){try{return e.Settings.moduleSetting("console-insights-enabled")}catch{return}}#f(){return e.Settings.Settings.instance().createLocalSetting("console-insights-onboarding-finished",!1)}connectedCallback(){this.classList.add("opening"),this.#l?.addChangeListener(this.#y,this);const e=!0===s.Runtime.hostConfig.aidaAvailability?.blockedByAge;"loading"===this.#n.type&&!0===this.#l?.getIfNotDisabled()&&!e&&this.#n.consentOnboardingCompleted&&t.userMetrics.actionTaken(t.UserMetrics.Action.GeneratingInsightWithoutDisclaimer),t.AidaClient.HostConfigTracker.instance().addEventListener("aidaAvailabilityChanged",this.#d),this.#u(),"insight"!==this.#n.type&&"error"!==this.#n.type&&(this.#n=this.#m()),this.#b()}disconnectedCallback(){this.#l?.removeChangeListener(this.#y,this),t.AidaClient.HostConfigTracker.instance().removeEventListener("aidaAvailabilityChanged",this.#d)}async#u(){const e=await t.AidaClient.AidaClient.checkAccessPreconditions();e!==this.#c&&(this.#c=e,this.#n=this.#m(),this.#b())}#y(){!0===this.#l?.getIfNotDisabled()&&this.#f().set(!0),"setting-is-not-true"===this.#n.type&&!0===this.#l?.getIfNotDisabled()&&(this.#k({type:"loading",consentOnboardingCompleted:!0}),t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsOptInTeaserConfirmedInSettings),this.#b()),"consent-reminder"===this.#n.type&&!1===this.#l?.getIfNotDisabled()&&(this.#k({type:"loading",consentOnboardingCompleted:!1}),t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsReminderTeaserAbortedInSettings),this.#b())}#k(e){const t=this.#n;this.#n=e,this.#v(),e.type!==t.type&&this.#x()}async#b(){if("loading"!==this.#n.type)return;const e=!0===s.Runtime.hostConfig.aidaAvailability?.blockedByAge;if(!0!==this.#l?.getIfNotDisabled()||e)return this.#k({type:"setting-is-not-true"}),void t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsOptInTeaserShown);if(!this.#n.consentOnboardingCompleted){const{sources:e,isPageReloadRecommended:i}=await this.#t.buildPrompt();return this.#k({type:"consent-reminder",sources:e,isPageReloadRecommended:i}),void t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsReminderTeaserShown)}await this.#w()}#I(){"consent-reminder"===this.#n.type&&t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsReminderTeaserCanceled),this.shadowRoot?.addEventListener("animationend",()=>{this.dispatchEvent(new k)},{once:!0}),this.classList.add("closing")}#C(e){if("insight"!==this.#n.type)throw new Error("Unexpected state");if(void 0===this.#n.metadata?.rpcGlobalId)throw new Error("RPC Id not in metadata");if(void 0!==this.#r)return;this.#r="true"===e.target.dataset.rating,this.#v(),this.#r?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightRatedPositive):t.userMetrics.actionTaken(t.UserMetrics.Action.InsightRatedNegative);const i=s.Runtime.hostConfig.aidaAvailability?.disallowLogging??!0;this.#i.registerClientEvent({corresponding_aida_rpc_global_id:this.#n.metadata.rpcGlobalId,disable_user_content_logging:i,do_conversation_client_event:{user_feedback:{sentiment:this.#r?"POSITIVE":"NEGATIVE"}}})}#R(){t.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab("https://support.google.com/legal/troubleshooter/1114905?hl=en#ts=1115658%2C13380504")}#A(){const e=this.#t.getSearchQuery();t.InspectorFrontendHost.InspectorFrontendHostInstance.openSearchResultsInNewTab(e)}async#$(){this.#f().set(!0),this.#k({type:"loading",consentOnboardingCompleted:!0}),t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsReminderTeaserConfirmed),await this.#w()}#T(e,i){const s=[];if(!this.#S(i)||!i.attributionMetadata)return{explanationWithCitations:e,directCitationUrls:s};const{attributionMetadata:n}=i,o=n.citations.filter(e=>e.sourceType===t.AidaClient.CitationSourceType.WORLD_FACTS).sort((e,t)=>(t.endIndex||0)-(e.endIndex||0));let a=e;for(const[e,t]of o.entries()){const i=/[.,:;!?]*\s/g;i.lastIndex=t.endIndex||0;const n=i.exec(a);n&&t.uri&&(a=a.slice(0,n.index)+`[^${o.length-e}]`+a.slice(n.index),s.push(t.uri))}return s.reverse(),{explanationWithCitations:a,directCitationUrls:s}}#M(e){for(const t of e)if("code"===t.type){const e=t.text.match(/\[\^\d+\]/g);if(t.text=t.text.replace(/\[\^\d+\]/g,""),e?.length){const i=e.map(e=>{const t=parseInt(e.slice(2,-1),10);return{index:t,clickHandler:this.#p.bind(this,t)}});t.citations=i}}}async#w(){try{for await(const{sources:e,isPageReloadRecommended:t,explanation:i,metadata:s,completed:n}of this.#z()){const{explanationWithCitations:o,directCitationUrls:a}=this.#T(i,s),r=this.#E(o),l=!1!==r;l&&this.#M(r),this.#k({type:"insight",tokens:l?r:[],validMarkdown:l,explanation:i,sources:e,metadata:s,isPageReloadRecommended:t,completed:n,directCitationUrls:a})}t.userMetrics.actionTaken(t.UserMetrics.Action.InsightGenerated)}catch(e){t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErrored),"doAidaConversation timed out"===e.message&&"insight"===this.#n.type?(this.#n.timedOut=!0,this.#k({...this.#n,completed:!0,timedOut:!0})):this.#k({type:"error",error:e.message})}}#E(e){try{const t=this.#g.lexer(e);for(const e of t)this.#s.renderToken(e);return t}catch{return t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredMarkdown),!1}}async*#z(){const{prompt:e,sources:i,isPageReloadRecommended:s}=await this.#t.buildPrompt();try{for await(const n of this.#i.doConversation(t.AidaClient.AidaClient.buildConsoleInsightsRequest(e)))yield{sources:i,isPageReloadRecommended:s,...n}}catch(e){throw"Server responded: permission denied"===e.message?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredPermissionDenied):e.message.startsWith("Cannot send request:")?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredCannotSend):e.message.startsWith("Request failed:")?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredRequestFailed):e.message.startsWith("Cannot parse chunk:")?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredCannotParseChunk):"Unknown chunk result"===e.message?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredUnknownChunk):e.message.startsWith("Server responded:")?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredApi):t.userMetrics.actionTaken(t.UserMetrics.Action.InsightErroredOther),e}}#U(){t.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab("https://accounts.google.com")}#x(){this.addEventListener("animationend",()=>{this.#e.querySelector("header h2")?.focus()},{once:!0})}#j(){return y`<devtools-button
      @click=${this.#A}
      class="search-button"
      .data=${{variant:"outlined",jslogContext:"search"}}
    >
      ${u(p.search)}
    </devtools-button>`}#L(){return y`<x-link href=${w} class="link" jslog=${c.link("learn-more").track({click:!0})}>
      ${u(p.learnMore)}
    </x-link>`}#O(){return"insight"===this.#n.type&&this.#n.directCitationUrls.length?y`
      <ol class="sources-list">
        ${this.#n.directCitationUrls.map((e,t)=>y`
          <li>
            <x-link
              href=${e}
              class="link"
              data-index=${t+1}
              jslog=${c.link("references.console-insights").track({click:!0})}
            >
              ${e}
            </x-link>
          </li>
        `)}
      </ol>
    `:l.nothing}#P(){if("insight"!==this.#n.type||!this.#n.metadata.factualityMetadata?.facts.length)return l.nothing;const e=this.#n.directCitationUrls,i=this.#n.metadata.factualityMetadata.facts.filter(t=>t.sourceUri&&!e.includes(t.sourceUri)).map(e=>e.sourceUri),s=this.#n.metadata.attributionMetadata?.citations.filter(e=>e.sourceType===t.AidaClient.CitationSourceType.TRAINING_DATA&&(e.uri||e.repository)).map(e=>e.uri||`https://www.github.com/${e.repository}`)||[],n=[...new Set(s.filter(t=>!i.includes(t)&&!e.includes(t)))];return i.push(...n),0===i.length?l.nothing:y`
      ${this.#n.directCitationUrls.length?y`<h3>${u(p.relatedContent)}</h3>`:l.nothing}
      <ul class="references-list">
        ${i.map(e=>y`
          <li>
            <x-link
              href=${e}
              class="link"
              jslog=${c.link("references.console-insights").track({click:!0})}
            >
              ${e}
            </x-link>
          </li>
        `)}
      </ul>
    `}#S(e){return Boolean(e.factualityMetadata?.facts.length)}#D(){this.#o.value&&(this.#a=this.#o.value.open)}#N(){const e=`${c.section(this.#n.type).track({resize:!0})}`,i=s.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===s.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;switch(this.#n.type){case"loading":return y`<main jslog=${e}>
            <div role="presentation" aria-label="Loading" class="loader" style="clip-path: url('#clipPath');">
              <svg width="100%" height="64">
                <clipPath id="clipPath">
                  <rect x="0" y="0" width="100%" height="16" rx="8"></rect>
                  <rect x="0" y="24" width="100%" height="16" rx="8"></rect>
                  <rect x="0" y="48" width="100%" height="16" rx="8"></rect>
                </clipPath>
              </svg>
            </div>
          </main>`;case"insight":return y`
        <main jslog=${e}>
          ${this.#n.validMarkdown?y`<devtools-markdown-view
              .data=${{tokens:this.#n.tokens,renderer:this.#s,animationEnabled:!this.disableAnimations}}>
            </devtools-markdown-view>`:this.#n.explanation}
          ${this.#n.timedOut?y`<p class="error-message">${u(p.timedOut)}</p>`:l.nothing}
          ${this.#S(this.#n.metadata)?y`
            <details class="references" ${l.Directives.ref(this.#o)} @toggle=${this.#D} jslog=${c.expand("references").track({click:!0})}>
              <summary>${u(p.references)}</summary>
              ${this.#O()}
              ${this.#P()}
            </details>
          `:l.nothing}
          <details jslog=${c.expand("sources").track({click:!0})}>
            <summary>${u(p.inputData)}</summary>
            <devtools-console-insight-sources-list .sources=${this.#n.sources} .isPageReloadRecommended=${this.#n.isPageReloadRecommended}>
            </devtools-console-insight-sources-list>
          </details>
          <div class="buttons">
            ${this.#j()}
          </div>
        </main>`;case"error":return y`
        <main jslog=${e}>
          <div class="error">${u(p.errorBody)}</div>
        </main>`;case"consent-reminder":return y`
          <main class="reminder-container" jslog=${e}>
            <h3>Things to consider</h3>
            <div class="reminder-items">
              <div>
                <devtools-icon name="google" class="medium">
                </devtools-icon>
              </div>
              <div>The console message, associated stack trace, related source code, and the associated network headers are sent to Google to generate explanations. ${i?"The content you submit and that is generated by this feature will not be used to improve Google’s AI models.":"This data may be seen by human reviewers to improve this feature. Avoid sharing sensitive or personal information."}
              </div>
              <div>
                <devtools-icon name="policy" class="medium">
                </devtools-icon>
              </div>
              <div>Use of this feature is subject to the <x-link
                  href=${"https://policies.google.com/terms"}
                  class="link"
                  jslog=${c.link("terms-of-service.console-insights").track({click:!0})}>
                Google Terms of Service
                </x-link> and <x-link
                  href=${"https://policies.google.com/privacy"}
                  class="link"
                  jslog=${c.link("privacy-policy.console-insights").track({click:!0})}>
                Google Privacy Policy
                </x-link>
              </div>
              <div>
                <devtools-icon name="warning" class="medium">
                </devtools-icon>
              </div>
              <div>
                <x-link
                  href=${"https://support.google.com/legal/answer/13505487"}
                  class="link"
                  jslog=${c.link("code-snippets-explainer.console-insights").track({click:!0})}
                >Use generated code snippets with caution</x-link>
              </div>
            </div>
          </main>
        `;case"setting-is-not-true":{const i=y`<button
            class="link" role="link"
            jslog=${c.action("open-ai-settings").track({click:!0})}
            @click=${()=>{t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsOptInTeaserSettingsLinkClicked),r.ViewManager.ViewManager.instance().showView("chrome-ai")}}
          >${u(p.settingsLink)}</button>`;return y`<main class="opt-in-teaser" jslog=${e}>
          <div class="badge">
            <devtools-icon name="lightbulb-spark" class="medium">
            </devtools-icon>
          </div>
          <div>
            ${v(p.turnOnInSettings,{PH1:i})} ${this.#L()}
          </div>
        </main>`}case"not-logged-in":case"sync-is-paused":return y`
          <main jslog=${e}>
            <div class="error">${s.Runtime.hostConfig.isOffTheRecord?u(p.notAvailableInIncognitoMode):u(p.notLoggedIn)}</div>
          </main>`;case"offline":return y`
          <main jslog=${e}>
            <div class="error">${u(p.offline)}</div>
          </main>`}}#G(){const e=s.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===s.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;return y`<span>
      AI tools may generate inaccurate info that doesn't represent Google's views. ${e?"The content you submit and that is generated by this feature will not be used to improve Google’s AI models.":"Data sent to Google may be seen by human reviewers to improve this feature."} <button class="link" role="link" @click=${()=>r.ViewManager.ViewManager.instance().showView("chrome-ai")}
                jslog=${c.action("open-ai-settings").track({click:!0})}>
        Open settings
      </button> or <x-link href=${w}
          class="link" jslog=${c.link("learn-more").track({click:!0})}>
        learn more
      </x-link>
    </span>`}#H(){const e=this.#G();switch(this.#n.type){case"loading":case"setting-is-not-true":return l.nothing;case"error":case"offline":return y`<footer jslog=${c.section("footer")}>
          <div class="disclaimer">
            ${e}
          </div>
        </footer>`;case"not-logged-in":case"sync-is-paused":return s.Runtime.hostConfig.isOffTheRecord?l.nothing:y`<footer jslog=${c.section("footer")}>
        <div class="filler"></div>
        <div>
          <devtools-button
            @click=${this.#U}
            .data=${{variant:"primary",jslogContext:"update-settings"}}
          >
            ${p.signIn}
          </devtools-button>
        </div>
      </footer>`;case"consent-reminder":return y`<footer jslog=${c.section("footer")}>
          <div class="filler"></div>
          <div class="buttons">
            <devtools-button
              @click=${()=>{t.userMetrics.actionTaken(t.UserMetrics.Action.InsightsReminderTeaserSettingsLinkClicked),r.ViewManager.ViewManager.instance().showView("chrome-ai")}}
              .data=${{variant:"tonal",jslogContext:"settings",title:"Settings"}}
            >
              Settings
            </devtools-button>
            <devtools-button
              class='continue-button'
              @click=${this.#$}
              .data=${{variant:"primary",jslogContext:"continue",title:"continue"}}
              >
              Continue
            </devtools-button>
          </div>
        </footer>`;case"insight":return y`<footer jslog=${c.section("footer")}>
        <div class="disclaimer">
          ${e}
        </div>
        <div class="filler"></div>
        <div class="rating">
          <devtools-button
            data-rating=${"true"}
            .data=${{variant:"icon_toggle",size:"SMALL",iconName:"thumb-up",toggledIconName:"thumb-up",toggleOnClick:!1,toggleType:"primary-toggle",disabled:void 0!==this.#r,toggled:!0===this.#r,title:u(p.goodResponse),jslogContext:"thumbs-up"}}
            @click=${this.#C}
          ></devtools-button>
          <devtools-button
            data-rating=${"false"}
            .data=${{variant:"icon_toggle",size:"SMALL",iconName:"thumb-down",toggledIconName:"thumb-down",toggleOnClick:!1,toggleType:"primary-toggle",disabled:void 0!==this.#r,toggled:!1===this.#r,title:u(p.badResponse),jslogContext:"thumbs-down"}}
            @click=${this.#C}
          ></devtools-button>
          <devtools-button
            .data=${{variant:"icon",size:"SMALL",iconName:"report",title:u(p.report),jslogContext:"report"}}
            @click=${this.#R}
          ></devtools-button>
        </div>

      </footer>`}}#_(){switch(this.#n.type){case"not-logged-in":case"sync-is-paused":return u(p.signInToUse);case"offline":return u(p.offlineHeader);case"loading":return u(p.generating);case"insight":return u(p.insight);case"error":return u(p.error);case"consent-reminder":return"Understand console messages with AI";case"setting-is-not-true":return""}}#V(){return"insight"!==this.#n.type||this.#n.completed?l.nothing:y`<devtools-spinner></devtools-spinner>`}#B(){if("setting-is-not-true"===this.#n.type)return l.nothing;const e="consent-reminder"===this.#n.type;return y`
      <header>
        ${e?y`
          <div class="header-icon-container">
            <devtools-icon name="lightbulb-spark" class="large">
            </devtools-icon>
          </div>`:l.nothing}
        <div class="filler">
          <h2 tabindex="-1">
            ${this.#_()}
          </h2>
          ${this.#V()}
        </div>
        <div class="close-button">
          <devtools-button
            .data=${{variant:"icon",size:"SMALL",iconName:"cross",title:u(p.closeInsight)}}
            jslog=${c.close().track({click:!0})}
            @click=${this.#I}
          ></devtools-button>
        </div>
      </header>
    `}#v(){f(y`
      <style>${g}</style>
      <style>${o.checkboxStyles}</style>
      <div class="wrapper" jslog=${c.pane("console-insights").track({resize:!0})}>
        <div class="animation-wrapper">
          ${this.#B()}
          ${this.#N()}
          ${this.#H()}
        </div>
      </div>
    `,this.#e,{host:this}),this.#o.value&&(this.#o.value.open=this.#a)}}class R extends HTMLElement{#e=this.attachShadow({mode:"open"});#W=[];#F=!1;#v(){f(y`
      <style>${h}</style>
      <style>${o.checkboxStyles}</style>
      <ul>
        ${b.repeat(this.#W,e=>e.value,e=>y`<li><x-link class="link" title="${x(e.type)} ${u(p.opensInNewTab)}" href="data:text/plain;charset=utf-8,${encodeURIComponent(e.value)}" jslog=${c.link("source-"+e.type).track({click:!0})}>
            <devtools-icon name="open-externally"></devtools-icon>
            ${x(e.type)}
          </x-link></li>`)}
        ${this.#F?y`<li class="source-disclaimer">
          <devtools-icon name="warning"></devtools-icon>
          ${u(p.reloadRecommendation)}</li>`:l.nothing}
      </ul>
    `,this.#e,{host:this})}set sources(e){this.#W=e,this.#v()}set isPageReloadRecommended(e){this.#F=e,this.#v()}}customElements.define("devtools-console-insight",C),customElements.define("devtools-console-insight-sources-list",R);class A{handleAction(e,i){switch(i){case"explain.console-message.context":case"explain.console-message.context.error":case"explain.console-message.context.warning":case"explain.console-message.context.other":case"explain.console-message.teaser":case"explain.console-message.hover":{const s=e.flavor(d.ConsoleViewMessage.ConsoleViewMessage);if(s){i.startsWith("explain.console-message.context")?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightRequestedViaContextMenu):"explain.console-message.teaser"===i?t.userMetrics.actionTaken(t.UserMetrics.Action.InsightRequestedViaTeaser):"explain.console-message.hover"===i&&t.userMetrics.actionTaken(t.UserMetrics.Action.InsightRequestedViaHoverButton);const e=new d.PromptBuilder.PromptBuilder(s),n=new t.AidaClient.AidaClient;return C.create(e,n).then(e=>{s.setInsight(e)}),!0}return!1}}return!1}}export{A as ActionDelegate,k as CloseEvent,C as ConsoleInsight};
//# sourceMappingURL=explain.js.map
