const StakeManager = artifacts.require("StakeManager");

contract("StakeManager", function(accounts) {
  // define variables for testing
  let stakeManager;
  const staker = accounts[1];
  const recipient = accounts[2];
  const nonStaker = accounts[3];
  const stakeAmount = web3.utils.toWei("1", "ether"); // 1 ETH
  const noEth = web3.utils.toWei("0", "ether"); // 0 ETH

  // before each test, deploy a new instance of the contract and assign it to stakeManager variable
  beforeEach(async function() {
    stakeManager = await StakeManager.new();
  });

  // unit test 1: test adding stake to an account
  it("Stake 1 ETH", async function() {
    await stakeManager.addStake(staker, { value: stakeAmount });
    const actualStake = await stakeManager.stakes(staker);
    assert.equal(actualStake, stakeAmount, "Stake was not added correctly");
  });

  // unit test 2: test withdrawing stake from an account
  it("Withdraw 1 ETH", async function() {
    await stakeManager.addStake(staker, { value: stakeAmount });
    await stakeManager.withdrawStake(recipient, { from: staker });
    const actualStake = await stakeManager.stakes(staker);
    assert.equal(actualStake, 0, "Stake was not withdrawn correctly");
  });

  // unit test 3: test staking 0 ETH
  it("Stake 0 ETH", async function() {
    try {
      await stakeManager.addStake(staker, { value: noEth });
      assert.fail("Expected an error, but none was thrown");
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }
  });

  // unit test 4: test withdrawing when no ETH available
  it("Withdraw ETH from empty account", async function() {
    try {
      await stakeManager.withdrawStake(recipient, { from: staker });
      assert.fail("Expected an error, but none was thrown")
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }

    await stakeManager.addStake(staker, { value: stakeAmount });
    let actualStake = await stakeManager.stakes(staker)
    assert.equal(actualStake, stakeAmount, "Stake was not added correctly");

    await stakeManager.withdrawStake(recipient, { from: staker });
    actualStake = await stakeManager.stakes(staker);
    assert.equal(actualStake, 0, "Stake was not withdrawn correctly");

    try {
      await stakeManager.withdrawStake(recipient, { from: staker });
      assert.fail("Expected an error, but none was thrown")
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }
  });

  // unit test 5: test attempting to withdraw from an account that is not the staker
  it("Withdraw from non-staker", async function() {
    await stakeManager.addStake(staker, { value: stakeAmount });
    try {
      await stakeManager.withdrawStake(recipient, {from: nonStaker });
      assert.fail("Expected an error, but none was thrown")
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }
  });
});
