// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../lib/openzeppelin-contracts.git/contracts/token/ERC721/ERC721.sol";
import "../../lib/openzeppelin-contracts.git/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../lib/openzeppelin-contracts.git/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts.git/contracts/utils/Counters.sol";
import "../libraries/Error.sol";

contract Certificate is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    address public organisationAddress;
    address public issueingInstituion;
    bool initialized;
    Counters.Counter private _tokenIdCounter;

    modifier OnlyAuthorized() {
        if (msg.sender != issueingInstituion && msg.sender != organisationAddress) {
            revert Error.UNAUTHORIZED_CALLER();
        }
        _;
    }

    constructor(string memory name, string memory symbol, address institution)
        ERC721(name, symbol)
        Ownable(institution)
    {
        issueingInstituion = institution;
    }

    function safeMint(address to, string memory uri) public OnlyAuthorized {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function batchMintTokens(address[] memory users, string memory uri) public OnlyAuthorized {
        for (uint256 i = 0; i < users.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(users[i], tokenId);
            _setTokenURI(tokenId, uri);
        }
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setOrganisationAddress(address _organisationAddress) external {
        if (_organisationAddress == address(0)) {
            revert Error.INVALID_ADDRESS();
        }
        organisationAddress = _organisationAddress;
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        super.transferOwnership(newOwner);
    }

    function transferFrom(address from, address to, uint256 tokenId) public pure override(ERC721, IERC721) {
        revert Error.TOKEN_IS_SOUL_BUND();
    }
}
