pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract Token is  BurnableToken, PausableToken, MintableToken {
    string public name = "Medici";
    string public symbol = "MDI";
    uint8 public decimals = 18;
}
