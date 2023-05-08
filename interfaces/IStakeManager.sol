/// @notice Interface for the Stake Manager contract.
interface IStakeManager{
  
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
      function balanceOf(address account) external view returns (uint256);

      /**
      * @notice Adds the specified amount to the account's stake.
      * @dev The function is payable, so the amount is sent as value with the transaction.
      * @param staker The address of the staker to add the stake for.
      */
      function addStake(address staker) external payable;
      
      /**
      * @notice Withdraws the stake for the caller and sends it to the specified address.
      * @param withdrawAddress The address to send the withdrawn amount to.
      */
      function withdrawStake(address payable withdrawAddress) external;
}