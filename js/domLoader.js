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
            <p>${inv.name}</p>
            <small>${inv.description}</small>
          </div>
          <button class="investBtn" disabled>Invest ($${inv.initialCost})</button>
        </div>
        <div class="progressBar"><div class="progressBarInner"></div></div>
      `;
  
      container.appendChild(card);
    });
  }
  