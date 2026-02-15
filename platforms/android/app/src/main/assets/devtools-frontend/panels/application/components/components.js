import"../../../ui/components/chrome_link/chrome_link.js";import"../../../ui/components/expandable_list/expandable_list.js";import"../../../ui/components/report_view/report_view.js";import*as e from"../../../ui/legacy/legacy.js";import*as t from"../../../core/common/common.js";import*as r from"../../../core/i18n/i18n.js";import*as o from"../../../core/sdk/sdk.js";import"../../../ui/components/buttons/buttons.js";import*as a from"../../../ui/legacy/components/utils/utils.js";import*as i from"../../../ui/lit/lit.js";import{html as n,nothing as s,render as l}from"../../../ui/lit/lit.js";import*as c from"../../../ui/visual_logging/visual_logging.js";import"../../../ui/legacy/components/data_grid/data_grid.js";import*as d from"../../../ui/components/legacy_wrapper/legacy_wrapper.js";import*as u from"../../../core/platform/platform.js";import*as h from"../../../core/root/root.js";import*as p from"../../../models/bindings/bindings.js";import*as g from"../../../models/workspace/workspace.js";import*as m from"../../network/forward/forward.js";import*as v from"../../../third_party/csp_evaluator/csp_evaluator.js";import*as k from"../../../ui/components/render_coordinator/render_coordinator.js";import"../../../ui/components/icon_button/icon_button.js";import*as b from"../../../ui/components/adorners/adorners.js";import*as f from"../../../core/host/host.js";import*as w from"../../../ui/components/input/input.js";import*as y from"../../../ui/i18n/i18n.js";const S={notMainFrame:"Navigation happened in a frame other than the main frame.",backForwardCacheDisabled:"Back/forward cache is disabled by flags. Visit chrome://flags/#back-forward-cache to enable it locally on this device.",relatedActiveContentsExist:"The page was opened using '`window.open()`' and another tab has a reference to it, or the page opened a window.",HTTPStatusNotOK:"Only pages with a status code of 2XX can be cached.",schemeNotHTTPOrHTTPS:"Only pages whose URL scheme is HTTP / HTTPS can be cached.",loading:"The page did not finish loading before navigating away.",wasGrantedMediaAccess:"Pages that have granted access to record video or audio are not currently eligible for back/forward cache.",HTTPMethodNotGET:"Only pages loaded via a GET request are eligible for back/forward cache.",subframeIsNavigating:"An iframe on the page started a navigation that did not complete.",timeout:"The page exceeded the maximum time in back/forward cache and was expired.",cacheLimit:"The page was evicted from the cache to allow another page to be cached.",JavaScriptExecution:"Chrome detected an attempt to execute JavaScript while in the cache.",rendererProcessKilled:"The renderer process for the page in back/forward cache was killed.",rendererProcessCrashed:"The renderer process for the page in back/forward cache crashed.",grantedMediaStreamAccess:"Pages that have granted media stream access are not currently eligible for back/forward cache.",cacheFlushed:"The cache was intentionally cleared.",serviceWorkerVersionActivation:"The page was evicted from back/forward cache due to a service worker activation.",sessionRestored:"Chrome restarted and cleared the back/forward cache entries.",serviceWorkerPostMessage:"A service worker attempted to send the page in back/forward cache a `MessageEvent`.",enteredBackForwardCacheBeforeServiceWorkerHostAdded:"A service worker was activated while the page was in back/forward cache.",serviceWorkerClaim:"The page was claimed by a service worker while it is in back/forward cache.",haveInnerContents:"Pages that have certain kinds of embedded content (e.g. PDFs) are not currently eligible for back/forward cache.",timeoutPuttingInCache:"The page timed out entering back/forward cache (likely due to long-running pagehide handlers).",backForwardCacheDisabledByLowMemory:"Back/forward cache is disabled due to insufficient memory.",backForwardCacheDisabledByCommandLine:"Back/forward cache is disabled by the command line.",networkRequestDatapipeDrainedAsBytesConsumer:"Pages that have inflight fetch() or XHR are not currently eligible for back/forward cache.",networkRequestRedirected:"The page was evicted from back/forward cache because an active network request involved a redirect.",networkRequestTimeout:"The page was evicted from the cache because a network connection was open too long. Chrome limits the amount of time that a page may receive data while cached.",networkExceedsBufferLimit:"The page was evicted from the cache because an active network connection received too much data. Chrome limits the amount of data that a page may receive while cached.",navigationCancelledWhileRestoring:"Navigation was cancelled before the page could be restored from back/forward cache.",backForwardCacheDisabledForPrerender:"Back/forward cache is disabled for prerenderer.",userAgentOverrideDiffers:"Browser has changed the user agent override header.",foregroundCacheLimit:"The page was evicted from the cache to allow another page to be cached.",backForwardCacheDisabledForDelegate:"Back/forward cache is not supported by delegate.",unloadHandlerExistsInMainFrame:"The page has an unload handler in the main frame.",unloadHandlerExistsInSubFrame:"The page has an unload handler in a sub frame.",serviceWorkerUnregistration:"ServiceWorker was unregistered while a page was in back/forward cache.",noResponseHead:"Pages that do not have a valid response head cannot enter back/forward cache.",cacheControlNoStore:"Pages with cache-control:no-store header cannot enter back/forward cache.",ineligibleAPI:"Ineligible APIs were used.",internalError:"Internal error.",webSocket:"Pages with WebSocket cannot enter back/forward cache.",webTransport:"Pages with WebTransport cannot enter back/forward cache.",webRTC:"Pages with WebRTC cannot enter back/forward cache.",mainResourceHasCacheControlNoStore:"Pages whose main resource has cache-control:no-store cannot enter back/forward cache.",mainResourceHasCacheControlNoCache:"Pages whose main resource has cache-control:no-cache cannot enter back/forward cache.",subresourceHasCacheControlNoStore:"Pages whose subresource has cache-control:no-store cannot enter back/forward cache.",subresourceHasCacheControlNoCache:"Pages whose subresource has cache-control:no-cache cannot enter back/forward cache.",containsPlugins:"Pages containing plugins are not currently eligible for back/forward cache.",documentLoaded:"The document did not finish loading before navigating away.",dedicatedWorkerOrWorklet:"Pages that use a dedicated worker or worklet are not currently eligible for back/forward cache.",outstandingNetworkRequestOthers:"Pages with an in-flight network request are not currently eligible for back/forward cache.",outstandingIndexedDBTransaction:"Page with ongoing indexed DB transactions are not currently eligible for back/forward cache.",requestedNotificationsPermission:"Pages that have requested notifications permissions are not currently eligible for back/forward cache.",requestedMIDIPermission:"Pages that have requested MIDI permissions are not currently eligible for back/forward cache.",requestedAudioCapturePermission:"Pages that have requested audio capture permissions are not currently eligible for back/forward cache.",requestedVideoCapturePermission:"Pages that have requested video capture permissions are not currently eligible for back/forward cache.",requestedBackForwardCacheBlockedSensors:"Pages that have requested sensor permissions are not currently eligible for back/forward cache.",requestedBackgroundWorkPermission:"Pages that have requested background sync or fetch permissions are not currently eligible for back/forward cache.",broadcastChannel:"The page cannot be cached because it has a BroadcastChannel instance with registered listeners.",indexedDBConnection:"Pages that have an open IndexedDB connection are not currently eligible for back/forward cache.",webXR:"Pages that use WebXR are not currently eligible for back/forward cache.",sharedWorker:"Pages that use SharedWorker are not currently eligible for back/forward cache.",sharedWorkerMessage:"The page was evicted from the cache because it received a message from a SharedWorker",webLocks:"Pages that use WebLocks are not currently eligible for back/forward cache.",webHID:"Pages that use WebHID are not currently eligible for back/forward cache.",webShare:"Pages that use WebShare are not currently eligible for back/forwad cache.",requestedStorageAccessGrant:"Pages that have requested storage access are not currently eligible for back/forward cache.",webNfc:"Pages that use WebNfc are not currently eligible for back/forwad cache.",outstandingNetworkRequestFetch:"Pages with an in-flight fetch network request are not currently eligible for back/forward cache.",outstandingNetworkRequestXHR:"Pages with an in-flight XHR network request are not currently eligible for back/forward cache.",appBanner:"Pages that requested an AppBanner are not currently eligible for back/forward cache.",printing:"Pages that show Printing UI are not currently eligible for back/forward cache.",webDatabase:"Pages that use WebDatabase are not currently eligible for back/forward cache.",pictureInPicture:"Pages that use Picture-in-Picture are not currently eligible for back/forward cache.",speechRecognizer:"Pages that use SpeechRecognizer are not currently eligible for back/forward cache.",idleManager:"Pages that use IdleManager are not currently eligible for back/forward cache.",paymentManager:"Pages that use PaymentManager are not currently eligible for back/forward cache.",speechSynthesis:"Pages that use SpeechSynthesis are not currently eligible for back/forward cache.",keyboardLock:"Pages that use Keyboard lock are not currently eligible for back/forward cache.",webOTPService:"Pages that use WebOTPService are not currently eligible for bfcache.",outstandingNetworkRequestDirectSocket:"Pages with an in-flight network request are not currently eligible for back/forward cache.",injectedJavascript:"Pages that `JavaScript` is injected into by extensions are not currently eligible for back/forward cache.",injectedStyleSheet:"Pages that a `StyleSheet` is injected into by extensions are not currently eligible for back/forward cache.",contentDiscarded:"Undefined",contentSecurityHandler:"Pages that use SecurityHandler are not eligible for back/forward cache.",contentWebAuthenticationAPI:"Pages that use WebAuthetication API are not eligible for back/forward cache.",contentFileChooser:"Pages that use FileChooser API are not eligible for back/forward cache.",contentSerial:"Pages that use Serial API are not eligible for back/forward cache.",contentFileSystemAccess:"Pages that use File System Access API are not eligible for back/forward cache.",contentMediaDevicesDispatcherHost:"Pages that use Media Device Dispatcher are not eligible for back/forward cache.",contentWebBluetooth:"Pages that use WebBluetooth API are not eligible for back/forward cache.",contentWebUSB:"Pages that use WebUSB API are not eligible for back/forward cache.",contentMediaSession:"Pages that use MediaSession API and set a playback state are not eligible for back/forward cache.",contentMediaSessionService:"Pages that use MediaSession API and set action handlers are not eligible for back/forward cache.",contentMediaPlay:"A media player was playing upon navigating away.",contentScreenReader:"Back/forward cache is disabled due to screen reader.",embedderPopupBlockerTabHelper:"Popup blocker was present upon navigating away.",embedderSafeBrowsingTriggeredPopupBlocker:"Safe Browsing considered this page to be abusive and blocked popup.",embedderSafeBrowsingThreatDetails:"Safe Browsing details were shown upon navigating away.",embedderAppBannerManager:"App Banner was present upon navigating away.",embedderDomDistillerViewerSource:"DOM Distiller Viewer was present upon navigating away.",embedderDomDistillerSelfDeletingRequestDelegate:"DOM distillation was in progress upon navigating away.",embedderOomInterventionTabHelper:"Out-Of-Memory Intervention bar was present upon navigating away.",embedderOfflinePage:"The offline page was shown upon navigating away.",embedderChromePasswordManagerClientBindCredentialManager:"Chrome Password Manager was present upon navigating away.",embedderPermissionRequestManager:"There were permission requests upon navigating away.",embedderModalDialog:"Modal dialog such as form resubmission or http password dialog was shown for the page upon navigating away.",embedderExtensions:"Back/forward cache is disabled due to extensions.",embedderExtensionMessaging:"Back/forward cache is disabled due to extensions using messaging API.",embedderExtensionMessagingForOpenPort:"Extensions with long-lived connection should close the connection before entering back/forward cache.",embedderExtensionSentMessageToCachedFrame:"Extensions with long-lived connection attempted to send messages to frames in back/forward cache.",errorDocument:"Back/forward cache is disabled due to a document error.",fencedFramesEmbedder:"Pages using FencedFrames cannot be stored in bfcache.",keepaliveRequest:"Back/forward cache is disabled due to a keepalive request.",jsNetworkRequestReceivedCacheControlNoStoreResource:"Back/forward cache is disabled because some JavaScript network request received resource with `Cache-Control: no-store` header.",indexedDBEvent:"Back/forward cache is disabled due to an IndexedDB event.",cookieDisabled:"Back/forward cache is disabled because cookies are disabled on a page that uses `Cache-Control: no-store`.",webRTCUsedWithCCNS:"Back/forward cache is disabled because WebRTC has been used.",webTransportUsedWithCCNS:"Back/forward cache is disabled because WebTransport has been used.",webSocketUsedWithCCNS:"Back/forward cache is disabled because WebSocket has been used."},$=r.i18n.registerUIStrings("panels/application/components/BackForwardCacheStrings.ts",S),T=r.i18n.getLazilyComputedLocalizedString.bind(void 0,$),C={NotPrimaryMainFrame:{name:T(S.notMainFrame)},BackForwardCacheDisabled:{name:T(S.backForwardCacheDisabled)},RelatedActiveContentsExist:{name:T(S.relatedActiveContentsExist)},HTTPStatusNotOK:{name:T(S.HTTPStatusNotOK)},SchemeNotHTTPOrHTTPS:{name:T(S.schemeNotHTTPOrHTTPS)},Loading:{name:T(S.loading)},WasGrantedMediaAccess:{name:T(S.wasGrantedMediaAccess)},HTTPMethodNotGET:{name:T(S.HTTPMethodNotGET)},SubframeIsNavigating:{name:T(S.subframeIsNavigating)},Timeout:{name:T(S.timeout)},CacheLimit:{name:T(S.cacheLimit)},JavaScriptExecution:{name:T(S.JavaScriptExecution)},RendererProcessKilled:{name:T(S.rendererProcessKilled)},RendererProcessCrashed:{name:T(S.rendererProcessCrashed)},GrantedMediaStreamAccess:{name:T(S.grantedMediaStreamAccess)},CacheFlushed:{name:T(S.cacheFlushed)},ServiceWorkerVersionActivation:{name:T(S.serviceWorkerVersionActivation)},SessionRestored:{name:T(S.sessionRestored)},ServiceWorkerPostMessage:{name:T(S.serviceWorkerPostMessage)},EnteredBackForwardCacheBeforeServiceWorkerHostAdded:{name:T(S.enteredBackForwardCacheBeforeServiceWorkerHostAdded)},ServiceWorkerClaim:{name:T(S.serviceWorkerClaim)},HaveInnerContents:{name:T(S.haveInnerContents)},TimeoutPuttingInCache:{name:T(S.timeoutPuttingInCache)},BackForwardCacheDisabledByLowMemory:{name:T(S.backForwardCacheDisabledByLowMemory)},BackForwardCacheDisabledByCommandLine:{name:T(S.backForwardCacheDisabledByCommandLine)},NetworkRequestDatapipeDrainedAsBytesConsumer:{name:T(S.networkRequestDatapipeDrainedAsBytesConsumer)},NetworkRequestRedirected:{name:T(S.networkRequestRedirected)},NetworkRequestTimeout:{name:T(S.networkRequestTimeout)},NetworkExceedsBufferLimit:{name:T(S.networkExceedsBufferLimit)},NavigationCancelledWhileRestoring:{name:T(S.navigationCancelledWhileRestoring)},BackForwardCacheDisabledForPrerender:{name:T(S.backForwardCacheDisabledForPrerender)},UserAgentOverrideDiffers:{name:T(S.userAgentOverrideDiffers)},ForegroundCacheLimit:{name:T(S.foregroundCacheLimit)},BackForwardCacheDisabledForDelegate:{name:T(S.backForwardCacheDisabledForDelegate)},UnloadHandlerExistsInMainFrame:{name:T(S.unloadHandlerExistsInMainFrame)},UnloadHandlerExistsInSubFrame:{name:T(S.unloadHandlerExistsInSubFrame)},ServiceWorkerUnregistration:{name:T(S.serviceWorkerUnregistration)},NoResponseHead:{name:T(S.noResponseHead)},CacheControlNoStore:{name:T(S.cacheControlNoStore)},CacheControlNoStoreCookieModified:{name:T(S.cacheControlNoStore)},CacheControlNoStoreHTTPOnlyCookieModified:{name:T(S.cacheControlNoStore)},DisableForRenderFrameHostCalled:{name:T(S.ineligibleAPI)},BlocklistedFeatures:{name:T(S.ineligibleAPI)},SchedulerTrackedFeatureUsed:{name:T(S.ineligibleAPI)},DomainNotAllowed:{name:T(S.internalError)},ConflictingBrowsingInstance:{name:T(S.internalError)},NotMostRecentNavigationEntry:{name:T(S.internalError)},IgnoreEventAndEvict:{name:T(S.internalError)},BrowsingInstanceNotSwapped:{name:T(S.internalError)},ActivationNavigationsDisallowedForBug1234857:{name:T(S.internalError)},Unknown:{name:T(S.internalError)},RenderFrameHostReused_SameSite:{name:T(S.internalError)},RenderFrameHostReused_CrossSite:{name:T(S.internalError)},WebSocket:{name:T(S.webSocket)},WebTransport:{name:T(S.webTransport)},WebRTC:{name:T(S.webRTC)},MainResourceHasCacheControlNoStore:{name:T(S.mainResourceHasCacheControlNoStore)},MainResourceHasCacheControlNoCache:{name:T(S.mainResourceHasCacheControlNoCache)},SubresourceHasCacheControlNoStore:{name:T(S.subresourceHasCacheControlNoStore)},SubresourceHasCacheControlNoCache:{name:T(S.subresourceHasCacheControlNoCache)},ContainsPlugins:{name:T(S.containsPlugins)},DocumentLoaded:{name:T(S.documentLoaded)},DedicatedWorkerOrWorklet:{name:T(S.dedicatedWorkerOrWorklet)},OutstandingNetworkRequestOthers:{name:T(S.outstandingNetworkRequestOthers)},OutstandingIndexedDBTransaction:{name:T(S.outstandingIndexedDBTransaction)},RequestedNotificationsPermission:{name:T(S.requestedNotificationsPermission)},RequestedMIDIPermission:{name:T(S.requestedMIDIPermission)},RequestedAudioCapturePermission:{name:T(S.requestedAudioCapturePermission)},RequestedVideoCapturePermission:{name:T(S.requestedVideoCapturePermission)},RequestedBackForwardCacheBlockedSensors:{name:T(S.requestedBackForwardCacheBlockedSensors)},RequestedBackgroundWorkPermission:{name:T(S.requestedBackgroundWorkPermission)},BroadcastChannel:{name:T(S.broadcastChannel)},IndexedDBConnection:{name:T(S.indexedDBConnection)},WebXR:{name:T(S.webXR)},SharedWorker:{name:T(S.sharedWorker)},SharedWorkerMessage:{name:T(S.sharedWorkerMessage)},WebLocks:{name:T(S.webLocks)},WebHID:{name:T(S.webHID)},WebShare:{name:T(S.webShare)},RequestedStorageAccessGrant:{name:T(S.requestedStorageAccessGrant)},WebNfc:{name:T(S.webNfc)},OutstandingNetworkRequestFetch:{name:T(S.outstandingNetworkRequestFetch)},OutstandingNetworkRequestXHR:{name:T(S.outstandingNetworkRequestXHR)},AppBanner:{name:T(S.appBanner)},Printing:{name:T(S.printing)},WebDatabase:{name:T(S.webDatabase)},PictureInPicture:{name:T(S.pictureInPicture)},SpeechRecognizer:{name:T(S.speechRecognizer)},IdleManager:{name:T(S.idleManager)},PaymentManager:{name:T(S.paymentManager)},SpeechSynthesis:{name:T(S.speechSynthesis)},KeyboardLock:{name:T(S.keyboardLock)},WebOTPService:{name:T(S.webOTPService)},OutstandingNetworkRequestDirectSocket:{name:T(S.outstandingNetworkRequestDirectSocket)},InjectedJavascript:{name:T(S.injectedJavascript)},InjectedStyleSheet:{name:T(S.injectedStyleSheet)},Dummy:{name:T(S.internalError)},ContentDiscarded:{name:T(S.contentDiscarded)},ContentSecurityHandler:{name:T(S.contentSecurityHandler)},ContentWebAuthenticationAPI:{name:T(S.contentWebAuthenticationAPI)},ContentFileChooser:{name:T(S.contentFileChooser)},ContentSerial:{name:T(S.contentSerial)},ContentFileSystemAccess:{name:T(S.contentFileSystemAccess)},ContentMediaDevicesDispatcherHost:{name:T(S.contentMediaDevicesDispatcherHost)},ContentWebBluetooth:{name:T(S.contentWebBluetooth)},ContentWebUSB:{name:T(S.contentWebUSB)},ContentMediaSession:{name:T(S.contentMediaSession)},ContentMediaSessionService:{name:T(S.contentMediaSessionService)},ContentMediaPlay:{name:T(S.contentMediaPlay)},ContentScreenReader:{name:T(S.contentScreenReader)},EmbedderPopupBlockerTabHelper:{name:T(S.embedderPopupBlockerTabHelper)},EmbedderSafeBrowsingTriggeredPopupBlocker:{name:T(S.embedderSafeBrowsingTriggeredPopupBlocker)},EmbedderSafeBrowsingThreatDetails:{name:T(S.embedderSafeBrowsingThreatDetails)},EmbedderAppBannerManager:{name:T(S.embedderAppBannerManager)},EmbedderDomDistillerViewerSource:{name:T(S.embedderDomDistillerViewerSource)},EmbedderDomDistillerSelfDeletingRequestDelegate:{name:T(S.embedderDomDistillerSelfDeletingRequestDelegate)},EmbedderOomInterventionTabHelper:{name:T(S.embedderOomInterventionTabHelper)},EmbedderOfflinePage:{name:T(S.embedderOfflinePage)},EmbedderChromePasswordManagerClientBindCredentialManager:{name:T(S.embedderChromePasswordManagerClientBindCredentialManager)},EmbedderPermissionRequestManager:{name:T(S.embedderPermissionRequestManager)},EmbedderModalDialog:{name:T(S.embedderModalDialog)},EmbedderExtensions:{name:T(S.embedderExtensions)},EmbedderExtensionMessaging:{name:T(S.embedderExtensionMessaging)},EmbedderExtensionMessagingForOpenPort:{name:T(S.embedderExtensionMessagingForOpenPort)},EmbedderExtensionSentMessageToCachedFrame:{name:T(S.embedderExtensionSentMessageToCachedFrame)},ErrorDocument:{name:T(S.errorDocument)},FencedFramesEmbedder:{name:T(S.fencedFramesEmbedder)},KeepaliveRequest:{name:T(S.keepaliveRequest)},JsNetworkRequestReceivedCacheControlNoStoreResource:{name:T(S.jsNetworkRequestReceivedCacheControlNoStoreResource)},IndexedDBEvent:{name:T(S.indexedDBEvent)},CookieDisabled:{name:T(S.cookieDisabled)},WebRTCUsedWithCCNS:{name:T(S.webRTCUsedWithCCNS)},WebTransportUsedWithCCNS:{name:T(S.webTransportUsedWithCCNS)},WebSocketUsedWithCCNS:{name:T(S.webSocketUsedWithCCNS)},HTTPAuthRequired:{name:r.i18n.lockedLazyString("HTTPAuthRequired")},CookieFlushed:{name:r.i18n.lockedLazyString("CookieFlushed")},SmartCard:{name:r.i18n.lockedLazyString("SmartCard")},LiveMediaStreamTrack:{name:r.i18n.lockedLazyString("LiveMediaStreamTrack")},UnloadHandler:{name:r.i18n.lockedLazyString("UnloadHandler")},ParserAborted:{name:r.i18n.lockedLazyString("ParserAborted")},BroadcastChannelOnMessage:{name:r.i18n.lockedLazyString("BroadcastChannelOnMessage")},RequestedByWebViewClient:{name:r.i18n.lockedLazyString("RequestedByWebViewClient")},PostMessageByWebViewClient:{name:r.i18n.lockedLazyString("PostMessageByWebViewClient")},WebViewSettingsChanged:{name:r.i18n.lockedLazyString("WebViewSettingsChanged")},WebViewJavaScriptObjectChanged:{name:r.i18n.lockedLazyString("WebViewJavaScriptObjectChanged")},WebViewMessageListenerInjected:{name:r.i18n.lockedLazyString("WebViewMessageListenerInjected")},WebViewSafeBrowsingAllowlistChanged:{name:r.i18n.lockedLazyString("WebViewSafeBrowsingAllowlistChanged")},WebViewDocumentStartJavascriptChanged:{name:r.i18n.lockedLazyString("WebViewDocumentStartJavascriptChanged")},CacheControlNoStoreDeviceBoundSessionTerminated:{name:T(S.cacheControlNoStore)},CacheLimitPrunedOnModerateMemoryPressure:{name:r.i18n.lockedLazyString("CacheLimitPrunedOnModerateMemoryPressure")},CacheLimitPrunedOnCriticalMemoryPressure:{name:r.i18n.lockedLazyString("CacheLimitPrunedOnCriticalMemoryPressure")}};var x=`devtools-report-value{overflow:hidden}.inline-icon{vertical-align:sub}.gray-text{color:var(--sys-color-token-subtle);margin:0 0 5px 56px;display:flex;flex-direction:row;align-items:center;flex:auto;overflow-wrap:break-word;overflow:hidden;grid-column-start:span 2}.details-list{margin-left:56px;grid-column-start:span 2}.help-outline-icon{margin:0 2px}.circled-exclamation-icon{margin-right:10px;flex-shrink:0}.status{margin-right:11px;flex-shrink:0}.report-line{grid-column-start:span 2;display:flex;align-items:center;margin:0 30px;line-height:26px}.report-key{color:var(--sys-color-token-subtle);min-width:auto;overflow-wrap:break-word;align-self:start}.report-value{padding:0 6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}devtools-report-value:has(devtools-tree-outline){margin-left:var(--sys-size-7)}.cache-status-section:focus-visible{outline:0}.tree-outline li .selection{margin-left:-5px}@media (forced-colors: active){.link,\n  .devtools-link{color:linktext;text-decoration-color:linktext}}\n/*# sourceURL=${import.meta.resolve("./backForwardCacheView.css")} */`;const P={mainFrame:"Main Frame",backForwardCacheTitle:"Back/forward cache",unavailable:"unavailable",url:"URL",unknown:"Unknown Status",normalNavigation:"Not served from back/forward cache: to trigger back/forward cache, use Chrome's back/forward buttons, or use the test button below to automatically navigate away and back.",restoredFromBFCache:"Successfully served from back/forward cache.",pageSupportNeeded:"Actionable",testCompleted:"Back/forward cache test completed.",pageSupportNeededExplanation:"These reasons are actionable i.e. they can be cleaned up to make the page eligible for back/forward cache.",circumstantial:"Not Actionable",circumstantialExplanation:"These reasons are not actionable i.e. caching was prevented by something outside of the direct control of the page.",supportPending:"Pending Support",runTest:"Test back/forward cache",runningTest:"Running test",learnMore:"Learn more: back/forward cache eligibility",neverUseUnload:"Learn more: Never use unload handler",supportPendingExplanation:"Chrome support for these reasons is pending i.e. they will not prevent the page from being eligible for back/forward cache in a future version of Chrome.",blockingExtensionId:"Extension id: ",framesTitle:"Frames",issuesInSingleFrame:"{n, plural, =1 {# issue found in 1 frame.} other {# issues found in 1 frame.}}",issuesInMultipleFrames:"{n, plural, =1 {# issue found in {m} frames.} other {# issues found in {m} frames.}}",framesPerIssue:"{n, plural, =1 {# frame} other {# frames}}",blankURLTitle:"Blank URL [{PH1}]",filesPerIssue:"{n, plural, =1 {# file} other {# files}}"},R=r.i18n.registerUIStrings("panels/application/components/BackForwardCacheView.ts",P),M=r.i18n.getLocalizedString.bind(void 0,R);function I(e,r,o,a,i){if(!e)return n`
      <devtools-report-key>
        ${M(P.mainFrame)}
      </devtools-report-key>
      <devtools-report-value>
        ${M(P.unavailable)}
      </devtools-report-value>`;const l="Running"===a,d=t.ParsedURL.schemeIs(e.url,"devtools:");return n`
    ${function(e){switch(e){case!0:return n`
        <devtools-report-section autofocus tabindex="-1">
          <div class="status extra-large">
            <devtools-icon class="inline-icon extra-large" name="check-circle" style="color: var(--icon-checkmark-green);">
            </devtools-icon>
          </div>
          ${M(P.restoredFromBFCache)}
        </devtools-report-section>`;case!1:return n`
        <devtools-report-section autofocus tabindex="-1">
          <div class="status">
            <devtools-icon class="inline-icon extra-large" name="clear">
            </devtools-icon>
          </div>
          ${M(P.normalNavigation)}
        </devtools-report-section>`}return n`
    <devtools-report-section autofocus tabindex="-1">
      ${M(P.unknown)}
    </devtools-report-section>`}(e.backForwardCacheDetails.restoredFromCache)}
    <devtools-report-key>${M(P.url)}</devtools-report-key>
    <devtools-report-value>${e.url}</devtools-report-value>
    ${function(e){if(!e||0===e.frameCount&&0===e.issueCount)return s;function t(e){return n`
      <li role="treeitem" class="text-ellipsis">
        ${e.iconName?n`
          <devtools-icon class="inline-icon extra-large" .name=${e.iconName} style="margin-bottom: -3px;">
          </devtools-icon>
        `:s}
        ${e.text}
        ${e.children?.length?n`
          <ul role="group" hidden>
            ${e.children.map(e=>t(e))}
          </ul>`:s}
      </li>`}let r="";r=1===e.frameCount?M(P.issuesInSingleFrame,{n:e.issueCount}):M(P.issuesInMultipleFrames,{n:e.issueCount,m:e.frameCount});return n`
    <devtools-report-key jslog=${c.section("frames")}>${M(P.framesTitle)}</devtools-report-key>
    <devtools-report-value>
      <devtools-tree .template=${n`
        <ul role="tree">
          <li role="treeitem" class="text-ellipsis">
            ${r}
            <ul role="group">
              ${t(e.node)}
            </ul>
          </li>
        </ul>
      `}>
      </devtools-tree>
    </devtools-report-value>`}(r)}
    <devtools-report-section>
      <devtools-button
        aria-label=${M(P.runTest)}
        .disabled=${l||d}
        .spinner=${l}
        .variant=${"primary"}
        @click=${i}
        jslog=${c.action("back-forward-cache.run-test").track({click:!0})}>
        ${l?n`
          ${M(P.runningTest)}`:`\n          ${M(P.runTest)}\n        `}
      </devtools-button>
    </devtools-report-section>
    <devtools-report-divider>
    </devtools-report-divider>
    ${function(e,t,r){if(0===e.length)return s;const o=e.filter(e=>"PageSupportNeeded"===e.type),a=e.filter(e=>"SupportPending"===e.type),i=e.filter(e=>"Circumstantial"===e.type);return n`
    ${D(M(P.pageSupportNeeded),M(P.pageSupportNeededExplanation),o,r)}
    ${D(M(P.supportPending),M(P.supportPendingExplanation),a,r)}
    ${D(M(P.circumstantial),M(P.circumstantialExplanation),i,r)}`}(e.backForwardCacheDetails.explanations,e.backForwardCacheDetails.explanationsTree,o)}
    <devtools-report-section>
      <x-link href="https://web.dev/bfcache/" class="link"
      jslog=${c.action("learn-more.eligibility").track({click:!0})}>
        ${M(P.learnMore)}
      </x-link>
    </devtools-report-section>`}function D(e,t,r,o){return n`
    ${r.length>0?n`
      <devtools-report-section-header>
        ${e}
        <div class="help-outline-icon">
          <devtools-icon class="inline-icon medium" name="help" title=${t}>
          </devtools-icon>
        </div>
      </devtools-report-section-header>
      ${r.map(e=>function(e,t){return n`
    <devtools-report-section>
      ${e.reason in C?n`
          <div class="circled-exclamation-icon">
            <devtools-icon class="inline-icon medium" style="color: var(--icon-warning)" name="warning">
            </devtools-icon>
          </div>
          <div>
            ${C[e.reason].name()}
            ${function(e){if("UnloadHandlerExistsInMainFrame"===e.reason||"UnloadHandlerExistsInSubFrame"===e.reason)return n`
        <x-link href="https://web.dev/bfcache/#never-use-the-unload-event" class="link"
        jslog=${c.action("learn-more.never-use-unload").track({click:!0})}>
          ${M(P.neverUseUnload)}
        </x-link>`;return s}(e)}
            ${function(e){if("EmbedderExtensionSentMessageToCachedFrame"===e.reason&&e.context){const t="chrome://extensions/?id="+e.context;return n`${M(P.blockingExtensionId)}
      <devtools-chrome-link .href=${t}>${e.context}</devtools-chrome-link>`}return s}(e)}
          </div>`:s}
    </devtools-report-section>
    <div class="gray-text">
      ${e.reason}
    </div>
    ${function(e){if(void 0===e||0===e.length)return s;const t=50,r=new a.Linkifier.Linkifier(t),o=[n`<div>${M(P.filesPerIssue,{n:e.length})}</div>`];return o.push(...e.map(e=>n`${r.linkifyScriptLocation(null,null,e.url,e.lineNumber,{columnNumber:e.columnNumber,showColumnNumber:!0,inlineFrameIndex:0})}`)),n`
      <div class="details-list">
        <devtools-expandable-list .data=${{rows:o}}></devtools-expandable-list>
      </div>
    `}(e.details)}
    ${function(e){if(void 0===e||0===e.length)return s;const t=[n`<div>${M(P.framesPerIssue,{n:e.length})}</div>`];return t.push(...e.map(e=>n`<div class="text-ellipsis" title=${e}
    jslog=${c.treeItem()}>${e}</div>`)),n`
      <div class="details-list"
      jslog=${c.tree("frames-per-issue")}>
        <devtools-expandable-list .data=${{rows:t,title:M(P.framesPerIssue,{n:e.length})}}
        jslog=${c.treeItem()}></devtools-expandable-list>
      </div>
    `}(t)}`}(e,o.get(e.reason)))}
    `:s}`}const B=(e,t,r)=>{l(n`
    <style>${x}</style>
    <devtools-report .data=${{reportTitle:M(P.backForwardCacheTitle)}} jslog=${c.pane("back-forward-cache")}>

      ${I(e.frame,e.frameTreeData,e.reasonToFramesMap,e.screenStatus,e.navigateAwayAndBack)}
    </devtools-report>
  `,r)};class A extends e.Widget.Widget{#e="Result";#t=0;#r;constructor(e=B){super({useShadowDom:!0,delegatesFocus:!0}),this.#r=e,this.#o()?.addEventListener(o.ResourceTreeModel.Events.PrimaryPageChanged,this.requestUpdate,this),this.#o()?.addEventListener(o.ResourceTreeModel.Events.BackForwardCacheDetailsUpdated,this.requestUpdate,this),this.requestUpdate()}#o(){const e=o.TargetManager.TargetManager.instance().primaryPageTarget();return e?.model(o.ResourceTreeModel.ResourceTreeModel)||null}#a(){return this.#o()?.mainFrame||null}async performUpdate(){const e=new Map,t=this.#a(),r=t?.backForwardCacheDetails?.explanationsTree;r&&this.#i(r,{blankCount:1},e);const o=this.#n(r,{blankCount:1});o.node.iconName="frame";const a={frame:t,frameTreeData:o,reasonToFramesMap:e,screenStatus:this.#e,navigateAwayAndBack:this.#s.bind(this)};this.#r(a,void 0,this.contentElement)}#l(){o.TargetManager.TargetManager.instance().removeModelListener(o.ResourceTreeModel.ResourceTreeModel,o.ResourceTreeModel.Events.FrameNavigated,this.#l,this),this.#e="Result",this.requestUpdate(),this.updateComplete.then(()=>{e.ARIAUtils.LiveAnnouncer.alert(M(P.testCompleted)),this.contentElement.focus()})}async#c(){o.TargetManager.TargetManager.instance().removeModelListener(o.ResourceTreeModel.ResourceTreeModel,o.ResourceTreeModel.Events.FrameNavigated,this.#c,this),await this.#d(50)}async#d(e){const t=o.TargetManager.TargetManager.instance().primaryPageTarget(),r=t?.model(o.ResourceTreeModel.ResourceTreeModel),a=await(r?.navigationHistory());r&&a&&(a.currentIndex===this.#t?window.setTimeout(this.#d.bind(this,2*e),e):(o.TargetManager.TargetManager.instance().addModelListener(o.ResourceTreeModel.ResourceTreeModel,o.ResourceTreeModel.Events.FrameNavigated,this.#l,this),r.navigateToHistoryEntry(a.entries[a.currentIndex-1])))}async#s(){const e=o.TargetManager.TargetManager.instance().primaryPageTarget(),t=e?.model(o.ResourceTreeModel.ResourceTreeModel),r=await(t?.navigationHistory());t&&r&&(this.#t=r.currentIndex,this.#e="Running",this.requestUpdate(),o.TargetManager.TargetManager.instance().addModelListener(o.ResourceTreeModel.ResourceTreeModel,o.ResourceTreeModel.Events.FrameNavigated,this.#c,this),t.navigate("chrome://terms"))}#n(e,t){if(!e)return{node:{text:""},frameCount:0,issueCount:0};let r=1,o=0;const a=[];let i="";e.url.length?i=e.url:(i=M(P.blankURLTitle,{PH1:t.blankCount}),t.blankCount+=1);for(const t of e.explanations){const e={text:t.reason};o+=1,a.push(e)}for(const i of e.children){const e=this.#n(i,t);e.issueCount>0&&(a.push(e.node),o+=e.issueCount,r+=e.frameCount)}let n={text:`(${o}) ${i}`};return a.length?(n={...n,children:a},n.iconName="iframe"):e.url.length||(t.blankCount-=1),{node:n,frameCount:r,issueCount:o}}#i(e,t,r){let o=e.url;0===o.length&&(o=M(P.blankURLTitle,{PH1:t.blankCount}),t.blankCount+=1),e.explanations.forEach(e=>{let t=r.get(e.reason);void 0===t?(t=[o],r.set(e.reason,t)):t.push(o)}),e.children.map(e=>{this.#i(e,t,r)})}}var F=Object.freeze({__proto__:null,BackForwardCacheView:A}),E=`devtools-data-grid{margin-top:0}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}@media (forced-colors: active){.link,\n  .devtools-link{color:linktext;text-decoration-color:linktext}}\n/*# sourceURL=${import.meta.resolve("./bounceTrackingMitigationsView.css")} */`;const{html:L}=i,N={bounceTrackingMitigationsTitle:"Bounce tracking mitigations",forceRun:"Force run",runningMitigations:"Running",stateDeletedFor:"State was deleted for the following sites:",checkingPotentialTrackers:"Checking for potential bounce tracking sites.",learnMore:"Learn more: Bounce Tracking Mitigations",noPotentialBounceTrackersIdentified:"State was not cleared for any potential bounce tracking sites. Either none were identified or third-party cookies are not blocked.",featureDisabled:"Bounce tracking mitigations are disabled."},O=r.i18n.registerUIStrings("panels/application/components/BounceTrackingMitigationsView.ts",N),U=r.i18n.getLocalizedString.bind(void 0,O);class W extends d.LegacyWrapper.WrappableComponent{#u=this.attachShadow({mode:"open"});#h=[];#e="Result";#p=!1;#g=!1;connectedCallback(){this.#m(),this.parentElement?.classList.add("overflow-auto")}async#m(){i.render(L`
      <style>${E}</style>
      <devtools-report .data=${{reportTitle:U(N.bounceTrackingMitigationsTitle)}}
                       jslog=${c.pane("bounce-tracking-mitigations")}>
        ${await this.#v()}
      </devtools-report>
    `,this.#u,{host:this})}async#v(){return this.#p||await this.#k(),"Disabled"===this.#e?L`
        <devtools-report-section>
          ${U(N.featureDisabled)}
        </devtools-report-section>
      `:L`
      <devtools-report-section>
        ${this.#b()}
      </devtools-report-section>
      ${this.#f()}
      <devtools-report-divider>
      </devtools-report-divider>
      <devtools-report-section>
        <x-link href="https://privacycg.github.io/nav-tracking-mitigations/#bounce-tracking-mitigations" class="link"
        jslog=${c.link("learn-more").track({click:!0})}>
          ${U(N.learnMore)}
        </x-link>
      </devtools-report-section>
    `}#b(){const e="Running"===this.#e;return L`
      <devtools-button
        aria-label=${U(N.forceRun)}
        .disabled=${e}
        .spinner=${e}
        .variant=${"primary"}
        @click=${this.#w}
        jslog=${c.action("force-run").track({click:!0})}>
        ${e?L`
          ${U(N.runningMitigations)}`:`\n          ${U(N.forceRun)}\n        `}
      </devtools-button>
    `}#f(){return this.#g?0===this.#h.length?L`
        <devtools-report-section>
        ${"Running"===this.#e?L`
          ${U(N.checkingPotentialTrackers)}`:`\n          ${U(N.noPotentialBounceTrackersIdentified)}\n        `}
        </devtools-report-section>
      `:L`
      <devtools-report-section>
        <devtools-data-grid striped inline>
          <table>
            <tr>
              <th id="sites" weight="10" sortable>
                ${U(N.stateDeletedFor)}
              </th>
            </tr>
            ${this.#h.map(e=>L`
              <tr><td>${e}</td></tr>`)}
          </table>
        </devtools-data-grid>
      </devtools-report-section>
    `:i.nothing}async#w(){const e=o.TargetManager.TargetManager.instance().primaryPageTarget();if(!e)return;this.#g=!0,this.#e="Running",this.#m();const t=await e.storageAgent().invoke_runBounceTrackingMitigations();this.#h=[],t.deletedSites.forEach(e=>{this.#h.push(e)}),this.#y()}#y(){this.#e="Result",this.#m()}async#k(){this.#p=!0;const e=o.TargetManager.TargetManager.instance().primaryPageTarget();e&&((await e.systemInfo().invoke_getFeatureState({featureState:"DIPS"})).featureEnabled||(this.#e="Disabled"))}}customElements.define("devtools-bounce-tracking-mitigations-view",W);var H=Object.freeze({__proto__:null,BounceTrackingMitigationsView:W,i18nString:U}),q=`@scope to (devtools-widget > *){:scope{overflow:auto;height:100%}.endpoints-container{height:100%;display:flex;flex-direction:column;width:100%}.endpoints-header{font-size:15px;background-color:var(--sys-color-surface2);padding:1px 4px;flex-shrink:0}devtools-data-grid{flex:auto}}\n/*# sourceURL=${import.meta.resolve("./endpointsGrid.css")} */`;const j={noEndpointsToDisplay:"No endpoints to display",endpointsDescription:"Here you will find the list of endpoints that receive the reports"},_=r.i18n.registerUIStrings("panels/application/components/EndpointsGrid.ts",j),z=r.i18n.getLocalizedString.bind(void 0,_),{render:V,html:G}=i,K=(t,o,a)=>{V(G`
    <style>${q}</style>
    <style>${e.inspectorCommonStyles}</style>
    <div class="endpoints-container" jslog=${c.section("endpoints")}>
      <div class="endpoints-header">${r.i18n.lockedString("Endpoints")}</div>
      ${t.endpoints.size>0?G`
        <devtools-data-grid striped>
         <table>
          <tr>
            <th id="origin" weight="30">${r.i18n.lockedString("Origin")}</th>
            <th id="name" weight="20">${r.i18n.lockedString("Name")}</th>
            <th id="url" weight="30">${r.i18n.lockedString("URL")}</th>
          </tr>
          ${Array.from(t.endpoints).map(([e,t])=>t.map(t=>G`<tr>
                <td>${e}</td>
                <td>${t.groupName}</td>
                <td>${t.url}</td>
              </tr>`)).flat()}
          </table>
        </devtools-data-grid>
      `:G`
        <div class="empty-state">
          <span class="empty-state-header">${z(j.noEndpointsToDisplay)}</span>
          <span class="empty-state-description">${z(j.endpointsDescription)}</span>
        </div>
      `}
    </div>
  `,a)};class X extends e.Widget.Widget{endpoints=new Map;#r;constructor(e,t=K){super(e),this.#r=t,this.requestUpdate()}performUpdate(){this.#r({endpoints:this.endpoints},void 0,this.contentElement)}}var J=Object.freeze({__proto__:null,DEFAULT_VIEW:K,EndpointsGrid:X,i18nString:z}),Y=`button.link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;border:none;background:none;font-family:inherit;font-size:inherit}\n/*# sourceURL=${import.meta.resolve("./stackTraceLinkButton.css")} */`,Q=`.stack-trace-row{display:flex}.stack-trace-function-name{width:100px}.stack-trace-source-location{display:flex;overflow:hidden}.text-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.stack-trace-source-location .text-ellipsis{padding-right:2px}.ignore-list-link{opacity:60%}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;border:none;background:none;font-family:inherit;font-size:var(--sys-size-6);&:focus-visible{outline:2px solid var(--sys-color-state-focus-ring);outline-offset:0;border-radius:var(--sys-shape-corner-extra-small)}}\n/*# sourceURL=${import.meta.resolve("./stackTraceRow.css")} */`;const{html:Z}=i,ee={cannotRenderStackTrace:"Cannot render stack trace",showSMoreFrames:"{n, plural, =1 {Show # more frame} other {Show # more frames}}",showLess:"Show less",creationStackTrace:"Frame Creation `Stack Trace`"},te=r.i18n.registerUIStrings("panels/application/components/StackTrace.ts",ee),re=r.i18n.getLocalizedString.bind(void 0,te);class oe extends HTMLElement{#u=this.attachShadow({mode:"open"});#S=null;set data(e){this.#S=e.stackTraceRowItem,this.#m()}#m(){this.#S&&i.render(Z`
      <style>${Q}</style>
      <div class="stack-trace-row">
              <div class="stack-trace-function-name text-ellipsis" title=${this.#S.functionName}>
                ${this.#S.functionName}
              </div>
              <div class="stack-trace-source-location">
                ${this.#S.link?Z`<div class="text-ellipsis">\xA0@\xA0${this.#S.link}</div>`:i.nothing}
              </div>
            </div>
    `,this.#u,{host:this})}}class ae extends HTMLElement{#u=this.attachShadow({mode:"open"});#$=()=>{};#T=null;#C=!1;set data(e){this.#$=e.onShowAllClick,this.#T=e.hiddenCallFramesCount,this.#C=e.expandedView,this.#m()}#m(){if(!this.#T)return;const e=this.#C?re(ee.showLess):re(ee.showSMoreFrames,{n:this.#T});i.render(Z`
      <style>${Y}</style>
      <div class="stack-trace-row">
          <button class="link" @click=${()=>this.#$()}>
            ${e}
          </button>
        </div>
    `,this.#u,{host:this})}}class ie extends HTMLElement{#u=this.attachShadow({mode:"open"});#x=new a.Linkifier.Linkifier;#P=[];#R=!1;set data(e){const t=e.frame,{creationStackTrace:r,creationStackTraceTarget:o}=t.getCreationStackTraceData();r&&(this.#P=e.buildStackTraceRows(r,o,this.#x,!0,this.#M.bind(this))),this.#m()}#M(e){this.#P=e,this.#m()}#I(){this.#R=!this.#R,this.#m()}createRowTemplates(){const e=[];let t=0;for(const r of this.#P){let o=!1;if("link"in r&&r.link){const e=a.Linkifier.Linkifier.uiLocation(r.link);o=Boolean(e?.isIgnoreListed())}!this.#R&&o||("functionName"in r&&e.push(Z`
          <devtools-stack-trace-row data-stack-trace-row .data=${{stackTraceRowItem:r}}></devtools-stack-trace-row>`),"asyncDescription"in r&&e.push(Z`
            <div>${r.asyncDescription}</div>
          `)),"functionName"in r&&o&&t++}return t&&e.push(Z`
      <devtools-stack-trace-link-button data-stack-trace-row .data=${{onShowAllClick:this.#I.bind(this),hiddenCallFramesCount:t,expandedView:this.#R}}></devtools-stack-trace-link-button>
      `),e}#m(){if(!this.#P.length)return void i.render(Z`
          <span>${re(ee.cannotRenderStackTrace)}</span>
        `,this.#u,{host:this});const e=this.createRowTemplates();i.render(Z`
        <devtools-expandable-list .data=${{rows:e,title:re(ee.creationStackTrace)}}
                                  jslog=${c.tree()}>
        </devtools-expandable-list>
      `,this.#u,{host:this})}}customElements.define("devtools-stack-trace-row",oe),customElements.define("devtools-stack-trace-link-button",ae),customElements.define("devtools-resources-stack-trace",ie);var ne=Object.freeze({__proto__:null,StackTrace:ie,StackTraceLinkButton:ae,StackTraceRow:oe}),se=`.text-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button ~ .text-ellipsis{padding-left:2px}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px;padding:0;margin-left:var(--sys-size-3);white-space:nowrap}button.link{border:none;background:none;font-family:inherit;font-size:inherit;height:16px}button.link:has(devtools-icon){margin-top:5px}devtools-button.help-button{top:4px;position:relative}button.text-link{padding-left:2px;height:26px}.inline-button{padding-left:1ex}.inline-comment{padding-left:1ex;white-space:pre-line}.inline-comment::before{content:"("}.inline-comment::after{content:")"}.inline-name{color:var(--sys-color-token-subtle);padding-inline:4px;user-select:none;white-space:pre-line}.inline-items{display:flex}.span-cols{grid-column-start:span 2;margin-left:var(--sys-size-9);line-height:28px}.report-section:has(.link){line-height:var(--sys-size-12)}.without-min-width{min-width:auto}.bold{font-weight:bold}.link:not(button):has(devtools-icon){vertical-align:baseline;margin-inline-start:3px}.inline-icon{margin-bottom:-5px;width:18px;height:18px;vertical-align:baseline}@media (forced-colors: active){.link,\n  .devtools-link{color:linktext;text-decoration-color:linktext}}\n/*# sourceURL=${import.meta.resolve("./frameDetailsReportView.css")} */`,le=`:host .badge-error{--override-adorner-text-color:var(--sys-color-error-bright);--override-adorner-border-color:var(--sys-color-error-bright)}:host .badge-success{--override-adorner-text-color:var(--sys-color-tertiary);--override-adorner-border-color:var(--sys-color-tertiary)}:host .badge-secondary{--override-adorner-text-color:var(--sys-color-token-subtle);--override-adorner-border-color:var(--sys-color-token-subtle)}:host devtools-adorner{font-family:var(--source-code-font-family)}.token-status-badge{display:none}[aria-expanded='false'] .token-status-badge{display:inline-flex}\n/*# sourceURL=${import.meta.resolve("./badge.css")} */`,ce=`.content{display:grid;grid-template-columns:min-content 1fr}.key{color:var(--sys-color-token-subtle);padding:0 6px;text-align:right;white-space:pre}.value{color:var(--sys-color-token-subtle);margin-inline-start:0;padding:0 6px}.error-text{color:var(--sys-color-error-bright);font-weight:bold}\n/*# sourceURL=${import.meta.resolve("./originTrialTokenRows.css")} */`,de=`.status-badge{border-radius:4px;padding:4px;background:var(--sys-color-neutral-container);& > devtools-icon{vertical-align:sub}}\n/*# sourceURL=${import.meta.resolve("./originTrialTreeView.css")} */`;const{html:ue,Directives:{ifDefined:he}}=i,pe={origin:"Origin",trialName:"Trial Name",expiryTime:"Expiry Time",usageRestriction:"Usage Restriction",isThirdParty:"Third Party",matchSubDomains:"Subdomain Matching",rawTokenText:"Raw Token",status:"Token Status",token:"Token",tokens:"{PH1} tokens",noTrialTokens:"No trial tokens"},ge=r.i18n.registerUIStrings("panels/application/components/OriginTrialTreeView.ts",pe),me=r.i18n.getLocalizedString.bind(void 0,ge);function ve(e){const t=new b.Adorner.Adorner,r=document.createElement("span");return r.textContent=e.badgeContent,t.data={name:"badge",content:r},t.classList.add(`badge-${e.style}`),e.additionalClass&&t.classList.add(e.additionalClass),t}function ke(e){const t=ve({badgeContent:me(pe.tokens,{PH1:e.tokensWithStatus.length}),style:"secondary"});return ue`
    <li role="treeitem">
      ${e.trialName}
      <style>${le}</style>
      ${ve({badgeContent:e.status,style:"Enabled"===e.status?"success":"error"})}
      ${e.tokensWithStatus.length>1?t:i.nothing}
      <ul role="group" hidden>
        ${e.tokensWithStatus.length>1?e.tokensWithStatus.map(be):fe(e.tokensWithStatus[0])}
      </ul>
    </li>`}function be(e){const t=ve({badgeContent:e.status,style:"Success"===e.status?"success":"error",additionalClass:"token-status-badge"});return ue`
    <li role="treeitem">
      ${me(pe.token)} ${t}
      <ul role="group" hidden>
        ${fe(e)}
      </ul>
    </li>`}function fe(e){return ue`
    ${function(e){return ue`
    <li role="treeitem">
      <devtools-resources-origin-trial-token-rows .data=${e}>
      </devtools-resources-origin-trial-token-rows>
    </li>`}(e)}
    ${t=e.rawTokenText,ue`
    <li role="treeitem">
      ${me(pe.rawTokenText)}
      <ul role="group" hidden>
        <li role="treeitem">
          <div style="overflow-wrap: break-word;">
            ${t}
          </div>
        </li>
      </ul>
    </li>`}
  `;var t}class we extends HTMLElement{#u=this.attachShadow({mode:"open"});#D=null;#B=[];#A=new Intl.DateTimeFormat(r.DevToolsLocale.DevToolsLocale.instance().locale,{dateStyle:"long",timeStyle:"long"});set data(e){this.#D=e,this.#F()}connectedCallback(){this.#m()}cloneNode(){const t=e.UIUtils.cloneCustomElement(this);return this.#D&&(t.data=this.#D),t}#E=(e,t)=>ue`
        <div class=${he(t?"error-text":void 0)}>
          ${e}
        </div>`;#F(){this.#D?.parsedToken&&(this.#B=[{name:me(pe.origin),value:this.#E(this.#D.parsedToken.origin,"WrongOrigin"===this.#D.status)},{name:me(pe.expiryTime),value:this.#E(this.#A.format(1e3*this.#D.parsedToken.expiryTime),"Expired"===this.#D.status)},{name:me(pe.usageRestriction),value:this.#E(this.#D.parsedToken.usageRestriction)},{name:me(pe.isThirdParty),value:this.#E(this.#D.parsedToken.isThirdParty.toString())},{name:me(pe.matchSubDomains),value:this.#E(this.#D.parsedToken.matchSubDomains.toString())}],"UnknownTrial"===this.#D.status&&(this.#B=[{name:me(pe.trialName),value:this.#E(this.#D.parsedToken.trialName)},...this.#B]))}#m(){if(!this.#D)return;const e=[{name:me(pe.status),value:ue`
          <style>${le}</style>
          ${ve({badgeContent:this.#D.status,style:"Success"===this.#D.status?"success":"error"})}`},...this.#B].map(e=>ue`
          <div class="key">${e.name}</div>
          <div class="value">${e.value}</div>
          `);i.render(ue`
      <style>
        ${ce}
      </style>
      <div class="content">
        ${e}
      </div>
    `,this.#u,{host:this})}}customElements.define("devtools-resources-origin-trial-token-rows",we);const ye=(e,t,r)=>{e.trials.length?i.render(ue`
    <style>
      ${de}
    </style>
    <devtools-tree .template=${ue`
      <ul role="tree">
        ${e.trials.map(ke)}
      </ul>
    `}>
    </devtools-tree>
  `,r):i.render(ue`
      <style>${de}</style>
      <span class="status-badge">
        <devtools-icon class="medium" name="clear"></devtools-icon>
        <span>${me(pe.noTrialTokens)}</span>
      </span>`,r)};class Se extends e.Widget.Widget{#L={trials:[]};#r;constructor(e,t=ye){super(e,{useShadowDom:!0}),this.#r=t}set data(e){this.#L=e,this.requestUpdate()}performUpdate(){this.#r(this.#L,void 0,this.contentElement)}}var $e=Object.freeze({__proto__:null,OriginTrialTokenRows:we,OriginTrialTreeView:Se}),Te=`:host{display:contents}.text-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.link,\n.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}button.link{border:none;background:none;font-family:inherit;font-size:inherit}.policies-list{padding-top:3px}.permissions-row{display:flex;line-height:22px}.permissions-row div{padding-right:5px}.feature-name{width:135px}.allowed-icon{vertical-align:sub}.block-reason{width:215px}.disabled-features-button{padding-left:var(--sys-size-3)}\n/*# sourceURL=${import.meta.resolve("./permissionsPolicySection.css")} */`;const{html:Ce}=i,xe={showDetails:"Show details",hideDetails:"Hide details",allowedFeatures:"Allowed Features",disabledFeatures:"Disabled Features",clickToShowHeader:'Click to reveal the request whose "`Permissions-Policy`" HTTP header disables this feature.',clickToShowIframe:"Click to reveal the top-most iframe which does not allow this feature in the elements panel.",disabledByIframe:'missing in iframe "`allow`" attribute',disabledByHeader:'disabled by "`Permissions-Policy`" header',disabledByFencedFrame:"disabled inside a `fencedframe`"},Pe=r.i18n.registerUIStrings("panels/application/components/PermissionsPolicySection.ts",xe),Re=r.i18n.getLocalizedString.bind(void 0,Pe);function Me(e,t,r,o){return Ce`
  <devtools-button
    .iconName=${e}
    title=${t}
    aria-label=${t}
    .variant=${"icon"}
    .size=${"SMALL"}
    @click=${r}
    jslog=${c.action().track({click:!0}).context(o)}></devtools-button>
  `}class Ie extends HTMLElement{#u=this.attachShadow({mode:"open"});#N={policies:[],showDetails:!1};set data(e){this.#N=e,this.#m()}#O(){this.#N.showDetails=!this.#N.showDetails,this.#m()}#U(){const e=this.#N.policies.filter(e=>e.allowed).map(e=>e.feature).sort();return e.length?Ce`
      <devtools-report-key>${Re(xe.allowedFeatures)}</devtools-report-key>
      <devtools-report-value>
        ${e.join(", ")}
      </devtools-report-value>
    `:i.nothing}async#W(){const e=this.#N.policies.filter(e=>!e.allowed).sort((e,t)=>e.feature.localeCompare(t.feature));if(!e.length)return i.nothing;if(!this.#N.showDetails)return Ce`
        <devtools-report-key>${Re(xe.disabledFeatures)}</devtools-report-key>
        <devtools-report-value>
          ${e.map(e=>e.feature).join(", ")}
          <devtools-button
          class="disabled-features-button"
          .variant=${"outlined"}
          @click=${()=>this.#O()}
          jslog=${c.action("show-disabled-features-details").track({click:!0})}>${Re(xe.showDetails)}
        </devtools-button>
        </devtools-report-value>
      `;const r=o.FrameManager.FrameManager.instance(),a=await Promise.all(e.map(async e=>{const o=e.locator?r.getFrame(e.locator.frameId):null,a=e.locator?.blockReason,n=await("IframeAttribute"===a&&o?.getOwnerDOMNodeOrDocument()),s=o?.resourceForURL(o.url),l="Header"===a&&s?.request,c=(()=>{switch(a){case"IframeAttribute":return Re(xe.disabledByIframe);case"Header":return Re(xe.disabledByHeader);case"InFencedFrameTree":return Re(xe.disabledByFencedFrame);default:return""}})();return Ce`
        <div class="permissions-row">
          <div>
            <devtools-icon class="allowed-icon extra-large" name="cross-circle">
            </devtools-icon>
          </div>
          <div class="feature-name text-ellipsis">
            ${e.feature}
          </div>
          <div class="block-reason">${c}</div>
          <div>
            ${n?Me("code-circle",Re(xe.clickToShowIframe),()=>t.Revealer.reveal(n),"reveal-in-elements"):i.nothing}
            ${l?Me("arrow-up-down-circle",Re(xe.clickToShowHeader),async()=>{if(!l)return;const e=l.responseHeaderValue("permissions-policy")?"permissions-policy":"feature-policy",r=m.UIRequestLocation.UIRequestLocation.responseHeaderMatch(l,{name:e,value:""});await t.Revealer.reveal(r)},"reveal-in-network"):i.nothing}
          </div>
        </div>
      `}));return Ce`
      <devtools-report-key>${Re(xe.disabledFeatures)}</devtools-report-key>
      <devtools-report-value class="policies-list">
        ${a}
        <div class="permissions-row">
        <devtools-button
          .variant=${"outlined"}
          @click=${()=>this.#O()}
          jslog=${c.action("hide-disabled-features-details").track({click:!0})}>${Re(xe.hideDetails)}
        </devtools-button>
        </div>
      </devtools-report-value>
    `}async#m(){await k.write("PermissionsPolicySection render",()=>{i.render(Ce`
          <style>${Te}</style>
          <devtools-report-section-header>${r.i18n.lockedString("Permissions Policy")}</devtools-report-section-header>
          ${this.#U()}
          ${this.#N.policies.findIndex(e=>e.allowed)>0||this.#N.policies.findIndex(e=>!e.allowed)>0?Ce`<devtools-report-divider class="subsection-divider"></devtools-report-divider>`:i.nothing}
          ${i.Directives.until(this.#W(),i.nothing)}
          <devtools-report-divider></devtools-report-divider>
        `,this.#u,{host:this})})}}customElements.define("devtools-resources-permissions-policy-section",Ie);const{html:De}=i,{widgetConfig:Be}=e.Widget,Ae={additionalInformation:"Additional Information",thisAdditionalDebugging:"This additional (debugging) information is shown because the 'Protocol Monitor' experiment is enabled.",frameId:"Frame ID",document:"Document",url:"URL",clickToOpenInSourcesPanel:"Click to open in Sources panel",clickToOpenInNetworkPanel:"Click to open in Network panel",unreachableUrl:"Unreachable URL",clickToOpenInNetworkPanelMight:"Click to open in Network panel (might require page reload)",origin:"Origin",ownerElement:"Owner Element",clickToOpenInElementsPanel:"Click to open in Elements panel",adStatus:"Ad Status",rootDescription:"This frame has been identified as the root frame of an ad",root:"root",childDescription:"This frame has been identified as a child frame of an ad",child:"child",securityIsolation:"Security & Isolation",contentSecurityPolicy:"Content Security Policy (CSP)",secureContext:"Secure Context",yes:"Yes",no:"No",crossoriginIsolated:"Cross-Origin Isolated",localhostIsAlwaysASecureContext:"`Localhost` is always a secure context",aFrameAncestorIsAnInsecure:"A frame ancestor is an insecure context",theFramesSchemeIsInsecure:"The frame's scheme is insecure",reportingTo:"reporting to",apiAvailability:"API availability",availabilityOfCertainApisDepends:"Availability of certain APIs depends on the document being cross-origin isolated.",availableTransferable:"available, transferable",availableNotTransferable:"available, not transferable",unavailable:"unavailable",sharedarraybufferConstructorIs:"`SharedArrayBuffer` constructor is available and `SABs` can be transferred via `postMessage`",sharedarraybufferConstructorIsAvailable:"`SharedArrayBuffer` constructor is available but `SABs` cannot be transferred via `postMessage`",willRequireCrossoriginIsolated:"⚠️ will require cross-origin isolated context in the future",requiresCrossoriginIsolated:"requires cross-origin isolated context",transferRequiresCrossoriginIsolatedPermission:"`SharedArrayBuffer` transfer requires enabling the permission policy:",available:"available",thePerformanceAPI:"The `performance.measureUserAgentSpecificMemory()` API is available",thePerformancemeasureuseragentspecificmemory:"The `performance.measureUserAgentSpecificMemory()` API is not available",measureMemory:"Measure Memory",learnMore:"Learn more",creationStackTrace:"Frame Creation `Stack Trace`",creationStackTraceExplanation:"This frame was created programmatically. The `stack trace` shows where this happened.",parentIsAdExplanation:"This frame is considered an ad frame because its parent frame is an ad frame.",matchedBlockingRuleExplanation:"This frame is considered an ad frame because its current (or previous) main document is an ad resource.",createdByAdScriptExplanation:"There was an ad script in the `(async) stack` when this frame was created. Examining the creation `stack trace` of this frame might provide more insight.",creatorAdScriptAncestry:"Creator Ad Script Ancestry",rootScriptFilterlistRule:"Root Script Filterlist Rule",none:"None",originTrialsExplanation:"Origin trials give you access to a new or experimental feature."},Fe=r.i18n.registerUIStrings("panels/application/components/FrameDetailsView.ts",Ae),Ee=r.i18n.getLocalizedString.bind(void 0,Fe);class Le extends d.LegacyWrapper.WrappableComponent{#u=this.attachShadow({mode:"open"});#H;#q=null;#j=!1;#_=null;#N={policies:[],showDetails:!1};#x=new a.Linkifier.Linkifier;#z=null;constructor(e){super(),this.#H=e,this.render()}connectedCallback(){this.parentElement?.classList.add("overflow-auto"),this.#j=h.Runtime.experiments.isEnabled("protocol-monitor")}async render(){const e=await(this.#H?.parentFrame()?.getAdScriptAncestry(this.#H?.id));if(e&&e.ancestryChain.length>0){this.#z=e;const t=this.#z.ancestryChain[0],r=t?.debuggerId?await o.DebuggerModel.DebuggerModel.modelForDebuggerId(t.debuggerId):null;this.#q=r?.target()??null}!this.#_&&this.#H&&(this.#_=this.#H.getPermissionsPolicyState()),await k.write("FrameDetailsView render",async()=>{this.#H&&i.render(De`
        <style>${se}</style>
        <devtools-report .data=${{reportTitle:this.#H.displayName()}}
        jslog=${c.pane("frames")}>
          ${this.#V()}
          ${this.#G()}
          ${this.#K()}
          ${await this.#X()}
          ${i.Directives.until(this.#_?.then(e=>(this.#N.policies=e||[],De`
              <devtools-resources-permissions-policy-section
                .data=${this.#N}
              >
              </devtools-resources-permissions-policy-section>
            `)),i.nothing)}
          ${this.#j?this.#J():i.nothing}
        </devtools-report>
      `,this.#u,{host:this})})}async#X(){if(!this.#H)return i.nothing;const e={trials:await this.#H.getOriginTrials()};return De`
    <devtools-report-section-header>
      ${r.i18n.lockedString("Origin trials")}
    </devtools-report-section-header>
    <devtools-report-section>
      <span class="report-section">
        ${Ee(Ae.originTrialsExplanation)}
        <x-link href="https://developer.chrome.com/docs/web-platform/origin-trials/" class="link"
                jslog=${c.link("learn-more.origin-trials").track({click:!0})}>
          ${Ee(Ae.learnMore)}
        </x-link>
      </span>
    </devtools-report-section>
    <devtools-widget class="span-cols" .widgetConfig=${Be(Se,{data:e})}>
    </devtools-widget>
    <devtools-report-divider></devtools-report-divider>`}#V(){return this.#H?De`
      <devtools-report-section-header>${Ee(Ae.document)}</devtools-report-section-header>
      <devtools-report-key>${Ee(Ae.url)}</devtools-report-key>
      <devtools-report-value>
        <div class="inline-items">
          ${this.#Y()}
          ${this.#Q()}
          <div class="text-ellipsis" title=${this.#H.url}>${this.#H.url}</div>
        </div>
      </devtools-report-value>
      ${this.#Z()}
      ${this.#ee()}
      ${i.Directives.until(this.#te(),i.nothing)}
      ${this.#re()}
      ${this.#oe()}
      ${this.#ae()}
      <devtools-report-divider></devtools-report-divider>
    `:i.nothing}#Y(){const e=this.#H;return!e||e.unreachableUrl()?i.nothing:Me("label",Ee(Ae.clickToOpenInSourcesPanel),async()=>{const r=this.#ie(e);r&&await t.Revealer.reveal(r)},"reveal-in-sources")}#Q(){if(this.#H){const e=this.#H.resourceForURL(this.#H.url);if(e?.request){const r=e.request;return Me("arrow-up-down-circle",Ee(Ae.clickToOpenInNetworkPanel),()=>{const e=m.UIRequestLocation.UIRequestLocation.tab(r,"headers-component");return t.Revealer.reveal(e)},"reveal-in-network")}}return i.nothing}#ie(e){for(const t of g.Workspace.WorkspaceImpl.instance().projects()){const r=p.NetworkProject.NetworkProject.getTargetForProject(t);if(r&&r===e.resourceTreeModel().target()){const r=t.uiSourceCodeForURL(e.url);if(r)return r}}return null}#Z(){return this.#H&&this.#H.unreachableUrl()?De`
      <devtools-report-key>${Ee(Ae.unreachableUrl)}</devtools-report-key>
      <devtools-report-value>
        <div class="inline-items">
          ${this.#ne()}
          <div class="text-ellipsis" title=${this.#H.unreachableUrl()}>${this.#H.unreachableUrl()}</div>
        </div>
      </devtools-report-value>
    `:i.nothing}#ne(){if(this.#H){const e=t.ParsedURL.ParsedURL.fromString(this.#H.unreachableUrl());if(e)return Me("arrow-up-down-circle",Ee(Ae.clickToOpenInNetworkPanelMight),()=>{t.Revealer.reveal(m.UIFilter.UIRequestFilter.filters([{filterType:m.UIFilter.FilterType.Domain,filterValue:e.domain()},{filterType:null,filterValue:e.path}]))},"unreachable-url.reveal-in-network")}return i.nothing}#ee(){return this.#H&&this.#H.securityOrigin&&"://"!==this.#H.securityOrigin?De`
        <devtools-report-key>${Ee(Ae.origin)}</devtools-report-key>
        <devtools-report-value>
          <div class="text-ellipsis" title=${this.#H.securityOrigin}>${this.#H.securityOrigin}</div>
        </devtools-report-value>
      `:i.nothing}async#te(){if(this.#H){const e=await this.#H.getOwnerDOMNodeOrDocument();if(e)return De`
          <devtools-report-key>${Ee(Ae.ownerElement)}</devtools-report-key>
          <devtools-report-value class="without-min-width">
            <div class="inline-items">
              <button class="link text-link" role="link" tabindex=0 title=${Ee(Ae.clickToOpenInElementsPanel)}
                @mouseenter=${()=>this.#H?.highlight()}
                @mouseleave=${()=>o.OverlayModel.OverlayModel.hideDOMNodeHighlight()}
                @click=${()=>t.Revealer.reveal(e)}
                jslog=${c.action("reveal-in-elements").track({click:!0})}
              >
                &lt;${e.nodeName().toLocaleLowerCase()}&gt;
              </button>
            </div>
          </devtools-report-value>
        `}return i.nothing}#re(){const e=this.#H?.getCreationStackTraceData();return e?.creationStackTrace?De`
        <devtools-report-key title=${Ee(Ae.creationStackTraceExplanation)}>${Ee(Ae.creationStackTrace)}</devtools-report-key>
        <devtools-report-value
        jslog=${c.section("frame-creation-stack-trace")}
        >
          <devtools-resources-stack-trace .data=${{frame:this.#H,buildStackTraceRows:a.JSPresentationUtils.buildStackTraceRows}}>
          </devtools-resources-stack-trace>
        </devtools-report-value>
      `:i.nothing}#se(e){switch(e){case"child":return{value:Ee(Ae.child),description:Ee(Ae.childDescription)};case"root":return{value:Ee(Ae.root),description:Ee(Ae.rootDescription)}}}#le(e){switch(e){case"CreatedByAdScript":return Ee(Ae.createdByAdScriptExplanation);case"MatchedBlockingRule":return Ee(Ae.matchedBlockingRuleExplanation);case"ParentIsAd":return Ee(Ae.parentIsAdExplanation)}}#oe(){if(!this.#H)return i.nothing;const e=this.#H.adFrameType();if("none"===e)return i.nothing;const t=this.#se(e),r=[De`<div title=${t.description}>${t.value}</div>`];for(const e of this.#H.adFrameStatus()?.explanations||[])r.push(De`<div>${this.#le(e)}</div>`);return De`
      <devtools-report-key>${Ee(Ae.adStatus)}</devtools-report-key>
      <devtools-report-value class="ad-status-list" jslog=${c.section("ad-status")}>
        <devtools-expandable-list .data=${{rows:r,title:Ee(Ae.adStatus)}}>
        </devtools-expandable-list>
      </devtools-report-value>`}#ae(){if(!this.#H)return i.nothing;if("none"===this.#H.adFrameType())return i.nothing;if(!this.#q||!this.#z||0===this.#z.ancestryChain.length)return i.nothing;const e=this.#z.ancestryChain.map(e=>{const t=this.#x.linkifyScriptLocation(this.#q,e.scriptId||null,u.DevToolsPath.EmptyUrlString,void 0,void 0);return t?.setAttribute("jslog",`${c.link("ad-script").track({click:!0})}`),De`<div>${t}</div>`}),t=void 0!==this.#z.rootScriptFilterlistRule;return De`
      <devtools-report-key>${Ee(Ae.creatorAdScriptAncestry)}</devtools-report-key>
      <devtools-report-value class="creator-ad-script-ancestry-list" jslog=${c.section("creator-ad-script-ancestry")}>
        <devtools-expandable-list .data=${{rows:e,title:Ee(Ae.creatorAdScriptAncestry)}}>
        </devtools-expandable-list>
      </devtools-report-value>
      ${t?De`
        <devtools-report-key>${Ee(Ae.rootScriptFilterlistRule)}</devtools-report-key>
        <devtools-report-value jslog=${c.section("root-script-filterlist-rule")}>${this.#z.rootScriptFilterlistRule}</devtools-report-value>
      `:i.nothing}
    `}#G(){return this.#H?De`
      <devtools-report-section-header>${Ee(Ae.securityIsolation)}</devtools-report-section-header>
      <devtools-report-key>${Ee(Ae.secureContext)}</devtools-report-key>
      <devtools-report-value>
        ${this.#H.isSecureContext()?Ee(Ae.yes):Ee(Ae.no)}\xA0${this.#ce()}
      </devtools-report-value>
      <devtools-report-key>${Ee(Ae.crossoriginIsolated)}</devtools-report-key>
      <devtools-report-value>
        ${this.#H.isCrossOriginIsolated()?Ee(Ae.yes):Ee(Ae.no)}
      </devtools-report-value>
      ${i.Directives.until(this.#de(),i.nothing)}
      <devtools-report-divider></devtools-report-divider>
    `:i.nothing}#ce(){const e=this.#ue();return e?De`<span class="inline-comment">${e}</span>`:i.nothing}#ue(){switch(this.#H?.getSecureContextType()){case"Secure":return null;case"SecureLocalhost":return Ee(Ae.localhostIsAlwaysASecureContext);case"InsecureAncestor":return Ee(Ae.aFrameAncestorIsAnInsecure);case"InsecureScheme":return Ee(Ae.theFramesSchemeIsInsecure)}return null}async#de(){if(this.#H){const e=this.#H.resourceTreeModel().target().model(o.NetworkManager.NetworkManager),t=e&&await e.getSecurityIsolationStatus(this.#H.id);if(t)return De`
          ${this.#he(t.coep,r.i18n.lockedString("Cross-Origin Embedder Policy (COEP)"),"None")}
          ${this.#he(t.coop,r.i18n.lockedString("Cross-Origin Opener Policy (COOP)"),"UnsafeNone")}
          ${this.#pe(t.csp)}
        `}return i.nothing}#he(e,t,r){if(!e)return i.nothing;const o=e.value!==r,a=!o&&e.reportOnlyValue!==r,n=o?e.reportingEndpoint:e.reportOnlyReportingEndpoint;return De`
      <devtools-report-key>${t}</devtools-report-key>
      <devtools-report-value>
        ${function(e){switch(e){case"Credentialless":return"credentialless";case"None":return"none";case"RequireCorp":return"require-corp";case"NoopenerAllowPopups":return"noopenener-allow-popups";case"SameOrigin":return"same-origin";case"SameOriginAllowPopups":return"same-origin-allow-popups";case"SameOriginPlusCoep":return"same-origin-plus-coep";case"RestrictProperties":return"restrict-properties";case"RestrictPropertiesPlusCoep":return"restrict-properties-plus-coep";case"UnsafeNone":return"unsafe-none"}}(o?e.value:e.reportOnlyValue)}
        ${a?De`<span class="inline-comment">report-only</span>`:i.nothing}
        ${n?De`<span class="inline-name">${Ee(Ae.reportingTo)}</span>${n}`:i.nothing}
      </devtools-report-value>
    `}#ge(e){const t=new v.CspParser.CspParser(e).csp.directives,r=[];for(const e in t)r.push(De`
          <div>
            <span class="bold">${e}</span>
            ${": "+t[e]?.join(", ")}
          </div>`);return r}#me(e,t){return De`
      <devtools-report-key>
        ${e.isEnforced?r.i18n.lockedString("Content-Security-Policy"):De`
          ${r.i18n.lockedString("Content-Security-Policy-Report-Only")}
          <devtools-button
            .iconName=${"help"}
            class='help-button'
            .variant=${"icon"}
            .size=${"SMALL"}
            @click=${()=>{window.location.href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only"}}
            jslog=${c.link("learn-more.csp-report-only").track({click:!0})}
            ></devtools-button>`}
      </devtools-report-key>
      <devtools-report-value>
        ${"HTTP"===e.source?r.i18n.lockedString("HTTP header"):r.i18n.lockedString("Meta tag")}
        ${this.#ge(e.effectiveDirectives)}
      </devtools-report-value>
      ${t?De`<devtools-report-divider class="subsection-divider"></devtools-report-divider>`:i.nothing}
    `}#pe(e){return De`
      <devtools-report-divider></devtools-report-divider>
      <devtools-report-section-header>
        ${Ee(Ae.contentSecurityPolicy)}
      </devtools-report-section-header>
      ${e?.length?e.map((t,r)=>this.#me(t,r<e?.length-1)):De`
        <devtools-report-key>
          ${r.i18n.lockedString("Content-Security-Policy")}
        </devtools-report-key>
        <devtools-report-value>
          ${Ee(Ae.none)}
        </devtools-report-value>
      `}
    `}#K(){return this.#H?De`
      <devtools-report-section-header>
        ${Ee(Ae.apiAvailability)}
      </devtools-report-section-header>
      <devtools-report-section>
        <span class="report-section">
          ${Ee(Ae.availabilityOfCertainApisDepends)}
          <x-link
            href="https://web.dev/why-coop-coep/" class="link"
            jslog=${c.link("learn-more.coop-coep").track({click:!0})}>
            ${Ee(Ae.learnMore)}
          </x-link>
        </span>
      </devtools-report-section>
      ${this.#ve()}
      ${this.#ke()}
      <devtools-report-divider></devtools-report-divider>`:i.nothing}#ve(){if(this.#H){const e=this.#H.getGatedAPIFeatures();if(e){const t=e.includes("SharedArrayBuffers"),r=t&&e.includes("SharedArrayBuffersTransferAllowed"),o=Ee(r?Ae.availableTransferable:t?Ae.availableNotTransferable:Ae.unavailable),a=r?Ee(Ae.sharedarraybufferConstructorIs):t?Ee(Ae.sharedarraybufferConstructorIsAvailable):"";function n(e){switch(e.getCrossOriginIsolatedContextType()){case"Isolated":return i.nothing;case"NotIsolated":return t?De`
                  <span class="inline-comment">
                    ${Ee(Ae.willRequireCrossoriginIsolated)}
                  </span>`:De`<span class="inline-comment">${Ee(Ae.requiresCrossoriginIsolated)}</span>`;case"NotIsolatedFeatureDisabled":if(!r)return De`
                  <span class="inline-comment">
                    ${Ee(Ae.transferRequiresCrossoriginIsolatedPermission)}
                    <code> cross-origin-isolated</code>
                  </span>`}return i.nothing}return De`
          <devtools-report-key>SharedArrayBuffers</devtools-report-key>
          <devtools-report-value title=${a}>
            ${o}\xA0${n(this.#H)}
          </devtools-report-value>
        `}}return i.nothing}#ke(){if(this.#H){const e=this.#H.isCrossOriginIsolated(),t=Ee(e?Ae.available:Ae.unavailable),r=Ee(e?Ae.thePerformanceAPI:Ae.thePerformancemeasureuseragentspecificmemory);return De`
        <devtools-report-key>${Ee(Ae.measureMemory)}</devtools-report-key>
        <devtools-report-value>
          <span title=${r}>${t}</span>\xA0<x-link class="link" href="https://web.dev/monitor-total-page-memory-usage/" jslog=${c.link("learn-more.monitor-memory-usage").track({click:!0})}>${Ee(Ae.learnMore)}</x-link>
        </devtools-report-value>
      `}return i.nothing}#J(){return this.#H?De`
      <devtools-report-section-header
        title=${Ee(Ae.thisAdditionalDebugging)}
      >${Ee(Ae.additionalInformation)}</devtools-report-section-header>
      <devtools-report-key>${Ee(Ae.frameId)}</devtools-report-key>
      <devtools-report-value>
        <div class="text-ellipsis" title=${this.#H.id}>${this.#H.id}</div>
      </devtools-report-value>
      <devtools-report-divider></devtools-report-divider>
    `:i.nothing}}customElements.define("devtools-resources-frame-details-view",Le);var Ne=Object.freeze({__proto__:null,FrameDetailsReportView:Le}),Oe=`:host{display:flex;padding:20px;height:100%}.heading{font-size:15px}devtools-data-grid{margin-top:20px}.info-icon{vertical-align:text-bottom;height:14px}.no-events-message{margin-top:20px}\n/*# sourceURL=${import.meta.resolve("./interestGroupAccessGrid.css")} */`;const{html:Ue}=i,We={allInterestGroupStorageEvents:"All interest group storage events.",eventTime:"Event Time",eventType:"Access Type",groupOwner:"Owner",groupName:"Name",noEvents:"No interest group events detected",interestGroupDescription:"On this page you can inspect and analyze interest groups"},He=r.i18n.registerUIStrings("panels/application/components/InterestGroupAccessGrid.ts",We),qe=r.i18n.getLocalizedString.bind(void 0,He);class je extends HTMLElement{#u=this.attachShadow({mode:"open"});#be=[];connectedCallback(){this.#m()}set data(e){this.#be=e,this.#m()}#m(){i.render(Ue`
      <style>${Oe}</style>
      <style>${e.inspectorCommonStyles}</style>
      ${0===this.#be.length?Ue`
          <div class="empty-state">
            <span class="empty-state-header">${qe(We.noEvents)}</span>
            <span class="empty-state-description">${qe(We.interestGroupDescription)}</span>
          </div>`:Ue`
          <div>
            <span class="heading">Interest Groups</span>
            <devtools-icon class="info-icon medium" name="info"
                          title=${qe(We.allInterestGroupStorageEvents)}>
            </devtools-icon>
            ${this.#fe()}
          </div>`}
    `,this.#u,{host:this})}#fe(){return Ue`
      <devtools-data-grid striped inline>
        <table>
          <tr>
            <th id="event-time" sortable weight="10">${qe(We.eventTime)}</td>
            <th id="event-type" sortable weight="5">${qe(We.eventType)}</td>
            <th id="event-group-owner" sortable weight="10">${qe(We.groupOwner)}</td>
            <th id="event-group-name" sortable weight="10">${qe(We.groupName)}</td>
          </tr>
          ${this.#be.map(e=>Ue`
          <tr @select=${()=>this.dispatchEvent(new CustomEvent("select",{detail:e}))}>
            <td>${new Date(1e3*e.accessTime).toLocaleString()}</td>
            <td>${e.type}</td>
            <td>${e.ownerOrigin}</td>
            <td>${e.name}</td>
          </tr>
        `)}
        </table>
      </devtools-data-grid>`}}customElements.define("devtools-interest-group-access-grid",je);var _e=Object.freeze({__proto__:null,InterestGroupAccessGrid:je,i18nString:qe}),ze=`:host{display:flex;flex-direction:column}.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:2px}.devtools-link:focus-visible{outline-width:unset}input.devtools-text-input[type="text"]{padding:3px 6px;margin-left:4px;margin-right:4px;width:250px;height:25px}input.devtools-text-input[type="text"]::placeholder{color:var(--sys-color-token-subtle)}.protocol-handlers-row{margin:var(--sys-size-3) 0}.inline-icon{width:16px;height:16px;&[name="check-circle"]{color:var(--icon-checkmark-green)}}@media (forced-colors: active){.devtools-link:not(.devtools-link-prevent-click){color:linktext}.devtools-link:focus-visible{background:Highlight;color:HighlightText}}\n/*# sourceURL=${import.meta.resolve("./protocolHandlersView.css")} */`;const{html:Ve}=i,Ge={protocolDetected:"Found valid protocol handler registration in the {PH1}. With the app installed, test the registered protocols.",protocolNotDetected:"Define protocol handlers in the {PH1} to register your app as a handler for custom protocols when your app is installed.",needHelpReadOur:"Need help? Read {PH1}.",protocolHandlerRegistrations:"URL protocol handler registration for PWAs",manifest:"manifest",testProtocol:"Test protocol",dropdownLabel:"Select protocol handler",textboxLabel:"Query parameter or endpoint for protocol handler",textboxPlaceholder:"Enter URL"},Ke=r.i18n.registerUIStrings("panels/application/components/ProtocolHandlersView.ts",Ge),Xe=r.i18n.getLocalizedString.bind(void 0,Ke);class Je extends HTMLElement{#u=this.attachShadow({mode:"open"});#we=[];#ye=u.DevToolsPath.EmptyUrlString;#Se="";#$e="";set data(e){const t=this.#ye!==e.manifestLink;this.#we=e.protocolHandlers,this.#ye=e.manifestLink,t&&this.#Te()}#Te(){this.#$e="",this.#Se=this.#we[0]?.protocol??"",this.#m()}#Ce(){const t=e.XLink.XLink.create(this.#ye,Xe(Ge.manifest),void 0,void 0,"manifest"),r=this.#we.length>0?Ge.protocolDetected:Ge.protocolNotDetected;return Ve`
    <div class="protocol-handlers-row status">
            <devtools-icon class="inline-icon"
                           name=${this.#we.length>0?"check-circle":"info"}>
            </devtools-icon>
            ${y.getFormatLocalizedString(Ke,r,{PH1:t})}
    </div>
    `}#xe(){if(0===this.#we.length)return i.nothing;const e=this.#we.filter(e=>e.protocol).map(e=>Ve`<option value=${e.protocol} jslog=${c.item(e.protocol).track({click:!0})}>${e.protocol}://</option>`);return Ve`
       <div class="protocol-handlers-row">
        <select class="protocol-select" @change=${this.#Pe} aria-label=${Xe(Ge.dropdownLabel)}>
           ${e}
        </select>
        <input .value=${this.#$e} class="devtools-text-input" type="text" @change=${this.#Re} aria-label=${Xe(Ge.textboxLabel)}
        placeholder=${Xe(Ge.textboxPlaceholder)} />
        <devtools-button .variant=${"primary"} @click=${this.#Me}>
            ${Xe(Ge.testProtocol)}
        </devtools-button>
        </div>
      `}#Pe=e=>{this.#Se=e.target.value};#Re=e=>{this.#$e=e.target.value,this.#m()};#Me=()=>{const e=`${this.#Se}://${this.#$e}`;f.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(e),f.userMetrics.actionTaken(f.UserMetrics.Action.CaptureTestProtocolClicked)};#m(){const t=e.XLink.XLink.create("https://web.dev/url-protocol-handler/",Xe(Ge.protocolHandlerRegistrations),void 0,void 0,"learn-more");i.render(Ve`
      <style>${ze}</style>
      <style>${e.inspectorCommonStyles}</style>
      <style>${w.textInputStyles}</style>
      ${this.#Ce()}
      <div class="protocol-handlers-row">
          ${y.getFormatLocalizedString(Ke,Ge.needHelpReadOur,{PH1:t})}
      </div>
      ${this.#xe()}
    `,this.#u,{host:this})}}customElements.define("devtools-protocol-handlers-view",Je);var Ye=Object.freeze({__proto__:null,ProtocolHandlersView:Je}),Qe=`@scope to (devtools-widget > *){:scope{overflow:auto;height:100%}.reporting-container{height:100%;display:flex;flex-direction:column;width:100%}.reporting-header{font-size:15px;background-color:var(--sys-color-surface2);padding:1px 4px;flex-shrink:0}devtools-data-grid{flex:auto}.inline-icon{vertical-align:text-bottom}}\n/*# sourceURL=${import.meta.resolve("./reportsGrid.css")} */`;const Ze={noReportsToDisplay:"No reports to display",reportingApiDescription:"Here you will find reporting api reports that are generated by the page.",learnMore:"Learn more",status:"Status",destination:"Destination",generatedAt:"Generated at"},et=r.i18n.registerUIStrings("panels/application/components/ReportsGrid.ts",Ze),tt=r.i18n.getLocalizedString.bind(void 0,et),{render:rt,html:ot}=i,at=(t,o,a)=>{rt(ot`
    <style>${Qe}</style>
    <style>${e.inspectorCommonStyles}</style>
    <div class="reporting-container" jslog=${c.section("reports")}>
      <div class="reporting-header">${r.i18n.lockedString("Reports")}</div>
      ${t.reports.length>0?ot`
        <devtools-data-grid striped>
          <table>
            <tr>
              ${t.protocolMonitorExperimentEnabled?ot`
                <th id="id" weight="30">${r.i18n.lockedString("ID")}</th>
              `:""}
              <th id="url" weight="30">${r.i18n.lockedString("URL")}</th>
              <th id="type" weight="20">${r.i18n.lockedString("Type")}</th>
              <th id="status" weight="20">
                <style>${Qe}</style>
                <span class="status-header">${tt(Ze.status)}</span>
                <x-link href="https://web.dev/reporting-api/#report-status"
                jslog=${c.link("report-status").track({click:!0})}>
                  <devtools-icon class="inline-icon medium" name="help" style="color: var(--icon-link);"
                  ></devtools-icon>
                </x-link>
              </th>
              <th id="destination" weight="20">${tt(Ze.destination)}</th>
              <th id="timestamp" weight="20">${tt(Ze.generatedAt)}</th>
              <th id="body" weight="20">${r.i18n.lockedString("Body")}</th>
            </tr>
            ${t.reports.map(e=>ot`
              <tr @select=${()=>t.onSelect(e.id)}>
                ${t.protocolMonitorExperimentEnabled?ot`<td>${e.id}</td>`:""}
                <td>${e.initiatorUrl}</td>
                <td>${e.type}</td>
                <td>${e.status}</td>
                <td>${e.destination}</td>
                <td>${new Date(1e3*e.timestamp).toLocaleString()}</td>
                <td>${JSON.stringify(e.body)}</td>
              </tr>
            `)}
          </table>
        </devtools-data-grid>
      `:ot`
        <div class="empty-state">
          <span class="empty-state-header">${tt(Ze.noReportsToDisplay)}</span>
          <div class="empty-state-description">
            <span>${tt(Ze.reportingApiDescription)}</span>
            ${e.XLink.XLink.create("https://developer.chrome.com/docs/capabilities/web-apis/reporting-api",tt(Ze.learnMore),void 0,void 0,"learn-more")}
          </div>
        </div>
      `}
    </div>
  `,a)};class it extends e.Widget.Widget{reports=[];#j=!1;#r;onReportSelected=()=>{};constructor(e,t=at){super(e),this.#r=t,this.#j=h.Runtime.experiments.isEnabled("protocol-monitor"),this.requestUpdate()}performUpdate(){const e={reports:this.reports,protocolMonitorExperimentEnabled:this.#j,onSelect:this.onReportSelected};this.#r(e,void 0,this.contentElement)}}var nt=Object.freeze({__proto__:null,DEFAULT_VIEW:at,ReportsGrid:it,i18nString:tt}),st=`:host{display:block;white-space:normal;max-width:400px}.router-rules{border:1px solid var(--sys-color-divider);border-spacing:0;padding-left:10px;padding-right:10px;line-height:initial;margin-top:0;padding-bottom:12px;text-wrap:balance}.router-rule{display:flex;margin-top:12px;flex-direction:column}.rule-id{color:var(--sys-color-token-subtle)}.item{display:flex;flex-direction:column;padding-left:10px}.condition,\n.source{list-style:none;display:flex;margin-top:4px;flex-direction:row}.condition > *,\n.source > *{word-break:break-all;line-height:1.5em}.rule-type{flex:0 0 18%}\n/*# sourceURL=${import.meta.resolve("./serviceWorkerRouterView.css")} */`;const{html:lt,render:ct}=i;class dt extends d.LegacyWrapper.WrappableComponent{#u=this.attachShadow({mode:"open"});#Ie=[];update(e){this.#Ie=e,this.#Ie.length>0&&this.#m()}#m(){ct(lt`
      <style>${st}</style>
      <ul class="router-rules">
        ${this.#Ie.map(this.#De)}
      </ul>
    `,this.#u,{host:this})}#De(e){return lt`
      <li class="router-rule">
        <div class="rule-id">Rule ${e.id}</div>
        <ul class="item">
          <li class="condition">
            <div class="rule-type">Condition</div>
            <div class="rule-value">${e.condition}</div>
          </li>
          <li class="source">
            <div class="rule-type">Source</div>
            <div class="rule-value">${e.source}</div>
          </li>
        </ul>
      </li>
    `}}customElements.define("devtools-service-worker-router-view",dt);var ut=Object.freeze({__proto__:null,ServiceWorkerRouterView:dt}),ht=`@scope to (devtools-widget > *){:scope{padding:20px;height:100%;display:flex}.heading{font-size:15px}devtools-data-grid{margin-top:20px}.info-icon{vertical-align:text-bottom;height:14px}.no-events-message{margin-top:20px}}\n/*# sourceURL=${import.meta.resolve("./sharedStorageAccessGrid.css")} */`;const{render:pt,html:gt}=i,mt={sharedStorage:"Shared storage",allSharedStorageEvents:"All shared storage events for this page.",eventTime:"Event Time",eventScope:"Access Scope",eventMethod:"Access Method",ownerOrigin:"Owner Origin",ownerSite:"Owner Site",eventParams:"Optional Event Params",noEvents:"No shared storage events detected",sharedStorageDescription:"On this page you can view, add, edit and delete shared storage key-value pairs and view shared storage events.",learnMore:"Learn more"},vt=r.i18n.registerUIStrings("panels/application/components/SharedStorageAccessGrid.ts",mt),kt=r.i18n.getLocalizedString.bind(void 0,vt),bt=(t,r,o)=>{pt(gt`
    <style>${ht}</style>
    ${0===t.events.length?gt`
        <div class="empty-state" jslog=${c.section().context("empty-view")}>
          <div class="empty-state-header">${kt(mt.noEvents)}</div>
          <div class="empty-state-description">
            <span>${kt(mt.sharedStorageDescription)}</span>
            ${e.XLink.XLink.create("https://developers.google.com/privacy-sandbox/private-advertising/shared-storage",kt(mt.learnMore),"x-link",void 0,"learn-more")}
          </div>
        </div>`:gt`
        <div jslog=${c.section("events-table")}>
          <span class="heading">${kt(mt.sharedStorage)}</span>
          <devtools-icon class="info-icon medium" name="info"
                          title=${kt(mt.allSharedStorageEvents)}>
          </devtools-icon>
          <devtools-data-grid striped inline>
            <table>
              <thead>
                <tr>
                  <th id="event-time" weight="10" sortable>
                    ${kt(mt.eventTime)}
                  </th>
                  <th id="event-scope" weight="10" sortable>
                    ${kt(mt.eventScope)}
                  </th>
                  <th id="event-method" weight="10" sortable>
                    ${kt(mt.eventMethod)}
                  </th>
                  <th id="event-owner-origin" weight="10" sortable>
                    ${kt(mt.ownerOrigin)}
                  </th>
                  <th id="event-owner-site" weight="10" sortable>
                    ${kt(mt.ownerSite)}
                  </th>
                  <th id="event-params" weight="10" sortable>
                    ${kt(mt.eventParams)}
                  </th>
                </tr>
              </thead>
              <tbody>
                ${t.events.map(e=>gt`
                  <tr @select=${()=>t.onSelect(e)}>
                    <td data-value=${e.accessTime}>
                      ${new Date(1e3*e.accessTime).toLocaleString()}
                    </td>
                    <td>${e.scope}</td>
                    <td>${e.method}</td>
                    <td>${e.ownerOrigin}</td>
                    <td>${e.ownerSite}</td>
                    <td>${JSON.stringify(e.params)}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </devtools-data-grid>
        </div>`}`,o)};class ft extends e.Widget.Widget{#r;#Be=[];#Ae=()=>{};constructor(e,t=bt){super(e,{useShadowDom:!0}),this.#r=t,this.performUpdate()}set events(e){this.#Be=e,this.performUpdate()}set onSelect(e){this.#Ae=e,this.performUpdate()}get onSelect(){return this.#Ae}performUpdate(){this.#r({events:this.#Be,onSelect:this.#Ae.bind(this)},{},this.contentElement)}}var wt=Object.freeze({__proto__:null,DEFAULT_VIEW:bt,SharedStorageAccessGrid:ft,i18nString:kt}),yt=`.text-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}devtools-icon{vertical-align:text-bottom;margin-left:var(--sys-size-3);width:16px;height:16px}devtools-button{vertical-align:sub;margin-left:var(--sys-size-3)}.entropy-budget{display:flex;align-items:center;height:18px}\n/*# sourceURL=${import.meta.resolve("./sharedStorageMetadataView.css")} */`,St=`.default-bucket{font-style:italic}\n/*# sourceURL=${import.meta.resolve("./storageMetadataView.css")} */`;const{html:$t}=i,Tt={origin:"Frame origin",topLevelSite:"Top-level site",opaque:"(opaque)",isOpaque:"Is opaque",isThirdParty:"Is third-party",yes:"Yes",no:"No",yesBecauseTopLevelIsOpaque:"Yes, because the top-level site is opaque",yesBecauseKeyIsOpaque:"Yes, because the storage key is opaque",yesBecauseOriginNotInTopLevelSite:"Yes, because the origin is outside of the top-level site",yesBecauseAncestorChainHasCrossSite:"Yes, because the ancestry chain contains a third-party origin",loading:"Loading…",bucketName:"Bucket name",defaultBucket:"Default bucket",persistent:"Is persistent",durability:"Durability",quota:"Quota",expiration:"Expiration",none:"None",deleteBucket:"Delete bucket",confirmBucketDeletion:'Delete the "{PH1}" bucket?',bucketWillBeRemoved:"The selected storage bucket and contained data will be removed."},Ct=r.i18n.registerUIStrings("panels/application/components/StorageMetadataView.ts",Tt),xt=r.i18n.getLocalizedString.bind(void 0,Ct);class Pt extends d.LegacyWrapper.WrappableComponent{#u=this.attachShadow({mode:"open"});#Fe;#Ee=null;#Le=null;#Ne=!0;setStorageKey(e){this.#Ee=o.StorageKeyManager.parseStorageKey(e),this.render()}setStorageBucket(e){this.#Le=e,this.setStorageKey(e.bucket.storageKey)}setShowOnlyBucket(e){this.#Ne=e}enableStorageBucketControls(e){this.#Fe=e,this.#Ee&&this.render()}render(){return k.write("StorageMetadataView render",async()=>{i.render($t`
        <style>
          ${St}
        </style>
        <devtools-report .data=${{reportTitle:this.getTitle()??xt(Tt.loading)}}>
          ${await this.renderReportContent()}
        </devtools-report>`,this.#u,{host:this})})}getTitle(){if(!this.#Ee)return;const e=this.#Ee.origin,t=this.#Le?.bucket.name||xt(Tt.defaultBucket);return this.#Fe?`${t} - ${e}`:e}key(e){return $t`<devtools-report-key>${e}</devtools-report-key>`}value(e){return $t`<devtools-report-value>${e}</devtools-report-value>`}async renderReportContent(){if(!this.#Ee)return i.nothing;const e=this.#Ee.origin,t=Boolean(this.#Ee.components.get("3")),r=Boolean(this.#Ee.components.get("1")),o=Boolean(this.#Ee.components.get("4")),a=this.#Ee.components.get("0"),n=t?xt(Tt.yesBecauseAncestorChainHasCrossSite):r?xt(Tt.yesBecauseKeyIsOpaque):o?xt(Tt.yesBecauseTopLevelIsOpaque):a&&e!==a?xt(Tt.yesBecauseOriginNotInTopLevelSite):null;return $t`
        ${a&&e!==a?$t`${this.key(xt(Tt.origin))}
            ${this.value($t`<div class="text-ellipsis" title=${e}>${e}</div>`)}`:i.nothing}
        ${a||o?this.key(xt(Tt.topLevelSite)):i.nothing}
        ${a?this.value(a):i.nothing}
        ${o?this.value(xt(Tt.opaque)):i.nothing}
        ${n?$t`${this.key(xt(Tt.isThirdParty))}${this.value(n)}`:i.nothing}
        ${r||o?this.key(xt(Tt.isOpaque)):i.nothing}
        ${r?this.value(xt(Tt.yes)):i.nothing}
        ${o?this.value(xt(Tt.yesBecauseTopLevelIsOpaque)):i.nothing}
        ${this.#Le?this.#Oe():i.nothing}
        ${this.#Fe?this.#Ue():i.nothing}`}#Oe(){if(!this.#Le)throw new Error("Should not call #renderStorageBucketInfo if #bucket is null.");const{bucket:{name:e},persistent:t,durability:o,quota:a}=this.#Le,i=!e;return this.#Ne?$t`
      ${this.key(xt(Tt.bucketName))}
      ${this.value(e||$t`<span class="default-bucket">default</span>`)}
      ${this.key(xt(Tt.persistent))}
      ${this.value(xt(t?Tt.yes:Tt.no))}
      ${this.key(xt(Tt.durability))}
      ${this.value(o)}
      ${this.key(xt(Tt.quota))}
      ${this.value(r.ByteUtilities.bytesToString(a))}
      ${this.key(xt(Tt.expiration))}
      ${this.value(this.#We())}`:i?$t`
          ${this.key(xt(Tt.bucketName))}
          ${this.value($t`<span class="default-bucket">default</span>`)}`:$t`
        ${this.key(xt(Tt.bucketName))}
        ${this.value(e)}`}#We(){if(!this.#Le)throw new Error("Should not call #getExpirationString if #bucket is null.");const{expiration:e}=this.#Le;return 0===e?xt(Tt.none):new Date(1e3*e).toLocaleString()}#Ue(){return $t`
      <devtools-report-divider></devtools-report-divider>
      <devtools-report-section>
        <devtools-button
          aria-label=${xt(Tt.deleteBucket)}
          .variant=${"outlined"}
          @click=${this.#He}>
          ${xt(Tt.deleteBucket)}
        </devtools-button>
      </devtools-report-section>`}async#He(){if(!this.#Fe||!this.#Le)throw new Error("Should not call #deleteBucket if #storageBucketsModel or #storageBucket is null.");await e.UIUtils.ConfirmDialog.show(xt(Tt.bucketWillBeRemoved),xt(Tt.confirmBucketDeletion,{PH1:this.#Le.bucket.name||""}),this,{jslogContext:"delete-bucket-confirmation"})&&this.#Fe.deleteBucket(this.#Le.bucket)}}customElements.define("devtools-storage-metadata-view",Pt);var Rt=Object.freeze({__proto__:null,StorageMetadataView:Pt});const{html:Mt}=i,It={sharedStorage:"Shared storage",creation:"Creation Time",notYetCreated:"Not yet created",numEntries:"Number of Entries",entropyBudget:"Entropy Budget for Fenced Frames",budgetExplanation:"Remaining data leakage allowed within a 24-hour period for this origin in bits of entropy",resetBudget:"Reset Budget",numBytesUsed:"Number of Bytes Used"},Dt=r.i18n.registerUIStrings("panels/application/components/SharedStorageMetadataView.ts",It),Bt=r.i18n.getLocalizedString.bind(void 0,Dt);class At extends Pt{#qe;#je=null;#_e=0;#ze=0;#Ve=0;constructor(e,t){super(),this.#qe=e,this.classList.add("overflow-auto"),this.setStorageKey(t)}async#Ge(){await this.#qe.resetBudget(),await this.render()}getTitle(){return Bt(It.sharedStorage)}async renderReportContent(){const e=await this.#qe.getMetadata();return this.#je=e?.creationTime??null,this.#_e=e?.length??0,this.#ze=e?.bytesUsed??0,this.#Ve=e?.remainingBudget??0,Mt`
      <style>${yt}</style>
      ${await super.renderReportContent()}
      ${this.key(Bt(It.creation))}
      ${this.value(this.#Ke())}
      ${this.key(Bt(It.numEntries))}
      ${this.value(String(this.#_e))}
      ${this.key(Bt(It.numBytesUsed))}
      ${this.value(String(this.#ze))}
      ${this.key(Mt`<span class="entropy-budget">${Bt(It.entropyBudget)}<devtools-icon name="info" title=${Bt(It.budgetExplanation)}></devtools-icon></span>`)}
      ${this.value(Mt`<span class="entropy-budget">${this.#Ve}${this.#Xe()}</span>`)}`}#Ke(){if(!this.#je)return Mt`${Bt(It.notYetCreated)}`;const e=new Date(1e3*this.#je);return Mt`${e.toLocaleString()}`}#Xe(){return Mt`
      <devtools-button .iconName=${"undo"}
                       .jslogContext=${"reset-entropy-budget"}
                       .size=${"SMALL"}
                       .title=${Bt(It.resetBudget)}
                       .variant=${"icon"}
                       @click=${this.#Ge.bind(this)}></devtools-button>
    `}}customElements.define("devtools-shared-storage-metadata-view",At);var Ft=Object.freeze({__proto__:null,SharedStorageMetadataView:At}),Et=`:host{padding:20px;height:100%;display:flex}.heading{font-size:15px}devtools-data-grid{margin-top:20px;& devtools-button{width:14px;height:14px}}devtools-icon{width:14px;height:14px}.no-tt-message{margin-top:20px}\n/*# sourceURL=${import.meta.resolve("./trustTokensView.css")} */`;const{html:Lt}=i,Nt={issuer:"Issuer",storedTokenCount:"Stored token count",allStoredTrustTokensAvailableIn:"All stored private state tokens available in this browser instance.",noTrustTokens:"No private state tokens detected",trustTokensDescription:"On this page you can view all available private state tokens in the current browsing context.",deleteTrustTokens:"Delete all stored private state tokens issued by {PH1}.",trustTokens:"Private state tokens",learnMore:"Learn more"},Ot=r.i18n.registerUIStrings("panels/application/components/TrustTokensView.ts",Nt),Ut=r.i18n.getLocalizedString.bind(void 0,Ot);class Wt extends d.LegacyWrapper.WrappableComponent{#u=this.attachShadow({mode:"open"});#Je(e){const t=o.TargetManager.TargetManager.instance().primaryPageTarget();t?.storageAgent().invoke_clearTrustTokens({issuerOrigin:e})}connectedCallback(){this.wrapper?.contentElement.classList.add("vbox"),this.render()}async render(){const t=o.TargetManager.TargetManager.instance().primaryPageTarget();if(!t)return;const{tokens:r}=await t.storageAgent().invoke_getTrustTokens();r.sort((e,t)=>e.issuerOrigin.localeCompare(t.issuerOrigin)),await k.write("Render TrustTokensView",()=>{i.render(Lt`
        <style>${Et}</style>
        <style>${e.inspectorCommonStyles}</style>
        ${this.#Ye(r)}
      `,this.#u,{host:this}),this.isConnected&&setTimeout(()=>this.render(),1e3)})}#Ye(t){return 0===t.length?Lt`
        <div class="empty-state" jslog=${c.section().context("empty-view")}>
          <div class="empty-state-header">${Ut(Nt.noTrustTokens)}</div>
          <div class="empty-state-description">
            <span>${Ut(Nt.trustTokensDescription)}</span>
            ${e.XLink.XLink.create("https://developers.google.com/privacy-sandbox/protections/private-state-tokens",Ut(Nt.learnMore),"x-link",void 0,"learn-more")}
          </div>
        </div>
      `:Lt`
      <div>
        <span class="heading">${Ut(Nt.trustTokens)}</span>
        <devtools-icon name="info" title=${Ut(Nt.allStoredTrustTokensAvailableIn)}></devtools-icon>
        <devtools-data-grid striped inline>
          <table>
            <tr>
              <th id="issuer" weight="10" sortable>${Ut(Nt.issuer)}</th>
              <th id="count" weight="5" sortable>${Ut(Nt.storedTokenCount)}</th>
              <th id="delete-button" weight="1" sortable></th>
            </tr>
            ${t.filter(e=>e.count>0).map(e=>Lt`
                <tr>
                  <td>${Ht(e.issuerOrigin)}</td>
                  <td>${e.count}</td>
                  <td>
                    <devtools-button .iconName=${"bin"}
                                    .jslogContext=${"delete-all"}
                                    .size=${"SMALL"}
                                    .title=${Ut(Nt.deleteTrustTokens,{PH1:Ht(e.issuerOrigin)})}
                                    .variant=${"icon"}
                                    @click=${this.#Je.bind(this,Ht(e.issuerOrigin))}></devtools-button>
                  </td>
                </tr>
              `)}
          </table>
        </devtools-data-grid>
      </div>
    `}}function Ht(e){return e.replace(/\/$/,"")}customElements.define("devtools-trust-tokens-storage-view",Wt);var qt=Object.freeze({__proto__:null,TrustTokensView:Wt,i18nString:Ut});export{F as BackForwardCacheView,H as BounceTrackingMitigationsView,J as EndpointsGrid,Ne as FrameDetailsView,_e as InterestGroupAccessGrid,$e as OriginTrialTreeView,Ye as ProtocolHandlersView,nt as ReportsGrid,ut as ServiceWorkerRouterView,wt as SharedStorageAccessGrid,Ft as SharedStorageMetadataView,ne as StackTrace,Rt as StorageMetadataView,qt as TrustTokensView};
//# sourceMappingURL=components.js.map
