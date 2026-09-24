/**
 * <head>'de, boyamadan önce çalışan küçük betik (K-064): hareket izni varsa `js-anim` ekler;
 * `data-intro` bölgeleri giriş animasyonu kurulana kadar CSS ile gizlenir (içerik bir an görünüp
 * kaybolmasın). JS takılırsa 4 s sonra gizleme kalkar; JS kapalıysa hiç eklenmez.
 */
export const INTRO_SCRIPT = `(function(){var d=document.documentElement;try{if(matchMedia("(prefers-reduced-motion: no-preference)").matches){d.classList.add("js-anim");setTimeout(function(){if(!d.classList.contains("anim-ready"))d.classList.remove("js-anim")},4000)}}catch(e){}})();`;
