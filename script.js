/* =========================
   OINANCE TECHNOLOGY
   MAIN WEBSITE JAVASCRIPT
========================= */


/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================
   NEWS STORAGE
========================= */

let allNewsArticles = [];


/* =========================
   PAGE START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupMobileMenu();

    updateYear();

    setupNewsCategories();

    setupNewsletter();

    loadNews();

  }
);


/* =========================
   MOBILE MENU
========================= */

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


/* =========================
   CURRENT YEAR
========================= */

function updateYear() {

  const year =
    document.querySelector(
      ".site-footer p"
    );


  if (year) {

    year.textContent =
      "© " +
      new Date().getFullYear() +
      " OINANCE. All rights reserved.";

  }

}


/* =========================
   LOAD OINANCE NEWS
========================= */

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
          "id, title, category, author, story, image_url, created_at"
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


    /* =========================
       NO ARTICLES
    ========================= */

    if (
      !allNewsArticles.length
    ) {

      showNoArticles();

      return;

    }


    /* =========================
       SHOW ALL ARTICLES
    ========================= */

    displayNewsByCategory("All");


  } catch (error) {

    console.error(
      "Unexpected OINANCE News error:",
      error
    );

  }

}


/* =========================
   NO ARTICLES MESSAGE
========================= */

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


/* =========================
   NEWS CATEGORY FILTER
========================= */

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


/* =========================
   DISPLAY NEWS BY CATEGORY
========================= */

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


  /* =========================
     NO CATEGORY ARTICLES
  ========================= */

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


  /* =========================
     CREATE NEWS CARDS
  ========================= */

  filteredArticles.forEach(
    function (article) {

      createNewsCard(
        article
      );

    }
  );

}


/* =========================
   CREATE NEWS CARD
========================= */

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


  /* =========================
     OPEN FULL ARTICLE
  ========================= */

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


  /* =========================
     IMAGE
  ========================= */

  const image =
    article.image_url

      ? `
        <img
          src="${escapeHTML(
            article.image_url
          )}"
          alt="${escapeHTML(
            article.title
          )}"
          class="news-image"
        >
      `

      : `
        <div
          class="placeholder-image"
        ></div>
      `;


  /* =========================
     DATE
  ========================= */

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


  /* =========================
     ARTICLE CARD
  ========================= */

  card.innerHTML = `

    ${image}

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


/* =========================
   NEWSLETTER
========================= */

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

        /* =========================
           SAVE SUBSCRIBER
        ========================= */

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


        /* =========================
           SUCCESS
        ========================= */

        newsletterMessage.textContent =
          "You're subscribed to OINANCE News.";


        newsletterForm.reset();


      } catch (error) {

        console.error(
          "Newsletter subscription error:",
          error
        );


        /* =========================
           DUPLICATE EMAIL
        ========================= */

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

/* =========================
   FEATURED OINANCE NEWS
========================= */

async function loadFeaturedNews() {

  const featuredNews =
    document.getElementById("featuredNews");

  if (!featuredNews) {
    return;
  }

  try {

    const { data, error } =
      await supabaseClient
        .from("news")
        .select(
          "id, title, category, author, story, image_url, created_at"
        )
        .eq("published", true)
        .order("created_at", {
          ascending: false
        })
        .limit(1);


    if (error) {

      console.error(
        "Featured News error:",
        error
      );

      return;
    }


    if (!data || data.length === 0) {

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


    const article = data[0];


    const image =
      article.image_url

        ? `
          <img
            src="${escapeHTML(article.image_url)}"
            alt="${escapeHTML(article.title)}"
            class="featured-image"
          >
        `

        : "";


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


    featuredNews.innerHTML = `

      <article
        class="featured-article"
        onclick="openFeaturedArticle('${encodeURIComponent(article.id)}')"
      >

        ${image}


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


  } catch (error) {

    console.error(
      "Unexpected Featured News error:",
      error
    );

  }

}


/* =========================
   OPEN FEATURED ARTICLE
========================= */

function openFeaturedArticle(id) {

  window.location.href =
    "article.html?id=" + id;

}


/* =========================
   START FEATURED NEWS
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadFeaturedNews();

  }
);
