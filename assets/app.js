(() => {
  'use strict';
  const nav = document.querySelector('#main-nav');
  const menu = document.querySelector('.menu-toggle');
  const closeMenu = () => {nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');};
  menu?.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(opened));
    menu.setAttribute('aria-label',opened ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

  const recommendations = {
    fresh: ['Detailing & deep cleaning','Start with interior and exterior care. Tell the team about the areas that need extra attention.'],
    shine: ['Polishing & restoration','Ask about polishing, headlight restoration or dent care. The team can advise after looking at your vehicle.'],
    protect: ['Paint protection & tinting','Explore PPF, tinting and ceramic protection. Ask which options suit your car and how you use it.']
  };
  document.querySelectorAll('.finder-option').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.finder-option').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
    button.classList.add('selected');button.setAttribute('aria-pressed','true');
    const [title, description] = recommendations[button.dataset.goal];
    document.querySelector('#finder-title').textContent=title;
    document.querySelector('#finder-description').textContent=description;
    document.querySelector('#finder-link').href='./booking.html?service='+encodeURIComponent(title);
  }));

  const gallery = [...document.querySelectorAll('.gallery-card')];
  document.querySelectorAll('.gallery-filter').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.gallery-filter').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
    button.classList.add('selected');button.setAttribute('aria-pressed','true');
    let count=0;
    gallery.forEach(card=>{const show=button.dataset.filter==='All'||button.dataset.filter===card.dataset.category;card.hidden=!show;if(show)count++;});
    const status=document.querySelector('.gallery-count');if(status)status.textContent=`Showing ${count} ${count===1?'image':'images'}`;
  }));
  const lightbox=document.querySelector('.lightbox');
  let lightboxTrigger=null;
  document.querySelectorAll('.gallery-open').forEach(button=>button.addEventListener('click',()=>{
    if(!lightbox)return;
    lightboxTrigger=button;
    lightbox.querySelector('img').src=button.dataset.image;
    lightbox.querySelector('img').alt=button.dataset.title+' — from Car Spa Centre’s public social feed';
    lightbox.querySelector('.lightbox-title').textContent=button.dataset.title;
    lightbox.querySelector('.lightbox-source').href=button.dataset.source;
    lightbox.showModal();
  }));
  lightbox?.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close();}});
  lightbox?.addEventListener('close',()=>lightboxTrigger?.focus());

  const serviceSelect=document.querySelector('#service');
  const requestedService=new URLSearchParams(location.search).get('service');
  if(serviceSelect&&requestedService&&[...serviceSelect.options].some(o=>o.value===requestedService))serviceSelect.value=requestedService;
  const visitDate=document.querySelector('#visit-date');
  const todayInDubai = () => {
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const field=k=>parts.find(x=>x.type===k)?.value;
    return `${field('year')}-${field('month')}-${field('day')}`;
  };
  if(visitDate)visitDate.min=todayInDubai();

  document.querySelectorAll('.enquiry-form').forEach(form=>{
    const phoneInput=form.querySelector('[name="phone"]');
    phoneInput?.addEventListener('input',()=>phoneInput.setCustomValidity(''));
    const resetPreview=()=>{form.querySelector('.request-result').hidden=true;};
    form.addEventListener('input',resetPreview);
    form.addEventListener('change',resetPreview);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const data=new FormData(form);
      if(!/^\+?[0-9][0-9 ()-]{5,28}[0-9]$/.test(String(data.get('phone')).trim())){
        phoneInput.setCustomValidity('Please enter a phone number using digits, spaces, brackets or a leading +.');
        phoneInput.reportValidity();return;
      }
      if(visitDate&&String(data.get('date'))<todayInDubai()){visitDate.setCustomValidity('Please choose today or a future date in UAE time.');visitDate.reportValidity();return;}
      visitDate?.setCustomValidity('');
      const lines=[`Hello Car Spa Centre team, I’d like to ask about ${data.get('service')}.`,`Name: ${String(data.get('name')).trim()}`,`Phone: ${String(data.get('phone')).trim()}`,`Vehicle: ${String(data.get('vehicle')).trim()}`];
      if(data.get('date'))lines.push(`Preferred visit: ${data.get('date')} at ${data.get('time')} (UAE time). Please confirm availability.`);
      if(String(data.get('message')||'').trim())lines.push(`Details: ${String(data.get('message')).trim()}`);
      lines.push('Please confirm the price and what’s included. This enquiry was prepared using an independent website concept preview.');
      const text=lines.join('\n');
      const result=form.querySelector('.request-result');
      result.querySelector('.request-summary').textContent=text;
      result.querySelector('.request-wa').href='https://wa.me/971522851669?text='+encodeURIComponent(text);
      result.querySelector('.copy-status').textContent='';
      result.hidden=false;result.focus({preventScroll:true});result.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    form.querySelector('.copy-request').addEventListener('click',async()=>{
      const text=form.querySelector('.request-summary').textContent;
      try{await navigator.clipboard.writeText(text);form.querySelector('.copy-status').textContent='Copied. Nothing has been sent.';}
      catch{form.querySelector('.copy-status').textContent='Select and copy the text above. Nothing has been sent.';}
    });
    visitDate?.addEventListener('input',()=>visitDate.setCustomValidity(''));
  });
})();
