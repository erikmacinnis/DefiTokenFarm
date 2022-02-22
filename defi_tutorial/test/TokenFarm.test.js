const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {//helper function so we don't have write web3.tuils.toWei(n, 'ether') everytime 
	return web3.utils.toWei(n, 'ether');
}

contract(TokenFarm, ([owner, investor]) => { //[owner, investor] just make account array into 2 item array

	//write test here...
	let daiToken, dappToken, tokenFarm

	before(async () => { //This happens before anything else
		daiToken = await DaiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

		//Transfer all Dapp tokens to farm (1 million)
		await dappToken.transfer(tokenFarm.address, tokens('1000000')) 

		//Transfers 100 dai tokens to investor
		await daiToken.transfer(investor, tokens('100'), {from: owner})//in test we need {from: accounts[0]} for doing test because we need to clarify where the dai is coming from 
	})

	//These three describe basically just check that the name is the is correct for each object
	// I assume since the name is correct the rest is probobly correct and we know the name function works
	describe('Mock DAI deployment', async () => {
		it('has a name', async () => {
			const name = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')	
		})
	})

	describe('Dapp Token deployment', async () => {
		it('has a name', async () => {
			const name = await dappToken.name()
			assert.equal(name, 'DApp Token')	
		})
	})

	describe('Token Farm deployment', async () => {
		it('has a name', async () => {
			const name = await tokenFarm.name()
			assert.equal(name, 'Dapp Token Farm')	
		})

		//Here we are testing if there are all the dapp tokens in the tokenfarm
		it('contract has token', async () => {
			let balance = await dappToken.balanceOf(tokenFarm.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})

	describe('Farming tokens', async () => {
		it('rewards investors for staking mDai tokens', async () => {
			let result

			// Check investor balance before staking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking') // checks to see if balance is 100 // the amount we gabe to the investor account

			// Stake Mock DAI Tokens
			await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor}) //aproves the tokens so the tokenfarm can spend the dapp tokens
			await tokenFarm.stakeTokens(tokens('100'), {from: investor})

			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking') //balance after staking correct

			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI wallet balance correct after staking') //balance of token farm after staking correct

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI wallet balance correct after staking')

			result = await tokenFarm.hasStaked(investor)
			assert.equal(result.toString(), 'true', 'Token Farm Mock DAI wallet balance correct after staking')

			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'true', 'Token Farm Mock DAI wallet balance correct after staking')

			//Issue Tokens
			await tokenFarm.issueTokens({from: owner})

			// Checks balance after issuance
			result = await dappToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance')

			await tokenFarm.issueTokens({from: investor}).should.be.rejected;

			//Unstake tokens
			await tokenFarm.unstakeTokens({from: investor})

			//Check results after unstaking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet balance correct after unstaking')

			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('0'), 'Token Farm Mock Dai Balance after unstaking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after unstaking')
		})
	})
})