e;


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
