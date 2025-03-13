function switchTab(tab) {
    // Hide all form contents
    document.querySelectorAll(".form-content").forEach((content) => {
      content.classList.remove("active");
    });

    // Deactivate all tabs
    document.querySelectorAll(".tab").forEach((tabElement) => {
      tabElement.classList.remove("active");
    });

    // Activate selected tab and content
    document.getElementById(tab).classList.add("active");
    document
      .querySelector(`.tab:nth-child(${tab === "login" ? 1 : 2})`)
      .classList.add("active");
  }

  // Dialog functions
  function showDialog(title, message, type = "info") {
    document.getElementById("dialogTitle").textContent = title;

    // Format message if it's an object (for errors)
    if (typeof message === "object") {
      let formattedMessage = "";
      for (const key in message) {
        if (Array.isArray(message[key])) {
          formattedMessage += `<div class="dialog-error"><strong>${key}:</strong> ${message[
            key
          ].join(", ")}</div>`;
        } else {
          formattedMessage += `<div class="dialog-error"><strong>${key}:</strong> ${message[key]}</div>`;
        }
      }
      document.getElementById("dialogContent").innerHTML = formattedMessage;
    } else {
      // Simple message
      if (type === "success") {
        document.getElementById(
          "dialogContent"
        ).innerHTML = `<div class="dialog-success">${message}</div>`;
      } else if (type === "error") {
        document.getElementById(
          "dialogContent"
        ).innerHTML = `<div class="dialog-error">${message}</div>`;
      } else {
        document.getElementById("dialogContent").textContent = message;
      }
    }

    document.getElementById("dialogOverlay").classList.add("active");
  }

  function closeDialog() {
    document.getElementById("dialogOverlay").classList.remove("active");
  }

  // Function to get CSRF cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  // Form submission handlers
  document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      // Get CSRF token
      const csrftoken = getCookie('csrftoken');

      // Send login data to the backend
      fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || '',
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(JSON.stringify(data));
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Login successful:", data);
          showDialog(
            "Login Successful",
            "You have been logged in successfully!",
            "success"
          );
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = "user_dashboard.html";
          }, 1500);
        })
        .catch((error) => {
          console.error("Error:", error);
          try {
            const errorData = JSON.parse(error.message);
            showDialog("Login Failed", errorData, "error");
          } catch (e) {
            showDialog(
              "Login Failed",
              "Please check your credentials and try again.",
              "error"
            );
          }
        });
    });

  document
    .getElementById("register-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("register-username").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById(
        "register-confirm-password"
      ).value;

      // Validate passwords match
      if (password !== confirmPassword) {
        showDialog(
          "Registration Error",
          "Passwords do not match!",
          "error"
        );
        return;
      }

      // Get CSRF token
      const csrftoken = getCookie('csrftoken');

      // Send registration data to the backend
      fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || '',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password2: confirmPassword,
        }),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(JSON.stringify(data));
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Registration successful:", data);
          showDialog(
            "Registration Successful",
            "Your account has been created successfully! Please login.",
            "success"
          );
          // Switch to login tab after dialog is closed
          document.querySelector(".dialog-btn").addEventListener(
            "click",
            function () {
              switchTab("login");
            },
            { once: true }
          );
        })
        .catch((error) => {
          console.error("Error:", error);
          try {
            const errorData = JSON.parse(error.message);
            showDialog("Registration Failed", errorData, "error");
          } catch (e) {
            showDialog(
              "Registration Failed",
              "Please try again later.",
              "error"
            );
          }
        });
    });