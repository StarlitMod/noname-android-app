import"../../../ui/components/icon_button/icon_button.js";import*as e from"../../../core/i18n/i18n.js";import*as t from"../../../ui/lit/lit.js";import{render as s,html as i,nothing as r}from"../../../ui/lit/lit.js";import*as n from"../../../ui/visual_logging/visual_logging.js";import*as o from"../../../ui/legacy/legacy.js";import*as a from"../../../core/platform/platform.js";import"../../../ui/components/buttons/buttons.js";import*as d from"../../../core/common/common.js";var l=`.highlight-chip-list{min-height:20px;display:flex;flex-wrap:wrap;justify-content:left;align-items:center;background-color:var(--sys-color-cdt-base-container);margin:8px 0;gap:8px;row-gap:6px}.highlight-chip{background:var(--sys-color-cdt-base-container);border:1px solid var(--sys-color-divider);height:18px;border-radius:4px;flex:0 0 auto;max-width:250px;position:relative;padding:0 6px}.highlight-chip:hover{background-color:var(--sys-color-state-hover-on-subtle)}.delete-highlight-container{display:none;height:100%;position:absolute;right:0;top:0;border-radius:4px;width:24px;align-items:center;justify-content:center}.delete-highlight-button{cursor:pointer;width:13px;height:13px;border:none;background-color:transparent;display:flex;align-items:center;justify-content:center}.delete-highlight-button:hover{background-color:var(--sys-color-state-hover-on-subtle);border-radius:50%}.jump-to-highlight-button{cursor:pointer;padding:0;border:none;background:none;height:100%;align-items:center;max-width:100%;overflow:hidden}.delete-highlight-button devtools-icon{width:13px;height:13px;display:flex;align-items:center;justify-content:center;border-radius:50%}.source-code{font-family:var(--source-code-font-family);font-size:var(--source-code-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--sys-color-on-surface)}.value{color:var(--sys-color-token-tag)}.separator{white-space:pre;flex-shrink:0}.highlight-chip.focused{outline:2px solid var(--sys-color-state-focus-ring);outline-offset:2px}.highlight-chip:hover > .delete-highlight-container{display:flex;background:linear-gradient(90deg,transparent 0%,rgb(241 243 244) 25%)}.highlight-chip.focused:hover > .delete-highlight-container{background:linear-gradient(90deg,transparent 0%,rgb(231 241 253) 25%)}:host-context(.theme-with-dark-background) .highlight-chip:hover > .delete-highlight-container{display:flex;background:linear-gradient(90deg,transparent 0%,rgb(41 42 45) 25%)}:host-context(.theme-with-dark-background) .highlight-chip.focused:hover > .delete-highlight-container{background:linear-gradient(90deg,transparent 0%,rgb(48 55 68) 25%)}\n/*# sourceURL=${import.meta.resolve("./linearMemoryHighlightChipList.css")} */`;const h={jumpToAddress:"Jump to this memory",deleteHighlight:"Stop highlighting this memory"},c=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/LinearMemoryHighlightChipList.ts",h),g=e.i18n.getLocalizedString.bind(void 0,c),{render:u,html:p}=t;class m extends Event{static eventName="deletememoryhighlight";data;constructor(e){super(m.eventName,{bubbles:!0,composed:!0}),this.data=e}}class y extends Event{static eventName="jumptohighlightedmemory";data;constructor(e){super(y.eventName),this.data=e}}class v extends HTMLElement{#e=this.attachShadow({mode:"open"});#t=[];#s;set data(e){this.#t=e.highlightInfos,this.#s=e.focusedMemoryHighlight,this.#i()}#i(){const e=[];for(const t of this.#t)e.push(this.#r(t));const t=p`
            <style>${l}</style>
            <div class="highlight-chip-list">
              ${e}
            </div>
        `;u(t,this.#e,{host:this})}#r(e){const s=e.name||"<anonymous>",i=e.type,r={focused:e===this.#s,"highlight-chip":!0};return p`
      <div class=${t.Directives.classMap(r)}>
        <button class="jump-to-highlight-button" title=${g(h.jumpToAddress)}
            jslog=${n.action("linear-memory-inspector.jump-to-highlight").track({click:!0})}
            @click=${()=>this.#n(e.startAddress)}>
          <span class="source-code">
            <span class="value">${s}</span>
            <span class="separator">: </span>
            <span>${i}</span>
          </span>
        </button>
        <div class="delete-highlight-container">
          <button class="delete-highlight-button" title=${g(h.deleteHighlight)}
              jslog=${n.action("linear-memory-inspector.delete-highlight").track({click:!0})}
              @click=${()=>this.#o(e)}>
            <devtools-icon name="cross" class="medium">
            </devtools-icon>
          </button>
        </div>
      </div>
    `}#n(e){this.dispatchEvent(new y(e))}#o(e){this.dispatchEvent(new m(e))}}customElements.define("devtools-linear-memory-highlight-chip-list",v);var f=Object.freeze({__proto__:null,DeleteMemoryHighlightEvent:m,JumpToHighlightedMemoryEvent:y,LinearMemoryHighlightChipList:v}),b=`:host{flex:auto;display:flex}.value-types{width:100%;display:grid;grid-template-columns:auto auto 1fr;gap:4px 24px;min-height:24px;overflow:hidden;padding:2px 12px;align-items:baseline;justify-content:start}.value-type-cell{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:flex;flex-direction:column;min-height:24px}.value-type-value-with-link{display:flex;align-items:center}.value-type-cell-no-mode{grid-column:1/3}.jump-to-button{display:flex;width:20px;height:20px;border:none;padding:0;outline:none;justify-content:center;align-items:center;cursor:pointer;background-color:var(--sys-color-cdt-base-container)}.signed-divider{width:1px;height:15px;background-color:var(--sys-color-divider);margin:0 4px}.selectable-text{user-select:text}.selectable-text::selection{background-color:var(--sys-color-tonal-container);color:currentcolor}\n/*# sourceURL=${import.meta.resolve("./valueInterpreterDisplay.css")} */`;const w={notApplicable:"N/A"},x=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/ValueInterpreterDisplayUtils.ts",w),$=e.i18n.getLocalizedString.bind(void 0,x);function M(){return new Map(I)}const I=new Map([["Integer 8-bit","dec"],["Integer 16-bit","dec"],["Integer 32-bit","dec"],["Integer 64-bit","dec"],["Float 32-bit","dec"],["Float 64-bit","dec"],["Pointer 32-bit","hex"],["Pointer 64-bit","hex"]]),T=["dec","hex","oct","sci"];function k(t){return e.i18n.lockedString(t)}function S(e,t){switch(e){case"Integer 8-bit":case"Integer 16-bit":case"Integer 32-bit":case"Integer 64-bit":return"dec"===t||"hex"===t||"oct"===t;case"Float 32-bit":case"Float 64-bit":return"sci"===t||"dec"===t;case"Pointer 32-bit":case"Pointer 64-bit":return"hex"===t;default:return a.assertNever(e,`Unknown value type: ${e}`)}}function E(e){switch(e){case"Integer 8-bit":case"Integer 16-bit":case"Integer 32-bit":case"Integer 64-bit":case"Float 32-bit":case"Float 64-bit":return!0;default:return!1}}function A(e,t,s){if(!L(e))return console.error(`Requesting address of a non-pointer type: ${e}.\n`),NaN;try{const i=new DataView(t),r="Little Endian"===s;return"Pointer 32-bit"===e?i.getUint32(0,r):i.getBigUint64(0,r)}catch{return NaN}}function L(e){return"Pointer 32-bit"===e||"Pointer 64-bit"===e}function R(e){if(!e.mode)return console.error(`No known way of showing value for ${e.type}`),$(w.notApplicable);const t=new DataView(e.buffer),s="Little Endian"===e.endianness;let i;try{switch(e.type){case"Integer 8-bit":return i=e.signed?t.getInt8(0):t.getUint8(0),H(i,e.mode);case"Integer 16-bit":return i=e.signed?t.getInt16(0,s):t.getUint16(0,s),H(i,e.mode);case"Integer 32-bit":return i=e.signed?t.getInt32(0,s):t.getUint32(0,s),H(i,e.mode);case"Integer 64-bit":return i=e.signed?t.getBigInt64(0,s):t.getBigUint64(0,s),H(i,e.mode);case"Float 32-bit":return i=t.getFloat32(0,s),C(i,e.mode);case"Float 64-bit":return i=t.getFloat64(0,s),C(i,e.mode);case"Pointer 32-bit":return i=t.getUint32(0,s),H(i,"hex");case"Pointer 64-bit":return i=t.getBigUint64(0,s),H(i,"hex");default:return a.assertNever(e.type,`Unknown value type: ${e.type}`)}}catch{return $(w.notApplicable)}}function C(e,t){switch(t){case"dec":return e.toFixed(2).toString();case"sci":return e.toExponential(2).toString();default:throw new Error(`Unknown mode for floats: ${t}.`)}}function H(e,t){switch(t){case"dec":return e.toString();case"hex":return e<0?$(w.notApplicable):"0x"+e.toString(16).toUpperCase();case"oct":return e<0?$(w.notApplicable):e.toString(8);default:throw new Error(`Unknown mode for integers: ${t}.`)}}var N=Object.freeze({__proto__:null,VALUE_INTEPRETER_MAX_NUM_BYTES:8,VALUE_TYPE_MODE_LIST:T,format:R,formatFloat:C,formatInteger:H,getDefaultValueTypeMapping:M,getPointerAddress:A,isNumber:E,isPointer:L,isValidMode:S,valueTypeToLocalizedString:k});const j={unsignedValue:"`Unsigned` value",changeValueTypeMode:"Change mode",signedValue:"`Signed` value",jumpToPointer:"Jump to address",addressOutOfRange:"Address out of memory range"},B=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/ValueInterpreterDisplay.ts",j),_=e.i18n.getLocalizedString.bind(void 0,B),{render:U,html:O}=t,V=Array.from(M().keys());class z extends Event{static eventName="valuetypemodechanged";data;constructor(e,t){super(z.eventName,{composed:!0}),this.data={type:e,mode:t}}}class P extends Event{static eventName="jumptopointeraddress";data;constructor(e){super(P.eventName,{composed:!0}),this.data=e}}class D extends HTMLElement{#e=this.attachShadow({mode:"open"});#a="Little Endian";#d=new ArrayBuffer(0);#l=new Set;#h=M();#c=0;set data(e){this.#d=e.buffer,this.#a=e.endianness,this.#l=e.valueTypes,this.#c=e.memoryLength,e.valueTypeModes&&e.valueTypeModes.forEach((e,t)=>{S(t,e)&&this.#h.set(t,e)}),this.#i()}#i(){U(O`
      <style>${o.inspectorCommonStyles}</style>
      <style>${b}</style>
      <div class="value-types">
        ${V.map(e=>this.#l.has(e)?this.#g(e):"")}
      </div>
    `,this.#e,{host:this})}#g(e){if(E(e))return this.#u(e);if(L(e))return this.#p(e);throw new Error(`No known way to format ${e}`)}#p(t){const s=this.#m({type:t,signed:!1}),i=A(t,this.#d,this.#a),r=Number.isNaN(i)||BigInt(i)>=BigInt(this.#c),o=_(r?j.addressOutOfRange:j.jumpToPointer),a=r?"var(--icon-default)":"var(--icon-link)";return O`
      <span class="value-type-cell-no-mode value-type-cell selectable-text">${e.i18n.lockedString(t)}</span>
      <div class="value-type-cell">
        <div class="value-type-value-with-link" data-value="true">
        <span class="selectable-text">${s}</span>
          ${O`
              <button class="jump-to-button" data-jump="true" title=${o} ?disabled=${r}
                jslog=${n.action("linear-memory-inspector.jump-to-address").track({click:!0})}
                @click=${this.#y.bind(this,Number(i))}>
                <devtools-icon name="open-externally" class="medium" style="color: ${a}">
                </devtools-icon>
              </button>`}
        </div>
      </div>
    `}#y(e){this.dispatchEvent(new P(e))}#u(t){return O`
      <span class="value-type-cell selectable-text">${e.i18n.lockedString(t)}</span>
      <div>
        <select title=${_(j.changeValueTypeMode)}
          data-mode-settings="true"
          jslog=${n.dropDown("linear-memory-inspector.value-type-mode").track({change:!0})}
          @change=${this.#v.bind(this,t)}>
            ${T.filter(e=>S(t,e)).map(s=>O`
                <option value=${s} .selected=${this.#h.get(t)===s}
                        jslog=${n.item(s).track({click:!0})}>${e.i18n.lockedString(s)}
                </option>`)}
        </select>
      </div>
      ${this.#f(t)}
    `}#f(e){const t=this.#m({type:e,signed:!1}),s=this.#m({type:e,signed:!0}),i=this.#h.get(e),r=s!==t&&"hex"!==i&&"oct"!==i,n=O`<span class="value-type-cell selectable-text"  title=${_(j.unsignedValue)} data-value="true">${t}</span>`;if(!r)return n;const o="Integer 32-bit"===e||"Integer 64-bit"===e,a=O`<span class="selectable-text" data-value="true" title=${_(j.signedValue)}>${s}</span>`;return o?O`
        <div class="value-type-cell">
          ${n}
          ${a}
        </div>
        `:O`
      <div class="value-type-cell" style="flex-direction: row;">
        ${n}
        <span class="signed-divider"></span>
        ${a}
      </div>
    `}#v(e,t){t.preventDefault();const s=t.target.value;this.dispatchEvent(new z(e,s))}#m(e){const t=this.#h.get(e.type);return R({buffer:this.#d,type:e.type,endianness:this.#a,signed:e.signed||!1,mode:t})}}customElements.define("devtools-linear-memory-inspector-interpreter-display",D);var q=Object.freeze({__proto__:null,JumpToPointerAddressEvent:P,ValueInterpreterDisplay:D,ValueTypeModeChangedEvent:z}),F=`:host{flex:auto;display:flex;min-height:20px}.settings{display:flex;flex-wrap:wrap;margin:0 12px 12px;gap:15px 45px}.value-types-selection{display:flex;flex-direction:column}.group{font-weight:bold;margin-bottom:var(--sys-size-6)}\n/*# sourceURL=${import.meta.resolve("./valueInterpreterSettings.css")} */`;const{render:G,html:J}=t,K={otherGroup:"Other"},W=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/ValueInterpreterSettings.ts",K),X=e.i18n.getLocalizedString.bind(void 0,W),Y=new Map([["Integer",["Integer 8-bit","Integer 16-bit","Integer 32-bit","Integer 64-bit"]],["Floating point",["Float 32-bit","Float 64-bit"]],["Other",["Pointer 32-bit","Pointer 64-bit"]]]);class Q extends Event{static eventName="typetoggle";data;constructor(e,t){super(Q.eventName),this.data={type:e,checked:t}}}class Z extends HTMLElement{#e=this.attachShadow({mode:"open"});#l=new Set;set data(e){this.#l=e.valueTypes,this.#i()}#i(){G(J`
      <style>${F}</style>
      <div class="settings" jslog=${n.pane("settings")}>
       ${[...Y.keys()].map(e=>J`
          <div class="value-types-selection">
            <span class="group">${function(e){return"Other"===e?X(K.otherGroup):e}(e)}</span>
            ${this.#b(e)}
          </div>
        `)}
      </div>
      `,this.#e,{host:this})}#b(e){const t=Y.get(e);if(!t)throw new Error(`Unknown group ${e}`);return J`
      ${t.map(e=>J`
            <devtools-checkbox
              title=${k(e)}
              ?checked=${this.#l.has(e)}
              @change=${t=>this.#w(e,t)} jslog=${n.toggle().track({change:!0}).context(a.StringUtilities.toKebabCase(e))}
              >${k(e)}</devtools-checkbox>
     `)}`}#w(e,t){const s=t.target;this.dispatchEvent(new Q(e,s.checked))}}customElements.define("devtools-linear-memory-inspector-interpreter-settings",Z);var ee=Object.freeze({__proto__:null,TypeToggleEvent:Q,ValueInterpreterSettings:Z}),te=`:host{flex:auto;display:flex}.value-interpreter{border:1px solid var(--sys-color-divider);background-color:var(--sys-color-cdt-base-container);overflow:hidden;width:400px}.settings-toolbar{min-height:26px;display:flex;flex-wrap:nowrap;justify-content:space-between;padding-left:var(--sys-size-3);padding-right:var(--sys-size-3);align-items:center}.settings-toolbar-button{padding:0;width:20px;height:20px;border:none;outline:none;background-color:transparent}.settings-toolbar-button.active devtools-icon{color:var(--icon-toggled)}.divider{display:block;height:1px;margin-bottom:12px;background-color:var(--sys-color-divider)}\n/*# sourceURL=${import.meta.resolve("./linearMemoryValueInterpreter.css")} */`;const se={toggleValueTypeSettings:"Toggle value type settings",changeEndianness:"Change `Endianness`"},ie=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/LinearMemoryValueInterpreter.ts",se),re=e.i18n.getLocalizedString.bind(void 0,ie),{render:ne,html:oe}=t;class ae extends Event{static eventName="endiannesschanged";data;constructor(e){super(ae.eventName),this.data=e}}class de extends Event{static eventName="valuetypetoggled";data;constructor(e,t){super(de.eventName),this.data={type:e,checked:t}}}class le extends HTMLElement{#e=this.attachShadow({mode:"open"});#a="Little Endian";#d=new ArrayBuffer(0);#l=new Set;#h=new Map;#c=0;#x=!1;set data(e){this.#a=e.endianness,this.#d=e.value,this.#l=e.valueTypes,this.#h=e.valueTypeModes||new Map,this.#c=e.memoryLength,this.#i()}#i(){ne(oe`
      <style>${o.inspectorCommonStyles}</style>
      <style>${te}</style>
      <div class="value-interpreter">
        <div class="settings-toolbar">
          ${this.#$()}
          <devtools-button data-settings="true" class="toolbar-button ${this.#x?"":"disabled"}"
              title=${re(se.toggleValueTypeSettings)} @click=${this.#M}
              jslog=${n.toggleSubpane("linear-memory-inspector.toggle-value-settings").track({click:!0})}
              .iconName=${"gear"}
              .toggledIconName=${"gear-filled"}
              .toggleType=${"primary-toggle"}
              .variant=${"icon_toggle"}
          ></devtools-button>
        </div>
        <span class="divider"></span>
        <div>
          ${this.#x?oe`
              <devtools-linear-memory-inspector-interpreter-settings
                .data=${{valueTypes:this.#l}}
                @typetoggle=${this.#w}>
              </devtools-linear-memory-inspector-interpreter-settings>`:oe`
              <devtools-linear-memory-inspector-interpreter-display
                .data=${{buffer:this.#d,valueTypes:this.#l,endianness:this.#a,valueTypeModes:this.#h,memoryLength:this.#c}}>
              </devtools-linear-memory-inspector-interpreter-display>`}
        </div>
      </div>
    `,this.#e,{host:this})}#I(e){e.preventDefault();const t=e.target.value;this.dispatchEvent(new ae(t))}#$(){const t=this.#I.bind(this);return oe`
    <label data-endianness-setting="true" title=${re(se.changeEndianness)}>
      <select
        jslog=${n.dropDown("linear-memory-inspector.endianess").track({change:!0})}
        style="border: none;"
        data-endianness="true" @change=${t}>
        ${["Little Endian","Big Endian"].map(t=>oe`<option value=${t} .selected=${this.#a===t}
            jslog=${n.item(a.StringUtilities.toKebabCase(t)).track({click:!0})}>${e.i18n.lockedString(t)}</option>`)}
      </select>
    </label>
    `}#M(){this.#x=!this.#x,this.#i()}#w(e){this.dispatchEvent(new de(e.data.type,e.data.checked))}}customElements.define("devtools-linear-memory-inspector-interpreter",le);var he=Object.freeze({__proto__:null,EndiannessChangedEvent:ae,LinearMemoryValueInterpreter:le,ValueTypeToggledEvent:de});const ce=/^0x[a-fA-F0-9]+$/,ge=/^0$|[1-9]\d*$/;function ue(e){const t=e.number.toString(16).padStart(e.pad,"0").toUpperCase();return e.prefix?"0x"+t:t}function pe(e){return ue({number:e,pad:8,prefix:!0})}function me(e){const t=e.match(ce),s=e.match(ge);let i;return t&&t[0].length===e.length?i=parseInt(e,16):s&&s[0].length===e.length&&(i=parseInt(e,10)),i}var ye=Object.freeze({__proto__:null,DECIMAL_REGEXP:ge,HEXADECIMAL_REGEXP:ce,formatAddress:pe,parseAddress:me,toHexString:ue}),ve=`:host{flex:auto;display:flex;min-height:20px}.view{overflow:hidden;text-overflow:ellipsis;box-sizing:border-box;background:var(--sys-color-cdt-base-container);outline:none}.row{display:flex;height:20px;align-items:center}.cell{text-align:center;border:1px solid transparent;border-radius:2px;&.focused-area{background-color:var(--sys-color-tonal-container);color:var(--sys-color-on-tonal-container)}&.selected{border-color:var(--sys-color-state-focus-ring);color:var(--sys-color-on-tonal-container);background-color:var(--sys-color-state-focus-select)}}.byte-cell{min-width:21px;color:var(--sys-color-on-surface)}.byte-group-margin{margin-left:var(--byte-group-margin)}.text-cell{min-width:14px;color:var(--sys-color-on-surface-subtle)}.address{color:var(--sys-color-state-disabled)}.address.selected{font-weight:bold;color:var(--sys-color-on-surface)}.divider{width:1px;height:inherit;background-color:var(--sys-color-divider);margin:0 4px}.highlight-area{background-color:var(--sys-color-surface-variant)}\n/*# sourceURL=${import.meta.resolve("./linearMemoryViewer.css")} */`;const{render:fe,html:be}=t;class we extends Event{static eventName="byteselected";data;constructor(e){super(we.eventName),this.data=e}}class xe extends Event{static eventName="resize";data;constructor(e){super(xe.eventName),this.data=e}}class $e extends HTMLElement{#e=this.attachShadow({mode:"open"});#T=new ResizeObserver(()=>this.#k());#S=!1;#E=new Uint8Array;#A=0;#L=0;#R;#s;#C=1;#H=4;#N=!0;#j=void 0;set data(e){if(e.address<e.memoryOffset||e.address>e.memoryOffset+e.memory.length||e.address<0)throw new Error("Address is out of bounds.");if(e.memoryOffset<0)throw new Error("Memory offset has to be greater or equal to zero.");this.#E=e.memory,this.#A=e.address,this.#R=e.highlightInfo,this.#s=e.focusedMemoryHighlight,this.#L=e.memoryOffset,this.#N=e.focus,this.#B()}connectedCallback(){this.style.setProperty("--byte-group-margin","8px")}disconnectedCallback(){this.#S=!1,this.#T.disconnect()}#B(){this.#_(),this.#i(),this.#U(),this.#O()}#U(){if(this.#N){const e=this.#e.querySelector(".view");e&&e.focus()}}#k(){this.#B(),this.dispatchEvent(new xe(this.#H*this.#C))}#_(){if(0===this.clientWidth||0===this.clientHeight||!this.shadowRoot)return this.#H=4,void(this.#C=1);const e=this.shadowRoot.querySelector(".byte-cell"),t=this.shadowRoot.querySelector(".text-cell"),s=this.shadowRoot.querySelector(".divider"),i=this.shadowRoot.querySelector(".row"),r=this.shadowRoot.querySelector(".address");if(!(e&&t&&s&&i&&r))return this.#H=4,void(this.#C=1);const n=4*(e.getBoundingClientRect().width+t.getBoundingClientRect().width)+8,o=s.getBoundingClientRect().width,a=e.getBoundingClientRect().left-r.getBoundingClientRect().left,d=this.clientWidth-1-a-o;if(d<n)return this.#H=4,void(this.#C=1);this.#H=4*Math.floor(d/n),this.#C=Math.floor(this.clientHeight/i.clientHeight)}#O(){this.#T&&!this.#S&&(this.#T.observe(this),this.#S=!0)}#i(){const e=n.section().track({keydown:"ArrowUp|ArrowDown|ArrowLeft|ArrowRight|PageUp|PageDown"}).context("linear-memory-inspector.viewer");fe(be`
      <style>${ve}</style>
      <div class="view" tabindex="0" @keydown=${this.#V} jslog=${e}>
        ${this.#z()}
      </div>
      `,this.#e,{host:this})}#V(e){const t=e;let s;"ArrowUp"===t.code?s=this.#A-this.#H:"ArrowDown"===t.code?s=this.#A+this.#H:"ArrowLeft"===t.code?s=this.#A-1:"ArrowRight"===t.code?s=this.#A+1:"PageUp"===t.code?s=this.#A-this.#H*this.#C:"PageDown"===t.code&&(s=this.#A+this.#H*this.#C),void 0!==s&&s!==this.#j&&(this.#j=s,this.dispatchEvent(new we(s)))}#z(){const e=[];for(let t=0;t<this.#C;++t)e.push(this.#P(t));return be`${e}`}#P(e){const{startIndex:s,endIndex:i}={startIndex:e*this.#H,endIndex:(e+1)*this.#H},r={address:!0,selected:Math.floor((this.#A-this.#L)/this.#H)===e};return be`
    <div class="row">
      <span class=${t.Directives.classMap(r)}>${ue({number:s+this.#L,pad:8,prefix:!1})}</span>
      <span class="divider"></span>
      ${this.#D(s,i)}
      <span class="divider"></span>
      ${this.#q(s,i)}
    </div>
    `}#D(e,s){const i=[];for(let r=e;r<s;++r){const s=r+this.#L,o={cell:!0,"byte-cell":!0,"byte-group-margin":r!==e&&(r-e)%4==0,selected:r===this.#A-this.#L,"highlight-area":this.#F(s),"focused-area":this.#G(s)},a=r<this.#E.length,d=a?be`${ue({number:this.#E[r],pad:2,prefix:!1})}`:"",l=a?this.#J.bind(this,s):"",h=n.tableCell("linear-memory-inspector.byte-cell").track({click:!0});i.push(be`<span class=${t.Directives.classMap(o)} @click=${l} jslog=${h}>${d}</span>`)}return be`${i}`}#q(e,s){const i=[];for(let r=e;r<s;++r){const e=r+this.#L,s=this.#F(e),o=this.#G(e),a={cell:!0,"text-cell":!0,selected:this.#A-this.#L===r,"highlight-area":s,"focused-area":o},d=r<this.#E.length,l=d?be`${this.#K(this.#E[r])}`:"",h=d?this.#J.bind(this,r+this.#L):"",c=n.tableCell("linear-memory-inspector.text-cell").track({click:!0});i.push(be`<span class=${t.Directives.classMap(a)} @click=${h} jslog=${c}>${l}</span>`)}return be`${i}`}#K(e){return e>=20&&e<=127?String.fromCharCode(e):"."}#J(e){this.dispatchEvent(new we(e))}#F(e){return void 0!==this.#R&&(this.#R.startAddress<=e&&e<this.#R.startAddress+this.#R.size)}#G(e){return!!this.#s&&(this.#s.startAddress<=e&&e<this.#s.startAddress+this.#s.size)}}customElements.define("devtools-linear-memory-inspector-viewer",$e);var Me=Object.freeze({__proto__:null,ByteSelectedEvent:we,LinearMemoryViewer:$e,ResizeEvent:xe}),Ie=`@scope to (devtools-widget > *){:scope{flex:auto;display:flex}*{min-width:unset;box-sizing:content-box}.view{width:100%;display:flex;flex:1;flex-direction:column;font-family:var(--monospace-font-family);font-size:var(--monospace-font-size);padding:9px 12px 9px 7px}devtools-linear-memory-inspector-viewer{justify-content:center}devtools-linear-memory-inspector-navigator + devtools-linear-memory-inspector-viewer{margin-top:12px}.value-interpreter{display:flex}}\n/*# sourceURL=${import.meta.resolve("./linearMemoryInspector.css")} */`;const Te={addressHasToBeANumberBetweenSAnd:"Address has to be a number between {PH1} and {PH2}"},ke=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/LinearMemoryInspector.ts",Te),Se=e.i18n.getLocalizedString.bind(void 0,ke);class Ee{#A=0;#W;constructor(e,t){if(e<0)throw new Error("Address should be a greater or equal to zero");this.#A=e,this.#W=t}valid(){return!0}reveal(){this.#W(this.#A)}}const Ae=(e,t,n)=>{const o="Submitted"===e.currentNavigatorMode?pe(e.address):e.currentNavigatorAddressLine,a=Re(o,e.outerMemoryLength),d=Se(Te.addressHasToBeANumberBetweenSAnd,{PH1:pe(0),PH2:pe(e.outerMemoryLength)}),l=a?void 0:d,h=e.highlightInfo?[e.highlightInfo]:[],c=function(e,t){let s;for(const i of e)i.startAddress<=t&&t<i.startAddress+i.size&&(s?i.size<s.size&&(s=i):s=i);return s}(h,e.address);s(i`
    <style>${Ie}</style>
    <div class="view">
      <devtools-linear-memory-inspector-navigator
        .data=${{address:o,valid:a,mode:e.currentNavigatorMode,error:l,canGoBackInHistory:e.canGoBackInHistory,canGoForwardInHistory:e.canGoForwardInHistory}}
        @refreshrequested=${e.onRefreshRequest}
        @addressinputchanged=${e.onAddressChange}
        @pagenavigation=${e.onNavigatePage}
        @historynavigation=${e.onNavigateHistory}></devtools-linear-memory-inspector-navigator>
        <devtools-linear-memory-highlight-chip-list
        .data=${{highlightInfos:h,focusedMemoryHighlight:c}}
        @jumptohighlightedmemory=${e.onJumpToAddress}
        @deletememoryhighlight=${e.onDeleteMemoryHighlight}>
        </devtools-linear-memory-highlight-chip-list>
      <devtools-linear-memory-inspector-viewer
        .data=${{memory:e.memorySlice,address:e.address,memoryOffset:e.viewerStart,focus:"Submitted"===e.currentNavigatorMode,highlightInfo:e.highlightInfo,focusedMemoryHighlight:c}}
        @byteselected=${e.onByteSelected}
        @resize=${e.onResize}>
      </devtools-linear-memory-inspector-viewer>
    </div>
    ${e.hideValueInspector?r:i`
    <div class="value-interpreter">
      <devtools-linear-memory-inspector-interpreter
        .data=${{value:e.memory.slice(e.address-e.memoryOffset,e.address+8).buffer,valueTypes:e.valueTypes,valueTypeModes:e.valueTypeModes,endianness:e.endianness,memoryLength:e.outerMemoryLength}}
        @valuetypetoggled=${e.onValueTypeToggled}
        @valuetypemodechanged=${e.onValueTypeModeChanged}
        @endiannesschanged=${e.onEndiannessChanged}
        @jumptopointeraddress=${e.onJumpToAddress}
        >
      </devtools-linear-memory-inspector-interpreter/>
    </div>`}
    `,n)};function Le(e,t,s){const i=Math.floor(e/t)*t;return{start:i,end:Math.min(i+t,s)}}function Re(e,t){const s=me(e);return void 0!==s&&s>=0&&s<t}class Ce extends(d.ObjectWrapper.eventMixin(o.Widget.Widget)){#X=new d.SimpleHistoryManager.SimpleHistoryManager(10);#E=new Uint8Array;#L=0;#Y=0;#A=-1;#R;#Q="Submitted";#Z=`${this.#A}`;#ee=4;#te=M();#l=new Set(this.#te.keys());#a="Little Endian";#se=!1;#ie;constructor(e,t){super(e),this.#ie=t??Ae}set memory(e){this.#E=e,this.requestUpdate()}set memoryOffset(e){this.#L=e,this.requestUpdate()}set outerMemoryLength(e){this.#Y=e,this.requestUpdate()}set highlightInfo(e){this.#R=e,this.requestUpdate()}set valueTypeModes(e){this.#te=e,this.requestUpdate()}set valueTypes(e){this.#l=e,this.requestUpdate()}set endianness(e){this.#a=e,this.requestUpdate()}set hideValueInspector(e){this.#se=e,this.requestUpdate()}get hideValueInspector(){return this.#se}performUpdate(){const{start:e,end:t}=Le(this.#A,this.#ee,this.#Y);if(e<this.#L||t>this.#L+this.#E.length)return void this.dispatchEventToListeners("MemoryRequest",{start:e,end:t,address:this.#A});if(this.#A<this.#L||this.#A>this.#L+this.#E.length||this.#A<0)throw new Error("Address is out of bounds.");if(this.#R){if(this.#R.size<0)throw this.#R=void 0,new Error("Object size has to be greater than or equal to zero");if(this.#R.startAddress<0||this.#R.startAddress>=this.#Y)throw this.#R=void 0,new Error("Object start address is out of bounds.")}const s={memory:this.#E,address:this.#A,memoryOffset:this.#L,outerMemoryLength:this.#Y,valueTypes:this.#l,valueTypeModes:this.#te,endianness:this.#a,highlightInfo:this.#R,hideValueInspector:this.#se,currentNavigatorMode:this.#Q,currentNavigatorAddressLine:this.#Z,canGoBackInHistory:this.#X.canRollback(),canGoForwardInHistory:this.#X.canRollover(),onRefreshRequest:this.#re.bind(this),onAddressChange:this.#ne.bind(this),onNavigatePage:this.#oe.bind(this),onNavigateHistory:this.#ae.bind(this),onJumpToAddress:this.#de.bind(this),onDeleteMemoryHighlight:this.#le.bind(this),onByteSelected:this.#he.bind(this),onResize:this.#k.bind(this),onValueTypeToggled:this.#ce.bind(this),onValueTypeModeChanged:this.#ge.bind(this),onEndiannessChanged:this.#ue.bind(this),memorySlice:this.#E.slice(e-this.#L,t-this.#L),viewerStart:e};this.#ie(s,{},this.contentElement)}#de(e){e.stopPropagation(),this.#Q="Submitted";const t=Math.max(0,Math.min(e.data,this.#Y-1));this.#pe(t)}#le(e){e.stopPropagation(),this.dispatchEventToListeners("DeleteMemoryHighlight",e.data)}#re(){const{start:e,end:t}=Le(this.#A,this.#ee,this.#Y);this.dispatchEventToListeners("MemoryRequest",{start:e,end:t,address:this.#A})}#he(e){this.#Q="Submitted";const t=Math.max(0,Math.min(e.data,this.#Y-1));this.#pe(t)}#me(){return{valueTypes:this.#l,modes:this.#te,endianness:this.#a}}#ue(e){this.#a=e.data,this.dispatchEventToListeners("SettingsChanged",this.#me()),this.requestUpdate()}#ne(e){const{address:t,mode:s}=e.data,i=Re(t,this.#Y),r=me(t);if(this.#Z=t,void 0!==r&&i)return this.#Q=s,void this.#pe(r);this.#Q="Submitted"!==s||i?"Edit":"InvalidSubmit",this.requestUpdate()}#ce(e){const{type:t,checked:s}=e.data;s?this.#l.add(t):this.#l.delete(t),this.dispatchEventToListeners("SettingsChanged",this.#me()),this.requestUpdate()}#ge(e){e.stopImmediatePropagation();const{type:t,mode:s}=e.data;this.#te.set(t,s),this.dispatchEventToListeners("SettingsChanged",this.#me()),this.requestUpdate()}#ae(e){return"Forward"===e.data?this.#X.rollover():this.#X.rollback()}#oe(e){const t="Forward"===e.data?this.#A+this.#ee:this.#A-this.#ee,s=Math.max(0,Math.min(t,this.#Y-1));this.#pe(s)}#pe(e){e<0||e>=this.#Y?console.warn(`Specified address is out of bounds: ${e}`):(this.address=e,this.requestUpdate())}#k(e){this.#ee=e.data,this.requestUpdate()}set address(e){if(this.#A===e)return;const t=new Ee(e,()=>this.#pe(e));this.#X.push(t),this.#A=e,this.dispatchEventToListeners("AddressChanged",this.#A),this.requestUpdate()}}var He=Object.freeze({__proto__:null,DEFAULT_VIEW:Ae,LinearMemoryInspector:Ce}),Ne=`.navigator{min-height:24px;display:flex;flex-wrap:nowrap;justify-content:space-between;overflow:hidden;align-items:center;background-color:var(--sys-color-cdt-base-container);color:var(--sys-color-on-surface)}.navigator-item{display:flex;white-space:nowrap;overflow:hidden}.address-input{height:var(--sys-size-11);padding:0 var(--sys-size-5);margin:0 var(--sys-size-3);text-align:center;align-items:center;outline:none;color:var(--sys-color-on-surface);border:var(--sys-size-1) solid var(--sys-color-neutral-outline);border-radius:var(--sys-shape-corner-extra-small);background:transparent}.address-input.invalid{color:var(--sys-color-error)}.navigator-button{display:flex;background:transparent;overflow:hidden;border:none;padding:0;outline:none;justify-content:center;align-items:center}.navigator-button:disabled devtools-icon{opacity:50%}.navigator-button:enabled:hover devtools-icon{color:var(--icon-default-hover)}.navigator-button:enabled:focus devtools-icon{color:var(--icon-default-hover)}\n/*# sourceURL=${import.meta.resolve("./linearMemoryNavigator.css")} */`;const je={enterAddress:"Enter address",goBackInAddressHistory:"Go back in address history",goForwardInAddressHistory:"Go forward in address history",previousPage:"Previous page",nextPage:"Next page",refresh:"Refresh"},Be=e.i18n.registerUIStrings("panels/linear_memory_inspector/components/LinearMemoryNavigator.ts",je),_e=e.i18n.getLocalizedString.bind(void 0,Be),{render:Ue,html:Oe,Directives:{ifDefined:Ve}}=t;class ze extends Event{static eventName="addressinputchanged";data;constructor(e,t){super(ze.eventName),this.data={address:e,mode:t}}}class Pe extends Event{static eventName="pagenavigation";data;constructor(e){super(Pe.eventName,{}),this.data=e}}class De extends Event{static eventName="historynavigation";data;constructor(e){super(De.eventName,{}),this.data=e}}class qe extends Event{static eventName="refreshrequested";constructor(){super(qe.eventName,{})}}class Fe extends HTMLElement{#e=this.attachShadow({mode:"open"});#A="0";#ye=void 0;#ve=!0;#fe=!1;#be=!1;set data(e){this.#A=e.address,this.#ye=e.error,this.#ve=e.valid,this.#fe=e.canGoBackInHistory,this.#be=e.canGoForwardInHistory,this.#i();const t=this.#e.querySelector(".address-input");t&&("Submitted"===e.mode?t.blur():"InvalidSubmit"===e.mode&&t.select())}#i(){const e=Oe`
      <style>${Ne}</style>
      <div class="navigator">
        <div class="navigator-item">
          ${this.#we({icon:"undo",title:_e(je.goBackInAddressHistory),event:new De("Backward"),enabled:this.#fe,jslogContext:"linear-memory-inspector.history-back"})}
          ${this.#we({icon:"redo",title:_e(je.goForwardInAddressHistory),event:new De("Forward"),enabled:this.#be,jslogContext:"linear-memory-inspector.history-forward"})}
        </div>
        <div class="navigator-item">
          ${this.#we({icon:"chevron-left",title:_e(je.previousPage),event:new Pe("Backward"),enabled:!0,jslogContext:"linear-memory-inspector.previous-page"})}
          ${this.#xe()}
          ${this.#we({icon:"chevron-right",title:_e(je.nextPage),event:new Pe("Forward"),enabled:!0,jslogContext:"linear-memory-inspector.next-page"})}
        </div>
        ${this.#we({icon:"refresh",title:_e(je.refresh),event:new qe,enabled:!0,jslogContext:"linear-memory-inspector.refresh"})}
      </div>
      `;Ue(e,this.#e,{host:this})}#xe(){const e={"address-input":!0,invalid:!this.#ve};return Oe`
      <input class=${t.Directives.classMap(e)} data-input="true" .value=${this.#A}
        jslog=${n.textField("linear-memory-inspector.address").track({change:!0})}
        title=${Ve(this.#ve?_e(je.enterAddress):this.#ye)} @change=${this.#ne.bind(this,"Submitted")} @input=${this.#ne.bind(this,"Edit")}/>`}#ne(e,t){const s=t.target;this.dispatchEvent(new ze(s.value,e))}#we(e){return Oe`
      <devtools-button class="navigator-button"
        .data=${{variant:"icon",iconName:e.icon,disabled:!e.enabled}}
        jslog=${n.action().track({click:!0,keydown:"Enter"}).context(e.jslogContext)}
        data-button=${e.event.type} title=${e.title}
        @click=${this.dispatchEvent.bind(this,e.event)}
      ></devtools-button>`}}customElements.define("devtools-linear-memory-inspector-navigator",Fe);var Ge=Object.freeze({__proto__:null,AddressInputChangedEvent:ze,HistoryNavigationEvent:De,LinearMemoryNavigator:Fe,PageNavigationEvent:Pe,RefreshRequestedEvent:qe}),Je=Object.freeze({__proto__:null});export{f as LinearMemoryHighlightChipList,He as LinearMemoryInspector,ye as LinearMemoryInspectorUtils,Ge as LinearMemoryNavigator,he as LinearMemoryValueInterpreter,Me as LinearMemoryViewer,Je as LinearMemoryViewerUtils,q as ValueInterpreterDisplay,N as ValueInterpreterDisplayUtils,ee as ValueInterpreterSettings};
//# sourceMappingURL=components.js.map
