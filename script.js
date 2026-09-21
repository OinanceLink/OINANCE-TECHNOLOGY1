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


      if (!email || !password) {

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

if ("serviceWorker" in navigator) {

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
