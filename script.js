/* =========================================================
   OINANCE LINK
   TECHNOLOGY & NEWS
   CLEAN JAVASCRIPT FOUNDATION
========================================================= */


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  setupMobileMenu();

  setupSearch();

  setupYear();

  loadMarketData();

  setupNewsletter();

});


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

  const menuButton = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuButton || !mobileMenu) {
    return;
  }


  menuButton.addEventListener("click", function (event) {

    event.preventDefault();

    const isOpen =
      mobileMenu.classList.contains("open");


    if (isOpen) {

      mobileMenu.classList.remove("open");

      menuButton.textContent = "☰";

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    } else {

      mobileMenu.classList.add("open");

      menuButton.textContent = "✕";

      menuButton.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  });


  /* Close menu after clicking a link */

  const menuLinks =
    mobileMenu.querySelectorAll("a");


  menuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

      mobileMenu.classList.remove("open");

      menuButton.textContent = "☰";

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

  const searchButton =
    document.getElementById("searchToggle");

  const searchPanel =
    document.getElementById("searchPanel");

  const searchClose =
    document.getElementById("searchClose");

  const searchInput =
    document.getElementById("searchInput");


  if (!searchButton || !searchPanel) {
    return;
  }


  /* Open search */

  searchButton.addEventListener("click", function () {

    searchPanel.classList.toggle("open");


    if (
      searchPanel.classList.contains("open")
      &&
      searchInput
    ) {

      setTimeout(function () {

        searchInput.focus();

      }, 100);

    }

  });


  /* Close search */

  if (searchClose) {

    searchClose.addEventListener(
      "click",
      function () {

        searchPanel.classList.remove("open");

      }
    );

  }


  /* Search input */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {

        performSearch(
          searchInput.value.trim()
        );

      }
    );

  }


  /* Escape key */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {

        searchPanel.classList.remove("open");

      }

    }
  );

}


/* =========================================================
   SEARCH FUNCTION
========================================================= */

function performSearch(query) {

  const newsCards =
    document.querySelectorAll(".news-card");


  if (!newsCards.length) {
    return;
  }


  const searchTerm =
    query.toLowerCase();


  newsCards.forEach(function (card) {

    const text =
      card.textContent.toLowerCase();


    if (!searchTerm) {

      card.style.display = "";

      return;

    }


    if (text.includes(searchTerm)) {

      card.style.display = "";

    } else {

      card.style.display = "none";

    }

  });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function setupYear() {

  const yearElement =
    document.getElementById("currentYear");


  if (!yearElement) {
    return;
  }


  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================================================
   MARKET DATA
========================================================= */

async function loadMarketData() {

  const ids =
    "bitcoin,ethereum,binancecoin,solana";


  try {

    const response =
      await fetch(
        "https://api.coingecko.com/api/v3/simple/price" +
        "?ids=" + ids +
        "&vs_currencies=usd" +
        "&include_24hr_change=true"
      );


    if (!response.ok) {

      throw new Error(
        "Market request failed"
      );

    }


    const data =
      await response.json();


    updateMarketAsset(
      data.bitcoin,
      "btcPrice",
      "btcChange"
    );


    updateMarketAsset(
      data.ethereum,
      "ethPrice",
      "ethChange"
    );


    updateMarketAsset(
      data.binancecoin,
      "bnbPrice",
      "bnbChange"
    );


    updateMarketAsset(
      data.solana,
      "solPrice",
      "solChange"
    );


  } catch (error) {

    console.error(
      "OINANCE market data error:",
      error
    );


    showMarketError(
      "btcPrice",
      "btcChange"
    );

    showMarketError(
      "ethPrice",
      "ethChange"
    );

    showMarketError(
      "bnbPrice",
      "bnbChange"
    );

    showMarketError(
      "solPrice",
      "solChange"
    );

  }

}


/* =========================================================
   UPDATE MARKET ASSET
========================================================= */

function updateMarketAsset(
  asset,
  priceId,
  changeId
) {

  const priceElement =
    document.getElementById(priceId);

  const changeElement =
    document.getElementById(changeId);


  if (!asset) {
    return;
  }


  if (priceElement) {

    priceElement.textContent =
      formatPrice(asset.usd);

  }


  if (changeElement) {

    const change =
      Number(asset.usd_24h_change || 0);


    const sign =
      change >= 0 ? "+" : "";


    changeElement.textContent =
      sign +
      change.toFixed(2) +
      "%";


    changeElement.classList.remove(
      "market-up",
      "market-down"
    );


    if (change >= 0) {

      changeElement.classList.add(
        "market-up"
      );

    } else {

      changeElement.classList.add(
        "market-down"
      );

    }

  }

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

  if (
    typeof price !== "number"
    ||
    !Number.isFinite(price)
  ) {

    return "--";

  }


  if (price >= 1000) {

    return "$" +
      price.toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );

  }


  if (price >= 1) {

    return "$" +
      price.toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );

  }


  return "$" +
    price.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      }
    );

}


/* =========================================================
   MARKET ERROR
========================================================= */

function showMarketError(
  priceId,
  changeId
) {

  const priceElement =
    document.getElementById(priceId);

  const changeElement =
    document.getElementById(changeId);


  if (priceElement) {

    priceElement.textContent =
      "--";

  }


  if (changeElement) {

    changeElement.textContent =
      "--";

  }

}


/* =========================================================
   REFRESH MARKET DATA
========================================================= */

setInterval(
  function () {

    loadMarketData();

  },
  60000
);


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


  if (!form || !emailInput) {
    return;
  }


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const email =
        emailInput.value.trim();


      if (!email) {
        return;
      }


      /*
        Supabase/newsletter storage
        will be added later.

        For now we simply confirm
        that the form is working.
      */

      alert(
        "Thank you for subscribing to OINANCE LINK."
      );


      emailInput.value = "";

    }
  );

}
