import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    value: '',
    balance: '',
    message: ''
  };

  async componentDidMount() {
    //metamask has default account, no need to call from accounts
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({
      manager,
      players,
      balance
    });
  }
  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: 'Waiting on transaction success...'
    });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have entered the lottery!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    console.log(this.state.balance);
    console.log(this.state.players);
    web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h1>Lottery Contract</h1>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people entered in the
          lottery! The current balance of the prize is
          {web3.utils.fromWei(this.state.balance, 'ether')}
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h3>Want to play??</h3>
          <div>
            <label>Amount of ether to gamble</label>
            <input
              value={this.state.value}
              onChange={event =>
                this.setState({
                  value: event.target.value
                })
              }
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner? </h4>
        <button onClick={this.onClick}>Pick a Winner!</button>
        <hr />
        <h1>{this.state.message}</h1>

        <hr />
      </div>
    );
  }
}

export default App;
