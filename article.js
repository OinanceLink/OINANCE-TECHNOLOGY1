/* =========================
   OINANCE LINK
   FULL ARTICLE READER
   RICH TEXT + MULTI-IMAGE
========================= */


/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const SHARE_FUNCTION_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co/functions/v1/article-share";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================
   PAGE START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadArticle();

  }
);


/* =========================
   LOAD ARTICLE
========================= */

async function loadArticle() {

  const container =
    document.getElementById(
      "articleContainer"
    );


  if (!container) {
    return;
  }


  const params =
    new URLSearchParams(
      window.location.search
    );


  const articleId =
    params.get("id");


  if (!articleId) {

    showError(
      container,
      "No article was selected."
    );

    return;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("news")
        .select(
          "id, title, category, author, story, image_url, image_urls, created_at"
        )
        .eq(
          "id",
          articleId
        )
        .eq(
          "published",
          true
        )
        .single();


    if (error || !data) {

      console.error(
        "Article loading error:",
        error
      );


      showError(
        container,
        "This article may have been removed or is no longer available."
      );


      return;

    }


    /* =========================
       DATE
    ========================= */

    const date =
      new Date(
        data.created_at
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );


    /* =========================
       GET ALL IMAGES
    ========================= */

    let images = [];


    if (
      Array.isArray(
        data.image_urls
      )
    ) {

      images =
        data.image_urls.filter(
          function (url) {

            return (
              typeof url === "string" &&
              url.trim() !== ""
            );

          }
        );

    }


    /* =========================
       OLD IMAGE SUPPORT
    ========================= */

    if (
      images.length === 0 &&
      data.image_url
    ) {

      images = [
        data.image_url
      ];

    }


    /* =========================
       MAIN IMAGE
    ========================= */

    let mainImage = "";


    if (images.length > 0) {

      mainImage = `

        <img
          src="${escapeHTML(images[0])}"
          alt="${escapeHTML(data.title)}"
          class="article-image"
        >

      `;

    }


    /* =========================
       ARTICLE STORY
    ========================= */

    const storyHTML =
      createArticleStory(
        data.story,
        images,
        data.title
      );


    /* =========================
       DISPLAY ARTICLE
    ========================= */

    container.innerHTML = `

      <div class="article-header">

        <span class="article-category">

          ${escapeHTML(
            data.category ||
            "OINANCE NEWS"
          )}

        </span>


        <h1>

          ${escapeHTML(
            data.title
          )}

        </h1>


        <div class="article-meta">

          <span>

            By ${escapeHTML(
              data.author ||
              "OINANCE Editorial"
            )}

          </span>


          <span>

            ${date}

          </span>

        </div>

      </div>


      ${mainImage}


      <div class="article-story">

        ${storyHTML}

      </div>


      <div class="article-share">

        <button
          type="button"
          class="x-share-button"
          id="xShareButton"
        >

          𝕏 Share on X

        </button>

      </div>


      <div class="article-back">

        <a href="index.html#news">

          ← Back to OINANCE News

        </a>

      </div>

    `;


    /* =========================
       RICH ARTICLE STYLES
    ========================= */

    addArticleRichTextStyles();


    /* =========================
       X SHARE
    ========================= */

    const shareButton =
      document.getElementById(
        "xShareButton"
      );


    if (shareButton) {

      shareButton.addEventListener(
        "click",
        function () {

          const previewUrl =
            SHARE_FUNCTION_URL +
            "?id=" +
            encodeURIComponent(
              data.id
            );


          const shareText =
            data.title +
            " — OINANCE LINK";


          const xUrl =
            "https://twitter.com/intent/tweet" +
            "?text=" +
            encodeURIComponent(
              shareText
            ) +
            "&url=" +
            encodeURIComponent(
              previewUrl
            );


          window.open(
            xUrl,
            "_blank",
            "noopener,noreferrer"
          );

        }
      );

    }


  } catch (error) {

    console.error(
      "Unexpected article error:",
      error
    );


    showError(
      container,
      "Something went wrong while loading this article."
    );

  }

}


/* =========================
   CREATE ARTICLE STORY
========================= */

function createArticleStory(
  story,
  images,
  title
) {

  if (
    !story ||
    typeof story !== "string"
  ) {

    return "";

  }


  /*
     If the story contains HTML
     from the rich text editor,
     keep the formatting.
  */

  if (
    /<[a-z][\s\S]*>/i.test(
      story
    )
  ) {

    return buildRichArticleStory(
      story,
      images,
      title
    );

  }


  /*
     Older plain-text articles
     are still supported.
  */

  const paragraphs =
    story
      .split(/\n+/)
      .filter(
        function (text) {
          return text.trim() !== "";
        }
      );


  let storyHTML = "";


  paragraphs.forEach(
    function (
      paragraph,
      index
    ) {

      storyHTML += `

        <p>

          ${escapeHTML(
            paragraph
          )}

        </p>

      `;


      /* Picture 2 */

      if (
        index === 0 &&
        images.length >= 2
      ) {

        storyHTML += createSecondaryImage(
          images[1],
          title
        );

      }


      /* Picture 3 */

      if (
        index === 1 &&
        images.length >= 3
      ) {

        storyHTML += createSecondaryImage(
          images[2],
          title
        );

      }

    }
  );


  return storyHTML;

}


/* =========================
   RICH ARTICLE STORY
========================= */

function buildRichArticleStory(
  story,
  images,
  title
) {

  const cleanHTML =
    sanitizeArticleHTML(
      story
    );


  /*
     Parse the formatted article
     so we can insert additional
     article pictures between
     sections.
  */

  const temporary =
    document.createElement(
      "div"
    );


  temporary.innerHTML =
    cleanHTML;


  const children =
    Array.from(
      temporary.childNodes
    );


  let output = "";


  let blockCount = 0;


  children.forEach(
    function (node) {

      /*
         Text nodes
      */

      if (
        node.nodeType ===
        Node.TEXT_NODE
      ) {

        if (
          node.textContent.trim()
        ) {

          output += `

            <p>

              ${escapeHTML(
                node.textContent
              )}

            </p>

          `;

          blockCount++;

        }

        return;

      }


      /*
         HTML elements
      */

      if (
        node.nodeType ===
        Node.ELEMENT_NODE
      ) {

        output +=
          node.outerHTML;


        /*
           Insert second picture
           after the first main
           content block.
        */

        if (
          blockCount === 0 &&
          images.length >= 2 &&
          isArticleBlock(node)
        ) {

          output += createSecondaryImage(
            images[1],
            title
          );

          blockCount++;

          return;

        }


        /*
           Insert third picture
           after the second content
           block.
        */

        if (
          blockCount === 1 &&
          images.length >= 3 &&
          isArticleBlock(node)
        ) {

          output += createSecondaryImage(
            images[2],
            title
          );

          blockCount++;

          return;

        }


        if (
          isArticleBlock(node)
        ) {

          blockCount++;

        }

      }

    }
  );


  return output;

}


/* =========================
   ARTICLE BLOCK CHECK
========================= */

function isArticleBlock(
  element
) {

  const tag =
    element.tagName.toLowerCase();


  return [
    "p",
    "div",
    "h2",
    "h3",
    "blockquote",
    "ul",
    "ol"
  ].includes(tag);

}


/* =========================
   SECONDARY IMAGE
========================= */

function createSecondaryImage(
  imageURL,
  title
) {

  return `

    <img
      src="${escapeHTML(imageURL)}"
      alt="${escapeHTML(title)}"
      class="article-image article-secondary-image"
    >

  `;

}


/* =========================
   SANITIZE RICH TEXT
========================= */

function sanitizeArticleHTML(
  html
) {

  const parser =
    new DOMParser();


  const documentFragment =
    parser.parseFromString(
      html,
      "text/html"
    );


  const allowedTags = [
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "S",
    "STRIKE",
    "FONT",
    "SPAN",
    "P",
    "DIV",
    "BR",
    "H2",
    "H3",
    "BLOCKQUOTE",
    "UL",
    "OL",
    "LI",
    "A"
  ];


  const elements =
    Array.from(
      documentFragment.body.querySelectorAll("*")
    );


  elements.forEach(
    function (element) {

      const tag =
        element.tagName.toUpperCase();


      /*
         Remove dangerous elements.
      */

      if (
        !allowedTags.includes(tag)
      ) {

        element.replaceWith(
          document.createTextNode(
            element.textContent
          )
        );

        return;

      }


      /*
         Remove dangerous attributes.
      */

      Array.from(
        element.attributes
      ).forEach(
        function (attribute) {

          const name =
            attribute.name.toLowerCase();


          if (
            name.startsWith("on") ||
            name === "srcdoc"
          ) {

            element.removeAttribute(
              attribute.name
            );

          }

        }
      );


      /*
         Links
      */

      if (
        tag === "A"
      ) {

        const href =
          element.getAttribute(
            "href"
          );


        if (
          !href ||
          !isSafeURL(href)
        ) {

          element.removeAttribute(
            "href"
          );

        } else {

          element.setAttribute(
            "target",
            "_blank"
          );

          element.setAttribute(
            "rel",
            "noopener noreferrer"
          );

        }

      }


      /*
         FONT color and size
         are created by the
         dashboard editor.
      */

      if (
        tag === "FONT"
      ) {

        const color =
          element.getAttribute(
            "color"
          );


        const size =
          element.getAttribute(
            "size"
          );


        if (color) {

          if (
            isSafeColor(color)
          ) {

            element.setAttribute(
              "color",
              color
            );

          } else {

            element.removeAttribute(
              "color"
            );

          }

        }


        if (size) {

          if (
            /^[1-7]$/.test(size)
          ) {

            element.setAttribute(
              "size",
              size
            );

          } else {

            element.removeAttribute(
              "size"
            );

          }

        }

      }


      /*
         Allow only safe inline styles.
         This supports alignment,
         text color and font size.
      */

      if (
        element.hasAttribute(
          "style"
        )
      ) {

        const style =
          element.getAttribute(
            "style"
          );


        const safeStyle =
          cleanInlineStyle(
            style
          );


        if (
          safeStyle
        ) {

          element.setAttribute(
            "style",
            safeStyle
          );

        } else {

          element.removeAttribute(
            "style"
          );

        }

      }

    }
  );


  return documentFragment.body.innerHTML;

}


/* =========================
   SAFE URL
========================= */

function isSafeURL(
  url
) {

  const value =
    url.trim();


  if (
    value.startsWith("/")
  ) {

    return true;

  }


  if (
    value.startsWith("./")
  ) {

    return true;

  }


  if (
    value.startsWith("../")
  ) {

    return true;

  }


  try {

    const parsed =
      new URL(
        value,
        window.location.origin
      );


    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    );

  } catch (error) {

    return false;

  }

}


/* =========================
   SAFE COLOR
========================= */

function isSafeColor(
  color
) {

  return (
    /^#[0-9a-fA-F]{3,8}$/.test(
      color.trim()
    ) ||
    /^rgb(a)?\(/i.test(
      color.trim()
    ) ||
    /^hsl(a)?\(/i.test(
      color.trim()
    ) ||
    /^[a-zA-Z]+$/.test(
      color.trim()
    )
  );

}


/* =========================
   SAFE INLINE STYLE
========================= */

function cleanInlineStyle(
  style
) {

  const allowedProperties = [
    "color",
    "background-color",
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
    "text-align"
  ];


  const output = [];


  style
    .split(";")
    .forEach(
      function (rule) {

        const parts =
          rule.split(":");


        if (
          parts.length < 2
        ) {

          return;

        }


        const property =
          parts.shift()
            .trim()
            .toLowerCase();


        const value =
          parts.join(":")
            .trim();


        if (
          !allowedProperties.includes(
            property
          )
        ) {

          return;

        }


        /*
           Block dangerous CSS.
        */

        if (
          /javascript:|expression|url\s*\(/i.test(
            value
          )
        ) {

          return;

        }


        output.push(
          property +
          ": " +
          value
        );

      }
    );


  return output.join(
    "; "
  );

}


/* =========================
   RICH TEXT STYLES
========================= */

function addArticleRichTextStyles() {

  if (
    document.getElementById(
      "oinanceArticleRichStyles"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "oinanceArticleRichStyles";


  style.textContent = `

    .article-story {
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
    }

    .article-story p {
      margin: 0 0 27px;
      color: #c7c7c7;
      font-size: 20px;
      line-height: 1.9;
    }

    .article-story h2 {
      margin: 42px 0 20px;
      color: #ffffff;
      font-size: 32px;
      line-height: 1.25;
    }

    .article-story h3 {
      margin: 35px 0 17px;
      color: #ffffff;
      font-size: 25px;
      line-height: 1.3;
    }

    .article-story blockquote {
      margin: 32px 0;
      padding: 18px 22px;
      border-left: 3px solid #777777;
      background: #111111;
      color: #dddddd;
      font-size: 20px;
      line-height: 1.7;
    }

    .article-story ul,
    .article-story ol {
      margin: 0 0 28px;
      padding-left: 30px;
      color: #c7c7c7;
      font-size: 20px;
      line-height: 1.8;
    }

    .article-story li {
      margin-bottom: 8px;
    }

    .article-story a {
      color: #4da3ff;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .article-story a:hover {
      color: #8bc4ff;
    }

    .article-story strong,
    .article-story b {
      font-weight: 800;
    }

    .article-story u {
      text-underline-offset: 3px;
    }

    .article-story font[color] {
      color: inherit;
    }

    .article-story font[size="1"] {
      font-size: 13px;
    }

    .article-story font[size="2"] {
      font-size: 16px;
    }

    .article-story font[size="3"] {
      font-size: 20px;
    }

    .article-story font[size="4"] {
      font-size: 24px;
    }

    .article-story font[size="5"] {
      font-size: 29px;
    }

    .article-story font[size="6"] {
      font-size: 34px;
    }

    .article-story font[size="7"] {
      font-size: 40px;
    }

    @media (max-width: 600px) {

      .article-story p {
        margin-bottom: 23px;
        font-size: 18px;
        line-height: 1.85;
      }

      .article-story h2 {
        font-size: 27px;
        margin-top: 34px;
      }

      .article-story h3 {
        font-size: 23px;
        margin-top: 30px;
      }

      .article-story blockquote {
        font-size: 18px;
        line-height: 1.7;
      }

      .article-story ul,
      .article-story ol {
        font-size: 18px;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================
   ERROR
========================= */

function showError(
  container,
  message
) {

  container.innerHTML = `

    <div class="article-error">

      <h1>
        Article not found
      </h1>


      <p>
        ${escapeHTML(message)}
      </p>


      <a href="index.html#news">

        ← Back to OINANCE News

      </a>

    </div>

  `;

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(
  value
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    value ?? "";


  return div.innerHTML;

}
