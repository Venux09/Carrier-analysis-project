// Arts page — loads arts_data.json, renders all charts + dynamic content.

(function () {
  const ACCENT = "#8b2635";
  const MIST = "#d4cfc7";
  const INK = "#1a1a1a";

  fetch("/static/data/arts_data.json")
    .then((r) => r.json())
    .then((data) => {
      renderReasonsChart(data);
      renderChoiceInsights(data);
      renderMyths(data);
      renderModernScoreChart(data);
      renderModernCareerCards(data);
      renderTradScoreChart(data);
      renderTradCareerCards(data);
      renderConclusion(data);
    })
    .catch((e) => console.error("Failed to load arts data:", e));

  function renderReasonsChart(data) {
    const ctx = document.getElementById("reasonsChart");
    CodexCharts.donut(ctx, {
      labels: data.whyChooseReasons.map((d) => d.category),
      data: data.whyChooseReasons.map((d) => d.share),
      colors: [ACCENT, "#5a5550", "#2a4a7f", "#1a6b6b", "#b8923f", "#c75d6e"],
      accent: ACCENT,
    });
  }

  function renderChoiceInsights(data) {
    const el = document.getElementById("choiceInsights");
    el.innerHTML = data.choiceInsights
      .map(
        (text) => `
        <div class="insight-item">
          <div class="insight-dot" style="background:${ACCENT};"></div>
          <div class="insight-text">${text}</div>
        </div>`
      )
      .join("");
  }

  function renderMyths(data) {
    const el = document.getElementById("mythsList");
    el.innerHTML = data.myths
      .map(
        (m) => `
        <div style="border:1px solid var(--border); padding:22px 20px; margin-bottom:14px; background:var(--paper-card);">
          <div style="font-family:var(--font-mono); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:${ACCENT}; margin-bottom:10px;">${m.title}</div>
          <p style="font-family:var(--font-mono); font-size:11px; color:#8a8a8a; margin-bottom:10px; font-style:italic;">Myth: "${m.myth}"</p>
          <p style="font-family:var(--font-body); font-size:15.5px; color:var(--muted); line-height:1.65;">Reality: ${m.reality}</p>
        </div>`
      )
      .join("");
  }

  function renderModernScoreChart(data) {
    const ctx = document.getElementById("modernScoreChart");
    CodexCharts.horizontalBar(ctx, {
      labels: data.modernCareers.map((c) => c.name),
      xLabel: "Growth Score / 10",
      accent: ACCENT,
      datasets: [
        {
          label: "Growth Score",
          data: data.modernCareers.map((c) => c.growthScore),
          backgroundColor: ACCENT,
        },
      ],
    });
  }

  function renderModernCareerCards(data) {
    const el = document.getElementById("modernCareerCards");
    el.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
        ${data.modernCareers
          .map(
            (c) => `
          <div style="border:1px solid var(--border); border-left:3px solid ${ACCENT}; padding:18px; background:var(--paper-card);">
            <div style="font-family:var(--font-serif); font-weight:700; font-size:15px; margin-bottom:6px;">${c.name}</div>
            <div style="font-family:var(--font-mono); font-size:9px; letter-spacing:1px; color:${ACCENT}; margin-bottom:8px;">${c.artsCore} + ${c.techMultiplier}</div>
            <div style="font-family:var(--font-body); font-size:14px; color:var(--muted);">${c.salary} &nbsp;·&nbsp; Score: <strong style="color:${ACCENT};">${c.growthScore}/10</strong></div>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function renderTradScoreChart(data) {
    const ctx = document.getElementById("tradScoreChart");
    CodexCharts.horizontalBar(ctx, {
      labels: data.traditionalCareers.map((c) => c.name),
      xLabel: "Growth Score / 10",
      accent: "#8a8478",
      datasets: [
        {
          label: "Growth Score",
          data: data.traditionalCareers.map((c) => c.growthScore),
          backgroundColor: MIST,
        },
      ],
    });
  }

  function renderTradCareerCards(data) {
    const el = document.getElementById("tradCareerCards");
    el.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:18px;">
        ${data.traditionalCareers
          .map(
            (c) => `
          <div style="border:1px solid var(--border); padding:18px; background:var(--paper-card);">
            <div style="font-family:var(--font-serif); font-weight:700; font-size:15px; margin-bottom:6px;">${c.name}</div>
            <div style="font-family:var(--font-mono); font-size:9px; letter-spacing:1px; color:#8a8478; margin-bottom:8px; text-transform:uppercase;">${c.saturation}</div>
            <div style="font-family:var(--font-body); font-size:14px; color:var(--muted); line-height:1.55; margin-bottom:6px;">${c.reality}</div>
            <div style="font-family:var(--font-mono); font-size:10px; color:#5a5550;">${c.salary}</div>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function renderConclusion(data) {
    document.getElementById("conclusionQuote").innerHTML =
      `<p>${data.conclusion}</p>`;
  }
})();