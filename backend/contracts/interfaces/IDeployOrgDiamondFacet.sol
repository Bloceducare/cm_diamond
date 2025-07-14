// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../facets/DiamondCutFacet.sol";

interface IDeployOrgDiamondFacet {
    function init_selector(address _organisationSelectorsFacet, address _otherSelectorsFacet) external;
    function deployOrgDiamond() external returns (FacetCut[] memory);
}
