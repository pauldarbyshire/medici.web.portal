const Medici = artifacts.require('Medici');
const Token = artifacts.require('Token');

function ether (n) {
    return new web3.BigNumber(web3.toWei(n, 'ether'));
}

function mdi (n) {
    return new web3.BigNumber(n * 1e18);
}

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

contract('Medici', function ([owner, wallet, buyer, seller]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const rate = new web3.BigNumber(5000);
    const value = ether(1);
    const tokens = rate.mul(value);
    const burnt = mdi(4000);

    before(async () => {
        medici = await Medici.deployed();
        const tokenAddress = await medici.token.call();
        token = Token.at(tokenAddress);
    })
   
    describe('Token and Medici creation', function () {
        it('requires a non-zero rate', async function () {
            await Medici.new(0, wallet, token.address).should.not.be.fulfilled;
        });
    
        it('requires a non-null wallet', async function () {
            await Medici.new(rate, ZERO_ADDRESS, token.address).should.not.be.fulfilled;
        });

        it('should create Token and Medici with correct parameters', async () => {
            medici.should.exist
            token.should.exist
        })

        it('should be token owner', async function () {
            (await token.owner()).should.equal(medici.address);
        });
    })

    describe('Token details', function () {
        it('has a name', async () => {
          const name = await token.name();
          assert.equal(name, 'Medici');
        })
        
        it('has a symbol', async () => {
          const symbol = await token.symbol();
          assert.equal(symbol, 'MDI');
        })
        
        it('has 18 decimals', async () => {
          const decimals = await token.decimals()
          assert(decimals.eq(18))
        });
    });

    describe('accepting payments', function () {
        it('should not accept zero payments', async function () {
            //await medici.send(0).should.not.be.fulfilled;
            await medici.buyTokens(seller, { value: 0, from: buyer }).should.not.be.fulfilled;
        })

        it('should accept payments', async function () {
            await medici.send(value).should.be.fulfilled;
        })

        it('should increase total MDI supply', async () => {
            const tsupply = await token.totalSupply();
            console.log("tsupply", tsupply.toNumber() / 1e18);
            assert.equal(tsupply.toNumber() / 1e18, 5000, 'Total Supply was not calculated correctly')
        })

        it('should assign tokens to buyer', async function () {
            const pre = await token.balanceOf(buyer);
            console.log("pre", pre.toNumber() / 1e18);
            await medici.sendTransaction({ value: value, from: buyer });
            const post = await token.balanceOf(buyer);
            console.log("post", post.toNumber() / 1e18);
            (await token.balanceOf(buyer)).should.be.bignumber.equal(tokens);
        });

        it('should increase total MDI supply', async () => {
            const tsupply = await token.totalSupply();
            console.log("tsupply", tsupply.toNumber() / 1e18);
            assert.equal(tsupply.toNumber() / 1e18, 10000, 'Total Supply was not calculated correctly')
        })

        it('should forward funds to wallet', async function () {
            const pre = await web3.eth.getBalance(wallet);
            console.log("pre", pre.toNumber() / 1e18);
            await medici.sendTransaction({ value, from: buyer });
            const post = await web3.eth.getBalance(wallet);
            console.log("post", post.toNumber() / 1e18);
            post.minus(pre).should.be.bignumber.equal(value);
        });

        it('should increase total MDI supply', async () => {
            const tsupply = await token.totalSupply();
            console.log("tsupply", tsupply.toNumber() / 1e18);
            assert.equal(tsupply.toNumber() / 1e18, 15000, 'Total Supply was not calculated correctly')
        })

        it('should not accept payments in PAUSE', async function () {
            await medici.pause({ from: owner })
            await medici.sendTransaction({ value, from: buyer }).should.not.be.fulfilled
        })
      
        it('should resume accepting payments after PAUSE is over', async function () {
            await medici.unpause({ from: owner })
            await medici.sendTransaction({ value, from: buyer }).should.be.fulfilled
        })

        it('should increase total MDI supply', async () => {
            const tsupply = await token.totalSupply();
            console.log("tsupply", tsupply.toNumber() / 1e18);
            assert.equal(tsupply.toNumber() / 1e18, 20000, 'Total Supply was not calculated correctly')
        })
    })

    describe('burning tokens', function () {
        it('should burn tokens', async function () {
            await token.burn(burnt, { from: owner });
        })

        it('should decrease total MDI supply', async () => {
            const tsupply = await token.totalSupply();
            console.log("tsupply", tsupply.toNumber() / 1e18);
            assert.equal(tsupply.toNumber() / 1e18, 16000, 'Total Supply was not calculated correctly')
        })
    })

    describe.skip('transactions log', function () {
        it('should log transaction', async function () {
            await medici.send(value).should.be.fulfilled;
            const { logs } = await medici.sendTransaction({ value: value, from: buyer });
            const event = logs.find(e => e.event === 'TokensPurchased');
            console.log(logs);
            event.args.purchaser.should.equal(buyer);
            //event.args.beneficiary.should.equal(investor);
            event.args.value.should.be.bignumber.equal(value);
            //event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
            //should.exist(event);
        })
    })

    describe.skip('contract destruction', function () {
        it('should destroy contract', async () => {
            await medici.destroy({ from: owner });
            await medici.sendTransaction({ value, from: buyer }).should.not.be.fulfilled
        })
    })
});