import"../tooltips/tooltips.js";import"../icon_button/icon_button.js";import*as t from"../../../core/common/common.js";import*as e from"../../lit/lit.js";import"../../legacy/legacy.js";import*as i from"../../../core/host/host.js";import*as s from"../../../core/i18n/i18n.js";import*as n from"../../visual_logging/visual_logging.js";import"../buttons/buttons.js";import*as o from"../input/input.js";var r=`.clickable{cursor:pointer}devtools-icon{vertical-align:text-bottom;padding-left:2px}\n/*# sourceURL=${import.meta.resolve("./settingDeprecationWarning.css")} */`;const{html:a}=e;class l extends HTMLElement{#t=this.attachShadow({mode:"open"});set data(t){this.#e(t)}#e({disabled:i,warning:s,experiment:n}){const o={clickable:!1,medium:!0};let l;i&&n&&(o.clickable=!0,l=()=>{t.Revealer.reveal(n)}),e.render(a`
        <style>${r}</style>
        <devtools-icon class=${e.Directives.classMap(o)} name="info" title=${s} @click=${l}></devtools-icon>`,this.#t,{host:this})}}customElements.define("devtools-setting-deprecation-warning",l);var c=Object.freeze({__proto__:null,SettingDeprecationWarning:l}),h=`:host{padding:0;margin:0}input{height:12px;width:12px;min-height:12px;min-width:12px;margin:6px}label{display:inline-flex;align-items:center;overflow:hidden;text-overflow:ellipsis}p{margin:6px 0}.disabled-reason{box-sizing:border-box;margin-left:var(--sys-size-2);width:var(--sys-size-9);height:var(--sys-size-9)}.info-icon{cursor:pointer;position:relative;margin-left:var(--sys-size-2);top:var(--sys-size-2);width:var(--sys-size-9);height:var(--sys-size-9)}.link{color:var(--text-link);text-decoration:underline}\n/*# sourceURL=${import.meta.resolve("./settingCheckbox.css")} */`;const{html:d,Directives:{ifDefined:g}}=e,p={learnMore:"Learn more"},m=s.i18n.registerUIStrings("ui/components/settings/SettingCheckbox.ts",p),v=s.i18n.getLocalizedString.bind(void 0,m);class b extends HTMLElement{#t=this.attachShadow({mode:"open"});#i;#s;#n;set data(t){this.#s&&this.#i&&this.#i.removeChangeListener(this.#s.listener),this.#i=t.setting,this.#n=t.textOverride,this.#s=this.#i.addChangeListener(()=>{this.#e()}),this.#e()}icon(){if(!this.#i)return;if(this.#i.deprecation)return d`<devtools-setting-deprecation-warning .data=${this.#i.deprecation}></devtools-setting-deprecation-warning>`;const t=this.#i.learnMore();if(t){const s=`${this.#i.name}-documentation`,o={iconName:"info",variant:"icon",size:"SMALL",jslogContext:s},r=t.url;if(t.tooltip){const i=`${this.#i.name}-information`;return d`
          <devtools-button
            class="info-icon"
            aria-details=${i}
            .data=${o}
          ></devtools-button>
          <devtools-tooltip id=${i} variant="rich">
            <span>${t.tooltip()}</span><br />
            ${r?d`<x-link
                  href=${r}
                  class="link"
                  jslog=${n.link(s).track({click:!0})}
                  >${v(p.learnMore)}</x-link
                >`:e.nothing}
          </devtools-tooltip>
        `}if(r){const t=t=>{i.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(r),t.consume()};return o.iconName="help",o.title=v(p.learnMore),d`<devtools-button
          class="info-icon"
          @click=${t}
          .data=${o}
        ></devtools-button>`}}}get checked(){return!(!this.#i||this.#i.disabledReasons().length>0)&&this.#i.get()}#e(){if(!this.#i)throw new Error('No "Setting" object provided for rendering');const t=this.icon(),i=`${this.#i.learnMore()?this.#i.learnMore()?.tooltip?.():""}`,s=this.#i.disabledReasons(),r=s.length?d`
      <devtools-button class="disabled-reason" .iconName=${"info"} .variant=${"icon"} .size=${"SMALL"} title=${g(s.join("\n"))} @click=${onclick}></devtools-button>
    `:e.nothing;e.render(d`
      <style>${o.checkboxStyles}</style>
      <style>${h}</style>
      <p>
        <label title=${i}>
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.#i.disabled()}
            @change=${this.#o}
            jslog=${n.toggle().track({click:!0}).context(this.#i.name)}
            aria-label=${this.#i.title()}
          />
          ${this.#n||this.#i.title()}${r}
        </label>
        ${t}
      </p>`,this.#t,{host:this})}#o(t){this.#i?.set(t.target.checked),this.dispatchEvent(new CustomEvent("change",{bubbles:!0,composed:!1}))}}customElements.define("setting-checkbox",b);var u=Object.freeze({__proto__:null,SettingCheckbox:b});export{u as SettingCheckbox,c as SettingDeprecationWarning};
//# sourceMappingURL=settings.js.map
