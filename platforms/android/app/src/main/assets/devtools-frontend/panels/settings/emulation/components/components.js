import"../../../../ui/legacy/legacy.js";import*as e from"../../../../core/i18n/i18n.js";import*as t from"../../../../core/platform/platform.js";import"../../../../ui/components/buttons/buttons.js";import*as a from"../../../../ui/components/input/input.js";import*as r from"../../../../ui/lit/lit.js";import*as n from"../../../../ui/visual_logging/visual_logging.js";import*as i from"../utils/utils.js";var s=`.root{color:var(--sys-color-on-surface);width:100%}.tree-title{font-weight:700;display:flex;align-items:center;& > [aria-controls="form-container"]{margin-left:var(--sys-size-2);padding-right:var(--sys-size-3);& > [name="triangle-right"],\n    & > [name="triangle-down"]{vertical-align:bottom}&[aria-expanded="true"] > [name="triangle-right"]{display:none}&[aria-expanded="false"] > [name="triangle-down"]{display:none}}}.form-container{display:grid;grid-template-columns:1fr 1fr 1fr auto;align-items:center;gap:8px 10px;padding:0 10px}.full-row{grid-column:1/5}.form-factors-checkbox-group{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 10px}.form-factor-checkbox-label{display:flex;align-items:center;gap:6px;white-space:nowrap}hr.section-separator{grid-column:1/5;border:none;margin-top:1px}.half-row{grid-column:span 2}.mobile-checkbox-container{display:flex}.device-model-input{grid-column:1/4}.input-field{color:var(--sys-color-on-surface);padding:3px 6px;border-radius:2px;border:1px solid var(--sys-color-neutral-outline);background-color:var(--sys-color-cdt-base-container);font-size:inherit;height:18px}.input-field::placeholder{color:var(--sys-color-on-surface-subtle)}.input-field:focus{border:1px solid var(--sys-color-state-focus-ring);outline-width:0}.add-container{cursor:pointer;display:flex;align-items:center;gap:6px}.add-icon{margin-right:5px}.brand-row{display:flex;align-items:center;gap:10px;justify-content:space-between}.brand-row > input{width:100%}.info-icon{margin-left:5px;margin-right:1px;height:var(--sys-size-8);width:var(--sys-size-8)}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;font-weight:400}devtools-icon + .link{margin-inline-start:2px}.hide-container{display:none}.input-field-label-container{display:flex;flex-direction:column;gap:10px}@media (forced-colors: active){.input-field{border:1px solid}.tree-title[aria-disabled="true"]{color:GrayText}}\n/*# sourceURL=${import.meta.resolve("./userAgentClientHintsForm.css")} */`;const{html:o}=r,l={title:"User agent client hints",useragent:"User agent (Sec-CH-UA)",fullVersionList:"Full version list (Sec-CH-UA-Full-Version-List)",brandProperties:"User agent properties",brandName:"Brand",brandNameAriaLabel:"Brand {PH1}",significantBrandVersionPlaceholder:"Significant version (e.g. 87)",brandVersionPlaceholder:"Version (e.g. 87.0.4280.88)",brandVersionAriaLabel:"Version {PH1}",addBrand:"Add Brand",brandUserAgentDelete:"Delete brand from user agent section",brandFullVersionListDelete:"Delete brand from full version list",formFactorsTitle:"Form Factors (Sec-CH-UA-Form-Factors)",formFactorsGroupAriaLabel:"Available Form Factors",formFactorDesktop:"Desktop",formFactorAutomotive:"Automotive",formFactorMobile:"Mobile",formFactorTablet:"Tablet",formFactorXR:"XR",formFactorEInk:"EInk",formFactorWatch:"Watch",fullBrowserVersion:"Full browser version (Sec-CH-UA-Full-Version)",fullBrowserVersionPlaceholder:"Full browser version (e.g. 87.0.4280.88)",platformLabel:"Platform (Sec-CH-UA-Platform / Sec-CH-UA-Platform-Version)",platformProperties:"Platform properties",platformVersion:"Platform version",platformPlaceholder:"Platform (e.g. Android)",architecture:"Architecture (Sec-CH-UA-Arch)",architecturePlaceholder:"Architecture (e.g. x86)",deviceProperties:"Device properties",deviceModel:"Device model (Sec-CH-UA-Model)",mobileCheckboxLabel:"Mobile",update:"Update",notRepresentable:"Not representable as structured headers string.",userAgentClientHintsInfo:"User agent client hints are an alternative to the user agent string that identify the browser and the device in a more structured way with better privacy accounting.",addedBrand:"Added brand row",deletedBrand:"Deleted brand row",learnMore:"Learn more"},d=e.i18n.registerUIStrings("panels/settings/emulation/components/UserAgentClientHintsForm.ts",l),c=e.i18n.getLocalizedString.bind(void 0,d);class h extends Event{static eventName="clienthintschange";constructor(){super(h.eventName)}}class u extends Event{static eventName="clienthintssubmit";detail;constructor(e){super(u.eventName),this.detail={value:e}}}const p={brands:[{brand:"",version:""}],fullVersionList:[{brand:"",version:""}],fullVersion:"",platform:"",platformVersion:"",architecture:"",model:"",mobile:!1,formFactors:[]},m=[l.formFactorDesktop,l.formFactorAutomotive,l.formFactorMobile,l.formFactorTablet,l.formFactorXR,l.formFactorEInk,l.formFactorWatch];class b extends HTMLElement{#e=this.attachShadow({mode:"open"});#t=!1;#a=!1;#r=p;#n=!1;#i=!1;#s="";set value(e){const{metaData:t=p,showMobileCheckbox:a=!1,showSubmitButton:r=!1}=e;this.#r={...this.#r,...t},this.#n=a,this.#i=r,this.#o()}get value(){return{metaData:this.#r}}set disabled(e){this.#a=e,this.#t=!1,this.#o()}get disabled(){return this.#a}#l=e=>{"Space"!==e.code&&"Enter"!==e.code&&"ArrowLeft"!==e.code&&"ArrowRight"!==e.code||(e.consume(!0),this.#d(e.code))};#d=e=>{this.#a||"ArrowLeft"===e&&!this.#t||"ArrowRight"===e&&this.#t||(this.#t=!this.#t,this.#o())};#c=(e,t,a)=>{const r=this.#r.brands?.map((r,n)=>{if(n===t){const{brand:t,version:n}=r;return"brandName"===a?{brand:e,version:n}:{brand:t,version:e}}return r});this.#r={...this.#r,brands:r},this.dispatchEvent(new h),this.#o()};#h=(e,t,a)=>{const r=this.#r.fullVersionList?.map((r,n)=>{if(n===t){const{brand:t,version:n}=r;return"brandName"===a?{brand:e,version:n}:{brand:t,version:e}}return r});this.#r={...this.#r,fullVersionList:r},this.dispatchEvent(new h),this.#o()};#u=e=>{const{brands:t=[]}=this.#r;t.splice(e,1),this.#r={...this.#r,brands:t},this.dispatchEvent(new h),this.#s=c(l.deletedBrand),this.#o();let a=this.shadowRoot?.getElementById(`ua-brand-${e+1}-input`);a||(a=this.shadowRoot?.getElementById("add-brand-button")),a?.focus()};#p=e=>{const{fullVersionList:t=[]}=this.#r;t.splice(e,1),this.#r={...this.#r,fullVersionList:t},this.dispatchEvent(new h),this.#s=c(l.deletedBrand),this.#o();let a=this.shadowRoot?.getElementById(`fvl-brand-${e+1}-input`);a||(a=this.shadowRoot?.getElementById("add-fvl-brand-button")),a?.focus()};#m=()=>{const{brands:e}=this.#r;this.#r={...this.#r,brands:[...Array.isArray(e)?e:[],{brand:"",version:""}]},this.dispatchEvent(new h),this.#s=c(l.addedBrand),this.#o();const t=this.shadowRoot?.querySelectorAll(".ua-brand-name-input");if(t){const e=Array.from(t).pop();e&&e.focus()}};#b=e=>{"Space"!==e.code&&"Enter"!==e.code||(e.preventDefault(),this.#m())};#f=()=>{const{fullVersionList:e}=this.#r;this.#r={...this.#r,fullVersionList:[...Array.isArray(e)?e:[],{brand:"",version:""}]},this.dispatchEvent(new h),this.#s=c(l.addedBrand),this.#o();const t=this.shadowRoot?.querySelectorAll(".fvl-brand-name-input");if(t){const e=Array.from(t).pop();e&&e.focus()}};#g=e=>{"Space"!==e.code&&"Enter"!==e.code||(e.preventDefault(),this.#f())};#v=(e,t)=>{let a=[...this.#r.formFactors||[]];t?a.includes(e)||a.push(e):a=a.filter(t=>t!==e),this.#r={...this.#r,formFactors:a},this.dispatchEvent(new h),this.#o()};#$=(e,t)=>{e in this.#r&&(this.#r={...this.#r,[e]:t},this.#o()),this.dispatchEvent(new h)};#F=e=>{"Space"!==e.code&&"Enter"!==e.code||(e.preventDefault(),e.target.click())};#x=e=>{e.preventDefault(),this.#i&&(this.dispatchEvent(new u(this.#r)),this.#o())};#w(e,a,r,i){return o`
      <label class="full-row label input-field-label-container">
        ${e}
        <input
          class="input-field"
          type="text"
          @input=${e=>{const t=e.target.value;this.#$(i,t)}}
          .value=${r}
          placeholder=${a}
          jslog=${n.textField().track({change:!0}).context(t.StringUtilities.toKebabCase(i))}
          />
      </label>
    `}#k(){const{platform:e,platformVersion:t}=this.#r;return o`
      <span class="full-row label">${c(l.platformLabel)}</span>
      <div class="full-row brand-row" aria-label=${c(l.platformProperties)} role="group">
        <input
          class="input-field half-row"
          type="text"
          @input=${e=>{const t=e.target.value;this.#$("platform",t)}}
          .value=${e}
          placeholder=${c(l.platformPlaceholder)}
          aria-label=${c(l.platformLabel)}
          jslog=${n.textField("platform").track({change:!0})}
        />
        <input
          class="input-field half-row"
          type="text"
          @input=${e=>{const t=e.target.value;this.#$("platformVersion",t)}}
          .value=${t}
          placeholder=${c(l.platformVersion)}
          aria-label=${c(l.platformVersion)}
          jslog=${n.textField("platform-version").track({change:!0})}
        />
      </div>
    `}#A(){const{model:e,mobile:t}=this.#r,a=this.#n?o`
      <label class="mobile-checkbox-container">
        <input type="checkbox" @input=${e=>{const t=e.target.checked;this.#$("mobile",t)}} .checked=${t}
          jslog=${n.toggle("mobile").track({click:!0})}
        />
        ${c(l.mobileCheckboxLabel)}
      </label>
    `:r.nothing;return o`
      <span class="full-row label">${c(l.deviceModel)}</span>
      <div class="full-row brand-row" aria-label=${c(l.deviceProperties)} role="group">
        <input
          class="input-field ${this.#n?"device-model-input":"full-row"}"
          type="text"
          @input=${e=>{const t=e.target.value;this.#$("model",t)}}
          .value=${e}
          placeholder=${c(l.deviceModel)}
          jslog=${n.textField("model").track({change:!0})}
        />
        ${a}
      </div>
    `}#D(){const{brands:e=[{brand:"",version:""}]}=this.#r,t=e.map((e,t)=>{const{brand:a,version:r}=e,i=()=>{this.#u(t)};return o`
        <div class="full-row brand-row" aria-label=${c(l.brandProperties)} role="group">
          <input
            class="input-field ua-brand-name-input"
            type="text"
            @input=${e=>{const a=e.target.value;this.#c(a,t,"brandName")}}
            .value=${a}
            id="ua-brand-${t+1}-input"
            placeholder=${c(l.brandName)}
            aria-label=${c(l.brandNameAriaLabel,{PH1:t+1})}
            jslog=${n.textField("brand-name").track({change:!0})}
          />
          <input
            class="input-field"
            type="text"
            @input=${e=>{const a=e.target.value;this.#c(a,t,"brandVersion")}}
            .value=${r}
            placeholder=${c(l.significantBrandVersionPlaceholder)}
            aria-label=${c(l.brandVersionAriaLabel,{PH1:t+1})}
            jslog=${n.textField("brand-version").track({change:!0})}
          />
          <devtools-icon name="bin" class="medium"
            title=${c(l.brandUserAgentDelete)}
            class="delete-icon"
            tabindex="0"
            role="button"
            @click=${i}
            @keypress=${e=>{"Space"!==e.code&&"Enter"!==e.code||(e.preventDefault(),i())}}
            aria-label=${c(l.brandUserAgentDelete)}
          >
          </devtools-icon>
        </div>
      `});return o`
      <span class="full-row label">${c(l.useragent)}</span>
      ${t}
      <div
        class="add-container full-row"
        role="button"
        tabindex="0"
        id="add-brand-button"
        aria-label=${c(l.addBrand)}
        @click=${this.#m}
        @keypress=${this.#b}
      >
        <devtools-icon
          aria-hidden="true" name="plus" class="medium">
        </devtools-icon>
        ${c(l.addBrand)}
      </div>
    `}#y(){const{fullVersionList:e=[{brand:"",version:""}]}=this.#r,t=e.map((e,t)=>{const{brand:a,version:r}=e,i=()=>{this.#p(t)};return o`
        <div
          class="full-row brand-row"
          aria-label=${c(l.brandProperties)}
          jslog=${n.section("full-version")}
          role="group">
          <input
            class="input-field fvl-brand-name-input"
            type="text"
            @input=${e=>{const a=e.target.value;this.#h(a,t,"brandName")}}
            .value=${a}
            id="fvl-brand-${t+1}-input"
            placeholder=${c(l.brandName)}
            aria-label=${c(l.brandNameAriaLabel,{PH1:t+1})}
            jslog=${n.textField("brand-name").track({change:!0})}
          />
          <input
            class="input-field"
            type="text"
            @input=${e=>{const a=e.target.value;this.#h(a,t,"brandVersion")}}
            .value=${r}
            placeholder=${c(l.brandVersionPlaceholder)}
            aria-label=${c(l.brandVersionAriaLabel,{PH1:t+1})}
            jslog=${n.textField("brand-version").track({change:!0})}
          />
          <devtools-icon name="bin" class="medium"
            title=${c(l.brandFullVersionListDelete)}
            class="delete-icon"
            tabindex="0"
            role="button"
            @click=${i}
            @keypress=${e=>{"Space"!==e.code&&"Enter"!==e.code||(e.preventDefault(),i())}}
            aria-label=${c(l.brandFullVersionListDelete)}
          >
          </devtools-icon>
        </div>
      `});return o`
      <span class="full-row label">${c(l.fullVersionList)}</span>
      ${t}
      <div
        class="add-container full-row"
        role="button"
        tabindex="0"
        id="add-fvl-brand-button"
        aria-label=${c(l.addBrand)}
        @click=${this.#f}
        @keypress=${this.#g}
      >
        <devtools-icon name="plus" class="medium"
          aria-hidden="true">
        </devtools-icon>
        ${c(l.addBrand)}
      </div>
    `}#C(){const e=m.map(e=>{const a=this.#r.formFactors?.includes(e)||!1,r=c(l[`formFactor${e}`]);return o`
        <label class="form-factor-checkbox-label">
          <input
            type="checkbox"
            .checked=${a}
            value=${e}
            jslog=${n.toggle(t.StringUtilities.toKebabCase(e)).track({click:!0})}
            @change=${t=>this.#v(e,t.target.checked)}
          />
          ${r}
        </label>
      `});return o`
      <span class="full-row label" jslog=${n.sectionHeader("form-factors")}>
        ${c(l.formFactorsTitle)}
      </span>
      <div class="full-row form-factors-checkbox-group" role="group" aria-label=${c(l.formFactorsGroupAriaLabel)}>
        ${e}
      </div>
    `}#o(){const{fullVersion:e,architecture:t}=this.#r,i=this.#D(),d=this.#y(),h=this.#w(c(l.fullBrowserVersion),c(l.fullBrowserVersionPlaceholder),e||"","fullVersion"),u=this.#C(),p=this.#k(),m=this.#w(c(l.architecture),c(l.architecturePlaceholder),t,"architecture"),b=this.#A(),f=this.#i?o`
      <devtools-button
        .variant=${"outlined"}
        .type=${"submit"}
      >
        ${c(l.update)}
      </devtools-button>
    `:r.nothing,g=o`
      <style>${a.checkboxStyles}</style>
      <style>${s}</style>
      <section class="root">
        <div class="tree-title">
          <div
            role=button
            @click=${this.#d}
            tabindex=${this.#a?"-1":"0"}
            @keydown=${this.#l}
            aria-expanded=${this.#t}
            aria-controls=form-container
            aria-disabled=${this.#a}
            aria-label=${c(l.title)}
            jslog=${n.toggleSubpane().track({click:!0})}>
            <devtools-icon name=triangle-right></devtools-icon>
            <devtools-icon name=triangle-down></devtools-icon>
            ${c(l.title)}
          </div>
          <devtools-icon tabindex=${this.#a?"-1":"0"} class=info-icon name=info aria-label=${c(l.userAgentClientHintsInfo)} title=${c(l.userAgentClientHintsInfo)}></devtools-icon>
          <x-link
           tabindex=${this.#a?"-1":"0"}
           href="https://web.dev/user-agent-client-hints/"
           target="_blank"
           class="link"
           @keypress=${this.#F}
           aria-label=${c(l.learnMore)}
           jslog=${n.link("learn-more").track({click:!0})}
          >
            ${c(l.learnMore)}
          </x-link>
        </div>
        <form
          id="form-container"
          class="form-container ${this.#t?"":"hide-container"}"
          @submit=${this.#x}
        >
          ${i}
          <hr class="section-separator">
          ${d}
          <hr class="section-separator">
          ${h}
          <hr class="section-separator">
          ${u}
          <hr class="section-separator">
          ${p}
          <hr class="section-separator">
          ${m}
          <hr class="section-separator">
          ${b}
          ${f}
        </form>
        <div aria-live="polite" aria-label=${this.#s}></div>
      </section>
    `;r.render(g,this.#e,{host:this})}validate=()=>{for(const[e,t]of Object.entries(this.#r))if("brands"===e||"fullVersionList"===e){const e=this.#r.brands?.every(({brand:e,version:t})=>{const a=i.UserAgentMetadata.validateAsStructuredHeadersString(e,c(l.notRepresentable)),r=i.UserAgentMetadata.validateAsStructuredHeadersString(t,c(l.notRepresentable));return a.valid&&r.valid});if(!e)return{valid:!1,errorMessage:c(l.notRepresentable)}}else if("formFactors"===e){const e=t;if(e)for(const t of e){if(!m.includes(t))return{valid:!1,errorMessage:c(l.notRepresentable)+` (Invalid form factor: ${t})`};const e=i.UserAgentMetadata.validateAsStructuredHeadersString(t,c(l.notRepresentable));if(!e.valid)return e}}else{const e=i.UserAgentMetadata.validateAsStructuredHeadersString(t,c(l.notRepresentable));if(!e.valid)return e}return{valid:!0}}}customElements.define("devtools-user-agent-client-hints-form",b);var f=Object.freeze({__proto__:null,ALL_PROTOCOL_FORM_FACTORS:m,ClientHintsChangeEvent:h,ClientHintsSubmitEvent:u,UserAgentClientHintsForm:b});export{f as UserAgentClientHintsForm};
//# sourceMappingURL=components.js.map
