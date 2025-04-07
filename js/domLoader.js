// View: Builds the investment cards from the data
function renderInvestments(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  investments.forEach((inv, index) => {
    const card = document.createElement("div");
    card.classList.add("investment");
    card.setAttribute("data-index", index);

    card.innerHTML = `
      <div class="investment-top">
        <img src="${inv.image}" alt="${inv.name}" />

        <div class="investment-info">
          <p class="investment-name">${inv.name}</p>
          <small class="investment-description">${inv.description}</small>
          <div class="investment-meta">
            <span class="shares">Shares: 0</span>
            <span class="interval">Time: ${inv.interval}s</span>
          </div>
        </div>

        <div class="investment-actions">
          <button class="startBtn">Start</button>
          <button class="investBtn" disabled>Invest ($${inv.initialCost})</button>
          <button class="autoBtn">Automate</button>
        </div>
      </div>

      <div class="progressBar">
        <div class="progressBarInner"></div>
      </div>
    `;

    container.appendChild(card);
  });
}
