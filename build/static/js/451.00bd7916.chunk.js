"use strict";(self.webpackChunkagritech_client=self.webpackChunkagritech_client||[]).push([[451],{9666:function(e,n,t){t.r(n),t.d(n,{default:function(){return F}});var i=t(1413),r=t(5987),a=t(2791),s=t.p+"static/media/shape.26b113ef06fe6cada749.png",c=t.p+"static/media/main-banner.9147d619e9df7f93925a.webp",o=t.p+"static/media/about-shape.a0217e1d23128c6821f9.png",l=t.p+"static/media/wheatFarm.c8e2e44a469bd94dbbe5.webp",d=t(9439),h=t(5671),u=t(3144),f=t(136),m=t(7277);function g(){return g=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},g.apply(this,arguments)}var v=new Map,y=new WeakMap,p=0,x=void 0;function j(e){return Object.keys(e).sort().filter((function(n){return void 0!==e[n]})).map((function(n){return"".concat(n,"_").concat("root"===n?(t=e.root)?(y.has(t)||(p+=1,y.set(t,p.toString())),y.get(t)):"0":e[n]);var t})).toString()}function b(e){var n=j(e),t=v.get(n);if(!t){var i,r=new Map,a=new IntersectionObserver((function(n){n.forEach((function(n){var t,a=n.isIntersecting&&i.some((function(e){return n.intersectionRatio>=e}));e.trackVisibility&&"undefined"===typeof n.isVisible&&(n.isVisible=a),null==(t=r.get(n.target))||t.forEach((function(e){e(a,n)}))}))}),e);i=a.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),t={id:n,observer:a,elements:r},v.set(n,t)}return t}function w(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:x;if("undefined"===typeof window.IntersectionObserver&&void 0!==i){var r=e.getBoundingClientRect();return n(i,{isIntersecting:i,target:e,intersectionRatio:"number"===typeof t.threshold?t.threshold:0,time:0,boundingClientRect:r,intersectionRect:r,rootBounds:r}),function(){}}var a=b(t),s=a.id,c=a.observer,o=a.elements,l=o.get(e)||[];return o.has(e)||o.set(e,l),l.push(n),c.observe(e),function(){l.splice(l.indexOf(n),1),0===l.length&&(o.delete(e),c.unobserve(e)),0===o.size&&(c.disconnect(),v.delete(s))}}var N=["children","as","triggerOnce","threshold","root","rootMargin","onChange","skip","trackVisibility","delay","initialInView","fallbackInView"];function Z(e){return"function"!==typeof e.children}a.Component;function k(e,n){var t=function(){var e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=n.threshold,i=n.delay,r=n.trackVisibility,s=n.rootMargin,c=n.root,o=n.triggerOnce,l=n.skip,h=n.initialInView,u=n.fallbackInView,f=n.onChange,m=a.useState(null),g=(0,d.Z)(m,2),v=g[0],y=g[1],p=a.useRef(),x=a.useState({inView:!!h,entry:void 0}),j=(0,d.Z)(x,2),b=j[0],N=j[1];p.current=f,a.useEffect((function(){var e;if(!l&&v)return e=w(v,(function(n,t){N({inView:n,entry:t}),p.current&&p.current(n,t),t.isIntersecting&&o&&e&&(e(),e=void 0)}),{root:c,rootMargin:s,threshold:t,trackVisibility:r,delay:i},u),function(){e&&e()}}),[Array.isArray(t)?t.toString():t,v,c,s,o,l,r,u,i]);var Z=null==(e=b.entry)?void 0:e.target,k=a.useRef();v||!Z||o||l||k.current===Z||(k.current=Z,N({inView:!!h,entry:void 0}));var V=[y,b.inView,b.entry];return V.ref=V[0],V.inView=V[1],V.entry=V[2],V}(),i=t.ref,r=t.inView,s=t.entry;return(0,a.useEffect)((function(){var e,t;r?null===(e=n.split(" "))||void 0===e||e.forEach((function(e){null===s||void 0===s||s.target.classList.add(e)})):null===(t=n.split(" "))||void 0===t||t.forEach((function(e){null===s||void 0===s||s.target.classList.remove(e)}))}),[r]),{ref:i,entry:s,className:e}}var V=t(184),I=["entry"],C=["entry"],A=["entry"],O=["entry"],R=["entry"],E=["entry"];var F=function(){var e=k("headings","fadeIn"),n=(e.entry,(0,r.Z)(e,I)),t=k("preFade","fadeIn"),d=(t.entry,(0,r.Z)(t,C)),h=k("preFadeRight","fadeIn"),u=(h.entry,(0,r.Z)(h,A)),f=k("preFade","fadeIn"),m=(f.entry,(0,r.Z)(f,O)),g=k("BorderAnimation","rotateIn"),v=(g.entry,(0,r.Z)(g,R)),y=k("headings preFadeUp","fadeIn"),p=(y.entry,(0,r.Z)(y,E)),x=(0,a.useRef)();return(0,V.jsx)(V.Fragment,{children:(0,V.jsxs)("div",{className:"container-fluid p-0 m-0 bg-img",children:[(0,V.jsxs)("div",{className:"row",children:[(0,V.jsx)("div",{className:"col-lg-6 col-md-12 p-0 m-0 d-flex justify-content-center",children:(0,V.jsxs)("div",{className:"hero-sec w-75",children:[(0,V.jsx)("h1",(0,i.Z)((0,i.Z)({},n),{},{children:"Changing farming with technology"})),(0,V.jsx)("p",{children:" AgriTech offers a variety of services including supply-chain management, inventory management, and more to help farmers grow sustainably."}),(0,V.jsx)("p",{children:"Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets."}),(0,V.jsx)("button",{className:"btn btn-success",children:"What we do?"})]})}),(0,V.jsx)("div",{className:"col-lg-6 col-md-12 p-0 m-0",children:(0,V.jsxs)("div",{className:"img-hero",children:[(0,V.jsx)("div",(0,i.Z)({},v)),(0,V.jsx)("img",{loading:"lazy",className:"img-hero-main",src:c,alt:""}),(0,V.jsxs)("div",{className:"shape-area",children:[(0,V.jsx)("div",{className:"creative-shape",children:(0,V.jsx)("img",{loading:"lazy",src:s,alt:""})}),(0,V.jsx)("div",{className:"creative-shape-2",children:(0,V.jsx)("img",{loading:"lazy",src:s,alt:""})})]})]})})]}),(0,V.jsxs)("div",{className:"features",children:[(0,V.jsxs)("div",{className:"row mx-5 align-items-center",children:[(0,V.jsxs)("div",{className:"col-lg-6 col-md-12",children:[(0,V.jsx)("h1",(0,i.Z)((0,i.Z)({},p),{},{children:"Features"})),(0,V.jsx)("div",{ref:x,className:"feat-img",children:(0,V.jsx)("img",{loading:"lazy",src:l,alt:""})})]}),(0,V.jsxs)("div",{className:"col-lg-6 col-md-12 my-5 py-5",children:[(0,V.jsxs)("div",{className:"text-left",children:[(0,V.jsx)("h2",(0,i.Z)((0,i.Z)({},d),{},{children:"Better management with KissanCoin"})),(0,V.jsx)("p",{children:"Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets."})]}),(0,V.jsxs)("div",{className:"text-right",children:[(0,V.jsx)("h2",(0,i.Z)((0,i.Z)({},u),{},{children:"Streamline operations"})),(0,V.jsx)("p",{children:"AgriTech's supply-chain management and inventory management tools make it easy to manage your operations from seed to harvest."})]}),(0,V.jsxs)("div",{className:"text-left",children:[(0,V.jsx)("h2",(0,i.Z)((0,i.Z)({},m),{},{children:"Access to farming equipment"})),(0,V.jsx)("p",{children:"Easily buy or rent the equipment you need with AgriTech's marketplace for farming equipment."})]})]})]}),(0,V.jsx)("div",{className:"features-shape-img",children:(0,V.jsx)("img",{loading:"lazy",src:o,alt:""})})]})]})})}}}]);
//# sourceMappingURL=451.00bd7916.chunk.js.map