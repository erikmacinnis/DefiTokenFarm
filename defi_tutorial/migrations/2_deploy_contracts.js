const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {//async is necessary because we wanna do some step by step procesdures in this funciton
  
  //deploy Mock DAI Token 
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  //Deploy Dapp Token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  //deployer.deploy(TokenFarm); replace with
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed() 

  //Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')//1 million with 18 decimal places

  //Transfer 100 Mock DAI tokens to investor just so they can use it
  await daiToken.transfer(accounts[1], '100000000000000000000') //accounts represents the second account on Ganache 

}


