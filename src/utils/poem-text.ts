type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
  tag?: string;
};

type SerializedEditorState = {
  root?: {
    children?: LexicalNode[];
  };
};

const textFromNode = (node: LexicalNode): string => {
  if (typeof node.text === "string") return node.text;
  if (!node.children?.length) return "";

  const childText = node.children.map(textFromNode).join("");

  if (node.type === "linebreak") return "\n";
  return childText;
};

export const poemTextFromRichText = (state: SerializedEditorState | null | undefined) => {
  const blocks = state?.root?.children ?? [];
  const lines: string[] = [];

  blocks.forEach((node) => {
    const text = textFromNode(node).trimEnd();
    const isBlank = text.trim().length === 0;

    if (isBlank) {
      if (lines.length > 0 && lines[lines.length - 1] !== "") {
        lines.push("");
      }
      return;
    }

    lines.push(text);
  });

  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.join("\n");
};
