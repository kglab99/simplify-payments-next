import{j as e,u as i,L as n}from"./index-BqiqHOou.js";import{r as d,i as u,n as o,b as c,a as x,l as f,c as m,d as j,e as h}from"./Add-Bhw3TW4z.js";import{n as v}from"./chunk-XVPKP73N-Bsprj19V.js";var t={},p=u;Object.defineProperty(t,"__esModule",{value:!0});var s=t.default=void 0,_=p(d()),b=e;s=t.default=(0,_.default)((0,b.jsx)("path",{d:"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),"ChevronRight");function R({groups:r}){const l=i();return e.jsxs("div",{className:"flex flex-col ",children:[e.jsx(o,{maxWidth:"full",isBordered:!0,isBlurred:!0,children:e.jsx(v,{children:e.jsx("p",{className:"font-bold text-inherit",children:"Simplify Payments"})})}),e.jsxs("div",{className:"px-6 py-4",children:[e.jsx(c,{children:e.jsx(x,{children:"Groups"})}),e.jsx(f,{children:r.map(a=>e.jsxs(m,{endContent:e.jsx(s,{}),onClick:()=>l(`/group/${a.id}`),children:[e.jsx("h2",{className:"text-xl font-bold",children:a.groupName}),e.jsxs("p",{children:[" ",Object.values(a.users).join(", ")]})]},a.id))})]}),e.jsx(n,{className:"self-center",to:"/create-group",children:e.jsx(j,{variant:"flat",size:"md",radius:"sm",startContent:e.jsx(h,{}),className:"text-black",children:"Create new group"})})]})}export{R as default};