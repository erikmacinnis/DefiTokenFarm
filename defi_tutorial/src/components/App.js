import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component { 

  // async componentWillMount(){ // react lifecycle function
  //   await this.loadWeb3()
  //   await this.loadBlockChainData()
  // }

  async componentDidMount(){ 
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadBlockChainData(){ //loads the blockchain to the website
    const web3 = window.web3

    //connects the metamask account to the website
    const accounts = await web3.eth.requestAccounts()
    const account = accounts[0]
    this.setState({ account }) //This is be account of the user of the app
    //SetState is a function in React that allows you to change variables in the contructor (basically change the website)

    // connects the networkId 
    const networkId = await web3.eth.net.getId() //networkId is fetched 

    //Load DaiToken to the website
    const daiTokenData = DaiToken.networks[networkId] // fetches the info under Network {networkId variable{<All this info>}} for the daiToken in the DaiToken.json file

    if (daiTokenData){ //if there is a networkId

      //DaiToken.abi is a binary file that holds all the information on DaiToken.abi 
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address) //function from web3.eth which uploads the contract to the website
      this.setState({daiToken}) //sets the variable in the constructor
      // methods allows the web3 object to use it's original methods 
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call() //we use call with a web3 object when we are fetching data
      this.setState({daiTokenBalance: daiTokenBalance.toString()})
    }
    else {
      window.alert('DaiToken contract not deployed to detect network')
    }

    const dappTokenData = DappToken.networks[networkId] // fetches the info under Network {networkId variable{<All this info>}} for the dappToken in the dappToken.json file

    if (dappTokenData){ //if there is a networkId

      //dappToken.abi is a binary file that holds all the information on dappToken.abi 
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address) //function from web3.eth which uploads the contract to the website
      this.setState({dappToken}) //sets the variable in the constructor
      // methods allows the web3 object to use it's original methods 
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call() //we use call with a web3 object when we are fetching data

      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
    }
    else {
      window.alert('dappToken contract not deployed to detect network')
    }

    const tokenFarmData = TokenFarm.networks[networkId] // fetches the info under Network {networkId variable{<All this info>}} for the tokenFarm in the tokenFarm.json file

    if (tokenFarmData){ //if there is a networkId

      //tokenFarm.abi is a binary file that holds all the information on tokenFarm.abi 
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address) //function from web3.eth which uploads the contract to the website
      this.setState({tokenFarm}) //sets the variable in the constructor
      // methods allows the web3 object to use it's original methods 
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call() //we use call with a web3 object when we are fetching data
      this.setState({ stakingBalance: stakingBalance.toString() })
    }
    else {
      window.alert('tokenFarm contract not deployed to detect network')
    }

    this.setState({ loading : false })
  }

  async loadWeb3(){ //this function connects app to the blockchain // used all the time
    if (window.ethereum) { //if ethereum browser
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web33){ // if web3 object exist then
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{ //if neither
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  


  stakeTokens = async (amount) => {
    this.setState({ loading: true }) //set loading
    await this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account })//.on('transactionHash', (hash) => { //approve sending
    
    await this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => { //this.state.account because the money is already in the tokenFarm contract
    //  //stake the tokens
      
    this.setState({ loading: false}) // set loading false
  })
}

  unstakeTokens = (amount) => {
    this.setState({loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false }) //once you get the transaction hash you can turn loading off
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {}, //This is an empty object
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true // we have this because while the apps loading we don't wanna show content on the page
    }
  }

  render() {
    let content 
    if (this.state.loading){
      content = <p id="loader" className="text-center">Loading...</p>
    } 
    else{
      content = <Main
        daiTokenBalance={this.state.daiTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={ this.unstakeTokens }
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
