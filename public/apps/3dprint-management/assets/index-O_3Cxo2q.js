var Q_=Object.defineProperty;var ex=(r,e,t)=>e in r?Q_(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Ha=(r,e,t)=>ex(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function tx(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var zu={exports:{}},Va={},Bu={exports:{}},ft={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wp;function nx(){if(wp)return ft;wp=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),u=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),x=Symbol.iterator;function _(O){return O===null||typeof O!="object"?null:(O=x&&O[x]||O["@@iterator"],typeof O=="function"?O:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,E={};function S(O,ce,ke){this.props=O,this.context=ce,this.refs=E,this.updater=ke||M}S.prototype.isReactComponent={},S.prototype.setState=function(O,ce){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,ce,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function y(){}y.prototype=S.prototype;function A(O,ce,ke){this.props=O,this.context=ce,this.refs=E,this.updater=ke||M}var b=A.prototype=new y;b.constructor=A,w(b,S.prototype),b.isPureReactComponent=!0;var D=Array.isArray,$=Object.prototype.hasOwnProperty,U={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};function q(O,ce,ke){var te,he={},we=null,_e=null;if(ce!=null)for(te in ce.ref!==void 0&&(_e=ce.ref),ce.key!==void 0&&(we=""+ce.key),ce)$.call(ce,te)&&!L.hasOwnProperty(te)&&(he[te]=ce[te]);var Ae=arguments.length-2;if(Ae===1)he.children=ke;else if(1<Ae){for(var Ie=Array(Ae),K=0;K<Ae;K++)Ie[K]=arguments[K+2];he.children=Ie}if(O&&O.defaultProps)for(te in Ae=O.defaultProps,Ae)he[te]===void 0&&(he[te]=Ae[te]);return{$$typeof:r,type:O,key:we,ref:_e,props:he,_owner:U.current}}function N(O,ce){return{$$typeof:r,type:O.type,key:ce,ref:O.ref,props:O.props,_owner:O._owner}}function C(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function j(O){var ce={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(ke){return ce[ke]})}var X=/\/+/g;function z(O,ce){return typeof O=="object"&&O!==null&&O.key!=null?j(""+O.key):ce.toString(36)}function ne(O,ce,ke,te,he){var we=typeof O;(we==="undefined"||we==="boolean")&&(O=null);var _e=!1;if(O===null)_e=!0;else switch(we){case"string":case"number":_e=!0;break;case"object":switch(O.$$typeof){case r:case e:_e=!0}}if(_e)return _e=O,he=he(_e),O=te===""?"."+z(_e,0):te,D(he)?(ke="",O!=null&&(ke=O.replace(X,"$&/")+"/"),ne(he,ce,ke,"",function(K){return K})):he!=null&&(C(he)&&(he=N(he,ke+(!he.key||_e&&_e.key===he.key?"":(""+he.key).replace(X,"$&/")+"/")+O)),ce.push(he)),1;if(_e=0,te=te===""?".":te+":",D(O))for(var Ae=0;Ae<O.length;Ae++){we=O[Ae];var Ie=te+z(we,Ae);_e+=ne(we,ce,ke,Ie,he)}else if(Ie=_(O),typeof Ie=="function")for(O=Ie.call(O),Ae=0;!(we=O.next()).done;)we=we.value,Ie=te+z(we,Ae++),_e+=ne(we,ce,ke,Ie,he);else if(we==="object")throw ce=String(O),Error("Objects are not valid as a React child (found: "+(ce==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":ce)+"). If you meant to render a collection of children, use an array instead.");return _e}function ue(O,ce,ke){if(O==null)return O;var te=[],he=0;return ne(O,te,"","",function(we){return ce.call(ke,we,he++)}),te}function G(O){if(O._status===-1){var ce=O._result;ce=ce(),ce.then(function(ke){(O._status===0||O._status===-1)&&(O._status=1,O._result=ke)},function(ke){(O._status===0||O._status===-1)&&(O._status=2,O._result=ke)}),O._status===-1&&(O._status=0,O._result=ce)}if(O._status===1)return O._result.default;throw O._result}var Y={current:null},F={transition:null},re={ReactCurrentDispatcher:Y,ReactCurrentBatchConfig:F,ReactCurrentOwner:U};function ee(){throw Error("act(...) is not supported in production builds of React.")}return ft.Children={map:ue,forEach:function(O,ce,ke){ue(O,function(){ce.apply(this,arguments)},ke)},count:function(O){var ce=0;return ue(O,function(){ce++}),ce},toArray:function(O){return ue(O,function(ce){return ce})||[]},only:function(O){if(!C(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},ft.Component=S,ft.Fragment=t,ft.Profiler=o,ft.PureComponent=A,ft.StrictMode=s,ft.Suspense=m,ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=re,ft.act=ee,ft.cloneElement=function(O,ce,ke){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var te=w({},O.props),he=O.key,we=O.ref,_e=O._owner;if(ce!=null){if(ce.ref!==void 0&&(we=ce.ref,_e=U.current),ce.key!==void 0&&(he=""+ce.key),O.type&&O.type.defaultProps)var Ae=O.type.defaultProps;for(Ie in ce)$.call(ce,Ie)&&!L.hasOwnProperty(Ie)&&(te[Ie]=ce[Ie]===void 0&&Ae!==void 0?Ae[Ie]:ce[Ie])}var Ie=arguments.length-2;if(Ie===1)te.children=ke;else if(1<Ie){Ae=Array(Ie);for(var K=0;K<Ie;K++)Ae[K]=arguments[K+2];te.children=Ae}return{$$typeof:r,type:O.type,key:he,ref:we,props:te,_owner:_e}},ft.createContext=function(O){return O={$$typeof:u,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},ft.createElement=q,ft.createFactory=function(O){var ce=q.bind(null,O);return ce.type=O,ce},ft.createRef=function(){return{current:null}},ft.forwardRef=function(O){return{$$typeof:f,render:O}},ft.isValidElement=C,ft.lazy=function(O){return{$$typeof:g,_payload:{_status:-1,_result:O},_init:G}},ft.memo=function(O,ce){return{$$typeof:p,type:O,compare:ce===void 0?null:ce}},ft.startTransition=function(O){var ce=F.transition;F.transition={};try{O()}finally{F.transition=ce}},ft.unstable_act=ee,ft.useCallback=function(O,ce){return Y.current.useCallback(O,ce)},ft.useContext=function(O){return Y.current.useContext(O)},ft.useDebugValue=function(){},ft.useDeferredValue=function(O){return Y.current.useDeferredValue(O)},ft.useEffect=function(O,ce){return Y.current.useEffect(O,ce)},ft.useId=function(){return Y.current.useId()},ft.useImperativeHandle=function(O,ce,ke){return Y.current.useImperativeHandle(O,ce,ke)},ft.useInsertionEffect=function(O,ce){return Y.current.useInsertionEffect(O,ce)},ft.useLayoutEffect=function(O,ce){return Y.current.useLayoutEffect(O,ce)},ft.useMemo=function(O,ce){return Y.current.useMemo(O,ce)},ft.useReducer=function(O,ce,ke){return Y.current.useReducer(O,ce,ke)},ft.useRef=function(O){return Y.current.useRef(O)},ft.useState=function(O){return Y.current.useState(O)},ft.useSyncExternalStore=function(O,ce,ke){return Y.current.useSyncExternalStore(O,ce,ke)},ft.useTransition=function(){return Y.current.useTransition()},ft.version="18.3.1",ft}var Tp;function kd(){return Tp||(Tp=1,Bu.exports=nx()),Bu.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ap;function ix(){if(Ap)return Va;Ap=1;var r=kd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function u(f,m,p){var g,x={},_=null,M=null;p!==void 0&&(_=""+p),m.key!==void 0&&(_=""+m.key),m.ref!==void 0&&(M=m.ref);for(g in m)s.call(m,g)&&!l.hasOwnProperty(g)&&(x[g]=m[g]);if(f&&f.defaultProps)for(g in m=f.defaultProps,m)x[g]===void 0&&(x[g]=m[g]);return{$$typeof:e,type:f,key:_,ref:M,props:x,_owner:o.current}}return Va.Fragment=t,Va.jsx=u,Va.jsxs=u,Va}var Cp;function rx(){return Cp||(Cp=1,zu.exports=ix()),zu.exports}var d=rx(),sx=kd();const Se=tx(sx);var cl={},ju={exports:{}},Cn={},Hu={exports:{}},Vu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bp;function ax(){return bp||(bp=1,(function(r){function e(F,re){var ee=F.length;F.push(re);e:for(;0<ee;){var O=ee-1>>>1,ce=F[O];if(0<o(ce,re))F[O]=re,F[ee]=ce,ee=O;else break e}}function t(F){return F.length===0?null:F[0]}function s(F){if(F.length===0)return null;var re=F[0],ee=F.pop();if(ee!==re){F[0]=ee;e:for(var O=0,ce=F.length,ke=ce>>>1;O<ke;){var te=2*(O+1)-1,he=F[te],we=te+1,_e=F[we];if(0>o(he,ee))we<ce&&0>o(_e,he)?(F[O]=_e,F[we]=ee,O=we):(F[O]=he,F[te]=ee,O=te);else if(we<ce&&0>o(_e,ee))F[O]=_e,F[we]=ee,O=we;else break e}}return re}function o(F,re){var ee=F.sortIndex-re.sortIndex;return ee!==0?ee:F.id-re.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var u=Date,f=u.now();r.unstable_now=function(){return u.now()-f}}var m=[],p=[],g=1,x=null,_=3,M=!1,w=!1,E=!1,S=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,A=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function b(F){for(var re=t(p);re!==null;){if(re.callback===null)s(p);else if(re.startTime<=F)s(p),re.sortIndex=re.expirationTime,e(m,re);else break;re=t(p)}}function D(F){if(E=!1,b(F),!w)if(t(m)!==null)w=!0,G($);else{var re=t(p);re!==null&&Y(D,re.startTime-F)}}function $(F,re){w=!1,E&&(E=!1,y(q),q=-1),M=!0;var ee=_;try{for(b(re),x=t(m);x!==null&&(!(x.expirationTime>re)||F&&!j());){var O=x.callback;if(typeof O=="function"){x.callback=null,_=x.priorityLevel;var ce=O(x.expirationTime<=re);re=r.unstable_now(),typeof ce=="function"?x.callback=ce:x===t(m)&&s(m),b(re)}else s(m);x=t(m)}if(x!==null)var ke=!0;else{var te=t(p);te!==null&&Y(D,te.startTime-re),ke=!1}return ke}finally{x=null,_=ee,M=!1}}var U=!1,L=null,q=-1,N=5,C=-1;function j(){return!(r.unstable_now()-C<N)}function X(){if(L!==null){var F=r.unstable_now();C=F;var re=!0;try{re=L(!0,F)}finally{re?z():(U=!1,L=null)}}else U=!1}var z;if(typeof A=="function")z=function(){A(X)};else if(typeof MessageChannel<"u"){var ne=new MessageChannel,ue=ne.port2;ne.port1.onmessage=X,z=function(){ue.postMessage(null)}}else z=function(){S(X,0)};function G(F){L=F,U||(U=!0,z())}function Y(F,re){q=S(function(){F(r.unstable_now())},re)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(F){F.callback=null},r.unstable_continueExecution=function(){w||M||(w=!0,G($))},r.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):N=0<F?Math.floor(1e3/F):5},r.unstable_getCurrentPriorityLevel=function(){return _},r.unstable_getFirstCallbackNode=function(){return t(m)},r.unstable_next=function(F){switch(_){case 1:case 2:case 3:var re=3;break;default:re=_}var ee=_;_=re;try{return F()}finally{_=ee}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(F,re){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var ee=_;_=F;try{return re()}finally{_=ee}},r.unstable_scheduleCallback=function(F,re,ee){var O=r.unstable_now();switch(typeof ee=="object"&&ee!==null?(ee=ee.delay,ee=typeof ee=="number"&&0<ee?O+ee:O):ee=O,F){case 1:var ce=-1;break;case 2:ce=250;break;case 5:ce=1073741823;break;case 4:ce=1e4;break;default:ce=5e3}return ce=ee+ce,F={id:g++,callback:re,priorityLevel:F,startTime:ee,expirationTime:ce,sortIndex:-1},ee>O?(F.sortIndex=ee,e(p,F),t(m)===null&&F===t(p)&&(E?(y(q),q=-1):E=!0,Y(D,ee-O))):(F.sortIndex=ce,e(m,F),w||M||(w=!0,G($))),F},r.unstable_shouldYield=j,r.unstable_wrapCallback=function(F){var re=_;return function(){var ee=_;_=re;try{return F.apply(this,arguments)}finally{_=ee}}}})(Vu)),Vu}var Rp;function ox(){return Rp||(Rp=1,Hu.exports=ax()),Hu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Np;function lx(){if(Np)return Cn;Np=1;var r=kd(),e=ox();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){u(n,i),u(n+"Capture",i)}function u(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),m=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},x={};function _(n){return m.call(x,n)?!0:m.call(g,n)?!1:p.test(n)?x[n]=!0:(g[n]=!0,!1)}function M(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function w(n,i,a,c){if(i===null||typeof i>"u"||M(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function E(n,i,a,c,h,v,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=v,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new E(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new E(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new E(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new E(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new E(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new E(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new E(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new E(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new E(n,5,!1,n.toLowerCase(),null,!1,!1)});var y=/[\-:]([a-z])/g;function A(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(y,A);S[i]=new E(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(y,A);S[i]=new E(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(y,A);S[i]=new E(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new E(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new E("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new E(n,1,!1,n.toLowerCase(),null,!0,!0)});function b(n,i,a,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(w(i,a,h,c)&&(a=null),c||h===null?_(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):h.mustUseProperty?n[h.propertyName]=a===null?h.type===3?!1:"":a:(i=h.attributeName,c=h.attributeNamespace,a===null?n.removeAttribute(i):(h=h.type,a=h===3||h===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var D=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,$=Symbol.for("react.element"),U=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),N=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),j=Symbol.for("react.context"),X=Symbol.for("react.forward_ref"),z=Symbol.for("react.suspense"),ne=Symbol.for("react.suspense_list"),ue=Symbol.for("react.memo"),G=Symbol.for("react.lazy"),Y=Symbol.for("react.offscreen"),F=Symbol.iterator;function re(n){return n===null||typeof n!="object"?null:(n=F&&n[F]||n["@@iterator"],typeof n=="function"?n:null)}var ee=Object.assign,O;function ce(n){if(O===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var ke=!1;function te(n,i){if(!n||ke)return"";ke=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(oe){var c=oe}Reflect.construct(n,[],i)}else{try{i.call()}catch(oe){c=oe}n.call(i.prototype)}else{try{throw Error()}catch(oe){c=oe}n()}}catch(oe){if(oe&&c&&typeof oe.stack=="string"){for(var h=oe.stack.split(`
`),v=c.stack.split(`
`),T=h.length-1,I=v.length-1;1<=T&&0<=I&&h[T]!==v[I];)I--;for(;1<=T&&0<=I;T--,I--)if(h[T]!==v[I]){if(T!==1||I!==1)do if(T--,I--,0>I||h[T]!==v[I]){var H=`
`+h[T].replace(" at new "," at ");return n.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",n.displayName)),H}while(1<=T&&0<=I);break}}}finally{ke=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?ce(n):""}function he(n){switch(n.tag){case 5:return ce(n.type);case 16:return ce("Lazy");case 13:return ce("Suspense");case 19:return ce("SuspenseList");case 0:case 2:case 15:return n=te(n.type,!1),n;case 11:return n=te(n.type.render,!1),n;case 1:return n=te(n.type,!0),n;default:return""}}function we(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case L:return"Fragment";case U:return"Portal";case N:return"Profiler";case q:return"StrictMode";case z:return"Suspense";case ne:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case j:return(n.displayName||"Context")+".Consumer";case C:return(n._context.displayName||"Context")+".Provider";case X:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case ue:return i=n.displayName||null,i!==null?i:we(n.type)||"Memo";case G:i=n._payload,n=n._init;try{return we(n(i))}catch{}}return null}function _e(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return we(i);case 8:return i===q?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Ae(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ie(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function K(n){var i=Ie(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,v=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(T){c=""+T,v.call(this,T)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function mt(n){n._valueTracker||(n._valueTracker=K(n))}function Ye(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=Ie(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function ht(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Ke(n,i){var a=i.checked;return ee({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function ot(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Ae(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function st(n,i){i=i.checked,i!=null&&b(n,"checked",i,!1)}function lt(n,i){st(n,i);var a=Ae(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?k(n,i.type,a):i.hasOwnProperty("defaultValue")&&k(n,i.type,Ae(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function At(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function k(n,i,a){(i!=="number"||ht(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var R=Array.isArray;function de(n,i,a,c){if(n=n.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<n.length;a++)h=i.hasOwnProperty("$"+n[a].value),n[a].selected!==h&&(n[a].selected=h),h&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Ae(a),i=null,h=0;h<n.length;h++){if(n[h].value===a){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function ge(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return ee({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Me(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(R(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:Ae(a)}}function Ee(n,i){var a=Ae(i.value),c=Ae(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function qe(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function Le(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Pe(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?Le(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var it,Re=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(it=it||document.createElement("div"),it.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=it.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function We(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var at={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},W=["Webkit","ms","Moz","O"];Object.keys(at).forEach(function(n){W.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),at[i]=at[n]})});function Z(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||at.hasOwnProperty(n)&&at[n]?(""+i).trim():i+"px"}function ve(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,h=Z(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,h):n[a]=h}}var be=ee({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Qe(n,i){if(i){if(be[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function je(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var B=null;function pe(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var me=null,Ne=null,Fe=null;function pt(n){if(n=Ca(n)){if(typeof me!="function")throw Error(t(280));var i=n.stateNode;i&&(i=wo(i),me(n.stateNode,n.type,i))}}function wt(n){Ne?Fe?Fe.push(n):Fe=[n]:Ne=n}function Rt(){if(Ne){var n=Ne,i=Fe;if(Fe=Ne=null,pt(n),i)for(n=0;n<i.length;n++)pt(i[n])}}function Vt(n,i){return n(i)}function yt(){}var Sn=!1;function Zt(n,i,a){if(Sn)return n(i,a);Sn=!0;try{return Vt(n,i,a)}finally{Sn=!1,(Ne!==null||Fe!==null)&&(yt(),Rt())}}function Vi(n,i){var a=n.stateNode;if(a===null)return null;var c=wo(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var is=!1;if(f)try{var Gi={};Object.defineProperty(Gi,"passive",{get:function(){is=!0}}),window.addEventListener("test",Gi,Gi),window.removeEventListener("test",Gi,Gi)}catch{is=!1}function rs(n,i,a,c,h,v,T,I,H){var oe=Array.prototype.slice.call(arguments,3);try{i.apply(a,oe)}catch(ye){this.onError(ye)}}var Wi=!1,Mi=null,Ar=!1,ss=null,ic={onError:function(n){Wi=!0,Mi=n}};function rc(n,i,a,c,h,v,T,I,H){Wi=!1,Mi=null,rs.apply(ic,arguments)}function sc(n,i,a,c,h,v,T,I,H){if(rc.apply(this,arguments),Wi){if(Wi){var oe=Mi;Wi=!1,Mi=null}else throw Error(t(198));Ar||(Ar=!0,ss=oe)}}function P(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function J(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function fe(n){if(P(n)!==n)throw Error(t(188))}function ae(n){var i=n.alternate;if(!i){if(i=P(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var h=a.return;if(h===null)break;var v=h.alternate;if(v===null){if(c=h.return,c!==null){a=c;continue}break}if(h.child===v.child){for(v=h.child;v;){if(v===a)return fe(h),n;if(v===c)return fe(h),i;v=v.sibling}throw Error(t(188))}if(a.return!==c.return)a=h,c=v;else{for(var T=!1,I=h.child;I;){if(I===a){T=!0,a=h,c=v;break}if(I===c){T=!0,c=h,a=v;break}I=I.sibling}if(!T){for(I=v.child;I;){if(I===a){T=!0,a=v,c=h;break}if(I===c){T=!0,c=v,a=h;break}I=I.sibling}if(!T)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function se(n){return n=ae(n),n!==null?De(n):null}function De(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=De(n);if(i!==null)return i;n=n.sibling}return null}var Ge=e.unstable_scheduleCallback,Xe=e.unstable_cancelCallback,et=e.unstable_shouldYield,rt=e.unstable_requestPaint,He=e.unstable_now,ct=e.unstable_getCurrentPriorityLevel,Dt=e.unstable_ImmediatePriority,Gt=e.unstable_UserBlockingPriority,Jt=e.unstable_NormalPriority,Zn=e.unstable_LowPriority,gt=e.unstable_IdlePriority,tt=null,ln=null;function Ct(n){if(ln&&typeof ln.onCommitFiberRoot=="function")try{ln.onCommitFiberRoot(tt,n,void 0,(n.current.flags&128)===128)}catch{}}var Wt=Math.clz32?Math.clz32:la,oo=Math.log,Cr=Math.LN2;function la(n){return n>>>=0,n===0?32:31-(oo(n)/Cr|0)|0}var kt=64,Ln=4194304;function Ei(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function sn(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,h=n.suspendedLanes,v=n.pingedLanes,T=a&268435455;if(T!==0){var I=T&~h;I!==0?c=Ei(I):(v&=T,v!==0&&(c=Ei(v)))}else T=a&~h,T!==0?c=Ei(T):v!==0&&(c=Ei(v));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,v=i&-i,h>=v||h===16&&(v&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Wt(i),h=1<<a,c|=n[a],i&=~h;return c}function ca(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ac(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,v=n.pendingLanes;0<v;){var T=31-Wt(v),I=1<<T,H=h[T];H===-1?((I&a)===0||(I&c)!==0)&&(h[T]=ca(I,i)):H<=i&&(n.expiredLanes|=I),v&=~I}}function as(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function ef(){var n=kt;return kt<<=1,(kt&4194240)===0&&(kt=64),n}function oc(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function ua(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Wt(i),n[i]=a}function yv(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var h=31-Wt(a),v=1<<h;i[h]=0,c[h]=-1,n[h]=-1,a&=~v}}function lc(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Wt(a),h=1<<c;h&i|n[c]&i&&(n[c]|=i),a&=~h}}var Et=0;function tf(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var nf,cc,rf,sf,af,uc=!1,lo=[],$i=null,Xi=null,qi=null,da=new Map,fa=new Map,Yi=[],Sv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function of(n,i){switch(n){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":qi=null;break;case"pointerover":case"pointerout":da.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":fa.delete(i.pointerId)}}function ha(n,i,a,c,h,v){return n===null||n.nativeEvent!==v?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:v,targetContainers:[h]},i!==null&&(i=Ca(i),i!==null&&cc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function Mv(n,i,a,c,h){switch(i){case"focusin":return $i=ha($i,n,i,a,c,h),!0;case"dragenter":return Xi=ha(Xi,n,i,a,c,h),!0;case"mouseover":return qi=ha(qi,n,i,a,c,h),!0;case"pointerover":var v=h.pointerId;return da.set(v,ha(da.get(v)||null,n,i,a,c,h)),!0;case"gotpointercapture":return v=h.pointerId,fa.set(v,ha(fa.get(v)||null,n,i,a,c,h)),!0}return!1}function lf(n){var i=br(n.target);if(i!==null){var a=P(i);if(a!==null){if(i=a.tag,i===13){if(i=J(a),i!==null){n.blockedOn=i,af(n.priority,function(){rf(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function co(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=fc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);B=c,a.target.dispatchEvent(c),B=null}else return i=Ca(a),i!==null&&cc(i),n.blockedOn=a,!1;i.shift()}return!0}function cf(n,i,a){co(n)&&a.delete(i)}function Ev(){uc=!1,$i!==null&&co($i)&&($i=null),Xi!==null&&co(Xi)&&(Xi=null),qi!==null&&co(qi)&&(qi=null),da.forEach(cf),fa.forEach(cf)}function pa(n,i){n.blockedOn===i&&(n.blockedOn=null,uc||(uc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Ev)))}function ma(n){function i(h){return pa(h,n)}if(0<lo.length){pa(lo[0],n);for(var a=1;a<lo.length;a++){var c=lo[a];c.blockedOn===n&&(c.blockedOn=null)}}for($i!==null&&pa($i,n),Xi!==null&&pa(Xi,n),qi!==null&&pa(qi,n),da.forEach(i),fa.forEach(i),a=0;a<Yi.length;a++)c=Yi[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Yi.length&&(a=Yi[0],a.blockedOn===null);)lf(a),a.blockedOn===null&&Yi.shift()}var os=D.ReactCurrentBatchConfig,uo=!0;function wv(n,i,a,c){var h=Et,v=os.transition;os.transition=null;try{Et=1,dc(n,i,a,c)}finally{Et=h,os.transition=v}}function Tv(n,i,a,c){var h=Et,v=os.transition;os.transition=null;try{Et=4,dc(n,i,a,c)}finally{Et=h,os.transition=v}}function dc(n,i,a,c){if(uo){var h=fc(n,i,a,c);if(h===null)Rc(n,i,c,fo,a),of(n,c);else if(Mv(h,n,i,a,c))c.stopPropagation();else if(of(n,c),i&4&&-1<Sv.indexOf(n)){for(;h!==null;){var v=Ca(h);if(v!==null&&nf(v),v=fc(n,i,a,c),v===null&&Rc(n,i,c,fo,a),v===h)break;h=v}h!==null&&c.stopPropagation()}else Rc(n,i,c,null,a)}}var fo=null;function fc(n,i,a,c){if(fo=null,n=pe(c),n=br(n),n!==null)if(i=P(n),i===null)n=null;else if(a=i.tag,a===13){if(n=J(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return fo=n,null}function uf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ct()){case Dt:return 1;case Gt:return 4;case Jt:case Zn:return 16;case gt:return 536870912;default:return 16}default:return 16}}var Ki=null,hc=null,ho=null;function df(){if(ho)return ho;var n,i=hc,a=i.length,c,h="value"in Ki?Ki.value:Ki.textContent,v=h.length;for(n=0;n<a&&i[n]===h[n];n++);var T=a-n;for(c=1;c<=T&&i[a-c]===h[v-c];c++);return ho=h.slice(n,1<c?1-c:void 0)}function po(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function mo(){return!0}function ff(){return!1}function Dn(n){function i(a,c,h,v,T){this._reactName=a,this._targetInst=h,this.type=c,this.nativeEvent=v,this.target=T,this.currentTarget=null;for(var I in n)n.hasOwnProperty(I)&&(a=n[I],this[I]=a?a(v):v[I]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?mo:ff,this.isPropagationStopped=ff,this}return ee(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=mo)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=mo)},persist:function(){},isPersistent:mo}),i}var ls={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},pc=Dn(ls),ga=ee({},ls,{view:0,detail:0}),Av=Dn(ga),mc,gc,va,go=ee({},ga,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_c,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==va&&(va&&n.type==="mousemove"?(mc=n.screenX-va.screenX,gc=n.screenY-va.screenY):gc=mc=0,va=n),mc)},movementY:function(n){return"movementY"in n?n.movementY:gc}}),hf=Dn(go),Cv=ee({},go,{dataTransfer:0}),bv=Dn(Cv),Rv=ee({},ga,{relatedTarget:0}),vc=Dn(Rv),Nv=ee({},ls,{animationName:0,elapsedTime:0,pseudoElement:0}),Pv=Dn(Nv),Lv=ee({},ls,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Dv=Dn(Lv),Uv=ee({},ls,{data:0}),pf=Dn(Uv),Iv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Fv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ov={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function kv(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Ov[n])?!!i[n]:!1}function _c(){return kv}var zv=ee({},ga,{key:function(n){if(n.key){var i=Iv[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=po(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Fv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_c,charCode:function(n){return n.type==="keypress"?po(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?po(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Bv=Dn(zv),jv=ee({},go,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),mf=Dn(jv),Hv=ee({},ga,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_c}),Vv=Dn(Hv),Gv=ee({},ls,{propertyName:0,elapsedTime:0,pseudoElement:0}),Wv=Dn(Gv),$v=ee({},go,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Xv=Dn($v),qv=[9,13,27,32],xc=f&&"CompositionEvent"in window,_a=null;f&&"documentMode"in document&&(_a=document.documentMode);var Yv=f&&"TextEvent"in window&&!_a,gf=f&&(!xc||_a&&8<_a&&11>=_a),vf=" ",_f=!1;function xf(n,i){switch(n){case"keyup":return qv.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function yf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var cs=!1;function Kv(n,i){switch(n){case"compositionend":return yf(i);case"keypress":return i.which!==32?null:(_f=!0,vf);case"textInput":return n=i.data,n===vf&&_f?null:n;default:return null}}function Zv(n,i){if(cs)return n==="compositionend"||!xc&&xf(n,i)?(n=df(),ho=hc=Ki=null,cs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return gf&&i.locale!=="ko"?null:i.data;default:return null}}var Jv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Sf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!Jv[n.type]:i==="textarea"}function Mf(n,i,a,c){wt(c),i=So(i,"onChange"),0<i.length&&(a=new pc("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var xa=null,ya=null;function Qv(n){Bf(n,0)}function vo(n){var i=ps(n);if(Ye(i))return n}function e_(n,i){if(n==="change")return i}var Ef=!1;if(f){var yc;if(f){var Sc="oninput"in document;if(!Sc){var wf=document.createElement("div");wf.setAttribute("oninput","return;"),Sc=typeof wf.oninput=="function"}yc=Sc}else yc=!1;Ef=yc&&(!document.documentMode||9<document.documentMode)}function Tf(){xa&&(xa.detachEvent("onpropertychange",Af),ya=xa=null)}function Af(n){if(n.propertyName==="value"&&vo(ya)){var i=[];Mf(i,ya,n,pe(n)),Zt(Qv,i)}}function t_(n,i,a){n==="focusin"?(Tf(),xa=i,ya=a,xa.attachEvent("onpropertychange",Af)):n==="focusout"&&Tf()}function n_(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return vo(ya)}function i_(n,i){if(n==="click")return vo(i)}function r_(n,i){if(n==="input"||n==="change")return vo(i)}function s_(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Jn=typeof Object.is=="function"?Object.is:s_;function Sa(n,i){if(Jn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var h=a[c];if(!m.call(i,h)||!Jn(n[h],i[h]))return!1}return!0}function Cf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function bf(n,i){var a=Cf(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Cf(a)}}function Rf(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Rf(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function Nf(){for(var n=window,i=ht();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=ht(n.document)}return i}function Mc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function a_(n){var i=Nf(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Rf(a.ownerDocument.documentElement,a)){if(c!==null&&Mc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=a.textContent.length,v=Math.min(c.start,h);c=c.end===void 0?v:Math.min(c.end,h),!n.extend&&v>c&&(h=c,c=v,v=h),h=bf(a,v);var T=bf(a,c);h&&T&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),v>c?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var o_=f&&"documentMode"in document&&11>=document.documentMode,us=null,Ec=null,Ma=null,wc=!1;function Pf(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;wc||us==null||us!==ht(c)||(c=us,"selectionStart"in c&&Mc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ma&&Sa(Ma,c)||(Ma=c,c=So(Ec,"onSelect"),0<c.length&&(i=new pc("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=us)))}function _o(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var ds={animationend:_o("Animation","AnimationEnd"),animationiteration:_o("Animation","AnimationIteration"),animationstart:_o("Animation","AnimationStart"),transitionend:_o("Transition","TransitionEnd")},Tc={},Lf={};f&&(Lf=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function xo(n){if(Tc[n])return Tc[n];if(!ds[n])return n;var i=ds[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in Lf)return Tc[n]=i[a];return n}var Df=xo("animationend"),Uf=xo("animationiteration"),If=xo("animationstart"),Ff=xo("transitionend"),Of=new Map,kf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zi(n,i){Of.set(n,i),l(i,[n])}for(var Ac=0;Ac<kf.length;Ac++){var Cc=kf[Ac],l_=Cc.toLowerCase(),c_=Cc[0].toUpperCase()+Cc.slice(1);Zi(l_,"on"+c_)}Zi(Df,"onAnimationEnd"),Zi(Uf,"onAnimationIteration"),Zi(If,"onAnimationStart"),Zi("dblclick","onDoubleClick"),Zi("focusin","onFocus"),Zi("focusout","onBlur"),Zi(Ff,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),u_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ea));function zf(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,sc(c,i,void 0,n),n.currentTarget=null}function Bf(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],h=c.event;c=c.listeners;e:{var v=void 0;if(i)for(var T=c.length-1;0<=T;T--){var I=c[T],H=I.instance,oe=I.currentTarget;if(I=I.listener,H!==v&&h.isPropagationStopped())break e;zf(h,I,oe),v=H}else for(T=0;T<c.length;T++){if(I=c[T],H=I.instance,oe=I.currentTarget,I=I.listener,H!==v&&h.isPropagationStopped())break e;zf(h,I,oe),v=H}}}if(Ar)throw n=ss,Ar=!1,ss=null,n}function Nt(n,i){var a=i[Ic];a===void 0&&(a=i[Ic]=new Set);var c=n+"__bubble";a.has(c)||(jf(i,n,2,!1),a.add(c))}function bc(n,i,a){var c=0;i&&(c|=4),jf(a,n,c,i)}var yo="_reactListening"+Math.random().toString(36).slice(2);function wa(n){if(!n[yo]){n[yo]=!0,s.forEach(function(a){a!=="selectionchange"&&(u_.has(a)||bc(a,!1,n),bc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[yo]||(i[yo]=!0,bc("selectionchange",!1,i))}}function jf(n,i,a,c){switch(uf(i)){case 1:var h=wv;break;case 4:h=Tv;break;default:h=dc}a=h.bind(null,i,a,n),h=void 0,!is||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,a,{capture:!0,passive:h}):n.addEventListener(i,a,!0):h!==void 0?n.addEventListener(i,a,{passive:h}):n.addEventListener(i,a,!1)}function Rc(n,i,a,c,h){var v=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var I=c.stateNode.containerInfo;if(I===h||I.nodeType===8&&I.parentNode===h)break;if(T===4)for(T=c.return;T!==null;){var H=T.tag;if((H===3||H===4)&&(H=T.stateNode.containerInfo,H===h||H.nodeType===8&&H.parentNode===h))return;T=T.return}for(;I!==null;){if(T=br(I),T===null)return;if(H=T.tag,H===5||H===6){c=v=T;continue e}I=I.parentNode}}c=c.return}Zt(function(){var oe=v,ye=pe(a),Te=[];e:{var xe=Of.get(n);if(xe!==void 0){var Oe=pc,Be=n;switch(n){case"keypress":if(po(a)===0)break e;case"keydown":case"keyup":Oe=Bv;break;case"focusin":Be="focus",Oe=vc;break;case"focusout":Be="blur",Oe=vc;break;case"beforeblur":case"afterblur":Oe=vc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Oe=hf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Oe=bv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Oe=Vv;break;case Df:case Uf:case If:Oe=Pv;break;case Ff:Oe=Wv;break;case"scroll":Oe=Av;break;case"wheel":Oe=Xv;break;case"copy":case"cut":case"paste":Oe=Dv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Oe=mf}var Ve=(i&4)!==0,zt=!Ve&&n==="scroll",Q=Ve?xe!==null?xe+"Capture":null:xe;Ve=[];for(var V=oe,ie;V!==null;){ie=V;var Ce=ie.stateNode;if(ie.tag===5&&Ce!==null&&(ie=Ce,Q!==null&&(Ce=Vi(V,Q),Ce!=null&&Ve.push(Ta(V,Ce,ie)))),zt)break;V=V.return}0<Ve.length&&(xe=new Oe(xe,Be,null,a,ye),Te.push({event:xe,listeners:Ve}))}}if((i&7)===0){e:{if(xe=n==="mouseover"||n==="pointerover",Oe=n==="mouseout"||n==="pointerout",xe&&a!==B&&(Be=a.relatedTarget||a.fromElement)&&(br(Be)||Be[wi]))break e;if((Oe||xe)&&(xe=ye.window===ye?ye:(xe=ye.ownerDocument)?xe.defaultView||xe.parentWindow:window,Oe?(Be=a.relatedTarget||a.toElement,Oe=oe,Be=Be?br(Be):null,Be!==null&&(zt=P(Be),Be!==zt||Be.tag!==5&&Be.tag!==6)&&(Be=null)):(Oe=null,Be=oe),Oe!==Be)){if(Ve=hf,Ce="onMouseLeave",Q="onMouseEnter",V="mouse",(n==="pointerout"||n==="pointerover")&&(Ve=mf,Ce="onPointerLeave",Q="onPointerEnter",V="pointer"),zt=Oe==null?xe:ps(Oe),ie=Be==null?xe:ps(Be),xe=new Ve(Ce,V+"leave",Oe,a,ye),xe.target=zt,xe.relatedTarget=ie,Ce=null,br(ye)===oe&&(Ve=new Ve(Q,V+"enter",Be,a,ye),Ve.target=ie,Ve.relatedTarget=zt,Ce=Ve),zt=Ce,Oe&&Be)t:{for(Ve=Oe,Q=Be,V=0,ie=Ve;ie;ie=fs(ie))V++;for(ie=0,Ce=Q;Ce;Ce=fs(Ce))ie++;for(;0<V-ie;)Ve=fs(Ve),V--;for(;0<ie-V;)Q=fs(Q),ie--;for(;V--;){if(Ve===Q||Q!==null&&Ve===Q.alternate)break t;Ve=fs(Ve),Q=fs(Q)}Ve=null}else Ve=null;Oe!==null&&Hf(Te,xe,Oe,Ve,!1),Be!==null&&zt!==null&&Hf(Te,zt,Be,Ve,!0)}}e:{if(xe=oe?ps(oe):window,Oe=xe.nodeName&&xe.nodeName.toLowerCase(),Oe==="select"||Oe==="input"&&xe.type==="file")var $e=e_;else if(Sf(xe))if(Ef)$e=r_;else{$e=n_;var Ze=t_}else(Oe=xe.nodeName)&&Oe.toLowerCase()==="input"&&(xe.type==="checkbox"||xe.type==="radio")&&($e=i_);if($e&&($e=$e(n,oe))){Mf(Te,$e,a,ye);break e}Ze&&Ze(n,xe,oe),n==="focusout"&&(Ze=xe._wrapperState)&&Ze.controlled&&xe.type==="number"&&k(xe,"number",xe.value)}switch(Ze=oe?ps(oe):window,n){case"focusin":(Sf(Ze)||Ze.contentEditable==="true")&&(us=Ze,Ec=oe,Ma=null);break;case"focusout":Ma=Ec=us=null;break;case"mousedown":wc=!0;break;case"contextmenu":case"mouseup":case"dragend":wc=!1,Pf(Te,a,ye);break;case"selectionchange":if(o_)break;case"keydown":case"keyup":Pf(Te,a,ye)}var Je;if(xc)e:{switch(n){case"compositionstart":var nt="onCompositionStart";break e;case"compositionend":nt="onCompositionEnd";break e;case"compositionupdate":nt="onCompositionUpdate";break e}nt=void 0}else cs?xf(n,a)&&(nt="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(nt="onCompositionStart");nt&&(gf&&a.locale!=="ko"&&(cs||nt!=="onCompositionStart"?nt==="onCompositionEnd"&&cs&&(Je=df()):(Ki=ye,hc="value"in Ki?Ki.value:Ki.textContent,cs=!0)),Ze=So(oe,nt),0<Ze.length&&(nt=new pf(nt,n,null,a,ye),Te.push({event:nt,listeners:Ze}),Je?nt.data=Je:(Je=yf(a),Je!==null&&(nt.data=Je)))),(Je=Yv?Kv(n,a):Zv(n,a))&&(oe=So(oe,"onBeforeInput"),0<oe.length&&(ye=new pf("onBeforeInput","beforeinput",null,a,ye),Te.push({event:ye,listeners:oe}),ye.data=Je))}Bf(Te,i)})}function Ta(n,i,a){return{instance:n,listener:i,currentTarget:a}}function So(n,i){for(var a=i+"Capture",c=[];n!==null;){var h=n,v=h.stateNode;h.tag===5&&v!==null&&(h=v,v=Vi(n,a),v!=null&&c.unshift(Ta(n,v,h)),v=Vi(n,i),v!=null&&c.push(Ta(n,v,h))),n=n.return}return c}function fs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Hf(n,i,a,c,h){for(var v=i._reactName,T=[];a!==null&&a!==c;){var I=a,H=I.alternate,oe=I.stateNode;if(H!==null&&H===c)break;I.tag===5&&oe!==null&&(I=oe,h?(H=Vi(a,v),H!=null&&T.unshift(Ta(a,H,I))):h||(H=Vi(a,v),H!=null&&T.push(Ta(a,H,I)))),a=a.return}T.length!==0&&n.push({event:i,listeners:T})}var d_=/\r\n?/g,f_=/\u0000|\uFFFD/g;function Vf(n){return(typeof n=="string"?n:""+n).replace(d_,`
`).replace(f_,"")}function Mo(n,i,a){if(i=Vf(i),Vf(n)!==i&&a)throw Error(t(425))}function Eo(){}var Nc=null,Pc=null;function Lc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Dc=typeof setTimeout=="function"?setTimeout:void 0,h_=typeof clearTimeout=="function"?clearTimeout:void 0,Gf=typeof Promise=="function"?Promise:void 0,p_=typeof queueMicrotask=="function"?queueMicrotask:typeof Gf<"u"?function(n){return Gf.resolve(null).then(n).catch(m_)}:Dc;function m_(n){setTimeout(function(){throw n})}function Uc(n,i){var a=i,c=0;do{var h=a.nextSibling;if(n.removeChild(a),h&&h.nodeType===8)if(a=h.data,a==="/$"){if(c===0){n.removeChild(h),ma(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=h}while(a);ma(i)}function Ji(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Wf(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var hs=Math.random().toString(36).slice(2),ci="__reactFiber$"+hs,Aa="__reactProps$"+hs,wi="__reactContainer$"+hs,Ic="__reactEvents$"+hs,g_="__reactListeners$"+hs,v_="__reactHandles$"+hs;function br(n){var i=n[ci];if(i)return i;for(var a=n.parentNode;a;){if(i=a[wi]||a[ci]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=Wf(n);n!==null;){if(a=n[ci])return a;n=Wf(n)}return i}n=a,a=n.parentNode}return null}function Ca(n){return n=n[ci]||n[wi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ps(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function wo(n){return n[Aa]||null}var Fc=[],ms=-1;function Qi(n){return{current:n}}function Pt(n){0>ms||(n.current=Fc[ms],Fc[ms]=null,ms--)}function bt(n,i){ms++,Fc[ms]=n.current,n.current=i}var er={},cn=Qi(er),Mn=Qi(!1),Rr=er;function gs(n,i){var a=n.type.contextTypes;if(!a)return er;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},v;for(v in a)h[v]=i[v];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function En(n){return n=n.childContextTypes,n!=null}function To(){Pt(Mn),Pt(cn)}function $f(n,i,a){if(cn.current!==er)throw Error(t(168));bt(cn,i),bt(Mn,a)}function Xf(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,_e(n)||"Unknown",h));return ee({},a,c)}function Ao(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||er,Rr=cn.current,bt(cn,n),bt(Mn,Mn.current),!0}function qf(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Xf(n,i,Rr),c.__reactInternalMemoizedMergedChildContext=n,Pt(Mn),Pt(cn),bt(cn,n)):Pt(Mn),bt(Mn,a)}var Ti=null,Co=!1,Oc=!1;function Yf(n){Ti===null?Ti=[n]:Ti.push(n)}function __(n){Co=!0,Yf(n)}function tr(){if(!Oc&&Ti!==null){Oc=!0;var n=0,i=Et;try{var a=Ti;for(Et=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Ti=null,Co=!1}catch(h){throw Ti!==null&&(Ti=Ti.slice(n+1)),Ge(Dt,tr),h}finally{Et=i,Oc=!1}}return null}var vs=[],_s=0,bo=null,Ro=0,jn=[],Hn=0,Nr=null,Ai=1,Ci="";function Pr(n,i){vs[_s++]=Ro,vs[_s++]=bo,bo=n,Ro=i}function Kf(n,i,a){jn[Hn++]=Ai,jn[Hn++]=Ci,jn[Hn++]=Nr,Nr=n;var c=Ai;n=Ci;var h=32-Wt(c)-1;c&=~(1<<h),a+=1;var v=32-Wt(i)+h;if(30<v){var T=h-h%5;v=(c&(1<<T)-1).toString(32),c>>=T,h-=T,Ai=1<<32-Wt(i)+h|a<<h|c,Ci=v+n}else Ai=1<<v|a<<h|c,Ci=n}function kc(n){n.return!==null&&(Pr(n,1),Kf(n,1,0))}function zc(n){for(;n===bo;)bo=vs[--_s],vs[_s]=null,Ro=vs[--_s],vs[_s]=null;for(;n===Nr;)Nr=jn[--Hn],jn[Hn]=null,Ci=jn[--Hn],jn[Hn]=null,Ai=jn[--Hn],jn[Hn]=null}var Un=null,In=null,Ut=!1,Qn=null;function Zf(n,i){var a=$n(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Jf(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Un=n,In=Ji(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Un=n,In=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Nr!==null?{id:Ai,overflow:Ci}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=$n(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,Un=n,In=null,!0):!1;default:return!1}}function Bc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function jc(n){if(Ut){var i=In;if(i){var a=i;if(!Jf(n,i)){if(Bc(n))throw Error(t(418));i=Ji(a.nextSibling);var c=Un;i&&Jf(n,i)?Zf(c,a):(n.flags=n.flags&-4097|2,Ut=!1,Un=n)}}else{if(Bc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Ut=!1,Un=n}}}function Qf(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Un=n}function No(n){if(n!==Un)return!1;if(!Ut)return Qf(n),Ut=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Lc(n.type,n.memoizedProps)),i&&(i=In)){if(Bc(n))throw eh(),Error(t(418));for(;i;)Zf(n,i),i=Ji(i.nextSibling)}if(Qf(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){In=Ji(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}In=null}}else In=Un?Ji(n.stateNode.nextSibling):null;return!0}function eh(){for(var n=In;n;)n=Ji(n.nextSibling)}function xs(){In=Un=null,Ut=!1}function Hc(n){Qn===null?Qn=[n]:Qn.push(n)}var x_=D.ReactCurrentBatchConfig;function ba(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var h=c,v=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===v?i.ref:(i=function(T){var I=h.refs;T===null?delete I[v]:I[v]=T},i._stringRef=v,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function Po(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function th(n){var i=n._init;return i(n._payload)}function nh(n){function i(Q,V){if(n){var ie=Q.deletions;ie===null?(Q.deletions=[V],Q.flags|=16):ie.push(V)}}function a(Q,V){if(!n)return null;for(;V!==null;)i(Q,V),V=V.sibling;return null}function c(Q,V){for(Q=new Map;V!==null;)V.key!==null?Q.set(V.key,V):Q.set(V.index,V),V=V.sibling;return Q}function h(Q,V){return Q=cr(Q,V),Q.index=0,Q.sibling=null,Q}function v(Q,V,ie){return Q.index=ie,n?(ie=Q.alternate,ie!==null?(ie=ie.index,ie<V?(Q.flags|=2,V):ie):(Q.flags|=2,V)):(Q.flags|=1048576,V)}function T(Q){return n&&Q.alternate===null&&(Q.flags|=2),Q}function I(Q,V,ie,Ce){return V===null||V.tag!==6?(V=Du(ie,Q.mode,Ce),V.return=Q,V):(V=h(V,ie),V.return=Q,V)}function H(Q,V,ie,Ce){var $e=ie.type;return $e===L?ye(Q,V,ie.props.children,Ce,ie.key):V!==null&&(V.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===G&&th($e)===V.type)?(Ce=h(V,ie.props),Ce.ref=ba(Q,V,ie),Ce.return=Q,Ce):(Ce=tl(ie.type,ie.key,ie.props,null,Q.mode,Ce),Ce.ref=ba(Q,V,ie),Ce.return=Q,Ce)}function oe(Q,V,ie,Ce){return V===null||V.tag!==4||V.stateNode.containerInfo!==ie.containerInfo||V.stateNode.implementation!==ie.implementation?(V=Uu(ie,Q.mode,Ce),V.return=Q,V):(V=h(V,ie.children||[]),V.return=Q,V)}function ye(Q,V,ie,Ce,$e){return V===null||V.tag!==7?(V=zr(ie,Q.mode,Ce,$e),V.return=Q,V):(V=h(V,ie),V.return=Q,V)}function Te(Q,V,ie){if(typeof V=="string"&&V!==""||typeof V=="number")return V=Du(""+V,Q.mode,ie),V.return=Q,V;if(typeof V=="object"&&V!==null){switch(V.$$typeof){case $:return ie=tl(V.type,V.key,V.props,null,Q.mode,ie),ie.ref=ba(Q,null,V),ie.return=Q,ie;case U:return V=Uu(V,Q.mode,ie),V.return=Q,V;case G:var Ce=V._init;return Te(Q,Ce(V._payload),ie)}if(R(V)||re(V))return V=zr(V,Q.mode,ie,null),V.return=Q,V;Po(Q,V)}return null}function xe(Q,V,ie,Ce){var $e=V!==null?V.key:null;if(typeof ie=="string"&&ie!==""||typeof ie=="number")return $e!==null?null:I(Q,V,""+ie,Ce);if(typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case $:return ie.key===$e?H(Q,V,ie,Ce):null;case U:return ie.key===$e?oe(Q,V,ie,Ce):null;case G:return $e=ie._init,xe(Q,V,$e(ie._payload),Ce)}if(R(ie)||re(ie))return $e!==null?null:ye(Q,V,ie,Ce,null);Po(Q,ie)}return null}function Oe(Q,V,ie,Ce,$e){if(typeof Ce=="string"&&Ce!==""||typeof Ce=="number")return Q=Q.get(ie)||null,I(V,Q,""+Ce,$e);if(typeof Ce=="object"&&Ce!==null){switch(Ce.$$typeof){case $:return Q=Q.get(Ce.key===null?ie:Ce.key)||null,H(V,Q,Ce,$e);case U:return Q=Q.get(Ce.key===null?ie:Ce.key)||null,oe(V,Q,Ce,$e);case G:var Ze=Ce._init;return Oe(Q,V,ie,Ze(Ce._payload),$e)}if(R(Ce)||re(Ce))return Q=Q.get(ie)||null,ye(V,Q,Ce,$e,null);Po(V,Ce)}return null}function Be(Q,V,ie,Ce){for(var $e=null,Ze=null,Je=V,nt=V=0,tn=null;Je!==null&&nt<ie.length;nt++){Je.index>nt?(tn=Je,Je=null):tn=Je.sibling;var St=xe(Q,Je,ie[nt],Ce);if(St===null){Je===null&&(Je=tn);break}n&&Je&&St.alternate===null&&i(Q,Je),V=v(St,V,nt),Ze===null?$e=St:Ze.sibling=St,Ze=St,Je=tn}if(nt===ie.length)return a(Q,Je),Ut&&Pr(Q,nt),$e;if(Je===null){for(;nt<ie.length;nt++)Je=Te(Q,ie[nt],Ce),Je!==null&&(V=v(Je,V,nt),Ze===null?$e=Je:Ze.sibling=Je,Ze=Je);return Ut&&Pr(Q,nt),$e}for(Je=c(Q,Je);nt<ie.length;nt++)tn=Oe(Je,Q,nt,ie[nt],Ce),tn!==null&&(n&&tn.alternate!==null&&Je.delete(tn.key===null?nt:tn.key),V=v(tn,V,nt),Ze===null?$e=tn:Ze.sibling=tn,Ze=tn);return n&&Je.forEach(function(ur){return i(Q,ur)}),Ut&&Pr(Q,nt),$e}function Ve(Q,V,ie,Ce){var $e=re(ie);if(typeof $e!="function")throw Error(t(150));if(ie=$e.call(ie),ie==null)throw Error(t(151));for(var Ze=$e=null,Je=V,nt=V=0,tn=null,St=ie.next();Je!==null&&!St.done;nt++,St=ie.next()){Je.index>nt?(tn=Je,Je=null):tn=Je.sibling;var ur=xe(Q,Je,St.value,Ce);if(ur===null){Je===null&&(Je=tn);break}n&&Je&&ur.alternate===null&&i(Q,Je),V=v(ur,V,nt),Ze===null?$e=ur:Ze.sibling=ur,Ze=ur,Je=tn}if(St.done)return a(Q,Je),Ut&&Pr(Q,nt),$e;if(Je===null){for(;!St.done;nt++,St=ie.next())St=Te(Q,St.value,Ce),St!==null&&(V=v(St,V,nt),Ze===null?$e=St:Ze.sibling=St,Ze=St);return Ut&&Pr(Q,nt),$e}for(Je=c(Q,Je);!St.done;nt++,St=ie.next())St=Oe(Je,Q,nt,St.value,Ce),St!==null&&(n&&St.alternate!==null&&Je.delete(St.key===null?nt:St.key),V=v(St,V,nt),Ze===null?$e=St:Ze.sibling=St,Ze=St);return n&&Je.forEach(function(J_){return i(Q,J_)}),Ut&&Pr(Q,nt),$e}function zt(Q,V,ie,Ce){if(typeof ie=="object"&&ie!==null&&ie.type===L&&ie.key===null&&(ie=ie.props.children),typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case $:e:{for(var $e=ie.key,Ze=V;Ze!==null;){if(Ze.key===$e){if($e=ie.type,$e===L){if(Ze.tag===7){a(Q,Ze.sibling),V=h(Ze,ie.props.children),V.return=Q,Q=V;break e}}else if(Ze.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===G&&th($e)===Ze.type){a(Q,Ze.sibling),V=h(Ze,ie.props),V.ref=ba(Q,Ze,ie),V.return=Q,Q=V;break e}a(Q,Ze);break}else i(Q,Ze);Ze=Ze.sibling}ie.type===L?(V=zr(ie.props.children,Q.mode,Ce,ie.key),V.return=Q,Q=V):(Ce=tl(ie.type,ie.key,ie.props,null,Q.mode,Ce),Ce.ref=ba(Q,V,ie),Ce.return=Q,Q=Ce)}return T(Q);case U:e:{for(Ze=ie.key;V!==null;){if(V.key===Ze)if(V.tag===4&&V.stateNode.containerInfo===ie.containerInfo&&V.stateNode.implementation===ie.implementation){a(Q,V.sibling),V=h(V,ie.children||[]),V.return=Q,Q=V;break e}else{a(Q,V);break}else i(Q,V);V=V.sibling}V=Uu(ie,Q.mode,Ce),V.return=Q,Q=V}return T(Q);case G:return Ze=ie._init,zt(Q,V,Ze(ie._payload),Ce)}if(R(ie))return Be(Q,V,ie,Ce);if(re(ie))return Ve(Q,V,ie,Ce);Po(Q,ie)}return typeof ie=="string"&&ie!==""||typeof ie=="number"?(ie=""+ie,V!==null&&V.tag===6?(a(Q,V.sibling),V=h(V,ie),V.return=Q,Q=V):(a(Q,V),V=Du(ie,Q.mode,Ce),V.return=Q,Q=V),T(Q)):a(Q,V)}return zt}var ys=nh(!0),ih=nh(!1),Lo=Qi(null),Do=null,Ss=null,Vc=null;function Gc(){Vc=Ss=Do=null}function Wc(n){var i=Lo.current;Pt(Lo),n._currentValue=i}function $c(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function Ms(n,i){Do=n,Vc=Ss=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(wn=!0),n.firstContext=null)}function Vn(n){var i=n._currentValue;if(Vc!==n)if(n={context:n,memoizedValue:i,next:null},Ss===null){if(Do===null)throw Error(t(308));Ss=n,Do.dependencies={lanes:0,firstContext:n}}else Ss=Ss.next=n;return i}var Lr=null;function Xc(n){Lr===null?Lr=[n]:Lr.push(n)}function rh(n,i,a,c){var h=i.interleaved;return h===null?(a.next=a,Xc(i)):(a.next=h.next,h.next=a),i.interleaved=a,bi(n,c)}function bi(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var nr=!1;function qc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ri(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ir(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(vt&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,bi(n,a)}return h=c.interleaved,h===null?(i.next=i,Xc(c)):(i.next=h.next,h.next=i),c.interleaved=i,bi(n,a)}function Uo(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}function ah(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var h=null,v=null;if(a=a.firstBaseUpdate,a!==null){do{var T={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};v===null?h=v=T:v=v.next=T,a=a.next}while(a!==null);v===null?h=v=i:v=v.next=i}else h=v=i;a={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:v,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function Io(n,i,a,c){var h=n.updateQueue;nr=!1;var v=h.firstBaseUpdate,T=h.lastBaseUpdate,I=h.shared.pending;if(I!==null){h.shared.pending=null;var H=I,oe=H.next;H.next=null,T===null?v=oe:T.next=oe,T=H;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,I=ye.lastBaseUpdate,I!==T&&(I===null?ye.firstBaseUpdate=oe:I.next=oe,ye.lastBaseUpdate=H))}if(v!==null){var Te=h.baseState;T=0,ye=oe=H=null,I=v;do{var xe=I.lane,Oe=I.eventTime;if((c&xe)===xe){ye!==null&&(ye=ye.next={eventTime:Oe,lane:0,tag:I.tag,payload:I.payload,callback:I.callback,next:null});e:{var Be=n,Ve=I;switch(xe=i,Oe=a,Ve.tag){case 1:if(Be=Ve.payload,typeof Be=="function"){Te=Be.call(Oe,Te,xe);break e}Te=Be;break e;case 3:Be.flags=Be.flags&-65537|128;case 0:if(Be=Ve.payload,xe=typeof Be=="function"?Be.call(Oe,Te,xe):Be,xe==null)break e;Te=ee({},Te,xe);break e;case 2:nr=!0}}I.callback!==null&&I.lane!==0&&(n.flags|=64,xe=h.effects,xe===null?h.effects=[I]:xe.push(I))}else Oe={eventTime:Oe,lane:xe,tag:I.tag,payload:I.payload,callback:I.callback,next:null},ye===null?(oe=ye=Oe,H=Te):ye=ye.next=Oe,T|=xe;if(I=I.next,I===null){if(I=h.shared.pending,I===null)break;xe=I,I=xe.next,xe.next=null,h.lastBaseUpdate=xe,h.shared.pending=null}}while(!0);if(ye===null&&(H=Te),h.baseState=H,h.firstBaseUpdate=oe,h.lastBaseUpdate=ye,i=h.shared.interleaved,i!==null){h=i;do T|=h.lane,h=h.next;while(h!==i)}else v===null&&(h.shared.lanes=0);Ir|=T,n.lanes=T,n.memoizedState=Te}}function oh(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=a,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var Ra={},ui=Qi(Ra),Na=Qi(Ra),Pa=Qi(Ra);function Dr(n){if(n===Ra)throw Error(t(174));return n}function Yc(n,i){switch(bt(Pa,i),bt(Na,n),bt(ui,Ra),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Pe(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Pe(i,n)}Pt(ui),bt(ui,i)}function Es(){Pt(ui),Pt(Na),Pt(Pa)}function lh(n){Dr(Pa.current);var i=Dr(ui.current),a=Pe(i,n.type);i!==a&&(bt(Na,n),bt(ui,a))}function Kc(n){Na.current===n&&(Pt(ui),Pt(Na))}var It=Qi(0);function Fo(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Zc=[];function Jc(){for(var n=0;n<Zc.length;n++)Zc[n]._workInProgressVersionPrimary=null;Zc.length=0}var Oo=D.ReactCurrentDispatcher,Qc=D.ReactCurrentBatchConfig,Ur=0,Ft=null,$t=null,Qt=null,ko=!1,La=!1,Da=0,y_=0;function un(){throw Error(t(321))}function eu(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Jn(n[a],i[a]))return!1;return!0}function tu(n,i,a,c,h,v){if(Ur=v,Ft=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Oo.current=n===null||n.memoizedState===null?w_:T_,n=a(c,h),La){v=0;do{if(La=!1,Da=0,25<=v)throw Error(t(301));v+=1,Qt=$t=null,i.updateQueue=null,Oo.current=A_,n=a(c,h)}while(La)}if(Oo.current=jo,i=$t!==null&&$t.next!==null,Ur=0,Qt=$t=Ft=null,ko=!1,i)throw Error(t(300));return n}function nu(){var n=Da!==0;return Da=0,n}function di(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n,Qt}function Gn(){if($t===null){var n=Ft.alternate;n=n!==null?n.memoizedState:null}else n=$t.next;var i=Qt===null?Ft.memoizedState:Qt.next;if(i!==null)Qt=i,$t=n;else{if(n===null)throw Error(t(310));$t=n,n={memoizedState:$t.memoizedState,baseState:$t.baseState,baseQueue:$t.baseQueue,queue:$t.queue,next:null},Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n}return Qt}function Ua(n,i){return typeof i=="function"?i(n):i}function iu(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=$t,h=c.baseQueue,v=a.pending;if(v!==null){if(h!==null){var T=h.next;h.next=v.next,v.next=T}c.baseQueue=h=v,a.pending=null}if(h!==null){v=h.next,c=c.baseState;var I=T=null,H=null,oe=v;do{var ye=oe.lane;if((Ur&ye)===ye)H!==null&&(H=H.next={lane:0,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null}),c=oe.hasEagerState?oe.eagerState:n(c,oe.action);else{var Te={lane:ye,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null};H===null?(I=H=Te,T=c):H=H.next=Te,Ft.lanes|=ye,Ir|=ye}oe=oe.next}while(oe!==null&&oe!==v);H===null?T=c:H.next=I,Jn(c,i.memoizedState)||(wn=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=H,a.lastRenderedState=c}if(n=a.interleaved,n!==null){h=n;do v=h.lane,Ft.lanes|=v,Ir|=v,h=h.next;while(h!==n)}else h===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function ru(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,h=a.pending,v=i.memoizedState;if(h!==null){a.pending=null;var T=h=h.next;do v=n(v,T.action),T=T.next;while(T!==h);Jn(v,i.memoizedState)||(wn=!0),i.memoizedState=v,i.baseQueue===null&&(i.baseState=v),a.lastRenderedState=v}return[v,c]}function ch(){}function uh(n,i){var a=Ft,c=Gn(),h=i(),v=!Jn(c.memoizedState,h);if(v&&(c.memoizedState=h,wn=!0),c=c.queue,su(hh.bind(null,a,c,n),[n]),c.getSnapshot!==i||v||Qt!==null&&Qt.memoizedState.tag&1){if(a.flags|=2048,Ia(9,fh.bind(null,a,c,h,i),void 0,null),en===null)throw Error(t(349));(Ur&30)!==0||dh(a,i,h)}return h}function dh(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function fh(n,i,a,c){i.value=a,i.getSnapshot=c,ph(i)&&mh(n)}function hh(n,i,a){return a(function(){ph(i)&&mh(n)})}function ph(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Jn(n,a)}catch{return!0}}function mh(n){var i=bi(n,1);i!==null&&ii(i,n,1,-1)}function gh(n){var i=di();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ua,lastRenderedState:n},i.queue=n,n=n.dispatch=E_.bind(null,Ft,n),[i.memoizedState,n]}function Ia(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function vh(){return Gn().memoizedState}function zo(n,i,a,c){var h=di();Ft.flags|=n,h.memoizedState=Ia(1|i,a,void 0,c===void 0?null:c)}function Bo(n,i,a,c){var h=Gn();c=c===void 0?null:c;var v=void 0;if($t!==null){var T=$t.memoizedState;if(v=T.destroy,c!==null&&eu(c,T.deps)){h.memoizedState=Ia(i,a,v,c);return}}Ft.flags|=n,h.memoizedState=Ia(1|i,a,v,c)}function _h(n,i){return zo(8390656,8,n,i)}function su(n,i){return Bo(2048,8,n,i)}function xh(n,i){return Bo(4,2,n,i)}function yh(n,i){return Bo(4,4,n,i)}function Sh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Mh(n,i,a){return a=a!=null?a.concat([n]):null,Bo(4,4,Sh.bind(null,i,n),a)}function au(){}function Eh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function wh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function Th(n,i,a){return(Ur&21)===0?(n.baseState&&(n.baseState=!1,wn=!0),n.memoizedState=a):(Jn(a,i)||(a=ef(),Ft.lanes|=a,Ir|=a,n.baseState=!0),i)}function S_(n,i){var a=Et;Et=a!==0&&4>a?a:4,n(!0);var c=Qc.transition;Qc.transition={};try{n(!1),i()}finally{Et=a,Qc.transition=c}}function Ah(){return Gn().memoizedState}function M_(n,i,a){var c=or(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Ch(n))bh(i,a);else if(a=rh(n,i,a,c),a!==null){var h=_n();ii(a,n,c,h),Rh(a,i,c)}}function E_(n,i,a){var c=or(n),h={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ch(n))bh(i,h);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=i.lastRenderedReducer,v!==null))try{var T=i.lastRenderedState,I=v(T,a);if(h.hasEagerState=!0,h.eagerState=I,Jn(I,T)){var H=i.interleaved;H===null?(h.next=h,Xc(i)):(h.next=H.next,H.next=h),i.interleaved=h;return}}catch{}finally{}a=rh(n,i,h,c),a!==null&&(h=_n(),ii(a,n,c,h),Rh(a,i,c))}}function Ch(n){var i=n.alternate;return n===Ft||i!==null&&i===Ft}function bh(n,i){La=ko=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Rh(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}var jo={readContext:Vn,useCallback:un,useContext:un,useEffect:un,useImperativeHandle:un,useInsertionEffect:un,useLayoutEffect:un,useMemo:un,useReducer:un,useRef:un,useState:un,useDebugValue:un,useDeferredValue:un,useTransition:un,useMutableSource:un,useSyncExternalStore:un,useId:un,unstable_isNewReconciler:!1},w_={readContext:Vn,useCallback:function(n,i){return di().memoizedState=[n,i===void 0?null:i],n},useContext:Vn,useEffect:_h,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,zo(4194308,4,Sh.bind(null,i,n),a)},useLayoutEffect:function(n,i){return zo(4194308,4,n,i)},useInsertionEffect:function(n,i){return zo(4,2,n,i)},useMemo:function(n,i){var a=di();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=di();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=M_.bind(null,Ft,n),[c.memoizedState,n]},useRef:function(n){var i=di();return n={current:n},i.memoizedState=n},useState:gh,useDebugValue:au,useDeferredValue:function(n){return di().memoizedState=n},useTransition:function(){var n=gh(!1),i=n[0];return n=S_.bind(null,n[1]),di().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=Ft,h=di();if(Ut){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),en===null)throw Error(t(349));(Ur&30)!==0||dh(c,i,a)}h.memoizedState=a;var v={value:a,getSnapshot:i};return h.queue=v,_h(hh.bind(null,c,v,n),[n]),c.flags|=2048,Ia(9,fh.bind(null,c,v,a,i),void 0,null),a},useId:function(){var n=di(),i=en.identifierPrefix;if(Ut){var a=Ci,c=Ai;a=(c&~(1<<32-Wt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Da++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=y_++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},T_={readContext:Vn,useCallback:Eh,useContext:Vn,useEffect:su,useImperativeHandle:Mh,useInsertionEffect:xh,useLayoutEffect:yh,useMemo:wh,useReducer:iu,useRef:vh,useState:function(){return iu(Ua)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return Th(i,$t.memoizedState,n)},useTransition:function(){var n=iu(Ua)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:ch,useSyncExternalStore:uh,useId:Ah,unstable_isNewReconciler:!1},A_={readContext:Vn,useCallback:Eh,useContext:Vn,useEffect:su,useImperativeHandle:Mh,useInsertionEffect:xh,useLayoutEffect:yh,useMemo:wh,useReducer:ru,useRef:vh,useState:function(){return ru(Ua)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return $t===null?i.memoizedState=n:Th(i,$t.memoizedState,n)},useTransition:function(){var n=ru(Ua)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:ch,useSyncExternalStore:uh,useId:Ah,unstable_isNewReconciler:!1};function ei(n,i){if(n&&n.defaultProps){i=ee({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function ou(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:ee({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Ho={isMounted:function(n){return(n=n._reactInternals)?P(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Uo(i,n,h))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.tag=1,v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Uo(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=_n(),c=or(n),h=Ri(a,c);h.tag=2,i!=null&&(h.callback=i),i=ir(n,h,c),i!==null&&(ii(i,n,c,a),Uo(i,n,c))}};function Nh(n,i,a,c,h,v,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,v,T):i.prototype&&i.prototype.isPureReactComponent?!Sa(a,c)||!Sa(h,v):!0}function Ph(n,i,a){var c=!1,h=er,v=i.contextType;return typeof v=="object"&&v!==null?v=Vn(v):(h=En(i)?Rr:cn.current,c=i.contextTypes,v=(c=c!=null)?gs(n,h):er),i=new i(a,v),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ho,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=v),i}function Lh(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&Ho.enqueueReplaceState(i,i.state,null)}function lu(n,i,a,c){var h=n.stateNode;h.props=a,h.state=n.memoizedState,h.refs={},qc(n);var v=i.contextType;typeof v=="object"&&v!==null?h.context=Vn(v):(v=En(i)?Rr:cn.current,h.context=gs(n,v)),h.state=n.memoizedState,v=i.getDerivedStateFromProps,typeof v=="function"&&(ou(n,i,v,a),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Ho.enqueueReplaceState(h,h.state,null),Io(n,a,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function ws(n,i){try{var a="",c=i;do a+=he(c),c=c.return;while(c);var h=a}catch(v){h=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:i,stack:h,digest:null}}function cu(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function uu(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var C_=typeof WeakMap=="function"?WeakMap:Map;function Dh(n,i,a){a=Ri(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){Yo||(Yo=!0,Tu=c),uu(n,i)},a}function Uh(n,i,a){a=Ri(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;a.payload=function(){return c(h)},a.callback=function(){uu(n,i)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(a.callback=function(){uu(n,i),typeof c!="function"&&(sr===null?sr=new Set([this]):sr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),a}function Ih(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new C_;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(a)||(h.add(a),n=j_.bind(null,n,i,a),i.then(n,n))}function Fh(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Oh(n,i,a,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Ri(-1,1),i.tag=2,ir(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var b_=D.ReactCurrentOwner,wn=!1;function vn(n,i,a,c){i.child=n===null?ih(i,null,a,c):ys(i,n.child,a,c)}function kh(n,i,a,c,h){a=a.render;var v=i.ref;return Ms(i,h),c=tu(n,i,a,c,v,h),a=nu(),n!==null&&!wn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&a&&kc(i),i.flags|=1,vn(n,i,c,h),i.child)}function zh(n,i,a,c,h){if(n===null){var v=a.type;return typeof v=="function"&&!Lu(v)&&v.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=v,Bh(n,i,v,c,h)):(n=tl(a.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(v=n.child,(n.lanes&h)===0){var T=v.memoizedProps;if(a=a.compare,a=a!==null?a:Sa,a(T,c)&&n.ref===i.ref)return Ni(n,i,h)}return i.flags|=1,n=cr(v,c),n.ref=i.ref,n.return=i,i.child=n}function Bh(n,i,a,c,h){if(n!==null){var v=n.memoizedProps;if(Sa(v,c)&&n.ref===i.ref)if(wn=!1,i.pendingProps=c=v,(n.lanes&h)!==0)(n.flags&131072)!==0&&(wn=!0);else return i.lanes=n.lanes,Ni(n,i,h)}return du(n,i,a,c,h)}function jh(n,i,a){var c=i.pendingProps,h=c.children,v=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},bt(As,Fn),Fn|=a;else{if((a&1073741824)===0)return n=v!==null?v.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,bt(As,Fn),Fn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=v!==null?v.baseLanes:a,bt(As,Fn),Fn|=c}else v!==null?(c=v.baseLanes|a,i.memoizedState=null):c=a,bt(As,Fn),Fn|=c;return vn(n,i,h,a),i.child}function Hh(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function du(n,i,a,c,h){var v=En(a)?Rr:cn.current;return v=gs(i,v),Ms(i,h),a=tu(n,i,a,c,v,h),c=nu(),n!==null&&!wn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&c&&kc(i),i.flags|=1,vn(n,i,a,h),i.child)}function Vh(n,i,a,c,h){if(En(a)){var v=!0;Ao(i)}else v=!1;if(Ms(i,h),i.stateNode===null)Go(n,i),Ph(i,a,c),lu(i,a,c,h),c=!0;else if(n===null){var T=i.stateNode,I=i.memoizedProps;T.props=I;var H=T.context,oe=a.contextType;typeof oe=="object"&&oe!==null?oe=Vn(oe):(oe=En(a)?Rr:cn.current,oe=gs(i,oe));var ye=a.getDerivedStateFromProps,Te=typeof ye=="function"||typeof T.getSnapshotBeforeUpdate=="function";Te||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(I!==c||H!==oe)&&Lh(i,T,c,oe),nr=!1;var xe=i.memoizedState;T.state=xe,Io(i,c,T,h),H=i.memoizedState,I!==c||xe!==H||Mn.current||nr?(typeof ye=="function"&&(ou(i,a,ye,c),H=i.memoizedState),(I=nr||Nh(i,a,I,c,xe,H,oe))?(Te||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=H),T.props=c,T.state=H,T.context=oe,c=I):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,sh(n,i),I=i.memoizedProps,oe=i.type===i.elementType?I:ei(i.type,I),T.props=oe,Te=i.pendingProps,xe=T.context,H=a.contextType,typeof H=="object"&&H!==null?H=Vn(H):(H=En(a)?Rr:cn.current,H=gs(i,H));var Oe=a.getDerivedStateFromProps;(ye=typeof Oe=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(I!==Te||xe!==H)&&Lh(i,T,c,H),nr=!1,xe=i.memoizedState,T.state=xe,Io(i,c,T,h);var Be=i.memoizedState;I!==Te||xe!==Be||Mn.current||nr?(typeof Oe=="function"&&(ou(i,a,Oe,c),Be=i.memoizedState),(oe=nr||Nh(i,a,oe,c,xe,Be,H)||!1)?(ye||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,Be,H),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,Be,H)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||I===n.memoizedProps&&xe===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&xe===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=Be),T.props=c,T.state=Be,T.context=H,c=oe):(typeof T.componentDidUpdate!="function"||I===n.memoizedProps&&xe===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&xe===n.memoizedState||(i.flags|=1024),c=!1)}return fu(n,i,a,c,v,h)}function fu(n,i,a,c,h,v){Hh(n,i);var T=(i.flags&128)!==0;if(!c&&!T)return h&&qf(i,a,!1),Ni(n,i,v);c=i.stateNode,b_.current=i;var I=T&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&T?(i.child=ys(i,n.child,null,v),i.child=ys(i,null,I,v)):vn(n,i,I,v),i.memoizedState=c.state,h&&qf(i,a,!0),i.child}function Gh(n){var i=n.stateNode;i.pendingContext?$f(n,i.pendingContext,i.pendingContext!==i.context):i.context&&$f(n,i.context,!1),Yc(n,i.containerInfo)}function Wh(n,i,a,c,h){return xs(),Hc(h),i.flags|=256,vn(n,i,a,c),i.child}var hu={dehydrated:null,treeContext:null,retryLane:0};function pu(n){return{baseLanes:n,cachePool:null,transitions:null}}function $h(n,i,a){var c=i.pendingProps,h=It.current,v=!1,T=(i.flags&128)!==0,I;if((I=T)||(I=n!==null&&n.memoizedState===null?!1:(h&2)!==0),I?(v=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),bt(It,h&1),n===null)return jc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,n=c.fallback,v?(c=i.mode,v=i.child,T={mode:"hidden",children:T},(c&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=T):v=nl(T,c,0,null),n=zr(n,c,a,null),v.return=i,n.return=i,v.sibling=n,i.child=v,i.child.memoizedState=pu(a),i.memoizedState=hu,n):mu(i,T));if(h=n.memoizedState,h!==null&&(I=h.dehydrated,I!==null))return R_(n,i,T,c,I,h,a);if(v){v=c.fallback,T=i.mode,h=n.child,I=h.sibling;var H={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=H,i.deletions=null):(c=cr(h,H),c.subtreeFlags=h.subtreeFlags&14680064),I!==null?v=cr(I,v):(v=zr(v,T,a,null),v.flags|=2),v.return=i,c.return=i,c.sibling=v,i.child=c,c=v,v=i.child,T=n.child.memoizedState,T=T===null?pu(a):{baseLanes:T.baseLanes|a,cachePool:null,transitions:T.transitions},v.memoizedState=T,v.childLanes=n.childLanes&~a,i.memoizedState=hu,c}return v=n.child,n=v.sibling,c=cr(v,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function mu(n,i){return i=nl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Vo(n,i,a,c){return c!==null&&Hc(c),ys(i,n.child,null,a),n=mu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function R_(n,i,a,c,h,v,T){if(a)return i.flags&256?(i.flags&=-257,c=cu(Error(t(422))),Vo(n,i,T,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(v=c.fallback,h=i.mode,c=nl({mode:"visible",children:c.children},h,0,null),v=zr(v,h,T,null),v.flags|=2,c.return=i,v.return=i,c.sibling=v,i.child=c,(i.mode&1)!==0&&ys(i,n.child,null,T),i.child.memoizedState=pu(T),i.memoizedState=hu,v);if((i.mode&1)===0)return Vo(n,i,T,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var I=c.dgst;return c=I,v=Error(t(419)),c=cu(v,c,void 0),Vo(n,i,T,c)}if(I=(T&n.childLanes)!==0,wn||I){if(c=en,c!==null){switch(T&-T){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|T))!==0?0:h,h!==0&&h!==v.retryLane&&(v.retryLane=h,bi(n,h),ii(c,n,h,-1))}return Pu(),c=cu(Error(t(421))),Vo(n,i,T,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=H_.bind(null,n),h._reactRetry=i,null):(n=v.treeContext,In=Ji(h.nextSibling),Un=i,Ut=!0,Qn=null,n!==null&&(jn[Hn++]=Ai,jn[Hn++]=Ci,jn[Hn++]=Nr,Ai=n.id,Ci=n.overflow,Nr=i),i=mu(i,c.children),i.flags|=4096,i)}function Xh(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),$c(n.return,i,a)}function gu(n,i,a,c,h){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:h}:(v.isBackwards=i,v.rendering=null,v.renderingStartTime=0,v.last=c,v.tail=a,v.tailMode=h)}function qh(n,i,a){var c=i.pendingProps,h=c.revealOrder,v=c.tail;if(vn(n,i,c.children,a),c=It.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Xh(n,a,i);else if(n.tag===19)Xh(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(bt(It,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(a=i.child,h=null;a!==null;)n=a.alternate,n!==null&&Fo(n)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),gu(i,!1,h,a,v);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Fo(n)===null){i.child=h;break}n=h.sibling,h.sibling=a,a=h,h=n}gu(i,!0,a,null,v);break;case"together":gu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Go(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ni(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Ir|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=cr(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=cr(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function N_(n,i,a){switch(i.tag){case 3:Gh(i),xs();break;case 5:lh(i);break;case 1:En(i.type)&&Ao(i);break;case 4:Yc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;bt(Lo,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(bt(It,It.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?$h(n,i,a):(bt(It,It.current&1),n=Ni(n,i,a),n!==null?n.sibling:null);bt(It,It.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return qh(n,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),bt(It,It.current),c)break;return null;case 22:case 23:return i.lanes=0,jh(n,i,a)}return Ni(n,i,a)}var Yh,vu,Kh,Zh;Yh=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},vu=function(){},Kh=function(n,i,a,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Dr(ui.current);var v=null;switch(a){case"input":h=Ke(n,h),c=Ke(n,c),v=[];break;case"select":h=ee({},h,{value:void 0}),c=ee({},c,{value:void 0}),v=[];break;case"textarea":h=ge(n,h),c=ge(n,c),v=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Eo)}Qe(a,c);var T;a=null;for(oe in h)if(!c.hasOwnProperty(oe)&&h.hasOwnProperty(oe)&&h[oe]!=null)if(oe==="style"){var I=h[oe];for(T in I)I.hasOwnProperty(T)&&(a||(a={}),a[T]="")}else oe!=="dangerouslySetInnerHTML"&&oe!=="children"&&oe!=="suppressContentEditableWarning"&&oe!=="suppressHydrationWarning"&&oe!=="autoFocus"&&(o.hasOwnProperty(oe)?v||(v=[]):(v=v||[]).push(oe,null));for(oe in c){var H=c[oe];if(I=h!=null?h[oe]:void 0,c.hasOwnProperty(oe)&&H!==I&&(H!=null||I!=null))if(oe==="style")if(I){for(T in I)!I.hasOwnProperty(T)||H&&H.hasOwnProperty(T)||(a||(a={}),a[T]="");for(T in H)H.hasOwnProperty(T)&&I[T]!==H[T]&&(a||(a={}),a[T]=H[T])}else a||(v||(v=[]),v.push(oe,a)),a=H;else oe==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,I=I?I.__html:void 0,H!=null&&I!==H&&(v=v||[]).push(oe,H)):oe==="children"?typeof H!="string"&&typeof H!="number"||(v=v||[]).push(oe,""+H):oe!=="suppressContentEditableWarning"&&oe!=="suppressHydrationWarning"&&(o.hasOwnProperty(oe)?(H!=null&&oe==="onScroll"&&Nt("scroll",n),v||I===H||(v=[])):(v=v||[]).push(oe,H))}a&&(v=v||[]).push("style",a);var oe=v;(i.updateQueue=oe)&&(i.flags|=4)}},Zh=function(n,i,a,c){a!==c&&(i.flags|=4)};function Fa(n,i){if(!Ut)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function dn(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function P_(n,i,a){var c=i.pendingProps;switch(zc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return dn(i),null;case 1:return En(i.type)&&To(),dn(i),null;case 3:return c=i.stateNode,Es(),Pt(Mn),Pt(cn),Jc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(No(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Qn!==null&&(bu(Qn),Qn=null))),vu(n,i),dn(i),null;case 5:Kc(i);var h=Dr(Pa.current);if(a=i.type,n!==null&&i.stateNode!=null)Kh(n,i,a,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return dn(i),null}if(n=Dr(ui.current),No(i)){c=i.stateNode,a=i.type;var v=i.memoizedProps;switch(c[ci]=i,c[Aa]=v,n=(i.mode&1)!==0,a){case"dialog":Nt("cancel",c),Nt("close",c);break;case"iframe":case"object":case"embed":Nt("load",c);break;case"video":case"audio":for(h=0;h<Ea.length;h++)Nt(Ea[h],c);break;case"source":Nt("error",c);break;case"img":case"image":case"link":Nt("error",c),Nt("load",c);break;case"details":Nt("toggle",c);break;case"input":ot(c,v),Nt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!v.multiple},Nt("invalid",c);break;case"textarea":Me(c,v),Nt("invalid",c)}Qe(a,v),h=null;for(var T in v)if(v.hasOwnProperty(T)){var I=v[T];T==="children"?typeof I=="string"?c.textContent!==I&&(v.suppressHydrationWarning!==!0&&Mo(c.textContent,I,n),h=["children",I]):typeof I=="number"&&c.textContent!==""+I&&(v.suppressHydrationWarning!==!0&&Mo(c.textContent,I,n),h=["children",""+I]):o.hasOwnProperty(T)&&I!=null&&T==="onScroll"&&Nt("scroll",c)}switch(a){case"input":mt(c),At(c,v,!0);break;case"textarea":mt(c),qe(c);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(c.onclick=Eo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Le(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=T.createElement(a,{is:c.is}):(n=T.createElement(a),a==="select"&&(T=n,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):n=T.createElementNS(n,a),n[ci]=i,n[Aa]=c,Yh(n,i,!1,!1),i.stateNode=n;e:{switch(T=je(a,c),a){case"dialog":Nt("cancel",n),Nt("close",n),h=c;break;case"iframe":case"object":case"embed":Nt("load",n),h=c;break;case"video":case"audio":for(h=0;h<Ea.length;h++)Nt(Ea[h],n);h=c;break;case"source":Nt("error",n),h=c;break;case"img":case"image":case"link":Nt("error",n),Nt("load",n),h=c;break;case"details":Nt("toggle",n),h=c;break;case"input":ot(n,c),h=Ke(n,c),Nt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=ee({},c,{value:void 0}),Nt("invalid",n);break;case"textarea":Me(n,c),h=ge(n,c),Nt("invalid",n);break;default:h=c}Qe(a,h),I=h;for(v in I)if(I.hasOwnProperty(v)){var H=I[v];v==="style"?ve(n,H):v==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,H!=null&&Re(n,H)):v==="children"?typeof H=="string"?(a!=="textarea"||H!=="")&&We(n,H):typeof H=="number"&&We(n,""+H):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(o.hasOwnProperty(v)?H!=null&&v==="onScroll"&&Nt("scroll",n):H!=null&&b(n,v,H,T))}switch(a){case"input":mt(n),At(n,c,!1);break;case"textarea":mt(n),qe(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Ae(c.value));break;case"select":n.multiple=!!c.multiple,v=c.value,v!=null?de(n,!!c.multiple,v,!1):c.defaultValue!=null&&de(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=Eo)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return dn(i),null;case 6:if(n&&i.stateNode!=null)Zh(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Dr(Pa.current),Dr(ui.current),No(i)){if(c=i.stateNode,a=i.memoizedProps,c[ci]=i,(v=c.nodeValue!==a)&&(n=Un,n!==null))switch(n.tag){case 3:Mo(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Mo(c.nodeValue,a,(n.mode&1)!==0)}v&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ci]=i,i.stateNode=c}return dn(i),null;case 13:if(Pt(It),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ut&&In!==null&&(i.mode&1)!==0&&(i.flags&128)===0)eh(),xs(),i.flags|=98560,v=!1;else if(v=No(i),c!==null&&c.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=i.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[ci]=i}else xs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;dn(i),v=!1}else Qn!==null&&(bu(Qn),Qn=null),v=!0;if(!v)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(It.current&1)!==0?Xt===0&&(Xt=3):Pu())),i.updateQueue!==null&&(i.flags|=4),dn(i),null);case 4:return Es(),vu(n,i),n===null&&wa(i.stateNode.containerInfo),dn(i),null;case 10:return Wc(i.type._context),dn(i),null;case 17:return En(i.type)&&To(),dn(i),null;case 19:if(Pt(It),v=i.memoizedState,v===null)return dn(i),null;if(c=(i.flags&128)!==0,T=v.rendering,T===null)if(c)Fa(v,!1);else{if(Xt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=Fo(n),T!==null){for(i.flags|=128,Fa(v,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)v=a,n=c,v.flags&=14680066,T=v.alternate,T===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=T.childLanes,v.lanes=T.lanes,v.child=T.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=T.memoizedProps,v.memoizedState=T.memoizedState,v.updateQueue=T.updateQueue,v.type=T.type,n=T.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return bt(It,It.current&1|2),i.child}n=n.sibling}v.tail!==null&&He()>Cs&&(i.flags|=128,c=!0,Fa(v,!1),i.lanes=4194304)}else{if(!c)if(n=Fo(T),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Fa(v,!0),v.tail===null&&v.tailMode==="hidden"&&!T.alternate&&!Ut)return dn(i),null}else 2*He()-v.renderingStartTime>Cs&&a!==1073741824&&(i.flags|=128,c=!0,Fa(v,!1),i.lanes=4194304);v.isBackwards?(T.sibling=i.child,i.child=T):(a=v.last,a!==null?a.sibling=T:i.child=T,v.last=T)}return v.tail!==null?(i=v.tail,v.rendering=i,v.tail=i.sibling,v.renderingStartTime=He(),i.sibling=null,a=It.current,bt(It,c?a&1|2:a&1),i):(dn(i),null);case 22:case 23:return Nu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(Fn&1073741824)!==0&&(dn(i),i.subtreeFlags&6&&(i.flags|=8192)):dn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function L_(n,i){switch(zc(i),i.tag){case 1:return En(i.type)&&To(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Es(),Pt(Mn),Pt(cn),Jc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Kc(i),null;case 13:if(Pt(It),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));xs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Pt(It),null;case 4:return Es(),null;case 10:return Wc(i.type._context),null;case 22:case 23:return Nu(),null;case 24:return null;default:return null}}var Wo=!1,fn=!1,D_=typeof WeakSet=="function"?WeakSet:Set,ze=null;function Ts(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){Ot(n,i,c)}else a.current=null}function _u(n,i,a){try{a()}catch(c){Ot(n,i,c)}}var Jh=!1;function U_(n,i){if(Nc=uo,n=Nf(),Mc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var h=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{a.nodeType,v.nodeType}catch{a=null;break e}var T=0,I=-1,H=-1,oe=0,ye=0,Te=n,xe=null;t:for(;;){for(var Oe;Te!==a||h!==0&&Te.nodeType!==3||(I=T+h),Te!==v||c!==0&&Te.nodeType!==3||(H=T+c),Te.nodeType===3&&(T+=Te.nodeValue.length),(Oe=Te.firstChild)!==null;)xe=Te,Te=Oe;for(;;){if(Te===n)break t;if(xe===a&&++oe===h&&(I=T),xe===v&&++ye===c&&(H=T),(Oe=Te.nextSibling)!==null)break;Te=xe,xe=Te.parentNode}Te=Oe}a=I===-1||H===-1?null:{start:I,end:H}}else a=null}a=a||{start:0,end:0}}else a=null;for(Pc={focusedElem:n,selectionRange:a},uo=!1,ze=i;ze!==null;)if(i=ze,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,ze=n;else for(;ze!==null;){i=ze;try{var Be=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Be!==null){var Ve=Be.memoizedProps,zt=Be.memoizedState,Q=i.stateNode,V=Q.getSnapshotBeforeUpdate(i.elementType===i.type?Ve:ei(i.type,Ve),zt);Q.__reactInternalSnapshotBeforeUpdate=V}break;case 3:var ie=i.stateNode.containerInfo;ie.nodeType===1?ie.textContent="":ie.nodeType===9&&ie.documentElement&&ie.removeChild(ie.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Ce){Ot(i,i.return,Ce)}if(n=i.sibling,n!==null){n.return=i.return,ze=n;break}ze=i.return}return Be=Jh,Jh=!1,Be}function Oa(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var v=h.destroy;h.destroy=void 0,v!==void 0&&_u(i,a,v)}h=h.next}while(h!==c)}}function $o(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function xu(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Qh(n){var i=n.alternate;i!==null&&(n.alternate=null,Qh(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[ci],delete i[Aa],delete i[Ic],delete i[g_],delete i[v_])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function ep(n){return n.tag===5||n.tag===3||n.tag===4}function tp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||ep(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function yu(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Eo));else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,a),n=n.sibling;n!==null;)yu(n,i,a),n=n.sibling}function Su(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Su(n,i,a),n=n.sibling;n!==null;)Su(n,i,a),n=n.sibling}var an=null,ti=!1;function rr(n,i,a){for(a=a.child;a!==null;)np(n,i,a),a=a.sibling}function np(n,i,a){if(ln&&typeof ln.onCommitFiberUnmount=="function")try{ln.onCommitFiberUnmount(tt,a)}catch{}switch(a.tag){case 5:fn||Ts(a,i);case 6:var c=an,h=ti;an=null,rr(n,i,a),an=c,ti=h,an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):an.removeChild(a.stateNode));break;case 18:an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?Uc(n.parentNode,a):n.nodeType===1&&Uc(n,a),ma(n)):Uc(an,a.stateNode));break;case 4:c=an,h=ti,an=a.stateNode.containerInfo,ti=!0,rr(n,i,a),an=c,ti=h;break;case 0:case 11:case 14:case 15:if(!fn&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var v=h,T=v.destroy;v=v.tag,T!==void 0&&((v&2)!==0||(v&4)!==0)&&_u(a,i,T),h=h.next}while(h!==c)}rr(n,i,a);break;case 1:if(!fn&&(Ts(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(I){Ot(a,i,I)}rr(n,i,a);break;case 21:rr(n,i,a);break;case 22:a.mode&1?(fn=(c=fn)||a.memoizedState!==null,rr(n,i,a),fn=c):rr(n,i,a);break;default:rr(n,i,a)}}function ip(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new D_),i.forEach(function(c){var h=V_.bind(null,n,c);a.has(c)||(a.add(c),c.then(h,h))})}}function ni(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var h=a[c];try{var v=n,T=i,I=T;e:for(;I!==null;){switch(I.tag){case 5:an=I.stateNode,ti=!1;break e;case 3:an=I.stateNode.containerInfo,ti=!0;break e;case 4:an=I.stateNode.containerInfo,ti=!0;break e}I=I.return}if(an===null)throw Error(t(160));np(v,T,h),an=null,ti=!1;var H=h.alternate;H!==null&&(H.return=null),h.return=null}catch(oe){Ot(h,i,oe)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)rp(i,n),i=i.sibling}function rp(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(ni(i,n),fi(n),c&4){try{Oa(3,n,n.return),$o(3,n)}catch(Ve){Ot(n,n.return,Ve)}try{Oa(5,n,n.return)}catch(Ve){Ot(n,n.return,Ve)}}break;case 1:ni(i,n),fi(n),c&512&&a!==null&&Ts(a,a.return);break;case 5:if(ni(i,n),fi(n),c&512&&a!==null&&Ts(a,a.return),n.flags&32){var h=n.stateNode;try{We(h,"")}catch(Ve){Ot(n,n.return,Ve)}}if(c&4&&(h=n.stateNode,h!=null)){var v=n.memoizedProps,T=a!==null?a.memoizedProps:v,I=n.type,H=n.updateQueue;if(n.updateQueue=null,H!==null)try{I==="input"&&v.type==="radio"&&v.name!=null&&st(h,v),je(I,T);var oe=je(I,v);for(T=0;T<H.length;T+=2){var ye=H[T],Te=H[T+1];ye==="style"?ve(h,Te):ye==="dangerouslySetInnerHTML"?Re(h,Te):ye==="children"?We(h,Te):b(h,ye,Te,oe)}switch(I){case"input":lt(h,v);break;case"textarea":Ee(h,v);break;case"select":var xe=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!v.multiple;var Oe=v.value;Oe!=null?de(h,!!v.multiple,Oe,!1):xe!==!!v.multiple&&(v.defaultValue!=null?de(h,!!v.multiple,v.defaultValue,!0):de(h,!!v.multiple,v.multiple?[]:"",!1))}h[Aa]=v}catch(Ve){Ot(n,n.return,Ve)}}break;case 6:if(ni(i,n),fi(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,v=n.memoizedProps;try{h.nodeValue=v}catch(Ve){Ot(n,n.return,Ve)}}break;case 3:if(ni(i,n),fi(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{ma(i.containerInfo)}catch(Ve){Ot(n,n.return,Ve)}break;case 4:ni(i,n),fi(n);break;case 13:ni(i,n),fi(n),h=n.child,h.flags&8192&&(v=h.memoizedState!==null,h.stateNode.isHidden=v,!v||h.alternate!==null&&h.alternate.memoizedState!==null||(wu=He())),c&4&&ip(n);break;case 22:if(ye=a!==null&&a.memoizedState!==null,n.mode&1?(fn=(oe=fn)||ye,ni(i,n),fn=oe):ni(i,n),fi(n),c&8192){if(oe=n.memoizedState!==null,(n.stateNode.isHidden=oe)&&!ye&&(n.mode&1)!==0)for(ze=n,ye=n.child;ye!==null;){for(Te=ze=ye;ze!==null;){switch(xe=ze,Oe=xe.child,xe.tag){case 0:case 11:case 14:case 15:Oa(4,xe,xe.return);break;case 1:Ts(xe,xe.return);var Be=xe.stateNode;if(typeof Be.componentWillUnmount=="function"){c=xe,a=xe.return;try{i=c,Be.props=i.memoizedProps,Be.state=i.memoizedState,Be.componentWillUnmount()}catch(Ve){Ot(c,a,Ve)}}break;case 5:Ts(xe,xe.return);break;case 22:if(xe.memoizedState!==null){op(Te);continue}}Oe!==null?(Oe.return=xe,ze=Oe):op(Te)}ye=ye.sibling}e:for(ye=null,Te=n;;){if(Te.tag===5){if(ye===null){ye=Te;try{h=Te.stateNode,oe?(v=h.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(I=Te.stateNode,H=Te.memoizedProps.style,T=H!=null&&H.hasOwnProperty("display")?H.display:null,I.style.display=Z("display",T))}catch(Ve){Ot(n,n.return,Ve)}}}else if(Te.tag===6){if(ye===null)try{Te.stateNode.nodeValue=oe?"":Te.memoizedProps}catch(Ve){Ot(n,n.return,Ve)}}else if((Te.tag!==22&&Te.tag!==23||Te.memoizedState===null||Te===n)&&Te.child!==null){Te.child.return=Te,Te=Te.child;continue}if(Te===n)break e;for(;Te.sibling===null;){if(Te.return===null||Te.return===n)break e;ye===Te&&(ye=null),Te=Te.return}ye===Te&&(ye=null),Te.sibling.return=Te.return,Te=Te.sibling}}break;case 19:ni(i,n),fi(n),c&4&&ip(n);break;case 21:break;default:ni(i,n),fi(n)}}function fi(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(ep(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(We(h,""),c.flags&=-33);var v=tp(n);Su(n,v,h);break;case 3:case 4:var T=c.stateNode.containerInfo,I=tp(n);yu(n,I,T);break;default:throw Error(t(161))}}catch(H){Ot(n,n.return,H)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function I_(n,i,a){ze=n,sp(n)}function sp(n,i,a){for(var c=(n.mode&1)!==0;ze!==null;){var h=ze,v=h.child;if(h.tag===22&&c){var T=h.memoizedState!==null||Wo;if(!T){var I=h.alternate,H=I!==null&&I.memoizedState!==null||fn;I=Wo;var oe=fn;if(Wo=T,(fn=H)&&!oe)for(ze=h;ze!==null;)T=ze,H=T.child,T.tag===22&&T.memoizedState!==null?lp(h):H!==null?(H.return=T,ze=H):lp(h);for(;v!==null;)ze=v,sp(v),v=v.sibling;ze=h,Wo=I,fn=oe}ap(n)}else(h.subtreeFlags&8772)!==0&&v!==null?(v.return=h,ze=v):ap(n)}}function ap(n){for(;ze!==null;){var i=ze;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:fn||$o(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!fn)if(a===null)c.componentDidMount();else{var h=i.elementType===i.type?a.memoizedProps:ei(i.type,a.memoizedProps);c.componentDidUpdate(h,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var v=i.updateQueue;v!==null&&oh(i,v,c);break;case 3:var T=i.updateQueue;if(T!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}oh(i,T,a)}break;case 5:var I=i.stateNode;if(a===null&&i.flags&4){a=I;var H=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":H.autoFocus&&a.focus();break;case"img":H.src&&(a.src=H.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var oe=i.alternate;if(oe!==null){var ye=oe.memoizedState;if(ye!==null){var Te=ye.dehydrated;Te!==null&&ma(Te)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}fn||i.flags&512&&xu(i)}catch(xe){Ot(i,i.return,xe)}}if(i===n){ze=null;break}if(a=i.sibling,a!==null){a.return=i.return,ze=a;break}ze=i.return}}function op(n){for(;ze!==null;){var i=ze;if(i===n){ze=null;break}var a=i.sibling;if(a!==null){a.return=i.return,ze=a;break}ze=i.return}}function lp(n){for(;ze!==null;){var i=ze;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{$o(4,i)}catch(H){Ot(i,a,H)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(H){Ot(i,h,H)}}var v=i.return;try{xu(i)}catch(H){Ot(i,v,H)}break;case 5:var T=i.return;try{xu(i)}catch(H){Ot(i,T,H)}}}catch(H){Ot(i,i.return,H)}if(i===n){ze=null;break}var I=i.sibling;if(I!==null){I.return=i.return,ze=I;break}ze=i.return}}var F_=Math.ceil,Xo=D.ReactCurrentDispatcher,Mu=D.ReactCurrentOwner,Wn=D.ReactCurrentBatchConfig,vt=0,en=null,jt=null,on=0,Fn=0,As=Qi(0),Xt=0,ka=null,Ir=0,qo=0,Eu=0,za=null,Tn=null,wu=0,Cs=1/0,Pi=null,Yo=!1,Tu=null,sr=null,Ko=!1,ar=null,Zo=0,Ba=0,Au=null,Jo=-1,Qo=0;function _n(){return(vt&6)!==0?He():Jo!==-1?Jo:Jo=He()}function or(n){return(n.mode&1)===0?1:(vt&2)!==0&&on!==0?on&-on:x_.transition!==null?(Qo===0&&(Qo=ef()),Qo):(n=Et,n!==0||(n=window.event,n=n===void 0?16:uf(n.type)),n)}function ii(n,i,a,c){if(50<Ba)throw Ba=0,Au=null,Error(t(185));ua(n,a,c),((vt&2)===0||n!==en)&&(n===en&&((vt&2)===0&&(qo|=a),Xt===4&&lr(n,on)),An(n,c),a===1&&vt===0&&(i.mode&1)===0&&(Cs=He()+500,Co&&tr()))}function An(n,i){var a=n.callbackNode;ac(n,i);var c=sn(n,n===en?on:0);if(c===0)a!==null&&Xe(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&Xe(a),i===1)n.tag===0?__(up.bind(null,n)):Yf(up.bind(null,n)),p_(function(){(vt&6)===0&&tr()}),a=null;else{switch(tf(c)){case 1:a=Dt;break;case 4:a=Gt;break;case 16:a=Jt;break;case 536870912:a=gt;break;default:a=Jt}a=_p(a,cp.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function cp(n,i){if(Jo=-1,Qo=0,(vt&6)!==0)throw Error(t(327));var a=n.callbackNode;if(bs()&&n.callbackNode!==a)return null;var c=sn(n,n===en?on:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=el(n,c);else{i=c;var h=vt;vt|=2;var v=fp();(en!==n||on!==i)&&(Pi=null,Cs=He()+500,Or(n,i));do try{z_();break}catch(I){dp(n,I)}while(!0);Gc(),Xo.current=v,vt=h,jt!==null?i=0:(en=null,on=0,i=Xt)}if(i!==0){if(i===2&&(h=as(n),h!==0&&(c=h,i=Cu(n,h))),i===1)throw a=ka,Or(n,0),lr(n,c),An(n,He()),a;if(i===6)lr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!O_(h)&&(i=el(n,c),i===2&&(v=as(n),v!==0&&(c=v,i=Cu(n,v))),i===1))throw a=ka,Or(n,0),lr(n,c),An(n,He()),a;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:kr(n,Tn,Pi);break;case 3:if(lr(n,c),(c&130023424)===c&&(i=wu+500-He(),10<i)){if(sn(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){_n(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Dc(kr.bind(null,n,Tn,Pi),i);break}kr(n,Tn,Pi);break;case 4:if(lr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var T=31-Wt(c);v=1<<T,T=i[T],T>h&&(h=T),c&=~v}if(c=h,c=He()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*F_(c/1960))-c,10<c){n.timeoutHandle=Dc(kr.bind(null,n,Tn,Pi),c);break}kr(n,Tn,Pi);break;case 5:kr(n,Tn,Pi);break;default:throw Error(t(329))}}}return An(n,He()),n.callbackNode===a?cp.bind(null,n):null}function Cu(n,i){var a=za;return n.current.memoizedState.isDehydrated&&(Or(n,i).flags|=256),n=el(n,i),n!==2&&(i=Tn,Tn=a,i!==null&&bu(i)),n}function bu(n){Tn===null?Tn=n:Tn.push.apply(Tn,n)}function O_(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var h=a[c],v=h.getSnapshot;h=h.value;try{if(!Jn(v(),h))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function lr(n,i){for(i&=~Eu,i&=~qo,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Wt(i),c=1<<a;n[a]=-1,i&=~c}}function up(n){if((vt&6)!==0)throw Error(t(327));bs();var i=sn(n,0);if((i&1)===0)return An(n,He()),null;var a=el(n,i);if(n.tag!==0&&a===2){var c=as(n);c!==0&&(i=c,a=Cu(n,c))}if(a===1)throw a=ka,Or(n,0),lr(n,i),An(n,He()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,kr(n,Tn,Pi),An(n,He()),null}function Ru(n,i){var a=vt;vt|=1;try{return n(i)}finally{vt=a,vt===0&&(Cs=He()+500,Co&&tr())}}function Fr(n){ar!==null&&ar.tag===0&&(vt&6)===0&&bs();var i=vt;vt|=1;var a=Wn.transition,c=Et;try{if(Wn.transition=null,Et=1,n)return n()}finally{Et=c,Wn.transition=a,vt=i,(vt&6)===0&&tr()}}function Nu(){Fn=As.current,Pt(As)}function Or(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,h_(a)),jt!==null)for(a=jt.return;a!==null;){var c=a;switch(zc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&To();break;case 3:Es(),Pt(Mn),Pt(cn),Jc();break;case 5:Kc(c);break;case 4:Es();break;case 13:Pt(It);break;case 19:Pt(It);break;case 10:Wc(c.type._context);break;case 22:case 23:Nu()}a=a.return}if(en=n,jt=n=cr(n.current,null),on=Fn=i,Xt=0,ka=null,Eu=qo=Ir=0,Tn=za=null,Lr!==null){for(i=0;i<Lr.length;i++)if(a=Lr[i],c=a.interleaved,c!==null){a.interleaved=null;var h=c.next,v=a.pending;if(v!==null){var T=v.next;v.next=h,c.next=T}a.pending=c}Lr=null}return n}function dp(n,i){do{var a=jt;try{if(Gc(),Oo.current=jo,ko){for(var c=Ft.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}ko=!1}if(Ur=0,Qt=$t=Ft=null,La=!1,Da=0,Mu.current=null,a===null||a.return===null){Xt=1,ka=i,jt=null;break}e:{var v=n,T=a.return,I=a,H=i;if(i=on,I.flags|=32768,H!==null&&typeof H=="object"&&typeof H.then=="function"){var oe=H,ye=I,Te=ye.tag;if((ye.mode&1)===0&&(Te===0||Te===11||Te===15)){var xe=ye.alternate;xe?(ye.updateQueue=xe.updateQueue,ye.memoizedState=xe.memoizedState,ye.lanes=xe.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var Oe=Fh(T);if(Oe!==null){Oe.flags&=-257,Oh(Oe,T,I,v,i),Oe.mode&1&&Ih(v,oe,i),i=Oe,H=oe;var Be=i.updateQueue;if(Be===null){var Ve=new Set;Ve.add(H),i.updateQueue=Ve}else Be.add(H);break e}else{if((i&1)===0){Ih(v,oe,i),Pu();break e}H=Error(t(426))}}else if(Ut&&I.mode&1){var zt=Fh(T);if(zt!==null){(zt.flags&65536)===0&&(zt.flags|=256),Oh(zt,T,I,v,i),Hc(ws(H,I));break e}}v=H=ws(H,I),Xt!==4&&(Xt=2),za===null?za=[v]:za.push(v),v=T;do{switch(v.tag){case 3:v.flags|=65536,i&=-i,v.lanes|=i;var Q=Dh(v,H,i);ah(v,Q);break e;case 1:I=H;var V=v.type,ie=v.stateNode;if((v.flags&128)===0&&(typeof V.getDerivedStateFromError=="function"||ie!==null&&typeof ie.componentDidCatch=="function"&&(sr===null||!sr.has(ie)))){v.flags|=65536,i&=-i,v.lanes|=i;var Ce=Uh(v,I,i);ah(v,Ce);break e}}v=v.return}while(v!==null)}pp(a)}catch($e){i=$e,jt===a&&a!==null&&(jt=a=a.return);continue}break}while(!0)}function fp(){var n=Xo.current;return Xo.current=jo,n===null?jo:n}function Pu(){(Xt===0||Xt===3||Xt===2)&&(Xt=4),en===null||(Ir&268435455)===0&&(qo&268435455)===0||lr(en,on)}function el(n,i){var a=vt;vt|=2;var c=fp();(en!==n||on!==i)&&(Pi=null,Or(n,i));do try{k_();break}catch(h){dp(n,h)}while(!0);if(Gc(),vt=a,Xo.current=c,jt!==null)throw Error(t(261));return en=null,on=0,Xt}function k_(){for(;jt!==null;)hp(jt)}function z_(){for(;jt!==null&&!et();)hp(jt)}function hp(n){var i=vp(n.alternate,n,Fn);n.memoizedProps=n.pendingProps,i===null?pp(n):jt=i,Mu.current=null}function pp(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=P_(a,i,Fn),a!==null){jt=a;return}}else{if(a=L_(a,i),a!==null){a.flags&=32767,jt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Xt=6,jt=null;return}}if(i=i.sibling,i!==null){jt=i;return}jt=i=n}while(i!==null);Xt===0&&(Xt=5)}function kr(n,i,a){var c=Et,h=Wn.transition;try{Wn.transition=null,Et=1,B_(n,i,a,c)}finally{Wn.transition=h,Et=c}return null}function B_(n,i,a,c){do bs();while(ar!==null);if((vt&6)!==0)throw Error(t(327));a=n.finishedWork;var h=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=a.lanes|a.childLanes;if(yv(n,v),n===en&&(jt=en=null,on=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Ko||(Ko=!0,_p(Jt,function(){return bs(),null})),v=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||v){v=Wn.transition,Wn.transition=null;var T=Et;Et=1;var I=vt;vt|=4,Mu.current=null,U_(n,a),rp(a,n),a_(Pc),uo=!!Nc,Pc=Nc=null,n.current=a,I_(a),rt(),vt=I,Et=T,Wn.transition=v}else n.current=a;if(Ko&&(Ko=!1,ar=n,Zo=h),v=n.pendingLanes,v===0&&(sr=null),Ct(a.stateNode),An(n,He()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)h=i[a],c(h.value,{componentStack:h.stack,digest:h.digest});if(Yo)throw Yo=!1,n=Tu,Tu=null,n;return(Zo&1)!==0&&n.tag!==0&&bs(),v=n.pendingLanes,(v&1)!==0?n===Au?Ba++:(Ba=0,Au=n):Ba=0,tr(),null}function bs(){if(ar!==null){var n=tf(Zo),i=Wn.transition,a=Et;try{if(Wn.transition=null,Et=16>n?16:n,ar===null)var c=!1;else{if(n=ar,ar=null,Zo=0,(vt&6)!==0)throw Error(t(331));var h=vt;for(vt|=4,ze=n.current;ze!==null;){var v=ze,T=v.child;if((ze.flags&16)!==0){var I=v.deletions;if(I!==null){for(var H=0;H<I.length;H++){var oe=I[H];for(ze=oe;ze!==null;){var ye=ze;switch(ye.tag){case 0:case 11:case 15:Oa(8,ye,v)}var Te=ye.child;if(Te!==null)Te.return=ye,ze=Te;else for(;ze!==null;){ye=ze;var xe=ye.sibling,Oe=ye.return;if(Qh(ye),ye===oe){ze=null;break}if(xe!==null){xe.return=Oe,ze=xe;break}ze=Oe}}}var Be=v.alternate;if(Be!==null){var Ve=Be.child;if(Ve!==null){Be.child=null;do{var zt=Ve.sibling;Ve.sibling=null,Ve=zt}while(Ve!==null)}}ze=v}}if((v.subtreeFlags&2064)!==0&&T!==null)T.return=v,ze=T;else e:for(;ze!==null;){if(v=ze,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:Oa(9,v,v.return)}var Q=v.sibling;if(Q!==null){Q.return=v.return,ze=Q;break e}ze=v.return}}var V=n.current;for(ze=V;ze!==null;){T=ze;var ie=T.child;if((T.subtreeFlags&2064)!==0&&ie!==null)ie.return=T,ze=ie;else e:for(T=V;ze!==null;){if(I=ze,(I.flags&2048)!==0)try{switch(I.tag){case 0:case 11:case 15:$o(9,I)}}catch($e){Ot(I,I.return,$e)}if(I===T){ze=null;break e}var Ce=I.sibling;if(Ce!==null){Ce.return=I.return,ze=Ce;break e}ze=I.return}}if(vt=h,tr(),ln&&typeof ln.onPostCommitFiberRoot=="function")try{ln.onPostCommitFiberRoot(tt,n)}catch{}c=!0}return c}finally{Et=a,Wn.transition=i}}return!1}function mp(n,i,a){i=ws(a,i),i=Dh(n,i,1),n=ir(n,i,1),i=_n(),n!==null&&(ua(n,1,i),An(n,i))}function Ot(n,i,a){if(n.tag===3)mp(n,n,a);else for(;i!==null;){if(i.tag===3){mp(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(sr===null||!sr.has(c))){n=ws(a,n),n=Uh(i,n,1),i=ir(i,n,1),n=_n(),i!==null&&(ua(i,1,n),An(i,n));break}}i=i.return}}function j_(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=_n(),n.pingedLanes|=n.suspendedLanes&a,en===n&&(on&a)===a&&(Xt===4||Xt===3&&(on&130023424)===on&&500>He()-wu?Or(n,0):Eu|=a),An(n,i)}function gp(n,i){i===0&&((n.mode&1)===0?i=1:(i=Ln,Ln<<=1,(Ln&130023424)===0&&(Ln=4194304)));var a=_n();n=bi(n,i),n!==null&&(ua(n,i,a),An(n,a))}function H_(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),gp(n,a)}function V_(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(a=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),gp(n,a)}var vp;vp=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Mn.current)wn=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return wn=!1,N_(n,i,a);wn=(n.flags&131072)!==0}else wn=!1,Ut&&(i.flags&1048576)!==0&&Kf(i,Ro,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Go(n,i),n=i.pendingProps;var h=gs(i,cn.current);Ms(i,a),h=tu(null,i,c,n,h,a);var v=nu();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,En(c)?(v=!0,Ao(i)):v=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,qc(i),h.updater=Ho,i.stateNode=h,h._reactInternals=i,lu(i,c,n,a),i=fu(null,i,c,!0,v,a)):(i.tag=0,Ut&&v&&kc(i),vn(null,i,h,a),i=i.child),i;case 16:c=i.elementType;e:{switch(Go(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=W_(c),n=ei(c,n),h){case 0:i=du(null,i,c,n,a);break e;case 1:i=Vh(null,i,c,n,a);break e;case 11:i=kh(null,i,c,n,a);break e;case 14:i=zh(null,i,c,ei(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),du(n,i,c,h,a);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Vh(n,i,c,h,a);case 3:e:{if(Gh(i),n===null)throw Error(t(387));c=i.pendingProps,v=i.memoizedState,h=v.element,sh(n,i),Io(i,c,null,a);var T=i.memoizedState;if(c=T.element,v.isDehydrated)if(v={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=v,i.memoizedState=v,i.flags&256){h=ws(Error(t(423)),i),i=Wh(n,i,c,a,h);break e}else if(c!==h){h=ws(Error(t(424)),i),i=Wh(n,i,c,a,h);break e}else for(In=Ji(i.stateNode.containerInfo.firstChild),Un=i,Ut=!0,Qn=null,a=ih(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(xs(),c===h){i=Ni(n,i,a);break e}vn(n,i,c,a)}i=i.child}return i;case 5:return lh(i),n===null&&jc(i),c=i.type,h=i.pendingProps,v=n!==null?n.memoizedProps:null,T=h.children,Lc(c,h)?T=null:v!==null&&Lc(c,v)&&(i.flags|=32),Hh(n,i),vn(n,i,T,a),i.child;case 6:return n===null&&jc(i),null;case 13:return $h(n,i,a);case 4:return Yc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ys(i,null,c,a):vn(n,i,c,a),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),kh(n,i,c,h,a);case 7:return vn(n,i,i.pendingProps,a),i.child;case 8:return vn(n,i,i.pendingProps.children,a),i.child;case 12:return vn(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,v=i.memoizedProps,T=h.value,bt(Lo,c._currentValue),c._currentValue=T,v!==null)if(Jn(v.value,T)){if(v.children===h.children&&!Mn.current){i=Ni(n,i,a);break e}}else for(v=i.child,v!==null&&(v.return=i);v!==null;){var I=v.dependencies;if(I!==null){T=v.child;for(var H=I.firstContext;H!==null;){if(H.context===c){if(v.tag===1){H=Ri(-1,a&-a),H.tag=2;var oe=v.updateQueue;if(oe!==null){oe=oe.shared;var ye=oe.pending;ye===null?H.next=H:(H.next=ye.next,ye.next=H),oe.pending=H}}v.lanes|=a,H=v.alternate,H!==null&&(H.lanes|=a),$c(v.return,a,i),I.lanes|=a;break}H=H.next}}else if(v.tag===10)T=v.type===i.type?null:v.child;else if(v.tag===18){if(T=v.return,T===null)throw Error(t(341));T.lanes|=a,I=T.alternate,I!==null&&(I.lanes|=a),$c(T,a,i),T=v.sibling}else T=v.child;if(T!==null)T.return=v;else for(T=v;T!==null;){if(T===i){T=null;break}if(v=T.sibling,v!==null){v.return=T.return,T=v;break}T=T.return}v=T}vn(n,i,h.children,a),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Ms(i,a),h=Vn(h),c=c(h),i.flags|=1,vn(n,i,c,a),i.child;case 14:return c=i.type,h=ei(c,i.pendingProps),h=ei(c.type,h),zh(n,i,c,h,a);case 15:return Bh(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Go(n,i),i.tag=1,En(c)?(n=!0,Ao(i)):n=!1,Ms(i,a),Ph(i,c,h),lu(i,c,h,a),fu(null,i,c,!0,n,a);case 19:return qh(n,i,a);case 22:return jh(n,i,a)}throw Error(t(156,i.tag))};function _p(n,i){return Ge(n,i)}function G_(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function $n(n,i,a,c){return new G_(n,i,a,c)}function Lu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function W_(n){if(typeof n=="function")return Lu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===X)return 11;if(n===ue)return 14}return 2}function cr(n,i){var a=n.alternate;return a===null?(a=$n(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function tl(n,i,a,c,h,v){var T=2;if(c=n,typeof n=="function")Lu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case L:return zr(a.children,h,v,i);case q:T=8,h|=8;break;case N:return n=$n(12,a,i,h|2),n.elementType=N,n.lanes=v,n;case z:return n=$n(13,a,i,h),n.elementType=z,n.lanes=v,n;case ne:return n=$n(19,a,i,h),n.elementType=ne,n.lanes=v,n;case Y:return nl(a,h,v,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case C:T=10;break e;case j:T=9;break e;case X:T=11;break e;case ue:T=14;break e;case G:T=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=$n(T,a,i,h),i.elementType=n,i.type=c,i.lanes=v,i}function zr(n,i,a,c){return n=$n(7,n,c,i),n.lanes=a,n}function nl(n,i,a,c){return n=$n(22,n,c,i),n.elementType=Y,n.lanes=a,n.stateNode={isHidden:!1},n}function Du(n,i,a){return n=$n(6,n,null,i),n.lanes=a,n}function Uu(n,i,a){return i=$n(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function $_(n,i,a,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=oc(0),this.expirationTimes=oc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=oc(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Iu(n,i,a,c,h,v,T,I,H){return n=new $_(n,i,a,I,H),i===1?(i=1,v===!0&&(i|=8)):i=0,v=$n(3,null,null,i),n.current=v,v.stateNode=n,v.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},qc(v),n}function X_(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:U,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function xp(n){if(!n)return er;n=n._reactInternals;e:{if(P(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(En(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(En(a))return Xf(n,a,i)}return i}function yp(n,i,a,c,h,v,T,I,H){return n=Iu(a,c,!0,n,h,v,T,I,H),n.context=xp(null),a=n.current,c=_n(),h=or(a),v=Ri(c,h),v.callback=i??null,ir(a,v,h),n.current.lanes=h,ua(n,h,c),An(n,c),n}function il(n,i,a,c){var h=i.current,v=_n(),T=or(h);return a=xp(a),i.context===null?i.context=a:i.pendingContext=a,i=Ri(v,T),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ir(h,i,T),n!==null&&(ii(n,h,T,v),Uo(n,h,T)),T}function rl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Sp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function Fu(n,i){Sp(n,i),(n=n.alternate)&&Sp(n,i)}function q_(){return null}var Mp=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ou(n){this._internalRoot=n}sl.prototype.render=Ou.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));il(n,i,null,null)},sl.prototype.unmount=Ou.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Fr(function(){il(null,n,null,null)}),i[wi]=null}};function sl(n){this._internalRoot=n}sl.prototype.unstable_scheduleHydration=function(n){if(n){var i=sf();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Yi.length&&i!==0&&i<Yi[a].priority;a++);Yi.splice(a,0,n),a===0&&lf(n)}};function ku(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function al(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Ep(){}function Y_(n,i,a,c,h){if(h){if(typeof c=="function"){var v=c;c=function(){var oe=rl(T);v.call(oe)}}var T=yp(i,c,n,0,null,!1,!1,"",Ep);return n._reactRootContainer=T,n[wi]=T.current,wa(n.nodeType===8?n.parentNode:n),Fr(),T}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var I=c;c=function(){var oe=rl(H);I.call(oe)}}var H=Iu(n,0,!1,null,null,!1,!1,"",Ep);return n._reactRootContainer=H,n[wi]=H.current,wa(n.nodeType===8?n.parentNode:n),Fr(function(){il(i,H,a,c)}),H}function ol(n,i,a,c,h){var v=a._reactRootContainer;if(v){var T=v;if(typeof h=="function"){var I=h;h=function(){var H=rl(T);I.call(H)}}il(i,T,n,h)}else T=Y_(a,i,n,h,c);return rl(T)}nf=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ei(i.pendingLanes);a!==0&&(lc(i,a|1),An(i,He()),(vt&6)===0&&(Cs=He()+500,tr()))}break;case 13:Fr(function(){var c=bi(n,1);if(c!==null){var h=_n();ii(c,n,1,h)}}),Fu(n,1)}},cc=function(n){if(n.tag===13){var i=bi(n,134217728);if(i!==null){var a=_n();ii(i,n,134217728,a)}Fu(n,134217728)}},rf=function(n){if(n.tag===13){var i=or(n),a=bi(n,i);if(a!==null){var c=_n();ii(a,n,i,c)}Fu(n,i)}},sf=function(){return Et},af=function(n,i){var a=Et;try{return Et=n,i()}finally{Et=a}},me=function(n,i,a){switch(i){case"input":if(lt(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var h=wo(c);if(!h)throw Error(t(90));Ye(c),lt(c,h)}}}break;case"textarea":Ee(n,a);break;case"select":i=a.value,i!=null&&de(n,!!a.multiple,i,!1)}},Vt=Ru,yt=Fr;var K_={usingClientEntryPoint:!1,Events:[Ca,ps,wo,wt,Rt,Ru]},ja={findFiberByHostInstance:br,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Z_={bundleType:ja.bundleType,version:ja.version,rendererPackageName:ja.rendererPackageName,rendererConfig:ja.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:D.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=se(n),n===null?null:n.stateNode},findFiberByHostInstance:ja.findFiberByHostInstance||q_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ll=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ll.isDisabled&&ll.supportsFiber)try{tt=ll.inject(Z_),ln=ll}catch{}}return Cn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K_,Cn.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ku(i))throw Error(t(200));return X_(n,i,null,a)},Cn.createRoot=function(n,i){if(!ku(n))throw Error(t(299));var a=!1,c="",h=Mp;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Iu(n,1,!1,null,null,a,!1,c,h),n[wi]=i.current,wa(n.nodeType===8?n.parentNode:n),new Ou(i)},Cn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=se(i),n=n===null?null:n.stateNode,n},Cn.flushSync=function(n){return Fr(n)},Cn.hydrate=function(n,i,a){if(!al(i))throw Error(t(200));return ol(null,n,i,!0,a)},Cn.hydrateRoot=function(n,i,a){if(!ku(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,h=!1,v="",T=Mp;if(a!=null&&(a.unstable_strictMode===!0&&(h=!0),a.identifierPrefix!==void 0&&(v=a.identifierPrefix),a.onRecoverableError!==void 0&&(T=a.onRecoverableError)),i=yp(i,null,n,1,a??null,h,!1,v,T),n[wi]=i.current,wa(n),c)for(n=0;n<c.length;n++)a=c[n],h=a._getVersion,h=h(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,h]:i.mutableSourceEagerHydrationData.push(a,h);return new sl(i)},Cn.render=function(n,i,a){if(!al(i))throw Error(t(200));return ol(null,n,i,!1,a)},Cn.unmountComponentAtNode=function(n){if(!al(n))throw Error(t(40));return n._reactRootContainer?(Fr(function(){ol(null,null,n,!1,function(){n._reactRootContainer=null,n[wi]=null})}),!0):!1},Cn.unstable_batchedUpdates=Ru,Cn.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!al(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ol(n,i,a,!1,c)},Cn.version="18.3.1-next-f1338f8080-20240426",Cn}var Pp;function cx(){if(Pp)return ju.exports;Pp=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),ju.exports=lx(),ju.exports}var Lp;function ux(){if(Lp)return cl;Lp=1;var r=cx();return cl.createRoot=r.createRoot,cl.hydrateRoot=r.hydrateRoot,cl}var dx=ux();const Yl="/api/3dprint";class fx extends Error{constructor(t,s,o){super(t);Ha(this,"status");Ha(this,"code");Ha(this,"date");Ha(this,"reservations");this.status=s,this.code=o==null?void 0:o.code,this.date=o==null?void 0:o.date,this.reservations=o==null?void 0:o.reservations}}async function xt(r,e){const t=await fetch(`${Yl}/${r}`,{credentials:"include",...e,headers:{"Content-Type":"application/json",...e==null?void 0:e.headers}}),s=await t.json().catch(()=>({}));if(!t.ok)throw new fx(s.error||`HTTP ${t.status}`,t.status,s);return s}async function hx(){const r=await fetch("/api/apps/3dprint-management/access",{credentials:"include"});return r.status===401?"login":r.status===403?"denied":r.ok?"ok":"denied"}function Sg(r){return{id:r.id,date:r.date,machine:r.machine,kind:r.kind,start:r.start,end:r.end,title:r.title,file:r.file,fileSize:r.file_size,note:r.note,who:r.who,status:r.status,createdAt:r.created_at,adminNote:r.status_comment??void 0,printer_id:r.printer_id}}async function px(r,e){return{applications:(await xt(`admin/calendar/cancelled-applications?from=${r}&to=${e}`)).applications.map(s=>Sg(s))}}async function mx(r){return xt(`admin/reservations/${r}/restore`,{method:"POST",body:"{}"})}async function gx(r,e){const t=await xt(`calendar/applications?from=${r}&to=${e}`);return{applications:t.applications.map(s=>Sg(s)),staff_dates:t.staff_dates??{}}}async function vx(){return(await xt("admin/members")).members.map(e=>({id:e.id,name:e.name,homeroom:e.homeroom,student_number:e.student_number,color_index:e.color_index,discord_user_id:e.discord_user_id,user_id:e.user_id??null}))}async function Dp(){return xt("admin/session")}async function _x(){return(await xt("admin/management-users")).users}async function xx(r,e){return xt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({user_id:e})})}async function yx(r){return xt("admin/members",{method:"POST",body:JSON.stringify(r)})}async function Sx(r){return xt(`admin/members/${r}`,{method:"DELETE"})}function ul(r){return`${r.member_id}\0${r.date}`}function dl(r){return`${r.printer_id}\0${r.date}`}function Up(r){const e=new Map;for(const t of r){const s=e.get(t.member_id)??[];s.push(t.date),e.set(t.member_id,s)}return e}function Ip(r){const e=new Map;for(const t of r){const s=e.get(t.printer_id)??[];s.push(t.date),e.set(t.printer_id,s)}return e}function Mg(r,e){const t=new Set(r.map(ul)),s=new Set(e.map(ul)),o=e.filter(u=>!t.has(ul(u))),l=r.filter(u=>!s.has(ul(u)));return{added:o,removed:l}}function Eg(r,e){const t=new Set(r.map(dl)),s=new Set(e.map(dl)),o=e.filter(u=>!t.has(dl(u))),l=r.filter(u=>!s.has(dl(u)));return{added:o,removed:l}}function Mx(r,e,t,s){const o=Mg(r,e),l=Eg(t,s);return o.added.length+o.removed.length+l.added.length+l.removed.length>0}async function Ex(r,e,t,s){const o=Mg(r,e),l=Eg(t,s);for(const[u,f]of Up(o.removed))await Op(u,f,!1);for(const[u,f]of Ip(l.removed))await kp(u,f,!1);for(const[u,f]of Up(o.added))await Op(u,f,!0);for(const[u,f]of Ip(l.added))await kp(u,f,!0)}async function Fp(r,e){return xt(`admin/shifts?year=${r}&month=${e}`)}async function Op(r,e,t){return xt("admin/shifts/availability",{method:"PUT",body:JSON.stringify({member_id:r,dates:e,available:t})})}async function wx(r,e){return xt(`admin/reservations/${r}/accept`,{method:"POST",body:JSON.stringify({print_staff_member_id:e})})}async function Td(r,e){return xt(`admin/reservations/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Tx(){return xt("admin/calendar/status")}function Ax(r){return`${Yl}/admin/stl/${r}`}async function Cx(){return(await xt("admin/reservations")).reservations}async function bx(){return xt("admin/printers")}async function zd(r,e,t="POST"){const s=await fetch(`${Yl}/${r}`,{method:t,credentials:"include",body:e}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error||`HTTP ${s.status}`);return o}async function Rx(r,e){const t=new FormData;return t.append("name",r),e&&t.append("image",e),zd("admin/printers",t)}async function Nx(r,e){return xt(`admin/printers/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Px(r,e){const t=new FormData;return t.append("image",e),zd(`admin/printers/${r}/image`,t,"PUT")}async function Lx(r){return xt(`admin/printers/${r}`,{method:"DELETE"})}async function kp(r,e,t){return xt("admin/shifts/printer-availability",{method:"PUT",body:JSON.stringify({printer_id:r,dates:e,available:t})})}async function Dx(r,e,t=!1){return xt(`admin/reservations/${r}/reschedule`,{method:"PATCH",body:JSON.stringify({desired_date:e,force:t})})}async function Ux(r,e){return xt(`admin/applications/${r}/split-slots`,{method:"POST",body:JSON.stringify(e)})}async function Ix(){return xt("admin/integrations/status")}async function Fx(){return xt("admin/integrations/discord/test",{method:"POST",body:"{}"})}async function Ox(r){const e=r.map(t=>t.trim()).filter(Boolean);if(!e.length)throw new Error("メンションする担当者を1人以上選んでください");return xt("admin/integrations/discord/test-mention",{method:"POST",body:JSON.stringify({member_ids:e})})}async function kx(r){const e=r.trim();if(!e)throw new Error("送信先メールアドレスを入力してください");return xt("admin/settings/test-email",{method:"POST",body:JSON.stringify({to:e})})}async function zx(r){return xt("admin/log",{method:"POST",body:JSON.stringify(r)})}async function Bx(r=100){return xt(`admin/log?limit=${r}`)}async function jx(r){return xt(`admin/settings/storage-list?path=${encodeURIComponent(r)}`)}async function Hx(r,e){return xt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({color_index:e})})}async function Vx(r,e){return xt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({discord_user_id:e})})}async function Gx(){return xt("admin/settings/print-video")}async function Wx(r){return xt("admin/settings/print-video",{method:"PATCH",body:JSON.stringify({storage_path:r})})}async function $x(r,e){const t=new FormData;return t.append("video",e),zd(`admin/reservations/${r}/print-video`,t)}async function Xx(r){return xt(`admin/reservations/${r}/print-video`,{method:"DELETE"})}function qx(r){return`${Yl}/admin/reservations/${r}/print-video/download`}function wg({testId:r,variant:e="page"}){const t=e==="inline"?"print3d-loading print3d-loading--inline":"print3d-loading";return d.jsx("div",{className:t,"data-testid":r,role:"status","aria-live":"polite","aria-label":"読み込み中",children:d.jsx("div",{className:"print3d-loading-spinner","aria-hidden":!0})})}const Tg=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC"}],Ja=Tg.map(r=>r.id),xi={};Tg.forEach(r=>{xi[r.id]=r});const wr=["日","月","火","水","木","金","土"],Bd=360,Js=30,zp=28,Ag=990,Yx=1200,Bp=(Ag-Bd)/Js,Kx=7,Qs={pending:"申請中",approved:"確定",done:"完了",cancelled:"取り消し"},yi={request:"依頼",reserve:"予約"},jp=[{id:"machine",label:"機材の不調",body:"プリンターの不調により、この時間帯の印刷を中止しました。"},{id:"maintenance",label:"メンテナンス",body:"メンテナンスのため、この時間帯の受付を停止しました。"},{id:"duplicate",label:"重複申請",body:"同じ時間帯に別の申請が確定しているため、こちらを取り消しました。"},{id:"no_show",label:"連絡なしの未実施",body:"開始時刻を過ぎても実施が確認できなかったため取り消しました。"}],Hp=[{id:"stl",label:"STLの不備",body:"STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。"},{id:"size",label:"サイズ超過",body:"造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。"},{id:"deadline",label:"締切超過",body:"印刷依頼の受付は前日までです。当日の依頼は受け付けられません。"},{id:"time",label:"時間不足",body:"この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。"}],Zx=["16:20までに物理実験室へ来てください。","フィラメントは白PLAを使用します。","サポート材を付けています。剥がす作業もお願いします。"],yn=r=>String(r).padStart(2,"0"),Yn=r=>r.getFullYear()+"-"+yn(r.getMonth()+1)+"-"+yn(r.getDate()),zn=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},kl=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},zl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},Cg=r=>kl(zl(r),-r.getDay()),Vp=r=>r.getMonth()+1+"/"+r.getDate(),li=Yn(zl(new Date)),Jx=()=>zn(li),Ad=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()},bg=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()+"（"+wr[e.getDay()]+"）"},Qa=r=>Bd+r*Js,qt=r=>yn(Math.floor(r/60))+":"+yn(r%60),Kl=r=>{const e=Math.floor(r/60),t=r%60;return e&&t?e+"時間"+t+"分":e?e+"時間":t+"分"},Gp=r=>Math.round((r-Bd)/Js),mn=r=>r.kind==="request"?{start:Ag,end:Yx,s:Bp,e:Bp+Kx}:{start:r.start,end:r.end,s:Gp(r.start),e:Gp(r.end)},Wp=(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+"0"+t);return r})(),ji=r=>r?String(r).slice(0,1)+"年"+String(r).slice(1)+"HR":"—",Kr=["#f38020","#3b74e0","#1f9d55","#9a4a07","#7c5cbf","#b4776b","#2f8f8f"],Rg=[{id:"m1",name:"金田",hr:"203",num:12,discord:"",color:"#f38020"},{id:"m2",name:"田村",hr:"201",num:3,discord:"",color:"#3b74e0"},{id:"m3",name:"藤原",hr:"104",num:21,discord:"",color:"#1f9d55"}];let Zl=Rg.slice();const Qx=r=>{Zl=(r&&r.length?r:Rg).slice()},e0=()=>Zl,Qr=r=>Zl.find(e=>e.id===r)||null,jd=r=>{const e=Qr(r);return e?e.name:null},t0=r=>{const e=Qr(r);return e?e.color:"var(--color-text-faint)"},n0=r=>{const e=Qr(r);return e?`${e.name}（${ji(e.hr)}・${e.num}番）`:"—"};let Ng={};const fl=r=>{Ng=r||{}},Ya=(r,e)=>(Ng[r]||[]).indexOf(e)>=0,to=r=>Zl.filter(e=>Ya(e.id,r)).map(e=>e.id),Pg=r=>to(r).map(e=>jd(e)),i0=r=>r.filter(e=>e.status==="pending").sort((e,t)=>(e.date+yn(Math.floor(mn(e).start/60))).localeCompare(t.date+yn(Math.floor(mn(t).start/60)))),r0=r=>r.kind==="request"&&r.date<=li,s0=r=>r==="pending"||r==="approved";function a0(r,e){const t=r.filter(o=>o.date===e),s={};return Ja.forEach(o=>{const l=new Array(zp).fill(null);t.filter(u=>u.machine===o&&s0(u.status)).forEach(u=>{const f=mn(u);for(let m=Math.max(0,f.s);m<Math.min(zp,f.e);m++)l[m]=u}),s[o]=l}),{list:t,machines:s}}function Lg(r,e){const t=r.filter(o=>o.date===e),s=t.filter(o=>o.status!=="cancelled");return{all:t,live:s,requests:s.filter(o=>o.kind==="request"),reserves:s.filter(o=>o.kind==="reserve"),pending:s.filter(o=>o.status==="pending").length,cancelled:t.filter(o=>o.status==="cancelled")}}function Dg(r,e,t,s){const o=mn(e),l=a0(r,t),u=l.machines[e.machine];let f=0;for(let g=o.s;g<o.e;g++){const x=u[g];x&&x.id!==e.id&&f++}const m=o.e-o.s,p=to(t);return{date:t,total:m,used:f,free:m-f,full:f>=m,staffs:p,noStaff:p.length===0,past:t<li,sameDay:t===e.date,liveCount:l.list.filter(g=>g.status!=="cancelled").length}}function o0(r,e){const s=new Date(r,e-1,1).getDay(),o=new Date(r,e,0).getDate(),l=[];for(let u=0;u<s;u++)l.push(null);for(let u=1;u<=o;u++)l.push(new Date(r,e-1,u));for(;l.length%7!==0;)l.push(null);return l}function Hd(r){const e=mn(r),t=[];for(let s=e.s;s<e.e;s++)t.push(s);return t}function Vd(r,e){try{const t=localStorage.getItem(r);return t?JSON.parse(t):e}catch{return e}}function Gd(r,e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}const ra={prefs:"sh3dm.prefs.v1",log:"sh3dm.log.v1",integ:"sh3dm.integrations.v1"},Ug=()=>Vd(ra.prefs,{}),l0=r=>Gd(ra.prefs,Object.assign(Ug(),r)),c0=()=>Vd(ra.log,[]),u0=r=>Gd(ra.log,r),hl={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,cancelled:!0},dailyMention:!0},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}},d0=()=>{const r=Vd(ra.integ,null);return r?{discord:{...hl.discord,...r.discord||{},events:{...hl.discord.events,...(r.discord||{}).events||{}}},gcal:{...hl.gcal,...r.gcal||{}}}:JSON.parse(JSON.stringify(hl))},f0=r=>Gd(ra.integ,r),Bl=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE",hint:"小物・精度重視"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC",hint:"大型・タイムラプス"}];Bl.map(r=>r.id);const h0=Object.fromEntries(Bl.map(r=>[r.id,r])),Ig=["日","月","火","水","木","金","土"],Wd=360,$d=30,Fg=990,Og=1200,p0=(Fg-Wd)/$d,m0=(Og-Wd)/$d,g0={pending:"申請中",approved:"確定",rejected:"却下",done:"完了"},v0={request:"依頼",reserve:"予約"},es=r=>String(r).padStart(2,"0"),Cd=r=>r.getFullYear()+"-"+es(r.getMonth()+1)+"-"+es(r.getDate()),ts=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},kg=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},jl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},_0=r=>kg(jl(r),-r.getDay()),$p=r=>es(Math.floor(r/60))+":"+es(r%60),Xp=r=>Math.round((r-Wd)/$d),x0=r=>r.kind==="request"?{start:Fg,end:Og,s:p0,e:m0}:{start:r.start,end:r.end,s:Xp(r.start),e:Xp(r.end)};(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+es(t));return r})();const y0=Cd(jl(new Date)),S0=()=>ts(y0),zg=r=>{const e=ts(r);return e.getMonth()+1+"/"+e.getDate()},pl=r=>{const e=ts(r);return zg(r)+"（"+Ig[e.getDay()]+"）"};function M0(r,e){var t;return e?((t=r.find(s=>s.id===e))==null?void 0:t.name)??null:null}function E0(r,e,t,s,o){const l=r.filter(p=>p.date>=e&&p.date<=t).sort((p,g)=>(p.date+String(p.start)).localeCompare(g.date+String(g.start))),u=["日付","曜日","開始","終了","機種","種別","作品名","申請者","学年HR","番号","状態","印刷データ","サイズ(MB)","備考","担当"],f=p=>{const g=String(p??"");return/[",\n]/.test(g)?'"'+g.replace(/"/g,'""')+'"':g},m=[u.join(",")];return l.forEach(p=>{const g=x0(p),x=ts(p.date),_=o[p.date];m.push([p.date,Ig[x.getDay()],$p(g.start),$p(g.end),h0[p.machine].name,v0[p.kind],p.title,p.who.name,p.who.hr,p.who.num,g0[p.status],p.file,p.fileSize?(p.fileSize/1048576).toFixed(2):"",p.note,_&&M0(s,_)||""].map(f).join(","))}),"\uFEFF"+m.join(`\r
`)}const w0={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,rejected:!0},mention:""},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}};function T0(r){return r.map(e=>({id:e.id,name:e.name,hr:e.homeroom??"",num:e.student_number??0,discord:e.discord_user_id??"",color:Kr[(e.color_index??0)%Kr.length],userId:e.user_id??null}))}function A0(r){const e=Kr.indexOf(r);return e>=0?e:0}function C0(r){return r==="rejected"?"cancelled":r}function b0(r){switch(r){case"pending":return"applied";case"approved":return"accepted";case"done":return"delivered";case"cancelled":return"cancelled";default:return"applied"}}function qp(r){return{...r,status:C0(r.status)}}function R0(r){const e=Cd(_0(ts(r))),t=Cd(kg(ts(e),27));return{from:e,to:t}}function Bg(r){const e={};for(const t of r)e[t.member_id]||(e[t.member_id]=[]),e[t.member_id].push(t.date);for(const t of Object.keys(e))e[t].sort();return e}function $s(r){const e=[];for(const[t,s]of Object.entries(r))for(const o of s)e.push({member_id:t,date:o});return e}function Yp(r,e,t){const s=ts(r);return s.getFullYear()===e&&s.getMonth()+1===t}function N0(r,e){const t=new Date(r,e,0).getDate(),s=[];for(let o=1;o<=t;o++)s.push(`${r}-${String(e).padStart(2,"0")}-${String(o).padStart(2,"0")}`);return s}function P0(r,e,t,s,o){const l=Bg(t),u=new Set([...Object.keys(r),...Object.keys(e),...Object.keys(l)]),f=N0(s,o),m={},p={};for(const g of u){const x=new Set(r[g]||[]),_=new Set(e[g]||[]),M=new Set(l[g]||[]),w=new Set([...x].filter(S=>!Yp(S,s,o))),E=new Set([..._].filter(S=>!Yp(S,s,o)));for(const S of f)_.has(S)!==x.has(S)?(x.has(S)&&w.add(S),_.has(S)&&E.add(S)):M.has(S)&&(w.add(S),E.add(S));m[g]=[...w].sort(),p[g]=[...E].sort()}return{avail:m,saved:p}}function L0(r,e){const t=$s(r),s=$s(e),o=new Set(t.map(m=>`${m.member_id}\0${m.date}`)),l=new Set(s.map(m=>`${m.member_id}\0${m.date}`)),u=s.filter(m=>!o.has(`${m.member_id}\0${m.date}`)),f=t.filter(m=>!l.has(`${m.member_id}\0${m.date}`));return{addedSlots:u.length,removedSlots:f.length,addedDates:new Set(u.map(m=>m.date)).size,removedDates:new Set(f.map(m=>m.date)).size}}function D0(r,e){return e&&r.some(t=>t.id===e)?e:null}function U0(r){return r.linked_member?`${r.user.display_name}（印刷担当: ${r.linked_member.name}）`:r.user.display_name}function I0(){return JSON.parse(JSON.stringify(w0))}function F0(r,e,t,s){const o=r.map(l=>({...l,status:l.status==="cancelled"?"rejected":l.status}));return E0(o,e,t,s)}function Xd(){const[r,e]=Se.useState(null),t=Se.useCallback((o,l)=>{o<0?e("prev"):o>0?e("next"):e(null),l()},[]),s=r==="prev"?"cal-period-enter cal-period-enter--prev":r==="next"?"cal-period-enter cal-period-enter--next":"cal-period-enter";return Se.useEffect(()=>{if(!r)return;const o=window.setTimeout(()=>e(null),360);return()=>window.clearTimeout(o)},[r]),{run:t,enterClass:s,dir:r}}const jg="/apps/3dprint-management/assets/icon-192.png",O0=r=>r==="ke"?"var(--color-primary)":"var(--color-tip)";function k0({id:r,size:e}){return d.jsx("span",{className:"dot",style:{background:O0(r),width:e||6,height:e||6}})}function qs({kind:r,size:e}){return d.jsxs("span",{className:"kbadge "+r+(e==="sm"?" sm":""),children:[d.jsx("span",{className:"kmark"}),yi[r]]})}function Gu(){return d.jsx("span",{"aria-hidden":"true",className:"dlic",children:"↓"})}function z0(r,e){const t=mn(r);if(e==="file"){const l=r.file||`${r.title}.stl`,u=["ScienceHUB 3Dプリント — 印刷データ","",`ファイル名: ${l}`,`作品名: ${r.title}`,`申請者: ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`機種: ${xi[r.machine].name}`,`種別: ${yi[r.kind]}`,`日付: ${r.date}`,`時間: ${qt(t.start)}〜${qt(t.end)}`,`サイズ: ${r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":"—"}`,"","※ このファイルはデザイン確認用のプレースホルダです。本番では署名付きURLから取得します。"].join(`\r
`);bd(l.replace(/\.[^.]+$/,"")+".txt",u);return}const s=["ScienceHUB 3Dプリント 申請書","=============================",`作品名      : ${r.title}`,`日付        : ${r.date}（${wr[zn(r.date).getDay()]}）`,`時間        : ${qt(t.start)}〜${qt(t.end)}（${Kl(t.end-t.start)}）`,`機種        : ${xi[r.machine].name}（${xi[r.machine].maker}）`,`種別        : ${yi[r.kind]}${r.kind==="request"?"（依頼枠を丸ごと占有）":"（データ提出なし）"}`,`状態        : ${Qs[r.status]}`,`担当        : ${Pg(r.date).join(" / ")||"休み"}`,`申請者      : ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`印刷データ  : ${r.file||"—"}${r.fileSize?"（"+(r.fileSize/1048576).toFixed(2)+" MB）":""}`,`備考        : ${r.note||"—"}`,`担当者メモ  : ${r.adminNote||"—"}`,"","出力: ScienceHUB 3Dプリント管理"],o=`${r.date}_${r.title.split(/[\\/:*?"<>|]/).join("_")}.txt`;bd(o,s.join(`\r
`))}function bd(r,e){const t=new Blob(["\uFEFF"+e],{type:"text/plain;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a");o.href=s,o.download=r,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function B0(r,e){const t=r.filter(l=>l.date===e).sort((l,u)=>mn(l).start-mn(u).start||Ja.indexOf(l.machine)-Ja.indexOf(u.machine)),s=Pg(e).join(" / ")||"休み",o=[`ScienceHUB 3Dプリント 申請一覧 — ${e}（${wr[zn(e).getDay()]}）`,`担当: ${s}`,`件数: ${t.length}`,"=".repeat(48)];return t.forEach((l,u)=>{const f=mn(l);o.push("",`[${u+1}] ${l.title}`,`  時間   : ${qt(f.start)}〜${qt(f.end)}（${Kl(f.end-f.start)}）`,`  機種   : ${xi[l.machine].name}`,`  種別   : ${yi[l.kind]}`,`  状態   : ${Qs[l.status]}`,`  申請者 : ${l.who.name}（${ji(l.who.hr)}・${l.who.num}番）`,`  データ : ${l.file||"—"}`,`  備考   : ${l.note||"—"}`)}),bd(`${e}_申請一覧.txt`,o.join(`\r
`)),t.length}function Rd({status:r}){return d.jsx("span",{className:"tag "+r,children:Qs[r]})}function Hl({tone:r,children:e}){return d.jsx("span",{className:"chip"+(r?" "+r:""),children:e})}function j0({id:r,small:e}){const t=Qr(r);return t?d.jsxs("span",{className:"mtag"+(e?" sm":""),children:[d.jsx("span",{className:"mtag-av",style:{background:t.color},children:t.name.slice(0,1)}),t.name]}):d.jsx("span",{className:"mtag none",children:"休み"})}function H0(r){if(!r)return"—";const e=new Date(r),t=zl(Jx()),s=Math.round((t-zl(e))/864e5),o=yn(e.getHours())+":"+yn(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}const V0=r=>{const e=new Date(r);return yn(e.getHours())+":"+yn(e.getMinutes())};function G0({screen:r,setScreen:e,operatorSession:t,pendingCount:s,onCsv:o}){return d.jsx("header",{className:"site-header",children:d.jsxs("div",{className:"header-inner",children:[d.jsxs("a",{className:"brand",href:"/",children:[d.jsx("img",{src:jg,alt:""}),"ScienceHUB",d.jsx("span",{className:"sep"}),d.jsx("span",{className:"crumb",children:"3Dプリント管理"})]}),d.jsx("span",{className:"adm-pill",children:"管理者"}),d.jsxs("nav",{className:"screens","aria-label":"画面",children:[d.jsxs("button",{type:"button","aria-current":r==="reserve"?"page":void 0,className:r==="reserve"?"on":"",onClick:()=>e("reserve"),children:["申請の管理",s>0&&d.jsx("span",{className:"nav-count num",children:s})]}),d.jsx("button",{type:"button","aria-current":r==="settings"?"page":void 0,className:r==="settings"?"on":"",onClick:()=>e("settings"),children:"シフト・設定"}),d.jsx("button",{type:"button","aria-current":r==="ops"?"page":void 0,className:r==="ops"?"on":"",onClick:()=>e("ops"),children:"運用"})]}),d.jsxs("div",{className:"hdr-right",children:[d.jsxs("div",{className:"actor actor-readonly",title:(t==null?void 0:t.user.username)??"",children:[d.jsx("span",{children:"ログイン"}),d.jsx("strong",{children:(t==null?void 0:t.user.display_name)??"—"}),t!=null&&t.linked_member?d.jsxs("span",{className:"actor-staff",children:["／印刷担当 ",t.linked_member.name]}):d.jsx("span",{className:"actor-staff actor-staff-warn",children:"／印刷担当未紐づけ"})]}),r==="reserve"&&d.jsx("button",{type:"button",className:"hdr-link",onClick:o,children:"CSV出力"}),d.jsx("a",{className:"hdr-link",href:"/apps/3dprint-reservation/",children:"申請フォーム"})]})]})})}function W0(r,e){const t=Lg(r,e);return{req:t.requests.length,res:t.reserves.length,pending:t.pending}}function $0({d:r,ds:e,apps:t,staffIds:s,selected:o,onPick:l,dense:u}){const f=r.getDay(),m=W0(t,e),p=["day"];return f===0&&p.push("sun"),f===6&&p.push("sat"),e===li&&p.push("today"),e===o&&p.push("sel"),s.length||p.push("closed"),d.jsxs("button",{type:"button",className:p.join(" "),onClick:()=>l(e),"aria-pressed":e===o,"aria-label":`${r.getMonth()+1}月${r.getDate()}日 依頼${m.req}件 予約${m.res}件 ${s.length?"担当あり":"担当なし"}`,children:[d.jsxs("span",{className:"d-top",children:[d.jsx("span",{className:"d num",children:r.getDate()}),d.jsx("span",{className:"d-staffflag"+(s.length?" on":""),children:s.length?"担当あり":"休み"})]}),d.jsxs("span",{className:"c-kinds",children:[d.jsxs("span",{className:"c-k req"+(m.req?"":" zero"),children:[d.jsx("i",{}),"依頼",d.jsx("b",{className:"num",children:m.req})]}),d.jsxs("span",{className:"c-k res"+(m.res?"":" zero"),children:[d.jsx("i",{}),"予約",d.jsx("b",{className:"num",children:m.res})]})]}),d.jsx("span",{className:"c-pend",children:m.pending>0?d.jsxs("span",{className:"pend num",children:["申請中 ",m.pending]}):null})]})}function X0({apps:r,avail:e,selected:t,onPick:s}){const{run:o,enterClass:l}=Xd(),u=Cg(zn(t)),f=Yn(u),m=[];for(let E=0;E<4;E++){const S=[];for(let y=0;y<7;y++)S.push(kl(u,E*7+y));m.push(S)}const p=m.flat(),g=p[p.length-1],_=p[0].getMonth()===g.getMonth()?`${p[0].getFullYear()}年 ${yn(p[0].getMonth()+1)}月`:`${yn(p[0].getMonth()+1)}月 → ${yn(g.getMonth()+1)}月`,M=p.map(Yn);r.filter(E=>M.indexOf(E.date)>=0&&E.status!=="cancelled");const w=E=>o(E,()=>s(Yn(kl(zn(t),E*28))));return d.jsxs("div",{className:"card cal-card",children:[d.jsxs("div",{className:"cal-head",children:[d.jsx("div",{className:l,children:d.jsx("div",{className:"cal-month",children:d.jsx("span",{children:_})})},`label-${f}`),d.jsx("div",{className:"cal-nav",children:d.jsx("button",{type:"button",className:"cal-today",onClick:()=>s(li),children:"今日"})})]}),d.jsxs("div",{className:"cal-body",children:[d.jsxs("button",{type:"button",className:"cal-side prev",onClick:()=>w(-1),"aria-label":"前の4週間",children:[d.jsx("span",{"aria-hidden":"true",children:"‹"}),d.jsx("span",{className:"cal-side-lbl",children:"前へ"})]}),d.jsx("div",{className:"cal-main",children:d.jsx("div",{className:"cal-period-shell",children:d.jsxs("div",{className:l,children:[d.jsx("div",{className:"cal-wds",children:wr.map((E,S)=>d.jsx("div",{className:"cal-wd"+(S===0?" sun":S===6?" sat":""),children:E},E))}),d.jsx("div",{className:"cal-grid",children:m.map(E=>E.map(S=>{const y=Yn(S);return d.jsx($0,{d:S,ds:y,apps:r,staffIds:to(y),selected:y===t,onPick:s},y)}))})]},f)})}),d.jsxs("button",{type:"button",className:"cal-side next",onClick:()=>w(1),"aria-label":"次の4週間",children:[d.jsx("span",{"aria-hidden":"true",children:"›"}),d.jsx("span",{className:"cal-side-lbl",children:"次へ"})]})]}),d.jsxs("div",{className:"cal-legend",children:[d.jsx("span",{className:"lg",children:d.jsx(qs,{kind:"request",size:"sm"})}),d.jsx("span",{className:"lg",children:"STLを提出して印刷枠を使う"}),d.jsx("span",{className:"lg",children:d.jsx(qs,{kind:"reserve",size:"sm"})}),d.jsx("span",{className:"lg",children:"プリンターの時間だけ確保"}),d.jsx("span",{className:"lg lg-right",children:"日付をクリックすると、その日の申請が右に出ます"})]})]})}function q0({open:r,title:e,sub:t,onClose:s,children:o,footer:l}){return Se.useEffect(()=>{if(!r)return;const u=f=>{f.key==="Escape"&&s()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[r,s]),d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),d.jsxs("aside",{className:"sheet"+(r?" on":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[d.jsxs("div",{className:"sheet-h",children:[d.jsxs("div",{style:{minWidth:0},children:[d.jsx("h2",{children:e}),t&&d.jsx("p",{children:t})]}),d.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),d.jsx("div",{className:"sheet-b",children:r?o:null}),l&&d.jsx("div",{className:"sheet-f",children:l})]})]})}function Y0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:u}){return Se.useEffect(()=>{if(!r)return;const f=m=>{m.key==="Escape"&&s()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[r,s]),r?d.jsxs("div",{className:"modal-wrap",role:"dialog","aria-modal":"true","aria-label":e,children:[d.jsx("div",{className:"modal-scrim",onClick:s}),d.jsxs("div",{className:"modal"+(u?" wide":""),children:[d.jsxs("div",{className:"modal-h",children:[d.jsxs("div",{children:[d.jsx("h2",{children:e}),t&&d.jsx("p",{children:t})]}),d.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),d.jsx("div",{className:"modal-b",children:o}),l&&d.jsx("div",{className:"modal-f",children:l})]})]}):null}function K0({toast:r}){return d.jsx("div",{className:"toast"+(r?" show":""),role:"status","aria-live":"polite",children:r&&d.jsxs(d.Fragment,{children:[r.text,r.mark&&d.jsx("b",{children:r.mark})]})})}function Z0(r){if(!r)return"—";const e=new Date(r),t=jl(S0()),s=Math.round((t-jl(e))/864e5),o=es(e.getHours())+":"+es(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}function J0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:u,tabs:f}){return Se.useEffect(()=>{if(!r)return;const m=p=>{p.key==="Escape"&&s()};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[r,s]),d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),d.jsxs("aside",{className:"sheet"+(r?" on":"")+(u?" wide":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[d.jsxs("div",{className:"sheet-h",children:[d.jsxs("div",{style:{minWidth:0},children:[d.jsx("h2",{children:e}),t&&d.jsx("p",{children:t})]}),d.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),f,d.jsx("div",{className:"sheet-b",children:r?o:null}),l&&d.jsx("div",{className:"sheet-f",children:l})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qd="164",Q0=0,Kp=1,ey=2,Hg=1,ty=2,ki=3,Sr=0,Nn=1,mi=2,xr=0,Ys=1,Zp=2,Jp=3,Qp=4,ny=5,qr=100,iy=101,ry=102,sy=103,ay=104,oy=200,ly=201,cy=202,uy=203,Nd=204,Pd=205,dy=206,fy=207,hy=208,py=209,my=210,gy=211,vy=212,_y=213,xy=214,yy=0,Sy=1,My=2,Vl=3,Ey=4,wy=5,Ty=6,Ay=7,Vg=0,Cy=1,by=2,yr=0,Ry=1,Ny=2,Py=3,Ly=4,Dy=5,Uy=6,Iy=7,Gg=300,ea=301,ta=302,Ld=303,Dd=304,Jl=306,Ud=1e3,Zr=1001,Id=1002,Kn=1003,Fy=1004,ml=1005,oi=1006,Wu=1007,Jr=1008,Mr=1009,Oy=1010,ky=1011,Wg=1012,$g=1013,na=1014,_r=1015,Ql=1016,Xg=1017,qg=1018,no=1020,zy=35902,By=1021,jy=1022,vi=1023,Hy=1024,Vy=1025,Ks=1026,eo=1027,Gy=1028,Yg=1029,Wy=1030,Kg=1031,Zg=1033,$u=33776,Xu=33777,qu=33778,Yu=33779,em=35840,tm=35841,nm=35842,im=35843,rm=36196,sm=37492,am=37496,om=37808,lm=37809,cm=37810,um=37811,dm=37812,fm=37813,hm=37814,pm=37815,mm=37816,gm=37817,vm=37818,_m=37819,xm=37820,ym=37821,Ku=36492,Sm=36494,Mm=36495,$y=36283,Em=36284,wm=36285,Tm=36286,Xy=3200,qy=3201,Jg=0,Yy=1,vr="",hi="srgb",Tr="srgb-linear",Yd="display-p3",ec="display-p3-linear",Gl="linear",Lt="srgb",Wl="rec709",$l="p3",Rs=7680,Am=519,Ky=512,Zy=513,Jy=514,Qg=515,Qy=516,eS=517,tS=518,nS=519,Cm=35044,bm="300 es",zi=2e3,Xl=2001;class sa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(t)===-1&&s[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const o=s.slice(0);for(let l=0,u=o.length;l<u;l++)o[l].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zu=Math.PI/180,Fd=180/Math.PI;function io(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(hn[r&255]+hn[r>>8&255]+hn[r>>16&255]+hn[r>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[s&255]+hn[s>>8&255]+hn[s>>16&255]+hn[s>>24&255]).toLowerCase()}function Rn(r,e,t){return Math.max(e,Math.min(t,r))}function iS(r,e){return(r%e+e)%e}function Ju(r,e,t){return(1-t)*r+t*e}function Ga(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function bn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class _t{constructor(e=0,t=0){_t.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,s=this.y,o=e.elements;return this.x=o[0]*t+o[3]*s+o[6],this.y=o[1]*t+o[4]*s+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(Rn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y;return t*t+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const s=Math.cos(t),o=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*s-u*o+e.x,this.y=l*o+u*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class dt{constructor(e,t,s,o,l,u,f,m,p){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,u,f,m,p)}set(e,t,s,o,l,u,f,m,p){const g=this.elements;return g[0]=e,g[1]=o,g[2]=f,g[3]=t,g[4]=l,g[5]=m,g[6]=s,g[7]=u,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],this}extractBasis(e,t,s){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,u=s[0],f=s[3],m=s[6],p=s[1],g=s[4],x=s[7],_=s[2],M=s[5],w=s[8],E=o[0],S=o[3],y=o[6],A=o[1],b=o[4],D=o[7],$=o[2],U=o[5],L=o[8];return l[0]=u*E+f*A+m*$,l[3]=u*S+f*b+m*U,l[6]=u*y+f*D+m*L,l[1]=p*E+g*A+x*$,l[4]=p*S+g*b+x*U,l[7]=p*y+g*D+x*L,l[2]=_*E+M*A+w*$,l[5]=_*S+M*b+w*U,l[8]=_*y+M*D+w*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],f=e[5],m=e[6],p=e[7],g=e[8];return t*u*g-t*f*p-s*l*g+s*f*m+o*l*p-o*u*m}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],f=e[5],m=e[6],p=e[7],g=e[8],x=g*u-f*p,_=f*m-g*l,M=p*l-u*m,w=t*x+s*_+o*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/w;return e[0]=x*E,e[1]=(o*p-g*s)*E,e[2]=(f*s-o*u)*E,e[3]=_*E,e[4]=(g*t-o*m)*E,e[5]=(o*l-f*t)*E,e[6]=M*E,e[7]=(s*m-p*t)*E,e[8]=(u*t-s*l)*E,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,s,o,l,u,f){const m=Math.cos(l),p=Math.sin(l);return this.set(s*m,s*p,-s*(m*u+p*f)+u+e,-o*p,o*m,-o*(-p*u+m*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(Qu.makeScale(e,t)),this}rotate(e){return this.premultiply(Qu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,s,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<9;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<9;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qu=new dt;function ev(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function ql(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function rS(){const r=ql("canvas");return r.style.display="block",r}const Rm={};function sS(r){r in Rm||(Rm[r]=!0,console.warn(r))}const Nm=new dt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Pm=new dt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gl={[Tr]:{transfer:Gl,primaries:Wl,toReference:r=>r,fromReference:r=>r},[hi]:{transfer:Lt,primaries:Wl,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[ec]:{transfer:Gl,primaries:$l,toReference:r=>r.applyMatrix3(Pm),fromReference:r=>r.applyMatrix3(Nm)},[Yd]:{transfer:Lt,primaries:$l,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Pm),fromReference:r=>r.applyMatrix3(Nm).convertLinearToSRGB()}},aS=new Set([Tr,ec]),Tt={enabled:!0,_workingColorSpace:Tr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!aS.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const s=gl[e].toReference,o=gl[t].fromReference;return o(s(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return gl[r].primaries},getTransfer:function(r){return r===vr?Gl:gl[r].transfer}};function Zs(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ed(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ns;class oS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ns===void 0&&(Ns=ql("canvas")),Ns.width=e.width,Ns.height=e.height;const s=Ns.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),t=Ns}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ql("canvas");t.width=e.width,t.height=e.height;const s=t.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const o=s.getImageData(0,0,e.width,e.height),l=o.data;for(let u=0;u<l.length;u++)l[u]=Zs(l[u]/255)*255;return s.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let s=0;s<t.length;s++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[s]=Math.floor(Zs(t[s]/255)*255):t[s]=Zs(t[s]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let lS=0;class tv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lS++}),this.uuid=io(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let u=0,f=o.length;u<f;u++)o[u].isDataTexture?l.push(td(o[u].image)):l.push(td(o[u]))}else l=td(o);s.url=l}return t||(e.images[this.uuid]=s),s}}function td(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?oS.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let cS=0;class Pn extends sa{constructor(e=Pn.DEFAULT_IMAGE,t=Pn.DEFAULT_MAPPING,s=Zr,o=Zr,l=oi,u=Jr,f=vi,m=Mr,p=Pn.DEFAULT_ANISOTROPY,g=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cS++}),this.uuid=io(),this.name="",this.source=new tv(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=s,this.wrapT=o,this.magFilter=l,this.minFilter=u,this.anisotropy=p,this.format=f,this.internalFormat=null,this.type=m,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),t||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ud:e.x=e.x-Math.floor(e.x);break;case Zr:e.x=e.x<0?0:1;break;case Id:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ud:e.y=e.y-Math.floor(e.y);break;case Zr:e.y=e.y<0?0:1;break;case Id:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=Gg;Pn.DEFAULT_ANISOTROPY=1;class rn{constructor(e=0,t=0,s=0,o=1){rn.prototype.isVector4=!0,this.x=e,this.y=t,this.z=s,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,s,o){return this.x=e,this.y=t,this.z=s,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*s+u[8]*o+u[12]*l,this.y=u[1]*t+u[5]*s+u[9]*o+u[13]*l,this.z=u[2]*t+u[6]*s+u[10]*o+u[14]*l,this.w=u[3]*t+u[7]*s+u[11]*o+u[15]*l,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,s,o,l;const m=e.elements,p=m[0],g=m[4],x=m[8],_=m[1],M=m[5],w=m[9],E=m[2],S=m[6],y=m[10];if(Math.abs(g-_)<.01&&Math.abs(x-E)<.01&&Math.abs(w-S)<.01){if(Math.abs(g+_)<.1&&Math.abs(x+E)<.1&&Math.abs(w+S)<.1&&Math.abs(p+M+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(p+1)/2,D=(M+1)/2,$=(y+1)/2,U=(g+_)/4,L=(x+E)/4,q=(w+S)/4;return b>D&&b>$?b<.01?(s=0,o=.707106781,l=.707106781):(s=Math.sqrt(b),o=U/s,l=L/s):D>$?D<.01?(s=.707106781,o=0,l=.707106781):(o=Math.sqrt(D),s=U/o,l=q/o):$<.01?(s=.707106781,o=.707106781,l=0):(l=Math.sqrt($),s=L/l,o=q/l),this.set(s,o,l,t),this}let A=Math.sqrt((S-w)*(S-w)+(x-E)*(x-E)+(_-g)*(_-g));return Math.abs(A)<.001&&(A=1),this.x=(S-w)/A,this.y=(x-E)/A,this.z=(_-g)/A,this.w=Math.acos((p+M+y-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this.w=e.w+(t.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class uS extends sa{constructor(e=1,t=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rn(0,0,e,t),this.scissorTest=!1,this.viewport=new rn(0,0,e,t);const o={width:e,height:t,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const l=new Pn(o,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);l.flipY=!1,l.generateMipmaps=s.generateMipmaps,l.internalFormat=s.internalFormat,this.textures=[];const u=s.count;for(let f=0;f<u;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,s=1){if(this.width!==e||this.height!==t||this.depth!==s){this.width=e,this.height=t,this.depth=s;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=s;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,o=e.textures.length;s<o;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new tv(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends uS{constructor(e=1,t=1,s={}){super(e,t,s),this.isWebGLRenderTarget=!0}}class nv extends Pn{constructor(e=null,t=1,s=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dS extends Pn{constructor(e=null,t=1,s=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ro{constructor(e=0,t=0,s=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=s,this._w=o}static slerpFlat(e,t,s,o,l,u,f){let m=s[o+0],p=s[o+1],g=s[o+2],x=s[o+3];const _=l[u+0],M=l[u+1],w=l[u+2],E=l[u+3];if(f===0){e[t+0]=m,e[t+1]=p,e[t+2]=g,e[t+3]=x;return}if(f===1){e[t+0]=_,e[t+1]=M,e[t+2]=w,e[t+3]=E;return}if(x!==E||m!==_||p!==M||g!==w){let S=1-f;const y=m*_+p*M+g*w+x*E,A=y>=0?1:-1,b=1-y*y;if(b>Number.EPSILON){const $=Math.sqrt(b),U=Math.atan2($,y*A);S=Math.sin(S*U)/$,f=Math.sin(f*U)/$}const D=f*A;if(m=m*S+_*D,p=p*S+M*D,g=g*S+w*D,x=x*S+E*D,S===1-f){const $=1/Math.sqrt(m*m+p*p+g*g+x*x);m*=$,p*=$,g*=$,x*=$}}e[t]=m,e[t+1]=p,e[t+2]=g,e[t+3]=x}static multiplyQuaternionsFlat(e,t,s,o,l,u){const f=s[o],m=s[o+1],p=s[o+2],g=s[o+3],x=l[u],_=l[u+1],M=l[u+2],w=l[u+3];return e[t]=f*w+g*x+m*M-p*_,e[t+1]=m*w+g*_+p*x-f*M,e[t+2]=p*w+g*M+f*_-m*x,e[t+3]=g*w-f*x-m*_-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,s,o){return this._x=e,this._y=t,this._z=s,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const s=e._x,o=e._y,l=e._z,u=e._order,f=Math.cos,m=Math.sin,p=f(s/2),g=f(o/2),x=f(l/2),_=m(s/2),M=m(o/2),w=m(l/2);switch(u){case"XYZ":this._x=_*g*x+p*M*w,this._y=p*M*x-_*g*w,this._z=p*g*w+_*M*x,this._w=p*g*x-_*M*w;break;case"YXZ":this._x=_*g*x+p*M*w,this._y=p*M*x-_*g*w,this._z=p*g*w-_*M*x,this._w=p*g*x+_*M*w;break;case"ZXY":this._x=_*g*x-p*M*w,this._y=p*M*x+_*g*w,this._z=p*g*w+_*M*x,this._w=p*g*x-_*M*w;break;case"ZYX":this._x=_*g*x-p*M*w,this._y=p*M*x+_*g*w,this._z=p*g*w-_*M*x,this._w=p*g*x+_*M*w;break;case"YZX":this._x=_*g*x+p*M*w,this._y=p*M*x+_*g*w,this._z=p*g*w-_*M*x,this._w=p*g*x-_*M*w;break;case"XZY":this._x=_*g*x-p*M*w,this._y=p*M*x-_*g*w,this._z=p*g*w+_*M*x,this._w=p*g*x+_*M*w;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const s=t/2,o=Math.sin(s);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,s=t[0],o=t[4],l=t[8],u=t[1],f=t[5],m=t[9],p=t[2],g=t[6],x=t[10],_=s+f+x;if(_>0){const M=.5/Math.sqrt(_+1);this._w=.25/M,this._x=(g-m)*M,this._y=(l-p)*M,this._z=(u-o)*M}else if(s>f&&s>x){const M=2*Math.sqrt(1+s-f-x);this._w=(g-m)/M,this._x=.25*M,this._y=(o+u)/M,this._z=(l+p)/M}else if(f>x){const M=2*Math.sqrt(1+f-s-x);this._w=(l-p)/M,this._x=(o+u)/M,this._y=.25*M,this._z=(m+g)/M}else{const M=2*Math.sqrt(1+x-s-f);this._w=(u-o)/M,this._x=(l+p)/M,this._y=(m+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let s=e.dot(t)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rn(this.dot(e),-1,1)))}rotateTowards(e,t){const s=this.angleTo(e);if(s===0)return this;const o=Math.min(1,t/s);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const s=e._x,o=e._y,l=e._z,u=e._w,f=t._x,m=t._y,p=t._z,g=t._w;return this._x=s*g+u*f+o*p-l*m,this._y=o*g+u*m+l*f-s*p,this._z=l*g+u*p+s*m-o*f,this._w=u*g-s*f-o*m-l*p,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const s=this._x,o=this._y,l=this._z,u=this._w;let f=u*e._w+s*e._x+o*e._y+l*e._z;if(f<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,f=-f):this.copy(e),f>=1)return this._w=u,this._x=s,this._y=o,this._z=l,this;const m=1-f*f;if(m<=Number.EPSILON){const M=1-t;return this._w=M*u+t*this._w,this._x=M*s+t*this._x,this._y=M*o+t*this._y,this._z=M*l+t*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,f),x=Math.sin((1-t)*g)/p,_=Math.sin(t*g)/p;return this._w=u*x+this._w*_,this._x=s*x+this._x*_,this._y=o*x+this._y*_,this._z=l*x+this._z*_,this._onChangeCallback(),this}slerpQuaternions(e,t,s){return this.copy(e).slerp(t,s)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),s=Math.random(),o=Math.sqrt(1-s),l=Math.sqrt(s);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class le{constructor(e=0,t=0,s=0){le.prototype.isVector3=!0,this.x=e,this.y=t,this.z=s}set(e,t,s){return s===void 0&&(s=this.z),this.x=e,this.y=t,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Lm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Lm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[3]*s+l[6]*o,this.y=l[1]*t+l[4]*s+l[7]*o,this.z=l[2]*t+l[5]*s+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=e.elements,u=1/(l[3]*t+l[7]*s+l[11]*o+l[15]);return this.x=(l[0]*t+l[4]*s+l[8]*o+l[12])*u,this.y=(l[1]*t+l[5]*s+l[9]*o+l[13])*u,this.z=(l[2]*t+l[6]*s+l[10]*o+l[14])*u,this}applyQuaternion(e){const t=this.x,s=this.y,o=this.z,l=e.x,u=e.y,f=e.z,m=e.w,p=2*(u*o-f*s),g=2*(f*t-l*o),x=2*(l*s-u*t);return this.x=t+m*p+u*x-f*g,this.y=s+m*g+f*p-l*x,this.z=o+m*x+l*g-u*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[4]*s+l[8]*o,this.y=l[1]*t+l[5]*s+l[9]*o,this.z=l[2]*t+l[6]*s+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const s=e.x,o=e.y,l=e.z,u=t.x,f=t.y,m=t.z;return this.x=o*m-l*f,this.y=l*u-s*m,this.z=s*f-o*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const s=e.dot(this)/t;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return nd.copy(this).projectOnVector(e),this.sub(nd)}reflect(e){return this.sub(nd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(Rn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y,o=this.z-e.z;return t*t+s*s+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,s){const o=Math.sin(t)*e;return this.x=o*Math.sin(s),this.y=Math.cos(t)*e,this.z=o*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,s){return this.x=e*Math.sin(t),this.y=s,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=s,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,s=Math.sqrt(1-t*t);return this.x=s*Math.cos(e),this.y=t,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const nd=new le,Lm=new ro;class aa{constructor(e=new le(1/0,1/0,1/0),t=new le(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t+=3)this.expandByPoint(ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,s=e.count;t<s;t++)this.expandByPoint(ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const s=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const l=s.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,f=l.count;u<f;u++)e.isMesh===!0?e.getVertexPosition(u,ri):ri.fromBufferAttribute(l,u),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vl.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),vl.copy(s.boundingBox)),vl.applyMatrix4(e.matrixWorld),this.union(vl)}const o=e.children;for(let l=0,u=o.length;l<u;l++)this.expandByObject(o[l],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,s;return e.normal.x>0?(t=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),t<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wa),_l.subVectors(this.max,Wa),Ps.subVectors(e.a,Wa),Ls.subVectors(e.b,Wa),Ds.subVectors(e.c,Wa),dr.subVectors(Ls,Ps),fr.subVectors(Ds,Ls),Br.subVectors(Ps,Ds);let t=[0,-dr.z,dr.y,0,-fr.z,fr.y,0,-Br.z,Br.y,dr.z,0,-dr.x,fr.z,0,-fr.x,Br.z,0,-Br.x,-dr.y,dr.x,0,-fr.y,fr.x,0,-Br.y,Br.x,0];return!id(t,Ps,Ls,Ds,_l)||(t=[1,0,0,0,1,0,0,0,1],!id(t,Ps,Ls,Ds,_l))?!1:(xl.crossVectors(dr,fr),t=[xl.x,xl.y,xl.z],id(t,Ps,Ls,Ds,_l))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Li=[new le,new le,new le,new le,new le,new le,new le,new le],ri=new le,vl=new aa,Ps=new le,Ls=new le,Ds=new le,dr=new le,fr=new le,Br=new le,Wa=new le,_l=new le,xl=new le,jr=new le;function id(r,e,t,s,o){for(let l=0,u=r.length-3;l<=u;l+=3){jr.fromArray(r,l);const f=o.x*Math.abs(jr.x)+o.y*Math.abs(jr.y)+o.z*Math.abs(jr.z),m=e.dot(jr),p=t.dot(jr),g=s.dot(jr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>f)return!1}return!0}const fS=new aa,$a=new le,rd=new le;class Kd{constructor(e=new le,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const s=this.center;t!==void 0?s.copy(t):fS.setFromPoints(e).getCenter(s);let o=0;for(let l=0,u=e.length;l<u;l++)o=Math.max(o,s.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const s=this.center.distanceToSquared(e);return t.copy(e),s>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$a.subVectors(e,this.center);const t=$a.lengthSq();if(t>this.radius*this.radius){const s=Math.sqrt(t),o=(s-this.radius)*.5;this.center.addScaledVector($a,o/s),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(rd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($a.copy(e.center).add(rd)),this.expandByPoint($a.copy(e.center).sub(rd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Di=new le,sd=new le,yl=new le,hr=new le,ad=new le,Sl=new le,od=new le;class hS{constructor(e=new le,t=new le(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const s=t.dot(this.direction);return s<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,s,o){sd.copy(e).add(t).multiplyScalar(.5),yl.copy(t).sub(e).normalize(),hr.copy(this.origin).sub(sd);const l=e.distanceTo(t)*.5,u=-this.direction.dot(yl),f=hr.dot(this.direction),m=-hr.dot(yl),p=hr.lengthSq(),g=Math.abs(1-u*u);let x,_,M,w;if(g>0)if(x=u*m-f,_=u*f-m,w=l*g,x>=0)if(_>=-w)if(_<=w){const E=1/g;x*=E,_*=E,M=x*(x+u*_+2*f)+_*(u*x+_+2*m)+p}else _=l,x=Math.max(0,-(u*_+f)),M=-x*x+_*(_+2*m)+p;else _=-l,x=Math.max(0,-(u*_+f)),M=-x*x+_*(_+2*m)+p;else _<=-w?(x=Math.max(0,-(-u*l+f)),_=x>0?-l:Math.min(Math.max(-l,-m),l),M=-x*x+_*(_+2*m)+p):_<=w?(x=0,_=Math.min(Math.max(-l,-m),l),M=_*(_+2*m)+p):(x=Math.max(0,-(u*l+f)),_=x>0?l:Math.min(Math.max(-l,-m),l),M=-x*x+_*(_+2*m)+p);else _=u>0?-l:l,x=Math.max(0,-(u*_+f)),M=-x*x+_*(_+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,x),o&&o.copy(sd).addScaledVector(yl,_),M}intersectSphere(e,t){Di.subVectors(e.center,this.origin);const s=Di.dot(this.direction),o=Di.dot(Di)-s*s,l=e.radius*e.radius;if(o>l)return null;const u=Math.sqrt(l-o),f=s-u,m=s+u;return m<0?null:f<0?this.at(m,t):this.at(f,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/t;return s>=0?s:null}intersectPlane(e,t){const s=this.distanceToPlane(e);return s===null?null:this.at(s,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let s,o,l,u,f,m;const p=1/this.direction.x,g=1/this.direction.y,x=1/this.direction.z,_=this.origin;return p>=0?(s=(e.min.x-_.x)*p,o=(e.max.x-_.x)*p):(s=(e.max.x-_.x)*p,o=(e.min.x-_.x)*p),g>=0?(l=(e.min.y-_.y)*g,u=(e.max.y-_.y)*g):(l=(e.max.y-_.y)*g,u=(e.min.y-_.y)*g),s>u||l>o||((l>s||isNaN(s))&&(s=l),(u<o||isNaN(o))&&(o=u),x>=0?(f=(e.min.z-_.z)*x,m=(e.max.z-_.z)*x):(f=(e.max.z-_.z)*x,m=(e.min.z-_.z)*x),s>m||f>o)||((f>s||s!==s)&&(s=f),(m<o||o!==o)&&(o=m),o<0)?null:this.at(s>=0?s:o,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,s,o,l){ad.subVectors(t,e),Sl.subVectors(s,e),od.crossVectors(ad,Sl);let u=this.direction.dot(od),f;if(u>0){if(o)return null;f=1}else if(u<0)f=-1,u=-u;else return null;hr.subVectors(this.origin,e);const m=f*this.direction.dot(Sl.crossVectors(hr,Sl));if(m<0)return null;const p=f*this.direction.dot(ad.cross(hr));if(p<0||m+p>u)return null;const g=-f*hr.dot(od);return g<0?null:this.at(g/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(e,t,s,o,l,u,f,m,p,g,x,_,M,w,E,S){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,u,f,m,p,g,x,_,M,w,E,S)}set(e,t,s,o,l,u,f,m,p,g,x,_,M,w,E,S){const y=this.elements;return y[0]=e,y[4]=t,y[8]=s,y[12]=o,y[1]=l,y[5]=u,y[9]=f,y[13]=m,y[2]=p,y[6]=g,y[10]=x,y[14]=_,y[3]=M,y[7]=w,y[11]=E,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],t[9]=s[9],t[10]=s[10],t[11]=s[11],t[12]=s[12],t[13]=s[13],t[14]=s[14],t[15]=s[15],this}copyPosition(e){const t=this.elements,s=e.elements;return t[12]=s[12],t[13]=s[13],t[14]=s[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,s){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,t,s){return this.set(e.x,t.x,s.x,0,e.y,t.y,s.y,0,e.z,t.z,s.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,s=e.elements,o=1/Us.setFromMatrixColumn(e,0).length(),l=1/Us.setFromMatrixColumn(e,1).length(),u=1/Us.setFromMatrixColumn(e,2).length();return t[0]=s[0]*o,t[1]=s[1]*o,t[2]=s[2]*o,t[3]=0,t[4]=s[4]*l,t[5]=s[5]*l,t[6]=s[6]*l,t[7]=0,t[8]=s[8]*u,t[9]=s[9]*u,t[10]=s[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,s=e.x,o=e.y,l=e.z,u=Math.cos(s),f=Math.sin(s),m=Math.cos(o),p=Math.sin(o),g=Math.cos(l),x=Math.sin(l);if(e.order==="XYZ"){const _=u*g,M=u*x,w=f*g,E=f*x;t[0]=m*g,t[4]=-m*x,t[8]=p,t[1]=M+w*p,t[5]=_-E*p,t[9]=-f*m,t[2]=E-_*p,t[6]=w+M*p,t[10]=u*m}else if(e.order==="YXZ"){const _=m*g,M=m*x,w=p*g,E=p*x;t[0]=_+E*f,t[4]=w*f-M,t[8]=u*p,t[1]=u*x,t[5]=u*g,t[9]=-f,t[2]=M*f-w,t[6]=E+_*f,t[10]=u*m}else if(e.order==="ZXY"){const _=m*g,M=m*x,w=p*g,E=p*x;t[0]=_-E*f,t[4]=-u*x,t[8]=w+M*f,t[1]=M+w*f,t[5]=u*g,t[9]=E-_*f,t[2]=-u*p,t[6]=f,t[10]=u*m}else if(e.order==="ZYX"){const _=u*g,M=u*x,w=f*g,E=f*x;t[0]=m*g,t[4]=w*p-M,t[8]=_*p+E,t[1]=m*x,t[5]=E*p+_,t[9]=M*p-w,t[2]=-p,t[6]=f*m,t[10]=u*m}else if(e.order==="YZX"){const _=u*m,M=u*p,w=f*m,E=f*p;t[0]=m*g,t[4]=E-_*x,t[8]=w*x+M,t[1]=x,t[5]=u*g,t[9]=-f*g,t[2]=-p*g,t[6]=M*x+w,t[10]=_-E*x}else if(e.order==="XZY"){const _=u*m,M=u*p,w=f*m,E=f*p;t[0]=m*g,t[4]=-x,t[8]=p*g,t[1]=_*x+E,t[5]=u*g,t[9]=M*x-w,t[2]=w*x-M,t[6]=f*g,t[10]=E*x+_}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pS,e,mS)}lookAt(e,t,s){const o=this.elements;return On.subVectors(e,t),On.lengthSq()===0&&(On.z=1),On.normalize(),pr.crossVectors(s,On),pr.lengthSq()===0&&(Math.abs(s.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),pr.crossVectors(s,On)),pr.normalize(),Ml.crossVectors(On,pr),o[0]=pr.x,o[4]=Ml.x,o[8]=On.x,o[1]=pr.y,o[5]=Ml.y,o[9]=On.y,o[2]=pr.z,o[6]=Ml.z,o[10]=On.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,u=s[0],f=s[4],m=s[8],p=s[12],g=s[1],x=s[5],_=s[9],M=s[13],w=s[2],E=s[6],S=s[10],y=s[14],A=s[3],b=s[7],D=s[11],$=s[15],U=o[0],L=o[4],q=o[8],N=o[12],C=o[1],j=o[5],X=o[9],z=o[13],ne=o[2],ue=o[6],G=o[10],Y=o[14],F=o[3],re=o[7],ee=o[11],O=o[15];return l[0]=u*U+f*C+m*ne+p*F,l[4]=u*L+f*j+m*ue+p*re,l[8]=u*q+f*X+m*G+p*ee,l[12]=u*N+f*z+m*Y+p*O,l[1]=g*U+x*C+_*ne+M*F,l[5]=g*L+x*j+_*ue+M*re,l[9]=g*q+x*X+_*G+M*ee,l[13]=g*N+x*z+_*Y+M*O,l[2]=w*U+E*C+S*ne+y*F,l[6]=w*L+E*j+S*ue+y*re,l[10]=w*q+E*X+S*G+y*ee,l[14]=w*N+E*z+S*Y+y*O,l[3]=A*U+b*C+D*ne+$*F,l[7]=A*L+b*j+D*ue+$*re,l[11]=A*q+b*X+D*G+$*ee,l[15]=A*N+b*z+D*Y+$*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[4],o=e[8],l=e[12],u=e[1],f=e[5],m=e[9],p=e[13],g=e[2],x=e[6],_=e[10],M=e[14],w=e[3],E=e[7],S=e[11],y=e[15];return w*(+l*m*x-o*p*x-l*f*_+s*p*_+o*f*M-s*m*M)+E*(+t*m*M-t*p*_+l*u*_-o*u*M+o*p*g-l*m*g)+S*(+t*p*x-t*f*M-l*u*x+s*u*M+l*f*g-s*p*g)+y*(-o*f*g-t*m*x+t*f*_+o*u*x-s*u*_+s*m*g)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,s){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=s),this}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],u=e[4],f=e[5],m=e[6],p=e[7],g=e[8],x=e[9],_=e[10],M=e[11],w=e[12],E=e[13],S=e[14],y=e[15],A=x*S*p-E*_*p+E*m*M-f*S*M-x*m*y+f*_*y,b=w*_*p-g*S*p-w*m*M+u*S*M+g*m*y-u*_*y,D=g*E*p-w*x*p+w*f*M-u*E*M-g*f*y+u*x*y,$=w*x*m-g*E*m-w*f*_+u*E*_+g*f*S-u*x*S,U=t*A+s*b+o*D+l*$;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/U;return e[0]=A*L,e[1]=(E*_*l-x*S*l-E*o*M+s*S*M+x*o*y-s*_*y)*L,e[2]=(f*S*l-E*m*l+E*o*p-s*S*p-f*o*y+s*m*y)*L,e[3]=(x*m*l-f*_*l-x*o*p+s*_*p+f*o*M-s*m*M)*L,e[4]=b*L,e[5]=(g*S*l-w*_*l+w*o*M-t*S*M-g*o*y+t*_*y)*L,e[6]=(w*m*l-u*S*l-w*o*p+t*S*p+u*o*y-t*m*y)*L,e[7]=(u*_*l-g*m*l+g*o*p-t*_*p-u*o*M+t*m*M)*L,e[8]=D*L,e[9]=(w*x*l-g*E*l-w*s*M+t*E*M+g*s*y-t*x*y)*L,e[10]=(u*E*l-w*f*l+w*s*p-t*E*p-u*s*y+t*f*y)*L,e[11]=(g*f*l-u*x*l-g*s*p+t*x*p+u*s*M-t*f*M)*L,e[12]=$*L,e[13]=(g*E*o-w*x*o+w*s*_-t*E*_-g*s*S+t*x*S)*L,e[14]=(w*f*o-u*E*o-w*s*m+t*E*m+u*s*S-t*f*S)*L,e[15]=(u*x*o-g*f*o+g*s*m-t*x*m-u*s*_+t*f*_)*L,this}scale(e){const t=this.elements,s=e.x,o=e.y,l=e.z;return t[0]*=s,t[4]*=o,t[8]*=l,t[1]*=s,t[5]*=o,t[9]*=l,t[2]*=s,t[6]*=o,t[10]*=l,t[3]*=s,t[7]*=o,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,s,o))}makeTranslation(e,t,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,s,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,t,-s,0,0,s,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,0,s,0,0,1,0,0,-s,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,0,s,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const s=Math.cos(t),o=Math.sin(t),l=1-s,u=e.x,f=e.y,m=e.z,p=l*u,g=l*f;return this.set(p*u+s,p*f-o*m,p*m+o*f,0,p*f+o*m,g*f+s,g*m-o*u,0,p*m-o*f,g*m+o*u,l*m*m+s,0,0,0,0,1),this}makeScale(e,t,s){return this.set(e,0,0,0,0,t,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,t,s,o,l,u){return this.set(1,s,l,0,e,1,u,0,t,o,1,0,0,0,0,1),this}compose(e,t,s){const o=this.elements,l=t._x,u=t._y,f=t._z,m=t._w,p=l+l,g=u+u,x=f+f,_=l*p,M=l*g,w=l*x,E=u*g,S=u*x,y=f*x,A=m*p,b=m*g,D=m*x,$=s.x,U=s.y,L=s.z;return o[0]=(1-(E+y))*$,o[1]=(M+D)*$,o[2]=(w-b)*$,o[3]=0,o[4]=(M-D)*U,o[5]=(1-(_+y))*U,o[6]=(S+A)*U,o[7]=0,o[8]=(w+b)*L,o[9]=(S-A)*L,o[10]=(1-(_+E))*L,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,s){const o=this.elements;let l=Us.set(o[0],o[1],o[2]).length();const u=Us.set(o[4],o[5],o[6]).length(),f=Us.set(o[8],o[9],o[10]).length();this.determinant()<0&&(l=-l),e.x=o[12],e.y=o[13],e.z=o[14],si.copy(this);const p=1/l,g=1/u,x=1/f;return si.elements[0]*=p,si.elements[1]*=p,si.elements[2]*=p,si.elements[4]*=g,si.elements[5]*=g,si.elements[6]*=g,si.elements[8]*=x,si.elements[9]*=x,si.elements[10]*=x,t.setFromRotationMatrix(si),s.x=l,s.y=u,s.z=f,this}makePerspective(e,t,s,o,l,u,f=zi){const m=this.elements,p=2*l/(t-e),g=2*l/(s-o),x=(t+e)/(t-e),_=(s+o)/(s-o);let M,w;if(f===zi)M=-(u+l)/(u-l),w=-2*u*l/(u-l);else if(f===Xl)M=-u/(u-l),w=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return m[0]=p,m[4]=0,m[8]=x,m[12]=0,m[1]=0,m[5]=g,m[9]=_,m[13]=0,m[2]=0,m[6]=0,m[10]=M,m[14]=w,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,t,s,o,l,u,f=zi){const m=this.elements,p=1/(t-e),g=1/(s-o),x=1/(u-l),_=(t+e)*p,M=(s+o)*g;let w,E;if(f===zi)w=(u+l)*x,E=-2*x;else if(f===Xl)w=l*x,E=-1*x;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-_,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-M,m[2]=0,m[6]=0,m[10]=E,m[14]=-w,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<16;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<16;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e[t+9]=s[9],e[t+10]=s[10],e[t+11]=s[11],e[t+12]=s[12],e[t+13]=s[13],e[t+14]=s[14],e[t+15]=s[15],e}}const Us=new le,si=new Bt,pS=new le(0,0,0),mS=new le(1,1,1),pr=new le,Ml=new le,On=new le,Dm=new Bt,Um=new ro;class Si{constructor(e=0,t=0,s=0,o=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=s,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,s,o=this._order){return this._x=e,this._y=t,this._z=s,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,s=!0){const o=e.elements,l=o[0],u=o[4],f=o[8],m=o[1],p=o[5],g=o[9],x=o[2],_=o[6],M=o[10];switch(t){case"XYZ":this._y=Math.asin(Rn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(_,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Rn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(f,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-x,l),this._z=0);break;case"ZXY":this._x=Math.asin(Rn(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(-x,M),this._z=Math.atan2(-u,p)):(this._y=0,this._z=Math.atan2(m,l));break;case"ZYX":this._y=Math.asin(-Rn(x,-1,1)),Math.abs(x)<.9999999?(this._x=Math.atan2(_,M),this._z=Math.atan2(m,l)):(this._x=0,this._z=Math.atan2(-u,p));break;case"YZX":this._z=Math.asin(Rn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-x,l)):(this._x=0,this._y=Math.atan2(f,M));break;case"XZY":this._z=Math.asin(-Rn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(_,p),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,s){return Dm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Dm,t,s)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Um.setFromEuler(this),this.setFromQuaternion(Um,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class iv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let gS=0;const Im=new le,Is=new ro,Ui=new Bt,El=new le,Xa=new le,vS=new le,_S=new ro,Fm=new le(1,0,0),Om=new le(0,1,0),km=new le(0,0,1),zm={type:"added"},xS={type:"removed"},Fs={type:"childadded",child:null},ld={type:"childremoved",child:null};class gn extends sa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gS++}),this.uuid=io(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gn.DEFAULT_UP.clone();const e=new le,t=new Si,s=new ro,o=new le(1,1,1);function l(){s.setFromEuler(t,!1)}function u(){t.setFromQuaternion(s,void 0,!1)}t._onChange(l),s._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Bt},normalMatrix:{value:new dt}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new iv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(Fm,e)}rotateY(e){return this.rotateOnAxis(Om,e)}rotateZ(e){return this.rotateOnAxis(km,e)}translateOnAxis(e,t){return Im.copy(e).applyQuaternion(this.quaternion),this.position.add(Im.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fm,e)}translateY(e){return this.translateOnAxis(Om,e)}translateZ(e){return this.translateOnAxis(km,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,s){e.isVector3?El.copy(e):El.set(e,t,s);const o=this.parent;this.updateWorldMatrix(!0,!1),Xa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(Xa,El,this.up):Ui.lookAt(El,Xa,this.up),this.quaternion.setFromRotationMatrix(Ui),o&&(Ui.extractRotation(o.matrixWorld),Is.setFromRotationMatrix(Ui),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(xS),ld.child=e,this.dispatchEvent(ld),ld.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let s=0,o=this.children.length;s<o;s++){const u=this.children[s].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,s=[]){this[e]===t&&s.push(this);const o=this.children;for(let l=0,u=o.length;l<u;l++)o[l].getObjectsByProperty(e,t,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,e,vS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xa,_S,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let s=0,o=t.length;s<o;s++){const l=t[s];(l.matrixWorldAutoUpdate===!0||e===!0)&&l.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const s=this.parent;if(e===!0&&s!==null&&s.matrixWorldAutoUpdate===!0&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const o=this.children;for(let l=0,u=o.length;l<u;l++){const f=o[l];f.matrixWorldAutoUpdate===!0&&f.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",s={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(f=>({boxInitialized:f.boxInitialized,boxMin:f.box.min.toArray(),boxMax:f.box.max.toArray(),sphereInitialized:f.sphereInitialized,sphereRadius:f.sphere.radius,sphereCenter:f.sphere.center.toArray()})),o.maxGeometryCount=this._maxGeometryCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function l(f,m){return f[m.uuid]===void 0&&(f[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const m=f.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const x=m[p];l(e.shapes,x)}else l(e.shapes,m)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let m=0,p=this.material.length;m<p;m++)f.push(l(e.materials,this.material[m]));o.material=f}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let f=0;f<this.children.length;f++)o.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let f=0;f<this.animations.length;f++){const m=this.animations[f];o.animations.push(l(e.animations,m))}}if(t){const f=u(e.geometries),m=u(e.materials),p=u(e.textures),g=u(e.images),x=u(e.shapes),_=u(e.skeletons),M=u(e.animations),w=u(e.nodes);f.length>0&&(s.geometries=f),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),x.length>0&&(s.shapes=x),_.length>0&&(s.skeletons=_),M.length>0&&(s.animations=M),w.length>0&&(s.nodes=w)}return s.object=o,s;function u(f){const m=[];for(const p in f){const g=f[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let s=0;s<e.children.length;s++){const o=e.children[s];this.add(o.clone())}return this}}gn.DEFAULT_UP=new le(0,1,0);gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ai=new le,Ii=new le,cd=new le,Fi=new le,Os=new le,ks=new le,Bm=new le,ud=new le,dd=new le,fd=new le;class gi{constructor(e=new le,t=new le,s=new le){this.a=e,this.b=t,this.c=s}static getNormal(e,t,s,o){o.subVectors(s,t),ai.subVectors(e,t),o.cross(ai);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,t,s,o,l){ai.subVectors(o,t),Ii.subVectors(s,t),cd.subVectors(e,t);const u=ai.dot(ai),f=ai.dot(Ii),m=ai.dot(cd),p=Ii.dot(Ii),g=Ii.dot(cd),x=u*p-f*f;if(x===0)return l.set(0,0,0),null;const _=1/x,M=(p*m-f*g)*_,w=(u*g-f*m)*_;return l.set(1-M-w,w,M)}static containsPoint(e,t,s,o){return this.getBarycoord(e,t,s,o,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,s,o,l,u,f,m){return this.getBarycoord(e,t,s,o,Fi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(l,Fi.x),m.addScaledVector(u,Fi.y),m.addScaledVector(f,Fi.z),m)}static isFrontFacing(e,t,s,o){return ai.subVectors(s,t),Ii.subVectors(e,t),ai.cross(Ii).dot(o)<0}set(e,t,s){return this.a.copy(e),this.b.copy(t),this.c.copy(s),this}setFromPointsAndIndices(e,t,s,o){return this.a.copy(e[t]),this.b.copy(e[s]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,s,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ai.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),ai.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,s,o,l){return gi.getInterpolation(e,this.a,this.b,this.c,t,s,o,l)}containsPoint(e){return gi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const s=this.a,o=this.b,l=this.c;let u,f;Os.subVectors(o,s),ks.subVectors(l,s),ud.subVectors(e,s);const m=Os.dot(ud),p=ks.dot(ud);if(m<=0&&p<=0)return t.copy(s);dd.subVectors(e,o);const g=Os.dot(dd),x=ks.dot(dd);if(g>=0&&x<=g)return t.copy(o);const _=m*x-g*p;if(_<=0&&m>=0&&g<=0)return u=m/(m-g),t.copy(s).addScaledVector(Os,u);fd.subVectors(e,l);const M=Os.dot(fd),w=ks.dot(fd);if(w>=0&&M<=w)return t.copy(l);const E=M*p-m*w;if(E<=0&&p>=0&&w<=0)return f=p/(p-w),t.copy(s).addScaledVector(ks,f);const S=g*w-M*x;if(S<=0&&x-g>=0&&M-w>=0)return Bm.subVectors(l,o),f=(x-g)/(x-g+(M-w)),t.copy(o).addScaledVector(Bm,f);const y=1/(S+E+_);return u=E*y,f=_*y,t.copy(s).addScaledVector(Os,u).addScaledVector(ks,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const rv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},wl={h:0,s:0,l:0};function hd(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Mt{constructor(e,t,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,s)}set(e,t,s){if(t===void 0&&s===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.toWorkingColorSpace(this,t),this}setRGB(e,t,s,o=Tt.workingColorSpace){return this.r=e,this.g=t,this.b=s,Tt.toWorkingColorSpace(this,o),this}setHSL(e,t,s,o=Tt.workingColorSpace){if(e=iS(e,1),t=Rn(t,0,1),s=Rn(s,0,1),t===0)this.r=this.g=this.b=s;else{const l=s<=.5?s*(1+t):s+t-s*t,u=2*s-l;this.r=hd(u,l,e+1/3),this.g=hd(u,l,e),this.b=hd(u,l,e-1/3)}return Tt.toWorkingColorSpace(this,o),this}setStyle(e,t=hi){function s(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=o[1],f=o[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return s(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return s(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return s(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const s=rv[e.toLowerCase()];return s!==void 0?this.setHex(s,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}copyLinearToSRGB(e){return this.r=ed(e.r),this.g=ed(e.g),this.b=ed(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return Tt.fromWorkingColorSpace(pn.copy(this),e),Math.round(Rn(pn.r*255,0,255))*65536+Math.round(Rn(pn.g*255,0,255))*256+Math.round(Rn(pn.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Tt.workingColorSpace){Tt.fromWorkingColorSpace(pn.copy(this),t);const s=pn.r,o=pn.g,l=pn.b,u=Math.max(s,o,l),f=Math.min(s,o,l);let m,p;const g=(f+u)/2;if(f===u)m=0,p=0;else{const x=u-f;switch(p=g<=.5?x/(u+f):x/(2-u-f),u){case s:m=(o-l)/x+(o<l?6:0);break;case o:m=(l-s)/x+2;break;case l:m=(s-o)/x+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,t=Tt.workingColorSpace){return Tt.fromWorkingColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=hi){Tt.fromWorkingColorSpace(pn.copy(this),e);const t=pn.r,s=pn.g,o=pn.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(s*255)},${Math.round(o*255)})`}offsetHSL(e,t,s){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,s){return this.r=e.r+(t.r-e.r)*s,this.g=e.g+(t.g-e.g)*s,this.b=e.b+(t.b-e.b)*s,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(wl);const s=Ju(mr.h,wl.h,t),o=Ju(mr.s,wl.s,t),l=Ju(mr.l,wl.l,t);return this.setHSL(s,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,s=this.g,o=this.b,l=e.elements;return this.r=l[0]*t+l[3]*s+l[6]*o,this.g=l[1]*t+l[4]*s+l[7]*o,this.b=l[2]*t+l[5]*s+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pn=new Mt;Mt.NAMES=rv;let yS=0;class so extends sa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yS++}),this.uuid=io(),this.name="",this.type="Material",this.blending=Ys,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nd,this.blendDst=Pd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Mt(0,0,0),this.blendAlpha=0,this.depthFunc=Vl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Am,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const s=e[t];if(s===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(s):o&&o.isVector3&&s&&s.isVector3?o.copy(s):this[t]=s}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Ys&&(s.blending=this.blending),this.side!==Sr&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Nd&&(s.blendSrc=this.blendSrc),this.blendDst!==Pd&&(s.blendDst=this.blendDst),this.blendEquation!==qr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Vl&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Am&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function o(l){const u=[];for(const f in l){const m=l[f];delete m.metadata,u.push(m)}return u}if(t){const l=o(e.textures),u=o(e.images);l.length>0&&(s.textures=l),u.length>0&&(s.images=u)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let s=null;if(t!==null){const o=t.length;s=new Array(o);for(let l=0;l!==o;++l)s[l]=t[l].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class sv extends so{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=Vg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ht=new le,Tl=new _t;class Bn{constructor(e,t,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=s,this.usage=Cm,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return sS("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,s){e*=this.itemSize,s*=t.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=t.array[s+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,s=this.count;t<s;t++)Tl.fromBufferAttribute(this,t),Tl.applyMatrix3(e),this.setXY(t,Tl.x,Tl.y);else if(this.itemSize===3)for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix3(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyMatrix4(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let s=this.array[e*this.itemSize+t];return this.normalized&&(s=Ga(s,this.array)),s}setComponent(e,t,s){return this.normalized&&(s=bn(s,this.array)),this.array[e*this.itemSize+t]=s,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ga(t,this.array)),t}setX(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ga(t,this.array)),t}setY(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ga(t,this.array)),t}setZ(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ga(t,this.array)),t}setW(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,s){return e*=this.itemSize,this.normalized&&(t=bn(t,this.array),s=bn(s,this.array)),this.array[e+0]=t,this.array[e+1]=s,this}setXYZ(e,t,s,o){return e*=this.itemSize,this.normalized&&(t=bn(t,this.array),s=bn(s,this.array),o=bn(o,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this}setXYZW(e,t,s,o,l){return e*=this.itemSize,this.normalized&&(t=bn(t,this.array),s=bn(s,this.array),o=bn(o,this.array),l=bn(l,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Cm&&(e.usage=this.usage),e}}class av extends Bn{constructor(e,t,s){super(new Uint16Array(e),t,s)}}class ov extends Bn{constructor(e,t,s){super(new Uint32Array(e),t,s)}}class Bi extends Bn{constructor(e,t,s){super(new Float32Array(e),t,s)}}let SS=0;const Xn=new Bt,pd=new gn,zs=new le,kn=new aa,qa=new aa,nn=new le;class Hi extends sa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:SS++}),this.uuid=io(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ev(e)?ov:av)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,s=0){this.groups.push({start:e,count:t,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const l=new dt().getNormalMatrix(e);s.applyNormalMatrix(l),s.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xn.makeRotationFromQuaternion(e),this.applyMatrix4(Xn),this}rotateX(e){return Xn.makeRotationX(e),this.applyMatrix4(Xn),this}rotateY(e){return Xn.makeRotationY(e),this.applyMatrix4(Xn),this}rotateZ(e){return Xn.makeRotationZ(e),this.applyMatrix4(Xn),this}translate(e,t,s){return Xn.makeTranslation(e,t,s),this.applyMatrix4(Xn),this}scale(e,t,s){return Xn.makeScale(e,t,s),this.applyMatrix4(Xn),this}lookAt(e){return pd.lookAt(e),pd.updateMatrix(),this.applyMatrix4(pd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){const t=[];for(let s=0,o=e.length;s<o;s++){const l=e[s];t.push(l.x,l.y,l.z||0)}return this.setAttribute("position",new Bi(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new aa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new le(-1/0,-1/0,-1/0),new le(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const l=t[s];kn.setFromBufferAttribute(l),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,kn.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,kn.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(kn.min),this.boundingBox.expandByPoint(kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Kd);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new le,1/0);return}if(e){const s=this.boundingSphere.center;if(kn.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const f=t[l];qa.setFromBufferAttribute(f),this.morphTargetsRelative?(nn.addVectors(kn.min,qa.min),kn.expandByPoint(nn),nn.addVectors(kn.max,qa.max),kn.expandByPoint(nn)):(kn.expandByPoint(qa.min),kn.expandByPoint(qa.max))}kn.getCenter(s);let o=0;for(let l=0,u=e.count;l<u;l++)nn.fromBufferAttribute(e,l),o=Math.max(o,s.distanceToSquared(nn));if(t)for(let l=0,u=t.length;l<u;l++){const f=t[l],m=this.morphTargetsRelative;for(let p=0,g=f.count;p<g;p++)nn.fromBufferAttribute(f,p),m&&(zs.fromBufferAttribute(e,p),nn.add(zs)),o=Math.max(o,s.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=t.position,o=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*s.count),4));const u=this.getAttribute("tangent"),f=[],m=[];for(let q=0;q<s.count;q++)f[q]=new le,m[q]=new le;const p=new le,g=new le,x=new le,_=new _t,M=new _t,w=new _t,E=new le,S=new le;function y(q,N,C){p.fromBufferAttribute(s,q),g.fromBufferAttribute(s,N),x.fromBufferAttribute(s,C),_.fromBufferAttribute(l,q),M.fromBufferAttribute(l,N),w.fromBufferAttribute(l,C),g.sub(p),x.sub(p),M.sub(_),w.sub(_);const j=1/(M.x*w.y-w.x*M.y);isFinite(j)&&(E.copy(g).multiplyScalar(w.y).addScaledVector(x,-M.y).multiplyScalar(j),S.copy(x).multiplyScalar(M.x).addScaledVector(g,-w.x).multiplyScalar(j),f[q].add(E),f[N].add(E),f[C].add(E),m[q].add(S),m[N].add(S),m[C].add(S))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let q=0,N=A.length;q<N;++q){const C=A[q],j=C.start,X=C.count;for(let z=j,ne=j+X;z<ne;z+=3)y(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const b=new le,D=new le,$=new le,U=new le;function L(q){$.fromBufferAttribute(o,q),U.copy($);const N=f[q];b.copy(N),b.sub($.multiplyScalar($.dot(N))).normalize(),D.crossVectors(U,N);const j=D.dot(m[q])<0?-1:1;u.setXYZW(q,b.x,b.y,b.z,j)}for(let q=0,N=A.length;q<N;++q){const C=A[q],j=C.start,X=C.count;for(let z=j,ne=j+X;z<ne;z+=3)L(e.getX(z+0)),L(e.getX(z+1)),L(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",s);else for(let _=0,M=s.count;_<M;_++)s.setXYZ(_,0,0,0);const o=new le,l=new le,u=new le,f=new le,m=new le,p=new le,g=new le,x=new le;if(e)for(let _=0,M=e.count;_<M;_+=3){const w=e.getX(_+0),E=e.getX(_+1),S=e.getX(_+2);o.fromBufferAttribute(t,w),l.fromBufferAttribute(t,E),u.fromBufferAttribute(t,S),g.subVectors(u,l),x.subVectors(o,l),g.cross(x),f.fromBufferAttribute(s,w),m.fromBufferAttribute(s,E),p.fromBufferAttribute(s,S),f.add(g),m.add(g),p.add(g),s.setXYZ(w,f.x,f.y,f.z),s.setXYZ(E,m.x,m.y,m.z),s.setXYZ(S,p.x,p.y,p.z)}else for(let _=0,M=t.count;_<M;_+=3)o.fromBufferAttribute(t,_+0),l.fromBufferAttribute(t,_+1),u.fromBufferAttribute(t,_+2),g.subVectors(u,l),x.subVectors(o,l),g.cross(x),s.setXYZ(_+0,g.x,g.y,g.z),s.setXYZ(_+1,g.x,g.y,g.z),s.setXYZ(_+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,s=e.count;t<s;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(f,m){const p=f.array,g=f.itemSize,x=f.normalized,_=new p.constructor(m.length*g);let M=0,w=0;for(let E=0,S=m.length;E<S;E++){f.isInterleavedBufferAttribute?M=m[E]*f.data.stride+f.offset:M=m[E]*g;for(let y=0;y<g;y++)_[w++]=p[M++]}return new Bn(_,g,x)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Hi,s=this.index.array,o=this.attributes;for(const f in o){const m=o[f],p=e(m,s);t.setAttribute(f,p)}const l=this.morphAttributes;for(const f in l){const m=[],p=l[f];for(let g=0,x=p.length;g<x;g++){const _=p[g],M=e(_,s);m.push(M)}t.morphAttributes[f]=m}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let f=0,m=u.length;f<m;f++){const p=u[f];t.addGroup(p.start,p.count,p.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const s=this.attributes;for(const m in s){const p=s[m];e.data.attributes[m]=p.toJSON(e.data)}const o={};let l=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let x=0,_=p.length;x<_;x++){const M=p[x];g.push(M.toJSON(e.data))}g.length>0&&(o[m]=g,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere={center:f.center.toArray(),radius:f.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(t));const o=e.attributes;for(const p in o){const g=o[p];this.setAttribute(p,g.clone(t))}const l=e.morphAttributes;for(const p in l){const g=[],x=l[p];for(let _=0,M=x.length;_<M;_++)g.push(x[_].clone(t));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let p=0,g=u.length;p<g;p++){const x=u[p];this.addGroup(x.start,x.count,x.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const jm=new Bt,Hr=new hS,Al=new Kd,Hm=new le,Bs=new le,js=new le,Hs=new le,md=new le,Cl=new le,bl=new _t,Rl=new _t,Nl=new _t,Vm=new le,Gm=new le,Wm=new le,Pl=new le,Ll=new le;class _i extends gn{constructor(e=new Hi,t=new sv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,s=Object.keys(t);if(s.length>0){const o=t[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=o.length;l<u;l++){const f=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const s=this.geometry,o=s.attributes.position,l=s.morphAttributes.position,u=s.morphTargetsRelative;t.fromBufferAttribute(o,e);const f=this.morphTargetInfluences;if(l&&f){Cl.set(0,0,0);for(let m=0,p=l.length;m<p;m++){const g=f[m],x=l[m];g!==0&&(md.fromBufferAttribute(x,e),u?Cl.addScaledVector(md,g):Cl.addScaledVector(md.sub(t),g))}t.add(Cl)}return t}raycast(e,t){const s=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Al.copy(s.boundingSphere),Al.applyMatrix4(l),Hr.copy(e.ray).recast(e.near),!(Al.containsPoint(Hr.origin)===!1&&(Hr.intersectSphere(Al,Hm)===null||Hr.origin.distanceToSquared(Hm)>(e.far-e.near)**2))&&(jm.copy(l).invert(),Hr.copy(e.ray).applyMatrix4(jm),!(s.boundingBox!==null&&Hr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,t,Hr)))}_computeIntersections(e,t,s){let o;const l=this.geometry,u=this.material,f=l.index,m=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,x=l.attributes.normal,_=l.groups,M=l.drawRange;if(f!==null)if(Array.isArray(u))for(let w=0,E=_.length;w<E;w++){const S=_[w],y=u[S.materialIndex],A=Math.max(S.start,M.start),b=Math.min(f.count,Math.min(S.start+S.count,M.start+M.count));for(let D=A,$=b;D<$;D+=3){const U=f.getX(D),L=f.getX(D+1),q=f.getX(D+2);o=Dl(this,y,e,s,p,g,x,U,L,q),o&&(o.faceIndex=Math.floor(D/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const w=Math.max(0,M.start),E=Math.min(f.count,M.start+M.count);for(let S=w,y=E;S<y;S+=3){const A=f.getX(S),b=f.getX(S+1),D=f.getX(S+2);o=Dl(this,u,e,s,p,g,x,A,b,D),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}else if(m!==void 0)if(Array.isArray(u))for(let w=0,E=_.length;w<E;w++){const S=_[w],y=u[S.materialIndex],A=Math.max(S.start,M.start),b=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let D=A,$=b;D<$;D+=3){const U=D,L=D+1,q=D+2;o=Dl(this,y,e,s,p,g,x,U,L,q),o&&(o.faceIndex=Math.floor(D/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const w=Math.max(0,M.start),E=Math.min(m.count,M.start+M.count);for(let S=w,y=E;S<y;S+=3){const A=S,b=S+1,D=S+2;o=Dl(this,u,e,s,p,g,x,A,b,D),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}}}function MS(r,e,t,s,o,l,u,f){let m;if(e.side===Nn?m=s.intersectTriangle(u,l,o,!0,f):m=s.intersectTriangle(o,l,u,e.side===Sr,f),m===null)return null;Ll.copy(f),Ll.applyMatrix4(r.matrixWorld);const p=t.ray.origin.distanceTo(Ll);return p<t.near||p>t.far?null:{distance:p,point:Ll.clone(),object:r}}function Dl(r,e,t,s,o,l,u,f,m,p){r.getVertexPosition(f,Bs),r.getVertexPosition(m,js),r.getVertexPosition(p,Hs);const g=MS(r,e,t,s,Bs,js,Hs,Pl);if(g){o&&(bl.fromBufferAttribute(o,f),Rl.fromBufferAttribute(o,m),Nl.fromBufferAttribute(o,p),g.uv=gi.getInterpolation(Pl,Bs,js,Hs,bl,Rl,Nl,new _t)),l&&(bl.fromBufferAttribute(l,f),Rl.fromBufferAttribute(l,m),Nl.fromBufferAttribute(l,p),g.uv1=gi.getInterpolation(Pl,Bs,js,Hs,bl,Rl,Nl,new _t)),u&&(Vm.fromBufferAttribute(u,f),Gm.fromBufferAttribute(u,m),Wm.fromBufferAttribute(u,p),g.normal=gi.getInterpolation(Pl,Bs,js,Hs,Vm,Gm,Wm,new le),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const x={a:f,b:m,c:p,normal:new le,materialIndex:0};gi.getNormal(Bs,js,Hs,x.normal),g.face=x}return g}class ao extends Hi{constructor(e=1,t=1,s=1,o=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:s,widthSegments:o,heightSegments:l,depthSegments:u};const f=this;o=Math.floor(o),l=Math.floor(l),u=Math.floor(u);const m=[],p=[],g=[],x=[];let _=0,M=0;w("z","y","x",-1,-1,s,t,e,u,l,0),w("z","y","x",1,-1,s,t,-e,u,l,1),w("x","z","y",1,1,e,s,t,o,u,2),w("x","z","y",1,-1,e,s,-t,o,u,3),w("x","y","z",1,-1,e,t,s,o,l,4),w("x","y","z",-1,-1,e,t,-s,o,l,5),this.setIndex(m),this.setAttribute("position",new Bi(p,3)),this.setAttribute("normal",new Bi(g,3)),this.setAttribute("uv",new Bi(x,2));function w(E,S,y,A,b,D,$,U,L,q,N){const C=D/L,j=$/q,X=D/2,z=$/2,ne=U/2,ue=L+1,G=q+1;let Y=0,F=0;const re=new le;for(let ee=0;ee<G;ee++){const O=ee*j-z;for(let ce=0;ce<ue;ce++){const ke=ce*C-X;re[E]=ke*A,re[S]=O*b,re[y]=ne,p.push(re.x,re.y,re.z),re[E]=0,re[S]=0,re[y]=U>0?1:-1,g.push(re.x,re.y,re.z),x.push(ce/L),x.push(1-ee/q),Y+=1}}for(let ee=0;ee<q;ee++)for(let O=0;O<L;O++){const ce=_+O+ue*ee,ke=_+O+ue*(ee+1),te=_+(O+1)+ue*(ee+1),he=_+(O+1)+ue*ee;m.push(ce,ke,he),m.push(ke,te,he),F+=6}f.addGroup(M,F,N),M+=F,_+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ao(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ia(r){const e={};for(const t in r){e[t]={};for(const s in r[t]){const o=r[t][s];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][s]=null):e[t][s]=o.clone():Array.isArray(o)?e[t][s]=o.slice():e[t][s]=o}}return e}function xn(r){const e={};for(let t=0;t<r.length;t++){const s=ia(r[t]);for(const o in s)e[o]=s[o]}return e}function ES(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function lv(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}const wS={clone:ia,merge:xn};var TS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,AS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Er extends so{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=TS,this.fragmentShader=AS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ia(e.uniforms),this.uniformsGroups=ES(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const u=this.uniforms[o].value;u&&u.isTexture?t.uniforms[o]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[o]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[o]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[o]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[o]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[o]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[o]={type:"m4",value:u.toArray()}:t.uniforms[o]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const s={};for(const o in this.extensions)this.extensions[o]===!0&&(s[o]=!0);return Object.keys(s).length>0&&(t.extensions=s),t}}class cv extends gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=zi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gr=new le,$m=new _t,Xm=new _t;class qn extends cv{constructor(e=50,t=1,s=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fd*2*Math.atan(Math.tan(Zu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,s){gr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gr.x,gr.y).multiplyScalar(-e/gr.z),gr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(gr.x,gr.y).multiplyScalar(-e/gr.z)}getViewSize(e,t){return this.getViewBounds(e,$m,Xm),t.subVectors(Xm,$m)}setViewOffset(e,t,s,o,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zu*.5*this.fov)/this.zoom,s=2*t,o=this.aspect*s,l=-.5*o;const u=this.view;if(this.view!==null&&this.view.enabled){const m=u.fullWidth,p=u.fullHeight;l+=u.offsetX*o/m,t-=u.offsetY*s/p,o*=u.width/m,s*=u.height/p}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,t,t-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Vs=-90,Gs=1;class CS extends gn{constructor(e,t,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new qn(Vs,Gs,e,t);o.layers=this.layers,this.add(o);const l=new qn(Vs,Gs,e,t);l.layers=this.layers,this.add(l);const u=new qn(Vs,Gs,e,t);u.layers=this.layers,this.add(u);const f=new qn(Vs,Gs,e,t);f.layers=this.layers,this.add(f);const m=new qn(Vs,Gs,e,t);m.layers=this.layers,this.add(m);const p=new qn(Vs,Gs,e,t);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[s,o,l,u,f,m]=t;for(const p of t)this.remove(p);if(e===zi)s.up.set(0,1,0),s.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===Xl)s.up.set(0,-1,0),s.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of t)this.add(p),p.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,f,m,p,g]=this.children,x=e.getRenderTarget(),_=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),w=e.xr.enabled;e.xr.enabled=!1;const E=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,o),e.render(t,l),e.setRenderTarget(s,1,o),e.render(t,u),e.setRenderTarget(s,2,o),e.render(t,f),e.setRenderTarget(s,3,o),e.render(t,m),e.setRenderTarget(s,4,o),e.render(t,p),s.texture.generateMipmaps=E,e.setRenderTarget(s,5,o),e.render(t,g),e.setRenderTarget(x,_,M),e.xr.enabled=w,s.texture.needsPMREMUpdate=!0}}class uv extends Pn{constructor(e,t,s,o,l,u,f,m,p,g){e=e!==void 0?e:[],t=t!==void 0?t:ea,super(e,t,s,o,l,u,f,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class bS extends ns{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},o=[s,s,s,s,s,s];this.texture=new uv(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:oi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new ao(5,5,5),l=new Er({name:"CubemapFromEquirect",uniforms:ia(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Nn,blending:xr});l.uniforms.tEquirect.value=t;const u=new _i(o,l),f=t.minFilter;return t.minFilter===Jr&&(t.minFilter=oi),new CS(1,10,this).update(e,u),t.minFilter=f,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,s,o){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,s,o);e.setRenderTarget(l)}}const gd=new le,RS=new le,NS=new dt;class $r{constructor(e=new le(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,s,o){return this.normal.set(e,t,s),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,s){const o=gd.subVectors(s,t).cross(RS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const s=e.delta(gd),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/o;return l<0||l>1?null:t.copy(e.start).addScaledVector(s,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return t<0&&s>0||s<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const s=t||NS.getNormalMatrix(e),o=this.coplanarPoint(gd).applyMatrix4(e),l=this.normal.applyMatrix3(s).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new Kd,Ul=new le;class Zd{constructor(e=new $r,t=new $r,s=new $r,o=new $r,l=new $r,u=new $r){this.planes=[e,t,s,o,l,u]}set(e,t,s,o,l,u){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(s),f[3].copy(o),f[4].copy(l),f[5].copy(u),this}copy(e){const t=this.planes;for(let s=0;s<6;s++)t[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,t=zi){const s=this.planes,o=e.elements,l=o[0],u=o[1],f=o[2],m=o[3],p=o[4],g=o[5],x=o[6],_=o[7],M=o[8],w=o[9],E=o[10],S=o[11],y=o[12],A=o[13],b=o[14],D=o[15];if(s[0].setComponents(m-l,_-p,S-M,D-y).normalize(),s[1].setComponents(m+l,_+p,S+M,D+y).normalize(),s[2].setComponents(m+u,_+g,S+w,D+A).normalize(),s[3].setComponents(m-u,_-g,S-w,D-A).normalize(),s[4].setComponents(m-f,_-x,S-E,D-b).normalize(),t===zi)s[5].setComponents(m+f,_+x,S+E,D+b).normalize();else if(t===Xl)s[5].setComponents(f,x,E,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const t=this.planes,s=e.center,o=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(s)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let s=0;s<6;s++){const o=t[s];if(Ul.x=o.normal.x>0?e.max.x:e.min.x,Ul.y=o.normal.y>0?e.max.y:e.min.y,Ul.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Ul)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let s=0;s<6;s++)if(t[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function dv(){let r=null,e=!1,t=null,s=null;function o(l,u){t(l,u),s=r.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(s=r.requestAnimationFrame(o),e=!0)},stop:function(){r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){r=l}}}function PS(r){const e=new WeakMap;function t(f,m){const p=f.array,g=f.usage,x=p.byteLength,_=r.createBuffer();r.bindBuffer(m,_),r.bufferData(m,p,g),f.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(p instanceof Uint16Array)f.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:_,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:f.version,size:x}}function s(f,m,p){const g=m.array,x=m._updateRange,_=m.updateRanges;if(r.bindBuffer(p,f),x.count===-1&&_.length===0&&r.bufferSubData(p,0,g),_.length!==0){for(let M=0,w=_.length;M<w;M++){const E=_[M];r.bufferSubData(p,E.start*g.BYTES_PER_ELEMENT,g,E.start,E.count)}m.clearUpdateRanges()}x.count!==-1&&(r.bufferSubData(p,x.offset*g.BYTES_PER_ELEMENT,g,x.offset,x.count),x.count=-1),m.onUploadCallback()}function o(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const m=e.get(f);m&&(r.deleteBuffer(m.buffer),e.delete(f))}function u(f,m){if(f.isGLBufferAttribute){const g=e.get(f);(!g||g.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}f.isInterleavedBufferAttribute&&(f=f.data);const p=e.get(f);if(p===void 0)e.set(f,t(f,m));else if(p.version<f.version){if(p.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,f,m),p.version=f.version}}return{get:o,remove:l,update:u}}class tc extends Hi{constructor(e=1,t=1,s=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:s,heightSegments:o};const l=e/2,u=t/2,f=Math.floor(s),m=Math.floor(o),p=f+1,g=m+1,x=e/f,_=t/m,M=[],w=[],E=[],S=[];for(let y=0;y<g;y++){const A=y*_-u;for(let b=0;b<p;b++){const D=b*x-l;w.push(D,-A,0),E.push(0,0,1),S.push(b/f),S.push(1-y/m)}}for(let y=0;y<m;y++)for(let A=0;A<f;A++){const b=A+p*y,D=A+p*(y+1),$=A+1+p*(y+1),U=A+1+p*y;M.push(b,D,U),M.push(D,$,U)}this.setIndex(M),this.setAttribute("position",new Bi(w,3)),this.setAttribute("normal",new Bi(E,3)),this.setAttribute("uv",new Bi(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tc(e.width,e.height,e.widthSegments,e.heightSegments)}}var LS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,DS=`#ifdef USE_ALPHAHASH
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
#endif`,US=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,IS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,FS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,OS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kS=`#ifdef USE_AOMAP
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
#endif`,zS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,BS=`#ifdef USE_BATCHING
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
#endif`,jS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,HS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,VS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,GS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,WS=`#ifdef USE_IRIDESCENCE
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
#endif`,$S=`#ifdef USE_BUMPMAP
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
#endif`,qS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,YS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,KS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ZS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,JS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,QS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,eM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,tM=`#define PI 3.141592653589793
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
} // validated`,nM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,iM=`vec3 transformedNormal = objectNormal;
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
#endif`,rM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,aM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,oM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lM="gl_FragColor = linearToOutputTexel( gl_FragColor );",cM=`
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
}`,uM=`#ifdef USE_ENVMAP
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
#endif`,dM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fM=`#ifdef USE_ENVMAP
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
#endif`,hM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pM=`#ifdef USE_ENVMAP
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
#endif`,mM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_M=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xM=`#ifdef USE_GRADIENTMAP
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
}`,yM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,SM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,MM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,EM=`uniform bool receiveShadow;
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
#endif`,wM=`#ifdef USE_ENVMAP
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
#endif`,TM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,AM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,CM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,RM=`PhysicalMaterial material;
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
#endif`,NM=`struct PhysicalMaterial {
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
}`,PM=`
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
#endif`,LM=`#if defined( RE_IndirectDiffuse )
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
#endif`,DM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,UM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,IM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,FM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,OM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,BM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,jM=`#if defined( USE_POINTS_UV )
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
#endif`,HM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,VM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,GM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,WM=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$M=`#ifdef USE_MORPHNORMALS
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
#endif`,qM=`#ifdef USE_MORPHTARGETS
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
#endif`,YM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,KM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,ZM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,QM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,eE=`#ifdef USE_NORMALMAP
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
#endif`,tE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,iE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,aE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,oE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,uE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,dE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,gE=`float getShadowMask() {
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
}`,vE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_E=`#ifdef USE_SKINNING
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
#endif`,xE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yE=`#ifdef USE_SKINNING
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
#endif`,SE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ME=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,EE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,TE=`#ifdef USE_TRANSMISSION
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
#endif`,AE=`#ifdef USE_TRANSMISSION
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
#endif`,CE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,NE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const PE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,LE=`uniform sampler2D t2D;
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
}`,DE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,UE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,IE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,FE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,OE=`#include <common>
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
}`,kE=`#if DEPTH_PACKING == 3200
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
}`,zE=`#define DISTANCE
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
}`,BE=`#define DISTANCE
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
}`,jE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,HE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,VE=`uniform float scale;
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
}`,GE=`uniform vec3 diffuse;
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
}`,WE=`#include <common>
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
}`,$E=`uniform vec3 diffuse;
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
}`,qE=`#define LAMBERT
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
}`,YE=`#define MATCAP
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
}`,KE=`#define MATCAP
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
}`,ZE=`#define NORMAL
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
}`,JE=`#define NORMAL
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
}`,QE=`#define PHONG
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
}`,ew=`#define PHONG
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
}`,tw=`#define STANDARD
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
}`,nw=`#define STANDARD
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
}`,iw=`#define TOON
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
}`,rw=`#define TOON
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
}`,sw=`uniform float size;
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
}`,aw=`uniform vec3 diffuse;
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
}`,ow=`#include <common>
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
}`,lw=`uniform vec3 color;
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
}`,cw=`uniform float rotation;
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
}`,uw=`uniform vec3 diffuse;
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
}`,ut={alphahash_fragment:LS,alphahash_pars_fragment:DS,alphamap_fragment:US,alphamap_pars_fragment:IS,alphatest_fragment:FS,alphatest_pars_fragment:OS,aomap_fragment:kS,aomap_pars_fragment:zS,batching_pars_vertex:BS,batching_vertex:jS,begin_vertex:HS,beginnormal_vertex:VS,bsdfs:GS,iridescence_fragment:WS,bumpmap_pars_fragment:$S,clipping_planes_fragment:XS,clipping_planes_pars_fragment:qS,clipping_planes_pars_vertex:YS,clipping_planes_vertex:KS,color_fragment:ZS,color_pars_fragment:JS,color_pars_vertex:QS,color_vertex:eM,common:tM,cube_uv_reflection_fragment:nM,defaultnormal_vertex:iM,displacementmap_pars_vertex:rM,displacementmap_vertex:sM,emissivemap_fragment:aM,emissivemap_pars_fragment:oM,colorspace_fragment:lM,colorspace_pars_fragment:cM,envmap_fragment:uM,envmap_common_pars_fragment:dM,envmap_pars_fragment:fM,envmap_pars_vertex:hM,envmap_physical_pars_fragment:wM,envmap_vertex:pM,fog_vertex:mM,fog_pars_vertex:gM,fog_fragment:vM,fog_pars_fragment:_M,gradientmap_pars_fragment:xM,lightmap_pars_fragment:yM,lights_lambert_fragment:SM,lights_lambert_pars_fragment:MM,lights_pars_begin:EM,lights_toon_fragment:TM,lights_toon_pars_fragment:AM,lights_phong_fragment:CM,lights_phong_pars_fragment:bM,lights_physical_fragment:RM,lights_physical_pars_fragment:NM,lights_fragment_begin:PM,lights_fragment_maps:LM,lights_fragment_end:DM,logdepthbuf_fragment:UM,logdepthbuf_pars_fragment:IM,logdepthbuf_pars_vertex:FM,logdepthbuf_vertex:OM,map_fragment:kM,map_pars_fragment:zM,map_particle_fragment:BM,map_particle_pars_fragment:jM,metalnessmap_fragment:HM,metalnessmap_pars_fragment:VM,morphinstance_vertex:GM,morphcolor_vertex:WM,morphnormal_vertex:$M,morphtarget_pars_vertex:XM,morphtarget_vertex:qM,normal_fragment_begin:YM,normal_fragment_maps:KM,normal_pars_fragment:ZM,normal_pars_vertex:JM,normal_vertex:QM,normalmap_pars_fragment:eE,clearcoat_normal_fragment_begin:tE,clearcoat_normal_fragment_maps:nE,clearcoat_pars_fragment:iE,iridescence_pars_fragment:rE,opaque_fragment:sE,packing:aE,premultiplied_alpha_fragment:oE,project_vertex:lE,dithering_fragment:cE,dithering_pars_fragment:uE,roughnessmap_fragment:dE,roughnessmap_pars_fragment:fE,shadowmap_pars_fragment:hE,shadowmap_pars_vertex:pE,shadowmap_vertex:mE,shadowmask_pars_fragment:gE,skinbase_vertex:vE,skinning_pars_vertex:_E,skinning_vertex:xE,skinnormal_vertex:yE,specularmap_fragment:SE,specularmap_pars_fragment:ME,tonemapping_fragment:EE,tonemapping_pars_fragment:wE,transmission_fragment:TE,transmission_pars_fragment:AE,uv_pars_fragment:CE,uv_pars_vertex:bE,uv_vertex:RE,worldpos_vertex:NE,background_vert:PE,background_frag:LE,backgroundCube_vert:DE,backgroundCube_frag:UE,cube_vert:IE,cube_frag:FE,depth_vert:OE,depth_frag:kE,distanceRGBA_vert:zE,distanceRGBA_frag:BE,equirect_vert:jE,equirect_frag:HE,linedashed_vert:VE,linedashed_frag:GE,meshbasic_vert:WE,meshbasic_frag:$E,meshlambert_vert:XE,meshlambert_frag:qE,meshmatcap_vert:YE,meshmatcap_frag:KE,meshnormal_vert:ZE,meshnormal_frag:JE,meshphong_vert:QE,meshphong_frag:ew,meshphysical_vert:tw,meshphysical_frag:nw,meshtoon_vert:iw,meshtoon_frag:rw,points_vert:sw,points_frag:aw,shadow_vert:ow,shadow_frag:lw,sprite_vert:cw,sprite_frag:uw},Ue={common:{diffuse:{value:new Mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new Mt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},pi={basic:{uniforms:xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:ut.meshbasic_vert,fragmentShader:ut.meshbasic_frag},lambert:{uniforms:xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Mt(0)}}]),vertexShader:ut.meshlambert_vert,fragmentShader:ut.meshlambert_frag},phong:{uniforms:xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Mt(0)},specular:{value:new Mt(1118481)},shininess:{value:30}}]),vertexShader:ut.meshphong_vert,fragmentShader:ut.meshphong_frag},standard:{uniforms:xn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new Mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag},toon:{uniforms:xn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new Mt(0)}}]),vertexShader:ut.meshtoon_vert,fragmentShader:ut.meshtoon_frag},matcap:{uniforms:xn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:ut.meshmatcap_vert,fragmentShader:ut.meshmatcap_frag},points:{uniforms:xn([Ue.points,Ue.fog]),vertexShader:ut.points_vert,fragmentShader:ut.points_frag},dashed:{uniforms:xn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ut.linedashed_vert,fragmentShader:ut.linedashed_frag},depth:{uniforms:xn([Ue.common,Ue.displacementmap]),vertexShader:ut.depth_vert,fragmentShader:ut.depth_frag},normal:{uniforms:xn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:ut.meshnormal_vert,fragmentShader:ut.meshnormal_frag},sprite:{uniforms:xn([Ue.sprite,Ue.fog]),vertexShader:ut.sprite_vert,fragmentShader:ut.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ut.background_vert,fragmentShader:ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:ut.backgroundCube_vert,fragmentShader:ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ut.cube_vert,fragmentShader:ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ut.equirect_vert,fragmentShader:ut.equirect_frag},distanceRGBA:{uniforms:xn([Ue.common,Ue.displacementmap,{referencePosition:{value:new le},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ut.distanceRGBA_vert,fragmentShader:ut.distanceRGBA_frag},shadow:{uniforms:xn([Ue.lights,Ue.fog,{color:{value:new Mt(0)},opacity:{value:1}}]),vertexShader:ut.shadow_vert,fragmentShader:ut.shadow_frag}};pi.physical={uniforms:xn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new Mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new Mt(0)},specularColor:{value:new Mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag};const Il={r:0,b:0,g:0},Gr=new Si,dw=new Bt;function fw(r,e,t,s,o,l,u){const f=new Mt(0);let m=l===!0?0:1,p,g,x=null,_=0,M=null;function w(A){let b=A.isScene===!0?A.background:null;return b&&b.isTexture&&(b=(A.backgroundBlurriness>0?t:e).get(b)),b}function E(A){let b=!1;const D=w(A);D===null?y(f,m):D&&D.isColor&&(y(D,1),b=!0);const $=r.xr.getEnvironmentBlendMode();$==="additive"?s.buffers.color.setClear(0,0,0,1,u):$==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,u),(r.autoClear||b)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil)}function S(A,b){const D=w(b);D&&(D.isCubeTexture||D.mapping===Jl)?(g===void 0&&(g=new _i(new ao(1,1,1),new Er({name:"BackgroundCubeMaterial",uniforms:ia(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function($,U,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(g)),Gr.copy(b.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),g.material.uniforms.envMap.value=D,g.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(dw.makeRotationFromEuler(Gr)),g.material.toneMapped=Tt.getTransfer(D.colorSpace)!==Lt,(x!==D||_!==D.version||M!==r.toneMapping)&&(g.material.needsUpdate=!0,x=D,_=D.version,M=r.toneMapping),g.layers.enableAll(),A.unshift(g,g.geometry,g.material,0,0,null)):D&&D.isTexture&&(p===void 0&&(p=new _i(new tc(2,2),new Er({name:"BackgroundMaterial",uniforms:ia(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(p)),p.material.uniforms.t2D.value=D,p.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,p.material.toneMapped=Tt.getTransfer(D.colorSpace)!==Lt,D.matrixAutoUpdate===!0&&D.updateMatrix(),p.material.uniforms.uvTransform.value.copy(D.matrix),(x!==D||_!==D.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,x=D,_=D.version,M=r.toneMapping),p.layers.enableAll(),A.unshift(p,p.geometry,p.material,0,0,null))}function y(A,b){A.getRGB(Il,lv(r)),s.buffers.color.setClear(Il.r,Il.g,Il.b,b,u)}return{getClearColor:function(){return f},setClearColor:function(A,b=1){f.set(A),m=b,y(f,m)},getClearAlpha:function(){return m},setClearAlpha:function(A){m=A,y(f,m)},render:E,addToRenderList:S}}function hw(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},o=_(null);let l=o,u=!1;function f(C,j,X,z,ne){let ue=!1;const G=x(z,X,j);l!==G&&(l=G,p(l.object)),ue=M(C,z,X,ne),ue&&w(C,z,X,ne),ne!==null&&e.update(ne,r.ELEMENT_ARRAY_BUFFER),(ue||u)&&(u=!1,D(C,j,X,z),ne!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(ne).buffer))}function m(){return r.createVertexArray()}function p(C){return r.bindVertexArray(C)}function g(C){return r.deleteVertexArray(C)}function x(C,j,X){const z=X.wireframe===!0;let ne=s[C.id];ne===void 0&&(ne={},s[C.id]=ne);let ue=ne[j.id];ue===void 0&&(ue={},ne[j.id]=ue);let G=ue[z];return G===void 0&&(G=_(m()),ue[z]=G),G}function _(C){const j=[],X=[],z=[];for(let ne=0;ne<t;ne++)j[ne]=0,X[ne]=0,z[ne]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:j,enabledAttributes:X,attributeDivisors:z,object:C,attributes:{},index:null}}function M(C,j,X,z){const ne=l.attributes,ue=j.attributes;let G=0;const Y=X.getAttributes();for(const F in Y)if(Y[F].location>=0){const ee=ne[F];let O=ue[F];if(O===void 0&&(F==="instanceMatrix"&&C.instanceMatrix&&(O=C.instanceMatrix),F==="instanceColor"&&C.instanceColor&&(O=C.instanceColor)),ee===void 0||ee.attribute!==O||O&&ee.data!==O.data)return!0;G++}return l.attributesNum!==G||l.index!==z}function w(C,j,X,z){const ne={},ue=j.attributes;let G=0;const Y=X.getAttributes();for(const F in Y)if(Y[F].location>=0){let ee=ue[F];ee===void 0&&(F==="instanceMatrix"&&C.instanceMatrix&&(ee=C.instanceMatrix),F==="instanceColor"&&C.instanceColor&&(ee=C.instanceColor));const O={};O.attribute=ee,ee&&ee.data&&(O.data=ee.data),ne[F]=O,G++}l.attributes=ne,l.attributesNum=G,l.index=z}function E(){const C=l.newAttributes;for(let j=0,X=C.length;j<X;j++)C[j]=0}function S(C){y(C,0)}function y(C,j){const X=l.newAttributes,z=l.enabledAttributes,ne=l.attributeDivisors;X[C]=1,z[C]===0&&(r.enableVertexAttribArray(C),z[C]=1),ne[C]!==j&&(r.vertexAttribDivisor(C,j),ne[C]=j)}function A(){const C=l.newAttributes,j=l.enabledAttributes;for(let X=0,z=j.length;X<z;X++)j[X]!==C[X]&&(r.disableVertexAttribArray(X),j[X]=0)}function b(C,j,X,z,ne,ue,G){G===!0?r.vertexAttribIPointer(C,j,X,ne,ue):r.vertexAttribPointer(C,j,X,z,ne,ue)}function D(C,j,X,z){E();const ne=z.attributes,ue=X.getAttributes(),G=j.defaultAttributeValues;for(const Y in ue){const F=ue[Y];if(F.location>=0){let re=ne[Y];if(re===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(re=C.instanceColor)),re!==void 0){const ee=re.normalized,O=re.itemSize,ce=e.get(re);if(ce===void 0)continue;const ke=ce.buffer,te=ce.type,he=ce.bytesPerElement,we=te===r.INT||te===r.UNSIGNED_INT||re.gpuType===$g;if(re.isInterleavedBufferAttribute){const _e=re.data,Ae=_e.stride,Ie=re.offset;if(_e.isInstancedInterleavedBuffer){for(let K=0;K<F.locationSize;K++)y(F.location+K,_e.meshPerAttribute);C.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let K=0;K<F.locationSize;K++)S(F.location+K);r.bindBuffer(r.ARRAY_BUFFER,ke);for(let K=0;K<F.locationSize;K++)b(F.location+K,O/F.locationSize,te,ee,Ae*he,(Ie+O/F.locationSize*K)*he,we)}else{if(re.isInstancedBufferAttribute){for(let _e=0;_e<F.locationSize;_e++)y(F.location+_e,re.meshPerAttribute);C.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let _e=0;_e<F.locationSize;_e++)S(F.location+_e);r.bindBuffer(r.ARRAY_BUFFER,ke);for(let _e=0;_e<F.locationSize;_e++)b(F.location+_e,O/F.locationSize,te,ee,O*he,O/F.locationSize*_e*he,we)}}else if(G!==void 0){const ee=G[Y];if(ee!==void 0)switch(ee.length){case 2:r.vertexAttrib2fv(F.location,ee);break;case 3:r.vertexAttrib3fv(F.location,ee);break;case 4:r.vertexAttrib4fv(F.location,ee);break;default:r.vertexAttrib1fv(F.location,ee)}}}}A()}function $(){q();for(const C in s){const j=s[C];for(const X in j){const z=j[X];for(const ne in z)g(z[ne].object),delete z[ne];delete j[X]}delete s[C]}}function U(C){if(s[C.id]===void 0)return;const j=s[C.id];for(const X in j){const z=j[X];for(const ne in z)g(z[ne].object),delete z[ne];delete j[X]}delete s[C.id]}function L(C){for(const j in s){const X=s[j];if(X[C.id]===void 0)continue;const z=X[C.id];for(const ne in z)g(z[ne].object),delete z[ne];delete X[C.id]}}function q(){N(),u=!0,l!==o&&(l=o,p(l.object))}function N(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:f,reset:q,resetDefaultState:N,dispose:$,releaseStatesOfGeometry:U,releaseStatesOfProgram:L,initAttributes:E,enableAttribute:S,disableUnusedAttributes:A}}function pw(r,e,t){let s;function o(p){s=p}function l(p,g){r.drawArrays(s,p,g),t.update(g,s,1)}function u(p,g,x){x!==0&&(r.drawArraysInstanced(s,p,g,x),t.update(g,s,x))}function f(p,g,x){if(x===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let M=0;M<x;M++)this.render(p[M],g[M]);else{_.multiDrawArraysWEBGL(s,p,0,g,0,x);let M=0;for(let w=0;w<x;w++)M+=g[w];t.update(M,s,1)}}function m(p,g,x,_){if(x===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let w=0;w<p.length;w++)u(p[w],g[w],_[w]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,g,0,_,0,x);let w=0;for(let E=0;E<x;E++)w+=g[E];for(let E=0;E<_.length;E++)t.update(w,s,_[E])}}this.setMode=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=f,this.renderMultiDrawInstances=m}function mw(r,e,t,s){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");o=r.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function u(U){return!(U!==vi&&s.convert(U)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(U){const L=U===Ql&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==Mr&&s.convert(U)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==_r&&!L)}function m(U){if(U==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=t.precision!==void 0?t.precision:"highp";const g=m(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const x=t.logarithmicDepthBuffer===!0,_=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=r.getParameter(r.MAX_TEXTURE_SIZE),E=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),S=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),A=r.getParameter(r.MAX_VARYING_VECTORS),b=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),D=M>0,$=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:m,textureFormatReadable:u,textureTypeReadable:f,precision:p,logarithmicDepthBuffer:x,maxTextures:_,maxVertexTextures:M,maxTextureSize:w,maxCubemapSize:E,maxAttributes:S,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:b,vertexTextures:D,maxSamples:$}}function gw(r){const e=this;let t=null,s=0,o=!1,l=!1;const u=new $r,f=new dt,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(x,_){const M=x.length!==0||_||s!==0||o;return o=_,s=x.length,M},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(x,_){t=g(x,_,0)},this.setState=function(x,_,M){const w=x.clippingPlanes,E=x.clipIntersection,S=x.clipShadows,y=r.get(x);if(!o||w===null||w.length===0||l&&!S)l?g(null):p();else{const A=l?0:s,b=A*4;let D=y.clippingState||null;m.value=D,D=g(w,_,b,M);for(let $=0;$!==b;++$)D[$]=t[$];y.clippingState=D,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=A}};function p(){m.value!==t&&(m.value=t,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(x,_,M,w){const E=x!==null?x.length:0;let S=null;if(E!==0){if(S=m.value,w!==!0||S===null){const y=M+E*4,A=_.matrixWorldInverse;f.getNormalMatrix(A),(S===null||S.length<y)&&(S=new Float32Array(y));for(let b=0,D=M;b!==E;++b,D+=4)u.copy(x[b]).applyMatrix4(A,f),u.normal.toArray(S,D),S[D+3]=u.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,S}}function vw(r){let e=new WeakMap;function t(u,f){return f===Ld?u.mapping=ea:f===Dd&&(u.mapping=ta),u}function s(u){if(u&&u.isTexture){const f=u.mapping;if(f===Ld||f===Dd)if(e.has(u)){const m=e.get(u).texture;return t(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const p=new bS(m.height);return p.fromEquirectangularTexture(r,u),e.set(u,p),u.addEventListener("dispose",o),t(p.texture,u.mapping)}else return null}}return u}function o(u){const f=u.target;f.removeEventListener("dispose",o);const m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function l(){e=new WeakMap}return{get:s,dispose:l}}class fv extends cv{constructor(e=-1,t=1,s=1,o=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=s,this.bottom=o,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,s,o,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=s-e,u=s+e,f=o+t,m=o-t;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,u=l+p*this.view.width,f-=g*this.view.offsetY,m=f-g*this.view.height}this.projectionMatrix.makeOrthographic(l,u,f,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Xs=4,qm=[.125,.215,.35,.446,.526,.582],Yr=20,vd=new fv,Ym=new Mt;let _d=null,xd=0,yd=0,Sd=!1;const Xr=(1+Math.sqrt(5))/2,Ws=1/Xr,Km=[new le(-Xr,Ws,0),new le(Xr,Ws,0),new le(-Ws,0,Xr),new le(Ws,0,Xr),new le(0,Xr,-Ws),new le(0,Xr,Ws),new le(-1,1,-1),new le(1,1,-1),new le(-1,1,1),new le(1,1,1)];class Zm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,s=.1,o=100){_d=this._renderer.getRenderTarget(),xd=this._renderer.getActiveCubeFace(),yd=this._renderer.getActiveMipmapLevel(),Sd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,s,o,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=eg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_d,xd,yd),this._renderer.xr.enabled=Sd,e.scissorTest=!1,Fl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ea||e.mapping===ta?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_d=this._renderer.getRenderTarget(),xd=this._renderer.getActiveCubeFace(),yd=this._renderer.getActiveMipmapLevel(),Sd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=t||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,s={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Ql,format:vi,colorSpace:Tr,depthBuffer:!1},o=Jm(e,t,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jm(e,t,s);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_w(l)),this._blurMaterial=xw(l,e,t)}return o}_compileMaterial(e){const t=new _i(this._lodPlanes[0],e);this._renderer.compile(t,vd)}_sceneToCubeUV(e,t,s,o){const f=new qn(90,1,t,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,x=g.autoClear,_=g.toneMapping;g.getClearColor(Ym),g.toneMapping=yr,g.autoClear=!1;const M=new sv({name:"PMREM.Background",side:Nn,depthWrite:!1,depthTest:!1}),w=new _i(new ao,M);let E=!1;const S=e.background;S?S.isColor&&(M.color.copy(S),e.background=null,E=!0):(M.color.copy(Ym),E=!0);for(let y=0;y<6;y++){const A=y%3;A===0?(f.up.set(0,m[y],0),f.lookAt(p[y],0,0)):A===1?(f.up.set(0,0,m[y]),f.lookAt(0,p[y],0)):(f.up.set(0,m[y],0),f.lookAt(0,0,p[y]));const b=this._cubeSize;Fl(o,A*b,y>2?b:0,b,b),g.setRenderTarget(o),E&&g.render(w,f),g.render(e,f)}w.geometry.dispose(),w.material.dispose(),g.toneMapping=_,g.autoClear=x,e.background=S}_textureToCubeUV(e,t){const s=this._renderer,o=e.mapping===ea||e.mapping===ta;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=eg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qm());const l=o?this._cubemapMaterial:this._equirectMaterial,u=new _i(this._lodPlanes[0],l),f=l.uniforms;f.envMap.value=e;const m=this._cubeSize;Fl(t,0,0,3*m,2*m),s.setRenderTarget(t),s.render(u,vd)}_applyPMREM(e){const t=this._renderer,s=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let l=1;l<o;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),f=Km[(o-l-1)%Km.length];this._blur(e,l-1,l,u,f)}t.autoClear=s}_blur(e,t,s,o,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,s,o,"latitudinal",l),this._halfBlur(u,e,s,s,o,"longitudinal",l)}_halfBlur(e,t,s,o,l,u,f){const m=this._renderer,p=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,x=new _i(this._lodPlanes[o],p),_=p.uniforms,M=this._sizeLods[s]-1,w=isFinite(l)?Math.PI/(2*M):2*Math.PI/(2*Yr-1),E=l/w,S=isFinite(l)?1+Math.floor(g*E):Yr;S>Yr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Yr}`);const y=[];let A=0;for(let L=0;L<Yr;++L){const q=L/E,N=Math.exp(-q*q/2);y.push(N),L===0?A+=N:L<S&&(A+=2*N)}for(let L=0;L<y.length;L++)y[L]=y[L]/A;_.envMap.value=e.texture,_.samples.value=S,_.weights.value=y,_.latitudinal.value=u==="latitudinal",f&&(_.poleAxis.value=f);const{_lodMax:b}=this;_.dTheta.value=w,_.mipInt.value=b-s;const D=this._sizeLods[o],$=3*D*(o>b-Xs?o-b+Xs:0),U=4*(this._cubeSize-D);Fl(t,$,U,3*D,2*D),m.setRenderTarget(t),m.render(x,vd)}}function _w(r){const e=[],t=[],s=[];let o=r;const l=r-Xs+1+qm.length;for(let u=0;u<l;u++){const f=Math.pow(2,o);t.push(f);let m=1/f;u>r-Xs?m=qm[u-r+Xs-1]:u===0&&(m=0),s.push(m);const p=1/(f-2),g=-p,x=1+p,_=[g,g,x,g,x,x,g,g,x,x,g,x],M=6,w=6,E=3,S=2,y=1,A=new Float32Array(E*w*M),b=new Float32Array(S*w*M),D=new Float32Array(y*w*M);for(let U=0;U<M;U++){const L=U%3*2/3-1,q=U>2?0:-1,N=[L,q,0,L+2/3,q,0,L+2/3,q+1,0,L,q,0,L+2/3,q+1,0,L,q+1,0];A.set(N,E*w*U),b.set(_,S*w*U);const C=[U,U,U,U,U,U];D.set(C,y*w*U)}const $=new Hi;$.setAttribute("position",new Bn(A,E)),$.setAttribute("uv",new Bn(b,S)),$.setAttribute("faceIndex",new Bn(D,y)),e.push($),o>Xs&&o--}return{lodPlanes:e,sizeLods:t,sigmas:s}}function Jm(r,e,t){const s=new ns(r,e,t);return s.texture.mapping=Jl,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Fl(r,e,t,s,o){r.viewport.set(e,t,s,o),r.scissor.set(e,t,s,o)}function xw(r,e,t){const s=new Float32Array(Yr),o=new le(0,1,0);return new Er({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Qm(){return new Er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function eg(){return new Er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Jd(){return`

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
	`}function yw(r){let e=new WeakMap,t=null;function s(f){if(f&&f.isTexture){const m=f.mapping,p=m===Ld||m===Dd,g=m===ea||m===ta;if(p||g){let x=e.get(f);const _=x!==void 0?x.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==_)return t===null&&(t=new Zm(r)),x=p?t.fromEquirectangular(f,x):t.fromCubemap(f,x),x.texture.pmremVersion=f.pmremVersion,e.set(f,x),x.texture;if(x!==void 0)return x.texture;{const M=f.image;return p&&M&&M.height>0||g&&M&&o(M)?(t===null&&(t=new Zm(r)),x=p?t.fromEquirectangular(f):t.fromCubemap(f),x.texture.pmremVersion=f.pmremVersion,e.set(f,x),f.addEventListener("dispose",l),x.texture):null}}}return f}function o(f){let m=0;const p=6;for(let g=0;g<p;g++)f[g]!==void 0&&m++;return m===p}function l(f){const m=f.target;m.removeEventListener("dispose",l);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:s,dispose:u}}function Sw(r){const e={};function t(s){if(e[s]!==void 0)return e[s];let o;switch(s){case"WEBGL_depth_texture":o=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=r.getExtension(s)}return e[s]=o,o}return{has:function(s){return t(s)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(s){const o=t(s);return o===null&&console.warn("THREE.WebGLRenderer: "+s+" extension not supported."),o}}}function Mw(r,e,t,s){const o={},l=new WeakMap;function u(x){const _=x.target;_.index!==null&&e.remove(_.index);for(const w in _.attributes)e.remove(_.attributes[w]);for(const w in _.morphAttributes){const E=_.morphAttributes[w];for(let S=0,y=E.length;S<y;S++)e.remove(E[S])}_.removeEventListener("dispose",u),delete o[_.id];const M=l.get(_);M&&(e.remove(M),l.delete(_)),s.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function f(x,_){return o[_.id]===!0||(_.addEventListener("dispose",u),o[_.id]=!0,t.memory.geometries++),_}function m(x){const _=x.attributes;for(const w in _)e.update(_[w],r.ARRAY_BUFFER);const M=x.morphAttributes;for(const w in M){const E=M[w];for(let S=0,y=E.length;S<y;S++)e.update(E[S],r.ARRAY_BUFFER)}}function p(x){const _=[],M=x.index,w=x.attributes.position;let E=0;if(M!==null){const A=M.array;E=M.version;for(let b=0,D=A.length;b<D;b+=3){const $=A[b+0],U=A[b+1],L=A[b+2];_.push($,U,U,L,L,$)}}else if(w!==void 0){const A=w.array;E=w.version;for(let b=0,D=A.length/3-1;b<D;b+=3){const $=b+0,U=b+1,L=b+2;_.push($,U,U,L,L,$)}}else return;const S=new(ev(_)?ov:av)(_,1);S.version=E;const y=l.get(x);y&&e.remove(y),l.set(x,S)}function g(x){const _=l.get(x);if(_){const M=x.index;M!==null&&_.version<M.version&&p(x)}else p(x);return l.get(x)}return{get:f,update:m,getWireframeAttribute:g}}function Ew(r,e,t){let s;function o(_){s=_}let l,u;function f(_){l=_.type,u=_.bytesPerElement}function m(_,M){r.drawElements(s,M,l,_*u),t.update(M,s,1)}function p(_,M,w){w!==0&&(r.drawElementsInstanced(s,M,l,_*u,w),t.update(M,s,w))}function g(_,M,w){if(w===0)return;const E=e.get("WEBGL_multi_draw");if(E===null)for(let S=0;S<w;S++)this.render(_[S]/u,M[S]);else{E.multiDrawElementsWEBGL(s,M,0,l,_,0,w);let S=0;for(let y=0;y<w;y++)S+=M[y];t.update(S,s,1)}}function x(_,M,w,E){if(w===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let y=0;y<_.length;y++)p(_[y]/u,M[y],E[y]);else{S.multiDrawElementsInstancedWEBGL(s,M,0,l,_,0,E,0,w);let y=0;for(let A=0;A<w;A++)y+=M[A];for(let A=0;A<E.length;A++)t.update(y,s,E[A])}}this.setMode=o,this.setIndex=f,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=x}function ww(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function s(l,u,f){switch(t.calls++,u){case r.TRIANGLES:t.triangles+=f*(l/3);break;case r.LINES:t.lines+=f*(l/2);break;case r.LINE_STRIP:t.lines+=f*(l-1);break;case r.LINE_LOOP:t.lines+=f*l;break;case r.POINTS:t.points+=f*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:s}}function Tw(r,e,t){const s=new WeakMap,o=new rn;function l(u,f,m){const p=u.morphTargetInfluences,g=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,x=g!==void 0?g.length:0;let _=s.get(f);if(_===void 0||_.count!==x){let C=function(){q.dispose(),s.delete(f),f.removeEventListener("dispose",C)};var M=C;_!==void 0&&_.texture.dispose();const w=f.morphAttributes.position!==void 0,E=f.morphAttributes.normal!==void 0,S=f.morphAttributes.color!==void 0,y=f.morphAttributes.position||[],A=f.morphAttributes.normal||[],b=f.morphAttributes.color||[];let D=0;w===!0&&(D=1),E===!0&&(D=2),S===!0&&(D=3);let $=f.attributes.position.count*D,U=1;$>e.maxTextureSize&&(U=Math.ceil($/e.maxTextureSize),$=e.maxTextureSize);const L=new Float32Array($*U*4*x),q=new nv(L,$,U,x);q.type=_r,q.needsUpdate=!0;const N=D*4;for(let j=0;j<x;j++){const X=y[j],z=A[j],ne=b[j],ue=$*U*4*j;for(let G=0;G<X.count;G++){const Y=G*N;w===!0&&(o.fromBufferAttribute(X,G),L[ue+Y+0]=o.x,L[ue+Y+1]=o.y,L[ue+Y+2]=o.z,L[ue+Y+3]=0),E===!0&&(o.fromBufferAttribute(z,G),L[ue+Y+4]=o.x,L[ue+Y+5]=o.y,L[ue+Y+6]=o.z,L[ue+Y+7]=0),S===!0&&(o.fromBufferAttribute(ne,G),L[ue+Y+8]=o.x,L[ue+Y+9]=o.y,L[ue+Y+10]=o.z,L[ue+Y+11]=ne.itemSize===4?o.w:1)}}_={count:x,texture:q,size:new _t($,U)},s.set(f,_),f.addEventListener("dispose",C)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",u.morphTexture,t);else{let w=0;for(let S=0;S<p.length;S++)w+=p[S];const E=f.morphTargetsRelative?1:1-w;m.getUniforms().setValue(r,"morphTargetBaseInfluence",E),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",_.texture,t),m.getUniforms().setValue(r,"morphTargetsTextureSize",_.size)}return{update:l}}function Aw(r,e,t,s){let o=new WeakMap;function l(m){const p=s.render.frame,g=m.geometry,x=e.get(m,g);if(o.get(x)!==p&&(e.update(x),o.set(x,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",f)===!1&&m.addEventListener("dispose",f),o.get(m)!==p&&(t.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&t.update(m.instanceColor,r.ARRAY_BUFFER),o.set(m,p))),m.isSkinnedMesh){const _=m.skeleton;o.get(_)!==p&&(_.update(),o.set(_,p))}return x}function u(){o=new WeakMap}function f(m){const p=m.target;p.removeEventListener("dispose",f),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:l,dispose:u}}class hv extends Pn{constructor(e,t,s,o,l,u,f,m,p,g){if(g=g!==void 0?g:Ks,g!==Ks&&g!==eo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Ks&&(s=na),s===void 0&&g===eo&&(s=no),super(null,o,l,u,f,m,g,s,p),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=f!==void 0?f:Kn,this.minFilter=m!==void 0?m:Kn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const pv=new Pn,mv=new hv(1,1);mv.compareFunction=Qg;const gv=new nv,vv=new dS,_v=new uv,tg=[],ng=[],ig=new Float32Array(16),rg=new Float32Array(9),sg=new Float32Array(4);function oa(r,e,t){const s=r[0];if(s<=0||s>0)return r;const o=e*t;let l=tg[o];if(l===void 0&&(l=new Float32Array(o),tg[o]=l),e!==0){s.toArray(l,0);for(let u=1,f=0;u!==e;++u)f+=t,r[u].toArray(l,f)}return l}function Yt(r,e){if(r.length!==e.length)return!1;for(let t=0,s=r.length;t<s;t++)if(r[t]!==e[t])return!1;return!0}function Kt(r,e){for(let t=0,s=e.length;t<s;t++)r[t]=e[t]}function nc(r,e){let t=ng[e];t===void 0&&(t=new Int32Array(e),ng[e]=t);for(let s=0;s!==e;++s)t[s]=r.allocateTextureUnit();return t}function Cw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function bw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2fv(this.addr,e),Kt(t,e)}}function Rw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;r.uniform3fv(this.addr,e),Kt(t,e)}}function Nw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4fv(this.addr,e),Kt(t,e)}}function Pw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;sg.set(s),r.uniformMatrix2fv(this.addr,!1,sg),Kt(t,s)}}function Lw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;rg.set(s),r.uniformMatrix3fv(this.addr,!1,rg),Kt(t,s)}}function Dw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;ig.set(s),r.uniformMatrix4fv(this.addr,!1,ig),Kt(t,s)}}function Uw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Iw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2iv(this.addr,e),Kt(t,e)}}function Fw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3iv(this.addr,e),Kt(t,e)}}function Ow(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4iv(this.addr,e),Kt(t,e)}}function kw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function zw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2uiv(this.addr,e),Kt(t,e)}}function Bw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3uiv(this.addr,e),Kt(t,e)}}function jw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4uiv(this.addr,e),Kt(t,e)}}function Hw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o);const l=this.type===r.SAMPLER_2D_SHADOW?mv:pv;t.setTexture2D(e||l,o)}function Vw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture3D(e||vv,o)}function Gw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTextureCube(e||_v,o)}function Ww(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture2DArray(e||gv,o)}function $w(r){switch(r){case 5126:return Cw;case 35664:return bw;case 35665:return Rw;case 35666:return Nw;case 35674:return Pw;case 35675:return Lw;case 35676:return Dw;case 5124:case 35670:return Uw;case 35667:case 35671:return Iw;case 35668:case 35672:return Fw;case 35669:case 35673:return Ow;case 5125:return kw;case 36294:return zw;case 36295:return Bw;case 36296:return jw;case 35678:case 36198:case 36298:case 36306:case 35682:return Hw;case 35679:case 36299:case 36307:return Vw;case 35680:case 36300:case 36308:case 36293:return Gw;case 36289:case 36303:case 36311:case 36292:return Ww}}function Xw(r,e){r.uniform1fv(this.addr,e)}function qw(r,e){const t=oa(e,this.size,2);r.uniform2fv(this.addr,t)}function Yw(r,e){const t=oa(e,this.size,3);r.uniform3fv(this.addr,t)}function Kw(r,e){const t=oa(e,this.size,4);r.uniform4fv(this.addr,t)}function Zw(r,e){const t=oa(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Jw(r,e){const t=oa(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Qw(r,e){const t=oa(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function eT(r,e){r.uniform1iv(this.addr,e)}function tT(r,e){r.uniform2iv(this.addr,e)}function nT(r,e){r.uniform3iv(this.addr,e)}function iT(r,e){r.uniform4iv(this.addr,e)}function rT(r,e){r.uniform1uiv(this.addr,e)}function sT(r,e){r.uniform2uiv(this.addr,e)}function aT(r,e){r.uniform3uiv(this.addr,e)}function oT(r,e){r.uniform4uiv(this.addr,e)}function lT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture2D(e[u]||pv,l[u])}function cT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture3D(e[u]||vv,l[u])}function uT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTextureCube(e[u]||_v,l[u])}function dT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let u=0;u!==o;++u)t.setTexture2DArray(e[u]||gv,l[u])}function fT(r){switch(r){case 5126:return Xw;case 35664:return qw;case 35665:return Yw;case 35666:return Kw;case 35674:return Zw;case 35675:return Jw;case 35676:return Qw;case 5124:case 35670:return eT;case 35667:case 35671:return tT;case 35668:case 35672:return nT;case 35669:case 35673:return iT;case 5125:return rT;case 36294:return sT;case 36295:return aT;case 36296:return oT;case 35678:case 36198:case 36298:case 36306:case 35682:return lT;case 35679:case 36299:case 36307:return cT;case 35680:case 36300:case 36308:case 36293:return uT;case 36289:case 36303:case 36311:case 36292:return dT}}class hT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.setValue=$w(t.type)}}class pT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=fT(t.type)}}class mT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,s){const o=this.seq;for(let l=0,u=o.length;l!==u;++l){const f=o[l];f.setValue(e,t[f.id],s)}}}const Md=/(\w+)(\])?(\[|\.)?/g;function ag(r,e){r.seq.push(e),r.map[e.id]=e}function gT(r,e,t){const s=r.name,o=s.length;for(Md.lastIndex=0;;){const l=Md.exec(s),u=Md.lastIndex;let f=l[1];const m=l[2]==="]",p=l[3];if(m&&(f=f|0),p===void 0||p==="["&&u+2===o){ag(t,p===void 0?new hT(f,r,e):new pT(f,r,e));break}else{let x=t.map[f];x===void 0&&(x=new mT(f),ag(t,x)),t=x}}}class Ol{constructor(e,t){this.seq=[],this.map={};const s=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<s;++o){const l=e.getActiveUniform(t,o),u=e.getUniformLocation(t,l.name);gT(l,u,this)}}setValue(e,t,s,o){const l=this.map[t];l!==void 0&&l.setValue(e,s,o)}setOptional(e,t,s){const o=t[s];o!==void 0&&this.setValue(e,s,o)}static upload(e,t,s,o){for(let l=0,u=t.length;l!==u;++l){const f=t[l],m=s[f.id];m.needsUpdate!==!1&&f.setValue(e,m.value,o)}}static seqWithValue(e,t){const s=[];for(let o=0,l=e.length;o!==l;++o){const u=e[o];u.id in t&&s.push(u)}return s}}function og(r,e,t){const s=r.createShader(e);return r.shaderSource(s,t),r.compileShader(s),s}const vT=37297;let _T=0;function xT(r,e){const t=r.split(`
`),s=[],o=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=o;u<l;u++){const f=u+1;s.push(`${f===e?">":" "} ${f}: ${t[u]}`)}return s.join(`
`)}function yT(r){const e=Tt.getPrimaries(Tt.workingColorSpace),t=Tt.getPrimaries(r);let s;switch(e===t?s="":e===$l&&t===Wl?s="LinearDisplayP3ToLinearSRGB":e===Wl&&t===$l&&(s="LinearSRGBToLinearDisplayP3"),r){case Tr:case ec:return[s,"LinearTransferOETF"];case hi:case Yd:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[s,"LinearTransferOETF"]}}function lg(r,e,t){const s=r.getShaderParameter(e,r.COMPILE_STATUS),o=r.getShaderInfoLog(e).trim();if(s&&o==="")return"";const l=/ERROR: 0:(\d+)/.exec(o);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+o+`

`+xT(r.getShaderSource(e),u)}else return o}function ST(r,e){const t=yT(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function MT(r,e){let t;switch(e){case Ry:t="Linear";break;case Ny:t="Reinhard";break;case Py:t="OptimizedCineon";break;case Ly:t="ACESFilmic";break;case Uy:t="AgX";break;case Iy:t="Neutral";break;case Dy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function ET(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ka).join(`
`)}function wT(r){const e=[];for(const t in r){const s=r[t];s!==!1&&e.push("#define "+t+" "+s)}return e.join(`
`)}function TT(r,e){const t={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let o=0;o<s;o++){const l=r.getActiveAttrib(e,o),u=l.name;let f=1;l.type===r.FLOAT_MAT2&&(f=2),l.type===r.FLOAT_MAT3&&(f=3),l.type===r.FLOAT_MAT4&&(f=4),t[u]={type:l.type,location:r.getAttribLocation(e,u),locationSize:f}}return t}function Ka(r){return r!==""}function cg(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ug(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const AT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Od(r){return r.replace(AT,bT)}const CT=new Map;function bT(r,e){let t=ut[e];if(t===void 0){const s=CT.get(e);if(s!==void 0)t=ut[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Od(t)}const RT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function dg(r){return r.replace(RT,NT)}function NT(r,e,t,s){let o="";for(let l=parseInt(e);l<parseInt(t);l++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function fg(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function PT(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Hg?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===ty?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function LT(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case ea:case ta:e="ENVMAP_TYPE_CUBE";break;case Jl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function DT(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case ta:e="ENVMAP_MODE_REFRACTION";break}return e}function UT(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Vg:e="ENVMAP_BLENDING_MULTIPLY";break;case Cy:e="ENVMAP_BLENDING_MIX";break;case by:e="ENVMAP_BLENDING_ADD";break}return e}function IT(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:s,maxMip:t}}function FT(r,e,t,s){const o=r.getContext(),l=t.defines;let u=t.vertexShader,f=t.fragmentShader;const m=PT(t),p=LT(t),g=DT(t),x=UT(t),_=IT(t),M=ET(t),w=wT(l),E=o.createProgram();let S,y,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,w].filter(Ka).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,w].filter(Ka).join(`
`),y.length>0&&(y+=`
`)):(S=[fg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,w,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+g:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ka).join(`
`),y=[fg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,w,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",t.envMap?"#define "+x:"",_?"#define CUBEUV_TEXEL_WIDTH "+_.texelWidth:"",_?"#define CUBEUV_TEXEL_HEIGHT "+_.texelHeight:"",_?"#define CUBEUV_MAX_MIP "+_.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yr?"#define TONE_MAPPING":"",t.toneMapping!==yr?ut.tonemapping_pars_fragment:"",t.toneMapping!==yr?MT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ut.colorspace_pars_fragment,ST("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ka).join(`
`)),u=Od(u),u=cg(u,t),u=ug(u,t),f=Od(f),f=cg(f,t),f=ug(f,t),u=dg(u),f=dg(f),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",t.glslVersion===bm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===bm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const b=A+S+u,D=A+y+f,$=og(o,o.VERTEX_SHADER,b),U=og(o,o.FRAGMENT_SHADER,D);o.attachShader(E,$),o.attachShader(E,U),t.index0AttributeName!==void 0?o.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(E,0,"position"),o.linkProgram(E);function L(j){if(r.debug.checkShaderErrors){const X=o.getProgramInfoLog(E).trim(),z=o.getShaderInfoLog($).trim(),ne=o.getShaderInfoLog(U).trim();let ue=!0,G=!0;if(o.getProgramParameter(E,o.LINK_STATUS)===!1)if(ue=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(o,E,$,U);else{const Y=lg(o,$,"vertex"),F=lg(o,U,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(E,o.VALIDATE_STATUS)+`

Material Name: `+j.name+`
Material Type: `+j.type+`

Program Info Log: `+X+`
`+Y+`
`+F)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(z===""||ne==="")&&(G=!1);G&&(j.diagnostics={runnable:ue,programLog:X,vertexShader:{log:z,prefix:S},fragmentShader:{log:ne,prefix:y}})}o.deleteShader($),o.deleteShader(U),q=new Ol(o,E),N=TT(o,E)}let q;this.getUniforms=function(){return q===void 0&&L(this),q};let N;this.getAttributes=function(){return N===void 0&&L(this),N};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=o.getProgramParameter(E,vT)),C},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_T++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=$,this.fragmentShader=U,this}let OT=0;class kT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,s=e.fragmentShader,o=this._getShaderStage(t),l=this._getShaderStage(s),u=this._getShaderCacheForMaterial(e);return u.has(o)===!1&&(u.add(o),o.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const s of t)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let s=t.get(e);return s===void 0&&(s=new Set,t.set(e,s)),s}_getShaderStage(e){const t=this.shaderCache;let s=t.get(e);return s===void 0&&(s=new zT(e),t.set(e,s)),s}}class zT{constructor(e){this.id=OT++,this.code=e,this.usedTimes=0}}function BT(r,e,t,s,o,l,u){const f=new iv,m=new kT,p=new Set,g=[],x=o.logarithmicDepthBuffer,_=o.vertexTextures;let M=o.precision;const w={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(N){return p.add(N),N===0?"uv":`uv${N}`}function S(N,C,j,X,z){const ne=X.fog,ue=z.geometry,G=N.isMeshStandardMaterial?X.environment:null,Y=(N.isMeshStandardMaterial?t:e).get(N.envMap||G),F=Y&&Y.mapping===Jl?Y.image.height:null,re=w[N.type];N.precision!==null&&(M=o.getMaxPrecision(N.precision),M!==N.precision&&console.warn("THREE.WebGLProgram.getParameters:",N.precision,"not supported, using",M,"instead."));const ee=ue.morphAttributes.position||ue.morphAttributes.normal||ue.morphAttributes.color,O=ee!==void 0?ee.length:0;let ce=0;ue.morphAttributes.position!==void 0&&(ce=1),ue.morphAttributes.normal!==void 0&&(ce=2),ue.morphAttributes.color!==void 0&&(ce=3);let ke,te,he,we;if(re){const yt=pi[re];ke=yt.vertexShader,te=yt.fragmentShader}else ke=N.vertexShader,te=N.fragmentShader,m.update(N),he=m.getVertexShaderID(N),we=m.getFragmentShaderID(N);const _e=r.getRenderTarget(),Ae=z.isInstancedMesh===!0,Ie=z.isBatchedMesh===!0,K=!!N.map,mt=!!N.matcap,Ye=!!Y,ht=!!N.aoMap,Ke=!!N.lightMap,ot=!!N.bumpMap,st=!!N.normalMap,lt=!!N.displacementMap,At=!!N.emissiveMap,k=!!N.metalnessMap,R=!!N.roughnessMap,de=N.anisotropy>0,ge=N.clearcoat>0,Me=N.dispersion>0,Ee=N.iridescence>0,qe=N.sheen>0,Le=N.transmission>0,Pe=de&&!!N.anisotropyMap,it=ge&&!!N.clearcoatMap,Re=ge&&!!N.clearcoatNormalMap,We=ge&&!!N.clearcoatRoughnessMap,at=Ee&&!!N.iridescenceMap,W=Ee&&!!N.iridescenceThicknessMap,Z=qe&&!!N.sheenColorMap,ve=qe&&!!N.sheenRoughnessMap,be=!!N.specularMap,Qe=!!N.specularColorMap,je=!!N.specularIntensityMap,B=Le&&!!N.transmissionMap,pe=Le&&!!N.thicknessMap,me=!!N.gradientMap,Ne=!!N.alphaMap,Fe=N.alphaTest>0,pt=!!N.alphaHash,wt=!!N.extensions;let Rt=yr;N.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(Rt=r.toneMapping);const Vt={shaderID:re,shaderType:N.type,shaderName:N.name,vertexShader:ke,fragmentShader:te,defines:N.defines,customVertexShaderID:he,customFragmentShaderID:we,isRawShaderMaterial:N.isRawShaderMaterial===!0,glslVersion:N.glslVersion,precision:M,batching:Ie,instancing:Ae,instancingColor:Ae&&z.instanceColor!==null,instancingMorph:Ae&&z.morphTexture!==null,supportsVertexTextures:_,outputColorSpace:_e===null?r.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:Tr,alphaToCoverage:!!N.alphaToCoverage,map:K,matcap:mt,envMap:Ye,envMapMode:Ye&&Y.mapping,envMapCubeUVHeight:F,aoMap:ht,lightMap:Ke,bumpMap:ot,normalMap:st,displacementMap:_&&lt,emissiveMap:At,normalMapObjectSpace:st&&N.normalMapType===Yy,normalMapTangentSpace:st&&N.normalMapType===Jg,metalnessMap:k,roughnessMap:R,anisotropy:de,anisotropyMap:Pe,clearcoat:ge,clearcoatMap:it,clearcoatNormalMap:Re,clearcoatRoughnessMap:We,dispersion:Me,iridescence:Ee,iridescenceMap:at,iridescenceThicknessMap:W,sheen:qe,sheenColorMap:Z,sheenRoughnessMap:ve,specularMap:be,specularColorMap:Qe,specularIntensityMap:je,transmission:Le,transmissionMap:B,thicknessMap:pe,gradientMap:me,opaque:N.transparent===!1&&N.blending===Ys&&N.alphaToCoverage===!1,alphaMap:Ne,alphaTest:Fe,alphaHash:pt,combine:N.combine,mapUv:K&&E(N.map.channel),aoMapUv:ht&&E(N.aoMap.channel),lightMapUv:Ke&&E(N.lightMap.channel),bumpMapUv:ot&&E(N.bumpMap.channel),normalMapUv:st&&E(N.normalMap.channel),displacementMapUv:lt&&E(N.displacementMap.channel),emissiveMapUv:At&&E(N.emissiveMap.channel),metalnessMapUv:k&&E(N.metalnessMap.channel),roughnessMapUv:R&&E(N.roughnessMap.channel),anisotropyMapUv:Pe&&E(N.anisotropyMap.channel),clearcoatMapUv:it&&E(N.clearcoatMap.channel),clearcoatNormalMapUv:Re&&E(N.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:We&&E(N.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&E(N.iridescenceMap.channel),iridescenceThicknessMapUv:W&&E(N.iridescenceThicknessMap.channel),sheenColorMapUv:Z&&E(N.sheenColorMap.channel),sheenRoughnessMapUv:ve&&E(N.sheenRoughnessMap.channel),specularMapUv:be&&E(N.specularMap.channel),specularColorMapUv:Qe&&E(N.specularColorMap.channel),specularIntensityMapUv:je&&E(N.specularIntensityMap.channel),transmissionMapUv:B&&E(N.transmissionMap.channel),thicknessMapUv:pe&&E(N.thicknessMap.channel),alphaMapUv:Ne&&E(N.alphaMap.channel),vertexTangents:!!ue.attributes.tangent&&(st||de),vertexColors:N.vertexColors,vertexAlphas:N.vertexColors===!0&&!!ue.attributes.color&&ue.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!ue.attributes.uv&&(K||Ne),fog:!!ne,useFog:N.fog===!0,fogExp2:!!ne&&ne.isFogExp2,flatShading:N.flatShading===!0,sizeAttenuation:N.sizeAttenuation===!0,logarithmicDepthBuffer:x,skinning:z.isSkinnedMesh===!0,morphTargets:ue.morphAttributes.position!==void 0,morphNormals:ue.morphAttributes.normal!==void 0,morphColors:ue.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:ce,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:N.dithering,shadowMapEnabled:r.shadowMap.enabled&&j.length>0,shadowMapType:r.shadowMap.type,toneMapping:Rt,useLegacyLights:r._useLegacyLights,decodeVideoTexture:K&&N.map.isVideoTexture===!0&&Tt.getTransfer(N.map.colorSpace)===Lt,premultipliedAlpha:N.premultipliedAlpha,doubleSided:N.side===mi,flipSided:N.side===Nn,useDepthPacking:N.depthPacking>=0,depthPacking:N.depthPacking||0,index0AttributeName:N.index0AttributeName,extensionClipCullDistance:wt&&N.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:wt&&N.extensions.multiDraw===!0&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:N.customProgramCacheKey()};return Vt.vertexUv1s=p.has(1),Vt.vertexUv2s=p.has(2),Vt.vertexUv3s=p.has(3),p.clear(),Vt}function y(N){const C=[];if(N.shaderID?C.push(N.shaderID):(C.push(N.customVertexShaderID),C.push(N.customFragmentShaderID)),N.defines!==void 0)for(const j in N.defines)C.push(j),C.push(N.defines[j]);return N.isRawShaderMaterial===!1&&(A(C,N),b(C,N),C.push(r.outputColorSpace)),C.push(N.customProgramCacheKey),C.join()}function A(N,C){N.push(C.precision),N.push(C.outputColorSpace),N.push(C.envMapMode),N.push(C.envMapCubeUVHeight),N.push(C.mapUv),N.push(C.alphaMapUv),N.push(C.lightMapUv),N.push(C.aoMapUv),N.push(C.bumpMapUv),N.push(C.normalMapUv),N.push(C.displacementMapUv),N.push(C.emissiveMapUv),N.push(C.metalnessMapUv),N.push(C.roughnessMapUv),N.push(C.anisotropyMapUv),N.push(C.clearcoatMapUv),N.push(C.clearcoatNormalMapUv),N.push(C.clearcoatRoughnessMapUv),N.push(C.iridescenceMapUv),N.push(C.iridescenceThicknessMapUv),N.push(C.sheenColorMapUv),N.push(C.sheenRoughnessMapUv),N.push(C.specularMapUv),N.push(C.specularColorMapUv),N.push(C.specularIntensityMapUv),N.push(C.transmissionMapUv),N.push(C.thicknessMapUv),N.push(C.combine),N.push(C.fogExp2),N.push(C.sizeAttenuation),N.push(C.morphTargetsCount),N.push(C.morphAttributeCount),N.push(C.numDirLights),N.push(C.numPointLights),N.push(C.numSpotLights),N.push(C.numSpotLightMaps),N.push(C.numHemiLights),N.push(C.numRectAreaLights),N.push(C.numDirLightShadows),N.push(C.numPointLightShadows),N.push(C.numSpotLightShadows),N.push(C.numSpotLightShadowsWithMaps),N.push(C.numLightProbes),N.push(C.shadowMapType),N.push(C.toneMapping),N.push(C.numClippingPlanes),N.push(C.numClipIntersection),N.push(C.depthPacking)}function b(N,C){f.disableAll(),C.supportsVertexTextures&&f.enable(0),C.instancing&&f.enable(1),C.instancingColor&&f.enable(2),C.instancingMorph&&f.enable(3),C.matcap&&f.enable(4),C.envMap&&f.enable(5),C.normalMapObjectSpace&&f.enable(6),C.normalMapTangentSpace&&f.enable(7),C.clearcoat&&f.enable(8),C.iridescence&&f.enable(9),C.alphaTest&&f.enable(10),C.vertexColors&&f.enable(11),C.vertexAlphas&&f.enable(12),C.vertexUv1s&&f.enable(13),C.vertexUv2s&&f.enable(14),C.vertexUv3s&&f.enable(15),C.vertexTangents&&f.enable(16),C.anisotropy&&f.enable(17),C.alphaHash&&f.enable(18),C.batching&&f.enable(19),C.dispersion&&f.enable(20),N.push(f.mask),f.disableAll(),C.fog&&f.enable(0),C.useFog&&f.enable(1),C.flatShading&&f.enable(2),C.logarithmicDepthBuffer&&f.enable(3),C.skinning&&f.enable(4),C.morphTargets&&f.enable(5),C.morphNormals&&f.enable(6),C.morphColors&&f.enable(7),C.premultipliedAlpha&&f.enable(8),C.shadowMapEnabled&&f.enable(9),C.useLegacyLights&&f.enable(10),C.doubleSided&&f.enable(11),C.flipSided&&f.enable(12),C.useDepthPacking&&f.enable(13),C.dithering&&f.enable(14),C.transmission&&f.enable(15),C.sheen&&f.enable(16),C.opaque&&f.enable(17),C.pointsUvs&&f.enable(18),C.decodeVideoTexture&&f.enable(19),C.alphaToCoverage&&f.enable(20),N.push(f.mask)}function D(N){const C=w[N.type];let j;if(C){const X=pi[C];j=wS.clone(X.uniforms)}else j=N.uniforms;return j}function $(N,C){let j;for(let X=0,z=g.length;X<z;X++){const ne=g[X];if(ne.cacheKey===C){j=ne,++j.usedTimes;break}}return j===void 0&&(j=new FT(r,C,N,l),g.push(j)),j}function U(N){if(--N.usedTimes===0){const C=g.indexOf(N);g[C]=g[g.length-1],g.pop(),N.destroy()}}function L(N){m.remove(N)}function q(){m.dispose()}return{getParameters:S,getProgramCacheKey:y,getUniforms:D,acquireProgram:$,releaseProgram:U,releaseShaderCache:L,programs:g,dispose:q}}function jT(){let r=new WeakMap;function e(l){let u=r.get(l);return u===void 0&&(u={},r.set(l,u)),u}function t(l){r.delete(l)}function s(l,u,f){r.get(l)[u]=f}function o(){r=new WeakMap}return{get:e,remove:t,update:s,dispose:o}}function HT(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function hg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function pg(){const r=[];let e=0;const t=[],s=[],o=[];function l(){e=0,t.length=0,s.length=0,o.length=0}function u(x,_,M,w,E,S){let y=r[e];return y===void 0?(y={id:x.id,object:x,geometry:_,material:M,groupOrder:w,renderOrder:x.renderOrder,z:E,group:S},r[e]=y):(y.id=x.id,y.object=x,y.geometry=_,y.material=M,y.groupOrder=w,y.renderOrder=x.renderOrder,y.z=E,y.group=S),e++,y}function f(x,_,M,w,E,S){const y=u(x,_,M,w,E,S);M.transmission>0?s.push(y):M.transparent===!0?o.push(y):t.push(y)}function m(x,_,M,w,E,S){const y=u(x,_,M,w,E,S);M.transmission>0?s.unshift(y):M.transparent===!0?o.unshift(y):t.unshift(y)}function p(x,_){t.length>1&&t.sort(x||HT),s.length>1&&s.sort(_||hg),o.length>1&&o.sort(_||hg)}function g(){for(let x=e,_=r.length;x<_;x++){const M=r[x];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:s,transparent:o,init:l,push:f,unshift:m,finish:g,sort:p}}function VT(){let r=new WeakMap;function e(s,o){const l=r.get(s);let u;return l===void 0?(u=new pg,r.set(s,[u])):o>=l.length?(u=new pg,l.push(u)):u=l[o],u}function t(){r=new WeakMap}return{get:e,dispose:t}}function GT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new le,color:new Mt};break;case"SpotLight":t={position:new le,direction:new le,color:new Mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new le,color:new Mt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new le,skyColor:new Mt,groundColor:new Mt};break;case"RectAreaLight":t={color:new Mt,position:new le,halfWidth:new le,halfHeight:new le};break}return r[e.id]=t,t}}}function WT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let $T=0;function XT(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function qT(r){const e=new GT,t=WT(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new le);const o=new le,l=new Bt,u=new Bt;function f(p,g){let x=0,_=0,M=0;for(let j=0;j<9;j++)s.probe[j].set(0,0,0);let w=0,E=0,S=0,y=0,A=0,b=0,D=0,$=0,U=0,L=0,q=0;p.sort(XT);const N=g===!0?Math.PI:1;for(let j=0,X=p.length;j<X;j++){const z=p[j],ne=z.color,ue=z.intensity,G=z.distance,Y=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)x+=ne.r*ue*N,_+=ne.g*ue*N,M+=ne.b*ue*N;else if(z.isLightProbe){for(let F=0;F<9;F++)s.probe[F].addScaledVector(z.sh.coefficients[F],ue);q++}else if(z.isDirectionalLight){const F=e.get(z);if(F.color.copy(z.color).multiplyScalar(z.intensity*N),z.castShadow){const re=z.shadow,ee=t.get(z);ee.shadowBias=re.bias,ee.shadowNormalBias=re.normalBias,ee.shadowRadius=re.radius,ee.shadowMapSize=re.mapSize,s.directionalShadow[w]=ee,s.directionalShadowMap[w]=Y,s.directionalShadowMatrix[w]=z.shadow.matrix,b++}s.directional[w]=F,w++}else if(z.isSpotLight){const F=e.get(z);F.position.setFromMatrixPosition(z.matrixWorld),F.color.copy(ne).multiplyScalar(ue*N),F.distance=G,F.coneCos=Math.cos(z.angle),F.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),F.decay=z.decay,s.spot[S]=F;const re=z.shadow;if(z.map&&(s.spotLightMap[U]=z.map,U++,re.updateMatrices(z),z.castShadow&&L++),s.spotLightMatrix[S]=re.matrix,z.castShadow){const ee=t.get(z);ee.shadowBias=re.bias,ee.shadowNormalBias=re.normalBias,ee.shadowRadius=re.radius,ee.shadowMapSize=re.mapSize,s.spotShadow[S]=ee,s.spotShadowMap[S]=Y,$++}S++}else if(z.isRectAreaLight){const F=e.get(z);F.color.copy(ne).multiplyScalar(ue),F.halfWidth.set(z.width*.5,0,0),F.halfHeight.set(0,z.height*.5,0),s.rectArea[y]=F,y++}else if(z.isPointLight){const F=e.get(z);if(F.color.copy(z.color).multiplyScalar(z.intensity*N),F.distance=z.distance,F.decay=z.decay,z.castShadow){const re=z.shadow,ee=t.get(z);ee.shadowBias=re.bias,ee.shadowNormalBias=re.normalBias,ee.shadowRadius=re.radius,ee.shadowMapSize=re.mapSize,ee.shadowCameraNear=re.camera.near,ee.shadowCameraFar=re.camera.far,s.pointShadow[E]=ee,s.pointShadowMap[E]=Y,s.pointShadowMatrix[E]=z.shadow.matrix,D++}s.point[E]=F,E++}else if(z.isHemisphereLight){const F=e.get(z);F.skyColor.copy(z.color).multiplyScalar(ue*N),F.groundColor.copy(z.groundColor).multiplyScalar(ue*N),s.hemi[A]=F,A++}}y>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ue.LTC_FLOAT_1,s.rectAreaLTC2=Ue.LTC_FLOAT_2):(s.rectAreaLTC1=Ue.LTC_HALF_1,s.rectAreaLTC2=Ue.LTC_HALF_2)),s.ambient[0]=x,s.ambient[1]=_,s.ambient[2]=M;const C=s.hash;(C.directionalLength!==w||C.pointLength!==E||C.spotLength!==S||C.rectAreaLength!==y||C.hemiLength!==A||C.numDirectionalShadows!==b||C.numPointShadows!==D||C.numSpotShadows!==$||C.numSpotMaps!==U||C.numLightProbes!==q)&&(s.directional.length=w,s.spot.length=S,s.rectArea.length=y,s.point.length=E,s.hemi.length=A,s.directionalShadow.length=b,s.directionalShadowMap.length=b,s.pointShadow.length=D,s.pointShadowMap.length=D,s.spotShadow.length=$,s.spotShadowMap.length=$,s.directionalShadowMatrix.length=b,s.pointShadowMatrix.length=D,s.spotLightMatrix.length=$+U-L,s.spotLightMap.length=U,s.numSpotLightShadowsWithMaps=L,s.numLightProbes=q,C.directionalLength=w,C.pointLength=E,C.spotLength=S,C.rectAreaLength=y,C.hemiLength=A,C.numDirectionalShadows=b,C.numPointShadows=D,C.numSpotShadows=$,C.numSpotMaps=U,C.numLightProbes=q,s.version=$T++)}function m(p,g){let x=0,_=0,M=0,w=0,E=0;const S=g.matrixWorldInverse;for(let y=0,A=p.length;y<A;y++){const b=p[y];if(b.isDirectionalLight){const D=s.directional[x];D.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),D.direction.sub(o),D.direction.transformDirection(S),x++}else if(b.isSpotLight){const D=s.spot[M];D.position.setFromMatrixPosition(b.matrixWorld),D.position.applyMatrix4(S),D.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),D.direction.sub(o),D.direction.transformDirection(S),M++}else if(b.isRectAreaLight){const D=s.rectArea[w];D.position.setFromMatrixPosition(b.matrixWorld),D.position.applyMatrix4(S),u.identity(),l.copy(b.matrixWorld),l.premultiply(S),u.extractRotation(l),D.halfWidth.set(b.width*.5,0,0),D.halfHeight.set(0,b.height*.5,0),D.halfWidth.applyMatrix4(u),D.halfHeight.applyMatrix4(u),w++}else if(b.isPointLight){const D=s.point[_];D.position.setFromMatrixPosition(b.matrixWorld),D.position.applyMatrix4(S),_++}else if(b.isHemisphereLight){const D=s.hemi[E];D.direction.setFromMatrixPosition(b.matrixWorld),D.direction.transformDirection(S),E++}}}return{setup:f,setupView:m,state:s}}function mg(r){const e=new qT(r),t=[],s=[];function o(g){p.camera=g,t.length=0,s.length=0}function l(g){t.push(g)}function u(g){s.push(g)}function f(g){e.setup(t,g)}function m(g){e.setupView(t,g)}const p={lightsArray:t,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:p,setupLights:f,setupLightsView:m,pushLight:l,pushShadow:u}}function YT(r){let e=new WeakMap;function t(o,l=0){const u=e.get(o);let f;return u===void 0?(f=new mg(r),e.set(o,[f])):l>=u.length?(f=new mg(r),u.push(f)):f=u[l],f}function s(){e=new WeakMap}return{get:t,dispose:s}}class KT extends so{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ZT extends so{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const JT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,QT=`uniform sampler2D shadow_pass;
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
}`;function e1(r,e,t){let s=new Zd;const o=new _t,l=new _t,u=new rn,f=new KT({depthPacking:qy}),m=new ZT,p={},g=t.maxTextureSize,x={[Sr]:Nn,[Nn]:Sr,[mi]:mi},_=new Er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:JT,fragmentShader:QT}),M=_.clone();M.defines.HORIZONTAL_PASS=1;const w=new Hi;w.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new _i(w,_),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hg;let y=this.type;this.render=function(U,L,q){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||U.length===0)return;const N=r.getRenderTarget(),C=r.getActiveCubeFace(),j=r.getActiveMipmapLevel(),X=r.state;X.setBlending(xr),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const z=y!==ki&&this.type===ki,ne=y===ki&&this.type!==ki;for(let ue=0,G=U.length;ue<G;ue++){const Y=U[ue],F=Y.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;o.copy(F.mapSize);const re=F.getFrameExtents();if(o.multiply(re),l.copy(F.mapSize),(o.x>g||o.y>g)&&(o.x>g&&(l.x=Math.floor(g/re.x),o.x=l.x*re.x,F.mapSize.x=l.x),o.y>g&&(l.y=Math.floor(g/re.y),o.y=l.y*re.y,F.mapSize.y=l.y)),F.map===null||z===!0||ne===!0){const O=this.type!==ki?{minFilter:Kn,magFilter:Kn}:{};F.map!==null&&F.map.dispose(),F.map=new ns(o.x,o.y,O),F.map.texture.name=Y.name+".shadowMap",F.camera.updateProjectionMatrix()}r.setRenderTarget(F.map),r.clear();const ee=F.getViewportCount();for(let O=0;O<ee;O++){const ce=F.getViewport(O);u.set(l.x*ce.x,l.y*ce.y,l.x*ce.z,l.y*ce.w),X.viewport(u),F.updateMatrices(Y,O),s=F.getFrustum(),D(L,q,F.camera,Y,this.type)}F.isPointLightShadow!==!0&&this.type===ki&&A(F,q),F.needsUpdate=!1}y=this.type,S.needsUpdate=!1,r.setRenderTarget(N,C,j)};function A(U,L){const q=e.update(E);_.defines.VSM_SAMPLES!==U.blurSamples&&(_.defines.VSM_SAMPLES=U.blurSamples,M.defines.VSM_SAMPLES=U.blurSamples,_.needsUpdate=!0,M.needsUpdate=!0),U.mapPass===null&&(U.mapPass=new ns(o.x,o.y)),_.uniforms.shadow_pass.value=U.map.texture,_.uniforms.resolution.value=U.mapSize,_.uniforms.radius.value=U.radius,r.setRenderTarget(U.mapPass),r.clear(),r.renderBufferDirect(L,null,q,_,E,null),M.uniforms.shadow_pass.value=U.mapPass.texture,M.uniforms.resolution.value=U.mapSize,M.uniforms.radius.value=U.radius,r.setRenderTarget(U.map),r.clear(),r.renderBufferDirect(L,null,q,M,E,null)}function b(U,L,q,N){let C=null;const j=q.isPointLight===!0?U.customDistanceMaterial:U.customDepthMaterial;if(j!==void 0)C=j;else if(C=q.isPointLight===!0?m:f,r.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const X=C.uuid,z=L.uuid;let ne=p[X];ne===void 0&&(ne={},p[X]=ne);let ue=ne[z];ue===void 0&&(ue=C.clone(),ne[z]=ue,L.addEventListener("dispose",$)),C=ue}if(C.visible=L.visible,C.wireframe=L.wireframe,N===ki?C.side=L.shadowSide!==null?L.shadowSide:L.side:C.side=L.shadowSide!==null?L.shadowSide:x[L.side],C.alphaMap=L.alphaMap,C.alphaTest=L.alphaTest,C.map=L.map,C.clipShadows=L.clipShadows,C.clippingPlanes=L.clippingPlanes,C.clipIntersection=L.clipIntersection,C.displacementMap=L.displacementMap,C.displacementScale=L.displacementScale,C.displacementBias=L.displacementBias,C.wireframeLinewidth=L.wireframeLinewidth,C.linewidth=L.linewidth,q.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const X=r.properties.get(C);X.light=q}return C}function D(U,L,q,N,C){if(U.visible===!1)return;if(U.layers.test(L.layers)&&(U.isMesh||U.isLine||U.isPoints)&&(U.castShadow||U.receiveShadow&&C===ki)&&(!U.frustumCulled||s.intersectsObject(U))){U.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,U.matrixWorld);const z=e.update(U),ne=U.material;if(Array.isArray(ne)){const ue=z.groups;for(let G=0,Y=ue.length;G<Y;G++){const F=ue[G],re=ne[F.materialIndex];if(re&&re.visible){const ee=b(U,re,N,C);U.onBeforeShadow(r,U,L,q,z,ee,F),r.renderBufferDirect(q,null,z,ee,U,F),U.onAfterShadow(r,U,L,q,z,ee,F)}}}else if(ne.visible){const ue=b(U,ne,N,C);U.onBeforeShadow(r,U,L,q,z,ue,null),r.renderBufferDirect(q,null,z,ue,U,null),U.onAfterShadow(r,U,L,q,z,ue,null)}}const X=U.children;for(let z=0,ne=X.length;z<ne;z++)D(X[z],L,q,N,C)}function $(U){U.target.removeEventListener("dispose",$);for(const q in p){const N=p[q],C=U.target.uuid;C in N&&(N[C].dispose(),delete N[C])}}}function t1(r){function e(){let B=!1;const pe=new rn;let me=null;const Ne=new rn(0,0,0,0);return{setMask:function(Fe){me!==Fe&&!B&&(r.colorMask(Fe,Fe,Fe,Fe),me=Fe)},setLocked:function(Fe){B=Fe},setClear:function(Fe,pt,wt,Rt,Vt){Vt===!0&&(Fe*=Rt,pt*=Rt,wt*=Rt),pe.set(Fe,pt,wt,Rt),Ne.equals(pe)===!1&&(r.clearColor(Fe,pt,wt,Rt),Ne.copy(pe))},reset:function(){B=!1,me=null,Ne.set(-1,0,0,0)}}}function t(){let B=!1,pe=null,me=null,Ne=null;return{setTest:function(Fe){Fe?we(r.DEPTH_TEST):_e(r.DEPTH_TEST)},setMask:function(Fe){pe!==Fe&&!B&&(r.depthMask(Fe),pe=Fe)},setFunc:function(Fe){if(me!==Fe){switch(Fe){case yy:r.depthFunc(r.NEVER);break;case Sy:r.depthFunc(r.ALWAYS);break;case My:r.depthFunc(r.LESS);break;case Vl:r.depthFunc(r.LEQUAL);break;case Ey:r.depthFunc(r.EQUAL);break;case wy:r.depthFunc(r.GEQUAL);break;case Ty:r.depthFunc(r.GREATER);break;case Ay:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}me=Fe}},setLocked:function(Fe){B=Fe},setClear:function(Fe){Ne!==Fe&&(r.clearDepth(Fe),Ne=Fe)},reset:function(){B=!1,pe=null,me=null,Ne=null}}}function s(){let B=!1,pe=null,me=null,Ne=null,Fe=null,pt=null,wt=null,Rt=null,Vt=null;return{setTest:function(yt){B||(yt?we(r.STENCIL_TEST):_e(r.STENCIL_TEST))},setMask:function(yt){pe!==yt&&!B&&(r.stencilMask(yt),pe=yt)},setFunc:function(yt,Sn,Zt){(me!==yt||Ne!==Sn||Fe!==Zt)&&(r.stencilFunc(yt,Sn,Zt),me=yt,Ne=Sn,Fe=Zt)},setOp:function(yt,Sn,Zt){(pt!==yt||wt!==Sn||Rt!==Zt)&&(r.stencilOp(yt,Sn,Zt),pt=yt,wt=Sn,Rt=Zt)},setLocked:function(yt){B=yt},setClear:function(yt){Vt!==yt&&(r.clearStencil(yt),Vt=yt)},reset:function(){B=!1,pe=null,me=null,Ne=null,Fe=null,pt=null,wt=null,Rt=null,Vt=null}}}const o=new e,l=new t,u=new s,f=new WeakMap,m=new WeakMap;let p={},g={},x=new WeakMap,_=[],M=null,w=!1,E=null,S=null,y=null,A=null,b=null,D=null,$=null,U=new Mt(0,0,0),L=0,q=!1,N=null,C=null,j=null,X=null,z=null;const ne=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ue=!1,G=0;const Y=r.getParameter(r.VERSION);Y.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(Y)[1]),ue=G>=1):Y.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),ue=G>=2);let F=null,re={};const ee=r.getParameter(r.SCISSOR_BOX),O=r.getParameter(r.VIEWPORT),ce=new rn().fromArray(ee),ke=new rn().fromArray(O);function te(B,pe,me,Ne){const Fe=new Uint8Array(4),pt=r.createTexture();r.bindTexture(B,pt),r.texParameteri(B,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(B,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let wt=0;wt<me;wt++)B===r.TEXTURE_3D||B===r.TEXTURE_2D_ARRAY?r.texImage3D(pe,0,r.RGBA,1,1,Ne,0,r.RGBA,r.UNSIGNED_BYTE,Fe):r.texImage2D(pe+wt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Fe);return pt}const he={};he[r.TEXTURE_2D]=te(r.TEXTURE_2D,r.TEXTURE_2D,1),he[r.TEXTURE_CUBE_MAP]=te(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[r.TEXTURE_2D_ARRAY]=te(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),he[r.TEXTURE_3D]=te(r.TEXTURE_3D,r.TEXTURE_3D,1,1),o.setClear(0,0,0,1),l.setClear(1),u.setClear(0),we(r.DEPTH_TEST),l.setFunc(Vl),ot(!1),st(Kp),we(r.CULL_FACE),ht(xr);function we(B){p[B]!==!0&&(r.enable(B),p[B]=!0)}function _e(B){p[B]!==!1&&(r.disable(B),p[B]=!1)}function Ae(B,pe){return g[B]!==pe?(r.bindFramebuffer(B,pe),g[B]=pe,B===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=pe),B===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=pe),!0):!1}function Ie(B,pe){let me=_,Ne=!1;if(B){me=x.get(pe),me===void 0&&(me=[],x.set(pe,me));const Fe=B.textures;if(me.length!==Fe.length||me[0]!==r.COLOR_ATTACHMENT0){for(let pt=0,wt=Fe.length;pt<wt;pt++)me[pt]=r.COLOR_ATTACHMENT0+pt;me.length=Fe.length,Ne=!0}}else me[0]!==r.BACK&&(me[0]=r.BACK,Ne=!0);Ne&&r.drawBuffers(me)}function K(B){return M!==B?(r.useProgram(B),M=B,!0):!1}const mt={[qr]:r.FUNC_ADD,[iy]:r.FUNC_SUBTRACT,[ry]:r.FUNC_REVERSE_SUBTRACT};mt[sy]=r.MIN,mt[ay]=r.MAX;const Ye={[oy]:r.ZERO,[ly]:r.ONE,[cy]:r.SRC_COLOR,[Nd]:r.SRC_ALPHA,[my]:r.SRC_ALPHA_SATURATE,[hy]:r.DST_COLOR,[dy]:r.DST_ALPHA,[uy]:r.ONE_MINUS_SRC_COLOR,[Pd]:r.ONE_MINUS_SRC_ALPHA,[py]:r.ONE_MINUS_DST_COLOR,[fy]:r.ONE_MINUS_DST_ALPHA,[gy]:r.CONSTANT_COLOR,[vy]:r.ONE_MINUS_CONSTANT_COLOR,[_y]:r.CONSTANT_ALPHA,[xy]:r.ONE_MINUS_CONSTANT_ALPHA};function ht(B,pe,me,Ne,Fe,pt,wt,Rt,Vt,yt){if(B===xr){w===!0&&(_e(r.BLEND),w=!1);return}if(w===!1&&(we(r.BLEND),w=!0),B!==ny){if(B!==E||yt!==q){if((S!==qr||b!==qr)&&(r.blendEquation(r.FUNC_ADD),S=qr,b=qr),yt)switch(B){case Ys:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Zp:r.blendFunc(r.ONE,r.ONE);break;case Jp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Qp:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Ys:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Zp:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Jp:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Qp:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}y=null,A=null,D=null,$=null,U.set(0,0,0),L=0,E=B,q=yt}return}Fe=Fe||pe,pt=pt||me,wt=wt||Ne,(pe!==S||Fe!==b)&&(r.blendEquationSeparate(mt[pe],mt[Fe]),S=pe,b=Fe),(me!==y||Ne!==A||pt!==D||wt!==$)&&(r.blendFuncSeparate(Ye[me],Ye[Ne],Ye[pt],Ye[wt]),y=me,A=Ne,D=pt,$=wt),(Rt.equals(U)===!1||Vt!==L)&&(r.blendColor(Rt.r,Rt.g,Rt.b,Vt),U.copy(Rt),L=Vt),E=B,q=!1}function Ke(B,pe){B.side===mi?_e(r.CULL_FACE):we(r.CULL_FACE);let me=B.side===Nn;pe&&(me=!me),ot(me),B.blending===Ys&&B.transparent===!1?ht(xr):ht(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),l.setFunc(B.depthFunc),l.setTest(B.depthTest),l.setMask(B.depthWrite),o.setMask(B.colorWrite);const Ne=B.stencilWrite;u.setTest(Ne),Ne&&(u.setMask(B.stencilWriteMask),u.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),u.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),At(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?we(r.SAMPLE_ALPHA_TO_COVERAGE):_e(r.SAMPLE_ALPHA_TO_COVERAGE)}function ot(B){N!==B&&(B?r.frontFace(r.CW):r.frontFace(r.CCW),N=B)}function st(B){B!==Q0?(we(r.CULL_FACE),B!==C&&(B===Kp?r.cullFace(r.BACK):B===ey?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):_e(r.CULL_FACE),C=B}function lt(B){B!==j&&(ue&&r.lineWidth(B),j=B)}function At(B,pe,me){B?(we(r.POLYGON_OFFSET_FILL),(X!==pe||z!==me)&&(r.polygonOffset(pe,me),X=pe,z=me)):_e(r.POLYGON_OFFSET_FILL)}function k(B){B?we(r.SCISSOR_TEST):_e(r.SCISSOR_TEST)}function R(B){B===void 0&&(B=r.TEXTURE0+ne-1),F!==B&&(r.activeTexture(B),F=B)}function de(B,pe,me){me===void 0&&(F===null?me=r.TEXTURE0+ne-1:me=F);let Ne=re[me];Ne===void 0&&(Ne={type:void 0,texture:void 0},re[me]=Ne),(Ne.type!==B||Ne.texture!==pe)&&(F!==me&&(r.activeTexture(me),F=me),r.bindTexture(B,pe||he[B]),Ne.type=B,Ne.texture=pe)}function ge(){const B=re[F];B!==void 0&&B.type!==void 0&&(r.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Me(){try{r.compressedTexImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ee(){try{r.compressedTexImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function qe(){try{r.texSubImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Le(){try{r.texSubImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pe(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function it(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Re(){try{r.texStorage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function We(){try{r.texStorage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function at(){try{r.texImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function W(){try{r.texImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Z(B){ce.equals(B)===!1&&(r.scissor(B.x,B.y,B.z,B.w),ce.copy(B))}function ve(B){ke.equals(B)===!1&&(r.viewport(B.x,B.y,B.z,B.w),ke.copy(B))}function be(B,pe){let me=m.get(pe);me===void 0&&(me=new WeakMap,m.set(pe,me));let Ne=me.get(B);Ne===void 0&&(Ne=r.getUniformBlockIndex(pe,B.name),me.set(B,Ne))}function Qe(B,pe){const Ne=m.get(pe).get(B);f.get(pe)!==Ne&&(r.uniformBlockBinding(pe,Ne,B.__bindingPointIndex),f.set(pe,Ne))}function je(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),p={},F=null,re={},g={},x=new WeakMap,_=[],M=null,w=!1,E=null,S=null,y=null,A=null,b=null,D=null,$=null,U=new Mt(0,0,0),L=0,q=!1,N=null,C=null,j=null,X=null,z=null,ce.set(0,0,r.canvas.width,r.canvas.height),ke.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),u.reset()}return{buffers:{color:o,depth:l,stencil:u},enable:we,disable:_e,bindFramebuffer:Ae,drawBuffers:Ie,useProgram:K,setBlending:ht,setMaterial:Ke,setFlipSided:ot,setCullFace:st,setLineWidth:lt,setPolygonOffset:At,setScissorTest:k,activeTexture:R,bindTexture:de,unbindTexture:ge,compressedTexImage2D:Me,compressedTexImage3D:Ee,texImage2D:at,texImage3D:W,updateUBOMapping:be,uniformBlockBinding:Qe,texStorage2D:Re,texStorage3D:We,texSubImage2D:qe,texSubImage3D:Le,compressedTexSubImage2D:Pe,compressedTexSubImage3D:it,scissor:Z,viewport:ve,reset:je}}function n1(r,e,t,s,o,l,u){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new _t,g=new WeakMap;let x;const _=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function w(k,R){return M?new OffscreenCanvas(k,R):ql("canvas")}function E(k,R,de){let ge=1;const Me=At(k);if((Me.width>de||Me.height>de)&&(ge=de/Math.max(Me.width,Me.height)),ge<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const Ee=Math.floor(ge*Me.width),qe=Math.floor(ge*Me.height);x===void 0&&(x=w(Ee,qe));const Le=R?w(Ee,qe):x;return Le.width=Ee,Le.height=qe,Le.getContext("2d").drawImage(k,0,0,Ee,qe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Me.width+"x"+Me.height+") to ("+Ee+"x"+qe+")."),Le}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Me.width+"x"+Me.height+")."),k;return k}function S(k){return k.generateMipmaps&&k.minFilter!==Kn&&k.minFilter!==oi}function y(k){r.generateMipmap(k)}function A(k,R,de,ge,Me=!1){if(k!==null){if(r[k]!==void 0)return r[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let Ee=R;if(R===r.RED&&(de===r.FLOAT&&(Ee=r.R32F),de===r.HALF_FLOAT&&(Ee=r.R16F),de===r.UNSIGNED_BYTE&&(Ee=r.R8)),R===r.RED_INTEGER&&(de===r.UNSIGNED_BYTE&&(Ee=r.R8UI),de===r.UNSIGNED_SHORT&&(Ee=r.R16UI),de===r.UNSIGNED_INT&&(Ee=r.R32UI),de===r.BYTE&&(Ee=r.R8I),de===r.SHORT&&(Ee=r.R16I),de===r.INT&&(Ee=r.R32I)),R===r.RG&&(de===r.FLOAT&&(Ee=r.RG32F),de===r.HALF_FLOAT&&(Ee=r.RG16F),de===r.UNSIGNED_BYTE&&(Ee=r.RG8)),R===r.RG_INTEGER&&(de===r.UNSIGNED_BYTE&&(Ee=r.RG8UI),de===r.UNSIGNED_SHORT&&(Ee=r.RG16UI),de===r.UNSIGNED_INT&&(Ee=r.RG32UI),de===r.BYTE&&(Ee=r.RG8I),de===r.SHORT&&(Ee=r.RG16I),de===r.INT&&(Ee=r.RG32I)),R===r.RGB&&de===r.UNSIGNED_INT_5_9_9_9_REV&&(Ee=r.RGB9_E5),R===r.RGBA){const qe=Me?Gl:Tt.getTransfer(ge);de===r.FLOAT&&(Ee=r.RGBA32F),de===r.HALF_FLOAT&&(Ee=r.RGBA16F),de===r.UNSIGNED_BYTE&&(Ee=qe===Lt?r.SRGB8_ALPHA8:r.RGBA8),de===r.UNSIGNED_SHORT_4_4_4_4&&(Ee=r.RGBA4),de===r.UNSIGNED_SHORT_5_5_5_1&&(Ee=r.RGB5_A1)}return(Ee===r.R16F||Ee===r.R32F||Ee===r.RG16F||Ee===r.RG32F||Ee===r.RGBA16F||Ee===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Ee}function b(k,R){return S(k)===!0||k.isFramebufferTexture&&k.minFilter!==Kn&&k.minFilter!==oi?Math.log2(Math.max(R.width,R.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?R.mipmaps.length:1}function D(k){const R=k.target;R.removeEventListener("dispose",D),U(R),R.isVideoTexture&&g.delete(R)}function $(k){const R=k.target;R.removeEventListener("dispose",$),q(R)}function U(k){const R=s.get(k);if(R.__webglInit===void 0)return;const de=k.source,ge=_.get(de);if(ge){const Me=ge[R.__cacheKey];Me.usedTimes--,Me.usedTimes===0&&L(k),Object.keys(ge).length===0&&_.delete(de)}s.remove(k)}function L(k){const R=s.get(k);r.deleteTexture(R.__webglTexture);const de=k.source,ge=_.get(de);delete ge[R.__cacheKey],u.memory.textures--}function q(k){const R=s.get(k);if(k.depthTexture&&k.depthTexture.dispose(),k.isWebGLCubeRenderTarget)for(let ge=0;ge<6;ge++){if(Array.isArray(R.__webglFramebuffer[ge]))for(let Me=0;Me<R.__webglFramebuffer[ge].length;Me++)r.deleteFramebuffer(R.__webglFramebuffer[ge][Me]);else r.deleteFramebuffer(R.__webglFramebuffer[ge]);R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer[ge])}else{if(Array.isArray(R.__webglFramebuffer))for(let ge=0;ge<R.__webglFramebuffer.length;ge++)r.deleteFramebuffer(R.__webglFramebuffer[ge]);else r.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&r.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ge=0;ge<R.__webglColorRenderbuffer.length;ge++)R.__webglColorRenderbuffer[ge]&&r.deleteRenderbuffer(R.__webglColorRenderbuffer[ge]);R.__webglDepthRenderbuffer&&r.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const de=k.textures;for(let ge=0,Me=de.length;ge<Me;ge++){const Ee=s.get(de[ge]);Ee.__webglTexture&&(r.deleteTexture(Ee.__webglTexture),u.memory.textures--),s.remove(de[ge])}s.remove(k)}let N=0;function C(){N=0}function j(){const k=N;return k>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+o.maxTextures),N+=1,k}function X(k){const R=[];return R.push(k.wrapS),R.push(k.wrapT),R.push(k.wrapR||0),R.push(k.magFilter),R.push(k.minFilter),R.push(k.anisotropy),R.push(k.internalFormat),R.push(k.format),R.push(k.type),R.push(k.generateMipmaps),R.push(k.premultiplyAlpha),R.push(k.flipY),R.push(k.unpackAlignment),R.push(k.colorSpace),R.join()}function z(k,R){const de=s.get(k);if(k.isVideoTexture&&st(k),k.isRenderTargetTexture===!1&&k.version>0&&de.__version!==k.version){const ge=k.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(de,k,R);return}}t.bindTexture(r.TEXTURE_2D,de.__webglTexture,r.TEXTURE0+R)}function ne(k,R){const de=s.get(k);if(k.version>0&&de.__version!==k.version){ce(de,k,R);return}t.bindTexture(r.TEXTURE_2D_ARRAY,de.__webglTexture,r.TEXTURE0+R)}function ue(k,R){const de=s.get(k);if(k.version>0&&de.__version!==k.version){ce(de,k,R);return}t.bindTexture(r.TEXTURE_3D,de.__webglTexture,r.TEXTURE0+R)}function G(k,R){const de=s.get(k);if(k.version>0&&de.__version!==k.version){ke(de,k,R);return}t.bindTexture(r.TEXTURE_CUBE_MAP,de.__webglTexture,r.TEXTURE0+R)}const Y={[Ud]:r.REPEAT,[Zr]:r.CLAMP_TO_EDGE,[Id]:r.MIRRORED_REPEAT},F={[Kn]:r.NEAREST,[Fy]:r.NEAREST_MIPMAP_NEAREST,[ml]:r.NEAREST_MIPMAP_LINEAR,[oi]:r.LINEAR,[Wu]:r.LINEAR_MIPMAP_NEAREST,[Jr]:r.LINEAR_MIPMAP_LINEAR},re={[Ky]:r.NEVER,[nS]:r.ALWAYS,[Zy]:r.LESS,[Qg]:r.LEQUAL,[Jy]:r.EQUAL,[tS]:r.GEQUAL,[Qy]:r.GREATER,[eS]:r.NOTEQUAL};function ee(k,R){if(R.type===_r&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===oi||R.magFilter===Wu||R.magFilter===ml||R.magFilter===Jr||R.minFilter===oi||R.minFilter===Wu||R.minFilter===ml||R.minFilter===Jr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(k,r.TEXTURE_WRAP_S,Y[R.wrapS]),r.texParameteri(k,r.TEXTURE_WRAP_T,Y[R.wrapT]),(k===r.TEXTURE_3D||k===r.TEXTURE_2D_ARRAY)&&r.texParameteri(k,r.TEXTURE_WRAP_R,Y[R.wrapR]),r.texParameteri(k,r.TEXTURE_MAG_FILTER,F[R.magFilter]),r.texParameteri(k,r.TEXTURE_MIN_FILTER,F[R.minFilter]),R.compareFunction&&(r.texParameteri(k,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(k,r.TEXTURE_COMPARE_FUNC,re[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Kn||R.minFilter!==ml&&R.minFilter!==Jr||R.type===_r&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||s.get(R).__currentAnisotropy){const de=e.get("EXT_texture_filter_anisotropic");r.texParameterf(k,de.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,o.getMaxAnisotropy())),s.get(R).__currentAnisotropy=R.anisotropy}}}function O(k,R){let de=!1;k.__webglInit===void 0&&(k.__webglInit=!0,R.addEventListener("dispose",D));const ge=R.source;let Me=_.get(ge);Me===void 0&&(Me={},_.set(ge,Me));const Ee=X(R);if(Ee!==k.__cacheKey){Me[Ee]===void 0&&(Me[Ee]={texture:r.createTexture(),usedTimes:0},u.memory.textures++,de=!0),Me[Ee].usedTimes++;const qe=Me[k.__cacheKey];qe!==void 0&&(Me[k.__cacheKey].usedTimes--,qe.usedTimes===0&&L(R)),k.__cacheKey=Ee,k.__webglTexture=Me[Ee].texture}return de}function ce(k,R,de){let ge=r.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ge=r.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ge=r.TEXTURE_3D);const Me=O(k,R),Ee=R.source;t.bindTexture(ge,k.__webglTexture,r.TEXTURE0+de);const qe=s.get(Ee);if(Ee.version!==qe.__version||Me===!0){t.activeTexture(r.TEXTURE0+de);const Le=Tt.getPrimaries(Tt.workingColorSpace),Pe=R.colorSpace===vr?null:Tt.getPrimaries(R.colorSpace),it=R.colorSpace===vr||Le===Pe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);let Re=E(R.image,!1,o.maxTextureSize);Re=lt(R,Re);const We=l.convert(R.format,R.colorSpace),at=l.convert(R.type);let W=A(R.internalFormat,We,at,R.colorSpace,R.isVideoTexture);ee(ge,R);let Z;const ve=R.mipmaps,be=R.isVideoTexture!==!0,Qe=qe.__version===void 0||Me===!0,je=Ee.dataReady,B=b(R,Re);if(R.isDepthTexture)W=r.DEPTH_COMPONENT16,R.type===_r?W=r.DEPTH_COMPONENT32F:R.type===na?W=r.DEPTH_COMPONENT24:R.type===no&&(W=r.DEPTH24_STENCIL8),Qe&&(be?t.texStorage2D(r.TEXTURE_2D,1,W,Re.width,Re.height):t.texImage2D(r.TEXTURE_2D,0,W,Re.width,Re.height,0,We,at,null));else if(R.isDataTexture)if(ve.length>0){be&&Qe&&t.texStorage2D(r.TEXTURE_2D,B,W,ve[0].width,ve[0].height);for(let pe=0,me=ve.length;pe<me;pe++)Z=ve[pe],be?je&&t.texSubImage2D(r.TEXTURE_2D,pe,0,0,Z.width,Z.height,We,at,Z.data):t.texImage2D(r.TEXTURE_2D,pe,W,Z.width,Z.height,0,We,at,Z.data);R.generateMipmaps=!1}else be?(Qe&&t.texStorage2D(r.TEXTURE_2D,B,W,Re.width,Re.height),je&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Re.width,Re.height,We,at,Re.data)):t.texImage2D(r.TEXTURE_2D,0,W,Re.width,Re.height,0,We,at,Re.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){be&&Qe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,B,W,ve[0].width,ve[0].height,Re.depth);for(let pe=0,me=ve.length;pe<me;pe++)Z=ve[pe],R.format!==vi?We!==null?be?je&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,pe,0,0,0,Z.width,Z.height,Re.depth,We,Z.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,pe,W,Z.width,Z.height,Re.depth,0,Z.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?je&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,pe,0,0,0,Z.width,Z.height,Re.depth,We,at,Z.data):t.texImage3D(r.TEXTURE_2D_ARRAY,pe,W,Z.width,Z.height,Re.depth,0,We,at,Z.data)}else{be&&Qe&&t.texStorage2D(r.TEXTURE_2D,B,W,ve[0].width,ve[0].height);for(let pe=0,me=ve.length;pe<me;pe++)Z=ve[pe],R.format!==vi?We!==null?be?je&&t.compressedTexSubImage2D(r.TEXTURE_2D,pe,0,0,Z.width,Z.height,We,Z.data):t.compressedTexImage2D(r.TEXTURE_2D,pe,W,Z.width,Z.height,0,Z.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?je&&t.texSubImage2D(r.TEXTURE_2D,pe,0,0,Z.width,Z.height,We,at,Z.data):t.texImage2D(r.TEXTURE_2D,pe,W,Z.width,Z.height,0,We,at,Z.data)}else if(R.isDataArrayTexture)be?(Qe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,B,W,Re.width,Re.height,Re.depth),je&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Re.width,Re.height,Re.depth,We,at,Re.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,W,Re.width,Re.height,Re.depth,0,We,at,Re.data);else if(R.isData3DTexture)be?(Qe&&t.texStorage3D(r.TEXTURE_3D,B,W,Re.width,Re.height,Re.depth),je&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Re.width,Re.height,Re.depth,We,at,Re.data)):t.texImage3D(r.TEXTURE_3D,0,W,Re.width,Re.height,Re.depth,0,We,at,Re.data);else if(R.isFramebufferTexture){if(Qe)if(be)t.texStorage2D(r.TEXTURE_2D,B,W,Re.width,Re.height);else{let pe=Re.width,me=Re.height;for(let Ne=0;Ne<B;Ne++)t.texImage2D(r.TEXTURE_2D,Ne,W,pe,me,0,We,at,null),pe>>=1,me>>=1}}else if(ve.length>0){if(be&&Qe){const pe=At(ve[0]);t.texStorage2D(r.TEXTURE_2D,B,W,pe.width,pe.height)}for(let pe=0,me=ve.length;pe<me;pe++)Z=ve[pe],be?je&&t.texSubImage2D(r.TEXTURE_2D,pe,0,0,We,at,Z):t.texImage2D(r.TEXTURE_2D,pe,W,We,at,Z);R.generateMipmaps=!1}else if(be){if(Qe){const pe=At(Re);t.texStorage2D(r.TEXTURE_2D,B,W,pe.width,pe.height)}je&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,We,at,Re)}else t.texImage2D(r.TEXTURE_2D,0,W,We,at,Re);S(R)&&y(ge),qe.__version=Ee.version,R.onUpdate&&R.onUpdate(R)}k.__version=R.version}function ke(k,R,de){if(R.image.length!==6)return;const ge=O(k,R),Me=R.source;t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+de);const Ee=s.get(Me);if(Me.version!==Ee.__version||ge===!0){t.activeTexture(r.TEXTURE0+de);const qe=Tt.getPrimaries(Tt.workingColorSpace),Le=R.colorSpace===vr?null:Tt.getPrimaries(R.colorSpace),Pe=R.colorSpace===vr||qe===Le?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const it=R.isCompressedTexture||R.image[0].isCompressedTexture,Re=R.image[0]&&R.image[0].isDataTexture,We=[];for(let me=0;me<6;me++)!it&&!Re?We[me]=E(R.image[me],!0,o.maxCubemapSize):We[me]=Re?R.image[me].image:R.image[me],We[me]=lt(R,We[me]);const at=We[0],W=l.convert(R.format,R.colorSpace),Z=l.convert(R.type),ve=A(R.internalFormat,W,Z,R.colorSpace),be=R.isVideoTexture!==!0,Qe=Ee.__version===void 0||ge===!0,je=Me.dataReady;let B=b(R,at);ee(r.TEXTURE_CUBE_MAP,R);let pe;if(it){be&&Qe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,B,ve,at.width,at.height);for(let me=0;me<6;me++){pe=We[me].mipmaps;for(let Ne=0;Ne<pe.length;Ne++){const Fe=pe[Ne];R.format!==vi?W!==null?be?je&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,0,0,Fe.width,Fe.height,W,Fe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,ve,Fe.width,Fe.height,0,Fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):be?je&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,0,0,Fe.width,Fe.height,W,Z,Fe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,ve,Fe.width,Fe.height,0,W,Z,Fe.data)}}}else{if(pe=R.mipmaps,be&&Qe){pe.length>0&&B++;const me=At(We[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,B,ve,me.width,me.height)}for(let me=0;me<6;me++)if(Re){be?je&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,We[me].width,We[me].height,W,Z,We[me].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,ve,We[me].width,We[me].height,0,W,Z,We[me].data);for(let Ne=0;Ne<pe.length;Ne++){const pt=pe[Ne].image[me].image;be?je&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,0,0,pt.width,pt.height,W,Z,pt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,ve,pt.width,pt.height,0,W,Z,pt.data)}}else{be?je&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,W,Z,We[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,ve,W,Z,We[me]);for(let Ne=0;Ne<pe.length;Ne++){const Fe=pe[Ne];be?je&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,0,0,W,Z,Fe.image[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,ve,W,Z,Fe.image[me])}}}S(R)&&y(r.TEXTURE_CUBE_MAP),Ee.__version=Me.version,R.onUpdate&&R.onUpdate(R)}k.__version=R.version}function te(k,R,de,ge,Me,Ee){const qe=l.convert(de.format,de.colorSpace),Le=l.convert(de.type),Pe=A(de.internalFormat,qe,Le,de.colorSpace);if(!s.get(R).__hasExternalTextures){const Re=Math.max(1,R.width>>Ee),We=Math.max(1,R.height>>Ee);Me===r.TEXTURE_3D||Me===r.TEXTURE_2D_ARRAY?t.texImage3D(Me,Ee,Pe,Re,We,R.depth,0,qe,Le,null):t.texImage2D(Me,Ee,Pe,Re,We,0,qe,Le,null)}t.bindFramebuffer(r.FRAMEBUFFER,k),ot(R)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ge,Me,s.get(de).__webglTexture,0,Ke(R)):(Me===r.TEXTURE_2D||Me>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Me<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ge,Me,s.get(de).__webglTexture,Ee),t.bindFramebuffer(r.FRAMEBUFFER,null)}function he(k,R,de){if(r.bindRenderbuffer(r.RENDERBUFFER,k),R.depthBuffer&&!R.stencilBuffer){let ge=r.DEPTH_COMPONENT24;if(de||ot(R)){const Me=R.depthTexture;Me&&Me.isDepthTexture&&(Me.type===_r?ge=r.DEPTH_COMPONENT32F:Me.type===na&&(ge=r.DEPTH_COMPONENT24));const Ee=Ke(R);ot(R)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ee,ge,R.width,R.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,Ee,ge,R.width,R.height)}else r.renderbufferStorage(r.RENDERBUFFER,ge,R.width,R.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,k)}else if(R.depthBuffer&&R.stencilBuffer){const ge=Ke(R);de&&ot(R)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ge,r.DEPTH24_STENCIL8,R.width,R.height):ot(R)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ge,r.DEPTH24_STENCIL8,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,k)}else{const ge=R.textures;for(let Me=0;Me<ge.length;Me++){const Ee=ge[Me],qe=l.convert(Ee.format,Ee.colorSpace),Le=l.convert(Ee.type),Pe=A(Ee.internalFormat,qe,Le,Ee.colorSpace),it=Ke(R);de&&ot(R)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,it,Pe,R.width,R.height):ot(R)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,it,Pe,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,Pe,R.width,R.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function we(k,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,k),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(R.depthTexture).__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),z(R.depthTexture,0);const ge=s.get(R.depthTexture).__webglTexture,Me=Ke(R);if(R.depthTexture.format===Ks)ot(R)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ge,0,Me):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ge,0);else if(R.depthTexture.format===eo)ot(R)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ge,0,Me):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function _e(k){const R=s.get(k),de=k.isWebGLCubeRenderTarget===!0;if(k.depthTexture&&!R.__autoAllocateDepthBuffer){if(de)throw new Error("target.depthTexture not supported in Cube render targets");we(R.__webglFramebuffer,k)}else if(de){R.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)t.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer[ge]),R.__webglDepthbuffer[ge]=r.createRenderbuffer(),he(R.__webglDepthbuffer[ge],k,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer=r.createRenderbuffer(),he(R.__webglDepthbuffer,k,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ae(k,R,de){const ge=s.get(k);R!==void 0&&te(ge.__webglFramebuffer,k,k.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),de!==void 0&&_e(k)}function Ie(k){const R=k.texture,de=s.get(k),ge=s.get(R);k.addEventListener("dispose",$);const Me=k.textures,Ee=k.isWebGLCubeRenderTarget===!0,qe=Me.length>1;if(qe||(ge.__webglTexture===void 0&&(ge.__webglTexture=r.createTexture()),ge.__version=R.version,u.memory.textures++),Ee){de.__webglFramebuffer=[];for(let Le=0;Le<6;Le++)if(R.mipmaps&&R.mipmaps.length>0){de.__webglFramebuffer[Le]=[];for(let Pe=0;Pe<R.mipmaps.length;Pe++)de.__webglFramebuffer[Le][Pe]=r.createFramebuffer()}else de.__webglFramebuffer[Le]=r.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){de.__webglFramebuffer=[];for(let Le=0;Le<R.mipmaps.length;Le++)de.__webglFramebuffer[Le]=r.createFramebuffer()}else de.__webglFramebuffer=r.createFramebuffer();if(qe)for(let Le=0,Pe=Me.length;Le<Pe;Le++){const it=s.get(Me[Le]);it.__webglTexture===void 0&&(it.__webglTexture=r.createTexture(),u.memory.textures++)}if(k.samples>0&&ot(k)===!1){de.__webglMultisampledFramebuffer=r.createFramebuffer(),de.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,de.__webglMultisampledFramebuffer);for(let Le=0;Le<Me.length;Le++){const Pe=Me[Le];de.__webglColorRenderbuffer[Le]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,de.__webglColorRenderbuffer[Le]);const it=l.convert(Pe.format,Pe.colorSpace),Re=l.convert(Pe.type),We=A(Pe.internalFormat,it,Re,Pe.colorSpace,k.isXRRenderTarget===!0),at=Ke(k);r.renderbufferStorageMultisample(r.RENDERBUFFER,at,We,k.width,k.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Le,r.RENDERBUFFER,de.__webglColorRenderbuffer[Le])}r.bindRenderbuffer(r.RENDERBUFFER,null),k.depthBuffer&&(de.__webglDepthRenderbuffer=r.createRenderbuffer(),he(de.__webglDepthRenderbuffer,k,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Ee){t.bindTexture(r.TEXTURE_CUBE_MAP,ge.__webglTexture),ee(r.TEXTURE_CUBE_MAP,R);for(let Le=0;Le<6;Le++)if(R.mipmaps&&R.mipmaps.length>0)for(let Pe=0;Pe<R.mipmaps.length;Pe++)te(de.__webglFramebuffer[Le][Pe],k,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pe);else te(de.__webglFramebuffer[Le],k,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0);S(R)&&y(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(qe){for(let Le=0,Pe=Me.length;Le<Pe;Le++){const it=Me[Le],Re=s.get(it);t.bindTexture(r.TEXTURE_2D,Re.__webglTexture),ee(r.TEXTURE_2D,it),te(de.__webglFramebuffer,k,it,r.COLOR_ATTACHMENT0+Le,r.TEXTURE_2D,0),S(it)&&y(r.TEXTURE_2D)}t.unbindTexture()}else{let Le=r.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(Le=k.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Le,ge.__webglTexture),ee(Le,R),R.mipmaps&&R.mipmaps.length>0)for(let Pe=0;Pe<R.mipmaps.length;Pe++)te(de.__webglFramebuffer[Pe],k,R,r.COLOR_ATTACHMENT0,Le,Pe);else te(de.__webglFramebuffer,k,R,r.COLOR_ATTACHMENT0,Le,0);S(R)&&y(Le),t.unbindTexture()}k.depthBuffer&&_e(k)}function K(k){const R=k.textures;for(let de=0,ge=R.length;de<ge;de++){const Me=R[de];if(S(Me)){const Ee=k.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,qe=s.get(Me).__webglTexture;t.bindTexture(Ee,qe),y(Ee),t.unbindTexture()}}}const mt=[],Ye=[];function ht(k){if(k.samples>0){if(ot(k)===!1){const R=k.textures,de=k.width,ge=k.height;let Me=r.COLOR_BUFFER_BIT;const Ee=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,qe=s.get(k),Le=R.length>1;if(Le)for(let Pe=0;Pe<R.length;Pe++)t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pe,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pe,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,qe.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglFramebuffer);for(let Pe=0;Pe<R.length;Pe++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(Me|=r.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(Me|=r.STENCIL_BUFFER_BIT)),Le){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Pe]);const it=s.get(R[Pe]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,it,0)}r.blitFramebuffer(0,0,de,ge,0,0,de,ge,Me,r.NEAREST),m===!0&&(mt.length=0,Ye.length=0,mt.push(r.COLOR_ATTACHMENT0+Pe),k.depthBuffer&&k.resolveDepthBuffer===!1&&(mt.push(Ee),Ye.push(Ee),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Ye)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,mt))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Le)for(let Pe=0;Pe<R.length;Pe++){t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pe,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Pe]);const it=s.get(R[Pe]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Pe,r.TEXTURE_2D,it,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&m){const R=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[R])}}}function Ke(k){return Math.min(o.maxSamples,k.samples)}function ot(k){const R=s.get(k);return k.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function st(k){const R=u.render.frame;g.get(k)!==R&&(g.set(k,R),k.update())}function lt(k,R){const de=k.colorSpace,ge=k.format,Me=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||de!==Tr&&de!==vr&&(Tt.getTransfer(de)===Lt?(ge!==vi||Me!==Mr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",de)),R}function At(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(p.width=k.naturalWidth||k.width,p.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(p.width=k.displayWidth,p.height=k.displayHeight):(p.width=k.width,p.height=k.height),p}this.allocateTextureUnit=j,this.resetTextureUnits=C,this.setTexture2D=z,this.setTexture2DArray=ne,this.setTexture3D=ue,this.setTextureCube=G,this.rebindTextures=Ae,this.setupRenderTarget=Ie,this.updateRenderTargetMipmap=K,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=te,this.useMultisampledRTT=ot}function i1(r,e){function t(s,o=vr){let l;const u=Tt.getTransfer(o);if(s===Mr)return r.UNSIGNED_BYTE;if(s===Xg)return r.UNSIGNED_SHORT_4_4_4_4;if(s===qg)return r.UNSIGNED_SHORT_5_5_5_1;if(s===zy)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Oy)return r.BYTE;if(s===ky)return r.SHORT;if(s===Wg)return r.UNSIGNED_SHORT;if(s===$g)return r.INT;if(s===na)return r.UNSIGNED_INT;if(s===_r)return r.FLOAT;if(s===Ql)return r.HALF_FLOAT;if(s===By)return r.ALPHA;if(s===jy)return r.RGB;if(s===vi)return r.RGBA;if(s===Hy)return r.LUMINANCE;if(s===Vy)return r.LUMINANCE_ALPHA;if(s===Ks)return r.DEPTH_COMPONENT;if(s===eo)return r.DEPTH_STENCIL;if(s===Gy)return r.RED;if(s===Yg)return r.RED_INTEGER;if(s===Wy)return r.RG;if(s===Kg)return r.RG_INTEGER;if(s===Zg)return r.RGBA_INTEGER;if(s===$u||s===Xu||s===qu||s===Yu)if(u===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(s===$u)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===qu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Yu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(s===$u)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===qu)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Yu)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===em||s===tm||s===nm||s===im)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(s===em)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===tm)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===nm)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===im)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===rm||s===sm||s===am)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(s===rm||s===sm)return u===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(s===am)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===om||s===lm||s===cm||s===um||s===dm||s===fm||s===hm||s===pm||s===mm||s===gm||s===vm||s===_m||s===xm||s===ym)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(s===om)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===lm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===cm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===um)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===dm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===fm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===hm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===pm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===mm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===gm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===vm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===_m)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===xm)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===ym)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Ku||s===Sm||s===Mm)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(s===Ku)return u===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Sm)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Mm)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===$y||s===Em||s===wm||s===Tm)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(s===Ku)return l.COMPRESSED_RED_RGTC1_EXT;if(s===Em)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===wm)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Tm)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===no?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:t}}class r1 extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Za extends gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const s1={type:"move"};class Ed{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Za,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Za,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new le,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new le),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Za,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new le,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new le),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const s of e.hand.values())this._getHandJoint(t,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,s){let o=null,l=null,u=null;const f=this._targetRay,m=this._grip,p=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(p&&e.hand){u=!0;for(const E of e.hand.values()){const S=t.getJointPose(E,s),y=this._getHandJoint(p,E);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const g=p.joints["index-finger-tip"],x=p.joints["thumb-tip"],_=g.position.distanceTo(x.position),M=.02,w=.005;p.inputState.pinching&&_>M+w?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&_<=M-w&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,s),l!==null&&(m.matrix.fromArray(l.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,l.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(l.linearVelocity)):m.hasLinearVelocity=!1,l.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(l.angularVelocity)):m.hasAngularVelocity=!1));f!==null&&(o=t.getPose(e.targetRaySpace,s),o===null&&l!==null&&(o=l),o!==null&&(f.matrix.fromArray(o.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,o.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(o.linearVelocity)):f.hasLinearVelocity=!1,o.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(o.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(s1)))}return f!==null&&(f.visible=o!==null),m!==null&&(m.visible=l!==null),p!==null&&(p.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const s=new Za;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[t.jointName]=s,e.add(s)}return e.joints[t.jointName]}}const a1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,o1=`
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

}`;class l1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,s){if(this.texture===null){const o=new Pn,l=e.properties.get(o);l.__webglTexture=t.texture,(t.depthNear!=s.depthNear||t.depthFar!=s.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}render(e,t){if(this.texture!==null){if(this.mesh===null){const s=t.cameras[0].viewport,o=new Er({vertexShader:a1,fragmentShader:o1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:s.z},depthHeight:{value:s.w}}});this.mesh=new _i(new tc(20,20),o)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class c1 extends sa{constructor(e,t){super();const s=this;let o=null,l=1,u=null,f="local-floor",m=1,p=null,g=null,x=null,_=null,M=null,w=null;const E=new l1,S=t.getContextAttributes();let y=null,A=null;const b=[],D=[],$=new _t;let U=null;const L=new qn;L.layers.enable(1),L.viewport=new rn;const q=new qn;q.layers.enable(2),q.viewport=new rn;const N=[L,q],C=new r1;C.layers.enable(1),C.layers.enable(2);let j=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let he=b[te];return he===void 0&&(he=new Ed,b[te]=he),he.getTargetRaySpace()},this.getControllerGrip=function(te){let he=b[te];return he===void 0&&(he=new Ed,b[te]=he),he.getGripSpace()},this.getHand=function(te){let he=b[te];return he===void 0&&(he=new Ed,b[te]=he),he.getHandSpace()};function z(te){const he=D.indexOf(te.inputSource);if(he===-1)return;const we=b[he];we!==void 0&&(we.update(te.inputSource,te.frame,p||u),we.dispatchEvent({type:te.type,data:te.inputSource}))}function ne(){o.removeEventListener("select",z),o.removeEventListener("selectstart",z),o.removeEventListener("selectend",z),o.removeEventListener("squeeze",z),o.removeEventListener("squeezestart",z),o.removeEventListener("squeezeend",z),o.removeEventListener("end",ne),o.removeEventListener("inputsourceschange",ue);for(let te=0;te<b.length;te++){const he=D[te];he!==null&&(D[te]=null,b[te].disconnect(he))}j=null,X=null,E.reset(),e.setRenderTarget(y),M=null,_=null,x=null,o=null,A=null,ke.stop(),s.isPresenting=!1,e.setPixelRatio(U),e.setSize($.width,$.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){l=te,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){f=te,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||u},this.setReferenceSpace=function(te){p=te},this.getBaseLayer=function(){return _!==null?_:M},this.getBinding=function(){return x},this.getFrame=function(){return w},this.getSession=function(){return o},this.setSession=async function(te){if(o=te,o!==null){if(y=e.getRenderTarget(),o.addEventListener("select",z),o.addEventListener("selectstart",z),o.addEventListener("selectend",z),o.addEventListener("squeeze",z),o.addEventListener("squeezestart",z),o.addEventListener("squeezeend",z),o.addEventListener("end",ne),o.addEventListener("inputsourceschange",ue),S.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize($),o.renderState.layers===void 0){const he={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};M=new XRWebGLLayer(o,t,he),o.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),A=new ns(M.framebufferWidth,M.framebufferHeight,{format:vi,type:Mr,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let he=null,we=null,_e=null;S.depth&&(_e=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=S.stencil?eo:Ks,we=S.stencil?no:na);const Ae={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:l};x=new XRWebGLBinding(o,t),_=x.createProjectionLayer(Ae),o.updateRenderState({layers:[_]}),e.setPixelRatio(1),e.setSize(_.textureWidth,_.textureHeight,!1),A=new ns(_.textureWidth,_.textureHeight,{format:vi,type:Mr,depthTexture:new hv(_.textureWidth,_.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:_.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(m),p=null,u=await o.requestReferenceSpace(f),ke.setContext(o),ke.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode};function ue(te){for(let he=0;he<te.removed.length;he++){const we=te.removed[he],_e=D.indexOf(we);_e>=0&&(D[_e]=null,b[_e].disconnect(we))}for(let he=0;he<te.added.length;he++){const we=te.added[he];let _e=D.indexOf(we);if(_e===-1){for(let Ie=0;Ie<b.length;Ie++)if(Ie>=D.length){D.push(we),_e=Ie;break}else if(D[Ie]===null){D[Ie]=we,_e=Ie;break}if(_e===-1)break}const Ae=b[_e];Ae&&Ae.connect(we)}}const G=new le,Y=new le;function F(te,he,we){G.setFromMatrixPosition(he.matrixWorld),Y.setFromMatrixPosition(we.matrixWorld);const _e=G.distanceTo(Y),Ae=he.projectionMatrix.elements,Ie=we.projectionMatrix.elements,K=Ae[14]/(Ae[10]-1),mt=Ae[14]/(Ae[10]+1),Ye=(Ae[9]+1)/Ae[5],ht=(Ae[9]-1)/Ae[5],Ke=(Ae[8]-1)/Ae[0],ot=(Ie[8]+1)/Ie[0],st=K*Ke,lt=K*ot,At=_e/(-Ke+ot),k=At*-Ke;he.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(k),te.translateZ(At),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert();const R=K+At,de=mt+At,ge=st-k,Me=lt+(_e-k),Ee=Ye*mt/de*R,qe=ht*mt/de*R;te.projectionMatrix.makePerspective(ge,Me,Ee,qe,R,de),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}function re(te,he){he===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(he.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(o===null)return;E.texture!==null&&(te.near=E.depthNear,te.far=E.depthFar),C.near=q.near=L.near=te.near,C.far=q.far=L.far=te.far,(j!==C.near||X!==C.far)&&(o.updateRenderState({depthNear:C.near,depthFar:C.far}),j=C.near,X=C.far,L.near=j,L.far=X,q.near=j,q.far=X,L.updateProjectionMatrix(),q.updateProjectionMatrix(),te.updateProjectionMatrix());const he=te.parent,we=C.cameras;re(C,he);for(let _e=0;_e<we.length;_e++)re(we[_e],he);we.length===2?F(C,L,q):C.projectionMatrix.copy(L.projectionMatrix),ee(te,C,he)};function ee(te,he,we){we===null?te.matrix.copy(he.matrixWorld):(te.matrix.copy(we.matrixWorld),te.matrix.invert(),te.matrix.multiply(he.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(he.projectionMatrix),te.projectionMatrixInverse.copy(he.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=Fd*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(_===null&&M===null))return m},this.setFoveation=function(te){m=te,_!==null&&(_.fixedFoveation=te),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=te)},this.hasDepthSensing=function(){return E.texture!==null};let O=null;function ce(te,he){if(g=he.getViewerPose(p||u),w=he,g!==null){const we=g.views;M!==null&&(e.setRenderTargetFramebuffer(A,M.framebuffer),e.setRenderTarget(A));let _e=!1;we.length!==C.cameras.length&&(C.cameras.length=0,_e=!0);for(let Ie=0;Ie<we.length;Ie++){const K=we[Ie];let mt=null;if(M!==null)mt=M.getViewport(K);else{const ht=x.getViewSubImage(_,K);mt=ht.viewport,Ie===0&&(e.setRenderTargetTextures(A,ht.colorTexture,_.ignoreDepthValues?void 0:ht.depthStencilTexture),e.setRenderTarget(A))}let Ye=N[Ie];Ye===void 0&&(Ye=new qn,Ye.layers.enable(Ie),Ye.viewport=new rn,N[Ie]=Ye),Ye.matrix.fromArray(K.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(K.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(mt.x,mt.y,mt.width,mt.height),Ie===0&&(C.matrix.copy(Ye.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),_e===!0&&C.cameras.push(Ye)}const Ae=o.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Ie=x.getDepthInformation(we[0]);Ie&&Ie.isValid&&Ie.texture&&E.init(e,Ie,o.renderState)}}for(let we=0;we<b.length;we++){const _e=D[we],Ae=b[we];_e!==null&&Ae!==void 0&&Ae.update(_e,he,p||u)}E.render(e,C),O&&O(te,he),he.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:he}),w=null}const ke=new dv;ke.setAnimationLoop(ce),this.setAnimationLoop=function(te){O=te},this.dispose=function(){}}}const Wr=new Si,u1=new Bt;function d1(r,e){function t(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function s(S,y){y.color.getRGB(S.fogColor.value,lv(r)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function o(S,y,A,b,D){y.isMeshBasicMaterial||y.isMeshLambertMaterial?l(S,y):y.isMeshToonMaterial?(l(S,y),x(S,y)):y.isMeshPhongMaterial?(l(S,y),g(S,y)):y.isMeshStandardMaterial?(l(S,y),_(S,y),y.isMeshPhysicalMaterial&&M(S,y,D)):y.isMeshMatcapMaterial?(l(S,y),w(S,y)):y.isMeshDepthMaterial?l(S,y):y.isMeshDistanceMaterial?(l(S,y),E(S,y)):y.isMeshNormalMaterial?l(S,y):y.isLineBasicMaterial?(u(S,y),y.isLineDashedMaterial&&f(S,y)):y.isPointsMaterial?m(S,y,A,b):y.isSpriteMaterial?p(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function l(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,t(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===Nn&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,t(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===Nn&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,t(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,t(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const A=e.get(y),b=A.envMap,D=A.envMapRotation;if(b&&(S.envMap.value=b,Wr.copy(D),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),S.envMapRotation.value.setFromMatrix4(u1.makeRotationFromEuler(Wr)),S.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap){S.lightMap.value=y.lightMap;const $=r._useLegacyLights===!0?Math.PI:1;S.lightMapIntensity.value=y.lightMapIntensity*$,t(y.lightMap,S.lightMapTransform)}y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,S.aoMapTransform))}function u(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform))}function f(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function m(S,y,A,b){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*A,S.scale.value=b*.5,y.map&&(S.map.value=y.map,t(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function p(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function g(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function x(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function _(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function M(S,y,A){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Nn&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=A.texture,S.transmissionSamplerSize.value.set(A.width,A.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,S.specularIntensityMapTransform))}function w(S,y){y.matcap&&(S.matcap.value=y.matcap)}function E(S,y){const A=e.get(y).light;S.referencePosition.value.setFromMatrixPosition(A.matrixWorld),S.nearDistance.value=A.shadow.camera.near,S.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:o}}function f1(r,e,t,s){let o={},l={},u=[];const f=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(A,b){const D=b.program;s.uniformBlockBinding(A,D)}function p(A,b){let D=o[A.id];D===void 0&&(w(A),D=g(A),o[A.id]=D,A.addEventListener("dispose",S));const $=b.program;s.updateUBOMapping(A,$);const U=e.render.frame;l[A.id]!==U&&(_(A),l[A.id]=U)}function g(A){const b=x();A.__bindingPointIndex=b;const D=r.createBuffer(),$=A.__size,U=A.usage;return r.bindBuffer(r.UNIFORM_BUFFER,D),r.bufferData(r.UNIFORM_BUFFER,$,U),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,b,D),D}function x(){for(let A=0;A<f;A++)if(u.indexOf(A)===-1)return u.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function _(A){const b=o[A.id],D=A.uniforms,$=A.__cache;r.bindBuffer(r.UNIFORM_BUFFER,b);for(let U=0,L=D.length;U<L;U++){const q=Array.isArray(D[U])?D[U]:[D[U]];for(let N=0,C=q.length;N<C;N++){const j=q[N];if(M(j,U,N,$)===!0){const X=j.__offset,z=Array.isArray(j.value)?j.value:[j.value];let ne=0;for(let ue=0;ue<z.length;ue++){const G=z[ue],Y=E(G);typeof G=="number"||typeof G=="boolean"?(j.__data[0]=G,r.bufferSubData(r.UNIFORM_BUFFER,X+ne,j.__data)):G.isMatrix3?(j.__data[0]=G.elements[0],j.__data[1]=G.elements[1],j.__data[2]=G.elements[2],j.__data[3]=0,j.__data[4]=G.elements[3],j.__data[5]=G.elements[4],j.__data[6]=G.elements[5],j.__data[7]=0,j.__data[8]=G.elements[6],j.__data[9]=G.elements[7],j.__data[10]=G.elements[8],j.__data[11]=0):(G.toArray(j.__data,ne),ne+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,X,j.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(A,b,D,$){const U=A.value,L=b+"_"+D;if($[L]===void 0)return typeof U=="number"||typeof U=="boolean"?$[L]=U:$[L]=U.clone(),!0;{const q=$[L];if(typeof U=="number"||typeof U=="boolean"){if(q!==U)return $[L]=U,!0}else if(q.equals(U)===!1)return q.copy(U),!0}return!1}function w(A){const b=A.uniforms;let D=0;const $=16;for(let L=0,q=b.length;L<q;L++){const N=Array.isArray(b[L])?b[L]:[b[L]];for(let C=0,j=N.length;C<j;C++){const X=N[C],z=Array.isArray(X.value)?X.value:[X.value];for(let ne=0,ue=z.length;ne<ue;ne++){const G=z[ne],Y=E(G),F=D%$;F!==0&&$-F<Y.boundary&&(D+=$-F),X.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=D,D+=Y.storage}}}const U=D%$;return U>0&&(D+=$-U),A.__size=D,A.__cache={},this}function E(A){const b={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(b.boundary=4,b.storage=4):A.isVector2?(b.boundary=8,b.storage=8):A.isVector3||A.isColor?(b.boundary=16,b.storage=12):A.isVector4?(b.boundary=16,b.storage=16):A.isMatrix3?(b.boundary=48,b.storage=48):A.isMatrix4?(b.boundary=64,b.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),b}function S(A){const b=A.target;b.removeEventListener("dispose",S);const D=u.indexOf(b.__bindingPointIndex);u.splice(D,1),r.deleteBuffer(o[b.id]),delete o[b.id],delete l[b.id]}function y(){for(const A in o)r.deleteBuffer(o[A]);u=[],o={},l={}}return{bind:m,update:p,dispose:y}}class h1{constructor(e={}){const{canvas:t=rS(),context:s=null,depth:o=!0,stencil:l=!1,alpha:u=!1,antialias:f=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:x=!1}=e;this.isWebGLRenderer=!0;let _;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=s.getContextAttributes().alpha}else _=u;const M=new Uint32Array(4),w=new Int32Array(4);let E=null,S=null;const y=[],A=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hi,this._useLegacyLights=!1,this.toneMapping=yr,this.toneMappingExposure=1;const b=this;let D=!1,$=0,U=0,L=null,q=-1,N=null;const C=new rn,j=new rn;let X=null;const z=new Mt(0);let ne=0,ue=t.width,G=t.height,Y=1,F=null,re=null;const ee=new rn(0,0,ue,G),O=new rn(0,0,ue,G);let ce=!1;const ke=new Zd;let te=!1,he=!1;const we=new Bt,_e=new le,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ie(){return L===null?Y:1}let K=s;function mt(P,J){return t.getContext(P,J)}try{const P={alpha:!0,depth:o,stencil:l,antialias:f,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:x};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qd}`),t.addEventListener("webglcontextlost",B,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",me,!1),K===null){const J="webgl2";if(K=mt(J,P),K===null)throw mt(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Ye,ht,Ke,ot,st,lt,At,k,R,de,ge,Me,Ee,qe,Le,Pe,it,Re,We,at,W,Z,ve,be;function Qe(){Ye=new Sw(K),Ye.init(),Z=new i1(K,Ye),ht=new mw(K,Ye,e,Z),Ke=new t1(K),ot=new ww(K),st=new jT,lt=new n1(K,Ye,Ke,st,ht,Z,ot),At=new vw(b),k=new yw(b),R=new PS(K),ve=new hw(K,R),de=new Mw(K,R,ot,ve),ge=new Aw(K,de,R,ot),We=new Tw(K,ht,lt),Pe=new gw(st),Me=new BT(b,At,k,Ye,ht,ve,Pe),Ee=new d1(b,st),qe=new VT,Le=new YT(Ye),Re=new fw(b,At,k,Ke,ge,_,m),it=new e1(b,ge,ht),be=new f1(K,ot,ht,Ke),at=new pw(K,Ye,ot),W=new Ew(K,Ye,ot),ot.programs=Me.programs,b.capabilities=ht,b.extensions=Ye,b.properties=st,b.renderLists=qe,b.shadowMap=it,b.state=Ke,b.info=ot}Qe();const je=new c1(b,K);this.xr=je,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){const P=Ye.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Ye.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(P){P!==void 0&&(Y=P,this.setSize(ue,G,!1))},this.getSize=function(P){return P.set(ue,G)},this.setSize=function(P,J,fe=!0){if(je.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ue=P,G=J,t.width=Math.floor(P*Y),t.height=Math.floor(J*Y),fe===!0&&(t.style.width=P+"px",t.style.height=J+"px"),this.setViewport(0,0,P,J)},this.getDrawingBufferSize=function(P){return P.set(ue*Y,G*Y).floor()},this.setDrawingBufferSize=function(P,J,fe){ue=P,G=J,Y=fe,t.width=Math.floor(P*fe),t.height=Math.floor(J*fe),this.setViewport(0,0,P,J)},this.getCurrentViewport=function(P){return P.copy(C)},this.getViewport=function(P){return P.copy(ee)},this.setViewport=function(P,J,fe,ae){P.isVector4?ee.set(P.x,P.y,P.z,P.w):ee.set(P,J,fe,ae),Ke.viewport(C.copy(ee).multiplyScalar(Y).round())},this.getScissor=function(P){return P.copy(O)},this.setScissor=function(P,J,fe,ae){P.isVector4?O.set(P.x,P.y,P.z,P.w):O.set(P,J,fe,ae),Ke.scissor(j.copy(O).multiplyScalar(Y).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(P){Ke.setScissorTest(ce=P)},this.setOpaqueSort=function(P){F=P},this.setTransparentSort=function(P){re=P},this.getClearColor=function(P){return P.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor.apply(Re,arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha.apply(Re,arguments)},this.clear=function(P=!0,J=!0,fe=!0){let ae=0;if(P){let se=!1;if(L!==null){const De=L.texture.format;se=De===Zg||De===Kg||De===Yg}if(se){const De=L.texture.type,Ge=De===Mr||De===na||De===Wg||De===no||De===Xg||De===qg,Xe=Re.getClearColor(),et=Re.getClearAlpha(),rt=Xe.r,He=Xe.g,ct=Xe.b;Ge?(M[0]=rt,M[1]=He,M[2]=ct,M[3]=et,K.clearBufferuiv(K.COLOR,0,M)):(w[0]=rt,w[1]=He,w[2]=ct,w[3]=et,K.clearBufferiv(K.COLOR,0,w))}else ae|=K.COLOR_BUFFER_BIT}J&&(ae|=K.DEPTH_BUFFER_BIT),fe&&(ae|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",B,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",me,!1),qe.dispose(),Le.dispose(),st.dispose(),At.dispose(),k.dispose(),ge.dispose(),ve.dispose(),be.dispose(),Me.dispose(),je.dispose(),je.removeEventListener("sessionstart",yt),je.removeEventListener("sessionend",Sn),Zt.stop()};function B(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const P=ot.autoReset,J=it.enabled,fe=it.autoUpdate,ae=it.needsUpdate,se=it.type;Qe(),ot.autoReset=P,it.enabled=J,it.autoUpdate=fe,it.needsUpdate=ae,it.type=se}function me(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Ne(P){const J=P.target;J.removeEventListener("dispose",Ne),Fe(J)}function Fe(P){pt(P),st.remove(P)}function pt(P){const J=st.get(P).programs;J!==void 0&&(J.forEach(function(fe){Me.releaseProgram(fe)}),P.isShaderMaterial&&Me.releaseShaderCache(P))}this.renderBufferDirect=function(P,J,fe,ae,se,De){J===null&&(J=Ae);const Ge=se.isMesh&&se.matrixWorld.determinant()<0,Xe=ic(P,J,fe,ae,se);Ke.setMaterial(ae,Ge);let et=fe.index,rt=1;if(ae.wireframe===!0){if(et=de.getWireframeAttribute(fe),et===void 0)return;rt=2}const He=fe.drawRange,ct=fe.attributes.position;let Dt=He.start*rt,Gt=(He.start+He.count)*rt;De!==null&&(Dt=Math.max(Dt,De.start*rt),Gt=Math.min(Gt,(De.start+De.count)*rt)),et!==null?(Dt=Math.max(Dt,0),Gt=Math.min(Gt,et.count)):ct!=null&&(Dt=Math.max(Dt,0),Gt=Math.min(Gt,ct.count));const Jt=Gt-Dt;if(Jt<0||Jt===1/0)return;ve.setup(se,ae,Xe,fe,et);let Zn,gt=at;if(et!==null&&(Zn=R.get(et),gt=W,gt.setIndex(Zn)),se.isMesh)ae.wireframe===!0?(Ke.setLineWidth(ae.wireframeLinewidth*Ie()),gt.setMode(K.LINES)):gt.setMode(K.TRIANGLES);else if(se.isLine){let tt=ae.linewidth;tt===void 0&&(tt=1),Ke.setLineWidth(tt*Ie()),se.isLineSegments?gt.setMode(K.LINES):se.isLineLoop?gt.setMode(K.LINE_LOOP):gt.setMode(K.LINE_STRIP)}else se.isPoints?gt.setMode(K.POINTS):se.isSprite&&gt.setMode(K.TRIANGLES);if(se.isBatchedMesh)se._multiDrawInstances!==null?gt.renderMultiDrawInstances(se._multiDrawStarts,se._multiDrawCounts,se._multiDrawCount,se._multiDrawInstances):gt.renderMultiDraw(se._multiDrawStarts,se._multiDrawCounts,se._multiDrawCount);else if(se.isInstancedMesh)gt.renderInstances(Dt,Jt,se.count);else if(fe.isInstancedBufferGeometry){const tt=fe._maxInstanceCount!==void 0?fe._maxInstanceCount:1/0,ln=Math.min(fe.instanceCount,tt);gt.renderInstances(Dt,Jt,ln)}else gt.render(Dt,Jt)};function wt(P,J,fe){P.transparent===!0&&P.side===mi&&P.forceSinglePass===!1?(P.side=Nn,P.needsUpdate=!0,Mi(P,J,fe),P.side=Sr,P.needsUpdate=!0,Mi(P,J,fe),P.side=mi):Mi(P,J,fe)}this.compile=function(P,J,fe=null){fe===null&&(fe=P),S=Le.get(fe),S.init(J),A.push(S),fe.traverseVisible(function(se){se.isLight&&se.layers.test(J.layers)&&(S.pushLight(se),se.castShadow&&S.pushShadow(se))}),P!==fe&&P.traverseVisible(function(se){se.isLight&&se.layers.test(J.layers)&&(S.pushLight(se),se.castShadow&&S.pushShadow(se))}),S.setupLights(b._useLegacyLights);const ae=new Set;return P.traverse(function(se){const De=se.material;if(De)if(Array.isArray(De))for(let Ge=0;Ge<De.length;Ge++){const Xe=De[Ge];wt(Xe,fe,se),ae.add(Xe)}else wt(De,fe,se),ae.add(De)}),A.pop(),S=null,ae},this.compileAsync=function(P,J,fe=null){const ae=this.compile(P,J,fe);return new Promise(se=>{function De(){if(ae.forEach(function(Ge){st.get(Ge).currentProgram.isReady()&&ae.delete(Ge)}),ae.size===0){se(P);return}setTimeout(De,10)}Ye.get("KHR_parallel_shader_compile")!==null?De():setTimeout(De,10)})};let Rt=null;function Vt(P){Rt&&Rt(P)}function yt(){Zt.stop()}function Sn(){Zt.start()}const Zt=new dv;Zt.setAnimationLoop(Vt),typeof self<"u"&&Zt.setContext(self),this.setAnimationLoop=function(P){Rt=P,je.setAnimationLoop(P),P===null?Zt.stop():Zt.start()},je.addEventListener("sessionstart",yt),je.addEventListener("sessionend",Sn),this.render=function(P,J){if(J!==void 0&&J.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),je.enabled===!0&&je.isPresenting===!0&&(je.cameraAutoUpdate===!0&&je.updateCamera(J),J=je.getCamera()),P.isScene===!0&&P.onBeforeRender(b,P,J,L),S=Le.get(P,A.length),S.init(J),A.push(S),we.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),ke.setFromProjectionMatrix(we),he=this.localClippingEnabled,te=Pe.init(this.clippingPlanes,he),E=qe.get(P,y.length),E.init(),y.push(E),Vi(P,J,0,b.sortObjects),E.finish(),b.sortObjects===!0&&E.sort(F,re);const fe=je.enabled===!1||je.isPresenting===!1||je.hasDepthSensing()===!1;fe&&Re.addToRenderList(E,P),this.info.render.frame++,te===!0&&Pe.beginShadows();const ae=S.state.shadowsArray;it.render(ae,P,J),te===!0&&Pe.endShadows(),this.info.autoReset===!0&&this.info.reset();const se=E.opaque,De=E.transmissive;if(S.setupLights(b._useLegacyLights),J.isArrayCamera){const Ge=J.cameras;if(De.length>0)for(let Xe=0,et=Ge.length;Xe<et;Xe++){const rt=Ge[Xe];Gi(se,De,P,rt)}fe&&Re.render(P);for(let Xe=0,et=Ge.length;Xe<et;Xe++){const rt=Ge[Xe];is(E,P,rt,rt.viewport)}}else De.length>0&&Gi(se,De,P,J),fe&&Re.render(P),is(E,P,J);L!==null&&(lt.updateMultisampleRenderTarget(L),lt.updateRenderTargetMipmap(L)),P.isScene===!0&&P.onAfterRender(b,P,J),ve.resetDefaultState(),q=-1,N=null,A.pop(),A.length>0?(S=A[A.length-1],te===!0&&Pe.setGlobalState(b.clippingPlanes,S.state.camera)):S=null,y.pop(),y.length>0?E=y[y.length-1]:E=null};function Vi(P,J,fe,ae){if(P.visible===!1)return;if(P.layers.test(J.layers)){if(P.isGroup)fe=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(J);else if(P.isLight)S.pushLight(P),P.castShadow&&S.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||ke.intersectsSprite(P)){ae&&_e.setFromMatrixPosition(P.matrixWorld).applyMatrix4(we);const Ge=ge.update(P),Xe=P.material;Xe.visible&&E.push(P,Ge,Xe,fe,_e.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||ke.intersectsObject(P))){const Ge=ge.update(P),Xe=P.material;if(ae&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),_e.copy(P.boundingSphere.center)):(Ge.boundingSphere===null&&Ge.computeBoundingSphere(),_e.copy(Ge.boundingSphere.center)),_e.applyMatrix4(P.matrixWorld).applyMatrix4(we)),Array.isArray(Xe)){const et=Ge.groups;for(let rt=0,He=et.length;rt<He;rt++){const ct=et[rt],Dt=Xe[ct.materialIndex];Dt&&Dt.visible&&E.push(P,Ge,Dt,fe,_e.z,ct)}}else Xe.visible&&E.push(P,Ge,Xe,fe,_e.z,null)}}const De=P.children;for(let Ge=0,Xe=De.length;Ge<Xe;Ge++)Vi(De[Ge],J,fe,ae)}function is(P,J,fe,ae){const se=P.opaque,De=P.transmissive,Ge=P.transparent;S.setupLightsView(fe),te===!0&&Pe.setGlobalState(b.clippingPlanes,fe),ae&&Ke.viewport(C.copy(ae)),se.length>0&&rs(se,J,fe),De.length>0&&rs(De,J,fe),Ge.length>0&&rs(Ge,J,fe),Ke.buffers.depth.setTest(!0),Ke.buffers.depth.setMask(!0),Ke.buffers.color.setMask(!0),Ke.setPolygonOffset(!1)}function Gi(P,J,fe,ae){if((fe.isScene===!0?fe.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[ae.id]===void 0&&(S.state.transmissionRenderTarget[ae.id]=new ns(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?Ql:Mr,minFilter:Jr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1}));const De=S.state.transmissionRenderTarget[ae.id],Ge=ae.viewport||C;De.setSize(Ge.z,Ge.w);const Xe=b.getRenderTarget();b.setRenderTarget(De),b.getClearColor(z),ne=b.getClearAlpha(),ne<1&&b.setClearColor(16777215,.5),b.clear();const et=b.toneMapping;b.toneMapping=yr;const rt=ae.viewport;if(ae.viewport!==void 0&&(ae.viewport=void 0),S.setupLightsView(ae),te===!0&&Pe.setGlobalState(b.clippingPlanes,ae),rs(P,fe,ae),lt.updateMultisampleRenderTarget(De),lt.updateRenderTargetMipmap(De),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let ct=0,Dt=J.length;ct<Dt;ct++){const Gt=J[ct],Jt=Gt.object,Zn=Gt.geometry,gt=Gt.material,tt=Gt.group;if(gt.side===mi&&Jt.layers.test(ae.layers)){const ln=gt.side;gt.side=Nn,gt.needsUpdate=!0,Wi(Jt,fe,ae,Zn,gt,tt),gt.side=ln,gt.needsUpdate=!0,He=!0}}He===!0&&(lt.updateMultisampleRenderTarget(De),lt.updateRenderTargetMipmap(De))}b.setRenderTarget(Xe),b.setClearColor(z,ne),rt!==void 0&&(ae.viewport=rt),b.toneMapping=et}function rs(P,J,fe){const ae=J.isScene===!0?J.overrideMaterial:null;for(let se=0,De=P.length;se<De;se++){const Ge=P[se],Xe=Ge.object,et=Ge.geometry,rt=ae===null?Ge.material:ae,He=Ge.group;Xe.layers.test(fe.layers)&&Wi(Xe,J,fe,et,rt,He)}}function Wi(P,J,fe,ae,se,De){P.onBeforeRender(b,J,fe,ae,se,De),P.modelViewMatrix.multiplyMatrices(fe.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),se.onBeforeRender(b,J,fe,ae,P,De),se.transparent===!0&&se.side===mi&&se.forceSinglePass===!1?(se.side=Nn,se.needsUpdate=!0,b.renderBufferDirect(fe,J,ae,se,P,De),se.side=Sr,se.needsUpdate=!0,b.renderBufferDirect(fe,J,ae,se,P,De),se.side=mi):b.renderBufferDirect(fe,J,ae,se,P,De),P.onAfterRender(b,J,fe,ae,se,De)}function Mi(P,J,fe){J.isScene!==!0&&(J=Ae);const ae=st.get(P),se=S.state.lights,De=S.state.shadowsArray,Ge=se.state.version,Xe=Me.getParameters(P,se.state,De,J,fe),et=Me.getProgramCacheKey(Xe);let rt=ae.programs;ae.environment=P.isMeshStandardMaterial?J.environment:null,ae.fog=J.fog,ae.envMap=(P.isMeshStandardMaterial?k:At).get(P.envMap||ae.environment),ae.envMapRotation=ae.environment!==null&&P.envMap===null?J.environmentRotation:P.envMapRotation,rt===void 0&&(P.addEventListener("dispose",Ne),rt=new Map,ae.programs=rt);let He=rt.get(et);if(He!==void 0){if(ae.currentProgram===He&&ae.lightsStateVersion===Ge)return ss(P,Xe),He}else Xe.uniforms=Me.getUniforms(P),P.onBuild(fe,Xe,b),P.onBeforeCompile(Xe,b),He=Me.acquireProgram(Xe,et),rt.set(et,He),ae.uniforms=Xe.uniforms;const ct=ae.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(ct.clippingPlanes=Pe.uniform),ss(P,Xe),ae.needsLights=sc(P),ae.lightsStateVersion=Ge,ae.needsLights&&(ct.ambientLightColor.value=se.state.ambient,ct.lightProbe.value=se.state.probe,ct.directionalLights.value=se.state.directional,ct.directionalLightShadows.value=se.state.directionalShadow,ct.spotLights.value=se.state.spot,ct.spotLightShadows.value=se.state.spotShadow,ct.rectAreaLights.value=se.state.rectArea,ct.ltc_1.value=se.state.rectAreaLTC1,ct.ltc_2.value=se.state.rectAreaLTC2,ct.pointLights.value=se.state.point,ct.pointLightShadows.value=se.state.pointShadow,ct.hemisphereLights.value=se.state.hemi,ct.directionalShadowMap.value=se.state.directionalShadowMap,ct.directionalShadowMatrix.value=se.state.directionalShadowMatrix,ct.spotShadowMap.value=se.state.spotShadowMap,ct.spotLightMatrix.value=se.state.spotLightMatrix,ct.spotLightMap.value=se.state.spotLightMap,ct.pointShadowMap.value=se.state.pointShadowMap,ct.pointShadowMatrix.value=se.state.pointShadowMatrix),ae.currentProgram=He,ae.uniformsList=null,He}function Ar(P){if(P.uniformsList===null){const J=P.currentProgram.getUniforms();P.uniformsList=Ol.seqWithValue(J.seq,P.uniforms)}return P.uniformsList}function ss(P,J){const fe=st.get(P);fe.outputColorSpace=J.outputColorSpace,fe.batching=J.batching,fe.instancing=J.instancing,fe.instancingColor=J.instancingColor,fe.instancingMorph=J.instancingMorph,fe.skinning=J.skinning,fe.morphTargets=J.morphTargets,fe.morphNormals=J.morphNormals,fe.morphColors=J.morphColors,fe.morphTargetsCount=J.morphTargetsCount,fe.numClippingPlanes=J.numClippingPlanes,fe.numIntersection=J.numClipIntersection,fe.vertexAlphas=J.vertexAlphas,fe.vertexTangents=J.vertexTangents,fe.toneMapping=J.toneMapping}function ic(P,J,fe,ae,se){J.isScene!==!0&&(J=Ae),lt.resetTextureUnits();const De=J.fog,Ge=ae.isMeshStandardMaterial?J.environment:null,Xe=L===null?b.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Tr,et=(ae.isMeshStandardMaterial?k:At).get(ae.envMap||Ge),rt=ae.vertexColors===!0&&!!fe.attributes.color&&fe.attributes.color.itemSize===4,He=!!fe.attributes.tangent&&(!!ae.normalMap||ae.anisotropy>0),ct=!!fe.morphAttributes.position,Dt=!!fe.morphAttributes.normal,Gt=!!fe.morphAttributes.color;let Jt=yr;ae.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Jt=b.toneMapping);const Zn=fe.morphAttributes.position||fe.morphAttributes.normal||fe.morphAttributes.color,gt=Zn!==void 0?Zn.length:0,tt=st.get(ae),ln=S.state.lights;if(te===!0&&(he===!0||P!==N)){const sn=P===N&&ae.id===q;Pe.setState(ae,P,sn)}let Ct=!1;ae.version===tt.__version?(tt.needsLights&&tt.lightsStateVersion!==ln.state.version||tt.outputColorSpace!==Xe||se.isBatchedMesh&&tt.batching===!1||!se.isBatchedMesh&&tt.batching===!0||se.isInstancedMesh&&tt.instancing===!1||!se.isInstancedMesh&&tt.instancing===!0||se.isSkinnedMesh&&tt.skinning===!1||!se.isSkinnedMesh&&tt.skinning===!0||se.isInstancedMesh&&tt.instancingColor===!0&&se.instanceColor===null||se.isInstancedMesh&&tt.instancingColor===!1&&se.instanceColor!==null||se.isInstancedMesh&&tt.instancingMorph===!0&&se.morphTexture===null||se.isInstancedMesh&&tt.instancingMorph===!1&&se.morphTexture!==null||tt.envMap!==et||ae.fog===!0&&tt.fog!==De||tt.numClippingPlanes!==void 0&&(tt.numClippingPlanes!==Pe.numPlanes||tt.numIntersection!==Pe.numIntersection)||tt.vertexAlphas!==rt||tt.vertexTangents!==He||tt.morphTargets!==ct||tt.morphNormals!==Dt||tt.morphColors!==Gt||tt.toneMapping!==Jt||tt.morphTargetsCount!==gt)&&(Ct=!0):(Ct=!0,tt.__version=ae.version);let Wt=tt.currentProgram;Ct===!0&&(Wt=Mi(ae,J,se));let oo=!1,Cr=!1,la=!1;const kt=Wt.getUniforms(),Ln=tt.uniforms;if(Ke.useProgram(Wt.program)&&(oo=!0,Cr=!0,la=!0),ae.id!==q&&(q=ae.id,Cr=!0),oo||N!==P){kt.setValue(K,"projectionMatrix",P.projectionMatrix),kt.setValue(K,"viewMatrix",P.matrixWorldInverse);const sn=kt.map.cameraPosition;sn!==void 0&&sn.setValue(K,_e.setFromMatrixPosition(P.matrixWorld)),ht.logarithmicDepthBuffer&&kt.setValue(K,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(ae.isMeshPhongMaterial||ae.isMeshToonMaterial||ae.isMeshLambertMaterial||ae.isMeshBasicMaterial||ae.isMeshStandardMaterial||ae.isShaderMaterial)&&kt.setValue(K,"isOrthographic",P.isOrthographicCamera===!0),N!==P&&(N=P,Cr=!0,la=!0)}if(se.isSkinnedMesh){kt.setOptional(K,se,"bindMatrix"),kt.setOptional(K,se,"bindMatrixInverse");const sn=se.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),kt.setValue(K,"boneTexture",sn.boneTexture,lt))}se.isBatchedMesh&&(kt.setOptional(K,se,"batchingTexture"),kt.setValue(K,"batchingTexture",se._matricesTexture,lt));const Ei=fe.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&We.update(se,fe,Wt),(Cr||tt.receiveShadow!==se.receiveShadow)&&(tt.receiveShadow=se.receiveShadow,kt.setValue(K,"receiveShadow",se.receiveShadow)),ae.isMeshGouraudMaterial&&ae.envMap!==null&&(Ln.envMap.value=et,Ln.flipEnvMap.value=et.isCubeTexture&&et.isRenderTargetTexture===!1?-1:1),ae.isMeshStandardMaterial&&ae.envMap===null&&J.environment!==null&&(Ln.envMapIntensity.value=J.environmentIntensity),Cr&&(kt.setValue(K,"toneMappingExposure",b.toneMappingExposure),tt.needsLights&&rc(Ln,la),De&&ae.fog===!0&&Ee.refreshFogUniforms(Ln,De),Ee.refreshMaterialUniforms(Ln,ae,Y,G,S.state.transmissionRenderTarget[P.id]),Ol.upload(K,Ar(tt),Ln,lt)),ae.isShaderMaterial&&ae.uniformsNeedUpdate===!0&&(Ol.upload(K,Ar(tt),Ln,lt),ae.uniformsNeedUpdate=!1),ae.isSpriteMaterial&&kt.setValue(K,"center",se.center),kt.setValue(K,"modelViewMatrix",se.modelViewMatrix),kt.setValue(K,"normalMatrix",se.normalMatrix),kt.setValue(K,"modelMatrix",se.matrixWorld),ae.isShaderMaterial||ae.isRawShaderMaterial){const sn=ae.uniformsGroups;for(let ca=0,ac=sn.length;ca<ac;ca++){const as=sn[ca];be.update(as,Wt),be.bind(as,Wt)}}return Wt}function rc(P,J){P.ambientLightColor.needsUpdate=J,P.lightProbe.needsUpdate=J,P.directionalLights.needsUpdate=J,P.directionalLightShadows.needsUpdate=J,P.pointLights.needsUpdate=J,P.pointLightShadows.needsUpdate=J,P.spotLights.needsUpdate=J,P.spotLightShadows.needsUpdate=J,P.rectAreaLights.needsUpdate=J,P.hemisphereLights.needsUpdate=J}function sc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(P,J,fe){st.get(P.texture).__webglTexture=J,st.get(P.depthTexture).__webglTexture=fe;const ae=st.get(P);ae.__hasExternalTextures=!0,ae.__autoAllocateDepthBuffer=fe===void 0,ae.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ae.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,J){const fe=st.get(P);fe.__webglFramebuffer=J,fe.__useDefaultFramebuffer=J===void 0},this.setRenderTarget=function(P,J=0,fe=0){L=P,$=J,U=fe;let ae=!0,se=null,De=!1,Ge=!1;if(P){const et=st.get(P);et.__useDefaultFramebuffer!==void 0?(Ke.bindFramebuffer(K.FRAMEBUFFER,null),ae=!1):et.__webglFramebuffer===void 0?lt.setupRenderTarget(P):et.__hasExternalTextures&&lt.rebindTextures(P,st.get(P.texture).__webglTexture,st.get(P.depthTexture).__webglTexture);const rt=P.texture;(rt.isData3DTexture||rt.isDataArrayTexture||rt.isCompressedArrayTexture)&&(Ge=!0);const He=st.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(He[J])?se=He[J][fe]:se=He[J],De=!0):P.samples>0&&lt.useMultisampledRTT(P)===!1?se=st.get(P).__webglMultisampledFramebuffer:Array.isArray(He)?se=He[fe]:se=He,C.copy(P.viewport),j.copy(P.scissor),X=P.scissorTest}else C.copy(ee).multiplyScalar(Y).floor(),j.copy(O).multiplyScalar(Y).floor(),X=ce;if(Ke.bindFramebuffer(K.FRAMEBUFFER,se)&&ae&&Ke.drawBuffers(P,se),Ke.viewport(C),Ke.scissor(j),Ke.setScissorTest(X),De){const et=st.get(P.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+J,et.__webglTexture,fe)}else if(Ge){const et=st.get(P.texture),rt=J||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,et.__webglTexture,fe||0,rt)}q=-1},this.readRenderTargetPixels=function(P,J,fe,ae,se,De,Ge){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Xe=st.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ge!==void 0&&(Xe=Xe[Ge]),Xe){Ke.bindFramebuffer(K.FRAMEBUFFER,Xe);try{const et=P.texture,rt=et.format,He=et.type;if(!ht.textureFormatReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ht.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=P.width-ae&&fe>=0&&fe<=P.height-se&&K.readPixels(J,fe,ae,se,Z.convert(rt),Z.convert(He),De)}finally{const et=L!==null?st.get(L).__webglFramebuffer:null;Ke.bindFramebuffer(K.FRAMEBUFFER,et)}}},this.copyFramebufferToTexture=function(P,J,fe=0){const ae=Math.pow(2,-fe),se=Math.floor(J.image.width*ae),De=Math.floor(J.image.height*ae);lt.setTexture2D(J,0),K.copyTexSubImage2D(K.TEXTURE_2D,fe,0,0,P.x,P.y,se,De),Ke.unbindTexture()},this.copyTextureToTexture=function(P,J,fe,ae=0){const se=J.image.width,De=J.image.height,Ge=Z.convert(fe.format),Xe=Z.convert(fe.type);lt.setTexture2D(fe,0),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,fe.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,fe.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,fe.unpackAlignment),J.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,ae,P.x,P.y,se,De,Ge,Xe,J.image.data):J.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,ae,P.x,P.y,J.mipmaps[0].width,J.mipmaps[0].height,Ge,J.mipmaps[0].data):K.texSubImage2D(K.TEXTURE_2D,ae,P.x,P.y,Ge,Xe,J.image),ae===0&&fe.generateMipmaps&&K.generateMipmap(K.TEXTURE_2D),Ke.unbindTexture()},this.copyTextureToTexture3D=function(P,J,fe,ae,se=0){const De=P.max.x-P.min.x,Ge=P.max.y-P.min.y,Xe=P.max.z-P.min.z,et=Z.convert(ae.format),rt=Z.convert(ae.type);let He;if(ae.isData3DTexture)lt.setTexture3D(ae,0),He=K.TEXTURE_3D;else if(ae.isDataArrayTexture||ae.isCompressedArrayTexture)lt.setTexture2DArray(ae,0),He=K.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,ae.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ae.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,ae.unpackAlignment);const ct=K.getParameter(K.UNPACK_ROW_LENGTH),Dt=K.getParameter(K.UNPACK_IMAGE_HEIGHT),Gt=K.getParameter(K.UNPACK_SKIP_PIXELS),Jt=K.getParameter(K.UNPACK_SKIP_ROWS),Zn=K.getParameter(K.UNPACK_SKIP_IMAGES),gt=fe.isCompressedTexture?fe.mipmaps[se]:fe.image;K.pixelStorei(K.UNPACK_ROW_LENGTH,gt.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,gt.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,P.min.x),K.pixelStorei(K.UNPACK_SKIP_ROWS,P.min.y),K.pixelStorei(K.UNPACK_SKIP_IMAGES,P.min.z),fe.isDataTexture||fe.isData3DTexture?K.texSubImage3D(He,se,J.x,J.y,J.z,De,Ge,Xe,et,rt,gt.data):ae.isCompressedArrayTexture?K.compressedTexSubImage3D(He,se,J.x,J.y,J.z,De,Ge,Xe,et,gt.data):K.texSubImage3D(He,se,J.x,J.y,J.z,De,Ge,Xe,et,rt,gt),K.pixelStorei(K.UNPACK_ROW_LENGTH,ct),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Dt),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Gt),K.pixelStorei(K.UNPACK_SKIP_ROWS,Jt),K.pixelStorei(K.UNPACK_SKIP_IMAGES,Zn),se===0&&ae.generateMipmaps&&K.generateMipmap(He),Ke.unbindTexture()},this.initTexture=function(P){P.isCubeTexture?lt.setTextureCube(P,0):P.isData3DTexture?lt.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?lt.setTexture2DArray(P,0):lt.setTexture2D(P,0),Ke.unbindTexture()},this.resetState=function(){$=0,U=0,L=null,Ke.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Yd?"display-p3":"srgb",t.unpackColorSpace=Tt.workingColorSpace===ec?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class p1 extends gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class m1 extends so{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jg,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const gg={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class g1{constructor(e,t,s){const o=this;let l=!1,u=0,f=0,m;const p=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=s,this.itemStart=function(g){f++,l===!1&&o.onStart!==void 0&&o.onStart(g,u,f),l=!0},this.itemEnd=function(g){u++,o.onProgress!==void 0&&o.onProgress(g,u,f),u===f&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(g){o.onError!==void 0&&o.onError(g)},this.resolveURL=function(g){return m?m(g):g},this.setURLModifier=function(g){return m=g,this},this.addHandler=function(g,x){return p.push(g,x),this},this.removeHandler=function(g){const x=p.indexOf(g);return x!==-1&&p.splice(x,2),this},this.getHandler=function(g){for(let x=0,_=p.length;x<_;x+=2){const M=p[x],w=p[x+1];if(M.global&&(M.lastIndex=0),M.test(g))return w}return null}}}const v1=new g1;class Qd{constructor(e){this.manager=e!==void 0?e:v1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const s=this;return new Promise(function(o,l){s.load(e,o,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Qd.DEFAULT_MATERIAL_NAME="__DEFAULT";const Oi={};class _1 extends Error{constructor(e,t){super(e),this.response=t}}class x1 extends Qd{constructor(e){super(e)}load(e,t,s,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=gg.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0),l;if(Oi[e]!==void 0){Oi[e].push({onLoad:t,onProgress:s,onError:o});return}Oi[e]=[],Oi[e].push({onLoad:t,onProgress:s,onError:o});const u=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),f=this.mimeType,m=this.responseType;fetch(u).then(p=>{if(p.status===200||p.status===0){if(p.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||p.body===void 0||p.body.getReader===void 0)return p;const g=Oi[e],x=p.body.getReader(),_=p.headers.get("X-File-Size")||p.headers.get("Content-Length"),M=_?parseInt(_):0,w=M!==0;let E=0;const S=new ReadableStream({start(y){A();function A(){x.read().then(({done:b,value:D})=>{if(b)y.close();else{E+=D.byteLength;const $=new ProgressEvent("progress",{lengthComputable:w,loaded:E,total:M});for(let U=0,L=g.length;U<L;U++){const q=g[U];q.onProgress&&q.onProgress($)}y.enqueue(D),A()}})}}});return new Response(S)}else throw new _1(`fetch for "${p.url}" responded with ${p.status}: ${p.statusText}`,p)}).then(p=>{switch(m){case"arraybuffer":return p.arrayBuffer();case"blob":return p.blob();case"document":return p.text().then(g=>new DOMParser().parseFromString(g,f));case"json":return p.json();default:if(f===void 0)return p.text();{const x=/charset="?([^;"\s]*)"?/i.exec(f),_=x&&x[1]?x[1].toLowerCase():void 0,M=new TextDecoder(_);return p.arrayBuffer().then(w=>M.decode(w))}}}).then(p=>{gg.add(e,p);const g=Oi[e];delete Oi[e];for(let x=0,_=g.length;x<_;x++){const M=g[x];M.onLoad&&M.onLoad(p)}}).catch(p=>{const g=Oi[e];if(g===void 0)throw this.manager.itemError(e),p;delete Oi[e];for(let x=0,_=g.length;x<_;x++){const M=g[x];M.onError&&M.onError(p)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class xv extends gn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Mt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const wd=new Bt,vg=new le,_g=new le;class y1{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.map=null,this.mapPass=null,this.matrix=new Bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zd,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,s=this.matrix;vg.setFromMatrixPosition(e.matrixWorld),t.position.copy(vg),_g.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_g),t.updateMatrixWorld(),wd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wd),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(wd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class S1 extends y1{constructor(){super(new fv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class M1 extends xv{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.target=new gn,this.shadow=new S1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class E1 extends xv{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qd);class w1 extends Qd{constructor(e){super(e)}load(e,t,s,o){const l=this,u=new x1(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(this.withCredentials),u.load(e,function(f){try{t(l.parse(f))}catch(m){o?o(m):console.error(m),l.manager.itemError(e)}},s,o)}parse(e){function t(p){const g=new DataView(p),x=32/8*3+32/8*3*3+16/8,_=g.getUint32(80,!0);if(80+32/8+_*x===g.byteLength)return!0;const w=[115,111,108,105,100];for(let E=0;E<5;E++)if(s(w,g,E))return!1;return!0}function s(p,g,x){for(let _=0,M=p.length;_<M;_++)if(p[_]!==g.getUint8(x+_))return!1;return!0}function o(p){const g=new DataView(p),x=g.getUint32(80,!0);let _,M,w,E=!1,S,y,A,b,D;for(let j=0;j<70;j++)g.getUint32(j,!1)==1129270351&&g.getUint8(j+4)==82&&g.getUint8(j+5)==61&&(E=!0,S=new Float32Array(x*3*3),y=g.getUint8(j+6)/255,A=g.getUint8(j+7)/255,b=g.getUint8(j+8)/255,D=g.getUint8(j+9)/255);const $=84,U=50,L=new Hi,q=new Float32Array(x*3*3),N=new Float32Array(x*3*3),C=new Mt;for(let j=0;j<x;j++){const X=$+j*U,z=g.getFloat32(X,!0),ne=g.getFloat32(X+4,!0),ue=g.getFloat32(X+8,!0);if(E){const G=g.getUint16(X+48,!0);(G&32768)===0?(_=(G&31)/31,M=(G>>5&31)/31,w=(G>>10&31)/31):(_=y,M=A,w=b)}for(let G=1;G<=3;G++){const Y=X+G*12,F=j*3*3+(G-1)*3;q[F]=g.getFloat32(Y,!0),q[F+1]=g.getFloat32(Y+4,!0),q[F+2]=g.getFloat32(Y+8,!0),N[F]=z,N[F+1]=ne,N[F+2]=ue,E&&(C.set(_,M,w).convertSRGBToLinear(),S[F]=C.r,S[F+1]=C.g,S[F+2]=C.b)}}return L.setAttribute("position",new Bn(q,3)),L.setAttribute("normal",new Bn(N,3)),E&&(L.setAttribute("color",new Bn(S,3)),L.hasColors=!0,L.alpha=D),L}function l(p){const g=new Hi,x=/solid([\s\S]*?)endsolid/g,_=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let w=0;const E=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,S=new RegExp("vertex"+E+E+E,"g"),y=new RegExp("normal"+E+E+E,"g"),A=[],b=[],D=[],$=new le;let U,L=0,q=0,N=0;for(;(U=x.exec(p))!==null;){q=N;const C=U[0],j=(U=M.exec(C))!==null?U[1]:"";for(D.push(j);(U=_.exec(C))!==null;){let ne=0,ue=0;const G=U[0];for(;(U=y.exec(G))!==null;)$.x=parseFloat(U[1]),$.y=parseFloat(U[2]),$.z=parseFloat(U[3]),ue++;for(;(U=S.exec(G))!==null;)A.push(parseFloat(U[1]),parseFloat(U[2]),parseFloat(U[3])),b.push($.x,$.y,$.z),ne++,N++;ue!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+w),ne!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+w),w++}const X=q,z=N-q;g.userData.groupNames=D,g.addGroup(X,z,L),L++}return g.setAttribute("position",new Bi(A,3)),g.setAttribute("normal",new Bi(b,3)),g}function u(p){return typeof p!="string"?new TextDecoder().decode(p):p}function f(p){if(typeof p=="string"){const g=new Uint8Array(p.length);for(let x=0;x<p.length;x++)g[x]=p.charCodeAt(x)&255;return g.buffer||g}else return p}const m=f(e);return t(m)?o(m):l(u(e))}}function T1({src:r}){const e=Se.useRef(null);return Se.useEffect(()=>{const t=e.current;if(!t||!r)return;let s=!1;const o=document.createElement("canvas");o.style.display="block",o.style.width="100%",o.style.height="100%",t.replaceChildren(o);const l=new h1({canvas:o,antialias:!0,alpha:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2));const u=new p1,f=new qn(45,1,.01,100);f.position.set(0,0,2.2),u.add(new E1(16777215,.85));const m=new M1(16777215,.65);m.position.set(2,3,4),u.add(m);const p=new Za;u.add(p);const g=new m1({color:10135740,metalness:.05,roughness:.72,side:mi}),x=new w1;let _=null,M=0,w=!1,E=0,S=0,y=0;const A=N=>{const C=new aa().setFromObject(N),j=C.getSize(new le),X=C.getCenter(new le),ne=1.5/Math.max(j.x,j.y,j.z,1e-6);N.scale.setScalar(ne),N.position.sub(X.multiplyScalar(ne))},b=()=>{const N=t.clientWidth||1,C=t.clientHeight||1;l.setSize(N,C,!1),f.aspect=N/C,f.updateProjectionMatrix()},D=()=>{s||(w||(S+=.004),p.rotation.y=S,p.rotation.x=y,l.render(u,f),M=requestAnimationFrame(D))},$=N=>{N.button===0&&(w=!0,E=N.clientX,o.setPointerCapture(N.pointerId))},U=N=>{if(!w)return;const C=N.clientX-E;E=N.clientX,S+=C*.012},L=()=>{w=!1};o.addEventListener("pointerdown",$),o.addEventListener("pointermove",U),o.addEventListener("pointerup",L),o.addEventListener("pointercancel",L);const q=new ResizeObserver(()=>b());return q.observe(t),b(),x.loadAsync(r).then(N=>{if(s){N.dispose();return}N.computeVertexNormals(),_=new _i(N,g),p.add(_),A(_),D()}).catch(()=>{s||(t.dataset.error="1")}),()=>{s=!0,cancelAnimationFrame(M),q.disconnect(),o.removeEventListener("pointerdown",$),o.removeEventListener("pointermove",U),o.removeEventListener("pointerup",L),o.removeEventListener("pointercancel",L),_&&(_.geometry.dispose(),g.dispose()),l.dispose(),t.replaceChildren()}},[r]),r?d.jsx("div",{ref:e,className:"stl-preview-host","aria-hidden":!0}):null}function A1({app:r}){const e=r.file||"データなし（予約のみ）",t=r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":null,s=r.file?Ax(r.id):null;return d.jsxs("div",{className:"stl",children:[d.jsx("div",{className:"stl-canvas",children:s?d.jsx(T1,{src:s}):d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"stl-tag",children:r.kind==="request"?"STL":"RESERVE"}),d.jsx("span",{className:"stl-note",children:r.kind==="request"?"サムネイル未生成":"データ提出なし"})]})}),d.jsxs("div",{className:"stl-meta",children:[d.jsx("span",{className:"stl-ext",children:r.file?r.file.split(".").pop().toUpperCase():"—"}),d.jsxs("span",{className:"stl-name",children:[d.jsx("b",{className:"num",children:e}),d.jsx("span",{children:t?`${t} ・ 更新 ${Z0(r.createdAt??"")}`:"予約枠のみの申請"})]}),d.jsxs("span",{className:"stl-actions",children:[d.jsx("a",{className:"mini",href:s??void 0,download:r.file||void 0,style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"DL"}),d.jsx("a",{className:"mini",href:s??void 0,target:"_blank",rel:"noreferrer",style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"開く"})]})]})]})}function C1({app:r,selected:e,onToggle:t,disabled:s}){mn(r);const o=Hd(r);return d.jsx("div",{className:"slotgrid",role:"group","aria-label":"時間帯（30分単位）",children:o.map(l=>{const u=e.indexOf(l)>=0;return d.jsxs("button",{type:"button",disabled:s,className:"slot-chip"+(u?" on":""),onClick:()=>t(l),"aria-pressed":u,children:[d.jsx("span",{className:"num",children:qt(Qa(l))}),d.jsx("span",{className:"slot-dur num",children:"30分"})]},l)})})}function b1({app:r,onPartial:e,onCancelAll:t,onMove:s}){const[o,l]=Se.useState([]),[u,f]=Se.useState(null),[m,p]=Se.useState(null),[g,x]=Se.useState(""),[_,M]=Se.useState("");Se.useEffect(()=>{l([]),f(null),p(null),M(""),x(r.adminNote||"")},[r.id]);const w=Hd(r),E=L=>l(q=>q.indexOf(L)>=0?q.filter(N=>N!==L):q.concat(L).sort((N,C)=>N-C)),S=o.length===w.length,y=()=>l(S?[]:w.slice()),A=r.status==="pending"||r.status==="approved",b=o.length>0&&!S,D=o.length?`${qt(Qa(o[0]))}〜${qt(Qa(o[o.length-1])+Js)}（${o.length}枠・${Kl(o.length*Js)}）`:"",$=()=>{if(!m){M("理由を1つ選んでください");return}const L=jp.find(q=>q.id===m);o.length?e(r,o,"cancelled",{cancelReason:L.id,adminNote:g||L.body,reason:L}):t(r,L,g)},U=()=>{if(!m){M("理由を1つ選んでください");return}const L=Hp.find(q=>q.id===m);o.length?e(r,o,"rejected",{rejectReason:L.id,adminNote:g||L.body,reason:L}):t(r,L,g,"rejected")};return d.jsxs("div",{className:"slotacts",children:[d.jsxs("div",{className:"ftitle",style:{marginBottom:6},children:[d.jsx("span",{children:"時間単位で操作"}),d.jsx("button",{type:"button",className:"linkbtn",onClick:y,children:S?"選択を解除":"すべて選択"})]}),d.jsx(C1,{app:r,selected:o,onToggle:E,disabled:!A}),d.jsx("div",{className:"selbar"+(o.length?" on":""),children:o.length?d.jsxs(d.Fragment,{children:[d.jsx("b",{className:"num",children:D}),d.jsx("span",{children:b?"この枠だけを操作します（残りはそのまま）":"申請全体を操作します"})]}):d.jsx("span",{children:"枠を選ぶと、その時間だけを取り消し・確定できます。未選択なら申請全体が対象です。"})}),A&&d.jsxs("div",{className:"actrow",children:[r.status==="pending"&&d.jsxs("button",{type:"button",className:"btn btn-primary",onClick:()=>o.length?e(r,o,"approved",{}):t(r,null,"","approved"),children:["確定",b?`（${o.length}枠）`:""]}),d.jsx("button",{type:"button",className:"btn btn-secondary move",onClick:()=>s&&s(r),children:"別の日へ変更"}),d.jsx("button",{type:"button",className:"btn btn-danger",onClick:()=>{f(u==="cancel"?null:"cancel"),p(null),M("")},children:"取り消し…"}),r.status==="pending"&&d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>{f(u==="reject"?null:"reject"),p(null),M("")},children:"却下…"})]}),!A&&d.jsx("div",{className:"note tip",children:d.jsxs("span",{children:["この申請は ",d.jsx("b",{children:Qs[r.status]})," です。必要なら「申請中に戻す」で復帰できます。"]})}),A&&u==="cancel"&&d.jsxs("div",{className:"reasonblock",children:[d.jsxs("div",{className:"ftitle",children:["取り消しの理由",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("div",{className:"reasons",children:jp.map(L=>d.jsxs("button",{type:"button",className:"reason"+(m===L.id?" on":""),onClick:()=>{p(L.id),M("")},children:[d.jsx("i",{}),d.jsxs("span",{children:[d.jsx("b",{children:L.label}),d.jsx("span",{children:L.body})]})]},L.id))}),d.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者への連絡（任意）"}),d.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>x(L.target.value),placeholder:"理由に補足があれば書きます"}),_&&d.jsx("div",{className:"note warn",style:{marginTop:6},children:d.jsx("span",{children:_})}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{f(null),M("")},children:"やめる"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:$,children:b?`${o.length}枠を取り消す`:"この申請を取り消す"})]})]}),A&&u==="reject"&&d.jsxs("div",{className:"reasonblock",children:[d.jsxs("div",{className:"ftitle",children:["却下の理由",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("div",{className:"reasons",children:Hp.map(L=>d.jsxs("button",{type:"button",className:"reason"+(m===L.id?" on":""),onClick:()=>{p(L.id),M("")},children:[d.jsx("i",{}),d.jsxs("span",{children:[d.jsx("b",{children:L.label}),d.jsx("span",{children:L.body})]})]},L.id))}),d.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者へのメッセージ（任意）"}),d.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>x(L.target.value),placeholder:"選んだ理由に補足があれば書きます"}),_&&d.jsx("div",{className:"note warn",style:{marginTop:6},children:d.jsx("span",{children:_})}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{f(null),M("")},children:"やめる"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:U,children:b?`${o.length}枠を却下`:"この申請を却下"})]})]}),r.status!=="pending"&&d.jsxs("div",{className:"actrow",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","pending"),children:"申請中に戻す"}),r.status==="approved"&&d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","done"),children:"完了にする"})]}),d.jsxs("div",{className:"memo",children:[d.jsxs("div",{className:"ftitle",style:{justifyContent:"space-between"},children:[d.jsxs("span",{children:["担当者メモ",r.adminNote?"（保存済み）":""]}),d.jsx("button",{type:"button",className:"linkbtn",onClick:()=>f(u==="note"?null:"note"),children:u==="note"?"閉じる":"書く"})]}),r.adminNote&&u!=="note"&&d.jsx("div",{className:"note tip",children:d.jsx("span",{children:r.adminNote})}),u==="note"&&d.jsxs("div",{style:{display:"grid",gap:6},children:[d.jsx("textarea",{className:"textarea",value:g,maxLength:200,onChange:L=>x(L.target.value),placeholder:"印刷条件や受け取りの指示"}),d.jsx("div",{className:"presets",children:Zx.map(L=>d.jsxs("button",{type:"button",className:"preset",onClick:()=>x(L),children:[L.slice(0,12),"…"]},L))}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>f(null),children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{t(r,null,g.trim(),null,"note"),f(null)},children:"メモを保存"})]})]})]})]})}function R1({app:r,onClose:e,onPartial:t,onCancelAll:s,onMove:o,log:l}){if(!r)return null;const u=mn(r),f=to(r.date),m=l.filter(p=>p.appId===r.id).sort((p,g)=>g.at.localeCompare(p.at));return d.jsxs(q0,{open:!!r,title:r.title,onClose:e,sub:d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"num",style:{whiteSpace:"nowrap"},children:bg(r.date)}),d.jsx("span",{children:"·"}),d.jsx("span",{style:{whiteSpace:"nowrap"},children:xi[r.machine].name})]}),footer:d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[d.jsxs("div",{className:"rv-flags",children:[d.jsx(qs,{kind:r.kind}),d.jsx(Rd,{status:r.status}),r0(r)&&d.jsx(Hl,{tone:"warn",children:"当日・締切超過"}),d.jsxs(Hl,{children:["申請 ",H0(r.createdAt)]})]}),d.jsxs("dl",{className:"kv",children:[d.jsxs("div",{children:[d.jsx("dt",{children:"時間"}),d.jsxs("dd",{className:"num",children:[r.kind==="request"?"16:30〜20:00":`${qt(u.start)}〜${qt(u.end)}`,d.jsx("small",{children:r.kind==="request"?"（依頼枠を丸ごと占有）":`（${Kl(u.end-u.start)}）`})]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"機種"}),d.jsxs("dd",{children:[xi[r.machine].name,d.jsxs("small",{children:["／ ",xi[r.machine].maker]})]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"担当"}),d.jsx("dd",{children:f.length?f.map(p=>n0(p)).join(" / "):"休み"})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"申請者"}),d.jsxs("dd",{children:[r.who.name,d.jsxs("small",{children:["（",ji(r.who.hr),"・",r.who.num,"番）"]})]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"種別"}),d.jsxs("dd",{children:[yi[r.kind],d.jsx("small",{children:r.kind==="request"?"STL提出あり":"データ提出なし"})]})]})]}),d.jsxs("div",{children:[d.jsx("div",{className:"ftitle",children:"印刷データ"}),d.jsx(A1,{app:r})]}),r.note&&d.jsxs("div",{children:[d.jsx("div",{className:"ftitle",children:"申請者の備考"}),d.jsx("div",{className:"note tip",children:d.jsx("span",{children:r.note})})]}),d.jsx(b1,{app:r,onPartial:t,onCancelAll:s,onMove:o}),m.length>0&&d.jsxs("div",{children:[d.jsx("div",{className:"ftitle",children:"この申請の履歴"}),m.map(p=>d.jsxs("div",{className:"log-item "+p.type,children:[d.jsx("span",{className:"bd"}),d.jsxs("span",{className:"tx",children:[p.text,d.jsxs("span",{className:"at",children:[d.jsx("span",{className:"who",children:p.actor}),V0(p.at)]})]})]},p.id))]})]})}function N1({apps:r,selected:e,onPick:t,onOpen:s,onApprove:o,onCancel:l,onPartial:u,log:f,onDownload:m,onDownloadAll:p,onMove:g}){const x=Lg(r,e),_=to(e),M=e<li,w=x.live.length;return d.jsxs("div",{className:"rs-grid",children:[d.jsx("div",{className:"rs-main",children:d.jsx(X0,{apps:r,avail:null,selected:e,onPick:t})}),d.jsx("div",{className:"rs-side",children:d.jsxs("div",{className:"card daycard",children:[d.jsxs("div",{className:"daycard-h",children:[d.jsx("span",{className:"dc-date num",children:Ad(e)}),d.jsx("span",{className:"dc-wd",children:wr[zn(e).getDay()]}),e===li&&d.jsx(Hl,{tone:"orange",children:"今日"}),M&&d.jsx(Hl,{children:"過ぎた日"}),d.jsx("span",{className:"dc-staff",children:_.length?_.map(E=>d.jsx(j0,{id:E,small:!0},E)):d.jsx("span",{className:"mtag none",children:"休み"})})]}),d.jsxs("div",{className:"daycard-counts",children:[d.jsxs("span",{className:"dc-c req",children:[d.jsx(qs,{kind:"request",size:"sm"}),d.jsx("b",{className:"num",children:x.requests.length})]}),d.jsxs("span",{className:"dc-c res",children:[d.jsx(qs,{kind:"reserve",size:"sm"}),d.jsx("b",{className:"num",children:x.reserves.length})]}),x.pending>0&&d.jsxs("span",{className:"dc-pend num",children:["申請中 ",x.pending]}),w>0&&d.jsxs("button",{type:"button",className:"btn btn-dl btn-sm dc-dl",onClick:()=>p(e),children:[d.jsx(Gu,{}),"この日の申請を一括DL（",w,"件）"]})]}),d.jsxs("div",{className:"dgroups",children:[["request","reserve"].map(E=>{const S=(E==="request"?x.requests:x.reserves).sort((A,b)=>mn(A).start-mn(b).start||Ja.indexOf(A.machine)-Ja.indexOf(b.machine)),y=S.filter(A=>A.status==="pending").length;return d.jsxs("div",{className:"dgroup",children:[d.jsxs("div",{className:"dg-head "+E,children:[d.jsx(qs,{kind:E}),d.jsxs("span",{className:"num",children:[S.length,"件"]}),y>0&&d.jsxs("span",{className:"dg-pend num",children:["申請中 ",y]})]}),S.length===0?d.jsxs("div",{className:"dg-empty",children:["この日の",yi[E],"はありません。"]}):S.map(A=>{const b=mn(A);return d.jsxs("div",{className:"drow "+A.status,children:[d.jsxs("span",{className:"dr-time num",children:[d.jsx("b",{children:qt(b.start)}),d.jsx("span",{children:qt(b.end)})]}),d.jsxs("span",{className:"dr-main",children:[d.jsx("span",{className:"dr-title",children:A.title}),d.jsxs("span",{className:"dr-sub",children:[d.jsx(Rd,{status:A.status}),d.jsx(k0,{id:A.machine}),xi[A.machine].short,d.jsx("span",{children:"·"}),A.who.name,A.file&&d.jsxs(d.Fragment,{children:[d.jsx("span",{children:"·"}),d.jsx("span",{className:"num",children:A.file})]})]})]}),d.jsxs("span",{className:"dr-acts",children:[A.status==="pending"&&d.jsx("button",{type:"button",className:"mini ok",onClick:()=>o(A),children:"確定"}),(A.status==="pending"||A.status==="approved"||A.status==="done")&&d.jsx("button",{type:"button",className:"mini move",onClick:()=>g(A),children:"変更"}),(A.status==="pending"||A.status==="approved")&&d.jsx("button",{type:"button",className:"mini no",onClick:()=>s(A,"cancel"),children:"取り消し"}),d.jsxs("span",{className:"dr-dl",children:[d.jsxs("button",{type:"button",className:"mini dl",onClick:()=>m(A),title:"この申請のテキストをダウンロード","aria-label":`${A.title} をダウンロード`,children:[d.jsx(Gu,{}),"DL"]}),A.file&&d.jsx("button",{type:"button",className:"mini dl icon-only",onClick:()=>m(A,"file"),title:`${A.file} をダウンロード`,"aria-label":`${A.file} をダウンロード`,children:d.jsx(Gu,{})})]}),d.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(A),"aria-label":"詳細",children:"›"})]})]},A.id)})]},E)}),x.cancelled.length>0&&d.jsxs("details",{className:"dcan",children:[d.jsxs("summary",{className:"num",children:["取り消し・却下 ",x.cancelled.length,"件"]}),x.cancelled.map(E=>{const S=mn(E);return d.jsxs("div",{className:"drow cancelled",children:[d.jsxs("span",{className:"dr-time num",children:[d.jsx("b",{children:qt(S.start)}),d.jsx("span",{children:qt(S.end)})]}),d.jsxs("span",{className:"dr-main",children:[d.jsx("span",{className:"dr-title",children:E.title}),d.jsxs("span",{className:"dr-sub",children:[d.jsx(Rd,{status:E.status}),d.jsx("span",{children:E.who.name}),d.jsx("span",{children:"·"}),d.jsx("span",{children:E.adminNote||"理由なし"})]})]}),d.jsxs("span",{className:"dr-acts",children:[d.jsx("button",{type:"button",className:"mini",onClick:()=>l(E,null,"","pending"),children:"戻す"}),d.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(E),children:"›"})]})]},E.id)})]})]})]})})]})}function P1({year:r,month:e,app:t,apps:s,onChangeMonth:o,onJumpToday:l}){const{run:u,enterClass:f}=Xd(),m=`${r}-${yn(e)}`,p=o0(r,e);return d.jsxs("div",{className:"mm",children:[d.jsxs("div",{className:"mm-h",children:[d.jsx("button",{type:"button",onClick:()=>u(-1,()=>o(-1)),"aria-label":"前の月",children:"‹"}),d.jsx("div",{className:f,children:d.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]})},`label-${m}`),d.jsx("button",{type:"button",onClick:()=>u(1,()=>o(1)),"aria-label":"次の月",children:"›"}),d.jsx("button",{type:"button",className:"mini",onClick:l,children:"今月"})]}),d.jsx("div",{className:"cal-period-shell",children:d.jsxs("div",{className:f,children:[d.jsx("div",{className:"mm-wds",children:wr.map((g,x)=>d.jsx("span",{className:"mm-wd"+(x===0?" sun":x===6?" sat":""),children:g},g))}),d.jsx("div",{className:"mm-grid",children:p.map((g,x)=>{if(!g)return d.jsx("span",{className:"mm-cell pad"},"p"+x);const _=Yn(g),M=Dg(s,t,_),w=M.sameDay?"current":M.past?"past":M.full?"full":M.noStaff?"nostaff":"ok";return d.jsxs("button",{type:"button","data-date":_,className:"mm-cell "+w,onClick:()=>!M.past&&!M.sameDay&&o(0,_),"aria-label":`${g.getMonth()+1}月${g.getDate()}日 ${M.full?"埋まり":M.noStaff?"担当なし":"空き"}`,children:[d.jsx("span",{className:"num mm-d",children:g.getDate()}),d.jsx("span",{className:"mm-meta",children:M.sameDay?"現在":M.past?"—":M.noStaff?"担当なし":M.full?"満枠":`空き ${M.free}枠`}),M.liveCount>0&&!M.past&&d.jsx("span",{className:"mm-count num",children:M.liveCount})]},_)})})]},m)})]})}function L1({open:r,app:e,apps:t,onClose:s,onMove:o}){const[l,u]=Se.useState(()=>{const y=e?zn(e.date):new Date;return{y:y.getFullYear(),m:y.getMonth()+1}}),[f,m]=Se.useState(null),[p,g]=Se.useState(!1);if(Se.useEffect(()=>{if(!e)return;const y=zn(e.date);u({y:y.getFullYear(),m:y.getMonth()+1}),m(null),g(!1)},[e&&e.id,r]),!r||!e)return null;const x=(y,A)=>{if(A){m(A);return}if(y===0){const b=new Date;u({y:b.getFullYear(),m:b.getMonth()+1});return}u(b=>{let D=b.y,$=b.m+y;return $<1&&($=12,D-=1),$>12&&($=1,D+=1),{y:D,m:$}})},_=f?Dg(t,e,f):null,w=!!(_&&(_.full||_.noStaff)),E=mn(e),S=()=>{o(e,f,{forced:w&&p,info:_}),m(null),g(!1)};return d.jsx(Y0,{open:r,wide:!0,title:"別の日へ変更",sub:d.jsxs(d.Fragment,{children:[d.jsx("span",{children:e.title}),d.jsx("span",{children:"·"}),d.jsx("span",{className:"num",children:bg(e.date)}),d.jsx("span",{children:"·"}),d.jsx("span",{children:yi[e.kind]})]}),onClose:s,footer:d.jsxs(d.Fragment,{children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:s,children:"閉じる"}),d.jsx("button",{type:"button",className:"btn btn-primary",disabled:!f||w&&!p,onClick:S,children:f?`${Ad(f)} に変更`:"日付を選択"})]}),children:d.jsxs("div",{className:"mv-body",children:[d.jsxs("div",{className:"mv-note",children:[d.jsxs("b",{children:[qt(E.start),"〜",qt(E.end)]}),d.jsx("span",{className:"mv-sep",children:"|"}),d.jsxs("span",{children:[xi[e.machine].name," ・ ",e.status==="approved"?"確定済みでも変更できます":"時間帯はそのまま移動します"]})]}),d.jsx(P1,{year:l.y,month:l.m,app:e,apps:t,onChangeMonth:x,onJumpToday:()=>x(0)}),d.jsxs("div",{className:"mv-legend",children:[d.jsx("span",{className:"mv-lg ok",children:"空き"}),d.jsx("span",{className:"mv-lg nostaff",children:"担当なし"}),d.jsx("span",{className:"mv-lg full",children:"満枠"}),d.jsx("span",{className:"mv-lg past",children:"過ぎた日"})]}),f&&_&&d.jsxs("div",{className:"mv-picked "+(_.full?"full":_.noStaff?"nostaff":"ok"),children:[d.jsxs("div",{className:"mvp-h",children:[d.jsxs("b",{className:"num",children:[Ad(_.date),"（",wr[zn(_.date).getDay()],"）"]}),d.jsx("span",{className:"mvp-state",children:_.noStaff?"担当者がいません":_.full?"満枠です":`空き ${_.free}/${_.total}枠`})]}),d.jsxs("div",{className:"mvp-meta",children:[d.jsxs("span",{children:["担当：",_.staffs.length?_.staffs.map(y=>jd(y)).join(" / "):"なし"]}),d.jsxs("span",{children:["この日の申請：",d.jsxs("span",{className:"num",children:[_.liveCount,"件"]})]})]}),w&&d.jsxs("label",{className:"mv-force",children:[d.jsx("input",{type:"checkbox",checked:p,onChange:y=>g(y.target.checked)}),d.jsxs("span",{children:[d.jsx("b",{children:_.noStaff?"担当者がいない日にも変更する":"満枠でも強制的に変更する"}),d.jsx("span",{className:"fl-h",children:_.noStaff?"担当者のいない日は本来受け付けていません。必要な場合だけ強制します。":"同じ時間帯の申請と重なります。両方を残したまま、この申請を確定・申請中にします。"})]})]})]})]})})}function D1({year:r,month:e,avail:t,memberId:s,onPaint:o,onChangeMonth:l}){const{run:u,enterClass:f}=Xd(),m=`${r}-${yn(e)}`,g=new Date(r,e-1,1).getDay(),x=new Date(r,e,0).getDate(),_=[];for(let j=0;j<g;j++)_.push(null);for(let j=1;j<=x;j++)_.push(new Date(r,e-1,j));const M=Se.useRef(null),w=Se.useRef(null),[E,S]=Se.useState(null),y=j=>_.filter(Boolean).filter(X=>X.getDay()===j).map(Yn),A=j=>j>=li,b=(j,X)=>{if(!s||!A(j)||X.pointerType==="mouse"&&X.button!==0)return;X.preventDefault();const z=!Ya(s,j);w.current={mode:z,touched:[j]},S({dates:new Set([j]),on:z})},D=(j,X)=>{const z=document.elementFromPoint(j,X),ne=z&&z.closest?z.closest(".scal-cell[data-date]"):null;return ne?ne.getAttribute("data-date"):null};Se.useEffect(()=>{const j=z=>{const ne=w.current;if(!ne)return;z.preventDefault();const ue=D(z.clientX,z.clientY);!ue||!A(ue)||ne.touched.indexOf(ue)>=0||(ne.touched.push(ue),S(G=>{const Y=new Set(G?G.dates:[]);return Y.add(ue),{dates:Y,on:ne.mode}}))},X=()=>{const z=w.current;if(!z)return;w.current=null;const ne=z.touched.filter(A).slice();S(null),ne.length&&o(ne,z.mode)};return window.addEventListener("pointermove",j,{passive:!1}),window.addEventListener("pointerup",X),window.addEventListener("pointercancel",X),()=>{window.removeEventListener("pointermove",j),window.removeEventListener("pointerup",X),window.removeEventListener("pointercancel",X)}},[o,s]);const $=j=>E&&E.dates.has(j)?E.on:null,U=j=>{const X=$(j);return X!==null?X:s?Ya(s,j):!1},L=j=>e0().filter(X=>(t[X.id]||[]).indexOf(j)>=0).map(X=>X.id),q=(Qr(s)||{}).color||"var(--color-primary)",N=j=>{if(!s)return;const X=y(j).filter(A);if(!X.length)return;const z=X.every(ne=>Ya(s,ne));o(X,!z)},C=j=>{const X=y(j).filter(A);if(!s||!X.length)return"idle";const z=X.filter(ne=>Ya(s,ne)).length;return z===0?"idle":z===X.length?"all":"some"};return d.jsxs("div",{className:"scal",ref:M,children:[d.jsxs("div",{className:"scal-h",children:[d.jsx("div",{className:f,children:d.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]})},`label-${m}`),d.jsx("button",{type:"button",className:"mini",onClick:()=>l(0),children:"今月"})]}),d.jsxs("div",{className:"scal-body",children:[d.jsxs("button",{type:"button",className:"scal-side prev",onClick:()=>u(-1,()=>l(-1)),"aria-label":"前の月",children:[d.jsx("span",{"aria-hidden":"true",children:"‹"}),d.jsx("span",{className:"scal-side-lbl",children:"前へ"})]}),d.jsx("div",{className:"scal-main",children:d.jsx("div",{className:"cal-period-shell",children:d.jsxs("div",{className:f,children:[d.jsx("div",{className:"scal-wds",children:wr.map((j,X)=>{const z=C(X);return d.jsx("button",{type:"button","data-wd":X,className:"scal-wd"+(X===0?" sun":X===6?" sat":"")+(z==="all"?" all":z==="some"?" some":""),onClick:()=>N(X),title:`${j}曜日をこの月すべて${z==="all"?"削除":"追加"}`,"aria-label":`${j}曜日をこの月すべて${z==="all"?"削除":"追加"}`,children:j},j)})}),d.jsx("div",{className:"scal-grid"+(E?" painting":""),children:Array.from({length:Math.ceil(_.length/7)*7}).map((j,X)=>{const z=_[X];if(!z)return d.jsx("span",{className:"scal-cell pad"},"p"+X);const ne=Yn(z),ue=U(ne),G=$(ne),Y=z.getDay(),F=!A(ne),re=L(ne),ee=s?re.indexOf(s)>=0:!1;return d.jsx("button",{type:"button","data-date":ne,className:"scal-cell"+(ue?" on":"")+(Y===0?" sun":Y===6?" sat":"")+(ne===li?" today":"")+(F?" past":"")+(G===!0?" pv-on":G===!1?" pv-off":"")+(ee?" mine":""),style:ee||G===!0&&s?{background:q+"1f",borderColor:q}:void 0,onPointerDown:O=>b(ne,O),"aria-pressed":ue,"aria-label":`${z.getMonth()+1}月${z.getDate()}日 ${re.length?re.map(jd).join("・"):"担当なし"}`,children:d.jsx("span",{className:"scal-dots",children:re.slice(0,4).map(O=>d.jsx("span",{className:"scal-dot",style:{background:t0(O)}},O))})},ne)})})]},m)})}),d.jsxs("button",{type:"button",className:"scal-side next",onClick:()=>u(1,()=>l(1)),"aria-label":"次の月",children:[d.jsx("span",{"aria-hidden":"true",children:"›"}),d.jsx("span",{className:"scal-side-lbl",children:"次へ"})]})]}),!s&&d.jsx("div",{className:"scal-foot",children:d.jsx("span",{className:"scal-warn",children:"先に担当者を選んでください。"})})]})}function U1({members:r,onAdd:e,onUpdate:t,onRemove:s}){const[o,l]=Se.useState(null),[u,f]=Se.useState({name:"",hr:"101",num:"",discord:"",color:Kr[0],hubUserId:null}),[m,p]=Se.useState(""),[g,x]=Se.useState([]),[_,M]=Se.useState(!1);Se.useEffect(()=>{!o||o==="new"||(M(!0),_x().then(x).catch(()=>x([])).finally(()=>M(!1)))},[o]);const w=A=>{l(A.id),f({name:A.name,hr:A.hr,num:String(A.num),discord:A.discord||"",color:A.color,hubUserId:A.userId??null}),p("")},E=()=>{l("new"),f({name:"",hr:"101",num:"",discord:"",color:Kr[r.length%Kr.length],hubUserId:null}),p("")},S=()=>{if(!u.name.trim())return"名前を入力してください";if(!Wp.includes(u.hr))return"HRは 101〜309 から選んでください";const A=Number(u.num);return!A||A<1||A>40?"番号は 1〜40 で入力してください":u.discord&&!/^\d{15,25}$/.test(u.discord.trim())?"Discord のユーザーIDは数字15〜25桁です":""},y=()=>{const A=S();if(A){p(A);return}const b={name:u.name.trim(),hr:u.hr,num:Number(u.num),discord:u.discord.trim(),color:u.color,hubUserId:u.hubUserId};o==="new"?e(b):t(o,b),l(null),p("")};return d.jsxs("div",{className:"mform",children:[d.jsxs("div",{className:"mform-h",children:[d.jsx("b",{children:"印刷担当者"}),d.jsxs("span",{className:"num",children:[r.length,"人"]}),o!=="new"&&d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:E,children:"担当者を追加"})]}),d.jsxs("div",{className:"mtable",children:[d.jsxs("div",{className:"mtr mtr-h",children:[d.jsx("span",{}),d.jsx("span",{children:"名前"}),d.jsx("span",{children:"HR"}),d.jsx("span",{children:"番号"}),d.jsx("span",{children:"Discord ID"}),d.jsx("span",{children:"ScienceHUB"}),d.jsx("span",{})]}),r.map(A=>d.jsxs("div",{className:"mtr",children:[d.jsx("span",{className:"mtd-av",style:{background:A.color},children:A.name.slice(0,1)}),d.jsx("span",{className:"mtd-name",children:A.name}),d.jsx("span",{className:"num",children:ji(A.hr)}),d.jsxs("span",{className:"num",children:[A.num,"番"]}),d.jsx("span",{className:"num mtd-discord",children:A.discord||d.jsx("em",{className:"mtd-none",children:"未設定"})}),d.jsx("span",{className:"mtd-hub",children:A.userId?"紐づけ済":d.jsx("em",{className:"mtd-none",children:"未紐づけ"})}),d.jsxs("span",{className:"mtd-acts",children:[d.jsx("button",{type:"button",className:"mini",onClick:()=>w(A),children:"編集"}),d.jsx("button",{type:"button",className:"mini no",disabled:r.length<=1,onClick:()=>{confirm(`${A.name} を削除します。この人のシフトも消えます。`)&&s(A.id)},children:"削除"})]})]},A.id))]}),(o==="new"||o)&&d.jsxs("div",{className:"medit",children:[d.jsxs("div",{className:"medit-h",children:[d.jsx("b",{children:o==="new"?"担当者を追加":"担当者を編集"}),d.jsx("button",{type:"button",className:"linkbtn",onClick:()=>{l(null),p("")},children:"閉じる"})]}),d.jsxs("div",{className:"medit-grid",children:[d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["名前",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input",value:u.name,maxLength:12,onChange:A=>f(b=>({...b,name:A.target.value})),placeholder:"例：佐々木"})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["HR",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("select",{className:"input",value:u.hr,onChange:A=>f(b=>({...b,hr:A.target.value})),children:Wp.map(A=>d.jsx("option",{value:A,children:ji(A)},A))})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["番号",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input num",type:"number",min:1,max:40,value:u.num,onChange:A=>f(b=>({...b,num:A.target.value})),placeholder:"12"})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["Discord ID",d.jsx("span",{className:"fl-opt",children:"任意"})]}),d.jsx("input",{className:"input num",value:u.discord,inputMode:"numeric",onChange:A=>f(b=>({...b,discord:A.target.value})),placeholder:"朝6時のメンション用"})]})]}),o!=="new"&&d.jsxs("div",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["ScienceHUB アカウント",d.jsx("span",{className:"fl-opt",children:"3D印刷管理にアクセス可能なユーザー"})]}),_?d.jsx("p",{className:"fl-h",children:"読み込み中…"}):d.jsxs("div",{className:"hub-user-pick",role:"radiogroup","aria-label":"ScienceHUB アカウントの紐づけ",children:[d.jsxs("button",{type:"button",className:"hub-user-opt"+(u.hubUserId===null?" on":""),onClick:()=>f(A=>({...A,hubUserId:null})),children:[d.jsx("b",{children:"紐づけなし"}),d.jsx("span",{children:"この印刷担当者は ScienceHUB ログインと結びつきません"})]}),g.map(A=>{const b=A.linked_member_id&&A.linked_member_id!==o;return d.jsxs("button",{type:"button",disabled:!!b,className:"hub-user-opt"+(u.hubUserId===A.id?" on":""),onClick:()=>f(D=>({...D,hubUserId:A.id})),children:[d.jsx("b",{children:A.display_name}),d.jsxs("span",{children:["@",A.username," · ",A.email]}),d.jsx("em",{children:A.access_labels.join(" / ")}),b?d.jsxs("em",{children:["（別の印刷担当に紐づけ済: ",A.linked_member_name,"）"]}):null,A.linked_member_id===o?d.jsx("em",{children:"（この担当者に紐づけ中）"}):null]},A.id)})]})]}),d.jsxs("div",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"シフト表の色"}),d.jsx("div",{className:"color-pick",children:Kr.map(A=>d.jsx("button",{type:"button",className:u.color===A?"on":"",style:{background:A},onClick:()=>f(b=>({...b,color:A})),"aria-label":`色 ${A}`,"aria-pressed":u.color===A},A))})]}),m&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:m})}),d.jsxs("div",{className:"actrow end",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{l(null),p("")},children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:y,children:o==="new"?"追加する":"保存する"})]})]})]})}function I1({configured:r,onSend:e}){const[t,s]=Se.useState(""),[o,l]=Se.useState(null),[u,f]=Se.useState(!1),m=async()=>{const p=t.trim();if(!p){l({ok:!1,text:"送信先メールアドレスを入力してください"});return}f(!0),l({ok:null,text:"送信中…"});try{const g=await e(p);l({ok:!0,text:`送信しました（${g.to??p}）`})}catch(g){l({ok:!1,text:g instanceof Error?g.message:"送信に失敗しました"})}finally{f(!1)}};return d.jsxs("section",{className:"intg","data-testid":"email-test-section",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"予約者向けメール（Cloudflare Email Sending）"}),d.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"設定済み":"未設定"})]}),d.jsx("p",{className:"fl-h",children:"申請・受領通知はサーバー環境変数（PRINT_3D_EMAIL_FROM、CLOUDFLARE_API_TOKEN 等）経由で送信されます。 下の欄に任意のアドレスを入れて、同じ経路のテストメールを送れます。"}),!r&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:"メール送信が未設定です。Cloudflare Email Service のドメイン認証と Pages のシークレットを確認してください。"})}),d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"テスト送信先"}),d.jsx("input",{className:"input",type:"email",autoComplete:"email",spellCheck:!1,"data-testid":"email-test-to",value:t,onChange:p=>s(p.target.value),placeholder:"you@example.com",disabled:!r||u})]}),d.jsx("div",{className:"intg-f",children:d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"email-test-send",disabled:!r||u||!t.trim(),onClick:()=>void m(),children:"テスト送信"})}),o&&d.jsx("p",{className:"fl-h"+(o.ok===!0?"":o.ok===!1?" warn":""),role:"status","data-testid":"email-test-result",children:o.text})]})}function F1({configured:r,members:e,onSend:t}){var M;const[s,o]=Se.useState(()=>new Set),[l,u]=Se.useState(null),[f,m]=Se.useState(!1),p=w=>{o(E=>{const S=new Set(E);return S.has(w)?S.delete(w):S.add(w),S})},g=async()=>{var E;const w=[...s];if(!w.length){u({ok:!1,text:"メンションする担当者を1人以上選んでください"});return}m(!0),u({ok:null,text:"Discord へ送信中…"});try{const S=await t(w),y=(S.sent||[]).map(b=>b.name).join("・"),A=((E=S.skipped)==null?void 0:E.length)>0?`（スキップ: ${S.skipped.map(b=>`${b.name}: ${b.reason}`).join(" / ")}）`:"";u({ok:!0,text:`送信しました。Discord で ${y} へのメンション（青字）を確認してください。${A}`,detail:S.content,sent:S.sent})}catch(S){u({ok:!1,text:S instanceof Error?S.message:"送信に失敗しました"})}finally{m(!1)}},x=e.filter(w=>(w.discord||"").trim()),_=e.some(w=>(w.discord||"").trim());return d.jsxs("section",{className:"intg","data-testid":"discord-mention-test-section",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"Discord メンションのテスト"}),d.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"Webhook設定済み":"Webhook未設定"})]}),d.jsxs("p",{className:"fl-h",children:["朝6時の担当者メンションと同じ形式で、選んだ担当者に ",d.jsx("code",{children:"<@ユーザーID>"})," を送ります。 チャンネルで名前が青く通知されれば、その Discord ID は正しく設定されています。"]}),!r&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:"サーバーに Discord Webhook（DISCORD_WEBHOOK_URL）が未設定です。Wrangler / Pages の環境変数を確認してください。"})}),!_&&d.jsx("div",{className:"note warn",children:d.jsx("span",{children:"担当者タブで Discord ユーザーID（数字）を登録してからテストしてください。"})}),d.jsxs("div",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"メンションする担当者"}),d.jsx("div",{className:"mp-list",style:{marginTop:8},children:e.map(w=>{const E=(w.discord||"").trim(),S=!!E,y=s.has(w.id);return d.jsxs("button",{type:"button",className:"mp"+(y?" on":"")+(S?"":" disabled"),style:y?{borderColor:w.color,background:w.color+"14"}:void 0,disabled:!r||f||!S,"data-testid":`discord-mention-member-${w.id}`,onClick:()=>S&&p(w.id),"aria-pressed":y,children:[d.jsx("span",{className:"mp-av",style:{background:w.color},children:w.name.slice(0,1)}),d.jsxs("span",{className:"mp-tx",children:[d.jsx("b",{children:w.name}),d.jsxs("span",{className:"num",children:[ji(w.hr),"・",w.num,"番"]})]}),d.jsx("span",{className:"num mtd-discord",children:E||"ID未設定"})]},w.id)})}),x.length>0&&d.jsx("span",{className:"fl-h",children:"ID未設定の担当者は選択できません（担当者タブで編集）。"})]}),d.jsx("div",{className:"intg-f",children:d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"discord-mention-test-send",disabled:!r||f||s.size===0,onClick:()=>void g(),children:"メンションをテスト送信"})}),l&&d.jsx("p",{className:"fl-h"+(l.ok===!0?"":l.ok===!1?" warn":""),role:"status","data-testid":"discord-mention-test-result",children:l.text}),(l==null?void 0:l.ok)===!0&&((M=l.sent)==null?void 0:M.length)>0&&d.jsx("ul",{className:"fl-h","data-testid":"discord-mention-test-sent-list",style:{marginTop:4,paddingLeft:"1.2rem"},children:l.sent.map(w=>d.jsxs("li",{children:[d.jsx("b",{children:w.name})," — メンション ID: ",d.jsx("span",{className:"num",children:w.discord_user_id})]},w.member_id))}),(l==null?void 0:l.detail)&&d.jsxs("details",{className:"fl-h",style:{marginTop:8},children:[d.jsx("summary",{children:"送信したメッセージ本文"}),d.jsx("pre",{className:"mono",style:{whiteSpace:"pre-wrap",fontSize:"0.85em",marginTop:6},children:l.detail})]})]})}function O1({value:r,onChange:e,onTestDiscord:t,onTestDiscordMention:s,onTestGcal:o,onTestEmail:l,emailConfigured:u,discordConfigured:f,members:m}){const p=r.discord||{},g=r.gcal||{},x=y=>e({...r,discord:{...p,...y}}),_=y=>e({...r,gcal:{...g,...y}}),w=(p.webhook||"").includes("サーバー設定")||/^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(p.webhook||""),S=(g.calendarId||"").includes("サーバー設定")||/^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(g.calendarId||"");return d.jsxs("div",{className:"integ",children:[d.jsxs("section",{className:"intg",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"Discord 通知"}),d.jsx("span",{className:"intg-state "+(p.enabled?w?"ok":"warn":"off"),children:p.enabled?w?"有効":"URL未設定":"無効"}),d.jsxs("label",{className:"sw",children:[d.jsx("input",{type:"checkbox",checked:!!p.enabled,onChange:y=>x({enabled:y.target.checked})}),d.jsx("span",{})]})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["Webhook URL",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input mono",value:p.webhook||"",spellCheck:"false",onChange:y=>x({webhook:y.target.value.trim()}),placeholder:"https://discord.com/api/webhooks/123.../abc..."}),d.jsx("span",{className:"fl-h",children:"Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURL。"})]}),!w&&(p.webhook||"")&&d.jsx("div",{className:"note warn",children:d.jsxs("span",{children:["URLの形式が違います。",d.jsx("b",{children:"https://discord.com/api/webhooks/…"})," の形で貼り付けてください。"]})}),d.jsxs("div",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"通知するタイミング"}),d.jsx("div",{className:"chk-grid",children:[["pending","新しい申請"],["approved","確定したとき"],["cancelled","取り消したとき"]].map(([y,A])=>d.jsxs("label",{className:"chk",children:[d.jsx("input",{type:"checkbox",checked:!!(p.events&&p.events[y]),onChange:b=>x({events:{...p.events,[y]:b.target.checked}})}),d.jsx("span",{children:A})]},y))})]}),d.jsxs("label",{className:"chk",style:{alignSelf:"flex-start"},children:[d.jsx("input",{type:"checkbox",checked:!!p.dailyMention,onChange:y=>x({dailyMention:y.target.checked})}),d.jsx("span",{children:"当日の担当者を朝6:00にメンションする"})]}),d.jsx("span",{className:"fl-h",style:{marginTop:-6},children:"メンバーに登録した Discord ID を使います。未設定の人はメンションされません。"}),d.jsxs("div",{className:"intg-f",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:t,disabled:!w,children:"テスト送信"}),d.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),s&&(m==null?void 0:m.length)>0&&d.jsx(F1,{configured:!!f,members:m,onSend:s}),d.jsxs("section",{className:"intg",children:[d.jsxs("div",{className:"intg-h",children:[d.jsx("b",{children:"Google カレンダー"}),d.jsx("span",{className:"intg-state "+(g.enabled?S?"ok":"warn":"off"),children:g.enabled?S?"有効":"ID未設定":"無効"}),d.jsxs("label",{className:"sw",children:[d.jsx("input",{type:"checkbox",checked:!!g.enabled,onChange:y=>_({enabled:y.target.checked})}),d.jsx("span",{})]})]}),d.jsxs("label",{className:"fl",children:[d.jsxs("span",{className:"fl-l",children:["カレンダーID",d.jsx("span",{className:"req",children:"必須"})]}),d.jsx("input",{className:"input mono",value:g.calendarId||"",spellCheck:"false",onChange:y=>_({calendarId:y.target.value.trim()}),placeholder:"xxxx@group.calendar.google.com"}),d.jsx("span",{className:"fl-h",children:"共有カレンダーの「設定 → カレンダーの統合」に載っているID。"})]}),d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"予定タイトルの書式"}),d.jsx("input",{className:"input",value:g.title||"",onChange:y=>_({title:y.target.value}),placeholder:"[3Dプリント] {title}"}),d.jsxs("span",{className:"fl-h",children:["{title}"," 作品名 / ","{who}"," 申請者 / ","{machine}"," 機種 に置き換わります。"]})]}),d.jsxs("div",{className:"fl-2",children:[d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"所要時間"}),d.jsx("select",{className:"input",value:g.duration||20,onChange:y=>_({duration:Number(y.target.value)}),children:[10,15,20,30,60,90,120].map(y=>d.jsxs("option",{value:y,children:[y,"分"]},y))})]}),d.jsxs("label",{className:"fl",children:[d.jsx("span",{className:"fl-l",children:"登録する時点"}),d.jsxs("select",{className:"input",value:g.syncOn||"approved",onChange:y=>_({syncOn:y.target.value}),children:[d.jsx("option",{value:"pending",children:"申請が届いた時点"}),d.jsx("option",{value:"approved",children:"確定した時点"})]})]})]}),d.jsxs("div",{className:"intg-f",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:o,disabled:!S,children:"接続テスト"}),d.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),l&&d.jsx(I1,{configured:u,onSend:l})]})}function k1({members:r,avail:e,onAddMember:t,onUpdateMember:s,onRemoveMember:o,onPaintAvail:l,shiftDraftPending:u,shiftDraftSummary:f,shiftApplying:m,onConfirmShiftDraft:p,onDiscardShiftDraft:g,onLoadShiftMonth:x,integrations:_,setIntegrations:M,onTestDiscord:w,onTestDiscordMention:E,onTestGcal:S,onTestEmail:y,emailConfigured:A,discordConfigured:b,log:D,pendingPre:$}){const[U,L]=Se.useState($||"shift"),[q,N]=Se.useState(r[0]?r[0].id:null),[C,j]=Se.useState(()=>{const Y=new Date;return{y:Y.getFullYear(),m:Y.getMonth()+1}});Se.useEffect(()=>{$&&L($)},[$]),Se.useEffect(()=>{r.length&&!r.find(Y=>Y.id===q)&&N(r[0].id)},[r]);const X=Se.useRef("");Se.useEffect(()=>{if(U!=="shift")return;const Y=`${C.y}-${C.m}`;X.current!==Y&&(X.current=Y,x(C.y,C.m))},[U,C.y,C.m,x]);const z=[["shift","シフト表"],["member","担当者"],["integ","外部連携"]],ne=Y=>{if(Y!==0&&(X.current=""),Y===0){const F=new Date;X.current="",j({y:F.getFullYear(),m:F.getMonth()+1});return}j(F=>{let re=F.y,ee=F.m+Y;return ee<1&&(ee=12,re-=1),ee>12&&(ee=1,re+=1),{y:re,m:ee}})},ue=f&&u?[f.addedSlots>0&&`追加${f.addedSlots}枠`,f.removedSlots>0&&`削除${f.removedSlots}枠`,f.addedDates>0&&`＋${f.addedDates}日`,f.removedDates>0&&`−${f.removedDates}日`].filter(Boolean).join(" · "):"",G=r.find(Y=>Y.id===q);return d.jsxs("div",{className:"set-wrap",children:[d.jsx("div",{className:"set-tabs",role:"tablist",children:z.map(([Y,F])=>d.jsx("button",{type:"button",role:"tab","aria-selected":U===Y,className:U===Y?"on":"",onClick:()=>L(Y),children:F},Y))}),d.jsxs("div",{className:"set-tab-stage",children:[U==="shift"&&d.jsxs("div",{className:"shifttab",children:[u&&d.jsxs("div",{className:"shift-confirm-bar",role:"status",children:[d.jsxs("span",{className:"shift-confirm-bar-text",children:["未保存のシフト変更があります",ue?`（${ue}）`:""]}),d.jsxs("div",{className:"shift-confirm-bar-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:m,onClick:g,children:"変更を破棄"}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",disabled:m,onClick:p,children:m?"保存中…":"変更を確定"})]})]}),d.jsxs("div",{className:"card memberpick",children:[d.jsxs("div",{className:"mp-h",children:[d.jsx("b",{children:"担当者を選んで、日付を塗る"}),d.jsx("span",{className:"fl-h",children:"選択した担当者の稼働日をカレンダー上で直接追加・削除できます。確定するまでサーバーには保存されません。"})]}),d.jsx("div",{className:"mp-list",children:r.map(Y=>{const F=(e[Y.id]||[]).filter(re=>re>=li).length;return d.jsxs("button",{type:"button",className:"mp"+(q===Y.id?" on":""),style:q===Y.id?{borderColor:Y.color,background:Y.color+"14"}:void 0,onClick:()=>N(Y.id),children:[d.jsx("span",{className:"mp-av",style:{background:Y.color},children:Y.name.slice(0,1)}),d.jsxs("span",{className:"mp-tx",children:[d.jsx("b",{children:Y.name}),d.jsxs("span",{className:"num",children:[ji(Y.hr),"・",Y.num,"番"]})]}),d.jsxs("span",{className:"mp-count num",children:[F,"日"]})]},Y.id)})})]}),d.jsxs("div",{className:"card",children:[d.jsxs("div",{className:"card-h",children:[d.jsx("b",{children:"シフト表"}),d.jsx("span",{className:"meta",children:G?`${G.name} の稼働日`:"担当者を選択"})]}),d.jsx("div",{className:"shifttab-body shifttab-body--cal-only",children:d.jsx(D1,{year:C.y,month:C.m,avail:e,memberId:q,onPaint:(Y,F)=>l(q,Y,F),onChangeMonth:ne})})]})]}),U==="member"&&d.jsx(U1,{members:r,onAdd:t,onUpdate:s,onRemove:o}),U==="integ"&&d.jsx(O1,{value:_,onChange:M,onTestDiscord:w,onTestDiscordMention:E,onTestGcal:S,onTestEmail:y,emailConfigured:A,discordConfigured:b,members:r})]})]})}const z1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function B1(r){const e=String(r??"");return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function j1(r){const e=[...r].sort((o,l)=>{const u=l.desired_date.localeCompare(o.desired_date);return u!==0?u:l.created_at.localeCompare(o.created_at)}),s=[["希望日","HR","番号","氏名","タイトル","パーツ数","ステータス","担当","プリンター","STL","作成日時"].join(",")];for(const o of e)s.push([o.desired_date,o.homeroom,o.student_number,o.student_name,o.title,o.part_count??1,z1[o.status]??o.status,o.print_staff_label??"",o.printer_name??"",o.stl_filename??"",o.created_at].map(B1).join(","));return"\uFEFF"+s.join(`
`)}function H1(r){const e=j1(r),t=new Blob([e],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a"),l=new Date().toISOString().slice(0,10);o.href=s,o.download=`3dprint_history_${l}.csv`,o.click(),URL.revokeObjectURL(s)}const V1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function G1({reservations:r,onOpen:e}){const t=[...r].sort((s,o)=>{const l=o.desired_date.localeCompare(s.desired_date);return l!==0?l:o.created_at.localeCompare(s.created_at)});return t.length?d.jsxs("div",{className:"card legacy-panel",children:[d.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"0 0 10px",flexWrap:"wrap"},children:[d.jsxs("p",{className:"hint",style:{margin:0},children:["全 ",t.length," 件"]}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:!t.length,onClick:()=>H1(t),children:"CSVエクスポート"})]}),d.jsx("div",{className:"table-wrap admin-table-wrap",children:d.jsxs("table",{children:[d.jsx("thead",{children:d.jsxs("tr",{children:[d.jsx("th",{children:"希望日"}),d.jsx("th",{children:"HR"}),d.jsx("th",{children:"タイトル"}),d.jsx("th",{children:"パーツ"}),d.jsx("th",{children:"ステータス"}),d.jsx("th",{children:"担当"}),d.jsx("th",{})]})}),d.jsx("tbody",{children:t.map(s=>d.jsxs("tr",{children:[d.jsx("td",{children:s.desired_date}),d.jsx("td",{children:s.homeroom}),d.jsx("td",{children:s.title}),d.jsx("td",{children:s.part_count&&s.part_count>1?s.part_count:"—"}),d.jsx("td",{children:d.jsx("span",{className:`status-badge status-${s.status}`,children:V1[s.status]??s.status})}),d.jsx("td",{children:s.print_staff_label?`担当: ${s.print_staff_label}`:"—"}),d.jsx("td",{children:d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>e(s),children:"詳細"})})]},s.id))})]})})]}):d.jsx("p",{className:"hint admin-list-empty",children:"履歴がありません"})}function xg({selected:r,onSelect:e,title:t,description:s,badge:o,accent:l,disabled:u,"aria-label":f}){return d.jsxs("button",{type:"button",className:"dnd-pick"+(r?" on":"")+(u?" disabled":""),onClick:e,disabled:u,"aria-pressed":r,"aria-label":f??t,style:r&&l?{borderColor:l,boxShadow:`0 0 0 1px ${l}`}:void 0,children:[d.jsx("span",{className:"dnd-pick-grip","aria-hidden":"true",children:"⠿"}),d.jsxs("span",{className:"dnd-pick-body",children:[o?d.jsx("span",{className:"dnd-pick-badge",style:l?{background:l+"22",color:l}:void 0,children:o}):null,d.jsx("b",{children:t}),s?d.jsx("span",{children:s}):null]}),d.jsx("span",{className:"dnd-pick-check","aria-hidden":"true",children:r?"✓":""})]})}function yg({children:r,columns:e=2}){return d.jsx("div",{className:"dnd-pick-grid cols-"+e,children:r})}function W1({file:r,onFile:e,label:t="プリンター画像",hint:s="PNG / JPG をドラッグ＆ドロップ、またはクリックして選択",accept:o="image/*"}){const l=Se.useRef(null),[u,f]=Se.useState(!1),[m,p]=Se.useState(null);Se.useEffect(()=>{if(!r){p(null);return}const x=URL.createObjectURL(r);return p(x),()=>URL.revokeObjectURL(x)},[r]);const g=x=>{const _=x==null?void 0:x[0];!_||!_.type.startsWith("image/")||e(_)};return d.jsxs("div",{className:"imgdrop-wrap",children:[d.jsx("span",{className:"imgdrop-label",children:t}),d.jsxs("div",{className:"imgdrop"+(u?" over":"")+(r?" filled":""),onDragOver:x=>{x.preventDefault(),f(!0)},onDragLeave:()=>f(!1),onDrop:x=>{x.preventDefault(),f(!1),g(x.dataTransfer.files)},onClick:()=>{var x;return(x=l.current)==null?void 0:x.click()},role:"button",tabIndex:0,onKeyDown:x=>{var _;(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),(_=l.current)==null||_.click())},children:[d.jsx("input",{ref:l,type:"file",accept:o,className:"sr",onChange:x=>g(x.target.files)}),m?d.jsxs(d.Fragment,{children:[d.jsx("img",{className:"imgdrop-preview",src:m,alt:""}),d.jsxs("span",{className:"imgdrop-meta",children:[d.jsx("b",{children:r==null?void 0:r.name}),d.jsxs("span",{children:[(((r==null?void 0:r.size)??0)/1024).toFixed(0)," KB ・ クリックで差し替え"]})]}),d.jsx("button",{type:"button",className:"imgdrop-clear","aria-label":"画像を外す",onClick:x=>{x.stopPropagation(),e(null)},children:"×"})]}):d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"imgdrop-icon","aria-hidden":"true",children:"🖼"}),d.jsxs("span",{className:"imgdrop-meta",children:[d.jsx("b",{children:s}),d.jsx("span",{children:"一覧サムネイルに表示されます（任意）"})]})]})]})]})}function $1({onToast:r,onReload:e}){var z,ne,ue;const[t,s]=Se.useState([]),[o,l]=Se.useState(""),[u,f]=Se.useState(null),[m,p]=Se.useState(null),[g,x]=Se.useState(""),[_,M]=Se.useState(null),[w,E]=Se.useState(!1),[S,y]=Se.useState([]),[A,b]=Se.useState(""),[D,$]=Se.useState([]),U=Se.useCallback(async()=>{const[G,Y]=await Promise.all([bx(),Gx()]);s(G.printers),x(Y.storage_path??""),y(Y.group_roots??[])},[]);Se.useEffect(()=>{U().catch(G=>r(G instanceof Error?G.message:"読み込み失敗"))},[U,r]);const L=async()=>{if(!u){r("機種（KE / CC）を選んでください");return}const G=o.trim();if(G)try{await Rx(G,m??void 0),l(""),f(null),p(null),await U(),e==null||e(),r("プリンターを追加しました")}catch(Y){r(Y instanceof Error?Y.message:"追加失敗")}},q=async()=>{try{await Wx(g.trim()),r("印刷動画の保存先を更新しました")}catch(G){r(G instanceof Error?G.message:"保存失敗")}},N=async()=>{var Y,F;if(!_)return;const G=(((Y=_.capabilities)==null?void 0:Y.nozzle_sizes_mm)??["0.4"]).map(String).filter(Boolean);try{await Nx(_.id,{name:_.name.trim(),status:_.status,capabilities:{can_record_print_video:!!((F=_.capabilities)!=null&&F.can_record_print_video),nozzle_sizes_mm:G},daily_capacity:_.daily_capacity}),M(null),await U(),r("更新しました")}catch(re){r(re instanceof Error?re.message:"更新失敗")}},C=async()=>{E(!0),b(""),$([])},j=async G=>{if(b(G),!G){$([]);return}const Y=await jx(G);$(Y.items.map(F=>({path:F.path,name:F.name})))},X=[{id:"available",label:"稼働",desc:"予約・依頼を受け付ける",accent:"var(--color-success)"},{id:"maintenance",label:"メンテ",desc:"一時停止（再配置あり）",accent:"var(--color-warn-ink)"},{id:"unavailable",label:"印刷不能",desc:"予約不可",accent:"var(--color-text-muted)"}];return d.jsxs("div",{className:"legacy-panel ops-printers",children:[d.jsxs("section",{className:"card ops-card",id:"print-video-settings-section",children:[d.jsx("h2",{className:"section-heading",children:"印刷動画の保存先"}),d.jsx("p",{className:"hint",children:"管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。"}),d.jsxs("div",{className:"form-group",children:[d.jsx("label",{htmlFor:"print-video-storage-path",children:"保存先フォルダ"}),d.jsxs("div",{style:{display:"flex",gap:8},children:[d.jsx("input",{id:"print-video-storage-path",className:"input",value:g,readOnly:!0,placeholder:"未設定（参照から選択）"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void C(),children:"参照…"})]})]}),d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void q(),children:"保存先を保存"})]}),d.jsxs("section",{className:"card ops-card",children:[d.jsx("h2",{className:"section-heading",children:"プリンター管理"}),d.jsx("p",{className:"hint ops-lead",children:"登録済みプリンターの編集・削除、および新規追加ができます。"}),d.jsx("div",{className:"printer-admin-grid",children:t.map(G=>{var Y,F;return d.jsxs("article",{className:"printer-admin-card",children:[G.image_url?d.jsx("img",{className:"printer-admin-image",src:G.image_url,alt:""}):d.jsx("div",{className:"printer-admin-image printer-admin-image-placeholder",children:"🖨️"}),d.jsx("div",{className:"printer-admin-body",children:d.jsxs(d.Fragment,{children:[d.jsx("h3",{className:"printer-admin-title",children:G.name}),d.jsxs("p",{className:"hint printer-admin-cap-summary",children:[G.status??"available"," / ノズル ",(((Y=G.capabilities)==null?void 0:Y.nozzle_sizes_mm)??[]).join(", ")||"—"," /"," ",(F=G.capabilities)!=null&&F.can_record_print_video?"動画撮影可":"動画撮影不可"]}),d.jsxs("div",{className:"printer-admin-actions",children:[d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>M(G),children:"編集"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{confirm(`「${G.name}」を削除しますか？`)&&Lx(G.id).then(U).then(()=>r("削除しました")).catch(re=>r(re instanceof Error?re.message:"削除失敗"))},children:"削除"}),d.jsxs("label",{className:"btn btn-secondary btn-sm",children:["画像",d.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:re=>{var O;const ee=(O=re.target.files)==null?void 0:O[0];ee&&Px(G.id,ee).then(U).catch(ce=>r(ce instanceof Error?ce.message:"画像失敗"))}})]})]})]})})]},G.id)})}),d.jsxs("div",{className:"printer-add-card","data-testid":"printer-add-form",children:[d.jsxs("div",{className:"printer-add-head",children:[d.jsx("h3",{children:"プリンターを追加"}),d.jsx("p",{className:"hint",children:"機種を選び、表示名と画像（任意）を設定してから追加します。"})]}),d.jsxs("div",{className:"printer-add-block",children:[d.jsx("span",{className:"printer-add-label",children:"機種（どの枠に割り当てるか）"}),d.jsx(yg,{children:Bl.map(G=>d.jsx(xg,{selected:u===G.id,badge:G.short,accent:G.id==="ke"?"var(--color-primary)":"var(--color-tip)",title:G.name,description:`${G.maker} ・ ${G.hint}`,onSelect:()=>{f(G.id),o.trim()||l(`${G.short} `)}},G.id))})]}),d.jsxs("div",{className:"printer-add-block",children:[d.jsx("label",{className:"printer-add-label",htmlFor:"printer-add-name",children:"表示名"}),d.jsx("input",{id:"printer-add-name",className:"input printer-add-name",placeholder:u?`${((z=Bl.find(G=>G.id===u))==null?void 0:z.short)??""} 3号機`:"例: KE 3号機",value:o,onChange:G=>l(G.target.value)})]}),d.jsx("div",{className:"printer-add-block",children:d.jsx(W1,{file:m,onFile:p})}),d.jsx("div",{className:"printer-add-actions",children:d.jsx("button",{type:"button",className:"btn btn-primary btn-lg",disabled:!u||!o.trim(),onClick:()=>void L(),children:"プリンターを追加"})})]})]}),_&&d.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[d.jsx("div",{className:"legacy-modal-scrim",onClick:()=>M(null)}),d.jsxs("div",{className:"legacy-modal-body card",children:[d.jsxs("h2",{children:[_.name," を編集"]}),d.jsxs("label",{className:"form-group",children:["名前",d.jsx("input",{className:"input",value:_.name,onChange:G=>M({..._,name:G.target.value})})]}),d.jsxs("div",{className:"form-group",children:[d.jsx("span",{className:"printer-add-label",children:"ステータス"}),d.jsx(yg,{columns:3,children:X.map(G=>d.jsx(xg,{selected:(_.status??"available")===G.id,title:G.label,description:G.desc,accent:G.accent,onSelect:()=>M({..._,status:G.id})},G.id))})]}),d.jsxs("label",{className:"form-group",children:["ノズル径（カンマ区切り）",d.jsx("input",{className:"input",value:(((ne=_.capabilities)==null?void 0:ne.nozzle_sizes_mm)??[]).join(", "),onChange:G=>M({..._,capabilities:{..._.capabilities,nozzle_sizes_mm:G.target.value.split(",").map(Y=>Y.trim()).filter(Boolean)}})})]}),d.jsxs("label",{className:"chk",children:[d.jsx("input",{type:"checkbox",checked:!!((ue=_.capabilities)!=null&&ue.can_record_print_video),onChange:G=>M({..._,capabilities:{..._.capabilities,can_record_print_video:G.target.checked}})}),"動画撮影可"]}),d.jsx("div",{className:"form-grid",style:{gridTemplateColumns:"1fr 1fr",marginTop:8},children:["max_small","max_small_with_main","max_medium","max_large"].map(G=>{var Y;return d.jsxs("label",{children:[G,d.jsx("input",{className:"input",type:"number",value:((Y=_.daily_capacity)==null?void 0:Y[G])??0,onChange:F=>M({..._,daily_capacity:{..._.daily_capacity,[G]:Number(F.target.value)}})})]},G)})}),d.jsxs("div",{className:"legacy-modal-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>M(null),children:"キャンセル"}),d.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>void N(),children:"保存"})]})]})]}),w&&d.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[d.jsx("div",{className:"legacy-modal-scrim",onClick:()=>E(!1)}),d.jsxs("div",{className:"legacy-modal-body card",children:[d.jsx("h2",{children:"保存先フォルダ"}),d.jsx("p",{className:"hint",children:A||"チームを選んでください"}),d.jsxs("div",{style:{display:"grid",gap:6,maxHeight:280,overflow:"auto"},children:[!A&&S.map(G=>d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void j(G.path),children:G.label},G.path)),A&&d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void j(""),children:"チームへ戻る"}),D.map(G=>d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void j(G.path),children:G.name},G.path))]}),d.jsxs("div",{className:"legacy-modal-actions",children:[d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>E(!1),children:"閉じる"}),d.jsx("button",{type:"button",className:"btn btn-primary",disabled:!A,onClick:()=>{x(A),E(!1)},children:"このフォルダを選択"})]})]})]})]})}const X1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function q1({reservation:r,onClose:e,onToast:t,onUpdated:s}){const[o,l]=Se.useState(!1);if(Se.useEffect(()=>{l(!!(r!=null&&r.has_print_video))},[r]),!r)return null;const u=async m=>{try{await $x(r.id,m),l(!0),t("印刷動画をアップロードしました"),s()}catch(p){t(p instanceof Error?p.message:"アップロード失敗")}},f=async()=>{try{await Xx(r.id),l(!1),t("印刷動画を削除しました"),s()}catch(m){t(m instanceof Error?m.message:"削除失敗")}};return d.jsxs(J0,{open:!!r,title:r.title,sub:`${r.desired_date} · ${r.printer_name??""}`,onClose:e,footer:d.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[d.jsxs("dl",{className:"kv",children:[d.jsxs("div",{children:[d.jsx("dt",{children:"ステータス"}),d.jsx("dd",{children:X1[r.status]??r.status})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"申請者"}),d.jsxs("dd",{children:[r.student_name,"（",r.homeroom," · ",r.student_number,"）"]})]}),d.jsxs("div",{children:[d.jsx("dt",{children:"担当"}),d.jsx("dd",{children:r.print_staff_label??"—"})]}),(r.part_count??1)>1?d.jsxs("div",{children:[d.jsx("dt",{children:"パーツ数"}),d.jsx("dd",{children:r.part_count})]}):null]}),d.jsx("div",{className:"ftitle",children:"印刷動画"}),o?d.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[d.jsx("a",{className:"btn btn-secondary btn-sm",href:qx(r.id),download:!0,children:"動画をダウンロード"}),d.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void f(),children:"動画を削除"})]}):d.jsx("p",{className:"hint",children:"未アップロード"}),d.jsx("input",{type:"file",accept:"video/*",onChange:m=>{var g;const p=(g=m.target.files)==null?void 0:g[0];p&&u(p)}}),d.jsx("div",{style:{marginTop:12,display:"flex",gap:8},children:d.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void Td(r.id,{status:"delivered"}).then(s).then(()=>t("完了にしました")).catch(m=>t(m instanceof Error?m.message:"更新失敗")),children:"完了にする"})})]})}function Y1({showToast:r}){const[e,t]=Se.useState("printers"),[s,o]=Se.useState(null),[l,u]=Se.useState(0),[f,m]=Se.useState([]);Se.useEffect(()=>{Cx().then(m)},[l]);const p=g=>r(g);return d.jsxs("div",{className:"set-wrap",children:[d.jsxs("div",{className:"set-tabs",role:"tablist",children:[d.jsx("button",{type:"button",role:"tab",className:e==="printers"?"on":"",onClick:()=>t("printers"),children:"プリンター"}),d.jsx("button",{type:"button",role:"tab",className:e==="history"?"on":"",onClick:()=>t("history"),children:"印刷履歴"})]}),e==="printers"?d.jsx($1,{onToast:p,onReload:()=>u(g=>g+1)},l):d.jsx(G1,{reservations:f,onOpen:g=>o(g)}),d.jsx(q1,{reservation:s,onClose:()=>o(null),onToast:p,onUpdated:()=>u(g=>g+1)})]})}function K1(){const r=Ug(),[e,t]=Se.useState(!0),[s,o]=Se.useState([]),[l,u]=Se.useState([]),[f,m]=Se.useState({}),[p,g]=Se.useState({}),x=Se.useRef(f),_=Se.useRef(p);x.current=f,_.current=p;const[M,w]=Se.useState(!1),[E,S]=Se.useState(()=>r.screen||"reserve"),[y,A]=Se.useState(()=>r.selected||li),[b,D]=Se.useState(null),[$,U]=Se.useState(()=>d0()??I0()),[L,q]=Se.useState(()=>c0()),[N,C]=Se.useState(null),[j,X]=Se.useState(null),[z,ne]=Se.useState(null),[ue,G]=Se.useState(null),[Y,F]=Se.useState(null),[re,ee]=Se.useState(!1),[O,ce]=Se.useState(!1),ke=Se.useCallback((W,Z)=>{Qx(W),fl(Z)},[]),te=Se.useCallback(async W=>{const{from:Z,to:ve}=R0(W),[{applications:be},Qe]=await Promise.all([gx(Z,ve),px(Z,ve)]),je=new Map;for(const B of be)je.set(B.id,qp(B));for(const B of Qe.applications)je.set(B.id,qp(B));u([...je.values()])},[]),he=Se.useCallback(async()=>{var je;const W=await vx(),Z=T0(W);o(Z);const ve=zn(y),be=await Fp(ve.getFullYear(),ve.getMonth()+1),Qe=Bg(be.availability);m(Qe),g(Qe),ke(Z,Qe);try{D(await Dp())}catch{}await te(y);try{const B=await Ix();ee(!!B.email.configured),ce(!!B.discord.configured),U(pe=>({...pe,discord:{...pe.discord,webhook:B.discord.configured?"(サーバー設定)":""},gcal:{...pe.gcal,calendarId:B.gcal.configured?"(サーバー設定)":""}}))}catch{}try{const B=await Bx(80);(je=B.log)!=null&&je.length&&q(B.log.map(pe=>({id:pe.id,at:pe.at,actor:pe.actor,type:pe.type,text:pe.text,appId:pe.app_id})))}catch{}},[te,y,ke]);Se.useEffect(()=>{(async()=>{try{await he()}catch(W){_e.current(W instanceof Error?W.message:"読み込みに失敗しました","エラー")}finally{t(!1)}})()},[he]),Se.useEffect(()=>{if(e)return;const W=new URLSearchParams(window.location.search),Z=W.get("selected"),ve=W.get("app");if(Z&&/^\d{4}-\d{2}-\d{2}$/.test(Z)&&A(Z),ve){const be=l.find(Qe=>Qe.id===ve);be&&(A(be.date),C(be),X("view"))}},[e,l]),Se.useEffect(()=>{l0({screen:E,selected:y})},[E,y]),Se.useEffect(()=>{f0($)},[$]),Se.useEffect(()=>{u0(L)},[L]);const we=b?U0(b):"—",_e=Se.useRef(()=>{}),Ae=Se.useCallback((W,Z)=>{F({text:W,mark:Z}),window.setTimeout(()=>F(null),2600)},[]);_e.current=Ae;const Ie=Se.useCallback((W,Z,ve=null)=>{q(be=>[{id:"l"+Date.now()+Math.random().toString(36).slice(2,5),at:new Date().toISOString(),actor:we,type:W,text:Z,appId:ve},...be]),zx({type:W,text:Z,app_id:ve}).catch(()=>{})},[we]),K=(W,Z)=>{C(W),X(Z??null)},mt=()=>{C(null),X(null)},Ye=(W,Z)=>{u(ve=>ve.map(be=>be.id===W?{...be,...Z}:be)),C(ve=>ve&&ve.id===W?{...ve,...Z}:ve)},ht=async(W,Z,ve,be)=>{var je;if(be!==void 0&&Z===null){try{await Td(W.id,{status_comment:be}),Ye(W.id,{adminNote:be}),Ie("approve",`「${W.title}」に担当者メモを追加`,W.id),Ae("担当者メモを保存しました")}catch(B){Ae(B instanceof Error?B.message:"保存に失敗しました","エラー")}return}if(!Z)return;const Qe=D0(s,((je=b==null?void 0:b.linked_member)==null?void 0:je.id)??null);try{if(Z==="approved"&&W.status==="pending"){if(!Qe)throw new Error("予約を受領するには、担当者タブで ScienceHUB アカウントと印刷担当者を紐づけてください");await wx(W.id,Qe)}else W.status==="cancelled"&&Z==="pending"?await mx(W.id):await Td(W.id,{status:b0(Z)});Ye(W.id,{status:Z,...ve||{},by:we});const B=Qs[Z];Ie(Z==="cancelled"?"cancel":"approve",`「${W.title}」を${B}（${pl(W.date)}・${yi[W.kind]}）`,W.id),Ae(`${W.title} を${B}にしました`,B),await te(y)}catch(B){Ae(B instanceof Error?B.message:"更新に失敗しました","エラー")}},Ke=async(W,Z,ve,be)=>{const Qe=Hd(W);if(Z.length===Qe.length){await ht(W,ve,be);return}try{await Ux(W.id,{slot_indexes:Z,target_status:ve});const B=Qs[ve],pe=`${qt(Qa(Z[0]))}〜${qt(Qa(Z[Z.length-1])+Js)}`;Ie(ve==="cancelled"?"cancel":"approve",`「${W.title}」の ${pe}（${Z.length}枠）を${B}`,W.id),Ae(`${pe} を${B}にしました`,`${Z.length}枠`),mt(),await te(y)}catch(B){Ae(B instanceof Error?B.message:"部分更新に失敗しました","エラー")}},ot=async(W,Z,ve,be)=>{if(be==="note"){await ht(W,null,void 0,ve);return}if(be==="approved"||be==="pending"||be==="done"){await ht(W,be);return}const Qe=Z?ve||Z.body:ve;await ht(W,"cancelled",Z?{rejectReason:Z.id,adminNote:Qe}:{adminNote:Qe})},st=async(W,Z,ve)=>{if(!Z||Z===W.date)return;const be=W.date;try{await Dx(W.id,Z,!!(ve!=null&&ve.forced)),Ie("move",`「${W.title}」を ${pl(be)} → ${pl(Z)} に変更（${yi[W.kind]}${ve!=null&&ve.forced?"・強制":""}）`,W.id),Ae(`${W.title} を ${zg(Z)} に変更しました`,ve!=null&&ve.forced?"強制":yi[W.kind]),A(Z),ne(null),mt(),await te(Z)}catch(Qe){Ae(Qe instanceof Error?Qe.message:"移動に失敗しました","エラー")}},lt=async W=>{try{await yx({name:W.name,homeroom:W.hr,student_number:W.num,discord_user_id:W.discord||null}),await he(),Ie("member",`担当者「${W.name}」を追加`,null),Ae(`${W.name} を追加しました`)}catch(Z){Ae(Z instanceof Error?Z.message:"追加に失敗しました","エラー")}},At=async(W,Z)=>{try{await Hx(W,A0(Z.color)),await Vx(W,Z.discord.trim()||null),await xx(W,Z.hubUserId),await he();try{D(await Dp())}catch{}const ve=Qr(W);Ie("member",`担当者「${ve?ve.name:W}」を更新`,null),Ae(`${Z.name} を更新しました`)}catch(ve){Ae(ve instanceof Error?ve.message:"更新に失敗しました","エラー")}},k=async W=>{try{const Z=Qr(W);await Sx(W),await he(),Ie("member",`担当者「${Z?Z.name:W}」を削除（シフトも削除）`,null),Ae(`${Z?Z.name:"担当者"} を削除しました`)}catch(Z){Ae(Z instanceof Error?Z.message:"削除に失敗しました","エラー")}},R=(W,Z,ve)=>{m(be=>{const Qe=new Set(be[W]||[]);Z.forEach(B=>ve?Qe.add(B):Qe.delete(B));const je={...be,[W]:[...Qe].sort()};return fl(je),je})},de=Mx($s(p),$s(f),[],[]),ge=Se.useMemo(()=>L0(p,f),[p,f]),Me=()=>{const W={};for(const[Z,ve]of Object.entries(p))W[Z]=[...ve];m(W),fl(W)},Ee=async()=>{if(!(!de||M)){w(!0);try{await Ex($s(p),$s(f),[],[]),g(()=>{const W={};for(const[Z,ve]of Object.entries(f))W[Z]=[...ve];return W}),Ie("shift","シフト表を一括保存",null),Ae("シフトを保存しました","確定")}catch(W){Ae(W instanceof Error?W.message:"シフト保存に失敗しました","エラー"),await he()}finally{w(!1)}}},qe=Se.useCallback(async(W,Z)=>{try{const ve=await Fp(W,Z),be=P0(x.current,_.current,ve.availability,W,Z);g(be.saved),m(be.avail),fl(be.avail)}catch(ve){_e.current(ve instanceof Error?ve.message:"シフト読込に失敗しました","エラー")}},[]),Le=async()=>{Ae("Discordへテスト送信しています…");try{await Fx(),Ie("integ","Discordへテスト通知を送信",null),Ae("Discordへ送信しました","成功")}catch(W){Ae(W instanceof Error?W.message:"送信に失敗しました","エラー")}},Pe=async W=>{const Z=await Ox(W),ve=Z.sent.map(be=>be.name).join("・");return Ie("integ",`Discordメンションテスト: ${ve}`,null),Z},it=async()=>{try{const W=await Tx();W.ok?(Ie("integ","Googleカレンダー接続テスト成功",null),Ae("Googleカレンダーに接続できました","接続OK")):Ae(W.error||"接続に失敗しました","エラー")}catch(W){Ae(W instanceof Error?W.message:"接続テストに失敗しました","エラー")}},Re=async W=>{const Z=await kx(W);return Ie("integ",`テストメールを ${Z.to} に送信`,null),Z},We=()=>{const W=Cg(zn(y)),Z=kl(W,27),ve=F0(l,Yn(W),Yn(Z),s.map(B=>({id:B.id,name:B.name}))),be=new Blob([ve],{type:"text/csv;charset=utf-8"}),Qe=URL.createObjectURL(be),je=document.createElement("a");je.href=Qe,je.download=`3dprint_${Yn(W)}_${Yn(Z)}.csv`,document.body.appendChild(je),je.click(),je.remove(),window.setTimeout(()=>URL.revokeObjectURL(Qe),1e3),Ae("CSVを書き出しました",`${Vp(W)}–${Vp(Z)}`)},at=i0(l);return e?d.jsx("main",{className:"main-content","data-testid":"management-loading",children:d.jsx(wg,{testId:"management-app-loading"})}):d.jsxs(d.Fragment,{children:[d.jsx(G0,{screen:E,setScreen:S,operatorSession:b,pendingCount:at.length,onCsv:We}),d.jsxs("main",{className:"main-content","data-testid":"management-app",children:[d.jsx("div",{className:"page-head",children:d.jsxs("div",{style:{minWidth:0},children:[d.jsx("span",{className:"badge",children:"自然科学部 3Dモデル班"}),d.jsx("h1",{className:"page-heading",children:E==="reserve"?"3Dプリント 申請の管理":E==="settings"?"シフト・担当者・外部連携":"運用（プリンター・履歴）"})]})}),E==="reserve"?d.jsx(N1,{apps:l,selected:y,onPick:A,onOpen:K,onApprove:W=>void ht(W,"approved"),onCancel:(W,Z,ve,be)=>void ot(W,Z,ve,be),onPartial:(W,Z,ve,be)=>void Ke(W,Z,ve,be),log:L,onDownload:(W,Z)=>{Z==="file"?window.open(`/api/3dprint/admin/stl/${W.id}`,"_blank"):z0(W,Z),Ae(`${W.title} をダウンロードしました`,Z==="file"?W.file:"申請書")},onDownloadAll:W=>{const Z=B0(l,W);Ae(`${pl(W)} の申請 ${Z}件を書き出しました`,"一括DL")},onMove:W=>ne(W)}):E==="settings"?d.jsx(k1,{members:s,avail:f,onAddMember:W=>void lt(W),onUpdateMember:(W,Z)=>void At(W,Z),onRemoveMember:W=>void k(W),onPaintAvail:R,shiftDraftPending:de,shiftDraftSummary:ge,shiftApplying:M,onConfirmShiftDraft:()=>void Ee(),onDiscardShiftDraft:Me,onLoadShiftMonth:qe,integrations:$,setIntegrations:U,onTestDiscord:()=>void Le(),onTestDiscordMention:Pe,onTestGcal:()=>void it(),onTestEmail:Re,emailConfigured:re,discordConfigured:O,log:L,pendingPre:ue}):d.jsx(Y1,{showToast:Ae})]}),d.jsx("footer",{className:"site-footer",children:d.jsxs("div",{className:"footer-inner",children:[d.jsx("img",{src:jg,alt:""}),d.jsxs("div",{className:"club",children:[d.jsx("b",{children:"松山南高校 自然科学部 / 3Dモデル班"}),d.jsx("span",{children:"承認・取り消しは担当者のみ。操作は記録されます。"})]}),d.jsxs("div",{className:"right",children:[d.jsx("a",{href:"/apps/3dprint-reservation/",children:"申請フォーム（生徒用）"}),d.jsx("a",{href:"mailto:diorama@mmh-virtual.jp",children:"diorama@mmh-virtual.jp"})]})]})}),d.jsx(R1,{app:N,log:L,onClose:mt,onPartial:(W,Z,ve,be)=>void Ke(W,Z,ve,be),onCancelAll:(W,Z,ve,be)=>void ot(W,Z,ve,be),onMove:W=>ne(W)}),d.jsx(L1,{open:!!z,app:z,apps:l,onClose:()=>ne(null),onMove:st}),d.jsx(K0,{toast:Y})]})}function Z1(){const[r,e]=Se.useState(!1),[t,s]=Se.useState(!1);return Se.useEffect(()=>{(async()=>{const o=await hx();if(o==="login"){const l=encodeURIComponent(window.location.pathname+window.location.search);window.location.href=`/login/?next=${l}`;return}if(o==="denied"){s(!0);return}e(!0)})()},[]),t?d.jsxs("main",{style:{padding:"2rem",fontFamily:"Inter, sans-serif"},children:[d.jsx("h1",{children:"アクセス拒否"}),d.jsx("p",{children:"3D印刷管理アプリを利用する権限がありません。"}),d.jsx("p",{children:d.jsx("a",{href:"/",children:"ダッシュボードに戻る"})})]}):r?d.jsx(K1,{}):d.jsx("main",{className:"main-content","data-testid":"management-access-loading",children:d.jsx(wg,{})})}document.body.classList.add("admin-app");dx.createRoot(document.getElementById("root")).render(d.jsx(Se.StrictMode,{children:d.jsx(Z1,{})}));
