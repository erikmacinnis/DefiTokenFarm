pragma solidity ^0.5.0;

import "./DappToken.sol"; //makes file aware of tokens
import "./DaiToken.sol"; //makes file aware of tokens

contract TokenFarm { //allow this smart contract to take in dai tokens and issue dapp tokens
	// All code goes here...
	string public name = "Dapp Token Farm";
	DappToken public dappToken; //The smart contract becomes the type, DappToken is the type
	DaiToken public daiToken; //Very similar to java here
	address owner; //person who deploys the smart contract

	address[] public stakers; // keeps track of all stakers
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;

	constructor(DappToken _dappToken, DaiToken _daiToken) public { //runs only once when the function is deployed
		dappToken = _dappToken;
		daiToken = _daiToken;
		owner = msg.sender;
	}	

	// 1. Stakes Tokens (Deposit)
	//Deposit Dai Tokens into the Token Farm
	function stakeTokens(uint _amount) public {

		// Require amount greater than 0
		require(_amount > 0, "amount cannot be 0");

		//Transfer Mock Dai tokens to this contract for staking
		daiToken.transferFrom(msg.sender, address(this), _amount); 

		//Update staking balance 
		//current staking balance += the amount this invested
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount; //updated the value for the stakingBalance[msg.sender] key

		//Add user to stakers array *only* if they haven't staked already
		if (!hasStaked[msg.sender]) { //checks if they have staked yet
			stakers.push(msg.sender); //push to the stakers array
		}

		//Update Staking Status
		hasStaked[msg.sender] = true; //sets the msg.sender key in hasStaked to be True
		isStaking[msg.sender] = true; //Sets the isstaking key to be true
	}

	// 2. Issuing Tokens
	function issueTokens() public{ 

		require(msg.sender == owner, "caller must be the owner"); // only the person who deployed the contract can run this

		//issues tokens to all stakers
		for (uint i = 0; i < stakers.length; i++){//for every staker
			address recipient = stakers[i]; // get address
			uint balance = stakingBalance[recipient];// get their balance

			if (balance > 0){
				dappToken.transfer(recipient, balance); // For every Dai they get a DApp token // this can be changed easily
			}
		}
	}

	// 3. Unstaking Tokens (Withdraw)
	// Withdraw Dai Tokens from token farm into their wallet
	function unstakeTokens() public {
		uint balance = stakingBalance[msg.sender];

		//require amount greater than 0
		require(balance > 0, "staking balance cannot be 0");

		//Transfer Mock Dai tokens back to investor
		daiToken.transfer(msg.sender, balance);

		// Reset Staking Balance
		stakingBalance[msg.sender] = 0;

		//Update staking status
		isStaking[msg.sender] = false;
	}

	
}
