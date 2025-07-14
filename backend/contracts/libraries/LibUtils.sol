// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IFactory.sol";
import "../libraries/Error.sol";
import "../../lib/forge-std/src/console.sol";

library LibUtils {
    struct Factory {
        address Admin;
        address organisationAdmin;
        address certificateFactory;
        bool initialized;
        address[] Organisations;
        mapping(address => bool) validOrganisation;
        mapping(address => mapping(address => uint256)) studentOrganisationIndex;
        mapping(address => address[]) memberOrganisations;
        mapping(address => bool) uniqueStudent;
        uint256 totalUsers;
        address cert_Admin;
        address DeployOrgDiamondFacet;
        address Create0rganisationFacetAddress;
        address SetUpFacet;
        address OrganisationSelectorsFacet;
        address OtherSelectorFacet;
    }

    bytes32 constant FACTORY_STORAGE_POSITION = keccak256("diamond.organisation.factory.lib.utils.storage");

    function factoryStorage() internal pure returns (Factory storage f) {
        bytes32 position = FACTORY_STORAGE_POSITION;
        assembly {
            f.slot := position
        }
    }

    function initializeSelectorsFacet(address _selectorsFacet) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();
        f.OrganisationSelectorsFacet = _selectorsFacet;
    }

    function initializeOtherSelectorsFacet(address _otherSelectorsFacet) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();
        f.OtherSelectorFacet = _otherSelectorsFacet;
    }

    function initializeOrgFactoryFacet(address _certificateFactory) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();
        if (f.initialized) {
            revert Error.ALREADY_INITIALIZED();
        }

        f.Admin = msg.sender;
        f.certificateFactory = _certificateFactory;
        f.initialized = true;
    }

    function initializeCreateOrganisationFacet(address _createOrganisationFacet) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();
        if (f.Create0rganisationFacetAddress != address(0)) revert Error.ALREADY_INITIALIZED();
        f.Create0rganisationFacetAddress = _createOrganisationFacet;
    }

    function initDeployOrgDiamondFacet(address _deployOrgDiamond) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();
        if (f.DeployOrgDiamondFacet != address(0)) {
            revert Error.ALREADY_INITIALIZED();
        }
        f.DeployOrgDiamondFacet = _deployOrgDiamond;
    }

    function revoke(address[] calldata _individual) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();

        if (!f.validOrganisation[msg.sender]) {
            revert Error.UNAUTHORIZED_OPERATION();
        }

        uint256 individualLength = _individual.length;

        for (uint256 i; i < individualLength; i++) {
            address uniqueIndividual = _individual[i];

            uint256 organisationIndex = f.studentOrganisationIndex[uniqueIndividual][msg.sender];
            uint256 orgLength = f.memberOrganisations[uniqueIndividual].length;

            f.memberOrganisations[uniqueIndividual][organisationIndex] =
                f.memberOrganisations[uniqueIndividual][orgLength - 1];

            f.memberOrganisations[uniqueIndividual].pop();
        }
    }

    function register(Individual[] calldata _individual) internal {
        LibUtils.Factory storage f = LibUtils.factoryStorage();

        if (!f.validOrganisation[msg.sender]) {
            revert Error.UNAUTHORIZED_OPERATION();
        }
        uint256 individualLength = _individual.length;

        for (uint256 i; i < individualLength; i++) {
            address uniqueStudentAddr = _individual[i]._address;

            uint256 orgLength = f.memberOrganisations[uniqueStudentAddr].length;

            f.studentOrganisationIndex[uniqueStudentAddr][msg.sender] = orgLength;

            f.memberOrganisations[uniqueStudentAddr].push(msg.sender);

            if (f.uniqueStudent[uniqueStudentAddr] == false) {
                f.totalUsers++;
                f.uniqueStudent[uniqueStudentAddr] = true;
            }
        }
    }
}
