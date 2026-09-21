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
    chartId: "btcChart",
    marketPriceId: "marketBtc",
    marketChangeId: "marketBtcChange",
    tickerPriceId: "btcPrice",
    tickerChangeId: "btcChange",
    statsId: "btcMarketStats"
  },

  eth: {
    id: "ethereum",
    chartId: "ethChart",
    marketPriceId: "marketEth",
    marketChangeId: "marketEthChange",
    tickerPriceId: "ethPrice",
    tickerChangeId: "ethChange",
    statsId: "ethMarketStats"
  },

  sol: {
    id: "solana",
    chartId: "solChart",
    marketPriceId: "marketSol",
    marketChangeId: "marketSolChange",
    tickerPriceId: "solPrice",
    tickerChangeId: "solChange",
    statsId: "solMarketStats"
  },

  bnb: {
    id: "binancecoin",
    chartId: "bnbChart",
    marketPriceId: "marketBnb",
    marketChangeId: "marketBnbChange",
    tickerPriceId: "bnbPrice",
    tickerChangeId: "bnbChange",
    statsId: "bnbMarketStats"
  }

};


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

    loadNews();

    loadFeaturedNews();

    loadMarketData();

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
   OINANCE WEBSITE SEARCH
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


  if (!searchButton || !searchPanel) {

    return;

  }


  /* ----------------------------------------------
     OPEN SEARCH
  ---------------------------------------------- */

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


  /* ----------------------------------------------
     CLOSE SEARCH
  ---------------------------------------------- */

  if (closeSearch) {

    closeSearch.addEventListener(
      "click",
      function () {

        closeSearchPanel();

      }
    );

  }


  /* ----------------------------------------------
     ENTER KEY SEARCH
  ---------------------------------------------- */

  if (searchInput) {

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key ===
          "Enter"
        ) {

          event.preventDefault();

          performSiteSearch(
            searchInput.value
          );

        }


        if (
          event.key ===
          "Escape"
        ) {

          closeSearchPanel();

        }

      }
    );

  }


  /* ----------------------------------------------
     SEARCH BUTTON INSIDE PANEL
  ---------------------------------------------- */

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
   CLOSE SEARCH PANEL
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
   PERFORM SITE SEARCH
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


  /* ----------------------------------------------
     EMPTY SEARCH
  ---------------------------------------------- */

  if (!term) {

    displayNewsByCategory(
      "All"
    );

    closeSearchPanel();

    return;

  }


  /* ----------------------------------------------
     SEARCH ALL NEWS FIELDS
  ---------------------------------------------- */

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


  /* ----------------------------------------------
     DISPLAY SEARCH RESULTS
  ---------------------------------------------- */

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


    if (
      !allNewsArticles.length
    ) {

      showNoArticles();

      return;

    }


    displayNewsByCategory(
      "All"
    );


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
        >
      `

      : `
        <div
          class="placeholder-image"
        ></div>
      `;


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
   MARKET DATA
================================================== */

async function loadMarketData() {

  try {

    const response =
      await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&sparkline=true&price_change_percentage=24h"
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
          prices.length
        ) {

          drawRealMarketChart(
            asset.chartId,
            prices,
            change
          );

        } else {

          showChartMessage(
            asset.chartId,
            "Market history unavailable"
          );

        }

      }
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
    document.getElementById(
      asset.marketPriceId
    );


  const marketChange =
    document.getElementById(
      asset.marketChangeId
    );


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
   FORMAT MARKET VOLUME
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
   OINANCE LINK APP SERVICE WORKER
================================================== */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        console.log("OINANCE LINK app service worker registered.");
      })
      .catch((error) => {
        console.error(
          "OINANCE LINK service worker registration failed:",
          error
        );
      });
  });
}
