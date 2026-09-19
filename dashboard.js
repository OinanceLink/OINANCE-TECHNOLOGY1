/* =========================================
   OINANCE LINK
   DASHBOARD + SUPABASE
   MULTI-IMAGE NEWS SYSTEM
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================================
   PAGE START
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    const loginScreen =
      document.getElementById("loginScreen");

    const dashboardApp =
      document.getElementById("dashboardApp");

    const loginForm =
      document.getElementById("loginForm");

    const loginMessage =
      document.getElementById("loginMessage");


    if (dashboardApp) {

      dashboardApp.style.display =
        "none";

    }


    /* =========================================
       CHECK LOGIN
    ========================================= */

    const {
      data: { session }
    } =
      await supabaseClient.auth.getSession();


    if (session) {

      showDashboard();

    } else {

      showLogin();

    }


    /* =========================================
       LOGIN
    ========================================= */

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          const email =
            document
              .getElementById("loginEmail")
              .value
              .trim();


          const password =
            document
              .getElementById("loginPassword")
              .value;


          loginMessage.textContent =
            "Signing in...";


          const { error } =
            await supabaseClient.auth.signInWithPassword({

              email: email,

              password: password

            });


          if (error) {

            loginMessage.textContent =
              "Login failed: " +
              error.message;

            return;

          }


          loginMessage.textContent =
            "Login successful.";


          showDashboard();

        }
      );

    }


    /* =========================================
       SHOW LOGIN
    ========================================= */

    function showLogin() {

      if (loginScreen) {

        loginScreen.style.display =
          "flex";

      }


      if (dashboardApp) {

        dashboardApp.style.display =
          "none";

      }

    }


    /* =========================================
       SHOW DASHBOARD
    ========================================= */

    function showDashboard() {

      if (loginScreen) {

        loginScreen.style.display =
          "none";

      }


      if (dashboardApp) {

        dashboardApp.style.display =
          "block";

      }


      startDashboard();

    }


    /* =========================================
       START DASHBOARD
    ========================================= */

    function startDashboard() {

      const newArticleButton =
        document.getElementById(
          "newArticleButton"
        );


      const cancelButton =
        document.getElementById(
          "cancelButton"
        );


      const articleEditor =
        document.getElementById(
          "articleEditor"
        );


      const articleForm =
        document.getElementById(
          "articleForm"
        );


      const articleImage =
        document.getElementById(
          "articleImage"
        );


      const imagePreview =
        document.getElementById(
          "imagePreview"
        );


      /* =========================================
         ENABLE MULTIPLE IMAGES
      ========================================= */

      if (articleImage) {

        articleImage.setAttribute(
          "multiple",
          "multiple"
        );


        articleImage.setAttribute(
          "accept",
          "image/*"
        );

      }


      /* =========================================
         NEW ARTICLE
      ========================================= */

      if (newArticleButton) {

        newArticleButton.onclick =
          function () {

            articleEditor.classList.add(
              "show"
            );


            articleEditor.scrollIntoView({
              behavior: "smooth"
            });

          };

      }


      /* =========================================
         CANCEL
      ========================================= */

      if (cancelButton) {

        cancelButton.onclick =
          function () {

            articleEditor.classList.remove(
              "show"
            );


            if (articleForm) {

              articleForm.reset();

            }


            if (imagePreview) {

              imagePreview.innerHTML =
                "";

            }

          };

      }


      /* =========================================
         IMAGE PREVIEW
      ========================================= */

      if (articleImage) {

        articleImage.onchange =
          function () {

            const files =
              Array.from(
                articleImage.files
              );


            if (!files.length) {

              imagePreview.innerHTML =
                "";

              return;

            }


            /* Maximum 3 pictures */

            if (files.length > 3) {

              alert(
                "You can upload a maximum of 3 pictures per article."
              );


              articleImage.value =
                "";


              imagePreview.innerHTML =
                "";


              return;

            }


            imagePreview.innerHTML =
              "";


            files.forEach(
              function (file, index) {

                if (
                  !file.type.startsWith(
                    "image/"
                  )
                ) {

                  return;

                }


                const wrapper =
                  document.createElement(
                    "div"
                  );


                wrapper.className =
                  "dashboard-image-preview";


                const image =
                  document.createElement(
                    "img"
                  );


                image.src =
                  URL.createObjectURL(
                    file
                  );


                image.alt =
                  "Article picture " +
                  (index + 1);


                wrapper.appendChild(
                  image
                );


                const label =
                  document.createElement(
                    "span"
                  );


                label.textContent =
                  "Picture " +
                  (index + 1);


                wrapper.appendChild(
                  label
                );


                imagePreview.appendChild(
                  wrapper
                );

              }
            );

          };

      }


      /* =========================================
         PUBLISH ARTICLE
      ========================================= */

      if (articleForm) {

        articleForm.onsubmit =
          async function (event) {

            event.preventDefault();


            const {
              data: { session }
            } =
              await supabaseClient.auth.getSession();


            if (!session) {

              alert(
                "Please sign in first."
              );


              showLogin();


              return;

            }


            /* =========================================
               GET ARTICLE DATA
            ========================================= */

            const title =
              document
                .getElementById(
                  "articleTitle"
                )
                .value
                .trim();


            const category =
              document
                .getElementById(
                  "articleCategory"
                )
                .value;


            const author =
              document
                .getElementById(
                  "articleAuthor"
                )
                .value
                .trim();


            const story =
              document
                .getElementById(
                  "articleStory"
                )
                .value
                .trim();


            const files =
              Array.from(
                articleImage.files
              );


            /* =========================================
               VALIDATION
            ========================================= */

            if (!title || !story) {

              alert(
                "Please enter a headline and article."
              );


              return;

            }


            if (files.length > 3) {

              alert(
                "You can upload a maximum of 3 pictures."
              );


              return;

            }


            /* =========================================
               UPLOAD IMAGES
            ========================================= */

            let imageUrls = [];


            if (files.length) {

              for (
                let i = 0;
                i < files.length;
                i++
              ) {

                const file =
                  files[i];


                if (
                  !file.type.startsWith(
                    "image/"
                  )
                ) {

                  alert(
                    "One of the selected files is not an image."
                  );


                  return;

                }


                const fileExtension =
                  file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


                const fileName =
                  Date.now() +
                  "-" +
                  i +
                  "-" +
                  Math.random()
                    .toString(36)
                    .substring(2) +
                  "." +
                  fileExtension;


                const filePath =
                  fileName;


                const {
                  error: uploadError
                } =
                  await supabaseClient.storage
                    .from(
                      "article-images"
                    )
                    .upload(
                      filePath,
                      file
                    );


                if (uploadError) {

                  alert(
                    "Picture " +
                    (i + 1) +
                    " upload failed: " +
                    uploadError.message
                  );


                  return;

                }


                const {
                  data: publicData
                } =
                  supabaseClient.storage
                    .from(
                      "article-images"
                    )
                    .getPublicUrl(
                      filePath
                    );


                imageUrls.push(
                  publicData.publicUrl
                );

              }

            }


            /* =========================================
               MAIN IMAGE
            ========================================= */

            const mainImage =
              imageUrls.length
                ? imageUrls[0]
                : null;


            /* =========================================
               SAVE ARTICLE
            ========================================= */

            const {
              error: articleError
            } =
              await supabaseClient
                .from("news")
                .insert({

                  title: title,

                  category: category,

                  author:
                    author ||
                    "OINANCE Editorial",

                  story: story,

                  image_url:
                    mainImage,

                  image_urls:
                    imageUrls,

                  published: true

                });


            if (articleError) {

              console.error(
                "Article publishing error:",
                articleError
              );


              alert(
                "Article could not be published: " +
                articleError.message
              );


              return;

            }


            /* =========================================
               SUCCESS
            ========================================= */

            alert(
              "✓ Article published successfully!"
            );


            articleForm.reset();


            if (imagePreview) {

              imagePreview.innerHTML =
                "";

            }


            articleEditor.classList.remove(
              "show"
            );


            /* Refresh articles AND statistics */

            await loadArticles();

          };

      }


      /* =========================================
         LOAD ARTICLES
      ========================================= */

      loadArticles();

    }


    /* =========================================
       LOAD ARTICLES
    ========================================= */

    async function loadArticles() {

      const articlesList =
        document.getElementById(
          "articlesList"
        );


      if (!articlesList) {

        return;

      }


      articlesList.innerHTML =
        "<p>Loading articles...</p>";


      /* =========================================
         GET ARTICLES
      ========================================= */

      const {
        data,
        error
      } =
        await supabaseClient
          .from("news")
          .select(
            "id, title, category, author, created_at, image_url, image_urls, published"
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );


      if (error) {

        console.error(
          "Articles loading error:",
          error
        );


        articlesList.innerHTML =
          "<p>Could not load articles.</p>";


        updateDashboardStats(
          []
        );


        return;

      }


      /* =========================================
         UPDATE DASHBOARD NUMBERS
      ========================================= */

      updateDashboardStats(
        data || []
      );


      /* =========================================
         NO ARTICLES
      ========================================= */

      if (
        !data ||
        data.length === 0
      ) {

        articlesList.innerHTML =
          `
          <div class="empty-state">
            <strong>
              No published articles yet.
            </strong>

            <p>
              Your published OINANCE News
              articles will appear here.
            </p>
          </div>
          `;


        return;

      }


      articlesList.innerHTML =
        "";


      /* =========================================
         DISPLAY ARTICLES
      ========================================= */

      data.forEach(
        function (article) {

          const item =
            document.createElement(
              "div"
            );


          item.className =
            "dashboard-article";


          let thumbnails = "";


          /* =========================================
             ALL ARTICLE IMAGES
          ========================================= */

          let articleImages = [];


          if (
            Array.isArray(
              article.image_urls
            )
          ) {

            articleImages =
              article.image_urls;

          }


          /* Backward compatibility */

          if (
            !articleImages.length &&
            article.image_url
          ) {

            articleImages = [
              article.image_url
            ];

          }


          articleImages.forEach(
            function (imageUrl) {

              thumbnails += `

                <img
                  src="${escapeHTML(
                    imageUrl
                  )}"
                  alt=""
                  class="dashboard-article-image"
                >

              `;

            }
          );


          item.innerHTML = `

            <div class="dashboard-article-info">

              <div class="dashboard-article-images">

                ${thumbnails}

              </div>


              <div>

                <h3>
                  ${escapeHTML(
                    article.title
                  )}
                </h3>


                <p>
                  ${escapeHTML(
                    article.category ||
                    "OINANCE NEWS"
                  )}
                </p>


                <small>
                  ${
                    articleImages.length
                  }
                  ${
                    articleImages.length === 1
                      ? "picture"
                      : "pictures"
                  }
                </small>

              </div>

            </div>


            <button
              type="button"
              class="delete-article-button"
              data-id="${article.id}"
            >
              Delete
            </button>

          `;


          articlesList.appendChild(
            item
          );

        }
      );


      /* =========================================
         DELETE BUTTONS
      ========================================= */

      const deleteButtons =
        articlesList.querySelectorAll(
          ".delete-article-button"
        );


      deleteButtons.forEach(
        function (button) {

          button.addEventListener(
            "click",
            function () {

              deleteArticle(
                button.dataset.id
              );

            }
          );

        }
      );

    }


    /* =========================================
       DASHBOARD STATISTICS
    ========================================= */

    function updateDashboardStats(
      articles
    ) {

      const articleCount =
        document.getElementById(
          "articleCount"
        );


      const technologyCount =
        document.getElementById(
          "technologyCount"
        );


      const pictureCount =
        document.getElementById(
          "pictureCount"
        );


      /* =========================================
         PUBLISHED ARTICLES
      ========================================= */

      const publishedArticles =
        articles.filter(
          function (article) {

            return article.published === true;

          }
        );


      /* =========================================
         TECHNOLOGY STORIES
      ========================================= */

      const technologyArticles =
        publishedArticles.filter(
          function (article) {

            return (
              String(
                article.category || ""
              )
                .trim()
                .toLowerCase() ===
              "technology"
            );

          }
        );


      /* =========================================
         TOTAL PICTURES
      ========================================= */

      let totalPictures = 0;


      publishedArticles.forEach(
        function (article) {

          let images = [];


          /* New multi-image system */

          if (
            Array.isArray(
              article.image_urls
            )
          ) {

            images =
              article.image_urls;

          }


          /* Old single-image system */

          if (
            !images.length &&
            article.image_url
          ) {

            images = [
              article.image_url
            ];

          }


          totalPictures +=
            images.length;

        }
      );


      /* =========================================
         WRITE NUMBERS TO DASHBOARD
      ========================================= */

      if (articleCount) {

        articleCount.textContent =
          publishedArticles.length;

      }


      if (technologyCount) {

        technologyCount.textContent =
          technologyArticles.length;

      }


      if (pictureCount) {

        pictureCount.textContent =
          totalPictures;

      }

    }


    /* =========================================
       DELETE ARTICLE
    ========================================= */

    async function deleteArticle(
      articleId
    ) {

      const confirmed =
        confirm(
          "Are you sure you want to delete this article?"
        );


      if (!confirmed) {

        return;

      }


      const {
        error
      } =
        await supabaseClient
          .from("news")
          .delete()
          .eq(
            "id",
            articleId
          );


      if (error) {

        alert(
          "Article could not be deleted: " +
          error.message
        );


        console.error(
          "Delete error:",
          error
        );


        return;

      }


      alert(
        "✓ Article deleted successfully."
      );


      /* Refresh articles AND statistics */

      await loadArticles();

    }


    /* =========================================
       SECURITY
    ========================================= */

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

  }
);
