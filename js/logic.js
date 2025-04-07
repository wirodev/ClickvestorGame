// ===============================
// Game State & Config
// ===============================
let netWorth = 0;
let clickPower = 1;
let clickLevel = 0;
let clickUpgradeCost = 20;
const upgradeFactor = 1.3;

// ===============================
// UI Elements
// ===============================
const netWorthEl = document.getElementById('netWorth');
const passiveIncomeEl = document.getElementById('passiveIncome');
const clickPowerEl = document.getElementById('clickPower');
const investBtn = document.getElementById('invest');
const upgradeClickBtn = document.getElementById('upgradeClick');
const upgradeClickCostEl = document.getElementById('upgradeClickCost');
const critFeedback = document.getElementById('critFeedback');

// ===============================
// Update UI
// ===============================
function updateUI() {
  netWorthEl.textContent = `Net Worth: $${Math.floor(netWorth)}`;
  clickPowerEl.textContent = `Click Power: $${clickPower}`;
  upgradeClickCostEl.textContent = `($${clickUpgradeCost})`;
  passiveIncomeEl.textContent = `Income: $${calculatePassiveIncome().toFixed(2)} /s`;

  document.querySelectorAll('.investment').forEach((card) => {
    const index = parseInt(card.getAttribute('data-index'));
    const inv = investments[index];

    const investBtn = card.querySelector('.investBtn');
    const sharesEl = card.querySelector('.shares');
    const intervalEl = card.querySelector('.interval');

    investBtn.disabled = netWorth < inv.initialCost;
    sharesEl.textContent = `Shares: ${inv.shares}`;
    intervalEl.textContent = `Time: ${calculateAdjustedInterval(inv).toFixed(1)}s`;
  });
}

// ===============================
// Handle Dollar Click
// ===============================
function handleClick() {
  let critMultiplier = 1;
  let critLabel = '';

  const roll = Math.random();
  if (roll < 0.02) {
    critMultiplier = 10;
    critLabel = 'x10!';
  } else if (roll < 0.12) {
    critMultiplier = 2;
    critLabel = 'x2!';
  }

  const earned = clickPower * critMultiplier;
  netWorth += earned;

  if (critMultiplier > 1) {
    critFeedback.textContent = critLabel;
    critFeedback.style.display = 'block';
    critFeedback.style.animation = 'none';
    critFeedback.offsetHeight;
    critFeedback.style.animation = 'fadeUp 1s ease-out';
  }

  updateUI();
}

critFeedback.addEventListener('animationend', () => {
  critFeedback.style.display = 'none';
});

// ===============================
// Upgrade Click Power
// ===============================
function handleClickUpgrade() {
  if (netWorth >= clickUpgradeCost) {
    netWorth -= clickUpgradeCost;
    clickLevel++;
    clickPower = 1 + clickLevel;
    clickUpgradeCost = Math.floor(20 * Math.pow(upgradeFactor, clickLevel));
    updateUI();
  }
}

// ===============================
// Setup Investment Buttons
// ===============================
function setupInvestmentLogic() {
  document.querySelectorAll('.investment').forEach((card, index) => {
    const inv = investments[index];
    const investBtn = card.querySelector('.investBtn');
    const startBtn = card.querySelector('.startBtn');
    const autoBtn = card.querySelector('.autoBtn');
    const progressInner = card.querySelector('.progressBarInner');

    // Buy Shares
    investBtn.addEventListener('click', () => {
      if (netWorth >= inv.initialCost) {
        netWorth -= inv.initialCost;
        inv.shares += 1;
        inv.initialCost = Math.floor(inv.initialCost * 1.15);
        investBtn.textContent = `Invest ($${inv.initialCost})`;
        updateUI();
      }
    });

    // Manual Start
    startBtn.addEventListener('click', () => {
      if (!inv.isAutomated && inv.shares > 0 && !inv.timer) {
        runPayoutLoop(inv, progressInner);
      }
    });

    // Automate
    autoBtn.addEventListener('click', () => {
      inv.isAutomated = true;
      if (!inv.timer) {
        runPayoutLoop(inv, progressInner);
      }
    });

    // Start loop if already automated
    if (inv.isAutomated && inv.shares > 0) {
      runPayoutLoop(inv, progressInner);
    }
  });
}

// ===============================
// Run Progress Bar and Payout Loop
// ===============================
function runPayoutLoop(inv, progressInner) {
  let elapsed = 0;
  const tick = 100;

  const step = () => {
    if (inv.shares <= 0 || (!inv.isAutomated && elapsed === 0)) {
      inv.timer = 0;
      progressInner.style.width = "0%";
      return;
    }

    elapsed += tick;
    const intervalMS = calculateAdjustedInterval(inv) * 1000;
    const percent = Math.min((elapsed / intervalMS) * 100, 100);
    progressInner.style.width = percent + "%";

    if (elapsed >= intervalMS) {
      const income = inv.payout * inv.shares;
      netWorth += income;
      elapsed = 0;
      updateUI();

      if (!inv.isAutomated) {
        inv.timer = 0;
        progressInner.style.width = "0%";
        return;
      }
    }

    inv.timer = setTimeout(step, tick);
  };

  step();
}

// ===============================
// Adjusted Interval (based on shares)
// ===============================
function calculateAdjustedInterval(inv) {
  return inv.interval / (1 + inv.shares * 0.05);
}

// ===============================
// Total Passive Income /s
// ===============================
function calculatePassiveIncome() {
  return investments.reduce((sum, inv) => {
    if (inv.shares > 0 && inv.isAutomated) {
      return sum + ((inv.payout * inv.shares) / calculateAdjustedInterval(inv));
    }
    return sum;
  }, 0);
}
