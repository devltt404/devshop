function i(e){return(e/100).toFixed(2)}function a({errors:e,form:s}){e&&Object.keys(e).forEach(t=>{s.setError(t,{type:"server",message:e[t]})})}export{i as d,a as s};
