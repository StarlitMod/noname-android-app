import*as e from"../../lit/lit.js";import*as i from"../../visual_logging/visual_logging.js";var t=`:host{overflow:hidden}div{line-height:1.7em}.arrow-icon-button{cursor:pointer;padding:1px 0;border:none;background:none;margin-right:2px}.arrow-icon{display:inline-block;mask-image:var(--image-file-triangle-right);background-color:var(--icon-default);margin-top:2px;height:14px;width:14px;transition:transform 200ms}.arrow-icon.expanded{transform:rotate(90deg)}.expandable-list-container{display:flex;margin-top:4px}.expandable-list-items{overflow:hidden}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;border:none;background:none;font-family:inherit;font-size:var(--sys-size-6);&:focus-visible{outline:2px solid var(--sys-color-state-focus-ring);outline-offset:0;border-radius:var(--sys-shape-corner-extra-small)}}button.link{border:none;background:none;font-family:inherit;font-size:inherit}.text-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n/*# sourceURL=${import.meta.resolve("./expandableList.css")} */`;const{html:o,Directives:{ifDefined:n}}=e;class s extends HTMLElement{#e=this.attachShadow({mode:"open"});#i=!1;#t=[];#o;set data(e){this.#t=e.rows,this.#o=e.title,this.#n()}#s(){this.#i=!this.#i,this.#n()}#n(){this.#t.length<1||e.render(o`
      <style>${t}</style>
      <div class="expandable-list-container">
        <div>
          ${this.#t.length>1?o`
              <button title='${n(this.#o)}' aria-label='${n(this.#o)}' aria-expanded=${this.#i?"true":"false"} @click=${()=>this.#s()} class="arrow-icon-button">
                <span class="arrow-icon ${this.#i?"expanded":""}"
                jslog=${i.expand().track({click:!0})}></span>
              </button>
            `:e.nothing}
        </div>
        <div class="expandable-list-items">
          ${this.#t.filter((e,i)=>this.#i||0===i).map(e=>o`
            ${e}
          `)}
        </div>
      </div>
    `,this.#e,{host:this})}}customElements.define("devtools-expandable-list",s);var r=Object.freeze({__proto__:null,ExpandableList:s});export{r as ExpandableList};
//# sourceMappingURL=expandable_list.js.map
