
}


/* ==================================================
   MARKET DATA
   LIVE PRICE + REAL MARKET HISTORY
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


        const prices =
          coin.sparkline_in_7d &&
          Array.isArray(
            coin.sparkline_in_7d.price
          )
            ? coin.sparkline_in_7d.price
            : [];


        if (prices.length) {

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


  /*
     Keep the most recent portion of the
     market history so the mini chart
     stays clean on mobile and desktop.
  */

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


  /*
     Prevent a flat line when prices
     are extremely close together.
  */

  if (min === max) {

    min -= 1;
    max += 1;

  }


  const range =
    max - min;


  const points =
    values.map(
      function (value, index) {

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
        function (point, index) {

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


      <!-- subtle chart grid -->

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


      <!-- filled market area -->

      <path
        d="${areaPath}"
        fill="url(#${gradientId})"
        stroke="none"
      />


      <!-- real market price line -->

      <path
        d="${linePath}"
        fill="none"
        stroke="${chartColor}"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />


      <!-- latest price point -->

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

      ${escapeHTML(message)}

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

      const cha
