older-image"></div>

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
