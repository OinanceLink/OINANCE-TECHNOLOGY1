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
   MARKET DATA + REAL CHARTS
================================================== */

async function loadMarketData() {

  try {

    const response =
      await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd&include_24hr_change=true"
      );


    if (!response.ok) {
      throw new Error(
        "Market API request failed"
      );
    }


    const data =
      await response.json();


    /* ==================================================
       BTC
    ================================================== */

    if (data.bitcoin) {

      updateMarketAsset(
        "btc",
        data.bitcoin.usd,
        data.bitcoin.usd_24h_change
      );

    }


    /* ==================================================
       ETH
    ================================================== */

    if (data.ethereum) {

      updateMarketAsset(
        "eth",
        data.ethereum.usd,
        data.ethereum.usd_24h_change
      );

    }


    /* ==================================================
       SOL
    ================================================== */

    if (data.solana) {

      updateMarketAsset(
        "sol",
        data.solana.usd,
        data.solana.usd_24h_change
      );

    }


    /* ==================================================
       BNB
    ================================================== */

    if (data.binancecoin) {

      updateMarketAsset(
        "bnb",
        data.binancecoin.usd,
        data.binancecoin.usd_24h_change
      );

    }


    /* ==================================================
       CREATE REAL CHARTS
    ================================================== */

    createMarketChart(
      "btcChart",
      data.bitcoin?.usd_24h_change || 0
    );

    createMarketChart(
      "ethChart",
      data.ethereum?.usd_24h_change || 0
    );

    createMarketChart(
      "solChart",
      data.solana?.usd_24h_change || 0
    );

    createMarketChart(
      "bnbChart",
      data.binancecoin?.usd_24h_change || 0
    );


  } catch (error) {

    console.error(
      "OINANCE market data error:",
      error
    );

  }

}


/* ==================================================
   UPDATE MARKET ASSET
================================================== */

function updateMarketAsset(
  symbol,
  price,
  change
) {

  const tickerPrice =
    document.getElementById(
      symbol + "Price"
    );


  const tickerChange =
    document.getElementById(
      symbol + "Change"
    );


  const marketPrice =
    document.getElementById(
      "market" +
      symbol.charAt(0).toUpperCase() +
      symbol.slice(1)
    );


  const marketChange =
    document.getElementById(
      "market" +
      symbol.charAt(0).toUpperCase() +
      symbol.slice(1) +
      "Change"
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
