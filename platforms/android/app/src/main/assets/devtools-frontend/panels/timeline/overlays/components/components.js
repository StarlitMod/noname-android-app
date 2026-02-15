import"../../../../ui/components/icon_button/icon_button.js";import*as e from"../../../../core/i18n/i18n.js";import"../../../../models/trace/trace.js";import*as t from"../../../../ui/legacy/theme_support/theme_support.js";import*as i from"../../../../ui/lit/lit.js";import{render as n,html as o}from"../../../../ui/lit/lit.js";import*as r from"../../../../ui/visual_logging/visual_logging.js";import"../../../../ui/components/tooltips/tooltips.js";import"../../../../ui/components/spinners/spinners.js";import*as s from"../../../../core/common/common.js";import*as a from"../../../../core/host/host.js";import*as l from"../../../../core/platform/platform.js";import*as c from"../../../../core/root/root.js";import*as h from"../../../../models/ai_assistance/ai_assistance.js";import"../../../../ui/components/buttons/buttons.js";import*as d from"../../../../ui/components/helpers/helpers.js";import*as p from"../../../../ui/legacy/legacy.js";import*as b from"../../../common/common.js";var u=`.connectorContainer{display:flex;width:100%;height:100%}.entry-wrapper{pointer-events:none;position:absolute;display:block;border:2px solid var(--color-text-primary);box-sizing:border-box;&.cut-off-top{border-top:none}&.cut-off-bottom{border-bottom:none}&.cut-off-right{border-right:none}&.cut-off-left{border-left:none}}.entry-is-not-source{border:2px dashed var(--color-text-primary)}.create-link-icon{pointer-events:auto;cursor:pointer;color:var(--sys-color-on-surface);width:16px;height:16px;position:absolute}\n/*# sourceURL=${import.meta.resolve("./entriesLinkOverlay.css")} */`;const g={diagram:"Links between entries"},y=e.i18n.registerUIStrings("panels/timeline/overlays/components/EntriesLinkOverlay.ts",g),m=e.i18n.getLocalizedString.bind(void 0,y);class v extends Event{static eventName="entrylinkstartcreating";constructor(){super(v.eventName,{bubbles:!0,composed:!0})}}let f=class extends HTMLElement{#e=this.attachShadow({mode:"open"});#t;#i;#n;#o=null;#r=null;#s=null;#a=null;#l=null;#c=null;#h=null;#d=!0;#p=!0;#b=null;#u=!0;#g=!0;#y=!1;#m;constructor(e,t){super(),this.#v(),this.#t={x:e.x,y:e.y},this.#i={width:e.width,height:e.height},this.#n={x:e.x,y:e.y},this.#r=this.#e.querySelector(".connectorContainer")??null,this.#s=this.#r?.querySelector("line")??null,this.#a=this.#e.querySelector(".from-highlight-wrapper")??null,this.#l=this.#e.querySelector(".to-highlight-wrapper")??null,this.#c=this.#r?.querySelector(".entryFromConnector")??null,this.#h=this.#r?.querySelector(".entryToConnector")??null,this.#m=t,this.#v()}set canvasRect(e){null!==e&&(this.#b&&this.#b.width===e.width&&this.#b.height===e.height||(this.#b=e,this.#v()))}entryFromWrapper(){return this.#a}entryToWrapper(){return this.#l}set hideArrow(e){this.#y=e,this.#s&&(this.#s.style.display=e?"none":"block")}set fromEntryCoordinateAndDimensions(e){this.#t={x:e.x,y:e.y},this.#i={width:e.length,height:e.height},this.#f(),this.#w()}set entriesVisibility(e){this.#d=e.fromEntryVisibility,this.#p=e.toEntryVisibility,this.#w()}set toEntryCoordinateAndDimensions(e){this.#n={x:e.x,y:e.y},e.length&&e.height?this.#o={width:e.length,height:e.height}:this.#o=null,this.#f(),this.#w()}set fromEntryIsSource(e){e!==this.#u&&(this.#u=e,this.#v())}set toEntryIsSource(e){e!==this.#g&&(this.#g=e,this.#v())}#w(){if(this.#s&&this.#a&&this.#l&&this.#c&&this.#h){if("creation_not_started"===this.#m)return this.#c.setAttribute("visibility","hidden"),this.#h.setAttribute("visibility","hidden"),void(this.#s.style.display="none");this.#x(),this.#L(),this.#E(),this.#C(),this.#v()}else console.error("one of the required Entries Link elements is missing.")}#x(){this.#a&&this.#l&&(this.#a.style.visibility=this.#d?"visible":"hidden",this.#l.style.visibility=this.#p?"visible":"hidden")}#L(){if(!this.#o||!this.#c||!this.#h)return;const e=this.#d&&!this.#y&&this.#u&&this.#i.width>=8,t=!this.#y&&this.#p&&this.#g&&this.#o?.width>=8&&!this.#y;this.#c.setAttribute("visibility",e?"visible":"hidden"),this.#h.setAttribute("visibility",t?"visible":"hidden")}#E(){if(!this.#s)return;this.#s.style.display=this.#d||this.#p?"block":"none",this.#s.setAttribute("stroke-width","2");const e=t.ThemeSupport.instance().getComputedValue("--color-text-primary");!this.#o||this.#d&&this.#p?this.#s.setAttribute("stroke",e):this.#d&&!this.#p?this.#s.setAttribute("stroke","url(#fromVisibleLineGradient)"):this.#p&&!this.#d&&this.#s.setAttribute("stroke","url(#toVisibleLineGradient)")}#C(){if(!this.#s||!this.#c||!this.#h)return;const e=this.#i.height/2,t=this.#t.x+this.#i.width,i=this.#t.y+e;this.#s.setAttribute("x1",t.toString()),this.#s.setAttribute("y1",i.toString()),this.#c.setAttribute("cx",t.toString()),this.#c.setAttribute("cy",i.toString());const n=this.#n.x,o=this.#o?this.#n.y+(this.#o?.height??0)/2:this.#n.y;this.#s.setAttribute("x2",n.toString()),this.#s.setAttribute("y2",o.toString()),this.#h.setAttribute("cx",n.toString()),this.#h.setAttribute("cy",o.toString())}#A(){if(!this.#b)return 100;const e=2500/(this.#n.x-(this.#t.x+this.#i.width));return e<100?e:100}#f(){const e=this.#e.querySelector(".create-link-box"),t=e?.querySelector(".create-link-icon")??null;e&&t?"creation_not_started"===this.#m?(t.style.left=`${this.#t.x+this.#i.width}px`,t.style.top=`${this.#t.y}px`):t.style.display="none":console.error("creating element is missing.")}#k(){this.#m="pending_to_event",this.dispatchEvent(new v)}#v(){const e=t.ThemeSupport.instance().getComputedValue("--color-text-primary");n(o`
          <style>${u}</style>
          <svg class="connectorContainer" width="100%" height="100%" role="region" aria-label=${m(g.diagram)}>
            <defs>
              <linearGradient
                id="fromVisibleLineGradient"
                x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  stop-color=${e}
                  stop-opacity="1" />
                <stop
                  offset="${this.#A()}%"
                  stop-color=${e}
                  stop-opacity="0" />
              </linearGradient>

              <linearGradient
                id="toVisibleLineGradient"
                x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="${100-this.#A()}%"
                  stop-color=${e}
                  stop-opacity="0" />
                <stop
                  offset="100%"
                  stop-color=${e}
                  stop-opacity="1" />
              </linearGradient>
              <marker
                id="arrow"
                orient="auto"
                markerWidth="3"
                markerHeight="4"
                fill-opacity="1"
                refX="4"
                refY="2"
                visibility=${this.#p||!this.#o?"visible":"hidden"}>
                <path d="M0,0 V4 L4,2 Z" fill=${e} />
              </marker>
            </defs>
            <line
              marker-end="url(#arrow)"
              stroke-dasharray=${this.#u&&this.#g?"none":L}
              visibility=${this.#d||this.#p?"visible":"hidden"}
              />
            <circle class="entryFromConnector" fill="none" stroke=${e} stroke-width=${x} r=${w} />
            <circle class="entryToConnector" fill="none" stroke=${e} stroke-width=${x} r=${w} />
          </svg>
          <div class="entry-wrapper from-highlight-wrapper ${this.#u?"":"entry-is-not-source"}"></div>
          <div class="entry-wrapper to-highlight-wrapper ${this.#g?"":"entry-is-not-source"}"></div>
          <div class="create-link-box ${this.#m?"visible":"hidden"}">
            <devtools-icon
              class='create-link-icon'
              jslog=${r.action("timeline.annotations.create-entry-link").track({click:!0})}
              @click=${this.#k}
              name='arrow-right-circle'>
            </devtools-icon>
          </div>
        `,this.#e,{host:this})}};const w=2,x=1,L=4;customElements.define("devtools-entries-link-overlay",f);var E=Object.freeze({__proto__:null,EntriesLinkOverlay:f,EntryLinkStartCreating:v}),C=`.label-parts-wrapper{display:flex;flex-direction:column;align-items:center}.label-button-input-wrapper{display:flex;position:relative;overflow:visible}.ai-label-button-wrapper,\n.ai-label-disabled-button-wrapper,\n.ai-label-loading,\n.ai-label-error{position:absolute;left:100%;display:flex;transform:translateY(-3px);flex-flow:row nowrap;border:none;border-radius:var(--sys-shape-corner-large);background:var(--sys-color-surface3);box-shadow:var(--drop-shadow);align-items:center;gap:var(--sys-size-4);pointer-events:auto;transition:all var(--sys-motion-duration-medium2) var(--sys-motion-easing-emphasized);&.only-pen-wrapper{overflow:hidden;width:var(--sys-size-12);height:var(--sys-size-12)}*{transform:translateX(-2px)}}.delete-button{display:flex;pointer-events:auto;position:absolute;right:0;top:-5px;border-radius:50%;padding:0;border:none;background:var(--color-background-inverted)}.ai-label-loading,\n.ai-label-error{gap:var(--sys-size-6);padding:var(--sys-size-5) var(--sys-size-8)}.ai-label-button-wrapper:focus,\n.ai-label-button-wrapper:focus-within,\n.ai-label-button-wrapper:hover{width:auto;height:var(--sys-size-13);padding:var(--sys-size-3) var(--sys-size-5);transform:translateY(-9px);*{transform:translateX(0)}}.ai-label-button{display:flex;align-items:center;gap:var(--sys-size-4);padding:var(--sys-size-3) var(--sys-size-5);border:1px solid var(--color-primary);border-radius:var(--sys-shape-corner-large);&.enabled{background:var(--sys-color-surface3)}&.disabled{background:var(--sys-color-surface5)}&:hover{background:var(--sys-color-state-hover-on-subtle)}}.generate-label-text{white-space:nowrap;color:var(--color-primary)}.input-field{background-color:var(--color-background-inverted);color:var(--color-background);pointer-events:auto;border-radius:var(--sys-shape-corner-extra-small);white-space:nowrap;padding:var(--sys-size-3) var(--sys-size-4);font-family:var(--default-font-family);font-size:var(--sys-typescale-body2-size);font-weight:var(--ref-typeface-weight-medium);outline:2px solid var(--color-background)}.input-field:focus,\n.label-parts-wrapper:focus-within .input-field,\n.input-field.fake-focus-state{background-color:var(--color-background);color:var(--color-background-inverted);outline:2px solid var(--color-background-inverted)}.connectorContainer{overflow:visible}.entry-highlight-wrapper{box-sizing:border-box;border:2px solid var(--sys-color-on-surface);&.cut-off-top{border-top:none}&.cut-off-bottom{border-bottom:none}&.cut-off-right{border-right:none}&.cut-off-left{border-left:none}}.info-tooltip-container{max-width:var(--sys-size-28);button.link{cursor:pointer;text-decoration:underline;border:none;padding:0;background:none;font:inherit;font-weight:var(--ref-typeface-weight-medium);display:block;margin-top:var(--sys-size-4);color:var(--sys-color-primary)}}\n/*# sourceURL=${import.meta.resolve("./entryLabelOverlay.css")} */`;const{html:A,Directives:k}=i,T={entryLabel:"Entry label",inputTextPrompt:"Enter an annotation label",generateLabelButton:"Generate label",freDialog:"Get AI-powered annotation suggestions dialog",learnMoreAriaLabel:"Learn more about auto annotations in settings",moreInfoAriaLabel:"More information about this feature"},S="Learn more in settings",R="The selected call stack is sent to Google. The content you submit and that is generated by this feature will be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",I="The selected call stack is sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",B="Auto annotations are not available.",$="Auto annotations are not available because you are offline.",_="Get AI-powered annotation suggestions",F="Generating label",D="Generation failed",N="This feature uses AI and won’t always get it right",H="To generate annotation suggestions, your performance trace is sent to Google. This data may be seen by human reviewers to improve this feature.",V="To generate annotation suggestions, your performance trace is sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",O="Learn more",G=e.i18n.registerUIStrings("panels/timeline/overlays/components/EntryLabelOverlay.ts",T),z=e.i18n.getLocalizedString.bind(void 0,G),P=e.i18n.lockedString;function W(){return!c.Runtime.hostConfig.aidaAvailability?.disallowLogging}class j extends Event{static eventName="entrylabelremoveevent";constructor(){super(j.eventName)}}class M extends Event{newLabel;static eventName="entrylabelchangeevent";constructor(e){super(M.eventName),this.newLabel=e}}class U extends Event{isVisible;static eventName="labelannotationsconsentdialogvisiblitychange";constructor(e){super(U.eventName,{bubbles:!0,composed:!0}),this.isVisible=e}}let q=class e extends HTMLElement{static LABEL_AND_CONNECTOR_SHIFT_LENGTH=8;static LABEL_CONNECTOR_HEIGHT=7;static MAX_LABEL_LENGTH=100;#e=this.attachShadow({mode:"open"});#T=!1;#S=!0;#R=null;#I=null;#B=null;#$=null;#r=null;#_;#F;#D=k.createRef();#N;#H=null;#V=s.Settings.Settings.instance().createSetting("ai-annotations-enabled",!1);#O=new h.PerformanceAnnotationsAgent.PerformanceAnnotationsAgent({aidaClient:new a.AidaClient.AidaClient,serverSideLoggingEnabled:W()});#G=!1;#z="hidden";constructor(e,t=!1){super(),this.#v(),this.#F=t,this.#I=this.#e.querySelector(".label-parts-wrapper"),this.#$=this.#I?.querySelector(".input-field")??null,this.#r=this.#I?.querySelector(".connectorContainer")??null,this.#B=this.#I?.querySelector(".entry-highlight-wrapper")??null,this.#_=e,this.#N=c.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===c.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING,this.#P(e),""!==e&&this.setLabelEditabilityAndRemoveEmptyLabel(!1);const i=""===e?z(T.inputTextPrompt):e;this.#$?.setAttribute("aria-label",i),this.#W()}overrideAIAgentForTest(e){this.#O=e}entryHighlightWrapper(){return this.#B}#j(){const e=this.#$?.textContent?.trim()??"";e!==this.#_&&(this.#_=e,this.dispatchEvent(new M(this.#_)),this.#$?.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))),this.#M(),this.#v(),this.#$?.setAttribute("aria-label",e)}#U(t){if(!this.#$)return!1;return t.key!==l.KeyboardUtilities.ENTER_KEY&&t.key!==l.KeyboardUtilities.ESCAPE_KEY||!this.#S?null!==this.#$.textContent&&this.#$.textContent.length<=e.MAX_LABEL_LENGTH||(!!["Backspace","Delete","ArrowLeft","ArrowRight"].includes(t.key)||(!(1!==t.key.length||!t.ctrlKey)||(t.preventDefault(),!1))):(this.#$.blur(),this.setLabelEditabilityAndRemoveEmptyLabel(!1),!1)}#q(t){t.preventDefault();const i=t.clipboardData;if(!i||!this.#$)return;const n=i.getData("text").replace(/(\r\n|\n|\r)/gm,""),o=(this.#$.textContent+n).slice(0,e.MAX_LABEL_LENGTH+1);this.#$.textContent=o,this.#K()}set entryLabelVisibleHeight(e){this.#R=e,d.ScheduledRender.scheduleRender(this,this.#v),this.#S&&this.#Y(),this.#P(),this.#W()}#W(){if(!this.#r)return void console.error("`connectorLineContainer` element is missing.");if(this.#F&&this.#R){const t=this.#R+e.LABEL_CONNECTOR_HEIGHT;this.#r.style.transform=`translateY(${t}px) rotate(180deg)`}const i=this.#r.querySelector("line"),n=this.#r.querySelector("circle");if(!i||!n)return void console.error("Some entry label elements are missing.");this.#r.setAttribute("width",(2*e.LABEL_AND_CONNECTOR_SHIFT_LENGTH).toString()),this.#r.setAttribute("height",e.LABEL_CONNECTOR_HEIGHT.toString()),i.setAttribute("x1","0"),i.setAttribute("y1","0"),i.setAttribute("x2",e.LABEL_AND_CONNECTOR_SHIFT_LENGTH.toString()),i.setAttribute("y2",e.LABEL_CONNECTOR_HEIGHT.toString());const o=t.ThemeSupport.instance().getComputedValue("--color-text-primary");i.setAttribute("stroke",o),i.setAttribute("stroke-width","2"),n.setAttribute("cx",e.LABEL_AND_CONNECTOR_SHIFT_LENGTH.toString()),n.setAttribute("cy",(e.LABEL_CONNECTOR_HEIGHT+1).toString()),n.setAttribute("r","3"),n.setAttribute("fill",o)}#P(t){if(!this.#$)return void console.error("`labelBox`element is missing.");"string"==typeof t&&(this.#$.innerText=t);let i=null,n=null;if(i=this.#F?e.LABEL_AND_CONNECTOR_SHIFT_LENGTH:-1*e.LABEL_AND_CONNECTOR_SHIFT_LENGTH,this.#F&&this.#R){n=this.#R+2*e.LABEL_CONNECTOR_HEIGHT+this.#$?.offsetHeight}let o="";i&&(o+=`translateX(${i}px) `),n&&(o+=`translateY(${n}px)`),o.length&&(this.#$.style.transform=o)}#Y(){this.#$?this.#$.focus():console.error("`labelBox` element is missing.")}setLabelEditabilityAndRemoveEmptyLabel(e){if(this.#G&&!1===e)return;e?this.setAttribute("data-user-editing-label","true"):this.removeAttribute("data-user-editing-label"),this.#S=e,this.#v(),e&&this.#$&&(this.#K(),this.#Y());const t=this.#$?.textContent?.trim()??"";e||0!==t.length||this.#T||(this.#T=!0,this.dispatchEvent(new j))}#K(){if(!this.#$)return;const e=window.getSelection(),t=document.createRange();t.selectNodeContents(this.#$),t.collapse(!1),e?.removeAllRanges(),e?.addRange(t)}set callTree(e){this.#H=e,this.#M()}async#X(){if(this.#V.get()){if(!this.#H||!this.#$)return;try{this.#z="generating_label",p.ARIAUtils.LiveAnnouncer.alert(F),this.#v(),this.#Y(),d.ScheduledRender.scheduleRender(this,this.#v),this.#_=await this.#O.generateAIEntryLabel(this.#H),this.dispatchEvent(new M(this.#_)),this.#$.innerText=this.#_,this.#K(),this.#M(),this.#v()}catch{this.#z="generation_failed",d.ScheduledRender.scheduleRender(this,this.#v)}}else{this.#G=!0,this.#v();const e=await this.#Z();this.#G=!1,this.setLabelEditabilityAndRemoveEmptyLabel(!0),e&&await this.#X()}}async#Z(){this.dispatchEvent(new U(!0));const e=await b.FreDialog.show({ariaLabel:z(T.freDialog),header:{iconName:"pen-spark",text:P(_)},reminderItems:[{iconName:"psychiatry",content:P(N)},{iconName:"google",content:this.#N?P(V):P(H)}],onLearnMoreClick:()=>{p.UIUtils.openInNewTab("https://developer.chrome.com/docs/devtools/performance/annotations#auto-annotations")},learnMoreButtonText:O});return this.dispatchEvent(new U(!1)),e&&this.#V.set(!0),this.#V.get()}#M(){const e=Boolean(c.Runtime.hostConfig.devToolsAiGeneratedTimelineLabels?.enabled),t=c.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===c.Runtime.GenAiEnterprisePolicyValue.DISABLE,i=null!==this.#H,n=this.#_?.length<=0;if(e&&!t&&i&&n){const e=c.Runtime.hostConfig.aidaAvailability?.enabled&&!c.Runtime.hostConfig.aidaAvailability?.blockedByAge&&!c.Runtime.hostConfig.aidaAvailability?.blockedByGeo&&navigator.onLine;this.#z=e?"enabled":"disabled"}else this.#z="hidden"}#J(e){return A`<devtools-tooltip
    variant="rich"
    id="info-tooltip"
    ${k.ref(this.#D)}>
      <div class="info-tooltip-container">
        ${e.textContent} ${e.includeSettingsButton?A`
          <button
            class="link tooltip-link"
            role="link"
            jslog=${r.link("open-ai-settings").track({click:!0})}
            @click=${this.#Q}
            aria-label=${z(T.learnMoreAriaLabel)}
          >${P(S)}</button>
        `:i.nothing}
      </div>
    </devtools-tooltip>`}#ee(){return A`
      <span
        class="ai-label-loading">
        <devtools-spinner></devtools-spinner>
        <span class="generate-label-text">${P(F)}</span>
      </span>
    `}#te(){return"generation_failed"===this.#z?A`
        <span
          class="ai-label-error">
          <devtools-icon
            class="warning extra-large"
            name="warning"
            style="color: var(--ref-palette-error50)">
          </devtools-icon>
          <span class="generate-label-text">${P(D)}</span>
        </span>
      `:A`
      <!-- 'preventDefault' on the AI label button to prevent the label removal on blur  -->
      <span
        class="ai-label-button-wrapper only-pen-wrapper"
        @mousedown=${e=>e.preventDefault()}>
        <button
          class="ai-label-button enabled"
          @click=${this.#X}>
          <devtools-icon
            class="pen-icon extra-large"
            name="pen-spark"
            style="color: var(--icon-primary);">
          </devtools-icon>
          <span class="generate-label-text">${z(T.generateLabelButton)}</span>
        </button>
        <devtools-button
          aria-details="info-tooltip"
          class="pen-icon"
          .title=${z(T.moreInfoAriaLabel)}
          .iconName=${"info"}
          .variant=${"icon"}
          ></devtools-button>
        ${this.#J({textContent:this.#N?P(I):P(R),includeSettingsButton:!0})}
      </span>
    `}#Q(){this.#D?.value?.hidePopover(),p.ViewManager.ViewManager.instance().showView("chrome-ai")}#ie(){const e=!1===navigator.onLine;return A`
      <!-- 'preventDefault' on the AI label button to prevent the label removal on blur  -->
      <span
        class="ai-label-disabled-button-wrapper only-pen-wrapper"
        @mousedown=${e=>e.preventDefault()}>
        <button
          class="ai-label-button disabled"
          ?disabled=${!0}
          @click=${this.#X}>
          <devtools-icon
            aria-details="info-tooltip"
            class="pen-icon extra-large"
            name="pen-spark"
            style="color: var(--sys-color-state-disabled);">
          </devtools-icon>
        </button>
        ${this.#J({textContent:P(e?$:B),includeSettingsButton:!e})}
      </span>
    `}#ne(e){const t=e.relatedTarget;t&&this.#e.contains(t)||this.setLabelEditabilityAndRemoveEmptyLabel(!1)}#v(){const e=i.Directives.classMap({"input-field":!0,"fake-focus-state":this.#G});i.render(A`
        <style>${C}</style>
        <span class="label-parts-wrapper" role="region" aria-label=${z(T.entryLabel)}
          @focusout=${this.#ne}
        >
          <span
            class="label-button-input-wrapper">
            <span
              class=${e}
              role="textbox"
              @focus=${()=>{this.setLabelEditabilityAndRemoveEmptyLabel(!0)}}
              @dblclick=${()=>{this.setLabelEditabilityAndRemoveEmptyLabel(!0)}}
              @keydown=${this.#U}
              @paste=${this.#q}
              @input=${this.#j}
              contenteditable=${!!this.#S&&"plaintext-only"}
              jslog=${r.textField("timeline.annotations.entry-label-input").track({keydown:!0,click:!0,change:!0})}
              tabindex="0"
            ></span>
            ${this.#S&&""!==this.#$?.innerText?A`
              <button
                class="delete-button"
                @click=${()=>this.dispatchEvent(new j)}
                jslog=${r.action("timeline.annotations.delete-entry-label").track({click:!0})}>
              <devtools-icon name="cross" class="small" style="color: var(--color-background);"
              ></devtools-icon>
              </button>
            `:i.nothing}
            ${(()=>{switch(this.#z){case"hidden":return i.nothing;case"enabled":case"generation_failed":return this.#te();case"generating_label":return this.#ee();case"disabled":return this.#ie()}})()}
          </span>
          <svg class="connectorContainer">
            <line/>
            <circle/>
          </svg>
          <div class="entry-highlight-wrapper"></div>
        </span>`,this.#e,{host:this})}};customElements.define("devtools-entry-label-overlay",q);var K=Object.freeze({__proto__:null,EntryLabelChangeEvent:M,EntryLabelOverlay:q,EntryLabelRemoveEvent:j,LabelAnnotationsConsentDialogVisibilityChange:U}),Y=`:host{display:flex;overflow:hidden;flex-direction:column;justify-content:flex-end;width:100%;height:100%;box-sizing:border-box;padding-bottom:5px;background:linear-gradient(180deg,rgb(255 125 210/0%) 0%,rgb(255 125 210/15%) 85%);border-color:var(--ref-palette-pink55);border-width:0 1px 5px;border-style:solid;pointer-events:none}.range-container{display:flex;align-items:center;flex-direction:column;text-align:center;box-sizing:border-box;pointer-events:all;user-select:none;color:var(--sys-color-pink);&.labelHidden{user-select:none;pointer-events:none;visibility:hidden}&.offScreenLeft{align-items:flex-start;text-align:left}&.offScreenRight{align-items:flex-end;text-align:right}}.label-text{width:100%;max-width:70px;min-width:fit-content;text-overflow:ellipsis;overflow:hidden;word-break:normal;overflow-wrap:anywhere;margin-bottom:3px;display:-webkit-box;white-space:break-spaces;background:var(--sys-color-cdt-base-container);line-clamp:2;-webkit-line-clamp:2;-webkit-box-orient:vertical}.duration{background:var(--sys-color-cdt-base-container)}.label-text[contenteditable='true']{outline:none;box-shadow:0 0 0 1px var(--ref-palette-pink55)}.label-text[contenteditable='false']{width:auto}\n/*# sourceURL=${import.meta.resolve("./timeRangeOverlay.css")} */`;const X={timeRange:"Time range"},Z=e.i18n.registerUIStrings("panels/timeline/overlays/components/TimeRangeOverlay.ts",X),J=e.i18n.getLocalizedString.bind(void 0,Z);class Q extends Event{newLabel;static eventName="timerangelabelchange";constructor(e){super(Q.eventName),this.newLabel=e}}class ee extends Event{static eventName="timerangeremoveevent";constructor(){super(ee.eventName)}}let te=class extends HTMLElement{#e=this.attachShadow({mode:"open"});#oe=null;#b=null;#_;#S=!0;#re=null;#se=null;constructor(e){super(),this.#v(),this.#re=this.#e.querySelector(".range-container"),this.#se=this.#re?.querySelector(".label-text")??null,this.#_=e,this.#se?(this.#se.innerText=e,e&&(this.#se?.setAttribute("aria-label",e),this.#ae(!1))):console.error("`labelBox` element is missing.")}set canvasRect(e){null!==e&&(this.#b&&this.#b.width===e.width&&this.#b.height===e.height||(this.#b=e,this.#v()))}set duration(e){e!==this.#oe&&(this.#oe=e,this.#v())}#le(e){if(!this.#b)return 0;const{x:t,width:i}=e,n=t+i,o=this.#b.x,r=this.#b.x+this.#b.width,s=Math.max(o,t);return Math.min(r,n)-s}updateLabelPositioning(){if(!this.#re)return;if(!this.#b||!this.#se)return;const e=this.getBoundingClientRect(),t=this.#e.activeElement===this.#se,i=this.#re.getBoundingClientRect(),n=this.#le(e)-9,o=this.#re.querySelector(".duration")??null,r=o?.getBoundingClientRect().width;if(!r)return;const s=n<=r&&!t&&this.#_.length>0;if(this.#re.classList.toggle("labelHidden",s),s)return;const a=(e.width-i.width)/2,l=e.x+a<this.#b.x;this.#re.classList.toggle("offScreenLeft",l);const c=this.#b.x+this.#b.width,h=e.x+a+i.width>c;this.#re.classList.toggle("offScreenRight",h),l?this.#re.style.marginLeft=`${Math.abs(this.#b.x-e.x)+9}px`:h?this.#re.style.marginRight=e.right-this.#b.right+9+"px":this.#re.style.margin="0px",""===this.#se?.innerText&&this.#ae(!0)}#Y(){this.#se?this.#se.focus():console.error("`labelBox` element is missing.")}#ae(e){""!==this.#se?.innerText?(this.#S=e,this.#v(),e&&this.#Y()):this.#Y()}#j(){const e=this.#se?.textContent??"";e!==this.#_&&(this.#_=e,this.dispatchEvent(new Q(this.#_)),this.#se?.setAttribute("aria-label",e))}#U(e){return e.key!==l.KeyboardUtilities.ENTER_KEY&&e.key!==l.KeyboardUtilities.ESCAPE_KEY||(e.stopPropagation(),""===this.#_&&this.dispatchEvent(new ee),this.#se?.blur(),!1)}#v(){const t=this.#oe?e.TimeUtilities.formatMicroSecondsTime(this.#oe):"";n(o`
          <style>${Y}</style>
          <span class="range-container" role="region" aria-label=${J(X.timeRange)}>
            <span
             class="label-text"
             role="textbox"
             @focusout=${()=>this.#ae(!1)}
             @dblclick=${()=>this.#ae(!0)}
             @keydown=${this.#U}
             @keyup=${this.#j}
             contenteditable=${!!this.#S&&"plaintext-only"}
             jslog=${r.textField("timeline.annotations.time-range-label-input").track({keydown:!0,click:!0})}
            ></span>
            <span class="duration">${t}</span>
          </span>
          `,this.#e,{host:this}),this.updateLabelPositioning()}};customElements.define("devtools-time-range-overlay",te);var ie=Object.freeze({__proto__:null,TimeRangeLabelChangeEvent:Q,TimeRangeOverlay:te,TimeRangeRemoveEvent:ee}),ne=`.timespan-breakdown-overlay-section{border:solid;border-color:var(--sys-color-on-surface);border-width:4px 1px 0;align-content:flex-start;text-align:center;overflow:hidden;text-overflow:ellipsis;background-image:linear-gradient(180deg,var(--sys-color-on-primary),transparent);height:90%;box-sizing:border-box;padding-top:var(--sys-size-2);:host(.is-below) &{border-top-width:0;border-bottom-width:4px;align-content:flex-end;padding-bottom:var(--sys-size-2);padding-top:0;.timespan-breakdown-overlay-label{display:flex;flex-direction:column-reverse}}}:host{display:flex;overflow:hidden;flex-direction:row;justify-content:flex-end;align-items:flex-end;width:100%;box-sizing:border-box;height:100%;max-height:100px;.timespan-breakdown-overlay-section:first-child{border-left-width:1px!important}.timespan-breakdown-overlay-section:last-child{border-right-width:1px!important}}:host(.is-below){align-items:flex-start}:host(.odd-number-of-sections){.timespan-breakdown-overlay-section:nth-child(even){height:100%}.timespan-breakdown-overlay-section:nth-child(odd){border-left-width:0;border-right-width:0}}:host(.even-number-of-sections){.timespan-breakdown-overlay-section:nth-child(odd){height:100%}.timespan-breakdown-overlay-section:nth-child(even){border-left-width:0;border-right-width:0}}.timespan-breakdown-overlay-label{font-family:var(--default-font-family);font-size:var(--sys-typescale-body2-size);line-height:var(--sys-typescale-body4-line-height);font-weight:var(--ref-typeface-weight-medium);color:var(--sys-color-on-surface);text-align:center;box-sizing:border-box;width:max-content;padding:0 3px;overflow:hidden;text-overflow:ellipsis;text-wrap:nowrap;.duration-text{font-size:var(--sys-typescale-body4-size);text-overflow:ellipsis;overflow:hidden;text-wrap:nowrap;display:block}.discovery-time-ms{font-weight:var(--ref-typeface-weight-bold)}&.labelHidden{user-select:none;pointer-events:none;visibility:hidden}&.labelTruncated{max-width:100%}&.offScreenLeft{text-align:left}&.offScreenRight{text-align:right}}\n/*# sourceURL=${import.meta.resolve("./timespanBreakdownOverlay.css")} */`;const{html:oe}=i;let re=class extends HTMLElement{#e=this.attachShadow({mode:"open"});#b=null;#ce=null;set isBelowEntry(e){this.classList.toggle("is-below",e)}set canvasRect(e){this.#b&&e&&this.#b.width===e.width&&this.#b.height===e.height||(this.#b=e,this.#v())}set sections(e){e!==this.#ce&&(this.#ce=e,this.#v())}checkSectionLabelPositioning(){const e=this.#e.querySelectorAll(".timespan-breakdown-overlay-section");if(!e)return;if(!this.#b)return;const t=new Map;for(const i of e){const e=i.querySelector(".timespan-breakdown-overlay-label");if(!e)continue;const n=i.getBoundingClientRect(),o=e.getBoundingClientRect();t.set(i,{sectionRect:n,labelRect:o,label:e})}for(const i of e){const e=t.get(i);if(!e)break;const{labelRect:n,sectionRect:o,label:r}=e,s=o.width<30,a=o.width-5<=n.width;if(r.classList.toggle("labelHidden",s),r.classList.toggle("labelTruncated",a),s||a)continue;const l=(o.width-n.width)/2,c=o.x+l<this.#b.x;r.classList.toggle("offScreenLeft",c);const h=this.#b.x+this.#b.width,d=o.x+l+n.width>h;if(r.classList.toggle("offScreenRight",d),c)r.style.marginLeft=`${Math.abs(this.#b.x-o.x)+9}px`;else if(d){const e=h-n.width-o.x;r.style.marginLeft=`${e}px`}else r.style.marginLeft=`${l}px`}}renderedSections(){return Array.from(this.#e.querySelectorAll(".timespan-breakdown-overlay-section"))}#he(t){return oe`
      <div class="timespan-breakdown-overlay-section">
        <div class="timespan-breakdown-overlay-label">
        ${t.showDuration?oe`<span class="duration-text">${e.TimeUtilities.formatMicroSecondsAsMillisFixed(t.bounds.range)}</span> `:i.nothing}
          <span class="section-label-text">${t.label}</span>
        </div>
      </div>`}#v(){this.#ce&&(this.classList.toggle("odd-number-of-sections",this.#ce.length%2==1),this.classList.toggle("even-number-of-sections",this.#ce.length%2==0)),i.render(oe`<style>${ne}</style>
             ${this.#ce?.map(this.#he)}`,this.#e,{host:this}),this.checkSectionLabelPositioning()}};customElements.define("devtools-timespan-breakdown-overlay",re);var se=Object.freeze({__proto__:null,TimespanBreakdownOverlay:re});export{E as EntriesLinkOverlay,K as EntryLabelOverlay,ie as TimeRangeOverlay,se as TimespanBreakdownOverlay};
//# sourceMappingURL=components.js.map
