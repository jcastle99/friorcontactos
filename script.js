let contacts = [];

document.getElementById("filterName").addEventListener("input", filterTable);
document.getElementById("filterLocation").addEventListener("input", filterTable);
document.getElementById("filterPosition").addEventListener("input", filterTable);
document.getElementById("admin-btn").onclick = () => {
    document.getElementById("adminModal").style.display = "block";
};
document.querySelector(".close").onclick = () => {
    document.getElementById("adminModal").style.display = "none";
};
document.getElementById("importExcel").addEventListener("change", handleFile);

function loginAdmin() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user === "adminfrior" && pass === "frior2025") {
        alert("Acceso concedido");
    } else {
        alert("Credenciales incorrectas");
    }
    document.getElementById("adminModal").style.display = "none";
}

function filterTable() {
    const name = document.getElementById("filterName").value.toLowerCase();
    const loc = document.getElementById("filterLocation").value.toLowerCase();
    const pos = document.getElementById("filterPosition").value.toLowerCase();
    renderTable(contacts.filter(c =>
        c.Nombre.toLowerCase().includes(name) &&
        c.Ubicacion.toLowerCase().includes(loc) &&
        c.Cargo.toLowerCase().includes(pos)
    ));
}

function renderTable(data) {
    const tbody = document.querySelector("#contactTable tbody");
    tbody.innerHTML = "";
    data.forEach(contact => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${contact.Nombre}</td>
            <td>${contact.Telefono}</td>
            <td>${contact.Correo}</td>
            <td>${contact.Cargo}</td>
            <td>${contact.Ubicacion}</td>
            <td>
                <a href="https://wa.me/?text=${encodeURIComponent('Contacto: ' + contact.Nombre + ', Tel: ' + contact.Telefono)}" target="_blank">WhatsApp</a> |
                <a href="mailto:?subject=Contacto FRIOR&body=${encodeURIComponent('Contacto: ' + contact.Nombre + '\nTel: ' + contact.Telefono)}">Gmail</a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        contacts = XLSX.utils.sheet_to_json(sheet);
        renderTable(contacts);
    };
    reader.readAsBinaryString(file);
}

function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(contacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contactos");
    XLSX.writeFile(wb, "contactos_frior.xlsx");
}
