
// ===============================
// Game State & Config
// ===============================
let netWorth = 0;
let clickPower = 1;
let clickLevel = 0;
let clickUpgradeCost = 2;
const clickPowerIncrease = 1.5;

function formatMoney(value) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

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
  netWorthEl.textContent = `Net Worth: $${formatMoney(netWorth)}`;
  clickPowerEl.textContent = `Click Power: $${formatMoney(clickPower)}`;
  upgradeClickCostEl.textContent = `$${formatMoney(clickUpgradeCost)}`;
  passiveIncomeEl.textContent = `Income: $${formatMoney(calculatePassiveIncome())} /s`;


  document.querySelectorAll('.investment').forEach((card) => {
    const index = parseInt(card.getAttribute('data-index'));
    const inv = investments[index];
    const investBtn = card.querySelector('.investBtn');
    const sharesEl = card.querySelector('.shares');
    const intervalEl = card.querySelector('.interval');
    const payoutEl = card.querySelector('.payout');

    investBtn.disabled = netWorth < inv.baseCost || (inv.requiresPrevious && !investments[index - 1].shares);
    sharesEl.textContent = `Shares: ${inv.shares}`;
    intervalEl.textContent = `Time: ${calculateAdjustedInterval(inv).toFixed(1)}s`;
    payoutEl.textContent = `Payout: $${formatMoney(calculateAdjustedPayout(inv))}`;
  });
}

// ===============================
// Click Handling
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
    clickPower = +(clickPower * clickPowerIncrease).toFixed(2);
    clickUpgradeCost = Math.ceil(clickUpgradeCost * 1.5);
    updateUI();
  }
}

// ===============================
// Investment Logic
// ===============================
function setupInvestmentLogic() {
  document.querySelectorAll('.investment').forEach((card, index) => {
    const inv = investments[index];
    const investBtn = card.querySelector('.investBtn');
    const employBtn = card.querySelector('.startBtn');
    const autoBtn = card.querySelector('.autoBtn');
    const progressInner = card.querySelector('.progressBarInner');

    investBtn.addEventListener('click', () => {
      if (netWorth >= inv.baseCost) {
        netWorth -= inv.baseCost;
        inv.shares++;
        inv.baseCost = Math.ceil(inv.baseCost * 1.15);
        investBtn.textContent = `Invest ($${formatMoney(inv.baseCost)})`;
        updateUI();
      }
    });

    employBtn.addEventListener('click', () => {
      if (inv.shares > 0 && inv.timer === 0) {
        runPayoutLoop(inv, progressInner, false);
      }
    });

    autoBtn.addEventListener('click', () => {
      if (!inv.isAutomated && netWorth >= inv.automationCost) {
        netWorth -= inv.automationCost;
        inv.isAutomated = true;
        if (!inv.timer) {
          runPayoutLoop(inv, progressInner, true);
        }
        updateUI();
      }
    });

    if (inv.isAutomated && inv.shares > 0 && !inv.timer) {
      runPayoutLoop(inv, progressInner, true);
    }
  });
}

// ===============================
// Payout Loop Handler
// ===============================
function runPayoutLoop(inv, progressInner, auto = false) {
  let elapsed = 0;
  const tick = 100;

  const step = () => {
    if (inv.shares <= 0 || (!inv.isAutomated && elapsed === 0 && auto)) {
      inv.timer = 0;
      progressInner.style.width = "0%";
      return;
    }

    elapsed += tick;
    const intervalMS = calculateAdjustedInterval(inv) * 1000;
    const percent = Math.min((elapsed / intervalMS) * 100, 100);
    progressInner.style.width = percent + "%";

    if (elapsed >= intervalMS) {
      netWorth += calculateAdjustedPayout(inv);
      elapsed = 0;
      updateUI();

      if (!auto) {
        clearTimeout(inv.timer);
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
// Utility: Calculate Adjusted Values
// ===============================
function calculateAdjustedInterval(inv) {
  return Math.max(inv.interval / (1 + inv.shares * 0.05), 0.2);
}

function calculateAdjustedPayout(inv) {
  return +(inv.payout * inv.shares).toFixed(2);
}

function calculatePassiveIncome() {
  return investments.reduce((sum, inv) => {
    if (inv.shares > 0 && inv.isAutomated) {
      return sum + (calculateAdjustedPayout(inv) / calculateAdjustedInterval(inv));
    }
    return sum;
  }, 0);
}
