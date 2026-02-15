import"../../../ui/components/chrome_link/chrome_link.js";import"../../../ui/components/settings/settings.js";import"../../../ui/components/tooltips/tooltips.js";import*as e from"../../../core/host/host.js";import*as i from"../../../core/i18n/i18n.js";import*as t from"../../../core/sdk/sdk.js";import*as n from"../../../models/badges/badges.js";import"../../../ui/components/buttons/buttons.js";import*as s from"../../../ui/components/helpers/helpers.js";import*as o from"../../../ui/i18n/i18n.js";import*as a from"../../../ui/lit/lit.js";import*as r from"../../../ui/visual_logging/visual_logging.js";import*as c from"../../common/common.js";import*as l from"../../utils/utils.js";var d=`:host{break-inside:avoid;display:block;width:100%;position:relative}fieldset{border:0;padding:0;padding:4px 0 0}.link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}.account-avatar{border:0;border-radius:var(--sys-shape-corner-full);display:block;height:var(--sys-size-9);width:var(--sys-size-9)}.account-info{display:flex;align-items:center}.account-email{display:flex;flex-direction:column;margin-left:8px}.not-signed-in{padding-bottom:4px}.setting-checkbox-container{display:flex;align-items:center;gap:var(--sys-size-2)}.setting-checkbox{display:inline-block}.gdp-profile-container{padding-bottom:var(--sys-size-4);& .divider{left:0;position:absolute;width:100%;height:var(--sys-size-1);background:var(--sys-color-divider)}& .gdp-profile-header{display:flex;align-items:center;gap:var(--sys-size-5);font-family:"Google Sans",system-ui;font-size:var(--sys-typescale-body3-size);height:var(--sys-size-11);& .gdp-logo{background-image:var(--image-file-gdp-logo-light);background-size:contain;width:203px;height:18px;background-repeat:no-repeat}:host-context(.theme-with-dark-background) & .gdp-logo{background-image:var(--image-file-gdp-logo-dark)}}& .gdp-profile-sign-up-content{padding-top:var(--sys-size-7);display:flex;justify-content:space-between;align-items:center}& .gdp-profile-details-content{padding-top:var(--sys-size-7);font:var(--sys-typescale-body4-regular);& .plan-details{margin-top:var(--sys-size-3);height:18px;display:flex;align-items:center}& .setting-container{margin:calc(var(--sys-size-3) - 6px) -6px -6px;display:flex;align-items:center;gap:var(--sys-size-2)}& .tooltip-content{max-width:278px;padding:var(--sys-size-2) var(--sys-size-3);font:var(--sys-typescale-body5-regular)}}}\n/*# sourceURL=${import.meta.resolve("./syncSection.css")} */`;const g={syncDisabled:"To turn this setting on, you must enable Chrome sync.",preferencesSyncDisabled:"You need to first enable saving `Chrome` settings in your `Google` account.",signedIn:"Signed into Chrome as:",notSignedIn:"You're not signed into Chrome.",gdpStandardPlan:"Standard plan",gdpPremiumSubscription:"Premium",gdpProSubscription:"Pro",gdpUnknownSubscription:"Unknown plan",signUp:"Sign up",viewProfile:"View profile",tooltipDisclaimerText:"When you qualify for a badge, the badge’s identifier and the type of activity you did to earn it are sent to Google",relevantData:"Relevant data",dataDisclaimer:"({PH1} is sent to Google)"},p=i.i18n.registerUIStrings("panels/settings/components/SyncSection.ts",g),u=i.i18n.getLocalizedString.bind(void 0,p),{html:f,Directives:{ref:h,createRef:v}}=a;let m;class y extends HTMLElement{#e=this.attachShadow({mode:"open"});#i={isSyncActive:!1};#t;#n;#s=v();#o=!1;#a;set data(e){this.#i=e.syncInfo,this.#t=e.syncSetting,this.#n=e.receiveBadgesSetting,s.ScheduledRender.scheduleRender(this,this.#r),e.syncInfo.accountEmail&&this.#c()}async highlightReceiveBadgesSetting(){await s.ScheduledRender.scheduleRender(this,this.#r);const e=this.#s.value;e&&l.PanelUtils.highlightElement(e)}#r(){if(!this.#t)throw new Error("SyncSection is not properly initialized");const i=!this.#i.isSyncActive||!this.#i.arePreferencesSynced;this.#t?.setDisabled(i),a.render(f`
      <style>${d}</style>
      <fieldset>
        ${function(e){if(!e.accountEmail)return f`
      <div class="not-signed-in">${u(g.notSignedIn)}</div>
    `;return f`
    <div class="account-info">
      <img class="account-avatar" src="data:image/png;base64, ${e.accountImage}" alt="Account avatar" />
      <div class="account-email">
        <span>${u(g.signedIn)}</span>
        <span>${e.accountEmail}</span>
      </div>
    </div>`}(this.#i)}
        ${function(i,n){if(!i.accountEmail)return a.nothing;return f`
    <div class="setting-checkbox-container">
      <setting-checkbox class="setting-checkbox" .data=${{setting:n}}>
      </setting-checkbox>
      ${function(i){const n=!i.isSyncActive||!i.arePreferencesSynced;if(!n)return a.nothing;const s=i.isSyncActive?"chrome://settings/syncSetup/advanced":"chrome://settings/syncSetup",o=i.isSyncActive?u(g.preferencesSyncDisabled):u(g.syncDisabled);return f`
    <devtools-button
      aria-describedby=settings-sync-info
      .title=${o}
      .iconName=${"info"}
      .variant=${"icon"}
      .size=${"SMALL"}
      @click=${i=>{const n=t.TargetManager.TargetManager.instance().rootTarget();null!==n&&(n.targetAgent().invoke_createTarget({url:s}).then(i=>{i.getError()&&e.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(s)}),i.consume())}}>
    </devtools-button>
    <devtools-tooltip
        id=settings-sync-info
        variant=simple>
      ${o}
    </devtools-tooltip>
  `}(i)}
    </div>
  `}(this.#i,this.#t)}
        ${function({receiveBadgesSetting:i,receiveBadgesSettingContainerRef:t,gdpProfile:s,isEligibleToCreateProfile:l,onSignUpSuccess:d}){if(!e.GdpClient.isGdpProfilesAvailable()||!s&&!l)return a.nothing;const v=e.GdpClient.isBadgesEnabled()&&i;function y(){return f`
      <div class="gdp-profile-header">
        <div class="gdp-logo" role="img" aria-label="Google Developer Program"></div>
      </div>
    `}return f`
    <div class="gdp-profile-container" jslog=${r.section().context("gdp-profile")}>
      <div class="divider"></div>
      ${s?f`
        <div class="gdp-profile-details-content">
          ${y()}
          <div class="plan-details">
            ${function(i){if(!i.activeSubscription||i.activeSubscription.subscriptionStatus!==e.GdpClient.SubscriptionStatus.ENABLED)return u(g.gdpStandardPlan);switch(i.activeSubscription.subscriptionTier){case e.GdpClient.SubscriptionTier.PREMIUM_ANNUAL:case e.GdpClient.SubscriptionTier.PREMIUM_MONTHLY:return u(g.gdpPremiumSubscription);case e.GdpClient.SubscriptionTier.PRO_ANNUAL:case e.GdpClient.SubscriptionTier.PRO_MONTHLY:return u(g.gdpProSubscription);default:return u(g.gdpUnknownSubscription)}}(s)}
            &nbsp;·&nbsp;
            <x-link
              jslog=${r.link().track({click:!0,keydown:"Enter|Space"}).context("view-profile")}
              class="link"
              href=${e.GdpClient.GOOGLE_DEVELOPER_PROGRAM_PROFILE_LINK}>
              ${u(g.viewProfile)}
            </x-link></div>
            ${v?f`
              <div class="setting-container"  ${h(t)}>
                <setting-checkbox class="setting-checkbox" .data=${{setting:i}} @change=${e=>{const i=e.target;n.UserBadges.instance().initialize().then(()=>{i.checked&&n.UserBadges.instance().recordAction(n.BadgeAction.RECEIVE_BADGES_SETTING_ENABLED)})}}></setting-checkbox>
                ${function(){if(m)return m;const e=f`
    <span
      tabIndex="0"
      class="link"
      aria-details="gdp-profile-tooltip"
      aria-describedby="gdp-profile-tooltip"
      >${u(g.relevantData)}</span>
    <devtools-tooltip id="gdp-profile-tooltip" variant=${"rich"}>
      <div class="tooltip-content" tabindex="0">${u(g.tooltipDisclaimerText)}</div>
    </devtools-tooltip>`,i=document.createElement("span");return a.render(e,i),m=o.getFormatLocalizedString(p,g.dataDisclaimer,{PH1:i}),m}()}
              </div>`:a.nothing}
        </div>
      `:f`
        <div class="gdp-profile-sign-up-content">
          ${y()}
          <devtools-button
            @click=${()=>c.GdpSignUpDialog.show({onSuccess:d})}
            .jslogContext=${"open-sign-up-dialog"}
            .variant=${"outlined"}>
              ${u(g.signUp)}
          </devtools-button>
        </div>
      `}
    </div>
  `}({receiveBadgesSetting:this.#n,receiveBadgesSettingContainerRef:this.#s,gdpProfile:this.#a,isEligibleToCreateProfile:this.#o,onSignUpSuccess:this.#c.bind(this)})}
      </fieldset>
    `,this.#e,{host:this})}async#c(){if(!e.GdpClient.isGdpProfilesAvailable())return;const i=await e.GdpClient.GdpClient.instance().getProfile();i&&(this.#a=i.profile??void 0,this.#o=i.isEligible,s.ScheduledRender.scheduleRender(this,this.#r))}}customElements.define("devtools-sync-section",y);var b=Object.freeze({__proto__:null,SyncSection:y});export{b as SyncSection};
//# sourceMappingURL=components.js.map
