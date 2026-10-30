var rx=Object.defineProperty;var sx=(r,e,t)=>e in r?rx(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Ha=(r,e,t)=>sx(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function ax(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var zu={exports:{}},Va={},Bu={exports:{}},mt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wp;function ox(){if(wp)return mt;wp=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),d=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),_=Symbol.iterator;function y(O){return O===null||typeof O!="object"?null:(O=_&&O[_]||O["@@iterator"],typeof O=="function"?O:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,w={};function S(O,ie,De){this.props=O,this.context=ie,this.refs=w,this.updater=De||M}S.prototype.isReactComponent={},S.prototype.setState=function(O,ie){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,ie,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function x(){}x.prototype=S.prototype;function L(O,ie,De){this.props=O,this.context=ie,this.refs=w,this.updater=De||M}var N=L.prototype=new x;N.constructor=L,E(N,S.prototype),N.isPureReactComponent=!0;var U=Array.isArray,Y=Object.prototype.hasOwnProperty,I={current:null},k={key:!0,ref:!0,__self:!0,__source:!0};function $(O,ie,De){var Q,pe={},Me=null,ve=null;if(ie!=null)for(Q in ie.ref!==void 0&&(ve=ie.ref),ie.key!==void 0&&(Me=""+ie.key),ie)Y.call(ie,Q)&&!k.hasOwnProperty(Q)&&(pe[Q]=ie[Q]);var Le=arguments.length-2;if(Le===1)pe.children=De;else if(1<Le){for(var Fe=Array(Le),Z=0;Z<Le;Z++)Fe[Z]=arguments[Z+2];pe.children=Fe}if(O&&O.defaultProps)for(Q in Le=O.defaultProps,Le)pe[Q]===void 0&&(pe[Q]=Le[Q]);return{$$typeof:r,type:O,key:Me,ref:ve,props:pe,_owner:I.current}}function R(O,ie){return{$$typeof:r,type:O.type,key:ie,ref:O.ref,props:O.props,_owner:O._owner}}function A(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function D(O){var ie={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(De){return ie[De]})}var W=/\/+/g;function j(O,ie){return typeof O=="object"&&O!==null&&O.key!=null?D(""+O.key):ie.toString(36)}function te(O,ie,De,Q,pe){var Me=typeof O;(Me==="undefined"||Me==="boolean")&&(O=null);var ve=!1;if(O===null)ve=!0;else switch(Me){case"string":case"number":ve=!0;break;case"object":switch(O.$$typeof){case r:case e:ve=!0}}if(ve)return ve=O,pe=pe(ve),O=Q===""?"."+j(ve,0):Q,U(pe)?(De="",O!=null&&(De=O.replace(W,"$&/")+"/"),te(pe,ie,De,"",function(Z){return Z})):pe!=null&&(A(pe)&&(pe=R(pe,De+(!pe.key||ve&&ve.key===pe.key?"":(""+pe.key).replace(W,"$&/")+"/")+O)),ie.push(pe)),1;if(ve=0,Q=Q===""?".":Q+":",U(O))for(var Le=0;Le<O.length;Le++){Me=O[Le];var Fe=Q+j(Me,Le);ve+=te(Me,ie,De,Fe,pe)}else if(Fe=y(O),typeof Fe=="function")for(O=Fe.call(O),Le=0;!(Me=O.next()).done;)Me=Me.value,Fe=Q+j(Me,Le++),ve+=te(Me,ie,De,Fe,pe);else if(Me==="object")throw ie=String(O),Error("Objects are not valid as a React child (found: "+(ie==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":ie)+"). If you meant to render a collection of children, use an array instead.");return ve}function oe(O,ie,De){if(O==null)return O;var Q=[],pe=0;return te(O,Q,"","",function(Me){return ie.call(De,Me,pe++)}),Q}function he(O){if(O._status===-1){var ie=O._result;ie=ie(),ie.then(function(De){(O._status===0||O._status===-1)&&(O._status=1,O._result=De)},function(De){(O._status===0||O._status===-1)&&(O._status=2,O._result=De)}),O._status===-1&&(O._status=0,O._result=ie)}if(O._status===1)return O._result.default;throw O._result}var de={current:null},H={transition:null},B={ReactCurrentDispatcher:de,ReactCurrentBatchConfig:H,ReactCurrentOwner:I};function K(){throw Error("act(...) is not supported in production builds of React.")}return mt.Children={map:oe,forEach:function(O,ie,De){oe(O,function(){ie.apply(this,arguments)},De)},count:function(O){var ie=0;return oe(O,function(){ie++}),ie},toArray:function(O){return oe(O,function(ie){return ie})||[]},only:function(O){if(!A(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},mt.Component=S,mt.Fragment=t,mt.Profiler=o,mt.PureComponent=L,mt.StrictMode=s,mt.Suspense=m,mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=B,mt.act=K,mt.cloneElement=function(O,ie,De){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var Q=E({},O.props),pe=O.key,Me=O.ref,ve=O._owner;if(ie!=null){if(ie.ref!==void 0&&(Me=ie.ref,ve=I.current),ie.key!==void 0&&(pe=""+ie.key),O.type&&O.type.defaultProps)var Le=O.type.defaultProps;for(Fe in ie)Y.call(ie,Fe)&&!k.hasOwnProperty(Fe)&&(Q[Fe]=ie[Fe]===void 0&&Le!==void 0?Le[Fe]:ie[Fe])}var Fe=arguments.length-2;if(Fe===1)Q.children=De;else if(1<Fe){Le=Array(Fe);for(var Z=0;Z<Fe;Z++)Le[Z]=arguments[Z+2];Q.children=Le}return{$$typeof:r,type:O.type,key:pe,ref:Me,props:Q,_owner:ve}},mt.createContext=function(O){return O={$$typeof:d,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},mt.createElement=$,mt.createFactory=function(O){var ie=$.bind(null,O);return ie.type=O,ie},mt.createRef=function(){return{current:null}},mt.forwardRef=function(O){return{$$typeof:u,render:O}},mt.isValidElement=A,mt.lazy=function(O){return{$$typeof:g,_payload:{_status:-1,_result:O},_init:he}},mt.memo=function(O,ie){return{$$typeof:p,type:O,compare:ie===void 0?null:ie}},mt.startTransition=function(O){var ie=H.transition;H.transition={};try{O()}finally{H.transition=ie}},mt.unstable_act=K,mt.useCallback=function(O,ie){return de.current.useCallback(O,ie)},mt.useContext=function(O){return de.current.useContext(O)},mt.useDebugValue=function(){},mt.useDeferredValue=function(O){return de.current.useDeferredValue(O)},mt.useEffect=function(O,ie){return de.current.useEffect(O,ie)},mt.useId=function(){return de.current.useId()},mt.useImperativeHandle=function(O,ie,De){return de.current.useImperativeHandle(O,ie,De)},mt.useInsertionEffect=function(O,ie){return de.current.useInsertionEffect(O,ie)},mt.useLayoutEffect=function(O,ie){return de.current.useLayoutEffect(O,ie)},mt.useMemo=function(O,ie){return de.current.useMemo(O,ie)},mt.useReducer=function(O,ie,De){return de.current.useReducer(O,ie,De)},mt.useRef=function(O){return de.current.useRef(O)},mt.useState=function(O){return de.current.useState(O)},mt.useSyncExternalStore=function(O,ie,De){return de.current.useSyncExternalStore(O,ie,De)},mt.useTransition=function(){return de.current.useTransition()},mt.version="18.3.1",mt}var Tp;function Od(){return Tp||(Tp=1,Bu.exports=ox()),Bu.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ap;function lx(){if(Ap)return Va;Ap=1;var r=Od(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function d(u,m,p){var g,_={},y=null,M=null;p!==void 0&&(y=""+p),m.key!==void 0&&(y=""+m.key),m.ref!==void 0&&(M=m.ref);for(g in m)s.call(m,g)&&!l.hasOwnProperty(g)&&(_[g]=m[g]);if(u&&u.defaultProps)for(g in m=u.defaultProps,m)_[g]===void 0&&(_[g]=m[g]);return{$$typeof:e,type:u,key:y,ref:M,props:_,_owner:o.current}}return Va.Fragment=t,Va.jsx=d,Va.jsxs=d,Va}var bp;function cx(){return bp||(bp=1,zu.exports=lx()),zu.exports}var f=cx(),ux=Od();const me=ax(ux);var cl={},ju={exports:{}},bn={},Hu={exports:{}},Vu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cp;function dx(){return Cp||(Cp=1,(function(r){function e(H,B){var K=H.length;H.push(B);e:for(;0<K;){var O=K-1>>>1,ie=H[O];if(0<o(ie,B))H[O]=B,H[K]=ie,K=O;else break e}}function t(H){return H.length===0?null:H[0]}function s(H){if(H.length===0)return null;var B=H[0],K=H.pop();if(K!==B){H[0]=K;e:for(var O=0,ie=H.length,De=ie>>>1;O<De;){var Q=2*(O+1)-1,pe=H[Q],Me=Q+1,ve=H[Me];if(0>o(pe,K))Me<ie&&0>o(ve,pe)?(H[O]=ve,H[Me]=K,O=Me):(H[O]=pe,H[Q]=K,O=Q);else if(Me<ie&&0>o(ve,K))H[O]=ve,H[Me]=K,O=Me;else break e}}return B}function o(H,B){var K=H.sortIndex-B.sortIndex;return K!==0?K:H.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var d=Date,u=d.now();r.unstable_now=function(){return d.now()-u}}var m=[],p=[],g=1,_=null,y=3,M=!1,E=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function N(H){for(var B=t(p);B!==null;){if(B.callback===null)s(p);else if(B.startTime<=H)s(p),B.sortIndex=B.expirationTime,e(m,B);else break;B=t(p)}}function U(H){if(w=!1,N(H),!E)if(t(m)!==null)E=!0,he(Y);else{var B=t(p);B!==null&&de(U,B.startTime-H)}}function Y(H,B){E=!1,w&&(w=!1,x($),$=-1),M=!0;var K=y;try{for(N(B),_=t(m);_!==null&&(!(_.expirationTime>B)||H&&!D());){var O=_.callback;if(typeof O=="function"){_.callback=null,y=_.priorityLevel;var ie=O(_.expirationTime<=B);B=r.unstable_now(),typeof ie=="function"?_.callback=ie:_===t(m)&&s(m),N(B)}else s(m);_=t(m)}if(_!==null)var De=!0;else{var Q=t(p);Q!==null&&de(U,Q.startTime-B),De=!1}return De}finally{_=null,y=K,M=!1}}var I=!1,k=null,$=-1,R=5,A=-1;function D(){return!(r.unstable_now()-A<R)}function W(){if(k!==null){var H=r.unstable_now();A=H;var B=!0;try{B=k(!0,H)}finally{B?j():(I=!1,k=null)}}else I=!1}var j;if(typeof L=="function")j=function(){L(W)};else if(typeof MessageChannel<"u"){var te=new MessageChannel,oe=te.port2;te.port1.onmessage=W,j=function(){oe.postMessage(null)}}else j=function(){S(W,0)};function he(H){k=H,I||(I=!0,j())}function de(H,B){$=S(function(){H(r.unstable_now())},B)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(H){H.callback=null},r.unstable_continueExecution=function(){E||M||(E=!0,he(Y))},r.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<H?Math.floor(1e3/H):5},r.unstable_getCurrentPriorityLevel=function(){return y},r.unstable_getFirstCallbackNode=function(){return t(m)},r.unstable_next=function(H){switch(y){case 1:case 2:case 3:var B=3;break;default:B=y}var K=y;y=B;try{return H()}finally{y=K}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(H,B){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var K=y;y=H;try{return B()}finally{y=K}},r.unstable_scheduleCallback=function(H,B,K){var O=r.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?O+K:O):K=O,H){case 1:var ie=-1;break;case 2:ie=250;break;case 5:ie=1073741823;break;case 4:ie=1e4;break;default:ie=5e3}return ie=K+ie,H={id:g++,callback:B,priorityLevel:H,startTime:K,expirationTime:ie,sortIndex:-1},K>O?(H.sortIndex=K,e(p,H),t(m)===null&&H===t(p)&&(w?(x($),$=-1):w=!0,de(U,K-O))):(H.sortIndex=ie,e(m,H),E||M||(E=!0,he(Y))),H},r.unstable_shouldYield=D,r.unstable_wrapCallback=function(H){var B=y;return function(){var K=y;y=B;try{return H.apply(this,arguments)}finally{y=K}}}})(Vu)),Vu}var Rp;function fx(){return Rp||(Rp=1,Hu.exports=dx()),Hu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Np;function hx(){if(Np)return bn;Np=1;var r=Od(),e=fx();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){d(n,i),d(n+"Capture",i)}function d(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var u=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),m=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},_={};function y(n){return m.call(_,n)?!0:m.call(g,n)?!1:p.test(n)?_[n]=!0:(g[n]=!0,!1)}function M(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function E(n,i,a,c){if(i===null||typeof i>"u"||M(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(n,i,a,c,h,v,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=v,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new w(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function L(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(x,L);S[i]=new w(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(x,L);S[i]=new w(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(x,L);S[i]=new w(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function N(n,i,a,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,a,h,c)&&(a=null),c||h===null?y(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):h.mustUseProperty?n[h.propertyName]=a===null?h.type===3?!1:"":a:(i=h.attributeName,c=h.attributeNamespace,a===null?n.removeAttribute(i):(h=h.type,a=h===3||h===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var U=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Y=Symbol.for("react.element"),I=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),$=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),A=Symbol.for("react.provider"),D=Symbol.for("react.context"),W=Symbol.for("react.forward_ref"),j=Symbol.for("react.suspense"),te=Symbol.for("react.suspense_list"),oe=Symbol.for("react.memo"),he=Symbol.for("react.lazy"),de=Symbol.for("react.offscreen"),H=Symbol.iterator;function B(n){return n===null||typeof n!="object"?null:(n=H&&n[H]||n["@@iterator"],typeof n=="function"?n:null)}var K=Object.assign,O;function ie(n){if(O===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var De=!1;function Q(n,i){if(!n||De)return"";De=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(ae){var c=ae}Reflect.construct(n,[],i)}else{try{i.call()}catch(ae){c=ae}n.call(i.prototype)}else{try{throw Error()}catch(ae){c=ae}n()}}catch(ae){if(ae&&c&&typeof ae.stack=="string"){for(var h=ae.stack.split(`
`),v=c.stack.split(`
`),T=h.length-1,F=v.length-1;1<=T&&0<=F&&h[T]!==v[F];)F--;for(;1<=T&&0<=F;T--,F--)if(h[T]!==v[F]){if(T!==1||F!==1)do if(T--,F--,0>F||h[T]!==v[F]){var G=`
`+h[T].replace(" at new "," at ");return n.displayName&&G.includes("<anonymous>")&&(G=G.replace("<anonymous>",n.displayName)),G}while(1<=T&&0<=F);break}}}finally{De=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?ie(n):""}function pe(n){switch(n.tag){case 5:return ie(n.type);case 16:return ie("Lazy");case 13:return ie("Suspense");case 19:return ie("SuspenseList");case 0:case 2:case 15:return n=Q(n.type,!1),n;case 11:return n=Q(n.type.render,!1),n;case 1:return n=Q(n.type,!0),n;default:return""}}function Me(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case k:return"Fragment";case I:return"Portal";case R:return"Profiler";case $:return"StrictMode";case j:return"Suspense";case te:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case D:return(n.displayName||"Context")+".Consumer";case A:return(n._context.displayName||"Context")+".Provider";case W:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case oe:return i=n.displayName||null,i!==null?i:Me(n.type)||"Memo";case he:i=n._payload,n=n._init;try{return Me(n(i))}catch{}}return null}function ve(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Me(i);case 8:return i===$?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Le(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Fe(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Z(n){var i=Fe(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,v=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(T){c=""+T,v.call(this,T)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function gt(n){n._valueTracker||(n._valueTracker=Z(n))}function Ae(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=Fe(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function nt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Xe(n,i){var a=i.checked;return K({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function lt(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Le(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function it(n,i){i=i.checked,i!=null&&N(n,"checked",i,!1)}function ot(n,i){it(n,i);var a=Le(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?z(n,i.type,a):i.hasOwnProperty("defaultValue")&&z(n,i.type,Le(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Tt(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function z(n,i,a){(i!=="number"||nt(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var C=Array.isArray;function ce(n,i,a,c){if(n=n.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<n.length;a++)h=i.hasOwnProperty("$"+n[a].value),n[a].selected!==h&&(n[a].selected=h),h&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Le(a),i=null,h=0;h<n.length;h++){if(n[h].value===a){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function ge(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return K({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Se(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(C(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:Le(a)}}function Ee(n,i){var a=Le(i.value),c=Le(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function We(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function Re(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ce(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?Re(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var tt,be=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(tt=tt||document.createElement("div"),tt.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=tt.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function He(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var ct={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qe=["Webkit","ms","Moz","O"];Object.keys(ct).forEach(function(n){qe.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),ct[i]=ct[n]})});function Ie(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||ct.hasOwnProperty(n)&&ct[n]?(""+i).trim():i+"px"}function st(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,h=Ie(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,h):n[a]=h}}var ht=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function bt(n,i){if(i){if(ht[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function rt(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var b=null;function V(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var q=null,fe=null,_e=null;function Ye(n){if(n=ba(n)){if(typeof q!="function")throw Error(t(280));var i=n.stateNode;i&&(i=wo(i),q(n.stateNode,n.type,i))}}function $e(n){fe?_e?_e.push(n):_e=[n]:fe=n}function pt(){if(fe){var n=fe,i=_e;if(_e=fe=null,Ye(n),i)for(n=0;n<i.length;n++)Ye(i[n])}}function Vt(n,i){return n(i)}function St(){}var Sn=!1;function Zt(n,i,a){if(Sn)return n(i,a);Sn=!0;try{return Vt(n,i,a)}finally{Sn=!1,(fe!==null||_e!==null)&&(St(),pt())}}function Vi(n,i){var a=n.stateNode;if(a===null)return null;var c=wo(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var is=!1;if(u)try{var Gi={};Object.defineProperty(Gi,"passive",{get:function(){is=!0}}),window.addEventListener("test",Gi,Gi),window.removeEventListener("test",Gi,Gi)}catch{is=!1}function rs(n,i,a,c,h,v,T,F,G){var ae=Array.prototype.slice.call(arguments,3);try{i.apply(a,ae)}catch(ye){this.onError(ye)}}var Wi=!1,Mi=null,Ar=!1,ss=null,ic={onError:function(n){Wi=!0,Mi=n}};function rc(n,i,a,c,h,v,T,F,G){Wi=!1,Mi=null,rs.apply(ic,arguments)}function sc(n,i,a,c,h,v,T,F,G){if(rc.apply(this,arguments),Wi){if(Wi){var ae=Mi;Wi=!1,Mi=null}else throw Error(t(198));Ar||(Ar=!0,ss=ae)}}function P(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function J(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function ue(n){if(P(n)!==n)throw Error(t(188))}function se(n){var i=n.alternate;if(!i){if(i=P(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var h=a.return;if(h===null)break;var v=h.alternate;if(v===null){if(c=h.return,c!==null){a=c;continue}break}if(h.child===v.child){for(v=h.child;v;){if(v===a)return ue(h),n;if(v===c)return ue(h),i;v=v.sibling}throw Error(t(188))}if(a.return!==c.return)a=h,c=v;else{for(var T=!1,F=h.child;F;){if(F===a){T=!0,a=h,c=v;break}if(F===c){T=!0,c=h,a=v;break}F=F.sibling}if(!T){for(F=v.child;F;){if(F===a){T=!0,a=v,c=h;break}if(F===c){T=!0,c=v,a=h;break}F=F.sibling}if(!T)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function re(n){return n=se(n),n!==null?Ne(n):null}function Ne(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Ne(n);if(i!==null)return i;n=n.sibling}return null}var je=e.unstable_scheduleCallback,Ge=e.unstable_cancelCallback,Je=e.unstable_shouldYield,at=e.unstable_requestPaint,ze=e.unstable_now,ut=e.unstable_getCurrentPriorityLevel,Dt=e.unstable_ImmediatePriority,Gt=e.unstable_UserBlockingPriority,Jt=e.unstable_NormalPriority,Zn=e.unstable_LowPriority,vt=e.unstable_IdlePriority,Qe=null,ln=null;function Ct(n){if(ln&&typeof ln.onCommitFiberRoot=="function")try{ln.onCommitFiberRoot(Qe,n,void 0,(n.current.flags&128)===128)}catch{}}var Wt=Math.clz32?Math.clz32:la,oo=Math.log,br=Math.LN2;function la(n){return n>>>=0,n===0?32:31-(oo(n)/br|0)|0}var kt=64,Ln=4194304;function Ei(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function sn(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,h=n.suspendedLanes,v=n.pingedLanes,T=a&268435455;if(T!==0){var F=T&~h;F!==0?c=Ei(F):(v&=T,v!==0&&(c=Ei(v)))}else T=a&~h,T!==0?c=Ei(T):v!==0&&(c=Ei(v));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,v=i&-i,h>=v||h===16&&(v&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Wt(i),h=1<<a,c|=n[a],i&=~h;return c}function ca(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ac(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,v=n.pendingLanes;0<v;){var T=31-Wt(v),F=1<<T,G=h[T];G===-1?((F&a)===0||(F&c)!==0)&&(h[T]=ca(F,i)):G<=i&&(n.expiredLanes|=F),v&=~F}}function as(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function ef(){var n=kt;return kt<<=1,(kt&4194240)===0&&(kt=64),n}function oc(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function ua(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Wt(i),n[i]=a}function Tv(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var h=31-Wt(a),v=1<<h;i[h]=0,c[h]=-1,n[h]=-1,a&=~v}}function lc(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Wt(a),h=1<<c;h&i|n[c]&i&&(n[c]|=i),a&=~h}}var wt=0;function tf(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var nf,cc,rf,sf,af,uc=!1,lo=[],$i=null,Xi=null,qi=null,da=new Map,fa=new Map,Yi=[],Av="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function of(n,i){switch(n){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":qi=null;break;case"pointerover":case"pointerout":da.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":fa.delete(i.pointerId)}}function ha(n,i,a,c,h,v){return n===null||n.nativeEvent!==v?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:v,targetContainers:[h]},i!==null&&(i=ba(i),i!==null&&cc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function bv(n,i,a,c,h){switch(i){case"focusin":return $i=ha($i,n,i,a,c,h),!0;case"dragenter":return Xi=ha(Xi,n,i,a,c,h),!0;case"mouseover":return qi=ha(qi,n,i,a,c,h),!0;case"pointerover":var v=h.pointerId;return da.set(v,ha(da.get(v)||null,n,i,a,c,h)),!0;case"gotpointercapture":return v=h.pointerId,fa.set(v,ha(fa.get(v)||null,n,i,a,c,h)),!0}return!1}function lf(n){var i=Cr(n.target);if(i!==null){var a=P(i);if(a!==null){if(i=a.tag,i===13){if(i=J(a),i!==null){n.blockedOn=i,af(n.priority,function(){rf(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function co(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=fc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);b=c,a.target.dispatchEvent(c),b=null}else return i=ba(a),i!==null&&cc(i),n.blockedOn=a,!1;i.shift()}return!0}function cf(n,i,a){co(n)&&a.delete(i)}function Cv(){uc=!1,$i!==null&&co($i)&&($i=null),Xi!==null&&co(Xi)&&(Xi=null),qi!==null&&co(qi)&&(qi=null),da.forEach(cf),fa.forEach(cf)}function pa(n,i){n.blockedOn===i&&(n.blockedOn=null,uc||(uc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Cv)))}function ma(n){function i(h){return pa(h,n)}if(0<lo.length){pa(lo[0],n);for(var a=1;a<lo.length;a++){var c=lo[a];c.blockedOn===n&&(c.blockedOn=null)}}for($i!==null&&pa($i,n),Xi!==null&&pa(Xi,n),qi!==null&&pa(qi,n),da.forEach(i),fa.forEach(i),a=0;a<Yi.length;a++)c=Yi[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Yi.length&&(a=Yi[0],a.blockedOn===null);)lf(a),a.blockedOn===null&&Yi.shift()}var os=U.ReactCurrentBatchConfig,uo=!0;function Rv(n,i,a,c){var h=wt,v=os.transition;os.transition=null;try{wt=1,dc(n,i,a,c)}finally{wt=h,os.transition=v}}function Nv(n,i,a,c){var h=wt,v=os.transition;os.transition=null;try{wt=4,dc(n,i,a,c)}finally{wt=h,os.transition=v}}function dc(n,i,a,c){if(uo){var h=fc(n,i,a,c);if(h===null)Rc(n,i,c,fo,a),of(n,c);else if(bv(h,n,i,a,c))c.stopPropagation();else if(of(n,c),i&4&&-1<Av.indexOf(n)){for(;h!==null;){var v=ba(h);if(v!==null&&nf(v),v=fc(n,i,a,c),v===null&&Rc(n,i,c,fo,a),v===h)break;h=v}h!==null&&c.stopPropagation()}else Rc(n,i,c,null,a)}}var fo=null;function fc(n,i,a,c){if(fo=null,n=V(c),n=Cr(n),n!==null)if(i=P(n),i===null)n=null;else if(a=i.tag,a===13){if(n=J(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return fo=n,null}function uf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ut()){case Dt:return 1;case Gt:return 4;case Jt:case Zn:return 16;case vt:return 536870912;default:return 16}default:return 16}}var Ki=null,hc=null,ho=null;function df(){if(ho)return ho;var n,i=hc,a=i.length,c,h="value"in Ki?Ki.value:Ki.textContent,v=h.length;for(n=0;n<a&&i[n]===h[n];n++);var T=a-n;for(c=1;c<=T&&i[a-c]===h[v-c];c++);return ho=h.slice(n,1<c?1-c:void 0)}function po(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function mo(){return!0}function ff(){return!1}function Dn(n){function i(a,c,h,v,T){this._reactName=a,this._targetInst=h,this.type=c,this.nativeEvent=v,this.target=T,this.currentTarget=null;for(var F in n)n.hasOwnProperty(F)&&(a=n[F],this[F]=a?a(v):v[F]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?mo:ff,this.isPropagationStopped=ff,this}return K(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=mo)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=mo)},persist:function(){},isPersistent:mo}),i}var ls={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},pc=Dn(ls),ga=K({},ls,{view:0,detail:0}),Pv=Dn(ga),mc,gc,va,go=K({},ga,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_c,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==va&&(va&&n.type==="mousemove"?(mc=n.screenX-va.screenX,gc=n.screenY-va.screenY):gc=mc=0,va=n),mc)},movementY:function(n){return"movementY"in n?n.movementY:gc}}),hf=Dn(go),Lv=K({},go,{dataTransfer:0}),Dv=Dn(Lv),Uv=K({},ga,{relatedTarget:0}),vc=Dn(Uv),Iv=K({},ls,{animationName:0,elapsedTime:0,pseudoElement:0}),Fv=Dn(Iv),Ov=K({},ls,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),kv=Dn(Ov),zv=K({},ls,{data:0}),pf=Dn(zv),Bv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},jv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Hv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vv(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Hv[n])?!!i[n]:!1}function _c(){return Vv}var Gv=K({},ga,{key:function(n){if(n.key){var i=Bv[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=po(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?jv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_c,charCode:function(n){return n.type==="keypress"?po(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?po(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Wv=Dn(Gv),$v=K({},go,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),mf=Dn($v),Xv=K({},ga,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_c}),qv=Dn(Xv),Yv=K({},ls,{propertyName:0,elapsedTime:0,pseudoElement:0}),Kv=Dn(Yv),Zv=K({},go,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Jv=Dn(Zv),Qv=[9,13,27,32],xc=u&&"CompositionEvent"in window,_a=null;u&&"documentMode"in document&&(_a=document.documentMode);var e_=u&&"TextEvent"in window&&!_a,gf=u&&(!xc||_a&&8<_a&&11>=_a),vf=" ",_f=!1;function xf(n,i){switch(n){case"keyup":return Qv.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function yf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var cs=!1;function t_(n,i){switch(n){case"compositionend":return yf(i);case"keypress":return i.which!==32?null:(_f=!0,vf);case"textInput":return n=i.data,n===vf&&_f?null:n;default:return null}}function n_(n,i){if(cs)return n==="compositionend"||!xc&&xf(n,i)?(n=df(),ho=hc=Ki=null,cs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return gf&&i.locale!=="ko"?null:i.data;default:return null}}var i_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Sf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!i_[n.type]:i==="textarea"}function Mf(n,i,a,c){$e(c),i=So(i,"onChange"),0<i.length&&(a=new pc("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var xa=null,ya=null;function r_(n){Bf(n,0)}function vo(n){var i=ps(n);if(Ae(i))return n}function s_(n,i){if(n==="change")return i}var Ef=!1;if(u){var yc;if(u){var Sc="oninput"in document;if(!Sc){var wf=document.createElement("div");wf.setAttribute("oninput","return;"),Sc=typeof wf.oninput=="function"}yc=Sc}else yc=!1;Ef=yc&&(!document.documentMode||9<document.documentMode)}function Tf(){xa&&(xa.detachEvent("onpropertychange",Af),ya=xa=null)}function Af(n){if(n.propertyName==="value"&&vo(ya)){var i=[];Mf(i,ya,n,V(n)),Zt(r_,i)}}function a_(n,i,a){n==="focusin"?(Tf(),xa=i,ya=a,xa.attachEvent("onpropertychange",Af)):n==="focusout"&&Tf()}function o_(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return vo(ya)}function l_(n,i){if(n==="click")return vo(i)}function c_(n,i){if(n==="input"||n==="change")return vo(i)}function u_(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Jn=typeof Object.is=="function"?Object.is:u_;function Sa(n,i){if(Jn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var h=a[c];if(!m.call(i,h)||!Jn(n[h],i[h]))return!1}return!0}function bf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Cf(n,i){var a=bf(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=bf(a)}}function Rf(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Rf(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function Nf(){for(var n=window,i=nt();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=nt(n.document)}return i}function Mc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function d_(n){var i=Nf(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Rf(a.ownerDocument.documentElement,a)){if(c!==null&&Mc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=a.textContent.length,v=Math.min(c.start,h);c=c.end===void 0?v:Math.min(c.end,h),!n.extend&&v>c&&(h=c,c=v,v=h),h=Cf(a,v);var T=Cf(a,c);h&&T&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),v>c?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var f_=u&&"documentMode"in document&&11>=document.documentMode,us=null,Ec=null,Ma=null,wc=!1;function Pf(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;wc||us==null||us!==nt(c)||(c=us,"selectionStart"in c&&Mc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ma&&Sa(Ma,c)||(Ma=c,c=So(Ec,"onSelect"),0<c.length&&(i=new pc("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=us)))}function _o(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var ds={animationend:_o("Animation","AnimationEnd"),animationiteration:_o("Animation","AnimationIteration"),animationstart:_o("Animation","AnimationStart"),transitionend:_o("Transition","TransitionEnd")},Tc={},Lf={};u&&(Lf=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function xo(n){if(Tc[n])return Tc[n];if(!ds[n])return n;var i=ds[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in Lf)return Tc[n]=i[a];return n}var Df=xo("animationend"),Uf=xo("animationiteration"),If=xo("animationstart"),Ff=xo("transitionend"),Of=new Map,kf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zi(n,i){Of.set(n,i),l(i,[n])}for(var Ac=0;Ac<kf.length;Ac++){var bc=kf[Ac],h_=bc.toLowerCase(),p_=bc[0].toUpperCase()+bc.slice(1);Zi(h_,"on"+p_)}Zi(Df,"onAnimationEnd"),Zi(Uf,"onAnimationIteration"),Zi(If,"onAnimationStart"),Zi("dblclick","onDoubleClick"),Zi("focusin","onFocus"),Zi("focusout","onBlur"),Zi(Ff,"onTransitionEnd"),d("onMouseEnter",["mouseout","mouseover"]),d("onMouseLeave",["mouseout","mouseover"]),d("onPointerEnter",["pointerout","pointerover"]),d("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),m_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ea));function zf(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,sc(c,i,void 0,n),n.currentTarget=null}function Bf(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],h=c.event;c=c.listeners;e:{var v=void 0;if(i)for(var T=c.length-1;0<=T;T--){var F=c[T],G=F.instance,ae=F.currentTarget;if(F=F.listener,G!==v&&h.isPropagationStopped())break e;zf(h,F,ae),v=G}else for(T=0;T<c.length;T++){if(F=c[T],G=F.instance,ae=F.currentTarget,F=F.listener,G!==v&&h.isPropagationStopped())break e;zf(h,F,ae),v=G}}}if(Ar)throw n=ss,Ar=!1,ss=null,n}function Nt(n,i){var a=i[Ic];a===void 0&&(a=i[Ic]=new Set);var c=n+"__bubble";a.has(c)||(jf(i,n,2,!1),a.add(c))}function Cc(n,i,a){var c=0;i&&(c|=4),jf(a,n,c,i)}var yo="_reactListening"+Math.random().toString(36).slice(2);function wa(n){if(!n[yo]){n[yo]=!0,s.forEach(function(a){a!=="selectionchange"&&(m_.has(a)||Cc(a,!1,n),Cc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[yo]||(i[yo]=!0,Cc("selectionchange",!1,i))}}function jf(n,i,a,c){switch(uf(i)){case 1:var h=Rv;break;case 4:h=Nv;break;default:h=dc}a=h.bind(null,i,a,n),h=void 0,!is||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,a,{capture:!0,passive:h}):n.addEventListener(i,a,!0):h!==void 0?n.addEventListener(i,a,{passive:h}):n.addEventListener(i,a,!1)}function Rc(n,i,a,c,h){var v=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var F=c.stateNode.containerInfo;if(F===h||F.nodeType===8&&F.parentNode===h)break;if(T===4)for(T=c.return;T!==null;){var G=T.tag;if((G===3||G===4)&&(G=T.stateNode.containerInfo,G===h||G.nodeType===8&&G.parentNode===h))return;T=T.return}for(;F!==null;){if(T=Cr(F),T===null)return;if(G=T.tag,G===5||G===6){c=v=T;continue e}F=F.parentNode}}c=c.return}Zt(function(){var ae=v,ye=V(a),we=[];e:{var xe=Of.get(n);if(xe!==void 0){var Ue=pc,ke=n;switch(n){case"keypress":if(po(a)===0)break e;case"keydown":case"keyup":Ue=Wv;break;case"focusin":ke="focus",Ue=vc;break;case"focusout":ke="blur",Ue=vc;break;case"beforeblur":case"afterblur":Ue=vc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Ue=hf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Ue=Dv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Ue=qv;break;case Df:case Uf:case If:Ue=Fv;break;case Ff:Ue=Kv;break;case"scroll":Ue=Pv;break;case"wheel":Ue=Jv;break;case"copy":case"cut":case"paste":Ue=kv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Ue=mf}var Be=(i&4)!==0,zt=!Be&&n==="scroll",ee=Be?xe!==null?xe+"Capture":null:xe;Be=[];for(var X=ae,ne;X!==null;){ne=X;var Te=ne.stateNode;if(ne.tag===5&&Te!==null&&(ne=Te,ee!==null&&(Te=Vi(X,ee),Te!=null&&Be.push(Ta(X,Te,ne)))),zt)break;X=X.return}0<Be.length&&(xe=new Ue(xe,ke,null,a,ye),we.push({event:xe,listeners:Be}))}}if((i&7)===0){e:{if(xe=n==="mouseover"||n==="pointerover",Ue=n==="mouseout"||n==="pointerout",xe&&a!==b&&(ke=a.relatedTarget||a.fromElement)&&(Cr(ke)||ke[wi]))break e;if((Ue||xe)&&(xe=ye.window===ye?ye:(xe=ye.ownerDocument)?xe.defaultView||xe.parentWindow:window,Ue?(ke=a.relatedTarget||a.toElement,Ue=ae,ke=ke?Cr(ke):null,ke!==null&&(zt=P(ke),ke!==zt||ke.tag!==5&&ke.tag!==6)&&(ke=null)):(Ue=null,ke=ae),Ue!==ke)){if(Be=hf,Te="onMouseLeave",ee="onMouseEnter",X="mouse",(n==="pointerout"||n==="pointerover")&&(Be=mf,Te="onPointerLeave",ee="onPointerEnter",X="pointer"),zt=Ue==null?xe:ps(Ue),ne=ke==null?xe:ps(ke),xe=new Be(Te,X+"leave",Ue,a,ye),xe.target=zt,xe.relatedTarget=ne,Te=null,Cr(ye)===ae&&(Be=new Be(ee,X+"enter",ke,a,ye),Be.target=ne,Be.relatedTarget=zt,Te=Be),zt=Te,Ue&&ke)t:{for(Be=Ue,ee=ke,X=0,ne=Be;ne;ne=fs(ne))X++;for(ne=0,Te=ee;Te;Te=fs(Te))ne++;for(;0<X-ne;)Be=fs(Be),X--;for(;0<ne-X;)ee=fs(ee),ne--;for(;X--;){if(Be===ee||ee!==null&&Be===ee.alternate)break t;Be=fs(Be),ee=fs(ee)}Be=null}else Be=null;Ue!==null&&Hf(we,xe,Ue,Be,!1),ke!==null&&zt!==null&&Hf(we,zt,ke,Be,!0)}}e:{if(xe=ae?ps(ae):window,Ue=xe.nodeName&&xe.nodeName.toLowerCase(),Ue==="select"||Ue==="input"&&xe.type==="file")var Ve=s_;else if(Sf(xe))if(Ef)Ve=c_;else{Ve=o_;var Ke=a_}else(Ue=xe.nodeName)&&Ue.toLowerCase()==="input"&&(xe.type==="checkbox"||xe.type==="radio")&&(Ve=l_);if(Ve&&(Ve=Ve(n,ae))){Mf(we,Ve,a,ye);break e}Ke&&Ke(n,xe,ae),n==="focusout"&&(Ke=xe._wrapperState)&&Ke.controlled&&xe.type==="number"&&z(xe,"number",xe.value)}switch(Ke=ae?ps(ae):window,n){case"focusin":(Sf(Ke)||Ke.contentEditable==="true")&&(us=Ke,Ec=ae,Ma=null);break;case"focusout":Ma=Ec=us=null;break;case"mousedown":wc=!0;break;case"contextmenu":case"mouseup":case"dragend":wc=!1,Pf(we,a,ye);break;case"selectionchange":if(f_)break;case"keydown":case"keyup":Pf(we,a,ye)}var Ze;if(xc)e:{switch(n){case"compositionstart":var et="onCompositionStart";break e;case"compositionend":et="onCompositionEnd";break e;case"compositionupdate":et="onCompositionUpdate";break e}et=void 0}else cs?xf(n,a)&&(et="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(et="onCompositionStart");et&&(gf&&a.locale!=="ko"&&(cs||et!=="onCompositionStart"?et==="onCompositionEnd"&&cs&&(Ze=df()):(Ki=ye,hc="value"in Ki?Ki.value:Ki.textContent,cs=!0)),Ke=So(ae,et),0<Ke.length&&(et=new pf(et,n,null,a,ye),we.push({event:et,listeners:Ke}),Ze?et.data=Ze:(Ze=yf(a),Ze!==null&&(et.data=Ze)))),(Ze=e_?t_(n,a):n_(n,a))&&(ae=So(ae,"onBeforeInput"),0<ae.length&&(ye=new pf("onBeforeInput","beforeinput",null,a,ye),we.push({event:ye,listeners:ae}),ye.data=Ze))}Bf(we,i)})}function Ta(n,i,a){return{instance:n,listener:i,currentTarget:a}}function So(n,i){for(var a=i+"Capture",c=[];n!==null;){var h=n,v=h.stateNode;h.tag===5&&v!==null&&(h=v,v=Vi(n,a),v!=null&&c.unshift(Ta(n,v,h)),v=Vi(n,i),v!=null&&c.push(Ta(n,v,h))),n=n.return}return c}function fs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Hf(n,i,a,c,h){for(var v=i._reactName,T=[];a!==null&&a!==c;){var F=a,G=F.alternate,ae=F.stateNode;if(G!==null&&G===c)break;F.tag===5&&ae!==null&&(F=ae,h?(G=Vi(a,v),G!=null&&T.unshift(Ta(a,G,F))):h||(G=Vi(a,v),G!=null&&T.push(Ta(a,G,F)))),a=a.return}T.length!==0&&n.push({event:i,listeners:T})}var g_=/\r\n?/g,v_=/\u0000|\uFFFD/g;function Vf(n){return(typeof n=="string"?n:""+n).replace(g_,`
`).replace(v_,"")}function Mo(n,i,a){if(i=Vf(i),Vf(n)!==i&&a)throw Error(t(425))}function Eo(){}var Nc=null,Pc=null;function Lc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Dc=typeof setTimeout=="function"?setTimeout:void 0,__=typeof clearTimeout=="function"?clearTimeout:void 0,Gf=typeof Promise=="function"?Promise:void 0,x_=typeof queueMicrotask=="function"?queueMicrotask:typeof Gf<"u"?function(n){return Gf.resolve(null).then(n).catch(y_)}:Dc;function y_(n){setTimeout(function(){throw n})}function Uc(n,i){var a=i,c=0;do{var h=a.nextSibling;if(n.removeChild(a),h&&h.nodeType===8)if(a=h.data,a==="/$"){if(c===0){n.removeChild(h),ma(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=h}while(a);ma(i)}function Ji(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Wf(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var hs=Math.random().toString(36).slice(2),ui="__reactFiber$"+hs,Aa="__reactProps$"+hs,wi="__reactContainer$"+hs,Ic="__reactEvents$"+hs,S_="__reactListeners$"+hs,M_="__reactHandles$"+hs;function Cr(n){var i=n[ui];if(i)return i;for(var a=n.parentNode;a;){if(i=a[wi]||a[ui]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=Wf(n);n!==null;){if(a=n[ui])return a;n=Wf(n)}return i}n=a,a=n.parentNode}return null}function ba(n){return n=n[ui]||n[wi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ps(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function wo(n){return n[Aa]||null}var Fc=[],ms=-1;function Qi(n){return{current:n}}function Pt(n){0>ms||(n.current=Fc[ms],Fc[ms]=null,ms--)}function Rt(n,i){ms++,Fc[ms]=n.current,n.current=i}var er={},cn=Qi(er),Mn=Qi(!1),Rr=er;function gs(n,i){var a=n.type.contextTypes;if(!a)return er;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},v;for(v in a)h[v]=i[v];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function En(n){return n=n.childContextTypes,n!=null}function To(){Pt(Mn),Pt(cn)}function $f(n,i,a){if(cn.current!==er)throw Error(t(168));Rt(cn,i),Rt(Mn,a)}function Xf(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,ve(n)||"Unknown",h));return K({},a,c)}function Ao(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||er,Rr=cn.current,Rt(cn,n),Rt(Mn,Mn.current),!0}function qf(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Xf(n,i,Rr),c.__reactInternalMemoizedMergedChildContext=n,Pt(Mn),Pt(cn),Rt(cn,n)):Pt(Mn),Rt(Mn,a)}var Ti=null,bo=!1,Oc=!1;function Yf(n){Ti===null?Ti=[n]:Ti.push(n)}function E_(n){bo=!0,Yf(n)}function tr(){if(!Oc&&Ti!==null){Oc=!0;var n=0,i=wt;try{var a=Ti;for(wt=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Ti=null,bo=!1}catch(h){throw Ti!==null&&(Ti=Ti.slice(n+1)),je(Dt,tr),h}finally{wt=i,Oc=!1}}return null}var vs=[],_s=0,Co=null,Ro=0,jn=[],Hn=0,Nr=null,Ai=1,bi="";function Pr(n,i){vs[_s++]=Ro,vs[_s++]=Co,Co=n,Ro=i}function Kf(n,i,a){jn[Hn++]=Ai,jn[Hn++]=bi,jn[Hn++]=Nr,Nr=n;var c=Ai;n=bi;var h=32-Wt(c)-1;c&=~(1<<h),a+=1;var v=32-Wt(i)+h;if(30<v){var T=h-h%5;v=(c&(1<<T)-1).toString(32),c>>=T,h-=T,Ai=1<<32-Wt(i)+h|a<<h|c,bi=v+n}else Ai=1<<v|a<<h|c,bi=n}function kc(n){n.return!==null&&(Pr(n,1),Kf(n,1,0))}function zc(n){for(;n===Co;)Co=vs[--_s],vs[_s]=null,Ro=vs[--_s],vs[_s]=null;for(;n===Nr;)Nr=jn[--Hn],jn[Hn]=null,bi=jn[--Hn],jn[Hn]=null,Ai=jn[--Hn],jn[Hn]=null}var Un=null,In=null,Ut=!1,Qn=null;function Zf(n,i){var a=$n(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Jf(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Un=n,In=Ji(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Un=n,In=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Nr!==null?{id:Ai,overflow:bi}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=$n(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,Un=n,In=null,!0):!1;default:return!1}}function Bc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function jc(n){if(Ut){var i=In;if(i){var a=i;if(!Jf(n,i)){if(Bc(n))throw Error(t(418));i=Ji(a.nextSibling);var c=Un;i&&Jf(n,i)?Zf(c,a):(n.flags=n.flags&-4097|2,Ut=!1,Un=n)}}else{if(Bc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Ut=!1,Un=n}}}function Qf(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Un=n}function No(n){if(n!==Un)return!1;if(!Ut)return Qf(n),Ut=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Lc(n.type,n.memoizedProps)),i&&(i=In)){if(Bc(n))throw eh(),Error(t(418));for(;i;)Zf(n,i),i=Ji(i.nextSibling)}if(Qf(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){In=Ji(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}In=null}}else In=Un?Ji(n.stateNode.nextSibling):null;return!0}function eh(){for(var n=In;n;)n=Ji(n.nextSibling)}function xs(){In=Un=null,Ut=!1}function Hc(n){Qn===null?Qn=[n]:Qn.push(n)}var w_=U.ReactCurrentBatchConfig;function Ca(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var h=c,v=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===v?i.ref:(i=function(T){var F=h.refs;T===null?delete F[v]:F[v]=T},i._stringRef=v,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function Po(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function th(n){var i=n._init;return i(n._payload)}function nh(n){function i(ee,X){if(n){var ne=ee.deletions;ne===null?(ee.deletions=[X],ee.flags|=16):ne.push(X)}}function a(ee,X){if(!n)return null;for(;X!==null;)i(ee,X),X=X.sibling;return null}function c(ee,X){for(ee=new Map;X!==null;)X.key!==null?ee.set(X.key,X):ee.set(X.index,X),X=X.sibling;return ee}function h(ee,X){return ee=cr(ee,X),ee.index=0,ee.sibling=null,ee}function v(ee,X,ne){return ee.index=ne,n?(ne=ee.alternate,ne!==null?(ne=ne.index,ne<X?(ee.flags|=2,X):ne):(ee.flags|=2,X)):(ee.flags|=1048576,X)}function T(ee){return n&&ee.alternate===null&&(ee.flags|=2),ee}function F(ee,X,ne,Te){return X===null||X.tag!==6?(X=Du(ne,ee.mode,Te),X.return=ee,X):(X=h(X,ne),X.return=ee,X)}function G(ee,X,ne,Te){var Ve=ne.type;return Ve===k?ye(ee,X,ne.props.children,Te,ne.key):X!==null&&(X.elementType===Ve||typeof Ve=="object"&&Ve!==null&&Ve.$$typeof===he&&th(Ve)===X.type)?(Te=h(X,ne.props),Te.ref=Ca(ee,X,ne),Te.return=ee,Te):(Te=tl(ne.type,ne.key,ne.props,null,ee.mode,Te),Te.ref=Ca(ee,X,ne),Te.return=ee,Te)}function ae(ee,X,ne,Te){return X===null||X.tag!==4||X.stateNode.containerInfo!==ne.containerInfo||X.stateNode.implementation!==ne.implementation?(X=Uu(ne,ee.mode,Te),X.return=ee,X):(X=h(X,ne.children||[]),X.return=ee,X)}function ye(ee,X,ne,Te,Ve){return X===null||X.tag!==7?(X=zr(ne,ee.mode,Te,Ve),X.return=ee,X):(X=h(X,ne),X.return=ee,X)}function we(ee,X,ne){if(typeof X=="string"&&X!==""||typeof X=="number")return X=Du(""+X,ee.mode,ne),X.return=ee,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case Y:return ne=tl(X.type,X.key,X.props,null,ee.mode,ne),ne.ref=Ca(ee,null,X),ne.return=ee,ne;case I:return X=Uu(X,ee.mode,ne),X.return=ee,X;case he:var Te=X._init;return we(ee,Te(X._payload),ne)}if(C(X)||B(X))return X=zr(X,ee.mode,ne,null),X.return=ee,X;Po(ee,X)}return null}function xe(ee,X,ne,Te){var Ve=X!==null?X.key:null;if(typeof ne=="string"&&ne!==""||typeof ne=="number")return Ve!==null?null:F(ee,X,""+ne,Te);if(typeof ne=="object"&&ne!==null){switch(ne.$$typeof){case Y:return ne.key===Ve?G(ee,X,ne,Te):null;case I:return ne.key===Ve?ae(ee,X,ne,Te):null;case he:return Ve=ne._init,xe(ee,X,Ve(ne._payload),Te)}if(C(ne)||B(ne))return Ve!==null?null:ye(ee,X,ne,Te,null);Po(ee,ne)}return null}function Ue(ee,X,ne,Te,Ve){if(typeof Te=="string"&&Te!==""||typeof Te=="number")return ee=ee.get(ne)||null,F(X,ee,""+Te,Ve);if(typeof Te=="object"&&Te!==null){switch(Te.$$typeof){case Y:return ee=ee.get(Te.key===null?ne:Te.key)||null,G(X,ee,Te,Ve);case I:return ee=ee.get(Te.key===null?ne:Te.key)||null,ae(X,ee,Te,Ve);case he:var Ke=Te._init;return Ue(ee,X,ne,Ke(Te._payload),Ve)}if(C(Te)||B(Te))return ee=ee.get(ne)||null,ye(X,ee,Te,Ve,null);Po(X,Te)}return null}function ke(ee,X,ne,Te){for(var Ve=null,Ke=null,Ze=X,et=X=0,tn=null;Ze!==null&&et<ne.length;et++){Ze.index>et?(tn=Ze,Ze=null):tn=Ze.sibling;var Mt=xe(ee,Ze,ne[et],Te);if(Mt===null){Ze===null&&(Ze=tn);break}n&&Ze&&Mt.alternate===null&&i(ee,Ze),X=v(Mt,X,et),Ke===null?Ve=Mt:Ke.sibling=Mt,Ke=Mt,Ze=tn}if(et===ne.length)return a(ee,Ze),Ut&&Pr(ee,et),Ve;if(Ze===null){for(;et<ne.length;et++)Ze=we(ee,ne[et],Te),Ze!==null&&(X=v(Ze,X,et),Ke===null?Ve=Ze:Ke.sibling=Ze,Ke=Ze);return Ut&&Pr(ee,et),Ve}for(Ze=c(ee,Ze);et<ne.length;et++)tn=Ue(Ze,ee,et,ne[et],Te),tn!==null&&(n&&tn.alternate!==null&&Ze.delete(tn.key===null?et:tn.key),X=v(tn,X,et),Ke===null?Ve=tn:Ke.sibling=tn,Ke=tn);return n&&Ze.forEach(function(ur){return i(ee,ur)}),Ut&&Pr(ee,et),Ve}function Be(ee,X,ne,Te){var Ve=B(ne);if(typeof Ve!="function")throw Error(t(150));if(ne=Ve.call(ne),ne==null)throw Error(t(151));for(var Ke=Ve=null,Ze=X,et=X=0,tn=null,Mt=ne.next();Ze!==null&&!Mt.done;et++,Mt=ne.next()){Ze.index>et?(tn=Ze,Ze=null):tn=Ze.sibling;var ur=xe(ee,Ze,Mt.value,Te);if(ur===null){Ze===null&&(Ze=tn);break}n&&Ze&&ur.alternate===null&&i(ee,Ze),X=v(ur,X,et),Ke===null?Ve=ur:Ke.sibling=ur,Ke=ur,Ze=tn}if(Mt.done)return a(ee,Ze),Ut&&Pr(ee,et),Ve;if(Ze===null){for(;!Mt.done;et++,Mt=ne.next())Mt=we(ee,Mt.value,Te),Mt!==null&&(X=v(Mt,X,et),Ke===null?Ve=Mt:Ke.sibling=Mt,Ke=Mt);return Ut&&Pr(ee,et),Ve}for(Ze=c(ee,Ze);!Mt.done;et++,Mt=ne.next())Mt=Ue(Ze,ee,et,Mt.value,Te),Mt!==null&&(n&&Mt.alternate!==null&&Ze.delete(Mt.key===null?et:Mt.key),X=v(Mt,X,et),Ke===null?Ve=Mt:Ke.sibling=Mt,Ke=Mt);return n&&Ze.forEach(function(ix){return i(ee,ix)}),Ut&&Pr(ee,et),Ve}function zt(ee,X,ne,Te){if(typeof ne=="object"&&ne!==null&&ne.type===k&&ne.key===null&&(ne=ne.props.children),typeof ne=="object"&&ne!==null){switch(ne.$$typeof){case Y:e:{for(var Ve=ne.key,Ke=X;Ke!==null;){if(Ke.key===Ve){if(Ve=ne.type,Ve===k){if(Ke.tag===7){a(ee,Ke.sibling),X=h(Ke,ne.props.children),X.return=ee,ee=X;break e}}else if(Ke.elementType===Ve||typeof Ve=="object"&&Ve!==null&&Ve.$$typeof===he&&th(Ve)===Ke.type){a(ee,Ke.sibling),X=h(Ke,ne.props),X.ref=Ca(ee,Ke,ne),X.return=ee,ee=X;break e}a(ee,Ke);break}else i(ee,Ke);Ke=Ke.sibling}ne.type===k?(X=zr(ne.props.children,ee.mode,Te,ne.key),X.return=ee,ee=X):(Te=tl(ne.type,ne.key,ne.props,null,ee.mode,Te),Te.ref=Ca(ee,X,ne),Te.return=ee,ee=Te)}return T(ee);case I:e:{for(Ke=ne.key;X!==null;){if(X.key===Ke)if(X.tag===4&&X.stateNode.containerInfo===ne.containerInfo&&X.stateNode.implementation===ne.implementation){a(ee,X.sibling),X=h(X,ne.children||[]),X.return=ee,ee=X;break e}else{a(ee,X);break}else i(ee,X);X=X.sibling}X=Uu(ne,ee.mode,Te),X.return=ee,ee=X}return T(ee);case he:return Ke=ne._init,zt(ee,X,Ke(ne._payload),Te)}if(C(ne))return ke(ee,X,ne,Te);if(B(ne))return Be(ee,X,ne,Te);Po(ee,ne)}return typeof ne=="string"&&ne!==""||typeof ne=="number"?(ne=""+ne,X!==null&&X.tag===6?(a(ee,X.sibling),X=h(X,ne),X.return=ee,ee=X):(a(ee,X),X=Du(ne,ee.mode,Te),X.return=ee,ee=X),T(ee)):a(ee,X)}return zt}var ys=nh(!0),ih=nh(!1),Lo=Qi(null),Do=null,Ss=null,Vc=null;function Gc(){Vc=Ss=Do=null}function Wc(n){var i=Lo.current;Pt(Lo),n._currentValue=i}function $c(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function Ms(n,i){Do=n,Vc=Ss=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(wn=!0),n.firstContext=null)}function Vn(n){var i=n._currentValue;if(Vc!==n)if(n={context:n,memoizedValue:i,next:null},Ss===null){if(Do===null)throw Error(t(308));Ss=n,Do.dependencies={lanes:0,firstContext:n}}else Ss=Ss.next=n;return i}var Lr=null;function Xc(n){Lr===null?Lr=[n]:Lr.push(n)}function rh(n,i,a,c){var h=i.interleaved;return h===null?(a.next=a,Xc(i)):(a.next=h.next,h.next=a),i.interleaved=a,Ci(n,c)}function Ci(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var nr=!1;function qc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ri(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ir(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(_t&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,Ci(n,a)}return h=c.interleaved,h===null?(i.next=i,Xc(c)):(i.next=h.next,h.next=i),c.interleaved=i,Ci(n,a)}function Uo(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}function ah(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var h=null,v=null;if(a=a.firstBaseUpdate,a!==null){do{var T={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};v===null?h=v=T:v=v.next=T,a=a.next}while(a!==null);v===null?h=v=i:v=v.next=i}else h=v=i;a={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:v,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function Io(n,i,a,c){var h=n.updateQueue;nr=!1;var v=h.firstBaseUpdate,T=h.lastBaseUpdate,F=h.shared.pending;if(F!==null){h.shared.pending=null;var G=F,ae=G.next;G.next=null,T===null?v=ae:T.next=ae,T=G;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,F=ye.lastBaseUpdate,F!==T&&(F===null?ye.firstBaseUpdate=ae:F.next=ae,ye.lastBaseUpdate=G))}if(v!==null){var we=h.baseState;T=0,ye=ae=G=null,F=v;do{var xe=F.lane,Ue=F.eventTime;if((c&xe)===xe){ye!==null&&(ye=ye.next={eventTime:Ue,lane:0,tag:F.tag,payload:F.payload,callback:F.callback,next:null});e:{var ke=n,Be=F;switch(xe=i,Ue=a,Be.tag){case 1:if(ke=Be.payload,typeof ke=="function"){we=ke.call(Ue,we,xe);break e}we=ke;break e;case 3:ke.flags=ke.flags&-65537|128;case 0:if(ke=Be.payload,xe=typeof ke=="function"?ke.call(Ue,we,xe):ke,xe==null)break e;we=K({},we,xe);break e;case 2:nr=!0}}F.callback!==null&&F.lane!==0&&(n.flags|=64,xe=h.effects,xe===null?h.effects=[F]:xe.push(F))}else Ue={eventTime:Ue,lane:xe,tag:F.tag,payload:F.payload,callback:F.callback,next:null},ye===null?(ae=ye=Ue,G=we):ye=ye.next=Ue,T|=xe;if(F=F.next,F===null){if(F=h.shared.pending,F===null)break;xe=F,F=xe.next,xe.next=null,h.lastBaseUpdate=xe,h.shared.pending=null}}while(!0);if(ye===null&&(G=we),h.baseState=G,h.firstBaseUpdate=ae,h.lastBaseUpdate=ye,i=h.shared.interleaved,i!==null){h=i;do T|=h.lane,h=h.next;while(h!==i)}else v===null&&(h.shared.lanes=0);Ir|=T,n.lanes=T,n.memoizedState=we}}function oh(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=a,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var Ra={},di=Qi(Ra),Na=Qi(Ra),Pa=Qi(Ra);function Dr(n){if(n===Ra)throw Error(t(174));return n}function Yc(n,i){switch(Rt(Pa,i),Rt(Na,n),Rt(di,Ra),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ce(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ce(i,n)}Pt(di),Rt(di,i)}function Es(){Pt(di),Pt(Na),Pt(Pa)}function lh(n){Dr(Pa.current);var i=Dr(di.current),a=Ce(i,n.type);i!==a&&(Rt(Na,n),Rt(di,a))}function Kc(n){Na.current===n&&(Pt(di),Pt(Na))}var It=Qi(0);function Fo(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Zc=[];function Jc(){for(var n=0;n<Zc.length;n++)Zc[n]._workInProgressVersionPrimary=null;Zc.length=0}var Oo=U.ReactCurrentDispatcher,Qc=U.ReactCurrentBatchConfig,Ur=0,Ft=null,$t=null,Qt=null,ko=!1,La=!1,Da=0,T_=0;function un(){throw Error(t(321))}function eu(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Jn(n[a],i[a]))return!1;return!0}function tu(n,i,a,c,h,v){if(Ur=v,Ft=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Oo.current=n===null||n.memoizedState===null?R_:N_,n=a(c,h),La){v=0;do{if(La=!1,Da=0,25<=v)throw Error(t(301));v+=1,Qt=$t=null,i.updateQueue=null,Oo.current=P_,n=a(c,h)}while(La)}if(Oo.current=jo,i=$t!==null&&$t.next!==null,Ur=0,Qt=$t=Ft=null,ko=!1,i)throw Error(t(300));return n}function nu(){var n=Da!==0;return Da=0,n}function fi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n,Qt}function Gn(){if($t===null){var n=Ft.alternate;n=n!==null?n.memoizedState:null}else n=$t.next;var i=Qt===null?Ft.memoizedState:Qt.next;if(i!==null)Qt=i,$t=n;else{if(n===null)throw Error(t(310));$t=n,n={memoizedState:$t.memoizedState,baseState:$t.baseState,baseQueue:$t.baseQueue,queue:$t.queue,next:null},Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n}return Qt}function Ua(n,i){return typeof i=="function"?i(n):i}function iu(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=$t,h=c.baseQueue,v=a.pending;if(v!==null){if(h!==null){var T=h.next;h.next=v.next,v.next=T}c.baseQueue=h=v,a.pending=null}if(h!==null){v=h.next,c=c.baseState;var F=T=null,G=null,ae=v;do{var ye=ae.lane;if((Ur&ye)===ye)G!==null&&(G=G.next={lane:0,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null}),c=ae.hasEagerState?ae.eagerState:n(c,ae.action);else{var we={lane:ye,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null};G===null?(F=G=we,T=c):G=G.next=we,Ft.lanes|=ye,Ir|=ye}ae=ae.next}while(ae!==null&&ae!==v);G===null?T=c:G.next=F,Jn(c,i.memoizedState)||(wn=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=G,a.lastRenderedState=c}if(n=a.interleaved,n!==null){h=n;do v=h.lane,Ft.lanes|=v,Ir|=v,h=h.next;while(h!==n)}else h===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function ru(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,h=a.pending,v=i.memoizedState;if(h!==null){a.pending=null;var T=h=h.next;do v=n(v,T.action),T=T.next;while(T!==h);Jn(v,i.memoizedState)||(wn=!0),i.memoizedState=v,i.baseQueue===null&&(i.baseState=v),a.lastRenderedState=v}return[v,c]}function ch(){}function uh(n,i){var a=Ft,c=Gn(),h=i(),v=!Jn(c.memoizedState,h);if(v&&(c.memoizedState=h,wn=!0),c=c.queue,su(hh.bind(null,a,c,n),[n]),c.getSnapshot!==i||v||Qt!==null&&Qt.memoizedState.tag&1){if(a.flags|=2048,Ia(9,fh.bind(null,a,c,h,i),void 0,null),en===null)throw Error(t(349));(Ur&30)!==0||dh(a,i,h)}return h}function dh(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function fh(n,i,a,c){i.value=a,i.getSnapshot=c,ph(i)&&mh(n)}function hh(n,i,a){return a(function(){ph(i)&&mh(n)})}function ph(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Jn(n,a)}catch{return!0}}function mh(n){var i=Ci(n,1);i!==null&&ii(i,n,1,-1)}function gh(n){var i=fi();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ua,lastRenderedState:n},i.queue=n,n=n.dispatch=C_.bind(null,Ft,n),[i.memoizedState,n]}function Ia(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function vh(){return Gn().memoizedState}function zo(n,i,a,c){var h=fi();Ft.flags|=n,h.memoizedState=Ia(1|i,a,void 0,c===void 0?null:c)}function Bo(n,i,a,c){var h=Gn();c=c===void 0?null:c;var v=void 0;if($t!==null){var T=$t.memoizedState;if(v=T.destroy,c!==null&&eu(c,T.deps)){h.memoizedState=Ia(i,a,v,c);return}}Ft.flags|=n,h.memoizedState=Ia(1|i,a,v,c)}function _h(n,i){return zo(8390656,8,n,i)}function su(n,i){return Bo(2048,8,n,i)}function xh(n,i){return Bo(4,2,n,i)}function yh(n,i){return Bo(4,4,n,i)}function Sh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Mh(n,i,a){return a=a!=null?a.concat([n]):null,Bo(4,4,Sh.bind(null,i,n),a)}function au(){}function Eh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function wh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function Th(n,i,a){return(Ur&21)===0?(n.baseState&&(n.baseState=!1,wn=!0),n.memoizedState=a):(Jn(a,i)||(a=ef(),Ft.lanes|=a,Ir|=a,n.baseState=!0),i)}function A_(n,i){var a=wt;wt=a!==0&&4>a?a:4,n(!0);var c=Qc.transition;Qc.transition={};try{n(!1),i()}finally{wt=a,Qc.transition=c}}function Ah(){return Gn().memoizedState}function b_(n,i,a){var c=or(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},bh(n))Ch(i,a);else if(a=rh(n,i,a,c),a!==null){var h=_n();ii(a,n,c,h),Rh(a,i,c)}}function C_(n,i,a){var c=or(n),h={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(bh(n))Ch(i,h);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=i.lastRenderedReducer,v!==null))try{var T=i.lastRenderedState,F=v(T,a);if(h.hasEagerState=!0,h.eagerState=F,Jn(F,T)){var G=i.interleaved;G===null?(h.next=h,Xc(i)):(h.next=G.next,G.next=h),i.interleaved=h;return}}catch{}finally{}a=rh(n,i,h,c),a!==null&&(h=_n(),ii(a,n,c,h),Rh(a,i,c))}}function bh(n){var i=n.alternate;return n===Ft||i!==null&&i===Ft}function Ch(n,i){La=ko=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Rh(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}var jo={readContext:Vn,useCallback:un,useContext:un,useEffect:un,useImperativeHandle:un,useInsertionEffect:un,useLayoutEffect:un,useMemo:un,useReducer:un,useRef:un,useState:un,useDebugValue:un,useDeferredValue:un,useTransition:un,useMutableSource:un,useSyncExternalStore:un,useId:un,unstable_isNewReconciler:!1},R_={readContext:Vn,useCallback:function(n,i){return fi().memoizedState=[n,i===void 0?null:i],n},useContext:Vn,useEffect:_h,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,zo(4194308,4,Sh.bind(null,i,n),a)},useLayoutEffect:function(n,i){return zo(4194308,4,n,i)},useInsertionEffect:function(n,i){return zo(4,2,n,i)},useMemo:function(n,i){var a=fi();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=fi();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=b_.bind(null,Ft,n),[c.memoizedState,n]},useRef:function(n){var i=fi();return n={current:n},i.memoizedState=n},useState:gh,useDebugValue:au,useDeferredValue:function(n){return fi().memoizedState=n},useTransition:function(){var n=gh(!1),i=n[0];return n=A_.bind(null,n[1]),fi().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=Ft,h=fi();if(Ut){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),en===null)throw Error(t(349));(Ur&30)!==0||dh(c,i,a)}h.memoizedState=a;var v={value:a,getSnapshot:i};return h.queue=v,_h(hh.bind(null,c,v,n),[n]),c.flags|=2048,Ia(9,fh.bind(null,c,v,a,i),void 0,null),a},useId:function(){var n=fi(),i=en.identifierPrefix;if(Ut){var a=bi,c=Ai;a=(c&~(1<<32-Wt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Da++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=T_++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},N_={readContext:Vn,useCallback:Eh,useContext:Vn,useEffect:su,useImperativeHandle:Mh,useInsertionEffect:xh,useLayoutEffect:yh,useMemo:wh,useReducer:iu,useRef:vh,useState:function(){return iu(Ua)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return Th(i,$t.memoizedState,n)},useTransition:function(){var n=iu(Ua)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:ch,useSyncExternalStore:uh,useId:Ah,unstable_isNewReconciler:!1},P_={readContext:Vn,useCallback:Eh,useContext:Vn,useEffect:su,useImperativeHandle:Mh,useInsertionEffect:xh,useLayoutEffect:yh,useMemo:wh,useReducer:ru,useRef:vh,useState:function(){return ru(Ua)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return $t===null?i.memoizedState=n:Th(i,$t.memoizedState,n)},useTransition:function(){var n=ru(Ua)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:ch,useSyncExternalStore:uh,useId:Ah,unstable_isNewReconciler:!1};function ei(n,i){if(n&&n.defaultProps){i=K({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function ou(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:K({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Ho={isMounted:function(n){return(n=n._reactInternals)?P(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Uo(i,n,h))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.tag=1,v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Uo(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=_n(),c=or(n),h=Ri(a,c);h.tag=2,i!=null&&(h.callback=i),i=ir(n,h,c),i!==null&&(ii(i,n,c,a),Uo(i,n,c))}};function Nh(n,i,a,c,h,v,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,v,T):i.prototype&&i.prototype.isPureReactComponent?!Sa(a,c)||!Sa(h,v):!0}function Ph(n,i,a){var c=!1,h=er,v=i.contextType;return typeof v=="object"&&v!==null?v=Vn(v):(h=En(i)?Rr:cn.current,c=i.contextTypes,v=(c=c!=null)?gs(n,h):er),i=new i(a,v),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ho,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=v),i}function Lh(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&Ho.enqueueReplaceState(i,i.state,null)}function lu(n,i,a,c){var h=n.stateNode;h.props=a,h.state=n.memoizedState,h.refs={},qc(n);var v=i.contextType;typeof v=="object"&&v!==null?h.context=Vn(v):(v=En(i)?Rr:cn.current,h.context=gs(n,v)),h.state=n.memoizedState,v=i.getDerivedStateFromProps,typeof v=="function"&&(ou(n,i,v,a),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Ho.enqueueReplaceState(h,h.state,null),Io(n,a,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function ws(n,i){try{var a="",c=i;do a+=pe(c),c=c.return;while(c);var h=a}catch(v){h=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:i,stack:h,digest:null}}function cu(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function uu(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var L_=typeof WeakMap=="function"?WeakMap:Map;function Dh(n,i,a){a=Ri(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){Yo||(Yo=!0,Tu=c),uu(n,i)},a}function Uh(n,i,a){a=Ri(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;a.payload=function(){return c(h)},a.callback=function(){uu(n,i)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(a.callback=function(){uu(n,i),typeof c!="function"&&(sr===null?sr=new Set([this]):sr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),a}function Ih(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new L_;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(a)||(h.add(a),n=$_.bind(null,n,i,a),i.then(n,n))}function Fh(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Oh(n,i,a,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Ri(-1,1),i.tag=2,ir(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var D_=U.ReactCurrentOwner,wn=!1;function vn(n,i,a,c){i.child=n===null?ih(i,null,a,c):ys(i,n.child,a,c)}function kh(n,i,a,c,h){a=a.render;var v=i.ref;return Ms(i,h),c=tu(n,i,a,c,v,h),a=nu(),n!==null&&!wn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&a&&kc(i),i.flags|=1,vn(n,i,c,h),i.child)}function zh(n,i,a,c,h){if(n===null){var v=a.type;return typeof v=="function"&&!Lu(v)&&v.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=v,Bh(n,i,v,c,h)):(n=tl(a.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(v=n.child,(n.lanes&h)===0){var T=v.memoizedProps;if(a=a.compare,a=a!==null?a:Sa,a(T,c)&&n.ref===i.ref)return Ni(n,i,h)}return i.flags|=1,n=cr(v,c),n.ref=i.ref,n.return=i,i.child=n}function Bh(n,i,a,c,h){if(n!==null){var v=n.memoizedProps;if(Sa(v,c)&&n.ref===i.ref)if(wn=!1,i.pendingProps=c=v,(n.lanes&h)!==0)(n.flags&131072)!==0&&(wn=!0);else return i.lanes=n.lanes,Ni(n,i,h)}return du(n,i,a,c,h)}function jh(n,i,a){var c=i.pendingProps,h=c.children,v=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Rt(As,Fn),Fn|=a;else{if((a&1073741824)===0)return n=v!==null?v.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Rt(As,Fn),Fn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=v!==null?v.baseLanes:a,Rt(As,Fn),Fn|=c}else v!==null?(c=v.baseLanes|a,i.memoizedState=null):c=a,Rt(As,Fn),Fn|=c;return vn(n,i,h,a),i.child}function Hh(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function du(n,i,a,c,h){var v=En(a)?Rr:cn.current;return v=gs(i,v),Ms(i,h),a=tu(n,i,a,c,v,h),c=nu(),n!==null&&!wn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&c&&kc(i),i.flags|=1,vn(n,i,a,h),i.child)}function Vh(n,i,a,c,h){if(En(a)){var v=!0;Ao(i)}else v=!1;if(Ms(i,h),i.stateNode===null)Go(n,i),Ph(i,a,c),lu(i,a,c,h),c=!0;else if(n===null){var T=i.stateNode,F=i.memoizedProps;T.props=F;var G=T.context,ae=a.contextType;typeof ae=="object"&&ae!==null?ae=Vn(ae):(ae=En(a)?Rr:cn.current,ae=gs(i,ae));var ye=a.getDerivedStateFromProps,we=typeof ye=="function"||typeof T.getSnapshotBeforeUpdate=="function";we||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==c||G!==ae)&&Lh(i,T,c,ae),nr=!1;var xe=i.memoizedState;T.state=xe,Io(i,c,T,h),G=i.memoizedState,F!==c||xe!==G||Mn.current||nr?(typeof ye=="function"&&(ou(i,a,ye,c),G=i.memoizedState),(F=nr||Nh(i,a,F,c,xe,G,ae))?(we||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=G),T.props=c,T.state=G,T.context=ae,c=F):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,sh(n,i),F=i.memoizedProps,ae=i.type===i.elementType?F:ei(i.type,F),T.props=ae,we=i.pendingProps,xe=T.context,G=a.contextType,typeof G=="object"&&G!==null?G=Vn(G):(G=En(a)?Rr:cn.current,G=gs(i,G));var Ue=a.getDerivedStateFromProps;(ye=typeof Ue=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==we||xe!==G)&&Lh(i,T,c,G),nr=!1,xe=i.memoizedState,T.state=xe,Io(i,c,T,h);var ke=i.memoizedState;F!==we||xe!==ke||Mn.current||nr?(typeof Ue=="function"&&(ou(i,a,Ue,c),ke=i.memoizedState),(ae=nr||Nh(i,a,ae,c,xe,ke,G)||!1)?(ye||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,ke,G),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,ke,G)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=ke),T.props=c,T.state=ke,T.context=G,c=ae):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=1024),c=!1)}return fu(n,i,a,c,v,h)}function fu(n,i,a,c,h,v){Hh(n,i);var T=(i.flags&128)!==0;if(!c&&!T)return h&&qf(i,a,!1),Ni(n,i,v);c=i.stateNode,D_.current=i;var F=T&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&T?(i.child=ys(i,n.child,null,v),i.child=ys(i,null,F,v)):vn(n,i,F,v),i.memoizedState=c.state,h&&qf(i,a,!0),i.child}function Gh(n){var i=n.stateNode;i.pendingContext?$f(n,i.pendingContext,i.pendingContext!==i.context):i.context&&$f(n,i.context,!1),Yc(n,i.containerInfo)}function Wh(n,i,a,c,h){return xs(),Hc(h),i.flags|=256,vn(n,i,a,c),i.child}var hu={dehydrated:null,treeContext:null,retryLane:0};function pu(n){return{baseLanes:n,cachePool:null,transitions:null}}function $h(n,i,a){var c=i.pendingProps,h=It.current,v=!1,T=(i.flags&128)!==0,F;if((F=T)||(F=n!==null&&n.memoizedState===null?!1:(h&2)!==0),F?(v=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),Rt(It,h&1),n===null)return jc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,n=c.fallback,v?(c=i.mode,v=i.child,T={mode:"hidden",children:T},(c&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=T):v=nl(T,c,0,null),n=zr(n,c,a,null),v.return=i,n.return=i,v.sibling=n,i.child=v,i.child.memoizedState=pu(a),i.memoizedState=hu,n):mu(i,T));if(h=n.memoizedState,h!==null&&(F=h.dehydrated,F!==null))return U_(n,i,T,c,F,h,a);if(v){v=c.fallback,T=i.mode,h=n.child,F=h.sibling;var G={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=G,i.deletions=null):(c=cr(h,G),c.subtreeFlags=h.subtreeFlags&14680064),F!==null?v=cr(F,v):(v=zr(v,T,a,null),v.flags|=2),v.return=i,c.return=i,c.sibling=v,i.child=c,c=v,v=i.child,T=n.child.memoizedState,T=T===null?pu(a):{baseLanes:T.baseLanes|a,cachePool:null,transitions:T.transitions},v.memoizedState=T,v.childLanes=n.childLanes&~a,i.memoizedState=hu,c}return v=n.child,n=v.sibling,c=cr(v,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function mu(n,i){return i=nl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Vo(n,i,a,c){return c!==null&&Hc(c),ys(i,n.child,null,a),n=mu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function U_(n,i,a,c,h,v,T){if(a)return i.flags&256?(i.flags&=-257,c=cu(Error(t(422))),Vo(n,i,T,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(v=c.fallback,h=i.mode,c=nl({mode:"visible",children:c.children},h,0,null),v=zr(v,h,T,null),v.flags|=2,c.return=i,v.return=i,c.sibling=v,i.child=c,(i.mode&1)!==0&&ys(i,n.child,null,T),i.child.memoizedState=pu(T),i.memoizedState=hu,v);if((i.mode&1)===0)return Vo(n,i,T,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var F=c.dgst;return c=F,v=Error(t(419)),c=cu(v,c,void 0),Vo(n,i,T,c)}if(F=(T&n.childLanes)!==0,wn||F){if(c=en,c!==null){switch(T&-T){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|T))!==0?0:h,h!==0&&h!==v.retryLane&&(v.retryLane=h,Ci(n,h),ii(c,n,h,-1))}return Pu(),c=cu(Error(t(421))),Vo(n,i,T,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=X_.bind(null,n),h._reactRetry=i,null):(n=v.treeContext,In=Ji(h.nextSibling),Un=i,Ut=!0,Qn=null,n!==null&&(jn[Hn++]=Ai,jn[Hn++]=bi,jn[Hn++]=Nr,Ai=n.id,bi=n.overflow,Nr=i),i=mu(i,c.children),i.flags|=4096,i)}function Xh(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),$c(n.return,i,a)}function gu(n,i,a,c,h){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:h}:(v.isBackwards=i,v.rendering=null,v.renderingStartTime=0,v.last=c,v.tail=a,v.tailMode=h)}function qh(n,i,a){var c=i.pendingProps,h=c.revealOrder,v=c.tail;if(vn(n,i,c.children,a),c=It.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Xh(n,a,i);else if(n.tag===19)Xh(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Rt(It,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(a=i.child,h=null;a!==null;)n=a.alternate,n!==null&&Fo(n)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),gu(i,!1,h,a,v);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Fo(n)===null){i.child=h;break}n=h.sibling,h.sibling=a,a=h,h=n}gu(i,!0,a,null,v);break;case"together":gu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Go(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ni(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Ir|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=cr(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=cr(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function I_(n,i,a){switch(i.tag){case 3:Gh(i),xs();break;case 5:lh(i);break;case 1:En(i.type)&&Ao(i);break;case 4:Yc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;Rt(Lo,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(Rt(It,It.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?$h(n,i,a):(Rt(It,It.current&1),n=Ni(n,i,a),n!==null?n.sibling:null);Rt(It,It.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return qh(n,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),Rt(It,It.current),c)break;return null;case 22:case 23:return i.lanes=0,jh(n,i,a)}return Ni(n,i,a)}var Yh,vu,Kh,Zh;Yh=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},vu=function(){},Kh=function(n,i,a,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Dr(di.current);var v=null;switch(a){case"input":h=Xe(n,h),c=Xe(n,c),v=[];break;case"select":h=K({},h,{value:void 0}),c=K({},c,{value:void 0}),v=[];break;case"textarea":h=ge(n,h),c=ge(n,c),v=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Eo)}bt(a,c);var T;a=null;for(ae in h)if(!c.hasOwnProperty(ae)&&h.hasOwnProperty(ae)&&h[ae]!=null)if(ae==="style"){var F=h[ae];for(T in F)F.hasOwnProperty(T)&&(a||(a={}),a[T]="")}else ae!=="dangerouslySetInnerHTML"&&ae!=="children"&&ae!=="suppressContentEditableWarning"&&ae!=="suppressHydrationWarning"&&ae!=="autoFocus"&&(o.hasOwnProperty(ae)?v||(v=[]):(v=v||[]).push(ae,null));for(ae in c){var G=c[ae];if(F=h!=null?h[ae]:void 0,c.hasOwnProperty(ae)&&G!==F&&(G!=null||F!=null))if(ae==="style")if(F){for(T in F)!F.hasOwnProperty(T)||G&&G.hasOwnProperty(T)||(a||(a={}),a[T]="");for(T in G)G.hasOwnProperty(T)&&F[T]!==G[T]&&(a||(a={}),a[T]=G[T])}else a||(v||(v=[]),v.push(ae,a)),a=G;else ae==="dangerouslySetInnerHTML"?(G=G?G.__html:void 0,F=F?F.__html:void 0,G!=null&&F!==G&&(v=v||[]).push(ae,G)):ae==="children"?typeof G!="string"&&typeof G!="number"||(v=v||[]).push(ae,""+G):ae!=="suppressContentEditableWarning"&&ae!=="suppressHydrationWarning"&&(o.hasOwnProperty(ae)?(G!=null&&ae==="onScroll"&&Nt("scroll",n),v||F===G||(v=[])):(v=v||[]).push(ae,G))}a&&(v=v||[]).push("style",a);var ae=v;(i.updateQueue=ae)&&(i.flags|=4)}},Zh=function(n,i,a,c){a!==c&&(i.flags|=4)};function Fa(n,i){if(!Ut)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function dn(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function F_(n,i,a){var c=i.pendingProps;switch(zc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return dn(i),null;case 1:return En(i.type)&&To(),dn(i),null;case 3:return c=i.stateNode,Es(),Pt(Mn),Pt(cn),Jc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(No(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Qn!==null&&(Cu(Qn),Qn=null))),vu(n,i),dn(i),null;case 5:Kc(i);var h=Dr(Pa.current);if(a=i.type,n!==null&&i.stateNode!=null)Kh(n,i,a,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return dn(i),null}if(n=Dr(di.current),No(i)){c=i.stateNode,a=i.type;var v=i.memoizedProps;switch(c[ui]=i,c[Aa]=v,n=(i.mode&1)!==0,a){case"dialog":Nt("cancel",c),Nt("close",c);break;case"iframe":case"object":case"embed":Nt("load",c);break;case"video":case"audio":for(h=0;h<Ea.length;h++)Nt(Ea[h],c);break;case"source":Nt("error",c);break;case"img":case"image":case"link":Nt("error",c),Nt("load",c);break;case"details":Nt("toggle",c);break;case"input":lt(c,v),Nt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!v.multiple},Nt("invalid",c);break;case"textarea":Se(c,v),Nt("invalid",c)}bt(a,v),h=null;for(var T in v)if(v.hasOwnProperty(T)){var F=v[T];T==="children"?typeof F=="string"?c.textContent!==F&&(v.suppressHydrationWarning!==!0&&Mo(c.textContent,F,n),h=["children",F]):typeof F=="number"&&c.textContent!==""+F&&(v.suppressHydrationWarning!==!0&&Mo(c.textContent,F,n),h=["children",""+F]):o.hasOwnProperty(T)&&F!=null&&T==="onScroll"&&Nt("scroll",c)}switch(a){case"input":gt(c),Tt(c,v,!0);break;case"textarea":gt(c),We(c);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(c.onclick=Eo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Re(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=T.createElement(a,{is:c.is}):(n=T.createElement(a),a==="select"&&(T=n,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):n=T.createElementNS(n,a),n[ui]=i,n[Aa]=c,Yh(n,i,!1,!1),i.stateNode=n;e:{switch(T=rt(a,c),a){case"dialog":Nt("cancel",n),Nt("close",n),h=c;break;case"iframe":case"object":case"embed":Nt("load",n),h=c;break;case"video":case"audio":for(h=0;h<Ea.length;h++)Nt(Ea[h],n);h=c;break;case"source":Nt("error",n),h=c;break;case"img":case"image":case"link":Nt("error",n),Nt("load",n),h=c;break;case"details":Nt("toggle",n),h=c;break;case"input":lt(n,c),h=Xe(n,c),Nt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=K({},c,{value:void 0}),Nt("invalid",n);break;case"textarea":Se(n,c),h=ge(n,c),Nt("invalid",n);break;default:h=c}bt(a,h),F=h;for(v in F)if(F.hasOwnProperty(v)){var G=F[v];v==="style"?st(n,G):v==="dangerouslySetInnerHTML"?(G=G?G.__html:void 0,G!=null&&be(n,G)):v==="children"?typeof G=="string"?(a!=="textarea"||G!=="")&&He(n,G):typeof G=="number"&&He(n,""+G):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(o.hasOwnProperty(v)?G!=null&&v==="onScroll"&&Nt("scroll",n):G!=null&&N(n,v,G,T))}switch(a){case"input":gt(n),Tt(n,c,!1);break;case"textarea":gt(n),We(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Le(c.value));break;case"select":n.multiple=!!c.multiple,v=c.value,v!=null?ce(n,!!c.multiple,v,!1):c.defaultValue!=null&&ce(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=Eo)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return dn(i),null;case 6:if(n&&i.stateNode!=null)Zh(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Dr(Pa.current),Dr(di.current),No(i)){if(c=i.stateNode,a=i.memoizedProps,c[ui]=i,(v=c.nodeValue!==a)&&(n=Un,n!==null))switch(n.tag){case 3:Mo(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Mo(c.nodeValue,a,(n.mode&1)!==0)}v&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ui]=i,i.stateNode=c}return dn(i),null;case 13:if(Pt(It),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ut&&In!==null&&(i.mode&1)!==0&&(i.flags&128)===0)eh(),xs(),i.flags|=98560,v=!1;else if(v=No(i),c!==null&&c.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=i.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[ui]=i}else xs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;dn(i),v=!1}else Qn!==null&&(Cu(Qn),Qn=null),v=!0;if(!v)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(It.current&1)!==0?Xt===0&&(Xt=3):Pu())),i.updateQueue!==null&&(i.flags|=4),dn(i),null);case 4:return Es(),vu(n,i),n===null&&wa(i.stateNode.containerInfo),dn(i),null;case 10:return Wc(i.type._context),dn(i),null;case 17:return En(i.type)&&To(),dn(i),null;case 19:if(Pt(It),v=i.memoizedState,v===null)return dn(i),null;if(c=(i.flags&128)!==0,T=v.rendering,T===null)if(c)Fa(v,!1);else{if(Xt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=Fo(n),T!==null){for(i.flags|=128,Fa(v,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)v=a,n=c,v.flags&=14680066,T=v.alternate,T===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=T.childLanes,v.lanes=T.lanes,v.child=T.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=T.memoizedProps,v.memoizedState=T.memoizedState,v.updateQueue=T.updateQueue,v.type=T.type,n=T.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Rt(It,It.current&1|2),i.child}n=n.sibling}v.tail!==null&&ze()>bs&&(i.flags|=128,c=!0,Fa(v,!1),i.lanes=4194304)}else{if(!c)if(n=Fo(T),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Fa(v,!0),v.tail===null&&v.tailMode==="hidden"&&!T.alternate&&!Ut)return dn(i),null}else 2*ze()-v.renderingStartTime>bs&&a!==1073741824&&(i.flags|=128,c=!0,Fa(v,!1),i.lanes=4194304);v.isBackwards?(T.sibling=i.child,i.child=T):(a=v.last,a!==null?a.sibling=T:i.child=T,v.last=T)}return v.tail!==null?(i=v.tail,v.rendering=i,v.tail=i.sibling,v.renderingStartTime=ze(),i.sibling=null,a=It.current,Rt(It,c?a&1|2:a&1),i):(dn(i),null);case 22:case 23:return Nu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(Fn&1073741824)!==0&&(dn(i),i.subtreeFlags&6&&(i.flags|=8192)):dn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function O_(n,i){switch(zc(i),i.tag){case 1:return En(i.type)&&To(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Es(),Pt(Mn),Pt(cn),Jc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Kc(i),null;case 13:if(Pt(It),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));xs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Pt(It),null;case 4:return Es(),null;case 10:return Wc(i.type._context),null;case 22:case 23:return Nu(),null;case 24:return null;default:return null}}var Wo=!1,fn=!1,k_=typeof WeakSet=="function"?WeakSet:Set,Oe=null;function Ts(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){Ot(n,i,c)}else a.current=null}function _u(n,i,a){try{a()}catch(c){Ot(n,i,c)}}var Jh=!1;function z_(n,i){if(Nc=uo,n=Nf(),Mc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var h=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{a.nodeType,v.nodeType}catch{a=null;break e}var T=0,F=-1,G=-1,ae=0,ye=0,we=n,xe=null;t:for(;;){for(var Ue;we!==a||h!==0&&we.nodeType!==3||(F=T+h),we!==v||c!==0&&we.nodeType!==3||(G=T+c),we.nodeType===3&&(T+=we.nodeValue.length),(Ue=we.firstChild)!==null;)xe=we,we=Ue;for(;;){if(we===n)break t;if(xe===a&&++ae===h&&(F=T),xe===v&&++ye===c&&(G=T),(Ue=we.nextSibling)!==null)break;we=xe,xe=we.parentNode}we=Ue}a=F===-1||G===-1?null:{start:F,end:G}}else a=null}a=a||{start:0,end:0}}else a=null;for(Pc={focusedElem:n,selectionRange:a},uo=!1,Oe=i;Oe!==null;)if(i=Oe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Oe=n;else for(;Oe!==null;){i=Oe;try{var ke=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(ke!==null){var Be=ke.memoizedProps,zt=ke.memoizedState,ee=i.stateNode,X=ee.getSnapshotBeforeUpdate(i.elementType===i.type?Be:ei(i.type,Be),zt);ee.__reactInternalSnapshotBeforeUpdate=X}break;case 3:var ne=i.stateNode.containerInfo;ne.nodeType===1?ne.textContent="":ne.nodeType===9&&ne.documentElement&&ne.removeChild(ne.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Te){Ot(i,i.return,Te)}if(n=i.sibling,n!==null){n.return=i.return,Oe=n;break}Oe=i.return}return ke=Jh,Jh=!1,ke}function Oa(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var v=h.destroy;h.destroy=void 0,v!==void 0&&_u(i,a,v)}h=h.next}while(h!==c)}}function $o(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function xu(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Qh(n){var i=n.alternate;i!==null&&(n.alternate=null,Qh(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[ui],delete i[Aa],delete i[Ic],delete i[S_],delete i[M_])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function ep(n){return n.tag===5||n.tag===3||n.tag===4}function tp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||ep(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function yu(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Eo));else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,a),n=n.sibling;n!==null;)yu(n,i,a),n=n.sibling}function Su(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Su(n,i,a),n=n.sibling;n!==null;)Su(n,i,a),n=n.sibling}var an=null,ti=!1;function rr(n,i,a){for(a=a.child;a!==null;)np(n,i,a),a=a.sibling}function np(n,i,a){if(ln&&typeof ln.onCommitFiberUnmount=="function")try{ln.onCommitFiberUnmount(Qe,a)}catch{}switch(a.tag){case 5:fn||Ts(a,i);case 6:var c=an,h=ti;an=null,rr(n,i,a),an=c,ti=h,an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):an.removeChild(a.stateNode));break;case 18:an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?Uc(n.parentNode,a):n.nodeType===1&&Uc(n,a),ma(n)):Uc(an,a.stateNode));break;case 4:c=an,h=ti,an=a.stateNode.containerInfo,ti=!0,rr(n,i,a),an=c,ti=h;break;case 0:case 11:case 14:case 15:if(!fn&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var v=h,T=v.destroy;v=v.tag,T!==void 0&&((v&2)!==0||(v&4)!==0)&&_u(a,i,T),h=h.next}while(h!==c)}rr(n,i,a);break;case 1:if(!fn&&(Ts(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(F){Ot(a,i,F)}rr(n,i,a);break;case 21:rr(n,i,a);break;case 22:a.mode&1?(fn=(c=fn)||a.memoizedState!==null,rr(n,i,a),fn=c):rr(n,i,a);break;default:rr(n,i,a)}}function ip(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new k_),i.forEach(function(c){var h=q_.bind(null,n,c);a.has(c)||(a.add(c),c.then(h,h))})}}function ni(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var h=a[c];try{var v=n,T=i,F=T;e:for(;F!==null;){switch(F.tag){case 5:an=F.stateNode,ti=!1;break e;case 3:an=F.stateNode.containerInfo,ti=!0;break e;case 4:an=F.stateNode.containerInfo,ti=!0;break e}F=F.return}if(an===null)throw Error(t(160));np(v,T,h),an=null,ti=!1;var G=h.alternate;G!==null&&(G.return=null),h.return=null}catch(ae){Ot(h,i,ae)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)rp(i,n),i=i.sibling}function rp(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(ni(i,n),hi(n),c&4){try{Oa(3,n,n.return),$o(3,n)}catch(Be){Ot(n,n.return,Be)}try{Oa(5,n,n.return)}catch(Be){Ot(n,n.return,Be)}}break;case 1:ni(i,n),hi(n),c&512&&a!==null&&Ts(a,a.return);break;case 5:if(ni(i,n),hi(n),c&512&&a!==null&&Ts(a,a.return),n.flags&32){var h=n.stateNode;try{He(h,"")}catch(Be){Ot(n,n.return,Be)}}if(c&4&&(h=n.stateNode,h!=null)){var v=n.memoizedProps,T=a!==null?a.memoizedProps:v,F=n.type,G=n.updateQueue;if(n.updateQueue=null,G!==null)try{F==="input"&&v.type==="radio"&&v.name!=null&&it(h,v),rt(F,T);var ae=rt(F,v);for(T=0;T<G.length;T+=2){var ye=G[T],we=G[T+1];ye==="style"?st(h,we):ye==="dangerouslySetInnerHTML"?be(h,we):ye==="children"?He(h,we):N(h,ye,we,ae)}switch(F){case"input":ot(h,v);break;case"textarea":Ee(h,v);break;case"select":var xe=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!v.multiple;var Ue=v.value;Ue!=null?ce(h,!!v.multiple,Ue,!1):xe!==!!v.multiple&&(v.defaultValue!=null?ce(h,!!v.multiple,v.defaultValue,!0):ce(h,!!v.multiple,v.multiple?[]:"",!1))}h[Aa]=v}catch(Be){Ot(n,n.return,Be)}}break;case 6:if(ni(i,n),hi(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,v=n.memoizedProps;try{h.nodeValue=v}catch(Be){Ot(n,n.return,Be)}}break;case 3:if(ni(i,n),hi(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{ma(i.containerInfo)}catch(Be){Ot(n,n.return,Be)}break;case 4:ni(i,n),hi(n);break;case 13:ni(i,n),hi(n),h=n.child,h.flags&8192&&(v=h.memoizedState!==null,h.stateNode.isHidden=v,!v||h.alternate!==null&&h.alternate.memoizedState!==null||(wu=ze())),c&4&&ip(n);break;case 22:if(ye=a!==null&&a.memoizedState!==null,n.mode&1?(fn=(ae=fn)||ye,ni(i,n),fn=ae):ni(i,n),hi(n),c&8192){if(ae=n.memoizedState!==null,(n.stateNode.isHidden=ae)&&!ye&&(n.mode&1)!==0)for(Oe=n,ye=n.child;ye!==null;){for(we=Oe=ye;Oe!==null;){switch(xe=Oe,Ue=xe.child,xe.tag){case 0:case 11:case 14:case 15:Oa(4,xe,xe.return);break;case 1:Ts(xe,xe.return);var ke=xe.stateNode;if(typeof ke.componentWillUnmount=="function"){c=xe,a=xe.return;try{i=c,ke.props=i.memoizedProps,ke.state=i.memoizedState,ke.componentWillUnmount()}catch(Be){Ot(c,a,Be)}}break;case 5:Ts(xe,xe.return);break;case 22:if(xe.memoizedState!==null){op(we);continue}}Ue!==null?(Ue.return=xe,Oe=Ue):op(we)}ye=ye.sibling}e:for(ye=null,we=n;;){if(we.tag===5){if(ye===null){ye=we;try{h=we.stateNode,ae?(v=h.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(F=we.stateNode,G=we.memoizedProps.style,T=G!=null&&G.hasOwnProperty("display")?G.display:null,F.style.display=Ie("display",T))}catch(Be){Ot(n,n.return,Be)}}}else if(we.tag===6){if(ye===null)try{we.stateNode.nodeValue=ae?"":we.memoizedProps}catch(Be){Ot(n,n.return,Be)}}else if((we.tag!==22&&we.tag!==23||we.memoizedState===null||we===n)&&we.child!==null){we.child.return=we,we=we.child;continue}if(we===n)break e;for(;we.sibling===null;){if(we.return===null||we.return===n)break e;ye===we&&(ye=null),we=we.return}ye===we&&(ye=null),we.sibling.return=we.return,we=we.sibling}}break;case 19:ni(i,n),hi(n),c&4&&ip(n);break;case 21:break;default:ni(i,n),hi(n)}}function hi(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(ep(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(He(h,""),c.flags&=-33);var v=tp(n);Su(n,v,h);break;case 3:case 4:var T=c.stateNode.containerInfo,F=tp(n);yu(n,F,T);break;default:throw Error(t(161))}}catch(G){Ot(n,n.return,G)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function B_(n,i,a){Oe=n,sp(n)}function sp(n,i,a){for(var c=(n.mode&1)!==0;Oe!==null;){var h=Oe,v=h.child;if(h.tag===22&&c){var T=h.memoizedState!==null||Wo;if(!T){var F=h.alternate,G=F!==null&&F.memoizedState!==null||fn;F=Wo;var ae=fn;if(Wo=T,(fn=G)&&!ae)for(Oe=h;Oe!==null;)T=Oe,G=T.child,T.tag===22&&T.memoizedState!==null?lp(h):G!==null?(G.return=T,Oe=G):lp(h);for(;v!==null;)Oe=v,sp(v),v=v.sibling;Oe=h,Wo=F,fn=ae}ap(n)}else(h.subtreeFlags&8772)!==0&&v!==null?(v.return=h,Oe=v):ap(n)}}function ap(n){for(;Oe!==null;){var i=Oe;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:fn||$o(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!fn)if(a===null)c.componentDidMount();else{var h=i.elementType===i.type?a.memoizedProps:ei(i.type,a.memoizedProps);c.componentDidUpdate(h,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var v=i.updateQueue;v!==null&&oh(i,v,c);break;case 3:var T=i.updateQueue;if(T!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}oh(i,T,a)}break;case 5:var F=i.stateNode;if(a===null&&i.flags&4){a=F;var G=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":G.autoFocus&&a.focus();break;case"img":G.src&&(a.src=G.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var ae=i.alternate;if(ae!==null){var ye=ae.memoizedState;if(ye!==null){var we=ye.dehydrated;we!==null&&ma(we)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}fn||i.flags&512&&xu(i)}catch(xe){Ot(i,i.return,xe)}}if(i===n){Oe=null;break}if(a=i.sibling,a!==null){a.return=i.return,Oe=a;break}Oe=i.return}}function op(n){for(;Oe!==null;){var i=Oe;if(i===n){Oe=null;break}var a=i.sibling;if(a!==null){a.return=i.return,Oe=a;break}Oe=i.return}}function lp(n){for(;Oe!==null;){var i=Oe;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{$o(4,i)}catch(G){Ot(i,a,G)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(G){Ot(i,h,G)}}var v=i.return;try{xu(i)}catch(G){Ot(i,v,G)}break;case 5:var T=i.return;try{xu(i)}catch(G){Ot(i,T,G)}}}catch(G){Ot(i,i.return,G)}if(i===n){Oe=null;break}var F=i.sibling;if(F!==null){F.return=i.return,Oe=F;break}Oe=i.return}}var j_=Math.ceil,Xo=U.ReactCurrentDispatcher,Mu=U.ReactCurrentOwner,Wn=U.ReactCurrentBatchConfig,_t=0,en=null,jt=null,on=0,Fn=0,As=Qi(0),Xt=0,ka=null,Ir=0,qo=0,Eu=0,za=null,Tn=null,wu=0,bs=1/0,Pi=null,Yo=!1,Tu=null,sr=null,Ko=!1,ar=null,Zo=0,Ba=0,Au=null,Jo=-1,Qo=0;function _n(){return(_t&6)!==0?ze():Jo!==-1?Jo:Jo=ze()}function or(n){return(n.mode&1)===0?1:(_t&2)!==0&&on!==0?on&-on:w_.transition!==null?(Qo===0&&(Qo=ef()),Qo):(n=wt,n!==0||(n=window.event,n=n===void 0?16:uf(n.type)),n)}function ii(n,i,a,c){if(50<Ba)throw Ba=0,Au=null,Error(t(185));ua(n,a,c),((_t&2)===0||n!==en)&&(n===en&&((_t&2)===0&&(qo|=a),Xt===4&&lr(n,on)),An(n,c),a===1&&_t===0&&(i.mode&1)===0&&(bs=ze()+500,bo&&tr()))}function An(n,i){var a=n.callbackNode;ac(n,i);var c=sn(n,n===en?on:0);if(c===0)a!==null&&Ge(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&Ge(a),i===1)n.tag===0?E_(up.bind(null,n)):Yf(up.bind(null,n)),x_(function(){(_t&6)===0&&tr()}),a=null;else{switch(tf(c)){case 1:a=Dt;break;case 4:a=Gt;break;case 16:a=Jt;break;case 536870912:a=vt;break;default:a=Jt}a=_p(a,cp.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function cp(n,i){if(Jo=-1,Qo=0,(_t&6)!==0)throw Error(t(327));var a=n.callbackNode;if(Cs()&&n.callbackNode!==a)return null;var c=sn(n,n===en?on:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=el(n,c);else{i=c;var h=_t;_t|=2;var v=fp();(en!==n||on!==i)&&(Pi=null,bs=ze()+500,Or(n,i));do try{G_();break}catch(F){dp(n,F)}while(!0);Gc(),Xo.current=v,_t=h,jt!==null?i=0:(en=null,on=0,i=Xt)}if(i!==0){if(i===2&&(h=as(n),h!==0&&(c=h,i=bu(n,h))),i===1)throw a=ka,Or(n,0),lr(n,c),An(n,ze()),a;if(i===6)lr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!H_(h)&&(i=el(n,c),i===2&&(v=as(n),v!==0&&(c=v,i=bu(n,v))),i===1))throw a=ka,Or(n,0),lr(n,c),An(n,ze()),a;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:kr(n,Tn,Pi);break;case 3:if(lr(n,c),(c&130023424)===c&&(i=wu+500-ze(),10<i)){if(sn(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){_n(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Dc(kr.bind(null,n,Tn,Pi),i);break}kr(n,Tn,Pi);break;case 4:if(lr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var T=31-Wt(c);v=1<<T,T=i[T],T>h&&(h=T),c&=~v}if(c=h,c=ze()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*j_(c/1960))-c,10<c){n.timeoutHandle=Dc(kr.bind(null,n,Tn,Pi),c);break}kr(n,Tn,Pi);break;case 5:kr(n,Tn,Pi);break;default:throw Error(t(329))}}}return An(n,ze()),n.callbackNode===a?cp.bind(null,n):null}function bu(n,i){var a=za;return n.current.memoizedState.isDehydrated&&(Or(n,i).flags|=256),n=el(n,i),n!==2&&(i=Tn,Tn=a,i!==null&&Cu(i)),n}function Cu(n){Tn===null?Tn=n:Tn.push.apply(Tn,n)}function H_(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var h=a[c],v=h.getSnapshot;h=h.value;try{if(!Jn(v(),h))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function lr(n,i){for(i&=~Eu,i&=~qo,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Wt(i),c=1<<a;n[a]=-1,i&=~c}}function up(n){if((_t&6)!==0)throw Error(t(327));Cs();var i=sn(n,0);if((i&1)===0)return An(n,ze()),null;var a=el(n,i);if(n.tag!==0&&a===2){var c=as(n);c!==0&&(i=c,a=bu(n,c))}if(a===1)throw a=ka,Or(n,0),lr(n,i),An(n,ze()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,kr(n,Tn,Pi),An(n,ze()),null}function Ru(n,i){var a=_t;_t|=1;try{return n(i)}finally{_t=a,_t===0&&(bs=ze()+500,bo&&tr())}}function Fr(n){ar!==null&&ar.tag===0&&(_t&6)===0&&Cs();var i=_t;_t|=1;var a=Wn.transition,c=wt;try{if(Wn.transition=null,wt=1,n)return n()}finally{wt=c,Wn.transition=a,_t=i,(_t&6)===0&&tr()}}function Nu(){Fn=As.current,Pt(As)}function Or(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,__(a)),jt!==null)for(a=jt.return;a!==null;){var c=a;switch(zc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&To();break;case 3:Es(),Pt(Mn),Pt(cn),Jc();break;case 5:Kc(c);break;case 4:Es();break;case 13:Pt(It);break;case 19:Pt(It);break;case 10:Wc(c.type._context);break;case 22:case 23:Nu()}a=a.return}if(en=n,jt=n=cr(n.current,null),on=Fn=i,Xt=0,ka=null,Eu=qo=Ir=0,Tn=za=null,Lr!==null){for(i=0;i<Lr.length;i++)if(a=Lr[i],c=a.interleaved,c!==null){a.interleaved=null;var h=c.next,v=a.pending;if(v!==null){var T=v.next;v.next=h,c.next=T}a.pending=c}Lr=null}return n}function dp(n,i){do{var a=jt;try{if(Gc(),Oo.current=jo,ko){for(var c=Ft.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}ko=!1}if(Ur=0,Qt=$t=Ft=null,La=!1,Da=0,Mu.current=null,a===null||a.return===null){Xt=1,ka=i,jt=null;break}e:{var v=n,T=a.return,F=a,G=i;if(i=on,F.flags|=32768,G!==null&&typeof G=="object"&&typeof G.then=="function"){var ae=G,ye=F,we=ye.tag;if((ye.mode&1)===0&&(we===0||we===11||we===15)){var xe=ye.alternate;xe?(ye.updateQueue=xe.updateQueue,ye.memoizedState=xe.memoizedState,ye.lanes=xe.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var Ue=Fh(T);if(Ue!==null){Ue.flags&=-257,Oh(Ue,T,F,v,i),Ue.mode&1&&Ih(v,ae,i),i=Ue,G=ae;var ke=i.updateQueue;if(ke===null){var Be=new Set;Be.add(G),i.updateQueue=Be}else ke.add(G);break e}else{if((i&1)===0){Ih(v,ae,i),Pu();break e}G=Error(t(426))}}else if(Ut&&F.mode&1){var zt=Fh(T);if(zt!==null){(zt.flags&65536)===0&&(zt.flags|=256),Oh(zt,T,F,v,i),Hc(ws(G,F));break e}}v=G=ws(G,F),Xt!==4&&(Xt=2),za===null?za=[v]:za.push(v),v=T;do{switch(v.tag){case 3:v.flags|=65536,i&=-i,v.lanes|=i;var ee=Dh(v,G,i);ah(v,ee);break e;case 1:F=G;var X=v.type,ne=v.stateNode;if((v.flags&128)===0&&(typeof X.getDerivedStateFromError=="function"||ne!==null&&typeof ne.componentDidCatch=="function"&&(sr===null||!sr.has(ne)))){v.flags|=65536,i&=-i,v.lanes|=i;var Te=Uh(v,F,i);ah(v,Te);break e}}v=v.return}while(v!==null)}pp(a)}catch(Ve){i=Ve,jt===a&&a!==null&&(jt=a=a.return);continue}break}while(!0)}function fp(){var n=Xo.current;return Xo.current=jo,n===null?jo:n}function Pu(){(Xt===0||Xt===3||Xt===2)&&(Xt=4),en===null||(Ir&268435455)===0&&(qo&268435455)===0||lr(en,on)}function el(n,i){var a=_t;_t|=2;var c=fp();(en!==n||on!==i)&&(Pi=null,Or(n,i));do try{V_();break}catch(h){dp(n,h)}while(!0);if(Gc(),_t=a,Xo.current=c,jt!==null)throw Error(t(261));return en=null,on=0,Xt}function V_(){for(;jt!==null;)hp(jt)}function G_(){for(;jt!==null&&!Je();)hp(jt)}function hp(n){var i=vp(n.alternate,n,Fn);n.memoizedProps=n.pendingProps,i===null?pp(n):jt=i,Mu.current=null}function pp(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=F_(a,i,Fn),a!==null){jt=a;return}}else{if(a=O_(a,i),a!==null){a.flags&=32767,jt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Xt=6,jt=null;return}}if(i=i.sibling,i!==null){jt=i;return}jt=i=n}while(i!==null);Xt===0&&(Xt=5)}function kr(n,i,a){var c=wt,h=Wn.transition;try{Wn.transition=null,wt=1,W_(n,i,a,c)}finally{Wn.transition=h,wt=c}return null}function W_(n,i,a,c){do Cs();while(ar!==null);if((_t&6)!==0)throw Error(t(327));a=n.finishedWork;var h=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=a.lanes|a.childLanes;if(Tv(n,v),n===en&&(jt=en=null,on=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Ko||(Ko=!0,_p(Jt,function(){return Cs(),null})),v=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||v){v=Wn.transition,Wn.transition=null;var T=wt;wt=1;var F=_t;_t|=4,Mu.current=null,z_(n,a),rp(a,n),d_(Pc),uo=!!Nc,Pc=Nc=null,n.current=a,B_(a),at(),_t=F,wt=T,Wn.transition=v}else n.current=a;if(Ko&&(Ko=!1,ar=n,Zo=h),v=n.pendingLanes,v===0&&(sr=null),Ct(a.stateNode),An(n,ze()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)h=i[a],c(h.value,{componentStack:h.stack,digest:h.digest});if(Yo)throw Yo=!1,n=Tu,Tu=null,n;return(Zo&1)!==0&&n.tag!==0&&Cs(),v=n.pendingLanes,(v&1)!==0?n===Au?Ba++:(Ba=0,Au=n):Ba=0,tr(),null}function Cs(){if(ar!==null){var n=tf(Zo),i=Wn.transition,a=wt;try{if(Wn.transition=null,wt=16>n?16:n,ar===null)var c=!1;else{if(n=ar,ar=null,Zo=0,(_t&6)!==0)throw Error(t(331));var h=_t;for(_t|=4,Oe=n.current;Oe!==null;){var v=Oe,T=v.child;if((Oe.flags&16)!==0){var F=v.deletions;if(F!==null){for(var G=0;G<F.length;G++){var ae=F[G];for(Oe=ae;Oe!==null;){var ye=Oe;switch(ye.tag){case 0:case 11:case 15:Oa(8,ye,v)}var we=ye.child;if(we!==null)we.return=ye,Oe=we;else for(;Oe!==null;){ye=Oe;var xe=ye.sibling,Ue=ye.return;if(Qh(ye),ye===ae){Oe=null;break}if(xe!==null){xe.return=Ue,Oe=xe;break}Oe=Ue}}}var ke=v.alternate;if(ke!==null){var Be=ke.child;if(Be!==null){ke.child=null;do{var zt=Be.sibling;Be.sibling=null,Be=zt}while(Be!==null)}}Oe=v}}if((v.subtreeFlags&2064)!==0&&T!==null)T.return=v,Oe=T;else e:for(;Oe!==null;){if(v=Oe,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:Oa(9,v,v.return)}var ee=v.sibling;if(ee!==null){ee.return=v.return,Oe=ee;break e}Oe=v.return}}var X=n.current;for(Oe=X;Oe!==null;){T=Oe;var ne=T.child;if((T.subtreeFlags&2064)!==0&&ne!==null)ne.return=T,Oe=ne;else e:for(T=X;Oe!==null;){if(F=Oe,(F.flags&2048)!==0)try{switch(F.tag){case 0:case 11:case 15:$o(9,F)}}catch(Ve){Ot(F,F.return,Ve)}if(F===T){Oe=null;break e}var Te=F.sibling;if(Te!==null){Te.return=F.return,Oe=Te;break e}Oe=F.return}}if(_t=h,tr(),ln&&typeof ln.onPostCommitFiberRoot=="function")try{ln.onPostCommitFiberRoot(Qe,n)}catch{}c=!0}return c}finally{wt=a,Wn.transition=i}}return!1}function mp(n,i,a){i=ws(a,i),i=Dh(n,i,1),n=ir(n,i,1),i=_n(),n!==null&&(ua(n,1,i),An(n,i))}function Ot(n,i,a){if(n.tag===3)mp(n,n,a);else for(;i!==null;){if(i.tag===3){mp(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(sr===null||!sr.has(c))){n=ws(a,n),n=Uh(i,n,1),i=ir(i,n,1),n=_n(),i!==null&&(ua(i,1,n),An(i,n));break}}i=i.return}}function $_(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=_n(),n.pingedLanes|=n.suspendedLanes&a,en===n&&(on&a)===a&&(Xt===4||Xt===3&&(on&130023424)===on&&500>ze()-wu?Or(n,0):Eu|=a),An(n,i)}function gp(n,i){i===0&&((n.mode&1)===0?i=1:(i=Ln,Ln<<=1,(Ln&130023424)===0&&(Ln=4194304)));var a=_n();n=Ci(n,i),n!==null&&(ua(n,i,a),An(n,a))}function X_(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),gp(n,a)}function q_(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(a=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),gp(n,a)}var vp;vp=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Mn.current)wn=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return wn=!1,I_(n,i,a);wn=(n.flags&131072)!==0}else wn=!1,Ut&&(i.flags&1048576)!==0&&Kf(i,Ro,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Go(n,i),n=i.pendingProps;var h=gs(i,cn.current);Ms(i,a),h=tu(null,i,c,n,h,a);var v=nu();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,En(c)?(v=!0,Ao(i)):v=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,qc(i),h.updater=Ho,i.stateNode=h,h._reactInternals=i,lu(i,c,n,a),i=fu(null,i,c,!0,v,a)):(i.tag=0,Ut&&v&&kc(i),vn(null,i,h,a),i=i.child),i;case 16:c=i.elementType;e:{switch(Go(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=K_(c),n=ei(c,n),h){case 0:i=du(null,i,c,n,a);break e;case 1:i=Vh(null,i,c,n,a);break e;case 11:i=kh(null,i,c,n,a);break e;case 14:i=zh(null,i,c,ei(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),du(n,i,c,h,a);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Vh(n,i,c,h,a);case 3:e:{if(Gh(i),n===null)throw Error(t(387));c=i.pendingProps,v=i.memoizedState,h=v.element,sh(n,i),Io(i,c,null,a);var T=i.memoizedState;if(c=T.element,v.isDehydrated)if(v={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=v,i.memoizedState=v,i.flags&256){h=ws(Error(t(423)),i),i=Wh(n,i,c,a,h);break e}else if(c!==h){h=ws(Error(t(424)),i),i=Wh(n,i,c,a,h);break e}else for(In=Ji(i.stateNode.containerInfo.firstChild),Un=i,Ut=!0,Qn=null,a=ih(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(xs(),c===h){i=Ni(n,i,a);break e}vn(n,i,c,a)}i=i.child}return i;case 5:return lh(i),n===null&&jc(i),c=i.type,h=i.pendingProps,v=n!==null?n.memoizedProps:null,T=h.children,Lc(c,h)?T=null:v!==null&&Lc(c,v)&&(i.flags|=32),Hh(n,i),vn(n,i,T,a),i.child;case 6:return n===null&&jc(i),null;case 13:return $h(n,i,a);case 4:return Yc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ys(i,null,c,a):vn(n,i,c,a),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),kh(n,i,c,h,a);case 7:return vn(n,i,i.pendingProps,a),i.child;case 8:return vn(n,i,i.pendingProps.children,a),i.child;case 12:return vn(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,v=i.memoizedProps,T=h.value,Rt(Lo,c._currentValue),c._currentValue=T,v!==null)if(Jn(v.value,T)){if(v.children===h.children&&!Mn.current){i=Ni(n,i,a);break e}}else for(v=i.child,v!==null&&(v.return=i);v!==null;){var F=v.dependencies;if(F!==null){T=v.child;for(var G=F.firstContext;G!==null;){if(G.context===c){if(v.tag===1){G=Ri(-1,a&-a),G.tag=2;var ae=v.updateQueue;if(ae!==null){ae=ae.shared;var ye=ae.pending;ye===null?G.next=G:(G.next=ye.next,ye.next=G),ae.pending=G}}v.lanes|=a,G=v.alternate,G!==null&&(G.lanes|=a),$c(v.return,a,i),F.lanes|=a;break}G=G.next}}else if(v.tag===10)T=v.type===i.type?null:v.child;else if(v.tag===18){if(T=v.return,T===null)throw Error(t(341));T.lanes|=a,F=T.alternate,F!==null&&(F.lanes|=a),$c(T,a,i),T=v.sibling}else T=v.child;if(T!==null)T.return=v;else for(T=v;T!==null;){if(T===i){T=null;break}if(v=T.sibling,v!==null){v.return=T.return,T=v;break}T=T.return}v=T}vn(n,i,h.children,a),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Ms(i,a),h=Vn(h),c=c(h),i.flags|=1,vn(n,i,c,a),i.child;case 14:return c=i.type,h=ei(c,i.pendingProps),h=ei(c.type,h),zh(n,i,c,h,a);case 15:return Bh(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Go(n,i),i.tag=1,En(c)?(n=!0,Ao(i)):n=!1,Ms(i,a),Ph(i,c,h),lu(i,c,h,a),fu(null,i,c,!0,n,a);case 19:return qh(n,i,a);case 22:return jh(n,i,a)}throw Error(t(156,i.tag))};function _p(n,i){return je(n,i)}function Y_(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function $n(n,i,a,c){return new Y_(n,i,a,c)}function Lu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function K_(n){if(typeof n=="function")return Lu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===W)return 11;if(n===oe)return 14}return 2}function cr(n,i){var a=n.alternate;return a===null?(a=$n(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function tl(n,i,a,c,h,v){var T=2;if(c=n,typeof n=="function")Lu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case k:return zr(a.children,h,v,i);case $:T=8,h|=8;break;case R:return n=$n(12,a,i,h|2),n.elementType=R,n.lanes=v,n;case j:return n=$n(13,a,i,h),n.elementType=j,n.lanes=v,n;case te:return n=$n(19,a,i,h),n.elementType=te,n.lanes=v,n;case de:return nl(a,h,v,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case A:T=10;break e;case D:T=9;break e;case W:T=11;break e;case oe:T=14;break e;case he:T=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=$n(T,a,i,h),i.elementType=n,i.type=c,i.lanes=v,i}function zr(n,i,a,c){return n=$n(7,n,c,i),n.lanes=a,n}function nl(n,i,a,c){return n=$n(22,n,c,i),n.elementType=de,n.lanes=a,n.stateNode={isHidden:!1},n}function Du(n,i,a){return n=$n(6,n,null,i),n.lanes=a,n}function Uu(n,i,a){return i=$n(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Z_(n,i,a,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=oc(0),this.expirationTimes=oc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=oc(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Iu(n,i,a,c,h,v,T,F,G){return n=new Z_(n,i,a,F,G),i===1?(i=1,v===!0&&(i|=8)):i=0,v=$n(3,null,null,i),n.current=v,v.stateNode=n,v.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},qc(v),n}function J_(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:I,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function xp(n){if(!n)return er;n=n._reactInternals;e:{if(P(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(En(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(En(a))return Xf(n,a,i)}return i}function yp(n,i,a,c,h,v,T,F,G){return n=Iu(a,c,!0,n,h,v,T,F,G),n.context=xp(null),a=n.current,c=_n(),h=or(a),v=Ri(c,h),v.callback=i??null,ir(a,v,h),n.current.lanes=h,ua(n,h,c),An(n,c),n}function il(n,i,a,c){var h=i.current,v=_n(),T=or(h);return a=xp(a),i.context===null?i.context=a:i.pendingContext=a,i=Ri(v,T),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ir(h,i,T),n!==null&&(ii(n,h,T,v),Uo(n,h,T)),T}function rl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Sp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function Fu(n,i){Sp(n,i),(n=n.alternate)&&Sp(n,i)}function Q_(){return null}var Mp=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ou(n){this._internalRoot=n}sl.prototype.render=Ou.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));il(n,i,null,null)},sl.prototype.unmount=Ou.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Fr(function(){il(null,n,null,null)}),i[wi]=null}};function sl(n){this._internalRoot=n}sl.prototype.unstable_scheduleHydration=function(n){if(n){var i=sf();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Yi.length&&i!==0&&i<Yi[a].priority;a++);Yi.splice(a,0,n),a===0&&lf(n)}};function ku(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function al(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Ep(){}function ex(n,i,a,c,h){if(h){if(typeof c=="function"){var v=c;c=function(){var ae=rl(T);v.call(ae)}}var T=yp(i,c,n,0,null,!1,!1,"",Ep);return n._reactRootContainer=T,n[wi]=T.current,wa(n.nodeType===8?n.parentNode:n),Fr(),T}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var F=c;c=function(){var ae=rl(G);F.call(ae)}}var G=Iu(n,0,!1,null,null,!1,!1,"",Ep);return n._reactRootContainer=G,n[wi]=G.current,wa(n.nodeType===8?n.parentNode:n),Fr(function(){il(i,G,a,c)}),G}function ol(n,i,a,c,h){var v=a._reactRootContainer;if(v){var T=v;if(typeof h=="function"){var F=h;h=function(){var G=rl(T);F.call(G)}}il(i,T,n,h)}else T=ex(a,i,n,h,c);return rl(T)}nf=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ei(i.pendingLanes);a!==0&&(lc(i,a|1),An(i,ze()),(_t&6)===0&&(bs=ze()+500,tr()))}break;case 13:Fr(function(){var c=Ci(n,1);if(c!==null){var h=_n();ii(c,n,1,h)}}),Fu(n,1)}},cc=function(n){if(n.tag===13){var i=Ci(n,134217728);if(i!==null){var a=_n();ii(i,n,134217728,a)}Fu(n,134217728)}},rf=function(n){if(n.tag===13){var i=or(n),a=Ci(n,i);if(a!==null){var c=_n();ii(a,n,i,c)}Fu(n,i)}},sf=function(){return wt},af=function(n,i){var a=wt;try{return wt=n,i()}finally{wt=a}},q=function(n,i,a){switch(i){case"input":if(ot(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var h=wo(c);if(!h)throw Error(t(90));Ae(c),ot(c,h)}}}break;case"textarea":Ee(n,a);break;case"select":i=a.value,i!=null&&ce(n,!!a.multiple,i,!1)}},Vt=Ru,St=Fr;var tx={usingClientEntryPoint:!1,Events:[ba,ps,wo,$e,pt,Ru]},ja={findFiberByHostInstance:Cr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},nx={bundleType:ja.bundleType,version:ja.version,rendererPackageName:ja.rendererPackageName,rendererConfig:ja.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:U.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=re(n),n===null?null:n.stateNode},findFiberByHostInstance:ja.findFiberByHostInstance||Q_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ll=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ll.isDisabled&&ll.supportsFiber)try{Qe=ll.inject(nx),ln=ll}catch{}}return bn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=tx,bn.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ku(i))throw Error(t(200));return J_(n,i,null,a)},bn.createRoot=function(n,i){if(!ku(n))throw Error(t(299));var a=!1,c="",h=Mp;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Iu(n,1,!1,null,null,a,!1,c,h),n[wi]=i.current,wa(n.nodeType===8?n.parentNode:n),new Ou(i)},bn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=re(i),n=n===null?null:n.stateNode,n},bn.flushSync=function(n){return Fr(n)},bn.hydrate=function(n,i,a){if(!al(i))throw Error(t(200));return ol(null,n,i,!0,a)},bn.hydrateRoot=function(n,i,a){if(!ku(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,h=!1,v="",T=Mp;if(a!=null&&(a.unstable_strictMode===!0&&(h=!0),a.identifierPrefix!==void 0&&(v=a.identifierPrefix),a.onRecoverableError!==void 0&&(T=a.onRecoverableError)),i=yp(i,null,n,1,a??null,h,!1,v,T),n[wi]=i.current,wa(n),c)for(n=0;n<c.length;n++)a=c[n],h=a._getVersion,h=h(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,h]:i.mutableSourceEagerHydrationData.push(a,h);return new sl(i)},bn.render=function(n,i,a){if(!al(i))throw Error(t(200));return ol(null,n,i,!1,a)},bn.unmountComponentAtNode=function(n){if(!al(n))throw Error(t(40));return n._reactRootContainer?(Fr(function(){ol(null,null,n,!1,function(){n._reactRootContainer=null,n[wi]=null})}),!0):!1},bn.unstable_batchedUpdates=Ru,bn.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!al(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ol(n,i,a,!1,c)},bn.version="18.3.1-next-f1338f8080-20240426",bn}var Pp;function px(){if(Pp)return ju.exports;Pp=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),ju.exports=hx(),ju.exports}var Lp;function mx(){if(Lp)return cl;Lp=1;var r=px();return cl.createRoot=r.createRoot,cl.hydrateRoot=r.hydrateRoot,cl}var gx=mx();const Yl="/api/3dprint";class vx extends Error{constructor(t,s,o){super(t);Ha(this,"status");Ha(this,"code");Ha(this,"date");Ha(this,"reservations");this.status=s,this.code=o==null?void 0:o.code,this.date=o==null?void 0:o.date,this.reservations=o==null?void 0:o.reservations}}async function yt(r,e){const t=await fetch(`${Yl}/${r}`,{credentials:"include",...e,headers:{"Content-Type":"application/json",...e==null?void 0:e.headers}}),s=await t.json().catch(()=>({}));if(!t.ok)throw new vx(s.error||`HTTP ${t.status}`,t.status,s);return s}async function _x(){const r=await fetch("/api/apps/3dprint-management/access",{credentials:"include"});return r.status===401?"login":r.status===403?"denied":r.ok?"ok":"denied"}function wg(r){return{id:r.id,date:r.date,machine:r.machine,kind:r.kind,start:r.start,end:r.end,title:r.title,file:r.file,fileSize:r.file_size,note:r.note,who:r.who,status:r.status,createdAt:r.created_at,adminNote:r.status_comment??void 0,printer_id:r.printer_id}}async function xx(r,e){return{applications:(await yt(`admin/calendar/cancelled-applications?from=${r}&to=${e}`)).applications.map(s=>wg(s))}}async function yx(r){return yt(`admin/reservations/${r}/restore`,{method:"POST",body:"{}"})}async function Sx(r,e){const t=await yt(`calendar/applications?from=${r}&to=${e}`);return{applications:t.applications.map(s=>wg(s)),staff_dates:t.staff_dates??{}}}async function Mx(){return(await yt("admin/members")).members.map(e=>({id:e.id,name:e.name,homeroom:e.homeroom,student_number:e.student_number,color_index:e.color_index,discord_user_id:e.discord_user_id,user_id:e.user_id??null}))}async function Dp(){return yt("admin/session")}async function Ex(){return(await yt("admin/management-users")).users}async function Up(r,e){return yt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({user_id:e})})}async function wx(r){return yt("admin/members",{method:"POST",body:JSON.stringify(r)})}async function Tx(r){return yt(`admin/members/${r}`,{method:"DELETE"})}function ul(r){return`${r.member_id}\0${r.date}`}function dl(r){return`${r.printer_id}\0${r.date}`}function Ip(r){const e=new Map;for(const t of r){const s=e.get(t.member_id)??[];s.push(t.date),e.set(t.member_id,s)}return e}function Fp(r){const e=new Map;for(const t of r){const s=e.get(t.printer_id)??[];s.push(t.date),e.set(t.printer_id,s)}return e}function Tg(r,e){const t=new Set(r.map(ul)),s=new Set(e.map(ul)),o=e.filter(d=>!t.has(ul(d))),l=r.filter(d=>!s.has(ul(d)));return{added:o,removed:l}}function Ag(r,e){const t=new Set(r.map(dl)),s=new Set(e.map(dl)),o=e.filter(d=>!t.has(dl(d))),l=r.filter(d=>!s.has(dl(d)));return{added:o,removed:l}}function Ax(r,e,t,s){const o=Tg(r,e),l=Ag(t,s);return o.added.length+o.removed.length+l.added.length+l.removed.length>0}async function bx(r,e,t,s){const o=Tg(r,e),l=Ag(t,s);for(const[d,u]of Ip(o.removed))await kp(d,u,!1);for(const[d,u]of Fp(l.removed))await zp(d,u,!1);for(const[d,u]of Ip(o.added))await kp(d,u,!0);for(const[d,u]of Fp(l.added))await zp(d,u,!0)}async function Op(r,e){return yt(`admin/shifts?year=${r}&month=${e}`)}async function kp(r,e,t){return yt("admin/shifts/availability",{method:"PUT",body:JSON.stringify({member_id:r,dates:e,available:t})})}async function Cx(r,e){return yt(`admin/reservations/${r}/accept`,{method:"POST",body:JSON.stringify({print_staff_member_id:e})})}async function wd(r,e){return yt(`admin/reservations/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Rx(){return yt("admin/calendar/status")}function Nx(r){return`${Yl}/admin/stl/${r}`}async function Px(){return(await yt("admin/reservations")).reservations}async function Lx(){return yt("admin/printers")}async function kd(r,e,t="POST"){const s=await fetch(`${Yl}/${r}`,{method:t,credentials:"include",body:e}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error||`HTTP ${s.status}`);return o}async function Dx(r,e){var s;const t=new FormData;return t.append("name",r),e!=null&&e.machine_lane&&t.append("machine_lane",e.machine_lane),(s=e==null?void 0:e.description)!=null&&s.trim()&&t.append("description",e.description.trim()),e!=null&&e.image&&t.append("image",e.image),kd("admin/printers",t)}async function Ux(r,e){return yt(`admin/printers/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Ix(r,e){const t=new FormData;return t.append("image",e),kd(`admin/printers/${r}/image`,t,"PUT")}async function Fx(r){return yt(`admin/printers/${r}`,{method:"DELETE"})}async function zp(r,e,t){return yt("admin/shifts/printer-availability",{method:"PUT",body:JSON.stringify({printer_id:r,dates:e,available:t})})}async function Ox(r,e,t=!1){return yt(`admin/reservations/${r}/reschedule`,{method:"PATCH",body:JSON.stringify({desired_date:e,force:t})})}async function kx(r,e){return yt(`admin/applications/${r}/split-slots`,{method:"POST",body:JSON.stringify(e)})}async function zx(){return yt("admin/integrations/status")}async function Bx(){return yt("admin/integrations/discord/test",{method:"POST",body:"{}"})}async function jx(r){const e=r.map(t=>t.trim()).filter(Boolean);if(!e.length)throw new Error("メンションする担当者を1人以上選んでください");return yt("admin/integrations/discord/test-mention",{method:"POST",body:JSON.stringify({member_ids:e})})}async function Hx(r){const e=r.trim();if(!e)throw new Error("送信先メールアドレスを入力してください");return yt("admin/settings/test-email",{method:"POST",body:JSON.stringify({to:e})})}async function Vx(r){return yt("admin/log",{method:"POST",body:JSON.stringify(r)})}async function Gx(r=100){return yt(`admin/log?limit=${r}`)}async function Wx(r){return yt(`admin/settings/storage-list?path=${encodeURIComponent(r)}`)}async function Bp(r,e){return yt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({color_index:e})})}async function $x(r,e){return yt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({discord_user_id:e})})}async function Xx(){return yt("admin/settings/print-video")}async function qx(r){return yt("admin/settings/print-video",{method:"PATCH",body:JSON.stringify({storage_path:r})})}async function Yx(r,e){const t=new FormData;return t.append("video",e),kd(`admin/reservations/${r}/print-video`,t)}async function Kx(r){return yt(`admin/reservations/${r}/print-video`,{method:"DELETE"})}function Zx(r){return`${Yl}/admin/reservations/${r}/print-video/download`}function bg({testId:r,variant:e="page"}){const t=e==="inline"?"print3d-loading print3d-loading--inline":"print3d-loading";return f.jsx("div",{className:t,"data-testid":r,role:"status","aria-live":"polite","aria-label":"読み込み中",children:f.jsx("div",{className:"print3d-loading-spinner","aria-hidden":!0})})}const Cg=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC"}],Ja=Cg.map(r=>r.id),yi={};Cg.forEach(r=>{yi[r.id]=r});const wr=["日","月","火","水","木","金","土"],zd=360,Js=30,jp=28,Rg=990,Jx=1200,Hp=(Rg-zd)/Js,Qx=7,Qs={pending:"申請中",approved:"承認済",done:"完了",cancelled:"取り消し"},li={request:"依頼",reserve:"予約"},Vp=[{id:"machine",label:"機材の不調",body:"プリンターの不調により、この時間帯の印刷を中止しました。"},{id:"maintenance",label:"メンテナンス",body:"メンテナンスのため、この時間帯の受付を停止しました。"},{id:"duplicate",label:"重複申請",body:"同じ時間帯に別の申請が確定しているため、こちらを取り消しました。"},{id:"no_show",label:"連絡なしの未実施",body:"開始時刻を過ぎても実施が確認できなかったため取り消しました。"}],Gp=[{id:"stl",label:"STLの不備",body:"STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。"},{id:"size",label:"サイズ超過",body:"造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。"},{id:"deadline",label:"締切超過",body:"印刷依頼の受付は前日までです。当日の依頼は受け付けられません。"},{id:"time",label:"時間不足",body:"この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。"}],e0=["16:20までに物理実験室へ来てください。","フィラメントは白PLAを使用します。","サポート材を付けています。剥がす作業もお願いします。"],yn=r=>String(r).padStart(2,"0"),Yn=r=>r.getFullYear()+"-"+yn(r.getMonth()+1)+"-"+yn(r.getDate()),zn=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},kl=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},zl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},Ng=r=>kl(zl(r),-r.getDay()),Wp=r=>r.getMonth()+1+"/"+r.getDate(),ci=Yn(zl(new Date)),t0=()=>zn(ci),Td=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()},Bd=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()+"（"+wr[e.getDay()]+"）"},Qa=r=>zd+r*Js,qt=r=>yn(Math.floor(r/60))+":"+yn(r%60),Kl=r=>{const e=Math.floor(r/60),t=r%60;return e&&t?e+"時間"+t+"分":e?e+"時間":t+"分"},$p=r=>Math.round((r-zd)/Js),mn=r=>r.kind==="request"?{start:Rg,end:Jx,s:Hp,e:Hp+Qx}:{start:r.start,end:r.end,s:$p(r.start),e:$p(r.end)},Xp=(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+"0"+t);return r})(),ji=r=>r?String(r).slice(0,1)+"年"+String(r).slice(1)+"HR":"—",Kr=["#f38020","#3b74e0","#1f9d55","#9a4a07","#7c5cbf","#b4776b","#2f8f8f"],Pg=[{id:"m1",name:"金田",hr:"203",num:12,discord:"",color:"#f38020"},{id:"m2",name:"田村",hr:"201",num:3,discord:"",color:"#3b74e0"},{id:"m3",name:"藤原",hr:"104",num:21,discord:"",color:"#1f9d55"}];let Zl=Pg.slice();const n0=r=>{Zl=(r&&r.length?r:Pg).slice()},i0=()=>Zl,Qr=r=>Zl.find(e=>e.id===r)||null,jd=r=>{const e=Qr(r);return e?e.name:null},r0=r=>{const e=Qr(r);return e?e.color:"var(--color-text-faint)"},Lg=r=>{const e=Qr(r);return e?`${e.name}（${ji(e.hr)}・${e.num}番）`:"—"};let Dg={};const fl=r=>{Dg=r||{}},$s=(r,e)=>(Dg[r]||[]).indexOf(e)>=0,to=r=>Zl.filter(e=>$s(e.id,r)).map(e=>e.id),Ug=r=>to(r).map(e=>jd(e)),s0=r=>r.filter(e=>e.status==="pending").sort((e,t)=>(e.date+yn(Math.floor(mn(e).start/60))).localeCompare(t.date+yn(Math.floor(mn(t).start/60)))),a0=r=>r.kind==="request"&&r.date<=ci,o0=r=>r==="pending"||r==="approved";function l0(r,e){const t=r.filter(o=>o.date===e),s={};return Ja.forEach(o=>{const l=new Array(jp).fill(null);t.filter(d=>d.machine===o&&o0(d.status)).forEach(d=>{const u=mn(d);for(let m=Math.max(0,u.s);m<Math.min(jp,u.e);m++)l[m]=d}),s[o]=l}),{list:t,machines:s}}function Ig(r,e){const t=r.filter(o=>o.date===e),s=t.filter(o=>o.status!=="cancelled");return{all:t,live:s,requests:s.filter(o=>o.kind==="request"),reserves:s.filter(o=>o.kind==="reserve"),pending:s.filter(o=>o.status==="pending").length,cancelled:t.filter(o=>o.status==="cancelled")}}function Fg(r,e,t,s){const o=mn(e),l=l0(r,t),d=l.machines[e.machine];let u=0;for(let g=o.s;g<o.e;g++){const _=d[g];_&&_.id!==e.id&&u++}const m=o.e-o.s,p=to(t);return{date:t,total:m,used:u,free:m-u,full:u>=m,staffs:p,noStaff:p.length===0,past:t<ci,sameDay:t===e.date,liveCount:l.list.filter(g=>g.status!=="cancelled").length}}function c0(r,e){const s=new Date(r,e-1,1).getDay(),o=new Date(r,e,0).getDate(),l=[];for(let d=0;d<s;d++)l.push(null);for(let d=1;d<=o;d++)l.push(new Date(r,e-1,d));for(;l.length%7!==0;)l.push(null);return l}function Hd(r){const e=mn(r),t=[];for(let s=e.s;s<e.e;s++)t.push(s);return t}function Vd(r,e){try{const t=localStorage.getItem(r);return t?JSON.parse(t):e}catch{return e}}function Gd(r,e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}const ra={prefs:"sh3dm.prefs.v1",log:"sh3dm.log.v1",integ:"sh3dm.integrations.v1"},Og=()=>Vd(ra.prefs,{}),u0=r=>Gd(ra.prefs,Object.assign(Og(),r)),d0=()=>Vd(ra.log,[]),f0=r=>Gd(ra.log,r),hl={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,cancelled:!0},dailyMention:!0},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}},h0=()=>{const r=Vd(ra.integ,null);return r?{discord:{...hl.discord,...r.discord||{},events:{...hl.discord.events,...(r.discord||{}).events||{}}},gcal:{...hl.gcal,...r.gcal||{}}}:JSON.parse(JSON.stringify(hl))},p0=r=>Gd(ra.integ,r),Bl=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE",hint:"小物・精度重視"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC",hint:"大型・タイムラプス"}];Bl.map(r=>r.id);const m0=Object.fromEntries(Bl.map(r=>[r.id,r])),kg=["日","月","火","水","木","金","土"],Wd=360,$d=30,zg=990,Bg=1200,g0=(zg-Wd)/$d,v0=(Bg-Wd)/$d,_0={pending:"申請中",approved:"確定",rejected:"却下",done:"完了"},x0={request:"依頼",reserve:"予約"},es=r=>String(r).padStart(2,"0"),Ad=r=>r.getFullYear()+"-"+es(r.getMonth()+1)+"-"+es(r.getDate()),ts=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},jg=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},jl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},y0=r=>jg(jl(r),-r.getDay()),qp=r=>es(Math.floor(r/60))+":"+es(r%60),Yp=r=>Math.round((r-Wd)/$d),S0=r=>r.kind==="request"?{start:zg,end:Bg,s:g0,e:v0}:{start:r.start,end:r.end,s:Yp(r.start),e:Yp(r.end)};(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+es(t));return r})();const M0=Ad(jl(new Date)),E0=()=>ts(M0),Hg=r=>{const e=ts(r);return e.getMonth()+1+"/"+e.getDate()},Ga=r=>{const e=ts(r);return Hg(r)+"（"+kg[e.getDay()]+"）"};function w0(r,e){var t;return e?((t=r.find(s=>s.id===e))==null?void 0:t.name)??null:null}function T0(r,e,t,s,o){const l=r.filter(p=>p.date>=e&&p.date<=t).sort((p,g)=>(p.date+String(p.start)).localeCompare(g.date+String(g.start))),d=["日付","曜日","開始","終了","機種","種別","作品名","申請者","学年HR","番号","状態","印刷データ","サイズ(MB)","備考","担当"],u=p=>{const g=String(p??"");return/[",\n]/.test(g)?'"'+g.replace(/"/g,'""')+'"':g},m=[d.join(",")];return l.forEach(p=>{const g=S0(p),_=ts(p.date),y=o[p.date];m.push([p.date,kg[_.getDay()],qp(g.start),qp(g.end),m0[p.machine].name,x0[p.kind],p.title,p.who.name,p.who.hr,p.who.num,_0[p.status],p.file,p.fileSize?(p.fileSize/1048576).toFixed(2):"",p.note,y&&w0(s,y)||""].map(u).join(","))}),"\uFEFF"+m.join(`\r
`)}const A0={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,rejected:!0},mention:""},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}};function b0(r){return r.map(e=>({id:e.id,name:e.name,hr:e.homeroom??"",num:e.student_number??0,discord:e.discord_user_id??"",color:Kr[(e.color_index??0)%Kr.length],userId:e.user_id??null}))}function Kp(r){const e=Kr.indexOf(r);return e>=0?e:0}function C0(r){return r==="rejected"?"cancelled":r}function R0(r){switch(r){case"pending":return"applied";case"approved":return"accepted";case"done":return"delivered";case"cancelled":return"cancelled";default:return"applied"}}function Zp(r){return{...r,status:C0(r.status)}}function N0(r){const e=Ad(y0(ts(r))),t=Ad(jg(ts(e),27));return{from:e,to:t}}function Vg(r){const e={};for(const t of r)e[t.member_id]||(e[t.member_id]=[]),e[t.member_id].push(t.date);for(const t of Object.keys(e))e[t].sort();return e}function Xs(r){const e=[];for(const[t,s]of Object.entries(r))for(const o of s)e.push({member_id:t,date:o});return e}function Jp(r,e,t){const s=ts(r);return s.getFullYear()===e&&s.getMonth()+1===t}function P0(r,e){const t=new Date(r,e,0).getDate(),s=[];for(let o=1;o<=t;o++)s.push(`${r}-${String(e).padStart(2,"0")}-${String(o).padStart(2,"0")}`);return s}function L0(r,e,t,s,o){const l=Vg(t),d=new Set([...Object.keys(r),...Object.keys(e),...Object.keys(l)]),u=P0(s,o),m={},p={};for(const g of d){const _=new Set(r[g]||[]),y=new Set(e[g]||[]),M=new Set(l[g]||[]),E=new Set([..._].filter(S=>!Jp(S,s,o))),w=new Set([...y].filter(S=>!Jp(S,s,o)));for(const S of u)y.has(S)!==_.has(S)?(_.has(S)&&E.add(S),y.has(S)&&w.add(S)):M.has(S)&&(E.add(S),w.add(S));m[g]=[...E].sort(),p[g]=[...w].sort()}return{avail:m,saved:p}}function D0(r,e){const t=Xs(r),s=Xs(e),o=new Set(t.map(m=>`${m.member_id}\0${m.date}`)),l=new Set(s.map(m=>`${m.member_id}\0${m.date}`)),d=s.filter(m=>!o.has(`${m.member_id}\0${m.date}`)),u=t.filter(m=>!l.has(`${m.member_id}\0${m.date}`));return{addedSlots:d.length,removedSlots:u.length,addedDates:new Set(d.map(m=>m.date)).size,removedDates:new Set(u.map(m=>m.date)).size}}function U0(r){return r.linked_member?`${r.user.display_name}（印刷担当: ${r.linked_member.name}）`:r.user.display_name}function I0(){return JSON.parse(JSON.stringify(A0))}function F0(r,e,t,s){const o=r.map(l=>({...l,status:l.status==="cancelled"?"rejected":l.status}));return T0(o,e,t,s)}function Xd(){const[r,e]=me.useState(null),t=me.useCallback((o,l)=>{o<0?e("prev"):o>0?e("next"):e(null),l()},[]),s=r==="prev"?"cal-period-enter cal-period-enter--prev":r==="next"?"cal-period-enter cal-period-enter--next":"cal-period-enter";return me.useEffect(()=>{if(!r)return;const o=window.setTimeout(()=>e(null),360);return()=>window.clearTimeout(o)},[r]),{run:t,enterClass:s,dir:r}}const Gg="/apps/3dprint-management/assets/icon-192.png",O0=r=>r==="ke"?"var(--color-primary)":"var(--color-tip)";function k0({id:r,size:e}){return f.jsx("span",{className:"dot",style:{background:O0(r),width:e||6,height:e||6}})}function Fl({kind:r,size:e}){return f.jsxs("span",{className:"kbadge "+r+(e==="sm"?" sm":""),children:[f.jsx("span",{className:"kmark"}),li[r]]})}function Qp(){return f.jsx("span",{"aria-hidden":"true",className:"dlic",children:"↓"})}function z0(r,e){const t=mn(r);if(e==="file"){const l=r.file||`${r.title}.stl`,d=["ScienceHUB 3Dプリント — 印刷データ","",`ファイル名: ${l}`,`作品名: ${r.title}`,`申請者: ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`機種: ${yi[r.machine].name}`,`種別: ${li[r.kind]}`,`日付: ${r.date}`,`時間: ${qt(t.start)}〜${qt(t.end)}`,`サイズ: ${r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":"—"}`,"","※ このファイルはデザイン確認用のプレースホルダです。本番では署名付きURLから取得します。"].join(`\r
`);bd(l.replace(/\.[^.]+$/,"")+".txt",d);return}const s=["ScienceHUB 3Dプリント 申請書","=============================",`作品名      : ${r.title}`,`日付        : ${r.date}（${wr[zn(r.date).getDay()]}）`,`時間        : ${qt(t.start)}〜${qt(t.end)}（${Kl(t.end-t.start)}）`,`機種        : ${yi[r.machine].name}（${yi[r.machine].maker}）`,`種別        : ${li[r.kind]}${r.kind==="request"?"（依頼枠を丸ごと占有）":"（データ提出なし）"}`,`状態        : ${Qs[r.status]}`,`担当        : ${Ug(r.date).join(" / ")||"休み"}`,`申請者      : ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`印刷データ  : ${r.file||"—"}${r.fileSize?"（"+(r.fileSize/1048576).toFixed(2)+" MB）":""}`,`備考        : ${r.note||"—"}`,`担当者メモ  : ${r.adminNote||"—"}`,"","出力: ScienceHUB 3Dプリント管理"],o=`${r.date}_${r.title.split(/[\\/:*?"<>|]/).join("_")}.txt`;bd(o,s.join(`\r
`))}function bd(r,e){const t=new Blob(["\uFEFF"+e],{type:"text/plain;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a");o.href=s,o.download=r,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function B0(r,e){const t=r.filter(l=>l.date===e).sort((l,d)=>mn(l).start-mn(d).start||Ja.indexOf(l.machine)-Ja.indexOf(d.machine)),s=Ug(e).join(" / ")||"休み",o=[`ScienceHUB 3Dプリント 申請一覧 — ${e}（${wr[zn(e).getDay()]}）`,`担当: ${s}`,`件数: ${t.length}`,"=".repeat(48)];return t.forEach((l,d)=>{const u=mn(l);o.push("",`[${d+1}] ${l.title}`,`  時間   : ${qt(u.start)}〜${qt(u.end)}（${Kl(u.end-u.start)}）`,`  機種   : ${yi[l.machine].name}`,`  種別   : ${li[l.kind]}`,`  状態   : ${Qs[l.status]}`,`  申請者 : ${l.who.name}（${ji(l.who.hr)}・${l.who.num}番）`,`  データ : ${l.file||"—"}`,`  備考   : ${l.note||"—"}`)}),bd(`${e}_申請一覧.txt`,o.join(`\r
`)),t.length}function Cd({status:r}){return f.jsx("span",{className:"tag "+r,children:Qs[r]})}function Hl({tone:r,children:e}){return f.jsx("span",{className:"chip"+(r?" "+r:""),children:e})}function Wg({id:r,small:e}){const t=Qr(r);return t?f.jsxs("span",{className:"mtag"+(e?" sm":""),children:[f.jsx("span",{className:"mtag-av",style:{background:t.color},children:t.name.slice(0,1)}),t.name]}):f.jsx("span",{className:"mtag none",children:"休み"})}function j0(r){if(!r)return"—";const e=new Date(r),t=zl(t0()),s=Math.round((t-zl(e))/864e5),o=yn(e.getHours())+":"+yn(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}const H0=r=>{const e=new Date(r);return yn(e.getHours())+":"+yn(e.getMinutes())};function V0({screen:r,setScreen:e,operatorSession:t,pendingCount:s,onCsv:o}){return f.jsx("header",{className:"site-header",children:f.jsxs("div",{className:"header-inner",children:[f.jsxs("a",{className:"brand",href:"/",children:[f.jsx("img",{src:Gg,alt:""}),"ScienceHUB",f.jsx("span",{className:"sep"}),f.jsx("span",{className:"crumb",children:"3Dプリント管理"})]}),f.jsx("span",{className:"adm-pill",children:"管理者"}),f.jsxs("nav",{className:"screens","aria-label":"画面",children:[f.jsxs("button",{type:"button","aria-current":r==="reserve"?"page":void 0,className:r==="reserve"?"on":"",onClick:()=>e("reserve"),children:["申請の管理",s>0&&f.jsx("span",{className:"nav-count num",children:s})]}),f.jsx("button",{type:"button","aria-current":r==="settings"?"page":void 0,className:r==="settings"?"on":"",onClick:()=>e("settings"),children:"シフト・設定"}),f.jsx("button",{type:"button","aria-current":r==="ops"?"page":void 0,className:r==="ops"?"on":"",onClick:()=>e("ops"),children:"運用"})]}),f.jsxs("div",{className:"hdr-right",children:[f.jsxs("div",{className:"actor actor-readonly",title:(t==null?void 0:t.user.username)??"",children:[f.jsx("span",{children:"ログイン"}),f.jsx("strong",{children:(t==null?void 0:t.user.display_name)??"—"}),t!=null&&t.linked_member?f.jsxs("span",{className:"actor-staff",children:["／印刷担当 ",t.linked_member.name]}):f.jsx("span",{className:"actor-staff actor-staff-warn",children:"／印刷担当未紐づけ"})]}),r==="reserve"&&f.jsx("button",{type:"button",className:"hdr-link",onClick:o,children:"CSV出力"}),f.jsx("a",{className:"hdr-link",href:"/apps/3dprint-reservation/",children:"申請フォーム"})]})]})})}function G0(r,e){const t=Ig(r,e);return{req:t.requests.length,res:t.reserves.length,pending:t.pending}}function W0({d:r,ds:e,apps:t,staffIds:s,selected:o,onPick:l,dense:d}){const u=r.getDay(),m=G0(t,e),p=["day"];return u===0&&p.push("sun"),u===6&&p.push("sat"),e===ci&&p.push("today"),e===o&&p.push("sel"),s.length||p.push("closed"),f.jsxs("button",{type:"button",className:p.join(" "),onClick:()=>l(e),"aria-pressed":e===o,"aria-label":`${r.getMonth()+1}月${r.getDate()}日 依頼${m.req}件 予約${m.res}件 ${s.length?"担当あり":"担当なし"}`,children:[f.jsxs("span",{className:"d-top",children:[f.jsx("span",{className:"d num",children:r.getDate()}),f.jsx("span",{className:"d-staffflag"+(s.length?" on":""),children:s.length?"担当あり":"休み"})]}),f.jsxs("span",{className:"c-kinds",children:[f.jsxs("span",{className:"c-k req"+(m.req?"":" zero"),children:[f.jsx("i",{}),"依頼",f.jsx("b",{className:"num",children:m.req})]}),f.jsxs("span",{className:"c-k res"+(m.res?"":" zero"),children:[f.jsx("i",{}),"予約",f.jsx("b",{className:"num",children:m.res})]})]}),f.jsx("span",{className:"c-pend",children:m.pending>0?f.jsxs("span",{className:"pend num",children:["申請中 ",m.pending]}):null})]})}function $0({apps:r,avail:e,selected:t,onPick:s}){const{run:o,enterClass:l}=Xd(),d=Ng(zn(t)),u=Yn(d),m=[];for(let w=0;w<4;w++){const S=[];for(let x=0;x<7;x++)S.push(kl(d,w*7+x));m.push(S)}const p=m.flat(),g=p[p.length-1],y=p[0].getMonth()===g.getMonth()?`${p[0].getFullYear()}年 ${yn(p[0].getMonth()+1)}月`:`${yn(p[0].getMonth()+1)}月 → ${yn(g.getMonth()+1)}月`,M=p.map(Yn);r.filter(w=>M.indexOf(w.date)>=0&&w.status!=="cancelled");const E=w=>o(w,()=>s(Yn(kl(zn(t),w*28))));return f.jsxs("div",{className:"card cal-card",children:[f.jsxs("div",{className:"cal-head",children:[f.jsx("div",{className:l,children:f.jsx("div",{className:"cal-month",children:f.jsx("span",{children:y})})},`label-${u}`),f.jsx("div",{className:"cal-nav",children:f.jsx("button",{type:"button",className:"cal-today",onClick:()=>s(ci),children:"今日"})})]}),f.jsxs("div",{className:"cal-body",children:[f.jsxs("button",{type:"button",className:"cal-side prev",onClick:()=>E(-1),"aria-label":"前の4週間",children:[f.jsx("span",{"aria-hidden":"true",children:"‹"}),f.jsx("span",{className:"cal-side-lbl",children:"前へ"})]}),f.jsx("div",{className:"cal-main",children:f.jsx("div",{className:"cal-period-shell",children:f.jsxs("div",{className:l,children:[f.jsx("div",{className:"cal-wds",children:wr.map((w,S)=>f.jsx("div",{className:"cal-wd"+(S===0?" sun":S===6?" sat":""),children:w},w))}),f.jsx("div",{className:"cal-grid",children:m.map(w=>w.map(S=>{const x=Yn(S);return f.jsx(W0,{d:S,ds:x,apps:r,staffIds:to(x),selected:x===t,onPick:s},x)}))})]},u)})}),f.jsxs("button",{type:"button",className:"cal-side next",onClick:()=>E(1),"aria-label":"次の4週間",children:[f.jsx("span",{"aria-hidden":"true",children:"›"}),f.jsx("span",{className:"cal-side-lbl",children:"次へ"})]})]})]})}function X0({open:r,title:e,sub:t,onClose:s,children:o,footer:l}){return me.useEffect(()=>{if(!r)return;const d=u=>{u.key==="Escape"&&s()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[r,s]),f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),f.jsxs("aside",{className:"sheet"+(r?" on":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[f.jsxs("div",{className:"sheet-h",children:[f.jsxs("div",{style:{minWidth:0},children:[f.jsx("h2",{children:e}),t&&f.jsx("p",{children:t})]}),f.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),f.jsx("div",{className:"sheet-b",children:r?o:null}),l&&f.jsx("div",{className:"sheet-f",children:l})]})]})}function $g({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:d}){return me.useEffect(()=>{if(!r)return;const u=m=>{m.key==="Escape"&&s()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[r,s]),r?f.jsxs("div",{className:"modal-wrap",role:"dialog","aria-modal":"true","aria-label":e,children:[f.jsx("div",{className:"modal-scrim",onClick:s}),f.jsxs("div",{className:"modal"+(d?" wide":""),children:[f.jsxs("div",{className:"modal-h",children:[f.jsxs("div",{children:[f.jsx("h2",{children:e}),t&&f.jsx("p",{children:t})]}),f.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),f.jsx("div",{className:"modal-b",children:o}),l&&f.jsx("div",{className:"modal-f",children:l})]})]}):null}function q0({toast:r}){return f.jsx("div",{className:"toast"+(r?" show":""),role:"status","aria-live":"polite",children:r&&f.jsxs(f.Fragment,{children:[r.text,r.mark&&f.jsx("b",{children:r.mark})]})})}function Y0(r){if(!r)return"—";const e=new Date(r),t=jl(E0()),s=Math.round((t-jl(e))/864e5),o=es(e.getHours())+":"+es(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}function K0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:d,tabs:u}){return me.useEffect(()=>{if(!r)return;const m=p=>{p.key==="Escape"&&s()};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[r,s]),f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),f.jsxs("aside",{className:"sheet"+(r?" on":"")+(d?" wide":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[f.jsxs("div",{className:"sheet-h",children:[f.jsxs("div",{style:{minWidth:0},children:[f.jsx("h2",{children:e}),t&&f.jsx("p",{children:t})]}),f.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),u,f.jsx("div",{className:"sheet-b",children:r?o:null}),l&&f.jsx("div",{className:"sheet-f",children:l})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qd="164",Z0=0,em=1,J0=2,Xg=1,Q0=2,ki=3,Sr=0,Nn=1,gi=2,xr=0,Ys=1,tm=2,nm=3,im=4,ey=5,qr=100,ty=101,ny=102,iy=103,ry=104,sy=200,ay=201,oy=202,ly=203,Rd=204,Nd=205,cy=206,uy=207,dy=208,fy=209,hy=210,py=211,my=212,gy=213,vy=214,_y=0,xy=1,yy=2,Vl=3,Sy=4,My=5,Ey=6,wy=7,qg=0,Ty=1,Ay=2,yr=0,by=1,Cy=2,Ry=3,Ny=4,Py=5,Ly=6,Dy=7,Yg=300,ea=301,ta=302,Pd=303,Ld=304,Jl=306,Dd=1e3,Zr=1001,Ud=1002,Kn=1003,Uy=1004,pl=1005,oi=1006,Gu=1007,Jr=1008,Mr=1009,Iy=1010,Fy=1011,Kg=1012,Zg=1013,na=1014,_r=1015,Ql=1016,Jg=1017,Qg=1018,no=1020,Oy=35902,ky=1021,zy=1022,_i=1023,By=1024,jy=1025,Ks=1026,eo=1027,Hy=1028,ev=1029,Vy=1030,tv=1031,nv=1033,Wu=33776,$u=33777,Xu=33778,qu=33779,rm=35840,sm=35841,am=35842,om=35843,lm=36196,cm=37492,um=37496,dm=37808,fm=37809,hm=37810,pm=37811,mm=37812,gm=37813,vm=37814,_m=37815,xm=37816,ym=37817,Sm=37818,Mm=37819,Em=37820,wm=37821,Yu=36492,Tm=36494,Am=36495,Gy=36283,bm=36284,Cm=36285,Rm=36286,Wy=3200,$y=3201,iv=0,Xy=1,vr="",pi="srgb",Tr="srgb-linear",Yd="display-p3",ec="display-p3-linear",Gl="linear",Lt="srgb",Wl="rec709",$l="p3",Rs=7680,Nm=519,qy=512,Yy=513,Ky=514,rv=515,Zy=516,Jy=517,Qy=518,eS=519,Pm=35044,Lm="300 es",zi=2e3,Xl=2001;class sa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(t)===-1&&s[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const o=s.slice(0);for(let l=0,d=o.length;l<d;l++)o[l].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ku=Math.PI/180,Id=180/Math.PI;function io(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(hn[r&255]+hn[r>>8&255]+hn[r>>16&255]+hn[r>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[s&255]+hn[s>>8&255]+hn[s>>16&255]+hn[s>>24&255]).toLowerCase()}function Rn(r,e,t){return Math.max(e,Math.min(t,r))}function tS(r,e){return(r%e+e)%e}function Zu(r,e,t){return(1-t)*r+t*e}function Wa(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Cn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class xt{constructor(e=0,t=0){xt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,s=this.y,o=e.elements;return this.x=o[0]*t+o[3]*s+o[6],this.y=o[1]*t+o[4]*s+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(Rn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y;return t*t+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const s=Math.cos(t),o=Math.sin(t),l=this.x-e.x,d=this.y-e.y;return this.x=l*s-d*o+e.x,this.y=l*o+d*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ft{constructor(e,t,s,o,l,d,u,m,p){ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,d,u,m,p)}set(e,t,s,o,l,d,u,m,p){const g=this.elements;return g[0]=e,g[1]=o,g[2]=u,g[3]=t,g[4]=l,g[5]=m,g[6]=s,g[7]=d,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],this}extractBasis(e,t,s){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,d=s[0],u=s[3],m=s[6],p=s[1],g=s[4],_=s[7],y=s[2],M=s[5],E=s[8],w=o[0],S=o[3],x=o[6],L=o[1],N=o[4],U=o[7],Y=o[2],I=o[5],k=o[8];return l[0]=d*w+u*L+m*Y,l[3]=d*S+u*N+m*I,l[6]=d*x+u*U+m*k,l[1]=p*w+g*L+_*Y,l[4]=p*S+g*N+_*I,l[7]=p*x+g*U+_*k,l[2]=y*w+M*L+E*Y,l[5]=y*S+M*N+E*I,l[8]=y*x+M*U+E*k,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],d=e[4],u=e[5],m=e[6],p=e[7],g=e[8];return t*d*g-t*u*p-s*l*g+s*u*m+o*l*p-o*d*m}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],d=e[4],u=e[5],m=e[6],p=e[7],g=e[8],_=g*d-u*p,y=u*m-g*l,M=p*l-d*m,E=t*_+s*y+o*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/E;return e[0]=_*w,e[1]=(o*p-g*s)*w,e[2]=(u*s-o*d)*w,e[3]=y*w,e[4]=(g*t-o*m)*w,e[5]=(o*l-u*t)*w,e[6]=M*w,e[7]=(s*m-p*t)*w,e[8]=(d*t-s*l)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,s,o,l,d,u){const m=Math.cos(l),p=Math.sin(l);return this.set(s*m,s*p,-s*(m*d+p*u)+d+e,-o*p,o*m,-o*(-p*d+m*u)+u+t,0,0,1),this}scale(e,t){return this.premultiply(Ju.makeScale(e,t)),this}rotate(e){return this.premultiply(Ju.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ju.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,s,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<9;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<9;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ju=new ft;function sv(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function ql(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function nS(){const r=ql("canvas");return r.style.display="block",r}const Dm={};function iS(r){r in Dm||(Dm[r]=!0,console.warn(r))}const Um=new ft().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Im=new ft().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ml={[Tr]:{transfer:Gl,primaries:Wl,toReference:r=>r,fromReference:r=>r},[pi]:{transfer:Lt,primaries:Wl,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[ec]:{transfer:Gl,primaries:$l,toReference:r=>r.applyMatrix3(Im),fromReference:r=>r.applyMatrix3(Um)},[Yd]:{transfer:Lt,primaries:$l,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Im),fromReference:r=>r.applyMatrix3(Um).convertLinearToSRGB()}},rS=new Set([Tr,ec]),At={enabled:!0,_workingColorSpace:Tr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!rS.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const s=ml[e].toReference,o=ml[t].fromReference;return o(s(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return ml[r].primaries},getTransfer:function(r){return r===vr?Gl:ml[r].transfer}};function Zs(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Qu(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ns;class sS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ns===void 0&&(Ns=ql("canvas")),Ns.width=e.width,Ns.height=e.height;const s=Ns.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),t=Ns}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ql("canvas");t.width=e.width,t.height=e.height;const s=t.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const o=s.getImageData(0,0,e.width,e.height),l=o.data;for(let d=0;d<l.length;d++)l[d]=Zs(l[d]/255)*255;return s.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let s=0;s<t.length;s++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[s]=Math.floor(Zs(t[s]/255)*255):t[s]=Zs(t[s]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let aS=0;class av{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:aS++}),this.uuid=io(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let d=0,u=o.length;d<u;d++)o[d].isDataTexture?l.push(ed(o[d].image)):l.push(ed(o[d]))}else l=ed(o);s.url=l}return t||(e.images[this.uuid]=s),s}}function ed(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?sS.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let oS=0;class Pn extends sa{constructor(e=Pn.DEFAULT_IMAGE,t=Pn.DEFAULT_MAPPING,s=Zr,o=Zr,l=oi,d=Jr,u=_i,m=Mr,p=Pn.DEFAULT_ANISOTROPY,g=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:oS++}),this.uuid=io(),this.name="",this.source=new av(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=s,this.wrapT=o,this.magFilter=l,this.minFilter=d,this.anisotropy=p,this.format=u,this.internalFormat=null,this.type=m,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),t||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Yg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Dd:e.x=e.x-Math.floor(e.x);break;case Zr:e.x=e.x<0?0:1;break;case Ud:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Dd:e.y=e.y-Math.floor(e.y);break;case Zr:e.y=e.y<0?0:1;break;case Ud:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=Yg;Pn.DEFAULT_ANISOTROPY=1;class rn{constructor(e=0,t=0,s=0,o=1){rn.prototype.isVector4=!0,this.x=e,this.y=t,this.z=s,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,s,o){return this.x=e,this.y=t,this.z=s,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=this.w,d=e.elements;return this.x=d[0]*t+d[4]*s+d[8]*o+d[12]*l,this.y=d[1]*t+d[5]*s+d[9]*o+d[13]*l,this.z=d[2]*t+d[6]*s+d[10]*o+d[14]*l,this.w=d[3]*t+d[7]*s+d[11]*o+d[15]*l,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,s,o,l;const m=e.elements,p=m[0],g=m[4],_=m[8],y=m[1],M=m[5],E=m[9],w=m[2],S=m[6],x=m[10];if(Math.abs(g-y)<.01&&Math.abs(_-w)<.01&&Math.abs(E-S)<.01){if(Math.abs(g+y)<.1&&Math.abs(_+w)<.1&&Math.abs(E+S)<.1&&Math.abs(p+M+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const N=(p+1)/2,U=(M+1)/2,Y=(x+1)/2,I=(g+y)/4,k=(_+w)/4,$=(E+S)/4;return N>U&&N>Y?N<.01?(s=0,o=.707106781,l=.707106781):(s=Math.sqrt(N),o=I/s,l=k/s):U>Y?U<.01?(s=.707106781,o=0,l=.707106781):(o=Math.sqrt(U),s=I/o,l=$/o):Y<.01?(s=.707106781,o=.707106781,l=0):(l=Math.sqrt(Y),s=k/l,o=$/l),this.set(s,o,l,t),this}let L=Math.sqrt((S-E)*(S-E)+(_-w)*(_-w)+(y-g)*(y-g));return Math.abs(L)<.001&&(L=1),this.x=(S-E)/L,this.y=(_-w)/L,this.z=(y-g)/L,this.w=Math.acos((p+M+x-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this.w=e.w+(t.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class lS extends sa{constructor(e=1,t=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rn(0,0,e,t),this.scissorTest=!1,this.viewport=new rn(0,0,e,t);const o={width:e,height:t,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const l=new Pn(o,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);l.flipY=!1,l.generateMipmaps=s.generateMipmaps,l.internalFormat=s.internalFormat,this.textures=[];const d=s.count;for(let u=0;u<d;u++)this.textures[u]=l.clone(),this.textures[u].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,s=1){if(this.width!==e||this.height!==t||this.depth!==s){this.width=e,this.height=t,this.depth=s;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=s;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,o=e.textures.length;s<o;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new av(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends lS{constructor(e=1,t=1,s={}){super(e,t,s),this.isWebGLRenderTarget=!0}}class ov extends Pn{constructor(e=null,t=1,s=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cS extends Pn{constructor(e=null,t=1,s=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ro{constructor(e=0,t=0,s=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=s,this._w=o}static slerpFlat(e,t,s,o,l,d,u){let m=s[o+0],p=s[o+1],g=s[o+2],_=s[o+3];const y=l[d+0],M=l[d+1],E=l[d+2],w=l[d+3];if(u===0){e[t+0]=m,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u===1){e[t+0]=y,e[t+1]=M,e[t+2]=E,e[t+3]=w;return}if(_!==w||m!==y||p!==M||g!==E){let S=1-u;const x=m*y+p*M+g*E+_*w,L=x>=0?1:-1,N=1-x*x;if(N>Number.EPSILON){const Y=Math.sqrt(N),I=Math.atan2(Y,x*L);S=Math.sin(S*I)/Y,u=Math.sin(u*I)/Y}const U=u*L;if(m=m*S+y*U,p=p*S+M*U,g=g*S+E*U,_=_*S+w*U,S===1-u){const Y=1/Math.sqrt(m*m+p*p+g*g+_*_);m*=Y,p*=Y,g*=Y,_*=Y}}e[t]=m,e[t+1]=p,e[t+2]=g,e[t+3]=_}static multiplyQuaternionsFlat(e,t,s,o,l,d){const u=s[o],m=s[o+1],p=s[o+2],g=s[o+3],_=l[d],y=l[d+1],M=l[d+2],E=l[d+3];return e[t]=u*E+g*_+m*M-p*y,e[t+1]=m*E+g*y+p*_-u*M,e[t+2]=p*E+g*M+u*y-m*_,e[t+3]=g*E-u*_-m*y-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,s,o){return this._x=e,this._y=t,this._z=s,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const s=e._x,o=e._y,l=e._z,d=e._order,u=Math.cos,m=Math.sin,p=u(s/2),g=u(o/2),_=u(l/2),y=m(s/2),M=m(o/2),E=m(l/2);switch(d){case"XYZ":this._x=y*g*_+p*M*E,this._y=p*M*_-y*g*E,this._z=p*g*E+y*M*_,this._w=p*g*_-y*M*E;break;case"YXZ":this._x=y*g*_+p*M*E,this._y=p*M*_-y*g*E,this._z=p*g*E-y*M*_,this._w=p*g*_+y*M*E;break;case"ZXY":this._x=y*g*_-p*M*E,this._y=p*M*_+y*g*E,this._z=p*g*E+y*M*_,this._w=p*g*_-y*M*E;break;case"ZYX":this._x=y*g*_-p*M*E,this._y=p*M*_+y*g*E,this._z=p*g*E-y*M*_,this._w=p*g*_+y*M*E;break;case"YZX":this._x=y*g*_+p*M*E,this._y=p*M*_+y*g*E,this._z=p*g*E-y*M*_,this._w=p*g*_-y*M*E;break;case"XZY":this._x=y*g*_-p*M*E,this._y=p*M*_-y*g*E,this._z=p*g*E+y*M*_,this._w=p*g*_+y*M*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const s=t/2,o=Math.sin(s);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,s=t[0],o=t[4],l=t[8],d=t[1],u=t[5],m=t[9],p=t[2],g=t[6],_=t[10],y=s+u+_;if(y>0){const M=.5/Math.sqrt(y+1);this._w=.25/M,this._x=(g-m)*M,this._y=(l-p)*M,this._z=(d-o)*M}else if(s>u&&s>_){const M=2*Math.sqrt(1+s-u-_);this._w=(g-m)/M,this._x=.25*M,this._y=(o+d)/M,this._z=(l+p)/M}else if(u>_){const M=2*Math.sqrt(1+u-s-_);this._w=(l-p)/M,this._x=(o+d)/M,this._y=.25*M,this._z=(m+g)/M}else{const M=2*Math.sqrt(1+_-s-u);this._w=(d-o)/M,this._x=(l+p)/M,this._y=(m+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let s=e.dot(t)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rn(this.dot(e),-1,1)))}rotateTowards(e,t){const s=this.angleTo(e);if(s===0)return this;const o=Math.min(1,t/s);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const s=e._x,o=e._y,l=e._z,d=e._w,u=t._x,m=t._y,p=t._z,g=t._w;return this._x=s*g+d*u+o*p-l*m,this._y=o*g+d*m+l*u-s*p,this._z=l*g+d*p+s*m-o*u,this._w=d*g-s*u-o*m-l*p,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const s=this._x,o=this._y,l=this._z,d=this._w;let u=d*e._w+s*e._x+o*e._y+l*e._z;if(u<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,u=-u):this.copy(e),u>=1)return this._w=d,this._x=s,this._y=o,this._z=l,this;const m=1-u*u;if(m<=Number.EPSILON){const M=1-t;return this._w=M*d+t*this._w,this._x=M*s+t*this._x,this._y=M*o+t*this._y,this._z=M*l+t*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,u),_=Math.sin((1-t)*g)/p,y=Math.sin(t*g)/p;return this._w=d*_+this._w*y,this._x=s*_+this._x*y,this._y=o*_+this._y*y,this._z=l*_+this._z*y,this._onChangeCallback(),this}slerpQuaternions(e,t,s){return this.copy(e).slerp(t,s)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),s=Math.random(),o=Math.sqrt(1-s),l=Math.sqrt(s);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class le{constructor(e=0,t=0,s=0){le.prototype.isVector3=!0,this.x=e,this.y=t,this.z=s}set(e,t,s){return s===void 0&&(s=this.z),this.x=e,this.y=t,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[3]*s+l[6]*o,this.y=l[1]*t+l[4]*s+l[7]*o,this.z=l[2]*t+l[5]*s+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=e.elements,d=1/(l[3]*t+l[7]*s+l[11]*o+l[15]);return this.x=(l[0]*t+l[4]*s+l[8]*o+l[12])*d,this.y=(l[1]*t+l[5]*s+l[9]*o+l[13])*d,this.z=(l[2]*t+l[6]*s+l[10]*o+l[14])*d,this}applyQuaternion(e){const t=this.x,s=this.y,o=this.z,l=e.x,d=e.y,u=e.z,m=e.w,p=2*(d*o-u*s),g=2*(u*t-l*o),_=2*(l*s-d*t);return this.x=t+m*p+d*_-u*g,this.y=s+m*g+u*p-l*_,this.z=o+m*_+l*g-d*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[4]*s+l[8]*o,this.y=l[1]*t+l[5]*s+l[9]*o,this.z=l[2]*t+l[6]*s+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const s=e.x,o=e.y,l=e.z,d=t.x,u=t.y,m=t.z;return this.x=o*m-l*u,this.y=l*d-s*m,this.z=s*u-o*d,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const s=e.dot(this)/t;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return td.copy(this).projectOnVector(e),this.sub(td)}reflect(e){return this.sub(td.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(Rn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y,o=this.z-e.z;return t*t+s*s+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,s){const o=Math.sin(t)*e;return this.x=o*Math.sin(s),this.y=Math.cos(t)*e,this.z=o*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,s){return this.x=e*Math.sin(t),this.y=s,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=s,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,s=Math.sqrt(1-t*t);return this.x=s*Math.cos(e),this.y=t,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const td=new le,Fm=new ro;class aa{constructor(e=new le(1/0,1/0,1/0),t=new le(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t+=3)this.expandByPoint(ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,s=e.count;t<s;t++)this.expandByPoint(ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const s=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const l=s.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let d=0,u=l.count;d<u;d++)e.isMesh===!0?e.getVertexPosition(d,ri):ri.fromBufferAttribute(l,d),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),gl.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),gl.copy(s.boundingBox)),gl.applyMatrix4(e.matrixWorld),this.union(gl)}const o=e.children;for(let l=0,d=o.length;l<d;l++)this.expandByObject(o[l],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,s;return e.normal.x>0?(t=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),t<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($a),vl.subVectors(this.max,$a),Ps.subVectors(e.a,$a),Ls.subVectors(e.b,$a),Ds.subVectors(e.c,$a),dr.subVectors(Ls,Ps),fr.subVectors(Ds,Ls),Br.subVectors(Ps,Ds);let t=[0,-dr.z,dr.y,0,-fr.z,fr.y,0,-Br.z,Br.y,dr.z,0,-dr.x,fr.z,0,-fr.x,Br.z,0,-Br.x,-dr.y,dr.x,0,-fr.y,fr.x,0,-Br.y,Br.x,0];return!nd(t,Ps,Ls,Ds,vl)||(t=[1,0,0,0,1,0,0,0,1],!nd(t,Ps,Ls,Ds,vl))?!1:(_l.crossVectors(dr,fr),t=[_l.x,_l.y,_l.z],nd(t,Ps,Ls,Ds,vl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Li=[new le,new le,new le,new le,new le,new le,new le,new le],ri=new le,gl=new aa,Ps=new le,Ls=new le,Ds=new le,dr=new le,fr=new le,Br=new le,$a=new le,vl=new le,_l=new le,jr=new le;function nd(r,e,t,s,o){for(let l=0,d=r.length-3;l<=d;l+=3){jr.fromArray(r,l);const u=o.x*Math.abs(jr.x)+o.y*Math.abs(jr.y)+o.z*Math.abs(jr.z),m=e.dot(jr),p=t.dot(jr),g=s.dot(jr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>u)return!1}return!0}const uS=new aa,Xa=new le,id=new le;class Kd{constructor(e=new le,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const s=this.center;t!==void 0?s.copy(t):uS.setFromPoints(e).getCenter(s);let o=0;for(let l=0,d=e.length;l<d;l++)o=Math.max(o,s.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const s=this.center.distanceToSquared(e);return t.copy(e),s>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Xa.subVectors(e,this.center);const t=Xa.lengthSq();if(t>this.radius*this.radius){const s=Math.sqrt(t),o=(s-this.radius)*.5;this.center.addScaledVector(Xa,o/s),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(id.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Xa.copy(e.center).add(id)),this.expandByPoint(Xa.copy(e.center).sub(id))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Di=new le,rd=new le,xl=new le,hr=new le,sd=new le,yl=new le,ad=new le;class dS{constructor(e=new le,t=new le(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const s=t.dot(this.direction);return s<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,s,o){rd.copy(e).add(t).multiplyScalar(.5),xl.copy(t).sub(e).normalize(),hr.copy(this.origin).sub(rd);const l=e.distanceTo(t)*.5,d=-this.direction.dot(xl),u=hr.dot(this.direction),m=-hr.dot(xl),p=hr.lengthSq(),g=Math.abs(1-d*d);let _,y,M,E;if(g>0)if(_=d*m-u,y=d*u-m,E=l*g,_>=0)if(y>=-E)if(y<=E){const w=1/g;_*=w,y*=w,M=_*(_+d*y+2*u)+y*(d*_+y+2*m)+p}else y=l,_=Math.max(0,-(d*y+u)),M=-_*_+y*(y+2*m)+p;else y=-l,_=Math.max(0,-(d*y+u)),M=-_*_+y*(y+2*m)+p;else y<=-E?(_=Math.max(0,-(-d*l+u)),y=_>0?-l:Math.min(Math.max(-l,-m),l),M=-_*_+y*(y+2*m)+p):y<=E?(_=0,y=Math.min(Math.max(-l,-m),l),M=y*(y+2*m)+p):(_=Math.max(0,-(d*l+u)),y=_>0?l:Math.min(Math.max(-l,-m),l),M=-_*_+y*(y+2*m)+p);else y=d>0?-l:l,_=Math.max(0,-(d*y+u)),M=-_*_+y*(y+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,_),o&&o.copy(rd).addScaledVector(xl,y),M}intersectSphere(e,t){Di.subVectors(e.center,this.origin);const s=Di.dot(this.direction),o=Di.dot(Di)-s*s,l=e.radius*e.radius;if(o>l)return null;const d=Math.sqrt(l-o),u=s-d,m=s+d;return m<0?null:u<0?this.at(m,t):this.at(u,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/t;return s>=0?s:null}intersectPlane(e,t){const s=this.distanceToPlane(e);return s===null?null:this.at(s,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let s,o,l,d,u,m;const p=1/this.direction.x,g=1/this.direction.y,_=1/this.direction.z,y=this.origin;return p>=0?(s=(e.min.x-y.x)*p,o=(e.max.x-y.x)*p):(s=(e.max.x-y.x)*p,o=(e.min.x-y.x)*p),g>=0?(l=(e.min.y-y.y)*g,d=(e.max.y-y.y)*g):(l=(e.max.y-y.y)*g,d=(e.min.y-y.y)*g),s>d||l>o||((l>s||isNaN(s))&&(s=l),(d<o||isNaN(o))&&(o=d),_>=0?(u=(e.min.z-y.z)*_,m=(e.max.z-y.z)*_):(u=(e.max.z-y.z)*_,m=(e.min.z-y.z)*_),s>m||u>o)||((u>s||s!==s)&&(s=u),(m<o||o!==o)&&(o=m),o<0)?null:this.at(s>=0?s:o,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,s,o,l){sd.subVectors(t,e),yl.subVectors(s,e),ad.crossVectors(sd,yl);let d=this.direction.dot(ad),u;if(d>0){if(o)return null;u=1}else if(d<0)u=-1,d=-d;else return null;hr.subVectors(this.origin,e);const m=u*this.direction.dot(yl.crossVectors(hr,yl));if(m<0)return null;const p=u*this.direction.dot(sd.cross(hr));if(p<0||m+p>d)return null;const g=-u*hr.dot(ad);return g<0?null:this.at(g/d,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(e,t,s,o,l,d,u,m,p,g,_,y,M,E,w,S){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,d,u,m,p,g,_,y,M,E,w,S)}set(e,t,s,o,l,d,u,m,p,g,_,y,M,E,w,S){const x=this.elements;return x[0]=e,x[4]=t,x[8]=s,x[12]=o,x[1]=l,x[5]=d,x[9]=u,x[13]=m,x[2]=p,x[6]=g,x[10]=_,x[14]=y,x[3]=M,x[7]=E,x[11]=w,x[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],t[9]=s[9],t[10]=s[10],t[11]=s[11],t[12]=s[12],t[13]=s[13],t[14]=s[14],t[15]=s[15],this}copyPosition(e){const t=this.elements,s=e.elements;return t[12]=s[12],t[13]=s[13],t[14]=s[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,s){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,t,s){return this.set(e.x,t.x,s.x,0,e.y,t.y,s.y,0,e.z,t.z,s.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,s=e.elements,o=1/Us.setFromMatrixColumn(e,0).length(),l=1/Us.setFromMatrixColumn(e,1).length(),d=1/Us.setFromMatrixColumn(e,2).length();return t[0]=s[0]*o,t[1]=s[1]*o,t[2]=s[2]*o,t[3]=0,t[4]=s[4]*l,t[5]=s[5]*l,t[6]=s[6]*l,t[7]=0,t[8]=s[8]*d,t[9]=s[9]*d,t[10]=s[10]*d,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,s=e.x,o=e.y,l=e.z,d=Math.cos(s),u=Math.sin(s),m=Math.cos(o),p=Math.sin(o),g=Math.cos(l),_=Math.sin(l);if(e.order==="XYZ"){const y=d*g,M=d*_,E=u*g,w=u*_;t[0]=m*g,t[4]=-m*_,t[8]=p,t[1]=M+E*p,t[5]=y-w*p,t[9]=-u*m,t[2]=w-y*p,t[6]=E+M*p,t[10]=d*m}else if(e.order==="YXZ"){const y=m*g,M=m*_,E=p*g,w=p*_;t[0]=y+w*u,t[4]=E*u-M,t[8]=d*p,t[1]=d*_,t[5]=d*g,t[9]=-u,t[2]=M*u-E,t[6]=w+y*u,t[10]=d*m}else if(e.order==="ZXY"){const y=m*g,M=m*_,E=p*g,w=p*_;t[0]=y-w*u,t[4]=-d*_,t[8]=E+M*u,t[1]=M+E*u,t[5]=d*g,t[9]=w-y*u,t[2]=-d*p,t[6]=u,t[10]=d*m}else if(e.order==="ZYX"){const y=d*g,M=d*_,E=u*g,w=u*_;t[0]=m*g,t[4]=E*p-M,t[8]=y*p+w,t[1]=m*_,t[5]=w*p+y,t[9]=M*p-E,t[2]=-p,t[6]=u*m,t[10]=d*m}else if(e.order==="YZX"){const y=d*m,M=d*p,E=u*m,w=u*p;t[0]=m*g,t[4]=w-y*_,t[8]=E*_+M,t[1]=_,t[5]=d*g,t[9]=-u*g,t[2]=-p*g,t[6]=M*_+E,t[10]=y-w*_}else if(e.order==="XZY"){const y=d*m,M=d*p,E=u*m,w=u*p;t[0]=m*g,t[4]=-_,t[8]=p*g,t[1]=y*_+w,t[5]=d*g,t[9]=M*_-E,t[2]=E*_-M,t[6]=u*g,t[10]=w*_+y}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(fS,e,hS)}lookAt(e,t,s){const o=this.elements;return On.subVectors(e,t),On.lengthSq()===0&&(On.z=1),On.normalize(),pr.crossVectors(s,On),pr.lengthSq()===0&&(Math.abs(s.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),pr.crossVectors(s,On)),pr.normalize(),Sl.crossVectors(On,pr),o[0]=pr.x,o[4]=Sl.x,o[8]=On.x,o[1]=pr.y,o[5]=Sl.y,o[9]=On.y,o[2]=pr.z,o[6]=Sl.z,o[10]=On.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,d=s[0],u=s[4],m=s[8],p=s[12],g=s[1],_=s[5],y=s[9],M=s[13],E=s[2],w=s[6],S=s[10],x=s[14],L=s[3],N=s[7],U=s[11],Y=s[15],I=o[0],k=o[4],$=o[8],R=o[12],A=o[1],D=o[5],W=o[9],j=o[13],te=o[2],oe=o[6],he=o[10],de=o[14],H=o[3],B=o[7],K=o[11],O=o[15];return l[0]=d*I+u*A+m*te+p*H,l[4]=d*k+u*D+m*oe+p*B,l[8]=d*$+u*W+m*he+p*K,l[12]=d*R+u*j+m*de+p*O,l[1]=g*I+_*A+y*te+M*H,l[5]=g*k+_*D+y*oe+M*B,l[9]=g*$+_*W+y*he+M*K,l[13]=g*R+_*j+y*de+M*O,l[2]=E*I+w*A+S*te+x*H,l[6]=E*k+w*D+S*oe+x*B,l[10]=E*$+w*W+S*he+x*K,l[14]=E*R+w*j+S*de+x*O,l[3]=L*I+N*A+U*te+Y*H,l[7]=L*k+N*D+U*oe+Y*B,l[11]=L*$+N*W+U*he+Y*K,l[15]=L*R+N*j+U*de+Y*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[4],o=e[8],l=e[12],d=e[1],u=e[5],m=e[9],p=e[13],g=e[2],_=e[6],y=e[10],M=e[14],E=e[3],w=e[7],S=e[11],x=e[15];return E*(+l*m*_-o*p*_-l*u*y+s*p*y+o*u*M-s*m*M)+w*(+t*m*M-t*p*y+l*d*y-o*d*M+o*p*g-l*m*g)+S*(+t*p*_-t*u*M-l*d*_+s*d*M+l*u*g-s*p*g)+x*(-o*u*g-t*m*_+t*u*y+o*d*_-s*d*y+s*m*g)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,s){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=s),this}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],d=e[4],u=e[5],m=e[6],p=e[7],g=e[8],_=e[9],y=e[10],M=e[11],E=e[12],w=e[13],S=e[14],x=e[15],L=_*S*p-w*y*p+w*m*M-u*S*M-_*m*x+u*y*x,N=E*y*p-g*S*p-E*m*M+d*S*M+g*m*x-d*y*x,U=g*w*p-E*_*p+E*u*M-d*w*M-g*u*x+d*_*x,Y=E*_*m-g*w*m-E*u*y+d*w*y+g*u*S-d*_*S,I=t*L+s*N+o*U+l*Y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/I;return e[0]=L*k,e[1]=(w*y*l-_*S*l-w*o*M+s*S*M+_*o*x-s*y*x)*k,e[2]=(u*S*l-w*m*l+w*o*p-s*S*p-u*o*x+s*m*x)*k,e[3]=(_*m*l-u*y*l-_*o*p+s*y*p+u*o*M-s*m*M)*k,e[4]=N*k,e[5]=(g*S*l-E*y*l+E*o*M-t*S*M-g*o*x+t*y*x)*k,e[6]=(E*m*l-d*S*l-E*o*p+t*S*p+d*o*x-t*m*x)*k,e[7]=(d*y*l-g*m*l+g*o*p-t*y*p-d*o*M+t*m*M)*k,e[8]=U*k,e[9]=(E*_*l-g*w*l-E*s*M+t*w*M+g*s*x-t*_*x)*k,e[10]=(d*w*l-E*u*l+E*s*p-t*w*p-d*s*x+t*u*x)*k,e[11]=(g*u*l-d*_*l-g*s*p+t*_*p+d*s*M-t*u*M)*k,e[12]=Y*k,e[13]=(g*w*o-E*_*o+E*s*y-t*w*y-g*s*S+t*_*S)*k,e[14]=(E*u*o-d*w*o-E*s*m+t*w*m+d*s*S-t*u*S)*k,e[15]=(d*_*o-g*u*o+g*s*m-t*_*m-d*s*y+t*u*y)*k,this}scale(e){const t=this.elements,s=e.x,o=e.y,l=e.z;return t[0]*=s,t[4]*=o,t[8]*=l,t[1]*=s,t[5]*=o,t[9]*=l,t[2]*=s,t[6]*=o,t[10]*=l,t[3]*=s,t[7]*=o,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,s,o))}makeTranslation(e,t,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,s,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,t,-s,0,0,s,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,0,s,0,0,1,0,0,-s,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,0,s,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const s=Math.cos(t),o=Math.sin(t),l=1-s,d=e.x,u=e.y,m=e.z,p=l*d,g=l*u;return this.set(p*d+s,p*u-o*m,p*m+o*u,0,p*u+o*m,g*u+s,g*m-o*d,0,p*m-o*u,g*m+o*d,l*m*m+s,0,0,0,0,1),this}makeScale(e,t,s){return this.set(e,0,0,0,0,t,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,t,s,o,l,d){return this.set(1,s,l,0,e,1,d,0,t,o,1,0,0,0,0,1),this}compose(e,t,s){const o=this.elements,l=t._x,d=t._y,u=t._z,m=t._w,p=l+l,g=d+d,_=u+u,y=l*p,M=l*g,E=l*_,w=d*g,S=d*_,x=u*_,L=m*p,N=m*g,U=m*_,Y=s.x,I=s.y,k=s.z;return o[0]=(1-(w+x))*Y,o[1]=(M+U)*Y,o[2]=(E-N)*Y,o[3]=0,o[4]=(M-U)*I,o[5]=(1-(y+x))*I,o[6]=(S+L)*I,o[7]=0,o[8]=(E+N)*k,o[9]=(S-L)*k,o[10]=(1-(y+w))*k,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,s){const o=this.elements;let l=Us.set(o[0],o[1],o[2]).length();const d=Us.set(o[4],o[5],o[6]).length(),u=Us.set(o[8],o[9],o[10]).length();this.determinant()<0&&(l=-l),e.x=o[12],e.y=o[13],e.z=o[14],si.copy(this);const p=1/l,g=1/d,_=1/u;return si.elements[0]*=p,si.elements[1]*=p,si.elements[2]*=p,si.elements[4]*=g,si.elements[5]*=g,si.elements[6]*=g,si.elements[8]*=_,si.elements[9]*=_,si.elements[10]*=_,t.setFromRotationMatrix(si),s.x=l,s.y=d,s.z=u,this}makePerspective(e,t,s,o,l,d,u=zi){const m=this.elements,p=2*l/(t-e),g=2*l/(s-o),_=(t+e)/(t-e),y=(s+o)/(s-o);let M,E;if(u===zi)M=-(d+l)/(d-l),E=-2*d*l/(d-l);else if(u===Xl)M=-d/(d-l),E=-d*l/(d-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+u);return m[0]=p,m[4]=0,m[8]=_,m[12]=0,m[1]=0,m[5]=g,m[9]=y,m[13]=0,m[2]=0,m[6]=0,m[10]=M,m[14]=E,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,t,s,o,l,d,u=zi){const m=this.elements,p=1/(t-e),g=1/(s-o),_=1/(d-l),y=(t+e)*p,M=(s+o)*g;let E,w;if(u===zi)E=(d+l)*_,w=-2*_;else if(u===Xl)E=l*_,w=-1*_;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+u);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-y,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-M,m[2]=0,m[6]=0,m[10]=w,m[14]=-E,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<16;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<16;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e[t+9]=s[9],e[t+10]=s[10],e[t+11]=s[11],e[t+12]=s[12],e[t+13]=s[13],e[t+14]=s[14],e[t+15]=s[15],e}}const Us=new le,si=new Bt,fS=new le(0,0,0),hS=new le(1,1,1),pr=new le,Sl=new le,On=new le,Om=new Bt,km=new ro;class Si{constructor(e=0,t=0,s=0,o=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=s,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,s,o=this._order){return this._x=e,this._y=t,this._z=s,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,s=!0){const o=e.elements,l=o[0],d=o[4],u=o[8],m=o[1],p=o[5],g=o[9],_=o[2],y=o[6],M=o[10];switch(t){case"XYZ":this._y=Math.asin(Rn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-d,l)):(this._x=Math.atan2(y,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Rn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(u,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-_,l),this._z=0);break;case"ZXY":this._x=Math.asin(Rn(y,-1,1)),Math.abs(y)<.9999999?(this._y=Math.atan2(-_,M),this._z=Math.atan2(-d,p)):(this._y=0,this._z=Math.atan2(m,l));break;case"ZYX":this._y=Math.asin(-Rn(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(y,M),this._z=Math.atan2(m,l)):(this._x=0,this._z=Math.atan2(-d,p));break;case"YZX":this._z=Math.asin(Rn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-_,l)):(this._x=0,this._y=Math.atan2(u,M));break;case"XZY":this._z=Math.asin(-Rn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(y,p),this._y=Math.atan2(u,l)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,s){return Om.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Om,t,s)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return km.setFromEuler(this),this.setFromQuaternion(km,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class lv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let pS=0;const zm=new le,Is=new ro,Ui=new Bt,Ml=new le,qa=new le,mS=new le,gS=new ro,Bm=new le(1,0,0),jm=new le(0,1,0),Hm=new le(0,0,1),Vm={type:"added"},vS={type:"removed"},Fs={type:"childadded",child:null},od={type:"childremoved",child:null};class gn extends sa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pS++}),this.uuid=io(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gn.DEFAULT_UP.clone();const e=new le,t=new Si,s=new ro,o=new le(1,1,1);function l(){s.setFromEuler(t,!1)}function d(){t.setFromQuaternion(s,void 0,!1)}t._onChange(l),s._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Bt},normalMatrix:{value:new ft}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(Bm,e)}rotateY(e){return this.rotateOnAxis(jm,e)}rotateZ(e){return this.rotateOnAxis(Hm,e)}translateOnAxis(e,t){return zm.copy(e).applyQuaternion(this.quaternion),this.position.add(zm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bm,e)}translateY(e){return this.translateOnAxis(jm,e)}translateZ(e){return this.translateOnAxis(Hm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,s){e.isVector3?Ml.copy(e):Ml.set(e,t,s);const o=this.parent;this.updateWorldMatrix(!0,!1),qa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(qa,Ml,this.up):Ui.lookAt(Ml,qa,this.up),this.quaternion.setFromRotationMatrix(Ui),o&&(Ui.extractRotation(o.matrixWorld),Is.setFromRotationMatrix(Ui),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Vm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(vS),od.child=e,this.dispatchEvent(od),od.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Vm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let s=0,o=this.children.length;s<o;s++){const d=this.children[s].getObjectByProperty(e,t);if(d!==void 0)return d}}getObjectsByProperty(e,t,s=[]){this[e]===t&&s.push(this);const o=this.children;for(let l=0,d=o.length;l<d;l++)o[l].getObjectsByProperty(e,t,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,e,mS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,gS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let s=0,o=t.length;s<o;s++){const l=t[s];(l.matrixWorldAutoUpdate===!0||e===!0)&&l.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const s=this.parent;if(e===!0&&s!==null&&s.matrixWorldAutoUpdate===!0&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const o=this.children;for(let l=0,d=o.length;l<d;l++){const u=o[l];u.matrixWorldAutoUpdate===!0&&u.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",s={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(u=>({boxInitialized:u.boxInitialized,boxMin:u.box.min.toArray(),boxMax:u.box.max.toArray(),sphereInitialized:u.sphereInitialized,sphereRadius:u.sphere.radius,sphereCenter:u.sphere.center.toArray()})),o.maxGeometryCount=this._maxGeometryCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function l(u,m){return u[m.uuid]===void 0&&(u[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const u=this.geometry.parameters;if(u!==void 0&&u.shapes!==void 0){const m=u.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const _=m[p];l(e.shapes,_)}else l(e.shapes,m)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const u=[];for(let m=0,p=this.material.length;m<p;m++)u.push(l(e.materials,this.material[m]));o.material=u}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let u=0;u<this.children.length;u++)o.children.push(this.children[u].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let u=0;u<this.animations.length;u++){const m=this.animations[u];o.animations.push(l(e.animations,m))}}if(t){const u=d(e.geometries),m=d(e.materials),p=d(e.textures),g=d(e.images),_=d(e.shapes),y=d(e.skeletons),M=d(e.animations),E=d(e.nodes);u.length>0&&(s.geometries=u),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),_.length>0&&(s.shapes=_),y.length>0&&(s.skeletons=y),M.length>0&&(s.animations=M),E.length>0&&(s.nodes=E)}return s.object=o,s;function d(u){const m=[];for(const p in u){const g=u[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let s=0;s<e.children.length;s++){const o=e.children[s];this.add(o.clone())}return this}}gn.DEFAULT_UP=new le(0,1,0);gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ai=new le,Ii=new le,ld=new le,Fi=new le,Os=new le,ks=new le,Gm=new le,cd=new le,ud=new le,dd=new le;class vi{constructor(e=new le,t=new le,s=new le){this.a=e,this.b=t,this.c=s}static getNormal(e,t,s,o){o.subVectors(s,t),ai.subVectors(e,t),o.cross(ai);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,t,s,o,l){ai.subVectors(o,t),Ii.subVectors(s,t),ld.subVectors(e,t);const d=ai.dot(ai),u=ai.dot(Ii),m=ai.dot(ld),p=Ii.dot(Ii),g=Ii.dot(ld),_=d*p-u*u;if(_===0)return l.set(0,0,0),null;const y=1/_,M=(p*m-u*g)*y,E=(d*g-u*m)*y;return l.set(1-M-E,E,M)}static containsPoint(e,t,s,o){return this.getBarycoord(e,t,s,o,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,s,o,l,d,u,m){return this.getBarycoord(e,t,s,o,Fi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(l,Fi.x),m.addScaledVector(d,Fi.y),m.addScaledVector(u,Fi.z),m)}static isFrontFacing(e,t,s,o){return ai.subVectors(s,t),Ii.subVectors(e,t),ai.cross(Ii).dot(o)<0}set(e,t,s){return this.a.copy(e),this.b.copy(t),this.c.copy(s),this}setFromPointsAndIndices(e,t,s,o){return this.a.copy(e[t]),this.b.copy(e[s]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,s,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ai.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),ai.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,s,o,l){return vi.getInterpolation(e,this.a,this.b,this.c,t,s,o,l)}containsPoint(e){return vi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const s=this.a,o=this.b,l=this.c;let d,u;Os.subVectors(o,s),ks.subVectors(l,s),cd.subVectors(e,s);const m=Os.dot(cd),p=ks.dot(cd);if(m<=0&&p<=0)return t.copy(s);ud.subVectors(e,o);const g=Os.dot(ud),_=ks.dot(ud);if(g>=0&&_<=g)return t.copy(o);const y=m*_-g*p;if(y<=0&&m>=0&&g<=0)return d=m/(m-g),t.copy(s).addScaledVector(Os,d);dd.subVectors(e,l);const M=Os.dot(dd),E=ks.dot(dd);if(E>=0&&M<=E)return t.copy(l);const w=M*p-m*E;if(w<=0&&p>=0&&E<=0)return u=p/(p-E),t.copy(s).addScaledVector(ks,u);const S=g*E-M*_;if(S<=0&&_-g>=0&&M-E>=0)return Gm.subVectors(l,o),u=(_-g)/(_-g+(M-E)),t.copy(o).addScaledVector(Gm,u);const x=1/(S+w+y);return d=w*x,u=y*x,t.copy(s).addScaledVector(Os,d).addScaledVector(ks,u)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const cv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},El={h:0,s:0,l:0};function fd(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Et{constructor(e,t,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,s)}set(e,t,s){if(t===void 0&&s===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.toWorkingColorSpace(this,t),this}setRGB(e,t,s,o=At.workingColorSpace){return this.r=e,this.g=t,this.b=s,At.toWorkingColorSpace(this,o),this}setHSL(e,t,s,o=At.workingColorSpace){if(e=tS(e,1),t=Rn(t,0,1),s=Rn(s,0,1),t===0)this.r=this.g=this.b=s;else{const l=s<=.5?s*(1+t):s+t-s*t,d=2*s-l;this.r=fd(d,l,e+1/3),this.g=fd(d,l,e),this.b=fd(d,l,e-1/3)}return At.toWorkingColorSpace(this,o),this}setStyle(e,t=pi){function s(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const d=o[1],u=o[2];switch(d){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return s(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return s(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return s(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],d=l.length;if(d===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(d===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pi){const s=cv[e.toLowerCase()];return s!==void 0?this.setHex(s,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}copyLinearToSRGB(e){return this.r=Qu(e.r),this.g=Qu(e.g),this.b=Qu(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pi){return At.fromWorkingColorSpace(pn.copy(this),e),Math.round(Rn(pn.r*255,0,255))*65536+Math.round(Rn(pn.g*255,0,255))*256+Math.round(Rn(pn.b*255,0,255))}getHexString(e=pi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.fromWorkingColorSpace(pn.copy(this),t);const s=pn.r,o=pn.g,l=pn.b,d=Math.max(s,o,l),u=Math.min(s,o,l);let m,p;const g=(u+d)/2;if(u===d)m=0,p=0;else{const _=d-u;switch(p=g<=.5?_/(d+u):_/(2-d-u),d){case s:m=(o-l)/_+(o<l?6:0);break;case o:m=(l-s)/_+2;break;case l:m=(s-o)/_+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,t=At.workingColorSpace){return At.fromWorkingColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=pi){At.fromWorkingColorSpace(pn.copy(this),e);const t=pn.r,s=pn.g,o=pn.b;return e!==pi?`color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(s*255)},${Math.round(o*255)})`}offsetHSL(e,t,s){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,s){return this.r=e.r+(t.r-e.r)*s,this.g=e.g+(t.g-e.g)*s,this.b=e.b+(t.b-e.b)*s,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(El);const s=Zu(mr.h,El.h,t),o=Zu(mr.s,El.s,t),l=Zu(mr.l,El.l,t);return this.setHSL(s,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,s=this.g,o=this.b,l=e.elements;return this.r=l[0]*t+l[3]*s+l[6]*o,this.g=l[1]*t+l[4]*s+l[7]*o,this.b=l[2]*t+l[5]*s+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pn=new Et;Et.NAMES=cv;let _S=0;class so extends sa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_S++}),this.uuid=io(),this.name="",this.type="Material",this.blending=Ys,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rd,this.blendDst=Nd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=Vl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const s=e[t];if(s===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(s):o&&o.isVector3&&s&&s.isVector3?o.copy(s):this[t]=s}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Ys&&(s.blending=this.blending),this.side!==Sr&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Rd&&(s.blendSrc=this.blendSrc),this.blendDst!==Nd&&(s.blendDst=this.blendDst),this.blendEquation!==qr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Vl&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nm&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function o(l){const d=[];for(const u in l){const m=l[u];delete m.metadata,d.push(m)}return d}if(t){const l=o(e.textures),d=o(e.images);l.length>0&&(s.textures=l),d.length>0&&(s.images=d)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let s=null;if(t!==null){const o=t.length;s=new Array(o);for(let l=0;l!==o;++l)s[l]=t[l].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class uv extends so{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=qg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ht=new le,wl=new xt;class Bn{constructor(e,t,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=s,this.usage=Pm,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return iS("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,s){e*=this.itemSize,s*=t.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=t.array[s+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,s=this.count;t<s;t++)wl.fromBufferAttribute(this,t),wl.applyMatrix3(e),this.setXY(t,wl.x,wl.y);else if(this.itemSize===3)for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix3(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyMatrix4(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let s=this.array[e*this.itemSize+t];return this.normalized&&(s=Wa(s,this.array)),s}setComponent(e,t,s){return this.normalized&&(s=Cn(s,this.array)),this.array[e*this.itemSize+t]=s,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Wa(t,this.array)),t}setX(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Wa(t,this.array)),t}setY(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Wa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Wa(t,this.array)),t}setW(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,s){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array)),this.array[e+0]=t,this.array[e+1]=s,this}setXYZ(e,t,s,o){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this}setXYZW(e,t,s,o,l){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array),l=Cn(l,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pm&&(e.usage=this.usage),e}}class dv extends Bn{constructor(e,t,s){super(new Uint16Array(e),t,s)}}class fv extends Bn{constructor(e,t,s){super(new Uint32Array(e),t,s)}}class Bi extends Bn{constructor(e,t,s){super(new Float32Array(e),t,s)}}let xS=0;const Xn=new Bt,hd=new gn,zs=new le,kn=new aa,Ya=new aa,nn=new le;class Hi extends sa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xS++}),this.uuid=io(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sv(e)?fv:dv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,s=0){this.groups.push({start:e,count:t,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const l=new ft().getNormalMatrix(e);s.applyNormalMatrix(l),s.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xn.makeRotationFromQuaternion(e),this.applyMatrix4(Xn),this}rotateX(e){return Xn.makeRotationX(e),this.applyMatrix4(Xn),this}rotateY(e){return Xn.makeRotationY(e),this.applyMatrix4(Xn),this}rotateZ(e){return Xn.makeRotationZ(e),this.applyMatrix4(Xn),this}translate(e,t,s){return Xn.makeTranslation(e,t,s),this.applyMatrix4(Xn),this}scale(e,t,s){return Xn.makeScale(e,t,s),this.applyMatrix4(Xn),this}lookAt(e){return hd.lookAt(e),hd.updateMatrix(),this.applyMatrix4(hd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){const t=[];for(let s=0,o=e.length;s<o;s++){const l=e[s];t.push(l.x,l.y,l.z||0)}return this.setAttribute("position",new Bi(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new aa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new le(-1/0,-1/0,-1/0),new le(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const l=t[s];kn.setFromBufferAttribute(l),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,kn.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,kn.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(kn.min),this.boundingBox.expandByPoint(kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Kd);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new le,1/0);return}if(e){const s=this.boundingSphere.center;if(kn.setFromBufferAttribute(e),t)for(let l=0,d=t.length;l<d;l++){const u=t[l];Ya.setFromBufferAttribute(u),this.morphTargetsRelative?(nn.addVectors(kn.min,Ya.min),kn.expandByPoint(nn),nn.addVectors(kn.max,Ya.max),kn.expandByPoint(nn)):(kn.expandByPoint(Ya.min),kn.expandByPoint(Ya.max))}kn.getCenter(s);let o=0;for(let l=0,d=e.count;l<d;l++)nn.fromBufferAttribute(e,l),o=Math.max(o,s.distanceToSquared(nn));if(t)for(let l=0,d=t.length;l<d;l++){const u=t[l],m=this.morphTargetsRelative;for(let p=0,g=u.count;p<g;p++)nn.fromBufferAttribute(u,p),m&&(zs.fromBufferAttribute(e,p),nn.add(zs)),o=Math.max(o,s.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=t.position,o=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*s.count),4));const d=this.getAttribute("tangent"),u=[],m=[];for(let $=0;$<s.count;$++)u[$]=new le,m[$]=new le;const p=new le,g=new le,_=new le,y=new xt,M=new xt,E=new xt,w=new le,S=new le;function x($,R,A){p.fromBufferAttribute(s,$),g.fromBufferAttribute(s,R),_.fromBufferAttribute(s,A),y.fromBufferAttribute(l,$),M.fromBufferAttribute(l,R),E.fromBufferAttribute(l,A),g.sub(p),_.sub(p),M.sub(y),E.sub(y);const D=1/(M.x*E.y-E.x*M.y);isFinite(D)&&(w.copy(g).multiplyScalar(E.y).addScaledVector(_,-M.y).multiplyScalar(D),S.copy(_).multiplyScalar(M.x).addScaledVector(g,-E.x).multiplyScalar(D),u[$].add(w),u[R].add(w),u[A].add(w),m[$].add(S),m[R].add(S),m[A].add(S))}let L=this.groups;L.length===0&&(L=[{start:0,count:e.count}]);for(let $=0,R=L.length;$<R;++$){const A=L[$],D=A.start,W=A.count;for(let j=D,te=D+W;j<te;j+=3)x(e.getX(j+0),e.getX(j+1),e.getX(j+2))}const N=new le,U=new le,Y=new le,I=new le;function k($){Y.fromBufferAttribute(o,$),I.copy(Y);const R=u[$];N.copy(R),N.sub(Y.multiplyScalar(Y.dot(R))).normalize(),U.crossVectors(I,R);const D=U.dot(m[$])<0?-1:1;d.setXYZW($,N.x,N.y,N.z,D)}for(let $=0,R=L.length;$<R;++$){const A=L[$],D=A.start,W=A.count;for(let j=D,te=D+W;j<te;j+=3)k(e.getX(j+0)),k(e.getX(j+1)),k(e.getX(j+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",s);else for(let y=0,M=s.count;y<M;y++)s.setXYZ(y,0,0,0);const o=new le,l=new le,d=new le,u=new le,m=new le,p=new le,g=new le,_=new le;if(e)for(let y=0,M=e.count;y<M;y+=3){const E=e.getX(y+0),w=e.getX(y+1),S=e.getX(y+2);o.fromBufferAttribute(t,E),l.fromBufferAttribute(t,w),d.fromBufferAttribute(t,S),g.subVectors(d,l),_.subVectors(o,l),g.cross(_),u.fromBufferAttribute(s,E),m.fromBufferAttribute(s,w),p.fromBufferAttribute(s,S),u.add(g),m.add(g),p.add(g),s.setXYZ(E,u.x,u.y,u.z),s.setXYZ(w,m.x,m.y,m.z),s.setXYZ(S,p.x,p.y,p.z)}else for(let y=0,M=t.count;y<M;y+=3)o.fromBufferAttribute(t,y+0),l.fromBufferAttribute(t,y+1),d.fromBufferAttribute(t,y+2),g.subVectors(d,l),_.subVectors(o,l),g.cross(_),s.setXYZ(y+0,g.x,g.y,g.z),s.setXYZ(y+1,g.x,g.y,g.z),s.setXYZ(y+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,s=e.count;t<s;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(u,m){const p=u.array,g=u.itemSize,_=u.normalized,y=new p.constructor(m.length*g);let M=0,E=0;for(let w=0,S=m.length;w<S;w++){u.isInterleavedBufferAttribute?M=m[w]*u.data.stride+u.offset:M=m[w]*g;for(let x=0;x<g;x++)y[E++]=p[M++]}return new Bn(y,g,_)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Hi,s=this.index.array,o=this.attributes;for(const u in o){const m=o[u],p=e(m,s);t.setAttribute(u,p)}const l=this.morphAttributes;for(const u in l){const m=[],p=l[u];for(let g=0,_=p.length;g<_;g++){const y=p[g],M=e(y,s);m.push(M)}t.morphAttributes[u]=m}t.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let u=0,m=d.length;u<m;u++){const p=d[u];t.addGroup(p.start,p.count,p.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const s=this.attributes;for(const m in s){const p=s[m];e.data.attributes[m]=p.toJSON(e.data)}const o={};let l=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let _=0,y=p.length;_<y;_++){const M=p[_];g.push(M.toJSON(e.data))}g.length>0&&(o[m]=g,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const u=this.boundingSphere;return u!==null&&(e.data.boundingSphere={center:u.center.toArray(),radius:u.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(t));const o=e.attributes;for(const p in o){const g=o[p];this.setAttribute(p,g.clone(t))}const l=e.morphAttributes;for(const p in l){const g=[],_=l[p];for(let y=0,M=_.length;y<M;y++)g.push(_[y].clone(t));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let p=0,g=d.length;p<g;p++){const _=d[p];this.addGroup(_.start,_.count,_.materialIndex)}const u=e.boundingBox;u!==null&&(this.boundingBox=u.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Wm=new Bt,Hr=new dS,Tl=new Kd,$m=new le,Bs=new le,js=new le,Hs=new le,pd=new le,Al=new le,bl=new xt,Cl=new xt,Rl=new xt,Xm=new le,qm=new le,Ym=new le,Nl=new le,Pl=new le;class xi extends gn{constructor(e=new Hi,t=new uv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,s=Object.keys(t);if(s.length>0){const o=t[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,d=o.length;l<d;l++){const u=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=l}}}}getVertexPosition(e,t){const s=this.geometry,o=s.attributes.position,l=s.morphAttributes.position,d=s.morphTargetsRelative;t.fromBufferAttribute(o,e);const u=this.morphTargetInfluences;if(l&&u){Al.set(0,0,0);for(let m=0,p=l.length;m<p;m++){const g=u[m],_=l[m];g!==0&&(pd.fromBufferAttribute(_,e),d?Al.addScaledVector(pd,g):Al.addScaledVector(pd.sub(t),g))}t.add(Al)}return t}raycast(e,t){const s=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Tl.copy(s.boundingSphere),Tl.applyMatrix4(l),Hr.copy(e.ray).recast(e.near),!(Tl.containsPoint(Hr.origin)===!1&&(Hr.intersectSphere(Tl,$m)===null||Hr.origin.distanceToSquared($m)>(e.far-e.near)**2))&&(Wm.copy(l).invert(),Hr.copy(e.ray).applyMatrix4(Wm),!(s.boundingBox!==null&&Hr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,t,Hr)))}_computeIntersections(e,t,s){let o;const l=this.geometry,d=this.material,u=l.index,m=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,_=l.attributes.normal,y=l.groups,M=l.drawRange;if(u!==null)if(Array.isArray(d))for(let E=0,w=y.length;E<w;E++){const S=y[E],x=d[S.materialIndex],L=Math.max(S.start,M.start),N=Math.min(u.count,Math.min(S.start+S.count,M.start+M.count));for(let U=L,Y=N;U<Y;U+=3){const I=u.getX(U),k=u.getX(U+1),$=u.getX(U+2);o=Ll(this,x,e,s,p,g,_,I,k,$),o&&(o.faceIndex=Math.floor(U/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(u.count,M.start+M.count);for(let S=E,x=w;S<x;S+=3){const L=u.getX(S),N=u.getX(S+1),U=u.getX(S+2);o=Ll(this,d,e,s,p,g,_,L,N,U),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}else if(m!==void 0)if(Array.isArray(d))for(let E=0,w=y.length;E<w;E++){const S=y[E],x=d[S.materialIndex],L=Math.max(S.start,M.start),N=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let U=L,Y=N;U<Y;U+=3){const I=U,k=U+1,$=U+2;o=Ll(this,x,e,s,p,g,_,I,k,$),o&&(o.faceIndex=Math.floor(U/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(m.count,M.start+M.count);for(let S=E,x=w;S<x;S+=3){const L=S,N=S+1,U=S+2;o=Ll(this,d,e,s,p,g,_,L,N,U),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}}}function yS(r,e,t,s,o,l,d,u){let m;if(e.side===Nn?m=s.intersectTriangle(d,l,o,!0,u):m=s.intersectTriangle(o,l,d,e.side===Sr,u),m===null)return null;Pl.copy(u),Pl.applyMatrix4(r.matrixWorld);const p=t.ray.origin.distanceTo(Pl);return p<t.near||p>t.far?null:{distance:p,point:Pl.clone(),object:r}}function Ll(r,e,t,s,o,l,d,u,m,p){r.getVertexPosition(u,Bs),r.getVertexPosition(m,js),r.getVertexPosition(p,Hs);const g=yS(r,e,t,s,Bs,js,Hs,Nl);if(g){o&&(bl.fromBufferAttribute(o,u),Cl.fromBufferAttribute(o,m),Rl.fromBufferAttribute(o,p),g.uv=vi.getInterpolation(Nl,Bs,js,Hs,bl,Cl,Rl,new xt)),l&&(bl.fromBufferAttribute(l,u),Cl.fromBufferAttribute(l,m),Rl.fromBufferAttribute(l,p),g.uv1=vi.getInterpolation(Nl,Bs,js,Hs,bl,Cl,Rl,new xt)),d&&(Xm.fromBufferAttribute(d,u),qm.fromBufferAttribute(d,m),Ym.fromBufferAttribute(d,p),g.normal=vi.getInterpolation(Nl,Bs,js,Hs,Xm,qm,Ym,new le),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const _={a:u,b:m,c:p,normal:new le,materialIndex:0};vi.getNormal(Bs,js,Hs,_.normal),g.face=_}return g}class ao extends Hi{constructor(e=1,t=1,s=1,o=1,l=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:s,widthSegments:o,heightSegments:l,depthSegments:d};const u=this;o=Math.floor(o),l=Math.floor(l),d=Math.floor(d);const m=[],p=[],g=[],_=[];let y=0,M=0;E("z","y","x",-1,-1,s,t,e,d,l,0),E("z","y","x",1,-1,s,t,-e,d,l,1),E("x","z","y",1,1,e,s,t,o,d,2),E("x","z","y",1,-1,e,s,-t,o,d,3),E("x","y","z",1,-1,e,t,s,o,l,4),E("x","y","z",-1,-1,e,t,-s,o,l,5),this.setIndex(m),this.setAttribute("position",new Bi(p,3)),this.setAttribute("normal",new Bi(g,3)),this.setAttribute("uv",new Bi(_,2));function E(w,S,x,L,N,U,Y,I,k,$,R){const A=U/k,D=Y/$,W=U/2,j=Y/2,te=I/2,oe=k+1,he=$+1;let de=0,H=0;const B=new le;for(let K=0;K<he;K++){const O=K*D-j;for(let ie=0;ie<oe;ie++){const De=ie*A-W;B[w]=De*L,B[S]=O*N,B[x]=te,p.push(B.x,B.y,B.z),B[w]=0,B[S]=0,B[x]=I>0?1:-1,g.push(B.x,B.y,B.z),_.push(ie/k),_.push(1-K/$),de+=1}}for(let K=0;K<$;K++)for(let O=0;O<k;O++){const ie=y+O+oe*K,De=y+O+oe*(K+1),Q=y+(O+1)+oe*(K+1),pe=y+(O+1)+oe*K;m.push(ie,De,pe),m.push(De,Q,pe),H+=6}u.addGroup(M,H,R),M+=H,y+=de}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ao(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ia(r){const e={};for(const t in r){e[t]={};for(const s in r[t]){const o=r[t][s];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][s]=null):e[t][s]=o.clone():Array.isArray(o)?e[t][s]=o.slice():e[t][s]=o}}return e}function xn(r){const e={};for(let t=0;t<r.length;t++){const s=ia(r[t]);for(const o in s)e[o]=s[o]}return e}function SS(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function hv(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const MS={clone:ia,merge:xn};var ES=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Er extends so{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ES,this.fragmentShader=wS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ia(e.uniforms),this.uniformsGroups=SS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const d=this.uniforms[o].value;d&&d.isTexture?t.uniforms[o]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?t.uniforms[o]={type:"c",value:d.getHex()}:d&&d.isVector2?t.uniforms[o]={type:"v2",value:d.toArray()}:d&&d.isVector3?t.uniforms[o]={type:"v3",value:d.toArray()}:d&&d.isVector4?t.uniforms[o]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?t.uniforms[o]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?t.uniforms[o]={type:"m4",value:d.toArray()}:t.uniforms[o]={value:d}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const s={};for(const o in this.extensions)this.extensions[o]===!0&&(s[o]=!0);return Object.keys(s).length>0&&(t.extensions=s),t}}class pv extends gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=zi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gr=new le,Km=new xt,Zm=new xt;class qn extends pv{constructor(e=50,t=1,s=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Id*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ku*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Id*2*Math.atan(Math.tan(Ku*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,s){gr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gr.x,gr.y).multiplyScalar(-e/gr.z),gr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(gr.x,gr.y).multiplyScalar(-e/gr.z)}getViewSize(e,t){return this.getViewBounds(e,Km,Zm),t.subVectors(Zm,Km)}setViewOffset(e,t,s,o,l,d){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ku*.5*this.fov)/this.zoom,s=2*t,o=this.aspect*s,l=-.5*o;const d=this.view;if(this.view!==null&&this.view.enabled){const m=d.fullWidth,p=d.fullHeight;l+=d.offsetX*o/m,t-=d.offsetY*s/p,o*=d.width/m,s*=d.height/p}const u=this.filmOffset;u!==0&&(l+=e*u/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,t,t-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Vs=-90,Gs=1;class TS extends gn{constructor(e,t,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new qn(Vs,Gs,e,t);o.layers=this.layers,this.add(o);const l=new qn(Vs,Gs,e,t);l.layers=this.layers,this.add(l);const d=new qn(Vs,Gs,e,t);d.layers=this.layers,this.add(d);const u=new qn(Vs,Gs,e,t);u.layers=this.layers,this.add(u);const m=new qn(Vs,Gs,e,t);m.layers=this.layers,this.add(m);const p=new qn(Vs,Gs,e,t);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[s,o,l,d,u,m]=t;for(const p of t)this.remove(p);if(e===zi)s.up.set(0,1,0),s.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),u.up.set(0,1,0),u.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===Xl)s.up.set(0,-1,0),s.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),u.up.set(0,-1,0),u.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of t)this.add(p),p.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,d,u,m,p,g]=this.children,_=e.getRenderTarget(),y=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const w=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,o),e.render(t,l),e.setRenderTarget(s,1,o),e.render(t,d),e.setRenderTarget(s,2,o),e.render(t,u),e.setRenderTarget(s,3,o),e.render(t,m),e.setRenderTarget(s,4,o),e.render(t,p),s.texture.generateMipmaps=w,e.setRenderTarget(s,5,o),e.render(t,g),e.setRenderTarget(_,y,M),e.xr.enabled=E,s.texture.needsPMREMUpdate=!0}}class mv extends Pn{constructor(e,t,s,o,l,d,u,m,p,g){e=e!==void 0?e:[],t=t!==void 0?t:ea,super(e,t,s,o,l,d,u,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class AS extends ns{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},o=[s,s,s,s,s,s];this.texture=new mv(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:oi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new ao(5,5,5),l=new Er({name:"CubemapFromEquirect",uniforms:ia(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Nn,blending:xr});l.uniforms.tEquirect.value=t;const d=new xi(o,l),u=t.minFilter;return t.minFilter===Jr&&(t.minFilter=oi),new TS(1,10,this).update(e,d),t.minFilter=u,d.geometry.dispose(),d.material.dispose(),this}clear(e,t,s,o){const l=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(t,s,o);e.setRenderTarget(l)}}const md=new le,bS=new le,CS=new ft;class $r{constructor(e=new le(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,s,o){return this.normal.set(e,t,s),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,s){const o=md.subVectors(s,t).cross(bS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const s=e.delta(md),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/o;return l<0||l>1?null:t.copy(e.start).addScaledVector(s,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return t<0&&s>0||s<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const s=t||CS.getNormalMatrix(e),o=this.coplanarPoint(md).applyMatrix4(e),l=this.normal.applyMatrix3(s).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new Kd,Dl=new le;class Zd{constructor(e=new $r,t=new $r,s=new $r,o=new $r,l=new $r,d=new $r){this.planes=[e,t,s,o,l,d]}set(e,t,s,o,l,d){const u=this.planes;return u[0].copy(e),u[1].copy(t),u[2].copy(s),u[3].copy(o),u[4].copy(l),u[5].copy(d),this}copy(e){const t=this.planes;for(let s=0;s<6;s++)t[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,t=zi){const s=this.planes,o=e.elements,l=o[0],d=o[1],u=o[2],m=o[3],p=o[4],g=o[5],_=o[6],y=o[7],M=o[8],E=o[9],w=o[10],S=o[11],x=o[12],L=o[13],N=o[14],U=o[15];if(s[0].setComponents(m-l,y-p,S-M,U-x).normalize(),s[1].setComponents(m+l,y+p,S+M,U+x).normalize(),s[2].setComponents(m+d,y+g,S+E,U+L).normalize(),s[3].setComponents(m-d,y-g,S-E,U-L).normalize(),s[4].setComponents(m-u,y-_,S-w,U-N).normalize(),t===zi)s[5].setComponents(m+u,y+_,S+w,U+N).normalize();else if(t===Xl)s[5].setComponents(u,_,w,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const t=this.planes,s=e.center,o=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(s)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let s=0;s<6;s++){const o=t[s];if(Dl.x=o.normal.x>0?e.max.x:e.min.x,Dl.y=o.normal.y>0?e.max.y:e.min.y,Dl.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Dl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let s=0;s<6;s++)if(t[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function gv(){let r=null,e=!1,t=null,s=null;function o(l,d){t(l,d),s=r.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(s=r.requestAnimationFrame(o),e=!0)},stop:function(){r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){r=l}}}function RS(r){const e=new WeakMap;function t(u,m){const p=u.array,g=u.usage,_=p.byteLength,y=r.createBuffer();r.bindBuffer(m,y),r.bufferData(m,p,g),u.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(p instanceof Uint16Array)u.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:y,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:u.version,size:_}}function s(u,m,p){const g=m.array,_=m._updateRange,y=m.updateRanges;if(r.bindBuffer(p,u),_.count===-1&&y.length===0&&r.bufferSubData(p,0,g),y.length!==0){for(let M=0,E=y.length;M<E;M++){const w=y[M];r.bufferSubData(p,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}m.clearUpdateRanges()}_.count!==-1&&(r.bufferSubData(p,_.offset*g.BYTES_PER_ELEMENT,g,_.offset,_.count),_.count=-1),m.onUploadCallback()}function o(u){return u.isInterleavedBufferAttribute&&(u=u.data),e.get(u)}function l(u){u.isInterleavedBufferAttribute&&(u=u.data);const m=e.get(u);m&&(r.deleteBuffer(m.buffer),e.delete(u))}function d(u,m){if(u.isGLBufferAttribute){const g=e.get(u);(!g||g.version<u.version)&&e.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}u.isInterleavedBufferAttribute&&(u=u.data);const p=e.get(u);if(p===void 0)e.set(u,t(u,m));else if(p.version<u.version){if(p.size!==u.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,u,m),p.version=u.version}}return{get:o,remove:l,update:d}}class tc extends Hi{constructor(e=1,t=1,s=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:s,heightSegments:o};const l=e/2,d=t/2,u=Math.floor(s),m=Math.floor(o),p=u+1,g=m+1,_=e/u,y=t/m,M=[],E=[],w=[],S=[];for(let x=0;x<g;x++){const L=x*y-d;for(let N=0;N<p;N++){const U=N*_-l;E.push(U,-L,0),w.push(0,0,1),S.push(N/u),S.push(1-x/m)}}for(let x=0;x<m;x++)for(let L=0;L<u;L++){const N=L+p*x,U=L+p*(x+1),Y=L+1+p*(x+1),I=L+1+p*x;M.push(N,U,I),M.push(U,Y,I)}this.setIndex(M),this.setAttribute("position",new Bi(E,3)),this.setAttribute("normal",new Bi(w,3)),this.setAttribute("uv",new Bi(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tc(e.width,e.height,e.widthSegments,e.heightSegments)}}var NS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,PS=`#ifdef USE_ALPHAHASH
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
#endif`,LS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,DS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,US=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,IS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,FS=`#ifdef USE_AOMAP
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
#endif`,OS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kS=`#ifdef USE_BATCHING
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
#endif`,zS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,BS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,HS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,VS=`#ifdef USE_IRIDESCENCE
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
#endif`,GS=`#ifdef USE_BUMPMAP
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
#endif`,WS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,XS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,YS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,KS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ZS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,JS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,QS=`#define PI 3.141592653589793
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
} // validated`,eM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tM=`vec3 transformedNormal = objectNormal;
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
#endif`,nM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,iM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,aM="gl_FragColor = linearToOutputTexel( gl_FragColor );",oM=`
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
}`,lM=`#ifdef USE_ENVMAP
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
#endif`,cM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,uM=`#ifdef USE_ENVMAP
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
#endif`,dM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fM=`#ifdef USE_ENVMAP
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
#endif`,hM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vM=`#ifdef USE_GRADIENTMAP
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
}`,_M=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,SM=`uniform bool receiveShadow;
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
#endif`,MM=`#ifdef USE_ENVMAP
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
#endif`,EM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,TM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,AM=`varying vec3 vViewPosition;
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
#endif`,CM=`struct PhysicalMaterial {
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
}`,RM=`
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
#endif`,NM=`#if defined( RE_IndirectDiffuse )
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
#endif`,PM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,LM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,DM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,UM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,FM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,OM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zM=`#if defined( USE_POINTS_UV )
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
#endif`,BM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,HM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,VM=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,GM=`#ifdef USE_MORPHNORMALS
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
#endif`,WM=`#ifdef USE_MORPHTARGETS
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
#endif`,XM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,YM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,KM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,JM=`#ifdef USE_NORMALMAP
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
#endif`,QM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,aE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,oE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pE=`float getShadowMask() {
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
}`,mE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gE=`#ifdef USE_SKINNING
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
#endif`,vE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_E=`#ifdef USE_SKINNING
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
#endif`,xE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,SE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ME=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,EE=`#ifdef USE_TRANSMISSION
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
#endif`,wE=`#ifdef USE_TRANSMISSION
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
#endif`,TE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,AE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,CE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const RE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,NE=`uniform sampler2D t2D;
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
}`,PE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,DE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,UE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,IE=`#include <common>
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
}`,FE=`#if DEPTH_PACKING == 3200
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
}`,OE=`#define DISTANCE
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
}`,kE=`#define DISTANCE
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
}`,zE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,BE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jE=`uniform float scale;
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
}`,HE=`uniform vec3 diffuse;
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
}`,VE=`#include <common>
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
}`,GE=`uniform vec3 diffuse;
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
}`,WE=`#define LAMBERT
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
}`,XE=`#define MATCAP
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
}`,qE=`#define MATCAP
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
}`,YE=`#define NORMAL
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
}`,KE=`#define NORMAL
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
}`,ZE=`#define PHONG
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
}`,JE=`#define PHONG
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
}`,QE=`#define STANDARD
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
}`,ew=`#define STANDARD
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
}`,tw=`#define TOON
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
}`,nw=`#define TOON
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
}`,iw=`uniform float size;
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
}`,rw=`uniform vec3 diffuse;
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
}`,sw=`#include <common>
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
}`,aw=`uniform vec3 color;
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
}`,ow=`uniform float rotation;
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
}`,lw=`uniform vec3 diffuse;
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
}`,dt={alphahash_fragment:NS,alphahash_pars_fragment:PS,alphamap_fragment:LS,alphamap_pars_fragment:DS,alphatest_fragment:US,alphatest_pars_fragment:IS,aomap_fragment:FS,aomap_pars_fragment:OS,batching_pars_vertex:kS,batching_vertex:zS,begin_vertex:BS,beginnormal_vertex:jS,bsdfs:HS,iridescence_fragment:VS,bumpmap_pars_fragment:GS,clipping_planes_fragment:WS,clipping_planes_pars_fragment:$S,clipping_planes_pars_vertex:XS,clipping_planes_vertex:qS,color_fragment:YS,color_pars_fragment:KS,color_pars_vertex:ZS,color_vertex:JS,common:QS,cube_uv_reflection_fragment:eM,defaultnormal_vertex:tM,displacementmap_pars_vertex:nM,displacementmap_vertex:iM,emissivemap_fragment:rM,emissivemap_pars_fragment:sM,colorspace_fragment:aM,colorspace_pars_fragment:oM,envmap_fragment:lM,envmap_common_pars_fragment:cM,envmap_pars_fragment:uM,envmap_pars_vertex:dM,envmap_physical_pars_fragment:MM,envmap_vertex:fM,fog_vertex:hM,fog_pars_vertex:pM,fog_fragment:mM,fog_pars_fragment:gM,gradientmap_pars_fragment:vM,lightmap_pars_fragment:_M,lights_lambert_fragment:xM,lights_lambert_pars_fragment:yM,lights_pars_begin:SM,lights_toon_fragment:EM,lights_toon_pars_fragment:wM,lights_phong_fragment:TM,lights_phong_pars_fragment:AM,lights_physical_fragment:bM,lights_physical_pars_fragment:CM,lights_fragment_begin:RM,lights_fragment_maps:NM,lights_fragment_end:PM,logdepthbuf_fragment:LM,logdepthbuf_pars_fragment:DM,logdepthbuf_pars_vertex:UM,logdepthbuf_vertex:IM,map_fragment:FM,map_pars_fragment:OM,map_particle_fragment:kM,map_particle_pars_fragment:zM,metalnessmap_fragment:BM,metalnessmap_pars_fragment:jM,morphinstance_vertex:HM,morphcolor_vertex:VM,morphnormal_vertex:GM,morphtarget_pars_vertex:WM,morphtarget_vertex:$M,normal_fragment_begin:XM,normal_fragment_maps:qM,normal_pars_fragment:YM,normal_pars_vertex:KM,normal_vertex:ZM,normalmap_pars_fragment:JM,clearcoat_normal_fragment_begin:QM,clearcoat_normal_fragment_maps:eE,clearcoat_pars_fragment:tE,iridescence_pars_fragment:nE,opaque_fragment:iE,packing:rE,premultiplied_alpha_fragment:sE,project_vertex:aE,dithering_fragment:oE,dithering_pars_fragment:lE,roughnessmap_fragment:cE,roughnessmap_pars_fragment:uE,shadowmap_pars_fragment:dE,shadowmap_pars_vertex:fE,shadowmap_vertex:hE,shadowmask_pars_fragment:pE,skinbase_vertex:mE,skinning_pars_vertex:gE,skinning_vertex:vE,skinnormal_vertex:_E,specularmap_fragment:xE,specularmap_pars_fragment:yE,tonemapping_fragment:SE,tonemapping_pars_fragment:ME,transmission_fragment:EE,transmission_pars_fragment:wE,uv_pars_fragment:TE,uv_pars_vertex:AE,uv_vertex:bE,worldpos_vertex:CE,background_vert:RE,background_frag:NE,backgroundCube_vert:PE,backgroundCube_frag:LE,cube_vert:DE,cube_frag:UE,depth_vert:IE,depth_frag:FE,distanceRGBA_vert:OE,distanceRGBA_frag:kE,equirect_vert:zE,equirect_frag:BE,linedashed_vert:jE,linedashed_frag:HE,meshbasic_vert:VE,meshbasic_frag:GE,meshlambert_vert:WE,meshlambert_frag:$E,meshmatcap_vert:XE,meshmatcap_frag:qE,meshnormal_vert:YE,meshnormal_frag:KE,meshphong_vert:ZE,meshphong_frag:JE,meshphysical_vert:QE,meshphysical_frag:ew,meshtoon_vert:tw,meshtoon_frag:nw,points_vert:iw,points_frag:rw,shadow_vert:sw,shadow_frag:aw,sprite_vert:ow,sprite_frag:lw},Pe={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ft}},envmap:{envMap:{value:null},envMapRotation:{value:new ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ft},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}}},mi={basic:{uniforms:xn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:xn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:xn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:xn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:xn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:xn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:xn([Pe.points,Pe.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:xn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:xn([Pe.common,Pe.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:xn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:xn([Pe.sprite,Pe.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ft}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:xn([Pe.common,Pe.displacementmap,{referencePosition:{value:new le},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:xn([Pe.lights,Pe.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};mi.physical={uniforms:xn([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ft},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ft},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ft},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ft},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ft},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ft}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const Ul={r:0,b:0,g:0},Gr=new Si,cw=new Bt;function uw(r,e,t,s,o,l,d){const u=new Et(0);let m=l===!0?0:1,p,g,_=null,y=0,M=null;function E(L){let N=L.isScene===!0?L.background:null;return N&&N.isTexture&&(N=(L.backgroundBlurriness>0?t:e).get(N)),N}function w(L){let N=!1;const U=E(L);U===null?x(u,m):U&&U.isColor&&(x(U,1),N=!0);const Y=r.xr.getEnvironmentBlendMode();Y==="additive"?s.buffers.color.setClear(0,0,0,1,d):Y==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,d),(r.autoClear||N)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil)}function S(L,N){const U=E(N);U&&(U.isCubeTexture||U.mapping===Jl)?(g===void 0&&(g=new xi(new ao(1,1,1),new Er({name:"BackgroundCubeMaterial",uniforms:ia(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(Y,I,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(g)),Gr.copy(N.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),g.material.uniforms.envMap.value=U,g.material.uniforms.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(cw.makeRotationFromEuler(Gr)),g.material.toneMapped=At.getTransfer(U.colorSpace)!==Lt,(_!==U||y!==U.version||M!==r.toneMapping)&&(g.material.needsUpdate=!0,_=U,y=U.version,M=r.toneMapping),g.layers.enableAll(),L.unshift(g,g.geometry,g.material,0,0,null)):U&&U.isTexture&&(p===void 0&&(p=new xi(new tc(2,2),new Er({name:"BackgroundMaterial",uniforms:ia(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(p)),p.material.uniforms.t2D.value=U,p.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,p.material.toneMapped=At.getTransfer(U.colorSpace)!==Lt,U.matrixAutoUpdate===!0&&U.updateMatrix(),p.material.uniforms.uvTransform.value.copy(U.matrix),(_!==U||y!==U.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,_=U,y=U.version,M=r.toneMapping),p.layers.enableAll(),L.unshift(p,p.geometry,p.material,0,0,null))}function x(L,N){L.getRGB(Ul,hv(r)),s.buffers.color.setClear(Ul.r,Ul.g,Ul.b,N,d)}return{getClearColor:function(){return u},setClearColor:function(L,N=1){u.set(L),m=N,x(u,m)},getClearAlpha:function(){return m},setClearAlpha:function(L){m=L,x(u,m)},render:w,addToRenderList:S}}function dw(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},o=y(null);let l=o,d=!1;function u(A,D,W,j,te){let oe=!1;const he=_(j,W,D);l!==he&&(l=he,p(l.object)),oe=M(A,j,W,te),oe&&E(A,j,W,te),te!==null&&e.update(te,r.ELEMENT_ARRAY_BUFFER),(oe||d)&&(d=!1,U(A,D,W,j),te!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function m(){return r.createVertexArray()}function p(A){return r.bindVertexArray(A)}function g(A){return r.deleteVertexArray(A)}function _(A,D,W){const j=W.wireframe===!0;let te=s[A.id];te===void 0&&(te={},s[A.id]=te);let oe=te[D.id];oe===void 0&&(oe={},te[D.id]=oe);let he=oe[j];return he===void 0&&(he=y(m()),oe[j]=he),he}function y(A){const D=[],W=[],j=[];for(let te=0;te<t;te++)D[te]=0,W[te]=0,j[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:W,attributeDivisors:j,object:A,attributes:{},index:null}}function M(A,D,W,j){const te=l.attributes,oe=D.attributes;let he=0;const de=W.getAttributes();for(const H in de)if(de[H].location>=0){const K=te[H];let O=oe[H];if(O===void 0&&(H==="instanceMatrix"&&A.instanceMatrix&&(O=A.instanceMatrix),H==="instanceColor"&&A.instanceColor&&(O=A.instanceColor)),K===void 0||K.attribute!==O||O&&K.data!==O.data)return!0;he++}return l.attributesNum!==he||l.index!==j}function E(A,D,W,j){const te={},oe=D.attributes;let he=0;const de=W.getAttributes();for(const H in de)if(de[H].location>=0){let K=oe[H];K===void 0&&(H==="instanceMatrix"&&A.instanceMatrix&&(K=A.instanceMatrix),H==="instanceColor"&&A.instanceColor&&(K=A.instanceColor));const O={};O.attribute=K,K&&K.data&&(O.data=K.data),te[H]=O,he++}l.attributes=te,l.attributesNum=he,l.index=j}function w(){const A=l.newAttributes;for(let D=0,W=A.length;D<W;D++)A[D]=0}function S(A){x(A,0)}function x(A,D){const W=l.newAttributes,j=l.enabledAttributes,te=l.attributeDivisors;W[A]=1,j[A]===0&&(r.enableVertexAttribArray(A),j[A]=1),te[A]!==D&&(r.vertexAttribDivisor(A,D),te[A]=D)}function L(){const A=l.newAttributes,D=l.enabledAttributes;for(let W=0,j=D.length;W<j;W++)D[W]!==A[W]&&(r.disableVertexAttribArray(W),D[W]=0)}function N(A,D,W,j,te,oe,he){he===!0?r.vertexAttribIPointer(A,D,W,te,oe):r.vertexAttribPointer(A,D,W,j,te,oe)}function U(A,D,W,j){w();const te=j.attributes,oe=W.getAttributes(),he=D.defaultAttributeValues;for(const de in oe){const H=oe[de];if(H.location>=0){let B=te[de];if(B===void 0&&(de==="instanceMatrix"&&A.instanceMatrix&&(B=A.instanceMatrix),de==="instanceColor"&&A.instanceColor&&(B=A.instanceColor)),B!==void 0){const K=B.normalized,O=B.itemSize,ie=e.get(B);if(ie===void 0)continue;const De=ie.buffer,Q=ie.type,pe=ie.bytesPerElement,Me=Q===r.INT||Q===r.UNSIGNED_INT||B.gpuType===Zg;if(B.isInterleavedBufferAttribute){const ve=B.data,Le=ve.stride,Fe=B.offset;if(ve.isInstancedInterleavedBuffer){for(let Z=0;Z<H.locationSize;Z++)x(H.location+Z,ve.meshPerAttribute);A.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let Z=0;Z<H.locationSize;Z++)S(H.location+Z);r.bindBuffer(r.ARRAY_BUFFER,De);for(let Z=0;Z<H.locationSize;Z++)N(H.location+Z,O/H.locationSize,Q,K,Le*pe,(Fe+O/H.locationSize*Z)*pe,Me)}else{if(B.isInstancedBufferAttribute){for(let ve=0;ve<H.locationSize;ve++)x(H.location+ve,B.meshPerAttribute);A.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let ve=0;ve<H.locationSize;ve++)S(H.location+ve);r.bindBuffer(r.ARRAY_BUFFER,De);for(let ve=0;ve<H.locationSize;ve++)N(H.location+ve,O/H.locationSize,Q,K,O*pe,O/H.locationSize*ve*pe,Me)}}else if(he!==void 0){const K=he[de];if(K!==void 0)switch(K.length){case 2:r.vertexAttrib2fv(H.location,K);break;case 3:r.vertexAttrib3fv(H.location,K);break;case 4:r.vertexAttrib4fv(H.location,K);break;default:r.vertexAttrib1fv(H.location,K)}}}}L()}function Y(){$();for(const A in s){const D=s[A];for(const W in D){const j=D[W];for(const te in j)g(j[te].object),delete j[te];delete D[W]}delete s[A]}}function I(A){if(s[A.id]===void 0)return;const D=s[A.id];for(const W in D){const j=D[W];for(const te in j)g(j[te].object),delete j[te];delete D[W]}delete s[A.id]}function k(A){for(const D in s){const W=s[D];if(W[A.id]===void 0)continue;const j=W[A.id];for(const te in j)g(j[te].object),delete j[te];delete W[A.id]}}function $(){R(),d=!0,l!==o&&(l=o,p(l.object))}function R(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:u,reset:$,resetDefaultState:R,dispose:Y,releaseStatesOfGeometry:I,releaseStatesOfProgram:k,initAttributes:w,enableAttribute:S,disableUnusedAttributes:L}}function fw(r,e,t){let s;function o(p){s=p}function l(p,g){r.drawArrays(s,p,g),t.update(g,s,1)}function d(p,g,_){_!==0&&(r.drawArraysInstanced(s,p,g,_),t.update(g,s,_))}function u(p,g,_){if(_===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let M=0;M<_;M++)this.render(p[M],g[M]);else{y.multiDrawArraysWEBGL(s,p,0,g,0,_);let M=0;for(let E=0;E<_;E++)M+=g[E];t.update(M,s,1)}}function m(p,g,_,y){if(_===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let E=0;E<p.length;E++)d(p[E],g[E],y[E]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,g,0,y,0,_);let E=0;for(let w=0;w<_;w++)E+=g[w];for(let w=0;w<y.length;w++)t.update(E,s,y[w])}}this.setMode=o,this.render=l,this.renderInstances=d,this.renderMultiDraw=u,this.renderMultiDrawInstances=m}function hw(r,e,t,s){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");o=r.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function d(I){return!(I!==_i&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function u(I){const k=I===Ql&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Mr&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==_r&&!k)}function m(I){if(I==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=t.precision!==void 0?t.precision:"highp";const g=m(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const _=t.logarithmicDepthBuffer===!0,y=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_TEXTURE_SIZE),w=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),S=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),L=r.getParameter(r.MAX_VARYING_VECTORS),N=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),U=M>0,Y=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:m,textureFormatReadable:d,textureTypeReadable:u,precision:p,logarithmicDepthBuffer:_,maxTextures:y,maxVertexTextures:M,maxTextureSize:E,maxCubemapSize:w,maxAttributes:S,maxVertexUniforms:x,maxVaryings:L,maxFragmentUniforms:N,vertexTextures:U,maxSamples:Y}}function pw(r){const e=this;let t=null,s=0,o=!1,l=!1;const d=new $r,u=new ft,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(_,y){const M=_.length!==0||y||s!==0||o;return o=y,s=_.length,M},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(_,y){t=g(_,y,0)},this.setState=function(_,y,M){const E=_.clippingPlanes,w=_.clipIntersection,S=_.clipShadows,x=r.get(_);if(!o||E===null||E.length===0||l&&!S)l?g(null):p();else{const L=l?0:s,N=L*4;let U=x.clippingState||null;m.value=U,U=g(E,y,N,M);for(let Y=0;Y!==N;++Y)U[Y]=t[Y];x.clippingState=U,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=L}};function p(){m.value!==t&&(m.value=t,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(_,y,M,E){const w=_!==null?_.length:0;let S=null;if(w!==0){if(S=m.value,E!==!0||S===null){const x=M+w*4,L=y.matrixWorldInverse;u.getNormalMatrix(L),(S===null||S.length<x)&&(S=new Float32Array(x));for(let N=0,U=M;N!==w;++N,U+=4)d.copy(_[N]).applyMatrix4(L,u),d.normal.toArray(S,U),S[U+3]=d.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function mw(r){let e=new WeakMap;function t(d,u){return u===Pd?d.mapping=ea:u===Ld&&(d.mapping=ta),d}function s(d){if(d&&d.isTexture){const u=d.mapping;if(u===Pd||u===Ld)if(e.has(d)){const m=e.get(d).texture;return t(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const p=new AS(m.height);return p.fromEquirectangularTexture(r,d),e.set(d,p),d.addEventListener("dispose",o),t(p.texture,d.mapping)}else return null}}return d}function o(d){const u=d.target;u.removeEventListener("dispose",o);const m=e.get(u);m!==void 0&&(e.delete(u),m.dispose())}function l(){e=new WeakMap}return{get:s,dispose:l}}class vv extends pv{constructor(e=-1,t=1,s=1,o=-1,l=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=s,this.bottom=o,this.near=l,this.far=d,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,s,o,l,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=s-e,d=s+e,u=o+t,m=o-t;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,d=l+p*this.view.width,u-=g*this.view.offsetY,m=u-g*this.view.height}this.projectionMatrix.makeOrthographic(l,d,u,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const qs=4,Jm=[.125,.215,.35,.446,.526,.582],Yr=20,gd=new vv,Qm=new Et;let vd=null,_d=0,xd=0,yd=!1;const Xr=(1+Math.sqrt(5))/2,Ws=1/Xr,eg=[new le(-Xr,Ws,0),new le(Xr,Ws,0),new le(-Ws,0,Xr),new le(Ws,0,Xr),new le(0,Xr,-Ws),new le(0,Xr,Ws),new le(-1,1,-1),new le(1,1,-1),new le(-1,1,1),new le(1,1,1)];class tg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,s=.1,o=100){vd=this._renderer.getRenderTarget(),_d=this._renderer.getActiveCubeFace(),xd=this._renderer.getActiveMipmapLevel(),yd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,s,o,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ig(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(vd,_d,xd),this._renderer.xr.enabled=yd,e.scissorTest=!1,Il(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ea||e.mapping===ta?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vd=this._renderer.getRenderTarget(),_d=this._renderer.getActiveCubeFace(),xd=this._renderer.getActiveMipmapLevel(),yd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=t||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,s={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Ql,format:_i,colorSpace:Tr,depthBuffer:!1},o=ng(e,t,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ng(e,t,s);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=gw(l)),this._blurMaterial=vw(l,e,t)}return o}_compileMaterial(e){const t=new xi(this._lodPlanes[0],e);this._renderer.compile(t,gd)}_sceneToCubeUV(e,t,s,o){const u=new qn(90,1,t,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,_=g.autoClear,y=g.toneMapping;g.getClearColor(Qm),g.toneMapping=yr,g.autoClear=!1;const M=new uv({name:"PMREM.Background",side:Nn,depthWrite:!1,depthTest:!1}),E=new xi(new ao,M);let w=!1;const S=e.background;S?S.isColor&&(M.color.copy(S),e.background=null,w=!0):(M.color.copy(Qm),w=!0);for(let x=0;x<6;x++){const L=x%3;L===0?(u.up.set(0,m[x],0),u.lookAt(p[x],0,0)):L===1?(u.up.set(0,0,m[x]),u.lookAt(0,p[x],0)):(u.up.set(0,m[x],0),u.lookAt(0,0,p[x]));const N=this._cubeSize;Il(o,L*N,x>2?N:0,N,N),g.setRenderTarget(o),w&&g.render(E,u),g.render(e,u)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=y,g.autoClear=_,e.background=S}_textureToCubeUV(e,t){const s=this._renderer,o=e.mapping===ea||e.mapping===ta;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=rg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ig());const l=o?this._cubemapMaterial:this._equirectMaterial,d=new xi(this._lodPlanes[0],l),u=l.uniforms;u.envMap.value=e;const m=this._cubeSize;Il(t,0,0,3*m,2*m),s.setRenderTarget(t),s.render(d,gd)}_applyPMREM(e){const t=this._renderer,s=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let l=1;l<o;l++){const d=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),u=eg[(o-l-1)%eg.length];this._blur(e,l-1,l,d,u)}t.autoClear=s}_blur(e,t,s,o,l){const d=this._pingPongRenderTarget;this._halfBlur(e,d,t,s,o,"latitudinal",l),this._halfBlur(d,e,s,s,o,"longitudinal",l)}_halfBlur(e,t,s,o,l,d,u){const m=this._renderer,p=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,_=new xi(this._lodPlanes[o],p),y=p.uniforms,M=this._sizeLods[s]-1,E=isFinite(l)?Math.PI/(2*M):2*Math.PI/(2*Yr-1),w=l/E,S=isFinite(l)?1+Math.floor(g*w):Yr;S>Yr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Yr}`);const x=[];let L=0;for(let k=0;k<Yr;++k){const $=k/w,R=Math.exp(-$*$/2);x.push(R),k===0?L+=R:k<S&&(L+=2*R)}for(let k=0;k<x.length;k++)x[k]=x[k]/L;y.envMap.value=e.texture,y.samples.value=S,y.weights.value=x,y.latitudinal.value=d==="latitudinal",u&&(y.poleAxis.value=u);const{_lodMax:N}=this;y.dTheta.value=E,y.mipInt.value=N-s;const U=this._sizeLods[o],Y=3*U*(o>N-qs?o-N+qs:0),I=4*(this._cubeSize-U);Il(t,Y,I,3*U,2*U),m.setRenderTarget(t),m.render(_,gd)}}function gw(r){const e=[],t=[],s=[];let o=r;const l=r-qs+1+Jm.length;for(let d=0;d<l;d++){const u=Math.pow(2,o);t.push(u);let m=1/u;d>r-qs?m=Jm[d-r+qs-1]:d===0&&(m=0),s.push(m);const p=1/(u-2),g=-p,_=1+p,y=[g,g,_,g,_,_,g,g,_,_,g,_],M=6,E=6,w=3,S=2,x=1,L=new Float32Array(w*E*M),N=new Float32Array(S*E*M),U=new Float32Array(x*E*M);for(let I=0;I<M;I++){const k=I%3*2/3-1,$=I>2?0:-1,R=[k,$,0,k+2/3,$,0,k+2/3,$+1,0,k,$,0,k+2/3,$+1,0,k,$+1,0];L.set(R,w*E*I),N.set(y,S*E*I);const A=[I,I,I,I,I,I];U.set(A,x*E*I)}const Y=new Hi;Y.setAttribute("position",new Bn(L,w)),Y.setAttribute("uv",new Bn(N,S)),Y.setAttribute("faceIndex",new Bn(U,x)),e.push(Y),o>qs&&o--}return{lodPlanes:e,sizeLods:t,sigmas:s}}function ng(r,e,t){const s=new ns(r,e,t);return s.texture.mapping=Jl,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Il(r,e,t,s,o){r.viewport.set(e,t,s,o),r.scissor.set(e,t,s,o)}function vw(r,e,t){const s=new Float32Array(Yr),o=new le(0,1,0);return new Er({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function ig(){return new Er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function rg(){return new Er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jd(),fragmentShader:`

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
	`}function _w(r){let e=new WeakMap,t=null;function s(u){if(u&&u.isTexture){const m=u.mapping,p=m===Pd||m===Ld,g=m===ea||m===ta;if(p||g){let _=e.get(u);const y=_!==void 0?_.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==y)return t===null&&(t=new tg(r)),_=p?t.fromEquirectangular(u,_):t.fromCubemap(u,_),_.texture.pmremVersion=u.pmremVersion,e.set(u,_),_.texture;if(_!==void 0)return _.texture;{const M=u.image;return p&&M&&M.height>0||g&&M&&o(M)?(t===null&&(t=new tg(r)),_=p?t.fromEquirectangular(u):t.fromCubemap(u),_.texture.pmremVersion=u.pmremVersion,e.set(u,_),u.addEventListener("dispose",l),_.texture):null}}}return u}function o(u){let m=0;const p=6;for(let g=0;g<p;g++)u[g]!==void 0&&m++;return m===p}function l(u){const m=u.target;m.removeEventListener("dispose",l);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function d(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:s,dispose:d}}function xw(r){const e={};function t(s){if(e[s]!==void 0)return e[s];let o;switch(s){case"WEBGL_depth_texture":o=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=r.getExtension(s)}return e[s]=o,o}return{has:function(s){return t(s)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(s){const o=t(s);return o===null&&console.warn("THREE.WebGLRenderer: "+s+" extension not supported."),o}}}function yw(r,e,t,s){const o={},l=new WeakMap;function d(_){const y=_.target;y.index!==null&&e.remove(y.index);for(const E in y.attributes)e.remove(y.attributes[E]);for(const E in y.morphAttributes){const w=y.morphAttributes[E];for(let S=0,x=w.length;S<x;S++)e.remove(w[S])}y.removeEventListener("dispose",d),delete o[y.id];const M=l.get(y);M&&(e.remove(M),l.delete(y)),s.releaseStatesOfGeometry(y),y.isInstancedBufferGeometry===!0&&delete y._maxInstanceCount,t.memory.geometries--}function u(_,y){return o[y.id]===!0||(y.addEventListener("dispose",d),o[y.id]=!0,t.memory.geometries++),y}function m(_){const y=_.attributes;for(const E in y)e.update(y[E],r.ARRAY_BUFFER);const M=_.morphAttributes;for(const E in M){const w=M[E];for(let S=0,x=w.length;S<x;S++)e.update(w[S],r.ARRAY_BUFFER)}}function p(_){const y=[],M=_.index,E=_.attributes.position;let w=0;if(M!==null){const L=M.array;w=M.version;for(let N=0,U=L.length;N<U;N+=3){const Y=L[N+0],I=L[N+1],k=L[N+2];y.push(Y,I,I,k,k,Y)}}else if(E!==void 0){const L=E.array;w=E.version;for(let N=0,U=L.length/3-1;N<U;N+=3){const Y=N+0,I=N+1,k=N+2;y.push(Y,I,I,k,k,Y)}}else return;const S=new(sv(y)?fv:dv)(y,1);S.version=w;const x=l.get(_);x&&e.remove(x),l.set(_,S)}function g(_){const y=l.get(_);if(y){const M=_.index;M!==null&&y.version<M.version&&p(_)}else p(_);return l.get(_)}return{get:u,update:m,getWireframeAttribute:g}}function Sw(r,e,t){let s;function o(y){s=y}let l,d;function u(y){l=y.type,d=y.bytesPerElement}function m(y,M){r.drawElements(s,M,l,y*d),t.update(M,s,1)}function p(y,M,E){E!==0&&(r.drawElementsInstanced(s,M,l,y*d,E),t.update(M,s,E))}function g(y,M,E){if(E===0)return;const w=e.get("WEBGL_multi_draw");if(w===null)for(let S=0;S<E;S++)this.render(y[S]/d,M[S]);else{w.multiDrawElementsWEBGL(s,M,0,l,y,0,E);let S=0;for(let x=0;x<E;x++)S+=M[x];t.update(S,s,1)}}function _(y,M,E,w){if(E===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let x=0;x<y.length;x++)p(y[x]/d,M[x],w[x]);else{S.multiDrawElementsInstancedWEBGL(s,M,0,l,y,0,w,0,E);let x=0;for(let L=0;L<E;L++)x+=M[L];for(let L=0;L<w.length;L++)t.update(x,s,w[L])}}this.setMode=o,this.setIndex=u,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=_}function Mw(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function s(l,d,u){switch(t.calls++,d){case r.TRIANGLES:t.triangles+=u*(l/3);break;case r.LINES:t.lines+=u*(l/2);break;case r.LINE_STRIP:t.lines+=u*(l-1);break;case r.LINE_LOOP:t.lines+=u*l;break;case r.POINTS:t.points+=u*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:s}}function Ew(r,e,t){const s=new WeakMap,o=new rn;function l(d,u,m){const p=d.morphTargetInfluences,g=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,_=g!==void 0?g.length:0;let y=s.get(u);if(y===void 0||y.count!==_){let A=function(){$.dispose(),s.delete(u),u.removeEventListener("dispose",A)};var M=A;y!==void 0&&y.texture.dispose();const E=u.morphAttributes.position!==void 0,w=u.morphAttributes.normal!==void 0,S=u.morphAttributes.color!==void 0,x=u.morphAttributes.position||[],L=u.morphAttributes.normal||[],N=u.morphAttributes.color||[];let U=0;E===!0&&(U=1),w===!0&&(U=2),S===!0&&(U=3);let Y=u.attributes.position.count*U,I=1;Y>e.maxTextureSize&&(I=Math.ceil(Y/e.maxTextureSize),Y=e.maxTextureSize);const k=new Float32Array(Y*I*4*_),$=new ov(k,Y,I,_);$.type=_r,$.needsUpdate=!0;const R=U*4;for(let D=0;D<_;D++){const W=x[D],j=L[D],te=N[D],oe=Y*I*4*D;for(let he=0;he<W.count;he++){const de=he*R;E===!0&&(o.fromBufferAttribute(W,he),k[oe+de+0]=o.x,k[oe+de+1]=o.y,k[oe+de+2]=o.z,k[oe+de+3]=0),w===!0&&(o.fromBufferAttribute(j,he),k[oe+de+4]=o.x,k[oe+de+5]=o.y,k[oe+de+6]=o.z,k[oe+de+7]=0),S===!0&&(o.fromBufferAttribute(te,he),k[oe+de+8]=o.x,k[oe+de+9]=o.y,k[oe+de+10]=o.z,k[oe+de+11]=te.itemSize===4?o.w:1)}}y={count:_,texture:$,size:new xt(Y,I)},s.set(u,y),u.addEventListener("dispose",A)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",d.morphTexture,t);else{let E=0;for(let S=0;S<p.length;S++)E+=p[S];const w=u.morphTargetsRelative?1:1-E;m.getUniforms().setValue(r,"morphTargetBaseInfluence",w),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",y.texture,t),m.getUniforms().setValue(r,"morphTargetsTextureSize",y.size)}return{update:l}}function ww(r,e,t,s){let o=new WeakMap;function l(m){const p=s.render.frame,g=m.geometry,_=e.get(m,g);if(o.get(_)!==p&&(e.update(_),o.set(_,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",u)===!1&&m.addEventListener("dispose",u),o.get(m)!==p&&(t.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&t.update(m.instanceColor,r.ARRAY_BUFFER),o.set(m,p))),m.isSkinnedMesh){const y=m.skeleton;o.get(y)!==p&&(y.update(),o.set(y,p))}return _}function d(){o=new WeakMap}function u(m){const p=m.target;p.removeEventListener("dispose",u),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:l,dispose:d}}class _v extends Pn{constructor(e,t,s,o,l,d,u,m,p,g){if(g=g!==void 0?g:Ks,g!==Ks&&g!==eo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Ks&&(s=na),s===void 0&&g===eo&&(s=no),super(null,o,l,d,u,m,g,s,p),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=u!==void 0?u:Kn,this.minFilter=m!==void 0?m:Kn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const xv=new Pn,yv=new _v(1,1);yv.compareFunction=rv;const Sv=new ov,Mv=new cS,Ev=new mv,sg=[],ag=[],og=new Float32Array(16),lg=new Float32Array(9),cg=new Float32Array(4);function oa(r,e,t){const s=r[0];if(s<=0||s>0)return r;const o=e*t;let l=sg[o];if(l===void 0&&(l=new Float32Array(o),sg[o]=l),e!==0){s.toArray(l,0);for(let d=1,u=0;d!==e;++d)u+=t,r[d].toArray(l,u)}return l}function Yt(r,e){if(r.length!==e.length)return!1;for(let t=0,s=r.length;t<s;t++)if(r[t]!==e[t])return!1;return!0}function Kt(r,e){for(let t=0,s=e.length;t<s;t++)r[t]=e[t]}function nc(r,e){let t=ag[e];t===void 0&&(t=new Int32Array(e),ag[e]=t);for(let s=0;s!==e;++s)t[s]=r.allocateTextureUnit();return t}function Tw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Aw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2fv(this.addr,e),Kt(t,e)}}function bw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;r.uniform3fv(this.addr,e),Kt(t,e)}}function Cw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4fv(this.addr,e),Kt(t,e)}}function Rw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;cg.set(s),r.uniformMatrix2fv(this.addr,!1,cg),Kt(t,s)}}function Nw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;lg.set(s),r.uniformMatrix3fv(this.addr,!1,lg),Kt(t,s)}}function Pw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;og.set(s),r.uniformMatrix4fv(this.addr,!1,og),Kt(t,s)}}function Lw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Dw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2iv(this.addr,e),Kt(t,e)}}function Uw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3iv(this.addr,e),Kt(t,e)}}function Iw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4iv(this.addr,e),Kt(t,e)}}function Fw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Ow(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2uiv(this.addr,e),Kt(t,e)}}function kw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3uiv(this.addr,e),Kt(t,e)}}function zw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4uiv(this.addr,e),Kt(t,e)}}function Bw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o);const l=this.type===r.SAMPLER_2D_SHADOW?yv:xv;t.setTexture2D(e||l,o)}function jw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture3D(e||Mv,o)}function Hw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTextureCube(e||Ev,o)}function Vw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture2DArray(e||Sv,o)}function Gw(r){switch(r){case 5126:return Tw;case 35664:return Aw;case 35665:return bw;case 35666:return Cw;case 35674:return Rw;case 35675:return Nw;case 35676:return Pw;case 5124:case 35670:return Lw;case 35667:case 35671:return Dw;case 35668:case 35672:return Uw;case 35669:case 35673:return Iw;case 5125:return Fw;case 36294:return Ow;case 36295:return kw;case 36296:return zw;case 35678:case 36198:case 36298:case 36306:case 35682:return Bw;case 35679:case 36299:case 36307:return jw;case 35680:case 36300:case 36308:case 36293:return Hw;case 36289:case 36303:case 36311:case 36292:return Vw}}function Ww(r,e){r.uniform1fv(this.addr,e)}function $w(r,e){const t=oa(e,this.size,2);r.uniform2fv(this.addr,t)}function Xw(r,e){const t=oa(e,this.size,3);r.uniform3fv(this.addr,t)}function qw(r,e){const t=oa(e,this.size,4);r.uniform4fv(this.addr,t)}function Yw(r,e){const t=oa(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Kw(r,e){const t=oa(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Zw(r,e){const t=oa(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Jw(r,e){r.uniform1iv(this.addr,e)}function Qw(r,e){r.uniform2iv(this.addr,e)}function eT(r,e){r.uniform3iv(this.addr,e)}function tT(r,e){r.uniform4iv(this.addr,e)}function nT(r,e){r.uniform1uiv(this.addr,e)}function iT(r,e){r.uniform2uiv(this.addr,e)}function rT(r,e){r.uniform3uiv(this.addr,e)}function sT(r,e){r.uniform4uiv(this.addr,e)}function aT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let d=0;d!==o;++d)t.setTexture2D(e[d]||xv,l[d])}function oT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let d=0;d!==o;++d)t.setTexture3D(e[d]||Mv,l[d])}function lT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let d=0;d!==o;++d)t.setTextureCube(e[d]||Ev,l[d])}function cT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let d=0;d!==o;++d)t.setTexture2DArray(e[d]||Sv,l[d])}function uT(r){switch(r){case 5126:return Ww;case 35664:return $w;case 35665:return Xw;case 35666:return qw;case 35674:return Yw;case 35675:return Kw;case 35676:return Zw;case 5124:case 35670:return Jw;case 35667:case 35671:return Qw;case 35668:case 35672:return eT;case 35669:case 35673:return tT;case 5125:return nT;case 36294:return iT;case 36295:return rT;case 36296:return sT;case 35678:case 36198:case 36298:case 36306:case 35682:return aT;case 35679:case 36299:case 36307:return oT;case 35680:case 36300:case 36308:case 36293:return lT;case 36289:case 36303:case 36311:case 36292:return cT}}class dT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.setValue=Gw(t.type)}}class fT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uT(t.type)}}class hT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,s){const o=this.seq;for(let l=0,d=o.length;l!==d;++l){const u=o[l];u.setValue(e,t[u.id],s)}}}const Sd=/(\w+)(\])?(\[|\.)?/g;function ug(r,e){r.seq.push(e),r.map[e.id]=e}function pT(r,e,t){const s=r.name,o=s.length;for(Sd.lastIndex=0;;){const l=Sd.exec(s),d=Sd.lastIndex;let u=l[1];const m=l[2]==="]",p=l[3];if(m&&(u=u|0),p===void 0||p==="["&&d+2===o){ug(t,p===void 0?new dT(u,r,e):new fT(u,r,e));break}else{let _=t.map[u];_===void 0&&(_=new hT(u),ug(t,_)),t=_}}}class Ol{constructor(e,t){this.seq=[],this.map={};const s=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<s;++o){const l=e.getActiveUniform(t,o),d=e.getUniformLocation(t,l.name);pT(l,d,this)}}setValue(e,t,s,o){const l=this.map[t];l!==void 0&&l.setValue(e,s,o)}setOptional(e,t,s){const o=t[s];o!==void 0&&this.setValue(e,s,o)}static upload(e,t,s,o){for(let l=0,d=t.length;l!==d;++l){const u=t[l],m=s[u.id];m.needsUpdate!==!1&&u.setValue(e,m.value,o)}}static seqWithValue(e,t){const s=[];for(let o=0,l=e.length;o!==l;++o){const d=e[o];d.id in t&&s.push(d)}return s}}function dg(r,e,t){const s=r.createShader(e);return r.shaderSource(s,t),r.compileShader(s),s}const mT=37297;let gT=0;function vT(r,e){const t=r.split(`
`),s=[],o=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let d=o;d<l;d++){const u=d+1;s.push(`${u===e?">":" "} ${u}: ${t[d]}`)}return s.join(`
`)}function _T(r){const e=At.getPrimaries(At.workingColorSpace),t=At.getPrimaries(r);let s;switch(e===t?s="":e===$l&&t===Wl?s="LinearDisplayP3ToLinearSRGB":e===Wl&&t===$l&&(s="LinearSRGBToLinearDisplayP3"),r){case Tr:case ec:return[s,"LinearTransferOETF"];case pi:case Yd:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[s,"LinearTransferOETF"]}}function fg(r,e,t){const s=r.getShaderParameter(e,r.COMPILE_STATUS),o=r.getShaderInfoLog(e).trim();if(s&&o==="")return"";const l=/ERROR: 0:(\d+)/.exec(o);if(l){const d=parseInt(l[1]);return t.toUpperCase()+`

`+o+`

`+vT(r.getShaderSource(e),d)}else return o}function xT(r,e){const t=_T(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function yT(r,e){let t;switch(e){case by:t="Linear";break;case Cy:t="Reinhard";break;case Ry:t="OptimizedCineon";break;case Ny:t="ACESFilmic";break;case Ly:t="AgX";break;case Dy:t="Neutral";break;case Py:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function ST(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ka).join(`
`)}function MT(r){const e=[];for(const t in r){const s=r[t];s!==!1&&e.push("#define "+t+" "+s)}return e.join(`
`)}function ET(r,e){const t={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let o=0;o<s;o++){const l=r.getActiveAttrib(e,o),d=l.name;let u=1;l.type===r.FLOAT_MAT2&&(u=2),l.type===r.FLOAT_MAT3&&(u=3),l.type===r.FLOAT_MAT4&&(u=4),t[d]={type:l.type,location:r.getAttribLocation(e,d),locationSize:u}}return t}function Ka(r){return r!==""}function hg(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pg(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fd(r){return r.replace(wT,AT)}const TT=new Map;function AT(r,e){let t=dt[e];if(t===void 0){const s=TT.get(e);if(s!==void 0)t=dt[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Fd(t)}const bT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mg(r){return r.replace(bT,CT)}function CT(r,e,t,s){let o="";for(let l=parseInt(e);l<parseInt(t);l++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function gg(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function RT(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Xg?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Q0?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function NT(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case ea:case ta:e="ENVMAP_TYPE_CUBE";break;case Jl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function PT(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case ta:e="ENVMAP_MODE_REFRACTION";break}return e}function LT(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case qg:e="ENVMAP_BLENDING_MULTIPLY";break;case Ty:e="ENVMAP_BLENDING_MIX";break;case Ay:e="ENVMAP_BLENDING_ADD";break}return e}function DT(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:s,maxMip:t}}function UT(r,e,t,s){const o=r.getContext(),l=t.defines;let d=t.vertexShader,u=t.fragmentShader;const m=RT(t),p=NT(t),g=PT(t),_=LT(t),y=DT(t),M=ST(t),E=MT(l),w=o.createProgram();let S,x,L=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Ka).join(`
`),S.length>0&&(S+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Ka).join(`
`),x.length>0&&(x+=`
`)):(S=[gg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+g:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ka).join(`
`),x=[gg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",t.envMap?"#define "+_:"",y?"#define CUBEUV_TEXEL_WIDTH "+y.texelWidth:"",y?"#define CUBEUV_TEXEL_HEIGHT "+y.texelHeight:"",y?"#define CUBEUV_MAX_MIP "+y.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yr?"#define TONE_MAPPING":"",t.toneMapping!==yr?dt.tonemapping_pars_fragment:"",t.toneMapping!==yr?yT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,xT("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ka).join(`
`)),d=Fd(d),d=hg(d,t),d=pg(d,t),u=Fd(u),u=hg(u,t),u=pg(u,t),d=mg(d),u=mg(u),t.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,x=["#define varying in",t.glslVersion===Lm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const N=L+S+d,U=L+x+u,Y=dg(o,o.VERTEX_SHADER,N),I=dg(o,o.FRAGMENT_SHADER,U);o.attachShader(w,Y),o.attachShader(w,I),t.index0AttributeName!==void 0?o.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function k(D){if(r.debug.checkShaderErrors){const W=o.getProgramInfoLog(w).trim(),j=o.getShaderInfoLog(Y).trim(),te=o.getShaderInfoLog(I).trim();let oe=!0,he=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(oe=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(o,w,Y,I);else{const de=fg(o,Y,"vertex"),H=fg(o,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+W+`
`+de+`
`+H)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(j===""||te==="")&&(he=!1);he&&(D.diagnostics={runnable:oe,programLog:W,vertexShader:{log:j,prefix:S},fragmentShader:{log:te,prefix:x}})}o.deleteShader(Y),o.deleteShader(I),$=new Ol(o,w),R=ET(o,w)}let $;this.getUniforms=function(){return $===void 0&&k(this),$};let R;this.getAttributes=function(){return R===void 0&&k(this),R};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=o.getProgramParameter(w,mT)),A},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gT++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=Y,this.fragmentShader=I,this}let IT=0;class FT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,s=e.fragmentShader,o=this._getShaderStage(t),l=this._getShaderStage(s),d=this._getShaderCacheForMaterial(e);return d.has(o)===!1&&(d.add(o),o.usedTimes++),d.has(l)===!1&&(d.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const s of t)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let s=t.get(e);return s===void 0&&(s=new Set,t.set(e,s)),s}_getShaderStage(e){const t=this.shaderCache;let s=t.get(e);return s===void 0&&(s=new OT(e),t.set(e,s)),s}}class OT{constructor(e){this.id=IT++,this.code=e,this.usedTimes=0}}function kT(r,e,t,s,o,l,d){const u=new lv,m=new FT,p=new Set,g=[],_=o.logarithmicDepthBuffer,y=o.vertexTextures;let M=o.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(R){return p.add(R),R===0?"uv":`uv${R}`}function S(R,A,D,W,j){const te=W.fog,oe=j.geometry,he=R.isMeshStandardMaterial?W.environment:null,de=(R.isMeshStandardMaterial?t:e).get(R.envMap||he),H=de&&de.mapping===Jl?de.image.height:null,B=E[R.type];R.precision!==null&&(M=o.getMaxPrecision(R.precision),M!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",M,"instead."));const K=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,O=K!==void 0?K.length:0;let ie=0;oe.morphAttributes.position!==void 0&&(ie=1),oe.morphAttributes.normal!==void 0&&(ie=2),oe.morphAttributes.color!==void 0&&(ie=3);let De,Q,pe,Me;if(B){const St=mi[B];De=St.vertexShader,Q=St.fragmentShader}else De=R.vertexShader,Q=R.fragmentShader,m.update(R),pe=m.getVertexShaderID(R),Me=m.getFragmentShaderID(R);const ve=r.getRenderTarget(),Le=j.isInstancedMesh===!0,Fe=j.isBatchedMesh===!0,Z=!!R.map,gt=!!R.matcap,Ae=!!de,nt=!!R.aoMap,Xe=!!R.lightMap,lt=!!R.bumpMap,it=!!R.normalMap,ot=!!R.displacementMap,Tt=!!R.emissiveMap,z=!!R.metalnessMap,C=!!R.roughnessMap,ce=R.anisotropy>0,ge=R.clearcoat>0,Se=R.dispersion>0,Ee=R.iridescence>0,We=R.sheen>0,Re=R.transmission>0,Ce=ce&&!!R.anisotropyMap,tt=ge&&!!R.clearcoatMap,be=ge&&!!R.clearcoatNormalMap,He=ge&&!!R.clearcoatRoughnessMap,ct=Ee&&!!R.iridescenceMap,qe=Ee&&!!R.iridescenceThicknessMap,Ie=We&&!!R.sheenColorMap,st=We&&!!R.sheenRoughnessMap,ht=!!R.specularMap,bt=!!R.specularColorMap,rt=!!R.specularIntensityMap,b=Re&&!!R.transmissionMap,V=Re&&!!R.thicknessMap,q=!!R.gradientMap,fe=!!R.alphaMap,_e=R.alphaTest>0,Ye=!!R.alphaHash,$e=!!R.extensions;let pt=yr;R.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(pt=r.toneMapping);const Vt={shaderID:B,shaderType:R.type,shaderName:R.name,vertexShader:De,fragmentShader:Q,defines:R.defines,customVertexShaderID:pe,customFragmentShaderID:Me,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:M,batching:Fe,instancing:Le,instancingColor:Le&&j.instanceColor!==null,instancingMorph:Le&&j.morphTexture!==null,supportsVertexTextures:y,outputColorSpace:ve===null?r.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:Tr,alphaToCoverage:!!R.alphaToCoverage,map:Z,matcap:gt,envMap:Ae,envMapMode:Ae&&de.mapping,envMapCubeUVHeight:H,aoMap:nt,lightMap:Xe,bumpMap:lt,normalMap:it,displacementMap:y&&ot,emissiveMap:Tt,normalMapObjectSpace:it&&R.normalMapType===Xy,normalMapTangentSpace:it&&R.normalMapType===iv,metalnessMap:z,roughnessMap:C,anisotropy:ce,anisotropyMap:Ce,clearcoat:ge,clearcoatMap:tt,clearcoatNormalMap:be,clearcoatRoughnessMap:He,dispersion:Se,iridescence:Ee,iridescenceMap:ct,iridescenceThicknessMap:qe,sheen:We,sheenColorMap:Ie,sheenRoughnessMap:st,specularMap:ht,specularColorMap:bt,specularIntensityMap:rt,transmission:Re,transmissionMap:b,thicknessMap:V,gradientMap:q,opaque:R.transparent===!1&&R.blending===Ys&&R.alphaToCoverage===!1,alphaMap:fe,alphaTest:_e,alphaHash:Ye,combine:R.combine,mapUv:Z&&w(R.map.channel),aoMapUv:nt&&w(R.aoMap.channel),lightMapUv:Xe&&w(R.lightMap.channel),bumpMapUv:lt&&w(R.bumpMap.channel),normalMapUv:it&&w(R.normalMap.channel),displacementMapUv:ot&&w(R.displacementMap.channel),emissiveMapUv:Tt&&w(R.emissiveMap.channel),metalnessMapUv:z&&w(R.metalnessMap.channel),roughnessMapUv:C&&w(R.roughnessMap.channel),anisotropyMapUv:Ce&&w(R.anisotropyMap.channel),clearcoatMapUv:tt&&w(R.clearcoatMap.channel),clearcoatNormalMapUv:be&&w(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:He&&w(R.clearcoatRoughnessMap.channel),iridescenceMapUv:ct&&w(R.iridescenceMap.channel),iridescenceThicknessMapUv:qe&&w(R.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&w(R.sheenColorMap.channel),sheenRoughnessMapUv:st&&w(R.sheenRoughnessMap.channel),specularMapUv:ht&&w(R.specularMap.channel),specularColorMapUv:bt&&w(R.specularColorMap.channel),specularIntensityMapUv:rt&&w(R.specularIntensityMap.channel),transmissionMapUv:b&&w(R.transmissionMap.channel),thicknessMapUv:V&&w(R.thicknessMap.channel),alphaMapUv:fe&&w(R.alphaMap.channel),vertexTangents:!!oe.attributes.tangent&&(it||ce),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,pointsUvs:j.isPoints===!0&&!!oe.attributes.uv&&(Z||fe),fog:!!te,useFog:R.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:_,skinning:j.isSkinnedMesh===!0,morphTargets:oe.morphAttributes.position!==void 0,morphNormals:oe.morphAttributes.normal!==void 0,morphColors:oe.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:ie,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:R.dithering,shadowMapEnabled:r.shadowMap.enabled&&D.length>0,shadowMapType:r.shadowMap.type,toneMapping:pt,useLegacyLights:r._useLegacyLights,decodeVideoTexture:Z&&R.map.isVideoTexture===!0&&At.getTransfer(R.map.colorSpace)===Lt,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===gi,flipSided:R.side===Nn,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:$e&&R.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:$e&&R.extensions.multiDraw===!0&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return Vt.vertexUv1s=p.has(1),Vt.vertexUv2s=p.has(2),Vt.vertexUv3s=p.has(3),p.clear(),Vt}function x(R){const A=[];if(R.shaderID?A.push(R.shaderID):(A.push(R.customVertexShaderID),A.push(R.customFragmentShaderID)),R.defines!==void 0)for(const D in R.defines)A.push(D),A.push(R.defines[D]);return R.isRawShaderMaterial===!1&&(L(A,R),N(A,R),A.push(r.outputColorSpace)),A.push(R.customProgramCacheKey),A.join()}function L(R,A){R.push(A.precision),R.push(A.outputColorSpace),R.push(A.envMapMode),R.push(A.envMapCubeUVHeight),R.push(A.mapUv),R.push(A.alphaMapUv),R.push(A.lightMapUv),R.push(A.aoMapUv),R.push(A.bumpMapUv),R.push(A.normalMapUv),R.push(A.displacementMapUv),R.push(A.emissiveMapUv),R.push(A.metalnessMapUv),R.push(A.roughnessMapUv),R.push(A.anisotropyMapUv),R.push(A.clearcoatMapUv),R.push(A.clearcoatNormalMapUv),R.push(A.clearcoatRoughnessMapUv),R.push(A.iridescenceMapUv),R.push(A.iridescenceThicknessMapUv),R.push(A.sheenColorMapUv),R.push(A.sheenRoughnessMapUv),R.push(A.specularMapUv),R.push(A.specularColorMapUv),R.push(A.specularIntensityMapUv),R.push(A.transmissionMapUv),R.push(A.thicknessMapUv),R.push(A.combine),R.push(A.fogExp2),R.push(A.sizeAttenuation),R.push(A.morphTargetsCount),R.push(A.morphAttributeCount),R.push(A.numDirLights),R.push(A.numPointLights),R.push(A.numSpotLights),R.push(A.numSpotLightMaps),R.push(A.numHemiLights),R.push(A.numRectAreaLights),R.push(A.numDirLightShadows),R.push(A.numPointLightShadows),R.push(A.numSpotLightShadows),R.push(A.numSpotLightShadowsWithMaps),R.push(A.numLightProbes),R.push(A.shadowMapType),R.push(A.toneMapping),R.push(A.numClippingPlanes),R.push(A.numClipIntersection),R.push(A.depthPacking)}function N(R,A){u.disableAll(),A.supportsVertexTextures&&u.enable(0),A.instancing&&u.enable(1),A.instancingColor&&u.enable(2),A.instancingMorph&&u.enable(3),A.matcap&&u.enable(4),A.envMap&&u.enable(5),A.normalMapObjectSpace&&u.enable(6),A.normalMapTangentSpace&&u.enable(7),A.clearcoat&&u.enable(8),A.iridescence&&u.enable(9),A.alphaTest&&u.enable(10),A.vertexColors&&u.enable(11),A.vertexAlphas&&u.enable(12),A.vertexUv1s&&u.enable(13),A.vertexUv2s&&u.enable(14),A.vertexUv3s&&u.enable(15),A.vertexTangents&&u.enable(16),A.anisotropy&&u.enable(17),A.alphaHash&&u.enable(18),A.batching&&u.enable(19),A.dispersion&&u.enable(20),R.push(u.mask),u.disableAll(),A.fog&&u.enable(0),A.useFog&&u.enable(1),A.flatShading&&u.enable(2),A.logarithmicDepthBuffer&&u.enable(3),A.skinning&&u.enable(4),A.morphTargets&&u.enable(5),A.morphNormals&&u.enable(6),A.morphColors&&u.enable(7),A.premultipliedAlpha&&u.enable(8),A.shadowMapEnabled&&u.enable(9),A.useLegacyLights&&u.enable(10),A.doubleSided&&u.enable(11),A.flipSided&&u.enable(12),A.useDepthPacking&&u.enable(13),A.dithering&&u.enable(14),A.transmission&&u.enable(15),A.sheen&&u.enable(16),A.opaque&&u.enable(17),A.pointsUvs&&u.enable(18),A.decodeVideoTexture&&u.enable(19),A.alphaToCoverage&&u.enable(20),R.push(u.mask)}function U(R){const A=E[R.type];let D;if(A){const W=mi[A];D=MS.clone(W.uniforms)}else D=R.uniforms;return D}function Y(R,A){let D;for(let W=0,j=g.length;W<j;W++){const te=g[W];if(te.cacheKey===A){D=te,++D.usedTimes;break}}return D===void 0&&(D=new UT(r,A,R,l),g.push(D)),D}function I(R){if(--R.usedTimes===0){const A=g.indexOf(R);g[A]=g[g.length-1],g.pop(),R.destroy()}}function k(R){m.remove(R)}function $(){m.dispose()}return{getParameters:S,getProgramCacheKey:x,getUniforms:U,acquireProgram:Y,releaseProgram:I,releaseShaderCache:k,programs:g,dispose:$}}function zT(){let r=new WeakMap;function e(l){let d=r.get(l);return d===void 0&&(d={},r.set(l,d)),d}function t(l){r.delete(l)}function s(l,d,u){r.get(l)[d]=u}function o(){r=new WeakMap}return{get:e,remove:t,update:s,dispose:o}}function BT(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function vg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function _g(){const r=[];let e=0;const t=[],s=[],o=[];function l(){e=0,t.length=0,s.length=0,o.length=0}function d(_,y,M,E,w,S){let x=r[e];return x===void 0?(x={id:_.id,object:_,geometry:y,material:M,groupOrder:E,renderOrder:_.renderOrder,z:w,group:S},r[e]=x):(x.id=_.id,x.object=_,x.geometry=y,x.material=M,x.groupOrder=E,x.renderOrder=_.renderOrder,x.z=w,x.group=S),e++,x}function u(_,y,M,E,w,S){const x=d(_,y,M,E,w,S);M.transmission>0?s.push(x):M.transparent===!0?o.push(x):t.push(x)}function m(_,y,M,E,w,S){const x=d(_,y,M,E,w,S);M.transmission>0?s.unshift(x):M.transparent===!0?o.unshift(x):t.unshift(x)}function p(_,y){t.length>1&&t.sort(_||BT),s.length>1&&s.sort(y||vg),o.length>1&&o.sort(y||vg)}function g(){for(let _=e,y=r.length;_<y;_++){const M=r[_];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:s,transparent:o,init:l,push:u,unshift:m,finish:g,sort:p}}function jT(){let r=new WeakMap;function e(s,o){const l=r.get(s);let d;return l===void 0?(d=new _g,r.set(s,[d])):o>=l.length?(d=new _g,l.push(d)):d=l[o],d}function t(){r=new WeakMap}return{get:e,dispose:t}}function HT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new le,color:new Et};break;case"SpotLight":t={position:new le,direction:new le,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new le,color:new Et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new le,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":t={color:new Et,position:new le,halfWidth:new le,halfHeight:new le};break}return r[e.id]=t,t}}}function VT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let GT=0;function WT(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function $T(r){const e=new HT,t=VT(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new le);const o=new le,l=new Bt,d=new Bt;function u(p,g){let _=0,y=0,M=0;for(let D=0;D<9;D++)s.probe[D].set(0,0,0);let E=0,w=0,S=0,x=0,L=0,N=0,U=0,Y=0,I=0,k=0,$=0;p.sort(WT);const R=g===!0?Math.PI:1;for(let D=0,W=p.length;D<W;D++){const j=p[D],te=j.color,oe=j.intensity,he=j.distance,de=j.shadow&&j.shadow.map?j.shadow.map.texture:null;if(j.isAmbientLight)_+=te.r*oe*R,y+=te.g*oe*R,M+=te.b*oe*R;else if(j.isLightProbe){for(let H=0;H<9;H++)s.probe[H].addScaledVector(j.sh.coefficients[H],oe);$++}else if(j.isDirectionalLight){const H=e.get(j);if(H.color.copy(j.color).multiplyScalar(j.intensity*R),j.castShadow){const B=j.shadow,K=t.get(j);K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,s.directionalShadow[E]=K,s.directionalShadowMap[E]=de,s.directionalShadowMatrix[E]=j.shadow.matrix,N++}s.directional[E]=H,E++}else if(j.isSpotLight){const H=e.get(j);H.position.setFromMatrixPosition(j.matrixWorld),H.color.copy(te).multiplyScalar(oe*R),H.distance=he,H.coneCos=Math.cos(j.angle),H.penumbraCos=Math.cos(j.angle*(1-j.penumbra)),H.decay=j.decay,s.spot[S]=H;const B=j.shadow;if(j.map&&(s.spotLightMap[I]=j.map,I++,B.updateMatrices(j),j.castShadow&&k++),s.spotLightMatrix[S]=B.matrix,j.castShadow){const K=t.get(j);K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,s.spotShadow[S]=K,s.spotShadowMap[S]=de,Y++}S++}else if(j.isRectAreaLight){const H=e.get(j);H.color.copy(te).multiplyScalar(oe),H.halfWidth.set(j.width*.5,0,0),H.halfHeight.set(0,j.height*.5,0),s.rectArea[x]=H,x++}else if(j.isPointLight){const H=e.get(j);if(H.color.copy(j.color).multiplyScalar(j.intensity*R),H.distance=j.distance,H.decay=j.decay,j.castShadow){const B=j.shadow,K=t.get(j);K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,K.shadowCameraNear=B.camera.near,K.shadowCameraFar=B.camera.far,s.pointShadow[w]=K,s.pointShadowMap[w]=de,s.pointShadowMatrix[w]=j.shadow.matrix,U++}s.point[w]=H,w++}else if(j.isHemisphereLight){const H=e.get(j);H.skyColor.copy(j.color).multiplyScalar(oe*R),H.groundColor.copy(j.groundColor).multiplyScalar(oe*R),s.hemi[L]=H,L++}}x>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Pe.LTC_FLOAT_1,s.rectAreaLTC2=Pe.LTC_FLOAT_2):(s.rectAreaLTC1=Pe.LTC_HALF_1,s.rectAreaLTC2=Pe.LTC_HALF_2)),s.ambient[0]=_,s.ambient[1]=y,s.ambient[2]=M;const A=s.hash;(A.directionalLength!==E||A.pointLength!==w||A.spotLength!==S||A.rectAreaLength!==x||A.hemiLength!==L||A.numDirectionalShadows!==N||A.numPointShadows!==U||A.numSpotShadows!==Y||A.numSpotMaps!==I||A.numLightProbes!==$)&&(s.directional.length=E,s.spot.length=S,s.rectArea.length=x,s.point.length=w,s.hemi.length=L,s.directionalShadow.length=N,s.directionalShadowMap.length=N,s.pointShadow.length=U,s.pointShadowMap.length=U,s.spotShadow.length=Y,s.spotShadowMap.length=Y,s.directionalShadowMatrix.length=N,s.pointShadowMatrix.length=U,s.spotLightMatrix.length=Y+I-k,s.spotLightMap.length=I,s.numSpotLightShadowsWithMaps=k,s.numLightProbes=$,A.directionalLength=E,A.pointLength=w,A.spotLength=S,A.rectAreaLength=x,A.hemiLength=L,A.numDirectionalShadows=N,A.numPointShadows=U,A.numSpotShadows=Y,A.numSpotMaps=I,A.numLightProbes=$,s.version=GT++)}function m(p,g){let _=0,y=0,M=0,E=0,w=0;const S=g.matrixWorldInverse;for(let x=0,L=p.length;x<L;x++){const N=p[x];if(N.isDirectionalLight){const U=s.directional[_];U.direction.setFromMatrixPosition(N.matrixWorld),o.setFromMatrixPosition(N.target.matrixWorld),U.direction.sub(o),U.direction.transformDirection(S),_++}else if(N.isSpotLight){const U=s.spot[M];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),U.direction.setFromMatrixPosition(N.matrixWorld),o.setFromMatrixPosition(N.target.matrixWorld),U.direction.sub(o),U.direction.transformDirection(S),M++}else if(N.isRectAreaLight){const U=s.rectArea[E];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),d.identity(),l.copy(N.matrixWorld),l.premultiply(S),d.extractRotation(l),U.halfWidth.set(N.width*.5,0,0),U.halfHeight.set(0,N.height*.5,0),U.halfWidth.applyMatrix4(d),U.halfHeight.applyMatrix4(d),E++}else if(N.isPointLight){const U=s.point[y];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),y++}else if(N.isHemisphereLight){const U=s.hemi[w];U.direction.setFromMatrixPosition(N.matrixWorld),U.direction.transformDirection(S),w++}}}return{setup:u,setupView:m,state:s}}function xg(r){const e=new $T(r),t=[],s=[];function o(g){p.camera=g,t.length=0,s.length=0}function l(g){t.push(g)}function d(g){s.push(g)}function u(g){e.setup(t,g)}function m(g){e.setupView(t,g)}const p={lightsArray:t,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:p,setupLights:u,setupLightsView:m,pushLight:l,pushShadow:d}}function XT(r){let e=new WeakMap;function t(o,l=0){const d=e.get(o);let u;return d===void 0?(u=new xg(r),e.set(o,[u])):l>=d.length?(u=new xg(r),d.push(u)):u=d[l],u}function s(){e=new WeakMap}return{get:t,dispose:s}}class qT extends so{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Wy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class YT extends so{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const KT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ZT=`uniform sampler2D shadow_pass;
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
}`;function JT(r,e,t){let s=new Zd;const o=new xt,l=new xt,d=new rn,u=new qT({depthPacking:$y}),m=new YT,p={},g=t.maxTextureSize,_={[Sr]:Nn,[Nn]:Sr,[gi]:gi},y=new Er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:KT,fragmentShader:ZT}),M=y.clone();M.defines.HORIZONTAL_PASS=1;const E=new Hi;E.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new xi(E,y),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xg;let x=this.type;this.render=function(I,k,$){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||I.length===0)return;const R=r.getRenderTarget(),A=r.getActiveCubeFace(),D=r.getActiveMipmapLevel(),W=r.state;W.setBlending(xr),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const j=x!==ki&&this.type===ki,te=x===ki&&this.type!==ki;for(let oe=0,he=I.length;oe<he;oe++){const de=I[oe],H=de.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",de,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;o.copy(H.mapSize);const B=H.getFrameExtents();if(o.multiply(B),l.copy(H.mapSize),(o.x>g||o.y>g)&&(o.x>g&&(l.x=Math.floor(g/B.x),o.x=l.x*B.x,H.mapSize.x=l.x),o.y>g&&(l.y=Math.floor(g/B.y),o.y=l.y*B.y,H.mapSize.y=l.y)),H.map===null||j===!0||te===!0){const O=this.type!==ki?{minFilter:Kn,magFilter:Kn}:{};H.map!==null&&H.map.dispose(),H.map=new ns(o.x,o.y,O),H.map.texture.name=de.name+".shadowMap",H.camera.updateProjectionMatrix()}r.setRenderTarget(H.map),r.clear();const K=H.getViewportCount();for(let O=0;O<K;O++){const ie=H.getViewport(O);d.set(l.x*ie.x,l.y*ie.y,l.x*ie.z,l.y*ie.w),W.viewport(d),H.updateMatrices(de,O),s=H.getFrustum(),U(k,$,H.camera,de,this.type)}H.isPointLightShadow!==!0&&this.type===ki&&L(H,$),H.needsUpdate=!1}x=this.type,S.needsUpdate=!1,r.setRenderTarget(R,A,D)};function L(I,k){const $=e.update(w);y.defines.VSM_SAMPLES!==I.blurSamples&&(y.defines.VSM_SAMPLES=I.blurSamples,M.defines.VSM_SAMPLES=I.blurSamples,y.needsUpdate=!0,M.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new ns(o.x,o.y)),y.uniforms.shadow_pass.value=I.map.texture,y.uniforms.resolution.value=I.mapSize,y.uniforms.radius.value=I.radius,r.setRenderTarget(I.mapPass),r.clear(),r.renderBufferDirect(k,null,$,y,w,null),M.uniforms.shadow_pass.value=I.mapPass.texture,M.uniforms.resolution.value=I.mapSize,M.uniforms.radius.value=I.radius,r.setRenderTarget(I.map),r.clear(),r.renderBufferDirect(k,null,$,M,w,null)}function N(I,k,$,R){let A=null;const D=$.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(D!==void 0)A=D;else if(A=$.isPointLight===!0?m:u,r.localClippingEnabled&&k.clipShadows===!0&&Array.isArray(k.clippingPlanes)&&k.clippingPlanes.length!==0||k.displacementMap&&k.displacementScale!==0||k.alphaMap&&k.alphaTest>0||k.map&&k.alphaTest>0){const W=A.uuid,j=k.uuid;let te=p[W];te===void 0&&(te={},p[W]=te);let oe=te[j];oe===void 0&&(oe=A.clone(),te[j]=oe,k.addEventListener("dispose",Y)),A=oe}if(A.visible=k.visible,A.wireframe=k.wireframe,R===ki?A.side=k.shadowSide!==null?k.shadowSide:k.side:A.side=k.shadowSide!==null?k.shadowSide:_[k.side],A.alphaMap=k.alphaMap,A.alphaTest=k.alphaTest,A.map=k.map,A.clipShadows=k.clipShadows,A.clippingPlanes=k.clippingPlanes,A.clipIntersection=k.clipIntersection,A.displacementMap=k.displacementMap,A.displacementScale=k.displacementScale,A.displacementBias=k.displacementBias,A.wireframeLinewidth=k.wireframeLinewidth,A.linewidth=k.linewidth,$.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const W=r.properties.get(A);W.light=$}return A}function U(I,k,$,R,A){if(I.visible===!1)return;if(I.layers.test(k.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&A===ki)&&(!I.frustumCulled||s.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,I.matrixWorld);const j=e.update(I),te=I.material;if(Array.isArray(te)){const oe=j.groups;for(let he=0,de=oe.length;he<de;he++){const H=oe[he],B=te[H.materialIndex];if(B&&B.visible){const K=N(I,B,R,A);I.onBeforeShadow(r,I,k,$,j,K,H),r.renderBufferDirect($,null,j,K,I,H),I.onAfterShadow(r,I,k,$,j,K,H)}}}else if(te.visible){const oe=N(I,te,R,A);I.onBeforeShadow(r,I,k,$,j,oe,null),r.renderBufferDirect($,null,j,oe,I,null),I.onAfterShadow(r,I,k,$,j,oe,null)}}const W=I.children;for(let j=0,te=W.length;j<te;j++)U(W[j],k,$,R,A)}function Y(I){I.target.removeEventListener("dispose",Y);for(const $ in p){const R=p[$],A=I.target.uuid;A in R&&(R[A].dispose(),delete R[A])}}}function QT(r){function e(){let b=!1;const V=new rn;let q=null;const fe=new rn(0,0,0,0);return{setMask:function(_e){q!==_e&&!b&&(r.colorMask(_e,_e,_e,_e),q=_e)},setLocked:function(_e){b=_e},setClear:function(_e,Ye,$e,pt,Vt){Vt===!0&&(_e*=pt,Ye*=pt,$e*=pt),V.set(_e,Ye,$e,pt),fe.equals(V)===!1&&(r.clearColor(_e,Ye,$e,pt),fe.copy(V))},reset:function(){b=!1,q=null,fe.set(-1,0,0,0)}}}function t(){let b=!1,V=null,q=null,fe=null;return{setTest:function(_e){_e?Me(r.DEPTH_TEST):ve(r.DEPTH_TEST)},setMask:function(_e){V!==_e&&!b&&(r.depthMask(_e),V=_e)},setFunc:function(_e){if(q!==_e){switch(_e){case _y:r.depthFunc(r.NEVER);break;case xy:r.depthFunc(r.ALWAYS);break;case yy:r.depthFunc(r.LESS);break;case Vl:r.depthFunc(r.LEQUAL);break;case Sy:r.depthFunc(r.EQUAL);break;case My:r.depthFunc(r.GEQUAL);break;case Ey:r.depthFunc(r.GREATER);break;case wy:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}q=_e}},setLocked:function(_e){b=_e},setClear:function(_e){fe!==_e&&(r.clearDepth(_e),fe=_e)},reset:function(){b=!1,V=null,q=null,fe=null}}}function s(){let b=!1,V=null,q=null,fe=null,_e=null,Ye=null,$e=null,pt=null,Vt=null;return{setTest:function(St){b||(St?Me(r.STENCIL_TEST):ve(r.STENCIL_TEST))},setMask:function(St){V!==St&&!b&&(r.stencilMask(St),V=St)},setFunc:function(St,Sn,Zt){(q!==St||fe!==Sn||_e!==Zt)&&(r.stencilFunc(St,Sn,Zt),q=St,fe=Sn,_e=Zt)},setOp:function(St,Sn,Zt){(Ye!==St||$e!==Sn||pt!==Zt)&&(r.stencilOp(St,Sn,Zt),Ye=St,$e=Sn,pt=Zt)},setLocked:function(St){b=St},setClear:function(St){Vt!==St&&(r.clearStencil(St),Vt=St)},reset:function(){b=!1,V=null,q=null,fe=null,_e=null,Ye=null,$e=null,pt=null,Vt=null}}}const o=new e,l=new t,d=new s,u=new WeakMap,m=new WeakMap;let p={},g={},_=new WeakMap,y=[],M=null,E=!1,w=null,S=null,x=null,L=null,N=null,U=null,Y=null,I=new Et(0,0,0),k=0,$=!1,R=null,A=null,D=null,W=null,j=null;const te=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let oe=!1,he=0;const de=r.getParameter(r.VERSION);de.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(de)[1]),oe=he>=1):de.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(de)[1]),oe=he>=2);let H=null,B={};const K=r.getParameter(r.SCISSOR_BOX),O=r.getParameter(r.VIEWPORT),ie=new rn().fromArray(K),De=new rn().fromArray(O);function Q(b,V,q,fe){const _e=new Uint8Array(4),Ye=r.createTexture();r.bindTexture(b,Ye),r.texParameteri(b,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(b,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let $e=0;$e<q;$e++)b===r.TEXTURE_3D||b===r.TEXTURE_2D_ARRAY?r.texImage3D(V,0,r.RGBA,1,1,fe,0,r.RGBA,r.UNSIGNED_BYTE,_e):r.texImage2D(V+$e,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,_e);return Ye}const pe={};pe[r.TEXTURE_2D]=Q(r.TEXTURE_2D,r.TEXTURE_2D,1),pe[r.TEXTURE_CUBE_MAP]=Q(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[r.TEXTURE_2D_ARRAY]=Q(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),pe[r.TEXTURE_3D]=Q(r.TEXTURE_3D,r.TEXTURE_3D,1,1),o.setClear(0,0,0,1),l.setClear(1),d.setClear(0),Me(r.DEPTH_TEST),l.setFunc(Vl),lt(!1),it(em),Me(r.CULL_FACE),nt(xr);function Me(b){p[b]!==!0&&(r.enable(b),p[b]=!0)}function ve(b){p[b]!==!1&&(r.disable(b),p[b]=!1)}function Le(b,V){return g[b]!==V?(r.bindFramebuffer(b,V),g[b]=V,b===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=V),b===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=V),!0):!1}function Fe(b,V){let q=y,fe=!1;if(b){q=_.get(V),q===void 0&&(q=[],_.set(V,q));const _e=b.textures;if(q.length!==_e.length||q[0]!==r.COLOR_ATTACHMENT0){for(let Ye=0,$e=_e.length;Ye<$e;Ye++)q[Ye]=r.COLOR_ATTACHMENT0+Ye;q.length=_e.length,fe=!0}}else q[0]!==r.BACK&&(q[0]=r.BACK,fe=!0);fe&&r.drawBuffers(q)}function Z(b){return M!==b?(r.useProgram(b),M=b,!0):!1}const gt={[qr]:r.FUNC_ADD,[ty]:r.FUNC_SUBTRACT,[ny]:r.FUNC_REVERSE_SUBTRACT};gt[iy]=r.MIN,gt[ry]=r.MAX;const Ae={[sy]:r.ZERO,[ay]:r.ONE,[oy]:r.SRC_COLOR,[Rd]:r.SRC_ALPHA,[hy]:r.SRC_ALPHA_SATURATE,[dy]:r.DST_COLOR,[cy]:r.DST_ALPHA,[ly]:r.ONE_MINUS_SRC_COLOR,[Nd]:r.ONE_MINUS_SRC_ALPHA,[fy]:r.ONE_MINUS_DST_COLOR,[uy]:r.ONE_MINUS_DST_ALPHA,[py]:r.CONSTANT_COLOR,[my]:r.ONE_MINUS_CONSTANT_COLOR,[gy]:r.CONSTANT_ALPHA,[vy]:r.ONE_MINUS_CONSTANT_ALPHA};function nt(b,V,q,fe,_e,Ye,$e,pt,Vt,St){if(b===xr){E===!0&&(ve(r.BLEND),E=!1);return}if(E===!1&&(Me(r.BLEND),E=!0),b!==ey){if(b!==w||St!==$){if((S!==qr||N!==qr)&&(r.blendEquation(r.FUNC_ADD),S=qr,N=qr),St)switch(b){case Ys:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case tm:r.blendFunc(r.ONE,r.ONE);break;case nm:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case im:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",b);break}else switch(b){case Ys:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case tm:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case nm:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case im:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",b);break}x=null,L=null,U=null,Y=null,I.set(0,0,0),k=0,w=b,$=St}return}_e=_e||V,Ye=Ye||q,$e=$e||fe,(V!==S||_e!==N)&&(r.blendEquationSeparate(gt[V],gt[_e]),S=V,N=_e),(q!==x||fe!==L||Ye!==U||$e!==Y)&&(r.blendFuncSeparate(Ae[q],Ae[fe],Ae[Ye],Ae[$e]),x=q,L=fe,U=Ye,Y=$e),(pt.equals(I)===!1||Vt!==k)&&(r.blendColor(pt.r,pt.g,pt.b,Vt),I.copy(pt),k=Vt),w=b,$=!1}function Xe(b,V){b.side===gi?ve(r.CULL_FACE):Me(r.CULL_FACE);let q=b.side===Nn;V&&(q=!q),lt(q),b.blending===Ys&&b.transparent===!1?nt(xr):nt(b.blending,b.blendEquation,b.blendSrc,b.blendDst,b.blendEquationAlpha,b.blendSrcAlpha,b.blendDstAlpha,b.blendColor,b.blendAlpha,b.premultipliedAlpha),l.setFunc(b.depthFunc),l.setTest(b.depthTest),l.setMask(b.depthWrite),o.setMask(b.colorWrite);const fe=b.stencilWrite;d.setTest(fe),fe&&(d.setMask(b.stencilWriteMask),d.setFunc(b.stencilFunc,b.stencilRef,b.stencilFuncMask),d.setOp(b.stencilFail,b.stencilZFail,b.stencilZPass)),Tt(b.polygonOffset,b.polygonOffsetFactor,b.polygonOffsetUnits),b.alphaToCoverage===!0?Me(r.SAMPLE_ALPHA_TO_COVERAGE):ve(r.SAMPLE_ALPHA_TO_COVERAGE)}function lt(b){R!==b&&(b?r.frontFace(r.CW):r.frontFace(r.CCW),R=b)}function it(b){b!==Z0?(Me(r.CULL_FACE),b!==A&&(b===em?r.cullFace(r.BACK):b===J0?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ve(r.CULL_FACE),A=b}function ot(b){b!==D&&(oe&&r.lineWidth(b),D=b)}function Tt(b,V,q){b?(Me(r.POLYGON_OFFSET_FILL),(W!==V||j!==q)&&(r.polygonOffset(V,q),W=V,j=q)):ve(r.POLYGON_OFFSET_FILL)}function z(b){b?Me(r.SCISSOR_TEST):ve(r.SCISSOR_TEST)}function C(b){b===void 0&&(b=r.TEXTURE0+te-1),H!==b&&(r.activeTexture(b),H=b)}function ce(b,V,q){q===void 0&&(H===null?q=r.TEXTURE0+te-1:q=H);let fe=B[q];fe===void 0&&(fe={type:void 0,texture:void 0},B[q]=fe),(fe.type!==b||fe.texture!==V)&&(H!==q&&(r.activeTexture(q),H=q),r.bindTexture(b,V||pe[b]),fe.type=b,fe.texture=V)}function ge(){const b=B[H];b!==void 0&&b.type!==void 0&&(r.bindTexture(b.type,null),b.type=void 0,b.texture=void 0)}function Se(){try{r.compressedTexImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Ee(){try{r.compressedTexImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function We(){try{r.texSubImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Re(){try{r.texSubImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Ce(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function tt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function be(){try{r.texStorage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function He(){try{r.texStorage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function ct(){try{r.texImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function qe(){try{r.texImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Ie(b){ie.equals(b)===!1&&(r.scissor(b.x,b.y,b.z,b.w),ie.copy(b))}function st(b){De.equals(b)===!1&&(r.viewport(b.x,b.y,b.z,b.w),De.copy(b))}function ht(b,V){let q=m.get(V);q===void 0&&(q=new WeakMap,m.set(V,q));let fe=q.get(b);fe===void 0&&(fe=r.getUniformBlockIndex(V,b.name),q.set(b,fe))}function bt(b,V){const fe=m.get(V).get(b);u.get(V)!==fe&&(r.uniformBlockBinding(V,fe,b.__bindingPointIndex),u.set(V,fe))}function rt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),p={},H=null,B={},g={},_=new WeakMap,y=[],M=null,E=!1,w=null,S=null,x=null,L=null,N=null,U=null,Y=null,I=new Et(0,0,0),k=0,$=!1,R=null,A=null,D=null,W=null,j=null,ie.set(0,0,r.canvas.width,r.canvas.height),De.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),d.reset()}return{buffers:{color:o,depth:l,stencil:d},enable:Me,disable:ve,bindFramebuffer:Le,drawBuffers:Fe,useProgram:Z,setBlending:nt,setMaterial:Xe,setFlipSided:lt,setCullFace:it,setLineWidth:ot,setPolygonOffset:Tt,setScissorTest:z,activeTexture:C,bindTexture:ce,unbindTexture:ge,compressedTexImage2D:Se,compressedTexImage3D:Ee,texImage2D:ct,texImage3D:qe,updateUBOMapping:ht,uniformBlockBinding:bt,texStorage2D:be,texStorage3D:He,texSubImage2D:We,texSubImage3D:Re,compressedTexSubImage2D:Ce,compressedTexSubImage3D:tt,scissor:Ie,viewport:st,reset:rt}}function e1(r,e,t,s,o,l,d){const u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new xt,g=new WeakMap;let _;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(z,C){return M?new OffscreenCanvas(z,C):ql("canvas")}function w(z,C,ce){let ge=1;const Se=Tt(z);if((Se.width>ce||Se.height>ce)&&(ge=ce/Math.max(Se.width,Se.height)),ge<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const Ee=Math.floor(ge*Se.width),We=Math.floor(ge*Se.height);_===void 0&&(_=E(Ee,We));const Re=C?E(Ee,We):_;return Re.width=Ee,Re.height=We,Re.getContext("2d").drawImage(z,0,0,Ee,We),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Se.width+"x"+Se.height+") to ("+Ee+"x"+We+")."),Re}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Se.width+"x"+Se.height+")."),z;return z}function S(z){return z.generateMipmaps&&z.minFilter!==Kn&&z.minFilter!==oi}function x(z){r.generateMipmap(z)}function L(z,C,ce,ge,Se=!1){if(z!==null){if(r[z]!==void 0)return r[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let Ee=C;if(C===r.RED&&(ce===r.FLOAT&&(Ee=r.R32F),ce===r.HALF_FLOAT&&(Ee=r.R16F),ce===r.UNSIGNED_BYTE&&(Ee=r.R8)),C===r.RED_INTEGER&&(ce===r.UNSIGNED_BYTE&&(Ee=r.R8UI),ce===r.UNSIGNED_SHORT&&(Ee=r.R16UI),ce===r.UNSIGNED_INT&&(Ee=r.R32UI),ce===r.BYTE&&(Ee=r.R8I),ce===r.SHORT&&(Ee=r.R16I),ce===r.INT&&(Ee=r.R32I)),C===r.RG&&(ce===r.FLOAT&&(Ee=r.RG32F),ce===r.HALF_FLOAT&&(Ee=r.RG16F),ce===r.UNSIGNED_BYTE&&(Ee=r.RG8)),C===r.RG_INTEGER&&(ce===r.UNSIGNED_BYTE&&(Ee=r.RG8UI),ce===r.UNSIGNED_SHORT&&(Ee=r.RG16UI),ce===r.UNSIGNED_INT&&(Ee=r.RG32UI),ce===r.BYTE&&(Ee=r.RG8I),ce===r.SHORT&&(Ee=r.RG16I),ce===r.INT&&(Ee=r.RG32I)),C===r.RGB&&ce===r.UNSIGNED_INT_5_9_9_9_REV&&(Ee=r.RGB9_E5),C===r.RGBA){const We=Se?Gl:At.getTransfer(ge);ce===r.FLOAT&&(Ee=r.RGBA32F),ce===r.HALF_FLOAT&&(Ee=r.RGBA16F),ce===r.UNSIGNED_BYTE&&(Ee=We===Lt?r.SRGB8_ALPHA8:r.RGBA8),ce===r.UNSIGNED_SHORT_4_4_4_4&&(Ee=r.RGBA4),ce===r.UNSIGNED_SHORT_5_5_5_1&&(Ee=r.RGB5_A1)}return(Ee===r.R16F||Ee===r.R32F||Ee===r.RG16F||Ee===r.RG32F||Ee===r.RGBA16F||Ee===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Ee}function N(z,C){return S(z)===!0||z.isFramebufferTexture&&z.minFilter!==Kn&&z.minFilter!==oi?Math.log2(Math.max(C.width,C.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?C.mipmaps.length:1}function U(z){const C=z.target;C.removeEventListener("dispose",U),I(C),C.isVideoTexture&&g.delete(C)}function Y(z){const C=z.target;C.removeEventListener("dispose",Y),$(C)}function I(z){const C=s.get(z);if(C.__webglInit===void 0)return;const ce=z.source,ge=y.get(ce);if(ge){const Se=ge[C.__cacheKey];Se.usedTimes--,Se.usedTimes===0&&k(z),Object.keys(ge).length===0&&y.delete(ce)}s.remove(z)}function k(z){const C=s.get(z);r.deleteTexture(C.__webglTexture);const ce=z.source,ge=y.get(ce);delete ge[C.__cacheKey],d.memory.textures--}function $(z){const C=s.get(z);if(z.depthTexture&&z.depthTexture.dispose(),z.isWebGLCubeRenderTarget)for(let ge=0;ge<6;ge++){if(Array.isArray(C.__webglFramebuffer[ge]))for(let Se=0;Se<C.__webglFramebuffer[ge].length;Se++)r.deleteFramebuffer(C.__webglFramebuffer[ge][Se]);else r.deleteFramebuffer(C.__webglFramebuffer[ge]);C.__webglDepthbuffer&&r.deleteRenderbuffer(C.__webglDepthbuffer[ge])}else{if(Array.isArray(C.__webglFramebuffer))for(let ge=0;ge<C.__webglFramebuffer.length;ge++)r.deleteFramebuffer(C.__webglFramebuffer[ge]);else r.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&r.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&r.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let ge=0;ge<C.__webglColorRenderbuffer.length;ge++)C.__webglColorRenderbuffer[ge]&&r.deleteRenderbuffer(C.__webglColorRenderbuffer[ge]);C.__webglDepthRenderbuffer&&r.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const ce=z.textures;for(let ge=0,Se=ce.length;ge<Se;ge++){const Ee=s.get(ce[ge]);Ee.__webglTexture&&(r.deleteTexture(Ee.__webglTexture),d.memory.textures--),s.remove(ce[ge])}s.remove(z)}let R=0;function A(){R=0}function D(){const z=R;return z>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+o.maxTextures),R+=1,z}function W(z){const C=[];return C.push(z.wrapS),C.push(z.wrapT),C.push(z.wrapR||0),C.push(z.magFilter),C.push(z.minFilter),C.push(z.anisotropy),C.push(z.internalFormat),C.push(z.format),C.push(z.type),C.push(z.generateMipmaps),C.push(z.premultiplyAlpha),C.push(z.flipY),C.push(z.unpackAlignment),C.push(z.colorSpace),C.join()}function j(z,C){const ce=s.get(z);if(z.isVideoTexture&&it(z),z.isRenderTargetTexture===!1&&z.version>0&&ce.__version!==z.version){const ge=z.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ie(ce,z,C);return}}t.bindTexture(r.TEXTURE_2D,ce.__webglTexture,r.TEXTURE0+C)}function te(z,C){const ce=s.get(z);if(z.version>0&&ce.__version!==z.version){ie(ce,z,C);return}t.bindTexture(r.TEXTURE_2D_ARRAY,ce.__webglTexture,r.TEXTURE0+C)}function oe(z,C){const ce=s.get(z);if(z.version>0&&ce.__version!==z.version){ie(ce,z,C);return}t.bindTexture(r.TEXTURE_3D,ce.__webglTexture,r.TEXTURE0+C)}function he(z,C){const ce=s.get(z);if(z.version>0&&ce.__version!==z.version){De(ce,z,C);return}t.bindTexture(r.TEXTURE_CUBE_MAP,ce.__webglTexture,r.TEXTURE0+C)}const de={[Dd]:r.REPEAT,[Zr]:r.CLAMP_TO_EDGE,[Ud]:r.MIRRORED_REPEAT},H={[Kn]:r.NEAREST,[Uy]:r.NEAREST_MIPMAP_NEAREST,[pl]:r.NEAREST_MIPMAP_LINEAR,[oi]:r.LINEAR,[Gu]:r.LINEAR_MIPMAP_NEAREST,[Jr]:r.LINEAR_MIPMAP_LINEAR},B={[qy]:r.NEVER,[eS]:r.ALWAYS,[Yy]:r.LESS,[rv]:r.LEQUAL,[Ky]:r.EQUAL,[Qy]:r.GEQUAL,[Zy]:r.GREATER,[Jy]:r.NOTEQUAL};function K(z,C){if(C.type===_r&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===oi||C.magFilter===Gu||C.magFilter===pl||C.magFilter===Jr||C.minFilter===oi||C.minFilter===Gu||C.minFilter===pl||C.minFilter===Jr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(z,r.TEXTURE_WRAP_S,de[C.wrapS]),r.texParameteri(z,r.TEXTURE_WRAP_T,de[C.wrapT]),(z===r.TEXTURE_3D||z===r.TEXTURE_2D_ARRAY)&&r.texParameteri(z,r.TEXTURE_WRAP_R,de[C.wrapR]),r.texParameteri(z,r.TEXTURE_MAG_FILTER,H[C.magFilter]),r.texParameteri(z,r.TEXTURE_MIN_FILTER,H[C.minFilter]),C.compareFunction&&(r.texParameteri(z,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(z,r.TEXTURE_COMPARE_FUNC,B[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Kn||C.minFilter!==pl&&C.minFilter!==Jr||C.type===_r&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||s.get(C).__currentAnisotropy){const ce=e.get("EXT_texture_filter_anisotropic");r.texParameterf(z,ce.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,o.getMaxAnisotropy())),s.get(C).__currentAnisotropy=C.anisotropy}}}function O(z,C){let ce=!1;z.__webglInit===void 0&&(z.__webglInit=!0,C.addEventListener("dispose",U));const ge=C.source;let Se=y.get(ge);Se===void 0&&(Se={},y.set(ge,Se));const Ee=W(C);if(Ee!==z.__cacheKey){Se[Ee]===void 0&&(Se[Ee]={texture:r.createTexture(),usedTimes:0},d.memory.textures++,ce=!0),Se[Ee].usedTimes++;const We=Se[z.__cacheKey];We!==void 0&&(Se[z.__cacheKey].usedTimes--,We.usedTimes===0&&k(C)),z.__cacheKey=Ee,z.__webglTexture=Se[Ee].texture}return ce}function ie(z,C,ce){let ge=r.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(ge=r.TEXTURE_2D_ARRAY),C.isData3DTexture&&(ge=r.TEXTURE_3D);const Se=O(z,C),Ee=C.source;t.bindTexture(ge,z.__webglTexture,r.TEXTURE0+ce);const We=s.get(Ee);if(Ee.version!==We.__version||Se===!0){t.activeTexture(r.TEXTURE0+ce);const Re=At.getPrimaries(At.workingColorSpace),Ce=C.colorSpace===vr?null:At.getPrimaries(C.colorSpace),tt=C.colorSpace===vr||Re===Ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,C.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,C.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);let be=w(C.image,!1,o.maxTextureSize);be=ot(C,be);const He=l.convert(C.format,C.colorSpace),ct=l.convert(C.type);let qe=L(C.internalFormat,He,ct,C.colorSpace,C.isVideoTexture);K(ge,C);let Ie;const st=C.mipmaps,ht=C.isVideoTexture!==!0,bt=We.__version===void 0||Se===!0,rt=Ee.dataReady,b=N(C,be);if(C.isDepthTexture)qe=r.DEPTH_COMPONENT16,C.type===_r?qe=r.DEPTH_COMPONENT32F:C.type===na?qe=r.DEPTH_COMPONENT24:C.type===no&&(qe=r.DEPTH24_STENCIL8),bt&&(ht?t.texStorage2D(r.TEXTURE_2D,1,qe,be.width,be.height):t.texImage2D(r.TEXTURE_2D,0,qe,be.width,be.height,0,He,ct,null));else if(C.isDataTexture)if(st.length>0){ht&&bt&&t.texStorage2D(r.TEXTURE_2D,b,qe,st[0].width,st[0].height);for(let V=0,q=st.length;V<q;V++)Ie=st[V],ht?rt&&t.texSubImage2D(r.TEXTURE_2D,V,0,0,Ie.width,Ie.height,He,ct,Ie.data):t.texImage2D(r.TEXTURE_2D,V,qe,Ie.width,Ie.height,0,He,ct,Ie.data);C.generateMipmaps=!1}else ht?(bt&&t.texStorage2D(r.TEXTURE_2D,b,qe,be.width,be.height),rt&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,be.width,be.height,He,ct,be.data)):t.texImage2D(r.TEXTURE_2D,0,qe,be.width,be.height,0,He,ct,be.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){ht&&bt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,b,qe,st[0].width,st[0].height,be.depth);for(let V=0,q=st.length;V<q;V++)Ie=st[V],C.format!==_i?He!==null?ht?rt&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,V,0,0,0,Ie.width,Ie.height,be.depth,He,Ie.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,V,qe,Ie.width,Ie.height,be.depth,0,Ie.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ht?rt&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,V,0,0,0,Ie.width,Ie.height,be.depth,He,ct,Ie.data):t.texImage3D(r.TEXTURE_2D_ARRAY,V,qe,Ie.width,Ie.height,be.depth,0,He,ct,Ie.data)}else{ht&&bt&&t.texStorage2D(r.TEXTURE_2D,b,qe,st[0].width,st[0].height);for(let V=0,q=st.length;V<q;V++)Ie=st[V],C.format!==_i?He!==null?ht?rt&&t.compressedTexSubImage2D(r.TEXTURE_2D,V,0,0,Ie.width,Ie.height,He,Ie.data):t.compressedTexImage2D(r.TEXTURE_2D,V,qe,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ht?rt&&t.texSubImage2D(r.TEXTURE_2D,V,0,0,Ie.width,Ie.height,He,ct,Ie.data):t.texImage2D(r.TEXTURE_2D,V,qe,Ie.width,Ie.height,0,He,ct,Ie.data)}else if(C.isDataArrayTexture)ht?(bt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,b,qe,be.width,be.height,be.depth),rt&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,be.width,be.height,be.depth,He,ct,be.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,qe,be.width,be.height,be.depth,0,He,ct,be.data);else if(C.isData3DTexture)ht?(bt&&t.texStorage3D(r.TEXTURE_3D,b,qe,be.width,be.height,be.depth),rt&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,be.width,be.height,be.depth,He,ct,be.data)):t.texImage3D(r.TEXTURE_3D,0,qe,be.width,be.height,be.depth,0,He,ct,be.data);else if(C.isFramebufferTexture){if(bt)if(ht)t.texStorage2D(r.TEXTURE_2D,b,qe,be.width,be.height);else{let V=be.width,q=be.height;for(let fe=0;fe<b;fe++)t.texImage2D(r.TEXTURE_2D,fe,qe,V,q,0,He,ct,null),V>>=1,q>>=1}}else if(st.length>0){if(ht&&bt){const V=Tt(st[0]);t.texStorage2D(r.TEXTURE_2D,b,qe,V.width,V.height)}for(let V=0,q=st.length;V<q;V++)Ie=st[V],ht?rt&&t.texSubImage2D(r.TEXTURE_2D,V,0,0,He,ct,Ie):t.texImage2D(r.TEXTURE_2D,V,qe,He,ct,Ie);C.generateMipmaps=!1}else if(ht){if(bt){const V=Tt(be);t.texStorage2D(r.TEXTURE_2D,b,qe,V.width,V.height)}rt&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,He,ct,be)}else t.texImage2D(r.TEXTURE_2D,0,qe,He,ct,be);S(C)&&x(ge),We.__version=Ee.version,C.onUpdate&&C.onUpdate(C)}z.__version=C.version}function De(z,C,ce){if(C.image.length!==6)return;const ge=O(z,C),Se=C.source;t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+ce);const Ee=s.get(Se);if(Se.version!==Ee.__version||ge===!0){t.activeTexture(r.TEXTURE0+ce);const We=At.getPrimaries(At.workingColorSpace),Re=C.colorSpace===vr?null:At.getPrimaries(C.colorSpace),Ce=C.colorSpace===vr||We===Re?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,C.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,C.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);const tt=C.isCompressedTexture||C.image[0].isCompressedTexture,be=C.image[0]&&C.image[0].isDataTexture,He=[];for(let q=0;q<6;q++)!tt&&!be?He[q]=w(C.image[q],!0,o.maxCubemapSize):He[q]=be?C.image[q].image:C.image[q],He[q]=ot(C,He[q]);const ct=He[0],qe=l.convert(C.format,C.colorSpace),Ie=l.convert(C.type),st=L(C.internalFormat,qe,Ie,C.colorSpace),ht=C.isVideoTexture!==!0,bt=Ee.__version===void 0||ge===!0,rt=Se.dataReady;let b=N(C,ct);K(r.TEXTURE_CUBE_MAP,C);let V;if(tt){ht&&bt&&t.texStorage2D(r.TEXTURE_CUBE_MAP,b,st,ct.width,ct.height);for(let q=0;q<6;q++){V=He[q].mipmaps;for(let fe=0;fe<V.length;fe++){const _e=V[fe];C.format!==_i?qe!==null?ht?rt&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe,0,0,_e.width,_e.height,qe,_e.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe,st,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe,0,0,_e.width,_e.height,qe,Ie,_e.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe,st,_e.width,_e.height,0,qe,Ie,_e.data)}}}else{if(V=C.mipmaps,ht&&bt){V.length>0&&b++;const q=Tt(He[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,b,st,q.width,q.height)}for(let q=0;q<6;q++)if(be){ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,He[q].width,He[q].height,qe,Ie,He[q].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,st,He[q].width,He[q].height,0,qe,Ie,He[q].data);for(let fe=0;fe<V.length;fe++){const Ye=V[fe].image[q].image;ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe+1,0,0,Ye.width,Ye.height,qe,Ie,Ye.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe+1,st,Ye.width,Ye.height,0,qe,Ie,Ye.data)}}else{ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,qe,Ie,He[q]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,st,qe,Ie,He[q]);for(let fe=0;fe<V.length;fe++){const _e=V[fe];ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe+1,0,0,qe,Ie,_e.image[q]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,fe+1,st,qe,Ie,_e.image[q])}}}S(C)&&x(r.TEXTURE_CUBE_MAP),Ee.__version=Se.version,C.onUpdate&&C.onUpdate(C)}z.__version=C.version}function Q(z,C,ce,ge,Se,Ee){const We=l.convert(ce.format,ce.colorSpace),Re=l.convert(ce.type),Ce=L(ce.internalFormat,We,Re,ce.colorSpace);if(!s.get(C).__hasExternalTextures){const be=Math.max(1,C.width>>Ee),He=Math.max(1,C.height>>Ee);Se===r.TEXTURE_3D||Se===r.TEXTURE_2D_ARRAY?t.texImage3D(Se,Ee,Ce,be,He,C.depth,0,We,Re,null):t.texImage2D(Se,Ee,Ce,be,He,0,We,Re,null)}t.bindFramebuffer(r.FRAMEBUFFER,z),lt(C)?u.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ge,Se,s.get(ce).__webglTexture,0,Xe(C)):(Se===r.TEXTURE_2D||Se>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Se<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ge,Se,s.get(ce).__webglTexture,Ee),t.bindFramebuffer(r.FRAMEBUFFER,null)}function pe(z,C,ce){if(r.bindRenderbuffer(r.RENDERBUFFER,z),C.depthBuffer&&!C.stencilBuffer){let ge=r.DEPTH_COMPONENT24;if(ce||lt(C)){const Se=C.depthTexture;Se&&Se.isDepthTexture&&(Se.type===_r?ge=r.DEPTH_COMPONENT32F:Se.type===na&&(ge=r.DEPTH_COMPONENT24));const Ee=Xe(C);lt(C)?u.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ee,ge,C.width,C.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,Ee,ge,C.width,C.height)}else r.renderbufferStorage(r.RENDERBUFFER,ge,C.width,C.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,z)}else if(C.depthBuffer&&C.stencilBuffer){const ge=Xe(C);ce&&lt(C)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ge,r.DEPTH24_STENCIL8,C.width,C.height):lt(C)?u.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ge,r.DEPTH24_STENCIL8,C.width,C.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,z)}else{const ge=C.textures;for(let Se=0;Se<ge.length;Se++){const Ee=ge[Se],We=l.convert(Ee.format,Ee.colorSpace),Re=l.convert(Ee.type),Ce=L(Ee.internalFormat,We,Re,Ee.colorSpace),tt=Xe(C);ce&&lt(C)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,tt,Ce,C.width,C.height):lt(C)?u.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,tt,Ce,C.width,C.height):r.renderbufferStorage(r.RENDERBUFFER,Ce,C.width,C.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Me(z,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,z),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(C.depthTexture).__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),j(C.depthTexture,0);const ge=s.get(C.depthTexture).__webglTexture,Se=Xe(C);if(C.depthTexture.format===Ks)lt(C)?u.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ge,0,Se):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ge,0);else if(C.depthTexture.format===eo)lt(C)?u.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ge,0,Se):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function ve(z){const C=s.get(z),ce=z.isWebGLCubeRenderTarget===!0;if(z.depthTexture&&!C.__autoAllocateDepthBuffer){if(ce)throw new Error("target.depthTexture not supported in Cube render targets");Me(C.__webglFramebuffer,z)}else if(ce){C.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)t.bindFramebuffer(r.FRAMEBUFFER,C.__webglFramebuffer[ge]),C.__webglDepthbuffer[ge]=r.createRenderbuffer(),pe(C.__webglDepthbuffer[ge],z,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer=r.createRenderbuffer(),pe(C.__webglDepthbuffer,z,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function Le(z,C,ce){const ge=s.get(z);C!==void 0&&Q(ge.__webglFramebuffer,z,z.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),ce!==void 0&&ve(z)}function Fe(z){const C=z.texture,ce=s.get(z),ge=s.get(C);z.addEventListener("dispose",Y);const Se=z.textures,Ee=z.isWebGLCubeRenderTarget===!0,We=Se.length>1;if(We||(ge.__webglTexture===void 0&&(ge.__webglTexture=r.createTexture()),ge.__version=C.version,d.memory.textures++),Ee){ce.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(C.mipmaps&&C.mipmaps.length>0){ce.__webglFramebuffer[Re]=[];for(let Ce=0;Ce<C.mipmaps.length;Ce++)ce.__webglFramebuffer[Re][Ce]=r.createFramebuffer()}else ce.__webglFramebuffer[Re]=r.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){ce.__webglFramebuffer=[];for(let Re=0;Re<C.mipmaps.length;Re++)ce.__webglFramebuffer[Re]=r.createFramebuffer()}else ce.__webglFramebuffer=r.createFramebuffer();if(We)for(let Re=0,Ce=Se.length;Re<Ce;Re++){const tt=s.get(Se[Re]);tt.__webglTexture===void 0&&(tt.__webglTexture=r.createTexture(),d.memory.textures++)}if(z.samples>0&&lt(z)===!1){ce.__webglMultisampledFramebuffer=r.createFramebuffer(),ce.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer);for(let Re=0;Re<Se.length;Re++){const Ce=Se[Re];ce.__webglColorRenderbuffer[Re]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,ce.__webglColorRenderbuffer[Re]);const tt=l.convert(Ce.format,Ce.colorSpace),be=l.convert(Ce.type),He=L(Ce.internalFormat,tt,be,Ce.colorSpace,z.isXRRenderTarget===!0),ct=Xe(z);r.renderbufferStorageMultisample(r.RENDERBUFFER,ct,He,z.width,z.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,ce.__webglColorRenderbuffer[Re])}r.bindRenderbuffer(r.RENDERBUFFER,null),z.depthBuffer&&(ce.__webglDepthRenderbuffer=r.createRenderbuffer(),pe(ce.__webglDepthRenderbuffer,z,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Ee){t.bindTexture(r.TEXTURE_CUBE_MAP,ge.__webglTexture),K(r.TEXTURE_CUBE_MAP,C);for(let Re=0;Re<6;Re++)if(C.mipmaps&&C.mipmaps.length>0)for(let Ce=0;Ce<C.mipmaps.length;Ce++)Q(ce.__webglFramebuffer[Re][Ce],z,C,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ce);else Q(ce.__webglFramebuffer[Re],z,C,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);S(C)&&x(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(We){for(let Re=0,Ce=Se.length;Re<Ce;Re++){const tt=Se[Re],be=s.get(tt);t.bindTexture(r.TEXTURE_2D,be.__webglTexture),K(r.TEXTURE_2D,tt),Q(ce.__webglFramebuffer,z,tt,r.COLOR_ATTACHMENT0+Re,r.TEXTURE_2D,0),S(tt)&&x(r.TEXTURE_2D)}t.unbindTexture()}else{let Re=r.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(Re=z.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Re,ge.__webglTexture),K(Re,C),C.mipmaps&&C.mipmaps.length>0)for(let Ce=0;Ce<C.mipmaps.length;Ce++)Q(ce.__webglFramebuffer[Ce],z,C,r.COLOR_ATTACHMENT0,Re,Ce);else Q(ce.__webglFramebuffer,z,C,r.COLOR_ATTACHMENT0,Re,0);S(C)&&x(Re),t.unbindTexture()}z.depthBuffer&&ve(z)}function Z(z){const C=z.textures;for(let ce=0,ge=C.length;ce<ge;ce++){const Se=C[ce];if(S(Se)){const Ee=z.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,We=s.get(Se).__webglTexture;t.bindTexture(Ee,We),x(Ee),t.unbindTexture()}}}const gt=[],Ae=[];function nt(z){if(z.samples>0){if(lt(z)===!1){const C=z.textures,ce=z.width,ge=z.height;let Se=r.COLOR_BUFFER_BIT;const Ee=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,We=s.get(z),Re=C.length>1;if(Re)for(let Ce=0;Ce<C.length;Ce++)t.bindFramebuffer(r.FRAMEBUFFER,We.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,We.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,We.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,We.__webglFramebuffer);for(let Ce=0;Ce<C.length;Ce++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(Se|=r.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(Se|=r.STENCIL_BUFFER_BIT)),Re){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,We.__webglColorRenderbuffer[Ce]);const tt=s.get(C[Ce]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,tt,0)}r.blitFramebuffer(0,0,ce,ge,0,0,ce,ge,Se,r.NEAREST),m===!0&&(gt.length=0,Ae.length=0,gt.push(r.COLOR_ATTACHMENT0+Ce),z.depthBuffer&&z.resolveDepthBuffer===!1&&(gt.push(Ee),Ae.push(Ee),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Ae)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Re)for(let Ce=0;Ce<C.length;Ce++){t.bindFramebuffer(r.FRAMEBUFFER,We.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,We.__webglColorRenderbuffer[Ce]);const tt=s.get(C[Ce]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,We.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,tt,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,We.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&m){const C=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[C])}}}function Xe(z){return Math.min(o.maxSamples,z.samples)}function lt(z){const C=s.get(z);return z.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function it(z){const C=d.render.frame;g.get(z)!==C&&(g.set(z,C),z.update())}function ot(z,C){const ce=z.colorSpace,ge=z.format,Se=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||ce!==Tr&&ce!==vr&&(At.getTransfer(ce)===Lt?(ge!==_i||Se!==Mr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ce)),C}function Tt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(p.width=z.naturalWidth||z.width,p.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(p.width=z.displayWidth,p.height=z.displayHeight):(p.width=z.width,p.height=z.height),p}this.allocateTextureUnit=D,this.resetTextureUnits=A,this.setTexture2D=j,this.setTexture2DArray=te,this.setTexture3D=oe,this.setTextureCube=he,this.rebindTextures=Le,this.setupRenderTarget=Fe,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=lt}function t1(r,e){function t(s,o=vr){let l;const d=At.getTransfer(o);if(s===Mr)return r.UNSIGNED_BYTE;if(s===Jg)return r.UNSIGNED_SHORT_4_4_4_4;if(s===Qg)return r.UNSIGNED_SHORT_5_5_5_1;if(s===Oy)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Iy)return r.BYTE;if(s===Fy)return r.SHORT;if(s===Kg)return r.UNSIGNED_SHORT;if(s===Zg)return r.INT;if(s===na)return r.UNSIGNED_INT;if(s===_r)return r.FLOAT;if(s===Ql)return r.HALF_FLOAT;if(s===ky)return r.ALPHA;if(s===zy)return r.RGB;if(s===_i)return r.RGBA;if(s===By)return r.LUMINANCE;if(s===jy)return r.LUMINANCE_ALPHA;if(s===Ks)return r.DEPTH_COMPONENT;if(s===eo)return r.DEPTH_STENCIL;if(s===Hy)return r.RED;if(s===ev)return r.RED_INTEGER;if(s===Vy)return r.RG;if(s===tv)return r.RG_INTEGER;if(s===nv)return r.RGBA_INTEGER;if(s===Wu||s===$u||s===Xu||s===qu)if(d===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(s===Wu)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===$u)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===qu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(s===Wu)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===$u)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===qu)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===rm||s===sm||s===am||s===om)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(s===rm)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===sm)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===am)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===om)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===lm||s===cm||s===um)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(s===lm||s===cm)return d===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(s===um)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===dm||s===fm||s===hm||s===pm||s===mm||s===gm||s===vm||s===_m||s===xm||s===ym||s===Sm||s===Mm||s===Em||s===wm)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(s===dm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===fm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===hm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===pm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===mm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===gm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===vm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===_m)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===xm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===ym)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Sm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Mm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Em)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===wm)return d===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Yu||s===Tm||s===Am)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(s===Yu)return d===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Tm)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Am)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Gy||s===bm||s===Cm||s===Rm)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(s===Yu)return l.COMPRESSED_RED_RGTC1_EXT;if(s===bm)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Cm)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Rm)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===no?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:t}}class n1 extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Za extends gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const i1={type:"move"};class Md{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Za,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Za,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new le,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new le),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Za,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new le,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new le),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const s of e.hand.values())this._getHandJoint(t,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,s){let o=null,l=null,d=null;const u=this._targetRay,m=this._grip,p=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(p&&e.hand){d=!0;for(const w of e.hand.values()){const S=t.getJointPose(w,s),x=this._getHandJoint(p,w);S!==null&&(x.matrix.fromArray(S.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=S.radius),x.visible=S!==null}const g=p.joints["index-finger-tip"],_=p.joints["thumb-tip"],y=g.position.distanceTo(_.position),M=.02,E=.005;p.inputState.pinching&&y>M+E?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&y<=M-E&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,s),l!==null&&(m.matrix.fromArray(l.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,l.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(l.linearVelocity)):m.hasLinearVelocity=!1,l.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(l.angularVelocity)):m.hasAngularVelocity=!1));u!==null&&(o=t.getPose(e.targetRaySpace,s),o===null&&l!==null&&(o=l),o!==null&&(u.matrix.fromArray(o.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,o.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(o.linearVelocity)):u.hasLinearVelocity=!1,o.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(o.angularVelocity)):u.hasAngularVelocity=!1,this.dispatchEvent(i1)))}return u!==null&&(u.visible=o!==null),m!==null&&(m.visible=l!==null),p!==null&&(p.visible=d!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const s=new Za;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[t.jointName]=s,e.add(s)}return e.joints[t.jointName]}}const r1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,s1=`
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

}`;class a1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,s){if(this.texture===null){const o=new Pn,l=e.properties.get(o);l.__webglTexture=t.texture,(t.depthNear!=s.depthNear||t.depthFar!=s.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}render(e,t){if(this.texture!==null){if(this.mesh===null){const s=t.cameras[0].viewport,o=new Er({vertexShader:r1,fragmentShader:s1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:s.z},depthHeight:{value:s.w}}});this.mesh=new xi(new tc(20,20),o)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class o1 extends sa{constructor(e,t){super();const s=this;let o=null,l=1,d=null,u="local-floor",m=1,p=null,g=null,_=null,y=null,M=null,E=null;const w=new a1,S=t.getContextAttributes();let x=null,L=null;const N=[],U=[],Y=new xt;let I=null;const k=new qn;k.layers.enable(1),k.viewport=new rn;const $=new qn;$.layers.enable(2),$.viewport=new rn;const R=[k,$],A=new n1;A.layers.enable(1),A.layers.enable(2);let D=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let pe=N[Q];return pe===void 0&&(pe=new Md,N[Q]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(Q){let pe=N[Q];return pe===void 0&&(pe=new Md,N[Q]=pe),pe.getGripSpace()},this.getHand=function(Q){let pe=N[Q];return pe===void 0&&(pe=new Md,N[Q]=pe),pe.getHandSpace()};function j(Q){const pe=U.indexOf(Q.inputSource);if(pe===-1)return;const Me=N[pe];Me!==void 0&&(Me.update(Q.inputSource,Q.frame,p||d),Me.dispatchEvent({type:Q.type,data:Q.inputSource}))}function te(){o.removeEventListener("select",j),o.removeEventListener("selectstart",j),o.removeEventListener("selectend",j),o.removeEventListener("squeeze",j),o.removeEventListener("squeezestart",j),o.removeEventListener("squeezeend",j),o.removeEventListener("end",te),o.removeEventListener("inputsourceschange",oe);for(let Q=0;Q<N.length;Q++){const pe=U[Q];pe!==null&&(U[Q]=null,N[Q].disconnect(pe))}D=null,W=null,w.reset(),e.setRenderTarget(x),M=null,y=null,_=null,o=null,L=null,De.stop(),s.isPresenting=!1,e.setPixelRatio(I),e.setSize(Y.width,Y.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){l=Q,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){u=Q,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||d},this.setReferenceSpace=function(Q){p=Q},this.getBaseLayer=function(){return y!==null?y:M},this.getBinding=function(){return _},this.getFrame=function(){return E},this.getSession=function(){return o},this.setSession=async function(Q){if(o=Q,o!==null){if(x=e.getRenderTarget(),o.addEventListener("select",j),o.addEventListener("selectstart",j),o.addEventListener("selectend",j),o.addEventListener("squeeze",j),o.addEventListener("squeezestart",j),o.addEventListener("squeezeend",j),o.addEventListener("end",te),o.addEventListener("inputsourceschange",oe),S.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(Y),o.renderState.layers===void 0){const pe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};M=new XRWebGLLayer(o,t,pe),o.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),L=new ns(M.framebufferWidth,M.framebufferHeight,{format:_i,type:Mr,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let pe=null,Me=null,ve=null;S.depth&&(ve=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=S.stencil?eo:Ks,Me=S.stencil?no:na);const Le={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:l};_=new XRWebGLBinding(o,t),y=_.createProjectionLayer(Le),o.updateRenderState({layers:[y]}),e.setPixelRatio(1),e.setSize(y.textureWidth,y.textureHeight,!1),L=new ns(y.textureWidth,y.textureHeight,{format:_i,type:Mr,depthTexture:new _v(y.textureWidth,y.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:y.ignoreDepthValues===!1})}L.isXRRenderTarget=!0,this.setFoveation(m),p=null,d=await o.requestReferenceSpace(u),De.setContext(o),De.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode};function oe(Q){for(let pe=0;pe<Q.removed.length;pe++){const Me=Q.removed[pe],ve=U.indexOf(Me);ve>=0&&(U[ve]=null,N[ve].disconnect(Me))}for(let pe=0;pe<Q.added.length;pe++){const Me=Q.added[pe];let ve=U.indexOf(Me);if(ve===-1){for(let Fe=0;Fe<N.length;Fe++)if(Fe>=U.length){U.push(Me),ve=Fe;break}else if(U[Fe]===null){U[Fe]=Me,ve=Fe;break}if(ve===-1)break}const Le=N[ve];Le&&Le.connect(Me)}}const he=new le,de=new le;function H(Q,pe,Me){he.setFromMatrixPosition(pe.matrixWorld),de.setFromMatrixPosition(Me.matrixWorld);const ve=he.distanceTo(de),Le=pe.projectionMatrix.elements,Fe=Me.projectionMatrix.elements,Z=Le[14]/(Le[10]-1),gt=Le[14]/(Le[10]+1),Ae=(Le[9]+1)/Le[5],nt=(Le[9]-1)/Le[5],Xe=(Le[8]-1)/Le[0],lt=(Fe[8]+1)/Fe[0],it=Z*Xe,ot=Z*lt,Tt=ve/(-Xe+lt),z=Tt*-Xe;pe.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(z),Q.translateZ(Tt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert();const C=Z+Tt,ce=gt+Tt,ge=it-z,Se=ot+(ve-z),Ee=Ae*gt/ce*C,We=nt*gt/ce*C;Q.projectionMatrix.makePerspective(ge,Se,Ee,We,C,ce),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}function B(Q,pe){pe===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(pe.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(o===null)return;w.texture!==null&&(Q.near=w.depthNear,Q.far=w.depthFar),A.near=$.near=k.near=Q.near,A.far=$.far=k.far=Q.far,(D!==A.near||W!==A.far)&&(o.updateRenderState({depthNear:A.near,depthFar:A.far}),D=A.near,W=A.far,k.near=D,k.far=W,$.near=D,$.far=W,k.updateProjectionMatrix(),$.updateProjectionMatrix(),Q.updateProjectionMatrix());const pe=Q.parent,Me=A.cameras;B(A,pe);for(let ve=0;ve<Me.length;ve++)B(Me[ve],pe);Me.length===2?H(A,k,$):A.projectionMatrix.copy(k.projectionMatrix),K(Q,A,pe)};function K(Q,pe,Me){Me===null?Q.matrix.copy(pe.matrixWorld):(Q.matrix.copy(Me.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(pe.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(pe.projectionMatrix),Q.projectionMatrixInverse.copy(pe.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Id*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(y===null&&M===null))return m},this.setFoveation=function(Q){m=Q,y!==null&&(y.fixedFoveation=Q),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=Q)},this.hasDepthSensing=function(){return w.texture!==null};let O=null;function ie(Q,pe){if(g=pe.getViewerPose(p||d),E=pe,g!==null){const Me=g.views;M!==null&&(e.setRenderTargetFramebuffer(L,M.framebuffer),e.setRenderTarget(L));let ve=!1;Me.length!==A.cameras.length&&(A.cameras.length=0,ve=!0);for(let Fe=0;Fe<Me.length;Fe++){const Z=Me[Fe];let gt=null;if(M!==null)gt=M.getViewport(Z);else{const nt=_.getViewSubImage(y,Z);gt=nt.viewport,Fe===0&&(e.setRenderTargetTextures(L,nt.colorTexture,y.ignoreDepthValues?void 0:nt.depthStencilTexture),e.setRenderTarget(L))}let Ae=R[Fe];Ae===void 0&&(Ae=new qn,Ae.layers.enable(Fe),Ae.viewport=new rn,R[Fe]=Ae),Ae.matrix.fromArray(Z.transform.matrix),Ae.matrix.decompose(Ae.position,Ae.quaternion,Ae.scale),Ae.projectionMatrix.fromArray(Z.projectionMatrix),Ae.projectionMatrixInverse.copy(Ae.projectionMatrix).invert(),Ae.viewport.set(gt.x,gt.y,gt.width,gt.height),Fe===0&&(A.matrix.copy(Ae.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),ve===!0&&A.cameras.push(Ae)}const Le=o.enabledFeatures;if(Le&&Le.includes("depth-sensing")){const Fe=_.getDepthInformation(Me[0]);Fe&&Fe.isValid&&Fe.texture&&w.init(e,Fe,o.renderState)}}for(let Me=0;Me<N.length;Me++){const ve=U[Me],Le=N[Me];ve!==null&&Le!==void 0&&Le.update(ve,pe,p||d)}w.render(e,A),O&&O(Q,pe),pe.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:pe}),E=null}const De=new gv;De.setAnimationLoop(ie),this.setAnimationLoop=function(Q){O=Q},this.dispose=function(){}}}const Wr=new Si,l1=new Bt;function c1(r,e){function t(S,x){S.matrixAutoUpdate===!0&&S.updateMatrix(),x.value.copy(S.matrix)}function s(S,x){x.color.getRGB(S.fogColor.value,hv(r)),x.isFog?(S.fogNear.value=x.near,S.fogFar.value=x.far):x.isFogExp2&&(S.fogDensity.value=x.density)}function o(S,x,L,N,U){x.isMeshBasicMaterial||x.isMeshLambertMaterial?l(S,x):x.isMeshToonMaterial?(l(S,x),_(S,x)):x.isMeshPhongMaterial?(l(S,x),g(S,x)):x.isMeshStandardMaterial?(l(S,x),y(S,x),x.isMeshPhysicalMaterial&&M(S,x,U)):x.isMeshMatcapMaterial?(l(S,x),E(S,x)):x.isMeshDepthMaterial?l(S,x):x.isMeshDistanceMaterial?(l(S,x),w(S,x)):x.isMeshNormalMaterial?l(S,x):x.isLineBasicMaterial?(d(S,x),x.isLineDashedMaterial&&u(S,x)):x.isPointsMaterial?m(S,x,L,N):x.isSpriteMaterial?p(S,x):x.isShadowMaterial?(S.color.value.copy(x.color),S.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function l(S,x){S.opacity.value=x.opacity,x.color&&S.diffuse.value.copy(x.color),x.emissive&&S.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.bumpMap&&(S.bumpMap.value=x.bumpMap,t(x.bumpMap,S.bumpMapTransform),S.bumpScale.value=x.bumpScale,x.side===Nn&&(S.bumpScale.value*=-1)),x.normalMap&&(S.normalMap.value=x.normalMap,t(x.normalMap,S.normalMapTransform),S.normalScale.value.copy(x.normalScale),x.side===Nn&&S.normalScale.value.negate()),x.displacementMap&&(S.displacementMap.value=x.displacementMap,t(x.displacementMap,S.displacementMapTransform),S.displacementScale.value=x.displacementScale,S.displacementBias.value=x.displacementBias),x.emissiveMap&&(S.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,S.emissiveMapTransform)),x.specularMap&&(S.specularMap.value=x.specularMap,t(x.specularMap,S.specularMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest);const L=e.get(x),N=L.envMap,U=L.envMapRotation;if(N&&(S.envMap.value=N,Wr.copy(U),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),S.envMapRotation.value.setFromMatrix4(l1.makeRotationFromEuler(Wr)),S.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=x.reflectivity,S.ior.value=x.ior,S.refractionRatio.value=x.refractionRatio),x.lightMap){S.lightMap.value=x.lightMap;const Y=r._useLegacyLights===!0?Math.PI:1;S.lightMapIntensity.value=x.lightMapIntensity*Y,t(x.lightMap,S.lightMapTransform)}x.aoMap&&(S.aoMap.value=x.aoMap,S.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,S.aoMapTransform))}function d(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform))}function u(S,x){S.dashSize.value=x.dashSize,S.totalSize.value=x.dashSize+x.gapSize,S.scale.value=x.scale}function m(S,x,L,N){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.size.value=x.size*L,S.scale.value=N*.5,x.map&&(S.map.value=x.map,t(x.map,S.uvTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function p(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.rotation.value=x.rotation,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function g(S,x){S.specular.value.copy(x.specular),S.shininess.value=Math.max(x.shininess,1e-4)}function _(S,x){x.gradientMap&&(S.gradientMap.value=x.gradientMap)}function y(S,x){S.metalness.value=x.metalness,x.metalnessMap&&(S.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,S.metalnessMapTransform)),S.roughness.value=x.roughness,x.roughnessMap&&(S.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,S.roughnessMapTransform)),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)}function M(S,x,L){S.ior.value=x.ior,x.sheen>0&&(S.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),S.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(S.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,S.sheenColorMapTransform)),x.sheenRoughnessMap&&(S.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,S.sheenRoughnessMapTransform))),x.clearcoat>0&&(S.clearcoat.value=x.clearcoat,S.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(S.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,S.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(S.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===Nn&&S.clearcoatNormalScale.value.negate())),x.dispersion>0&&(S.dispersion.value=x.dispersion),x.iridescence>0&&(S.iridescence.value=x.iridescence,S.iridescenceIOR.value=x.iridescenceIOR,S.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(S.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,S.iridescenceMapTransform)),x.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),x.transmission>0&&(S.transmission.value=x.transmission,S.transmissionSamplerMap.value=L.texture,S.transmissionSamplerSize.value.set(L.width,L.height),x.transmissionMap&&(S.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,S.transmissionMapTransform)),S.thickness.value=x.thickness,x.thicknessMap&&(S.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=x.attenuationDistance,S.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(S.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(S.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=x.specularIntensity,S.specularColor.value.copy(x.specularColor),x.specularColorMap&&(S.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,S.specularColorMapTransform)),x.specularIntensityMap&&(S.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,S.specularIntensityMapTransform))}function E(S,x){x.matcap&&(S.matcap.value=x.matcap)}function w(S,x){const L=e.get(x).light;S.referencePosition.value.setFromMatrixPosition(L.matrixWorld),S.nearDistance.value=L.shadow.camera.near,S.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:o}}function u1(r,e,t,s){let o={},l={},d=[];const u=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(L,N){const U=N.program;s.uniformBlockBinding(L,U)}function p(L,N){let U=o[L.id];U===void 0&&(E(L),U=g(L),o[L.id]=U,L.addEventListener("dispose",S));const Y=N.program;s.updateUBOMapping(L,Y);const I=e.render.frame;l[L.id]!==I&&(y(L),l[L.id]=I)}function g(L){const N=_();L.__bindingPointIndex=N;const U=r.createBuffer(),Y=L.__size,I=L.usage;return r.bindBuffer(r.UNIFORM_BUFFER,U),r.bufferData(r.UNIFORM_BUFFER,Y,I),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,N,U),U}function _(){for(let L=0;L<u;L++)if(d.indexOf(L)===-1)return d.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function y(L){const N=o[L.id],U=L.uniforms,Y=L.__cache;r.bindBuffer(r.UNIFORM_BUFFER,N);for(let I=0,k=U.length;I<k;I++){const $=Array.isArray(U[I])?U[I]:[U[I]];for(let R=0,A=$.length;R<A;R++){const D=$[R];if(M(D,I,R,Y)===!0){const W=D.__offset,j=Array.isArray(D.value)?D.value:[D.value];let te=0;for(let oe=0;oe<j.length;oe++){const he=j[oe],de=w(he);typeof he=="number"||typeof he=="boolean"?(D.__data[0]=he,r.bufferSubData(r.UNIFORM_BUFFER,W+te,D.__data)):he.isMatrix3?(D.__data[0]=he.elements[0],D.__data[1]=he.elements[1],D.__data[2]=he.elements[2],D.__data[3]=0,D.__data[4]=he.elements[3],D.__data[5]=he.elements[4],D.__data[6]=he.elements[5],D.__data[7]=0,D.__data[8]=he.elements[6],D.__data[9]=he.elements[7],D.__data[10]=he.elements[8],D.__data[11]=0):(he.toArray(D.__data,te),te+=de.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,W,D.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(L,N,U,Y){const I=L.value,k=N+"_"+U;if(Y[k]===void 0)return typeof I=="number"||typeof I=="boolean"?Y[k]=I:Y[k]=I.clone(),!0;{const $=Y[k];if(typeof I=="number"||typeof I=="boolean"){if($!==I)return Y[k]=I,!0}else if($.equals(I)===!1)return $.copy(I),!0}return!1}function E(L){const N=L.uniforms;let U=0;const Y=16;for(let k=0,$=N.length;k<$;k++){const R=Array.isArray(N[k])?N[k]:[N[k]];for(let A=0,D=R.length;A<D;A++){const W=R[A],j=Array.isArray(W.value)?W.value:[W.value];for(let te=0,oe=j.length;te<oe;te++){const he=j[te],de=w(he),H=U%Y;H!==0&&Y-H<de.boundary&&(U+=Y-H),W.__data=new Float32Array(de.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=U,U+=de.storage}}}const I=U%Y;return I>0&&(U+=Y-I),L.__size=U,L.__cache={},this}function w(L){const N={boundary:0,storage:0};return typeof L=="number"||typeof L=="boolean"?(N.boundary=4,N.storage=4):L.isVector2?(N.boundary=8,N.storage=8):L.isVector3||L.isColor?(N.boundary=16,N.storage=12):L.isVector4?(N.boundary=16,N.storage=16):L.isMatrix3?(N.boundary=48,N.storage=48):L.isMatrix4?(N.boundary=64,N.storage=64):L.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",L),N}function S(L){const N=L.target;N.removeEventListener("dispose",S);const U=d.indexOf(N.__bindingPointIndex);d.splice(U,1),r.deleteBuffer(o[N.id]),delete o[N.id],delete l[N.id]}function x(){for(const L in o)r.deleteBuffer(o[L]);d=[],o={},l={}}return{bind:m,update:p,dispose:x}}class d1{constructor(e={}){const{canvas:t=nS(),context:s=null,depth:o=!0,stencil:l=!1,alpha:d=!1,antialias:u=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:_=!1}=e;this.isWebGLRenderer=!0;let y;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=s.getContextAttributes().alpha}else y=d;const M=new Uint32Array(4),E=new Int32Array(4);let w=null,S=null;const x=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=pi,this._useLegacyLights=!1,this.toneMapping=yr,this.toneMappingExposure=1;const N=this;let U=!1,Y=0,I=0,k=null,$=-1,R=null;const A=new rn,D=new rn;let W=null;const j=new Et(0);let te=0,oe=t.width,he=t.height,de=1,H=null,B=null;const K=new rn(0,0,oe,he),O=new rn(0,0,oe,he);let ie=!1;const De=new Zd;let Q=!1,pe=!1;const Me=new Bt,ve=new le,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Fe(){return k===null?de:1}let Z=s;function gt(P,J){return t.getContext(P,J)}try{const P={alpha:!0,depth:o,stencil:l,antialias:u,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:_};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qd}`),t.addEventListener("webglcontextlost",b,!1),t.addEventListener("webglcontextrestored",V,!1),t.addEventListener("webglcontextcreationerror",q,!1),Z===null){const J="webgl2";if(Z=gt(J,P),Z===null)throw gt(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Ae,nt,Xe,lt,it,ot,Tt,z,C,ce,ge,Se,Ee,We,Re,Ce,tt,be,He,ct,qe,Ie,st,ht;function bt(){Ae=new xw(Z),Ae.init(),Ie=new t1(Z,Ae),nt=new hw(Z,Ae,e,Ie),Xe=new QT(Z),lt=new Mw(Z),it=new zT,ot=new e1(Z,Ae,Xe,it,nt,Ie,lt),Tt=new mw(N),z=new _w(N),C=new RS(Z),st=new dw(Z,C),ce=new yw(Z,C,lt,st),ge=new ww(Z,ce,C,lt),He=new Ew(Z,nt,ot),Ce=new pw(it),Se=new kT(N,Tt,z,Ae,nt,st,Ce),Ee=new c1(N,it),We=new jT,Re=new XT(Ae),be=new uw(N,Tt,z,Xe,ge,y,m),tt=new JT(N,ge,nt),ht=new u1(Z,lt,nt,Xe),ct=new fw(Z,Ae,lt),qe=new Sw(Z,Ae,lt),lt.programs=Se.programs,N.capabilities=nt,N.extensions=Ae,N.properties=it,N.renderLists=We,N.shadowMap=tt,N.state=Xe,N.info=lt}bt();const rt=new o1(N,Z);this.xr=rt,this.getContext=function(){return Z},this.getContextAttributes=function(){return Z.getContextAttributes()},this.forceContextLoss=function(){const P=Ae.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Ae.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(P){P!==void 0&&(de=P,this.setSize(oe,he,!1))},this.getSize=function(P){return P.set(oe,he)},this.setSize=function(P,J,ue=!0){if(rt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}oe=P,he=J,t.width=Math.floor(P*de),t.height=Math.floor(J*de),ue===!0&&(t.style.width=P+"px",t.style.height=J+"px"),this.setViewport(0,0,P,J)},this.getDrawingBufferSize=function(P){return P.set(oe*de,he*de).floor()},this.setDrawingBufferSize=function(P,J,ue){oe=P,he=J,de=ue,t.width=Math.floor(P*ue),t.height=Math.floor(J*ue),this.setViewport(0,0,P,J)},this.getCurrentViewport=function(P){return P.copy(A)},this.getViewport=function(P){return P.copy(K)},this.setViewport=function(P,J,ue,se){P.isVector4?K.set(P.x,P.y,P.z,P.w):K.set(P,J,ue,se),Xe.viewport(A.copy(K).multiplyScalar(de).round())},this.getScissor=function(P){return P.copy(O)},this.setScissor=function(P,J,ue,se){P.isVector4?O.set(P.x,P.y,P.z,P.w):O.set(P,J,ue,se),Xe.scissor(D.copy(O).multiplyScalar(de).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(P){Xe.setScissorTest(ie=P)},this.setOpaqueSort=function(P){H=P},this.setTransparentSort=function(P){B=P},this.getClearColor=function(P){return P.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor.apply(be,arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha.apply(be,arguments)},this.clear=function(P=!0,J=!0,ue=!0){let se=0;if(P){let re=!1;if(k!==null){const Ne=k.texture.format;re=Ne===nv||Ne===tv||Ne===ev}if(re){const Ne=k.texture.type,je=Ne===Mr||Ne===na||Ne===Kg||Ne===no||Ne===Jg||Ne===Qg,Ge=be.getClearColor(),Je=be.getClearAlpha(),at=Ge.r,ze=Ge.g,ut=Ge.b;je?(M[0]=at,M[1]=ze,M[2]=ut,M[3]=Je,Z.clearBufferuiv(Z.COLOR,0,M)):(E[0]=at,E[1]=ze,E[2]=ut,E[3]=Je,Z.clearBufferiv(Z.COLOR,0,E))}else se|=Z.COLOR_BUFFER_BIT}J&&(se|=Z.DEPTH_BUFFER_BIT),ue&&(se|=Z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z.clear(se)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",b,!1),t.removeEventListener("webglcontextrestored",V,!1),t.removeEventListener("webglcontextcreationerror",q,!1),We.dispose(),Re.dispose(),it.dispose(),Tt.dispose(),z.dispose(),ge.dispose(),st.dispose(),ht.dispose(),Se.dispose(),rt.dispose(),rt.removeEventListener("sessionstart",St),rt.removeEventListener("sessionend",Sn),Zt.stop()};function b(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function V(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const P=lt.autoReset,J=tt.enabled,ue=tt.autoUpdate,se=tt.needsUpdate,re=tt.type;bt(),lt.autoReset=P,tt.enabled=J,tt.autoUpdate=ue,tt.needsUpdate=se,tt.type=re}function q(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function fe(P){const J=P.target;J.removeEventListener("dispose",fe),_e(J)}function _e(P){Ye(P),it.remove(P)}function Ye(P){const J=it.get(P).programs;J!==void 0&&(J.forEach(function(ue){Se.releaseProgram(ue)}),P.isShaderMaterial&&Se.releaseShaderCache(P))}this.renderBufferDirect=function(P,J,ue,se,re,Ne){J===null&&(J=Le);const je=re.isMesh&&re.matrixWorld.determinant()<0,Ge=ic(P,J,ue,se,re);Xe.setMaterial(se,je);let Je=ue.index,at=1;if(se.wireframe===!0){if(Je=ce.getWireframeAttribute(ue),Je===void 0)return;at=2}const ze=ue.drawRange,ut=ue.attributes.position;let Dt=ze.start*at,Gt=(ze.start+ze.count)*at;Ne!==null&&(Dt=Math.max(Dt,Ne.start*at),Gt=Math.min(Gt,(Ne.start+Ne.count)*at)),Je!==null?(Dt=Math.max(Dt,0),Gt=Math.min(Gt,Je.count)):ut!=null&&(Dt=Math.max(Dt,0),Gt=Math.min(Gt,ut.count));const Jt=Gt-Dt;if(Jt<0||Jt===1/0)return;st.setup(re,se,Ge,ue,Je);let Zn,vt=ct;if(Je!==null&&(Zn=C.get(Je),vt=qe,vt.setIndex(Zn)),re.isMesh)se.wireframe===!0?(Xe.setLineWidth(se.wireframeLinewidth*Fe()),vt.setMode(Z.LINES)):vt.setMode(Z.TRIANGLES);else if(re.isLine){let Qe=se.linewidth;Qe===void 0&&(Qe=1),Xe.setLineWidth(Qe*Fe()),re.isLineSegments?vt.setMode(Z.LINES):re.isLineLoop?vt.setMode(Z.LINE_LOOP):vt.setMode(Z.LINE_STRIP)}else re.isPoints?vt.setMode(Z.POINTS):re.isSprite&&vt.setMode(Z.TRIANGLES);if(re.isBatchedMesh)re._multiDrawInstances!==null?vt.renderMultiDrawInstances(re._multiDrawStarts,re._multiDrawCounts,re._multiDrawCount,re._multiDrawInstances):vt.renderMultiDraw(re._multiDrawStarts,re._multiDrawCounts,re._multiDrawCount);else if(re.isInstancedMesh)vt.renderInstances(Dt,Jt,re.count);else if(ue.isInstancedBufferGeometry){const Qe=ue._maxInstanceCount!==void 0?ue._maxInstanceCount:1/0,ln=Math.min(ue.instanceCount,Qe);vt.renderInstances(Dt,Jt,ln)}else vt.render(Dt,Jt)};function $e(P,J,ue){P.transparent===!0&&P.side===gi&&P.forceSinglePass===!1?(P.side=Nn,P.needsUpdate=!0,Mi(P,J,ue),P.side=Sr,P.needsUpdate=!0,Mi(P,J,ue),P.side=gi):Mi(P,J,ue)}this.compile=function(P,J,ue=null){ue===null&&(ue=P),S=Re.get(ue),S.init(J),L.push(S),ue.traverseVisible(function(re){re.isLight&&re.layers.test(J.layers)&&(S.pushLight(re),re.castShadow&&S.pushShadow(re))}),P!==ue&&P.traverseVisible(function(re){re.isLight&&re.layers.test(J.layers)&&(S.pushLight(re),re.castShadow&&S.pushShadow(re))}),S.setupLights(N._useLegacyLights);const se=new Set;return P.traverse(function(re){const Ne=re.material;if(Ne)if(Array.isArray(Ne))for(let je=0;je<Ne.length;je++){const Ge=Ne[je];$e(Ge,ue,re),se.add(Ge)}else $e(Ne,ue,re),se.add(Ne)}),L.pop(),S=null,se},this.compileAsync=function(P,J,ue=null){const se=this.compile(P,J,ue);return new Promise(re=>{function Ne(){if(se.forEach(function(je){it.get(je).currentProgram.isReady()&&se.delete(je)}),se.size===0){re(P);return}setTimeout(Ne,10)}Ae.get("KHR_parallel_shader_compile")!==null?Ne():setTimeout(Ne,10)})};let pt=null;function Vt(P){pt&&pt(P)}function St(){Zt.stop()}function Sn(){Zt.start()}const Zt=new gv;Zt.setAnimationLoop(Vt),typeof self<"u"&&Zt.setContext(self),this.setAnimationLoop=function(P){pt=P,rt.setAnimationLoop(P),P===null?Zt.stop():Zt.start()},rt.addEventListener("sessionstart",St),rt.addEventListener("sessionend",Sn),this.render=function(P,J){if(J!==void 0&&J.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(J),J=rt.getCamera()),P.isScene===!0&&P.onBeforeRender(N,P,J,k),S=Re.get(P,L.length),S.init(J),L.push(S),Me.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),De.setFromProjectionMatrix(Me),pe=this.localClippingEnabled,Q=Ce.init(this.clippingPlanes,pe),w=We.get(P,x.length),w.init(),x.push(w),Vi(P,J,0,N.sortObjects),w.finish(),N.sortObjects===!0&&w.sort(H,B);const ue=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1;ue&&be.addToRenderList(w,P),this.info.render.frame++,Q===!0&&Ce.beginShadows();const se=S.state.shadowsArray;tt.render(se,P,J),Q===!0&&Ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const re=w.opaque,Ne=w.transmissive;if(S.setupLights(N._useLegacyLights),J.isArrayCamera){const je=J.cameras;if(Ne.length>0)for(let Ge=0,Je=je.length;Ge<Je;Ge++){const at=je[Ge];Gi(re,Ne,P,at)}ue&&be.render(P);for(let Ge=0,Je=je.length;Ge<Je;Ge++){const at=je[Ge];is(w,P,at,at.viewport)}}else Ne.length>0&&Gi(re,Ne,P,J),ue&&be.render(P),is(w,P,J);k!==null&&(ot.updateMultisampleRenderTarget(k),ot.updateRenderTargetMipmap(k)),P.isScene===!0&&P.onAfterRender(N,P,J),st.resetDefaultState(),$=-1,R=null,L.pop(),L.length>0?(S=L[L.length-1],Q===!0&&Ce.setGlobalState(N.clippingPlanes,S.state.camera)):S=null,x.pop(),x.length>0?w=x[x.length-1]:w=null};function Vi(P,J,ue,se){if(P.visible===!1)return;if(P.layers.test(J.layers)){if(P.isGroup)ue=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(J);else if(P.isLight)S.pushLight(P),P.castShadow&&S.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||De.intersectsSprite(P)){se&&ve.setFromMatrixPosition(P.matrixWorld).applyMatrix4(Me);const je=ge.update(P),Ge=P.material;Ge.visible&&w.push(P,je,Ge,ue,ve.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||De.intersectsObject(P))){const je=ge.update(P),Ge=P.material;if(se&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),ve.copy(P.boundingSphere.center)):(je.boundingSphere===null&&je.computeBoundingSphere(),ve.copy(je.boundingSphere.center)),ve.applyMatrix4(P.matrixWorld).applyMatrix4(Me)),Array.isArray(Ge)){const Je=je.groups;for(let at=0,ze=Je.length;at<ze;at++){const ut=Je[at],Dt=Ge[ut.materialIndex];Dt&&Dt.visible&&w.push(P,je,Dt,ue,ve.z,ut)}}else Ge.visible&&w.push(P,je,Ge,ue,ve.z,null)}}const Ne=P.children;for(let je=0,Ge=Ne.length;je<Ge;je++)Vi(Ne[je],J,ue,se)}function is(P,J,ue,se){const re=P.opaque,Ne=P.transmissive,je=P.transparent;S.setupLightsView(ue),Q===!0&&Ce.setGlobalState(N.clippingPlanes,ue),se&&Xe.viewport(A.copy(se)),re.length>0&&rs(re,J,ue),Ne.length>0&&rs(Ne,J,ue),je.length>0&&rs(je,J,ue),Xe.buffers.depth.setTest(!0),Xe.buffers.depth.setMask(!0),Xe.buffers.color.setMask(!0),Xe.setPolygonOffset(!1)}function Gi(P,J,ue,se){if((ue.isScene===!0?ue.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[se.id]===void 0&&(S.state.transmissionRenderTarget[se.id]=new ns(1,1,{generateMipmaps:!0,type:Ae.has("EXT_color_buffer_half_float")||Ae.has("EXT_color_buffer_float")?Ql:Mr,minFilter:Jr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1}));const Ne=S.state.transmissionRenderTarget[se.id],je=se.viewport||A;Ne.setSize(je.z,je.w);const Ge=N.getRenderTarget();N.setRenderTarget(Ne),N.getClearColor(j),te=N.getClearAlpha(),te<1&&N.setClearColor(16777215,.5),N.clear();const Je=N.toneMapping;N.toneMapping=yr;const at=se.viewport;if(se.viewport!==void 0&&(se.viewport=void 0),S.setupLightsView(se),Q===!0&&Ce.setGlobalState(N.clippingPlanes,se),rs(P,ue,se),ot.updateMultisampleRenderTarget(Ne),ot.updateRenderTargetMipmap(Ne),Ae.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let ut=0,Dt=J.length;ut<Dt;ut++){const Gt=J[ut],Jt=Gt.object,Zn=Gt.geometry,vt=Gt.material,Qe=Gt.group;if(vt.side===gi&&Jt.layers.test(se.layers)){const ln=vt.side;vt.side=Nn,vt.needsUpdate=!0,Wi(Jt,ue,se,Zn,vt,Qe),vt.side=ln,vt.needsUpdate=!0,ze=!0}}ze===!0&&(ot.updateMultisampleRenderTarget(Ne),ot.updateRenderTargetMipmap(Ne))}N.setRenderTarget(Ge),N.setClearColor(j,te),at!==void 0&&(se.viewport=at),N.toneMapping=Je}function rs(P,J,ue){const se=J.isScene===!0?J.overrideMaterial:null;for(let re=0,Ne=P.length;re<Ne;re++){const je=P[re],Ge=je.object,Je=je.geometry,at=se===null?je.material:se,ze=je.group;Ge.layers.test(ue.layers)&&Wi(Ge,J,ue,Je,at,ze)}}function Wi(P,J,ue,se,re,Ne){P.onBeforeRender(N,J,ue,se,re,Ne),P.modelViewMatrix.multiplyMatrices(ue.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),re.onBeforeRender(N,J,ue,se,P,Ne),re.transparent===!0&&re.side===gi&&re.forceSinglePass===!1?(re.side=Nn,re.needsUpdate=!0,N.renderBufferDirect(ue,J,se,re,P,Ne),re.side=Sr,re.needsUpdate=!0,N.renderBufferDirect(ue,J,se,re,P,Ne),re.side=gi):N.renderBufferDirect(ue,J,se,re,P,Ne),P.onAfterRender(N,J,ue,se,re,Ne)}function Mi(P,J,ue){J.isScene!==!0&&(J=Le);const se=it.get(P),re=S.state.lights,Ne=S.state.shadowsArray,je=re.state.version,Ge=Se.getParameters(P,re.state,Ne,J,ue),Je=Se.getProgramCacheKey(Ge);let at=se.programs;se.environment=P.isMeshStandardMaterial?J.environment:null,se.fog=J.fog,se.envMap=(P.isMeshStandardMaterial?z:Tt).get(P.envMap||se.environment),se.envMapRotation=se.environment!==null&&P.envMap===null?J.environmentRotation:P.envMapRotation,at===void 0&&(P.addEventListener("dispose",fe),at=new Map,se.programs=at);let ze=at.get(Je);if(ze!==void 0){if(se.currentProgram===ze&&se.lightsStateVersion===je)return ss(P,Ge),ze}else Ge.uniforms=Se.getUniforms(P),P.onBuild(ue,Ge,N),P.onBeforeCompile(Ge,N),ze=Se.acquireProgram(Ge,Je),at.set(Je,ze),se.uniforms=Ge.uniforms;const ut=se.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(ut.clippingPlanes=Ce.uniform),ss(P,Ge),se.needsLights=sc(P),se.lightsStateVersion=je,se.needsLights&&(ut.ambientLightColor.value=re.state.ambient,ut.lightProbe.value=re.state.probe,ut.directionalLights.value=re.state.directional,ut.directionalLightShadows.value=re.state.directionalShadow,ut.spotLights.value=re.state.spot,ut.spotLightShadows.value=re.state.spotShadow,ut.rectAreaLights.value=re.state.rectArea,ut.ltc_1.value=re.state.rectAreaLTC1,ut.ltc_2.value=re.state.rectAreaLTC2,ut.pointLights.value=re.state.point,ut.pointLightShadows.value=re.state.pointShadow,ut.hemisphereLights.value=re.state.hemi,ut.directionalShadowMap.value=re.state.directionalShadowMap,ut.directionalShadowMatrix.value=re.state.directionalShadowMatrix,ut.spotShadowMap.value=re.state.spotShadowMap,ut.spotLightMatrix.value=re.state.spotLightMatrix,ut.spotLightMap.value=re.state.spotLightMap,ut.pointShadowMap.value=re.state.pointShadowMap,ut.pointShadowMatrix.value=re.state.pointShadowMatrix),se.currentProgram=ze,se.uniformsList=null,ze}function Ar(P){if(P.uniformsList===null){const J=P.currentProgram.getUniforms();P.uniformsList=Ol.seqWithValue(J.seq,P.uniforms)}return P.uniformsList}function ss(P,J){const ue=it.get(P);ue.outputColorSpace=J.outputColorSpace,ue.batching=J.batching,ue.instancing=J.instancing,ue.instancingColor=J.instancingColor,ue.instancingMorph=J.instancingMorph,ue.skinning=J.skinning,ue.morphTargets=J.morphTargets,ue.morphNormals=J.morphNormals,ue.morphColors=J.morphColors,ue.morphTargetsCount=J.morphTargetsCount,ue.numClippingPlanes=J.numClippingPlanes,ue.numIntersection=J.numClipIntersection,ue.vertexAlphas=J.vertexAlphas,ue.vertexTangents=J.vertexTangents,ue.toneMapping=J.toneMapping}function ic(P,J,ue,se,re){J.isScene!==!0&&(J=Le),ot.resetTextureUnits();const Ne=J.fog,je=se.isMeshStandardMaterial?J.environment:null,Ge=k===null?N.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Tr,Je=(se.isMeshStandardMaterial?z:Tt).get(se.envMap||je),at=se.vertexColors===!0&&!!ue.attributes.color&&ue.attributes.color.itemSize===4,ze=!!ue.attributes.tangent&&(!!se.normalMap||se.anisotropy>0),ut=!!ue.morphAttributes.position,Dt=!!ue.morphAttributes.normal,Gt=!!ue.morphAttributes.color;let Jt=yr;se.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(Jt=N.toneMapping);const Zn=ue.morphAttributes.position||ue.morphAttributes.normal||ue.morphAttributes.color,vt=Zn!==void 0?Zn.length:0,Qe=it.get(se),ln=S.state.lights;if(Q===!0&&(pe===!0||P!==R)){const sn=P===R&&se.id===$;Ce.setState(se,P,sn)}let Ct=!1;se.version===Qe.__version?(Qe.needsLights&&Qe.lightsStateVersion!==ln.state.version||Qe.outputColorSpace!==Ge||re.isBatchedMesh&&Qe.batching===!1||!re.isBatchedMesh&&Qe.batching===!0||re.isInstancedMesh&&Qe.instancing===!1||!re.isInstancedMesh&&Qe.instancing===!0||re.isSkinnedMesh&&Qe.skinning===!1||!re.isSkinnedMesh&&Qe.skinning===!0||re.isInstancedMesh&&Qe.instancingColor===!0&&re.instanceColor===null||re.isInstancedMesh&&Qe.instancingColor===!1&&re.instanceColor!==null||re.isInstancedMesh&&Qe.instancingMorph===!0&&re.morphTexture===null||re.isInstancedMesh&&Qe.instancingMorph===!1&&re.morphTexture!==null||Qe.envMap!==Je||se.fog===!0&&Qe.fog!==Ne||Qe.numClippingPlanes!==void 0&&(Qe.numClippingPlanes!==Ce.numPlanes||Qe.numIntersection!==Ce.numIntersection)||Qe.vertexAlphas!==at||Qe.vertexTangents!==ze||Qe.morphTargets!==ut||Qe.morphNormals!==Dt||Qe.morphColors!==Gt||Qe.toneMapping!==Jt||Qe.morphTargetsCount!==vt)&&(Ct=!0):(Ct=!0,Qe.__version=se.version);let Wt=Qe.currentProgram;Ct===!0&&(Wt=Mi(se,J,re));let oo=!1,br=!1,la=!1;const kt=Wt.getUniforms(),Ln=Qe.uniforms;if(Xe.useProgram(Wt.program)&&(oo=!0,br=!0,la=!0),se.id!==$&&($=se.id,br=!0),oo||R!==P){kt.setValue(Z,"projectionMatrix",P.projectionMatrix),kt.setValue(Z,"viewMatrix",P.matrixWorldInverse);const sn=kt.map.cameraPosition;sn!==void 0&&sn.setValue(Z,ve.setFromMatrixPosition(P.matrixWorld)),nt.logarithmicDepthBuffer&&kt.setValue(Z,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(se.isMeshPhongMaterial||se.isMeshToonMaterial||se.isMeshLambertMaterial||se.isMeshBasicMaterial||se.isMeshStandardMaterial||se.isShaderMaterial)&&kt.setValue(Z,"isOrthographic",P.isOrthographicCamera===!0),R!==P&&(R=P,br=!0,la=!0)}if(re.isSkinnedMesh){kt.setOptional(Z,re,"bindMatrix"),kt.setOptional(Z,re,"bindMatrixInverse");const sn=re.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),kt.setValue(Z,"boneTexture",sn.boneTexture,ot))}re.isBatchedMesh&&(kt.setOptional(Z,re,"batchingTexture"),kt.setValue(Z,"batchingTexture",re._matricesTexture,ot));const Ei=ue.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&He.update(re,ue,Wt),(br||Qe.receiveShadow!==re.receiveShadow)&&(Qe.receiveShadow=re.receiveShadow,kt.setValue(Z,"receiveShadow",re.receiveShadow)),se.isMeshGouraudMaterial&&se.envMap!==null&&(Ln.envMap.value=Je,Ln.flipEnvMap.value=Je.isCubeTexture&&Je.isRenderTargetTexture===!1?-1:1),se.isMeshStandardMaterial&&se.envMap===null&&J.environment!==null&&(Ln.envMapIntensity.value=J.environmentIntensity),br&&(kt.setValue(Z,"toneMappingExposure",N.toneMappingExposure),Qe.needsLights&&rc(Ln,la),Ne&&se.fog===!0&&Ee.refreshFogUniforms(Ln,Ne),Ee.refreshMaterialUniforms(Ln,se,de,he,S.state.transmissionRenderTarget[P.id]),Ol.upload(Z,Ar(Qe),Ln,ot)),se.isShaderMaterial&&se.uniformsNeedUpdate===!0&&(Ol.upload(Z,Ar(Qe),Ln,ot),se.uniformsNeedUpdate=!1),se.isSpriteMaterial&&kt.setValue(Z,"center",re.center),kt.setValue(Z,"modelViewMatrix",re.modelViewMatrix),kt.setValue(Z,"normalMatrix",re.normalMatrix),kt.setValue(Z,"modelMatrix",re.matrixWorld),se.isShaderMaterial||se.isRawShaderMaterial){const sn=se.uniformsGroups;for(let ca=0,ac=sn.length;ca<ac;ca++){const as=sn[ca];ht.update(as,Wt),ht.bind(as,Wt)}}return Wt}function rc(P,J){P.ambientLightColor.needsUpdate=J,P.lightProbe.needsUpdate=J,P.directionalLights.needsUpdate=J,P.directionalLightShadows.needsUpdate=J,P.pointLights.needsUpdate=J,P.pointLightShadows.needsUpdate=J,P.spotLights.needsUpdate=J,P.spotLightShadows.needsUpdate=J,P.rectAreaLights.needsUpdate=J,P.hemisphereLights.needsUpdate=J}function sc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(P,J,ue){it.get(P.texture).__webglTexture=J,it.get(P.depthTexture).__webglTexture=ue;const se=it.get(P);se.__hasExternalTextures=!0,se.__autoAllocateDepthBuffer=ue===void 0,se.__autoAllocateDepthBuffer||Ae.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),se.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,J){const ue=it.get(P);ue.__webglFramebuffer=J,ue.__useDefaultFramebuffer=J===void 0},this.setRenderTarget=function(P,J=0,ue=0){k=P,Y=J,I=ue;let se=!0,re=null,Ne=!1,je=!1;if(P){const Je=it.get(P);Je.__useDefaultFramebuffer!==void 0?(Xe.bindFramebuffer(Z.FRAMEBUFFER,null),se=!1):Je.__webglFramebuffer===void 0?ot.setupRenderTarget(P):Je.__hasExternalTextures&&ot.rebindTextures(P,it.get(P.texture).__webglTexture,it.get(P.depthTexture).__webglTexture);const at=P.texture;(at.isData3DTexture||at.isDataArrayTexture||at.isCompressedArrayTexture)&&(je=!0);const ze=it.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(ze[J])?re=ze[J][ue]:re=ze[J],Ne=!0):P.samples>0&&ot.useMultisampledRTT(P)===!1?re=it.get(P).__webglMultisampledFramebuffer:Array.isArray(ze)?re=ze[ue]:re=ze,A.copy(P.viewport),D.copy(P.scissor),W=P.scissorTest}else A.copy(K).multiplyScalar(de).floor(),D.copy(O).multiplyScalar(de).floor(),W=ie;if(Xe.bindFramebuffer(Z.FRAMEBUFFER,re)&&se&&Xe.drawBuffers(P,re),Xe.viewport(A),Xe.scissor(D),Xe.setScissorTest(W),Ne){const Je=it.get(P.texture);Z.framebufferTexture2D(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_CUBE_MAP_POSITIVE_X+J,Je.__webglTexture,ue)}else if(je){const Je=it.get(P.texture),at=J||0;Z.framebufferTextureLayer(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Je.__webglTexture,ue||0,at)}$=-1},this.readRenderTargetPixels=function(P,J,ue,se,re,Ne,je){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ge=it.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&je!==void 0&&(Ge=Ge[je]),Ge){Xe.bindFramebuffer(Z.FRAMEBUFFER,Ge);try{const Je=P.texture,at=Je.format,ze=Je.type;if(!nt.textureFormatReadable(at)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=P.width-se&&ue>=0&&ue<=P.height-re&&Z.readPixels(J,ue,se,re,Ie.convert(at),Ie.convert(ze),Ne)}finally{const Je=k!==null?it.get(k).__webglFramebuffer:null;Xe.bindFramebuffer(Z.FRAMEBUFFER,Je)}}},this.copyFramebufferToTexture=function(P,J,ue=0){const se=Math.pow(2,-ue),re=Math.floor(J.image.width*se),Ne=Math.floor(J.image.height*se);ot.setTexture2D(J,0),Z.copyTexSubImage2D(Z.TEXTURE_2D,ue,0,0,P.x,P.y,re,Ne),Xe.unbindTexture()},this.copyTextureToTexture=function(P,J,ue,se=0){const re=J.image.width,Ne=J.image.height,je=Ie.convert(ue.format),Ge=Ie.convert(ue.type);ot.setTexture2D(ue,0),Z.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,ue.flipY),Z.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ue.premultiplyAlpha),Z.pixelStorei(Z.UNPACK_ALIGNMENT,ue.unpackAlignment),J.isDataTexture?Z.texSubImage2D(Z.TEXTURE_2D,se,P.x,P.y,re,Ne,je,Ge,J.image.data):J.isCompressedTexture?Z.compressedTexSubImage2D(Z.TEXTURE_2D,se,P.x,P.y,J.mipmaps[0].width,J.mipmaps[0].height,je,J.mipmaps[0].data):Z.texSubImage2D(Z.TEXTURE_2D,se,P.x,P.y,je,Ge,J.image),se===0&&ue.generateMipmaps&&Z.generateMipmap(Z.TEXTURE_2D),Xe.unbindTexture()},this.copyTextureToTexture3D=function(P,J,ue,se,re=0){const Ne=P.max.x-P.min.x,je=P.max.y-P.min.y,Ge=P.max.z-P.min.z,Je=Ie.convert(se.format),at=Ie.convert(se.type);let ze;if(se.isData3DTexture)ot.setTexture3D(se,0),ze=Z.TEXTURE_3D;else if(se.isDataArrayTexture||se.isCompressedArrayTexture)ot.setTexture2DArray(se,0),ze=Z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Z.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,se.flipY),Z.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,se.premultiplyAlpha),Z.pixelStorei(Z.UNPACK_ALIGNMENT,se.unpackAlignment);const ut=Z.getParameter(Z.UNPACK_ROW_LENGTH),Dt=Z.getParameter(Z.UNPACK_IMAGE_HEIGHT),Gt=Z.getParameter(Z.UNPACK_SKIP_PIXELS),Jt=Z.getParameter(Z.UNPACK_SKIP_ROWS),Zn=Z.getParameter(Z.UNPACK_SKIP_IMAGES),vt=ue.isCompressedTexture?ue.mipmaps[re]:ue.image;Z.pixelStorei(Z.UNPACK_ROW_LENGTH,vt.width),Z.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,vt.height),Z.pixelStorei(Z.UNPACK_SKIP_PIXELS,P.min.x),Z.pixelStorei(Z.UNPACK_SKIP_ROWS,P.min.y),Z.pixelStorei(Z.UNPACK_SKIP_IMAGES,P.min.z),ue.isDataTexture||ue.isData3DTexture?Z.texSubImage3D(ze,re,J.x,J.y,J.z,Ne,je,Ge,Je,at,vt.data):se.isCompressedArrayTexture?Z.compressedTexSubImage3D(ze,re,J.x,J.y,J.z,Ne,je,Ge,Je,vt.data):Z.texSubImage3D(ze,re,J.x,J.y,J.z,Ne,je,Ge,Je,at,vt),Z.pixelStorei(Z.UNPACK_ROW_LENGTH,ut),Z.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,Dt),Z.pixelStorei(Z.UNPACK_SKIP_PIXELS,Gt),Z.pixelStorei(Z.UNPACK_SKIP_ROWS,Jt),Z.pixelStorei(Z.UNPACK_SKIP_IMAGES,Zn),re===0&&se.generateMipmaps&&Z.generateMipmap(ze),Xe.unbindTexture()},this.initTexture=function(P){P.isCubeTexture?ot.setTextureCube(P,0):P.isData3DTexture?ot.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?ot.setTexture2DArray(P,0):ot.setTexture2D(P,0),Xe.unbindTexture()},this.resetState=function(){Y=0,I=0,k=null,Xe.reset(),st.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Yd?"display-p3":"srgb",t.unpackColorSpace=At.workingColorSpace===ec?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class f1 extends gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class h1 extends so{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=iv,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const yg={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class p1{constructor(e,t,s){const o=this;let l=!1,d=0,u=0,m;const p=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=s,this.itemStart=function(g){u++,l===!1&&o.onStart!==void 0&&o.onStart(g,d,u),l=!0},this.itemEnd=function(g){d++,o.onProgress!==void 0&&o.onProgress(g,d,u),d===u&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(g){o.onError!==void 0&&o.onError(g)},this.resolveURL=function(g){return m?m(g):g},this.setURLModifier=function(g){return m=g,this},this.addHandler=function(g,_){return p.push(g,_),this},this.removeHandler=function(g){const _=p.indexOf(g);return _!==-1&&p.splice(_,2),this},this.getHandler=function(g){for(let _=0,y=p.length;_<y;_+=2){const M=p[_],E=p[_+1];if(M.global&&(M.lastIndex=0),M.test(g))return E}return null}}}const m1=new p1;class Qd{constructor(e){this.manager=e!==void 0?e:m1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const s=this;return new Promise(function(o,l){s.load(e,o,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Qd.DEFAULT_MATERIAL_NAME="__DEFAULT";const Oi={};class g1 extends Error{constructor(e,t){super(e),this.response=t}}class v1 extends Qd{constructor(e){super(e)}load(e,t,s,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=yg.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0),l;if(Oi[e]!==void 0){Oi[e].push({onLoad:t,onProgress:s,onError:o});return}Oi[e]=[],Oi[e].push({onLoad:t,onProgress:s,onError:o});const d=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),u=this.mimeType,m=this.responseType;fetch(d).then(p=>{if(p.status===200||p.status===0){if(p.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||p.body===void 0||p.body.getReader===void 0)return p;const g=Oi[e],_=p.body.getReader(),y=p.headers.get("X-File-Size")||p.headers.get("Content-Length"),M=y?parseInt(y):0,E=M!==0;let w=0;const S=new ReadableStream({start(x){L();function L(){_.read().then(({done:N,value:U})=>{if(N)x.close();else{w+=U.byteLength;const Y=new ProgressEvent("progress",{lengthComputable:E,loaded:w,total:M});for(let I=0,k=g.length;I<k;I++){const $=g[I];$.onProgress&&$.onProgress(Y)}x.enqueue(U),L()}})}}});return new Response(S)}else throw new g1(`fetch for "${p.url}" responded with ${p.status}: ${p.statusText}`,p)}).then(p=>{switch(m){case"arraybuffer":return p.arrayBuffer();case"blob":return p.blob();case"document":return p.text().then(g=>new DOMParser().parseFromString(g,u));case"json":return p.json();default:if(u===void 0)return p.text();{const _=/charset="?([^;"\s]*)"?/i.exec(u),y=_&&_[1]?_[1].toLowerCase():void 0,M=new TextDecoder(y);return p.arrayBuffer().then(E=>M.decode(E))}}}).then(p=>{yg.add(e,p);const g=Oi[e];delete Oi[e];for(let _=0,y=g.length;_<y;_++){const M=g[_];M.onLoad&&M.onLoad(p)}}).catch(p=>{const g=Oi[e];if(g===void 0)throw this.manager.itemError(e),p;delete Oi[e];for(let _=0,y=g.length;_<y;_++){const M=g[_];M.onError&&M.onError(p)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class wv extends gn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Ed=new Bt,Sg=new le,Mg=new le;class _1{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new Bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zd,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,s=this.matrix;Sg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sg),Mg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mg),t.updateMatrixWorld(),Ed.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ed),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(Ed)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class x1 extends _1{constructor(){super(new vv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class y1 extends wv{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.target=new gn,this.shadow=new x1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class S1 extends wv{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qd);class M1 extends Qd{constructor(e){super(e)}load(e,t,s,o){const l=this,d=new v1(this.manager);d.setPath(this.path),d.setResponseType("arraybuffer"),d.setRequestHeader(this.requestHeader),d.setWithCredentials(this.withCredentials),d.load(e,function(u){try{t(l.parse(u))}catch(m){o?o(m):console.error(m),l.manager.itemError(e)}},s,o)}parse(e){function t(p){const g=new DataView(p),_=32/8*3+32/8*3*3+16/8,y=g.getUint32(80,!0);if(80+32/8+y*_===g.byteLength)return!0;const E=[115,111,108,105,100];for(let w=0;w<5;w++)if(s(E,g,w))return!1;return!0}function s(p,g,_){for(let y=0,M=p.length;y<M;y++)if(p[y]!==g.getUint8(_+y))return!1;return!0}function o(p){const g=new DataView(p),_=g.getUint32(80,!0);let y,M,E,w=!1,S,x,L,N,U;for(let D=0;D<70;D++)g.getUint32(D,!1)==1129270351&&g.getUint8(D+4)==82&&g.getUint8(D+5)==61&&(w=!0,S=new Float32Array(_*3*3),x=g.getUint8(D+6)/255,L=g.getUint8(D+7)/255,N=g.getUint8(D+8)/255,U=g.getUint8(D+9)/255);const Y=84,I=50,k=new Hi,$=new Float32Array(_*3*3),R=new Float32Array(_*3*3),A=new Et;for(let D=0;D<_;D++){const W=Y+D*I,j=g.getFloat32(W,!0),te=g.getFloat32(W+4,!0),oe=g.getFloat32(W+8,!0);if(w){const he=g.getUint16(W+48,!0);(he&32768)===0?(y=(he&31)/31,M=(he>>5&31)/31,E=(he>>10&31)/31):(y=x,M=L,E=N)}for(let he=1;he<=3;he++){const de=W+he*12,H=D*3*3+(he-1)*3;$[H]=g.getFloat32(de,!0),$[H+1]=g.getFloat32(de+4,!0),$[H+2]=g.getFloat32(de+8,!0),R[H]=j,R[H+1]=te,R[H+2]=oe,w&&(A.set(y,M,E).convertSRGBToLinear(),S[H]=A.r,S[H+1]=A.g,S[H+2]=A.b)}}return k.setAttribute("position",new Bn($,3)),k.setAttribute("normal",new Bn(R,3)),w&&(k.setAttribute("color",new Bn(S,3)),k.hasColors=!0,k.alpha=U),k}function l(p){const g=new Hi,_=/solid([\s\S]*?)endsolid/g,y=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let E=0;const w=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,S=new RegExp("vertex"+w+w+w,"g"),x=new RegExp("normal"+w+w+w,"g"),L=[],N=[],U=[],Y=new le;let I,k=0,$=0,R=0;for(;(I=_.exec(p))!==null;){$=R;const A=I[0],D=(I=M.exec(A))!==null?I[1]:"";for(U.push(D);(I=y.exec(A))!==null;){let te=0,oe=0;const he=I[0];for(;(I=x.exec(he))!==null;)Y.x=parseFloat(I[1]),Y.y=parseFloat(I[2]),Y.z=parseFloat(I[3]),oe++;for(;(I=S.exec(he))!==null;)L.push(parseFloat(I[1]),parseFloat(I[2]),parseFloat(I[3])),N.push(Y.x,Y.y,Y.z),te++,R++;oe!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+E),te!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+E),E++}const W=$,j=R-$;g.userData.groupNames=U,g.addGroup(W,j,k),k++}return g.setAttribute("position",new Bi(L,3)),g.setAttribute("normal",new Bi(N,3)),g}function d(p){return typeof p!="string"?new TextDecoder().decode(p):p}function u(p){if(typeof p=="string"){const g=new Uint8Array(p.length);for(let _=0;_<p.length;_++)g[_]=p.charCodeAt(_)&255;return g.buffer||g}else return p}const m=u(e);return t(m)?o(m):l(d(e))}}function E1({src:r}){const e=me.useRef(null);return me.useEffect(()=>{const t=e.current;if(!t||!r)return;let s=!1;const o=document.createElement("canvas");o.style.display="block",o.style.width="100%",o.style.height="100%",t.replaceChildren(o);const l=new d1({canvas:o,antialias:!0,alpha:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2));const d=new f1,u=new qn(45,1,.01,100);u.position.set(0,0,2.2),d.add(new S1(16777215,.85));const m=new y1(16777215,.65);m.position.set(2,3,4),d.add(m);const p=new Za;d.add(p);const g=new h1({color:10135740,metalness:.05,roughness:.72,side:gi}),_=new M1;let y=null,M=0,E=!1,w=0,S=0,x=0;const L=R=>{const A=new aa().setFromObject(R),D=A.getSize(new le),W=A.getCenter(new le),te=1.5/Math.max(D.x,D.y,D.z,1e-6);R.scale.setScalar(te),R.position.sub(W.multiplyScalar(te))},N=()=>{const R=t.clientWidth||1,A=t.clientHeight||1;l.setSize(R,A,!1),u.aspect=R/A,u.updateProjectionMatrix()},U=()=>{s||(E||(S+=.004),p.rotation.y=S,p.rotation.x=x,l.render(d,u),M=requestAnimationFrame(U))},Y=R=>{R.button===0&&(E=!0,w=R.clientX,o.setPointerCapture(R.pointerId))},I=R=>{if(!E)return;const A=R.clientX-w;w=R.clientX,S+=A*.012},k=()=>{E=!1};o.addEventListener("pointerdown",Y),o.addEventListener("pointermove",I),o.addEventListener("pointerup",k),o.addEventListener("pointercancel",k);const $=new ResizeObserver(()=>N());return $.observe(t),N(),_.loadAsync(r).then(R=>{if(s){R.dispose();return}R.computeVertexNormals(),y=new xi(R,g),p.add(y),L(y),U()}).catch(()=>{s||(t.dataset.error="1")}),()=>{s=!0,cancelAnimationFrame(M),$.disconnect(),o.removeEventListener("pointerdown",Y),o.removeEventListener("pointermove",I),o.removeEventListener("pointerup",k),o.removeEventListener("pointercancel",k),y&&(y.geometry.dispose(),g.dispose()),l.dispose(),t.replaceChildren()}},[r]),r?f.jsx("div",{ref:e,className:"stl-preview-host","aria-hidden":!0}):null}function w1({app:r}){const e=r.file||"データなし（予約のみ）",t=r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":null,s=r.file?Nx(r.id):null;return f.jsxs("div",{className:"stl",children:[f.jsx("div",{className:"stl-canvas",children:s?f.jsx(E1,{src:s}):f.jsxs(f.Fragment,{children:[f.jsx("span",{className:"stl-tag",children:r.kind==="request"?"STL":"RESERVE"}),f.jsx("span",{className:"stl-note",children:r.kind==="request"?"サムネイル未生成":"データ提出なし"})]})}),f.jsxs("div",{className:"stl-meta",children:[f.jsx("span",{className:"stl-ext",children:r.file?r.file.split(".").pop().toUpperCase():"—"}),f.jsxs("span",{className:"stl-name",children:[f.jsx("b",{className:"num",children:e}),f.jsx("span",{children:t?`${t} ・ 更新 ${Y0(r.createdAt??"")}`:"予約枠のみの申請"})]}),f.jsxs("span",{className:"stl-actions",children:[f.jsx("a",{className:"mini",href:s??void 0,download:r.file||void 0,style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"DL"}),f.jsx("a",{className:"mini",href:s??void 0,target:"_blank",rel:"noreferrer",style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"開く"})]})]})]})}function T1({app:r,selected:e,onToggle:t,disabled:s}){mn(r);const o=Hd(r);return f.jsx("div",{className:"slotgrid",role:"group","aria-label":"時間帯（30分単位）",children:o.map(l=>{const d=e.indexOf(l)>=0;return f.jsxs("button",{type:"button",disabled:s,className:"slot-chip"+(d?" on":""),onClick:()=>t(l),"aria-pressed":d,children:[f.jsx("span",{className:"num",children:qt(Qa(l))}),f.jsx("span",{className:"slot-dur num",children:"30分"})]},l)})})}function A1({app:r,onPartial:e,onCancelAll:t,onApproveRequest:s,onMove:o}){const[l,d]=me.useState([]),[u,m]=me.useState(null),[p,g]=me.useState(null),[_,y]=me.useState(""),[M,E]=me.useState("");me.useEffect(()=>{d([]),m(null),g(null),E(""),y(r.adminNote||"")},[r.id]);const w=Hd(r),S=$=>d(R=>R.indexOf($)>=0?R.filter(A=>A!==$):R.concat($).sort((A,D)=>A-D)),x=l.length===w.length,L=()=>d(x?[]:w.slice()),N=r.status==="pending"||r.status==="approved",U=l.length>0&&!x,Y=l.length?`${qt(Qa(l[0]))}〜${qt(Qa(l[l.length-1])+Js)}（${l.length}枠・${Kl(l.length*Js)}）`:"",I=()=>{if(!p){E("理由を1つ選んでください");return}const $=Vp.find(R=>R.id===p);l.length?e(r,l,"cancelled",{cancelReason:$.id,adminNote:_||$.body,reason:$}):t(r,$,_)},k=()=>{if(!p){E("理由を1つ選んでください");return}const $=Gp.find(R=>R.id===p);l.length?e(r,l,"rejected",{rejectReason:$.id,adminNote:_||$.body,reason:$}):t(r,$,_,"rejected")};return f.jsxs("div",{className:"slotacts",children:[f.jsxs("div",{className:"ftitle",style:{marginBottom:6},children:[f.jsx("span",{children:"時間単位で操作"}),f.jsx("button",{type:"button",className:"linkbtn",onClick:L,children:x?"選択を解除":"すべて選択"})]}),f.jsx(T1,{app:r,selected:l,onToggle:S,disabled:!N}),f.jsx("div",{className:"selbar"+(l.length?" on":""),children:l.length?f.jsxs(f.Fragment,{children:[f.jsx("b",{className:"num",children:Y}),f.jsx("span",{children:U?"この枠だけを操作します（残りはそのまま）":"申請全体を操作します"})]}):f.jsx("span",{children:"枠を選ぶと、その時間だけを取り消し・承認できます。未選択なら申請全体が対象です。"})}),N&&f.jsxs("div",{className:"actrow",children:[r.status==="pending"&&f.jsxs("button",{type:"button",className:"btn btn-primary",onClick:()=>l.length?e(r,l,"approved",{}):s(r),children:["承認",U?`（${l.length}枠）`:""]}),f.jsx("button",{type:"button",className:"btn btn-secondary move",onClick:()=>o&&o(r),children:"別の日へ変更"}),f.jsx("button",{type:"button",className:"btn btn-danger",onClick:()=>{m(u==="cancel"?null:"cancel"),g(null),E("")},children:"取り消し…"}),r.status==="pending"&&f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>{m(u==="reject"?null:"reject"),g(null),E("")},children:"却下…"})]}),!N&&f.jsx("div",{className:"note tip",children:f.jsxs("span",{children:["この申請は ",f.jsx("b",{children:Qs[r.status]})," です。必要なら「申請中に戻す」で復帰できます。"]})}),N&&u==="cancel"&&f.jsxs("div",{className:"reasonblock",children:[f.jsxs("div",{className:"ftitle",children:["取り消しの理由",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("div",{className:"reasons",children:Vp.map($=>f.jsxs("button",{type:"button",className:"reason"+(p===$.id?" on":""),onClick:()=>{g($.id),E("")},children:[f.jsx("i",{}),f.jsxs("span",{children:[f.jsx("b",{children:$.label}),f.jsx("span",{children:$.body})]})]},$.id))}),f.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者への連絡（任意）"}),f.jsx("textarea",{className:"textarea",value:_,maxLength:200,onChange:$=>y($.target.value),placeholder:"理由に補足があれば書きます"}),M&&f.jsx("div",{className:"note warn",style:{marginTop:6},children:f.jsx("span",{children:M})}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{m(null),E("")},children:"やめる"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:I,children:U?`${l.length}枠を取り消す`:"この申請を取り消す"})]})]}),N&&u==="reject"&&f.jsxs("div",{className:"reasonblock",children:[f.jsxs("div",{className:"ftitle",children:["却下の理由",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("div",{className:"reasons",children:Gp.map($=>f.jsxs("button",{type:"button",className:"reason"+(p===$.id?" on":""),onClick:()=>{g($.id),E("")},children:[f.jsx("i",{}),f.jsxs("span",{children:[f.jsx("b",{children:$.label}),f.jsx("span",{children:$.body})]})]},$.id))}),f.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者へのメッセージ（任意）"}),f.jsx("textarea",{className:"textarea",value:_,maxLength:200,onChange:$=>y($.target.value),placeholder:"選んだ理由に補足があれば書きます"}),M&&f.jsx("div",{className:"note warn",style:{marginTop:6},children:f.jsx("span",{children:M})}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{m(null),E("")},children:"やめる"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:k,children:U?`${l.length}枠を却下`:"この申請を却下"})]})]}),r.status!=="pending"&&f.jsxs("div",{className:"actrow",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","pending"),children:"申請中に戻す"}),r.status==="approved"&&f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","done"),children:"完了にする"})]}),f.jsxs("div",{className:"memo",children:[f.jsxs("div",{className:"ftitle",style:{justifyContent:"space-between"},children:[f.jsxs("span",{children:["担当者メモ",r.adminNote?"（保存済み）":""]}),f.jsx("button",{type:"button",className:"linkbtn",onClick:()=>m(u==="note"?null:"note"),children:u==="note"?"閉じる":"書く"})]}),r.adminNote&&u!=="note"&&f.jsx("div",{className:"note tip",children:f.jsx("span",{children:r.adminNote})}),u==="note"&&f.jsxs("div",{style:{display:"grid",gap:6},children:[f.jsx("textarea",{className:"textarea",value:_,maxLength:200,onChange:$=>y($.target.value),placeholder:"印刷条件や受け取りの指示"}),f.jsx("div",{className:"presets",children:e0.map($=>f.jsxs("button",{type:"button",className:"preset",onClick:()=>y($),children:[$.slice(0,12),"…"]},$))}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>m(null),children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{t(r,null,_.trim(),null,"note"),m(null)},children:"メモを保存"})]})]})]})]})}function b1({app:r,onClose:e,onPartial:t,onCancelAll:s,onApproveRequest:o,onMove:l,log:d}){if(!r)return null;const u=mn(r),m=to(r.date),p=d.filter(g=>g.appId===r.id).sort((g,_)=>_.at.localeCompare(g.at));return f.jsxs(X0,{open:!!r,title:r.title,onClose:e,sub:f.jsxs(f.Fragment,{children:[f.jsx("span",{className:"num",style:{whiteSpace:"nowrap"},children:Bd(r.date)}),f.jsx("span",{children:"·"}),f.jsx("span",{style:{whiteSpace:"nowrap"},children:yi[r.machine].name})]}),footer:f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[f.jsxs("div",{className:"rv-flags",children:[f.jsx(Fl,{kind:r.kind}),f.jsx(Cd,{status:r.status}),a0(r)&&f.jsx(Hl,{tone:"warn",children:"当日・締切超過"}),f.jsxs(Hl,{children:["申請 ",j0(r.createdAt)]})]}),f.jsxs("dl",{className:"kv",children:[f.jsxs("div",{children:[f.jsx("dt",{children:"時間"}),f.jsxs("dd",{className:"num",children:[r.kind==="request"?"16:30〜20:00":`${qt(u.start)}〜${qt(u.end)}`,f.jsx("small",{children:r.kind==="request"?"（依頼枠を丸ごと占有）":`（${Kl(u.end-u.start)}）`})]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"機種"}),f.jsxs("dd",{children:[yi[r.machine].name,f.jsxs("small",{children:["／ ",yi[r.machine].maker]})]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"担当"}),f.jsx("dd",{children:m.length?m.map(g=>Lg(g)).join(" / "):"休み"})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"申請者"}),f.jsxs("dd",{children:[r.who.name,f.jsxs("small",{children:["（",ji(r.who.hr),"・",r.who.num,"番）"]})]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"種別"}),f.jsxs("dd",{children:[li[r.kind],f.jsx("small",{children:r.kind==="request"?"STL提出あり":"データ提出なし"})]})]})]}),f.jsxs("div",{children:[f.jsx("div",{className:"ftitle",children:"印刷データ"}),f.jsx(w1,{app:r})]}),r.note&&f.jsxs("div",{children:[f.jsx("div",{className:"ftitle",children:"申請者の備考"}),f.jsx("div",{className:"note tip",children:f.jsx("span",{children:r.note})})]}),f.jsx(A1,{app:r,onPartial:t,onCancelAll:s,onApproveRequest:o,onMove:l}),p.length>0&&f.jsxs("div",{children:[f.jsx("div",{className:"ftitle",children:"この申請の履歴"}),p.map(g=>f.jsxs("div",{className:"log-item "+g.type,children:[f.jsx("span",{className:"bd"}),f.jsxs("span",{className:"tx",children:[g.text,f.jsxs("span",{className:"at",children:[f.jsx("span",{className:"who",children:g.actor}),H0(g.at)]})]})]},g.id))]})]})}function C1({apps:r,selected:e,onPick:t,onOpen:s,onApprove:o,onCancel:l,onPartial:d,log:u,onDownload:m,onDownloadAll:p,onMove:g}){const _=Ig(r,e),y=to(e),M=e<ci,E=_.live.length;return f.jsxs("div",{className:"rs-grid",children:[f.jsx("div",{className:"rs-main",children:f.jsx($0,{apps:r,avail:null,selected:e,onPick:t})}),f.jsx("div",{className:"rs-side",children:f.jsxs("div",{className:"card daycard",children:[f.jsxs("div",{className:"daycard-h",children:[f.jsx("span",{className:"dc-date num",children:Td(e)}),f.jsx("span",{className:"dc-wd",children:wr[zn(e).getDay()]}),e===ci&&f.jsx(Hl,{tone:"orange",children:"今日"}),M&&f.jsx(Hl,{children:"過ぎた日"}),f.jsx("span",{className:"dc-staff",children:y.length?y.map(w=>f.jsx(Wg,{id:w,small:!0},w)):f.jsx("span",{className:"mtag none",children:"休み"})})]}),f.jsxs("div",{className:"daycard-counts",children:[f.jsxs("span",{className:"dc-c req",children:[f.jsx(Fl,{kind:"request",size:"sm"}),f.jsx("b",{className:"num",children:_.requests.length})]}),f.jsxs("span",{className:"dc-c res",children:[f.jsx(Fl,{kind:"reserve",size:"sm"}),f.jsx("b",{className:"num",children:_.reserves.length})]}),_.pending>0&&f.jsxs("span",{className:"dc-pend num",children:["申請中 ",_.pending]}),E>0&&f.jsxs("button",{type:"button",className:"btn btn-dl btn-sm dc-dl",onClick:()=>p(e),children:[f.jsx(Qp,{}),"この日の申請を一括DL（",E,"件）"]})]}),f.jsxs("div",{className:"dgroups",children:[["request","reserve"].map(w=>{const S=(w==="request"?_.requests:_.reserves).sort((L,N)=>mn(L).start-mn(N).start||Ja.indexOf(L.machine)-Ja.indexOf(N.machine)),x=S.filter(L=>L.status==="pending").length;return f.jsxs("div",{className:"dgroup",children:[f.jsxs("div",{className:"dg-head "+w,children:[f.jsx(Fl,{kind:w}),f.jsxs("span",{className:"num",children:[S.length,"件"]}),x>0&&f.jsxs("span",{className:"dg-pend num",children:["申請中 ",x]})]}),S.length===0?f.jsxs("div",{className:"dg-empty",children:["この日の",li[w],"はありません。"]}):S.map(L=>{const N=mn(L);return f.jsxs("div",{className:"drow "+L.status,children:[f.jsxs("span",{className:"dr-time num",children:[f.jsx("b",{children:qt(N.start)}),f.jsx("span",{children:qt(N.end)})]}),f.jsxs("span",{className:"dr-main",children:[f.jsx("span",{className:"dr-title",children:L.title}),f.jsxs("span",{className:"dr-sub",children:[f.jsx(Cd,{status:L.status}),f.jsx(k0,{id:L.machine}),yi[L.machine].short,f.jsx("span",{children:"·"}),L.who.name,L.file&&f.jsxs(f.Fragment,{children:[f.jsx("span",{children:"·"}),f.jsx("span",{className:"num",children:L.file})]})]})]}),f.jsxs("span",{className:"dr-acts",children:[L.status==="pending"&&f.jsx("button",{type:"button",className:"mini ok",onClick:()=>o(L),children:"承認"}),(L.status==="pending"||L.status==="approved"||L.status==="done")&&f.jsx("button",{type:"button",className:"mini move",onClick:()=>g(L),children:"変更"}),(L.status==="pending"||L.status==="approved")&&f.jsx("button",{type:"button",className:"mini no",onClick:()=>s(L,"cancel"),children:"取り消し"}),f.jsxs("details",{className:"dr-dl dr-dl-menu",children:[f.jsxs("summary",{className:"mini dl","aria-label":`${L.title} をダウンロード`,children:[f.jsx(Qp,{}),"DL"]}),f.jsxs("div",{className:"dr-dl-opts",children:[f.jsx("button",{type:"button",className:"mini dl",onClick:()=>m(L,"form"),children:"申請書ダウンロード"}),L.file&&f.jsx("button",{type:"button",className:"mini dl",onClick:()=>m(L,"file"),children:"3Dモデルダウンロード"})]})]}),f.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(L),"aria-label":"詳細",children:"›"})]})]},L.id)})]},w)}),_.cancelled.length>0&&f.jsxs("details",{className:"dcan",children:[f.jsxs("summary",{className:"num",children:["取り消し・却下 ",_.cancelled.length,"件"]}),_.cancelled.map(w=>{const S=mn(w);return f.jsxs("div",{className:"drow cancelled",children:[f.jsxs("span",{className:"dr-time num",children:[f.jsx("b",{children:qt(S.start)}),f.jsx("span",{children:qt(S.end)})]}),f.jsxs("span",{className:"dr-main",children:[f.jsx("span",{className:"dr-title",children:w.title}),f.jsxs("span",{className:"dr-sub",children:[f.jsx(Cd,{status:w.status}),f.jsx("span",{children:w.who.name}),f.jsx("span",{children:"·"}),f.jsx("span",{children:w.adminNote||"理由なし"})]})]}),f.jsxs("span",{className:"dr-acts",children:[f.jsx("button",{type:"button",className:"mini",onClick:()=>l(w,null,"","pending"),children:"戻す"}),f.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(w),children:"›"})]})]},w.id)})]})]})]})})]})}function R1(r,e){return r.filter(t=>$s(t.id,e))}function N1({open:r,app:e,members:t,busy:s,onClose:o,onConfirm:l}){const[d,u]=me.useState(null);me.useEffect(()=>{r||u(null)},[r,e==null?void 0:e.id]);const m=me.useMemo(()=>e?R1(t,e.date):[],[e,t]);return me.useEffect(()=>{!r||!m.length||d&&m.some(p=>p.id===d)||u(m[0].id)},[r,m,d]),e?f.jsxs($g,{open:r,title:"印刷担当者を選んで承認",sub:`${Bd(e.date)} · ${e.title}`,onClose:s?()=>{}:o,footer:f.jsxs(f.Fragment,{children:[f.jsx("button",{type:"button",className:"btn btn-secondary",disabled:s,onClick:o,children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-primary",disabled:s||!d||!m.length,"data-testid":"approve-staff-confirm",onClick:()=>d&&l(d),children:s?"承認中…":"承認する"})]}),children:[f.jsx("p",{className:"hint",style:{margin:"0 0 12px"},children:"この日のシフトに入っている担当者のうち、承認後の印刷担当を選びます。"}),m.length===0?f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"この日にシフトが入っている担当者がいません。シフト表で担当を追加してから承認してください。"})}):f.jsx("div",{className:"approve-staff-list",role:"listbox","aria-label":"当日の担当者",children:m.map(p=>f.jsxs("button",{type:"button",role:"option","aria-selected":d===p.id,className:"approve-staff-opt"+(d===p.id?" on":""),onClick:()=>u(p.id),children:[f.jsx(Wg,{id:p.id}),f.jsx("span",{children:Lg(p.id)})]},p.id))})]}):null}function P1({year:r,month:e,app:t,apps:s,onChangeMonth:o,onJumpToday:l}){const{run:d,enterClass:u}=Xd(),m=`${r}-${yn(e)}`,p=c0(r,e);return f.jsxs("div",{className:"mm",children:[f.jsxs("div",{className:"mm-h",children:[f.jsx("button",{type:"button",onClick:()=>d(-1,()=>o(-1)),"aria-label":"前の月",children:"‹"}),f.jsx("div",{className:u,children:f.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]})},`label-${m}`),f.jsx("button",{type:"button",onClick:()=>d(1,()=>o(1)),"aria-label":"次の月",children:"›"}),f.jsx("button",{type:"button",className:"mini",onClick:l,children:"今月"})]}),f.jsx("div",{className:"cal-period-shell",children:f.jsxs("div",{className:u,children:[f.jsx("div",{className:"mm-wds",children:wr.map((g,_)=>f.jsx("span",{className:"mm-wd"+(_===0?" sun":_===6?" sat":""),children:g},g))}),f.jsx("div",{className:"mm-grid",children:p.map((g,_)=>{if(!g)return f.jsx("span",{className:"mm-cell pad"},"p"+_);const y=Yn(g),M=Fg(s,t,y),E=M.sameDay?"current":M.past?"past":M.full?"full":M.noStaff?"nostaff":"ok";return f.jsxs("button",{type:"button","data-date":y,className:"mm-cell "+E,onClick:()=>!M.past&&!M.sameDay&&o(0,y),"aria-label":`${g.getMonth()+1}月${g.getDate()}日 ${M.full?"埋まり":M.noStaff?"担当なし":"空き"}`,children:[f.jsx("span",{className:"num mm-d",children:g.getDate()}),f.jsx("span",{className:"mm-meta",children:M.sameDay?"現在":M.past?"—":M.noStaff?"担当なし":M.full?"満枠":`空き ${M.free}枠`}),M.liveCount>0&&!M.past&&f.jsx("span",{className:"mm-count num",children:M.liveCount})]},y)})})]},m)})]})}function L1({open:r,app:e,apps:t,onClose:s,onMove:o}){const[l,d]=me.useState(()=>{const x=e?zn(e.date):new Date;return{y:x.getFullYear(),m:x.getMonth()+1}}),[u,m]=me.useState(null),[p,g]=me.useState(!1);if(me.useEffect(()=>{if(!e)return;const x=zn(e.date);d({y:x.getFullYear(),m:x.getMonth()+1}),m(null),g(!1)},[e&&e.id,r]),!r||!e)return null;const _=(x,L)=>{if(L){m(L);return}if(x===0){const N=new Date;d({y:N.getFullYear(),m:N.getMonth()+1});return}d(N=>{let U=N.y,Y=N.m+x;return Y<1&&(Y=12,U-=1),Y>12&&(Y=1,U+=1),{y:U,m:Y}})},y=u?Fg(t,e,u):null,E=!!(y&&(y.full||y.noStaff)),w=mn(e),S=()=>{o(e,u,{forced:E&&p,info:y}),m(null),g(!1)};return f.jsx($g,{open:r,wide:!0,title:"別の日へ変更",sub:f.jsxs(f.Fragment,{children:[f.jsx("span",{children:e.title}),f.jsx("span",{children:"·"}),f.jsx("span",{className:"num",children:Bd(e.date)}),f.jsx("span",{children:"·"}),f.jsx("span",{children:li[e.kind]})]}),onClose:s,footer:f.jsxs(f.Fragment,{children:[f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:s,children:"閉じる"}),f.jsx("button",{type:"button",className:"btn btn-primary",disabled:!u||E&&!p,onClick:S,children:u?`${Td(u)} に変更`:"日付を選択"})]}),children:f.jsxs("div",{className:"mv-body",children:[f.jsxs("div",{className:"mv-note",children:[f.jsxs("b",{children:[qt(w.start),"〜",qt(w.end)]}),f.jsx("span",{className:"mv-sep",children:"|"}),f.jsxs("span",{children:[yi[e.machine].name," ・ ",e.status==="approved"?"確定済みでも変更できます":"時間帯はそのまま移動します"]})]}),f.jsx(P1,{year:l.y,month:l.m,app:e,apps:t,onChangeMonth:_,onJumpToday:()=>_(0)}),f.jsxs("div",{className:"mv-legend",children:[f.jsx("span",{className:"mv-lg ok",children:"空き"}),f.jsx("span",{className:"mv-lg nostaff",children:"担当なし"}),f.jsx("span",{className:"mv-lg full",children:"満枠"}),f.jsx("span",{className:"mv-lg past",children:"過ぎた日"})]}),u&&y&&f.jsxs("div",{className:"mv-picked "+(y.full?"full":y.noStaff?"nostaff":"ok"),children:[f.jsxs("div",{className:"mvp-h",children:[f.jsxs("b",{className:"num",children:[Td(y.date),"（",wr[zn(y.date).getDay()],"）"]}),f.jsx("span",{className:"mvp-state",children:y.noStaff?"担当者がいません":y.full?"満枠です":`空き ${y.free}/${y.total}枠`})]}),f.jsxs("div",{className:"mvp-meta",children:[f.jsxs("span",{children:["担当：",y.staffs.length?y.staffs.map(x=>jd(x)).join(" / "):"なし"]}),f.jsxs("span",{children:["この日の申請：",f.jsxs("span",{className:"num",children:[y.liveCount,"件"]})]})]}),E&&f.jsxs("label",{className:"mv-force",children:[f.jsx("input",{type:"checkbox",checked:p,onChange:x=>g(x.target.checked)}),f.jsxs("span",{children:[f.jsx("b",{children:y.noStaff?"担当者がいない日にも変更する":"満枠でも強制的に変更する"}),f.jsx("span",{className:"fl-h",children:y.noStaff?"担当者のいない日は本来受け付けていません。必要な場合だけ強制します。":"同じ時間帯の申請と重なります。両方を残したまま、この申請を確定・申請中にします。"})]})]})]})]})})}function D1({year:r,month:e,avail:t,memberId:s,onPaint:o,onChangeMonth:l}){const{run:d,enterClass:u}=Xd(),m=`${r}-${yn(e)}`,g=new Date(r,e-1,1).getDay(),_=new Date(r,e,0).getDate(),y=[];for(let D=0;D<g;D++)y.push(null);for(let D=1;D<=_;D++)y.push(new Date(r,e-1,D));const M=me.useRef(null),E=me.useRef(null),[w,S]=me.useState(null),x=D=>y.filter(Boolean).filter(W=>W.getDay()===D).map(Yn),L=D=>D>=ci,N=(D,W)=>{if(!s||!L(D)||W.pointerType==="mouse"&&W.button!==0)return;W.preventDefault();const j=!$s(s,D);E.current={mode:j,touched:[D]},S({dates:new Set([D]),on:j})},U=(D,W)=>{const j=document.elementFromPoint(D,W),te=j&&j.closest?j.closest(".scal-cell[data-date]"):null;return te?te.getAttribute("data-date"):null};me.useEffect(()=>{const D=j=>{const te=E.current;if(!te)return;j.preventDefault();const oe=U(j.clientX,j.clientY);!oe||!L(oe)||te.touched.indexOf(oe)>=0||(te.touched.push(oe),S(he=>{const de=new Set(he?he.dates:[]);return de.add(oe),{dates:de,on:te.mode}}))},W=()=>{const j=E.current;if(!j)return;E.current=null;const te=j.touched.filter(L).slice();S(null),te.length&&o(te,j.mode)};return window.addEventListener("pointermove",D,{passive:!1}),window.addEventListener("pointerup",W),window.addEventListener("pointercancel",W),()=>{window.removeEventListener("pointermove",D),window.removeEventListener("pointerup",W),window.removeEventListener("pointercancel",W)}},[o,s]);const Y=D=>w&&w.dates.has(D)?w.on:null,I=D=>{const W=Y(D);return W!==null?W:s?$s(s,D):!1},k=D=>i0().filter(W=>(t[W.id]||[]).indexOf(D)>=0).map(W=>W.id),$=(Qr(s)||{}).color||"var(--color-primary)",R=D=>{if(!s)return;const W=x(D).filter(L);if(!W.length)return;const j=W.every(te=>$s(s,te));o(W,!j)},A=D=>{const W=x(D).filter(L);if(!s||!W.length)return"idle";const j=W.filter(te=>$s(s,te)).length;return j===0?"idle":j===W.length?"all":"some"};return f.jsxs("div",{className:"scal",ref:M,children:[f.jsxs("div",{className:"scal-h",children:[f.jsx("div",{className:u,children:f.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]})},`label-${m}`),f.jsx("button",{type:"button",className:"mini",onClick:()=>l(0),children:"今月"})]}),f.jsxs("div",{className:"scal-body",children:[f.jsxs("button",{type:"button",className:"scal-side prev",onClick:()=>d(-1,()=>l(-1)),"aria-label":"前の月",children:[f.jsx("span",{"aria-hidden":"true",children:"‹"}),f.jsx("span",{className:"scal-side-lbl",children:"前へ"})]}),f.jsx("div",{className:"scal-main",children:f.jsx("div",{className:"cal-period-shell",children:f.jsxs("div",{className:u,children:[f.jsx("div",{className:"scal-wds",children:wr.map((D,W)=>{const j=A(W);return f.jsx("button",{type:"button","data-wd":W,className:"scal-wd"+(W===0?" sun":W===6?" sat":"")+(j==="all"?" all":j==="some"?" some":""),onClick:()=>R(W),title:`${D}曜日をこの月すべて${j==="all"?"削除":"追加"}`,"aria-label":`${D}曜日をこの月すべて${j==="all"?"削除":"追加"}`,children:D},D)})}),f.jsx("div",{className:"scal-grid"+(w?" painting":""),children:Array.from({length:Math.ceil(y.length/7)*7}).map((D,W)=>{const j=y[W];if(!j)return f.jsx("span",{className:"scal-cell pad"},"p"+W);const te=Yn(j),oe=I(te),he=Y(te),de=j.getDay(),H=!L(te),B=k(te),K=s?B.indexOf(s)>=0:!1;return f.jsx("button",{type:"button","data-date":te,className:"scal-cell"+(oe?" on":"")+(de===0?" sun":de===6?" sat":"")+(te===ci?" today":"")+(H?" past":"")+(he===!0?" pv-on":he===!1?" pv-off":"")+(K?" mine":""),style:K||he===!0&&s?{background:$+"1f",borderColor:$}:void 0,onPointerDown:O=>N(te,O),"aria-pressed":oe,"aria-label":`${j.getMonth()+1}月${j.getDate()}日 ${B.length?B.map(jd).join("・"):"担当なし"}`,children:f.jsx("span",{className:"scal-dots",children:B.slice(0,4).map(O=>f.jsx("span",{className:"scal-dot",style:{background:r0(O)}},O))})},te)})})]},m)})}),f.jsxs("button",{type:"button",className:"scal-side next",onClick:()=>d(1,()=>l(1)),"aria-label":"次の月",children:[f.jsx("span",{"aria-hidden":"true",children:"›"}),f.jsx("span",{className:"scal-side-lbl",children:"次へ"})]})]}),!s&&f.jsx("div",{className:"scal-foot",children:f.jsx("span",{className:"scal-warn",children:"先に担当者を選んでください。"})})]})}function Eg({members:r,onAdd:e,onUpdate:t,onRemove:s,sectionHint:o,focusRequest:l,onFocusHandled:d}){const[u,m]=me.useState(null),[p,g]=me.useState(!1),[_,y]=me.useState({name:"",hr:"101",num:"",discord:"",color:Kr[0],hubUserId:null}),[M,E]=me.useState(""),[w,S]=me.useState([]),[x,L]=me.useState(!1),N=me.useRef(null),U=me.useCallback(()=>(L(!0),Ex().then(S).catch(()=>S([])).finally(()=>L(!1))),[]);me.useEffect(()=>{U()},[U]),me.useEffect(()=>{!u||u==="new"||U()},[u,U]),me.useEffect(()=>{p&&N.current&&N.current.scrollIntoView({behavior:"smooth",block:"nearest"})},[p,u]);const Y=D=>{if(!D)return null;const W=w.find(j=>j.id===D);return W?`${W.display_name} (@${W.username})`:"紐づけ済"},I=D=>{m(D.id),g(!1),y({name:D.name,hr:D.hr,num:String(D.num),discord:D.discord||"",color:D.color,hubUserId:D.userId??null}),E("")},k=D=>{I(D),g(!0)};me.useEffect(()=>{if(!(l!=null&&l.memberId))return;const D=r.find(W=>W.id===l.memberId);D&&(l.hub?k(D):I(D),d==null||d())},[l,r,d]);const $=()=>{g(!1),m("new"),y({name:"",hr:"101",num:"",discord:"",color:Kr[r.length%Kr.length],hubUserId:null}),E("")},R=()=>{if(!_.name.trim())return"名前を入力してください";if(!Xp.includes(_.hr))return"HRは 101〜309 から選んでください";const D=Number(_.num);return!D||D<1||D>40?"番号は 1〜40 で入力してください":_.discord&&!/^\d{15,25}$/.test(_.discord.trim())?"Discord のユーザーIDは数字15〜25桁です":""},A=()=>{const D=R();if(D){E(D);return}const W={name:_.name.trim(),hr:_.hr,num:Number(_.num),discord:_.discord.trim(),color:_.color,hubUserId:_.hubUserId};u==="new"?e(W):t(u,W),m(null),E("")};return f.jsxs("div",{className:"mform","data-testid":"print-staff-directory",children:[f.jsxs("div",{className:"mform-h",children:[f.jsx("b",{children:"担当者一覧"}),f.jsxs("span",{className:"num",children:[r.length,"人"]}),o?f.jsx("span",{className:"fl-h",children:o}):null,u!=="new"&&f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:$,children:"担当者を追加"})]}),f.jsxs("div",{className:"mtable",children:[f.jsxs("div",{className:"mtr mtr-h",children:[f.jsx("span",{}),f.jsx("span",{children:"名前"}),f.jsx("span",{children:"HR"}),f.jsx("span",{children:"番号"}),f.jsx("span",{children:"Discord ID"}),f.jsx("span",{children:"ScienceHUB"}),f.jsx("span",{})]}),r.map(D=>f.jsxs("div",{className:"mtr",children:[f.jsx("span",{className:"mtd-av",style:{background:D.color},children:D.name.slice(0,1)}),f.jsx("span",{className:"mtd-name",children:D.name}),f.jsx("span",{className:"num",children:ji(D.hr)}),f.jsxs("span",{className:"num",children:[D.num,"番"]}),f.jsx("span",{className:"num mtd-discord",children:D.discord||f.jsx("em",{className:"mtd-none",children:"未設定"})}),f.jsx("span",{className:"mtd-hub",children:D.userId?Y(D.userId)??f.jsx("em",{className:"mtd-none",children:"紐づけ済"}):f.jsx("em",{className:"mtd-none",children:"未紐づけ"})}),f.jsxs("span",{className:"mtd-acts",children:[f.jsx("button",{type:"button",className:"mini","data-testid":`staff-edit-${D.id}`,onClick:()=>I(D),children:"編集"}),f.jsx("button",{type:"button",className:"mini","data-testid":`staff-link-${D.id}`,onClick:()=>k(D),children:"紐づけ"}),f.jsx("button",{type:"button",className:"mini no",disabled:r.length<=1,onClick:()=>{confirm(`${D.name} を削除します。この人のシフトも消えます。`)&&s(D.id)},children:"削除"})]})]},D.id))]}),(u==="new"||u)&&f.jsxs("div",{className:"medit",children:[f.jsxs("div",{className:"medit-h",children:[f.jsx("b",{children:u==="new"?"担当者を追加":"担当者を編集"}),f.jsx("button",{type:"button",className:"linkbtn",onClick:()=>{m(null),E("")},children:"閉じる"})]}),f.jsxs("div",{className:"medit-grid",children:[f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["名前",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input",value:_.name,maxLength:12,onChange:D=>y(W=>({...W,name:D.target.value})),placeholder:"例：佐々木"})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["HR",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("select",{className:"input",value:_.hr,onChange:D=>y(W=>({...W,hr:D.target.value})),children:Xp.map(D=>f.jsx("option",{value:D,children:ji(D)},D))})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["番号",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input num",type:"number",min:1,max:40,value:_.num,onChange:D=>y(W=>({...W,num:D.target.value})),placeholder:"12"})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["Discord ID",f.jsx("span",{className:"fl-opt",children:"任意"})]}),f.jsx("input",{className:"input num",value:_.discord,inputMode:"numeric",onChange:D=>y(W=>({...W,discord:D.target.value})),placeholder:"朝6時のメンション用"})]})]}),u&&f.jsxs("div",{className:"fl",ref:N,children:[f.jsxs("span",{className:"fl-l",children:["ScienceHUB アカウント",f.jsx("span",{className:"fl-opt",children:"3D印刷管理にアクセス可能なユーザー"})]}),x?f.jsx("p",{className:"fl-h",children:"読み込み中…"}):f.jsxs("div",{className:"hub-user-pick",role:"radiogroup","aria-label":"ScienceHUB アカウントの紐づけ",children:[f.jsxs("button",{type:"button",className:"hub-user-opt"+(_.hubUserId===null?" on":""),onClick:()=>y(D=>({...D,hubUserId:null})),children:[f.jsx("b",{children:"紐づけなし"}),f.jsx("span",{children:"この印刷担当者は ScienceHUB ログインと結びつきません"})]}),w.map(D=>{const W=D.linked_member_id&&D.linked_member_id!==u;return f.jsxs("button",{type:"button",disabled:!!W,className:"hub-user-opt"+(_.hubUserId===D.id?" on":""),onClick:()=>y(j=>({...j,hubUserId:D.id})),children:[f.jsx("b",{children:D.display_name}),f.jsxs("span",{children:["@",D.username," · ",D.email]}),f.jsx("em",{children:D.access_labels.join(" / ")}),W?f.jsxs("em",{children:["（別の印刷担当に紐づけ済: ",D.linked_member_name,"）"]}):null,D.linked_member_id===u?f.jsx("em",{children:"（この担当者に紐づけ中）"}):null]},D.id)})]})]}),f.jsxs("div",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"シフト表の色"}),f.jsx("div",{className:"color-pick",children:Kr.map(D=>f.jsx("button",{type:"button",className:_.color===D?"on":"",style:{background:D},onClick:()=>y(W=>({...W,color:D})),"aria-label":`色 ${D}`,"aria-pressed":_.color===D},D))})]}),M&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:M})}),f.jsxs("div",{className:"actrow end",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{m(null),E("")},children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:A,children:u==="new"?"追加する":"保存する"})]})]})]})}function U1({configured:r,onSend:e}){const[t,s]=me.useState(""),[o,l]=me.useState(null),[d,u]=me.useState(!1),m=async()=>{const p=t.trim();if(!p){l({ok:!1,text:"送信先メールアドレスを入力してください"});return}u(!0),l({ok:null,text:"送信中…"});try{const g=await e(p);l({ok:!0,text:`送信しました（${g.to??p}）`})}catch(g){l({ok:!1,text:g instanceof Error?g.message:"送信に失敗しました"})}finally{u(!1)}};return f.jsxs("section",{className:"intg","data-testid":"email-test-section",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"予約者向けメール（Cloudflare Email Sending）"}),f.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"設定済み":"未設定"})]}),f.jsx("p",{className:"fl-h",children:"申請・受領通知はサーバー環境変数（PRINT_3D_EMAIL_FROM、CLOUDFLARE_API_TOKEN 等）経由で送信されます。 下の欄に任意のアドレスを入れて、同じ経路のテストメールを送れます。"}),!r&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"メール送信が未設定です。Cloudflare Email Service のドメイン認証と Pages のシークレットを確認してください。"})}),f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"テスト送信先"}),f.jsx("input",{className:"input",type:"email",autoComplete:"email",spellCheck:!1,"data-testid":"email-test-to",value:t,onChange:p=>s(p.target.value),placeholder:"you@example.com",disabled:!r||d})]}),f.jsx("div",{className:"intg-f",children:f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"email-test-send",disabled:!r||d||!t.trim(),onClick:()=>void m(),children:"テスト送信"})}),o&&f.jsx("p",{className:"fl-h"+(o.ok===!0?"":o.ok===!1?" warn":""),role:"status","data-testid":"email-test-result",children:o.text})]})}function I1({configured:r,members:e,onSend:t}){var M;const[s,o]=me.useState(()=>new Set),[l,d]=me.useState(null),[u,m]=me.useState(!1),p=E=>{o(w=>{const S=new Set(w);return S.has(E)?S.delete(E):S.add(E),S})},g=async()=>{var w;const E=[...s];if(!E.length){d({ok:!1,text:"メンションする担当者を1人以上選んでください"});return}m(!0),d({ok:null,text:"Discord へ送信中…"});try{const S=await t(E),x=(S.sent||[]).map(N=>N.name).join("・"),L=((w=S.skipped)==null?void 0:w.length)>0?`（スキップ: ${S.skipped.map(N=>`${N.name}: ${N.reason}`).join(" / ")}）`:"";d({ok:!0,text:`送信しました。Discord で ${x} へのメンション（青字）を確認してください。${L}`,detail:S.content,sent:S.sent})}catch(S){d({ok:!1,text:S instanceof Error?S.message:"送信に失敗しました"})}finally{m(!1)}},_=e.filter(E=>(E.discord||"").trim()),y=e.some(E=>(E.discord||"").trim());return f.jsxs("section",{className:"intg","data-testid":"discord-mention-test-section",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"Discord メンションのテスト"}),f.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"Webhook設定済み":"Webhook未設定"})]}),f.jsxs("p",{className:"fl-h",children:["朝6時の担当者メンションと同じ形式で、選んだ担当者に ",f.jsx("code",{children:"<@ユーザーID>"})," を送ります。 チャンネルで名前が青く通知されれば、その Discord ID は正しく設定されています。"]}),!r&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"サーバーに Discord Webhook（DISCORD_WEBHOOK_URL）が未設定です。Wrangler / Pages の環境変数を確認してください。"})}),!y&&f.jsx("div",{className:"note warn",children:f.jsx("span",{children:"担当者タブで Discord ユーザーID（数字）を登録してからテストしてください。"})}),f.jsxs("div",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"メンションする担当者"}),f.jsx("div",{className:"mp-list",style:{marginTop:8},children:e.map(E=>{const w=(E.discord||"").trim(),S=!!w,x=s.has(E.id);return f.jsxs("button",{type:"button",className:"mp"+(x?" on":"")+(S?"":" disabled"),style:x?{borderColor:E.color,background:E.color+"14"}:void 0,disabled:!r||u||!S,"data-testid":`discord-mention-member-${E.id}`,onClick:()=>S&&p(E.id),"aria-pressed":x,children:[f.jsx("span",{className:"mp-av",style:{background:E.color},children:E.name.slice(0,1)}),f.jsxs("span",{className:"mp-tx",children:[f.jsx("b",{children:E.name}),f.jsxs("span",{className:"num",children:[ji(E.hr),"・",E.num,"番"]})]}),f.jsx("span",{className:"num mtd-discord",children:w||"ID未設定"})]},E.id)})}),_.length>0&&f.jsx("span",{className:"fl-h",children:"ID未設定の担当者は選択できません（担当者タブで編集）。"})]}),f.jsx("div",{className:"intg-f",children:f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"discord-mention-test-send",disabled:!r||u||s.size===0,onClick:()=>void g(),children:"メンションをテスト送信"})}),l&&f.jsx("p",{className:"fl-h"+(l.ok===!0?"":l.ok===!1?" warn":""),role:"status","data-testid":"discord-mention-test-result",children:l.text}),(l==null?void 0:l.ok)===!0&&((M=l.sent)==null?void 0:M.length)>0&&f.jsx("ul",{className:"fl-h","data-testid":"discord-mention-test-sent-list",style:{marginTop:4,paddingLeft:"1.2rem"},children:l.sent.map(E=>f.jsxs("li",{children:[f.jsx("b",{children:E.name})," — メンション ID: ",f.jsx("span",{className:"num",children:E.discord_user_id})]},E.member_id))}),(l==null?void 0:l.detail)&&f.jsxs("details",{className:"fl-h",style:{marginTop:8},children:[f.jsx("summary",{children:"送信したメッセージ本文"}),f.jsx("pre",{className:"mono",style:{whiteSpace:"pre-wrap",fontSize:"0.85em",marginTop:6},children:l.detail})]})]})}function F1({value:r,onChange:e,onTestDiscord:t,onTestDiscordMention:s,onTestGcal:o,onTestEmail:l,emailConfigured:d,discordConfigured:u,members:m}){const p=r.discord||{},g=r.gcal||{},_=x=>e({...r,discord:{...p,...x}}),y=x=>e({...r,gcal:{...g,...x}}),E=(p.webhook||"").includes("サーバー設定")||/^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(p.webhook||""),S=(g.calendarId||"").includes("サーバー設定")||/^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(g.calendarId||"");return f.jsxs("div",{className:"integ",children:[f.jsxs("section",{className:"intg",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"Discord 通知"}),f.jsx("span",{className:"intg-state "+(p.enabled?E?"ok":"warn":"off"),children:p.enabled?E?"有効":"URL未設定":"無効"}),f.jsxs("label",{className:"sw",children:[f.jsx("input",{type:"checkbox",checked:!!p.enabled,onChange:x=>_({enabled:x.target.checked})}),f.jsx("span",{})]})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["Webhook URL",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input mono",value:p.webhook||"",spellCheck:"false",onChange:x=>_({webhook:x.target.value.trim()}),placeholder:"https://discord.com/api/webhooks/123.../abc..."}),f.jsx("span",{className:"fl-h",children:"Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURL。"})]}),!E&&(p.webhook||"")&&f.jsx("div",{className:"note warn",children:f.jsxs("span",{children:["URLの形式が違います。",f.jsx("b",{children:"https://discord.com/api/webhooks/…"})," の形で貼り付けてください。"]})}),f.jsxs("div",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"通知するタイミング"}),f.jsx("div",{className:"chk-grid",children:[["pending","新しい申請"],["approved","確定したとき"],["cancelled","取り消したとき"]].map(([x,L])=>f.jsxs("label",{className:"chk",children:[f.jsx("input",{type:"checkbox",checked:!!(p.events&&p.events[x]),onChange:N=>_({events:{...p.events,[x]:N.target.checked}})}),f.jsx("span",{children:L})]},x))})]}),f.jsxs("label",{className:"chk",style:{alignSelf:"flex-start"},children:[f.jsx("input",{type:"checkbox",checked:!!p.dailyMention,onChange:x=>_({dailyMention:x.target.checked})}),f.jsx("span",{children:"当日の担当者を朝6:00にメンションする"})]}),f.jsx("span",{className:"fl-h",style:{marginTop:-6},children:"メンバーに登録した Discord ID を使います。未設定の人はメンションされません。"}),f.jsxs("div",{className:"intg-f",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:t,disabled:!E,children:"テスト送信"}),f.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),s&&(m==null?void 0:m.length)>0&&f.jsx(I1,{configured:!!u,members:m,onSend:s}),f.jsxs("section",{className:"intg",children:[f.jsxs("div",{className:"intg-h",children:[f.jsx("b",{children:"Google カレンダー"}),f.jsx("span",{className:"intg-state "+(g.enabled?S?"ok":"warn":"off"),children:g.enabled?S?"有効":"ID未設定":"無効"}),f.jsxs("label",{className:"sw",children:[f.jsx("input",{type:"checkbox",checked:!!g.enabled,onChange:x=>y({enabled:x.target.checked})}),f.jsx("span",{})]})]}),f.jsxs("label",{className:"fl",children:[f.jsxs("span",{className:"fl-l",children:["カレンダーID",f.jsx("span",{className:"req",children:"必須"})]}),f.jsx("input",{className:"input mono",value:g.calendarId||"",spellCheck:"false",onChange:x=>y({calendarId:x.target.value.trim()}),placeholder:"xxxx@group.calendar.google.com"}),f.jsx("span",{className:"fl-h",children:"共有カレンダーの「設定 → カレンダーの統合」に載っているID。"})]}),f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"予定タイトルの書式"}),f.jsx("input",{className:"input",value:g.title||"",onChange:x=>y({title:x.target.value}),placeholder:"[3Dプリント] {title}"}),f.jsxs("span",{className:"fl-h",children:["{title}"," 作品名 / ","{who}"," 申請者 / ","{machine}"," 機種 に置き換わります。"]})]}),f.jsxs("div",{className:"fl-2",children:[f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"所要時間"}),f.jsx("select",{className:"input",value:g.duration||20,onChange:x=>y({duration:Number(x.target.value)}),children:[10,15,20,30,60,90,120].map(x=>f.jsxs("option",{value:x,children:[x,"分"]},x))})]}),f.jsxs("label",{className:"fl",children:[f.jsx("span",{className:"fl-l",children:"登録する時点"}),f.jsxs("select",{className:"input",value:g.syncOn||"approved",onChange:x=>y({syncOn:x.target.value}),children:[f.jsx("option",{value:"pending",children:"申請が届いた時点"}),f.jsx("option",{value:"approved",children:"確定した時点"})]})]})]}),f.jsxs("div",{className:"intg-f",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:o,disabled:!S,children:"接続テスト"}),f.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),l&&f.jsx(U1,{configured:d,onSend:l})]})}function O1({members:r,avail:e,onAddMember:t,onUpdateMember:s,onRemoveMember:o,onPaintAvail:l,shiftDraftPending:d,shiftDraftSummary:u,shiftApplying:m,onConfirmShiftDraft:p,onDiscardShiftDraft:g,onLoadShiftMonth:_,integrations:y,setIntegrations:M,onTestDiscord:E,onTestDiscordMention:w,onTestGcal:S,onTestEmail:x,emailConfigured:L,discordConfigured:N,log:U,pendingPre:Y}){const[I,k]=me.useState(Y||"shift"),[$,R]=me.useState(null),[A,D]=me.useState(r[0]?r[0].id:null),[W,j]=me.useState(()=>{const B=new Date;return{y:B.getFullYear(),m:B.getMonth()+1}});me.useEffect(()=>{Y&&k(Y)},[Y]),me.useEffect(()=>{r.length&&!r.find(B=>B.id===A)&&D(r[0].id)},[r]);const te=me.useRef("");me.useEffect(()=>{if(I!=="shift")return;const B=`${W.y}-${W.m}`;te.current!==B&&(te.current=B,_(W.y,W.m))},[I,W.y,W.m,_]);const oe=[["shift","シフト表"],["member","担当者"],["integ","外部連携"]],he=B=>{if(B!==0&&(te.current=""),B===0){const K=new Date;te.current="",j({y:K.getFullYear(),m:K.getMonth()+1});return}j(K=>{let O=K.y,ie=K.m+B;return ie<1&&(ie=12,O-=1),ie>12&&(ie=1,O+=1),{y:O,m:ie}})},de=u&&d?[u.addedSlots>0&&`追加${u.addedSlots}枠`,u.removedSlots>0&&`削除${u.removedSlots}枠`,u.addedDates>0&&`＋${u.addedDates}日`,u.removedDates>0&&`−${u.removedDates}日`].filter(Boolean).join(" · "):"",H=r.find(B=>B.id===A);return f.jsxs("div",{className:"set-wrap",children:[f.jsx("div",{className:"set-tabs",role:"tablist",children:oe.map(([B,K])=>f.jsx("button",{type:"button",role:"tab","aria-selected":I===B,className:I===B?"on":"",onClick:()=>k(B),children:K},B))}),f.jsxs("div",{className:"set-tab-stage",children:[I==="shift"&&f.jsxs("div",{className:"shifttab",children:[d&&f.jsxs("div",{className:"shift-confirm-bar",role:"status",children:[f.jsxs("span",{className:"shift-confirm-bar-text",children:["未保存のシフト変更があります",de?`（${de}）`:""]}),f.jsxs("div",{className:"shift-confirm-bar-actions",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:m,onClick:g,children:"変更を破棄"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",disabled:m,onClick:p,children:m?"保存中…":"変更を確定"})]})]}),f.jsxs("div",{className:"card memberpick",children:[f.jsxs("div",{className:"mp-h",children:[f.jsx("b",{children:"担当者を選んで、日付を塗る"}),f.jsx("span",{className:"fl-h",children:"選択した担当者の稼働日をカレンダー上で直接追加・削除できます。確定するまでサーバーには保存されません。"})]}),f.jsx("div",{className:"mp-list",children:r.map(B=>{const K=(e[B.id]||[]).filter(O=>O>=ci).length;return f.jsxs("button",{type:"button",className:"mp"+(A===B.id?" on":""),style:A===B.id?{borderColor:B.color,background:B.color+"14"}:void 0,onClick:()=>D(B.id),children:[f.jsx("span",{className:"mp-av",style:{background:B.color},children:B.name.slice(0,1)}),f.jsxs("span",{className:"mp-tx",children:[f.jsx("b",{children:B.name}),f.jsxs("span",{className:"num",children:[ji(B.hr),"・",B.num,"番"]})]}),f.jsxs("span",{className:"mp-count num",children:[K,"日"]})]},B.id)})})]}),f.jsxs("div",{className:"card",children:[f.jsxs("div",{className:"card-h",children:[f.jsx("b",{children:"シフト表"}),f.jsx("span",{className:"meta",children:H?`${H.name} の稼働日`:"担当者を選択"})]}),f.jsx("div",{className:"shifttab-body shifttab-body--cal-only",children:f.jsx(D1,{year:W.y,month:W.m,avail:e,memberId:A,onPaint:(B,K)=>l(A,B,K),onChangeMonth:he})})]}),f.jsx(Eg,{members:r,onAdd:t,onUpdate:s,onRemove:o,sectionHint:"シフト担当者の編集と ScienceHUB アカウント紐づけ",focusRequest:$,onFocusHandled:()=>R(null)})]}),I==="member"&&f.jsx(Eg,{members:r,onAdd:t,onUpdate:s,onRemove:o,sectionHint:"印刷担当者の登録・編集・ScienceHUB 紐づけ",focusRequest:$,onFocusHandled:()=>R(null)}),I==="integ"&&f.jsx(F1,{value:y,onChange:M,onTestDiscord:E,onTestDiscordMention:w,onTestGcal:S,onTestEmail:x,emailConfigured:L,discordConfigured:N,members:r})]})]})}const k1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function z1(r){const e=String(r??"");return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function B1(r){const e=[...r].sort((o,l)=>{const d=l.desired_date.localeCompare(o.desired_date);return d!==0?d:l.created_at.localeCompare(o.created_at)}),s=[["希望日","HR","番号","氏名","タイトル","パーツ数","ステータス","担当","プリンター","STL","作成日時"].join(",")];for(const o of e)s.push([o.desired_date,o.homeroom,o.student_number,o.student_name,o.title,o.part_count??1,k1[o.status]??o.status,o.print_staff_label??"",o.printer_name??"",o.stl_filename??"",o.created_at].map(z1).join(","));return"\uFEFF"+s.join(`
`)}function j1(r){const e=B1(r),t=new Blob([e],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a"),l=new Date().toISOString().slice(0,10);o.href=s,o.download=`3dprint_history_${l}.csv`,o.click(),URL.revokeObjectURL(s)}const H1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function V1({reservations:r,onOpen:e}){const t=[...r].sort((s,o)=>{const l=o.desired_date.localeCompare(s.desired_date);return l!==0?l:o.created_at.localeCompare(s.created_at)});return t.length?f.jsxs("div",{className:"card legacy-panel",children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"0 0 10px",flexWrap:"wrap"},children:[f.jsxs("p",{className:"hint",style:{margin:0},children:["全 ",t.length," 件"]}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:!t.length,onClick:()=>j1(t),children:"CSVエクスポート"})]}),f.jsx("div",{className:"table-wrap admin-table-wrap",children:f.jsxs("table",{children:[f.jsx("thead",{children:f.jsxs("tr",{children:[f.jsx("th",{children:"希望日"}),f.jsx("th",{children:"HR"}),f.jsx("th",{children:"タイトル"}),f.jsx("th",{children:"パーツ"}),f.jsx("th",{children:"ステータス"}),f.jsx("th",{children:"担当"}),f.jsx("th",{})]})}),f.jsx("tbody",{children:t.map(s=>f.jsxs("tr",{children:[f.jsx("td",{children:s.desired_date}),f.jsx("td",{children:s.homeroom}),f.jsx("td",{children:s.title}),f.jsx("td",{children:s.part_count&&s.part_count>1?s.part_count:"—"}),f.jsx("td",{children:f.jsx("span",{className:`status-badge status-${s.status}`,children:H1[s.status]??s.status})}),f.jsx("td",{children:s.print_staff_label?`担当: ${s.print_staff_label}`:"—"}),f.jsx("td",{children:f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>e(s),children:"詳細"})})]},s.id))})]})})]}):f.jsx("p",{className:"hint admin-list-empty",children:"履歴がありません"})}function G1({selected:r,onSelect:e,title:t,description:s,badge:o,accent:l,disabled:d,"aria-label":u}){return f.jsxs("button",{type:"button",className:"dnd-pick"+(r?" on":"")+(d?" disabled":""),onClick:e,disabled:d,"aria-pressed":r,"aria-label":u??t,style:r&&l?{borderColor:l,boxShadow:`0 0 0 1px ${l}`}:void 0,children:[f.jsx("span",{className:"dnd-pick-grip","aria-hidden":"true",children:"⠿"}),f.jsxs("span",{className:"dnd-pick-body",children:[o?f.jsx("span",{className:"dnd-pick-badge",style:l?{background:l+"22",color:l}:void 0,children:o}):null,f.jsx("b",{children:t}),s?f.jsx("span",{children:s}):null]}),f.jsx("span",{className:"dnd-pick-check","aria-hidden":"true",children:r?"✓":""})]})}function W1({children:r,columns:e=2}){return f.jsx("div",{className:"dnd-pick-grid cols-"+e,children:r})}function $1({file:r,onFile:e,label:t="プリンター画像",hint:s="PNG / JPG をドラッグ＆ドロップ、またはクリックして選択",accept:o="image/*"}){const l=me.useRef(null),[d,u]=me.useState(!1),[m,p]=me.useState(null);me.useEffect(()=>{if(!r){p(null);return}const _=URL.createObjectURL(r);return p(_),()=>URL.revokeObjectURL(_)},[r]);const g=_=>{const y=_==null?void 0:_[0];!y||!y.type.startsWith("image/")||e(y)};return f.jsxs("div",{className:"imgdrop-wrap",children:[f.jsx("span",{className:"imgdrop-label",children:t}),f.jsxs("div",{className:"imgdrop"+(d?" over":"")+(r?" filled":""),onDragOver:_=>{_.preventDefault(),u(!0)},onDragLeave:()=>u(!1),onDrop:_=>{_.preventDefault(),u(!1),g(_.dataTransfer.files)},onClick:()=>{var _;return(_=l.current)==null?void 0:_.click()},role:"button",tabIndex:0,onKeyDown:_=>{var y;(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),(y=l.current)==null||y.click())},children:[f.jsx("input",{ref:l,type:"file",accept:o,className:"sr",onChange:_=>g(_.target.files)}),m?f.jsxs(f.Fragment,{children:[f.jsx("img",{className:"imgdrop-preview",src:m,alt:""}),f.jsxs("span",{className:"imgdrop-meta",children:[f.jsx("b",{children:r==null?void 0:r.name}),f.jsxs("span",{children:[(((r==null?void 0:r.size)??0)/1024).toFixed(0)," KB ・ クリックで差し替え"]})]}),f.jsx("button",{type:"button",className:"imgdrop-clear","aria-label":"画像を外す",onClick:_=>{_.stopPropagation(),e(null)},children:"×"})]}):f.jsxs(f.Fragment,{children:[f.jsx("span",{className:"imgdrop-icon","aria-hidden":"true",children:"🖼"}),f.jsxs("span",{className:"imgdrop-meta",children:[f.jsx("b",{children:s}),f.jsx("span",{children:"一覧サムネイルに表示されます（任意）"})]})]})]})]})}function X1({draft:r,setDraft:e,onCancel:t,onSave:s}){var o,l;return f.jsxs("div",{className:"printer-admin-inline-form",children:[f.jsxs("label",{className:"form-group",children:[f.jsx("span",{className:"printer-add-label",children:"名前"}),f.jsx("input",{className:"input",value:r.name,onChange:d=>e(u=>u&&{...u,name:d.target.value})})]}),f.jsxs("label",{className:"form-group",children:[f.jsx("span",{className:"printer-add-label",children:"ノズル径（カンマ区切り）"}),f.jsx("input",{className:"input",value:(((o=r.capabilities)==null?void 0:o.nozzle_sizes_mm)??[]).join(", "),onChange:d=>e(u=>u&&{...u,capabilities:{...u.capabilities,nozzle_sizes_mm:d.target.value.split(",").map(m=>m.trim()).filter(Boolean)}})})]}),f.jsxs("label",{className:"chk",children:[f.jsx("input",{type:"checkbox",checked:!!((l=r.capabilities)!=null&&l.can_record_print_video),onChange:d=>e(u=>u&&{...u,capabilities:{...u.capabilities,can_record_print_video:d.target.checked}})}),"動画撮影可"]}),f.jsx("div",{className:"form-grid",style:{gridTemplateColumns:"repeat(auto-fill, minmax(120px, 1fr))",gap:10},children:["max_small","max_small_with_main","max_medium","max_large"].map(d=>{var u;return f.jsxs("label",{children:[f.jsx("span",{className:"printer-add-label",children:d}),f.jsx("input",{className:"input",type:"number",value:((u=r.daily_capacity)==null?void 0:u[d])??0,onChange:m=>e(p=>p&&{...p,daily_capacity:{...p.daily_capacity,[d]:Number(m.target.value)}})})]},d)})}),f.jsxs("div",{className:"printer-admin-inline-actions",children:[f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:t,children:"キャンセル"}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:s,children:"保存"})]})]})}function q1({onToast:r,onReload:e}){var H;const[t,s]=me.useState([]),[o,l]=me.useState(""),[d,u]=me.useState(null),[m,p]=me.useState(""),[g,_]=me.useState(null),[y,M]=me.useState(""),[E,w]=me.useState(null),[S,x]=me.useState(null),[L,N]=me.useState(!1),[U,Y]=me.useState([]),[I,k]=me.useState(""),[$,R]=me.useState([]),A=me.useCallback(async()=>{const[B,K]=await Promise.all([Lx(),Xx()]);s(B.printers),M(K.storage_path??""),Y(K.group_roots??[])},[]);me.useEffect(()=>{A().catch(B=>r(B instanceof Error?B.message:"読み込み失敗"))},[A,r]);const D=B=>{w(B.id),x({...B,capabilities:{...B.capabilities},daily_capacity:{...B.daily_capacity}})},W=()=>{w(null),x(null)},j=async()=>{if(!d){r("機種ライン（KE / CC）を選んでください");return}const B=o.trim();if(B)try{await Dx(B,{machine_lane:d,description:m.trim()||void 0,image:g??void 0}),l(""),u(null),p(""),_(null),await A(),e==null||e(),r("プリンターを追加しました")}catch(K){r(K instanceof Error?K.message:"追加失敗")}},te=async()=>{try{await qx(y.trim()),r("印刷動画の保存先を更新しました")}catch(B){r(B instanceof Error?B.message:"保存失敗")}},oe=async()=>{var K,O;if(!S||!E)return;const B=(((K=S.capabilities)==null?void 0:K.nozzle_sizes_mm)??["0.4"]).map(String).filter(Boolean);try{await Ux(S.id,{name:S.name.trim(),capabilities:{can_record_print_video:!!((O=S.capabilities)!=null&&O.can_record_print_video),nozzle_sizes_mm:B},daily_capacity:S.daily_capacity}),W(),await A(),r("更新しました")}catch(ie){r(ie instanceof Error?ie.message:"更新失敗")}},he=async()=>{N(!0),k(""),R([])},de=async B=>{if(k(B),!B){R([]);return}const K=await Wx(B);R(K.items.map(O=>({path:O.path,name:O.name})))};return f.jsxs("div",{className:"legacy-panel ops-printers",children:[f.jsxs("section",{className:"card ops-card",id:"print-video-settings-section",children:[f.jsx("h2",{className:"section-heading",children:"印刷動画の保存先"}),f.jsx("p",{className:"hint",children:"管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。"}),f.jsxs("div",{className:"form-group",children:[f.jsx("label",{htmlFor:"print-video-storage-path",children:"保存先フォルダ"}),f.jsxs("div",{style:{display:"flex",gap:8},children:[f.jsx("input",{id:"print-video-storage-path",className:"input",value:y,readOnly:!0,placeholder:"未設定（参照から選択）"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void he(),children:"参照…"})]})]}),f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void te(),children:"保存先を保存"})]}),f.jsxs("section",{className:"card ops-card",children:[f.jsx("h2",{className:"section-heading",children:"プリンター管理"}),f.jsx("p",{className:"hint ops-lead",children:"登録済みプリンターの編集・削除、および新規追加ができます。"}),f.jsx("div",{className:"printer-admin-grid",children:t.map(B=>{var O,ie,De;const K=E===B.id&&S;return f.jsxs("article",{className:`printer-admin-card${K?" printer-admin-card-editing":""}`,children:[B.image_url?f.jsx("img",{className:"printer-admin-image",src:B.image_url,alt:""}):f.jsx("div",{className:"printer-admin-image printer-admin-image-placeholder",children:"🖨️"}),f.jsx("div",{className:"printer-admin-body",children:K?f.jsxs(f.Fragment,{children:[f.jsxs("h3",{className:"printer-admin-title",children:[S.name," を編集"]}),f.jsx(X1,{draft:S,setDraft:x,onCancel:W,onSave:()=>void oe()})]}):f.jsxs(f.Fragment,{children:[f.jsx("h3",{className:"printer-admin-title",children:B.name}),f.jsxs("p",{className:"hint printer-admin-cap-summary",children:[((O=B.machine_lane)==null?void 0:O.toUpperCase())??"—"," / ノズル"," ",(((ie=B.capabilities)==null?void 0:ie.nozzle_sizes_mm)??[]).join(", ")||"—"," /"," ",(De=B.capabilities)!=null&&De.can_record_print_video?"動画撮影可":"動画撮影不可"]}),B.description?f.jsx("p",{className:"hint printer-admin-desc",children:B.description}):null,f.jsxs("div",{className:"printer-admin-actions",children:[f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>D(B),children:"編集"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{confirm(`「${B.name}」を削除しますか？`)&&(E===B.id&&W(),Fx(B.id).then(A).then(()=>r("削除しました")).catch(Q=>r(Q instanceof Error?Q.message:"削除失敗")))},children:"削除"}),f.jsxs("label",{className:"btn btn-secondary btn-sm",children:["画像",f.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:Q=>{var Me;const pe=(Me=Q.target.files)==null?void 0:Me[0];pe&&Ix(B.id,pe).then(A).catch(ve=>r(ve instanceof Error?ve.message:"画像失敗")),Q.target.value=""}})]})]})]})})]},B.id)})}),f.jsxs("div",{className:"printer-add-card","data-testid":"printer-add-form",children:[f.jsxs("div",{className:"printer-add-head",children:[f.jsx("h3",{children:"機種（プリンター）を追加"}),f.jsx("p",{className:"hint",children:"物理プリンター本体を新規登録します。ここで選ぶ「機種」は、予約カレンダーの時間枠への割当ではなく、 そのプリンターが属する機種ライン（KE 系 / CC 系）の分類です。"})]}),f.jsxs("div",{className:"printer-add-block",children:[f.jsx("span",{className:"printer-add-label",children:"機種ライン（KE / CC）"}),f.jsx(W1,{children:Bl.map(B=>f.jsx(G1,{selected:d===B.id,badge:B.short,accent:B.id==="ke"?"var(--color-primary)":"var(--color-tip)",title:B.name,description:`${B.maker} ・ ${B.hint}`,onSelect:()=>{u(B.id),o.trim()||l(`${B.short} `)}},B.id))})]}),f.jsxs("div",{className:"printer-add-block",children:[f.jsx("label",{className:"printer-add-label",htmlFor:"printer-add-description",children:"説明書き（任意）"}),f.jsx("textarea",{id:"printer-add-description",className:"input printer-add-description",rows:3,maxLength:2e3,placeholder:"設置場所、フィラメント、注意事項など（機種・プリンターに関する説明）",value:m,onChange:B=>p(B.target.value)})]}),f.jsxs("div",{className:"printer-add-block",children:[f.jsx("label",{className:"printer-add-label",htmlFor:"printer-add-name",children:"表示名"}),f.jsx("input",{id:"printer-add-name",className:"input printer-add-name",placeholder:d?`${((H=Bl.find(B=>B.id===d))==null?void 0:H.short)??""} 3号機`:"例: KE 3号機",value:o,onChange:B=>l(B.target.value)})]}),f.jsx("div",{className:"printer-add-block",children:f.jsx($1,{file:g,onFile:_})}),f.jsx("div",{className:"printer-add-actions",children:f.jsx("button",{type:"button",className:"btn btn-primary btn-lg",disabled:!d||!o.trim(),onClick:()=>void j(),children:"プリンターを追加"})})]})]}),L&&f.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[f.jsx("div",{className:"legacy-modal-scrim",onClick:()=>N(!1)}),f.jsxs("div",{className:"legacy-modal-body card",children:[f.jsx("h2",{children:"保存先フォルダ"}),f.jsx("p",{className:"hint",children:I||"チームを選んでください"}),f.jsxs("div",{style:{display:"grid",gap:6,maxHeight:280,overflow:"auto"},children:[!I&&U.map(B=>f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void de(B.path),children:B.label},B.path)),I&&f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void de(""),children:"チームへ戻る"}),$.map(B=>f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void de(B.path),children:B.name},B.path))]}),f.jsxs("div",{className:"legacy-modal-actions",children:[f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>N(!1),children:"閉じる"}),f.jsx("button",{type:"button",className:"btn btn-primary",disabled:!I,onClick:()=>{M(I),N(!1)},children:"このフォルダを選択"})]})]})]})]})}const Y1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function K1({reservation:r,onClose:e,onToast:t,onUpdated:s}){const[o,l]=me.useState(!1);if(me.useEffect(()=>{l(!!(r!=null&&r.has_print_video))},[r]),!r)return null;const d=async m=>{try{await Yx(r.id,m),l(!0),t("印刷動画をアップロードしました"),s()}catch(p){t(p instanceof Error?p.message:"アップロード失敗")}},u=async()=>{try{await Kx(r.id),l(!1),t("印刷動画を削除しました"),s()}catch(m){t(m instanceof Error?m.message:"削除失敗")}};return f.jsxs(K0,{open:!!r,title:r.title,sub:`${r.desired_date} · ${r.printer_name??""}`,onClose:e,footer:f.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[f.jsxs("dl",{className:"kv",children:[f.jsxs("div",{children:[f.jsx("dt",{children:"ステータス"}),f.jsx("dd",{children:Y1[r.status]??r.status})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"申請者"}),f.jsxs("dd",{children:[r.student_name,"（",r.homeroom," · ",r.student_number,"）"]})]}),f.jsxs("div",{children:[f.jsx("dt",{children:"担当"}),f.jsx("dd",{children:r.print_staff_label??"—"})]}),(r.part_count??1)>1?f.jsxs("div",{children:[f.jsx("dt",{children:"パーツ数"}),f.jsx("dd",{children:r.part_count})]}):null]}),f.jsx("div",{className:"ftitle",children:"印刷動画"}),o?f.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[f.jsx("a",{className:"btn btn-secondary btn-sm",href:Zx(r.id),download:!0,children:"動画をダウンロード"}),f.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void u(),children:"動画を削除"})]}):f.jsx("p",{className:"hint",children:"未アップロード"}),f.jsx("input",{type:"file",accept:"video/*",onChange:m=>{var g;const p=(g=m.target.files)==null?void 0:g[0];p&&d(p)}}),f.jsx("div",{style:{marginTop:12,display:"flex",gap:8},children:f.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void wd(r.id,{status:"delivered"}).then(s).then(()=>t("完了にしました")).catch(m=>t(m instanceof Error?m.message:"更新失敗")),children:"完了にする"})})]})}function Z1({showToast:r}){const[e,t]=me.useState("printers"),[s,o]=me.useState(null),[l,d]=me.useState(0),[u,m]=me.useState([]);me.useEffect(()=>{Px().then(m)},[l]);const p=g=>r(g);return f.jsxs("div",{className:"set-wrap",children:[f.jsxs("div",{className:"set-tabs",role:"tablist",children:[f.jsx("button",{type:"button",role:"tab",className:e==="printers"?"on":"",onClick:()=>t("printers"),children:"プリンター"}),f.jsx("button",{type:"button",role:"tab",className:e==="history"?"on":"",onClick:()=>t("history"),children:"印刷履歴"})]}),e==="printers"?f.jsx(q1,{onToast:p,onReload:()=>d(g=>g+1)},l):f.jsx(V1,{reservations:u,onOpen:g=>o(g)}),f.jsx(K1,{reservation:s,onClose:()=>o(null),onToast:p,onUpdated:()=>d(g=>g+1)})]})}function J1(){const r=Og(),[e,t]=me.useState(!0),[s,o]=me.useState([]),[l,d]=me.useState([]),[u,m]=me.useState({}),[p,g]=me.useState({}),_=me.useRef(u),y=me.useRef(p);_.current=u,y.current=p;const[M,E]=me.useState(!1),[w,S]=me.useState(()=>r.screen||"reserve"),[x,L]=me.useState(()=>r.selected||ci),[N,U]=me.useState(null),[Y,I]=me.useState(()=>h0()??I0()),[k,$]=me.useState(()=>d0()),[R,A]=me.useState(null),[D,W]=me.useState(null),[j,te]=me.useState(null),[oe,he]=me.useState(null),[de,H]=me.useState(!1),[B,K]=me.useState(null),[O,ie]=me.useState(null),[De,Q]=me.useState(!1),[pe,Me]=me.useState(!1),ve=me.useCallback((b,V)=>{n0(b),fl(V)},[]),Le=me.useCallback(async b=>{const{from:V,to:q}=N0(b),[{applications:fe},_e]=await Promise.all([Sx(V,q),xx(V,q)]),Ye=new Map;for(const $e of fe)Ye.set($e.id,Zp($e));for(const $e of _e.applications)Ye.set($e.id,Zp($e));d([...Ye.values()])},[]),Fe=me.useCallback(async()=>{var Ye;const b=await Mx(),V=b0(b);o(V);const q=zn(x),fe=await Op(q.getFullYear(),q.getMonth()+1),_e=Vg(fe.availability);m(_e),g(_e),ve(V,_e);try{U(await Dp())}catch{}await Le(x);try{const $e=await zx();Q(!!$e.email.configured),Me(!!$e.discord.configured),I(pt=>({...pt,discord:{...pt.discord,webhook:$e.discord.configured?"(サーバー設定)":""},gcal:{...pt.gcal,calendarId:$e.gcal.configured?"(サーバー設定)":""}}))}catch{}try{const $e=await Gx(80);(Ye=$e.log)!=null&&Ye.length&&$($e.log.map(pt=>({id:pt.id,at:pt.at,actor:pt.actor,type:pt.type,text:pt.text,appId:pt.app_id})))}catch{}},[Le,x,ve]);me.useEffect(()=>{(async()=>{try{await Fe()}catch(b){gt.current(b instanceof Error?b.message:"読み込みに失敗しました","エラー")}finally{t(!1)}})()},[Fe]),me.useEffect(()=>{if(e)return;const b=new URLSearchParams(window.location.search),V=b.get("selected"),q=b.get("app");if(V&&/^\d{4}-\d{2}-\d{2}$/.test(V)&&L(V),q){const fe=l.find(_e=>_e.id===q);fe&&(L(fe.date),A(fe),W("view"))}},[e,l]),me.useEffect(()=>{u0({screen:w,selected:x})},[w,x]),me.useEffect(()=>{p0(Y)},[Y]),me.useEffect(()=>{f0(k)},[k]);const Z=N?U0(N):"—",gt=me.useRef(()=>{}),Ae=me.useCallback((b,V)=>{ie({text:b,mark:V}),window.setTimeout(()=>ie(null),2600)},[]);gt.current=Ae;const nt=me.useCallback((b,V,q=null)=>{$(fe=>[{id:"l"+Date.now()+Math.random().toString(36).slice(2,5),at:new Date().toISOString(),actor:Z,type:b,text:V,appId:q},...fe]),Vx({type:b,text:V,app_id:q}).catch(()=>{})},[Z]),Xe=(b,V)=>{A(b),W(V??null)},lt=()=>{A(null),W(null)},it=(b,V)=>{d(q=>q.map(fe=>fe.id===b?{...fe,...V}:fe)),A(q=>q&&q.id===b?{...q,...V}:q)},ot=async(b,V,q,fe)=>{if(fe!==void 0&&V===null){try{await wd(b.id,{status_comment:fe}),it(b.id,{adminNote:fe}),nt("approve",`「${b.title}」に担当者メモを追加`,b.id),Ae("担当者メモを保存しました")}catch(_e){Ae(_e instanceof Error?_e.message:"保存に失敗しました","エラー")}return}if(V)try{if(V==="approved"&&b.status==="pending")throw new Error("承認は担当者を選ぶダイアログから行ってください");b.status==="cancelled"&&V==="pending"?await yx(b.id):await wd(b.id,{status:R0(V)}),it(b.id,{status:V,...q||{},by:Z});const _e=Qs[V];nt(V==="cancelled"?"cancel":"approve",`「${b.title}」を${_e}（${Ga(b.date)}・${li[b.kind]}）`,b.id),Ae(`${b.title} を${_e}にしました`,_e),await Le(x)}catch(_e){Ae(_e instanceof Error?_e.message:"更新に失敗しました","エラー")}},Tt=async(b,V,q,fe)=>{const _e=Hd(b);if(V.length===_e.length){await ot(b,q,fe);return}try{await kx(b.id,{slot_indexes:V,target_status:q});const $e=Qs[q],pt=`${qt(Qa(V[0]))}〜${qt(Qa(V[V.length-1])+Js)}`;nt(q==="cancelled"?"cancel":"approve",`「${b.title}」の ${pt}（${V.length}枠）を${$e}`,b.id),Ae(`${pt} を${$e}にしました`,`${V.length}枠`),lt(),await Le(x)}catch($e){Ae($e instanceof Error?$e.message:"部分更新に失敗しました","エラー")}},z=b=>{he({app:b})},C=async b=>{if(!oe||de)return;const{app:V}=oe;H(!0);try{await Cx(V.id,b),it(V.id,{status:"approved",by:Z}),nt("approve",`「${V.title}」を承認（${Ga(V.date)}・${li[V.kind]}）`,V.id),Ae(`${V.title} を承認しました`,"承認"),await Le(x),(R==null?void 0:R.id)===V.id&&lt(),he(null)}catch(q){Ae(q instanceof Error?q.message:"承認に失敗しました","エラー")}finally{H(!1)}},ce=async(b,V,q,fe)=>{if(fe==="note"){await ot(b,null,void 0,q);return}if(fe==="approved"){z(b);return}if(fe==="pending"||fe==="done"){await ot(b,fe);return}const _e=V?q||V.body:q;await ot(b,"cancelled",V?{rejectReason:V.id,adminNote:_e}:{adminNote:_e})},ge=async(b,V,q)=>{if(!V||V===b.date)return;const fe=b.date;try{await Ox(b.id,V,!!(q!=null&&q.forced)),nt("move",`「${b.title}」を ${Ga(fe)} → ${Ga(V)} に変更（${li[b.kind]}${q!=null&&q.forced?"・強制":""}）`,b.id),Ae(`${b.title} を ${Hg(V)} に変更しました`,q!=null&&q.forced?"強制":li[b.kind]),L(V),te(null),lt(),await Le(V)}catch(_e){Ae(_e instanceof Error?_e.message:"移動に失敗しました","エラー")}},Se=async b=>{try{const V=await wx({name:b.name,homeroom:b.hr,student_number:b.num,discord_user_id:b.discord||null});b.hubUserId&&await Up(V.member.id,b.hubUserId),await Bp(V.member.id,Kp(b.color)),await Fe(),nt("member",`担当者「${b.name}」を追加`,null),Ae(`${b.name} を追加しました`)}catch(V){Ae(V instanceof Error?V.message:"追加に失敗しました","エラー")}},Ee=async(b,V)=>{try{await Bp(b,Kp(V.color)),await $x(b,V.discord.trim()||null),await Up(b,V.hubUserId),await Fe();try{U(await Dp())}catch{}const q=Qr(b);nt("member",`担当者「${q?q.name:b}」を更新`,null),Ae(`${V.name} を更新しました`)}catch(q){Ae(q instanceof Error?q.message:"更新に失敗しました","エラー")}},We=async b=>{try{const V=Qr(b);await Tx(b),await Fe(),nt("member",`担当者「${V?V.name:b}」を削除（シフトも削除）`,null),Ae(`${V?V.name:"担当者"} を削除しました`)}catch(V){Ae(V instanceof Error?V.message:"削除に失敗しました","エラー")}},Re=(b,V,q)=>{m(fe=>{const _e=new Set(fe[b]||[]);V.forEach($e=>q?_e.add($e):_e.delete($e));const Ye={...fe,[b]:[..._e].sort()};return fl(Ye),Ye})},Ce=Ax(Xs(p),Xs(u),[],[]),tt=me.useMemo(()=>D0(p,u),[p,u]),be=()=>{const b={};for(const[V,q]of Object.entries(p))b[V]=[...q];m(b),fl(b)},He=async()=>{if(!(!Ce||M)){E(!0);try{await bx(Xs(p),Xs(u),[],[]),g(()=>{const b={};for(const[V,q]of Object.entries(u))b[V]=[...q];return b}),nt("shift","シフト表を一括保存",null),Ae("シフトを保存しました","確定")}catch(b){Ae(b instanceof Error?b.message:"シフト保存に失敗しました","エラー"),await Fe()}finally{E(!1)}}},ct=me.useCallback(async(b,V)=>{try{const q=await Op(b,V),fe=L0(_.current,y.current,q.availability,b,V);g(fe.saved),m(fe.avail),fl(fe.avail)}catch(q){gt.current(q instanceof Error?q.message:"シフト読込に失敗しました","エラー")}},[]),qe=async()=>{Ae("Discordへテスト送信しています…");try{await Bx(),nt("integ","Discordへテスト通知を送信",null),Ae("Discordへ送信しました","成功")}catch(b){Ae(b instanceof Error?b.message:"送信に失敗しました","エラー")}},Ie=async b=>{const V=await jx(b),q=V.sent.map(fe=>fe.name).join("・");return nt("integ",`Discordメンションテスト: ${q}`,null),V},st=async()=>{try{const b=await Rx();b.ok?(nt("integ","Googleカレンダー接続テスト成功",null),Ae("Googleカレンダーに接続できました","接続OK")):Ae(b.error||"接続に失敗しました","エラー")}catch(b){Ae(b instanceof Error?b.message:"接続テストに失敗しました","エラー")}},ht=async b=>{const V=await Hx(b);return nt("integ",`テストメールを ${V.to} に送信`,null),V},bt=()=>{const b=Ng(zn(x)),V=kl(b,27),q=F0(l,Yn(b),Yn(V),s.map($e=>({id:$e.id,name:$e.name}))),fe=new Blob([q],{type:"text/csv;charset=utf-8"}),_e=URL.createObjectURL(fe),Ye=document.createElement("a");Ye.href=_e,Ye.download=`3dprint_${Yn(b)}_${Yn(V)}.csv`,document.body.appendChild(Ye),Ye.click(),Ye.remove(),window.setTimeout(()=>URL.revokeObjectURL(_e),1e3),Ae("CSVを書き出しました",`${Wp(b)}–${Wp(V)}`)},rt=s0(l);return e?f.jsx("main",{className:"main-content","data-testid":"management-loading",children:f.jsx(bg,{testId:"management-app-loading"})}):f.jsxs(f.Fragment,{children:[f.jsx(V0,{screen:w,setScreen:S,operatorSession:N,pendingCount:rt.length,onCsv:bt}),f.jsxs("main",{className:"main-content","data-testid":"management-app",children:[f.jsx("div",{className:"page-head",children:f.jsxs("div",{style:{minWidth:0},children:[f.jsx("span",{className:"badge",children:"自然科学部 3Dモデル班"}),f.jsx("h1",{className:"page-heading",children:w==="reserve"?"3Dプリント 申請の管理":w==="settings"?"シフト・担当者・外部連携":"運用（プリンター・履歴）"})]})}),w==="reserve"?f.jsx(C1,{apps:l,selected:x,onPick:L,onOpen:Xe,onApprove:b=>z(b),onCancel:(b,V,q,fe)=>void ce(b,V,q,fe),onPartial:(b,V,q,fe)=>void Tt(b,V,q,fe),log:k,onDownload:(b,V)=>{V==="file"?(window.open(`/api/3dprint/admin/stl/${b.id}`,"_blank"),Ae(`${b.title} をダウンロードしました`,b.file??"3Dモデル")):V==="form"?(window.open(`/api/3dprint/admin/reservations/${b.id}/application-form.pdf`,"_blank"),Ae(`${b.title} をダウンロードしました`,"申請PDF")):(z0(b,V),Ae(`${b.title} をダウンロードしました`,"申請書"))},onDownloadAll:b=>{const V=B0(l,b);Ae(`${Ga(b)} の申請 ${V}件を書き出しました`,"一括DL")},onMove:b=>te(b)}):w==="settings"?f.jsx(O1,{members:s,avail:u,onAddMember:b=>void Se(b),onUpdateMember:(b,V)=>void Ee(b,V),onRemoveMember:b=>void We(b),onPaintAvail:Re,shiftDraftPending:Ce,shiftDraftSummary:tt,shiftApplying:M,onConfirmShiftDraft:()=>void He(),onDiscardShiftDraft:be,onLoadShiftMonth:ct,integrations:Y,setIntegrations:I,onTestDiscord:()=>void qe(),onTestDiscordMention:Ie,onTestGcal:()=>void st(),onTestEmail:ht,emailConfigured:De,discordConfigured:pe,log:k,pendingPre:B}):f.jsx(Z1,{showToast:Ae})]}),f.jsx("footer",{className:"site-footer",children:f.jsxs("div",{className:"footer-inner",children:[f.jsx("img",{src:Gg,alt:""}),f.jsxs("div",{className:"club",children:[f.jsx("b",{children:"松山南高校 自然科学部 / 3Dモデル班"}),f.jsx("span",{children:"承認・取り消しは担当者のみ。操作は記録されます。"})]}),f.jsxs("div",{className:"right",children:[f.jsx("a",{href:"/apps/3dprint-reservation/",children:"申請フォーム（生徒用）"}),f.jsx("a",{href:"mailto:diorama@mmh-virtual.jp",children:"diorama@mmh-virtual.jp"})]})]})}),f.jsx(b1,{app:R,log:k,onClose:lt,onPartial:(b,V,q,fe)=>void Tt(b,V,q,fe),onCancelAll:(b,V,q,fe)=>void ce(b,V,q,fe),onApproveRequest:b=>z(b),onMove:b=>te(b)}),f.jsx(N1,{open:!!oe,app:(oe==null?void 0:oe.app)??null,members:s,busy:de,onClose:()=>!de&&he(null),onConfirm:b=>void C(b)}),f.jsx(L1,{open:!!j,app:j,apps:l,onClose:()=>te(null),onMove:ge}),f.jsx(q0,{toast:O})]})}function Q1(){const[r,e]=me.useState(!1),[t,s]=me.useState(!1);return me.useEffect(()=>{(async()=>{const o=await _x();if(o==="login"){const l=encodeURIComponent(window.location.pathname+window.location.search);window.location.href=`/login/?next=${l}`;return}if(o==="denied"){s(!0);return}e(!0)})()},[]),t?f.jsxs("main",{style:{padding:"2rem",fontFamily:"Inter, sans-serif"},children:[f.jsx("h1",{children:"アクセス拒否"}),f.jsx("p",{children:"3D印刷管理アプリを利用する権限がありません。"}),f.jsx("p",{children:f.jsx("a",{href:"/",children:"ダッシュボードに戻る"})})]}):r?f.jsx(J1,{}):f.jsx("main",{className:"main-content","data-testid":"management-access-loading",children:f.jsx(bg,{})})}document.body.classList.add("admin-app");gx.createRoot(document.getElementById("root")).render(f.jsx(me.StrictMode,{children:f.jsx(Q1,{})}));
