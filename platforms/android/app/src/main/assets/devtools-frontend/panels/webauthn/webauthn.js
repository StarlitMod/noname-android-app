import*as t from"../../ui/legacy/legacy.js";import"../../ui/legacy/components/data_grid/data_grid.js";import*as e from"../../core/common/common.js";import*as a from"../../core/host/host.js";import*as i from"../../core/i18n/i18n.js";import*as n from"../../core/sdk/sdk.js";import"../../ui/components/buttons/buttons.js";import*as o from"../../ui/components/input/input.js";import*as s from"../../ui/lit/lit.js";import*as r from"../../ui/visual_logging/visual_logging.js";var l=`@scope to (devtools-widget > *){.webauthn-pane{overflow:auto;min-width:500px}.webauthn-toolbar-container{display:flex;background-color:var(--sys-color-cdt-base-container);border-bottom:1px solid var(--sys-color-divider);flex:0 0 auto}.webauthn-toolbar{display:inline-block}.authenticators-view{padding:0 var(--sys-size-9);min-height:auto;display:none}.webauthn-pane.enabled .authenticators-view{display:block}.new-authenticator-title{display:block;padding:var(--sys-size-7) 0 var(--sys-size-5) 0;font:var(--sys-typescale-headline5);&:has(devtools-button){padding-top:var(--sys-size-4)}}.new-authenticator-container{display:none;padding-left:var(--sys-size-9)}.authenticator-option{> select{margin:0 var(--sys-size-9) var(--sys-size-3) var(--sys-size-9)}> devtools-button{margin:var(--sys-size-3) var(--sys-size-9)}> input[type="checkbox"]{margin:var(--sys-size-5) var(--sys-size-9)}}.webauthn-pane.enabled .new-authenticator-container{display:block}.new-authenticator-form{border:none;flex:0 0 auto;margin:0;padding-bottom:var(--sys-size-5)}.webauthn-pane select{width:120px}.authenticator-section{display:block}.divider{border-bottom:var(--sys-size-1) solid var(--sys-color-divider);margin:10px calc(var(--sys-size-9) * -1) 0}.authenticator-fields{border:none;flex:0 0 auto;margin-bottom:10px}.authenticator-section-header{margin:var(--sys-size-4) 0 var(--sys-size-5) calc(var(--sys-size-5) * -1);display:flex;justify-content:space-between;align-items:flex-end}.authenticator-section-title{line-height:24px;display:inline-flex}.authenticator-section-title .authenticator-name-field{display:inline-block;border:none;animation:save-flash 0.2s;text-overflow:ellipsis;font:var(--sys-typescale-headline5)}.authenticator-section-title.editing-name .authenticator-name-field{border-bottom:1px solid var(--sys-color-neutral-outline);font-weight:normal;animation:none}.authenticator-field-value{font:var(--sys-typescale-monospace-regular);line-height:18px}.authenticator-field{margin:var(--sys-size-3) 0}.authenticator-field,\n  .authenticator-option{display:flex;align-items:center}.authenticator-option-label{color:var(--sys-color-on-surface-subtle);font:var(--sys-typescale-body5-medium);padding-right:var(--sys-size-6);text-align:left;min-width:152px;line-height:18px}::part(action-button){min-width:20px;margin:4px}.active-button-container{display:inline-block;min-width:28px}.edit-name-toolbar{display:inline-block;vertical-align:middle}@keyframes save-flash{from{opacity:0%}to{opacity:100%}}::part(credentialId-column),\n  ::part(isResidentCredential-column),\n  ::part(rpId-column),\n  ::part(userHandle-column),\n  ::part(signCount-column),\n  ::part(actions-column){vertical-align:middle}.credentials-title{display:block;font:var(--sys-typescale-headline5);padding:var(--sys-size-7) 0 var(--sys-size-5) 0;border-top:var(--sys-size-1) solid var(--sys-color-divider);margin-right:calc(var(--sys-size-9) * -1)}.code{font-family:monospace}.learn-more{display:flex;justify-content:center;align-items:center;height:100%;text-align:center;overflow:hidden}.webauthn-pane.enabled .learn-more{display:none}}\n/*# sourceURL=${import.meta.resolve("./webauthnPane.css")} */`;const{render:c,html:d,Directives:{ref:h,repeat:u,classMap:p}}=s,{widgetConfig:v}=t.Widget,b={export:"Export",remove:"Remove",noCredentialsTryCallingSFromYour:"No credentials. Try calling {PH1} from your website.",enableVirtualAuthenticator:"Enable virtual authenticator environment",id:"ID",isResident:"Is Resident",rpId:"RP ID",userHandle:"User Handle",signCount:"Signature Count",actions:"Actions",credentials:"Credentials",noAuthenticator:"No authenticator set up",useWebauthnForPhishingresistant:"Use WebAuthn for phishing-resistant authentication.",newAuthenticator:"New authenticator",protocol:"Protocol",transport:"Transport",supportsResidentKeys:"Supports resident keys",supportsLargeBlob:"Supports large blob",add:"Add",active:"Active",editName:"Edit name",enterNewName:"Enter new name",saveName:"Save name",authenticatorS:"Authenticator {PH1}",privateKeypem:"Private key.pem",uuid:"UUID",supportsUserVerification:"Supports user verification",yes:"Yes",no:"No",setSAsTheActiveAuthenticator:"Set {PH1} as the active authenticator"},g=i.i18n.registerUIStrings("panels/webauthn/WebauthnPane.ts",b),m=i.i18n.getLocalizedString.bind(void 0,g),y=s.i18nTemplate.bind(void 0,g);const $="PRIVATE",f=`-----BEGIN ${$} KEY-----\n`,A=`-----END ${$} KEY-----`,w={Ctap2:"ctap2",U2f:"u2f"};function k(t,e,a,i,n,o,s,l,c,v,g){function $(t){if(!t)return;const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches;t.scrollIntoView({block:"nearest",behavior:e?"auto":"smooth"})}return d`
    <div class="authenticator-section" data-authenticator-id=${t}
         jslog=${r.section("authenticator")}
          ${h(e=>{g.revealSection.set(t,$.bind(null,e))})}>
      <div class="authenticator-section-header">
        <div class="authenticator-section-title" role="heading" aria-level="2">
          <devtools-toolbar class="edit-name-toolbar">
            <devtools-button title=${m(b.editName)}
                class=${p({hidden:i})}
                @click=${o}
                .iconName=${"edit"} .variant=${"toolbar"}
                .jslogContext=${"edit-name"}></devtools-button>
            <devtools-button title=${m(b.saveName)}
                @click=${t=>s((t.target.parentElement?.nextSibling).value)}
                .iconName=${"checkmark"} .variant=${"toolbar"}
                class=${p({hidden:!i})}
                .jslogContext=${"save-name"}></devtools-button>
          </devtools-toolbar>
          <input class="authenticator-name-field"
              placeholder=${m(b.enterNewName)}
              jslog=${r.textField("name").track({keydown:"Enter",change:!0})}
              value=${m(b.authenticatorS,{PH1:e.name})} .disabled=${!i}
              ${h(t=>{t instanceof HTMLInputElement&&i&&t.focus()})}
              @focusout=${t=>s(t.target.value)}
              @keydown=${t=>{"Enter"===t.key&&s(t.target.value)}}>
        </div>
        <div class="active-button-container">
          <label title=${m(b.setSAsTheActiveAuthenticator,{PH1:e.name})}>
            <input type="radio" .checked=${a} @change=${t=>{t.target.checked&&n()}}
                  jslog=${r.toggle("webauthn.active-authenticator").track({change:!0})}>
            ${m(b.active)}
          </label>
        </div>
        <button class="text-button" @click=${l}
            jslog=${r.action("webauthn.remove-authenticator").track({click:!0})}>
          ${m(b.remove)}
        </button>
      </div>
      ${function(t,e){return d`
    <div class="authenticator-fields">
      <div class="authenticator-field">
        <label class="authenticator-option-label">${m(b.uuid)}</label>
        <div class="authenticator-field-value">${t}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">${m(b.protocol)}</label>
        <div class="authenticator-field-value">${e.protocol}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">${m(b.transport)}</label>
        <div class="authenticator-field-value">${e.transport}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${m(b.supportsResidentKeys)}
        </label>
        <div class="authenticator-field-value">
          ${e.hasResidentKey?m(b.yes):m(b.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${m(b.supportsLargeBlob)}
        </label>
        <div class="authenticator-field-value">
          ${e.hasLargeBlob?m(b.yes):m(b.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${m(b.supportsUserVerification)}
        </label>
        <div class="authenticator-field-value">
          ${e.hasUserVerification?m(b.yes):m(b.no)}
        </div>
      </div>
    </div>`}(t,e.options)}
      <div class="credentials-title">${m(b.credentials)}</div>
      ${function(t,e,a,i){return d`
    <devtools-data-grid name=${m(b.credentials)} inline striped>
      <table>
        <thead>
          <tr>
            <th id="credentialId" weight="24" text-overflow="ellipsis">${m(b.id)}</th>
            <th id="isResidentCredential" type="boolean" weight="10">${m(b.isResident)}</th>
            <th id="rpId" weight="16.5">${m(b.rpId)}</th>
            <th id="userHandle" weight="16.5">${m(b.userHandle)}</th>
            <th id="signCount" weight="16.5">${m(b.signCount)}</th>
            <th id="actions" weight="16.5">${m(b.actions)}</th>
          </tr>
        </thead>
        <tbody>
        ${e.length?u(e,t=>t.credentialId,t=>d`
          <tr>
            <td>${t.credentialId}</td>
            <td>${t.isResidentCredential}</td>
            <td>${t.rpId}</td>
            <td>${t.userHandle}</td>
            <td>${t.signCount}</td>
            <td>
              <devtools-button .variant=${"outlined"}
                  part="action-button"
                  @click=${()=>a(t)}
                  .jslogContext=${"webauthn.export-credential"}>
                ${m(b.export)}
              </devtools-button>
              <devtools-button .variant=${"outlined"}
                  part="action-button"
                  @click=${()=>i(t.credentialId)}
                  .jslogContext=${"webauthn.remove-credential"}>
                ${m(b.remove)}
              </devtools-button>
            </td>
          </tr>`):d`
          <tr>
            <td class="center" colspan=6>
              ${y(b.noCredentialsTryCallingSFromYour,{PH1:d`<span class="code">navigator.credentials.create()</span>`})}
            </td>
          </tr>`}
        </tbody>
      </table>
    </devtools-data-grid>`}(0,e.credentials,c,v)}
      <div class="divider"></div>
    </div>`}const x=(e,a,i)=>{c(d`
    <style>${o.checkboxStyles}</style>
    <style>${l}</style>
    <div class="webauthn-pane flex-auto ${p({enabled:e.enabled})}">
      ${function(t,e){const a=m(b.enableVirtualAuthenticator);return d`
    <div class="webauthn-toolbar-container" jslog=${r.toolbar()} role="toolbar">
      <devtools-toolbar class="webauthn-toolbar" role="presentation">
        <devtools-checkbox title=${a}
            @click=${e}
            .jslogContext=${"virtual-authenticators"}
            .checked=${t}>
          ${a}
        </devtools-checkbox>
      </devtools-toolbar>
    </div>`}(e.enabled,e.onToggleEnabled)}
      <div class="authenticators-view">
         ${u([...e.authenticators.entries()],([t])=>t,([t,i])=>k(t,i,e.activeAuthenticatorId===t,e.editingAuthenticatorId===t,e.onActivateAuthenticator.bind(e,t),e.onEditName.bind(e,t),e.onSaveName.bind(e,t),e.onRemoveAuthenticator.bind(e,t),e.onExportCredential,e.onRemoveCredential.bind(e,t),a))}
      </div>
      ${d`
    <devtools-widget class="learn-more" .widgetConfig=${v(t.EmptyWidget.EmptyWidget,{header:m(b.noAuthenticator),text:m(b.useWebauthnForPhishingresistant),link:"https://developer.chrome.com/docs/devtools/webauthn"})}>
    </devtools-widget>`}
      ${function(t,e,a,i){const n="ctap2"===t.protocol;return d`
    <div class="new-authenticator-container">
      <label class="new-authenticator-title">
        ${m(b.newAuthenticator)}
      </label>
      <div class="new-authenticator-form" jslog=${r.section("new-authenticator")}>
        <div class="authenticator-option">
          <label class="authenticator-option-label" for="protocol">
            ${m(b.protocol)}
          </label>
          <select id="protocol" jslog=${r.dropDown("protocol").track({change:!0})}
              value=${t.protocol}
              @change=${t=>a({protocol:t.target.value})}>
            ${Object.values(w).sort().map(t=>d`
              <option value=${t} jslog=${r.item(t).track({click:!0})}>
                ${t}
              </option>`)}
          </select>
        </div>
        <div class="authenticator-option">
          <label for="transport" class="authenticator-option-label">
            ${m(b.transport)}
          </label>
          <select id="transport"
              value=${t.transport}
              jslog=${r.dropDown("transport").track({change:!0})}
              @change=${t=>a({transport:t.target.value})}>
            ${["usb","ble","nfc",...n?["internal"]:[]].map(a=>d`
                <option value=${a} jslog=${r.item(a).track({click:!0})}
                        .selected=${t.transport===a}
                        .disabled=${!e&&"internal"===a}>
                  ${a}
                </option>`)}
          </select>
        </div>
        <div class="authenticator-option">
          <label for="resident-key" class="authenticator-option-label">
            ${m(b.supportsResidentKeys)}
          </label>
          <input id="resident-key" class="authenticator-option-checkbox" type="checkbox"
              jslog=${r.toggle("resident-key").track({change:!0})}
              @change=${t=>a({hasResidentKey:t.target.checked})}
              .checked=${Boolean(t.hasResidentKey&&n)} .disabled=${!n}>
        </div>
        <div class="authenticator-option">
          <label for="user-verification" class="authenticator-option-label">
            ${m(b.supportsUserVerification)}
          </label>
          <input id="user-verification" class="authenticator-option-checkbox" type="checkbox"
              jslog=${r.toggle("user-verification").track({change:!0})}
              @change=${t=>a({hasUserVerification:t.target.checked})}
              .checked=${Boolean(t.hasUserVerification&&n)}
              .disabled=${!n}>
        </div>
        <div class="authenticator-option">
          <label for="large-blob" class="authenticator-option-label">
            ${m(b.supportsLargeBlob)}
          </label>
          <input id="large-blob" class="authenticator-option-checkbox" type="checkbox"
              jslog=${r.toggle("large-blob").track({change:!0})}
              @change=${t=>a({hasLargeBlob:t.target.checked})}
              .checked=${Boolean(t.hasLargeBlob&&n&&t.hasResidentKey)}
              .disabled=${!t.hasResidentKey||!n}>
        </div>
        <div class="authenticator-option">
          <div class="authenticator-option-label"></div>
          <devtools-button @click=${i}
              id="add-authenticator"
              .jslogContext=${"webauthn.add-authenticator"}
              .variant=${"outlined"}>
            ${m(b.add)}
          </devtools-button>
        </div>
      </div>
    </div>`}(e.newAuthenticatorOptions,e.internalTransportAvailable,e.updateNewAuthenticatorOptions,e.addAuthenticator)}
    </div>`,i)};class I extends t.Panel.Panel{async#t(t){if(!this.#e)throw new Error("WebAuthn model is not available.");const e=await this.#e.addAuthenticator(t),a=e.slice(-5);return this.#a.set(e,{name:a,options:t,credentials:[]}),this.requestUpdate(),this.#e.addEventListener("CredentialAdded",this.#i.bind(this,e)),this.#e.addEventListener("CredentialAsserted",this.#n.bind(this,e)),this.#e.addEventListener("CredentialUpdated",this.#n.bind(this,e)),this.#e.addEventListener("CredentialDeleted",this.#o.bind(this,e)),e}#s=null;#r=null;#l=!1;#a=new Map;#c=!1;#d;#e;#h={protocol:"ctap2",ctap2Version:"ctap2_1",transport:"usb",hasResidentKey:!1,hasUserVerification:!1,hasLargeBlob:!1,automaticPresenceSimulation:!0,isUserVerified:!0};#u=!1;#p;#v;#b={revealSection:new Map};constructor(t=x){super("webauthn"),this.#v=t,n.TargetManager.TargetManager.instance().observeModels(n.WebAuthnModel.WebAuthnModel,this,{scoped:!0}),this.#d=e.Settings.Settings.instance().createSetting("webauthn-authenticators",[]),this.#g(),this.performUpdate()}performUpdate(){const t={enabled:this.#c,onToggleEnabled:this.#m.bind(this),authenticators:this.#a,activeAuthenticatorId:this.#s,editingAuthenticatorId:this.#r,newAuthenticatorOptions:this.#h,internalTransportAvailable:!this.#u,updateNewAuthenticatorOptions:this.#y.bind(this),addAuthenticator:this.#$.bind(this),onActivateAuthenticator:this.#f.bind(this),onEditName:this.#A.bind(this),onSaveName:this.#w.bind(this),onRemoveAuthenticator:this.removeAuthenticator.bind(this),onExportCredential:this.#k.bind(this),onRemoveCredential:this.#x.bind(this)};this.#v(t,this.#b,this.contentElement)}modelAdded(t){t.target()===t.target().outermostTarget()&&(this.#e=t)}modelRemoved(t){t.target()===t.target().outermostTarget()&&(this.#e=void 0)}async#I(){let t=null;const e=this.#d.get();for(const a of e){if(!this.#e)continue;const e=await this.#t(a);a.authenticatorId=e,a.active&&(t=e)}this.#d.set(e),t&&this.#f(t)}async ownerViewDisposed(){this.#c=!1,await this.#E(!1)}#i(t,{data:e}){const a=this.#a.get(t);a&&(a.credentials.push(e.credential),this.requestUpdate())}#n(t,{data:e}){const a=this.#a.get(t);if(!a)return;const i=a.credentials.find(t=>t.credentialId===e.credential.credentialId);i&&(Object.assign(i,e.credential),this.requestUpdate())}#o(t,{data:e}){const a=this.#a.get(t);if(!a)return;const i=a.credentials.findIndex(t=>t.credentialId===e.credentialId);i<0||(a.credentials.splice(i,1),this.requestUpdate())}async#E(t){await this.#p,this.#p=new Promise(async e=>{t&&!this.#l&&(a.userMetrics.actionTaken(a.UserMetrics.Action.VirtualAuthenticatorEnvironmentEnabled),this.#l=!0),this.#e&&await this.#e.setVirtualAuthEnvEnabled(t),t?await this.#I():this.#C(),this.#p=void 0,this.#c=t,this.requestUpdate(),e()})}#C(){this.#a.clear()}#m(){this.#E(!this.#c)}#y(t){Object.assign(this.#h,t),this.requestUpdate()}#g(){this.#u=Boolean(this.#d.get().find(t=>"internal"===t.transport)),this.#u&&"internal"===this.#h.transport&&(this.#h.transport="nfc"),this.requestUpdate()}async#$(){const t={...this.#h};if(this.#e){const e=await this.#t(t);this.#s=e;const a=this.#d.get();a.push({authenticatorId:e,active:!0,...t}),this.#d.set(a.map(t=>({...t,active:t.authenticatorId===e}))),this.#g(),await this.updateComplete,this.#b.revealSection.get(e)?.()}}#k(t){let e=f;for(let a=0;a<t.privateKey.length;a+=64)e+=t.privateKey.substring(a,a+64)+"\n";e+=A;const a=document.createElement("a");a.download=m(b.privateKeypem),a.href="data:application/x-pem-file,"+encodeURIComponent(e),a.click()}#x(t,e){const a=this.#a.get(t);if(!a)return;const i=a.credentials.findIndex(t=>t.credentialId===e);i<0||(a.credentials.splice(i,1),this.requestUpdate(),this.#e&&this.#e.removeCredential(t,e))}#A(t){this.#r=t,this.requestUpdate()}#w(t,e){const a=this.#a.get(t);a&&(a.name=e,this.#r=null,this.requestUpdate())}removeAuthenticator(t){this.#a.delete(t),this.requestUpdate(),this.#e&&this.#e.removeAuthenticator(t);const e=this.#d.get().filter(e=>e.authenticatorId!==t);if(this.#d.set(e),this.#s===t){const t=Array.from(this.#a.keys());t.length?this.#f(t[0]):this.#s=null}this.#g()}async#f(t){await this.#S(),this.#e&&await this.#e.setAutomaticPresenceSimulation(t,!0),this.#s=t;const e=this.#d.get().map(e=>({...e,active:e.authenticatorId===t}));this.#d.set(e),this.requestUpdate()}async#S(){this.#s&&this.#e&&await this.#e.setAutomaticPresenceSimulation(this.#s,!1),this.#s=null,this.requestUpdate()}}var E=Object.freeze({__proto__:null,DEFAULT_VIEW:x,WebauthnPaneImpl:I});export{E as WebauthnPane};
//# sourceMappingURL=webauthn.js.map
