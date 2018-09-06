pragma solidity 0.4.24;

import "./Token.sol";

import "../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Destructible.sol";

contract Medici is MintedCrowdsale, Pausable, Destructible {

    address public wallet;  /// Wallet address to receive ETH
    uint256 public rate;    /// Conversion rate
    uint256 public amount;  /// ETH amount

    // Events
    //event ETHTransfer(string text);
    
    constructor(
        uint256 _rate,
        address _wallet,
        MintableToken _token
    )
    public Crowdsale(_rate, _wallet, _token)
    {
        require(_wallet != 0x0);
        require(_wallet != address(0)); 
        require(_rate > 0);

        wallet = _wallet;
        rate = _rate;
    }

    // Setters
    // Set rate
    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    // Set wallet
    function setWallet(address _wallet) public onlyOwner {
        wallet = _wallet;
    }

    function () external payable {
      //  uint256 tokensMintedAfterPurchase = msg.value.mul(rate);
       // if ((stage == CrowdsaleStage.PreICO) && (token.totalSupply() + tokensMintedAfterPurchase > totalTokensForSale)) {
       //     msg.sender.transfer(msg.value); // Refund them
       //     emit EthRefunded("PreICO Limit Hit", tokensMintedAfterPurchase);
       //     return;
       // }

        buyTokens(msg.sender);

       // if (stage == CrowdsaleStage.PreICO) {
       //     ETHRaisedDuringPreICO = ETHRaisedDuringPreICO.add(msg.value);
       // }
    }

    function buyTokens(address beneficiary) public payable whenNotPaused {
        //require(msg.value > 0);

        super.buyTokens(beneficiary);
    }

    //function _forwardFunds() internal {
    //    wallet.transfer(msg.value);
    //    emit ETHTransfer("forwarding funds to wallet");
    //}

    // Kill smart contract code and tranfer funds.
   // function destroy() public onlyOwner {
   //     selfdestruct(owner);
   // }

   // function destroyAndSend(address _recipient) public onlyOwner {
   //     selfdestruct(_recipient);
   // }
}
