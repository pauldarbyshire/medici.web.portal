let Medici = artifacts.require('Medici');
let Token = artifacts.require('Token');
  
module.exports = function (deployer) {

    const rate = new web3.BigNumber(5000); // 1 ETH = 5000 MDI
    //const wallet = web3.eth.accounts[1];   // Change to [9] when migrating
    const wallet = '0xDD59985Bbe7E5F4FF836C8182Cc87EFD3cFF1341' 
   
    return deployer
        .then(() => {
            return deployer.deploy(Token);
        })
        .then(() => {
            return deployer.deploy(Medici,
                rate,
                wallet,
            Token.address
        );
    }).then(() => {
    let tokenInstance = Token.at(Token.address);
    tokenInstance.transferOwnership(Medici.address);
    console.log(`Successful deployment: \nMedici deployed at ${Medici.address} \nToken deployed at ${Token.address}`);
    }).catch(function (err) {
    console.log('Deplyoment failed!');
    console.log(err);
    });
};