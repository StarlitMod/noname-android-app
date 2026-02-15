import*as e from"../../../ui/lit/lit.js";import"../../../ui/components/icon_button/icon_button.js";import*as t from"../../../core/i18n/i18n.js";import*as i from"../../../models/badges/badges.js";import"../../../ui/components/buttons/buttons.js";import*as o from"../../../ui/components/input/input.js";import*as s from"../../../ui/legacy/legacy.js";import*as r from"../../../ui/visual_logging/visual_logging.js";import*as n from"../models/models.js";import*as a from"../extensions/extensions.js";import*as l from"../../../core/host/host.js";import*as c from"../../../ui/components/helpers/helpers.js";import*as d from"../../../core/platform/platform.js";import*as p from"../../../core/sdk/sdk.js";import*as u from"../../../third_party/codemirror.next/codemirror.next.js";import*as h from"../../../ui/components/code_highlighter/code_highlighter.js";import"../../../ui/components/dialogs/dialogs.js";import*as g from"../../../ui/components/text_editor/text_editor.js";import*as v from"../../../ui/components/menus/menus.js";import*as m from"../../../ui/components/suggestion_input/suggestion_input.js";import*as b from"../controllers/controllers.js";import*as f from"../util/util.js";var y=`*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}.control{background:none;border:none;display:flex;flex-direction:column;align-items:center}.control[disabled]{filter:grayscale(100%);cursor:auto}.icon{display:flex;width:40px;height:40px;border-radius:50%;background:var(--sys-color-error-bright);margin-bottom:8px;position:relative;transition:background 200ms;place-content:center center;align-items:center}.icon::before{--override-white:#fff;box-sizing:border-box;content:"";display:block;width:14px;height:14px;border:1px solid var(--override-white);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:var(--override-white)}.icon.square::before{border-radius:0}.icon.circle::before{border-radius:50%}.icon:hover{background:color-mix(in srgb,var(--sys-color-error-bright),var(--sys-color-state-hover-on-prominent) 10%)}.icon:active{background:color-mix(in srgb,var(--sys-color-error-bright),var(--sys-color-state-ripple-neutral-on-prominent) 16%)}.control[disabled] .icon:hover{background:var(--sys-color-error)}.label{font-size:12px;line-height:16px;text-align:center;letter-spacing:0.02em;color:var(--sys-color-on-surface)}\n/*# sourceURL=${import.meta.resolve("./controlButton.css")} */`,w=self&&self.__decorate||function(e,t,i,o){var s,r=arguments.length,n=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(r<3?s(n):r>3?s(t,i,n):s(t,i))||n);return r>3&&n&&Object.defineProperty(t,i,n),n};const{html:x,Decorators:S,LitElement:$}=e,{customElement:k,property:C}=S;let E=class extends ${constructor(){super(),this.label="",this.shape="square",this.disabled=!1}#e=e=>{this.disabled&&(e.stopPropagation(),e.preventDefault())};render(){return x`
            <style>${y}</style>
            <button
                @click=${this.#e}
                .disabled=${this.disabled}
                class="control">
              <div class="icon ${this.shape}"></div>
              <div class="label">${this.label}</div>
            </button>
        `}};w([C()],E.prototype,"label",void 0),w([C()],E.prototype,"shape",void 0),w([C({type:Boolean})],E.prototype,"disabled",void 0),E=w([k("devtools-control-button")],E);var R=Object.freeze({__proto__:null,get ControlButton(){return E}}),T=`*{margin:0;padding:0;outline:none;box-sizing:border-box;font-size:inherit}.wrapper{padding:24px;flex:1}h1{font-size:18px;line-height:24px;letter-spacing:0.02em;color:var(--sys-color-on-surface);margin:0;font-weight:normal}.row-label{font-weight:500;font-size:11px;line-height:16px;letter-spacing:0.8px;text-transform:uppercase;color:var(--sys-color-secondary);margin-bottom:8px;margin-top:32px;display:flex;align-items:center;gap:3px}.footer{display:flex;justify-content:center;border-top:1px solid var(--sys-color-divider);padding:12px;background:var(--sys-color-cdt-base-container)}.controls{display:flex}.error{margin:16px 0 0;padding:8px;background:var(--sys-color-error-container);color:var(--sys-color-error)}.row-label .link:focus-visible{outline:var(--sys-color-state-focus-ring) auto 1px}.header-wrapper{display:flex;align-items:baseline;justify-content:space-between}.checkbox-label{display:inline-flex;align-items:center;overflow:hidden;text-overflow:ellipsis;gap:4px;line-height:1.1;padding:4px}.checkbox-container{display:flex;flex-flow:row wrap;gap:10px}input[type="checkbox"]:focus-visible{outline:var(--sys-color-state-focus-ring) auto 1px}devtools-icon[name="help"]{width:16px;height:16px}\n/*# sourceURL=${import.meta.resolve("./createRecordingView.css")} */`;const{html:I,Directives:{ref:N,createRef:A,repeat:j}}=e,M={recordingName:"Recording name",startRecording:"Start recording",createRecording:"Create a new recording",recordingNameIsRequired:"Recording name is required",selectorAttribute:"Selector attribute",cancelRecording:"Cancel recording",selectorTypeCSS:"CSS",selectorTypePierce:"Pierce",selectorTypeARIA:"ARIA",selectorTypeText:"Text",selectorTypeXPath:"XPath",selectorTypes:"Selector types to record",includeNecessarySelectors:"You must choose CSS, Pierce, or XPath as one of your options. Only these selectors are guaranteed to be recorded since ARIA and text selectors may not be unique.",learnMore:"Learn more"},L=t.i18n.registerUIStrings("panels/recorder/components/CreateRecordingView.ts",M),P=t.i18n.getLocalizedString.bind(void 0,L),B=(t,i,s)=>{const{name:a,selectorAttribute:l,selectorTypes:c,error:d,onUpdate:p,onRecordingStarted:u,onRecordingCancelled:h,onErrorReset:g}=t,v=A(),m=e=>{d&&g();"Enter"===e.key&&(u(),e.stopPropagation(),e.preventDefault())};i.focusInput=()=>{v.value?.focus()};const b=new Map([[n.Schema.SelectorType.ARIA,P(M.selectorTypeARIA)],[n.Schema.SelectorType.CSS,P(M.selectorTypeCSS)],[n.Schema.SelectorType.Text,P(M.selectorTypeText)],[n.Schema.SelectorType.XPath,P(M.selectorTypeXPath)],[n.Schema.SelectorType.Pierce,P(M.selectorTypePierce)]]);e.render(I`
      <style>${T}</style>
      <style>${o.textInputStyles}</style>
      <style>${o.checkboxStyles}</style>
      <div class="wrapper" jslog=${r.section("create-recording-view")}>
        <div class="header-wrapper">
          <h1>${P(M.createRecording)}</h1>
          <devtools-button
            title=${P(M.cancelRecording)}
            jslog=${r.close().track({click:!0})}
            .data=${{variant:"icon",size:"SMALL",iconName:"cross"}}
            @click=${h}
          ></devtools-button>
        </div>
        <label class="row-label" for="user-flow-name">${P(M.recordingName)}</label>
        <input
          value=${a}
          @focus=${()=>v.value?.select()}
          @keydown=${m}
          jslog=${r.textField("user-flow-name").track({change:!0})}
          class="devtools-text-input"
          id="user-flow-name"
          ${N(v)}
          @input=${e=>p({name:e.target.value.trim()})}
        />
        <label class="row-label" for="selector-attribute">
          <span>${P(M.selectorAttribute)}</span>
          <x-link
            class="link" href="https://g.co/devtools/recorder#selector"
            title=${P(M.learnMore)}
            jslog=${r.link("recorder-selector-help").track({click:!0})}>
            <devtools-icon name="help">
            </devtools-icon>
          </x-link>
        </label>
        <input
          value=${l}
          placeholder="data-testid"
          @keydown=${m}
          jslog=${r.textField("selector-attribute").track({change:!0})}
          class="devtools-text-input"
          id="selector-attribute"
          @input=${e=>p({selectorAttribute:e.target.value.trim()})}
        />
        <label class="row-label">
          <span>${P(M.selectorTypes)}</span>
          <x-link
            class="link" href="https://g.co/devtools/recorder#selector"
            title=${P(M.learnMore)}
            jslog=${r.link("recorder-selector-help").track({click:!0})}>
            <devtools-icon name="help">
            </devtools-icon>
          </x-link>
        </label>
        <div class="checkbox-container">
          ${j(c,e=>I`
              <label class="checkbox-label selector-type">
                <input
                  @keydown=${m}
                  .value=${e.selectorType}
                  jslog=${r.toggle().track({click:!0}).context(`selector-${e.selectorType}`)}
                  ?checked=${e.checked}
                  type="checkbox"
                  @change=${t=>p({selectorType:e.selectorType,checked:t.target.checked})}
                />
                ${b.get(e.selectorType)||e.selectorType}
              </label>
            `)}
        </div>
        ${d&&I` <div class="error" role="alert"> ${d.message} </div>`}
      </div>
      <div class="footer">
        <div class="controls">
          <devtools-control-button
            @click=${u}
            .label=${P(M.startRecording)}
            .shape=${"circle"}
            jslog=${r.action("chrome-recorder.start-recording").track({click:!0})}
            title=${n.Tooltip.getTooltipForActions(P(M.startRecording),"chrome-recorder.start-recording")}
          ></devtools-control-button>
        </div>
      </div>
    `,s)};class O extends s.Widget.Widget{#t;#i="";#o="";#s=[];#r;#n={};#a;onRecordingStarted=()=>{};onRecordingCancelled=()=>{};set recorderSettings(e){this.#a=e,this.#i=this.#a.defaultTitle,this.#o=this.#a.selectorAttribute,this.#s=Object.values(n.Schema.SelectorType).map(e=>({selectorType:e,checked:this.#a?.getSelectorByType(e)??!0})),this.requestUpdate()}constructor(e,t){super(e,{useShadowDom:!0}),this.#r=t||B}wasShown(){super.wasShown(),this.requestUpdate(),this.updateComplete.then(()=>this.#n.focusInput?.())}startRecording(){if(!this.#a)throw new Error("settings not set");if(!this.#i.trim())return this.#t=new Error(P(M.recordingNameIsRequired)),void this.requestUpdate();const e=this.#s.filter(e=>e.checked).map(e=>e.selectorType);if(!e.includes(n.Schema.SelectorType.CSS)&&!e.includes(n.Schema.SelectorType.XPath)&&!e.includes(n.Schema.SelectorType.Pierce))return this.#t=new Error(P(M.includeNecessarySelectors)),void this.requestUpdate();for(const t of Object.values(n.Schema.SelectorType))this.#a.setSelectorByType(t,e.includes(t));const t=this.#o.trim();t&&(this.#a.selectorAttribute=t),this.onRecordingStarted({name:this.#i,selectorTypesToRecord:e,selectorAttribute:this.#o?this.#o:void 0}),i.UserBadges.instance().recordAction(i.BadgeAction.RECORDER_RECORDING_STARTED)}performUpdate(){this.#r({name:this.#i,selectorAttribute:this.#o,selectorTypes:this.#s,error:this.#t,onRecordingCancelled:this.onRecordingCancelled,onUpdate:e=>{"name"in e?this.#i=e.name:"selectorAttribute"in e?this.#o=e.selectorAttribute:this.#s=this.#s.map(t=>t.selectorType===e.selectorType?{...t,checked:e.checked}:t),this.requestUpdate()},onRecordingStarted:()=>{this.startRecording()},onErrorReset:()=>{this.#t=void 0,this.requestUpdate()}},this.#n,this.contentElement)}}var D=Object.freeze({__proto__:null,CreateRecordingView:O,DEFAULT_VIEW:B}),F=`@scope to (devtools-widget > *){*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}*:focus,\n  *:focus-visible{outline:none}.wrapper{padding:24px}.header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}h1{font-size:16px;line-height:19px;color:var(--sys-color-on-surface);font-weight:normal}.icon,\n  .icon devtools-icon{width:20px;height:20px;color:var(--sys-color-primary)}.table{margin-top:35px}.title{font-size:13px;color:var(--sys-color-on-surface);margin-left:10px;flex:1;overflow-x:hidden;white-space:nowrap;text-overflow:ellipsis}.row{display:flex;align-items:center;padding-right:5px;height:28px;border-bottom:1px solid var(--sys-color-divider)}.row:focus-within,\n  .row:hover{background-color:var(--sys-color-state-hover-on-subtle)}.row:last-child{border-bottom:none}.actions{display:flex;align-items:center}.actions button{border:none;background-color:transparent;width:24px;height:24px;border-radius:50%}.actions .divider{width:1px;height:17px;background-color:var(--sys-color-divider);margin:0 6px}}\n/*# sourceURL=${import.meta.resolve("./recordingListView.css")} */`;const{html:z}=e,V={savedRecordings:"Saved recordings",createRecording:"Create a new recording",playRecording:"Play recording",deleteRecording:"Delete recording",openRecording:"Open recording"},U=t.i18n.registerUIStrings("panels/recorder/components/RecordingListView.ts",V),_=t.i18n.getLocalizedString.bind(void 0,U);class K extends Event{static eventName="createrecording";constructor(){super(K.eventName,{composed:!0,bubbles:!0})}}class q extends Event{storageName;static eventName="deleterecording";constructor(e){super(q.eventName,{composed:!0,bubbles:!0}),this.storageName=e}}class G extends Event{storageName;static eventName="openrecording";constructor(e){super(G.eventName,{composed:!0,bubbles:!0}),this.storageName=e}}class W extends Event{storageName;static eventName="playrecording";constructor(e){super(W.eventName,{composed:!0,bubbles:!0}),this.storageName=e}}const H=(t,i,o)=>{const{recordings:s,replayAllowed:a,onCreateClick:l,onDeleteClick:c,onOpenClick:d,onPlayRecordingClick:p,onKeyDown:u}=t;e.render(z`
      <style>${F}</style>
      <div class="wrapper">
        <div class="header">
          <h1>${_(V.savedRecordings)}</h1>
          <devtools-button
            .variant=${"primary"}
            @click=${l}
            title=${n.Tooltip.getTooltipForActions(_(V.createRecording),"chrome-recorder.create-recording")}
            .jslogContext=${"create-recording"}
          >
            ${_(V.createRecording)}
          </devtools-button>
        </div>
        <div class="table">
          ${s.map(e=>z`
                <div
                  role="button"
                  tabindex="0"
                  aria-label=${_(V.openRecording)}
                  class="row"
                  @keydown=${t=>u(e.storageName,t)}
                  @click=${t=>d(e.storageName,t)}
                  jslog=${r.item().track({click:!0}).context("recording")}>
                  <div class="icon">
                    <devtools-icon name="flow">
                    </devtools-icon>
                  </div>
                  <div class="title">${e.name}</div>
                  <div class="actions">
                    ${a?z`
                              <devtools-button
                                title=${_(V.playRecording)}
                                .data=${{variant:"icon",iconName:"play",jslogContext:"play-recording"}}
                                @click=${t=>p(e.storageName,t)}
                                @keydown=${e=>e.stopPropagation()}
                              ></devtools-button>
                              <div class="divider"></div>`:""}
                    <devtools-button
                      class="delete-recording-button"
                      title=${_(V.deleteRecording)}
                      .data=${{variant:"icon",iconName:"bin",jslogContext:"delete-recording"}}
                      @click=${t=>c(e.storageName,t)}
                      @keydown=${e=>e.stopPropagation()}
                    ></devtools-button>
                  </div>
                </div>
              `)}
        </div>
      </div>
    `,o)};class X extends s.Widget.Widget{#l=[];#c=!0;#r;constructor(e,t){super(e,{useShadowDom:!0}),this.#r=t||H}set recordings(e){this.#l=e,this.performUpdate()}set replayAllowed(e){this.#c=e,this.performUpdate()}#d(){this.contentElement.dispatchEvent(new K)}#p(e,t){t.stopPropagation(),this.contentElement.dispatchEvent(new q(e))}#u(e,t){t.stopPropagation(),this.contentElement.dispatchEvent(new G(e))}#h(e,t){t.stopPropagation(),this.contentElement.dispatchEvent(new W(e))}#g(e,t){"Enter"===t.key&&this.#u(e,t)}performUpdate(){this.#r({recordings:this.#l,replayAllowed:this.#c,onCreateClick:this.#d.bind(this),onDeleteClick:this.#p.bind(this),onOpenClick:this.#u.bind(this),onPlayRecordingClick:this.#h.bind(this),onKeyDown:this.#g.bind(this)},{},this.contentElement)}wasShown(){super.wasShown(),this.performUpdate()}}var Y=Object.freeze({__proto__:null,CreateRecordingEvent:K,DEFAULT_VIEW:H,DeleteRecordingEvent:q,OpenRecordingEvent:G,PlayRecordingEvent:W,RecordingListView:X}),J=`*{margin:0;padding:0;outline:none;box-sizing:border-box;font-size:inherit}.extension-view{display:flex;flex-direction:column;height:100%}main{flex:1}iframe{border:none;height:100%;width:100%}header{display:flex;padding:3px 8px;justify-content:space-between;border-bottom:1px solid var(--sys-color-divider)}header > div{align-self:center}.icon{display:block;width:16px;height:16px;color:var(--sys-color-secondary)}.title{display:flex;flex-direction:row;gap:6px;color:var(--sys-color-secondary);align-items:center;font-weight:500}\n/*# sourceURL=${import.meta.resolve("./extensionView.css")} */`;const{html:Z}=e,Q={closeView:"Close",extension:"Content provided by a browser extension"},ee=t.i18n.registerUIStrings("panels/recorder/components/ExtensionView.ts",Q),te=t.i18n.getLocalizedString.bind(void 0,ee);class ie extends Event{static eventName="recorderextensionviewclosed";constructor(){super(ie.eventName,{bubbles:!0,composed:!0})}}class oe extends HTMLElement{#v=this.attachShadow({mode:"open"});#m;constructor(){super(),this.setAttribute("jslog",`${r.section("extension-view")}`)}connectedCallback(){this.#b()}disconnectedCallback(){this.#m&&a.ExtensionManager.ExtensionManager.instance().getView(this.#m.id).hide()}set descriptor(e){this.#m=e,this.#b(),a.ExtensionManager.ExtensionManager.instance().getView(e.id).show()}#f(){this.dispatchEvent(new ie)}#b(){if(!this.#m)return;const t=a.ExtensionManager.ExtensionManager.instance().getView(this.#m.id).frame();e.render(Z`
        <style>${J}</style>
        <div class="extension-view">
          <header>
            <div class="title">
              <devtools-icon
                class="icon"
                title=${te(Q.extension)}
                name="extension">
              </devtools-icon>
              ${this.#m.title}
            </div>
            <devtools-button
              title=${te(Q.closeView)}
              jslog=${r.close().track({click:!0})}
              .data=${{variant:"icon",size:"SMALL",iconName:"cross"}}
              @click=${this.#f}
            ></devtools-button>
          </header>
          <main>
            ${t}
          </main>
      </div>
    `,this.#v,{host:this})}}customElements.define("devtools-recorder-extension-view",oe);const{html:se}=e,re={Replay:"Replay",ReplayNormalButtonLabel:"Normal speed",ReplayNormalItemLabel:"Normal (Default)",ReplaySlowButtonLabel:"Slow speed",ReplaySlowItemLabel:"Slow",ReplayVerySlowButtonLabel:"Very slow speed",ReplayVerySlowItemLabel:"Very slow",ReplayExtremelySlowButtonLabel:"Extremely slow speed",ReplayExtremelySlowItemLabel:"Extremely slow",speedGroup:"Speed",extensionGroup:"Extensions"},ne=[{value:"normal",buttonIconName:"play",buttonLabel:()=>ce(re.ReplayNormalButtonLabel),label:()=>ce(re.ReplayNormalItemLabel)},{value:"slow",buttonIconName:"play",buttonLabel:()=>ce(re.ReplaySlowButtonLabel),label:()=>ce(re.ReplaySlowItemLabel)},{value:"very_slow",buttonIconName:"play",buttonLabel:()=>ce(re.ReplayVerySlowButtonLabel),label:()=>ce(re.ReplayVerySlowItemLabel)},{value:"extremely_slow",buttonIconName:"play",buttonLabel:()=>ce(re.ReplayExtremelySlowButtonLabel),label:()=>ce(re.ReplayExtremelySlowItemLabel)}],ae={normal:1,slow:2,very_slow:3,extremely_slow:4},le=t.i18n.registerUIStrings("panels/recorder/components/ReplaySection.ts",re),ce=t.i18n.getLocalizedString.bind(void 0,le);class de extends Event{speed;extension;static eventName="startreplay";constructor(e,t){super(de.eventName,{bubbles:!0,composed:!0}),this.speed=e,this.extension=t}}const pe="extension";class ue extends HTMLElement{#v=this.attachShadow({mode:"open"});#y={disabled:!1};#w;#x=[];set data(e){this.#w=e.settings,this.#x=e.replayExtensions}get disabled(){return this.#y.disabled}set disabled(e){this.#y.disabled=e,c.ScheduledRender.scheduleRender(this,this.#b)}connectedCallback(){c.ScheduledRender.scheduleRender(this,this.#b)}#S(e){const t=e.value;this.#w&&e.value&&(this.#w.speed=t,this.#w.replayExtension=""),ae[t]&&l.userMetrics.recordingReplaySpeed(ae[t]),c.ScheduledRender.scheduleRender(this,this.#b)}#$(e){if(e.stopPropagation(),e.value?.startsWith(pe)){this.#w&&(this.#w.replayExtension=e.value);const t=Number(e.value.substring(9));return this.dispatchEvent(new de("normal",this.#x[t])),void c.ScheduledRender.scheduleRender(this,this.#b)}this.dispatchEvent(new de(this.#w?this.#w.speed:"normal")),c.ScheduledRender.scheduleRender(this,this.#b)}#b(){const t=[{name:ce(re.speedGroup),items:ne}];this.#x.length&&t.push({name:ce(re.extensionGroup),items:this.#x.map((e,t)=>({value:pe+t,buttonIconName:"play",buttonLabel:()=>e.getName(),label:()=>e.getName()}))}),e.render(se`
    <devtools-select-button
      @selectmenuselected=${this.#S}
      @selectbuttonclick=${this.#$}
      .variant=${"primary"}
      .showItemDivider=${!1}
      .disabled=${this.#y.disabled}
      .action=${"chrome-recorder.replay-recording"}
      .value=${this.#w?.replayExtension||this.#w?.speed||""}
      .buttonLabel=${ce(re.Replay)}
      .groups=${t}
      jslog=${r.action("chrome-recorder.replay-recording").track({click:!0})}
    ></devtools-select-button>`,this.#v,{host:this})}}customElements.define("devtools-replay-section",ue);var he=Object.freeze({__proto__:null,ReplaySection:ue,StartReplayEvent:de}),ge=`@scope to (devtools-widget > *){*{padding:0;margin:0;box-sizing:border-box;font-size:inherit}.wrapper{display:flex;flex-direction:row;flex:1;height:100%}.main{overflow:hidden;display:flex;flex-direction:column;flex:1}.sections{min-height:0;overflow:hidden;background-color:var(--sys-color-cdt-base-container);z-index:0;position:relative;container:sections/inline-size}.section{display:flex;padding:0 16px;gap:8px;position:relative}.section::after{content:'';border-bottom:1px solid var(--sys-color-divider);position:absolute;left:0;right:0;bottom:0;z-index:-1}.section:last-child::after{content:none}.screenshot-wrapper{flex:0 0 80px;padding-top:32px;z-index:2}@container sections (max-width: 400px){.screenshot-wrapper{display:none}}.screenshot{object-fit:cover;object-position:top center;max-width:100%;width:200px;height:auto;border:1px solid var(--sys-color-divider);border-radius:1px}.content{flex:1;min-width:0}.steps{flex:1;position:relative;align-self:flex-start;overflow:visible}.step{position:relative;padding-left:40px;margin:16px 0}.step .action{font-size:13px;line-height:16px;letter-spacing:0.03em}.recording{color:var(--sys-color-primary);font-style:italic;margin-top:8px;margin-bottom:0}.add-assertion-button{margin-top:8px}.details{max-width:240px;display:flex;flex-direction:column;align-items:flex-end}.url{font-size:12px;line-height:16px;letter-spacing:0.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sys-color-secondary);max-width:100%;margin-bottom:16px}.header{flex-shrink:0;align-items:center;border-bottom:1px solid var(--sys-color-divider);display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;padding:16px}.header-title-wrapper{max-width:100%}.header-title{align-items:center;display:flex;flex:1;max-width:100%}.header-title::before{content:'';min-width:12px;height:12px;display:inline-block;background:var(--sys-color-primary);border-radius:50%;margin-right:7px}#title-input{font-family:inherit;field-sizing:content;font-size:18px;line-height:22px;letter-spacing:0.02em;padding:1px 4px;border:1px solid transparent;border-radius:1px;word-break:break-all}#title-input:hover,\n  #title-input:focus-visible{border-color:var(--input-outline)}#title-input.has-error{border-color:var(--sys-color-error)}#title-input.disabled{color:var(--sys-color-state-disabled)}.title-input-error-text{margin-top:4px;margin-left:19px;color:var(--sys-color-error)}.title-button-bar{flex-shrink:0;padding-left:2px;display:flex}#title-input:focus + .title-button-bar{display:none}.settings-row{padding:16px 28px;border-bottom:1px solid var(--sys-color-divider);display:flex;flex-flow:row wrap;justify-content:space-between}.settings-title{font-size:14px;line-height:24px;letter-spacing:0.03em;color:var(--sys-color-on-surface);display:flex;align-items:center;align-content:center;gap:5px;width:fit-content}.settings{margin-top:4px;display:flex;flex-wrap:wrap;font-size:12px;line-height:20px;letter-spacing:0.03em;color:var(--sys-color-on-surface-subtle)}.settings.expanded{gap:10px}.settings .separator{width:1px;height:20px;background-color:var(--sys-color-divider);margin:0 5px}.actions{display:flex;align-items:center;flex-wrap:wrap;gap:12px}.actions .separator{width:1px;height:24px;background-color:var(--sys-color-divider)}.is-recording .header-title::before{background:var(--sys-color-error-bright)}.footer{display:flex;justify-content:center;border-top:1px solid var(--sys-color-divider);padding:12px;background:var(--sys-color-cdt-base-container);z-index:1}.controls{align-items:center;display:flex;justify-content:center;position:relative;width:100%}.chevron{width:14px;height:14px;transform:rotate(-90deg);color:var(--sys-color-on-surface)}.expanded .chevron{transform:rotate(0)}.editable-setting{display:flex;flex-direction:row;gap:12px;align-items:center}.editable-setting .devtools-text-input{width:fit-content;height:var(--sys-size-9)}.wrapping-label{display:inline-flex;align-items:center;gap:12px}.text-editor{height:100%;overflow:auto}.section-toolbar{display:flex;align-items:center;padding:3px 5px;justify-content:space-between;gap:3px}.section-toolbar > devtools-select-menu{height:24px;min-width:50px}.sections .section-toolbar{justify-content:flex-end}devtools-split-view{flex:1 1 0%;min-height:0}[slot='main']{overflow:hidden auto}[slot='sidebar']{display:flex;flex-direction:column;overflow:auto;height:100%;width:100%}[slot='sidebar'] .section-toolbar{border-bottom:1px solid var(--sys-color-divider)}.show-code{margin-right:14px;margin-top:8px}devtools-recorder-extension-view{flex:1}}\n/*# sourceURL=${import.meta.resolve("./recordingView.css")} */`;const{html:ve}=e,me={mobile:"Mobile",desktop:"Desktop",latency:"Latency: {value} ms",upload:"Upload: {value}",download:"Download: {value}",editReplaySettings:"Edit replay settings",replaySettings:"Replay settings",default:"Default",environment:"Environment",screenshotForSection:"Screenshot for this section",editTitle:"Edit title",requiredTitleError:"Title is required",recording:"Recording…",endRecording:"End recording",recordingIsBeingStopped:"Stopping recording…",timeout:"Timeout: {value} ms",network:"Network",timeoutLabel:"Timeout",timeoutExplanation:"The timeout setting (in milliseconds) applies to every action when replaying the recording. For example, if a DOM element identified by a CSS selector does not appear on the page within the specified timeout, the replay fails with an error.",cancelReplay:"Cancel replay",showCode:"Show code",hideCode:"Hide code",addAssertion:"Add assertion",performancePanel:"Performance panel"},be=t.i18n.registerUIStrings("panels/recorder/components/RecordingView.ts",me),fe=t.i18n.getLocalizedString.bind(void 0,be),ye=[p.NetworkManager.NoThrottlingConditions,p.NetworkManager.OfflineConditions,p.NetworkManager.Slow3GConditions,p.NetworkManager.Slow4GConditions,p.NetworkManager.Fast4GConditions];function we(t,i){return t.extensionDescriptor?ve`
        <devtools-recorder-extension-view .descriptor=${t.extensionDescriptor}>
        </devtools-recorder-extension-view>
      `:ve`
        <devtools-split-view
          direction="auto"
          sidebar-position="second"
          sidebar-initial-size="300"
          sidebar-visibility=${t.showCodeView?"":"hidden"}
        >
          <div slot="main">
            ${function(e){return ve`
      <div class="sections">
      ${e.showCodeView?"":ve`<div class="section-toolbar">
        <devtools-button
          @click=${e.showCodeToggle}
          class="show-code"
          .data=${{variant:"outlined",title:n.Tooltip.getTooltipForActions(fe(me.showCode),"chrome-recorder.toggle-code-view")}}
          jslog=${r.toggleSubpane("chrome-recorder.toggle-code-view").track({click:!0})}
        >
          ${fe(me.showCode)}
        </devtools-button>
      </div>`}
      ${e.sections.map((t,i)=>ve`
            <div class="section">
              <div class="screenshot-wrapper">
                ${function(e){if(!e.screenshot)return null;return ve`
      <img class="screenshot" src=${e.screenshot} alt=${fe(me.screenshotForSection)} />
    `}(t)}
              </div>
              <div class="content">
                <div class="steps">
                  <devtools-step-view
                    @click=${e.onStepClick}
                    @mouseover=${e.onStepHover}
                    .data=${{section:t,state:e.getSectionState(t),isStartOfGroup:!0,isEndOfGroup:0===t.steps.length,isFirstSection:0===i,isLastSection:i===e.sections.length-1&&0===t.steps.length,isSelected:e.selectedStep===(t.causingStep||null),sectionIndex:i,isRecording:e.isRecording,isPlaying:e.replayState.isPlaying,error:"error"===e.getSectionState(t)?e.currentError:void 0,hasBreakpoint:!1,removable:e.recording.steps.length>1&&t.causingStep}}
                  >
                  </devtools-step-view>
                  ${t.steps.map(o=>{const s=e.recording.steps.indexOf(o);return ve`
                      <devtools-step-view
                      @click=${e.onStepClick}
                      @mouseover=${e.onStepHover}
                      @copystep=${e.onCopyStep}
                      .data=${{step:o,state:e.getStepState(o),error:e.currentStep===o?e.currentError:void 0,isFirstSection:!1,isLastSection:i===e.sections.length-1&&e.recording.steps[e.recording.steps.length-1]===o,isStartOfGroup:!1,isEndOfGroup:t.steps[t.steps.length-1]===o,stepIndex:s,hasBreakpoint:e.breakpointIndexes.has(s),sectionIndex:-1,isRecording:e.isRecording,isPlaying:e.replayState.isPlaying,removable:e.recording.steps.length>1,builtInConverters:e.builtInConverters,extensionConverters:e.extensionConverters,isSelected:e.selectedStep===o,recorderSettings:e.recorderSettings}}
                      jslog=${r.section("step").track({click:!0})}
                      ></devtools-step-view>
                    `})}
                  ${!e.recordingTogglingInProgress&&e.isRecording&&i===e.sections.length-1?ve`<devtools-button
                    class="step add-assertion-button"
                    .data=${{variant:"outlined",title:fe(me.addAssertion),jslogContext:"add-assertion"}}
                    @click=${e.onAddAssertion}
                  >${fe(me.addAssertion)}</devtools-button>`:void 0}
                  ${e.isRecording&&i===e.sections.length-1?ve`<div class="step recording">${fe(me.recording)}</div>`:null}
                </div>
              </div>
            </div>
      `)}
      </div>
    `}(t)}
          </div>
          <div slot="sidebar" jslog=${r.pane("source-code").track({resize:!0})}>
            ${t.showCodeView?ve`
            <div class="section-toolbar" jslog=${r.toolbar()}>
              <devtools-select-menu
                @selectmenuselected=${t.onCodeFormatChange}
                .showDivider=${!0}
                .showArrow=${!0}
                .sideButton=${!1}
                .showSelectedItem=${!0}
                .position=${"bottom"}
                .buttonTitle=${t.converterName||""}
                .jslogContext=${"code-format"}
              >
                ${t.builtInConverters.map(e=>ve`<devtools-menu-item
                    .value=${e.getId()}
                    .selected=${t.converterId===e.getId()}
                    jslog=${r.action().track({click:!0}).context(`converter-${d.StringUtilities.toKebabCase(e.getId())}`)}
                  >
                    ${e.getFormatName()}
                  </devtools-menu-item>`)}
                ${t.extensionConverters.map(e=>ve`<devtools-menu-item
                    .value=${e.getId()}
                    .selected=${t.converterId===e.getId()}
                    jslog=${r.action().track({click:!0}).context("converter-extension")}
                  >
                    ${e.getFormatName()}
                  </devtools-menu-item>`)}
              </devtools-select-menu>
              <devtools-button
                title=${n.Tooltip.getTooltipForActions(fe(me.hideCode),"chrome-recorder.toggle-code-view")}
                .data=${{variant:"icon",size:"SMALL",iconName:"cross"}}
                @click=${t.showCodeToggle}
                jslog=${r.close().track({click:!0})}
              ></devtools-button>
            </div>
            ${function(t,i){if(!t.editorState)throw new Error("Unexpected: trying to render the text editor without editorState");return ve`
    <div class="text-editor" jslog=${r.textField().track({change:!0})}>
      <devtools-text-editor .state=${t.editorState} ${e.Directives.ref(e=>{e&&e instanceof g.TextEditor.TextEditor&&(i.highlightLinesInEditor=(t,i,o=!1)=>{const s=e.editor;let r=e.createSelection({lineNumber:t+i,columnNumber:0},{lineNumber:t,columnNumber:0});const n=e.state.doc.lineAt(r.main.anchor);r=e.createSelection({lineNumber:t+i-1,columnNumber:n.length+1},{lineNumber:t,columnNumber:0}),s.dispatch({selection:r,effects:o?[u.EditorView.scrollIntoView(r.main,{y:"nearest"})]:void 0})})})}></devtools-text-editor>
    </div>
  `}(t,i)}`:e.nothing}
          </div>
        </devtools-split-view>
      `}function xe(t){if(!t.recording)return e.nothing;const{title:i}=t.recording,o=!t.replayState.isPlaying&&!t.isRecording;return ve`
    <div class="header">
      <div class="header-title-wrapper">
        <div class="header-title">
          <input @blur=${t.onTitleBlur}
                @keydown=${t.onTitleInputKeyDown}
                id="title-input"
                jslog=${r.value("title").track({change:!0})}
                class=${e.Directives.classMap({"has-error":t.isTitleInvalid,disabled:!o})}
                .value=${e.Directives.live(i)}
                .disabled=${!o}
                >
          <div class="title-button-bar">
            <devtools-button
              @click=${t.onEditTitleButtonClick}
              .data=${{disabled:!o,variant:"toolbar",iconName:"edit",title:fe(me.editTitle),jslogContext:"edit-title"}}
            ></devtools-button>
          </div>
        </div>
        ${t.isTitleInvalid?ve`<div class="title-input-error-text">
          ${fe(me.requiredTitleError)}
        </div>`:e.nothing}
      </div>
      ${!t.isRecording&&t.replayAllowed?ve`<div class="actions">
              <devtools-button
                @click=${t.onMeasurePerformanceClick}
                .data=${{disabled:t.replayState.isPlaying,variant:"outlined",iconName:"performance",title:fe(me.performancePanel),jslogContext:"measure-performance"}}
              >
                ${fe(me.performancePanel)}
              </devtools-button>
              <div class="separator"></div>
              ${function(t){return t.replayState.isPlaying?ve`
        <devtools-button .jslogContext=${"abort-replay"} @click=${t.onAbortReplay} .iconName=${"pause"} .variant=${"outlined"}>
          ${fe(me.cancelReplay)}
        </devtools-button>`:t.recorderSettings?ve`<devtools-replay-section
        .data=${{settings:t.recorderSettings,replayExtensions:t.replayExtensions}}
        .disabled=${t.replayState.isPlaying}
        @startreplay=${t.onTogglePlaying}
        >
      </devtools-replay-section>`:e.nothing}(t)}
            </div>`:e.nothing}
    </div>`}const Se=(i,a,l)=>{const c={wrapper:!0,"is-recording":i.isRecording,"is-playing":i.replayState.isPlaying,"was-successful":"Success"===i.lastReplayResult,"was-failure":"Failure"===i.lastReplayResult},u=i.recordingTogglingInProgress?fe(me.recordingIsBeingStopped):fe(me.endRecording);e.render(ve`
    <style>${s.inspectorCommonStyles}</style>
    <style>${ge}</style>
    <style>${o.textInputStyles}</style>
    <div @click=${i.onWrapperClick} class=${e.Directives.classMap(c)}>
      <div class="recording-view main">
        ${xe(i)}
        ${i.extensionDescriptor?ve`
            <devtools-recorder-extension-view .descriptor=${i.extensionDescriptor}></devtools-recorder-extension-view>`:ve`
          ${function({settings:i,replaySettingsExpanded:o,onSelectMenuLabelClick:s,onNetworkConditionsChange:a,onTimeoutInput:l,isRecording:c,replayState:u,onReplaySettingsKeydown:h,onToggleReplaySettings:g}){if(!i)return e.nothing;const v=[];i.viewportSettings&&(v.push(ve`<div>${i.viewportSettings.isMobile?fe(me.mobile):fe(me.desktop)}</div>`),v.push(ve`<div class="separator"></div>`),v.push(ve`<div>${i.viewportSettings.width}×${i.viewportSettings.height} px</div>`));const m=[];if(o){const e=i.networkConditionsSettings?.i18nTitleKey||p.NetworkManager.NoThrottlingConditions.i18nTitleKey,t=ye.find(t=>t.i18nTitleKey===e);let o="";t&&(o=t.title instanceof Function?t.title():t.title),m.push(ve`<div class="editable-setting">
      <label class="wrapping-label" @click=${s}>
        ${fe(me.network)}
        <select
            title=${o}
            jslog=${r.dropDown("network-conditions").track({change:!0})}
            @change=${a}>
      ${ye.map(t=>ve`
        <option jslog=${r.item(d.StringUtilities.toKebabCase(t.i18nTitleKey||""))}
                value=${t.i18nTitleKey||""} ?selected=${e===t.i18nTitleKey}>
                ${t.title instanceof Function?t.title():t.title}
        </option>`)}
    </select>
      </label>
    </div>`),m.push(ve`<div class="editable-setting">
      <label class="wrapping-label" title=${fe(me.timeoutExplanation)}>
        ${fe(me.timeoutLabel)}
        <input
          @input=${l}
          required
          min=${n.SchemaUtils.minTimeout}
          max=${n.SchemaUtils.maxTimeout}
          value=${i.timeout||n.RecordingPlayer.defaultTimeout}
          jslog=${r.textField("timeout").track({change:!0})}
          class="devtools-text-input"
          type="number">
      </label>
    </div>`)}else i.networkConditionsSettings?i.networkConditionsSettings.title?m.push(ve`<div>${i.networkConditionsSettings.title}</div>`):m.push(ve`<div>
          ${fe(me.download,{value:t.ByteUtilities.bytesToString(i.networkConditionsSettings.download)})},
          ${fe(me.upload,{value:t.ByteUtilities.bytesToString(i.networkConditionsSettings.upload)})},
          ${fe(me.latency,{value:i.networkConditionsSettings.latency})}
        </div>`):m.push(ve`<div>${p.NetworkManager.NoThrottlingConditions.title instanceof Function?p.NetworkManager.NoThrottlingConditions.title():p.NetworkManager.NoThrottlingConditions.title}</div>`),m.push(ve`<div class="separator"></div>`),m.push(ve`<div>${fe(me.timeout,{value:i.timeout||n.RecordingPlayer.defaultTimeout})}</div>`);const b=!c&&!u.isPlaying,f={"settings-title":!0,expanded:o},y={expanded:o,settings:!0};return ve`
    <div class="settings-row">
      <div class="settings-container">
        <div
          class=${e.Directives.classMap(f)}
          @keydown=${b&&h}
          @click=${b&&g}
          tabindex="0"
          role="button"
          jslog=${r.action("replay-settings").track({click:!0})}
          aria-label=${fe(me.editReplaySettings)}>
          <span>${fe(me.replaySettings)}</span>
          ${b?ve`<devtools-icon
                  class="chevron"
                  name="triangle-down">
                </devtools-icon>`:""}
        </div>
        <div class=${e.Directives.classMap(y)}>
          ${m.length?m:ve`<div>${fe(me.default)}</div>`}
        </div>
      </div>
      <div class="settings-container">
        <div class="settings-title">${fe(me.environment)}</div>
        <div class="settings">
          ${v.length?v:ve`<div>${fe(me.default)}</div>`}
        </div>
      </div>
    </div>
  `}(i)}
          ${we(i,a)}
        `}
        ${i.isRecording?ve`<div class="footer">
          <div class="controls">
            <devtools-control-button
              jslog=${r.toggle("toggle-recording").track({click:!0})}
              @click=${i.onRecordingFinished}
              .disabled=${i.recordingTogglingInProgress}
              .shape=${"square"}
              .label=${u}
              title=${n.Tooltip.getTooltipForActions(u,"chrome-recorder.start-recording")}
            >
            </devtools-control-button>
          </div>
        </div>`:e.nothing}
      </div>
    </div>
  `,l)};class $e extends s.Widget.Widget{replayState={isPlaying:!1,isPausedOnBreakpoint:!1};isRecording=!1;recordingTogglingInProgress=!1;recording={title:"",steps:[]};currentStep;currentError;sections=[];settings;lastReplayResult;replayAllowed=!1;breakpointIndexes=new Set;extensionConverters=[];replayExtensions;extensionDescriptor;addAssertion;abortReplay;recordingFinished;playRecording;networkConditionsChanged;timeoutChanged;titleChanged;#a;get recorderSettings(){return this.#a}set recorderSettings(e){this.#a=e,this.#k=this.recorderSettings?.preferredCopyFormat??this.#C[0]?.getId(),this.#E()}#C=[];get builtInConverters(){return this.#C}set builtInConverters(e){this.#C=e,this.#k=this.recorderSettings?.preferredCopyFormat??this.#C[0]?.getId(),this.#E()}#R=!1;#T;#I=!1;#N=!1;#A="";#k="";#j;#M;#L=this.#P.bind(this);#r;#B={};constructor(e,t){super(e,{useShadowDom:!0}),this.#r=t||Se}performUpdate(){const e=[...this.builtInConverters||[],...this.extensionConverters||[]].find(e=>e.getId()===this.#k)??this.builtInConverters[0];this.#r({breakpointIndexes:this.breakpointIndexes,builtInConverters:this.builtInConverters,converterId:this.#k,converterName:e?.getFormatName(),currentError:this.currentError??null,currentStep:this.currentStep??null,editorState:this.#M??null,extensionConverters:this.extensionConverters,extensionDescriptor:this.extensionDescriptor,isRecording:this.isRecording,isTitleInvalid:this.#R,lastReplayResult:this.lastReplayResult??null,recorderSettings:this.#a??null,recording:this.recording,recordingTogglingInProgress:this.recordingTogglingInProgress,replayAllowed:this.replayAllowed,replayExtensions:this.replayExtensions??[],replaySettingsExpanded:this.#I,replayState:this.replayState,sections:this.sections,selectedStep:this.#T??null,settings:this.settings??null,showCodeView:this.#N,onAddAssertion:()=>{this.addAssertion?.()},onRecordingFinished:()=>{this.recordingFinished?.()},getSectionState:this.#O.bind(this),getStepState:this.#D.bind(this),onAbortReplay:()=>{this.abortReplay?.()},onMeasurePerformanceClick:this.#F.bind(this),onTogglePlaying:e=>{this.playRecording?.({targetPanel:"chrome-recorder",speed:e.speed,extension:e.extension})},onCodeFormatChange:this.#z.bind(this),onCopyStep:this.#V.bind(this),onEditTitleButtonClick:this.#U.bind(this),onNetworkConditionsChange:this.#_.bind(this),onReplaySettingsKeydown:this.#K.bind(this),onSelectMenuLabelClick:this.#q.bind(this),onStepClick:this.#G.bind(this),onStepHover:this.#W.bind(this),onTimeoutInput:this.#H.bind(this),onTitleBlur:this.#X.bind(this),onTitleInputKeyDown:this.#Y.bind(this),onToggleReplaySettings:this.#J.bind(this),onWrapperClick:this.#Z.bind(this),showCodeToggle:this.showCodeToggle.bind(this)},this.#B,this.contentElement)}wasShown(){super.wasShown(),document.addEventListener("copy",this.#L),this.performUpdate()}willHide(){super.willHide(),document.removeEventListener("copy",this.#L)}scrollToBottom(){const e=this.contentElement?.querySelector(".sections");e&&(e.scrollTop=e.scrollHeight)}#D(e){if(!this.currentStep)return"default";if(e===this.currentStep)return this.currentError?"error":this.replayState?.isPlaying?this.replayState?.isPausedOnBreakpoint?"stopped":"current":"success";const t=this.recording.steps.indexOf(this.currentStep);if(-1===t)return"default";return this.recording.steps.indexOf(e)<t?"success":"outstanding"}#O(e){const t=this.currentStep;if(!t)return"default";const i=this.sections.find(e=>e.steps.includes(t));if(!i&&this.currentError)return"error";if(e===i)return"success";return this.sections.indexOf(i)>=this.sections.indexOf(e)?"success":"outstanding"}#W=e=>{const t=e.target,i=t.step||t.section?.causingStep;i&&!this.#T&&this.#Q(i)};#G(e){e.stopPropagation();const t=e.target,i=t.step||t.section?.causingStep||null;this.#T!==i&&(this.#T=i,this.performUpdate(),i&&this.#Q(i,!0))}#Z(){void 0!==this.#T&&(this.#T=void 0,this.performUpdate())}#K(e){"Enter"===e.key&&(e.preventDefault(),this.#J(e))}#J(e){e.stopPropagation(),this.#I=!this.#I,this.performUpdate()}#_(e){const t=e.target;if(t instanceof HTMLSelectElement){const e=ye.find(e=>e.i18nTitleKey===t.value);this.networkConditionsChanged?.(e?.i18nTitleKey===p.NetworkManager.NoThrottlingConditions.i18nTitleKey?void 0:e)}}#H(e){const t=e.target;t.checkValidity()?this.timeoutChanged?.(Number(t.value)):t.reportValidity()}#X=e=>{const t=e.target.value.trim();if(!t)return this.#R=!0,void this.performUpdate();this.titleChanged?.(t)};#Y=e=>{switch(e.code){case"Escape":case"Enter":e.target.blur(),e.stopPropagation()}};#U=()=>{const e=this.contentElement.querySelector("#title-input");if(!e)throw new Error("Missing #title-input");e.focus()};#q=e=>{const t=e.target;t.matches(".wrapping-label")&&t.querySelector("devtools-select-menu")?.click()};async#ee(e){let t=[...this.builtInConverters,...this.extensionConverters].find(e=>e.getId()===this.recorderSettings?.preferredCopyFormat);if(t||(t=this.builtInConverters[0]),!t)throw new Error("No default converter found");let i="";e?i=await t.stringifyStep(e):this.recording&&([i]=await t.stringify(this.recording)),l.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(i);const o=e?function(e){switch(e){case"puppeteer":case"puppeteer-firefox":return 5;case"json":return 6;case"@puppeteer/replay":return 7;default:return 8}}(t.getId()):function(e){switch(e){case"puppeteer":case"puppeteer-firefox":return 1;case"json":return 2;case"@puppeteer/replay":return 3;default:return 4}}(t.getId());l.userMetrics.recordingCopiedToClipboard(o)}#V(e){e.stopPropagation(),this.#ee(e.step)}async#P(e){e.target===document.body&&(e.preventDefault(),await this.#ee(this.#T),l.userMetrics.keyboardShortcutFired("chrome-recorder.copy-recording-or-step"))}#F(e){e.stopPropagation(),this.playRecording?.({targetPanel:"timeline",speed:"normal"})}showCodeToggle=()=>{this.#N=!this.#N,l.userMetrics.recordingCodeToggled(this.#N?1:2),this.#E()};#E=async()=>{if(!this.recording)return;const e=[...this.builtInConverters||[],...this.extensionConverters||[]].find(e=>e.getId()===this.#k)??this.builtInConverters[0];if(!e)return;const[t,i]=await e.stringify(this.recording);this.#A=t,this.#j=i,this.#j?.shift();const o=e.getMediaType(),s=o?await h.CodeHighlighter.languageFromMIME(o):null;this.#M=u.EditorState.create({doc:this.#A,extensions:[g.Config.baseConfiguration(this.#A),u.EditorState.readOnly.of(!0),u.EditorView.lineWrapping,s||[]]}),this.performUpdate(),this.contentElement.dispatchEvent(new Event("code-generated"))};#Q=(e,t=!1)=>{if(!this.#j)return;const i=this.recording.steps.indexOf(e);if(-1===i)return;const o=this.#j[2*i],s=this.#j[2*i+1];this.#B.highlightLinesInEditor?.(o,s,t)};#z=e=>{this.#k=e.itemValue,this.recorderSettings&&(this.recorderSettings.preferredCopyFormat=e.itemValue),this.#E()}}var ke=Object.freeze({__proto__:null,DEFAULT_VIEW:Se,RecordingView:$e}),Ce=`.select-button{display:flex;gap:var(--sys-size-6)}.groups-label{display:inline-block;padding:0 var(--sys-size-4) var(--sys-size-4) 0}.select-button devtools-button{position:relative}\n/*# sourceURL=${import.meta.resolve("./selectButton.css")} */`;const{html:Ee,Directives:{ifDefined:Re,classMap:Te}}=e;class Ie extends Event{value;static eventName="selectbuttonclick";constructor(e){super(Ie.eventName,{bubbles:!0,composed:!0}),this.value=e}}class Ne extends Event{value;static eventName="selectmenuselected";constructor(e){super(Ne.eventName,{bubbles:!0,composed:!0}),this.value=e}}class Ae extends HTMLElement{#v=this.attachShadow({mode:"open"});#y={disabled:!1,value:"",items:[],buttonLabel:"",groups:[],variant:"primary"};connectedCallback(){c.ScheduledRender.scheduleRender(this,this.#b)}get disabled(){return this.#y.disabled}set disabled(e){this.#y.disabled=e,c.ScheduledRender.scheduleRender(this,this.#b)}get items(){return this.#y.items}set items(e){this.#y.items=e,c.ScheduledRender.scheduleRender(this,this.#b)}set buttonLabel(e){this.#y.buttonLabel=e}set groups(e){this.#y.groups=e,c.ScheduledRender.scheduleRender(this,this.#b)}get value(){return this.#y.value}set value(e){this.#y.value=e,c.ScheduledRender.scheduleRender(this,this.#b)}get variant(){return this.#y.variant}set variant(e){this.#y.variant=e,c.ScheduledRender.scheduleRender(this,this.#b)}set action(e){this.#y.action=e,c.ScheduledRender.scheduleRender(this,this.#b)}#te(e){e.stopPropagation(),this.dispatchEvent(new Ie(this.#y.value))}#ie(e){e.target instanceof HTMLSelectElement&&(this.dispatchEvent(new Ne(e.target.value)),c.ScheduledRender.scheduleRender(this,this.#b))}#oe(e,t){const i=e.value===t.value;return Ee`
      <option
      .title=${e.label()}
      value=${e.value}
      ?selected=${i}
      jslog=${r.item(d.StringUtilities.toKebabCase(e.value)).track({click:!0})}
      >${i&&e.buttonLabel?e.buttonLabel():e.label()}</option>
    `}#se(e,t){return Ee`
      <optgroup label=${e.name}>
        ${e.items.map(e=>this.#oe(e,t))}
      </optgroup>
    `}#re(e){return this.#y.action?n.Tooltip.getTooltipForActions(e,this.#y.action):""}#b=()=>{const t=Boolean(this.#y.groups.length),i=t?this.#y.groups.flatMap(e=>e.items):this.#y.items,o=i.find(e=>e.value===this.#y.value)||i[0];if(!o)return;const n={primary:"primary"===this.#y.variant,secondary:"outlined"===this.#y.variant},a="outlined"===this.#y.variant?"outlined":"primary",l=o.buttonLabel?o.buttonLabel():o.label();e.render(Ee` <style>
          ${s.inspectorCommonStyles}
        </style>
        <style>
          ${Ce}
        </style>
        <div
          class="select-button"
          title=${Re(this.#re(l))}
        >
          <label>
            ${this.#y.groups.length>1?Ee`
                  <div
                    class="groups-label"
                    >${this.#y.groups.map(e=>e.name).join(" & ")}</div>`:e.nothing}
            <select
              class=${Te(n)}
              ?disabled=${this.#y.disabled}
              jslog=${r.dropDown("network-conditions").track({change:!0})}
              @change=${this.#ie}
            >
              ${t?this.#y.groups.map(e=>this.#se(e,o)):this.#y.items.map(e=>this.#oe(e,o))}
            </select>
          </label>
          ${o?Ee` <devtools-button
                .disabled=${this.#y.disabled}
                .variant=${a}
                .iconName=${o.buttonIconName}
                @click=${this.#te}
              >
                ${this.#y.buttonLabel}
              </devtools-button>`:""}
        </div>`,this.#v,{host:this})}}customElements.define("devtools-select-button",Ae);var je=Object.freeze({__proto__:null,SelectButton:Ae,SelectButtonClickEvent:Ie,SelectMenuSelectedEvent:Ne}),Me=`*{box-sizing:border-box;padding:0;margin:0;font-size:inherit}:host{display:block}.row{display:flex;flex-direction:row;color:var(--sys-color-token-property-special);font-family:var(--monospace-font-family);font-size:var(--monospace-font-size);align-items:center;line-height:18px;margin-top:3px}.row devtools-button{line-height:1;margin-left:0.5em}.separator{margin-right:0.5em;color:var(--sys-color-on-surface)}.padded{margin-left:2em}.padded.double{margin-left:4em}.selector-picker{width:18px;height:18px}.inline-button{width:18px;height:18px;opacity:0%;visibility:hidden;transition:opacity 200ms;flex-shrink:0}.row:focus-within .inline-button,\n.row:hover .inline-button{opacity:100%;visibility:visible}.wrapped.row{flex-wrap:wrap}.gap.row{gap:5px}.gap.row devtools-button{margin-left:0}.regular-font{font-family:inherit;font-size:inherit}.no-margin{margin:0}.row-buttons{margin-top:3px}.error{margin:3px 0 6px;padding:8px 12px;background:var(--sys-color-error-container);color:var(--sys-color-error)}\n/*# sourceURL=${import.meta.resolve("./stepEditor.css")} */`;function Le(e,t="Assertion failed!"){if(!e)throw new Error(t)}const Pe=e=>{for(const t of Reflect.ownKeys(e)){const i=e[t];(i&&"object"==typeof i||"function"==typeof i)&&Pe(i)}return Object.freeze(e)};class Be{value;constructor(e){this.value=e}}class Oe{value;constructor(e){this.value=e}}const De=(e,t)=>{if(t instanceof Oe){Le(Array.isArray(e),`Expected an array. Got ${typeof e}.`);const i=[...e],o=Object.keys(t.value).sort((e,t)=>Number(t)-Number(e));for(const e of o){const o=t.value[Number(e)];void 0===o?i.splice(Number(e),1):o instanceof Be?i.splice(Number(e),0,o.value):i[Number(e)]=De(i[e],o)}return Object.freeze(i)}if("object"==typeof t&&!Array.isArray(t)){Le(!Array.isArray(e),"Expected an object. Got an array.");const i={...e},o=Object.keys(t);for(const e of o){const o=t[e];void 0===o?delete i[e]:i[e]=De(i[e],o)}return Object.freeze(i)}return t};var Fe=self&&self.__decorate||function(e,t,i,o){var s,r=arguments.length,n=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(r<3?s(n):r>3?s(t,i,n):s(t,i))||n);return r>3&&n&&Object.defineProperty(t,i,n),n};const{html:ze,Decorators:Ve,Directives:Ue,LitElement:_e}=e,{customElement:Ke,property:qe,state:Ge}=Ve,{live:We}=Ue,He=Object.freeze({string:e=>e.trim(),number:e=>{const t=parseFloat(e);return Number.isNaN(t)?0:t},boolean:e=>"true"===e.toLowerCase()}),Xe=Object.freeze({selectors:"string",offsetX:"number",offsetY:"number",target:"string",frame:"number",assertedEvents:"string",value:"string",key:"string",operator:"string",count:"number",expression:"string",x:"number",y:"number",url:"string",type:"string",timeout:"number",duration:"number",button:"string",deviceType:"string",width:"number",height:"number",deviceScaleFactor:"number",isMobile:"boolean",hasTouch:"boolean",isLandscape:"boolean",download:"number",upload:"number",latency:"number",name:"string",parameters:"string",visible:"boolean",properties:"string",attributes:"string"}),Ye=Pe({selectors:[[".cls"]],offsetX:1,offsetY:1,target:"main",frame:[0],assertedEvents:[{type:"navigation",url:"https://example.com",title:"Title"}],value:"Value",key:"Enter",operator:">=",count:1,expression:"true",x:0,y:0,url:"https://example.com",timeout:5e3,duration:50,deviceType:"mouse",button:"primary",type:"click",width:800,height:600,deviceScaleFactor:1,isMobile:!1,hasTouch:!1,isLandscape:!0,download:1e3,upload:1e3,latency:25,name:"customParam",parameters:"{}",properties:"{}",attributes:[{name:"attribute",value:"value"}],visible:!0}),Je=Pe({[n.Schema.StepType.Click]:{required:["selectors","offsetX","offsetY"],optional:["assertedEvents","button","deviceType","duration","frame","target","timeout"]},[n.Schema.StepType.DoubleClick]:{required:["offsetX","offsetY","selectors"],optional:["assertedEvents","button","deviceType","frame","target","timeout"]},[n.Schema.StepType.Hover]:{required:["selectors"],optional:["assertedEvents","frame","target","timeout"]},[n.Schema.StepType.Change]:{required:["selectors","value"],optional:["assertedEvents","frame","target","timeout"]},[n.Schema.StepType.KeyDown]:{required:["key"],optional:["assertedEvents","target","timeout"]},[n.Schema.StepType.KeyUp]:{required:["key"],optional:["assertedEvents","target","timeout"]},[n.Schema.StepType.Scroll]:{required:[],optional:["assertedEvents","frame","target","timeout","x","y"]},[n.Schema.StepType.Close]:{required:[],optional:["assertedEvents","target","timeout"]},[n.Schema.StepType.Navigate]:{required:["url"],optional:["assertedEvents","target","timeout"]},[n.Schema.StepType.WaitForElement]:{required:["selectors"],optional:["assertedEvents","attributes","count","frame","operator","properties","target","timeout","visible"]},[n.Schema.StepType.WaitForExpression]:{required:["expression"],optional:["assertedEvents","frame","target","timeout"]},[n.Schema.StepType.CustomStep]:{required:["name","parameters"],optional:["assertedEvents","target","timeout"]},[n.Schema.StepType.EmulateNetworkConditions]:{required:["download","latency","upload"],optional:["assertedEvents","target","timeout"]},[n.Schema.StepType.SetViewport]:{required:["deviceScaleFactor","hasTouch","height","isLandscape","isMobile","width"],optional:["assertedEvents","target","timeout"]}}),Ze={notSaved:"Not saved: {error}",addAttribute:"Add {attributeName}",deleteRow:"Delete row",selectorPicker:"Select an element in the page to update selectors",addFrameIndex:"Add frame index within the frame tree",removeFrameIndex:"Remove frame index",addSelectorPart:"Add a selector part",removeSelectorPart:"Remove a selector part",addSelector:"Add a selector",removeSelector:"Remove a selector",unknownActionType:"Unknown action type."},Qe=t.i18n.registerUIStrings("panels/recorder/components/StepEditor.ts",Ze),et=t.i18n.getLocalizedString.bind(void 0,Qe);class tt extends Event{static eventName="stepedited";data;constructor(e){super(tt.eventName,{bubbles:!0,composed:!0}),this.data=e}}class it{static#ne=new f.SharedObject.SharedObject(()=>n.RecordingPlayer.RecordingPlayer.connectPuppeteer(),({browser:e})=>n.RecordingPlayer.RecordingPlayer.disconnectPuppeteer(e));static async default(e){const t={type:e},i=Je[t.type];let o=Promise.resolve();for(const e of i.required)o=Promise.all([o,(async()=>Object.assign(t,{[e]:await this.defaultByAttribute(t,e)}))()]);return await o,Object.freeze(t)}static async defaultByAttribute(e,t){return await this.#ne.run(e=>{switch(t){case"assertedEvents":return De(Ye.assertedEvents,new Oe({0:{url:e.page.url()||Ye.assertedEvents[0].url}}));case"url":return e.page.url()||Ye.url;case"height":return e.page.evaluate(()=>visualViewport.height)||Ye.height;case"width":return e.page.evaluate(()=>visualViewport.width)||Ye.width;default:return Ye[t]}})}static fromStep(e){const t=structuredClone(e);for(const i of["parameters","properties"])i in e&&void 0!==e[i]&&(t[i]=JSON.stringify(e[i]));if("attributes"in e&&e.attributes){t.attributes=[];for(const[i,o]of Object.entries(e.attributes))t.attributes.push({name:i,value:o})}return"selectors"in e&&(t.selectors=e.selectors.map(e=>"string"==typeof e?[e]:[...e])),Pe(t)}static toStep(e){const t=structuredClone(e);for(const i of["parameters","properties"]){const o=e[i];o&&Object.assign(t,{[i]:JSON.parse(o)})}if(e.attributes)if(0!==e.attributes.length){const i={};for(const{name:t,value:o}of e.attributes)Object.assign(i,{[t]:o});Object.assign(t,{attributes:i})}else"attributes"in t&&delete t.attributes;if(e.selectors){const i=e.selectors.filter(e=>e.length>0).map(e=>1===e.length?e[0]:[...e]);0!==i.length?Object.assign(t,{selectors:i}):"selectors"in t&&delete t.selectors}return e.frame&&0===e.frame.length&&"frame"in t&&delete t.frame,i=n.SchemaUtils.parseStep(t),JSON.parse(JSON.stringify(i));var i}}let ot=class extends _e{#ae=new b.SelectorPicker.SelectorPicker(this);constructor(){super(),this.disabled=!1}#e=e=>{e.preventDefault(),e.stopPropagation(),this.#ae.toggle()};disconnectedCallback(){super.disconnectedCallback(),this.#ae.stop()}render(){if(!this.disabled)return ze`<style>${Me}</style><devtools-button
      @click=${this.#e}
      .title=${et(Ze.selectorPicker)}
      class="selector-picker"
      .size=${"SMALL"}
      .iconName=${"select-element"}
      .active=${this.#ae.active}
      .variant=${"icon"}
      jslog=${r.toggle("selector-picker").track({click:!0})}
    ></devtools-button>`}};Fe([qe({type:Boolean})],ot.prototype,"disabled",void 0),ot=Fe([Ke("devtools-recorder-selector-picker-button")],ot);let st=class extends _e{#le=new Set;constructor(){super(),this.state={type:n.Schema.StepType.WaitForElement},this.isTypeEditable=!0,this.disabled=!1}createRenderRoot(){const e=super.createRenderRoot();return e.addEventListener("keydown",this.#ce),e}set step(e){this.state=Pe(it.fromStep(e)),this.error=void 0}#de(e){try{this.dispatchEvent(new tt(it.toStep(e))),this.state=e}catch(e){this.error=e.message}}#pe=e=>{e.preventDefault(),e.stopPropagation(),this.#de(De(this.state,{target:e.data.target,frame:e.data.frame,selectors:e.data.selectors.map(e=>"string"==typeof e?[e]:e),offsetX:e.data.offsetX,offsetY:e.data.offsetY}))};#ue=(e,t,i)=>o=>{o.preventDefault(),o.stopPropagation(),this.#de(De(this.state,e)),this.#he(t),i&&l.userMetrics.recordingEdited(i)};#ce=e=>{if(Le(e instanceof KeyboardEvent),e.target instanceof m.SuggestionInput.SuggestionInput&&"Enter"===e.key){e.preventDefault(),e.stopPropagation();const t=this.renderRoot.querySelectorAll("devtools-suggestion-input"),i=[...t].findIndex(t=>t===e.target);i>=0&&i+1<t.length?t[i+1].focus():e.target.blur()}};#ge=e=>t=>{if(Le(t.target instanceof m.SuggestionInput.SuggestionInput),t.target.disabled)return;const i=Xe[e.attribute],o=He[i](t.target.value),s=e.from.bind(this)(o);s&&(this.#de(De(this.state,s)),e.metric&&l.userMetrics.recordingEdited(e.metric))};#ve=async e=>{if(Le(e.target instanceof m.SuggestionInput.SuggestionInput),e.target.disabled)return;const t=e.target.value;t!==this.state.type&&(Object.values(n.Schema.StepType).includes(t)?(this.#de(await it.default(t)),l.userMetrics.recordingEdited(9)):this.error=et(Ze.unknownActionType))};#me=async e=>{e.preventDefault(),e.stopPropagation();const t=e.target.dataset.attribute;this.#de(De(this.state,{[t]:await it.defaultByAttribute(this.state,t)})),this.#he(`[data-attribute=${t}].attribute devtools-suggestion-input`)};#be(e){if(!this.disabled)return ze`
      <devtools-button
        title=${e.title}
        .size=${"SMALL"}
        .iconName=${e.iconName}
        .variant=${"icon"}
        jslog=${r.action(e.class).track({click:!0})}
        class="inline-button ${e.class}"
        @click=${e.onClick}
      ></devtools-button>
    `}#fe(e){if(this.disabled)return;return[...Je[this.state.type].optional].includes(e)&&!this.disabled?ze`<devtools-button
      .size=${"SMALL"}
      .iconName=${"bin"}
      .variant=${"icon"}
      .title=${et(Ze.deleteRow)}
      class="inline-button delete-row"
      data-attribute=${e}
      jslog=${r.action("delete").track({click:!0})}
      @click=${t=>{t.preventDefault(),t.stopPropagation(),this.#de(De(this.state,{[e]:void 0}))}}
    ></devtools-button>`:void 0}#ye(e){return this.#le.add("type"),ze`<div class="row attribute" data-attribute="type" jslog=${r.treeItem("type")}>
      <div>type<span class="separator">:</span></div>
      <devtools-suggestion-input
        .disabled=${!e||this.disabled}
        .options=${Object.values(n.Schema.StepType)}
        .placeholder=${Ye.type}
        .value=${We(this.state.type)}
        @blur=${this.#ve}
      ></devtools-suggestion-input>
    </div>`}#we(e){this.#le.add(e);const t=this.state[e]?.toString();if(void 0!==t)return ze`<div class="row attribute" data-attribute=${e} jslog=${r.treeItem(d.StringUtilities.toKebabCase(e))}>
      <div>${e}<span class="separator">:</span></div>
      <devtools-suggestion-input
        .disabled=${this.disabled}
        .placeholder=${Ye[e].toString()}
        .value=${We(t)}
        .mimeType=${(()=>{switch(e){case"expression":return"text/javascript";case"properties":return"application/json";default:return""}})()}
        @blur=${this.#ge({attribute:e,from(t){if(void 0!==this.state[e]){if("properties"===e)l.userMetrics.recordingAssertion(2);return{[e]:t}}},metric:10})}
      ></devtools-suggestion-input>
      ${this.#fe(e)}
    </div>`}#xe(){if(this.#le.add("frame"),void 0!==this.state.frame)return ze`
      <div class="attribute" data-attribute="frame" jslog=${r.treeItem("frame")}>
        <div class="row">
          <div>frame<span class="separator">:</span></div>
          ${this.#fe("frame")}
        </div>
        ${this.state.frame.map((e,t,i)=>ze`
            <div class="padded row">
              <devtools-suggestion-input
                .disabled=${this.disabled}
                .placeholder=${Ye.frame[0].toString()}
                .value=${We(e.toString())}
                data-path=${`frame.${t}`}
                @blur=${this.#ge({attribute:"frame",from(e){if(void 0!==this.state.frame?.[t])return{frame:new Oe({[t]:e})}},metric:10})}
              ></devtools-suggestion-input>
              ${this.#be({class:"add-frame",title:et(Ze.addFrameIndex),iconName:"plus",onClick:this.#ue({frame:new Oe({[t+1]:new Be(Ye.frame[0])})},`devtools-suggestion-input[data-path="frame.${t+1}"]`,10)})}
              ${this.#be({class:"remove-frame",title:et(Ze.removeFrameIndex),iconName:"minus",onClick:this.#ue({frame:new Oe({[t]:void 0})},`devtools-suggestion-input[data-path="frame.${Math.min(t,i.length-2)}"]`,10)})}
            </div>
          `)}
      </div>
    `}#Se(){if(this.#le.add("selectors"),void 0!==this.state.selectors)return ze`<div class="attribute" data-attribute="selectors" jslog=${r.treeItem("selectors")}>
      <div class="row">
        <div>selectors<span class="separator">:</span></div>
        <devtools-recorder-selector-picker-button
          @selectorpicked=${this.#pe}
          .disabled=${this.disabled}
        ></devtools-recorder-selector-picker-button>
        ${this.#fe("selectors")}
      </div>
      ${this.state.selectors.map((e,t,i)=>ze`<div class="padded row" data-selector-path=${t}>
            <div>selector #${t+1}<span class="separator">:</span></div>
            ${this.#be({class:"add-selector",title:et(Ze.addSelector),iconName:"plus",onClick:this.#ue({selectors:new Oe({[t+1]:new Be(structuredClone(Ye.selectors[0]))})},`devtools-suggestion-input[data-path="selectors.${t+1}.0"]`,4)})}
            ${this.#be({class:"remove-selector",title:et(Ze.removeSelector),iconName:"minus",onClick:this.#ue({selectors:new Oe({[t]:void 0})},`devtools-suggestion-input[data-path="selectors.${Math.min(t,i.length-2)}.0"]`,5)})}
          </div>
          ${e.map((e,i,o)=>ze`<div
              class="double padded row"
              data-selector-path="${t}.${i}"
            >
              <devtools-suggestion-input
                .disabled=${this.disabled}
                .placeholder=${Ye.selectors[0][0]}
                .value=${We(e)}
                data-path=${`selectors.${t}.${i}`}
                @blur=${this.#ge({attribute:"selectors",from(e){if(void 0!==this.state.selectors?.[t]?.[i])return{selectors:new Oe({[t]:new Oe({[i]:e})})}},metric:7})}
              ></devtools-suggestion-input>
              ${this.#be({class:"add-selector-part",title:et(Ze.addSelectorPart),iconName:"plus",onClick:this.#ue({selectors:new Oe({[t]:new Oe({[i+1]:new Be(Ye.selectors[0][0])})})},`devtools-suggestion-input[data-path="selectors.${t}.${i+1}"]`,6)})}
              ${this.#be({class:"remove-selector-part",title:et(Ze.removeSelectorPart),iconName:"minus",onClick:this.#ue({selectors:new Oe({[t]:new Oe({[i]:void 0})})},`devtools-suggestion-input[data-path="selectors.${t}.${Math.min(i,o.length-2)}"]`,8)})}
            </div>`)}`)}
    </div>`}#$e(){if(this.#le.add("assertedEvents"),void 0!==this.state.assertedEvents)return ze`<div class="attribute" data-attribute="assertedEvents" jslog=${r.treeItem("asserted-events")}>
      <div class="row">
        <div>asserted events<span class="separator">:</span></div>
        ${this.#fe("assertedEvents")}
      </div>
      ${this.state.assertedEvents.map((e,t)=>ze` <div class="padded row" jslog=${r.treeItem("event-type")}>
            <div>type<span class="separator">:</span></div>
            <div>${e.type}</div>
          </div>
          <div class="padded row" jslog=${r.treeItem("event-title")}>
            <div>title<span class="separator">:</span></div>
            <devtools-suggestion-input
              .disabled=${this.disabled}
              .placeholder=${Ye.assertedEvents[0].title}
              .value=${We(e.title??"")}
              @blur=${this.#ge({attribute:"assertedEvents",from(e){if(void 0!==this.state.assertedEvents?.[t]?.title)return{assertedEvents:new Oe({[t]:{title:e}})}},metric:10})}
            ></devtools-suggestion-input>
          </div>
          <div class="padded row" jslog=${r.treeItem("event-url")}>
            <div>url<span class="separator">:</span></div>
            <devtools-suggestion-input
              .disabled=${this.disabled}
              .placeholder=${Ye.assertedEvents[0].url}
              .value=${We(e.url??"")}
              @blur=${this.#ge({attribute:"url",from(e){if(void 0!==this.state.assertedEvents?.[t]?.url)return{assertedEvents:new Oe({[t]:{url:e}})}},metric:10})}
            ></devtools-suggestion-input>
          </div>`)}
    </div> `}#ke(){if(this.#le.add("attributes"),void 0!==this.state.attributes)return ze`<div class="attribute" data-attribute="attributes" jslog=${r.treeItem("attributes")}>
      <div class="row">
        <div>attributes<span class="separator">:</span></div>
        ${this.#fe("attributes")}
      </div>
      ${this.state.attributes.map(({name:e,value:t},i,o)=>ze`<div class="padded row" jslog=${r.treeItem("attribute")}>
          <devtools-suggestion-input
            .disabled=${this.disabled}
            .placeholder=${Ye.attributes[0].name}
            .value=${We(e)}
            data-path=${`attributes.${i}.name`}
            jslog=${r.key().track({change:!0})}
            @blur=${this.#ge({attribute:"attributes",from(e){if(void 0!==this.state.attributes?.[i]?.name)return l.userMetrics.recordingAssertion(3),{attributes:new Oe({[i]:{name:e}})}},metric:10})}
          ></devtools-suggestion-input>
          <span class="separator">:</span>
          <devtools-suggestion-input
            .disabled=${this.disabled}
            .placeholder=${Ye.attributes[0].value}
            .value=${We(t)}
            data-path=${`attributes.${i}.value`}
            @blur=${this.#ge({attribute:"attributes",from(e){if(void 0!==this.state.attributes?.[i]?.value)return l.userMetrics.recordingAssertion(3),{attributes:new Oe({[i]:{value:e}})}},metric:10})}
          ></devtools-suggestion-input>
          ${this.#be({class:"add-attribute-assertion",title:et(Ze.addSelectorPart),iconName:"plus",onClick:this.#ue({attributes:new Oe({[i+1]:new Be((()=>{{const e=new Set(o.map(({name:e})=>e)),t=Ye.attributes[0];let i=t.name,s=0;for(;e.has(i);)++s,i=`${t.name}-${s}`;return{...t,name:i}}})())})},`devtools-suggestion-input[data-path="attributes.${i+1}.name"]`,10)})}
          ${this.#be({class:"remove-attribute-assertion",title:et(Ze.removeSelectorPart),iconName:"minus",onClick:this.#ue({attributes:new Oe({[i]:void 0})},`devtools-suggestion-input[data-path="attributes.${Math.min(i,o.length-2)}.value"]`,10)})}
        </div>`)}
    </div>`}#Ce(){return[...Je[this.state.type].optional].filter(e=>void 0===this.state[e]).map(e=>ze`<devtools-button
          .variant=${"outlined"}
          class="add-row"
          data-attribute=${e}
          jslog=${r.action(`add-${d.StringUtilities.toKebabCase(e)}`)}
          @click=${this.#me}
        >
          ${et(Ze.addAttribute,{attributeName:e})}
        </devtools-button>`)}#he=e=>{this.updateComplete.then(()=>{const t=this.renderRoot.querySelector(e);t?.focus()})};render(){this.#le=new Set;const e=ze`
      <style>${Me}</style>
      <div class="wrapper" jslog=${r.tree("step-editor")} >
        ${this.#ye(this.isTypeEditable)} ${this.#we("target")}
        ${this.#xe()} ${this.#Se()}
        ${this.#we("deviceType")} ${this.#we("button")}
        ${this.#we("url")} ${this.#we("x")}
        ${this.#we("y")} ${this.#we("offsetX")}
        ${this.#we("offsetY")} ${this.#we("value")}
        ${this.#we("key")} ${this.#we("operator")}
        ${this.#we("count")} ${this.#we("expression")}
        ${this.#we("duration")} ${this.#$e()}
        ${this.#we("timeout")} ${this.#we("width")}
        ${this.#we("height")} ${this.#we("deviceScaleFactor")}
        ${this.#we("isMobile")} ${this.#we("hasTouch")}
        ${this.#we("isLandscape")} ${this.#we("download")}
        ${this.#we("upload")} ${this.#we("latency")}
        ${this.#we("name")} ${this.#we("parameters")}
        ${this.#we("visible")} ${this.#we("properties")}
        ${this.#ke()}
        ${this.error?ze`
              <div class="error">
                ${et(Ze.notSaved,{error:this.error})}
              </div>
            `:void 0}
        ${this.disabled?void 0:ze`<div
              class="row-buttons wrapped gap row regular-font no-margin"
            >
              ${this.#Ce()}
            </div>`}
      </div>
    `;for(const e of Object.keys(Xe))if(!this.#le.has(e))throw new Error(`The editable attribute ${e} does not have UI`);return e}};Fe([Ge()],st.prototype,"state",void 0),Fe([Ge()],st.prototype,"error",void 0),Fe([qe({type:Boolean})],st.prototype,"isTypeEditable",void 0),Fe([qe({type:Boolean})],st.prototype,"disabled",void 0),st=Fe([Ke("devtools-recorder-step-editor")],st);var rt=Object.freeze({__proto__:null,EditorState:it,StepEditedEvent:tt,get StepEditor(){return st}}),nt=`*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}.timeline-section{position:relative;padding:16px 0 0 40px;margin-left:8px;--override-color-recording-successful-text:#36a854;--override-color-recording-successful-background:#e6f4ea}.overlay{position:absolute;width:100vw;height:100%;left:calc(-32px - 80px);top:0;z-index:-1;pointer-events:none}@container (max-width: 400px){.overlay{left:-32px}}:hover .overlay{background:var(--sys-color-state-hover-on-subtle)}.is-selected .overlay{background:var(--sys-color-tonal-container)}:host-context(.is-stopped) .overlay{background:var(--sys-color-state-ripple-primary);outline:1px solid var(--sys-color-state-focus-ring);z-index:4}.is-start-of-group{padding-top:28px}.is-end-of-group{padding-bottom:24px}.icon{position:absolute;left:4px;transform:translateX(-50%);z-index:2}.bar{position:absolute;left:4px;display:block;transform:translateX(-50%);top:18px;height:calc(100% + 8px);z-index:1}.bar .background{fill:var(--sys-color-state-hover-on-subtle)}.bar .line{fill:var(--sys-color-primary)}.is-first-section .bar{top:32px;height:calc(100% - 8px);display:none}.is-first-section:not(.is-last-section) .bar{display:block}.is-last-section .bar .line{display:none}.is-last-section .bar .background{display:none}:host-context(.is-error) .bar .line{fill:var(--sys-color-error)}:host-context(.is-error) .bar .background{fill:var(--sys-color-error-container)}:host-context(.was-successful) .bar .background{animation:flash-background 2s}:host-context(.was-successful) .bar .line{animation:flash-line 2s}@keyframes flash-background{25%{fill:var(--override-color-recording-successful-background)}75%{fill:var(--override-color-recording-successful-background)}}@keyframes flash-line{25%{fill:var(--override-color-recording-successful-text)}75%{fill:var(--override-color-recording-successful-text)}}\n/*# sourceURL=${import.meta.resolve("./timelineSection.css")} */`;const{html:at}=e;class lt extends HTMLElement{#Ee=!1;#Re=!1;#Te=!1;#Ie=!1;#Ne=!1;#Ae=this.attachShadow({mode:"open"});set data(e){this.#Te=e.isFirstSection,this.#Ie=e.isLastSection,this.#Ee=e.isEndOfGroup,this.#Re=e.isStartOfGroup,this.#Ne=e.isSelected,this.#b()}connectedCallback(){this.#b()}#b(){const t={"timeline-section":!0,"is-end-of-group":this.#Ee,"is-start-of-group":this.#Re,"is-first-section":this.#Te,"is-last-section":this.#Ie,"is-selected":this.#Ne};e.render(at`
      <style>${nt}</style>
      <div class=${e.Directives.classMap(t)}>
        <div class="overlay"></div>
        <div class="icon"><slot name="icon"></slot></div>
        <svg width="24" height="100%" class="bar">
          <rect class="line" x="7" y="0" width="2" height="100%" />
        </svg>
        <slot></slot>
      </div>
    `,this.#Ae,{host:this})}}customElements.define("devtools-timeline-section",lt);var ct=Object.freeze({__proto__:null,TimelineSection:lt}),dt=`@scope to (devtools-widget > *){*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}.title-container{min-width:0;font-size:13px;line-height:16px;letter-spacing:0.03em;display:flex;flex-direction:row;gap:3px;outline-offset:3px}.action{display:flex;align-items:flex-start}.title{flex:1;min-width:0}.is-start-of-group .title{font-weight:bold}.error-icon{display:none}.breakpoint-icon{visibility:hidden;cursor:pointer;opacity:0%;fill:var(--sys-color-primary);stroke:#1a73e8;transform:translate(-1.92px,-3px)}.circle-icon{fill:var(--sys-color-primary);stroke:var(--sys-color-cdt-base-container);stroke-width:4px;r:5px;cx:8px;cy:8px}.is-start-of-group .circle-icon{r:7px;fill:var(--sys-color-cdt-base-container);stroke:var(--sys-color-primary);stroke-width:2px}.step.is-success .circle-icon{fill:var(--sys-color-primary);stroke:var(--sys-color-primary)}.step.is-current .circle-icon{stroke-dasharray:24 10;animation:rotate 1s linear infinite;fill:var(--sys-color-cdt-base-container);stroke:var(--sys-color-primary);stroke-width:2px}.error{margin:16px 0 0;padding:8px;background:var(--sys-color-error-container);color:var(--sys-color-error);position:relative}@keyframes rotate{0%{transform:translate(8px,8px) rotate(0) translate(-8px,-8px)}100%{transform:translate(8px,8px) rotate(360deg) translate(-8px,-8px)}}.step.is-error .circle-icon{fill:var(--sys-color-error);stroke:var(--sys-color-error)}.step.is-error .error-icon{display:block;transform:translate(4px,4px)}:host-context(.was-successful) .circle-icon{animation:flash-circle 2s}:host-context(.was-successful) .breakpoint-icon{animation:flash-breakpoint-icon 2s}@keyframes flash-circle{25%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}75%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}}@keyframes flash-breakpoint-icon{25%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}75%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}}.chevron{width:14px;height:14px;transition:200ms;position:absolute;top:18px;left:24px;transform:rotate(-90deg);color:var(--sys-color-on-surface)}.expanded .chevron{transform:rotate(0deg)}.is-start-of-group .chevron{top:34px}.details{display:none;margin-top:8px;position:relative}.expanded .details{display:block}.step-details{overflow:auto}devtools-recorder-step-editor{border:1px solid var(--sys-color-neutral-outline);padding:3px 6px 6px;margin-left:-6px;border-radius:3px}devtools-recorder-step-editor:hover{border:1px solid var(--sys-color-neutral-outline)}devtools-recorder-step-editor.is-selected{background-color:color-mix(in srgb,var(--sys-color-tonal-container),var(--sys-color-cdt-base-container) 50%);border:1px solid var(--sys-color-tonal-outline)}.summary{display:flex;flex-flow:row nowrap}.filler{flex-grow:1}.subtitle{font-weight:normal;color:var(--sys-color-on-surface-subtle);word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.main-title{word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.step-actions{border:none;border-radius:0;height:24px;--override-select-menu-show-button-border-radius:0;--override-select-menu-show-button-outline:none;--override-select-menu-show-button-padding:0}.step.has-breakpoint .circle-icon{visibility:hidden}.step:not(.is-start-of-group).has-breakpoint .breakpoint-icon{visibility:visible;opacity:100%}.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .circle-icon{transition:opacity 0.2s;opacity:0%}.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .error-icon{visibility:hidden}.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .breakpoint-icon{transition:opacity 0.2s;visibility:visible;opacity:50%}}\n/*# sourceURL=${import.meta.resolve("./stepView.css")} */`;const{html:pt}=e,ut={setViewportClickTitle:"Set viewport",customStepTitle:"Custom step",clickStepTitle:"Click",doubleClickStepTitle:"Double click",hoverStepTitle:"Hover",emulateNetworkConditionsStepTitle:"Emulate network conditions",changeStepTitle:"Change",closeStepTitle:"Close",scrollStepTitle:"Scroll",keyUpStepTitle:"Key up",navigateStepTitle:"Navigate",keyDownStepTitle:"Key down",waitForElementStepTitle:"Wait for element",waitForExpressionStepTitle:"Wait for expression",elementRoleButton:"Button",elementRoleInput:"Input",elementRoleFallback:"Element",addStepBefore:"Add step before",addStepAfter:"Add step after",removeStep:"Remove step",openStepActions:"Open step actions",addBreakpoint:"Add breakpoint",removeBreakpoint:"Remove breakpoint",copyAs:"Copy as",stepManagement:"Manage steps",breakpoints:"Breakpoints"},ht=t.i18n.registerUIStrings("panels/recorder/components/StepView.ts",ut),gt=t.i18n.getLocalizedString.bind(void 0,ht);class vt extends Event{static eventName="captureselectors";data;constructor(e){super(vt.eventName,{bubbles:!0,composed:!0}),this.data=e}}class mt extends Event{static eventName="stopselectorscapture";constructor(){super(mt.eventName,{bubbles:!0,composed:!0})}}class bt extends Event{static eventName="copystep";step;constructor(e){super(bt.eventName,{bubbles:!0,composed:!0}),this.step=e}}class ft extends Event{static eventName="stepchanged";currentStep;newStep;constructor(e,t){super(ft.eventName,{bubbles:!0,composed:!0}),this.currentStep=e,this.newStep=t}}class yt extends Event{static eventName="addstep";position;stepOrSection;constructor(e,t){super(yt.eventName,{bubbles:!0,composed:!0}),this.stepOrSection=e,this.position=t}}class wt extends Event{static eventName="removestep";step;constructor(e){super(wt.eventName,{bubbles:!0,composed:!0}),this.step=e}}class xt extends Event{static eventName="addbreakpoint";index;constructor(e){super(xt.eventName,{bubbles:!0,composed:!0}),this.index=e}}class St extends Event{static eventName="removebreakpoint";index;constructor(e){super(St.eventName,{bubbles:!0,composed:!0}),this.index=e}}const $t="copy-step-as-";function kt(e){if(!("selectors"in e))return"";const t=e.selectors.flat().find(e=>e.startsWith("aria/"));if(!t)return"";const i=t.match(/^aria\/(.+?)(\[role="(.+)"\])?$/);return i?`${function(e){switch(e){case"button":return gt(ut.elementRoleButton);case"input":return gt(ut.elementRoleInput);default:return gt(ut.elementRoleFallback)}}(i[3])} "${i[1]}"`:""}function Ct(t,i,o){if(!t.step&&!t.section)return;const a={step:!0,expanded:t.showDetails,"is-success":"success"===t.state,"is-current":"current"===t.state,"is-outstanding":"outstanding"===t.state,"is-error":"error"===t.state,"is-stopped":"stopped"===t.state,"is-start-of-group":t.isStartOfGroup,"is-first-section":t.isFirstSection,"has-breakpoint":t.hasBreakpoint},l=Boolean(t.step),c=function(e){if(e.section)return e.section.title?e.section.title:pt`<span class="fallback">(No Title)</span>`;if(!e.step)throw new Error("Missing both step and section");switch(e.step.type){case n.Schema.StepType.CustomStep:return gt(ut.customStepTitle);case n.Schema.StepType.SetViewport:return gt(ut.setViewportClickTitle);case n.Schema.StepType.Click:return gt(ut.clickStepTitle);case n.Schema.StepType.DoubleClick:return gt(ut.doubleClickStepTitle);case n.Schema.StepType.Hover:return gt(ut.hoverStepTitle);case n.Schema.StepType.EmulateNetworkConditions:return gt(ut.emulateNetworkConditionsStepTitle);case n.Schema.StepType.Change:return gt(ut.changeStepTitle);case n.Schema.StepType.Close:return gt(ut.closeStepTitle);case n.Schema.StepType.Scroll:return gt(ut.scrollStepTitle);case n.Schema.StepType.KeyUp:return gt(ut.keyUpStepTitle);case n.Schema.StepType.KeyDown:return gt(ut.keyDownStepTitle);case n.Schema.StepType.WaitForElement:return gt(ut.waitForElementStepTitle);case n.Schema.StepType.WaitForExpression:return gt(ut.waitForExpressionStepTitle);case n.Schema.StepType.Navigate:return gt(ut.navigateStepTitle)}}({step:t.step,section:t.section}),d=t.step?kt(t.step):p?p.url:"";var p;e.render(pt`
    <style>${dt}</style>
    <devtools-timeline-section .data=${{isFirstSection:t.isFirstSection,isLastSection:t.isLastSection,isStartOfGroup:t.isStartOfGroup,isEndOfGroup:t.isEndOfGroup,isSelected:t.isSelected}} @contextmenu=${e=>{const i=new s.ContextMenu.ContextMenu(e);t.populateStepContextMenu(i),i.show()}}
      data-step-index=${t.stepIndex} data-section-index=${t.sectionIndex} class=${e.Directives.classMap(a)}>
      <svg slot="icon" width="24" height="24" height="100%" class="icon">
        <circle class="circle-icon"/>
        <g class="error-icon">
          <path d="M1.5 1.5L6.5 6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.5 6.5L6.5 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <path @click=${t.onBreakpointClick} jslog=${r.action("breakpoint").track({click:!0})} class="breakpoint-icon" d="M2.5 5.5H17.7098L21.4241 12L17.7098 18.5H2.5V5.5Z"/>
      </svg>
      <div class="summary">
        <div class="title-container ${l?"action":""}"
          @click=${l&&t.toggleShowDetails}
          @keydown=${l&&t.onToggleShowDetailsKeydown}
          tabindex="0"
          jslog=${r.sectionHeader().track({click:!0})}
          aria-role=${l?"button":""}
          aria-label=${l?"Show details for step":""}
        >
          ${l?pt`<devtools-icon
                  class="chevron"
                  jslog=${r.expand().track({click:!0})}
                  name="triangle-down">
                </devtools-icon>`:""}
          <div class="title">
            <div class="main-title" title=${c}>${c}</div>
            <div class="subtitle" title=${d}>${d}</div>
          </div>
        </div>
        <div class="filler"></div>
        ${function(e){return pt`
    <devtools-menu-button
      class="step-actions"
      title=${gt(ut.openStepActions)}
      aria-label=${gt(ut.openStepActions)}
      .populateMenuCall=${e.populateStepContextMenu}
      @keydown=${e=>{e.stopPropagation()}}
      jslog=${r.dropDown("step-actions").track({click:!0})}
      .iconName=${"dots-vertical"}
      }
    ></devtools-menu-button>
  `}(t)}
      </div>
      <div class="details">
        ${t.step&&pt`<devtools-recorder-step-editor
          class=${t.isSelected?"is-selected":""}
          .step=${t.step}
          .disabled=${t.isPlaying}
          @stepedited=${t.stepEdited}>
        </devtools-recorder-step-editor>`}
        ${t.section?.causingStep&&pt`<devtools-recorder-step-editor
          .step=${t.section.causingStep}
          .isTypeEditable=${!1}
          .disabled=${t.isPlaying}
          @stepedited=${t.stepEdited}>
        </devtools-recorder-step-editor>`}
      </div>
      ${t.error&&pt`
        <div class="error" role="alert">
          ${t.error.message}
        </div>
      `}
    </devtools-timeline-section>
  `,o)}class Et extends HTMLElement{#v=this.attachShadow({mode:"open"});#je=new IntersectionObserver(e=>{this.#Me.isVisible=e[0].isIntersecting});#Me={state:"default",showDetails:!1,isEndOfGroup:!1,isStartOfGroup:!1,stepIndex:0,sectionIndex:0,isFirstSection:!1,isLastSection:!1,isRecording:!1,isPlaying:!1,isVisible:!1,hasBreakpoint:!1,removable:!0,builtInConverters:[],extensionConverters:[],isSelected:!1,recorderSettings:void 0,actions:[],stepEdited:this.#Le.bind(this),onBreakpointClick:this.#Pe.bind(this),handleStepAction:this.#Be.bind(this),toggleShowDetails:this.#Oe.bind(this),onToggleShowDetailsKeydown:this.#De.bind(this),populateStepContextMenu:this.#Fe.bind(this)};#r=Ct;constructor(e){super(),e&&(this.#r=e),this.setAttribute("jslog",`${r.section("step-view")}`)}set data(e){const t=this.#Me.state;this.#Me.step=e.step,this.#Me.section=e.section,this.#Me.state=e.state,this.#Me.error=e.error,this.#Me.isEndOfGroup=e.isEndOfGroup,this.#Me.isStartOfGroup=e.isStartOfGroup,this.#Me.stepIndex=e.stepIndex,this.#Me.sectionIndex=e.sectionIndex,this.#Me.isFirstSection=e.isFirstSection,this.#Me.isLastSection=e.isLastSection,this.#Me.isRecording=e.isRecording,this.#Me.isPlaying=e.isPlaying,this.#Me.hasBreakpoint=e.hasBreakpoint,this.#Me.removable=e.removable,this.#Me.builtInConverters=e.builtInConverters,this.#Me.extensionConverters=e.extensionConverters,this.#Me.isSelected=e.isSelected,this.#Me.recorderSettings=e.recorderSettings,this.#Me.actions=this.#ze(),this.#b(),this.#Me.state===t||"current"!==this.#Me.state||this.#Me.isVisible||this.scrollIntoView()}get step(){return this.#Me.step}get section(){return this.#Me.section}connectedCallback(){this.#je.observe(this),this.#b()}disconnectedCallback(){this.#je.unobserve(this)}#Oe(){this.#Me.showDetails=!this.#Me.showDetails,this.#b()}#De(e){const t=e;"Enter"!==t.key&&" "!==t.key||(this.#Oe(),e.stopPropagation(),e.preventDefault())}#Le(e){const t=this.#Me.step||this.#Me.section?.causingStep;if(!t)throw new Error("Expected step.");this.dispatchEvent(new ft(t,e.data))}#Be(e){switch(e.itemValue){case"add-step-before":{const e=this.#Me.step||this.#Me.section;if(!e)throw new Error("Expected step or section.");this.dispatchEvent(new yt(e,"before"));break}case"add-step-after":{const e=this.#Me.step||this.#Me.section;if(!e)throw new Error("Expected step or section.");this.dispatchEvent(new yt(e,"after"));break}case"remove-step":{const e=this.#Me.section?.causingStep;if(!this.#Me.step&&!e)throw new Error("Expected step.");this.dispatchEvent(new wt(this.#Me.step||e));break}case"add-breakpoint":if(!this.#Me.step)throw new Error("Expected step");this.dispatchEvent(new xt(this.#Me.stepIndex));break;case"remove-breakpoint":if(!this.#Me.step)throw new Error("Expected step");this.dispatchEvent(new St(this.#Me.stepIndex));break;default:{const t=e.itemValue;if(!t.startsWith($t))throw new Error("Unknown step action.");const i=this.#Me.step||this.#Me.section?.causingStep;if(!i)throw new Error("Step not found.");const o=t.substring(13);this.#Me.recorderSettings&&(this.#Me.recorderSettings.preferredCopyFormat=o),this.dispatchEvent(new bt(structuredClone(i)))}}}#Pe(){this.#Me.hasBreakpoint?this.dispatchEvent(new St(this.#Me.stepIndex)):this.dispatchEvent(new xt(this.#Me.stepIndex)),this.#b()}#ze=()=>{const e=[];if(this.#Me.isPlaying||(this.#Me.step&&e.push({id:"add-step-before",label:gt(ut.addStepBefore),group:"stepManagement",groupTitle:gt(ut.stepManagement)}),e.push({id:"add-step-after",label:gt(ut.addStepAfter),group:"stepManagement",groupTitle:gt(ut.stepManagement)}),this.#Me.removable&&e.push({id:"remove-step",group:"stepManagement",groupTitle:gt(ut.stepManagement),label:gt(ut.removeStep)})),this.#Me.step&&!this.#Me.isRecording&&(this.#Me.hasBreakpoint?e.push({id:"remove-breakpoint",label:gt(ut.removeBreakpoint),group:"breakPointManagement",groupTitle:gt(ut.breakpoints)}):e.push({id:"add-breakpoint",label:gt(ut.addBreakpoint),group:"breakPointManagement",groupTitle:gt(ut.breakpoints)})),this.#Me.step){for(const t of this.#Me.builtInConverters||[])e.push({id:$t+d.StringUtilities.toKebabCase(t.getId()),label:t.getFormatName(),group:"copy",groupTitle:gt(ut.copyAs)});for(const t of this.#Me.extensionConverters||[])e.push({id:$t+d.StringUtilities.toKebabCase(t.getId()),label:t.getFormatName(),group:"copy",groupTitle:gt(ut.copyAs),jslogContext:$t+"extension"})}return e};#Fe(e){const t=this.#ze(),i=t.filter(e=>e.id.startsWith($t)),o=t.filter(e=>!e.id.startsWith($t));for(const t of o){e.section(t.group).appendItem(t.label,()=>{this.#Be(new v.Menu.MenuItemSelectedEvent(t.id))},{jslogContext:t.id})}const s=i.find(e=>e.id===$t+this.#Me.recorderSettings?.preferredCopyFormat);if(s&&e.section("copy").appendItem(s.label,()=>{this.#Be(new v.Menu.MenuItemSelectedEvent(s.id))},{jslogContext:s.id}),i.length){const t=e.section("copy").appendSubMenuItem(gt(ut.copyAs),!1,"copy");for(const e of i)e!==s&&t.section(e.group).appendItem(e.label,()=>{this.#Be(new v.Menu.MenuItemSelectedEvent(e.id))},{jslogContext:e.id})}}#b(){this.#r(this.#Me,{},this.#v)}}customElements.define("devtools-step-view",Et);var Rt=Object.freeze({__proto__:null,AddBreakpointEvent:xt,AddStep:yt,CaptureSelectorsEvent:vt,CopyStepEvent:bt,RemoveBreakpointEvent:St,RemoveStep:wt,StepChanged:ft,StepView:Et,StopSelectorsCaptureEvent:mt});export{R as ControlButton,D as CreateRecordingView,Y as RecordingListView,ke as RecordingView,he as ReplaySection,je as SelectButton,rt as StepEditor,Rt as StepView,ct as TimelineSection};
//# sourceMappingURL=components.js.map
