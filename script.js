/* ==================================================
   OINANCE LINK
   MAIN WEBSITE JAVASCRIPT
   MULTI-IMAGE NEWS SYSTEM
================================================== */


/* ==================================================
   SUPABASE
================================================== */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* ==================================================
   NEWS STORAGE
================================================== */

let allNewsArticles = [];


/* ==================================================
   PAGE START
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupMobileMenu();

    updateYear();

    setupNewsCategories();

    setupNewsletter();

    loadNews();

    loadFeaturedNews();

  }
);


/* ==================================================
   MOBILE MENU
================================================== */

function setupMobileMenu() {

  const menuButton =
    document.getElementById("menuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");


  if (!menuButton || !mobileMenu) {
    return;
  }


  menuButton.addEventListener(
    "click",
    function () {

      mobileMenu.classList.toggle("open");


      if (
        mobileMenu.classList.contains("open")
      ) {

        menuButton.textContent = "✕";

      } else {

        menuButton.textContent = "☰";

      }

    }
  );


  const mobileLinks =
    mobileMenu.querySelectorAll("a");


  mobileLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          mobileMenu.classList.remove(
            "open"
          );

          menuButton.textContent = "☰";

        }
      );

    }
  );

}


/* ==================================================
   CURRENT YEAR
================================================== */

function updateYear() {

  const footerTexts =
    document.querySelectorAll(
      ".footer-bottom p"
    );


  footerTexts.forEach(
    function (element, index) {

      if (index === 0) {

        element.textContent =
          "© " +
          new Date().getFullYear() +
          " OINANCE LINK. All rights reserved.";

      }

    }
  );

}


/* ==================================================
   LOAD OINANCE NEWS
================================================== */

async function loadNews() {

  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


  if (!newsGrid) {
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
          "published",
          true
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(
        "OINANCE News error:",
        error
      );

      return;

    }


    allNewsArticles =
      data || [];


    if (
      !allNewsArticles.length
    ) {

      showNoArticles();

      return;

    }


    displayNewsByCategory("All");


  } catch (error) {

    console.error(
      "Unexpected OINANCE News error:",
      error
    );

  }

}


/* ==================================================
   GET ARTICLE IMAGES
================================================== */

function getArticleImages(article) {

  let images = [];


  /*
     NEW SYSTEM:
     image_urls contains
     1–3 picture URLs
  */

  if (
    Array.isArray(
      article.image_urls
    )
  ) {

    images =
      article.image_urls.filter(
        function (url) {

          return (
            typeof url === "string" &&
            url.trim() !== ""
          );

        }
      );

  }


  /*
     BACKWARD COMPATIBILITY:
     Old articles only have image_url
  */

  if (
    !images.length &&
    article.image_url
  ) {

    images = [
      article.image_url
    ];

  }


  /*
     Make sure old main image
     is not lost if image_urls
     exists but does not contain it.
  */

  if (
    article.image_url &&
    !images.includes(
      article.image_url
    )
  ) {

    images.unshift(
      article.image_url
    );

  }


  /*
     Maximum 3 pictures
  */

  return images.slice(0, 3);

}


/* ==================================================
   NO ARTICLES
================================================== */

function showNoArticles() {

  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


  if (!newsGrid) {
    return;
  }


  newsGrid.innerHTML = `

    <article class="news-placeholder">

      <div class="placeholder-image"></div>

      <div class="placeholder-content">

        <span>
          OINANCE NEWS
        </span>

        <h3>
          OINANCE News is coming soon.
        </h3>

        <p>
          Articles published through the
          OINANCE Dashboard will appear here.
        </p>

      </div>

    </article>

  `;

}


/* ==================================================
   NEWS CATEGORY FILTER
================================================== */

function setupNewsCategories() {

  const categoryButtons =
    document.querySelectorAll(
      ".category-button"
    );


  if (!categoryButtons.length) {
    return;
  }


  categoryButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const selectedCategory =
            button.getAttribute(
              "data-category"
            );


          categoryButtons.forEach(
            function (btn) {

              btn.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          displayNewsByCategory(
            selectedCategory
          );

        }
      );

    }
  );

}


/* ==================================================
   DISPLAY NEWS BY CATEGORY
================================================== */

function displayNewsByCategory(
  category
) {

  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


  if (!newsGrid) {
    return;
  }


  let filteredArticles;


  if (
    category === "All"
  ) {

    filteredArticles =
      allNewsArticles;

  } else {

    filteredArticles =
      allNewsArticles.filter(
        function (article) {

          return (
            (article.category || "")
              .trim()
              .toLowerCase() ===
            category
              .trim()
              .toLowerCase()
          );

        }
      );

  }


  newsGrid.innerHTML = "";


  if (
    !filteredArticles.length
  ) {

    newsGrid.innerHTML = `

      <article class="news-placeholder">

        <div class="placeholder-image"></div>

        <div class="placeholder-content">

          <span>
            OINANCE NEWS
          </span>

          <h3>
            No articles in this category yet.
          </h3>

          <p>
            Check back soon for new
            OINANCE News.
          </p>

        </div>

      </article>

    `;

    return;

  }


  filteredArticles.forEach(
    function (article) {

      createNewsCard(
        article
      );

    }
  );

}


/* ==================================================
   CREATE NEWS CARD
================================================== */

function createNewsCard(
  article
) {

  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


  if (!newsGrid) {
    return;
  }


  const card =
    document.createElement(
      "article"
    );


  card.className =
    "news-card";


  card.style.cursor =
    "pointer";


  /*
     Open full article
  */

  card.addEventListener(
    "click",
    function () {

      window.location.href =
        "article.html?id=" +
        encodeURIComponent(
          article.id
        );

    }
  );


  /* ==================================================
     ARTICLE IMAGES
  ================================================== */

  const images =
    getArticleImages(
      article
    );


  let imageHTML = "";


  if (images.length === 0) {

    imageHTML = `

      <div class="placeholder-image"></div>

    `;

  } else {

    imageHTML = `

      <div class="news-images">

        ${images
          .map(
            function (imageUrl, index) {

              return `

                <img
                  src="${escapeHTML(
                    imageUrl
                  )}"
                  alt="${escapeHTML(
                    article.title
                  )} - Picture ${
                    index + 1
                  }"
                  class="news-image ${
                    index === 0
                      ? "main-news-image"
                      : "secondary-news-image"
                  }"
                  loading="lazy"
                >

              `;

            }
          )
          .join("")}

      </div>

    `;

  }


  /* ==================================================
     DATE
  ================================================== */

  const date =
    new Date(
      article.created_at
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );


  /* ==================================================
     ARTICLE CARD
  ================================================== */

  card.innerHTML = `

    ${imageHTML}


    <div class="news-content">

      <span class="news-category">

        ${escapeHTML(
          article.category ||
          "OINANCE NEWS"
        )}

      </span>


      <h3>

        ${escapeHTML(
          article.title
        )}

      </h3>


      <p>

        ${escapeHTML(
          article.story
        )}

      </p>


      <div class="news-meta">

        <span>

          ${escapeHTML(
            article.author ||
            "OINANCE Editorial"
          )}

        </span>


        <span>

          ${date}

        </span>

      </div>


      <div class="news-read-more">

        Read Full Article →

      </div>

    </div>

  `;


  newsGrid.appendChild(
    card
  );

}


/* ==================================================
   NEWSLETTER
================================================== */

function setupNewsletter() {

  const newsletterForm =
    document.getElementById(
      "newsletterForm"
    );


  const newsletterEmail =
    document.getElementById(
      "newsletterEmail"
    );


  const newsletterMessage =
    document.getElementById(
      "newsletterMessage"
    );


  if (
    !newsletterForm ||
    !newsletterEmail ||
    !newsletterMessage
  ) {

    return;

  }


  newsletterForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const email =
        newsletterEmail.value
          .trim()
          .toLowerCase();


      if (!email) {

        newsletterMessage.textContent =
          "Please enter your email.";

        return;

      }


      newsletterMessage.textContent =
        "Subscribing...";


      try {

        const {
          error
        } =
          await supabaseClient
            .from(
              "newsletter_subscribers"
            )
            .insert([
              {
                email: email
              }
            ]);


        if (error) {

          console.error(
            "Supabase newsletter error:",
            error
          );

          throw error;

        }


        newsletterMessage.textContent =
          "You're subscribed to OINANCE News.";


        newsletterForm.reset();


      } catch (error) {

        console.error(
          "Newsletter subscription error:",
          error
        );


        if (
          error.code ===
          "23505"
        ) {

          newsletterMessage.textContent =
            "This email is already subscribed.";

        } else {

          newsletterMessage.textContent =
            "Something went wrong. Please try again.";

        }

      }

    }
  );

}


/* ==================================================
   FEATURED OINANCE NEWS
================================================== */

async function loadFeaturedNews() {

  const featuredNews =
    document.getElementById(
      "featuredNews"
    );


  if (!featuredNews) {
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
          "published",
          true
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        )
        .limit(1);


    if (error) {

      console.error(
        "Featured News error:",
        error
      );

      return;

    }


    if (
      !data ||
      data.length === 0
    ) {

      featuredNews.innerHTML = `

        <div class="featured-placeholder">

          <span>
            OINANCE NEWS
          </span>

          <h2>
            Latest OINANCE News
            and market developments.
          </h2>

          <p>
            Articles published through the
            OINANCE LINK newsroom will appear here.
          </p>

        </div>

      `;

      return;

    }


    const article =
      data[0];


    /* ==================================================
       FEATURED IMAGES
    ================================================== */

    const images =
      getArticleImages(
        article
      );


    let imageHTML = "";


    if (images.length) {

      imageHTML = `

        <div class="featured-images">

          ${images
            .map(
              function (
                imageUrl,
                index
              ) {

                return `

                  <img
                    src="${escapeHTML(
                      imageUrl
                    )}"
                    alt="${escapeHTML(
                      article.title
                    )} - Picture ${
                      index + 1
                    }"
                    class="featured-image ${
                      index === 0
                        ? "featured-main-image"
                        : "featured-secondary-image"
                    }"
                    loading="lazy"
                  >

                `;

              }
            )
            .join("")}

        </div>

      `;

    }


    /* ==================================================
       DATE
    ================================================== */

    const date =
      new Date(
        article.created_at
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );


    /* ==================================================
       FEATURED ARTICLE
    ================================================== */

    featuredNews.innerHTML = `

      <article
        class="featured-article"
        data-article-id="${escapeHTML(
          article.id
        )}"
      >

        ${imageHTML}


        <div class="featured-content">

          <span class="featured-category">

            ${escapeHTML(
              article.category ||
              "OINANCE NEWS"
            )}

          </span>


          <h2>

            ${escapeHTML(
              article.title
            )}

          </h2>


          <p>

            ${escapeHTML(
              article.story
            )}

          </p>


          <div class="featured-meta">

            <span>

              ${escapeHTML(
                article.author ||
                "OINANCE Editorial"
              )}

            </span>


            <span>
              ${date}
            </span>

          </div>


          <div class="featured-read-more">

            Read Full Article →

          </div>

        </div>

      </article>

    `;


    const featuredArticle =
      featuredNews.querySelector(
        ".featured-article"
      );


    if (featuredArticle) {

      featuredArticle.addEventListener(
        "click",
        function () {

          window.location.href =
            "article.html?id=" +
            encodeURIComponent(
              article.id
            );

        }
      );

    }


  } catch (error) {

    console.error(
      "Unexpected Featured News error:",
      error
    );

  }

}


/* ==================================================
   SECURITY
================================================== */

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
