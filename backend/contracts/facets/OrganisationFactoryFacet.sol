// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CreateOrganisationFacet.sol";
import "../libraries/LibUtils.sol";
import "../../lib/forge-std/src/console.sol";

contract OrganisationFactoryFacet {
    function initializeAll(
        address _certificateFactory,
        address _createOrganisationFacet,
        address _deployOrgDiamondFacet,
        address _organisationsSelectorsFacet,
        address _otherSelectorsFacet
    ) public {
        LibUtils.initializeOrgFactoryFacet(_certificateFactory);
        LibUtils.initializeCreateOrganisationFacet(_createOrganisationFacet);
        LibUtils.initDeployOrgDiamondFacet(_deployOrgDiamondFacet);
        LibUtils.initializeSelectorsFacet(_organisationsSelectorsFacet);
        LibUtils.initializeOtherSelectorsFacet(_otherSelectorsFacet);

        console.log("CertificateFactory set to:", LibUtils.factoryStorage().certificateFactory);
        console.log("CreateOrganisationFacet set to:", LibUtils.factoryStorage().Create0rganisationFacetAddress);
        console.log("DeployOrgDiamondFacet set to:", LibUtils.factoryStorage().DeployOrgDiamondFacet);
        console.log("OrganisationSelectorsFacet set to:", LibUtils.factoryStorage().OrganisationSelectorsFacet);
        console.log("OtherSelectorFacet set to:", LibUtils.factoryStorage().OtherSelectorFacet);
    }

    function deployOrgDiamondFacet() external view returns (address) {
        return LibUtils.factoryStorage().DeployOrgDiamondFacet;
    }

    function createorganisation(
        string memory _organisation,
        string memory _cohort,
        string memory _uri,
        string memory _adminName,
        address _relayer
    ) external returns (address organisation, address Nft, address mentorsSpok, address certificate) {
        return CreateOrganisationFacet(address(this)).create_organisation(
            _organisation, _cohort, _uri, _adminName, msg.sender, _relayer
        );
    }

    function getOrganizations() public view returns (address[] memory) {
        LibUtils.Factory storage f = LibUtils.factoryStorage();

        return f.Organisations;
    }

    function getUserOrganisatons(address _userAddress) public view returns (address[] memory) {
        LibUtils.Factory storage f = LibUtils.factoryStorage();

        return (f.memberOrganisations[_userAddress]);
    }

    function revoke(address[] calldata _individual) external {
        LibUtils.revoke(_individual);
    }

    function register(Individual[] calldata _individual) external {
        LibUtils.register(_individual);
    }
}
