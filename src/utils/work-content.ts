import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { IS_BOLD, IS_CODE, IS_ITALIC, IS_STRIKETHROUGH, IS_UNDERLINE } from "lexical";

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

type WorkFootnote = {
  label: string;
  value: string;
};

type SerializedLexicalNodeLike = {
  type: string;
  version: number;
  [key: string]: unknown;
};

type SerializedTextNodeLike = SerializedLexicalNodeLike & {
  type: "text";
  text: string;
  format: number;
  style: string;
  mode: "normal";
  detail: number;
};

type SerializedLineBreakNodeLike = SerializedLexicalNodeLike & {
  type: "linebreak";
};

type SerializedElementNodeLike = SerializedLexicalNodeLike & {
  children: SerializedLexicalNodeLike[];
  direction: "ltr" | "rtl" | null;
  format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
  indent: number;
};

const textFromNode = (node: LexicalNode): string => {
  if (node.type === "linebreak") return "\n";
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(textFromNode).join("");
};

const normalizeLineEndings = (value: string) => value.replace(/\r\n?/g, "\n");

const trimBlankEdges = (value: string) => value.replace(/^\s*\n+|\n+\s*$/g, "").trim();

const parseFootnoteLine = (line: string): WorkFootnote | null => {
  const boldLabelMatch = line.match(/^\s*\*\*(.+?)\*\*\s*:?\s*(.+?)\s*$/i);
  if (boldLabelMatch) {
    return {
      label: boldLabelMatch[1].trim(),
      value: boldLabelMatch[2].trim(),
    };
  }

  const labelMatch = line.match(
    /^\s*(sumber|penerjemah|translator|disadur|saduran|adaptasi|penyadur|alih bahasa)\s*:?\s*(.+?)\s*$/i,
  );

  if (!labelMatch) return null;

  const rawLabel = labelMatch[1].trim();
  return {
    label: rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).toLowerCase(),
    value: labelMatch[2].trim(),
  };
};

const parseFootnotePhrase = (line: string): WorkFootnote | null => {
  const phraseMatch = line.match(
    /^\s*(diterjemahkan|disadur|disad ur|saduran|adaptasi|alih bahasa)\s+(.+?)\s*$/i,
  );

  if (phraseMatch) {
    const rawLabel = phraseMatch[1].replace(/\s+/g, " ").trim();
    return {
      label: rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).toLowerCase(),
      value: phraseMatch[2].trim(),
    };
  }

  const symbolNoteMatch = line.match(/^\s*(\*{1,4})\s*(.+?)\s*$/);
  if (symbolNoteMatch) {
    return {
      label: symbolNoteMatch[1],
      value: symbolNoteMatch[2].trim(),
    };
  }

  return null;
};

const createTextNode = (text: string, format = 0): SerializedTextNodeLike => ({
  type: "text",
  version: 1,
  text,
  format,
  style: "",
  mode: "normal",
  detail: 0,
});

const createLineBreakNode = (): SerializedLineBreakNodeLike => ({
  type: "linebreak",
  version: 1,
});

const createParagraphNode = (
  children: SerializedLexicalNodeLike[],
  format: SerializedElementNodeLike["format"] = "",
): SerializedElementNodeLike & { type: "paragraph"; textFormat: number; textStyle: string } => ({
  type: "paragraph",
  version: 1,
  children,
  direction: "ltr",
  format,
  indent: 0,
  textFormat: 0,
  textStyle: "",
});

const createQuoteNode = (
  children: SerializedLexicalNodeLike[],
): SerializedElementNodeLike & { type: "quote" } => ({
  type: "quote",
  version: 1,
  children,
  direction: "ltr",
  format: "",
  indent: 0,
});

const createLinkNode = (
  url: string,
  children: SerializedLexicalNodeLike[],
): SerializedElementNodeLike & { type: "link"; url: string; rel: string | null; target: string | null; title: string | null } => ({
  type: "link",
  version: 1,
  children,
  direction: null,
  format: "",
  indent: 0,
  url,
  rel: null,
  target: null,
  title: null,
});

const createListItemNode = (
  children: SerializedLexicalNodeLike[],
  value: number,
): SerializedElementNodeLike & { type: "listitem"; checked: undefined; value: number } => ({
  type: "listitem",
  version: 1,
  children,
  direction: null,
  format: "",
  indent: 0,
  checked: undefined,
  value,
});

const createListNode = (
  children: SerializedLexicalNodeLike[],
  listType: "number" | "bullet",
  start = 1,
): SerializedElementNodeLike & { type: "list"; listType: "number" | "bullet"; start: number; tag: "ol" | "ul" } => ({
  type: "list",
  version: 1,
  children,
  direction: null,
  format: "",
  indent: 0,
  listType,
  start,
  tag: listType === "number" ? "ol" : "ul",
});

const createHorizontalRuleNode = (): SerializedLexicalNodeLike => ({
  type: "horizontalrule",
  version: 1,
});

const normalizeAlignment = (value?: string): SerializedElementNodeLike["format"] => {
  switch ((value || "").toLowerCase()) {
    case "center":
      return "center";
    case "right":
      return "right";
    case "justify":
      return "justify";
    default:
      return "";
  }
};

const formatMap: Record<string, number> = {
  strong: IS_BOLD,
  b: IS_BOLD,
  em: IS_ITALIC,
  i: IS_ITALIC,
  u: IS_UNDERLINE,
  s: IS_STRIKETHROUGH,
  del: IS_STRIKETHROUGH,
  code: IS_CODE,
};

const mergeAdjacentTextNodes = (nodes: SerializedLexicalNodeLike[]) => {
  const merged: SerializedLexicalNodeLike[] = [];

  for (const node of nodes) {
    const previous = merged[merged.length - 1];
    if (
      previous?.type === "text" &&
      node.type === "text" &&
      previous.format === node.format &&
      previous.style === node.style
    ) {
      previous.text = `${String(previous.text)}${String(node.text)}`;
      continue;
    }

    merged.push(node);
  }

  return merged;
};

const parseInlineNodes = (input: string, inheritedFormat = 0): SerializedLexicalNodeLike[] => {
  const nodes: SerializedLexicalNodeLike[] = [];
  let text = input;

  while (text.length > 0) {
    const linkMatch = text.match(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    const htmlFormatMatch = text.match(/<(strong|b|em|i|u|s|del|code)>([\s\S]*?)<\/\1>/i);
    const markdownBoldMatch = text.match(/\*\*([^*]+)\*\*/);
    const markdownItalicMatch = text.match(/(^|\W)_([^_]+)_(?=\W|$)/);

    const matches = [linkMatch, htmlFormatMatch, markdownBoldMatch, markdownItalicMatch]
      .filter(Boolean)
      .map((match) => ({ match: match!, index: match!.index ?? 0 }))
      .sort((a, b) => a.index - b.index);

    const next = matches[0];
    if (!next) {
      nodes.push(createTextNode(text, inheritedFormat));
      break;
    }

    if (next.index > 0) {
      nodes.push(createTextNode(text.slice(0, next.index), inheritedFormat));
    }

    const [full] = next.match;

    if (next.match === linkMatch) {
      const [, url, inner] = linkMatch!;
      nodes.push(createLinkNode(url, parseInlineNodes(inner, inheritedFormat)));
    } else if (next.match === htmlFormatMatch) {
      const [, tag, inner] = htmlFormatMatch!;
      nodes.push(...parseInlineNodes(inner, inheritedFormat | formatMap[tag.toLowerCase()]));
    } else if (next.match === markdownBoldMatch) {
      const [, inner] = markdownBoldMatch!;
      nodes.push(...parseInlineNodes(inner, inheritedFormat | IS_BOLD));
    } else if (next.match === markdownItalicMatch) {
      const prefix = markdownItalicMatch![1] || "";
      if (prefix) {
        nodes.push(createTextNode(prefix, inheritedFormat));
      }
      const inner = markdownItalicMatch![2];
      nodes.push(...parseInlineNodes(inner, inheritedFormat | IS_ITALIC));
    }

    text = text.slice(next.index + full.length);
  }

  return mergeAdjacentTextNodes(nodes).filter((node) => !(node.type === "text" && !node.text));
};

const lineToChildren = (line: string) => parseInlineNodes(line);

const blockTextToChildren = (text: string) => {
  const lines = normalizeLineEndings(text).split("\n");
  const children: SerializedLexicalNodeLike[] = [];

  lines.forEach((line, index) => {
    children.push(...lineToChildren(line));
    if (index < lines.length - 1) {
      children.push(createLineBreakNode());
    }
  });

  return children.length > 0 ? children : [createTextNode("")];
};

const parseLegacyBodyToLexical = (input: string): SerializedEditorState => {
  const normalized = normalizeLineEndings(input).trim();
  const lines = normalized ? normalized.split("\n") : [];
  const children: SerializedLexicalNodeLike[] = [];
  let index = 0;

  const pushParagraph = (text: string, format: SerializedElementNodeLike["format"] = "") => {
    const trimmed = text.replace(/^\n+|\n+$/g, "");
    if (!trimmed) return;
    children.push(createParagraphNode(blockTextToChildren(trimmed), format));
  };

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      index += 1;
      continue;
    }

    const hrMatch = line.match(/^<hr\b/i);
    if (hrMatch) {
      children.push(createHorizontalRuleNode());
      index += 1;
      continue;
    }

    const fencedPreSameLine = line.match(/^<pre(?:\s+align="(center|right|justify|left)")?>([\s\S]*?)<\/pre>$/i);
    if (fencedPreSameLine) {
      pushParagraph(fencedPreSameLine[2], normalizeAlignment(fencedPreSameLine[1]));
      index += 1;
      continue;
    }

    const fencedDivSameLine = line.match(/^<div(?:\s+align="(center|right|justify|left)")?>([\s\S]*?)<\/div>$/i);
    if (fencedDivSameLine) {
      pushParagraph(fencedDivSameLine[2], normalizeAlignment(fencedDivSameLine[1]));
      index += 1;
      continue;
    }

    const preOpen = line.match(/^<pre(?:\s+align="(center|right|justify|left)")?>$/i);
    if (preOpen) {
      const align = normalizeAlignment(preOpen[1]);
      const blockLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().match(/^<\/pre>$/i)) {
        blockLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      pushParagraph(blockLines.join("\n"), align);
      continue;
    }

    const divOpen = line.match(/^<div(?:\s+align="(center|right|justify|left)")?>$/i);
    if (divOpen) {
      const align = normalizeAlignment(divOpen[1]);
      const blockLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().match(/^<\/div>$/i)) {
        blockLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      pushParagraph(blockLines.join("\n"), align);
      continue;
    }

    const orderedItem = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (orderedItem) {
      const items: Array<{ value: number; text: string }> = [];
      while (index < lines.length) {
        const itemMatch = lines[index].trim().match(/^\s*(\d+)\.\s+(.+)$/);
        if (!itemMatch) break;
        items.push({ value: Number(itemMatch[1]), text: itemMatch[2] });
        index += 1;
      }
      children.push(
        createListNode(
          items.map((item) => createListItemNode([createParagraphNode(lineToChildren(item.text))], item.value)),
          "number",
          items[0]?.value || 1,
        ),
      );
      continue;
    }

    const bulletItem = line.match(/^\s*[-*]\s+(.+)$/);
    if (bulletItem && !line.startsWith("**")) {
      const items: string[] = [];
      while (index < lines.length) {
        const itemMatch = lines[index].trim().match(/^\s*[-*]\s+(.+)$/);
        if (!itemMatch || lines[index].trim().startsWith("**")) break;
        items.push(itemMatch[1]);
        index += 1;
      }
      children.push(
        createListNode(
          items.map((item, itemIndex) => createListItemNode([createParagraphNode(lineToChildren(item))], itemIndex + 1)),
          "bullet",
        ),
      );
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      children.push(createQuoteNode(blockTextToChildren(quoteLines.join("\n"))));
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (
        !candidate ||
        /^<pre\b/i.test(candidate) ||
        /^<div\b/i.test(candidate) ||
        /^<hr\b/i.test(candidate) ||
        /^\s*(\d+)\.\s+/.test(candidate) ||
        (/^\s*[-*]\s+/.test(candidate) && !candidate.startsWith("**")) ||
        candidate.startsWith(">")
      ) {
        break;
      }

      paragraphLines.push(lines[index]);
      index += 1;
    }

    pushParagraph(paragraphLines.join("\n"));
  }

  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children,
    },
  } as SerializedEditorState;
};

export const richTextToRawText = (state: SerializedEditorState | null | undefined) => {
  const blocks = state?.root?.children ?? [];
  const parts = blocks.map((node) => textFromNode(node).trimEnd());
  return normalizeLineEndings(parts.join("\n\n"));
};

export const createParagraphRichText = (text: string): SerializedEditorState => ({
  root: {
    type: "root",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: normalizeLineEndings(text || "")
      .split(/\n\s*\n/g)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => ({
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            text: paragraph,
          },
        ],
      })),
  },
});

export const createLegacyRichText = (text: string) => parseLegacyBodyToLexical(text);

export const parseLegacyWorkContent = (input: string) => {
  const normalized = normalizeLineEndings(input).replace(/<br\s*\/?>/gi, "\n");

  const lines = normalized.split("\n");
  const collectedFootnotes: WorkFootnote[] = [];
  let cursor = lines.length - 1;

  while (cursor >= 0) {
    const line = lines[cursor].trim();

    if (!line) {
      if (collectedFootnotes.length > 0) {
        cursor -= 1;
        continue;
      }

      break;
    }

    const footnote = parseFootnoteLine(line) ?? parseFootnotePhrase(line);
    if (!footnote) break;

    collectedFootnotes.unshift(footnote);
    cursor -= 1;
  }

  const body = trimBlankEdges(lines.slice(0, cursor + 1).join("\n"));
  const source = collectedFootnotes.find((entry) => entry.label.toLowerCase() === "sumber")?.value ?? "";
  const translator = collectedFootnotes.find((entry) =>
    ["penerjemah", "translator", "alih bahasa"].includes(entry.label.toLowerCase()),
  )?.value ?? "";
  const footnotes = collectedFootnotes.filter(
    (entry) =>
      entry.label.toLowerCase() !== "sumber" &&
      !["penerjemah", "translator", "alih bahasa"].includes(entry.label.toLowerCase()),
  );

  return {
    body,
    source,
    translator,
    footnotes,
    hasLegacyMarkup: /<[^>]+>|\*\*.+?\*\*|^\s*[_*].+[_*]\s*$/m.test(normalized),
  };
};

export const preserveMarkdownLineBreaks = (input: string) =>
  input
    .split("\n")
    .map((line) => (line ? `${line}  ` : ""))
    .join("\n");
