  const btn = document.getElementById("catBtn");
  const panel = document.getElementById("catPanel");

  btn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });

  // Hide when clicking outside
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.add("hidden");
    }
  });