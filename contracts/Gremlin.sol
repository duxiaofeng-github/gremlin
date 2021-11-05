pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Gremlin is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Gremlin", "GRE") {}

  function mintItem(address to, string memory tokenURI) public onlyOwner returns (uint256) {
    _tokenIds.increment();

    uint256 id = _tokenIds.current();

    _safeMint(to, id);
    _setTokenURI(id, tokenURI);

    return id;
  }
}
