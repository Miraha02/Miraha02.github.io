/**
 * @file    description.mjs
 * @brief   Parser of the project text format used in src/content/projets/<slug>/<lang>.md.
 * @details A description is a sequence of tagged blocks, each followed by its text in braces:
 *
 *              [TAGLINE] {One line shown under the project title}
 *
 *              [SECTION] {Section title}
 *              [PARAGRAPH] {Text, possibly on several lines}
 *              [PARAGRAPH] {}
 *
 *          - A block with nothing between its braces is ignored.
 *          - A paragraph placed before any section, or after a section with an empty title,
 *            is shown without a heading.
 *          - Text ends at the first `}`; write `\}` for a literal brace and `\\` for a backslash.
 *          - Inside a paragraph, a blank line starts a new paragraph; single line breaks are kept
 *            as spaces.
 *          - Anything else than tags, braces and whitespace is an error with its line number,
 *            so that a typo never disappears silently.
 *          Plain JavaScript with JSDoc so that Node scripts can use it without a build step.
 */

/** Tags accepted by the parser, with their maximum number of occurrences. */
export const TAGS = { TAGLINE: 1, SECTION: Infinity, PARAGRAPH: Infinity };

/** Empty template written by the project generator. */
export const DESCRIPTION_TEMPLATE = `[TAGLINE] {}

[SECTION] {}
[PARAGRAPH] {}
[PARAGRAPH] {}

[SECTION] {}
[PARAGRAPH] {}
[PARAGRAPH] {}
`;

/**
 * @typedef  {{ title: string; paragraphs: string[] }} Section
 * @typedef  {{ tagline: string; sections: Section[]; errors: string[] }} Description
 */

/**
 * @brief  Returns the 1-based line number of an offset in a text.
 * @param  {string} text   Source text.
 * @param  {number} offset Character offset.
 * @return {number}
 */
function lineAt(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i++) if (text[i] === '\n') line++;
  return line;
}

/**
 * @brief  Normalises the text of a block: unescapes braces, trims, joins single line breaks.
 * @param  {string} raw Raw text between the braces.
 * @return {string[]} Paragraphs (empty array when the block is empty).
 */
function toParagraphs(raw) {
  return raw
    .replace(/\r\n?/g, '\n')
    .split(/\n[ \t]*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * @brief  Reads the text between braces starting at `start` (the `{` position).
 * @param  {string} text  Source text.
 * @param  {number} start Offset of the opening brace.
 * @return {{ value: string; end: number } | null} Unescaped text and offset after `}`; null if unclosed.
 */
function readBraces(text, start) {
  let value = '';
  for (let i = start + 1; i < text.length; i++) {
    const c = text[i];
    if (c === '\\' && (text[i + 1] === '}' || text[i + 1] === '\\')) {
      value += text[i + 1];
      i++;
    } else if (c === '}') {
      return { value, end: i + 1 };
    } else {
      value += c;
    }
  }
  return null;
}

/**
 * @brief  Parses a description written in the tagged-block format.
 * @param  {string} text Content of fr.md or en.md.
 * @return {Description} Tagline, non-empty sections, and one message per syntax error.
 */
export function parseDescription(text) {
  /** @type {Description} */
  const out = { tagline: '', sections: [], errors: [] };
  /** @type {Record<string, number>} */
  const counts = {};
  /** @type {Section | null} */
  let current = null;
  let i = 0;

  while (i < text.length) {
    const c = text[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const line = lineAt(text, i);
    const tag = /^\[\s*([^\]\n]*?)\s*\]/.exec(text.slice(i));
    if (!tag) {
      const snippet = text.slice(i, i + 30).split('\n')[0];
      out.errors.push(`ligne ${line} : texte hors d'une balise (« ${snippet} »)`);
      const next = text.indexOf('[', i + 1);
      i = next === -1 ? text.length : next;
      continue;
    }
    const name = tag[1].toUpperCase();
    i += tag[0].length;
    while (i < text.length && /[ \t]/.test(text[i])) i++;
    if (!(name in TAGS)) {
      out.errors.push(`ligne ${line} : balise inconnue [${tag[1]}] (attendu : ${Object.keys(TAGS).map((t) => `[${t}]`).join(', ')})`);
    }
    if (text[i] !== '{') {
      out.errors.push(`ligne ${line} : { attendue après [${tag[1]}]`);
      const next = text.indexOf('[', i);
      i = next === -1 ? text.length : next;
      continue;
    }
    const block = readBraces(text, i);
    if (!block) {
      out.errors.push(`ligne ${line} : } manquante pour [${tag[1]}]`);
      break;
    }
    i = block.end;
    if (!(name in TAGS)) continue;

    counts[name] = (counts[name] ?? 0) + 1;
    if (counts[name] > TAGS[name]) {
      out.errors.push(`ligne ${line} : [${name}] ne peut apparaître que ${TAGS[name]} fois`);
      continue;
    }
    const paragraphs = toParagraphs(block.value);
    if (name === 'TAGLINE') {
      out.tagline = paragraphs.join(' ');
    } else if (name === 'SECTION') {
      current = { title: paragraphs.join(' '), paragraphs: [] };
      out.sections.push(current);
    } else if (paragraphs.length) {
      if (!current) {
        current = { title: '', paragraphs: [] };
        out.sections.push(current);
      }
      current.paragraphs.push(...paragraphs);
    }
  }

  out.sections = out.sections.filter((s) => s.paragraphs.length > 0 || s.title !== '');
  return out;
}

/**
 * @brief  Tells whether a parsed description contains no text at all.
 * @param  {Description} description Result of parseDescription().
 * @return {boolean}
 */
export function isEmptyDescription(description) {
  return description.tagline === '' && description.sections.every((s) => s.paragraphs.length === 0);
}

/**
 * @brief  Short plain-text summary for meta tags: tagline, else the first paragraph.
 * @param  {Description} description Result of parseDescription().
 * @param  {number} [max] Maximum length.
 * @return {string} Empty string when there is no text.
 */
export function summarize(description, max = 155) {
  const first = description.tagline || description.sections.flatMap((s) => s.paragraphs)[0] || '';
  return first.length > max ? `${first.slice(0, max - 1).trimEnd()}…` : first;
}
