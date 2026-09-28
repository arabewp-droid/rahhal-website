(function(){
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>document.body.classList.add('loaded'));

  /* header */
  const hdr=document.getElementById('hdr');
  const onScroll=()=>hdr.classList.toggle('solid',scrollY>40||document.body.classList.contains('menu-open'));
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* mobile menu */
  const burger=document.getElementById('burger'),nav=document.getElementById('nav');
  const setMenu=o=>{nav.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'إغلاق القائمة':'فتح القائمة');onScroll();};
  burger.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  /* hero video */
  const vid=document.getElementById('heroVid');
  const src=vid.querySelector('source').getAttribute('src');
  if(!RM && src && !src.startsWith('__')){
    vid.addEventListener('canplay',()=>{vid.classList.add('ready');vid.play().catch(()=>{});},{once:true});
    vid.load();
  }

  /* reveals */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(el.parentElement.classList.contains('steps')||el.parentElement.classList.contains('svc-list'))?((i%5)*70)+'ms':'0ms';io.observe(el);});

  /* parallax */
  const pars=[...document.querySelectorAll('[data-par]')];
  const heroImg=document.getElementById('heroImg');
  if(!RM){
    let tick=false;
    const run=()=>{
      const vh=innerHeight;
      if(scrollY<vh) heroImg.style.transform='translateY('+(scrollY*.25)+'px) scale(1.06)';
      pars.forEach(img=>{const r=img.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=(r.top+r.height/2-vh/2);img.style.transform='translateY('+(-p*parseFloat(img.dataset.par)-40)+'px)';});
      tick=false;
    };
    addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(run);}},{passive:true});run();
  }

  /* network map */
  const C=[
    {id:'tng',n:'طنجة',x:320,y:50,ly:-18,t:'24 ساعة',tr:28,km:340,ty:'كامل وجزئي ودولي',note:'منصة ربط مباشر مع ميناء طنجة المتوسط للشحنات المتجهة إلى أوروبا.',path:[[232,206],[278,168],[300,128],[320,50]],lx:12},
    {id:'tet',n:'تطوان',x:380,y:62,t:'24 ساعة',tr:10,km:360,ty:'كامل وجزئي',note:'رحلات منتظمة نحو تطوان والمضيق والفنيدق.',path:[[232,206],[278,168],[300,128],[320,50],[380,62]]},
    {id:'ken',n:'القنيطرة',x:300,y:128,l:1,t:'نفس اليوم',tr:21,km:95,ty:'كامل وجزئي',note:'خدمة مخصصة لموردي مصنع السيارات والمنطقة الصناعية الأطلسية.',path:[[232,206],[278,168],[300,128]],lx:12},
    {id:'rab',n:'الرباط',x:278,y:168,l:1,t:'نفس اليوم',tr:35,km:90,ty:'كامل وجزئي',note:'عدة رحلات يوميًا بين الرباط والدار البيضاء.',path:[[232,206],[278,168]],lx:12},
    {id:'fes',n:'فاس',x:405,y:150,t:'24 ساعة',tr:21,km:295,ty:'كامل وجزئي ومبرّد',note:'تغطية فاس ومكناس والمناطق المجاورة.',path:[[232,206],[278,168],[405,150]],ly:30},
    {id:'ouj',n:'وجدة',x:558,y:118,t:'24 إلى 36 ساعة',tr:14,km:620,ty:'كامل وجزئي',note:'مركز توزيع في الحي الصناعي بوجدة يخدم الناظور وبركان وتاوريرت.',path:[[232,206],[278,168],[405,150],[558,118]],ly:-20,hub:true},
    {id:'cas',n:'الدار البيضاء',x:232,y:206,t:'مركز رئيسي',tr:'يوميًا',km:'—',ty:'كل الخدمات',note:'مقرنا الرئيسي ومستودعنا الأكبر في عين السبع، منه تنطلق كل الرحلات.',path:[],lx:12,hub:true},
    {id:'mar',n:'مراكش',x:246,y:328,t:'نفس اليوم',tr:28,km:240,ty:'كامل وجزئي ومبرّد',note:'رحلات يومية لتموين الفنادق والمتاجر الكبرى.',path:[[232,206],[246,328]],lx:-14},
    {id:'aga',n:'أكادير',x:160,y:420,t:'24 ساعة',tr:24,km:460,ty:'كامل ومبرّد ودولي',note:'مستودع مبرّد في آيت ملول لتصدير خضر وفواكه سوس نحو أوروبا.',path:[[232,206],[246,328],[160,420]],lx:14,hub:true},
    {id:'glm',n:'كلميم',x:136,y:486,t:'36 ساعة',tr:6,km:660,ty:'كامل وجزئي',note:'بوابة الأقاليم الجنوبية، رحلات ثلاث مرات أسبوعيًا.',path:[[232,206],[246,328],[160,420],[136,486]],lx:14},
    {id:'lay',n:'العيون',x:96,y:580,t:'48 ساعة',tr:5,km:1100,ty:'كامل ومبرّد',note:'تموين منتظم للعيون وطرفاية بشاحنات كاملة ومبرّدة.',path:[[232,206],[246,328],[160,420],[136,486],[96,580]],lx:14},
    {id:'dak',n:'الداخلة',x:48,y:686,t:'72 ساعة',tr:3,km:1640,ty:'كامل ومبرّد',note:'نقل منتجات الصيد البحري المبرّدة من الداخلة نحو الشمال وأوروبا.',path:[[232,206],[246,328],[160,420],[136,486],[96,580],[48,686]],lx:14}
  ];
  const NS='http://www.w3.org/2000/svg',g=document.getElementById('cities'),chips=document.getElementById('chips'),map=document.getElementById('map');
  const act=document.getElementById('activeRoute');
  map.querySelectorAll('.mk.draw').forEach(p=>p.style.setProperty('--len',Math.ceil(p.getTotalLength())));
  const els={};
  C.forEach(c=>{
    const a=document.createElementNS(NS,'g');a.setAttribute('class','city'+(c.hub?' hub':''));a.setAttribute('tabindex','0');a.setAttribute('role','button');a.setAttribute('aria-label',c.n);
    const h=document.createElementNS(NS,'circle');h.setAttribute('class','h');h.setAttribute('cx',c.x);h.setAttribute('cy',c.y);h.setAttribute('r',22);
    const o=document.createElementNS(NS,'circle');o.setAttribute('class','o');o.setAttribute('cx',c.x);o.setAttribute('cy',c.y);o.setAttribute('r',c.hub?9:7);
    const t=document.createElementNS(NS,'text');t.textContent=c.n;
    if(c.ly){t.setAttribute('x',c.x);t.setAttribute('y',c.y+c.ly);t.setAttribute('text-anchor','middle');}
    else if(c.l){t.setAttribute('x',c.x-16);t.setAttribute('y',c.y+6);t.setAttribute('text-anchor','end');}
    else{t.setAttribute('x',c.x+16);t.setAttribute('y',c.y+6);t.setAttribute('text-anchor','start');}
    a.append(h,o,t);g.append(a);
    a.addEventListener('click',()=>pick(c.id));
    a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(c.id);}});
    const b=document.createElement('button');b.type='button';b.textContent=c.n;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>pick(c.id));chips.append(b);
    els[c.id]={g:a,b};
  });
  const P={city:pCity,time:pTime,trips:pTrips,km:pKm,type:pType,note:pNote};
  function pick(id){
    const c=C.find(x=>x.id===id);
    Object.values(els).forEach(e=>{e.g.classList.remove('on');e.b.setAttribute('aria-pressed','false');});
    els[id].g.classList.add('on');els[id].b.setAttribute('aria-pressed','true');
    P.city.textContent=c.n;P.time.textContent=c.t;P.trips.textContent=c.tr;P.km.textContent=typeof c.km==='number'?c.km.toLocaleString('ar-MA')+' كم':c.km;P.type.textContent=c.ty;P.note.textContent=c.note;
    P.city.parentElement.querySelector('.panel-from').textContent=id==='cas'?'مركزنا في':'من الدار البيضاء إلى';
    act.setAttribute('d',c.path.length?'M'+c.path.map(p=>p.join(' ')).join(' L'):'');
  }
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){map.classList.add('in');o.disconnect();}}),{threshold:.3}).observe(map);
  pick('tng');

  /* form selects */
  const names=C.map(c=>c.n);
  const fill=(sel,def)=>names.forEach(n=>{const o=new Option(n,n,n===def,n===def);sel.add(o);});
  fill(document.getElementById('from'),'الدار البيضاء');fill(document.getElementById('to'),'طنجة');
  document.querySelectorAll('.svc').forEach(s=>s.addEventListener('click',()=>{const r=document.querySelector('.seg input[value="'+s.dataset.type+'"]');if(r)r.checked=true;}));
  const d=document.getElementById('date');d.min=new Date().toISOString().slice(0,10);

  /* quote form */
  const f=document.getElementById('quoteForm'),msg=document.getElementById('formMsg'),pe=document.getElementById('phoneErr');
  f.addEventListener('submit',e=>{
    e.preventDefault();pe.textContent='';
    const name=f.name.value.trim(),ph=f.phone.value.replace(/[\s.-]/g,'');
    if(!name){f.name.focus();msg.className='form-msg show';msg.style.background='#FBEAEA';msg.style.color='#8C1D18';msg.textContent='أدخل اسمك أو اسم شركتك لنتمكن من التواصل معك.';return;}
    if(!/^(\+212|0)[5-7]\d{8}$/.test(ph)){pe.textContent='أدخل رقمًا مغربيًا صحيحًا، مثل 0612345678.';f.phone.focus();msg.className='form-msg';return;}
    if(f.from.value===f.to.value){msg.className='form-msg show';msg.style.background='#FBEAEA';msg.style.color='#8C1D18';msg.textContent='اختر مدينة وصول مختلفة عن مدينة الانطلاق.';return;}
    msg.style.background='';msg.style.color='';
    msg.textContent='شكرًا '+name+'، تم استلام طلبك لشحنة من '+f.from.value+' إلى '+f.to.value+'. سيتصل بك مستشارنا على الرقم '+f.phone.value+' خلال ساعتين.';
    msg.className='form-msg show';f.reset();document.getElementById('from').value='الدار البيضاء';document.getElementById('to').value='طنجة';
  });

  /* tracking demo */
  const tf=document.getElementById('trackForm'),tr=document.getElementById('trackResult');
  tf.addEventListener('submit',e=>{
    e.preventDefault();const v=document.getElementById('trackInput').value.trim().toUpperCase();
    if(!/^RH-?\d{4,}$/.test(v)){tr.textContent='رقم التتبّع يبدأ بـ RH متبوعًا بأرقام، مثل RH-240918.';return;}
    const stops=['في طريقها بين الرباط والقنيطرة','تم التحميل في مستودع الدار البيضاء','وصلت إلى مركز طنجة وجاهزة للتسليم','في طريقها بين مراكش وأكادير'];
    tr.textContent='الشحنة '+v+': '+stops[parseInt(v.replace(/\D/g,''))%stops.length]+'.';
  });
})();
