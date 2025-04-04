const investments = [
    {
      name: "Lemonade Stand",
      description: "Start small. Squeeze every cent.",
      image: "img/lemonade.png"
    },
    {
      name: "Garage Sale Empire",
      description: "Sell grandma’s junk for profit.",
      image: "img/garage.png"
    },
    {
      name: "Mom’s Basement Startup",
      description: "Funded by ramen and ambition.",
      image: "img/startup.png"
    },
    {
      name: "Local Pizza Chain",
      description: "Grease the wheels of commerce.",
      image: "img/pizza.png"
    },
    {
      name: "Neighborhood Crypto Miner",
      description: "Melt GPUs for passive income.",
      image: "img/crypto.png"
    },
    {
      name: "Influencer Brand Deal Agency",
      description: "Turn clout into cash.",
      image: "img/influencer.png"
    },
    {
      name: "Regional Fast Food Empire",
      description: "Have it your way — everywhere.",
      image: "img/fastfood.png"
    },
    {
      name: "National Tech Conglomerate",
      description: "Owns three apps and your data.",
      image: "img/tech.png"
    },
    {
      name: "Offshore Investment Scheme",
      description: "Totally legit. Promise.",
      image: "img/offshore.png"
    },
    {
      name: "Artificial Intelligence Mega-Lab",
      description: "Automate the world (and profits).",
      image: "img/ai.png"
    },
    {
      name: "World Bank Acquisition",
      description: "Set the rates. Rule the game.",
      image: "img/bank.png"
    },
    {
      name: "Interplanetary Mining Corp",
      description: "Mars has more than just dust.",
      image: "img/marsmine.png"
    },
    {
      name: "Time-Travel Real Estate Trust",
      description: "Buy in 1890. Sell in 2200.",
      image: "img/timetravel.png"
    },
    {
      name: "Galactic Stock Exchange",
      description: "Trade across the stars.",
      image: "img/galaxy.png"
    },
    {
      name: "Multiverse Monopoly Machine",
      description: "Infinite selves. Infinite revenue.",
      image: "img/multiverse.png"
    },
    {
      name: "God Mode Capital",
      description: "Owns everything. Clicks itself.",
      image: "img/godmode.png"
    }
  ];
  
  const container = document.getElementById('investments');
  
  investments.forEach((inv, index) => {
    const card = document.createElement('div');
    card.classList.add('investment');
  
    card.innerHTML = `
        <div class="investment-top">
            <img src="${inv.image}" alt="${inv.name}" />
            <div class="investment-info">
            <p>${inv.name}</p>
            <small>${inv.description}</small>
            </div>
            <button class="investBtn">Invest</button>
        </div>
        <div class="progressBar"><div class="progressBarInner"></div></div>
        `;

  
    container.appendChild(card);
  });
  
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

// Update UI
function updateUI() {
  netWorthEl.textContent = `Net Worth: $${Math.floor(netWorth)}`;
  clickPowerEl.textContent = `Click Power: $${clickPower}`;
  upgradeClickBtn.textContent = `Upgrade Click Power ($${clickUpgradeCost})`;
}

// Handle Click
investBtn.addEventListener('click', () => {
  let crit = 1;
  let critText = '';

  // 10% chance for x2, 2% chance for x10
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

  // Show feedback
  if (crit > 1) {
    critFeedback.textContent = critText;
    critFeedback.style.display = 'block';
    critFeedback.style.animation = 'none';
    critFeedback.offsetHeight; // force reflow
    critFeedback.style.animation = 'fadeUp 1s ease-out';
  }

  updateUI();
});

// Handle Click Power Upgrade
upgradeClickBtn.addEventListener('click', () => {
  if (netWorth >= clickUpgradeCost) {
    netWorth -= clickUpgradeCost;
    clickLevel++;
    clickPower = 1 + clickLevel;
    clickUpgradeCost = Math.floor(20 * Math.pow(upgradeFactor, clickLevel));
    updateUI();
  }
});

// Init
updateUI();
