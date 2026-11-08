// Text direction support (RTL / LTR / Auto) for the editor and the preview.
//
//   auto : every block of the preview picks its own direction from its first
//          strong letter (so a Persian paragraph is RTL and an English one
//          is LTR, in the same document). This is the default.
//   rtl  : the whole preview is right-to-left.
//   ltr  : the original behaviour.
//
// Code blocks are always kept LTR (see style.css).
//
// Why the direction is detected here instead of using the browser's dir="auto":
// dir="auto" ignores descendants that carry their own dir attribute, so a <ul>
// whose <li> items all have dir="auto" would see no text and fall back to LTR.

export const DIRECTION_MODES = ['auto', 'rtl', 'ltr'];

// List items and table cells are left out on purpose: they follow the list or
// table they belong to, so a bullet never ends up on the opposite side of its
// siblings. Nested lists follow their parent list for the same reason.
const AUTO_DIR_BLOCKS = 'p, h1, h2, h3, h4, h5, h6, ul, ol, dl, blockquote, table, summary';
const NESTED_LIST_PARENT = 'li, dd';
const AUTO_MARK = 'data-auto-dir';

// Inline code, keyboard keys and code blocks do not decide the direction of
// the sentence around them.
const IGNORED_FOR_DETECTION = 'code, kbd, tt, pre, script, style';

const ANY_LETTER = /\p{L}/u;
const RTL_LETTER = /[֐-ࣿיִ-﷿ﹰ-﻿]/;

export const normalizeDirectionMode = (value) => {
    return DIRECTION_MODES.includes(value) ? value : 'auto';
};

export const nextDirectionMode = (mode) => {
    const index = DIRECTION_MODES.indexOf(normalizeDirectionMode(mode));
    return DIRECTION_MODES[(index + 1) % DIRECTION_MODES.length];
};

export const directionLabel = (mode) => {
    return 'Direction: ' + (mode === 'auto' ? 'Auto' : mode.toUpperCase());
};

// 'rtl' | 'ltr' from the first strong letter of the element, or null when it
// has no letters at all (numbers, emoji, ...). Null means "inherit".
export const detectDirection = (element) => {
    const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (parent && parent.closest(IGNORED_FOR_DETECTION)) {
            continue;
        }
        for (const character of node.data) {
            if (ANY_LETTER.test(character)) {
                return RTL_LETTER.test(character) ? 'rtl' : 'ltr';
            }
        }
    }
    return null;
};

// Apply the mode to the rendered preview. Call it after every render, and
// again when the mode changes (it is idempotent).
export const applyPreviewDirection = (root, mode) => {
    mode = normalizeDirectionMode(mode);
    root.setAttribute('data-dir-mode', mode);

    // drop what a previous "auto" pass added (never touch a dir the author wrote)
    root.querySelectorAll('[' + AUTO_MARK + ']').forEach((element) => {
        element.removeAttribute('dir');
        element.removeAttribute(AUTO_MARK);
    });

    if (mode !== 'auto') {
        root.setAttribute('dir', mode);
        return;
    }

    root.setAttribute('dir', 'ltr');
    root.querySelectorAll(AUTO_DIR_BLOCKS).forEach((element) => {
        if (element.hasAttribute('dir') || element.closest('pre')) {
            return;
        }
        const isList = element.matches('ul, ol, dl');
        if (isList && element.parentElement && element.parentElement.closest(NESTED_LIST_PARENT)) {
            return;
        }
        const direction = detectDirection(element);
        if (direction) {
            element.setAttribute('dir', direction);
            element.setAttribute(AUTO_MARK, '');
        }
    });
};

// The editor is styled from CSS through this attribute (see style.css).
export const applyEditorDirection = (container, mode) => {
    container.setAttribute('data-dir-mode', normalizeDirectionMode(mode));
};
