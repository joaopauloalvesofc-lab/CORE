const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');document.querySelectorAll('.nav-drop[open]').forEach(drop=>drop.open=false);}});
  document.addEventListener('click',event=>{document.querySelectorAll('.nav-drop[open]').forEach(drop=>{if(!drop.contains(event.target))drop.open=false;});});
}
const articleFilters=document.querySelectorAll('[data-filter]');
const articleSearch=document.querySelector('#article-search');
if(articleFilters.length){
  let category='all';
  const normalize=s=>s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const filterArticles=()=>{let found=0;const query=normalize(articleSearch?.value||'');document.querySelectorAll('.article-card[data-category]').forEach(card=>{const visible=(category==='all'||card.dataset.category===category)&&normalize(card.textContent).includes(query);card.hidden=!visible;if(visible)found++;});const empty=document.querySelector('.empty-state');if(empty)empty.hidden=found>0;const count=document.querySelector('#filter-status');if(count)count.textContent=found+' conteúdo'+(found===1?'':'s')+' encontrado'+(found===1?'':'s');};
  articleFilters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;articleFilters.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));filterArticles();}));
  articleSearch?.addEventListener('input',filterArticles);
}
const contactForm=document.querySelector('#contact-form');
if(contactForm){
  const select=contactForm.querySelector('[name=servico]');
  const chosen=new URLSearchParams(location.search).get('servico');
  if(chosen&&Array.from(select.options).some(option=>option.value===chosen))select.value=chosen;
  contactForm.addEventListener('submit',event=>{
    event.preventDefault();if(!contactForm.reportValidity())return;
    const fields=new FormData(contactForm);
    const service=select.options[select.selectedIndex].textContent;
    const message=['Olá, CORE Gestão! Gostaria de conversar sobre '+service+'.','', 'Nome: '+fields.get('nome'),'Instituição: '+fields.get('instituicao'),'E-mail: '+fields.get('email'),fields.get('telefone')?'Telefone: '+fields.get('telefone'):'','',String(fields.get('mensagem')).trim()].filter(value=>value!==null).join('\n');
    const whatsapp='https://wa.me/5583991934988?text='+encodeURIComponent(message);
    const email='mailto:coregestaoadm@gmail.com?subject='+encodeURIComponent('Solicitação | '+service)+'&body='+encodeURIComponent(message);
    const result=document.querySelector('#form-result');
    result.querySelector('[data-whatsapp]').href=whatsapp;
    result.querySelector('[data-email]').href=email;
    result.hidden=false;
    result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    result.focus({preventScroll:true});
  });
}
