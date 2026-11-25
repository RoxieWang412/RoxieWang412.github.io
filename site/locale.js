'use strict';
(function () {
  const copy = {
    zh: {
      htmlLang: 'zh-Hant', skip: '跳至內容', home: 'Roxie Wang 首頁', nav: '主導覽',
      explore: '探索作品', about: '關於我', hello: '聯絡我', contact: '聯絡我',
      language: '選擇網站語言', close: '關閉 ×', closeLabel: '關閉放大圖片', lightbox: '放大觀看作品',
      description: 'Roxie Wang 的創作空間。探索視覺設計、AI 影像、互動裝置、攝影與繪畫。',
      loading: '正在載入作品…', error: '載入未完成，請重新整理頁面。',
      data: 'data.js', app: 'app.js'
    },
    en: {
      htmlLang: 'en', skip: 'Skip to content', home: 'Roxie Wang home', nav: 'Main navigation',
      explore: 'Explore', about: 'About', hello: 'Say hello', contact: 'Get in touch',
      language: 'Choose website language', close: 'Close ×', closeLabel: 'Close enlarged image', lightbox: 'View full-size artwork',
      description: 'The creative world of Roxie Wang. Explore visual design, AI moving image, interactive installations, photography and drawing.',
      loading: 'Loading selected work…', error: 'The page could not load. Please refresh and try again.',
      data: 'data.en.js', app: 'app.en.js'
    }
  };
  function readPreference() {
    try { return localStorage.getItem('roxie-language'); } catch (_) { return null; }
  }
  const requested = new URL(window.location.href).searchParams.get('lang');
  const lang = ['zh', 'en'].includes(requested) ? requested : (readPreference() === 'en' ? 'en' : 'zh');
  const text = copy[lang];
  window.ROXIE_LANGUAGE = lang;
  document.documentElement.lang = text.htmlLang;
  document.documentElement.dataset.language = lang;
  try { localStorage.setItem('roxie-language', lang); } catch (_) {}
  document.querySelector('.skip').textContent = text.skip;
  document.querySelector('.brand').setAttribute('aria-label', text.home);
  const primaryNav = document.querySelector('.site-header > nav');
  primaryNav.setAttribute('aria-label', text.nav);
  document.querySelector('.work-link').textContent = text.explore;
  primaryNav.querySelector('a[href="#/about"]').textContent = text.about;
  document.querySelector('.hello-link').textContent = text.hello;
  document.querySelector('footer > a').textContent = text.contact;
  document.querySelector('#lightbox').setAttribute('aria-label', text.lightbox);
  const closeButton = document.querySelector('.lightbox-close');
  closeButton.textContent = text.close;
  closeButton.setAttribute('aria-label', text.closeLabel);
  document.querySelector('meta[name="description"]').setAttribute('content', text.description);
  const languages = document.querySelector('.language-switch');
  languages.setAttribute('aria-label', text.language);
  languages.querySelectorAll('[data-language]').forEach(button => {
    const selected = button.dataset.language === lang;
    button.setAttribute('aria-pressed', String(selected));
    button.addEventListener('click', () => {
      if (button.dataset.language === lang) return;
      const next = button.dataset.language;
      try { localStorage.setItem('roxie-language', next); } catch (_) {}
      const target = new URL(window.location.href);
      target.searchParams.set('lang', next);
      window.location.assign(target.href);
    });
  });
  const main = document.querySelector('main');
  main.setAttribute('aria-busy', 'true');
  const loading = document.createElement('p');
  loading.className = 'locale-loading'; loading.textContent = text.loading;
  main.appendChild(loading);
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src; script.onload = resolve; script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  loadScript(text.data).then(() => loadScript(text.app)).then(() => {
    main.removeAttribute('aria-busy');
  }).catch(() => {
    main.removeAttribute('aria-busy');
    main.textContent = text.error;
  });
})();
