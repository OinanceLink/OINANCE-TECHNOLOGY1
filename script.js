/* ==================================================
   OINANCE LINK
   MAIN WEBSITE JAVASCRIPT
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
   MARKET CONFIGURATION
================================================== */

const MARKET_ASSETS = {

  btc: {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    chartId: "btcChart",
    marketPriceId: "marketBtc",
    marketChangeId: "marketBtcChange",
    tickerPriceId: "btcPrice",
    tickerChangeId: "btcChange",
    statsId: "btcMarketStats",
    livePriceId: "liveBtcPrice",
    liveChangeId: "liveBtcChange"
  },

  eth: {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    chartId: "ethChart",
    marketPriceId: "marketEth",
    marketChangeId: "marketEthChange",
    tickerPriceId: "ethPrice",
    tickerChangeId: "ethChange",
    statsId: "ethMarketStats",
    livePriceId: "liveEthPrice",
    liveChangeId: "liveEthChange"
  },

  sol: {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    chartId: "solChart",
    marketPriceId: "marketSol",
    marketChangeId: "marketSolChange",
    tickerPriceId: "solPrice",
    tickerChangeId: "solChange",
    statsId: "solMarketStats",
    livePriceId: "liveSolPrice",
    liveChangeId: "liveSolChange"
  },

  bnb: {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    chartId: "bnbChart",
    marketPriceId: "marketBnb",
    marketChangeId: "marketBnbChange",
    tickerPriceId: "bnbPrice",
    tickerChangeId: "bnbChange",
    statsId: "bnbMarketStats",
    livePriceId: "liveBnbPrice",
    liveChangeId: "liveBnbChange"
  },

  xrp: {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    chartId: null,
    marketPriceId: null,
    marketChangeId: null,
    tickerPriceId: "xrpPrice",
    tickerChangeId: "xrpChange",
    statsId: null,
    livePriceId: null,
    liveChangeId: null
  },

  doge: {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    chartId: null,
    marketPriceId: null,
    marketChangeId: null,
    tickerPriceId: "dogePrice",
    tickerChangeId: "dogeChange",
    statsId: null,
    livePriceId: null,
    liveChangeId: null
  },

  ada: {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    chartId: null,
    marketPriceId: null,
    marketChangeId: null,
    tickerPriceId: "adaPrice",
    tickerChangeId: "adaChange",
    statsId: null,
    livePriceId: null,
    liveChangeId: null
  },

  avax: {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    chartId: null,
    marketPriceId: null,
    marketChangeId: null,
    tickerPriceId: "avaxPrice",
    tickerChangeId: "avaxChange",
    statsId: null,
    livePriceId: null,
    liveChangeId: null
  }

};


/* ==================================================
   PAGE START
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupMobileMenu();

    setupSearch();

    updateYear();

    setupNewsCategories();

    setupNewsletter();

    setupMarketStatsStyle();

    setupProductProtection();

    loadNews();

    loadFeaturedNews();

    loadMarketData();

    setupLiveTicker();

  }
);


/* ==================================================
   MOBILE MENU
================================================== */

function setupMobileMenu() {

  const menuButton =
    document.getElementById(
      "menuButton"
    );


  const mobileMenu =
    document.getElementById(
      "mobileMenu"
    );


  if (
    !menuButton ||
    !mobileMenu
  ) {

    return;

  }


  menuButton.addEventListener(
    "click",
    function () {

      mobileMenu.classList.toggle(
        "open"
      );


      if (
        mobileMenu.classList.contains(
          "open"
        )
      ) {

        menuButton.textContent =
          "✕";

      } else {

        menuButton.textContent =
          "☰";

      }

    }
  );


  const mobileLinks =
    mobileMenu.querySelectorAll(
      "a"
    );


  mobileLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          mobileMenu.classList.remove(
            "open"
          );

          menuButton.textContent =
            "☰";

        }
      );

    }
  );

}


/* ==================================================
   SEARCH
================================================== */

function setupSearch() {

  const searchButton =
    document.getElementById(
      "searchButton"
    );


  const searchPanel =
    document.getElementById(
      "searchPanel"
    );


  const searchInput =
    document.getElementById(
      "siteSearch"
    );


  const closeSearch =
    document.getElementById(
      "closeSearch"
    );


  if (
    !searchButton ||
    !searchPanel
  ) {

    return;

  }


  searchButton.addEventListener(
    "click",
    function () {

      searchPanel.classList.add(
        "open"
      );


      if (searchInput) {

        setTimeout(
          function () {

            searchInput.focus();

          },
          100
        );

      }

    }
  );


  if (closeSearch) {

    closeSearch.addEventListener(
      "click",
      function () {

        closeSearchPanel();

      }
    );

  }


  if (searchInput) {

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          performSiteSearch(
            searchInput.value
          );

        }


        if (
          event.key === "Escape"
        ) {

          closeSearchPanel();

        }

      }
    );

  }


  const searchSubmit =
    searchPanel.querySelector(
      "button[type='submit']"
    );


  if (searchSubmit) {

    searchSubmit.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        performSiteSearch(
          searchInput
            ? searchInput.value
            : ""
        );

      }
    );

  }

}


/* ==================================================
   CLOSE SEARCH
================================================== */

function closeSearchPanel() {

  const searchPanel =
    document.getElementById(
      "searchPanel"
    );


  const searchInput =
    document.getElementById(
      "siteSearch"
    );


  if (searchPanel) {

    searchPanel.classList.remove(
      "open"
    );

  }


  if (searchInput) {

    searchInput.value =
      "";

  }

}


/* ==================================================
   PERFORM SEARCH
================================================== */

function performSiteSearch(
  searchTerm
) {

  const term =
    String(
      searchTerm || ""
    )
      .trim()
      .toLowerCase();


  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


  if (!newsGrid) {

    return;

  }


  if (!term) {

    displayNewsByCategory(
      "All"
    );

    closeSearchPanel();

    return;

  }


  const results =
    allNewsArticles.filter(
      function (article) {

        const title =
          String(
            article.title || ""
          ).toLowerCase();


        const story =
          String(
            article.story || ""
          ).toLowerCase();


        const category =
          String(
            article.category || ""
          ).toLowerCase();


        const author =
          String(
            article.author || ""
          ).toLowerCase();


        return (
          title.includes(term) ||
          story.includes(term) ||
          category.includes(term) ||
          author.includes(term)
        );

      }
    );


  newsGrid.innerHTML =
    "";


  if (!results.length) {

    newsGrid.innerHTML = `

      <article class="news-placeholder">

        <div class="placeholder-image"></div>

        <div class="placeholder-content">

          <span>
            OINANCE SEARCH
          </span>

          <h3>
            No results found.
          </h3>

          <p>
            We could not find any OINANCE
            News matching
            "<strong>${escapeHTML(
              searchTerm
            )}</strong>".
          </p>

        </div>

      </article>

    `;


    closeSearchPanel();


    newsGrid.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


    return;

  }


  results.forEach(
    function (article) {

      createNewsCard(
        article
      );

    }
  );


  closeSearchPanel();


  newsGrid.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* ==================================================
   CURRENT YEAR
================================================== */

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


/* ==================================================
   LOAD OINANCE NEWS
================================================== */

async function loadNews() {

  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


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


    if (
      !allNewsArticles.length
    ) {

      showNoArticles();

      return;

    }


    displayNewsByCategory(
      "All"
    );


    /*
      Build the new homepage newsroom sections
      after Supabase news has loaded.
    */

    buildHomepageNewsSections();

  } catch (error) {

    console.error(
      "Unexpected OINANCE News error:",
      error
    );

  }

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


  buildHomepageNewsSections();

}


/* ==================================================
   NEWS CATEGORY FILTER
================================================== */

function setupNewsCategories() {

  const categoryButtons =
    document.querySelectorAll(
      ".category-button"
    );


  if (
    !categoryButtons.length
  ) {

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


  newsGrid.innerHTML =
    "";


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
  article,
  targetContainer
) {

  const newsGrid =
    targetContainer ||
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
          loading="lazy"
        >
      `

      : `
        <div
          class="placeholder-image"
        ></div>
      `;


  const date =
    formatArticleDate(
      article.created_at
    );


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
          getArticlePreview(
            article.story,
            180
          )
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


/* ==================================================
   ARTICLE DATE
================================================== */

function formatArticleDate(
  dateValue
) {

  if (!dateValue) {

    return "";

  }


  const date =
    new Date(
      dateValue
    );


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );

}


/* ==================================================
   ARTICLE PREVIEW
================================================== */

function getArticlePreview(
  story,
  length
) {

  const text =
    String(
      story || ""
    )
      .replace(
        /<[^>]*>/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  if (
    text.length <= length
  ) {

    return text;

  }


  return (
    text.substring(
      0,
      length
    ).trim() +
    "..."
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
            class="featured-image"
          >
        `

        : "";


    const date =
      formatArticleDate(
        article.created_at
      );


    featuredNews.innerHTML = `

      <article
        class="featured-article"
        onclick="openFeaturedArticle('${encodeURIComponent(
          article.id
        )}')"
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
              getArticlePreview(
                article.story,
                280
              )
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


/* ==================================================
   OPEN FEATURED ARTICLE
================================================== */

function openFeaturedArticle(
  id
) {

  window.location.href =
    "article.html?id=" +
    id;

}


/* ==================================================
   NEW HOMEPAGE NEWSROOM
================================================== */

function buildHomepageNewsSections() {

  if (
    !allNewsArticles ||
    !allNewsArticles.length
  ) {

    return;

  }


  buildLiveNews();

  buildTopNews();

  buildMostRead();

  buildEditorialSection(
    "marketsNewsGrid",
    "Markets",
    [
      "markets",
      "market",
      "finance",
      "stocks",
      "stock market",
      "economy",
      "economic"
    ],
    6
  );


  buildEditorialSection(
    "bitcoinNewsGrid",
    "Bitcoin",
    [
      "bitcoin",
      "btc"
    ],
    6
  );


  buildEditorialSection(
    "ethereumNewsGrid",
    "Ethereum",
    [
      "ethereum",
      "eth"
    ],
    6
  );


  buildEditorialSection(
    "altcoinsNewsGrid",
    "Altcoins",
    [
      "altcoins",
      "altcoin",
      "xrp",
      "solana",
      "sol",
      "bnb",
      "dogecoin",
      "doge",
      "cardano",
      "avax"
    ],
    6
  );


  buildEditorialSection(
    "blockchainNewsGrid",
    "Blockchain",
    [
      "blockchain"
    ],
    6
  );


  buildEditorialSection(
    "regulationNewsGrid",
    "Regulation",
    [
      "regulation",
      "regulatory",
      "sec",
      "government",
      "policy",
      "law",
      "laws"
    ],
    6
  );


  buildEditorialSection(
    "magazineNewsGrid",
    "Magazine",
    [
      "magazine",
      "feature",
      "exclusive",
      "opinion",
      "analysis",
      "interview"
    ],
    6
  );

}


/* ==================================================
   LIVE NEWS
================================================== */

function buildLiveNews() {

  const container =
    document.getElementById(
      "liveNewsList"
    );


  if (!container) {

    return;

  }


  const articles =
    allNewsArticles.slice(
      0,
      5
    );


  container.innerHTML =
    "";


  articles.forEach(
    function (article) {

      const item =
        createCompactNewsItem(
          article
        );


      container.appendChild(
        item
      );

    }
  );


  if (!articles.length) {

    container.innerHTML = `

      <div class="news-placeholder">

        <h3>
          Live news will appear here.
        </h3>

      </div>

    `;

  }

}


/* ==================================================
   TOP NEWS
================================================== */

function buildTopNews() {

  const container =
    document.getElementById(
      "topNewsGrid"
    );


  if (!container) {

    return;

  }


  const articles =
    allNewsArticles.slice(
      0,
      4
    );


  container.innerHTML =
    "";


  articles.forEach(
    function (article) {

      const card =
        createEditorialCard(
          article
        );


      container.appendChild(
        card
      );

    }
  );

}


/* ==================================================
   MOST READ
================================================== */

function buildMostRead() {

  const container =
    document.getElementById(
      "mostReadList"
    );


  if (!container) {

    return;

  }


  /*
    The current Supabase news table does not contain
    a read_count/views field.

    We therefore use the latest published editorial
    stories instead of inventing popularity numbers.
  */

  const articles =
    allNewsArticles.slice(
      0,
      6
    );


  container.innerHTML =
    "";


  articles.forEach(
    function (
      article,
      index
    ) {

      const item =
        document.createElement(
          "article"
        );


      item.className =
        "most-read-item";


      item.style.cursor =
        "pointer";


      item.addEventListener(
        "click",
        function () {

          window.location.href =
            "article.html?id=" +
            encodeURIComponent(
              article.id
            );

        }
      );


      item.innerHTML = `

        <span class="most-read-number">
          ${String(
            index + 1
          ).padStart(
            2,
            "0"
          )}
        </span>


        <div class="most-read-content">

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


          <span class="most-read-date">
            ${formatArticleDate(
              article.created_at
            )}
          </span>

        </div>

      `;


      container.appendChild(
        item
      );

    }
  );

}


/* ==================================================
   EDITORIAL SECTION
================================================== */

function buildEditorialSection(
  containerId,
  sectionName,
  keywords,
  limit
) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) {

    return;

  }


  const articles =
    findArticlesForSection(
      sectionName,
      keywords,
      limit
    );


  container.innerHTML =
    "";


  articles.forEach(
    function (article) {

      const card =
        createEditorialCard(
          article
        );


      container.appendChild(
        card
      );

    }
  );


  if (!articles.length) {

    container.innerHTML = `

      <div class="section-empty">

        <span>
          OINANCE ${escapeHTML(
            sectionName
          )}
        </span>

        <p>
          New ${escapeHTML(
            sectionName
          )} stories will appear here.
        </p>

      </div>

    `;

  }

}


/* ==================================================
   FIND ARTICLES FOR EDITORIAL SECTION
================================================== */

function findArticlesForSection(
  sectionName,
  keywords,
  limit
) {

  const normalizedKeywords =
    keywords.map(
      function (keyword) {

        return String(
          keyword
        )
          .trim()
          .toLowerCase();

      }
    );


  /*
    First look for the category itself.
  */

  const exactCategory =
    allNewsArticles.filter(
      function (article) {

        const category =
          String(
            article.category || ""
          )
            .trim()
            .toLowerCase();


        return normalizedKeywords.includes(
          category
        );

      }
    );


  /*
    If the category has enough stories,
    use those first.
  */

  if (
    exactCategory.length >= limit
  ) {

    return exactCategory.slice(
      0,
      limit
    );

  }


  /*
    Then look through title, category and story.
    This allows articles to appear in the correct
    editorial section even when the Dashboard
    category name is slightly different.
  */

  const keywordMatches =
    allNewsArticles.filter(
      function (article) {

        const title =
          String(
            article.title || ""
          ).toLowerCase();


        const category =
          String(
            article.category || ""
          ).toLowerCase();


        const story =
          String(
            article.story || ""
          ).toLowerCase();


        return normalizedKeywords.some(
          function (keyword) {

            return (
              title.includes(keyword) ||
              category.includes(keyword) ||
              story.includes(keyword)
            );

          }
        );

      }
    );


  /*
    Remove duplicates.
  */

  const combined = [];


  exactCategory.forEach(
    function (article) {

      if (
        !combined.some(
          function (item) {

            return item.id === article.id;

          }
        )
      ) {

        combined.push(
          article
        );

      }

    }
  );


  keywordMatches.forEach(
    function (article) {

      if (
        !combined.some(
          function (item) {

            return item.id === article.id;

          }
        )
      ) {

        combined.push(
          article
        );

      }

    }
  );


  return combined.slice(
    0,
    limit
  );

}


/* ==================================================
   CREATE EDITORIAL CARD
================================================== */

function createEditorialCard(
  article
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "editorial-news-card";


  card.style.cursor =
    "pointer";


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
          loading="lazy"
        >
      `

      : `
        <div class="editorial-card-placeholder"></div>
      `;


  card.innerHTML = `

    <div class="editorial-card-image">

      ${image}

    </div>


    <div class="editorial-card-body">

      <span class="editorial-card-category">

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
          getArticlePreview(
            article.story,
            140
          )
        )}

      </p>


      <div class="editorial-card-meta">

        <span>
          ${escapeHTML(
            article.author ||
            "OINANCE Editorial"
          )}
        </span>


        <span>
          ${formatArticleDate(
            article.created_at
          )}
        </span>

      </div>

    </div>

  `;


  return card;

}


/* ==================================================
   CREATE COMPACT NEWS ITEM
================================================== */

function createCompactNewsItem(
  article
) {

  const item =
    document.createElement(
      "article"
    );


  item.className =
    "live-news-item";


  item.style.cursor =
    "pointer";


  item.addEventListener(
    "click",
    function () {

      window.location.href =
        "article.html?id=" +
        encodeURIComponent(
          article.id
        );

    }
  );


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
          loading="lazy"
        >
      `

      : `
        <div class="live-news-placeholder"></div>
      `;


  item.innerHTML = `

    <div class="live-news-image">

      ${image}

    </div>


    <div class="live-news-content">

      <span>
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


      <small>
        ${formatArticleDate(
          article.created_at
        )}
      </small>

    </div>

  `;


  return item;

}


/* ==================================================
   LIVE MARKET PANEL
================================================== */

function updateLiveMarketPanel(
  asset,
  price,
  change
) {

  const priceElement =
    document.getElementById(
      asset.livePriceId
    );


  const changeElement =
    document.getElementById(
      asset.liveChangeId
    );


  if (priceElement) {

    priceElement.textContent =
      formatMarketPrice(
        price
      );

  }


  if (changeElement) {

    changeElement.textContent =
      formatMarketChange(
        change
      );


    changeElement.classList.remove(
      "market-up",
      "market-down"
    );


    changeElement.classList.add(
      Number(change) >= 0
        ? "market-up"
        : "market-down"
    );

  }

}


/* ==================================================
   SETUP LIVE TICKER
================================================== */

function setupLiveTicker() {

  const tickerTrack =
    document.querySelector(
      ".market-ticker-track"
    );


  if (!tickerTrack) {

    return;

  }


  /*
    Duplicate the ticker items once so the CSS
    scrolling animation can move continuously.
  */

  if (
    !tickerTrack.dataset.duplicated
  ) {

    const original =
      tickerTrack.innerHTML;


    tickerTrack.innerHTML =
      original +
      original;


    tickerTrack.dataset.duplicated =
      "true";

  }

}


/* ==================================================
   MARKET STATS STYLE
================================================== */

function setupMarketStatsStyle() {

  if (
    document.getElementById(
      "oinanceMarketStatsStyle"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "oinanceMarketStatsStyle";


  style.textContent = `

    .market-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 18px;
      padding-top: 15px;
      border-top: 1px solid #292929;
    }

    .market-stat {
      min-width: 0;
    }

    .market-stat-label {
      display: block;
      color: #666;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .market-stat-value {
      display: block;
      color: #ddd;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .section-empty {
      width: 100%;
      padding: 35px 20px;
      border: 1px solid #252525;
      background: #0b0b0b;
    }

    .section-empty span {
      color: #777;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .section-empty p {
      margin: 8px 0 0;
      color: #666;
      font-size: 13px;
    }

    .editorial-card-placeholder {
      width: 100%;
      height: 100%;
      min-height: 180px;
      background: #111;
    }

    @media (max-width: 600px) {

      .market-stats {
        gap: 7px;
      }

      .market-stat-label {
        font-size: 7px;
        letter-spacing: .7px;
      }

      .market-stat-value {
        font-size: 10px;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* ==================================================
   MARKET DATA
================================================== */

async function loadMarketData() {

  try {

    const response =
      await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,avalanche-2&sparkline=true&price_change_percentage=24h"
      );


    if (!response.ok) {

      throw new Error(
        "CoinGecko market request failed: " +
        response.status
      );

    }


    const data =
      await response.json();


    if (
      !Array.isArray(data)
    ) {

      throw new Error(
        "Invalid market data"
      );

    }


    data.forEach(
      function (coin) {

        const asset =
          Object.values(
            MARKET_ASSETS
          ).find(
            function (item) {

              return (
                item.id ===
                coin.id
              );

            }
          );


        if (!asset) {

          return;

        }


        const change =
          Number(
            coin.price_change_percentage_24h_in_currency ??
            coin.price_change_percentage_24h ??
            0
          );


        updateMarketAsset(
          asset,
          coin.current_price,
          change
        );


        updateLiveMarketPanel(
          asset,
          coin.current_price,
          change
        );


        updateMarketStats(
          asset,
          coin.high_24h,
          coin.low_24h,
          coin.total_volume
        );


        const prices =
          coin.sparkline_in_7d &&
          Array.isArray(
            coin.sparkline_in_7d.price
          )
            ? coin.sparkline_in_7d.price
            : [];


        if (
          prices.length &&
          asset.chartId
        ) {

          drawRealMarketChart(
            asset.chartId,
            prices,
            change
          );

        } else if (
          asset.chartId
        ) {

          showChartMessage(
            asset.chartId,
            "Market history unavailable"
          );

        }

      }
    );


    /*
      Update the Live News & Markets panel.
    */

    buildLiveMarketList(
      data
    );


  } catch (error) {

    console.error(
      "OINANCE market data error:",
      error
    );

    showMarketChartErrors();

  }

}


/* ==================================================
   LIVE MARKET LIST
================================================== */

function buildLiveMarketList(
  marketData
) {

  const container =
    document.getElementById(
      "liveMarketList"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  const assets =
    marketData.slice(
      0,
      8
    );


  assets.forEach(
    function (coin) {

      const change =
        Number(
          coin.price_change_percentage_24h_in_currency ??
          coin.price_change_percentage_24h ??
          0
        );


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "live-market-item";


      item.innerHTML = `

        <div class="live-market-name">

          <strong>
            ${escapeHTML(
              getCoinSymbol(
                coin.id
              )
            )}
          </strong>

          <span>
            ${escapeHTML(
              coin.name
            )}
          </span>

        </div>


        <div class="live-market-price">

          <strong>
            ${formatMarketPrice(
              coin.current_price
            )}
          </strong>


          <span class="${
            change >= 0
              ? "market-up"
              : "market-down"
          }">

            ${formatMarketChange(
              change
            )}

          </span>

        </div>

      `;


      container.appendChild(
        item
      );

    }
  );

}


/* ==================================================
   COIN SYMBOL
================================================== */

function getCoinSymbol(
  coinId
) {

  const asset =
    Object.values(
      MARKET_ASSETS
    ).find(
      function (item) {

        return (
          item.id ===
          coinId
        );

      }
    );


  if (asset) {

    return asset.symbol;

  }


  return String(
    coinId || ""
  )
    .substring(
      0,
      5
    )
    .toUpperCase();

}


/* ==================================================
   UPDATE MARKET ASSET
================================================== */

function updateMarketAsset(
  asset,
  price,
  change
) {

  const tickerPrice =
    document.getElementById(
      asset.tickerPriceId
    );


  const tickerChange =
    document.getElementById(
      asset.tickerChangeId
    );


  const marketPrice =
    asset.marketPriceId
      ? document.getElementById(
          asset.marketPriceId
        )
      : null;


  const marketChange =
    asset.marketChangeId
      ? document.getElementById(
          asset.marketChangeId
        )
      : null;


  const formattedPrice =
    formatMarketPrice(
      price
    );


  const formattedChange =
    formatMarketChange(
      change
    );


  if (tickerPrice) {

    tickerPrice.textContent =
      formattedPrice;

  }


  if (tickerChange) {

    tickerChange.textContent =
      formattedChange;


    tickerChange.classList.remove(
      "market-up",
      "market-down"
    );


    tickerChange.classList.add(
      change >= 0
        ? "market-up"
        : "market-down"
    );

  }


  if (marketPrice) {

    marketPrice.textContent =
      formattedPrice;

  }


  if (marketChange) {

    marketChange.textContent =
      formattedChange;


    marketChange.classList.remove(
      "market-up",
      "market-down"
    );


    marketChange.classList.add(
      change >= 0
        ? "market-up"
        : "market-down"
    );

  }

}


/* ==================================================
   UPDATE MARKET STATS
================================================== */

function updateMarketStats(
  asset,
  high24h,
  low24h,
  volume24h
) {

  if (!asset.chartId) {

    return;

  }


  const chart =
    document.getElementById(
      asset.chartId
    );


  if (!chart) {

    return;

  }


  const card =
    chart.closest(
      ".market-card"
    );


  if (!card) {

    return;

  }


  let stats =
    document.getElementById(
      asset.statsId
    );


  if (!stats) {

    stats =
      document.createElement(
        "div"
      );


    stats.id =
      asset.statsId;


    stats.className =
      "market-stats";


    card.insertBefore(
      stats,
      chart
    );

  }


  stats.innerHTML = `

    <div class="market-stat">

      <span class="market-stat-label">
        24H HIGH
      </span>

      <span class="market-stat-value">
        ${formatMarketPrice(
          high24h
        )}
      </span>

    </div>


    <div class="market-stat">

      <span class="market-stat-label">
        24H LOW
      </span>

      <span class="market-stat-value">
        ${formatMarketPrice(
          low24h
        )}
      </span>

    </div>


    <div class="market-stat">

      <span class="market-stat-label">
        VOLUME
      </span>

      <span class="market-stat-value">
        ${formatMarketVolume(
          volume24h
        )}
      </span>

    </div>

  `;

}


/* ==================================================
   FORMAT PRICE
================================================== */

function formatMarketPrice(
  price
) {

  if (
    price === null ||
    price === undefined ||
    isNaN(price)
  ) {

    return "$—";

  }


  const number =
    Number(price);


  if (
    number >= 100
  ) {

    return "$" +
      number.toLocaleString(
        "en-US",
        {
          maximumFractionDigits: 0
        }
      );

  }


  return "$" +
    number.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


/* ==================================================
   FORMAT VOLUME
================================================== */

function formatMarketVolume(
  volume
) {

  if (
    volume === null ||
    volume === undefined ||
    isNaN(volume)
  ) {

    return "$—";

  }


  const number =
    Number(volume);


  if (
    number >= 1e12
  ) {

    return "$" +
      (
        number / 1e12
      ).toFixed(2) +
      "T";

  }


  if (
    number >= 1e9
  ) {

    return "$" +
      (
        number / 1e9
      ).toFixed(2) +
      "B";

  }


  if (
    number >= 1e6
  ) {

    return "$" +
      (
        number / 1e6
      ).toFixed(2) +
      "M";

  }


  if (
    number >= 1e3
  ) {

    return "$" +
      (
        number / 1e3
      ).toFixed(2) +
      "K";

  }


  return "$" +
    number.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 0
      }
    );

}


/* ==================================================
   FORMAT CHANGE
================================================== */

function formatMarketChange(
  change
) {

  if (
    change === null ||
    change === undefined ||
    isNaN(change)
  ) {

    return "—";

  }


  const number =
    Number(change);


  return (
    number >= 0
      ? "+"
      : ""
  ) +
    number.toFixed(2) +
    "%";

}


/* ==================================================
   REAL SVG MARKET CHART
================================================== */

function drawRealMarketChart(
  chartId,
  prices,
  change
) {

  const chart =
    document.getElementById(
      chartId
    );


  if (!chart) {

    return;

  }


  const values =
    prices
      .filter(
        function (value) {

          return (
            typeof value === "number" &&
            isFinite(value)
          );

        }
      )
      .slice(-48);


  if (
    values.length < 2
  ) {

    showChartMessage(
      chartId,
      "Not enough market data"
    );

    return;

  }


  const width = 320;
  const height = 90;
  const padding = 6;


  let min =
    Math.min(
      ...values
    );


  let max =
    Math.max(
      ...values
    );


  if (
    min === max
  ) {

    min -= 1;
    max += 1;

  }


  const range =
    max - min;


  const points =
    values.map(
      function (
        value,
        index
      ) {

        const x =
          padding +
          (
            index /
            (values.length - 1)
          ) *
          (
            width -
            padding * 2
          );


        const y =
          height -
          padding -
          (
            (
              value - min
            ) /
            range
          ) *
          (
            height -
            padding * 2
          );


        return {
          x: x,
          y: y
        };

      }
    );


  const linePath =
    points
      .map(
        function (
          point,
          index
        ) {

          return (
            index === 0
              ? "M "
              : "L "
          ) +
          point.x.toFixed(2) +
          " " +
          point.y.toFixed(2);

        }
      )
      .join(" ");


  const lastPoint =
    points[
      points.length - 1
    ];


  const firstPoint =
    points[0];


  const areaPath =
    linePath +
    " L " +
    lastPoint.x.toFixed(2) +
    " " +
    (
      height -
      padding
    ) +
    " L " +
    firstPoint.x.toFixed(2) +
    " " +
    (
      height -
      padding
    ) +
    " Z";


  const direction =
    Number(change) >= 0
      ? "up"
      : "down";


  const chartColor =
    Number(change) >= 0
      ? "#24c76b"
      : "#ff4d4d";


  const gradientId =
    "gradient-" +
    chartId;


  chart.innerHTML = `

    <svg
      class="oinance-market-svg"
      viewBox="0 0 ${width} ${height}"
      preserveAspectRatio="none"
      role="img"
      aria-label="Live market price chart"
      style="
        width:100%;
        height:90px;
        display:block;
        overflow:visible;
      "
    >

      <defs>

        <linearGradient
          id="${gradientId}"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >

          <stop
            offset="0%"
            stop-color="${chartColor}"
            stop-opacity="0.25"
          />

          <stop
            offset="100%"
            stop-color="${chartColor}"
            stop-opacity="0"
          />

        </linearGradient>

      </defs>


      <line
        x1="0"
        y1="22"
        x2="${width}"
        y2="22"
        stroke="#292929"
        stroke-width="1"
      />

      <line
        x1="0"
        y1="45"
        x2="${width}"
        y2="45"
        stroke="#292929"
        stroke-width="1"
      />

      <line
        x1="0"
        y1="68"
        x2="${width}"
        y2="68"
        stroke="#292929"
        stroke-width="1"
      />


      <path
        d="${areaPath}"
        fill="url(#${gradientId})"
        stroke="none"
      />


      <path
        d="${linePath}"
        fill="none"
        stroke="${chartColor}"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />


      <circle
        cx="${lastPoint.x}"
        cy="${lastPoint.y}"
        r="3.5"
        fill="${chartColor}"
      />

    </svg>

  `;


  chart.setAttribute(
    "data-chart-direction",
    direction
  );

}


/* ==================================================
   CHART FALLBACK
================================================== */

function showChartMessage(
  chartId,
  message
) {

  const chart =
    document.getElementById(
      chartId
    );


  if (!chart) {

    return;

  }


  chart.innerHTML = `

    <div
      style="
        width:100%;
        height:90px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#777;
        font-size:11px;
        letter-spacing:1px;
      "
    >

      ${escapeHTML(
        message
      )}

    </div>

  `;

}


/* ==================================================
   MARKET CHART ERROR
================================================== */

function showMarketChartErrors() {

  const chartIds = [
    "btcChart",
    "ethChart",
    "solChart",
    "bnbChart"
  ];


  chartIds.forEach(
    function (chartId) {

      const chart =
        document.getElementById(
          chartId
        );


      if (
        chart &&
        !chart.querySelector(
          "svg"
        )
      ) {

        showChartMessage(
          chartId,
          "Market chart unavailable"
        );

      }

    }
  );

}


/* ==================================================
   REFRESH MARKET DATA
================================================== */

setInterval(
  function () {

    loadMarketData();

  },
  60000
);


/* ==================================================
   PRODUCT ACCESS
   OINANCE PRODUCT LOGIN SYSTEM
================================================== */

function setupProductProtection() {

  const productLinks =
    document.querySelectorAll(
      ".product-protected"
    );


  const modal =
    document.getElementById(
      "productLoginModal"
    );


  const overlay =
    document.getElementById(
      "productLoginOverlay"
    );


  const closeButton =
    document.getElementById(
      "productLoginClose"
    );


  const loginButton =
    document.getElementById(
      "productLoginButton"
    );


  const signupButton =
    document.getElementById(
      "productSignupButton"
    );


  if (
    !productLinks.length ||
    !modal
  ) {

    return;

  }


  productLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        async function (event) {

          event.preventDefault();


          const productUrl =
            link.getAttribute(
              "data-product-url"
            );


          const productName =
            link.getAttribute(
              "data-product-name"
            ) ||
            "this product";


          const {
            data,
            error
          } =
            await supabaseClient.auth.getSession();


          if (error) {

            console.error(
              "OINANCE authentication error:",
              error
            );

            openProductLoginModal(
              productName,
              productUrl
            );

            return;

          }


          const session =
            data &&
            data.session;


          if (session) {

            window.location.href =
              productUrl;

            return;

          }


          openProductLoginModal(
            productName,
            productUrl
          );

        }
      );

    }
  );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function () {

        closeProductLoginModal();

      }
    );

  }


  if (overlay) {

    overlay.addEventListener(
      "click",
      function () {

        closeProductLoginModal();

      }
    );

  }


  if (loginButton) {

    loginButton.addEventListener(
      "click",
      function () {

        showProductAuthForm(
          "login"
        );

      }
    );

  }


  if (signupButton) {

    signupButton.addEventListener(
      "click",
      function () {

        showProductAuthForm(
          "signup"
        );

      }
    );

  }


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        closeProductLoginModal();

      }

    }
  );


  supabaseClient.auth.onAuthStateChange(
    function (
      event,
      session
    ) {

      if (
        event === "SIGNED_OUT"
      ) {

        return;

      }


      if (
        event === "SIGNED_IN" &&
        session
      ) {

        const productUrl =
          modal.dataset.productUrl;


        if (productUrl) {

          closeProductLoginModal();

          window.location.href =
            productUrl;

        }

      }

    }
  );

}


/* ==================================================
   OPEN PRODUCT LOGIN MODAL
================================================== */

function openProductLoginModal(
  productName,
  productUrl
) {

  const modal =
    document.getElementById(
      "productLoginModal"
    );


  if (!modal) {

    return;

  }


  modal.dataset.productUrl =
    productUrl || "";


  modal.dataset.productName =
    productName || "this product";


  const title =
    document.getElementById(
      "productLoginTitle"
    );


  const message =
    document.getElementById(
      "productLoginMessage"
    );


  if (title) {

    title.textContent =
      "Login to access this product";

  }


  if (message) {

    message.textContent =
      "Please log in with your email or sign up for an OINANCE account to access " +
      productName +
      ".";

  }


  const loginButton =
    document.getElementById(
      "productLoginButton"
    );


  const signupButton =
    document.getElementById(
      "productSignupButton"
    );


  if (loginButton) {

    loginButton.style.display =
      "block";

  }


  if (signupButton) {

    signupButton.style.display =
      "block";

  }


  const form =
    document.getElementById(
      "productAuthForm"
    );


  if (form) {

    form.remove();

  }


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


/* ==================================================
   CLOSE PRODUCT LOGIN MODAL
================================================== */

function closeProductLoginModal() {

  const modal =
    document.getElementById(
      "productLoginModal"
    );


  if (!modal) {

    return;

  }


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";


  const form =
    document.getElementById(
      "productAuthForm"
    );


  if (form) {

    form.remove();

  }


  const loginButton =
    document.getElementById(
      "productLoginButton"
    );


  const signupButton =
    document.getElementById(
      "productSignupButton"
    );


  if (loginButton) {

    loginButton.style.display =
      "block";

  }


  if (signupButton) {

    signupButton.style.display =
      "block";

  }

}


/* ==================================================
   SHOW LOGIN / SIGN UP FORM
================================================== */

function showProductAuthForm(
  mode
) {

  const modal =
    document.getElementById(
      "productLoginModal"
    );


  if (!modal) {

    return;

  }


  const title =
    document.getElementById(
      "productLoginTitle"
    );


  const message =
    document.getElementById(
      "productLoginMessage"
    );


  const loginButton =
    document.getElementById(
      "productLoginButton"
    );


  const signupButton =
    document.getElementById(
      "productSignupButton"
    );


  if (loginButton) {

    loginButton.style.display =
      "none";

  }


  if (signupButton) {

    signupButton.style.display =
      "none";

  }


  if (title) {

    title.textContent =
      mode === "signup"
        ? "Create your OINANCE account"
        : "Login to OINANCE";

  }


  if (message) {

    message.textContent =
      mode === "signup"
        ? "Create an account with your email and password to access OINANCE products."
        : "Enter your email and password to continue.";

  }


  const oldForm =
    document.getElementById(
      "productAuthForm"
    );


  if (oldForm) {

    oldForm.remove();

  }


  const form =
    document.createElement(
      "form"
    );


  form.id =
    "productAuthForm";


  form.innerHTML = `

    <div class="product-auth-field">

      <label for="productAuthEmail">
        Email
      </label>

      <input
        type="email"
        id="productAuthEmail"
        name="email"
        placeholder="you@example.com"
        autocomplete="email"
        required
      >

    </div>


    <div class="product-auth-field">

      <label for="productAuthPassword">
        Password
      </label>

      <input
        type="password"
        id="productAuthPassword"
        name="password"
        placeholder="Enter your password"
        autocomplete="${
          mode === "signup"
            ? "new-password"
            : "current-password"
        }"
        minlength="6"
        required
      >

    </div>


    ${
      mode === "signup"
        ? `
          <div class="product-auth-field">

            <label for="productAuthPasswordConfirm">
              Confirm Password
            </label>

            <input
              type="password"
              id="productAuthPasswordConfirm"
              name="password_confirm"
              placeholder="Confirm your password"
              autocomplete="new-password"
              minlength="6"
              required
            >

          </div>
        `
        : ""
    }


    <div
      id="productAuthMessage"
      class="product-auth-message"
      aria-live="polite"
    ></div>


    <button
      type="submit"
      class="product-auth-submit"
    >
      ${
        mode === "signup"
          ? "Create Account"
          : "Login"
      }
    </button>


    <button
      type="button"
      class="product-auth-back"
      id="productAuthBack"
    >
      ← Back
    </button>

  `;


  const actions =
    modal.querySelector(
      ".product-login-actions"
    );


  if (actions) {

    actions.parentNode.insertBefore(
      form,
      actions
    );

  } else {

    const box =
      modal.querySelector(
        ".product-login-box"
      );


    if (box) {

      box.appendChild(
        form
      );

    }

  }


  const backButton =
    document.getElementById(
      "productAuthBack"
    );


  if (backButton) {

    backButton.addEventListener(
      "click",
      function () {

        showProductLoginChoice();

      }
    );

  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const emailInput =
        document.getElementById(
          "productAuthEmail"
        );


      const passwordInput =
        document.getElementById(
          "productAuthPassword"
        );


      const messageBox =
        document.getElementById(
          "productAuthMessage"
        );


      const email =
        emailInput.value
          .trim()
          .toLowerCase();


      const password =
        passwordInput.value;


      if (
        !email ||
        !password
      ) {

        messageBox.textContent =
          "Please enter your email and password.";

        return;

      }


      if (
        password.length < 6
      ) {

        messageBox.textContent =
          "Password must be at least 6 characters.";

        return;

      }


      if (
        mode === "signup"
      ) {

        const confirmInput =
          document.getElementById(
            "productAuthPasswordConfirm"
          );


        const confirmPassword =
          confirmInput
            ? confirmInput.value
            : "";


        if (
          password !==
          confirmPassword
        ) {

          messageBox.textContent =
            "Passwords do not match.";

          return;

        }

      }


      messageBox.textContent =
        mode === "signup"
          ? "Creating your account..."
          : "Logging in...";


      const submitButton =
        form.querySelector(
          ".product-auth-submit"
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          mode === "signup"
            ? "Creating Account..."
            : "Logging In...";

      }


      try {

        if (
          mode === "signup"
        ) {

          const {
            data,
            error
          } =
            await supabaseClient.auth.signUp({
              email: email,
              password: password
            });


          if (error) {

            throw error;

          }


          if (
            data &&
            data.session
          ) {

            messageBox.textContent =
              "Account created. Opening product...";


            const productUrl =
              modal.dataset.productUrl;


            setTimeout(
              function () {

                if (productUrl) {

                  window.location.href =
                    productUrl;

                }

              },
              500
            );


            return;

          }


          messageBox.textContent =
            "Account created. Please check your email to confirm your account, then log in.";

          form.reset();


        } else {

          const {
            data,
            error
          } =
            await supabaseClient.auth.signInWithPassword({
              email: email,
              password: password
            });


          if (error) {

            throw error;

          }


          if (
            data &&
            data.session
          ) {

            messageBox.textContent =
              "Login successful. Opening product...";


            const productUrl =
              modal.dataset.productUrl;


            setTimeout(
              function () {

                if (productUrl) {

                  window.location.href =
                    productUrl;

                }

              },
              400
            );

          }

        }


      } catch (error) {

        console.error(
          "OINANCE product authentication error:",
          error
        );


        let errorMessage =
          "Something went wrong. Please try again.";


        if (
          error &&
          error.message
        ) {

          errorMessage =
            error.message;

        }


        if (
          errorMessage
            .toLowerCase()
            .includes(
              "invalid login credentials"
            )
        ) {

          errorMessage =
            "Incorrect email or password.";

        }


        if (
          errorMessage
            .toLowerCase()
            .includes(
              "user already registered"
            )
        ) {

          errorMessage =
            "This email already has an account. Please log in.";

        }


        messageBox.textContent =
          errorMessage;


        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            mode === "signup"
              ? "Create Account"
              : "Login";

        }

      }

    }
  );


  setTimeout(
    function () {

      const emailInput =
        document.getElementById(
          "productAuthEmail"
        );


      if (emailInput) {

        emailInput.focus();

      }

    },
    100
  );

}


/* ==================================================
   RETURN TO LOGIN / SIGNUP CHOICE
================================================== */

function showProductLoginChoice() {

  const form =
    document.getElementById(
      "productAuthForm"
    );


  if (form) {

    form.remove();

  }


  const modal =
    document.getElementById(
      "productLoginModal"
    );


  if (!modal) {

    return;

  }


  const title =
    document.getElementById(
      "productLoginTitle"
    );


  const message =
    document.getElementById(
      "productLoginMessage"
    );


  const loginButton =
    document.getElementById(
      "productLoginButton"
    );


  const signupButton =
    document.getElementById(
      "productSignupButton"
    );


  const productName =
    modal.dataset.productName ||
    "this product";


  if (title) {

    title.textContent =
      "Login to access this product";

  }


  if (message) {

    message.textContent =
      "Please log in with your email or sign up for an OINANCE account to access " +
      productName +
      ".";

  }


  if (loginButton) {

    loginButton.style.display =
      "block";

  }


  if (signupButton) {

    signupButton.style.display =
      "block";

  }

}


/* ==================================================
   OINANCE LINK APP SERVICE WORKER
================================================== */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .then(
          () => {

            console.log(
              "OINANCE LINK app service worker registered."
            );

          }
        )
        .catch(
          (error) => {

            console.error(
              "OINANCE LINK service worker registration failed:",
              error
            );

          }
        );

    }
  );

}


/* ==================================================
   OINANCE LINK APP LAUNCH SCREEN
================================================== */

window.addEventListener(
  "load",
  () => {

    const splash =
      document.getElementById(
        "oinanceSplash"
      );


    if (!splash) {

      return;

    }


    setTimeout(
      () => {

        splash.style.transition =
          "opacity 0.6s ease";

        splash.style.opacity =
          "0";


        setTimeout(
          () => {

            splash.remove();

          },
          600
        );

      },
      2500
    );

  }
);
