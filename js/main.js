// Entry point
window.addEventListener('DOMContentLoaded', () => {
    renderInvestments("investments");
    updateUI();
  
    investBtn.addEventListener('click', handleClick);
    upgradeClickBtn.addEventListener('click', handleClickUpgrade);
  
    // Start investment logic after DOM is rendered
    setupInvestmentLogic();
  });
  