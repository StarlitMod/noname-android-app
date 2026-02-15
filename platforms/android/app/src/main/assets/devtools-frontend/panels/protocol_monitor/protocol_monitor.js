import"../../ui/components/icon_button/icon_button.js";import"../../ui/components/menus/menus.js";import*as e from"../../core/common/common.js";import*as t from"../../core/host/host.js";import*as a from"../../core/i18n/i18n.js";import*as o from"../../core/sdk/sdk.js";import"../../ui/components/buttons/buttons.js";import*as s from"../../ui/components/suggestion_input/suggestion_input.js";import*as r from"../../ui/legacy/legacy.js";import*as n from"../../ui/lit/lit.js";import{Directives as i,render as d,html as l}from"../../ui/lit/lit.js";import*as m from"../../ui/visual_logging/visual_logging.js";import*as p from"../elements/components/components.js";import"../../ui/legacy/components/data_grid/data_grid.js";import*as c from"../../core/platform/platform.js";import*as u from"../../core/protocol_client/protocol_client.js";import*as g from"../../models/bindings/bindings.js";import*as h from"../../models/text_utils/text_utils.js";import*as y from"../../ui/legacy/components/source_frame/source_frame.js";var v=`*{box-sizing:border-box;padding:0;margin:0;font-size:inherit}:host{display:flex;flex-direction:column;height:100%}.target-selector{max-width:var(--sys-size-21)}.warning-icon{margin-left:-18px;margin-right:4px}.row{flex-wrap:wrap}.row,\n.row-icons{display:flex;flex-direction:row;color:var(--sys-color-token-property-special);font-family:var(--monospace-font-family);font-size:var(--monospace-font-size);align-items:center;line-height:18px;margin-top:3px}.separator{margin-right:0.5em;color:var(--sys-color-on-surface)}ul{padding-left:2em}.optional-parameter{color:var(--sys-color-token-attribute-value);--override-color-recorder-input:var(--sys-color-on-surface)}.undefined-parameter{color:var(--sys-color-state-disabled)}.wrapper{display:flex;flex-direction:column;height:100%}.editor-wrapper{padding-left:1em;overflow-x:hidden;flex-grow:1;padding-bottom:50px;padding-top:0.5em}.clear-button,\n.add-button,\n.delete-button{opacity:0%;transition:opacity 0.3s ease-in-out}.clear-button,\n.delete-button{margin-left:5px}.row:focus-within .delete-button,\n.row:focus-within .add-button,\n.row:focus-within .clear-button,\n.row:hover .delete-button,\n.row:hover .add-button,\n.row:hover .clear-button{opacity:100%}.protocol-monitor-sidebar-toolbar{border-top:1px solid var(--sys-color-divider)}\n/*# sourceURL=${import.meta.resolve("./JSONEditor.css")} */`;const{html:b,render:f,Directives:$,nothing:w}=n,{live:C,classMap:P,repeat:T}=$,S={deleteParameter:"Delete parameter",addParameter:"Add a parameter",resetDefaultValue:"Reset to default value",addCustomProperty:"Add custom property",sendCommandCtrlEnter:"Send command - Ctrl+Enter",sendCommandCmdEnter:"Send command - ⌘+Enter",copyCommand:"Copy command",selectTarget:"Select a target"},I=a.i18n.registerUIStrings("panels/protocol_monitor/JSONEditor.ts",S),j=a.i18n.getLocalizedString.bind(void 0,I),x=new Map([["string",""],["number",0],["boolean",!1]]),M="dummy",N="<empty_string>";function B(e,t){return e.toLowerCase().includes(t.toLowerCase())}class k extends(e.ObjectWrapper.eventMixin(r.Widget.VBox)){#e=new Map;#t=new Map;#a=new Map;#o=[];#s=[];#r="";#n;#i;#d;constructor(e,t=V){super(e,{useShadowDom:!0}),this.#d=t,this.registerRequiredCSS(v)}get metadataByCommand(){return this.#e}set metadataByCommand(e){this.#e=e,this.requestUpdate()}get typesByName(){return this.#t}set typesByName(e){this.#t=e,this.requestUpdate()}get enumsByName(){return this.#a}set enumsByName(e){this.#a=e,this.requestUpdate()}get parameters(){return this.#o}set parameters(e){this.#o=e,this.requestUpdate()}get targets(){return this.#s}set targets(e){this.#s=e,this.requestUpdate()}get command(){return this.#r}set command(e){this.#r!==e&&(this.#r=e,this.requestUpdate())}get targetId(){return this.#n}set targetId(e){this.#n!==e&&(this.#n=e,this.requestUpdate())}wasShown(){super.wasShown(),this.#i=new r.PopoverHelper.PopoverHelper(this.contentElement,e=>this.#l(e),"protocol-monitor.hint"),this.#i.setDisableOnClick(!0),this.#i.setTimeout(300);o.TargetManager.TargetManager.instance().addEventListener("AvailableTargetsChanged",this.#m,this),this.#m(),this.requestUpdate()}willHide(){super.willHide(),this.#i?.hidePopover(),this.#i?.dispose();o.TargetManager.TargetManager.instance().removeEventListener("AvailableTargetsChanged",this.#m,this)}#m(){this.targets=o.TargetManager.TargetManager.instance().targets(),this.targets.length&&void 0===this.targetId&&(this.targetId=this.targets[0].id())}getParameters(){const e=t=>{if(void 0!==t.value)switch(t.type){case"number":return Number(t.value);case"boolean":return Boolean(t.value);case"object":{const a={};for(const o of t.value){void 0!==e(o)&&(a[o.name]=e(o))}if(0===Object.keys(a).length)return;return a}case"array":{const a=[];for(const o of t.value)a.push(e(o));return 0===a.length?[]:a}default:return t.value}},t={};for(const a of this.parameters)t[a.name]=e(a);return e({type:"object",name:M,optional:!0,value:this.parameters,description:""})}displayCommand(e,t,a){this.targetId=a,this.command=e;const o=this.metadataByCommand.get(this.command);if(!o?.parameters)return;this.populateParametersForCommandWithDefaultValues();const s=this.#p("",t,{typeRef:M,type:"object",name:"",description:"",optional:!0,value:[]},o.parameters).value,r=new Map(this.parameters.map(e=>[e.name,e]));for(const e of s){const t=r.get(e.name);t&&(t.value=e.value)}this.requestUpdate()}#p(e,t,a,o){const s=a?.type||typeof t,r=a?.description??"",n=a?.optional??!0;switch(s){case"string":case"boolean":case"number":return this.#c(e,t,a);case"object":return this.#u(e,t,a,o);case"array":return this.#g(e,t,a)}return{type:s,name:e,optional:n,typeRef:a?.typeRef,value:t,description:r}}#c(e,t,a){const o=a?.type||typeof t,s=a?.description??"";return{type:o,name:e,optional:a?.optional??!0,typeRef:a?.typeRef,value:t,description:s,isCorrectType:!a||this.#h(a,String(t))}}#u(e,t,a,o){const s=a?.description??"";if("object"!=typeof t||null===t)throw new Error("The value is not an object");const r=a?.typeRef;if(!r)throw new Error("Every object parameters should have a type ref");const n=r===M?o:this.typesByName.get(r);if(!n)throw new Error("No nested type for keys were found");const i=[];for(const e of Object.keys(t)){const a=n.find(t=>t.name===e);i.push(this.#p(e,t[e],a))}return{type:"object",name:e,optional:a.optional,typeRef:a.typeRef,value:i,description:s,isCorrectType:!0}}#g(e,t,a){const o=a?.description??"",s=a?.optional??!0,r=a?.typeRef;if(!r)throw new Error("Every array parameters should have a type ref");if(!Array.isArray(t))throw new Error("The value is not an array");const n=E(r)?void 0:{optional:!0,type:"object",value:[],typeRef:r,description:"",name:""},i=[];for(let e=0;e<t.length;e++){const a=this.#p(`${e}`,t[e],n);i.push(a)}return{type:"array",name:e,optional:s,typeRef:a?.typeRef,value:i,description:o,isCorrectType:!0}}#l(e){const t=e.composedPath()[0],a=this.#y(t);if(!a?.description)return null;const[o,s]=(e=>{if(e.length>150){const[t,a]=e.split(".");return[t,a]}return[e,""]})(a.description),r=a.type,n=a.replyArgs;let i="";return i=n&&n.length>0?s+`Returns: ${n}<br>`:r?s+`<br>Type: ${r}<br>`:s,{box:t.boxInWindow(),show:async e=>{const t=new p.CSSHintDetailsView.CSSHintDetailsView({getMessage:()=>`<span>${o}</span>`,getPossibleFixMessage:()=>i,getLearnMoreLink:()=>`https://chromedevtools.github.io/devtools-protocol/tot/${this.command.split(".")[0]}/`});return e.contentElement.appendChild(t),!0}}}#y(e){if(e.matches(".command")){const e=this.metadataByCommand.get(this.command);if(e)return{description:e.description,replyArgs:e.replyArgs}}if(e.matches(".parameter")){const t=e.dataset.paramid;if(!t)return;const a=t.split("."),{parameter:o}=this.#v(a);if(!o.description)return;return{description:o.description,type:o.type}}}getCommandJson(){return""!==this.command?JSON.stringify({command:this.command,parameters:this.getParameters()}):""}#b(){const e=this.getCommandJson();t.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(e)}#f(){this.dispatchEventToListeners("submiteditor",{command:this.command,parameters:this.getParameters(),targetId:this.targetId})}populateParametersForCommandWithDefaultValues(){const e=this.metadataByCommand.get(this.command)?.parameters;e&&(this.parameters=e.map(e=>this.#$(e)))}#$(e){if("object"===e.type){let t=e.typeRef;t||(t=M);const a=(this.typesByName.get(t)??[]).map(e=>this.#$(e));return{...e,value:e.optional?void 0:a,isCorrectType:!0}}return"array"===e.type?{...e,value:e?.optional?void 0:e.value?.map(e=>this.#$(e))||[],isCorrectType:!0}:{...e,value:e.optional?void 0:x.get(e.type),isCorrectType:!0}}#v(e){let t,a=this.parameters;for(let o=0;o<e.length;o++){const s=e[o],r=a.find(e=>e.name===s);if(o===e.length-1)return{parameter:r,parentParameter:t};if("array"!==r?.type&&"object"!==r?.type)throw new Error("Parameter on the path in not an object or an array");r.value&&(a=r.value),t=r}throw new Error("Not found")}#h(e,t){if("number"===e.type&&isNaN(Number(t)))return!1;const a=this.#w(e);return!(0!==a.length&&!a.includes(t))}#C=e=>{if(!(e.target instanceof s.SuggestionInput.SuggestionInput))return;let t;if(e instanceof KeyboardEvent){const a=e.target.renderRoot.querySelector("devtools-editable-content");if(!a)return;t=a.innerText}else t=e.target.value;const a=e.target.getAttribute("data-paramid");if(!a)return;const o=a.split("."),r=this.#v(o).parameter;""===t?r.value=x.get(r.type):(r.value=t,r.isCorrectType=this.#h(r,t)),this.requestUpdate()};#P=e=>{if(!(e.target instanceof s.SuggestionInput.SuggestionInput))return;const t=e.target.value,a=e.target.getAttribute("data-paramid");if(!a)return;const o=a.split("."),{parameter:r}=this.#v(o);r.name=t,this.requestUpdate()};#T=e=>{e.target instanceof s.SuggestionInput.SuggestionInput&&"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&this.#C(e)};#S(e){if(!(e.target instanceof s.SuggestionInput.SuggestionInput))return;const t=e.target.getAttribute("data-paramid");if(!t)return;const a=t.split(".");this.#v(a).parameter.isCorrectType=!0,this.requestUpdate()}#I=async e=>{e.target instanceof s.SuggestionInput.SuggestionInput&&(this.command=e.target.value),this.populateParametersForCommandWithDefaultValues();const t=e.target;await this.updateComplete,this.#j(t)};#j(e){const t=this.contentElement.querySelectorAll("devtools-suggestion-input,.add-button"),a=[...t].findIndex(t=>t===e.shadowRoot?.host);a>=0&&a+1<t.length?t[a+1].focus():this.contentElement.querySelector('devtools-button[jslogcontext="protocol-monitor.send-command"]')?.focus()}#x(e,t){if("object"===e.type){let a=e.typeRef;a||(a=M);const o=(this.typesByName.get(a)??[]).map(e=>this.#x(e,e.name));return{type:"object",name:t,optional:e.optional,typeRef:a,value:o,isCorrectType:!0,description:e.description}}return{type:e.type,name:t,optional:e.optional,isCorrectType:!0,typeRef:e.typeRef,value:e.optional?void 0:x.get(e.type),description:e.description}}#M(e){const t=e.split("."),{parameter:a,parentParameter:o}=this.#v(t);if(a){switch(a.type){case"array":{const e=a.typeRef;if(!e)throw new Error("Every array parameter must have a typeRef");const t=this.typesByName.get(e)??[],o=t.map(e=>this.#x(e,e.name));let s=E(e)?e:"object";0===t.length&&this.enumsByName.get(e)&&(s="string"),a.value||(a.value=[]),a.value.push({type:s,name:String(a.value.length),optional:!0,typeRef:e,value:0!==o.length?o:"",description:"",isCorrectType:!0});break}case"object":{let e=a.typeRef;if(e||(e=M),a.value||(a.value=[]),!this.typesByName.get(e)){a.value.push({type:"string",name:"",optional:!0,value:"",isCorrectType:!0,description:"",isKeyEditable:!0});break}const t=this.typesByName.get(e)??[],s=t.map(e=>this.#x(e,e.name)),r=t.map(e=>this.#$(e));o?a.value.push({type:"object",name:"",optional:!0,typeRef:e,value:s,isCorrectType:!0,description:""}):a.value=r;break}default:a.value=x.get(a.type)}this.requestUpdate()}}#N(e,t){if(void 0!==e?.value){switch(e.type){case"object":if(e.optional&&!t){e.value=void 0;break}e.typeRef&&this.typesByName.get(e.typeRef)?e.value.forEach(e=>this.#N(e,t)):e.value=[];break;case"array":e.value=e.optional?void 0:[];break;default:e.value=e.optional?void 0:x.get(e.type),e.isCorrectType=!0}this.requestUpdate()}}#B(e,t){if(e&&Array.isArray(t.value)){if(t.value.splice(t.value.findIndex(t=>t===e),1),"array"===t.type)for(let e=0;e<t.value.length;e++)t.value[e].name=String(e);this.requestUpdate()}}#k(e){e.target instanceof HTMLSelectElement&&(this.targetId=e.target.value),this.requestUpdate()}#w(e){if("string"===e.type){const t=this.enumsByName.get(`${e.typeRef}`)??{};return Object.values(t)}return"boolean"===e.type?["true","false"]:[]}performUpdate(){const e={onParameterValueBlur:e=>{this.#C(e)},onParameterKeydown:e=>{this.#T(e)},onParameterFocus:e=>{this.#S(e)},onParameterKeyBlur:e=>{this.#P(e)},onKeydown:e=>{"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&(this.#T(e),this.#f())},parameters:this.parameters,metadataByCommand:this.metadataByCommand,command:this.command,typesByName:this.typesByName,onCommandInputBlur:e=>this.#I(e),onCommandSend:()=>this.#f(),onCopyToClipboard:()=>this.#b(),targets:this.targets,targetId:this.targetId,onAddParameter:e=>{this.#M(e)},onClearParameter:(e,t)=>{this.#N(e,t)},onDeleteParameter:(e,t)=>{this.#B(e,t)},onTargetSelected:e=>{this.#k(e)},computeDropdownValues:e=>this.#w(e)};this.#d(e,{},this.contentElement)}}function E(e){return"string"===e||"boolean"===e||"number"===e}function R(e){return b`
          <devtools-button
            title=${e.title}
            .size=${"SMALL"}
            .iconName=${e.iconName}
            .variant=${"icon"}
            class=${P(e.classMap)}
            @click=${e.onClick}
            .jslogContext=${e.jslogContext}
          ></devtools-button>
      `}function D(e,t,a,o,s){return t.sort((e,t)=>Number(e.optional)-Number(t.optional)),b`
    <ul>
      ${T(t,t=>{const r=o?`${s}.${t.name}`:t.name,n="array"===t.type||"object"===t.type?t.value??[]:[],i=E(t.type),d="array"===t.type,l=o&&"array"===o.type,m=o&&"object"===o.type,p="object"===t.type,c=void 0===t.value,u=t.optional,g=p&&t.typeRef&&void 0!==e.typesByName.get(t.typeRef),h=t.isKeyEditable,y=p&&!g,v="string"===t.type||"boolean"===t.type,f=d&&!c&&0!==t.value?.length||p&&!c,$={"optional-parameter":t.optional,parameter:!0,"undefined-parameter":void 0===t.value&&t.optional};return b`
              <li class="row">
                <div class="row-icons">
                    ${t.isCorrectType?w:b`${b`<devtools-icon name='warning-filled' class='warning-icon small'>
  </devtools-icon>`}`}

                    <!-- If an object parameter has no predefined keys, show an input to enter the key, otherwise show the name of the parameter -->
                    <div class=${P($)} data-paramId=${r}>
                        ${h?b`<devtools-suggestion-input
                            data-paramId=${r}
                            isKey=${!0}
                            .isCorrectInput=${C(t.isCorrectType)}
                            .options=${v?e.computeDropdownValues(t):[]}
                            .autocomplete=${!1}
                            .value=${C(t.name??"")}
                            .placeholder=${""===t.value?N:`<${x.get(t.type)}>`}
                            @blur=${e.onParameterKeyBlur}
                            @focus=${e.onParameterFocus}
                            @keydown=${e.onParameterKeydown}
                          ></devtools-suggestion-input>`:b`${t.name}`} <span class="separator">:</span>
                    </div>

                    <!-- Render button to add values inside an array parameter -->
                    ${d?b`
                      ${R({title:j(S.addParameter),iconName:"plus",onClick:()=>e.onAddParameter(r),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-parameter"})}
                    `:w}

                    <!-- Render button to complete reset an array parameter or an object parameter-->
                    ${f?R({title:j(S.resetDefaultValue),iconName:"clear",onClick:()=>e.onClearParameter(t,l),classMap:{"clear-button":!0},jslogContext:"protocol-monitor.reset-to-default-value"}):w}

                    <!-- Render the buttons to change the value from undefined to empty string for optional primitive parameters -->
                    ${i&&!l&&u&&c?b`  ${R({title:j(S.addParameter),iconName:"plus",onClick:()=>e.onAddParameter(r),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-parameter"})}`:w}

                    <!-- Render the buttons to change the value from undefined to populate the values inside object with their default values -->
                    ${p&&u&&c&&g?b`  ${R({title:j(S.addParameter),iconName:"plus",onClick:()=>e.onAddParameter(r),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-parameter"})}`:w}
                </div>

                <div class="row-icons">
                    <!-- If an object has no predefined keys, show an input to enter the value, and a delete icon to delete the whole key/value pair -->
                    ${h&&m?b`
                    <!-- @ts-ignore -->
                    <devtools-suggestion-input
                        data-paramId=${r}
                        .isCorrectInput=${C(t.isCorrectType)}
                        .options=${v?e.computeDropdownValues(t):[]}
                        .autocomplete=${!1}
                        .value=${C(t.value??"")}
                        .placeholder=${""===t.value?N:`<${x.get(t.type)}>`}
                        .jslogContext=${"parameter-value"}
                        @blur=${e.onParameterValueBlur}
                        @focus=${e.onParameterFocus}
                        @keydown=${e.onParameterKeydown}
                      ></devtools-suggestion-input>

                      ${R({title:j(S.deleteParameter),iconName:"bin",onClick:()=>e.onDeleteParameter(t,o),classMap:{deleteButton:!0,deleteIcon:!0},jslogContext:"protocol-monitor.delete-parameter"})}`:w}

                  <!-- In case  the parameter is not optional or its value is not undefined render the input -->
                  ${!i||h||c&&u||l?w:b`
                      <!-- @ts-ignore -->
                      <devtools-suggestion-input
                        data-paramId=${r}
                        .strikethrough=${C(t.isCorrectType)}
                        .options=${v?e.computeDropdownValues(t):[]}
                        .autocomplete=${!1}
                        .value=${C(t.value??"")}
                        .placeholder=${""===t.value?N:`<${x.get(t.type)}>`}
                        .jslogContext=${"parameter-value"}
                        @blur=${e.onParameterValueBlur}
                        @focus=${e.onParameterFocus}
                        @keydown=${e.onParameterKeydown}
                      ></devtools-suggestion-input>`}

                  <!-- Render the buttons to change the value from empty string to undefined for optional primitive parameters -->
                  ${!i||h||l||!u||c?w:b`  ${R({title:j(S.resetDefaultValue),iconName:"clear",onClick:()=>e.onClearParameter(t),classMap:{"clear-button":!0},jslogContext:"protocol-monitor.reset-to-default-value"})}`}

                  <!-- If the parameter is an object with no predefined keys, renders a button to add key/value pairs to it's value -->
                  ${y?b`
                    ${R({title:j(S.addCustomProperty),iconName:"plus",onClick:()=>e.onAddParameter(r),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-custom-property"})}
                  `:w}

                  <!-- In case the parameter is nested inside an array we render the input field as well as a delete button -->
                  ${l?b`
                  <!-- If the parameter is an object we don't want to display the input field we just want the delete button-->
                  ${p?w:b`
                  <!-- @ts-ignore -->
                  <devtools-suggestion-input
                    data-paramId=${r}
                    .options=${v?e.computeDropdownValues(t):[]}
                    .autocomplete=${!1}
                    .value=${C(t.value??"")}
                    .placeholder=${""===t.value?N:`<${x.get(t.type)}>`}
                    .jslogContext=${"parameter"}
                    @blur=${e.onParameterValueBlur}
                    @keydown=${e.onParameterKeydown}
                    class=${P({"json-input":!0})}
                  ></devtools-suggestion-input>`}

                  ${R({title:j(S.deleteParameter),iconName:"bin",onClick:()=>e.onDeleteParameter(t,o),classMap:{"delete-button":!0},jslogContext:"protocol-monitor.delete-parameter"})}`:w}
                </div>
              </li>
              ${D(e,n,a,t,r)}
            `})}
    </ul>
  `}const V=(e,a,o)=>{f(b`
    <div class="wrapper" @keydown=${e.onKeydown} jslog=${m.pane("command-editor").track({resize:!0})}>
      <div class="editor-wrapper">
        ${function(e){return b`
  <div class="row attribute padded">
    <div>target<span class="separator">:</span></div>
    <select class="target-selector"
            title=${j(S.selectTarget)}
            jslog=${m.dropDown("target-selector").track({change:!0})}
            @change=${e.onTargetSelected}>
      ${e.targets.map(t=>b`
        <option jslog=${m.item("target").track({click:!0})}
                value=${t.id()} ?selected=${t.id()===e.targetId}>
          ${t.name()} (${t.inspectedURL()})
        </option>`)}
    </select>
  </div>
`}(e)}
        <div class="row attribute padded">
          <div class="command">command<span class="separator">:</span></div>
          <devtools-suggestion-input
            .options=${[...e.metadataByCommand.keys()]}
            .value=${e.command}
            .placeholder=${"Enter your command…"}
            .suggestionFilter=${B}
            .jslogContext=${"command"}
            @blur=${e.onCommandInputBlur}
            class=${P({"json-input":!0})}
          ></devtools-suggestion-input>
        </div>
        ${e.parameters.length?b`
        <div class="row attribute padded">
          <div>parameters<span class="separator">:</span></div>
        </div>
          ${D(e,e.parameters)}
        `:w}
      </div>
      <devtools-toolbar class="protocol-monitor-sidebar-toolbar">
        <devtools-button title=${j(S.copyCommand)}
                        .iconName=${"copy"}
                        .jslogContext=${"protocol-monitor.copy-command"}
                        .variant=${"toolbar"}
                        @click=${e.onCopyToClipboard}></devtools-button>
          <div class=toolbar-spacer></div>
        <devtools-button title=${t.Platform.isMac()?j(S.sendCommandCmdEnter):j(S.sendCommandCtrlEnter)}
                        .iconName=${"send"}
                        jslogContext=${"protocol-monitor.send-command"}
                        .variant=${"primary_toolbar"}
                        @click=${e.onCommandSend}></devtools-button>
      </devtools-toolbar>
    </div>`,o)};var q=Object.freeze({__proto__:null,DEFAULT_VIEW:V,JSONEditor:k,suggestionFilter:B}),A=`@scope to (devtools-widget > *){.protocol-monitor-toolbar{border-bottom:1px solid var(--sys-color-divider)}.protocol-monitor-bottom-toolbar{border-top:1px solid var(--sys-color-divider)}.target-selector{max-width:120px}.protocol-monitor-main{flex-grow:1}}\n/*# sourceURL=${import.meta.resolve("./protocolMonitor.css")} */`;const{styleMap:U}=i,{widgetConfig:O,widgetRef:F}=r.Widget,H={method:"Method",type:"Type",request:"Request",response:"Response",timestamp:"Timestamp",elapsedTime:"Elapsed time",target:"Target",record:"Record",clearAll:"Clear all",filter:"Filter",documentation:"Documentation",editAndResend:"Edit and resend",sMs:"{PH1} ms",noMessageSelected:"No message selected",selectAMessageToView:"Select a message to see its details",save:"Save",session:"Session",sendRawCDPCommand:"Send a raw `CDP` command",sendRawCDPCommandExplanation:"Format: `'Domain.commandName'` for a command without parameters, or `'{\"command\":\"Domain.commandName\", \"parameters\": {...}}'` as a JSON object for a command with parameters. `'cmd'`/`'method'` and `'args'`/`'params'`/`'arguments'` are also supported as alternative keys for the `JSON` object.",selectTarget:"Select a target",showCDPCommandEditor:"Show CDP command editor",hideCDPCommandEditor:"Hide  CDP command editor"},W=a.i18n.registerUIStrings("panels/protocol_monitor/ProtocolMonitor.ts",H),_=a.i18n.getLocalizedString.bind(void 0,W),K=e=>{const t=new Map;for(const a of e)for(const e of Object.keys(a.metadata))t.set(e,a.metadata[e]);return t},L=K(u.InspectorBackend.inspectorBackend.agentPrototypes.values()),J=u.InspectorBackend.inspectorBackend.typeMap,z=u.InspectorBackend.inspectorBackend.enumMap,G=(e,t,a)=>{d(l`
        <style>${r.inspectorCommonStyles}</style>
        <style>${A}</style>
        <devtools-split-view name="protocol-monitor-split-container"
                             direction="column"
                             sidebar-initial-size="400"
                             sidebar-visibility=${e.sidebarVisible?"visible":"hidden"}
                             @change=${t=>e.onSplitChange("OnlyMain"===t.detail)}>
          <div slot="main" class="vbox protocol-monitor-main">
            <devtools-toolbar class="protocol-monitor-toolbar"
                               jslog=${m.toolbar("top")}>
               <devtools-button title=${_(H.record)}
                                .iconName=${"record-start"}
                                .toggledIconName=${"record-stop"}
                                .jslogContext=${"protocol-monitor.toggle-recording"}
                                .variant=${"icon_toggle"}
                                .toggleType=${"red-toggle"}
                                .toggled=${!0}
                                @click=${t=>e.onRecord(t.target.toggled)}>
               </devtools-button>
              <devtools-button title=${_(H.clearAll)}
                               .iconName=${"clear"}
                               .variant=${"toolbar"}
                               .jslogContext=${"protocol-monitor.clear-all"}
                               @click=${()=>e.onClear()}></devtools-button>
              <devtools-button title=${_(H.save)}
                               .iconName=${"download"}
                               .variant=${"toolbar"}
                               .jslogContext=${"protocol-monitor.save"}
                               @click=${()=>e.onSave()}></devtools-button>
              <devtools-toolbar-input type="filter"
                                      list="filter-suggestions"
                                      style="flex-grow: 1"
                                      value=${e.filter}
                                      @change=${t=>e.onFilterChanged(t.detail)}>
                <datalist id="filter-suggestions">
                  ${e.filterKeys.map(e=>l`
                        <option value=${e+":"}></option>
                        <option value=${"-"+e+":"}></option>`)}
                </datalist>
              </devtools-toolbar-input>
            </devtools-toolbar>
            <devtools-split-view direction="column" sidebar-position="second"
                                 name="protocol-monitor-panel-split" sidebar-initial-size="250">
              <devtools-data-grid
                  striped
                  slot="main"
                  .filters=${e.parseFilter(e.filter)}>
                <table>
                    <tr>
                      <th id="type" sortable style="text-align: center" hideable weight="1">
                        ${_(H.type)}
                      </th>
                      <th id="method" weight="5">
                        ${_(H.method)}
                      </th>
                      <th id="request" hideable weight="5">
                        ${_(H.request)}
                      </th>
                      <th id="response" hideable weight="5">
                        ${_(H.response)}
                      </th>
                      <th id="elapsed-time" sortable hideable weight="2">
                        ${_(H.elapsedTime)}
                      </th>
                      <th id="timestamp" sortable hideable weight="5">
                        ${_(H.timestamp)}
                      </th>
                      <th id="target" sortable hideable weight="5">
                        ${_(H.target)}
                      </th>
                      <th id="session" sortable hideable weight="5">
                        ${_(H.session)}
                      </th>
                    </tr>
                    ${e.messages.map(t=>l`
                      <tr @select=${()=>e.onSelect(t)}
                          @contextmenu=${a=>e.onContextMenu(t,a.detail)}
                          style="--override-data-grid-row-background-color: var(--sys-color-surface3)">
                        ${"id"in t?l`
                          <td title="sent">
                            <devtools-icon name="arrow-up-down" class="medium" style="color: var(--icon-request-response);">
                            </devtools-icon>
                          </td>`:l`
                          <td title="received">
                            <devtools-icon name="arrow-down" class="medium" style="color: var(--icon-request);">
                            </devtools-icon>
                          </td>`}
                        <td>${t.method}</td>
                        <td>${t.params?l`<code>${JSON.stringify(t.params)}</code>`:""}</td>
                        <td>
                          ${t.result?l`<code>${JSON.stringify(t.result)}</code>`:t.error?l`<code>${JSON.stringify(t.error)}</code>`:"id"in t?"(pending)":""}
                        </td>
                        <td data-value=${t.elapsedTime||0}>
                          ${"id"in t?t.elapsedTime?_(H.sMs,{PH1:String(t.elapsedTime)}):"(pending)":""}
                        </td>
                        <td data-value=${t.requestTime}>${_(H.sMs,{PH1:String(t.requestTime)})}</td>
                        <td>${function(e){if(!e)return"";return e.decorateLabel(`${e.name()} ${e===o.TargetManager.TargetManager.instance().rootTarget()?"":e.id()}`)}(t.target)}</td>
                        <td>${t.sessionId||""}</td>
                      </tr>`)}
                  </table>
              </devtools-data-grid>
              <devtools-widget .widgetConfig=${O(Y,{request:e.selectedMessage?.params,response:e.selectedMessage?.result||e.selectedMessage?.error,type:e.selectedMessage?"id"in e?.selectedMessage?"sent":"received":void 0})}
                  class="protocol-monitor-info"
                  slot="sidebar"></devtools-widget>
            </devtools-split-view>
            <devtools-toolbar class="protocol-monitor-bottom-toolbar"
               jslog=${m.toolbar("bottom")}>
              <devtools-button .title=${e.sidebarVisible?_(H.hideCDPCommandEditor):_(H.showCDPCommandEditor)}
                               .iconName=${e.sidebarVisible?"left-panel-close":"left-panel-open"}
                               .variant=${"toolbar"}
                               .jslogContext=${"protocol-monitor.toggle-command-editor"}
                               @click=${()=>e.onToggleSidebar()}></devtools-button>
              </devtools-button>
              <devtools-toolbar-input id="command-input"
                                      style=${U({"flex-grow":1,display:e.sidebarVisible?"none":"flex"})}
                                      value=${e.command}
                                      list="command-input-suggestions"
                                      placeholder=${_(H.sendRawCDPCommand)}
                                      title=${_(H.sendRawCDPCommandExplanation)}
                                      @change=${t=>e.onCommandChange(t.detail)}
                                      @submit=${t=>e.onCommandSubmitted(t.detail)}>
                <datalist id="command-input-suggestions">
                  ${e.commandSuggestions.map(e=>l`<option value=${e}></option>`)}
                </datalist>
              </devtools-toolbar-input>
              <select class="target-selector"
                      title=${_(H.selectTarget)}
                      style=${U({display:e.sidebarVisible?"none":"flex"})}
                      jslog=${m.dropDown("target-selector").track({change:!0})}
                      @change=${t=>e.onTargetChange(t.target.value)}>
                ${e.targets.map(t=>l`
                  <option jslog=${m.item("target").track({click:!0})}
                          value=${t.id()} ?selected=${t.id()===e.selectedTargetId}>
                    ${t.name()} (${t.inspectedURL()})
                  </option>`)}
              </select>
            </devtools-toolbar>
          </div>
          <devtools-widget slot="sidebar"
              .widgetConfig=${O(k,{metadataByCommand:L,typesByName:J,enumsByName:z})}
              ${F(k,e=>{t.editorWidget=e})}>
          </devtools-widget>
        </devtools-split-view>`,a)};class Q extends r.Panel.Panel{started;startTime;messageForId=new Map;filterParser;#E=["method","request","response","target","session"];#R=new X;#D;#r="";#V=!1;#d;#q=[];#A;#U="";#O;#F=new Map;constructor(e=G){super("protocol-monitor",!0),this.#d=e,this.started=!1,this.startTime=0,this.#E=["method","request","response","type","target","session"],this.filterParser=new h.TextUtils.FilterParser(this.#E),this.#D="main",this.performUpdate(),this.#O.addEventListener("submiteditor",e=>{this.onCommandSend(e.data.command,e.data.parameters,e.data.targetId)}),o.TargetManager.TargetManager.instance().addEventListener("AvailableTargetsChanged",()=>{this.requestUpdate()}),o.TargetManager.TargetManager.instance().observeTargets(this)}targetAdded(e){this.#F.set(e.sessionId,e)}targetRemoved(e){this.#F.delete(e.sessionId)}#H(){const e=this.#O.getCommandJson(),t=this.#O.targetId;t&&(this.#D=t),e&&(this.#r=e,this.requestUpdate())}performUpdate(){const e={messages:this.#q,selectedMessage:this.#A,sidebarVisible:this.#V,command:this.#r,commandSuggestions:this.#R.allSuggestions(),filterKeys:this.#E,filter:this.#U,parseFilter:this.filterParser.parse.bind(this.filterParser),onSplitChange:e=>{if(e)this.#H(),this.#V=!1;else{const{command:e,parameters:t}=Z(this.#r);this.#O.displayCommand(e,t,this.#D),this.#V=!0}this.requestUpdate()},onRecord:e=>{this.setRecording(e)},onClear:()=>{this.#q=[],this.messageForId.clear(),this.requestUpdate()},onSave:()=>{this.saveAsFile()},onSelect:e=>{this.#A=e,this.requestUpdate()},onContextMenu:this.#W.bind(this),onCommandChange:e=>{this.#r=e},onCommandSubmitted:e=>{this.#R.addEntry(e);const{command:t,parameters:a}=Z(e);this.onCommandSend(t,a,this.#D)},onFilterChanged:e=>{this.#U=e,this.requestUpdate()},onTargetChange:e=>{this.#D=e},onToggleSidebar:()=>{this.#V=!this.#V,this.requestUpdate()},targets:o.TargetManager.TargetManager.instance().targets(),selectedTargetId:this.#D},t=this,a={set editorWidget(e){t.#O=e}};this.#d(e,a,this.contentElement)}#W(e,a){a.editSection().appendItem(_(H.editAndResend),()=>{if(!this.#A)return;const t=this.#A.params,a=this.#A.target?.id()||"",o=e.method;this.#r=JSON.stringify({command:o,parameters:t}),this.#V?this.#O.displayCommand(o,t,a):(this.#V=!0,this.requestUpdate())},{jslogContext:"edit-and-resend",disabled:!("id"in e)}),a.editSection().appendItem(_(H.filter),()=>{this.#U=`method:${e.method}`,this.requestUpdate()},{jslogContext:"filter"}),a.footerSection().appendItem(_(H.documentation),()=>{const[a,o]=e.method.split("."),s="id"in e?"method":"event";t.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(`https://chromedevtools.github.io/devtools-protocol/tot/${a}#${s}-${o}`)},{jslogContext:"documentation"})}onCommandSend(e,t,a){const s=u.InspectorBackend.test,r=o.TargetManager.TargetManager.instance(),n=a?r.targetById(a):null,i=n?n.sessionId:"";s.sendRawMessage(e,t,()=>{},i)}wasShown(){super.wasShown(),this.started||(this.started=!0,this.startTime=Date.now(),this.setRecording(!0))}setRecording(e){const t=u.InspectorBackend.test;e?(t.onMessageSent=this.messageSent.bind(this),t.onMessageReceived=this.messageReceived.bind(this)):(t.onMessageSent=null,t.onMessageReceived=null)}messageReceived(e){if("id"in e&&e.id){const t=this.messageForId.get(e.id);if(!t)return;return t.result=e.result,t.error=e.error,t.elapsedTime=Date.now()-this.startTime-t.requestTime,this.messageForId.delete(e.id),void this.requestUpdate()}const t=void 0!==e.sessionId?this.#F.get(e.sessionId):void 0;this.#q.push({method:e.method,sessionId:e.sessionId,target:t,requestTime:Date.now()-this.startTime,result:e.params}),this.requestUpdate()}messageSent(e){const t=void 0!==e.sessionId?this.#F.get(e.sessionId):void 0,a={method:e.method,params:e.params,id:e.id,sessionId:e.sessionId,target:t,requestTime:Date.now()-this.startTime};this.#q.push(a),this.requestUpdate(),this.messageForId.set(e.id,a)}async saveAsFile(){const e=new Date,t="ProtocolMonitor-"+c.DateUtilities.toISO8601Compact(e)+".json",a=new g.FileUtils.FileOutputStream;if(!await a.open(t))return;const o=this.#q.map(e=>({...e,target:e.target?.id()}));a.write(JSON.stringify(o,null,"  ")),a.close()}}class X{#_=200;#K=new Set;constructor(e){void 0!==e&&(this.#_=e)}allSuggestions(){const e=[...this.#K].reverse();return e.push(...L.keys()),e}buildTextPromptCompletions=async(e,t,a)=>{if(!t&&!a&&e)return[];return this.allSuggestions().filter(e=>e.startsWith(t)).map(e=>({text:e}))};addEntry(e){if(this.#K.has(e)&&this.#K.delete(e),this.#K.add(e),this.#K.size>this.#_){const e=this.#K.values().next().value;this.#K.delete(e)}}}class Y extends r.Widget.VBox{tabbedPane;request;response;type;selectedTab;constructor(e){super(e),this.tabbedPane=new r.TabbedPane.TabbedPane,this.tabbedPane.appendTab("request",_(H.request),new r.Widget.Widget),this.tabbedPane.appendTab("response",_(H.response),new r.Widget.Widget),this.tabbedPane.show(this.contentElement),this.tabbedPane.selectTab("response"),this.request={}}performUpdate(){if(!this.request&&!this.response)return this.tabbedPane.changeTabView("request",new r.EmptyWidget.EmptyWidget(_(H.noMessageSelected),_(H.selectAMessageToView))),void this.tabbedPane.changeTabView("response",new r.EmptyWidget.EmptyWidget(_(H.noMessageSelected),_(H.selectAMessageToView)));const e=this.type&&"sent"===this.type;this.tabbedPane.setTabEnabled("request",Boolean(e)),e||this.tabbedPane.selectTab("response"),this.tabbedPane.changeTabView("request",y.JSONView.JSONView.createViewSync(this.request||null)),this.tabbedPane.changeTabView("response",y.JSONView.JSONView.createViewSync(this.response||null)),this.selectedTab&&this.tabbedPane.selectTab(this.selectedTab)}}function Z(e){let t=null;try{t=JSON.parse(e)}catch{}return{command:t?t.command||t.method||t.cmd||"":e,parameters:t?.parameters||t?.params||t?.args||t?.arguments||{}}}var ee=Object.freeze({__proto__:null,CommandAutocompleteSuggestionProvider:X,DEFAULT_VIEW:G,InfoWidget:Y,ProtocolMonitorImpl:Q,buildProtocolMetadata:K,parseCommandInput:Z});export{q as JSONEditor,ee as ProtocolMonitor};
//# sourceMappingURL=protocol_monitor.js.map
