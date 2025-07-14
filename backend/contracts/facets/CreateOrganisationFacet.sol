// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../certificates/certificateFactory.sol";
import "../interfaces/IDeployOrgDiamondFacet.sol";
import "../libraries/LibUtils.sol";
import {OrganisationFacet} from "../organisation/facets/OrganisationFacet.sol";
import "../interfaces/ICreateOrganisationFacet.sol";
import "../organisation/Organisation.sol";
import "../libraries/Events.sol";

contract CreateOrganisationFacet is ICreateOrganisationFacet {
    function create_organisation(
        string memory _organisation,
        string memory _cohort,
        string memory _uri,
        string memory _adminName,
        address creator,
        address relayer
    ) external returns (address organisation, address Nft, address mentorsSpok, address certificate) {
        LibUtils.Factory storage f = LibUtils.factoryStorage();

        f.organisationAdmin = creator;

        if (f.DeployOrgDiamondFacet == address(0)) revert Error.DEPLOY_ORG_DIAMOND_FACET_NOT_INITIALIZED();

        IDeployOrgDiamondFacet deployFacet = IDeployOrgDiamondFacet(f.DeployOrgDiamondFacet);

        deployFacet.init_selector(f.OrganisationSelectorsFacet, f.OtherSelectorFacet);

        FacetCut[] memory cut = deployFacet.deployOrgDiamond();

        if (cut.length != 4) {
            revert Error.INVALID_NUMBER_OF_FACETS_RETURNED();
        }

        (address AttendanceAddr, address CertificateAddr, address mentorsSpokAddr) =
            certificateFactory(f.certificateFactory).completePackage(_organisation, _cohort, _uri, creator);

        bytes memory initCalldata = abi.encodeWithSelector(
            OrganisationFacet.initializeContracts.selector,
            AttendanceAddr,
            mentorsSpokAddr,
            CertificateAddr,
            f.certificateFactory,
            relayer
        );

        Organisation orgAdd = new Organisation(creator, cut, address(this), initCalldata);

        address organisationAddress = address(orgAdd);

        OrganisationFacet(address(organisationAddress)).deploy(_organisation, _cohort, creator, _adminName, _uri);

        SchoolsNFT(AttendanceAddr).setOrganisationAddress(organisationAddress);

        Certificate(CertificateAddr).setOrganisationAddress(organisationAddress);

        Certificate(mentorsSpokAddr).setOrganisationAddress(organisationAddress);

        f.Organisations.push(address(organisationAddress));

        f.validOrganisation[address(organisationAddress)] = true;

        uint256 orgLength = f.memberOrganisations[creator].length;

        f.studentOrganisationIndex[creator][address(organisationAddress)] = orgLength;

        f.memberOrganisations[creator].push(address(orgAdd));

        Nft = AttendanceAddr;

        certificate = CertificateAddr;

        mentorsSpok = mentorsSpokAddr;

        organisation = organisationAddress;

        emit Events.DebugLog(creator, orgLength, address(organisationAddress), f.memberOrganisations[msg.sender].length);

        return (organisation, Nft, mentorsSpok, certificate);
    }
}
