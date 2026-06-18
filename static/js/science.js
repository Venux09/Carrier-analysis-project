// Science page logic: loads science_data.json, renders charts via CodexCharts helpers.

(function () {
  const ACCENT = "#1a6b6b";
  const MIST = "#d4cfc7";
  const INK = "#1a1a1a";

  let careerChart = null;
  let data = null;

  fetch("/static/data/science_data.json")
    .then((res) => res.json())
    .then((json) => {
      data = json;
      renderCountryChart();
      renderSalaryChart();
      renderCareerChart("pcb");
      renderSaturationInsights();
      renderScatterCharts();
      renderClosingQuote();
    })
    .catch((err) => console.error("Failed to load science data:", err));

  function renderCountryChart() {
    const ctx = document.getElementById("countryChart");
    const labels = data.countryFlexibility.map((d) => d.name);
    const values = data.countryFlexibility.map((d) => d.value);
    const colors = data.countryFlexibility.map((d) =>
      d.name.startsWith("India") ? "#8b2635" : ACCENT
    );
    CodexCharts.donut(ctx, { labels, data: values, colors, accent: ACCENT });
  }

  function renderSalaryChart() {
    const ctx = document.getElementById("salaryChart");
    const labels = data.salaryByStream.map((d) => d.name);
    CodexCharts.groupedBar(ctx, {
      labels,
      yLabel: "₹ LPA",
      accent: ACCENT,
      datasets: [
        { label: "Minimum", data: data.salaryByStream.map((d) => d.min), backgroundColor: MIST },
        { label: "Mid-career avg", data: data.salaryByStream.map((d) => d.mid), backgroundColor: ACCENT },
        { label: "Peak potential", data: data.salaryByStream.map((d) => d.max), backgroundColor: INK },
      ],
    });
  }

  function renderCareerChart(which) {
    const careers = which === "pcb" ? data.pcbCareers : data.pcmCareers;
    const ctx = document.getElementById("careerChart");
    const title = document.getElementById("careerChartTitle");
    title.textContent = which === "pcb"
      ? "PCB career paths — current vs projected"
      : "PCM career paths — current vs projected";

    if (careerChart) careerChart.destroy();
    careerChart = CodexCharts.horizontalBar(ctx, {
      labels: careers.map((c) => c.name),
      xLabel: "₹ LPA",
      accent: ACCENT,
      datasets: [
        { label: "Current", data: careers.map((c) => c.current), backgroundColor: MIST },
        { label: "Projected", data: careers.map((c) => c.future), backgroundColor: ACCENT },
      ],
    });
  }

  function renderSaturationInsights() {
    const container = document.getElementById("saturationInsights");
    container.innerHTML = data.saturationInsights
      .map(
        (text) => `
        <div class="insight-item">
          <div class="insight-dot" style="background: ${ACCENT};"></div>
          <div class="insight-text">${text}</div>
        </div>`
      )
      .join("");
  }

  function renderScatterCharts() {
    const a = data.polymathComparison.normalStudent.scatter;
    const b = data.polymathComparison.awareStudent.scatter;

    CodexCharts.scatter(document.getElementById("scatterA"), {
      accent: "#a39c8f",
      datasets: [{ data: a, backgroundColor: "#a39c8f" }],
    });
    CodexCharts.scatter(document.getElementById("scatterB"), {
      accent: ACCENT,
      datasets: [{ data: b, backgroundColor: ACCENT }],
    });
  }

  function renderClosingQuote() {
    document.getElementById("closingQuote").innerHTML =
      `<p>"${data.closingQuote}"</p>`;
  }

  // Toggle buttons
  document.addEventListener("DOMContentLoaded", () => {
    const btnPCB = document.getElementById("btnPCB");
    const btnPCM = document.getElementById("btnPCM");

    btnPCB.addEventListener("click", () => {
      btnPCB.classList.add("active");
      btnPCB.style.background = ACCENT;
      btnPCB.style.borderColor = ACCENT;
      btnPCM.classList.remove("active");
      btnPCM.style.background = "transparent";
      btnPCM.style.borderColor = "var(--border)";
      renderCareerChart("pcb");
    });

    btnPCM.addEventListener("click", () => {
      btnPCM.classList.add("active");
      btnPCM.style.background = ACCENT;
      btnPCM.style.borderColor = ACCENT;
      btnPCB.classList.remove("active");
      btnPCB.style.background = "transparent";
      btnPCB.style.borderColor = "var(--border)";
      renderCareerChart("pcm");
    });
  });
})();