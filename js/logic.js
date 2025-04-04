// Controller Logic
let netWorth = 0;
let clickPower = 1;
let clickLevel = 0;
let clickUpgradeCost = 20;
const upgradeFactor = 1.3;

const netWorthEl = document.getElementById('netWorth');
const passiveIncomeEl = document.getElementById('passiveIncome');
const clickPowerEl = document.getElementById('clickPower');
const investBtn = document.getElementById('invest');
const upgradeClickBtn = document.getElementById('upgradeClick');
const critFeedback = document.getElementById('critFeedback');

// Update all UI panels
function updateUI() {
  netWorthEl.textContent = `Net Worth: $${Math.floor(netWorth)}`;
  clickPowerEl.textContent = `Click Power: $${clickPower}`;
  upgradeClickBtn.textContent = `Upgrade Click Power ($${clickUpgradeCost})`;

  // Enable/disable investment buttons based on netWorth
  document.querySelectorAll('.investment').forEach(card => {
    const index = parseInt(card.getAttribute('data-index'));
    const inv = investments[index];
    const btn = card.querySelector('.investBtn');
    btn.disabled = netWorth < inv.unlockAt;
  });
}

// Handle dollar click
function handleClick() {
  let crit = 1;
  let critText = '';

  const roll = Math.random();
  if (roll < 0.02) {
    crit = 10;
    critText = 'x10!';
  } else if (roll < 0.12) {
    crit = 2;
    critText = 'x2!';
  }

  const earned = clickPower * crit;
  netWorth += earned;

  if (crit > 1) {
    critFeedback.textContent = critText;
    critFeedback.style.display = 'block';
    critFeedback.style.animation = 'none';
    critFeedback.offsetHeight;
    critFeedback.style.animation = 'fadeUp 1s ease-out';
  }

  updateUI();
}

// Reset crit feedback when animation ends
critFeedback.addEventListener('animationend', () => {
  critFeedback.style.display = 'none';
});

// Upgrade click power
function handleClickUpgrade() {
  if (netWorth >= clickUpgradeCost) {
    netWorth -= clickUpgradeCost;
    clickLevel++;
    clickPower = 1 + clickLevel;
    clickUpgradeCost = Math.floor(20 * Math.pow(upgradeFactor, clickLevel));
    updateUI();
  }
}

function setupInvestmentLogic() {
    document.querySelectorAll('.investment').forEach((card, index) => {
      const investBtn = card.querySelector('.investBtn');
      const progressInner = card.querySelector('.progressBarInner');
      const inv = investments[index];
  
      // Buy or upgrade investment
      investBtn.addEventListener('click', () => {
        if (netWorth >= inv.upgradeCost) {
          netWorth -= inv.upgradeCost;
          inv.level++;
          inv.upgradeCost = Math.floor(inv.upgradeCost * 1.15); // Scale upgrade cost
          investBtn.textContent = `Invest ($${inv.upgradeCost})`;
          inv.active = true;
  
          updateUI();
        }
      });
  
      // Start payout loop
      function payoutLoop() {
        if (!inv.active || inv.level <= 0) return;
  
        let elapsed = 0;
        const intervalMS = inv.interval * 1000;
  
        const interval = setInterval(() => {
          if (!inv.active) {
            clearInterval(interval);
            return;
          }
  
          elapsed += 100;
          const percent = Math.min((elapsed / intervalMS) * 100, 100);
          progressInner.style.width = percent + "%";
  
          if (elapsed >= intervalMS) {
            netWorth += inv.payout * inv.level;
            elapsed = 0;
            updateUI();
          }
        }, 100);
      }
  
      payoutLoop(); // Start each one
    });
  }
  