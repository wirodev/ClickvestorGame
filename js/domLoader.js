
// View: Builds the investment cards from the updated model
function formatMoney(value) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

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
            <span class="shares">Shares: ${inv.shares}</span><br>
            <span class="interval">Time: ${inv.interval.toFixed(1)}s</span><br>
            <span class="payout">Payout: $${formatMoney(inv.payout)}</span>
          </div>
        </div>

        <div class="investment-actions">
          <button class="startBtn styleUpgradeBtn">Get Payout</button><br>
          <button class="investBtn styleUpgradeBtn" disabled>Buy Shares ($${formatMoney(inv.baseCost)})</button><br>
<button class="autoBtn styleUpgradeBtn">Hire Manager ($${formatMoney(inv.automationCost)})</button>
        </div>
      </div>

      <div class="progressBar">
        <div class="progressBarInner"></div>
      </div>
    `;

    container.appendChild(card);
  });
}
