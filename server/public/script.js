document.addEventListener("DOMContentLoaded", function () {
  // Инициализация Flatpickr для выбора даты
  flatpickr("#dateSelect", {
    dateFormat: "Y-m-d",
  });

  // Загрузка списка тренеров
  fetch("/trainers")
    .then((response) => response.json())
    .then((data) => {
      const trainerSelect = document.getElementById("trainerSelect");
      data.forEach((trainer) => {
        const option = document.createElement("option");
        option.value = trainer.id;
        option.textContent = trainer.name;
        trainerSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching trainers:", error);
    });

  document
    .getElementById("showUpcomingButton")
    .addEventListener("click", function () {
      const trainerId = document.getElementById("trainerSelect").value;
      const date = document.getElementById("dateSelect").value;

      const queryParams = new URLSearchParams();
      if (trainerId) queryParams.append("trainerId", trainerId);
      if (date) queryParams.append("date", date);

      fetch(`/schedule?${queryParams.toString()}`)
        .then((response) => response.json())
        .then((data) => {
          const scheduleContainer =
            document.getElementById("scheduleContainer");
          scheduleContainer.innerHTML = "<h2>Расписание</h2>";

          if (data.length === 0) {
            scheduleContainer.innerHTML +=
              "<p>Нет занятий на выбранную дату и тренера.</p>";
            return;
          }

          data.forEach((item) => {
            const scheduleItem = document.createElement("div");
            scheduleItem.classList.add("schedule-item");
            scheduleItem.innerHTML = `
              <h3>${item.name}</h3>
              <p>Продолжительность: ${item.duration} часов</p>
              <p>Начало: ${new Date(item.beginAt).toLocaleString()}</p>
              <p>Цена: ${item.price} руб.</p>
              <p>Зал: ${item.hall_name}</p>
              <button class="bookButton" data-class-id="${
                item.id
              }">Записаться</button>`;
            scheduleContainer.appendChild(scheduleItem);
          });

          document.querySelectorAll(".bookButton").forEach((button) => {
            button.addEventListener("click", function () {
              const classId = this.getAttribute("data-class-id");
              const user = JSON.parse(localStorage.getItem("user"));
              const userId = user ? user.id : null;

              if (!userId) {
                Swal.fire({
                  icon: "warning",
                  title: "Внимание",
                  text: "Пожалуйста, войдите в систему, чтобы записаться на занятие.",
                });
                return;
              }

              fetch("/book", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ classId, userId }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(
                      "Ошибка записи на занятие. Попробуйте снова."
                    );
                  }
                  return response.text();
                })
                .then((message) => {
                  Swal.fire({
                    icon: "success",
                    title: "Успех",
                    text: message,
                  });
                })
                .catch((error) => {
                  console.error("Error booking class:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Ошибка",
                    text: "Ошибка записи на занятие. Попробуйте снова.",
                  });
                });
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
        });
    });
});
