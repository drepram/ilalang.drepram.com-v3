import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText as RichTextWithoutBlocks,
} from "@payloadcms/richtext-lexical/react";

type NodeTypes = DefaultNodeTypes;

const alignmentClass = (format?: string) => {
  switch ((format || "").toLowerCase()) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "text-left";
  }
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    });

    return (
      <p className={`my-0 whitespace-pre-wrap leading-[1.9] ${alignmentClass(node.format)}`}>
        {children?.length ? children : <br />}
      </p>
    );
  },
});

type Props = {
  data: SerializedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  return <RichTextWithoutBlocks converters={jsxConverters} {...props} />;
}
