const oERC5564Messenger = artifacts.require("ERC5564Messenger");

contract("ERC5564Messenger", function(accounts) {
  // define variables for testing
  let ERC5564Messenger;
  const staker = accounts[1];
  const recipient = accounts[2];
  const nonStaker = accounts[3];
  const stakeAmount = web3.utils.toWei("1", "ether"); // 1 ETH
  const noEth = web3.utils.toWei("0", "ether"); // 0 ETH

  // before each test, deploy a new instance of the contract and assign it to stakeManager variable
  beforeEach(async function() {
    ERC5564Messenger = await oERC5564Messenger.new();
  });

  // unit test 1: test adding stake to an account
  it("Stake 1 ETH", async function() {
    await ERC5564Messenger.addStake(staker, { value: stakeAmount });
    const actualStake = await ERC5564Messenger.stakes(staker);
    assert.equal(actualStake, stakeAmount, "Stake was not added correctly");
  });

  // unit test 2: test withdrawing stake from an account
  it("Withdraw 1 ETH", async function() {
    await ERC5564Messenger.addStake(staker, { value: stakeAmount });
    await ERC5564Messenger.withdrawStake(recipient, { from: staker });
    const actualStake = await ERC5564Messenger.stakes(staker);
    assert.equal(actualStake, 0, "Stake was not withdrawn correctly");
  });

  // unit test 3: test staking 0 ETH
  it("Stake 0 ETH", async function() {
    try {
      await ERC5564Messenger.addStake(staker, { value: noEth });
      assert.fail("Expected an error, but none was thrown");
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }
  });

  // unit test 4: test withdrawing when no ETH available
  it("Withdraw ETH from empty account", async function() {
    try {
      await ERC5564Messenger.withdrawStake(recipient, { from: staker });
      assert.fail("Expected an error, but none was thrown")
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }

    await ERC5564Messenger.addStake(staker, { value: stakeAmount });
    let actualStake = await ERC5564Messenger.stakes(staker)
    assert.equal(actualStake, stakeAmount, "Stake was not added correctly");

    await ERC5564Messenger.withdrawStake(recipient, { from: staker });
    actualStake = await ERC5564Messenger.stakes(staker);
    assert.equal(actualStake, 0, "Stake was not withdrawn correctly");

    try {
      await ERC5564Messenger.withdrawStake(recipient, { from: staker });
      assert.fail("Expected an error, but none was thrown")
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }
  });

  // unit test 5: test attempting to withdraw from an account that is not the staker
  it("Withdraw from non-staker", async function() {
    await ERC5564Messenger.addStake(staker, { value: stakeAmount });
    try {
      await ERC5564Messenger.withdrawStake(recipient, {from: nonStaker });
      assert.fail("Expected an error, but none was thrown")
    } catch (error) {
      assert.include(error.message, "revert", "Expected a revert error");
    }
  });

  // unit test 6: announce a message
  it("Announce a message", async function() {
    const schemeId = 1;
    const stealthAddress = accounts[4];
    const ephemeralPubKey = '0x1234';
    const metadata = '0x5678';

    const result = await ERC5564Messenger.announce(schemeId, stealthAddress, ephemeralPubKey, metadata);

    assert(result.logs.length > 0, 'Announcement event was not emitted');
    assert.equal(result.logs[0].event, 'Announcement', 'Event type is not Announcement');
    assert.equal(result.logs[0].args.schemeId.toNumber(), schemeId, 'Scheme ID is incorrect');
    assert.equal(result.logs[0].args.stealthAddress, stealthAddress, 'Stealth address is incorrect');
    assert.equal(result.logs[0].args.ephemeralPubKey, ephemeralPubKey, 'Ephemeral public key is incorrect');
    assert.equal(result.logs[0].args.metadata, metadata, 'Metadata is incorrect');
  });
});
