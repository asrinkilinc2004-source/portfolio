import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

/**
 * Toont een kleine popup wanneer de gebruiker op een niet-klikbaar element klikt.
 * Klikbare elementen (cursor: pointer, buttons, links, inputs, etc.) worden genegeerd.
 */

const INTERACTIVE_TAGS = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL', 'SUMMARY', 'DETAILS']);
const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'tab', 'menuitem', 'checkbox', 'radio',
  'switch', 'option', 'combobox', 'listbox', 'menu', 'menubar',
  'menuitemcheckbox', 'menuitemradio', 'treeitem', 'spinbutton',
]);

function isClickable(element) {
  let el = element;
  // Loop omhoog door de DOM-boom (max 10 niveaus)
  for (let i = 0; i < 10 && el && el !== document.body; i++) {
    const tag = el.tagName;
    if (INTERACTIVE_TAGS.has(tag)) return true;

    const role = el.getAttribute('role');
    if (role && INTERACTIVE_ROLES.has(role)) return true;

    const tabIndex = el.getAttribute('tabindex');
    if (tabIndex !== null && tabIndex !== '-1') return true;

    const cursor = window.getComputedStyle(el).cursor;
    if (cursor === 'pointer') return true;

    el = el.parentElement;
  }
  return false;
}

export default function NonClickablePopup() {
  const { t } = useLanguage();
  const [popup, setPopup] = useState(null); // { x, y, id }
  const timerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (isClickable(e.target)) return;

      // Ververs de popup (ook als er al een zichtbaar is)
      clearTimeout(timerRef.current);

      const id = Date.now();
      setPopup({ x: e.clientX, y: e.clientY, id });

      timerRef.current = setTimeout(() => {
        setPopup(null);
      }, 1800);
    }

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!popup) return null;

  return (
    <div
      key={popup.id}
      style={{
        position: 'fixed',
        left: popup.x,
        top: popup.y,
        transform: 'translate(-50%, -140%)',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
      className="animate-non-clickable-popup"
    >
      <div
        style={{
          background: 'rgba(30, 30, 30, 0.88)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 500,
          padding: '5px 10px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          letterSpacing: '0.01em',
          userSelect: 'none',
        }}
      >
        {t.notClickable}
      </div>
    </div>
  );
}
