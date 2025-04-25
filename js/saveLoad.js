// Save game state to localStorage
function saveGame() {
  const saveData = {
    netWorth,
    clickPower,
    clickLevel,
    clickUpgradeCost,
    investments: investments.map(inv => ({
      shares: inv.shares,
      baseCost: inv.baseCost,
      isAutomated: inv.isAutomated
    })),
    timestamp: Date.now()
  };
  localStorage.setItem('clickvestorSave', JSON.stringify(saveData));
}

// Load game state from localStorage
function loadGame() {
  const data = localStorage.getItem('clickvestorSave');
  if (!data) return;

  try {
    const save = JSON.parse(data);
    netWorth = save.netWorth || 0;
    clickPower = save.clickPower || 1;
    clickLevel = save.clickLevel || 0;
    clickUpgradeCost = save.clickUpgradeCost || 2;

    if (Array.isArray(save.investments)) {
      save.investments.forEach((savedInv, i) => {
        if (investments[i]) {
          investments[i].shares = savedInv.shares || 0;
          investments[i].baseCost = savedInv.baseCost || investments[i].baseCost;
          investments[i].isAutomated = savedInv.isAutomated || false;
        }
      });
    }

    updateUI();
    setupInvestmentLogic();
  } catch (err) {
    console.error("Failed to load save:", err);
  }
}

// Manual reset
function resetGame() {
  localStorage.removeItem('clickvestorSave');
  location.reload();
}

// Auto-save every 10 seconds
setInterval(saveGame, 10000);

// Load game on start
window.addEventListener('load', loadGame);
