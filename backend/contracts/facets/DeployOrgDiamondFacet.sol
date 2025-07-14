// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OrganisationFacet} from "../organisation/facets/OrganisationFacet.sol";
import "../facets/DiamondCutFacet.sol";
import "../facets/DiamondLoupeFacet.sol";
import "../facets/OwnershipFacet.sol";
import "../interfaces/IDeployOrgDiamondFacet.sol";
import "../interfaces/IDiamondCut.sol";
import "../libraries/LibUtils.sol";
import "../interfaces/IOrganisationSelectorsFacet.sol";
import "../interfaces/IOtherSelectorFacets.sol";

contract DeployOrgDiamondFacet is IDeployOrgDiamondFacet {
    function init_selector(address _organisationsSelectorsFacet, address _otherSelectorsFacet) external {
        LibUtils.initializeSelectorsFacet(_organisationsSelectorsFacet);
        LibUtils.initializeOtherSelectorsFacet(_otherSelectorsFacet);
    }

    function deployOrgDiamond() external returns (FacetCut[] memory) {
        LibUtils.Factory storage f = LibUtils.factoryStorage();

        IOtherSelectorFacets otherSelectorsFacet = IOtherSelectorFacets(f.OtherSelectorFacet);

        IOrganisationSelectorsFacet orgSelectorsFacet = IOrganisationSelectorsFacet(f.OrganisationSelectorsFacet);

        (
            DiamondCutFacet diamondCutFacet,
            DiamondLoupeFacet diamondLoupeFacet,
            OwnershipFacet ownershipFacet,
            OrganisationFacet organisationFacet
        ) = otherSelectorsFacet.setupFacets();

        FacetCut[] memory cut = new FacetCut[](4);

        bytes4[] memory diamondCutSelectors = new bytes4[](1);
        diamondCutSelectors[0] = IDiamondCut.diamondCut.selector;

        cut[0] = FacetCut({
            facetAddress: address(diamondCutFacet),
            action: FacetCutAction.Add,
            functionSelectors: diamondCutSelectors
        });
        cut[1] = FacetCut({
            facetAddress: address(diamondLoupeFacet),
            action: FacetCutAction.Add,
            functionSelectors: otherSelectorsFacet.getLoupeSelectors()
        });
        cut[2] = FacetCut({
            facetAddress: address(ownershipFacet),
            action: FacetCutAction.Add,
            functionSelectors: otherSelectorsFacet.getOwnershipSelectors()
        });
        cut[3] = FacetCut({
            facetAddress: address(organisationFacet),
            action: FacetCutAction.Add,
            functionSelectors: orgSelectorsFacet.getOrganisationSelectors()
        });

        return cut;
    }
}
