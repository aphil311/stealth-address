// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/// @notice Interface for the Stake Manager contract.
interface IStakeManager{
      
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