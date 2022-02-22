// allows us to access the TokenFarm smart contract
const TokenFarm = artifacts.require('TokenFarm')

// this script allows us to issue tokens by running "truffle exec scripts/issue-tokens.js" on the command line
//exec just means execute
module.exports = async function(callback) {//async is necessary because we wanna do some step by step procesdures in this funciton

	let tokenFarm = await TokenFarm.deployed()
	await tokenFarm.issueTokens()
  
	// Message will display to console when this is run
	console.log("Tokens Issued")
	callback() // this will be a function that we will pass through the function
	// without the callback the function runs a little weird 
}

// module.exports = async function() {
// 	let tokenFarm = await TokenFarm.deployed()
// 	await tokenFarm.issueTokens()

// 	console.log("tokens issued")
// }