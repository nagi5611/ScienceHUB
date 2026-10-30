var Z_=Object.defineProperty;var J_=(r,e,t)=>e in r?Z_(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Rs=(r,e,t)=>J_(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function Q_(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var zu={exports:{}},Ha={},Bu={exports:{}},ft={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ep;function ex(){if(Ep)return ft;Ep=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),u=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),y=Symbol.iterator;function _(O){return O===null||typeof O!="object"?null:(O=y&&O[y]||O["@@iterator"],typeof O=="function"?O:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,w={};function S(O,ae,Ue){this.props=O,this.context=ae,this.refs=w,this.updater=Ue||M}S.prototype.isReactComponent={},S.prototype.setState=function(O,ae){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,ae,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function x(){}x.prototype=S.prototype;function b(O,ae,Ue){this.props=O,this.context=ae,this.refs=w,this.updater=Ue||M}var R=b.prototype=new x;R.constructor=b,E(R,S.prototype),R.isPureReactComponent=!0;var D=Array.isArray,$=Object.prototype.hasOwnProperty,I={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};function j(O,ae,Ue){var Q,pe={},he=null,ge=null;if(ae!=null)for(Q in ae.ref!==void 0&&(ge=ae.ref),ae.key!==void 0&&(he=""+ae.key),ae)$.call(ae,Q)&&!L.hasOwnProperty(Q)&&(pe[Q]=ae[Q]);var ke=arguments.length-2;if(ke===1)pe.children=Ue;else if(1<ke){for(var je=Array(ke),K=0;K<ke;K++)je[K]=arguments[K+2];pe.children=je}if(O&&O.defaultProps)for(Q in ke=O.defaultProps,ke)pe[Q]===void 0&&(pe[Q]=ke[Q]);return{$$typeof:r,type:O,key:he,ref:ge,props:pe,_owner:I.current}}function C(O,ae){return{$$typeof:r,type:O.type,key:ae,ref:O.ref,props:O.props,_owner:O._owner}}function T(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function V(O){var ae={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(Ue){return ae[Ue]})}var G=/\/+/g;function z(O,ae){return typeof O=="object"&&O!==null&&O.key!=null?V(""+O.key):ae.toString(36)}function X(O,ae,Ue,Q,pe){var he=typeof O;(he==="undefined"||he==="boolean")&&(O=null);var ge=!1;if(O===null)ge=!0;else switch(he){case"string":case"number":ge=!0;break;case"object":switch(O.$$typeof){case r:case e:ge=!0}}if(ge)return ge=O,pe=pe(ge),O=Q===""?"."+z(ge,0):Q,D(pe)?(Ue="",O!=null&&(Ue=O.replace(G,"$&/")+"/"),X(pe,ae,Ue,"",function(K){return K})):pe!=null&&(T(pe)&&(pe=C(pe,Ue+(!pe.key||ge&&ge.key===pe.key?"":(""+pe.key).replace(G,"$&/")+"/")+O)),ae.push(pe)),1;if(ge=0,Q=Q===""?".":Q+":",D(O))for(var ke=0;ke<O.length;ke++){he=O[ke];var je=Q+z(he,ke);ge+=X(he,ae,Ue,je,pe)}else if(je=_(O),typeof je=="function")for(O=je.call(O),ke=0;!(he=O.next()).done;)he=he.value,je=Q+z(he,ke++),ge+=X(he,ae,Ue,je,pe);else if(he==="object")throw ae=String(O),Error("Objects are not valid as a React child (found: "+(ae==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":ae)+"). If you meant to render a collection of children, use an array instead.");return ge}function Y(O,ae,Ue){if(O==null)return O;var Q=[],pe=0;return X(O,Q,"","",function(he){return ae.call(Ue,he,pe++)}),Q}function le(O){if(O._status===-1){var ae=O._result;ae=ae(),ae.then(function(Ue){(O._status===0||O._status===-1)&&(O._status=1,O._result=Ue)},function(Ue){(O._status===0||O._status===-1)&&(O._status=2,O._result=Ue)}),O._status===-1&&(O._status=0,O._result=ae)}if(O._status===1)return O._result.default;throw O._result}var fe={current:null},k={transition:null},de={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:k,ReactCurrentOwner:I};function ne(){throw Error("act(...) is not supported in production builds of React.")}return ft.Children={map:Y,forEach:function(O,ae,Ue){Y(O,function(){ae.apply(this,arguments)},Ue)},count:function(O){var ae=0;return Y(O,function(){ae++}),ae},toArray:function(O){return Y(O,function(ae){return ae})||[]},only:function(O){if(!T(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},ft.Component=S,ft.Fragment=t,ft.Profiler=o,ft.PureComponent=b,ft.StrictMode=s,ft.Suspense=m,ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=de,ft.act=ne,ft.cloneElement=function(O,ae,Ue){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var Q=E({},O.props),pe=O.key,he=O.ref,ge=O._owner;if(ae!=null){if(ae.ref!==void 0&&(he=ae.ref,ge=I.current),ae.key!==void 0&&(pe=""+ae.key),O.type&&O.type.defaultProps)var ke=O.type.defaultProps;for(je in ae)$.call(ae,je)&&!L.hasOwnProperty(je)&&(Q[je]=ae[je]===void 0&&ke!==void 0?ke[je]:ae[je])}var je=arguments.length-2;if(je===1)Q.children=Ue;else if(1<je){ke=Array(je);for(var K=0;K<je;K++)ke[K]=arguments[K+2];Q.children=ke}return{$$typeof:r,type:O.type,key:pe,ref:he,props:Q,_owner:ge}},ft.createContext=function(O){return O={$$typeof:u,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},ft.createElement=j,ft.createFactory=function(O){var ae=j.bind(null,O);return ae.type=O,ae},ft.createRef=function(){return{current:null}},ft.forwardRef=function(O){return{$$typeof:f,render:O}},ft.isValidElement=T,ft.lazy=function(O){return{$$typeof:g,_payload:{_status:-1,_result:O},_init:le}},ft.memo=function(O,ae){return{$$typeof:p,type:O,compare:ae===void 0?null:ae}},ft.startTransition=function(O){var ae=k.transition;k.transition={};try{O()}finally{k.transition=ae}},ft.unstable_act=ne,ft.useCallback=function(O,ae){return fe.current.useCallback(O,ae)},ft.useContext=function(O){return fe.current.useContext(O)},ft.useDebugValue=function(){},ft.useDeferredValue=function(O){return fe.current.useDeferredValue(O)},ft.useEffect=function(O,ae){return fe.current.useEffect(O,ae)},ft.useId=function(){return fe.current.useId()},ft.useImperativeHandle=function(O,ae,Ue){return fe.current.useImperativeHandle(O,ae,Ue)},ft.useInsertionEffect=function(O,ae){return fe.current.useInsertionEffect(O,ae)},ft.useLayoutEffect=function(O,ae){return fe.current.useLayoutEffect(O,ae)},ft.useMemo=function(O,ae){return fe.current.useMemo(O,ae)},ft.useReducer=function(O,ae,Ue){return fe.current.useReducer(O,ae,Ue)},ft.useRef=function(O){return fe.current.useRef(O)},ft.useState=function(O){return fe.current.useState(O)},ft.useSyncExternalStore=function(O,ae,Ue){return fe.current.useSyncExternalStore(O,ae,Ue)},ft.useTransition=function(){return fe.current.useTransition()},ft.version="18.3.1",ft}var wp;function kd(){return wp||(wp=1,Bu.exports=ex()),Bu.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Tp;function tx(){if(Tp)return Ha;Tp=1;var r=kd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function u(f,m,p){var g,y={},_=null,M=null;p!==void 0&&(_=""+p),m.key!==void 0&&(_=""+m.key),m.ref!==void 0&&(M=m.ref);for(g in m)s.call(m,g)&&!l.hasOwnProperty(g)&&(y[g]=m[g]);if(f&&f.defaultProps)for(g in m=f.defaultProps,m)y[g]===void 0&&(y[g]=m[g]);return{$$typeof:e,type:f,key:_,ref:M,props:y,_owner:o.current}}return Ha.Fragment=t,Ha.jsx=u,Ha.jsxs=u,Ha}var Ap;function nx(){return Ap||(Ap=1,zu.exports=tx()),zu.exports}var d=nx(),ix=kd();const xe=Q_(ix);var ll={},ju={exports:{}},An={},Hu={exports:{}},Vu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cp;function rx(){return Cp||(Cp=1,(function(r){function e(k,de){var ne=k.length;k.push(de);e:for(;0<ne;){var O=ne-1>>>1,ae=k[O];if(0<o(ae,de))k[O]=de,k[ne]=ae,ne=O;else break e}}function t(k){return k.length===0?null:k[0]}function s(k){if(k.length===0)return null;var de=k[0],ne=k.pop();if(ne!==de){k[0]=ne;e:for(var O=0,ae=k.length,Ue=ae>>>1;O<Ue;){var Q=2*(O+1)-1,pe=k[Q],he=Q+1,ge=k[he];if(0>o(pe,ne))he<ae&&0>o(ge,pe)?(k[O]=ge,k[he]=ne,O=he):(k[O]=pe,k[Q]=ne,O=Q);else if(he<ae&&0>o(ge,ne))k[O]=ge,k[he]=ne,O=he;else break e}}return de}function o(k,de){var ne=k.sortIndex-de.sortIndex;return ne!==0?ne:k.id-de.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var u=Date,f=u.now();r.unstable_now=function(){return u.now()-f}}var m=[],p=[],g=1,y=null,_=3,M=!1,E=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,b=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function R(k){for(var de=t(p);de!==null;){if(de.callback===null)s(p);else if(de.startTime<=k)s(p),de.sortIndex=de.expirationTime,e(m,de);else break;de=t(p)}}function D(k){if(w=!1,R(k),!E)if(t(m)!==null)E=!0,le($);else{var de=t(p);de!==null&&fe(D,de.startTime-k)}}function $(k,de){E=!1,w&&(w=!1,x(j),j=-1),M=!0;var ne=_;try{for(R(de),y=t(m);y!==null&&(!(y.expirationTime>de)||k&&!V());){var O=y.callback;if(typeof O=="function"){y.callback=null,_=y.priorityLevel;var ae=O(y.expirationTime<=de);de=r.unstable_now(),typeof ae=="function"?y.callback=ae:y===t(m)&&s(m),R(de)}else s(m);y=t(m)}if(y!==null)var Ue=!0;else{var Q=t(p);Q!==null&&fe(D,Q.startTime-de),Ue=!1}return Ue}finally{y=null,_=ne,M=!1}}var I=!1,L=null,j=-1,C=5,T=-1;function V(){return!(r.unstable_now()-T<C)}function G(){if(L!==null){var k=r.unstable_now();T=k;var de=!0;try{de=L(!0,k)}finally{de?z():(I=!1,L=null)}}else I=!1}var z;if(typeof b=="function")z=function(){b(G)};else if(typeof MessageChannel<"u"){var X=new MessageChannel,Y=X.port2;X.port1.onmessage=G,z=function(){Y.postMessage(null)}}else z=function(){S(G,0)};function le(k){L=k,I||(I=!0,z())}function fe(k,de){j=S(function(){k(r.unstable_now())},de)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(k){k.callback=null},r.unstable_continueExecution=function(){E||M||(E=!0,le($))},r.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<k?Math.floor(1e3/k):5},r.unstable_getCurrentPriorityLevel=function(){return _},r.unstable_getFirstCallbackNode=function(){return t(m)},r.unstable_next=function(k){switch(_){case 1:case 2:case 3:var de=3;break;default:de=_}var ne=_;_=de;try{return k()}finally{_=ne}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(k,de){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var ne=_;_=k;try{return de()}finally{_=ne}},r.unstable_scheduleCallback=function(k,de,ne){var O=r.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?O+ne:O):ne=O,k){case 1:var ae=-1;break;case 2:ae=250;break;case 5:ae=1073741823;break;case 4:ae=1e4;break;default:ae=5e3}return ae=ne+ae,k={id:g++,callback:de,priorityLevel:k,startTime:ne,expirationTime:ae,sortIndex:-1},ne>O?(k.sortIndex=ne,e(p,k),t(m)===null&&k===t(p)&&(w?(x(j),j=-1):w=!0,fe(D,ne-O))):(k.sortIndex=ae,e(m,k),E||M||(E=!0,le($))),k},r.unstable_shouldYield=V,r.unstable_wrapCallback=function(k){var de=_;return function(){var ne=_;_=de;try{return k.apply(this,arguments)}finally{_=ne}}}})(Vu)),Vu}var bp;function sx(){return bp||(bp=1,Hu.exports=rx()),Hu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rp;function ax(){if(Rp)return An;Rp=1;var r=kd(),e=sx();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){u(n,i),u(n+"Capture",i)}function u(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),m=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},y={};function _(n){return m.call(y,n)?!0:m.call(g,n)?!1:p.test(n)?y[n]=!0:(g[n]=!0,!1)}function M(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function E(n,i,a,c){if(i===null||typeof i>"u"||M(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(n,i,a,c,h,v,A){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=v,this.removeEmptyString=A}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new w(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function b(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(x,b);S[i]=new w(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(x,b);S[i]=new w(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(x,b);S[i]=new w(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function R(n,i,a,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,a,h,c)&&(a=null),c||h===null?_(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):h.mustUseProperty?n[h.propertyName]=a===null?h.type===3?!1:"":a:(i=h.attributeName,c=h.attributeNamespace,a===null?n.removeAttribute(i):(h=h.type,a=h===3||h===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var D=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,$=Symbol.for("react.element"),I=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),T=Symbol.for("react.provider"),V=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),z=Symbol.for("react.suspense"),X=Symbol.for("react.suspense_list"),Y=Symbol.for("react.memo"),le=Symbol.for("react.lazy"),fe=Symbol.for("react.offscreen"),k=Symbol.iterator;function de(n){return n===null||typeof n!="object"?null:(n=k&&n[k]||n["@@iterator"],typeof n=="function"?n:null)}var ne=Object.assign,O;function ae(n){if(O===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var Ue=!1;function Q(n,i){if(!n||Ue)return"";Ue=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(se){var c=se}Reflect.construct(n,[],i)}else{try{i.call()}catch(se){c=se}n.call(i.prototype)}else{try{throw Error()}catch(se){c=se}n()}}catch(se){if(se&&c&&typeof se.stack=="string"){for(var h=se.stack.split(`
`),v=c.stack.split(`
`),A=h.length-1,U=v.length-1;1<=A&&0<=U&&h[A]!==v[U];)U--;for(;1<=A&&0<=U;A--,U--)if(h[A]!==v[U]){if(A!==1||U!==1)do if(A--,U--,0>U||h[A]!==v[U]){var H=`
`+h[A].replace(" at new "," at ");return n.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",n.displayName)),H}while(1<=A&&0<=U);break}}}finally{Ue=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?ae(n):""}function pe(n){switch(n.tag){case 5:return ae(n.type);case 16:return ae("Lazy");case 13:return ae("Suspense");case 19:return ae("SuspenseList");case 0:case 2:case 15:return n=Q(n.type,!1),n;case 11:return n=Q(n.type.render,!1),n;case 1:return n=Q(n.type,!0),n;default:return""}}function he(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case L:return"Fragment";case I:return"Portal";case C:return"Profiler";case j:return"StrictMode";case z:return"Suspense";case X:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case V:return(n.displayName||"Context")+".Consumer";case T:return(n._context.displayName||"Context")+".Provider";case G:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Y:return i=n.displayName||null,i!==null?i:he(n.type)||"Memo";case le:i=n._payload,n=n._init;try{return he(n(i))}catch{}}return null}function ge(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return he(i);case 8:return i===j?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function ke(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function je(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function K(n){var i=je(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,v=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(A){c=""+A,v.call(this,A)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(A){c=""+A},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function ht(n){n._valueTracker||(n._valueTracker=K(n))}function Ye(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=je(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function gt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Ke(n,i){var a=i.checked;return ne({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function ut(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=ke(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function rt(n,i){i=i.checked,i!=null&&R(n,"checked",i,!1)}function at(n,i){rt(n,i);var a=ke(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?F(n,i.type,a):i.hasOwnProperty("defaultValue")&&F(n,i.type,ke(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function At(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function F(n,i,a){(i!=="number"||gt(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var N=Array.isArray;function ue(n,i,a,c){if(n=n.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<n.length;a++)h=i.hasOwnProperty("$"+n[a].value),n[a].selected!==h&&(n[a].selected=h),h&&c&&(n[a].defaultSelected=!0)}else{for(a=""+ke(a),i=null,h=0;h<n.length;h++){if(n[h].value===a){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function ve(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return ne({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Ee(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(N(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:ke(a)}}function Te(n,i){var a=ke(i.value),c=ke(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function qe(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function Pe(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ne(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?Pe(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var nt,B=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(nt=nt||document.createElement("div"),nt.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=nt.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function ee(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var _e={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ae=["Webkit","ms","Moz","O"];Object.keys(_e).forEach(function(n){Ae.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),_e[i]=_e[n]})});function we(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||_e.hasOwnProperty(n)&&_e[n]?(""+i).trim():i+"px"}function Be(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,h=we(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,h):n[a]=h}}var Ie=ne({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function dt(n,i){if(i){if(Ie[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function st(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var q=null;function ye(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var me=null,Re=null,Fe=null;function mt(n){if(n=Ca(n)){if(typeof me!="function")throw Error(t(280));var i=n.stateNode;i&&(i=Eo(i),me(n.stateNode,n.type,i))}}function wt(n){Re?Fe?Fe.push(n):Fe=[n]:Re=n}function Rt(){if(Re){var n=Re,i=Fe;if(Fe=Re=null,mt(n),i)for(n=0;n<i.length;n++)mt(i[n])}}function Vt(n,i){return n(i)}function yt(){}var yn=!1;function Zt(n,i,a){if(yn)return n(i,a);yn=!0;try{return Vt(n,i,a)}finally{yn=!1,(Re!==null||Fe!==null)&&(yt(),Rt())}}function Vi(n,i){var a=n.stateNode;if(a===null)return null;var c=Eo(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var is=!1;if(f)try{var Gi={};Object.defineProperty(Gi,"passive",{get:function(){is=!0}}),window.addEventListener("test",Gi,Gi),window.removeEventListener("test",Gi,Gi)}catch{is=!1}function rs(n,i,a,c,h,v,A,U,H){var se=Array.prototype.slice.call(arguments,3);try{i.apply(a,se)}catch(Me){this.onError(Me)}}var Wi=!1,Mi=null,Ar=!1,ss=null,ic={onError:function(n){Wi=!0,Mi=n}};function rc(n,i,a,c,h,v,A,U,H){Wi=!1,Mi=null,rs.apply(ic,arguments)}function sc(n,i,a,c,h,v,A,U,H){if(rc.apply(this,arguments),Wi){if(Wi){var se=Mi;Wi=!1,Mi=null}else throw Error(t(198));Ar||(Ar=!0,ss=se)}}function P(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function Z(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function ce(n){if(P(n)!==n)throw Error(t(188))}function re(n){var i=n.alternate;if(!i){if(i=P(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var h=a.return;if(h===null)break;var v=h.alternate;if(v===null){if(c=h.return,c!==null){a=c;continue}break}if(h.child===v.child){for(v=h.child;v;){if(v===a)return ce(h),n;if(v===c)return ce(h),i;v=v.sibling}throw Error(t(188))}if(a.return!==c.return)a=h,c=v;else{for(var A=!1,U=h.child;U;){if(U===a){A=!0,a=h,c=v;break}if(U===c){A=!0,c=h,a=v;break}U=U.sibling}if(!A){for(U=v.child;U;){if(U===a){A=!0,a=v,c=h;break}if(U===c){A=!0,c=v,a=h;break}U=U.sibling}if(!A)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function ie(n){return n=re(n),n!==null?Le(n):null}function Le(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Le(n);if(i!==null)return i;n=n.sibling}return null}var We=e.unstable_scheduleCallback,$e=e.unstable_cancelCallback,Qe=e.unstable_shouldYield,it=e.unstable_requestPaint,Ve=e.unstable_now,ot=e.unstable_getCurrentPriorityLevel,Dt=e.unstable_ImmediatePriority,Gt=e.unstable_UserBlockingPriority,Jt=e.unstable_NormalPriority,Zn=e.unstable_LowPriority,vt=e.unstable_IdlePriority,et=null,ln=null;function Ct(n){if(ln&&typeof ln.onCommitFiberRoot=="function")try{ln.onCommitFiberRoot(et,n,void 0,(n.current.flags&128)===128)}catch{}}var Wt=Math.clz32?Math.clz32:la,ao=Math.log,Cr=Math.LN2;function la(n){return n>>>=0,n===0?32:31-(ao(n)/Cr|0)|0}var kt=64,Pn=4194304;function Ei(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function sn(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,h=n.suspendedLanes,v=n.pingedLanes,A=a&268435455;if(A!==0){var U=A&~h;U!==0?c=Ei(U):(v&=A,v!==0&&(c=Ei(v)))}else A=a&~h,A!==0?c=Ei(A):v!==0&&(c=Ei(v));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,v=i&-i,h>=v||h===16&&(v&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Wt(i),h=1<<a,c|=n[a],i&=~h;return c}function ca(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ac(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,v=n.pendingLanes;0<v;){var A=31-Wt(v),U=1<<A,H=h[A];H===-1?((U&a)===0||(U&c)!==0)&&(h[A]=ca(U,i)):H<=i&&(n.expiredLanes|=U),v&=~U}}function as(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Qd(){var n=kt;return kt<<=1,(kt&4194240)===0&&(kt=64),n}function oc(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function ua(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Wt(i),n[i]=a}function _v(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var h=31-Wt(a),v=1<<h;i[h]=0,c[h]=-1,n[h]=-1,a&=~v}}function lc(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Wt(a),h=1<<c;h&i|n[c]&i&&(n[c]|=i),a&=~h}}var Et=0;function ef(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var tf,cc,nf,rf,sf,uc=!1,oo=[],Xi=null,$i=null,qi=null,da=new Map,fa=new Map,Yi=[],xv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function af(n,i){switch(n){case"focusin":case"focusout":Xi=null;break;case"dragenter":case"dragleave":$i=null;break;case"mouseover":case"mouseout":qi=null;break;case"pointerover":case"pointerout":da.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":fa.delete(i.pointerId)}}function ha(n,i,a,c,h,v){return n===null||n.nativeEvent!==v?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:v,targetContainers:[h]},i!==null&&(i=Ca(i),i!==null&&cc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function yv(n,i,a,c,h){switch(i){case"focusin":return Xi=ha(Xi,n,i,a,c,h),!0;case"dragenter":return $i=ha($i,n,i,a,c,h),!0;case"mouseover":return qi=ha(qi,n,i,a,c,h),!0;case"pointerover":var v=h.pointerId;return da.set(v,ha(da.get(v)||null,n,i,a,c,h)),!0;case"gotpointercapture":return v=h.pointerId,fa.set(v,ha(fa.get(v)||null,n,i,a,c,h)),!0}return!1}function of(n){var i=br(n.target);if(i!==null){var a=P(i);if(a!==null){if(i=a.tag,i===13){if(i=Z(a),i!==null){n.blockedOn=i,sf(n.priority,function(){nf(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function lo(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=fc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);q=c,a.target.dispatchEvent(c),q=null}else return i=Ca(a),i!==null&&cc(i),n.blockedOn=a,!1;i.shift()}return!0}function lf(n,i,a){lo(n)&&a.delete(i)}function Sv(){uc=!1,Xi!==null&&lo(Xi)&&(Xi=null),$i!==null&&lo($i)&&($i=null),qi!==null&&lo(qi)&&(qi=null),da.forEach(lf),fa.forEach(lf)}function pa(n,i){n.blockedOn===i&&(n.blockedOn=null,uc||(uc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Sv)))}function ma(n){function i(h){return pa(h,n)}if(0<oo.length){pa(oo[0],n);for(var a=1;a<oo.length;a++){var c=oo[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Xi!==null&&pa(Xi,n),$i!==null&&pa($i,n),qi!==null&&pa(qi,n),da.forEach(i),fa.forEach(i),a=0;a<Yi.length;a++)c=Yi[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Yi.length&&(a=Yi[0],a.blockedOn===null);)of(a),a.blockedOn===null&&Yi.shift()}var os=D.ReactCurrentBatchConfig,co=!0;function Mv(n,i,a,c){var h=Et,v=os.transition;os.transition=null;try{Et=1,dc(n,i,a,c)}finally{Et=h,os.transition=v}}function Ev(n,i,a,c){var h=Et,v=os.transition;os.transition=null;try{Et=4,dc(n,i,a,c)}finally{Et=h,os.transition=v}}function dc(n,i,a,c){if(co){var h=fc(n,i,a,c);if(h===null)Rc(n,i,c,uo,a),af(n,c);else if(yv(h,n,i,a,c))c.stopPropagation();else if(af(n,c),i&4&&-1<xv.indexOf(n)){for(;h!==null;){var v=Ca(h);if(v!==null&&tf(v),v=fc(n,i,a,c),v===null&&Rc(n,i,c,uo,a),v===h)break;h=v}h!==null&&c.stopPropagation()}else Rc(n,i,c,null,a)}}var uo=null;function fc(n,i,a,c){if(uo=null,n=ye(c),n=br(n),n!==null)if(i=P(n),i===null)n=null;else if(a=i.tag,a===13){if(n=Z(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return uo=n,null}function cf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ot()){case Dt:return 1;case Gt:return 4;case Jt:case Zn:return 16;case vt:return 536870912;default:return 16}default:return 16}}var Ki=null,hc=null,fo=null;function uf(){if(fo)return fo;var n,i=hc,a=i.length,c,h="value"in Ki?Ki.value:Ki.textContent,v=h.length;for(n=0;n<a&&i[n]===h[n];n++);var A=a-n;for(c=1;c<=A&&i[a-c]===h[v-c];c++);return fo=h.slice(n,1<c?1-c:void 0)}function ho(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function po(){return!0}function df(){return!1}function Ln(n){function i(a,c,h,v,A){this._reactName=a,this._targetInst=h,this.type=c,this.nativeEvent=v,this.target=A,this.currentTarget=null;for(var U in n)n.hasOwnProperty(U)&&(a=n[U],this[U]=a?a(v):v[U]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?po:df,this.isPropagationStopped=df,this}return ne(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=po)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=po)},persist:function(){},isPersistent:po}),i}var ls={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},pc=Ln(ls),ga=ne({},ls,{view:0,detail:0}),wv=Ln(ga),mc,gc,va,mo=ne({},ga,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_c,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==va&&(va&&n.type==="mousemove"?(mc=n.screenX-va.screenX,gc=n.screenY-va.screenY):gc=mc=0,va=n),mc)},movementY:function(n){return"movementY"in n?n.movementY:gc}}),ff=Ln(mo),Tv=ne({},mo,{dataTransfer:0}),Av=Ln(Tv),Cv=ne({},ga,{relatedTarget:0}),vc=Ln(Cv),bv=ne({},ls,{animationName:0,elapsedTime:0,pseudoElement:0}),Rv=Ln(bv),Nv=ne({},ls,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Pv=Ln(Nv),Lv=ne({},ls,{data:0}),hf=Ln(Lv),Dv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Uv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Iv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fv(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Iv[n])?!!i[n]:!1}function _c(){return Fv}var Ov=ne({},ga,{key:function(n){if(n.key){var i=Dv[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=ho(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Uv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_c,charCode:function(n){return n.type==="keypress"?ho(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ho(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),kv=Ln(Ov),zv=ne({},mo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),pf=Ln(zv),Bv=ne({},ga,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_c}),jv=Ln(Bv),Hv=ne({},ls,{propertyName:0,elapsedTime:0,pseudoElement:0}),Vv=Ln(Hv),Gv=ne({},mo,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Wv=Ln(Gv),Xv=[9,13,27,32],xc=f&&"CompositionEvent"in window,_a=null;f&&"documentMode"in document&&(_a=document.documentMode);var $v=f&&"TextEvent"in window&&!_a,mf=f&&(!xc||_a&&8<_a&&11>=_a),gf=" ",vf=!1;function _f(n,i){switch(n){case"keyup":return Xv.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function xf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var cs=!1;function qv(n,i){switch(n){case"compositionend":return xf(i);case"keypress":return i.which!==32?null:(vf=!0,gf);case"textInput":return n=i.data,n===gf&&vf?null:n;default:return null}}function Yv(n,i){if(cs)return n==="compositionend"||!xc&&_f(n,i)?(n=uf(),fo=hc=Ki=null,cs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return mf&&i.locale!=="ko"?null:i.data;default:return null}}var Kv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function yf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!Kv[n.type]:i==="textarea"}function Sf(n,i,a,c){wt(c),i=yo(i,"onChange"),0<i.length&&(a=new pc("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var xa=null,ya=null;function Zv(n){zf(n,0)}function go(n){var i=ps(n);if(Ye(i))return n}function Jv(n,i){if(n==="change")return i}var Mf=!1;if(f){var yc;if(f){var Sc="oninput"in document;if(!Sc){var Ef=document.createElement("div");Ef.setAttribute("oninput","return;"),Sc=typeof Ef.oninput=="function"}yc=Sc}else yc=!1;Mf=yc&&(!document.documentMode||9<document.documentMode)}function wf(){xa&&(xa.detachEvent("onpropertychange",Tf),ya=xa=null)}function Tf(n){if(n.propertyName==="value"&&go(ya)){var i=[];Sf(i,ya,n,ye(n)),Zt(Zv,i)}}function Qv(n,i,a){n==="focusin"?(wf(),xa=i,ya=a,xa.attachEvent("onpropertychange",Tf)):n==="focusout"&&wf()}function e_(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return go(ya)}function t_(n,i){if(n==="click")return go(i)}function n_(n,i){if(n==="input"||n==="change")return go(i)}function i_(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Jn=typeof Object.is=="function"?Object.is:i_;function Sa(n,i){if(Jn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var h=a[c];if(!m.call(i,h)||!Jn(n[h],i[h]))return!1}return!0}function Af(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Cf(n,i){var a=Af(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Af(a)}}function bf(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?bf(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function Rf(){for(var n=window,i=gt();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=gt(n.document)}return i}function Mc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function r_(n){var i=Rf(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&bf(a.ownerDocument.documentElement,a)){if(c!==null&&Mc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=a.textContent.length,v=Math.min(c.start,h);c=c.end===void 0?v:Math.min(c.end,h),!n.extend&&v>c&&(h=c,c=v,v=h),h=Cf(a,v);var A=Cf(a,c);h&&A&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==A.node||n.focusOffset!==A.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),v>c?(n.addRange(i),n.extend(A.node,A.offset)):(i.setEnd(A.node,A.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var s_=f&&"documentMode"in document&&11>=document.documentMode,us=null,Ec=null,Ma=null,wc=!1;function Nf(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;wc||us==null||us!==gt(c)||(c=us,"selectionStart"in c&&Mc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ma&&Sa(Ma,c)||(Ma=c,c=yo(Ec,"onSelect"),0<c.length&&(i=new pc("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=us)))}function vo(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var ds={animationend:vo("Animation","AnimationEnd"),animationiteration:vo("Animation","AnimationIteration"),animationstart:vo("Animation","AnimationStart"),transitionend:vo("Transition","TransitionEnd")},Tc={},Pf={};f&&(Pf=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function _o(n){if(Tc[n])return Tc[n];if(!ds[n])return n;var i=ds[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in Pf)return Tc[n]=i[a];return n}var Lf=_o("animationend"),Df=_o("animationiteration"),Uf=_o("animationstart"),If=_o("transitionend"),Ff=new Map,Of="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zi(n,i){Ff.set(n,i),l(i,[n])}for(var Ac=0;Ac<Of.length;Ac++){var Cc=Of[Ac],a_=Cc.toLowerCase(),o_=Cc[0].toUpperCase()+Cc.slice(1);Zi(a_,"on"+o_)}Zi(Lf,"onAnimationEnd"),Zi(Df,"onAnimationIteration"),Zi(Uf,"onAnimationStart"),Zi("dblclick","onDoubleClick"),Zi("focusin","onFocus"),Zi("focusout","onBlur"),Zi(If,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),l_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ea));function kf(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,sc(c,i,void 0,n),n.currentTarget=null}function zf(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],h=c.event;c=c.listeners;e:{var v=void 0;if(i)for(var A=c.length-1;0<=A;A--){var U=c[A],H=U.instance,se=U.currentTarget;if(U=U.listener,H!==v&&h.isPropagationStopped())break e;kf(h,U,se),v=H}else for(A=0;A<c.length;A++){if(U=c[A],H=U.instance,se=U.currentTarget,U=U.listener,H!==v&&h.isPropagationStopped())break e;kf(h,U,se),v=H}}}if(Ar)throw n=ss,Ar=!1,ss=null,n}function Nt(n,i){var a=i[Ic];a===void 0&&(a=i[Ic]=new Set);var c=n+"__bubble";a.has(c)||(Bf(i,n,2,!1),a.add(c))}function bc(n,i,a){var c=0;i&&(c|=4),Bf(a,n,c,i)}var xo="_reactListening"+Math.random().toString(36).slice(2);function wa(n){if(!n[xo]){n[xo]=!0,s.forEach(function(a){a!=="selectionchange"&&(l_.has(a)||bc(a,!1,n),bc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[xo]||(i[xo]=!0,bc("selectionchange",!1,i))}}function Bf(n,i,a,c){switch(cf(i)){case 1:var h=Mv;break;case 4:h=Ev;break;default:h=dc}a=h.bind(null,i,a,n),h=void 0,!is||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,a,{capture:!0,passive:h}):n.addEventListener(i,a,!0):h!==void 0?n.addEventListener(i,a,{passive:h}):n.addEventListener(i,a,!1)}function Rc(n,i,a,c,h){var v=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var A=c.tag;if(A===3||A===4){var U=c.stateNode.containerInfo;if(U===h||U.nodeType===8&&U.parentNode===h)break;if(A===4)for(A=c.return;A!==null;){var H=A.tag;if((H===3||H===4)&&(H=A.stateNode.containerInfo,H===h||H.nodeType===8&&H.parentNode===h))return;A=A.return}for(;U!==null;){if(A=br(U),A===null)return;if(H=A.tag,H===5||H===6){c=v=A;continue e}U=U.parentNode}}c=c.return}Zt(function(){var se=v,Me=ye(a),Ce=[];e:{var Se=Ff.get(n);if(Se!==void 0){var Oe=pc,He=n;switch(n){case"keypress":if(ho(a)===0)break e;case"keydown":case"keyup":Oe=kv;break;case"focusin":He="focus",Oe=vc;break;case"focusout":He="blur",Oe=vc;break;case"beforeblur":case"afterblur":Oe=vc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Oe=ff;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Oe=Av;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Oe=jv;break;case Lf:case Df:case Uf:Oe=Rv;break;case If:Oe=Vv;break;case"scroll":Oe=wv;break;case"wheel":Oe=Wv;break;case"copy":case"cut":case"paste":Oe=Pv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Oe=pf}var Ge=(i&4)!==0,zt=!Ge&&n==="scroll",J=Ge?Se!==null?Se+"Capture":null:Se;Ge=[];for(var W=se,te;W!==null;){te=W;var be=te.stateNode;if(te.tag===5&&be!==null&&(te=be,J!==null&&(be=Vi(W,J),be!=null&&Ge.push(Ta(W,be,te)))),zt)break;W=W.return}0<Ge.length&&(Se=new Oe(Se,He,null,a,Me),Ce.push({event:Se,listeners:Ge}))}}if((i&7)===0){e:{if(Se=n==="mouseover"||n==="pointerover",Oe=n==="mouseout"||n==="pointerout",Se&&a!==q&&(He=a.relatedTarget||a.fromElement)&&(br(He)||He[wi]))break e;if((Oe||Se)&&(Se=Me.window===Me?Me:(Se=Me.ownerDocument)?Se.defaultView||Se.parentWindow:window,Oe?(He=a.relatedTarget||a.toElement,Oe=se,He=He?br(He):null,He!==null&&(zt=P(He),He!==zt||He.tag!==5&&He.tag!==6)&&(He=null)):(Oe=null,He=se),Oe!==He)){if(Ge=ff,be="onMouseLeave",J="onMouseEnter",W="mouse",(n==="pointerout"||n==="pointerover")&&(Ge=pf,be="onPointerLeave",J="onPointerEnter",W="pointer"),zt=Oe==null?Se:ps(Oe),te=He==null?Se:ps(He),Se=new Ge(be,W+"leave",Oe,a,Me),Se.target=zt,Se.relatedTarget=te,be=null,br(Me)===se&&(Ge=new Ge(J,W+"enter",He,a,Me),Ge.target=te,Ge.relatedTarget=zt,be=Ge),zt=be,Oe&&He)t:{for(Ge=Oe,J=He,W=0,te=Ge;te;te=fs(te))W++;for(te=0,be=J;be;be=fs(be))te++;for(;0<W-te;)Ge=fs(Ge),W--;for(;0<te-W;)J=fs(J),te--;for(;W--;){if(Ge===J||J!==null&&Ge===J.alternate)break t;Ge=fs(Ge),J=fs(J)}Ge=null}else Ge=null;Oe!==null&&jf(Ce,Se,Oe,Ge,!1),He!==null&&zt!==null&&jf(Ce,zt,He,Ge,!0)}}e:{if(Se=se?ps(se):window,Oe=Se.nodeName&&Se.nodeName.toLowerCase(),Oe==="select"||Oe==="input"&&Se.type==="file")var Xe=Jv;else if(yf(Se))if(Mf)Xe=n_;else{Xe=e_;var Ze=Qv}else(Oe=Se.nodeName)&&Oe.toLowerCase()==="input"&&(Se.type==="checkbox"||Se.type==="radio")&&(Xe=t_);if(Xe&&(Xe=Xe(n,se))){Sf(Ce,Xe,a,Me);break e}Ze&&Ze(n,Se,se),n==="focusout"&&(Ze=Se._wrapperState)&&Ze.controlled&&Se.type==="number"&&F(Se,"number",Se.value)}switch(Ze=se?ps(se):window,n){case"focusin":(yf(Ze)||Ze.contentEditable==="true")&&(us=Ze,Ec=se,Ma=null);break;case"focusout":Ma=Ec=us=null;break;case"mousedown":wc=!0;break;case"contextmenu":case"mouseup":case"dragend":wc=!1,Nf(Ce,a,Me);break;case"selectionchange":if(s_)break;case"keydown":case"keyup":Nf(Ce,a,Me)}var Je;if(xc)e:{switch(n){case"compositionstart":var tt="onCompositionStart";break e;case"compositionend":tt="onCompositionEnd";break e;case"compositionupdate":tt="onCompositionUpdate";break e}tt=void 0}else cs?_f(n,a)&&(tt="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(tt="onCompositionStart");tt&&(mf&&a.locale!=="ko"&&(cs||tt!=="onCompositionStart"?tt==="onCompositionEnd"&&cs&&(Je=uf()):(Ki=Me,hc="value"in Ki?Ki.value:Ki.textContent,cs=!0)),Ze=yo(se,tt),0<Ze.length&&(tt=new hf(tt,n,null,a,Me),Ce.push({event:tt,listeners:Ze}),Je?tt.data=Je:(Je=xf(a),Je!==null&&(tt.data=Je)))),(Je=$v?qv(n,a):Yv(n,a))&&(se=yo(se,"onBeforeInput"),0<se.length&&(Me=new hf("onBeforeInput","beforeinput",null,a,Me),Ce.push({event:Me,listeners:se}),Me.data=Je))}zf(Ce,i)})}function Ta(n,i,a){return{instance:n,listener:i,currentTarget:a}}function yo(n,i){for(var a=i+"Capture",c=[];n!==null;){var h=n,v=h.stateNode;h.tag===5&&v!==null&&(h=v,v=Vi(n,a),v!=null&&c.unshift(Ta(n,v,h)),v=Vi(n,i),v!=null&&c.push(Ta(n,v,h))),n=n.return}return c}function fs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function jf(n,i,a,c,h){for(var v=i._reactName,A=[];a!==null&&a!==c;){var U=a,H=U.alternate,se=U.stateNode;if(H!==null&&H===c)break;U.tag===5&&se!==null&&(U=se,h?(H=Vi(a,v),H!=null&&A.unshift(Ta(a,H,U))):h||(H=Vi(a,v),H!=null&&A.push(Ta(a,H,U)))),a=a.return}A.length!==0&&n.push({event:i,listeners:A})}var c_=/\r\n?/g,u_=/\u0000|\uFFFD/g;function Hf(n){return(typeof n=="string"?n:""+n).replace(c_,`
`).replace(u_,"")}function So(n,i,a){if(i=Hf(i),Hf(n)!==i&&a)throw Error(t(425))}function Mo(){}var Nc=null,Pc=null;function Lc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Dc=typeof setTimeout=="function"?setTimeout:void 0,d_=typeof clearTimeout=="function"?clearTimeout:void 0,Vf=typeof Promise=="function"?Promise:void 0,f_=typeof queueMicrotask=="function"?queueMicrotask:typeof Vf<"u"?function(n){return Vf.resolve(null).then(n).catch(h_)}:Dc;function h_(n){setTimeout(function(){throw n})}function Uc(n,i){var a=i,c=0;do{var h=a.nextSibling;if(n.removeChild(a),h&&h.nodeType===8)if(a=h.data,a==="/$"){if(c===0){n.removeChild(h),ma(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=h}while(a);ma(i)}function Ji(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Gf(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var hs=Math.random().toString(36).slice(2),ci="__reactFiber$"+hs,Aa="__reactProps$"+hs,wi="__reactContainer$"+hs,Ic="__reactEvents$"+hs,p_="__reactListeners$"+hs,m_="__reactHandles$"+hs;function br(n){var i=n[ci];if(i)return i;for(var a=n.parentNode;a;){if(i=a[wi]||a[ci]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=Gf(n);n!==null;){if(a=n[ci])return a;n=Gf(n)}return i}n=a,a=n.parentNode}return null}function Ca(n){return n=n[ci]||n[wi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ps(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Eo(n){return n[Aa]||null}var Fc=[],ms=-1;function Qi(n){return{current:n}}function Pt(n){0>ms||(n.current=Fc[ms],Fc[ms]=null,ms--)}function bt(n,i){ms++,Fc[ms]=n.current,n.current=i}var er={},cn=Qi(er),Sn=Qi(!1),Rr=er;function gs(n,i){var a=n.type.contextTypes;if(!a)return er;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},v;for(v in a)h[v]=i[v];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function Mn(n){return n=n.childContextTypes,n!=null}function wo(){Pt(Sn),Pt(cn)}function Wf(n,i,a){if(cn.current!==er)throw Error(t(168));bt(cn,i),bt(Sn,a)}function Xf(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,ge(n)||"Unknown",h));return ne({},a,c)}function To(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||er,Rr=cn.current,bt(cn,n),bt(Sn,Sn.current),!0}function $f(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Xf(n,i,Rr),c.__reactInternalMemoizedMergedChildContext=n,Pt(Sn),Pt(cn),bt(cn,n)):Pt(Sn),bt(Sn,a)}var Ti=null,Ao=!1,Oc=!1;function qf(n){Ti===null?Ti=[n]:Ti.push(n)}function g_(n){Ao=!0,qf(n)}function tr(){if(!Oc&&Ti!==null){Oc=!0;var n=0,i=Et;try{var a=Ti;for(Et=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Ti=null,Ao=!1}catch(h){throw Ti!==null&&(Ti=Ti.slice(n+1)),We(Dt,tr),h}finally{Et=i,Oc=!1}}return null}var vs=[],_s=0,Co=null,bo=0,jn=[],Hn=0,Nr=null,Ai=1,Ci="";function Pr(n,i){vs[_s++]=bo,vs[_s++]=Co,Co=n,bo=i}function Yf(n,i,a){jn[Hn++]=Ai,jn[Hn++]=Ci,jn[Hn++]=Nr,Nr=n;var c=Ai;n=Ci;var h=32-Wt(c)-1;c&=~(1<<h),a+=1;var v=32-Wt(i)+h;if(30<v){var A=h-h%5;v=(c&(1<<A)-1).toString(32),c>>=A,h-=A,Ai=1<<32-Wt(i)+h|a<<h|c,Ci=v+n}else Ai=1<<v|a<<h|c,Ci=n}function kc(n){n.return!==null&&(Pr(n,1),Yf(n,1,0))}function zc(n){for(;n===Co;)Co=vs[--_s],vs[_s]=null,bo=vs[--_s],vs[_s]=null;for(;n===Nr;)Nr=jn[--Hn],jn[Hn]=null,Ci=jn[--Hn],jn[Hn]=null,Ai=jn[--Hn],jn[Hn]=null}var Dn=null,Un=null,Ut=!1,Qn=null;function Kf(n,i){var a=Xn(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Zf(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Dn=n,Un=Ji(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Dn=n,Un=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Nr!==null?{id:Ai,overflow:Ci}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=Xn(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,Dn=n,Un=null,!0):!1;default:return!1}}function Bc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function jc(n){if(Ut){var i=Un;if(i){var a=i;if(!Zf(n,i)){if(Bc(n))throw Error(t(418));i=Ji(a.nextSibling);var c=Dn;i&&Zf(n,i)?Kf(c,a):(n.flags=n.flags&-4097|2,Ut=!1,Dn=n)}}else{if(Bc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Ut=!1,Dn=n}}}function Jf(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Dn=n}function Ro(n){if(n!==Dn)return!1;if(!Ut)return Jf(n),Ut=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Lc(n.type,n.memoizedProps)),i&&(i=Un)){if(Bc(n))throw Qf(),Error(t(418));for(;i;)Kf(n,i),i=Ji(i.nextSibling)}if(Jf(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){Un=Ji(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}Un=null}}else Un=Dn?Ji(n.stateNode.nextSibling):null;return!0}function Qf(){for(var n=Un;n;)n=Ji(n.nextSibling)}function xs(){Un=Dn=null,Ut=!1}function Hc(n){Qn===null?Qn=[n]:Qn.push(n)}var v_=D.ReactCurrentBatchConfig;function ba(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var h=c,v=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===v?i.ref:(i=function(A){var U=h.refs;A===null?delete U[v]:U[v]=A},i._stringRef=v,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function No(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function eh(n){var i=n._init;return i(n._payload)}function th(n){function i(J,W){if(n){var te=J.deletions;te===null?(J.deletions=[W],J.flags|=16):te.push(W)}}function a(J,W){if(!n)return null;for(;W!==null;)i(J,W),W=W.sibling;return null}function c(J,W){for(J=new Map;W!==null;)W.key!==null?J.set(W.key,W):J.set(W.index,W),W=W.sibling;return J}function h(J,W){return J=cr(J,W),J.index=0,J.sibling=null,J}function v(J,W,te){return J.index=te,n?(te=J.alternate,te!==null?(te=te.index,te<W?(J.flags|=2,W):te):(J.flags|=2,W)):(J.flags|=1048576,W)}function A(J){return n&&J.alternate===null&&(J.flags|=2),J}function U(J,W,te,be){return W===null||W.tag!==6?(W=Du(te,J.mode,be),W.return=J,W):(W=h(W,te),W.return=J,W)}function H(J,W,te,be){var Xe=te.type;return Xe===L?Me(J,W,te.props.children,be,te.key):W!==null&&(W.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===le&&eh(Xe)===W.type)?(be=h(W,te.props),be.ref=ba(J,W,te),be.return=J,be):(be=el(te.type,te.key,te.props,null,J.mode,be),be.ref=ba(J,W,te),be.return=J,be)}function se(J,W,te,be){return W===null||W.tag!==4||W.stateNode.containerInfo!==te.containerInfo||W.stateNode.implementation!==te.implementation?(W=Uu(te,J.mode,be),W.return=J,W):(W=h(W,te.children||[]),W.return=J,W)}function Me(J,W,te,be,Xe){return W===null||W.tag!==7?(W=zr(te,J.mode,be,Xe),W.return=J,W):(W=h(W,te),W.return=J,W)}function Ce(J,W,te){if(typeof W=="string"&&W!==""||typeof W=="number")return W=Du(""+W,J.mode,te),W.return=J,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case $:return te=el(W.type,W.key,W.props,null,J.mode,te),te.ref=ba(J,null,W),te.return=J,te;case I:return W=Uu(W,J.mode,te),W.return=J,W;case le:var be=W._init;return Ce(J,be(W._payload),te)}if(N(W)||de(W))return W=zr(W,J.mode,te,null),W.return=J,W;No(J,W)}return null}function Se(J,W,te,be){var Xe=W!==null?W.key:null;if(typeof te=="string"&&te!==""||typeof te=="number")return Xe!==null?null:U(J,W,""+te,be);if(typeof te=="object"&&te!==null){switch(te.$$typeof){case $:return te.key===Xe?H(J,W,te,be):null;case I:return te.key===Xe?se(J,W,te,be):null;case le:return Xe=te._init,Se(J,W,Xe(te._payload),be)}if(N(te)||de(te))return Xe!==null?null:Me(J,W,te,be,null);No(J,te)}return null}function Oe(J,W,te,be,Xe){if(typeof be=="string"&&be!==""||typeof be=="number")return J=J.get(te)||null,U(W,J,""+be,Xe);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case $:return J=J.get(be.key===null?te:be.key)||null,H(W,J,be,Xe);case I:return J=J.get(be.key===null?te:be.key)||null,se(W,J,be,Xe);case le:var Ze=be._init;return Oe(J,W,te,Ze(be._payload),Xe)}if(N(be)||de(be))return J=J.get(te)||null,Me(W,J,be,Xe,null);No(W,be)}return null}function He(J,W,te,be){for(var Xe=null,Ze=null,Je=W,tt=W=0,tn=null;Je!==null&&tt<te.length;tt++){Je.index>tt?(tn=Je,Je=null):tn=Je.sibling;var St=Se(J,Je,te[tt],be);if(St===null){Je===null&&(Je=tn);break}n&&Je&&St.alternate===null&&i(J,Je),W=v(St,W,tt),Ze===null?Xe=St:Ze.sibling=St,Ze=St,Je=tn}if(tt===te.length)return a(J,Je),Ut&&Pr(J,tt),Xe;if(Je===null){for(;tt<te.length;tt++)Je=Ce(J,te[tt],be),Je!==null&&(W=v(Je,W,tt),Ze===null?Xe=Je:Ze.sibling=Je,Ze=Je);return Ut&&Pr(J,tt),Xe}for(Je=c(J,Je);tt<te.length;tt++)tn=Oe(Je,J,tt,te[tt],be),tn!==null&&(n&&tn.alternate!==null&&Je.delete(tn.key===null?tt:tn.key),W=v(tn,W,tt),Ze===null?Xe=tn:Ze.sibling=tn,Ze=tn);return n&&Je.forEach(function(ur){return i(J,ur)}),Ut&&Pr(J,tt),Xe}function Ge(J,W,te,be){var Xe=de(te);if(typeof Xe!="function")throw Error(t(150));if(te=Xe.call(te),te==null)throw Error(t(151));for(var Ze=Xe=null,Je=W,tt=W=0,tn=null,St=te.next();Je!==null&&!St.done;tt++,St=te.next()){Je.index>tt?(tn=Je,Je=null):tn=Je.sibling;var ur=Se(J,Je,St.value,be);if(ur===null){Je===null&&(Je=tn);break}n&&Je&&ur.alternate===null&&i(J,Je),W=v(ur,W,tt),Ze===null?Xe=ur:Ze.sibling=ur,Ze=ur,Je=tn}if(St.done)return a(J,Je),Ut&&Pr(J,tt),Xe;if(Je===null){for(;!St.done;tt++,St=te.next())St=Ce(J,St.value,be),St!==null&&(W=v(St,W,tt),Ze===null?Xe=St:Ze.sibling=St,Ze=St);return Ut&&Pr(J,tt),Xe}for(Je=c(J,Je);!St.done;tt++,St=te.next())St=Oe(Je,J,tt,St.value,be),St!==null&&(n&&St.alternate!==null&&Je.delete(St.key===null?tt:St.key),W=v(St,W,tt),Ze===null?Xe=St:Ze.sibling=St,Ze=St);return n&&Je.forEach(function(K_){return i(J,K_)}),Ut&&Pr(J,tt),Xe}function zt(J,W,te,be){if(typeof te=="object"&&te!==null&&te.type===L&&te.key===null&&(te=te.props.children),typeof te=="object"&&te!==null){switch(te.$$typeof){case $:e:{for(var Xe=te.key,Ze=W;Ze!==null;){if(Ze.key===Xe){if(Xe=te.type,Xe===L){if(Ze.tag===7){a(J,Ze.sibling),W=h(Ze,te.props.children),W.return=J,J=W;break e}}else if(Ze.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===le&&eh(Xe)===Ze.type){a(J,Ze.sibling),W=h(Ze,te.props),W.ref=ba(J,Ze,te),W.return=J,J=W;break e}a(J,Ze);break}else i(J,Ze);Ze=Ze.sibling}te.type===L?(W=zr(te.props.children,J.mode,be,te.key),W.return=J,J=W):(be=el(te.type,te.key,te.props,null,J.mode,be),be.ref=ba(J,W,te),be.return=J,J=be)}return A(J);case I:e:{for(Ze=te.key;W!==null;){if(W.key===Ze)if(W.tag===4&&W.stateNode.containerInfo===te.containerInfo&&W.stateNode.implementation===te.implementation){a(J,W.sibling),W=h(W,te.children||[]),W.return=J,J=W;break e}else{a(J,W);break}else i(J,W);W=W.sibling}W=Uu(te,J.mode,be),W.return=J,J=W}return A(J);case le:return Ze=te._init,zt(J,W,Ze(te._payload),be)}if(N(te))return He(J,W,te,be);if(de(te))return Ge(J,W,te,be);No(J,te)}return typeof te=="string"&&te!==""||typeof te=="number"?(te=""+te,W!==null&&W.tag===6?(a(J,W.sibling),W=h(W,te),W.return=J,J=W):(a(J,W),W=Du(te,J.mode,be),W.return=J,J=W),A(J)):a(J,W)}return zt}var ys=th(!0),nh=th(!1),Po=Qi(null),Lo=null,Ss=null,Vc=null;function Gc(){Vc=Ss=Lo=null}function Wc(n){var i=Po.current;Pt(Po),n._currentValue=i}function Xc(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function Ms(n,i){Lo=n,Vc=Ss=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(En=!0),n.firstContext=null)}function Vn(n){var i=n._currentValue;if(Vc!==n)if(n={context:n,memoizedValue:i,next:null},Ss===null){if(Lo===null)throw Error(t(308));Ss=n,Lo.dependencies={lanes:0,firstContext:n}}else Ss=Ss.next=n;return i}var Lr=null;function $c(n){Lr===null?Lr=[n]:Lr.push(n)}function ih(n,i,a,c){var h=i.interleaved;return h===null?(a.next=a,$c(i)):(a.next=h.next,h.next=a),i.interleaved=a,bi(n,c)}function bi(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var nr=!1;function qc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function rh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ri(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ir(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(_t&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,bi(n,a)}return h=c.interleaved,h===null?(i.next=i,$c(c)):(i.next=h.next,h.next=i),c.interleaved=i,bi(n,a)}function Do(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}function sh(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var h=null,v=null;if(a=a.firstBaseUpdate,a!==null){do{var A={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};v===null?h=v=A:v=v.next=A,a=a.next}while(a!==null);v===null?h=v=i:v=v.next=i}else h=v=i;a={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:v,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function Uo(n,i,a,c){var h=n.updateQueue;nr=!1;var v=h.firstBaseUpdate,A=h.lastBaseUpdate,U=h.shared.pending;if(U!==null){h.shared.pending=null;var H=U,se=H.next;H.next=null,A===null?v=se:A.next=se,A=H;var Me=n.alternate;Me!==null&&(Me=Me.updateQueue,U=Me.lastBaseUpdate,U!==A&&(U===null?Me.firstBaseUpdate=se:U.next=se,Me.lastBaseUpdate=H))}if(v!==null){var Ce=h.baseState;A=0,Me=se=H=null,U=v;do{var Se=U.lane,Oe=U.eventTime;if((c&Se)===Se){Me!==null&&(Me=Me.next={eventTime:Oe,lane:0,tag:U.tag,payload:U.payload,callback:U.callback,next:null});e:{var He=n,Ge=U;switch(Se=i,Oe=a,Ge.tag){case 1:if(He=Ge.payload,typeof He=="function"){Ce=He.call(Oe,Ce,Se);break e}Ce=He;break e;case 3:He.flags=He.flags&-65537|128;case 0:if(He=Ge.payload,Se=typeof He=="function"?He.call(Oe,Ce,Se):He,Se==null)break e;Ce=ne({},Ce,Se);break e;case 2:nr=!0}}U.callback!==null&&U.lane!==0&&(n.flags|=64,Se=h.effects,Se===null?h.effects=[U]:Se.push(U))}else Oe={eventTime:Oe,lane:Se,tag:U.tag,payload:U.payload,callback:U.callback,next:null},Me===null?(se=Me=Oe,H=Ce):Me=Me.next=Oe,A|=Se;if(U=U.next,U===null){if(U=h.shared.pending,U===null)break;Se=U,U=Se.next,Se.next=null,h.lastBaseUpdate=Se,h.shared.pending=null}}while(!0);if(Me===null&&(H=Ce),h.baseState=H,h.firstBaseUpdate=se,h.lastBaseUpdate=Me,i=h.shared.interleaved,i!==null){h=i;do A|=h.lane,h=h.next;while(h!==i)}else v===null&&(h.shared.lanes=0);Ir|=A,n.lanes=A,n.memoizedState=Ce}}function ah(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=a,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var Ra={},ui=Qi(Ra),Na=Qi(Ra),Pa=Qi(Ra);function Dr(n){if(n===Ra)throw Error(t(174));return n}function Yc(n,i){switch(bt(Pa,i),bt(Na,n),bt(ui,Ra),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ne(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ne(i,n)}Pt(ui),bt(ui,i)}function Es(){Pt(ui),Pt(Na),Pt(Pa)}function oh(n){Dr(Pa.current);var i=Dr(ui.current),a=Ne(i,n.type);i!==a&&(bt(Na,n),bt(ui,a))}function Kc(n){Na.current===n&&(Pt(ui),Pt(Na))}var It=Qi(0);function Io(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Zc=[];function Jc(){for(var n=0;n<Zc.length;n++)Zc[n]._workInProgressVersionPrimary=null;Zc.length=0}var Fo=D.ReactCurrentDispatcher,Qc=D.ReactCurrentBatchConfig,Ur=0,Ft=null,Xt=null,Qt=null,Oo=!1,La=!1,Da=0,__=0;function un(){throw Error(t(321))}function eu(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Jn(n[a],i[a]))return!1;return!0}function tu(n,i,a,c,h,v){if(Ur=v,Ft=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Fo.current=n===null||n.memoizedState===null?M_:E_,n=a(c,h),La){v=0;do{if(La=!1,Da=0,25<=v)throw Error(t(301));v+=1,Qt=Xt=null,i.updateQueue=null,Fo.current=w_,n=a(c,h)}while(La)}if(Fo.current=Bo,i=Xt!==null&&Xt.next!==null,Ur=0,Qt=Xt=Ft=null,Oo=!1,i)throw Error(t(300));return n}function nu(){var n=Da!==0;return Da=0,n}function di(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n,Qt}function Gn(){if(Xt===null){var n=Ft.alternate;n=n!==null?n.memoizedState:null}else n=Xt.next;var i=Qt===null?Ft.memoizedState:Qt.next;if(i!==null)Qt=i,Xt=n;else{if(n===null)throw Error(t(310));Xt=n,n={memoizedState:Xt.memoizedState,baseState:Xt.baseState,baseQueue:Xt.baseQueue,queue:Xt.queue,next:null},Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n}return Qt}function Ua(n,i){return typeof i=="function"?i(n):i}function iu(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=Xt,h=c.baseQueue,v=a.pending;if(v!==null){if(h!==null){var A=h.next;h.next=v.next,v.next=A}c.baseQueue=h=v,a.pending=null}if(h!==null){v=h.next,c=c.baseState;var U=A=null,H=null,se=v;do{var Me=se.lane;if((Ur&Me)===Me)H!==null&&(H=H.next={lane:0,action:se.action,hasEagerState:se.hasEagerState,eagerState:se.eagerState,next:null}),c=se.hasEagerState?se.eagerState:n(c,se.action);else{var Ce={lane:Me,action:se.action,hasEagerState:se.hasEagerState,eagerState:se.eagerState,next:null};H===null?(U=H=Ce,A=c):H=H.next=Ce,Ft.lanes|=Me,Ir|=Me}se=se.next}while(se!==null&&se!==v);H===null?A=c:H.next=U,Jn(c,i.memoizedState)||(En=!0),i.memoizedState=c,i.baseState=A,i.baseQueue=H,a.lastRenderedState=c}if(n=a.interleaved,n!==null){h=n;do v=h.lane,Ft.lanes|=v,Ir|=v,h=h.next;while(h!==n)}else h===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function ru(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,h=a.pending,v=i.memoizedState;if(h!==null){a.pending=null;var A=h=h.next;do v=n(v,A.action),A=A.next;while(A!==h);Jn(v,i.memoizedState)||(En=!0),i.memoizedState=v,i.baseQueue===null&&(i.baseState=v),a.lastRenderedState=v}return[v,c]}function lh(){}function ch(n,i){var a=Ft,c=Gn(),h=i(),v=!Jn(c.memoizedState,h);if(v&&(c.memoizedState=h,En=!0),c=c.queue,su(fh.bind(null,a,c,n),[n]),c.getSnapshot!==i||v||Qt!==null&&Qt.memoizedState.tag&1){if(a.flags|=2048,Ia(9,dh.bind(null,a,c,h,i),void 0,null),en===null)throw Error(t(349));(Ur&30)!==0||uh(a,i,h)}return h}function uh(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function dh(n,i,a,c){i.value=a,i.getSnapshot=c,hh(i)&&ph(n)}function fh(n,i,a){return a(function(){hh(i)&&ph(n)})}function hh(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Jn(n,a)}catch{return!0}}function ph(n){var i=bi(n,1);i!==null&&ii(i,n,1,-1)}function mh(n){var i=di();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ua,lastRenderedState:n},i.queue=n,n=n.dispatch=S_.bind(null,Ft,n),[i.memoizedState,n]}function Ia(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function gh(){return Gn().memoizedState}function ko(n,i,a,c){var h=di();Ft.flags|=n,h.memoizedState=Ia(1|i,a,void 0,c===void 0?null:c)}function zo(n,i,a,c){var h=Gn();c=c===void 0?null:c;var v=void 0;if(Xt!==null){var A=Xt.memoizedState;if(v=A.destroy,c!==null&&eu(c,A.deps)){h.memoizedState=Ia(i,a,v,c);return}}Ft.flags|=n,h.memoizedState=Ia(1|i,a,v,c)}function vh(n,i){return ko(8390656,8,n,i)}function su(n,i){return zo(2048,8,n,i)}function _h(n,i){return zo(4,2,n,i)}function xh(n,i){return zo(4,4,n,i)}function yh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Sh(n,i,a){return a=a!=null?a.concat([n]):null,zo(4,4,yh.bind(null,i,n),a)}function au(){}function Mh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function Eh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function wh(n,i,a){return(Ur&21)===0?(n.baseState&&(n.baseState=!1,En=!0),n.memoizedState=a):(Jn(a,i)||(a=Qd(),Ft.lanes|=a,Ir|=a,n.baseState=!0),i)}function x_(n,i){var a=Et;Et=a!==0&&4>a?a:4,n(!0);var c=Qc.transition;Qc.transition={};try{n(!1),i()}finally{Et=a,Qc.transition=c}}function Th(){return Gn().memoizedState}function y_(n,i,a){var c=or(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Ah(n))Ch(i,a);else if(a=ih(n,i,a,c),a!==null){var h=_n();ii(a,n,c,h),bh(a,i,c)}}function S_(n,i,a){var c=or(n),h={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ah(n))Ch(i,h);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=i.lastRenderedReducer,v!==null))try{var A=i.lastRenderedState,U=v(A,a);if(h.hasEagerState=!0,h.eagerState=U,Jn(U,A)){var H=i.interleaved;H===null?(h.next=h,$c(i)):(h.next=H.next,H.next=h),i.interleaved=h;return}}catch{}finally{}a=ih(n,i,h,c),a!==null&&(h=_n(),ii(a,n,c,h),bh(a,i,c))}}function Ah(n){var i=n.alternate;return n===Ft||i!==null&&i===Ft}function Ch(n,i){La=Oo=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function bh(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}var Bo={readContext:Vn,useCallback:un,useContext:un,useEffect:un,useImperativeHandle:un,useInsertionEffect:un,useLayoutEffect:un,useMemo:un,useReducer:un,useRef:un,useState:un,useDebugValue:un,useDeferredValue:un,useTransition:un,useMutableSource:un,useSyncExternalStore:un,useId:un,unstable_isNewReconciler:!1},M_={readContext:Vn,useCallback:function(n,i){return di().memoizedState=[n,i===void 0?null:i],n},useContext:Vn,useEffect:vh,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,ko(4194308,4,yh.bind(null,i,n),a)},useLayoutEffect:function(n,i){return ko(4194308,4,n,i)},useInsertionEffect:function(n,i){return ko(4,2,n,i)},useMemo:function(n,i){var a=di();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=di();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=y_.bind(null,Ft,n),[c.memoizedState,n]},useRef:function(n){var i=di();return n={current:n},i.memoizedState=n},useState:mh,useDebugValue:au,useDeferredValue:function(n){return di().memoizedState=n},useTransition:function(){var n=mh(!1),i=n[0];return n=x_.bind(null,n[1]),di().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=Ft,h=di();if(Ut){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),en===null)throw Error(t(349));(Ur&30)!==0||uh(c,i,a)}h.memoizedState=a;var v={value:a,getSnapshot:i};return h.queue=v,vh(fh.bind(null,c,v,n),[n]),c.flags|=2048,Ia(9,dh.bind(null,c,v,a,i),void 0,null),a},useId:function(){var n=di(),i=en.identifierPrefix;if(Ut){var a=Ci,c=Ai;a=(c&~(1<<32-Wt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Da++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=__++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},E_={readContext:Vn,useCallback:Mh,useContext:Vn,useEffect:su,useImperativeHandle:Sh,useInsertionEffect:_h,useLayoutEffect:xh,useMemo:Eh,useReducer:iu,useRef:gh,useState:function(){return iu(Ua)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return wh(i,Xt.memoizedState,n)},useTransition:function(){var n=iu(Ua)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:lh,useSyncExternalStore:ch,useId:Th,unstable_isNewReconciler:!1},w_={readContext:Vn,useCallback:Mh,useContext:Vn,useEffect:su,useImperativeHandle:Sh,useInsertionEffect:_h,useLayoutEffect:xh,useMemo:Eh,useReducer:ru,useRef:gh,useState:function(){return ru(Ua)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return Xt===null?i.memoizedState=n:wh(i,Xt.memoizedState,n)},useTransition:function(){var n=ru(Ua)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:lh,useSyncExternalStore:ch,useId:Th,unstable_isNewReconciler:!1};function ei(n,i){if(n&&n.defaultProps){i=ne({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function ou(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:ne({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var jo={isMounted:function(n){return(n=n._reactInternals)?P(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Do(i,n,h))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.tag=1,v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Do(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=_n(),c=or(n),h=Ri(a,c);h.tag=2,i!=null&&(h.callback=i),i=ir(n,h,c),i!==null&&(ii(i,n,c,a),Do(i,n,c))}};function Rh(n,i,a,c,h,v,A){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,v,A):i.prototype&&i.prototype.isPureReactComponent?!Sa(a,c)||!Sa(h,v):!0}function Nh(n,i,a){var c=!1,h=er,v=i.contextType;return typeof v=="object"&&v!==null?v=Vn(v):(h=Mn(i)?Rr:cn.current,c=i.contextTypes,v=(c=c!=null)?gs(n,h):er),i=new i(a,v),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=jo,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=v),i}function Ph(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&jo.enqueueReplaceState(i,i.state,null)}function lu(n,i,a,c){var h=n.stateNode;h.props=a,h.state=n.memoizedState,h.refs={},qc(n);var v=i.contextType;typeof v=="object"&&v!==null?h.context=Vn(v):(v=Mn(i)?Rr:cn.current,h.context=gs(n,v)),h.state=n.memoizedState,v=i.getDerivedStateFromProps,typeof v=="function"&&(ou(n,i,v,a),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&jo.enqueueReplaceState(h,h.state,null),Uo(n,a,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function ws(n,i){try{var a="",c=i;do a+=pe(c),c=c.return;while(c);var h=a}catch(v){h=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:i,stack:h,digest:null}}function cu(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function uu(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var T_=typeof WeakMap=="function"?WeakMap:Map;function Lh(n,i,a){a=Ri(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){qo||(qo=!0,Tu=c),uu(n,i)},a}function Dh(n,i,a){a=Ri(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;a.payload=function(){return c(h)},a.callback=function(){uu(n,i)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(a.callback=function(){uu(n,i),typeof c!="function"&&(sr===null?sr=new Set([this]):sr.add(this));var A=i.stack;this.componentDidCatch(i.value,{componentStack:A!==null?A:""})}),a}function Uh(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new T_;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(a)||(h.add(a),n=z_.bind(null,n,i,a),i.then(n,n))}function Ih(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Fh(n,i,a,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Ri(-1,1),i.tag=2,ir(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var A_=D.ReactCurrentOwner,En=!1;function vn(n,i,a,c){i.child=n===null?nh(i,null,a,c):ys(i,n.child,a,c)}function Oh(n,i,a,c,h){a=a.render;var v=i.ref;return Ms(i,h),c=tu(n,i,a,c,v,h),a=nu(),n!==null&&!En?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&a&&kc(i),i.flags|=1,vn(n,i,c,h),i.child)}function kh(n,i,a,c,h){if(n===null){var v=a.type;return typeof v=="function"&&!Lu(v)&&v.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=v,zh(n,i,v,c,h)):(n=el(a.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(v=n.child,(n.lanes&h)===0){var A=v.memoizedProps;if(a=a.compare,a=a!==null?a:Sa,a(A,c)&&n.ref===i.ref)return Ni(n,i,h)}return i.flags|=1,n=cr(v,c),n.ref=i.ref,n.return=i,i.child=n}function zh(n,i,a,c,h){if(n!==null){var v=n.memoizedProps;if(Sa(v,c)&&n.ref===i.ref)if(En=!1,i.pendingProps=c=v,(n.lanes&h)!==0)(n.flags&131072)!==0&&(En=!0);else return i.lanes=n.lanes,Ni(n,i,h)}return du(n,i,a,c,h)}function Bh(n,i,a){var c=i.pendingProps,h=c.children,v=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},bt(As,In),In|=a;else{if((a&1073741824)===0)return n=v!==null?v.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,bt(As,In),In|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=v!==null?v.baseLanes:a,bt(As,In),In|=c}else v!==null?(c=v.baseLanes|a,i.memoizedState=null):c=a,bt(As,In),In|=c;return vn(n,i,h,a),i.child}function jh(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function du(n,i,a,c,h){var v=Mn(a)?Rr:cn.current;return v=gs(i,v),Ms(i,h),a=tu(n,i,a,c,v,h),c=nu(),n!==null&&!En?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&c&&kc(i),i.flags|=1,vn(n,i,a,h),i.child)}function Hh(n,i,a,c,h){if(Mn(a)){var v=!0;To(i)}else v=!1;if(Ms(i,h),i.stateNode===null)Vo(n,i),Nh(i,a,c),lu(i,a,c,h),c=!0;else if(n===null){var A=i.stateNode,U=i.memoizedProps;A.props=U;var H=A.context,se=a.contextType;typeof se=="object"&&se!==null?se=Vn(se):(se=Mn(a)?Rr:cn.current,se=gs(i,se));var Me=a.getDerivedStateFromProps,Ce=typeof Me=="function"||typeof A.getSnapshotBeforeUpdate=="function";Ce||typeof A.UNSAFE_componentWillReceiveProps!="function"&&typeof A.componentWillReceiveProps!="function"||(U!==c||H!==se)&&Ph(i,A,c,se),nr=!1;var Se=i.memoizedState;A.state=Se,Uo(i,c,A,h),H=i.memoizedState,U!==c||Se!==H||Sn.current||nr?(typeof Me=="function"&&(ou(i,a,Me,c),H=i.memoizedState),(U=nr||Rh(i,a,U,c,Se,H,se))?(Ce||typeof A.UNSAFE_componentWillMount!="function"&&typeof A.componentWillMount!="function"||(typeof A.componentWillMount=="function"&&A.componentWillMount(),typeof A.UNSAFE_componentWillMount=="function"&&A.UNSAFE_componentWillMount()),typeof A.componentDidMount=="function"&&(i.flags|=4194308)):(typeof A.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=H),A.props=c,A.state=H,A.context=se,c=U):(typeof A.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{A=i.stateNode,rh(n,i),U=i.memoizedProps,se=i.type===i.elementType?U:ei(i.type,U),A.props=se,Ce=i.pendingProps,Se=A.context,H=a.contextType,typeof H=="object"&&H!==null?H=Vn(H):(H=Mn(a)?Rr:cn.current,H=gs(i,H));var Oe=a.getDerivedStateFromProps;(Me=typeof Oe=="function"||typeof A.getSnapshotBeforeUpdate=="function")||typeof A.UNSAFE_componentWillReceiveProps!="function"&&typeof A.componentWillReceiveProps!="function"||(U!==Ce||Se!==H)&&Ph(i,A,c,H),nr=!1,Se=i.memoizedState,A.state=Se,Uo(i,c,A,h);var He=i.memoizedState;U!==Ce||Se!==He||Sn.current||nr?(typeof Oe=="function"&&(ou(i,a,Oe,c),He=i.memoizedState),(se=nr||Rh(i,a,se,c,Se,He,H)||!1)?(Me||typeof A.UNSAFE_componentWillUpdate!="function"&&typeof A.componentWillUpdate!="function"||(typeof A.componentWillUpdate=="function"&&A.componentWillUpdate(c,He,H),typeof A.UNSAFE_componentWillUpdate=="function"&&A.UNSAFE_componentWillUpdate(c,He,H)),typeof A.componentDidUpdate=="function"&&(i.flags|=4),typeof A.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof A.componentDidUpdate!="function"||U===n.memoizedProps&&Se===n.memoizedState||(i.flags|=4),typeof A.getSnapshotBeforeUpdate!="function"||U===n.memoizedProps&&Se===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=He),A.props=c,A.state=He,A.context=H,c=se):(typeof A.componentDidUpdate!="function"||U===n.memoizedProps&&Se===n.memoizedState||(i.flags|=4),typeof A.getSnapshotBeforeUpdate!="function"||U===n.memoizedProps&&Se===n.memoizedState||(i.flags|=1024),c=!1)}return fu(n,i,a,c,v,h)}function fu(n,i,a,c,h,v){jh(n,i);var A=(i.flags&128)!==0;if(!c&&!A)return h&&$f(i,a,!1),Ni(n,i,v);c=i.stateNode,A_.current=i;var U=A&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&A?(i.child=ys(i,n.child,null,v),i.child=ys(i,null,U,v)):vn(n,i,U,v),i.memoizedState=c.state,h&&$f(i,a,!0),i.child}function Vh(n){var i=n.stateNode;i.pendingContext?Wf(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Wf(n,i.context,!1),Yc(n,i.containerInfo)}function Gh(n,i,a,c,h){return xs(),Hc(h),i.flags|=256,vn(n,i,a,c),i.child}var hu={dehydrated:null,treeContext:null,retryLane:0};function pu(n){return{baseLanes:n,cachePool:null,transitions:null}}function Wh(n,i,a){var c=i.pendingProps,h=It.current,v=!1,A=(i.flags&128)!==0,U;if((U=A)||(U=n!==null&&n.memoizedState===null?!1:(h&2)!==0),U?(v=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),bt(It,h&1),n===null)return jc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(A=c.children,n=c.fallback,v?(c=i.mode,v=i.child,A={mode:"hidden",children:A},(c&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=A):v=tl(A,c,0,null),n=zr(n,c,a,null),v.return=i,n.return=i,v.sibling=n,i.child=v,i.child.memoizedState=pu(a),i.memoizedState=hu,n):mu(i,A));if(h=n.memoizedState,h!==null&&(U=h.dehydrated,U!==null))return C_(n,i,A,c,U,h,a);if(v){v=c.fallback,A=i.mode,h=n.child,U=h.sibling;var H={mode:"hidden",children:c.children};return(A&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=H,i.deletions=null):(c=cr(h,H),c.subtreeFlags=h.subtreeFlags&14680064),U!==null?v=cr(U,v):(v=zr(v,A,a,null),v.flags|=2),v.return=i,c.return=i,c.sibling=v,i.child=c,c=v,v=i.child,A=n.child.memoizedState,A=A===null?pu(a):{baseLanes:A.baseLanes|a,cachePool:null,transitions:A.transitions},v.memoizedState=A,v.childLanes=n.childLanes&~a,i.memoizedState=hu,c}return v=n.child,n=v.sibling,c=cr(v,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function mu(n,i){return i=tl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Ho(n,i,a,c){return c!==null&&Hc(c),ys(i,n.child,null,a),n=mu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function C_(n,i,a,c,h,v,A){if(a)return i.flags&256?(i.flags&=-257,c=cu(Error(t(422))),Ho(n,i,A,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(v=c.fallback,h=i.mode,c=tl({mode:"visible",children:c.children},h,0,null),v=zr(v,h,A,null),v.flags|=2,c.return=i,v.return=i,c.sibling=v,i.child=c,(i.mode&1)!==0&&ys(i,n.child,null,A),i.child.memoizedState=pu(A),i.memoizedState=hu,v);if((i.mode&1)===0)return Ho(n,i,A,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var U=c.dgst;return c=U,v=Error(t(419)),c=cu(v,c,void 0),Ho(n,i,A,c)}if(U=(A&n.childLanes)!==0,En||U){if(c=en,c!==null){switch(A&-A){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|A))!==0?0:h,h!==0&&h!==v.retryLane&&(v.retryLane=h,bi(n,h),ii(c,n,h,-1))}return Pu(),c=cu(Error(t(421))),Ho(n,i,A,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=B_.bind(null,n),h._reactRetry=i,null):(n=v.treeContext,Un=Ji(h.nextSibling),Dn=i,Ut=!0,Qn=null,n!==null&&(jn[Hn++]=Ai,jn[Hn++]=Ci,jn[Hn++]=Nr,Ai=n.id,Ci=n.overflow,Nr=i),i=mu(i,c.children),i.flags|=4096,i)}function Xh(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),Xc(n.return,i,a)}function gu(n,i,a,c,h){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:h}:(v.isBackwards=i,v.rendering=null,v.renderingStartTime=0,v.last=c,v.tail=a,v.tailMode=h)}function $h(n,i,a){var c=i.pendingProps,h=c.revealOrder,v=c.tail;if(vn(n,i,c.children,a),c=It.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Xh(n,a,i);else if(n.tag===19)Xh(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(bt(It,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(a=i.child,h=null;a!==null;)n=a.alternate,n!==null&&Io(n)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),gu(i,!1,h,a,v);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Io(n)===null){i.child=h;break}n=h.sibling,h.sibling=a,a=h,h=n}gu(i,!0,a,null,v);break;case"together":gu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Vo(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ni(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Ir|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=cr(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=cr(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function b_(n,i,a){switch(i.tag){case 3:Vh(i),xs();break;case 5:oh(i);break;case 1:Mn(i.type)&&To(i);break;case 4:Yc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;bt(Po,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(bt(It,It.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Wh(n,i,a):(bt(It,It.current&1),n=Ni(n,i,a),n!==null?n.sibling:null);bt(It,It.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return $h(n,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),bt(It,It.current),c)break;return null;case 22:case 23:return i.lanes=0,Bh(n,i,a)}return Ni(n,i,a)}var qh,vu,Yh,Kh;qh=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},vu=function(){},Yh=function(n,i,a,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Dr(ui.current);var v=null;switch(a){case"input":h=Ke(n,h),c=Ke(n,c),v=[];break;case"select":h=ne({},h,{value:void 0}),c=ne({},c,{value:void 0}),v=[];break;case"textarea":h=ve(n,h),c=ve(n,c),v=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Mo)}dt(a,c);var A;a=null;for(se in h)if(!c.hasOwnProperty(se)&&h.hasOwnProperty(se)&&h[se]!=null)if(se==="style"){var U=h[se];for(A in U)U.hasOwnProperty(A)&&(a||(a={}),a[A]="")}else se!=="dangerouslySetInnerHTML"&&se!=="children"&&se!=="suppressContentEditableWarning"&&se!=="suppressHydrationWarning"&&se!=="autoFocus"&&(o.hasOwnProperty(se)?v||(v=[]):(v=v||[]).push(se,null));for(se in c){var H=c[se];if(U=h!=null?h[se]:void 0,c.hasOwnProperty(se)&&H!==U&&(H!=null||U!=null))if(se==="style")if(U){for(A in U)!U.hasOwnProperty(A)||H&&H.hasOwnProperty(A)||(a||(a={}),a[A]="");for(A in H)H.hasOwnProperty(A)&&U[A]!==H[A]&&(a||(a={}),a[A]=H[A])}else a||(v||(v=[]),v.push(se,a)),a=H;else se==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,U=U?U.__html:void 0,H!=null&&U!==H&&(v=v||[]).push(se,H)):se==="children"?typeof H!="string"&&typeof H!="number"||(v=v||[]).push(se,""+H):se!=="suppressContentEditableWarning"&&se!=="suppressHydrationWarning"&&(o.hasOwnProperty(se)?(H!=null&&se==="onScroll"&&Nt("scroll",n),v||U===H||(v=[])):(v=v||[]).push(se,H))}a&&(v=v||[]).push("style",a);var se=v;(i.updateQueue=se)&&(i.flags|=4)}},Kh=function(n,i,a,c){a!==c&&(i.flags|=4)};function Fa(n,i){if(!Ut)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function dn(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function R_(n,i,a){var c=i.pendingProps;switch(zc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return dn(i),null;case 1:return Mn(i.type)&&wo(),dn(i),null;case 3:return c=i.stateNode,Es(),Pt(Sn),Pt(cn),Jc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Ro(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Qn!==null&&(bu(Qn),Qn=null))),vu(n,i),dn(i),null;case 5:Kc(i);var h=Dr(Pa.current);if(a=i.type,n!==null&&i.stateNode!=null)Yh(n,i,a,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return dn(i),null}if(n=Dr(ui.current),Ro(i)){c=i.stateNode,a=i.type;var v=i.memoizedProps;switch(c[ci]=i,c[Aa]=v,n=(i.mode&1)!==0,a){case"dialog":Nt("cancel",c),Nt("close",c);break;case"iframe":case"object":case"embed":Nt("load",c);break;case"video":case"audio":for(h=0;h<Ea.length;h++)Nt(Ea[h],c);break;case"source":Nt("error",c);break;case"img":case"image":case"link":Nt("error",c),Nt("load",c);break;case"details":Nt("toggle",c);break;case"input":ut(c,v),Nt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!v.multiple},Nt("invalid",c);break;case"textarea":Ee(c,v),Nt("invalid",c)}dt(a,v),h=null;for(var A in v)if(v.hasOwnProperty(A)){var U=v[A];A==="children"?typeof U=="string"?c.textContent!==U&&(v.suppressHydrationWarning!==!0&&So(c.textContent,U,n),h=["children",U]):typeof U=="number"&&c.textContent!==""+U&&(v.suppressHydrationWarning!==!0&&So(c.textContent,U,n),h=["children",""+U]):o.hasOwnProperty(A)&&U!=null&&A==="onScroll"&&Nt("scroll",c)}switch(a){case"input":ht(c),At(c,v,!0);break;case"textarea":ht(c),qe(c);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(c.onclick=Mo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{A=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Pe(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=A.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=A.createElement(a,{is:c.is}):(n=A.createElement(a),a==="select"&&(A=n,c.multiple?A.multiple=!0:c.size&&(A.size=c.size))):n=A.createElementNS(n,a),n[ci]=i,n[Aa]=c,qh(n,i,!1,!1),i.stateNode=n;e:{switch(A=st(a,c),a){case"dialog":Nt("cancel",n),Nt("close",n),h=c;break;case"iframe":case"object":case"embed":Nt("load",n),h=c;break;case"video":case"audio":for(h=0;h<Ea.length;h++)Nt(Ea[h],n);h=c;break;case"source":Nt("error",n),h=c;break;case"img":case"image":case"link":Nt("error",n),Nt("load",n),h=c;break;case"details":Nt("toggle",n),h=c;break;case"input":ut(n,c),h=Ke(n,c),Nt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=ne({},c,{value:void 0}),Nt("invalid",n);break;case"textarea":Ee(n,c),h=ve(n,c),Nt("invalid",n);break;default:h=c}dt(a,h),U=h;for(v in U)if(U.hasOwnProperty(v)){var H=U[v];v==="style"?Be(n,H):v==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,H!=null&&B(n,H)):v==="children"?typeof H=="string"?(a!=="textarea"||H!=="")&&ee(n,H):typeof H=="number"&&ee(n,""+H):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(o.hasOwnProperty(v)?H!=null&&v==="onScroll"&&Nt("scroll",n):H!=null&&R(n,v,H,A))}switch(a){case"input":ht(n),At(n,c,!1);break;case"textarea":ht(n),qe(n);break;case"option":c.value!=null&&n.setAttribute("value",""+ke(c.value));break;case"select":n.multiple=!!c.multiple,v=c.value,v!=null?ue(n,!!c.multiple,v,!1):c.defaultValue!=null&&ue(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=Mo)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return dn(i),null;case 6:if(n&&i.stateNode!=null)Kh(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Dr(Pa.current),Dr(ui.current),Ro(i)){if(c=i.stateNode,a=i.memoizedProps,c[ci]=i,(v=c.nodeValue!==a)&&(n=Dn,n!==null))switch(n.tag){case 3:So(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&So(c.nodeValue,a,(n.mode&1)!==0)}v&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ci]=i,i.stateNode=c}return dn(i),null;case 13:if(Pt(It),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ut&&Un!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Qf(),xs(),i.flags|=98560,v=!1;else if(v=Ro(i),c!==null&&c.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=i.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[ci]=i}else xs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;dn(i),v=!1}else Qn!==null&&(bu(Qn),Qn=null),v=!0;if(!v)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(It.current&1)!==0?$t===0&&($t=3):Pu())),i.updateQueue!==null&&(i.flags|=4),dn(i),null);case 4:return Es(),vu(n,i),n===null&&wa(i.stateNode.containerInfo),dn(i),null;case 10:return Wc(i.type._context),dn(i),null;case 17:return Mn(i.type)&&wo(),dn(i),null;case 19:if(Pt(It),v=i.memoizedState,v===null)return dn(i),null;if(c=(i.flags&128)!==0,A=v.rendering,A===null)if(c)Fa(v,!1);else{if($t!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(A=Io(n),A!==null){for(i.flags|=128,Fa(v,!1),c=A.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)v=a,n=c,v.flags&=14680066,A=v.alternate,A===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=A.childLanes,v.lanes=A.lanes,v.child=A.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=A.memoizedProps,v.memoizedState=A.memoizedState,v.updateQueue=A.updateQueue,v.type=A.type,n=A.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return bt(It,It.current&1|2),i.child}n=n.sibling}v.tail!==null&&Ve()>Cs&&(i.flags|=128,c=!0,Fa(v,!1),i.lanes=4194304)}else{if(!c)if(n=Io(A),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Fa(v,!0),v.tail===null&&v.tailMode==="hidden"&&!A.alternate&&!Ut)return dn(i),null}else 2*Ve()-v.renderingStartTime>Cs&&a!==1073741824&&(i.flags|=128,c=!0,Fa(v,!1),i.lanes=4194304);v.isBackwards?(A.sibling=i.child,i.child=A):(a=v.last,a!==null?a.sibling=A:i.child=A,v.last=A)}return v.tail!==null?(i=v.tail,v.rendering=i,v.tail=i.sibling,v.renderingStartTime=Ve(),i.sibling=null,a=It.current,bt(It,c?a&1|2:a&1),i):(dn(i),null);case 22:case 23:return Nu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(In&1073741824)!==0&&(dn(i),i.subtreeFlags&6&&(i.flags|=8192)):dn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function N_(n,i){switch(zc(i),i.tag){case 1:return Mn(i.type)&&wo(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Es(),Pt(Sn),Pt(cn),Jc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Kc(i),null;case 13:if(Pt(It),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));xs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Pt(It),null;case 4:return Es(),null;case 10:return Wc(i.type._context),null;case 22:case 23:return Nu(),null;case 24:return null;default:return null}}var Go=!1,fn=!1,P_=typeof WeakSet=="function"?WeakSet:Set,ze=null;function Ts(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){Ot(n,i,c)}else a.current=null}function _u(n,i,a){try{a()}catch(c){Ot(n,i,c)}}var Zh=!1;function L_(n,i){if(Nc=co,n=Rf(),Mc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var h=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{a.nodeType,v.nodeType}catch{a=null;break e}var A=0,U=-1,H=-1,se=0,Me=0,Ce=n,Se=null;t:for(;;){for(var Oe;Ce!==a||h!==0&&Ce.nodeType!==3||(U=A+h),Ce!==v||c!==0&&Ce.nodeType!==3||(H=A+c),Ce.nodeType===3&&(A+=Ce.nodeValue.length),(Oe=Ce.firstChild)!==null;)Se=Ce,Ce=Oe;for(;;){if(Ce===n)break t;if(Se===a&&++se===h&&(U=A),Se===v&&++Me===c&&(H=A),(Oe=Ce.nextSibling)!==null)break;Ce=Se,Se=Ce.parentNode}Ce=Oe}a=U===-1||H===-1?null:{start:U,end:H}}else a=null}a=a||{start:0,end:0}}else a=null;for(Pc={focusedElem:n,selectionRange:a},co=!1,ze=i;ze!==null;)if(i=ze,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,ze=n;else for(;ze!==null;){i=ze;try{var He=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(He!==null){var Ge=He.memoizedProps,zt=He.memoizedState,J=i.stateNode,W=J.getSnapshotBeforeUpdate(i.elementType===i.type?Ge:ei(i.type,Ge),zt);J.__reactInternalSnapshotBeforeUpdate=W}break;case 3:var te=i.stateNode.containerInfo;te.nodeType===1?te.textContent="":te.nodeType===9&&te.documentElement&&te.removeChild(te.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(be){Ot(i,i.return,be)}if(n=i.sibling,n!==null){n.return=i.return,ze=n;break}ze=i.return}return He=Zh,Zh=!1,He}function Oa(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var v=h.destroy;h.destroy=void 0,v!==void 0&&_u(i,a,v)}h=h.next}while(h!==c)}}function Wo(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function xu(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Jh(n){var i=n.alternate;i!==null&&(n.alternate=null,Jh(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[ci],delete i[Aa],delete i[Ic],delete i[p_],delete i[m_])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Qh(n){return n.tag===5||n.tag===3||n.tag===4}function ep(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Qh(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function yu(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Mo));else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,a),n=n.sibling;n!==null;)yu(n,i,a),n=n.sibling}function Su(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Su(n,i,a),n=n.sibling;n!==null;)Su(n,i,a),n=n.sibling}var an=null,ti=!1;function rr(n,i,a){for(a=a.child;a!==null;)tp(n,i,a),a=a.sibling}function tp(n,i,a){if(ln&&typeof ln.onCommitFiberUnmount=="function")try{ln.onCommitFiberUnmount(et,a)}catch{}switch(a.tag){case 5:fn||Ts(a,i);case 6:var c=an,h=ti;an=null,rr(n,i,a),an=c,ti=h,an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):an.removeChild(a.stateNode));break;case 18:an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?Uc(n.parentNode,a):n.nodeType===1&&Uc(n,a),ma(n)):Uc(an,a.stateNode));break;case 4:c=an,h=ti,an=a.stateNode.containerInfo,ti=!0,rr(n,i,a),an=c,ti=h;break;case 0:case 11:case 14:case 15:if(!fn&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var v=h,A=v.destroy;v=v.tag,A!==void 0&&((v&2)!==0||(v&4)!==0)&&_u(a,i,A),h=h.next}while(h!==c)}rr(n,i,a);break;case 1:if(!fn&&(Ts(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(U){Ot(a,i,U)}rr(n,i,a);break;case 21:rr(n,i,a);break;case 22:a.mode&1?(fn=(c=fn)||a.memoizedState!==null,rr(n,i,a),fn=c):rr(n,i,a);break;default:rr(n,i,a)}}function np(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new P_),i.forEach(function(c){var h=j_.bind(null,n,c);a.has(c)||(a.add(c),c.then(h,h))})}}function ni(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var h=a[c];try{var v=n,A=i,U=A;e:for(;U!==null;){switch(U.tag){case 5:an=U.stateNode,ti=!1;break e;case 3:an=U.stateNode.containerInfo,ti=!0;break e;case 4:an=U.stateNode.containerInfo,ti=!0;break e}U=U.return}if(an===null)throw Error(t(160));tp(v,A,h),an=null,ti=!1;var H=h.alternate;H!==null&&(H.return=null),h.return=null}catch(se){Ot(h,i,se)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)ip(i,n),i=i.sibling}function ip(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(ni(i,n),fi(n),c&4){try{Oa(3,n,n.return),Wo(3,n)}catch(Ge){Ot(n,n.return,Ge)}try{Oa(5,n,n.return)}catch(Ge){Ot(n,n.return,Ge)}}break;case 1:ni(i,n),fi(n),c&512&&a!==null&&Ts(a,a.return);break;case 5:if(ni(i,n),fi(n),c&512&&a!==null&&Ts(a,a.return),n.flags&32){var h=n.stateNode;try{ee(h,"")}catch(Ge){Ot(n,n.return,Ge)}}if(c&4&&(h=n.stateNode,h!=null)){var v=n.memoizedProps,A=a!==null?a.memoizedProps:v,U=n.type,H=n.updateQueue;if(n.updateQueue=null,H!==null)try{U==="input"&&v.type==="radio"&&v.name!=null&&rt(h,v),st(U,A);var se=st(U,v);for(A=0;A<H.length;A+=2){var Me=H[A],Ce=H[A+1];Me==="style"?Be(h,Ce):Me==="dangerouslySetInnerHTML"?B(h,Ce):Me==="children"?ee(h,Ce):R(h,Me,Ce,se)}switch(U){case"input":at(h,v);break;case"textarea":Te(h,v);break;case"select":var Se=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!v.multiple;var Oe=v.value;Oe!=null?ue(h,!!v.multiple,Oe,!1):Se!==!!v.multiple&&(v.defaultValue!=null?ue(h,!!v.multiple,v.defaultValue,!0):ue(h,!!v.multiple,v.multiple?[]:"",!1))}h[Aa]=v}catch(Ge){Ot(n,n.return,Ge)}}break;case 6:if(ni(i,n),fi(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,v=n.memoizedProps;try{h.nodeValue=v}catch(Ge){Ot(n,n.return,Ge)}}break;case 3:if(ni(i,n),fi(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{ma(i.containerInfo)}catch(Ge){Ot(n,n.return,Ge)}break;case 4:ni(i,n),fi(n);break;case 13:ni(i,n),fi(n),h=n.child,h.flags&8192&&(v=h.memoizedState!==null,h.stateNode.isHidden=v,!v||h.alternate!==null&&h.alternate.memoizedState!==null||(wu=Ve())),c&4&&np(n);break;case 22:if(Me=a!==null&&a.memoizedState!==null,n.mode&1?(fn=(se=fn)||Me,ni(i,n),fn=se):ni(i,n),fi(n),c&8192){if(se=n.memoizedState!==null,(n.stateNode.isHidden=se)&&!Me&&(n.mode&1)!==0)for(ze=n,Me=n.child;Me!==null;){for(Ce=ze=Me;ze!==null;){switch(Se=ze,Oe=Se.child,Se.tag){case 0:case 11:case 14:case 15:Oa(4,Se,Se.return);break;case 1:Ts(Se,Se.return);var He=Se.stateNode;if(typeof He.componentWillUnmount=="function"){c=Se,a=Se.return;try{i=c,He.props=i.memoizedProps,He.state=i.memoizedState,He.componentWillUnmount()}catch(Ge){Ot(c,a,Ge)}}break;case 5:Ts(Se,Se.return);break;case 22:if(Se.memoizedState!==null){ap(Ce);continue}}Oe!==null?(Oe.return=Se,ze=Oe):ap(Ce)}Me=Me.sibling}e:for(Me=null,Ce=n;;){if(Ce.tag===5){if(Me===null){Me=Ce;try{h=Ce.stateNode,se?(v=h.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(U=Ce.stateNode,H=Ce.memoizedProps.style,A=H!=null&&H.hasOwnProperty("display")?H.display:null,U.style.display=we("display",A))}catch(Ge){Ot(n,n.return,Ge)}}}else if(Ce.tag===6){if(Me===null)try{Ce.stateNode.nodeValue=se?"":Ce.memoizedProps}catch(Ge){Ot(n,n.return,Ge)}}else if((Ce.tag!==22&&Ce.tag!==23||Ce.memoizedState===null||Ce===n)&&Ce.child!==null){Ce.child.return=Ce,Ce=Ce.child;continue}if(Ce===n)break e;for(;Ce.sibling===null;){if(Ce.return===null||Ce.return===n)break e;Me===Ce&&(Me=null),Ce=Ce.return}Me===Ce&&(Me=null),Ce.sibling.return=Ce.return,Ce=Ce.sibling}}break;case 19:ni(i,n),fi(n),c&4&&np(n);break;case 21:break;default:ni(i,n),fi(n)}}function fi(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(Qh(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(ee(h,""),c.flags&=-33);var v=ep(n);Su(n,v,h);break;case 3:case 4:var A=c.stateNode.containerInfo,U=ep(n);yu(n,U,A);break;default:throw Error(t(161))}}catch(H){Ot(n,n.return,H)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function D_(n,i,a){ze=n,rp(n)}function rp(n,i,a){for(var c=(n.mode&1)!==0;ze!==null;){var h=ze,v=h.child;if(h.tag===22&&c){var A=h.memoizedState!==null||Go;if(!A){var U=h.alternate,H=U!==null&&U.memoizedState!==null||fn;U=Go;var se=fn;if(Go=A,(fn=H)&&!se)for(ze=h;ze!==null;)A=ze,H=A.child,A.tag===22&&A.memoizedState!==null?op(h):H!==null?(H.return=A,ze=H):op(h);for(;v!==null;)ze=v,rp(v),v=v.sibling;ze=h,Go=U,fn=se}sp(n)}else(h.subtreeFlags&8772)!==0&&v!==null?(v.return=h,ze=v):sp(n)}}function sp(n){for(;ze!==null;){var i=ze;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:fn||Wo(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!fn)if(a===null)c.componentDidMount();else{var h=i.elementType===i.type?a.memoizedProps:ei(i.type,a.memoizedProps);c.componentDidUpdate(h,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var v=i.updateQueue;v!==null&&ah(i,v,c);break;case 3:var A=i.updateQueue;if(A!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}ah(i,A,a)}break;case 5:var U=i.stateNode;if(a===null&&i.flags&4){a=U;var H=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":H.autoFocus&&a.focus();break;case"img":H.src&&(a.src=H.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var se=i.alternate;if(se!==null){var Me=se.memoizedState;if(Me!==null){var Ce=Me.dehydrated;Ce!==null&&ma(Ce)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}fn||i.flags&512&&xu(i)}catch(Se){Ot(i,i.return,Se)}}if(i===n){ze=null;break}if(a=i.sibling,a!==null){a.return=i.return,ze=a;break}ze=i.return}}function ap(n){for(;ze!==null;){var i=ze;if(i===n){ze=null;break}var a=i.sibling;if(a!==null){a.return=i.return,ze=a;break}ze=i.return}}function op(n){for(;ze!==null;){var i=ze;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{Wo(4,i)}catch(H){Ot(i,a,H)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(H){Ot(i,h,H)}}var v=i.return;try{xu(i)}catch(H){Ot(i,v,H)}break;case 5:var A=i.return;try{xu(i)}catch(H){Ot(i,A,H)}}}catch(H){Ot(i,i.return,H)}if(i===n){ze=null;break}var U=i.sibling;if(U!==null){U.return=i.return,ze=U;break}ze=i.return}}var U_=Math.ceil,Xo=D.ReactCurrentDispatcher,Mu=D.ReactCurrentOwner,Wn=D.ReactCurrentBatchConfig,_t=0,en=null,jt=null,on=0,In=0,As=Qi(0),$t=0,ka=null,Ir=0,$o=0,Eu=0,za=null,wn=null,wu=0,Cs=1/0,Pi=null,qo=!1,Tu=null,sr=null,Yo=!1,ar=null,Ko=0,Ba=0,Au=null,Zo=-1,Jo=0;function _n(){return(_t&6)!==0?Ve():Zo!==-1?Zo:Zo=Ve()}function or(n){return(n.mode&1)===0?1:(_t&2)!==0&&on!==0?on&-on:v_.transition!==null?(Jo===0&&(Jo=Qd()),Jo):(n=Et,n!==0||(n=window.event,n=n===void 0?16:cf(n.type)),n)}function ii(n,i,a,c){if(50<Ba)throw Ba=0,Au=null,Error(t(185));ua(n,a,c),((_t&2)===0||n!==en)&&(n===en&&((_t&2)===0&&($o|=a),$t===4&&lr(n,on)),Tn(n,c),a===1&&_t===0&&(i.mode&1)===0&&(Cs=Ve()+500,Ao&&tr()))}function Tn(n,i){var a=n.callbackNode;ac(n,i);var c=sn(n,n===en?on:0);if(c===0)a!==null&&$e(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&$e(a),i===1)n.tag===0?g_(cp.bind(null,n)):qf(cp.bind(null,n)),f_(function(){(_t&6)===0&&tr()}),a=null;else{switch(ef(c)){case 1:a=Dt;break;case 4:a=Gt;break;case 16:a=Jt;break;case 536870912:a=vt;break;default:a=Jt}a=vp(a,lp.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function lp(n,i){if(Zo=-1,Jo=0,(_t&6)!==0)throw Error(t(327));var a=n.callbackNode;if(bs()&&n.callbackNode!==a)return null;var c=sn(n,n===en?on:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=Qo(n,c);else{i=c;var h=_t;_t|=2;var v=dp();(en!==n||on!==i)&&(Pi=null,Cs=Ve()+500,Or(n,i));do try{O_();break}catch(U){up(n,U)}while(!0);Gc(),Xo.current=v,_t=h,jt!==null?i=0:(en=null,on=0,i=$t)}if(i!==0){if(i===2&&(h=as(n),h!==0&&(c=h,i=Cu(n,h))),i===1)throw a=ka,Or(n,0),lr(n,c),Tn(n,Ve()),a;if(i===6)lr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!I_(h)&&(i=Qo(n,c),i===2&&(v=as(n),v!==0&&(c=v,i=Cu(n,v))),i===1))throw a=ka,Or(n,0),lr(n,c),Tn(n,Ve()),a;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:kr(n,wn,Pi);break;case 3:if(lr(n,c),(c&130023424)===c&&(i=wu+500-Ve(),10<i)){if(sn(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){_n(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Dc(kr.bind(null,n,wn,Pi),i);break}kr(n,wn,Pi);break;case 4:if(lr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var A=31-Wt(c);v=1<<A,A=i[A],A>h&&(h=A),c&=~v}if(c=h,c=Ve()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*U_(c/1960))-c,10<c){n.timeoutHandle=Dc(kr.bind(null,n,wn,Pi),c);break}kr(n,wn,Pi);break;case 5:kr(n,wn,Pi);break;default:throw Error(t(329))}}}return Tn(n,Ve()),n.callbackNode===a?lp.bind(null,n):null}function Cu(n,i){var a=za;return n.current.memoizedState.isDehydrated&&(Or(n,i).flags|=256),n=Qo(n,i),n!==2&&(i=wn,wn=a,i!==null&&bu(i)),n}function bu(n){wn===null?wn=n:wn.push.apply(wn,n)}function I_(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var h=a[c],v=h.getSnapshot;h=h.value;try{if(!Jn(v(),h))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function lr(n,i){for(i&=~Eu,i&=~$o,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Wt(i),c=1<<a;n[a]=-1,i&=~c}}function cp(n){if((_t&6)!==0)throw Error(t(327));bs();var i=sn(n,0);if((i&1)===0)return Tn(n,Ve()),null;var a=Qo(n,i);if(n.tag!==0&&a===2){var c=as(n);c!==0&&(i=c,a=Cu(n,c))}if(a===1)throw a=ka,Or(n,0),lr(n,i),Tn(n,Ve()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,kr(n,wn,Pi),Tn(n,Ve()),null}function Ru(n,i){var a=_t;_t|=1;try{return n(i)}finally{_t=a,_t===0&&(Cs=Ve()+500,Ao&&tr())}}function Fr(n){ar!==null&&ar.tag===0&&(_t&6)===0&&bs();var i=_t;_t|=1;var a=Wn.transition,c=Et;try{if(Wn.transition=null,Et=1,n)return n()}finally{Et=c,Wn.transition=a,_t=i,(_t&6)===0&&tr()}}function Nu(){In=As.current,Pt(As)}function Or(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,d_(a)),jt!==null)for(a=jt.return;a!==null;){var c=a;switch(zc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&wo();break;case 3:Es(),Pt(Sn),Pt(cn),Jc();break;case 5:Kc(c);break;case 4:Es();break;case 13:Pt(It);break;case 19:Pt(It);break;case 10:Wc(c.type._context);break;case 22:case 23:Nu()}a=a.return}if(en=n,jt=n=cr(n.current,null),on=In=i,$t=0,ka=null,Eu=$o=Ir=0,wn=za=null,Lr!==null){for(i=0;i<Lr.length;i++)if(a=Lr[i],c=a.interleaved,c!==null){a.interleaved=null;var h=c.next,v=a.pending;if(v!==null){var A=v.next;v.next=h,c.next=A}a.pending=c}Lr=null}return n}function up(n,i){do{var a=jt;try{if(Gc(),Fo.current=Bo,Oo){for(var c=Ft.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}Oo=!1}if(Ur=0,Qt=Xt=Ft=null,La=!1,Da=0,Mu.current=null,a===null||a.return===null){$t=1,ka=i,jt=null;break}e:{var v=n,A=a.return,U=a,H=i;if(i=on,U.flags|=32768,H!==null&&typeof H=="object"&&typeof H.then=="function"){var se=H,Me=U,Ce=Me.tag;if((Me.mode&1)===0&&(Ce===0||Ce===11||Ce===15)){var Se=Me.alternate;Se?(Me.updateQueue=Se.updateQueue,Me.memoizedState=Se.memoizedState,Me.lanes=Se.lanes):(Me.updateQueue=null,Me.memoizedState=null)}var Oe=Ih(A);if(Oe!==null){Oe.flags&=-257,Fh(Oe,A,U,v,i),Oe.mode&1&&Uh(v,se,i),i=Oe,H=se;var He=i.updateQueue;if(He===null){var Ge=new Set;Ge.add(H),i.updateQueue=Ge}else He.add(H);break e}else{if((i&1)===0){Uh(v,se,i),Pu();break e}H=Error(t(426))}}else if(Ut&&U.mode&1){var zt=Ih(A);if(zt!==null){(zt.flags&65536)===0&&(zt.flags|=256),Fh(zt,A,U,v,i),Hc(ws(H,U));break e}}v=H=ws(H,U),$t!==4&&($t=2),za===null?za=[v]:za.push(v),v=A;do{switch(v.tag){case 3:v.flags|=65536,i&=-i,v.lanes|=i;var J=Lh(v,H,i);sh(v,J);break e;case 1:U=H;var W=v.type,te=v.stateNode;if((v.flags&128)===0&&(typeof W.getDerivedStateFromError=="function"||te!==null&&typeof te.componentDidCatch=="function"&&(sr===null||!sr.has(te)))){v.flags|=65536,i&=-i,v.lanes|=i;var be=Dh(v,U,i);sh(v,be);break e}}v=v.return}while(v!==null)}hp(a)}catch(Xe){i=Xe,jt===a&&a!==null&&(jt=a=a.return);continue}break}while(!0)}function dp(){var n=Xo.current;return Xo.current=Bo,n===null?Bo:n}function Pu(){($t===0||$t===3||$t===2)&&($t=4),en===null||(Ir&268435455)===0&&($o&268435455)===0||lr(en,on)}function Qo(n,i){var a=_t;_t|=2;var c=dp();(en!==n||on!==i)&&(Pi=null,Or(n,i));do try{F_();break}catch(h){up(n,h)}while(!0);if(Gc(),_t=a,Xo.current=c,jt!==null)throw Error(t(261));return en=null,on=0,$t}function F_(){for(;jt!==null;)fp(jt)}function O_(){for(;jt!==null&&!Qe();)fp(jt)}function fp(n){var i=gp(n.alternate,n,In);n.memoizedProps=n.pendingProps,i===null?hp(n):jt=i,Mu.current=null}function hp(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=R_(a,i,In),a!==null){jt=a;return}}else{if(a=N_(a,i),a!==null){a.flags&=32767,jt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{$t=6,jt=null;return}}if(i=i.sibling,i!==null){jt=i;return}jt=i=n}while(i!==null);$t===0&&($t=5)}function kr(n,i,a){var c=Et,h=Wn.transition;try{Wn.transition=null,Et=1,k_(n,i,a,c)}finally{Wn.transition=h,Et=c}return null}function k_(n,i,a,c){do bs();while(ar!==null);if((_t&6)!==0)throw Error(t(327));a=n.finishedWork;var h=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=a.lanes|a.childLanes;if(_v(n,v),n===en&&(jt=en=null,on=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Yo||(Yo=!0,vp(Jt,function(){return bs(),null})),v=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||v){v=Wn.transition,Wn.transition=null;var A=Et;Et=1;var U=_t;_t|=4,Mu.current=null,L_(n,a),ip(a,n),r_(Pc),co=!!Nc,Pc=Nc=null,n.current=a,D_(a),it(),_t=U,Et=A,Wn.transition=v}else n.current=a;if(Yo&&(Yo=!1,ar=n,Ko=h),v=n.pendingLanes,v===0&&(sr=null),Ct(a.stateNode),Tn(n,Ve()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)h=i[a],c(h.value,{componentStack:h.stack,digest:h.digest});if(qo)throw qo=!1,n=Tu,Tu=null,n;return(Ko&1)!==0&&n.tag!==0&&bs(),v=n.pendingLanes,(v&1)!==0?n===Au?Ba++:(Ba=0,Au=n):Ba=0,tr(),null}function bs(){if(ar!==null){var n=ef(Ko),i=Wn.transition,a=Et;try{if(Wn.transition=null,Et=16>n?16:n,ar===null)var c=!1;else{if(n=ar,ar=null,Ko=0,(_t&6)!==0)throw Error(t(331));var h=_t;for(_t|=4,ze=n.current;ze!==null;){var v=ze,A=v.child;if((ze.flags&16)!==0){var U=v.deletions;if(U!==null){for(var H=0;H<U.length;H++){var se=U[H];for(ze=se;ze!==null;){var Me=ze;switch(Me.tag){case 0:case 11:case 15:Oa(8,Me,v)}var Ce=Me.child;if(Ce!==null)Ce.return=Me,ze=Ce;else for(;ze!==null;){Me=ze;var Se=Me.sibling,Oe=Me.return;if(Jh(Me),Me===se){ze=null;break}if(Se!==null){Se.return=Oe,ze=Se;break}ze=Oe}}}var He=v.alternate;if(He!==null){var Ge=He.child;if(Ge!==null){He.child=null;do{var zt=Ge.sibling;Ge.sibling=null,Ge=zt}while(Ge!==null)}}ze=v}}if((v.subtreeFlags&2064)!==0&&A!==null)A.return=v,ze=A;else e:for(;ze!==null;){if(v=ze,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:Oa(9,v,v.return)}var J=v.sibling;if(J!==null){J.return=v.return,ze=J;break e}ze=v.return}}var W=n.current;for(ze=W;ze!==null;){A=ze;var te=A.child;if((A.subtreeFlags&2064)!==0&&te!==null)te.return=A,ze=te;else e:for(A=W;ze!==null;){if(U=ze,(U.flags&2048)!==0)try{switch(U.tag){case 0:case 11:case 15:Wo(9,U)}}catch(Xe){Ot(U,U.return,Xe)}if(U===A){ze=null;break e}var be=U.sibling;if(be!==null){be.return=U.return,ze=be;break e}ze=U.return}}if(_t=h,tr(),ln&&typeof ln.onPostCommitFiberRoot=="function")try{ln.onPostCommitFiberRoot(et,n)}catch{}c=!0}return c}finally{Et=a,Wn.transition=i}}return!1}function pp(n,i,a){i=ws(a,i),i=Lh(n,i,1),n=ir(n,i,1),i=_n(),n!==null&&(ua(n,1,i),Tn(n,i))}function Ot(n,i,a){if(n.tag===3)pp(n,n,a);else for(;i!==null;){if(i.tag===3){pp(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(sr===null||!sr.has(c))){n=ws(a,n),n=Dh(i,n,1),i=ir(i,n,1),n=_n(),i!==null&&(ua(i,1,n),Tn(i,n));break}}i=i.return}}function z_(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=_n(),n.pingedLanes|=n.suspendedLanes&a,en===n&&(on&a)===a&&($t===4||$t===3&&(on&130023424)===on&&500>Ve()-wu?Or(n,0):Eu|=a),Tn(n,i)}function mp(n,i){i===0&&((n.mode&1)===0?i=1:(i=Pn,Pn<<=1,(Pn&130023424)===0&&(Pn=4194304)));var a=_n();n=bi(n,i),n!==null&&(ua(n,i,a),Tn(n,a))}function B_(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),mp(n,a)}function j_(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(a=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),mp(n,a)}var gp;gp=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Sn.current)En=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return En=!1,b_(n,i,a);En=(n.flags&131072)!==0}else En=!1,Ut&&(i.flags&1048576)!==0&&Yf(i,bo,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Vo(n,i),n=i.pendingProps;var h=gs(i,cn.current);Ms(i,a),h=tu(null,i,c,n,h,a);var v=nu();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Mn(c)?(v=!0,To(i)):v=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,qc(i),h.updater=jo,i.stateNode=h,h._reactInternals=i,lu(i,c,n,a),i=fu(null,i,c,!0,v,a)):(i.tag=0,Ut&&v&&kc(i),vn(null,i,h,a),i=i.child),i;case 16:c=i.elementType;e:{switch(Vo(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=V_(c),n=ei(c,n),h){case 0:i=du(null,i,c,n,a);break e;case 1:i=Hh(null,i,c,n,a);break e;case 11:i=Oh(null,i,c,n,a);break e;case 14:i=kh(null,i,c,ei(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),du(n,i,c,h,a);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Hh(n,i,c,h,a);case 3:e:{if(Vh(i),n===null)throw Error(t(387));c=i.pendingProps,v=i.memoizedState,h=v.element,rh(n,i),Uo(i,c,null,a);var A=i.memoizedState;if(c=A.element,v.isDehydrated)if(v={element:c,isDehydrated:!1,cache:A.cache,pendingSuspenseBoundaries:A.pendingSuspenseBoundaries,transitions:A.transitions},i.updateQueue.baseState=v,i.memoizedState=v,i.flags&256){h=ws(Error(t(423)),i),i=Gh(n,i,c,a,h);break e}else if(c!==h){h=ws(Error(t(424)),i),i=Gh(n,i,c,a,h);break e}else for(Un=Ji(i.stateNode.containerInfo.firstChild),Dn=i,Ut=!0,Qn=null,a=nh(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(xs(),c===h){i=Ni(n,i,a);break e}vn(n,i,c,a)}i=i.child}return i;case 5:return oh(i),n===null&&jc(i),c=i.type,h=i.pendingProps,v=n!==null?n.memoizedProps:null,A=h.children,Lc(c,h)?A=null:v!==null&&Lc(c,v)&&(i.flags|=32),jh(n,i),vn(n,i,A,a),i.child;case 6:return n===null&&jc(i),null;case 13:return Wh(n,i,a);case 4:return Yc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ys(i,null,c,a):vn(n,i,c,a),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Oh(n,i,c,h,a);case 7:return vn(n,i,i.pendingProps,a),i.child;case 8:return vn(n,i,i.pendingProps.children,a),i.child;case 12:return vn(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,v=i.memoizedProps,A=h.value,bt(Po,c._currentValue),c._currentValue=A,v!==null)if(Jn(v.value,A)){if(v.children===h.children&&!Sn.current){i=Ni(n,i,a);break e}}else for(v=i.child,v!==null&&(v.return=i);v!==null;){var U=v.dependencies;if(U!==null){A=v.child;for(var H=U.firstContext;H!==null;){if(H.context===c){if(v.tag===1){H=Ri(-1,a&-a),H.tag=2;var se=v.updateQueue;if(se!==null){se=se.shared;var Me=se.pending;Me===null?H.next=H:(H.next=Me.next,Me.next=H),se.pending=H}}v.lanes|=a,H=v.alternate,H!==null&&(H.lanes|=a),Xc(v.return,a,i),U.lanes|=a;break}H=H.next}}else if(v.tag===10)A=v.type===i.type?null:v.child;else if(v.tag===18){if(A=v.return,A===null)throw Error(t(341));A.lanes|=a,U=A.alternate,U!==null&&(U.lanes|=a),Xc(A,a,i),A=v.sibling}else A=v.child;if(A!==null)A.return=v;else for(A=v;A!==null;){if(A===i){A=null;break}if(v=A.sibling,v!==null){v.return=A.return,A=v;break}A=A.return}v=A}vn(n,i,h.children,a),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Ms(i,a),h=Vn(h),c=c(h),i.flags|=1,vn(n,i,c,a),i.child;case 14:return c=i.type,h=ei(c,i.pendingProps),h=ei(c.type,h),kh(n,i,c,h,a);case 15:return zh(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Vo(n,i),i.tag=1,Mn(c)?(n=!0,To(i)):n=!1,Ms(i,a),Nh(i,c,h),lu(i,c,h,a),fu(null,i,c,!0,n,a);case 19:return $h(n,i,a);case 22:return Bh(n,i,a)}throw Error(t(156,i.tag))};function vp(n,i){return We(n,i)}function H_(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xn(n,i,a,c){return new H_(n,i,a,c)}function Lu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function V_(n){if(typeof n=="function")return Lu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===G)return 11;if(n===Y)return 14}return 2}function cr(n,i){var a=n.alternate;return a===null?(a=Xn(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function el(n,i,a,c,h,v){var A=2;if(c=n,typeof n=="function")Lu(n)&&(A=1);else if(typeof n=="string")A=5;else e:switch(n){case L:return zr(a.children,h,v,i);case j:A=8,h|=8;break;case C:return n=Xn(12,a,i,h|2),n.elementType=C,n.lanes=v,n;case z:return n=Xn(13,a,i,h),n.elementType=z,n.lanes=v,n;case X:return n=Xn(19,a,i,h),n.elementType=X,n.lanes=v,n;case fe:return tl(a,h,v,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case T:A=10;break e;case V:A=9;break e;case G:A=11;break e;case Y:A=14;break e;case le:A=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=Xn(A,a,i,h),i.elementType=n,i.type=c,i.lanes=v,i}function zr(n,i,a,c){return n=Xn(7,n,c,i),n.lanes=a,n}function tl(n,i,a,c){return n=Xn(22,n,c,i),n.elementType=fe,n.lanes=a,n.stateNode={isHidden:!1},n}function Du(n,i,a){return n=Xn(6,n,null,i),n.lanes=a,n}function Uu(n,i,a){return i=Xn(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function G_(n,i,a,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=oc(0),this.expirationTimes=oc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=oc(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Iu(n,i,a,c,h,v,A,U,H){return n=new G_(n,i,a,U,H),i===1?(i=1,v===!0&&(i|=8)):i=0,v=Xn(3,null,null,i),n.current=v,v.stateNode=n,v.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},qc(v),n}function W_(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:I,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function _p(n){if(!n)return er;n=n._reactInternals;e:{if(P(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Mn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Mn(a))return Xf(n,a,i)}return i}function xp(n,i,a,c,h,v,A,U,H){return n=Iu(a,c,!0,n,h,v,A,U,H),n.context=_p(null),a=n.current,c=_n(),h=or(a),v=Ri(c,h),v.callback=i??null,ir(a,v,h),n.current.lanes=h,ua(n,h,c),Tn(n,c),n}function nl(n,i,a,c){var h=i.current,v=_n(),A=or(h);return a=_p(a),i.context===null?i.context=a:i.pendingContext=a,i=Ri(v,A),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ir(h,i,A),n!==null&&(ii(n,h,A,v),Do(n,h,A)),A}function il(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function yp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function Fu(n,i){yp(n,i),(n=n.alternate)&&yp(n,i)}function X_(){return null}var Sp=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ou(n){this._internalRoot=n}rl.prototype.render=Ou.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));nl(n,i,null,null)},rl.prototype.unmount=Ou.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Fr(function(){nl(null,n,null,null)}),i[wi]=null}};function rl(n){this._internalRoot=n}rl.prototype.unstable_scheduleHydration=function(n){if(n){var i=rf();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Yi.length&&i!==0&&i<Yi[a].priority;a++);Yi.splice(a,0,n),a===0&&of(n)}};function ku(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function sl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Mp(){}function $_(n,i,a,c,h){if(h){if(typeof c=="function"){var v=c;c=function(){var se=il(A);v.call(se)}}var A=xp(i,c,n,0,null,!1,!1,"",Mp);return n._reactRootContainer=A,n[wi]=A.current,wa(n.nodeType===8?n.parentNode:n),Fr(),A}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var U=c;c=function(){var se=il(H);U.call(se)}}var H=Iu(n,0,!1,null,null,!1,!1,"",Mp);return n._reactRootContainer=H,n[wi]=H.current,wa(n.nodeType===8?n.parentNode:n),Fr(function(){nl(i,H,a,c)}),H}function al(n,i,a,c,h){var v=a._reactRootContainer;if(v){var A=v;if(typeof h=="function"){var U=h;h=function(){var H=il(A);U.call(H)}}nl(i,A,n,h)}else A=$_(a,i,n,h,c);return il(A)}tf=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ei(i.pendingLanes);a!==0&&(lc(i,a|1),Tn(i,Ve()),(_t&6)===0&&(Cs=Ve()+500,tr()))}break;case 13:Fr(function(){var c=bi(n,1);if(c!==null){var h=_n();ii(c,n,1,h)}}),Fu(n,1)}},cc=function(n){if(n.tag===13){var i=bi(n,134217728);if(i!==null){var a=_n();ii(i,n,134217728,a)}Fu(n,134217728)}},nf=function(n){if(n.tag===13){var i=or(n),a=bi(n,i);if(a!==null){var c=_n();ii(a,n,i,c)}Fu(n,i)}},rf=function(){return Et},sf=function(n,i){var a=Et;try{return Et=n,i()}finally{Et=a}},me=function(n,i,a){switch(i){case"input":if(at(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var h=Eo(c);if(!h)throw Error(t(90));Ye(c),at(c,h)}}}break;case"textarea":Te(n,a);break;case"select":i=a.value,i!=null&&ue(n,!!a.multiple,i,!1)}},Vt=Ru,yt=Fr;var q_={usingClientEntryPoint:!1,Events:[Ca,ps,Eo,wt,Rt,Ru]},ja={findFiberByHostInstance:br,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Y_={bundleType:ja.bundleType,version:ja.version,rendererPackageName:ja.rendererPackageName,rendererConfig:ja.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:D.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=ie(n),n===null?null:n.stateNode},findFiberByHostInstance:ja.findFiberByHostInstance||X_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ol=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ol.isDisabled&&ol.supportsFiber)try{et=ol.inject(Y_),ln=ol}catch{}}return An.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=q_,An.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ku(i))throw Error(t(200));return W_(n,i,null,a)},An.createRoot=function(n,i){if(!ku(n))throw Error(t(299));var a=!1,c="",h=Sp;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Iu(n,1,!1,null,null,a,!1,c,h),n[wi]=i.current,wa(n.nodeType===8?n.parentNode:n),new Ou(i)},An.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=ie(i),n=n===null?null:n.stateNode,n},An.flushSync=function(n){return Fr(n)},An.hydrate=function(n,i,a){if(!sl(i))throw Error(t(200));return al(null,n,i,!0,a)},An.hydrateRoot=function(n,i,a){if(!ku(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,h=!1,v="",A=Sp;if(a!=null&&(a.unstable_strictMode===!0&&(h=!0),a.identifierPrefix!==void 0&&(v=a.identifierPrefix),a.onRecoverableError!==void 0&&(A=a.onRecoverableError)),i=xp(i,null,n,1,a??null,h,!1,v,A),n[wi]=i.current,wa(n),c)for(n=0;n<c.length;n++)a=c[n],h=a._getVersion,h=h(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,h]:i.mutableSourceEagerHydrationData.push(a,h);return new rl(i)},An.render=function(n,i,a){if(!sl(i))throw Error(t(200));return al(null,n,i,!1,a)},An.unmountComponentAtNode=function(n){if(!sl(n))throw Error(t(40));return n._reactRootContainer?(Fr(function(){al(null,null,n,!1,function(){n._reactRootContainer=null,n[wi]=null})}),!0):!1},An.unstable_batchedUpdates=Ru,An.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!sl(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return al(n,i,a,!1,c)},An.version="18.3.1-next-f1338f8080-20240426",An}var Np;function ox(){if(Np)return ju.exports;Np=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),ju.exports=ax(),ju.exports}var Pp;function lx(){if(Pp)return ll;Pp=1;var r=ox();return ll.createRoot=r.createRoot,ll.hydrateRoot=r.hydrateRoot,ll}var cx=lx();const Yl="/api/3dprint";class ux extends Error{constructor(t,s,o){super(t);Rs(this,"status");Rs(this,"code");Rs(this,"date");Rs(this,"reservations");this.status=s,this.code=o==null?void 0:o.code,this.date=o==null?void 0:o.date,this.reservations=o==null?void 0:o.reservations}}async function pt(r,e){const t=await fetch(`${Yl}/${r}`,{credentials:"include",...e,headers:{"Content-Type":"application/json",...e==null?void 0:e.headers}}),s=await t.json().catch(()=>({}));if(!t.ok)throw new ux(s.error||`HTTP ${t.status}`,t.status,s);return s}async function dx(){const r=await fetch("/api/apps/3dprint-management/access",{credentials:"include"});return r.status===401?"login":r.status===403?"denied":r.ok?"ok":"denied"}function _g(r){return{id:r.id,date:r.date,machine:r.machine,kind:r.kind,start:r.start,end:r.end,title:r.title,file:r.file,fileSize:r.file_size,note:r.note,who:r.who,status:r.status,createdAt:r.created_at,adminNote:r.status_comment??void 0,printer_id:r.printer_id}}async function fx(r,e){return{applications:(await pt(`admin/calendar/cancelled-applications?from=${r}&to=${e}`)).applications.map(s=>_g(s))}}async function hx(r){return pt(`admin/reservations/${r}/restore`,{method:"POST",body:"{}"})}async function px(r,e){const t=await pt(`calendar/applications?from=${r}&to=${e}`);return{applications:t.applications.map(s=>_g(s)),staff_dates:t.staff_dates??{}}}async function mx(){return(await pt("admin/members")).members.map(e=>({id:e.id,name:e.name,homeroom:e.homeroom,student_number:e.student_number,color_index:e.color_index,discord_user_id:e.discord_user_id,user_id:e.user_id??null}))}async function Lp(){return pt("admin/session")}async function gx(){return(await pt("admin/management-users")).users}async function vx(r,e){return pt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({user_id:e})})}async function _x(r){return pt("admin/members",{method:"POST",body:JSON.stringify(r)})}async function xx(r){return pt(`admin/members/${r}`,{method:"DELETE"})}function cl(r){return`${r.member_id}\0${r.date}`}function ul(r){return`${r.printer_id}\0${r.date}`}function Dp(r){const e=new Map;for(const t of r){const s=e.get(t.member_id)??[];s.push(t.date),e.set(t.member_id,s)}return e}function Up(r){const e=new Map;for(const t of r){const s=e.get(t.printer_id)??[];s.push(t.date),e.set(t.printer_id,s)}return e}function xg(r,e){const t=new Set(r.map(cl)),s=new Set(e.map(cl)),o=e.filter(u=>!t.has(cl(u))),l=r.filter(u=>!s.has(cl(u)));return{added:o,removed:l}}function yg(r,e){const t=new Set(r.map(ul)),s=new Set(e.map(ul)),o=e.filter(u=>!t.has(ul(u))),l=r.filter(u=>!s.has(ul(u)));return{added:o,removed:l}}function yx(r,e,t,s){const o=xg(r,e),l=yg(t,s);return o.added.length+o.removed.length+l.added.length+l.removed.length>0}async function Sx(r,e,t,s){const o=xg(r,e),l=yg(t,s);for(const[u,f]of Dp(o.removed))await Fp(u,f,!1);for(const[u,f]of Up(l.removed))await Op(u,f,!1);for(const[u,f]of Dp(o.added))await Fp(u,f,!0);for(const[u,f]of Up(l.added))await Op(u,f,!0)}async function Ip(r,e){return pt(`admin/shifts?year=${r}&month=${e}`)}async function Fp(r,e,t){return pt("admin/shifts/availability",{method:"PUT",body:JSON.stringify({member_id:r,dates:e,available:t})})}async function Mx(r,e){return pt(`admin/reservations/${r}/accept`,{method:"POST",body:JSON.stringify({print_staff_member_id:e})})}async function Td(r,e){return pt(`admin/reservations/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Ex(){return pt("admin/calendar/status")}function wx(r){return`${Yl}/admin/stl/${r}`}async function Tx(){return(await pt("admin/reservations")).reservations}async function Sg(){return pt("admin/printers")}async function zd(r,e,t="POST"){const s=await fetch(`${Yl}/${r}`,{method:t,credentials:"include",body:e}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error||`HTTP ${s.status}`);return o}async function Ax(r,e){const t=new FormData;return t.append("name",r),e&&t.append("image",e),zd("admin/printers",t)}async function Cx(r,e){return pt(`admin/printers/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function bx(r,e){const t=new FormData;return t.append("image",e),zd(`admin/printers/${r}/image`,t,"PUT")}async function Rx(r){return pt(`admin/printers/${r}`,{method:"DELETE"})}async function Nx(r,e){return pt(`admin/calendar/availability?date=${r}`)}async function Px(r){return pt("admin/reservations/force",{method:"POST",body:JSON.stringify(r)})}async function Op(r,e,t){return pt("admin/shifts/printer-availability",{method:"PUT",body:JSON.stringify({printer_id:r,dates:e,available:t})})}async function Lx(r,e,t=!1){return pt(`admin/reservations/${r}/reschedule`,{method:"PATCH",body:JSON.stringify({desired_date:e,force:t})})}async function Dx(r,e){return pt(`admin/applications/${r}/split-slots`,{method:"POST",body:JSON.stringify(e)})}async function Ux(){return pt("admin/integrations/status")}async function Ix(){return pt("admin/integrations/discord/test",{method:"POST",body:"{}"})}async function Fx(r){const e=r.map(t=>t.trim()).filter(Boolean);if(!e.length)throw new Error("メンションする担当者を1人以上選んでください");return pt("admin/integrations/discord/test-mention",{method:"POST",body:JSON.stringify({member_ids:e})})}async function Ox(r){const e=r.trim();if(!e)throw new Error("送信先メールアドレスを入力してください");return pt("admin/settings/test-email",{method:"POST",body:JSON.stringify({to:e})})}async function kx(r){return pt("admin/log",{method:"POST",body:JSON.stringify(r)})}async function zx(r=100){return pt(`admin/log?limit=${r}`)}async function Bx(r){return pt("admin/reservations",{method:"POST",body:JSON.stringify(r)})}async function jx(r){return pt(`admin/settings/storage-list?path=${encodeURIComponent(r)}`)}async function Hx(r,e){return pt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({color_index:e})})}async function Vx(r,e){return pt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({discord_user_id:e})})}async function Gx(){return pt("admin/settings/print-video")}async function Wx(r){return pt("admin/settings/print-video",{method:"PATCH",body:JSON.stringify({storage_path:r})})}async function Xx(r,e){const t=new FormData;return t.append("video",e),zd(`admin/reservations/${r}/print-video`,t)}async function $x(r){return pt(`admin/reservations/${r}/print-video`,{method:"DELETE"})}function qx(r){return`${Yl}/admin/reservations/${r}/print-video/download`}const Mg=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC"}],Za=Mg.map(r=>r.id),xi={};Mg.forEach(r=>{xi[r.id]=r});const wr=["日","月","火","水","木","金","土"],Bd=360,Js=30,kp=28,Eg=990,Yx=1200,zp=(Eg-Bd)/Js,Kx=7,Qs={pending:"申請中",approved:"確定",done:"完了",cancelled:"取り消し"},yi={request:"依頼",reserve:"予約"},Bp=[{id:"machine",label:"機材の不調",body:"プリンターの不調により、この時間帯の印刷を中止しました。"},{id:"maintenance",label:"メンテナンス",body:"メンテナンスのため、この時間帯の受付を停止しました。"},{id:"duplicate",label:"重複申請",body:"同じ時間帯に別の申請が確定しているため、こちらを取り消しました。"},{id:"no_show",label:"連絡なしの未実施",body:"開始時刻を過ぎても実施が確認できなかったため取り消しました。"}],jp=[{id:"stl",label:"STLの不備",body:"STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。"},{id:"size",label:"サイズ超過",body:"造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。"},{id:"deadline",label:"締切超過",body:"印刷依頼の受付は前日までです。当日の依頼は受け付けられません。"},{id:"time",label:"時間不足",body:"この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。"}],Zx=["16:20までに物理実験室へ来てください。","フィラメントは白PLAを使用します。","サポート材を付けています。剥がす作業もお願いします。"],kn=r=>String(r).padStart(2,"0"),Yn=r=>r.getFullYear()+"-"+kn(r.getMonth()+1)+"-"+kn(r.getDate()),zn=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},zl=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},Bl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},wg=r=>zl(Bl(r),-r.getDay()),Hp=r=>r.getMonth()+1+"/"+r.getDate(),li=Yn(Bl(new Date)),Jx=()=>zn(li),Ad=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()},Tg=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()+"（"+wr[e.getDay()]+"）"},Ja=r=>Bd+r*Js,qt=r=>kn(Math.floor(r/60))+":"+kn(r%60),Kl=r=>{const e=Math.floor(r/60),t=r%60;return e&&t?e+"時間"+t+"分":e?e+"時間":t+"分"},Vp=r=>Math.round((r-Bd)/Js),mn=r=>r.kind==="request"?{start:Eg,end:Yx,s:zp,e:zp+Kx}:{start:r.start,end:r.end,s:Vp(r.start),e:Vp(r.end)},Gp=(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+"0"+t);return r})(),ji=r=>r?String(r).slice(0,1)+"年"+String(r).slice(1)+"HR":"—",Kr=["#f38020","#3b74e0","#1f9d55","#9a4a07","#7c5cbf","#b4776b","#2f8f8f"],Ag=[{id:"m1",name:"金田",hr:"203",num:12,discord:"",color:"#f38020"},{id:"m2",name:"田村",hr:"201",num:3,discord:"",color:"#3b74e0"},{id:"m3",name:"藤原",hr:"104",num:21,discord:"",color:"#1f9d55"}];let Zl=Ag.slice();const Qx=r=>{Zl=(r&&r.length?r:Ag).slice()},e0=()=>Zl,Qr=r=>Zl.find(e=>e.id===r)||null,jd=r=>{const e=Qr(r);return e?e.name:null},t0=r=>{const e=Qr(r);return e?e.color:"var(--color-text-faint)"},n0=r=>{const e=Qr(r);return e?`${e.name}（${ji(e.hr)}・${e.num}番）`:"—"};let Cg={};const dl=r=>{Cg=r||{}},qa=(r,e)=>(Cg[r]||[]).indexOf(e)>=0,eo=r=>Zl.filter(e=>qa(e.id,r)).map(e=>e.id),bg=r=>eo(r).map(e=>jd(e)),i0=r=>r.filter(e=>e.status==="pending").sort((e,t)=>(e.date+kn(Math.floor(mn(e).start/60))).localeCompare(t.date+kn(Math.floor(mn(t).start/60)))),r0=r=>r.kind==="request"&&r.date<=li,s0=r=>r==="pending"||r==="approved";function a0(r,e){const t=r.filter(o=>o.date===e),s={};return Za.forEach(o=>{const l=new Array(kp).fill(null);t.filter(u=>u.machine===o&&s0(u.status)).forEach(u=>{const f=mn(u);for(let m=Math.max(0,f.s);m<Math.min(kp,f.e);m++)l[m]=u}),s[o]=l}),{list:t,machines:s}}function Rg(r,e){const t=r.filter(o=>o.date===e),s=t.filter(o=>o.status!=="cancelled");return{all:t,live:s,requests:s.filter(o=>o.kind==="request"),reserves:s.filter(o=>o.kind==="reserve"),pending:s.filter(o=>o.status==="pending").length,cancelled:t.filter(o=>o.status==="cancelled")}}function Ng(r,e,t,s){const o=mn(e),l=a0(r,t),u=l.machines[e.machine];let f=0;for(let g=o.s;g<o.e;g++){const y=u[g];y&&y.id!==e.id&&f++}const m=o.e-o.s,p=eo(t);return{date:t,total:m,used:f,free:m-f,full:f>=m,staffs:p,noStaff:p.length===0,past:t<li,sameDay:t===e.date,liveCount:l.list.filter(g=>g.status!=="cancelled").length}}function o0(r,e){const s=new Date(r,e-1,1).getDay(),o=new Date(r,e,0).getDate(),l=[];for(let u=0;u<s;u++)l.push(null);for(let u=1;u<=o;u++)l.push(new Date(r,e-1,u));for(;l.length%7!==0;)l.push(null);return l}function Hd(r){const e=mn(r),t=[];for(let s=e.s;s<e.e;s++)t.push(s);return t}function Vd(r,e){try{const t=localStorage.getItem(r);return t?JSON.parse(t):e}catch{return e}}function Gd(r,e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}const ra={prefs:"sh3dm.prefs.v1",log:"sh3dm.log.v1",integ:"sh3dm.integrations.v1"},Pg=()=>Vd(ra.prefs,{}),l0=r=>Gd(ra.prefs,Object.assign(Pg(),r)),c0=()=>Vd(ra.log,[]),u0=r=>Gd(ra.log,r),fl={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,cancelled:!0},dailyMention:!0},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}},d0=()=>{const r=Vd(ra.integ,null);return r?{discord:{...fl.discord,...r.discord||{},events:{...fl.discord.events,...(r.discord||{}).events||{}}},gcal:{...fl.gcal,...r.gcal||{}}}:JSON.parse(JSON.stringify(fl))},f0=r=>Gd(ra.integ,r),Lg=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE",hint:"小物・精度重視"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC",hint:"大型・タイムラプス"}];Lg.map(r=>r.id);const h0=Object.fromEntries(Lg.map(r=>[r.id,r])),Dg=["日","月","火","水","木","金","土"],Wd=360,Xd=30,Ug=990,Ig=1200,p0=(Ug-Wd)/Xd,m0=(Ig-Wd)/Xd,g0={pending:"申請中",approved:"確定",rejected:"却下",done:"完了"},v0={request:"依頼",reserve:"予約"},es=r=>String(r).padStart(2,"0"),Cd=r=>r.getFullYear()+"-"+es(r.getMonth()+1)+"-"+es(r.getDate()),ts=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},Fg=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},jl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},_0=r=>Fg(jl(r),-r.getDay()),Wp=r=>es(Math.floor(r/60))+":"+es(r%60),Xp=r=>Math.round((r-Wd)/Xd),x0=r=>r.kind==="request"?{start:Ug,end:Ig,s:p0,e:m0}:{start:r.start,end:r.end,s:Xp(r.start),e:Xp(r.end)};(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+es(t));return r})();const y0=Cd(jl(new Date)),S0=()=>ts(y0),Og=r=>{const e=ts(r);return e.getMonth()+1+"/"+e.getDate()},hl=r=>{const e=ts(r);return Og(r)+"（"+Dg[e.getDay()]+"）"};function M0(r,e){var t;return e?((t=r.find(s=>s.id===e))==null?void 0:t.name)??null:null}function E0(r,e,t,s,o){const l=r.filter(p=>p.date>=e&&p.date<=t).sort((p,g)=>(p.date+String(p.start)).localeCompare(g.date+String(g.start))),u=["日付","曜日","開始","終了","機種","種別","作品名","申請者","学年HR","番号","状態","印刷データ","サイズ(MB)","備考","担当"],f=p=>{const g=String(p??"");return/[",\n]/.test(g)?'"'+g.replace(/"/g,'""')+'"':g},m=[u.join(",")];return l.forEach(p=>{const g=x0(p),y=ts(p.date),_=o[p.date];m.push([p.date,Dg[y.getDay()],Wp(g.start),Wp(g.end),h0[p.machine].name,v0[p.kind],p.title,p.who.name,p.who.hr,p.who.num,g0[p.status],p.file,p.fileSize?(p.fileSize/1048576).toFixed(2):"",p.note,_&&M0(s,_)||""].map(f).join(","))}),"\uFEFF"+m.join(`\r
`)}const w0={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,rejected:!0},mention:""},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}};function T0(r){return r.map(e=>({id:e.id,name:e.name,hr:e.homeroom??"",num:e.student_number??0,discord:e.discord_user_id??"",color:Kr[(e.color_index??0)%Kr.length],userId:e.user_id??null}))}function A0(r){const e=Kr.indexOf(r);return e>=0?e:0}function C0(r){return r==="rejected"?"cancelled":r}function b0(r){switch(r){case"pending":return"applied";case"approved":return"accepted";case"done":return"delivered";case"cancelled":return"cancelled";default:return"applied"}}function $p(r){return{...r,status:C0(r.status)}}function R0(r){const e=Cd(_0(ts(r))),t=Cd(Fg(ts(e),27));return{from:e,to:t}}function kg(r){const e={};for(const t of r)e[t.member_id]||(e[t.member_id]=[]),e[t.member_id].push(t.date);for(const t of Object.keys(e))e[t].sort();return e}function pl(r){const e=[];for(const[t,s]of Object.entries(r))for(const o of s)e.push({member_id:t,date:o});return e}function N0(r,e,t){const s=ts(r);return s.getFullYear()===e&&s.getMonth()+1===t}function P0(r,e,t,s){const o=kg(e),l=new Set([...Object.keys(r),...Object.keys(o)]),u={};for(const f of l){const m=(r[f]||[]).filter(g=>!N0(g,t,s)),p=o[f]||[];u[f]=[...new Set([...m,...p])].sort()}return u}function L0(r,e){return e&&r.some(t=>t.id===e)?e:null}function D0(r){return r.linked_member?`${r.user.display_name}（印刷担当: ${r.linked_member.name}）`:r.user.display_name}function U0(){return JSON.parse(JSON.stringify(w0))}function I0(r,e,t,s){const o=r.map(l=>({...l,status:l.status==="cancelled"?"rejected":l.status}));return E0(o,e,t,s)}const zg="/apps/3dprint-management/assets/icon-192.png",F0=r=>r==="ke"?"var(--color-primary)":"var(--color-tip)";function O0({id:r,size:e}){return d.jsx("span",{className:"dot",style:{background:F0(r),width:e||6,height:e||6}})}function qs({kind:r,size:e}){return d.jsxs("span",{className:"kbadge "+r+(e==="sm"?" sm":""),children:[d.jsx("span",{className:"kmark"}),yi[r]]})}function Gu(){return d.jsx("span",{"aria-hidden":"true",className:"dlic",children:"↓"})}function k0(r,e){const t=mn(r);if(e==="file"){const l=r.file||`${r.title}.stl`,u=["ScienceHUB 3Dプリント — 印刷データ","",`ファイル名: ${l}`,`作品名: ${r.title}`,`申請者: ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`機種: ${xi[r.machine].name}`,`種別: ${yi[r.kind]}`,`日付: ${r.date}`,`時間: ${qt(t.start)}〜${qt(t.end)}`,`サイズ: ${r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":"—"}`,"","※ このファイルはデザイン確認用のプレースホルダです。本番では署名付きURLから取得します。"].join(`\r
`);bd(l.replace(/\.[^.]+$/,"")+".txt",u);return}const s=["ScienceHUB 3Dプリント 申請書","=============================",`作品名      : ${r.title}`,`日付        : ${r.date}（${wr[zn(r.date).getDay()]}）`,`時間        : ${qt(t.start)}〜${qt(t.end)}（${Kl(t.end-t.start)}）`,`機種        : ${xi[r.machine].name}（${xi[r.machine].maker}）`,`種別        : ${yi[r.kind]}${r.kind==="request"?"（依頼枠を丸ごと占有）":"（データ提出なし）"}`,`状態        : ${Qs[r.status]}`,`担当        : ${bg(r.date).join(" / ")||"休み"}`,`申請者      : ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`印刷データ  : ${r.file||"—"}${r.fileSize?"（"+(r.fileSize/1048576).toFixed(2)+" MB）":""}`,`備考        : ${r.note||"—"}`,`担当者メモ  : ${r.adminNote||"—"}`,"","出力: ScienceHUB 3Dプリント管理"],o=`${r.date}_${r.title.split(/[\\/:*?"<>|]/).join("_")}.txt`;bd(o,s.join(`\r
`))}function bd(r,e){const t=new Blob(["\uFEFF"+e],{type:"text/plain;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a");o.href=s,o.download=r,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function z0(r,e){const t=r.filter(l=>l.date===e).sort((l,u)=>mn(l).start-mn(u).start||Za.indexOf(l.machine)-Za.indexOf(u.machine)),s=bg(e).join(" / ")||"休み",o=[`ScienceHUB 3Dプリント 申請一覧 — ${e}（${wr[zn(e).getDay()]}）`,`担当: ${s}`,`件数: ${t.length}`,"=".repeat(48)];return t.forEach((l,u)=>{const f=mn(l);o.push("",`[${u+1}] ${l.title}`,`  時間   : ${qt(f.start)}〜${qt(f.end)}（${Kl(f.end-f.start)}）`,`  機種   : ${xi[l.machine].name}`,`  種別   : ${yi[l.kind]}`,`  状態   : ${Qs[l.status]}`,`  申請者 : ${l.who.name}（${ji(l.who.hr)}・${l.who.num}番）`,`  データ : ${l.file||"—"}`,`  備考   : ${l.note||"—"}`)}),bd(`${e}_申請一覧.txt`,o.join(`\r
`)),t.length}function Rd({status:r}){return d.jsx("span",{className:"tag "+r,children:Qs[r]})}function Hl({tone:r,children:e}){return d.jsx("span",{className:"chip"+(r?" "+r:""),children:e})}function B0({id:r,small:e}){const t=Qr(r);return t?d.jsxs("span",{className:"mtag"+(e?" sm":""),children:[d.jsx("span",{className:"mtag-av",style:{background:t.color},children:t.name.slice(0,1)}),t.name]}):d.jsx("span",{className:"mtag none",children:"休み"})}function j0(r){if(!r)return"—";const e=new Date(r),t=Bl(Jx()),s=Math.round((t-Bl(e))/864e5),o=kn(e.getHours())+":"+kn(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}const H0=r=>{const e=new Date(r);return kn(e.getHours())+":"+kn(e.getMinutes())};function V0({screen:r,setScreen:e,operatorSession:t,pendingCount:s,onCsv:o}){return d.jsx("header",{className:"site-header",children:d.jsxs("div",{className:"header-inner",children:[d.jsxs("a",{className:"brand",href:"/",children:[d.jsx("img",{src:zg,alt:""}),"ScienceHUB",d.jsx("span",{className:"sep"}),d.jsx("span",{className:"crumb",children:"3Dプリント管理"})]}),d.jsx("span",{className:"adm-pill",children:"管理者"}),d.jsxs("nav",{className:"screens","aria-label":"画面",children:[d.jsxs("button",{type:"button","aria-current":r==="reserve"?"page":void 0,className:r==="reserve"?"on":"",onClick:()=>e("reserve"),children:["申請の管理",s>0&&d.jsx("span",{className:"nav-count num",children:s})]}),d.jsx("button",{type:"button","aria-current":r==="settings"?"page":void 0,className:r==="settings"?"on":"",onClick:()=>e("settings"),children:"シフト・設定"}),d.jsx("button",{type:"button","aria-current":r==="ops"?"page":void 0,className:r==="ops"?"on":"",onClick:()=>e("ops"),children:"運用"})]}),d.jsxs("div",{className:"hdr-right",children:[d.jsxs("div",{className:"actor actor-readonly",title:(t==null?void 0:t.user.username)??"",children:[d.jsx("span",{children:"ログイン"}),d.jsx("strong",{children:(t==null?void 0:t.user.display_name)??"—"}),t!=null&&t.linked_member?d.jsxs("span",{className:"actor-staff",children:["／印刷担当 ",t.linked_member.name]}):d.jsx("span",{className:"actor-staff actor-staff-warn",children:"／印刷担当未紐づけ"})]}),r==="reserve"&&d.jsx("button",{type:"button",className:"hdr-link",onClick:o,children:"CSV出力"}),d.jsx("a",{className:"hdr-link",href:"/apps/3dprint-reservation/",children:"申請フォーム"})]})]})})}function G0(r,e){const t=Rg(r,e);return{req:t.requests.length,res:t.reserves.length,pending:t.pending}}function W0({d:r,ds:e,apps:t,staffIds:s,selected:o,onPick:l,dense:u}){const f=r.getDay(),m=G0(t,e),p=["day"];return f===0&&p.push("sun"),f===6&&p.push("sat"),e===li&&p.push("today"),e===o&&p.push("sel"),s.length||p.push("closed"),d.jsxs("button",{type:"button",className:p.join(" "),onClick:()=>l(e),"aria-pressed":e===o,"aria-label":`${r.getMonth()+1}月${r.getDate()}日 依頼${m.req}件 予約${m.res}件 ${s.length?"担当あり":"担当なし"}`,children:[d.jsxs("span",{className:"d-top",children:[d.jsx("span",{className:"d num",children:r.getDate()}),d.jsx("span",{className:"d-staffflag"+(s.length?" on":""),children:s.length?"担当あり":"休み"})]}),d.jsxs("span",{className:"c-kinds",children:[d.jsxs("span",{className:"c-k req"+(m.req?"":" zero"),children:[d.jsx("i",{}),"依頼",d.jsx("b",{className:"num",children:m.req})]}),d.jsxs("span",{className:"c-k res"+(m.res?"":" zero"),children:[d.jsx("i",{}),"予約",d.jsx("b",{className:"num",children:m.res})]})]}),m.pending>0&&d.jsx("span",{className:"c-pend",children:d.jsxs("span",{className:"pend num",children:["申請中 ",m.pending]})})]})}function X0({apps:r,avail:e,selected:t,onPick:s}){const o=wg(zn(t)),l=[];for(let _=0;_<4;_++){const M=[];for(let E=0;E<7;E++)M.push(zl(o,_*7+E));l.push(M)}const u=l.flat(),f=u[u.length-1],p=u[0].getMonth()===f.getMonth()?`${u[0].getFullYear()}年 ${kn(u[0].getMonth()+1)}月`:`${kn(u[0].getMonth()+1)}月 → ${kn(f.getMonth()+1)}月`,g=u.map(Yn);r.filter(_=>g.indexOf(_.date)>=0&&_.status!=="cancelled");const y=_=>s(Yn(zl(zn(t),_*28)));return d.jsxs("div",{className:"card cal-card",children:[d.jsxs("div",{className:"cal-head",children:[d.jsx("div",{className:"cal-month",children:d.jsx("span",{children:p})}),d.jsx("div",{className:"cal-nav",children:d.jsx("button",{type:"button",className:"cal-today",onClick:()=>s(li),children:"今日"})})]}),d.jsxs("div",{className:"cal-body",children:[d.jsxs("button",{type:"button",className:"cal-side prev",onClick:()=>y(-1),"aria-label":"前の4週間",children:[d.jsx("span",{"aria-hidden":"true",children:"‹"}),d.jsx("span",{className:"cal-side-lbl",children:"前へ"})]}),d.jsxs("div",{className:"cal-main",children:[d.jsx("div",{className:"cal-wds",children:wr.map((_,M)=>d.jsx("div",{className:"cal-wd"+(M===0?" sun":M===6?" sat":""),children:_},_))}),d.jsx("div",{className:"cal-grid",children:l.map(_=>_.map(M=>{const E=Yn(M);return d.jsx(W0,{d:M,ds:E,apps:r,staffIds:eo(E),selected:E===t,onPick:s},E)}))})]}),d.jsxs("button",{type:"button",className:"cal-side next",onClick:()=>y(1),"aria-label":"次の4週間",children:[d.jsx("span",{"aria-hidden":"true",children:"›"}),d.jsx("span",{className:"cal-side-lbl",children:"次へ"})]})]}),d.jsxs("div",{className:"cal-legend",children:[d.jsx("span",{className:"lg",children:d.jsx(qs,{kind:"request",size:"sm"})}),d.jsx("span",{className:"lg",children:"STLを提出して印刷枠を使う"}),d.jsx("span",{className:"lg",children:d.jsx(qs,{kind:"reserve",size:"sm"})}),d.jsx("span",{className:"lg",children:"プリンターの時間だけ確保"}),d.jsx("span",{className:"lg lg-right",children:"日付をクリックすると、その日の申請が右に出ます"})]})]})}function $0({open:r,title:e,sub:t,onClose:s,children:o,footer:l}){return xe.useEffect(()=>{if(!r)return;const u=f=>{f.key==="Escape"&&s()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[r,s]),d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),d.jsxs("aside",{className:"sheet"+(r?" on":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[d.jsxs("div",{className:"sheet-h",children:[d.jsxs("div",{style:{minWidth:0},children:[d.jsx("h2",{children:e}),t&&d.jsx("p",{children:t})]}),d.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),d.jsx("div",{className:"sheet-b",children:r?o:null}),l&&d.jsx("div",{className:"sheet-f",children:l})]})]})}function q0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:u}){return xe.useEffect(()=>{if(!r)return;const f=m=>{m.key==="Escape"&&s()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[r,s]),r?d.jsxs("div",{className:"modal-wrap",role:"dialog","aria-modal":"true","aria-label":e,children:[d.jsx("div",{className:"modal-scrim",onClick:s}),d.jsxs("div",{className:"modal"+(u?" wide":""),children:[d.jsxs("div",{className:"modal-h",children:[d.jsxs("div",{children:[d.jsx("h2",{children:e}),t&&d.jsx("p",{children:t})]}),d.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),d.jsx("div",{className:"modal-b",children:o}),l&&d.jsx("div",{className:"modal-f",children:l})]})]}):null}function Y0({toast:r}){return d.jsx("div",{className:"toast"+(r?" show":""),role:"status","aria-live":"polite",children:r&&d.jsxs(d.Fragment,{children:[r.text,r.mark&&d.jsx("b",{children:r.mark})]})})}function K0(r){if(!r)return"—";const e=new Date(r),t=jl(S0()),s=Math.round((t-jl(e))/864e5),o=es(e.getHours())+":"+es(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}function Z0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:u,tabs:f}){return xe.useEffect(()=>{if(!r)return;const m=p=>{p.key==="Escape"&&s()};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[r,s]),d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),d.jsxs("aside",{className:"sheet"+(r?" on":"")+(u?" wide":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[d.jsxs("div",{className:"sheet-h",children:[d.jsxs("div",{style:{minWidth:0},children:[d.jsx("h2",{children:e}),t&&d.jsx("p",{children:t})]}),d.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),f,d.jsx("div",{className:"sheet-b",children:r?o:null}),l&&d.jsx("div",{className:"sheet-f",children:l})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $d="164",J0=0,qp=1,Q0=2,Bg=1,ey=2,ki=3,Sr=0,Rn=1,mi=2,xr=0,Ys=1,Yp=2,Kp=3,Zp=4,ty=5,qr=100,ny=101,iy=102,ry=103,sy=104,ay=200,oy=201,ly=202,cy=203,Nd=204,Pd=205,uy=206,dy=207,fy=208,hy=209,py=210,my=211,gy=212,vy=213,_y=214,xy=0,yy=1,Sy=2,Vl=3,My=4,Ey=5,wy=6,Ty=7,jg=0,Ay=1,Cy=2,yr=0,by=1,Ry=2,Ny=3,Py=4,Ly=5,Dy=6,Uy=7,Hg=300,ea=301,ta=302,Ld=303,Dd=304,Jl=306,Ud=1e3,Zr=1001,Id=1002,Kn=1003,Iy=1004,ml=1005,oi=1006,Wu=1007,Jr=1008,Mr=1009,Fy=1010,Oy=1011,Vg=1012,Gg=1013,na=1014,_r=1015,Ql=1016,Wg=1017,Xg=1018,to=1020,ky=35902,zy=1021,By=1022,vi=1023,jy=1024,Hy=1025,Ks=1026,Qa=1027,Vy=1028,$g=1029,Gy=1030,qg=1031,Yg=1033,Xu=33776,$u=33777,qu=33778,Yu=33779,Jp=35840,Qp=35841,em=35842,tm=35843,nm=36196,im=37492,rm=37496,sm=37808,am=37809,om=37810,lm=37811,cm=37812,um=37813,dm=37814,fm=37815,hm=37816,pm=37817,mm=37818,gm=37819,vm=37820,_m=37821,Ku=36492,xm=36494,ym=36495,Wy=36283,Sm=36284,Mm=36285,Em=36286,Xy=3200,$y=3201,Kg=0,qy=1,vr="",hi="srgb",Tr="srgb-linear",qd="display-p3",ec="display-p3-linear",Gl="linear",Lt="srgb",Wl="rec709",Xl="p3",Ns=7680,wm=519,Yy=512,Ky=513,Zy=514,Zg=515,Jy=516,Qy=517,eS=518,tS=519,Tm=35044,Am="300 es",zi=2e3,$l=2001;class sa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(t)===-1&&s[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const o=s.slice(0);for(let l=0,u=o.length;l<u;l++)o[l].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zu=Math.PI/180,Fd=180/Math.PI;function no(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(hn[r&255]+hn[r>>8&255]+hn[r>>16&255]+hn[r>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[s&255]+hn[s>>8&255]+hn[s>>16&255]+hn[s>>24&255]).toLowerCase()}function bn(r,e,t){return Math.max(e,Math.min(t,r))}function nS(r,e){return(r%e+e)%e}function Ju(r,e,t){return(1-t)*r+t*e}function Va(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Cn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class xt{constructor(e=0,t=0){xt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,s=this.y,o=e.elements;return this.x=o[0]*t+o[3]*s+o[6],this.y=o[1]*t+o[4]*s+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(bn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y;return t*t+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const s=Math.cos(t),o=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*s-u*o+e.x,this.y=l*o+u*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ct{constructor(e,t,s,o,l,u,f,m,p){ct.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,u,f,m,p)}set(e,t,s,o,l,u,f,m,p){const g=this.elements;return g[0]=e,g[1]=o,g[2]=f,g[3]=t,g[4]=l,g[5]=m,g[6]=s,g[7]=u,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],this}extractBasis(e,t,s){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,u=s[0],f=s[3],m=s[6],p=s[1],g=s[4],y=s[7],_=s[2],M=s[5],E=s[8],w=o[0],S=o[3],x=o[6],b=o[1],R=o[4],D=o[7],$=o[2],I=o[5],L=o[8];return l[0]=u*w+f*b+m*$,l[3]=u*S+f*R+m*I,l[6]=u*x+f*D+m*L,l[1]=p*w+g*b+y*$,l[4]=p*S+g*R+y*I,l[7]=p*x+g*D+y*L,l[2]=_*w+M*b+E*$,l[5]=_*S+M*R+E*I,l[8]=_*x+M*D+E*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],f=e[5],m=e[6],p=e[7],g=e[8];return t*u*g-t*f*p-s*l*g+s*f*m+o*l*p-o*u*m}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],f=e[5],m=e[6],p=e[7],g=e[8],y=g*u-f*p,_=f*m-g*l,M=p*l-u*m,E=t*y+s*_+o*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/E;return e[0]=y*w,e[1]=(o*p-g*s)*w,e[2]=(f*s-o*u)*w,e[3]=_*w,e[4]=(g*t-o*m)*w,e[5]=(o*l-f*t)*w,e[6]=M*w,e[7]=(s*m-p*t)*w,e[8]=(u*t-s*l)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,s,o,l,u,f){const m=Math.cos(l),p=Math.sin(l);return this.set(s*m,s*p,-s*(m*u+p*f)+u+e,-o*p,o*m,-o*(-p*u+m*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(Qu.makeScale(e,t)),this}rotate(e){return this.premultiply(Qu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,s,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<9;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<9;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qu=new ct;function Jg(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function ql(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function iS(){const r=ql("canvas");return r.style.display="block",r}const Cm={};function rS(r){r in Cm||(Cm[r]=!0,console.warn(r))}const bm=new ct().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Rm=new ct().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gl={[Tr]:{transfer:Gl,primaries:Wl,toReference:r=>r,fromReference:r=>r},[hi]:{transfer:Lt,primaries:Wl,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[ec]:{transfer:Gl,primaries:Xl,toReference:r=>r.applyMatrix3(Rm),fromReference:r=>r.applyMatrix3(bm)},[qd]:{transfer:Lt,primaries:Xl,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Rm),fromReference:r=>r.applyMatrix3(bm).convertLinearToSRGB()}},sS=new Set([Tr,ec]),Tt={enabled:!0,_workingColorSpace:Tr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!sS.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const s=gl[e].toReference,o=gl[t].fromReference;return o(s(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return gl[r].primaries},getTransfer:function(r){return r===vr?Gl:gl[r].transfer}};function Zs(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ed(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ps;class aS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ps===void 0&&(Ps=ql("canvas")),Ps.width=e.width,Ps.height=e.height;const s=Ps.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),t=Ps}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ql("canvas");t.width=e.width,t.height=e.height;const s=t.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const o=s.getImageData(0,0,e.width,e.height),l=o.data;for(let u=0;u<l.length;u++)l[u]=Zs(l[u]/255)*255;return s.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let s=0;s<t.length;s++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[s]=Math.floor(Zs(t[s]/255)*255):t[s]=Zs(t[s]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let oS=0;class Qg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:oS++}),this.uuid=no(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let u=0,f=o.length;u<f;u++)o[u].isDataTexture?l.push(td(o[u].image)):l.push(td(o[u]))}else l=td(o);s.url=l}return t||(e.images[this.uuid]=s),s}}function td(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?aS.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let lS=0;class Nn extends sa{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,s=Zr,o=Zr,l=oi,u=Jr,f=vi,m=Mr,p=Nn.DEFAULT_ANISOTROPY,g=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lS++}),this.uuid=no(),this.name="",this.source=new Qg(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=s,this.wrapT=o,this.magFilter=l,this.minFilter=u,this.anisotropy=p,this.format=f,this.internalFormat=null,this.type=m,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),t||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Hg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ud:e.x=e.x-Math.floor(e.x);break;case Zr:e.x=e.x<0?0:1;break;case Id:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ud:e.y=e.y-Math.floor(e.y);break;case Zr:e.y=e.y<0?0:1;break;case Id:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=Hg;Nn.DEFAULT_ANISOTROPY=1;class rn{constructor(e=0,t=0,s=0,o=1){rn.prototype.isVector4=!0,this.x=e,this.y=t,this.z=s,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,s,o){return this.x=e,this.y=t,this.z=s,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*s+u[8]*o+u[12]*l,this.y=u[1]*t+u[5]*s+u[9]*o+u[13]*l,this.z=u[2]*t+u[6]*s+u[10]*o+u[14]*l,this.w=u[3]*t+u[7]*s+u[11]*o+u[15]*l,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,s,o,l;const m=e.elements,p=m[0],g=m[4],y=m[8],_=m[1],M=m[5],E=m[9],w=m[2],S=m[6],x=m[10];if(Math.abs(g-_)<.01&&Math.abs(y-w)<.01&&Math.abs(E-S)<.01){if(Math.abs(g+_)<.1&&Math.abs(y+w)<.1&&Math.abs(E+S)<.1&&Math.abs(p+M+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const R=(p+1)/2,D=(M+1)/2,$=(x+1)/2,I=(g+_)/4,L=(y+w)/4,j=(E+S)/4;return R>D&&R>$?R<.01?(s=0,o=.707106781,l=.707106781):(s=Math.sqrt(R),o=I/s,l=L/s):D>$?D<.01?(s=.707106781,o=0,l=.707106781):(o=Math.sqrt(D),s=I/o,l=j/o):$<.01?(s=.707106781,o=.707106781,l=0):(l=Math.sqrt($),s=L/l,o=j/l),this.set(s,o,l,t),this}let b=Math.sqrt((S-E)*(S-E)+(y-w)*(y-w)+(_-g)*(_-g));return Math.abs(b)<.001&&(b=1),this.x=(S-E)/b,this.y=(y-w)/b,this.z=(_-g)/b,this.w=Math.acos((p+M+x-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this.w=e.w+(t.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cS extends sa{constructor(e=1,t=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rn(0,0,e,t),this.scissorTest=!1,this.viewport=new rn(0,0,e,t);const o={width:e,height:t,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const l=new Nn(o,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);l.flipY=!1,l.generateMipmaps=s.generateMipmaps,l.internalFormat=s.internalFormat,this.textures=[];const u=s.count;for(let f=0;f<u;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,s=1){if(this.width!==e||this.height!==t||this.depth!==s){this.width=e,this.height=t,this.depth=s;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=s;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,o=e.textures.length;s<o;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Qg(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends cS{constructor(e=1,t=1,s={}){super(e,t,s),this.isWebGLRenderTarget=!0}}class ev extends Nn{constructor(e=null,t=1,s=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class uS extends Nn{constructor(e=null,t=1,s=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class io{constructor(e=0,t=0,s=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=s,this._w=o}static slerpFlat(e,t,s,o,l,u,f){let m=s[o+0],p=s[o+1],g=s[o+2],y=s[o+3];const _=l[u+0],M=l[u+1],E=l[u+2],w=l[u+3];if(f===0){e[t+0]=m,e[t+1]=p,e[t+2]=g,e[t+3]=y;return}if(f===1){e[t+0]=_,e[t+1]=M,e[t+2]=E,e[t+3]=w;return}if(y!==w||m!==_||p!==M||g!==E){let S=1-f;const x=m*_+p*M+g*E+y*w,b=x>=0?1:-1,R=1-x*x;if(R>Number.EPSILON){const $=Math.sqrt(R),I=Math.atan2($,x*b);S=Math.sin(S*I)/$,f=Math.sin(f*I)/$}const D=f*b;if(m=m*S+_*D,p=p*S+M*D,g=g*S+E*D,y=y*S+w*D,S===1-f){const $=1/Math.sqrt(m*m+p*p+g*g+y*y);m*=$,p*=$,g*=$,y*=$}}e[t]=m,e[t+1]=p,e[t+2]=g,e[t+3]=y}static multiplyQuaternionsFlat(e,t,s,o,l,u){const f=s[o],m=s[o+1],p=s[o+2],g=s[o+3],y=l[u],_=l[u+1],M=l[u+2],E=l[u+3];return e[t]=f*E+g*y+m*M-p*_,e[t+1]=m*E+g*_+p*y-f*M,e[t+2]=p*E+g*M+f*_-m*y,e[t+3]=g*E-f*y-m*_-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,s,o){return this._x=e,this._y=t,this._z=s,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const s=e._x,o=e._y,l=e._z,u=e._order,f=Math.cos,m=Math.sin,p=f(s/2),g=f(o/2),y=f(l/2),_=m(s/2),M=m(o/2),E=m(l/2);switch(u){case"XYZ":this._x=_*g*y+p*M*E,this._y=p*M*y-_*g*E,this._z=p*g*E+_*M*y,this._w=p*g*y-_*M*E;break;case"YXZ":this._x=_*g*y+p*M*E,this._y=p*M*y-_*g*E,this._z=p*g*E-_*M*y,this._w=p*g*y+_*M*E;break;case"ZXY":this._x=_*g*y-p*M*E,this._y=p*M*y+_*g*E,this._z=p*g*E+_*M*y,this._w=p*g*y-_*M*E;break;case"ZYX":this._x=_*g*y-p*M*E,this._y=p*M*y+_*g*E,this._z=p*g*E-_*M*y,this._w=p*g*y+_*M*E;break;case"YZX":this._x=_*g*y+p*M*E,this._y=p*M*y+_*g*E,this._z=p*g*E-_*M*y,this._w=p*g*y-_*M*E;break;case"XZY":this._x=_*g*y-p*M*E,this._y=p*M*y-_*g*E,this._z=p*g*E+_*M*y,this._w=p*g*y+_*M*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const s=t/2,o=Math.sin(s);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,s=t[0],o=t[4],l=t[8],u=t[1],f=t[5],m=t[9],p=t[2],g=t[6],y=t[10],_=s+f+y;if(_>0){const M=.5/Math.sqrt(_+1);this._w=.25/M,this._x=(g-m)*M,this._y=(l-p)*M,this._z=(u-o)*M}else if(s>f&&s>y){const M=2*Math.sqrt(1+s-f-y);this._w=(g-m)/M,this._x=.25*M,this._y=(o+u)/M,this._z=(l+p)/M}else if(f>y){const M=2*Math.sqrt(1+f-s-y);this._w=(l-p)/M,this._x=(o+u)/M,this._y=.25*M,this._z=(m+g)/M}else{const M=2*Math.sqrt(1+y-s-f);this._w=(u-o)/M,this._x=(l+p)/M,this._y=(m+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let s=e.dot(t)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bn(this.dot(e),-1,1)))}rotateTowards(e,t){const s=this.angleTo(e);if(s===0)return this;const o=Math.min(1,t/s);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const s=e._x,o=e._y,l=e._z,u=e._w,f=t._x,m=t._y,p=t._z,g=t._w;return this._x=s*g+u*f+o*p-l*m,this._y=o*g+u*m+l*f-s*p,this._z=l*g+u*p+s*m-o*f,this._w=u*g-s*f-o*m-l*p,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const s=this._x,o=this._y,l=this._z,u=this._w;let f=u*e._w+s*e._x+o*e._y+l*e._z;if(f<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,f=-f):this.copy(e),f>=1)return this._w=u,this._x=s,this._y=o,this._z=l,this;const m=1-f*f;if(m<=Number.EPSILON){const M=1-t;return this._w=M*u+t*this._w,this._x=M*s+t*this._x,this._y=M*o+t*this._y,this._z=M*l+t*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,f),y=Math.sin((1-t)*g)/p,_=Math.sin(t*g)/p;return this._w=u*y+this._w*_,this._x=s*y+this._x*_,this._y=o*y+this._y*_,this._z=l*y+this._z*_,this._onChangeCallback(),this}slerpQuaternions(e,t,s){return this.copy(e).slerp(t,s)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),s=Math.random(),o=Math.sqrt(1-s),l=Math.sqrt(s);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class oe{constructor(e=0,t=0,s=0){oe.prototype.isVector3=!0,this.x=e,this.y=t,this.z=s}set(e,t,s){return s===void 0&&(s=this.z),this.x=e,this.y=t,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Nm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Nm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[3]*s+l[6]*o,this.y=l[1]*t+l[4]*s+l[7]*o,this.z=l[2]*t+l[5]*s+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=e.elements,u=1/(l[3]*t+l[7]*s+l[11]*o+l[15]);return this.x=(l[0]*t+l[4]*s+l[8]*o+l[12])*u,this.y=(l[1]*t+l[5]*s+l[9]*o+l[13])*u,this.z=(l[2]*t+l[6]*s+l[10]*o+l[14])*u,this}applyQuaternion(e){const t=this.x,s=this.y,o=this.z,l=e.x,u=e.y,f=e.z,m=e.w,p=2*(u*o-f*s),g=2*(f*t-l*o),y=2*(l*s-u*t);return this.x=t+m*p+u*y-f*g,this.y=s+m*g+f*p-l*y,this.z=o+m*y+l*g-u*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[4]*s+l[8]*o,this.y=l[1]*t+l[5]*s+l[9]*o,this.z=l[2]*t+l[6]*s+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const s=e.x,o=e.y,l=e.z,u=t.x,f=t.y,m=t.z;return this.x=o*m-l*f,this.y=l*u-s*m,this.z=s*f-o*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const s=e.dot(this)/t;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return nd.copy(this).projectOnVector(e),this.sub(nd)}reflect(e){return this.sub(nd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(bn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y,o=this.z-e.z;return t*t+s*s+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,s){const o=Math.sin(t)*e;return this.x=o*Math.sin(s),this.y=Math.cos(t)*e,this.z=o*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,s){return this.x=e*Math.sin(t),this.y=s,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=s,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,s=Math.sqrt(1-t*t);return this.x=s*Math.cos(e),this.y=t,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const nd=new oe,Nm=new io;class aa{constructor(e=new oe(1/0,1/0,1/0),t=new oe(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t+=3)this.expandByPoint(ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,s=e.count;t<s;t++)this.expandByPoint(ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const s=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const l=s.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,f=l.count;u<f;u++)e.isMesh===!0?e.getVertexPosition(u,ri):ri.fromBufferAttribute(l,u),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vl.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),vl.copy(s.boundingBox)),vl.applyMatrix4(e.matrixWorld),this.union(vl)}const o=e.children;for(let l=0,u=o.length;l<u;l++)this.expandByObject(o[l],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,s;return e.normal.x>0?(t=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),t<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ga),_l.subVectors(this.max,Ga),Ls.subVectors(e.a,Ga),Ds.subVectors(e.b,Ga),Us.subVectors(e.c,Ga),dr.subVectors(Ds,Ls),fr.subVectors(Us,Ds),Br.subVectors(Ls,Us);let t=[0,-dr.z,dr.y,0,-fr.z,fr.y,0,-Br.z,Br.y,dr.z,0,-dr.x,fr.z,0,-fr.x,Br.z,0,-Br.x,-dr.y,dr.x,0,-fr.y,fr.x,0,-Br.y,Br.x,0];return!id(t,Ls,Ds,Us,_l)||(t=[1,0,0,0,1,0,0,0,1],!id(t,Ls,Ds,Us,_l))?!1:(xl.crossVectors(dr,fr),t=[xl.x,xl.y,xl.z],id(t,Ls,Ds,Us,_l))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Li=[new oe,new oe,new oe,new oe,new oe,new oe,new oe,new oe],ri=new oe,vl=new aa,Ls=new oe,Ds=new oe,Us=new oe,dr=new oe,fr=new oe,Br=new oe,Ga=new oe,_l=new oe,xl=new oe,jr=new oe;function id(r,e,t,s,o){for(let l=0,u=r.length-3;l<=u;l+=3){jr.fromArray(r,l);const f=o.x*Math.abs(jr.x)+o.y*Math.abs(jr.y)+o.z*Math.abs(jr.z),m=e.dot(jr),p=t.dot(jr),g=s.dot(jr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>f)return!1}return!0}const dS=new aa,Wa=new oe,rd=new oe;class Yd{constructor(e=new oe,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const s=this.center;t!==void 0?s.copy(t):dS.setFromPoints(e).getCenter(s);let o=0;for(let l=0,u=e.length;l<u;l++)o=Math.max(o,s.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const s=this.center.distanceToSquared(e);return t.copy(e),s>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wa.subVectors(e,this.center);const t=Wa.lengthSq();if(t>this.radius*this.radius){const s=Math.sqrt(t),o=(s-this.radius)*.5;this.center.addScaledVector(Wa,o/s),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(rd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wa.copy(e.center).add(rd)),this.expandByPoint(Wa.copy(e.center).sub(rd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Di=new oe,sd=new oe,yl=new oe,hr=new oe,ad=new oe,Sl=new oe,od=new oe;class fS{constructor(e=new oe,t=new oe(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const s=t.dot(this.direction);return s<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,s,o){sd.copy(e).add(t).multiplyScalar(.5),yl.copy(t).sub(e).normalize(),hr.copy(this.origin).sub(sd);const l=e.distanceTo(t)*.5,u=-this.direction.dot(yl),f=hr.dot(this.direction),m=-hr.dot(yl),p=hr.lengthSq(),g=Math.abs(1-u*u);let y,_,M,E;if(g>0)if(y=u*m-f,_=u*f-m,E=l*g,y>=0)if(_>=-E)if(_<=E){const w=1/g;y*=w,_*=w,M=y*(y+u*_+2*f)+_*(u*y+_+2*m)+p}else _=l,y=Math.max(0,-(u*_+f)),M=-y*y+_*(_+2*m)+p;else _=-l,y=Math.max(0,-(u*_+f)),M=-y*y+_*(_+2*m)+p;else _<=-E?(y=Math.max(0,-(-u*l+f)),_=y>0?-l:Math.min(Math.max(-l,-m),l),M=-y*y+_*(_+2*m)+p):_<=E?(y=0,_=Math.min(Math.max(-l,-m),l),M=_*(_+2*m)+p):(y=Math.max(0,-(u*l+f)),_=y>0?l:Math.min(Math.max(-l,-m),l),M=-y*y+_*(_+2*m)+p);else _=u>0?-l:l,y=Math.max(0,-(u*_+f)),M=-y*y+_*(_+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,y),o&&o.copy(sd).addScaledVector(yl,_),M}intersectSphere(e,t){Di.subVectors(e.center,this.origin);const s=Di.dot(this.direction),o=Di.dot(Di)-s*s,l=e.radius*e.radius;if(o>l)return null;const u=Math.sqrt(l-o),f=s-u,m=s+u;return m<0?null:f<0?this.at(m,t):this.at(f,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/t;return s>=0?s:null}intersectPlane(e,t){const s=this.distanceToPlane(e);return s===null?null:this.at(s,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let s,o,l,u,f,m;const p=1/this.direction.x,g=1/this.direction.y,y=1/this.direction.z,_=this.origin;return p>=0?(s=(e.min.x-_.x)*p,o=(e.max.x-_.x)*p):(s=(e.max.x-_.x)*p,o=(e.min.x-_.x)*p),g>=0?(l=(e.min.y-_.y)*g,u=(e.max.y-_.y)*g):(l=(e.max.y-_.y)*g,u=(e.min.y-_.y)*g),s>u||l>o||((l>s||isNaN(s))&&(s=l),(u<o||isNaN(o))&&(o=u),y>=0?(f=(e.min.z-_.z)*y,m=(e.max.z-_.z)*y):(f=(e.max.z-_.z)*y,m=(e.min.z-_.z)*y),s>m||f>o)||((f>s||s!==s)&&(s=f),(m<o||o!==o)&&(o=m),o<0)?null:this.at(s>=0?s:o,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,s,o,l){ad.subVectors(t,e),Sl.subVectors(s,e),od.crossVectors(ad,Sl);let u=this.direction.dot(od),f;if(u>0){if(o)return null;f=1}else if(u<0)f=-1,u=-u;else return null;hr.subVectors(this.origin,e);const m=f*this.direction.dot(Sl.crossVectors(hr,Sl));if(m<0)return null;const p=f*this.direction.dot(ad.cross(hr));if(p<0||m+p>u)return null;const g=-f*hr.dot(od);return g<0?null:this.at(g/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(e,t,s,o,l,u,f,m,p,g,y,_,M,E,w,S){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,u,f,m,p,g,y,_,M,E,w,S)}set(e,t,s,o,l,u,f,m,p,g,y,_,M,E,w,S){const x=this.elements;return x[0]=e,x[4]=t,x[8]=s,x[12]=o,x[1]=l,x[5]=u,x[9]=f,x[13]=m,x[2]=p,x[6]=g,x[10]=y,x[14]=_,x[3]=M,x[7]=E,x[11]=w,x[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],t[9]=s[9],t[10]=s[10],t[11]=s[11],t[12]=s[12],t[13]=s[13],t[14]=s[14],t[15]=s[15],this}copyPosition(e){const t=this.elements,s=e.elements;return t[12]=s[12],t[13]=s[13],t[14]=s[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,s){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,t,s){return this.set(e.x,t.x,s.x,0,e.y,t.y,s.y,0,e.z,t.z,s.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,s=e.elements,o=1/Is.setFromMatrixColumn(e,0).length(),l=1/Is.setFromMatrixColumn(e,1).length(),u=1/Is.setFromMatrixColumn(e,2).length();return t[0]=s[0]*o,t[1]=s[1]*o,t[2]=s[2]*o,t[3]=0,t[4]=s[4]*l,t[5]=s[5]*l,t[6]=s[6]*l,t[7]=0,t[8]=s[8]*u,t[9]=s[9]*u,t[10]=s[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,s=e.x,o=e.y,l=e.z,u=Math.cos(s),f=Math.sin(s),m=Math.cos(o),p=Math.sin(o),g=Math.cos(l),y=Math.sin(l);if(e.order==="XYZ"){const _=u*g,M=u*y,E=f*g,w=f*y;t[0]=m*g,t[4]=-m*y,t[8]=p,t[1]=M+E*p,t[5]=_-w*p,t[9]=-f*m,t[2]=w-_*p,t[6]=E+M*p,t[10]=u*m}else if(e.order==="YXZ"){const _=m*g,M=m*y,E=p*g,w=p*y;t[0]=_+w*f,t[4]=E*f-M,t[8]=u*p,t[1]=u*y,t[5]=u*g,t[9]=-f,t[2]=M*f-E,t[6]=w+_*f,t[10]=u*m}else if(e.order==="ZXY"){const _=m*g,M=m*y,E=p*g,w=p*y;t[0]=_-w*f,t[4]=-u*y,t[8]=E+M*f,t[1]=M+E*f,t[5]=u*g,t[9]=w-_*f,t[2]=-u*p,t[6]=f,t[10]=u*m}else if(e.order==="ZYX"){const _=u*g,M=u*y,E=f*g,w=f*y;t[0]=m*g,t[4]=E*p-M,t[8]=_*p+w,t[1]=m*y,t[5]=w*p+_,t[9]=M*p-E,t[2]=-p,t[6]=f*m,t[10]=u*m}else if(e.order==="YZX"){const _=u*m,M=u*p,E=f*m,w=f*p;t[0]=m*g,t[4]=w-_*y,t[8]=E*y+M,t[1]=y,t[5]=u*g,t[9]=-f*g,t[2]=-p*g,t[6]=M*y+E,t[10]=_-w*y}else if(e.order==="XZY"){const _=u*m,M=u*p,E=f*m,w=f*p;t[0]=m*g,t[4]=-y,t[8]=p*g,t[1]=_*y+w,t[5]=u*g,t[9]=M*y-E,t[2]=E*y-M,t[6]=f*g,t[10]=w*y+_}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hS,e,pS)}lookAt(e,t,s){const o=this.elements;return Fn.subVectors(e,t),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),pr.crossVectors(s,Fn),pr.lengthSq()===0&&(Math.abs(s.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),pr.crossVectors(s,Fn)),pr.normalize(),Ml.crossVectors(Fn,pr),o[0]=pr.x,o[4]=Ml.x,o[8]=Fn.x,o[1]=pr.y,o[5]=Ml.y,o[9]=Fn.y,o[2]=pr.z,o[6]=Ml.z,o[10]=Fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,u=s[0],f=s[4],m=s[8],p=s[12],g=s[1],y=s[5],_=s[9],M=s[13],E=s[2],w=s[6],S=s[10],x=s[14],b=s[3],R=s[7],D=s[11],$=s[15],I=o[0],L=o[4],j=o[8],C=o[12],T=o[1],V=o[5],G=o[9],z=o[13],X=o[2],Y=o[6],le=o[10],fe=o[14],k=o[3],de=o[7],ne=o[11],O=o[15];return l[0]=u*I+f*T+m*X+p*k,l[4]=u*L+f*V+m*Y+p*de,l[8]=u*j+f*G+m*le+p*ne,l[12]=u*C+f*z+m*fe+p*O,l[1]=g*I+y*T+_*X+M*k,l[5]=g*L+y*V+_*Y+M*de,l[9]=g*j+y*G+_*le+M*ne,l[13]=g*C+y*z+_*fe+M*O,l[2]=E*I+w*T+S*X+x*k,l[6]=E*L+w*V+S*Y+x*de,l[10]=E*j+w*G+S*le+x*ne,l[14]=E*C+w*z+S*fe+x*O,l[3]=b*I+R*T+D*X+$*k,l[7]=b*L+R*V+D*Y+$*de,l[11]=b*j+R*G+D*le+$*ne,l[15]=b*C+R*z+D*fe+$*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[4],o=e[8],l=e[12],u=e[1],f=e[5],m=e[9],p=e[13],g=e[2],y=e[6],_=e[10],M=e[14],E=e[3],w=e[7],S=e[11],x=e[15];return E*(+l*m*y-o*p*y-l*f*_+s*p*_+o*f*M-s*m*M)+w*(+t*m*M-t*p*_+l*u*_-o*u*M+o*p*g-l*m*g)+S*(+t*p*y-t*f*M-l*u*y+s*u*M+l*f*g-s*p*g)+x*(-o*f*g-t*m*y+t*f*_+o*u*y-s*u*_+s*m*g)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,s){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=s),this}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],f=e[5],m=e[6],p=e[7],g=e[8],y=e[9],_=e[10],M=e[11],E=e[12],w=e[13],S=e[14],x=e[15],b=y*S*p-w*_*p+w*m*M-f*S*M-y*m*x+f*_*x,R=E*_*p-g*S*p-E*m*M+u*S*M+g*m*x-u*_*x,D=g*w*p-E*y*p+E*f*M-u*w*M-g*f*x+u*y*x,$=E*y*m-g*w*m-E*f*_+u*w*_+g*f*S-u*y*S,I=t*b+s*R+o*D+l*$;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/I;return e[0]=b*L,e[1]=(w*_*l-y*S*l-w*o*M+s*S*M+y*o*x-s*_*x)*L,e[2]=(f*S*l-w*m*l+w*o*p-s*S*p-f*o*x+s*m*x)*L,e[3]=(y*m*l-f*_*l-y*o*p+s*_*p+f*o*M-s*m*M)*L,e[4]=R*L,e[5]=(g*S*l-E*_*l+E*o*M-t*S*M-g*o*x+t*_*x)*L,e[6]=(E*m*l-u*S*l-E*o*p+t*S*p+u*o*x-t*m*x)*L,e[7]=(u*_*l-g*m*l+g*o*p-t*_*p-u*o*M+t*m*M)*L,e[8]=D*L,e[9]=(E*y*l-g*w*l-E*s*M+t*w*M+g*s*x-t*y*x)*L,e[10]=(u*w*l-E*f*l+E*s*p-t*w*p-u*s*x+t*f*x)*L,e[11]=(g*f*l-u*y*l-g*s*p+t*y*p+u*s*M-t*f*M)*L,e[12]=$*L,e[13]=(g*w*o-E*y*o+E*s*_-t*w*_-g*s*S+t*y*S)*L,e[14]=(E*f*o-u*w*o-E*s*m+t*w*m+u*s*S-t*f*S)*L,e[15]=(u*y*o-g*f*o+g*s*m-t*y*m-u*s*_+t*f*_)*L,this}scale(e){const t=this.elements,s=e.x,o=e.y,l=e.z;return t[0]*=s,t[4]*=o,t[8]*=l,t[1]*=s,t[5]*=o,t[9]*=l,t[2]*=s,t[6]*=o,t[10]*=l,t[3]*=s,t[7]*=o,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,s,o))}makeTranslation(e,t,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,s,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,t,-s,0,0,s,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,0,s,0,0,1,0,0,-s,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,0,s,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const s=Math.cos(t),o=Math.sin(t),l=1-s,u=e.x,f=e.y,m=e.z,p=l*u,g=l*f;return this.set(p*u+s,p*f-o*m,p*m+o*f,0,p*f+o*m,g*f+s,g*m-o*u,0,p*m-o*f,g*m+o*u,l*m*m+s,0,0,0,0,1),this}makeScale(e,t,s){return this.set(e,0,0,0,0,t,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,t,s,o,l,u){return this.set(1,s,l,0,e,1,u,0,t,o,1,0,0,0,0,1),this}compose(e,t,s){const o=this.elements,l=t._x,u=t._y,f=t._z,m=t._w,p=l+l,g=u+u,y=f+f,_=l*p,M=l*g,E=l*y,w=u*g,S=u*y,x=f*y,b=m*p,R=m*g,D=m*y,$=s.x,I=s.y,L=s.z;return o[0]=(1-(w+x))*$,o[1]=(M+D)*$,o[2]=(E-R)*$,o[3]=0,o[4]=(M-D)*I,o[5]=(1-(_+x))*I,o[6]=(S+b)*I,o[7]=0,o[8]=(E+R)*L,o[9]=(S-b)*L,o[10]=(1-(_+w))*L,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,s){const o=this.elements;let l=Is.set(o[0],o[1],o[2]).length();const u=Is.set(o[4],o[5],o[6]).length(),f=Is.set(o[8],o[9],o[10]).length();this.determinant()<0&&(l=-l),e.x=o[12],e.y=o[13],e.z=o[14],si.copy(this);const p=1/l,g=1/u,y=1/f;return si.elements[0]*=p,si.elements[1]*=p,si.elements[2]*=p,si.elements[4]*=g,si.elements[5]*=g,si.elements[6]*=g,si.elements[8]*=y,si.elements[9]*=y,si.elements[10]*=y,t.setFromRotationMatrix(si),s.x=l,s.y=u,s.z=f,this}makePerspective(e,t,s,o,l,u,f=zi){const m=this.elements,p=2*l/(t-e),g=2*l/(s-o),y=(t+e)/(t-e),_=(s+o)/(s-o);let M,E;if(f===zi)M=-(u+l)/(u-l),E=-2*u*l/(u-l);else if(f===$l)M=-u/(u-l),E=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return m[0]=p,m[4]=0,m[8]=y,m[12]=0,m[1]=0,m[5]=g,m[9]=_,m[13]=0,m[2]=0,m[6]=0,m[10]=M,m[14]=E,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,t,s,o,l,u,f=zi){const m=this.elements,p=1/(t-e),g=1/(s-o),y=1/(u-l),_=(t+e)*p,M=(s+o)*g;let E,w;if(f===zi)E=(u+l)*y,w=-2*y;else if(f===$l)E=l*y,w=-1*y;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-_,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-M,m[2]=0,m[6]=0,m[10]=w,m[14]=-E,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<16;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<16;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e[t+9]=s[9],e[t+10]=s[10],e[t+11]=s[11],e[t+12]=s[12],e[t+13]=s[13],e[t+14]=s[14],e[t+15]=s[15],e}}const Is=new oe,si=new Bt,hS=new oe(0,0,0),pS=new oe(1,1,1),pr=new oe,Ml=new oe,Fn=new oe,Pm=new Bt,Lm=new io;class Si{constructor(e=0,t=0,s=0,o=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=s,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,s,o=this._order){return this._x=e,this._y=t,this._z=s,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,s=!0){const o=e.elements,l=o[0],u=o[4],f=o[8],m=o[1],p=o[5],g=o[9],y=o[2],_=o[6],M=o[10];switch(t){case"XYZ":this._y=Math.asin(bn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(_,p),this._z=0);break;case"YXZ":this._x=Math.asin(-bn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(f,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-y,l),this._z=0);break;case"ZXY":this._x=Math.asin(bn(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(-y,M),this._z=Math.atan2(-u,p)):(this._y=0,this._z=Math.atan2(m,l));break;case"ZYX":this._y=Math.asin(-bn(y,-1,1)),Math.abs(y)<.9999999?(this._x=Math.atan2(_,M),this._z=Math.atan2(m,l)):(this._x=0,this._z=Math.atan2(-u,p));break;case"YZX":this._z=Math.asin(bn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-y,l)):(this._x=0,this._y=Math.atan2(f,M));break;case"XZY":this._z=Math.asin(-bn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(_,p),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,s){return Pm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pm,t,s)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lm.setFromEuler(this),this.setFromQuaternion(Lm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class tv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let mS=0;const Dm=new oe,Fs=new io,Ui=new Bt,El=new oe,Xa=new oe,gS=new oe,vS=new io,Um=new oe(1,0,0),Im=new oe(0,1,0),Fm=new oe(0,0,1),Om={type:"added"},_S={type:"removed"},Os={type:"childadded",child:null},ld={type:"childremoved",child:null};class gn extends sa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mS++}),this.uuid=no(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gn.DEFAULT_UP.clone();const e=new oe,t=new Si,s=new io,o=new oe(1,1,1);function l(){s.setFromEuler(t,!1)}function u(){t.setFromQuaternion(s,void 0,!1)}t._onChange(l),s._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Bt},normalMatrix:{value:new ct}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fs.setFromAxisAngle(e,t),this.quaternion.multiply(Fs),this}rotateOnWorldAxis(e,t){return Fs.setFromAxisAngle(e,t),this.quaternion.premultiply(Fs),this}rotateX(e){return this.rotateOnAxis(Um,e)}rotateY(e){return this.rotateOnAxis(Im,e)}rotateZ(e){return this.rotateOnAxis(Fm,e)}translateOnAxis(e,t){return Dm.copy(e).applyQuaternion(this.quaternion),this.position.add(Dm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Um,e)}translateY(e){return this.translateOnAxis(Im,e)}translateZ(e){return this.translateOnAxis(Fm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,s){e.isVector3?El.copy(e):El.set(e,t,s);const o=this.parent;this.updateWorldMatrix(!0,!1),Xa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(Xa,El,this.up):Ui.lookAt(El,Xa,this.up),this.quaternion.setFromRotationMatrix(Ui),o&&(Ui.extractRotation(o.matrixWorld),Fs.setFromRotationMatrix(Ui),this.quaternion.premultiply(Fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Om),Os.child=e,this.dispatchEvent(Os),Os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_S),ld.child=e,this.dispatchEvent(ld),ld.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Om),Os.child=e,this.dispatchEvent(Os),Os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let s=0,o=this.children.length;s<o;s++){const u=this.children[s].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,s=[]){this[e]===t&&s.push(this);const o=this.children;for(let l=0,u=o.length;l<u;l++)o[l].getObjectsByProperty(e,t,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,e,gS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,vS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let s=0,o=t.length;s<o;s++){const l=t[s];(l.matrixWorldAutoUpdate===!0||e===!0)&&l.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const s=this.parent;if(e===!0&&s!==null&&s.matrixWorldAutoUpdate===!0&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const o=this.children;for(let l=0,u=o.length;l<u;l++){const f=o[l];f.matrixWorldAutoUpdate===!0&&f.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",s={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(f=>({boxInitialized:f.boxInitialized,boxMin:f.box.min.toArray(),boxMax:f.box.max.toArray(),sphereInitialized:f.sphereInitialized,sphereRadius:f.sphere.radius,sphereCenter:f.sphere.center.toArray()})),o.maxGeometryCount=this._maxGeometryCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function l(f,m){return f[m.uuid]===void 0&&(f[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const m=f.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const y=m[p];l(e.shapes,y)}else l(e.shapes,m)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let m=0,p=this.material.length;m<p;m++)f.push(l(e.materials,this.material[m]));o.material=f}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let f=0;f<this.children.length;f++)o.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let f=0;f<this.animations.length;f++){const m=this.animations[f];o.animations.push(l(e.animations,m))}}if(t){const f=u(e.geometries),m=u(e.materials),p=u(e.textures),g=u(e.images),y=u(e.shapes),_=u(e.skeletons),M=u(e.animations),E=u(e.nodes);f.length>0&&(s.geometries=f),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),y.length>0&&(s.shapes=y),_.length>0&&(s.skeletons=_),M.length>0&&(s.animations=M),E.length>0&&(s.nodes=E)}return s.object=o,s;function u(f){const m=[];for(const p in f){const g=f[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let s=0;s<e.children.length;s++){const o=e.children[s];this.add(o.clone())}return this}}gn.DEFAULT_UP=new oe(0,1,0);gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ai=new oe,Ii=new oe,cd=new oe,Fi=new oe,ks=new oe,zs=new oe,km=new oe,ud=new oe,dd=new oe,fd=new oe;class gi{constructor(e=new oe,t=new oe,s=new oe){this.a=e,this.b=t,this.c=s}static getNormal(e,t,s,o){o.subVectors(s,t),ai.subVectors(e,t),o.cross(ai);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,t,s,o,l){ai.subVectors(o,t),Ii.subVectors(s,t),cd.subVectors(e,t);const u=ai.dot(ai),f=ai.dot(Ii),m=ai.dot(cd),p=Ii.dot(Ii),g=Ii.dot(cd),y=u*p-f*f;if(y===0)return l.set(0,0,0),null;const _=1/y,M=(p*m-f*g)*_,E=(u*g-f*m)*_;return l.set(1-M-E,E,M)}static containsPoint(e,t,s,o){return this.getBarycoord(e,t,s,o,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,s,o,l,u,f,m){return this.getBarycoord(e,t,s,o,Fi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(l,Fi.x),m.addScaledVector(u,Fi.y),m.addScaledVector(f,Fi.z),m)}static isFrontFacing(e,t,s,o){return ai.subVectors(s,t),Ii.subVectors(e,t),ai.cross(Ii).dot(o)<0}set(e,t,s){return this.a.copy(e),this.b.copy(t),this.c.copy(s),this}setFromPointsAndIndices(e,t,s,o){return this.a.copy(e[t]),this.b.copy(e[s]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,s,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ai.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),ai.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,s,o,l){return gi.getInterpolation(e,this.a,this.b,this.c,t,s,o,l)}containsPoint(e){return gi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const s=this.a,o=this.b,l=this.c;let u,f;ks.subVectors(o,s),zs.subVectors(l,s),ud.subVectors(e,s);const m=ks.dot(ud),p=zs.dot(ud);if(m<=0&&p<=0)return t.copy(s);dd.subVectors(e,o);const g=ks.dot(dd),y=zs.dot(dd);if(g>=0&&y<=g)return t.copy(o);const _=m*y-g*p;if(_<=0&&m>=0&&g<=0)return u=m/(m-g),t.copy(s).addScaledVector(ks,u);fd.subVectors(e,l);const M=ks.dot(fd),E=zs.dot(fd);if(E>=0&&M<=E)return t.copy(l);const w=M*p-m*E;if(w<=0&&p>=0&&E<=0)return f=p/(p-E),t.copy(s).addScaledVector(zs,f);const S=g*E-M*y;if(S<=0&&y-g>=0&&M-E>=0)return km.subVectors(l,o),f=(y-g)/(y-g+(M-E)),t.copy(o).addScaledVector(km,f);const x=1/(S+w+_);return u=w*x,f=_*x,t.copy(s).addScaledVector(ks,u).addScaledVector(zs,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const nv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},wl={h:0,s:0,l:0};function hd(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Mt{constructor(e,t,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,s)}set(e,t,s){if(t===void 0&&s===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.toWorkingColorSpace(this,t),this}setRGB(e,t,s,o=Tt.workingColorSpace){return this.r=e,this.g=t,this.b=s,Tt.toWorkingColorSpace(this,o),this}setHSL(e,t,s,o=Tt.workingColorSpace){if(e=nS(e,1),t=bn(t,0,1),s=bn(s,0,1),t===0)this.r=this.g=this.b=s;else{const l=s<=.5?s*(1+t):s+t-s*t,u=2*s-l;this.r=hd(u,l,e+1/3),this.g=hd(u,l,e),this.b=hd(u,l,e-1/3)}return Tt.toWorkingColorSpace(this,o),this}setStyle(e,t=hi){function s(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=o[1],f=o[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return s(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return s(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return s(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const s=nv[e.toLowerCase()];return s!==void 0?this.setHex(s,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}copyLinearToSRGB(e){return this.r=ed(e.r),this.g=ed(e.g),this.b=ed(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return Tt.fromWorkingColorSpace(pn.copy(this),e),Math.round(bn(pn.r*255,0,255))*65536+Math.round(bn(pn.g*255,0,255))*256+Math.round(bn(pn.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Tt.workingColorSpace){Tt.fromWorkingColorSpace(pn.copy(this),t);const s=pn.r,o=pn.g,l=pn.b,u=Math.max(s,o,l),f=Math.min(s,o,l);let m,p;const g=(f+u)/2;if(f===u)m=0,p=0;else{const y=u-f;switch(p=g<=.5?y/(u+f):y/(2-u-f),u){case s:m=(o-l)/y+(o<l?6:0);break;case o:m=(l-s)/y+2;break;case l:m=(s-o)/y+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,t=Tt.workingColorSpace){return Tt.fromWorkingColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=hi){Tt.fromWorkingColorSpace(pn.copy(this),e);const t=pn.r,s=pn.g,o=pn.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(s*255)},${Math.round(o*255)})`}offsetHSL(e,t,s){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,s){return this.r=e.r+(t.r-e.r)*s,this.g=e.g+(t.g-e.g)*s,this.b=e.b+(t.b-e.b)*s,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(wl);const s=Ju(mr.h,wl.h,t),o=Ju(mr.s,wl.s,t),l=Ju(mr.l,wl.l,t);return this.setHSL(s,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,s=this.g,o=this.b,l=e.elements;return this.r=l[0]*t+l[3]*s+l[6]*o,this.g=l[1]*t+l[4]*s+l[7]*o,this.b=l[2]*t+l[5]*s+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pn=new Mt;Mt.NAMES=nv;let xS=0;class ro extends sa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xS++}),this.uuid=no(),this.name="",this.type="Material",this.blending=Ys,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nd,this.blendDst=Pd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Mt(0,0,0),this.blendAlpha=0,this.depthFunc=Vl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ns,this.stencilZFail=Ns,this.stencilZPass=Ns,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const s=e[t];if(s===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(s):o&&o.isVector3&&s&&s.isVector3?o.copy(s):this[t]=s}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Ys&&(s.blending=this.blending),this.side!==Sr&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Nd&&(s.blendSrc=this.blendSrc),this.blendDst!==Pd&&(s.blendDst=this.blendDst),this.blendEquation!==qr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Vl&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wm&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ns&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Ns&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Ns&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function o(l){const u=[];for(const f in l){const m=l[f];delete m.metadata,u.push(m)}return u}if(t){const l=o(e.textures),u=o(e.images);l.length>0&&(s.textures=l),u.length>0&&(s.images=u)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let s=null;if(t!==null){const o=t.length;s=new Array(o);for(let l=0;l!==o;++l)s[l]=t[l].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class iv extends ro{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=jg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ht=new oe,Tl=new xt;class Bn{constructor(e,t,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=s,this.usage=Tm,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return rS("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,s){e*=this.itemSize,s*=t.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=t.array[s+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,s=this.count;t<s;t++)Tl.fromBufferAttribute(this,t),Tl.applyMatrix3(e),this.setXY(t,Tl.x,Tl.y);else if(this.itemSize===3)for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix3(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyMatrix4(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let s=this.array[e*this.itemSize+t];return this.normalized&&(s=Va(s,this.array)),s}setComponent(e,t,s){return this.normalized&&(s=Cn(s,this.array)),this.array[e*this.itemSize+t]=s,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Va(t,this.array)),t}setX(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Va(t,this.array)),t}setY(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Va(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Va(t,this.array)),t}setW(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,s){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array)),this.array[e+0]=t,this.array[e+1]=s,this}setXYZ(e,t,s,o){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this}setXYZW(e,t,s,o,l){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array),l=Cn(l,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Tm&&(e.usage=this.usage),e}}class rv extends Bn{constructor(e,t,s){super(new Uint16Array(e),t,s)}}class sv extends Bn{constructor(e,t,s){super(new Uint32Array(e),t,s)}}class Bi extends Bn{constructor(e,t,s){super(new Float32Array(e),t,s)}}let yS=0;const $n=new Bt,pd=new gn,Bs=new oe,On=new aa,$a=new aa,nn=new oe;class Hi extends sa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yS++}),this.uuid=no(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jg(e)?sv:rv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,s=0){this.groups.push({start:e,count:t,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const l=new ct().getNormalMatrix(e);s.applyNormalMatrix(l),s.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $n.makeRotationFromQuaternion(e),this.applyMatrix4($n),this}rotateX(e){return $n.makeRotationX(e),this.applyMatrix4($n),this}rotateY(e){return $n.makeRotationY(e),this.applyMatrix4($n),this}rotateZ(e){return $n.makeRotationZ(e),this.applyMatrix4($n),this}translate(e,t,s){return $n.makeTranslation(e,t,s),this.applyMatrix4($n),this}scale(e,t,s){return $n.makeScale(e,t,s),this.applyMatrix4($n),this}lookAt(e){return pd.lookAt(e),pd.updateMatrix(),this.applyMatrix4(pd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){const t=[];for(let s=0,o=e.length;s<o;s++){const l=e[s];t.push(l.x,l.y,l.z||0)}return this.setAttribute("position",new Bi(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new aa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new oe(-1/0,-1/0,-1/0),new oe(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const l=t[s];On.setFromBufferAttribute(l),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,On.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,On.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(On.min),this.boundingBox.expandByPoint(On.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yd);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new oe,1/0);return}if(e){const s=this.boundingSphere.center;if(On.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const f=t[l];$a.setFromBufferAttribute(f),this.morphTargetsRelative?(nn.addVectors(On.min,$a.min),On.expandByPoint(nn),nn.addVectors(On.max,$a.max),On.expandByPoint(nn)):(On.expandByPoint($a.min),On.expandByPoint($a.max))}On.getCenter(s);let o=0;for(let l=0,u=e.count;l<u;l++)nn.fromBufferAttribute(e,l),o=Math.max(o,s.distanceToSquared(nn));if(t)for(let l=0,u=t.length;l<u;l++){const f=t[l],m=this.morphTargetsRelative;for(let p=0,g=f.count;p<g;p++)nn.fromBufferAttribute(f,p),m&&(Bs.fromBufferAttribute(e,p),nn.add(Bs)),o=Math.max(o,s.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=t.position,o=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*s.count),4));const u=this.getAttribute("tangent"),f=[],m=[];for(let j=0;j<s.count;j++)f[j]=new oe,m[j]=new oe;const p=new oe,g=new oe,y=new oe,_=new xt,M=new xt,E=new xt,w=new oe,S=new oe;function x(j,C,T){p.fromBufferAttribute(s,j),g.fromBufferAttribute(s,C),y.fromBufferAttribute(s,T),_.fromBufferAttribute(l,j),M.fromBufferAttribute(l,C),E.fromBufferAttribute(l,T),g.sub(p),y.sub(p),M.sub(_),E.sub(_);const V=1/(M.x*E.y-E.x*M.y);isFinite(V)&&(w.copy(g).multiplyScalar(E.y).addScaledVector(y,-M.y).multiplyScalar(V),S.copy(y).multiplyScalar(M.x).addScaledVector(g,-E.x).multiplyScalar(V),f[j].add(w),f[C].add(w),f[T].add(w),m[j].add(S),m[C].add(S),m[T].add(S))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let j=0,C=b.length;j<C;++j){const T=b[j],V=T.start,G=T.count;for(let z=V,X=V+G;z<X;z+=3)x(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const R=new oe,D=new oe,$=new oe,I=new oe;function L(j){$.fromBufferAttribute(o,j),I.copy($);const C=f[j];R.copy(C),R.sub($.multiplyScalar($.dot(C))).normalize(),D.crossVectors(I,C);const V=D.dot(m[j])<0?-1:1;u.setXYZW(j,R.x,R.y,R.z,V)}for(let j=0,C=b.length;j<C;++j){const T=b[j],V=T.start,G=T.count;for(let z=V,X=V+G;z<X;z+=3)L(e.getX(z+0)),L(e.getX(z+1)),L(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",s);else for(let _=0,M=s.count;_<M;_++)s.setXYZ(_,0,0,0);const o=new oe,l=new oe,u=new oe,f=new oe,m=new oe,p=new oe,g=new oe,y=new oe;if(e)for(let _=0,M=e.count;_<M;_+=3){const E=e.getX(_+0),w=e.getX(_+1),S=e.getX(_+2);o.fromBufferAttribute(t,E),l.fromBufferAttribute(t,w),u.fromBufferAttribute(t,S),g.subVectors(u,l),y.subVectors(o,l),g.cross(y),f.fromBufferAttribute(s,E),m.fromBufferAttribute(s,w),p.fromBufferAttribute(s,S),f.add(g),m.add(g),p.add(g),s.setXYZ(E,f.x,f.y,f.z),s.setXYZ(w,m.x,m.y,m.z),s.setXYZ(S,p.x,p.y,p.z)}else for(let _=0,M=t.count;_<M;_+=3)o.fromBufferAttribute(t,_+0),l.fromBufferAttribute(t,_+1),u.fromBufferAttribute(t,_+2),g.subVectors(u,l),y.subVectors(o,l),g.cross(y),s.setXYZ(_+0,g.x,g.y,g.z),s.setXYZ(_+1,g.x,g.y,g.z),s.setXYZ(_+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,s=e.count;t<s;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(f,m){const p=f.array,g=f.itemSize,y=f.normalized,_=new p.constructor(m.length*g);let M=0,E=0;for(let w=0,S=m.length;w<S;w++){f.isInterleavedBufferAttribute?M=m[w]*f.data.stride+f.offset:M=m[w]*g;for(let x=0;x<g;x++)_[E++]=p[M++]}return new Bn(_,g,y)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Hi,s=this.index.array,o=this.attributes;for(const f in o){const m=o[f],p=e(m,s);t.setAttribute(f,p)}const l=this.morphAttributes;for(const f in l){const m=[],p=l[f];for(let g=0,y=p.length;g<y;g++){const _=p[g],M=e(_,s);m.push(M)}t.morphAttributes[f]=m}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let f=0,m=u.length;f<m;f++){const p=u[f];t.addGroup(p.start,p.count,p.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const s=this.attributes;for(const m in s){const p=s[m];e.data.attributes[m]=p.toJSON(e.data)}const o={};let l=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let y=0,_=p.length;y<_;y++){const M=p[y];g.push(M.toJSON(e.data))}g.length>0&&(o[m]=g,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere={center:f.center.toArray(),radius:f.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(t));const o=e.attributes;for(const p in o){const g=o[p];this.setAttribute(p,g.clone(t))}const l=e.morphAttributes;for(const p in l){const g=[],y=l[p];for(let _=0,M=y.length;_<M;_++)g.push(y[_].clone(t));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let p=0,g=u.length;p<g;p++){const y=u[p];this.addGroup(y.start,y.count,y.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zm=new Bt,Hr=new fS,Al=new Yd,Bm=new oe,js=new oe,Hs=new oe,Vs=new oe,md=new oe,Cl=new oe,bl=new xt,Rl=new xt,Nl=new xt,jm=new oe,Hm=new oe,Vm=new oe,Pl=new oe,Ll=new oe;class _i extends gn{constructor(e=new Hi,t=new iv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,s=Object.keys(t);if(s.length>0){const o=t[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=o.length;l<u;l++){const f=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const s=this.geometry,o=s.attributes.position,l=s.morphAttributes.position,u=s.morphTargetsRelative;t.fromBufferAttribute(o,e);const f=this.morphTargetInfluences;if(l&&f){Cl.set(0,0,0);for(let m=0,p=l.length;m<p;m++){const g=f[m],y=l[m];g!==0&&(md.fromBufferAttribute(y,e),u?Cl.addScaledVector(md,g):Cl.addScaledVector(md.sub(t),g))}t.add(Cl)}return t}raycast(e,t){const s=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Al.copy(s.boundingSphere),Al.applyMatrix4(l),Hr.copy(e.ray).recast(e.near),!(Al.containsPoint(Hr.origin)===!1&&(Hr.intersectSphere(Al,Bm)===null||Hr.origin.distanceToSquared(Bm)>(e.far-e.near)**2))&&(zm.copy(l).invert(),Hr.copy(e.ray).applyMatrix4(zm),!(s.boundingBox!==null&&Hr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,t,Hr)))}_computeIntersections(e,t,s){let o;const l=this.geometry,u=this.material,f=l.index,m=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,y=l.attributes.normal,_=l.groups,M=l.drawRange;if(f!==null)if(Array.isArray(u))for(let E=0,w=_.length;E<w;E++){const S=_[E],x=u[S.materialIndex],b=Math.max(S.start,M.start),R=Math.min(f.count,Math.min(S.start+S.count,M.start+M.count));for(let D=b,$=R;D<$;D+=3){const I=f.getX(D),L=f.getX(D+1),j=f.getX(D+2);o=Dl(this,x,e,s,p,g,y,I,L,j),o&&(o.faceIndex=Math.floor(D/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(f.count,M.start+M.count);for(let S=E,x=w;S<x;S+=3){const b=f.getX(S),R=f.getX(S+1),D=f.getX(S+2);o=Dl(this,u,e,s,p,g,y,b,R,D),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}else if(m!==void 0)if(Array.isArray(u))for(let E=0,w=_.length;E<w;E++){const S=_[E],x=u[S.materialIndex],b=Math.max(S.start,M.start),R=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let D=b,$=R;D<$;D+=3){const I=D,L=D+1,j=D+2;o=Dl(this,x,e,s,p,g,y,I,L,j),o&&(o.faceIndex=Math.floor(D/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(m.count,M.start+M.count);for(let S=E,x=w;S<x;S+=3){const b=S,R=S+1,D=S+2;o=Dl(this,u,e,s,p,g,y,b,R,D),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}}}function SS(r,e,t,s,o,l,u,f){let m;if(e.side===Rn?m=s.intersectTriangle(u,l,o,!0,f):m=s.intersectTriangle(o,l,u,e.side===Sr,f),m===null)return null;Ll.copy(f),Ll.applyMatrix4(r.matrixWorld);const p=t.ray.origin.distanceTo(Ll);return p<t.near||p>t.far?null:{distance:p,point:Ll.clone(),object:r}}function Dl(r,e,t,s,o,l,u,f,m,p){r.getVertexPosition(f,js),r.getVertexPosition(m,Hs),r.getVertexPosition(p,Vs);const g=SS(r,e,t,s,js,Hs,Vs,Pl);if(g){o&&(bl.fromBufferAttribute(o,f),Rl.fromBufferAttribute(o,m),Nl.fromBufferAttribute(o,p),g.uv=gi.getInterpolation(Pl,js,Hs,Vs,bl,Rl,Nl,new xt)),l&&(bl.fromBufferAttribute(l,f),Rl.fromBufferAttribute(l,m),Nl.fromBufferAttribute(l,p),g.uv1=gi.getInterpolation(Pl,js,Hs,Vs,bl,Rl,Nl,new xt)),u&&(jm.fromBufferAttribute(u,f),Hm.fromBufferAttribute(u,m),Vm.fromBufferAttribute(u,p),g.normal=gi.getInterpolation(Pl,js,Hs,Vs,jm,Hm,Vm,new oe),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const y={a:f,b:m,c:p,normal:new oe,materialIndex:0};gi.getNormal(js,Hs,Vs,y.normal),g.face=y}return g}class so extends Hi{constructor(e=1,t=1,s=1,o=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:s,widthSegments:o,heightSegments:l,depthSegments:u};const f=this;o=Math.floor(o),l=Math.floor(l),u=Math.floor(u);const m=[],p=[],g=[],y=[];let _=0,M=0;E("z","y","x",-1,-1,s,t,e,u,l,0),E("z","y","x",1,-1,s,t,-e,u,l,1),E("x","z","y",1,1,e,s,t,o,u,2),E("x","z","y",1,-1,e,s,-t,o,u,3),E("x","y","z",1,-1,e,t,s,o,l,4),E("x","y","z",-1,-1,e,t,-s,o,l,5),this.setIndex(m),this.setAttribute("position",new Bi(p,3)),this.setAttribute("normal",new Bi(g,3)),this.setAttribute("uv",new Bi(y,2));function E(w,S,x,b,R,D,$,I,L,j,C){const T=D/L,V=$/j,G=D/2,z=$/2,X=I/2,Y=L+1,le=j+1;let fe=0,k=0;const de=new oe;for(let ne=0;ne<le;ne++){const O=ne*V-z;for(let ae=0;ae<Y;ae++){const Ue=ae*T-G;de[w]=Ue*b,de[S]=O*R,de[x]=X,p.push(de.x,de.y,de.z),de[w]=0,de[S]=0,de[x]=I>0?1:-1,g.push(de.x,de.y,de.z),y.push(ae/L),y.push(1-ne/j),fe+=1}}for(let ne=0;ne<j;ne++)for(let O=0;O<L;O++){const ae=_+O+Y*ne,Ue=_+O+Y*(ne+1),Q=_+(O+1)+Y*(ne+1),pe=_+(O+1)+Y*ne;m.push(ae,Ue,pe),m.push(Ue,Q,pe),k+=6}f.addGroup(M,k,C),M+=k,_+=fe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new so(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ia(r){const e={};for(const t in r){e[t]={};for(const s in r[t]){const o=r[t][s];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][s]=null):e[t][s]=o.clone():Array.isArray(o)?e[t][s]=o.slice():e[t][s]=o}}return e}function xn(r){const e={};for(let t=0;t<r.length;t++){const s=ia(r[t]);for(const o in s)e[o]=s[o]}return e}function MS(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function av(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}const ES={clone:ia,merge:xn};var wS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,TS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Er extends ro{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wS,this.fragmentShader=TS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ia(e.uniforms),this.uniformsGroups=MS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const u=this.uniforms[o].value;u&&u.isTexture?t.uniforms[o]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[o]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[o]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[o]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[o]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[o]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[o]={type:"m4",value:u.toArray()}:t.uniforms[o]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const s={};for(const o in this.extensions)this.extensions[o]===!0&&(s[o]=!0);return Object.keys(s).length>0&&(t.extensions=s),t}}class ov extends gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=zi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gr=new oe,Gm=new xt,Wm=new xt;class qn extends ov{constructor(e=50,t=1,s=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fd*2*Math.atan(Math.tan(Zu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,s){gr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gr.x,gr.y).multiplyScalar(-e/gr.z),gr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(gr.x,gr.y).multiplyScalar(-e/gr.z)}getViewSize(e,t){return this.getViewBounds(e,Gm,Wm),t.subVectors(Wm,Gm)}setViewOffset(e,t,s,o,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zu*.5*this.fov)/this.zoom,s=2*t,o=this.aspect*s,l=-.5*o;const u=this.view;if(this.view!==null&&this.view.enabled){const m=u.fullWidth,p=u.fullHeight;l+=u.offsetX*o/m,t-=u.offsetY*s/p,o*=u.width/m,s*=u.height/p}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,t,t-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Gs=-90,Ws=1;class AS extends gn{constructor(e,t,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new qn(Gs,Ws,e,t);o.layers=this.layers,this.add(o);const l=new qn(Gs,Ws,e,t);l.layers=this.layers,this.add(l);const u=new qn(Gs,Ws,e,t);u.layers=this.layers,this.add(u);const f=new qn(Gs,Ws,e,t);f.layers=this.layers,this.add(f);const m=new qn(Gs,Ws,e,t);m.layers=this.layers,this.add(m);const p=new qn(Gs,Ws,e,t);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[s,o,l,u,f,m]=t;for(const p of t)this.remove(p);if(e===zi)s.up.set(0,1,0),s.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===$l)s.up.set(0,-1,0),s.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of t)this.add(p),p.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,f,m,p,g]=this.children,y=e.getRenderTarget(),_=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const w=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,o),e.render(t,l),e.setRenderTarget(s,1,o),e.render(t,u),e.setRenderTarget(s,2,o),e.render(t,f),e.setRenderTarget(s,3,o),e.render(t,m),e.setRenderTarget(s,4,o),e.render(t,p),s.texture.generateMipmaps=w,e.setRenderTarget(s,5,o),e.render(t,g),e.setRenderTarget(y,_,M),e.xr.enabled=E,s.texture.needsPMREMUpdate=!0}}class lv extends Nn{constructor(e,t,s,o,l,u,f,m,p,g){e=e!==void 0?e:[],t=t!==void 0?t:ea,super(e,t,s,o,l,u,f,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class CS extends ns{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},o=[s,s,s,s,s,s];this.texture=new lv(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:oi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new so(5,5,5),l=new Er({name:"CubemapFromEquirect",uniforms:ia(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Rn,blending:xr});l.uniforms.tEquirect.value=t;const u=new _i(o,l),f=t.minFilter;return t.minFilter===Jr&&(t.minFilter=oi),new AS(1,10,this).update(e,u),t.minFilter=f,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,s,o){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,s,o);e.setRenderTarget(l)}}const gd=new oe,bS=new oe,RS=new ct;class Xr{constructor(e=new oe(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,s,o){return this.normal.set(e,t,s),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,s){const o=gd.subVectors(s,t).cross(bS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const s=e.delta(gd),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/o;return l<0||l>1?null:t.copy(e.start).addScaledVector(s,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return t<0&&s>0||s<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const s=t||RS.getNormalMatrix(e),o=this.coplanarPoint(gd).applyMatrix4(e),l=this.normal.applyMatrix3(s).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new Yd,Ul=new oe;class Kd{constructor(e=new Xr,t=new Xr,s=new Xr,o=new Xr,l=new Xr,u=new Xr){this.planes=[e,t,s,o,l,u]}set(e,t,s,o,l,u){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(s),f[3].copy(o),f[4].copy(l),f[5].copy(u),this}copy(e){const t=this.planes;for(let s=0;s<6;s++)t[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,t=zi){const s=this.planes,o=e.elements,l=o[0],u=o[1],f=o[2],m=o[3],p=o[4],g=o[5],y=o[6],_=o[7],M=o[8],E=o[9],w=o[10],S=o[11],x=o[12],b=o[13],R=o[14],D=o[15];if(s[0].setComponents(m-l,_-p,S-M,D-x).normalize(),s[1].setComponents(m+l,_+p,S+M,D+x).normalize(),s[2].setComponents(m+u,_+g,S+E,D+b).normalize(),s[3].setComponents(m-u,_-g,S-E,D-b).normalize(),s[4].setComponents(m-f,_-y,S-w,D-R).normalize(),t===zi)s[5].setComponents(m+f,_+y,S+w,D+R).normalize();else if(t===$l)s[5].setComponents(f,y,w,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const t=this.planes,s=e.center,o=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(s)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let s=0;s<6;s++){const o=t[s];if(Ul.x=o.normal.x>0?e.max.x:e.min.x,Ul.y=o.normal.y>0?e.max.y:e.min.y,Ul.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Ul)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let s=0;s<6;s++)if(t[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function cv(){let r=null,e=!1,t=null,s=null;function o(l,u){t(l,u),s=r.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(s=r.requestAnimationFrame(o),e=!0)},stop:function(){r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){r=l}}}function NS(r){const e=new WeakMap;function t(f,m){const p=f.array,g=f.usage,y=p.byteLength,_=r.createBuffer();r.bindBuffer(m,_),r.bufferData(m,p,g),f.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(p instanceof Uint16Array)f.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:_,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:f.version,size:y}}function s(f,m,p){const g=m.array,y=m._updateRange,_=m.updateRanges;if(r.bindBuffer(p,f),y.count===-1&&_.length===0&&r.bufferSubData(p,0,g),_.length!==0){for(let M=0,E=_.length;M<E;M++){const w=_[M];r.bufferSubData(p,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}m.clearUpdateRanges()}y.count!==-1&&(r.bufferSubData(p,y.offset*g.BYTES_PER_ELEMENT,g,y.offset,y.count),y.count=-1),m.onUploadCallback()}function o(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const m=e.get(f);m&&(r.deleteBuffer(m.buffer),e.delete(f))}function u(f,m){if(f.isGLBufferAttribute){const g=e.get(f);(!g||g.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}f.isInterleavedBufferAttribute&&(f=f.data);const p=e.get(f);if(p===void 0)e.set(f,t(f,m));else if(p.version<f.version){if(p.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,f,m),p.version=f.version}}return{get:o,remove:l,update:u}}class tc extends Hi{constructor(e=1,t=1,s=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:s,heightSegments:o};const l=e/2,u=t/2,f=Math.floor(s),m=Math.floor(o),p=f+1,g=m+1,y=e/f,_=t/m,M=[],E=[],w=[],S=[];for(let x=0;x<g;x++){const b=x*_-u;for(let R=0;R<p;R++){const D=R*y-l;E.push(D,-b,0),w.push(0,0,1),S.push(R/f),S.push(1-x/m)}}for(let x=0;x<m;x++)for(let b=0;b<f;b++){const R=b+p*x,D=b+p*(x+1),$=b+1+p*(x+1),I=b+1+p*x;M.push(R,D,I),M.push(D,$,I)}this.setIndex(M),this.setAttribute("position",new Bi(E,3)),this.setAttribute("normal",new Bi(w,3)),this.setAttribute("uv",new Bi(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tc(e.width,e.height,e.widthSegments,e.heightSegments)}}var PS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,LS=`#ifdef USE_ALPHAHASH
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
#endif`,DS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,US=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,IS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,FS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,OS=`#ifdef USE_AOMAP
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
#endif`,kS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zS=`#ifdef USE_BATCHING
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
#endif`,BS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,jS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,HS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,VS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,GS=`#ifdef USE_IRIDESCENCE
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
#endif`,WS=`#ifdef USE_BUMPMAP
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
#endif`,XS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$S=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,YS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,KS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ZS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,JS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,QS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,eM=`#define PI 3.141592653589793
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
} // validated`,tM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,nM=`vec3 transformedNormal = objectNormal;
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
#endif`,iM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,aM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,oM="gl_FragColor = linearToOutputTexel( gl_FragColor );",lM=`
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
}`,cM=`#ifdef USE_ENVMAP
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
#endif`,uM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dM=`#ifdef USE_ENVMAP
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
#endif`,fM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hM=`#ifdef USE_ENVMAP
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
#endif`,pM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_M=`#ifdef USE_GRADIENTMAP
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
}`,xM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,SM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,MM=`uniform bool receiveShadow;
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
#endif`,EM=`#ifdef USE_ENVMAP
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
#endif`,wM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,TM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,AM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,CM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bM=`PhysicalMaterial material;
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
#endif`,RM=`struct PhysicalMaterial {
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
}`,NM=`
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
#endif`,PM=`#if defined( RE_IndirectDiffuse )
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
#endif`,LM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,DM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,UM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,FM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,OM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,kM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,BM=`#if defined( USE_POINTS_UV )
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
#endif`,jM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,HM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,VM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,GM=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,WM=`#ifdef USE_MORPHNORMALS
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
#endif`,XM=`#ifdef USE_MORPHTARGETS
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
#endif`,$M=`#ifdef USE_MORPHTARGETS
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
#endif`,qM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,YM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,KM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,QM=`#ifdef USE_NORMALMAP
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
#endif`,eE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,aE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,oE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,uE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,mE=`float getShadowMask() {
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
}`,gE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vE=`#ifdef USE_SKINNING
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
#endif`,_E=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xE=`#ifdef USE_SKINNING
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
#endif`,yE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,SE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ME=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,EE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,wE=`#ifdef USE_TRANSMISSION
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
#endif`,TE=`#ifdef USE_TRANSMISSION
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
#endif`,AE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,CE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const NE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,PE=`uniform sampler2D t2D;
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
}`,LE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,DE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,UE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,FE=`#include <common>
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
}`,OE=`#if DEPTH_PACKING == 3200
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
}`,kE=`#define DISTANCE
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
}`,zE=`#define DISTANCE
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
}`,BE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,jE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HE=`uniform float scale;
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
}`,VE=`uniform vec3 diffuse;
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
}`,GE=`#include <common>
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
}`,WE=`uniform vec3 diffuse;
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
}`,XE=`#define LAMBERT
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
}`,$E=`#define LAMBERT
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
}`,qE=`#define MATCAP
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
}`,YE=`#define MATCAP
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
}`,KE=`#define NORMAL
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
}`,ZE=`#define NORMAL
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
}`,JE=`#define PHONG
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
}`,QE=`#define PHONG
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
}`,ew=`#define STANDARD
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
}`,tw=`#define STANDARD
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
}`,nw=`#define TOON
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
}`,iw=`#define TOON
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
}`,rw=`uniform float size;
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
}`,sw=`uniform vec3 diffuse;
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
}`,aw=`#include <common>
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
}`,ow=`uniform vec3 color;
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
}`,lw=`uniform float rotation;
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
}`,cw=`uniform vec3 diffuse;
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
}`,lt={alphahash_fragment:PS,alphahash_pars_fragment:LS,alphamap_fragment:DS,alphamap_pars_fragment:US,alphatest_fragment:IS,alphatest_pars_fragment:FS,aomap_fragment:OS,aomap_pars_fragment:kS,batching_pars_vertex:zS,batching_vertex:BS,begin_vertex:jS,beginnormal_vertex:HS,bsdfs:VS,iridescence_fragment:GS,bumpmap_pars_fragment:WS,clipping_planes_fragment:XS,clipping_planes_pars_fragment:$S,clipping_planes_pars_vertex:qS,clipping_planes_vertex:YS,color_fragment:KS,color_pars_fragment:ZS,color_pars_vertex:JS,color_vertex:QS,common:eM,cube_uv_reflection_fragment:tM,defaultnormal_vertex:nM,displacementmap_pars_vertex:iM,displacementmap_vertex:rM,emissivemap_fragment:sM,emissivemap_pars_fragment:aM,colorspace_fragment:oM,colorspace_pars_fragment:lM,envmap_fragment:cM,envmap_common_pars_fragment:uM,envmap_pars_fragment:dM,envmap_pars_vertex:fM,envmap_physical_pars_fragment:EM,envmap_vertex:hM,fog_vertex:pM,fog_pars_vertex:mM,fog_fragment:gM,fog_pars_fragment:vM,gradientmap_pars_fragment:_M,lightmap_pars_fragment:xM,lights_lambert_fragment:yM,lights_lambert_pars_fragment:SM,lights_pars_begin:MM,lights_toon_fragment:wM,lights_toon_pars_fragment:TM,lights_phong_fragment:AM,lights_phong_pars_fragment:CM,lights_physical_fragment:bM,lights_physical_pars_fragment:RM,lights_fragment_begin:NM,lights_fragment_maps:PM,lights_fragment_end:LM,logdepthbuf_fragment:DM,logdepthbuf_pars_fragment:UM,logdepthbuf_pars_vertex:IM,logdepthbuf_vertex:FM,map_fragment:OM,map_pars_fragment:kM,map_particle_fragment:zM,map_particle_pars_fragment:BM,metalnessmap_fragment:jM,metalnessmap_pars_fragment:HM,morphinstance_vertex:VM,morphcolor_vertex:GM,morphnormal_vertex:WM,morphtarget_pars_vertex:XM,morphtarget_vertex:$M,normal_fragment_begin:qM,normal_fragment_maps:YM,normal_pars_fragment:KM,normal_pars_vertex:ZM,normal_vertex:JM,normalmap_pars_fragment:QM,clearcoat_normal_fragment_begin:eE,clearcoat_normal_fragment_maps:tE,clearcoat_pars_fragment:nE,iridescence_pars_fragment:iE,opaque_fragment:rE,packing:sE,premultiplied_alpha_fragment:aE,project_vertex:oE,dithering_fragment:lE,dithering_pars_fragment:cE,roughnessmap_fragment:uE,roughnessmap_pars_fragment:dE,shadowmap_pars_fragment:fE,shadowmap_pars_vertex:hE,shadowmap_vertex:pE,shadowmask_pars_fragment:mE,skinbase_vertex:gE,skinning_pars_vertex:vE,skinning_vertex:_E,skinnormal_vertex:xE,specularmap_fragment:yE,specularmap_pars_fragment:SE,tonemapping_fragment:ME,tonemapping_pars_fragment:EE,transmission_fragment:wE,transmission_pars_fragment:TE,uv_pars_fragment:AE,uv_pars_vertex:CE,uv_vertex:bE,worldpos_vertex:RE,background_vert:NE,background_frag:PE,backgroundCube_vert:LE,backgroundCube_frag:DE,cube_vert:UE,cube_frag:IE,depth_vert:FE,depth_frag:OE,distanceRGBA_vert:kE,distanceRGBA_frag:zE,equirect_vert:BE,equirect_frag:jE,linedashed_vert:HE,linedashed_frag:VE,meshbasic_vert:GE,meshbasic_frag:WE,meshlambert_vert:XE,meshlambert_frag:$E,meshmatcap_vert:qE,meshmatcap_frag:YE,meshnormal_vert:KE,meshnormal_frag:ZE,meshphong_vert:JE,meshphong_frag:QE,meshphysical_vert:ew,meshphysical_frag:tw,meshtoon_vert:nw,meshtoon_frag:iw,points_vert:rw,points_frag:sw,shadow_vert:aw,shadow_frag:ow,sprite_vert:lw,sprite_frag:cw},De={common:{diffuse:{value:new Mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ct}},envmap:{envMap:{value:null},envMapRotation:{value:new ct},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ct},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0},uvTransform:{value:new ct}},sprite:{diffuse:{value:new Mt(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}}},pi={basic:{uniforms:xn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.fog]),vertexShader:lt.meshbasic_vert,fragmentShader:lt.meshbasic_frag},lambert:{uniforms:xn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new Mt(0)}}]),vertexShader:lt.meshlambert_vert,fragmentShader:lt.meshlambert_frag},phong:{uniforms:xn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new Mt(0)},specular:{value:new Mt(1118481)},shininess:{value:30}}]),vertexShader:lt.meshphong_vert,fragmentShader:lt.meshphong_frag},standard:{uniforms:xn([De.common,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.roughnessmap,De.metalnessmap,De.fog,De.lights,{emissive:{value:new Mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag},toon:{uniforms:xn([De.common,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.gradientmap,De.fog,De.lights,{emissive:{value:new Mt(0)}}]),vertexShader:lt.meshtoon_vert,fragmentShader:lt.meshtoon_frag},matcap:{uniforms:xn([De.common,De.bumpmap,De.normalmap,De.displacementmap,De.fog,{matcap:{value:null}}]),vertexShader:lt.meshmatcap_vert,fragmentShader:lt.meshmatcap_frag},points:{uniforms:xn([De.points,De.fog]),vertexShader:lt.points_vert,fragmentShader:lt.points_frag},dashed:{uniforms:xn([De.common,De.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:lt.linedashed_vert,fragmentShader:lt.linedashed_frag},depth:{uniforms:xn([De.common,De.displacementmap]),vertexShader:lt.depth_vert,fragmentShader:lt.depth_frag},normal:{uniforms:xn([De.common,De.bumpmap,De.normalmap,De.displacementmap,{opacity:{value:1}}]),vertexShader:lt.meshnormal_vert,fragmentShader:lt.meshnormal_frag},sprite:{uniforms:xn([De.sprite,De.fog]),vertexShader:lt.sprite_vert,fragmentShader:lt.sprite_frag},background:{uniforms:{uvTransform:{value:new ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:lt.background_vert,fragmentShader:lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ct}},vertexShader:lt.backgroundCube_vert,fragmentShader:lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:lt.cube_vert,fragmentShader:lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:lt.equirect_vert,fragmentShader:lt.equirect_frag},distanceRGBA:{uniforms:xn([De.common,De.displacementmap,{referencePosition:{value:new oe},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:lt.distanceRGBA_vert,fragmentShader:lt.distanceRGBA_frag},shadow:{uniforms:xn([De.lights,De.fog,{color:{value:new Mt(0)},opacity:{value:1}}]),vertexShader:lt.shadow_vert,fragmentShader:lt.shadow_frag}};pi.physical={uniforms:xn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ct},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ct},sheen:{value:0},sheenColor:{value:new Mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ct},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ct},attenuationDistance:{value:0},attenuationColor:{value:new Mt(0)},specularColor:{value:new Mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ct},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ct}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag};const Il={r:0,b:0,g:0},Gr=new Si,uw=new Bt;function dw(r,e,t,s,o,l,u){const f=new Mt(0);let m=l===!0?0:1,p,g,y=null,_=0,M=null;function E(b){let R=b.isScene===!0?b.background:null;return R&&R.isTexture&&(R=(b.backgroundBlurriness>0?t:e).get(R)),R}function w(b){let R=!1;const D=E(b);D===null?x(f,m):D&&D.isColor&&(x(D,1),R=!0);const $=r.xr.getEnvironmentBlendMode();$==="additive"?s.buffers.color.setClear(0,0,0,1,u):$==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,u),(r.autoClear||R)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil)}function S(b,R){const D=E(R);D&&(D.isCubeTexture||D.mapping===Jl)?(g===void 0&&(g=new _i(new so(1,1,1),new Er({name:"BackgroundCubeMaterial",uniforms:ia(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function($,I,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(g)),Gr.copy(R.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),g.material.uniforms.envMap.value=D,g.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(uw.makeRotationFromEuler(Gr)),g.material.toneMapped=Tt.getTransfer(D.colorSpace)!==Lt,(y!==D||_!==D.version||M!==r.toneMapping)&&(g.material.needsUpdate=!0,y=D,_=D.version,M=r.toneMapping),g.layers.enableAll(),b.unshift(g,g.geometry,g.material,0,0,null)):D&&D.isTexture&&(p===void 0&&(p=new _i(new tc(2,2),new Er({name:"BackgroundMaterial",uniforms:ia(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(p)),p.material.uniforms.t2D.value=D,p.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,p.material.toneMapped=Tt.getTransfer(D.colorSpace)!==Lt,D.matrixAutoUpdate===!0&&D.updateMatrix(),p.material.uniforms.uvTransform.value.copy(D.matrix),(y!==D||_!==D.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,y=D,_=D.version,M=r.toneMapping),p.layers.enableAll(),b.unshift(p,p.geometry,p.material,0,0,null))}function x(b,R){b.getRGB(Il,av(r)),s.buffers.color.setClear(Il.r,Il.g,Il.b,R,u)}return{getClearColor:function(){return f},setClearColor:function(b,R=1){f.set(b),m=R,x(f,m)},getClearAlpha:function(){return m},setClearAlpha:function(b){m=b,x(f,m)},render:w,addToRenderList:S}}function fw(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},o=_(null);let l=o,u=!1;function f(T,V,G,z,X){let Y=!1;const le=y(z,G,V);l!==le&&(l=le,p(l.object)),Y=M(T,z,G,X),Y&&E(T,z,G,X),X!==null&&e.update(X,r.ELEMENT_ARRAY_BUFFER),(Y||u)&&(u=!1,D(T,V,G,z),X!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function m(){return r.createVertexArray()}function p(T){return r.bindVertexArray(T)}function g(T){return r.deleteVertexArray(T)}function y(T,V,G){const z=G.wireframe===!0;let X=s[T.id];X===void 0&&(X={},s[T.id]=X);let Y=X[V.id];Y===void 0&&(Y={},X[V.id]=Y);let le=Y[z];return le===void 0&&(le=_(m()),Y[z]=le),le}function _(T){const V=[],G=[],z=[];for(let X=0;X<t;X++)V[X]=0,G[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:G,attributeDivisors:z,object:T,attributes:{},index:null}}function M(T,V,G,z){const X=l.attributes,Y=V.attributes;let le=0;const fe=G.getAttributes();for(const k in fe)if(fe[k].location>=0){const ne=X[k];let O=Y[k];if(O===void 0&&(k==="instanceMatrix"&&T.instanceMatrix&&(O=T.instanceMatrix),k==="instanceColor"&&T.instanceColor&&(O=T.instanceColor)),ne===void 0||ne.attribute!==O||O&&ne.data!==O.data)return!0;le++}return l.attributesNum!==le||l.index!==z}function E(T,V,G,z){const X={},Y=V.attributes;let le=0;const fe=G.getAttributes();for(const k in fe)if(fe[k].location>=0){let ne=Y[k];ne===void 0&&(k==="instanceMatrix"&&T.instanceMatrix&&(ne=T.instanceMatrix),k==="instanceColor"&&T.instanceColor&&(ne=T.instanceColor));const O={};O.attribute=ne,ne&&ne.data&&(O.data=ne.data),X[k]=O,le++}l.attributes=X,l.attributesNum=le,l.index=z}function w(){const T=l.newAttributes;for(let V=0,G=T.length;V<G;V++)T[V]=0}function S(T){x(T,0)}function x(T,V){const G=l.newAttributes,z=l.enabledAttributes,X=l.attributeDivisors;G[T]=1,z[T]===0&&(r.enableVertexAttribArray(T),z[T]=1),X[T]!==V&&(r.vertexAttribDivisor(T,V),X[T]=V)}function b(){const T=l.newAttributes,V=l.enabledAttributes;for(let G=0,z=V.length;G<z;G++)V[G]!==T[G]&&(r.disableVertexAttribArray(G),V[G]=0)}function R(T,V,G,z,X,Y,le){le===!0?r.vertexAttribIPointer(T,V,G,X,Y):r.vertexAttribPointer(T,V,G,z,X,Y)}function D(T,V,G,z){w();const X=z.attributes,Y=G.getAttributes(),le=V.defaultAttributeValues;for(const fe in Y){const k=Y[fe];if(k.location>=0){let de=X[fe];if(de===void 0&&(fe==="instanceMatrix"&&T.instanceMatrix&&(de=T.instanceMatrix),fe==="instanceColor"&&T.instanceColor&&(de=T.instanceColor)),de!==void 0){const ne=de.normalized,O=de.itemSize,ae=e.get(de);if(ae===void 0)continue;const Ue=ae.buffer,Q=ae.type,pe=ae.bytesPerElement,he=Q===r.INT||Q===r.UNSIGNED_INT||de.gpuType===Gg;if(de.isInterleavedBufferAttribute){const ge=de.data,ke=ge.stride,je=de.offset;if(ge.isInstancedInterleavedBuffer){for(let K=0;K<k.locationSize;K++)x(k.location+K,ge.meshPerAttribute);T.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let K=0;K<k.locationSize;K++)S(k.location+K);r.bindBuffer(r.ARRAY_BUFFER,Ue);for(let K=0;K<k.locationSize;K++)R(k.location+K,O/k.locationSize,Q,ne,ke*pe,(je+O/k.locationSize*K)*pe,he)}else{if(de.isInstancedBufferAttribute){for(let ge=0;ge<k.locationSize;ge++)x(k.location+ge,de.meshPerAttribute);T.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let ge=0;ge<k.locationSize;ge++)S(k.location+ge);r.bindBuffer(r.ARRAY_BUFFER,Ue);for(let ge=0;ge<k.locationSize;ge++)R(k.location+ge,O/k.locationSize,Q,ne,O*pe,O/k.locationSize*ge*pe,he)}}else if(le!==void 0){const ne=le[fe];if(ne!==void 0)switch(ne.length){case 2:r.vertexAttrib2fv(k.location,ne);break;case 3:r.vertexAttrib3fv(k.location,ne);break;case 4:r.vertexAttrib4fv(k.location,ne);break;default:r.vertexAttrib1fv(k.location,ne)}}}}b()}function $(){j();for(const T in s){const V=s[T];for(const G in V){const z=V[G];for(const X in z)g(z[X].object),delete z[X];delete V[G]}delete s[T]}}function I(T){if(s[T.id]===void 0)return;const V=s[T.id];for(const G in V){const z=V[G];for(const X in z)g(z[X].object),delete z[X];delete V[G]}delete s[T.id]}function L(T){for(const V in s){const G=s[V];if(G[T.id]===void 0)continue;const z=G[T.id];for(const X in z)g(z[X].object),delete z[X];delete G[T.id]}}function j(){C(),u=!0,l!==o&&(l=o,p(l.object))}function C(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:f,reset:j,resetDefaultState:C,dispose:$,releaseStatesOfGeometry:I,releaseStatesOfProgram:L,initAttributes:w,enableAttribute:S,disableUnusedAttributes:b}}function hw(r,e,t){let s;function o(p){s=p}function l(p,g){r.drawArrays(s,p,g),t.update(g,s,1)}function u(p,g,y){y!==0&&(r.drawArraysInstanced(s,p,g,y),t.update(g,s,y))}function f(p,g,y){if(y===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let M=0;M<y;M++)this.render(p[M],g[M]);else{_.multiDrawArraysWEBGL(s,p,0,g,0,y);let M=0;for(let E=0;E<y;E++)M+=g[E];t.update(M,s,1)}}function m(p,g,y,_){if(y===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let E=0;E<p.length;E++)u(p[E],g[E],_[E]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,g,0,_,0,y);let E=0;for(let w=0;w<y;w++)E+=g[w];for(let w=0;w<_.length;w++)t.update(E,s,_[w])}}this.setMode=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=f,this.renderMultiDrawInstances=m}function pw(r,e,t,s){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");o=r.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function u(I){return!(I!==vi&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(I){const L=I===Ql&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Mr&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==_r&&!L)}function m(I){if(I==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=t.precision!==void 0?t.precision:"highp";const g=m(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const y=t.logarithmicDepthBuffer===!0,_=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_TEXTURE_SIZE),w=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),S=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),b=r.getParameter(r.MAX_VARYING_VECTORS),R=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),D=M>0,$=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:m,textureFormatReadable:u,textureTypeReadable:f,precision:p,logarithmicDepthBuffer:y,maxTextures:_,maxVertexTextures:M,maxTextureSize:E,maxCubemapSize:w,maxAttributes:S,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:R,vertexTextures:D,maxSamples:$}}function mw(r){const e=this;let t=null,s=0,o=!1,l=!1;const u=new Xr,f=new ct,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(y,_){const M=y.length!==0||_||s!==0||o;return o=_,s=y.length,M},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(y,_){t=g(y,_,0)},this.setState=function(y,_,M){const E=y.clippingPlanes,w=y.clipIntersection,S=y.clipShadows,x=r.get(y);if(!o||E===null||E.length===0||l&&!S)l?g(null):p();else{const b=l?0:s,R=b*4;let D=x.clippingState||null;m.value=D,D=g(E,_,R,M);for(let $=0;$!==R;++$)D[$]=t[$];x.clippingState=D,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=b}};function p(){m.value!==t&&(m.value=t,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(y,_,M,E){const w=y!==null?y.length:0;let S=null;if(w!==0){if(S=m.value,E!==!0||S===null){const x=M+w*4,b=_.matrixWorldInverse;f.getNormalMatrix(b),(S===null||S.length<x)&&(S=new Float32Array(x));for(let R=0,D=M;R!==w;++R,D+=4)u.copy(y[R]).applyMatrix4(b,f),u.normal.toArray(S,D),S[D+3]=u.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function gw(r){let e=new WeakMap;function t(u,f){return f===Ld?u.mapping=ea:f===Dd&&(u.mapping=ta),u}function s(u){if(u&&u.isTexture){const f=u.mapping;if(f===Ld||f===Dd)if(e.has(u)){const m=e.get(u).texture;return t(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const p=new CS(m.height);return p.fromEquirectangularTexture(r,u),e.set(u,p),u.addEventListener("dispose",o),t(p.texture,u.mapping)}else return null}}return u}function o(u){const f=u.target;f.removeEventListener("dispose",o);const m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function l(){e=new WeakMap}return{get:s,dispose:l}}class uv extends ov{constructor(e=-1,t=1,s=1,o=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=s,this.bottom=o,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,s,o,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=s-e,u=s+e,f=o+t,m=o-t;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,u=l+p*this.view.width,f-=g*this.view.offsetY,m=f-g*this.view.height}this.projectionMatrix.makeOrthographic(l,u,f,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const $s=4,Xm=[.125,.215,.35,.446,.526,.582],Yr=20,vd=new uv,$m=new Mt;let _d=null,xd=0,yd=0,Sd=!1;const $r=(1+Math.sqrt(5))/2,Xs=1/$r,qm=[new oe(-$r,Xs,0),new oe($r,Xs,0),new oe(-Xs,0,$r),new oe(Xs,0,$r),new oe(0,$r,-Xs),new oe(0,$r,Xs),new oe(-1,1,-1),new oe(1,1,-1),new oe(-1,1,1),new oe(1,1,1)];class Ym{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,s=.1,o=100){_d=this._renderer.getRenderTarget(),xd=this._renderer.getActiveCubeFace(),yd=this._renderer.getActiveMipmapLevel(),Sd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,s,o,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_d,xd,yd),this._renderer.xr.enabled=Sd,e.scissorTest=!1,Fl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ea||e.mapping===ta?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_d=this._renderer.getRenderTarget(),xd=this._renderer.getActiveCubeFace(),yd=this._renderer.getActiveMipmapLevel(),Sd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=t||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,s={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Ql,format:vi,colorSpace:Tr,depthBuffer:!1},o=Km(e,t,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Km(e,t,s);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vw(l)),this._blurMaterial=_w(l,e,t)}return o}_compileMaterial(e){const t=new _i(this._lodPlanes[0],e);this._renderer.compile(t,vd)}_sceneToCubeUV(e,t,s,o){const f=new qn(90,1,t,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,y=g.autoClear,_=g.toneMapping;g.getClearColor($m),g.toneMapping=yr,g.autoClear=!1;const M=new iv({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1}),E=new _i(new so,M);let w=!1;const S=e.background;S?S.isColor&&(M.color.copy(S),e.background=null,w=!0):(M.color.copy($m),w=!0);for(let x=0;x<6;x++){const b=x%3;b===0?(f.up.set(0,m[x],0),f.lookAt(p[x],0,0)):b===1?(f.up.set(0,0,m[x]),f.lookAt(0,p[x],0)):(f.up.set(0,m[x],0),f.lookAt(0,0,p[x]));const R=this._cubeSize;Fl(o,b*R,x>2?R:0,R,R),g.setRenderTarget(o),w&&g.render(E,f),g.render(e,f)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=_,g.autoClear=y,e.background=S}_textureToCubeUV(e,t){const s=this._renderer,o=e.mapping===ea||e.mapping===ta;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zm());const l=o?this._cubemapMaterial:this._equirectMaterial,u=new _i(this._lodPlanes[0],l),f=l.uniforms;f.envMap.value=e;const m=this._cubeSize;Fl(t,0,0,3*m,2*m),s.setRenderTarget(t),s.render(u,vd)}_applyPMREM(e){const t=this._renderer,s=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let l=1;l<o;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),f=qm[(o-l-1)%qm.length];this._blur(e,l-1,l,u,f)}t.autoClear=s}_blur(e,t,s,o,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,s,o,"latitudinal",l),this._halfBlur(u,e,s,s,o,"longitudinal",l)}_halfBlur(e,t,s,o,l,u,f){const m=this._renderer,p=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,y=new _i(this._lodPlanes[o],p),_=p.uniforms,M=this._sizeLods[s]-1,E=isFinite(l)?Math.PI/(2*M):2*Math.PI/(2*Yr-1),w=l/E,S=isFinite(l)?1+Math.floor(g*w):Yr;S>Yr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Yr}`);const x=[];let b=0;for(let L=0;L<Yr;++L){const j=L/w,C=Math.exp(-j*j/2);x.push(C),L===0?b+=C:L<S&&(b+=2*C)}for(let L=0;L<x.length;L++)x[L]=x[L]/b;_.envMap.value=e.texture,_.samples.value=S,_.weights.value=x,_.latitudinal.value=u==="latitudinal",f&&(_.poleAxis.value=f);const{_lodMax:R}=this;_.dTheta.value=E,_.mipInt.value=R-s;const D=this._sizeLods[o],$=3*D*(o>R-$s?o-R+$s:0),I=4*(this._cubeSize-D);Fl(t,$,I,3*D,2*D),m.setRenderTarget(t),m.render(y,vd)}}function vw(r){const e=[],t=[],s=[];let o=r;const l=r-$s+1+Xm.length;for(let u=0;u<l;u++){const f=Math.pow(2,o);t.push(f);let m=1/f;u>r-$s?m=Xm[u-r+$s-1]:u===0&&(m=0),s.push(m);const p=1/(f-2),g=-p,y=1+p,_=[g,g,y,g,y,y,g,g,y,y,g,y],M=6,E=6,w=3,S=2,x=1,b=new Float32Array(w*E*M),R=new Float32Array(S*E*M),D=new Float32Array(x*E*M);for(let I=0;I<M;I++){const L=I%3*2/3-1,j=I>2?0:-1,C=[L,j,0,L+2/3,j,0,L+2/3,j+1,0,L,j,0,L+2/3,j+1,0,L,j+1,0];b.set(C,w*E*I),R.set(_,S*E*I);const T=[I,I,I,I,I,I];D.set(T,x*E*I)}const $=new Hi;$.setAttribute("position",new Bn(b,w)),$.setAttribute("uv",new Bn(R,S)),$.setAttribute("faceIndex",new Bn(D,x)),e.push($),o>$s&&o--}return{lodPlanes:e,sizeLods:t,sigmas:s}}function Km(r,e,t){const s=new ns(r,e,t);return s.texture.mapping=Jl,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Fl(r,e,t,s,o){r.viewport.set(e,t,s,o),r.scissor.set(e,t,s,o)}function _w(r,e,t){const s=new Float32Array(Yr),o=new oe(0,1,0);return new Er({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Zd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Zm(){return new Er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Jm(){return new Er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Zd(){return`

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
	`}function xw(r){let e=new WeakMap,t=null;function s(f){if(f&&f.isTexture){const m=f.mapping,p=m===Ld||m===Dd,g=m===ea||m===ta;if(p||g){let y=e.get(f);const _=y!==void 0?y.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==_)return t===null&&(t=new Ym(r)),y=p?t.fromEquirectangular(f,y):t.fromCubemap(f,y),y.texture.pmremVersion=f.pmremVersion,e.set(f,y),y.texture;if(y!==void 0)return y.texture;{const M=f.image;return p&&M&&M.height>0||g&&M&&o(M)?(t===null&&(t=new Ym(r)),y=p?t.fromEquirectangular(f):t.fromCubemap(f),y.texture.pmremVersion=f.pmremVersion,e.set(f,y),f.addEventListener("dispose",l),y.texture):null}}}return f}function o(f){let m=0;const p=6;for(let g=0;g<p;g++)f[g]!==void 0&&m++;return m===p}function l(f){const m=f.target;m.removeEventListener("dispose",l);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:s,dispose:u}}function yw(r){const e={};function t(s){if(e[s]!==void 0)return e[s];let o;switch(s){case"WEBGL_depth_texture":o=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=r.getExtension(s)}return e[s]=o,o}return{has:function(s){return t(s)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(s){const o=t(s);return o===null&&console.warn("THREE.WebGLRenderer: "+s+" extension not supported."),o}}}function Sw(r,e,t,s){const o={},l=new WeakMap;function u(y){const _=y.target;_.index!==null&&e.remove(_.index);for(const E in _.attributes)e.remove(_.attributes[E]);for(const E in _.morphAttributes){const w=_.morphAttributes[E];for(let S=0,x=w.length;S<x;S++)e.remove(w[S])}_.removeEventListener("dispose",u),delete o[_.id];const M=l.get(_);M&&(e.remove(M),l.delete(_)),s.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function f(y,_){return o[_.id]===!0||(_.addEventListener("dispose",u),o[_.id]=!0,t.memory.geometries++),_}function m(y){const _=y.attributes;for(const E in _)e.update(_[E],r.ARRAY_BUFFER);const M=y.morphAttributes;for(const E in M){const w=M[E];for(let S=0,x=w.length;S<x;S++)e.update(w[S],r.ARRAY_BUFFER)}}function p(y){const _=[],M=y.index,E=y.attributes.position;let w=0;if(M!==null){const b=M.array;w=M.version;for(let R=0,D=b.length;R<D;R+=3){const $=b[R+0],I=b[R+1],L=b[R+2];_.push($,I,I,L,L,$)}}else if(E!==void 0){const b=E.array;w=E.version;for(let R=0,D=b.length/3-1;R<D;R+=3){const $=R+0,I=R+1,L=R+2;_.push($,I,I,L,L,$)}}else return;const S=new(Jg(_)?sv:rv)(_,1);S.version=w;const x=l.get(y);x&&e.remove(x),l.set(y,S)}function g(y){const _=l.get(y);if(_){const M=y.index;M!==null&&_.version<M.version&&p(y)}else p(y);return l.get(y)}return{get:f,update:m,getWireframeAttribute:g}}function Mw(r,e,t){let s;function o(_){s=_}let l,u;function f(_){l=_.type,u=_.bytesPerElement}function m(_,M){r.drawElements(s,M,l,_*u),t.update(M,s,1)}function p(_,M,E){E!==0&&(r.drawElementsInstanced(s,M,l,_*u,E),t.update(M,s,E))}function g(_,M,E){if(E===0)return;const w=e.get("WEBGL_multi_draw");if(w===null)for(let S=0;S<E;S++)this.render(_[S]/u,M[S]);else{w.multiDrawElementsWEBGL(s,M,0,l,_,0,E);let S=0;for(let x=0;x<E;x++)S+=M[x];t.update(S,s,1)}}function y(_,M,E,w){if(E===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let x=0;x<_.length;x++)p(_[x]/u,M[x],w[x]);else{S.multiDrawElementsInstancedWEBGL(s,M,0,l,_,0,w,0,E);let x=0;for(let b=0;b<E;b++)x+=M[b];for(let b=0;b<w.length;b++)t.update(x,s,w[b])}}this.setMode=o,this.setIndex=f,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=y}function Ew(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function s(l,u,f){switch(t.calls++,u){case r.TRIANGLES:t.triangles+=f*(l/3);break;case r.LINES:t.lines+=f*(l/2);break;case r.LINE_STRIP:t.lines+=f*(l-1);break;case r.LINE_LOOP:t.lines+=f*l;break;case r.POINTS:t.points+=f*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:s}}function ww(r,e,t){const s=new WeakMap,o=new rn;function l(u,f,m){const p=u.morphTargetInfluences,g=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,y=g!==void 0?g.length:0;let _=s.get(f);if(_===void 0||_.count!==y){let T=function(){j.dispose(),s.delete(f),f.removeEventListener("dispose",T)};var M=T;_!==void 0&&_.texture.dispose();const E=f.morphAttributes.position!==void 0,w=f.morphAttributes.normal!==void 0,S=f.morphAttributes.color!==void 0,x=f.morphAttributes.position||[],b=f.morphAttributes.normal||[],R=f.morphAttributes.color||[];let D=0;E===!0&&(D=1),w===!0&&(D=2),S===!0&&(D=3);let $=f.attributes.position.count*D,I=1;$>e.maxTextureSize&&(I=Math.ceil($/e.maxTextureSize),$=e.maxTextureSize);const L=new Float32Array($*I*4*y),j=new ev(L,$,I,y);j.type=_r,j.needsUpdate=!0;const C=D*4;for(let V=0;V<y;V++){const G=x[V],z=b[V],X=R[V],Y=$*I*4*V;for(let le=0;le<G.count;le++){const fe=le*C;E===!0&&(o.fromBufferAttribute(G,le),L[Y+fe+0]=o.x,L[Y+fe+1]=o.y,L[Y+fe+2]=o.z,L[Y+fe+3]=0),w===!0&&(o.fromBufferAttribute(z,le),L[Y+fe+4]=o.x,L[Y+fe+5]=o.y,L[Y+fe+6]=o.z,L[Y+fe+7]=0),S===!0&&(o.fromBufferAttribute(X,le),L[Y+fe+8]=o.x,L[Y+fe+9]=o.y,L[Y+fe+10]=o.z,L[Y+fe+11]=X.itemSize===4?o.w:1)}}_={count:y,texture:j,size:new xt($,I)},s.set(f,_),f.addEventListener("dispose",T)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",u.morphTexture,t);else{let E=0;for(let S=0;S<p.length;S++)E+=p[S];const w=f.morphTargetsRelative?1:1-E;m.getUniforms().setValue(r,"morphTargetBaseInfluence",w),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",_.texture,t),m.getUniforms().setValue(r,"morphTargetsTextureSize",_.size)}return{update:l}}function Tw(r,e,t,s){let o=new WeakMap;function l(m){const p=s.render.frame,g=m.geometry,y=e.get(m,g);if(o.get(y)!==p&&(e.update(y),o.set(y,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",f)===!1&&m.addEventListener("dispose",f),o.get(m)!==p&&(t.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&t.update(m.instanceColor,r.ARRAY_BUFFER),o.set(m,p))),m.isSkinnedMesh){const _=m.skeleton;o.get(_)!==p&&(_.update(),o.set(_,p))}return y}function u(){o=new WeakMap}function f(m){const p=m.target;p.removeEventListener("dispose",f),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:l,dispose:u}}class dv extends Nn{constructor(e,t,s,o,l,u,f,m,p,g){if(g=g!==void 0?g:Ks,g!==Ks&&g!==Qa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Ks&&(s=na),s===void 0&&g===Qa&&(s=to),super(null,o,l,u,f,m,g,s,p),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=f!==void 0?f:Kn,this.minFilter=m!==void 0?m:Kn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const fv=new Nn,hv=new dv(1,1);hv.compareFunction=Zg;const pv=new ev,mv=new uS,gv=new lv,Qm=[],eg=[],tg=new Float32Array(16),ng=new Float32Array(9),ig=new Float32Array(4);function oa(r,e,t){const s=r[0];if(s<=0||s>0)return r;const o=e*t;let l=Qm[o];if(l===void 0&&(l=new Float32Array(o),Qm[o]=l),e!==0){s.toArray(l,0);for(let u=1,f=0;u!==e;++u)f+=t,r[u].toArray(l,f)}return l}function Yt(r,e){if(r.length!==e.length)return!1;for(let t=0,s=r.length;t<s;t++)if(r[t]!==e[t])return!1;return!0}function Kt(r,e){for(let t=0,s=e.length;t<s;t++)r[t]=e[t]}function nc(r,e){let t=eg[e];t===void 0&&(t=new Int32Array(e),eg[e]=t);for(let s=0;s!==e;++s)t[s]=r.allocateTextureUnit();return t}function Aw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Cw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2fv(this.addr,e),Kt(t,e)}}function bw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;r.uniform3fv(this.addr,e),Kt(t,e)}}function Rw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4fv(this.addr,e),Kt(t,e)}}function Nw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;ig.set(s),r.uniformMatrix2fv(this.addr,!1,ig),Kt(t,s)}}function Pw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;ng.set(s),r.uniformMatrix3fv(this.addr,!1,ng),Kt(t,s)}}function Lw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;tg.set(s),r.uniformMatrix4fv(this.addr,!1,tg),Kt(t,s)}}function Dw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Uw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2iv(this.addr,e),Kt(t,e)}}function Iw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3iv(this.addr,e),Kt(t,e)}}function Fw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4iv(this.addr,e),Kt(t,e)}}function Ow(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function kw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2uiv(this.addr,e),Kt(t,e)}}function zw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3uiv(this.addr,e),Kt(t,e)}}function Bw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4uiv(this.addr,e),Kt(t,e)}}function jw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o);const l=this.type===r.SAMPLER_2D_SHADOW?hv:fv;t.setTexture2D(e||l,o)}function Hw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture3D(e||mv,o)}function Vw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTextureCube(e||gv,o)}function Gw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture2DArray(e||pv,o)}function Ww(r){switch(r){case 5126:return Aw;case 35664:return Cw;case 35665:return bw;case 35666:return Rw;case 35674:return Nw;case 35675:return Pw;case 35676:return Lw;case 5124:case 35670:return Dw;case 35667:case 35671:return Uw;case 35668:case 35672:return Iw;case 35669:case 35673:return Fw;case 5125:return Ow;case 36294:return kw;case 36295:return zw;case 36296:return Bw;case 35678:case 36198:case 36298:case 36306:case 35682:return jw;case 35679:case 36299:case 36307:return Hw;case 35680:case 36300:case 36308:case 36293:return Vw;case 36289:case 36303:case 36311:case 36292:return Gw}}function Xw(r,e){r.uniform1fv(this.addr,e)}function $w(r,e){const t=oa(e,this.size,2);r.uniform2fv(this.addr,t)}function qw(r,e){const t=oa(e,this.size,3);r.uniform3fv(this.addr,t)}function Yw(r,e){const t=oa(e,this.size,4);r.uniform4fv(this.addr,t)}function Kw(r,e){const t=oa(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Zw(r,e){const t=oa(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Jw(r,e){const t=oa(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Qw(r,e){r.uniform1iv(this.addr,e)}function eT(r,e){r.uniform2iv(this.addr,e)}function tT(r,e){r.uniform3iv(this.addr,e)}function nT(r,e){r.uniform4iv(this.addr,e)}function iT(r,e){r.uniform1uiv(this.addr,e)}function rT(r,e){r.uniform2uiv(this.addr,e)}function sT(r,e){r.uniform3uiv(this.addr,e)}function aT(r,e){r.uniform4uiv(this.addr,e)}function oT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture2D(e[u]||fv,l[u])}function lT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture3D(e[u]||mv,l[u])}function cT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTextureCube(e[u]||gv,l[u])}function uT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture2DArray(e[u]||pv,l[u])}function dT(r){switch(r){case 5126:return Xw;case 35664:return $w;case 35665:return qw;case 35666:return Yw;case 35674:return Kw;case 35675:return Zw;case 35676:return Jw;case 5124:case 35670:return Qw;case 35667:case 35671:return eT;case 35668:case 35672:return tT;case 35669:case 35673:return nT;case 5125:return iT;case 36294:return rT;case 36295:return sT;case 36296:return aT;case 35678:case 36198:case 36298:case 36306:case 35682:return oT;case 35679:case 36299:case 36307:return lT;case 35680:case 36300:case 36308:case 36293:return cT;case 36289:case 36303:case 36311:case 36292:return uT}}class fT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.setValue=Ww(t.type)}}class hT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dT(t.type)}}class pT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,s){const o=this.seq;for(let l=0,u=o.length;l!==u;++l){const f=o[l];f.setValue(e,t[f.id],s)}}}const Md=/(\w+)(\])?(\[|\.)?/g;function rg(r,e){r.seq.push(e),r.map[e.id]=e}function mT(r,e,t){const s=r.name,o=s.length;for(Md.lastIndex=0;;){const l=Md.exec(s),u=Md.lastIndex;let f=l[1];const m=l[2]==="]",p=l[3];if(m&&(f=f|0),p===void 0||p==="["&&u+2===o){rg(t,p===void 0?new fT(f,r,e):new hT(f,r,e));break}else{let y=t.map[f];y===void 0&&(y=new pT(f),rg(t,y)),t=y}}}class kl{constructor(e,t){this.seq=[],this.map={};const s=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<s;++o){const l=e.getActiveUniform(t,o),u=e.getUniformLocation(t,l.name);mT(l,u,this)}}setValue(e,t,s,o){const l=this.map[t];l!==void 0&&l.setValue(e,s,o)}setOptional(e,t,s){const o=t[s];o!==void 0&&this.setValue(e,s,o)}static upload(e,t,s,o){for(let l=0,u=t.length;l!==u;++l){const f=t[l],m=s[f.id];m.needsUpdate!==!1&&f.setValue(e,m.value,o)}}static seqWithValue(e,t){const s=[];for(let o=0,l=e.length;o!==l;++o){const u=e[o];u.id in t&&s.push(u)}return s}}function sg(r,e,t){const s=r.createShader(e);return r.shaderSource(s,t),r.compileShader(s),s}const gT=37297;let vT=0;function _T(r,e){const t=r.split(`
`),s=[],o=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=o;u<l;u++){const f=u+1;s.push(`${f===e?">":" "} ${f}: ${t[u]}`)}return s.join(`
`)}function xT(r){const e=Tt.getPrimaries(Tt.workingColorSpace),t=Tt.getPrimaries(r);let s;switch(e===t?s="":e===Xl&&t===Wl?s="LinearDisplayP3ToLinearSRGB":e===Wl&&t===Xl&&(s="LinearSRGBToLinearDisplayP3"),r){case Tr:case ec:return[s,"LinearTransferOETF"];case hi:case qd:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[s,"LinearTransferOETF"]}}function ag(r,e,t){const s=r.getShaderParameter(e,r.COMPILE_STATUS),o=r.getShaderInfoLog(e).trim();if(s&&o==="")return"";const l=/ERROR: 0:(\d+)/.exec(o);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+o+`

`+_T(r.getShaderSource(e),u)}else return o}function yT(r,e){const t=xT(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function ST(r,e){let t;switch(e){case by:t="Linear";break;case Ry:t="Reinhard";break;case Ny:t="OptimizedCineon";break;case Py:t="ACESFilmic";break;case Dy:t="AgX";break;case Uy:t="Neutral";break;case Ly:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function MT(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ya).join(`
`)}function ET(r){const e=[];for(const t in r){const s=r[t];s!==!1&&e.push("#define "+t+" "+s)}return e.join(`
`)}function wT(r,e){const t={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let o=0;o<s;o++){const l=r.getActiveAttrib(e,o),u=l.name;let f=1;l.type===r.FLOAT_MAT2&&(f=2),l.type===r.FLOAT_MAT3&&(f=3),l.type===r.FLOAT_MAT4&&(f=4),t[u]={type:l.type,location:r.getAttribLocation(e,u),locationSize:f}}return t}function Ya(r){return r!==""}function og(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lg(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const TT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Od(r){return r.replace(TT,CT)}const AT=new Map;function CT(r,e){let t=lt[e];if(t===void 0){const s=AT.get(e);if(s!==void 0)t=lt[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Od(t)}const bT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cg(r){return r.replace(bT,RT)}function RT(r,e,t,s){let o="";for(let l=parseInt(e);l<parseInt(t);l++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function ug(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function NT(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Bg?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===ey?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function PT(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case ea:case ta:e="ENVMAP_TYPE_CUBE";break;case Jl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function LT(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case ta:e="ENVMAP_MODE_REFRACTION";break}return e}function DT(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case jg:e="ENVMAP_BLENDING_MULTIPLY";break;case Ay:e="ENVMAP_BLENDING_MIX";break;case Cy:e="ENVMAP_BLENDING_ADD";break}return e}function UT(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:s,maxMip:t}}function IT(r,e,t,s){const o=r.getContext(),l=t.defines;let u=t.vertexShader,f=t.fragmentShader;const m=NT(t),p=PT(t),g=LT(t),y=DT(t),_=UT(t),M=MT(t),E=ET(l),w=o.createProgram();let S,x,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Ya).join(`
`),S.length>0&&(S+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Ya).join(`
`),x.length>0&&(x+=`
`)):(S=[ug(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+g:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ya).join(`
`),x=[ug(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",t.envMap?"#define "+y:"",_?"#define CUBEUV_TEXEL_WIDTH "+_.texelWidth:"",_?"#define CUBEUV_TEXEL_HEIGHT "+_.texelHeight:"",_?"#define CUBEUV_MAX_MIP "+_.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yr?"#define TONE_MAPPING":"",t.toneMapping!==yr?lt.tonemapping_pars_fragment:"",t.toneMapping!==yr?ST("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",lt.colorspace_pars_fragment,yT("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ya).join(`
`)),u=Od(u),u=og(u,t),u=lg(u,t),f=Od(f),f=og(f,t),f=lg(f,t),u=cg(u),f=cg(f),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,x=["#define varying in",t.glslVersion===Am?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Am?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const R=b+S+u,D=b+x+f,$=sg(o,o.VERTEX_SHADER,R),I=sg(o,o.FRAGMENT_SHADER,D);o.attachShader(w,$),o.attachShader(w,I),t.index0AttributeName!==void 0?o.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function L(V){if(r.debug.checkShaderErrors){const G=o.getProgramInfoLog(w).trim(),z=o.getShaderInfoLog($).trim(),X=o.getShaderInfoLog(I).trim();let Y=!0,le=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(Y=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(o,w,$,I);else{const fe=ag(o,$,"vertex"),k=ag(o,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+G+`
`+fe+`
`+k)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(z===""||X==="")&&(le=!1);le&&(V.diagnostics={runnable:Y,programLog:G,vertexShader:{log:z,prefix:S},fragmentShader:{log:X,prefix:x}})}o.deleteShader($),o.deleteShader(I),j=new kl(o,w),C=wT(o,w)}let j;this.getUniforms=function(){return j===void 0&&L(this),j};let C;this.getAttributes=function(){return C===void 0&&L(this),C};let T=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=o.getProgramParameter(w,gT)),T},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=vT++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=$,this.fragmentShader=I,this}let FT=0;class OT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,s=e.fragmentShader,o=this._getShaderStage(t),l=this._getShaderStage(s),u=this._getShaderCacheForMaterial(e);return u.has(o)===!1&&(u.add(o),o.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const s of t)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let s=t.get(e);return s===void 0&&(s=new Set,t.set(e,s)),s}_getShaderStage(e){const t=this.shaderCache;let s=t.get(e);return s===void 0&&(s=new kT(e),t.set(e,s)),s}}class kT{constructor(e){this.id=FT++,this.code=e,this.usedTimes=0}}function zT(r,e,t,s,o,l,u){const f=new tv,m=new OT,p=new Set,g=[],y=o.logarithmicDepthBuffer,_=o.vertexTextures;let M=o.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(C){return p.add(C),C===0?"uv":`uv${C}`}function S(C,T,V,G,z){const X=G.fog,Y=z.geometry,le=C.isMeshStandardMaterial?G.environment:null,fe=(C.isMeshStandardMaterial?t:e).get(C.envMap||le),k=fe&&fe.mapping===Jl?fe.image.height:null,de=E[C.type];C.precision!==null&&(M=o.getMaxPrecision(C.precision),M!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",M,"instead."));const ne=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,O=ne!==void 0?ne.length:0;let ae=0;Y.morphAttributes.position!==void 0&&(ae=1),Y.morphAttributes.normal!==void 0&&(ae=2),Y.morphAttributes.color!==void 0&&(ae=3);let Ue,Q,pe,he;if(de){const yt=pi[de];Ue=yt.vertexShader,Q=yt.fragmentShader}else Ue=C.vertexShader,Q=C.fragmentShader,m.update(C),pe=m.getVertexShaderID(C),he=m.getFragmentShaderID(C);const ge=r.getRenderTarget(),ke=z.isInstancedMesh===!0,je=z.isBatchedMesh===!0,K=!!C.map,ht=!!C.matcap,Ye=!!fe,gt=!!C.aoMap,Ke=!!C.lightMap,ut=!!C.bumpMap,rt=!!C.normalMap,at=!!C.displacementMap,At=!!C.emissiveMap,F=!!C.metalnessMap,N=!!C.roughnessMap,ue=C.anisotropy>0,ve=C.clearcoat>0,Ee=C.dispersion>0,Te=C.iridescence>0,qe=C.sheen>0,Pe=C.transmission>0,Ne=ue&&!!C.anisotropyMap,nt=ve&&!!C.clearcoatMap,B=ve&&!!C.clearcoatNormalMap,ee=ve&&!!C.clearcoatRoughnessMap,_e=Te&&!!C.iridescenceMap,Ae=Te&&!!C.iridescenceThicknessMap,we=qe&&!!C.sheenColorMap,Be=qe&&!!C.sheenRoughnessMap,Ie=!!C.specularMap,dt=!!C.specularColorMap,st=!!C.specularIntensityMap,q=Pe&&!!C.transmissionMap,ye=Pe&&!!C.thicknessMap,me=!!C.gradientMap,Re=!!C.alphaMap,Fe=C.alphaTest>0,mt=!!C.alphaHash,wt=!!C.extensions;let Rt=yr;C.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(Rt=r.toneMapping);const Vt={shaderID:de,shaderType:C.type,shaderName:C.name,vertexShader:Ue,fragmentShader:Q,defines:C.defines,customVertexShaderID:pe,customFragmentShaderID:he,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:M,batching:je,instancing:ke,instancingColor:ke&&z.instanceColor!==null,instancingMorph:ke&&z.morphTexture!==null,supportsVertexTextures:_,outputColorSpace:ge===null?r.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:Tr,alphaToCoverage:!!C.alphaToCoverage,map:K,matcap:ht,envMap:Ye,envMapMode:Ye&&fe.mapping,envMapCubeUVHeight:k,aoMap:gt,lightMap:Ke,bumpMap:ut,normalMap:rt,displacementMap:_&&at,emissiveMap:At,normalMapObjectSpace:rt&&C.normalMapType===qy,normalMapTangentSpace:rt&&C.normalMapType===Kg,metalnessMap:F,roughnessMap:N,anisotropy:ue,anisotropyMap:Ne,clearcoat:ve,clearcoatMap:nt,clearcoatNormalMap:B,clearcoatRoughnessMap:ee,dispersion:Ee,iridescence:Te,iridescenceMap:_e,iridescenceThicknessMap:Ae,sheen:qe,sheenColorMap:we,sheenRoughnessMap:Be,specularMap:Ie,specularColorMap:dt,specularIntensityMap:st,transmission:Pe,transmissionMap:q,thicknessMap:ye,gradientMap:me,opaque:C.transparent===!1&&C.blending===Ys&&C.alphaToCoverage===!1,alphaMap:Re,alphaTest:Fe,alphaHash:mt,combine:C.combine,mapUv:K&&w(C.map.channel),aoMapUv:gt&&w(C.aoMap.channel),lightMapUv:Ke&&w(C.lightMap.channel),bumpMapUv:ut&&w(C.bumpMap.channel),normalMapUv:rt&&w(C.normalMap.channel),displacementMapUv:at&&w(C.displacementMap.channel),emissiveMapUv:At&&w(C.emissiveMap.channel),metalnessMapUv:F&&w(C.metalnessMap.channel),roughnessMapUv:N&&w(C.roughnessMap.channel),anisotropyMapUv:Ne&&w(C.anisotropyMap.channel),clearcoatMapUv:nt&&w(C.clearcoatMap.channel),clearcoatNormalMapUv:B&&w(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&w(C.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&w(C.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&w(C.iridescenceThicknessMap.channel),sheenColorMapUv:we&&w(C.sheenColorMap.channel),sheenRoughnessMapUv:Be&&w(C.sheenRoughnessMap.channel),specularMapUv:Ie&&w(C.specularMap.channel),specularColorMapUv:dt&&w(C.specularColorMap.channel),specularIntensityMapUv:st&&w(C.specularIntensityMap.channel),transmissionMapUv:q&&w(C.transmissionMap.channel),thicknessMapUv:ye&&w(C.thicknessMap.channel),alphaMapUv:Re&&w(C.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(rt||ue),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Y.attributes.uv&&(K||Re),fog:!!X,useFog:C.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:y,skinning:z.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:ae,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:C.dithering,shadowMapEnabled:r.shadowMap.enabled&&V.length>0,shadowMapType:r.shadowMap.type,toneMapping:Rt,useLegacyLights:r._useLegacyLights,decodeVideoTexture:K&&C.map.isVideoTexture===!0&&Tt.getTransfer(C.map.colorSpace)===Lt,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===mi,flipSided:C.side===Rn,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:wt&&C.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:wt&&C.extensions.multiDraw===!0&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return Vt.vertexUv1s=p.has(1),Vt.vertexUv2s=p.has(2),Vt.vertexUv3s=p.has(3),p.clear(),Vt}function x(C){const T=[];if(C.shaderID?T.push(C.shaderID):(T.push(C.customVertexShaderID),T.push(C.customFragmentShaderID)),C.defines!==void 0)for(const V in C.defines)T.push(V),T.push(C.defines[V]);return C.isRawShaderMaterial===!1&&(b(T,C),R(T,C),T.push(r.outputColorSpace)),T.push(C.customProgramCacheKey),T.join()}function b(C,T){C.push(T.precision),C.push(T.outputColorSpace),C.push(T.envMapMode),C.push(T.envMapCubeUVHeight),C.push(T.mapUv),C.push(T.alphaMapUv),C.push(T.lightMapUv),C.push(T.aoMapUv),C.push(T.bumpMapUv),C.push(T.normalMapUv),C.push(T.displacementMapUv),C.push(T.emissiveMapUv),C.push(T.metalnessMapUv),C.push(T.roughnessMapUv),C.push(T.anisotropyMapUv),C.push(T.clearcoatMapUv),C.push(T.clearcoatNormalMapUv),C.push(T.clearcoatRoughnessMapUv),C.push(T.iridescenceMapUv),C.push(T.iridescenceThicknessMapUv),C.push(T.sheenColorMapUv),C.push(T.sheenRoughnessMapUv),C.push(T.specularMapUv),C.push(T.specularColorMapUv),C.push(T.specularIntensityMapUv),C.push(T.transmissionMapUv),C.push(T.thicknessMapUv),C.push(T.combine),C.push(T.fogExp2),C.push(T.sizeAttenuation),C.push(T.morphTargetsCount),C.push(T.morphAttributeCount),C.push(T.numDirLights),C.push(T.numPointLights),C.push(T.numSpotLights),C.push(T.numSpotLightMaps),C.push(T.numHemiLights),C.push(T.numRectAreaLights),C.push(T.numDirLightShadows),C.push(T.numPointLightShadows),C.push(T.numSpotLightShadows),C.push(T.numSpotLightShadowsWithMaps),C.push(T.numLightProbes),C.push(T.shadowMapType),C.push(T.toneMapping),C.push(T.numClippingPlanes),C.push(T.numClipIntersection),C.push(T.depthPacking)}function R(C,T){f.disableAll(),T.supportsVertexTextures&&f.enable(0),T.instancing&&f.enable(1),T.instancingColor&&f.enable(2),T.instancingMorph&&f.enable(3),T.matcap&&f.enable(4),T.envMap&&f.enable(5),T.normalMapObjectSpace&&f.enable(6),T.normalMapTangentSpace&&f.enable(7),T.clearcoat&&f.enable(8),T.iridescence&&f.enable(9),T.alphaTest&&f.enable(10),T.vertexColors&&f.enable(11),T.vertexAlphas&&f.enable(12),T.vertexUv1s&&f.enable(13),T.vertexUv2s&&f.enable(14),T.vertexUv3s&&f.enable(15),T.vertexTangents&&f.enable(16),T.anisotropy&&f.enable(17),T.alphaHash&&f.enable(18),T.batching&&f.enable(19),T.dispersion&&f.enable(20),C.push(f.mask),f.disableAll(),T.fog&&f.enable(0),T.useFog&&f.enable(1),T.flatShading&&f.enable(2),T.logarithmicDepthBuffer&&f.enable(3),T.skinning&&f.enable(4),T.morphTargets&&f.enable(5),T.morphNormals&&f.enable(6),T.morphColors&&f.enable(7),T.premultipliedAlpha&&f.enable(8),T.shadowMapEnabled&&f.enable(9),T.useLegacyLights&&f.enable(10),T.doubleSided&&f.enable(11),T.flipSided&&f.enable(12),T.useDepthPacking&&f.enable(13),T.dithering&&f.enable(14),T.transmission&&f.enable(15),T.sheen&&f.enable(16),T.opaque&&f.enable(17),T.pointsUvs&&f.enable(18),T.decodeVideoTexture&&f.enable(19),T.alphaToCoverage&&f.enable(20),C.push(f.mask)}function D(C){const T=E[C.type];let V;if(T){const G=pi[T];V=ES.clone(G.uniforms)}else V=C.uniforms;return V}function $(C,T){let V;for(let G=0,z=g.length;G<z;G++){const X=g[G];if(X.cacheKey===T){V=X,++V.usedTimes;break}}return V===void 0&&(V=new IT(r,T,C,l),g.push(V)),V}function I(C){if(--C.usedTimes===0){const T=g.indexOf(C);g[T]=g[g.length-1],g.pop(),C.destroy()}}function L(C){m.remove(C)}function j(){m.dispose()}return{getParameters:S,getProgramCacheKey:x,getUniforms:D,acquireProgram:$,releaseProgram:I,releaseShaderCache:L,programs:g,dispose:j}}function BT(){let r=new WeakMap;function e(l){let u=r.get(l);return u===void 0&&(u={},r.set(l,u)),u}function t(l){r.delete(l)}function s(l,u,f){r.get(l)[u]=f}function o(){r=new WeakMap}return{get:e,remove:t,update:s,dispose:o}}function jT(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function dg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function fg(){const r=[];let e=0;const t=[],s=[],o=[];function l(){e=0,t.length=0,s.length=0,o.length=0}function u(y,_,M,E,w,S){let x=r[e];return x===void 0?(x={id:y.id,object:y,geometry:_,material:M,groupOrder:E,renderOrder:y.renderOrder,z:w,group:S},r[e]=x):(x.id=y.id,x.object=y,x.geometry=_,x.material=M,x.groupOrder=E,x.renderOrder=y.renderOrder,x.z=w,x.group=S),e++,x}function f(y,_,M,E,w,S){const x=u(y,_,M,E,w,S);M.transmission>0?s.push(x):M.transparent===!0?o.push(x):t.push(x)}function m(y,_,M,E,w,S){const x=u(y,_,M,E,w,S);M.transmission>0?s.unshift(x):M.transparent===!0?o.unshift(x):t.unshift(x)}function p(y,_){t.length>1&&t.sort(y||jT),s.length>1&&s.sort(_||dg),o.length>1&&o.sort(_||dg)}function g(){for(let y=e,_=r.length;y<_;y++){const M=r[y];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:s,transparent:o,init:l,push:f,unshift:m,finish:g,sort:p}}function HT(){let r=new WeakMap;function e(s,o){const l=r.get(s);let u;return l===void 0?(u=new fg,r.set(s,[u])):o>=l.length?(u=new fg,l.push(u)):u=l[o],u}function t(){r=new WeakMap}return{get:e,dispose:t}}function VT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new oe,color:new Mt};break;case"SpotLight":t={position:new oe,direction:new oe,color:new Mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new oe,color:new Mt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new oe,skyColor:new Mt,groundColor:new Mt};break;case"RectAreaLight":t={color:new Mt,position:new oe,halfWidth:new oe,halfHeight:new oe};break}return r[e.id]=t,t}}}function GT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let WT=0;function XT(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function $T(r){const e=new VT,t=GT(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new oe);const o=new oe,l=new Bt,u=new Bt;function f(p,g){let y=0,_=0,M=0;for(let V=0;V<9;V++)s.probe[V].set(0,0,0);let E=0,w=0,S=0,x=0,b=0,R=0,D=0,$=0,I=0,L=0,j=0;p.sort(XT);const C=g===!0?Math.PI:1;for(let V=0,G=p.length;V<G;V++){const z=p[V],X=z.color,Y=z.intensity,le=z.distance,fe=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)y+=X.r*Y*C,_+=X.g*Y*C,M+=X.b*Y*C;else if(z.isLightProbe){for(let k=0;k<9;k++)s.probe[k].addScaledVector(z.sh.coefficients[k],Y);j++}else if(z.isDirectionalLight){const k=e.get(z);if(k.color.copy(z.color).multiplyScalar(z.intensity*C),z.castShadow){const de=z.shadow,ne=t.get(z);ne.shadowBias=de.bias,ne.shadowNormalBias=de.normalBias,ne.shadowRadius=de.radius,ne.shadowMapSize=de.mapSize,s.directionalShadow[E]=ne,s.directionalShadowMap[E]=fe,s.directionalShadowMatrix[E]=z.shadow.matrix,R++}s.directional[E]=k,E++}else if(z.isSpotLight){const k=e.get(z);k.position.setFromMatrixPosition(z.matrixWorld),k.color.copy(X).multiplyScalar(Y*C),k.distance=le,k.coneCos=Math.cos(z.angle),k.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),k.decay=z.decay,s.spot[S]=k;const de=z.shadow;if(z.map&&(s.spotLightMap[I]=z.map,I++,de.updateMatrices(z),z.castShadow&&L++),s.spotLightMatrix[S]=de.matrix,z.castShadow){const ne=t.get(z);ne.shadowBias=de.bias,ne.shadowNormalBias=de.normalBias,ne.shadowRadius=de.radius,ne.shadowMapSize=de.mapSize,s.spotShadow[S]=ne,s.spotShadowMap[S]=fe,$++}S++}else if(z.isRectAreaLight){const k=e.get(z);k.color.copy(X).multiplyScalar(Y),k.halfWidth.set(z.width*.5,0,0),k.halfHeight.set(0,z.height*.5,0),s.rectArea[x]=k,x++}else if(z.isPointLight){const k=e.get(z);if(k.color.copy(z.color).multiplyScalar(z.intensity*C),k.distance=z.distance,k.decay=z.decay,z.castShadow){const de=z.shadow,ne=t.get(z);ne.shadowBias=de.bias,ne.shadowNormalBias=de.normalBias,ne.shadowRadius=de.radius,ne.shadowMapSize=de.mapSize,ne.shadowCameraNear=de.camera.near,ne.shadowCameraFar=de.camera.far,s.pointShadow[w]=ne,s.pointShadowMap[w]=fe,s.pointShadowMatrix[w]=z.shadow.matrix,D++}s.point[w]=k,w++}else if(z.isHemisphereLight){const k=e.get(z);k.skyColor.copy(z.color).multiplyScalar(Y*C),k.groundColor.copy(z.groundColor).multiplyScalar(Y*C),s.hemi[b]=k,b++}}x>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=De.LTC_FLOAT_1,s.rectAreaLTC2=De.LTC_FLOAT_2):(s.rectAreaLTC1=De.LTC_HALF_1,s.rectAreaLTC2=De.LTC_HALF_2)),s.ambient[0]=y,s.ambient[1]=_,s.ambient[2]=M;const T=s.hash;(T.directionalLength!==E||T.pointLength!==w||T.spotLength!==S||T.rectAreaLength!==x||T.hemiLength!==b||T.numDirectionalShadows!==R||T.numPointShadows!==D||T.numSpotShadows!==$||T.numSpotMaps!==I||T.numLightProbes!==j)&&(s.directional.length=E,s.spot.length=S,s.rectArea.length=x,s.point.length=w,s.hemi.length=b,s.directionalShadow.length=R,s.directionalShadowMap.length=R,s.pointShadow.length=D,s.pointShadowMap.length=D,s.spotShadow.length=$,s.spotShadowMap.length=$,s.directionalShadowMatrix.length=R,s.pointShadowMatrix.length=D,s.spotLightMatrix.length=$+I-L,s.spotLightMap.length=I,s.numSpotLightShadowsWithMaps=L,s.numLightProbes=j,T.directionalLength=E,T.pointLength=w,T.spotLength=S,T.rectAreaLength=x,T.hemiLength=b,T.numDirectionalShadows=R,T.numPointShadows=D,T.numSpotShadows=$,T.numSpotMaps=I,T.numLightProbes=j,s.version=WT++)}function m(p,g){let y=0,_=0,M=0,E=0,w=0;const S=g.matrixWorldInverse;for(let x=0,b=p.length;x<b;x++){const R=p[x];if(R.isDirectionalLight){const D=s.directional[y];D.direction.setFromMatrixPosition(R.matrixWorld),o.setFromMatrixPosition(R.target.matrixWorld),D.direction.sub(o),D.direction.transformDirection(S),y++}else if(R.isSpotLight){const D=s.spot[M];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(S),D.direction.setFromMatrixPosition(R.matrixWorld),o.setFromMatrixPosition(R.target.matrixWorld),D.direction.sub(o),D.direction.transformDirection(S),M++}else if(R.isRectAreaLight){const D=s.rectArea[E];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(S),u.identity(),l.copy(R.matrixWorld),l.premultiply(S),u.extractRotation(l),D.halfWidth.set(R.width*.5,0,0),D.halfHeight.set(0,R.height*.5,0),D.halfWidth.applyMatrix4(u),D.halfHeight.applyMatrix4(u),E++}else if(R.isPointLight){const D=s.point[_];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(S),_++}else if(R.isHemisphereLight){const D=s.hemi[w];D.direction.setFromMatrixPosition(R.matrixWorld),D.direction.transformDirection(S),w++}}}return{setup:f,setupView:m,state:s}}function hg(r){const e=new $T(r),t=[],s=[];function o(g){p.camera=g,t.length=0,s.length=0}function l(g){t.push(g)}function u(g){s.push(g)}function f(g){e.setup(t,g)}function m(g){e.setupView(t,g)}const p={lightsArray:t,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:p,setupLights:f,setupLightsView:m,pushLight:l,pushShadow:u}}function qT(r){let e=new WeakMap;function t(o,l=0){const u=e.get(o);let f;return u===void 0?(f=new hg(r),e.set(o,[f])):l>=u.length?(f=new hg(r),u.push(f)):f=u[l],f}function s(){e=new WeakMap}return{get:t,dispose:s}}class YT extends ro{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class KT extends ro{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ZT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,JT=`uniform sampler2D shadow_pass;
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
}`;function QT(r,e,t){let s=new Kd;const o=new xt,l=new xt,u=new rn,f=new YT({depthPacking:$y}),m=new KT,p={},g=t.maxTextureSize,y={[Sr]:Rn,[Rn]:Sr,[mi]:mi},_=new Er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:ZT,fragmentShader:JT}),M=_.clone();M.defines.HORIZONTAL_PASS=1;const E=new Hi;E.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new _i(E,_),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bg;let x=this.type;this.render=function(I,L,j){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||I.length===0)return;const C=r.getRenderTarget(),T=r.getActiveCubeFace(),V=r.getActiveMipmapLevel(),G=r.state;G.setBlending(xr),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const z=x!==ki&&this.type===ki,X=x===ki&&this.type!==ki;for(let Y=0,le=I.length;Y<le;Y++){const fe=I[Y],k=fe.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",fe,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;o.copy(k.mapSize);const de=k.getFrameExtents();if(o.multiply(de),l.copy(k.mapSize),(o.x>g||o.y>g)&&(o.x>g&&(l.x=Math.floor(g/de.x),o.x=l.x*de.x,k.mapSize.x=l.x),o.y>g&&(l.y=Math.floor(g/de.y),o.y=l.y*de.y,k.mapSize.y=l.y)),k.map===null||z===!0||X===!0){const O=this.type!==ki?{minFilter:Kn,magFilter:Kn}:{};k.map!==null&&k.map.dispose(),k.map=new ns(o.x,o.y,O),k.map.texture.name=fe.name+".shadowMap",k.camera.updateProjectionMatrix()}r.setRenderTarget(k.map),r.clear();const ne=k.getViewportCount();for(let O=0;O<ne;O++){const ae=k.getViewport(O);u.set(l.x*ae.x,l.y*ae.y,l.x*ae.z,l.y*ae.w),G.viewport(u),k.updateMatrices(fe,O),s=k.getFrustum(),D(L,j,k.camera,fe,this.type)}k.isPointLightShadow!==!0&&this.type===ki&&b(k,j),k.needsUpdate=!1}x=this.type,S.needsUpdate=!1,r.setRenderTarget(C,T,V)};function b(I,L){const j=e.update(w);_.defines.VSM_SAMPLES!==I.blurSamples&&(_.defines.VSM_SAMPLES=I.blurSamples,M.defines.VSM_SAMPLES=I.blurSamples,_.needsUpdate=!0,M.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new ns(o.x,o.y)),_.uniforms.shadow_pass.value=I.map.texture,_.uniforms.resolution.value=I.mapSize,_.uniforms.radius.value=I.radius,r.setRenderTarget(I.mapPass),r.clear(),r.renderBufferDirect(L,null,j,_,w,null),M.uniforms.shadow_pass.value=I.mapPass.texture,M.uniforms.resolution.value=I.mapSize,M.uniforms.radius.value=I.radius,r.setRenderTarget(I.map),r.clear(),r.renderBufferDirect(L,null,j,M,w,null)}function R(I,L,j,C){let T=null;const V=j.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(V!==void 0)T=V;else if(T=j.isPointLight===!0?m:f,r.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const G=T.uuid,z=L.uuid;let X=p[G];X===void 0&&(X={},p[G]=X);let Y=X[z];Y===void 0&&(Y=T.clone(),X[z]=Y,L.addEventListener("dispose",$)),T=Y}if(T.visible=L.visible,T.wireframe=L.wireframe,C===ki?T.side=L.shadowSide!==null?L.shadowSide:L.side:T.side=L.shadowSide!==null?L.shadowSide:y[L.side],T.alphaMap=L.alphaMap,T.alphaTest=L.alphaTest,T.map=L.map,T.clipShadows=L.clipShadows,T.clippingPlanes=L.clippingPlanes,T.clipIntersection=L.clipIntersection,T.displacementMap=L.displacementMap,T.displacementScale=L.displacementScale,T.displacementBias=L.displacementBias,T.wireframeLinewidth=L.wireframeLinewidth,T.linewidth=L.linewidth,j.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const G=r.properties.get(T);G.light=j}return T}function D(I,L,j,C,T){if(I.visible===!1)return;if(I.layers.test(L.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&T===ki)&&(!I.frustumCulled||s.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,I.matrixWorld);const z=e.update(I),X=I.material;if(Array.isArray(X)){const Y=z.groups;for(let le=0,fe=Y.length;le<fe;le++){const k=Y[le],de=X[k.materialIndex];if(de&&de.visible){const ne=R(I,de,C,T);I.onBeforeShadow(r,I,L,j,z,ne,k),r.renderBufferDirect(j,null,z,ne,I,k),I.onAfterShadow(r,I,L,j,z,ne,k)}}}else if(X.visible){const Y=R(I,X,C,T);I.onBeforeShadow(r,I,L,j,z,Y,null),r.renderBufferDirect(j,null,z,Y,I,null),I.onAfterShadow(r,I,L,j,z,Y,null)}}const G=I.children;for(let z=0,X=G.length;z<X;z++)D(G[z],L,j,C,T)}function $(I){I.target.removeEventListener("dispose",$);for(const j in p){const C=p[j],T=I.target.uuid;T in C&&(C[T].dispose(),delete C[T])}}}function e1(r){function e(){let q=!1;const ye=new rn;let me=null;const Re=new rn(0,0,0,0);return{setMask:function(Fe){me!==Fe&&!q&&(r.colorMask(Fe,Fe,Fe,Fe),me=Fe)},setLocked:function(Fe){q=Fe},setClear:function(Fe,mt,wt,Rt,Vt){Vt===!0&&(Fe*=Rt,mt*=Rt,wt*=Rt),ye.set(Fe,mt,wt,Rt),Re.equals(ye)===!1&&(r.clearColor(Fe,mt,wt,Rt),Re.copy(ye))},reset:function(){q=!1,me=null,Re.set(-1,0,0,0)}}}function t(){let q=!1,ye=null,me=null,Re=null;return{setTest:function(Fe){Fe?he(r.DEPTH_TEST):ge(r.DEPTH_TEST)},setMask:function(Fe){ye!==Fe&&!q&&(r.depthMask(Fe),ye=Fe)},setFunc:function(Fe){if(me!==Fe){switch(Fe){case xy:r.depthFunc(r.NEVER);break;case yy:r.depthFunc(r.ALWAYS);break;case Sy:r.depthFunc(r.LESS);break;case Vl:r.depthFunc(r.LEQUAL);break;case My:r.depthFunc(r.EQUAL);break;case Ey:r.depthFunc(r.GEQUAL);break;case wy:r.depthFunc(r.GREATER);break;case Ty:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}me=Fe}},setLocked:function(Fe){q=Fe},setClear:function(Fe){Re!==Fe&&(r.clearDepth(Fe),Re=Fe)},reset:function(){q=!1,ye=null,me=null,Re=null}}}function s(){let q=!1,ye=null,me=null,Re=null,Fe=null,mt=null,wt=null,Rt=null,Vt=null;return{setTest:function(yt){q||(yt?he(r.STENCIL_TEST):ge(r.STENCIL_TEST))},setMask:function(yt){ye!==yt&&!q&&(r.stencilMask(yt),ye=yt)},setFunc:function(yt,yn,Zt){(me!==yt||Re!==yn||Fe!==Zt)&&(r.stencilFunc(yt,yn,Zt),me=yt,Re=yn,Fe=Zt)},setOp:function(yt,yn,Zt){(mt!==yt||wt!==yn||Rt!==Zt)&&(r.stencilOp(yt,yn,Zt),mt=yt,wt=yn,Rt=Zt)},setLocked:function(yt){q=yt},setClear:function(yt){Vt!==yt&&(r.clearStencil(yt),Vt=yt)},reset:function(){q=!1,ye=null,me=null,Re=null,Fe=null,mt=null,wt=null,Rt=null,Vt=null}}}const o=new e,l=new t,u=new s,f=new WeakMap,m=new WeakMap;let p={},g={},y=new WeakMap,_=[],M=null,E=!1,w=null,S=null,x=null,b=null,R=null,D=null,$=null,I=new Mt(0,0,0),L=0,j=!1,C=null,T=null,V=null,G=null,z=null;const X=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,le=0;const fe=r.getParameter(r.VERSION);fe.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(fe)[1]),Y=le>=1):fe.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(fe)[1]),Y=le>=2);let k=null,de={};const ne=r.getParameter(r.SCISSOR_BOX),O=r.getParameter(r.VIEWPORT),ae=new rn().fromArray(ne),Ue=new rn().fromArray(O);function Q(q,ye,me,Re){const Fe=new Uint8Array(4),mt=r.createTexture();r.bindTexture(q,mt),r.texParameteri(q,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(q,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let wt=0;wt<me;wt++)q===r.TEXTURE_3D||q===r.TEXTURE_2D_ARRAY?r.texImage3D(ye,0,r.RGBA,1,1,Re,0,r.RGBA,r.UNSIGNED_BYTE,Fe):r.texImage2D(ye+wt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Fe);return mt}const pe={};pe[r.TEXTURE_2D]=Q(r.TEXTURE_2D,r.TEXTURE_2D,1),pe[r.TEXTURE_CUBE_MAP]=Q(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[r.TEXTURE_2D_ARRAY]=Q(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),pe[r.TEXTURE_3D]=Q(r.TEXTURE_3D,r.TEXTURE_3D,1,1),o.setClear(0,0,0,1),l.setClear(1),u.setClear(0),he(r.DEPTH_TEST),l.setFunc(Vl),ut(!1),rt(qp),he(r.CULL_FACE),gt(xr);function he(q){p[q]!==!0&&(r.enable(q),p[q]=!0)}function ge(q){p[q]!==!1&&(r.disable(q),p[q]=!1)}function ke(q,ye){return g[q]!==ye?(r.bindFramebuffer(q,ye),g[q]=ye,q===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=ye),q===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=ye),!0):!1}function je(q,ye){let me=_,Re=!1;if(q){me=y.get(ye),me===void 0&&(me=[],y.set(ye,me));const Fe=q.textures;if(me.length!==Fe.length||me[0]!==r.COLOR_ATTACHMENT0){for(let mt=0,wt=Fe.length;mt<wt;mt++)me[mt]=r.COLOR_ATTACHMENT0+mt;me.length=Fe.length,Re=!0}}else me[0]!==r.BACK&&(me[0]=r.BACK,Re=!0);Re&&r.drawBuffers(me)}function K(q){return M!==q?(r.useProgram(q),M=q,!0):!1}const ht={[qr]:r.FUNC_ADD,[ny]:r.FUNC_SUBTRACT,[iy]:r.FUNC_REVERSE_SUBTRACT};ht[ry]=r.MIN,ht[sy]=r.MAX;const Ye={[ay]:r.ZERO,[oy]:r.ONE,[ly]:r.SRC_COLOR,[Nd]:r.SRC_ALPHA,[py]:r.SRC_ALPHA_SATURATE,[fy]:r.DST_COLOR,[uy]:r.DST_ALPHA,[cy]:r.ONE_MINUS_SRC_COLOR,[Pd]:r.ONE_MINUS_SRC_ALPHA,[hy]:r.ONE_MINUS_DST_COLOR,[dy]:r.ONE_MINUS_DST_ALPHA,[my]:r.CONSTANT_COLOR,[gy]:r.ONE_MINUS_CONSTANT_COLOR,[vy]:r.CONSTANT_ALPHA,[_y]:r.ONE_MINUS_CONSTANT_ALPHA};function gt(q,ye,me,Re,Fe,mt,wt,Rt,Vt,yt){if(q===xr){E===!0&&(ge(r.BLEND),E=!1);return}if(E===!1&&(he(r.BLEND),E=!0),q!==ty){if(q!==w||yt!==j){if((S!==qr||R!==qr)&&(r.blendEquation(r.FUNC_ADD),S=qr,R=qr),yt)switch(q){case Ys:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Yp:r.blendFunc(r.ONE,r.ONE);break;case Kp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zp:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}else switch(q){case Ys:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Yp:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Kp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zp:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}x=null,b=null,D=null,$=null,I.set(0,0,0),L=0,w=q,j=yt}return}Fe=Fe||ye,mt=mt||me,wt=wt||Re,(ye!==S||Fe!==R)&&(r.blendEquationSeparate(ht[ye],ht[Fe]),S=ye,R=Fe),(me!==x||Re!==b||mt!==D||wt!==$)&&(r.blendFuncSeparate(Ye[me],Ye[Re],Ye[mt],Ye[wt]),x=me,b=Re,D=mt,$=wt),(Rt.equals(I)===!1||Vt!==L)&&(r.blendColor(Rt.r,Rt.g,Rt.b,Vt),I.copy(Rt),L=Vt),w=q,j=!1}function Ke(q,ye){q.side===mi?ge(r.CULL_FACE):he(r.CULL_FACE);let me=q.side===Rn;ye&&(me=!me),ut(me),q.blending===Ys&&q.transparent===!1?gt(xr):gt(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),l.setFunc(q.depthFunc),l.setTest(q.depthTest),l.setMask(q.depthWrite),o.setMask(q.colorWrite);const Re=q.stencilWrite;u.setTest(Re),Re&&(u.setMask(q.stencilWriteMask),u.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),u.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),At(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?he(r.SAMPLE_ALPHA_TO_COVERAGE):ge(r.SAMPLE_ALPHA_TO_COVERAGE)}function ut(q){C!==q&&(q?r.frontFace(r.CW):r.frontFace(r.CCW),C=q)}function rt(q){q!==J0?(he(r.CULL_FACE),q!==T&&(q===qp?r.cullFace(r.BACK):q===Q0?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ge(r.CULL_FACE),T=q}function at(q){q!==V&&(Y&&r.lineWidth(q),V=q)}function At(q,ye,me){q?(he(r.POLYGON_OFFSET_FILL),(G!==ye||z!==me)&&(r.polygonOffset(ye,me),G=ye,z=me)):ge(r.POLYGON_OFFSET_FILL)}function F(q){q?he(r.SCISSOR_TEST):ge(r.SCISSOR_TEST)}function N(q){q===void 0&&(q=r.TEXTURE0+X-1),k!==q&&(r.activeTexture(q),k=q)}function ue(q,ye,me){me===void 0&&(k===null?me=r.TEXTURE0+X-1:me=k);let Re=de[me];Re===void 0&&(Re={type:void 0,texture:void 0},de[me]=Re),(Re.type!==q||Re.texture!==ye)&&(k!==me&&(r.activeTexture(me),k=me),r.bindTexture(q,ye||pe[q]),Re.type=q,Re.texture=ye)}function ve(){const q=de[k];q!==void 0&&q.type!==void 0&&(r.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function Ee(){try{r.compressedTexImage2D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Te(){try{r.compressedTexImage3D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function qe(){try{r.texSubImage2D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Pe(){try{r.texSubImage3D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ne(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function nt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function B(){try{r.texStorage2D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ee(){try{r.texStorage3D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function _e(){try{r.texImage2D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ae(){try{r.texImage3D.apply(r,arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function we(q){ae.equals(q)===!1&&(r.scissor(q.x,q.y,q.z,q.w),ae.copy(q))}function Be(q){Ue.equals(q)===!1&&(r.viewport(q.x,q.y,q.z,q.w),Ue.copy(q))}function Ie(q,ye){let me=m.get(ye);me===void 0&&(me=new WeakMap,m.set(ye,me));let Re=me.get(q);Re===void 0&&(Re=r.getUniformBlockIndex(ye,q.name),me.set(q,Re))}function dt(q,ye){const Re=m.get(ye).get(q);f.get(ye)!==Re&&(r.uniformBlockBinding(ye,Re,q.__bindingPointIndex),f.set(ye,Re))}function st(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),p={},k=null,de={},g={},y=new WeakMap,_=[],M=null,E=!1,w=null,S=null,x=null,b=null,R=null,D=null,$=null,I=new Mt(0,0,0),L=0,j=!1,C=null,T=null,V=null,G=null,z=null,ae.set(0,0,r.canvas.width,r.canvas.height),Ue.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),u.reset()}return{buffers:{color:o,depth:l,stencil:u},enable:he,disable:ge,bindFramebuffer:ke,drawBuffers:je,useProgram:K,setBlending:gt,setMaterial:Ke,setFlipSided:ut,setCullFace:rt,setLineWidth:at,setPolygonOffset:At,setScissorTest:F,activeTexture:N,bindTexture:ue,unbindTexture:ve,compressedTexImage2D:Ee,compressedTexImage3D:Te,texImage2D:_e,texImage3D:Ae,updateUBOMapping:Ie,uniformBlockBinding:dt,texStorage2D:B,texStorage3D:ee,texSubImage2D:qe,texSubImage3D:Pe,compressedTexSubImage2D:Ne,compressedTexSubImage3D:nt,scissor:we,viewport:Be,reset:st}}function t1(r,e,t,s,o,l,u){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new xt,g=new WeakMap;let y;const _=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(F,N){return M?new OffscreenCanvas(F,N):ql("canvas")}function w(F,N,ue){let ve=1;const Ee=At(F);if((Ee.width>ue||Ee.height>ue)&&(ve=ue/Math.max(Ee.width,Ee.height)),ve<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const Te=Math.floor(ve*Ee.width),qe=Math.floor(ve*Ee.height);y===void 0&&(y=E(Te,qe));const Pe=N?E(Te,qe):y;return Pe.width=Te,Pe.height=qe,Pe.getContext("2d").drawImage(F,0,0,Te,qe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Ee.width+"x"+Ee.height+") to ("+Te+"x"+qe+")."),Pe}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Ee.width+"x"+Ee.height+")."),F;return F}function S(F){return F.generateMipmaps&&F.minFilter!==Kn&&F.minFilter!==oi}function x(F){r.generateMipmap(F)}function b(F,N,ue,ve,Ee=!1){if(F!==null){if(r[F]!==void 0)return r[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let Te=N;if(N===r.RED&&(ue===r.FLOAT&&(Te=r.R32F),ue===r.HALF_FLOAT&&(Te=r.R16F),ue===r.UNSIGNED_BYTE&&(Te=r.R8)),N===r.RED_INTEGER&&(ue===r.UNSIGNED_BYTE&&(Te=r.R8UI),ue===r.UNSIGNED_SHORT&&(Te=r.R16UI),ue===r.UNSIGNED_INT&&(Te=r.R32UI),ue===r.BYTE&&(Te=r.R8I),ue===r.SHORT&&(Te=r.R16I),ue===r.INT&&(Te=r.R32I)),N===r.RG&&(ue===r.FLOAT&&(Te=r.RG32F),ue===r.HALF_FLOAT&&(Te=r.RG16F),ue===r.UNSIGNED_BYTE&&(Te=r.RG8)),N===r.RG_INTEGER&&(ue===r.UNSIGNED_BYTE&&(Te=r.RG8UI),ue===r.UNSIGNED_SHORT&&(Te=r.RG16UI),ue===r.UNSIGNED_INT&&(Te=r.RG32UI),ue===r.BYTE&&(Te=r.RG8I),ue===r.SHORT&&(Te=r.RG16I),ue===r.INT&&(Te=r.RG32I)),N===r.RGB&&ue===r.UNSIGNED_INT_5_9_9_9_REV&&(Te=r.RGB9_E5),N===r.RGBA){const qe=Ee?Gl:Tt.getTransfer(ve);ue===r.FLOAT&&(Te=r.RGBA32F),ue===r.HALF_FLOAT&&(Te=r.RGBA16F),ue===r.UNSIGNED_BYTE&&(Te=qe===Lt?r.SRGB8_ALPHA8:r.RGBA8),ue===r.UNSIGNED_SHORT_4_4_4_4&&(Te=r.RGBA4),ue===r.UNSIGNED_SHORT_5_5_5_1&&(Te=r.RGB5_A1)}return(Te===r.R16F||Te===r.R32F||Te===r.RG16F||Te===r.RG32F||Te===r.RGBA16F||Te===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Te}function R(F,N){return S(F)===!0||F.isFramebufferTexture&&F.minFilter!==Kn&&F.minFilter!==oi?Math.log2(Math.max(N.width,N.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?N.mipmaps.length:1}function D(F){const N=F.target;N.removeEventListener("dispose",D),I(N),N.isVideoTexture&&g.delete(N)}function $(F){const N=F.target;N.removeEventListener("dispose",$),j(N)}function I(F){const N=s.get(F);if(N.__webglInit===void 0)return;const ue=F.source,ve=_.get(ue);if(ve){const Ee=ve[N.__cacheKey];Ee.usedTimes--,Ee.usedTimes===0&&L(F),Object.keys(ve).length===0&&_.delete(ue)}s.remove(F)}function L(F){const N=s.get(F);r.deleteTexture(N.__webglTexture);const ue=F.source,ve=_.get(ue);delete ve[N.__cacheKey],u.memory.textures--}function j(F){const N=s.get(F);if(F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let ve=0;ve<6;ve++){if(Array.isArray(N.__webglFramebuffer[ve]))for(let Ee=0;Ee<N.__webglFramebuffer[ve].length;Ee++)r.deleteFramebuffer(N.__webglFramebuffer[ve][Ee]);else r.deleteFramebuffer(N.__webglFramebuffer[ve]);N.__webglDepthbuffer&&r.deleteRenderbuffer(N.__webglDepthbuffer[ve])}else{if(Array.isArray(N.__webglFramebuffer))for(let ve=0;ve<N.__webglFramebuffer.length;ve++)r.deleteFramebuffer(N.__webglFramebuffer[ve]);else r.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&r.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&r.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let ve=0;ve<N.__webglColorRenderbuffer.length;ve++)N.__webglColorRenderbuffer[ve]&&r.deleteRenderbuffer(N.__webglColorRenderbuffer[ve]);N.__webglDepthRenderbuffer&&r.deleteRenderbuffer(N.__webglDepthRenderbuffer)}const ue=F.textures;for(let ve=0,Ee=ue.length;ve<Ee;ve++){const Te=s.get(ue[ve]);Te.__webglTexture&&(r.deleteTexture(Te.__webglTexture),u.memory.textures--),s.remove(ue[ve])}s.remove(F)}let C=0;function T(){C=0}function V(){const F=C;return F>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+o.maxTextures),C+=1,F}function G(F){const N=[];return N.push(F.wrapS),N.push(F.wrapT),N.push(F.wrapR||0),N.push(F.magFilter),N.push(F.minFilter),N.push(F.anisotropy),N.push(F.internalFormat),N.push(F.format),N.push(F.type),N.push(F.generateMipmaps),N.push(F.premultiplyAlpha),N.push(F.flipY),N.push(F.unpackAlignment),N.push(F.colorSpace),N.join()}function z(F,N){const ue=s.get(F);if(F.isVideoTexture&&rt(F),F.isRenderTargetTexture===!1&&F.version>0&&ue.__version!==F.version){const ve=F.image;if(ve===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ve.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ae(ue,F,N);return}}t.bindTexture(r.TEXTURE_2D,ue.__webglTexture,r.TEXTURE0+N)}function X(F,N){const ue=s.get(F);if(F.version>0&&ue.__version!==F.version){ae(ue,F,N);return}t.bindTexture(r.TEXTURE_2D_ARRAY,ue.__webglTexture,r.TEXTURE0+N)}function Y(F,N){const ue=s.get(F);if(F.version>0&&ue.__version!==F.version){ae(ue,F,N);return}t.bindTexture(r.TEXTURE_3D,ue.__webglTexture,r.TEXTURE0+N)}function le(F,N){const ue=s.get(F);if(F.version>0&&ue.__version!==F.version){Ue(ue,F,N);return}t.bindTexture(r.TEXTURE_CUBE_MAP,ue.__webglTexture,r.TEXTURE0+N)}const fe={[Ud]:r.REPEAT,[Zr]:r.CLAMP_TO_EDGE,[Id]:r.MIRRORED_REPEAT},k={[Kn]:r.NEAREST,[Iy]:r.NEAREST_MIPMAP_NEAREST,[ml]:r.NEAREST_MIPMAP_LINEAR,[oi]:r.LINEAR,[Wu]:r.LINEAR_MIPMAP_NEAREST,[Jr]:r.LINEAR_MIPMAP_LINEAR},de={[Yy]:r.NEVER,[tS]:r.ALWAYS,[Ky]:r.LESS,[Zg]:r.LEQUAL,[Zy]:r.EQUAL,[eS]:r.GEQUAL,[Jy]:r.GREATER,[Qy]:r.NOTEQUAL};function ne(F,N){if(N.type===_r&&e.has("OES_texture_float_linear")===!1&&(N.magFilter===oi||N.magFilter===Wu||N.magFilter===ml||N.magFilter===Jr||N.minFilter===oi||N.minFilter===Wu||N.minFilter===ml||N.minFilter===Jr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(F,r.TEXTURE_WRAP_S,fe[N.wrapS]),r.texParameteri(F,r.TEXTURE_WRAP_T,fe[N.wrapT]),(F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY)&&r.texParameteri(F,r.TEXTURE_WRAP_R,fe[N.wrapR]),r.texParameteri(F,r.TEXTURE_MAG_FILTER,k[N.magFilter]),r.texParameteri(F,r.TEXTURE_MIN_FILTER,k[N.minFilter]),N.compareFunction&&(r.texParameteri(F,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(F,r.TEXTURE_COMPARE_FUNC,de[N.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(N.magFilter===Kn||N.minFilter!==ml&&N.minFilter!==Jr||N.type===_r&&e.has("OES_texture_float_linear")===!1)return;if(N.anisotropy>1||s.get(N).__currentAnisotropy){const ue=e.get("EXT_texture_filter_anisotropic");r.texParameterf(F,ue.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(N.anisotropy,o.getMaxAnisotropy())),s.get(N).__currentAnisotropy=N.anisotropy}}}function O(F,N){let ue=!1;F.__webglInit===void 0&&(F.__webglInit=!0,N.addEventListener("dispose",D));const ve=N.source;let Ee=_.get(ve);Ee===void 0&&(Ee={},_.set(ve,Ee));const Te=G(N);if(Te!==F.__cacheKey){Ee[Te]===void 0&&(Ee[Te]={texture:r.createTexture(),usedTimes:0},u.memory.textures++,ue=!0),Ee[Te].usedTimes++;const qe=Ee[F.__cacheKey];qe!==void 0&&(Ee[F.__cacheKey].usedTimes--,qe.usedTimes===0&&L(N)),F.__cacheKey=Te,F.__webglTexture=Ee[Te].texture}return ue}function ae(F,N,ue){let ve=r.TEXTURE_2D;(N.isDataArrayTexture||N.isCompressedArrayTexture)&&(ve=r.TEXTURE_2D_ARRAY),N.isData3DTexture&&(ve=r.TEXTURE_3D);const Ee=O(F,N),Te=N.source;t.bindTexture(ve,F.__webglTexture,r.TEXTURE0+ue);const qe=s.get(Te);if(Te.version!==qe.__version||Ee===!0){t.activeTexture(r.TEXTURE0+ue);const Pe=Tt.getPrimaries(Tt.workingColorSpace),Ne=N.colorSpace===vr?null:Tt.getPrimaries(N.colorSpace),nt=N.colorSpace===vr||Pe===Ne?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,N.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,N.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let B=w(N.image,!1,o.maxTextureSize);B=at(N,B);const ee=l.convert(N.format,N.colorSpace),_e=l.convert(N.type);let Ae=b(N.internalFormat,ee,_e,N.colorSpace,N.isVideoTexture);ne(ve,N);let we;const Be=N.mipmaps,Ie=N.isVideoTexture!==!0,dt=qe.__version===void 0||Ee===!0,st=Te.dataReady,q=R(N,B);if(N.isDepthTexture)Ae=r.DEPTH_COMPONENT16,N.type===_r?Ae=r.DEPTH_COMPONENT32F:N.type===na?Ae=r.DEPTH_COMPONENT24:N.type===to&&(Ae=r.DEPTH24_STENCIL8),dt&&(Ie?t.texStorage2D(r.TEXTURE_2D,1,Ae,B.width,B.height):t.texImage2D(r.TEXTURE_2D,0,Ae,B.width,B.height,0,ee,_e,null));else if(N.isDataTexture)if(Be.length>0){Ie&&dt&&t.texStorage2D(r.TEXTURE_2D,q,Ae,Be[0].width,Be[0].height);for(let ye=0,me=Be.length;ye<me;ye++)we=Be[ye],Ie?st&&t.texSubImage2D(r.TEXTURE_2D,ye,0,0,we.width,we.height,ee,_e,we.data):t.texImage2D(r.TEXTURE_2D,ye,Ae,we.width,we.height,0,ee,_e,we.data);N.generateMipmaps=!1}else Ie?(dt&&t.texStorage2D(r.TEXTURE_2D,q,Ae,B.width,B.height),st&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,B.width,B.height,ee,_e,B.data)):t.texImage2D(r.TEXTURE_2D,0,Ae,B.width,B.height,0,ee,_e,B.data);else if(N.isCompressedTexture)if(N.isCompressedArrayTexture){Ie&&dt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,q,Ae,Be[0].width,Be[0].height,B.depth);for(let ye=0,me=Be.length;ye<me;ye++)we=Be[ye],N.format!==vi?ee!==null?Ie?st&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ye,0,0,0,we.width,we.height,B.depth,ee,we.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ye,Ae,we.width,we.height,B.depth,0,we.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?st&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ye,0,0,0,we.width,we.height,B.depth,ee,_e,we.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ye,Ae,we.width,we.height,B.depth,0,ee,_e,we.data)}else{Ie&&dt&&t.texStorage2D(r.TEXTURE_2D,q,Ae,Be[0].width,Be[0].height);for(let ye=0,me=Be.length;ye<me;ye++)we=Be[ye],N.format!==vi?ee!==null?Ie?st&&t.compressedTexSubImage2D(r.TEXTURE_2D,ye,0,0,we.width,we.height,ee,we.data):t.compressedTexImage2D(r.TEXTURE_2D,ye,Ae,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?st&&t.texSubImage2D(r.TEXTURE_2D,ye,0,0,we.width,we.height,ee,_e,we.data):t.texImage2D(r.TEXTURE_2D,ye,Ae,we.width,we.height,0,ee,_e,we.data)}else if(N.isDataArrayTexture)Ie?(dt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,q,Ae,B.width,B.height,B.depth),st&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,B.width,B.height,B.depth,ee,_e,B.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,Ae,B.width,B.height,B.depth,0,ee,_e,B.data);else if(N.isData3DTexture)Ie?(dt&&t.texStorage3D(r.TEXTURE_3D,q,Ae,B.width,B.height,B.depth),st&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,B.width,B.height,B.depth,ee,_e,B.data)):t.texImage3D(r.TEXTURE_3D,0,Ae,B.width,B.height,B.depth,0,ee,_e,B.data);else if(N.isFramebufferTexture){if(dt)if(Ie)t.texStorage2D(r.TEXTURE_2D,q,Ae,B.width,B.height);else{let ye=B.width,me=B.height;for(let Re=0;Re<q;Re++)t.texImage2D(r.TEXTURE_2D,Re,Ae,ye,me,0,ee,_e,null),ye>>=1,me>>=1}}else if(Be.length>0){if(Ie&&dt){const ye=At(Be[0]);t.texStorage2D(r.TEXTURE_2D,q,Ae,ye.width,ye.height)}for(let ye=0,me=Be.length;ye<me;ye++)we=Be[ye],Ie?st&&t.texSubImage2D(r.TEXTURE_2D,ye,0,0,ee,_e,we):t.texImage2D(r.TEXTURE_2D,ye,Ae,ee,_e,we);N.generateMipmaps=!1}else if(Ie){if(dt){const ye=At(B);t.texStorage2D(r.TEXTURE_2D,q,Ae,ye.width,ye.height)}st&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ee,_e,B)}else t.texImage2D(r.TEXTURE_2D,0,Ae,ee,_e,B);S(N)&&x(ve),qe.__version=Te.version,N.onUpdate&&N.onUpdate(N)}F.__version=N.version}function Ue(F,N,ue){if(N.image.length!==6)return;const ve=O(F,N),Ee=N.source;t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+ue);const Te=s.get(Ee);if(Ee.version!==Te.__version||ve===!0){t.activeTexture(r.TEXTURE0+ue);const qe=Tt.getPrimaries(Tt.workingColorSpace),Pe=N.colorSpace===vr?null:Tt.getPrimaries(N.colorSpace),Ne=N.colorSpace===vr||qe===Pe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,N.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,N.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const nt=N.isCompressedTexture||N.image[0].isCompressedTexture,B=N.image[0]&&N.image[0].isDataTexture,ee=[];for(let me=0;me<6;me++)!nt&&!B?ee[me]=w(N.image[me],!0,o.maxCubemapSize):ee[me]=B?N.image[me].image:N.image[me],ee[me]=at(N,ee[me]);const _e=ee[0],Ae=l.convert(N.format,N.colorSpace),we=l.convert(N.type),Be=b(N.internalFormat,Ae,we,N.colorSpace),Ie=N.isVideoTexture!==!0,dt=Te.__version===void 0||ve===!0,st=Ee.dataReady;let q=R(N,_e);ne(r.TEXTURE_CUBE_MAP,N);let ye;if(nt){Ie&&dt&&t.texStorage2D(r.TEXTURE_CUBE_MAP,q,Be,_e.width,_e.height);for(let me=0;me<6;me++){ye=ee[me].mipmaps;for(let Re=0;Re<ye.length;Re++){const Fe=ye[Re];N.format!==vi?Ae!==null?Ie?st&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,0,0,Fe.width,Fe.height,Ae,Fe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,Be,Fe.width,Fe.height,0,Fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,0,0,Fe.width,Fe.height,Ae,we,Fe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re,Be,Fe.width,Fe.height,0,Ae,we,Fe.data)}}}else{if(ye=N.mipmaps,Ie&&dt){ye.length>0&&q++;const me=At(ee[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,q,Be,me.width,me.height)}for(let me=0;me<6;me++)if(B){Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,ee[me].width,ee[me].height,Ae,we,ee[me].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Be,ee[me].width,ee[me].height,0,Ae,we,ee[me].data);for(let Re=0;Re<ye.length;Re++){const mt=ye[Re].image[me].image;Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,0,0,mt.width,mt.height,Ae,we,mt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,Be,mt.width,mt.height,0,Ae,we,mt.data)}}else{Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Ae,we,ee[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Be,Ae,we,ee[me]);for(let Re=0;Re<ye.length;Re++){const Fe=ye[Re];Ie?st&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,0,0,Ae,we,Fe.image[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Re+1,Be,Ae,we,Fe.image[me])}}}S(N)&&x(r.TEXTURE_CUBE_MAP),Te.__version=Ee.version,N.onUpdate&&N.onUpdate(N)}F.__version=N.version}function Q(F,N,ue,ve,Ee,Te){const qe=l.convert(ue.format,ue.colorSpace),Pe=l.convert(ue.type),Ne=b(ue.internalFormat,qe,Pe,ue.colorSpace);if(!s.get(N).__hasExternalTextures){const B=Math.max(1,N.width>>Te),ee=Math.max(1,N.height>>Te);Ee===r.TEXTURE_3D||Ee===r.TEXTURE_2D_ARRAY?t.texImage3D(Ee,Te,Ne,B,ee,N.depth,0,qe,Pe,null):t.texImage2D(Ee,Te,Ne,B,ee,0,qe,Pe,null)}t.bindFramebuffer(r.FRAMEBUFFER,F),ut(N)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ve,Ee,s.get(ue).__webglTexture,0,Ke(N)):(Ee===r.TEXTURE_2D||Ee>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Ee<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ve,Ee,s.get(ue).__webglTexture,Te),t.bindFramebuffer(r.FRAMEBUFFER,null)}function pe(F,N,ue){if(r.bindRenderbuffer(r.RENDERBUFFER,F),N.depthBuffer&&!N.stencilBuffer){let ve=r.DEPTH_COMPONENT24;if(ue||ut(N)){const Ee=N.depthTexture;Ee&&Ee.isDepthTexture&&(Ee.type===_r?ve=r.DEPTH_COMPONENT32F:Ee.type===na&&(ve=r.DEPTH_COMPONENT24));const Te=Ke(N);ut(N)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Te,ve,N.width,N.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,Te,ve,N.width,N.height)}else r.renderbufferStorage(r.RENDERBUFFER,ve,N.width,N.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,F)}else if(N.depthBuffer&&N.stencilBuffer){const ve=Ke(N);ue&&ut(N)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ve,r.DEPTH24_STENCIL8,N.width,N.height):ut(N)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ve,r.DEPTH24_STENCIL8,N.width,N.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,N.width,N.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,F)}else{const ve=N.textures;for(let Ee=0;Ee<ve.length;Ee++){const Te=ve[Ee],qe=l.convert(Te.format,Te.colorSpace),Pe=l.convert(Te.type),Ne=b(Te.internalFormat,qe,Pe,Te.colorSpace),nt=Ke(N);ue&&ut(N)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,nt,Ne,N.width,N.height):ut(N)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,nt,Ne,N.width,N.height):r.renderbufferStorage(r.RENDERBUFFER,Ne,N.width,N.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function he(F,N){if(N&&N.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,F),!(N.depthTexture&&N.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(N.depthTexture).__webglTexture||N.depthTexture.image.width!==N.width||N.depthTexture.image.height!==N.height)&&(N.depthTexture.image.width=N.width,N.depthTexture.image.height=N.height,N.depthTexture.needsUpdate=!0),z(N.depthTexture,0);const ve=s.get(N.depthTexture).__webglTexture,Ee=Ke(N);if(N.depthTexture.format===Ks)ut(N)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ve,0,Ee):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ve,0);else if(N.depthTexture.format===Qa)ut(N)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ve,0,Ee):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function ge(F){const N=s.get(F),ue=F.isWebGLCubeRenderTarget===!0;if(F.depthTexture&&!N.__autoAllocateDepthBuffer){if(ue)throw new Error("target.depthTexture not supported in Cube render targets");he(N.__webglFramebuffer,F)}else if(ue){N.__webglDepthbuffer=[];for(let ve=0;ve<6;ve++)t.bindFramebuffer(r.FRAMEBUFFER,N.__webglFramebuffer[ve]),N.__webglDepthbuffer[ve]=r.createRenderbuffer(),pe(N.__webglDepthbuffer[ve],F,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,N.__webglFramebuffer),N.__webglDepthbuffer=r.createRenderbuffer(),pe(N.__webglDepthbuffer,F,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function ke(F,N,ue){const ve=s.get(F);N!==void 0&&Q(ve.__webglFramebuffer,F,F.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),ue!==void 0&&ge(F)}function je(F){const N=F.texture,ue=s.get(F),ve=s.get(N);F.addEventListener("dispose",$);const Ee=F.textures,Te=F.isWebGLCubeRenderTarget===!0,qe=Ee.length>1;if(qe||(ve.__webglTexture===void 0&&(ve.__webglTexture=r.createTexture()),ve.__version=N.version,u.memory.textures++),Te){ue.__webglFramebuffer=[];for(let Pe=0;Pe<6;Pe++)if(N.mipmaps&&N.mipmaps.length>0){ue.__webglFramebuffer[Pe]=[];for(let Ne=0;Ne<N.mipmaps.length;Ne++)ue.__webglFramebuffer[Pe][Ne]=r.createFramebuffer()}else ue.__webglFramebuffer[Pe]=r.createFramebuffer()}else{if(N.mipmaps&&N.mipmaps.length>0){ue.__webglFramebuffer=[];for(let Pe=0;Pe<N.mipmaps.length;Pe++)ue.__webglFramebuffer[Pe]=r.createFramebuffer()}else ue.__webglFramebuffer=r.createFramebuffer();if(qe)for(let Pe=0,Ne=Ee.length;Pe<Ne;Pe++){const nt=s.get(Ee[Pe]);nt.__webglTexture===void 0&&(nt.__webglTexture=r.createTexture(),u.memory.textures++)}if(F.samples>0&&ut(F)===!1){ue.__webglMultisampledFramebuffer=r.createFramebuffer(),ue.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer);for(let Pe=0;Pe<Ee.length;Pe++){const Ne=Ee[Pe];ue.__webglColorRenderbuffer[Pe]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,ue.__webglColorRenderbuffer[Pe]);const nt=l.convert(Ne.format,Ne.colorSpace),B=l.convert(Ne.type),ee=b(Ne.internalFormat,nt,B,Ne.colorSpace,F.isXRRenderTarget===!0),_e=Ke(F);r.renderbufferStorageMultisample(r.RENDERBUFFER,_e,ee,F.width,F.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pe,r.RENDERBUFFER,ue.__webglColorRenderbuffer[Pe])}r.bindRenderbuffer(r.RENDERBUFFER,null),F.depthBuffer&&(ue.__webglDepthRenderbuffer=r.createRenderbuffer(),pe(ue.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Te){t.bindTexture(r.TEXTURE_CUBE_MAP,ve.__webglTexture),ne(r.TEXTURE_CUBE_MAP,N);for(let Pe=0;Pe<6;Pe++)if(N.mipmaps&&N.mipmaps.length>0)for(let Ne=0;Ne<N.mipmaps.length;Ne++)Q(ue.__webglFramebuffer[Pe][Ne],F,N,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,Ne);else Q(ue.__webglFramebuffer[Pe],F,N,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0);S(N)&&x(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(qe){for(let Pe=0,Ne=Ee.length;Pe<Ne;Pe++){const nt=Ee[Pe],B=s.get(nt);t.bindTexture(r.TEXTURE_2D,B.__webglTexture),ne(r.TEXTURE_2D,nt),Q(ue.__webglFramebuffer,F,nt,r.COLOR_ATTACHMENT0+Pe,r.TEXTURE_2D,0),S(nt)&&x(r.TEXTURE_2D)}t.unbindTexture()}else{let Pe=r.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Pe=F.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Pe,ve.__webglTexture),ne(Pe,N),N.mipmaps&&N.mipmaps.length>0)for(let Ne=0;Ne<N.mipmaps.length;Ne++)Q(ue.__webglFramebuffer[Ne],F,N,r.COLOR_ATTACHMENT0,Pe,Ne);else Q(ue.__webglFramebuffer,F,N,r.COLOR_ATTACHMENT0,Pe,0);S(N)&&x(Pe),t.unbindTexture()}F.depthBuffer&&ge(F)}function K(F){const N=F.textures;for(let ue=0,ve=N.length;ue<ve;ue++){const Ee=N[ue];if(S(Ee)){const Te=F.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,qe=s.get(Ee).__webglTexture;t.bindTexture(Te,qe),x(Te),t.unbindTexture()}}}const ht=[],Ye=[];function gt(F){if(F.samples>0){if(ut(F)===!1){const N=F.textures,ue=F.width,ve=F.height;let Ee=r.COLOR_BUFFER_BIT;const Te=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,qe=s.get(F),Pe=N.length>1;if(Pe)for(let Ne=0;Ne<N.length;Ne++)t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,qe.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglFramebuffer);for(let Ne=0;Ne<N.length;Ne++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(Ee|=r.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(Ee|=r.STENCIL_BUFFER_BIT)),Pe){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Ne]);const nt=s.get(N[Ne]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,nt,0)}r.blitFramebuffer(0,0,ue,ve,0,0,ue,ve,Ee,r.NEAREST),m===!0&&(ht.length=0,Ye.length=0,ht.push(r.COLOR_ATTACHMENT0+Ne),F.depthBuffer&&F.resolveDepthBuffer===!1&&(ht.push(Te),Ye.push(Te),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Ye)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ht))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Pe)for(let Ne=0;Ne<N.length;Ne++){t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Ne]);const nt=s.get(N[Ne]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ne,r.TEXTURE_2D,nt,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&m){const N=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[N])}}}function Ke(F){return Math.min(o.maxSamples,F.samples)}function ut(F){const N=s.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&N.__useRenderToTexture!==!1}function rt(F){const N=u.render.frame;g.get(F)!==N&&(g.set(F,N),F.update())}function at(F,N){const ue=F.colorSpace,ve=F.format,Ee=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||ue!==Tr&&ue!==vr&&(Tt.getTransfer(ue)===Lt?(ve!==vi||Ee!==Mr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ue)),N}function At(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(p.width=F.naturalWidth||F.width,p.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(p.width=F.displayWidth,p.height=F.displayHeight):(p.width=F.width,p.height=F.height),p}this.allocateTextureUnit=V,this.resetTextureUnits=T,this.setTexture2D=z,this.setTexture2DArray=X,this.setTexture3D=Y,this.setTextureCube=le,this.rebindTextures=ke,this.setupRenderTarget=je,this.updateRenderTargetMipmap=K,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=ut}function n1(r,e){function t(s,o=vr){let l;const u=Tt.getTransfer(o);if(s===Mr)return r.UNSIGNED_BYTE;if(s===Wg)return r.UNSIGNED_SHORT_4_4_4_4;if(s===Xg)return r.UNSIGNED_SHORT_5_5_5_1;if(s===ky)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Fy)return r.BYTE;if(s===Oy)return r.SHORT;if(s===Vg)return r.UNSIGNED_SHORT;if(s===Gg)return r.INT;if(s===na)return r.UNSIGNED_INT;if(s===_r)return r.FLOAT;if(s===Ql)return r.HALF_FLOAT;if(s===zy)return r.ALPHA;if(s===By)return r.RGB;if(s===vi)return r.RGBA;if(s===jy)return r.LUMINANCE;if(s===Hy)return r.LUMINANCE_ALPHA;if(s===Ks)return r.DEPTH_COMPONENT;if(s===Qa)return r.DEPTH_STENCIL;if(s===Vy)return r.RED;if(s===$g)return r.RED_INTEGER;if(s===Gy)return r.RG;if(s===qg)return r.RG_INTEGER;if(s===Yg)return r.RGBA_INTEGER;if(s===Xu||s===$u||s===qu||s===Yu)if(u===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(s===Xu)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===$u)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===qu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Yu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(s===Xu)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===$u)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===qu)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Yu)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Jp||s===Qp||s===em||s===tm)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(s===Jp)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Qp)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===em)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===tm)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===nm||s===im||s===rm)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(s===nm||s===im)return u===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(s===rm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===sm||s===am||s===om||s===lm||s===cm||s===um||s===dm||s===fm||s===hm||s===pm||s===mm||s===gm||s===vm||s===_m)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(s===sm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===am)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===om)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===lm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===cm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===um)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===dm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===fm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===hm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===pm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===mm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===gm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===vm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===_m)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Ku||s===xm||s===ym)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(s===Ku)return u===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===xm)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===ym)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Wy||s===Sm||s===Mm||s===Em)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(s===Ku)return l.COMPRESSED_RED_RGTC1_EXT;if(s===Sm)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Mm)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Em)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===to?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:t}}class i1 extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ka extends gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const r1={type:"move"};class Ed{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ka,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ka,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new oe,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new oe),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ka,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new oe,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new oe),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const s of e.hand.values())this._getHandJoint(t,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,s){let o=null,l=null,u=null;const f=this._targetRay,m=this._grip,p=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(p&&e.hand){u=!0;for(const w of e.hand.values()){const S=t.getJointPose(w,s),x=this._getHandJoint(p,w);S!==null&&(x.matrix.fromArray(S.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=S.radius),x.visible=S!==null}const g=p.joints["index-finger-tip"],y=p.joints["thumb-tip"],_=g.position.distanceTo(y.position),M=.02,E=.005;p.inputState.pinching&&_>M+E?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&_<=M-E&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,s),l!==null&&(m.matrix.fromArray(l.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,l.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(l.linearVelocity)):m.hasLinearVelocity=!1,l.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(l.angularVelocity)):m.hasAngularVelocity=!1));f!==null&&(o=t.getPose(e.targetRaySpace,s),o===null&&l!==null&&(o=l),o!==null&&(f.matrix.fromArray(o.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,o.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(o.linearVelocity)):f.hasLinearVelocity=!1,o.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(o.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(r1)))}return f!==null&&(f.visible=o!==null),m!==null&&(m.visible=l!==null),p!==null&&(p.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const s=new Ka;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[t.jointName]=s,e.add(s)}return e.joints[t.jointName]}}const s1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,a1=`
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

}`;class o1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,s){if(this.texture===null){const o=new Nn,l=e.properties.get(o);l.__webglTexture=t.texture,(t.depthNear!=s.depthNear||t.depthFar!=s.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}render(e,t){if(this.texture!==null){if(this.mesh===null){const s=t.cameras[0].viewport,o=new Er({vertexShader:s1,fragmentShader:a1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:s.z},depthHeight:{value:s.w}}});this.mesh=new _i(new tc(20,20),o)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class l1 extends sa{constructor(e,t){super();const s=this;let o=null,l=1,u=null,f="local-floor",m=1,p=null,g=null,y=null,_=null,M=null,E=null;const w=new o1,S=t.getContextAttributes();let x=null,b=null;const R=[],D=[],$=new xt;let I=null;const L=new qn;L.layers.enable(1),L.viewport=new rn;const j=new qn;j.layers.enable(2),j.viewport=new rn;const C=[L,j],T=new i1;T.layers.enable(1),T.layers.enable(2);let V=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let pe=R[Q];return pe===void 0&&(pe=new Ed,R[Q]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(Q){let pe=R[Q];return pe===void 0&&(pe=new Ed,R[Q]=pe),pe.getGripSpace()},this.getHand=function(Q){let pe=R[Q];return pe===void 0&&(pe=new Ed,R[Q]=pe),pe.getHandSpace()};function z(Q){const pe=D.indexOf(Q.inputSource);if(pe===-1)return;const he=R[pe];he!==void 0&&(he.update(Q.inputSource,Q.frame,p||u),he.dispatchEvent({type:Q.type,data:Q.inputSource}))}function X(){o.removeEventListener("select",z),o.removeEventListener("selectstart",z),o.removeEventListener("selectend",z),o.removeEventListener("squeeze",z),o.removeEventListener("squeezestart",z),o.removeEventListener("squeezeend",z),o.removeEventListener("end",X),o.removeEventListener("inputsourceschange",Y);for(let Q=0;Q<R.length;Q++){const pe=D[Q];pe!==null&&(D[Q]=null,R[Q].disconnect(pe))}V=null,G=null,w.reset(),e.setRenderTarget(x),M=null,_=null,y=null,o=null,b=null,Ue.stop(),s.isPresenting=!1,e.setPixelRatio(I),e.setSize($.width,$.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){l=Q,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){f=Q,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||u},this.setReferenceSpace=function(Q){p=Q},this.getBaseLayer=function(){return _!==null?_:M},this.getBinding=function(){return y},this.getFrame=function(){return E},this.getSession=function(){return o},this.setSession=async function(Q){if(o=Q,o!==null){if(x=e.getRenderTarget(),o.addEventListener("select",z),o.addEventListener("selectstart",z),o.addEventListener("selectend",z),o.addEventListener("squeeze",z),o.addEventListener("squeezestart",z),o.addEventListener("squeezeend",z),o.addEventListener("end",X),o.addEventListener("inputsourceschange",Y),S.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize($),o.renderState.layers===void 0){const pe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};M=new XRWebGLLayer(o,t,pe),o.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),b=new ns(M.framebufferWidth,M.framebufferHeight,{format:vi,type:Mr,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let pe=null,he=null,ge=null;S.depth&&(ge=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=S.stencil?Qa:Ks,he=S.stencil?to:na);const ke={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:l};y=new XRWebGLBinding(o,t),_=y.createProjectionLayer(ke),o.updateRenderState({layers:[_]}),e.setPixelRatio(1),e.setSize(_.textureWidth,_.textureHeight,!1),b=new ns(_.textureWidth,_.textureHeight,{format:vi,type:Mr,depthTexture:new dv(_.textureWidth,_.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:_.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(m),p=null,u=await o.requestReferenceSpace(f),Ue.setContext(o),Ue.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode};function Y(Q){for(let pe=0;pe<Q.removed.length;pe++){const he=Q.removed[pe],ge=D.indexOf(he);ge>=0&&(D[ge]=null,R[ge].disconnect(he))}for(let pe=0;pe<Q.added.length;pe++){const he=Q.added[pe];let ge=D.indexOf(he);if(ge===-1){for(let je=0;je<R.length;je++)if(je>=D.length){D.push(he),ge=je;break}else if(D[je]===null){D[je]=he,ge=je;break}if(ge===-1)break}const ke=R[ge];ke&&ke.connect(he)}}const le=new oe,fe=new oe;function k(Q,pe,he){le.setFromMatrixPosition(pe.matrixWorld),fe.setFromMatrixPosition(he.matrixWorld);const ge=le.distanceTo(fe),ke=pe.projectionMatrix.elements,je=he.projectionMatrix.elements,K=ke[14]/(ke[10]-1),ht=ke[14]/(ke[10]+1),Ye=(ke[9]+1)/ke[5],gt=(ke[9]-1)/ke[5],Ke=(ke[8]-1)/ke[0],ut=(je[8]+1)/je[0],rt=K*Ke,at=K*ut,At=ge/(-Ke+ut),F=At*-Ke;pe.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(F),Q.translateZ(At),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert();const N=K+At,ue=ht+At,ve=rt-F,Ee=at+(ge-F),Te=Ye*ht/ue*N,qe=gt*ht/ue*N;Q.projectionMatrix.makePerspective(ve,Ee,Te,qe,N,ue),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}function de(Q,pe){pe===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(pe.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(o===null)return;w.texture!==null&&(Q.near=w.depthNear,Q.far=w.depthFar),T.near=j.near=L.near=Q.near,T.far=j.far=L.far=Q.far,(V!==T.near||G!==T.far)&&(o.updateRenderState({depthNear:T.near,depthFar:T.far}),V=T.near,G=T.far,L.near=V,L.far=G,j.near=V,j.far=G,L.updateProjectionMatrix(),j.updateProjectionMatrix(),Q.updateProjectionMatrix());const pe=Q.parent,he=T.cameras;de(T,pe);for(let ge=0;ge<he.length;ge++)de(he[ge],pe);he.length===2?k(T,L,j):T.projectionMatrix.copy(L.projectionMatrix),ne(Q,T,pe)};function ne(Q,pe,he){he===null?Q.matrix.copy(pe.matrixWorld):(Q.matrix.copy(he.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(pe.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(pe.projectionMatrix),Q.projectionMatrixInverse.copy(pe.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Fd*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(_===null&&M===null))return m},this.setFoveation=function(Q){m=Q,_!==null&&(_.fixedFoveation=Q),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=Q)},this.hasDepthSensing=function(){return w.texture!==null};let O=null;function ae(Q,pe){if(g=pe.getViewerPose(p||u),E=pe,g!==null){const he=g.views;M!==null&&(e.setRenderTargetFramebuffer(b,M.framebuffer),e.setRenderTarget(b));let ge=!1;he.length!==T.cameras.length&&(T.cameras.length=0,ge=!0);for(let je=0;je<he.length;je++){const K=he[je];let ht=null;if(M!==null)ht=M.getViewport(K);else{const gt=y.getViewSubImage(_,K);ht=gt.viewport,je===0&&(e.setRenderTargetTextures(b,gt.colorTexture,_.ignoreDepthValues?void 0:gt.depthStencilTexture),e.setRenderTarget(b))}let Ye=C[je];Ye===void 0&&(Ye=new qn,Ye.layers.enable(je),Ye.viewport=new rn,C[je]=Ye),Ye.matrix.fromArray(K.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(K.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(ht.x,ht.y,ht.width,ht.height),je===0&&(T.matrix.copy(Ye.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),ge===!0&&T.cameras.push(Ye)}const ke=o.enabledFeatures;if(ke&&ke.includes("depth-sensing")){const je=y.getDepthInformation(he[0]);je&&je.isValid&&je.texture&&w.init(e,je,o.renderState)}}for(let he=0;he<R.length;he++){const ge=D[he],ke=R[he];ge!==null&&ke!==void 0&&ke.update(ge,pe,p||u)}w.render(e,T),O&&O(Q,pe),pe.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:pe}),E=null}const Ue=new cv;Ue.setAnimationLoop(ae),this.setAnimationLoop=function(Q){O=Q},this.dispose=function(){}}}const Wr=new Si,c1=new Bt;function u1(r,e){function t(S,x){S.matrixAutoUpdate===!0&&S.updateMatrix(),x.value.copy(S.matrix)}function s(S,x){x.color.getRGB(S.fogColor.value,av(r)),x.isFog?(S.fogNear.value=x.near,S.fogFar.value=x.far):x.isFogExp2&&(S.fogDensity.value=x.density)}function o(S,x,b,R,D){x.isMeshBasicMaterial||x.isMeshLambertMaterial?l(S,x):x.isMeshToonMaterial?(l(S,x),y(S,x)):x.isMeshPhongMaterial?(l(S,x),g(S,x)):x.isMeshStandardMaterial?(l(S,x),_(S,x),x.isMeshPhysicalMaterial&&M(S,x,D)):x.isMeshMatcapMaterial?(l(S,x),E(S,x)):x.isMeshDepthMaterial?l(S,x):x.isMeshDistanceMaterial?(l(S,x),w(S,x)):x.isMeshNormalMaterial?l(S,x):x.isLineBasicMaterial?(u(S,x),x.isLineDashedMaterial&&f(S,x)):x.isPointsMaterial?m(S,x,b,R):x.isSpriteMaterial?p(S,x):x.isShadowMaterial?(S.color.value.copy(x.color),S.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function l(S,x){S.opacity.value=x.opacity,x.color&&S.diffuse.value.copy(x.color),x.emissive&&S.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.bumpMap&&(S.bumpMap.value=x.bumpMap,t(x.bumpMap,S.bumpMapTransform),S.bumpScale.value=x.bumpScale,x.side===Rn&&(S.bumpScale.value*=-1)),x.normalMap&&(S.normalMap.value=x.normalMap,t(x.normalMap,S.normalMapTransform),S.normalScale.value.copy(x.normalScale),x.side===Rn&&S.normalScale.value.negate()),x.displacementMap&&(S.displacementMap.value=x.displacementMap,t(x.displacementMap,S.displacementMapTransform),S.displacementScale.value=x.displacementScale,S.displacementBias.value=x.displacementBias),x.emissiveMap&&(S.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,S.emissiveMapTransform)),x.specularMap&&(S.specularMap.value=x.specularMap,t(x.specularMap,S.specularMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest);const b=e.get(x),R=b.envMap,D=b.envMapRotation;if(R&&(S.envMap.value=R,Wr.copy(D),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),S.envMapRotation.value.setFromMatrix4(c1.makeRotationFromEuler(Wr)),S.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=x.reflectivity,S.ior.value=x.ior,S.refractionRatio.value=x.refractionRatio),x.lightMap){S.lightMap.value=x.lightMap;const $=r._useLegacyLights===!0?Math.PI:1;S.lightMapIntensity.value=x.lightMapIntensity*$,t(x.lightMap,S.lightMapTransform)}x.aoMap&&(S.aoMap.value=x.aoMap,S.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,S.aoMapTransform))}function u(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform))}function f(S,x){S.dashSize.value=x.dashSize,S.totalSize.value=x.dashSize+x.gapSize,S.scale.value=x.scale}function m(S,x,b,R){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.size.value=x.size*b,S.scale.value=R*.5,x.map&&(S.map.value=x.map,t(x.map,S.uvTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function p(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.rotation.value=x.rotation,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function g(S,x){S.specular.value.copy(x.specular),S.shininess.value=Math.max(x.shininess,1e-4)}function y(S,x){x.gradientMap&&(S.gradientMap.value=x.gradientMap)}function _(S,x){S.metalness.value=x.metalness,x.metalnessMap&&(S.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,S.metalnessMapTransform)),S.roughness.value=x.roughness,x.roughnessMap&&(S.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,S.roughnessMapTransform)),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)}function M(S,x,b){S.ior.value=x.ior,x.sheen>0&&(S.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),S.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(S.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,S.sheenColorMapTransform)),x.sheenRoughnessMap&&(S.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,S.sheenRoughnessMapTransform))),x.clearcoat>0&&(S.clearcoat.value=x.clearcoat,S.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(S.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,S.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(S.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===Rn&&S.clearcoatNormalScale.value.negate())),x.dispersion>0&&(S.dispersion.value=x.dispersion),x.iridescence>0&&(S.iridescence.value=x.iridescence,S.iridescenceIOR.value=x.iridescenceIOR,S.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(S.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,S.iridescenceMapTransform)),x.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),x.transmission>0&&(S.transmission.value=x.transmission,S.transmissionSamplerMap.value=b.texture,S.transmissionSamplerSize.value.set(b.width,b.height),x.transmissionMap&&(S.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,S.transmissionMapTransform)),S.thickness.value=x.thickness,x.thicknessMap&&(S.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=x.attenuationDistance,S.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(S.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(S.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=x.specularIntensity,S.specularColor.value.copy(x.specularColor),x.specularColorMap&&(S.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,S.specularColorMapTransform)),x.specularIntensityMap&&(S.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,S.specularIntensityMapTransform))}function E(S,x){x.matcap&&(S.matcap.value=x.matcap)}function w(S,x){const b=e.get(x).light;S.referencePosition.value.setFromMatrixPosition(b.matrixWorld),S.nearDistance.value=b.shadow.camera.near,S.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:o}}function d1(r,e,t,s){let o={},l={},u=[];const f=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(b,R){const D=R.program;s.uniformBlockBinding(b,D)}function p(b,R){let D=o[b.id];D===void 0&&(E(b),D=g(b),o[b.id]=D,b.addEventListener("dispose",S));const $=R.program;s.updateUBOMapping(b,$);const I=e.render.frame;l[b.id]!==I&&(_(b),l[b.id]=I)}function g(b){const R=y();b.__bindingPointIndex=R;const D=r.createBuffer(),$=b.__size,I=b.usage;return r.bindBuffer(r.UNIFORM_BUFFER,D),r.bufferData(r.UNIFORM_BUFFER,$,I),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,R,D),D}function y(){for(let b=0;b<f;b++)if(u.indexOf(b)===-1)return u.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function _(b){const R=o[b.id],D=b.uniforms,$=b.__cache;r.bindBuffer(r.UNIFORM_BUFFER,R);for(let I=0,L=D.length;I<L;I++){const j=Array.isArray(D[I])?D[I]:[D[I]];for(let C=0,T=j.length;C<T;C++){const V=j[C];if(M(V,I,C,$)===!0){const G=V.__offset,z=Array.isArray(V.value)?V.value:[V.value];let X=0;for(let Y=0;Y<z.length;Y++){const le=z[Y],fe=w(le);typeof le=="number"||typeof le=="boolean"?(V.__data[0]=le,r.bufferSubData(r.UNIFORM_BUFFER,G+X,V.__data)):le.isMatrix3?(V.__data[0]=le.elements[0],V.__data[1]=le.elements[1],V.__data[2]=le.elements[2],V.__data[3]=0,V.__data[4]=le.elements[3],V.__data[5]=le.elements[4],V.__data[6]=le.elements[5],V.__data[7]=0,V.__data[8]=le.elements[6],V.__data[9]=le.elements[7],V.__data[10]=le.elements[8],V.__data[11]=0):(le.toArray(V.__data,X),X+=fe.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,V.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(b,R,D,$){const I=b.value,L=R+"_"+D;if($[L]===void 0)return typeof I=="number"||typeof I=="boolean"?$[L]=I:$[L]=I.clone(),!0;{const j=$[L];if(typeof I=="number"||typeof I=="boolean"){if(j!==I)return $[L]=I,!0}else if(j.equals(I)===!1)return j.copy(I),!0}return!1}function E(b){const R=b.uniforms;let D=0;const $=16;for(let L=0,j=R.length;L<j;L++){const C=Array.isArray(R[L])?R[L]:[R[L]];for(let T=0,V=C.length;T<V;T++){const G=C[T],z=Array.isArray(G.value)?G.value:[G.value];for(let X=0,Y=z.length;X<Y;X++){const le=z[X],fe=w(le),k=D%$;k!==0&&$-k<fe.boundary&&(D+=$-k),G.__data=new Float32Array(fe.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=D,D+=fe.storage}}}const I=D%$;return I>0&&(D+=$-I),b.__size=D,b.__cache={},this}function w(b){const R={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(R.boundary=4,R.storage=4):b.isVector2?(R.boundary=8,R.storage=8):b.isVector3||b.isColor?(R.boundary=16,R.storage=12):b.isVector4?(R.boundary=16,R.storage=16):b.isMatrix3?(R.boundary=48,R.storage=48):b.isMatrix4?(R.boundary=64,R.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),R}function S(b){const R=b.target;R.removeEventListener("dispose",S);const D=u.indexOf(R.__bindingPointIndex);u.splice(D,1),r.deleteBuffer(o[R.id]),delete o[R.id],delete l[R.id]}function x(){for(const b in o)r.deleteBuffer(o[b]);u=[],o={},l={}}return{bind:m,update:p,dispose:x}}class f1{constructor(e={}){const{canvas:t=iS(),context:s=null,depth:o=!0,stencil:l=!1,alpha:u=!1,antialias:f=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:y=!1}=e;this.isWebGLRenderer=!0;let _;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=s.getContextAttributes().alpha}else _=u;const M=new Uint32Array(4),E=new Int32Array(4);let w=null,S=null;const x=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hi,this._useLegacyLights=!1,this.toneMapping=yr,this.toneMappingExposure=1;const R=this;let D=!1,$=0,I=0,L=null,j=-1,C=null;const T=new rn,V=new rn;let G=null;const z=new Mt(0);let X=0,Y=t.width,le=t.height,fe=1,k=null,de=null;const ne=new rn(0,0,Y,le),O=new rn(0,0,Y,le);let ae=!1;const Ue=new Kd;let Q=!1,pe=!1;const he=new Bt,ge=new oe,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function je(){return L===null?fe:1}let K=s;function ht(P,Z){return t.getContext(P,Z)}try{const P={alpha:!0,depth:o,stencil:l,antialias:f,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:y};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$d}`),t.addEventListener("webglcontextlost",q,!1),t.addEventListener("webglcontextrestored",ye,!1),t.addEventListener("webglcontextcreationerror",me,!1),K===null){const Z="webgl2";if(K=ht(Z,P),K===null)throw ht(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Ye,gt,Ke,ut,rt,at,At,F,N,ue,ve,Ee,Te,qe,Pe,Ne,nt,B,ee,_e,Ae,we,Be,Ie;function dt(){Ye=new yw(K),Ye.init(),we=new n1(K,Ye),gt=new pw(K,Ye,e,we),Ke=new e1(K),ut=new Ew(K),rt=new BT,at=new t1(K,Ye,Ke,rt,gt,we,ut),At=new gw(R),F=new xw(R),N=new NS(K),Be=new fw(K,N),ue=new Sw(K,N,ut,Be),ve=new Tw(K,ue,N,ut),ee=new ww(K,gt,at),Ne=new mw(rt),Ee=new zT(R,At,F,Ye,gt,Be,Ne),Te=new u1(R,rt),qe=new HT,Pe=new qT(Ye),B=new dw(R,At,F,Ke,ve,_,m),nt=new QT(R,ve,gt),Ie=new d1(K,ut,gt,Ke),_e=new hw(K,Ye,ut),Ae=new Mw(K,Ye,ut),ut.programs=Ee.programs,R.capabilities=gt,R.extensions=Ye,R.properties=rt,R.renderLists=qe,R.shadowMap=nt,R.state=Ke,R.info=ut}dt();const st=new l1(R,K);this.xr=st,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){const P=Ye.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Ye.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(P){P!==void 0&&(fe=P,this.setSize(Y,le,!1))},this.getSize=function(P){return P.set(Y,le)},this.setSize=function(P,Z,ce=!0){if(st.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=P,le=Z,t.width=Math.floor(P*fe),t.height=Math.floor(Z*fe),ce===!0&&(t.style.width=P+"px",t.style.height=Z+"px"),this.setViewport(0,0,P,Z)},this.getDrawingBufferSize=function(P){return P.set(Y*fe,le*fe).floor()},this.setDrawingBufferSize=function(P,Z,ce){Y=P,le=Z,fe=ce,t.width=Math.floor(P*ce),t.height=Math.floor(Z*ce),this.setViewport(0,0,P,Z)},this.getCurrentViewport=function(P){return P.copy(T)},this.getViewport=function(P){return P.copy(ne)},this.setViewport=function(P,Z,ce,re){P.isVector4?ne.set(P.x,P.y,P.z,P.w):ne.set(P,Z,ce,re),Ke.viewport(T.copy(ne).multiplyScalar(fe).round())},this.getScissor=function(P){return P.copy(O)},this.setScissor=function(P,Z,ce,re){P.isVector4?O.set(P.x,P.y,P.z,P.w):O.set(P,Z,ce,re),Ke.scissor(V.copy(O).multiplyScalar(fe).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(P){Ke.setScissorTest(ae=P)},this.setOpaqueSort=function(P){k=P},this.setTransparentSort=function(P){de=P},this.getClearColor=function(P){return P.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(P=!0,Z=!0,ce=!0){let re=0;if(P){let ie=!1;if(L!==null){const Le=L.texture.format;ie=Le===Yg||Le===qg||Le===$g}if(ie){const Le=L.texture.type,We=Le===Mr||Le===na||Le===Vg||Le===to||Le===Wg||Le===Xg,$e=B.getClearColor(),Qe=B.getClearAlpha(),it=$e.r,Ve=$e.g,ot=$e.b;We?(M[0]=it,M[1]=Ve,M[2]=ot,M[3]=Qe,K.clearBufferuiv(K.COLOR,0,M)):(E[0]=it,E[1]=Ve,E[2]=ot,E[3]=Qe,K.clearBufferiv(K.COLOR,0,E))}else re|=K.COLOR_BUFFER_BIT}Z&&(re|=K.DEPTH_BUFFER_BIT),ce&&(re|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(re)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",q,!1),t.removeEventListener("webglcontextrestored",ye,!1),t.removeEventListener("webglcontextcreationerror",me,!1),qe.dispose(),Pe.dispose(),rt.dispose(),At.dispose(),F.dispose(),ve.dispose(),Be.dispose(),Ie.dispose(),Ee.dispose(),st.dispose(),st.removeEventListener("sessionstart",yt),st.removeEventListener("sessionend",yn),Zt.stop()};function q(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ye(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const P=ut.autoReset,Z=nt.enabled,ce=nt.autoUpdate,re=nt.needsUpdate,ie=nt.type;dt(),ut.autoReset=P,nt.enabled=Z,nt.autoUpdate=ce,nt.needsUpdate=re,nt.type=ie}function me(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Re(P){const Z=P.target;Z.removeEventListener("dispose",Re),Fe(Z)}function Fe(P){mt(P),rt.remove(P)}function mt(P){const Z=rt.get(P).programs;Z!==void 0&&(Z.forEach(function(ce){Ee.releaseProgram(ce)}),P.isShaderMaterial&&Ee.releaseShaderCache(P))}this.renderBufferDirect=function(P,Z,ce,re,ie,Le){Z===null&&(Z=ke);const We=ie.isMesh&&ie.matrixWorld.determinant()<0,$e=ic(P,Z,ce,re,ie);Ke.setMaterial(re,We);let Qe=ce.index,it=1;if(re.wireframe===!0){if(Qe=ue.getWireframeAttribute(ce),Qe===void 0)return;it=2}const Ve=ce.drawRange,ot=ce.attributes.position;let Dt=Ve.start*it,Gt=(Ve.start+Ve.count)*it;Le!==null&&(Dt=Math.max(Dt,Le.start*it),Gt=Math.min(Gt,(Le.start+Le.count)*it)),Qe!==null?(Dt=Math.max(Dt,0),Gt=Math.min(Gt,Qe.count)):ot!=null&&(Dt=Math.max(Dt,0),Gt=Math.min(Gt,ot.count));const Jt=Gt-Dt;if(Jt<0||Jt===1/0)return;Be.setup(ie,re,$e,ce,Qe);let Zn,vt=_e;if(Qe!==null&&(Zn=N.get(Qe),vt=Ae,vt.setIndex(Zn)),ie.isMesh)re.wireframe===!0?(Ke.setLineWidth(re.wireframeLinewidth*je()),vt.setMode(K.LINES)):vt.setMode(K.TRIANGLES);else if(ie.isLine){let et=re.linewidth;et===void 0&&(et=1),Ke.setLineWidth(et*je()),ie.isLineSegments?vt.setMode(K.LINES):ie.isLineLoop?vt.setMode(K.LINE_LOOP):vt.setMode(K.LINE_STRIP)}else ie.isPoints?vt.setMode(K.POINTS):ie.isSprite&&vt.setMode(K.TRIANGLES);if(ie.isBatchedMesh)ie._multiDrawInstances!==null?vt.renderMultiDrawInstances(ie._multiDrawStarts,ie._multiDrawCounts,ie._multiDrawCount,ie._multiDrawInstances):vt.renderMultiDraw(ie._multiDrawStarts,ie._multiDrawCounts,ie._multiDrawCount);else if(ie.isInstancedMesh)vt.renderInstances(Dt,Jt,ie.count);else if(ce.isInstancedBufferGeometry){const et=ce._maxInstanceCount!==void 0?ce._maxInstanceCount:1/0,ln=Math.min(ce.instanceCount,et);vt.renderInstances(Dt,Jt,ln)}else vt.render(Dt,Jt)};function wt(P,Z,ce){P.transparent===!0&&P.side===mi&&P.forceSinglePass===!1?(P.side=Rn,P.needsUpdate=!0,Mi(P,Z,ce),P.side=Sr,P.needsUpdate=!0,Mi(P,Z,ce),P.side=mi):Mi(P,Z,ce)}this.compile=function(P,Z,ce=null){ce===null&&(ce=P),S=Pe.get(ce),S.init(Z),b.push(S),ce.traverseVisible(function(ie){ie.isLight&&ie.layers.test(Z.layers)&&(S.pushLight(ie),ie.castShadow&&S.pushShadow(ie))}),P!==ce&&P.traverseVisible(function(ie){ie.isLight&&ie.layers.test(Z.layers)&&(S.pushLight(ie),ie.castShadow&&S.pushShadow(ie))}),S.setupLights(R._useLegacyLights);const re=new Set;return P.traverse(function(ie){const Le=ie.material;if(Le)if(Array.isArray(Le))for(let We=0;We<Le.length;We++){const $e=Le[We];wt($e,ce,ie),re.add($e)}else wt(Le,ce,ie),re.add(Le)}),b.pop(),S=null,re},this.compileAsync=function(P,Z,ce=null){const re=this.compile(P,Z,ce);return new Promise(ie=>{function Le(){if(re.forEach(function(We){rt.get(We).currentProgram.isReady()&&re.delete(We)}),re.size===0){ie(P);return}setTimeout(Le,10)}Ye.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let Rt=null;function Vt(P){Rt&&Rt(P)}function yt(){Zt.stop()}function yn(){Zt.start()}const Zt=new cv;Zt.setAnimationLoop(Vt),typeof self<"u"&&Zt.setContext(self),this.setAnimationLoop=function(P){Rt=P,st.setAnimationLoop(P),P===null?Zt.stop():Zt.start()},st.addEventListener("sessionstart",yt),st.addEventListener("sessionend",yn),this.render=function(P,Z){if(Z!==void 0&&Z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(st.cameraAutoUpdate===!0&&st.updateCamera(Z),Z=st.getCamera()),P.isScene===!0&&P.onBeforeRender(R,P,Z,L),S=Pe.get(P,b.length),S.init(Z),b.push(S),he.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),Ue.setFromProjectionMatrix(he),pe=this.localClippingEnabled,Q=Ne.init(this.clippingPlanes,pe),w=qe.get(P,x.length),w.init(),x.push(w),Vi(P,Z,0,R.sortObjects),w.finish(),R.sortObjects===!0&&w.sort(k,de);const ce=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1;ce&&B.addToRenderList(w,P),this.info.render.frame++,Q===!0&&Ne.beginShadows();const re=S.state.shadowsArray;nt.render(re,P,Z),Q===!0&&Ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=w.opaque,Le=w.transmissive;if(S.setupLights(R._useLegacyLights),Z.isArrayCamera){const We=Z.cameras;if(Le.length>0)for(let $e=0,Qe=We.length;$e<Qe;$e++){const it=We[$e];Gi(ie,Le,P,it)}ce&&B.render(P);for(let $e=0,Qe=We.length;$e<Qe;$e++){const it=We[$e];is(w,P,it,it.viewport)}}else Le.length>0&&Gi(ie,Le,P,Z),ce&&B.render(P),is(w,P,Z);L!==null&&(at.updateMultisampleRenderTarget(L),at.updateRenderTargetMipmap(L)),P.isScene===!0&&P.onAfterRender(R,P,Z),Be.resetDefaultState(),j=-1,C=null,b.pop(),b.length>0?(S=b[b.length-1],Q===!0&&Ne.setGlobalState(R.clippingPlanes,S.state.camera)):S=null,x.pop(),x.length>0?w=x[x.length-1]:w=null};function Vi(P,Z,ce,re){if(P.visible===!1)return;if(P.layers.test(Z.layers)){if(P.isGroup)ce=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(Z);else if(P.isLight)S.pushLight(P),P.castShadow&&S.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Ue.intersectsSprite(P)){re&&ge.setFromMatrixPosition(P.matrixWorld).applyMatrix4(he);const We=ve.update(P),$e=P.material;$e.visible&&w.push(P,We,$e,ce,ge.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Ue.intersectsObject(P))){const We=ve.update(P),$e=P.material;if(re&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),ge.copy(P.boundingSphere.center)):(We.boundingSphere===null&&We.computeBoundingSphere(),ge.copy(We.boundingSphere.center)),ge.applyMatrix4(P.matrixWorld).applyMatrix4(he)),Array.isArray($e)){const Qe=We.groups;for(let it=0,Ve=Qe.length;it<Ve;it++){const ot=Qe[it],Dt=$e[ot.materialIndex];Dt&&Dt.visible&&w.push(P,We,Dt,ce,ge.z,ot)}}else $e.visible&&w.push(P,We,$e,ce,ge.z,null)}}const Le=P.children;for(let We=0,$e=Le.length;We<$e;We++)Vi(Le[We],Z,ce,re)}function is(P,Z,ce,re){const ie=P.opaque,Le=P.transmissive,We=P.transparent;S.setupLightsView(ce),Q===!0&&Ne.setGlobalState(R.clippingPlanes,ce),re&&Ke.viewport(T.copy(re)),ie.length>0&&rs(ie,Z,ce),Le.length>0&&rs(Le,Z,ce),We.length>0&&rs(We,Z,ce),Ke.buffers.depth.setTest(!0),Ke.buffers.depth.setMask(!0),Ke.buffers.color.setMask(!0),Ke.setPolygonOffset(!1)}function Gi(P,Z,ce,re){if((ce.isScene===!0?ce.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[re.id]===void 0&&(S.state.transmissionRenderTarget[re.id]=new ns(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?Ql:Mr,minFilter:Jr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1}));const Le=S.state.transmissionRenderTarget[re.id],We=re.viewport||T;Le.setSize(We.z,We.w);const $e=R.getRenderTarget();R.setRenderTarget(Le),R.getClearColor(z),X=R.getClearAlpha(),X<1&&R.setClearColor(16777215,.5),R.clear();const Qe=R.toneMapping;R.toneMapping=yr;const it=re.viewport;if(re.viewport!==void 0&&(re.viewport=void 0),S.setupLightsView(re),Q===!0&&Ne.setGlobalState(R.clippingPlanes,re),rs(P,ce,re),at.updateMultisampleRenderTarget(Le),at.updateRenderTargetMipmap(Le),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let ot=0,Dt=Z.length;ot<Dt;ot++){const Gt=Z[ot],Jt=Gt.object,Zn=Gt.geometry,vt=Gt.material,et=Gt.group;if(vt.side===mi&&Jt.layers.test(re.layers)){const ln=vt.side;vt.side=Rn,vt.needsUpdate=!0,Wi(Jt,ce,re,Zn,vt,et),vt.side=ln,vt.needsUpdate=!0,Ve=!0}}Ve===!0&&(at.updateMultisampleRenderTarget(Le),at.updateRenderTargetMipmap(Le))}R.setRenderTarget($e),R.setClearColor(z,X),it!==void 0&&(re.viewport=it),R.toneMapping=Qe}function rs(P,Z,ce){const re=Z.isScene===!0?Z.overrideMaterial:null;for(let ie=0,Le=P.length;ie<Le;ie++){const We=P[ie],$e=We.object,Qe=We.geometry,it=re===null?We.material:re,Ve=We.group;$e.layers.test(ce.layers)&&Wi($e,Z,ce,Qe,it,Ve)}}function Wi(P,Z,ce,re,ie,Le){P.onBeforeRender(R,Z,ce,re,ie,Le),P.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),ie.onBeforeRender(R,Z,ce,re,P,Le),ie.transparent===!0&&ie.side===mi&&ie.forceSinglePass===!1?(ie.side=Rn,ie.needsUpdate=!0,R.renderBufferDirect(ce,Z,re,ie,P,Le),ie.side=Sr,ie.needsUpdate=!0,R.renderBufferDirect(ce,Z,re,ie,P,Le),ie.side=mi):R.renderBufferDirect(ce,Z,re,ie,P,Le),P.onAfterRender(R,Z,ce,re,ie,Le)}function Mi(P,Z,ce){Z.isScene!==!0&&(Z=ke);const re=rt.get(P),ie=S.state.lights,Le=S.state.shadowsArray,We=ie.state.version,$e=Ee.getParameters(P,ie.state,Le,Z,ce),Qe=Ee.getProgramCacheKey($e);let it=re.programs;re.environment=P.isMeshStandardMaterial?Z.environment:null,re.fog=Z.fog,re.envMap=(P.isMeshStandardMaterial?F:At).get(P.envMap||re.environment),re.envMapRotation=re.environment!==null&&P.envMap===null?Z.environmentRotation:P.envMapRotation,it===void 0&&(P.addEventListener("dispose",Re),it=new Map,re.programs=it);let Ve=it.get(Qe);if(Ve!==void 0){if(re.currentProgram===Ve&&re.lightsStateVersion===We)return ss(P,$e),Ve}else $e.uniforms=Ee.getUniforms(P),P.onBuild(ce,$e,R),P.onBeforeCompile($e,R),Ve=Ee.acquireProgram($e,Qe),it.set(Qe,Ve),re.uniforms=$e.uniforms;const ot=re.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(ot.clippingPlanes=Ne.uniform),ss(P,$e),re.needsLights=sc(P),re.lightsStateVersion=We,re.needsLights&&(ot.ambientLightColor.value=ie.state.ambient,ot.lightProbe.value=ie.state.probe,ot.directionalLights.value=ie.state.directional,ot.directionalLightShadows.value=ie.state.directionalShadow,ot.spotLights.value=ie.state.spot,ot.spotLightShadows.value=ie.state.spotShadow,ot.rectAreaLights.value=ie.state.rectArea,ot.ltc_1.value=ie.state.rectAreaLTC1,ot.ltc_2.value=ie.state.rectAreaLTC2,ot.pointLights.value=ie.state.point,ot.pointLightShadows.value=ie.state.pointShadow,ot.hemisphereLights.value=ie.state.hemi,ot.directionalShadowMap.value=ie.state.directionalShadowMap,ot.directionalShadowMatrix.value=ie.state.directionalShadowMatrix,ot.spotShadowMap.value=ie.state.spotShadowMap,ot.spotLightMatrix.value=ie.state.spotLightMatrix,ot.spotLightMap.value=ie.state.spotLightMap,ot.pointShadowMap.value=ie.state.pointShadowMap,ot.pointShadowMatrix.value=ie.state.pointShadowMatrix),re.currentProgram=Ve,re.uniformsList=null,Ve}function Ar(P){if(P.uniformsList===null){const Z=P.currentProgram.getUniforms();P.uniformsList=kl.seqWithValue(Z.seq,P.uniforms)}return P.uniformsList}function ss(P,Z){const ce=rt.get(P);ce.outputColorSpace=Z.outputColorSpace,ce.batching=Z.batching,ce.instancing=Z.instancing,ce.instancingColor=Z.instancingColor,ce.instancingMorph=Z.instancingMorph,ce.skinning=Z.skinning,ce.morphTargets=Z.morphTargets,ce.morphNormals=Z.morphNormals,ce.morphColors=Z.morphColors,ce.morphTargetsCount=Z.morphTargetsCount,ce.numClippingPlanes=Z.numClippingPlanes,ce.numIntersection=Z.numClipIntersection,ce.vertexAlphas=Z.vertexAlphas,ce.vertexTangents=Z.vertexTangents,ce.toneMapping=Z.toneMapping}function ic(P,Z,ce,re,ie){Z.isScene!==!0&&(Z=ke),at.resetTextureUnits();const Le=Z.fog,We=re.isMeshStandardMaterial?Z.environment:null,$e=L===null?R.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Tr,Qe=(re.isMeshStandardMaterial?F:At).get(re.envMap||We),it=re.vertexColors===!0&&!!ce.attributes.color&&ce.attributes.color.itemSize===4,Ve=!!ce.attributes.tangent&&(!!re.normalMap||re.anisotropy>0),ot=!!ce.morphAttributes.position,Dt=!!ce.morphAttributes.normal,Gt=!!ce.morphAttributes.color;let Jt=yr;re.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Jt=R.toneMapping);const Zn=ce.morphAttributes.position||ce.morphAttributes.normal||ce.morphAttributes.color,vt=Zn!==void 0?Zn.length:0,et=rt.get(re),ln=S.state.lights;if(Q===!0&&(pe===!0||P!==C)){const sn=P===C&&re.id===j;Ne.setState(re,P,sn)}let Ct=!1;re.version===et.__version?(et.needsLights&&et.lightsStateVersion!==ln.state.version||et.outputColorSpace!==$e||ie.isBatchedMesh&&et.batching===!1||!ie.isBatchedMesh&&et.batching===!0||ie.isInstancedMesh&&et.instancing===!1||!ie.isInstancedMesh&&et.instancing===!0||ie.isSkinnedMesh&&et.skinning===!1||!ie.isSkinnedMesh&&et.skinning===!0||ie.isInstancedMesh&&et.instancingColor===!0&&ie.instanceColor===null||ie.isInstancedMesh&&et.instancingColor===!1&&ie.instanceColor!==null||ie.isInstancedMesh&&et.instancingMorph===!0&&ie.morphTexture===null||ie.isInstancedMesh&&et.instancingMorph===!1&&ie.morphTexture!==null||et.envMap!==Qe||re.fog===!0&&et.fog!==Le||et.numClippingPlanes!==void 0&&(et.numClippingPlanes!==Ne.numPlanes||et.numIntersection!==Ne.numIntersection)||et.vertexAlphas!==it||et.vertexTangents!==Ve||et.morphTargets!==ot||et.morphNormals!==Dt||et.morphColors!==Gt||et.toneMapping!==Jt||et.morphTargetsCount!==vt)&&(Ct=!0):(Ct=!0,et.__version=re.version);let Wt=et.currentProgram;Ct===!0&&(Wt=Mi(re,Z,ie));let ao=!1,Cr=!1,la=!1;const kt=Wt.getUniforms(),Pn=et.uniforms;if(Ke.useProgram(Wt.program)&&(ao=!0,Cr=!0,la=!0),re.id!==j&&(j=re.id,Cr=!0),ao||C!==P){kt.setValue(K,"projectionMatrix",P.projectionMatrix),kt.setValue(K,"viewMatrix",P.matrixWorldInverse);const sn=kt.map.cameraPosition;sn!==void 0&&sn.setValue(K,ge.setFromMatrixPosition(P.matrixWorld)),gt.logarithmicDepthBuffer&&kt.setValue(K,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(re.isMeshPhongMaterial||re.isMeshToonMaterial||re.isMeshLambertMaterial||re.isMeshBasicMaterial||re.isMeshStandardMaterial||re.isShaderMaterial)&&kt.setValue(K,"isOrthographic",P.isOrthographicCamera===!0),C!==P&&(C=P,Cr=!0,la=!0)}if(ie.isSkinnedMesh){kt.setOptional(K,ie,"bindMatrix"),kt.setOptional(K,ie,"bindMatrixInverse");const sn=ie.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),kt.setValue(K,"boneTexture",sn.boneTexture,at))}ie.isBatchedMesh&&(kt.setOptional(K,ie,"batchingTexture"),kt.setValue(K,"batchingTexture",ie._matricesTexture,at));const Ei=ce.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&ee.update(ie,ce,Wt),(Cr||et.receiveShadow!==ie.receiveShadow)&&(et.receiveShadow=ie.receiveShadow,kt.setValue(K,"receiveShadow",ie.receiveShadow)),re.isMeshGouraudMaterial&&re.envMap!==null&&(Pn.envMap.value=Qe,Pn.flipEnvMap.value=Qe.isCubeTexture&&Qe.isRenderTargetTexture===!1?-1:1),re.isMeshStandardMaterial&&re.envMap===null&&Z.environment!==null&&(Pn.envMapIntensity.value=Z.environmentIntensity),Cr&&(kt.setValue(K,"toneMappingExposure",R.toneMappingExposure),et.needsLights&&rc(Pn,la),Le&&re.fog===!0&&Te.refreshFogUniforms(Pn,Le),Te.refreshMaterialUniforms(Pn,re,fe,le,S.state.transmissionRenderTarget[P.id]),kl.upload(K,Ar(et),Pn,at)),re.isShaderMaterial&&re.uniformsNeedUpdate===!0&&(kl.upload(K,Ar(et),Pn,at),re.uniformsNeedUpdate=!1),re.isSpriteMaterial&&kt.setValue(K,"center",ie.center),kt.setValue(K,"modelViewMatrix",ie.modelViewMatrix),kt.setValue(K,"normalMatrix",ie.normalMatrix),kt.setValue(K,"modelMatrix",ie.matrixWorld),re.isShaderMaterial||re.isRawShaderMaterial){const sn=re.uniformsGroups;for(let ca=0,ac=sn.length;ca<ac;ca++){const as=sn[ca];Ie.update(as,Wt),Ie.bind(as,Wt)}}return Wt}function rc(P,Z){P.ambientLightColor.needsUpdate=Z,P.lightProbe.needsUpdate=Z,P.directionalLights.needsUpdate=Z,P.directionalLightShadows.needsUpdate=Z,P.pointLights.needsUpdate=Z,P.pointLightShadows.needsUpdate=Z,P.spotLights.needsUpdate=Z,P.spotLightShadows.needsUpdate=Z,P.rectAreaLights.needsUpdate=Z,P.hemisphereLights.needsUpdate=Z}function sc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(P,Z,ce){rt.get(P.texture).__webglTexture=Z,rt.get(P.depthTexture).__webglTexture=ce;const re=rt.get(P);re.__hasExternalTextures=!0,re.__autoAllocateDepthBuffer=ce===void 0,re.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),re.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,Z){const ce=rt.get(P);ce.__webglFramebuffer=Z,ce.__useDefaultFramebuffer=Z===void 0},this.setRenderTarget=function(P,Z=0,ce=0){L=P,$=Z,I=ce;let re=!0,ie=null,Le=!1,We=!1;if(P){const Qe=rt.get(P);Qe.__useDefaultFramebuffer!==void 0?(Ke.bindFramebuffer(K.FRAMEBUFFER,null),re=!1):Qe.__webglFramebuffer===void 0?at.setupRenderTarget(P):Qe.__hasExternalTextures&&at.rebindTextures(P,rt.get(P.texture).__webglTexture,rt.get(P.depthTexture).__webglTexture);const it=P.texture;(it.isData3DTexture||it.isDataArrayTexture||it.isCompressedArrayTexture)&&(We=!0);const Ve=rt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Ve[Z])?ie=Ve[Z][ce]:ie=Ve[Z],Le=!0):P.samples>0&&at.useMultisampledRTT(P)===!1?ie=rt.get(P).__webglMultisampledFramebuffer:Array.isArray(Ve)?ie=Ve[ce]:ie=Ve,T.copy(P.viewport),V.copy(P.scissor),G=P.scissorTest}else T.copy(ne).multiplyScalar(fe).floor(),V.copy(O).multiplyScalar(fe).floor(),G=ae;if(Ke.bindFramebuffer(K.FRAMEBUFFER,ie)&&re&&Ke.drawBuffers(P,ie),Ke.viewport(T),Ke.scissor(V),Ke.setScissorTest(G),Le){const Qe=rt.get(P.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Qe.__webglTexture,ce)}else if(We){const Qe=rt.get(P.texture),it=Z||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,Qe.__webglTexture,ce||0,it)}j=-1},this.readRenderTargetPixels=function(P,Z,ce,re,ie,Le,We){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $e=rt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&We!==void 0&&($e=$e[We]),$e){Ke.bindFramebuffer(K.FRAMEBUFFER,$e);try{const Qe=P.texture,it=Qe.format,Ve=Qe.type;if(!gt.textureFormatReadable(it)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!gt.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Z>=0&&Z<=P.width-re&&ce>=0&&ce<=P.height-ie&&K.readPixels(Z,ce,re,ie,we.convert(it),we.convert(Ve),Le)}finally{const Qe=L!==null?rt.get(L).__webglFramebuffer:null;Ke.bindFramebuffer(K.FRAMEBUFFER,Qe)}}},this.copyFramebufferToTexture=function(P,Z,ce=0){const re=Math.pow(2,-ce),ie=Math.floor(Z.image.width*re),Le=Math.floor(Z.image.height*re);at.setTexture2D(Z,0),K.copyTexSubImage2D(K.TEXTURE_2D,ce,0,0,P.x,P.y,ie,Le),Ke.unbindTexture()},this.copyTextureToTexture=function(P,Z,ce,re=0){const ie=Z.image.width,Le=Z.image.height,We=we.convert(ce.format),$e=we.convert(ce.type);at.setTexture2D(ce,0),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,ce.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ce.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,ce.unpackAlignment),Z.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,re,P.x,P.y,ie,Le,We,$e,Z.image.data):Z.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,re,P.x,P.y,Z.mipmaps[0].width,Z.mipmaps[0].height,We,Z.mipmaps[0].data):K.texSubImage2D(K.TEXTURE_2D,re,P.x,P.y,We,$e,Z.image),re===0&&ce.generateMipmaps&&K.generateMipmap(K.TEXTURE_2D),Ke.unbindTexture()},this.copyTextureToTexture3D=function(P,Z,ce,re,ie=0){const Le=P.max.x-P.min.x,We=P.max.y-P.min.y,$e=P.max.z-P.min.z,Qe=we.convert(re.format),it=we.convert(re.type);let Ve;if(re.isData3DTexture)at.setTexture3D(re,0),Ve=K.TEXTURE_3D;else if(re.isDataArrayTexture||re.isCompressedArrayTexture)at.setTexture2DArray(re,0),Ve=K.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,re.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,re.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,re.unpackAlignment);const ot=K.getParameter(K.UNPACK_ROW_LENGTH),Dt=K.getParameter(K.UNPACK_IMAGE_HEIGHT),Gt=K.getParameter(K.UNPACK_SKIP_PIXELS),Jt=K.getParameter(K.UNPACK_SKIP_ROWS),Zn=K.getParameter(K.UNPACK_SKIP_IMAGES),vt=ce.isCompressedTexture?ce.mipmaps[ie]:ce.image;K.pixelStorei(K.UNPACK_ROW_LENGTH,vt.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,vt.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,P.min.x),K.pixelStorei(K.UNPACK_SKIP_ROWS,P.min.y),K.pixelStorei(K.UNPACK_SKIP_IMAGES,P.min.z),ce.isDataTexture||ce.isData3DTexture?K.texSubImage3D(Ve,ie,Z.x,Z.y,Z.z,Le,We,$e,Qe,it,vt.data):re.isCompressedArrayTexture?K.compressedTexSubImage3D(Ve,ie,Z.x,Z.y,Z.z,Le,We,$e,Qe,vt.data):K.texSubImage3D(Ve,ie,Z.x,Z.y,Z.z,Le,We,$e,Qe,it,vt),K.pixelStorei(K.UNPACK_ROW_LENGTH,ot),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Dt),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Gt),K.pixelStorei(K.UNPACK_SKIP_ROWS,Jt),K.pixelStorei(K.UNPACK_SKIP_IMAGES,Zn),ie===0&&re.generateMipmaps&&K.generateMipmap(Ve),Ke.unbindTexture()},this.initTexture=function(P){P.isCubeTexture?at.setTextureCube(P,0):P.isData3DTexture?at.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?at.setTexture2DArray(P,0):at.setTexture2D(P,0),Ke.unbindTexture()},this.resetState=function(){$=0,I=0,L=null,Ke.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===qd?"display-p3":"srgb",t.unpackColorSpace=Tt.workingColorSpace===ec?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class h1 extends gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class p1 extends ro{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Kg,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const pg={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class m1{constructor(e,t,s){const o=this;let l=!1,u=0,f=0,m;const p=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=s,this.itemStart=function(g){f++,l===!1&&o.onStart!==void 0&&o.onStart(g,u,f),l=!0},this.itemEnd=function(g){u++,o.onProgress!==void 0&&o.onProgress(g,u,f),u===f&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(g){o.onError!==void 0&&o.onError(g)},this.resolveURL=function(g){return m?m(g):g},this.setURLModifier=function(g){return m=g,this},this.addHandler=function(g,y){return p.push(g,y),this},this.removeHandler=function(g){const y=p.indexOf(g);return y!==-1&&p.splice(y,2),this},this.getHandler=function(g){for(let y=0,_=p.length;y<_;y+=2){const M=p[y],E=p[y+1];if(M.global&&(M.lastIndex=0),M.test(g))return E}return null}}}const g1=new m1;class Jd{constructor(e){this.manager=e!==void 0?e:g1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const s=this;return new Promise(function(o,l){s.load(e,o,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Jd.DEFAULT_MATERIAL_NAME="__DEFAULT";const Oi={};class v1 extends Error{constructor(e,t){super(e),this.response=t}}class _1 extends Jd{constructor(e){super(e)}load(e,t,s,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=pg.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0),l;if(Oi[e]!==void 0){Oi[e].push({onLoad:t,onProgress:s,onError:o});return}Oi[e]=[],Oi[e].push({onLoad:t,onProgress:s,onError:o});const u=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),f=this.mimeType,m=this.responseType;fetch(u).then(p=>{if(p.status===200||p.status===0){if(p.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||p.body===void 0||p.body.getReader===void 0)return p;const g=Oi[e],y=p.body.getReader(),_=p.headers.get("X-File-Size")||p.headers.get("Content-Length"),M=_?parseInt(_):0,E=M!==0;let w=0;const S=new ReadableStream({start(x){b();function b(){y.read().then(({done:R,value:D})=>{if(R)x.close();else{w+=D.byteLength;const $=new ProgressEvent("progress",{lengthComputable:E,loaded:w,total:M});for(let I=0,L=g.length;I<L;I++){const j=g[I];j.onProgress&&j.onProgress($)}x.enqueue(D),b()}})}}});return new Response(S)}else throw new v1(`fetch for "${p.url}" responded with ${p.status}: ${p.statusText}`,p)}).then(p=>{switch(m){case"arraybuffer":return p.arrayBuffer();case"blob":return p.blob();case"document":return p.text().then(g=>new DOMParser().parseFromString(g,f));case"json":return p.json();default:if(f===void 0)return p.text();{const y=/charset="?([^;"\s]*)"?/i.exec(f),_=y&&y[1]?y[1].toLowerCase():void 0,M=new TextDecoder(_);return p.arrayBuffer().then(E=>M.decode(E))}}}).then(p=>{pg.add(e,p);const g=Oi[e];delete Oi[e];for(let y=0,_=g.length;y<_;y++){const M=g[y];M.onLoad&&M.onLoad(p)}}).catch(p=>{const g=Oi[e];if(g===void 0)throw this.manager.itemError(e),p;delete Oi[e];for(let y=0,_=g.length;y<_;y++){const M=g[y];M.onError&&M.onError(p)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class vv extends gn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Mt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const wd=new Bt,mg=new oe,gg=new oe;class x1{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new Bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kd,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,s=this.matrix;mg.setFromMatrixPosition(e.matrixWorld),t.position.copy(mg),gg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gg),t.updateMatrixWorld(),wd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wd),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(wd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class y1 extends x1{constructor(){super(new uv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class S1 extends vv{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.target=new gn,this.shadow=new y1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class M1 extends vv{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$d}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$d);class E1 extends Jd{constructor(e){super(e)}load(e,t,s,o){const l=this,u=new _1(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(this.withCredentials),u.load(e,function(f){try{t(l.parse(f))}catch(m){o?o(m):console.error(m),l.manager.itemError(e)}},s,o)}parse(e){function t(p){const g=new DataView(p),y=32/8*3+32/8*3*3+16/8,_=g.getUint32(80,!0);if(80+32/8+_*y===g.byteLength)return!0;const E=[115,111,108,105,100];for(let w=0;w<5;w++)if(s(E,g,w))return!1;return!0}function s(p,g,y){for(let _=0,M=p.length;_<M;_++)if(p[_]!==g.getUint8(y+_))return!1;return!0}function o(p){const g=new DataView(p),y=g.getUint32(80,!0);let _,M,E,w=!1,S,x,b,R,D;for(let V=0;V<70;V++)g.getUint32(V,!1)==1129270351&&g.getUint8(V+4)==82&&g.getUint8(V+5)==61&&(w=!0,S=new Float32Array(y*3*3),x=g.getUint8(V+6)/255,b=g.getUint8(V+7)/255,R=g.getUint8(V+8)/255,D=g.getUint8(V+9)/255);const $=84,I=50,L=new Hi,j=new Float32Array(y*3*3),C=new Float32Array(y*3*3),T=new Mt;for(let V=0;V<y;V++){const G=$+V*I,z=g.getFloat32(G,!0),X=g.getFloat32(G+4,!0),Y=g.getFloat32(G+8,!0);if(w){const le=g.getUint16(G+48,!0);(le&32768)===0?(_=(le&31)/31,M=(le>>5&31)/31,E=(le>>10&31)/31):(_=x,M=b,E=R)}for(let le=1;le<=3;le++){const fe=G+le*12,k=V*3*3+(le-1)*3;j[k]=g.getFloat32(fe,!0),j[k+1]=g.getFloat32(fe+4,!0),j[k+2]=g.getFloat32(fe+8,!0),C[k]=z,C[k+1]=X,C[k+2]=Y,w&&(T.set(_,M,E).convertSRGBToLinear(),S[k]=T.r,S[k+1]=T.g,S[k+2]=T.b)}}return L.setAttribute("position",new Bn(j,3)),L.setAttribute("normal",new Bn(C,3)),w&&(L.setAttribute("color",new Bn(S,3)),L.hasColors=!0,L.alpha=D),L}function l(p){const g=new Hi,y=/solid([\s\S]*?)endsolid/g,_=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let E=0;const w=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,S=new RegExp("vertex"+w+w+w,"g"),x=new RegExp("normal"+w+w+w,"g"),b=[],R=[],D=[],$=new oe;let I,L=0,j=0,C=0;for(;(I=y.exec(p))!==null;){j=C;const T=I[0],V=(I=M.exec(T))!==null?I[1]:"";for(D.push(V);(I=_.exec(T))!==null;){let X=0,Y=0;const le=I[0];for(;(I=x.exec(le))!==null;)$.x=parseFloat(I[1]),$.y=parseFloat(I[2]),$.z=parseFloat(I[3]),Y++;for(;(I=S.exec(le))!==null;)b.push(parseFloat(I[1]),parseFloat(I[2]),parseFloat(I[3])),R.push($.x,$.y,$.z),X++,C++;Y!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+E),X!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+E),E++}const G=j,z=C-j;g.userData.groupNames=D,g.addGroup(G,z,L),L++}return g.setAttribute("position",new Bi(b,3)),g.setAttribute("normal",new Bi(R,3)),g}function u(p){return typeof p!="string"?new TextDecoder().decode(p):p}function f(p){if(typeof p=="string"){const g=new Uint8Array(p.length);for(let y=0;y<p.length;y++)g[y]=p.charCodeAt(y)&255;return g.buffer||g}else return p}const m=f(e);return t(m)?o(m):l(u(e))}}function w1({src:r}){const e=xe.useRef(null);return xe.useEffect(()=>{const t=e.current;if(!t||!r)return;let s=!1;const o=document.createElement("canvas");o.style.display="block",o.style.width="100%",o.style.height="100%",t.replaceChildren(o);const l=new f1({canvas:o,antialias:!0,alpha:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2));const u=new h1,f=new qn(45,1,.01,100);f.position.set(0,0,2.2),u.add(new M1(16777215,.85));const m=new S1(16777215,.65);m.position.set(2,3,4),u.add(m);const p=new Ka;u.add(p);const g=new p1({color:10135740,metalness:.05,roughness:.72,side:mi}),y=new E1;let _=null,M=0,E=!1,w=0,S=0,x=0;const b=C=>{const T=new aa().setFromObject(C),V=T.getSize(new oe),G=T.getCenter(new oe),X=1.5/Math.max(V.x,V.y,V.z,1e-6);C.scale.setScalar(X),C.position.sub(G.multiplyScalar(X))},R=()=>{const C=t.clientWidth||1,T=t.clientHeight||1;l.setSize(C,T,!1),f.aspect=C/T,f.updateProjectionMatrix()},D=()=>{s||(E||(S+=.004),p.rotation.y=S,p.rotation.x=x,l.render(u,f),M=requestAnimationFrame(D))},$=C=>{C.button===0&&(E=!0,w=C.clientX,o.setPointerCapture(C.pointerId))},I=C=>{if(!E)return;const T=C.clientX-w;w=C.clientX,S+=T*.012},L=()=>{E=!1};o.addEventListener("pointerdown",$),o.addEventListener("pointermove",I),o.addEventListener("pointerup",L),o.addEventListener("pointercancel",L);const j=new ResizeObserver(()=>R());return j.observe(t),R(),y.loadAsync(r).then(C=>{if(s){C.dispose();return}C.computeVertexNormals(),_=new _i(C,g),p.add(_),b(_),D()}).catch(()=>{s||(t.dataset.error="1")}),()=>{s=!0,cancelAnimationFrame(M),j.disconnect(),o.removeEventListener("pointerdown",$),o.removeEventListener("pointermove",I),o.removeEventListener("pointerup",L),o.removeEventListener("pointercancel",L),_&&(_.geometry.dispose(),g.dispose()),l.dispose(),t.replaceChildren()}},[r]),r?d.jsx("div",{ref:e,className:"stl-preview-host","aria-hidden":!0}):null}function T1({app:r}){const e=r.file||"データなし（予約のみ）",t=r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":null,s=r.file?wx(r.id):null;return d.jsxs("div",{className:"stl",children:[d.jsx("div",{className:"stl-canvas",children:s?d.jsx(w1,{src:s}):d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"stl-tag",children:r.kind==="request"?"STL":"RESERVE"}),d.jsx("span",{className:"stl-note",children:r.kind==="request"?"サムネイル未生成":"データ提出なし"})]})}),d.jsxs("div",{className:"stl-meta",children:[d.jsx("span",{className:"stl-ext",children:r.file?r.file.split(".").pop().toUpperCase():"—"}),d.jsxs("span",{className:"stl-name",children:[d.jsx("b",{className:"num",children:e}),d.jsx("span",{children:t?`${t} ・ 更新 ${K0(r.createdAt??"")}`:"予約枠のみの申請"})]}),d.jsxs("span",{className:"stl-actions",children:[d.jsx("a",{className:"mini",href:s??void 0,download:r.file||void 0,style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"DL"}),d.jsx("a",{className:"mini",href:s??void 0,target:"_blank",rel:"noreferrer",style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"開く"})]})]})]})}function A1({app:r,selected:e,onToggle:t,disabled:s}){mn(r);const o=Hd(r);return d.jsx("div",{className:"slotgrid",role:"group","aria-label":"時間帯（30分単位）",children:o.map(l=>{const u=e.indexOf(l)>=0;return d.jsxs("button",{type:"button",disabled:s,className:"slot-chip"+(u?" on":""),onClick:()=>t(l),"aria-pressed":u,children:[d.jsx("span",{className:"num",children:qt(Ja(l))}),d.jsx("span",{className:"slot-dur num",children:"30分"})]},l)})})}function C1({app:r,onPartial:e,onCancelAll:t,onMove:s}){const[o,l]=xe.useState([]),[u,f]=xe.useState(null),[m,p]=xe.useState(null),[g,y]=xe.useState(""),[_,M]=xe.useState("");xe.useEffect(()=>{l([]),f(null),p(null),M(""),y(r.adminNote||"")},[r.id]);const E=Hd(r),w=L=>l(j=>j.indexOf(L)>=0?j.filter(C=>C!==L):j.concat(L).sort((C,T)=>C-T)),S=o.length===E.length,x=()=>l(S?[]:E.slice()),b=r.status==="pending"||r.status==="approved",R=o.length>0&&!S,D=o.length?`${qt(Ja(o[0]))}〜${qt(Ja(o[o.length-1])+Js)}（${o.length}枠・${Kl(o.length*Js)}）`:"",$=()=>{if(!m){M("理由を1つ選んでください");return}const L=Bp.find(j=>j.id===m);o.length?e(r,o,"cancelled",{cancelReason:L.id,adminNote:g||L.body,reason:L}):t(r,L,g)},I=()=>{if(!m){M("理由を1つ選んでください");return}const L=jp.find(j=>j.id===m);o.length?e(r,o,"rejected",{rejectReason:L.id,adminNote:g||L.body,reason:L}):t(r,L,g,"rejected")};return d.jsxs("div",{className:"slotacts",children:[d.jsxs("div",{className:"ftitle",style:{marginBottom:6},children:[d.jsx("span",{children:"時間単位で操作"}),d.jsx("button",{type:"button",className:"linkbtn",onClick:x,children:S?"選択を解除":"すべて選択"})]}),d.jsx(A1,{app:r,selected:o,onToggle:w,disabled:!b}),d.jsx("div",{className:"selbar"+(o.length?" on":""),children:o.length?d.jsxs(d.Fragment,{children:[d.jsx("b",{className:"num",children:D}),d.jsx("span",{children:R?"この枠だけを操作します（残りはそのまま）":"申請全体を操作します"})]}):d.jsx("span",{children:"枠を選ぶと、その時間だけを取り消し・確定できます。未選択なら申請全体が対象です。"})}),b&&d.jsxs("div",{className:"actrow",children:[r.status==="pending"&&d.jsxs("button",{type:"button",className:"btn btn-primary",onClick:()=>o.length?e(r,o,"approved",{}):t(r,null,"","approved"),children:["確定",R?`（${o.length}枠）`:""]}),d.jsx("button",{type:"button",className:"btn btn-secondary move",onClick:()=>s&&s(r),children:"別の日へ変更"}),d.jsx("button",{type:"button",className:"btn btn-danger",onClick:()=>{f(u==="cancel"?null:"cancel"),p(null),M("")},children:"取り消し…"}),r.status==="pending"&&d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>{f(u==="reject"?null:"reject"),p(null),M("")},children:"却下…"})]}),!b&&d.jsx("div",{className:"note tip",children:d.jsxs("span",{children:["この申請は ",d.jsx("b",{children:Qs[r.status]})," です。必要なら「申請中に戻す」で復帰できます。"]})}),b&&u==="cancel"&&d.jsxs("div",{className:"reasonblock",children:[d.jsxs("div",{className:"ftitle",children:["取り消しの理由",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("div",{className:"reasons",children:Bp.map(L=>d.jsxs("button",{type:"button",className:"reason"+(m===L.id?" on":""),onClick:()=>{p(L.id),M("")},children:[d.jsx("i",{}),d.jsxs("span",{children:[d.jsx("b",{children:L.label}),d.jsx("span",{children:L.body})]})]},L.id))}),d.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者への連絡（任意）"}),d.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>y(L.target.value),placeholder:"理由に補足があれば書きます"}),_&&d.jsx("div",{className:"note warn",style:{marginTop:6},children:d.jsx("span",{children:_})}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{f(null),M("")},children:"やめる"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:$,children:R?`${o.length}枠を取り消す`:"この申請を取り消す"})]})]}),b&&u==="reject"&&d.jsxs("div",{className:"reasonblock",children:[d.jsxs("div",{className:"ftitle",children:["却下の理由",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("div",{className:"reasons",children:jp.map(L=>d.jsxs("button",{type:"button",className:"reason"+(m===L.id?" on":""),onClick:()=>{p(L.id),M("")},children:[d.jsx("i",{}),d.jsxs("span",{children:[d.jsx("b",{children:L.label}),d.jsx("span",{children:L.body})]})]},L.id))}),d.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者へのメッセージ（任意）"}),d.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>y(L.target.value),placeholder:"選んだ理由に補足があれば書きます"}),_&&d.jsx("div",{className:"note warn",style:{marginTop:6},children:d.jsx("span",{children:_})}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{f(null),M("")},children:"やめる"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:I,children:R?`${o.length}枠を却下`:"この申請を却下"})]})]}),r.status!=="pending"&&d.jsxs("div",{className:"actrow",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","pending"),children:"申請中に戻す"}),r.status==="approved"&&d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","done"),children:"完了にする"})]}),d.jsxs("div",{className:"memo",children:[d.jsxs("div",{className:"ftitle",style:{justifyContent:"space-between"},children:[d.jsxs("span",{children:["担当者メモ",r.adminNote?"（保存済み）":""]}),d.jsx("button",{type:"button",className:"linkbtn",onClick:()=>f(u==="note"?null:"note"),children:u==="note"?"閉じる":"書く"})]}),r.adminNote&&u!=="note"&&d.jsx("div",{className:"note tip",children:d.jsx("span",{children:r.adminNote})}),u==="note"&&d.jsxs("div",{style:{display:"grid",gap:6},children:[d.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>y(L.target.value),placeholder:"印刷条件や受け取りの指示"}),d.jsx("div",{className:"presets",children:Zx.map(L=>d.jsxs("button",{type:"button",className:"preset",onClick:()=>y(L),children:[L.slice(0,12),"…"]},L))}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>f(null),children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{t(r,null,g.trim(),null,"note"),f(null)},children:"メモを保存"})]})]})]})]})}function b1({app:r,onClose:e,onPartial:t,onCancelAll:s,onMove:o,log:l}){if(!r)return null;const u=mn(r),f=eo(r.date),m=l.filter(p=>p.appId===r.id).sort((p,g)=>g.at.localeCompare(p.at));return d.jsxs($0,{open:!!r,title:r.title,onClose:e,sub:d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"num",style:{whiteSpace:"nowrap"},children:Tg(r.date)}),d.jsx("span",{children:"·"}),d.jsx("span",{style:{whiteSpace:"nowrap"},children:xi[r.machine].name})]}),footer:d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[d.jsxs("div",{className:"rv-flags",children:[d.jsx(qs,{kind:r.kind}),d.jsx(Rd,{status:r.status}),r0(r)&&d.jsx(Hl,{tone:"warn",children:"当日・締切超過"}),d.jsxs(Hl,{children:["申請 ",j0(r.createdAt)]})]}),d.jsxs("dl",{className:"kv",children:[d.jsxs("div",{children:[d.jsx("dt",{children:"時間"}),d.jsxs("dd",{className:"num",children:[r.kind==="request"?"16:30〜20:00":`${qt(u.start)}〜${qt(u.end)}`,d.jsx("small",{children:r.kind==="request"?"（依頼枠を丸ごと占有）":`（${Kl(u.end-u.start)}）`})]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"機種"}),d.jsxs("dd",{children:[xi[r.machine].name,d.jsxs("small",{children:["／ ",xi[r.machine].maker]})]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"担当"}),d.jsx("dd",{children:f.length?f.map(p=>n0(p)).join(" / "):"休み"})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"申請者"}),d.jsxs("dd",{children:[r.who.name,d.jsxs("small",{children:["（",ji(r.who.hr),"・",r.who.num,"番）"]})]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"種別"}),d.jsxs("dd",{children:[yi[r.kind],d.jsx("small",{children:r.kind==="request"?"STL提出あり":"データ提出なし"})]})]})]}),d.jsxs("div",{children:[d.jsx("div",{className:"ftitle",children:"印刷データ"}),d.jsx(T1,{app:r})]}),r.note&&d.jsxs("div",{children:[d.jsx("div",{className:"ftitle",children:"申請者の備考"}),d.jsx("div",{className:"note tip",children:d.jsx("span",{children:r.note})})]}),d.jsx(C1,{app:r,onPartial:t,onCancelAll:s,onMove:o}),m.length>0&&d.jsxs("div",{children:[d.jsx("div",{className:"ftitle",children:"この申請の履歴"}),m.map(p=>d.jsxs("div",{className:"log-item "+p.type,children:[d.jsx("span",{className:"bd"}),d.jsxs("span",{className:"tx",children:[p.text,d.jsxs("span",{className:"at",children:[d.jsx("span",{className:"who",children:p.actor}),H0(p.at)]})]})]},p.id))]})]})}function R1({apps:r,selected:e,onPick:t,onOpen:s,onApprove:o,onCancel:l,onPartial:u,log:f,onDownload:m,onDownloadAll:p,onMove:g}){const y=Rg(r,e),_=eo(e),M=e<li,E=y.live.length;return d.jsxs("div",{className:"rs-grid",children:[d.jsx("div",{className:"rs-main",children:d.jsx(X0,{apps:r,avail:null,selected:e,onPick:t})}),d.jsx("div",{className:"rs-side",children:d.jsxs("div",{className:"card daycard",children:[d.jsxs("div",{className:"daycard-h",children:[d.jsx("span",{className:"dc-date num",children:Ad(e)}),d.jsx("span",{className:"dc-wd",children:wr[zn(e).getDay()]}),e===li&&d.jsx(Hl,{tone:"orange",children:"今日"}),M&&d.jsx(Hl,{children:"過ぎた日"}),d.jsx("span",{className:"dc-staff",children:_.length?_.map(w=>d.jsx(B0,{id:w,small:!0},w)):d.jsx("span",{className:"mtag none",children:"休み"})})]}),d.jsxs("div",{className:"daycard-counts",children:[d.jsxs("span",{className:"dc-c req",children:[d.jsx(qs,{kind:"request",size:"sm"}),d.jsx("b",{className:"num",children:y.requests.length})]}),d.jsxs("span",{className:"dc-c res",children:[d.jsx(qs,{kind:"reserve",size:"sm"}),d.jsx("b",{className:"num",children:y.reserves.length})]}),y.pending>0&&d.jsxs("span",{className:"dc-pend num",children:["申請中 ",y.pending]}),E>0&&d.jsxs("button",{type:"button",className:"btn btn-dl btn-sm dc-dl",onClick:()=>p(e),children:[d.jsx(Gu,{}),"この日の申請を一括DL（",E,"件）"]})]}),d.jsxs("div",{className:"dgroups",children:[["request","reserve"].map(w=>{const S=(w==="request"?y.requests:y.reserves).sort((b,R)=>mn(b).start-mn(R).start||Za.indexOf(b.machine)-Za.indexOf(R.machine)),x=S.filter(b=>b.status==="pending").length;return d.jsxs("div",{className:"dgroup",children:[d.jsxs("div",{className:"dg-head "+w,children:[d.jsx(qs,{kind:w}),d.jsxs("span",{className:"num",children:[S.length,"件"]}),x>0&&d.jsxs("span",{className:"dg-pend num",children:["申請中 ",x]})]}),S.length===0?d.jsxs("div",{className:"dg-empty",children:["この日の",yi[w],"はありません。"]}):S.map(b=>{const R=mn(b);return d.jsxs("div",{className:"drow "+b.status,children:[d.jsxs("span",{className:"dr-time num",children:[d.jsx("b",{children:qt(R.start)}),d.jsx("span",{children:qt(R.end)})]}),d.jsxs("span",{className:"dr-main",children:[d.jsx("span",{className:"dr-title",children:b.title}),d.jsxs("span",{className:"dr-sub",children:[d.jsx(Rd,{status:b.status}),d.jsx(O0,{id:b.machine}),xi[b.machine].short,d.jsx("span",{children:"·"}),b.who.name,b.file&&d.jsxs(d.Fragment,{children:[d.jsx("span",{children:"·"}),d.jsx("span",{className:"num",children:b.file})]})]})]}),d.jsxs("span",{className:"dr-acts",children:[b.status==="pending"&&d.jsx("button",{type:"button",className:"mini ok",onClick:()=>o(b),children:"確定"}),(b.status==="pending"||b.status==="approved"||b.status==="done")&&d.jsx("button",{type:"button",className:"mini move",onClick:()=>g(b),children:"変更"}),(b.status==="pending"||b.status==="approved")&&d.jsx("button",{type:"button",className:"mini no",onClick:()=>s(b,"cancel"),children:"取り消し"}),d.jsxs("span",{className:"dr-dl",children:[d.jsxs("button",{type:"button",className:"mini dl",onClick:()=>m(b),title:"この申請のテキストをダウンロード","aria-label":`${b.title} をダウンロード`,children:[d.jsx(Gu,{}),"DL"]}),b.file&&d.jsx("button",{type:"button",className:"mini dl icon-only",onClick:()=>m(b,"file"),title:`${b.file} をダウンロード`,"aria-label":`${b.file} をダウンロード`,children:d.jsx(Gu,{})})]}),d.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(b),"aria-label":"詳細",children:"›"})]})]},b.id)})]},w)}),y.cancelled.length>0&&d.jsxs("details",{className:"dcan",children:[d.jsxs("summary",{className:"num",children:["取り消し・却下 ",y.cancelled.length,"件"]}),y.cancelled.map(w=>{const S=mn(w);return d.jsxs("div",{className:"drow cancelled",children:[d.jsxs("span",{className:"dr-time num",children:[d.jsx("b",{children:qt(S.start)}),d.jsx("span",{children:qt(S.end)})]}),d.jsxs("span",{className:"dr-main",children:[d.jsx("span",{className:"dr-title",children:w.title}),d.jsxs("span",{className:"dr-sub",children:[d.jsx(Rd,{status:w.status}),d.jsx("span",{children:w.who.name}),d.jsx("span",{children:"·"}),d.jsx("span",{children:w.adminNote||"理由なし"})]})]}),d.jsxs("span",{className:"dr-acts",children:[d.jsx("button",{type:"button",className:"mini",onClick:()=>l(w,null,"","pending"),children:"戻す"}),d.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(w),children:"›"})]})]},w.id)})]})]})]})})]})}function N1({year:r,month:e,app:t,apps:s,onChangeMonth:o,onJumpToday:l}){const u=o0(r,e);return d.jsxs("div",{className:"mm",children:[d.jsxs("div",{className:"mm-h",children:[d.jsx("button",{type:"button",onClick:()=>o(-1),"aria-label":"前の月",children:"‹"}),d.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]}),d.jsx("button",{type:"button",onClick:()=>o(1),"aria-label":"次の月",children:"›"}),d.jsx("button",{type:"button",className:"mini",onClick:l,children:"今月"})]}),d.jsx("div",{className:"mm-wds",children:wr.map((f,m)=>d.jsx("span",{className:"mm-wd"+(m===0?" sun":m===6?" sat":""),children:f},f))}),d.jsx("div",{className:"mm-grid",children:u.map((f,m)=>{if(!f)return d.jsx("span",{className:"mm-cell pad"},"p"+m);const p=Yn(f),g=Ng(s,t,p),y=g.sameDay?"current":g.past?"past":g.full?"full":g.noStaff?"nostaff":"ok";return d.jsxs("button",{type:"button","data-date":p,className:"mm-cell "+y,onClick:()=>!g.past&&!g.sameDay&&o(0,p),"aria-label":`${f.getMonth()+1}月${f.getDate()}日 ${g.full?"埋まり":g.noStaff?"担当なし":"空き"}`,children:[d.jsx("span",{className:"num mm-d",children:f.getDate()}),d.jsx("span",{className:"mm-meta",children:g.sameDay?"現在":g.past?"—":g.noStaff?"担当なし":g.full?"満枠":`空き ${g.free}枠`}),g.liveCount>0&&!g.past&&d.jsx("span",{className:"mm-count num",children:g.liveCount})]},p)})})]})}function P1({open:r,app:e,apps:t,onClose:s,onMove:o}){const[l,u]=xe.useState(()=>{const x=e?zn(e.date):new Date;return{y:x.getFullYear(),m:x.getMonth()+1}}),[f,m]=xe.useState(null),[p,g]=xe.useState(!1);if(xe.useEffect(()=>{if(!e)return;const x=zn(e.date);u({y:x.getFullYear(),m:x.getMonth()+1}),m(null),g(!1)},[e&&e.id,r]),!r||!e)return null;const y=(x,b)=>{if(b){m(b);return}if(x===0){const R=new Date;u({y:R.getFullYear(),m:R.getMonth()+1});return}u(R=>{let D=R.y,$=R.m+x;return $<1&&($=12,D-=1),$>12&&($=1,D+=1),{y:D,m:$}})},_=f?Ng(t,e,f):null,E=!!(_&&(_.full||_.noStaff)),w=mn(e),S=()=>{o(e,f,{forced:E&&p,info:_}),m(null),g(!1)};return d.jsx(q0,{open:r,wide:!0,title:"別の日へ変更",sub:d.jsxs(d.Fragment,{children:[d.jsx("span",{children:e.title}),d.jsx("span",{children:"·"}),d.jsx("span",{className:"num",children:Tg(e.date)}),d.jsx("span",{children:"·"}),d.jsx("span",{children:yi[e.kind]})]}),onClose:s,footer:d.jsxs(d.Fragment,{children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:s,children:"閉じる"}),d.jsx("button",{type:"button",className:"btn btn-primary",disabled:!f||E&&!p,onClick:S,children:f?`${Ad(f)} に変更`:"日付を選択"})]}),children:d.jsxs("div",{className:"mv-body",children:[d.jsxs("div",{className:"mv-note",children:[d.jsxs("b",{children:[qt(w.start),"〜",qt(w.end)]}),d.jsx("span",{className:"mv-sep",children:"|"}),d.jsxs("span",{children:[xi[e.machine].name," ・ ",e.status==="approved"?"確定済みでも変更できます":"時間帯はそのまま移動します"]})]}),d.jsx(N1,{year:l.y,month:l.m,app:e,apps:t,onChangeMonth:y,onJumpToday:()=>y(0)}),d.jsxs("div",{className:"mv-legend",children:[d.jsx("span",{className:"mv-lg ok",children:"空き"}),d.jsx("span",{className:"mv-lg nostaff",children:"担当なし"}),d.jsx("span",{className:"mv-lg full",children:"満枠"}),d.jsx("span",{className:"mv-lg past",children:"過ぎた日"})]}),f&&_&&d.jsxs("div",{className:"mv-picked "+(_.full?"full":_.noStaff?"nostaff":"ok"),children:[d.jsxs("div",{className:"mvp-h",children:[d.jsxs("b",{className:"num",children:[Ad(_.date),"（",wr[zn(_.date).getDay()],"）"]}),d.jsx("span",{className:"mvp-state",children:_.noStaff?"担当者がいません":_.full?"満枠です":`空き ${_.free}/${_.total}枠`})]}),d.jsxs("div",{className:"mvp-meta",children:[d.jsxs("span",{children:["担当：",_.staffs.length?_.staffs.map(x=>jd(x)).join(" / "):"なし"]}),d.jsxs("span",{children:["この日の申請：",d.jsxs("span",{className:"num",children:[_.liveCount,"件"]})]})]}),E&&d.jsxs("label",{className:"mv-force",children:[d.jsx("input",{type:"checkbox",checked:p,onChange:x=>g(x.target.checked)}),d.jsxs("span",{children:[d.jsx("b",{children:_.noStaff?"担当者がいない日にも変更する":"満枠でも強制的に変更する"}),d.jsx("span",{className:"fl-h",children:_.noStaff?"担当者のいない日は本来受け付けていません。必要な場合だけ強制します。":"同じ時間帯の申請と重なります。両方を残したまま、この申請を確定・申請中にします。"})]})]})]})]})})}function L1({year:r,month:e,avail:t,memberId:s,onPaint:o,onChangeMonth:l}){const f=new Date(r,e-1,1).getDay(),m=new Date(r,e,0).getDate(),p=[];for(let j=0;j<f;j++)p.push(null);for(let j=1;j<=m;j++)p.push(new Date(r,e-1,j));const g=xe.useRef(null),y=xe.useRef(null),[_,M]=xe.useState(null),E=j=>p.filter(Boolean).filter(C=>C.getDay()===j).map(Yn),w=j=>j>=li,S=(j,C)=>{if(!s||!w(j)||C.pointerType==="mouse"&&C.button!==0)return;C.preventDefault();const T=!qa(s,j);y.current={mode:T,touched:[j]},M({dates:new Set([j]),on:T})},x=(j,C)=>{const T=document.elementFromPoint(j,C),V=T&&T.closest?T.closest(".scal-cell[data-date]"):null;return V?V.getAttribute("data-date"):null};xe.useEffect(()=>{const j=T=>{const V=y.current;if(!V)return;T.preventDefault();const G=x(T.clientX,T.clientY);!G||!w(G)||V.touched.indexOf(G)>=0||(V.touched.push(G),M(z=>{const X=new Set(z?z.dates:[]);return X.add(G),{dates:X,on:V.mode}}))},C=()=>{const T=y.current;if(!T)return;y.current=null;const V=T.touched.filter(w).slice();M(null),V.length&&o(V,T.mode)};return window.addEventListener("pointermove",j,{passive:!1}),window.addEventListener("pointerup",C),window.addEventListener("pointercancel",C),()=>{window.removeEventListener("pointermove",j),window.removeEventListener("pointerup",C),window.removeEventListener("pointercancel",C)}},[o,s]);const b=j=>_&&_.dates.has(j)?_.on:null,R=j=>{const C=b(j);return C!==null?C:s?qa(s,j):!1},D=j=>e0().filter(C=>(t[C.id]||[]).indexOf(j)>=0).map(C=>C.id),$=(Qr(s)||{}).color||"var(--color-primary)",I=j=>{if(!s)return;const C=E(j).filter(w);if(!C.length)return;const T=C.every(V=>qa(s,V));o(C,!T)},L=j=>{const C=E(j).filter(w);if(!s||!C.length)return"idle";const T=C.filter(V=>qa(s,V)).length;return T===0?"idle":T===C.length?"all":"some"};return d.jsxs("div",{className:"scal",ref:g,children:[d.jsxs("div",{className:"scal-h",children:[d.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]}),d.jsx("button",{type:"button",className:"mini",onClick:()=>l(0),children:"今月"})]}),d.jsxs("div",{className:"scal-body",children:[d.jsxs("button",{type:"button",className:"scal-side prev",onClick:()=>l(-1),"aria-label":"前の月",children:[d.jsx("span",{"aria-hidden":"true",children:"‹"}),d.jsx("span",{className:"scal-side-lbl",children:"前へ"})]}),d.jsxs("div",{className:"scal-main",children:[d.jsx("div",{className:"scal-wds",children:wr.map((j,C)=>{const T=L(C);return d.jsx("button",{type:"button","data-wd":C,className:"scal-wd"+(C===0?" sun":C===6?" sat":"")+(T==="all"?" all":T==="some"?" some":""),onClick:()=>I(C),title:`${j}曜日をこの月すべて${T==="all"?"削除":"追加"}`,"aria-label":`${j}曜日をこの月すべて${T==="all"?"削除":"追加"}`,children:j},j)})}),d.jsx("div",{className:"scal-grid"+(_?" painting":""),children:Array.from({length:Math.ceil(p.length/7)*7}).map((j,C)=>{const T=p[C];if(!T)return d.jsx("span",{className:"scal-cell pad"},"p"+C);const V=Yn(T),G=R(V),z=b(V),X=T.getDay(),Y=!w(V),le=D(V),fe=s?le.indexOf(s)>=0:!1;return d.jsxs("button",{type:"button","data-date":V,className:"scal-cell"+(G?" on":"")+(X===0?" sun":X===6?" sat":"")+(V===li?" today":"")+(Y?" past":"")+(z===!0?" pv-on":z===!1?" pv-off":"")+(fe?" mine":""),style:fe||z===!0&&s?{background:$+"1f",borderColor:$}:void 0,onPointerDown:k=>S(V,k),"aria-pressed":G,"aria-label":`${T.getMonth()+1}月${T.getDate()}日 ${le.length?le.map(jd).join("・"):"担当なし"}`,children:[d.jsx("span",{className:"num",children:T.getDate()}),d.jsxs("span",{className:"scal-dots",children:[le.slice(0,3).map(k=>d.jsx("span",{className:"scal-dot",style:{background:t0(k)}},k)),le.length>3&&d.jsxs("span",{className:"scal-dot more num",children:["+",le.length-3]})]})]},V)})})]}),d.jsxs("button",{type:"button",className:"scal-side next",onClick:()=>l(1),"aria-label":"次の月",children:[d.jsx("span",{"aria-hidden":"true",children:"›"}),d.jsx("span",{className:"scal-side-lbl",children:"次へ"})]})]}),d.jsxs("div",{className:"scal-foot",children:[d.jsx("span",{children:"日付をドラッグでなぞると、通った日をまとめて追加／削除します。曜日をクリックすると、その月の同じ曜日を一括で切り替えます。"}),!s&&d.jsx("span",{className:"scal-warn",children:"先に担当者を選んでください。"})]})]})}function D1({members:r,onAdd:e,onUpdate:t,onRemove:s}){const[o,l]=xe.useState(null),[u,f]=xe.useState({name:"",hr:"101",num:"",discord:"",color:Kr[0],hubUserId:null}),[m,p]=xe.useState(""),[g,y]=xe.useState([]),[_,M]=xe.useState(!1);xe.useEffect(()=>{!o||o==="new"||(M(!0),gx().then(y).catch(()=>y([])).finally(()=>M(!1)))},[o]);const E=b=>{l(b.id),f({name:b.name,hr:b.hr,num:String(b.num),discord:b.discord||"",color:b.color,hubUserId:b.userId??null}),p("")},w=()=>{l("new"),f({name:"",hr:"101",num:"",discord:"",color:Kr[r.length%Kr.length],hubUserId:null}),p("")},S=()=>{if(!u.name.trim())return"名前を入力してください";if(!Gp.includes(u.hr))return"HRは 101〜309 から選んでください";const b=Number(u.num);return!b||b<1||b>40?"番号は 1〜40 で入力してください":u.discord&&!/^\d{15,25}$/.test(u.discord.trim())?"Discord のユーザーIDは数字15〜25桁です":""},x=()=>{const b=S();if(b){p(b);return}const R={name:u.name.trim(),hr:u.hr,num:Number(u.num),discord:u.discord.trim(),color:u.color,hubUserId:u.hubUserId};o==="new"?e(R):t(o,R),l(null),p("")};return d.jsxs("div",{className:"mform",children:[d.jsxs("div",{className:"mform-h",children:[d.jsx("b",{children:"印刷担当者"}),d.jsxs("span",{className:"num",children:[r.length,"人"]}),o!=="new"&&d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:w,children:"担当者を追加"})]}),d.jsxs("div",{className:"mtable",children:[d.jsxs("div",{className:"mtr mtr-h",children:[d.jsx("span",{}),d.jsx("span",{children:"名前"}),d.jsx("span",{children:"HR"}),d.jsx("span",{children:"番号"}),d.jsx("span",{children:"Discord ID"}),d.jsx("span",{children:"ScienceHUB"}),d.jsx("span",{})]}),r.map(b=>d.jsxs("div",{className:"mtr",children:[d.jsx("span",{className:"mtd-av",style:{background:b.color},children:b.name.slice(0,1)}),d.jsx("span",{className:"mtd-name",children:b.name}),d.jsx("span",{className:"num",children:ji(b.hr)}),d.jsxs("span",{className:"num",children:[b.num,"番"]}),d.jsx("span",{className:"num mtd-discord",children:b.discord||d.jsx("em",{className:"mtd-none",children:"未設定"})}),d.jsx("span",{className:"mtd-hub",children:b.userId?"紐づけ済":d.jsx("em",{className:"mtd-none",children:"未紐づけ"})}),d.jsxs("span",{className:"mtd-acts",children:[d.jsx("button",{type:"button",className:"mini",onClick:()=>E(b),children:"編集"}),d.jsx("button",{type:"button",className:"mini no",disabled:r.length<=1,onClick:()=>{confirm(`${b.name} を削除します。この人のシフトも消えます。`)&&s(b.id)},children:"削除"})]})]},b.id))]}),(o==="new"||o)&&d.jsxs("div",{className:"medit",children:[d.jsxs("div",{className:"medit-h",children:[d.jsx("b",{children:o==="new"?"担当者を追加":"担当者を編集"}),d.jsx("button",{type:"button",className:"linkbtn",onClick:()=>{l(null),p("")},children:"閉じる"})]}),d.jsxs("div",{className:"medit-grid",children:[d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["名前",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input",value:u.name,maxLength:12,onChange:b=>f(R=>({...R,name:b.target.value})),placeholder:"例：佐々木"})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["HR",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("select",{className:"input",value:u.hr,onChange:b=>f(R=>({...R,hr:b.target.value})),children:Gp.map(b=>d.jsx("option",{value:b,children:ji(b)},b))})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["番号",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input num",type:"number",min:1,max:40,value:u.num,onChange:b=>f(R=>({...R,num:b.target.value})),placeholder:"12"})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["Discord ID",d.jsx("span",{className:"fl-opt",children:"任意"})]}),d.jsx("input",{className:"input num",value:u.discord,inputMode:"numeric",onChange:b=>f(R=>({...R,discord:b.target.value})),placeholder:"朝6時のメンション用"})]})]}),o!=="new"&&d.jsxs("div",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["ScienceHUB アカウント",d.jsx("span",{className:"fl-opt",children:"3D印刷管理にアクセス可能なユーザー"})]}),_?d.jsx("p",{className:"fl-h",children:"読み込み中…"}):d.jsxs("div",{className:"hub-user-pick",role:"radiogroup","aria-label":"ScienceHUB アカウントの紐づけ",children:[d.jsxs("button",{type:"button",className:"hub-user-opt"+(u.hubUserId===null?" on":""),onClick:()=>f(b=>({...b,hubUserId:null})),children:[d.jsx("b",{children:"紐づけなし"}),d.jsx("span",{children:"この印刷担当者は ScienceHUB ログインと結びつきません"})]}),g.map(b=>{const R=b.linked_member_id&&b.linked_member_id!==o;return d.jsxs("button",{type:"button",disabled:!!R,className:"hub-user-opt"+(u.hubUserId===b.id?" on":""),onClick:()=>f(D=>({...D,hubUserId:b.id})),children:[d.jsx("b",{children:b.display_name}),d.jsxs("span",{children:["@",b.username," · ",b.email]}),d.jsx("em",{children:b.access_labels.join(" / ")}),R?d.jsxs("em",{children:["（別の印刷担当に紐づけ済: ",b.linked_member_name,"）"]}):null,b.linked_member_id===o?d.jsx("em",{children:"（この担当者に紐づけ中）"}):null]},b.id)})]})]}),d.jsxs("div",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"シフト表の色"}),d.jsx("div",{className:"color-pick",children:Kr.map(b=>d.jsx("button",{type:"button",className:u.color===b?"on":"",style:{background:b},onClick:()=>f(R=>({...R,color:b})),"aria-label":`色 ${b}`,"aria-pressed":u.color===b},b))})]}),m&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:m})}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{l(null),p("")},children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:x,children:o==="new"?"追加する":"保存する"})]})]})]})}function U1({configured:r,onSend:e}){const[t,s]=xe.useState(""),[o,l]=xe.useState(null),[u,f]=xe.useState(!1),m=async()=>{const p=t.trim();if(!p){l({ok:!1,text:"送信先メールアドレスを入力してください"});return}f(!0),l({ok:null,text:"送信中…"});try{const g=await e(p);l({ok:!0,text:`送信しました（${g.to??p}）`})}catch(g){l({ok:!1,text:g instanceof Error?g.message:"送信に失敗しました"})}finally{f(!1)}};return d.jsxs("section",{className:"intg","data-testid":"email-test-section",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"予約者向けメール（Cloudflare Email Sending）"}),d.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"設定済み":"未設定"})]}),d.jsx("p",{className:"fl-h",children:"申請・受領通知はサーバー環境変数（PRINT_3D_EMAIL_FROM、CLOUDFLARE_API_TOKEN 等）経由で送信されます。 下の欄に任意のアドレスを入れて、同じ経路のテストメールを送れます。"}),!r&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:"メール送信が未設定です。Cloudflare Email Service のドメイン認証と Pages のシークレットを確認してください。"})}),d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"テスト送信先"}),d.jsx("input",{className:"input",type:"email",autoComplete:"email",spellCheck:!1,"data-testid":"email-test-to",value:t,onChange:p=>s(p.target.value),placeholder:"you@example.com",disabled:!r||u})]}),d.jsx("div",{className:"intg-f",children:d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"email-test-send",disabled:!r||u||!t.trim(),onClick:()=>void m(),children:"テスト送信"})}),o&&d.jsx("p",{className:"fl-h"+(o.ok===!0?"":o.ok===!1?" warn":""),role:"status","data-testid":"email-test-result",children:o.text})]})}function I1({configured:r,members:e,onSend:t}){var M;const[s,o]=xe.useState(()=>new Set),[l,u]=xe.useState(null),[f,m]=xe.useState(!1),p=E=>{o(w=>{const S=new Set(w);return S.has(E)?S.delete(E):S.add(E),S})},g=async()=>{var w;const E=[...s];if(!E.length){u({ok:!1,text:"メンションする担当者を1人以上選んでください"});return}m(!0),u({ok:null,text:"Discord へ送信中…"});try{const S=await t(E),x=(S.sent||[]).map(R=>R.name).join("・"),b=((w=S.skipped)==null?void 0:w.length)>0?`（スキップ: ${S.skipped.map(R=>`${R.name}: ${R.reason}`).join(" / ")}）`:"";u({ok:!0,text:`送信しました。Discord で ${x} へのメンション（青字）を確認してください。${b}`,detail:S.content,sent:S.sent})}catch(S){u({ok:!1,text:S instanceof Error?S.message:"送信に失敗しました"})}finally{m(!1)}},y=e.filter(E=>(E.discord||"").trim()),_=e.some(E=>(E.discord||"").trim());return d.jsxs("section",{className:"intg","data-testid":"discord-mention-test-section",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"Discord メンションのテスト"}),d.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"Webhook設定済み":"Webhook未設定"})]}),d.jsxs("p",{className:"fl-h",children:["朝6時の担当者メンションと同じ形式で、選んだ担当者に ",d.jsx("code",{children:"<@ユーザーID>"})," を送ります。 チャンネルで名前が青く通知されれば、その Discord ID は正しく設定されています。"]}),!r&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:"サーバーに Discord Webhook（DISCORD_WEBHOOK_URL）が未設定です。Wrangler / Pages の環境変数を確認してください。"})}),!_&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:"担当者タブで Discord ユーザーID（数字）を登録してからテストしてください。"})}),d.jsxs("div",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"メンションする担当者"}),d.jsx("div",{className:"mp-list",style:{marginTop:8},children:e.map(E=>{const w=(E.discord||"").trim(),S=!!w,x=s.has(E.id);return d.jsxs("button",{type:"button",className:"mp"+(x?" on":"")+(S?"":" disabled"),style:x?{borderColor:E.color,background:E.color+"14"}:void 0,disabled:!r||f||!S,"data-testid":`discord-mention-member-${E.id}`,onClick:()=>S&&p(E.id),"aria-pressed":x,children:[d.jsx("span",{className:"mp-av",style:{background:E.color},children:E.name.slice(0,1)}),d.jsxs("span",{className:"mp-tx",children:[d.jsx("b",{children:E.name}),d.jsxs("span",{className:"num",children:[ji(E.hr),"・",E.num,"番"]})]}),d.jsx("span",{className:"num mtd-discord",children:w||"ID未設定"})]},E.id)})}),y.length>0&&d.jsx("span",{className:"fl-h",children:"ID未設定の担当者は選択できません（担当者タブで編集）。"})]}),d.jsx("div",{className:"intg-f",children:d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"discord-mention-test-send",disabled:!r||f||s.size===0,onClick:()=>void g(),children:"メンションをテスト送信"})}),l&&d.jsx("p",{className:"fl-h"+(l.ok===!0?"":l.ok===!1?" warn":""),role:"status","data-testid":"discord-mention-test-result",children:l.text}),(l==null?void 0:l.ok)===!0&&((M=l.sent)==null?void 0:M.length)>0&&d.jsx("ul",{className:"fl-h","data-testid":"discord-mention-test-sent-list",style:{marginTop:4,paddingLeft:"1.2rem"},children:l.sent.map(E=>d.jsxs("li",{children:[d.jsx("b",{children:E.name})," — メンション ID: ",d.jsx("span",{className:"num",children:E.discord_user_id})]},E.member_id))}),(l==null?void 0:l.detail)&&d.jsxs("details",{className:"fl-h",style:{marginTop:8},children:[d.jsx("summary",{children:"送信したメッセージ本文"}),d.jsx("pre",{className:"mono",style:{whiteSpace:"pre-wrap",fontSize:"0.85em",marginTop:6},children:l.detail})]})]})}function F1({value:r,onChange:e,onTestDiscord:t,onTestDiscordMention:s,onTestGcal:o,onTestEmail:l,emailConfigured:u,discordConfigured:f,members:m}){const p=r.discord||{},g=r.gcal||{},y=x=>e({...r,discord:{...p,...x}}),_=x=>e({...r,gcal:{...g,...x}}),E=(p.webhook||"").includes("サーバー設定")||/^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(p.webhook||""),S=(g.calendarId||"").includes("サーバー設定")||/^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(g.calendarId||"");return d.jsxs("div",{className:"integ",children:[d.jsxs("section",{className:"intg",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"Discord 通知"}),d.jsx("span",{className:"intg-state "+(p.enabled?E?"ok":"warn":"off"),children:p.enabled?E?"有効":"URL未設定":"無効"}),d.jsxs("label",{className:"sw",children:[d.jsx("input",{type:"checkbox",checked:!!p.enabled,onChange:x=>y({enabled:x.target.checked})}),d.jsx("span",{})]})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["Webhook URL",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input mono",value:p.webhook||"",spellCheck:"false",onChange:x=>y({webhook:x.target.value.trim()}),placeholder:"https://discord.com/api/webhooks/123.../abc..."}),d.jsx("span",{className:"fl-h",children:"Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURL。"})]}),!E&&(p.webhook||"")&&d.jsx("div",{className:"note warn",children:d.jsxs("span",{children:["URLの形式が違います。",d.jsx("b",{children:"https://discord.com/api/webhooks/…"})," の形で貼り付けてください。"]})}),d.jsxs("div",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"通知するタイミング"}),d.jsx("div",{className:"chk-grid",children:[["pending","新しい申請"],["approved","確定したとき"],["cancelled","取り消したとき"]].map(([x,b])=>d.jsxs("label",{className:"chk",children:[d.jsx("input",{type:"checkbox",checked:!!(p.events&&p.events[x]),onChange:R=>y({events:{...p.events,[x]:R.target.checked}})}),d.jsx("span",{children:b})]},x))})]}),d.jsxs("label",{className:"chk",style:{alignSelf:"flex-start"},children:[d.jsx("input",{type:"checkbox",checked:!!p.dailyMention,onChange:x=>y({dailyMention:x.target.checked})}),d.jsx("span",{children:"当日の担当者を朝6:00にメンションする"})]}),d.jsx("span",{className:"fl-h",style:{marginTop:-6},children:"メンバーに登録した Discord ID を使います。未設定の人はメンションされません。"}),d.jsxs("div",{className:"intg-f",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:t,disabled:!E,children:"テスト送信"}),d.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),s&&(m==null?void 0:m.length)>0&&d.jsx(I1,{configured:!!f,members:m,onSend:s}),d.jsxs("section",{className:"intg",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"Google カレンダー"}),d.jsx("span",{className:"intg-state "+(g.enabled?S?"ok":"warn":"off"),children:g.enabled?S?"有効":"ID未設定":"無効"}),d.jsxs("label",{className:"sw",children:[d.jsx("input",{type:"checkbox",checked:!!g.enabled,onChange:x=>_({enabled:x.target.checked})}),d.jsx("span",{})]})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["カレンダーID",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input mono",value:g.calendarId||"",spellCheck:"false",onChange:x=>_({calendarId:x.target.value.trim()}),placeholder:"xxxx@group.calendar.google.com"}),d.jsx("span",{className:"fl-h",children:"共有カレンダーの「設定 → カレンダーの統合」に載っているID。"})]}),d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"予定タイトルの書式"}),d.jsx("input",{className:"input",value:g.title||"",onChange:x=>_({title:x.target.value}),placeholder:"[3Dプリント] {title}"}),d.jsxs("span",{className:"fl-h",children:["{title}"," 作品名 / ","{who}"," 申請者 / ","{machine}"," 機種 に置き換わります。"]})]}),d.jsxs("div",{className:"fl-2",children:[d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"所要時間"}),d.jsx("select",{className:"input",value:g.duration||20,onChange:x=>_({duration:Number(x.target.value)}),children:[10,15,20,30,60,90,120].map(x=>d.jsxs("option",{value:x,children:[x,"分"]},x))})]}),d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"登録する時点"}),d.jsxs("select",{className:"input",value:g.syncOn||"approved",onChange:x=>_({syncOn:x.target.value}),children:[d.jsx("option",{value:"pending",children:"申請が届いた時点"}),d.jsx("option",{value:"approved",children:"確定した時点"})]})]})]}),d.jsxs("div",{className:"intg-f",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:o,disabled:!S,children:"接続テスト"}),d.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),l&&d.jsx(U1,{configured:u,onSend:l})]})}function O1({members:r,avail:e,onAddMember:t,onUpdateMember:s,onRemoveMember:o,onPaintAvail:l,shiftDraftPending:u,shiftApplying:f,onConfirmShiftDraft:m,onDiscardShiftDraft:p,onLoadShiftMonth:g,integrations:y,setIntegrations:_,onTestDiscord:M,onTestDiscordMention:E,onTestGcal:w,onTestEmail:S,emailConfigured:x,discordConfigured:b,log:R,pendingPre:D}){const[$,I]=xe.useState(D||"shift"),[L,j]=xe.useState(r[0]?r[0].id:null),[C,T]=xe.useState(()=>{const Y=new Date;return{y:Y.getFullYear(),m:Y.getMonth()+1}});xe.useEffect(()=>{D&&I(D)},[D]),xe.useEffect(()=>{r.length&&!r.find(Y=>Y.id===L)&&j(r[0].id)},[r]);const V=xe.useRef("");xe.useEffect(()=>{if($!=="shift"||u)return;const Y=`${C.y}-${C.m}`;V.current!==Y&&(V.current=Y,g(C.y,C.m))},[$,C.y,C.m,g,u]);const G=[["shift","シフト表"],["member","担当者"],["integ","外部連携"]],z=Y=>{if(u){const le=Y===0?"未保存のシフト変更があります。破棄して今月へ移動しますか？":"未保存のシフト変更があります。破棄して月を移動しますか？";if(!window.confirm(le))return;p(),V.current=""}if(Y===0){const le=new Date;T({y:le.getFullYear(),m:le.getMonth()+1});return}T(le=>{let fe=le.y,k=le.m+Y;return k<1&&(k=12,fe-=1),k>12&&(k=1,fe+=1),{y:fe,m:k}})},X=r.find(Y=>Y.id===L);return d.jsxs("div",{className:"set-wrap",children:[d.jsx("div",{className:"set-tabs",role:"tablist",children:G.map(([Y,le])=>d.jsx("button",{type:"button",role:"tab","aria-selected":$===Y,className:$===Y?"on":"",onClick:()=>I(Y),children:le},Y))}),$==="shift"&&d.jsxs("div",{className:"shifttab",children:[u&&d.jsxs("div",{className:"shift-confirm-bar",role:"status",children:[d.jsx("span",{className:"shift-confirm-bar-text",children:"未保存のシフト変更があります"}),d.jsxs("div",{className:"shift-confirm-bar-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:f,onClick:p,children:"変更を破棄"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",disabled:f,onClick:m,children:f?"保存中…":"変更を確定"})]})]}),d.jsxs("div",{className:"card memberpick",children:[d.jsxs("div",{className:"mp-h",children:[d.jsx("b",{children:"担当者を選んで、日付を塗る"}),d.jsx("span",{className:"fl-h",children:"選択した担当者の稼働日をカレンダー上で直接追加・削除できます。確定するまでサーバーには保存されません。"})]}),d.jsx("div",{className:"mp-list",children:r.map(Y=>{const le=(e[Y.id]||[]).filter(fe=>fe>=li).length;return d.jsxs("button",{type:"button",className:"mp"+(L===Y.id?" on":""),style:L===Y.id?{borderColor:Y.color,background:Y.color+"14"}:void 0,onClick:()=>j(Y.id),children:[d.jsx("span",{className:"mp-av",style:{background:Y.color},children:Y.name.slice(0,1)}),d.jsxs("span",{className:"mp-tx",children:[d.jsx("b",{children:Y.name}),d.jsxs("span",{className:"num",children:[ji(Y.hr),"・",Y.num,"番"]})]}),d.jsxs("span",{className:"mp-count num",children:[le,"日"]})]},Y.id)})})]}),d.jsxs("div",{className:"card",children:[d.jsxs("div",{className:"card-h",children:[d.jsx("b",{children:"シフト表"}),d.jsx("span",{className:"meta",children:X?`${X.name} の稼働日`:"担当者を選択"}),X&&d.jsx("span",{className:"chip",style:{marginLeft:"auto",borderColor:X.color,color:X.color},children:"ドラッグで追加"})]}),d.jsxs("div",{className:"shifttab-body",children:[d.jsx(L1,{year:C.y,month:C.m,avail:e,memberId:L,onPaint:(Y,le)=>l(L,Y,le),onChangeMonth:z}),d.jsxs("div",{className:"srule-wrap",children:[d.jsxs("div",{className:"srule-h",children:[d.jsx("b",{children:"この月の担当"}),d.jsx("span",{className:"fl-h",children:"日付をドラッグでなぞるか、上の曜日をクリックすると一括で切り替わります。編集後は「変更を確定」でまとめて保存します。"})]}),d.jsx(k1,{members:r,avail:e,month:C,onPickMember:j})]})]})]})]}),$==="member"&&d.jsx(D1,{members:r,onAdd:t,onUpdate:s,onRemove:o}),$==="integ"&&d.jsx(F1,{value:y,onChange:_,onTestDiscord:M,onTestDiscordMention:E,onTestGcal:w,onTestEmail:S,emailConfigured:x,discordConfigured:b,members:r})]})}function k1({members:r,avail:e,month:t,onPickMember:s}){const o=[],l=new Date(t.y,t.m,0).getDate();for(let u=1;u<=l;u++)o.push(Yn(new Date(t.y,t.m-1,u)));return d.jsxs("div",{className:"slegend",children:[r.map(u=>{const f=o.filter(m=>(e[u.id]||[]).indexOf(m)>=0);return d.jsxs("button",{type:"button",className:"sl",onClick:()=>s(u.id),children:[d.jsx("span",{className:"sl-dot",style:{background:u.color}}),d.jsxs("span",{className:"sl-tx",children:[d.jsx("b",{children:u.name}),d.jsxs("span",{className:"num",children:[f.length,"日"]})]})]},u.id)}),d.jsx("p",{className:"sl-note",children:"日付の下の点が、その日に入っている担当者の色です。"})]})}const z1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"},B1={small:"S",medium:"M",large:"L"};function j1({reservations:r,onOpen:e}){const t=[...r].sort((s,o)=>{const l=o.desired_date.localeCompare(s.desired_date);return l!==0?l:o.created_at.localeCompare(s.created_at)});return t.length?d.jsx("div",{className:"card legacy-panel",children:d.jsx("div",{className:"table-wrap admin-table-wrap",children:d.jsxs("table",{children:[d.jsx("thead",{children:d.jsxs("tr",{children:[d.jsx("th",{children:"希望日"}),d.jsx("th",{children:"HR"}),d.jsx("th",{children:"タイトル"}),d.jsx("th",{children:"規模"}),d.jsx("th",{children:"ステータス"}),d.jsx("th",{children:"担当"}),d.jsx("th",{})]})}),d.jsx("tbody",{children:t.map(s=>d.jsxs("tr",{children:[d.jsx("td",{children:s.desired_date}),d.jsx("td",{children:s.homeroom}),d.jsx("td",{children:s.title}),d.jsx("td",{children:B1[s.print_scale]??s.print_scale}),d.jsx("td",{children:d.jsx("span",{className:`status-badge status-${s.status}`,children:z1[s.status]??s.status})}),d.jsx("td",{children:s.print_staff_label?`担当: ${s.print_staff_label}`:"—"}),d.jsx("td",{children:d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>e(s),children:"詳細"})})]},s.id))})]})})}):d.jsx("p",{className:"hint admin-list-empty",children:"履歴がありません"})}function H1({onToast:r,onReload:e}){var T,V;const[t,s]=xe.useState([]),[o,l]=xe.useState(""),[u,f]=xe.useState(null),[m,p]=xe.useState(""),[g,y]=xe.useState(null),[_,M]=xe.useState(!1),[E,w]=xe.useState([]),[S,x]=xe.useState(""),[b,R]=xe.useState([]),D=xe.useCallback(async()=>{const[G,z]=await Promise.all([Sg(),Gx()]);s(G.printers),p(z.storage_path??""),w(z.group_roots??[])},[]);xe.useEffect(()=>{D().catch(G=>r(G instanceof Error?G.message:"読み込み失敗"))},[D,r]);const $=async()=>{if(o.trim())try{await Ax(o.trim(),u??void 0),l(""),f(null),await D(),e==null||e(),r("プリンターを追加しました")}catch(G){r(G instanceof Error?G.message:"追加失敗")}},I=async()=>{try{await Wx(m.trim()),r("印刷動画の保存先を更新しました")}catch(G){r(G instanceof Error?G.message:"保存失敗")}},L=async()=>{var z,X;if(!g)return;const G=(((z=g.capabilities)==null?void 0:z.nozzle_sizes_mm)??["0.4"]).map(String).filter(Boolean);try{await Cx(g.id,{name:g.name.trim(),status:g.status,capabilities:{can_record_print_video:!!((X=g.capabilities)!=null&&X.can_record_print_video),nozzle_sizes_mm:G},daily_capacity:g.daily_capacity}),y(null),await D(),r("更新しました")}catch(Y){r(Y instanceof Error?Y.message:"更新失敗")}},j=async()=>{M(!0),x(""),R([])},C=async G=>{if(x(G),!G){R([]);return}const z=await jx(G);R(z.items.map(X=>({path:X.path,name:X.name})))};return d.jsxs("div",{className:"legacy-panel",children:[d.jsxs("section",{className:"card",id:"print-video-settings-section",children:[d.jsx("h2",{className:"section-heading",children:"印刷動画の保存先"}),d.jsx("p",{className:"hint",children:"管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。"}),d.jsxs("div",{className:"form-group",children:[d.jsx("label",{htmlFor:"print-video-storage-path",children:"保存先フォルダ"}),d.jsxs("div",{style:{display:"flex",gap:8},children:[d.jsx("input",{id:"print-video-storage-path",className:"input",value:m,readOnly:!0,placeholder:"未設定（参照から選択）"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void j(),children:"参照…"})]})]}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void I(),children:"保存先を保存"})]}),d.jsxs("section",{className:"card",style:{marginTop:16},children:[d.jsx("h2",{className:"section-heading",children:"プリンター管理"}),d.jsx("div",{className:"printer-admin-grid",children:t.map(G=>{var z,X;return d.jsxs("article",{className:"printer-admin-card",children:[G.image_url?d.jsx("img",{className:"printer-admin-image",src:G.image_url,alt:""}):d.jsx("div",{className:"printer-admin-image printer-admin-image-placeholder",children:"🖨️"}),d.jsx("div",{className:"printer-admin-body",children:d.jsxs(d.Fragment,{children:[d.jsx("h3",{className:"printer-admin-title",children:G.name}),d.jsxs("p",{className:"hint printer-admin-cap-summary",children:[G.status??"available"," / ノズル ",(((z=G.capabilities)==null?void 0:z.nozzle_sizes_mm)??[]).join(", ")||"—"," /"," ",(X=G.capabilities)!=null&&X.can_record_print_video?"動画撮影可":"動画撮影不可"]}),d.jsxs("div",{className:"printer-admin-actions",children:[d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>y(G),children:"編集"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{confirm(`「${G.name}」を削除しますか？`)&&Rx(G.id).then(D).then(()=>r("削除しました")).catch(Y=>r(Y instanceof Error?Y.message:"削除失敗"))},children:"削除"}),d.jsxs("label",{className:"btn btn-secondary btn-sm",children:["画像",d.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:Y=>{var fe;const le=(fe=Y.target.files)==null?void 0:fe[0];le&&bx(G.id,le).then(D).catch(k=>r(k instanceof Error?k.message:"画像失敗"))}})]})]})]})})]},G.id)})}),d.jsxs("div",{className:"mem-add",style:{marginTop:16},children:[d.jsx("input",{className:"input",placeholder:"新しいプリンター名",value:o,onChange:G=>l(G.target.value)}),d.jsx("input",{type:"file",accept:"image/*",onChange:G=>{var z;return f(((z=G.target.files)==null?void 0:z[0])??null)}}),d.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>void $(),children:"追加"})]})]}),g&&d.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[d.jsx("div",{className:"legacy-modal-scrim",onClick:()=>y(null)}),d.jsxs("div",{className:"legacy-modal-body card",children:[d.jsxs("h2",{children:[g.name," を編集"]}),d.jsxs("label",{className:"form-group",children:["名前",d.jsx("input",{className:"input",value:g.name,onChange:G=>y({...g,name:G.target.value})})]}),d.jsxs("label",{className:"form-group",children:["ステータス",d.jsxs("select",{className:"input",value:g.status??"available",onChange:G=>y({...g,status:G.target.value}),children:[d.jsx("option",{value:"available",children:"稼働"}),d.jsx("option",{value:"maintenance",children:"メンテ"}),d.jsx("option",{value:"unavailable",children:"印刷不能"})]})]}),d.jsxs("label",{className:"form-group",children:["ノズル径（カンマ区切り）",d.jsx("input",{className:"input",value:(((T=g.capabilities)==null?void 0:T.nozzle_sizes_mm)??[]).join(", "),onChange:G=>y({...g,capabilities:{...g.capabilities,nozzle_sizes_mm:G.target.value.split(",").map(z=>z.trim()).filter(Boolean)}})})]}),d.jsxs("label",{className:"chk",children:[d.jsx("input",{type:"checkbox",checked:!!((V=g.capabilities)!=null&&V.can_record_print_video),onChange:G=>y({...g,capabilities:{...g.capabilities,can_record_print_video:G.target.checked}})}),"動画撮影可"]}),d.jsx("div",{className:"form-grid",style:{gridTemplateColumns:"1fr 1fr",marginTop:8},children:["max_small","max_small_with_main","max_medium","max_large"].map(G=>{var z;return d.jsxs("label",{children:[G,d.jsx("input",{className:"input",type:"number",value:((z=g.daily_capacity)==null?void 0:z[G])??0,onChange:X=>y({...g,daily_capacity:{...g.daily_capacity,[G]:Number(X.target.value)}})})]},G)})}),d.jsxs("div",{className:"legacy-modal-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>y(null),children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>void L(),children:"保存"})]})]})]}),_&&d.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[d.jsx("div",{className:"legacy-modal-scrim",onClick:()=>M(!1)}),d.jsxs("div",{className:"legacy-modal-body card",children:[d.jsx("h2",{children:"保存先フォルダ"}),d.jsx("p",{className:"hint",children:S||"チームを選んでください"}),d.jsxs("div",{style:{display:"grid",gap:6,maxHeight:280,overflow:"auto"},children:[!S&&E.map(G=>d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void C(G.path),children:G.label},G.path)),S&&d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void C(""),children:"チームへ戻る"}),b.map(G=>d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void C(G.path),children:G.name},G.path))]}),d.jsxs("div",{className:"legacy-modal-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>M(!1),children:"閉じる"}),d.jsx("button",{type:"button",className:"btn btn-primary",disabled:!S,onClick:()=>{p(S),M(!1)},children:"このフォルダを選択"})]})]})]})]})}class Ol extends Error{constructor(t,s){super(t);Rs(this,"status");this.name="ApiError",this.status=s}}const vg="/api/3dprint",V1=[".stl",".gcode",".gco",".nc",".3mf",".obj"];function G1(r){const e=r.toLowerCase();return V1.some(t=>e.endsWith(t))}async function W1(r){if(!G1(r.name))throw new Ol("対応していないファイル形式です",400);const e=await fetch(`${vg}/upload/initiate`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:r.name,size:r.size})}),t=await e.json();if(!e.ok)throw new Ol(t.error||"upload init failed",e.status);if(t.mode==="simple"&&t.r2Key){const s=new URLSearchParams({r2Key:t.r2Key,filename:r.name}),o=await fetch(`${vg}/upload/simple?${s}`,{method:"PUT",credentials:"include",body:r}),l=await o.json();if(!o.ok)throw new Ol(l.error||"upload failed",o.status);return{r2_key:l.r2_key??t.r2Key,filename:l.filename??r.name,size_bytes:l.size_bytes??r.size}}throw new Ol("大容量ファイルのマルチパートは未対応（20MB未満で試してください）",400)}function X1({open:r,date:e,onClose:t,onSaved:s,onToast:o}){const[l,u]=xe.useState(""),[f,m]=xe.useState(""),[p,g]=xe.useState(""),[y,_]=xe.useState(""),[M,E]=xe.useState("small"),[w,S]=xe.useState(""),[x,b]=xe.useState(["small","medium","large"]),[R,D]=xe.useState([]),[$,I]=xe.useState(null),[L,j]=xe.useState(!0),[C,T]=xe.useState("club"),[V,G]=xe.useState(!1);if(xe.useEffect(()=>{!r||!e||(async()=>{var X;try{const[Y,le]=await Promise.all([Nx(e),Sg()]);(X=Y.availableScales)!=null&&X.length&&(b(Y.availableScales),E(Y.availableScales[0])),D(le.printers.map(fe=>({id:fe.id,name:fe.name}))),le.printers[0]&&S(le.printers[0].id)}catch(Y){o(Y instanceof Error?Y.message:"空き情報の取得に失敗")}})()},[r,e,o]),!r)return null;const z=async()=>{G(!0);try{let X=null;if($&&(X=await W1($)),L)await Px({desired_date:e,homeroom:l.trim()||null,student_number:f.trim()?Number(f):null,student_name:p.trim()||null,title:y.trim()||null,purpose:C,print_scale:M||null,printer_id:w||null,...X?{stl_r2_key:X.r2_key,stl_filename:X.filename,stl_size_bytes:X.size_bytes}:{}}),o("仮予約をカレンダーに追加しました");else{if(!X)throw new Error("ファイルをアップロードしてください");await Bx({desired_date:e,homeroom:l.trim(),student_number:Number(f),student_name:p.trim(),title:y.trim(),purpose:C,print_scale:M,printer_id:w,stl_r2_key:X.r2_key,stl_filename:X.filename,stl_size_bytes:X.size_bytes}),o("予約を追加しました")}s(),t()}catch(X){o(X instanceof Error?X.message:"保存に失敗しました")}finally{G(!1)}};return d.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[d.jsx("div",{className:"legacy-modal-scrim",onClick:t}),d.jsxs("div",{className:"legacy-modal-body card",children:[d.jsxs("h2",{children:[L?"仮予約（管理者）":"通常予約"," — ",e]}),d.jsxs("label",{className:"chk",children:[d.jsx("input",{type:"checkbox",checked:L,onChange:X=>j(X.target.checked)}),"必須を緩めて仮予約（legacy force）"]}),d.jsxs("div",{className:"form-grid",children:[d.jsxs("label",{children:["HR",d.jsx("input",{className:"input",value:l,onChange:X=>u(X.target.value),placeholder:"101"})]}),d.jsxs("label",{children:["番号",d.jsx("input",{className:"input",value:f,onChange:X=>m(X.target.value)})]}),d.jsxs("label",{children:["氏名",d.jsx("input",{className:"input",value:p,onChange:X=>g(X.target.value)})]}),d.jsxs("label",{children:["タイトル",d.jsx("input",{className:"input",value:y,onChange:X=>_(X.target.value)})]}),d.jsxs("label",{children:["規模",d.jsx("select",{className:"input",value:M,onChange:X=>E(X.target.value),children:x.map(X=>d.jsx("option",{value:X,children:X},X))})]}),d.jsxs("label",{children:["プリンター",d.jsx("select",{className:"input",value:w,onChange:X=>S(X.target.value),children:R.map(X=>d.jsx("option",{value:X.id,children:X.name},X.id))})]}),d.jsxs("label",{children:["目的",d.jsxs("select",{className:"input",value:C,onChange:X=>T(X.target.value),children:[d.jsx("option",{value:"ss_s_tan",children:"SS・S探"}),d.jsx("option",{value:"club",children:"部活"}),d.jsx("option",{value:"other",children:"その他"})]})]}),d.jsxs("label",{children:["STL",L?"（任意）":"（必須）",d.jsx("input",{type:"file",accept:".stl,.3mf,.obj,.gcode",onChange:X=>{var Y;return I(((Y=X.target.files)==null?void 0:Y[0])??null)}})]})]}),d.jsxs("div",{className:"legacy-modal-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:t,children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-primary",disabled:V,onClick:()=>void z(),children:L?"仮予約を追加":"予約を追加"})]})]})]})}const $1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function q1({reservation:r,onClose:e,onToast:t,onUpdated:s}){const[o,l]=xe.useState(!1);if(xe.useEffect(()=>{l(!!(r!=null&&r.has_print_video))},[r]),!r)return null;const u=async m=>{try{await Xx(r.id,m),l(!0),t("印刷動画をアップロードしました"),s()}catch(p){t(p instanceof Error?p.message:"アップロード失敗")}},f=async()=>{try{await $x(r.id),l(!1),t("印刷動画を削除しました"),s()}catch(m){t(m instanceof Error?m.message:"削除失敗")}};return d.jsxs(Z0,{open:!!r,title:r.title,sub:`${r.desired_date} · ${r.printer_name??""}`,onClose:e,footer:d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[d.jsxs("dl",{className:"kv",children:[d.jsxs("div",{children:[d.jsx("dt",{children:"ステータス"}),d.jsx("dd",{children:$1[r.status]??r.status})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"申請者"}),d.jsxs("dd",{children:[r.student_name,"（",r.homeroom," · ",r.student_number,"）"]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"担当"}),d.jsx("dd",{children:r.print_staff_label??"—"})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"規模"}),d.jsx("dd",{children:r.print_scale})]})]}),d.jsx("div",{className:"ftitle",children:"印刷動画"}),o?d.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[d.jsx("a",{className:"btn btn-secondary btn-sm",href:qx(r.id),download:!0,children:"動画をダウンロード"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void f(),children:"動画を削除"})]}):d.jsx("p",{className:"hint",children:"未アップロード"}),d.jsx("input",{type:"file",accept:"video/*",onChange:m=>{var g;const p=(g=m.target.files)==null?void 0:g[0];p&&u(p)}}),d.jsx("div",{style:{marginTop:12,display:"flex",gap:8},children:d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void Td(r.id,{status:"delivered"}).then(s).then(()=>t("完了にしました")).catch(m=>t(m instanceof Error?m.message:"更新失敗")),children:"完了にする"})})]})}function Y1({onBack:r,showToast:e}){const[t,s]=xe.useState("printers"),[o,l]=xe.useState(!1),[u,f]=xe.useState(null),[m,p]=xe.useState(0),[g,y]=xe.useState([]),[_]=xe.useState(()=>new Date().toISOString().slice(0,10));xe.useEffect(()=>{Tx().then(y)},[m]);const M=E=>e(E);return d.jsxs("div",{className:"set-wrap",children:[d.jsxs("div",{className:"set-tabs",role:"tablist",children:[d.jsx("button",{type:"button",role:"tab",className:t==="printers"?"on":"",onClick:()=>s("printers"),children:"プリンター"}),d.jsx("button",{type:"button",role:"tab",className:t==="history"?"on":"",onClick:()=>s("history"),children:"印刷履歴"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",style:{marginLeft:"auto"},onClick:r,children:"申請管理へ戻る"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>l(!0),children:"強制予約"})]}),t==="printers"?d.jsx(H1,{onToast:M,onReload:()=>p(E=>E+1)},m):d.jsx(j1,{reservations:g,onOpen:E=>f(E)}),d.jsx(X1,{open:o,date:_,onClose:()=>l(!1),onSaved:()=>{l(!1),p(E=>E+1),e("強制予約を作成しました")},onToast:M}),d.jsx(q1,{reservation:u,onClose:()=>f(null),onToast:M,onUpdated:()=>p(E=>E+1)})]})}function K1(){const r=Pg(),[e,t]=xe.useState(!0),[s,o]=xe.useState([]),[l,u]=xe.useState([]),[f,m]=xe.useState({}),[p,g]=xe.useState({}),[y,_]=xe.useState(!1),[M,E]=xe.useState(()=>r.screen||"reserve"),[w,S]=xe.useState(()=>r.selected||li),[x,b]=xe.useState(null),[R,D]=xe.useState(()=>d0()??U0()),[$,I]=xe.useState(()=>c0()),[L,j]=xe.useState(null),[C,T]=xe.useState(null),[V,G]=xe.useState(null),[z,X]=xe.useState(null),[Y,le]=xe.useState(null),[fe,k]=xe.useState(!1),[de,ne]=xe.useState(!1),O=xe.useCallback((B,ee)=>{Qx(B),dl(ee)},[]),ae=xe.useCallback(async B=>{const{from:ee,to:_e}=R0(B),[{applications:Ae},we]=await Promise.all([px(ee,_e),fx(ee,_e)]),Be=new Map;for(const Ie of Ae)Be.set(Ie.id,$p(Ie));for(const Ie of we.applications)Be.set(Ie.id,$p(Ie));u([...Be.values()])},[]),Ue=xe.useCallback(async()=>{var Be;const B=await mx(),ee=T0(B);o(ee);const _e=zn(w),Ae=await Ip(_e.getFullYear(),_e.getMonth()+1),we=kg(Ae.availability);m(we),g(we),O(ee,we);try{b(await Lp())}catch{}await ae(w);try{const Ie=await Ux();k(!!Ie.email.configured),ne(!!Ie.discord.configured),D(dt=>({...dt,discord:{...dt.discord,webhook:Ie.discord.configured?"(サーバー設定)":""},gcal:{...dt.gcal,calendarId:Ie.gcal.configured?"(サーバー設定)":""}}))}catch{}try{const Ie=await zx(80);(Be=Ie.log)!=null&&Be.length&&I(Ie.log.map(dt=>({id:dt.id,at:dt.at,actor:dt.actor,type:dt.type,text:dt.text,appId:dt.app_id})))}catch{}},[ae,w,O]);xe.useEffect(()=>{(async()=>{try{await Ue()}catch(B){pe.current(B instanceof Error?B.message:"読み込みに失敗しました","エラー")}finally{t(!1)}})()},[Ue]),xe.useEffect(()=>{if(e)return;const B=new URLSearchParams(window.location.search),ee=B.get("selected"),_e=B.get("app");if(ee&&/^\d{4}-\d{2}-\d{2}$/.test(ee)&&S(ee),_e){const Ae=l.find(we=>we.id===_e);Ae&&(S(Ae.date),j(Ae),T("view"))}},[e,l]),xe.useEffect(()=>{l0({screen:M,selected:w})},[M,w]),xe.useEffect(()=>{f0(R)},[R]),xe.useEffect(()=>{u0($)},[$]);const Q=x?D0(x):"—",pe=xe.useRef(()=>{}),he=xe.useCallback((B,ee)=>{le({text:B,mark:ee}),window.setTimeout(()=>le(null),2600)},[]);pe.current=he;const ge=xe.useCallback((B,ee,_e=null)=>{I(Ae=>[{id:"l"+Date.now()+Math.random().toString(36).slice(2,5),at:new Date().toISOString(),actor:Q,type:B,text:ee,appId:_e},...Ae]),kx({type:B,text:ee,app_id:_e}).catch(()=>{})},[Q]),ke=(B,ee)=>{j(B),T(ee??null)},je=()=>{j(null),T(null)},K=(B,ee)=>{u(_e=>_e.map(Ae=>Ae.id===B?{...Ae,...ee}:Ae)),j(_e=>_e&&_e.id===B?{..._e,...ee}:_e)},ht=async(B,ee,_e,Ae)=>{var Be;if(Ae!==void 0&&ee===null){try{await Td(B.id,{status_comment:Ae}),K(B.id,{adminNote:Ae}),ge("approve",`「${B.title}」に担当者メモを追加`,B.id),he("担当者メモを保存しました")}catch(Ie){he(Ie instanceof Error?Ie.message:"保存に失敗しました","エラー")}return}if(!ee)return;const we=L0(s,((Be=x==null?void 0:x.linked_member)==null?void 0:Be.id)??null);try{if(ee==="approved"&&B.status==="pending"){if(!we)throw new Error("予約を受領するには、担当者タブで ScienceHUB アカウントと印刷担当者を紐づけてください");await Mx(B.id,we)}else B.status==="cancelled"&&ee==="pending"?await hx(B.id):await Td(B.id,{status:b0(ee)});K(B.id,{status:ee,..._e||{},by:Q});const Ie=Qs[ee];ge(ee==="cancelled"?"cancel":"approve",`「${B.title}」を${Ie}（${hl(B.date)}・${yi[B.kind]}）`,B.id),he(`${B.title} を${Ie}にしました`,Ie),await ae(w)}catch(Ie){he(Ie instanceof Error?Ie.message:"更新に失敗しました","エラー")}},Ye=async(B,ee,_e,Ae)=>{const we=Hd(B);if(ee.length===we.length){await ht(B,_e,Ae);return}try{await Dx(B.id,{slot_indexes:ee,target_status:_e});const Ie=Qs[_e],dt=`${qt(Ja(ee[0]))}〜${qt(Ja(ee[ee.length-1])+Js)}`;ge(_e==="cancelled"?"cancel":"approve",`「${B.title}」の ${dt}（${ee.length}枠）を${Ie}`,B.id),he(`${dt} を${Ie}にしました`,`${ee.length}枠`),je(),await ae(w)}catch(Ie){he(Ie instanceof Error?Ie.message:"部分更新に失敗しました","エラー")}},gt=async(B,ee,_e,Ae)=>{if(Ae==="note"){await ht(B,null,void 0,_e);return}if(Ae==="approved"||Ae==="pending"||Ae==="done"){await ht(B,Ae);return}const we=ee?_e||ee.body:_e;await ht(B,"cancelled",ee?{rejectReason:ee.id,adminNote:we}:{adminNote:we})},Ke=async(B,ee,_e)=>{if(!ee||ee===B.date)return;const Ae=B.date;try{await Lx(B.id,ee,!!(_e!=null&&_e.forced)),ge("move",`「${B.title}」を ${hl(Ae)} → ${hl(ee)} に変更（${yi[B.kind]}${_e!=null&&_e.forced?"・強制":""}）`,B.id),he(`${B.title} を ${Og(ee)} に変更しました`,_e!=null&&_e.forced?"強制":yi[B.kind]),S(ee),G(null),je(),await ae(ee)}catch(we){he(we instanceof Error?we.message:"移動に失敗しました","エラー")}},ut=async B=>{try{await _x({name:B.name,homeroom:B.hr,student_number:B.num,discord_user_id:B.discord||null}),await Ue(),ge("member",`担当者「${B.name}」を追加`,null),he(`${B.name} を追加しました`)}catch(ee){he(ee instanceof Error?ee.message:"追加に失敗しました","エラー")}},rt=async(B,ee)=>{try{await Hx(B,A0(ee.color)),await Vx(B,ee.discord.trim()||null),await vx(B,ee.hubUserId),await Ue();try{b(await Lp())}catch{}const _e=Qr(B);ge("member",`担当者「${_e?_e.name:B}」を更新`,null),he(`${ee.name} を更新しました`)}catch(_e){he(_e instanceof Error?_e.message:"更新に失敗しました","エラー")}},at=async B=>{try{const ee=Qr(B);await xx(B),await Ue(),ge("member",`担当者「${ee?ee.name:B}」を削除（シフトも削除）`,null),he(`${ee?ee.name:"担当者"} を削除しました`)}catch(ee){he(ee instanceof Error?ee.message:"削除に失敗しました","エラー")}},At=(B,ee,_e)=>{m(Ae=>{const we=new Set(Ae[B]||[]);ee.forEach(Ie=>_e?we.add(Ie):we.delete(Ie));const Be={...Ae,[B]:[...we].sort()};return dl(Be),Be})},F=yx(pl(p),pl(f),[],[]),N=()=>{const B={};for(const[ee,_e]of Object.entries(p))B[ee]=[..._e];m(B),dl(B)},ue=async()=>{if(!(!F||y)){_(!0);try{await Sx(pl(p),pl(f),[],[]),g(()=>{const B={};for(const[ee,_e]of Object.entries(f))B[ee]=[..._e];return B}),ge("shift","シフト表を一括保存",null),he("シフトを保存しました","確定")}catch(B){he(B instanceof Error?B.message:"シフト保存に失敗しました","エラー"),await Ue()}finally{_(!1)}}},ve=xe.useCallback(async(B,ee)=>{try{const _e=await Ip(B,ee),Ae=we=>P0(we,_e.availability,B,ee);g(we=>Ae(we)),m(we=>{const Be=Ae(we);return dl(Be),Be})}catch(_e){pe.current(_e instanceof Error?_e.message:"シフト読込に失敗しました","エラー")}},[]),Ee=async()=>{he("Discordへテスト送信しています…");try{await Ix(),ge("integ","Discordへテスト通知を送信",null),he("Discordへ送信しました","成功")}catch(B){he(B instanceof Error?B.message:"送信に失敗しました","エラー")}},Te=async B=>{const ee=await Fx(B),_e=ee.sent.map(Ae=>Ae.name).join("・");return ge("integ",`Discordメンションテスト: ${_e}`,null),ee},qe=async()=>{try{const B=await Ex();B.ok?(ge("integ","Googleカレンダー接続テスト成功",null),he("Googleカレンダーに接続できました","接続OK")):he(B.error||"接続に失敗しました","エラー")}catch(B){he(B instanceof Error?B.message:"接続テストに失敗しました","エラー")}},Pe=async B=>{const ee=await Ox(B);return ge("integ",`テストメールを ${ee.to} に送信`,null),ee},Ne=()=>{const B=wg(zn(w)),ee=zl(B,27),_e=I0(l,Yn(B),Yn(ee),s.map(Ie=>({id:Ie.id,name:Ie.name}))),Ae=new Blob([_e],{type:"text/csv;charset=utf-8"}),we=URL.createObjectURL(Ae),Be=document.createElement("a");Be.href=we,Be.download=`3dprint_${Yn(B)}_${Yn(ee)}.csv`,document.body.appendChild(Be),Be.click(),Be.remove(),window.setTimeout(()=>URL.revokeObjectURL(we),1e3),he("CSVを書き出しました",`${Hp(B)}–${Hp(ee)}`)},nt=i0(l);return e?d.jsx("main",{className:"main-content",style:{padding:"2rem"},children:d.jsx("p",{children:"読み込み中…"})}):d.jsxs(d.Fragment,{children:[d.jsx(V0,{screen:M,setScreen:E,operatorSession:x,pendingCount:nt.length,onCsv:Ne}),d.jsxs("main",{className:"main-content","data-testid":"management-app",children:[d.jsx("div",{className:"page-head",children:d.jsxs("div",{style:{minWidth:0},children:[d.jsx("span",{className:"badge",children:"校内設備 / 自然科学部 3Dモデル班"}),d.jsx("h1",{className:"page-heading",children:M==="reserve"?"3Dプリント 申請の管理":M==="settings"?"シフト・担当者・外部連携":"運用（プリンター・履歴）"})]})}),M==="reserve"?d.jsx(R1,{apps:l,selected:w,onPick:S,onOpen:ke,onApprove:B=>void ht(B,"approved"),onCancel:(B,ee,_e,Ae)=>void gt(B,ee,_e,Ae),onPartial:(B,ee,_e,Ae)=>void Ye(B,ee,_e,Ae),log:$,onDownload:(B,ee)=>{ee==="file"?window.open(`/api/3dprint/admin/stl/${B.id}`,"_blank"):k0(B,ee),he(`${B.title} をダウンロードしました`,ee==="file"?B.file:"申請書")},onDownloadAll:B=>{const ee=z0(l,B);he(`${hl(B)} の申請 ${ee}件を書き出しました`,"一括DL")},onMove:B=>G(B)}):M==="settings"?d.jsx(O1,{members:s,avail:f,onAddMember:B=>void ut(B),onUpdateMember:(B,ee)=>void rt(B,ee),onRemoveMember:B=>void at(B),onPaintAvail:At,shiftDraftPending:F,shiftApplying:y,onConfirmShiftDraft:()=>void ue(),onDiscardShiftDraft:N,onLoadShiftMonth:ve,integrations:R,setIntegrations:D,onTestDiscord:()=>void Ee(),onTestDiscordMention:Te,onTestGcal:()=>void qe(),onTestEmail:Pe,emailConfigured:fe,discordConfigured:de,log:$,pendingPre:z}):d.jsx(Y1,{onBack:()=>E("reserve"),showToast:he})]}),d.jsx("footer",{className:"site-footer",children:d.jsxs("div",{className:"footer-inner",children:[d.jsx("img",{src:zg,alt:""}),d.jsxs("div",{className:"club",children:[d.jsx("b",{children:"松山南高校 自然科学部 / 3Dモデル班"}),d.jsx("span",{children:"承認・取り消しは担当者のみ。操作は記録されます。"})]}),d.jsxs("div",{className:"right",children:[d.jsx("a",{href:"/apps/3dprint-reservation/",children:"申請フォーム（生徒用）"}),d.jsx("a",{href:"mailto:diorama@mmh-virtual.jp",children:"diorama@mmh-virtual.jp"})]})]})}),d.jsx(b1,{app:L,log:$,onClose:je,onPartial:(B,ee,_e,Ae)=>void Ye(B,ee,_e,Ae),onCancelAll:(B,ee,_e,Ae)=>void gt(B,ee,_e,Ae),onMove:B=>G(B)}),d.jsx(P1,{open:!!V,app:V,apps:l,onClose:()=>G(null),onMove:Ke}),d.jsx(Y0,{toast:Y})]})}function Z1(){const[r,e]=xe.useState(!1),[t,s]=xe.useState(!1);return xe.useEffect(()=>{(async()=>{const o=await dx();if(o==="login"){const l=encodeURIComponent(window.location.pathname+window.location.search);window.location.href=`/login/?next=${l}`;return}if(o==="denied"){s(!0);return}e(!0)})()},[]),t?d.jsxs("main",{style:{padding:"2rem",fontFamily:"Inter, sans-serif"},children:[d.jsx("h1",{children:"アクセス拒否"}),d.jsx("p",{children:"3D印刷管理アプリを利用する権限がありません。"}),d.jsx("p",{children:d.jsx("a",{href:"/",children:"ダッシュボードに戻る"})})]}):r?d.jsx(K1,{}):d.jsx("main",{className:"main-content",style:{padding:"2rem"},children:d.jsx("p",{children:"読み込み中…"})})}document.body.classList.add("admin-app");cx.createRoot(document.getElementById("root")).render(d.jsx(xe.StrictMode,{children:d.jsx(Z1,{})}));
