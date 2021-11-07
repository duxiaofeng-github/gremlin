// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./gremlin.sol";

contract GremlinMarketplace {
  uint256 public offerCount;
  mapping(uint256 => _Offer) public offers;
  Gremlin gremlin;

  struct _Offer {
    uint256 offerId;
    uint256 id;
    address user;
    uint256 price;
    bool fulfilled;
    bool cancelled;
  }

  event Offer(uint256 offerId, uint256 id, address user, uint256 price, bool fulfilled, bool cancelled);
  event OfferFilled(uint256 offerId, uint256 id, address newOwner);
  event OfferCancelled(uint256 offerId, uint256 id, address owner);

  constructor(address _gremlin) {
    gremlin = Gremlin(_gremlin);
  }

  function makeOffer(uint256 _id, uint256 _price) public {
    gremlin.transferFrom(msg.sender, address(this), _id);
    offerCount++;
    offers[offerCount] = _Offer(offerCount, _id, msg.sender, _price, false, false);
    emit Offer(offerCount, _id, msg.sender, _price, false, false);
  }

  function fillOffer(uint256 _offerId) public payable {
    _Offer storage _offer = offers[_offerId];
    require(_offer.offerId == _offerId, "The offer must exist");
    require(_offer.user != msg.sender, "The owner of the offer cannot fill it");
    require(_offer.price == msg.value, "The ETH amount should match with the NFT Price");
    require(!_offer.fulfilled, "An offer cannot be fulfilled twice");
    require(!_offer.cancelled, "A cancelled offer cannot be fulfilled");
    payable(_offer.user).transfer(msg.value);
    gremlin.transferFrom(address(this), msg.sender, _offer.id);
    _offer.fulfilled = true;
    emit OfferFilled(_offer.offerId, _offer.id, msg.sender);
  }

  function cancelOffer(uint256 _offerId) public {
    _Offer storage _offer = offers[_offerId];
    require(_offer.offerId == _offerId, "The offer must exist");
    require(_offer.user == msg.sender, "The offer can only be canceled by the owner");
    require(_offer.fulfilled == false, "A fulfilled offer cannot be cancelled");
    require(_offer.cancelled == false, "An offer cannot be cancelled twice");
    gremlin.transferFrom(address(this), msg.sender, _offer.id);
    _offer.cancelled = true;
    emit OfferCancelled(_offer.offerId, _offer.id, msg.sender);
  }

  // Fallback: reverts if Ether is sent to this smart-contract by mistake
  fallback() external {
    revert();
  }
}
