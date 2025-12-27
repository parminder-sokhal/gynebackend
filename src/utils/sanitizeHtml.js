import sanitizeHtml from "sanitize-html";

export const sanitizeContent = (dirtyHtml) => {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "p", "br", "b", "i", "strong", "em",
      "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "blockquote", "pre", "code",
      "a", "img", "span"
    ],

    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
      span: ["style"]
    },

    allowedSchemes: ["http", "https", "data"],

    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank"
      })
    }
  });
};
