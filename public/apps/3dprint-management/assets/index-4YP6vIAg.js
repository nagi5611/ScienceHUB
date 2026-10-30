var ax=Object.defineProperty;var ox=(r,e,t)=>e in r?ax(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Va=(r,e,t)=>ox(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const f of l.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function lx(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var zu={exports:{}},Ga={},Bu={exports:{}},mt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Tp;function cx(){if(Tp)return mt;Tp=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),f=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),_=Symbol.iterator;function x(k){return k===null||typeof k!="object"?null:(k=_&&k[_]||k["@@iterator"],typeof k=="function"?k:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,w={};function S(k,re,Ue){this.props=k,this.context=re,this.refs=w,this.updater=Ue||M}S.prototype.isReactComponent={},S.prototype.setState=function(k,re){if(typeof k!="object"&&typeof k!="function"&&k!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,k,re,"setState")},S.prototype.forceUpdate=function(k){this.updater.enqueueForceUpdate(this,k,"forceUpdate")};function y(){}y.prototype=S.prototype;function L(k,re,Ue){this.props=k,this.context=re,this.refs=w,this.updater=Ue||M}var N=L.prototype=new y;N.constructor=L,E(N,S.prototype),N.isPureReactComponent=!0;var U=Array.isArray,Y=Object.prototype.hasOwnProperty,I={current:null},O={key:!0,ref:!0,__self:!0,__source:!0};function W(k,re,Ue){var ne,pe={},we=null,_e=null;if(re!=null)for(ne in re.ref!==void 0&&(_e=re.ref),re.key!==void 0&&(we=""+re.key),re)Y.call(re,ne)&&!O.hasOwnProperty(ne)&&(pe[ne]=re[ne]);var Le=arguments.length-2;if(Le===1)pe.children=Ue;else if(1<Le){for(var Fe=Array(Le),Z=0;Z<Le;Z++)Fe[Z]=arguments[Z+2];pe.children=Fe}if(k&&k.defaultProps)for(ne in Le=k.defaultProps,Le)pe[ne]===void 0&&(pe[ne]=Le[ne]);return{$$typeof:r,type:k,key:we,ref:_e,props:pe,_owner:I.current}}function R(k,re){return{$$typeof:r,type:k.type,key:re,ref:k.ref,props:k.props,_owner:k._owner}}function A(k){return typeof k=="object"&&k!==null&&k.$$typeof===r}function D(k){var re={"=":"=0",":":"=2"};return"$"+k.replace(/[=:]/g,function(Ue){return re[Ue]})}var G=/\/+/g;function B(k,re){return typeof k=="object"&&k!==null&&k.key!=null?D(""+k.key):re.toString(36)}function te(k,re,Ue,ne,pe){var we=typeof k;(we==="undefined"||we==="boolean")&&(k=null);var _e=!1;if(k===null)_e=!0;else switch(we){case"string":case"number":_e=!0;break;case"object":switch(k.$$typeof){case r:case e:_e=!0}}if(_e)return _e=k,pe=pe(_e),k=ne===""?"."+B(_e,0):ne,U(pe)?(Ue="",k!=null&&(Ue=k.replace(G,"$&/")+"/"),te(pe,re,Ue,"",function(Z){return Z})):pe!=null&&(A(pe)&&(pe=R(pe,Ue+(!pe.key||_e&&_e.key===pe.key?"":(""+pe.key).replace(G,"$&/")+"/")+k)),re.push(pe)),1;if(_e=0,ne=ne===""?".":ne+":",U(k))for(var Le=0;Le<k.length;Le++){we=k[Le];var Fe=ne+B(we,Le);_e+=te(we,re,Ue,Fe,pe)}else if(Fe=x(k),typeof Fe=="function")for(k=Fe.call(k),Le=0;!(we=k.next()).done;)we=we.value,Fe=ne+B(we,Le++),_e+=te(we,re,Ue,Fe,pe);else if(we==="object")throw re=String(k),Error("Objects are not valid as a React child (found: "+(re==="[object Object]"?"object with keys {"+Object.keys(k).join(", ")+"}":re)+"). If you meant to render a collection of children, use an array instead.");return _e}function le(k,re,Ue){if(k==null)return k;var ne=[],pe=0;return te(k,ne,"","",function(we){return re.call(Ue,we,pe++)}),ne}function X(k){if(k._status===-1){var re=k._result;re=re(),re.then(function(Ue){(k._status===0||k._status===-1)&&(k._status=1,k._result=Ue)},function(Ue){(k._status===0||k._status===-1)&&(k._status=2,k._result=Ue)}),k._status===-1&&(k._status=0,k._result=re)}if(k._status===1)return k._result.default;throw k._result}var ce={current:null},j={transition:null},K={ReactCurrentDispatcher:ce,ReactCurrentBatchConfig:j,ReactCurrentOwner:I};function Q(){throw Error("act(...) is not supported in production builds of React.")}return mt.Children={map:le,forEach:function(k,re,Ue){le(k,function(){re.apply(this,arguments)},Ue)},count:function(k){var re=0;return le(k,function(){re++}),re},toArray:function(k){return le(k,function(re){return re})||[]},only:function(k){if(!A(k))throw Error("React.Children.only expected to receive a single React element child.");return k}},mt.Component=S,mt.Fragment=t,mt.Profiler=o,mt.PureComponent=L,mt.StrictMode=s,mt.Suspense=m,mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K,mt.act=Q,mt.cloneElement=function(k,re,Ue){if(k==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+k+".");var ne=E({},k.props),pe=k.key,we=k.ref,_e=k._owner;if(re!=null){if(re.ref!==void 0&&(we=re.ref,_e=I.current),re.key!==void 0&&(pe=""+re.key),k.type&&k.type.defaultProps)var Le=k.type.defaultProps;for(Fe in re)Y.call(re,Fe)&&!O.hasOwnProperty(Fe)&&(ne[Fe]=re[Fe]===void 0&&Le!==void 0?Le[Fe]:re[Fe])}var Fe=arguments.length-2;if(Fe===1)ne.children=Ue;else if(1<Fe){Le=Array(Fe);for(var Z=0;Z<Fe;Z++)Le[Z]=arguments[Z+2];ne.children=Le}return{$$typeof:r,type:k.type,key:pe,ref:we,props:ne,_owner:_e}},mt.createContext=function(k){return k={$$typeof:f,_currentValue:k,_currentValue2:k,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},k.Provider={$$typeof:l,_context:k},k.Consumer=k},mt.createElement=W,mt.createFactory=function(k){var re=W.bind(null,k);return re.type=k,re},mt.createRef=function(){return{current:null}},mt.forwardRef=function(k){return{$$typeof:d,render:k}},mt.isValidElement=A,mt.lazy=function(k){return{$$typeof:g,_payload:{_status:-1,_result:k},_init:X}},mt.memo=function(k,re){return{$$typeof:p,type:k,compare:re===void 0?null:re}},mt.startTransition=function(k){var re=j.transition;j.transition={};try{k()}finally{j.transition=re}},mt.unstable_act=Q,mt.useCallback=function(k,re){return ce.current.useCallback(k,re)},mt.useContext=function(k){return ce.current.useContext(k)},mt.useDebugValue=function(){},mt.useDeferredValue=function(k){return ce.current.useDeferredValue(k)},mt.useEffect=function(k,re){return ce.current.useEffect(k,re)},mt.useId=function(){return ce.current.useId()},mt.useImperativeHandle=function(k,re,Ue){return ce.current.useImperativeHandle(k,re,Ue)},mt.useInsertionEffect=function(k,re){return ce.current.useInsertionEffect(k,re)},mt.useLayoutEffect=function(k,re){return ce.current.useLayoutEffect(k,re)},mt.useMemo=function(k,re){return ce.current.useMemo(k,re)},mt.useReducer=function(k,re,Ue){return ce.current.useReducer(k,re,Ue)},mt.useRef=function(k){return ce.current.useRef(k)},mt.useState=function(k){return ce.current.useState(k)},mt.useSyncExternalStore=function(k,re,Ue){return ce.current.useSyncExternalStore(k,re,Ue)},mt.useTransition=function(){return ce.current.useTransition()},mt.version="18.3.1",mt}var Ap;function kd(){return Ap||(Ap=1,Bu.exports=cx()),Bu.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bp;function ux(){if(bp)return Ga;bp=1;var r=kd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function f(d,m,p){var g,_={},x=null,M=null;p!==void 0&&(x=""+p),m.key!==void 0&&(x=""+m.key),m.ref!==void 0&&(M=m.ref);for(g in m)s.call(m,g)&&!l.hasOwnProperty(g)&&(_[g]=m[g]);if(d&&d.defaultProps)for(g in m=d.defaultProps,m)_[g]===void 0&&(_[g]=m[g]);return{$$typeof:e,type:d,key:x,ref:M,props:_,_owner:o.current}}return Ga.Fragment=t,Ga.jsx=f,Ga.jsxs=f,Ga}var Cp;function dx(){return Cp||(Cp=1,zu.exports=ux()),zu.exports}var u=dx(),fx=kd();const me=lx(fx);var ul={},ju={exports:{}},bn={},Hu={exports:{}},Vu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rp;function hx(){return Rp||(Rp=1,(function(r){function e(j,K){var Q=j.length;j.push(K);e:for(;0<Q;){var k=Q-1>>>1,re=j[k];if(0<o(re,K))j[k]=K,j[Q]=re,Q=k;else break e}}function t(j){return j.length===0?null:j[0]}function s(j){if(j.length===0)return null;var K=j[0],Q=j.pop();if(Q!==K){j[0]=Q;e:for(var k=0,re=j.length,Ue=re>>>1;k<Ue;){var ne=2*(k+1)-1,pe=j[ne],we=ne+1,_e=j[we];if(0>o(pe,Q))we<re&&0>o(_e,pe)?(j[k]=_e,j[we]=Q,k=we):(j[k]=pe,j[ne]=Q,k=ne);else if(we<re&&0>o(_e,Q))j[k]=_e,j[we]=Q,k=we;else break e}}return K}function o(j,K){var Q=j.sortIndex-K.sortIndex;return Q!==0?Q:j.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var f=Date,d=f.now();r.unstable_now=function(){return f.now()-d}}var m=[],p=[],g=1,_=null,x=3,M=!1,E=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function N(j){for(var K=t(p);K!==null;){if(K.callback===null)s(p);else if(K.startTime<=j)s(p),K.sortIndex=K.expirationTime,e(m,K);else break;K=t(p)}}function U(j){if(w=!1,N(j),!E)if(t(m)!==null)E=!0,X(Y);else{var K=t(p);K!==null&&ce(U,K.startTime-j)}}function Y(j,K){E=!1,w&&(w=!1,y(W),W=-1),M=!0;var Q=x;try{for(N(K),_=t(m);_!==null&&(!(_.expirationTime>K)||j&&!D());){var k=_.callback;if(typeof k=="function"){_.callback=null,x=_.priorityLevel;var re=k(_.expirationTime<=K);K=r.unstable_now(),typeof re=="function"?_.callback=re:_===t(m)&&s(m),N(K)}else s(m);_=t(m)}if(_!==null)var Ue=!0;else{var ne=t(p);ne!==null&&ce(U,ne.startTime-K),Ue=!1}return Ue}finally{_=null,x=Q,M=!1}}var I=!1,O=null,W=-1,R=5,A=-1;function D(){return!(r.unstable_now()-A<R)}function G(){if(O!==null){var j=r.unstable_now();A=j;var K=!0;try{K=O(!0,j)}finally{K?B():(I=!1,O=null)}}else I=!1}var B;if(typeof L=="function")B=function(){L(G)};else if(typeof MessageChannel<"u"){var te=new MessageChannel,le=te.port2;te.port1.onmessage=G,B=function(){le.postMessage(null)}}else B=function(){S(G,0)};function X(j){O=j,I||(I=!0,B())}function ce(j,K){W=S(function(){j(r.unstable_now())},K)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(j){j.callback=null},r.unstable_continueExecution=function(){E||M||(E=!0,X(Y))},r.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<j?Math.floor(1e3/j):5},r.unstable_getCurrentPriorityLevel=function(){return x},r.unstable_getFirstCallbackNode=function(){return t(m)},r.unstable_next=function(j){switch(x){case 1:case 2:case 3:var K=3;break;default:K=x}var Q=x;x=K;try{return j()}finally{x=Q}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(j,K){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var Q=x;x=j;try{return K()}finally{x=Q}},r.unstable_scheduleCallback=function(j,K,Q){var k=r.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?k+Q:k):Q=k,j){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=Q+re,j={id:g++,callback:K,priorityLevel:j,startTime:Q,expirationTime:re,sortIndex:-1},Q>k?(j.sortIndex=Q,e(p,j),t(m)===null&&j===t(p)&&(w?(y(W),W=-1):w=!0,ce(U,Q-k))):(j.sortIndex=re,e(m,j),E||M||(E=!0,X(Y))),j},r.unstable_shouldYield=D,r.unstable_wrapCallback=function(j){var K=x;return function(){var Q=x;x=K;try{return j.apply(this,arguments)}finally{x=Q}}}})(Vu)),Vu}var Np;function px(){return Np||(Np=1,Hu.exports=hx()),Hu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pp;function mx(){if(Pp)return bn;Pp=1;var r=kd(),e=px();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){f(n,i),f(n+"Capture",i)}function f(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),m=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},_={};function x(n){return m.call(_,n)?!0:m.call(g,n)?!1:p.test(n)?_[n]=!0:(g[n]=!0,!1)}function M(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function E(n,i,a,c){if(i===null||typeof i>"u"||M(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(n,i,a,c,h,v,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=v,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new w(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var y=/[\-:]([a-z])/g;function L(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(y,L);S[i]=new w(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(y,L);S[i]=new w(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(y,L);S[i]=new w(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function N(n,i,a,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,a,h,c)&&(a=null),c||h===null?x(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):h.mustUseProperty?n[h.propertyName]=a===null?h.type===3?!1:"":a:(i=h.attributeName,c=h.attributeNamespace,a===null?n.removeAttribute(i):(h=h.type,a=h===3||h===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var U=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Y=Symbol.for("react.element"),I=Symbol.for("react.portal"),O=Symbol.for("react.fragment"),W=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),A=Symbol.for("react.provider"),D=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),B=Symbol.for("react.suspense"),te=Symbol.for("react.suspense_list"),le=Symbol.for("react.memo"),X=Symbol.for("react.lazy"),ce=Symbol.for("react.offscreen"),j=Symbol.iterator;function K(n){return n===null||typeof n!="object"?null:(n=j&&n[j]||n["@@iterator"],typeof n=="function"?n:null)}var Q=Object.assign,k;function re(n){if(k===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);k=i&&i[1]||""}return`
`+k+n}var Ue=!1;function ne(n,i){if(!n||Ue)return"";Ue=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(oe){var c=oe}Reflect.construct(n,[],i)}else{try{i.call()}catch(oe){c=oe}n.call(i.prototype)}else{try{throw Error()}catch(oe){c=oe}n()}}catch(oe){if(oe&&c&&typeof oe.stack=="string"){for(var h=oe.stack.split(`
`),v=c.stack.split(`
`),T=h.length-1,F=v.length-1;1<=T&&0<=F&&h[T]!==v[F];)F--;for(;1<=T&&0<=F;T--,F--)if(h[T]!==v[F]){if(T!==1||F!==1)do if(T--,F--,0>F||h[T]!==v[F]){var V=`
`+h[T].replace(" at new "," at ");return n.displayName&&V.includes("<anonymous>")&&(V=V.replace("<anonymous>",n.displayName)),V}while(1<=T&&0<=F);break}}}finally{Ue=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?re(n):""}function pe(n){switch(n.tag){case 5:return re(n.type);case 16:return re("Lazy");case 13:return re("Suspense");case 19:return re("SuspenseList");case 0:case 2:case 15:return n=ne(n.type,!1),n;case 11:return n=ne(n.type.render,!1),n;case 1:return n=ne(n.type,!0),n;default:return""}}function we(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case O:return"Fragment";case I:return"Portal";case R:return"Profiler";case W:return"StrictMode";case B:return"Suspense";case te:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case D:return(n.displayName||"Context")+".Consumer";case A:return(n._context.displayName||"Context")+".Provider";case G:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case le:return i=n.displayName||null,i!==null?i:we(n.type)||"Memo";case X:i=n._payload,n=n._init;try{return we(n(i))}catch{}}return null}function _e(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return we(i);case 8:return i===W?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Le(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Fe(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Z(n){var i=Fe(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,v=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(T){c=""+T,v.call(this,T)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function gt(n){n._valueTracker||(n._valueTracker=Z(n))}function be(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=Fe(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function nt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Xe(n,i){var a=i.checked;return Q({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function lt(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Le(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function it(n,i){i=i.checked,i!=null&&N(n,"checked",i,!1)}function ot(n,i){it(n,i);var a=Le(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?z(n,i.type,a):i.hasOwnProperty("defaultValue")&&z(n,i.type,Le(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Tt(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function z(n,i,a){(i!=="number"||nt(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var C=Array.isArray;function de(n,i,a,c){if(n=n.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<n.length;a++)h=i.hasOwnProperty("$"+n[a].value),n[a].selected!==h&&(n[a].selected=h),h&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Le(a),i=null,h=0;h<n.length;h++){if(n[h].value===a){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function ge(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return Q({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Se(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(C(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:Le(a)}}function Me(n,i){var a=Le(i.value),c=Le(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function We(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function Re(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ce(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?Re(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var tt,Ae=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(tt=tt||document.createElement("div"),tt.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=tt.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function He(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var ct={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qe=["Webkit","ms","Moz","O"];Object.keys(ct).forEach(function(n){qe.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),ct[i]=ct[n]})});function Ie(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||ct.hasOwnProperty(n)&&ct[n]?(""+i).trim():i+"px"}function st(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,h=Ie(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,h):n[a]=h}}var ht=Q({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function bt(n,i){if(i){if(ht[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function rt(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var b=null;function H(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var q=null,he=null,ve=null;function Ye(n){if(n=Ca(n)){if(typeof q!="function")throw Error(t(280));var i=n.stateNode;i&&(i=To(i),q(n.stateNode,n.type,i))}}function $e(n){he?ve?ve.push(n):ve=[n]:he=n}function pt(){if(he){var n=he,i=ve;if(ve=he=null,Ye(n),i)for(n=0;n<i.length;n++)Ye(i[n])}}function Vt(n,i){return n(i)}function St(){}var Sn=!1;function Zt(n,i,a){if(Sn)return n(i,a);Sn=!0;try{return Vt(n,i,a)}finally{Sn=!1,(he!==null||ve!==null)&&(St(),pt())}}function Vi(n,i){var a=n.stateNode;if(a===null)return null;var c=To(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var is=!1;if(d)try{var Gi={};Object.defineProperty(Gi,"passive",{get:function(){is=!0}}),window.addEventListener("test",Gi,Gi),window.removeEventListener("test",Gi,Gi)}catch{is=!1}function rs(n,i,a,c,h,v,T,F,V){var oe=Array.prototype.slice.call(arguments,3);try{i.apply(a,oe)}catch(ye){this.onError(ye)}}var Wi=!1,Mi=null,Ar=!1,ss=null,ic={onError:function(n){Wi=!0,Mi=n}};function rc(n,i,a,c,h,v,T,F,V){Wi=!1,Mi=null,rs.apply(ic,arguments)}function sc(n,i,a,c,h,v,T,F,V){if(rc.apply(this,arguments),Wi){if(Wi){var oe=Mi;Wi=!1,Mi=null}else throw Error(t(198));Ar||(Ar=!0,ss=oe)}}function P(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function J(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function fe(n){if(P(n)!==n)throw Error(t(188))}function ae(n){var i=n.alternate;if(!i){if(i=P(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var h=a.return;if(h===null)break;var v=h.alternate;if(v===null){if(c=h.return,c!==null){a=c;continue}break}if(h.child===v.child){for(v=h.child;v;){if(v===a)return fe(h),n;if(v===c)return fe(h),i;v=v.sibling}throw Error(t(188))}if(a.return!==c.return)a=h,c=v;else{for(var T=!1,F=h.child;F;){if(F===a){T=!0,a=h,c=v;break}if(F===c){T=!0,c=h,a=v;break}F=F.sibling}if(!T){for(F=v.child;F;){if(F===a){T=!0,a=v,c=h;break}if(F===c){T=!0,c=v,a=h;break}F=F.sibling}if(!T)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function se(n){return n=ae(n),n!==null?Ne(n):null}function Ne(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Ne(n);if(i!==null)return i;n=n.sibling}return null}var je=e.unstable_scheduleCallback,Ge=e.unstable_cancelCallback,Je=e.unstable_shouldYield,at=e.unstable_requestPaint,ze=e.unstable_now,ut=e.unstable_getCurrentPriorityLevel,Dt=e.unstable_ImmediatePriority,Gt=e.unstable_UserBlockingPriority,Jt=e.unstable_NormalPriority,Zn=e.unstable_LowPriority,vt=e.unstable_IdlePriority,Qe=null,ln=null;function Ct(n){if(ln&&typeof ln.onCommitFiberRoot=="function")try{ln.onCommitFiberRoot(Qe,n,void 0,(n.current.flags&128)===128)}catch{}}var Wt=Math.clz32?Math.clz32:ca,lo=Math.log,br=Math.LN2;function ca(n){return n>>>=0,n===0?32:31-(lo(n)/br|0)|0}var kt=64,Ln=4194304;function Ei(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function sn(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,h=n.suspendedLanes,v=n.pingedLanes,T=a&268435455;if(T!==0){var F=T&~h;F!==0?c=Ei(F):(v&=T,v!==0&&(c=Ei(v)))}else T=a&~h,T!==0?c=Ei(T):v!==0&&(c=Ei(v));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,v=i&-i,h>=v||h===16&&(v&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Wt(i),h=1<<a,c|=n[a],i&=~h;return c}function ua(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ac(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,v=n.pendingLanes;0<v;){var T=31-Wt(v),F=1<<T,V=h[T];V===-1?((F&a)===0||(F&c)!==0)&&(h[T]=ua(F,i)):V<=i&&(n.expiredLanes|=F),v&=~F}}function as(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function tf(){var n=kt;return kt<<=1,(kt&4194240)===0&&(kt=64),n}function oc(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function da(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Wt(i),n[i]=a}function bv(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var h=31-Wt(a),v=1<<h;i[h]=0,c[h]=-1,n[h]=-1,a&=~v}}function lc(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Wt(a),h=1<<c;h&i|n[c]&i&&(n[c]|=i),a&=~h}}var wt=0;function nf(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var rf,cc,sf,af,of,uc=!1,co=[],$i=null,Xi=null,qi=null,fa=new Map,ha=new Map,Yi=[],Cv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function lf(n,i){switch(n){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":qi=null;break;case"pointerover":case"pointerout":fa.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":ha.delete(i.pointerId)}}function pa(n,i,a,c,h,v){return n===null||n.nativeEvent!==v?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:v,targetContainers:[h]},i!==null&&(i=Ca(i),i!==null&&cc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function Rv(n,i,a,c,h){switch(i){case"focusin":return $i=pa($i,n,i,a,c,h),!0;case"dragenter":return Xi=pa(Xi,n,i,a,c,h),!0;case"mouseover":return qi=pa(qi,n,i,a,c,h),!0;case"pointerover":var v=h.pointerId;return fa.set(v,pa(fa.get(v)||null,n,i,a,c,h)),!0;case"gotpointercapture":return v=h.pointerId,ha.set(v,pa(ha.get(v)||null,n,i,a,c,h)),!0}return!1}function cf(n){var i=Cr(n.target);if(i!==null){var a=P(i);if(a!==null){if(i=a.tag,i===13){if(i=J(a),i!==null){n.blockedOn=i,of(n.priority,function(){sf(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function uo(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=fc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);b=c,a.target.dispatchEvent(c),b=null}else return i=Ca(a),i!==null&&cc(i),n.blockedOn=a,!1;i.shift()}return!0}function uf(n,i,a){uo(n)&&a.delete(i)}function Nv(){uc=!1,$i!==null&&uo($i)&&($i=null),Xi!==null&&uo(Xi)&&(Xi=null),qi!==null&&uo(qi)&&(qi=null),fa.forEach(uf),ha.forEach(uf)}function ma(n,i){n.blockedOn===i&&(n.blockedOn=null,uc||(uc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Nv)))}function ga(n){function i(h){return ma(h,n)}if(0<co.length){ma(co[0],n);for(var a=1;a<co.length;a++){var c=co[a];c.blockedOn===n&&(c.blockedOn=null)}}for($i!==null&&ma($i,n),Xi!==null&&ma(Xi,n),qi!==null&&ma(qi,n),fa.forEach(i),ha.forEach(i),a=0;a<Yi.length;a++)c=Yi[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Yi.length&&(a=Yi[0],a.blockedOn===null);)cf(a),a.blockedOn===null&&Yi.shift()}var os=U.ReactCurrentBatchConfig,fo=!0;function Pv(n,i,a,c){var h=wt,v=os.transition;os.transition=null;try{wt=1,dc(n,i,a,c)}finally{wt=h,os.transition=v}}function Lv(n,i,a,c){var h=wt,v=os.transition;os.transition=null;try{wt=4,dc(n,i,a,c)}finally{wt=h,os.transition=v}}function dc(n,i,a,c){if(fo){var h=fc(n,i,a,c);if(h===null)Rc(n,i,c,ho,a),lf(n,c);else if(Rv(h,n,i,a,c))c.stopPropagation();else if(lf(n,c),i&4&&-1<Cv.indexOf(n)){for(;h!==null;){var v=Ca(h);if(v!==null&&rf(v),v=fc(n,i,a,c),v===null&&Rc(n,i,c,ho,a),v===h)break;h=v}h!==null&&c.stopPropagation()}else Rc(n,i,c,null,a)}}var ho=null;function fc(n,i,a,c){if(ho=null,n=H(c),n=Cr(n),n!==null)if(i=P(n),i===null)n=null;else if(a=i.tag,a===13){if(n=J(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return ho=n,null}function df(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ut()){case Dt:return 1;case Gt:return 4;case Jt:case Zn:return 16;case vt:return 536870912;default:return 16}default:return 16}}var Ki=null,hc=null,po=null;function ff(){if(po)return po;var n,i=hc,a=i.length,c,h="value"in Ki?Ki.value:Ki.textContent,v=h.length;for(n=0;n<a&&i[n]===h[n];n++);var T=a-n;for(c=1;c<=T&&i[a-c]===h[v-c];c++);return po=h.slice(n,1<c?1-c:void 0)}function mo(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function go(){return!0}function hf(){return!1}function Dn(n){function i(a,c,h,v,T){this._reactName=a,this._targetInst=h,this.type=c,this.nativeEvent=v,this.target=T,this.currentTarget=null;for(var F in n)n.hasOwnProperty(F)&&(a=n[F],this[F]=a?a(v):v[F]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?go:hf,this.isPropagationStopped=hf,this}return Q(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=go)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=go)},persist:function(){},isPersistent:go}),i}var ls={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},pc=Dn(ls),va=Q({},ls,{view:0,detail:0}),Dv=Dn(va),mc,gc,_a,vo=Q({},va,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_c,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==_a&&(_a&&n.type==="mousemove"?(mc=n.screenX-_a.screenX,gc=n.screenY-_a.screenY):gc=mc=0,_a=n),mc)},movementY:function(n){return"movementY"in n?n.movementY:gc}}),pf=Dn(vo),Uv=Q({},vo,{dataTransfer:0}),Iv=Dn(Uv),Fv=Q({},va,{relatedTarget:0}),vc=Dn(Fv),Ov=Q({},ls,{animationName:0,elapsedTime:0,pseudoElement:0}),kv=Dn(Ov),zv=Q({},ls,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Bv=Dn(zv),jv=Q({},ls,{data:0}),mf=Dn(jv),Hv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Vv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Gv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Wv(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Gv[n])?!!i[n]:!1}function _c(){return Wv}var $v=Q({},va,{key:function(n){if(n.key){var i=Hv[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=mo(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Vv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_c,charCode:function(n){return n.type==="keypress"?mo(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?mo(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Xv=Dn($v),qv=Q({},vo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gf=Dn(qv),Yv=Q({},va,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_c}),Kv=Dn(Yv),Zv=Q({},ls,{propertyName:0,elapsedTime:0,pseudoElement:0}),Jv=Dn(Zv),Qv=Q({},vo,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),e_=Dn(Qv),t_=[9,13,27,32],xc=d&&"CompositionEvent"in window,xa=null;d&&"documentMode"in document&&(xa=document.documentMode);var n_=d&&"TextEvent"in window&&!xa,vf=d&&(!xc||xa&&8<xa&&11>=xa),_f=" ",xf=!1;function yf(n,i){switch(n){case"keyup":return t_.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Sf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var cs=!1;function i_(n,i){switch(n){case"compositionend":return Sf(i);case"keypress":return i.which!==32?null:(xf=!0,_f);case"textInput":return n=i.data,n===_f&&xf?null:n;default:return null}}function r_(n,i){if(cs)return n==="compositionend"||!xc&&yf(n,i)?(n=ff(),po=hc=Ki=null,cs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return vf&&i.locale!=="ko"?null:i.data;default:return null}}var s_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Mf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!s_[n.type]:i==="textarea"}function Ef(n,i,a,c){$e(c),i=Mo(i,"onChange"),0<i.length&&(a=new pc("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var ya=null,Sa=null;function a_(n){jf(n,0)}function _o(n){var i=ps(n);if(be(i))return n}function o_(n,i){if(n==="change")return i}var wf=!1;if(d){var yc;if(d){var Sc="oninput"in document;if(!Sc){var Tf=document.createElement("div");Tf.setAttribute("oninput","return;"),Sc=typeof Tf.oninput=="function"}yc=Sc}else yc=!1;wf=yc&&(!document.documentMode||9<document.documentMode)}function Af(){ya&&(ya.detachEvent("onpropertychange",bf),Sa=ya=null)}function bf(n){if(n.propertyName==="value"&&_o(Sa)){var i=[];Ef(i,Sa,n,H(n)),Zt(a_,i)}}function l_(n,i,a){n==="focusin"?(Af(),ya=i,Sa=a,ya.attachEvent("onpropertychange",bf)):n==="focusout"&&Af()}function c_(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return _o(Sa)}function u_(n,i){if(n==="click")return _o(i)}function d_(n,i){if(n==="input"||n==="change")return _o(i)}function f_(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Jn=typeof Object.is=="function"?Object.is:f_;function Ma(n,i){if(Jn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var h=a[c];if(!m.call(i,h)||!Jn(n[h],i[h]))return!1}return!0}function Cf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Rf(n,i){var a=Cf(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Cf(a)}}function Nf(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Nf(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function Pf(){for(var n=window,i=nt();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=nt(n.document)}return i}function Mc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function h_(n){var i=Pf(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Nf(a.ownerDocument.documentElement,a)){if(c!==null&&Mc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=a.textContent.length,v=Math.min(c.start,h);c=c.end===void 0?v:Math.min(c.end,h),!n.extend&&v>c&&(h=c,c=v,v=h),h=Rf(a,v);var T=Rf(a,c);h&&T&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),v>c?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var p_=d&&"documentMode"in document&&11>=document.documentMode,us=null,Ec=null,Ea=null,wc=!1;function Lf(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;wc||us==null||us!==nt(c)||(c=us,"selectionStart"in c&&Mc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ea&&Ma(Ea,c)||(Ea=c,c=Mo(Ec,"onSelect"),0<c.length&&(i=new pc("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=us)))}function xo(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var ds={animationend:xo("Animation","AnimationEnd"),animationiteration:xo("Animation","AnimationIteration"),animationstart:xo("Animation","AnimationStart"),transitionend:xo("Transition","TransitionEnd")},Tc={},Df={};d&&(Df=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function yo(n){if(Tc[n])return Tc[n];if(!ds[n])return n;var i=ds[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in Df)return Tc[n]=i[a];return n}var Uf=yo("animationend"),If=yo("animationiteration"),Ff=yo("animationstart"),Of=yo("transitionend"),kf=new Map,zf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zi(n,i){kf.set(n,i),l(i,[n])}for(var Ac=0;Ac<zf.length;Ac++){var bc=zf[Ac],m_=bc.toLowerCase(),g_=bc[0].toUpperCase()+bc.slice(1);Zi(m_,"on"+g_)}Zi(Uf,"onAnimationEnd"),Zi(If,"onAnimationIteration"),Zi(Ff,"onAnimationStart"),Zi("dblclick","onDoubleClick"),Zi("focusin","onFocus"),Zi("focusout","onBlur"),Zi(Of,"onTransitionEnd"),f("onMouseEnter",["mouseout","mouseover"]),f("onMouseLeave",["mouseout","mouseover"]),f("onPointerEnter",["pointerout","pointerover"]),f("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var wa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),v_=new Set("cancel close invalid load scroll toggle".split(" ").concat(wa));function Bf(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,sc(c,i,void 0,n),n.currentTarget=null}function jf(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],h=c.event;c=c.listeners;e:{var v=void 0;if(i)for(var T=c.length-1;0<=T;T--){var F=c[T],V=F.instance,oe=F.currentTarget;if(F=F.listener,V!==v&&h.isPropagationStopped())break e;Bf(h,F,oe),v=V}else for(T=0;T<c.length;T++){if(F=c[T],V=F.instance,oe=F.currentTarget,F=F.listener,V!==v&&h.isPropagationStopped())break e;Bf(h,F,oe),v=V}}}if(Ar)throw n=ss,Ar=!1,ss=null,n}function Nt(n,i){var a=i[Ic];a===void 0&&(a=i[Ic]=new Set);var c=n+"__bubble";a.has(c)||(Hf(i,n,2,!1),a.add(c))}function Cc(n,i,a){var c=0;i&&(c|=4),Hf(a,n,c,i)}var So="_reactListening"+Math.random().toString(36).slice(2);function Ta(n){if(!n[So]){n[So]=!0,s.forEach(function(a){a!=="selectionchange"&&(v_.has(a)||Cc(a,!1,n),Cc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[So]||(i[So]=!0,Cc("selectionchange",!1,i))}}function Hf(n,i,a,c){switch(df(i)){case 1:var h=Pv;break;case 4:h=Lv;break;default:h=dc}a=h.bind(null,i,a,n),h=void 0,!is||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,a,{capture:!0,passive:h}):n.addEventListener(i,a,!0):h!==void 0?n.addEventListener(i,a,{passive:h}):n.addEventListener(i,a,!1)}function Rc(n,i,a,c,h){var v=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var F=c.stateNode.containerInfo;if(F===h||F.nodeType===8&&F.parentNode===h)break;if(T===4)for(T=c.return;T!==null;){var V=T.tag;if((V===3||V===4)&&(V=T.stateNode.containerInfo,V===h||V.nodeType===8&&V.parentNode===h))return;T=T.return}for(;F!==null;){if(T=Cr(F),T===null)return;if(V=T.tag,V===5||V===6){c=v=T;continue e}F=F.parentNode}}c=c.return}Zt(function(){var oe=v,ye=H(a),Ee=[];e:{var xe=kf.get(n);if(xe!==void 0){var De=pc,ke=n;switch(n){case"keypress":if(mo(a)===0)break e;case"keydown":case"keyup":De=Xv;break;case"focusin":ke="focus",De=vc;break;case"focusout":ke="blur",De=vc;break;case"beforeblur":case"afterblur":De=vc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":De=pf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":De=Iv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":De=Kv;break;case Uf:case If:case Ff:De=kv;break;case Of:De=Jv;break;case"scroll":De=Dv;break;case"wheel":De=e_;break;case"copy":case"cut":case"paste":De=Bv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":De=gf}var Be=(i&4)!==0,zt=!Be&&n==="scroll",ee=Be?xe!==null?xe+"Capture":null:xe;Be=[];for(var $=oe,ie;$!==null;){ie=$;var Te=ie.stateNode;if(ie.tag===5&&Te!==null&&(ie=Te,ee!==null&&(Te=Vi($,ee),Te!=null&&Be.push(Aa($,Te,ie)))),zt)break;$=$.return}0<Be.length&&(xe=new De(xe,ke,null,a,ye),Ee.push({event:xe,listeners:Be}))}}if((i&7)===0){e:{if(xe=n==="mouseover"||n==="pointerover",De=n==="mouseout"||n==="pointerout",xe&&a!==b&&(ke=a.relatedTarget||a.fromElement)&&(Cr(ke)||ke[wi]))break e;if((De||xe)&&(xe=ye.window===ye?ye:(xe=ye.ownerDocument)?xe.defaultView||xe.parentWindow:window,De?(ke=a.relatedTarget||a.toElement,De=oe,ke=ke?Cr(ke):null,ke!==null&&(zt=P(ke),ke!==zt||ke.tag!==5&&ke.tag!==6)&&(ke=null)):(De=null,ke=oe),De!==ke)){if(Be=pf,Te="onMouseLeave",ee="onMouseEnter",$="mouse",(n==="pointerout"||n==="pointerover")&&(Be=gf,Te="onPointerLeave",ee="onPointerEnter",$="pointer"),zt=De==null?xe:ps(De),ie=ke==null?xe:ps(ke),xe=new Be(Te,$+"leave",De,a,ye),xe.target=zt,xe.relatedTarget=ie,Te=null,Cr(ye)===oe&&(Be=new Be(ee,$+"enter",ke,a,ye),Be.target=ie,Be.relatedTarget=zt,Te=Be),zt=Te,De&&ke)t:{for(Be=De,ee=ke,$=0,ie=Be;ie;ie=fs(ie))$++;for(ie=0,Te=ee;Te;Te=fs(Te))ie++;for(;0<$-ie;)Be=fs(Be),$--;for(;0<ie-$;)ee=fs(ee),ie--;for(;$--;){if(Be===ee||ee!==null&&Be===ee.alternate)break t;Be=fs(Be),ee=fs(ee)}Be=null}else Be=null;De!==null&&Vf(Ee,xe,De,Be,!1),ke!==null&&zt!==null&&Vf(Ee,zt,ke,Be,!0)}}e:{if(xe=oe?ps(oe):window,De=xe.nodeName&&xe.nodeName.toLowerCase(),De==="select"||De==="input"&&xe.type==="file")var Ve=o_;else if(Mf(xe))if(wf)Ve=d_;else{Ve=c_;var Ke=l_}else(De=xe.nodeName)&&De.toLowerCase()==="input"&&(xe.type==="checkbox"||xe.type==="radio")&&(Ve=u_);if(Ve&&(Ve=Ve(n,oe))){Ef(Ee,Ve,a,ye);break e}Ke&&Ke(n,xe,oe),n==="focusout"&&(Ke=xe._wrapperState)&&Ke.controlled&&xe.type==="number"&&z(xe,"number",xe.value)}switch(Ke=oe?ps(oe):window,n){case"focusin":(Mf(Ke)||Ke.contentEditable==="true")&&(us=Ke,Ec=oe,Ea=null);break;case"focusout":Ea=Ec=us=null;break;case"mousedown":wc=!0;break;case"contextmenu":case"mouseup":case"dragend":wc=!1,Lf(Ee,a,ye);break;case"selectionchange":if(p_)break;case"keydown":case"keyup":Lf(Ee,a,ye)}var Ze;if(xc)e:{switch(n){case"compositionstart":var et="onCompositionStart";break e;case"compositionend":et="onCompositionEnd";break e;case"compositionupdate":et="onCompositionUpdate";break e}et=void 0}else cs?yf(n,a)&&(et="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(et="onCompositionStart");et&&(vf&&a.locale!=="ko"&&(cs||et!=="onCompositionStart"?et==="onCompositionEnd"&&cs&&(Ze=ff()):(Ki=ye,hc="value"in Ki?Ki.value:Ki.textContent,cs=!0)),Ke=Mo(oe,et),0<Ke.length&&(et=new mf(et,n,null,a,ye),Ee.push({event:et,listeners:Ke}),Ze?et.data=Ze:(Ze=Sf(a),Ze!==null&&(et.data=Ze)))),(Ze=n_?i_(n,a):r_(n,a))&&(oe=Mo(oe,"onBeforeInput"),0<oe.length&&(ye=new mf("onBeforeInput","beforeinput",null,a,ye),Ee.push({event:ye,listeners:oe}),ye.data=Ze))}jf(Ee,i)})}function Aa(n,i,a){return{instance:n,listener:i,currentTarget:a}}function Mo(n,i){for(var a=i+"Capture",c=[];n!==null;){var h=n,v=h.stateNode;h.tag===5&&v!==null&&(h=v,v=Vi(n,a),v!=null&&c.unshift(Aa(n,v,h)),v=Vi(n,i),v!=null&&c.push(Aa(n,v,h))),n=n.return}return c}function fs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Vf(n,i,a,c,h){for(var v=i._reactName,T=[];a!==null&&a!==c;){var F=a,V=F.alternate,oe=F.stateNode;if(V!==null&&V===c)break;F.tag===5&&oe!==null&&(F=oe,h?(V=Vi(a,v),V!=null&&T.unshift(Aa(a,V,F))):h||(V=Vi(a,v),V!=null&&T.push(Aa(a,V,F)))),a=a.return}T.length!==0&&n.push({event:i,listeners:T})}var __=/\r\n?/g,x_=/\u0000|\uFFFD/g;function Gf(n){return(typeof n=="string"?n:""+n).replace(__,`
`).replace(x_,"")}function Eo(n,i,a){if(i=Gf(i),Gf(n)!==i&&a)throw Error(t(425))}function wo(){}var Nc=null,Pc=null;function Lc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Dc=typeof setTimeout=="function"?setTimeout:void 0,y_=typeof clearTimeout=="function"?clearTimeout:void 0,Wf=typeof Promise=="function"?Promise:void 0,S_=typeof queueMicrotask=="function"?queueMicrotask:typeof Wf<"u"?function(n){return Wf.resolve(null).then(n).catch(M_)}:Dc;function M_(n){setTimeout(function(){throw n})}function Uc(n,i){var a=i,c=0;do{var h=a.nextSibling;if(n.removeChild(a),h&&h.nodeType===8)if(a=h.data,a==="/$"){if(c===0){n.removeChild(h),ga(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=h}while(a);ga(i)}function Ji(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function $f(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var hs=Math.random().toString(36).slice(2),ui="__reactFiber$"+hs,ba="__reactProps$"+hs,wi="__reactContainer$"+hs,Ic="__reactEvents$"+hs,E_="__reactListeners$"+hs,w_="__reactHandles$"+hs;function Cr(n){var i=n[ui];if(i)return i;for(var a=n.parentNode;a;){if(i=a[wi]||a[ui]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=$f(n);n!==null;){if(a=n[ui])return a;n=$f(n)}return i}n=a,a=n.parentNode}return null}function Ca(n){return n=n[ui]||n[wi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ps(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function To(n){return n[ba]||null}var Fc=[],ms=-1;function Qi(n){return{current:n}}function Pt(n){0>ms||(n.current=Fc[ms],Fc[ms]=null,ms--)}function Rt(n,i){ms++,Fc[ms]=n.current,n.current=i}var er={},cn=Qi(er),Mn=Qi(!1),Rr=er;function gs(n,i){var a=n.type.contextTypes;if(!a)return er;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},v;for(v in a)h[v]=i[v];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function En(n){return n=n.childContextTypes,n!=null}function Ao(){Pt(Mn),Pt(cn)}function Xf(n,i,a){if(cn.current!==er)throw Error(t(168));Rt(cn,i),Rt(Mn,a)}function qf(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,_e(n)||"Unknown",h));return Q({},a,c)}function bo(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||er,Rr=cn.current,Rt(cn,n),Rt(Mn,Mn.current),!0}function Yf(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=qf(n,i,Rr),c.__reactInternalMemoizedMergedChildContext=n,Pt(Mn),Pt(cn),Rt(cn,n)):Pt(Mn),Rt(Mn,a)}var Ti=null,Co=!1,Oc=!1;function Kf(n){Ti===null?Ti=[n]:Ti.push(n)}function T_(n){Co=!0,Kf(n)}function tr(){if(!Oc&&Ti!==null){Oc=!0;var n=0,i=wt;try{var a=Ti;for(wt=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Ti=null,Co=!1}catch(h){throw Ti!==null&&(Ti=Ti.slice(n+1)),je(Dt,tr),h}finally{wt=i,Oc=!1}}return null}var vs=[],_s=0,Ro=null,No=0,jn=[],Hn=0,Nr=null,Ai=1,bi="";function Pr(n,i){vs[_s++]=No,vs[_s++]=Ro,Ro=n,No=i}function Zf(n,i,a){jn[Hn++]=Ai,jn[Hn++]=bi,jn[Hn++]=Nr,Nr=n;var c=Ai;n=bi;var h=32-Wt(c)-1;c&=~(1<<h),a+=1;var v=32-Wt(i)+h;if(30<v){var T=h-h%5;v=(c&(1<<T)-1).toString(32),c>>=T,h-=T,Ai=1<<32-Wt(i)+h|a<<h|c,bi=v+n}else Ai=1<<v|a<<h|c,bi=n}function kc(n){n.return!==null&&(Pr(n,1),Zf(n,1,0))}function zc(n){for(;n===Ro;)Ro=vs[--_s],vs[_s]=null,No=vs[--_s],vs[_s]=null;for(;n===Nr;)Nr=jn[--Hn],jn[Hn]=null,bi=jn[--Hn],jn[Hn]=null,Ai=jn[--Hn],jn[Hn]=null}var Un=null,In=null,Ut=!1,Qn=null;function Jf(n,i){var a=$n(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Qf(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Un=n,In=Ji(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Un=n,In=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Nr!==null?{id:Ai,overflow:bi}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=$n(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,Un=n,In=null,!0):!1;default:return!1}}function Bc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function jc(n){if(Ut){var i=In;if(i){var a=i;if(!Qf(n,i)){if(Bc(n))throw Error(t(418));i=Ji(a.nextSibling);var c=Un;i&&Qf(n,i)?Jf(c,a):(n.flags=n.flags&-4097|2,Ut=!1,Un=n)}}else{if(Bc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Ut=!1,Un=n}}}function eh(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Un=n}function Po(n){if(n!==Un)return!1;if(!Ut)return eh(n),Ut=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Lc(n.type,n.memoizedProps)),i&&(i=In)){if(Bc(n))throw th(),Error(t(418));for(;i;)Jf(n,i),i=Ji(i.nextSibling)}if(eh(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){In=Ji(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}In=null}}else In=Un?Ji(n.stateNode.nextSibling):null;return!0}function th(){for(var n=In;n;)n=Ji(n.nextSibling)}function xs(){In=Un=null,Ut=!1}function Hc(n){Qn===null?Qn=[n]:Qn.push(n)}var A_=U.ReactCurrentBatchConfig;function Ra(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var h=c,v=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===v?i.ref:(i=function(T){var F=h.refs;T===null?delete F[v]:F[v]=T},i._stringRef=v,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function Lo(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function nh(n){var i=n._init;return i(n._payload)}function ih(n){function i(ee,$){if(n){var ie=ee.deletions;ie===null?(ee.deletions=[$],ee.flags|=16):ie.push($)}}function a(ee,$){if(!n)return null;for(;$!==null;)i(ee,$),$=$.sibling;return null}function c(ee,$){for(ee=new Map;$!==null;)$.key!==null?ee.set($.key,$):ee.set($.index,$),$=$.sibling;return ee}function h(ee,$){return ee=cr(ee,$),ee.index=0,ee.sibling=null,ee}function v(ee,$,ie){return ee.index=ie,n?(ie=ee.alternate,ie!==null?(ie=ie.index,ie<$?(ee.flags|=2,$):ie):(ee.flags|=2,$)):(ee.flags|=1048576,$)}function T(ee){return n&&ee.alternate===null&&(ee.flags|=2),ee}function F(ee,$,ie,Te){return $===null||$.tag!==6?($=Du(ie,ee.mode,Te),$.return=ee,$):($=h($,ie),$.return=ee,$)}function V(ee,$,ie,Te){var Ve=ie.type;return Ve===O?ye(ee,$,ie.props.children,Te,ie.key):$!==null&&($.elementType===Ve||typeof Ve=="object"&&Ve!==null&&Ve.$$typeof===X&&nh(Ve)===$.type)?(Te=h($,ie.props),Te.ref=Ra(ee,$,ie),Te.return=ee,Te):(Te=nl(ie.type,ie.key,ie.props,null,ee.mode,Te),Te.ref=Ra(ee,$,ie),Te.return=ee,Te)}function oe(ee,$,ie,Te){return $===null||$.tag!==4||$.stateNode.containerInfo!==ie.containerInfo||$.stateNode.implementation!==ie.implementation?($=Uu(ie,ee.mode,Te),$.return=ee,$):($=h($,ie.children||[]),$.return=ee,$)}function ye(ee,$,ie,Te,Ve){return $===null||$.tag!==7?($=zr(ie,ee.mode,Te,Ve),$.return=ee,$):($=h($,ie),$.return=ee,$)}function Ee(ee,$,ie){if(typeof $=="string"&&$!==""||typeof $=="number")return $=Du(""+$,ee.mode,ie),$.return=ee,$;if(typeof $=="object"&&$!==null){switch($.$$typeof){case Y:return ie=nl($.type,$.key,$.props,null,ee.mode,ie),ie.ref=Ra(ee,null,$),ie.return=ee,ie;case I:return $=Uu($,ee.mode,ie),$.return=ee,$;case X:var Te=$._init;return Ee(ee,Te($._payload),ie)}if(C($)||K($))return $=zr($,ee.mode,ie,null),$.return=ee,$;Lo(ee,$)}return null}function xe(ee,$,ie,Te){var Ve=$!==null?$.key:null;if(typeof ie=="string"&&ie!==""||typeof ie=="number")return Ve!==null?null:F(ee,$,""+ie,Te);if(typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case Y:return ie.key===Ve?V(ee,$,ie,Te):null;case I:return ie.key===Ve?oe(ee,$,ie,Te):null;case X:return Ve=ie._init,xe(ee,$,Ve(ie._payload),Te)}if(C(ie)||K(ie))return Ve!==null?null:ye(ee,$,ie,Te,null);Lo(ee,ie)}return null}function De(ee,$,ie,Te,Ve){if(typeof Te=="string"&&Te!==""||typeof Te=="number")return ee=ee.get(ie)||null,F($,ee,""+Te,Ve);if(typeof Te=="object"&&Te!==null){switch(Te.$$typeof){case Y:return ee=ee.get(Te.key===null?ie:Te.key)||null,V($,ee,Te,Ve);case I:return ee=ee.get(Te.key===null?ie:Te.key)||null,oe($,ee,Te,Ve);case X:var Ke=Te._init;return De(ee,$,ie,Ke(Te._payload),Ve)}if(C(Te)||K(Te))return ee=ee.get(ie)||null,ye($,ee,Te,Ve,null);Lo($,Te)}return null}function ke(ee,$,ie,Te){for(var Ve=null,Ke=null,Ze=$,et=$=0,tn=null;Ze!==null&&et<ie.length;et++){Ze.index>et?(tn=Ze,Ze=null):tn=Ze.sibling;var Mt=xe(ee,Ze,ie[et],Te);if(Mt===null){Ze===null&&(Ze=tn);break}n&&Ze&&Mt.alternate===null&&i(ee,Ze),$=v(Mt,$,et),Ke===null?Ve=Mt:Ke.sibling=Mt,Ke=Mt,Ze=tn}if(et===ie.length)return a(ee,Ze),Ut&&Pr(ee,et),Ve;if(Ze===null){for(;et<ie.length;et++)Ze=Ee(ee,ie[et],Te),Ze!==null&&($=v(Ze,$,et),Ke===null?Ve=Ze:Ke.sibling=Ze,Ke=Ze);return Ut&&Pr(ee,et),Ve}for(Ze=c(ee,Ze);et<ie.length;et++)tn=De(Ze,ee,et,ie[et],Te),tn!==null&&(n&&tn.alternate!==null&&Ze.delete(tn.key===null?et:tn.key),$=v(tn,$,et),Ke===null?Ve=tn:Ke.sibling=tn,Ke=tn);return n&&Ze.forEach(function(ur){return i(ee,ur)}),Ut&&Pr(ee,et),Ve}function Be(ee,$,ie,Te){var Ve=K(ie);if(typeof Ve!="function")throw Error(t(150));if(ie=Ve.call(ie),ie==null)throw Error(t(151));for(var Ke=Ve=null,Ze=$,et=$=0,tn=null,Mt=ie.next();Ze!==null&&!Mt.done;et++,Mt=ie.next()){Ze.index>et?(tn=Ze,Ze=null):tn=Ze.sibling;var ur=xe(ee,Ze,Mt.value,Te);if(ur===null){Ze===null&&(Ze=tn);break}n&&Ze&&ur.alternate===null&&i(ee,Ze),$=v(ur,$,et),Ke===null?Ve=ur:Ke.sibling=ur,Ke=ur,Ze=tn}if(Mt.done)return a(ee,Ze),Ut&&Pr(ee,et),Ve;if(Ze===null){for(;!Mt.done;et++,Mt=ie.next())Mt=Ee(ee,Mt.value,Te),Mt!==null&&($=v(Mt,$,et),Ke===null?Ve=Mt:Ke.sibling=Mt,Ke=Mt);return Ut&&Pr(ee,et),Ve}for(Ze=c(ee,Ze);!Mt.done;et++,Mt=ie.next())Mt=De(Ze,ee,et,Mt.value,Te),Mt!==null&&(n&&Mt.alternate!==null&&Ze.delete(Mt.key===null?et:Mt.key),$=v(Mt,$,et),Ke===null?Ve=Mt:Ke.sibling=Mt,Ke=Mt);return n&&Ze.forEach(function(sx){return i(ee,sx)}),Ut&&Pr(ee,et),Ve}function zt(ee,$,ie,Te){if(typeof ie=="object"&&ie!==null&&ie.type===O&&ie.key===null&&(ie=ie.props.children),typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case Y:e:{for(var Ve=ie.key,Ke=$;Ke!==null;){if(Ke.key===Ve){if(Ve=ie.type,Ve===O){if(Ke.tag===7){a(ee,Ke.sibling),$=h(Ke,ie.props.children),$.return=ee,ee=$;break e}}else if(Ke.elementType===Ve||typeof Ve=="object"&&Ve!==null&&Ve.$$typeof===X&&nh(Ve)===Ke.type){a(ee,Ke.sibling),$=h(Ke,ie.props),$.ref=Ra(ee,Ke,ie),$.return=ee,ee=$;break e}a(ee,Ke);break}else i(ee,Ke);Ke=Ke.sibling}ie.type===O?($=zr(ie.props.children,ee.mode,Te,ie.key),$.return=ee,ee=$):(Te=nl(ie.type,ie.key,ie.props,null,ee.mode,Te),Te.ref=Ra(ee,$,ie),Te.return=ee,ee=Te)}return T(ee);case I:e:{for(Ke=ie.key;$!==null;){if($.key===Ke)if($.tag===4&&$.stateNode.containerInfo===ie.containerInfo&&$.stateNode.implementation===ie.implementation){a(ee,$.sibling),$=h($,ie.children||[]),$.return=ee,ee=$;break e}else{a(ee,$);break}else i(ee,$);$=$.sibling}$=Uu(ie,ee.mode,Te),$.return=ee,ee=$}return T(ee);case X:return Ke=ie._init,zt(ee,$,Ke(ie._payload),Te)}if(C(ie))return ke(ee,$,ie,Te);if(K(ie))return Be(ee,$,ie,Te);Lo(ee,ie)}return typeof ie=="string"&&ie!==""||typeof ie=="number"?(ie=""+ie,$!==null&&$.tag===6?(a(ee,$.sibling),$=h($,ie),$.return=ee,ee=$):(a(ee,$),$=Du(ie,ee.mode,Te),$.return=ee,ee=$),T(ee)):a(ee,$)}return zt}var ys=ih(!0),rh=ih(!1),Do=Qi(null),Uo=null,Ss=null,Vc=null;function Gc(){Vc=Ss=Uo=null}function Wc(n){var i=Do.current;Pt(Do),n._currentValue=i}function $c(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function Ms(n,i){Uo=n,Vc=Ss=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(wn=!0),n.firstContext=null)}function Vn(n){var i=n._currentValue;if(Vc!==n)if(n={context:n,memoizedValue:i,next:null},Ss===null){if(Uo===null)throw Error(t(308));Ss=n,Uo.dependencies={lanes:0,firstContext:n}}else Ss=Ss.next=n;return i}var Lr=null;function Xc(n){Lr===null?Lr=[n]:Lr.push(n)}function sh(n,i,a,c){var h=i.interleaved;return h===null?(a.next=a,Xc(i)):(a.next=h.next,h.next=a),i.interleaved=a,Ci(n,c)}function Ci(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var nr=!1;function qc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ah(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ri(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ir(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(_t&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,Ci(n,a)}return h=c.interleaved,h===null?(i.next=i,Xc(c)):(i.next=h.next,h.next=i),c.interleaved=i,Ci(n,a)}function Io(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}function oh(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var h=null,v=null;if(a=a.firstBaseUpdate,a!==null){do{var T={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};v===null?h=v=T:v=v.next=T,a=a.next}while(a!==null);v===null?h=v=i:v=v.next=i}else h=v=i;a={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:v,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function Fo(n,i,a,c){var h=n.updateQueue;nr=!1;var v=h.firstBaseUpdate,T=h.lastBaseUpdate,F=h.shared.pending;if(F!==null){h.shared.pending=null;var V=F,oe=V.next;V.next=null,T===null?v=oe:T.next=oe,T=V;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,F=ye.lastBaseUpdate,F!==T&&(F===null?ye.firstBaseUpdate=oe:F.next=oe,ye.lastBaseUpdate=V))}if(v!==null){var Ee=h.baseState;T=0,ye=oe=V=null,F=v;do{var xe=F.lane,De=F.eventTime;if((c&xe)===xe){ye!==null&&(ye=ye.next={eventTime:De,lane:0,tag:F.tag,payload:F.payload,callback:F.callback,next:null});e:{var ke=n,Be=F;switch(xe=i,De=a,Be.tag){case 1:if(ke=Be.payload,typeof ke=="function"){Ee=ke.call(De,Ee,xe);break e}Ee=ke;break e;case 3:ke.flags=ke.flags&-65537|128;case 0:if(ke=Be.payload,xe=typeof ke=="function"?ke.call(De,Ee,xe):ke,xe==null)break e;Ee=Q({},Ee,xe);break e;case 2:nr=!0}}F.callback!==null&&F.lane!==0&&(n.flags|=64,xe=h.effects,xe===null?h.effects=[F]:xe.push(F))}else De={eventTime:De,lane:xe,tag:F.tag,payload:F.payload,callback:F.callback,next:null},ye===null?(oe=ye=De,V=Ee):ye=ye.next=De,T|=xe;if(F=F.next,F===null){if(F=h.shared.pending,F===null)break;xe=F,F=xe.next,xe.next=null,h.lastBaseUpdate=xe,h.shared.pending=null}}while(!0);if(ye===null&&(V=Ee),h.baseState=V,h.firstBaseUpdate=oe,h.lastBaseUpdate=ye,i=h.shared.interleaved,i!==null){h=i;do T|=h.lane,h=h.next;while(h!==i)}else v===null&&(h.shared.lanes=0);Ir|=T,n.lanes=T,n.memoizedState=Ee}}function lh(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=a,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var Na={},di=Qi(Na),Pa=Qi(Na),La=Qi(Na);function Dr(n){if(n===Na)throw Error(t(174));return n}function Yc(n,i){switch(Rt(La,i),Rt(Pa,n),Rt(di,Na),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ce(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ce(i,n)}Pt(di),Rt(di,i)}function Es(){Pt(di),Pt(Pa),Pt(La)}function ch(n){Dr(La.current);var i=Dr(di.current),a=Ce(i,n.type);i!==a&&(Rt(Pa,n),Rt(di,a))}function Kc(n){Pa.current===n&&(Pt(di),Pt(Pa))}var It=Qi(0);function Oo(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Zc=[];function Jc(){for(var n=0;n<Zc.length;n++)Zc[n]._workInProgressVersionPrimary=null;Zc.length=0}var ko=U.ReactCurrentDispatcher,Qc=U.ReactCurrentBatchConfig,Ur=0,Ft=null,$t=null,Qt=null,zo=!1,Da=!1,Ua=0,b_=0;function un(){throw Error(t(321))}function eu(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Jn(n[a],i[a]))return!1;return!0}function tu(n,i,a,c,h,v){if(Ur=v,Ft=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,ko.current=n===null||n.memoizedState===null?P_:L_,n=a(c,h),Da){v=0;do{if(Da=!1,Ua=0,25<=v)throw Error(t(301));v+=1,Qt=$t=null,i.updateQueue=null,ko.current=D_,n=a(c,h)}while(Da)}if(ko.current=Ho,i=$t!==null&&$t.next!==null,Ur=0,Qt=$t=Ft=null,zo=!1,i)throw Error(t(300));return n}function nu(){var n=Ua!==0;return Ua=0,n}function fi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n,Qt}function Gn(){if($t===null){var n=Ft.alternate;n=n!==null?n.memoizedState:null}else n=$t.next;var i=Qt===null?Ft.memoizedState:Qt.next;if(i!==null)Qt=i,$t=n;else{if(n===null)throw Error(t(310));$t=n,n={memoizedState:$t.memoizedState,baseState:$t.baseState,baseQueue:$t.baseQueue,queue:$t.queue,next:null},Qt===null?Ft.memoizedState=Qt=n:Qt=Qt.next=n}return Qt}function Ia(n,i){return typeof i=="function"?i(n):i}function iu(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=$t,h=c.baseQueue,v=a.pending;if(v!==null){if(h!==null){var T=h.next;h.next=v.next,v.next=T}c.baseQueue=h=v,a.pending=null}if(h!==null){v=h.next,c=c.baseState;var F=T=null,V=null,oe=v;do{var ye=oe.lane;if((Ur&ye)===ye)V!==null&&(V=V.next={lane:0,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null}),c=oe.hasEagerState?oe.eagerState:n(c,oe.action);else{var Ee={lane:ye,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null};V===null?(F=V=Ee,T=c):V=V.next=Ee,Ft.lanes|=ye,Ir|=ye}oe=oe.next}while(oe!==null&&oe!==v);V===null?T=c:V.next=F,Jn(c,i.memoizedState)||(wn=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=V,a.lastRenderedState=c}if(n=a.interleaved,n!==null){h=n;do v=h.lane,Ft.lanes|=v,Ir|=v,h=h.next;while(h!==n)}else h===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function ru(n){var i=Gn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,h=a.pending,v=i.memoizedState;if(h!==null){a.pending=null;var T=h=h.next;do v=n(v,T.action),T=T.next;while(T!==h);Jn(v,i.memoizedState)||(wn=!0),i.memoizedState=v,i.baseQueue===null&&(i.baseState=v),a.lastRenderedState=v}return[v,c]}function uh(){}function dh(n,i){var a=Ft,c=Gn(),h=i(),v=!Jn(c.memoizedState,h);if(v&&(c.memoizedState=h,wn=!0),c=c.queue,su(ph.bind(null,a,c,n),[n]),c.getSnapshot!==i||v||Qt!==null&&Qt.memoizedState.tag&1){if(a.flags|=2048,Fa(9,hh.bind(null,a,c,h,i),void 0,null),en===null)throw Error(t(349));(Ur&30)!==0||fh(a,i,h)}return h}function fh(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function hh(n,i,a,c){i.value=a,i.getSnapshot=c,mh(i)&&gh(n)}function ph(n,i,a){return a(function(){mh(i)&&gh(n)})}function mh(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Jn(n,a)}catch{return!0}}function gh(n){var i=Ci(n,1);i!==null&&ii(i,n,1,-1)}function vh(n){var i=fi();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ia,lastRenderedState:n},i.queue=n,n=n.dispatch=N_.bind(null,Ft,n),[i.memoizedState,n]}function Fa(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function _h(){return Gn().memoizedState}function Bo(n,i,a,c){var h=fi();Ft.flags|=n,h.memoizedState=Fa(1|i,a,void 0,c===void 0?null:c)}function jo(n,i,a,c){var h=Gn();c=c===void 0?null:c;var v=void 0;if($t!==null){var T=$t.memoizedState;if(v=T.destroy,c!==null&&eu(c,T.deps)){h.memoizedState=Fa(i,a,v,c);return}}Ft.flags|=n,h.memoizedState=Fa(1|i,a,v,c)}function xh(n,i){return Bo(8390656,8,n,i)}function su(n,i){return jo(2048,8,n,i)}function yh(n,i){return jo(4,2,n,i)}function Sh(n,i){return jo(4,4,n,i)}function Mh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Eh(n,i,a){return a=a!=null?a.concat([n]):null,jo(4,4,Mh.bind(null,i,n),a)}function au(){}function wh(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function Th(n,i){var a=Gn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function Ah(n,i,a){return(Ur&21)===0?(n.baseState&&(n.baseState=!1,wn=!0),n.memoizedState=a):(Jn(a,i)||(a=tf(),Ft.lanes|=a,Ir|=a,n.baseState=!0),i)}function C_(n,i){var a=wt;wt=a!==0&&4>a?a:4,n(!0);var c=Qc.transition;Qc.transition={};try{n(!1),i()}finally{wt=a,Qc.transition=c}}function bh(){return Gn().memoizedState}function R_(n,i,a){var c=or(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Ch(n))Rh(i,a);else if(a=sh(n,i,a,c),a!==null){var h=_n();ii(a,n,c,h),Nh(a,i,c)}}function N_(n,i,a){var c=or(n),h={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ch(n))Rh(i,h);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=i.lastRenderedReducer,v!==null))try{var T=i.lastRenderedState,F=v(T,a);if(h.hasEagerState=!0,h.eagerState=F,Jn(F,T)){var V=i.interleaved;V===null?(h.next=h,Xc(i)):(h.next=V.next,V.next=h),i.interleaved=h;return}}catch{}finally{}a=sh(n,i,h,c),a!==null&&(h=_n(),ii(a,n,c,h),Nh(a,i,c))}}function Ch(n){var i=n.alternate;return n===Ft||i!==null&&i===Ft}function Rh(n,i){Da=zo=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Nh(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,lc(n,a)}}var Ho={readContext:Vn,useCallback:un,useContext:un,useEffect:un,useImperativeHandle:un,useInsertionEffect:un,useLayoutEffect:un,useMemo:un,useReducer:un,useRef:un,useState:un,useDebugValue:un,useDeferredValue:un,useTransition:un,useMutableSource:un,useSyncExternalStore:un,useId:un,unstable_isNewReconciler:!1},P_={readContext:Vn,useCallback:function(n,i){return fi().memoizedState=[n,i===void 0?null:i],n},useContext:Vn,useEffect:xh,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,Bo(4194308,4,Mh.bind(null,i,n),a)},useLayoutEffect:function(n,i){return Bo(4194308,4,n,i)},useInsertionEffect:function(n,i){return Bo(4,2,n,i)},useMemo:function(n,i){var a=fi();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=fi();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=R_.bind(null,Ft,n),[c.memoizedState,n]},useRef:function(n){var i=fi();return n={current:n},i.memoizedState=n},useState:vh,useDebugValue:au,useDeferredValue:function(n){return fi().memoizedState=n},useTransition:function(){var n=vh(!1),i=n[0];return n=C_.bind(null,n[1]),fi().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=Ft,h=fi();if(Ut){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),en===null)throw Error(t(349));(Ur&30)!==0||fh(c,i,a)}h.memoizedState=a;var v={value:a,getSnapshot:i};return h.queue=v,xh(ph.bind(null,c,v,n),[n]),c.flags|=2048,Fa(9,hh.bind(null,c,v,a,i),void 0,null),a},useId:function(){var n=fi(),i=en.identifierPrefix;if(Ut){var a=bi,c=Ai;a=(c&~(1<<32-Wt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Ua++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=b_++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},L_={readContext:Vn,useCallback:wh,useContext:Vn,useEffect:su,useImperativeHandle:Eh,useInsertionEffect:yh,useLayoutEffect:Sh,useMemo:Th,useReducer:iu,useRef:_h,useState:function(){return iu(Ia)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return Ah(i,$t.memoizedState,n)},useTransition:function(){var n=iu(Ia)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:uh,useSyncExternalStore:dh,useId:bh,unstable_isNewReconciler:!1},D_={readContext:Vn,useCallback:wh,useContext:Vn,useEffect:su,useImperativeHandle:Eh,useInsertionEffect:yh,useLayoutEffect:Sh,useMemo:Th,useReducer:ru,useRef:_h,useState:function(){return ru(Ia)},useDebugValue:au,useDeferredValue:function(n){var i=Gn();return $t===null?i.memoizedState=n:Ah(i,$t.memoizedState,n)},useTransition:function(){var n=ru(Ia)[0],i=Gn().memoizedState;return[n,i]},useMutableSource:uh,useSyncExternalStore:dh,useId:bh,unstable_isNewReconciler:!1};function ei(n,i){if(n&&n.defaultProps){i=Q({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function ou(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:Q({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Vo={isMounted:function(n){return(n=n._reactInternals)?P(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Io(i,n,h))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=_n(),h=or(n),v=Ri(c,h);v.tag=1,v.payload=i,a!=null&&(v.callback=a),i=ir(n,v,h),i!==null&&(ii(i,n,h,c),Io(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=_n(),c=or(n),h=Ri(a,c);h.tag=2,i!=null&&(h.callback=i),i=ir(n,h,c),i!==null&&(ii(i,n,c,a),Io(i,n,c))}};function Ph(n,i,a,c,h,v,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,v,T):i.prototype&&i.prototype.isPureReactComponent?!Ma(a,c)||!Ma(h,v):!0}function Lh(n,i,a){var c=!1,h=er,v=i.contextType;return typeof v=="object"&&v!==null?v=Vn(v):(h=En(i)?Rr:cn.current,c=i.contextTypes,v=(c=c!=null)?gs(n,h):er),i=new i(a,v),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Vo,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=v),i}function Dh(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&Vo.enqueueReplaceState(i,i.state,null)}function lu(n,i,a,c){var h=n.stateNode;h.props=a,h.state=n.memoizedState,h.refs={},qc(n);var v=i.contextType;typeof v=="object"&&v!==null?h.context=Vn(v):(v=En(i)?Rr:cn.current,h.context=gs(n,v)),h.state=n.memoizedState,v=i.getDerivedStateFromProps,typeof v=="function"&&(ou(n,i,v,a),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Vo.enqueueReplaceState(h,h.state,null),Fo(n,a,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function ws(n,i){try{var a="",c=i;do a+=pe(c),c=c.return;while(c);var h=a}catch(v){h=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:i,stack:h,digest:null}}function cu(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function uu(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var U_=typeof WeakMap=="function"?WeakMap:Map;function Uh(n,i,a){a=Ri(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){Ko||(Ko=!0,Tu=c),uu(n,i)},a}function Ih(n,i,a){a=Ri(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;a.payload=function(){return c(h)},a.callback=function(){uu(n,i)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(a.callback=function(){uu(n,i),typeof c!="function"&&(sr===null?sr=new Set([this]):sr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),a}function Fh(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new U_;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(a)||(h.add(a),n=q_.bind(null,n,i,a),i.then(n,n))}function Oh(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function kh(n,i,a,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Ri(-1,1),i.tag=2,ir(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var I_=U.ReactCurrentOwner,wn=!1;function vn(n,i,a,c){i.child=n===null?rh(i,null,a,c):ys(i,n.child,a,c)}function zh(n,i,a,c,h){a=a.render;var v=i.ref;return Ms(i,h),c=tu(n,i,a,c,v,h),a=nu(),n!==null&&!wn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&a&&kc(i),i.flags|=1,vn(n,i,c,h),i.child)}function Bh(n,i,a,c,h){if(n===null){var v=a.type;return typeof v=="function"&&!Lu(v)&&v.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=v,jh(n,i,v,c,h)):(n=nl(a.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(v=n.child,(n.lanes&h)===0){var T=v.memoizedProps;if(a=a.compare,a=a!==null?a:Ma,a(T,c)&&n.ref===i.ref)return Ni(n,i,h)}return i.flags|=1,n=cr(v,c),n.ref=i.ref,n.return=i,i.child=n}function jh(n,i,a,c,h){if(n!==null){var v=n.memoizedProps;if(Ma(v,c)&&n.ref===i.ref)if(wn=!1,i.pendingProps=c=v,(n.lanes&h)!==0)(n.flags&131072)!==0&&(wn=!0);else return i.lanes=n.lanes,Ni(n,i,h)}return du(n,i,a,c,h)}function Hh(n,i,a){var c=i.pendingProps,h=c.children,v=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Rt(As,Fn),Fn|=a;else{if((a&1073741824)===0)return n=v!==null?v.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Rt(As,Fn),Fn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=v!==null?v.baseLanes:a,Rt(As,Fn),Fn|=c}else v!==null?(c=v.baseLanes|a,i.memoizedState=null):c=a,Rt(As,Fn),Fn|=c;return vn(n,i,h,a),i.child}function Vh(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function du(n,i,a,c,h){var v=En(a)?Rr:cn.current;return v=gs(i,v),Ms(i,h),a=tu(n,i,a,c,v,h),c=nu(),n!==null&&!wn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ni(n,i,h)):(Ut&&c&&kc(i),i.flags|=1,vn(n,i,a,h),i.child)}function Gh(n,i,a,c,h){if(En(a)){var v=!0;bo(i)}else v=!1;if(Ms(i,h),i.stateNode===null)Wo(n,i),Lh(i,a,c),lu(i,a,c,h),c=!0;else if(n===null){var T=i.stateNode,F=i.memoizedProps;T.props=F;var V=T.context,oe=a.contextType;typeof oe=="object"&&oe!==null?oe=Vn(oe):(oe=En(a)?Rr:cn.current,oe=gs(i,oe));var ye=a.getDerivedStateFromProps,Ee=typeof ye=="function"||typeof T.getSnapshotBeforeUpdate=="function";Ee||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==c||V!==oe)&&Dh(i,T,c,oe),nr=!1;var xe=i.memoizedState;T.state=xe,Fo(i,c,T,h),V=i.memoizedState,F!==c||xe!==V||Mn.current||nr?(typeof ye=="function"&&(ou(i,a,ye,c),V=i.memoizedState),(F=nr||Ph(i,a,F,c,xe,V,oe))?(Ee||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=V),T.props=c,T.state=V,T.context=oe,c=F):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,ah(n,i),F=i.memoizedProps,oe=i.type===i.elementType?F:ei(i.type,F),T.props=oe,Ee=i.pendingProps,xe=T.context,V=a.contextType,typeof V=="object"&&V!==null?V=Vn(V):(V=En(a)?Rr:cn.current,V=gs(i,V));var De=a.getDerivedStateFromProps;(ye=typeof De=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==Ee||xe!==V)&&Dh(i,T,c,V),nr=!1,xe=i.memoizedState,T.state=xe,Fo(i,c,T,h);var ke=i.memoizedState;F!==Ee||xe!==ke||Mn.current||nr?(typeof De=="function"&&(ou(i,a,De,c),ke=i.memoizedState),(oe=nr||Ph(i,a,oe,c,xe,ke,V)||!1)?(ye||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,ke,V),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,ke,V)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=ke),T.props=c,T.state=ke,T.context=V,c=oe):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&xe===n.memoizedState||(i.flags|=1024),c=!1)}return fu(n,i,a,c,v,h)}function fu(n,i,a,c,h,v){Vh(n,i);var T=(i.flags&128)!==0;if(!c&&!T)return h&&Yf(i,a,!1),Ni(n,i,v);c=i.stateNode,I_.current=i;var F=T&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&T?(i.child=ys(i,n.child,null,v),i.child=ys(i,null,F,v)):vn(n,i,F,v),i.memoizedState=c.state,h&&Yf(i,a,!0),i.child}function Wh(n){var i=n.stateNode;i.pendingContext?Xf(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Xf(n,i.context,!1),Yc(n,i.containerInfo)}function $h(n,i,a,c,h){return xs(),Hc(h),i.flags|=256,vn(n,i,a,c),i.child}var hu={dehydrated:null,treeContext:null,retryLane:0};function pu(n){return{baseLanes:n,cachePool:null,transitions:null}}function Xh(n,i,a){var c=i.pendingProps,h=It.current,v=!1,T=(i.flags&128)!==0,F;if((F=T)||(F=n!==null&&n.memoizedState===null?!1:(h&2)!==0),F?(v=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),Rt(It,h&1),n===null)return jc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,n=c.fallback,v?(c=i.mode,v=i.child,T={mode:"hidden",children:T},(c&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=T):v=il(T,c,0,null),n=zr(n,c,a,null),v.return=i,n.return=i,v.sibling=n,i.child=v,i.child.memoizedState=pu(a),i.memoizedState=hu,n):mu(i,T));if(h=n.memoizedState,h!==null&&(F=h.dehydrated,F!==null))return F_(n,i,T,c,F,h,a);if(v){v=c.fallback,T=i.mode,h=n.child,F=h.sibling;var V={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=V,i.deletions=null):(c=cr(h,V),c.subtreeFlags=h.subtreeFlags&14680064),F!==null?v=cr(F,v):(v=zr(v,T,a,null),v.flags|=2),v.return=i,c.return=i,c.sibling=v,i.child=c,c=v,v=i.child,T=n.child.memoizedState,T=T===null?pu(a):{baseLanes:T.baseLanes|a,cachePool:null,transitions:T.transitions},v.memoizedState=T,v.childLanes=n.childLanes&~a,i.memoizedState=hu,c}return v=n.child,n=v.sibling,c=cr(v,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function mu(n,i){return i=il({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Go(n,i,a,c){return c!==null&&Hc(c),ys(i,n.child,null,a),n=mu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function F_(n,i,a,c,h,v,T){if(a)return i.flags&256?(i.flags&=-257,c=cu(Error(t(422))),Go(n,i,T,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(v=c.fallback,h=i.mode,c=il({mode:"visible",children:c.children},h,0,null),v=zr(v,h,T,null),v.flags|=2,c.return=i,v.return=i,c.sibling=v,i.child=c,(i.mode&1)!==0&&ys(i,n.child,null,T),i.child.memoizedState=pu(T),i.memoizedState=hu,v);if((i.mode&1)===0)return Go(n,i,T,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var F=c.dgst;return c=F,v=Error(t(419)),c=cu(v,c,void 0),Go(n,i,T,c)}if(F=(T&n.childLanes)!==0,wn||F){if(c=en,c!==null){switch(T&-T){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|T))!==0?0:h,h!==0&&h!==v.retryLane&&(v.retryLane=h,Ci(n,h),ii(c,n,h,-1))}return Pu(),c=cu(Error(t(421))),Go(n,i,T,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=Y_.bind(null,n),h._reactRetry=i,null):(n=v.treeContext,In=Ji(h.nextSibling),Un=i,Ut=!0,Qn=null,n!==null&&(jn[Hn++]=Ai,jn[Hn++]=bi,jn[Hn++]=Nr,Ai=n.id,bi=n.overflow,Nr=i),i=mu(i,c.children),i.flags|=4096,i)}function qh(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),$c(n.return,i,a)}function gu(n,i,a,c,h){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:h}:(v.isBackwards=i,v.rendering=null,v.renderingStartTime=0,v.last=c,v.tail=a,v.tailMode=h)}function Yh(n,i,a){var c=i.pendingProps,h=c.revealOrder,v=c.tail;if(vn(n,i,c.children,a),c=It.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&qh(n,a,i);else if(n.tag===19)qh(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Rt(It,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(a=i.child,h=null;a!==null;)n=a.alternate,n!==null&&Oo(n)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),gu(i,!1,h,a,v);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Oo(n)===null){i.child=h;break}n=h.sibling,h.sibling=a,a=h,h=n}gu(i,!0,a,null,v);break;case"together":gu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Wo(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ni(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Ir|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=cr(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=cr(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function O_(n,i,a){switch(i.tag){case 3:Wh(i),xs();break;case 5:ch(i);break;case 1:En(i.type)&&bo(i);break;case 4:Yc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;Rt(Do,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(Rt(It,It.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Xh(n,i,a):(Rt(It,It.current&1),n=Ni(n,i,a),n!==null?n.sibling:null);Rt(It,It.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Yh(n,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),Rt(It,It.current),c)break;return null;case 22:case 23:return i.lanes=0,Hh(n,i,a)}return Ni(n,i,a)}var Kh,vu,Zh,Jh;Kh=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},vu=function(){},Zh=function(n,i,a,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Dr(di.current);var v=null;switch(a){case"input":h=Xe(n,h),c=Xe(n,c),v=[];break;case"select":h=Q({},h,{value:void 0}),c=Q({},c,{value:void 0}),v=[];break;case"textarea":h=ge(n,h),c=ge(n,c),v=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=wo)}bt(a,c);var T;a=null;for(oe in h)if(!c.hasOwnProperty(oe)&&h.hasOwnProperty(oe)&&h[oe]!=null)if(oe==="style"){var F=h[oe];for(T in F)F.hasOwnProperty(T)&&(a||(a={}),a[T]="")}else oe!=="dangerouslySetInnerHTML"&&oe!=="children"&&oe!=="suppressContentEditableWarning"&&oe!=="suppressHydrationWarning"&&oe!=="autoFocus"&&(o.hasOwnProperty(oe)?v||(v=[]):(v=v||[]).push(oe,null));for(oe in c){var V=c[oe];if(F=h!=null?h[oe]:void 0,c.hasOwnProperty(oe)&&V!==F&&(V!=null||F!=null))if(oe==="style")if(F){for(T in F)!F.hasOwnProperty(T)||V&&V.hasOwnProperty(T)||(a||(a={}),a[T]="");for(T in V)V.hasOwnProperty(T)&&F[T]!==V[T]&&(a||(a={}),a[T]=V[T])}else a||(v||(v=[]),v.push(oe,a)),a=V;else oe==="dangerouslySetInnerHTML"?(V=V?V.__html:void 0,F=F?F.__html:void 0,V!=null&&F!==V&&(v=v||[]).push(oe,V)):oe==="children"?typeof V!="string"&&typeof V!="number"||(v=v||[]).push(oe,""+V):oe!=="suppressContentEditableWarning"&&oe!=="suppressHydrationWarning"&&(o.hasOwnProperty(oe)?(V!=null&&oe==="onScroll"&&Nt("scroll",n),v||F===V||(v=[])):(v=v||[]).push(oe,V))}a&&(v=v||[]).push("style",a);var oe=v;(i.updateQueue=oe)&&(i.flags|=4)}},Jh=function(n,i,a,c){a!==c&&(i.flags|=4)};function Oa(n,i){if(!Ut)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function dn(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)a|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function k_(n,i,a){var c=i.pendingProps;switch(zc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return dn(i),null;case 1:return En(i.type)&&Ao(),dn(i),null;case 3:return c=i.stateNode,Es(),Pt(Mn),Pt(cn),Jc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Po(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Qn!==null&&(Cu(Qn),Qn=null))),vu(n,i),dn(i),null;case 5:Kc(i);var h=Dr(La.current);if(a=i.type,n!==null&&i.stateNode!=null)Zh(n,i,a,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return dn(i),null}if(n=Dr(di.current),Po(i)){c=i.stateNode,a=i.type;var v=i.memoizedProps;switch(c[ui]=i,c[ba]=v,n=(i.mode&1)!==0,a){case"dialog":Nt("cancel",c),Nt("close",c);break;case"iframe":case"object":case"embed":Nt("load",c);break;case"video":case"audio":for(h=0;h<wa.length;h++)Nt(wa[h],c);break;case"source":Nt("error",c);break;case"img":case"image":case"link":Nt("error",c),Nt("load",c);break;case"details":Nt("toggle",c);break;case"input":lt(c,v),Nt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!v.multiple},Nt("invalid",c);break;case"textarea":Se(c,v),Nt("invalid",c)}bt(a,v),h=null;for(var T in v)if(v.hasOwnProperty(T)){var F=v[T];T==="children"?typeof F=="string"?c.textContent!==F&&(v.suppressHydrationWarning!==!0&&Eo(c.textContent,F,n),h=["children",F]):typeof F=="number"&&c.textContent!==""+F&&(v.suppressHydrationWarning!==!0&&Eo(c.textContent,F,n),h=["children",""+F]):o.hasOwnProperty(T)&&F!=null&&T==="onScroll"&&Nt("scroll",c)}switch(a){case"input":gt(c),Tt(c,v,!0);break;case"textarea":gt(c),We(c);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(c.onclick=wo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Re(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=T.createElement(a,{is:c.is}):(n=T.createElement(a),a==="select"&&(T=n,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):n=T.createElementNS(n,a),n[ui]=i,n[ba]=c,Kh(n,i,!1,!1),i.stateNode=n;e:{switch(T=rt(a,c),a){case"dialog":Nt("cancel",n),Nt("close",n),h=c;break;case"iframe":case"object":case"embed":Nt("load",n),h=c;break;case"video":case"audio":for(h=0;h<wa.length;h++)Nt(wa[h],n);h=c;break;case"source":Nt("error",n),h=c;break;case"img":case"image":case"link":Nt("error",n),Nt("load",n),h=c;break;case"details":Nt("toggle",n),h=c;break;case"input":lt(n,c),h=Xe(n,c),Nt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=Q({},c,{value:void 0}),Nt("invalid",n);break;case"textarea":Se(n,c),h=ge(n,c),Nt("invalid",n);break;default:h=c}bt(a,h),F=h;for(v in F)if(F.hasOwnProperty(v)){var V=F[v];v==="style"?st(n,V):v==="dangerouslySetInnerHTML"?(V=V?V.__html:void 0,V!=null&&Ae(n,V)):v==="children"?typeof V=="string"?(a!=="textarea"||V!=="")&&He(n,V):typeof V=="number"&&He(n,""+V):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(o.hasOwnProperty(v)?V!=null&&v==="onScroll"&&Nt("scroll",n):V!=null&&N(n,v,V,T))}switch(a){case"input":gt(n),Tt(n,c,!1);break;case"textarea":gt(n),We(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Le(c.value));break;case"select":n.multiple=!!c.multiple,v=c.value,v!=null?de(n,!!c.multiple,v,!1):c.defaultValue!=null&&de(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=wo)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return dn(i),null;case 6:if(n&&i.stateNode!=null)Jh(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Dr(La.current),Dr(di.current),Po(i)){if(c=i.stateNode,a=i.memoizedProps,c[ui]=i,(v=c.nodeValue!==a)&&(n=Un,n!==null))switch(n.tag){case 3:Eo(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Eo(c.nodeValue,a,(n.mode&1)!==0)}v&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ui]=i,i.stateNode=c}return dn(i),null;case 13:if(Pt(It),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ut&&In!==null&&(i.mode&1)!==0&&(i.flags&128)===0)th(),xs(),i.flags|=98560,v=!1;else if(v=Po(i),c!==null&&c.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=i.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[ui]=i}else xs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;dn(i),v=!1}else Qn!==null&&(Cu(Qn),Qn=null),v=!0;if(!v)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(It.current&1)!==0?Xt===0&&(Xt=3):Pu())),i.updateQueue!==null&&(i.flags|=4),dn(i),null);case 4:return Es(),vu(n,i),n===null&&Ta(i.stateNode.containerInfo),dn(i),null;case 10:return Wc(i.type._context),dn(i),null;case 17:return En(i.type)&&Ao(),dn(i),null;case 19:if(Pt(It),v=i.memoizedState,v===null)return dn(i),null;if(c=(i.flags&128)!==0,T=v.rendering,T===null)if(c)Oa(v,!1);else{if(Xt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=Oo(n),T!==null){for(i.flags|=128,Oa(v,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)v=a,n=c,v.flags&=14680066,T=v.alternate,T===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=T.childLanes,v.lanes=T.lanes,v.child=T.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=T.memoizedProps,v.memoizedState=T.memoizedState,v.updateQueue=T.updateQueue,v.type=T.type,n=T.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Rt(It,It.current&1|2),i.child}n=n.sibling}v.tail!==null&&ze()>bs&&(i.flags|=128,c=!0,Oa(v,!1),i.lanes=4194304)}else{if(!c)if(n=Oo(T),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Oa(v,!0),v.tail===null&&v.tailMode==="hidden"&&!T.alternate&&!Ut)return dn(i),null}else 2*ze()-v.renderingStartTime>bs&&a!==1073741824&&(i.flags|=128,c=!0,Oa(v,!1),i.lanes=4194304);v.isBackwards?(T.sibling=i.child,i.child=T):(a=v.last,a!==null?a.sibling=T:i.child=T,v.last=T)}return v.tail!==null?(i=v.tail,v.rendering=i,v.tail=i.sibling,v.renderingStartTime=ze(),i.sibling=null,a=It.current,Rt(It,c?a&1|2:a&1),i):(dn(i),null);case 22:case 23:return Nu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(Fn&1073741824)!==0&&(dn(i),i.subtreeFlags&6&&(i.flags|=8192)):dn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function z_(n,i){switch(zc(i),i.tag){case 1:return En(i.type)&&Ao(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Es(),Pt(Mn),Pt(cn),Jc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Kc(i),null;case 13:if(Pt(It),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));xs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Pt(It),null;case 4:return Es(),null;case 10:return Wc(i.type._context),null;case 22:case 23:return Nu(),null;case 24:return null;default:return null}}var $o=!1,fn=!1,B_=typeof WeakSet=="function"?WeakSet:Set,Oe=null;function Ts(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){Ot(n,i,c)}else a.current=null}function _u(n,i,a){try{a()}catch(c){Ot(n,i,c)}}var Qh=!1;function j_(n,i){if(Nc=fo,n=Pf(),Mc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var h=c.anchorOffset,v=c.focusNode;c=c.focusOffset;try{a.nodeType,v.nodeType}catch{a=null;break e}var T=0,F=-1,V=-1,oe=0,ye=0,Ee=n,xe=null;t:for(;;){for(var De;Ee!==a||h!==0&&Ee.nodeType!==3||(F=T+h),Ee!==v||c!==0&&Ee.nodeType!==3||(V=T+c),Ee.nodeType===3&&(T+=Ee.nodeValue.length),(De=Ee.firstChild)!==null;)xe=Ee,Ee=De;for(;;){if(Ee===n)break t;if(xe===a&&++oe===h&&(F=T),xe===v&&++ye===c&&(V=T),(De=Ee.nextSibling)!==null)break;Ee=xe,xe=Ee.parentNode}Ee=De}a=F===-1||V===-1?null:{start:F,end:V}}else a=null}a=a||{start:0,end:0}}else a=null;for(Pc={focusedElem:n,selectionRange:a},fo=!1,Oe=i;Oe!==null;)if(i=Oe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Oe=n;else for(;Oe!==null;){i=Oe;try{var ke=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(ke!==null){var Be=ke.memoizedProps,zt=ke.memoizedState,ee=i.stateNode,$=ee.getSnapshotBeforeUpdate(i.elementType===i.type?Be:ei(i.type,Be),zt);ee.__reactInternalSnapshotBeforeUpdate=$}break;case 3:var ie=i.stateNode.containerInfo;ie.nodeType===1?ie.textContent="":ie.nodeType===9&&ie.documentElement&&ie.removeChild(ie.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Te){Ot(i,i.return,Te)}if(n=i.sibling,n!==null){n.return=i.return,Oe=n;break}Oe=i.return}return ke=Qh,Qh=!1,ke}function ka(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var v=h.destroy;h.destroy=void 0,v!==void 0&&_u(i,a,v)}h=h.next}while(h!==c)}}function Xo(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function xu(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function ep(n){var i=n.alternate;i!==null&&(n.alternate=null,ep(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[ui],delete i[ba],delete i[Ic],delete i[E_],delete i[w_])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function tp(n){return n.tag===5||n.tag===3||n.tag===4}function np(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||tp(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function yu(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=wo));else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,a),n=n.sibling;n!==null;)yu(n,i,a),n=n.sibling}function Su(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Su(n,i,a),n=n.sibling;n!==null;)Su(n,i,a),n=n.sibling}var an=null,ti=!1;function rr(n,i,a){for(a=a.child;a!==null;)ip(n,i,a),a=a.sibling}function ip(n,i,a){if(ln&&typeof ln.onCommitFiberUnmount=="function")try{ln.onCommitFiberUnmount(Qe,a)}catch{}switch(a.tag){case 5:fn||Ts(a,i);case 6:var c=an,h=ti;an=null,rr(n,i,a),an=c,ti=h,an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):an.removeChild(a.stateNode));break;case 18:an!==null&&(ti?(n=an,a=a.stateNode,n.nodeType===8?Uc(n.parentNode,a):n.nodeType===1&&Uc(n,a),ga(n)):Uc(an,a.stateNode));break;case 4:c=an,h=ti,an=a.stateNode.containerInfo,ti=!0,rr(n,i,a),an=c,ti=h;break;case 0:case 11:case 14:case 15:if(!fn&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var v=h,T=v.destroy;v=v.tag,T!==void 0&&((v&2)!==0||(v&4)!==0)&&_u(a,i,T),h=h.next}while(h!==c)}rr(n,i,a);break;case 1:if(!fn&&(Ts(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(F){Ot(a,i,F)}rr(n,i,a);break;case 21:rr(n,i,a);break;case 22:a.mode&1?(fn=(c=fn)||a.memoizedState!==null,rr(n,i,a),fn=c):rr(n,i,a);break;default:rr(n,i,a)}}function rp(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new B_),i.forEach(function(c){var h=K_.bind(null,n,c);a.has(c)||(a.add(c),c.then(h,h))})}}function ni(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var h=a[c];try{var v=n,T=i,F=T;e:for(;F!==null;){switch(F.tag){case 5:an=F.stateNode,ti=!1;break e;case 3:an=F.stateNode.containerInfo,ti=!0;break e;case 4:an=F.stateNode.containerInfo,ti=!0;break e}F=F.return}if(an===null)throw Error(t(160));ip(v,T,h),an=null,ti=!1;var V=h.alternate;V!==null&&(V.return=null),h.return=null}catch(oe){Ot(h,i,oe)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)sp(i,n),i=i.sibling}function sp(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(ni(i,n),hi(n),c&4){try{ka(3,n,n.return),Xo(3,n)}catch(Be){Ot(n,n.return,Be)}try{ka(5,n,n.return)}catch(Be){Ot(n,n.return,Be)}}break;case 1:ni(i,n),hi(n),c&512&&a!==null&&Ts(a,a.return);break;case 5:if(ni(i,n),hi(n),c&512&&a!==null&&Ts(a,a.return),n.flags&32){var h=n.stateNode;try{He(h,"")}catch(Be){Ot(n,n.return,Be)}}if(c&4&&(h=n.stateNode,h!=null)){var v=n.memoizedProps,T=a!==null?a.memoizedProps:v,F=n.type,V=n.updateQueue;if(n.updateQueue=null,V!==null)try{F==="input"&&v.type==="radio"&&v.name!=null&&it(h,v),rt(F,T);var oe=rt(F,v);for(T=0;T<V.length;T+=2){var ye=V[T],Ee=V[T+1];ye==="style"?st(h,Ee):ye==="dangerouslySetInnerHTML"?Ae(h,Ee):ye==="children"?He(h,Ee):N(h,ye,Ee,oe)}switch(F){case"input":ot(h,v);break;case"textarea":Me(h,v);break;case"select":var xe=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!v.multiple;var De=v.value;De!=null?de(h,!!v.multiple,De,!1):xe!==!!v.multiple&&(v.defaultValue!=null?de(h,!!v.multiple,v.defaultValue,!0):de(h,!!v.multiple,v.multiple?[]:"",!1))}h[ba]=v}catch(Be){Ot(n,n.return,Be)}}break;case 6:if(ni(i,n),hi(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,v=n.memoizedProps;try{h.nodeValue=v}catch(Be){Ot(n,n.return,Be)}}break;case 3:if(ni(i,n),hi(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{ga(i.containerInfo)}catch(Be){Ot(n,n.return,Be)}break;case 4:ni(i,n),hi(n);break;case 13:ni(i,n),hi(n),h=n.child,h.flags&8192&&(v=h.memoizedState!==null,h.stateNode.isHidden=v,!v||h.alternate!==null&&h.alternate.memoizedState!==null||(wu=ze())),c&4&&rp(n);break;case 22:if(ye=a!==null&&a.memoizedState!==null,n.mode&1?(fn=(oe=fn)||ye,ni(i,n),fn=oe):ni(i,n),hi(n),c&8192){if(oe=n.memoizedState!==null,(n.stateNode.isHidden=oe)&&!ye&&(n.mode&1)!==0)for(Oe=n,ye=n.child;ye!==null;){for(Ee=Oe=ye;Oe!==null;){switch(xe=Oe,De=xe.child,xe.tag){case 0:case 11:case 14:case 15:ka(4,xe,xe.return);break;case 1:Ts(xe,xe.return);var ke=xe.stateNode;if(typeof ke.componentWillUnmount=="function"){c=xe,a=xe.return;try{i=c,ke.props=i.memoizedProps,ke.state=i.memoizedState,ke.componentWillUnmount()}catch(Be){Ot(c,a,Be)}}break;case 5:Ts(xe,xe.return);break;case 22:if(xe.memoizedState!==null){lp(Ee);continue}}De!==null?(De.return=xe,Oe=De):lp(Ee)}ye=ye.sibling}e:for(ye=null,Ee=n;;){if(Ee.tag===5){if(ye===null){ye=Ee;try{h=Ee.stateNode,oe?(v=h.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(F=Ee.stateNode,V=Ee.memoizedProps.style,T=V!=null&&V.hasOwnProperty("display")?V.display:null,F.style.display=Ie("display",T))}catch(Be){Ot(n,n.return,Be)}}}else if(Ee.tag===6){if(ye===null)try{Ee.stateNode.nodeValue=oe?"":Ee.memoizedProps}catch(Be){Ot(n,n.return,Be)}}else if((Ee.tag!==22&&Ee.tag!==23||Ee.memoizedState===null||Ee===n)&&Ee.child!==null){Ee.child.return=Ee,Ee=Ee.child;continue}if(Ee===n)break e;for(;Ee.sibling===null;){if(Ee.return===null||Ee.return===n)break e;ye===Ee&&(ye=null),Ee=Ee.return}ye===Ee&&(ye=null),Ee.sibling.return=Ee.return,Ee=Ee.sibling}}break;case 19:ni(i,n),hi(n),c&4&&rp(n);break;case 21:break;default:ni(i,n),hi(n)}}function hi(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(tp(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(He(h,""),c.flags&=-33);var v=np(n);Su(n,v,h);break;case 3:case 4:var T=c.stateNode.containerInfo,F=np(n);yu(n,F,T);break;default:throw Error(t(161))}}catch(V){Ot(n,n.return,V)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function H_(n,i,a){Oe=n,ap(n)}function ap(n,i,a){for(var c=(n.mode&1)!==0;Oe!==null;){var h=Oe,v=h.child;if(h.tag===22&&c){var T=h.memoizedState!==null||$o;if(!T){var F=h.alternate,V=F!==null&&F.memoizedState!==null||fn;F=$o;var oe=fn;if($o=T,(fn=V)&&!oe)for(Oe=h;Oe!==null;)T=Oe,V=T.child,T.tag===22&&T.memoizedState!==null?cp(h):V!==null?(V.return=T,Oe=V):cp(h);for(;v!==null;)Oe=v,ap(v),v=v.sibling;Oe=h,$o=F,fn=oe}op(n)}else(h.subtreeFlags&8772)!==0&&v!==null?(v.return=h,Oe=v):op(n)}}function op(n){for(;Oe!==null;){var i=Oe;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:fn||Xo(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!fn)if(a===null)c.componentDidMount();else{var h=i.elementType===i.type?a.memoizedProps:ei(i.type,a.memoizedProps);c.componentDidUpdate(h,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var v=i.updateQueue;v!==null&&lh(i,v,c);break;case 3:var T=i.updateQueue;if(T!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}lh(i,T,a)}break;case 5:var F=i.stateNode;if(a===null&&i.flags&4){a=F;var V=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":V.autoFocus&&a.focus();break;case"img":V.src&&(a.src=V.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var oe=i.alternate;if(oe!==null){var ye=oe.memoizedState;if(ye!==null){var Ee=ye.dehydrated;Ee!==null&&ga(Ee)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}fn||i.flags&512&&xu(i)}catch(xe){Ot(i,i.return,xe)}}if(i===n){Oe=null;break}if(a=i.sibling,a!==null){a.return=i.return,Oe=a;break}Oe=i.return}}function lp(n){for(;Oe!==null;){var i=Oe;if(i===n){Oe=null;break}var a=i.sibling;if(a!==null){a.return=i.return,Oe=a;break}Oe=i.return}}function cp(n){for(;Oe!==null;){var i=Oe;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{Xo(4,i)}catch(V){Ot(i,a,V)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(V){Ot(i,h,V)}}var v=i.return;try{xu(i)}catch(V){Ot(i,v,V)}break;case 5:var T=i.return;try{xu(i)}catch(V){Ot(i,T,V)}}}catch(V){Ot(i,i.return,V)}if(i===n){Oe=null;break}var F=i.sibling;if(F!==null){F.return=i.return,Oe=F;break}Oe=i.return}}var V_=Math.ceil,qo=U.ReactCurrentDispatcher,Mu=U.ReactCurrentOwner,Wn=U.ReactCurrentBatchConfig,_t=0,en=null,jt=null,on=0,Fn=0,As=Qi(0),Xt=0,za=null,Ir=0,Yo=0,Eu=0,Ba=null,Tn=null,wu=0,bs=1/0,Pi=null,Ko=!1,Tu=null,sr=null,Zo=!1,ar=null,Jo=0,ja=0,Au=null,Qo=-1,el=0;function _n(){return(_t&6)!==0?ze():Qo!==-1?Qo:Qo=ze()}function or(n){return(n.mode&1)===0?1:(_t&2)!==0&&on!==0?on&-on:A_.transition!==null?(el===0&&(el=tf()),el):(n=wt,n!==0||(n=window.event,n=n===void 0?16:df(n.type)),n)}function ii(n,i,a,c){if(50<ja)throw ja=0,Au=null,Error(t(185));da(n,a,c),((_t&2)===0||n!==en)&&(n===en&&((_t&2)===0&&(Yo|=a),Xt===4&&lr(n,on)),An(n,c),a===1&&_t===0&&(i.mode&1)===0&&(bs=ze()+500,Co&&tr()))}function An(n,i){var a=n.callbackNode;ac(n,i);var c=sn(n,n===en?on:0);if(c===0)a!==null&&Ge(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&Ge(a),i===1)n.tag===0?T_(dp.bind(null,n)):Kf(dp.bind(null,n)),S_(function(){(_t&6)===0&&tr()}),a=null;else{switch(nf(c)){case 1:a=Dt;break;case 4:a=Gt;break;case 16:a=Jt;break;case 536870912:a=vt;break;default:a=Jt}a=xp(a,up.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function up(n,i){if(Qo=-1,el=0,(_t&6)!==0)throw Error(t(327));var a=n.callbackNode;if(Cs()&&n.callbackNode!==a)return null;var c=sn(n,n===en?on:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=tl(n,c);else{i=c;var h=_t;_t|=2;var v=hp();(en!==n||on!==i)&&(Pi=null,bs=ze()+500,Or(n,i));do try{$_();break}catch(F){fp(n,F)}while(!0);Gc(),qo.current=v,_t=h,jt!==null?i=0:(en=null,on=0,i=Xt)}if(i!==0){if(i===2&&(h=as(n),h!==0&&(c=h,i=bu(n,h))),i===1)throw a=za,Or(n,0),lr(n,c),An(n,ze()),a;if(i===6)lr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!G_(h)&&(i=tl(n,c),i===2&&(v=as(n),v!==0&&(c=v,i=bu(n,v))),i===1))throw a=za,Or(n,0),lr(n,c),An(n,ze()),a;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:kr(n,Tn,Pi);break;case 3:if(lr(n,c),(c&130023424)===c&&(i=wu+500-ze(),10<i)){if(sn(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){_n(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Dc(kr.bind(null,n,Tn,Pi),i);break}kr(n,Tn,Pi);break;case 4:if(lr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var T=31-Wt(c);v=1<<T,T=i[T],T>h&&(h=T),c&=~v}if(c=h,c=ze()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*V_(c/1960))-c,10<c){n.timeoutHandle=Dc(kr.bind(null,n,Tn,Pi),c);break}kr(n,Tn,Pi);break;case 5:kr(n,Tn,Pi);break;default:throw Error(t(329))}}}return An(n,ze()),n.callbackNode===a?up.bind(null,n):null}function bu(n,i){var a=Ba;return n.current.memoizedState.isDehydrated&&(Or(n,i).flags|=256),n=tl(n,i),n!==2&&(i=Tn,Tn=a,i!==null&&Cu(i)),n}function Cu(n){Tn===null?Tn=n:Tn.push.apply(Tn,n)}function G_(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var h=a[c],v=h.getSnapshot;h=h.value;try{if(!Jn(v(),h))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function lr(n,i){for(i&=~Eu,i&=~Yo,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Wt(i),c=1<<a;n[a]=-1,i&=~c}}function dp(n){if((_t&6)!==0)throw Error(t(327));Cs();var i=sn(n,0);if((i&1)===0)return An(n,ze()),null;var a=tl(n,i);if(n.tag!==0&&a===2){var c=as(n);c!==0&&(i=c,a=bu(n,c))}if(a===1)throw a=za,Or(n,0),lr(n,i),An(n,ze()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,kr(n,Tn,Pi),An(n,ze()),null}function Ru(n,i){var a=_t;_t|=1;try{return n(i)}finally{_t=a,_t===0&&(bs=ze()+500,Co&&tr())}}function Fr(n){ar!==null&&ar.tag===0&&(_t&6)===0&&Cs();var i=_t;_t|=1;var a=Wn.transition,c=wt;try{if(Wn.transition=null,wt=1,n)return n()}finally{wt=c,Wn.transition=a,_t=i,(_t&6)===0&&tr()}}function Nu(){Fn=As.current,Pt(As)}function Or(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,y_(a)),jt!==null)for(a=jt.return;a!==null;){var c=a;switch(zc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&Ao();break;case 3:Es(),Pt(Mn),Pt(cn),Jc();break;case 5:Kc(c);break;case 4:Es();break;case 13:Pt(It);break;case 19:Pt(It);break;case 10:Wc(c.type._context);break;case 22:case 23:Nu()}a=a.return}if(en=n,jt=n=cr(n.current,null),on=Fn=i,Xt=0,za=null,Eu=Yo=Ir=0,Tn=Ba=null,Lr!==null){for(i=0;i<Lr.length;i++)if(a=Lr[i],c=a.interleaved,c!==null){a.interleaved=null;var h=c.next,v=a.pending;if(v!==null){var T=v.next;v.next=h,c.next=T}a.pending=c}Lr=null}return n}function fp(n,i){do{var a=jt;try{if(Gc(),ko.current=Ho,zo){for(var c=Ft.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}zo=!1}if(Ur=0,Qt=$t=Ft=null,Da=!1,Ua=0,Mu.current=null,a===null||a.return===null){Xt=1,za=i,jt=null;break}e:{var v=n,T=a.return,F=a,V=i;if(i=on,F.flags|=32768,V!==null&&typeof V=="object"&&typeof V.then=="function"){var oe=V,ye=F,Ee=ye.tag;if((ye.mode&1)===0&&(Ee===0||Ee===11||Ee===15)){var xe=ye.alternate;xe?(ye.updateQueue=xe.updateQueue,ye.memoizedState=xe.memoizedState,ye.lanes=xe.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var De=Oh(T);if(De!==null){De.flags&=-257,kh(De,T,F,v,i),De.mode&1&&Fh(v,oe,i),i=De,V=oe;var ke=i.updateQueue;if(ke===null){var Be=new Set;Be.add(V),i.updateQueue=Be}else ke.add(V);break e}else{if((i&1)===0){Fh(v,oe,i),Pu();break e}V=Error(t(426))}}else if(Ut&&F.mode&1){var zt=Oh(T);if(zt!==null){(zt.flags&65536)===0&&(zt.flags|=256),kh(zt,T,F,v,i),Hc(ws(V,F));break e}}v=V=ws(V,F),Xt!==4&&(Xt=2),Ba===null?Ba=[v]:Ba.push(v),v=T;do{switch(v.tag){case 3:v.flags|=65536,i&=-i,v.lanes|=i;var ee=Uh(v,V,i);oh(v,ee);break e;case 1:F=V;var $=v.type,ie=v.stateNode;if((v.flags&128)===0&&(typeof $.getDerivedStateFromError=="function"||ie!==null&&typeof ie.componentDidCatch=="function"&&(sr===null||!sr.has(ie)))){v.flags|=65536,i&=-i,v.lanes|=i;var Te=Ih(v,F,i);oh(v,Te);break e}}v=v.return}while(v!==null)}mp(a)}catch(Ve){i=Ve,jt===a&&a!==null&&(jt=a=a.return);continue}break}while(!0)}function hp(){var n=qo.current;return qo.current=Ho,n===null?Ho:n}function Pu(){(Xt===0||Xt===3||Xt===2)&&(Xt=4),en===null||(Ir&268435455)===0&&(Yo&268435455)===0||lr(en,on)}function tl(n,i){var a=_t;_t|=2;var c=hp();(en!==n||on!==i)&&(Pi=null,Or(n,i));do try{W_();break}catch(h){fp(n,h)}while(!0);if(Gc(),_t=a,qo.current=c,jt!==null)throw Error(t(261));return en=null,on=0,Xt}function W_(){for(;jt!==null;)pp(jt)}function $_(){for(;jt!==null&&!Je();)pp(jt)}function pp(n){var i=_p(n.alternate,n,Fn);n.memoizedProps=n.pendingProps,i===null?mp(n):jt=i,Mu.current=null}function mp(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=k_(a,i,Fn),a!==null){jt=a;return}}else{if(a=z_(a,i),a!==null){a.flags&=32767,jt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Xt=6,jt=null;return}}if(i=i.sibling,i!==null){jt=i;return}jt=i=n}while(i!==null);Xt===0&&(Xt=5)}function kr(n,i,a){var c=wt,h=Wn.transition;try{Wn.transition=null,wt=1,X_(n,i,a,c)}finally{Wn.transition=h,wt=c}return null}function X_(n,i,a,c){do Cs();while(ar!==null);if((_t&6)!==0)throw Error(t(327));a=n.finishedWork;var h=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=a.lanes|a.childLanes;if(bv(n,v),n===en&&(jt=en=null,on=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Zo||(Zo=!0,xp(Jt,function(){return Cs(),null})),v=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||v){v=Wn.transition,Wn.transition=null;var T=wt;wt=1;var F=_t;_t|=4,Mu.current=null,j_(n,a),sp(a,n),h_(Pc),fo=!!Nc,Pc=Nc=null,n.current=a,H_(a),at(),_t=F,wt=T,Wn.transition=v}else n.current=a;if(Zo&&(Zo=!1,ar=n,Jo=h),v=n.pendingLanes,v===0&&(sr=null),Ct(a.stateNode),An(n,ze()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)h=i[a],c(h.value,{componentStack:h.stack,digest:h.digest});if(Ko)throw Ko=!1,n=Tu,Tu=null,n;return(Jo&1)!==0&&n.tag!==0&&Cs(),v=n.pendingLanes,(v&1)!==0?n===Au?ja++:(ja=0,Au=n):ja=0,tr(),null}function Cs(){if(ar!==null){var n=nf(Jo),i=Wn.transition,a=wt;try{if(Wn.transition=null,wt=16>n?16:n,ar===null)var c=!1;else{if(n=ar,ar=null,Jo=0,(_t&6)!==0)throw Error(t(331));var h=_t;for(_t|=4,Oe=n.current;Oe!==null;){var v=Oe,T=v.child;if((Oe.flags&16)!==0){var F=v.deletions;if(F!==null){for(var V=0;V<F.length;V++){var oe=F[V];for(Oe=oe;Oe!==null;){var ye=Oe;switch(ye.tag){case 0:case 11:case 15:ka(8,ye,v)}var Ee=ye.child;if(Ee!==null)Ee.return=ye,Oe=Ee;else for(;Oe!==null;){ye=Oe;var xe=ye.sibling,De=ye.return;if(ep(ye),ye===oe){Oe=null;break}if(xe!==null){xe.return=De,Oe=xe;break}Oe=De}}}var ke=v.alternate;if(ke!==null){var Be=ke.child;if(Be!==null){ke.child=null;do{var zt=Be.sibling;Be.sibling=null,Be=zt}while(Be!==null)}}Oe=v}}if((v.subtreeFlags&2064)!==0&&T!==null)T.return=v,Oe=T;else e:for(;Oe!==null;){if(v=Oe,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:ka(9,v,v.return)}var ee=v.sibling;if(ee!==null){ee.return=v.return,Oe=ee;break e}Oe=v.return}}var $=n.current;for(Oe=$;Oe!==null;){T=Oe;var ie=T.child;if((T.subtreeFlags&2064)!==0&&ie!==null)ie.return=T,Oe=ie;else e:for(T=$;Oe!==null;){if(F=Oe,(F.flags&2048)!==0)try{switch(F.tag){case 0:case 11:case 15:Xo(9,F)}}catch(Ve){Ot(F,F.return,Ve)}if(F===T){Oe=null;break e}var Te=F.sibling;if(Te!==null){Te.return=F.return,Oe=Te;break e}Oe=F.return}}if(_t=h,tr(),ln&&typeof ln.onPostCommitFiberRoot=="function")try{ln.onPostCommitFiberRoot(Qe,n)}catch{}c=!0}return c}finally{wt=a,Wn.transition=i}}return!1}function gp(n,i,a){i=ws(a,i),i=Uh(n,i,1),n=ir(n,i,1),i=_n(),n!==null&&(da(n,1,i),An(n,i))}function Ot(n,i,a){if(n.tag===3)gp(n,n,a);else for(;i!==null;){if(i.tag===3){gp(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(sr===null||!sr.has(c))){n=ws(a,n),n=Ih(i,n,1),i=ir(i,n,1),n=_n(),i!==null&&(da(i,1,n),An(i,n));break}}i=i.return}}function q_(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=_n(),n.pingedLanes|=n.suspendedLanes&a,en===n&&(on&a)===a&&(Xt===4||Xt===3&&(on&130023424)===on&&500>ze()-wu?Or(n,0):Eu|=a),An(n,i)}function vp(n,i){i===0&&((n.mode&1)===0?i=1:(i=Ln,Ln<<=1,(Ln&130023424)===0&&(Ln=4194304)));var a=_n();n=Ci(n,i),n!==null&&(da(n,i,a),An(n,a))}function Y_(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),vp(n,a)}function K_(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(a=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),vp(n,a)}var _p;_p=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Mn.current)wn=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return wn=!1,O_(n,i,a);wn=(n.flags&131072)!==0}else wn=!1,Ut&&(i.flags&1048576)!==0&&Zf(i,No,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Wo(n,i),n=i.pendingProps;var h=gs(i,cn.current);Ms(i,a),h=tu(null,i,c,n,h,a);var v=nu();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,En(c)?(v=!0,bo(i)):v=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,qc(i),h.updater=Vo,i.stateNode=h,h._reactInternals=i,lu(i,c,n,a),i=fu(null,i,c,!0,v,a)):(i.tag=0,Ut&&v&&kc(i),vn(null,i,h,a),i=i.child),i;case 16:c=i.elementType;e:{switch(Wo(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=J_(c),n=ei(c,n),h){case 0:i=du(null,i,c,n,a);break e;case 1:i=Gh(null,i,c,n,a);break e;case 11:i=zh(null,i,c,n,a);break e;case 14:i=Bh(null,i,c,ei(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),du(n,i,c,h,a);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Gh(n,i,c,h,a);case 3:e:{if(Wh(i),n===null)throw Error(t(387));c=i.pendingProps,v=i.memoizedState,h=v.element,ah(n,i),Fo(i,c,null,a);var T=i.memoizedState;if(c=T.element,v.isDehydrated)if(v={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=v,i.memoizedState=v,i.flags&256){h=ws(Error(t(423)),i),i=$h(n,i,c,a,h);break e}else if(c!==h){h=ws(Error(t(424)),i),i=$h(n,i,c,a,h);break e}else for(In=Ji(i.stateNode.containerInfo.firstChild),Un=i,Ut=!0,Qn=null,a=rh(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(xs(),c===h){i=Ni(n,i,a);break e}vn(n,i,c,a)}i=i.child}return i;case 5:return ch(i),n===null&&jc(i),c=i.type,h=i.pendingProps,v=n!==null?n.memoizedProps:null,T=h.children,Lc(c,h)?T=null:v!==null&&Lc(c,v)&&(i.flags|=32),Vh(n,i),vn(n,i,T,a),i.child;case 6:return n===null&&jc(i),null;case 13:return Xh(n,i,a);case 4:return Yc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ys(i,null,c,a):vn(n,i,c,a),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),zh(n,i,c,h,a);case 7:return vn(n,i,i.pendingProps,a),i.child;case 8:return vn(n,i,i.pendingProps.children,a),i.child;case 12:return vn(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,v=i.memoizedProps,T=h.value,Rt(Do,c._currentValue),c._currentValue=T,v!==null)if(Jn(v.value,T)){if(v.children===h.children&&!Mn.current){i=Ni(n,i,a);break e}}else for(v=i.child,v!==null&&(v.return=i);v!==null;){var F=v.dependencies;if(F!==null){T=v.child;for(var V=F.firstContext;V!==null;){if(V.context===c){if(v.tag===1){V=Ri(-1,a&-a),V.tag=2;var oe=v.updateQueue;if(oe!==null){oe=oe.shared;var ye=oe.pending;ye===null?V.next=V:(V.next=ye.next,ye.next=V),oe.pending=V}}v.lanes|=a,V=v.alternate,V!==null&&(V.lanes|=a),$c(v.return,a,i),F.lanes|=a;break}V=V.next}}else if(v.tag===10)T=v.type===i.type?null:v.child;else if(v.tag===18){if(T=v.return,T===null)throw Error(t(341));T.lanes|=a,F=T.alternate,F!==null&&(F.lanes|=a),$c(T,a,i),T=v.sibling}else T=v.child;if(T!==null)T.return=v;else for(T=v;T!==null;){if(T===i){T=null;break}if(v=T.sibling,v!==null){v.return=T.return,T=v;break}T=T.return}v=T}vn(n,i,h.children,a),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Ms(i,a),h=Vn(h),c=c(h),i.flags|=1,vn(n,i,c,a),i.child;case 14:return c=i.type,h=ei(c,i.pendingProps),h=ei(c.type,h),Bh(n,i,c,h,a);case 15:return jh(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ei(c,h),Wo(n,i),i.tag=1,En(c)?(n=!0,bo(i)):n=!1,Ms(i,a),Lh(i,c,h),lu(i,c,h,a),fu(null,i,c,!0,n,a);case 19:return Yh(n,i,a);case 22:return Hh(n,i,a)}throw Error(t(156,i.tag))};function xp(n,i){return je(n,i)}function Z_(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function $n(n,i,a,c){return new Z_(n,i,a,c)}function Lu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function J_(n){if(typeof n=="function")return Lu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===G)return 11;if(n===le)return 14}return 2}function cr(n,i){var a=n.alternate;return a===null?(a=$n(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function nl(n,i,a,c,h,v){var T=2;if(c=n,typeof n=="function")Lu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case O:return zr(a.children,h,v,i);case W:T=8,h|=8;break;case R:return n=$n(12,a,i,h|2),n.elementType=R,n.lanes=v,n;case B:return n=$n(13,a,i,h),n.elementType=B,n.lanes=v,n;case te:return n=$n(19,a,i,h),n.elementType=te,n.lanes=v,n;case ce:return il(a,h,v,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case A:T=10;break e;case D:T=9;break e;case G:T=11;break e;case le:T=14;break e;case X:T=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=$n(T,a,i,h),i.elementType=n,i.type=c,i.lanes=v,i}function zr(n,i,a,c){return n=$n(7,n,c,i),n.lanes=a,n}function il(n,i,a,c){return n=$n(22,n,c,i),n.elementType=ce,n.lanes=a,n.stateNode={isHidden:!1},n}function Du(n,i,a){return n=$n(6,n,null,i),n.lanes=a,n}function Uu(n,i,a){return i=$n(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Q_(n,i,a,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=oc(0),this.expirationTimes=oc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=oc(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Iu(n,i,a,c,h,v,T,F,V){return n=new Q_(n,i,a,F,V),i===1?(i=1,v===!0&&(i|=8)):i=0,v=$n(3,null,null,i),n.current=v,v.stateNode=n,v.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},qc(v),n}function ex(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:I,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function yp(n){if(!n)return er;n=n._reactInternals;e:{if(P(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(En(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(En(a))return qf(n,a,i)}return i}function Sp(n,i,a,c,h,v,T,F,V){return n=Iu(a,c,!0,n,h,v,T,F,V),n.context=yp(null),a=n.current,c=_n(),h=or(a),v=Ri(c,h),v.callback=i??null,ir(a,v,h),n.current.lanes=h,da(n,h,c),An(n,c),n}function rl(n,i,a,c){var h=i.current,v=_n(),T=or(h);return a=yp(a),i.context===null?i.context=a:i.pendingContext=a,i=Ri(v,T),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ir(h,i,T),n!==null&&(ii(n,h,T,v),Io(n,h,T)),T}function sl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Mp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function Fu(n,i){Mp(n,i),(n=n.alternate)&&Mp(n,i)}function tx(){return null}var Ep=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ou(n){this._internalRoot=n}al.prototype.render=Ou.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));rl(n,i,null,null)},al.prototype.unmount=Ou.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Fr(function(){rl(null,n,null,null)}),i[wi]=null}};function al(n){this._internalRoot=n}al.prototype.unstable_scheduleHydration=function(n){if(n){var i=af();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Yi.length&&i!==0&&i<Yi[a].priority;a++);Yi.splice(a,0,n),a===0&&cf(n)}};function ku(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function ol(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function wp(){}function nx(n,i,a,c,h){if(h){if(typeof c=="function"){var v=c;c=function(){var oe=sl(T);v.call(oe)}}var T=Sp(i,c,n,0,null,!1,!1,"",wp);return n._reactRootContainer=T,n[wi]=T.current,Ta(n.nodeType===8?n.parentNode:n),Fr(),T}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var F=c;c=function(){var oe=sl(V);F.call(oe)}}var V=Iu(n,0,!1,null,null,!1,!1,"",wp);return n._reactRootContainer=V,n[wi]=V.current,Ta(n.nodeType===8?n.parentNode:n),Fr(function(){rl(i,V,a,c)}),V}function ll(n,i,a,c,h){var v=a._reactRootContainer;if(v){var T=v;if(typeof h=="function"){var F=h;h=function(){var V=sl(T);F.call(V)}}rl(i,T,n,h)}else T=nx(a,i,n,h,c);return sl(T)}rf=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ei(i.pendingLanes);a!==0&&(lc(i,a|1),An(i,ze()),(_t&6)===0&&(bs=ze()+500,tr()))}break;case 13:Fr(function(){var c=Ci(n,1);if(c!==null){var h=_n();ii(c,n,1,h)}}),Fu(n,1)}},cc=function(n){if(n.tag===13){var i=Ci(n,134217728);if(i!==null){var a=_n();ii(i,n,134217728,a)}Fu(n,134217728)}},sf=function(n){if(n.tag===13){var i=or(n),a=Ci(n,i);if(a!==null){var c=_n();ii(a,n,i,c)}Fu(n,i)}},af=function(){return wt},of=function(n,i){var a=wt;try{return wt=n,i()}finally{wt=a}},q=function(n,i,a){switch(i){case"input":if(ot(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var h=To(c);if(!h)throw Error(t(90));be(c),ot(c,h)}}}break;case"textarea":Me(n,a);break;case"select":i=a.value,i!=null&&de(n,!!a.multiple,i,!1)}},Vt=Ru,St=Fr;var ix={usingClientEntryPoint:!1,Events:[Ca,ps,To,$e,pt,Ru]},Ha={findFiberByHostInstance:Cr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},rx={bundleType:Ha.bundleType,version:Ha.version,rendererPackageName:Ha.rendererPackageName,rendererConfig:Ha.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:U.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=se(n),n===null?null:n.stateNode},findFiberByHostInstance:Ha.findFiberByHostInstance||tx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var cl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!cl.isDisabled&&cl.supportsFiber)try{Qe=cl.inject(rx),ln=cl}catch{}}return bn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ix,bn.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ku(i))throw Error(t(200));return ex(n,i,null,a)},bn.createRoot=function(n,i){if(!ku(n))throw Error(t(299));var a=!1,c="",h=Ep;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Iu(n,1,!1,null,null,a,!1,c,h),n[wi]=i.current,Ta(n.nodeType===8?n.parentNode:n),new Ou(i)},bn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=se(i),n=n===null?null:n.stateNode,n},bn.flushSync=function(n){return Fr(n)},bn.hydrate=function(n,i,a){if(!ol(i))throw Error(t(200));return ll(null,n,i,!0,a)},bn.hydrateRoot=function(n,i,a){if(!ku(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,h=!1,v="",T=Ep;if(a!=null&&(a.unstable_strictMode===!0&&(h=!0),a.identifierPrefix!==void 0&&(v=a.identifierPrefix),a.onRecoverableError!==void 0&&(T=a.onRecoverableError)),i=Sp(i,null,n,1,a??null,h,!1,v,T),n[wi]=i.current,Ta(n),c)for(n=0;n<c.length;n++)a=c[n],h=a._getVersion,h=h(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,h]:i.mutableSourceEagerHydrationData.push(a,h);return new al(i)},bn.render=function(n,i,a){if(!ol(i))throw Error(t(200));return ll(null,n,i,!1,a)},bn.unmountComponentAtNode=function(n){if(!ol(n))throw Error(t(40));return n._reactRootContainer?(Fr(function(){ll(null,null,n,!1,function(){n._reactRootContainer=null,n[wi]=null})}),!0):!1},bn.unstable_batchedUpdates=Ru,bn.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!ol(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ll(n,i,a,!1,c)},bn.version="18.3.1-next-f1338f8080-20240426",bn}var Lp;function gx(){if(Lp)return ju.exports;Lp=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),ju.exports=mx(),ju.exports}var Dp;function vx(){if(Dp)return ul;Dp=1;var r=gx();return ul.createRoot=r.createRoot,ul.hydrateRoot=r.hydrateRoot,ul}var _x=vx();const Yl="/api/3dprint";class xx extends Error{constructor(t,s,o){super(t);Va(this,"status");Va(this,"code");Va(this,"date");Va(this,"reservations");this.status=s,this.code=o==null?void 0:o.code,this.date=o==null?void 0:o.date,this.reservations=o==null?void 0:o.reservations}}async function yt(r,e){const t=await fetch(`${Yl}/${r}`,{credentials:"include",...e,headers:{"Content-Type":"application/json",...e==null?void 0:e.headers}}),s=await t.json().catch(()=>({}));if(!t.ok)throw new xx(s.error||`HTTP ${t.status}`,t.status,s);return s}async function yx(){const r=await fetch("/api/apps/3dprint-management/access",{credentials:"include"});return r.status===401?"login":r.status===403?"denied":r.ok?"ok":"denied"}function Ag(r){return{id:r.id,date:r.date,machine:r.machine,kind:r.kind,start:r.start,end:r.end,title:r.title,file:r.file,fileSize:r.file_size,note:r.note,who:r.who,status:r.status,createdAt:r.created_at,adminNote:r.status_comment??void 0,printer_id:r.printer_id}}async function Sx(r,e){return{applications:(await yt(`admin/calendar/cancelled-applications?from=${r}&to=${e}`)).applications.map(s=>Ag(s))}}async function Mx(r){return yt(`admin/reservations/${r}/restore`,{method:"POST",body:"{}"})}async function Ex(r,e){const t=await yt(`calendar/applications?from=${r}&to=${e}`);return{applications:t.applications.map(s=>Ag(s)),staff_dates:t.staff_dates??{}}}async function wx(){return(await yt("admin/members")).members.map(e=>({id:e.id,name:e.name,homeroom:e.homeroom,student_number:e.student_number,color_index:e.color_index,discord_user_id:e.discord_user_id,user_id:e.user_id??null}))}async function Up(){return yt("admin/session")}async function Tx(){return(await yt("admin/management-users")).users}async function Ip(r,e){return yt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({user_id:e})})}async function Ax(r){return yt("admin/members",{method:"POST",body:JSON.stringify(r)})}async function bx(r){return yt(`admin/members/${r}`,{method:"DELETE"})}function dl(r){return`${r.member_id}\0${r.date}`}function fl(r){return`${r.printer_id}\0${r.date}`}function Fp(r){const e=new Map;for(const t of r){const s=e.get(t.member_id)??[];s.push(t.date),e.set(t.member_id,s)}return e}function Op(r){const e=new Map;for(const t of r){const s=e.get(t.printer_id)??[];s.push(t.date),e.set(t.printer_id,s)}return e}function bg(r,e){const t=new Set(r.map(dl)),s=new Set(e.map(dl)),o=e.filter(f=>!t.has(dl(f))),l=r.filter(f=>!s.has(dl(f)));return{added:o,removed:l}}function Cg(r,e){const t=new Set(r.map(fl)),s=new Set(e.map(fl)),o=e.filter(f=>!t.has(fl(f))),l=r.filter(f=>!s.has(fl(f)));return{added:o,removed:l}}function Cx(r,e,t,s){const o=bg(r,e),l=Cg(t,s);return o.added.length+o.removed.length+l.added.length+l.removed.length>0}async function Rx(r,e,t,s){const o=bg(r,e),l=Cg(t,s);for(const[f,d]of Fp(o.removed))await zp(f,d,!1);for(const[f,d]of Op(l.removed))await Bp(f,d,!1);for(const[f,d]of Fp(o.added))await zp(f,d,!0);for(const[f,d]of Op(l.added))await Bp(f,d,!0)}async function kp(r,e){return yt(`admin/shifts?year=${r}&month=${e}`)}async function zp(r,e,t){return yt("admin/shifts/availability",{method:"PUT",body:JSON.stringify({member_id:r,dates:e,available:t})})}async function Nx(r,e){return yt(`admin/reservations/${r}/accept`,{method:"POST",body:JSON.stringify({print_staff_member_id:e})})}async function Td(r,e){return yt(`admin/reservations/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Px(){return yt("admin/calendar/status")}function Lx(r){return`${Yl}/admin/stl/${r}`}async function Dx(){return(await yt("admin/reservations")).reservations}async function Ux(){return yt("admin/printers")}async function zd(r,e,t="POST"){const s=await fetch(`${Yl}/${r}`,{method:t,credentials:"include",body:e}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error||`HTTP ${s.status}`);return o}async function Ix(r,e){const t=new FormData;return t.append("name",r),e&&t.append("image",e),zd("admin/printers",t)}async function Fx(r,e){return yt(`admin/printers/${r}`,{method:"PATCH",body:JSON.stringify(e)})}async function Ox(r,e){const t=new FormData;return t.append("image",e),zd(`admin/printers/${r}/image`,t,"PUT")}async function kx(r){return yt(`admin/printers/${r}`,{method:"DELETE"})}async function Bp(r,e,t){return yt("admin/shifts/printer-availability",{method:"PUT",body:JSON.stringify({printer_id:r,dates:e,available:t})})}async function zx(r,e,t=!1){return yt(`admin/reservations/${r}/reschedule`,{method:"PATCH",body:JSON.stringify({desired_date:e,force:t})})}async function Bx(r,e){return yt(`admin/applications/${r}/split-slots`,{method:"POST",body:JSON.stringify(e)})}async function jx(){return yt("admin/integrations/status")}async function Hx(){return yt("admin/integrations/discord/test",{method:"POST",body:"{}"})}async function Vx(r){const e=r.map(t=>t.trim()).filter(Boolean);if(!e.length)throw new Error("メンションする担当者を1人以上選んでください");return yt("admin/integrations/discord/test-mention",{method:"POST",body:JSON.stringify({member_ids:e})})}async function Gx(r){const e=r.trim();if(!e)throw new Error("送信先メールアドレスを入力してください");return yt("admin/settings/test-email",{method:"POST",body:JSON.stringify({to:e})})}async function Wx(r){return yt("admin/log",{method:"POST",body:JSON.stringify(r)})}async function $x(r=100){return yt(`admin/log?limit=${r}`)}async function Xx(r){return yt(`admin/settings/storage-list?path=${encodeURIComponent(r)}`)}async function jp(r,e){return yt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({color_index:e})})}async function qx(r,e){return yt(`admin/members/${r}`,{method:"PATCH",body:JSON.stringify({discord_user_id:e})})}async function Yx(){return yt("admin/settings/print-video")}async function Kx(r){return yt("admin/settings/print-video",{method:"PATCH",body:JSON.stringify({storage_path:r})})}async function Zx(r,e){const t=new FormData;return t.append("video",e),zd(`admin/reservations/${r}/print-video`,t)}async function Jx(r){return yt(`admin/reservations/${r}/print-video`,{method:"DELETE"})}function Qx(r){return`${Yl}/admin/reservations/${r}/print-video/download`}function Rg({testId:r,variant:e="page"}){const t=e==="inline"?"print3d-loading print3d-loading--inline":"print3d-loading";return u.jsx("div",{className:t,"data-testid":r,role:"status","aria-live":"polite","aria-label":"読み込み中",children:u.jsx("div",{className:"print3d-loading-spinner","aria-hidden":!0})})}const Ng=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC"}],Qa=Ng.map(r=>r.id),yi={};Ng.forEach(r=>{yi[r.id]=r});const wr=["日","月","火","水","木","金","土"],Bd=360,Qs=30,Hp=28,Pg=990,e0=1200,Vp=(Pg-Bd)/Qs,t0=7,ea={pending:"申請中",approved:"承認済",done:"完了",cancelled:"取り消し"},li={request:"依頼",reserve:"予約"},Gp=[{id:"machine",label:"機材の不調",body:"プリンターの不調により、この時間帯の印刷を中止しました。"},{id:"maintenance",label:"メンテナンス",body:"メンテナンスのため、この時間帯の受付を停止しました。"},{id:"duplicate",label:"重複申請",body:"同じ時間帯に別の申請が確定しているため、こちらを取り消しました。"},{id:"no_show",label:"連絡なしの未実施",body:"開始時刻を過ぎても実施が確認できなかったため取り消しました。"}],Wp=[{id:"stl",label:"STLの不備",body:"STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。"},{id:"size",label:"サイズ超過",body:"造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。"},{id:"deadline",label:"締切超過",body:"印刷依頼の受付は前日までです。当日の依頼は受け付けられません。"},{id:"time",label:"時間不足",body:"この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。"}],n0=["16:20までに物理実験室へ来てください。","フィラメントは白PLAを使用します。","サポート材を付けています。剥がす作業もお願いします。"],yn=r=>String(r).padStart(2,"0"),Yn=r=>r.getFullYear()+"-"+yn(r.getMonth()+1)+"-"+yn(r.getDate()),zn=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},kl=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},zl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},Lg=r=>kl(zl(r),-r.getDay()),$p=r=>r.getMonth()+1+"/"+r.getDate(),ci=Yn(zl(new Date)),i0=()=>zn(ci),Ad=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()},jd=r=>{const e=zn(r);return e.getMonth()+1+"/"+e.getDate()+"（"+wr[e.getDay()]+"）"},eo=r=>Bd+r*Qs,qt=r=>yn(Math.floor(r/60))+":"+yn(r%60),Kl=r=>{const e=Math.floor(r/60),t=r%60;return e&&t?e+"時間"+t+"分":e?e+"時間":t+"分"},Xp=r=>Math.round((r-Bd)/Qs),mn=r=>r.kind==="request"?{start:Pg,end:e0,s:Vp,e:Vp+t0}:{start:r.start,end:r.end,s:Xp(r.start),e:Xp(r.end)},qp=(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+"0"+t);return r})(),ji=r=>r?String(r).slice(0,1)+"年"+String(r).slice(1)+"HR":"—",Kr=["#f38020","#3b74e0","#1f9d55","#9a4a07","#7c5cbf","#b4776b","#2f8f8f"],Dg=[{id:"m1",name:"金田",hr:"203",num:12,discord:"",color:"#f38020"},{id:"m2",name:"田村",hr:"201",num:3,discord:"",color:"#3b74e0"},{id:"m3",name:"藤原",hr:"104",num:21,discord:"",color:"#1f9d55"}];let Zl=Dg.slice();const r0=r=>{Zl=(r&&r.length?r:Dg).slice()},s0=()=>Zl,Qr=r=>Zl.find(e=>e.id===r)||null,Hd=r=>{const e=Qr(r);return e?e.name:null},a0=r=>{const e=Qr(r);return e?e.color:"var(--color-text-faint)"},Ug=r=>{const e=Qr(r);return e?`${e.name}（${ji(e.hr)}・${e.num}番）`:"—"};let Ig={};const hl=r=>{Ig=r||{}},$s=(r,e)=>(Ig[r]||[]).indexOf(e)>=0,no=r=>Zl.filter(e=>$s(e.id,r)).map(e=>e.id),Fg=r=>no(r).map(e=>Hd(e)),o0=r=>r.filter(e=>e.status==="pending").sort((e,t)=>(e.date+yn(Math.floor(mn(e).start/60))).localeCompare(t.date+yn(Math.floor(mn(t).start/60)))),l0=r=>r.kind==="request"&&r.date<=ci,c0=r=>r==="pending"||r==="approved";function u0(r,e){const t=r.filter(o=>o.date===e),s={};return Qa.forEach(o=>{const l=new Array(Hp).fill(null);t.filter(f=>f.machine===o&&c0(f.status)).forEach(f=>{const d=mn(f);for(let m=Math.max(0,d.s);m<Math.min(Hp,d.e);m++)l[m]=f}),s[o]=l}),{list:t,machines:s}}function Og(r,e){const t=r.filter(o=>o.date===e),s=t.filter(o=>o.status!=="cancelled");return{all:t,live:s,requests:s.filter(o=>o.kind==="request"),reserves:s.filter(o=>o.kind==="reserve"),pending:s.filter(o=>o.status==="pending").length,cancelled:t.filter(o=>o.status==="cancelled")}}function kg(r,e,t,s){const o=mn(e),l=u0(r,t),f=l.machines[e.machine];let d=0;for(let g=o.s;g<o.e;g++){const _=f[g];_&&_.id!==e.id&&d++}const m=o.e-o.s,p=no(t);return{date:t,total:m,used:d,free:m-d,full:d>=m,staffs:p,noStaff:p.length===0,past:t<ci,sameDay:t===e.date,liveCount:l.list.filter(g=>g.status!=="cancelled").length}}function d0(r,e){const s=new Date(r,e-1,1).getDay(),o=new Date(r,e,0).getDate(),l=[];for(let f=0;f<s;f++)l.push(null);for(let f=1;f<=o;f++)l.push(new Date(r,e-1,f));for(;l.length%7!==0;)l.push(null);return l}function Vd(r){const e=mn(r),t=[];for(let s=e.s;s<e.e;s++)t.push(s);return t}function Gd(r,e){try{const t=localStorage.getItem(r);return t?JSON.parse(t):e}catch{return e}}function Wd(r,e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}const sa={prefs:"sh3dm.prefs.v1",log:"sh3dm.log.v1",integ:"sh3dm.integrations.v1"},zg=()=>Gd(sa.prefs,{}),f0=r=>Wd(sa.prefs,Object.assign(zg(),r)),h0=()=>Gd(sa.log,[]),p0=r=>Wd(sa.log,r),pl={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,cancelled:!0},dailyMention:!0},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}},m0=()=>{const r=Gd(sa.integ,null);return r?{discord:{...pl.discord,...r.discord||{},events:{...pl.discord.events,...(r.discord||{}).events||{}}},gcal:{...pl.gcal,...r.gcal||{}}}:JSON.parse(JSON.stringify(pl))},g0=r=>Wd(sa.integ,r),Bl=[{id:"ke",name:"Ender-3 V3 KE",maker:"Creality",short:"KE",hint:"小物・精度重視"},{id:"cc",name:"Centauri Carbon",maker:"ELEGOO",short:"CC",hint:"大型・タイムラプス"}];Bl.map(r=>r.id);const v0=Object.fromEntries(Bl.map(r=>[r.id,r])),Bg=["日","月","火","水","木","金","土"],$d=360,Xd=30,jg=990,Hg=1200,_0=(jg-$d)/Xd,x0=(Hg-$d)/Xd,y0={pending:"申請中",approved:"確定",rejected:"却下",done:"完了"},S0={request:"依頼",reserve:"予約"},es=r=>String(r).padStart(2,"0"),bd=r=>r.getFullYear()+"-"+es(r.getMonth()+1)+"-"+es(r.getDate()),ts=r=>{const e=r.split("-").map(Number);return new Date(e[0],e[1]-1,e[2])},Vg=(r,e)=>{const t=new Date(r.getTime());return t.setDate(t.getDate()+e),t},jl=r=>{const e=new Date(r);return e.setHours(0,0,0,0),e},M0=r=>Vg(jl(r),-r.getDay()),Yp=r=>es(Math.floor(r/60))+":"+es(r%60),Kp=r=>Math.round((r-$d)/Xd),E0=r=>r.kind==="request"?{start:jg,end:Hg,s:_0,e:x0}:{start:r.start,end:r.end,s:Kp(r.start),e:Kp(r.end)};(()=>{const r=[];for(let e=1;e<=3;e++)for(let t=1;t<=9;t++)r.push(String(e)+es(t));return r})();const w0=bd(jl(new Date)),T0=()=>ts(w0),Gg=r=>{const e=ts(r);return e.getMonth()+1+"/"+e.getDate()},Wa=r=>{const e=ts(r);return Gg(r)+"（"+Bg[e.getDay()]+"）"};function A0(r,e){var t;return e?((t=r.find(s=>s.id===e))==null?void 0:t.name)??null:null}function b0(r,e,t,s,o){const l=r.filter(p=>p.date>=e&&p.date<=t).sort((p,g)=>(p.date+String(p.start)).localeCompare(g.date+String(g.start))),f=["日付","曜日","開始","終了","機種","種別","作品名","申請者","学年HR","番号","状態","印刷データ","サイズ(MB)","備考","担当"],d=p=>{const g=String(p??"");return/[",\n]/.test(g)?'"'+g.replace(/"/g,'""')+'"':g},m=[f.join(",")];return l.forEach(p=>{const g=E0(p),_=ts(p.date),x=o[p.date];m.push([p.date,Bg[_.getDay()],Yp(g.start),Yp(g.end),v0[p.machine].name,S0[p.kind],p.title,p.who.name,p.who.hr,p.who.num,y0[p.status],p.file,p.fileSize?(p.fileSize/1048576).toFixed(2):"",p.note,x&&A0(s,x)||""].map(d).join(","))}),"\uFEFF"+m.join(`\r
`)}const C0={discord:{webhook:"",enabled:!0,events:{pending:!0,approved:!0,rejected:!0},mention:""},gcal:{calendarId:"",enabled:!1,title:"[3Dプリント] {title}",duration:20,syncOn:"approved"}};function R0(r){return r.map(e=>({id:e.id,name:e.name,hr:e.homeroom??"",num:e.student_number??0,discord:e.discord_user_id??"",color:Kr[(e.color_index??0)%Kr.length],userId:e.user_id??null}))}function Zp(r){const e=Kr.indexOf(r);return e>=0?e:0}function N0(r){return r==="rejected"?"cancelled":r}function P0(r){switch(r){case"pending":return"applied";case"approved":return"accepted";case"done":return"delivered";case"cancelled":return"cancelled";default:return"applied"}}function Jp(r){return{...r,status:N0(r.status)}}function L0(r){const e=bd(M0(ts(r))),t=bd(Vg(ts(e),27));return{from:e,to:t}}function Wg(r){const e={};for(const t of r)e[t.member_id]||(e[t.member_id]=[]),e[t.member_id].push(t.date);for(const t of Object.keys(e))e[t].sort();return e}function Xs(r){const e=[];for(const[t,s]of Object.entries(r))for(const o of s)e.push({member_id:t,date:o});return e}function Qp(r,e,t){const s=ts(r);return s.getFullYear()===e&&s.getMonth()+1===t}function D0(r,e){const t=new Date(r,e,0).getDate(),s=[];for(let o=1;o<=t;o++)s.push(`${r}-${String(e).padStart(2,"0")}-${String(o).padStart(2,"0")}`);return s}function U0(r,e,t,s,o){const l=Wg(t),f=new Set([...Object.keys(r),...Object.keys(e),...Object.keys(l)]),d=D0(s,o),m={},p={};for(const g of f){const _=new Set(r[g]||[]),x=new Set(e[g]||[]),M=new Set(l[g]||[]),E=new Set([..._].filter(S=>!Qp(S,s,o))),w=new Set([...x].filter(S=>!Qp(S,s,o)));for(const S of d)x.has(S)!==_.has(S)?(_.has(S)&&E.add(S),x.has(S)&&w.add(S)):M.has(S)&&(E.add(S),w.add(S));m[g]=[...E].sort(),p[g]=[...w].sort()}return{avail:m,saved:p}}function I0(r,e){const t=Xs(r),s=Xs(e),o=new Set(t.map(m=>`${m.member_id}\0${m.date}`)),l=new Set(s.map(m=>`${m.member_id}\0${m.date}`)),f=s.filter(m=>!o.has(`${m.member_id}\0${m.date}`)),d=t.filter(m=>!l.has(`${m.member_id}\0${m.date}`));return{addedSlots:f.length,removedSlots:d.length,addedDates:new Set(f.map(m=>m.date)).size,removedDates:new Set(d.map(m=>m.date)).size}}function F0(r){return r.linked_member?`${r.user.display_name}（印刷担当: ${r.linked_member.name}）`:r.user.display_name}function O0(){return JSON.parse(JSON.stringify(C0))}function k0(r,e,t,s){const o=r.map(l=>({...l,status:l.status==="cancelled"?"rejected":l.status}));return b0(o,e,t,s)}function qd(){const[r,e]=me.useState(null),t=me.useCallback((o,l)=>{o<0?e("prev"):o>0?e("next"):e(null),l()},[]),s=r==="prev"?"cal-period-enter cal-period-enter--prev":r==="next"?"cal-period-enter cal-period-enter--next":"cal-period-enter";return me.useEffect(()=>{if(!r)return;const o=window.setTimeout(()=>e(null),360);return()=>window.clearTimeout(o)},[r]),{run:t,enterClass:s,dir:r}}const $g="/apps/3dprint-management/assets/icon-192.png",z0=r=>r==="ke"?"var(--color-primary)":"var(--color-tip)";function B0({id:r,size:e}){return u.jsx("span",{className:"dot",style:{background:z0(r),width:e||6,height:e||6}})}function Ys({kind:r,size:e}){return u.jsxs("span",{className:"kbadge "+r+(e==="sm"?" sm":""),children:[u.jsx("span",{className:"kmark"}),li[r]]})}function Gu(){return u.jsx("span",{"aria-hidden":"true",className:"dlic",children:"↓"})}function j0(r,e){const t=mn(r);if(e==="file"){const l=r.file||`${r.title}.stl`,f=["ScienceHUB 3Dプリント — 印刷データ","",`ファイル名: ${l}`,`作品名: ${r.title}`,`申請者: ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`機種: ${yi[r.machine].name}`,`種別: ${li[r.kind]}`,`日付: ${r.date}`,`時間: ${qt(t.start)}〜${qt(t.end)}`,`サイズ: ${r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":"—"}`,"","※ このファイルはデザイン確認用のプレースホルダです。本番では署名付きURLから取得します。"].join(`\r
`);Cd(l.replace(/\.[^.]+$/,"")+".txt",f);return}const s=["ScienceHUB 3Dプリント 申請書","=============================",`作品名      : ${r.title}`,`日付        : ${r.date}（${wr[zn(r.date).getDay()]}）`,`時間        : ${qt(t.start)}〜${qt(t.end)}（${Kl(t.end-t.start)}）`,`機種        : ${yi[r.machine].name}（${yi[r.machine].maker}）`,`種別        : ${li[r.kind]}${r.kind==="request"?"（依頼枠を丸ごと占有）":"（データ提出なし）"}`,`状態        : ${ea[r.status]}`,`担当        : ${Fg(r.date).join(" / ")||"休み"}`,`申請者      : ${r.who.name}（${ji(r.who.hr)}・${r.who.num}番）`,`印刷データ  : ${r.file||"—"}${r.fileSize?"（"+(r.fileSize/1048576).toFixed(2)+" MB）":""}`,`備考        : ${r.note||"—"}`,`担当者メモ  : ${r.adminNote||"—"}`,"","出力: ScienceHUB 3Dプリント管理"],o=`${r.date}_${r.title.split(/[\\/:*?"<>|]/).join("_")}.txt`;Cd(o,s.join(`\r
`))}function Cd(r,e){const t=new Blob(["\uFEFF"+e],{type:"text/plain;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a");o.href=s,o.download=r,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function H0(r,e){const t=r.filter(l=>l.date===e).sort((l,f)=>mn(l).start-mn(f).start||Qa.indexOf(l.machine)-Qa.indexOf(f.machine)),s=Fg(e).join(" / ")||"休み",o=[`ScienceHUB 3Dプリント 申請一覧 — ${e}（${wr[zn(e).getDay()]}）`,`担当: ${s}`,`件数: ${t.length}`,"=".repeat(48)];return t.forEach((l,f)=>{const d=mn(l);o.push("",`[${f+1}] ${l.title}`,`  時間   : ${qt(d.start)}〜${qt(d.end)}（${Kl(d.end-d.start)}）`,`  機種   : ${yi[l.machine].name}`,`  種別   : ${li[l.kind]}`,`  状態   : ${ea[l.status]}`,`  申請者 : ${l.who.name}（${ji(l.who.hr)}・${l.who.num}番）`,`  データ : ${l.file||"—"}`,`  備考   : ${l.note||"—"}`)}),Cd(`${e}_申請一覧.txt`,o.join(`\r
`)),t.length}function Rd({status:r}){return u.jsx("span",{className:"tag "+r,children:ea[r]})}function Hl({tone:r,children:e}){return u.jsx("span",{className:"chip"+(r?" "+r:""),children:e})}function Xg({id:r,small:e}){const t=Qr(r);return t?u.jsxs("span",{className:"mtag"+(e?" sm":""),children:[u.jsx("span",{className:"mtag-av",style:{background:t.color},children:t.name.slice(0,1)}),t.name]}):u.jsx("span",{className:"mtag none",children:"休み"})}function V0(r){if(!r)return"—";const e=new Date(r),t=zl(i0()),s=Math.round((t-zl(e))/864e5),o=yn(e.getHours())+":"+yn(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}const G0=r=>{const e=new Date(r);return yn(e.getHours())+":"+yn(e.getMinutes())};function W0({screen:r,setScreen:e,operatorSession:t,pendingCount:s,onCsv:o}){return u.jsx("header",{className:"site-header",children:u.jsxs("div",{className:"header-inner",children:[u.jsxs("a",{className:"brand",href:"/",children:[u.jsx("img",{src:$g,alt:""}),"ScienceHUB",u.jsx("span",{className:"sep"}),u.jsx("span",{className:"crumb",children:"3Dプリント管理"})]}),u.jsx("span",{className:"adm-pill",children:"管理者"}),u.jsxs("nav",{className:"screens","aria-label":"画面",children:[u.jsxs("button",{type:"button","aria-current":r==="reserve"?"page":void 0,className:r==="reserve"?"on":"",onClick:()=>e("reserve"),children:["申請の管理",s>0&&u.jsx("span",{className:"nav-count num",children:s})]}),u.jsx("button",{type:"button","aria-current":r==="settings"?"page":void 0,className:r==="settings"?"on":"",onClick:()=>e("settings"),children:"シフト・設定"}),u.jsx("button",{type:"button","aria-current":r==="ops"?"page":void 0,className:r==="ops"?"on":"",onClick:()=>e("ops"),children:"運用"})]}),u.jsxs("div",{className:"hdr-right",children:[u.jsxs("div",{className:"actor actor-readonly",title:(t==null?void 0:t.user.username)??"",children:[u.jsx("span",{children:"ログイン"}),u.jsx("strong",{children:(t==null?void 0:t.user.display_name)??"—"}),t!=null&&t.linked_member?u.jsxs("span",{className:"actor-staff",children:["／印刷担当 ",t.linked_member.name]}):u.jsx("span",{className:"actor-staff actor-staff-warn",children:"／印刷担当未紐づけ"})]}),r==="reserve"&&u.jsx("button",{type:"button",className:"hdr-link",onClick:o,children:"CSV出力"}),u.jsx("a",{className:"hdr-link",href:"/apps/3dprint-reservation/",children:"申請フォーム"})]})]})})}function $0(r,e){const t=Og(r,e);return{req:t.requests.length,res:t.reserves.length,pending:t.pending}}function X0({d:r,ds:e,apps:t,staffIds:s,selected:o,onPick:l,dense:f}){const d=r.getDay(),m=$0(t,e),p=["day"];return d===0&&p.push("sun"),d===6&&p.push("sat"),e===ci&&p.push("today"),e===o&&p.push("sel"),s.length||p.push("closed"),u.jsxs("button",{type:"button",className:p.join(" "),onClick:()=>l(e),"aria-pressed":e===o,"aria-label":`${r.getMonth()+1}月${r.getDate()}日 依頼${m.req}件 予約${m.res}件 ${s.length?"担当あり":"担当なし"}`,children:[u.jsxs("span",{className:"d-top",children:[u.jsx("span",{className:"d num",children:r.getDate()}),u.jsx("span",{className:"d-staffflag"+(s.length?" on":""),children:s.length?"担当あり":"休み"})]}),u.jsxs("span",{className:"c-kinds",children:[u.jsxs("span",{className:"c-k req"+(m.req?"":" zero"),children:[u.jsx("i",{}),"依頼",u.jsx("b",{className:"num",children:m.req})]}),u.jsxs("span",{className:"c-k res"+(m.res?"":" zero"),children:[u.jsx("i",{}),"予約",u.jsx("b",{className:"num",children:m.res})]})]}),u.jsx("span",{className:"c-pend",children:m.pending>0?u.jsxs("span",{className:"pend num",children:["申請中 ",m.pending]}):null})]})}function q0({apps:r,avail:e,selected:t,onPick:s}){const{run:o,enterClass:l}=qd(),f=Lg(zn(t)),d=Yn(f),m=[];for(let w=0;w<4;w++){const S=[];for(let y=0;y<7;y++)S.push(kl(f,w*7+y));m.push(S)}const p=m.flat(),g=p[p.length-1],x=p[0].getMonth()===g.getMonth()?`${p[0].getFullYear()}年 ${yn(p[0].getMonth()+1)}月`:`${yn(p[0].getMonth()+1)}月 → ${yn(g.getMonth()+1)}月`,M=p.map(Yn);r.filter(w=>M.indexOf(w.date)>=0&&w.status!=="cancelled");const E=w=>o(w,()=>s(Yn(kl(zn(t),w*28))));return u.jsxs("div",{className:"card cal-card",children:[u.jsxs("div",{className:"cal-head",children:[u.jsx("div",{className:l,children:u.jsx("div",{className:"cal-month",children:u.jsx("span",{children:x})})},`label-${d}`),u.jsx("div",{className:"cal-nav",children:u.jsx("button",{type:"button",className:"cal-today",onClick:()=>s(ci),children:"今日"})})]}),u.jsxs("div",{className:"cal-body",children:[u.jsxs("button",{type:"button",className:"cal-side prev",onClick:()=>E(-1),"aria-label":"前の4週間",children:[u.jsx("span",{"aria-hidden":"true",children:"‹"}),u.jsx("span",{className:"cal-side-lbl",children:"前へ"})]}),u.jsx("div",{className:"cal-main",children:u.jsx("div",{className:"cal-period-shell",children:u.jsxs("div",{className:l,children:[u.jsx("div",{className:"cal-wds",children:wr.map((w,S)=>u.jsx("div",{className:"cal-wd"+(S===0?" sun":S===6?" sat":""),children:w},w))}),u.jsx("div",{className:"cal-grid",children:m.map(w=>w.map(S=>{const y=Yn(S);return u.jsx(X0,{d:S,ds:y,apps:r,staffIds:no(y),selected:y===t,onPick:s},y)}))})]},d)})}),u.jsxs("button",{type:"button",className:"cal-side next",onClick:()=>E(1),"aria-label":"次の4週間",children:[u.jsx("span",{"aria-hidden":"true",children:"›"}),u.jsx("span",{className:"cal-side-lbl",children:"次へ"})]})]}),u.jsxs("div",{className:"cal-legend",children:[u.jsx("span",{className:"lg",children:u.jsx(Ys,{kind:"request",size:"sm"})}),u.jsx("span",{className:"lg",children:"STLを提出して印刷枠を使う"}),u.jsx("span",{className:"lg",children:u.jsx(Ys,{kind:"reserve",size:"sm"})}),u.jsx("span",{className:"lg",children:"プリンターの時間だけ確保"}),u.jsx("span",{className:"lg lg-right",children:"日付をクリックすると、その日の申請が右に出ます"})]})]})}function Y0({open:r,title:e,sub:t,onClose:s,children:o,footer:l}){return me.useEffect(()=>{if(!r)return;const f=d=>{d.key==="Escape"&&s()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[r,s]),u.jsxs(u.Fragment,{children:[u.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),u.jsxs("aside",{className:"sheet"+(r?" on":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[u.jsxs("div",{className:"sheet-h",children:[u.jsxs("div",{style:{minWidth:0},children:[u.jsx("h2",{children:e}),t&&u.jsx("p",{children:t})]}),u.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),u.jsx("div",{className:"sheet-b",children:r?o:null}),l&&u.jsx("div",{className:"sheet-f",children:l})]})]})}function qg({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:f}){return me.useEffect(()=>{if(!r)return;const d=m=>{m.key==="Escape"&&s()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[r,s]),r?u.jsxs("div",{className:"modal-wrap",role:"dialog","aria-modal":"true","aria-label":e,children:[u.jsx("div",{className:"modal-scrim",onClick:s}),u.jsxs("div",{className:"modal"+(f?" wide":""),children:[u.jsxs("div",{className:"modal-h",children:[u.jsxs("div",{children:[u.jsx("h2",{children:e}),t&&u.jsx("p",{children:t})]}),u.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),u.jsx("div",{className:"modal-b",children:o}),l&&u.jsx("div",{className:"modal-f",children:l})]})]}):null}function K0({toast:r}){return u.jsx("div",{className:"toast"+(r?" show":""),role:"status","aria-live":"polite",children:r&&u.jsxs(u.Fragment,{children:[r.text,r.mark&&u.jsx("b",{children:r.mark})]})})}function Z0(r){if(!r)return"—";const e=new Date(r),t=jl(T0()),s=Math.round((t-jl(e))/864e5),o=es(e.getHours())+":"+es(e.getMinutes());return s<=0?"今日 "+o:s===1?"昨日 "+o:s<7?s+"日前":e.getMonth()+1+"/"+e.getDate()}function J0({open:r,title:e,sub:t,onClose:s,children:o,footer:l,wide:f,tabs:d}){return me.useEffect(()=>{if(!r)return;const m=p=>{p.key==="Escape"&&s()};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[r,s]),u.jsxs(u.Fragment,{children:[u.jsx("div",{className:"scrim"+(r?" on":""),onClick:s,"aria-hidden":"true"}),u.jsxs("aside",{className:"sheet"+(r?" on":"")+(f?" wide":""),role:"dialog","aria-modal":"true","aria-label":e,"aria-hidden":!r,children:[u.jsxs("div",{className:"sheet-h",children:[u.jsxs("div",{style:{minWidth:0},children:[u.jsx("h2",{children:e}),t&&u.jsx("p",{children:t})]}),u.jsx("button",{type:"button",className:"x",onClick:s,"aria-label":"閉じる",children:"×"})]}),d,u.jsx("div",{className:"sheet-b",children:r?o:null}),l&&u.jsx("div",{className:"sheet-f",children:l})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yd="164",Q0=0,em=1,ey=2,Yg=1,ty=2,ki=3,Sr=0,Nn=1,gi=2,xr=0,Ks=1,tm=2,nm=3,im=4,ny=5,qr=100,iy=101,ry=102,sy=103,ay=104,oy=200,ly=201,cy=202,uy=203,Nd=204,Pd=205,dy=206,fy=207,hy=208,py=209,my=210,gy=211,vy=212,_y=213,xy=214,yy=0,Sy=1,My=2,Vl=3,Ey=4,wy=5,Ty=6,Ay=7,Kg=0,by=1,Cy=2,yr=0,Ry=1,Ny=2,Py=3,Ly=4,Dy=5,Uy=6,Iy=7,Zg=300,ta=301,na=302,Ld=303,Dd=304,Jl=306,Ud=1e3,Zr=1001,Id=1002,Kn=1003,Fy=1004,ml=1005,oi=1006,Wu=1007,Jr=1008,Mr=1009,Oy=1010,ky=1011,Jg=1012,Qg=1013,ia=1014,_r=1015,Ql=1016,ev=1017,tv=1018,io=1020,zy=35902,By=1021,jy=1022,_i=1023,Hy=1024,Vy=1025,Zs=1026,to=1027,Gy=1028,nv=1029,Wy=1030,iv=1031,rv=1033,$u=33776,Xu=33777,qu=33778,Yu=33779,rm=35840,sm=35841,am=35842,om=35843,lm=36196,cm=37492,um=37496,dm=37808,fm=37809,hm=37810,pm=37811,mm=37812,gm=37813,vm=37814,_m=37815,xm=37816,ym=37817,Sm=37818,Mm=37819,Em=37820,wm=37821,Ku=36492,Tm=36494,Am=36495,$y=36283,bm=36284,Cm=36285,Rm=36286,Xy=3200,qy=3201,sv=0,Yy=1,vr="",pi="srgb",Tr="srgb-linear",Kd="display-p3",ec="display-p3-linear",Gl="linear",Lt="srgb",Wl="rec709",$l="p3",Rs=7680,Nm=519,Ky=512,Zy=513,Jy=514,av=515,Qy=516,eS=517,tS=518,nS=519,Pm=35044,Lm="300 es",zi=2e3,Xl=2001;class aa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(t)===-1&&s[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const o=s.slice(0);for(let l=0,f=o.length;l<f;l++)o[l].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zu=Math.PI/180,Fd=180/Math.PI;function ro(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(hn[r&255]+hn[r>>8&255]+hn[r>>16&255]+hn[r>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[s&255]+hn[s>>8&255]+hn[s>>16&255]+hn[s>>24&255]).toLowerCase()}function Rn(r,e,t){return Math.max(e,Math.min(t,r))}function iS(r,e){return(r%e+e)%e}function Ju(r,e,t){return(1-t)*r+t*e}function $a(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Cn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class xt{constructor(e=0,t=0){xt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,s=this.y,o=e.elements;return this.x=o[0]*t+o[3]*s+o[6],this.y=o[1]*t+o[4]*s+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(Rn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y;return t*t+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const s=Math.cos(t),o=Math.sin(t),l=this.x-e.x,f=this.y-e.y;return this.x=l*s-f*o+e.x,this.y=l*o+f*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ft{constructor(e,t,s,o,l,f,d,m,p){ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,f,d,m,p)}set(e,t,s,o,l,f,d,m,p){const g=this.elements;return g[0]=e,g[1]=o,g[2]=d,g[3]=t,g[4]=l,g[5]=m,g[6]=s,g[7]=f,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],this}extractBasis(e,t,s){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,f=s[0],d=s[3],m=s[6],p=s[1],g=s[4],_=s[7],x=s[2],M=s[5],E=s[8],w=o[0],S=o[3],y=o[6],L=o[1],N=o[4],U=o[7],Y=o[2],I=o[5],O=o[8];return l[0]=f*w+d*L+m*Y,l[3]=f*S+d*N+m*I,l[6]=f*y+d*U+m*O,l[1]=p*w+g*L+_*Y,l[4]=p*S+g*N+_*I,l[7]=p*y+g*U+_*O,l[2]=x*w+M*L+E*Y,l[5]=x*S+M*N+E*I,l[8]=x*y+M*U+E*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],f=e[4],d=e[5],m=e[6],p=e[7],g=e[8];return t*f*g-t*d*p-s*l*g+s*d*m+o*l*p-o*f*m}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],f=e[4],d=e[5],m=e[6],p=e[7],g=e[8],_=g*f-d*p,x=d*m-g*l,M=p*l-f*m,E=t*_+s*x+o*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/E;return e[0]=_*w,e[1]=(o*p-g*s)*w,e[2]=(d*s-o*f)*w,e[3]=x*w,e[4]=(g*t-o*m)*w,e[5]=(o*l-d*t)*w,e[6]=M*w,e[7]=(s*m-p*t)*w,e[8]=(f*t-s*l)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,s,o,l,f,d){const m=Math.cos(l),p=Math.sin(l);return this.set(s*m,s*p,-s*(m*f+p*d)+f+e,-o*p,o*m,-o*(-p*f+m*d)+d+t,0,0,1),this}scale(e,t){return this.premultiply(Qu.makeScale(e,t)),this}rotate(e){return this.premultiply(Qu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,s,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<9;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<9;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qu=new ft;function ov(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function ql(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function rS(){const r=ql("canvas");return r.style.display="block",r}const Dm={};function sS(r){r in Dm||(Dm[r]=!0,console.warn(r))}const Um=new ft().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Im=new ft().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gl={[Tr]:{transfer:Gl,primaries:Wl,toReference:r=>r,fromReference:r=>r},[pi]:{transfer:Lt,primaries:Wl,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[ec]:{transfer:Gl,primaries:$l,toReference:r=>r.applyMatrix3(Im),fromReference:r=>r.applyMatrix3(Um)},[Kd]:{transfer:Lt,primaries:$l,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Im),fromReference:r=>r.applyMatrix3(Um).convertLinearToSRGB()}},aS=new Set([Tr,ec]),At={enabled:!0,_workingColorSpace:Tr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!aS.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const s=gl[e].toReference,o=gl[t].fromReference;return o(s(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return gl[r].primaries},getTransfer:function(r){return r===vr?Gl:gl[r].transfer}};function Js(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ed(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ns;class oS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ns===void 0&&(Ns=ql("canvas")),Ns.width=e.width,Ns.height=e.height;const s=Ns.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),t=Ns}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ql("canvas");t.width=e.width,t.height=e.height;const s=t.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const o=s.getImageData(0,0,e.width,e.height),l=o.data;for(let f=0;f<l.length;f++)l[f]=Js(l[f]/255)*255;return s.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let s=0;s<t.length;s++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[s]=Math.floor(Js(t[s]/255)*255):t[s]=Js(t[s]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let lS=0;class lv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lS++}),this.uuid=ro(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let f=0,d=o.length;f<d;f++)o[f].isDataTexture?l.push(td(o[f].image)):l.push(td(o[f]))}else l=td(o);s.url=l}return t||(e.images[this.uuid]=s),s}}function td(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?oS.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let cS=0;class Pn extends aa{constructor(e=Pn.DEFAULT_IMAGE,t=Pn.DEFAULT_MAPPING,s=Zr,o=Zr,l=oi,f=Jr,d=_i,m=Mr,p=Pn.DEFAULT_ANISOTROPY,g=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cS++}),this.uuid=ro(),this.name="",this.source=new lv(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=s,this.wrapT=o,this.magFilter=l,this.minFilter=f,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),t||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ud:e.x=e.x-Math.floor(e.x);break;case Zr:e.x=e.x<0?0:1;break;case Id:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ud:e.y=e.y-Math.floor(e.y);break;case Zr:e.y=e.y<0?0:1;break;case Id:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=Zg;Pn.DEFAULT_ANISOTROPY=1;class rn{constructor(e=0,t=0,s=0,o=1){rn.prototype.isVector4=!0,this.x=e,this.y=t,this.z=s,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,s,o){return this.x=e,this.y=t,this.z=s,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=this.w,f=e.elements;return this.x=f[0]*t+f[4]*s+f[8]*o+f[12]*l,this.y=f[1]*t+f[5]*s+f[9]*o+f[13]*l,this.z=f[2]*t+f[6]*s+f[10]*o+f[14]*l,this.w=f[3]*t+f[7]*s+f[11]*o+f[15]*l,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,s,o,l;const m=e.elements,p=m[0],g=m[4],_=m[8],x=m[1],M=m[5],E=m[9],w=m[2],S=m[6],y=m[10];if(Math.abs(g-x)<.01&&Math.abs(_-w)<.01&&Math.abs(E-S)<.01){if(Math.abs(g+x)<.1&&Math.abs(_+w)<.1&&Math.abs(E+S)<.1&&Math.abs(p+M+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const N=(p+1)/2,U=(M+1)/2,Y=(y+1)/2,I=(g+x)/4,O=(_+w)/4,W=(E+S)/4;return N>U&&N>Y?N<.01?(s=0,o=.707106781,l=.707106781):(s=Math.sqrt(N),o=I/s,l=O/s):U>Y?U<.01?(s=.707106781,o=0,l=.707106781):(o=Math.sqrt(U),s=I/o,l=W/o):Y<.01?(s=.707106781,o=.707106781,l=0):(l=Math.sqrt(Y),s=O/l,o=W/l),this.set(s,o,l,t),this}let L=Math.sqrt((S-E)*(S-E)+(_-w)*(_-w)+(x-g)*(x-g));return Math.abs(L)<.001&&(L=1),this.x=(S-E)/L,this.y=(_-w)/L,this.z=(x-g)/L,this.w=Math.acos((p+M+y-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this.w=e.w+(t.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class uS extends aa{constructor(e=1,t=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rn(0,0,e,t),this.scissorTest=!1,this.viewport=new rn(0,0,e,t);const o={width:e,height:t,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const l=new Pn(o,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);l.flipY=!1,l.generateMipmaps=s.generateMipmaps,l.internalFormat=s.internalFormat,this.textures=[];const f=s.count;for(let d=0;d<f;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,s=1){if(this.width!==e||this.height!==t||this.depth!==s){this.width=e,this.height=t,this.depth=s;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=s;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,o=e.textures.length;s<o;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new lv(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends uS{constructor(e=1,t=1,s={}){super(e,t,s),this.isWebGLRenderTarget=!0}}class cv extends Pn{constructor(e=null,t=1,s=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dS extends Pn{constructor(e=null,t=1,s=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:s,depth:o},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class so{constructor(e=0,t=0,s=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=s,this._w=o}static slerpFlat(e,t,s,o,l,f,d){let m=s[o+0],p=s[o+1],g=s[o+2],_=s[o+3];const x=l[f+0],M=l[f+1],E=l[f+2],w=l[f+3];if(d===0){e[t+0]=m,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(d===1){e[t+0]=x,e[t+1]=M,e[t+2]=E,e[t+3]=w;return}if(_!==w||m!==x||p!==M||g!==E){let S=1-d;const y=m*x+p*M+g*E+_*w,L=y>=0?1:-1,N=1-y*y;if(N>Number.EPSILON){const Y=Math.sqrt(N),I=Math.atan2(Y,y*L);S=Math.sin(S*I)/Y,d=Math.sin(d*I)/Y}const U=d*L;if(m=m*S+x*U,p=p*S+M*U,g=g*S+E*U,_=_*S+w*U,S===1-d){const Y=1/Math.sqrt(m*m+p*p+g*g+_*_);m*=Y,p*=Y,g*=Y,_*=Y}}e[t]=m,e[t+1]=p,e[t+2]=g,e[t+3]=_}static multiplyQuaternionsFlat(e,t,s,o,l,f){const d=s[o],m=s[o+1],p=s[o+2],g=s[o+3],_=l[f],x=l[f+1],M=l[f+2],E=l[f+3];return e[t]=d*E+g*_+m*M-p*x,e[t+1]=m*E+g*x+p*_-d*M,e[t+2]=p*E+g*M+d*x-m*_,e[t+3]=g*E-d*_-m*x-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,s,o){return this._x=e,this._y=t,this._z=s,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const s=e._x,o=e._y,l=e._z,f=e._order,d=Math.cos,m=Math.sin,p=d(s/2),g=d(o/2),_=d(l/2),x=m(s/2),M=m(o/2),E=m(l/2);switch(f){case"XYZ":this._x=x*g*_+p*M*E,this._y=p*M*_-x*g*E,this._z=p*g*E+x*M*_,this._w=p*g*_-x*M*E;break;case"YXZ":this._x=x*g*_+p*M*E,this._y=p*M*_-x*g*E,this._z=p*g*E-x*M*_,this._w=p*g*_+x*M*E;break;case"ZXY":this._x=x*g*_-p*M*E,this._y=p*M*_+x*g*E,this._z=p*g*E+x*M*_,this._w=p*g*_-x*M*E;break;case"ZYX":this._x=x*g*_-p*M*E,this._y=p*M*_+x*g*E,this._z=p*g*E-x*M*_,this._w=p*g*_+x*M*E;break;case"YZX":this._x=x*g*_+p*M*E,this._y=p*M*_+x*g*E,this._z=p*g*E-x*M*_,this._w=p*g*_-x*M*E;break;case"XZY":this._x=x*g*_-p*M*E,this._y=p*M*_-x*g*E,this._z=p*g*E+x*M*_,this._w=p*g*_+x*M*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+f)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const s=t/2,o=Math.sin(s);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,s=t[0],o=t[4],l=t[8],f=t[1],d=t[5],m=t[9],p=t[2],g=t[6],_=t[10],x=s+d+_;if(x>0){const M=.5/Math.sqrt(x+1);this._w=.25/M,this._x=(g-m)*M,this._y=(l-p)*M,this._z=(f-o)*M}else if(s>d&&s>_){const M=2*Math.sqrt(1+s-d-_);this._w=(g-m)/M,this._x=.25*M,this._y=(o+f)/M,this._z=(l+p)/M}else if(d>_){const M=2*Math.sqrt(1+d-s-_);this._w=(l-p)/M,this._x=(o+f)/M,this._y=.25*M,this._z=(m+g)/M}else{const M=2*Math.sqrt(1+_-s-d);this._w=(f-o)/M,this._x=(l+p)/M,this._y=(m+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let s=e.dot(t)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rn(this.dot(e),-1,1)))}rotateTowards(e,t){const s=this.angleTo(e);if(s===0)return this;const o=Math.min(1,t/s);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const s=e._x,o=e._y,l=e._z,f=e._w,d=t._x,m=t._y,p=t._z,g=t._w;return this._x=s*g+f*d+o*p-l*m,this._y=o*g+f*m+l*d-s*p,this._z=l*g+f*p+s*m-o*d,this._w=f*g-s*d-o*m-l*p,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const s=this._x,o=this._y,l=this._z,f=this._w;let d=f*e._w+s*e._x+o*e._y+l*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=f,this._x=s,this._y=o,this._z=l,this;const m=1-d*d;if(m<=Number.EPSILON){const M=1-t;return this._w=M*f+t*this._w,this._x=M*s+t*this._x,this._y=M*o+t*this._y,this._z=M*l+t*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,d),_=Math.sin((1-t)*g)/p,x=Math.sin(t*g)/p;return this._w=f*_+this._w*x,this._x=s*_+this._x*x,this._y=o*_+this._y*x,this._z=l*_+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,t,s){return this.copy(e).slerp(t,s)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),s=Math.random(),o=Math.sqrt(1-s),l=Math.sqrt(s);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ue{constructor(e=0,t=0,s=0){ue.prototype.isVector3=!0,this.x=e,this.y=t,this.z=s}set(e,t,s){return s===void 0&&(s=this.z),this.x=e,this.y=t,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[3]*s+l[6]*o,this.y=l[1]*t+l[4]*s+l[7]*o,this.z=l[2]*t+l[5]*s+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,s=this.y,o=this.z,l=e.elements,f=1/(l[3]*t+l[7]*s+l[11]*o+l[15]);return this.x=(l[0]*t+l[4]*s+l[8]*o+l[12])*f,this.y=(l[1]*t+l[5]*s+l[9]*o+l[13])*f,this.z=(l[2]*t+l[6]*s+l[10]*o+l[14])*f,this}applyQuaternion(e){const t=this.x,s=this.y,o=this.z,l=e.x,f=e.y,d=e.z,m=e.w,p=2*(f*o-d*s),g=2*(d*t-l*o),_=2*(l*s-f*t);return this.x=t+m*p+f*_-d*g,this.y=s+m*g+d*p-l*_,this.z=o+m*_+l*g-f*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,s=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[4]*s+l[8]*o,this.y=l[1]*t+l[5]*s+l[9]*o,this.z=l[2]*t+l[6]*s+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(t,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,s){return this.x=e.x+(t.x-e.x)*s,this.y=e.y+(t.y-e.y)*s,this.z=e.z+(t.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const s=e.x,o=e.y,l=e.z,f=t.x,d=t.y,m=t.z;return this.x=o*m-l*d,this.y=l*f-s*m,this.z=s*d-o*f,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const s=e.dot(this)/t;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return nd.copy(this).projectOnVector(e),this.sub(nd)}reflect(e){return this.sub(nd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const s=this.dot(e)/t;return Math.acos(Rn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,s=this.y-e.y,o=this.z-e.z;return t*t+s*s+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,s){const o=Math.sin(t)*e;return this.x=o*Math.sin(s),this.y=Math.cos(t)*e,this.z=o*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,s){return this.x=e*Math.sin(t),this.y=s,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=s,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,s=Math.sqrt(1-t*t);return this.x=s*Math.cos(e),this.y=t,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const nd=new ue,Fm=new so;class oa{constructor(e=new ue(1/0,1/0,1/0),t=new ue(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t+=3)this.expandByPoint(ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,s=e.count;t<s;t++)this.expandByPoint(ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,s=e.length;t<s;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const s=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const l=s.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let f=0,d=l.count;f<d;f++)e.isMesh===!0?e.getVertexPosition(f,ri):ri.fromBufferAttribute(l,f),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vl.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),vl.copy(s.boundingBox)),vl.applyMatrix4(e.matrixWorld),this.union(vl)}const o=e.children;for(let l=0,f=o.length;l<f;l++)this.expandByObject(o[l],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,s;return e.normal.x>0?(t=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),t<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Xa),_l.subVectors(this.max,Xa),Ps.subVectors(e.a,Xa),Ls.subVectors(e.b,Xa),Ds.subVectors(e.c,Xa),dr.subVectors(Ls,Ps),fr.subVectors(Ds,Ls),Br.subVectors(Ps,Ds);let t=[0,-dr.z,dr.y,0,-fr.z,fr.y,0,-Br.z,Br.y,dr.z,0,-dr.x,fr.z,0,-fr.x,Br.z,0,-Br.x,-dr.y,dr.x,0,-fr.y,fr.x,0,-Br.y,Br.x,0];return!id(t,Ps,Ls,Ds,_l)||(t=[1,0,0,0,1,0,0,0,1],!id(t,Ps,Ls,Ds,_l))?!1:(xl.crossVectors(dr,fr),t=[xl.x,xl.y,xl.z],id(t,Ps,Ls,Ds,_l))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Li=[new ue,new ue,new ue,new ue,new ue,new ue,new ue,new ue],ri=new ue,vl=new oa,Ps=new ue,Ls=new ue,Ds=new ue,dr=new ue,fr=new ue,Br=new ue,Xa=new ue,_l=new ue,xl=new ue,jr=new ue;function id(r,e,t,s,o){for(let l=0,f=r.length-3;l<=f;l+=3){jr.fromArray(r,l);const d=o.x*Math.abs(jr.x)+o.y*Math.abs(jr.y)+o.z*Math.abs(jr.z),m=e.dot(jr),p=t.dot(jr),g=s.dot(jr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>d)return!1}return!0}const fS=new oa,qa=new ue,rd=new ue;class Zd{constructor(e=new ue,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const s=this.center;t!==void 0?s.copy(t):fS.setFromPoints(e).getCenter(s);let o=0;for(let l=0,f=e.length;l<f;l++)o=Math.max(o,s.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const s=this.center.distanceToSquared(e);return t.copy(e),s>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;qa.subVectors(e,this.center);const t=qa.lengthSq();if(t>this.radius*this.radius){const s=Math.sqrt(t),o=(s-this.radius)*.5;this.center.addScaledVector(qa,o/s),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(rd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(qa.copy(e.center).add(rd)),this.expandByPoint(qa.copy(e.center).sub(rd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Di=new ue,sd=new ue,yl=new ue,hr=new ue,ad=new ue,Sl=new ue,od=new ue;class hS{constructor(e=new ue,t=new ue(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const s=t.dot(this.direction);return s<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,s,o){sd.copy(e).add(t).multiplyScalar(.5),yl.copy(t).sub(e).normalize(),hr.copy(this.origin).sub(sd);const l=e.distanceTo(t)*.5,f=-this.direction.dot(yl),d=hr.dot(this.direction),m=-hr.dot(yl),p=hr.lengthSq(),g=Math.abs(1-f*f);let _,x,M,E;if(g>0)if(_=f*m-d,x=f*d-m,E=l*g,_>=0)if(x>=-E)if(x<=E){const w=1/g;_*=w,x*=w,M=_*(_+f*x+2*d)+x*(f*_+x+2*m)+p}else x=l,_=Math.max(0,-(f*x+d)),M=-_*_+x*(x+2*m)+p;else x=-l,_=Math.max(0,-(f*x+d)),M=-_*_+x*(x+2*m)+p;else x<=-E?(_=Math.max(0,-(-f*l+d)),x=_>0?-l:Math.min(Math.max(-l,-m),l),M=-_*_+x*(x+2*m)+p):x<=E?(_=0,x=Math.min(Math.max(-l,-m),l),M=x*(x+2*m)+p):(_=Math.max(0,-(f*l+d)),x=_>0?l:Math.min(Math.max(-l,-m),l),M=-_*_+x*(x+2*m)+p);else x=f>0?-l:l,_=Math.max(0,-(f*x+d)),M=-_*_+x*(x+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,_),o&&o.copy(sd).addScaledVector(yl,x),M}intersectSphere(e,t){Di.subVectors(e.center,this.origin);const s=Di.dot(this.direction),o=Di.dot(Di)-s*s,l=e.radius*e.radius;if(o>l)return null;const f=Math.sqrt(l-o),d=s-f,m=s+f;return m<0?null:d<0?this.at(m,t):this.at(d,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/t;return s>=0?s:null}intersectPlane(e,t){const s=this.distanceToPlane(e);return s===null?null:this.at(s,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let s,o,l,f,d,m;const p=1/this.direction.x,g=1/this.direction.y,_=1/this.direction.z,x=this.origin;return p>=0?(s=(e.min.x-x.x)*p,o=(e.max.x-x.x)*p):(s=(e.max.x-x.x)*p,o=(e.min.x-x.x)*p),g>=0?(l=(e.min.y-x.y)*g,f=(e.max.y-x.y)*g):(l=(e.max.y-x.y)*g,f=(e.min.y-x.y)*g),s>f||l>o||((l>s||isNaN(s))&&(s=l),(f<o||isNaN(o))&&(o=f),_>=0?(d=(e.min.z-x.z)*_,m=(e.max.z-x.z)*_):(d=(e.max.z-x.z)*_,m=(e.min.z-x.z)*_),s>m||d>o)||((d>s||s!==s)&&(s=d),(m<o||o!==o)&&(o=m),o<0)?null:this.at(s>=0?s:o,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,s,o,l){ad.subVectors(t,e),Sl.subVectors(s,e),od.crossVectors(ad,Sl);let f=this.direction.dot(od),d;if(f>0){if(o)return null;d=1}else if(f<0)d=-1,f=-f;else return null;hr.subVectors(this.origin,e);const m=d*this.direction.dot(Sl.crossVectors(hr,Sl));if(m<0)return null;const p=d*this.direction.dot(ad.cross(hr));if(p<0||m+p>f)return null;const g=-d*hr.dot(od);return g<0?null:this.at(g/f,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(e,t,s,o,l,f,d,m,p,g,_,x,M,E,w,S){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,s,o,l,f,d,m,p,g,_,x,M,E,w,S)}set(e,t,s,o,l,f,d,m,p,g,_,x,M,E,w,S){const y=this.elements;return y[0]=e,y[4]=t,y[8]=s,y[12]=o,y[1]=l,y[5]=f,y[9]=d,y[13]=m,y[2]=p,y[6]=g,y[10]=_,y[14]=x,y[3]=M,y[7]=E,y[11]=w,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(e){const t=this.elements,s=e.elements;return t[0]=s[0],t[1]=s[1],t[2]=s[2],t[3]=s[3],t[4]=s[4],t[5]=s[5],t[6]=s[6],t[7]=s[7],t[8]=s[8],t[9]=s[9],t[10]=s[10],t[11]=s[11],t[12]=s[12],t[13]=s[13],t[14]=s[14],t[15]=s[15],this}copyPosition(e){const t=this.elements,s=e.elements;return t[12]=s[12],t[13]=s[13],t[14]=s[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,s){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,t,s){return this.set(e.x,t.x,s.x,0,e.y,t.y,s.y,0,e.z,t.z,s.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,s=e.elements,o=1/Us.setFromMatrixColumn(e,0).length(),l=1/Us.setFromMatrixColumn(e,1).length(),f=1/Us.setFromMatrixColumn(e,2).length();return t[0]=s[0]*o,t[1]=s[1]*o,t[2]=s[2]*o,t[3]=0,t[4]=s[4]*l,t[5]=s[5]*l,t[6]=s[6]*l,t[7]=0,t[8]=s[8]*f,t[9]=s[9]*f,t[10]=s[10]*f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,s=e.x,o=e.y,l=e.z,f=Math.cos(s),d=Math.sin(s),m=Math.cos(o),p=Math.sin(o),g=Math.cos(l),_=Math.sin(l);if(e.order==="XYZ"){const x=f*g,M=f*_,E=d*g,w=d*_;t[0]=m*g,t[4]=-m*_,t[8]=p,t[1]=M+E*p,t[5]=x-w*p,t[9]=-d*m,t[2]=w-x*p,t[6]=E+M*p,t[10]=f*m}else if(e.order==="YXZ"){const x=m*g,M=m*_,E=p*g,w=p*_;t[0]=x+w*d,t[4]=E*d-M,t[8]=f*p,t[1]=f*_,t[5]=f*g,t[9]=-d,t[2]=M*d-E,t[6]=w+x*d,t[10]=f*m}else if(e.order==="ZXY"){const x=m*g,M=m*_,E=p*g,w=p*_;t[0]=x-w*d,t[4]=-f*_,t[8]=E+M*d,t[1]=M+E*d,t[5]=f*g,t[9]=w-x*d,t[2]=-f*p,t[6]=d,t[10]=f*m}else if(e.order==="ZYX"){const x=f*g,M=f*_,E=d*g,w=d*_;t[0]=m*g,t[4]=E*p-M,t[8]=x*p+w,t[1]=m*_,t[5]=w*p+x,t[9]=M*p-E,t[2]=-p,t[6]=d*m,t[10]=f*m}else if(e.order==="YZX"){const x=f*m,M=f*p,E=d*m,w=d*p;t[0]=m*g,t[4]=w-x*_,t[8]=E*_+M,t[1]=_,t[5]=f*g,t[9]=-d*g,t[2]=-p*g,t[6]=M*_+E,t[10]=x-w*_}else if(e.order==="XZY"){const x=f*m,M=f*p,E=d*m,w=d*p;t[0]=m*g,t[4]=-_,t[8]=p*g,t[1]=x*_+w,t[5]=f*g,t[9]=M*_-E,t[2]=E*_-M,t[6]=d*g,t[10]=w*_+x}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pS,e,mS)}lookAt(e,t,s){const o=this.elements;return On.subVectors(e,t),On.lengthSq()===0&&(On.z=1),On.normalize(),pr.crossVectors(s,On),pr.lengthSq()===0&&(Math.abs(s.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),pr.crossVectors(s,On)),pr.normalize(),Ml.crossVectors(On,pr),o[0]=pr.x,o[4]=Ml.x,o[8]=On.x,o[1]=pr.y,o[5]=Ml.y,o[9]=On.y,o[2]=pr.z,o[6]=Ml.z,o[10]=On.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const s=e.elements,o=t.elements,l=this.elements,f=s[0],d=s[4],m=s[8],p=s[12],g=s[1],_=s[5],x=s[9],M=s[13],E=s[2],w=s[6],S=s[10],y=s[14],L=s[3],N=s[7],U=s[11],Y=s[15],I=o[0],O=o[4],W=o[8],R=o[12],A=o[1],D=o[5],G=o[9],B=o[13],te=o[2],le=o[6],X=o[10],ce=o[14],j=o[3],K=o[7],Q=o[11],k=o[15];return l[0]=f*I+d*A+m*te+p*j,l[4]=f*O+d*D+m*le+p*K,l[8]=f*W+d*G+m*X+p*Q,l[12]=f*R+d*B+m*ce+p*k,l[1]=g*I+_*A+x*te+M*j,l[5]=g*O+_*D+x*le+M*K,l[9]=g*W+_*G+x*X+M*Q,l[13]=g*R+_*B+x*ce+M*k,l[2]=E*I+w*A+S*te+y*j,l[6]=E*O+w*D+S*le+y*K,l[10]=E*W+w*G+S*X+y*Q,l[14]=E*R+w*B+S*ce+y*k,l[3]=L*I+N*A+U*te+Y*j,l[7]=L*O+N*D+U*le+Y*K,l[11]=L*W+N*G+U*X+Y*Q,l[15]=L*R+N*B+U*ce+Y*k,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],s=e[4],o=e[8],l=e[12],f=e[1],d=e[5],m=e[9],p=e[13],g=e[2],_=e[6],x=e[10],M=e[14],E=e[3],w=e[7],S=e[11],y=e[15];return E*(+l*m*_-o*p*_-l*d*x+s*p*x+o*d*M-s*m*M)+w*(+t*m*M-t*p*x+l*f*x-o*f*M+o*p*g-l*m*g)+S*(+t*p*_-t*d*M-l*f*_+s*f*M+l*d*g-s*p*g)+y*(-o*d*g-t*m*_+t*d*x+o*f*_-s*f*x+s*m*g)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,s){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=s),this}invert(){const e=this.elements,t=e[0],s=e[1],o=e[2],l=e[3],f=e[4],d=e[5],m=e[6],p=e[7],g=e[8],_=e[9],x=e[10],M=e[11],E=e[12],w=e[13],S=e[14],y=e[15],L=_*S*p-w*x*p+w*m*M-d*S*M-_*m*y+d*x*y,N=E*x*p-g*S*p-E*m*M+f*S*M+g*m*y-f*x*y,U=g*w*p-E*_*p+E*d*M-f*w*M-g*d*y+f*_*y,Y=E*_*m-g*w*m-E*d*x+f*w*x+g*d*S-f*_*S,I=t*L+s*N+o*U+l*Y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/I;return e[0]=L*O,e[1]=(w*x*l-_*S*l-w*o*M+s*S*M+_*o*y-s*x*y)*O,e[2]=(d*S*l-w*m*l+w*o*p-s*S*p-d*o*y+s*m*y)*O,e[3]=(_*m*l-d*x*l-_*o*p+s*x*p+d*o*M-s*m*M)*O,e[4]=N*O,e[5]=(g*S*l-E*x*l+E*o*M-t*S*M-g*o*y+t*x*y)*O,e[6]=(E*m*l-f*S*l-E*o*p+t*S*p+f*o*y-t*m*y)*O,e[7]=(f*x*l-g*m*l+g*o*p-t*x*p-f*o*M+t*m*M)*O,e[8]=U*O,e[9]=(E*_*l-g*w*l-E*s*M+t*w*M+g*s*y-t*_*y)*O,e[10]=(f*w*l-E*d*l+E*s*p-t*w*p-f*s*y+t*d*y)*O,e[11]=(g*d*l-f*_*l-g*s*p+t*_*p+f*s*M-t*d*M)*O,e[12]=Y*O,e[13]=(g*w*o-E*_*o+E*s*x-t*w*x-g*s*S+t*_*S)*O,e[14]=(E*d*o-f*w*o-E*s*m+t*w*m+f*s*S-t*d*S)*O,e[15]=(f*_*o-g*d*o+g*s*m-t*_*m-f*s*x+t*d*x)*O,this}scale(e){const t=this.elements,s=e.x,o=e.y,l=e.z;return t[0]*=s,t[4]*=o,t[8]*=l,t[1]*=s,t[5]*=o,t[9]*=l,t[2]*=s,t[6]*=o,t[10]*=l,t[3]*=s,t[7]*=o,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,s,o))}makeTranslation(e,t,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,s,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,t,-s,0,0,s,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,0,s,0,0,1,0,0,-s,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),s=Math.sin(e);return this.set(t,-s,0,0,s,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const s=Math.cos(t),o=Math.sin(t),l=1-s,f=e.x,d=e.y,m=e.z,p=l*f,g=l*d;return this.set(p*f+s,p*d-o*m,p*m+o*d,0,p*d+o*m,g*d+s,g*m-o*f,0,p*m-o*d,g*m+o*f,l*m*m+s,0,0,0,0,1),this}makeScale(e,t,s){return this.set(e,0,0,0,0,t,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,t,s,o,l,f){return this.set(1,s,l,0,e,1,f,0,t,o,1,0,0,0,0,1),this}compose(e,t,s){const o=this.elements,l=t._x,f=t._y,d=t._z,m=t._w,p=l+l,g=f+f,_=d+d,x=l*p,M=l*g,E=l*_,w=f*g,S=f*_,y=d*_,L=m*p,N=m*g,U=m*_,Y=s.x,I=s.y,O=s.z;return o[0]=(1-(w+y))*Y,o[1]=(M+U)*Y,o[2]=(E-N)*Y,o[3]=0,o[4]=(M-U)*I,o[5]=(1-(x+y))*I,o[6]=(S+L)*I,o[7]=0,o[8]=(E+N)*O,o[9]=(S-L)*O,o[10]=(1-(x+w))*O,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,s){const o=this.elements;let l=Us.set(o[0],o[1],o[2]).length();const f=Us.set(o[4],o[5],o[6]).length(),d=Us.set(o[8],o[9],o[10]).length();this.determinant()<0&&(l=-l),e.x=o[12],e.y=o[13],e.z=o[14],si.copy(this);const p=1/l,g=1/f,_=1/d;return si.elements[0]*=p,si.elements[1]*=p,si.elements[2]*=p,si.elements[4]*=g,si.elements[5]*=g,si.elements[6]*=g,si.elements[8]*=_,si.elements[9]*=_,si.elements[10]*=_,t.setFromRotationMatrix(si),s.x=l,s.y=f,s.z=d,this}makePerspective(e,t,s,o,l,f,d=zi){const m=this.elements,p=2*l/(t-e),g=2*l/(s-o),_=(t+e)/(t-e),x=(s+o)/(s-o);let M,E;if(d===zi)M=-(f+l)/(f-l),E=-2*f*l/(f-l);else if(d===Xl)M=-f/(f-l),E=-f*l/(f-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return m[0]=p,m[4]=0,m[8]=_,m[12]=0,m[1]=0,m[5]=g,m[9]=x,m[13]=0,m[2]=0,m[6]=0,m[10]=M,m[14]=E,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,t,s,o,l,f,d=zi){const m=this.elements,p=1/(t-e),g=1/(s-o),_=1/(f-l),x=(t+e)*p,M=(s+o)*g;let E,w;if(d===zi)E=(f+l)*_,w=-2*_;else if(d===Xl)E=l*_,w=-1*_;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-x,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-M,m[2]=0,m[6]=0,m[10]=w,m[14]=-E,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const t=this.elements,s=e.elements;for(let o=0;o<16;o++)if(t[o]!==s[o])return!1;return!0}fromArray(e,t=0){for(let s=0;s<16;s++)this.elements[s]=e[s+t];return this}toArray(e=[],t=0){const s=this.elements;return e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2],e[t+3]=s[3],e[t+4]=s[4],e[t+5]=s[5],e[t+6]=s[6],e[t+7]=s[7],e[t+8]=s[8],e[t+9]=s[9],e[t+10]=s[10],e[t+11]=s[11],e[t+12]=s[12],e[t+13]=s[13],e[t+14]=s[14],e[t+15]=s[15],e}}const Us=new ue,si=new Bt,pS=new ue(0,0,0),mS=new ue(1,1,1),pr=new ue,Ml=new ue,On=new ue,Om=new Bt,km=new so;class Si{constructor(e=0,t=0,s=0,o=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=s,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,s,o=this._order){return this._x=e,this._y=t,this._z=s,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,s=!0){const o=e.elements,l=o[0],f=o[4],d=o[8],m=o[1],p=o[5],g=o[9],_=o[2],x=o[6],M=o[10];switch(t){case"XYZ":this._y=Math.asin(Rn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-f,l)):(this._x=Math.atan2(x,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Rn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-_,l),this._z=0);break;case"ZXY":this._x=Math.asin(Rn(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-_,M),this._z=Math.atan2(-f,p)):(this._y=0,this._z=Math.atan2(m,l));break;case"ZYX":this._y=Math.asin(-Rn(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(x,M),this._z=Math.atan2(m,l)):(this._x=0,this._z=Math.atan2(-f,p));break;case"YZX":this._z=Math.asin(Rn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-_,l)):(this._x=0,this._y=Math.atan2(d,M));break;case"XZY":this._z=Math.asin(-Rn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(x,p),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,s){return Om.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Om,t,s)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return km.setFromEuler(this),this.setFromQuaternion(km,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class uv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let gS=0;const zm=new ue,Is=new so,Ui=new Bt,El=new ue,Ya=new ue,vS=new ue,_S=new so,Bm=new ue(1,0,0),jm=new ue(0,1,0),Hm=new ue(0,0,1),Vm={type:"added"},xS={type:"removed"},Fs={type:"childadded",child:null},ld={type:"childremoved",child:null};class gn extends aa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gS++}),this.uuid=ro(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gn.DEFAULT_UP.clone();const e=new ue,t=new Si,s=new so,o=new ue(1,1,1);function l(){s.setFromEuler(t,!1)}function f(){t.setFromQuaternion(s,void 0,!1)}t._onChange(l),s._onChange(f),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Bt},normalMatrix:{value:new ft}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(Bm,e)}rotateY(e){return this.rotateOnAxis(jm,e)}rotateZ(e){return this.rotateOnAxis(Hm,e)}translateOnAxis(e,t){return zm.copy(e).applyQuaternion(this.quaternion),this.position.add(zm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bm,e)}translateY(e){return this.translateOnAxis(jm,e)}translateZ(e){return this.translateOnAxis(Hm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,s){e.isVector3?El.copy(e):El.set(e,t,s);const o=this.parent;this.updateWorldMatrix(!0,!1),Ya.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(Ya,El,this.up):Ui.lookAt(El,Ya,this.up),this.quaternion.setFromRotationMatrix(Ui),o&&(Ui.extractRotation(o.matrixWorld),Is.setFromRotationMatrix(Ui),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Vm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(xS),ld.child=e,this.dispatchEvent(ld),ld.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Vm),Fs.child=e,this.dispatchEvent(Fs),Fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let s=0,o=this.children.length;s<o;s++){const f=this.children[s].getObjectByProperty(e,t);if(f!==void 0)return f}}getObjectsByProperty(e,t,s=[]){this[e]===t&&s.push(this);const o=this.children;for(let l=0,f=o.length;l<f;l++)o[l].getObjectsByProperty(e,t,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ya,e,vS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ya,_S,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let s=0,o=t.length;s<o;s++)t[s].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let s=0,o=t.length;s<o;s++){const l=t[s];(l.matrixWorldAutoUpdate===!0||e===!0)&&l.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const s=this.parent;if(e===!0&&s!==null&&s.matrixWorldAutoUpdate===!0&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const o=this.children;for(let l=0,f=o.length;l<f;l++){const d=o[l];d.matrixWorldAutoUpdate===!0&&d.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",s={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),o.maxGeometryCount=this._maxGeometryCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function l(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const _=m[p];l(e.shapes,_)}else l(e.shapes,m)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(l(e.materials,this.material[m]));o.material=d}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let d=0;d<this.children.length;d++)o.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];o.animations.push(l(e.animations,m))}}if(t){const d=f(e.geometries),m=f(e.materials),p=f(e.textures),g=f(e.images),_=f(e.shapes),x=f(e.skeletons),M=f(e.animations),E=f(e.nodes);d.length>0&&(s.geometries=d),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),_.length>0&&(s.shapes=_),x.length>0&&(s.skeletons=x),M.length>0&&(s.animations=M),E.length>0&&(s.nodes=E)}return s.object=o,s;function f(d){const m=[];for(const p in d){const g=d[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let s=0;s<e.children.length;s++){const o=e.children[s];this.add(o.clone())}return this}}gn.DEFAULT_UP=new ue(0,1,0);gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ai=new ue,Ii=new ue,cd=new ue,Fi=new ue,Os=new ue,ks=new ue,Gm=new ue,ud=new ue,dd=new ue,fd=new ue;class vi{constructor(e=new ue,t=new ue,s=new ue){this.a=e,this.b=t,this.c=s}static getNormal(e,t,s,o){o.subVectors(s,t),ai.subVectors(e,t),o.cross(ai);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,t,s,o,l){ai.subVectors(o,t),Ii.subVectors(s,t),cd.subVectors(e,t);const f=ai.dot(ai),d=ai.dot(Ii),m=ai.dot(cd),p=Ii.dot(Ii),g=Ii.dot(cd),_=f*p-d*d;if(_===0)return l.set(0,0,0),null;const x=1/_,M=(p*m-d*g)*x,E=(f*g-d*m)*x;return l.set(1-M-E,E,M)}static containsPoint(e,t,s,o){return this.getBarycoord(e,t,s,o,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,s,o,l,f,d,m){return this.getBarycoord(e,t,s,o,Fi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(l,Fi.x),m.addScaledVector(f,Fi.y),m.addScaledVector(d,Fi.z),m)}static isFrontFacing(e,t,s,o){return ai.subVectors(s,t),Ii.subVectors(e,t),ai.cross(Ii).dot(o)<0}set(e,t,s){return this.a.copy(e),this.b.copy(t),this.c.copy(s),this}setFromPointsAndIndices(e,t,s,o){return this.a.copy(e[t]),this.b.copy(e[s]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,s,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ai.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),ai.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,s,o,l){return vi.getInterpolation(e,this.a,this.b,this.c,t,s,o,l)}containsPoint(e){return vi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const s=this.a,o=this.b,l=this.c;let f,d;Os.subVectors(o,s),ks.subVectors(l,s),ud.subVectors(e,s);const m=Os.dot(ud),p=ks.dot(ud);if(m<=0&&p<=0)return t.copy(s);dd.subVectors(e,o);const g=Os.dot(dd),_=ks.dot(dd);if(g>=0&&_<=g)return t.copy(o);const x=m*_-g*p;if(x<=0&&m>=0&&g<=0)return f=m/(m-g),t.copy(s).addScaledVector(Os,f);fd.subVectors(e,l);const M=Os.dot(fd),E=ks.dot(fd);if(E>=0&&M<=E)return t.copy(l);const w=M*p-m*E;if(w<=0&&p>=0&&E<=0)return d=p/(p-E),t.copy(s).addScaledVector(ks,d);const S=g*E-M*_;if(S<=0&&_-g>=0&&M-E>=0)return Gm.subVectors(l,o),d=(_-g)/(_-g+(M-E)),t.copy(o).addScaledVector(Gm,d);const y=1/(S+w+x);return f=w*y,d=x*y,t.copy(s).addScaledVector(Os,f).addScaledVector(ks,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const dv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},wl={h:0,s:0,l:0};function hd(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Et{constructor(e,t,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,s)}set(e,t,s){if(t===void 0&&s===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.toWorkingColorSpace(this,t),this}setRGB(e,t,s,o=At.workingColorSpace){return this.r=e,this.g=t,this.b=s,At.toWorkingColorSpace(this,o),this}setHSL(e,t,s,o=At.workingColorSpace){if(e=iS(e,1),t=Rn(t,0,1),s=Rn(s,0,1),t===0)this.r=this.g=this.b=s;else{const l=s<=.5?s*(1+t):s+t-s*t,f=2*s-l;this.r=hd(f,l,e+1/3),this.g=hd(f,l,e),this.b=hd(f,l,e-1/3)}return At.toWorkingColorSpace(this,o),this}setStyle(e,t=pi){function s(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const f=o[1],d=o[2];switch(f){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],f=l.length;if(f===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(f===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pi){const s=dv[e.toLowerCase()];return s!==void 0?this.setHex(s,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}copyLinearToSRGB(e){return this.r=ed(e.r),this.g=ed(e.g),this.b=ed(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pi){return At.fromWorkingColorSpace(pn.copy(this),e),Math.round(Rn(pn.r*255,0,255))*65536+Math.round(Rn(pn.g*255,0,255))*256+Math.round(Rn(pn.b*255,0,255))}getHexString(e=pi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.fromWorkingColorSpace(pn.copy(this),t);const s=pn.r,o=pn.g,l=pn.b,f=Math.max(s,o,l),d=Math.min(s,o,l);let m,p;const g=(d+f)/2;if(d===f)m=0,p=0;else{const _=f-d;switch(p=g<=.5?_/(f+d):_/(2-f-d),f){case s:m=(o-l)/_+(o<l?6:0);break;case o:m=(l-s)/_+2;break;case l:m=(s-o)/_+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,t=At.workingColorSpace){return At.fromWorkingColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=pi){At.fromWorkingColorSpace(pn.copy(this),e);const t=pn.r,s=pn.g,o=pn.b;return e!==pi?`color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(s*255)},${Math.round(o*255)})`}offsetHSL(e,t,s){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,s){return this.r=e.r+(t.r-e.r)*s,this.g=e.g+(t.g-e.g)*s,this.b=e.b+(t.b-e.b)*s,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(wl);const s=Ju(mr.h,wl.h,t),o=Ju(mr.s,wl.s,t),l=Ju(mr.l,wl.l,t);return this.setHSL(s,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,s=this.g,o=this.b,l=e.elements;return this.r=l[0]*t+l[3]*s+l[6]*o,this.g=l[1]*t+l[4]*s+l[7]*o,this.b=l[2]*t+l[5]*s+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pn=new Et;Et.NAMES=dv;let yS=0;class ao extends aa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yS++}),this.uuid=ro(),this.name="",this.type="Material",this.blending=Ks,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nd,this.blendDst=Pd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=Vl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const s=e[t];if(s===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(s):o&&o.isVector3&&s&&s.isVector3?o.copy(s):this[t]=s}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Ks&&(s.blending=this.blending),this.side!==Sr&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Nd&&(s.blendSrc=this.blendSrc),this.blendDst!==Pd&&(s.blendDst=this.blendDst),this.blendEquation!==qr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Vl&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nm&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function o(l){const f=[];for(const d in l){const m=l[d];delete m.metadata,f.push(m)}return f}if(t){const l=o(e.textures),f=o(e.images);l.length>0&&(s.textures=l),f.length>0&&(s.images=f)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let s=null;if(t!==null){const o=t.length;s=new Array(o);for(let l=0;l!==o;++l)s[l]=t[l].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class fv extends ao{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=Kg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ht=new ue,Tl=new xt;class Bn{constructor(e,t,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=s,this.usage=Pm,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return sS("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,s){e*=this.itemSize,s*=t.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=t.array[s+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,s=this.count;t<s;t++)Tl.fromBufferAttribute(this,t),Tl.applyMatrix3(e),this.setXY(t,Tl.x,Tl.y);else if(this.itemSize===3)for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix3(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyMatrix4(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,s=this.count;t<s;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let s=this.array[e*this.itemSize+t];return this.normalized&&(s=$a(s,this.array)),s}setComponent(e,t,s){return this.normalized&&(s=Cn(s,this.array)),this.array[e*this.itemSize+t]=s,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$a(t,this.array)),t}setX(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$a(t,this.array)),t}setY(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$a(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$a(t,this.array)),t}setW(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,s){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array)),this.array[e+0]=t,this.array[e+1]=s,this}setXYZ(e,t,s,o){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this}setXYZW(e,t,s,o,l){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),s=Cn(s,this.array),o=Cn(o,this.array),l=Cn(l,this.array)),this.array[e+0]=t,this.array[e+1]=s,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pm&&(e.usage=this.usage),e}}class hv extends Bn{constructor(e,t,s){super(new Uint16Array(e),t,s)}}class pv extends Bn{constructor(e,t,s){super(new Uint32Array(e),t,s)}}class Bi extends Bn{constructor(e,t,s){super(new Float32Array(e),t,s)}}let SS=0;const Xn=new Bt,pd=new gn,zs=new ue,kn=new oa,Ka=new oa,nn=new ue;class Hi extends aa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:SS++}),this.uuid=ro(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ov(e)?pv:hv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,s=0){this.groups.push({start:e,count:t,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const l=new ft().getNormalMatrix(e);s.applyNormalMatrix(l),s.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xn.makeRotationFromQuaternion(e),this.applyMatrix4(Xn),this}rotateX(e){return Xn.makeRotationX(e),this.applyMatrix4(Xn),this}rotateY(e){return Xn.makeRotationY(e),this.applyMatrix4(Xn),this}rotateZ(e){return Xn.makeRotationZ(e),this.applyMatrix4(Xn),this}translate(e,t,s){return Xn.makeTranslation(e,t,s),this.applyMatrix4(Xn),this}scale(e,t,s){return Xn.makeScale(e,t,s),this.applyMatrix4(Xn),this}lookAt(e){return pd.lookAt(e),pd.updateMatrix(),this.applyMatrix4(pd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){const t=[];for(let s=0,o=e.length;s<o;s++){const l=e[s];t.push(l.x,l.y,l.z||0)}return this.setAttribute("position",new Bi(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new oa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ue(-1/0,-1/0,-1/0),new ue(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const l=t[s];kn.setFromBufferAttribute(l),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,kn.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,kn.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(kn.min),this.boundingBox.expandByPoint(kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zd);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ue,1/0);return}if(e){const s=this.boundingSphere.center;if(kn.setFromBufferAttribute(e),t)for(let l=0,f=t.length;l<f;l++){const d=t[l];Ka.setFromBufferAttribute(d),this.morphTargetsRelative?(nn.addVectors(kn.min,Ka.min),kn.expandByPoint(nn),nn.addVectors(kn.max,Ka.max),kn.expandByPoint(nn)):(kn.expandByPoint(Ka.min),kn.expandByPoint(Ka.max))}kn.getCenter(s);let o=0;for(let l=0,f=e.count;l<f;l++)nn.fromBufferAttribute(e,l),o=Math.max(o,s.distanceToSquared(nn));if(t)for(let l=0,f=t.length;l<f;l++){const d=t[l],m=this.morphTargetsRelative;for(let p=0,g=d.count;p<g;p++)nn.fromBufferAttribute(d,p),m&&(zs.fromBufferAttribute(e,p),nn.add(zs)),o=Math.max(o,s.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=t.position,o=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*s.count),4));const f=this.getAttribute("tangent"),d=[],m=[];for(let W=0;W<s.count;W++)d[W]=new ue,m[W]=new ue;const p=new ue,g=new ue,_=new ue,x=new xt,M=new xt,E=new xt,w=new ue,S=new ue;function y(W,R,A){p.fromBufferAttribute(s,W),g.fromBufferAttribute(s,R),_.fromBufferAttribute(s,A),x.fromBufferAttribute(l,W),M.fromBufferAttribute(l,R),E.fromBufferAttribute(l,A),g.sub(p),_.sub(p),M.sub(x),E.sub(x);const D=1/(M.x*E.y-E.x*M.y);isFinite(D)&&(w.copy(g).multiplyScalar(E.y).addScaledVector(_,-M.y).multiplyScalar(D),S.copy(_).multiplyScalar(M.x).addScaledVector(g,-E.x).multiplyScalar(D),d[W].add(w),d[R].add(w),d[A].add(w),m[W].add(S),m[R].add(S),m[A].add(S))}let L=this.groups;L.length===0&&(L=[{start:0,count:e.count}]);for(let W=0,R=L.length;W<R;++W){const A=L[W],D=A.start,G=A.count;for(let B=D,te=D+G;B<te;B+=3)y(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const N=new ue,U=new ue,Y=new ue,I=new ue;function O(W){Y.fromBufferAttribute(o,W),I.copy(Y);const R=d[W];N.copy(R),N.sub(Y.multiplyScalar(Y.dot(R))).normalize(),U.crossVectors(I,R);const D=U.dot(m[W])<0?-1:1;f.setXYZW(W,N.x,N.y,N.z,D)}for(let W=0,R=L.length;W<R;++W){const A=L[W],D=A.start,G=A.count;for(let B=D,te=D+G;B<te;B+=3)O(e.getX(B+0)),O(e.getX(B+1)),O(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",s);else for(let x=0,M=s.count;x<M;x++)s.setXYZ(x,0,0,0);const o=new ue,l=new ue,f=new ue,d=new ue,m=new ue,p=new ue,g=new ue,_=new ue;if(e)for(let x=0,M=e.count;x<M;x+=3){const E=e.getX(x+0),w=e.getX(x+1),S=e.getX(x+2);o.fromBufferAttribute(t,E),l.fromBufferAttribute(t,w),f.fromBufferAttribute(t,S),g.subVectors(f,l),_.subVectors(o,l),g.cross(_),d.fromBufferAttribute(s,E),m.fromBufferAttribute(s,w),p.fromBufferAttribute(s,S),d.add(g),m.add(g),p.add(g),s.setXYZ(E,d.x,d.y,d.z),s.setXYZ(w,m.x,m.y,m.z),s.setXYZ(S,p.x,p.y,p.z)}else for(let x=0,M=t.count;x<M;x+=3)o.fromBufferAttribute(t,x+0),l.fromBufferAttribute(t,x+1),f.fromBufferAttribute(t,x+2),g.subVectors(f,l),_.subVectors(o,l),g.cross(_),s.setXYZ(x+0,g.x,g.y,g.z),s.setXYZ(x+1,g.x,g.y,g.z),s.setXYZ(x+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,s=e.count;t<s;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(d,m){const p=d.array,g=d.itemSize,_=d.normalized,x=new p.constructor(m.length*g);let M=0,E=0;for(let w=0,S=m.length;w<S;w++){d.isInterleavedBufferAttribute?M=m[w]*d.data.stride+d.offset:M=m[w]*g;for(let y=0;y<g;y++)x[E++]=p[M++]}return new Bn(x,g,_)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Hi,s=this.index.array,o=this.attributes;for(const d in o){const m=o[d],p=e(m,s);t.setAttribute(d,p)}const l=this.morphAttributes;for(const d in l){const m=[],p=l[d];for(let g=0,_=p.length;g<_;g++){const x=p[g],M=e(x,s);m.push(M)}t.morphAttributes[d]=m}t.morphTargetsRelative=this.morphTargetsRelative;const f=this.groups;for(let d=0,m=f.length;d<m;d++){const p=f[d];t.addGroup(p.start,p.count,p.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const s=this.attributes;for(const m in s){const p=s[m];e.data.attributes[m]=p.toJSON(e.data)}const o={};let l=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let _=0,x=p.length;_<x;_++){const M=p[_];g.push(M.toJSON(e.data))}g.length>0&&(o[m]=g,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const f=this.groups;f.length>0&&(e.data.groups=JSON.parse(JSON.stringify(f)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(t));const o=e.attributes;for(const p in o){const g=o[p];this.setAttribute(p,g.clone(t))}const l=e.morphAttributes;for(const p in l){const g=[],_=l[p];for(let x=0,M=_.length;x<M;x++)g.push(_[x].clone(t));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const f=e.groups;for(let p=0,g=f.length;p<g;p++){const _=f[p];this.addGroup(_.start,_.count,_.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Wm=new Bt,Hr=new hS,Al=new Zd,$m=new ue,Bs=new ue,js=new ue,Hs=new ue,md=new ue,bl=new ue,Cl=new xt,Rl=new xt,Nl=new xt,Xm=new ue,qm=new ue,Ym=new ue,Pl=new ue,Ll=new ue;class xi extends gn{constructor(e=new Hi,t=new fv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,s=Object.keys(t);if(s.length>0){const o=t[s[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,f=o.length;l<f;l++){const d=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const s=this.geometry,o=s.attributes.position,l=s.morphAttributes.position,f=s.morphTargetsRelative;t.fromBufferAttribute(o,e);const d=this.morphTargetInfluences;if(l&&d){bl.set(0,0,0);for(let m=0,p=l.length;m<p;m++){const g=d[m],_=l[m];g!==0&&(md.fromBufferAttribute(_,e),f?bl.addScaledVector(md,g):bl.addScaledVector(md.sub(t),g))}t.add(bl)}return t}raycast(e,t){const s=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Al.copy(s.boundingSphere),Al.applyMatrix4(l),Hr.copy(e.ray).recast(e.near),!(Al.containsPoint(Hr.origin)===!1&&(Hr.intersectSphere(Al,$m)===null||Hr.origin.distanceToSquared($m)>(e.far-e.near)**2))&&(Wm.copy(l).invert(),Hr.copy(e.ray).applyMatrix4(Wm),!(s.boundingBox!==null&&Hr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,t,Hr)))}_computeIntersections(e,t,s){let o;const l=this.geometry,f=this.material,d=l.index,m=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,_=l.attributes.normal,x=l.groups,M=l.drawRange;if(d!==null)if(Array.isArray(f))for(let E=0,w=x.length;E<w;E++){const S=x[E],y=f[S.materialIndex],L=Math.max(S.start,M.start),N=Math.min(d.count,Math.min(S.start+S.count,M.start+M.count));for(let U=L,Y=N;U<Y;U+=3){const I=d.getX(U),O=d.getX(U+1),W=d.getX(U+2);o=Dl(this,y,e,s,p,g,_,I,O,W),o&&(o.faceIndex=Math.floor(U/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(d.count,M.start+M.count);for(let S=E,y=w;S<y;S+=3){const L=d.getX(S),N=d.getX(S+1),U=d.getX(S+2);o=Dl(this,f,e,s,p,g,_,L,N,U),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}else if(m!==void 0)if(Array.isArray(f))for(let E=0,w=x.length;E<w;E++){const S=x[E],y=f[S.materialIndex],L=Math.max(S.start,M.start),N=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let U=L,Y=N;U<Y;U+=3){const I=U,O=U+1,W=U+2;o=Dl(this,y,e,s,p,g,_,I,O,W),o&&(o.faceIndex=Math.floor(U/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const E=Math.max(0,M.start),w=Math.min(m.count,M.start+M.count);for(let S=E,y=w;S<y;S+=3){const L=S,N=S+1,U=S+2;o=Dl(this,f,e,s,p,g,_,L,N,U),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}}}function MS(r,e,t,s,o,l,f,d){let m;if(e.side===Nn?m=s.intersectTriangle(f,l,o,!0,d):m=s.intersectTriangle(o,l,f,e.side===Sr,d),m===null)return null;Ll.copy(d),Ll.applyMatrix4(r.matrixWorld);const p=t.ray.origin.distanceTo(Ll);return p<t.near||p>t.far?null:{distance:p,point:Ll.clone(),object:r}}function Dl(r,e,t,s,o,l,f,d,m,p){r.getVertexPosition(d,Bs),r.getVertexPosition(m,js),r.getVertexPosition(p,Hs);const g=MS(r,e,t,s,Bs,js,Hs,Pl);if(g){o&&(Cl.fromBufferAttribute(o,d),Rl.fromBufferAttribute(o,m),Nl.fromBufferAttribute(o,p),g.uv=vi.getInterpolation(Pl,Bs,js,Hs,Cl,Rl,Nl,new xt)),l&&(Cl.fromBufferAttribute(l,d),Rl.fromBufferAttribute(l,m),Nl.fromBufferAttribute(l,p),g.uv1=vi.getInterpolation(Pl,Bs,js,Hs,Cl,Rl,Nl,new xt)),f&&(Xm.fromBufferAttribute(f,d),qm.fromBufferAttribute(f,m),Ym.fromBufferAttribute(f,p),g.normal=vi.getInterpolation(Pl,Bs,js,Hs,Xm,qm,Ym,new ue),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const _={a:d,b:m,c:p,normal:new ue,materialIndex:0};vi.getNormal(Bs,js,Hs,_.normal),g.face=_}return g}class oo extends Hi{constructor(e=1,t=1,s=1,o=1,l=1,f=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:s,widthSegments:o,heightSegments:l,depthSegments:f};const d=this;o=Math.floor(o),l=Math.floor(l),f=Math.floor(f);const m=[],p=[],g=[],_=[];let x=0,M=0;E("z","y","x",-1,-1,s,t,e,f,l,0),E("z","y","x",1,-1,s,t,-e,f,l,1),E("x","z","y",1,1,e,s,t,o,f,2),E("x","z","y",1,-1,e,s,-t,o,f,3),E("x","y","z",1,-1,e,t,s,o,l,4),E("x","y","z",-1,-1,e,t,-s,o,l,5),this.setIndex(m),this.setAttribute("position",new Bi(p,3)),this.setAttribute("normal",new Bi(g,3)),this.setAttribute("uv",new Bi(_,2));function E(w,S,y,L,N,U,Y,I,O,W,R){const A=U/O,D=Y/W,G=U/2,B=Y/2,te=I/2,le=O+1,X=W+1;let ce=0,j=0;const K=new ue;for(let Q=0;Q<X;Q++){const k=Q*D-B;for(let re=0;re<le;re++){const Ue=re*A-G;K[w]=Ue*L,K[S]=k*N,K[y]=te,p.push(K.x,K.y,K.z),K[w]=0,K[S]=0,K[y]=I>0?1:-1,g.push(K.x,K.y,K.z),_.push(re/O),_.push(1-Q/W),ce+=1}}for(let Q=0;Q<W;Q++)for(let k=0;k<O;k++){const re=x+k+le*Q,Ue=x+k+le*(Q+1),ne=x+(k+1)+le*(Q+1),pe=x+(k+1)+le*Q;m.push(re,Ue,pe),m.push(Ue,ne,pe),j+=6}d.addGroup(M,j,R),M+=j,x+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ra(r){const e={};for(const t in r){e[t]={};for(const s in r[t]){const o=r[t][s];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][s]=null):e[t][s]=o.clone():Array.isArray(o)?e[t][s]=o.slice():e[t][s]=o}}return e}function xn(r){const e={};for(let t=0;t<r.length;t++){const s=ra(r[t]);for(const o in s)e[o]=s[o]}return e}function ES(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function mv(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const wS={clone:ra,merge:xn};var TS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,AS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Er extends ao{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=TS,this.fragmentShader=AS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ra(e.uniforms),this.uniformsGroups=ES(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const f=this.uniforms[o].value;f&&f.isTexture?t.uniforms[o]={type:"t",value:f.toJSON(e).uuid}:f&&f.isColor?t.uniforms[o]={type:"c",value:f.getHex()}:f&&f.isVector2?t.uniforms[o]={type:"v2",value:f.toArray()}:f&&f.isVector3?t.uniforms[o]={type:"v3",value:f.toArray()}:f&&f.isVector4?t.uniforms[o]={type:"v4",value:f.toArray()}:f&&f.isMatrix3?t.uniforms[o]={type:"m3",value:f.toArray()}:f&&f.isMatrix4?t.uniforms[o]={type:"m4",value:f.toArray()}:t.uniforms[o]={value:f}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const s={};for(const o in this.extensions)this.extensions[o]===!0&&(s[o]=!0);return Object.keys(s).length>0&&(t.extensions=s),t}}class gv extends gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=zi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gr=new ue,Km=new xt,Zm=new xt;class qn extends gv{constructor(e=50,t=1,s=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fd*2*Math.atan(Math.tan(Zu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,s){gr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gr.x,gr.y).multiplyScalar(-e/gr.z),gr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(gr.x,gr.y).multiplyScalar(-e/gr.z)}getViewSize(e,t){return this.getViewBounds(e,Km,Zm),t.subVectors(Zm,Km)}setViewOffset(e,t,s,o,l,f){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zu*.5*this.fov)/this.zoom,s=2*t,o=this.aspect*s,l=-.5*o;const f=this.view;if(this.view!==null&&this.view.enabled){const m=f.fullWidth,p=f.fullHeight;l+=f.offsetX*o/m,t-=f.offsetY*s/p,o*=f.width/m,s*=f.height/p}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,t,t-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Vs=-90,Gs=1;class bS extends gn{constructor(e,t,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new qn(Vs,Gs,e,t);o.layers=this.layers,this.add(o);const l=new qn(Vs,Gs,e,t);l.layers=this.layers,this.add(l);const f=new qn(Vs,Gs,e,t);f.layers=this.layers,this.add(f);const d=new qn(Vs,Gs,e,t);d.layers=this.layers,this.add(d);const m=new qn(Vs,Gs,e,t);m.layers=this.layers,this.add(m);const p=new qn(Vs,Gs,e,t);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[s,o,l,f,d,m]=t;for(const p of t)this.remove(p);if(e===zi)s.up.set(0,1,0),s.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),f.up.set(0,0,1),f.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===Xl)s.up.set(0,-1,0),s.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),f.up.set(0,0,-1),f.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of t)this.add(p),p.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,f,d,m,p,g]=this.children,_=e.getRenderTarget(),x=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const w=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,o),e.render(t,l),e.setRenderTarget(s,1,o),e.render(t,f),e.setRenderTarget(s,2,o),e.render(t,d),e.setRenderTarget(s,3,o),e.render(t,m),e.setRenderTarget(s,4,o),e.render(t,p),s.texture.generateMipmaps=w,e.setRenderTarget(s,5,o),e.render(t,g),e.setRenderTarget(_,x,M),e.xr.enabled=E,s.texture.needsPMREMUpdate=!0}}class vv extends Pn{constructor(e,t,s,o,l,f,d,m,p,g){e=e!==void 0?e:[],t=t!==void 0?t:ta,super(e,t,s,o,l,f,d,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class CS extends ns{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},o=[s,s,s,s,s,s];this.texture=new vv(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:oi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new oo(5,5,5),l=new Er({name:"CubemapFromEquirect",uniforms:ra(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Nn,blending:xr});l.uniforms.tEquirect.value=t;const f=new xi(o,l),d=t.minFilter;return t.minFilter===Jr&&(t.minFilter=oi),new bS(1,10,this).update(e,f),t.minFilter=d,f.geometry.dispose(),f.material.dispose(),this}clear(e,t,s,o){const l=e.getRenderTarget();for(let f=0;f<6;f++)e.setRenderTarget(this,f),e.clear(t,s,o);e.setRenderTarget(l)}}const gd=new ue,RS=new ue,NS=new ft;class $r{constructor(e=new ue(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,s,o){return this.normal.set(e,t,s),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,s){const o=gd.subVectors(s,t).cross(RS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const s=e.delta(gd),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/o;return l<0||l>1?null:t.copy(e.start).addScaledVector(s,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return t<0&&s>0||s<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const s=t||NS.getNormalMatrix(e),o=this.coplanarPoint(gd).applyMatrix4(e),l=this.normal.applyMatrix3(s).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new Zd,Ul=new ue;class Jd{constructor(e=new $r,t=new $r,s=new $r,o=new $r,l=new $r,f=new $r){this.planes=[e,t,s,o,l,f]}set(e,t,s,o,l,f){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(s),d[3].copy(o),d[4].copy(l),d[5].copy(f),this}copy(e){const t=this.planes;for(let s=0;s<6;s++)t[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,t=zi){const s=this.planes,o=e.elements,l=o[0],f=o[1],d=o[2],m=o[3],p=o[4],g=o[5],_=o[6],x=o[7],M=o[8],E=o[9],w=o[10],S=o[11],y=o[12],L=o[13],N=o[14],U=o[15];if(s[0].setComponents(m-l,x-p,S-M,U-y).normalize(),s[1].setComponents(m+l,x+p,S+M,U+y).normalize(),s[2].setComponents(m+f,x+g,S+E,U+L).normalize(),s[3].setComponents(m-f,x-g,S-E,U-L).normalize(),s[4].setComponents(m-d,x-_,S-w,U-N).normalize(),t===zi)s[5].setComponents(m+d,x+_,S+w,U+N).normalize();else if(t===Xl)s[5].setComponents(d,_,w,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const t=this.planes,s=e.center,o=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(s)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let s=0;s<6;s++){const o=t[s];if(Ul.x=o.normal.x>0?e.max.x:e.min.x,Ul.y=o.normal.y>0?e.max.y:e.min.y,Ul.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Ul)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let s=0;s<6;s++)if(t[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function _v(){let r=null,e=!1,t=null,s=null;function o(l,f){t(l,f),s=r.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(s=r.requestAnimationFrame(o),e=!0)},stop:function(){r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){r=l}}}function PS(r){const e=new WeakMap;function t(d,m){const p=d.array,g=d.usage,_=p.byteLength,x=r.createBuffer();r.bindBuffer(m,x),r.bufferData(m,p,g),d.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:x,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:_}}function s(d,m,p){const g=m.array,_=m._updateRange,x=m.updateRanges;if(r.bindBuffer(p,d),_.count===-1&&x.length===0&&r.bufferSubData(p,0,g),x.length!==0){for(let M=0,E=x.length;M<E;M++){const w=x[M];r.bufferSubData(p,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}m.clearUpdateRanges()}_.count!==-1&&(r.bufferSubData(p,_.offset*g.BYTES_PER_ELEMENT,g,_.offset,_.count),_.count=-1),m.onUploadCallback()}function o(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const m=e.get(d);m&&(r.deleteBuffer(m.buffer),e.delete(d))}function f(d,m){if(d.isGLBufferAttribute){const g=e.get(d);(!g||g.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}d.isInterleavedBufferAttribute&&(d=d.data);const p=e.get(d);if(p===void 0)e.set(d,t(d,m));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,d,m),p.version=d.version}}return{get:o,remove:l,update:f}}class tc extends Hi{constructor(e=1,t=1,s=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:s,heightSegments:o};const l=e/2,f=t/2,d=Math.floor(s),m=Math.floor(o),p=d+1,g=m+1,_=e/d,x=t/m,M=[],E=[],w=[],S=[];for(let y=0;y<g;y++){const L=y*x-f;for(let N=0;N<p;N++){const U=N*_-l;E.push(U,-L,0),w.push(0,0,1),S.push(N/d),S.push(1-y/m)}}for(let y=0;y<m;y++)for(let L=0;L<d;L++){const N=L+p*y,U=L+p*(y+1),Y=L+1+p*(y+1),I=L+1+p*y;M.push(N,U,I),M.push(U,Y,I)}this.setIndex(M),this.setAttribute("position",new Bi(E,3)),this.setAttribute("normal",new Bi(w,3)),this.setAttribute("uv",new Bi(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tc(e.width,e.height,e.widthSegments,e.heightSegments)}}var LS=`#ifdef USE_ALPHAHASH
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,bM=`BlinnPhongMaterial material;
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
#endif`,bE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
}`,dt={alphahash_fragment:LS,alphahash_pars_fragment:DS,alphamap_fragment:US,alphamap_pars_fragment:IS,alphatest_fragment:FS,alphatest_pars_fragment:OS,aomap_fragment:kS,aomap_pars_fragment:zS,batching_pars_vertex:BS,batching_vertex:jS,begin_vertex:HS,beginnormal_vertex:VS,bsdfs:GS,iridescence_fragment:WS,bumpmap_pars_fragment:$S,clipping_planes_fragment:XS,clipping_planes_pars_fragment:qS,clipping_planes_pars_vertex:YS,clipping_planes_vertex:KS,color_fragment:ZS,color_pars_fragment:JS,color_pars_vertex:QS,color_vertex:eM,common:tM,cube_uv_reflection_fragment:nM,defaultnormal_vertex:iM,displacementmap_pars_vertex:rM,displacementmap_vertex:sM,emissivemap_fragment:aM,emissivemap_pars_fragment:oM,colorspace_fragment:lM,colorspace_pars_fragment:cM,envmap_fragment:uM,envmap_common_pars_fragment:dM,envmap_pars_fragment:fM,envmap_pars_vertex:hM,envmap_physical_pars_fragment:wM,envmap_vertex:pM,fog_vertex:mM,fog_pars_vertex:gM,fog_fragment:vM,fog_pars_fragment:_M,gradientmap_pars_fragment:xM,lightmap_pars_fragment:yM,lights_lambert_fragment:SM,lights_lambert_pars_fragment:MM,lights_pars_begin:EM,lights_toon_fragment:TM,lights_toon_pars_fragment:AM,lights_phong_fragment:bM,lights_phong_pars_fragment:CM,lights_physical_fragment:RM,lights_physical_pars_fragment:NM,lights_fragment_begin:PM,lights_fragment_maps:LM,lights_fragment_end:DM,logdepthbuf_fragment:UM,logdepthbuf_pars_fragment:IM,logdepthbuf_pars_vertex:FM,logdepthbuf_vertex:OM,map_fragment:kM,map_pars_fragment:zM,map_particle_fragment:BM,map_particle_pars_fragment:jM,metalnessmap_fragment:HM,metalnessmap_pars_fragment:VM,morphinstance_vertex:GM,morphcolor_vertex:WM,morphnormal_vertex:$M,morphtarget_pars_vertex:XM,morphtarget_vertex:qM,normal_fragment_begin:YM,normal_fragment_maps:KM,normal_pars_fragment:ZM,normal_pars_vertex:JM,normal_vertex:QM,normalmap_pars_fragment:eE,clearcoat_normal_fragment_begin:tE,clearcoat_normal_fragment_maps:nE,clearcoat_pars_fragment:iE,iridescence_pars_fragment:rE,opaque_fragment:sE,packing:aE,premultiplied_alpha_fragment:oE,project_vertex:lE,dithering_fragment:cE,dithering_pars_fragment:uE,roughnessmap_fragment:dE,roughnessmap_pars_fragment:fE,shadowmap_pars_fragment:hE,shadowmap_pars_vertex:pE,shadowmap_vertex:mE,shadowmask_pars_fragment:gE,skinbase_vertex:vE,skinning_pars_vertex:_E,skinning_vertex:xE,skinnormal_vertex:yE,specularmap_fragment:SE,specularmap_pars_fragment:ME,tonemapping_fragment:EE,tonemapping_pars_fragment:wE,transmission_fragment:TE,transmission_pars_fragment:AE,uv_pars_fragment:bE,uv_pars_vertex:CE,uv_vertex:RE,worldpos_vertex:NE,background_vert:PE,background_frag:LE,backgroundCube_vert:DE,backgroundCube_frag:UE,cube_vert:IE,cube_frag:FE,depth_vert:OE,depth_frag:kE,distanceRGBA_vert:zE,distanceRGBA_frag:BE,equirect_vert:jE,equirect_frag:HE,linedashed_vert:VE,linedashed_frag:GE,meshbasic_vert:WE,meshbasic_frag:$E,meshlambert_vert:XE,meshlambert_frag:qE,meshmatcap_vert:YE,meshmatcap_frag:KE,meshnormal_vert:ZE,meshnormal_frag:JE,meshphong_vert:QE,meshphong_frag:ew,meshphysical_vert:tw,meshphysical_frag:nw,meshtoon_vert:iw,meshtoon_frag:rw,points_vert:sw,points_frag:aw,shadow_vert:ow,shadow_frag:lw,sprite_vert:cw,sprite_frag:uw},Pe={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ft}},envmap:{envMap:{value:null},envMapRotation:{value:new ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ft},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}}},mi={basic:{uniforms:xn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:xn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:xn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:xn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:xn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:xn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:xn([Pe.points,Pe.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:xn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:xn([Pe.common,Pe.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:xn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:xn([Pe.sprite,Pe.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ft}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:xn([Pe.common,Pe.displacementmap,{referencePosition:{value:new ue},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:xn([Pe.lights,Pe.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};mi.physical={uniforms:xn([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ft},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ft},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ft},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ft},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ft},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ft}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const Il={r:0,b:0,g:0},Gr=new Si,dw=new Bt;function fw(r,e,t,s,o,l,f){const d=new Et(0);let m=l===!0?0:1,p,g,_=null,x=0,M=null;function E(L){let N=L.isScene===!0?L.background:null;return N&&N.isTexture&&(N=(L.backgroundBlurriness>0?t:e).get(N)),N}function w(L){let N=!1;const U=E(L);U===null?y(d,m):U&&U.isColor&&(y(U,1),N=!0);const Y=r.xr.getEnvironmentBlendMode();Y==="additive"?s.buffers.color.setClear(0,0,0,1,f):Y==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,f),(r.autoClear||N)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil)}function S(L,N){const U=E(N);U&&(U.isCubeTexture||U.mapping===Jl)?(g===void 0&&(g=new xi(new oo(1,1,1),new Er({name:"BackgroundCubeMaterial",uniforms:ra(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(Y,I,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(g)),Gr.copy(N.backgroundRotation),Gr.x*=-1,Gr.y*=-1,Gr.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(Gr.y*=-1,Gr.z*=-1),g.material.uniforms.envMap.value=U,g.material.uniforms.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(dw.makeRotationFromEuler(Gr)),g.material.toneMapped=At.getTransfer(U.colorSpace)!==Lt,(_!==U||x!==U.version||M!==r.toneMapping)&&(g.material.needsUpdate=!0,_=U,x=U.version,M=r.toneMapping),g.layers.enableAll(),L.unshift(g,g.geometry,g.material,0,0,null)):U&&U.isTexture&&(p===void 0&&(p=new xi(new tc(2,2),new Er({name:"BackgroundMaterial",uniforms:ra(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(p)),p.material.uniforms.t2D.value=U,p.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,p.material.toneMapped=At.getTransfer(U.colorSpace)!==Lt,U.matrixAutoUpdate===!0&&U.updateMatrix(),p.material.uniforms.uvTransform.value.copy(U.matrix),(_!==U||x!==U.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,_=U,x=U.version,M=r.toneMapping),p.layers.enableAll(),L.unshift(p,p.geometry,p.material,0,0,null))}function y(L,N){L.getRGB(Il,mv(r)),s.buffers.color.setClear(Il.r,Il.g,Il.b,N,f)}return{getClearColor:function(){return d},setClearColor:function(L,N=1){d.set(L),m=N,y(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(L){m=L,y(d,m)},render:w,addToRenderList:S}}function hw(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},o=x(null);let l=o,f=!1;function d(A,D,G,B,te){let le=!1;const X=_(B,G,D);l!==X&&(l=X,p(l.object)),le=M(A,B,G,te),le&&E(A,B,G,te),te!==null&&e.update(te,r.ELEMENT_ARRAY_BUFFER),(le||f)&&(f=!1,U(A,D,G,B),te!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function m(){return r.createVertexArray()}function p(A){return r.bindVertexArray(A)}function g(A){return r.deleteVertexArray(A)}function _(A,D,G){const B=G.wireframe===!0;let te=s[A.id];te===void 0&&(te={},s[A.id]=te);let le=te[D.id];le===void 0&&(le={},te[D.id]=le);let X=le[B];return X===void 0&&(X=x(m()),le[B]=X),X}function x(A){const D=[],G=[],B=[];for(let te=0;te<t;te++)D[te]=0,G[te]=0,B[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:G,attributeDivisors:B,object:A,attributes:{},index:null}}function M(A,D,G,B){const te=l.attributes,le=D.attributes;let X=0;const ce=G.getAttributes();for(const j in ce)if(ce[j].location>=0){const Q=te[j];let k=le[j];if(k===void 0&&(j==="instanceMatrix"&&A.instanceMatrix&&(k=A.instanceMatrix),j==="instanceColor"&&A.instanceColor&&(k=A.instanceColor)),Q===void 0||Q.attribute!==k||k&&Q.data!==k.data)return!0;X++}return l.attributesNum!==X||l.index!==B}function E(A,D,G,B){const te={},le=D.attributes;let X=0;const ce=G.getAttributes();for(const j in ce)if(ce[j].location>=0){let Q=le[j];Q===void 0&&(j==="instanceMatrix"&&A.instanceMatrix&&(Q=A.instanceMatrix),j==="instanceColor"&&A.instanceColor&&(Q=A.instanceColor));const k={};k.attribute=Q,Q&&Q.data&&(k.data=Q.data),te[j]=k,X++}l.attributes=te,l.attributesNum=X,l.index=B}function w(){const A=l.newAttributes;for(let D=0,G=A.length;D<G;D++)A[D]=0}function S(A){y(A,0)}function y(A,D){const G=l.newAttributes,B=l.enabledAttributes,te=l.attributeDivisors;G[A]=1,B[A]===0&&(r.enableVertexAttribArray(A),B[A]=1),te[A]!==D&&(r.vertexAttribDivisor(A,D),te[A]=D)}function L(){const A=l.newAttributes,D=l.enabledAttributes;for(let G=0,B=D.length;G<B;G++)D[G]!==A[G]&&(r.disableVertexAttribArray(G),D[G]=0)}function N(A,D,G,B,te,le,X){X===!0?r.vertexAttribIPointer(A,D,G,te,le):r.vertexAttribPointer(A,D,G,B,te,le)}function U(A,D,G,B){w();const te=B.attributes,le=G.getAttributes(),X=D.defaultAttributeValues;for(const ce in le){const j=le[ce];if(j.location>=0){let K=te[ce];if(K===void 0&&(ce==="instanceMatrix"&&A.instanceMatrix&&(K=A.instanceMatrix),ce==="instanceColor"&&A.instanceColor&&(K=A.instanceColor)),K!==void 0){const Q=K.normalized,k=K.itemSize,re=e.get(K);if(re===void 0)continue;const Ue=re.buffer,ne=re.type,pe=re.bytesPerElement,we=ne===r.INT||ne===r.UNSIGNED_INT||K.gpuType===Qg;if(K.isInterleavedBufferAttribute){const _e=K.data,Le=_e.stride,Fe=K.offset;if(_e.isInstancedInterleavedBuffer){for(let Z=0;Z<j.locationSize;Z++)y(j.location+Z,_e.meshPerAttribute);A.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let Z=0;Z<j.locationSize;Z++)S(j.location+Z);r.bindBuffer(r.ARRAY_BUFFER,Ue);for(let Z=0;Z<j.locationSize;Z++)N(j.location+Z,k/j.locationSize,ne,Q,Le*pe,(Fe+k/j.locationSize*Z)*pe,we)}else{if(K.isInstancedBufferAttribute){for(let _e=0;_e<j.locationSize;_e++)y(j.location+_e,K.meshPerAttribute);A.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let _e=0;_e<j.locationSize;_e++)S(j.location+_e);r.bindBuffer(r.ARRAY_BUFFER,Ue);for(let _e=0;_e<j.locationSize;_e++)N(j.location+_e,k/j.locationSize,ne,Q,k*pe,k/j.locationSize*_e*pe,we)}}else if(X!==void 0){const Q=X[ce];if(Q!==void 0)switch(Q.length){case 2:r.vertexAttrib2fv(j.location,Q);break;case 3:r.vertexAttrib3fv(j.location,Q);break;case 4:r.vertexAttrib4fv(j.location,Q);break;default:r.vertexAttrib1fv(j.location,Q)}}}}L()}function Y(){W();for(const A in s){const D=s[A];for(const G in D){const B=D[G];for(const te in B)g(B[te].object),delete B[te];delete D[G]}delete s[A]}}function I(A){if(s[A.id]===void 0)return;const D=s[A.id];for(const G in D){const B=D[G];for(const te in B)g(B[te].object),delete B[te];delete D[G]}delete s[A.id]}function O(A){for(const D in s){const G=s[D];if(G[A.id]===void 0)continue;const B=G[A.id];for(const te in B)g(B[te].object),delete B[te];delete G[A.id]}}function W(){R(),f=!0,l!==o&&(l=o,p(l.object))}function R(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:d,reset:W,resetDefaultState:R,dispose:Y,releaseStatesOfGeometry:I,releaseStatesOfProgram:O,initAttributes:w,enableAttribute:S,disableUnusedAttributes:L}}function pw(r,e,t){let s;function o(p){s=p}function l(p,g){r.drawArrays(s,p,g),t.update(g,s,1)}function f(p,g,_){_!==0&&(r.drawArraysInstanced(s,p,g,_),t.update(g,s,_))}function d(p,g,_){if(_===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let M=0;M<_;M++)this.render(p[M],g[M]);else{x.multiDrawArraysWEBGL(s,p,0,g,0,_);let M=0;for(let E=0;E<_;E++)M+=g[E];t.update(M,s,1)}}function m(p,g,_,x){if(_===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let E=0;E<p.length;E++)f(p[E],g[E],x[E]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,g,0,x,0,_);let E=0;for(let w=0;w<_;w++)E+=g[w];for(let w=0;w<x.length;w++)t.update(E,s,x[w])}}this.setMode=o,this.render=l,this.renderInstances=f,this.renderMultiDraw=d,this.renderMultiDrawInstances=m}function mw(r,e,t,s){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");o=r.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function f(I){return!(I!==_i&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(I){const O=I===Ql&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Mr&&s.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==_r&&!O)}function m(I){if(I==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=t.precision!==void 0?t.precision:"highp";const g=m(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const _=t.logarithmicDepthBuffer===!0,x=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_TEXTURE_SIZE),w=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),S=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),L=r.getParameter(r.MAX_VARYING_VECTORS),N=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),U=M>0,Y=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:m,textureFormatReadable:f,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:_,maxTextures:x,maxVertexTextures:M,maxTextureSize:E,maxCubemapSize:w,maxAttributes:S,maxVertexUniforms:y,maxVaryings:L,maxFragmentUniforms:N,vertexTextures:U,maxSamples:Y}}function gw(r){const e=this;let t=null,s=0,o=!1,l=!1;const f=new $r,d=new ft,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(_,x){const M=_.length!==0||x||s!==0||o;return o=x,s=_.length,M},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(_,x){t=g(_,x,0)},this.setState=function(_,x,M){const E=_.clippingPlanes,w=_.clipIntersection,S=_.clipShadows,y=r.get(_);if(!o||E===null||E.length===0||l&&!S)l?g(null):p();else{const L=l?0:s,N=L*4;let U=y.clippingState||null;m.value=U,U=g(E,x,N,M);for(let Y=0;Y!==N;++Y)U[Y]=t[Y];y.clippingState=U,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=L}};function p(){m.value!==t&&(m.value=t,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(_,x,M,E){const w=_!==null?_.length:0;let S=null;if(w!==0){if(S=m.value,E!==!0||S===null){const y=M+w*4,L=x.matrixWorldInverse;d.getNormalMatrix(L),(S===null||S.length<y)&&(S=new Float32Array(y));for(let N=0,U=M;N!==w;++N,U+=4)f.copy(_[N]).applyMatrix4(L,d),f.normal.toArray(S,U),S[U+3]=f.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function vw(r){let e=new WeakMap;function t(f,d){return d===Ld?f.mapping=ta:d===Dd&&(f.mapping=na),f}function s(f){if(f&&f.isTexture){const d=f.mapping;if(d===Ld||d===Dd)if(e.has(f)){const m=e.get(f).texture;return t(m,f.mapping)}else{const m=f.image;if(m&&m.height>0){const p=new CS(m.height);return p.fromEquirectangularTexture(r,f),e.set(f,p),f.addEventListener("dispose",o),t(p.texture,f.mapping)}else return null}}return f}function o(f){const d=f.target;d.removeEventListener("dispose",o);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function l(){e=new WeakMap}return{get:s,dispose:l}}class xv extends gv{constructor(e=-1,t=1,s=1,o=-1,l=.1,f=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=s,this.bottom=o,this.near=l,this.far=f,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,s,o,l,f){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=s,this.view.offsetY=o,this.view.width=l,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=s-e,f=s+e,d=o+t,m=o-t;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,f=l+p*this.view.width,d-=g*this.view.offsetY,m=d-g*this.view.height}this.projectionMatrix.makeOrthographic(l,f,d,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const qs=4,Jm=[.125,.215,.35,.446,.526,.582],Yr=20,vd=new xv,Qm=new Et;let _d=null,xd=0,yd=0,Sd=!1;const Xr=(1+Math.sqrt(5))/2,Ws=1/Xr,eg=[new ue(-Xr,Ws,0),new ue(Xr,Ws,0),new ue(-Ws,0,Xr),new ue(Ws,0,Xr),new ue(0,Xr,-Ws),new ue(0,Xr,Ws),new ue(-1,1,-1),new ue(1,1,-1),new ue(-1,1,1),new ue(1,1,1)];class tg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,s=.1,o=100){_d=this._renderer.getRenderTarget(),xd=this._renderer.getActiveCubeFace(),yd=this._renderer.getActiveMipmapLevel(),Sd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,s,o,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ig(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_d,xd,yd),this._renderer.xr.enabled=Sd,e.scissorTest=!1,Fl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ta||e.mapping===na?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_d=this._renderer.getRenderTarget(),xd=this._renderer.getActiveCubeFace(),yd=this._renderer.getActiveMipmapLevel(),Sd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=t||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,s={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Ql,format:_i,colorSpace:Tr,depthBuffer:!1},o=ng(e,t,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ng(e,t,s);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_w(l)),this._blurMaterial=xw(l,e,t)}return o}_compileMaterial(e){const t=new xi(this._lodPlanes[0],e);this._renderer.compile(t,vd)}_sceneToCubeUV(e,t,s,o){const d=new qn(90,1,t,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,_=g.autoClear,x=g.toneMapping;g.getClearColor(Qm),g.toneMapping=yr,g.autoClear=!1;const M=new fv({name:"PMREM.Background",side:Nn,depthWrite:!1,depthTest:!1}),E=new xi(new oo,M);let w=!1;const S=e.background;S?S.isColor&&(M.color.copy(S),e.background=null,w=!0):(M.color.copy(Qm),w=!0);for(let y=0;y<6;y++){const L=y%3;L===0?(d.up.set(0,m[y],0),d.lookAt(p[y],0,0)):L===1?(d.up.set(0,0,m[y]),d.lookAt(0,p[y],0)):(d.up.set(0,m[y],0),d.lookAt(0,0,p[y]));const N=this._cubeSize;Fl(o,L*N,y>2?N:0,N,N),g.setRenderTarget(o),w&&g.render(E,d),g.render(e,d)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=x,g.autoClear=_,e.background=S}_textureToCubeUV(e,t){const s=this._renderer,o=e.mapping===ta||e.mapping===na;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=rg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ig());const l=o?this._cubemapMaterial:this._equirectMaterial,f=new xi(this._lodPlanes[0],l),d=l.uniforms;d.envMap.value=e;const m=this._cubeSize;Fl(t,0,0,3*m,2*m),s.setRenderTarget(t),s.render(f,vd)}_applyPMREM(e){const t=this._renderer,s=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let l=1;l<o;l++){const f=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),d=eg[(o-l-1)%eg.length];this._blur(e,l-1,l,f,d)}t.autoClear=s}_blur(e,t,s,o,l){const f=this._pingPongRenderTarget;this._halfBlur(e,f,t,s,o,"latitudinal",l),this._halfBlur(f,e,s,s,o,"longitudinal",l)}_halfBlur(e,t,s,o,l,f,d){const m=this._renderer,p=this._blurMaterial;f!=="latitudinal"&&f!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,_=new xi(this._lodPlanes[o],p),x=p.uniforms,M=this._sizeLods[s]-1,E=isFinite(l)?Math.PI/(2*M):2*Math.PI/(2*Yr-1),w=l/E,S=isFinite(l)?1+Math.floor(g*w):Yr;S>Yr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Yr}`);const y=[];let L=0;for(let O=0;O<Yr;++O){const W=O/w,R=Math.exp(-W*W/2);y.push(R),O===0?L+=R:O<S&&(L+=2*R)}for(let O=0;O<y.length;O++)y[O]=y[O]/L;x.envMap.value=e.texture,x.samples.value=S,x.weights.value=y,x.latitudinal.value=f==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:N}=this;x.dTheta.value=E,x.mipInt.value=N-s;const U=this._sizeLods[o],Y=3*U*(o>N-qs?o-N+qs:0),I=4*(this._cubeSize-U);Fl(t,Y,I,3*U,2*U),m.setRenderTarget(t),m.render(_,vd)}}function _w(r){const e=[],t=[],s=[];let o=r;const l=r-qs+1+Jm.length;for(let f=0;f<l;f++){const d=Math.pow(2,o);t.push(d);let m=1/d;f>r-qs?m=Jm[f-r+qs-1]:f===0&&(m=0),s.push(m);const p=1/(d-2),g=-p,_=1+p,x=[g,g,_,g,_,_,g,g,_,_,g,_],M=6,E=6,w=3,S=2,y=1,L=new Float32Array(w*E*M),N=new Float32Array(S*E*M),U=new Float32Array(y*E*M);for(let I=0;I<M;I++){const O=I%3*2/3-1,W=I>2?0:-1,R=[O,W,0,O+2/3,W,0,O+2/3,W+1,0,O,W,0,O+2/3,W+1,0,O,W+1,0];L.set(R,w*E*I),N.set(x,S*E*I);const A=[I,I,I,I,I,I];U.set(A,y*E*I)}const Y=new Hi;Y.setAttribute("position",new Bn(L,w)),Y.setAttribute("uv",new Bn(N,S)),Y.setAttribute("faceIndex",new Bn(U,y)),e.push(Y),o>qs&&o--}return{lodPlanes:e,sizeLods:t,sigmas:s}}function ng(r,e,t){const s=new ns(r,e,t);return s.texture.mapping=Jl,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Fl(r,e,t,s,o){r.viewport.set(e,t,s,o),r.scissor.set(e,t,s,o)}function xw(r,e,t){const s=new Float32Array(Yr),o=new ue(0,1,0);return new Er({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Qd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function ig(){return new Er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qd(),fragmentShader:`

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
		`,blending:xr,depthTest:!1,depthWrite:!1})}function rg(){return new Er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xr,depthTest:!1,depthWrite:!1})}function Qd(){return`

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
	`}function yw(r){let e=new WeakMap,t=null;function s(d){if(d&&d.isTexture){const m=d.mapping,p=m===Ld||m===Dd,g=m===ta||m===na;if(p||g){let _=e.get(d);const x=_!==void 0?_.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return t===null&&(t=new tg(r)),_=p?t.fromEquirectangular(d,_):t.fromCubemap(d,_),_.texture.pmremVersion=d.pmremVersion,e.set(d,_),_.texture;if(_!==void 0)return _.texture;{const M=d.image;return p&&M&&M.height>0||g&&M&&o(M)?(t===null&&(t=new tg(r)),_=p?t.fromEquirectangular(d):t.fromCubemap(d),_.texture.pmremVersion=d.pmremVersion,e.set(d,_),d.addEventListener("dispose",l),_.texture):null}}}return d}function o(d){let m=0;const p=6;for(let g=0;g<p;g++)d[g]!==void 0&&m++;return m===p}function l(d){const m=d.target;m.removeEventListener("dispose",l);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function f(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:s,dispose:f}}function Sw(r){const e={};function t(s){if(e[s]!==void 0)return e[s];let o;switch(s){case"WEBGL_depth_texture":o=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=r.getExtension(s)}return e[s]=o,o}return{has:function(s){return t(s)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(s){const o=t(s);return o===null&&console.warn("THREE.WebGLRenderer: "+s+" extension not supported."),o}}}function Mw(r,e,t,s){const o={},l=new WeakMap;function f(_){const x=_.target;x.index!==null&&e.remove(x.index);for(const E in x.attributes)e.remove(x.attributes[E]);for(const E in x.morphAttributes){const w=x.morphAttributes[E];for(let S=0,y=w.length;S<y;S++)e.remove(w[S])}x.removeEventListener("dispose",f),delete o[x.id];const M=l.get(x);M&&(e.remove(M),l.delete(x)),s.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,t.memory.geometries--}function d(_,x){return o[x.id]===!0||(x.addEventListener("dispose",f),o[x.id]=!0,t.memory.geometries++),x}function m(_){const x=_.attributes;for(const E in x)e.update(x[E],r.ARRAY_BUFFER);const M=_.morphAttributes;for(const E in M){const w=M[E];for(let S=0,y=w.length;S<y;S++)e.update(w[S],r.ARRAY_BUFFER)}}function p(_){const x=[],M=_.index,E=_.attributes.position;let w=0;if(M!==null){const L=M.array;w=M.version;for(let N=0,U=L.length;N<U;N+=3){const Y=L[N+0],I=L[N+1],O=L[N+2];x.push(Y,I,I,O,O,Y)}}else if(E!==void 0){const L=E.array;w=E.version;for(let N=0,U=L.length/3-1;N<U;N+=3){const Y=N+0,I=N+1,O=N+2;x.push(Y,I,I,O,O,Y)}}else return;const S=new(ov(x)?pv:hv)(x,1);S.version=w;const y=l.get(_);y&&e.remove(y),l.set(_,S)}function g(_){const x=l.get(_);if(x){const M=_.index;M!==null&&x.version<M.version&&p(_)}else p(_);return l.get(_)}return{get:d,update:m,getWireframeAttribute:g}}function Ew(r,e,t){let s;function o(x){s=x}let l,f;function d(x){l=x.type,f=x.bytesPerElement}function m(x,M){r.drawElements(s,M,l,x*f),t.update(M,s,1)}function p(x,M,E){E!==0&&(r.drawElementsInstanced(s,M,l,x*f,E),t.update(M,s,E))}function g(x,M,E){if(E===0)return;const w=e.get("WEBGL_multi_draw");if(w===null)for(let S=0;S<E;S++)this.render(x[S]/f,M[S]);else{w.multiDrawElementsWEBGL(s,M,0,l,x,0,E);let S=0;for(let y=0;y<E;y++)S+=M[y];t.update(S,s,1)}}function _(x,M,E,w){if(E===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let y=0;y<x.length;y++)p(x[y]/f,M[y],w[y]);else{S.multiDrawElementsInstancedWEBGL(s,M,0,l,x,0,w,0,E);let y=0;for(let L=0;L<E;L++)y+=M[L];for(let L=0;L<w.length;L++)t.update(y,s,w[L])}}this.setMode=o,this.setIndex=d,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=_}function ww(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function s(l,f,d){switch(t.calls++,f){case r.TRIANGLES:t.triangles+=d*(l/3);break;case r.LINES:t.lines+=d*(l/2);break;case r.LINE_STRIP:t.lines+=d*(l-1);break;case r.LINE_LOOP:t.lines+=d*l;break;case r.POINTS:t.points+=d*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",f);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:s}}function Tw(r,e,t){const s=new WeakMap,o=new rn;function l(f,d,m){const p=f.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=g!==void 0?g.length:0;let x=s.get(d);if(x===void 0||x.count!==_){let A=function(){W.dispose(),s.delete(d),d.removeEventListener("dispose",A)};var M=A;x!==void 0&&x.texture.dispose();const E=d.morphAttributes.position!==void 0,w=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,y=d.morphAttributes.position||[],L=d.morphAttributes.normal||[],N=d.morphAttributes.color||[];let U=0;E===!0&&(U=1),w===!0&&(U=2),S===!0&&(U=3);let Y=d.attributes.position.count*U,I=1;Y>e.maxTextureSize&&(I=Math.ceil(Y/e.maxTextureSize),Y=e.maxTextureSize);const O=new Float32Array(Y*I*4*_),W=new cv(O,Y,I,_);W.type=_r,W.needsUpdate=!0;const R=U*4;for(let D=0;D<_;D++){const G=y[D],B=L[D],te=N[D],le=Y*I*4*D;for(let X=0;X<G.count;X++){const ce=X*R;E===!0&&(o.fromBufferAttribute(G,X),O[le+ce+0]=o.x,O[le+ce+1]=o.y,O[le+ce+2]=o.z,O[le+ce+3]=0),w===!0&&(o.fromBufferAttribute(B,X),O[le+ce+4]=o.x,O[le+ce+5]=o.y,O[le+ce+6]=o.z,O[le+ce+7]=0),S===!0&&(o.fromBufferAttribute(te,X),O[le+ce+8]=o.x,O[le+ce+9]=o.y,O[le+ce+10]=o.z,O[le+ce+11]=te.itemSize===4?o.w:1)}}x={count:_,texture:W,size:new xt(Y,I)},s.set(d,x),d.addEventListener("dispose",A)}if(f.isInstancedMesh===!0&&f.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",f.morphTexture,t);else{let E=0;for(let S=0;S<p.length;S++)E+=p[S];const w=d.morphTargetsRelative?1:1-E;m.getUniforms().setValue(r,"morphTargetBaseInfluence",w),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",x.texture,t),m.getUniforms().setValue(r,"morphTargetsTextureSize",x.size)}return{update:l}}function Aw(r,e,t,s){let o=new WeakMap;function l(m){const p=s.render.frame,g=m.geometry,_=e.get(m,g);if(o.get(_)!==p&&(e.update(_),o.set(_,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),o.get(m)!==p&&(t.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&t.update(m.instanceColor,r.ARRAY_BUFFER),o.set(m,p))),m.isSkinnedMesh){const x=m.skeleton;o.get(x)!==p&&(x.update(),o.set(x,p))}return _}function f(){o=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:l,dispose:f}}class yv extends Pn{constructor(e,t,s,o,l,f,d,m,p,g){if(g=g!==void 0?g:Zs,g!==Zs&&g!==to)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Zs&&(s=ia),s===void 0&&g===to&&(s=io),super(null,o,l,f,d,m,g,s,p),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=d!==void 0?d:Kn,this.minFilter=m!==void 0?m:Kn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Sv=new Pn,Mv=new yv(1,1);Mv.compareFunction=av;const Ev=new cv,wv=new dS,Tv=new vv,sg=[],ag=[],og=new Float32Array(16),lg=new Float32Array(9),cg=new Float32Array(4);function la(r,e,t){const s=r[0];if(s<=0||s>0)return r;const o=e*t;let l=sg[o];if(l===void 0&&(l=new Float32Array(o),sg[o]=l),e!==0){s.toArray(l,0);for(let f=1,d=0;f!==e;++f)d+=t,r[f].toArray(l,d)}return l}function Yt(r,e){if(r.length!==e.length)return!1;for(let t=0,s=r.length;t<s;t++)if(r[t]!==e[t])return!1;return!0}function Kt(r,e){for(let t=0,s=e.length;t<s;t++)r[t]=e[t]}function nc(r,e){let t=ag[e];t===void 0&&(t=new Int32Array(e),ag[e]=t);for(let s=0;s!==e;++s)t[s]=r.allocateTextureUnit();return t}function bw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Cw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2fv(this.addr,e),Kt(t,e)}}function Rw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;r.uniform3fv(this.addr,e),Kt(t,e)}}function Nw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4fv(this.addr,e),Kt(t,e)}}function Pw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;cg.set(s),r.uniformMatrix2fv(this.addr,!1,cg),Kt(t,s)}}function Lw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;lg.set(s),r.uniformMatrix3fv(this.addr,!1,lg),Kt(t,s)}}function Dw(r,e){const t=this.cache,s=e.elements;if(s===void 0){if(Yt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,s))return;og.set(s),r.uniformMatrix4fv(this.addr,!1,og),Kt(t,s)}}function Uw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Iw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2iv(this.addr,e),Kt(t,e)}}function Fw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3iv(this.addr,e),Kt(t,e)}}function Ow(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4iv(this.addr,e),Kt(t,e)}}function kw(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function zw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;r.uniform2uiv(this.addr,e),Kt(t,e)}}function Bw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;r.uniform3uiv(this.addr,e),Kt(t,e)}}function jw(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;r.uniform4uiv(this.addr,e),Kt(t,e)}}function Hw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o);const l=this.type===r.SAMPLER_2D_SHADOW?Mv:Sv;t.setTexture2D(e||l,o)}function Vw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture3D(e||wv,o)}function Gw(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTextureCube(e||Tv,o)}function Ww(r,e,t){const s=this.cache,o=t.allocateTextureUnit();s[0]!==o&&(r.uniform1i(this.addr,o),s[0]=o),t.setTexture2DArray(e||Ev,o)}function $w(r){switch(r){case 5126:return bw;case 35664:return Cw;case 35665:return Rw;case 35666:return Nw;case 35674:return Pw;case 35675:return Lw;case 35676:return Dw;case 5124:case 35670:return Uw;case 35667:case 35671:return Iw;case 35668:case 35672:return Fw;case 35669:case 35673:return Ow;case 5125:return kw;case 36294:return zw;case 36295:return Bw;case 36296:return jw;case 35678:case 36198:case 36298:case 36306:case 35682:return Hw;case 35679:case 36299:case 36307:return Vw;case 35680:case 36300:case 36308:case 36293:return Gw;case 36289:case 36303:case 36311:case 36292:return Ww}}function Xw(r,e){r.uniform1fv(this.addr,e)}function qw(r,e){const t=la(e,this.size,2);r.uniform2fv(this.addr,t)}function Yw(r,e){const t=la(e,this.size,3);r.uniform3fv(this.addr,t)}function Kw(r,e){const t=la(e,this.size,4);r.uniform4fv(this.addr,t)}function Zw(r,e){const t=la(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Jw(r,e){const t=la(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Qw(r,e){const t=la(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function eT(r,e){r.uniform1iv(this.addr,e)}function tT(r,e){r.uniform2iv(this.addr,e)}function nT(r,e){r.uniform3iv(this.addr,e)}function iT(r,e){r.uniform4iv(this.addr,e)}function rT(r,e){r.uniform1uiv(this.addr,e)}function sT(r,e){r.uniform2uiv(this.addr,e)}function aT(r,e){r.uniform3uiv(this.addr,e)}function oT(r,e){r.uniform4uiv(this.addr,e)}function lT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let f=0;f!==o;++f)t.setTexture2D(e[f]||Sv,l[f])}function cT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let f=0;f!==o;++f)t.setTexture3D(e[f]||wv,l[f])}function uT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let f=0;f!==o;++f)t.setTextureCube(e[f]||Tv,l[f])}function dT(r,e,t){const s=this.cache,o=e.length,l=nc(t,o);Yt(s,l)||(r.uniform1iv(this.addr,l),Kt(s,l));for(let f=0;f!==o;++f)t.setTexture2DArray(e[f]||Ev,l[f])}function fT(r){switch(r){case 5126:return Xw;case 35664:return qw;case 35665:return Yw;case 35666:return Kw;case 35674:return Zw;case 35675:return Jw;case 35676:return Qw;case 5124:case 35670:return eT;case 35667:case 35671:return tT;case 35668:case 35672:return nT;case 35669:case 35673:return iT;case 5125:return rT;case 36294:return sT;case 36295:return aT;case 36296:return oT;case 35678:case 36198:case 36298:case 36306:case 35682:return lT;case 35679:case 36299:case 36307:return cT;case 35680:case 36300:case 36308:case 36293:return uT;case 36289:case 36303:case 36311:case 36292:return dT}}class hT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.setValue=$w(t.type)}}class pT{constructor(e,t,s){this.id=e,this.addr=s,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=fT(t.type)}}class mT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,s){const o=this.seq;for(let l=0,f=o.length;l!==f;++l){const d=o[l];d.setValue(e,t[d.id],s)}}}const Md=/(\w+)(\])?(\[|\.)?/g;function ug(r,e){r.seq.push(e),r.map[e.id]=e}function gT(r,e,t){const s=r.name,o=s.length;for(Md.lastIndex=0;;){const l=Md.exec(s),f=Md.lastIndex;let d=l[1];const m=l[2]==="]",p=l[3];if(m&&(d=d|0),p===void 0||p==="["&&f+2===o){ug(t,p===void 0?new hT(d,r,e):new pT(d,r,e));break}else{let _=t.map[d];_===void 0&&(_=new mT(d),ug(t,_)),t=_}}}class Ol{constructor(e,t){this.seq=[],this.map={};const s=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<s;++o){const l=e.getActiveUniform(t,o),f=e.getUniformLocation(t,l.name);gT(l,f,this)}}setValue(e,t,s,o){const l=this.map[t];l!==void 0&&l.setValue(e,s,o)}setOptional(e,t,s){const o=t[s];o!==void 0&&this.setValue(e,s,o)}static upload(e,t,s,o){for(let l=0,f=t.length;l!==f;++l){const d=t[l],m=s[d.id];m.needsUpdate!==!1&&d.setValue(e,m.value,o)}}static seqWithValue(e,t){const s=[];for(let o=0,l=e.length;o!==l;++o){const f=e[o];f.id in t&&s.push(f)}return s}}function dg(r,e,t){const s=r.createShader(e);return r.shaderSource(s,t),r.compileShader(s),s}const vT=37297;let _T=0;function xT(r,e){const t=r.split(`
`),s=[],o=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let f=o;f<l;f++){const d=f+1;s.push(`${d===e?">":" "} ${d}: ${t[f]}`)}return s.join(`
`)}function yT(r){const e=At.getPrimaries(At.workingColorSpace),t=At.getPrimaries(r);let s;switch(e===t?s="":e===$l&&t===Wl?s="LinearDisplayP3ToLinearSRGB":e===Wl&&t===$l&&(s="LinearSRGBToLinearDisplayP3"),r){case Tr:case ec:return[s,"LinearTransferOETF"];case pi:case Kd:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[s,"LinearTransferOETF"]}}function fg(r,e,t){const s=r.getShaderParameter(e,r.COMPILE_STATUS),o=r.getShaderInfoLog(e).trim();if(s&&o==="")return"";const l=/ERROR: 0:(\d+)/.exec(o);if(l){const f=parseInt(l[1]);return t.toUpperCase()+`

`+o+`

`+xT(r.getShaderSource(e),f)}else return o}function ST(r,e){const t=yT(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function MT(r,e){let t;switch(e){case Ry:t="Linear";break;case Ny:t="Reinhard";break;case Py:t="OptimizedCineon";break;case Ly:t="ACESFilmic";break;case Uy:t="AgX";break;case Iy:t="Neutral";break;case Dy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function ET(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Za).join(`
`)}function wT(r){const e=[];for(const t in r){const s=r[t];s!==!1&&e.push("#define "+t+" "+s)}return e.join(`
`)}function TT(r,e){const t={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let o=0;o<s;o++){const l=r.getActiveAttrib(e,o),f=l.name;let d=1;l.type===r.FLOAT_MAT2&&(d=2),l.type===r.FLOAT_MAT3&&(d=3),l.type===r.FLOAT_MAT4&&(d=4),t[f]={type:l.type,location:r.getAttribLocation(e,f),locationSize:d}}return t}function Za(r){return r!==""}function hg(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pg(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const AT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Od(r){return r.replace(AT,CT)}const bT=new Map;function CT(r,e){let t=dt[e];if(t===void 0){const s=bT.get(e);if(s!==void 0)t=dt[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Od(t)}const RT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mg(r){return r.replace(RT,NT)}function NT(r,e,t,s){let o="";for(let l=parseInt(e);l<parseInt(t);l++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function gg(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function PT(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Yg?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===ty?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function LT(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case ta:case na:e="ENVMAP_TYPE_CUBE";break;case Jl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function DT(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case na:e="ENVMAP_MODE_REFRACTION";break}return e}function UT(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Kg:e="ENVMAP_BLENDING_MULTIPLY";break;case by:e="ENVMAP_BLENDING_MIX";break;case Cy:e="ENVMAP_BLENDING_ADD";break}return e}function IT(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:s,maxMip:t}}function FT(r,e,t,s){const o=r.getContext(),l=t.defines;let f=t.vertexShader,d=t.fragmentShader;const m=PT(t),p=LT(t),g=DT(t),_=UT(t),x=IT(t),M=ET(t),E=wT(l),w=o.createProgram();let S,y,L=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Za).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Za).join(`
`),y.length>0&&(y+=`
`)):(S=[gg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+g:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Za).join(`
`),y=[gg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",t.envMap?"#define "+_:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+m:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yr?"#define TONE_MAPPING":"",t.toneMapping!==yr?dt.tonemapping_pars_fragment:"",t.toneMapping!==yr?MT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,ST("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Za).join(`
`)),f=Od(f),f=hg(f,t),f=pg(f,t),d=Od(d),d=hg(d,t),d=pg(d,t),f=mg(f),d=mg(d),t.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",t.glslVersion===Lm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const N=L+S+f,U=L+y+d,Y=dg(o,o.VERTEX_SHADER,N),I=dg(o,o.FRAGMENT_SHADER,U);o.attachShader(w,Y),o.attachShader(w,I),t.index0AttributeName!==void 0?o.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function O(D){if(r.debug.checkShaderErrors){const G=o.getProgramInfoLog(w).trim(),B=o.getShaderInfoLog(Y).trim(),te=o.getShaderInfoLog(I).trim();let le=!0,X=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(le=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(o,w,Y,I);else{const ce=fg(o,Y,"vertex"),j=fg(o,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+G+`
`+ce+`
`+j)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(B===""||te==="")&&(X=!1);X&&(D.diagnostics={runnable:le,programLog:G,vertexShader:{log:B,prefix:S},fragmentShader:{log:te,prefix:y}})}o.deleteShader(Y),o.deleteShader(I),W=new Ol(o,w),R=TT(o,w)}let W;this.getUniforms=function(){return W===void 0&&O(this),W};let R;this.getAttributes=function(){return R===void 0&&O(this),R};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=o.getProgramParameter(w,vT)),A},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_T++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=Y,this.fragmentShader=I,this}let OT=0;class kT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,s=e.fragmentShader,o=this._getShaderStage(t),l=this._getShaderStage(s),f=this._getShaderCacheForMaterial(e);return f.has(o)===!1&&(f.add(o),o.usedTimes++),f.has(l)===!1&&(f.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const s of t)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let s=t.get(e);return s===void 0&&(s=new Set,t.set(e,s)),s}_getShaderStage(e){const t=this.shaderCache;let s=t.get(e);return s===void 0&&(s=new zT(e),t.set(e,s)),s}}class zT{constructor(e){this.id=OT++,this.code=e,this.usedTimes=0}}function BT(r,e,t,s,o,l,f){const d=new uv,m=new kT,p=new Set,g=[],_=o.logarithmicDepthBuffer,x=o.vertexTextures;let M=o.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(R){return p.add(R),R===0?"uv":`uv${R}`}function S(R,A,D,G,B){const te=G.fog,le=B.geometry,X=R.isMeshStandardMaterial?G.environment:null,ce=(R.isMeshStandardMaterial?t:e).get(R.envMap||X),j=ce&&ce.mapping===Jl?ce.image.height:null,K=E[R.type];R.precision!==null&&(M=o.getMaxPrecision(R.precision),M!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",M,"instead."));const Q=le.morphAttributes.position||le.morphAttributes.normal||le.morphAttributes.color,k=Q!==void 0?Q.length:0;let re=0;le.morphAttributes.position!==void 0&&(re=1),le.morphAttributes.normal!==void 0&&(re=2),le.morphAttributes.color!==void 0&&(re=3);let Ue,ne,pe,we;if(K){const St=mi[K];Ue=St.vertexShader,ne=St.fragmentShader}else Ue=R.vertexShader,ne=R.fragmentShader,m.update(R),pe=m.getVertexShaderID(R),we=m.getFragmentShaderID(R);const _e=r.getRenderTarget(),Le=B.isInstancedMesh===!0,Fe=B.isBatchedMesh===!0,Z=!!R.map,gt=!!R.matcap,be=!!ce,nt=!!R.aoMap,Xe=!!R.lightMap,lt=!!R.bumpMap,it=!!R.normalMap,ot=!!R.displacementMap,Tt=!!R.emissiveMap,z=!!R.metalnessMap,C=!!R.roughnessMap,de=R.anisotropy>0,ge=R.clearcoat>0,Se=R.dispersion>0,Me=R.iridescence>0,We=R.sheen>0,Re=R.transmission>0,Ce=de&&!!R.anisotropyMap,tt=ge&&!!R.clearcoatMap,Ae=ge&&!!R.clearcoatNormalMap,He=ge&&!!R.clearcoatRoughnessMap,ct=Me&&!!R.iridescenceMap,qe=Me&&!!R.iridescenceThicknessMap,Ie=We&&!!R.sheenColorMap,st=We&&!!R.sheenRoughnessMap,ht=!!R.specularMap,bt=!!R.specularColorMap,rt=!!R.specularIntensityMap,b=Re&&!!R.transmissionMap,H=Re&&!!R.thicknessMap,q=!!R.gradientMap,he=!!R.alphaMap,ve=R.alphaTest>0,Ye=!!R.alphaHash,$e=!!R.extensions;let pt=yr;R.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(pt=r.toneMapping);const Vt={shaderID:K,shaderType:R.type,shaderName:R.name,vertexShader:Ue,fragmentShader:ne,defines:R.defines,customVertexShaderID:pe,customFragmentShaderID:we,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:M,batching:Fe,instancing:Le,instancingColor:Le&&B.instanceColor!==null,instancingMorph:Le&&B.morphTexture!==null,supportsVertexTextures:x,outputColorSpace:_e===null?r.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:Tr,alphaToCoverage:!!R.alphaToCoverage,map:Z,matcap:gt,envMap:be,envMapMode:be&&ce.mapping,envMapCubeUVHeight:j,aoMap:nt,lightMap:Xe,bumpMap:lt,normalMap:it,displacementMap:x&&ot,emissiveMap:Tt,normalMapObjectSpace:it&&R.normalMapType===Yy,normalMapTangentSpace:it&&R.normalMapType===sv,metalnessMap:z,roughnessMap:C,anisotropy:de,anisotropyMap:Ce,clearcoat:ge,clearcoatMap:tt,clearcoatNormalMap:Ae,clearcoatRoughnessMap:He,dispersion:Se,iridescence:Me,iridescenceMap:ct,iridescenceThicknessMap:qe,sheen:We,sheenColorMap:Ie,sheenRoughnessMap:st,specularMap:ht,specularColorMap:bt,specularIntensityMap:rt,transmission:Re,transmissionMap:b,thicknessMap:H,gradientMap:q,opaque:R.transparent===!1&&R.blending===Ks&&R.alphaToCoverage===!1,alphaMap:he,alphaTest:ve,alphaHash:Ye,combine:R.combine,mapUv:Z&&w(R.map.channel),aoMapUv:nt&&w(R.aoMap.channel),lightMapUv:Xe&&w(R.lightMap.channel),bumpMapUv:lt&&w(R.bumpMap.channel),normalMapUv:it&&w(R.normalMap.channel),displacementMapUv:ot&&w(R.displacementMap.channel),emissiveMapUv:Tt&&w(R.emissiveMap.channel),metalnessMapUv:z&&w(R.metalnessMap.channel),roughnessMapUv:C&&w(R.roughnessMap.channel),anisotropyMapUv:Ce&&w(R.anisotropyMap.channel),clearcoatMapUv:tt&&w(R.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&w(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:He&&w(R.clearcoatRoughnessMap.channel),iridescenceMapUv:ct&&w(R.iridescenceMap.channel),iridescenceThicknessMapUv:qe&&w(R.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&w(R.sheenColorMap.channel),sheenRoughnessMapUv:st&&w(R.sheenRoughnessMap.channel),specularMapUv:ht&&w(R.specularMap.channel),specularColorMapUv:bt&&w(R.specularColorMap.channel),specularIntensityMapUv:rt&&w(R.specularIntensityMap.channel),transmissionMapUv:b&&w(R.transmissionMap.channel),thicknessMapUv:H&&w(R.thicknessMap.channel),alphaMapUv:he&&w(R.alphaMap.channel),vertexTangents:!!le.attributes.tangent&&(it||de),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!le.attributes.color&&le.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!le.attributes.uv&&(Z||he),fog:!!te,useFog:R.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:_,skinning:B.isSkinnedMesh===!0,morphTargets:le.morphAttributes.position!==void 0,morphNormals:le.morphAttributes.normal!==void 0,morphColors:le.morphAttributes.color!==void 0,morphTargetsCount:k,morphTextureStride:re,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:f.numPlanes,numClipIntersection:f.numIntersection,dithering:R.dithering,shadowMapEnabled:r.shadowMap.enabled&&D.length>0,shadowMapType:r.shadowMap.type,toneMapping:pt,useLegacyLights:r._useLegacyLights,decodeVideoTexture:Z&&R.map.isVideoTexture===!0&&At.getTransfer(R.map.colorSpace)===Lt,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===gi,flipSided:R.side===Nn,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:$e&&R.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:$e&&R.extensions.multiDraw===!0&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return Vt.vertexUv1s=p.has(1),Vt.vertexUv2s=p.has(2),Vt.vertexUv3s=p.has(3),p.clear(),Vt}function y(R){const A=[];if(R.shaderID?A.push(R.shaderID):(A.push(R.customVertexShaderID),A.push(R.customFragmentShaderID)),R.defines!==void 0)for(const D in R.defines)A.push(D),A.push(R.defines[D]);return R.isRawShaderMaterial===!1&&(L(A,R),N(A,R),A.push(r.outputColorSpace)),A.push(R.customProgramCacheKey),A.join()}function L(R,A){R.push(A.precision),R.push(A.outputColorSpace),R.push(A.envMapMode),R.push(A.envMapCubeUVHeight),R.push(A.mapUv),R.push(A.alphaMapUv),R.push(A.lightMapUv),R.push(A.aoMapUv),R.push(A.bumpMapUv),R.push(A.normalMapUv),R.push(A.displacementMapUv),R.push(A.emissiveMapUv),R.push(A.metalnessMapUv),R.push(A.roughnessMapUv),R.push(A.anisotropyMapUv),R.push(A.clearcoatMapUv),R.push(A.clearcoatNormalMapUv),R.push(A.clearcoatRoughnessMapUv),R.push(A.iridescenceMapUv),R.push(A.iridescenceThicknessMapUv),R.push(A.sheenColorMapUv),R.push(A.sheenRoughnessMapUv),R.push(A.specularMapUv),R.push(A.specularColorMapUv),R.push(A.specularIntensityMapUv),R.push(A.transmissionMapUv),R.push(A.thicknessMapUv),R.push(A.combine),R.push(A.fogExp2),R.push(A.sizeAttenuation),R.push(A.morphTargetsCount),R.push(A.morphAttributeCount),R.push(A.numDirLights),R.push(A.numPointLights),R.push(A.numSpotLights),R.push(A.numSpotLightMaps),R.push(A.numHemiLights),R.push(A.numRectAreaLights),R.push(A.numDirLightShadows),R.push(A.numPointLightShadows),R.push(A.numSpotLightShadows),R.push(A.numSpotLightShadowsWithMaps),R.push(A.numLightProbes),R.push(A.shadowMapType),R.push(A.toneMapping),R.push(A.numClippingPlanes),R.push(A.numClipIntersection),R.push(A.depthPacking)}function N(R,A){d.disableAll(),A.supportsVertexTextures&&d.enable(0),A.instancing&&d.enable(1),A.instancingColor&&d.enable(2),A.instancingMorph&&d.enable(3),A.matcap&&d.enable(4),A.envMap&&d.enable(5),A.normalMapObjectSpace&&d.enable(6),A.normalMapTangentSpace&&d.enable(7),A.clearcoat&&d.enable(8),A.iridescence&&d.enable(9),A.alphaTest&&d.enable(10),A.vertexColors&&d.enable(11),A.vertexAlphas&&d.enable(12),A.vertexUv1s&&d.enable(13),A.vertexUv2s&&d.enable(14),A.vertexUv3s&&d.enable(15),A.vertexTangents&&d.enable(16),A.anisotropy&&d.enable(17),A.alphaHash&&d.enable(18),A.batching&&d.enable(19),A.dispersion&&d.enable(20),R.push(d.mask),d.disableAll(),A.fog&&d.enable(0),A.useFog&&d.enable(1),A.flatShading&&d.enable(2),A.logarithmicDepthBuffer&&d.enable(3),A.skinning&&d.enable(4),A.morphTargets&&d.enable(5),A.morphNormals&&d.enable(6),A.morphColors&&d.enable(7),A.premultipliedAlpha&&d.enable(8),A.shadowMapEnabled&&d.enable(9),A.useLegacyLights&&d.enable(10),A.doubleSided&&d.enable(11),A.flipSided&&d.enable(12),A.useDepthPacking&&d.enable(13),A.dithering&&d.enable(14),A.transmission&&d.enable(15),A.sheen&&d.enable(16),A.opaque&&d.enable(17),A.pointsUvs&&d.enable(18),A.decodeVideoTexture&&d.enable(19),A.alphaToCoverage&&d.enable(20),R.push(d.mask)}function U(R){const A=E[R.type];let D;if(A){const G=mi[A];D=wS.clone(G.uniforms)}else D=R.uniforms;return D}function Y(R,A){let D;for(let G=0,B=g.length;G<B;G++){const te=g[G];if(te.cacheKey===A){D=te,++D.usedTimes;break}}return D===void 0&&(D=new FT(r,A,R,l),g.push(D)),D}function I(R){if(--R.usedTimes===0){const A=g.indexOf(R);g[A]=g[g.length-1],g.pop(),R.destroy()}}function O(R){m.remove(R)}function W(){m.dispose()}return{getParameters:S,getProgramCacheKey:y,getUniforms:U,acquireProgram:Y,releaseProgram:I,releaseShaderCache:O,programs:g,dispose:W}}function jT(){let r=new WeakMap;function e(l){let f=r.get(l);return f===void 0&&(f={},r.set(l,f)),f}function t(l){r.delete(l)}function s(l,f,d){r.get(l)[f]=d}function o(){r=new WeakMap}return{get:e,remove:t,update:s,dispose:o}}function HT(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function vg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function _g(){const r=[];let e=0;const t=[],s=[],o=[];function l(){e=0,t.length=0,s.length=0,o.length=0}function f(_,x,M,E,w,S){let y=r[e];return y===void 0?(y={id:_.id,object:_,geometry:x,material:M,groupOrder:E,renderOrder:_.renderOrder,z:w,group:S},r[e]=y):(y.id=_.id,y.object=_,y.geometry=x,y.material=M,y.groupOrder=E,y.renderOrder=_.renderOrder,y.z=w,y.group=S),e++,y}function d(_,x,M,E,w,S){const y=f(_,x,M,E,w,S);M.transmission>0?s.push(y):M.transparent===!0?o.push(y):t.push(y)}function m(_,x,M,E,w,S){const y=f(_,x,M,E,w,S);M.transmission>0?s.unshift(y):M.transparent===!0?o.unshift(y):t.unshift(y)}function p(_,x){t.length>1&&t.sort(_||HT),s.length>1&&s.sort(x||vg),o.length>1&&o.sort(x||vg)}function g(){for(let _=e,x=r.length;_<x;_++){const M=r[_];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:s,transparent:o,init:l,push:d,unshift:m,finish:g,sort:p}}function VT(){let r=new WeakMap;function e(s,o){const l=r.get(s);let f;return l===void 0?(f=new _g,r.set(s,[f])):o>=l.length?(f=new _g,l.push(f)):f=l[o],f}function t(){r=new WeakMap}return{get:e,dispose:t}}function GT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new ue,color:new Et};break;case"SpotLight":t={position:new ue,direction:new ue,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new ue,color:new Et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new ue,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":t={color:new Et,position:new ue,halfWidth:new ue,halfHeight:new ue};break}return r[e.id]=t,t}}}function WT(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let $T=0;function XT(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function qT(r){const e=new GT,t=WT(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new ue);const o=new ue,l=new Bt,f=new Bt;function d(p,g){let _=0,x=0,M=0;for(let D=0;D<9;D++)s.probe[D].set(0,0,0);let E=0,w=0,S=0,y=0,L=0,N=0,U=0,Y=0,I=0,O=0,W=0;p.sort(XT);const R=g===!0?Math.PI:1;for(let D=0,G=p.length;D<G;D++){const B=p[D],te=B.color,le=B.intensity,X=B.distance,ce=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)_+=te.r*le*R,x+=te.g*le*R,M+=te.b*le*R;else if(B.isLightProbe){for(let j=0;j<9;j++)s.probe[j].addScaledVector(B.sh.coefficients[j],le);W++}else if(B.isDirectionalLight){const j=e.get(B);if(j.color.copy(B.color).multiplyScalar(B.intensity*R),B.castShadow){const K=B.shadow,Q=t.get(B);Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize=K.mapSize,s.directionalShadow[E]=Q,s.directionalShadowMap[E]=ce,s.directionalShadowMatrix[E]=B.shadow.matrix,N++}s.directional[E]=j,E++}else if(B.isSpotLight){const j=e.get(B);j.position.setFromMatrixPosition(B.matrixWorld),j.color.copy(te).multiplyScalar(le*R),j.distance=X,j.coneCos=Math.cos(B.angle),j.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),j.decay=B.decay,s.spot[S]=j;const K=B.shadow;if(B.map&&(s.spotLightMap[I]=B.map,I++,K.updateMatrices(B),B.castShadow&&O++),s.spotLightMatrix[S]=K.matrix,B.castShadow){const Q=t.get(B);Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize=K.mapSize,s.spotShadow[S]=Q,s.spotShadowMap[S]=ce,Y++}S++}else if(B.isRectAreaLight){const j=e.get(B);j.color.copy(te).multiplyScalar(le),j.halfWidth.set(B.width*.5,0,0),j.halfHeight.set(0,B.height*.5,0),s.rectArea[y]=j,y++}else if(B.isPointLight){const j=e.get(B);if(j.color.copy(B.color).multiplyScalar(B.intensity*R),j.distance=B.distance,j.decay=B.decay,B.castShadow){const K=B.shadow,Q=t.get(B);Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize=K.mapSize,Q.shadowCameraNear=K.camera.near,Q.shadowCameraFar=K.camera.far,s.pointShadow[w]=Q,s.pointShadowMap[w]=ce,s.pointShadowMatrix[w]=B.shadow.matrix,U++}s.point[w]=j,w++}else if(B.isHemisphereLight){const j=e.get(B);j.skyColor.copy(B.color).multiplyScalar(le*R),j.groundColor.copy(B.groundColor).multiplyScalar(le*R),s.hemi[L]=j,L++}}y>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Pe.LTC_FLOAT_1,s.rectAreaLTC2=Pe.LTC_FLOAT_2):(s.rectAreaLTC1=Pe.LTC_HALF_1,s.rectAreaLTC2=Pe.LTC_HALF_2)),s.ambient[0]=_,s.ambient[1]=x,s.ambient[2]=M;const A=s.hash;(A.directionalLength!==E||A.pointLength!==w||A.spotLength!==S||A.rectAreaLength!==y||A.hemiLength!==L||A.numDirectionalShadows!==N||A.numPointShadows!==U||A.numSpotShadows!==Y||A.numSpotMaps!==I||A.numLightProbes!==W)&&(s.directional.length=E,s.spot.length=S,s.rectArea.length=y,s.point.length=w,s.hemi.length=L,s.directionalShadow.length=N,s.directionalShadowMap.length=N,s.pointShadow.length=U,s.pointShadowMap.length=U,s.spotShadow.length=Y,s.spotShadowMap.length=Y,s.directionalShadowMatrix.length=N,s.pointShadowMatrix.length=U,s.spotLightMatrix.length=Y+I-O,s.spotLightMap.length=I,s.numSpotLightShadowsWithMaps=O,s.numLightProbes=W,A.directionalLength=E,A.pointLength=w,A.spotLength=S,A.rectAreaLength=y,A.hemiLength=L,A.numDirectionalShadows=N,A.numPointShadows=U,A.numSpotShadows=Y,A.numSpotMaps=I,A.numLightProbes=W,s.version=$T++)}function m(p,g){let _=0,x=0,M=0,E=0,w=0;const S=g.matrixWorldInverse;for(let y=0,L=p.length;y<L;y++){const N=p[y];if(N.isDirectionalLight){const U=s.directional[_];U.direction.setFromMatrixPosition(N.matrixWorld),o.setFromMatrixPosition(N.target.matrixWorld),U.direction.sub(o),U.direction.transformDirection(S),_++}else if(N.isSpotLight){const U=s.spot[M];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),U.direction.setFromMatrixPosition(N.matrixWorld),o.setFromMatrixPosition(N.target.matrixWorld),U.direction.sub(o),U.direction.transformDirection(S),M++}else if(N.isRectAreaLight){const U=s.rectArea[E];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),f.identity(),l.copy(N.matrixWorld),l.premultiply(S),f.extractRotation(l),U.halfWidth.set(N.width*.5,0,0),U.halfHeight.set(0,N.height*.5,0),U.halfWidth.applyMatrix4(f),U.halfHeight.applyMatrix4(f),E++}else if(N.isPointLight){const U=s.point[x];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),x++}else if(N.isHemisphereLight){const U=s.hemi[w];U.direction.setFromMatrixPosition(N.matrixWorld),U.direction.transformDirection(S),w++}}}return{setup:d,setupView:m,state:s}}function xg(r){const e=new qT(r),t=[],s=[];function o(g){p.camera=g,t.length=0,s.length=0}function l(g){t.push(g)}function f(g){s.push(g)}function d(g){e.setup(t,g)}function m(g){e.setupView(t,g)}const p={lightsArray:t,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:p,setupLights:d,setupLightsView:m,pushLight:l,pushShadow:f}}function YT(r){let e=new WeakMap;function t(o,l=0){const f=e.get(o);let d;return f===void 0?(d=new xg(r),e.set(o,[d])):l>=f.length?(d=new xg(r),f.push(d)):d=f[l],d}function s(){e=new WeakMap}return{get:t,dispose:s}}class KT extends ao{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ZT extends ao{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const JT=`void main() {
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
}`;function e1(r,e,t){let s=new Jd;const o=new xt,l=new xt,f=new rn,d=new KT({depthPacking:qy}),m=new ZT,p={},g=t.maxTextureSize,_={[Sr]:Nn,[Nn]:Sr,[gi]:gi},x=new Er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:JT,fragmentShader:QT}),M=x.clone();M.defines.HORIZONTAL_PASS=1;const E=new Hi;E.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new xi(E,x),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yg;let y=this.type;this.render=function(I,O,W){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||I.length===0)return;const R=r.getRenderTarget(),A=r.getActiveCubeFace(),D=r.getActiveMipmapLevel(),G=r.state;G.setBlending(xr),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const B=y!==ki&&this.type===ki,te=y===ki&&this.type!==ki;for(let le=0,X=I.length;le<X;le++){const ce=I[le],j=ce.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;o.copy(j.mapSize);const K=j.getFrameExtents();if(o.multiply(K),l.copy(j.mapSize),(o.x>g||o.y>g)&&(o.x>g&&(l.x=Math.floor(g/K.x),o.x=l.x*K.x,j.mapSize.x=l.x),o.y>g&&(l.y=Math.floor(g/K.y),o.y=l.y*K.y,j.mapSize.y=l.y)),j.map===null||B===!0||te===!0){const k=this.type!==ki?{minFilter:Kn,magFilter:Kn}:{};j.map!==null&&j.map.dispose(),j.map=new ns(o.x,o.y,k),j.map.texture.name=ce.name+".shadowMap",j.camera.updateProjectionMatrix()}r.setRenderTarget(j.map),r.clear();const Q=j.getViewportCount();for(let k=0;k<Q;k++){const re=j.getViewport(k);f.set(l.x*re.x,l.y*re.y,l.x*re.z,l.y*re.w),G.viewport(f),j.updateMatrices(ce,k),s=j.getFrustum(),U(O,W,j.camera,ce,this.type)}j.isPointLightShadow!==!0&&this.type===ki&&L(j,W),j.needsUpdate=!1}y=this.type,S.needsUpdate=!1,r.setRenderTarget(R,A,D)};function L(I,O){const W=e.update(w);x.defines.VSM_SAMPLES!==I.blurSamples&&(x.defines.VSM_SAMPLES=I.blurSamples,M.defines.VSM_SAMPLES=I.blurSamples,x.needsUpdate=!0,M.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new ns(o.x,o.y)),x.uniforms.shadow_pass.value=I.map.texture,x.uniforms.resolution.value=I.mapSize,x.uniforms.radius.value=I.radius,r.setRenderTarget(I.mapPass),r.clear(),r.renderBufferDirect(O,null,W,x,w,null),M.uniforms.shadow_pass.value=I.mapPass.texture,M.uniforms.resolution.value=I.mapSize,M.uniforms.radius.value=I.radius,r.setRenderTarget(I.map),r.clear(),r.renderBufferDirect(O,null,W,M,w,null)}function N(I,O,W,R){let A=null;const D=W.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(D!==void 0)A=D;else if(A=W.isPointLight===!0?m:d,r.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0){const G=A.uuid,B=O.uuid;let te=p[G];te===void 0&&(te={},p[G]=te);let le=te[B];le===void 0&&(le=A.clone(),te[B]=le,O.addEventListener("dispose",Y)),A=le}if(A.visible=O.visible,A.wireframe=O.wireframe,R===ki?A.side=O.shadowSide!==null?O.shadowSide:O.side:A.side=O.shadowSide!==null?O.shadowSide:_[O.side],A.alphaMap=O.alphaMap,A.alphaTest=O.alphaTest,A.map=O.map,A.clipShadows=O.clipShadows,A.clippingPlanes=O.clippingPlanes,A.clipIntersection=O.clipIntersection,A.displacementMap=O.displacementMap,A.displacementScale=O.displacementScale,A.displacementBias=O.displacementBias,A.wireframeLinewidth=O.wireframeLinewidth,A.linewidth=O.linewidth,W.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const G=r.properties.get(A);G.light=W}return A}function U(I,O,W,R,A){if(I.visible===!1)return;if(I.layers.test(O.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&A===ki)&&(!I.frustumCulled||s.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,I.matrixWorld);const B=e.update(I),te=I.material;if(Array.isArray(te)){const le=B.groups;for(let X=0,ce=le.length;X<ce;X++){const j=le[X],K=te[j.materialIndex];if(K&&K.visible){const Q=N(I,K,R,A);I.onBeforeShadow(r,I,O,W,B,Q,j),r.renderBufferDirect(W,null,B,Q,I,j),I.onAfterShadow(r,I,O,W,B,Q,j)}}}else if(te.visible){const le=N(I,te,R,A);I.onBeforeShadow(r,I,O,W,B,le,null),r.renderBufferDirect(W,null,B,le,I,null),I.onAfterShadow(r,I,O,W,B,le,null)}}const G=I.children;for(let B=0,te=G.length;B<te;B++)U(G[B],O,W,R,A)}function Y(I){I.target.removeEventListener("dispose",Y);for(const W in p){const R=p[W],A=I.target.uuid;A in R&&(R[A].dispose(),delete R[A])}}}function t1(r){function e(){let b=!1;const H=new rn;let q=null;const he=new rn(0,0,0,0);return{setMask:function(ve){q!==ve&&!b&&(r.colorMask(ve,ve,ve,ve),q=ve)},setLocked:function(ve){b=ve},setClear:function(ve,Ye,$e,pt,Vt){Vt===!0&&(ve*=pt,Ye*=pt,$e*=pt),H.set(ve,Ye,$e,pt),he.equals(H)===!1&&(r.clearColor(ve,Ye,$e,pt),he.copy(H))},reset:function(){b=!1,q=null,he.set(-1,0,0,0)}}}function t(){let b=!1,H=null,q=null,he=null;return{setTest:function(ve){ve?we(r.DEPTH_TEST):_e(r.DEPTH_TEST)},setMask:function(ve){H!==ve&&!b&&(r.depthMask(ve),H=ve)},setFunc:function(ve){if(q!==ve){switch(ve){case yy:r.depthFunc(r.NEVER);break;case Sy:r.depthFunc(r.ALWAYS);break;case My:r.depthFunc(r.LESS);break;case Vl:r.depthFunc(r.LEQUAL);break;case Ey:r.depthFunc(r.EQUAL);break;case wy:r.depthFunc(r.GEQUAL);break;case Ty:r.depthFunc(r.GREATER);break;case Ay:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}q=ve}},setLocked:function(ve){b=ve},setClear:function(ve){he!==ve&&(r.clearDepth(ve),he=ve)},reset:function(){b=!1,H=null,q=null,he=null}}}function s(){let b=!1,H=null,q=null,he=null,ve=null,Ye=null,$e=null,pt=null,Vt=null;return{setTest:function(St){b||(St?we(r.STENCIL_TEST):_e(r.STENCIL_TEST))},setMask:function(St){H!==St&&!b&&(r.stencilMask(St),H=St)},setFunc:function(St,Sn,Zt){(q!==St||he!==Sn||ve!==Zt)&&(r.stencilFunc(St,Sn,Zt),q=St,he=Sn,ve=Zt)},setOp:function(St,Sn,Zt){(Ye!==St||$e!==Sn||pt!==Zt)&&(r.stencilOp(St,Sn,Zt),Ye=St,$e=Sn,pt=Zt)},setLocked:function(St){b=St},setClear:function(St){Vt!==St&&(r.clearStencil(St),Vt=St)},reset:function(){b=!1,H=null,q=null,he=null,ve=null,Ye=null,$e=null,pt=null,Vt=null}}}const o=new e,l=new t,f=new s,d=new WeakMap,m=new WeakMap;let p={},g={},_=new WeakMap,x=[],M=null,E=!1,w=null,S=null,y=null,L=null,N=null,U=null,Y=null,I=new Et(0,0,0),O=0,W=!1,R=null,A=null,D=null,G=null,B=null;const te=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let le=!1,X=0;const ce=r.getParameter(r.VERSION);ce.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(ce)[1]),le=X>=1):ce.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(ce)[1]),le=X>=2);let j=null,K={};const Q=r.getParameter(r.SCISSOR_BOX),k=r.getParameter(r.VIEWPORT),re=new rn().fromArray(Q),Ue=new rn().fromArray(k);function ne(b,H,q,he){const ve=new Uint8Array(4),Ye=r.createTexture();r.bindTexture(b,Ye),r.texParameteri(b,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(b,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let $e=0;$e<q;$e++)b===r.TEXTURE_3D||b===r.TEXTURE_2D_ARRAY?r.texImage3D(H,0,r.RGBA,1,1,he,0,r.RGBA,r.UNSIGNED_BYTE,ve):r.texImage2D(H+$e,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ve);return Ye}const pe={};pe[r.TEXTURE_2D]=ne(r.TEXTURE_2D,r.TEXTURE_2D,1),pe[r.TEXTURE_CUBE_MAP]=ne(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[r.TEXTURE_2D_ARRAY]=ne(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),pe[r.TEXTURE_3D]=ne(r.TEXTURE_3D,r.TEXTURE_3D,1,1),o.setClear(0,0,0,1),l.setClear(1),f.setClear(0),we(r.DEPTH_TEST),l.setFunc(Vl),lt(!1),it(em),we(r.CULL_FACE),nt(xr);function we(b){p[b]!==!0&&(r.enable(b),p[b]=!0)}function _e(b){p[b]!==!1&&(r.disable(b),p[b]=!1)}function Le(b,H){return g[b]!==H?(r.bindFramebuffer(b,H),g[b]=H,b===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=H),b===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=H),!0):!1}function Fe(b,H){let q=x,he=!1;if(b){q=_.get(H),q===void 0&&(q=[],_.set(H,q));const ve=b.textures;if(q.length!==ve.length||q[0]!==r.COLOR_ATTACHMENT0){for(let Ye=0,$e=ve.length;Ye<$e;Ye++)q[Ye]=r.COLOR_ATTACHMENT0+Ye;q.length=ve.length,he=!0}}else q[0]!==r.BACK&&(q[0]=r.BACK,he=!0);he&&r.drawBuffers(q)}function Z(b){return M!==b?(r.useProgram(b),M=b,!0):!1}const gt={[qr]:r.FUNC_ADD,[iy]:r.FUNC_SUBTRACT,[ry]:r.FUNC_REVERSE_SUBTRACT};gt[sy]=r.MIN,gt[ay]=r.MAX;const be={[oy]:r.ZERO,[ly]:r.ONE,[cy]:r.SRC_COLOR,[Nd]:r.SRC_ALPHA,[my]:r.SRC_ALPHA_SATURATE,[hy]:r.DST_COLOR,[dy]:r.DST_ALPHA,[uy]:r.ONE_MINUS_SRC_COLOR,[Pd]:r.ONE_MINUS_SRC_ALPHA,[py]:r.ONE_MINUS_DST_COLOR,[fy]:r.ONE_MINUS_DST_ALPHA,[gy]:r.CONSTANT_COLOR,[vy]:r.ONE_MINUS_CONSTANT_COLOR,[_y]:r.CONSTANT_ALPHA,[xy]:r.ONE_MINUS_CONSTANT_ALPHA};function nt(b,H,q,he,ve,Ye,$e,pt,Vt,St){if(b===xr){E===!0&&(_e(r.BLEND),E=!1);return}if(E===!1&&(we(r.BLEND),E=!0),b!==ny){if(b!==w||St!==W){if((S!==qr||N!==qr)&&(r.blendEquation(r.FUNC_ADD),S=qr,N=qr),St)switch(b){case Ks:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case tm:r.blendFunc(r.ONE,r.ONE);break;case nm:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case im:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",b);break}else switch(b){case Ks:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case tm:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case nm:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case im:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",b);break}y=null,L=null,U=null,Y=null,I.set(0,0,0),O=0,w=b,W=St}return}ve=ve||H,Ye=Ye||q,$e=$e||he,(H!==S||ve!==N)&&(r.blendEquationSeparate(gt[H],gt[ve]),S=H,N=ve),(q!==y||he!==L||Ye!==U||$e!==Y)&&(r.blendFuncSeparate(be[q],be[he],be[Ye],be[$e]),y=q,L=he,U=Ye,Y=$e),(pt.equals(I)===!1||Vt!==O)&&(r.blendColor(pt.r,pt.g,pt.b,Vt),I.copy(pt),O=Vt),w=b,W=!1}function Xe(b,H){b.side===gi?_e(r.CULL_FACE):we(r.CULL_FACE);let q=b.side===Nn;H&&(q=!q),lt(q),b.blending===Ks&&b.transparent===!1?nt(xr):nt(b.blending,b.blendEquation,b.blendSrc,b.blendDst,b.blendEquationAlpha,b.blendSrcAlpha,b.blendDstAlpha,b.blendColor,b.blendAlpha,b.premultipliedAlpha),l.setFunc(b.depthFunc),l.setTest(b.depthTest),l.setMask(b.depthWrite),o.setMask(b.colorWrite);const he=b.stencilWrite;f.setTest(he),he&&(f.setMask(b.stencilWriteMask),f.setFunc(b.stencilFunc,b.stencilRef,b.stencilFuncMask),f.setOp(b.stencilFail,b.stencilZFail,b.stencilZPass)),Tt(b.polygonOffset,b.polygonOffsetFactor,b.polygonOffsetUnits),b.alphaToCoverage===!0?we(r.SAMPLE_ALPHA_TO_COVERAGE):_e(r.SAMPLE_ALPHA_TO_COVERAGE)}function lt(b){R!==b&&(b?r.frontFace(r.CW):r.frontFace(r.CCW),R=b)}function it(b){b!==Q0?(we(r.CULL_FACE),b!==A&&(b===em?r.cullFace(r.BACK):b===ey?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):_e(r.CULL_FACE),A=b}function ot(b){b!==D&&(le&&r.lineWidth(b),D=b)}function Tt(b,H,q){b?(we(r.POLYGON_OFFSET_FILL),(G!==H||B!==q)&&(r.polygonOffset(H,q),G=H,B=q)):_e(r.POLYGON_OFFSET_FILL)}function z(b){b?we(r.SCISSOR_TEST):_e(r.SCISSOR_TEST)}function C(b){b===void 0&&(b=r.TEXTURE0+te-1),j!==b&&(r.activeTexture(b),j=b)}function de(b,H,q){q===void 0&&(j===null?q=r.TEXTURE0+te-1:q=j);let he=K[q];he===void 0&&(he={type:void 0,texture:void 0},K[q]=he),(he.type!==b||he.texture!==H)&&(j!==q&&(r.activeTexture(q),j=q),r.bindTexture(b,H||pe[b]),he.type=b,he.texture=H)}function ge(){const b=K[j];b!==void 0&&b.type!==void 0&&(r.bindTexture(b.type,null),b.type=void 0,b.texture=void 0)}function Se(){try{r.compressedTexImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Me(){try{r.compressedTexImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function We(){try{r.texSubImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Re(){try{r.texSubImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Ce(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function tt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Ae(){try{r.texStorage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function He(){try{r.texStorage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function ct(){try{r.texImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function qe(){try{r.texImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Ie(b){re.equals(b)===!1&&(r.scissor(b.x,b.y,b.z,b.w),re.copy(b))}function st(b){Ue.equals(b)===!1&&(r.viewport(b.x,b.y,b.z,b.w),Ue.copy(b))}function ht(b,H){let q=m.get(H);q===void 0&&(q=new WeakMap,m.set(H,q));let he=q.get(b);he===void 0&&(he=r.getUniformBlockIndex(H,b.name),q.set(b,he))}function bt(b,H){const he=m.get(H).get(b);d.get(H)!==he&&(r.uniformBlockBinding(H,he,b.__bindingPointIndex),d.set(H,he))}function rt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),p={},j=null,K={},g={},_=new WeakMap,x=[],M=null,E=!1,w=null,S=null,y=null,L=null,N=null,U=null,Y=null,I=new Et(0,0,0),O=0,W=!1,R=null,A=null,D=null,G=null,B=null,re.set(0,0,r.canvas.width,r.canvas.height),Ue.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),f.reset()}return{buffers:{color:o,depth:l,stencil:f},enable:we,disable:_e,bindFramebuffer:Le,drawBuffers:Fe,useProgram:Z,setBlending:nt,setMaterial:Xe,setFlipSided:lt,setCullFace:it,setLineWidth:ot,setPolygonOffset:Tt,setScissorTest:z,activeTexture:C,bindTexture:de,unbindTexture:ge,compressedTexImage2D:Se,compressedTexImage3D:Me,texImage2D:ct,texImage3D:qe,updateUBOMapping:ht,uniformBlockBinding:bt,texStorage2D:Ae,texStorage3D:He,texSubImage2D:We,texSubImage3D:Re,compressedTexSubImage2D:Ce,compressedTexSubImage3D:tt,scissor:Ie,viewport:st,reset:rt}}function n1(r,e,t,s,o,l,f){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new xt,g=new WeakMap;let _;const x=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(z,C){return M?new OffscreenCanvas(z,C):ql("canvas")}function w(z,C,de){let ge=1;const Se=Tt(z);if((Se.width>de||Se.height>de)&&(ge=de/Math.max(Se.width,Se.height)),ge<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const Me=Math.floor(ge*Se.width),We=Math.floor(ge*Se.height);_===void 0&&(_=E(Me,We));const Re=C?E(Me,We):_;return Re.width=Me,Re.height=We,Re.getContext("2d").drawImage(z,0,0,Me,We),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Se.width+"x"+Se.height+") to ("+Me+"x"+We+")."),Re}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Se.width+"x"+Se.height+")."),z;return z}function S(z){return z.generateMipmaps&&z.minFilter!==Kn&&z.minFilter!==oi}function y(z){r.generateMipmap(z)}function L(z,C,de,ge,Se=!1){if(z!==null){if(r[z]!==void 0)return r[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let Me=C;if(C===r.RED&&(de===r.FLOAT&&(Me=r.R32F),de===r.HALF_FLOAT&&(Me=r.R16F),de===r.UNSIGNED_BYTE&&(Me=r.R8)),C===r.RED_INTEGER&&(de===r.UNSIGNED_BYTE&&(Me=r.R8UI),de===r.UNSIGNED_SHORT&&(Me=r.R16UI),de===r.UNSIGNED_INT&&(Me=r.R32UI),de===r.BYTE&&(Me=r.R8I),de===r.SHORT&&(Me=r.R16I),de===r.INT&&(Me=r.R32I)),C===r.RG&&(de===r.FLOAT&&(Me=r.RG32F),de===r.HALF_FLOAT&&(Me=r.RG16F),de===r.UNSIGNED_BYTE&&(Me=r.RG8)),C===r.RG_INTEGER&&(de===r.UNSIGNED_BYTE&&(Me=r.RG8UI),de===r.UNSIGNED_SHORT&&(Me=r.RG16UI),de===r.UNSIGNED_INT&&(Me=r.RG32UI),de===r.BYTE&&(Me=r.RG8I),de===r.SHORT&&(Me=r.RG16I),de===r.INT&&(Me=r.RG32I)),C===r.RGB&&de===r.UNSIGNED_INT_5_9_9_9_REV&&(Me=r.RGB9_E5),C===r.RGBA){const We=Se?Gl:At.getTransfer(ge);de===r.FLOAT&&(Me=r.RGBA32F),de===r.HALF_FLOAT&&(Me=r.RGBA16F),de===r.UNSIGNED_BYTE&&(Me=We===Lt?r.SRGB8_ALPHA8:r.RGBA8),de===r.UNSIGNED_SHORT_4_4_4_4&&(Me=r.RGBA4),de===r.UNSIGNED_SHORT_5_5_5_1&&(Me=r.RGB5_A1)}return(Me===r.R16F||Me===r.R32F||Me===r.RG16F||Me===r.RG32F||Me===r.RGBA16F||Me===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Me}function N(z,C){return S(z)===!0||z.isFramebufferTexture&&z.minFilter!==Kn&&z.minFilter!==oi?Math.log2(Math.max(C.width,C.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?C.mipmaps.length:1}function U(z){const C=z.target;C.removeEventListener("dispose",U),I(C),C.isVideoTexture&&g.delete(C)}function Y(z){const C=z.target;C.removeEventListener("dispose",Y),W(C)}function I(z){const C=s.get(z);if(C.__webglInit===void 0)return;const de=z.source,ge=x.get(de);if(ge){const Se=ge[C.__cacheKey];Se.usedTimes--,Se.usedTimes===0&&O(z),Object.keys(ge).length===0&&x.delete(de)}s.remove(z)}function O(z){const C=s.get(z);r.deleteTexture(C.__webglTexture);const de=z.source,ge=x.get(de);delete ge[C.__cacheKey],f.memory.textures--}function W(z){const C=s.get(z);if(z.depthTexture&&z.depthTexture.dispose(),z.isWebGLCubeRenderTarget)for(let ge=0;ge<6;ge++){if(Array.isArray(C.__webglFramebuffer[ge]))for(let Se=0;Se<C.__webglFramebuffer[ge].length;Se++)r.deleteFramebuffer(C.__webglFramebuffer[ge][Se]);else r.deleteFramebuffer(C.__webglFramebuffer[ge]);C.__webglDepthbuffer&&r.deleteRenderbuffer(C.__webglDepthbuffer[ge])}else{if(Array.isArray(C.__webglFramebuffer))for(let ge=0;ge<C.__webglFramebuffer.length;ge++)r.deleteFramebuffer(C.__webglFramebuffer[ge]);else r.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&r.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&r.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let ge=0;ge<C.__webglColorRenderbuffer.length;ge++)C.__webglColorRenderbuffer[ge]&&r.deleteRenderbuffer(C.__webglColorRenderbuffer[ge]);C.__webglDepthRenderbuffer&&r.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const de=z.textures;for(let ge=0,Se=de.length;ge<Se;ge++){const Me=s.get(de[ge]);Me.__webglTexture&&(r.deleteTexture(Me.__webglTexture),f.memory.textures--),s.remove(de[ge])}s.remove(z)}let R=0;function A(){R=0}function D(){const z=R;return z>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+o.maxTextures),R+=1,z}function G(z){const C=[];return C.push(z.wrapS),C.push(z.wrapT),C.push(z.wrapR||0),C.push(z.magFilter),C.push(z.minFilter),C.push(z.anisotropy),C.push(z.internalFormat),C.push(z.format),C.push(z.type),C.push(z.generateMipmaps),C.push(z.premultiplyAlpha),C.push(z.flipY),C.push(z.unpackAlignment),C.push(z.colorSpace),C.join()}function B(z,C){const de=s.get(z);if(z.isVideoTexture&&it(z),z.isRenderTargetTexture===!1&&z.version>0&&de.__version!==z.version){const ge=z.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{re(de,z,C);return}}t.bindTexture(r.TEXTURE_2D,de.__webglTexture,r.TEXTURE0+C)}function te(z,C){const de=s.get(z);if(z.version>0&&de.__version!==z.version){re(de,z,C);return}t.bindTexture(r.TEXTURE_2D_ARRAY,de.__webglTexture,r.TEXTURE0+C)}function le(z,C){const de=s.get(z);if(z.version>0&&de.__version!==z.version){re(de,z,C);return}t.bindTexture(r.TEXTURE_3D,de.__webglTexture,r.TEXTURE0+C)}function X(z,C){const de=s.get(z);if(z.version>0&&de.__version!==z.version){Ue(de,z,C);return}t.bindTexture(r.TEXTURE_CUBE_MAP,de.__webglTexture,r.TEXTURE0+C)}const ce={[Ud]:r.REPEAT,[Zr]:r.CLAMP_TO_EDGE,[Id]:r.MIRRORED_REPEAT},j={[Kn]:r.NEAREST,[Fy]:r.NEAREST_MIPMAP_NEAREST,[ml]:r.NEAREST_MIPMAP_LINEAR,[oi]:r.LINEAR,[Wu]:r.LINEAR_MIPMAP_NEAREST,[Jr]:r.LINEAR_MIPMAP_LINEAR},K={[Ky]:r.NEVER,[nS]:r.ALWAYS,[Zy]:r.LESS,[av]:r.LEQUAL,[Jy]:r.EQUAL,[tS]:r.GEQUAL,[Qy]:r.GREATER,[eS]:r.NOTEQUAL};function Q(z,C){if(C.type===_r&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===oi||C.magFilter===Wu||C.magFilter===ml||C.magFilter===Jr||C.minFilter===oi||C.minFilter===Wu||C.minFilter===ml||C.minFilter===Jr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(z,r.TEXTURE_WRAP_S,ce[C.wrapS]),r.texParameteri(z,r.TEXTURE_WRAP_T,ce[C.wrapT]),(z===r.TEXTURE_3D||z===r.TEXTURE_2D_ARRAY)&&r.texParameteri(z,r.TEXTURE_WRAP_R,ce[C.wrapR]),r.texParameteri(z,r.TEXTURE_MAG_FILTER,j[C.magFilter]),r.texParameteri(z,r.TEXTURE_MIN_FILTER,j[C.minFilter]),C.compareFunction&&(r.texParameteri(z,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(z,r.TEXTURE_COMPARE_FUNC,K[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Kn||C.minFilter!==ml&&C.minFilter!==Jr||C.type===_r&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||s.get(C).__currentAnisotropy){const de=e.get("EXT_texture_filter_anisotropic");r.texParameterf(z,de.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,o.getMaxAnisotropy())),s.get(C).__currentAnisotropy=C.anisotropy}}}function k(z,C){let de=!1;z.__webglInit===void 0&&(z.__webglInit=!0,C.addEventListener("dispose",U));const ge=C.source;let Se=x.get(ge);Se===void 0&&(Se={},x.set(ge,Se));const Me=G(C);if(Me!==z.__cacheKey){Se[Me]===void 0&&(Se[Me]={texture:r.createTexture(),usedTimes:0},f.memory.textures++,de=!0),Se[Me].usedTimes++;const We=Se[z.__cacheKey];We!==void 0&&(Se[z.__cacheKey].usedTimes--,We.usedTimes===0&&O(C)),z.__cacheKey=Me,z.__webglTexture=Se[Me].texture}return de}function re(z,C,de){let ge=r.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(ge=r.TEXTURE_2D_ARRAY),C.isData3DTexture&&(ge=r.TEXTURE_3D);const Se=k(z,C),Me=C.source;t.bindTexture(ge,z.__webglTexture,r.TEXTURE0+de);const We=s.get(Me);if(Me.version!==We.__version||Se===!0){t.activeTexture(r.TEXTURE0+de);const Re=At.getPrimaries(At.workingColorSpace),Ce=C.colorSpace===vr?null:At.getPrimaries(C.colorSpace),tt=C.colorSpace===vr||Re===Ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,C.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,C.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);let Ae=w(C.image,!1,o.maxTextureSize);Ae=ot(C,Ae);const He=l.convert(C.format,C.colorSpace),ct=l.convert(C.type);let qe=L(C.internalFormat,He,ct,C.colorSpace,C.isVideoTexture);Q(ge,C);let Ie;const st=C.mipmaps,ht=C.isVideoTexture!==!0,bt=We.__version===void 0||Se===!0,rt=Me.dataReady,b=N(C,Ae);if(C.isDepthTexture)qe=r.DEPTH_COMPONENT16,C.type===_r?qe=r.DEPTH_COMPONENT32F:C.type===ia?qe=r.DEPTH_COMPONENT24:C.type===io&&(qe=r.DEPTH24_STENCIL8),bt&&(ht?t.texStorage2D(r.TEXTURE_2D,1,qe,Ae.width,Ae.height):t.texImage2D(r.TEXTURE_2D,0,qe,Ae.width,Ae.height,0,He,ct,null));else if(C.isDataTexture)if(st.length>0){ht&&bt&&t.texStorage2D(r.TEXTURE_2D,b,qe,st[0].width,st[0].height);for(let H=0,q=st.length;H<q;H++)Ie=st[H],ht?rt&&t.texSubImage2D(r.TEXTURE_2D,H,0,0,Ie.width,Ie.height,He,ct,Ie.data):t.texImage2D(r.TEXTURE_2D,H,qe,Ie.width,Ie.height,0,He,ct,Ie.data);C.generateMipmaps=!1}else ht?(bt&&t.texStorage2D(r.TEXTURE_2D,b,qe,Ae.width,Ae.height),rt&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Ae.width,Ae.height,He,ct,Ae.data)):t.texImage2D(r.TEXTURE_2D,0,qe,Ae.width,Ae.height,0,He,ct,Ae.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){ht&&bt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,b,qe,st[0].width,st[0].height,Ae.depth);for(let H=0,q=st.length;H<q;H++)Ie=st[H],C.format!==_i?He!==null?ht?rt&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,H,0,0,0,Ie.width,Ie.height,Ae.depth,He,Ie.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,H,qe,Ie.width,Ie.height,Ae.depth,0,Ie.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ht?rt&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,H,0,0,0,Ie.width,Ie.height,Ae.depth,He,ct,Ie.data):t.texImage3D(r.TEXTURE_2D_ARRAY,H,qe,Ie.width,Ie.height,Ae.depth,0,He,ct,Ie.data)}else{ht&&bt&&t.texStorage2D(r.TEXTURE_2D,b,qe,st[0].width,st[0].height);for(let H=0,q=st.length;H<q;H++)Ie=st[H],C.format!==_i?He!==null?ht?rt&&t.compressedTexSubImage2D(r.TEXTURE_2D,H,0,0,Ie.width,Ie.height,He,Ie.data):t.compressedTexImage2D(r.TEXTURE_2D,H,qe,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ht?rt&&t.texSubImage2D(r.TEXTURE_2D,H,0,0,Ie.width,Ie.height,He,ct,Ie.data):t.texImage2D(r.TEXTURE_2D,H,qe,Ie.width,Ie.height,0,He,ct,Ie.data)}else if(C.isDataArrayTexture)ht?(bt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,b,qe,Ae.width,Ae.height,Ae.depth),rt&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Ae.width,Ae.height,Ae.depth,He,ct,Ae.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,qe,Ae.width,Ae.height,Ae.depth,0,He,ct,Ae.data);else if(C.isData3DTexture)ht?(bt&&t.texStorage3D(r.TEXTURE_3D,b,qe,Ae.width,Ae.height,Ae.depth),rt&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Ae.width,Ae.height,Ae.depth,He,ct,Ae.data)):t.texImage3D(r.TEXTURE_3D,0,qe,Ae.width,Ae.height,Ae.depth,0,He,ct,Ae.data);else if(C.isFramebufferTexture){if(bt)if(ht)t.texStorage2D(r.TEXTURE_2D,b,qe,Ae.width,Ae.height);else{let H=Ae.width,q=Ae.height;for(let he=0;he<b;he++)t.texImage2D(r.TEXTURE_2D,he,qe,H,q,0,He,ct,null),H>>=1,q>>=1}}else if(st.length>0){if(ht&&bt){const H=Tt(st[0]);t.texStorage2D(r.TEXTURE_2D,b,qe,H.width,H.height)}for(let H=0,q=st.length;H<q;H++)Ie=st[H],ht?rt&&t.texSubImage2D(r.TEXTURE_2D,H,0,0,He,ct,Ie):t.texImage2D(r.TEXTURE_2D,H,qe,He,ct,Ie);C.generateMipmaps=!1}else if(ht){if(bt){const H=Tt(Ae);t.texStorage2D(r.TEXTURE_2D,b,qe,H.width,H.height)}rt&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,He,ct,Ae)}else t.texImage2D(r.TEXTURE_2D,0,qe,He,ct,Ae);S(C)&&y(ge),We.__version=Me.version,C.onUpdate&&C.onUpdate(C)}z.__version=C.version}function Ue(z,C,de){if(C.image.length!==6)return;const ge=k(z,C),Se=C.source;t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+de);const Me=s.get(Se);if(Se.version!==Me.__version||ge===!0){t.activeTexture(r.TEXTURE0+de);const We=At.getPrimaries(At.workingColorSpace),Re=C.colorSpace===vr?null:At.getPrimaries(C.colorSpace),Ce=C.colorSpace===vr||We===Re?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,C.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,C.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);const tt=C.isCompressedTexture||C.image[0].isCompressedTexture,Ae=C.image[0]&&C.image[0].isDataTexture,He=[];for(let q=0;q<6;q++)!tt&&!Ae?He[q]=w(C.image[q],!0,o.maxCubemapSize):He[q]=Ae?C.image[q].image:C.image[q],He[q]=ot(C,He[q]);const ct=He[0],qe=l.convert(C.format,C.colorSpace),Ie=l.convert(C.type),st=L(C.internalFormat,qe,Ie,C.colorSpace),ht=C.isVideoTexture!==!0,bt=Me.__version===void 0||ge===!0,rt=Se.dataReady;let b=N(C,ct);Q(r.TEXTURE_CUBE_MAP,C);let H;if(tt){ht&&bt&&t.texStorage2D(r.TEXTURE_CUBE_MAP,b,st,ct.width,ct.height);for(let q=0;q<6;q++){H=He[q].mipmaps;for(let he=0;he<H.length;he++){const ve=H[he];C.format!==_i?qe!==null?ht?rt&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he,0,0,ve.width,ve.height,qe,ve.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he,st,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he,0,0,ve.width,ve.height,qe,Ie,ve.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he,st,ve.width,ve.height,0,qe,Ie,ve.data)}}}else{if(H=C.mipmaps,ht&&bt){H.length>0&&b++;const q=Tt(He[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,b,st,q.width,q.height)}for(let q=0;q<6;q++)if(Ae){ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,He[q].width,He[q].height,qe,Ie,He[q].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,st,He[q].width,He[q].height,0,qe,Ie,He[q].data);for(let he=0;he<H.length;he++){const Ye=H[he].image[q].image;ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he+1,0,0,Ye.width,Ye.height,qe,Ie,Ye.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he+1,st,Ye.width,Ye.height,0,qe,Ie,Ye.data)}}else{ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,qe,Ie,He[q]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,st,qe,Ie,He[q]);for(let he=0;he<H.length;he++){const ve=H[he];ht?rt&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he+1,0,0,qe,Ie,ve.image[q]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,he+1,st,qe,Ie,ve.image[q])}}}S(C)&&y(r.TEXTURE_CUBE_MAP),Me.__version=Se.version,C.onUpdate&&C.onUpdate(C)}z.__version=C.version}function ne(z,C,de,ge,Se,Me){const We=l.convert(de.format,de.colorSpace),Re=l.convert(de.type),Ce=L(de.internalFormat,We,Re,de.colorSpace);if(!s.get(C).__hasExternalTextures){const Ae=Math.max(1,C.width>>Me),He=Math.max(1,C.height>>Me);Se===r.TEXTURE_3D||Se===r.TEXTURE_2D_ARRAY?t.texImage3D(Se,Me,Ce,Ae,He,C.depth,0,We,Re,null):t.texImage2D(Se,Me,Ce,Ae,He,0,We,Re,null)}t.bindFramebuffer(r.FRAMEBUFFER,z),lt(C)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ge,Se,s.get(de).__webglTexture,0,Xe(C)):(Se===r.TEXTURE_2D||Se>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Se<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ge,Se,s.get(de).__webglTexture,Me),t.bindFramebuffer(r.FRAMEBUFFER,null)}function pe(z,C,de){if(r.bindRenderbuffer(r.RENDERBUFFER,z),C.depthBuffer&&!C.stencilBuffer){let ge=r.DEPTH_COMPONENT24;if(de||lt(C)){const Se=C.depthTexture;Se&&Se.isDepthTexture&&(Se.type===_r?ge=r.DEPTH_COMPONENT32F:Se.type===ia&&(ge=r.DEPTH_COMPONENT24));const Me=Xe(C);lt(C)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Me,ge,C.width,C.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,Me,ge,C.width,C.height)}else r.renderbufferStorage(r.RENDERBUFFER,ge,C.width,C.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,z)}else if(C.depthBuffer&&C.stencilBuffer){const ge=Xe(C);de&&lt(C)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ge,r.DEPTH24_STENCIL8,C.width,C.height):lt(C)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ge,r.DEPTH24_STENCIL8,C.width,C.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,z)}else{const ge=C.textures;for(let Se=0;Se<ge.length;Se++){const Me=ge[Se],We=l.convert(Me.format,Me.colorSpace),Re=l.convert(Me.type),Ce=L(Me.internalFormat,We,Re,Me.colorSpace),tt=Xe(C);de&&lt(C)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,tt,Ce,C.width,C.height):lt(C)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,tt,Ce,C.width,C.height):r.renderbufferStorage(r.RENDERBUFFER,Ce,C.width,C.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function we(z,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,z),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(C.depthTexture).__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),B(C.depthTexture,0);const ge=s.get(C.depthTexture).__webglTexture,Se=Xe(C);if(C.depthTexture.format===Zs)lt(C)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ge,0,Se):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ge,0);else if(C.depthTexture.format===to)lt(C)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ge,0,Se):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function _e(z){const C=s.get(z),de=z.isWebGLCubeRenderTarget===!0;if(z.depthTexture&&!C.__autoAllocateDepthBuffer){if(de)throw new Error("target.depthTexture not supported in Cube render targets");we(C.__webglFramebuffer,z)}else if(de){C.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)t.bindFramebuffer(r.FRAMEBUFFER,C.__webglFramebuffer[ge]),C.__webglDepthbuffer[ge]=r.createRenderbuffer(),pe(C.__webglDepthbuffer[ge],z,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer=r.createRenderbuffer(),pe(C.__webglDepthbuffer,z,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function Le(z,C,de){const ge=s.get(z);C!==void 0&&ne(ge.__webglFramebuffer,z,z.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),de!==void 0&&_e(z)}function Fe(z){const C=z.texture,de=s.get(z),ge=s.get(C);z.addEventListener("dispose",Y);const Se=z.textures,Me=z.isWebGLCubeRenderTarget===!0,We=Se.length>1;if(We||(ge.__webglTexture===void 0&&(ge.__webglTexture=r.createTexture()),ge.__version=C.version,f.memory.textures++),Me){de.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(C.mipmaps&&C.mipmaps.length>0){de.__webglFramebuffer[Re]=[];for(let Ce=0;Ce<C.mipmaps.length;Ce++)de.__webglFramebuffer[Re][Ce]=r.createFramebuffer()}else de.__webglFramebuffer[Re]=r.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){de.__webglFramebuffer=[];for(let Re=0;Re<C.mipmaps.length;Re++)de.__webglFramebuffer[Re]=r.createFramebuffer()}else de.__webglFramebuffer=r.createFramebuffer();if(We)for(let Re=0,Ce=Se.length;Re<Ce;Re++){const tt=s.get(Se[Re]);tt.__webglTexture===void 0&&(tt.__webglTexture=r.createTexture(),f.memory.textures++)}if(z.samples>0&&lt(z)===!1){de.__webglMultisampledFramebuffer=r.createFramebuffer(),de.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,de.__webglMultisampledFramebuffer);for(let Re=0;Re<Se.length;Re++){const Ce=Se[Re];de.__webglColorRenderbuffer[Re]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,de.__webglColorRenderbuffer[Re]);const tt=l.convert(Ce.format,Ce.colorSpace),Ae=l.convert(Ce.type),He=L(Ce.internalFormat,tt,Ae,Ce.colorSpace,z.isXRRenderTarget===!0),ct=Xe(z);r.renderbufferStorageMultisample(r.RENDERBUFFER,ct,He,z.width,z.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,de.__webglColorRenderbuffer[Re])}r.bindRenderbuffer(r.RENDERBUFFER,null),z.depthBuffer&&(de.__webglDepthRenderbuffer=r.createRenderbuffer(),pe(de.__webglDepthRenderbuffer,z,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Me){t.bindTexture(r.TEXTURE_CUBE_MAP,ge.__webglTexture),Q(r.TEXTURE_CUBE_MAP,C);for(let Re=0;Re<6;Re++)if(C.mipmaps&&C.mipmaps.length>0)for(let Ce=0;Ce<C.mipmaps.length;Ce++)ne(de.__webglFramebuffer[Re][Ce],z,C,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ce);else ne(de.__webglFramebuffer[Re],z,C,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);S(C)&&y(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(We){for(let Re=0,Ce=Se.length;Re<Ce;Re++){const tt=Se[Re],Ae=s.get(tt);t.bindTexture(r.TEXTURE_2D,Ae.__webglTexture),Q(r.TEXTURE_2D,tt),ne(de.__webglFramebuffer,z,tt,r.COLOR_ATTACHMENT0+Re,r.TEXTURE_2D,0),S(tt)&&y(r.TEXTURE_2D)}t.unbindTexture()}else{let Re=r.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(Re=z.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Re,ge.__webglTexture),Q(Re,C),C.mipmaps&&C.mipmaps.length>0)for(let Ce=0;Ce<C.mipmaps.length;Ce++)ne(de.__webglFramebuffer[Ce],z,C,r.COLOR_ATTACHMENT0,Re,Ce);else ne(de.__webglFramebuffer,z,C,r.COLOR_ATTACHMENT0,Re,0);S(C)&&y(Re),t.unbindTexture()}z.depthBuffer&&_e(z)}function Z(z){const C=z.textures;for(let de=0,ge=C.length;de<ge;de++){const Se=C[de];if(S(Se)){const Me=z.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,We=s.get(Se).__webglTexture;t.bindTexture(Me,We),y(Me),t.unbindTexture()}}}const gt=[],be=[];function nt(z){if(z.samples>0){if(lt(z)===!1){const C=z.textures,de=z.width,ge=z.height;let Se=r.COLOR_BUFFER_BIT;const Me=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,We=s.get(z),Re=C.length>1;if(Re)for(let Ce=0;Ce<C.length;Ce++)t.bindFramebuffer(r.FRAMEBUFFER,We.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,We.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,We.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,We.__webglFramebuffer);for(let Ce=0;Ce<C.length;Ce++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(Se|=r.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(Se|=r.STENCIL_BUFFER_BIT)),Re){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,We.__webglColorRenderbuffer[Ce]);const tt=s.get(C[Ce]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,tt,0)}r.blitFramebuffer(0,0,de,ge,0,0,de,ge,Se,r.NEAREST),m===!0&&(gt.length=0,be.length=0,gt.push(r.COLOR_ATTACHMENT0+Ce),z.depthBuffer&&z.resolveDepthBuffer===!1&&(gt.push(Me),be.push(Me),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,be)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Re)for(let Ce=0;Ce<C.length;Ce++){t.bindFramebuffer(r.FRAMEBUFFER,We.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,We.__webglColorRenderbuffer[Ce]);const tt=s.get(C[Ce]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,We.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,tt,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,We.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&m){const C=z.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[C])}}}function Xe(z){return Math.min(o.maxSamples,z.samples)}function lt(z){const C=s.get(z);return z.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function it(z){const C=f.render.frame;g.get(z)!==C&&(g.set(z,C),z.update())}function ot(z,C){const de=z.colorSpace,ge=z.format,Se=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||de!==Tr&&de!==vr&&(At.getTransfer(de)===Lt?(ge!==_i||Se!==Mr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",de)),C}function Tt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(p.width=z.naturalWidth||z.width,p.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(p.width=z.displayWidth,p.height=z.displayHeight):(p.width=z.width,p.height=z.height),p}this.allocateTextureUnit=D,this.resetTextureUnits=A,this.setTexture2D=B,this.setTexture2DArray=te,this.setTexture3D=le,this.setTextureCube=X,this.rebindTextures=Le,this.setupRenderTarget=Fe,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=lt}function i1(r,e){function t(s,o=vr){let l;const f=At.getTransfer(o);if(s===Mr)return r.UNSIGNED_BYTE;if(s===ev)return r.UNSIGNED_SHORT_4_4_4_4;if(s===tv)return r.UNSIGNED_SHORT_5_5_5_1;if(s===zy)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Oy)return r.BYTE;if(s===ky)return r.SHORT;if(s===Jg)return r.UNSIGNED_SHORT;if(s===Qg)return r.INT;if(s===ia)return r.UNSIGNED_INT;if(s===_r)return r.FLOAT;if(s===Ql)return r.HALF_FLOAT;if(s===By)return r.ALPHA;if(s===jy)return r.RGB;if(s===_i)return r.RGBA;if(s===Hy)return r.LUMINANCE;if(s===Vy)return r.LUMINANCE_ALPHA;if(s===Zs)return r.DEPTH_COMPONENT;if(s===to)return r.DEPTH_STENCIL;if(s===Gy)return r.RED;if(s===nv)return r.RED_INTEGER;if(s===Wy)return r.RG;if(s===iv)return r.RG_INTEGER;if(s===rv)return r.RGBA_INTEGER;if(s===$u||s===Xu||s===qu||s===Yu)if(f===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(s===$u)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===qu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Yu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(s===$u)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Xu)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===qu)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Yu)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===rm||s===sm||s===am||s===om)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(s===rm)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===sm)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===am)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===om)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===lm||s===cm||s===um)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(s===lm||s===cm)return f===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(s===um)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===dm||s===fm||s===hm||s===pm||s===mm||s===gm||s===vm||s===_m||s===xm||s===ym||s===Sm||s===Mm||s===Em||s===wm)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(s===dm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===fm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===hm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===pm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===mm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===gm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===vm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===_m)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===xm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===ym)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Sm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Mm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Em)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===wm)return f===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Ku||s===Tm||s===Am)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(s===Ku)return f===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Tm)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Am)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===$y||s===bm||s===Cm||s===Rm)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(s===Ku)return l.COMPRESSED_RED_RGTC1_EXT;if(s===bm)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Cm)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Rm)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===io?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:t}}class r1 extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ja extends gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const s1={type:"move"};class Ed{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ja,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ja,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ue,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ue),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ja,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ue,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ue),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const s of e.hand.values())this._getHandJoint(t,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,s){let o=null,l=null,f=null;const d=this._targetRay,m=this._grip,p=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(p&&e.hand){f=!0;for(const w of e.hand.values()){const S=t.getJointPose(w,s),y=this._getHandJoint(p,w);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const g=p.joints["index-finger-tip"],_=p.joints["thumb-tip"],x=g.position.distanceTo(_.position),M=.02,E=.005;p.inputState.pinching&&x>M+E?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&x<=M-E&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,s),l!==null&&(m.matrix.fromArray(l.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,l.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(l.linearVelocity)):m.hasLinearVelocity=!1,l.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(l.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(o=t.getPose(e.targetRaySpace,s),o===null&&l!==null&&(o=l),o!==null&&(d.matrix.fromArray(o.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,o.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(o.linearVelocity)):d.hasLinearVelocity=!1,o.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(o.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(s1)))}return d!==null&&(d.visible=o!==null),m!==null&&(m.visible=l!==null),p!==null&&(p.visible=f!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const s=new Ja;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[t.jointName]=s,e.add(s)}return e.joints[t.jointName]}}const a1=`
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

}`;class l1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,s){if(this.texture===null){const o=new Pn,l=e.properties.get(o);l.__webglTexture=t.texture,(t.depthNear!=s.depthNear||t.depthFar!=s.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}render(e,t){if(this.texture!==null){if(this.mesh===null){const s=t.cameras[0].viewport,o=new Er({vertexShader:a1,fragmentShader:o1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:s.z},depthHeight:{value:s.w}}});this.mesh=new xi(new tc(20,20),o)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class c1 extends aa{constructor(e,t){super();const s=this;let o=null,l=1,f=null,d="local-floor",m=1,p=null,g=null,_=null,x=null,M=null,E=null;const w=new l1,S=t.getContextAttributes();let y=null,L=null;const N=[],U=[],Y=new xt;let I=null;const O=new qn;O.layers.enable(1),O.viewport=new rn;const W=new qn;W.layers.enable(2),W.viewport=new rn;const R=[O,W],A=new r1;A.layers.enable(1),A.layers.enable(2);let D=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let pe=N[ne];return pe===void 0&&(pe=new Ed,N[ne]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(ne){let pe=N[ne];return pe===void 0&&(pe=new Ed,N[ne]=pe),pe.getGripSpace()},this.getHand=function(ne){let pe=N[ne];return pe===void 0&&(pe=new Ed,N[ne]=pe),pe.getHandSpace()};function B(ne){const pe=U.indexOf(ne.inputSource);if(pe===-1)return;const we=N[pe];we!==void 0&&(we.update(ne.inputSource,ne.frame,p||f),we.dispatchEvent({type:ne.type,data:ne.inputSource}))}function te(){o.removeEventListener("select",B),o.removeEventListener("selectstart",B),o.removeEventListener("selectend",B),o.removeEventListener("squeeze",B),o.removeEventListener("squeezestart",B),o.removeEventListener("squeezeend",B),o.removeEventListener("end",te),o.removeEventListener("inputsourceschange",le);for(let ne=0;ne<N.length;ne++){const pe=U[ne];pe!==null&&(U[ne]=null,N[ne].disconnect(pe))}D=null,G=null,w.reset(),e.setRenderTarget(y),M=null,x=null,_=null,o=null,L=null,Ue.stop(),s.isPresenting=!1,e.setPixelRatio(I),e.setSize(Y.width,Y.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){l=ne,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){d=ne,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||f},this.setReferenceSpace=function(ne){p=ne},this.getBaseLayer=function(){return x!==null?x:M},this.getBinding=function(){return _},this.getFrame=function(){return E},this.getSession=function(){return o},this.setSession=async function(ne){if(o=ne,o!==null){if(y=e.getRenderTarget(),o.addEventListener("select",B),o.addEventListener("selectstart",B),o.addEventListener("selectend",B),o.addEventListener("squeeze",B),o.addEventListener("squeezestart",B),o.addEventListener("squeezeend",B),o.addEventListener("end",te),o.addEventListener("inputsourceschange",le),S.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(Y),o.renderState.layers===void 0){const pe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};M=new XRWebGLLayer(o,t,pe),o.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),L=new ns(M.framebufferWidth,M.framebufferHeight,{format:_i,type:Mr,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let pe=null,we=null,_e=null;S.depth&&(_e=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=S.stencil?to:Zs,we=S.stencil?io:ia);const Le={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:l};_=new XRWebGLBinding(o,t),x=_.createProjectionLayer(Le),o.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),L=new ns(x.textureWidth,x.textureHeight,{format:_i,type:Mr,depthTexture:new yv(x.textureWidth,x.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1})}L.isXRRenderTarget=!0,this.setFoveation(m),p=null,f=await o.requestReferenceSpace(d),Ue.setContext(o),Ue.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode};function le(ne){for(let pe=0;pe<ne.removed.length;pe++){const we=ne.removed[pe],_e=U.indexOf(we);_e>=0&&(U[_e]=null,N[_e].disconnect(we))}for(let pe=0;pe<ne.added.length;pe++){const we=ne.added[pe];let _e=U.indexOf(we);if(_e===-1){for(let Fe=0;Fe<N.length;Fe++)if(Fe>=U.length){U.push(we),_e=Fe;break}else if(U[Fe]===null){U[Fe]=we,_e=Fe;break}if(_e===-1)break}const Le=N[_e];Le&&Le.connect(we)}}const X=new ue,ce=new ue;function j(ne,pe,we){X.setFromMatrixPosition(pe.matrixWorld),ce.setFromMatrixPosition(we.matrixWorld);const _e=X.distanceTo(ce),Le=pe.projectionMatrix.elements,Fe=we.projectionMatrix.elements,Z=Le[14]/(Le[10]-1),gt=Le[14]/(Le[10]+1),be=(Le[9]+1)/Le[5],nt=(Le[9]-1)/Le[5],Xe=(Le[8]-1)/Le[0],lt=(Fe[8]+1)/Fe[0],it=Z*Xe,ot=Z*lt,Tt=_e/(-Xe+lt),z=Tt*-Xe;pe.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(z),ne.translateZ(Tt),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert();const C=Z+Tt,de=gt+Tt,ge=it-z,Se=ot+(_e-z),Me=be*gt/de*C,We=nt*gt/de*C;ne.projectionMatrix.makePerspective(ge,Se,Me,We,C,de),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}function K(ne,pe){pe===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(pe.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(o===null)return;w.texture!==null&&(ne.near=w.depthNear,ne.far=w.depthFar),A.near=W.near=O.near=ne.near,A.far=W.far=O.far=ne.far,(D!==A.near||G!==A.far)&&(o.updateRenderState({depthNear:A.near,depthFar:A.far}),D=A.near,G=A.far,O.near=D,O.far=G,W.near=D,W.far=G,O.updateProjectionMatrix(),W.updateProjectionMatrix(),ne.updateProjectionMatrix());const pe=ne.parent,we=A.cameras;K(A,pe);for(let _e=0;_e<we.length;_e++)K(we[_e],pe);we.length===2?j(A,O,W):A.projectionMatrix.copy(O.projectionMatrix),Q(ne,A,pe)};function Q(ne,pe,we){we===null?ne.matrix.copy(pe.matrixWorld):(ne.matrix.copy(we.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(pe.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(pe.projectionMatrix),ne.projectionMatrixInverse.copy(pe.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=Fd*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(x===null&&M===null))return m},this.setFoveation=function(ne){m=ne,x!==null&&(x.fixedFoveation=ne),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=ne)},this.hasDepthSensing=function(){return w.texture!==null};let k=null;function re(ne,pe){if(g=pe.getViewerPose(p||f),E=pe,g!==null){const we=g.views;M!==null&&(e.setRenderTargetFramebuffer(L,M.framebuffer),e.setRenderTarget(L));let _e=!1;we.length!==A.cameras.length&&(A.cameras.length=0,_e=!0);for(let Fe=0;Fe<we.length;Fe++){const Z=we[Fe];let gt=null;if(M!==null)gt=M.getViewport(Z);else{const nt=_.getViewSubImage(x,Z);gt=nt.viewport,Fe===0&&(e.setRenderTargetTextures(L,nt.colorTexture,x.ignoreDepthValues?void 0:nt.depthStencilTexture),e.setRenderTarget(L))}let be=R[Fe];be===void 0&&(be=new qn,be.layers.enable(Fe),be.viewport=new rn,R[Fe]=be),be.matrix.fromArray(Z.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(Z.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(gt.x,gt.y,gt.width,gt.height),Fe===0&&(A.matrix.copy(be.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),_e===!0&&A.cameras.push(be)}const Le=o.enabledFeatures;if(Le&&Le.includes("depth-sensing")){const Fe=_.getDepthInformation(we[0]);Fe&&Fe.isValid&&Fe.texture&&w.init(e,Fe,o.renderState)}}for(let we=0;we<N.length;we++){const _e=U[we],Le=N[we];_e!==null&&Le!==void 0&&Le.update(_e,pe,p||f)}w.render(e,A),k&&k(ne,pe),pe.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:pe}),E=null}const Ue=new _v;Ue.setAnimationLoop(re),this.setAnimationLoop=function(ne){k=ne},this.dispose=function(){}}}const Wr=new Si,u1=new Bt;function d1(r,e){function t(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function s(S,y){y.color.getRGB(S.fogColor.value,mv(r)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function o(S,y,L,N,U){y.isMeshBasicMaterial||y.isMeshLambertMaterial?l(S,y):y.isMeshToonMaterial?(l(S,y),_(S,y)):y.isMeshPhongMaterial?(l(S,y),g(S,y)):y.isMeshStandardMaterial?(l(S,y),x(S,y),y.isMeshPhysicalMaterial&&M(S,y,U)):y.isMeshMatcapMaterial?(l(S,y),E(S,y)):y.isMeshDepthMaterial?l(S,y):y.isMeshDistanceMaterial?(l(S,y),w(S,y)):y.isMeshNormalMaterial?l(S,y):y.isLineBasicMaterial?(f(S,y),y.isLineDashedMaterial&&d(S,y)):y.isPointsMaterial?m(S,y,L,N):y.isSpriteMaterial?p(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function l(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,t(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===Nn&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,t(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===Nn&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,t(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,t(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const L=e.get(y),N=L.envMap,U=L.envMapRotation;if(N&&(S.envMap.value=N,Wr.copy(U),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),S.envMapRotation.value.setFromMatrix4(u1.makeRotationFromEuler(Wr)),S.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap){S.lightMap.value=y.lightMap;const Y=r._useLegacyLights===!0?Math.PI:1;S.lightMapIntensity.value=y.lightMapIntensity*Y,t(y.lightMap,S.lightMapTransform)}y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,S.aoMapTransform))}function f(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform))}function d(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function m(S,y,L,N){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*L,S.scale.value=N*.5,y.map&&(S.map.value=y.map,t(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function p(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function g(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function _(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function x(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function M(S,y,L){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Nn&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=L.texture,S.transmissionSamplerSize.value.set(L.width,L.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,S.specularIntensityMapTransform))}function E(S,y){y.matcap&&(S.matcap.value=y.matcap)}function w(S,y){const L=e.get(y).light;S.referencePosition.value.setFromMatrixPosition(L.matrixWorld),S.nearDistance.value=L.shadow.camera.near,S.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:o}}function f1(r,e,t,s){let o={},l={},f=[];const d=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(L,N){const U=N.program;s.uniformBlockBinding(L,U)}function p(L,N){let U=o[L.id];U===void 0&&(E(L),U=g(L),o[L.id]=U,L.addEventListener("dispose",S));const Y=N.program;s.updateUBOMapping(L,Y);const I=e.render.frame;l[L.id]!==I&&(x(L),l[L.id]=I)}function g(L){const N=_();L.__bindingPointIndex=N;const U=r.createBuffer(),Y=L.__size,I=L.usage;return r.bindBuffer(r.UNIFORM_BUFFER,U),r.bufferData(r.UNIFORM_BUFFER,Y,I),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,N,U),U}function _(){for(let L=0;L<d;L++)if(f.indexOf(L)===-1)return f.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(L){const N=o[L.id],U=L.uniforms,Y=L.__cache;r.bindBuffer(r.UNIFORM_BUFFER,N);for(let I=0,O=U.length;I<O;I++){const W=Array.isArray(U[I])?U[I]:[U[I]];for(let R=0,A=W.length;R<A;R++){const D=W[R];if(M(D,I,R,Y)===!0){const G=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let te=0;for(let le=0;le<B.length;le++){const X=B[le],ce=w(X);typeof X=="number"||typeof X=="boolean"?(D.__data[0]=X,r.bufferSubData(r.UNIFORM_BUFFER,G+te,D.__data)):X.isMatrix3?(D.__data[0]=X.elements[0],D.__data[1]=X.elements[1],D.__data[2]=X.elements[2],D.__data[3]=0,D.__data[4]=X.elements[3],D.__data[5]=X.elements[4],D.__data[6]=X.elements[5],D.__data[7]=0,D.__data[8]=X.elements[6],D.__data[9]=X.elements[7],D.__data[10]=X.elements[8],D.__data[11]=0):(X.toArray(D.__data,te),te+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,D.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(L,N,U,Y){const I=L.value,O=N+"_"+U;if(Y[O]===void 0)return typeof I=="number"||typeof I=="boolean"?Y[O]=I:Y[O]=I.clone(),!0;{const W=Y[O];if(typeof I=="number"||typeof I=="boolean"){if(W!==I)return Y[O]=I,!0}else if(W.equals(I)===!1)return W.copy(I),!0}return!1}function E(L){const N=L.uniforms;let U=0;const Y=16;for(let O=0,W=N.length;O<W;O++){const R=Array.isArray(N[O])?N[O]:[N[O]];for(let A=0,D=R.length;A<D;A++){const G=R[A],B=Array.isArray(G.value)?G.value:[G.value];for(let te=0,le=B.length;te<le;te++){const X=B[te],ce=w(X),j=U%Y;j!==0&&Y-j<ce.boundary&&(U+=Y-j),G.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=U,U+=ce.storage}}}const I=U%Y;return I>0&&(U+=Y-I),L.__size=U,L.__cache={},this}function w(L){const N={boundary:0,storage:0};return typeof L=="number"||typeof L=="boolean"?(N.boundary=4,N.storage=4):L.isVector2?(N.boundary=8,N.storage=8):L.isVector3||L.isColor?(N.boundary=16,N.storage=12):L.isVector4?(N.boundary=16,N.storage=16):L.isMatrix3?(N.boundary=48,N.storage=48):L.isMatrix4?(N.boundary=64,N.storage=64):L.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",L),N}function S(L){const N=L.target;N.removeEventListener("dispose",S);const U=f.indexOf(N.__bindingPointIndex);f.splice(U,1),r.deleteBuffer(o[N.id]),delete o[N.id],delete l[N.id]}function y(){for(const L in o)r.deleteBuffer(o[L]);f=[],o={},l={}}return{bind:m,update:p,dispose:y}}class h1{constructor(e={}){const{canvas:t=rS(),context:s=null,depth:o=!0,stencil:l=!1,alpha:f=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:_=!1}=e;this.isWebGLRenderer=!0;let x;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=s.getContextAttributes().alpha}else x=f;const M=new Uint32Array(4),E=new Int32Array(4);let w=null,S=null;const y=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=pi,this._useLegacyLights=!1,this.toneMapping=yr,this.toneMappingExposure=1;const N=this;let U=!1,Y=0,I=0,O=null,W=-1,R=null;const A=new rn,D=new rn;let G=null;const B=new Et(0);let te=0,le=t.width,X=t.height,ce=1,j=null,K=null;const Q=new rn(0,0,le,X),k=new rn(0,0,le,X);let re=!1;const Ue=new Jd;let ne=!1,pe=!1;const we=new Bt,_e=new ue,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Fe(){return O===null?ce:1}let Z=s;function gt(P,J){return t.getContext(P,J)}try{const P={alpha:!0,depth:o,stencil:l,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:_};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Yd}`),t.addEventListener("webglcontextlost",b,!1),t.addEventListener("webglcontextrestored",H,!1),t.addEventListener("webglcontextcreationerror",q,!1),Z===null){const J="webgl2";if(Z=gt(J,P),Z===null)throw gt(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let be,nt,Xe,lt,it,ot,Tt,z,C,de,ge,Se,Me,We,Re,Ce,tt,Ae,He,ct,qe,Ie,st,ht;function bt(){be=new Sw(Z),be.init(),Ie=new i1(Z,be),nt=new mw(Z,be,e,Ie),Xe=new t1(Z),lt=new ww(Z),it=new jT,ot=new n1(Z,be,Xe,it,nt,Ie,lt),Tt=new vw(N),z=new yw(N),C=new PS(Z),st=new hw(Z,C),de=new Mw(Z,C,lt,st),ge=new Aw(Z,de,C,lt),He=new Tw(Z,nt,ot),Ce=new gw(it),Se=new BT(N,Tt,z,be,nt,st,Ce),Me=new d1(N,it),We=new VT,Re=new YT(be),Ae=new fw(N,Tt,z,Xe,ge,x,m),tt=new e1(N,ge,nt),ht=new f1(Z,lt,nt,Xe),ct=new pw(Z,be,lt),qe=new Ew(Z,be,lt),lt.programs=Se.programs,N.capabilities=nt,N.extensions=be,N.properties=it,N.renderLists=We,N.shadowMap=tt,N.state=Xe,N.info=lt}bt();const rt=new c1(N,Z);this.xr=rt,this.getContext=function(){return Z},this.getContextAttributes=function(){return Z.getContextAttributes()},this.forceContextLoss=function(){const P=be.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=be.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return ce},this.setPixelRatio=function(P){P!==void 0&&(ce=P,this.setSize(le,X,!1))},this.getSize=function(P){return P.set(le,X)},this.setSize=function(P,J,fe=!0){if(rt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}le=P,X=J,t.width=Math.floor(P*ce),t.height=Math.floor(J*ce),fe===!0&&(t.style.width=P+"px",t.style.height=J+"px"),this.setViewport(0,0,P,J)},this.getDrawingBufferSize=function(P){return P.set(le*ce,X*ce).floor()},this.setDrawingBufferSize=function(P,J,fe){le=P,X=J,ce=fe,t.width=Math.floor(P*fe),t.height=Math.floor(J*fe),this.setViewport(0,0,P,J)},this.getCurrentViewport=function(P){return P.copy(A)},this.getViewport=function(P){return P.copy(Q)},this.setViewport=function(P,J,fe,ae){P.isVector4?Q.set(P.x,P.y,P.z,P.w):Q.set(P,J,fe,ae),Xe.viewport(A.copy(Q).multiplyScalar(ce).round())},this.getScissor=function(P){return P.copy(k)},this.setScissor=function(P,J,fe,ae){P.isVector4?k.set(P.x,P.y,P.z,P.w):k.set(P,J,fe,ae),Xe.scissor(D.copy(k).multiplyScalar(ce).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(P){Xe.setScissorTest(re=P)},this.setOpaqueSort=function(P){j=P},this.setTransparentSort=function(P){K=P},this.getClearColor=function(P){return P.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor.apply(Ae,arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha.apply(Ae,arguments)},this.clear=function(P=!0,J=!0,fe=!0){let ae=0;if(P){let se=!1;if(O!==null){const Ne=O.texture.format;se=Ne===rv||Ne===iv||Ne===nv}if(se){const Ne=O.texture.type,je=Ne===Mr||Ne===ia||Ne===Jg||Ne===io||Ne===ev||Ne===tv,Ge=Ae.getClearColor(),Je=Ae.getClearAlpha(),at=Ge.r,ze=Ge.g,ut=Ge.b;je?(M[0]=at,M[1]=ze,M[2]=ut,M[3]=Je,Z.clearBufferuiv(Z.COLOR,0,M)):(E[0]=at,E[1]=ze,E[2]=ut,E[3]=Je,Z.clearBufferiv(Z.COLOR,0,E))}else ae|=Z.COLOR_BUFFER_BIT}J&&(ae|=Z.DEPTH_BUFFER_BIT),fe&&(ae|=Z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",b,!1),t.removeEventListener("webglcontextrestored",H,!1),t.removeEventListener("webglcontextcreationerror",q,!1),We.dispose(),Re.dispose(),it.dispose(),Tt.dispose(),z.dispose(),ge.dispose(),st.dispose(),ht.dispose(),Se.dispose(),rt.dispose(),rt.removeEventListener("sessionstart",St),rt.removeEventListener("sessionend",Sn),Zt.stop()};function b(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const P=lt.autoReset,J=tt.enabled,fe=tt.autoUpdate,ae=tt.needsUpdate,se=tt.type;bt(),lt.autoReset=P,tt.enabled=J,tt.autoUpdate=fe,tt.needsUpdate=ae,tt.type=se}function q(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function he(P){const J=P.target;J.removeEventListener("dispose",he),ve(J)}function ve(P){Ye(P),it.remove(P)}function Ye(P){const J=it.get(P).programs;J!==void 0&&(J.forEach(function(fe){Se.releaseProgram(fe)}),P.isShaderMaterial&&Se.releaseShaderCache(P))}this.renderBufferDirect=function(P,J,fe,ae,se,Ne){J===null&&(J=Le);const je=se.isMesh&&se.matrixWorld.determinant()<0,Ge=ic(P,J,fe,ae,se);Xe.setMaterial(ae,je);let Je=fe.index,at=1;if(ae.wireframe===!0){if(Je=de.getWireframeAttribute(fe),Je===void 0)return;at=2}const ze=fe.drawRange,ut=fe.attributes.position;let Dt=ze.start*at,Gt=(ze.start+ze.count)*at;Ne!==null&&(Dt=Math.max(Dt,Ne.start*at),Gt=Math.min(Gt,(Ne.start+Ne.count)*at)),Je!==null?(Dt=Math.max(Dt,0),Gt=Math.min(Gt,Je.count)):ut!=null&&(Dt=Math.max(Dt,0),Gt=Math.min(Gt,ut.count));const Jt=Gt-Dt;if(Jt<0||Jt===1/0)return;st.setup(se,ae,Ge,fe,Je);let Zn,vt=ct;if(Je!==null&&(Zn=C.get(Je),vt=qe,vt.setIndex(Zn)),se.isMesh)ae.wireframe===!0?(Xe.setLineWidth(ae.wireframeLinewidth*Fe()),vt.setMode(Z.LINES)):vt.setMode(Z.TRIANGLES);else if(se.isLine){let Qe=ae.linewidth;Qe===void 0&&(Qe=1),Xe.setLineWidth(Qe*Fe()),se.isLineSegments?vt.setMode(Z.LINES):se.isLineLoop?vt.setMode(Z.LINE_LOOP):vt.setMode(Z.LINE_STRIP)}else se.isPoints?vt.setMode(Z.POINTS):se.isSprite&&vt.setMode(Z.TRIANGLES);if(se.isBatchedMesh)se._multiDrawInstances!==null?vt.renderMultiDrawInstances(se._multiDrawStarts,se._multiDrawCounts,se._multiDrawCount,se._multiDrawInstances):vt.renderMultiDraw(se._multiDrawStarts,se._multiDrawCounts,se._multiDrawCount);else if(se.isInstancedMesh)vt.renderInstances(Dt,Jt,se.count);else if(fe.isInstancedBufferGeometry){const Qe=fe._maxInstanceCount!==void 0?fe._maxInstanceCount:1/0,ln=Math.min(fe.instanceCount,Qe);vt.renderInstances(Dt,Jt,ln)}else vt.render(Dt,Jt)};function $e(P,J,fe){P.transparent===!0&&P.side===gi&&P.forceSinglePass===!1?(P.side=Nn,P.needsUpdate=!0,Mi(P,J,fe),P.side=Sr,P.needsUpdate=!0,Mi(P,J,fe),P.side=gi):Mi(P,J,fe)}this.compile=function(P,J,fe=null){fe===null&&(fe=P),S=Re.get(fe),S.init(J),L.push(S),fe.traverseVisible(function(se){se.isLight&&se.layers.test(J.layers)&&(S.pushLight(se),se.castShadow&&S.pushShadow(se))}),P!==fe&&P.traverseVisible(function(se){se.isLight&&se.layers.test(J.layers)&&(S.pushLight(se),se.castShadow&&S.pushShadow(se))}),S.setupLights(N._useLegacyLights);const ae=new Set;return P.traverse(function(se){const Ne=se.material;if(Ne)if(Array.isArray(Ne))for(let je=0;je<Ne.length;je++){const Ge=Ne[je];$e(Ge,fe,se),ae.add(Ge)}else $e(Ne,fe,se),ae.add(Ne)}),L.pop(),S=null,ae},this.compileAsync=function(P,J,fe=null){const ae=this.compile(P,J,fe);return new Promise(se=>{function Ne(){if(ae.forEach(function(je){it.get(je).currentProgram.isReady()&&ae.delete(je)}),ae.size===0){se(P);return}setTimeout(Ne,10)}be.get("KHR_parallel_shader_compile")!==null?Ne():setTimeout(Ne,10)})};let pt=null;function Vt(P){pt&&pt(P)}function St(){Zt.stop()}function Sn(){Zt.start()}const Zt=new _v;Zt.setAnimationLoop(Vt),typeof self<"u"&&Zt.setContext(self),this.setAnimationLoop=function(P){pt=P,rt.setAnimationLoop(P),P===null?Zt.stop():Zt.start()},rt.addEventListener("sessionstart",St),rt.addEventListener("sessionend",Sn),this.render=function(P,J){if(J!==void 0&&J.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(J),J=rt.getCamera()),P.isScene===!0&&P.onBeforeRender(N,P,J,O),S=Re.get(P,L.length),S.init(J),L.push(S),we.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),Ue.setFromProjectionMatrix(we),pe=this.localClippingEnabled,ne=Ce.init(this.clippingPlanes,pe),w=We.get(P,y.length),w.init(),y.push(w),Vi(P,J,0,N.sortObjects),w.finish(),N.sortObjects===!0&&w.sort(j,K);const fe=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1;fe&&Ae.addToRenderList(w,P),this.info.render.frame++,ne===!0&&Ce.beginShadows();const ae=S.state.shadowsArray;tt.render(ae,P,J),ne===!0&&Ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const se=w.opaque,Ne=w.transmissive;if(S.setupLights(N._useLegacyLights),J.isArrayCamera){const je=J.cameras;if(Ne.length>0)for(let Ge=0,Je=je.length;Ge<Je;Ge++){const at=je[Ge];Gi(se,Ne,P,at)}fe&&Ae.render(P);for(let Ge=0,Je=je.length;Ge<Je;Ge++){const at=je[Ge];is(w,P,at,at.viewport)}}else Ne.length>0&&Gi(se,Ne,P,J),fe&&Ae.render(P),is(w,P,J);O!==null&&(ot.updateMultisampleRenderTarget(O),ot.updateRenderTargetMipmap(O)),P.isScene===!0&&P.onAfterRender(N,P,J),st.resetDefaultState(),W=-1,R=null,L.pop(),L.length>0?(S=L[L.length-1],ne===!0&&Ce.setGlobalState(N.clippingPlanes,S.state.camera)):S=null,y.pop(),y.length>0?w=y[y.length-1]:w=null};function Vi(P,J,fe,ae){if(P.visible===!1)return;if(P.layers.test(J.layers)){if(P.isGroup)fe=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(J);else if(P.isLight)S.pushLight(P),P.castShadow&&S.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Ue.intersectsSprite(P)){ae&&_e.setFromMatrixPosition(P.matrixWorld).applyMatrix4(we);const je=ge.update(P),Ge=P.material;Ge.visible&&w.push(P,je,Ge,fe,_e.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Ue.intersectsObject(P))){const je=ge.update(P),Ge=P.material;if(ae&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),_e.copy(P.boundingSphere.center)):(je.boundingSphere===null&&je.computeBoundingSphere(),_e.copy(je.boundingSphere.center)),_e.applyMatrix4(P.matrixWorld).applyMatrix4(we)),Array.isArray(Ge)){const Je=je.groups;for(let at=0,ze=Je.length;at<ze;at++){const ut=Je[at],Dt=Ge[ut.materialIndex];Dt&&Dt.visible&&w.push(P,je,Dt,fe,_e.z,ut)}}else Ge.visible&&w.push(P,je,Ge,fe,_e.z,null)}}const Ne=P.children;for(let je=0,Ge=Ne.length;je<Ge;je++)Vi(Ne[je],J,fe,ae)}function is(P,J,fe,ae){const se=P.opaque,Ne=P.transmissive,je=P.transparent;S.setupLightsView(fe),ne===!0&&Ce.setGlobalState(N.clippingPlanes,fe),ae&&Xe.viewport(A.copy(ae)),se.length>0&&rs(se,J,fe),Ne.length>0&&rs(Ne,J,fe),je.length>0&&rs(je,J,fe),Xe.buffers.depth.setTest(!0),Xe.buffers.depth.setMask(!0),Xe.buffers.color.setMask(!0),Xe.setPolygonOffset(!1)}function Gi(P,J,fe,ae){if((fe.isScene===!0?fe.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[ae.id]===void 0&&(S.state.transmissionRenderTarget[ae.id]=new ns(1,1,{generateMipmaps:!0,type:be.has("EXT_color_buffer_half_float")||be.has("EXT_color_buffer_float")?Ql:Mr,minFilter:Jr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1}));const Ne=S.state.transmissionRenderTarget[ae.id],je=ae.viewport||A;Ne.setSize(je.z,je.w);const Ge=N.getRenderTarget();N.setRenderTarget(Ne),N.getClearColor(B),te=N.getClearAlpha(),te<1&&N.setClearColor(16777215,.5),N.clear();const Je=N.toneMapping;N.toneMapping=yr;const at=ae.viewport;if(ae.viewport!==void 0&&(ae.viewport=void 0),S.setupLightsView(ae),ne===!0&&Ce.setGlobalState(N.clippingPlanes,ae),rs(P,fe,ae),ot.updateMultisampleRenderTarget(Ne),ot.updateRenderTargetMipmap(Ne),be.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let ut=0,Dt=J.length;ut<Dt;ut++){const Gt=J[ut],Jt=Gt.object,Zn=Gt.geometry,vt=Gt.material,Qe=Gt.group;if(vt.side===gi&&Jt.layers.test(ae.layers)){const ln=vt.side;vt.side=Nn,vt.needsUpdate=!0,Wi(Jt,fe,ae,Zn,vt,Qe),vt.side=ln,vt.needsUpdate=!0,ze=!0}}ze===!0&&(ot.updateMultisampleRenderTarget(Ne),ot.updateRenderTargetMipmap(Ne))}N.setRenderTarget(Ge),N.setClearColor(B,te),at!==void 0&&(ae.viewport=at),N.toneMapping=Je}function rs(P,J,fe){const ae=J.isScene===!0?J.overrideMaterial:null;for(let se=0,Ne=P.length;se<Ne;se++){const je=P[se],Ge=je.object,Je=je.geometry,at=ae===null?je.material:ae,ze=je.group;Ge.layers.test(fe.layers)&&Wi(Ge,J,fe,Je,at,ze)}}function Wi(P,J,fe,ae,se,Ne){P.onBeforeRender(N,J,fe,ae,se,Ne),P.modelViewMatrix.multiplyMatrices(fe.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),se.onBeforeRender(N,J,fe,ae,P,Ne),se.transparent===!0&&se.side===gi&&se.forceSinglePass===!1?(se.side=Nn,se.needsUpdate=!0,N.renderBufferDirect(fe,J,ae,se,P,Ne),se.side=Sr,se.needsUpdate=!0,N.renderBufferDirect(fe,J,ae,se,P,Ne),se.side=gi):N.renderBufferDirect(fe,J,ae,se,P,Ne),P.onAfterRender(N,J,fe,ae,se,Ne)}function Mi(P,J,fe){J.isScene!==!0&&(J=Le);const ae=it.get(P),se=S.state.lights,Ne=S.state.shadowsArray,je=se.state.version,Ge=Se.getParameters(P,se.state,Ne,J,fe),Je=Se.getProgramCacheKey(Ge);let at=ae.programs;ae.environment=P.isMeshStandardMaterial?J.environment:null,ae.fog=J.fog,ae.envMap=(P.isMeshStandardMaterial?z:Tt).get(P.envMap||ae.environment),ae.envMapRotation=ae.environment!==null&&P.envMap===null?J.environmentRotation:P.envMapRotation,at===void 0&&(P.addEventListener("dispose",he),at=new Map,ae.programs=at);let ze=at.get(Je);if(ze!==void 0){if(ae.currentProgram===ze&&ae.lightsStateVersion===je)return ss(P,Ge),ze}else Ge.uniforms=Se.getUniforms(P),P.onBuild(fe,Ge,N),P.onBeforeCompile(Ge,N),ze=Se.acquireProgram(Ge,Je),at.set(Je,ze),ae.uniforms=Ge.uniforms;const ut=ae.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(ut.clippingPlanes=Ce.uniform),ss(P,Ge),ae.needsLights=sc(P),ae.lightsStateVersion=je,ae.needsLights&&(ut.ambientLightColor.value=se.state.ambient,ut.lightProbe.value=se.state.probe,ut.directionalLights.value=se.state.directional,ut.directionalLightShadows.value=se.state.directionalShadow,ut.spotLights.value=se.state.spot,ut.spotLightShadows.value=se.state.spotShadow,ut.rectAreaLights.value=se.state.rectArea,ut.ltc_1.value=se.state.rectAreaLTC1,ut.ltc_2.value=se.state.rectAreaLTC2,ut.pointLights.value=se.state.point,ut.pointLightShadows.value=se.state.pointShadow,ut.hemisphereLights.value=se.state.hemi,ut.directionalShadowMap.value=se.state.directionalShadowMap,ut.directionalShadowMatrix.value=se.state.directionalShadowMatrix,ut.spotShadowMap.value=se.state.spotShadowMap,ut.spotLightMatrix.value=se.state.spotLightMatrix,ut.spotLightMap.value=se.state.spotLightMap,ut.pointShadowMap.value=se.state.pointShadowMap,ut.pointShadowMatrix.value=se.state.pointShadowMatrix),ae.currentProgram=ze,ae.uniformsList=null,ze}function Ar(P){if(P.uniformsList===null){const J=P.currentProgram.getUniforms();P.uniformsList=Ol.seqWithValue(J.seq,P.uniforms)}return P.uniformsList}function ss(P,J){const fe=it.get(P);fe.outputColorSpace=J.outputColorSpace,fe.batching=J.batching,fe.instancing=J.instancing,fe.instancingColor=J.instancingColor,fe.instancingMorph=J.instancingMorph,fe.skinning=J.skinning,fe.morphTargets=J.morphTargets,fe.morphNormals=J.morphNormals,fe.morphColors=J.morphColors,fe.morphTargetsCount=J.morphTargetsCount,fe.numClippingPlanes=J.numClippingPlanes,fe.numIntersection=J.numClipIntersection,fe.vertexAlphas=J.vertexAlphas,fe.vertexTangents=J.vertexTangents,fe.toneMapping=J.toneMapping}function ic(P,J,fe,ae,se){J.isScene!==!0&&(J=Le),ot.resetTextureUnits();const Ne=J.fog,je=ae.isMeshStandardMaterial?J.environment:null,Ge=O===null?N.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:Tr,Je=(ae.isMeshStandardMaterial?z:Tt).get(ae.envMap||je),at=ae.vertexColors===!0&&!!fe.attributes.color&&fe.attributes.color.itemSize===4,ze=!!fe.attributes.tangent&&(!!ae.normalMap||ae.anisotropy>0),ut=!!fe.morphAttributes.position,Dt=!!fe.morphAttributes.normal,Gt=!!fe.morphAttributes.color;let Jt=yr;ae.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(Jt=N.toneMapping);const Zn=fe.morphAttributes.position||fe.morphAttributes.normal||fe.morphAttributes.color,vt=Zn!==void 0?Zn.length:0,Qe=it.get(ae),ln=S.state.lights;if(ne===!0&&(pe===!0||P!==R)){const sn=P===R&&ae.id===W;Ce.setState(ae,P,sn)}let Ct=!1;ae.version===Qe.__version?(Qe.needsLights&&Qe.lightsStateVersion!==ln.state.version||Qe.outputColorSpace!==Ge||se.isBatchedMesh&&Qe.batching===!1||!se.isBatchedMesh&&Qe.batching===!0||se.isInstancedMesh&&Qe.instancing===!1||!se.isInstancedMesh&&Qe.instancing===!0||se.isSkinnedMesh&&Qe.skinning===!1||!se.isSkinnedMesh&&Qe.skinning===!0||se.isInstancedMesh&&Qe.instancingColor===!0&&se.instanceColor===null||se.isInstancedMesh&&Qe.instancingColor===!1&&se.instanceColor!==null||se.isInstancedMesh&&Qe.instancingMorph===!0&&se.morphTexture===null||se.isInstancedMesh&&Qe.instancingMorph===!1&&se.morphTexture!==null||Qe.envMap!==Je||ae.fog===!0&&Qe.fog!==Ne||Qe.numClippingPlanes!==void 0&&(Qe.numClippingPlanes!==Ce.numPlanes||Qe.numIntersection!==Ce.numIntersection)||Qe.vertexAlphas!==at||Qe.vertexTangents!==ze||Qe.morphTargets!==ut||Qe.morphNormals!==Dt||Qe.morphColors!==Gt||Qe.toneMapping!==Jt||Qe.morphTargetsCount!==vt)&&(Ct=!0):(Ct=!0,Qe.__version=ae.version);let Wt=Qe.currentProgram;Ct===!0&&(Wt=Mi(ae,J,se));let lo=!1,br=!1,ca=!1;const kt=Wt.getUniforms(),Ln=Qe.uniforms;if(Xe.useProgram(Wt.program)&&(lo=!0,br=!0,ca=!0),ae.id!==W&&(W=ae.id,br=!0),lo||R!==P){kt.setValue(Z,"projectionMatrix",P.projectionMatrix),kt.setValue(Z,"viewMatrix",P.matrixWorldInverse);const sn=kt.map.cameraPosition;sn!==void 0&&sn.setValue(Z,_e.setFromMatrixPosition(P.matrixWorld)),nt.logarithmicDepthBuffer&&kt.setValue(Z,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(ae.isMeshPhongMaterial||ae.isMeshToonMaterial||ae.isMeshLambertMaterial||ae.isMeshBasicMaterial||ae.isMeshStandardMaterial||ae.isShaderMaterial)&&kt.setValue(Z,"isOrthographic",P.isOrthographicCamera===!0),R!==P&&(R=P,br=!0,ca=!0)}if(se.isSkinnedMesh){kt.setOptional(Z,se,"bindMatrix"),kt.setOptional(Z,se,"bindMatrixInverse");const sn=se.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),kt.setValue(Z,"boneTexture",sn.boneTexture,ot))}se.isBatchedMesh&&(kt.setOptional(Z,se,"batchingTexture"),kt.setValue(Z,"batchingTexture",se._matricesTexture,ot));const Ei=fe.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&He.update(se,fe,Wt),(br||Qe.receiveShadow!==se.receiveShadow)&&(Qe.receiveShadow=se.receiveShadow,kt.setValue(Z,"receiveShadow",se.receiveShadow)),ae.isMeshGouraudMaterial&&ae.envMap!==null&&(Ln.envMap.value=Je,Ln.flipEnvMap.value=Je.isCubeTexture&&Je.isRenderTargetTexture===!1?-1:1),ae.isMeshStandardMaterial&&ae.envMap===null&&J.environment!==null&&(Ln.envMapIntensity.value=J.environmentIntensity),br&&(kt.setValue(Z,"toneMappingExposure",N.toneMappingExposure),Qe.needsLights&&rc(Ln,ca),Ne&&ae.fog===!0&&Me.refreshFogUniforms(Ln,Ne),Me.refreshMaterialUniforms(Ln,ae,ce,X,S.state.transmissionRenderTarget[P.id]),Ol.upload(Z,Ar(Qe),Ln,ot)),ae.isShaderMaterial&&ae.uniformsNeedUpdate===!0&&(Ol.upload(Z,Ar(Qe),Ln,ot),ae.uniformsNeedUpdate=!1),ae.isSpriteMaterial&&kt.setValue(Z,"center",se.center),kt.setValue(Z,"modelViewMatrix",se.modelViewMatrix),kt.setValue(Z,"normalMatrix",se.normalMatrix),kt.setValue(Z,"modelMatrix",se.matrixWorld),ae.isShaderMaterial||ae.isRawShaderMaterial){const sn=ae.uniformsGroups;for(let ua=0,ac=sn.length;ua<ac;ua++){const as=sn[ua];ht.update(as,Wt),ht.bind(as,Wt)}}return Wt}function rc(P,J){P.ambientLightColor.needsUpdate=J,P.lightProbe.needsUpdate=J,P.directionalLights.needsUpdate=J,P.directionalLightShadows.needsUpdate=J,P.pointLights.needsUpdate=J,P.pointLightShadows.needsUpdate=J,P.spotLights.needsUpdate=J,P.spotLightShadows.needsUpdate=J,P.rectAreaLights.needsUpdate=J,P.hemisphereLights.needsUpdate=J}function sc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(P,J,fe){it.get(P.texture).__webglTexture=J,it.get(P.depthTexture).__webglTexture=fe;const ae=it.get(P);ae.__hasExternalTextures=!0,ae.__autoAllocateDepthBuffer=fe===void 0,ae.__autoAllocateDepthBuffer||be.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ae.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,J){const fe=it.get(P);fe.__webglFramebuffer=J,fe.__useDefaultFramebuffer=J===void 0},this.setRenderTarget=function(P,J=0,fe=0){O=P,Y=J,I=fe;let ae=!0,se=null,Ne=!1,je=!1;if(P){const Je=it.get(P);Je.__useDefaultFramebuffer!==void 0?(Xe.bindFramebuffer(Z.FRAMEBUFFER,null),ae=!1):Je.__webglFramebuffer===void 0?ot.setupRenderTarget(P):Je.__hasExternalTextures&&ot.rebindTextures(P,it.get(P.texture).__webglTexture,it.get(P.depthTexture).__webglTexture);const at=P.texture;(at.isData3DTexture||at.isDataArrayTexture||at.isCompressedArrayTexture)&&(je=!0);const ze=it.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(ze[J])?se=ze[J][fe]:se=ze[J],Ne=!0):P.samples>0&&ot.useMultisampledRTT(P)===!1?se=it.get(P).__webglMultisampledFramebuffer:Array.isArray(ze)?se=ze[fe]:se=ze,A.copy(P.viewport),D.copy(P.scissor),G=P.scissorTest}else A.copy(Q).multiplyScalar(ce).floor(),D.copy(k).multiplyScalar(ce).floor(),G=re;if(Xe.bindFramebuffer(Z.FRAMEBUFFER,se)&&ae&&Xe.drawBuffers(P,se),Xe.viewport(A),Xe.scissor(D),Xe.setScissorTest(G),Ne){const Je=it.get(P.texture);Z.framebufferTexture2D(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_CUBE_MAP_POSITIVE_X+J,Je.__webglTexture,fe)}else if(je){const Je=it.get(P.texture),at=J||0;Z.framebufferTextureLayer(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Je.__webglTexture,fe||0,at)}W=-1},this.readRenderTargetPixels=function(P,J,fe,ae,se,Ne,je){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ge=it.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&je!==void 0&&(Ge=Ge[je]),Ge){Xe.bindFramebuffer(Z.FRAMEBUFFER,Ge);try{const Je=P.texture,at=Je.format,ze=Je.type;if(!nt.textureFormatReadable(at)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=P.width-ae&&fe>=0&&fe<=P.height-se&&Z.readPixels(J,fe,ae,se,Ie.convert(at),Ie.convert(ze),Ne)}finally{const Je=O!==null?it.get(O).__webglFramebuffer:null;Xe.bindFramebuffer(Z.FRAMEBUFFER,Je)}}},this.copyFramebufferToTexture=function(P,J,fe=0){const ae=Math.pow(2,-fe),se=Math.floor(J.image.width*ae),Ne=Math.floor(J.image.height*ae);ot.setTexture2D(J,0),Z.copyTexSubImage2D(Z.TEXTURE_2D,fe,0,0,P.x,P.y,se,Ne),Xe.unbindTexture()},this.copyTextureToTexture=function(P,J,fe,ae=0){const se=J.image.width,Ne=J.image.height,je=Ie.convert(fe.format),Ge=Ie.convert(fe.type);ot.setTexture2D(fe,0),Z.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,fe.flipY),Z.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,fe.premultiplyAlpha),Z.pixelStorei(Z.UNPACK_ALIGNMENT,fe.unpackAlignment),J.isDataTexture?Z.texSubImage2D(Z.TEXTURE_2D,ae,P.x,P.y,se,Ne,je,Ge,J.image.data):J.isCompressedTexture?Z.compressedTexSubImage2D(Z.TEXTURE_2D,ae,P.x,P.y,J.mipmaps[0].width,J.mipmaps[0].height,je,J.mipmaps[0].data):Z.texSubImage2D(Z.TEXTURE_2D,ae,P.x,P.y,je,Ge,J.image),ae===0&&fe.generateMipmaps&&Z.generateMipmap(Z.TEXTURE_2D),Xe.unbindTexture()},this.copyTextureToTexture3D=function(P,J,fe,ae,se=0){const Ne=P.max.x-P.min.x,je=P.max.y-P.min.y,Ge=P.max.z-P.min.z,Je=Ie.convert(ae.format),at=Ie.convert(ae.type);let ze;if(ae.isData3DTexture)ot.setTexture3D(ae,0),ze=Z.TEXTURE_3D;else if(ae.isDataArrayTexture||ae.isCompressedArrayTexture)ot.setTexture2DArray(ae,0),ze=Z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Z.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,ae.flipY),Z.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ae.premultiplyAlpha),Z.pixelStorei(Z.UNPACK_ALIGNMENT,ae.unpackAlignment);const ut=Z.getParameter(Z.UNPACK_ROW_LENGTH),Dt=Z.getParameter(Z.UNPACK_IMAGE_HEIGHT),Gt=Z.getParameter(Z.UNPACK_SKIP_PIXELS),Jt=Z.getParameter(Z.UNPACK_SKIP_ROWS),Zn=Z.getParameter(Z.UNPACK_SKIP_IMAGES),vt=fe.isCompressedTexture?fe.mipmaps[se]:fe.image;Z.pixelStorei(Z.UNPACK_ROW_LENGTH,vt.width),Z.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,vt.height),Z.pixelStorei(Z.UNPACK_SKIP_PIXELS,P.min.x),Z.pixelStorei(Z.UNPACK_SKIP_ROWS,P.min.y),Z.pixelStorei(Z.UNPACK_SKIP_IMAGES,P.min.z),fe.isDataTexture||fe.isData3DTexture?Z.texSubImage3D(ze,se,J.x,J.y,J.z,Ne,je,Ge,Je,at,vt.data):ae.isCompressedArrayTexture?Z.compressedTexSubImage3D(ze,se,J.x,J.y,J.z,Ne,je,Ge,Je,vt.data):Z.texSubImage3D(ze,se,J.x,J.y,J.z,Ne,je,Ge,Je,at,vt),Z.pixelStorei(Z.UNPACK_ROW_LENGTH,ut),Z.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,Dt),Z.pixelStorei(Z.UNPACK_SKIP_PIXELS,Gt),Z.pixelStorei(Z.UNPACK_SKIP_ROWS,Jt),Z.pixelStorei(Z.UNPACK_SKIP_IMAGES,Zn),se===0&&ae.generateMipmaps&&Z.generateMipmap(ze),Xe.unbindTexture()},this.initTexture=function(P){P.isCubeTexture?ot.setTextureCube(P,0):P.isData3DTexture?ot.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?ot.setTexture2DArray(P,0):ot.setTexture2D(P,0),Xe.unbindTexture()},this.resetState=function(){Y=0,I=0,O=null,Xe.reset(),st.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Kd?"display-p3":"srgb",t.unpackColorSpace=At.workingColorSpace===ec?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class p1 extends gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class m1 extends ao{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sv,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const yg={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class g1{constructor(e,t,s){const o=this;let l=!1,f=0,d=0,m;const p=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=s,this.itemStart=function(g){d++,l===!1&&o.onStart!==void 0&&o.onStart(g,f,d),l=!0},this.itemEnd=function(g){f++,o.onProgress!==void 0&&o.onProgress(g,f,d),f===d&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(g){o.onError!==void 0&&o.onError(g)},this.resolveURL=function(g){return m?m(g):g},this.setURLModifier=function(g){return m=g,this},this.addHandler=function(g,_){return p.push(g,_),this},this.removeHandler=function(g){const _=p.indexOf(g);return _!==-1&&p.splice(_,2),this},this.getHandler=function(g){for(let _=0,x=p.length;_<x;_+=2){const M=p[_],E=p[_+1];if(M.global&&(M.lastIndex=0),M.test(g))return E}return null}}}const v1=new g1;class ef{constructor(e){this.manager=e!==void 0?e:v1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const s=this;return new Promise(function(o,l){s.load(e,o,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}ef.DEFAULT_MATERIAL_NAME="__DEFAULT";const Oi={};class _1 extends Error{constructor(e,t){super(e),this.response=t}}class x1 extends ef{constructor(e){super(e)}load(e,t,s,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=yg.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0),l;if(Oi[e]!==void 0){Oi[e].push({onLoad:t,onProgress:s,onError:o});return}Oi[e]=[],Oi[e].push({onLoad:t,onProgress:s,onError:o});const f=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),d=this.mimeType,m=this.responseType;fetch(f).then(p=>{if(p.status===200||p.status===0){if(p.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||p.body===void 0||p.body.getReader===void 0)return p;const g=Oi[e],_=p.body.getReader(),x=p.headers.get("X-File-Size")||p.headers.get("Content-Length"),M=x?parseInt(x):0,E=M!==0;let w=0;const S=new ReadableStream({start(y){L();function L(){_.read().then(({done:N,value:U})=>{if(N)y.close();else{w+=U.byteLength;const Y=new ProgressEvent("progress",{lengthComputable:E,loaded:w,total:M});for(let I=0,O=g.length;I<O;I++){const W=g[I];W.onProgress&&W.onProgress(Y)}y.enqueue(U),L()}})}}});return new Response(S)}else throw new _1(`fetch for "${p.url}" responded with ${p.status}: ${p.statusText}`,p)}).then(p=>{switch(m){case"arraybuffer":return p.arrayBuffer();case"blob":return p.blob();case"document":return p.text().then(g=>new DOMParser().parseFromString(g,d));case"json":return p.json();default:if(d===void 0)return p.text();{const _=/charset="?([^;"\s]*)"?/i.exec(d),x=_&&_[1]?_[1].toLowerCase():void 0,M=new TextDecoder(x);return p.arrayBuffer().then(E=>M.decode(E))}}}).then(p=>{yg.add(e,p);const g=Oi[e];delete Oi[e];for(let _=0,x=g.length;_<x;_++){const M=g[_];M.onLoad&&M.onLoad(p)}}).catch(p=>{const g=Oi[e];if(g===void 0)throw this.manager.itemError(e),p;delete Oi[e];for(let _=0,x=g.length;_<x;_++){const M=g[_];M.onError&&M.onError(p)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Av extends gn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const wd=new Bt,Sg=new ue,Mg=new ue;class y1{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new Bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jd,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,s=this.matrix;Sg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sg),Mg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mg),t.updateMatrixWorld(),wd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wd),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(wd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class S1 extends y1{constructor(){super(new xv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class M1 extends Av{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.target=new gn,this.shadow=new S1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class E1 extends Av{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yd);class w1 extends ef{constructor(e){super(e)}load(e,t,s,o){const l=this,f=new x1(this.manager);f.setPath(this.path),f.setResponseType("arraybuffer"),f.setRequestHeader(this.requestHeader),f.setWithCredentials(this.withCredentials),f.load(e,function(d){try{t(l.parse(d))}catch(m){o?o(m):console.error(m),l.manager.itemError(e)}},s,o)}parse(e){function t(p){const g=new DataView(p),_=32/8*3+32/8*3*3+16/8,x=g.getUint32(80,!0);if(80+32/8+x*_===g.byteLength)return!0;const E=[115,111,108,105,100];for(let w=0;w<5;w++)if(s(E,g,w))return!1;return!0}function s(p,g,_){for(let x=0,M=p.length;x<M;x++)if(p[x]!==g.getUint8(_+x))return!1;return!0}function o(p){const g=new DataView(p),_=g.getUint32(80,!0);let x,M,E,w=!1,S,y,L,N,U;for(let D=0;D<70;D++)g.getUint32(D,!1)==1129270351&&g.getUint8(D+4)==82&&g.getUint8(D+5)==61&&(w=!0,S=new Float32Array(_*3*3),y=g.getUint8(D+6)/255,L=g.getUint8(D+7)/255,N=g.getUint8(D+8)/255,U=g.getUint8(D+9)/255);const Y=84,I=50,O=new Hi,W=new Float32Array(_*3*3),R=new Float32Array(_*3*3),A=new Et;for(let D=0;D<_;D++){const G=Y+D*I,B=g.getFloat32(G,!0),te=g.getFloat32(G+4,!0),le=g.getFloat32(G+8,!0);if(w){const X=g.getUint16(G+48,!0);(X&32768)===0?(x=(X&31)/31,M=(X>>5&31)/31,E=(X>>10&31)/31):(x=y,M=L,E=N)}for(let X=1;X<=3;X++){const ce=G+X*12,j=D*3*3+(X-1)*3;W[j]=g.getFloat32(ce,!0),W[j+1]=g.getFloat32(ce+4,!0),W[j+2]=g.getFloat32(ce+8,!0),R[j]=B,R[j+1]=te,R[j+2]=le,w&&(A.set(x,M,E).convertSRGBToLinear(),S[j]=A.r,S[j+1]=A.g,S[j+2]=A.b)}}return O.setAttribute("position",new Bn(W,3)),O.setAttribute("normal",new Bn(R,3)),w&&(O.setAttribute("color",new Bn(S,3)),O.hasColors=!0,O.alpha=U),O}function l(p){const g=new Hi,_=/solid([\s\S]*?)endsolid/g,x=/facet([\s\S]*?)endfacet/g,M=/solid\s(.+)/;let E=0;const w=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,S=new RegExp("vertex"+w+w+w,"g"),y=new RegExp("normal"+w+w+w,"g"),L=[],N=[],U=[],Y=new ue;let I,O=0,W=0,R=0;for(;(I=_.exec(p))!==null;){W=R;const A=I[0],D=(I=M.exec(A))!==null?I[1]:"";for(U.push(D);(I=x.exec(A))!==null;){let te=0,le=0;const X=I[0];for(;(I=y.exec(X))!==null;)Y.x=parseFloat(I[1]),Y.y=parseFloat(I[2]),Y.z=parseFloat(I[3]),le++;for(;(I=S.exec(X))!==null;)L.push(parseFloat(I[1]),parseFloat(I[2]),parseFloat(I[3])),N.push(Y.x,Y.y,Y.z),te++,R++;le!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+E),te!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+E),E++}const G=W,B=R-W;g.userData.groupNames=U,g.addGroup(G,B,O),O++}return g.setAttribute("position",new Bi(L,3)),g.setAttribute("normal",new Bi(N,3)),g}function f(p){return typeof p!="string"?new TextDecoder().decode(p):p}function d(p){if(typeof p=="string"){const g=new Uint8Array(p.length);for(let _=0;_<p.length;_++)g[_]=p.charCodeAt(_)&255;return g.buffer||g}else return p}const m=d(e);return t(m)?o(m):l(f(e))}}function T1({src:r}){const e=me.useRef(null);return me.useEffect(()=>{const t=e.current;if(!t||!r)return;let s=!1;const o=document.createElement("canvas");o.style.display="block",o.style.width="100%",o.style.height="100%",t.replaceChildren(o);const l=new h1({canvas:o,antialias:!0,alpha:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2));const f=new p1,d=new qn(45,1,.01,100);d.position.set(0,0,2.2),f.add(new E1(16777215,.85));const m=new M1(16777215,.65);m.position.set(2,3,4),f.add(m);const p=new Ja;f.add(p);const g=new m1({color:10135740,metalness:.05,roughness:.72,side:gi}),_=new w1;let x=null,M=0,E=!1,w=0,S=0,y=0;const L=R=>{const A=new oa().setFromObject(R),D=A.getSize(new ue),G=A.getCenter(new ue),te=1.5/Math.max(D.x,D.y,D.z,1e-6);R.scale.setScalar(te),R.position.sub(G.multiplyScalar(te))},N=()=>{const R=t.clientWidth||1,A=t.clientHeight||1;l.setSize(R,A,!1),d.aspect=R/A,d.updateProjectionMatrix()},U=()=>{s||(E||(S+=.004),p.rotation.y=S,p.rotation.x=y,l.render(f,d),M=requestAnimationFrame(U))},Y=R=>{R.button===0&&(E=!0,w=R.clientX,o.setPointerCapture(R.pointerId))},I=R=>{if(!E)return;const A=R.clientX-w;w=R.clientX,S+=A*.012},O=()=>{E=!1};o.addEventListener("pointerdown",Y),o.addEventListener("pointermove",I),o.addEventListener("pointerup",O),o.addEventListener("pointercancel",O);const W=new ResizeObserver(()=>N());return W.observe(t),N(),_.loadAsync(r).then(R=>{if(s){R.dispose();return}R.computeVertexNormals(),x=new xi(R,g),p.add(x),L(x),U()}).catch(()=>{s||(t.dataset.error="1")}),()=>{s=!0,cancelAnimationFrame(M),W.disconnect(),o.removeEventListener("pointerdown",Y),o.removeEventListener("pointermove",I),o.removeEventListener("pointerup",O),o.removeEventListener("pointercancel",O),x&&(x.geometry.dispose(),g.dispose()),l.dispose(),t.replaceChildren()}},[r]),r?u.jsx("div",{ref:e,className:"stl-preview-host","aria-hidden":!0}):null}function A1({app:r}){const e=r.file||"データなし（予約のみ）",t=r.fileSize?(r.fileSize/1048576).toFixed(2)+" MB":null,s=r.file?Lx(r.id):null;return u.jsxs("div",{className:"stl",children:[u.jsx("div",{className:"stl-canvas",children:s?u.jsx(T1,{src:s}):u.jsxs(u.Fragment,{children:[u.jsx("span",{className:"stl-tag",children:r.kind==="request"?"STL":"RESERVE"}),u.jsx("span",{className:"stl-note",children:r.kind==="request"?"サムネイル未生成":"データ提出なし"})]})}),u.jsxs("div",{className:"stl-meta",children:[u.jsx("span",{className:"stl-ext",children:r.file?r.file.split(".").pop().toUpperCase():"—"}),u.jsxs("span",{className:"stl-name",children:[u.jsx("b",{className:"num",children:e}),u.jsx("span",{children:t?`${t} ・ 更新 ${Z0(r.createdAt??"")}`:"予約枠のみの申請"})]}),u.jsxs("span",{className:"stl-actions",children:[u.jsx("a",{className:"mini",href:s??void 0,download:r.file||void 0,style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"DL"}),u.jsx("a",{className:"mini",href:s??void 0,target:"_blank",rel:"noreferrer",style:{textDecoration:"none",pointerEvents:s?"auto":"none",opacity:s?1:.45},children:"開く"})]})]})]})}function b1({app:r,selected:e,onToggle:t,disabled:s}){mn(r);const o=Vd(r);return u.jsx("div",{className:"slotgrid",role:"group","aria-label":"時間帯（30分単位）",children:o.map(l=>{const f=e.indexOf(l)>=0;return u.jsxs("button",{type:"button",disabled:s,className:"slot-chip"+(f?" on":""),onClick:()=>t(l),"aria-pressed":f,children:[u.jsx("span",{className:"num",children:qt(eo(l))}),u.jsx("span",{className:"slot-dur num",children:"30分"})]},l)})})}function C1({app:r,onPartial:e,onCancelAll:t,onApproveRequest:s,onMove:o}){const[l,f]=me.useState([]),[d,m]=me.useState(null),[p,g]=me.useState(null),[_,x]=me.useState(""),[M,E]=me.useState("");me.useEffect(()=>{f([]),m(null),g(null),E(""),x(r.adminNote||"")},[r.id]);const w=Vd(r),S=W=>f(R=>R.indexOf(W)>=0?R.filter(A=>A!==W):R.concat(W).sort((A,D)=>A-D)),y=l.length===w.length,L=()=>f(y?[]:w.slice()),N=r.status==="pending"||r.status==="approved",U=l.length>0&&!y,Y=l.length?`${qt(eo(l[0]))}〜${qt(eo(l[l.length-1])+Qs)}（${l.length}枠・${Kl(l.length*Qs)}）`:"",I=()=>{if(!p){E("理由を1つ選んでください");return}const W=Gp.find(R=>R.id===p);l.length?e(r,l,"cancelled",{cancelReason:W.id,adminNote:_||W.body,reason:W}):t(r,W,_)},O=()=>{if(!p){E("理由を1つ選んでください");return}const W=Wp.find(R=>R.id===p);l.length?e(r,l,"rejected",{rejectReason:W.id,adminNote:_||W.body,reason:W}):t(r,W,_,"rejected")};return u.jsxs("div",{className:"slotacts",children:[u.jsxs("div",{className:"ftitle",style:{marginBottom:6},children:[u.jsx("span",{children:"時間単位で操作"}),u.jsx("button",{type:"button",className:"linkbtn",onClick:L,children:y?"選択を解除":"すべて選択"})]}),u.jsx(b1,{app:r,selected:l,onToggle:S,disabled:!N}),u.jsx("div",{className:"selbar"+(l.length?" on":""),children:l.length?u.jsxs(u.Fragment,{children:[u.jsx("b",{className:"num",children:Y}),u.jsx("span",{children:U?"この枠だけを操作します（残りはそのまま）":"申請全体を操作します"})]}):u.jsx("span",{children:"枠を選ぶと、その時間だけを取り消し・承認できます。未選択なら申請全体が対象です。"})}),N&&u.jsxs("div",{className:"actrow",children:[r.status==="pending"&&u.jsxs("button",{type:"button",className:"btn btn-primary",onClick:()=>l.length?e(r,l,"approved",{}):s(r),children:["承認",U?`（${l.length}枠）`:""]}),u.jsx("button",{type:"button",className:"btn btn-secondary move",onClick:()=>o&&o(r),children:"別の日へ変更"}),u.jsx("button",{type:"button",className:"btn btn-danger",onClick:()=>{m(d==="cancel"?null:"cancel"),g(null),E("")},children:"取り消し…"}),r.status==="pending"&&u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>{m(d==="reject"?null:"reject"),g(null),E("")},children:"却下…"})]}),!N&&u.jsx("div",{className:"note tip",children:u.jsxs("span",{children:["この申請は ",u.jsx("b",{children:ea[r.status]})," です。必要なら「申請中に戻す」で復帰できます。"]})}),N&&d==="cancel"&&u.jsxs("div",{className:"reasonblock",children:[u.jsxs("div",{className:"ftitle",children:["取り消しの理由",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("div",{className:"reasons",children:Gp.map(W=>u.jsxs("button",{type:"button",className:"reason"+(p===W.id?" on":""),onClick:()=>{g(W.id),E("")},children:[u.jsx("i",{}),u.jsxs("span",{children:[u.jsx("b",{children:W.label}),u.jsx("span",{children:W.body})]})]},W.id))}),u.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者への連絡（任意）"}),u.jsx("textarea",{className:"textarea",value:_,maxLength:200,onChange:W=>x(W.target.value),placeholder:"理由に補足があれば書きます"}),M&&u.jsx("div",{className:"note warn",style:{marginTop:6},children:u.jsx("span",{children:M})}),u.jsxs("div",{className:"actrow end",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{m(null),E("")},children:"やめる"}),u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:I,children:U?`${l.length}枠を取り消す`:"この申請を取り消す"})]})]}),N&&d==="reject"&&u.jsxs("div",{className:"reasonblock",children:[u.jsxs("div",{className:"ftitle",children:["却下の理由",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("div",{className:"reasons",children:Wp.map(W=>u.jsxs("button",{type:"button",className:"reason"+(p===W.id?" on":""),onClick:()=>{g(W.id),E("")},children:[u.jsx("i",{}),u.jsxs("span",{children:[u.jsx("b",{children:W.label}),u.jsx("span",{children:W.body})]})]},W.id))}),u.jsx("div",{className:"ftitle",style:{marginTop:8},children:"申請者へのメッセージ（任意）"}),u.jsx("textarea",{className:"textarea",value:_,maxLength:200,onChange:W=>x(W.target.value),placeholder:"選んだ理由に補足があれば書きます"}),M&&u.jsx("div",{className:"note warn",style:{marginTop:6},children:u.jsx("span",{children:M})}),u.jsxs("div",{className:"actrow end",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{m(null),E("")},children:"やめる"}),u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:O,children:U?`${l.length}枠を却下`:"この申請を却下"})]})]}),r.status!=="pending"&&u.jsxs("div",{className:"actrow",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","pending"),children:"申請中に戻す"}),r.status==="approved"&&u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>t(r,null,"","done"),children:"完了にする"})]}),u.jsxs("div",{className:"memo",children:[u.jsxs("div",{className:"ftitle",style:{justifyContent:"space-between"},children:[u.jsxs("span",{children:["担当者メモ",r.adminNote?"（保存済み）":""]}),u.jsx("button",{type:"button",className:"linkbtn",onClick:()=>m(d==="note"?null:"note"),children:d==="note"?"閉じる":"書く"})]}),r.adminNote&&d!=="note"&&u.jsx("div",{className:"note tip",children:u.jsx("span",{children:r.adminNote})}),d==="note"&&u.jsxs("div",{style:{display:"grid",gap:6},children:[u.jsx("textarea",{className:"textarea",value:_,maxLength:200,onChange:W=>x(W.target.value),placeholder:"印刷条件や受け取りの指示"}),u.jsx("div",{className:"presets",children:n0.map(W=>u.jsxs("button",{type:"button",className:"preset",onClick:()=>x(W),children:[W.slice(0,12),"…"]},W))}),u.jsxs("div",{className:"actrow end",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>m(null),children:"キャンセル"}),u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{t(r,null,_.trim(),null,"note"),m(null)},children:"メモを保存"})]})]})]})]})}function R1({app:r,onClose:e,onPartial:t,onCancelAll:s,onApproveRequest:o,onMove:l,log:f}){if(!r)return null;const d=mn(r),m=no(r.date),p=f.filter(g=>g.appId===r.id).sort((g,_)=>_.at.localeCompare(g.at));return u.jsxs(Y0,{open:!!r,title:r.title,onClose:e,sub:u.jsxs(u.Fragment,{children:[u.jsx("span",{className:"num",style:{whiteSpace:"nowrap"},children:jd(r.date)}),u.jsx("span",{children:"·"}),u.jsx("span",{style:{whiteSpace:"nowrap"},children:yi[r.machine].name})]}),footer:u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[u.jsxs("div",{className:"rv-flags",children:[u.jsx(Ys,{kind:r.kind}),u.jsx(Rd,{status:r.status}),l0(r)&&u.jsx(Hl,{tone:"warn",children:"当日・締切超過"}),u.jsxs(Hl,{children:["申請 ",V0(r.createdAt)]})]}),u.jsxs("dl",{className:"kv",children:[u.jsxs("div",{children:[u.jsx("dt",{children:"時間"}),u.jsxs("dd",{className:"num",children:[r.kind==="request"?"16:30〜20:00":`${qt(d.start)}〜${qt(d.end)}`,u.jsx("small",{children:r.kind==="request"?"（依頼枠を丸ごと占有）":`（${Kl(d.end-d.start)}）`})]})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"機種"}),u.jsxs("dd",{children:[yi[r.machine].name,u.jsxs("small",{children:["／ ",yi[r.machine].maker]})]})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"担当"}),u.jsx("dd",{children:m.length?m.map(g=>Ug(g)).join(" / "):"休み"})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"申請者"}),u.jsxs("dd",{children:[r.who.name,u.jsxs("small",{children:["（",ji(r.who.hr),"・",r.who.num,"番）"]})]})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"種別"}),u.jsxs("dd",{children:[li[r.kind],u.jsx("small",{children:r.kind==="request"?"STL提出あり":"データ提出なし"})]})]})]}),u.jsxs("div",{children:[u.jsx("div",{className:"ftitle",children:"印刷データ"}),u.jsx(A1,{app:r})]}),r.note&&u.jsxs("div",{children:[u.jsx("div",{className:"ftitle",children:"申請者の備考"}),u.jsx("div",{className:"note tip",children:u.jsx("span",{children:r.note})})]}),u.jsx(C1,{app:r,onPartial:t,onCancelAll:s,onApproveRequest:o,onMove:l}),p.length>0&&u.jsxs("div",{children:[u.jsx("div",{className:"ftitle",children:"この申請の履歴"}),p.map(g=>u.jsxs("div",{className:"log-item "+g.type,children:[u.jsx("span",{className:"bd"}),u.jsxs("span",{className:"tx",children:[g.text,u.jsxs("span",{className:"at",children:[u.jsx("span",{className:"who",children:g.actor}),G0(g.at)]})]})]},g.id))]})]})}function N1({apps:r,selected:e,onPick:t,onOpen:s,onApprove:o,onCancel:l,onPartial:f,log:d,onDownload:m,onDownloadAll:p,onMove:g}){const _=Og(r,e),x=no(e),M=e<ci,E=_.live.length;return u.jsxs("div",{className:"rs-grid",children:[u.jsx("div",{className:"rs-main",children:u.jsx(q0,{apps:r,avail:null,selected:e,onPick:t})}),u.jsx("div",{className:"rs-side",children:u.jsxs("div",{className:"card daycard",children:[u.jsxs("div",{className:"daycard-h",children:[u.jsx("span",{className:"dc-date num",children:Ad(e)}),u.jsx("span",{className:"dc-wd",children:wr[zn(e).getDay()]}),e===ci&&u.jsx(Hl,{tone:"orange",children:"今日"}),M&&u.jsx(Hl,{children:"過ぎた日"}),u.jsx("span",{className:"dc-staff",children:x.length?x.map(w=>u.jsx(Xg,{id:w,small:!0},w)):u.jsx("span",{className:"mtag none",children:"休み"})})]}),u.jsxs("div",{className:"daycard-counts",children:[u.jsxs("span",{className:"dc-c req",children:[u.jsx(Ys,{kind:"request",size:"sm"}),u.jsx("b",{className:"num",children:_.requests.length})]}),u.jsxs("span",{className:"dc-c res",children:[u.jsx(Ys,{kind:"reserve",size:"sm"}),u.jsx("b",{className:"num",children:_.reserves.length})]}),_.pending>0&&u.jsxs("span",{className:"dc-pend num",children:["申請中 ",_.pending]}),E>0&&u.jsxs("button",{type:"button",className:"btn btn-dl btn-sm dc-dl",onClick:()=>p(e),children:[u.jsx(Gu,{}),"この日の申請を一括DL（",E,"件）"]})]}),u.jsxs("div",{className:"dgroups",children:[["request","reserve"].map(w=>{const S=(w==="request"?_.requests:_.reserves).sort((L,N)=>mn(L).start-mn(N).start||Qa.indexOf(L.machine)-Qa.indexOf(N.machine)),y=S.filter(L=>L.status==="pending").length;return u.jsxs("div",{className:"dgroup",children:[u.jsxs("div",{className:"dg-head "+w,children:[u.jsx(Ys,{kind:w}),u.jsxs("span",{className:"num",children:[S.length,"件"]}),y>0&&u.jsxs("span",{className:"dg-pend num",children:["申請中 ",y]})]}),S.length===0?u.jsxs("div",{className:"dg-empty",children:["この日の",li[w],"はありません。"]}):S.map(L=>{const N=mn(L);return u.jsxs("div",{className:"drow "+L.status,children:[u.jsxs("span",{className:"dr-time num",children:[u.jsx("b",{children:qt(N.start)}),u.jsx("span",{children:qt(N.end)})]}),u.jsxs("span",{className:"dr-main",children:[u.jsx("span",{className:"dr-title",children:L.title}),u.jsxs("span",{className:"dr-sub",children:[u.jsx(Rd,{status:L.status}),u.jsx(B0,{id:L.machine}),yi[L.machine].short,u.jsx("span",{children:"·"}),L.who.name,L.file&&u.jsxs(u.Fragment,{children:[u.jsx("span",{children:"·"}),u.jsx("span",{className:"num",children:L.file})]})]})]}),u.jsxs("span",{className:"dr-acts",children:[L.status==="pending"&&u.jsx("button",{type:"button",className:"mini ok",onClick:()=>o(L),children:"承認"}),(L.status==="pending"||L.status==="approved"||L.status==="done")&&u.jsx("button",{type:"button",className:"mini move",onClick:()=>g(L),children:"変更"}),(L.status==="pending"||L.status==="approved")&&u.jsx("button",{type:"button",className:"mini no",onClick:()=>s(L,"cancel"),children:"取り消し"}),u.jsxs("span",{className:"dr-dl",children:[u.jsxs("button",{type:"button",className:"mini dl",onClick:()=>m(L),title:"この申請のテキストをダウンロード","aria-label":`${L.title} をダウンロード`,children:[u.jsx(Gu,{}),"DL"]}),L.file&&u.jsx("button",{type:"button",className:"mini dl icon-only",onClick:()=>m(L,"file"),title:`${L.file} をダウンロード`,"aria-label":`${L.file} をダウンロード`,children:u.jsx(Gu,{})})]}),u.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(L),"aria-label":"詳細",children:"›"})]})]},L.id)})]},w)}),_.cancelled.length>0&&u.jsxs("details",{className:"dcan",children:[u.jsxs("summary",{className:"num",children:["取り消し・却下 ",_.cancelled.length,"件"]}),_.cancelled.map(w=>{const S=mn(w);return u.jsxs("div",{className:"drow cancelled",children:[u.jsxs("span",{className:"dr-time num",children:[u.jsx("b",{children:qt(S.start)}),u.jsx("span",{children:qt(S.end)})]}),u.jsxs("span",{className:"dr-main",children:[u.jsx("span",{className:"dr-title",children:w.title}),u.jsxs("span",{className:"dr-sub",children:[u.jsx(Rd,{status:w.status}),u.jsx("span",{children:w.who.name}),u.jsx("span",{children:"·"}),u.jsx("span",{children:w.adminNote||"理由なし"})]})]}),u.jsxs("span",{className:"dr-acts",children:[u.jsx("button",{type:"button",className:"mini",onClick:()=>l(w,null,"","pending"),children:"戻す"}),u.jsx("button",{type:"button",className:"mini arrow",onClick:()=>s(w),children:"›"})]})]},w.id)})]})]})]})})]})}function P1(r,e){return r.filter(t=>$s(t.id,e))}function L1({open:r,app:e,members:t,busy:s,onClose:o,onConfirm:l}){const[f,d]=me.useState(null);me.useEffect(()=>{r||d(null)},[r,e==null?void 0:e.id]);const m=me.useMemo(()=>e?P1(t,e.date):[],[e,t]);return me.useEffect(()=>{!r||!m.length||f&&m.some(p=>p.id===f)||d(m[0].id)},[r,m,f]),e?u.jsxs(qg,{open:r,title:"印刷担当者を選んで承認",sub:`${jd(e.date)} · ${e.title}`,onClose:s?()=>{}:o,footer:u.jsxs(u.Fragment,{children:[u.jsx("button",{type:"button",className:"btn btn-secondary",disabled:s,onClick:o,children:"キャンセル"}),u.jsx("button",{type:"button",className:"btn btn-primary",disabled:s||!f||!m.length,"data-testid":"approve-staff-confirm",onClick:()=>f&&l(f),children:s?"承認中…":"承認する"})]}),children:[u.jsx("p",{className:"hint",style:{margin:"0 0 12px"},children:"この日のシフトに入っている担当者のうち、承認後の印刷担当を選びます。"}),m.length===0?u.jsx("div",{className:"note warn",children:u.jsx("span",{children:"この日にシフトが入っている担当者がいません。シフト表で担当を追加してから承認してください。"})}):u.jsx("div",{className:"approve-staff-list",role:"listbox","aria-label":"当日の担当者",children:m.map(p=>u.jsxs("button",{type:"button",role:"option","aria-selected":f===p.id,className:"approve-staff-opt"+(f===p.id?" on":""),onClick:()=>d(p.id),children:[u.jsx(Xg,{id:p.id}),u.jsx("span",{children:Ug(p.id)})]},p.id))})]}):null}function D1({year:r,month:e,app:t,apps:s,onChangeMonth:o,onJumpToday:l}){const{run:f,enterClass:d}=qd(),m=`${r}-${yn(e)}`,p=d0(r,e);return u.jsxs("div",{className:"mm",children:[u.jsxs("div",{className:"mm-h",children:[u.jsx("button",{type:"button",onClick:()=>f(-1,()=>o(-1)),"aria-label":"前の月",children:"‹"}),u.jsx("div",{className:d,children:u.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]})},`label-${m}`),u.jsx("button",{type:"button",onClick:()=>f(1,()=>o(1)),"aria-label":"次の月",children:"›"}),u.jsx("button",{type:"button",className:"mini",onClick:l,children:"今月"})]}),u.jsx("div",{className:"cal-period-shell",children:u.jsxs("div",{className:d,children:[u.jsx("div",{className:"mm-wds",children:wr.map((g,_)=>u.jsx("span",{className:"mm-wd"+(_===0?" sun":_===6?" sat":""),children:g},g))}),u.jsx("div",{className:"mm-grid",children:p.map((g,_)=>{if(!g)return u.jsx("span",{className:"mm-cell pad"},"p"+_);const x=Yn(g),M=kg(s,t,x),E=M.sameDay?"current":M.past?"past":M.full?"full":M.noStaff?"nostaff":"ok";return u.jsxs("button",{type:"button","data-date":x,className:"mm-cell "+E,onClick:()=>!M.past&&!M.sameDay&&o(0,x),"aria-label":`${g.getMonth()+1}月${g.getDate()}日 ${M.full?"埋まり":M.noStaff?"担当なし":"空き"}`,children:[u.jsx("span",{className:"num mm-d",children:g.getDate()}),u.jsx("span",{className:"mm-meta",children:M.sameDay?"現在":M.past?"—":M.noStaff?"担当なし":M.full?"満枠":`空き ${M.free}枠`}),M.liveCount>0&&!M.past&&u.jsx("span",{className:"mm-count num",children:M.liveCount})]},x)})})]},m)})]})}function U1({open:r,app:e,apps:t,onClose:s,onMove:o}){const[l,f]=me.useState(()=>{const y=e?zn(e.date):new Date;return{y:y.getFullYear(),m:y.getMonth()+1}}),[d,m]=me.useState(null),[p,g]=me.useState(!1);if(me.useEffect(()=>{if(!e)return;const y=zn(e.date);f({y:y.getFullYear(),m:y.getMonth()+1}),m(null),g(!1)},[e&&e.id,r]),!r||!e)return null;const _=(y,L)=>{if(L){m(L);return}if(y===0){const N=new Date;f({y:N.getFullYear(),m:N.getMonth()+1});return}f(N=>{let U=N.y,Y=N.m+y;return Y<1&&(Y=12,U-=1),Y>12&&(Y=1,U+=1),{y:U,m:Y}})},x=d?kg(t,e,d):null,E=!!(x&&(x.full||x.noStaff)),w=mn(e),S=()=>{o(e,d,{forced:E&&p,info:x}),m(null),g(!1)};return u.jsx(qg,{open:r,wide:!0,title:"別の日へ変更",sub:u.jsxs(u.Fragment,{children:[u.jsx("span",{children:e.title}),u.jsx("span",{children:"·"}),u.jsx("span",{className:"num",children:jd(e.date)}),u.jsx("span",{children:"·"}),u.jsx("span",{children:li[e.kind]})]}),onClose:s,footer:u.jsxs(u.Fragment,{children:[u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:s,children:"閉じる"}),u.jsx("button",{type:"button",className:"btn btn-primary",disabled:!d||E&&!p,onClick:S,children:d?`${Ad(d)} に変更`:"日付を選択"})]}),children:u.jsxs("div",{className:"mv-body",children:[u.jsxs("div",{className:"mv-note",children:[u.jsxs("b",{children:[qt(w.start),"〜",qt(w.end)]}),u.jsx("span",{className:"mv-sep",children:"|"}),u.jsxs("span",{children:[yi[e.machine].name," ・ ",e.status==="approved"?"確定済みでも変更できます":"時間帯はそのまま移動します"]})]}),u.jsx(D1,{year:l.y,month:l.m,app:e,apps:t,onChangeMonth:_,onJumpToday:()=>_(0)}),u.jsxs("div",{className:"mv-legend",children:[u.jsx("span",{className:"mv-lg ok",children:"空き"}),u.jsx("span",{className:"mv-lg nostaff",children:"担当なし"}),u.jsx("span",{className:"mv-lg full",children:"満枠"}),u.jsx("span",{className:"mv-lg past",children:"過ぎた日"})]}),d&&x&&u.jsxs("div",{className:"mv-picked "+(x.full?"full":x.noStaff?"nostaff":"ok"),children:[u.jsxs("div",{className:"mvp-h",children:[u.jsxs("b",{className:"num",children:[Ad(x.date),"（",wr[zn(x.date).getDay()],"）"]}),u.jsx("span",{className:"mvp-state",children:x.noStaff?"担当者がいません":x.full?"満枠です":`空き ${x.free}/${x.total}枠`})]}),u.jsxs("div",{className:"mvp-meta",children:[u.jsxs("span",{children:["担当：",x.staffs.length?x.staffs.map(y=>Hd(y)).join(" / "):"なし"]}),u.jsxs("span",{children:["この日の申請：",u.jsxs("span",{className:"num",children:[x.liveCount,"件"]})]})]}),E&&u.jsxs("label",{className:"mv-force",children:[u.jsx("input",{type:"checkbox",checked:p,onChange:y=>g(y.target.checked)}),u.jsxs("span",{children:[u.jsx("b",{children:x.noStaff?"担当者がいない日にも変更する":"満枠でも強制的に変更する"}),u.jsx("span",{className:"fl-h",children:x.noStaff?"担当者のいない日は本来受け付けていません。必要な場合だけ強制します。":"同じ時間帯の申請と重なります。両方を残したまま、この申請を確定・申請中にします。"})]})]})]})]})})}function I1({year:r,month:e,avail:t,memberId:s,onPaint:o,onChangeMonth:l}){const{run:f,enterClass:d}=qd(),m=`${r}-${yn(e)}`,g=new Date(r,e-1,1).getDay(),_=new Date(r,e,0).getDate(),x=[];for(let D=0;D<g;D++)x.push(null);for(let D=1;D<=_;D++)x.push(new Date(r,e-1,D));const M=me.useRef(null),E=me.useRef(null),[w,S]=me.useState(null),y=D=>x.filter(Boolean).filter(G=>G.getDay()===D).map(Yn),L=D=>D>=ci,N=(D,G)=>{if(!s||!L(D)||G.pointerType==="mouse"&&G.button!==0)return;G.preventDefault();const B=!$s(s,D);E.current={mode:B,touched:[D]},S({dates:new Set([D]),on:B})},U=(D,G)=>{const B=document.elementFromPoint(D,G),te=B&&B.closest?B.closest(".scal-cell[data-date]"):null;return te?te.getAttribute("data-date"):null};me.useEffect(()=>{const D=B=>{const te=E.current;if(!te)return;B.preventDefault();const le=U(B.clientX,B.clientY);!le||!L(le)||te.touched.indexOf(le)>=0||(te.touched.push(le),S(X=>{const ce=new Set(X?X.dates:[]);return ce.add(le),{dates:ce,on:te.mode}}))},G=()=>{const B=E.current;if(!B)return;E.current=null;const te=B.touched.filter(L).slice();S(null),te.length&&o(te,B.mode)};return window.addEventListener("pointermove",D,{passive:!1}),window.addEventListener("pointerup",G),window.addEventListener("pointercancel",G),()=>{window.removeEventListener("pointermove",D),window.removeEventListener("pointerup",G),window.removeEventListener("pointercancel",G)}},[o,s]);const Y=D=>w&&w.dates.has(D)?w.on:null,I=D=>{const G=Y(D);return G!==null?G:s?$s(s,D):!1},O=D=>s0().filter(G=>(t[G.id]||[]).indexOf(D)>=0).map(G=>G.id),W=(Qr(s)||{}).color||"var(--color-primary)",R=D=>{if(!s)return;const G=y(D).filter(L);if(!G.length)return;const B=G.every(te=>$s(s,te));o(G,!B)},A=D=>{const G=y(D).filter(L);if(!s||!G.length)return"idle";const B=G.filter(te=>$s(s,te)).length;return B===0?"idle":B===G.length?"all":"some"};return u.jsxs("div",{className:"scal",ref:M,children:[u.jsxs("div",{className:"scal-h",children:[u.jsx("div",{className:d,children:u.jsxs("b",{className:"num",children:[r,"年 ",e,"月"]})},`label-${m}`),u.jsx("button",{type:"button",className:"mini",onClick:()=>l(0),children:"今月"})]}),u.jsxs("div",{className:"scal-body",children:[u.jsxs("button",{type:"button",className:"scal-side prev",onClick:()=>f(-1,()=>l(-1)),"aria-label":"前の月",children:[u.jsx("span",{"aria-hidden":"true",children:"‹"}),u.jsx("span",{className:"scal-side-lbl",children:"前へ"})]}),u.jsx("div",{className:"scal-main",children:u.jsx("div",{className:"cal-period-shell",children:u.jsxs("div",{className:d,children:[u.jsx("div",{className:"scal-wds",children:wr.map((D,G)=>{const B=A(G);return u.jsx("button",{type:"button","data-wd":G,className:"scal-wd"+(G===0?" sun":G===6?" sat":"")+(B==="all"?" all":B==="some"?" some":""),onClick:()=>R(G),title:`${D}曜日をこの月すべて${B==="all"?"削除":"追加"}`,"aria-label":`${D}曜日をこの月すべて${B==="all"?"削除":"追加"}`,children:D},D)})}),u.jsx("div",{className:"scal-grid"+(w?" painting":""),children:Array.from({length:Math.ceil(x.length/7)*7}).map((D,G)=>{const B=x[G];if(!B)return u.jsx("span",{className:"scal-cell pad"},"p"+G);const te=Yn(B),le=I(te),X=Y(te),ce=B.getDay(),j=!L(te),K=O(te),Q=s?K.indexOf(s)>=0:!1;return u.jsx("button",{type:"button","data-date":te,className:"scal-cell"+(le?" on":"")+(ce===0?" sun":ce===6?" sat":"")+(te===ci?" today":"")+(j?" past":"")+(X===!0?" pv-on":X===!1?" pv-off":"")+(Q?" mine":""),style:Q||X===!0&&s?{background:W+"1f",borderColor:W}:void 0,onPointerDown:k=>N(te,k),"aria-pressed":le,"aria-label":`${B.getMonth()+1}月${B.getDate()}日 ${K.length?K.map(Hd).join("・"):"担当なし"}`,children:u.jsx("span",{className:"scal-dots",children:K.slice(0,4).map(k=>u.jsx("span",{className:"scal-dot",style:{background:a0(k)}},k))})},te)})})]},m)})}),u.jsxs("button",{type:"button",className:"scal-side next",onClick:()=>f(1,()=>l(1)),"aria-label":"次の月",children:[u.jsx("span",{"aria-hidden":"true",children:"›"}),u.jsx("span",{className:"scal-side-lbl",children:"次へ"})]})]}),!s&&u.jsx("div",{className:"scal-foot",children:u.jsx("span",{className:"scal-warn",children:"先に担当者を選んでください。"})})]})}function Eg({members:r,onAdd:e,onUpdate:t,onRemove:s,sectionHint:o,focusRequest:l,onFocusHandled:f}){const[d,m]=me.useState(null),[p,g]=me.useState(!1),[_,x]=me.useState({name:"",hr:"101",num:"",discord:"",color:Kr[0],hubUserId:null}),[M,E]=me.useState(""),[w,S]=me.useState([]),[y,L]=me.useState(!1),N=me.useRef(null),U=me.useCallback(()=>(L(!0),Tx().then(S).catch(()=>S([])).finally(()=>L(!1))),[]);me.useEffect(()=>{U()},[U]),me.useEffect(()=>{!d||d==="new"||U()},[d,U]),me.useEffect(()=>{p&&N.current&&N.current.scrollIntoView({behavior:"smooth",block:"nearest"})},[p,d]);const Y=D=>{if(!D)return null;const G=w.find(B=>B.id===D);return G?`${G.display_name} (@${G.username})`:"紐づけ済"},I=D=>{m(D.id),g(!1),x({name:D.name,hr:D.hr,num:String(D.num),discord:D.discord||"",color:D.color,hubUserId:D.userId??null}),E("")},O=D=>{I(D),g(!0)};me.useEffect(()=>{if(!(l!=null&&l.memberId))return;const D=r.find(G=>G.id===l.memberId);D&&(l.hub?O(D):I(D),f==null||f())},[l,r,f]);const W=()=>{g(!1),m("new"),x({name:"",hr:"101",num:"",discord:"",color:Kr[r.length%Kr.length],hubUserId:null}),E("")},R=()=>{if(!_.name.trim())return"名前を入力してください";if(!qp.includes(_.hr))return"HRは 101〜309 から選んでください";const D=Number(_.num);return!D||D<1||D>40?"番号は 1〜40 で入力してください":_.discord&&!/^\d{15,25}$/.test(_.discord.trim())?"Discord のユーザーIDは数字15〜25桁です":""},A=()=>{const D=R();if(D){E(D);return}const G={name:_.name.trim(),hr:_.hr,num:Number(_.num),discord:_.discord.trim(),color:_.color,hubUserId:_.hubUserId};d==="new"?e(G):t(d,G),m(null),E("")};return u.jsxs("div",{className:"mform","data-testid":"print-staff-directory",children:[u.jsxs("div",{className:"mform-h",children:[u.jsx("b",{children:"担当者一覧"}),u.jsxs("span",{className:"num",children:[r.length,"人"]}),o?u.jsx("span",{className:"fl-h",children:o}):null,d!=="new"&&u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:W,children:"担当者を追加"})]}),u.jsxs("div",{className:"mtable",children:[u.jsxs("div",{className:"mtr mtr-h",children:[u.jsx("span",{}),u.jsx("span",{children:"名前"}),u.jsx("span",{children:"HR"}),u.jsx("span",{children:"番号"}),u.jsx("span",{children:"Discord ID"}),u.jsx("span",{children:"ScienceHUB"}),u.jsx("span",{})]}),r.map(D=>u.jsxs("div",{className:"mtr",children:[u.jsx("span",{className:"mtd-av",style:{background:D.color},children:D.name.slice(0,1)}),u.jsx("span",{className:"mtd-name",children:D.name}),u.jsx("span",{className:"num",children:ji(D.hr)}),u.jsxs("span",{className:"num",children:[D.num,"番"]}),u.jsx("span",{className:"num mtd-discord",children:D.discord||u.jsx("em",{className:"mtd-none",children:"未設定"})}),u.jsx("span",{className:"mtd-hub",children:D.userId?Y(D.userId)??u.jsx("em",{className:"mtd-none",children:"紐づけ済"}):u.jsx("em",{className:"mtd-none",children:"未紐づけ"})}),u.jsxs("span",{className:"mtd-acts",children:[u.jsx("button",{type:"button",className:"mini","data-testid":`staff-edit-${D.id}`,onClick:()=>I(D),children:"編集"}),u.jsx("button",{type:"button",className:"mini","data-testid":`staff-link-${D.id}`,onClick:()=>O(D),children:"紐づけ"}),u.jsx("button",{type:"button",className:"mini no",disabled:r.length<=1,onClick:()=>{confirm(`${D.name} を削除します。この人のシフトも消えます。`)&&s(D.id)},children:"削除"})]})]},D.id))]}),(d==="new"||d)&&u.jsxs("div",{className:"medit",children:[u.jsxs("div",{className:"medit-h",children:[u.jsx("b",{children:d==="new"?"担当者を追加":"担当者を編集"}),u.jsx("button",{type:"button",className:"linkbtn",onClick:()=>{m(null),E("")},children:"閉じる"})]}),u.jsxs("div",{className:"medit-grid",children:[u.jsxs("label",{className:"fl",children:[u.jsxs("span",{className:"fl-l",children:["名前",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("input",{className:"input",value:_.name,maxLength:12,onChange:D=>x(G=>({...G,name:D.target.value})),placeholder:"例：佐々木"})]}),u.jsxs("label",{className:"fl",children:[u.jsxs("span",{className:"fl-l",children:["HR",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("select",{className:"input",value:_.hr,onChange:D=>x(G=>({...G,hr:D.target.value})),children:qp.map(D=>u.jsx("option",{value:D,children:ji(D)},D))})]}),u.jsxs("label",{className:"fl",children:[u.jsxs("span",{className:"fl-l",children:["番号",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("input",{className:"input num",type:"number",min:1,max:40,value:_.num,onChange:D=>x(G=>({...G,num:D.target.value})),placeholder:"12"})]}),u.jsxs("label",{className:"fl",children:[u.jsxs("span",{className:"fl-l",children:["Discord ID",u.jsx("span",{className:"fl-opt",children:"任意"})]}),u.jsx("input",{className:"input num",value:_.discord,inputMode:"numeric",onChange:D=>x(G=>({...G,discord:D.target.value})),placeholder:"朝6時のメンション用"})]})]}),d&&u.jsxs("div",{className:"fl",ref:N,children:[u.jsxs("span",{className:"fl-l",children:["ScienceHUB アカウント",u.jsx("span",{className:"fl-opt",children:"3D印刷管理にアクセス可能なユーザー"})]}),y?u.jsx("p",{className:"fl-h",children:"読み込み中…"}):u.jsxs("div",{className:"hub-user-pick",role:"radiogroup","aria-label":"ScienceHUB アカウントの紐づけ",children:[u.jsxs("button",{type:"button",className:"hub-user-opt"+(_.hubUserId===null?" on":""),onClick:()=>x(D=>({...D,hubUserId:null})),children:[u.jsx("b",{children:"紐づけなし"}),u.jsx("span",{children:"この印刷担当者は ScienceHUB ログインと結びつきません"})]}),w.map(D=>{const G=D.linked_member_id&&D.linked_member_id!==d;return u.jsxs("button",{type:"button",disabled:!!G,className:"hub-user-opt"+(_.hubUserId===D.id?" on":""),onClick:()=>x(B=>({...B,hubUserId:D.id})),children:[u.jsx("b",{children:D.display_name}),u.jsxs("span",{children:["@",D.username," · ",D.email]}),u.jsx("em",{children:D.access_labels.join(" / ")}),G?u.jsxs("em",{children:["（別の印刷担当に紐づけ済: ",D.linked_member_name,"）"]}):null,D.linked_member_id===d?u.jsx("em",{children:"（この担当者に紐づけ中）"}):null]},D.id)})]})]}),u.jsxs("div",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"シフト表の色"}),u.jsx("div",{className:"color-pick",children:Kr.map(D=>u.jsx("button",{type:"button",className:_.color===D?"on":"",style:{background:D},onClick:()=>x(G=>({...G,color:D})),"aria-label":`色 ${D}`,"aria-pressed":_.color===D},D))})]}),M&&u.jsx("div",{className:"note warn",children:u.jsx("span",{children:M})}),u.jsxs("div",{className:"actrow end",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{m(null),E("")},children:"キャンセル"}),u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:A,children:d==="new"?"追加する":"保存する"})]})]})]})}function F1({configured:r,onSend:e}){const[t,s]=me.useState(""),[o,l]=me.useState(null),[f,d]=me.useState(!1),m=async()=>{const p=t.trim();if(!p){l({ok:!1,text:"送信先メールアドレスを入力してください"});return}d(!0),l({ok:null,text:"送信中…"});try{const g=await e(p);l({ok:!0,text:`送信しました（${g.to??p}）`})}catch(g){l({ok:!1,text:g instanceof Error?g.message:"送信に失敗しました"})}finally{d(!1)}};return u.jsxs("section",{className:"intg","data-testid":"email-test-section",children:[u.jsxs("div",{className:"intg-h",children:[u.jsx("b",{children:"予約者向けメール（Cloudflare Email Sending）"}),u.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"設定済み":"未設定"})]}),u.jsx("p",{className:"fl-h",children:"申請・受領通知はサーバー環境変数（PRINT_3D_EMAIL_FROM、CLOUDFLARE_API_TOKEN 等）経由で送信されます。 下の欄に任意のアドレスを入れて、同じ経路のテストメールを送れます。"}),!r&&u.jsx("div",{className:"note warn",children:u.jsx("span",{children:"メール送信が未設定です。Cloudflare Email Service のドメイン認証と Pages のシークレットを確認してください。"})}),u.jsxs("label",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"テスト送信先"}),u.jsx("input",{className:"input",type:"email",autoComplete:"email",spellCheck:!1,"data-testid":"email-test-to",value:t,onChange:p=>s(p.target.value),placeholder:"you@example.com",disabled:!r||f})]}),u.jsx("div",{className:"intg-f",children:u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"email-test-send",disabled:!r||f||!t.trim(),onClick:()=>void m(),children:"テスト送信"})}),o&&u.jsx("p",{className:"fl-h"+(o.ok===!0?"":o.ok===!1?" warn":""),role:"status","data-testid":"email-test-result",children:o.text})]})}function O1({configured:r,members:e,onSend:t}){var M;const[s,o]=me.useState(()=>new Set),[l,f]=me.useState(null),[d,m]=me.useState(!1),p=E=>{o(w=>{const S=new Set(w);return S.has(E)?S.delete(E):S.add(E),S})},g=async()=>{var w;const E=[...s];if(!E.length){f({ok:!1,text:"メンションする担当者を1人以上選んでください"});return}m(!0),f({ok:null,text:"Discord へ送信中…"});try{const S=await t(E),y=(S.sent||[]).map(N=>N.name).join("・"),L=((w=S.skipped)==null?void 0:w.length)>0?`（スキップ: ${S.skipped.map(N=>`${N.name}: ${N.reason}`).join(" / ")}）`:"";f({ok:!0,text:`送信しました。Discord で ${y} へのメンション（青字）を確認してください。${L}`,detail:S.content,sent:S.sent})}catch(S){f({ok:!1,text:S instanceof Error?S.message:"送信に失敗しました"})}finally{m(!1)}},_=e.filter(E=>(E.discord||"").trim()),x=e.some(E=>(E.discord||"").trim());return u.jsxs("section",{className:"intg","data-testid":"discord-mention-test-section",children:[u.jsxs("div",{className:"intg-h",children:[u.jsx("b",{children:"Discord メンションのテスト"}),u.jsx("span",{className:"intg-state "+(r?"ok":"warn"),children:r?"Webhook設定済み":"Webhook未設定"})]}),u.jsxs("p",{className:"fl-h",children:["朝6時の担当者メンションと同じ形式で、選んだ担当者に ",u.jsx("code",{children:"<@ユーザーID>"})," を送ります。 チャンネルで名前が青く通知されれば、その Discord ID は正しく設定されています。"]}),!r&&u.jsx("div",{className:"note warn",children:u.jsx("span",{children:"サーバーに Discord Webhook（DISCORD_WEBHOOK_URL）が未設定です。Wrangler / Pages の環境変数を確認してください。"})}),!x&&u.jsx("div",{className:"note warn",children:u.jsx("span",{children:"担当者タブで Discord ユーザーID（数字）を登録してからテストしてください。"})}),u.jsxs("div",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"メンションする担当者"}),u.jsx("div",{className:"mp-list",style:{marginTop:8},children:e.map(E=>{const w=(E.discord||"").trim(),S=!!w,y=s.has(E.id);return u.jsxs("button",{type:"button",className:"mp"+(y?" on":"")+(S?"":" disabled"),style:y?{borderColor:E.color,background:E.color+"14"}:void 0,disabled:!r||d||!S,"data-testid":`discord-mention-member-${E.id}`,onClick:()=>S&&p(E.id),"aria-pressed":y,children:[u.jsx("span",{className:"mp-av",style:{background:E.color},children:E.name.slice(0,1)}),u.jsxs("span",{className:"mp-tx",children:[u.jsx("b",{children:E.name}),u.jsxs("span",{className:"num",children:[ji(E.hr),"・",E.num,"番"]})]}),u.jsx("span",{className:"num mtd-discord",children:w||"ID未設定"})]},E.id)})}),_.length>0&&u.jsx("span",{className:"fl-h",children:"ID未設定の担当者は選択できません（担当者タブで編集）。"})]}),u.jsx("div",{className:"intg-f",children:u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm","data-testid":"discord-mention-test-send",disabled:!r||d||s.size===0,onClick:()=>void g(),children:"メンションをテスト送信"})}),l&&u.jsx("p",{className:"fl-h"+(l.ok===!0?"":l.ok===!1?" warn":""),role:"status","data-testid":"discord-mention-test-result",children:l.text}),(l==null?void 0:l.ok)===!0&&((M=l.sent)==null?void 0:M.length)>0&&u.jsx("ul",{className:"fl-h","data-testid":"discord-mention-test-sent-list",style:{marginTop:4,paddingLeft:"1.2rem"},children:l.sent.map(E=>u.jsxs("li",{children:[u.jsx("b",{children:E.name})," — メンション ID: ",u.jsx("span",{className:"num",children:E.discord_user_id})]},E.member_id))}),(l==null?void 0:l.detail)&&u.jsxs("details",{className:"fl-h",style:{marginTop:8},children:[u.jsx("summary",{children:"送信したメッセージ本文"}),u.jsx("pre",{className:"mono",style:{whiteSpace:"pre-wrap",fontSize:"0.85em",marginTop:6},children:l.detail})]})]})}function k1({value:r,onChange:e,onTestDiscord:t,onTestDiscordMention:s,onTestGcal:o,onTestEmail:l,emailConfigured:f,discordConfigured:d,members:m}){const p=r.discord||{},g=r.gcal||{},_=y=>e({...r,discord:{...p,...y}}),x=y=>e({...r,gcal:{...g,...y}}),E=(p.webhook||"").includes("サーバー設定")||/^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(p.webhook||""),S=(g.calendarId||"").includes("サーバー設定")||/^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(g.calendarId||"");return u.jsxs("div",{className:"integ",children:[u.jsxs("section",{className:"intg",children:[u.jsxs("div",{className:"intg-h",children:[u.jsx("b",{children:"Discord 通知"}),u.jsx("span",{className:"intg-state "+(p.enabled?E?"ok":"warn":"off"),children:p.enabled?E?"有効":"URL未設定":"無効"}),u.jsxs("label",{className:"sw",children:[u.jsx("input",{type:"checkbox",checked:!!p.enabled,onChange:y=>_({enabled:y.target.checked})}),u.jsx("span",{})]})]}),u.jsxs("label",{className:"fl",children:[u.jsxs("span",{className:"fl-l",children:["Webhook URL",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("input",{className:"input mono",value:p.webhook||"",spellCheck:"false",onChange:y=>_({webhook:y.target.value.trim()}),placeholder:"https://discord.com/api/webhooks/123.../abc..."}),u.jsx("span",{className:"fl-h",children:"Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURL。"})]}),!E&&(p.webhook||"")&&u.jsx("div",{className:"note warn",children:u.jsxs("span",{children:["URLの形式が違います。",u.jsx("b",{children:"https://discord.com/api/webhooks/…"})," の形で貼り付けてください。"]})}),u.jsxs("div",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"通知するタイミング"}),u.jsx("div",{className:"chk-grid",children:[["pending","新しい申請"],["approved","確定したとき"],["cancelled","取り消したとき"]].map(([y,L])=>u.jsxs("label",{className:"chk",children:[u.jsx("input",{type:"checkbox",checked:!!(p.events&&p.events[y]),onChange:N=>_({events:{...p.events,[y]:N.target.checked}})}),u.jsx("span",{children:L})]},y))})]}),u.jsxs("label",{className:"chk",style:{alignSelf:"flex-start"},children:[u.jsx("input",{type:"checkbox",checked:!!p.dailyMention,onChange:y=>_({dailyMention:y.target.checked})}),u.jsx("span",{children:"当日の担当者を朝6:00にメンションする"})]}),u.jsx("span",{className:"fl-h",style:{marginTop:-6},children:"メンバーに登録した Discord ID を使います。未設定の人はメンションされません。"}),u.jsxs("div",{className:"intg-f",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:t,disabled:!E,children:"テスト送信"}),u.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),s&&(m==null?void 0:m.length)>0&&u.jsx(O1,{configured:!!d,members:m,onSend:s}),u.jsxs("section",{className:"intg",children:[u.jsxs("div",{className:"intg-h",children:[u.jsx("b",{children:"Google カレンダー"}),u.jsx("span",{className:"intg-state "+(g.enabled?S?"ok":"warn":"off"),children:g.enabled?S?"有効":"ID未設定":"無効"}),u.jsxs("label",{className:"sw",children:[u.jsx("input",{type:"checkbox",checked:!!g.enabled,onChange:y=>x({enabled:y.target.checked})}),u.jsx("span",{})]})]}),u.jsxs("label",{className:"fl",children:[u.jsxs("span",{className:"fl-l",children:["カレンダーID",u.jsx("span",{className:"req",children:"必須"})]}),u.jsx("input",{className:"input mono",value:g.calendarId||"",spellCheck:"false",onChange:y=>x({calendarId:y.target.value.trim()}),placeholder:"xxxx@group.calendar.google.com"}),u.jsx("span",{className:"fl-h",children:"共有カレンダーの「設定 → カレンダーの統合」に載っているID。"})]}),u.jsxs("label",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"予定タイトルの書式"}),u.jsx("input",{className:"input",value:g.title||"",onChange:y=>x({title:y.target.value}),placeholder:"[3Dプリント] {title}"}),u.jsxs("span",{className:"fl-h",children:["{title}"," 作品名 / ","{who}"," 申請者 / ","{machine}"," 機種 に置き換わります。"]})]}),u.jsxs("div",{className:"fl-2",children:[u.jsxs("label",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"所要時間"}),u.jsx("select",{className:"input",value:g.duration||20,onChange:y=>x({duration:Number(y.target.value)}),children:[10,15,20,30,60,90,120].map(y=>u.jsxs("option",{value:y,children:[y,"分"]},y))})]}),u.jsxs("label",{className:"fl",children:[u.jsx("span",{className:"fl-l",children:"登録する時点"}),u.jsxs("select",{className:"input",value:g.syncOn||"approved",onChange:y=>x({syncOn:y.target.value}),children:[u.jsx("option",{value:"pending",children:"申請が届いた時点"}),u.jsx("option",{value:"approved",children:"確定した時点"})]})]})]}),u.jsxs("div",{className:"intg-f",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:o,disabled:!S,children:"接続テスト"}),u.jsx("span",{className:"fl-h",children:"保存は自動です。"})]})]}),l&&u.jsx(F1,{configured:f,onSend:l})]})}function z1({members:r,avail:e,onAddMember:t,onUpdateMember:s,onRemoveMember:o,onPaintAvail:l,shiftDraftPending:f,shiftDraftSummary:d,shiftApplying:m,onConfirmShiftDraft:p,onDiscardShiftDraft:g,onLoadShiftMonth:_,integrations:x,setIntegrations:M,onTestDiscord:E,onTestDiscordMention:w,onTestGcal:S,onTestEmail:y,emailConfigured:L,discordConfigured:N,log:U,pendingPre:Y}){const[I,O]=me.useState(Y||"shift"),[W,R]=me.useState(null),[A,D]=me.useState(r[0]?r[0].id:null),[G,B]=me.useState(()=>{const K=new Date;return{y:K.getFullYear(),m:K.getMonth()+1}});me.useEffect(()=>{Y&&O(Y)},[Y]),me.useEffect(()=>{r.length&&!r.find(K=>K.id===A)&&D(r[0].id)},[r]);const te=me.useRef("");me.useEffect(()=>{if(I!=="shift")return;const K=`${G.y}-${G.m}`;te.current!==K&&(te.current=K,_(G.y,G.m))},[I,G.y,G.m,_]);const le=[["shift","シフト表"],["member","担当者"],["integ","外部連携"]],X=K=>{if(K!==0&&(te.current=""),K===0){const Q=new Date;te.current="",B({y:Q.getFullYear(),m:Q.getMonth()+1});return}B(Q=>{let k=Q.y,re=Q.m+K;return re<1&&(re=12,k-=1),re>12&&(re=1,k+=1),{y:k,m:re}})},ce=d&&f?[d.addedSlots>0&&`追加${d.addedSlots}枠`,d.removedSlots>0&&`削除${d.removedSlots}枠`,d.addedDates>0&&`＋${d.addedDates}日`,d.removedDates>0&&`−${d.removedDates}日`].filter(Boolean).join(" · "):"",j=r.find(K=>K.id===A);return u.jsxs("div",{className:"set-wrap",children:[u.jsx("div",{className:"set-tabs",role:"tablist",children:le.map(([K,Q])=>u.jsx("button",{type:"button",role:"tab","aria-selected":I===K,className:I===K?"on":"",onClick:()=>O(K),children:Q},K))}),u.jsxs("div",{className:"set-tab-stage",children:[I==="shift"&&u.jsxs("div",{className:"shifttab",children:[f&&u.jsxs("div",{className:"shift-confirm-bar",role:"status",children:[u.jsxs("span",{className:"shift-confirm-bar-text",children:["未保存のシフト変更があります",ce?`（${ce}）`:""]}),u.jsxs("div",{className:"shift-confirm-bar-actions",children:[u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:m,onClick:g,children:"変更を破棄"}),u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",disabled:m,onClick:p,children:m?"保存中…":"変更を確定"})]})]}),u.jsxs("div",{className:"card memberpick",children:[u.jsxs("div",{className:"mp-h",children:[u.jsx("b",{children:"担当者を選んで、日付を塗る"}),u.jsx("span",{className:"fl-h",children:"選択した担当者の稼働日をカレンダー上で直接追加・削除できます。確定するまでサーバーには保存されません。"})]}),u.jsx("div",{className:"mp-list",children:r.map(K=>{const Q=(e[K.id]||[]).filter(k=>k>=ci).length;return u.jsxs("button",{type:"button",className:"mp"+(A===K.id?" on":""),style:A===K.id?{borderColor:K.color,background:K.color+"14"}:void 0,onClick:()=>D(K.id),children:[u.jsx("span",{className:"mp-av",style:{background:K.color},children:K.name.slice(0,1)}),u.jsxs("span",{className:"mp-tx",children:[u.jsx("b",{children:K.name}),u.jsxs("span",{className:"num",children:[ji(K.hr),"・",K.num,"番"]})]}),u.jsxs("span",{className:"mp-count num",children:[Q,"日"]})]},K.id)})})]}),u.jsxs("div",{className:"card",children:[u.jsxs("div",{className:"card-h",children:[u.jsx("b",{children:"シフト表"}),u.jsx("span",{className:"meta",children:j?`${j.name} の稼働日`:"担当者を選択"})]}),u.jsx("div",{className:"shifttab-body shifttab-body--cal-only",children:u.jsx(I1,{year:G.y,month:G.m,avail:e,memberId:A,onPaint:(K,Q)=>l(A,K,Q),onChangeMonth:X})})]}),u.jsx(Eg,{members:r,onAdd:t,onUpdate:s,onRemove:o,sectionHint:"シフト担当者の編集と ScienceHUB アカウント紐づけ",focusRequest:W,onFocusHandled:()=>R(null)})]}),I==="member"&&u.jsx(Eg,{members:r,onAdd:t,onUpdate:s,onRemove:o,sectionHint:"印刷担当者の登録・編集・ScienceHUB 紐づけ",focusRequest:W,onFocusHandled:()=>R(null)}),I==="integ"&&u.jsx(k1,{value:x,onChange:M,onTestDiscord:E,onTestDiscordMention:w,onTestGcal:S,onTestEmail:y,emailConfigured:L,discordConfigured:N,members:r})]})]})}const B1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function j1(r){const e=String(r??"");return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function H1(r){const e=[...r].sort((o,l)=>{const f=l.desired_date.localeCompare(o.desired_date);return f!==0?f:l.created_at.localeCompare(o.created_at)}),s=[["希望日","HR","番号","氏名","タイトル","パーツ数","ステータス","担当","プリンター","STL","作成日時"].join(",")];for(const o of e)s.push([o.desired_date,o.homeroom,o.student_number,o.student_name,o.title,o.part_count??1,B1[o.status]??o.status,o.print_staff_label??"",o.printer_name??"",o.stl_filename??"",o.created_at].map(j1).join(","));return"\uFEFF"+s.join(`
`)}function V1(r){const e=H1(r),t=new Blob([e],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(t),o=document.createElement("a"),l=new Date().toISOString().slice(0,10);o.href=s,o.download=`3dprint_history_${l}.csv`,o.click(),URL.revokeObjectURL(s)}const G1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function W1({reservations:r,onOpen:e}){const t=[...r].sort((s,o)=>{const l=o.desired_date.localeCompare(s.desired_date);return l!==0?l:o.created_at.localeCompare(s.created_at)});return t.length?u.jsxs("div",{className:"card legacy-panel",children:[u.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"0 0 10px",flexWrap:"wrap"},children:[u.jsxs("p",{className:"hint",style:{margin:0},children:["全 ",t.length," 件"]}),u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",disabled:!t.length,onClick:()=>V1(t),children:"CSVエクスポート"})]}),u.jsx("div",{className:"table-wrap admin-table-wrap",children:u.jsxs("table",{children:[u.jsx("thead",{children:u.jsxs("tr",{children:[u.jsx("th",{children:"希望日"}),u.jsx("th",{children:"HR"}),u.jsx("th",{children:"タイトル"}),u.jsx("th",{children:"パーツ"}),u.jsx("th",{children:"ステータス"}),u.jsx("th",{children:"担当"}),u.jsx("th",{})]})}),u.jsx("tbody",{children:t.map(s=>u.jsxs("tr",{children:[u.jsx("td",{children:s.desired_date}),u.jsx("td",{children:s.homeroom}),u.jsx("td",{children:s.title}),u.jsx("td",{children:s.part_count&&s.part_count>1?s.part_count:"—"}),u.jsx("td",{children:u.jsx("span",{className:`status-badge status-${s.status}`,children:G1[s.status]??s.status})}),u.jsx("td",{children:s.print_staff_label?`担当: ${s.print_staff_label}`:"—"}),u.jsx("td",{children:u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>e(s),children:"詳細"})})]},s.id))})]})})]}):u.jsx("p",{className:"hint admin-list-empty",children:"履歴がありません"})}function wg({selected:r,onSelect:e,title:t,description:s,badge:o,accent:l,disabled:f,"aria-label":d}){return u.jsxs("button",{type:"button",className:"dnd-pick"+(r?" on":"")+(f?" disabled":""),onClick:e,disabled:f,"aria-pressed":r,"aria-label":d??t,style:r&&l?{borderColor:l,boxShadow:`0 0 0 1px ${l}`}:void 0,children:[u.jsx("span",{className:"dnd-pick-grip","aria-hidden":"true",children:"⠿"}),u.jsxs("span",{className:"dnd-pick-body",children:[o?u.jsx("span",{className:"dnd-pick-badge",style:l?{background:l+"22",color:l}:void 0,children:o}):null,u.jsx("b",{children:t}),s?u.jsx("span",{children:s}):null]}),u.jsx("span",{className:"dnd-pick-check","aria-hidden":"true",children:r?"✓":""})]})}function Tg({children:r,columns:e=2}){return u.jsx("div",{className:"dnd-pick-grid cols-"+e,children:r})}function $1({file:r,onFile:e,label:t="プリンター画像",hint:s="PNG / JPG をドラッグ＆ドロップ、またはクリックして選択",accept:o="image/*"}){const l=me.useRef(null),[f,d]=me.useState(!1),[m,p]=me.useState(null);me.useEffect(()=>{if(!r){p(null);return}const _=URL.createObjectURL(r);return p(_),()=>URL.revokeObjectURL(_)},[r]);const g=_=>{const x=_==null?void 0:_[0];!x||!x.type.startsWith("image/")||e(x)};return u.jsxs("div",{className:"imgdrop-wrap",children:[u.jsx("span",{className:"imgdrop-label",children:t}),u.jsxs("div",{className:"imgdrop"+(f?" over":"")+(r?" filled":""),onDragOver:_=>{_.preventDefault(),d(!0)},onDragLeave:()=>d(!1),onDrop:_=>{_.preventDefault(),d(!1),g(_.dataTransfer.files)},onClick:()=>{var _;return(_=l.current)==null?void 0:_.click()},role:"button",tabIndex:0,onKeyDown:_=>{var x;(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),(x=l.current)==null||x.click())},children:[u.jsx("input",{ref:l,type:"file",accept:o,className:"sr",onChange:_=>g(_.target.files)}),m?u.jsxs(u.Fragment,{children:[u.jsx("img",{className:"imgdrop-preview",src:m,alt:""}),u.jsxs("span",{className:"imgdrop-meta",children:[u.jsx("b",{children:r==null?void 0:r.name}),u.jsxs("span",{children:[(((r==null?void 0:r.size)??0)/1024).toFixed(0)," KB ・ クリックで差し替え"]})]}),u.jsx("button",{type:"button",className:"imgdrop-clear","aria-label":"画像を外す",onClick:_=>{_.stopPropagation(),e(null)},children:"×"})]}):u.jsxs(u.Fragment,{children:[u.jsx("span",{className:"imgdrop-icon","aria-hidden":"true",children:"🖼"}),u.jsxs("span",{className:"imgdrop-meta",children:[u.jsx("b",{children:s}),u.jsx("span",{children:"一覧サムネイルに表示されます（任意）"})]})]})]})]})}function X1({onToast:r,onReload:e}){var B,te,le;const[t,s]=me.useState([]),[o,l]=me.useState(""),[f,d]=me.useState(null),[m,p]=me.useState(null),[g,_]=me.useState(""),[x,M]=me.useState(null),[E,w]=me.useState(!1),[S,y]=me.useState([]),[L,N]=me.useState(""),[U,Y]=me.useState([]),I=me.useCallback(async()=>{const[X,ce]=await Promise.all([Ux(),Yx()]);s(X.printers),_(ce.storage_path??""),y(ce.group_roots??[])},[]);me.useEffect(()=>{I().catch(X=>r(X instanceof Error?X.message:"読み込み失敗"))},[I,r]);const O=async()=>{if(!f){r("機種（KE / CC）を選んでください");return}const X=o.trim();if(X)try{await Ix(X,m??void 0),l(""),d(null),p(null),await I(),e==null||e(),r("プリンターを追加しました")}catch(ce){r(ce instanceof Error?ce.message:"追加失敗")}},W=async()=>{try{await Kx(g.trim()),r("印刷動画の保存先を更新しました")}catch(X){r(X instanceof Error?X.message:"保存失敗")}},R=async()=>{var ce,j;if(!x)return;const X=(((ce=x.capabilities)==null?void 0:ce.nozzle_sizes_mm)??["0.4"]).map(String).filter(Boolean);try{await Fx(x.id,{name:x.name.trim(),status:x.status,capabilities:{can_record_print_video:!!((j=x.capabilities)!=null&&j.can_record_print_video),nozzle_sizes_mm:X},daily_capacity:x.daily_capacity}),M(null),await I(),r("更新しました")}catch(K){r(K instanceof Error?K.message:"更新失敗")}},A=async()=>{w(!0),N(""),Y([])},D=async X=>{if(N(X),!X){Y([]);return}const ce=await Xx(X);Y(ce.items.map(j=>({path:j.path,name:j.name})))},G=[{id:"available",label:"稼働",desc:"予約・依頼を受け付ける",accent:"var(--color-success)"},{id:"maintenance",label:"メンテ",desc:"一時停止（再配置あり）",accent:"var(--color-warn-ink)"},{id:"unavailable",label:"印刷不能",desc:"予約不可",accent:"var(--color-text-muted)"}];return u.jsxs("div",{className:"legacy-panel ops-printers",children:[u.jsxs("section",{className:"card ops-card",id:"print-video-settings-section",children:[u.jsx("h2",{className:"section-heading",children:"印刷動画の保存先"}),u.jsx("p",{className:"hint",children:"管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。"}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"print-video-storage-path",children:"保存先フォルダ"}),u.jsxs("div",{style:{display:"flex",gap:8},children:[u.jsx("input",{id:"print-video-storage-path",className:"input",value:g,readOnly:!0,placeholder:"未設定（参照から選択）"}),u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void A(),children:"参照…"})]})]}),u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void W(),children:"保存先を保存"})]}),u.jsxs("section",{className:"card ops-card",children:[u.jsx("h2",{className:"section-heading",children:"プリンター管理"}),u.jsx("p",{className:"hint ops-lead",children:"登録済みプリンターの編集・削除、および新規追加ができます。"}),u.jsx("div",{className:"printer-admin-grid",children:t.map(X=>{var ce,j;return u.jsxs("article",{className:"printer-admin-card",children:[X.image_url?u.jsx("img",{className:"printer-admin-image",src:X.image_url,alt:""}):u.jsx("div",{className:"printer-admin-image printer-admin-image-placeholder",children:"🖨️"}),u.jsx("div",{className:"printer-admin-body",children:u.jsxs(u.Fragment,{children:[u.jsx("h3",{className:"printer-admin-title",children:X.name}),u.jsxs("p",{className:"hint printer-admin-cap-summary",children:[X.status??"available"," / ノズル ",(((ce=X.capabilities)==null?void 0:ce.nozzle_sizes_mm)??[]).join(", ")||"—"," /"," ",(j=X.capabilities)!=null&&j.can_record_print_video?"動画撮影可":"動画撮影不可"]}),u.jsxs("div",{className:"printer-admin-actions",children:[u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>M(X),children:"編集"}),u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>{confirm(`「${X.name}」を削除しますか？`)&&kx(X.id).then(I).then(()=>r("削除しました")).catch(K=>r(K instanceof Error?K.message:"削除失敗"))},children:"削除"}),u.jsxs("label",{className:"btn btn-secondary btn-sm",children:["画像",u.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:K=>{var k;const Q=(k=K.target.files)==null?void 0:k[0];Q&&Ox(X.id,Q).then(I).catch(re=>r(re instanceof Error?re.message:"画像失敗"))}})]})]})]})})]},X.id)})}),u.jsxs("div",{className:"printer-add-card","data-testid":"printer-add-form",children:[u.jsxs("div",{className:"printer-add-head",children:[u.jsx("h3",{children:"プリンターを追加"}),u.jsx("p",{className:"hint",children:"機種を選び、表示名と画像（任意）を設定してから追加します。"})]}),u.jsxs("div",{className:"printer-add-block",children:[u.jsx("span",{className:"printer-add-label",children:"機種（どの枠に割り当てるか）"}),u.jsx(Tg,{children:Bl.map(X=>u.jsx(wg,{selected:f===X.id,badge:X.short,accent:X.id==="ke"?"var(--color-primary)":"var(--color-tip)",title:X.name,description:`${X.maker} ・ ${X.hint}`,onSelect:()=>{d(X.id),o.trim()||l(`${X.short} `)}},X.id))})]}),u.jsxs("div",{className:"printer-add-block",children:[u.jsx("label",{className:"printer-add-label",htmlFor:"printer-add-name",children:"表示名"}),u.jsx("input",{id:"printer-add-name",className:"input printer-add-name",placeholder:f?`${((B=Bl.find(X=>X.id===f))==null?void 0:B.short)??""} 3号機`:"例: KE 3号機",value:o,onChange:X=>l(X.target.value)})]}),u.jsx("div",{className:"printer-add-block",children:u.jsx($1,{file:m,onFile:p})}),u.jsx("div",{className:"printer-add-actions",children:u.jsx("button",{type:"button",className:"btn btn-primary btn-lg",disabled:!f||!o.trim(),onClick:()=>void O(),children:"プリンターを追加"})})]})]}),x&&u.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[u.jsx("div",{className:"legacy-modal-scrim",onClick:()=>M(null)}),u.jsxs("div",{className:"legacy-modal-body card",children:[u.jsxs("h2",{children:[x.name," を編集"]}),u.jsxs("label",{className:"form-group",children:["名前",u.jsx("input",{className:"input",value:x.name,onChange:X=>M({...x,name:X.target.value})})]}),u.jsxs("div",{className:"form-group",children:[u.jsx("span",{className:"printer-add-label",children:"ステータス"}),u.jsx(Tg,{columns:3,children:G.map(X=>u.jsx(wg,{selected:(x.status??"available")===X.id,title:X.label,description:X.desc,accent:X.accent,onSelect:()=>M({...x,status:X.id})},X.id))})]}),u.jsxs("label",{className:"form-group",children:["ノズル径（カンマ区切り）",u.jsx("input",{className:"input",value:(((te=x.capabilities)==null?void 0:te.nozzle_sizes_mm)??[]).join(", "),onChange:X=>M({...x,capabilities:{...x.capabilities,nozzle_sizes_mm:X.target.value.split(",").map(ce=>ce.trim()).filter(Boolean)}})})]}),u.jsxs("label",{className:"chk",children:[u.jsx("input",{type:"checkbox",checked:!!((le=x.capabilities)!=null&&le.can_record_print_video),onChange:X=>M({...x,capabilities:{...x.capabilities,can_record_print_video:X.target.checked}})}),"動画撮影可"]}),u.jsx("div",{className:"form-grid",style:{gridTemplateColumns:"1fr 1fr",marginTop:8},children:["max_small","max_small_with_main","max_medium","max_large"].map(X=>{var ce;return u.jsxs("label",{children:[X,u.jsx("input",{className:"input",type:"number",value:((ce=x.daily_capacity)==null?void 0:ce[X])??0,onChange:j=>M({...x,daily_capacity:{...x.daily_capacity,[X]:Number(j.target.value)}})})]},X)})}),u.jsxs("div",{className:"legacy-modal-actions",children:[u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>M(null),children:"キャンセル"}),u.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>void R(),children:"保存"})]})]})]}),E&&u.jsxs("div",{className:"legacy-modal open",role:"dialog","aria-modal":"true",children:[u.jsx("div",{className:"legacy-modal-scrim",onClick:()=>w(!1)}),u.jsxs("div",{className:"legacy-modal-body card",children:[u.jsx("h2",{children:"保存先フォルダ"}),u.jsx("p",{className:"hint",children:L||"チームを選んでください"}),u.jsxs("div",{style:{display:"grid",gap:6,maxHeight:280,overflow:"auto"},children:[!L&&S.map(X=>u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void D(X.path),children:X.label},X.path)),L&&u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void D(""),children:"チームへ戻る"}),U.map(X=>u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>void D(X.path),children:X.name},X.path))]}),u.jsxs("div",{className:"legacy-modal-actions",children:[u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>w(!1),children:"閉じる"}),u.jsx("button",{type:"button",className:"btn btn-primary",disabled:!L,onClick:()=>{_(L),w(!1)},children:"このフォルダを選択"})]})]})]})]})}const q1={applied:"申請中",accepted:"受領済み",printing:"印刷中",delivered:"印刷済み",failed:"印刷失敗",cancelled:"キャンセル"};function Y1({reservation:r,onClose:e,onToast:t,onUpdated:s}){const[o,l]=me.useState(!1);if(me.useEffect(()=>{l(!!(r!=null&&r.has_print_video))},[r]),!r)return null;const f=async m=>{try{await Zx(r.id,m),l(!0),t("印刷動画をアップロードしました"),s()}catch(p){t(p instanceof Error?p.message:"アップロード失敗")}},d=async()=>{try{await Jx(r.id),l(!1),t("印刷動画を削除しました"),s()}catch(m){t(m instanceof Error?m.message:"削除失敗")}};return u.jsxs(J0,{open:!!r,title:r.title,sub:`${r.desired_date} · ${r.printer_name??""}`,onClose:e,footer:u.jsx("button",{type:"button",className:"btn btn-secondary",onClick:e,children:"閉じる"}),children:[u.jsxs("dl",{className:"kv",children:[u.jsxs("div",{children:[u.jsx("dt",{children:"ステータス"}),u.jsx("dd",{children:q1[r.status]??r.status})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"申請者"}),u.jsxs("dd",{children:[r.student_name,"（",r.homeroom," · ",r.student_number,"）"]})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"担当"}),u.jsx("dd",{children:r.print_staff_label??"—"})]}),(r.part_count??1)>1?u.jsxs("div",{children:[u.jsx("dt",{children:"パーツ数"}),u.jsx("dd",{children:r.part_count})]}):null]}),u.jsx("div",{className:"ftitle",children:"印刷動画"}),o?u.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[u.jsx("a",{className:"btn btn-secondary btn-sm",href:Qx(r.id),download:!0,children:"動画をダウンロード"}),u.jsx("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:()=>void d(),children:"動画を削除"})]}):u.jsx("p",{className:"hint",children:"未アップロード"}),u.jsx("input",{type:"file",accept:"video/*",onChange:m=>{var g;const p=(g=m.target.files)==null?void 0:g[0];p&&f(p)}}),u.jsx("div",{style:{marginTop:12,display:"flex",gap:8},children:u.jsx("button",{type:"button",className:"btn btn-primary btn-sm",onClick:()=>void Td(r.id,{status:"delivered"}).then(s).then(()=>t("完了にしました")).catch(m=>t(m instanceof Error?m.message:"更新失敗")),children:"完了にする"})})]})}function K1({showToast:r}){const[e,t]=me.useState("printers"),[s,o]=me.useState(null),[l,f]=me.useState(0),[d,m]=me.useState([]);me.useEffect(()=>{Dx().then(m)},[l]);const p=g=>r(g);return u.jsxs("div",{className:"set-wrap",children:[u.jsxs("div",{className:"set-tabs",role:"tablist",children:[u.jsx("button",{type:"button",role:"tab",className:e==="printers"?"on":"",onClick:()=>t("printers"),children:"プリンター"}),u.jsx("button",{type:"button",role:"tab",className:e==="history"?"on":"",onClick:()=>t("history"),children:"印刷履歴"})]}),e==="printers"?u.jsx(X1,{onToast:p,onReload:()=>f(g=>g+1)},l):u.jsx(W1,{reservations:d,onOpen:g=>o(g)}),u.jsx(Y1,{reservation:s,onClose:()=>o(null),onToast:p,onUpdated:()=>f(g=>g+1)})]})}function Z1(){const r=zg(),[e,t]=me.useState(!0),[s,o]=me.useState([]),[l,f]=me.useState([]),[d,m]=me.useState({}),[p,g]=me.useState({}),_=me.useRef(d),x=me.useRef(p);_.current=d,x.current=p;const[M,E]=me.useState(!1),[w,S]=me.useState(()=>r.screen||"reserve"),[y,L]=me.useState(()=>r.selected||ci),[N,U]=me.useState(null),[Y,I]=me.useState(()=>m0()??O0()),[O,W]=me.useState(()=>h0()),[R,A]=me.useState(null),[D,G]=me.useState(null),[B,te]=me.useState(null),[le,X]=me.useState(null),[ce,j]=me.useState(!1),[K,Q]=me.useState(null),[k,re]=me.useState(null),[Ue,ne]=me.useState(!1),[pe,we]=me.useState(!1),_e=me.useCallback((b,H)=>{r0(b),hl(H)},[]),Le=me.useCallback(async b=>{const{from:H,to:q}=L0(b),[{applications:he},ve]=await Promise.all([Ex(H,q),Sx(H,q)]),Ye=new Map;for(const $e of he)Ye.set($e.id,Jp($e));for(const $e of ve.applications)Ye.set($e.id,Jp($e));f([...Ye.values()])},[]),Fe=me.useCallback(async()=>{var Ye;const b=await wx(),H=R0(b);o(H);const q=zn(y),he=await kp(q.getFullYear(),q.getMonth()+1),ve=Wg(he.availability);m(ve),g(ve),_e(H,ve);try{U(await Up())}catch{}await Le(y);try{const $e=await jx();ne(!!$e.email.configured),we(!!$e.discord.configured),I(pt=>({...pt,discord:{...pt.discord,webhook:$e.discord.configured?"(サーバー設定)":""},gcal:{...pt.gcal,calendarId:$e.gcal.configured?"(サーバー設定)":""}}))}catch{}try{const $e=await $x(80);(Ye=$e.log)!=null&&Ye.length&&W($e.log.map(pt=>({id:pt.id,at:pt.at,actor:pt.actor,type:pt.type,text:pt.text,appId:pt.app_id})))}catch{}},[Le,y,_e]);me.useEffect(()=>{(async()=>{try{await Fe()}catch(b){gt.current(b instanceof Error?b.message:"読み込みに失敗しました","エラー")}finally{t(!1)}})()},[Fe]),me.useEffect(()=>{if(e)return;const b=new URLSearchParams(window.location.search),H=b.get("selected"),q=b.get("app");if(H&&/^\d{4}-\d{2}-\d{2}$/.test(H)&&L(H),q){const he=l.find(ve=>ve.id===q);he&&(L(he.date),A(he),G("view"))}},[e,l]),me.useEffect(()=>{f0({screen:w,selected:y})},[w,y]),me.useEffect(()=>{g0(Y)},[Y]),me.useEffect(()=>{p0(O)},[O]);const Z=N?F0(N):"—",gt=me.useRef(()=>{}),be=me.useCallback((b,H)=>{re({text:b,mark:H}),window.setTimeout(()=>re(null),2600)},[]);gt.current=be;const nt=me.useCallback((b,H,q=null)=>{W(he=>[{id:"l"+Date.now()+Math.random().toString(36).slice(2,5),at:new Date().toISOString(),actor:Z,type:b,text:H,appId:q},...he]),Wx({type:b,text:H,app_id:q}).catch(()=>{})},[Z]),Xe=(b,H)=>{A(b),G(H??null)},lt=()=>{A(null),G(null)},it=(b,H)=>{f(q=>q.map(he=>he.id===b?{...he,...H}:he)),A(q=>q&&q.id===b?{...q,...H}:q)},ot=async(b,H,q,he)=>{if(he!==void 0&&H===null){try{await Td(b.id,{status_comment:he}),it(b.id,{adminNote:he}),nt("approve",`「${b.title}」に担当者メモを追加`,b.id),be("担当者メモを保存しました")}catch(ve){be(ve instanceof Error?ve.message:"保存に失敗しました","エラー")}return}if(H)try{if(H==="approved"&&b.status==="pending")throw new Error("承認は担当者を選ぶダイアログから行ってください");b.status==="cancelled"&&H==="pending"?await Mx(b.id):await Td(b.id,{status:P0(H)}),it(b.id,{status:H,...q||{},by:Z});const ve=ea[H];nt(H==="cancelled"?"cancel":"approve",`「${b.title}」を${ve}（${Wa(b.date)}・${li[b.kind]}）`,b.id),be(`${b.title} を${ve}にしました`,ve),await Le(y)}catch(ve){be(ve instanceof Error?ve.message:"更新に失敗しました","エラー")}},Tt=async(b,H,q,he)=>{const ve=Vd(b);if(H.length===ve.length){await ot(b,q,he);return}try{await Bx(b.id,{slot_indexes:H,target_status:q});const $e=ea[q],pt=`${qt(eo(H[0]))}〜${qt(eo(H[H.length-1])+Qs)}`;nt(q==="cancelled"?"cancel":"approve",`「${b.title}」の ${pt}（${H.length}枠）を${$e}`,b.id),be(`${pt} を${$e}にしました`,`${H.length}枠`),lt(),await Le(y)}catch($e){be($e instanceof Error?$e.message:"部分更新に失敗しました","エラー")}},z=b=>{X({app:b})},C=async b=>{if(!le||ce)return;const{app:H}=le;j(!0);try{await Nx(H.id,b),it(H.id,{status:"approved",by:Z}),nt("approve",`「${H.title}」を承認（${Wa(H.date)}・${li[H.kind]}）`,H.id),be(`${H.title} を承認しました`,"承認"),await Le(y),(R==null?void 0:R.id)===H.id&&lt(),X(null)}catch(q){be(q instanceof Error?q.message:"承認に失敗しました","エラー")}finally{j(!1)}},de=async(b,H,q,he)=>{if(he==="note"){await ot(b,null,void 0,q);return}if(he==="approved"){z(b);return}if(he==="pending"||he==="done"){await ot(b,he);return}const ve=H?q||H.body:q;await ot(b,"cancelled",H?{rejectReason:H.id,adminNote:ve}:{adminNote:ve})},ge=async(b,H,q)=>{if(!H||H===b.date)return;const he=b.date;try{await zx(b.id,H,!!(q!=null&&q.forced)),nt("move",`「${b.title}」を ${Wa(he)} → ${Wa(H)} に変更（${li[b.kind]}${q!=null&&q.forced?"・強制":""}）`,b.id),be(`${b.title} を ${Gg(H)} に変更しました`,q!=null&&q.forced?"強制":li[b.kind]),L(H),te(null),lt(),await Le(H)}catch(ve){be(ve instanceof Error?ve.message:"移動に失敗しました","エラー")}},Se=async b=>{try{const H=await Ax({name:b.name,homeroom:b.hr,student_number:b.num,discord_user_id:b.discord||null});b.hubUserId&&await Ip(H.member.id,b.hubUserId),await jp(H.member.id,Zp(b.color)),await Fe(),nt("member",`担当者「${b.name}」を追加`,null),be(`${b.name} を追加しました`)}catch(H){be(H instanceof Error?H.message:"追加に失敗しました","エラー")}},Me=async(b,H)=>{try{await jp(b,Zp(H.color)),await qx(b,H.discord.trim()||null),await Ip(b,H.hubUserId),await Fe();try{U(await Up())}catch{}const q=Qr(b);nt("member",`担当者「${q?q.name:b}」を更新`,null),be(`${H.name} を更新しました`)}catch(q){be(q instanceof Error?q.message:"更新に失敗しました","エラー")}},We=async b=>{try{const H=Qr(b);await bx(b),await Fe(),nt("member",`担当者「${H?H.name:b}」を削除（シフトも削除）`,null),be(`${H?H.name:"担当者"} を削除しました`)}catch(H){be(H instanceof Error?H.message:"削除に失敗しました","エラー")}},Re=(b,H,q)=>{m(he=>{const ve=new Set(he[b]||[]);H.forEach($e=>q?ve.add($e):ve.delete($e));const Ye={...he,[b]:[...ve].sort()};return hl(Ye),Ye})},Ce=Cx(Xs(p),Xs(d),[],[]),tt=me.useMemo(()=>I0(p,d),[p,d]),Ae=()=>{const b={};for(const[H,q]of Object.entries(p))b[H]=[...q];m(b),hl(b)},He=async()=>{if(!(!Ce||M)){E(!0);try{await Rx(Xs(p),Xs(d),[],[]),g(()=>{const b={};for(const[H,q]of Object.entries(d))b[H]=[...q];return b}),nt("shift","シフト表を一括保存",null),be("シフトを保存しました","確定")}catch(b){be(b instanceof Error?b.message:"シフト保存に失敗しました","エラー"),await Fe()}finally{E(!1)}}},ct=me.useCallback(async(b,H)=>{try{const q=await kp(b,H),he=U0(_.current,x.current,q.availability,b,H);g(he.saved),m(he.avail),hl(he.avail)}catch(q){gt.current(q instanceof Error?q.message:"シフト読込に失敗しました","エラー")}},[]),qe=async()=>{be("Discordへテスト送信しています…");try{await Hx(),nt("integ","Discordへテスト通知を送信",null),be("Discordへ送信しました","成功")}catch(b){be(b instanceof Error?b.message:"送信に失敗しました","エラー")}},Ie=async b=>{const H=await Vx(b),q=H.sent.map(he=>he.name).join("・");return nt("integ",`Discordメンションテスト: ${q}`,null),H},st=async()=>{try{const b=await Px();b.ok?(nt("integ","Googleカレンダー接続テスト成功",null),be("Googleカレンダーに接続できました","接続OK")):be(b.error||"接続に失敗しました","エラー")}catch(b){be(b instanceof Error?b.message:"接続テストに失敗しました","エラー")}},ht=async b=>{const H=await Gx(b);return nt("integ",`テストメールを ${H.to} に送信`,null),H},bt=()=>{const b=Lg(zn(y)),H=kl(b,27),q=k0(l,Yn(b),Yn(H),s.map($e=>({id:$e.id,name:$e.name}))),he=new Blob([q],{type:"text/csv;charset=utf-8"}),ve=URL.createObjectURL(he),Ye=document.createElement("a");Ye.href=ve,Ye.download=`3dprint_${Yn(b)}_${Yn(H)}.csv`,document.body.appendChild(Ye),Ye.click(),Ye.remove(),window.setTimeout(()=>URL.revokeObjectURL(ve),1e3),be("CSVを書き出しました",`${$p(b)}–${$p(H)}`)},rt=o0(l);return e?u.jsx("main",{className:"main-content","data-testid":"management-loading",children:u.jsx(Rg,{testId:"management-app-loading"})}):u.jsxs(u.Fragment,{children:[u.jsx(W0,{screen:w,setScreen:S,operatorSession:N,pendingCount:rt.length,onCsv:bt}),u.jsxs("main",{className:"main-content","data-testid":"management-app",children:[u.jsx("div",{className:"page-head",children:u.jsxs("div",{style:{minWidth:0},children:[u.jsx("span",{className:"badge",children:"自然科学部 3Dモデル班"}),u.jsx("h1",{className:"page-heading",children:w==="reserve"?"3Dプリント 申請の管理":w==="settings"?"シフト・担当者・外部連携":"運用（プリンター・履歴）"})]})}),w==="reserve"?u.jsx(N1,{apps:l,selected:y,onPick:L,onOpen:Xe,onApprove:b=>z(b),onCancel:(b,H,q,he)=>void de(b,H,q,he),onPartial:(b,H,q,he)=>void Tt(b,H,q,he),log:O,onDownload:(b,H)=>{H==="file"?window.open(`/api/3dprint/admin/stl/${b.id}`,"_blank"):j0(b,H),be(`${b.title} をダウンロードしました`,H==="file"?b.file:"申請書")},onDownloadAll:b=>{const H=H0(l,b);be(`${Wa(b)} の申請 ${H}件を書き出しました`,"一括DL")},onMove:b=>te(b)}):w==="settings"?u.jsx(z1,{members:s,avail:d,onAddMember:b=>void Se(b),onUpdateMember:(b,H)=>void Me(b,H),onRemoveMember:b=>void We(b),onPaintAvail:Re,shiftDraftPending:Ce,shiftDraftSummary:tt,shiftApplying:M,onConfirmShiftDraft:()=>void He(),onDiscardShiftDraft:Ae,onLoadShiftMonth:ct,integrations:Y,setIntegrations:I,onTestDiscord:()=>void qe(),onTestDiscordMention:Ie,onTestGcal:()=>void st(),onTestEmail:ht,emailConfigured:Ue,discordConfigured:pe,log:O,pendingPre:K}):u.jsx(K1,{showToast:be})]}),u.jsx("footer",{className:"site-footer",children:u.jsxs("div",{className:"footer-inner",children:[u.jsx("img",{src:$g,alt:""}),u.jsxs("div",{className:"club",children:[u.jsx("b",{children:"松山南高校 自然科学部 / 3Dモデル班"}),u.jsx("span",{children:"承認・取り消しは担当者のみ。操作は記録されます。"})]}),u.jsxs("div",{className:"right",children:[u.jsx("a",{href:"/apps/3dprint-reservation/",children:"申請フォーム（生徒用）"}),u.jsx("a",{href:"mailto:diorama@mmh-virtual.jp",children:"diorama@mmh-virtual.jp"})]})]})}),u.jsx(R1,{app:R,log:O,onClose:lt,onPartial:(b,H,q,he)=>void Tt(b,H,q,he),onCancelAll:(b,H,q,he)=>void de(b,H,q,he),onApproveRequest:b=>z(b),onMove:b=>te(b)}),u.jsx(L1,{open:!!le,app:(le==null?void 0:le.app)??null,members:s,busy:ce,onClose:()=>!ce&&X(null),onConfirm:b=>void C(b)}),u.jsx(U1,{open:!!B,app:B,apps:l,onClose:()=>te(null),onMove:ge}),u.jsx(K0,{toast:k})]})}function J1(){const[r,e]=me.useState(!1),[t,s]=me.useState(!1);return me.useEffect(()=>{(async()=>{const o=await yx();if(o==="login"){const l=encodeURIComponent(window.location.pathname+window.location.search);window.location.href=`/login/?next=${l}`;return}if(o==="denied"){s(!0);return}e(!0)})()},[]),t?u.jsxs("main",{style:{padding:"2rem",fontFamily:"Inter, sans-serif"},children:[u.jsx("h1",{children:"アクセス拒否"}),u.jsx("p",{children:"3D印刷管理アプリを利用する権限がありません。"}),u.jsx("p",{children:u.jsx("a",{href:"/",children:"ダッシュボードに戻る"})})]}):r?u.jsx(Z1,{}):u.jsx("main",{className:"main-content","data-testid":"management-access-loading",children:u.jsx(Rg,{})})}document.body.classList.add("admin-app");_x.createRoot(document.getElementById("root")).render(u.jsx(me.StrictMode,{children:u.jsx(J1,{})}));
