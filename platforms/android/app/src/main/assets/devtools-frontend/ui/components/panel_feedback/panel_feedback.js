import*as e from"../../../core/host/host.js";import*as t from"../../../core/i18n/i18n.js";import*as i from"../../../core/platform/platform.js";import*as o from"../helpers/helpers.js";import{render as r,html as n,nothing as s}from"../../lit/lit.js";import"../buttons/buttons.js";import"../../legacy/legacy.js";import*as a from"../../visual_logging/visual_logging.js";import*as l from"../../../core/root/root.js";const c={feedback:"Feedback"},d=t.i18n.registerUIStrings("ui/components/panel_feedback/FeedbackButton.ts",c),p=t.i18n.getLocalizedString.bind(void 0,d);let h=class extends HTMLElement{#e=this.attachShadow({mode:"open"});#t={feedbackUrl:i.DevToolsPath.EmptyUrlString};set data(e){this.#t=e,o.ScheduledRender.scheduleRender(this,this.#i)}#o(){e.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(this.#t.feedbackUrl)}#i(){if(!o.ScheduledRender.isScheduledRender(this))throw new Error("FeedbackButton render was not scheduled");r(n`
      <devtools-button
          @click=${this.#o}
          .iconName=${"review"}
          .variant=${"outlined"}
          .jslogContext=${"feedback"}
      >${p(c.feedback)}</devtools-button>
      `,this.#e,{host:this})}};customElements.define("devtools-feedback-button",h);var k=Object.freeze({__proto__:null,FeedbackButton:h}),m=`:host{display:block}.preview{padding:12px 16px;border:1px solid var(--sys-color-divider);color:var(--sys-color-on-surface);font-size:13px;line-height:20px;border-radius:12px;margin:42px 0;letter-spacing:0.01em}h2{color:var(--sys-color-primary);font-size:13px;line-height:20px;letter-spacing:0.01em;margin:9px 0 14px;display:flex;align-items:center;gap:5px;font-weight:normal}h3{font-size:13px;line-height:20px;letter-spacing:0.04em;color:var(--sys-color-on-surface);margin-bottom:2px;font-weight:normal}.preview p{margin-bottom:24px}.thumbnail{height:92px}.video{display:flex;flex-flow:row wrap;gap:20px}x-link{color:var(--sys-color-primary);text-decoration-line:underline}x-link.quick-start-link{font-size:14px;line-height:22px;letter-spacing:0.04em}.video-description{min-width:min-content;flex-basis:min-content;flex-grow:1}@media (forced-colors: active){x-link{color:linktext}}\n/*# sourceURL=${import.meta.resolve("./panelFeedback.css")} */`;const x={previewText:"Our team is actively working on this feature and we would love to know what you think.",previewTextFeedbackLink:"Send us your feedback.",previewFeature:"Preview feature",videoAndDocumentation:"Video and documentation"},v=t.i18n.registerUIStrings("ui/components/panel_feedback/PanelFeedback.ts",x),b=t.i18n.getLocalizedString.bind(void 0,v),g=new URL("../../../Images/preview_feature_video_thumbnail.svg",import.meta.url).toString();let f=class extends HTMLElement{#e=this.attachShadow({mode:"open"});#t={feedbackUrl:i.DevToolsPath.EmptyUrlString,quickStartUrl:i.DevToolsPath.EmptyUrlString,quickStartLinkText:""};set data(e){this.#t=e,o.ScheduledRender.scheduleRender(this,this.#i)}#i(){if(!o.ScheduledRender.isScheduledRender(this))throw new Error("PanelFeedback render was not scheduled");r(n`
      <style>${m}</style>
      <div class="preview">
        <h2 class="flex">
          <devtools-icon name="experiment" class="extra-large" style="color: var(--icon-primary);"></devtools-icon> ${b(x.previewFeature)}
        </h2>
        <p>${b(x.previewText)} <x-link href=${this.#t.feedbackUrl} jslog=${a.link("feedback").track({click:!0})}>${b(x.previewTextFeedbackLink)}</x-link></p>
        <div class="video">
          <div class="thumbnail">
            <img src=${g} role="presentation" />
          </div>
          <div class="video-description">
            <h3>${b(x.videoAndDocumentation)}</h3>
            <x-link class="quick-start-link" href=${this.#t.quickStartUrl} jslog=${a.link("css-overview.quick-start").track({click:!0})}>${this.#t.quickStartLinkText}</x-link>
          </div>
        </div>
      </div>
      `,this.#e,{host:this})}};customElements.define("devtools-panel-feedback",f);var u=Object.freeze({__proto__:null,PanelFeedback:f}),w=`:host{display:block}.container{display:flex;flex-wrap:wrap;padding:4px}.feedback,\n.learn-more{display:flex;align-items:center}.helper{flex-basis:100%;text-align:center;font-style:italic}.spacer{flex:1}.x-link{color:var(--sys-color-primary);text-decoration-line:underline;margin:0 4px}.feedback .x-link{color:var(--sys-color-token-subtle)}\n/*# sourceURL=${import.meta.resolve("./previewToggle.css")} */`;const $={previewTextFeedbackLink:"Send us your feedback.",shortFeedbackLink:"Send feedback",learnMoreLink:"Learn More"},y=t.i18n.registerUIStrings("ui/components/panel_feedback/PreviewToggle.ts",$),L=t.i18n.getLocalizedString.bind(void 0,y);let U=class extends HTMLElement{#e=this.attachShadow({mode:"open"});#r="";#n=null;#s=null;#a;#l="";#c;set data(e){this.#r=e.name,this.#n=e.helperText,this.#s=e.feedbackURL,this.#a=e.learnMoreURL,this.#l=e.experiment,this.#c=e.onChangeCallback,this.#i()}#i(){const e=l.Runtime.experiments.isEnabled(this.#l);r(n`
      <style>${w}</style>
      <div class="container">
          <devtools-checkbox
            ?checked=${e}
            @change=${this.#d}
            aria-label=${this.#r} />
            <devtools-icon name="experiment" class="medium">
          </devtools-icon>${this.#r}
          </devtools-checkbox>
        <div class="spacer"></div>
        ${this.#s&&!this.#n?n`<div class="feedback"><x-link class="x-link" href=${this.#s}>${L($.shortFeedbackLink)}</x-link></div>`:s}
        ${this.#a?n`<div class="learn-more"><x-link class="x-link" href=${this.#a}>${L($.learnMoreLink)}</x-link></div>`:s}
        <div class="helper">
          ${this.#n&&this.#s?n`<p>${this.#n} <x-link class="x-link" href=${this.#s}>${L($.previewTextFeedbackLink)}</x-link></p>`:s}
        </div>
      </div>`,this.#e,{host:this})}#d(e){const t=e.target.checked;l.Runtime.experiments.setEnabled(this.#l,t),this.#c?.(t)}};customElements.define("devtools-preview-toggle",U);var S=Object.freeze({__proto__:null,PreviewToggle:U});export{k as FeedbackButton,u as PanelFeedback,S as PreviewToggle};
//# sourceMappingURL=panel_feedback.js.map
