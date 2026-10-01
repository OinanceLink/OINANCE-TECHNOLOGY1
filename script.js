===================== */

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
