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


            loadArticles();

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


      const {
        data,
        error
      } =
        await supabaseClient
          .from("news")
          .select(
            "id, title, category, author, created_at, image_url, image_urls"
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


        return;

      }


      if (
        !data ||
        data.length === 0
      ) {

        articlesList.innerHTML =
          `
          <div class="empty-state">
            No published articles yet.
          </div>
          `;


        return;

      }


      articlesList.innerHTML =
        "";


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
       DELETE ARTICLE
    ========================================= */

    async function deleteArticle(
      
