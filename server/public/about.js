document.addEventListener("DOMContentLoaded", function () {
  // Fetch and display the list of trainers
  fetch("/trainers")
    .then((response) => response.json())
    .then((data) => {
      const trainersDiv = document.getElementById("trainers");
      data.forEach((trainer) => {
        const trainerDiv = document.createElement("div");
        trainerDiv.className = "trainer";
        trainerDiv.innerHTML = `
            <h3>${trainer.firstName} ${trainer.lastName}</h3>
            <p>Телефон: ${trainer.phone}</p>
            <p>Специальность: ${trainer.speciality}</p>
          `;
        trainersDiv.appendChild(trainerDiv);
      });
    })
    .catch((error) =>
      console.error("Ошибка получения списка тренеров:", error)
    );
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
