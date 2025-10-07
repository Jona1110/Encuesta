const form = document.getElementById("formEncuesta");
const btnResultados = document.getElementById("btnResultados");
const resultadosDiv = document.getElementById("resultados");
const tablaResultados = document.getElementById("tablaResultados");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const respuestas = {};
  new FormData(form).forEach((valor, clave) => respuestas[clave] = valor);

  try {
    const res = await fetch("http://localhost:3000/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(respuestas),
    });
    const data = await res.json();
    alert(data.mensaje);
    form.reset();
  } catch (err) {
    alert("❌ Error al enviar la respuesta");
  }
});

btnResultados.addEventListener("click", async () => {
  const user = prompt("Usuario:");
  const pass = prompt("Contraseña:");

  try {
    const res = await fetch(`http://localhost:3000/resultados?user=${user}&pass=${pass}`);
    if (res.status === 401) return alert("Acceso denegado ❌");
    const respuestas = await res.json();

    const totales = {};
    respuestas.forEach(r => {
      for (const [p, v] of Object.entries(r)) {
        if (!totales[p]) totales[p] = { "Sí": 0, "No": 0 };
        if (v === "Sí") totales[p]["Sí"]++;
        else if (v === "No") totales[p]["No"]++;
      }
    });

    let html = "<table><tr><th>Pregunta</th><th>Sí</th><th>No</th></tr>";
    Object.entries(totales).forEach(([p, val]) => {
      html += `<tr><td>${p}</td><td>${val["Sí"]}</td><td>${val["No"]}</td></tr>`;
    });
    html += "</table>";

    resultadosDiv.classList.remove("oculto");
    tablaResultados.innerHTML = html;

  } catch (err) {
    alert("Error obteniendo resultados");
  }
});
