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
const critFeedback = document.getElementById('critFeedback');

// ===============================
// Update UI
// ===============================
function updateUI() {
  netWorthEl.textContent = `Net Worth: $${Math.floor(netWorth)}`;
  clickPowerEl.textContent = `Click Power: $${clickPower}`;
  upgradeClickBtn.textContent = `Upgrade Click Power ($${clickUpgradeCost})`;
  passiveIncomeEl.textContent = `Income: $${calculatePassiveIncome().toFixed(2)} /s`;

  // Enable/disable investments
  document.querySelectorAll('.investment').forEach((card) => {
    const index = parseInt(card.getAttribute('data-index'));
    const inv = investments[index];
    const btn = card.querySelector('.investBtn');
    btn.disabled = netWorth < inv.unlockAt;
  });
}

// ===============================
// Click for Money + Crit
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
    critFeedback.offsetHeight; // trigger reflow
    critFeedback.style.animation = 'fadeUp 1s ease-out';
  }

  updateUI();
}

// Hide crit label after animation ends
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
// Investment Logic
// ===============================
function setupInvestmentLogic() {
  document.querySelectorAll('.investment').forEach((card, index) => {
    const investBtn = card.querySelector('.investBtn');
    const progressInner = card.querySelector('.progressBarInner');
    const inv = investments[index];

    investBtn.addEventListener('click', () => {
      if (netWorth >= inv.upgradeCost) {
        netWorth -= inv.upgradeCost;
        inv.level++;
        inv.upgradeCost = Math.floor(inv.upgradeCost * 1.15);
        investBtn.textContent = `Invest ($${inv.upgradeCost})`;
        inv.active = true;

        // Start progress bar loop once
        if (!inv.timer) {
          startPayoutLoop(inv, progressInner);
        }

        updateUI();
      }
    });
  });
}

// ===============================
// Payout Loop + Animation
// ===============================
function startPayoutLoop(inv, progressInner) {
  const intervalMS = inv.interval * 1000;
  let elapsed = 0;

  inv.timer = setInterval(() => {
    if (!inv.active || inv.level <= 0) return;

    elapsed += 100;
    const percent = Math.min((elapsed / intervalMS) * 100, 100);
    progressInner.style.width = percent + "%";

    if (elapsed >= intervalMS) {
      const income = inv.payout * inv.level;
      netWorth += income;
      elapsed = 0;
      updateUI();
    }
  }, 100);
}

// ===============================
// Total Passive Income /s
// ===============================
function calculatePassiveIncome() {
  return investments.reduce((sum, inv) => {
    if (inv.level > 0) {
      return sum + (inv.payout / inv.interval) * inv.level;
    }
    return sum;
  }, 0);
}
