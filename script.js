/* =========================================================
   OINANCE LINK — MAIN WEBSITE SCRIPT
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL = "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let allNewsArticles = [];


/* =========================================================
   MARKET ASSETS
   ========================================================= */

const MARKET_ASSETS = {
  btc: {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    priceId: "btcPrice",
    changeId: "btcChange",
    tickerPriceId: "tickerBtcPrice",
    tickerChangeId: "tickerBtcChange",
    livePriceId: "liveBtcPrice",
    liveChangeId: "liveBtcChange",
    marketPriceId: "marketBtc",
    chartId: "btcChart"
  },

  eth: {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    priceId: "ethPrice",
    changeId: "ethChange",
    tickerPriceId: "tickerEthPrice",
    tickerChangeId: "tickerEthChange",
    livePriceId: "liveEthPrice",
    liveChangeId: "liveEthChange",
    marketPriceId: "marketEth",
    chartId: "ethChart"
  },

  sol: {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    priceId: "solPrice",
    changeId: "solChange",
    tickerPriceId: "tickerSolPrice",
    tickerChangeId: "tickerSolChange",
    livePriceId: "liveSolPrice",
    liveChangeId: "liveSolChange",
    marketPriceId: "marketSol",
    chartId: "solChart"
  },

  bnb: {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    priceId: "bnbPrice",
    changeId: "bnbChange",
    tickerPriceId: "tickerBnbPrice",
    tickerChangeId: "tickerBnbChange",
    livePriceId: "liveBnbPrice",
    liveChangeId: "liveBnbChange",
    marketPriceId: "marketBnb",
    chartId: "bnbChart"
  },

  xrp: {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    tickerPriceId: "tickerXrpPrice",
    tickerChangeId: "tickerXrpChange",
    livePriceId: "liveXrpPrice",
    liveChangeId: "liveXrpChange"
  },

  doge: {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    tickerPriceId: "tickerDogePrice",
    tickerChangeId: "tickerDogeChange",
    livePriceId: "liveDogePrice",
    liveChangeId: "liveDogeChange"
  },

  ada: {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    tickerPriceId: "tickerAdaPrice",
    tickerChangeId: "tickerAdaChange",
    livePriceId: "liveAdaPrice",
    liveChangeId: "liveAdaChange"
  },

  avax: {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    tickerPriceId: "tickerAvaxPrice",
    tickerChangeId: "tickerAvaxChange",
    livePriceId: "liveAvaxPrice",
    liveChangeId: "liveAvaxChange"
  }
};


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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

});


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

  const menuToggle =
    document.getElementById("menuToggle");

  const navLinks =
    document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    menuToggle.classList.toggle("active");

  });


  navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("active");

      menuToggle.classList.remove("active");

    });

  });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

  const searchButton =
    document.getElementById("searchButton");

  const searchBox =
    document.getElementById("searchBox");

  const searchInput =
    document.getElementById("searchInput");

  if (!searchButton || !searchBox || !searchInput) {
    return;
  }


  searchButton.addEventListener("click", () => {

    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {

      searchInput.focus();

    }

  });


  searchInput.addEventListener("input", () => {

    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    if (!query) {

      renderNews(allNewsArticles);

      return;

    }


    const filtered =
      allNewsArticles.filter(article => {

        return (

          String(article.title || "")
            .toLowerCase()
            .includes(query)

          ||

          String(article.category || "")
            .toLowerCase()
            .includes(query)

          ||

          String(article.story || "")
            .toLowerCase()
            .includes(query)

        );

      });


    renderNews(filtered);

  });

}


/* =========================================================
   YEAR
   ========================================================= */

function updateYear() {

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}


/* =========================================================
   NEWS CATEGORIES
   ========================================================= */

function setupNewsCategories() {

  const buttons =
    document.querySelectorAll(
      ".category-button"
    );

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      buttons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      const category =
        button.dataset.category;

      if (!category || category === "all") {

        renderNews(allNewsArticles);

        return;

      }


      const filtered =
        allNewsArticles.filter(article => {

          return String(article.category || "")
            .toLowerCase()
            === category.toLowerCase();

        });


      renderNews(filtered);

    });

  });

}


/* =========================================================
   LOAD NEWS
   ========================================================= */

async function loadNews() {

  try {

    const { data, error } =
      await supabaseClient
        .from("news")
        .select(
          "id,title,category,author,story,image_url,created_at"
        )
        .eq("published", true)
        .order("created_at", {
          ascending: false
        });


    if (error) {

      console.error(
        "News loading error:",
        error
      );

      return;

    }


    allNewsArticles =
      data || [];


    renderNews(allNewsArticles);

    buildHomepageNewsSections(
      allNewsArticles
    );

  } catch (error) {

    console.error(
      "Unexpected news error:",
      error
    );

  }

}


/* =========================================================
   RENDER MAIN NEWS
   ========================================================= */

function renderNews(articles) {

  const newsGrid =
    document.getElementById("newsGrid");

  if (!newsGrid) return;


  if (!articles.length) {

    newsGrid.innerHTML = `
      <div class="empty-news">
        No news articles found.
      </div>
    `;

    return;

  }


  newsGrid.innerHTML =
    articles
      .map(article =>
        createNewsCard(article)
      )
      .join("");

}


/* =========================================================
   MAIN NEWS CARD
   ========================================================= */

function createNewsCard(article) {

  const title =
    escapeHTML(
      article.title || "Untitled article"
    );


  const category =
    escapeHTML(
      article.category || "News"
    );


  const author =
    escapeHTML(
      article.author || "OINANCE"
    );


  const preview =
    createPreview(
      article.story || "",
      170
    );


  const image =
    article.image_url
      ? article.image_url
      : "icon-512.png";


  const date =
    formatDate(article.created_at);


  return `
    <article
      class="news-card"
      onclick="openArticle('${article.id}')"
      style="
        display:flex;
        flex-direction:column;
        width:100%;
        overflow:hidden;
      "
    >

      <div
        class="news-card-image-wrap"
        style="
          width:100%;
          height:clamp(150px,22vw,190px);
          overflow:hidden;
          border-radius:10px;
          margin-bottom:18px;
          background:#111;
        "
      >

        <img
          class="news-image"
          src="${escapeAttribute(image)}"
          alt="${escapeAttribute(article.title || "OINANCE News")}"
          loading="lazy"
          style="
            display:block;
            width:100%;
            height:100%;
            max-height:190px;
            object-fit:cover;
            object-position:center;
          "
        >

      </div>


      <div
        class="news-card-content"
        style="
          flex:1;
          display:flex;
          flex-direction:column;
        "
      >

        <div
          class="news-category"
          style="
            font-size:11px;
            font-weight:700;
            letter-spacing:2px;
            text-transform:uppercase;
            margin-bottom:10px;
          "
        >
          ${category}
        </div>


        <h3
          class="news-title"
          style="
            margin:0 0 12px;
            font-size:clamp(20px,2.5vw,28px);
            line-height:1.2;
            font-weight:800;
          "
        >
          ${title}
        </h3>


        <p
          class="news-preview"
          style="
            margin:0 0 16px;
            font-size:clamp(15px,1.7vw,17px);
            line-height:1.65;
          "
        >
          ${preview}
        </p>


        <div
          class="news-meta"
          style="
            margin-top:auto;
          "
        >
          <span>${author}</span>
          <span>${date}</span>
        </div>


        <div
          class="read-more"
          style="
            margin-top:12px;
          "
        >
          Read Article →
        </div>

      </div>

    </article>
  `;

}


/* =========================================================
   FEATURED NEWS
   ========================================================= */

async function loadFeaturedNews() {

  const featured =
    document.getElementById(
      "featuredNews"
    );

  if (!featured) return;


  try {

    const { data, error } =
      await supabaseClient
        .from("news")
        .select(
          "id,title,category,author,story,image_url,created_at"
        )
        .eq("published", true)
        .order("created_at", {
          ascending: false
        })
        .limit(1);


    if (error) {

      console.error(
        "Featured news error:",
        error
      );

      return;

    }


    if (!data || !data.length) {

      featured.innerHTML = "";

      return;

    }


    const article = data[0];


    const image =
      article.image_url ||
      "icon-512.png";


    featured.innerHTML = `

      <article
        class="featured-card"
        onclick="openArticle('${article.id}')"
      >

        <img
          src="${escapeAttribute(image)}"
          alt="${escapeAttribute(article.title || "OINANCE")}"
          loading="lazy"
        >

        <div class="featured-overlay">

          <span class="featured-category">
            ${escapeHTML(article.category || "News")}
          </span>

          <h2>
            ${escapeHTML(article.title || "")}
          </h2>

          <p>
            ${createPreview(
              article.story || "",
              220
            )}
          </p>

          <span class="featured-meta">
            ${escapeHTML(article.author || "OINANCE")}
            ·
            ${formatDate(article.created_at)}
          </span>

        </div>

      </article>

    `;

  } catch (error) {

    console.error(
      "Featured news unexpected error:",
      error
    );

  }

}


/* =========================================================
   HOMEPAGE NEWS SECTIONS
   ========================================================= */

function buildHomepageNewsSections(
  articles
) {

  if (!articles || !articles.length) {
    return;
  }


  buildLiveNews(articles);

  buildTopNews(articles);

  buildMostRead(articles);

  buildEditorialSection(
    "marketsNewsGrid",
    articles,
    [
      "markets",
      "market",
      "finance"
    ]
  );


  buildEditorialSection(
    "bitcoinNewsGrid",
    articles,
    [
      "bitcoin",
      "btc"
    ]
  );


  buildEditorialSection(
    "ethereumNewsGrid",
    articles,
    [
      "ethereum",
      "eth"
    ]
  );


  buildEditorialSection(
    "altcoinsNewsGrid",
    articles,
    [
      "altcoins",
      "altcoin",
      "crypto"
    ]
  );


  buildEditorialSection(
    "blockchainNewsGrid",
    articles,
    [
      "blockchain",
      "technology"
    ]
  );


  buildEditorialSection(
    "regulationNewsGrid",
    articles,
    [
      "regulation",
      "regulatory",
      "policy"
    ]
  );


  buildEditorialSection(
    "magazineNewsGrid",
    articles,
    [
      "magazine",
      "feature"
    ]
  );

}


/* =========================================================
   LIVE NEWS
   ========================================================= */

function buildLiveNews(articles) {

  const container =
    document.getElementById(
      "liveNewsList"
    );

  if (!container) return;


  const items =
    articles.slice(0, 8);


  container.innerHTML =
    items
      .map(article =>
        createCompactNewsItem(article)
      )
      .join("");

}


/* =========================================================
   TOP NEWS
   ========================================================= */

function buildTopNews(articles) {

  const container =
    document.getElementById(
      "topNewsGrid"
    );

  if (!container) return;


  const items =
    articles.slice(0, 6);


  container.innerHTML =
    items
      .map(article =>
        createEditorialCard(article)
      )
      .join("");

}


/* =========================================================
   MOST READ
   ========================================================= */

function buildMostRead(articles) {

  const container =
    document.getElementById(
      "mostReadList"
    );

  if (!container) return;


  const items =
    articles.slice(0, 7);


  container.innerHTML =
    items
      .map((article, index) => {

        return `

          <article
            class="most-read-item"
            onclick="openArticle('${article.id}')"
          >

            <span class="most-read-number">
              ${String(index + 1).padStart(2, "0")}
            </span>

            <div>

              <span class="most-read-category">
                ${escapeHTML(
                  article.category || "News"
                )}
              </span>

              <h3>
                ${escapeHTML(
                  article.title || ""
                )}
              </h3>

            </div>

          </article>

        `;

      })
      .join("");

}


/* =========================================================
   EDITORIAL SECTION
   ========================================================= */

function buildEditorialSection(
  elementId,
  articles,
  categories
) {

  const container =
    document.getElementById(
      elementId
    );

  if (!container) return;


  const filtered =
    articles.filter(article => {

      const category =
        String(
          article.category || ""
        ).toLowerCase();


      return categories.some(
        value =>
          category.includes(
            value.toLowerCase()
          )
      );

    });


  const items =
    filtered.length
      ? filtered.slice(0, 4)
      : articles.slice(0, 4);


  container.innerHTML =
    items
      .map(article =>
        createEditorialCard(article)
      )
      .join("");

}


/* =========================================================
   EDITORIAL CARD
   ========================================================= */

function createEditorialCard(article) {

  const image =
    article.image_url ||
    "icon-512.png";


  const title =
    escapeHTML(
      article.title || "Untitled article"
    );


  const category =
    escapeHTML(
      article.category || "News"
    );


  const preview =
    createPreview(
      article.story || "",
      120
    );


  return `

    <article
      class="editorial-news-card"
      onclick="openArticle('${article.id}')"
      style="
        width:100%;
        overflow:hidden;
      "
    >

      <div
        class="editorial-card-image-wrap"
        style="
          width:100%;
          height:180px;
          overflow:hidden;
          border-radius:10px;
          background:#111;
          margin-bottom:15px;
        "
      >

        <img
          class="editorial-card-image"
          src="${escapeAttribute(image)}"
          alt="${escapeAttribute(article.title || "OINANCE News")}"
          loading="lazy"
          style="
            display:block;
            width:100%;
            height:180px;
            max-height:180px;
            object-fit:cover;
            object-position:center;
          "
        >

      </div>


      <div
        class="editorial-card-body"
      >

        <div
          class="editorial-card-category"
        >
          ${category}
        </div>


        <h3
          class="editorial-card-title"
          style="
            margin:0 0 10px;
            font-size:clamp(19px,2.2vw,25px);
            line-height:1.25;
            font-weight:800;
          "
        >
          ${title}
        </h3>


        <p
          class="editorial-card-preview"
          style="
            margin:0;
            font-size:15px;
            line-height:1.6;
          "
        >
          ${preview}
        </p>


        <div
          class="editorial-card-meta"
        >
          ${formatDate(article.created_at)}
        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   COMPACT NEWS ITEM
   ========================================================= */

function createCompactNewsItem(article) {

  return `

    <article
      class="compact-news-item"
      onclick="openArticle('${article.id}')"
    >

      <div class="compact-news-time">
        ${formatDate(article.created_at)}
      </div>

      <div class="compact-news-content">

        <span>
          ${escapeHTML(
            article.category || "News"
          )}
        </span>

        <h3>
          ${escapeHTML(
            article.title || ""
          )}
        </h3>

      </div>

    </article>

  `;

}


/* =========================================================
   OPEN ARTICLE
   ========================================================= */

function openArticle(id) {

  if (!id) return;


  window.location.href =
    `article.html?id=${encodeURIComponent(id)}`;

}


/* =========================================================
   MARKET DATA
   ========================================================= */

async function loadMarketData() {

  try {

    const ids =
      Object.values(MARKET_ASSETS)
        .map(asset => asset.id)
        .join(",");


    const url =
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "CoinGecko request failed"
      );

    }


    const data =
      await response.json();


    Object.values(MARKET_ASSETS)
      .forEach(asset => {

        const coin =
          data[asset.id];


        if (!coin) return;


        const price =
          coin.usd;


        const change =
          coin.usd_24h_change;


        updateMarketAsset(
          asset,
          price,
          change
        );

      });


  } catch (error) {

    console.error(
      "Market data error:",
      error
    );

  }

}


/* =========================================================
   UPDATE MARKET ASSET
   ========================================================= */

function updateMarketAsset(
  asset,
  price,
  change
) {

  const formattedPrice =
    formatCurrency(price);


  const formattedChange =
    formatPercentage(change);


  const priceElements = [

    asset.priceId,

    asset.tickerPriceId,

    asset.livePriceId,

    asset.marketPriceId

  ];


  priceElements.forEach(id => {

    if (!id) return;


    const element =
      document.getElementById(id);


    if (element) {

      element.textContent =
        formattedPrice;

    }

  });


  const changeElements = [

    asset.changeId,

    asset.tickerChangeId,

    asset.liveChangeId

  ];


  changeElements.forEach(id => {

    if (!id) return;


    const element =
      document.getElementById(id);


    if (element) {

      element.textContent =
        formattedChange;


      element.classList.remove(
        "positive",
        "negative"
      );


      if (change >= 0) {

        element.classList.add(
          "positive"
        );

      } else {

        element.classList.add(
          "negative"
        );

      }

    }

  });

}


/* =========================================================
   MARKET FORMATTING
   ========================================================= */

function formatCurrency(value) {

  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {

    return "—";

  }


  const number =
    Number(value);


  if (number >= 1000) {

    return number.toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }
    );

  }


  if (number >= 1) {

    return number.toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

  }


  return number.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 6
    }
  );

}


function formatPercentage(value) {

  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {

    return "—";

  }


  const number =
    Number(value);


  const sign =
    number >= 0
      ? "+"
      : "";


  return `${sign}${number.toFixed(2)}%`;

}


/* =========================================================
   MARKET STATS STYLE
   ========================================================= */

function setupMarketStatsStyle() {

  document
    .querySelectorAll(
      ".market-change, .ticker-change, .live-change"
    )
    .forEach(element => {

      const value =
        parseFloat(
          element.textContent
        );


      if (!Number.isNaN(value)) {

        if (value >= 0) {

          element.classList.add(
            "positive"
          );

        } else {

          element.classList.add(
            "negative"
          );

        }

      }

    });

}


/* =========================================================
   LIVE MARKET TICKER
   ========================================================= */

function setupLiveTicker() {

  const track =
    document.querySelector(
      ".ticker-track"
    );


  if (!track) return;


  if (
    track.dataset.duplicated === "true"
  ) {

    return;

  }


  const original =
    track.innerHTML;


  track.innerHTML =
    original + original;


  track.dataset.duplicated =
    "true";

}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function setupNewsletter() {

  const form =
    document.getElementById(
      "newsletterForm"
    );


  const emailInput =
    document.getElementById(
      "newsletterEmail"
    );


  const message =
    document.getElementById(
      "newsletterMessage"
    );


  if (!form || !emailInput) {
    return;
  }


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const email =
        emailInput.value
          .trim()
          .toLowerCase();


      if (!email) {

        if (message) {

          message.textContent =
            "Please enter your email.";

        }

        return;

      }


      try {

        const { error } =
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

          if (
            String(error.message)
              .toLowerCase()
              .includes("duplicate")
          ) {

            if (message) {

              message.textContent =
                "You are already subscribed.";

            }

            return;

          }


          throw error;

        }


        if (message) {

          message.textContent =
            "You are now subscribed to OINANCE.";

        }


        form.reset();


      } catch (error) {

        console.error(
          "Newsletter error:",
          error
        );


        if (message) {

          message.textContent =
            "Something went wrong. Please try again.";

        }

      }

    }
  );

}


/* =========================================================
   PRODUCT PROTECTION
   ========================================================= */

function setupProductProtection() {

  const modal =
    document.getElementById(
      "productLoginModal"
    );


  const closeButton =
    document.getElementById(
      "closeProductLogin"
    );


  const form =
    document.getElementById(
      "productLoginForm"
    );


  const emailInput =
    document.getElementById(
      "productLoginEmail"
    );


  const passwordInput =
    document.getElementById(
      "productLoginPassword"
    );


  const errorMessage =
    document.getElementById(
      "productLoginError"
    );


  if (!modal) return;


  let pendingProductUrl =
    null;


  let pendingProductName =
    null;


  document
    .querySelectorAll(
      ".product-protected"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        async event => {

          event.preventDefault();


          pendingProductUrl =
            link.dataset.productUrl ||
            link.getAttribute("href");


          pendingProductName =
            link.dataset.productName ||
            "OINANCE Product";


          try {

            const {
              data
            } =
              await supabaseClient
                .auth
                .getSession();


            if (
              data &&
              data.session
            ) {

              window.location.href =
                pendingProductUrl;

              return;

            }


            modal.setAttribute(
              "aria-hidden",
              "false"
            );


            if (errorMessage) {

              errorMessage.textContent =
                "";

            }


            if (emailInput) {

              emailInput.focus();

            }


          } catch (error) {

            console.error(
              "Product session error:",
              error
            );


            modal.setAttribute(
              "aria-hidden",
              "false"
            );

          }

        }
      );

    });


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      () => {

        closeProductModal();

      }
    );

  }


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeProductModal();

      }

    }
  );


  if (form) {

    form.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        if (errorMessage) {

          errorMessage.textContent =
            "";

        }


        const email =
          emailInput
            ? emailInput.value.trim()
            : "";


        const password =
          passwordInput
            ? passwordInput.value
            : "";


        if (!email || !password) {

          if (errorMessage) {

            errorMessage.textContent =
              "Enter your email and password.";

          }

          return;

        }


        try {

          const {
            data,
            error
          } =
            await supabaseClient
              .auth
              .signInWithPassword({
                email,
                password
              });


          if (error) {

            throw error;

          }


          if (
            data &&
            data.session &&
            pendingProductUrl
          ) {

            window.location.href =
              pendingProductUrl;

          }

        } catch (error) {

          console.error(
            "Product login error:",
            error
          );


          if (errorMessage) {

            errorMessage.textContent =
              "Login failed. Please check your email and password.";

          }

        }

      }
    );

  }


  const signupButton =
    document.getElementById(
      "productSignupButton"
    );


  if (signupButton) {

    signupButton.addEventListener(
      "click",
      async () => {

        const email =
          emailInput
            ? emailInput.value.trim()
            : "";


        const password =
          passwordInput
            ? passwordInput.value
            : "";


        if (!email || !password) {

          if (errorMessage) {

            errorMessage.textContent =
              "Enter an email and password first.";

          }

          return;

        }


        try {

          const {
            error
          } =
            await supabaseClient
              .auth
              .signUp({
                email,
                password
              });


          if (error) {

            throw error;

          }


          if (errorMessage) {

            errorMessage.textContent =
              "Account created. You can now sign in.";

          }

        } catch (error) {

          console.error(
            "Product signup error:",
            error
          );


          if (errorMessage) {

            errorMessage.textContent =
              error.message ||
              "Could not create account.";

          }

        }

      }
    );

  }


  function closeProductModal() {

    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    if (errorMessage) {

      errorMessage.textContent =
        "";

    }

  }

}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


/* =========================================================
   ARTICLE PREVIEW
   ========================================================= */

function createPreview(
  text,
  maxLength = 160
) {

  let clean =
    String(text || "");


  clean =
    clean.replace(
      /<[^>]*>/g,
      " "
    );


  clean =
    clean.replace(
      /\s+/g,
      " "
    )
    .trim();


  if (
    clean.length <= maxLength
  ) {

    return escapeHTML(clean);

  }


  return (
    escapeHTML(
      clean.slice(
        0,
        maxLength
      )
    )
    + "..."
  );

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateValue) {

  if (!dateValue) {
    return "";
  }


  const date =
    new Date(dateValue);


  if (Number.isNaN(date.getTime())) {
    return "";
  }


  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}


/* =========================================================
   SERVICE WORKER
   ========================================================= */

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
          registration => {

            console.log(
              "OINANCE service worker registered:",
              registration.scope
            );

          }
        )
        .catch(error => {

          console.error(
            "Service worker registration failed:",
            error
          );

        });

    }
  );

}


/* =========================================================
   SPLASH SCREEN
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    const splash =
      document.getElementById(
        "oinanceSplash"
      );


    if (!splash) return;


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
