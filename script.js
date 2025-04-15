document.addEventListener("DOMContentLoaded", () => {
  // Filtrado de contactos
  const rows = document.querySelectorAll("#contact-table tbody tr");
  document.getElementById("filter-name").addEventListener("input", function () {
    filterTable(0, this.value.toLowerCase());
  });
  document.getElementById("filter-role").addEventListener("input", function () {
    filterTable(3, this.value.toLowerCase());
  });
  document.getElementById("filter-location").addEventListener("input", function () {
    filterTable(4, this.value.toLowerCase());
  });

  function filterTable(index, value) {
    rows.forEach(row => {
      const cell = row.cells[index]?.textContent.toLowerCase() || "";
      row.style.display = cell.includes(value) ? "" : "none";
    });
  }

  // Admin Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;
      if (user === "adminfrior" && pass === "frior2025") {
        window.location.href = "admin.html";
      } else {
        alert("Credenciales incorrectas.");
      }
    });
  }

  // Agregar nuevo contacto (Admin)
  const newContactForm = document.getElementById("new-contact-form");
  if (newContactForm) {
    newContactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = this.querySelector('input[type="text"]:nth-child(1)').value;
      const phone = this.querySelector('input[type="text"]:nth-child(2)').value;
      const email = this.querySelector('input[type="email"]:nth-child(3)').value;
      const role = this.querySelector('input[type="text"]:nth-child(4)').value;
      const location = this.querySelector('input[type="text"]:nth-child(5)').value;

      // Crear una nueva fila para la tabla
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${name}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>${location}</td>
        <td>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        </td>
      `;
      document.querySelector("#admin-table tbody").appendChild(row);

      // Agregar funcionalidad de editar y eliminar
      addEditDeleteFunctionality(row);
      this.reset();
    });
  }

  // Función de edición y eliminación de contactos
  function addEditDeleteFunctionality(row) {
    const editButton = row.querySelector(".edit-btn");
    const deleteButton = row.querySelector(".delete-btn");

    editButton.addEventListener("click", () => {
      const cells = row.querySelectorAll("td");
      cells[0].innerHTML = prompt("Nuevo nombre:", cells[0].textContent) || cells[0].textContent;
      cells[1].innerHTML = prompt("Nuevo teléfono:", cells[1].textContent) || cells[1].textContent;
      cells[2].innerHTML = prompt("Nuevo correo:", cells[2].textContent) || cells[2].textContent;
      cells[3].innerHTML = prompt("Nuevo cargo:", cells[3].textContent) || cells[3].textContent;
      cells[4].innerHTML = prompt("Nueva ubicación:", cells[4].textContent) || cells[4].textContent;
    });

    deleteButton.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
        row.remove();
      }
    });
  }

  // Importar contactos desde un archivo Excel (Admin)
  const importExcelInput = document.getElementById("import-excel");
  if (importExcelInput) {
    importExcelInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const contacts = XLSX.utils.sheet_to_json(sheet);
        
        // Agregar contactos a la tabla
        contacts.forEach(contact => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${contact.Nombre}</td>
            <td>${contact.Telefono}</td>
            <td>${contact.Correo}</td>
            <td>${contact.Cargo}</td>
            <td>${contact.Ubicacion}</td>
            <td>
              <button class="edit-btn">Editar</button>
              <button class="delete-btn">Eliminar</button>
            </td>
          `;
          document.querySelector("#admin-table tbody").appendChild(row);
          addEditDeleteFunctionality(row);
        });
      };
      reader.readAsBinaryString(file);
    });
  }

  // Subir logo desde archivo o URL
  const uploadLogo = document.getElementById("upload-logo");
  const logoUrlInput = document.getElementById("logo-url");

  if (uploadLogo && logoUrlInput) {
    uploadLogo.addEventListener("change", function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        const logo = document.createElement('img');
        logo.src = reader.result;
        document.querySelector("header").prepend(logo);
      };
      reader.readAsDataURL(file);
    });

    logoUrlInput.addEventListener("input", function (e) {
      const logoUrl = e.target.value;
      const logo = document.createElement('img');
      logo.src = logoUrl;
      document.querySelector("header").prepend(logo);
    });
  }
});
