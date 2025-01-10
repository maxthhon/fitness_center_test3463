document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const registrationForm = document.getElementById("registrationForm");
  const registrationError = document.getElementById("registrationError");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "index.html";
          } else {
            loginError.textContent = "Неверные учетные данные.";
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          loginError.textContent = "Ошибка входа. Попробуйте снова.";
        });
    });
  }

  if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const surname = document.getElementById("surname").value;
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        registrationError.textContent = "Пароли не совпадают.";
        return;
      }

      fetch("/add_client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: name,
          lastName: surname,
          phone,
          email,
          password,
        }),
      })
        .then((response) => response.text())
        .then((message) => {
          Swal.fire({
            icon: "success",
            title: "Успех",
            text: message,
          }).then(() => {
            showLoginForm();
          });
        })
        .catch((error) => {
          console.error("Error registering client:", error);
          Swal.fire({
            icon: "error",
            title: "Ошибка",
            text: "Ошибка регистрации. Попробуйте снова.",
          });
        });
    });
  }
});
