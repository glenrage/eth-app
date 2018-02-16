const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//WEB3 is always contructor
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  //use one of those accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hello'] })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address); //ok makes assertion that value passed in exists
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hello');
  });

  it('can change message', async () => {
    await inbox.methods.setMessage('Fuck').send({ from: accounts[0] }); //send calls function to the network

    const message = await inbox.methods.message().call();
    assert.equal(message, 'Fuck');
  });
});
