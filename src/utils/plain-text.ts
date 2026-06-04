type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

type SerializedEditorState = {
  root?: {
    children?: LexicalNode[];
  };
};

const textFromNode = (node: LexicalNode): string => {
  if (node.type === "linebreak") return "\n";
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(textFromNode).join("");
};

export const plainTextFromRichText = (state: SerializedEditorState | null | undefined) => {
  const blocks = state?.root?.children ?? [];
  const parts = blocks
    .map((node) => textFromNode(node).trim())
    .filter(Boolean);

  return parts.join("\n\n").trim();
};
