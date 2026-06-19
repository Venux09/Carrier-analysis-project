// Commerce page — loads commerce_data.json, renders charts + dynamic content.

(function () {
  const ACCENT = "#b8923f";
  const MIST = "#d4cfc7";
  const INK = "#1a1a1a";

  fetch("/static/data/commerce_data.json")
    .then((r) => r.json())
    .then((data) => {
      renderDistributionChart(data);
      renderDistributionInsights(data);
      renderReasonsChart(data);
      renderMyths(data);
      renderPaths(data);
      renderScoreChart(data);
      renderScoreInsight(data);
      renderConclusion(data);
    })
    .catch((e) => console.error("Failed to load commerce data:", e));

  function renderDistributionChart(data) {
    const ctx = document.getElementById("distributionChart");
    CodexCharts.donut(ctx, {
      labels: data.streamDistribution.map((d) => d.name),
      data: data.streamDistribution.map((d) => d.share),
      colors: ["#2a4a7f", "#1a6b6b", ACCENT],
      accent: ACCENT,
    });
  }

  function renderDistributionInsights(data) {
    const el = document.getElementById("distributionInsights");
    el.innerHTML = data.distributionInsights
      .map(
        (text) => `
        <div class="insight-item">
          <div class="insight-dot" style="background:${ACCENT};"></div>
          <div class="insight-text">${text}</div>
        </div>`
      )
      .join("");
  }

  function renderReasonsChart(data) {
    const ctx = document.getElementById("reasonsChart");
    CodexCharts.donut(ctx, {
      labels: data.whyChooseReasons.map((d) => d.category),
      data: data.whyChooseReasons.map((d) => d.share),
      colors: [ACCENT, "#1a6b6b", "#8b2635", "#2a4a7f", "#5a5550"],
      accent: ACCENT,
    });
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

  function renderPaths(data) {
    const tEl = document.getElementById("traditionalPaths");
    const mEl = document.getElementById("modernPaths");

    tEl.innerHTML = data.traditionalVsModern.traditionalPaths
      .map(
        (p) => `
        <div style="border-left:2px solid var(--border); padding:12px 16px; margin-bottom:10px;">
          <div style="font-family:var(--font-serif); font-size:14px; font-weight:700; margin-bottom:4px;">${p.name}</div>
          <div style="font-family:var(--font-body); font-size:14px; color:var(--muted); line-height:1.55;">${p.desc}</div>
        </div>`
      )
      .join("");

    mEl.innerHTML = data.traditionalVsModern.modernPaths
      .map(
        (p) => `
        <div style="border-left:2px solid ${ACCENT}; padding:12px 16px; margin-bottom:10px;">
          <div style="font-family:var(--font-serif); font-size:14px; font-weight:700; margin-bottom:4px; color:${ACCENT};">${p.name}</div>
          <div style="font-family:var(--font-body); font-size:14px; color:var(--muted); line-height:1.55;">${p.desc}</div>
        </div>`
      )
      .join("");
  }

  function renderScoreChart(data) {
    const ctx = document.getElementById("scoreChart");
    const sc = data.traditionalVsModern.scoreComparison;
    CodexCharts.groupedBar(ctx, {
      labels: sc.labels,
      yLabel: "Score / 10",
      accent: ACCENT,
      datasets: [
        { label: "Traditional Path", data: sc.traditional, backgroundColor: MIST },
        { label: "Modern Path", data: sc.modern, backgroundColor: ACCENT },
      ],
    });
  }

  function renderScoreInsight(data) {
    const el = document.getElementById("scoreInsight");
    el.innerHTML = `
      <div class="insight-item">
        <div class="insight-dot" style="background:${ACCENT};"></div>
        <div class="insight-text">${data.traditionalVsModern.scoreInsight}</div>
      </div>`;
  }

  function renderConclusion(data) {
    const c = data.conclusion;
    document.getElementById("commodityList").innerHTML = c.commodityPath
      .map(
        (item) => `
        <div style="font-family:var(--font-mono); font-size:10px; letter-spacing:1px; color:#8a8478; padding:6px 0; border-bottom:1px dashed var(--border);">→ ${item}</div>`
      )
      .join("");

    document.getElementBysId("monopolyList").innerHTML = c.monopolyPath
      .map(
        (item) => `
        <div style="font-family:var(--font-mono); font-size:10px; letter-spacing:1px; color:${ACCENT}; padding:6px 0; border-bottom:1px dashed var(--border);">◆ ${item}</div>`
      )
      .join("");

    document.getElementById("commodityResult").textContent = c.commodityResult;
    document.getElementById("monopolyResult").textContent = c.monopolyResult;
  }
})();