const nav=document.querySelector(".navbar");
window.addEventListener("scroll",()=>nav?.classList.toggle("scrolled",scrollY>35),{passive:true});

const menuBtn=document.querySelector(".menu-btn");
const mobileMenu=document.querySelector(".mobile-menu");
menuBtn?.addEventListener("click",()=>{mobileMenu.classList.toggle("open");document.body.classList.toggle("menu-open");});
mobileMenu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mobileMenu.classList.remove("open");document.body.classList.remove("menu-open");}));

const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")});},{threshold:.1});
document.querySelectorAll(".reveal").forEach(x=>io.observe(x));

/* Product Finder: search + CAS/formula/purity/category */
const productCards=[...document.querySelectorAll("[data-product]")];
const search=document.querySelector("[data-product-search]");
const formula=document.querySelector("[data-formula-filter]");
const purity=document.querySelector("[data-purity-filter]");
const category=document.querySelector("[data-category-filter]");
const count=document.querySelector("[data-result-count]");
const noResults=document.querySelector("[data-no-results]");
function filterProducts(){
  const q=(search?.value||"").toLowerCase().trim(), f=formula?.value||"", p=purity?.value||"", c=category?.value||"";
  let shown=0;
  productCards.forEach(card=>{
    const text=card.innerText.toLowerCase(), okQ=!q||text.includes(q), okF=!f||card.dataset.formula===f, okP=!p||Number(card.dataset.purity)>=Number(p), okC=!c||card.dataset.category===c;
    const show=okQ&&okF&&okP&&okC; card.style.display=show?"":"none"; if(show)shown++;
  });
  if(count)count.textContent=shown; if(noResults)noResults.classList.toggle("show",shown===0);
}
[search,formula,purity,category].forEach(el=>el?.addEventListener(el===search?"input":"change",filterProducts));

document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");const val=btn.dataset.filter;if(category)category.value=val==="all"?"":val;filterProducts();}));

/* Premium image loading */
document.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>img.classList.add("image-missing")));

/* Certificate filters */
document.querySelectorAll("[data-doc-filter]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-doc-filter]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");const val=btn.dataset.docFilter;document.querySelectorAll("[data-doc]").forEach(card=>card.classList.toggle("doc-hidden",val!=="all"&&card.dataset.doc!==val));}));

/* RFQ multi-step wizard */
const rfqForm=document.querySelector("[data-rfq-wizard]");
if(rfqForm){
  const pages=[...rfqForm.querySelectorAll(".rfq-page")], steps=[...document.querySelectorAll(".rfq-step")], progress=rfqForm.querySelector("[data-progress]"), success=rfqForm.querySelector("[data-rfq-success]");
  let current=0;
  const sync=()=>{pages.forEach((p,i)=>p.classList.toggle("active",i===current));steps.forEach((s,i)=>s.classList.toggle("active",i===current));if(progress)progress.style.width=((current+1)/pages.length*100)+"%";};
  rfqForm.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>{const fields=[...pages[current].querySelectorAll("input,select,textarea")];if(!fields.every(f=>f.checkValidity())){fields.find(f=>!f.checkValidity())?.reportValidity();return;}current=Math.min(current+1,pages.length-1);sync();}));
  rfqForm.querySelectorAll("[data-prev]").forEach(b=>b.addEventListener("click",()=>{current=Math.max(0,current-1);sync();}));
  rfqForm.addEventListener("input",()=>{rfqForm.querySelectorAll("[data-review]").forEach(out=>{const key=out.dataset.review;const field=rfqForm.querySelector(`[name="${key}"]`);out.textContent=field?.value||"—";});});
  rfqForm.addEventListener("submit",e=>{e.preventDefault();if(success){success.classList.add("show");rfqForm.querySelectorAll(".rfq-page,.rfq-actions,.rfq-progress").forEach(x=>x.style.display="none");}});
  sync();
}

/* Demo forms on pages without wizard */
document.querySelectorAll("form[data-demo-form]:not([data-rfq-wizard])").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();const btn=form.querySelector("button[type=submit]");if(btn){btn.textContent="Inquiry Received ✓";btn.disabled=true}}));

/* Gentle pointer lift on desktop */
if(matchMedia("(pointer:fine)").matches){document.querySelectorAll(".card,.btn").forEach(el=>el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");el.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");}));}
