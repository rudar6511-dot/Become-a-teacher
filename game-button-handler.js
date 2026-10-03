(function(){
const call=(n,...a)=>typeof window[n]==="function"?window[n](...a):null;
const icon={school:"🏫",college:"🎓",training:"📚",class:"🧑‍🏫",home:"🏠",city:"🚗",library:"📖",staff:"🧑‍💼",market:"🛒",car:"🚗",park:"🌳",office:"💼",academy:"🏛️"};
function openScene(id){
 const ic=icon[id]||"🎮",name=id.charAt(0).toUpperCase()+id.slice(1);
 call("showActiveScene",ic+" "+name+" Scene","<h2>"+ic+" "+name+"</h2><p>Choose an activity to continue your teacher journey.</p><div class="sceneActions"><button class="btn primary" type="button" data-play=""+id+"">▶ Play</button><button class="btn secondary" type="button" data-close-scene="1">Close</button></div>",ic);
}
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.closeScene!==undefined){call("closeActiveScene");return}
 if(b.dataset.play!==undefined){
   const a=b.dataset.play;
   if(a==="class")call("teachClass");else if(a==="home")call("relaxHome");else if(a==="salary")call("collectSalary");else call("lifeAction",a);
   call("closeActiveScene");return;
 }
 if(b.dataset.daily!==undefined){call("claimDaily");return}
 if(b.dataset.save!==undefined){call("save");call("toast","Game saved! 💾");return}
 if(b.dataset.scene!==undefined){e.preventDefault();openScene(b.dataset.scene);return}
 if(b.dataset.life!==undefined){e.preventDefault();openScene(b.dataset.life);return}
 if(b.dataset.action!==undefined){e.preventDefault();call("sceneAction",b.dataset.action);return}
 if(b.dataset.m!==undefined){e.preventDefault();call("mission",Number(b.dataset.m));return}
 if(b.dataset.buy!==undefined){e.preventDefault();call("buyChar",b.dataset.buy);return}
 if(b.dataset.use!==undefined){e.preventDefault();if(window.s)window.s.selected=b.dataset.use;call("save");call("render");call("toast","Character selected! ⭐");return}
 if(b.dataset.a!==undefined){e.preventDefault();call("buyAsset",b.dataset.a);return}
 if(b.dataset.filter!==undefined){
   document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));
   if(typeof window.renderChars==="function")window.renderChars(b.dataset.filter);return;
 }
 if(b.dataset.look!==undefined){e.preventDefault();const [k,v]=b.dataset.look.split(":");if(window.s){window.s[k]=v;call("save");call("renderCustom");call("toast","Look updated! ✨");}return}
});
document.addEventListener("click",e=>{if(e.target.id==="sceneBackdrop")call("closeActiveScene")});
document.addEventListener("keydown",e=>{if(e.key==="Escape")call("closeActiveScene")});
})();