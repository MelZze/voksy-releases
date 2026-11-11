// Choix de la langue des pages légales : #en ou ?lang=en → anglais, sinon français.
const root = document.documentElement;
function apply() {
  const en = location.hash === '#en' || new URLSearchParams(location.search).get('lang') === 'en';
  root.classList.add('js-lang');
  root.classList.toggle('show-en', en);
  root.classList.toggle('show-fr', !en);
  root.lang = en ? 'en' : 'fr';
  for (const a of document.querySelectorAll('.lang-switch a')) a.setAttribute('aria-current', String((a.hash === '#en') === en));
  const t = document.querySelector(`[data-title-${en ? 'en' : 'fr'}]`);
  if (t) document.title = t.dataset[en ? 'titleEn' : 'titleFr'];
}
apply();
addEventListener('hashchange', () => { apply(); scrollTo(0, 0); });
