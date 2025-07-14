// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOrganisationSelectorsFacet {
    function getOrganisationSelectors() external pure returns (bytes4[] memory);
}
