
// View: Builds the investment cards from the updated model
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
            <span class="shares">Shares: ${inv.shares}</span>
            <span class="interval">Time: ${inv.interval.toFixed(1)}s</span>
            <span class="payout">Payout: $${inv.payout.toFixed(2)}</span>
          </div>
        </div>

        <div class="investment-actions">
          <button class="startBtn">Employ</button>
          <button class="investBtn" disabled>Invest ($${inv.baseCost})</button>
          <button class="autoBtn">Hire Wealth Manager ($${inv.automationCost})</button>
        </div>
      </div>

      <div class="progressBar">
        <div class="progressBarInner"></div>
      </div>
    `;

    container.appendChild(card);
  });
}
