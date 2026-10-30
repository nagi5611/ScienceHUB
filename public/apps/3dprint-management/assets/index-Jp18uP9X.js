var q_=Object.defineProperty;var Y_=(r,e,t)=>e in r?q_(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Ha=(r,e,t)=>Y_(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function K_(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var ku={exports:{}},ja={},zu={exports:{}},ft={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Mp;function Z_(){if(Mp)return ft;Mp=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),u=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),y=Symbol.iterator;function _(O){return O===null||typeof O!="object"?null:(O=y&&O[y]||O["@@iterator"],typeof O=="function"?O:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,w={};function S(O,ae,Ue){this.props=O,this.context=ae,this.refs=w,this.updater=Ue||M}S.prototype.isReactComponent={},S.prototype.setState=function(O,ae){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,ae,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function x(){}x.prototype=S.prototype;function b(O,ae,Ue){this.props=O,this.context=ae,this.refs=w,this.updater=Ue||M}var R=b.prototype=new x;R.constructor=b,E(R,S.prototype),R.isPureReactComponent=!0;var D=Array.isArray,X=Object.prototype.hasOwnProperty,I={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};function j(O,ae,Ue){var Q,pe={},he=null,ge=null;if(ae!=null)for(Q in ae.ref!==void 0&&(ge=ae.ref),ae.key!==void 0&&(he=""+ae.key),ae)X.call(ae,Q)&&!L.hasOwnProperty(Q)&&(pe[Q]=ae[Q]);var ke=arguments.length-2;if(ke===1)pe.children=Ue;else if(1<ke){for(var He=Array(ke),q=0;q<ke;q++)He[q]=arguments[q+2];pe.children=He}if(O&&O.defaultProps)for(Q in ke=O.defaultProps,ke)pe[Q]===void 0&&(pe[Q]=ke[Q]);return{$$typeof:r,type:O,key:he,ref:ge,props:pe,_owner:I.current}}function C(O,ae){return{$$typeof:r,type:O.type,key:ae,ref:O.ref,props:O.props,_owner:O._owner}}function A(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function V(O){var ae={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(Ue){return ae[Ue]})}var G=/\/+/g;function z(O,ae){return typeof O=="object"&&O!==null&&O.key!=null?V(""+O.key):ae.toString(36)}function ne(O,ae,Ue,Q,pe){var he=typeof O;(he==="undefined"||he==="boolean")&&(O=null);var ge=!1;if(O===null)ge=!0;else switch(he){case"string":case"number":ge=!0;break;case"object":switch(O.$$typeof){case r:case e:ge=!0}}if(ge)return ge=O,pe=pe(ge),O=Q===""?"."+z(ge,0):Q,D(pe)?(Ue="",O!=null&&(Ue=O.replace(G,"$&/")+"/"),ne(pe,ae,Ue,"",function(q){return q})):pe!=null&&(A(pe)&&(pe=C(pe,Ue+(!pe.key||ge&&ge.key===pe.key?"":(""+pe.key).replace(G,"$&/")+"/")+O)),ae.push(pe)),1;if(ge=0,Q=Q===""?".":Q+":",D(O))for(var ke=0;ke<O.length;ke++){he=O[ke];var He=Q+z(he,ke);ge+=ne(he,ae,Ue,He,pe)}else if(He=_(O),typeof He=="function")for(O=He.call(O),ke=0;!(he=O.next()).done;)he=he.value,He=Q+z(he,ke++),ge+=ne(he,ae,Ue,He,pe);else if(he==="object")throw ae=String(O),Error("Objects are not valid as a React child (found: "+(ae==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":ae)+"). If you meant to render a collection of children, use an array instead.");return ge}function Y(O,ae,Ue){if(O==null)return O;var Q=[],pe=0;return ne(O,Q,"","",function(he){return ae.call(Ue,he,pe++)}),Q}function ue(O){if(O._status===-1){var ae=O._result;ae=ae(),ae.then(function(Ue){(O._status===0||O._status===-1)&&(O._status=1,O._result=Ue)},function(Ue){(O._status===0||O._status===-1)&&(O._status=2,O._result=Ue)}),O._status===-1&&(O._status=0,O._result=ae)}if(O._status===1)return O._result.default;throw O._result}var fe={current:null},k={transition:null},de={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:k,ReactCurrentOwner:I};function te(){throw Error("act(...) is not supported in production builds of React.")}return ft.Children={map:Y,forEach:function(O,ae,Ue){Y(O,function(){ae.apply(this,arguments)},Ue)},count:function(O){var ae=0;return Y(O,function(){ae++}),ae},toArray:function(O){return Y(O,function(ae){return ae})||[]},only:function(O){if(!A(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},ft.Component=S,ft.Fragment=t,ft.Profiler=o,ft.PureComponent=b,ft.StrictMode=s,ft.Suspense=m,ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=de,ft.act=te,ft.cloneElement=function(O,ae,Ue){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var Q=E({},O.props),pe=O.key,he=O.ref,ge=O._owner;if(ae!=null){if(ae.ref!==void 0&&(he=ae.ref,ge=I.current),ae.key!==void 0&&(pe=""+ae.key),O.type&&O.type.defaultProps)var ke=O.type.defaultProps;for(He in ae)X.call(ae,He)&&!L.hasOwnProperty(He)&&(Q[He]=ae[He]===void 0&&ke!==void 0?ke[He]:ae[He])}var He=arguments.length-2;if(He===1)Q.children=Ue;else if(1<He){ke=Array(He);for(var q=0;q<He;q++)ke[q]=arguments[q+2];Q.children=ke}return{$$typeof:r,type:O.type,key:pe,ref:he,props:Q,_owner:ge}},ft.createContext=function(O){return O={$$typeof:u,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},ft.createElement=j,ft.createFactory=function(O){var ae=j.bind(null,O);return ae.type=O,ae},ft.createRef=function(){return{current:null}},ft.forwardRef=function(O){return{$$typeof:d,render:O}},ft.isValidElement=A,ft.lazy=function(O){return{$$typeof:g,_payload:{_status:-1,_result:O},_init:ue}},ft.memo=function(O,ae){return{$$typeof:p,type:O,compare:ae===void 0?null:ae}},ft.startTransition=function(O){var ae=k.transition;k.transition={};try{O()}finally{k.transition=ae}},ft.unstable_act=te,ft.useCallback=function(O,ae){return fe.current.useCallback(O,ae)},ft.useContext=function(O){return fe.current.useContext(O)},ft.useDebugValue=function(){},ft.useDeferredValue=function(O){return fe.current.useDeferredValue(O)},ft.useEffect=function(O,ae){return fe.current.useEffect(O,ae)},ft.useId=function(){return fe.current.useId()},ft.useImperativeHandle=function(O,ae,Ue){return fe.current.useImperativeHandle(O,ae,Ue)},ft.useInsertionEffect=function(O,ae){return fe.current.useInsertionEffect(O,ae)},ft.useLayoutEffect=function(O,ae){return fe.current.useLayoutEffect(O,ae)},ft.useMemo=function(O,ae){return fe.current.useMemo(O,ae)},ft.useReducer=function(O,ae,Ue){return fe.current.useReducer(O,ae,Ue)},ft.useRef=function(O){return fe.current.useRef(O)},ft.useState=function(O){return fe.current.useState(O)},ft.useSyncExternalStore=function(O,ae,Ue){return fe.current.useSyncExternalStore(O,ae,Ue)},ft.useTransition=function(){return fe.current.useTransition()},ft.version="18.3.1",ft}var Ep;function Od(){return Ep||(Ep=1,zu.exports=Z_()),zu.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wp;function Q_(){if(wp)return ja;wp=1;var r=Od(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function u(d,m,p){var g,y={},_=null,M=null;p!==void 0&&(_=""+p),m.key!==void 0&&(_=""+m.key),m.ref!==void 0&&(M=m.ref);for(g in m)s.call(m,g)&&!l.hasOwnProperty(g)&&(y[g]=m[g]);if(d&&d.defaultProps)for(g in m=d.defaultProps,m)y[g]===void 0&&(y[g]=m[g]);return{$$typeof:e,type:d,key:_,ref:M,props:y,_owner:o.current}}return ja.Fragment=t,ja.jsx=u,ja.jsxs=u,ja}var Tp;function J_(){return Tp||(Tp=1,ku.exports=Q_()),ku.exports}var f=J_(),ex=Od();const Ce=K_(ex);var ll={},Bu={exports:{}},An={},Hu={exports:{}},ju={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ap;function tx(){return Ap||(Ap=1,(function(r){function e(k,de){var te=k.length;k.push(de);e:for(;0<te;){var O=te-1>>>1,ae=k[O];if(0<o(ae,de))k[O]=de,k[te]=ae,te=O;else break e}}function t(k){return k.length===0?null:k[0]}function s(k){if(k.length===0)return null;var de=k[0],te=k.pop();if(te!==de){k[0]=te;e:for(var O=0,ae=k.length,Ue=ae>>>1;O<Ue;){var Q=2*(O+1)-1,pe=k[Q],he=Q+1,ge=k[he];if(0>o(pe,te))he<ae&&0>o(ge,pe)?(k[O]=ge,k[he]=te,O=he):(k[O]=pe,k[Q]=te,O=Q);else if(he<ae&&0>o(ge,te))k[O]=ge,k[he]=te,O=he;else break e}}return de}function o(k,de){var te=k.sortIndex-de.sortIndex;return te!==0?te:k.id-de.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var u=Date,d=u.now();r.unstable_now=function(){return u.now()-d}}var m=[],p=[],g=1,y=null,_=3,M=!1,E=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,b=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function R(k){for(var de=t(p);de!==null;){if(de.callback===null)s(p);else if(de.startTime<=k)s(p),de.sortIndex=de.expirationTime,e(m,de);else break;de=t(p)}}function D(k){if(w=!1,R(k),!E)if(t(m)!==null)E=!0,ue(X);else{var de=t(p);de!==null&&fe(D,de.startTime-k)}}function X(k,de){E=!1,w&&(w=!1,x(j),j=-1),M=!0;var te=_;try{for(R(de),y=t(m);y!==null&&(!(y.expirationTime>de)||k&&!V());){var O=y.callback;if(typeof O=="function"){y.callback=null,_=y.priorityLevel;var ae=O(y.expirationTime<=de);de=r.unstable_now(),typeof ae=="function"?y.callback=ae:y===t(m)&&s(m),R(de)}else s(m);y=t(m)}if(y!==null)var Ue=!0;else{var Q=t(p);Q!==null&&fe(D,Q.startTime-de),Ue=!1}return Ue}finally{y=null,_=te,M=!1}}var I=!1,L=null,j=-1,C=5,A=-1;function V(){return!(r.unstable_now()-A<C)}function G(){if(L!==null){var k=r.unstable_now();A=k;var de=!0;try{de=L(!0,k)}finally{de?z():(I=!1,L=null)}}else I=!1}var z;if(typeof b=="function")z=function(){b(G)};else if(typeof MessageChannel<"u"){var ne=new MessageChannel,Y=ne.port2;ne.port1.onmessage=G,z=function(){Y.postMessage(null)}}else z=function(){S(G,0)};function ue(k){L=k,I||(I=!0,z())}function fe(k,de){j=S(function(){k(r.unstable_now())},de)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(k){k.callback=null},r.unstable_continueExecution=function(){E||M||(E=!0,ue(X))},r.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<k?Math.floor(1e3/k):5},r.unstable_getCurrentPriorityLevel=function(){return _},r.unstable_getFirstCallbackNode=function(){return t(m)},r.unstable_next=function(k){switch(_){case 1:case 2:case 3:var de=3;break;default:de=_}var te=_;_=de;try{return k()}finally{_=te}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(k,de){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var te=_;_=k;try{return de()}finally{_=te}},r.unstable_scheduleCallback=function(k,de,te){var O=r.unstable_now();switch(typeof te=="object"&&te!==null?(te=te.delay,te=typeof te=="number"&&0<te?O+te:O):te=O,k){case 1:var ae=-1;break;case 2:ae=250;break;case 5:ae=1073741823;break;case 4:ae=1e4;break;default:ae=5e3}return ae=te+ae,k={id:g++,callback:de,priorityLevel:k,startTime:te,expirationTime:ae,sortIndex:-1},te>O?(k.sortIndex=te,e(p,k),t(m)===null&&k===t(p)&&(w?(x(j),j=-1):w=!0,fe(D,te-O))):(k.sortIndex=ae,e(m,k),E||M||(E=!0,ue(X))),k},r.unstable_shouldYield=V,r.unstable_wrapCallback=function(k){var de=_;return function(){var te=_;_=de;try{return k.apply(this,arguments)}finally{_=te}}}})(ju)),ju}var Cp;function nx(){return Cp||(Cp=1,Hu.exports=tx()),Hu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bp;function ix(){if(bp)return An;bp=1;var r=Od(),e=nx();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){u(n,i),u(n+"Capture",i)}function u(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),m=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},y={};function _(n){return m.call(y,n)?!0:m.call(g,n)?!1:p.test(n)?y[n]=!0:(g[n]=!0,!1)}function M(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function E(n,i,a,c){if(i===null||typeof i>"u"||M(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(n,i,a,c,h,v,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=v,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new w(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function b(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(x,b);S[i]=new w(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(x,b);S[i]=new w(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(x,b);S[i]=new w(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function R(n,i,a,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,a,h,c)&&(a=null),c||h===null?_(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):h.mustUseProperty?n[h.propertyName]=a===null?h.type===3?!1:"":a:(i=h.attributeName,c=h.attributeNamespace,a===null?n.removeAttribute(i):(h=h.type,a=h===3||h===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var D=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,X=Symbol.for("react.element"),I=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),A=Symbol.for("react.provider"),V=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),z=Symbol.for("react.suspense"),ne=Symbol.for("react.suspense_list"),Y=Symbol.for("react.memo"),ue=Symbol.for("react.lazy"),fe=Symbol.for("react.offscreen"),k=Symbol.iterator;function de(n){return n===null||typeof n!="object"?null:(n=k&&n[k]||n["@@iterator"],typeof n=="function"?n:null)}var te=Object.assign,O;function ae(n){if(O===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var Ue=!1;function Q(n,i){if(!n||Ue)return"";Ue=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(se){var c=se}Reflect.construct(n,[],i)}else{try{i.call()}catch(se){c=se}n.call(i.prototype)}else{try{throw Error()}catch(se){c=se}n()}}catch(se){if(se&&c&&typeof se.stack=="string"){for(var h=se.stack.split(`
`),v=c.stack.split(`
`),T=h.length-1,U=v.length-1;1<=T&&0<=U&&h[T]!==v[U];)U--;for(;1<=T&&0<=U;T--,U--)if(h[T]!==v[U]){if(T!==1||U!==1)do if(T--,U--,0>U||h[T]!==v[U]){var H=`
`+h[T].replace(" at new "," at ");return n.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",n.displayName)),H}while(1<=T&&0<=U);break}}}finally{Ue=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?ae(n):""}function pe(n){switch(n.tag){case 5:return ae(n.type);case 16:return ae("Lazy");case 13:return ae("Suspense");case 19:return ae("SuspenseList");case 0:case 2:case 15:return n=Q(n.type,!1),n;case 11:return n=Q(n.type.render,!1),n;case 1:return n=Q(n.type,!0),n;default:return""}}function he(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case L:return"Fragment";case I:return"Portal";case C:return"Profiler";case j:return"StrictMode";case z:return"Suspense";case ne:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case V:return(n.displayName||"Context")+".Consumer";case A:return(n._context.displayName||"Context")+".Provider";case G:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Y:return i=n.displayName||null,i!==null?i:he(n.type)||"Memo";case ue:i=n._payload,n=n._init;try{return he(n(i))}catch{}}return null}function ge(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return he(i);case 8:return i===j?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function ke(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function He(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function q(n){var i=He(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,v=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(T){c=""+T,v.call(this,T)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function ht(n){n._valueTracker||(n._valueTracker=q(n))}function Ye(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=He(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function mt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Ke(n,i){var a=i.checked;return te({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function ut(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=ke(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function rt(n,i){i=i.checked,i!=null&&R(n,"checked",i,!1)}function at(n,i){rt(n,i);var a=ke(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?F(n,i.type,a):i.hasOwnProperty("defaultValue")&&F(n,i.type,ke(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function At(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function F(n,i,a){(i!=="number"||mt(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var N=Array.isArray;function ce(n,i,a,c){if(n=n.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<n.length;a++)h=i.hasOwnProperty("$"+n[a].value),n[a].selected!==h&&(n[a].selected=h),h&&c&&(n[a].defaultSelected=!0)}else{for(a=""+ke(a),i=null,h=0;h<n.length;h++){if(n[h].value===a){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function ve(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return te({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Me(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(N(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:ke(a)}}function we(n,i){var a=ke(i.value),c=ke(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function qe(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function Pe(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ne(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?Pe(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var nt,B=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(nt=nt||document.createElement("div"),nt.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=nt.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function J(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var _e={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Te=["Webkit","ms","Moz","O"];Object.keys(_e).forEach(function(n){Te.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),_e[i]=_e[n]})});function Ee(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||_e.hasOwnProperty(n)&&_e[n]?(""+i).trim():i+"px"}function Be(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,h=Ee(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,h):n[a]=h}}var Ie=te({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function dt(n,i){if(i){if(Ie[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function st(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var $=null;function xe(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var me=null,Re=null,Fe=null;function pt(n){if(n=Aa(n)){if(typeof me!="function")throw Error(t(280));var i=n.stateNode;i&&(i=Eo(i),me(n.stateNode,n.type,i))}}function wt(n){Re?Fe?Fe.push(n):Fe=[n]:Re=n}function Rt(){if(Re){var n=Re,i=Fe;if(Fe=Re=null,pt(n),i)for(n=0;n<i.length;n++)pt(i[n])}}function Vt(n,i){return n(i)}function yt(){}var yn=!1;function Zt(n,i,a){if(yn)return n(i,a);yn=!0;try{return Vt(n,i,a)}finally{yn=!1,(Re!==null||Fe!==null)&&(yt(),Rt())}}function Vi(n,i){var a=n.stateNode;if(a===null)return null;var c=Eo(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var is=!1;if(d)try{var Gi={};Object.defineProperty(Gi,"passive",{get:function(){is=!0}}),window.addEventListener("test",Gi,Gi),window.removeEventListener("test",Gi,Gi)}catch{is=!1}function rs(n,i,a,c,h,v,T,U,H){var se=Array.prototype.slice.call(arguments,3);try{i.apply(a,se)}catch(Se){this.onError(Se)}}var Wi=!1,Mi=null,Ar=!1,ss=null,nc={onError:function(n){Wi=!0,Mi=n}};function ic(n,i,a,c,h,v,T,U,H){Wi=!1,Mi=null,rs.apply(nc,arguments)}function rc(n,i,a,c,h,v,T,U,H){if(ic.apply(this,arguments),Wi){if(Wi){var se=Mi;Wi=!1,Mi=null}else throw Error(t(198));Ar||(Ar=!0,ss=se)}}function P(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function K(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function le(n){if(P(n)!==n)throw Error(t(188))}function re(n){var i=n.alternate;if(!i){if(i=P(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var h=a.return;if(h===null)break;var v=h.alternate;if(v===null){if(c=h.return,c!==null){a=c;continue}break}if(h.child===v.child){for(v=h.child;v;){if(v===a)return le(h),n;if(v===c)return le(h),i;v=v.sibling}throw Error(t(188))}if(a.return!==c.return)a=h,c=v;else{for(var T=!1,U=h.child;U;){if(U===a){T=!0,a=h,c=v;break}if(U===c){T=!0,c=h,a=v;break}U=U.sibling}if(!T){for(U=v.child;U;){if(U===a){T=!0,a=v,c=h;break}if(U===c){T=!0,c=v,a=h;break}U=U.sibling}if(!T)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function ie(n){return n=re(n),n!==null?Le(n):null}function Le(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Le(n);if(i!==null)return i;n=n.sibling}return null}var We=e.unstable_scheduleCallback,$e=e.unstable_cancelCallback,Je=e.unstable_shouldYield,it=e.unstable_requestPaint,Ve=e.unstable_now,ot=e.unstable_getCurrentPriorityLevel,Dt=e.unstable_ImmediatePriority,Gt=e.unstable_UserBlockingPriority,Qt=e.unstable_NormalPriority,Zn=e.unstable_LowPriority,gt=e.unstable_IdlePriority,et=null,ln=null;function Ct(n){if(ln&&typeof ln.onCommitFiberRoot=="function")try{ln.onCommitFiberRoot(et,n,void 0,(n.current.flags&128)===128)}catch{}}var Wt=Math.clz32?Math.clz32:oa,ao=Math.log,Cr=Math.LN2;function oa(n){return n>>>=0,n===0?32:31-(ao(n)/Cr|0)|0}var kt=64,Pn=4194304;function Ei(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function sn(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,h=n.suspendedLanes,v=n.pingedLanes,T=a&268435455;if(T!==0){var U=T&~h;U!==0?c=Ei(U):(v&=T,v!==0&&(c=Ei(v)))}else T=a&~h,T!==0?c=Ei(T):v!==0&&(c=Ei(v));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,v=i&-i,h>=v||h===16&&(v&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Wt(i),h=1<<a,c|=n[a],i&=~h;return c}function la(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function sc(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,v=n.pendingLanes;0<v;){var T=31-Wt(v),U=1<<T,H=h[T];H===-1?((U&a)===0||(U&c)!==0)&&(h[T]=la(U,i)):H<=i&&(n.expiredLanes|=U),v&=~U}}function as(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Qd(){var n=kt;return kt<<=1,(kt&4194240)===0&&(kt=64),n}function ac(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function ca(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Wt(i),n[i]=a}function mv(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var h=31-Wt(a),v=1<<h;i[h]=0,c[h]=-1,n[h]=-1,a&=~v}}function oc(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Wt(a),h=1<<c;h&i|n[c]&i&&(n[c]|=i),a&=~h}}var Et=0;function Jd(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ef,lc,tf,nf,rf,cc=!1,oo=[],Xi=null,$i=null,qi=null,ua=new Map,da=new Map,Yi=[],gv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function sf(n,i){switch(n){case"focusin":case"focusout":Xi=null;break;case"dragenter":case"dragleave":$i=null;break;case"mouseover":case"mouseout":qi=null;break;case"pointerover":case"pointerout":ua.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":da.delete(i.pointerId)}}function fa(n,i,a,c,h,v){return n===null||n.nativeEvent!==v?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:v,targetContainers:[h]},i!==null&&(i=Aa(i),i!==null&&lc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function vv(n,i,a,c,h){switch(i){case"focusin":return Xi=fa(Xi,n,i,a,c,h),!0;case"dragenter":return $i=fa($i,n,i,a,c,h),!0;case"mouseover":return qi=fa(qi,n,i,a,c,h),!0;case"pointerover":var v=h.pointerId;return ua.set(v,fa(ua.get(v)||null,n,i,a,c,h)),!0;case"gotpointercapture":return v=h.pointerId,da.set(v,fa(da.get(v)||null,n,i,a,c,h)),!0}return!1}function af(n){var i=br(n.target);if(i!==null){var a=P(i);if(a!==null){if(i=a.tag,i===13){if(i=K(a),i!==null){n.blockedOn=i,rf(n.priority,function(){tf(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function lo(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=dc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);$=c,a.target.dispatchEvent(c),$=null}else return i=Aa(a),i!==null&&lc(i),n.blockedOn=a,!1;i.shift()}return!0}function of(n,i,a){lo(n)&&a.delete(i)}function _v(){cc=!1,Xi!==null&&lo(Xi)&&(Xi=null),$i!==null&&lo($i)&&($i=null),qi!==null&&lo(qi)&&(qi=null),ua.forEach(of),da.forEach(of)}function ha(n,i){n.blockedOn===i&&(n.blockedOn=null,cc||(cc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,_v)))}function pa(n){function i(h){return ha(h,n)}if(0<oo.length){ha(oo[0],n);for(var a=1;a<oo.length;a++){var c=oo[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Xi!==null&&ha(Xi,n),$i!==null&&ha($i,n),qi!==null&&ha(qi,n),ua.forEach(i),da.forEach(i),a=0;a<Yi.length;a++)c=Yi[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Yi.length&&(a=Yi[0],a.blockedOn===null);)af(a),a.blockedOn===null&&Yi.shift()}var os=D.ReactCurrentBatchConfig,co=!0;function xv(n,i,a,c){var h=Et,v=os.transition;os.transition=null;try{Et=1,uc(n,i,a,c)}finally{Et=h,os.transition=v}}function yv(n,i,a,c){var h=Et,v=os.transition;os.transition=null;try{Et=4,uc(n,i,a,c)}finally{Et=h,os.transition=v}}function uc(n,i,a,c){if(co){var h=dc(n,i,a,c);if(h===null)bc(n,i,c,uo,a),sf(n,c);else if(vv(h,n,i,a,c))c.stopPropagation();else if(sf(n,c),i&4&&-1<gv.indexOf(n)){for(;h!==null;){var v=Aa(h);if(v!==null&&ef(v),v=dc(n,i,a,c),v===null&&bc(n,i,c,uo,a),v===h)break;h=v}h!==null&&c.stopPropagation()}else bc(n,i,c,null,a)}}var uo=null;function dc(n,i,a,c){if(uo=null,n=xe(c),n=br(n),n!==null)if(i=P(n),i===null)n=null;else if(a=i.tag,a===13){if(n=K(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return uo=n,null}function lf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ot()){case Dt:return 1;case Gt:return 4;case Qt:case Zn:return 16;case gt:return 536870912;default:return 16}default:return 16}}var Ki=null,fc=null,fo=null;function cf(){if(fo)return fo;var n,i=fc,a=i.length,c,h="value"in Ki?Ki.value:Ki.textContent,v=h.length;for(n=0;n<a&&i[n]===h[n];n++);var T=a-n;for(c=1;c<=T&&i[a-c]===h[v-c];c++);return fo=h.slice(n,1<c?1-c:void 0)}function ho(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function po(){return!0}function uf(){return!1}function Ln(n){function i(a,c,h,v,T){this._reactName=a,this._targetInst=h,this.type=c,this.nativeEvent=v,this.target=T,this.currentTarget=null;for(var U in n)n.hasOwnProperty(U)&&(a=n[U],this[U]=a?a(v):v[U]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?po:uf,this.isPropagationStopped=uf,this}return te(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=po)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=po)},persist:function(){},isPersistent:po}),i}var ls={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},hc=Ln(ls),ma=te({},ls,{view:0,detail:0}),Sv=Ln(ma),pc,mc,ga,mo=te({},ma,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==ga&&(ga&&n.type==="mousemove"?(pc=n.screenX-ga.screenX,mc=n.screenY-ga.screenY):mc=pc=0,ga=n),pc)},movementY:function(n){return"movementY"in n?n.movementY:mc}}),df=Ln(mo),Mv=te({},mo,{dataTransfer:0}),Ev=Ln(Mv),wv=te({},ma,{relatedTarget:0}),gc=Ln(wv),Tv=te({},ls,{animationName:0,elapsedTime:0,pseudoElement:0}),Av=Ln(Tv),Cv=te({},ls,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),bv=Ln(Cv),Rv=te({},ls,{data:0}),ff=Ln(Rv),Nv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Pv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Lv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Dv(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Lv[n])?!!i[n]:!1}function vc(){return Dv}var Uv=te({},ma,{key:function(n){if(n.key){var i=Nv[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=ho(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Pv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vc,charCode:function(n){return n.type==="keypress"?ho(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ho(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Iv=Ln(Uv),Fv=te({},mo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hf=Ln(Fv),Ov=te({},ma,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vc}),kv=Ln(Ov),zv=te({},ls,{propertyName:0,elapsedTime:0,pseudoElement:0}),Bv=Ln(zv),Hv=te({},mo,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),jv=Ln(Hv),Vv=[9,13,27,32],_c=d&&"CompositionEvent"in window,va=null;d&&"documentMode"in document&&(va=document.documentMode);var Gv=d&&"TextEvent"in window&&!va,pf=d&&(!_c||va&&8<va&&11>=va),mf=" ",gf=!1;function vf(n,i){switch(n){case"keyup":return Vv.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function _f(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var cs=!1;function Wv(n,i){switch(n){case"compositionend":return _f(i);case"keypress":return i.which!==32?null:(gf=!0,mf);case"textInput":return n=i.data,n===mf&&gf?null:n;default:return null}}function Xv(n,i){if(cs)return n==="compositionend"||!_c&&vf(n,i)?(n=cf(),fo=fc=Ki=null,cs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return pf&&i.locale!=="ko"?null:i.data;default:return null}}var $v={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!$v[n.type]:i==="textarea"}function yf(n,i,a,c){wt(c),i=yo(i,"onChange"),0<i.length&&(a=new hc("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var _a=null,xa=null;function qv(n){kf(n,0)}function go(n){var i=ps(n);if(Ye(i))return n}function Yv(n,i){if(n==="change")return i}var Sf=!1;if(d){var xc;if(d){var yc="oninput"in document;if(!yc){var Mf=document.createElement("div");Mf.setAttribute("oninput","return;"),yc=typeof Mf.oninput=="function"}xc=yc}else xc=!1;Sf=xc&&(!document.documentMode||9<document.documentMode)}function Ef(){_a&&(_a.detachEvent("onpropertychange",wf),xa=_a=null)}function wf(n){if(n.propertyName==="value"&&go(xa)){var i=[];yf(i,xa,n,xe(n)),Zt(qv,i)}}function Kv(n,i,a){n==="focusin"?(Ef(),_a=i,xa=a,_a.attachEvent("onpropertychange",wf)):n==="focusout"&&Ef()}function Zv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return go(xa)}function Qv(n,i){if(n==="click")return go(i)}function Jv(n,i){if(n==="input"||n==="change")return go(i)}function e_(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Qn=typeof Object.is=="function"?Object.is:e_;function ya(n,i){if(Qn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var h=a[c];if(!m.call(i,h)||!Qn(n[h],i[h]))return!1}return!0}function Tf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Af(n,i){var a=Tf(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Tf(a)}}function Cf(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Cf(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function bf(){for(var n=window,i=mt();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=mt(n.document)}return i}function Sc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function t_(n){var i=bf(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Cf(a.ownerDocument.documentElement,a)){if(c!==null&&Sc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=a.textContent.length,v=Math.min(c.start,h);c=c.end===void 0?v:Math.min(c.end,h),!n.extend&&v>c&&(h=c,c=v,v=h),h=Af(a,v);var T=Af(a,c);h&&T&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),v>c?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var n_=d&&"documentMode"in document&&11>=document.documentMode,us=null,Mc=null,Sa=null,Ec=!1;function Rf(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Ec||us==null||us!==mt(c)||(c=us,"selectionStart"in c&&Sc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Sa&&ya(Sa,c)||(Sa=c,c=yo(Mc,"onSelect"),0<c.length&&(i=new hc("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=us)))}function vo(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var ds={animationend:vo("Animation","AnimationEnd"),animationiteration:vo("Animation","AnimationIteration"),animationstart:vo("Animation","AnimationStart"),transitionend:vo("Transition","TransitionEnd")},wc={},Nf={};d&&(Nf=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function _o(n){if(wc[n])return wc[n];if(!ds[n])return n;var i=ds[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in Nf)return wc[n]=i[a];return n}var Pf=_o("animationend"),Lf=_o("animationiteration"),Df=_o("animationstart"),Uf=_o("transitionend"),If=new Map,Ff="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zi(n,i){If.set(n,i),l(i,[n])}for(var Tc=0;Tc<Ff.length;Tc++){var Ac=Ff[Tc],i_=Ac.toLowerCase(),r_=Ac[0].toUpperCase()+Ac.slice(1);Zi(i_,"on"+r_)}Zi(Pf,"onAnimationEnd"),Zi(Lf,"onAnimationIteration"),Zi(Df,"onAnimationStart"),Zi("dblclick","onDoubleClick"),Zi("focusin","onFocus"),Zi("focusout","onBlur"),Zi(Uf,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ma="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),s_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ma));function Of(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,rc(c,i,void 0,n),n.currentTarget=null}function kf(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],h=c.event;c=c.listeners;e:{var v=void 0;if(i)for(var T=c.length-1;0<=T;T--){var U=c[T],H=U.instance,se=U.currentTarget;if(U=U.listener,H!==v&&h.isPropagationStopped())break e;Of(h,U,se),v=H}else for(T=0;T<c.length;T++){if(U=c[T],H=U.instance,se=U.currentTarget,U=U.listener,H!==v&&h.isPropagationStopped())break e;Of(h,U,se),v=H}}}if(Ar)throw n=ss,Ar=!1,ss=null,n}function Nt(n,i){var a=i[Uc];a===void 0&&(a=i[Uc]=new Set);var c=n+"__bubble";a.has(c)||(zf(i,n,2,!1),a.add(c))}function Cc(n,i,a){var c=0;i&&(c|=4),zf(a,n,c,i)}var xo="_reactListening"+Math.random().toString(36).slice(2);function Ea(n){if(!n[xo]){n[xo]=!0,s.forEach(function(a){a!=="selectionchange"&&(s_.has(a)||Cc(a,!1,n),Cc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[xo]||(i[xo]=!0,Cc("selectionchange",!1,i))}}function zf(n,i,a,c){switch(lf(i)){case 1:var h=xv;break;case 4:h=yv;break;default:h=uc}a=h.bind(null,i,a,n),h=void 0,!is||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,a,{capture:!0,passive:h}):n.addEventListener(i,a,!0):h!==void 0?n.addEventListener(i,a,{passive:h}):n.addEventListener(i,a,!1)}function bc(n,i,a,c,h){var v=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var U=c.stateNode.containerInfo;if(U===h||U.nodeType===8&&U.parentNode===h)break;if(T===4)for(T=c.return;T!==null;){var H=T.tag;if((H===3||H===4)&&(H=T.stateNode.containerInfo,H===h||H.nodeType===8&&H.parentNode===h))return;T=T.return}for(;U!==null;){if(T=br(U),T===null)return;if(H=T.tag,H===5||H===6){c=v=T;continue e}U=U.parentNode}}c=c.return}Zt(function(){var se=v,Se=xe(a),Ae=[];e:{var ye=If.get(n);if(ye!==void 0){var Oe=hc,je=n;switch(n){case"keypress":if(ho(a)===0)break e;case"keydown":case"keyup":Oe=Iv;break;case"focusin":je="focus",Oe=gc;break;case"focusout":je="blur",Oe=gc;break;case"beforeblur":case"afterblur":Oe=gc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Oe=df;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Oe=Ev;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Oe=kv;break;case Pf:case Lf:case Df:Oe=Av;break;case Uf:Oe=Bv;break;case"scroll":Oe=Sv;break;case"wheel":Oe=jv;break;case"copy":case"cut":case"paste":Oe=bv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Oe=hf}var Ge=(i&4)!==0,zt=!Ge&&n==="scroll",Z=Ge?ye!==null?ye+"Capture":null:ye;Ge=[];for(var W=se,ee;W!==null;){ee=W;var be=ee.stateNode;if(ee.tag===5&&be!==null&&(ee=be,Z!==null&&(be=Vi(W,Z),be!=null&&Ge.push(wa(W,be,ee)))),zt)break;W=W.return}0<Ge.length&&(ye=new Oe(ye,je,null,a,Se),Ae.push({event:ye,listeners:Ge}))}}if((i&7)===0){e:{if(ye=n==="mouseover"||n==="pointerover",Oe=n==="mouseout"||n==="pointerout",ye&&a!==$&&(je=a.relatedTarget||a.fromElement)&&(br(je)||je[wi]))break e;if((Oe||ye)&&(ye=Se.window===Se?Se:(ye=Se.ownerDocument)?ye.defaultView||ye.parentWindow:window,Oe?(je=a.relatedTarget||a.toElement,Oe=se,je=je?br(je):null,je!==null&&(zt=P(je),je!==zt||je.tag!==5&&je.tag!==6)&&(je=null)):(Oe=null,je=se),Oe!==je)){if(Ge=df,be="onMouseLeave",Z="onMouseEnter",W="mouse",(n==="pointerout"||n==="pointerover")&&(Ge=hf,be="onPointerLeave",Z="onPointerEnter",W="pointer"),zt=Oe==null?ye:ps(Oe),ee=je==null?ye:ps(je),ye=new Ge(be,W+"leave",Oe,a,Se),ye.target=zt,ye.relatedTarget=ee,be=null,br(Se)===se&&(Ge=new Ge(Z,W+"enter",je,a,Se),Ge.target=ee,Ge.relatedTarget=zt,be=Ge),zt=be,Oe&&je)t:{for(Ge=Oe,Z=je,W=0,ee=Ge;ee;ee=fs(ee))W++;for(ee=0,be=Z;be;be=fs(be))ee++;for(;0<W-ee;)Ge=fs(Ge),W--;for(;0<ee-W;)Z=fs(Z),ee--;for(;W--;){if(Ge===Z||Z!==null&&Ge===Z.alternate)break t;Ge=fs(Ge),Z=fs(Z)}Ge=null}else Ge=null;Oe!==null&&Bf(Ae,ye,Oe,Ge,!1),je!==null&&zt!==null&&Bf(Ae,zt,je,Ge,!0)}}e:{if(ye=se?ps(se):window,Oe=ye.nodeName&&ye.nodeName.toLowerCase(),Oe==="select"||Oe==="input"&&ye.type==="file")var Xe=Yv;else if(xf(ye))if(Sf)Xe=Jv;else{Xe=Zv;var Ze=Kv}else(Oe=ye.nodeName)&&Oe.toLowerCase()==="input"&&(ye.type==="checkbox"||ye.type==="radio")&&(Xe=Qv);if(Xe&&(Xe=Xe(n,se))){yf(Ae,Xe,a,Se);break e}Ze&&Ze(n,ye,se),n==="focusout"&&(Ze=ye._wrapperState)&&Ze.controlled&&ye.type==="number"&&F(ye,"number",ye.value)}switch(Ze=se?ps(se):window,n){case"focusin":(xf(Ze)||Ze.contentEditable==="true")&&(us=Ze,Mc=se,Sa=null);break;case"focusout":Sa=Mc=us=null;break;case"mousedown":Ec=!0;break;case"contextmenu":case"mouseup":case"dragend":Ec=!1,Rf(Ae,a,Se);break;case"selectionchange":if(n_)break;case"keydown":case"keyup":Rf(Ae,a,Se)}var Qe;if(_c)e:{switch(n){case"compositionstart":var tt="onCompositionStart";break e;case"compositionend":tt="onCompositionEnd";break e;case"compositionupdate":tt="onCompositionUpdate";break e}tt=void 0}else cs?vf(n,a)&&(tt="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(tt="onCompositionStart");tt&&(pf&&a.locale!=="ko"&&(cs||tt!=="onCompositionStart"?tt==="onCompositionEnd"&&cs&&(Qe=cf()):(Ki=Se,fc="value"in Ki?Ki.value:Ki.textContent,cs=!0)),Ze=yo(se,tt),0<Ze.length&&(tt=new ff(tt,n,null,a,Se),Ae.push({event:tt,listeners:Ze}),Qe?tt.data=Qe:(Qe=_f(a),Qe!==null&&(tt.data=Qe)))),(Qe=Gv?Wv(n,a):Xv(n,a))&&(se=yo(se,"onBeforeInput"),0<se.length&&(Se=new ff("onBeforeInput","beforeinput",null,a,Se),Ae.push({event:Se,listeners:se}),Se.data=Qe))}kf(Ae,i)})}function wa(n,i,a){return{instance:n,listener:i,currentTarget:a}}function yo(n,i){for(var a=i+"Capture",c=[];n!==null;){var h=n,v=h.stateNode;h.tag===5&&v!==null&&(h=v,v=Vi(n,a),v!=null&&c.unshift(wa(n,v,h)),v=Vi(n,i),v!=null&&c.push(wa(n,v,h))),n=n.return}return c}function fs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Bf(n,i,a,c,h){for(var v=i._reactName,T=[];a!==null&&a!==c;){var U=a,H=U.alternate,se=U.stateNode;if(H!==null&&H===c)break;U.tag===5&&se!==null&&(U=se,h?(H=Vi(a,v),H!=null&&T.unshift(wa(a,H,U))):h||(H=Vi(a,v),H!=null&&T.push(wa(a,H,U)))),a=a.return}T.length!==0&&n.push({event:i,listeners:T})}var a_=/\r\n?/g,o_=/\u0000|\uFFFD/g;function Hf(n){return(typeof n=="string"?n:""+n).replace(a_,`
`).replace(o_,"")}function So(n,i,a){if(i=Hf(i),Hf(n)!==i&&a)throw Error(t(425))}function Mo(){}var Rc=null,Nc=null;function Pc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Lc=typeof setTimeout=="function"?setTimeout:void 0,l_=typeof clearTimeout=="function"?clearTimeout:void 0,jf=typeof Promise=="function"?Promise:void 0,c_=typeof queueMicrotask=="function"?queueMicrotask:typeof jf<"u"?function(n){return jf.resolve(null).then(n).catch(u_)}:Lc;function u_(n){setTimeout(function(){throw n})}function Dc(n,i){var a=i,c=0;do{var h=a.nextSibling;if(n.removeChild(a),h&&h.nodeType===8)if(a=h.data,a==="/$"){if(c===0){n.removeChild(h),pa(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=h}while(a);pa(i)}function Qi(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Vf(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var hs=Math.random().toString(36).slice(2),ci="__reactFiber$"+hs,Ta="__reactProps$"+hs,wi="__reactContainer$"+hs,Uc="__reactEvents$"+hs,d_="__reactListeners$"+hs,f_="__reactHandles$"+hs;function br(n){var i=n[ci];if(i)return i;for(var a=n.parentNode;a;){if(i=a[wi]||a[ci]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=Vf(n);n!==null;){if(a=n[ci])return a;n=Vf(n)}return i}n=a,a=n.parentNode}return null}function Aa(n){return n=n[ci]||n[wi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ps(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Eo(n){return n[Ta]||null}var Ic=[],ms=-1;function Ji(n){return{current:n}}function Pt(n){0>ms||(n.current=Ic[ms],Ic[ms]=null,ms--)}function bt(n,i){ms++,Ic[ms]=n.current,n.current=i}var er={},cn=Ji(er),Sn=Ji(!1),Rr=er;function gs(n,i){var a=n.type.contextTypes;if(!a)return er;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},v;for(v in a)h[v]=i[v];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function Mn(n){return n=n.childContextTypes,n!=null}function wo(){Pt(Sn),Pt(cn)}function Gf(n,i,a){if(cn.current!==er)throw Error(t(168));bt(cn,i),bt(Sn,a)}function Wf(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,ge(n)||"Unknown",h));return te({},a,c)}function To(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||er,Rr=cn.current,bt(cn,n),bt(Sn,Sn.current),!0}function Xf(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Wf(n,i,Rr),c.__reactInternalMemoizedMergedChildContext=n,Pt(Sn),Pt(cn),bt(cn,n)):Pt(Sn),bt(Sn,a)}var Ti=null,Ao=!1,Fc=!1;function $f(n){Ti===null?Ti=[n]:Ti.push(n)}function h_(n){Ao=!0,$f(n)}function tr(){if(!Fc&&Ti!==null){Fc=!0;var n=0,i=Et;try{var a=Ti;for(Et=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Ti=null,Ao=!1}catch(h){throw Ti!==null&&(Ti=Ti.slice(n+1)),We(Dt,tr),h}finally{Et=i,Fc=!1}}return null}var vs=[],_s=0,Co=null,bo=0,Hn=[],jn=0,Nr=null,Ai=1,Ci="";function Pr(n,i){vs[_s++]=bo,vs[_s++]=Co,Co=n,bo=i}function qf(n,i,a){Hn[jn++]=Ai,Hn[jn++]=Ci,Hn[jn++]=Nr,Nr=n;var c=Ai;n=Ci;var h=32-Wt(c)-1;c&=~(1<<h),a+=1;var v=32-Wt(i)+h;if(30<v){var T=h-h%5;v=(c&(1<<T)-1).toString(32),c>>=T,h-=T,Ai=1<<32-Wt(i)+h|a<<h|c,Ci=v+n}else Ai=1<<v|a<<h|c,Ci=n}function Oc(n){n.return!==null&&(Pr(n,1),qf(n,1,0))}function kc(n){for(;n===Co;)Co=vs[--_s],vs[_s]=null,bo=vs[--_s],vs[_s]=null;for(;n===Nr;)Nr=Hn[--jn],Hn[jn]=null,Ci=Hn[--jn],Hn[jn]=null,Ai=Hn[--jn],Hn[jn]=null}var Dn=null,Un=null,Ut=!1,Jn=null;function Yf(n,i){var a=Xn(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Kf(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Dn=n,Un=Qi(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Dn=n,Un=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Nr!==null?{id:Ai,overflow:Ci}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=Xn(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,Dn=n,Un=null,!0):!1;default:return!1}}function zc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Bc(n){if(Ut){var i=Un;if(i){var a=i;if(!Kf(n,i)){if(zc(n))throw Error(t(418));i=Qi(a.nextSibling);var c=Dn;i&&Kf(n,i)?Yf(c,a):(n.flags=n.flags&-4097|2,Ut=!1,Dn=n)}}else{if(zc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Ut=!1,Dn=n}}}function Zf(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Dn=n}function Ro(n){if(n!==Dn)return!1;if(!Ut)return Zf(n),Ut=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Pc(n.type,n.memoizedProps)),i&&(i=Un)){if(zc(n))throw Qf(),Error(t(418));for(;i;)Yf(n,i),i=Qi(i.nextSibling)}if(Zf(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){Un=Qi(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}Un=null}}else Un=Dn?Qi(n.stateNode.nextSibling):null;return!0}function Qf(){for(var n=Un;n;)n=Qi(n.nextSibling)}function xs(){Un=Dn=null,Ut=!1}function Hc(n){Jn===null?Jn=[n]:Jn.push(n)}var p_=D.ReactCurrentBatchConfig;function Ca(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var h=c,v=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===v?i.ref:(i=function(T){var U=h.refs;T===null?delete U[v]:U[v]=T},i._stringRef=v,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function No(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Jf(n){var i=n._init;return i(n._payload)}function eh(n){function i(Z,W){if(n){var ee=Z.deletions;ee===null?(Z.deletions=[W],Z.flags|=16):ee.push(W)}}function a(Z,W){if(!n)return null;for(;W!==null;)i(Z,W),W=W.sibling;return null}function c(Z,W){for(Z=new Map;W!==null;)W.key!==null?Z.set(W.key,W):Z.set(W.index,W),W=W.sibling;return Z}function h(Z,W){return Z=cr(Z,W),Z.index=0,Z.sibling=null,Z}function v(Z,W,ee){return Z.index=ee,n?(ee=Z.alternate,ee!==null?(ee=ee.index,ee<W?(Z.flags|=2,W):ee):(Z.flags|=2,W)):(Z.flags|=1048576,W)}function T(Z){return n&&Z.alternate===null&&(Z.flags|=2),Z}function U(Z,W,ee,be){return W===null||W.tag!==6?(W=Lu(ee,Z.mode,be),W.return=Z,W):(W=h(W,ee),W.return=Z,W)}function H(Z,W,ee,be){var Xe=ee.type;return Xe===L?Se(Z,W,ee.props.children,be,ee.key):W!==null&&(W.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===ue&&Jf(Xe)===W.type)?(be=h(W,ee.props),be.ref=Ca(Z,W,ee),be.return=Z,be):(be=el(ee.type,ee.key,ee.props,null,Z.mode,be),be.ref=Ca(Z,W,ee),be.return=Z,be)}function se(Z,W,ee,be){return W===null||W.tag!==4||W.stateNode.containerInfo!==ee.containerInfo||W.stateNode.implementation!==ee.implementation?(W=Du(ee,Z.mode,be),W.return=Z,W):(W=h(W,ee.children||[]),W.return=Z,W)}function Se(Z,W,ee,be,Xe){return W===null||W.tag!==7?(W=zr(ee,Z.mode,be,Xe),W.return=Z,W):(W=h(W,ee),W.return=Z,W)}function Ae(Z,W,ee){if(typeof W=="string"&&W!==""||typeof W=="number")return W=Lu(""+W,Z.mode,ee),W.return=Z,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case X:return ee=el(W.type,W.key,W.props,null,Z.mode,ee),ee.ref=Ca(Z,null,W),ee.return=Z,ee;case I:return W=Du(W,Z.mode,ee),W.return=Z,W;case ue:var be=W._init;return Ae(Z,be(W._payload),ee)}if(N(W)||de(W))return W=zr(W,Z.mode,ee,null),W.return=Z,W;No(Z,W)}return null}function ye(Z,W,ee,be){var Xe=W!==null?W.key:null;if(typeof ee=="string"&&ee!==""||typeof ee=="number")return Xe!==null?null:U(Z,W,""+ee,be);if(typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case X:return ee.key===Xe?H(Z,W,ee,be):null;case I:return ee.key===Xe?se(Z,W,ee,be):null;case ue:return Xe=ee._init,ye(Z,W,Xe(ee._payload),be)}if(N(ee)||de(ee))return Xe!==null?null:Se(Z,W,ee,be,null);No(Z,ee)}return null}function Oe(Z,W,ee,be,Xe){if(typeof be=="string"&&be!==""||typeof be=="number")return Z=Z.get(ee)||null,U(W,Z,""+be,Xe);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case X:return Z=Z.get(be.key===null?ee:be.key)||null,H(W,Z,be,Xe);case I:return Z=Z.get(be.key===null?ee:be.key)||null,se(W,Z,be,Xe);case ue:var Ze=be._init;return Oe(Z,W,ee,Ze(be._payload),Xe)}if(N(be)||de(be))return Z=Z.get(ee)||null,Se(W,Z,be,Xe,null);No(W,be)}return null}function je(Z,W,ee,be){for(var Xe=null,Ze=null,Qe=W,tt=W=0,tn=null;Qe!==null&&tt<ee.length;tt++){Qe.index>tt?(tn=Qe,Qe=null):tn=Qe.sibling;var St=ye(Z,Qe,ee[tt],be);if(St===null){Qe===null&&(Qe=tn);break}n&&Qe&&St.alternate===null&&i(Z,Qe),W=v(St,W,tt),Ze===null?Xe=St:Ze.sibling=St,Ze=St,Qe=tn}if(tt===ee.length)return a(Z,Qe),Ut&&Pr(Z,tt),Xe;if(Qe===null){for(;tt<ee.length;tt++)Qe=Ae(Z,ee[tt],be),Qe!==null&&(W=v(Qe,W,tt),Ze===null?Xe=Qe:Ze.sibling=Qe,Ze=Qe);return Ut&&Pr(Z,tt),Xe}for(Qe=c(Z,Qe);tt<ee.length;tt++)tn=Oe(Qe,Z,tt,ee[tt],be),tn!==null&&(n&&tn.alternate!==null&&Qe.delete(tn.key===null?tt:tn.key),W=v(tn,W,tt),Ze===null?Xe=tn:Ze.sibling=tn,Ze=tn);return n&&Qe.forEach(function(ur){return i(Z,ur)}),Ut&&Pr(Z,tt),Xe}function Ge(Z,W,ee,be){var Xe=de(ee);if(typeof Xe!="function")throw Error(t(150));if(ee=Xe.call(ee),ee==null)throw Error(t(151));for(var Ze=Xe=null,Qe=W,tt=W=0,tn=null,St=ee.next();Qe!==null&&!St.done;tt++,St=ee.next()){Qe.index>tt?(tn=Qe,Qe=null):tn=Qe.sibling;var ur=ye(Z,Qe,St.value,be);if(ur===null){Qe===null&&(Qe=tn);break}n&&Qe&&ur.alternate===null&&i(Z,Qe),W=v(ur,W,tt),Ze===null?Xe=ur:Ze.sibling=ur,Ze=ur,Qe=tn}if(St.done)return a(Z,Qe),Ut&&Pr(Z,tt),Xe;if(Qe===null){for(;!St.done;tt++,St=ee.next())St=Ae(Z,St.value,be),St!==null&&(W=v(St,W,tt),Ze===null?Xe=St:Ze.sibling=St,Ze=St);return Ut&&Pr(Z,tt),Xe}for(Qe=c(Z,Qe);!St.done;tt++,St=ee.next())St=Oe(Qe,Z,tt,St.value,be),St!==null&&(n&&St.alternate!==null&&Qe.delete(St.key===null?tt:St.key),W=v(St,W,tt),Ze===null?Xe=St:Ze.sibling=St,Ze=St);return n&&Qe.forEach(function($_){return i(Z,$_)}),Ut&&Pr(Z,tt),Xe}function zt(Z,W,ee,be){if(typeof ee=="object"&&ee!==null&&ee.type===L&&ee.key===null&&(ee=ee.props.children),typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case X:e:{for(var Xe=ee.key,Ze=W;Ze!==null;){if(Ze.key===Xe){if(Xe=ee.type,Xe===L){if(Ze.tag===7){a(Z,Ze.sibling),W=h(Ze,ee.props.children),W.return=Z,Z=W;break e}}else if(Ze.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===ue&&Jf(Xe)===Ze.type){a(Z,Ze.sibling),W=h(Ze,ee.props),W.ref=Ca(Z,Ze,ee),W.return=Z,Z=W;break e}a(Z,Ze);break}else i(Z,Ze);Ze=Ze.sibling}ee.type===L?(W=zr(ee.props.children,Z.mode,be,ee.key),W.return=Z,Z=W):(be=el(ee.type,ee.key,ee.props,null,Z.mode,be),be.ref=Ca(Z,W,ee),be.return=Z,Z=be)}return T(Z);case I:e:{for(Ze=ee.key;W!==null;){if(W.key===Ze)if(W.tag===4&&W.stateNode.containerInfo===ee.containerInfo&&W.stateNode.implementation===ee.implementation){a(Z,W.sibling),W=h(W,ee.children||[]),W.return=Z,Z=W;break e}else{a(Z,W);break}else i(Z,W);W=W.sibling}W=Du(ee,Z.mode,be),W.return=Z,Z=W}return T(Z);case ue:return Ze=ee._init,zt(Z,W,Ze(ee._payload),be)}if(N(ee))return je(Z,W,ee,be);if(de(ee))return Ge(Z,W,ee,be);No(Z,ee)}return typeof ee=="string"&&ee!==""||typeof ee=="number"?(ee=""+ee,W!==null&&W.tag===6?(a(Z,W.sibling),W=h(W,ee),W.return=Z,Z=W):(a(Z,W),W=Lu(ee,Z.mode,be),W.return=Z,Z=W),T(Z)):a(Z,W)}return zt}var ys=eh(!0),th=eh(!1),Po=Ji(null),Lo=null,Ss=null,jc=null;function Vc(){jc=Ss=Lo=null}function Gc(n){var i=Po.current;Pt(Po),n._currentValue=i}function Wc(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function Ms(n,i){Lo=n,jc=Ss=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(En=!0),n.firstContext=null)}function Vn(n){var i=n._currentValue;if(jc!==n)if(n={context:n,memoizedValue:i,next:null},Ss===null){if(Lo===null)throw Error(t(308));Ss=n,Lo.dependencies={lanes:0,firstContext:n}}else Ss=Ss.next=n;return i}var Lr=null;function Xc(n){Lr===null?Lr=[n]:Lr.push(n)}function nh(n,i,a,c){var h=i.interleaved;return h===null?(a.next=a,Xc(i)):(a.next=h.next,h.next=a),i.interleaved=a,bi(n,c)}function bi(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var nr=!1;function $c(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ih(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ri(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ir(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(vt&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,bi(n,a)}return h=c.interleaved,h===null?(i.next=i,Xc(c)):(i.next=h.next,h.next=i),c.interleaved=i,bi(n,a)}function Do(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,oc(n,a)}}function rh(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var h=null,v=null;if(a=a.firstBaseUpdate,a!==null){do{var T={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};v===null?h=v=T:v=v.next=T,a=a.next}while(a!==null);v===null?h=v=i:v=v.next=i}else h=v=i;a={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:v,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function Uo(n,i,a,c){var h=n.updateQueue;nr=!1;var v=h.firstBaseUpdate,T=h.lastBaseUpdate,U=h.shared.pending;if(U!==null){h.shared.pending=null;var H=U,se=H.next;H.next=null,T===null?v=se:T.next=se,T=H;var Se=n.alternate;Se!==null&&(Se=Se.updateQueue,U=Se.lastBaseUpdate,U!==T&&(U===null?Se.firstBaseUpdate=se:U.next=se,Se.lastBaseUpdate=H))}if(v!==null){var Ae=h.baseState;T=0,Se=se=H=null,U=v;do{var ye=U.lane,Oe=U.eventTime;if((c&ye)===ye){Se!==null&&(Se=Se.next={eventTime:Oe,lane:0,tag:U.tag,payload:U.payload,callback:U.callback,next:null});e:{var je=n,Ge=U;switch(ye=i,Oe=a,Ge.tag){case 1:if(je=Ge.payload,typeof je=="function"){Ae=je.call(Oe,Ae,ye);break e}Ae=je;break e;case 3:je.flags=je.flags&-65537|128;case 0:if(je=Ge.payload,ye=typeof je=="function"?je.call(Oe,Ae,ye):je,ye==null)break e;Ae=te({},Ae,ye);break e;case 2:nr=!0}}U.callback!==null&&U.lane!==0&&(n.flags|=64,ye=h.effects,ye===null?h.effects=[U]:ye.push(U))}else Oe={eventTime:Oe,lane:ye,tag:U.tag,payload:U.payload,callback:U.callback,next:null},Se===null?(se=Se=Oe,H=Ae):Se=Se.next=Oe,T|=ye;if(U=U.next,U===null){if(U=h.shared.pending,U===null)break;ye=U,U=ye.next,ye.next=null,h.lastBaseUpdate=ye,h.shared.pending=null}}while(!0);if(Se===null&&(H=Ae),h.baseState=H,h.firstBaseUpdate=se,h.lastBaseUpdate=Se,i=h.shared.interleaved,i!==null){h=i;do T|=h.lane,h=h.next;while(h!==i)}else v===null&&(h.shared.lanes=0);Ir|=T,n.lanes=T,n.memoizedState=Ae}}function sh(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=a,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var ba={},ui=Ji(ba),Ra=Ji(ba),Na=Ji(ba);function Dr(n){if(n===ba)throw Error(t(174));return n}function qc(n,i){switch(bt(Na,i),bt(Ra,n),bt(ui,ba),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ne(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ne(i,n)}Pt(ui),bt(ui,i)}function Es(){Pt(ui),Pt(Ra),Pt(Na)}function ah(n){Dr(Na.current);var i=Dr(ui.current),a=Ne(i,n.type);i!==a&&(bt(Ra,n),bt(ui,a))}function Yc(n){Ra.current===n&&(Pt(ui),Pt(Ra))}var It=Ji(0);function Io(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Kc=[];function Zc(){for(var n=0;n<Kc.length;n++)Kc[n]._workInProgressVersionPrimary=null;Kc.length=0}var Fo=D.ReactCurrentDispatcher,Qc=D.ReactCurrentBatchConfig,Ur=0,Ft=null,Xt=null,Jt=null,Oo=!1,Pa=!1,La=0,m_=0;function un(){throw Error(t(321))}function Jc(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Qn(n[a],i[a]))return!1;return!0}function eu(n,i,a,c,h,v){if(Ur=v,Ft=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Fo.current=n===null||n.memoizedState===null?x_:y_,n=a(c,h),Pa){v=0;do{if(Pa=!1,La=0,25<=v)throw Error(t(301));v+=1,Jt=Xt=null,i.updateQueue=null,Fo.current=S_,n=a(c,h)}while(Pa)}if(Fo.current=Bo,i=Xt!==null&&Xt.next!==null,Ur=0,Jt=Xt=Ft=null,Oo=!1,i)throw Error(t(300));return n}function tu(){var n=La!==0;return La=0,n}function di(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Jt===null?Ft.memoizedState=Jt=n:Jt=Jt.next=n,Jt}function Gn(){if(Xt===null){var n=Ft.alternate;n=n!==null?n.memoizedState:null}else n=Xt.next;var i=Jt===null?Ft.memoizedState:Jt.next;if(i!==null)Jt=i,Xt=n;else{if(n===null)throw Error(t(310));Xt=n,n={memoizedState:Xt.memoizedState,baseState:Xt.baseState,baseQueue:Xt.baseQueue,queue:Xt.queue,next:null},Jt===null?Ft.memoizedState=Jt=n:Jt=Jt.next=n}return Jt}function Da(n,i){return typeof i=="function"?i(n):i}function nu(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=Xt,h=c.baseQueue,v=a.pending;if(v!==null){if(h!==null){var T=h.next;h.next=v.next,v.next=T}c.baseQueue=h=v,a.pending=null}if(h!==null){v=h.next,c=c.baseState;var U=T=null,H=null,se=v;do{var Se=se.lane;if((Ur&Se)===Se)H!==null&&(H=H.next={lane:0,action:se.action,hasEagerState:se.hasEagerState,eagerState:se.eagerState,next:null}),c=se.hasEagerState?se.eagerState:n(c,se.action);else{var Ae={lane:Se,action:se.action,hasEagerState:se.hasEagerState,eagerState:se.eagerState,next:null};H===null?(U=H=Ae,T=c):H=H.next=Ae,Ft.lanes|=Se,Ir|=Se}se=se.next}while(se!==null&&se!==v);H===null?T=c:H.next=U,Qn(c,i.memoizedState)||(En=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=H,a.lastRenderedState=c}if(n=a.interleaved,n!==null){h=n;do v=h.lane,Ft.lanes|=v,Ir|=v,h=h.next;while(h!==n)}else h===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function iu(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,h=a.pending,v=i.memoizedState;if(h!==null){a.pending=null;var T=h=h.next;do v=n(v,T.action),T=T.next;while(T!==h);Qn(v,i.memoizedState)||(En=!0),i.memoizedState=v,i.baseQueue===null&&(i.baseState=v),a.lastRenderedState=v}return[v,c]}function oh(){}function lh(n,i){var a=Ft,c=Gn(),h=i(),v=!Qn(c.memoizedState,h);if(v&&(c.memoizedState=h,En=!0),c=c.queue,ru(dh.bind(null,a,c,n),[n]),c.getSnapshot!==i||v||Jt!==null&&Jt.memoizedState.tag&1){if(a.flags|=2048,Ua(9,uh.bind(null,a,c,h,i),void 0,null),en===null)throw Error(t(349));(Ur&30)!==0||ch(a,i,h)}return h}function ch(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function uh(n,i,a,c){i.value=a,i.getSnapshot=c,fh(i)&&hh(n)}function dh(n,i,a){return a(function(){fh(i)&&hh(n)})}function fh(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Qn(n,a)}catch{return!0}}function hh(n){var i=bi(n,1);i!==null&&ii(i,n,1,-1)}function ph(n){var i=di();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Da,lastRenderedState:n},i.queue=n,n=n.dispatch=__.bind(null,Ft,n),[i.memoizedState,n]}function Ua(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function mh(){return Gn().memoizedState}function ko(n,i,a,c){var h=di();Ft.flags|=n,h.memoizedState=Ua(1|i,a,void 0,c===void 0?null:c)}function zo(n,i,a,c){var h=Gn();c=c===void 0?null:c;var v=void 0;if(Xt!==null){var T=Xt.memoizedState;if(v=T.destroy,c!==null&&Jc(c,T.deps)){h.memoizedState=Ua(i,a,v,c);return}}Ft.flags|=n,h.memoizedState=Ua(1|i,a,v,c)}function gh(n,i){return ko(8390656,8,n,i)}function ru(n,i){return zo(2048,8,n,i)}function vh(n,i){return zo(4,2,n,i)}function _h(n,i){return zo(4,4,n,i)}function xh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function yh(n,i,a){return a=a!=null?a.concat([n]):null,zo(4,4,xh.bind(null,i,n),a)}function su(){}function Sh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Jc(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function Mh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Jc(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function Eh(n,i,a){return(Ur&21)===0?(n.baseState&&(n.baseState=!1,En=!0),n.memoizedState=a):(Qn(a,i)||(a=Qd(),Ft.lanes|=a,Ir|=a,n.baseState=!0),i)}function g_(n,i){var a=Et;Et=a!==0&&4>a?a:4,n(!0);var c=Qc.transition;Qc.transition={};try{n(!1),i()}finally{Et=a,Qc.transition=c}}function wh(){return Gn().memoizedState}function v_(n,i,a){var c=or(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Th(n))Ah(i,a);else if(a=nh(n,i,a,c),a!==null){var h=_n();ii(a,n,c,h),Ch(a,i,c)}}function __(n,i,a){var c=or(n),h={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Th(n))Ah(i,h);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=i.lastRenderedReducer,v!==null))try{var T=i.lastRenderedState,U=v(T,a);if(h.hasEagerState=!0,h.eagerState=U,Qn(U,T)){var H=i.interleaved;H===null?(h.next=h,Xc(i)):(h.next=H.next,H.next=h),i.interleaved=h;return}}catch{}finally{}a=nh(n,i,h,c),a!==null&&(h=_n(),ii(a,n,c,h),Ch(a,i,c))}}function Th(n){var i=n.alternate;return n===Ft||i!==null&&i===Ft}function Ah(n,i){Pa=Oo=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Ch(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,oc(n,a)}}var Bo={readContext:Vn,useCallback:un,useContext:un,useEffect:un,useImperativeHandle:un,useInsertionEffect:un,useLayoutEffect:un,useMemo:un,useReducer:un,useRef:un,useState:un,useDebugValue:un,useDeferredValue:un,useTransition:un,useMutableSource:un,useSyncExternalStore:un,useId:un,unstable_isNewReconciler:!1},x_={readContext:Vn,useCallback:function(n,i){return di().memoizedState=[n,i===void 0?null:i],n},useContext:Vn,useEffect:gh,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,ko(4194308,4,xh.bind(null,i,n),a)},useLayoutEffect:function(n,i){return ko(4194308,4,n,i)},useInsertionEffect:function(n,i){return ko(4,2,n,i)},useMemo:function(n,i){var a=di();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=di();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=v_.bind(null,Ft,n),[c.memoizedState,n]},useRef:function(n){var i=di();return n={current:n},i.memoizedState=n},useState:ph,useDebugValue:su,useDeferredValue:function(n){return di().memoizedState=n},useTransition:function(){var n=ph(!1),i=n[0];return n=g_.bind(null,n[1]),di().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=Ft,h=di();if(Ut){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),en===null)throw Error(t(349));(Ur&30)!==0||ch(c,i,a)}h.memoizedState=a;var v={value:a,getSnapshot:i};return h.queue=v,gh(dh.bind(null,c,v,n),[n]),c.flags|=2048,Ua(9,uh.bind(null,c,v,a,i),void 0,null),a},useId:function(){var n=di(),i=en.identifierPrefix;if(Ut){var a=Ci,c=Ai;a=(c&~(1<<32-Wt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=La++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=m_++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},y_={readContext:Vn,useCallback:Sh,useContext:Vn,useEffect:ru,useImperativeHandle:yh,useInsertionEffect:vh,useLayoutEffect:_h,useMemo:Mh,useReducer:nu,useRef:mh,useState:function(){return nu(Da)},useDebugValue:su,useDeferredValue:function(n){var i=Gn();return Eh(i,Xt.memoizedState,n)},useTransition:function(){var n=nu(Da)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:oh,useSyncExternalStore:lh,useId:wh,unstable_isNewReconciler:!1},S_={readContext:Vn,useCallback:Sh,useContext:Vn,useEffect:ru,useImperativeHandle:yh,useInsertionEffect:vh,useLayoutEffect:_h,useMemo:Mh,useReducer:iu,useRef:mh,useState:function(){return iu(Da)},useDebugValue:su,useDeferredValue:function(n){var i=Gn();return Xt===null?i.memoizedState=n:Eh(i,Xt.memoizedState,n)},useTransition:function(){var n=iu(Da)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:oh,useSyncExternalStore:lh,useId:wh,unstable_isNewReconciler:!1};function ei(n,i){if(n&&n.defaultProps){i=te({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function au(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:te({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Ho={isMounted:function(n){return(n=n._reactInternals)?P(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Do(i,n,h))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.tag=1,v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Do(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=_n(),c=or(n),h=Ri(a,c);h.tag=2,i!=null&&(h.callback=i),i=ir(n,h,c),i!==null&&(ii(i,n,c,a),Do(i,n,c))}};function bh(n,i,a,c,h,v,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,v,T):i.prototype&&i.prototype.isPureReactComponent?!ya(a,c)||!ya(h,v):!0}function Rh(n,i,a){var c=!1,h=er,v=i.contextType;return typeof v=="object"&&v!==null?v=Vn(v):(h=Mn(i)?Rr:cn.current,c=i.contextTypes,v=(c=c!=null)?gs(n,h):er),i=new i(a,v),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ho,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=v),i}function Nh(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&Ho.enqueueReplaceState(i,i.state,null)}function ou(n,i,a,c){var h=n.stateNode;h.props=a,h.state=n.memoizedState,h.refs={},$c(n);var v=i.contextType;typeof v=="object"&&v!==null?h.context=Vn(v):(v=Mn(i)?Rr:cn.current,h.context=gs(n,v)),h.state=n.memoizedState,v=i.getDerivedStateFromProps,typeof v=="function"&&(au(n,i,v,a),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Ho.enqueueReplaceState(h,h.state,null),Uo(n,a,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function ws(n,i){try{var a="",c=i;do a+=pe(c),c=c.return;while(c);var h=a}catch(v){h=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:i,stack:h,digest:null}}function lu(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function cu(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var M_=typeof WeakMap=="function"?WeakMap:Map;function Ph(n,i,a){a=Ri(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){qo||(qo=!0,wu=c),cu(n,i)},a}function Lh(n,i,a){a=Ri(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;a.payload=function(){return c(h)},a.callback=function(){cu(n,i)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(a.callback=function(){cu(n,i),typeof c!="function"&&(sr===null?sr=new Set([this]):sr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),a}function Dh(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new M_;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(a)||(h.add(a),n=F_.bind(null,n,i,a),i.then(n,n))}function Uh(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Ih(n,i,a,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Ri(-1,1),i.tag=2,ir(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var E_=D.ReactCurrentOwner,En=!1;function vn(n,i,a,c){i.child=n===null?th(i,null,a,c):ys(i,n.child,a,c)}function Fh(n,i,a,c,h){a=a.render;var v=i.ref;return Ms(i,h),c=eu(n,i,a,c,v,h),a=tu(),n!==null&&!En?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&a&&Oc(i),i.flags|=1,vn(n,i,c,h),i.child)}function Oh(n,i,a,c,h){if(n===null){var v=a.type;return typeof v=="function"&&!Pu(v)&&v.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=v,kh(n,i,v,c,h)):(n=el(a.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(v=n.child,(n.lanes&h)===0){var T=v.memoizedProps;if(a=a.compare,a=a!==null?a:ya,a(T,c)&&n.ref===i.ref)return Ni(n,i,h)}return i.flags|=1,n=cr(v,c),n.ref=i.ref,n.return=i,i.child=n}function kh(n,i,a,c,h){if(n!==null){var v=n.memoizedProps;if(ya(v,c)&&n.ref===i.ref)if(En=!1,i.pendingProps=c=v,(n.lanes&h)!==0)(n.flags&131072)!==0&&(En=!0);else return i.lanes=n.lanes,Ni(n,i,h)}return uu(n,i,a,c,h)}function zh(n,i,a){var c=i.pendingProps,h=c.children,v=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},bt(As,In),In|=a;else{if((a&1073741824)===0)return n=v!==null?v.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,bt(As,In),In|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=v!==null?v.baseLanes:a,bt(As,In),In|=c}else v!==null?(c=v.baseLanes|a,i.memoizedState=null):c=a,bt(As,In),In|=c;return vn(n,i,h,a),i.child}function Bh(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function uu(n,i,a,c,h){var v=Mn(a)?Rr:cn.current;return v=gs(i,v),Ms(i,h),a=eu(n,i,a,c,v,h),c=tu(),n!==null&&!En?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&c&&Oc(i),i.flags|=1,vn(n,i,a,h),i.child)}function Hh(n,i,a,c,h){if(Mn(a)){var v=!0;To(i)}else v=!1;if(Ms(i,h),i.stateNode===null)Vo(n,i),Rh(i,a,c),ou(i,a,c,h),c=!0;else if(n===null){var T=i.stateNode,U=i.memoizedProps;T.props=U;var H=T.context,se=a.contextType;typeof se=="object"&&se!==null?se=Vn(se):(se=Mn(a)?Rr:cn.current,se=gs(i,se));var Se=a.getDerivedStateFromProps,Ae=typeof Se=="function"||typeof T.getSnapshotBeforeUpdate=="function";Ae||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(U!==c||H!==se)&&Nh(i,T,c,se),nr=!1;var ye=i.memoizedState;T.state=ye,Uo(i,c,T,h),H=i.memoizedState,U!==c||ye!==H||Sn.current||nr?(typeof Se=="function"&&(au(i,a,Se,c),H=i.memoizedState),(U=nr||bh(i,a,U,c,ye,H,se))?(Ae||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=H),T.props=c,T.state=H,T.context=se,c=U):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,ih(n,i),U=i.memoizedProps,se=i.type===i.elementType?U:ei(i.type,U),T.props=se,Ae=i.pendingProps,ye=T.context,H=a.contextType,typeof H=="object"&&H!==null?H=Vn(H):(H=Mn(a)?Rr:cn.current,H=gs(i,H));var Oe=a.getDerivedStateFromProps;(Se=typeof Oe=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(U!==Ae||ye!==H)&&Nh(i,T,c,H),nr=!1,ye=i.memoizedState,T.state=ye,Uo(i,c,T,h);var je=i.memoizedState;U!==Ae||ye!==je||Sn.current||nr?(typeof Oe=="function"&&(au(i,a,Oe,c),je=i.memoizedState),(se=nr||bh(i,a,se,c,ye,je,H)||!1)?(Se||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,je,H),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,je,H)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||U===n.memoizedProps&&ye===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||U===n.memoizedProps&&ye===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=je),T.props=c,T.state=je,T.context=H,c=se):(typeof T.componentDidUpdate!="function"||U===n.memoizedProps&&ye===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||U===n.memoizedProps&&ye===n.memoizedState||(i.flags|=1024),c=!1)}return du(n,i,a,c,v,h)}function du(n,i,a,c,h,v){Bh(n,i);var T=(i.flags&128)!==0;if(!c&&!T)return h&&Xf(i,a,!1),Ni(n,i,v);c=i.stateNode,E_.current=i;var U=T&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&T?(i.child=ys(i,n.child,null,v),i.child=ys(i,null,U,v)):vn(n,i,U,v),i.memoizedState=c.state,h&&Xf(i,a,!0),i.child}function jh(n){var i=n.stateNode;i.pendingContext?Gf(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Gf(n,i.context,!1),qc(n,i.containerInfo)}function Vh(n,i,a,c,h){return xs(),Hc(h),i.flags|=256,vn(n,i,a,c),i.child}var fu={dehydrated:null,treeContext:null,retryLane:0};function hu(n){return{baseLanes:n,cachePool:null,transitions:null}}function Gh(n,i,a){var c=i.pendingProps,h=It.current,v=!1,T=(i.flags&128)!==0,U;if((U=T)||(U=n!==null&&n.memoizedState===null?!1:(h&2)!==0),U?(v=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),bt(It,h&1),n===null)return Bc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,n=c.fallback,v?(c=i.mode,v=i.child,T={mode:"hidden",children:T},(c&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=T):v=tl(T,c,0,null),n=zr(n,c,a,null),v.return=i,n.return=i,v.sibling=n,i.child=v,i.child.memoizedState=hu(a),i.memoizedState=fu,n):pu(i,T));if(h=n.memoizedState,h!==null&&(U=h.dehydrated,U!==null))return w_(n,i,T,c,U,h,a);if(v){v=c.fallback,T=i.mode,h=n.child,U=h.sibling;var H={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=H,i.deletions=null):(c=cr(h,H),c.subtreeFlags=h.subtreeFlags&14680064),U!==null?v=cr(U,v):(v=zr(v,T,a,null),v.flags|=2),v.return=i,c.return=i,c.sibling=v,i.child=c,c=v,v=i.child,T=n.child.memoizedState,T=T===null?hu(a):{baseLanes:T.baseLanes|a,cachePool:null,transitions:T.transitions},v.memoizedState=T,v.childLanes=n.childLanes&~a,i.memoizedState=fu,c}return v=n.child,n=v.sibling,c=cr(v,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function pu(n,i){return i=tl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function jo(n,i,a,c){return c!==null&&Hc(c),ys(i,n.child,null,a),n=pu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function w_(n,i,a,c,h,v,T){if(a)return i.flags&256?(i.flags&=-257,c=lu(Error(t(422))),jo(n,i,T,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(v=c.fallback,h=i.mode,c=tl({mode:"visible",children:c.children},h,0,null),v=zr(v,h,T,null),v.flags|=2,c.return=i,v.return=i,c.sibling=v,i.child=c,(i.mode&1)!==0&&ys(i,n.child,null,T),i.child.memoizedState=hu(T),i.memoizedState=fu,v);if((i.mode&1)===0)return jo(n,i,T,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var U=c.dgst;return c=U,v=Error(t(419)),c=lu(v,c,void 0),jo(n,i,T,c)}if(U=(T&n.childLanes)!==0,En||U){if(c=en,c!==null){switch(T&-T){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|T))!==0?0:h,h!==0&&h!==v.retryLane&&(v.retryLane=h,bi(n,h),ii(c,n,h,-1))}return Nu(),c=lu(Error(t(421))),jo(n,i,T,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=O_.bind(null,n),h._reactRetry=i,null):(n=v.treeContext,Un=Qi(h.nextSibling),Dn=i,Ut=!0,Jn=null,n!==null&&(Hn[jn++]=Ai,Hn[jn++]=Ci,Hn[jn++]=Nr,Ai=n.id,Ci=n.overflow,Nr=i),i=pu(i,c.children),i.flags|=4096,i)}function Wh(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),Wc(n.return,i,a)}function mu(n,i,a,c,h){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:h}:(v.isBackwards=i,v.rendering=null,v.renderingStartTime=0,v.last=c,v.tail=a,v.tailMode=h)}function Xh(n,i,a){var c=i.pendingProps,h=c.revealOrder,v=c.tail;if(vn(n,i,c.children,a),c=It.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Wh(n,a,i);else if(n.tag===19)Wh(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(bt(It,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(a=i.child,h=null;a!==null;)n=a.alternate,n!==null&&Io(n)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),mu(i,!1,h,a,v);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Io(n)===null){i.child=h;break}n=h.sibling,h.sibling=a,a=h,h=n}mu(i,!0,a,null,v);break;case"together":mu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Vo(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ni(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Ir|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=cr(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=cr(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function T_(n,i,a){switch(i.tag){case 3:jh(i),xs();break;case 5:ah(i);break;case 1:Mn(i.type)&&To(i);break;case 4:qc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;bt(Po,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(bt(It,It.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Gh(n,i,a):(bt(It,It.current&1),n=Ni(n,i,a),n!==null?n.sibling:null);bt(It,It.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Xh(n,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),bt(It,It.current),c)break;return null;case 22:case 23:return i.lanes=0,zh(n,i,a)}return Ni(n,i,a)}var $h,gu,qh,Yh;$h=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},gu=function(){},qh=function(n,i,a,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Dr(ui.current);var v=null;switch(a){case"input":h=Ke(n,h),c=Ke(n,c),v=[];break;case"select":h=te({},h,{value:void 0}),c=te({},c,{value:void 0}),v=[];break;case"textarea":h=ve(n,h),c=ve(n,c),v=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Mo)}dt(a,c);var T;a=null;for(se in h)if(!c.hasOwnProperty(se)&&h.hasOwnProperty(se)&&h[se]!=null)if(se==="style"){var U=h[se];for(T in U)U.hasOwnProperty(T)&&(a||(a={}),a[T]="")}else se!=="dangerouslySetInnerHTML"&&se!=="children"&&se!=="suppressContentEditableWarning"&&se!=="suppressHydrationWarning"&&se!=="autoFocus"&&(o.hasOwnProperty(se)?v||(v=[]):(v=v||[]).push(se,null));for(se in c){var H=c[se];if(U=h!=null?h[se]:void 0,c.hasOwnProperty(se)&&H!==U&&(H!=null||U!=null))if(se==="style")if(U){for(T in U)!U.hasOwnProperty(T)||H&&H.hasOwnProperty(T)||(a||(a={}),a[T]="");for(T in H)H.hasOwnProperty(T)&&U[T]!==H[T]&&(a||(a={}),a[T]=H[T])}else a||(v||(v=[]),v.push(se,a)),a=H;else se==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,U=U?U.__html:void 0,H!=null&&U!==H&&(v=v||[]).push(se,H)):se==="children"?typeof H!="string"&&typeof H!="number"||(v=v||[]).push(se,""+H):se!=="suppressContentEditableWarning"&&se!=="suppressHydrationWarning"&&(o.hasOwnProperty(se)?(H!=null&&se==="onScroll"&&Nt("scroll",n),v||U===H||(v=[])):(v=v||[]).push(se,H))}a&&(v=v||[]).push("style",a);var se=v;(i.updateQueue=se)&&(i.flags|=4)}},Yh=function(n,i,a,c){a!==c&&(i.flags|=4)};function Ia(n,i){if(!Ut)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function dn(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function A_(n,i,a){var c=i.pendingProps;switch(kc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return dn(i),null;case 1:return Mn(i.type)&&wo(),dn(i),null;case 3:return c=i.stateNode,Es(),Pt(Sn),Pt(cn),Zc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Ro(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Jn!==null&&(Cu(Jn),Jn=null))),gu(n,i),dn(i),null;case 5:Yc(i);var h=Dr(Na.current);if(a=i.type,n!==null&&i.stateNode!=null)qh(n,i,a,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return dn(i),null}if(n=Dr(ui.current),Ro(i)){c=i.stateNode,a=i.type;var v=i.memoizedProps;switch(c[ci]=i,c[Ta]=v,n=(i.mode&1)!==0,a){case"dialog":Nt("cancel",c),Nt("close",c);break;case"iframe":case"object":case"embed":Nt("load",c);break;case"video":case"audio":for(h=0;h<Ma.length;h++)Nt(Ma[h],c);break;case"source":Nt("error",c);break;case"img":case"image":case"link":Nt("error",c),Nt("load",c);break;case"details":Nt("toggle",c);break;case"input":ut(c,v),Nt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!v.multiple},Nt("invalid",c);break;case"textarea":Me(c,v),Nt("invalid",c)}dt(a,v),h=null;for(var T in v)if(v.hasOwnProperty(T)){var U=v[T];T==="children"?typeof U=="string"?c.textContent!==U&&(v.suppressHydrationWarning!==!0&&So(c.textContent,U,n),h=["children",U]):typeof U=="number"&&c.textContent!==""+U&&(v.suppressHydrationWarning!==!0&&So(c.textContent,U,n),h=["children",""+U]):o.hasOwnProperty(T)&&U!=null&&T==="onScroll"&&Nt("scroll",c)}switch(a){case"input":ht(c),At(c,v,!0);break;case"textarea":ht(c),qe(c);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(c.onclick=Mo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Pe(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=T.createElement(a,{is:c.is}):(n=T.createElement(a),a==="select"&&(T=n,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):n=T.createElementNS(n,a),n[ci]=i,n[Ta]=c,$h(n,i,!1,!1),i.stateNode=n;e:{switch(T=st(a,c),a){case"dialog":Nt("cancel",n),Nt("close",n),h=c;break;case"iframe":case"object":case"embed":Nt("load",n),h=c;break;case"video":case"audio":for(h=0;h<Ma.length;h++)Nt(Ma[h],n);h=c;break;case"source":Nt("error",n),h=c;break;case"img":case"image":case"link":Nt("error",n),Nt("load",n),h=c;break;case"details":Nt("toggle",n),h=c;break;case"input":ut(n,c),h=Ke(n,c),Nt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=te({},c,{value:void 0}),Nt("invalid",n);break;case"textarea":Me(n,c),h=ve(n,c),Nt("invalid",n);break;default:h=c}dt(a,h),U=h;for(v in U)if(U.hasOwnProperty(v)){var H=U[v];v==="style"?Be(n,H):v==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,H!=null&&B(n,H)):v==="children"?typeof H=="string"?(a!=="textarea"||H!=="")&&J(n,H):typeof H=="number"&&J(n,""+H):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(o.hasOwnProperty(v)?H!=null&&v==="onScroll"&&Nt("scroll",n):H!=null&&R(n,v,H,T))}switch(a){case"input":ht(n),At(n,c,!1);break;case"textarea":ht(n),qe(n);break;case"option":c.value!=null&&n.setAttribute("value",""+ke(c.value));break;case"select":n.multiple=!!c.multiple,v=c.value,v!=null?ce(n,!!c.multiple,v,!1):c.defaultValue!=null&&ce(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=Mo)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return dn(i),null;case 6:if(n&&i.stateNode!=null)Yh(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Dr(Na.current),Dr(ui.current),Ro(i)){if(c=i.stateNode,a=i.memoizedProps,c[ci]=i,(v=c.nodeValue!==a)&&(n=Dn,n!==null))switch(n.tag){case 3:So(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&So(c.nodeValue,a,(n.mode&1)!==0)}v&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ci]=i,i.stateNode=c}return dn(i),null;case 13:if(Pt(It),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ut&&Un!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Qf(),xs(),i.flags|=98560,v=!1;else if(v=Ro(i),c!==null&&c.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=i.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[ci]=i}else xs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;dn(i),v=!1}else Jn!==null&&(Cu(Jn),Jn=null),v=!0;if(!v)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(It.current&1)!==0?$t===0&&($t=3):Nu())),i.updateQueue!==null&&(i.flags|=4),dn(i),null);case 4:return Es(),gu(n,i),n===null&&Ea(i.stateNode.containerInfo),dn(i),null;case 10:return Gc(i.type._context),dn(i),null;case 17:return Mn(i.type)&&wo(),dn(i),null;case 19:if(Pt(It),v=i.memoizedState,v===null)return dn(i),null;if(c=(i.flags&128)!==0,T=v.rendering,T===null)if(c)Ia(v,!1);else{if($t!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=Io(n),T!==null){for(i.flags|=128,Ia(v,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)v=a,n=c,v.flags&=14680066,T=v.alternate,T===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=T.childLanes,v.lanes=T.lanes,v.child=T.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=T.memoizedProps,v.memoizedState=T.memoizedState,v.updateQueue=T.updateQueue,v.type=T.type,n=T.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return bt(It,It.current&1|2),i.child}n=n.sibling}v.tail!==null&&Ve()>Cs&&(i.flags|=128,c=!0,Ia(v,!1),i.lanes=4194304)}else{if(!c)if(n=Io(T),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Ia(v,!0),v.tail===null&&v.tailMode==="hidden"&&!T.alternate&&!Ut)return dn(i),null}else 2*Ve()-v.renderingStartTime>Cs&&a!==1073741824&&(i.flags|=128,c=!0,Ia(v,!1),i.lanes=4194304);v.isBackwards?(T.sibling=i.child,i.child=T):(a=v.last,a!==null?a.sibling=T:i.child=T,v.last=T)}return v.tail!==null?(i=v.tail,v.rendering=i,v.tail=i.sibling,v.renderingStartTime=Ve(),i.sibling=null,a=It.current,bt(It,c?a&1|2:a&1),i):(dn(i),null);case 22:case 23:return Ru(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(In&1073741824)!==0&&(dn(i),i.subtreeFlags&6&&(i.flags|=8192)):dn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function C_(n,i){switch(kc(i),i.tag){case 1:return Mn(i.type)&&wo(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Es(),Pt(Sn),Pt(cn),Zc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Yc(i),null;case 13:if(Pt(It),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));xs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Pt(It),null;case 4:return Es(),null;case 10:return Gc(i.type._context),null;case 22:case 23:return Ru(),null;case 24:return null;default:return null}}var Go=!1,fn=!1,b_=typeof WeakSet=="function"?WeakSet:Set,ze=null;function Ts(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){Ot(n,i,c)}else a.current=null}function vu(n,i,a){try{a()}catch(c){Ot(n,i,c)}}var Kh=!1;function R_(n,i){if(Rc=co,n=bf(),Sc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var h=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{a.nodeType,v.nodeType}catch{a=null;break e}var T=0,U=-1,H=-1,se=0,Se=0,Ae=n,ye=null;t:for(;;){for(var Oe;Ae!==a||h!==0&&Ae.nodeType!==3||(U=T+h),Ae!==v||c!==0&&Ae.nodeType!==3||(H=T+c),Ae.nodeType===3&&(T+=Ae.nodeValue.length),(Oe=Ae.firstChild)!==null;)ye=Ae,Ae=Oe;for(;;){if(Ae===n)break t;if(ye===a&&++se===h&&(U=T),ye===v&&++Se===c&&(H=T),(Oe=Ae.nextSibling)!==null)break;Ae=ye,ye=Ae.parentNode}Ae=Oe}a=U===-1||H===-1?null:{start:U,end:H}}else a=null}a=a||{start:0,end:0}}else a=null;for(Nc={focusedElem:n,selectionRange:a},co=!1,ze=i;ze!==null;)if(i=ze,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,ze=n;else for(;ze!==null;){i=ze;try{var je=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(je!==null){var Ge=je.memoizedProps,zt=je.memoizedState,Z=i.stateNode,W=Z.getSnapshotBeforeUpdate(i.elementType===i.type?Ge:ei(i.type,Ge),zt);Z.__reactInternalSnapshotBeforeUpdate=W}break;case 3:var ee=i.stateNode.containerInfo;ee.nodeType===1?ee.textContent="":ee.nodeType===9&&ee.documentElement&&ee.removeChild(ee.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(be){Ot(i,i.return,be)}if(n=i.sibling,n!==null){n.return=i.return,ze=n;break}ze=i.return}return je=Kh,Kh=!1,je}function Fa(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var v=h.destroy;h.destroy=void 0,v!==void 0&&vu(i,a,v)}h=h.next}while(h!==c)}}function Wo(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function _u(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Zh(n){var i=n.alternate;i!==null&&(n.alternate=null,Zh(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[ci],delete i[Ta],delete i[Uc],delete i[d_],delete i[f_])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Qh(n){return n.tag===5||n.tag===3||n.tag===4}function Jh(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Qh(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function xu(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Mo));else if(c!==4&&(n=n.child,n!==null))for(xu(n,i,a),n=n.sibling;n!==null;)xu(n,i,a),n=n.sibling}function yu(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,a),n=n.sibling;n!==null;)yu(n,i,a),n=n.sibling}var an=null,ti=!1;function rr(n,i,a){for(a=a.child;a!==null;)ep(n,i,a),a=a.sibling}function ep(n,i,a){if(ln&&typeof ln.onCommitFiberUnmount=="function")try{ln.onCommitFiberUnmount(et,a)}catch{}switch(a.tag){case 5:fn||Ts(a,i);case 6:var c=an,h=ti;an=null,rr(n,i,a),an=c,ti=h,an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):an.removeChild(a.stateNode));break;case 18:an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?Dc(n.parentNode,a):n.nodeType===1&&Dc(n,a),pa(n)):Dc(an,a.stateNode));break;case 4:c=an,h=ti,an=a.stateNode.containerInfo,ti=!0,rr(n,i,a),an=c,ti=h;break;case 0:case 11:case 14:case 15:if(!fn&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var v=h,T=v.destroy;v=v.tag,T!==void 0&&((v&2)!==0||(v&4)!==0)&&vu(a,i,T),h=h.next}while(h!==c)}rr(n,i,a);break;case 1:if(!fn&&(Ts(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(U){Ot(a,i,U)}rr(n,i,a);break;case 21:rr(n,i,a);break;case 22:a.mode&1?(fn=(c=fn)||a.memoizedState!==null,rr(n,i,a),fn=c):rr(n,i,a);break;default:rr(n,i,a)}}function tp(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new b_),i.forEach(function(c){var h=k_.bind(null,n,c);a.has(c)||(a.add(c),c.then(h,h))})}}function ni(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var h=a[c];try{var v=n,T=i,U=T;e:for(;U!==null;){switch(U.tag){case 5:an=U.stateNode,ti=!1;break e;case 3:an=U.stateNode.containerInfo,ti=!0;break e;case 4:an=U.stateNode.containerInfo,ti=!0;break e}U=U.return}if(an===null)throw Error(t(160));ep(v,T,h),an=null,ti=!1;var H=h.alternate;H!==null&&(H.return=null),h.return=null}catch(se){Ot(h,i,se)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)np(i,n),i=i.sibling}function np(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(ni(i,n),fi(n),c&4){try{Fa(3,n,n.return),Wo(3,n)}catch(Ge){Ot(n,n.return,Ge)}try{Fa(5,n,n.return)}catch(Ge){Ot(n,n.return,Ge)}}break;case 1:ni(i,n),fi(n),c&512&&a!==null&&Ts(a,a.return);break;case 5:if(ni(i,n),fi(n),c&512&&a!==null&&Ts(a,a.return),n.flags&32){var h=n.stateNode;try{J(h,"")}catch(Ge){Ot(n,n.return,Ge)}}if(c&4&&(h=n.stateNode,h!=null)){var v=n.memoizedProps,T=a!==null?a.memoizedProps:v,U=n.type,H=n.updateQueue;if(n.updateQueue=null,H!==null)try{U==="input"&&v.type==="radio"&&v.name!=null&&rt(h,v),st(U,T);var se=st(U,v);for(T=0;T<H.length;T+=2){var Se=H[T],Ae=H[T+1];Se==="style"?Be(h,Ae):Se==="dangerouslySetInnerHTML"?B(h,Ae):Se==="children"?J(h,Ae):R(h,Se,Ae,se)}switch(U){case"input":at(h,v);break;case"textarea":we(h,v);break;case"select":var ye=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!v.multiple;var Oe=v.value;Oe!=null?ce(h,!!v.multiple,Oe,!1):ye!==!!v.multiple&&(v.defaultValue!=null?ce(h,!!v.multiple,v.defaultValue,!0):ce(h,!!v.multiple,v.multiple?[]:"",!1))}h[Ta]=v}catch(Ge){Ot(n,n.return,Ge)}}break;case 6:if(ni(i,n),fi(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,v=n.memoizedProps;try{h.nodeValue=v}catch(Ge){Ot(n,n.return,Ge)}}break;case 3:if(ni(i,n),fi(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{pa(i.containerInfo)}catch(Ge){Ot(n,n.return,Ge)}break;case 4:ni(i,n),fi(n);break;case 13:ni(i,n),fi(n),h=n.child,h.flags&8192&&(v=h.memoizedState!==null,h.stateNode.isHidden=v,!v||h.alternate!==null&&h.alternate.memoizedState!==null||(Eu=Ve())),c&4&&tp(n);break;case 22:if(Se=a!==null&&a.memoizedState!==null,n.mode&1?(fn=(se=fn)||Se,ni(i,n),fn=se):ni(i,n),fi(n),c&8192){if(se=n.memoizedState!==null,(n.stateNode.isHidden=se)&&!Se&&(n.mode&1)!==0)for(ze=n,Se=n.child;Se!==null;){for(Ae=ze=Se;ze!==null;){switch(ye=ze,Oe=ye.child,ye.tag){case 0:case 11:case 14:case 15:Fa(4,ye,ye.return);break;case 1:Ts(ye,ye.return);var je=ye.stateNode;if(typeof je.componentWillUnmount=="function"){c=ye,a=ye.return;try{i=c,je.props=i.memoizedProps,je.state=i.memoizedState,je.componentWillUnmount()}catch(Ge){Ot(c,a,Ge)}}break;case 5:Ts(ye,ye.return);break;case 22:if(ye.memoizedState!==null){sp(Ae);continue}}Oe!==null?(Oe.return=ye,ze=Oe):sp(Ae)}Se=Se.sibling}e:for(Se=null,Ae=n;;){if(Ae.tag===5){if(Se===null){Se=Ae;try{h=Ae.stateNode,se?(v=h.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(U=Ae.stateNode,H=Ae.memoizedProps.style,T=H!=null&&H.hasOwnProperty("display")?H.display:null,U.style.display=Ee("display",T))}catch(Ge){Ot(n,n.return,Ge)}}}else if(Ae.tag===6){if(Se===null)try{Ae.stateNode.nodeValue=se?"":Ae.memoizedProps}catch(Ge){Ot(n,n.return,Ge)}}else if((Ae.tag!==22&&Ae.tag!==23||Ae.memoizedState===null||Ae===n)&&Ae.child!==null){Ae.child.return=Ae,Ae=Ae.child;continue}if(Ae===n)break e;for(;Ae.sibling===null;){if(Ae.return===null||Ae.return===n)break e;Se===Ae&&(Se=null),Ae=Ae.return}Se===Ae&&(Se=null),Ae.sibling.return=Ae.return,Ae=Ae.sibling}}break;case 19:ni(i,n),fi(n),c&4&&tp(n);break;case 21:break;default:ni(i,n),fi(n)}}function fi(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(Qh(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(J(h,""),c.flags&=-33);var v=Jh(n);yu(n,v,h);break;case 3:case 4:var T=c.stateNode.containerInfo,U=Jh(n);xu(n,U,T);break;default:throw Error(t(161))}}catch(H){Ot(n,n.return,H)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function N_(n,i,a){ze=n,ip(n)}function ip(n,i,a){for(var c=(n.mode&1)!==0;ze!==null;){var h=ze,v=h.child;if(h.tag===22&&c){var T=h.memoizedState!==null||Go;if(!T){var U=h.alternate,H=U!==null&&U.memoizedState!==null||fn;U=Go;var se=fn;if(Go=T,(fn=H)&&!se)for(ze=h;ze!==null;)T=ze,H=T.child,T.tag===22&&T.memoizedState!==null?ap(h):H!==null?(H.return=T,ze=H):ap(h);for(;v!==null;)ze=v,ip(v),v=v.sibling;ze=h,Go=U,fn=se}rp(n)}else(h.subtreeFlags&8772)!==0&&v!==null?(v.return=h,ze=v):rp(n)}}function rp(n){for(;ze!==null;){var i=ze;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:fn||Wo(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!fn)if(a===null)c.componentDidMount();else{var h=i.elementType===i.type?a.memoizedProps:ei(i.type,a.memoizedProps);c.componentDidUpdate(h,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var v=i.updateQueue;v!==null&&sh(i,v,c);break;case 3:var T=i.updateQueue;if(T!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}sh(i,T,a)}break;case 5:var U=i.stateNode;if(a===null&&i.flags&4){a=U;var H=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":H.autoFocus&&a.focus();break;case"img":H.src&&(a.src=H.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var se=i.alternate;if(se!==null){var Se=se.memoizedState;if(Se!==null){var Ae=Se.dehydrated;Ae!==null&&pa(Ae)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}fn||i.flags&512&&_u(i)}catch(ye){Ot(i,i.return,ye)}}if(i===n){ze=null;break}if(a=i.sibling,a!==null){a.return=i.return,ze=a;break}ze=i.return}}function sp(n){for(;ze!==null;){var i=ze;if(i===n){ze=null;break}var a=i.sibling;if(a!==null){a.return=i.return,ze=a;break}ze=i.return}}function ap(n){for(;ze!==null;){var i=ze;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{Wo(4,i)}catch(H){Ot(i,a,H)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(H){Ot(i,h,H)}}var v=i.return;try{_u(i)}catch(H){Ot(i,v,H)}break;case 5:var T=i.return;try{_u(i)}catch(H){Ot(i,T,H)}}}catch(H){Ot(i,i.return,H)}if(i===n){ze=null;break}var U=i.sibling;if(U!==null){U.return=i.return,ze=U;break}ze=i.return}}var P_=Math.ceil,Xo=D.ReactCurrentDispatcher,Su=D.ReactCurrentOwner,Wn=D.ReactCurrentBatchConfig,vt=0,en=null,Ht=null,on=0,In=0,As=Ji(0),$t=0,Oa=null,Ir=0,$o=0,Mu=0,ka=null,wn=null,Eu=0,Cs=1/0,Pi=null,qo=!1,wu=null,sr=null,Yo=!1,ar=null,Ko=0,za=0,Tu=null,Zo=-1,Qo=0;function _n(){return(vt&6)!==0?Ve():Zo!==-1?Zo:Zo=Ve()}function or(n){return(n.mode&1)===0?1:(vt&2)!==0&&on!==0?on&-on:p_.transition!==null?(Qo===0&&(Qo=Qd()),Qo):(n=Et,n!==0||(n=window.event,n=n===void 0?16:lf(n.type)),n)}function ii(n,i,a,c){if(50<za)throw za=0,Tu=null,Error(t(185));ca(n,a,c),((vt&2)===0||n!==en)&&(n===en&&((vt&2)===0&&($o|=a),$t===4&&lr(n,on)),Tn(n,c),a===1&&vt===0&&(i.mode&1)===0&&(Cs=Ve()+500,Ao&&tr()))}function Tn(n,i){var a=n.callbackNode;sc(n,i);var c=sn(n,n===en?on:0);if(c===0)a!==null&&$e(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&$e(a),i===1)n.tag===0?h_(lp.bind(null,n)):$f(lp.bind(null,n)),c_(function(){(vt&6)===0&&tr()}),a=null;else{switch(Jd(c)){case 1:a=Dt;break;case 4:a=Gt;break;case 16:a=Qt;break;case 536870912:a=gt;break;default:a=Qt}a=gp(a,op.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function op(n,i){if(Zo=-1,Qo=0,(vt&6)!==0)throw Error(t(327));var a=n.callbackNode;if(bs()&&n.callbackNode!==a)return null;var c=sn(n,n===en?on:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=Jo(n,c);else{i=c;var h=vt;vt|=2;var v=up();(en!==n||on!==i)&&(Pi=null,Cs=Ve()+500,Or(n,i));do try{U_();break}catch(U){cp(n,U)}while(!0);Vc(),Xo.current=v,vt=h,Ht!==null?i=0:(en=null,on=0,i=$t)}if(i!==0){if(i===2&&(h=as(n),h!==0&&(c=h,i=Au(n,h))),i===1)throw a=Oa,Or(n,0),lr(n,c),Tn(n,Ve()),a;if(i===6)lr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!L_(h)&&(i=Jo(n,c),i===2&&(v=as(n),v!==0&&(c=v,i=Au(n,v))),i===1))throw a=Oa,Or(n,0),lr(n,c),Tn(n,Ve()),a;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:kr(n,wn,Pi);break;case 3:if(lr(n,c),(c&130023424)===c&&(i=Eu+500-Ve(),10<i)){if(sn(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){_n(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Lc(kr.bind(null,n,wn,Pi),i);break}kr(n,wn,Pi);break;case 4:if(lr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var T=31-Wt(c);v=1<<T,T=i[T],T>h&&(h=T),c&=~v}if(c=h,c=Ve()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*P_(c/1960))-c,10<c){n.timeoutHandle=Lc(kr.bind(null,n,wn,Pi),c);break}kr(n,wn,Pi);break;case 5:kr(n,wn,Pi);break;default:throw Error(t(329))}}}return Tn(n,Ve()),n.callbackNode===a?op.bind(null,n):null}function Au(n,i){var a=ka;return n.current.memoizedState.isDehydrated&&(Or(n,i).flags|=256),n=Jo(n,i),n!==2&&(i=wn,wn=a,i!==null&&Cu(i)),n}function Cu(n){wn===null?wn=n:wn.push.apply(wn,n)}function L_(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var h=a[c],v=h.getSnapshot;h=h.value;try{if(!Qn(v(),h))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function lr(n,i){for(i&=~Mu,i&=~$o,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Wt(i),c=1<<a;n[a]=-1,i&=~c}}function lp(n){if((vt&6)!==0)throw Error(t(327));bs();var i=sn(n,0);if((i&1)===0)return Tn(n,Ve()),null;var a=Jo(n,i);if(n.tag!==0&&a===2){var c=as(n);c!==0&&(i=c,a=Au(n,c))}if(a===1)throw a=Oa,Or(n,0),lr(n,i),Tn(n,Ve()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,kr(n,wn,Pi),Tn(n,Ve()),null}function bu(n,i){var a=vt;vt|=1;try{return n(i)}finally{vt=a,vt===0&&(Cs=Ve()+500,Ao&&tr())}}function Fr(n){ar!==null&&ar.tag===0&&(vt&6)===0&&bs();var i=vt;vt|=1;var a=Wn.transition,c=Et;try{if(Wn.transition=null,Et=1,n)return n()}finally{Et=c,Wn.transition=a,vt=i,(vt&6)===0&&tr()}}function Ru(){In=As.current,Pt(As)}function Or(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,l_(a)),Ht!==null)for(a=Ht.return;a!==null;){var c=a;switch(kc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&wo();break;case 3:Es(),Pt(Sn),Pt(cn),Zc();break;case 5:Yc(c);break;case 4:Es();break;case 13:Pt(It);break;case 19:Pt(It);break;case 10:Gc(c.type._context);break;case 22:case 23:Ru()}a=a.return}if(en=n,Ht=n=cr(n.current,null),on=In=i,$t=0,Oa=null,Mu=$o=Ir=0,wn=ka=null,Lr!==null){for(i=0;i<Lr.length;i++)if(a=Lr[i],c=a.interleaved,c!==null){a.interleaved=null;var h=c.next,v=a.pending;if(v!==null){var T=v.next;v.next=h,c.next=T}a.pending=c}Lr=null}return n}function cp(n,i){do{var a=Ht;try{if(Vc(),Fo.current=Bo,Oo){for(var c=Ft.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}Oo=!1}if(Ur=0,Jt=Xt=Ft=null,Pa=!1,La=0,Su.current=null,a===null||a.return===null){$t=1,Oa=i,Ht=null;break}e:{var v=n,T=a.return,U=a,H=i;if(i=on,U.flags|=32768,H!==null&&typeof H=="object"&&typeof H.then=="function"){var se=H,Se=U,Ae=Se.tag;if((Se.mode&1)===0&&(Ae===0||Ae===11||Ae===15)){var ye=Se.alternate;ye?(Se.updateQueue=ye.updateQueue,Se.memoizedState=ye.memoizedState,Se.lanes=ye.lanes):(Se.updateQueue=null,Se.memoizedState=null)}var Oe=Uh(T);if(Oe!==null){Oe.flags&=-257,Ih(Oe,T,U,v,i),Oe.mode&1&&Dh(v,se,i),i=Oe,H=se;var je=i.updateQueue;if(je===null){var Ge=new Set;Ge.add(H),i.updateQueue=Ge}else je.add(H);break e}else{if((i&1)===0){Dh(v,se,i),Nu();break e}H=Error(t(426))}}else if(Ut&&U.mode&1){var zt=Uh(T);if(zt!==null){(zt.flags&65536)===0&&(zt.flags|=256),Ih(zt,T,U,v,i),Hc(ws(H,U));break e}}v=H=ws(H,U),$t!==4&&($t=2),ka===null?ka=[v]:ka.push(v),v=T;do{switch(v.tag){case 3:v.flags|=65536,i&=-i,v.lanes|=i;var Z=Ph(v,H,i);rh(v,Z);break e;case 1:U=H;var W=v.type,ee=v.stateNode;if((v.flags&128)===0&&(typeof W.getDerivedStateFromError=="function"||ee!==null&&typeof ee.componentDidCatch=="function"&&(sr===null||!sr.has(ee)))){v.flags|=65536,i&=-i,v.lanes|=i;var be=Lh(v,U,i);rh(v,be);break e}}v=v.return}while(v!==null)}fp(a)}catch(Xe){i=Xe,Ht===a&&a!==null&&(Ht=a=a.return);continue}break}while(!0)}function up(){var n=Xo.current;return Xo.current=Bo,n===null?Bo:n}function Nu(){($t===0||$t===3||$t===2)&&($t=4),en===null||(Ir&268435455)===0&&($o&268435455)===0||lr(en,on)}function Jo(n,i){var a=vt;vt|=2;var c=up();(en!==n||on!==i)&&(Pi=null,Or(n,i));do try{D_();break}catch(h){cp(n,h)}while(!0);if(Vc(),vt=a,Xo.current=c,Ht!==null)throw Error(t(261));return en=null,on=0,$t}function D_(){for(;Ht!==null;)dp(Ht)}function U_(){for(;Ht!==null&&!Je();)dp(Ht)}function dp(n){var i=mp(n.alternate,n,In);n.memoizedProps=n.pendingProps,i===null?fp(n):Ht=i,Su.current=null}function fp(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=A_(a,i,In),a!==null){Ht=a;return}}else{if(a=C_(a,i),a!==null){a.flags&=32767,Ht=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{$t=6,Ht=null;return}}if(i=i.sibling,i!==null){Ht=i;return}Ht=i=n}while(i!==null);$t===0&&($t=5)}function kr(n,i,a){var c=Et,h=Wn.transition;try{Wn.transition=null,Et=1,I_(n,i,a,c)}finally{Wn.transition=h,Et=c}return null}function I_(n,i,a,c){do bs();while(ar!==null);if((vt&6)!==0)throw Error(t(327));a=n.finishedWork;var h=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=a.lanes|a.childLanes;if(mv(n,v),n===en&&(Ht=en=null,on=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Yo||(Yo=!0,gp(Qt,function(){return bs(),null})),v=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||v){v=Wn.transition,Wn.transition=null;var T=Et;Et=1;var U=vt;vt|=4,Su.current=null,R_(n,a),np(a,n),t_(Nc),co=!!Rc,Nc=Rc=null,n.current=a,N_(a),it(),vt=U,Et=T,Wn.transition=v}else n.current=a;if(Yo&&(Yo=!1,ar=n,Ko=h),v=n.pendingLanes,v===0&&(sr=null),Ct(a.stateNode),Tn(n,Ve()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)h=i[a],c(h.value,{componentStack:h.stack,digest:h.digest});if(qo)throw qo=!1,n=wu,wu=null,n;return(Ko&1)!==0&&n.tag!==0&&bs(),v=n.pendingLanes,(v&1)!==0?n===Tu?za++:(za=0,Tu=n):za=0,tr(),null}function bs(){if(ar!==null){var n=Jd(Ko),i=Wn.transition,a=Et;try{if(Wn.transition=null,Et=16>n?16:n,ar===null)var c=!1;else{if(n=ar,ar=null,Ko=0,(vt&6)!==0)throw Error(t(331));var h=vt;for(vt|=4,ze=n.current;ze!==null;){var v=ze,T=v.child;if((ze.flags&16)!==0){var U=v.deletions;if(U!==null){for(var H=0;H<U.length;H++){var se=U[H];for(ze=se;ze!==null;){var Se=ze;switch(Se.tag){case 0:case 11:case 15:Fa(8,Se,v)}var Ae=Se.child;if(Ae!==null)Ae.return=Se,ze=Ae;else for(;ze!==null;){Se=ze;var ye=Se.sibling,Oe=Se.return;if(Zh(Se),Se===se){ze=null;break}if(ye!==null){ye.return=Oe,ze=ye;break}ze=Oe}}}var je=v.alternate;if(je!==null){var Ge=je.child;if(Ge!==null){je.child=null;do{var zt=Ge.sibling;Ge.sibling=null,Ge=zt}while(Ge!==null)}}ze=v}}if((v.subtreeFlags&2064)!==0&&T!==null)T.return=v,ze=T;else e:for(;ze!==null;){if(v=ze,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:Fa(9,v,v.return)}var Z=v.sibling;if(Z!==null){Z.return=v.return,ze=Z;break e}ze=v.return}}var W=n.current;for(ze=W;ze!==null;){T=ze;var ee=T.child;if((T.subtreeFlags&2064)!==0&&ee!==null)ee.return=T,ze=ee;else e:for(T=W;ze!==null;){if(U=ze,(U.flags&2048)!==0)try{switch(U.tag){case 0:case 11:case 15:Wo(9,U)}}catch(Xe){Ot(U,U.return,Xe)}if(U===T){ze=null;break e}var be=U.sibling;if(be!==null){be.return=U.return,ze=be;break e}ze=U.return}}if(vt=h,tr(),ln&&typeof ln.onPostCommitFiberRoot=="function")try{ln.onPostCommitFiberRoot(et,n)}catch{}c=!0}return c}finally{Et=a,Wn.transition=i}}return!1}function hp(n,i,a){i=ws(a,i),i=Ph(n,i,1),n=ir(n,i,1),i=_n(),n!==null&&(ca(n,1,i),Tn(n,i))}function Ot(n,i,a){if(n.tag===3)hp(n,n,a);else for(;i!==null;){if(i.tag===3){hp(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(sr===null||!sr.has(c))){n=ws(a,n),n=Lh(i,n,1),i=ir(i,n,1),n=_n(),i!==null&&(ca(i,1,n),Tn(i,n));break}}i=i.return}}function F_(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=_n(),n.pingedLanes|=n.suspendedLanes&a,en===n&&(on&a)===a&&($t===4||$t===3&&(on&130023424)===on&&500>Ve()-Eu?Or(n,0):Mu|=a),Tn(n,i)}function pp(n,i){i===0&&((n.mode&1)===0?i=1:(i=Pn,Pn<<=1,(Pn&130023424)===0&&(Pn=4194304)));var a=_n();n=bi(n,i),n!==null&&(ca(n,i,a),Tn(n,a))}function O_(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),pp(n,a)}function k_(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(a=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),pp(n,a)}var mp;mp=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Sn.current)En=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return En=!1,T_(n,i,a);En=(n.flags&131072)!==0}else En=!1,Ut&&(i.flags&1048576)!==0&&qf(i,bo,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Vo(n,i),n=i.pendingProps;var h=gs(i,cn.current);Ms(i,a),h=eu(null,i,c,n,h,a);var v=tu();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Mn(c)?(v=!0,To(i)):v=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,$c(i),h.updater=Ho,i.stateNode=h,h._reactInternals=i,ou(i,c,n,a),i=du(null,i,c,!0,v,a)):(i.tag=0,Ut&&v&&Oc(i),vn(null,i,h,a),i=i.child),i;case 16:c=i.elementType;e:{switch(Vo(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=B_(c),n=ei(c,n),h){case 0:i=uu(null,i,c,n,a);break e;case 1:i=Hh(null,i,c,n,a);break e;case 11:i=Fh(null,i,c,n,a);break e;case 14:i=Oh(null,i,c,ei(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),uu(n,i,c,h,a);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Hh(n,i,c,h,a);case 3:e:{if(jh(i),n===null)throw Error(t(387));c=i.pendingProps,v=i.memoizedState,h=v.element,ih(n,i),Uo(i,c,null,a);var T=i.memoizedState;if(c=T.element,v.isDehydrated)if(v={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=v,i.memoizedState=v,i.flags&256){h=ws(Error(t(423)),i),i=Vh(n,i,c,a,h);break e}else if(c!==h){h=ws(Error(t(424)),i),i=Vh(n,i,c,a,h);break e}else for(Un=Qi(i.stateNode.containerInfo.firstChild),Dn=i,Ut=!0,Jn=null,a=th(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(xs(),c===h){i=Ni(n,i,a);break e}vn(n,i,c,a)}i=i.child}return i;case 5:return ah(i),n===null&&Bc(i),c=i.type,h=i.pendingProps,v=n!==null?n.memoizedProps:null,T=h.children,Pc(c,h)?T=null:v!==null&&Pc(c,v)&&(i.flags|=32),Bh(n,i),vn(n,i,T,a),i.child;case 6:return n===null&&Bc(i),null;case 13:return Gh(n,i,a);case 4:return qc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ys(i,null,c,a):vn(n,i,c,a),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Fh(n,i,c,h,a);case 7:return vn(n,i,i.pendingProps,a),i.child;case 8:return vn(n,i,i.pendingProps.children,a),i.child;case 12:return vn(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,v=i.memoizedProps,T=h.value,bt(Po,c._currentValue),c._currentValue=T,v!==null)if(Qn(v.value,T)){if(v.children===h.children&&!Sn.current){i=Ni(n,i,a);break e}}else for(v=i.child,v!==null&&(v.return=i);v!==null;){var U=v.dependencies;if(U!==null){T=v.child;for(var H=U.firstContext;H!==null;){if(H.context===c){if(v.tag===1){H=Ri(-1,a&-a),H.tag=2;var se=v.updateQueue;if(se!==null){se=se.shared;var Se=se.pending;Se===null?H.next=H:(H.next=Se.next,Se.next=H),se.pending=H}}v.lanes|=a,H=v.alternate,H!==null&&(H.lanes|=a),Wc(v.return,a,i),U.lanes|=a;break}H=H.next}}else if(v.tag===10)T=v.type===i.type?null:v.child;else if(v.tag===18){if(T=v.return,T===null)throw Error(t(341));T.lanes|=a,U=T.alternate,U!==null&&(U.lanes|=a),Wc(T,a,i),T=v.sibling}else T=v.child;if(T!==null)T.return=v;else for(T=v;T!==null;){if(T===i){T=null;break}if(v=T.sibling,v!==null){v.return=T.return,T=v;break}T=T.return}v=T}vn(n,i,h.children,a),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Ms(i,a),h=Vn(h),c=c(h),i.flags|=1,vn(n,i,c,a),i.child;case 14:return c=i.type,h=ei(c,i.pendingProps),h=ei(c.type,h),Oh(n,i,c,h,a);case 15:return kh(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Vo(n,i),i.tag=1,Mn(c)?(n=!0,To(i)):n=!1,Ms(i,a),Rh(i,c,h),ou(i,c,h,a),du(null,i,c,!0,n,a);case 19:return Xh(n,i,a);case 22:return zh(n,i,a)}throw Error(t(156,i.tag))};function gp(n,i){return We(n,i)}function z_(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xn(n,i,a,c){return new z_(n,i,a,c)}function Pu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function B_(n){if(typeof n=="function")return Pu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===G)return 11;if(n===Y)return 14}return 2}function cr(n,i){var a=n.alternate;return a===null?(a=Xn(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function el(n,i,a,c,h,v){var T=2;if(c=n,typeof n=="function")Pu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case L:return zr(a.children,h,v,i);case j:T=8,h|=8;break;case C:return n=Xn(12,a,i,h|2),n.elementType=C,n.lanes=v,n;case z:return n=Xn(13,a,i,h),n.elementType=z,n.lanes=v,n;case ne:return n=Xn(19,a,i,h),n.elementType=ne,n.lanes=v,n;case fe:return tl(a,h,v,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case A:T=10;break e;case V:T=9;break e;case G:T=11;break e;case Y:T=14;break e;case ue:T=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=Xn(T,a,i,h),i.elementType=n,i.type=c,i.lanes=v,i}function zr(n,i,a,c){return n=Xn(7,n,c,i),n.lanes=a,n}function tl(n,i,a,c){return n=Xn(22,n,c,i),n.elementType=fe,n.lanes=a,n.stateNode={isHidden:!1},n}function Lu(n,i,a){return n=Xn(6,n,null,i),n.lanes=a,n}function Du(n,i,a){return i=Xn(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function H_(n,i,a,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ac(0),this.expirationTimes=ac(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ac(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Uu(n,i,a,c,h,v,T,U,H){return n=new H_(n,i,a,U,H),i===1?(i=1,v===!0&&(i|=8)):i=0,v=Xn(3,null,null,i),n.current=v,v.stateNode=n,v.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},$c(v),n}function j_(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:I,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function vp(n){if(!n)return er;n=n._reactInternals;e:{if(P(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Mn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Mn(a))return Wf(n,a,i)}return i}function _p(n,i,a,c,h,v,T,U,H){return n=Uu(a,c,!0,n,h,v,T,U,H),n.context=vp(null),a=n.current,c=_n(),h=or(a),v=Ri(c,h),v.callback=i??null,ir(a,v,h),n.current.lanes=h,ca(n,h,c),Tn(n,c),n}function nl(n,i,a,c){var h=i.current,v=_n(),T=or(h);return a=vp(a),i.context===null?i.context=a:i.pendingContext=a,i=Ri(v,T),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ir(h,i,T),n!==null&&(ii(n,h,T,v),Do(n,h,T)),T}function il(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function xp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function Iu(n,i){xp(n,i),(n=n.alternate)&&xp(n,i)}function V_(){return null}var yp=typeof reportError=="function"?reportError:function(n){console.error(n)};function Fu(n){this._internalRoot=n}rl.prototype.render=Fu.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));nl(n,i,null,null)},rl.prototype.unmount=Fu.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Fr(function(){nl(null,n,null,null)}),i[wi]=null}};function rl(n){this._internalRoot=n}rl.prototype.unstable_scheduleHydration=function(n){if(n){var i=nf();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Yi.length&&i!==0&&i<Yi[a].priority;a++);Yi.splice(a,0,n),a===0&&af(n)}};function Ou(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function sl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Sp(){}function G_(n,i,a,c,h){if(h){if(typeof c=="function"){var v=c;c=function(){var se=il(T);v.call(se)}}var T=_p(i,c,n,0,null,!1,!1,"",Sp);return n._reactRootContainer=T,n[wi]=T.current,Ea(n.nodeType===8?n.parentNode:n),Fr(),T}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var U=c;c=function(){var se=il(H);U.call(se)}}var H=Uu(n,0,!1,null,null,!1,!1,"",Sp);return n._reactRootContainer=H,n[wi]=H.current,Ea(n.nodeType===8?n.parentNode:n),Fr(function(){nl(i,H,a,c)}),H}function al(n,i,a,c,h){var v=a._reactRootContainer;if(v){var T=v;if(typeof h=="function"){var U=h;h=function(){var H=il(T);U.call(H)}}nl(i,T,n,h)}else T=G_(a,i,n,h,c);return il(T)}ef=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ei(i.pendingLanes);a!==0&&(oc(i,a|1),Tn(i,Ve()),(vt&6)===0&&(Cs=Ve()+500,tr()))}break;case 13:Fr(function(){var c=bi(n,1);if(c!==null){var h=_n();ii(c,n,1,h)}}),Iu(n,1)}},lc=function(n){if(n.tag===13){var i=bi(n,134217728);if(i!==null){var a=_n();ii(i,n,134217728,a)}Iu(n,134217728)}},tf=function(n){if(n.tag===13){var i=or(n),a=bi(n,i);if(a!==null){var c=_n();ii(a,n,i,c)}Iu(n,i)}},nf=function(){return Et},rf=function(n,i){var a=Et;try{return Et=n,i()}finally{Et=a}},me=function(n,i,a){switch(i){case"input":if(at(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var h=Eo(c);if(!h)throw Error(t(90));Ye(c),at(c,h)}}}break;case"textarea":we(n,a);break;case"select":i=a.value,i!=null&&ce(n,!!a.multiple,i,!1)}},Vt=bu,yt=Fr;var W_={usingClientEntryPoint:!1,Events:[Aa,ps,Eo,wt,Rt,bu]},Ba={findFiberByHostInstance:br,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},X_={bundleType:Ba.bundleType,version:Ba.version,rendererPackageName:Ba.rendererPackageName,rendererConfig:Ba.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:D.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=ie(n),n===null?null:n.stateNode},findFiberByHostInstance:Ba.findFiberByHostInstance||V_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ol=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ol.isDisabled&&ol.supportsFiber)try{et=ol.inject(X_),ln=ol}catch{}}return An.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W_,An.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ou(i))throw Error(t(200));return j_(n,i,null,a)},An.createRoot=function(n,i){if(!Ou(n))throw Error(t(299));var a=!1,c="",h=yp;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Uu(n,1,!1,null,null,a,!1,c,h),n[wi]=i.current,Ea(n.nodeType===8?n.parentNode:n),new Fu(i)},An.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=ie(i),n=n===null?null:n.stateNode,n},An.flushSync=function(n){return Fr(n)},An.hydrate=function(n,i,a){if(!sl(i))throw Error(t(200));return al(null,n,i,!0,a)},An.hydrateRoot=function(n,i,a){if(!Ou(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,h=!1,v="",T=yp;if(a!=null&&(a.unstable_strictMode===!0&&(h=!0),a.identifierPrefix!==void 0&&(v=a.identifierPrefix),a.onRecoverableError!==void 0&&(T=a.onRecoverableError)),i=_p(i,null,n,1,a??null,h,!1,v,T),n[wi]=i.current,Ea(n),c)for(n=0;n<c.length;n++)a=c[n],h=a._getVersion,h=h(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,h]:i.mutableSourceEagerHydrationData.push(a,h);return new rl(i)},An.render=function(n,i,a){if(!sl(i))throw Error(t(200));return al(null,n,i,!1,a)},An.unmountComponentAtNode=function(n){if(!sl(n))throw Error(t(40));return n._reactRootContainer?(Fr(function(){al(null,null,n,!1,function(){n._reactRootContainer=null,n[wi]=null})}),!0):!1},An.unstable_batchedUpdates=bu,An.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!sl(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return al(n,i,a,!1,c)},An.version="18.3.1-next-f1338f8080-20240426",An}var Rp;function rx(){if(Rp)return Bu.exports;Rp=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Bu.exports=ix(),Bu.exports}var Np;function sx(){if(Np)return ll;Np=1;var r=rx();return ll.createRoot=r.createRoot,ll.hydrateRoot=r.hydrateRoot,ll}var ax=sx();const ql="/api/3dprint";class ox extends Error{constructor(t,s,o){super(t);Ha(this,"status");Ha(this,"code");Ha(this,"date");Ha(this,"reservations");this.status=s,this.code=o==null?void 0:o.code,this.date=o==null?void 0:o.date,this.reservations=o==null?void 0:o.reservations}}async function xt(r,e){const t=await fetch(`${ql}/${r}`,{credentials:"include",...e,headers:{"Content-Type":"application/json",...e==null?void 0:e.headers}}),s=await t.json().catch(()=>({}));if(!t.ok)throw new ox(s.error||`HTTP ${t.status}`,t.status,s);return s}async function lx(){const r=await fetch("/api/apps/3dprint-management/access",{credentials:"include"});return r.status===401?"login":r.status===403?"denied":r.ok?"ok":"denied"}function gg(r){return{id:r.id,date:r.date,machine:r.machine,kind:r.kind,start:r.start,end:r.end,title:r.title,file:r.file,fileSize:r.file_size,note:r.note,who:r.who,status:r.status,createdAt:r.created_at,adminNote:r.status_comment??void 0,printer_id:r.printer_id}}async function cx(r,e){return{applications:(await xt(`admin/calendar/cancelled-applications?from=${r}&to=${e}`)).applications.map(s=>gg(s))}}async function ux(r){return xt(`admin/reservations/${r}/restore`,{method:"POST",body:"{}"})}async function dx(r,e){const t=await xt(`calendar/applications?from=${r}&to=${e}`);return{applications:t.applications.map(s=>gg(s)),staff_dates:t.staff_dates??{}}}async function fx(){return(await xt("admin/members")).members.map(e=>({id:e.id,name:e.name,homeroom:e.homeroom,student_number:e.student_number,color_index:e.color_index,discord_user_id:e.discord_user_id,user_id:e.user_id??null}))}async function Pp(){return xt("admin/session")}async function hx(){return(await xt("admin/management-users")).users}async function px(r,e){return xt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({user_id:e})})}async function mx(r){return xt("admin/members",{method:"POST",body:JSON.stringify(r)})}async function gx(r){return xt(`admin/members/${r}`,{method:"DELETE"})}function cl(r){return`${r.member_id}\0${r.date}`}function ul(r){return`${r.printer_id}\0${r.date}`}function Lp(r){const e=new Map;for(const t of r){const s=e.get(t.member_id)??[];s.push(t.date),e.set(t.member_id,s)}return e}function Dp(r){const e=new Map;for(const t of r){const s=e.get(t.printer_id)??[];s.push(t.date),e.set(t.printer_id,s)}return e}function vg(r,e){const t=new Set(r.map(cl)),s=new Set(e.map(cl)),o=e.filter(u=>!t.has(cl(u))),l=r.filter(u=>!s.has(cl(u)));return{added:o,removed:l}}function _g(r,e){const t=new Set(r.map(ul)),s=new Set(e.map(ul)),o=e.filter(u=>!t.has(ul(u))),l=r.filter(u=>!s.has(ul(u)));return{added:o,removed:l}}function vx(r,e,t,s){const o=vg(r,e),l=_g(t,s);return o.added.length+o.removed.length+l.added.length+l.removed.length>0}async function _x(r,e,t,s){const o=vg(r,e),l=_g(t,s);for(const[u,d]of Lp(o.removed))await Ip(u,d,!1);for(const[u,d]of Dp(l.removed))await Fp(u,d,!1);for(const[u,d]of Lp(o.added))await Ip(u,d,!0);for(const[u,d]of Dp(l.added))await Fp(u,d,!0)}async function Up(r,e){return xt(`admin/shifts?year=${r}&month=${e}`)}async function Ip(r,e,t){return xt("admin/shifts/availability",{method:"PUT",body:JSON.stringify({member_id:r,dates:e,available:t})})}async function xx(r,e){return xt(`admin/reservations/${r}/accept`,{method:"POST",body:JSON.stringify({print_staff_member_id:e})})}async function wd(r,e){return xt(`admin/reservations/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function yx(){return xt("admin/calendar/status")}function Sx(r){return`${ql}/admin/stl/${r}`}async function Mx(){return(await xt("admin/reservations")).reservations}async function Ex(){return xt("admin/printers")}async function kd(r,e,t="POST"){const s=await fetch(`${ql}/${r}`,{method:t,credentials:"include",body:e}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error||`HTTP ${s.status}`);return o}async function wx(r,e){const t=new FormData;return t.append("name",r),e&&t.append("image",e),kd("admin/printers",t)}async function Tx(r,e){return xt(`admin/printers/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Ax(r,e){const t=new FormData;return t.append("image",e),kd(`admin/printers/${r}/image`,t,"PUT")}async function Cx(r){return xt(`admin/printers/${r}`,{method:"DELETE"})}async function Fp(r,e,t){return xt("admin/shifts/printer-availability",{method:"PUT",body:JSON.stringify({printer_id:r,dates:e,available:t})})}async function bx(r,e,t=!1){return xt(`admin/reservations/${r}/reschedule`,{method:"PATCH",body:JSON.stringify({desired_date:e,force:t})})}async function Rx(r,e){return xt(`admin/applications/${r}/split-slots`,{method:"POST",body:JSON.stringify(e)})}async function Nx(){return xt("admin/integrations/status")}async function Px(){return xt("admin/integrations/discord/test",{method:"POST",body:"{}"})}async function Lx(r){const e=r.map(t=>t.trim()).filter(Boolean);if(!e.length)throw new Error("メンションする担当者を1人以上選んでください");return xt("admin/integrations/discord/test-mention",{method:"POST",body:JSON.stringify({member_ids:e})})}async function Dx(r){const e=r.trim();if(!e)throw new Error("送信先メールアドレスを入力してください");return xt("admin/settings/test-email",{method:"POST",body:JSON.stringify({to:e})})}async function Ux(r){return xt("admin/log",{method:"POST",body:JSON.stringify(r)})}async function Ix(r=100){return xt(`admin/log?limit=${r}`)}async function Fx(r){return xt(`admin/settings/storage-list?path=${encodeURIComponent(r)}`)}async function Ox(r,e){return xt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({color_index:e})})}async function kx(r,e){return xt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({discord_user_id:e})})}async function zx(){return xt("admin/settings/print-video")}async function Bx(r){return xt("admin/settings/print-video",{method:"PATCH",body:JSON.stringify({storage_path:r})})}async function Hx(r,e){const t=new FormData;return t.append("video",e),kd(`admin/reservations/${r}/print-video`,t)}async function jx(r){return xt(`admin/reservations/${r}/print-video`,{method:"DELETE"})}function Vx(r){return`${ql}/admin/reservations/${r}/print-video/download`}const xg=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC"}],Za=xg.map(r=>r.id),xi={};xg.forEach(r=>{xi[r.id]=r});const wr=["日","月","火","水","木","金","土"],zd=360,Zs=30,Op=28,yg=990,Gx=1200,kp=(yg-zd)/Zs,Wx=7,Qs={pending:"申請中",approved:"確定",done:"完了",cancelled:"取り消し"},yi={request:"依頼",reserve:"予約"},zp=[{id:"machine",label:"機材の不調",body:"プリンターの不調により、この時間帯の印刷を中止しました。"},{id:"maintenance",label:"メンテナンス",body:"メンテナンスのため、この時間帯の受付を停止しました。"},{id:"duplicate",label:"重複申請",body:"同じ時間帯に別の申請が確定しているため、こちらを取り消しました。"},{id:"no_show",label:"連絡なしの未実施",body:"開始時刻を過ぎても実施が確認できなかったため取り消しました。"}],Bp=[{id:"stl",label:"STLの不備",body:"STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。"},{id:"size",label:"サイズ超過",body:"造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。"},{id:"deadline",label:"締切超過",body:"印刷依頼の受付は前日までです。当日の依頼は受け付けられません。"},{id:"time",label:"時間不足",body:"この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。"}],Xx=["16:20までに物理実験室へ来てください。","フィラメントは白PLAを使用します。","サポート材を付けています。剥がす作業もお願いします。"],kn=r=>String(r).padStart(2,"0"),Yn=r=>r.getFullYear()+"-"+kn(r.getMonth()+1)+"-"+kn(r.getDate()),zn=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},kl=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},zl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},Sg=r=>kl(zl(r),-r.getDay()),Hp=r=>r.getMonth()+1+"/"+r.getDate(),li=Yn(zl(new Date)),$x=()=>zn(li),Td=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()},Mg=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()+"（"+wr[e.getDay()]+"）"},Qa=r=>zd+r*Zs,qt=r=>kn(Math.floor(r/60))+":"+kn(r%60),Yl=r=>{const e=Math.floor(r/60),t=r%60;return e&&t?e+"時間"+t+"分":e?e+"時間":t+"分"},jp=r=>Math.round((r-zd)/Zs),mn=r=>r.kind==="request"?{start:yg,end:Gx,s:kp,e:kp+Wx}:{start:r.start,end:r.end,s:jp(r.start),e:jp(r.end)},Vp=(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+"0"+t);return r})(),Hi=r=>r?String(r).slice(0,1)+"年"+String(r).slice(1)+"HR":"—",Kr=["#f38020","#3b74e0","#1f9d55","#9a4a07","#7c5cbf","#b4776b","#2f8f8f"],Eg=[{id:"m1",name:"金田",hr:"203",num:12,discord:"",color:"#f38020"},{id:"m2",name:"田村",hr:"201",num:3,discord:"",color:"#3b74e0"},{id:"m3",name:"藤原",hr:"104",num:21,discord:"",color:"#1f9d55"}];let Kl=Eg.slice();const qx=r=>{Kl=(r&&r.length?r:Eg).slice()},Yx=()=>Kl,Jr=r=>Kl.find(e=>e.id===r)||null,Bd=r=>{const e=Jr(r);return e?e.name:null},Kx=r=>{const e=Jr(r);return e?e.color:"var(--color-text-faint)"},Zx=r=>{const e=Jr(r);return e?`${e.name}（${Hi(e.hr)}・${e.num}番）`:"—"};let wg={};const dl=r=>{wg=r||{}},qa=(r,e)=>(wg[r]||[]).indexOf(e)>=0,eo=r=>Kl.filter(e=>qa(e.id,r)).map(e=>e.id),Tg=r=>eo(r).map(e=>Bd(e)),Qx=r=>r.filter(e=>e.status==="pending").sort((e,t)=>(e.date+kn(Math.floor(mn(e).start/60))).localeCompare(t.date+kn(Math.floor(mn(t).start/60)))),Jx=r=>r.kind==="request"&&r.date<=li,e0=r=>r==="pending"||r==="approved";function t0(r,e){const t=r.filter(o=>o.date===e),s={};return Za.forEach(o=>{const l=new Array(Op).fill(null);t.filter(u=>u.machine===o&&e0(u.status)).forEach(u=>{const d=mn(u);for(let m=Math.max(0,d.s);m<Math.min(Op,d.e);m++)l[m]=u}),s[o]=l}),{list:t,machines:s}}function Ag(r,e){const t=r.filter(o=>o.date===e),s=t.filter(o=>o.status!=="cancelled");return{all:t,live:s,requests:s.filter(o=>o.kind==="request"),reserves:s.filter(o=>o.kind==="reserve"),pending:s.filter(o=>o.status==="pending").length,cancelled:t.filter(o=>o.status==="cancelled")}}function Cg(r,e,t,s){const o=mn(e),l=t0(r,t),u=l.machines[e.machine];let d=0;for(let g=o.s;g<o.e;g++){const y=u[g];y&&y.id!==e.id&&d++}const m=o.e-o.s,p=eo(t);return{date:t,total:m,used:d,free:m-d,full:d>=m,staffs:p,noStaff:p.length===0,past:t<li,sameDay:t===e.date,liveCount:l.list.filter(g=>g.status!=="cancelled").length}}function n0(r,e){const s=new Date(r,e-1,1).getDay(),o=new Date(r,e,0).getDate(),l=[];for(let u=0;u<s;u++)l.push(null);for(let u=1;u<=o;u++)l.push(new Date(r,e-1,u));for(;l.length%7!==0;)l.push(null);return l}function Hd(r){const e=mn(r),t=[];for(let s=e.s;s<e.e;s++)t.push(s);return t}function jd(r,e){try{const t=localStorage.getItem(r);return t?JSON.parse(t):e}catch{return e}}function Vd(r,e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}const ia={prefs:"sh3dm.prefs.v1",log:"sh3dm.log.v1",integ:"sh3dm.integrations.v1"},bg=()=>jd(ia.prefs,{}),i0=r=>Vd(ia.prefs,Object.assign(bg(),r)),r0=()=>jd(ia.log,[]),s0=r=>Vd(ia.log,r),fl={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,cancelled:!0},dailyMention:!0},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}},a0=()=>{const r=jd(ia.integ,null);return r?{discord:{...fl.discord,...r.discord||{},events:{...fl.discord.events,...(r.discord||{}).events||{}}},gcal:{...fl.gcal,...r.gcal||{}}}:JSON.parse(JSON.stringify(fl))},o0=r=>Vd(ia.integ,r),Rg=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE",hint:"小物・精度重視"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC",hint:"大型・タイムラプス"}];Rg.map(r=>r.id);const l0=Object.fromEntries(Rg.map(r=>[r.id,r])),Ng=["日","月","火","水","木","金","土"],Gd=360,Wd=30,Pg=990,Lg=1200,c0=(Pg-Gd)/Wd,u0=(Lg-Gd)/Wd,d0={pending:"申請中",approved:"確定",rejected:"却下",done:"完了"},f0={request:"依頼",reserve:"予約"},es=r=>String(r).padStart(2,"0"),Ad=r=>r.getFullYear()+"-"+es(r.getMonth()+1)+"-"+es(r.getDate()),ts=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},Dg=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},Bl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},h0=r=>Dg(Bl(r),-r.getDay()),Gp=r=>es(Math.floor(r/60))+":"+es(r%60),Wp=r=>Math.round((r-Gd)/Wd),p0=r=>r.kind==="request"?{start:Pg,end:Lg,s:c0,e:u0}:{start:r.start,end:r.end,s:Wp(r.start),e:Wp(r.end)};(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+es(t));return r})();const m0=Ad(Bl(new Date)),g0=()=>ts(m0),Ug=r=>{const e=ts(r);return e.getMonth()+1+"/"+e.getDate()},hl=r=>{const e=ts(r);return Ug(r)+"（"+Ng[e.getDay()]+"）"};function v0(r,e){var t;return e?((t=r.find(s=>s.id===e))==null?void 0:t.name)??null:null}function _0(r,e,t,s,o){const l=r.filter(p=>p.date>=e&&p.date<=t).sort((p,g)=>(p.date+String(p.start)).localeCompare(g.date+String(g.start))),u=["日付","曜日","開始","終了","機種","種別","作品名","申請者","学年HR","番号","状態","印刷データ","サイズ(MB)","備考","担当"],d=p=>{const g=String(p??"");return/[",\n]/.test(g)?'"'+g.replace(/"/g,'""')+'"':g},m=[u.join(",")];return l.forEach(p=>{const g=p0(p),y=ts(p.date),_=o[p.date];m.push([p.date,Ng[y.getDay()],Gp(g.start),Gp(g.end),l0[p.machine].name,f0[p.kind],p.title,p.who.name,p.who.hr,p.who.num,d0[p.status],p.file,p.fileSize?(p.fileSize/1048576).toFixed(2):"",p.note,_&&v0(s,_)||""].map(d).join(","))}),"\uFEFF"+m.join(`\r
`)}const x0={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,rejected:!0},mention:""},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}};function y0(r){return r.map(e=>({id:e.id,name:e.name,hr:e.homeroom??"",num:e.student_number??0,discord:e.discord_user_id??"",color:Kr[(e.color_index??0)%Kr.length],userId:e.user_id??null}))}function S0(r){const e=Kr.indexOf(r);return e>=0?e:0}function M0(r){return r==="rejected"?"cancelled":r}function E0(r){switch(r){case"pending":return"applied";case"approved":return"accepted";case"done":return"delivered";case"cancelled":return"cancelled";default:return"applied"}}function Xp(r){return{...r,status:M0(r.status)}}function w0(r){const e=Ad(h0(ts(r))),t=Ad(Dg(ts(e),27));return{from:e,to:t}}function Ig(r){const e={};for(const t of r)e[t.member_id]||(e[t.member_id]=[]),e[t.member_id].push(t.date);for(const t of Object.keys(e))e[t].sort();return e}function pl(r){const e=[];for(const[t,s]of Object.entries(r))for(const o of s)e.push({member_id:t,date:o});return e}function T0(r,e,t){const s=ts(r);return s.getFullYear()===e&&s.getMonth()+1===t}function A0(r,e,t,s){const o=Ig(e),l=new Set([...Object.keys(r),...Object.keys(o)]),u={};for(const d of l){const m=(r[d]||[]).filter(g=>!T0(g,t,s)),p=o[d]||[];u[d]=[...new Set([...m,...p])].sort()}return u}function C0(r,e){return e&&r.some(t=>t.id===e)?e:null}function b0(r){return r.linked_member?`${r.user.display_name}（印刷担当: ${r.linked_member.name}）`:r.user.display_name}function R0(){return JSON.parse(JSON.stringify(x0))}function N0(r,e,t,s){const o=r.map(l=>({...l,status:l.status==="cancelled"?"rejected":l.status}));return _0(o,e,t,s)}const Fg="/apps/3dprint-management/assets/icon-192.png",P0=r=>r==="ke"?"var(--color-primary)":"var(--color-tip)";function L0({id:r,size:e}){return f.jsx("span",{className:"dot",style:{background:P0(r),width:e||6,height:e||6}})}function $s({kind:r,size:e}){return f.jsxs("span",{className:"kbadge "+r+(e==="sm"?" sm":""),children:[f.jsx("span",{className:"kmark"}),yi[r]]})}function Vu(){return f.jsx("span",{"aria-hidden":"true",className:"dlic",children:"↓"})}function D0(r,e){const t=mn(r);if(e==="file"){const l=r.file||`${r.title}.stl`,u=["ScienceHUB 3Dプリント — 印刷データ","",`ファイル名: ${l}`,`作品名: ${r.title}`,`申請者: ${r.who.name}（${Hi(r.who.hr)}・${r.who.num}番）`,`機種: ${xi[r.machine].name}`,`種別: ${yi[r.kind]}`,`日付: ${r.date}`,`時間: ${qt(t.start)}〜${qt(t.end)}`,`サイズ: ${r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":"—"}`,"","※ このファイルはデザイン確認用のプレースホルダです。本番では署名付きURLから取得します。"].join(`\r
`);Cd(l.replace(/\.[^.]+$/,"")+".txt",u);return}const s=["ScienceHUB 3Dプリント 申請書","=============================",`作品名      : ${r.title}`,`日付        : ${r.date}（${wr[zn(r.date).getDay()]}）`,`時間        : ${qt(t.start)}〜${qt(t.end)}（${Yl(t.end-t.start)}）`,`機種        : ${xi[r.machine].name}（${xi[r.machine].maker}）`,`種別        : ${yi[r.kind]}${r.kind==="request"?"（依頼枠を丸ごと占有）":"（データ提出なし）"}`,`状態        : ${Qs[r.status]}`,`担当        : ${Tg(r.date).join(" / ")||"休み"}`,`申請者      : ${r.who.name}（${Hi(r.who.hr)}・${r.who.num}番）`,`印刷データ  : ${r.file||"—"}${r.fileSize?"（"+(r.fileSize/1048576).toFixed(2)+" MB）":""}`,`備考        : ${r.note||"—"}`,`担当者メモ  : ${r.adminNote||"—"}`,"","出力: ScienceHUB 3Dプリント管理"],o=`${r.date}_${r.title.split(/[\\/:*?"<>|]/).join("_")}.txt`;Cd(o,s.join(`\r
`))}function Cd(r,e){const t=new Blob(["\uFEFF"+e],{type:"text/plain;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a");o.href=s,o.download=r,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function U0(r,e){const t=r.filter(l=>l.date===e).sort((l,u)=>mn(l).start-mn(u).start||Za.indexOf(l.machine)-Za.indexOf(u.machine)),s=Tg(e).join(" / ")||"休み",o=[`ScienceHUB 3Dプリント 申請一覧 — ${e}（${wr[zn(e).getDay()]}）`,`担当: ${s}`,`件数: ${t.length}`,"=".repeat(48)];return t.forEach((l,u)=>{const d=mn(l);o.push("",`[${u+1}] ${l.title}`,`  時間   : ${qt(d.start)}〜${qt(d.end)}（${Yl(d.end-d.start)}）`,`  機種   : ${xi[l.machine].name}`,`  種別   : ${yi[l.kind]}`,`  状態   : ${Qs[l.status]}`,`  申請者 : ${l.who.name}（${Hi(l.who.hr)}・${l.who.num}番）`,`  データ : ${l.file||"—"}`,`  備考   : ${l.note||"—"}`)}),Cd(`${e}_申請一覧.txt`,o.join(`\r
`)),t.length}function bd({status:r}){return f.jsx("span",{className:"tag "+r,children:Qs[r]})}function Hl({tone:r,children:e}){return f.jsx("span",{className:"chip"+(r?" "+r:""),children:e})}function I0({id:r,small:e}){const t=Jr(r);return t?f.jsxs("span",{className:"mtag"+(e?" sm":""),children:[f.jsx("span",{className:"mtag-av",style:{background:t.color},children:t.name.slice(0,1)}),t.name]}):f.jsx("span",{className:"mtag none",children:"休み"})}function F0(r){if(!r)return"—";const e=new Date(r),t=zl($x()),s=Math.round((t-zl(e))/864e5),o=kn(e.getHours())+":"+kn(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}const O0=r=>{const e=new Date(r);return kn(e.getHours())+":"+kn(e.getMinutes())};function k0({screen:r,setScreen:e,operatorSession:t,pendingCount:s,onCsv:o}){return f.jsx("header",{className:"site-header",children:f.jsxs("div",{className:"header-inner",children:[f.jsxs("a",{className:"brand",href:"/",children:[f.jsx("img",{src:Fg,alt:""}),"ScienceHUB",f.jsx("span",{className:"sep"}),f.jsx("span",{className:"crumb",children:"3Dプリント管理"})]}),f.jsx("span",{className:"adm-pill",children:"管理者"}),f.jsxs("nav",{className:"screens","aria-label":"画面",children:[f.jsxs("button",{type:"button","aria-current":r==="reserve"?"page":void 0,className:r==="reserve"?"on":"",onClick:()=>e("reserve"),children:["申請の管理",s>0&&f.jsx("span",{className:"nav-count num",children:s})]}),f.jsx("button",{type:"button","aria-current":r==="settings"?"page":void 0,className:r==="settings"?"on":"",onClick:()=>e("settings"),children:"シフト・設定"}),f.jsx("button",{type:"button","aria-current":r==="ops"?"page":void 0,className:r==="ops"?"on":"",onClick:()=>e("ops"),children:"運用"})]}),f.jsxs("div",{className:"hdr-right",children:[f.jsxs("div",{className:"actor actor-readonly",title:(t==null?void 0:t.user.username)??"",children:[f.jsx("span",{children:"ログイン"}),f.jsx("strong",{children:(t==null?void 0:t.user.display_name)??"—"}),t!=null&&t.linked_member?f.jsxs("span",{className:"actor-staff",children:["／印刷担当 ",t.linked_member.name]}):f.jsx("span",{className:"actor-staff actor-staff-warn",children:"／印刷担当未紐づけ"})]}),r==="reserve"&&f.jsx("button",{type:"button",className:"hdr-link",onClick:o,children:"CSV出力"}),f.jsx("a",{className:"hdr-link",href:"/apps/3dprint-reservation/",children:"申請フォーム"})]})]})})}function z0(r,e){const t=Ag(r,e);return{req:t.requests.length,res:t.reserves.length,pending:t.pending}}function B0({d:r,ds:e,apps:t,staffIds:s,selected:o,onPick:l,dense:u}){const d=r.getDay(),m=z0(t,e),p=["day"];return d===0&&p.push("sun"),d===6&&p.push("sat"),e===li&&p.push("today"),e===o&&p.push("sel"),s.length||p.push("closed"),f.jsxs("button",{type:"button",className:p.join(" "),onClick:()=>l(e),"aria-pressed":e===o,"aria-label":`${r.getMonth()+1}月${r.getDate()}日 依頼${m.req}件 予約${m.res}件 ${s.length?"担当あり":"担当なし"}`,children:[f.jsxs("span",{className:"d-top",children:[f.jsx("span",{className:"d num",children:r.getDate()}),f.jsx("span",{className:"d-staffflag"+(s.length?" on":""),children:s.length?"担当あり":"休み"})]}),f.jsxs("span",{className:"c-kinds",children:[f.jsxs("span",{className:"c-k req"+(m.req?"":" zero"),children:[f.jsx("i",{}),"依頼",f.jsx("b",{className:"num",children:m.req})]}),f.jsxs("span",{className:"c-k res"+(m.res?"":" zero"),children:[f.jsx("i",{}),"予約",f.jsx("b",{className:"num",children:m.res})]})]}),f.jsx("span",{className:"c-pend",children:m.pending>0?f.jsxs("span",{className:"pend num",children:["申請中 ",m.pending]}):null})]})}function H0({apps:r,avail:e,selected:t,onPick:s}){const o=Sg(zn(t)),l=[];for(let _=0;_<4;_++){const M=[];for(let E=0;E<7;E++)M.push(kl(o,_*7+E));l.push(M)}const u=l.flat(),d=u[u.length-1],p=u[0].getMonth()===d.getMonth()?`${u[0].getFullYear()}年 ${kn(u[0].getMonth()+1)}月`:`${kn(u[0].getMonth()+1)}月 → ${kn(d.getMonth()+1)}月`,g=u.map(Yn);r.filter(_=>g.indexOf(_.date)>=0&&_.status!=="cancelled");const y=_=>s(Yn(kl(zn(t),_*28)));return f.jsxs("div",{className:"card cal-card",children:[f.jsxs("div",{className:"cal-head",children:[f.jsx("div",{className:"cal-month",children:f.jsx("span",{children:p})}),f.jsx("div",{className:"cal-nav",children:f.jsx("button",{type:"button",className:"cal-today",onClick:()=>s(li),children:"今日"})})]}),f.jsxs("div",{className:"cal-body",children:[f.jsxs("button",{type:"button",className:"cal-side prev",onClick:()=>y(-1),"aria-label":"前の4週間",children:[f.jsx("span",{"aria-hidden":"true",children:"‹"}),f.jsx("span",{className:"cal-side-lbl",children:"前へ"})]}),f.jsxs("div",{className:"cal-main",children:[f.jsx("div",{className:"cal-wds",children:wr.map((_,M)=>f.jsx("div",{className:"cal-wd"+(M===0?" sun":M===6?" sat":""),children:_},_))}),f.jsx("div",{className:"cal-grid",children:l.map(_=>_.map(M=>{const E=Yn(M);return f.jsx(B0,{d:M,ds:E,apps:r,staffIds:eo(E),selected:E===t,onPick:s},E)}))})]}),f.jsxs("button",{type:"button",className:"cal-side next",onClick:()=>y(1),"aria-label":"次の4週間",children:[f.jsx("span",{"aria-hidden":"true",children:"›"}),f.jsx("span",{className:"cal-side-lbl",children:"次へ"})]})]}),f.jsxs("div",{className:"cal-legend",children:[f.jsx("span",{className:"lg",children:f.jsx($s,{kind:"request",size:"sm"})}),f.jsx("span",{className:"lg",children:"STLを提出して印刷枠を使う"}),f.jsx("span",{className:"lg",children:f.jsx($s,{kind:"reserve",size:"sm"})}),f.jsx("span",{className:"lg",children:"プリンターの時間だけ確保"}),f.jsx("span",{className:"lg lg-right",children:"日付をクリックすると、その日の申請が右に出ます"})]})]})}function j0({open:r,title:e,sub:t,onClose:s,children:o,footer:l}){return Ce.useEffect(()=>{if(!r)return;const u=d=>{d.key==="Escape"&&s()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[r,s]),f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),f.jsxs("aside",{className:"sheet"+(r?" on":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[f.jsxs("div",{className:"sheet-h",children:[f.jsxs("div",{style:{minWidth:0},children:[f.jsx("h2",{children:e}),t&&f.jsx("p",{children:t})]}),f.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),f.jsx("div",{className:"sheet-b",children:r?o:null}),l&&f.jsx("div",{className:"sheet-f",children:l})]})]})}function V0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:u}){return Ce.useEffect(()=>{if(!r)return;const d=m=>{m.key==="Escape"&&s()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[r,s]),r?f.jsxs("div",{className:"modal-wrap",role:"dialog","aria-modal":"true","aria-label":e,children:[f.jsx("div",{className:"modal-scrim",onClick:s}),f.jsxs("div",{className:"modal"+(u?" wide":""),children:[f.jsxs("div",{className:"modal-h",children:[f.jsxs("div",{children:[f.jsx("h2",{children:e}),t&&f.jsx("p",{children:t})]}),f.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),f.jsx("div",{className:"modal-b",children:o}),l&&f.jsx("div",{className:"modal-f",children:l})]})]}):null}function G0({toast:r}){return f.jsx("div",{className:"toast"+(r?" show":""),role:"status","aria-live":"polite",children:r&&f.jsxs(f.Fragment,{children:[r.text,r.mark&&f.jsx("b",{children:r.mark})]})})}function W0(r){if(!r)return"—";const e=new Date(r),t=Bl(g0()),s=Math.round((t-Bl(e))/864e5),o=es(e.getHours())+":"+es(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}function X0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:u,tabs:d}){return Ce.useEffect(()=>{if(!r)return;const m=p=>{p.key==="Escape"&&s()};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[r,s]),f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),f.jsxs("aside",{className:"sheet"+(r?" on":"")+(u?" wide":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[f.jsxs("div",{className:"sheet-h",children:[f.jsxs("div",{style:{minWidth:0},children:[f.jsx("h2",{children:e}),t&&f.jsx("p",{children:t})]}),f.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),d,f.jsx("div",{className:"sheet-b",children:r?o:null}),l&&f.jsx("div",{className:"sheet-f",children:l})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Xd="164",$0=0,$p=1,q0=2,Og=1,Y0=2,ki=3,Sr=0,Rn=1,mi=2,xr=0,qs=1,qp=2,Yp=3,Kp=4,K0=5,qr=100,Z0=101,Q0=102,J0=103,ey=104,ty=200,ny=201,iy=202,ry=203,Rd=204,Nd=205,sy=206,ay=207,oy=208,ly=209,cy=210,uy=211,dy=212,fy=213,hy=214,py=0,my=1,gy=2,jl=3,vy=4,_y=5,xy=6,yy=7,kg=0,Sy=1,My=2,yr=0,Ey=1,wy=2,Ty=3,Ay=4,Cy=5,by=6,Ry=7,zg=300,Js=301,ea=302,Pd=303,Ld=304,Zl=306,Dd=1e3,Zr=1001,Ud=1002,Kn=1003,Ny=1004,ml=1005,oi=1006,Gu=1007,Qr=1008,Mr=1009,Py=1010,Ly=1011,Bg=1012,Hg=1013,ta=1014,_r=1015,Ql=1016,jg=1017,Vg=1018,to=1020,Dy=35902,Uy=1021,Iy=1022,vi=1023,Fy=1024,Oy=1025,Ys=1026,Ja=1027,ky=1028,Gg=1029,zy=1030,Wg=1031,Xg=1033,Wu=33776,Xu=33777,$u=33778,qu=33779,Zp=35840,Qp=35841,Jp=35842,em=35843,tm=36196,nm=37492,im=37496,rm=37808,sm=37809,am=37810,om=37811,lm=37812,cm=37813,um=37814,dm=37815,fm=37816,hm=37817,pm=37818,mm=37819,gm=37820,vm=37821,Yu=36492,_m=36494,xm=36495,By=36283,ym=36284,Sm=36285,Mm=36286,Hy=3200,jy=3201,$g=0,Vy=1,vr="",hi="srgb",Tr="srgb-linear",$d="display-p3",Jl="display-p3-linear",Vl="linear",Lt="srgb",Gl="rec709",Wl="p3",Rs=7680,Em=519,Gy=512,Wy=513,Xy=514,qg=515,$y=516,qy=517,Yy=518,Ky=519,wm=35044,Tm="300 es",zi=2e3,Xl=2001;class ra{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(t)===-1&&s[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const o=s.slice(0);for(let l=0,u=o.length;l<u;l++)o[l].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ku=Math.PI/180,Id=180/Math.PI;function no(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(hn[r&255]+hn[r>>8&255]+hn[r>>16&255]+hn[r>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[s&255]+hn[s>>8&255]+hn[s>>16&255]+hn[s>>24&255]).toLowerCase()}function bn(r,e,t){return Math.max(e,Math.min(t,r))}function Zy(r,e){return(r%e+e)%e}function Zu(r,e,t){return(1-t)*r+t*e}function Va(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Cn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class _t{constructor(e=0,t=0){_t.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,s=this.y,o=e.elements;return this.x=o[0]*t+o[3]*s+o[6],this.y=o[1]*t+o[4]*s+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(bn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y;return t*t+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const s=Math.cos(t),o=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*s-u*o+e.x,this.y=l*o+u*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ct{constructor(e,t,s,o,l,u,d,m,p){ct.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,u,d,m,p)}set(e,t,s,o,l,u,d,m,p){const g=this.elements;return g[0]=e,g[1]=o,g[2]=d,g[3]=t,g[4]=l,g[5]=m,g[6]=s,g[7]=u,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],this}extractBasis(e,t,s){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,u=s[0],d=s[3],m=s[6],p=s[1],g=s[4],y=s[7],_=s[2],M=s[5],E=s[8],w=o[0],S=o[3],x=o[6],b=o[1],R=o[4],D=o[7],X=o[2],I=o[5],L=o[8];return l[0]=u*w+d*b+m*X,l[3]=u*S+d*R+m*I,l[6]=u*x+d*D+m*L,l[1]=p*w+g*b+y*X,l[4]=p*S+g*R+y*I,l[7]=p*x+g*D+y*L,l[2]=_*w+M*b+E*X,l[5]=_*S+M*R+E*I,l[8]=_*x+M*D+E*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],d=e[5],m=e[6],p=e[7],g=e[8];return t*u*g-t*d*p-s*l*g+s*d*m+o*l*p-o*u*m}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],d=e[5],m=e[6],p=e[7],g=e[8],y=g*u-d*p,_=d*m-g*l,M=p*l-u*m,E=t*y+s*_+o*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/E;return e[0]=y*w,e[1]=(o*p-g*s)*w,e[2]=(d*s-o*u)*w,e[3]=_*w,e[4]=(g*t-o*m)*w,e[5]=(o*l-d*t)*w,e[6]=M*w,e[7]=(s*m-p*t)*w,e[8]=(u*t-s*l)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,s,o,l,u,d){const m=Math.cos(l),p=Math.sin(l);return this.set(s*m,s*p,-s*(m*u+p*d)+u+e,-o*p,o*m,-o*(-p*u+m*d)+d+t,0,0,1),this}scale(e,t){return this.premultiply(Qu.makeScale(e,t)),this}rotate(e){return this.premultiply(Qu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,s,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<9;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<9;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qu=new ct;function Yg(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function $l(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Qy(){const r=$l("canvas");return r.style.display="block",r}const Am={};function Jy(r){r in Am||(Am[r]=!0,console.warn(r))}const Cm=new ct().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),bm=new ct().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gl={[Tr]:{transfer:Vl,primaries:Gl,toReference:r=>r,fromReference:r=>r},[hi]:{transfer:Lt,primaries:Gl,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[Jl]:{transfer:Vl,primaries:Wl,toReference:r=>r.applyMatrix3(bm),fromReference:r=>r.applyMatrix3(Cm)},[$d]:{transfer:Lt,primaries:Wl,toReference:r=>r.convertSRGBToLinear().applyMatrix3(bm),fromReference:r=>r.applyMatrix3(Cm).convertLinearToSRGB()}},eS=new Set([Tr,Jl]),Tt={enabled:!0,_workingColorSpace:Tr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!eS.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const s=gl[e].toReference,o=gl[t].fromReference;return o(s(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return gl[r].primaries},getTransfer:function(r){return r===vr?Vl:gl[r].transfer}};function Ks(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ju(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ns;class tS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ns===void 0&&(Ns=$l("canvas")),Ns.width=e.width,Ns.height=e.height;const s=Ns.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),t=Ns}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$l("canvas");t.width=e.width,t.height=e.height;const s=t.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const o=s.getImageData(0,0,e.width,e.height),l=o.data;for(let u=0;u<l.length;u++)l[u]=Ks(l[u]/255)*255;return s.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let s=0;s<t.length;s++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[s]=Math.floor(Ks(t[s]/255)*255):t[s]=Ks(t[s]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nS=0;class Kg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nS++}),this.uuid=no(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let u=0,d=o.length;u<d;u++)o[u].isDataTexture?l.push(ed(o[u].image)):l.push(ed(o[u]))}else l=ed(o);s.url=l}return t||(e.images[this.uuid]=s),s}}function ed(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?tS.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let iS=0;class Nn extends ra{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,s=Zr,o=Zr,l=oi,u=Qr,d=vi,m=Mr,p=Nn.DEFAULT_ANISOTROPY,g=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iS++}),this.uuid=no(),this.name="",this.source=new Kg(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=s,this.wrapT=o,this.magFilter=l,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),t||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==zg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Dd:e.x=e.x-Math.floor(e.x);break;case Zr:e.x=e.x<0?0:1;break;case Ud:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Dd:e.y=e.y-Math.floor(e.y);break;case Zr:e.y=e.y<0?0:1;break;case Ud:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=zg;Nn.DEFAULT_ANISOTROPY=1;class rn{constructor(e=0,t=0,s=0,o=1){rn.prototype.isVector4=!0,this.x=e,this.y=t,this.z=s,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,s,o){return this.x=e,this.y=t,this.z=s,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*s+u[8]*o+u[12]*l,this.y=u[1]*t+u[5]*s+u[9]*o+u[13]*l,this.z=u[2]*t+u[6]*s+u[10]*o+u[14]*l,this.w=u[3]*t+u[7]*s+u[11]*o+u[15]*l,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,s,o,l;const m=e.elements,p=m[0],g=m[4],y=m[8],_=m[1],M=m[5],E=m[9],w=m[2],S=m[6],x=m[10];if(Math.abs(g-_)<.01&&Math.abs(y-w)<.01&&Math.abs(E-S)<.01){if(Math.abs(g+_)<.1&&Math.abs(y+w)<.1&&Math.abs(E+S)<.1&&Math.abs(p+M+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const R=(p+1)/2,D=(M+1)/2,X=(x+1)/2,I=(g+_)/4,L=(y+w)/4,j=(E+S)/4;return R>D&&R>X?R<.01?(s=0,o=.707106781,l=.707106781):(s=Math.sqrt(R),o=I/s,l=L/s):D>X?D<.01?(s=.707106781,o=0,l=.707106781):(o=Math.sqrt(D),s=I/o,l=j/o):X<.01?(s=.707106781,o=.707106781,l=0):(l=Math.sqrt(X),s=L/l,o=j/l),this.set(s,o,l,t),this}let b=Math.sqrt((S-E)*(S-E)+(y-w)*(y-w)+(_-g)*(_-g));return Math.abs(b)<.001&&(b=1),this.x=(S-E)/b,this.y=(y-w)/b,this.z=(_-g)/b,this.w=Math.acos((p+M+x-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this.w=e.w+(t.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rS extends ra{constructor(e=1,t=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rn(0,0,e,t),this.scissorTest=!1,this.viewport=new rn(0,0,e,t);const o={width:e,height:t,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const l=new Nn(o,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);l.flipY=!1,l.generateMipmaps=s.generateMipmaps,l.internalFormat=s.internalFormat,this.textures=[];const u=s.count;for(let d=0;d<u;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,s=1){if(this.width!==e||this.height!==t||this.depth!==s){this.width=e,this.height=t,this.depth=s;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=s;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,o=e.textures.length;s<o;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Kg(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends rS{constructor(e=1,t=1,s={}){super(e,t,s),this.isWebGLRenderTarget=!0}}class Zg extends Nn{constructor(e=null,t=1,s=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sS extends Nn{constructor(e=null,t=1,s=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class io{constructor(e=0,t=0,s=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=s,this._w=o}static slerpFlat(e,t,s,o,l,u,d){let m=s[o+0],p=s[o+1],g=s[o+2],y=s[o+3];const _=l[u+0],M=l[u+1],E=l[u+2],w=l[u+3];if(d===0){e[t+0]=m,e[t+1]=p,e[t+2]=g,e[t+3]=y;return}if(d===1){e[t+0]=_,e[t+1]=M,e[t+2]=E,e[t+3]=w;return}if(y!==w||m!==_||p!==M||g!==E){let S=1-d;const x=m*_+p*M+g*E+y*w,b=x>=0?1:-1,R=1-x*x;if(R>Number.EPSILON){const X=Math.sqrt(R),I=Math.atan2(X,x*b);S=Math.sin(S*I)/X,d=Math.sin(d*I)/X}const D=d*b;if(m=m*S+_*D,p=p*S+M*D,g=g*S+E*D,y=y*S+w*D,S===1-d){const X=1/Math.sqrt(m*m+p*p+g*g+y*y);m*=X,p*=X,g*=X,y*=X}}e[t]=m,e[t+1]=p,e[t+2]=g,e[t+3]=y}static multiplyQuaternionsFlat(e,t,s,o,l,u){const d=s[o],m=s[o+1],p=s[o+2],g=s[o+3],y=l[u],_=l[u+1],M=l[u+2],E=l[u+3];return e[t]=d*E+g*y+m*M-p*_,e[t+1]=m*E+g*_+p*y-d*M,e[t+2]=p*E+g*M+d*_-m*y,e[t+3]=g*E-d*y-m*_-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,s,o){return this._x=e,this._y=t,this._z=s,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const s=e._x,o=e._y,l=e._z,u=e._order,d=Math.cos,m=Math.sin,p=d(s/2),g=d(o/2),y=d(l/2),_=m(s/2),M=m(o/2),E=m(l/2);switch(u){case"XYZ":this._x=_*g*y+p*M*E,this._y=p*M*y-_*g*E,this._z=p*g*E+_*M*y,this._w=p*g*y-_*M*E;break;case"YXZ":this._x=_*g*y+p*M*E,this._y=p*M*y-_*g*E,this._z=p*g*E-_*M*y,this._w=p*g*y+_*M*E;break;case"ZXY":this._x=_*g*y-p*M*E,this._y=p*M*y+_*g*E,this._z=p*g*E+_*M*y,this._w=p*g*y-_*M*E;break;case"ZYX":this._x=_*g*y-p*M*E,this._y=p*M*y+_*g*E,this._z=p*g*E-_*M*y,this._w=p*g*y+_*M*E;break;case"YZX":this._x=_*g*y+p*M*E,this._y=p*M*y+_*g*E,this._z=p*g*E-_*M*y,this._w=p*g*y-_*M*E;break;case"XZY":this._x=_*g*y-p*M*E,this._y=p*M*y-_*g*E,this._z=p*g*E+_*M*y,this._w=p*g*y+_*M*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const s=t/2,o=Math.sin(s);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,s=t[0],o=t[4],l=t[8],u=t[1],d=t[5],m=t[9],p=t[2],g=t[6],y=t[10],_=s+d+y;if(_>0){const M=.5/Math.sqrt(_+1);this._w=.25/M,this._x=(g-m)*M,this._y=(l-p)*M,this._z=(u-o)*M}else if(s>d&&s>y){const M=2*Math.sqrt(1+s-d-y);this._w=(g-m)/M,this._x=.25*M,this._y=(o+u)/M,this._z=(l+p)/M}else if(d>y){const M=2*Math.sqrt(1+d-s-y);this._w=(l-p)/M,this._x=(o+u)/M,this._y=.25*M,this._z=(m+g)/M}else{const M=2*Math.sqrt(1+y-s-d);this._w=(u-o)/M,this._x=(l+p)/M,this._y=(m+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let s=e.dot(t)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bn(this.dot(e),-1,1)))}rotateTowards(e,t){const s=this.angleTo(e);if(s===0)return this;const o=Math.min(1,t/s);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const s=e._x,o=e._y,l=e._z,u=e._w,d=t._x,m=t._y,p=t._z,g=t._w;return this._x=s*g+u*d+o*p-l*m,this._y=o*g+u*m+l*d-s*p,this._z=l*g+u*p+s*m-o*d,this._w=u*g-s*d-o*m-l*p,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const s=this._x,o=this._y,l=this._z,u=this._w;let d=u*e._w+s*e._x+o*e._y+l*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=u,this._x=s,this._y=o,this._z=l,this;const m=1-d*d;if(m<=Number.EPSILON){const M=1-t;return this._w=M*u+t*this._w,this._x=M*s+t*this._x,this._y=M*o+t*this._y,this._z=M*l+t*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,d),y=Math.sin((1-t)*g)/p,_=Math.sin(t*g)/p;return this._w=u*y+this._w*_,this._x=s*y+this._x*_,this._y=o*y+this._y*_,this._z=l*y+this._z*_,this._onChangeCallback(),this}slerpQuaternions(e,t,s){return this.copy(e).slerp(t,s)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),s=Math.random(),o=Math.sqrt(1-s),l=Math.sqrt(s);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class oe{constructor(e=0,t=0,s=0){oe.prototype.isVector3=!0,this.x=e,this.y=t,this.z=s}set(e,t,s){return s===void 0&&(s=this.z),this.x=e,this.y=t,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[3]*s+l[6]*o,this.y=l[1]*t+l[4]*s+l[7]*o,this.z=l[2]*t+l[5]*s+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=e.elements,u=1/(l[3]*t+l[7]*s+l[11]*o+l[15]);return this.x=(l[0]*t+l[4]*s+l[8]*o+l[12])*u,this.y=(l[1]*t+l[5]*s+l[9]*o+l[13])*u,this.z=(l[2]*t+l[6]*s+l[10]*o+l[14])*u,this}applyQuaternion(e){const t=this.x,s=this.y,o=this.z,l=e.x,u=e.y,d=e.z,m=e.w,p=2*(u*o-d*s),g=2*(d*t-l*o),y=2*(l*s-u*t);return this.x=t+m*p+u*y-d*g,this.y=s+m*g+d*p-l*y,this.z=o+m*y+l*g-u*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[4]*s+l[8]*o,this.y=l[1]*t+l[5]*s+l[9]*o,this.z=l[2]*t+l[6]*s+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const s=e.x,o=e.y,l=e.z,u=t.x,d=t.y,m=t.z;return this.x=o*m-l*d,this.y=l*u-s*m,this.z=s*d-o*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const s=e.dot(this)/t;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return td.copy(this).projectOnVector(e),this.sub(td)}reflect(e){return this.sub(td.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(bn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y,o=this.z-e.z;return t*t+s*s+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,s){const o=Math.sin(t)*e;return this.x=o*Math.sin(s),this.y=Math.cos(t)*e,this.z=o*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,s){return this.x=e*Math.sin(t),this.y=s,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=s,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,s=Math.sqrt(1-t*t);return this.x=s*Math.cos(e),this.y=t,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const td=new oe,Rm=new io;class sa{constructor(e=new oe(1/0,1/0,1/0),t=new oe(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t+=3)this.expandByPoint(ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,s=e.count;t<s;t++)this.expandByPoint(ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const s=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const l=s.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,d=l.count;u<d;u++)e.isMesh===!0?e.getVertexPosition(u,ri):ri.fromBufferAttribute(l,u),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vl.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),vl.copy(s.boundingBox)),vl.applyMatrix4(e.matrixWorld),this.union(vl)}const o=e.children;for(let l=0,u=o.length;l<u;l++)this.expandByObject(o[l],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,s;return e.normal.x>0?(t=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),t<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ga),_l.subVectors(this.max,Ga),Ps.subVectors(e.a,Ga),Ls.subVectors(e.b,Ga),Ds.subVectors(e.c,Ga),dr.subVectors(Ls,Ps),fr.subVectors(Ds,Ls),Br.subVectors(Ps,Ds);let t=[0,-dr.z,dr.y,0,-fr.z,fr.y,0,-Br.z,Br.y,dr.z,0,-dr.x,fr.z,0,-fr.x,Br.z,0,-Br.x,-dr.y,dr.x,0,-fr.y,fr.x,0,-Br.y,Br.x,0];return!nd(t,Ps,Ls,Ds,_l)||(t=[1,0,0,0,1,0,0,0,1],!nd(t,Ps,Ls,Ds,_l))?!1:(xl.crossVectors(dr,fr),t=[xl.x,xl.y,xl.z],nd(t,Ps,Ls,Ds,_l))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Li=[new oe,new oe,new oe,new oe,new oe,new oe,new oe,new oe],ri=new oe,vl=new sa,Ps=new oe,Ls=new oe,Ds=new oe,dr=new oe,fr=new oe,Br=new oe,Ga=new oe,_l=new oe,xl=new oe,Hr=new oe;function nd(r,e,t,s,o){for(let l=0,u=r.length-3;l<=u;l+=3){Hr.fromArray(r,l);const d=o.x*Math.abs(Hr.x)+o.y*Math.abs(Hr.y)+o.z*Math.abs(Hr.z),m=e.dot(Hr),p=t.dot(Hr),g=s.dot(Hr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>d)return!1}return!0}const aS=new sa,Wa=new oe,id=new oe;class qd{constructor(e=new oe,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const s=this.center;t!==void 0?s.copy(t):aS.setFromPoints(e).getCenter(s);let o=0;for(let l=0,u=e.length;l<u;l++)o=Math.max(o,s.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const s=this.center.distanceToSquared(e);return t.copy(e),s>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wa.subVectors(e,this.center);const t=Wa.lengthSq();if(t>this.radius*this.radius){const s=Math.sqrt(t),o=(s-this.radius)*.5;this.center.addScaledVector(Wa,o/s),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(id.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wa.copy(e.center).add(id)),this.expandByPoint(Wa.copy(e.center).sub(id))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Di=new oe,rd=new oe,yl=new oe,hr=new oe,sd=new oe,Sl=new oe,ad=new oe;class oS{constructor(e=new oe,t=new oe(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const s=t.dot(this.direction);return s<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,s,o){rd.copy(e).add(t).multiplyScalar(.5),yl.copy(t).sub(e).normalize(),hr.copy(this.origin).sub(rd);const l=e.distanceTo(t)*.5,u=-this.direction.dot(yl),d=hr.dot(this.direction),m=-hr.dot(yl),p=hr.lengthSq(),g=Math.abs(1-u*u);let y,_,M,E;if(g>0)if(y=u*m-d,_=u*d-m,E=l*g,y>=0)if(_>=-E)if(_<=E){const w=1/g;y*=w,_*=w,M=y*(y+u*_+2*d)+_*(u*y+_+2*m)+p}else _=l,y=Math.max(0,-(u*_+d)),M=-y*y+_*(_+2*m)+p;else _=-l,y=Math.max(0,-(u*_+d)),M=-y*y+_*(_+2*m)+p;else _<=-E?(y=Math.max(0,-(-u*l+d)),_=y>0?-l:Math.min(Math.max(-l,-m),l),M=-y*y+_*(_+2*m)+p):_<=E?(y=0,_=Math.min(Math.max(-l,-m),l),M=_*(_+2*m)+p):(y=Math.max(0,-(u*l+d)),_=y>0?l:Math.min(Math.max(-l,-m),l),M=-y*y+_*(_+2*m)+p);else _=u>0?-l:l,y=Math.max(0,-(u*_+d)),M=-y*y+_*(_+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,y),o&&o.copy(rd).addScaledVector(yl,_),M}intersectSphere(e,t){Di.subVectors(e.center,this.origin);const s=Di.dot(this.direction),o=Di.dot(Di)-s*s,l=e.radius*e.radius;if(o>l)return null;const u=Math.sqrt(l-o),d=s-u,m=s+u;return m<0?null:d<0?this.at(m,t):this.at(d,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/t;return s>=0?s:null}intersectPlane(e,t){const s=this.distanceToPlane(e);return s===null?null:this.at(s,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let s,o,l,u,d,m;const p=1/this.direction.x,g=1/this.direction.y,y=1/this.direction.z,_=this.origin;return p>=0?(s=(e.min.x-_.x)*p,o=(e.max.x-_.x)*p):(s=(e.max.x-_.x)*p,o=(e.min.x-_.x)*p),g>=0?(l=(e.min.y-_.y)*g,u=(e.max.y-_.y)*g):(l=(e.max.y-_.y)*g,u=(e.min.y-_.y)*g),s>u||l>o||((l>s||isNaN(s))&&(s=l),(u<o||isNaN(o))&&(o=u),y>=0?(d=(e.min.z-_.z)*y,m=(e.max.z-_.z)*y):(d=(e.max.z-_.z)*y,m=(e.min.z-_.z)*y),s>m||d>o)||((d>s||s!==s)&&(s=d),(m<o||o!==o)&&(o=m),o<0)?null:this.at(s>=0?s:o,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,s,o,l){sd.subVectors(t,e),Sl.subVectors(s,e),ad.crossVectors(sd,Sl);let u=this.direction.dot(ad),d;if(u>0){if(o)return null;d=1}else if(u<0)d=-1,u=-u;else return null;hr.subVectors(this.origin,e);const m=d*this.direction.dot(Sl.crossVectors(hr,Sl));if(m<0)return null;const p=d*this.direction.dot(sd.cross(hr));if(p<0||m+p>u)return null;const g=-d*hr.dot(ad);return g<0?null:this.at(g/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(e,t,s,o,l,u,d,m,p,g,y,_,M,E,w,S){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,u,d,m,p,g,y,_,M,E,w,S)}set(e,t,s,o,l,u,d,m,p,g,y,_,M,E,w,S){const x=this.elements;return x[0]=e,x[4]=t,x[8]=s,x[12]=o,x[1]=l,x[5]=u,x[9]=d,x[13]=m,x[2]=p,x[6]=g,x[10]=y,x[14]=_,x[3]=M,x[7]=E,x[11]=w,x[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],t[9]=s[9],t[10]=s[10],t[11]=s[11],t[12]=s[12],t[13]=s[13],t[14]=s[14],t[15]=s[15],this}copyPosition(e){const t=this.elements,s=e.elements;return t[12]=s[12],t[13]=s[13],t[14]=s[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,s){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,t,s){return this.set(e.x,t.x,s.x,0,e.y,t.y,s.y,0,e.z,t.z,s.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,s=e.elements,o=1/Us.setFromMatrixColumn(e,0).length(),l=1/Us.setFromMatrixColumn(e,1).length(),u=1/Us.setFromMatrixColumn(e,2).length();return t[0]=s[0]*o,t[1]=s[1]*o,t[2]=s[2]*o,t[3]=0,t[4]=s[4]*l,t[5]=s[5]*l,t[6]=s[6]*l,t[7]=0,t[8]=s[8]*u,t[9]=s[9]*u,t[10]=s[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,s=e.x,o=e.y,l=e.z,u=Math.cos(s),d=Math.sin(s),m=Math.cos(o),p=Math.sin(o),g=Math.cos(l),y=Math.sin(l);if(e.order==="XYZ"){const _=u*g,M=u*y,E=d*g,w=d*y;t[0]=m*g,t[4]=-m*y,t[8]=p,t[1]=M+E*p,t[5]=_-w*p,t[9]=-d*m,t[2]=w-_*p,t[6]=E+M*p,t[10]=u*m}else if(e.order==="YXZ"){const _=m*g,M=m*y,E=p*g,w=p*y;t[0]=_+w*d,t[4]=E*d-M,t[8]=u*p,t[1]=u*y,t[5]=u*g,t[9]=-d,t[2]=M*d-E,t[6]=w+_*d,t[10]=u*m}else if(e.order==="ZXY"){const _=m*g,M=m*y,E=p*g,w=p*y;t[0]=_-w*d,t[4]=-u*y,t[8]=E+M*d,t[1]=M+E*d,t[5]=u*g,t[9]=w-_*d,t[2]=-u*p,t[6]=d,t[10]=u*m}else if(e.order==="ZYX"){const _=u*g,M=u*y,E=d*g,w=d*y;t[0]=m*g,t[4]=E*p-M,t[8]=_*p+w,t[1]=m*y,t[5]=w*p+_,t[9]=M*p-E,t[2]=-p,t[6]=d*m,t[10]=u*m}else if(e.order==="YZX"){const _=u*m,M=u*p,E=d*m,w=d*p;t[0]=m*g,t[4]=w-_*y,t[8]=E*y+M,t[1]=y,t[5]=u*g,t[9]=-d*g,t[2]=-p*g,t[6]=M*y+E,t[10]=_-w*y}else if(e.order==="XZY"){const _=u*m,M=u*p,E=d*m,w=d*p;t[0]=m*g,t[4]=-y,t[8]=p*g,t[1]=_*y+w,t[5]=u*g,t[9]=M*y-E,t[2]=E*y-M,t[6]=d*g,t[10]=w*y+_}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(lS,e,cS)}lookAt(e,t,s){const o=this.elements;return Fn.subVectors(e,t),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),pr.crossVectors(s,Fn),pr.lengthSq()===0&&(Math.abs(s.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),pr.crossVectors(s,Fn)),pr.normalize(),Ml.crossVectors(Fn,pr),o[0]=pr.x,o[4]=Ml.x,o[8]=Fn.x,o[1]=pr.y,o[5]=Ml.y,o[9]=Fn.y,o[2]=pr.z,o[6]=Ml.z,o[10]=Fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,u=s[0],d=s[4],m=s[8],p=s[12],g=s[1],y=s[5],_=s[9],M=s[13],E=s[2],w=s[6],S=s[10],x=s[14],b=s[3],R=s[7],D=s[11],X=s[15],I=o[0],L=o[4],j=o[8],C=o[12],A=o[1],V=o[5],G=o[9],z=o[13],ne=o[2],Y=o[6],ue=o[10],fe=o[14],k=o[3],de=o[7],te=o[11],O=o[15];return l[0]=u*I+d*A+m*ne+p*k,l[4]=u*L+d*V+m*Y+p*de,l[8]=u*j+d*G+m*ue+p*te,l[12]=u*C+d*z+m*fe+p*O,l[1]=g*I+y*A+_*ne+M*k,l[5]=g*L+y*V+_*Y+M*de,l[9]=g*j+y*G+_*ue+M*te,l[13]=g*C+y*z+_*fe+M*O,l[2]=E*I+w*A+S*ne+x*k,l[6]=E*L+w*V+S*Y+x*de,l[10]=E*j+w*G+S*ue+x*te,l[14]=E*C+w*z+S*fe+x*O,l[3]=b*I+R*A+D*ne+X*k,l[7]=b*L+R*V+D*Y+X*de,l[11]=b*j+R*G+D*ue+X*te,l[15]=b*C+R*z+D*fe+X*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[4],o=e[8],l=e[12],u=e[1],d=e[5],m=e[9],p=e[13],g=e[2],y=e[6],_=e[10],M=e[14],E=e[3],w=e[7],S=e[11],x=e[15];return E*(+l*m*y-o*p*y-l*d*_+s*p*_+o*d*M-s*m*M)+w*(+t*m*M-t*p*_+l*u*_-o*u*M+o*p*g-l*m*g)+S*(+t*p*y-t*d*M-l*u*y+s*u*M+l*d*g-s*p*g)+x*(-o*d*g-t*m*y+t*d*_+o*u*y-s*u*_+s*m*g)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,s){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=s),this}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],d=e[5],m=e[6],p=e[7],g=e[8],y=e[9],_=e[10],M=e[11],E=e[12],w=e[13],S=e[14],x=e[15],b=y*S*p-w*_*p+w*m*M-d*S*M-y*m*x+d*_*x,R=E*_*p-g*S*p-E*m*M+u*S*M+g*m*x-u*_*x,D=g*w*p-E*y*p+E*d*M-u*w*M-g*d*x+u*y*x,X=E*y*m-g*w*m-E*d*_+u*w*_+g*d*S-u*y*S,I=t*b+s*R+o*D+l*X;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/I;return e[0]=b*L,e[1]=(w*_*l-y*S*l-w*o*M+s*S*M+y*o*x-s*_*x)*L,e[2]=(d*S*l-w*m*l+w*o*p-s*S*p-d*o*x+s*m*x)*L,e[3]=(y*m*l-d*_*l-y*o*p+s*_*p+d*o*M-s*m*M)*L,e[4]=R*L,e[5]=(g*S*l-E*_*l+E*o*M-t*S*M-g*o*x+t*_*x)*L,e[6]=(E*m*l-u*S*l-E*o*p+t*S*p+u*o*x-t*m*x)*L,e[7]=(u*_*l-g*m*l+g*o*p-t*_*p-u*o*M+t*m*M)*L,e[8]=D*L,e[9]=(E*y*l-g*w*l-E*s*M+t*w*M+g*s*x-t*y*x)*L,e[10]=(u*w*l-E*d*l+E*s*p-t*w*p-u*s*x+t*d*x)*L,e[11]=(g*d*l-u*y*l-g*s*p+t*y*p+u*s*M-t*d*M)*L,e[12]=X*L,e[13]=(g*w*o-E*y*o+E*s*_-t*w*_-g*s*S+t*y*S)*L,e[14]=(E*d*o-u*w*o-E*s*m+t*w*m+u*s*S-t*d*S)*L,e[15]=(u*y*o-g*d*o+g*s*m-t*y*m-u*s*_+t*d*_)*L,this}scale(e){const t=this.elements,s=e.x,o=e.y,l=e.z;return t[0]*=s,t[4]*=o,t[8]*=l,t[1]*=s,t[5]*=o,t[9]*=l,t[2]*=s,t[6]*=o,t[10]*=l,t[3]*=s,t[7]*=o,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,s,o))}makeTranslation(e,t,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,s,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,t,-s,0,0,s,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,0,s,0,0,1,0,0,-s,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,0,s,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const s=Math.cos(t),o=Math.sin(t),l=1-s,u=e.x,d=e.y,m=e.z,p=l*u,g=l*d;return this.set(p*u+s,p*d-o*m,p*m+o*d,0,p*d+o*m,g*d+s,g*m-o*u,0,p*m-o*d,g*m+o*u,l*m*m+s,0,0,0,0,1),this}makeScale(e,t,s){return this.set(e,0,0,0,0,t,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,t,s,o,l,u){return this.set(1,s,l,0,e,1,u,0,t,o,1,0,0,0,0,1),this}compose(e,t,s){const o=this.elements,l=t._x,u=t._y,d=t._z,m=t._w,p=l+l,g=u+u,y=d+d,_=l*p,M=l*g,E=l*y,w=u*g,S=u*y,x=d*y,b=m*p,R=m*g,D=m*y,X=s.x,I=s.y,L=s.z;return o[0]=(1-(w+x))*X,o[1]=(M+D)*X,o[2]=(E-R)*X,o[3]=0,o[4]=(M-D)*I,o[5]=(1-(_+x))*I,o[6]=(S+b)*I,o[7]=0,o[8]=(E+R)*L,o[9]=(S-b)*L,o[10]=(1-(_+w))*L,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,s){const o=this.elements;let l=Us.set(o[0],o[1],o[2]).length();const u=Us.set(o[4],o[5],o[6]).length(),d=Us.set(o[8],o[9],o[10]).length();this.determinant()<0&&(l=-l),e.x=o[12],e.y=o[13],e.z=o[14],si.copy(this);const p=1/l,g=1/u,y=1/d;return si.elements[0]*=p,si.elements[1]*=p,si.elements[2]*=p,si.elements[4]*=g,si.elements[5]*=g,si.elements[6]*=g,si.elements[8]*=y,si.elements[9]*=y,si.elements[10]*=y,t.setFromRotationMatrix(si),s.x=l,s.y=u,s.z=d,this}makePerspective(e,t,s,o,l,u,d=zi){const m=this.elements,p=2*l/(t-e),g=2*l/(s-o),y=(t+e)/(t-e),_=(s+o)/(s-o);let M,E;if(d===zi)M=-(u+l)/(u-l),E=-2*u*l/(u-l);else if(d===Xl)M=-u/(u-l),E=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return m[0]=p,m[4]=0,m[8]=y,m[12]=0,m[1]=0,m[5]=g,m[9]=_,m[13]=0,m[2]=0,m[6]=0,m[10]=M,m[14]=E,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,t,s,o,l,u,d=zi){const m=this.elements,p=1/(t-e),g=1/(s-o),y=1/(u-l),_=(t+e)*p,M=(s+o)*g;let E,w;if(d===zi)E=(u+l)*y,w=-2*y;else if(d===Xl)E=l*y,w=-1*y;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-_,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-M,m[2]=0,m[6]=0,m[10]=w,m[14]=-E,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<16;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<16;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e[t+9]=s[9],e[t+10]=s[10],e[t+11]=s[11],e[t+12]=s[12],e[t+13]=s[13],e[t+14]=s[14],e[t+15]=s[15],e}}const Us=new oe,si=new Bt,lS=new oe(0,0,0),cS=new oe(1,1,1),pr=new oe,Ml=new oe,Fn=new oe,Nm=new Bt,Pm=new io;class Si{constructor(e=0,t=0,s=0,o=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=s,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,s,o=this._order){return this._x=e,this._y=t,this._z=s,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,s=!0){const o=e.elements,l=o[0],u=o[4],d=o[8],m=o[1],p=o[5],g=o[9],y=o[2],_=o[6],M=o[10];switch(t){case"XYZ":this._y=Math.asin(bn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(_,p),this._z=0);break;case"YXZ":this._x=Math.asin(-bn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-y,l),this._z=0);break;case"ZXY":this._x=Math.asin(bn(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(-y,M),this._z=Math.atan2(-u,p)):(this._y=0,this._z=Math.atan2(m,l));break;case"ZYX":this._y=Math.asin(-bn(y,-1,1)),Math.abs(y)<.9999999?(this._x=Math.atan2(_,M),this._z=Math.atan2(m,l)):(this._x=0,this._z=Math.atan2(-u,p));break;case"YZX":this._z=Math.asin(bn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-y,l)):(this._x=0,this._y=Math.atan2(d,M));break;case"XZY":this._z=Math.asin(-bn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(_,p),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,s){return Nm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nm,t,s)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Pm.setFromEuler(this),this.setFromQuaternion(Pm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class Qg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let uS=0;const Lm=new oe,Is=new io,Ui=new Bt,El=new oe,Xa=new oe,dS=new oe,fS=new io,Dm=new oe(1,0,0),Um=new oe(0,1,0),Im=new oe(0,0,1),Fm={type:"added"},hS={type:"removed"},Fs={type:"childadded",child:null},od={type:"childremoved",child:null};class gn extends ra{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:uS++}),this.uuid=no(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gn.DEFAULT_UP.clone();const e=new oe,t=new Si,s=new io,o=new oe(1,1,1);function l(){s.setFromEuler(t,!1)}function u(){t.setFromQuaternion(s,void 0,!1)}t._onChange(l),s._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Bt},normalMatrix:{value:new ct}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(Dm,e)}rotateY(e){return this.rotateOnAxis(Um,e)}rotateZ(e){return this.rotateOnAxis(Im,e)}translateOnAxis(e,t){return Lm.copy(e).applyQuaternion(this.quaternion),this.position.add(Lm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Dm,e)}translateY(e){return this.translateOnAxis(Um,e)}translateZ(e){return this.translateOnAxis(Im,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,s){e.isVector3?El.copy(e):El.set(e,t,s);const o=this.parent;this.updateWorldMatrix(!0,!1),Xa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(Xa,El,this.up):Ui.lookAt(El,Xa,this.up),this.quaternion.setFromRotationMatrix(Ui),o&&(Ui.extractRotation(o.matrixWorld),Is.setFromRotationMatrix(Ui),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(hS),od.child=e,this.dispatchEvent(od),od.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let s=0,o=this.children.length;s<o;s++){const u=this.children[s].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,s=[]){this[e]===t&&s.push(this);const o=this.children;for(let l=0,u=o.length;l<u;l++)o[l].getObjectsByProperty(e,t,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,e,dS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,fS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let s=0,o=t.length;s<o;s++){const l=t[s];(l.matrixWorldAutoUpdate===!0||e===!0)&&l.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const s=this.parent;if(e===!0&&s!==null&&s.matrixWorldAutoUpdate===!0&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const o=this.children;for(let l=0,u=o.length;l<u;l++){const d=o[l];d.matrixWorldAutoUpdate===!0&&d.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",s={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),o.maxGeometryCount=this._maxGeometryCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function l(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const y=m[p];l(e.shapes,y)}else l(e.shapes,m)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(l(e.materials,this.material[m]));o.material=d}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let d=0;d<this.children.length;d++)o.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];o.animations.push(l(e.animations,m))}}if(t){const d=u(e.geometries),m=u(e.materials),p=u(e.textures),g=u(e.images),y=u(e.shapes),_=u(e.skeletons),M=u(e.animations),E=u(e.nodes);d.length>0&&(s.geometries=d),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),y.length>0&&(s.shapes=y),_.length>0&&(s.skeletons=_),M.length>0&&(s.animations=M),E.length>0&&(s.nodes=E)}return s.object=o,s;function u(d){const m=[];for(const p in d){const g=d[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let s=0;s<e.children.length;s++){const o=e.children[s];this.add(o.clone())}return this}}gn.DEFAULT_UP=new oe(0,1,0);gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ai=new oe,Ii=new oe,ld=new oe,Fi=new oe,Os=new oe,ks=new oe,Om=new oe,cd=new oe,ud=new oe,dd=new oe;class gi{constructor(e=new oe,t=new oe,s=new oe){this.a=e,this.b=t,this.c=s}static getNormal(e,t,s,o){o.subVectors(s,t),ai.subVectors(e,t),o.cross(ai);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,t,s,o,l){ai.subVectors(o,t),Ii.subVectors(s,t),ld.subVectors(e,t);const u=ai.dot(ai),d=ai.dot(Ii),m=ai.dot(ld),p=Ii.dot(Ii),g=Ii.dot(ld),y=u*p-d*d;if(y===0)return l.set(0,0,0),null;const _=1/y,M=(p*m-d*g)*_,E=(u*g-d*m)*_;return l.set(1-M-E,E,M)}static containsPoint(e,t,s,o){return this.getBarycoord(e,t,s,o,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,s,o,l,u,d,m){return this.getBarycoord(e,t,s,o,Fi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(l,Fi.x),m.addScaledVector(u,Fi.y),m.addScaledVector(d,Fi.z),m)}static isFrontFacing(e,t,s,o){return ai.subVectors(s,t),Ii.subVectors(e,t),ai.cross(Ii).dot(o)<0}set(e,t,s){return this.a.copy(e),this.b.copy(t),this.c.copy(s),this}setFromPointsAndIndices(e,t,s,o){return this.a.copy(e[t]),this.b.copy(e[s]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,s,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ai.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),ai.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,s,o,l){return gi.getInterpolation(e,this.a,this.b,this.c,t,s,o,l)}containsPoint(e){return gi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const s=this.a,o=this.b,l=this.c;let u,d;Os.subVectors(o,s),ks.subVectors(l,s),cd.subVectors(e,s);const m=Os.dot(cd),p=ks.dot(cd);if(m<=0&&p<=0)return t.copy(s);ud.subVectors(e,o);const g=Os.dot(ud),y=ks.dot(ud);if(g>=0&&y<=g)return t.copy(o);const _=m*y-g*p;if(_<=0&&m>=0&&g<=0)return u=m/(m-g),t.copy(s).addScaledVector(Os,u);dd.subVectors(e,l);const M=Os.dot(dd),E=ks.dot(dd);if(E>=0&&M<=E)return t.copy(l);const w=M*p-m*E;if(w<=0&&p>=0&&E<=0)return d=p/(p-E),t.copy(s).addScaledVector(ks,d);const S=g*E-M*y;if(S<=0&&y-g>=0&&M-E>=0)return Om.subVectors(l,o),d=(y-g)/(y-g+(M-E)),t.copy(o).addScaledVector(Om,d);const x=1/(S+w+_);return u=w*x,d=_*x,t.copy(s).addScaledVector(Os,u).addScaledVector(ks,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Jg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},wl={h:0,s:0,l:0};function fd(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Mt{constructor(e,t,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,s)}set(e,t,s){if(t===void 0&&s===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.toWorkingColorSpace(this,t),this}setRGB(e,t,s,o=Tt.workingColorSpace){return this.r=e,this.g=t,this.b=s,Tt.toWorkingColorSpace(this,o),this}setHSL(e,t,s,o=Tt.workingColorSpace){if(e=Zy(e,1),t=bn(t,0,1),s=bn(s,0,1),t===0)this.r=this.g=this.b=s;else{const l=s<=.5?s*(1+t):s+t-s*t,u=2*s-l;this.r=fd(u,l,e+1/3),this.g=fd(u,l,e),this.b=fd(u,l,e-1/3)}return Tt.toWorkingColorSpace(this,o),this}setStyle(e,t=hi){function s(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=o[1],d=o[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const s=Jg[e.toLowerCase()];return s!==void 0?this.setHex(s,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}copyLinearToSRGB(e){return this.r=Ju(e.r),this.g=Ju(e.g),this.b=Ju(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return Tt.fromWorkingColorSpace(pn.copy(this),e),Math.round(bn(pn.r*255,0,255))*65536+Math.round(bn(pn.g*255,0,255))*256+Math.round(bn(pn.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Tt.workingColorSpace){Tt.fromWorkingColorSpace(pn.copy(this),t);const s=pn.r,o=pn.g,l=pn.b,u=Math.max(s,o,l),d=Math.min(s,o,l);let m,p;const g=(d+u)/2;if(d===u)m=0,p=0;else{const y=u-d;switch(p=g<=.5?y/(u+d):y/(2-u-d),u){case s:m=(o-l)/y+(o<l?6:0);break;case o:m=(l-s)/y+2;break;case l:m=(s-o)/y+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,t=Tt.workingColorSpace){return Tt.fromWorkingColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=hi){Tt.fromWorkingColorSpace(pn.copy(this),e);const t=pn.r,s=pn.g,o=pn.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(s*255)},${Math.round(o*255)})`}offsetHSL(e,t,s){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,s){return this.r=e.r+(t.r-e.r)*s,this.g=e.g+(t.g-e.g)*s,this.b=e.b+(t.b-e.b)*s,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(wl);const s=Zu(mr.h,wl.h,t),o=Zu(mr.s,wl.s,t),l=Zu(mr.l,wl.l,t);return this.setHSL(s,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,s=this.g,o=this.b,l=e.elements;return this.r=l[0]*t+l[3]*s+l[6]*o,this.g=l[1]*t+l[4]*s+l[7]*o,this.b=l[2]*t+l[5]*s+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pn=new Mt;Mt.NAMES=Jg;let pS=0;class ro extends ra{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pS++}),this.uuid=no(),this.name="",this.type="Material",this.blending=qs,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rd,this.blendDst=Nd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Mt(0,0,0),this.blendAlpha=0,this.depthFunc=jl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Em,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const s=e[t];if(s===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(s):o&&o.isVector3&&s&&s.isVector3?o.copy(s):this[t]=s}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==qs&&(s.blending=this.blending),this.side!==Sr&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Rd&&(s.blendSrc=this.blendSrc),this.blendDst!==Nd&&(s.blendDst=this.blendDst),this.blendEquation!==qr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==jl&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Em&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function o(l){const u=[];for(const d in l){const m=l[d];delete m.metadata,u.push(m)}return u}if(t){const l=o(e.textures),u=o(e.images);l.length>0&&(s.textures=l),u.length>0&&(s.images=u)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let s=null;if(t!==null){const o=t.length;s=new Array(o);for(let l=0;l!==o;++l)s[l]=t[l].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ev extends ro{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=kg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const jt=new oe,Tl=new _t;class Bn{constructor(e,t,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=s,this.usage=wm,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Jy("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,s){e*=this.itemSize,s*=t.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=t.array[s+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,s=this.count;t<s;t++)Tl.fromBufferAttribute(this,t),Tl.applyMatrix3(e),this.setXY(t,Tl.x,Tl.y);else if(this.itemSize===3)for(let t=0,s=this.count;t<s;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix3(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyMatrix4(e){for(let t=0,s=this.count;t<s;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix4(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let t=0,s=this.count;t<s;t++)jt.fromBufferAttribute(this,t),jt.applyNormalMatrix(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let t=0,s=this.count;t<s;t++)jt.fromBufferAttribute(this,t),jt.transformDirection(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let s=this.array[e*this.itemSize+t];return this.normalized&&(s=Va(s,this.array)),s}setComponent(e,t,s){return this.normalized&&(s=Cn(s,this.array)),this.array[e*this.itemSize+t]=s,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Va(t,this.array)),t}setX(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Va(t,this.array)),t}setY(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Va(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Va(t,this.array)),t}setW(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,s){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array)),this.array[e+0]=t,this.array[e+1]=s,this}setXYZ(e,t,s,o){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this}setXYZW(e,t,s,o,l){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array),l=Cn(l,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==wm&&(e.usage=this.usage),e}}class tv extends Bn{constructor(e,t,s){super(new Uint16Array(e),t,s)}}class nv extends Bn{constructor(e,t,s){super(new Uint32Array(e),t,s)}}class Bi extends Bn{constructor(e,t,s){super(new Float32Array(e),t,s)}}let mS=0;const $n=new Bt,hd=new gn,zs=new oe,On=new sa,$a=new sa,nn=new oe;class ji extends ra{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mS++}),this.uuid=no(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yg(e)?nv:tv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,s=0){this.groups.push({start:e,count:t,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const l=new ct().getNormalMatrix(e);s.applyNormalMatrix(l),s.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $n.makeRotationFromQuaternion(e),this.applyMatrix4($n),this}rotateX(e){return $n.makeRotationX(e),this.applyMatrix4($n),this}rotateY(e){return $n.makeRotationY(e),this.applyMatrix4($n),this}rotateZ(e){return $n.makeRotationZ(e),this.applyMatrix4($n),this}translate(e,t,s){return $n.makeTranslation(e,t,s),this.applyMatrix4($n),this}scale(e,t,s){return $n.makeScale(e,t,s),this.applyMatrix4($n),this}lookAt(e){return hd.lookAt(e),hd.updateMatrix(),this.applyMatrix4(hd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){const t=[];for(let s=0,o=e.length;s<o;s++){const l=e[s];t.push(l.x,l.y,l.z||0)}return this.setAttribute("position",new Bi(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new oe(-1/0,-1/0,-1/0),new oe(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const l=t[s];On.setFromBufferAttribute(l),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,On.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,On.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(On.min),this.boundingBox.expandByPoint(On.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qd);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new oe,1/0);return}if(e){const s=this.boundingSphere.center;if(On.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const d=t[l];$a.setFromBufferAttribute(d),this.morphTargetsRelative?(nn.addVectors(On.min,$a.min),On.expandByPoint(nn),nn.addVectors(On.max,$a.max),On.expandByPoint(nn)):(On.expandByPoint($a.min),On.expandByPoint($a.max))}On.getCenter(s);let o=0;for(let l=0,u=e.count;l<u;l++)nn.fromBufferAttribute(e,l),o=Math.max(o,s.distanceToSquared(nn));if(t)for(let l=0,u=t.length;l<u;l++){const d=t[l],m=this.morphTargetsRelative;for(let p=0,g=d.count;p<g;p++)nn.fromBufferAttribute(d,p),m&&(zs.fromBufferAttribute(e,p),nn.add(zs)),o=Math.max(o,s.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=t.position,o=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*s.count),4));const u=this.getAttribute("tangent"),d=[],m=[];for(let j=0;j<s.count;j++)d[j]=new oe,m[j]=new oe;const p=new oe,g=new oe,y=new oe,_=new _t,M=new _t,E=new _t,w=new oe,S=new oe;function x(j,C,A){p.fromBufferAttribute(s,j),g.fromBufferAttribute(s,C),y.fromBufferAttribute(s,A),_.fromBufferAttribute(l,j),M.fromBufferAttribute(l,C),E.fromBufferAttribute(l,A),g.sub(p),y.sub(p),M.sub(_),E.sub(_);const V=1/(M.x*E.y-E.x*M.y);isFinite(V)&&(w.copy(g).multiplyScalar(E.y).addScaledVector(y,-M.y).multiplyScalar(V),S.copy(y).multiplyScalar(M.x).addScaledVector(g,-E.x).multiplyScalar(V),d[j].add(w),d[C].add(w),d[A].add(w),m[j].add(S),m[C].add(S),m[A].add(S))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let j=0,C=b.length;j<C;++j){const A=b[j],V=A.start,G=A.count;for(let z=V,ne=V+G;z<ne;z+=3)x(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const R=new oe,D=new oe,X=new oe,I=new oe;function L(j){X.fromBufferAttribute(o,j),I.copy(X);const C=d[j];R.copy(C),R.sub(X.multiplyScalar(X.dot(C))).normalize(),D.crossVectors(I,C);const V=D.dot(m[j])<0?-1:1;u.setXYZW(j,R.x,R.y,R.z,V)}for(let j=0,C=b.length;j<C;++j){const A=b[j],V=A.start,G=A.count;for(let z=V,ne=V+G;z<ne;z+=3)L(e.getX(z+0)),L(e.getX(z+1)),L(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",s);else for(let _=0,M=s.count;_<M;_++)s.setXYZ(_,0,0,0);const o=new oe,l=new oe,u=new oe,d=new oe,m=new oe,p=new oe,g=new oe,y=new oe;if(e)for(let _=0,M=e.count;_<M;_+=3){const E=e.getX(_+0),w=e.getX(_+1),S=e.getX(_+2);o.fromBufferAttribute(t,E),l.fromBufferAttribute(t,w),u.fromBufferAttribute(t,S),g.subVectors(u,l),y.subVectors(o,l),g.cross(y),d.fromBufferAttribute(s,E),m.fromBufferAttribute(s,w),p.fromBufferAttribute(s,S),d.add(g),m.add(g),p.add(g),s.setXYZ(E,d.x,d.y,d.z),s.setXYZ(w,m.x,m.y,m.z),s.setXYZ(S,p.x,p.y,p.z)}else for(let _=0,M=t.count;_<M;_+=3)o.fromBufferAttribute(t,_+0),l.fromBufferAttribute(t,_+1),u.fromBufferAttribute(t,_+2),g.subVectors(u,l),y.subVectors(o,l),g.cross(y),s.setXYZ(_+0,g.x,g.y,g.z),s.setXYZ(_+1,g.x,g.y,g.z),s.setXYZ(_+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,s=e.count;t<s;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(d,m){const p=d.array,g=d.itemSize,y=d.normalized,_=new p.constructor(m.length*g);let M=0,E=0;for(let w=0,S=m.length;w<S;w++){d.isInterleavedBufferAttribute?M=m[w]*d.data.stride+d.offset:M=m[w]*g;for(let x=0;x<g;x++)_[E++]=p[M++]}return new Bn(_,g,y)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ji,s=this.index.array,o=this.attributes;for(const d in o){const m=o[d],p=e(m,s);t.setAttribute(d,p)}const l=this.morphAttributes;for(const d in l){const m=[],p=l[d];for(let g=0,y=p.length;g<y;g++){const _=p[g],M=e(_,s);m.push(M)}t.morphAttributes[d]=m}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let d=0,m=u.length;d<m;d++){const p=u[d];t.addGroup(p.start,p.count,p.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const s=this.attributes;for(const m in s){const p=s[m];e.data.attributes[m]=p.toJSON(e.data)}const o={};let l=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let y=0,_=p.length;y<_;y++){const M=p[y];g.push(M.toJSON(e.data))}g.length>0&&(o[m]=g,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(t));const o=e.attributes;for(const p in o){const g=o[p];this.setAttribute(p,g.clone(t))}const l=e.morphAttributes;for(const p in l){const g=[],y=l[p];for(let _=0,M=y.length;_<M;_++)g.push(y[_].clone(t));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let p=0,g=u.length;p<g;p++){const y=u[p];this.addGroup(y.start,y.count,y.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const km=new Bt,jr=new oS,Al=new qd,zm=new oe,Bs=new oe,Hs=new oe,js=new oe,pd=new oe,Cl=new oe,bl=new _t,Rl=new _t,Nl=new _t,Bm=new oe,Hm=new oe,jm=new oe,Pl=new oe,Ll=new oe;class _i extends gn{constructor(e=new ji,t=new ev){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,s=Object.keys(t);if(s.length>0){const o=t[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=o.length;l<u;l++){const d=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const s=this.geometry,o=s.attributes.position,l=s.morphAttributes.position,u=s.morphTargetsRelative;t.fromBufferAttribute(o,e);const d=this.morphTargetInfluences;if(l&&d){Cl.set(0,0,0);for(let m=0,p=l.length;m<p;m++){const g=d[m],y=l[m];g!==0&&(pd.fromBufferAttribute(y,e),u?Cl.addScaledVector(pd,g):Cl.addScaledVector(pd.sub(t),g))}t.add(Cl)}return t}raycast(e,t){const s=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Al.copy(s.boundingSphere),Al.applyMatrix4(l),jr.copy(e.ray).recast(e.near),!(Al.containsPoint(jr.origin)===!1&&(jr.intersectSphere(Al,zm)===null||jr.origin.distanceToSquared(zm)>(e.far-e.near)**2))&&(km.copy(l).invert(),jr.copy(e.ray).applyMatrix4(km),!(s.boundingBox!==null&&jr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,t,jr)))}_computeIntersections(e,t,s){let o;const l=this.geometry,u=this.material,d=l.index,m=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,y=l.attributes.normal,_=l.groups,M=l.drawRange;if(d!==null)if(Array.isArray(u))for(let E=0,w=_.length;E<w;E++){const S=_[E],x=u[S.materialIndex],b=Math.max(S.start,M.start),R=Math.min(d.count,Math.min(S.start+S.count,M.start+M.count));for(let D=b,X=R;D<X;D+=3){const I=d.getX(D),L=d.getX(D+1),j=d.getX(D+2);o=Dl(this,x,e,s,p,g,y,I,L,j),o&&(o.faceIndex=Math.floor(D/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(d.count,M.start+M.count);for(let S=E,x=w;S<x;S+=3){const b=d.getX(S),R=d.getX(S+1),D=d.getX(S+2);o=Dl(this,u,e,s,p,g,y,b,R,D),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}else if(m!==void 0)if(Array.isArray(u))for(let E=0,w=_.length;E<w;E++){const S=_[E],x=u[S.materialIndex],b=Math.max(S.start,M.start),R=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let D=b,X=R;D<X;D+=3){const I=D,L=D+1,j=D+2;o=Dl(this,x,e,s,p,g,y,I,L,j),o&&(o.faceIndex=Math.floor(D/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(m.count,M.start+M.count);for(let S=E,x=w;S<x;S+=3){const b=S,R=S+1,D=S+2;o=Dl(this,u,e,s,p,g,y,b,R,D),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}}}function gS(r,e,t,s,o,l,u,d){let m;if(e.side===Rn?m=s.intersectTriangle(u,l,o,!0,d):m=s.intersectTriangle(o,l,u,e.side===Sr,d),m===null)return null;Ll.copy(d),Ll.applyMatrix4(r.matrixWorld);const p=t.ray.origin.distanceTo(Ll);return p<t.near||p>t.far?null:{distance:p,point:Ll.clone(),object:r}}function Dl(r,e,t,s,o,l,u,d,m,p){r.getVertexPosition(d,Bs),r.getVertexPosition(m,Hs),r.getVertexPosition(p,js);const g=gS(r,e,t,s,Bs,Hs,js,Pl);if(g){o&&(bl.fromBufferAttribute(o,d),Rl.fromBufferAttribute(o,m),Nl.fromBufferAttribute(o,p),g.uv=gi.getInterpolation(Pl,Bs,Hs,js,bl,Rl,Nl,new _t)),l&&(bl.fromBufferAttribute(l,d),Rl.fromBufferAttribute(l,m),Nl.fromBufferAttribute(l,p),g.uv1=gi.getInterpolation(Pl,Bs,Hs,js,bl,Rl,Nl,new _t)),u&&(Bm.fromBufferAttribute(u,d),Hm.fromBufferAttribute(u,m),jm.fromBufferAttribute(u,p),g.normal=gi.getInterpolation(Pl,Bs,Hs,js,Bm,Hm,jm,new oe),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const y={a:d,b:m,c:p,normal:new oe,materialIndex:0};gi.getNormal(Bs,Hs,js,y.normal),g.face=y}return g}class so extends ji{constructor(e=1,t=1,s=1,o=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:s,widthSegments:o,heightSegments:l,depthSegments:u};const d=this;o=Math.floor(o),l=Math.floor(l),u=Math.floor(u);const m=[],p=[],g=[],y=[];let _=0,M=0;E("z","y","x",-1,-1,s,t,e,u,l,0),E("z","y","x",1,-1,s,t,-e,u,l,1),E("x","z","y",1,1,e,s,t,o,u,2),E("x","z","y",1,-1,e,s,-t,o,u,3),E("x","y","z",1,-1,e,t,s,o,l,4),E("x","y","z",-1,-1,e,t,-s,o,l,5),this.setIndex(m),this.setAttribute("position",new Bi(p,3)),this.setAttribute("normal",new Bi(g,3)),this.setAttribute("uv",new Bi(y,2));function E(w,S,x,b,R,D,X,I,L,j,C){const A=D/L,V=X/j,G=D/2,z=X/2,ne=I/2,Y=L+1,ue=j+1;let fe=0,k=0;const de=new oe;for(let te=0;te<ue;te++){const O=te*V-z;for(let ae=0;ae<Y;ae++){const Ue=ae*A-G;de[w]=Ue*b,de[S]=O*R,de[x]=ne,p.push(de.x,de.y,de.z),de[w]=0,de[S]=0,de[x]=I>0?1:-1,g.push(de.x,de.y,de.z),y.push(ae/L),y.push(1-te/j),fe+=1}}for(let te=0;te<j;te++)for(let O=0;O<L;O++){const ae=_+O+Y*te,Ue=_+O+Y*(te+1),Q=_+(O+1)+Y*(te+1),pe=_+(O+1)+Y*te;m.push(ae,Ue,pe),m.push(Ue,Q,pe),k+=6}d.addGroup(M,k,C),M+=k,_+=fe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new so(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function na(r){const e={};for(const t in r){e[t]={};for(const s in r[t]){const o=r[t][s];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][s]=null):e[t][s]=o.clone():Array.isArray(o)?e[t][s]=o.slice():e[t][s]=o}}return e}function xn(r){const e={};for(let t=0;t<r.length;t++){const s=na(r[t]);for(const o in s)e[o]=s[o]}return e}function vS(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function iv(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}const _S={clone:na,merge:xn};var xS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Er extends ro{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xS,this.fragmentShader=yS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=na(e.uniforms),this.uniformsGroups=vS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const u=this.uniforms[o].value;u&&u.isTexture?t.uniforms[o]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[o]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[o]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[o]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[o]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[o]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[o]={type:"m4",value:u.toArray()}:t.uniforms[o]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const s={};for(const o in this.extensions)this.extensions[o]===!0&&(s[o]=!0);return Object.keys(s).length>0&&(t.extensions=s),t}}class rv extends gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=zi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gr=new oe,Vm=new _t,Gm=new _t;class qn extends rv{constructor(e=50,t=1,s=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Id*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ku*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Id*2*Math.atan(Math.tan(Ku*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,s){gr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gr.x,gr.y).multiplyScalar(-e/gr.z),gr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(gr.x,gr.y).multiplyScalar(-e/gr.z)}getViewSize(e,t){return this.getViewBounds(e,Vm,Gm),t.subVectors(Gm,Vm)}setViewOffset(e,t,s,o,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ku*.5*this.fov)/this.zoom,s=2*t,o=this.aspect*s,l=-.5*o;const u=this.view;if(this.view!==null&&this.view.enabled){const m=u.fullWidth,p=u.fullHeight;l+=u.offsetX*o/m,t-=u.offsetY*s/p,o*=u.width/m,s*=u.height/p}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,t,t-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Vs=-90,Gs=1;class SS extends gn{constructor(e,t,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new qn(Vs,Gs,e,t);o.layers=this.layers,this.add(o);const l=new qn(Vs,Gs,e,t);l.layers=this.layers,this.add(l);const u=new qn(Vs,Gs,e,t);u.layers=this.layers,this.add(u);const d=new qn(Vs,Gs,e,t);d.layers=this.layers,this.add(d);const m=new qn(Vs,Gs,e,t);m.layers=this.layers,this.add(m);const p=new qn(Vs,Gs,e,t);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[s,o,l,u,d,m]=t;for(const p of t)this.remove(p);if(e===zi)s.up.set(0,1,0),s.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===Xl)s.up.set(0,-1,0),s.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of t)this.add(p),p.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,d,m,p,g]=this.children,y=e.getRenderTarget(),_=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const w=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,o),e.render(t,l),e.setRenderTarget(s,1,o),e.render(t,u),e.setRenderTarget(s,2,o),e.render(t,d),e.setRenderTarget(s,3,o),e.render(t,m),e.setRenderTarget(s,4,o),e.render(t,p),s.texture.generateMipmaps=w,e.setRenderTarget(s,5,o),e.render(t,g),e.setRenderTarget(y,_,M),e.xr.enabled=E,s.texture.needsPMREMUpdate=!0}}class sv extends Nn{constructor(e,t,s,o,l,u,d,m,p,g){e=e!==void 0?e:[],t=t!==void 0?t:Js,super(e,t,s,o,l,u,d,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class MS extends ns{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},o=[s,s,s,s,s,s];this.texture=new sv(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:oi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},o=new so(5,5,5),l=new Er({name:"CubemapFromEquirect",uniforms:na(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Rn,blending:xr});l.uniforms.tEquirect.value=t;const u=new _i(o,l),d=t.minFilter;return t.minFilter===Qr&&(t.minFilter=oi),new SS(1,10,this).update(e,u),t.minFilter=d,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,s,o){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,s,o);e.setRenderTarget(l)}}const md=new oe,ES=new oe,wS=new ct;class Xr{constructor(e=new oe(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,s,o){return this.normal.set(e,t,s),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,s){const o=md.subVectors(s,t).cross(ES.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const s=e.delta(md),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/o;return l<0||l>1?null:t.copy(e.start).addScaledVector(s,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return t<0&&s>0||s<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const s=t||wS.getNormalMatrix(e),o=this.coplanarPoint(md).applyMatrix4(e),l=this.normal.applyMatrix3(s).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new qd,Ul=new oe;class Yd{constructor(e=new Xr,t=new Xr,s=new Xr,o=new Xr,l=new Xr,u=new Xr){this.planes=[e,t,s,o,l,u]}set(e,t,s,o,l,u){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(s),d[3].copy(o),d[4].copy(l),d[5].copy(u),this}copy(e){const t=this.planes;for(let s=0;s<6;s++)t[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,t=zi){const s=this.planes,o=e.elements,l=o[0],u=o[1],d=o[2],m=o[3],p=o[4],g=o[5],y=o[6],_=o[7],M=o[8],E=o[9],w=o[10],S=o[11],x=o[12],b=o[13],R=o[14],D=o[15];if(s[0].setComponents(m-l,_-p,S-M,D-x).normalize(),s[1].setComponents(m+l,_+p,S+M,D+x).normalize(),s[2].setComponents(m+u,_+g,S+E,D+b).normalize(),s[3].setComponents(m-u,_-g,S-E,D-b).normalize(),s[4].setComponents(m-d,_-y,S-w,D-R).normalize(),t===zi)s[5].setComponents(m+d,_+y,S+w,D+R).normalize();else if(t===Xl)s[5].setComponents(d,y,w,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const t=this.planes,s=e.center,o=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(s)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let s=0;s<6;s++){const o=t[s];if(Ul.x=o.normal.x>0?e.max.x:e.min.x,Ul.y=o.normal.y>0?e.max.y:e.min.y,Ul.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Ul)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let s=0;s<6;s++)if(t[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function av(){let r=null,e=!1,t=null,s=null;function o(l,u){t(l,u),s=r.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(s=r.requestAnimationFrame(o),e=!0)},stop:function(){r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){r=l}}}function TS(r){const e=new WeakMap;function t(d,m){const p=d.array,g=d.usage,y=p.byteLength,_=r.createBuffer();r.bindBuffer(m,_),r.bufferData(m,p,g),d.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:_,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:y}}function s(d,m,p){const g=m.array,y=m._updateRange,_=m.updateRanges;if(r.bindBuffer(p,d),y.count===-1&&_.length===0&&r.bufferSubData(p,0,g),_.length!==0){for(let M=0,E=_.length;M<E;M++){const w=_[M];r.bufferSubData(p,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}m.clearUpdateRanges()}y.count!==-1&&(r.bufferSubData(p,y.offset*g.BYTES_PER_ELEMENT,g,y.offset,y.count),y.count=-1),m.onUploadCallback()}function o(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const m=e.get(d);m&&(r.deleteBuffer(m.buffer),e.delete(d))}function u(d,m){if(d.isGLBufferAttribute){const g=e.get(d);(!g||g.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}d.isInterleavedBufferAttribute&&(d=d.data);const p=e.get(d);if(p===void 0)e.set(d,t(d,m));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,d,m),p.version=d.version}}return{get:o,remove:l,update:u}}class ec extends ji{constructor(e=1,t=1,s=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:s,heightSegments:o};const l=e/2,u=t/2,d=Math.floor(s),m=Math.floor(o),p=d+1,g=m+1,y=e/d,_=t/m,M=[],E=[],w=[],S=[];for(let x=0;x<g;x++){const b=x*_-u;for(let R=0;R<p;R++){const D=R*y-l;E.push(D,-b,0),w.push(0,0,1),S.push(R/d),S.push(1-x/m)}}for(let x=0;x<m;x++)for(let b=0;b<d;b++){const R=b+p*x,D=b+p*(x+1),X=b+1+p*(x+1),I=b+1+p*x;M.push(R,D,I),M.push(D,X,I)}this.setIndex(M),this.setAttribute("position",new Bi(E,3)),this.setAttribute("normal",new Bi(w,3)),this.setAttribute("uv",new Bi(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ec(e.width,e.height,e.widthSegments,e.heightSegments)}}var AS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,CS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,bS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,RS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,NS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,PS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,LS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,DS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,US=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,IS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,FS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,OS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,kS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,zS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,BS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,HS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,jS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,VS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,GS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,WS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,XS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,$S=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,qS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,YS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,KS=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ZS=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,QS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,JS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,eM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nM="gl_FragColor = linearToOutputTexel( gl_FragColor );",iM=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,rM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,sM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,aM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,oM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,cM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,pM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,_M=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,xM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,SM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,MM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,EM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,wM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,TM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,AM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,CM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,RM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,NM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,PM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,LM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,DM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,UM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,IM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,FM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,OM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zM=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,BM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,HM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,jM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,VM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,GM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,WM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,XM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$M=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,YM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,KM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ZM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,QM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,JM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,eE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,tE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,iE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,aE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,oE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,lE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,cE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,uE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,hE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,mE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_E=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,xE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,yE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,SE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ME=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,EE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const TE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,AE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,NE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,LE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,DE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,UE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,IE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,FE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,OE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,BE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,GE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,XE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$E=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,KE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ZE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ew=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,iw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lt={alphahash_fragment:AS,alphahash_pars_fragment:CS,alphamap_fragment:bS,alphamap_pars_fragment:RS,alphatest_fragment:NS,alphatest_pars_fragment:PS,aomap_fragment:LS,aomap_pars_fragment:DS,batching_pars_vertex:US,batching_vertex:IS,begin_vertex:FS,beginnormal_vertex:OS,bsdfs:kS,iridescence_fragment:zS,bumpmap_pars_fragment:BS,clipping_planes_fragment:HS,clipping_planes_pars_fragment:jS,clipping_planes_pars_vertex:VS,clipping_planes_vertex:GS,color_fragment:WS,color_pars_fragment:XS,color_pars_vertex:$S,color_vertex:qS,common:YS,cube_uv_reflection_fragment:KS,defaultnormal_vertex:ZS,displacementmap_pars_vertex:QS,displacementmap_vertex:JS,emissivemap_fragment:eM,emissivemap_pars_fragment:tM,colorspace_fragment:nM,colorspace_pars_fragment:iM,envmap_fragment:rM,envmap_common_pars_fragment:sM,envmap_pars_fragment:aM,envmap_pars_vertex:oM,envmap_physical_pars_fragment:_M,envmap_vertex:lM,fog_vertex:cM,fog_pars_vertex:uM,fog_fragment:dM,fog_pars_fragment:fM,gradientmap_pars_fragment:hM,lightmap_pars_fragment:pM,lights_lambert_fragment:mM,lights_lambert_pars_fragment:gM,lights_pars_begin:vM,lights_toon_fragment:xM,lights_toon_pars_fragment:yM,lights_phong_fragment:SM,lights_phong_pars_fragment:MM,lights_physical_fragment:EM,lights_physical_pars_fragment:wM,lights_fragment_begin:TM,lights_fragment_maps:AM,lights_fragment_end:CM,logdepthbuf_fragment:bM,logdepthbuf_pars_fragment:RM,logdepthbuf_pars_vertex:NM,logdepthbuf_vertex:PM,map_fragment:LM,map_pars_fragment:DM,map_particle_fragment:UM,map_particle_pars_fragment:IM,metalnessmap_fragment:FM,metalnessmap_pars_fragment:OM,morphinstance_vertex:kM,morphcolor_vertex:zM,morphnormal_vertex:BM,morphtarget_pars_vertex:HM,morphtarget_vertex:jM,normal_fragment_begin:VM,normal_fragment_maps:GM,normal_pars_fragment:WM,normal_pars_vertex:XM,normal_vertex:$M,normalmap_pars_fragment:qM,clearcoat_normal_fragment_begin:YM,clearcoat_normal_fragment_maps:KM,clearcoat_pars_fragment:ZM,iridescence_pars_fragment:QM,opaque_fragment:JM,packing:eE,premultiplied_alpha_fragment:tE,project_vertex:nE,dithering_fragment:iE,dithering_pars_fragment:rE,roughnessmap_fragment:sE,roughnessmap_pars_fragment:aE,shadowmap_pars_fragment:oE,shadowmap_pars_vertex:lE,shadowmap_vertex:cE,shadowmask_pars_fragment:uE,skinbase_vertex:dE,skinning_pars_vertex:fE,skinning_vertex:hE,skinnormal_vertex:pE,specularmap_fragment:mE,specularmap_pars_fragment:gE,tonemapping_fragment:vE,tonemapping_pars_fragment:_E,transmission_fragment:xE,transmission_pars_fragment:yE,uv_pars_fragment:SE,uv_pars_vertex:ME,uv_vertex:EE,worldpos_vertex:wE,background_vert:TE,background_frag:AE,backgroundCube_vert:CE,backgroundCube_frag:bE,cube_vert:RE,cube_frag:NE,depth_vert:PE,depth_frag:LE,distanceRGBA_vert:DE,distanceRGBA_frag:UE,equirect_vert:IE,equirect_frag:FE,linedashed_vert:OE,linedashed_frag:kE,meshbasic_vert:zE,meshbasic_frag:BE,meshlambert_vert:HE,meshlambert_frag:jE,meshmatcap_vert:VE,meshmatcap_frag:GE,meshnormal_vert:WE,meshnormal_frag:XE,meshphong_vert:$E,meshphong_frag:qE,meshphysical_vert:YE,meshphysical_frag:KE,meshtoon_vert:ZE,meshtoon_frag:QE,points_vert:JE,points_frag:ew,shadow_vert:tw,shadow_frag:nw,sprite_vert:iw,sprite_frag:rw},De={common:{diffuse:{value:new Mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ct}},envmap:{envMap:{value:null},envMapRotation:{value:new ct},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ct},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0},uvTransform:{value:new ct}},sprite:{diffuse:{value:new Mt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}}},pi={basic:{uniforms:xn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.fog]),vertexShader:lt.meshbasic_vert,fragmentShader:lt.meshbasic_frag},lambert:{uniforms:xn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new Mt(0)}}]),vertexShader:lt.meshlambert_vert,fragmentShader:lt.meshlambert_frag},phong:{uniforms:xn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new Mt(0)},specular:{value:new Mt(1118481)},shininess:{value:30}}]),vertexShader:lt.meshphong_vert,fragmentShader:lt.meshphong_frag},standard:{uniforms:xn([De.common,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.roughnessmap,De.metalnessmap,De.fog,De.lights,{emissive:{value:new Mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag},toon:{uniforms:xn([De.common,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.gradientmap,De.fog,De.lights,{emissive:{value:new Mt(0)}}]),vertexShader:lt.meshtoon_vert,fragmentShader:lt.meshtoon_frag},matcap:{uniforms:xn([De.common,De.bumpmap,De.normalmap,De.displacementmap,De.fog,{matcap:{value:null}}]),vertexShader:lt.meshmatcap_vert,fragmentShader:lt.meshmatcap_frag},points:{uniforms:xn([De.points,De.fog]),vertexShader:lt.points_vert,fragmentShader:lt.points_frag},dashed:{uniforms:xn([De.common,De.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:lt.linedashed_vert,fragmentShader:lt.linedashed_frag},depth:{uniforms:xn([De.common,De.displacementmap]),vertexShader:lt.depth_vert,fragmentShader:lt.depth_frag},normal:{uniforms:xn([De.common,De.bumpmap,De.normalmap,De.displacementmap,{opacity:{value:1}}]),vertexShader:lt.meshnormal_vert,fragmentShader:lt.meshnormal_frag},sprite:{uniforms:xn([De.sprite,De.fog]),vertexShader:lt.sprite_vert,fragmentShader:lt.sprite_frag},background:{uniforms:{uvTransform:{value:new ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:lt.background_vert,fragmentShader:lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ct}},vertexShader:lt.backgroundCube_vert,fragmentShader:lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:lt.cube_vert,fragmentShader:lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:lt.equirect_vert,fragmentShader:lt.equirect_frag},distanceRGBA:{uniforms:xn([De.common,De.displacementmap,{referencePosition:{value:new oe},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:lt.distanceRGBA_vert,fragmentShader:lt.distanceRGBA_frag},shadow:{uniforms:xn([De.lights,De.fog,{color:{value:new Mt(0)},opacity:{value:1}}]),vertexShader:lt.shadow_vert,fragmentShader:lt.shadow_frag}};pi.physical={uniforms:xn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ct},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ct},sheen:{value:0},sheenColor:{value:new Mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ct},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ct},attenuationDistance:{value:0},attenuationColor:{value:new Mt(0)},specularColor:{value:new Mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ct},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ct}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag};const Il={r:0,b:0,g:0},Gr=new Si,sw=new Bt;function aw(r,e,t,s,o,l,u){const d=new Mt(0);let m=l===!0?0:1,p,g,y=null,_=0,M=null;function E(b){let R=b.isScene===!0?b.background:null;return R&&R.isTexture&&(R=(b.backgroundBlurriness>0?t:e).get(R)),R}function w(b){let R=!1;const D=E(b);D===null?x(d,m):D&&D.isColor&&(x(D,1),R=!0);const X=r.xr.getEnvironmentBlendMode();X==="additive"?s.buffers.color.setClear(0,0,0,1,u):X==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,u),(r.autoClear||R)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil)}function S(b,R){const D=E(R);D&&(D.isCubeTexture||D.mapping===Zl)?(g===void 0&&(g=new _i(new so(1,1,1),new Er({name:"BackgroundCubeMaterial",uniforms:na(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(X,I,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(g)),Gr.copy(R.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),g.material.uniforms.envMap.value=D,g.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(sw.makeRotationFromEuler(Gr)),g.material.toneMapped=Tt.getTransfer(D.colorSpace)!==Lt,(y!==D||_!==D.version||M!==r.toneMapping)&&(g.material.needsUpdate=!0,y=D,_=D.version,M=r.toneMapping),g.layers.enableAll(),b.unshift(g,g.geometry,g.material,0,0,null)):D&&D.isTexture&&(p===void 0&&(p=new _i(new ec(2,2),new Er({name:"BackgroundMaterial",uniforms:na(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(p)),p.material.uniforms.t2D.value=D,p.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,p.material.toneMapped=Tt.getTransfer(D.colorSpace)!==Lt,D.matrixAutoUpdate===!0&&D.updateMatrix(),p.material.uniforms.uvTransform.value.copy(D.matrix),(y!==D||_!==D.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,y=D,_=D.version,M=r.toneMapping),p.layers.enableAll(),b.unshift(p,p.geometry,p.material,0,0,null))}function x(b,R){b.getRGB(Il,iv(r)),s.buffers.color.setClear(Il.r,Il.g,Il.b,R,u)}return{getClearColor:function(){return d},setClearColor:function(b,R=1){d.set(b),m=R,x(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(b){m=b,x(d,m)},render:w,addToRenderList:S}}function ow(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},o=_(null);let l=o,u=!1;function d(A,V,G,z,ne){let Y=!1;const ue=y(z,G,V);l!==ue&&(l=ue,p(l.object)),Y=M(A,z,G,ne),Y&&E(A,z,G,ne),ne!==null&&e.update(ne,r.ELEMENT_ARRAY_BUFFER),(Y||u)&&(u=!1,D(A,V,G,z),ne!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(ne).buffer))}function m(){return r.createVertexArray()}function p(A){return r.bindVertexArray(A)}function g(A){return r.deleteVertexArray(A)}function y(A,V,G){const z=G.wireframe===!0;let ne=s[A.id];ne===void 0&&(ne={},s[A.id]=ne);let Y=ne[V.id];Y===void 0&&(Y={},ne[V.id]=Y);let ue=Y[z];return ue===void 0&&(ue=_(m()),Y[z]=ue),ue}function _(A){const V=[],G=[],z=[];for(let ne=0;ne<t;ne++)V[ne]=0,G[ne]=0,z[ne]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:G,attributeDivisors:z,object:A,attributes:{},index:null}}function M(A,V,G,z){const ne=l.attributes,Y=V.attributes;let ue=0;const fe=G.getAttributes();for(const k in fe)if(fe[k].location>=0){const te=ne[k];let O=Y[k];if(O===void 0&&(k==="instanceMatrix"&&A.instanceMatrix&&(O=A.instanceMatrix),k==="instanceColor"&&A.instanceColor&&(O=A.instanceColor)),te===void 0||te.attribute!==O||O&&te.data!==O.data)return!0;ue++}return l.attributesNum!==ue||l.index!==z}function E(A,V,G,z){const ne={},Y=V.attributes;let ue=0;const fe=G.getAttributes();for(const k in fe)if(fe[k].location>=0){let te=Y[k];te===void 0&&(k==="instanceMatrix"&&A.instanceMatrix&&(te=A.instanceMatrix),k==="instanceColor"&&A.instanceColor&&(te=A.instanceColor));const O={};O.attribute=te,te&&te.data&&(O.data=te.data),ne[k]=O,ue++}l.attributes=ne,l.attributesNum=ue,l.index=z}function w(){const A=l.newAttributes;for(let V=0,G=A.length;V<G;V++)A[V]=0}function S(A){x(A,0)}function x(A,V){const G=l.newAttributes,z=l.enabledAttributes,ne=l.attributeDivisors;G[A]=1,z[A]===0&&(r.enableVertexAttribArray(A),z[A]=1),ne[A]!==V&&(r.vertexAttribDivisor(A,V),ne[A]=V)}function b(){const A=l.newAttributes,V=l.enabledAttributes;for(let G=0,z=V.length;G<z;G++)V[G]!==A[G]&&(r.disableVertexAttribArray(G),V[G]=0)}function R(A,V,G,z,ne,Y,ue){ue===!0?r.vertexAttribIPointer(A,V,G,ne,Y):r.vertexAttribPointer(A,V,G,z,ne,Y)}function D(A,V,G,z){w();const ne=z.attributes,Y=G.getAttributes(),ue=V.defaultAttributeValues;for(const fe in Y){const k=Y[fe];if(k.location>=0){let de=ne[fe];if(de===void 0&&(fe==="instanceMatrix"&&A.instanceMatrix&&(de=A.instanceMatrix),fe==="instanceColor"&&A.instanceColor&&(de=A.instanceColor)),de!==void 0){const te=de.normalized,O=de.itemSize,ae=e.get(de);if(ae===void 0)continue;const Ue=ae.buffer,Q=ae.type,pe=ae.bytesPerElement,he=Q===r.INT||Q===r.UNSIGNED_INT||de.gpuType===Hg;if(de.isInterleavedBufferAttribute){const ge=de.data,ke=ge.stride,He=de.offset;if(ge.isInstancedInterleavedBuffer){for(let q=0;q<k.locationSize;q++)x(k.location+q,ge.meshPerAttribute);A.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let q=0;q<k.locationSize;q++)S(k.location+q);r.bindBuffer(r.ARRAY_BUFFER,Ue);for(let q=0;q<k.locationSize;q++)R(k.location+q,O/k.locationSize,Q,te,ke*pe,(He+O/k.locationSize*q)*pe,he)}else{if(de.isInstancedBufferAttribute){for(let ge=0;ge<k.locationSize;ge++)x(k.location+ge,de.meshPerAttribute);A.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let ge=0;ge<k.locationSize;ge++)S(k.location+ge);r.bindBuffer(r.ARRAY_BUFFER,Ue);for(let ge=0;ge<k.locationSize;ge++)R(k.location+ge,O/k.locationSize,Q,te,O*pe,O/k.locationSize*ge*pe,he)}}else if(ue!==void 0){const te=ue[fe];if(te!==void 0)switch(te.length){case 2:r.vertexAttrib2fv(k.location,te);break;case 3:r.vertexAttrib3fv(k.location,te);break;case 4:r.vertexAttrib4fv(k.location,te);break;default:r.vertexAttrib1fv(k.location,te)}}}}b()}function X(){j();for(const A in s){const V=s[A];for(const G in V){const z=V[G];for(const ne in z)g(z[ne].object),delete z[ne];delete V[G]}delete s[A]}}function I(A){if(s[A.id]===void 0)return;const V=s[A.id];for(const G in V){const z=V[G];for(const ne in z)g(z[ne].object),delete z[ne];delete V[G]}delete s[A.id]}function L(A){for(const V in s){const G=s[V];if(G[A.id]===void 0)continue;const z=G[A.id];for(const ne in z)g(z[ne].object),delete z[ne];delete G[A.id]}}function j(){C(),u=!0,l!==o&&(l=o,p(l.object))}function C(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:d,reset:j,resetDefaultState:C,dispose:X,releaseStatesOfGeometry:I,releaseStatesOfProgram:L,initAttributes:w,enableAttribute:S,disableUnusedAttributes:b}}function lw(r,e,t){let s;function o(p){s=p}function l(p,g){r.drawArrays(s,p,g),t.update(g,s,1)}function u(p,g,y){y!==0&&(r.drawArraysInstanced(s,p,g,y),t.update(g,s,y))}function d(p,g,y){if(y===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let M=0;M<y;M++)this.render(p[M],g[M]);else{_.multiDrawArraysWEBGL(s,p,0,g,0,y);let M=0;for(let E=0;E<y;E++)M+=g[E];t.update(M,s,1)}}function m(p,g,y,_){if(y===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let E=0;E<p.length;E++)u(p[E],g[E],_[E]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,g,0,_,0,y);let E=0;for(let w=0;w<y;w++)E+=g[w];for(let w=0;w<_.length;w++)t.update(E,s,_[w])}}this.setMode=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=m}function cw(r,e,t,s){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");o=r.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function u(I){return!(I!==vi&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(I){const L=I===Ql&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Mr&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==_r&&!L)}function m(I){if(I==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=t.precision!==void 0?t.precision:"highp";const g=m(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const y=t.logarithmicDepthBuffer===!0,_=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_TEXTURE_SIZE),w=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),S=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),b=r.getParameter(r.MAX_VARYING_VECTORS),R=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),D=M>0,X=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:m,textureFormatReadable:u,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:y,maxTextures:_,maxVertexTextures:M,maxTextureSize:E,maxCubemapSize:w,maxAttributes:S,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:R,vertexTextures:D,maxSamples:X}}function uw(r){const e=this;let t=null,s=0,o=!1,l=!1;const u=new Xr,d=new ct,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(y,_){const M=y.length!==0||_||s!==0||o;return o=_,s=y.length,M},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(y,_){t=g(y,_,0)},this.setState=function(y,_,M){const E=y.clippingPlanes,w=y.clipIntersection,S=y.clipShadows,x=r.get(y);if(!o||E===null||E.length===0||l&&!S)l?g(null):p();else{const b=l?0:s,R=b*4;let D=x.clippingState||null;m.value=D,D=g(E,_,R,M);for(let X=0;X!==R;++X)D[X]=t[X];x.clippingState=D,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=b}};function p(){m.value!==t&&(m.value=t,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(y,_,M,E){const w=y!==null?y.length:0;let S=null;if(w!==0){if(S=m.value,E!==!0||S===null){const x=M+w*4,b=_.matrixWorldInverse;d.getNormalMatrix(b),(S===null||S.length<x)&&(S=new Float32Array(x));for(let R=0,D=M;R!==w;++R,D+=4)u.copy(y[R]).applyMatrix4(b,d),u.normal.toArray(S,D),S[D+3]=u.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function dw(r){let e=new WeakMap;function t(u,d){return d===Pd?u.mapping=Js:d===Ld&&(u.mapping=ea),u}function s(u){if(u&&u.isTexture){const d=u.mapping;if(d===Pd||d===Ld)if(e.has(u)){const m=e.get(u).texture;return t(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const p=new MS(m.height);return p.fromEquirectangularTexture(r,u),e.set(u,p),u.addEventListener("dispose",o),t(p.texture,u.mapping)}else return null}}return u}function o(u){const d=u.target;d.removeEventListener("dispose",o);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function l(){e=new WeakMap}return{get:s,dispose:l}}class ov extends rv{constructor(e=-1,t=1,s=1,o=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=s,this.bottom=o,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,s,o,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=s-e,u=s+e,d=o+t,m=o-t;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,u=l+p*this.view.width,d-=g*this.view.offsetY,m=d-g*this.view.height}this.projectionMatrix.makeOrthographic(l,u,d,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Xs=4,Wm=[.125,.215,.35,.446,.526,.582],Yr=20,gd=new ov,Xm=new Mt;let vd=null,_d=0,xd=0,yd=!1;const $r=(1+Math.sqrt(5))/2,Ws=1/$r,$m=[new oe(-$r,Ws,0),new oe($r,Ws,0),new oe(-Ws,0,$r),new oe(Ws,0,$r),new oe(0,$r,-Ws),new oe(0,$r,Ws),new oe(-1,1,-1),new oe(1,1,-1),new oe(-1,1,1),new oe(1,1,1)];class qm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,s=.1,o=100){vd=this._renderer.getRenderTarget(),_d=this._renderer.getActiveCubeFace(),xd=this._renderer.getActiveMipmapLevel(),yd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,s,o,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Km(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(vd,_d,xd),this._renderer.xr.enabled=yd,e.scissorTest=!1,Fl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Js||e.mapping===ea?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vd=this._renderer.getRenderTarget(),_d=this._renderer.getActiveCubeFace(),xd=this._renderer.getActiveMipmapLevel(),yd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=t||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,s={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Ql,format:vi,colorSpace:Tr,depthBuffer:!1},o=Ym(e,t,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ym(e,t,s);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fw(l)),this._blurMaterial=hw(l,e,t)}return o}_compileMaterial(e){const t=new _i(this._lodPlanes[0],e);this._renderer.compile(t,gd)}_sceneToCubeUV(e,t,s,o){const d=new qn(90,1,t,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,y=g.autoClear,_=g.toneMapping;g.getClearColor(Xm),g.toneMapping=yr,g.autoClear=!1;const M=new ev({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1}),E=new _i(new so,M);let w=!1;const S=e.background;S?S.isColor&&(M.color.copy(S),e.background=null,w=!0):(M.color.copy(Xm),w=!0);for(let x=0;x<6;x++){const b=x%3;b===0?(d.up.set(0,m[x],0),d.lookAt(p[x],0,0)):b===1?(d.up.set(0,0,m[x]),d.lookAt(0,p[x],0)):(d.up.set(0,m[x],0),d.lookAt(0,0,p[x]));const R=this._cubeSize;Fl(o,b*R,x>2?R:0,R,R),g.setRenderTarget(o),w&&g.render(E,d),g.render(e,d)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=_,g.autoClear=y,e.background=S}_textureToCubeUV(e,t){const s=this._renderer,o=e.mapping===Js||e.mapping===ea;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Km());const l=o?this._cubemapMaterial:this._equirectMaterial,u=new _i(this._lodPlanes[0],l),d=l.uniforms;d.envMap.value=e;const m=this._cubeSize;Fl(t,0,0,3*m,2*m),s.setRenderTarget(t),s.render(u,gd)}_applyPMREM(e){const t=this._renderer,s=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let l=1;l<o;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),d=$m[(o-l-1)%$m.length];this._blur(e,l-1,l,u,d)}t.autoClear=s}_blur(e,t,s,o,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,s,o,"latitudinal",l),this._halfBlur(u,e,s,s,o,"longitudinal",l)}_halfBlur(e,t,s,o,l,u,d){const m=this._renderer,p=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,y=new _i(this._lodPlanes[o],p),_=p.uniforms,M=this._sizeLods[s]-1,E=isFinite(l)?Math.PI/(2*M):2*Math.PI/(2*Yr-1),w=l/E,S=isFinite(l)?1+Math.floor(g*w):Yr;S>Yr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Yr}`);const x=[];let b=0;for(let L=0;L<Yr;++L){const j=L/w,C=Math.exp(-j*j/2);x.push(C),L===0?b+=C:L<S&&(b+=2*C)}for(let L=0;L<x.length;L++)x[L]=x[L]/b;_.envMap.value=e.texture,_.samples.value=S,_.weights.value=x,_.latitudinal.value=u==="latitudinal",d&&(_.poleAxis.value=d);const{_lodMax:R}=this;_.dTheta.value=E,_.mipInt.value=R-s;const D=this._sizeLods[o],X=3*D*(o>R-Xs?o-R+Xs:0),I=4*(this._cubeSize-D);Fl(t,X,I,3*D,2*D),m.setRenderTarget(t),m.render(y,gd)}}function fw(r){const e=[],t=[],s=[];let o=r;const l=r-Xs+1+Wm.length;for(let u=0;u<l;u++){const d=Math.pow(2,o);t.push(d);let m=1/d;u>r-Xs?m=Wm[u-r+Xs-1]:u===0&&(m=0),s.push(m);const p=1/(d-2),g=-p,y=1+p,_=[g,g,y,g,y,y,g,g,y,y,g,y],M=6,E=6,w=3,S=2,x=1,b=new Float32Array(w*E*M),R=new Float32Array(S*E*M),D=new Float32Array(x*E*M);for(let I=0;I<M;I++){const L=I%3*2/3-1,j=I>2?0:-1,C=[L,j,0,L+2/3,j,0,L+2/3,j+1,0,L,j,0,L+2/3,j+1,0,L,j+1,0];b.set(C,w*E*I),R.set(_,S*E*I);const A=[I,I,I,I,I,I];D.set(A,x*E*I)}const X=new ji;X.setAttribute("position",new Bn(b,w)),X.setAttribute("uv",new Bn(R,S)),X.setAttribute("faceIndex",new Bn(D,x)),e.push(X),o>Xs&&o--}return{lodPlanes:e,sizeLods:t,sigmas:s}}function Ym(r,e,t){const s=new ns(r,e,t);return s.texture.mapping=Zl,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Fl(r,e,t,s,o){r.viewport.set(e,t,s,o),r.scissor.set(e,t,s,o)}function hw(r,e,t){const s=new Float32Array(Yr),o=new oe(0,1,0);return new Er({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Kd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Km(){return new Er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Zm(){return new Er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Kd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function pw(r){let e=new WeakMap,t=null;function s(d){if(d&&d.isTexture){const m=d.mapping,p=m===Pd||m===Ld,g=m===Js||m===ea;if(p||g){let y=e.get(d);const _=y!==void 0?y.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==_)return t===null&&(t=new qm(r)),y=p?t.fromEquirectangular(d,y):t.fromCubemap(d,y),y.texture.pmremVersion=d.pmremVersion,e.set(d,y),y.texture;if(y!==void 0)return y.texture;{const M=d.image;return p&&M&&M.height>0||g&&M&&o(M)?(t===null&&(t=new qm(r)),y=p?t.fromEquirectangular(d):t.fromCubemap(d),y.texture.pmremVersion=d.pmremVersion,e.set(d,y),d.addEventListener("dispose",l),y.texture):null}}}return d}function o(d){let m=0;const p=6;for(let g=0;g<p;g++)d[g]!==void 0&&m++;return m===p}function l(d){const m=d.target;m.removeEventListener("dispose",l);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:s,dispose:u}}function mw(r){const e={};function t(s){if(e[s]!==void 0)return e[s];let o;switch(s){case"WEBGL_depth_texture":o=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=r.getExtension(s)}return e[s]=o,o}return{has:function(s){return t(s)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(s){const o=t(s);return o===null&&console.warn("THREE.WebGLRenderer: "+s+" extension not supported."),o}}}function gw(r,e,t,s){const o={},l=new WeakMap;function u(y){const _=y.target;_.index!==null&&e.remove(_.index);for(const E in _.attributes)e.remove(_.attributes[E]);for(const E in _.morphAttributes){const w=_.morphAttributes[E];for(let S=0,x=w.length;S<x;S++)e.remove(w[S])}_.removeEventListener("dispose",u),delete o[_.id];const M=l.get(_);M&&(e.remove(M),l.delete(_)),s.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function d(y,_){return o[_.id]===!0||(_.addEventListener("dispose",u),o[_.id]=!0,t.memory.geometries++),_}function m(y){const _=y.attributes;for(const E in _)e.update(_[E],r.ARRAY_BUFFER);const M=y.morphAttributes;for(const E in M){const w=M[E];for(let S=0,x=w.length;S<x;S++)e.update(w[S],r.ARRAY_BUFFER)}}function p(y){const _=[],M=y.index,E=y.attributes.position;let w=0;if(M!==null){const b=M.array;w=M.version;for(let R=0,D=b.length;R<D;R+=3){const X=b[R+0],I=b[R+1],L=b[R+2];_.push(X,I,I,L,L,X)}}else if(E!==void 0){const b=E.array;w=E.version;for(let R=0,D=b.length/3-1;R<D;R+=3){const X=R+0,I=R+1,L=R+2;_.push(X,I,I,L,L,X)}}else return;const S=new(Yg(_)?nv:tv)(_,1);S.version=w;const x=l.get(y);x&&e.remove(x),l.set(y,S)}function g(y){const _=l.get(y);if(_){const M=y.index;M!==null&&_.version<M.version&&p(y)}else p(y);return l.get(y)}return{get:d,update:m,getWireframeAttribute:g}}function vw(r,e,t){let s;function o(_){s=_}let l,u;function d(_){l=_.type,u=_.bytesPerElement}function m(_,M){r.drawElements(s,M,l,_*u),t.update(M,s,1)}function p(_,M,E){E!==0&&(r.drawElementsInstanced(s,M,l,_*u,E),t.update(M,s,E))}function g(_,M,E){if(E===0)return;const w=e.get("WEBGL_multi_draw");if(w===null)for(let S=0;S<E;S++)this.render(_[S]/u,M[S]);else{w.multiDrawElementsWEBGL(s,M,0,l,_,0,E);let S=0;for(let x=0;x<E;x++)S+=M[x];t.update(S,s,1)}}function y(_,M,E,w){if(E===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let x=0;x<_.length;x++)p(_[x]/u,M[x],w[x]);else{S.multiDrawElementsInstancedWEBGL(s,M,0,l,_,0,w,0,E);let x=0;for(let b=0;b<E;b++)x+=M[b];for(let b=0;b<w.length;b++)t.update(x,s,w[b])}}this.setMode=o,this.setIndex=d,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=y}function _w(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function s(l,u,d){switch(t.calls++,u){case r.TRIANGLES:t.triangles+=d*(l/3);break;case r.LINES:t.lines+=d*(l/2);break;case r.LINE_STRIP:t.lines+=d*(l-1);break;case r.LINE_LOOP:t.lines+=d*l;break;case r.POINTS:t.points+=d*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:s}}function xw(r,e,t){const s=new WeakMap,o=new rn;function l(u,d,m){const p=u.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,y=g!==void 0?g.length:0;let _=s.get(d);if(_===void 0||_.count!==y){let A=function(){j.dispose(),s.delete(d),d.removeEventListener("dispose",A)};var M=A;_!==void 0&&_.texture.dispose();const E=d.morphAttributes.position!==void 0,w=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,x=d.morphAttributes.position||[],b=d.morphAttributes.normal||[],R=d.morphAttributes.color||[];let D=0;E===!0&&(D=1),w===!0&&(D=2),S===!0&&(D=3);let X=d.attributes.position.count*D,I=1;X>e.maxTextureSize&&(I=Math.ceil(X/e.maxTextureSize),X=e.maxTextureSize);const L=new Float32Array(X*I*4*y),j=new Zg(L,X,I,y);j.type=_r,j.needsUpdate=!0;const C=D*4;for(let V=0;V<y;V++){const G=x[V],z=b[V],ne=R[V],Y=X*I*4*V;for(let ue=0;ue<G.count;ue++){const fe=ue*C;E===!0&&(o.fromBufferAttribute(G,ue),L[Y+fe+0]=o.x,L[Y+fe+1]=o.y,L[Y+fe+2]=o.z,L[Y+fe+3]=0),w===!0&&(o.fromBufferAttribute(z,ue),L[Y+fe+4]=o.x,L[Y+fe+5]=o.y,L[Y+fe+6]=o.z,L[Y+fe+7]=0),S===!0&&(o.fromBufferAttribute(ne,ue),L[Y+fe+8]=o.x,L[Y+fe+9]=o.y,L[Y+fe+10]=o.z,L[Y+fe+11]=ne.itemSize===4?o.w:1)}}_={count:y,texture:j,size:new _t(X,I)},s.set(d,_),d.addEventListener("dispose",A)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",u.morphTexture,t);else{let E=0;for(let S=0;S<p.length;S++)E+=p[S];const w=d.morphTargetsRelative?1:1-E;m.getUniforms().setValue(r,"morphTargetBaseInfluence",w),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",_.texture,t),m.getUniforms().setValue(r,"morphTargetsTextureSize",_.size)}return{update:l}}function yw(r,e,t,s){let o=new WeakMap;function l(m){const p=s.render.frame,g=m.geometry,y=e.get(m,g);if(o.get(y)!==p&&(e.update(y),o.set(y,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),o.get(m)!==p&&(t.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&t.update(m.instanceColor,r.ARRAY_BUFFER),o.set(m,p))),m.isSkinnedMesh){const _=m.skeleton;o.get(_)!==p&&(_.update(),o.set(_,p))}return y}function u(){o=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:l,dispose:u}}class lv extends Nn{constructor(e,t,s,o,l,u,d,m,p,g){if(g=g!==void 0?g:Ys,g!==Ys&&g!==Ja)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Ys&&(s=ta),s===void 0&&g===Ja&&(s=to),super(null,o,l,u,d,m,g,s,p),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=d!==void 0?d:Kn,this.minFilter=m!==void 0?m:Kn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const cv=new Nn,uv=new lv(1,1);uv.compareFunction=qg;const dv=new Zg,fv=new sS,hv=new sv,Qm=[],Jm=[],eg=new Float32Array(16),tg=new Float32Array(9),ng=new Float32Array(4);function aa(r,e,t){const s=r[0];if(s<=0||s>0)return r;const o=e*t;let l=Qm[o];if(l===void 0&&(l=new Float32Array(o),Qm[o]=l),e!==0){s.toArray(l,0);for(let u=1,d=0;u!==e;++u)d+=t,r[u].toArray(l,d)}return l}function Yt(r,e){if(r.length!==e.length)return!1;for(let t=0,s=r.length;t<s;t++)if(r[t]!==e[t])return!1;return!0}function Kt(r,e){for(let t=0,s=e.length;t<s;t++)r[t]=e[t]}function tc(r,e){let t=Jm[e];t===void 0&&(t=new Int32Array(e),Jm[e]=t);for(let s=0;s!==e;++s)t[s]=r.allocateTextureUnit();return t}function Sw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Mw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2fv(this.addr,e),Kt(t,e)}}function Ew(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;r.uniform3fv(this.addr,e),Kt(t,e)}}function ww(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4fv(this.addr,e),Kt(t,e)}}function Tw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;ng.set(s),r.uniformMatrix2fv(this.addr,!1,ng),Kt(t,s)}}function Aw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;tg.set(s),r.uniformMatrix3fv(this.addr,!1,tg),Kt(t,s)}}function Cw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;eg.set(s),r.uniformMatrix4fv(this.addr,!1,eg),Kt(t,s)}}function bw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Rw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2iv(this.addr,e),Kt(t,e)}}function Nw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3iv(this.addr,e),Kt(t,e)}}function Pw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4iv(this.addr,e),Kt(t,e)}}function Lw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Dw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2uiv(this.addr,e),Kt(t,e)}}function Uw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3uiv(this.addr,e),Kt(t,e)}}function Iw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4uiv(this.addr,e),Kt(t,e)}}function Fw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o);const l=this.type===r.SAMPLER_2D_SHADOW?uv:cv;t.setTexture2D(e||l,o)}function Ow(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture3D(e||fv,o)}function kw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTextureCube(e||hv,o)}function zw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture2DArray(e||dv,o)}function Bw(r){switch(r){case 5126:return Sw;case 35664:return Mw;case 35665:return Ew;case 35666:return ww;case 35674:return Tw;case 35675:return Aw;case 35676:return Cw;case 5124:case 35670:return bw;case 35667:case 35671:return Rw;case 35668:case 35672:return Nw;case 35669:case 35673:return Pw;case 5125:return Lw;case 36294:return Dw;case 36295:return Uw;case 36296:return Iw;case 35678:case 36198:case 36298:case 36306:case 35682:return Fw;case 35679:case 36299:case 36307:return Ow;case 35680:case 36300:case 36308:case 36293:return kw;case 36289:case 36303:case 36311:case 36292:return zw}}function Hw(r,e){r.uniform1fv(this.addr,e)}function jw(r,e){const t=aa(e,this.size,2);r.uniform2fv(this.addr,t)}function Vw(r,e){const t=aa(e,this.size,3);r.uniform3fv(this.addr,t)}function Gw(r,e){const t=aa(e,this.size,4);r.uniform4fv(this.addr,t)}function Ww(r,e){const t=aa(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Xw(r,e){const t=aa(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function $w(r,e){const t=aa(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function qw(r,e){r.uniform1iv(this.addr,e)}function Yw(r,e){r.uniform2iv(this.addr,e)}function Kw(r,e){r.uniform3iv(this.addr,e)}function Zw(r,e){r.uniform4iv(this.addr,e)}function Qw(r,e){r.uniform1uiv(this.addr,e)}function Jw(r,e){r.uniform2uiv(this.addr,e)}function eT(r,e){r.uniform3uiv(this.addr,e)}function tT(r,e){r.uniform4uiv(this.addr,e)}function nT(r,e,t){const s=this.cache,o=e.length,l=tc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture2D(e[u]||cv,l[u])}function iT(r,e,t){const s=this.cache,o=e.length,l=tc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture3D(e[u]||fv,l[u])}function rT(r,e,t){const s=this.cache,o=e.length,l=tc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTextureCube(e[u]||hv,l[u])}function sT(r,e,t){const s=this.cache,o=e.length,l=tc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture2DArray(e[u]||dv,l[u])}function aT(r){switch(r){case 5126:return Hw;case 35664:return jw;case 35665:return Vw;case 35666:return Gw;case 35674:return Ww;case 35675:return Xw;case 35676:return $w;case 5124:case 35670:return qw;case 35667:case 35671:return Yw;case 35668:case 35672:return Kw;case 35669:case 35673:return Zw;case 5125:return Qw;case 36294:return Jw;case 36295:return eT;case 36296:return tT;case 35678:case 36198:case 36298:case 36306:case 35682:return nT;case 35679:case 36299:case 36307:return iT;case 35680:case 36300:case 36308:case 36293:return rT;case 36289:case 36303:case 36311:case 36292:return sT}}class oT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.setValue=Bw(t.type)}}class lT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=aT(t.type)}}class cT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,s){const o=this.seq;for(let l=0,u=o.length;l!==u;++l){const d=o[l];d.setValue(e,t[d.id],s)}}}const Sd=/(\w+)(\])?(\[|\.)?/g;function ig(r,e){r.seq.push(e),r.map[e.id]=e}function uT(r,e,t){const s=r.name,o=s.length;for(Sd.lastIndex=0;;){const l=Sd.exec(s),u=Sd.lastIndex;let d=l[1];const m=l[2]==="]",p=l[3];if(m&&(d=d|0),p===void 0||p==="["&&u+2===o){ig(t,p===void 0?new oT(d,r,e):new lT(d,r,e));break}else{let y=t.map[d];y===void 0&&(y=new cT(d),ig(t,y)),t=y}}}class Ol{constructor(e,t){this.seq=[],this.map={};const s=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<s;++o){const l=e.getActiveUniform(t,o),u=e.getUniformLocation(t,l.name);uT(l,u,this)}}setValue(e,t,s,o){const l=this.map[t];l!==void 0&&l.setValue(e,s,o)}setOptional(e,t,s){const o=t[s];o!==void 0&&this.setValue(e,s,o)}static upload(e,t,s,o){for(let l=0,u=t.length;l!==u;++l){const d=t[l],m=s[d.id];m.needsUpdate!==!1&&d.setValue(e,m.value,o)}}static seqWithValue(e,t){const s=[];for(let o=0,l=e.length;o!==l;++o){const u=e[o];u.id in t&&s.push(u)}return s}}function rg(r,e,t){const s=r.createShader(e);return r.shaderSource(s,t),r.compileShader(s),s}const dT=37297;let fT=0;function hT(r,e){const t=r.split(`
`),s=[],o=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=o;u<l;u++){const d=u+1;s.push(`${d===e?">":" "} ${d}: ${t[u]}`)}return s.join(`
`)}function pT(r){const e=Tt.getPrimaries(Tt.workingColorSpace),t=Tt.getPrimaries(r);let s;switch(e===t?s="":e===Wl&&t===Gl?s="LinearDisplayP3ToLinearSRGB":e===Gl&&t===Wl&&(s="LinearSRGBToLinearDisplayP3"),r){case Tr:case Jl:return[s,"LinearTransferOETF"];case hi:case $d:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[s,"LinearTransferOETF"]}}function sg(r,e,t){const s=r.getShaderParameter(e,r.COMPILE_STATUS),o=r.getShaderInfoLog(e).trim();if(s&&o==="")return"";const l=/ERROR: 0:(\d+)/.exec(o);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+o+`

`+hT(r.getShaderSource(e),u)}else return o}function mT(r,e){const t=pT(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function gT(r,e){let t;switch(e){case Ey:t="Linear";break;case wy:t="Reinhard";break;case Ty:t="OptimizedCineon";break;case Ay:t="ACESFilmic";break;case by:t="AgX";break;case Ry:t="Neutral";break;case Cy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function vT(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ya).join(`
`)}function _T(r){const e=[];for(const t in r){const s=r[t];s!==!1&&e.push("#define "+t+" "+s)}return e.join(`
`)}function xT(r,e){const t={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let o=0;o<s;o++){const l=r.getActiveAttrib(e,o),u=l.name;let d=1;l.type===r.FLOAT_MAT2&&(d=2),l.type===r.FLOAT_MAT3&&(d=3),l.type===r.FLOAT_MAT4&&(d=4),t[u]={type:l.type,location:r.getAttribLocation(e,u),locationSize:d}}return t}function Ya(r){return r!==""}function ag(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function og(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const yT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fd(r){return r.replace(yT,MT)}const ST=new Map;function MT(r,e){let t=lt[e];if(t===void 0){const s=ST.get(e);if(s!==void 0)t=lt[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Fd(t)}const ET=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lg(r){return r.replace(ET,wT)}function wT(r,e,t,s){let o="";for(let l=parseInt(e);l<parseInt(t);l++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function cg(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function TT(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Og?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Y0?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function AT(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Js:case ea:e="ENVMAP_TYPE_CUBE";break;case Zl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function CT(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case ea:e="ENVMAP_MODE_REFRACTION";break}return e}function bT(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case kg:e="ENVMAP_BLENDING_MULTIPLY";break;case Sy:e="ENVMAP_BLENDING_MIX";break;case My:e="ENVMAP_BLENDING_ADD";break}return e}function RT(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:s,maxMip:t}}function NT(r,e,t,s){const o=r.getContext(),l=t.defines;let u=t.vertexShader,d=t.fragmentShader;const m=TT(t),p=AT(t),g=CT(t),y=bT(t),_=RT(t),M=vT(t),E=_T(l),w=o.createProgram();let S,x,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Ya).join(`
`),S.length>0&&(S+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Ya).join(`
`),x.length>0&&(x+=`
`)):(S=[cg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+g:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ya).join(`
`),x=[cg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",t.envMap?"#define "+y:"",_?"#define CUBEUV_TEXEL_WIDTH "+_.texelWidth:"",_?"#define CUBEUV_TEXEL_HEIGHT "+_.texelHeight:"",_?"#define CUBEUV_MAX_MIP "+_.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yr?"#define TONE_MAPPING":"",t.toneMapping!==yr?lt.tonemapping_pars_fragment:"",t.toneMapping!==yr?gT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",lt.colorspace_pars_fragment,mT("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ya).join(`
`)),u=Fd(u),u=ag(u,t),u=og(u,t),d=Fd(d),d=ag(d,t),d=og(d,t),u=lg(u),d=lg(d),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,x=["#define varying in",t.glslVersion===Tm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Tm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const R=b+S+u,D=b+x+d,X=rg(o,o.VERTEX_SHADER,R),I=rg(o,o.FRAGMENT_SHADER,D);o.attachShader(w,X),o.attachShader(w,I),t.index0AttributeName!==void 0?o.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function L(V){if(r.debug.checkShaderErrors){const G=o.getProgramInfoLog(w).trim(),z=o.getShaderInfoLog(X).trim(),ne=o.getShaderInfoLog(I).trim();let Y=!0,ue=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(Y=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(o,w,X,I);else{const fe=sg(o,X,"vertex"),k=sg(o,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+G+`
`+fe+`
`+k)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(z===""||ne==="")&&(ue=!1);ue&&(V.diagnostics={runnable:Y,programLog:G,vertexShader:{log:z,prefix:S},fragmentShader:{log:ne,prefix:x}})}o.deleteShader(X),o.deleteShader(I),j=new Ol(o,w),C=xT(o,w)}let j;this.getUniforms=function(){return j===void 0&&L(this),j};let C;this.getAttributes=function(){return C===void 0&&L(this),C};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=o.getProgramParameter(w,dT)),A},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=fT++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=X,this.fragmentShader=I,this}let PT=0;class LT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,s=e.fragmentShader,o=this._getShaderStage(t),l=this._getShaderStage(s),u=this._getShaderCacheForMaterial(e);return u.has(o)===!1&&(u.add(o),o.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const s of t)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let s=t.get(e);return s===void 0&&(s=new Set,t.set(e,s)),s}_getShaderStage(e){const t=this.shaderCache;let s=t.get(e);return s===void 0&&(s=new DT(e),t.set(e,s)),s}}class DT{constructor(e){this.id=PT++,this.code=e,this.usedTimes=0}}function UT(r,e,t,s,o,l,u){const d=new Qg,m=new LT,p=new Set,g=[],y=o.logarithmicDepthBuffer,_=o.vertexTextures;let M=o.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(C){return p.add(C),C===0?"uv":`uv${C}`}function S(C,A,V,G,z){const ne=G.fog,Y=z.geometry,ue=C.isMeshStandardMaterial?G.environment:null,fe=(C.isMeshStandardMaterial?t:e).get(C.envMap||ue),k=fe&&fe.mapping===Zl?fe.image.height:null,de=E[C.type];C.precision!==null&&(M=o.getMaxPrecision(C.precision),M!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",M,"instead."));const te=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,O=te!==void 0?te.length:0;let ae=0;Y.morphAttributes.position!==void 0&&(ae=1),Y.morphAttributes.normal!==void 0&&(ae=2),Y.morphAttributes.color!==void 0&&(ae=3);let Ue,Q,pe,he;if(de){const yt=pi[de];Ue=yt.vertexShader,Q=yt.fragmentShader}else Ue=C.vertexShader,Q=C.fragmentShader,m.update(C),pe=m.getVertexShaderID(C),he=m.getFragmentShaderID(C);const ge=r.getRenderTarget(),ke=z.isInstancedMesh===!0,He=z.isBatchedMesh===!0,q=!!C.map,ht=!!C.matcap,Ye=!!fe,mt=!!C.aoMap,Ke=!!C.lightMap,ut=!!C.bumpMap,rt=!!C.normalMap,at=!!C.displacementMap,At=!!C.emissiveMap,F=!!C.metalnessMap,N=!!C.roughnessMap,ce=C.anisotropy>0,ve=C.clearcoat>0,Me=C.dispersion>0,we=C.iridescence>0,qe=C.sheen>0,Pe=C.transmission>0,Ne=ce&&!!C.anisotropyMap,nt=ve&&!!C.clearcoatMap,B=ve&&!!C.clearcoatNormalMap,J=ve&&!!C.clearcoatRoughnessMap,_e=we&&!!C.iridescenceMap,Te=we&&!!C.iridescenceThicknessMap,Ee=qe&&!!C.sheenColorMap,Be=qe&&!!C.sheenRoughnessMap,Ie=!!C.specularMap,dt=!!C.specularColorMap,st=!!C.specularIntensityMap,$=Pe&&!!C.transmissionMap,xe=Pe&&!!C.thicknessMap,me=!!C.gradientMap,Re=!!C.alphaMap,Fe=C.alphaTest>0,pt=!!C.alphaHash,wt=!!C.extensions;let Rt=yr;C.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(Rt=r.toneMapping);const Vt={shaderID:de,shaderType:C.type,shaderName:C.name,vertexShader:Ue,fragmentShader:Q,defines:C.defines,customVertexShaderID:pe,customFragmentShaderID:he,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:M,batching:He,instancing:ke,instancingColor:ke&&z.instanceColor!==null,instancingMorph:ke&&z.morphTexture!==null,supportsVertexTextures:_,outputColorSpace:ge===null?r.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:Tr,alphaToCoverage:!!C.alphaToCoverage,map:q,matcap:ht,envMap:Ye,envMapMode:Ye&&fe.mapping,envMapCubeUVHeight:k,aoMap:mt,lightMap:Ke,bumpMap:ut,normalMap:rt,displacementMap:_&&at,emissiveMap:At,normalMapObjectSpace:rt&&C.normalMapType===Vy,normalMapTangentSpace:rt&&C.normalMapType===$g,metalnessMap:F,roughnessMap:N,anisotropy:ce,anisotropyMap:Ne,clearcoat:ve,clearcoatMap:nt,clearcoatNormalMap:B,clearcoatRoughnessMap:J,dispersion:Me,iridescence:we,iridescenceMap:_e,iridescenceThicknessMap:Te,sheen:qe,sheenColorMap:Ee,sheenRoughnessMap:Be,specularMap:Ie,specularColorMap:dt,specularIntensityMap:st,transmission:Pe,transmissionMap:$,thicknessMap:xe,gradientMap:me,opaque:C.transparent===!1&&C.blending===qs&&C.alphaToCoverage===!1,alphaMap:Re,alphaTest:Fe,alphaHash:pt,combine:C.combine,mapUv:q&&w(C.map.channel),aoMapUv:mt&&w(C.aoMap.channel),lightMapUv:Ke&&w(C.lightMap.channel),bumpMapUv:ut&&w(C.bumpMap.channel),normalMapUv:rt&&w(C.normalMap.channel),displacementMapUv:at&&w(C.displacementMap.channel),emissiveMapUv:At&&w(C.emissiveMap.channel),metalnessMapUv:F&&w(C.metalnessMap.channel),roughnessMapUv:N&&w(C.roughnessMap.channel),anisotropyMapUv:Ne&&w(C.anisotropyMap.channel),clearcoatMapUv:nt&&w(C.clearcoatMap.channel),clearcoatNormalMapUv:B&&w(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&w(C.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&w(C.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&w(C.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&w(C.sheenColorMap.channel),sheenRoughnessMapUv:Be&&w(C.sheenRoughnessMap.channel),specularMapUv:Ie&&w(C.specularMap.channel),specularColorMapUv:dt&&w(C.specularColorMap.channel),specularIntensityMapUv:st&&w(C.specularIntensityMap.channel),transmissionMapUv:$&&w(C.transmissionMap.channel),thicknessMapUv:xe&&w(C.thicknessMap.channel),alphaMapUv:Re&&w(C.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(rt||ce),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Y.attributes.uv&&(q||Re),fog:!!ne,useFog:C.fog===!0,fogExp2:!!ne&&ne.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:y,skinning:z.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:ae,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:C.dithering,shadowMapEnabled:r.shadowMap.enabled&&V.length>0,shadowMapType:r.shadowMap.type,toneMapping:Rt,useLegacyLights:r._useLegacyLights,decodeVideoTexture:q&&C.map.isVideoTexture===!0&&Tt.getTransfer(C.map.colorSpace)===Lt,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===mi,flipSided:C.side===Rn,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:wt&&C.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:wt&&C.extensions.multiDraw===!0&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return Vt.vertexUv1s=p.has(1),Vt.vertexUv2s=p.has(2),Vt.vertexUv3s=p.has(3),p.clear(),Vt}function x(C){const A=[];if(C.shaderID?A.push(C.shaderID):(A.push(C.customVertexShaderID),A.push(C.customFragmentShaderID)),C.defines!==void 0)for(const V in C.defines)A.push(V),A.push(C.defines[V]);return C.isRawShaderMaterial===!1&&(b(A,C),R(A,C),A.push(r.outputColorSpace)),A.push(C.customProgramCacheKey),A.join()}function b(C,A){C.push(A.precision),C.push(A.outputColorSpace),C.push(A.envMapMode),C.push(A.envMapCubeUVHeight),C.push(A.mapUv),C.push(A.alphaMapUv),C.push(A.lightMapUv),C.push(A.aoMapUv),C.push(A.bumpMapUv),C.push(A.normalMapUv),C.push(A.displacementMapUv),C.push(A.emissiveMapUv),C.push(A.metalnessMapUv),C.push(A.roughnessMapUv),C.push(A.anisotropyMapUv),C.push(A.clearcoatMapUv),C.push(A.clearcoatNormalMapUv),C.push(A.clearcoatRoughnessMapUv),C.push(A.iridescenceMapUv),C.push(A.iridescenceThicknessMapUv),C.push(A.sheenColorMapUv),C.push(A.sheenRoughnessMapUv),C.push(A.specularMapUv),C.push(A.specularColorMapUv),C.push(A.specularIntensityMapUv),C.push(A.transmissionMapUv),C.push(A.thicknessMapUv),C.push(A.combine),C.push(A.fogExp2),C.push(A.sizeAttenuation),C.push(A.morphTargetsCount),C.push(A.morphAttributeCount),C.push(A.numDirLights),C.push(A.numPointLights),C.push(A.numSpotLights),C.push(A.numSpotLightMaps),C.push(A.numHemiLights),C.push(A.numRectAreaLights),C.push(A.numDirLightShadows),C.push(A.numPointLightShadows),C.push(A.numSpotLightShadows),C.push(A.numSpotLightShadowsWithMaps),C.push(A.numLightProbes),C.push(A.shadowMapType),C.push(A.toneMapping),C.push(A.numClippingPlanes),C.push(A.numClipIntersection),C.push(A.depthPacking)}function R(C,A){d.disableAll(),A.supportsVertexTextures&&d.enable(0),A.instancing&&d.enable(1),A.instancingColor&&d.enable(2),A.instancingMorph&&d.enable(3),A.matcap&&d.enable(4),A.envMap&&d.enable(5),A.normalMapObjectSpace&&d.enable(6),A.normalMapTangentSpace&&d.enable(7),A.clearcoat&&d.enable(8),A.iridescence&&d.enable(9),A.alphaTest&&d.enable(10),A.vertexColors&&d.enable(11),A.vertexAlphas&&d.enable(12),A.vertexUv1s&&d.enable(13),A.vertexUv2s&&d.enable(14),A.vertexUv3s&&d.enable(15),A.vertexTangents&&d.enable(16),A.anisotropy&&d.enable(17),A.alphaHash&&d.enable(18),A.batching&&d.enable(19),A.dispersion&&d.enable(20),C.push(d.mask),d.disableAll(),A.fog&&d.enable(0),A.useFog&&d.enable(1),A.flatShading&&d.enable(2),A.logarithmicDepthBuffer&&d.enable(3),A.skinning&&d.enable(4),A.morphTargets&&d.enable(5),A.morphNormals&&d.enable(6),A.morphColors&&d.enable(7),A.premultipliedAlpha&&d.enable(8),A.shadowMapEnabled&&d.enable(9),A.useLegacyLights&&d.enable(10),A.doubleSided&&d.enable(11),A.flipSided&&d.enable(12),A.useDepthPacking&&d.enable(13),A.dithering&&d.enable(14),A.transmission&&d.enable(15),A.sheen&&d.enable(16),A.opaque&&d.enable(17),A.pointsUvs&&d.enable(18),A.decodeVideoTexture&&d.enable(19),A.alphaToCoverage&&d.enable(20),C.push(d.mask)}function D(C){const A=E[C.type];let V;if(A){const G=pi[A];V=_S.clone(G.uniforms)}else V=C.uniforms;return V}function X(C,A){let V;for(let G=0,z=g.length;G<z;G++){const ne=g[G];if(ne.cacheKey===A){V=ne,++V.usedTimes;break}}return V===void 0&&(V=new NT(r,A,C,l),g.push(V)),V}function I(C){if(--C.usedTimes===0){const A=g.indexOf(C);g[A]=g[g.length-1],g.pop(),C.destroy()}}function L(C){m.remove(C)}function j(){m.dispose()}return{getParameters:S,getProgramCacheKey:x,getUniforms:D,acquireProgram:X,releaseProgram:I,releaseShaderCache:L,programs:g,dispose:j}}function IT(){let r=new WeakMap;function e(l){let u=r.get(l);return u===void 0&&(u={},r.set(l,u)),u}function t(l){r.delete(l)}function s(l,u,d){r.get(l)[u]=d}function o(){r=new WeakMap}return{get:e,remove:t,update:s,dispose:o}}function FT(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function ug(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function dg(){const r=[];let e=0;const t=[],s=[],o=[];function l(){e=0,t.length=0,s.length=0,o.length=0}function u(y,_,M,E,w,S){let x=r[e];return x===void 0?(x={id:y.id,object:y,geometry:_,material:M,groupOrder:E,renderOrder:y.renderOrder,z:w,group:S},r[e]=x):(x.id=y.id,x.object=y,x.geometry=_,x.material=M,x.groupOrder=E,x.renderOrder=y.renderOrder,x.z=w,x.group=S),e++,x}function d(y,_,M,E,w,S){const x=u(y,_,M,E,w,S);M.transmission>0?s.push(x):M.transparent===!0?o.push(x):t.push(x)}function m(y,_,M,E,w,S){const x=u(y,_,M,E,w,S);M.transmission>0?s.unshift(x):M.transparent===!0?o.unshift(x):t.unshift(x)}function p(y,_){t.length>1&&t.sort(y||FT),s.length>1&&s.sort(_||ug),o.length>1&&o.sort(_||ug)}function g(){for(let y=e,_=r.length;y<_;y++){const M=r[y];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:s,transparent:o,init:l,push:d,unshift:m,finish:g,sort:p}}function OT(){let r=new WeakMap;function e(s,o){const l=r.get(s);let u;return l===void 0?(u=new dg,r.set(s,[u])):o>=l.length?(u=new dg,l.push(u)):u=l[o],u}function t(){r=new WeakMap}return{get:e,dispose:t}}function kT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new oe,color:new Mt};break;case"SpotLight":t={position:new oe,direction:new oe,color:new Mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new oe,color:new Mt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new oe,skyColor:new Mt,groundColor:new Mt};break;case"RectAreaLight":t={color:new Mt,position:new oe,halfWidth:new oe,halfHeight:new oe};break}return r[e.id]=t,t}}}function zT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let BT=0;function HT(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function jT(r){const e=new kT,t=zT(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new oe);const o=new oe,l=new Bt,u=new Bt;function d(p,g){let y=0,_=0,M=0;for(let V=0;V<9;V++)s.probe[V].set(0,0,0);let E=0,w=0,S=0,x=0,b=0,R=0,D=0,X=0,I=0,L=0,j=0;p.sort(HT);const C=g===!0?Math.PI:1;for(let V=0,G=p.length;V<G;V++){const z=p[V],ne=z.color,Y=z.intensity,ue=z.distance,fe=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)y+=ne.r*Y*C,_+=ne.g*Y*C,M+=ne.b*Y*C;else if(z.isLightProbe){for(let k=0;k<9;k++)s.probe[k].addScaledVector(z.sh.coefficients[k],Y);j++}else if(z.isDirectionalLight){const k=e.get(z);if(k.color.copy(z.color).multiplyScalar(z.intensity*C),z.castShadow){const de=z.shadow,te=t.get(z);te.shadowBias=de.bias,te.shadowNormalBias=de.normalBias,te.shadowRadius=de.radius,te.shadowMapSize=de.mapSize,s.directionalShadow[E]=te,s.directionalShadowMap[E]=fe,s.directionalShadowMatrix[E]=z.shadow.matrix,R++}s.directional[E]=k,E++}else if(z.isSpotLight){const k=e.get(z);k.position.setFromMatrixPosition(z.matrixWorld),k.color.copy(ne).multiplyScalar(Y*C),k.distance=ue,k.coneCos=Math.cos(z.angle),k.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),k.decay=z.decay,s.spot[S]=k;const de=z.shadow;if(z.map&&(s.spotLightMap[I]=z.map,I++,de.updateMatrices(z),z.castShadow&&L++),s.spotLightMatrix[S]=de.matrix,z.castShadow){const te=t.get(z);te.shadowBias=de.bias,te.shadowNormalBias=de.normalBias,te.shadowRadius=de.radius,te.shadowMapSize=de.mapSize,s.spotShadow[S]=te,s.spotShadowMap[S]=fe,X++}S++}else if(z.isRectAreaLight){const k=e.get(z);k.color.copy(ne).multiplyScalar(Y),k.halfWidth.set(z.width*.5,0,0),k.halfHeight.set(0,z.height*.5,0),s.rectArea[x]=k,x++}else if(z.isPointLight){const k=e.get(z);if(k.color.copy(z.color).multiplyScalar(z.intensity*C),k.distance=z.distance,k.decay=z.decay,z.castShadow){const de=z.shadow,te=t.get(z);te.shadowBias=de.bias,te.shadowNormalBias=de.normalBias,te.shadowRadius=de.radius,te.shadowMapSize=de.mapSize,te.shadowCameraNear=de.camera.near,te.shadowCameraFar=de.camera.far,s.pointShadow[w]=te,s.pointShadowMap[w]=fe,s.pointShadowMatrix[w]=z.shadow.matrix,D++}s.point[w]=k,w++}else if(z.isHemisphereLight){const k=e.get(z);k.skyColor.copy(z.color).multiplyScalar(Y*C),k.groundColor.copy(z.groundColor).multiplyScalar(Y*C),s.hemi[b]=k,b++}}x>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=De.LTC_FLOAT_1,s.rectAreaLTC2=De.LTC_FLOAT_2):(s.rectAreaLTC1=De.LTC_HALF_1,s.rectAreaLTC2=De.LTC_HALF_2)),s.ambient[0]=y,s.ambient[1]=_,s.ambient[2]=M;const A=s.hash;(A.directionalLength!==E||A.pointLength!==w||A.spotLength!==S||A.rectAreaLength!==x||A.hemiLength!==b||A.numDirectionalShadows!==R||A.numPointShadows!==D||A.numSpotShadows!==X||A.numSpotMaps!==I||A.numLightProbes!==j)&&(s.directional.length=E,s.spot.length=S,s.rectArea.length=x,s.point.length=w,s.hemi.length=b,s.directionalShadow.length=R,s.directionalShadowMap.length=R,s.pointShadow.length=D,s.pointShadowMap.length=D,s.spotShadow.length=X,s.spotShadowMap.length=X,s.directionalShadowMatrix.length=R,s.pointShadowMatrix.length=D,s.spotLightMatrix.length=X+I-L,s.spotLightMap.length=I,s.numSpotLightShadowsWithMaps=L,s.numLightProbes=j,A.directionalLength=E,A.pointLength=w,A.spotLength=S,A.rectAreaLength=x,A.hemiLength=b,A.numDirectionalShadows=R,A.numPointShadows=D,A.numSpotShadows=X,A.numSpotMaps=I,A.numLightProbes=j,s.version=BT++)}function m(p,g){let y=0,_=0,M=0,E=0,w=0;const S=g.matrixWorldInverse;for(let x=0,b=p.length;x<b;x++){const R=p[x];if(R.isDirectionalLight){const D=s.directional[y];D.direction.setFromMatrixPosition(R.matrixWorld),o.setFromMatrixPosition(R.target.matrixWorld),D.direction.sub(o),D.direction.transformDirection(S),y++}else if(R.isSpotLight){const D=s.spot[M];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(S),D.direction.setFromMatrixPosition(R.matrixWorld),o.setFromMatrixPosition(R.target.matrixWorld),D.direction.sub(o),D.direction.transformDirection(S),M++}else if(R.isRectAreaLight){const D=s.rectArea[E];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(S),u.identity(),l.copy(R.matrixWorld),l.premultiply(S),u.extractRotation(l),D.halfWidth.set(R.width*.5,0,0),D.halfHeight.set(0,R.height*.5,0),D.halfWidth.applyMatrix4(u),D.halfHeight.applyMatrix4(u),E++}else if(R.isPointLight){const D=s.point[_];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(S),_++}else if(R.isHemisphereLight){const D=s.hemi[w];D.direction.setFromMatrixPosition(R.matrixWorld),D.direction.transformDirection(S),w++}}}return{setup:d,setupView:m,state:s}}function fg(r){const e=new jT(r),t=[],s=[];function o(g){p.camera=g,t.length=0,s.length=0}function l(g){t.push(g)}function u(g){s.push(g)}function d(g){e.setup(t,g)}function m(g){e.setupView(t,g)}const p={lightsArray:t,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:p,setupLights:d,setupLightsView:m,pushLight:l,pushShadow:u}}function VT(r){let e=new WeakMap;function t(o,l=0){const u=e.get(o);let d;return u===void 0?(d=new fg(r),e.set(o,[d])):l>=u.length?(d=new fg(r),u.push(d)):d=u[l],d}function s(){e=new WeakMap}return{get:t,dispose:s}}class GT extends ro{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class WT extends ro{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const XT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$T=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function qT(r,e,t){let s=new Yd;const o=new _t,l=new _t,u=new rn,d=new GT({depthPacking:jy}),m=new WT,p={},g=t.maxTextureSize,y={[Sr]:Rn,[Rn]:Sr,[mi]:mi},_=new Er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:XT,fragmentShader:$T}),M=_.clone();M.defines.HORIZONTAL_PASS=1;const E=new ji;E.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new _i(E,_),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Og;let x=this.type;this.render=function(I,L,j){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||I.length===0)return;const C=r.getRenderTarget(),A=r.getActiveCubeFace(),V=r.getActiveMipmapLevel(),G=r.state;G.setBlending(xr),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const z=x!==ki&&this.type===ki,ne=x===ki&&this.type!==ki;for(let Y=0,ue=I.length;Y<ue;Y++){const fe=I[Y],k=fe.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",fe,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;o.copy(k.mapSize);const de=k.getFrameExtents();if(o.multiply(de),l.copy(k.mapSize),(o.x>g||o.y>g)&&(o.x>g&&(l.x=Math.floor(g/de.x),o.x=l.x*de.x,k.mapSize.x=l.x),o.y>g&&(l.y=Math.floor(g/de.y),o.y=l.y*de.y,k.mapSize.y=l.y)),k.map===null||z===!0||ne===!0){const O=this.type!==ki?{minFilter:Kn,magFilter:Kn}:{};k.map!==null&&k.map.dispose(),k.map=new ns(o.x,o.y,O),k.map.texture.name=fe.name+".shadowMap",k.camera.updateProjectionMatrix()}r.setRenderTarget(k.map),r.clear();const te=k.getViewportCount();for(let O=0;O<te;O++){const ae=k.getViewport(O);u.set(l.x*ae.x,l.y*ae.y,l.x*ae.z,l.y*ae.w),G.viewport(u),k.updateMatrices(fe,O),s=k.getFrustum(),D(L,j,k.camera,fe,this.type)}k.isPointLightShadow!==!0&&this.type===ki&&b(k,j),k.needsUpdate=!1}x=this.type,S.needsUpdate=!1,r.setRenderTarget(C,A,V)};function b(I,L){const j=e.update(w);_.defines.VSM_SAMPLES!==I.blurSamples&&(_.defines.VSM_SAMPLES=I.blurSamples,M.defines.VSM_SAMPLES=I.blurSamples,_.needsUpdate=!0,M.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new ns(o.x,o.y)),_.uniforms.shadow_pass.value=I.map.texture,_.uniforms.resolution.value=I.mapSize,_.uniforms.radius.value=I.radius,r.setRenderTarget(I.mapPass),r.clear(),r.renderBufferDirect(L,null,j,_,w,null),M.uniforms.shadow_pass.value=I.mapPass.texture,M.uniforms.resolution.value=I.mapSize,M.uniforms.radius.value=I.radius,r.setRenderTarget(I.map),r.clear(),r.renderBufferDirect(L,null,j,M,w,null)}function R(I,L,j,C){let A=null;const V=j.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(V!==void 0)A=V;else if(A=j.isPointLight===!0?m:d,r.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const G=A.uuid,z=L.uuid;let ne=p[G];ne===void 0&&(ne={},p[G]=ne);let Y=ne[z];Y===void 0&&(Y=A.clone(),ne[z]=Y,L.addEventListener("dispose",X)),A=Y}if(A.visible=L.visible,A.wireframe=L.wireframe,C===ki?A.side=L.shadowSide!==null?L.shadowSide:L.side:A.side=L.shadowSide!==null?L.shadowSide:y[L.side],A.alphaMap=L.alphaMap,A.alphaTest=L.alphaTest,A.map=L.map,A.clipShadows=L.clipShadows,A.clippingPlanes=L.clippingPlanes,A.clipIntersection=L.clipIntersection,A.displacementMap=L.displacementMap,A.displacementScale=L.displacementScale,A.displacementBias=L.displacementBias,A.wireframeLinewidth=L.wireframeLinewidth,A.linewidth=L.linewidth,j.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const G=r.properties.get(A);G.light=j}return A}function D(I,L,j,C,A){if(I.visible===!1)return;if(I.layers.test(L.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&A===ki)&&(!I.frustumCulled||s.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,I.matrixWorld);const z=e.update(I),ne=I.material;if(Array.isArray(ne)){const Y=z.groups;for(let ue=0,fe=Y.length;ue<fe;ue++){const k=Y[ue],de=ne[k.materialIndex];if(de&&de.visible){const te=R(I,de,C,A);I.onBeforeShadow(r,I,L,j,z,te,k),r.renderBufferDirect(j,null,z,te,I,k),I.onAfterShadow(r,I,L,j,z,te,k)}}}else if(ne.visible){const Y=R(I,ne,C,A);I.onBeforeShadow(r,I,L,j,z,Y,null),r.renderBufferDirect(j,null,z,Y,I,null),I.onAfterShadow(r,I,L,j,z,Y,null)}}const G=I.children;for(let z=0,ne=G.length;z<ne;z++)D(G[z],L,j,C,A)}function X(I){I.target.removeEventListener("dispose",X);for(const j in p){const C=p[j],A=I.target.uuid;A in C&&(C[A].dispose(),delete C[A])}}}function YT(r){function e(){let $=!1;const xe=new rn;let me=null;const Re=new rn(0,0,0,0);return{setMask:function(Fe){me!==Fe&&!$&&(r.colorMask(Fe,Fe,Fe,Fe),me=Fe)},setLocked:function(Fe){$=Fe},setClear:function(Fe,pt,wt,Rt,Vt){Vt===!0&&(Fe*=Rt,pt*=Rt,wt*=Rt),xe.set(Fe,pt,wt,Rt),Re.equals(xe)===!1&&(r.clearColor(Fe,pt,wt,Rt),Re.copy(xe))},reset:function(){$=!1,me=null,Re.set(-1,0,0,0)}}}function t(){let $=!1,xe=null,me=null,Re=null;return{setTest:function(Fe){Fe?he(r.DEPTH_TEST):ge(r.DEPTH_TEST)},setMask:function(Fe){xe!==Fe&&!$&&(r.depthMask(Fe),xe=Fe)},setFunc:function(Fe){if(me!==Fe){switch(Fe){case py:r.depthFunc(r.NEVER);break;case my:r.depthFunc(r.ALWAYS);break;case gy:r.depthFunc(r.LESS);break;case jl:r.depthFunc(r.LEQUAL);break;case vy:r.depthFunc(r.EQUAL);break;case _y:r.depthFunc(r.GEQUAL);break;case xy:r.depthFunc(r.GREATER);break;case yy:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}me=Fe}},setLocked:function(Fe){$=Fe},setClear:function(Fe){Re!==Fe&&(r.clearDepth(Fe),Re=Fe)},reset:function(){$=!1,xe=null,me=null,Re=null}}}function s(){let $=!1,xe=null,me=null,Re=null,Fe=null,pt=null,wt=null,Rt=null,Vt=null;return{setTest:function(yt){$||(yt?he(r.STENCIL_TEST):ge(r.STENCIL_TEST))},setMask:function(yt){xe!==yt&&!$&&(r.stencilMask(yt),xe=yt)},setFunc:function(yt,yn,Zt){(me!==yt||Re!==yn||Fe!==Zt)&&(r.stencilFunc(yt,yn,Zt),me=yt,Re=yn,Fe=Zt)},setOp:function(yt,yn,Zt){(pt!==yt||wt!==yn||Rt!==Zt)&&(r.stencilOp(yt,yn,Zt),pt=yt,wt=yn,Rt=Zt)},setLocked:function(yt){$=yt},setClear:function(yt){Vt!==yt&&(r.clearStencil(yt),Vt=yt)},reset:function(){$=!1,xe=null,me=null,Re=null,Fe=null,pt=null,wt=null,Rt=null,Vt=null}}}const o=new e,l=new t,u=new s,d=new WeakMap,m=new WeakMap;let p={},g={},y=new WeakMap,_=[],M=null,E=!1,w=null,S=null,x=null,b=null,R=null,D=null,X=null,I=new Mt(0,0,0),L=0,j=!1,C=null,A=null,V=null,G=null,z=null;const ne=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,ue=0;const fe=r.getParameter(r.VERSION);fe.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(fe)[1]),Y=ue>=1):fe.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(fe)[1]),Y=ue>=2);let k=null,de={};const te=r.getParameter(r.SCISSOR_BOX),O=r.getParameter(r.VIEWPORT),ae=new rn().fromArray(te),Ue=new rn().fromArray(O);function Q($,xe,me,Re){const Fe=new Uint8Array(4),pt=r.createTexture();r.bindTexture($,pt),r.texParameteri($,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri($,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let wt=0;wt<me;wt++)$===r.TEXTURE_3D||$===r.TEXTURE_2D_ARRAY?r.texImage3D(xe,0,r.RGBA,1,1,Re,0,r.RGBA,r.UNSIGNED_BYTE,Fe):r.texImage2D(xe+wt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Fe);return pt}const pe={};pe[r.TEXTURE_2D]=Q(r.TEXTURE_2D,r.TEXTURE_2D,1),pe[r.TEXTURE_CUBE_MAP]=Q(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[r.TEXTURE_2D_ARRAY]=Q(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),pe[r.TEXTURE_3D]=Q(r.TEXTURE_3D,r.TEXTURE_3D,1,1),o.setClear(0,0,0,1),l.setClear(1),u.setClear(0),he(r.DEPTH_TEST),l.setFunc(jl),ut(!1),rt($p),he(r.CULL_FACE),mt(xr);function he($){p[$]!==!0&&(r.enable($),p[$]=!0)}function ge($){p[$]!==!1&&(r.disable($),p[$]=!1)}function ke($,xe){return g[$]!==xe?(r.bindFramebuffer($,xe),g[$]=xe,$===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=xe),$===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=xe),!0):!1}function He($,xe){let me=_,Re=!1;if($){me=y.get(xe),me===void 0&&(me=[],y.set(xe,me));const Fe=$.textures;if(me.length!==Fe.length||me[0]!==r.COLOR_ATTACHMENT0){for(let pt=0,wt=Fe.length;pt<wt;pt++)me[pt]=r.COLOR_ATTACHMENT0+pt;me.length=Fe.length,Re=!0}}else me[0]!==r.BACK&&(me[0]=r.BACK,Re=!0);Re&&r.drawBuffers(me)}function q($){return M!==$?(r.useProgram($),M=$,!0):!1}const ht={[qr]:r.FUNC_ADD,[Z0]:r.FUNC_SUBTRACT,[Q0]:r.FUNC_REVERSE_SUBTRACT};ht[J0]=r.MIN,ht[ey]=r.MAX;const Ye={[ty]:r.ZERO,[ny]:r.ONE,[iy]:r.SRC_COLOR,[Rd]:r.SRC_ALPHA,[cy]:r.SRC_ALPHA_SATURATE,[oy]:r.DST_COLOR,[sy]:r.DST_ALPHA,[ry]:r.ONE_MINUS_SRC_COLOR,[Nd]:r.ONE_MINUS_SRC_ALPHA,[ly]:r.ONE_MINUS_DST_COLOR,[ay]:r.ONE_MINUS_DST_ALPHA,[uy]:r.CONSTANT_COLOR,[dy]:r.ONE_MINUS_CONSTANT_COLOR,[fy]:r.CONSTANT_ALPHA,[hy]:r.ONE_MINUS_CONSTANT_ALPHA};function mt($,xe,me,Re,Fe,pt,wt,Rt,Vt,yt){if($===xr){E===!0&&(ge(r.BLEND),E=!1);return}if(E===!1&&(he(r.BLEND),E=!0),$!==K0){if($!==w||yt!==j){if((S!==qr||R!==qr)&&(r.blendEquation(r.FUNC_ADD),S=qr,R=qr),yt)switch($){case qs:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case qp:r.blendFunc(r.ONE,r.ONE);break;case Yp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Kp:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",$);break}else switch($){case qs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case qp:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Yp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Kp:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",$);break}x=null,b=null,D=null,X=null,I.set(0,0,0),L=0,w=$,j=yt}return}Fe=Fe||xe,pt=pt||me,wt=wt||Re,(xe!==S||Fe!==R)&&(r.blendEquationSeparate(ht[xe],ht[Fe]),S=xe,R=Fe),(me!==x||Re!==b||pt!==D||wt!==X)&&(r.blendFuncSeparate(Ye[me],Ye[Re],Ye[pt],Ye[wt]),x=me,b=Re,D=pt,X=wt),(Rt.equals(I)===!1||Vt!==L)&&(r.blendColor(Rt.r,Rt.g,Rt.b,Vt),I.copy(Rt),L=Vt),w=$,j=!1}function Ke($,xe){$.side===mi?ge(r.CULL_FACE):he(r.CULL_FACE);let me=$.side===Rn;xe&&(me=!me),ut(me),$.blending===qs&&$.transparent===!1?mt(xr):mt($.blending,$.blendEquation,$.blendSrc,$.blendDst,$.blendEquationAlpha,$.blendSrcAlpha,$.blendDstAlpha,$.blendColor,$.blendAlpha,$.premultipliedAlpha),l.setFunc($.depthFunc),l.setTest($.depthTest),l.setMask($.depthWrite),o.setMask($.colorWrite);const Re=$.stencilWrite;u.setTest(Re),Re&&(u.setMask($.stencilWriteMask),u.setFunc($.stencilFunc,$.stencilRef,$.stencilFuncMask),u.setOp($.stencilFail,$.stencilZFail,$.stencilZPass)),At($.polygonOffset,$.polygonOffsetFactor,$.polygonOffsetUnits),$.alphaToCoverage===!0?he(r.SAMPLE_ALPHA_TO_COVERAGE):ge(r.SAMPLE_ALPHA_TO_COVERAGE)}function ut($){C!==$&&($?r.frontFace(r.CW):r.frontFace(r.CCW),C=$)}function rt($){$!==$0?(he(r.CULL_FACE),$!==A&&($===$p?r.cullFace(r.BACK):$===q0?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ge(r.CULL_FACE),A=$}function at($){$!==V&&(Y&&r.lineWidth($),V=$)}function At($,xe,me){$?(he(r.POLYGON_OFFSET_FILL),(G!==xe||z!==me)&&(r.polygonOffset(xe,me),G=xe,z=me)):ge(r.POLYGON_OFFSET_FILL)}function F($){$?he(r.SCISSOR_TEST):ge(r.SCISSOR_TEST)}function N($){$===void 0&&($=r.TEXTURE0+ne-1),k!==$&&(r.activeTexture($),k=$)}function ce($,xe,me){me===void 0&&(k===null?me=r.TEXTURE0+ne-1:me=k);let Re=de[me];Re===void 0&&(Re={type:void 0,texture:void 0},de[me]=Re),(Re.type!==$||Re.texture!==xe)&&(k!==me&&(r.activeTexture(me),k=me),r.bindTexture($,xe||pe[$]),Re.type=$,Re.texture=xe)}function ve(){const $=de[k];$!==void 0&&$.type!==void 0&&(r.bindTexture($.type,null),$.type=void 0,$.texture=void 0)}function Me(){try{r.compressedTexImage2D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function we(){try{r.compressedTexImage3D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function qe(){try{r.texSubImage2D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Pe(){try{r.texSubImage3D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Ne(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function nt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function B(){try{r.texStorage2D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function J(){try{r.texStorage3D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function _e(){try{r.texImage2D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Te(){try{r.texImage3D.apply(r,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Ee($){ae.equals($)===!1&&(r.scissor($.x,$.y,$.z,$.w),ae.copy($))}function Be($){Ue.equals($)===!1&&(r.viewport($.x,$.y,$.z,$.w),Ue.copy($))}function Ie($,xe){let me=m.get(xe);me===void 0&&(me=new WeakMap,m.set(xe,me));let Re=me.get($);Re===void 0&&(Re=r.getUniformBlockIndex(xe,$.name),me.set($,Re))}function dt($,xe){const Re=m.get(xe).get($);d.get(xe)!==Re&&(r.uniformBlockBinding(xe,Re,$.__bindingPointIndex),d.set(xe,Re))}function st(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),p={},k=null,de={},g={},y=new WeakMap,_=[],M=null,E=!1,w=null,S=null,x=null,b=null,R=null,D=null,X=null,I=new Mt(0,0,0),L=0,j=!1,C=null,A=null,V=null,G=null,z=null,ae.set(0,0,r.canvas.width,r.canvas.height),Ue.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),u.reset()}return{buffers:{color:o,depth:l,stencil:u},enable:he,disable:ge,bindFramebuffer:ke,drawBuffers:He,useProgram:q,setBlending:mt,setMaterial:Ke,setFlipSided:ut,setCullFace:rt,setLineWidth:at,setPolygonOffset:At,setScissorTest:F,activeTexture:N,bindTexture:ce,unbindTexture:ve,compressedTexImage2D:Me,compressedTexImage3D:we,texImage2D:_e,texImage3D:Te,updateUBOMapping:Ie,uniformBlockBinding:dt,texStorage2D:B,texStorage3D:J,texSubImage2D:qe,texSubImage3D:Pe,compressedTexSubImage2D:Ne,compressedTexSubImage3D:nt,scissor:Ee,viewport:Be,reset:st}}function KT(r,e,t,s,o,l,u){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new _t,g=new WeakMap;let y;const _=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(F,N){return M?new OffscreenCanvas(F,N):$l("canvas")}function w(F,N,ce){let ve=1;const Me=At(F);if((Me.width>ce||Me.height>ce)&&(ve=ce/Math.max(Me.width,Me.height)),ve<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const we=Math.floor(ve*Me.width),qe=Math.floor(ve*Me.height);y===void 0&&(y=E(we,qe));const Pe=N?E(we,qe):y;return Pe.width=we,Pe.height=qe,Pe.getContext("2d").drawImage(F,0,0,we,qe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Me.width+"x"+Me.height+") to ("+we+"x"+qe+")."),Pe}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Me.width+"x"+Me.height+")."),F;return F}function S(F){return F.generateMipmaps&&F.minFilter!==Kn&&F.minFilter!==oi}function x(F){r.generateMipmap(F)}function b(F,N,ce,ve,Me=!1){if(F!==null){if(r[F]!==void 0)return r[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let we=N;if(N===r.RED&&(ce===r.FLOAT&&(we=r.R32F),ce===r.HALF_FLOAT&&(we=r.R16F),ce===r.UNSIGNED_BYTE&&(we=r.R8)),N===r.RED_INTEGER&&(ce===r.UNSIGNED_BYTE&&(we=r.R8UI),ce===r.UNSIGNED_SHORT&&(we=r.R16UI),ce===r.UNSIGNED_INT&&(we=r.R32UI),ce===r.BYTE&&(we=r.R8I),ce===r.SHORT&&(we=r.R16I),ce===r.INT&&(we=r.R32I)),N===r.RG&&(ce===r.FLOAT&&(we=r.RG32F),ce===r.HALF_FLOAT&&(we=r.RG16F),ce===r.UNSIGNED_BYTE&&(we=r.RG8)),N===r.RG_INTEGER&&(ce===r.UNSIGNED_BYTE&&(we=r.RG8UI),ce===r.UNSIGNED_SHORT&&(we=r.RG16UI),ce===r.UNSIGNED_INT&&(we=r.RG32UI),ce===r.BYTE&&(we=r.RG8I),ce===r.SHORT&&(we=r.RG16I),ce===r.INT&&(we=r.RG32I)),N===r.RGB&&ce===r.UNSIGNED_INT_5_9_9_9_REV&&(we=r.RGB9_E5),N===r.RGBA){const qe=Me?Vl:Tt.getTransfer(ve);ce===r.FLOAT&&(we=r.RGBA32F),ce===r.HALF_FLOAT&&(we=r.RGBA16F),ce===r.UNSIGNED_BYTE&&(we=qe===Lt?r.SRGB8_ALPHA8:r.RGBA8),ce===r.UNSIGNED_SHORT_4_4_4_4&&(we=r.RGBA4),ce===r.UNSIGNED_SHORT_5_5_5_1&&(we=r.RGB5_A1)}return(we===r.R16F||we===r.R32F||we===r.RG16F||we===r.RG32F||we===r.RGBA16F||we===r.RGBA32F)&&e.get("EXT_color_buffer_float"),we}function R(F,N){return S(F)===!0||F.isFramebufferTexture&&F.minFilter!==Kn&&F.minFilter!==oi?Math.log2(Math.max(N.width,N.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?N.mipmaps.length:1}function D(F){const N=F.target;N.removeEventListener("dispose",D),I(N),N.isVideoTexture&&g.delete(N)}function X(F){const N=F.target;N.removeEventListener("dispose",X),j(N)}function I(F){const N=s.get(F);if(N.__webglInit===void 0)return;const ce=F.source,ve=_.get(ce);if(ve){const Me=ve[N.__cacheKey];Me.usedTimes--,Me.usedTimes===0&&L(F),Object.keys(ve).length===0&&_.delete(ce)}s.remove(F)}function L(F){const N=s.get(F);r.deleteTexture(N.__webglTexture);const ce=F.source,ve=_.get(ce);delete ve[N.__cacheKey],u.memory.textures--}function j(F){const N=s.get(F);if(F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let ve=0;ve<6;ve++){if(Array.isArray(N.__webglFramebuffer[ve]))for(let Me=0;Me<N.__webglFramebuffer[ve].length;Me++)r.deleteFramebuffer(N.__webglFramebuffer[ve][Me]);else r.deleteFramebuffer(N.__webglFramebuffer[ve]);N.__webglDepthbuffer&&r.deleteRenderbuffer(N.__webglDepthbuffer[ve])}else{if(Array.isArray(N.__webglFramebuffer))for(let ve=0;ve<N.__webglFramebuffer.length;ve++)r.deleteFramebuffer(N.__webglFramebuffer[ve]);else r.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&r.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&r.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let ve=0;ve<N.__webglColorRenderbuffer.length;ve++)N.__webglColorRenderbuffer[ve]&&r.deleteRenderbuffer(N.__webglColorRenderbuffer[ve]);N.__webglDepthRenderbuffer&&r.deleteRenderbuffer(N.__webglDepthRenderbuffer)}const ce=F.textures;for(let ve=0,Me=ce.length;ve<Me;ve++){const we=s.get(ce[ve]);we.__webglTexture&&(r.deleteTexture(we.__webglTexture),u.memory.textures--),s.remove(ce[ve])}s.remove(F)}let C=0;function A(){C=0}function V(){const F=C;return F>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+o.maxTextures),C+=1,F}function G(F){const N=[];return N.push(F.wrapS),N.push(F.wrapT),N.push(F.wrapR||0),N.push(F.magFilter),N.push(F.minFilter),N.push(F.anisotropy),N.push(F.internalFormat),N.push(F.format),N.push(F.type),N.push(F.generateMipmaps),N.push(F.premultiplyAlpha),N.push(F.flipY),N.push(F.unpackAlignment),N.push(F.colorSpace),N.join()}function z(F,N){const ce=s.get(F);if(F.isVideoTexture&&rt(F),F.isRenderTargetTexture===!1&&F.version>0&&ce.__version!==F.version){const ve=F.image;if(ve===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ve.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ae(ce,F,N);return}}t.bindTexture(r.TEXTURE_2D,ce.__webglTexture,r.TEXTURE0+N)}function ne(F,N){const ce=s.get(F);if(F.version>0&&ce.__version!==F.version){ae(ce,F,N);return}t.bindTexture(r.TEXTURE_2D_ARRAY,ce.__webglTexture,r.TEXTURE0+N)}function Y(F,N){const ce=s.get(F);if(F.version>0&&ce.__version!==F.version){ae(ce,F,N);return}t.bindTexture(r.TEXTURE_3D,ce.__webglTexture,r.TEXTURE0+N)}function ue(F,N){const ce=s.get(F);if(F.version>0&&ce.__version!==F.version){Ue(ce,F,N);return}t.bindTexture(r.TEXTURE_CUBE_MAP,ce.__webglTexture,r.TEXTURE0+N)}const fe={[Dd]:r.REPEAT,[Zr]:r.CLAMP_TO_EDGE,[Ud]:r.MIRRORED_REPEAT},k={[Kn]:r.NEAREST,[Ny]:r.NEAREST_MIPMAP_NEAREST,[ml]:r.NEAREST_MIPMAP_LINEAR,[oi]:r.LINEAR,[Gu]:r.LINEAR_MIPMAP_NEAREST,[Qr]:r.LINEAR_MIPMAP_LINEAR},de={[Gy]:r.NEVER,[Ky]:r.ALWAYS,[Wy]:r.LESS,[qg]:r.LEQUAL,[Xy]:r.EQUAL,[Yy]:r.GEQUAL,[$y]:r.GREATER,[qy]:r.NOTEQUAL};function te(F,N){if(N.type===_r&&e.has("OES_texture_float_linear")===!1&&(N.magFilter===oi||N.magFilter===Gu||N.magFilter===ml||N.magFilter===Qr||N.minFilter===oi||N.minFilter===Gu||N.minFilter===ml||N.minFilter===Qr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(F,r.TEXTURE_WRAP_S,fe[N.wrapS]),r.texParameteri(F,r.TEXTURE_WRAP_T,fe[N.wrapT]),(F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY)&&r.texParameteri(F,r.TEXTURE_WRAP_R,fe[N.wrapR]),r.texParameteri(F,r.TEXTURE_MAG_FILTER,k[N.magFilter]),r.texParameteri(F,r.TEXTURE_MIN_FILTER,k[N.minFilter]),N.compareFunction&&(r.texParameteri(F,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(F,r.TEXTURE_COMPARE_FUNC,de[N.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(N.magFilter===Kn||N.minFilter!==ml&&N.minFilter!==Qr||N.type===_r&&e.has("OES_texture_float_linear")===!1)return;if(N.anisotropy>1||s.get(N).__currentAnisotropy){const ce=e.get("EXT_texture_filter_anisotropic");r.texParameterf(F,ce.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(N.anisotropy,o.getMaxAnisotropy())),s.get(N).__currentAnisotropy=N.anisotropy}}}function O(F,N){let ce=!1;F.__webglInit===void 0&&(F.__webglInit=!0,N.addEventListener("dispose",D));const ve=N.source;let Me=_.get(ve);Me===void 0&&(Me={},_.set(ve,Me));const we=G(N);if(we!==F.__cacheKey){Me[we]===void 0&&(Me[we]={texture:r.createTexture(),usedTimes:0},u.memory.textures++,ce=!0),Me[we].usedTimes++;const qe=Me[F.__cacheKey];qe!==void 0&&(Me[F.__cacheKey].usedTimes--,qe.usedTimes===0&&L(N)),F.__cacheKey=we,F.__webglTexture=Me[we].texture}return ce}function ae(F,N,ce){let ve=r.TEXTURE_2D;(N.isDataArrayTexture||N.isCompressedArrayTexture)&&(ve=r.TEXTURE_2D_ARRAY),N.isData3DTexture&&(ve=r.TEXTURE_3D);const Me=O(F,N),we=N.source;t.bindTexture(ve,F.__webglTexture,r.TEXTURE0+ce);const qe=s.get(we);if(we.version!==qe.__version||Me===!0){t.activeTexture(r.TEXTURE0+ce);const Pe=Tt.getPrimaries(Tt.workingColorSpace),Ne=N.colorSpace===vr?null:Tt.getPrimaries(N.colorSpace),nt=N.colorSpace===vr||Pe===Ne?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,N.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,N.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let B=w(N.image,!1,o.maxTextureSize);B=at(N,B);const J=l.convert(N.format,N.colorSpace),_e=l.convert(N.type);let Te=b(N.internalFormat,J,_e,N.colorSpace,N.isVideoTexture);te(ve,N);let Ee;const Be=N.mipmaps,Ie=N.isVideoTexture!==!0,dt=qe.__version===void 0||Me===!0,st=we.dataReady,$=R(N,B);if(N.isDepthTexture)Te=r.DEPTH_COMPONENT16,N.type===_r?Te=r.DEPTH_COMPONENT32F:N.type===ta?Te=r.DEPTH_COMPONENT24:N.type===to&&(Te=r.DEPTH24_STENCIL8),dt&&(Ie?t.texStorage2D(r.TEXTURE_2D,1,Te,B.width,B.height):t.texImage2D(r.TEXTURE_2D,0,Te,B.width,B.height,0,J,_e,null));else if(N.isDataTexture)if(Be.length>0){Ie&&dt&&t.texStorage2D(r.TEXTURE_2D,$,Te,Be[0].width,Be[0].height);for(let xe=0,me=Be.length;xe<me;xe++)Ee=Be[xe],Ie?st&&t.texSubImage2D(r.TEXTURE_2D,xe,0,0,Ee.width,Ee.height,J,_e,Ee.data):t.texImage2D(r.TEXTURE_2D,xe,Te,Ee.width,Ee.height,0,J,_e,Ee.data);N.generateMipmaps=!1}else Ie?(dt&&t.texStorage2D(r.TEXTURE_2D,$,Te,B.width,B.height),st&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,B.width,B.height,J,_e,B.data)):t.texImage2D(r.TEXTURE_2D,0,Te,B.width,B.height,0,J,_e,B.data);else if(N.isCompressedTexture)if(N.isCompressedArrayTexture){Ie&&dt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,$,Te,Be[0].width,Be[0].height,B.depth);for(let xe=0,me=Be.length;xe<me;xe++)Ee=Be[xe],N.format!==vi?J!==null?Ie?st&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,xe,0,0,0,Ee.width,Ee.height,B.depth,J,Ee.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,xe,Te,Ee.width,Ee.height,B.depth,0,Ee.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?st&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,xe,0,0,0,Ee.width,Ee.height,B.depth,J,_e,Ee.data):t.texImage3D(r.TEXTURE_2D_ARRAY,xe,Te,Ee.width,Ee.height,B.depth,0,J,_e,Ee.data)}else{Ie&&dt&&t.texStorage2D(r.TEXTURE_2D,$,Te,Be[0].width,Be[0].height);for(let xe=0,me=Be.length;xe<me;xe++)Ee=Be[xe],N.format!==vi?J!==null?Ie?st&&t.compressedTexSubImage2D(r.TEXTURE_2D,xe,0,0,Ee.width,Ee.height,J,Ee.data):t.compressedTexImage2D(r.TEXTURE_2D,xe,Te,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?st&&t.texSubImage2D(r.TEXTURE_2D,xe,0,0,Ee.width,Ee.height,J,_e,Ee.data):t.texImage2D(r.TEXTURE_2D,xe,Te,Ee.width,Ee.height,0,J,_e,Ee.data)}else if(N.isDataArrayTexture)Ie?(dt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,$,Te,B.width,B.height,B.depth),st&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,B.width,B.height,B.depth,J,_e,B.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,Te,B.width,B.height,B.depth,0,J,_e,B.data);else if(N.isData3DTexture)Ie?(dt&&t.texStorage3D(r.TEXTURE_3D,$,Te,B.width,B.height,B.depth),st&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,B.width,B.height,B.depth,J,_e,B.data)):t.texImage3D(r.TEXTURE_3D,0,Te,B.width,B.height,B.depth,0,J,_e,B.data);else if(N.isFramebufferTexture){if(dt)if(Ie)t.texStorage2D(r.TEXTURE_2D,$,Te,B.width,B.height);else{let xe=B.width,me=B.height;for(let Re=0;Re<$;Re++)t.texImage2D(r.TEXTURE_2D,Re,Te,xe,me,0,J,_e,null),xe>>=1,me>>=1}}else if(Be.length>0){if(Ie&&dt){const xe=At(Be[0]);t.texStorage2D(r.TEXTURE_2D,$,Te,xe.width,xe.height)}for(let xe=0,me=Be.length;xe<me;xe++)Ee=Be[xe],Ie?st&&t.texSubImage2D(r.TEXTURE_2D,xe,0,0,J,_e,Ee):t.texImage2D(r.TEXTURE_2D,xe,Te,J,_e,Ee);N.generateMipmaps=!1}else if(Ie){if(dt){const xe=At(B);t.texStorage2D(r.TEXTURE_2D,$,Te,xe.width,xe.height)}st&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,J,_e,B)}else t.texImage2D(r.TEXTURE_2D,0,Te,J,_e,B);S(N)&&x(ve),qe.__version=we.version,N.onUpdate&&N.onUpdate(N)}F.__version=N.version}function Ue(F,N,ce){if(N.image.length!==6)return;const ve=O(F,N),Me=N.source;t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+ce);const we=s.get(Me);if(Me.version!==we.__version||ve===!0){t.activeTexture(r.TEXTURE0+ce);const qe=Tt.getPrimaries(Tt.workingColorSpace),Pe=N.colorSpace===vr?null:Tt.getPrimaries(N.colorSpace),Ne=N.colorSpace===vr||qe===Pe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,N.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,N.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const nt=N.isCompressedTexture||N.image[0].isCompressedTexture,B=N.image[0]&&N.image[0].isDataTexture,J=[];for(let me=0;me<6;me++)!nt&&!B?J[me]=w(N.image[me],!0,o.maxCubemapSize):J[me]=B?N.image[me].image:N.image[me],J[me]=at(N,J[me]);const _e=J[0],Te=l.convert(N.format,N.colorSpace),Ee=l.convert(N.type),Be=b(N.internalFormat,Te,Ee,N.colorSpace),Ie=N.isVideoTexture!==!0,dt=we.__version===void 0||ve===!0,st=Me.dataReady;let $=R(N,_e);te(r.TEXTURE_CUBE_MAP,N);let xe;if(nt){Ie&&dt&&t.texStorage2D(r.TEXTURE_CUBE_MAP,$,Be,_e.width,_e.height);for(let me=0;me<6;me++){xe=J[me].mipmaps;for(let Re=0;Re<xe.length;Re++){const Fe=xe[Re];N.format!==vi?Te!==null?Ie?st&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,0,0,Fe.width,Fe.height,Te,Fe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,Be,Fe.width,Fe.height,0,Fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,0,0,Fe.width,Fe.height,Te,Ee,Fe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,Be,Fe.width,Fe.height,0,Te,Ee,Fe.data)}}}else{if(xe=N.mipmaps,Ie&&dt){xe.length>0&&$++;const me=At(J[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,$,Be,me.width,me.height)}for(let me=0;me<6;me++)if(B){Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,J[me].width,J[me].height,Te,Ee,J[me].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Be,J[me].width,J[me].height,0,Te,Ee,J[me].data);for(let Re=0;Re<xe.length;Re++){const pt=xe[Re].image[me].image;Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,0,0,pt.width,pt.height,Te,Ee,pt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,Be,pt.width,pt.height,0,Te,Ee,pt.data)}}else{Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Te,Ee,J[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Be,Te,Ee,J[me]);for(let Re=0;Re<xe.length;Re++){const Fe=xe[Re];Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,0,0,Te,Ee,Fe.image[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,Be,Te,Ee,Fe.image[me])}}}S(N)&&x(r.TEXTURE_CUBE_MAP),we.__version=Me.version,N.onUpdate&&N.onUpdate(N)}F.__version=N.version}function Q(F,N,ce,ve,Me,we){const qe=l.convert(ce.format,ce.colorSpace),Pe=l.convert(ce.type),Ne=b(ce.internalFormat,qe,Pe,ce.colorSpace);if(!s.get(N).__hasExternalTextures){const B=Math.max(1,N.width>>we),J=Math.max(1,N.height>>we);Me===r.TEXTURE_3D||Me===r.TEXTURE_2D_ARRAY?t.texImage3D(Me,we,Ne,B,J,N.depth,0,qe,Pe,null):t.texImage2D(Me,we,Ne,B,J,0,qe,Pe,null)}t.bindFramebuffer(r.FRAMEBUFFER,F),ut(N)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ve,Me,s.get(ce).__webglTexture,0,Ke(N)):(Me===r.TEXTURE_2D||Me>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Me<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ve,Me,s.get(ce).__webglTexture,we),t.bindFramebuffer(r.FRAMEBUFFER,null)}function pe(F,N,ce){if(r.bindRenderbuffer(r.RENDERBUFFER,F),N.depthBuffer&&!N.stencilBuffer){let ve=r.DEPTH_COMPONENT24;if(ce||ut(N)){const Me=N.depthTexture;Me&&Me.isDepthTexture&&(Me.type===_r?ve=r.DEPTH_COMPONENT32F:Me.type===ta&&(ve=r.DEPTH_COMPONENT24));const we=Ke(N);ut(N)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,we,ve,N.width,N.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,we,ve,N.width,N.height)}else r.renderbufferStorage(r.RENDERBUFFER,ve,N.width,N.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,F)}else if(N.depthBuffer&&N.stencilBuffer){const ve=Ke(N);ce&&ut(N)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ve,r.DEPTH24_STENCIL8,N.width,N.height):ut(N)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ve,r.DEPTH24_STENCIL8,N.width,N.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,N.width,N.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,F)}else{const ve=N.textures;for(let Me=0;Me<ve.length;Me++){const we=ve[Me],qe=l.convert(we.format,we.colorSpace),Pe=l.convert(we.type),Ne=b(we.internalFormat,qe,Pe,we.colorSpace),nt=Ke(N);ce&&ut(N)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,nt,Ne,N.width,N.height):ut(N)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,nt,Ne,N.width,N.height):r.renderbufferStorage(r.RENDERBUFFER,Ne,N.width,N.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function he(F,N){if(N&&N.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,F),!(N.depthTexture&&N.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(N.depthTexture).__webglTexture||N.depthTexture.image.width!==N.width||N.depthTexture.image.height!==N.height)&&(N.depthTexture.image.width=N.width,N.depthTexture.image.height=N.height,N.depthTexture.needsUpdate=!0),z(N.depthTexture,0);const ve=s.get(N.depthTexture).__webglTexture,Me=Ke(N);if(N.depthTexture.format===Ys)ut(N)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ve,0,Me):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ve,0);else if(N.depthTexture.format===Ja)ut(N)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ve,0,Me):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function ge(F){const N=s.get(F),ce=F.isWebGLCubeRenderTarget===!0;if(F.depthTexture&&!N.__autoAllocateDepthBuffer){if(ce)throw new Error("target.depthTexture not supported in Cube render targets");he(N.__webglFramebuffer,F)}else if(ce){N.__webglDepthbuffer=[];for(let ve=0;ve<6;ve++)t.bindFramebuffer(r.FRAMEBUFFER,N.__webglFramebuffer[ve]),N.__webglDepthbuffer[ve]=r.createRenderbuffer(),pe(N.__webglDepthbuffer[ve],F,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,N.__webglFramebuffer),N.__webglDepthbuffer=r.createRenderbuffer(),pe(N.__webglDepthbuffer,F,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function ke(F,N,ce){const ve=s.get(F);N!==void 0&&Q(ve.__webglFramebuffer,F,F.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),ce!==void 0&&ge(F)}function He(F){const N=F.texture,ce=s.get(F),ve=s.get(N);F.addEventListener("dispose",X);const Me=F.textures,we=F.isWebGLCubeRenderTarget===!0,qe=Me.length>1;if(qe||(ve.__webglTexture===void 0&&(ve.__webglTexture=r.createTexture()),ve.__version=N.version,u.memory.textures++),we){ce.__webglFramebuffer=[];for(let Pe=0;Pe<6;Pe++)if(N.mipmaps&&N.mipmaps.length>0){ce.__webglFramebuffer[Pe]=[];for(let Ne=0;Ne<N.mipmaps.length;Ne++)ce.__webglFramebuffer[Pe][Ne]=r.createFramebuffer()}else ce.__webglFramebuffer[Pe]=r.createFramebuffer()}else{if(N.mipmaps&&N.mipmaps.length>0){ce.__webglFramebuffer=[];for(let Pe=0;Pe<N.mipmaps.length;Pe++)ce.__webglFramebuffer[Pe]=r.createFramebuffer()}else ce.__webglFramebuffer=r.createFramebuffer();if(qe)for(let Pe=0,Ne=Me.length;Pe<Ne;Pe++){const nt=s.get(Me[Pe]);nt.__webglTexture===void 0&&(nt.__webglTexture=r.createTexture(),u.memory.textures++)}if(F.samples>0&&ut(F)===!1){ce.__webglMultisampledFramebuffer=r.createFramebuffer(),ce.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer);for(let Pe=0;Pe<Me.length;Pe++){const Ne=Me[Pe];ce.__webglColorRenderbuffer[Pe]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,ce.__webglColorRenderbuffer[Pe]);const nt=l.convert(Ne.format,Ne.colorSpace),B=l.convert(Ne.type),J=b(Ne.internalFormat,nt,B,Ne.colorSpace,F.isXRRenderTarget===!0),_e=Ke(F);r.renderbufferStorageMultisample(r.RENDERBUFFER,_e,J,F.width,F.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pe,r.RENDERBUFFER,ce.__webglColorRenderbuffer[Pe])}r.bindRenderbuffer(r.RENDERBUFFER,null),F.depthBuffer&&(ce.__webglDepthRenderbuffer=r.createRenderbuffer(),pe(ce.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(we){t.bindTexture(r.TEXTURE_CUBE_MAP,ve.__webglTexture),te(r.TEXTURE_CUBE_MAP,N);for(let Pe=0;Pe<6;Pe++)if(N.mipmaps&&N.mipmaps.length>0)for(let Ne=0;Ne<N.mipmaps.length;Ne++)Q(ce.__webglFramebuffer[Pe][Ne],F,N,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,Ne);else Q(ce.__webglFramebuffer[Pe],F,N,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0);S(N)&&x(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(qe){for(let Pe=0,Ne=Me.length;Pe<Ne;Pe++){const nt=Me[Pe],B=s.get(nt);t.bindTexture(r.TEXTURE_2D,B.__webglTexture),te(r.TEXTURE_2D,nt),Q(ce.__webglFramebuffer,F,nt,r.COLOR_ATTACHMENT0+Pe,r.TEXTURE_2D,0),S(nt)&&x(r.TEXTURE_2D)}t.unbindTexture()}else{let Pe=r.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Pe=F.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Pe,ve.__webglTexture),te(Pe,N),N.mipmaps&&N.mipmaps.length>0)for(let Ne=0;Ne<N.mipmaps.length;Ne++)Q(ce.__webglFramebuffer[Ne],F,N,r.COLOR_ATTACHMENT0,Pe,Ne);else Q(ce.__webglFramebuffer,F,N,r.COLOR_ATTACHMENT0,Pe,0);S(N)&&x(Pe),t.unbindTexture()}F.depthBuffer&&ge(F)}function q(F){const N=F.textures;for(let ce=0,ve=N.length;ce<ve;ce++){const Me=N[ce];if(S(Me)){const we=F.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,qe=s.get(Me).__webglTexture;t.bindTexture(we,qe),x(we),t.unbindTexture()}}}const ht=[],Ye=[];function mt(F){if(F.samples>0){if(ut(F)===!1){const N=F.textures,ce=F.width,ve=F.height;let Me=r.COLOR_BUFFER_BIT;const we=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,qe=s.get(F),Pe=N.length>1;if(Pe)for(let Ne=0;Ne<N.length;Ne++)t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,qe.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglFramebuffer);for(let Ne=0;Ne<N.length;Ne++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(Me|=r.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(Me|=r.STENCIL_BUFFER_BIT)),Pe){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Ne]);const nt=s.get(N[Ne]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,nt,0)}r.blitFramebuffer(0,0,ce,ve,0,0,ce,ve,Me,r.NEAREST),m===!0&&(ht.length=0,Ye.length=0,ht.push(r.COLOR_ATTACHMENT0+Ne),F.depthBuffer&&F.resolveDepthBuffer===!1&&(ht.push(we),Ye.push(we),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Ye)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ht))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Pe)for(let Ne=0;Ne<N.length;Ne++){t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Ne]);const nt=s.get(N[Ne]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.TEXTURE_2D,nt,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&m){const N=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[N])}}}function Ke(F){return Math.min(o.maxSamples,F.samples)}function ut(F){const N=s.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&N.__useRenderToTexture!==!1}function rt(F){const N=u.render.frame;g.get(F)!==N&&(g.set(F,N),F.update())}function at(F,N){const ce=F.colorSpace,ve=F.format,Me=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||ce!==Tr&&ce!==vr&&(Tt.getTransfer(ce)===Lt?(ve!==vi||Me!==Mr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ce)),N}function At(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(p.width=F.naturalWidth||F.width,p.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(p.width=F.displayWidth,p.height=F.displayHeight):(p.width=F.width,p.height=F.height),p}this.allocateTextureUnit=V,this.resetTextureUnits=A,this.setTexture2D=z,this.setTexture2DArray=ne,this.setTexture3D=Y,this.setTextureCube=ue,this.rebindTextures=ke,this.setupRenderTarget=He,this.updateRenderTargetMipmap=q,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=ut}function ZT(r,e){function t(s,o=vr){let l;const u=Tt.getTransfer(o);if(s===Mr)return r.UNSIGNED_BYTE;if(s===jg)return r.UNSIGNED_SHORT_4_4_4_4;if(s===Vg)return r.UNSIGNED_SHORT_5_5_5_1;if(s===Dy)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Py)return r.BYTE;if(s===Ly)return r.SHORT;if(s===Bg)return r.UNSIGNED_SHORT;if(s===Hg)return r.INT;if(s===ta)return r.UNSIGNED_INT;if(s===_r)return r.FLOAT;if(s===Ql)return r.HALF_FLOAT;if(s===Uy)return r.ALPHA;if(s===Iy)return r.RGB;if(s===vi)return r.RGBA;if(s===Fy)return r.LUMINANCE;if(s===Oy)return r.LUMINANCE_ALPHA;if(s===Ys)return r.DEPTH_COMPONENT;if(s===Ja)return r.DEPTH_STENCIL;if(s===ky)return r.RED;if(s===Gg)return r.RED_INTEGER;if(s===zy)return r.RG;if(s===Wg)return r.RG_INTEGER;if(s===Xg)return r.RGBA_INTEGER;if(s===Wu||s===Xu||s===$u||s===qu)if(u===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(s===Wu)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===$u)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===qu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(s===Wu)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===$u)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===qu)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Zp||s===Qp||s===Jp||s===em)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(s===Zp)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Qp)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Jp)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===em)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===tm||s===nm||s===im)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(s===tm||s===nm)return u===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(s===im)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===rm||s===sm||s===am||s===om||s===lm||s===cm||s===um||s===dm||s===fm||s===hm||s===pm||s===mm||s===gm||s===vm)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(s===rm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===sm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===am)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===om)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===lm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===cm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===um)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===dm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===fm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===hm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===pm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===mm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===gm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===vm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Yu||s===_m||s===xm)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(s===Yu)return u===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===_m)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===xm)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===By||s===ym||s===Sm||s===Mm)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(s===Yu)return l.COMPRESSED_RED_RGTC1_EXT;if(s===ym)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Sm)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Mm)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===to?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:t}}class QT extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ka extends gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const JT={type:"move"};class Md{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ka,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ka,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new oe,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new oe),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ka,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new oe,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new oe),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const s of e.hand.values())this._getHandJoint(t,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,s){let o=null,l=null,u=null;const d=this._targetRay,m=this._grip,p=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(p&&e.hand){u=!0;for(const w of e.hand.values()){const S=t.getJointPose(w,s),x=this._getHandJoint(p,w);S!==null&&(x.matrix.fromArray(S.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=S.radius),x.visible=S!==null}const g=p.joints["index-finger-tip"],y=p.joints["thumb-tip"],_=g.position.distanceTo(y.position),M=.02,E=.005;p.inputState.pinching&&_>M+E?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&_<=M-E&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,s),l!==null&&(m.matrix.fromArray(l.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,l.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(l.linearVelocity)):m.hasLinearVelocity=!1,l.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(l.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(o=t.getPose(e.targetRaySpace,s),o===null&&l!==null&&(o=l),o!==null&&(d.matrix.fromArray(o.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,o.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(o.linearVelocity)):d.hasLinearVelocity=!1,o.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(o.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(JT)))}return d!==null&&(d.visible=o!==null),m!==null&&(m.visible=l!==null),p!==null&&(p.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const s=new Ka;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[t.jointName]=s,e.add(s)}return e.joints[t.jointName]}}const e1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,t1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class n1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,s){if(this.texture===null){const o=new Nn,l=e.properties.get(o);l.__webglTexture=t.texture,(t.depthNear!=s.depthNear||t.depthFar!=s.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}render(e,t){if(this.texture!==null){if(this.mesh===null){const s=t.cameras[0].viewport,o=new Er({vertexShader:e1,fragmentShader:t1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:s.z},depthHeight:{value:s.w}}});this.mesh=new _i(new ec(20,20),o)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class i1 extends ra{constructor(e,t){super();const s=this;let o=null,l=1,u=null,d="local-floor",m=1,p=null,g=null,y=null,_=null,M=null,E=null;const w=new n1,S=t.getContextAttributes();let x=null,b=null;const R=[],D=[],X=new _t;let I=null;const L=new qn;L.layers.enable(1),L.viewport=new rn;const j=new qn;j.layers.enable(2),j.viewport=new rn;const C=[L,j],A=new QT;A.layers.enable(1),A.layers.enable(2);let V=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let pe=R[Q];return pe===void 0&&(pe=new Md,R[Q]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(Q){let pe=R[Q];return pe===void 0&&(pe=new Md,R[Q]=pe),pe.getGripSpace()},this.getHand=function(Q){let pe=R[Q];return pe===void 0&&(pe=new Md,R[Q]=pe),pe.getHandSpace()};function z(Q){const pe=D.indexOf(Q.inputSource);if(pe===-1)return;const he=R[pe];he!==void 0&&(he.update(Q.inputSource,Q.frame,p||u),he.dispatchEvent({type:Q.type,data:Q.inputSource}))}function ne(){o.removeEventListener("select",z),o.removeEventListener("selectstart",z),o.removeEventListener("selectend",z),o.removeEventListener("squeeze",z),o.removeEventListener("squeezestart",z),o.removeEventListener("squeezeend",z),o.removeEventListener("end",ne),o.removeEventListener("inputsourceschange",Y);for(let Q=0;Q<R.length;Q++){const pe=D[Q];pe!==null&&(D[Q]=null,R[Q].disconnect(pe))}V=null,G=null,w.reset(),e.setRenderTarget(x),M=null,_=null,y=null,o=null,b=null,Ue.stop(),s.isPresenting=!1,e.setPixelRatio(I),e.setSize(X.width,X.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){l=Q,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){d=Q,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||u},this.setReferenceSpace=function(Q){p=Q},this.getBaseLayer=function(){return _!==null?_:M},this.getBinding=function(){return y},this.getFrame=function(){return E},this.getSession=function(){return o},this.setSession=async function(Q){if(o=Q,o!==null){if(x=e.getRenderTarget(),o.addEventListener("select",z),o.addEventListener("selectstart",z),o.addEventListener("selectend",z),o.addEventListener("squeeze",z),o.addEventListener("squeezestart",z),o.addEventListener("squeezeend",z),o.addEventListener("end",ne),o.addEventListener("inputsourceschange",Y),S.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(X),o.renderState.layers===void 0){const pe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};M=new XRWebGLLayer(o,t,pe),o.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),b=new ns(M.framebufferWidth,M.framebufferHeight,{format:vi,type:Mr,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let pe=null,he=null,ge=null;S.depth&&(ge=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=S.stencil?Ja:Ys,he=S.stencil?to:ta);const ke={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:l};y=new XRWebGLBinding(o,t),_=y.createProjectionLayer(ke),o.updateRenderState({layers:[_]}),e.setPixelRatio(1),e.setSize(_.textureWidth,_.textureHeight,!1),b=new ns(_.textureWidth,_.textureHeight,{format:vi,type:Mr,depthTexture:new lv(_.textureWidth,_.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:_.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(m),p=null,u=await o.requestReferenceSpace(d),Ue.setContext(o),Ue.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode};function Y(Q){for(let pe=0;pe<Q.removed.length;pe++){const he=Q.removed[pe],ge=D.indexOf(he);ge>=0&&(D[ge]=null,R[ge].disconnect(he))}for(let pe=0;pe<Q.added.length;pe++){const he=Q.added[pe];let ge=D.indexOf(he);if(ge===-1){for(let He=0;He<R.length;He++)if(He>=D.length){D.push(he),ge=He;break}else if(D[He]===null){D[He]=he,ge=He;break}if(ge===-1)break}const ke=R[ge];ke&&ke.connect(he)}}const ue=new oe,fe=new oe;function k(Q,pe,he){ue.setFromMatrixPosition(pe.matrixWorld),fe.setFromMatrixPosition(he.matrixWorld);const ge=ue.distanceTo(fe),ke=pe.projectionMatrix.elements,He=he.projectionMatrix.elements,q=ke[14]/(ke[10]-1),ht=ke[14]/(ke[10]+1),Ye=(ke[9]+1)/ke[5],mt=(ke[9]-1)/ke[5],Ke=(ke[8]-1)/ke[0],ut=(He[8]+1)/He[0],rt=q*Ke,at=q*ut,At=ge/(-Ke+ut),F=At*-Ke;pe.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(F),Q.translateZ(At),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert();const N=q+At,ce=ht+At,ve=rt-F,Me=at+(ge-F),we=Ye*ht/ce*N,qe=mt*ht/ce*N;Q.projectionMatrix.makePerspective(ve,Me,we,qe,N,ce),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}function de(Q,pe){pe===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(pe.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(o===null)return;w.texture!==null&&(Q.near=w.depthNear,Q.far=w.depthFar),A.near=j.near=L.near=Q.near,A.far=j.far=L.far=Q.far,(V!==A.near||G!==A.far)&&(o.updateRenderState({depthNear:A.near,depthFar:A.far}),V=A.near,G=A.far,L.near=V,L.far=G,j.near=V,j.far=G,L.updateProjectionMatrix(),j.updateProjectionMatrix(),Q.updateProjectionMatrix());const pe=Q.parent,he=A.cameras;de(A,pe);for(let ge=0;ge<he.length;ge++)de(he[ge],pe);he.length===2?k(A,L,j):A.projectionMatrix.copy(L.projectionMatrix),te(Q,A,pe)};function te(Q,pe,he){he===null?Q.matrix.copy(pe.matrixWorld):(Q.matrix.copy(he.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(pe.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(pe.projectionMatrix),Q.projectionMatrixInverse.copy(pe.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Id*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(_===null&&M===null))return m},this.setFoveation=function(Q){m=Q,_!==null&&(_.fixedFoveation=Q),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=Q)},this.hasDepthSensing=function(){return w.texture!==null};let O=null;function ae(Q,pe){if(g=pe.getViewerPose(p||u),E=pe,g!==null){const he=g.views;M!==null&&(e.setRenderTargetFramebuffer(b,M.framebuffer),e.setRenderTarget(b));let ge=!1;he.length!==A.cameras.length&&(A.cameras.length=0,ge=!0);for(let He=0;He<he.length;He++){const q=he[He];let ht=null;if(M!==null)ht=M.getViewport(q);else{const mt=y.getViewSubImage(_,q);ht=mt.viewport,He===0&&(e.setRenderTargetTextures(b,mt.colorTexture,_.ignoreDepthValues?void 0:mt.depthStencilTexture),e.setRenderTarget(b))}let Ye=C[He];Ye===void 0&&(Ye=new qn,Ye.layers.enable(He),Ye.viewport=new rn,C[He]=Ye),Ye.matrix.fromArray(q.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(q.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(ht.x,ht.y,ht.width,ht.height),He===0&&(A.matrix.copy(Ye.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),ge===!0&&A.cameras.push(Ye)}const ke=o.enabledFeatures;if(ke&&ke.includes("depth-sensing")){const He=y.getDepthInformation(he[0]);He&&He.isValid&&He.texture&&w.init(e,He,o.renderState)}}for(let he=0;he<R.length;he++){const ge=D[he],ke=R[he];ge!==null&&ke!==void 0&&ke.update(ge,pe,p||u)}w.render(e,A),O&&O(Q,pe),pe.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:pe}),E=null}const Ue=new av;Ue.setAnimationLoop(ae),this.setAnimationLoop=function(Q){O=Q},this.dispose=function(){}}}const Wr=new Si,r1=new Bt;function s1(r,e){function t(S,x){S.matrixAutoUpdate===!0&&S.updateMatrix(),x.value.copy(S.matrix)}function s(S,x){x.color.getRGB(S.fogColor.value,iv(r)),x.isFog?(S.fogNear.value=x.near,S.fogFar.value=x.far):x.isFogExp2&&(S.fogDensity.value=x.density)}function o(S,x,b,R,D){x.isMeshBasicMaterial||x.isMeshLambertMaterial?l(S,x):x.isMeshToonMaterial?(l(S,x),y(S,x)):x.isMeshPhongMaterial?(l(S,x),g(S,x)):x.isMeshStandardMaterial?(l(S,x),_(S,x),x.isMeshPhysicalMaterial&&M(S,x,D)):x.isMeshMatcapMaterial?(l(S,x),E(S,x)):x.isMeshDepthMaterial?l(S,x):x.isMeshDistanceMaterial?(l(S,x),w(S,x)):x.isMeshNormalMaterial?l(S,x):x.isLineBasicMaterial?(u(S,x),x.isLineDashedMaterial&&d(S,x)):x.isPointsMaterial?m(S,x,b,R):x.isSpriteMaterial?p(S,x):x.isShadowMaterial?(S.color.value.copy(x.color),S.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function l(S,x){S.opacity.value=x.opacity,x.color&&S.diffuse.value.copy(x.color),x.emissive&&S.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.bumpMap&&(S.bumpMap.value=x.bumpMap,t(x.bumpMap,S.bumpMapTransform),S.bumpScale.value=x.bumpScale,x.side===Rn&&(S.bumpScale.value*=-1)),x.normalMap&&(S.normalMap.value=x.normalMap,t(x.normalMap,S.normalMapTransform),S.normalScale.value.copy(x.normalScale),x.side===Rn&&S.normalScale.value.negate()),x.displacementMap&&(S.displacementMap.value=x.displacementMap,t(x.displacementMap,S.displacementMapTransform),S.displacementScale.value=x.displacementScale,S.displacementBias.value=x.displacementBias),x.emissiveMap&&(S.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,S.emissiveMapTransform)),x.specularMap&&(S.specularMap.value=x.specularMap,t(x.specularMap,S.specularMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest);const b=e.get(x),R=b.envMap,D=b.envMapRotation;if(R&&(S.envMap.value=R,Wr.copy(D),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),S.envMapRotation.value.setFromMatrix4(r1.makeRotationFromEuler(Wr)),S.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=x.reflectivity,S.ior.value=x.ior,S.refractionRatio.value=x.refractionRatio),x.lightMap){S.lightMap.value=x.lightMap;const X=r._useLegacyLights===!0?Math.PI:1;S.lightMapIntensity.value=x.lightMapIntensity*X,t(x.lightMap,S.lightMapTransform)}x.aoMap&&(S.aoMap.value=x.aoMap,S.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,S.aoMapTransform))}function u(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform))}function d(S,x){S.dashSize.value=x.dashSize,S.totalSize.value=x.dashSize+x.gapSize,S.scale.value=x.scale}function m(S,x,b,R){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.size.value=x.size*b,S.scale.value=R*.5,x.map&&(S.map.value=x.map,t(x.map,S.uvTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function p(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.rotation.value=x.rotation,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function g(S,x){S.specular.value.copy(x.specular),S.shininess.value=Math.max(x.shininess,1e-4)}function y(S,x){x.gradientMap&&(S.gradientMap.value=x.gradientMap)}function _(S,x){S.metalness.value=x.metalness,x.metalnessMap&&(S.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,S.metalnessMapTransform)),S.roughness.value=x.roughness,x.roughnessMap&&(S.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,S.roughnessMapTransform)),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)}function M(S,x,b){S.ior.value=x.ior,x.sheen>0&&(S.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),S.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(S.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,S.sheenColorMapTransform)),x.sheenRoughnessMap&&(S.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,S.sheenRoughnessMapTransform))),x.clearcoat>0&&(S.clearcoat.value=x.clearcoat,S.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(S.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,S.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(S.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===Rn&&S.clearcoatNormalScale.value.negate())),x.dispersion>0&&(S.dispersion.value=x.dispersion),x.iridescence>0&&(S.iridescence.value=x.iridescence,S.iridescenceIOR.value=x.iridescenceIOR,S.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(S.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,S.iridescenceMapTransform)),x.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),x.transmission>0&&(S.transmission.value=x.transmission,S.transmissionSamplerMap.value=b.texture,S.transmissionSamplerSize.value.set(b.width,b.height),x.transmissionMap&&(S.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,S.transmissionMapTransform)),S.thickness.value=x.thickness,x.thicknessMap&&(S.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=x.attenuationDistance,S.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(S.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(S.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=x.specularIntensity,S.specularColor.value.copy(x.specularColor),x.specularColorMap&&(S.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,S.specularColorMapTransform)),x.specularIntensityMap&&(S.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,S.specularIntensityMapTransform))}function E(S,x){x.matcap&&(S.matcap.value=x.matcap)}function w(S,x){const b=e.get(x).light;S.referencePosition.value.setFromMatrixPosition(b.matrixWorld),S.nearDistance.value=b.shadow.camera.near,S.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:o}}function a1(r,e,t,s){let o={},l={},u=[];const d=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(b,R){const D=R.program;s.uniformBlockBinding(b,D)}function p(b,R){let D=o[b.id];D===void 0&&(E(b),D=g(b),o[b.id]=D,b.addEventListener("dispose",S));const X=R.program;s.updateUBOMapping(b,X);const I=e.render.frame;l[b.id]!==I&&(_(b),l[b.id]=I)}function g(b){const R=y();b.__bindingPointIndex=R;const D=r.createBuffer(),X=b.__size,I=b.usage;return r.bindBuffer(r.UNIFORM_BUFFER,D),r.bufferData(r.UNIFORM_BUFFER,X,I),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,R,D),D}function y(){for(let b=0;b<d;b++)if(u.indexOf(b)===-1)return u.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function _(b){const R=o[b.id],D=b.uniforms,X=b.__cache;r.bindBuffer(r.UNIFORM_BUFFER,R);for(let I=0,L=D.length;I<L;I++){const j=Array.isArray(D[I])?D[I]:[D[I]];for(let C=0,A=j.length;C<A;C++){const V=j[C];if(M(V,I,C,X)===!0){const G=V.__offset,z=Array.isArray(V.value)?V.value:[V.value];let ne=0;for(let Y=0;Y<z.length;Y++){const ue=z[Y],fe=w(ue);typeof ue=="number"||typeof ue=="boolean"?(V.__data[0]=ue,r.bufferSubData(r.UNIFORM_BUFFER,G+ne,V.__data)):ue.isMatrix3?(V.__data[0]=ue.elements[0],V.__data[1]=ue.elements[1],V.__data[2]=ue.elements[2],V.__data[3]=0,V.__data[4]=ue.elements[3],V.__data[5]=ue.elements[4],V.__data[6]=ue.elements[5],V.__data[7]=0,V.__data[8]=ue.elements[6],V.__data[9]=ue.elements[7],V.__data[10]=ue.elements[8],V.__data[11]=0):(ue.toArray(V.__data,ne),ne+=fe.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,V.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(b,R,D,X){const I=b.value,L=R+"_"+D;if(X[L]===void 0)return typeof I=="number"||typeof I=="boolean"?X[L]=I:X[L]=I.clone(),!0;{const j=X[L];if(typeof I=="number"||typeof I=="boolean"){if(j!==I)return X[L]=I,!0}else if(j.equals(I)===!1)return j.copy(I),!0}return!1}function E(b){const R=b.uniforms;let D=0;const X=16;for(let L=0,j=R.length;L<j;L++){const C=Array.isArray(R[L])?R[L]:[R[L]];for(let A=0,V=C.length;A<V;A++){const G=C[A],z=Array.isArray(G.value)?G.value:[G.value];for(let ne=0,Y=z.length;ne<Y;ne++){const ue=z[ne],fe=w(ue),k=D%X;k!==0&&X-k<fe.boundary&&(D+=X-k),G.__data=new Float32Array(fe.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=D,D+=fe.storage}}}const I=D%X;return I>0&&(D+=X-I),b.__size=D,b.__cache={},this}function w(b){const R={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(R.boundary=4,R.storage=4):b.isVector2?(R.boundary=8,R.storage=8):b.isVector3||b.isColor?(R.boundary=16,R.storage=12):b.isVector4?(R.boundary=16,R.storage=16):b.isMatrix3?(R.boundary=48,R.storage=48):b.isMatrix4?(R.boundary=64,R.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),R}function S(b){const R=b.target;R.removeEventListener("dispose",S);const D=u.indexOf(R.__bindingPointIndex);u.splice(D,1),r.deleteBuffer(o[R.id]),delete o[R.id],delete l[R.id]}function x(){for(const b in o)r.deleteBuffer(o[b]);u=[],o={},l={}}return{bind:m,update:p,dispose:x}}class o1{constructor(e={}){const{canvas:t=Qy(),context:s=null,depth:o=!0,stencil:l=!1,alpha:u=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:y=!1}=e;this.isWebGLRenderer=!0;let _;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=s.getContextAttributes().alpha}else _=u;const M=new Uint32Array(4),E=new Int32Array(4);let w=null,S=null;const x=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hi,this._useLegacyLights=!1,this.toneMapping=yr,this.toneMappingExposure=1;const R=this;let D=!1,X=0,I=0,L=null,j=-1,C=null;const A=new rn,V=new rn;let G=null;const z=new Mt(0);let ne=0,Y=t.width,ue=t.height,fe=1,k=null,de=null;const te=new rn(0,0,Y,ue),O=new rn(0,0,Y,ue);let ae=!1;const Ue=new Yd;let Q=!1,pe=!1;const he=new Bt,ge=new oe,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function He(){return L===null?fe:1}let q=s;function ht(P,K){return t.getContext(P,K)}try{const P={alpha:!0,depth:o,stencil:l,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:y};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Xd}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",me,!1),q===null){const K="webgl2";if(q=ht(K,P),q===null)throw ht(K)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Ye,mt,Ke,ut,rt,at,At,F,N,ce,ve,Me,we,qe,Pe,Ne,nt,B,J,_e,Te,Ee,Be,Ie;function dt(){Ye=new mw(q),Ye.init(),Ee=new ZT(q,Ye),mt=new cw(q,Ye,e,Ee),Ke=new YT(q),ut=new _w(q),rt=new IT,at=new KT(q,Ye,Ke,rt,mt,Ee,ut),At=new dw(R),F=new pw(R),N=new TS(q),Be=new ow(q,N),ce=new gw(q,N,ut,Be),ve=new yw(q,ce,N,ut),J=new xw(q,mt,at),Ne=new uw(rt),Me=new UT(R,At,F,Ye,mt,Be,Ne),we=new s1(R,rt),qe=new OT,Pe=new VT(Ye),B=new aw(R,At,F,Ke,ve,_,m),nt=new qT(R,ve,mt),Ie=new a1(q,ut,mt,Ke),_e=new lw(q,Ye,ut),Te=new vw(q,Ye,ut),ut.programs=Me.programs,R.capabilities=mt,R.extensions=Ye,R.properties=rt,R.renderLists=qe,R.shadowMap=nt,R.state=Ke,R.info=ut}dt();const st=new i1(R,q);this.xr=st,this.getContext=function(){return q},this.getContextAttributes=function(){return q.getContextAttributes()},this.forceContextLoss=function(){const P=Ye.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Ye.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(P){P!==void 0&&(fe=P,this.setSize(Y,ue,!1))},this.getSize=function(P){return P.set(Y,ue)},this.setSize=function(P,K,le=!0){if(st.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=P,ue=K,t.width=Math.floor(P*fe),t.height=Math.floor(K*fe),le===!0&&(t.style.width=P+"px",t.style.height=K+"px"),this.setViewport(0,0,P,K)},this.getDrawingBufferSize=function(P){return P.set(Y*fe,ue*fe).floor()},this.setDrawingBufferSize=function(P,K,le){Y=P,ue=K,fe=le,t.width=Math.floor(P*le),t.height=Math.floor(K*le),this.setViewport(0,0,P,K)},this.getCurrentViewport=function(P){return P.copy(A)},this.getViewport=function(P){return P.copy(te)},this.setViewport=function(P,K,le,re){P.isVector4?te.set(P.x,P.y,P.z,P.w):te.set(P,K,le,re),Ke.viewport(A.copy(te).multiplyScalar(fe).round())},this.getScissor=function(P){return P.copy(O)},this.setScissor=function(P,K,le,re){P.isVector4?O.set(P.x,P.y,P.z,P.w):O.set(P,K,le,re),Ke.scissor(V.copy(O).multiplyScalar(fe).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(P){Ke.setScissorTest(ae=P)},this.setOpaqueSort=function(P){k=P},this.setTransparentSort=function(P){de=P},this.getClearColor=function(P){return P.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(P=!0,K=!0,le=!0){let re=0;if(P){let ie=!1;if(L!==null){const Le=L.texture.format;ie=Le===Xg||Le===Wg||Le===Gg}if(ie){const Le=L.texture.type,We=Le===Mr||Le===ta||Le===Bg||Le===to||Le===jg||Le===Vg,$e=B.getClearColor(),Je=B.getClearAlpha(),it=$e.r,Ve=$e.g,ot=$e.b;We?(M[0]=it,M[1]=Ve,M[2]=ot,M[3]=Je,q.clearBufferuiv(q.COLOR,0,M)):(E[0]=it,E[1]=Ve,E[2]=ot,E[3]=Je,q.clearBufferiv(q.COLOR,0,E))}else re|=q.COLOR_BUFFER_BIT}K&&(re|=q.DEPTH_BUFFER_BIT),le&&(re|=q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q.clear(re)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",me,!1),qe.dispose(),Pe.dispose(),rt.dispose(),At.dispose(),F.dispose(),ve.dispose(),Be.dispose(),Ie.dispose(),Me.dispose(),st.dispose(),st.removeEventListener("sessionstart",yt),st.removeEventListener("sessionend",yn),Zt.stop()};function $(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const P=ut.autoReset,K=nt.enabled,le=nt.autoUpdate,re=nt.needsUpdate,ie=nt.type;dt(),ut.autoReset=P,nt.enabled=K,nt.autoUpdate=le,nt.needsUpdate=re,nt.type=ie}function me(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Re(P){const K=P.target;K.removeEventListener("dispose",Re),Fe(K)}function Fe(P){pt(P),rt.remove(P)}function pt(P){const K=rt.get(P).programs;K!==void 0&&(K.forEach(function(le){Me.releaseProgram(le)}),P.isShaderMaterial&&Me.releaseShaderCache(P))}this.renderBufferDirect=function(P,K,le,re,ie,Le){K===null&&(K=ke);const We=ie.isMesh&&ie.matrixWorld.determinant()<0,$e=nc(P,K,le,re,ie);Ke.setMaterial(re,We);let Je=le.index,it=1;if(re.wireframe===!0){if(Je=ce.getWireframeAttribute(le),Je===void 0)return;it=2}const Ve=le.drawRange,ot=le.attributes.position;let Dt=Ve.start*it,Gt=(Ve.start+Ve.count)*it;Le!==null&&(Dt=Math.max(Dt,Le.start*it),Gt=Math.min(Gt,(Le.start+Le.count)*it)),Je!==null?(Dt=Math.max(Dt,0),Gt=Math.min(Gt,Je.count)):ot!=null&&(Dt=Math.max(Dt,0),Gt=Math.min(Gt,ot.count));const Qt=Gt-Dt;if(Qt<0||Qt===1/0)return;Be.setup(ie,re,$e,le,Je);let Zn,gt=_e;if(Je!==null&&(Zn=N.get(Je),gt=Te,gt.setIndex(Zn)),ie.isMesh)re.wireframe===!0?(Ke.setLineWidth(re.wireframeLinewidth*He()),gt.setMode(q.LINES)):gt.setMode(q.TRIANGLES);else if(ie.isLine){let et=re.linewidth;et===void 0&&(et=1),Ke.setLineWidth(et*He()),ie.isLineSegments?gt.setMode(q.LINES):ie.isLineLoop?gt.setMode(q.LINE_LOOP):gt.setMode(q.LINE_STRIP)}else ie.isPoints?gt.setMode(q.POINTS):ie.isSprite&&gt.setMode(q.TRIANGLES);if(ie.isBatchedMesh)ie._multiDrawInstances!==null?gt.renderMultiDrawInstances(ie._multiDrawStarts,ie._multiDrawCounts,ie._multiDrawCount,ie._multiDrawInstances):gt.renderMultiDraw(ie._multiDrawStarts,ie._multiDrawCounts,ie._multiDrawCount);else if(ie.isInstancedMesh)gt.renderInstances(Dt,Qt,ie.count);else if(le.isInstancedBufferGeometry){const et=le._maxInstanceCount!==void 0?le._maxInstanceCount:1/0,ln=Math.min(le.instanceCount,et);gt.renderInstances(Dt,Qt,ln)}else gt.render(Dt,Qt)};function wt(P,K,le){P.transparent===!0&&P.side===mi&&P.forceSinglePass===!1?(P.side=Rn,P.needsUpdate=!0,Mi(P,K,le),P.side=Sr,P.needsUpdate=!0,Mi(P,K,le),P.side=mi):Mi(P,K,le)}this.compile=function(P,K,le=null){le===null&&(le=P),S=Pe.get(le),S.init(K),b.push(S),le.traverseVisible(function(ie){ie.isLight&&ie.layers.test(K.layers)&&(S.pushLight(ie),ie.castShadow&&S.pushShadow(ie))}),P!==le&&P.traverseVisible(function(ie){ie.isLight&&ie.layers.test(K.layers)&&(S.pushLight(ie),ie.castShadow&&S.pushShadow(ie))}),S.setupLights(R._useLegacyLights);const re=new Set;return P.traverse(function(ie){const Le=ie.material;if(Le)if(Array.isArray(Le))for(let We=0;We<Le.length;We++){const $e=Le[We];wt($e,le,ie),re.add($e)}else wt(Le,le,ie),re.add(Le)}),b.pop(),S=null,re},this.compileAsync=function(P,K,le=null){const re=this.compile(P,K,le);return new Promise(ie=>{function Le(){if(re.forEach(function(We){rt.get(We).currentProgram.isReady()&&re.delete(We)}),re.size===0){ie(P);return}setTimeout(Le,10)}Ye.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let Rt=null;function Vt(P){Rt&&Rt(P)}function yt(){Zt.stop()}function yn(){Zt.start()}const Zt=new av;Zt.setAnimationLoop(Vt),typeof self<"u"&&Zt.setContext(self),this.setAnimationLoop=function(P){Rt=P,st.setAnimationLoop(P),P===null?Zt.stop():Zt.start()},st.addEventListener("sessionstart",yt),st.addEventListener("sessionend",yn),this.render=function(P,K){if(K!==void 0&&K.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),K.parent===null&&K.matrixWorldAutoUpdate===!0&&K.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(st.cameraAutoUpdate===!0&&st.updateCamera(K),K=st.getCamera()),P.isScene===!0&&P.onBeforeRender(R,P,K,L),S=Pe.get(P,b.length),S.init(K),b.push(S),he.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),Ue.setFromProjectionMatrix(he),pe=this.localClippingEnabled,Q=Ne.init(this.clippingPlanes,pe),w=qe.get(P,x.length),w.init(),x.push(w),Vi(P,K,0,R.sortObjects),w.finish(),R.sortObjects===!0&&w.sort(k,de);const le=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1;le&&B.addToRenderList(w,P),this.info.render.frame++,Q===!0&&Ne.beginShadows();const re=S.state.shadowsArray;nt.render(re,P,K),Q===!0&&Ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=w.opaque,Le=w.transmissive;if(S.setupLights(R._useLegacyLights),K.isArrayCamera){const We=K.cameras;if(Le.length>0)for(let $e=0,Je=We.length;$e<Je;$e++){const it=We[$e];Gi(ie,Le,P,it)}le&&B.render(P);for(let $e=0,Je=We.length;$e<Je;$e++){const it=We[$e];is(w,P,it,it.viewport)}}else Le.length>0&&Gi(ie,Le,P,K),le&&B.render(P),is(w,P,K);L!==null&&(at.updateMultisampleRenderTarget(L),at.updateRenderTargetMipmap(L)),P.isScene===!0&&P.onAfterRender(R,P,K),Be.resetDefaultState(),j=-1,C=null,b.pop(),b.length>0?(S=b[b.length-1],Q===!0&&Ne.setGlobalState(R.clippingPlanes,S.state.camera)):S=null,x.pop(),x.length>0?w=x[x.length-1]:w=null};function Vi(P,K,le,re){if(P.visible===!1)return;if(P.layers.test(K.layers)){if(P.isGroup)le=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(K);else if(P.isLight)S.pushLight(P),P.castShadow&&S.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Ue.intersectsSprite(P)){re&&ge.setFromMatrixPosition(P.matrixWorld).applyMatrix4(he);const We=ve.update(P),$e=P.material;$e.visible&&w.push(P,We,$e,le,ge.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Ue.intersectsObject(P))){const We=ve.update(P),$e=P.material;if(re&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),ge.copy(P.boundingSphere.center)):(We.boundingSphere===null&&We.computeBoundingSphere(),ge.copy(We.boundingSphere.center)),ge.applyMatrix4(P.matrixWorld).applyMatrix4(he)),Array.isArray($e)){const Je=We.groups;for(let it=0,Ve=Je.length;it<Ve;it++){const ot=Je[it],Dt=$e[ot.materialIndex];Dt&&Dt.visible&&w.push(P,We,Dt,le,ge.z,ot)}}else $e.visible&&w.push(P,We,$e,le,ge.z,null)}}const Le=P.children;for(let We=0,$e=Le.length;We<$e;We++)Vi(Le[We],K,le,re)}function is(P,K,le,re){const ie=P.opaque,Le=P.transmissive,We=P.transparent;S.setupLightsView(le),Q===!0&&Ne.setGlobalState(R.clippingPlanes,le),re&&Ke.viewport(A.copy(re)),ie.length>0&&rs(ie,K,le),Le.length>0&&rs(Le,K,le),We.length>0&&rs(We,K,le),Ke.buffers.depth.setTest(!0),Ke.buffers.depth.setMask(!0),Ke.buffers.color.setMask(!0),Ke.setPolygonOffset(!1)}function Gi(P,K,le,re){if((le.isScene===!0?le.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[re.id]===void 0&&(S.state.transmissionRenderTarget[re.id]=new ns(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?Ql:Mr,minFilter:Qr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1}));const Le=S.state.transmissionRenderTarget[re.id],We=re.viewport||A;Le.setSize(We.z,We.w);const $e=R.getRenderTarget();R.setRenderTarget(Le),R.getClearColor(z),ne=R.getClearAlpha(),ne<1&&R.setClearColor(16777215,.5),R.clear();const Je=R.toneMapping;R.toneMapping=yr;const it=re.viewport;if(re.viewport!==void 0&&(re.viewport=void 0),S.setupLightsView(re),Q===!0&&Ne.setGlobalState(R.clippingPlanes,re),rs(P,le,re),at.updateMultisampleRenderTarget(Le),at.updateRenderTargetMipmap(Le),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let ot=0,Dt=K.length;ot<Dt;ot++){const Gt=K[ot],Qt=Gt.object,Zn=Gt.geometry,gt=Gt.material,et=Gt.group;if(gt.side===mi&&Qt.layers.test(re.layers)){const ln=gt.side;gt.side=Rn,gt.needsUpdate=!0,Wi(Qt,le,re,Zn,gt,et),gt.side=ln,gt.needsUpdate=!0,Ve=!0}}Ve===!0&&(at.updateMultisampleRenderTarget(Le),at.updateRenderTargetMipmap(Le))}R.setRenderTarget($e),R.setClearColor(z,ne),it!==void 0&&(re.viewport=it),R.toneMapping=Je}function rs(P,K,le){const re=K.isScene===!0?K.overrideMaterial:null;for(let ie=0,Le=P.length;ie<Le;ie++){const We=P[ie],$e=We.object,Je=We.geometry,it=re===null?We.material:re,Ve=We.group;$e.layers.test(le.layers)&&Wi($e,K,le,Je,it,Ve)}}function Wi(P,K,le,re,ie,Le){P.onBeforeRender(R,K,le,re,ie,Le),P.modelViewMatrix.multiplyMatrices(le.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),ie.onBeforeRender(R,K,le,re,P,Le),ie.transparent===!0&&ie.side===mi&&ie.forceSinglePass===!1?(ie.side=Rn,ie.needsUpdate=!0,R.renderBufferDirect(le,K,re,ie,P,Le),ie.side=Sr,ie.needsUpdate=!0,R.renderBufferDirect(le,K,re,ie,P,Le),ie.side=mi):R.renderBufferDirect(le,K,re,ie,P,Le),P.onAfterRender(R,K,le,re,ie,Le)}function Mi(P,K,le){K.isScene!==!0&&(K=ke);const re=rt.get(P),ie=S.state.lights,Le=S.state.shadowsArray,We=ie.state.version,$e=Me.getParameters(P,ie.state,Le,K,le),Je=Me.getProgramCacheKey($e);let it=re.programs;re.environment=P.isMeshStandardMaterial?K.environment:null,re.fog=K.fog,re.envMap=(P.isMeshStandardMaterial?F:At).get(P.envMap||re.environment),re.envMapRotation=re.environment!==null&&P.envMap===null?K.environmentRotation:P.envMapRotation,it===void 0&&(P.addEventListener("dispose",Re),it=new Map,re.programs=it);let Ve=it.get(Je);if(Ve!==void 0){if(re.currentProgram===Ve&&re.lightsStateVersion===We)return ss(P,$e),Ve}else $e.uniforms=Me.getUniforms(P),P.onBuild(le,$e,R),P.onBeforeCompile($e,R),Ve=Me.acquireProgram($e,Je),it.set(Je,Ve),re.uniforms=$e.uniforms;const ot=re.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(ot.clippingPlanes=Ne.uniform),ss(P,$e),re.needsLights=rc(P),re.lightsStateVersion=We,re.needsLights&&(ot.ambientLightColor.value=ie.state.ambient,ot.lightProbe.value=ie.state.probe,ot.directionalLights.value=ie.state.directional,ot.directionalLightShadows.value=ie.state.directionalShadow,ot.spotLights.value=ie.state.spot,ot.spotLightShadows.value=ie.state.spotShadow,ot.rectAreaLights.value=ie.state.rectArea,ot.ltc_1.value=ie.state.rectAreaLTC1,ot.ltc_2.value=ie.state.rectAreaLTC2,ot.pointLights.value=ie.state.point,ot.pointLightShadows.value=ie.state.pointShadow,ot.hemisphereLights.value=ie.state.hemi,ot.directionalShadowMap.value=ie.state.directionalShadowMap,ot.directionalShadowMatrix.value=ie.state.directionalShadowMatrix,ot.spotShadowMap.value=ie.state.spotShadowMap,ot.spotLightMatrix.value=ie.state.spotLightMatrix,ot.spotLightMap.value=ie.state.spotLightMap,ot.pointShadowMap.value=ie.state.pointShadowMap,ot.pointShadowMatrix.value=ie.state.pointShadowMatrix),re.currentProgram=Ve,re.uniformsList=null,Ve}function Ar(P){if(P.uniformsList===null){const K=P.currentProgram.getUniforms();P.uniformsList=Ol.seqWithValue(K.seq,P.uniforms)}return P.uniformsList}function ss(P,K){const le=rt.get(P);le.outputColorSpace=K.outputColorSpace,le.batching=K.batching,le.instancing=K.instancing,le.instancingColor=K.instancingColor,le.instancingMorph=K.instancingMorph,le.skinning=K.skinning,le.morphTargets=K.morphTargets,le.morphNormals=K.morphNormals,le.morphColors=K.morphColors,le.morphTargetsCount=K.morphTargetsCount,le.numClippingPlanes=K.numClippingPlanes,le.numIntersection=K.numClipIntersection,le.vertexAlphas=K.vertexAlphas,le.vertexTangents=K.vertexTangents,le.toneMapping=K.toneMapping}function nc(P,K,le,re,ie){K.isScene!==!0&&(K=ke),at.resetTextureUnits();const Le=K.fog,We=re.isMeshStandardMaterial?K.environment:null,$e=L===null?R.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Tr,Je=(re.isMeshStandardMaterial?F:At).get(re.envMap||We),it=re.vertexColors===!0&&!!le.attributes.color&&le.attributes.color.itemSize===4,Ve=!!le.attributes.tangent&&(!!re.normalMap||re.anisotropy>0),ot=!!le.morphAttributes.position,Dt=!!le.morphAttributes.normal,Gt=!!le.morphAttributes.color;let Qt=yr;re.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Qt=R.toneMapping);const Zn=le.morphAttributes.position||le.morphAttributes.normal||le.morphAttributes.color,gt=Zn!==void 0?Zn.length:0,et=rt.get(re),ln=S.state.lights;if(Q===!0&&(pe===!0||P!==C)){const sn=P===C&&re.id===j;Ne.setState(re,P,sn)}let Ct=!1;re.version===et.__version?(et.needsLights&&et.lightsStateVersion!==ln.state.version||et.outputColorSpace!==$e||ie.isBatchedMesh&&et.batching===!1||!ie.isBatchedMesh&&et.batching===!0||ie.isInstancedMesh&&et.instancing===!1||!ie.isInstancedMesh&&et.instancing===!0||ie.isSkinnedMesh&&et.skinning===!1||!ie.isSkinnedMesh&&et.skinning===!0||ie.isInstancedMesh&&et.instancingColor===!0&&ie.instanceColor===null||ie.isInstancedMesh&&et.instancingColor===!1&&ie.instanceColor!==null||ie.isInstancedMesh&&et.instancingMorph===!0&&ie.morphTexture===null||ie.isInstancedMesh&&et.instancingMorph===!1&&ie.morphTexture!==null||et.envMap!==Je||re.fog===!0&&et.fog!==Le||et.numClippingPlanes!==void 0&&(et.numClippingPlanes!==Ne.numPlanes||et.numIntersection!==Ne.numIntersection)||et.vertexAlphas!==it||et.vertexTangents!==Ve||et.morphTargets!==ot||et.morphNormals!==Dt||et.morphColors!==Gt||et.toneMapping!==Qt||et.morphTargetsCount!==gt)&&(Ct=!0):(Ct=!0,et.__version=re.version);let Wt=et.currentProgram;Ct===!0&&(Wt=Mi(re,K,ie));let ao=!1,Cr=!1,oa=!1;const kt=Wt.getUniforms(),Pn=et.uniforms;if(Ke.useProgram(Wt.program)&&(ao=!0,Cr=!0,oa=!0),re.id!==j&&(j=re.id,Cr=!0),ao||C!==P){kt.setValue(q,"projectionMatrix",P.projectionMatrix),kt.setValue(q,"viewMatrix",P.matrixWorldInverse);const sn=kt.map.cameraPosition;sn!==void 0&&sn.setValue(q,ge.setFromMatrixPosition(P.matrixWorld)),mt.logarithmicDepthBuffer&&kt.setValue(q,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(re.isMeshPhongMaterial||re.isMeshToonMaterial||re.isMeshLambertMaterial||re.isMeshBasicMaterial||re.isMeshStandardMaterial||re.isShaderMaterial)&&kt.setValue(q,"isOrthographic",P.isOrthographicCamera===!0),C!==P&&(C=P,Cr=!0,oa=!0)}if(ie.isSkinnedMesh){kt.setOptional(q,ie,"bindMatrix"),kt.setOptional(q,ie,"bindMatrixInverse");const sn=ie.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),kt.setValue(q,"boneTexture",sn.boneTexture,at))}ie.isBatchedMesh&&(kt.setOptional(q,ie,"batchingTexture"),kt.setValue(q,"batchingTexture",ie._matricesTexture,at));const Ei=le.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&J.update(ie,le,Wt),(Cr||et.receiveShadow!==ie.receiveShadow)&&(et.receiveShadow=ie.receiveShadow,kt.setValue(q,"receiveShadow",ie.receiveShadow)),re.isMeshGouraudMaterial&&re.envMap!==null&&(Pn.envMap.value=Je,Pn.flipEnvMap.value=Je.isCubeTexture&&Je.isRenderTargetTexture===!1?-1:1),re.isMeshStandardMaterial&&re.envMap===null&&K.environment!==null&&(Pn.envMapIntensity.value=K.environmentIntensity),Cr&&(kt.setValue(q,"toneMappingExposure",R.toneMappingExposure),et.needsLights&&ic(Pn,oa),Le&&re.fog===!0&&we.refreshFogUniforms(Pn,Le),we.refreshMaterialUniforms(Pn,re,fe,ue,S.state.transmissionRenderTarget[P.id]),Ol.upload(q,Ar(et),Pn,at)),re.isShaderMaterial&&re.uniformsNeedUpdate===!0&&(Ol.upload(q,Ar(et),Pn,at),re.uniformsNeedUpdate=!1),re.isSpriteMaterial&&kt.setValue(q,"center",ie.center),kt.setValue(q,"modelViewMatrix",ie.modelViewMatrix),kt.setValue(q,"normalMatrix",ie.normalMatrix),kt.setValue(q,"modelMatrix",ie.matrixWorld),re.isShaderMaterial||re.isRawShaderMaterial){const sn=re.uniformsGroups;for(let la=0,sc=sn.length;la<sc;la++){const as=sn[la];Ie.update(as,Wt),Ie.bind(as,Wt)}}return Wt}function ic(P,K){P.ambientLightColor.needsUpdate=K,P.lightProbe.needsUpdate=K,P.directionalLights.needsUpdate=K,P.directionalLightShadows.needsUpdate=K,P.pointLights.needsUpdate=K,P.pointLightShadows.needsUpdate=K,P.spotLights.needsUpdate=K,P.spotLightShadows.needsUpdate=K,P.rectAreaLights.needsUpdate=K,P.hemisphereLights.needsUpdate=K}function rc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(P,K,le){rt.get(P.texture).__webglTexture=K,rt.get(P.depthTexture).__webglTexture=le;const re=rt.get(P);re.__hasExternalTextures=!0,re.__autoAllocateDepthBuffer=le===void 0,re.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),re.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,K){const le=rt.get(P);le.__webglFramebuffer=K,le.__useDefaultFramebuffer=K===void 0},this.setRenderTarget=function(P,K=0,le=0){L=P,X=K,I=le;let re=!0,ie=null,Le=!1,We=!1;if(P){const Je=rt.get(P);Je.__useDefaultFramebuffer!==void 0?(Ke.bindFramebuffer(q.FRAMEBUFFER,null),re=!1):Je.__webglFramebuffer===void 0?at.setupRenderTarget(P):Je.__hasExternalTextures&&at.rebindTextures(P,rt.get(P.texture).__webglTexture,rt.get(P.depthTexture).__webglTexture);const it=P.texture;(it.isData3DTexture||it.isDataArrayTexture||it.isCompressedArrayTexture)&&(We=!0);const Ve=rt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Ve[K])?ie=Ve[K][le]:ie=Ve[K],Le=!0):P.samples>0&&at.useMultisampledRTT(P)===!1?ie=rt.get(P).__webglMultisampledFramebuffer:Array.isArray(Ve)?ie=Ve[le]:ie=Ve,A.copy(P.viewport),V.copy(P.scissor),G=P.scissorTest}else A.copy(te).multiplyScalar(fe).floor(),V.copy(O).multiplyScalar(fe).floor(),G=ae;if(Ke.bindFramebuffer(q.FRAMEBUFFER,ie)&&re&&Ke.drawBuffers(P,ie),Ke.viewport(A),Ke.scissor(V),Ke.setScissorTest(G),Le){const Je=rt.get(P.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_CUBE_MAP_POSITIVE_X+K,Je.__webglTexture,le)}else if(We){const Je=rt.get(P.texture),it=K||0;q.framebufferTextureLayer(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,Je.__webglTexture,le||0,it)}j=-1},this.readRenderTargetPixels=function(P,K,le,re,ie,Le,We){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $e=rt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&We!==void 0&&($e=$e[We]),$e){Ke.bindFramebuffer(q.FRAMEBUFFER,$e);try{const Je=P.texture,it=Je.format,Ve=Je.type;if(!mt.textureFormatReadable(it)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!mt.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}K>=0&&K<=P.width-re&&le>=0&&le<=P.height-ie&&q.readPixels(K,le,re,ie,Ee.convert(it),Ee.convert(Ve),Le)}finally{const Je=L!==null?rt.get(L).__webglFramebuffer:null;Ke.bindFramebuffer(q.FRAMEBUFFER,Je)}}},this.copyFramebufferToTexture=function(P,K,le=0){const re=Math.pow(2,-le),ie=Math.floor(K.image.width*re),Le=Math.floor(K.image.height*re);at.setTexture2D(K,0),q.copyTexSubImage2D(q.TEXTURE_2D,le,0,0,P.x,P.y,ie,Le),Ke.unbindTexture()},this.copyTextureToTexture=function(P,K,le,re=0){const ie=K.image.width,Le=K.image.height,We=Ee.convert(le.format),$e=Ee.convert(le.type);at.setTexture2D(le,0),q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,le.flipY),q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,le.premultiplyAlpha),q.pixelStorei(q.UNPACK_ALIGNMENT,le.unpackAlignment),K.isDataTexture?q.texSubImage2D(q.TEXTURE_2D,re,P.x,P.y,ie,Le,We,$e,K.image.data):K.isCompressedTexture?q.compressedTexSubImage2D(q.TEXTURE_2D,re,P.x,P.y,K.mipmaps[0].width,K.mipmaps[0].height,We,K.mipmaps[0].data):q.texSubImage2D(q.TEXTURE_2D,re,P.x,P.y,We,$e,K.image),re===0&&le.generateMipmaps&&q.generateMipmap(q.TEXTURE_2D),Ke.unbindTexture()},this.copyTextureToTexture3D=function(P,K,le,re,ie=0){const Le=P.max.x-P.min.x,We=P.max.y-P.min.y,$e=P.max.z-P.min.z,Je=Ee.convert(re.format),it=Ee.convert(re.type);let Ve;if(re.isData3DTexture)at.setTexture3D(re,0),Ve=q.TEXTURE_3D;else if(re.isDataArrayTexture||re.isCompressedArrayTexture)at.setTexture2DArray(re,0),Ve=q.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,re.flipY),q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,re.premultiplyAlpha),q.pixelStorei(q.UNPACK_ALIGNMENT,re.unpackAlignment);const ot=q.getParameter(q.UNPACK_ROW_LENGTH),Dt=q.getParameter(q.UNPACK_IMAGE_HEIGHT),Gt=q.getParameter(q.UNPACK_SKIP_PIXELS),Qt=q.getParameter(q.UNPACK_SKIP_ROWS),Zn=q.getParameter(q.UNPACK_SKIP_IMAGES),gt=le.isCompressedTexture?le.mipmaps[ie]:le.image;q.pixelStorei(q.UNPACK_ROW_LENGTH,gt.width),q.pixelStorei(q.UNPACK_IMAGE_HEIGHT,gt.height),q.pixelStorei(q.UNPACK_SKIP_PIXELS,P.min.x),q.pixelStorei(q.UNPACK_SKIP_ROWS,P.min.y),q.pixelStorei(q.UNPACK_SKIP_IMAGES,P.min.z),le.isDataTexture||le.isData3DTexture?q.texSubImage3D(Ve,ie,K.x,K.y,K.z,Le,We,$e,Je,it,gt.data):re.isCompressedArrayTexture?q.compressedTexSubImage3D(Ve,ie,K.x,K.y,K.z,Le,We,$e,Je,gt.data):q.texSubImage3D(Ve,ie,K.x,K.y,K.z,Le,We,$e,Je,it,gt),q.pixelStorei(q.UNPACK_ROW_LENGTH,ot),q.pixelStorei(q.UNPACK_IMAGE_HEIGHT,Dt),q.pixelStorei(q.UNPACK_SKIP_PIXELS,Gt),q.pixelStorei(q.UNPACK_SKIP_ROWS,Qt),q.pixelStorei(q.UNPACK_SKIP_IMAGES,Zn),ie===0&&re.generateMipmaps&&q.generateMipmap(Ve),Ke.unbindTexture()},this.initTexture=function(P){P.isCubeTexture?at.setTextureCube(P,0):P.isData3DTexture?at.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?at.setTexture2DArray(P,0):at.setTexture2D(P,0),Ke.unbindTexture()},this.resetState=function(){X=0,I=0,L=null,Ke.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===$d?"display-p3":"srgb",t.unpackColorSpace=Tt.workingColorSpace===Jl?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class l1 extends gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class c1 extends ro{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$g,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const hg={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class u1{constructor(e,t,s){const o=this;let l=!1,u=0,d=0,m;const p=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=s,this.itemStart=function(g){d++,l===!1&&o.onStart!==void 0&&o.onStart(g,u,d),l=!0},this.itemEnd=function(g){u++,o.onProgress!==void 0&&o.onProgress(g,u,d),u===d&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(g){o.onError!==void 0&&o.onError(g)},this.resolveURL=function(g){return m?m(g):g},this.setURLModifier=function(g){return m=g,this},this.addHandler=function(g,y){return p.push(g,y),this},this.removeHandler=function(g){const y=p.indexOf(g);return y!==-1&&p.splice(y,2),this},this.getHandler=function(g){for(let y=0,_=p.length;y<_;y+=2){const M=p[y],E=p[y+1];if(M.global&&(M.lastIndex=0),M.test(g))return E}return null}}}const d1=new u1;class Zd{constructor(e){this.manager=e!==void 0?e:d1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const s=this;return new Promise(function(o,l){s.load(e,o,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Zd.DEFAULT_MATERIAL_NAME="__DEFAULT";const Oi={};class f1 extends Error{constructor(e,t){super(e),this.response=t}}class h1 extends Zd{constructor(e){super(e)}load(e,t,s,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=hg.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0),l;if(Oi[e]!==void 0){Oi[e].push({onLoad:t,onProgress:s,onError:o});return}Oi[e]=[],Oi[e].push({onLoad:t,onProgress:s,onError:o});const u=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),d=this.mimeType,m=this.responseType;fetch(u).then(p=>{if(p.status===200||p.status===0){if(p.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||p.body===void 0||p.body.getReader===void 0)return p;const g=Oi[e],y=p.body.getReader(),_=p.headers.get("X-File-Size")||p.headers.get("Content-Length"),M=_?parseInt(_):0,E=M!==0;let w=0;const S=new ReadableStream({start(x){b();function b(){y.read().then(({done:R,value:D})=>{if(R)x.close();else{w+=D.byteLength;const X=new ProgressEvent("progress",{lengthComputable:E,loaded:w,total:M});for(let I=0,L=g.length;I<L;I++){const j=g[I];j.onProgress&&j.onProgress(X)}x.enqueue(D),b()}})}}});return new Response(S)}else throw new f1(`fetch for "${p.url}" responded with ${p.status}: ${p.statusText}`,p)}).then(p=>{switch(m){case"arraybuffer":return p.arrayBuffer();case"blob":return p.blob();case"document":return p.text().then(g=>new DOMParser().parseFromString(g,d));case"json":return p.json();default:if(d===void 0)return p.text();{const y=/charset="?([^;"\s]*)"?/i.exec(d),_=y&&y[1]?y[1].toLowerCase():void 0,M=new TextDecoder(_);return p.arrayBuffer().then(E=>M.decode(E))}}}).then(p=>{hg.add(e,p);const g=Oi[e];delete Oi[e];for(let y=0,_=g.length;y<_;y++){const M=g[y];M.onLoad&&M.onLoad(p)}}).catch(p=>{const g=Oi[e];if(g===void 0)throw this.manager.itemError(e),p;delete Oi[e];for(let y=0,_=g.length;y<_;y++){const M=g[y];M.onError&&M.onError(p)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class pv extends gn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Mt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Ed=new Bt,pg=new oe,mg=new oe;class p1{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.map=null,this.mapPass=null,this.matrix=new Bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yd,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,s=this.matrix;pg.setFromMatrixPosition(e.matrixWorld),t.position.copy(pg),mg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mg),t.updateMatrixWorld(),Ed.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ed),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(Ed)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class m1 extends p1{constructor(){super(new ov(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class g1 extends pv{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.target=new gn,this.shadow=new m1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class v1 extends pv{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Xd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Xd);class _1 extends Zd{constructor(e){super(e)}load(e,t,s,o){const l=this,u=new h1(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(this.withCredentials),u.load(e,function(d){try{t(l.parse(d))}catch(m){o?o(m):console.error(m),l.manager.itemError(e)}},s,o)}parse(e){function t(p){const g=new DataView(p),y=32/8*3+32/8*3*3+16/8,_=g.getUint32(80,!0);if(80+32/8+_*y===g.byteLength)return!0;const E=[115,111,108,105,100];for(let w=0;w<5;w++)if(s(E,g,w))return!1;return!0}function s(p,g,y){for(let _=0,M=p.length;_<M;_++)if(p[_]!==g.getUint8(y+_))return!1;return!0}function o(p){const g=new DataView(p),y=g.getUint32(80,!0);let _,M,E,w=!1,S,x,b,R,D;for(let V=0;V<70;V++)g.getUint32(V,!1)==1129270351&&g.getUint8(V+4)==82&&g.getUint8(V+5)==61&&(w=!0,S=new Float32Array(y*3*3),x=g.getUint8(V+6)/255,b=g.getUint8(V+7)/255,R=g.getUint8(V+8)/255,D=g.getUint8(V+9)/255);const X=84,I=50,L=new ji,j=new Float32Array(y*3*3),C=new Float32Array(y*3*3),A=new Mt;for(let V=0;V<y;V++){const G=X+V*I,z=g.getFloat32(G,!0),ne=g.getFloat32(G+4,!0),Y=g.getFloat32(G+8,!0);if(w){const ue=g.getUint16(G+48,!0);(ue&32768)===0?(_=(ue&31)/31,M=(ue>>5&31)/31,E=(ue>>10&31)/31):(_=x,M=b,E=R)}for(let ue=1;ue<=3;ue++){const fe=G+ue*12,k=V*3*3+(ue-1)*3;j[k]=g.getFloat32(fe,!0),j[k+1]=g.getFloat32(fe+4,!0),j[k+2]=g.getFloat32(fe+8,!0),C[k]=z,C[k+1]=ne,C[k+2]=Y,w&&(A.set(_,M,E).convertSRGBToLinear(),S[k]=A.r,S[k+1]=A.g,S[k+2]=A.b)}}return L.setAttribute("position",new Bn(j,3)),L.setAttribute("normal",new Bn(C,3)),w&&(L.setAttribute("color",new Bn(S,3)),L.hasColors=!0,L.alpha=D),L}function l(p){const g=new ji,y=/solid([\s\S]*?)endsolid/g,_=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let E=0;const w=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,S=new RegExp("vertex"+w+w+w,"g"),x=new RegExp("normal"+w+w+w,"g"),b=[],R=[],D=[],X=new oe;let I,L=0,j=0,C=0;for(;(I=y.exec(p))!==null;){j=C;const A=I[0],V=(I=M.exec(A))!==null?I[1]:"";for(D.push(V);(I=_.exec(A))!==null;){let ne=0,Y=0;const ue=I[0];for(;(I=x.exec(ue))!==null;)X.x=parseFloat(I[1]),X.y=parseFloat(I[2]),X.z=parseFloat(I[3]),Y++;for(;(I=S.exec(ue))!==null;)b.push(parseFloat(I[1]),parseFloat(I[2]),parseFloat(I[3])),R.push(X.x,X.y,X.z),ne++,C++;Y!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+E),ne!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+E),E++}const G=j,z=C-j;g.userData.groupNames=D,g.addGroup(G,z,L),L++}return g.setAttribute("position",new Bi(b,3)),g.setAttribute("normal",new Bi(R,3)),g}function u(p){return typeof p!="string"?new TextDecoder().decode(p):p}function d(p){if(typeof p=="string"){const g=new Uint8Array(p.length);for(let y=0;y<p.length;y++)g[y]=p.charCodeAt(y)&255;return g.buffer||g}else return p}const m=d(e);return t(m)?o(m):l(u(e))}}function x1({src:r}){const e=Ce.useRef(null);return Ce.useEffect(()=>{const t=e.current;if(!t||!r)return;let s=!1;const o=document.createElement("canvas");o.style.display="block",o.style.width="100%",o.style.height="100%",t.replaceChildren(o);const l=new o1({canvas:o,antialias:!0,alpha:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2));const u=new l1,d=new qn(45,1,.01,100);d.position.set(0,0,2.2),u.add(new v1(16777215,.85));const m=new g1(16777215,.65);m.position.set(2,3,4),u.add(m);const p=new Ka;u.add(p);const g=new c1({color:10135740,metalness:.05,roughness:.72,side:mi}),y=new _1;let _=null,M=0,E=!1,w=0,S=0,x=0;const b=C=>{const A=new sa().setFromObject(C),V=A.getSize(new oe),G=A.getCenter(new oe),ne=1.5/Math.max(V.x,V.y,V.z,1e-6);C.scale.setScalar(ne),C.position.sub(G.multiplyScalar(ne))},R=()=>{const C=t.clientWidth||1,A=t.clientHeight||1;l.setSize(C,A,!1),d.aspect=C/A,d.updateProjectionMatrix()},D=()=>{s||(E||(S+=.004),p.rotation.y=S,p.rotation.x=x,l.render(u,d),M=requestAnimationFrame(D))},X=C=>{C.button===0&&(E=!0,w=C.clientX,o.setPointerCapture(C.pointerId))},I=C=>{if(!E)return;const A=C.clientX-w;w=C.clientX,S+=A*.012},L=()=>{E=!1};o.addEventListener("pointerdown",X),o.addEventListener("pointermove",I),o.addEventListener("pointerup",L),o.addEventListener("pointercancel",L);const j=new ResizeObserver(()=>R());return j.observe(t),R(),y.loadAsync(r).then(C=>{if(s){C.dispose();return}C.computeVertexNormals(),_=new _i(C,g),p.add(_),b(_),D()}).catch(()=>{s||(t.dataset.error="1")}),()=>{s=!0,cancelAnimationFrame(M),j.disconnect(),o.removeEventListener("pointerdown",X),o.removeEventListener("pointermove",I),o.removeEventListener("pointerup",L),o.removeEventListener("pointercancel",L),_&&(_.geometry.dispose(),g.dispose()),l.dispose(),t.replaceChildren()}},[r]),r?f.jsx("div",{ref:e,className:"stl-preview-host","aria-hidden":!0}):null}function y1({app:r}){const e=r.file||"データなし（予約のみ）",t=r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":null,s=r.file?Sx(r.id):null;return f.jsxs("div",{className:"stl",children:[f.jsx("div",{className:"stl-canvas",children:s?f.jsx(x1,{src:s}):f.jsxs(f.Fragment,{children:[f.jsx("span",{className:"stl-tag",children:r.kind==="request"?"STL":"RESERVE"}),f.jsx("span",{className:"stl-note",children:r.kind==="request"?"サムネイル未生成":"データ提出なし"})]})}),f.jsxs("div",{className:"stl-meta",children:[f.jsx("span",{className:"stl-ext",children:r.file?r.file.split(".").pop().toUpperCase():"—"}),f.jsxs("span",{className:"stl-name",children:[f.jsx("b",{className:"num",children:e}),f.jsx("span",{children:t?`${t} ・ 更新 ${W0(r.createdAt??"")}`:"予約枠のみの申請"})]}),f.jsxs("span",{className:"stl-actions",children:[f.jsx("a",{className:"mini",href:s??void 0,download:r.file||void 0,style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"DL"}),f.jsx("a",{className:"mini",href:s??void 0,target:"_blank",rel:"noreferrer",style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"開く"})]})]})]})}function S1({app:r,selected:e,onToggle:t,disabled:s}){mn(r);const o=Hd(r);return f.jsx("div",{className:"slotgrid",role:"group","aria-label":"時間帯（30分単位）",children:o.map(l=>{const u=e.indexOf(l)>=0;return f.jsxs("button",{type:"button",disabled:s,className:"slot-chip"+(u?" on":""),onClick:()=>t(l),"aria-pressed":u,children:[f.jsx("span",{className:"num",children:qt(Qa(l))}),f.jsx("span",{className:"slot-dur num",children:"30分"})]},l)})})}function M1({app:r,onPartial:e,onCancelAll:t,onMove:s}){const[o,l]=Ce.useState([]),[u,d]=Ce.useState(null),[m,p]=Ce.useState(null),[g,y]=Ce.useState(""),[_,M]=Ce.useState("");Ce.useEffect(()=>{l([]),d(null),p(null),M(""),y(r.adminNote||"")},[r.id]);const E=Hd(r),w=L=>l(j=>j.indexOf(L)>=0?j.filter(C=>C!==L):j.concat(L).sort((C,A)=>C-A)),S=o.length===E.length,x=()=>l(S?[]:E.slice()),b=r.status==="pending"||r.status==="approved",R=o.length>0&&!S,D=o.length?`${qt(Qa(o[0]))}〜${qt(Qa(o[o.length-1])+Zs)}（${o.length}枠・${Yl(o.length*Zs)}）`:"",X=()=>{if(!m){M("理由を1つ選んでください");return}const L=zp.find(j=>j.id===m);o.length?e(r,o,"cancelled",{cancelReason:L.id,adminNote:g||L.body,reason:L}):t(r,L,g)},I=()=>{if(!m){M("理由を1つ選んでください");return}const L=Bp.find(j=>j.id===m);o.length?e(r,o,"rejected",{rejectReason:L.id,adminNote:g||L.body,reason:L}):t(r,L,g,"rejected")};return f.jsxs("div",{className:"slotacts",children:[f.jsxs("div",{className:"ftitle",style:{marginBottom:6},children:[f.jsx("span",{children:"時間単位で操作"}),f.jsx("button",{type:"button",className:"linkbtn",onClick:x,children:S?"選択を解除":"すべて選択"})]}),f.jsx(S1,{app:r,selected:o,onToggle:w,disabled:!b}),f.jsx("div",{className:"selbar"+(o.length?" on":""),children:o.length?f.jsxs(f.Fragment,{children:[f.jsx("b",{className:"num",children:D}),f.jsx("span",{children:R?"この枠だけを操作します（残りはそのまま）":"申請全体を操作します"})]}):f.jsx("span",{children:"枠を選ぶと、その時間だけを取り消し・確定できます。未選択なら申請全体が対象です。"})}),b&&f.jsxs("div",{className:"actrow",children:[r.status==="pending"&&f.jsxs("button",{type:"button",className:"btn btn-primary",onClick:()=>o.length?e(r,o,"approved",{}):t(r,null,"","approved"),children:["確定",R?`（${o.length}枠）`:""]}),f.jsx("button",{type:"button",className:"btn btn-secondary move",onClick:()=>s&&s(r),children:"別の日へ変更"}),f.jsx("button",{type:"button",className:"btn btn-danger",onClick:()=>{d(u==="cancel"?null:"cancel"),p(null),M("")},children:"取り消し…"}),r.status==="pending"&&f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>{d(u==="reject"?null:"reject"),p(null),M("")},children:"却下…"})]}),!b&&f.jsx("div",{className:"note tip",children:f.jsxs("span",{children:["この申請は ",f.jsx("b",{children:Qs[r.status]})," です。必要なら「申請中に戻す」で復帰できます。"]})}),b&&u==="cancel"&&f.jsxs("div",{className:"reasonblock",children:[f.jsxs("div",{className:"ftitle",children:["取り消しの理由",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("div",{className:"reasons",children:zp.map(L=>f.jsxs("button",{type:"button",className:"reason"+(m===L.id?" on":""),onClick:()=>{p(L.id),M("")},children:[f.jsx("i",{}),f.jsxs("span",{children:[f.jsx("b",{children:L.label}),f.jsx("span",{children:L.body})]})]},L.id))}),f.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者への連絡（任意）"}),f.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>y(L.target.value),placeholder:"理由に補足があれば書きます"}),_&&f.jsx("div",{className:"note warn",style:{marginTop:6},children:f.jsx("span",{children:_})}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{d(null),M("")},children:"やめる"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:X,children:R?`${o.length}枠を取り消す`:"この申請を取り消す"})]})]}),b&&u==="reject"&&f.jsxs("div",{className:"reasonblock",children:[f.jsxs("div",{className:"ftitle",children:["却下の理由",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("div",{className:"reasons",children:Bp.map(L=>f.jsxs("button",{type:"button",className:"reason"+(m===L.id?" on":""),onClick:()=>{p(L.id),M("")},children:[f.jsx("i",{}),f.jsxs("span",{children:[f.jsx("b",{children:L.label}),f.jsx("span",{children:L.body})]})]},L.id))}),f.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者へのメッセージ（任意）"}),f.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>y(L.target.value),placeholder:"選んだ理由に補足があれば書きます"}),_&&f.jsx("div",{className:"note warn",style:{marginTop:6},children:f.jsx("span",{children:_})}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{d(null),M("")},children:"やめる"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:I,children:R?`${o.length}枠を却下`:"この申請を却下"})]})]}),r.status!=="pending"&&f.jsxs("div",{className:"actrow",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","pending"),children:"申請中に戻す"}),r.status==="approved"&&f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","done"),children:"完了にする"})]}),f.jsxs("div",{className:"memo",children:[f.jsxs("div",{className:"ftitle",style:{justifyContent:"space-between"},children:[f.jsxs("span",{children:["担当者メモ",r.adminNote?"（保存済み）":""]}),f.jsx("button",{type:"button",className:"linkbtn",onClick:()=>d(u==="note"?null:"note"),children:u==="note"?"閉じる":"書く"})]}),r.adminNote&&u!=="note"&&f.jsx("div",{className:"note tip",children:f.jsx("span",{children:r.adminNote})}),u==="note"&&f.jsxs("div",{style:{display:"grid",gap:6},children:[f.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>y(L.target.value),placeholder:"印刷条件や受け取りの指示"}),f.jsx("div",{className:"presets",children:Xx.map(L=>f.jsxs("button",{type:"button",className:"preset",onClick:()=>y(L),children:[L.slice(0,12),"…"]},L))}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>d(null),children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{t(r,null,g.trim(),null,"note"),d(null)},children:"メモを保存"})]})]})]})]})}function E1({app:r,onClose:e,onPartial:t,onCancelAll:s,onMove:o,log:l}){if(!r)return null;const u=mn(r),d=eo(r.date),m=l.filter(p=>p.appId===r.id).sort((p,g)=>g.at.localeCompare(p.at));return f.jsxs(j0,{open:!!r,title:r.title,onClose:e,sub:f.jsxs(f.Fragment,{children:[f.jsx("span",{className:"num",style:{whiteSpace:"nowrap"},children:Mg(r.date)}),f.jsx("span",{children:"·"}),f.jsx("span",{style:{whiteSpace:"nowrap"},children:xi[r.machine].name})]}),footer:f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[f.jsxs("div",{className:"rv-flags",children:[f.jsx($s,{kind:r.kind}),f.jsx(bd,{status:r.status}),Jx(r)&&f.jsx(Hl,{tone:"warn",children:"当日・締切超過"}),f.jsxs(Hl,{children:["申請 ",F0(r.createdAt)]})]}),f.jsxs("dl",{className:"kv",children:[f.jsxs("div",{children:[f.jsx("dt",{children:"時間"}),f.jsxs("dd",{className:"num",children:[r.kind==="request"?"16:30〜20:00":`${qt(u.start)}〜${qt(u.end)}`,f.jsx("small",{children:r.kind==="request"?"（依頼枠を丸ごと占有）":`（${Yl(u.end-u.start)}）`})]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"機種"}),f.jsxs("dd",{children:[xi[r.machine].name,f.jsxs("small",{children:["／ ",xi[r.machine].maker]})]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"担当"}),f.jsx("dd",{children:d.length?d.map(p=>Zx(p)).join(" / "):"休み"})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"申請者"}),f.jsxs("dd",{children:[r.who.name,f.jsxs("small",{children:["（",Hi(r.who.hr),"・",r.who.num,"番）"]})]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"種別"}),f.jsxs("dd",{children:[yi[r.kind],f.jsx("small",{children:r.kind==="request"?"STL提出あり":"データ提出なし"})]})]})]}),f.jsxs("div",{children:[f.jsx("div",{className:"ftitle",children:"印刷データ"}),f.jsx(y1,{app:r})]}),r.note&&f.jsxs("div",{children:[f.jsx("div",{className:"ftitle",children:"申請者の備考"}),f.jsx("div",{className:"note tip",children:f.jsx("span",{children:r.note})})]}),f.jsx(M1,{app:r,onPartial:t,onCancelAll:s,onMove:o}),m.length>0&&f.jsxs("div",{children:[f.jsx("div",{className:"ftitle",children:"この申請の履歴"}),m.map(p=>f.jsxs("div",{className:"log-item "+p.type,children:[f.jsx("span",{className:"bd"}),f.jsxs("span",{className:"tx",children:[p.text,f.jsxs("span",{className:"at",children:[f.jsx("span",{className:"who",children:p.actor}),O0(p.at)]})]})]},p.id))]})]})}function w1({apps:r,selected:e,onPick:t,onOpen:s,onApprove:o,onCancel:l,onPartial:u,log:d,onDownload:m,onDownloadAll:p,onMove:g}){const y=Ag(r,e),_=eo(e),M=e<li,E=y.live.length;return f.jsxs("div",{className:"rs-grid",children:[f.jsx("div",{className:"rs-main",children:f.jsx(H0,{apps:r,avail:null,selected:e,onPick:t})}),f.jsx("div",{className:"rs-side",children:f.jsxs("div",{className:"card daycard",children:[f.jsxs("div",{className:"daycard-h",children:[f.jsx("span",{className:"dc-date num",children:Td(e)}),f.jsx("span",{className:"dc-wd",children:wr[zn(e).getDay()]}),e===li&&f.jsx(Hl,{tone:"orange",children:"今日"}),M&&f.jsx(Hl,{children:"過ぎた日"}),f.jsx("span",{className:"dc-staff",children:_.length?_.map(w=>f.jsx(I0,{id:w,small:!0},w)):f.jsx("span",{className:"mtag none",children:"休み"})})]}),f.jsxs("div",{className:"daycard-counts",children:[f.jsxs("span",{className:"dc-c req",children:[f.jsx($s,{kind:"request",size:"sm"}),f.jsx("b",{className:"num",children:y.requests.length})]}),f.jsxs("span",{className:"dc-c res",children:[f.jsx($s,{kind:"reserve",size:"sm"}),f.jsx("b",{className:"num",children:y.reserves.length})]}),y.pending>0&&f.jsxs("span",{className:"dc-pend num",children:["申請中 ",y.pending]}),E>0&&f.jsxs("button",{type:"button",className:"btn btn-dl btn-sm dc-dl",onClick:()=>p(e),children:[f.jsx(Vu,{}),"この日の申請を一括DL（",E,"件）"]})]}),f.jsxs("div",{className:"dgroups",children:[["request","reserve"].map(w=>{const S=(w==="request"?y.requests:y.reserves).sort((b,R)=>mn(b).start-mn(R).start||Za.indexOf(b.machine)-Za.indexOf(R.machine)),x=S.filter(b=>b.status==="pending").length;return f.jsxs("div",{className:"dgroup",children:[f.jsxs("div",{className:"dg-head "+w,children:[f.jsx($s,{kind:w}),f.jsxs("span",{className:"num",children:[S.length,"件"]}),x>0&&f.jsxs("span",{className:"dg-pend num",children:["申請中 ",x]})]}),S.length===0?f.jsxs("div",{className:"dg-empty",children:["この日の",yi[w],"はありません。"]}):S.map(b=>{const R=mn(b);return f.jsxs("div",{className:"drow "+b.status,children:[f.jsxs("span",{className:"dr-time num",children:[f.jsx("b",{children:qt(R.start)}),f.jsx("span",{children:qt(R.end)})]}),f.jsxs("span",{className:"dr-main",children:[f.jsx("span",{className:"dr-title",children:b.title}),f.jsxs("span",{className:"dr-sub",children:[f.jsx(bd,{status:b.status}),f.jsx(L0,{id:b.machine}),xi[b.machine].short,f.jsx("span",{children:"·"}),b.who.name,b.file&&f.jsxs(f.Fragment,{children:[f.jsx("span",{children:"·"}),f.jsx("span",{className:"num",children:b.file})]})]})]}),f.jsxs("span",{className:"dr-acts",children:[b.status==="pending"&&f.jsx("button",{type:"button",className:"mini ok",onClick:()=>o(b),children:"確定"}),(b.status==="pending"||b.status==="approved"||b.status==="done")&&f.jsx("button",{type:"button",className:"mini move",onClick:()=>g(b),children:"変更"}),(b.status==="pending"||b.status==="approved")&&f.jsx("button",{type:"button",className:"mini no",onClick:()=>s(b,"cancel"),children:"取り消し"}),f.jsxs("span",{className:"dr-dl",children:[f.jsxs("button",{type:"button",className:"mini dl",onClick:()=>m(b),title:"この申請のテキストをダウンロード","aria-label":`${b.title} をダウンロード`,children:[f.jsx(Vu,{}),"DL"]}),b.file&&f.jsx("button",{type:"button",className:"mini dl icon-only",onClick:()=>m(b,"file"),title:`${b.file} をダウンロード`,"aria-label":`${b.file} をダウンロード`,children:f.jsx(Vu,{})})]}),f.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(b),"aria-label":"詳細",children:"›"})]})]},b.id)})]},w)}),y.cancelled.length>0&&f.jsxs("details",{className:"dcan",children:[f.jsxs("summary",{className:"num",children:["取り消し・却下 ",y.cancelled.length,"件"]}),y.cancelled.map(w=>{const S=mn(w);return f.jsxs("div",{className:"drow cancelled",children:[f.jsxs("span",{className:"dr-time num",children:[f.jsx("b",{children:qt(S.start)}),f.jsx("span",{children:qt(S.end)})]}),f.jsxs("span",{className:"dr-main",children:[f.jsx("span",{className:"dr-title",children:w.title}),f.jsxs("span",{className:"dr-sub",children:[f.jsx(bd,{status:w.status}),f.jsx("span",{children:w.who.name}),f.jsx("span",{children:"·"}),f.jsx("span",{children:w.adminNote||"理由なし"})]})]}),f.jsxs("span",{className:"dr-acts",children:[f.jsx("button",{type:"button",className:"mini",onClick:()=>l(w,null,"","pending"),children:"戻す"}),f.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(w),children:"›"})]})]},w.id)})]})]})]})})]})}function T1({year:r,month:e,app:t,apps:s,onChangeMonth:o,onJumpToday:l}){const u=n0(r,e);return f.jsxs("div",{className:"mm",children:[f.jsxs("div",{className:"mm-h",children:[f.jsx("button",{type:"button",onClick:()=>o(-1),"aria-label":"前の月",children:"‹"}),f.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]}),f.jsx("button",{type:"button",onClick:()=>o(1),"aria-label":"次の月",children:"›"}),f.jsx("button",{type:"button",className:"mini",onClick:l,children:"今月"})]}),f.jsx("div",{className:"mm-wds",children:wr.map((d,m)=>f.jsx("span",{className:"mm-wd"+(m===0?" sun":m===6?" sat":""),children:d},d))}),f.jsx("div",{className:"mm-grid",children:u.map((d,m)=>{if(!d)return f.jsx("span",{className:"mm-cell pad"},"p"+m);const p=Yn(d),g=Cg(s,t,p),y=g.sameDay?"current":g.past?"past":g.full?"full":g.noStaff?"nostaff":"ok";return f.jsxs("button",{type:"button","data-date":p,className:"mm-cell "+y,onClick:()=>!g.past&&!g.sameDay&&o(0,p),"aria-label":`${d.getMonth()+1}月${d.getDate()}日 ${g.full?"埋まり":g.noStaff?"担当なし":"空き"}`,children:[f.jsx("span",{className:"num mm-d",children:d.getDate()}),f.jsx("span",{className:"mm-meta",children:g.sameDay?"現在":g.past?"—":g.noStaff?"担当なし":g.full?"満枠":`空き ${g.free}枠`}),g.liveCount>0&&!g.past&&f.jsx("span",{className:"mm-count num",children:g.liveCount})]},p)})})]})}function A1({open:r,app:e,apps:t,onClose:s,onMove:o}){const[l,u]=Ce.useState(()=>{const x=e?zn(e.date):new Date;return{y:x.getFullYear(),m:x.getMonth()+1}}),[d,m]=Ce.useState(null),[p,g]=Ce.useState(!1);if(Ce.useEffect(()=>{if(!e)return;const x=zn(e.date);u({y:x.getFullYear(),m:x.getMonth()+1}),m(null),g(!1)},[e&&e.id,r]),!r||!e)return null;const y=(x,b)=>{if(b){m(b);return}if(x===0){const R=new Date;u({y:R.getFullYear(),m:R.getMonth()+1});return}u(R=>{let D=R.y,X=R.m+x;return X<1&&(X=12,D-=1),X>12&&(X=1,D+=1),{y:D,m:X}})},_=d?Cg(t,e,d):null,E=!!(_&&(_.full||_.noStaff)),w=mn(e),S=()=>{o(e,d,{forced:E&&p,info:_}),m(null),g(!1)};return f.jsx(V0,{open:r,wide:!0,title:"別の日へ変更",sub:f.jsxs(f.Fragment,{children:[f.jsx("span",{children:e.title}),f.jsx("span",{children:"·"}),f.jsx("span",{className:"num",children:Mg(e.date)}),f.jsx("span",{children:"·"}),f.jsx("span",{children:yi[e.kind]})]}),onClose:s,footer:f.jsxs(f.Fragment,{children:[f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:s,children:"閉じる"}),f.jsx("button",{type:"button",className:"btn btn-primary",disabled:!d||E&&!p,onClick:S,children:d?`${Td(d)} に変更`:"日付を選択"})]}),children:f.jsxs("div",{className:"mv-body",children:[f.jsxs("div",{className:"mv-note",children:[f.jsxs("b",{children:[qt(w.start),"〜",qt(w.end)]}),f.jsx("span",{className:"mv-sep",children:"|"}),f.jsxs("span",{children:[xi[e.machine].name," ・ ",e.status==="approved"?"確定済みでも変更できます":"時間帯はそのまま移動します"]})]}),f.jsx(T1,{year:l.y,month:l.m,app:e,apps:t,onChangeMonth:y,onJumpToday:()=>y(0)}),f.jsxs("div",{className:"mv-legend",children:[f.jsx("span",{className:"mv-lg ok",children:"空き"}),f.jsx("span",{className:"mv-lg nostaff",children:"担当なし"}),f.jsx("span",{className:"mv-lg full",children:"満枠"}),f.jsx("span",{className:"mv-lg past",children:"過ぎた日"})]}),d&&_&&f.jsxs("div",{className:"mv-picked "+(_.full?"full":_.noStaff?"nostaff":"ok"),children:[f.jsxs("div",{className:"mvp-h",children:[f.jsxs("b",{className:"num",children:[Td(_.date),"（",wr[zn(_.date).getDay()],"）"]}),f.jsx("span",{className:"mvp-state",children:_.noStaff?"担当者がいません":_.full?"満枠です":`空き ${_.free}/${_.total}枠`})]}),f.jsxs("div",{className:"mvp-meta",children:[f.jsxs("span",{children:["担当：",_.staffs.length?_.staffs.map(x=>Bd(x)).join(" / "):"なし"]}),f.jsxs("span",{children:["この日の申請：",f.jsxs("span",{className:"num",children:[_.liveCount,"件"]})]})]}),E&&f.jsxs("label",{className:"mv-force",children:[f.jsx("input",{type:"checkbox",checked:p,onChange:x=>g(x.target.checked)}),f.jsxs("span",{children:[f.jsx("b",{children:_.noStaff?"担当者がいない日にも変更する":"満枠でも強制的に変更する"}),f.jsx("span",{className:"fl-h",children:_.noStaff?"担当者のいない日は本来受け付けていません。必要な場合だけ強制します。":"同じ時間帯の申請と重なります。両方を残したまま、この申請を確定・申請中にします。"})]})]})]})]})})}function C1({year:r,month:e,avail:t,memberId:s,onPaint:o,onChangeMonth:l}){const d=new Date(r,e-1,1).getDay(),m=new Date(r,e,0).getDate(),p=[];for(let j=0;j<d;j++)p.push(null);for(let j=1;j<=m;j++)p.push(new Date(r,e-1,j));const g=Ce.useRef(null),y=Ce.useRef(null),[_,M]=Ce.useState(null),E=j=>p.filter(Boolean).filter(C=>C.getDay()===j).map(Yn),w=j=>j>=li,S=(j,C)=>{if(!s||!w(j)||C.pointerType==="mouse"&&C.button!==0)return;C.preventDefault();const A=!qa(s,j);y.current={mode:A,touched:[j]},M({dates:new Set([j]),on:A})},x=(j,C)=>{const A=document.elementFromPoint(j,C),V=A&&A.closest?A.closest(".scal-cell[data-date]"):null;return V?V.getAttribute("data-date"):null};Ce.useEffect(()=>{const j=A=>{const V=y.current;if(!V)return;A.preventDefault();const G=x(A.clientX,A.clientY);!G||!w(G)||V.touched.indexOf(G)>=0||(V.touched.push(G),M(z=>{const ne=new Set(z?z.dates:[]);return ne.add(G),{dates:ne,on:V.mode}}))},C=()=>{const A=y.current;if(!A)return;y.current=null;const V=A.touched.filter(w).slice();M(null),V.length&&o(V,A.mode)};return window.addEventListener("pointermove",j,{passive:!1}),window.addEventListener("pointerup",C),window.addEventListener("pointercancel",C),()=>{window.removeEventListener("pointermove",j),window.removeEventListener("pointerup",C),window.removeEventListener("pointercancel",C)}},[o,s]);const b=j=>_&&_.dates.has(j)?_.on:null,R=j=>{const C=b(j);return C!==null?C:s?qa(s,j):!1},D=j=>Yx().filter(C=>(t[C.id]||[]).indexOf(j)>=0).map(C=>C.id),X=(Jr(s)||{}).color||"var(--color-primary)",I=j=>{if(!s)return;const C=E(j).filter(w);if(!C.length)return;const A=C.every(V=>qa(s,V));o(C,!A)},L=j=>{const C=E(j).filter(w);if(!s||!C.length)return"idle";const A=C.filter(V=>qa(s,V)).length;return A===0?"idle":A===C.length?"all":"some"};return f.jsxs("div",{className:"scal",ref:g,children:[f.jsxs("div",{className:"scal-h",children:[f.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]}),f.jsx("button",{type:"button",className:"mini",onClick:()=>l(0),children:"今月"})]}),f.jsxs("div",{className:"scal-body",children:[f.jsxs("button",{type:"button",className:"scal-side prev",onClick:()=>l(-1),"aria-label":"前の月",children:[f.jsx("span",{"aria-hidden":"true",children:"‹"}),f.jsx("span",{className:"scal-side-lbl",children:"前へ"})]}),f.jsxs("div",{className:"scal-main",children:[f.jsx("div",{className:"scal-wds",children:wr.map((j,C)=>{const A=L(C);return f.jsx("button",{type:"button","data-wd":C,className:"scal-wd"+(C===0?" sun":C===6?" sat":"")+(A==="all"?" all":A==="some"?" some":""),onClick:()=>I(C),title:`${j}曜日をこの月すべて${A==="all"?"削除":"追加"}`,"aria-label":`${j}曜日をこの月すべて${A==="all"?"削除":"追加"}`,children:j},j)})}),f.jsx("div",{className:"scal-grid"+(_?" painting":""),children:Array.from({length:Math.ceil(p.length/7)*7}).map((j,C)=>{const A=p[C];if(!A)return f.jsx("span",{className:"scal-cell pad"},"p"+C);const V=Yn(A),G=R(V),z=b(V),ne=A.getDay(),Y=!w(V),ue=D(V),fe=s?ue.indexOf(s)>=0:!1;return f.jsxs("button",{type:"button","data-date":V,className:"scal-cell"+(G?" on":"")+(ne===0?" sun":ne===6?" sat":"")+(V===li?" today":"")+(Y?" past":"")+(z===!0?" pv-on":z===!1?" pv-off":"")+(fe?" mine":""),style:fe||z===!0&&s?{background:X+"1f",borderColor:X}:void 0,onPointerDown:k=>S(V,k),"aria-pressed":G,"aria-label":`${A.getMonth()+1}月${A.getDate()}日 ${ue.length?ue.map(Bd).join("・"):"担当なし"}`,children:[f.jsx("span",{className:"num",children:A.getDate()}),f.jsxs("span",{className:"scal-dots",children:[ue.slice(0,3).map(k=>f.jsx("span",{className:"scal-dot",style:{background:Kx(k)}},k)),ue.length>3&&f.jsxs("span",{className:"scal-dot more num",children:["+",ue.length-3]})]})]},V)})})]}),f.jsxs("button",{type:"button",className:"scal-side next",onClick:()=>l(1),"aria-label":"次の月",children:[f.jsx("span",{"aria-hidden":"true",children:"›"}),f.jsx("span",{className:"scal-side-lbl",children:"次へ"})]})]}),f.jsxs("div",{className:"scal-foot",children:[f.jsx("span",{children:"日付をドラッグでなぞると、通った日をまとめて追加／削除します。曜日をクリックすると、その月の同じ曜日を一括で切り替えます。"}),!s&&f.jsx("span",{className:"scal-warn",children:"先に担当者を選んでください。"})]})]})}function b1({members:r,onAdd:e,onUpdate:t,onRemove:s}){const[o,l]=Ce.useState(null),[u,d]=Ce.useState({name:"",hr:"101",num:"",discord:"",color:Kr[0],hubUserId:null}),[m,p]=Ce.useState(""),[g,y]=Ce.useState([]),[_,M]=Ce.useState(!1);Ce.useEffect(()=>{!o||o==="new"||(M(!0),hx().then(y).catch(()=>y([])).finally(()=>M(!1)))},[o]);const E=b=>{l(b.id),d({name:b.name,hr:b.hr,num:String(b.num),discord:b.discord||"",color:b.color,hubUserId:b.userId??null}),p("")},w=()=>{l("new"),d({name:"",hr:"101",num:"",discord:"",color:Kr[r.length%Kr.length],hubUserId:null}),p("")},S=()=>{if(!u.name.trim())return"名前を入力してください";if(!Vp.includes(u.hr))return"HRは 101〜309 から選んでください";const b=Number(u.num);return!b||b<1||b>40?"番号は 1〜40 で入力してください":u.discord&&!/^\d{15,25}$/.test(u.discord.trim())?"Discord のユーザーIDは数字15〜25桁です":""},x=()=>{const b=S();if(b){p(b);return}const R={name:u.name.trim(),hr:u.hr,num:Number(u.num),discord:u.discord.trim(),color:u.color,hubUserId:u.hubUserId};o==="new"?e(R):t(o,R),l(null),p("")};return f.jsxs("div",{className:"mform",children:[f.jsxs("div",{className:"mform-h",children:[f.jsx("b",{children:"印刷担当者"}),f.jsxs("span",{className:"num",children:[r.length,"人"]}),o!=="new"&&f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:w,children:"担当者を追加"})]}),f.jsxs("div",{className:"mtable",children:[f.jsxs("div",{className:"mtr mtr-h",children:[f.jsx("span",{}),f.jsx("span",{children:"名前"}),f.jsx("span",{children:"HR"}),f.jsx("span",{children:"番号"}),f.jsx("span",{children:"Discord ID"}),f.jsx("span",{children:"ScienceHUB"}),f.jsx("span",{})]}),r.map(b=>f.jsxs("div",{className:"mtr",children:[f.jsx("span",{className:"mtd-av",style:{background:b.color},children:b.name.slice(0,1)}),f.jsx("span",{className:"mtd-name",children:b.name}),f.jsx("span",{className:"num",children:Hi(b.hr)}),f.jsxs("span",{className:"num",children:[b.num,"番"]}),f.jsx("span",{className:"num mtd-discord",children:b.discord||f.jsx("em",{className:"mtd-none",children:"未設定"})}),f.jsx("span",{className:"mtd-hub",children:b.userId?"紐づけ済":f.jsx("em",{className:"mtd-none",children:"未紐づけ"})}),f.jsxs("span",{className:"mtd-acts",children:[f.jsx("button",{type:"button",className:"mini",onClick:()=>E(b),children:"編集"}),f.jsx("button",{type:"button",className:"mini no",disabled:r.length<=1,onClick:()=>{confirm(`${b.name} を削除します。この人のシフトも消えます。`)&&s(b.id)},children:"削除"})]})]},b.id))]}),(o==="new"||o)&&f.jsxs("div",{className:"medit",children:[f.jsxs("div",{className:"medit-h",children:[f.jsx("b",{children:o==="new"?"担当者を追加":"担当者を編集"}),f.jsx("button",{type:"button",className:"linkbtn",onClick:()=>{l(null),p("")},children:"閉じる"})]}),f.jsxs("div",{className:"medit-grid",children:[f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["名前",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input",value:u.name,maxLength:12,onChange:b=>d(R=>({...R,name:b.target.value})),placeholder:"例：佐々木"})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["HR",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("select",{className:"input",value:u.hr,onChange:b=>d(R=>({...R,hr:b.target.value})),children:Vp.map(b=>f.jsx("option",{value:b,children:Hi(b)},b))})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["番号",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input num",type:"number",min:1,max:40,value:u.num,onChange:b=>d(R=>({...R,num:b.target.value})),placeholder:"12"})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["Discord ID",f.jsx("span",{className:"fl-opt",children:"任意"})]}),f.jsx("input",{className:"input num",value:u.discord,inputMode:"numeric",onChange:b=>d(R=>({...R,discord:b.target.value})),placeholder:"朝6時のメンション用"})]})]}),o!=="new"&&f.jsxs("div",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["ScienceHUB アカウント",f.jsx("span",{className:"fl-opt",children:"3D印刷管理にアクセス可能なユーザー"})]}),_?f.jsx("p",{className:"fl-h",children:"読み込み中…"}):f.jsxs("div",{className:"hub-user-pick",role:"radiogroup","aria-label":"ScienceHUB アカウントの紐づけ",children:[f.jsxs("button",{type:"button",className:"hub-user-opt"+(u.hubUserId===null?" on":""),onClick:()=>d(b=>({...b,hubUserId:null})),children:[f.jsx("b",{children:"紐づけなし"}),f.jsx("span",{children:"この印刷担当者は ScienceHUB ログインと結びつきません"})]}),g.map(b=>{const R=b.linked_member_id&&b.linked_member_id!==o;return f.jsxs("button",{type:"button",disabled:!!R,className:"hub-user-opt"+(u.hubUserId===b.id?" on":""),onClick:()=>d(D=>({...D,hubUserId:b.id})),children:[f.jsx("b",{children:b.display_name}),f.jsxs("span",{children:["@",b.username," · ",b.email]}),f.jsx("em",{children:b.access_labels.join(" / ")}),R?f.jsxs("em",{children:["（別の印刷担当に紐づけ済: ",b.linked_member_name,"）"]}):null,b.linked_member_id===o?f.jsx("em",{children:"（この担当者に紐づけ中）"}):null]},b.id)})]})]}),f.jsxs("div",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"シフト表の色"}),f.jsx("div",{className:"color-pick",children:Kr.map(b=>f.jsx("button",{type:"button",className:u.color===b?"on":"",style:{background:b},onClick:()=>d(R=>({...R,color:b})),"aria-label":`色 ${b}`,"aria-pressed":u.color===b},b))})]}),m&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:m})}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{l(null),p("")},children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:x,children:o==="new"?"追加する":"保存する"})]})]})]})}function R1({configured:r,onSend:e}){const[t,s]=Ce.useState(""),[o,l]=Ce.useState(null),[u,d]=Ce.useState(!1),m=async()=>{const p=t.trim();if(!p){l({ok:!1,text:"送信先メールアドレスを入力してください"});return}d(!0),l({ok:null,text:"送信中…"});try{const g=await e(p);l({ok:!0,text:`送信しました（${g.to??p}）`})}catch(g){l({ok:!1,text:g instanceof Error?g.message:"送信に失敗しました"})}finally{d(!1)}};return f.jsxs("section",{className:"intg","data-testid":"email-test-section",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"予約者向けメール（Cloudflare Email Sending）"}),f.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"設定済み":"未設定"})]}),f.jsx("p",{className:"fl-h",children:"申請・受領通知はサーバー環境変数（PRINT_3D_EMAIL_FROM、CLOUDFLARE_API_TOKEN 等）経由で送信されます。 下の欄に任意のアドレスを入れて、同じ経路のテストメールを送れます。"}),!r&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"メール送信が未設定です。Cloudflare Email Service のドメイン認証と Pages のシークレットを確認してください。"})}),f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"テスト送信先"}),f.jsx("input",{className:"input",type:"email",autoComplete:"email",spellCheck:!1,"data-testid":"email-test-to",value:t,onChange:p=>s(p.target.value),placeholder:"you@example.com",disabled:!r||u})]}),f.jsx("div",{className:"intg-f",children:f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"email-test-send",disabled:!r||u||!t.trim(),onClick:()=>void m(),children:"テスト送信"})}),o&&f.jsx("p",{className:"fl-h"+(o.ok===!0?"":o.ok===!1?" warn":""),role:"status","data-testid":"email-test-result",children:o.text})]})}function N1({configured:r,members:e,onSend:t}){var M;const[s,o]=Ce.useState(()=>new Set),[l,u]=Ce.useState(null),[d,m]=Ce.useState(!1),p=E=>{o(w=>{const S=new Set(w);return S.has(E)?S.delete(E):S.add(E),S})},g=async()=>{var w;const E=[...s];if(!E.length){u({ok:!1,text:"メンションする担当者を1人以上選んでください"});return}m(!0),u({ok:null,text:"Discord へ送信中…"});try{const S=await t(E),x=(S.sent||[]).map(R=>R.name).join("・"),b=((w=S.skipped)==null?void 0:w.length)>0?`（スキップ: ${S.skipped.map(R=>`${R.name}: ${R.reason}`).join(" / ")}）`:"";u({ok:!0,text:`送信しました。Discord で ${x} へのメンション（青字）を確認してください。${b}`,detail:S.content,sent:S.sent})}catch(S){u({ok:!1,text:S instanceof Error?S.message:"送信に失敗しました"})}finally{m(!1)}},y=e.filter(E=>(E.discord||"").trim()),_=e.some(E=>(E.discord||"").trim());return f.jsxs("section",{className:"intg","data-testid":"discord-mention-test-section",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"Discord メンションのテスト"}),f.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"Webhook設定済み":"Webhook未設定"})]}),f.jsxs("p",{className:"fl-h",children:["朝6時の担当者メンションと同じ形式で、選んだ担当者に ",f.jsx("code",{children:"<@ユーザーID>"})," を送ります。 チャンネルで名前が青く通知されれば、その Discord ID は正しく設定されています。"]}),!r&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"サーバーに Discord Webhook（DISCORD_WEBHOOK_URL）が未設定です。Wrangler / Pages の環境変数を確認してください。"})}),!_&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"担当者タブで Discord ユーザーID（数字）を登録してからテストしてください。"})}),f.jsxs("div",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"メンションする担当者"}),f.jsx("div",{className:"mp-list",style:{marginTop:8},children:e.map(E=>{const w=(E.discord||"").trim(),S=!!w,x=s.has(E.id);return f.jsxs("button",{type:"button",className:"mp"+(x?" on":"")+(S?"":" disabled"),style:x?{borderColor:E.color,background:E.color+"14"}:void 0,disabled:!r||d||!S,"data-testid":`discord-mention-member-${E.id}`,onClick:()=>S&&p(E.id),"aria-pressed":x,children:[f.jsx("span",{className:"mp-av",style:{background:E.color},children:E.name.slice(0,1)}),f.jsxs("span",{className:"mp-tx",children:[f.jsx("b",{children:E.name}),f.jsxs("span",{className:"num",children:[Hi(E.hr),"・",E.num,"番"]})]}),f.jsx("span",{className:"num mtd-discord",children:w||"ID未設定"})]},E.id)})}),y.length>0&&f.jsx("span",{className:"fl-h",children:"ID未設定の担当者は選択できません（担当者タブで編集）。"})]}),f.jsx("div",{className:"intg-f",children:f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"discord-mention-test-send",disabled:!r||d||s.size===0,onClick:()=>void g(),children:"メンションをテスト送信"})}),l&&f.jsx("p",{className:"fl-h"+(l.ok===!0?"":l.ok===!1?" warn":""),role:"status","data-testid":"discord-mention-test-result",children:l.text}),(l==null?void 0:l.ok)===!0&&((M=l.sent)==null?void 0:M.length)>0&&f.jsx("ul",{className:"fl-h","data-testid":"discord-mention-test-sent-list",style:{marginTop:4,paddingLeft:"1.2rem"},children:l.sent.map(E=>f.jsxs("li",{children:[f.jsx("b",{children:E.name})," — メンション ID: ",f.jsx("span",{className:"num",children:E.discord_user_id})]},E.member_id))}),(l==null?void 0:l.detail)&&f.jsxs("details",{className:"fl-h",style:{marginTop:8},children:[f.jsx("summary",{children:"送信したメッセージ本文"}),f.jsx("pre",{className:"mono",style:{whiteSpace:"pre-wrap",fontSize:"0.85em",marginTop:6},children:l.detail})]})]})}function P1({value:r,onChange:e,onTestDiscord:t,onTestDiscordMention:s,onTestGcal:o,onTestEmail:l,emailConfigured:u,discordConfigured:d,members:m}){const p=r.discord||{},g=r.gcal||{},y=x=>e({...r,discord:{...p,...x}}),_=x=>e({...r,gcal:{...g,...x}}),E=(p.webhook||"").includes("サーバー設定")||/^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(p.webhook||""),S=(g.calendarId||"").includes("サーバー設定")||/^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(g.calendarId||"");return f.jsxs("div",{className:"integ",children:[f.jsxs("section",{className:"intg",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"Discord 通知"}),f.jsx("span",{className:"intg-state "+(p.enabled?E?"ok":"warn":"off"),children:p.enabled?E?"有効":"URL未設定":"無効"}),f.jsxs("label",{className:"sw",children:[f.jsx("input",{type:"checkbox",checked:!!p.enabled,onChange:x=>y({enabled:x.target.checked})}),f.jsx("span",{})]})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["Webhook URL",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input mono",value:p.webhook||"",spellCheck:"false",onChange:x=>y({webhook:x.target.value.trim()}),placeholder:"https://discord.com/api/webhooks/123.../abc..."}),f.jsx("span",{className:"fl-h",children:"Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURL。"})]}),!E&&(p.webhook||"")&&f.jsx("div",{className:"note warn",children:f.jsxs("span",{children:["URLの形式が違います。",f.jsx("b",{children:"https://discord.com/api/webhooks/…"})," の形で貼り付けてください。"]})}),f.jsxs("div",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"通知するタイミング"}),f.jsx("div",{className:"chk-grid",children:[["pending","新しい申請"],["approved","確定したとき"],["cancelled","取り消したとき"]].map(([x,b])=>f.jsxs("label",{className:"chk",children:[f.jsx("input",{type:"checkbox",checked:!!(p.events&&p.events[x]),onChange:R=>y({events:{...p.events,[x]:R.target.checked}})}),f.jsx("span",{children:b})]},x))})]}),f.jsxs("label",{className:"chk",style:{alignSelf:"flex-start"},children:[f.jsx("input",{type:"checkbox",checked:!!p.dailyMention,onChange:x=>y({dailyMention:x.target.checked})}),f.jsx("span",{children:"当日の担当者を朝6:00にメンションする"})]}),f.jsx("span",{className:"fl-h",style:{marginTop:-6},children:"メンバーに登録した Discord ID を使います。未設定の人はメンションされません。"}),f.jsxs("div",{className:"intg-f",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:t,disabled:!E,children:"テスト送信"}),f.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),s&&(m==null?void 0:m.length)>0&&f.jsx(N1,{configured:!!d,members:m,onSend:s}),f.jsxs("section",{className:"intg",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"Google カレンダー"}),f.jsx("span",{className:"intg-state "+(g.enabled?S?"ok":"warn":"off"),children:g.enabled?S?"有効":"ID未設定":"無効"}),f.jsxs("label",{className:"sw",children:[f.jsx("input",{type:"checkbox",checked:!!g.enabled,onChange:x=>_({enabled:x.target.checked})}),f.jsx("span",{})]})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["カレンダーID",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input mono",value:g.calendarId||"",spellCheck:"false",onChange:x=>_({calendarId:x.target.value.trim()}),placeholder:"xxxx@group.calendar.google.com"}),f.jsx("span",{className:"fl-h",children:"共有カレンダーの「設定 → カレンダーの統合」に載っているID。"})]}),f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"予定タイトルの書式"}),f.jsx("input",{className:"input",value:g.title||"",onChange:x=>_({title:x.target.value}),placeholder:"[3Dプリント] {title}"}),f.jsxs("span",{className:"fl-h",children:["{title}"," 作品名 / ","{who}"," 申請者 / ","{machine}"," 機種 に置き換わります。"]})]}),f.jsxs("div",{className:"fl-2",children:[f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"所要時間"}),f.jsx("select",{className:"input",value:g.duration||20,onChange:x=>_({duration:Number(x.target.value)}),children:[10,15,20,30,60,90,120].map(x=>f.jsxs("option",{value:x,children:[x,"分"]},x))})]}),f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"登録する時点"}),f.jsxs("select",{className:"input",value:g.syncOn||"approved",onChange:x=>_({syncOn:x.target.value}),children:[f.jsx("option",{value:"pending",children:"申請が届いた時点"}),f.jsx("option",{value:"approved",children:"確定した時点"})]})]})]}),f.jsxs("div",{className:"intg-f",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:o,disabled:!S,children:"接続テスト"}),f.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),l&&f.jsx(R1,{configured:u,onSend:l})]})}function L1({members:r,avail:e,onAddMember:t,onUpdateMember:s,onRemoveMember:o,onPaintAvail:l,shiftDraftPending:u,shiftApplying:d,onConfirmShiftDraft:m,onDiscardShiftDraft:p,onLoadShiftMonth:g,integrations:y,setIntegrations:_,onTestDiscord:M,onTestDiscordMention:E,onTestGcal:w,onTestEmail:S,emailConfigured:x,discordConfigured:b,log:R,pendingPre:D}){const[X,I]=Ce.useState(D||"shift"),[L,j]=Ce.useState(r[0]?r[0].id:null),[C,A]=Ce.useState(()=>{const Y=new Date;return{y:Y.getFullYear(),m:Y.getMonth()+1}});Ce.useEffect(()=>{D&&I(D)},[D]),Ce.useEffect(()=>{r.length&&!r.find(Y=>Y.id===L)&&j(r[0].id)},[r]);const V=Ce.useRef("");Ce.useEffect(()=>{if(X!=="shift"||u)return;const Y=`${C.y}-${C.m}`;V.current!==Y&&(V.current=Y,g(C.y,C.m))},[X,C.y,C.m,g,u]);const G=[["shift","シフト表"],["member","担当者"],["integ","外部連携"]],z=Y=>{if(u){const ue=Y===0?"未保存のシフト変更があります。破棄して今月へ移動しますか？":"未保存のシフト変更があります。破棄して月を移動しますか？";if(!window.confirm(ue))return;p(),V.current=""}if(Y===0){const ue=new Date;A({y:ue.getFullYear(),m:ue.getMonth()+1});return}A(ue=>{let fe=ue.y,k=ue.m+Y;return k<1&&(k=12,fe-=1),k>12&&(k=1,fe+=1),{y:fe,m:k}})},ne=r.find(Y=>Y.id===L);return f.jsxs("div",{className:"set-wrap",children:[f.jsx("div",{className:"set-tabs",role:"tablist",children:G.map(([Y,ue])=>f.jsx("button",{type:"button",role:"tab","aria-selected":X===Y,className:X===Y?"on":"",onClick:()=>I(Y),children:ue},Y))}),X==="shift"&&f.jsxs("div",{className:"shifttab",children:[u&&f.jsxs("div",{className:"shift-confirm-bar",role:"status",children:[f.jsx("span",{className:"shift-confirm-bar-text",children:"未保存のシフト変更があります"}),f.jsxs("div",{className:"shift-confirm-bar-actions",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:d,onClick:p,children:"変更を破棄"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",disabled:d,onClick:m,children:d?"保存中…":"変更を確定"})]})]}),f.jsxs("div",{className:"card memberpick",children:[f.jsxs("div",{className:"mp-h",children:[f.jsx("b",{children:"担当者を選んで、日付を塗る"}),f.jsx("span",{className:"fl-h",children:"選択した担当者の稼働日をカレンダー上で直接追加・削除できます。確定するまでサーバーには保存されません。"})]}),f.jsx("div",{className:"mp-list",children:r.map(Y=>{const ue=(e[Y.id]||[]).filter(fe=>fe>=li).length;return f.jsxs("button",{type:"button",className:"mp"+(L===Y.id?" on":""),style:L===Y.id?{borderColor:Y.color,background:Y.color+"14"}:void 0,onClick:()=>j(Y.id),children:[f.jsx("span",{className:"mp-av",style:{background:Y.color},children:Y.name.slice(0,1)}),f.jsxs("span",{className:"mp-tx",children:[f.jsx("b",{children:Y.name}),f.jsxs("span",{className:"num",children:[Hi(Y.hr),"・",Y.num,"番"]})]}),f.jsxs("span",{className:"mp-count num",children:[ue,"日"]})]},Y.id)})})]}),f.jsxs("div",{className:"card",children:[f.jsxs("div",{className:"card-h",children:[f.jsx("b",{children:"シフト表"}),f.jsx("span",{className:"meta",children:ne?`${ne.name} の稼働日`:"担当者を選択"}),ne&&f.jsx("span",{className:"chip",style:{marginLeft:"auto",borderColor:ne.color,color:ne.color},children:"ドラッグで追加"})]}),f.jsxs("div",{className:"shifttab-body",children:[f.jsx(C1,{year:C.y,month:C.m,avail:e,memberId:L,onPaint:(Y,ue)=>l(L,Y,ue),onChangeMonth:z}),f.jsxs("div",{className:"srule-wrap",children:[f.jsxs("div",{className:"srule-h",children:[f.jsx("b",{children:"この月の担当"}),f.jsx("span",{className:"fl-h",children:"日付をドラッグでなぞるか、上の曜日をクリックすると一括で切り替わります。編集後は「変更を確定」でまとめて保存します。"})]}),f.jsx(D1,{members:r,avail:e,month:C,onPickMember:j})]})]})]})]}),X==="member"&&f.jsx(b1,{members:r,onAdd:t,onUpdate:s,onRemove:o}),X==="integ"&&f.jsx(P1,{value:y,onChange:_,onTestDiscord:M,onTestDiscordMention:E,onTestGcal:w,onTestEmail:S,emailConfigured:x,discordConfigured:b,members:r})]})}function D1({members:r,avail:e,month:t,onPickMember:s}){const o=[],l=new Date(t.y,t.m,0).getDate();for(let u=1;u<=l;u++)o.push(Yn(new Date(t.y,t.m-1,u)));return f.jsxs("div",{className:"slegend",children:[r.map(u=>{const d=o.filter(m=>(e[u.id]||[]).indexOf(m)>=0);return f.jsxs("button",{type:"button",className:"sl",onClick:()=>s(u.id),children:[f.jsx("span",{className:"sl-dot",style:{background:u.color}}),f.jsxs("span",{className:"sl-tx",children:[f.jsx("b",{children:u.name}),f.jsxs("span",{className:"num",children:[d.length,"日"]})]})]},u.id)}),f.jsx("p",{className:"sl-note",children:"日付の下の点が、その日に入っている担当者の色です。"})]})}const U1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function I1(r){const e=String(r??"");return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function F1(r){const e=[...r].sort((o,l)=>{const u=l.desired_date.localeCompare(o.desired_date);return u!==0?u:l.created_at.localeCompare(o.created_at)}),s=[["希望日","HR","番号","氏名","タイトル","規模","ステータス","担当","プリンター","STL","作成日時"].join(",")];for(const o of e)s.push([o.desired_date,o.homeroom,o.student_number,o.student_name,o.title,o.print_scale,U1[o.status]??o.status,o.print_staff_label??"",o.printer_name??"",o.stl_filename??"",o.created_at].map(I1).join(","));return"\uFEFF"+s.join(`
`)}function O1(r){const e=F1(r),t=new Blob([e],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a"),l=new Date().toISOString().slice(0,10);o.href=s,o.download=`3dprint_history_${l}.csv`,o.click(),URL.revokeObjectURL(s)}const k1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"},z1={small:"S",medium:"M",large:"L"};function B1({reservations:r,onOpen:e}){const t=[...r].sort((s,o)=>{const l=o.desired_date.localeCompare(s.desired_date);return l!==0?l:o.created_at.localeCompare(s.created_at)});return t.length?f.jsxs("div",{className:"card legacy-panel",children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"0 0 10px",flexWrap:"wrap"},children:[f.jsxs("p",{className:"hint",style:{margin:0},children:["全 ",t.length," 件"]}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:!t.length,onClick:()=>O1(t),children:"CSVエクスポート"})]}),f.jsx("div",{className:"table-wrap admin-table-wrap",children:f.jsxs("table",{children:[f.jsx("thead",{children:f.jsxs("tr",{children:[f.jsx("th",{children:"希望日"}),f.jsx("th",{children:"HR"}),f.jsx("th",{children:"タイトル"}),f.jsx("th",{children:"規模"}),f.jsx("th",{children:"ステータス"}),f.jsx("th",{children:"担当"}),f.jsx("th",{})]})}),f.jsx("tbody",{children:t.map(s=>f.jsxs("tr",{children:[f.jsx("td",{children:s.desired_date}),f.jsx("td",{children:s.homeroom}),f.jsx("td",{children:s.title}),f.jsx("td",{children:z1[s.print_scale]??s.print_scale}),f.jsx("td",{children:f.jsx("span",{className:`status-badge status-${s.status}`,children:k1[s.status]??s.status})}),f.jsx("td",{children:s.print_staff_label?`担当: ${s.print_staff_label}`:"—"}),f.jsx("td",{children:f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>e(s),children:"詳細"})})]},s.id))})]})})]}):f.jsx("p",{className:"hint admin-list-empty",children:"履歴がありません"})}function H1({onToast:r,onReload:e}){var A,V;const[t,s]=Ce.useState([]),[o,l]=Ce.useState(""),[u,d]=Ce.useState(null),[m,p]=Ce.useState(""),[g,y]=Ce.useState(null),[_,M]=Ce.useState(!1),[E,w]=Ce.useState([]),[S,x]=Ce.useState(""),[b,R]=Ce.useState([]),D=Ce.useCallback(async()=>{const[G,z]=await Promise.all([Ex(),zx()]);s(G.printers),p(z.storage_path??""),w(z.group_roots??[])},[]);Ce.useEffect(()=>{D().catch(G=>r(G instanceof Error?G.message:"読み込み失敗"))},[D,r]);const X=async()=>{if(o.trim())try{await wx(o.trim(),u??void 0),l(""),d(null),await D(),e==null||e(),r("プリンターを追加しました")}catch(G){r(G instanceof Error?G.message:"追加失敗")}},I=async()=>{try{await Bx(m.trim()),r("印刷動画の保存先を更新しました")}catch(G){r(G instanceof Error?G.message:"保存失敗")}},L=async()=>{var z,ne;if(!g)return;const G=(((z=g.capabilities)==null?void 0:z.nozzle_sizes_mm)??["0.4"]).map(String).filter(Boolean);try{await Tx(g.id,{name:g.name.trim(),status:g.status,capabilities:{can_record_print_video:!!((ne=g.capabilities)!=null&&ne.can_record_print_video),nozzle_sizes_mm:G},daily_capacity:g.daily_capacity}),y(null),await D(),r("更新しました")}catch(Y){r(Y instanceof Error?Y.message:"更新失敗")}},j=async()=>{M(!0),x(""),R([])},C=async G=>{if(x(G),!G){R([]);return}const z=await Fx(G);R(z.items.map(ne=>({path:ne.path,name:ne.name})))};return f.jsxs("div",{className:"legacy-panel",children:[f.jsxs("section",{className:"card",id:"print-video-settings-section",children:[f.jsx("h2",{className:"section-heading",children:"印刷動画の保存先"}),f.jsx("p",{className:"hint",children:"管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。"}),f.jsxs("div",{className:"form-group",children:[f.jsx("label",{htmlFor:"print-video-storage-path",children:"保存先フォルダ"}),f.jsxs("div",{style:{display:"flex",gap:8},children:[f.jsx("input",{id:"print-video-storage-path",className:"input",value:m,readOnly:!0,placeholder:"未設定（参照から選択）"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void j(),children:"参照…"})]})]}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void I(),children:"保存先を保存"})]}),f.jsxs("section",{className:"card",style:{marginTop:16},children:[f.jsx("h2",{className:"section-heading",children:"プリンター管理"}),f.jsx("div",{className:"printer-admin-grid",children:t.map(G=>{var z,ne;return f.jsxs("article",{className:"printer-admin-card",children:[G.image_url?f.jsx("img",{className:"printer-admin-image",src:G.image_url,alt:""}):f.jsx("div",{className:"printer-admin-image printer-admin-image-placeholder",children:"🖨️"}),f.jsx("div",{className:"printer-admin-body",children:f.jsxs(f.Fragment,{children:[f.jsx("h3",{className:"printer-admin-title",children:G.name}),f.jsxs("p",{className:"hint printer-admin-cap-summary",children:[G.status??"available"," / ノズル ",(((z=G.capabilities)==null?void 0:z.nozzle_sizes_mm)??[]).join(", ")||"—"," /"," ",(ne=G.capabilities)!=null&&ne.can_record_print_video?"動画撮影可":"動画撮影不可"]}),f.jsxs("div",{className:"printer-admin-actions",children:[f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>y(G),children:"編集"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{confirm(`「${G.name}」を削除しますか？`)&&Cx(G.id).then(D).then(()=>r("削除しました")).catch(Y=>r(Y instanceof Error?Y.message:"削除失敗"))},children:"削除"}),f.jsxs("label",{className:"btn btn-secondary btn-sm",children:["画像",f.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:Y=>{var fe;const ue=(fe=Y.target.files)==null?void 0:fe[0];ue&&Ax(G.id,ue).then(D).catch(k=>r(k instanceof Error?k.message:"画像失敗"))}})]})]})]})})]},G.id)})}),f.jsxs("div",{className:"mem-add",style:{marginTop:16},children:[f.jsx("input",{className:"input",placeholder:"新しいプリンター名",value:o,onChange:G=>l(G.target.value)}),f.jsx("input",{type:"file",accept:"image/*",onChange:G=>{var z;return d(((z=G.target.files)==null?void 0:z[0])??null)}}),f.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>void X(),children:"追加"})]})]}),g&&f.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[f.jsx("div",{className:"legacy-modal-scrim",onClick:()=>y(null)}),f.jsxs("div",{className:"legacy-modal-body card",children:[f.jsxs("h2",{children:[g.name," を編集"]}),f.jsxs("label",{className:"form-group",children:["名前",f.jsx("input",{className:"input",value:g.name,onChange:G=>y({...g,name:G.target.value})})]}),f.jsxs("label",{className:"form-group",children:["ステータス",f.jsxs("select",{className:"input",value:g.status??"available",onChange:G=>y({...g,status:G.target.value}),children:[f.jsx("option",{value:"available",children:"稼働"}),f.jsx("option",{value:"maintenance",children:"メンテ"}),f.jsx("option",{value:"unavailable",children:"印刷不能"})]})]}),f.jsxs("label",{className:"form-group",children:["ノズル径（カンマ区切り）",f.jsx("input",{className:"input",value:(((A=g.capabilities)==null?void 0:A.nozzle_sizes_mm)??[]).join(", "),onChange:G=>y({...g,capabilities:{...g.capabilities,nozzle_sizes_mm:G.target.value.split(",").map(z=>z.trim()).filter(Boolean)}})})]}),f.jsxs("label",{className:"chk",children:[f.jsx("input",{type:"checkbox",checked:!!((V=g.capabilities)!=null&&V.can_record_print_video),onChange:G=>y({...g,capabilities:{...g.capabilities,can_record_print_video:G.target.checked}})}),"動画撮影可"]}),f.jsx("div",{className:"form-grid",style:{gridTemplateColumns:"1fr 1fr",marginTop:8},children:["max_small","max_small_with_main","max_medium","max_large"].map(G=>{var z;return f.jsxs("label",{children:[G,f.jsx("input",{className:"input",type:"number",value:((z=g.daily_capacity)==null?void 0:z[G])??0,onChange:ne=>y({...g,daily_capacity:{...g.daily_capacity,[G]:Number(ne.target.value)}})})]},G)})}),f.jsxs("div",{className:"legacy-modal-actions",children:[f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>y(null),children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>void L(),children:"保存"})]})]})]}),_&&f.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[f.jsx("div",{className:"legacy-modal-scrim",onClick:()=>M(!1)}),f.jsxs("div",{className:"legacy-modal-body card",children:[f.jsx("h2",{children:"保存先フォルダ"}),f.jsx("p",{className:"hint",children:S||"チームを選んでください"}),f.jsxs("div",{style:{display:"grid",gap:6,maxHeight:280,overflow:"auto"},children:[!S&&E.map(G=>f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void C(G.path),children:G.label},G.path)),S&&f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void C(""),children:"チームへ戻る"}),b.map(G=>f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void C(G.path),children:G.name},G.path))]}),f.jsxs("div",{className:"legacy-modal-actions",children:[f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>M(!1),children:"閉じる"}),f.jsx("button",{type:"button",className:"btn btn-primary",disabled:!S,onClick:()=>{p(S),M(!1)},children:"このフォルダを選択"})]})]})]})]})}const j1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function V1({reservation:r,onClose:e,onToast:t,onUpdated:s}){const[o,l]=Ce.useState(!1);if(Ce.useEffect(()=>{l(!!(r!=null&&r.has_print_video))},[r]),!r)return null;const u=async m=>{try{await Hx(r.id,m),l(!0),t("印刷動画をアップロードしました"),s()}catch(p){t(p instanceof Error?p.message:"アップロード失敗")}},d=async()=>{try{await jx(r.id),l(!1),t("印刷動画を削除しました"),s()}catch(m){t(m instanceof Error?m.message:"削除失敗")}};return f.jsxs(X0,{open:!!r,title:r.title,sub:`${r.desired_date} · ${r.printer_name??""}`,onClose:e,footer:f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[f.jsxs("dl",{className:"kv",children:[f.jsxs("div",{children:[f.jsx("dt",{children:"ステータス"}),f.jsx("dd",{children:j1[r.status]??r.status})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"申請者"}),f.jsxs("dd",{children:[r.student_name,"（",r.homeroom," · ",r.student_number,"）"]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"担当"}),f.jsx("dd",{children:r.print_staff_label??"—"})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"規模"}),f.jsx("dd",{children:r.print_scale})]})]}),f.jsx("div",{className:"ftitle",children:"印刷動画"}),o?f.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[f.jsx("a",{className:"btn btn-secondary btn-sm",href:Vx(r.id),download:!0,children:"動画をダウンロード"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void d(),children:"動画を削除"})]}):f.jsx("p",{className:"hint",children:"未アップロード"}),f.jsx("input",{type:"file",accept:"video/*",onChange:m=>{var g;const p=(g=m.target.files)==null?void 0:g[0];p&&u(p)}}),f.jsx("div",{style:{marginTop:12,display:"flex",gap:8},children:f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void wd(r.id,{status:"delivered"}).then(s).then(()=>t("完了にしました")).catch(m=>t(m instanceof Error?m.message:"更新失敗")),children:"完了にする"})})]})}function G1({showToast:r}){const[e,t]=Ce.useState("printers"),[s,o]=Ce.useState(null),[l,u]=Ce.useState(0),[d,m]=Ce.useState([]);Ce.useEffect(()=>{Mx().then(m)},[l]);const p=g=>r(g);return f.jsxs("div",{className:"set-wrap",children:[f.jsxs("div",{className:"set-tabs",role:"tablist",children:[f.jsx("button",{type:"button",role:"tab",className:e==="printers"?"on":"",onClick:()=>t("printers"),children:"プリンター"}),f.jsx("button",{type:"button",role:"tab",className:e==="history"?"on":"",onClick:()=>t("history"),children:"印刷履歴"})]}),e==="printers"?f.jsx(H1,{onToast:p,onReload:()=>u(g=>g+1)},l):f.jsx(B1,{reservations:d,onOpen:g=>o(g)}),f.jsx(V1,{reservation:s,onClose:()=>o(null),onToast:p,onUpdated:()=>u(g=>g+1)})]})}function W1(){const r=bg(),[e,t]=Ce.useState(!0),[s,o]=Ce.useState([]),[l,u]=Ce.useState([]),[d,m]=Ce.useState({}),[p,g]=Ce.useState({}),[y,_]=Ce.useState(!1),[M,E]=Ce.useState(()=>r.screen||"reserve"),[w,S]=Ce.useState(()=>r.selected||li),[x,b]=Ce.useState(null),[R,D]=Ce.useState(()=>a0()??R0()),[X,I]=Ce.useState(()=>r0()),[L,j]=Ce.useState(null),[C,A]=Ce.useState(null),[V,G]=Ce.useState(null),[z,ne]=Ce.useState(null),[Y,ue]=Ce.useState(null),[fe,k]=Ce.useState(!1),[de,te]=Ce.useState(!1),O=Ce.useCallback((B,J)=>{qx(B),dl(J)},[]),ae=Ce.useCallback(async B=>{const{from:J,to:_e}=w0(B),[{applications:Te},Ee]=await Promise.all([dx(J,_e),cx(J,_e)]),Be=new Map;for(const Ie of Te)Be.set(Ie.id,Xp(Ie));for(const Ie of Ee.applications)Be.set(Ie.id,Xp(Ie));u([...Be.values()])},[]),Ue=Ce.useCallback(async()=>{var Be;const B=await fx(),J=y0(B);o(J);const _e=zn(w),Te=await Up(_e.getFullYear(),_e.getMonth()+1),Ee=Ig(Te.availability);m(Ee),g(Ee),O(J,Ee);try{b(await Pp())}catch{}await ae(w);try{const Ie=await Nx();k(!!Ie.email.configured),te(!!Ie.discord.configured),D(dt=>({...dt,discord:{...dt.discord,webhook:Ie.discord.configured?"(サーバー設定)":""},gcal:{...dt.gcal,calendarId:Ie.gcal.configured?"(サーバー設定)":""}}))}catch{}try{const Ie=await Ix(80);(Be=Ie.log)!=null&&Be.length&&I(Ie.log.map(dt=>({id:dt.id,at:dt.at,actor:dt.actor,type:dt.type,text:dt.text,appId:dt.app_id})))}catch{}},[ae,w,O]);Ce.useEffect(()=>{(async()=>{try{await Ue()}catch(B){pe.current(B instanceof Error?B.message:"読み込みに失敗しました","エラー")}finally{t(!1)}})()},[Ue]),Ce.useEffect(()=>{if(e)return;const B=new URLSearchParams(window.location.search),J=B.get("selected"),_e=B.get("app");if(J&&/^\d{4}-\d{2}-\d{2}$/.test(J)&&S(J),_e){const Te=l.find(Ee=>Ee.id===_e);Te&&(S(Te.date),j(Te),A("view"))}},[e,l]),Ce.useEffect(()=>{i0({screen:M,selected:w})},[M,w]),Ce.useEffect(()=>{o0(R)},[R]),Ce.useEffect(()=>{s0(X)},[X]);const Q=x?b0(x):"—",pe=Ce.useRef(()=>{}),he=Ce.useCallback((B,J)=>{ue({text:B,mark:J}),window.setTimeout(()=>ue(null),2600)},[]);pe.current=he;const ge=Ce.useCallback((B,J,_e=null)=>{I(Te=>[{id:"l"+Date.now()+Math.random().toString(36).slice(2,5),at:new Date().toISOString(),actor:Q,type:B,text:J,appId:_e},...Te]),Ux({type:B,text:J,app_id:_e}).catch(()=>{})},[Q]),ke=(B,J)=>{j(B),A(J??null)},He=()=>{j(null),A(null)},q=(B,J)=>{u(_e=>_e.map(Te=>Te.id===B?{...Te,...J}:Te)),j(_e=>_e&&_e.id===B?{..._e,...J}:_e)},ht=async(B,J,_e,Te)=>{var Be;if(Te!==void 0&&J===null){try{await wd(B.id,{status_comment:Te}),q(B.id,{adminNote:Te}),ge("approve",`「${B.title}」に担当者メモを追加`,B.id),he("担当者メモを保存しました")}catch(Ie){he(Ie instanceof Error?Ie.message:"保存に失敗しました","エラー")}return}if(!J)return;const Ee=C0(s,((Be=x==null?void 0:x.linked_member)==null?void 0:Be.id)??null);try{if(J==="approved"&&B.status==="pending"){if(!Ee)throw new Error("予約を受領するには、担当者タブで ScienceHUB アカウントと印刷担当者を紐づけてください");await xx(B.id,Ee)}else B.status==="cancelled"&&J==="pending"?await ux(B.id):await wd(B.id,{status:E0(J)});q(B.id,{status:J,..._e||{},by:Q});const Ie=Qs[J];ge(J==="cancelled"?"cancel":"approve",`「${B.title}」を${Ie}（${hl(B.date)}・${yi[B.kind]}）`,B.id),he(`${B.title} を${Ie}にしました`,Ie),await ae(w)}catch(Ie){he(Ie instanceof Error?Ie.message:"更新に失敗しました","エラー")}},Ye=async(B,J,_e,Te)=>{const Ee=Hd(B);if(J.length===Ee.length){await ht(B,_e,Te);return}try{await Rx(B.id,{slot_indexes:J,target_status:_e});const Ie=Qs[_e],dt=`${qt(Qa(J[0]))}〜${qt(Qa(J[J.length-1])+Zs)}`;ge(_e==="cancelled"?"cancel":"approve",`「${B.title}」の ${dt}（${J.length}枠）を${Ie}`,B.id),he(`${dt} を${Ie}にしました`,`${J.length}枠`),He(),await ae(w)}catch(Ie){he(Ie instanceof Error?Ie.message:"部分更新に失敗しました","エラー")}},mt=async(B,J,_e,Te)=>{if(Te==="note"){await ht(B,null,void 0,_e);return}if(Te==="approved"||Te==="pending"||Te==="done"){await ht(B,Te);return}const Ee=J?_e||J.body:_e;await ht(B,"cancelled",J?{rejectReason:J.id,adminNote:Ee}:{adminNote:Ee})},Ke=async(B,J,_e)=>{if(!J||J===B.date)return;const Te=B.date;try{await bx(B.id,J,!!(_e!=null&&_e.forced)),ge("move",`「${B.title}」を ${hl(Te)} → ${hl(J)} に変更（${yi[B.kind]}${_e!=null&&_e.forced?"・強制":""}）`,B.id),he(`${B.title} を ${Ug(J)} に変更しました`,_e!=null&&_e.forced?"強制":yi[B.kind]),S(J),G(null),He(),await ae(J)}catch(Ee){he(Ee instanceof Error?Ee.message:"移動に失敗しました","エラー")}},ut=async B=>{try{await mx({name:B.name,homeroom:B.hr,student_number:B.num,discord_user_id:B.discord||null}),await Ue(),ge("member",`担当者「${B.name}」を追加`,null),he(`${B.name} を追加しました`)}catch(J){he(J instanceof Error?J.message:"追加に失敗しました","エラー")}},rt=async(B,J)=>{try{await Ox(B,S0(J.color)),await kx(B,J.discord.trim()||null),await px(B,J.hubUserId),await Ue();try{b(await Pp())}catch{}const _e=Jr(B);ge("member",`担当者「${_e?_e.name:B}」を更新`,null),he(`${J.name} を更新しました`)}catch(_e){he(_e instanceof Error?_e.message:"更新に失敗しました","エラー")}},at=async B=>{try{const J=Jr(B);await gx(B),await Ue(),ge("member",`担当者「${J?J.name:B}」を削除（シフトも削除）`,null),he(`${J?J.name:"担当者"} を削除しました`)}catch(J){he(J instanceof Error?J.message:"削除に失敗しました","エラー")}},At=(B,J,_e)=>{m(Te=>{const Ee=new Set(Te[B]||[]);J.forEach(Ie=>_e?Ee.add(Ie):Ee.delete(Ie));const Be={...Te,[B]:[...Ee].sort()};return dl(Be),Be})},F=vx(pl(p),pl(d),[],[]),N=()=>{const B={};for(const[J,_e]of Object.entries(p))B[J]=[..._e];m(B),dl(B)},ce=async()=>{if(!(!F||y)){_(!0);try{await _x(pl(p),pl(d),[],[]),g(()=>{const B={};for(const[J,_e]of Object.entries(d))B[J]=[..._e];return B}),ge("shift","シフト表を一括保存",null),he("シフトを保存しました","確定")}catch(B){he(B instanceof Error?B.message:"シフト保存に失敗しました","エラー"),await Ue()}finally{_(!1)}}},ve=Ce.useCallback(async(B,J)=>{try{const _e=await Up(B,J),Te=Ee=>A0(Ee,_e.availability,B,J);g(Ee=>Te(Ee)),m(Ee=>{const Be=Te(Ee);return dl(Be),Be})}catch(_e){pe.current(_e instanceof Error?_e.message:"シフト読込に失敗しました","エラー")}},[]),Me=async()=>{he("Discordへテスト送信しています…");try{await Px(),ge("integ","Discordへテスト通知を送信",null),he("Discordへ送信しました","成功")}catch(B){he(B instanceof Error?B.message:"送信に失敗しました","エラー")}},we=async B=>{const J=await Lx(B),_e=J.sent.map(Te=>Te.name).join("・");return ge("integ",`Discordメンションテスト: ${_e}`,null),J},qe=async()=>{try{const B=await yx();B.ok?(ge("integ","Googleカレンダー接続テスト成功",null),he("Googleカレンダーに接続できました","接続OK")):he(B.error||"接続に失敗しました","エラー")}catch(B){he(B instanceof Error?B.message:"接続テストに失敗しました","エラー")}},Pe=async B=>{const J=await Dx(B);return ge("integ",`テストメールを ${J.to} に送信`,null),J},Ne=()=>{const B=Sg(zn(w)),J=kl(B,27),_e=N0(l,Yn(B),Yn(J),s.map(Ie=>({id:Ie.id,name:Ie.name}))),Te=new Blob([_e],{type:"text/csv;charset=utf-8"}),Ee=URL.createObjectURL(Te),Be=document.createElement("a");Be.href=Ee,Be.download=`3dprint_${Yn(B)}_${Yn(J)}.csv`,document.body.appendChild(Be),Be.click(),Be.remove(),window.setTimeout(()=>URL.revokeObjectURL(Ee),1e3),he("CSVを書き出しました",`${Hp(B)}–${Hp(J)}`)},nt=Qx(l);return e?f.jsx("main",{className:"main-content",style:{padding:"2rem"},children:f.jsx("p",{children:"読み込み中…"})}):f.jsxs(f.Fragment,{children:[f.jsx(k0,{screen:M,setScreen:E,operatorSession:x,pendingCount:nt.length,onCsv:Ne}),f.jsxs("main",{className:"main-content","data-testid":"management-app",children:[f.jsx("div",{className:"page-head",children:f.jsxs("div",{style:{minWidth:0},children:[f.jsx("span",{className:"badge",children:"校内設備 / 自然科学部 3Dモデル班"}),f.jsx("h1",{className:"page-heading",children:M==="reserve"?"3Dプリント 申請の管理":M==="settings"?"シフト・担当者・外部連携":"運用（プリンター・履歴）"})]})}),M==="reserve"?f.jsx(w1,{apps:l,selected:w,onPick:S,onOpen:ke,onApprove:B=>void ht(B,"approved"),onCancel:(B,J,_e,Te)=>void mt(B,J,_e,Te),onPartial:(B,J,_e,Te)=>void Ye(B,J,_e,Te),log:X,onDownload:(B,J)=>{J==="file"?window.open(`/api/3dprint/admin/stl/${B.id}`,"_blank"):D0(B,J),he(`${B.title} をダウンロードしました`,J==="file"?B.file:"申請書")},onDownloadAll:B=>{const J=U0(l,B);he(`${hl(B)} の申請 ${J}件を書き出しました`,"一括DL")},onMove:B=>G(B)}):M==="settings"?f.jsx(L1,{members:s,avail:d,onAddMember:B=>void ut(B),onUpdateMember:(B,J)=>void rt(B,J),onRemoveMember:B=>void at(B),onPaintAvail:At,shiftDraftPending:F,shiftApplying:y,onConfirmShiftDraft:()=>void ce(),onDiscardShiftDraft:N,onLoadShiftMonth:ve,integrations:R,setIntegrations:D,onTestDiscord:()=>void Me(),onTestDiscordMention:we,onTestGcal:()=>void qe(),onTestEmail:Pe,emailConfigured:fe,discordConfigured:de,log:X,pendingPre:z}):f.jsx(G1,{showToast:he})]}),f.jsx("footer",{className:"site-footer",children:f.jsxs("div",{className:"footer-inner",children:[f.jsx("img",{src:Fg,alt:""}),f.jsxs("div",{className:"club",children:[f.jsx("b",{children:"松山南高校 自然科学部 / 3Dモデル班"}),f.jsx("span",{children:"承認・取り消しは担当者のみ。操作は記録されます。"})]}),f.jsxs("div",{className:"right",children:[f.jsx("a",{href:"/apps/3dprint-reservation/",children:"申請フォーム（生徒用）"}),f.jsx("a",{href:"mailto:diorama@mmh-virtual.jp",children:"diorama@mmh-virtual.jp"})]})]})}),f.jsx(E1,{app:L,log:X,onClose:He,onPartial:(B,J,_e,Te)=>void Ye(B,J,_e,Te),onCancelAll:(B,J,_e,Te)=>void mt(B,J,_e,Te),onMove:B=>G(B)}),f.jsx(A1,{open:!!V,app:V,apps:l,onClose:()=>G(null),onMove:Ke}),f.jsx(G0,{toast:Y})]})}function X1(){const[r,e]=Ce.useState(!1),[t,s]=Ce.useState(!1);return Ce.useEffect(()=>{(async()=>{const o=await lx();if(o==="login"){const l=encodeURIComponent(window.location.pathname+window.location.search);window.location.href=`/login/?next=${l}`;return}if(o==="denied"){s(!0);return}e(!0)})()},[]),t?f.jsxs("main",{style:{padding:"2rem",fontFamily:"Inter, sans-serif"},children:[f.jsx("h1",{children:"アクセス拒否"}),f.jsx("p",{children:"3D印刷管理アプリを利用する権限がありません。"}),f.jsx("p",{children:f.jsx("a",{href:"/",children:"ダッシュボードに戻る"})})]}):r?f.jsx(W1,{}):f.jsx("main",{className:"main-content",style:{padding:"2rem"},children:f.jsx("p",{children:"読み込み中…"})})}document.body.classList.add("admin-app");ax.createRoot(document.getElementById("root")).render(f.jsx(Ce.StrictMode,{children:f.jsx(X1,{})}));
