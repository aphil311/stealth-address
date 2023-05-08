const StakeManager = artifacts.require("StakeManager");

contract("StakeManager", function(accounts) {
  // define variables for testing
  let stakeManager;
  const staker = accounts[1];
  const recipient = accounts[2];
  const stakeAmount = web3.utils.toWei("1", "ether"); // 1 ETH

  // before each test, deploy a new instance of the contract and assign it to stakeManager variable
  beforeEach(async function() {
    stakeManager = await StakeManager.new();
  });

  // unit test 1: test adding stake to an account
  it("should add stake to an account", async function() {
    await stakeManager.addStake(staker, { value: stakeAmount });
    const actualStake = await stakeManager.stakes(staker);
    assert.equal(actualStake, stakeAmount, "Stake was not added correctly");
  });

  // unit test 2: test withdrawing stake from an account
  it("should withdraw stake from an account", async function() {
    await stakeManager.addStake(staker, { value: stakeAmount });
    await stakeManager.withdrawStake(recipient, { from: staker });
    const actualStake = await stakeManager.stakes(staker);
    assert.equal(actualStake, 0, "Stake was not withdrawn correctly");
  });
});
