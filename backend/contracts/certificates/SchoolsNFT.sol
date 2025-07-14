// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../../lib/openzeppelin-contracts.git/contracts/token/ERC1155/ERC1155.sol";
import "../libraries/Error.sol";

contract SchoolsNFT is ERC1155 {
    string public name;
    string public symbol;
    address public admin;
    uint256 totalTokenId = 0;
    mapping(bytes => string) public daysIdToUri;
    mapping(bytes => uint256) public daysIdToTokenId;
    address public organisationAddress;
    bool private initialized;

    constructor(string memory _name, string memory _symbol, string memory _uri, address _admin) ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
        admin = _admin;
        initialized = false;
    }

    modifier onlyOwner() {
        if (msg.sender != admin && msg.sender != organisationAddress) {
            revert Error.NOT_PERMITTED();
        }
        _;
    }

    function mint(address _to, bytes memory _daysId, uint256 _amount) public onlyOwner {
        uint256 tokenId = daysIdToTokenId[_daysId];
        _mint(_to, tokenId, _amount, "");
    }

    function batchMintForDay(bytes memory _dayId, address[] memory _students, uint256[] memory _amount)
        public
        onlyOwner
    {
        if (_students.length != _amount.length) {
            revert Error.LENGTH_MISMATCH();
        }
        for (uint256 i = 0; i < _students.length; i++) {
            uint256 tokenId = daysIdToTokenId[_dayId];
            _mint(_students[i], tokenId, _amount[i], "");
        }
    }

    function getTotalAttendnceSignedForDay(bytes memory _daysId) external view returns (uint256) {
        uint256 tokenId = daysIdToTokenId[_daysId];
        uint256[] memory balances = new uint256[](1);
        balances[0] = tokenId;
        uint256[] memory result = balanceOfBatch(new address[](1), balances);
        return result[0];
    }

    function setDayUri(bytes memory id, string memory _uri) public onlyOwner {
        daysIdToTokenId[id] = totalTokenId;
        daysIdToUri[id] = _uri;
        totalTokenId++;
    }

    function getDayUri(bytes memory id) public view returns (string memory _dayUri) {
        _dayUri = daysIdToUri[id];
    }

    function setOrganisationAddress(address _organisationAddress) external {
        if (!initialized) {
            if (_organisationAddress == address(0)) {
                revert Error.INVALID_ADDRESS();
            }

            organisationAddress = _organisationAddress;
            initialized = true;
        } else {
            if (msg.sender != admin && msg.sender != organisationAddress) {
                revert Error.NOT_PERMITTED();
            }

            if (_organisationAddress == address(0)) {
                revert Error.INVALID_ADDRESS();
            }

            organisationAddress = _organisationAddress;
        }
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public pure override {
        revert Error.TOKEN_IS_SOUL_BUND();
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public override {
        revert Error.TOKEN_IS_SOUL_BUND();
    }
}
