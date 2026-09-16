/* =========================
   OINANCE LINK
   FULL ARTICLE READER
   MULTI-IMAGE NEWS SYSTEM
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


    /*
       New system:
       image_urls = [
         "picture 1",
         "picture 2",
         "picture 3"
       ]
    */

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


    /*
       Backward compatibility.

       If an older article only has
       image_url, use it.
    */

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

    const paragraphs =
      escapeHTML(
        data.story
      )
        .split(/\n+/)
        .filter(Boolean);


    let storyHTML = "";


    /*
       Put the first part of the article
       before the additional pictures.

       This makes the article feel more
       like a real news story.
    */

    paragraphs.forEach(
      function (paragraph, index) {

        storyHTML += `
          <p>
            ${paragraph}
          </p>
        `;


        /*
           Picture 2 appears after
           the first paragraph.
        */

        if (
          index === 0 &&
          images.length >= 2
        ) {

          storyHTML += `

            <img
              src="${escapeHTML(images[1])}"
              alt="${escapeHTML(data.title)}"
              class="article-image article-secondary-image"
            >

          `;

        }


        /*
           Picture 3 appears after
           the second paragraph.
        */

        if (
          index === 1 &&
          images.length >= 3
        ) {

          storyHTML += `

            <img
              src="${escapeHTML(images[2])}"
              alt="${escapeHTML(data.title)}"
              class="article-image article-secondary-image"
            >

          `;

        }

      }
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
   SECURITY
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
