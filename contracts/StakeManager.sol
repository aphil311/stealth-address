import "./interfaces/IStakeManager.sol";

/// @notice Interface for the Stake Manager contract.
abstract contract StakeManager is IStakeManager {
    /// map of staker address to their stake
    mapping(address => uint256) public stakes;

    /// @dev Emitted when stake is deposited.
    /// @param account The address of the staker who deposited the stake.
    /// @param totalStaked The new total amount of staked tokens for the account.
    event StakeDeposit (
        address indexed account,
        uint256 totalStaked
    );

    /// @dev Emitted when stake is withdrawn.
    /// @param account The address of the staker who withdrew the stake.
    /// @param withdrawAddress The address to which the withdrawn amount was sent.
    /// @param amount The amount of tokens withdrawn.
    event StakeWithdrawal (
        address indexed account,
        address withdrawAddress,
        uint256 amount
    );
  
    /**
    * @notice Returns the stake of the account.
    * @param account The address of the staker to check the stake for.
    * @return uint256 The amount of staked tokens for the account.
    */
    function balanceOf(address account) external view returns (uint256) {
        return stakes[account];
    }

    /**
    * @notice Adds the specified amount to the account's stake.
    * @dev The function is payable, so the amount is sent as value with the transaction.
    * @param staker The address of the staker to add the stake for.
    */
    function addStake(address staker) external payable {
        require(msg.value > 0, "StakeManager: stake must be greater than 0");
        stakes[staker] += msg.value;
        emit StakeDeposit(staker, msg.value);
    }

    /**
    * @notice Withdraws the stake for the caller and sends it to the specified address.
    * @param withdrawAddress The address to send the withdrawn amount to.
    */
    function withdrawStake(address payable withdrawAddress) external {
        require(stakes[msg.sender] > 0, "StakeManager: no stake to withdraw");
        uint256 amount = stakes[msg.sender];
        stakes[msg.sender] = 0;
        (bool success,) = withdrawAddress.call{value : amount}("");
        require(success, "failed to withdraw stake");
        emit StakeWithdrawal(msg.sender, withdrawAddress, amount);
    }
}