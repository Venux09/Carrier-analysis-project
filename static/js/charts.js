// Shared Chart.js defaults + helper builders for all stream pages.
// Requires Chart.js to be loaded before this file.

const CodexCharts = (function () {

  const INK = "#1a1a1a";
  const PAPER = "#fdfcfa";
  const MIST = "#d4cfc7";

  function applyGlobalDefaults() {
    if (!window.Chart) return;
    Chart.defaults.font.family = "'DM Mono', monospace";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = "#5a5a5a";
  }

  function editorialTooltip(accent) {
    return {
      backgroundColor: INK,
      borderColor: accent,
      borderWidth: 1,
      titleFont: { family: "'DM Mono', monospace", size: 11 },
      bodyFont: { family: "'DM Mono', monospace", size: 11 },
      padding: 10,
      displayColors: false,
    };
  }

  function donut(ctx, { labels, data, colors, accent }) {
    return new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: PAPER,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: {
            position: "right",
            labels: { boxWidth: 10, font: { size: 9.5 } },
          },
          tooltip: editorialTooltip(accent),
        },
      },
    });
  }

  function groupedBar(ctx, { labels, datasets, accent, yLabel }) {
    return new Chart(ctx, {
      type: "bar",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { font: { size: 9.5 } } },
          tooltip: editorialTooltip(accent),
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: MIST },
            title: yLabel ? { display: true, text: yLabel, font: { size: 9.5 } } : undefined,
          },
        },
      },
    });
  }

  function horizontalBar(ctx, { labels, datasets, accent, xLabel }) {
    return new Chart(ctx, {
      type: "bar",
      data: { labels, datasets },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { font: { size: 9.5 } } },
          tooltip: editorialTooltip(accent),
        },
        scales: {
          x: {
            grid: { color: MIST },
            title: xLabel ? { display: true, text: xLabel, font: { size: 9.5 } } : undefined,
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  function scatter(ctx, { datasets, accent, xLabel, yLabel }) {
    return new Chart(ctx, {
      type: "scatter",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: editorialTooltip(accent),
        },
        scales: {
          x: {
            grid: { color: MIST },
            title: { display: true, text: xLabel || "Effort", font: { size: 9.5 } },
          },
          y: {
            grid: { color: MIST },
            title: { display: true, text: yLabel || "Outcome", font: { size: 9.5 } },
            min: 0,
          },
        },
      },
    });
  }

  return { applyGlobalDefaults, donut, groupedBar, horizontalBar, scatter, INK, PAPER, MIST };
})();

// Apply defaults immediately (since this script loads at end of body, DOMContentLoaded may have already fired)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", CodexCharts.applyGlobalDefaults);
} else {
  CodexCharts.applyGlobalDefaults();
}