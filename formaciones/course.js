// Keep the same reading position when switching between course translations.
const languagePositionKey = 'bp_course_language_position';
const courseSections = () => [...document.querySelectorAll('main section')];
document.querySelectorAll('.lang a').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (link.pathname === location.pathname) { event.preventDefault(); return; }
    const sections = courseSections();
    let index = sections.findIndex(section => section.getBoundingClientRect().bottom > 100);
    if (index < 0) index = sections.length - 1;
    const section = sections[index];
    try {
      sessionStorage.setItem(languagePositionKey, JSON.stringify({
        path: link.pathname, index,
        offset: section ? section.getBoundingClientRect().top : 0,
        y: scrollY, time: Date.now()
      }));
    } catch (e) {}
  });
});
window.addEventListener('load', async () => {
  let position;
  try {
    position = JSON.parse(sessionStorage.getItem(languagePositionKey));
    sessionStorage.removeItem(languagePositionKey);
  } catch (e) { return; }
  if (!position || position.path !== location.pathname || Date.now() - position.time > 30000) return;
  await document.fonts.ready;
  const section = courseSections()[position.index];
  window.scrollTo({top: section ? scrollY + section.getBoundingClientRect().top - position.offset : position.y, behavior: 'instant'});
});
