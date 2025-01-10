document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById(
      "userName"
    ).textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userPhone").textContent = user.phone;
    document.getElementById("userSpeciality").textContent = user.speciality;

    // Fetch and display user bookings
    fetch(`/user_bookings/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("User bookings data:", data); // Log the data for debugging
        const bookingsList = document.getElementById("bookingsList");
        if (data.length === 0) {
          bookingsList.innerHTML = "<p>У вас нет записей на занятия.</p>";
          return;
        }

        data.forEach((booking) => {
          const bookingDiv = document.createElement("div");
          bookingDiv.classList.add("booking");
          bookingDiv.innerHTML = `
            <h3>${booking.class_name}</h3>
            <p>Дата: ${new Date(booking.beginAt).toLocaleString()}</p>
            <p>Зал: ${booking.hall_name}</p>
            <button class="cancelBookingButton button" data-booking-id="${
              booking.id
            }">Отменить запись</button>`;
          bookingsList.appendChild(bookingDiv);
        });

        document.querySelectorAll(".cancelBookingButton").forEach((button) => {
          button.addEventListener("click", function () {
            const bookingId = this.getAttribute("data-booking-id");

            fetch(`/cancel_booking/${bookingId}`, {
              method: "DELETE",
            })
              .then((response) => response.text())
              .then((message) => {
                alert(message);
                location.reload();
              })
              .catch((error) => {
                console.error("Error canceling booking:", error);
                alert("Ошибка при отмене записи. Попробуйте снова.");
              });
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching user bookings:", error);
      });
  } else {
    window.location.href = "login.html";
  }

  document
    .getElementById("deleteProfileButton")
    .addEventListener("click", function () {
      if (
        confirm(
          "Вы уверены, что хотите удалить свой профиль? Это действие нельзя отменить."
        )
      ) {
        fetch(`/delete_client/${user.id}`, {
          method: "DELETE",
        })
          .then((response) => response.text())
          .then((data) => {
            if (data === "Client deleted successfully") {
              Swal.fire({
                icon: "success",
                title: "Успех",
                text: "Профиль успешно удален.",
              }).then(() => {
                localStorage.removeItem("user");
                window.location.href = "index.html";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Ошибка",
                text: "Ошибка при удалении профиля. Попробуйте снова.",
              });
            }
          })
          .catch((error) => {
            console.error("Ошибка:", error);
            Swal.fire({
              icon: "error",
              title: "Ошибка",
              text: "Ошибка при удалении профиля. Попробуйте снова.",
            });
          });
      }
    });
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function showLoginForm() {
  window.location.href = "login.html";
}

function showAdminForm() {
  window.location.href = "admin.html";
}
