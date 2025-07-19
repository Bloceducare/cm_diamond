// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Script.sol";
import "../contracts/facets/DiamondCutFacet.sol";
import "../contracts/facets/DiamondLoupeFacet.sol";
import "../contracts/facets/OwnershipFacet.sol";
import "../contracts/facets/OrganisationFactoryFacet.sol";
import "../contracts/facets/CreateOrganisationFacet.sol";
import "../contracts/facets/DeployOrgDiamondFacet.sol";
import "../contracts/organisation/facets/OrganisationFacet.sol";
import "../contracts/Diamond.sol";
import "../contracts/certificates/certificateFactory.sol";
import {FacetCut, FacetCutAction} from "../contracts/interfaces/IDiamondCut.sol";
import "../contracts/facets/OtherSelectorFacets.sol";
import "../contracts/facets/OrganisationSelectorsFacet.sol";

contract DiamondUpgradeScript is Script {
    function deployMainDiamond() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address: %s", deployer);
        vm.startBroadcast(deployerPrivateKey);
        address relayer = vm.envAddress("RELAYER");

        DiamondCutFacet dCut = new DiamondCutFacet();
        console.log("DiamondCutFacet deployed: %s", address(dCut));

        DiamondLoupeFacet dLoupe = new DiamondLoupeFacet();
        console.log("DiamondLoupeFacet deployed: %s", address(dLoupe));

        OwnershipFacet ownerF = new OwnershipFacet();
        console.log("OwnershipFacet deployed: %s", address(ownerF));

        DeployOrgDiamondFacet deployOrgFacet = new DeployOrgDiamondFacet();
        console.log("DeployOrgDiamondFacet deployed: %s", address(deployOrgFacet));

        CreateOrganisationFacet createOrgFacet = new CreateOrganisationFacet();
        console.log("CreateOrganisationFacet deployed: %s", address(createOrgFacet));

        certificateFactory certFactory = new certificateFactory();
        console.log("certificateFactory deployed: %s", address(certFactory));

        OrganisationFactoryFacet orgFactoryFacet = new OrganisationFactoryFacet();
        console.log("OrganisationFactoryFacet deployed: %s", address(orgFactoryFacet));

        OtherSelectorFacets otherSelectorFacets = new OtherSelectorFacets();
        console.log("OtherSelectorFacets deployed: %s", address(otherSelectorFacets));

        OrganisationSelectorsFacet organisationSelectorsFacet = new OrganisationSelectorsFacet();
        console.log("OrganisationSelectorsFacet deployed: %s", address(organisationSelectorsFacet));

        FacetCut[] memory cut = new FacetCut[](8);
        cut[0] = FacetCut({
            facetAddress: address(dLoupe),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("DiamondLoupeFacet")
        });
        cut[1] = FacetCut({
            facetAddress: address(ownerF),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OwnershipFacet")
        });
        cut[2] = FacetCut({
            facetAddress: address(deployOrgFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("DeployOrgDiamondFacet")
        });
        cut[3] = FacetCut({
            facetAddress: address(createOrgFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("CreateOrganisationFacet")
        });
        cut[4] = FacetCut({
            facetAddress: address(orgFactoryFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OrganisationFactoryFacet")
        });
        cut[5] = FacetCut({
            facetAddress: address(otherSelectorFacets),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OtherSelectorFacets")
        });
        cut[6] = FacetCut({
            facetAddress: address(organisationSelectorsFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OrganisationSelectorsFacet")
        });
        cut[7] = FacetCut({
            facetAddress: address(dCut),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("DiamondCutFacet")
        });

        bytes memory initCalldata = abi.encodeWithSelector(
            OrganisationFactoryFacet.initializeAll.selector,
            address(certFactory),
            address(createOrgFacet),
            address(deployOrgFacet),
            address(organisationSelectorsFacet),
            address(otherSelectorFacets)
        );

        console.log("Deploying Diamond...");
        Diamond diamond = new Diamond(deployer, cut, address(orgFactoryFacet), initCalldata);
        address diamondAddress = address(diamond);
        console.log("Main Diamond (factory) deployed: %s", diamondAddress);

        bytes memory constructorArgs = abi.encode(deployer, cut, address(orgFactoryFacet), initCalldata);
        console.log("Constructor arguments (hex): %s", vm.toString(constructorArgs));

        console.log("Creating organisation...");
        OrganisationFactoryFacet orgFactory = OrganisationFactoryFacet(diamondAddress);
        (address organisation, address OrganisationNft, address OrganisationMentorsSpok, address OrganizationCertNft) =
        orgFactory.createorganisation(
            "WEB3BRIDGE",
            "COHORT XIII",
            "https://gray-quiet-egret-248.mypinata.cloud/ipfs/QmfJwH4SoW3PgnpQ5fhM1NaH9Buf7uDRkVSB1sKPk9cKkY",
            "Mr.Sam",
            relayer
        );

        console.log("Organisation deployed: %s", organisation);
        console.log("OrganisationNft: %s", OrganisationNft);
        console.log("OrganisationMentorsSpok: %s", OrganisationMentorsSpok);
        console.log("OrganizationCertNft: %s", OrganizationCertNft);

        vm.stopBroadcast();

        writeAddressesToFile(address(orgFactoryFacet), "orgFactoryFacet");
        writeAddressesToFile(diamondAddress, "Diamond address");
        writeAddressesToFile(organisation, "Organisation address");
        writeAddressesToFile(OrganisationNft, "OrganisationNft");
    }

    function writeAddressesToFile(address addr, string memory text) public {
        string memory filename = "./lisk_contracts_new2.txt";

        vm.writeLine(filename, "-------------------------------------------------");
        vm.writeLine(filename, text);
        vm.writeLine(filename, vm.toString(addr));
        vm.writeLine(filename, "-------------------------------------------------");
    }

    function upgradeOrganisationSelectorsFacet(address mainDiamondAddress) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy new facet
        OrganisationSelectorsFacet newSelectorFacet = new OrganisationSelectorsFacet();
        console.log("New OrganisationSelectorsFacet deployed: %s", address(newSelectorFacet));

        // Get new selectors
        bytes4[] memory newSelectors = newSelectorFacet.getOrganisationSelectors();
        console.log("New selectors count: %s", newSelectors.length);
        for (uint256 i = 0; i < newSelectors.length; i++) {
            console.log("New selector %s: %s", i, vm.toString(newSelectors[i]));
        }
        require(newSelectors.length == 41, "Incorrect selector count");

        // Get old selectors
        IDiamondLoupe loupe = IDiamondLoupe(mainDiamondAddress);
        bytes4[] memory oldSelectors = loupe.facetFunctionSelectors(0x8D7635e668F7f2ba7B24EF16C2abB3cF8FD18A5c);
        console.log("Old selectors count: %s", oldSelectors.length);
        for (uint256 i = 0; i < oldSelectors.length; i++) {
            console.log("Old selector %s: %s", i, vm.toString(oldSelectors[i]));
        }

        // Prepare FacetCut actions
        bytes4[] memory selectorsToAdd = new bytes4[](newSelectors.length);
        uint256 addCount = 0;
        bytes4[] memory selectorsToReplace = new bytes4[](1); // Only d77f6bfb if it exists in newSelectors
        uint256 replaceCount = 0;
        bytes4[] memory selectorsToRemove = new bytes4[](1); // Only d77f6bfb if not in newSelectors
        uint256 removeCount = 0;

        // Check if d77f6bfb should be replaced or removed
        bytes4 oldSelector = 0xd77f6bfb;
        bool oldSelectorInNew = false;
        for (uint256 i = 0; i < newSelectors.length; i++) {
            if (newSelectors[i] == oldSelector) {
                selectorsToReplace[0] = oldSelector;
                replaceCount = 1;
                oldSelectorInNew = true;
            } else {
                selectorsToAdd[addCount] = newSelectors[i];
                addCount++;
            }
        }
        if (!oldSelectorInNew) {
            selectorsToRemove[0] = oldSelector;
            removeCount = 1;
        }

        // Resize add array
        bytes4[] memory finalAddSelectors = new bytes4[](addCount);
        for (uint256 i = 0; i < addCount; i++) {
            finalAddSelectors[i] = selectorsToAdd[i];
        }

        // Prepare diamond cut
        uint256 cutLength = (addCount > 0 ? 1 : 0) + (replaceCount > 0 ? 1 : 0) + (removeCount > 0 ? 1 : 0);
        FacetCut[] memory cut = new FacetCut[](cutLength);
        uint256 cutIndex = 0;

        if (addCount > 0) {
            cut[cutIndex] = FacetCut({
                facetAddress: address(newSelectorFacet),
                action: FacetCutAction.Add,
                functionSelectors: finalAddSelectors
            });
            cutIndex++;
        }
        if (replaceCount > 0) {
            cut[cutIndex] = FacetCut({
                facetAddress: address(newSelectorFacet),
                action: FacetCutAction.Replace,
                functionSelectors: selectorsToReplace
            });
            cutIndex++;
        }
        if (removeCount > 0) {
            cut[cutIndex] = FacetCut({
                facetAddress: address(0),
                action: FacetCutAction.Remove,
                functionSelectors: selectorsToRemove
            });
        }

        // Execute diamondCut
        (bool success, bytes memory result) = mainDiamondAddress.call(
            abi.encodeWithSignature("diamondCut((address,uint8,bytes4[])[],address,bytes)", cut, address(0), "")
        );
        if (!success) {
            if (result.length > 0) {
                revert(string(abi.decode(result, (string))));
            } else {
                revert("Diamond upgrade failed: no reason provided");
            }
        }
        console.log("Successfully updated OrganisationSelectorsFacet");

        // Verify upgrade
        address facetAddress = loupe.facetAddress(newSelectors[0]);
        require(facetAddress == address(newSelectorFacet), "Facet not updated correctly");
        console.log("Verified new facet address: %s", facetAddress);

        vm.stopBroadcast();
        writeAddressesToFile(address(newSelectorFacet), "New OrganisationSelectorsFacet");
    }

    function revertOrganisationSelectorsFacetUpgrade(address mainDiamondAddress) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get selectors currently associated with the new facet
        IDiamondLoupe loupe = IDiamondLoupe(mainDiamondAddress);
        bytes4[] memory newFacetSelectors = loupe.facetFunctionSelectors(0x2Fc07DF7AFDb5EFDCE0C522b61c5D7bBBDB1089f);
        console.log("Current selectors count for new facet: %s", newFacetSelectors.length);
        for (uint256 i = 0; i < newFacetSelectors.length; i++) {
            console.log("New facet selector %s: %s", i, vm.toString(newFacetSelectors[i]));
        }

        // Prepare FacetCut to remove new selectors and restore old selector
        FacetCut[] memory cut = new FacetCut[](2);

        // Remove all selectors associated with the new facet
        cut[0] =
            FacetCut({facetAddress: address(0), action: FacetCutAction.Remove, functionSelectors: newFacetSelectors});

        // Restore the original selector for the old facet
        bytes4[] memory oldSelectors = new bytes4[](1);
        oldSelectors[0] = 0xd77f6bfb;
        cut[1] = FacetCut({
            facetAddress: 0xE4Bfc7f357391d328FD0f72E5646608C3D0342E2,
            action: FacetCutAction.Add,
            functionSelectors: oldSelectors
        });

        // Execute diamondCut
        (bool success, bytes memory result) = mainDiamondAddress.call(
            abi.encodeWithSignature("diamondCut((address,uint8,bytes4[])[],address,bytes)", cut, address(0), "")
        );
        if (!success) {
            if (result.length > 0) {
                revert(string(abi.decode(result, (string))));
            } else {
                revert("Diamond revert failed: no reason provided");
            }
        }
        console.log("Successfully reverted OrganisationSelectorsFacet to original");

        // Verify revert
        address facetAddress = loupe.facetAddress(0xd77f6bfb);
        require(facetAddress == 0xE4Bfc7f357391d328FD0f72E5646608C3D0342E2, "Facet not reverted correctly");
        console.log("Verified old facet address: %s", facetAddress);

        // Confirm new facet selectors are removed
        bytes4[] memory remainingSelectors = loupe.facetFunctionSelectors(0x2Fc07DF7AFDb5EFDCE0C522b61c5D7bBBDB1089f);
        require(remainingSelectors.length == 0, "New facet selectors not fully removed");
        console.log("Confirmed new facet has no selectors");

        vm.stopBroadcast();
        writeAddressesToFile(0xE4Bfc7f357391d328FD0f72E5646608C3D0342E2, "Restored OrganisationSelectorsFacet");
    }

    // uncomment to upgrade
    function upgradeChildDiamond(address childDiamondAddress) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the NEW version of OrganisationFacet
        OrganisationFacet newOrgFacet = new OrganisationFacet();
        console.log("New OrganisationFacet deployed:", address(newOrgFacet));

        // Get the specific selector for the new function
        bytes4 newTestUpgradeSelector = newOrgFacet.signAttendanceWithGas.selector;

        // Get all selectors from the new facet (which includes the new one and updated old ones)
        bytes4[] memory allNewFacetSelectors = generateSelectors("OrganisationFacet");

        // Separate selectors into those to Add (the truly new one) and those to Replace (the existing ones)
        bytes4[] memory selectorsToAddToNewFacet = new bytes4[](1);
        selectorsToAddToNewFacet[0] = newTestUpgradeSelector;

        bytes4[] memory selectorsToReplaceWithNewFacet = new bytes4[](allNewFacetSelectors.length - 1);
        uint256 replaceIndex = 0;
        for (uint256 i = 0; i < allNewFacetSelectors.length; i++) {
            if (allNewFacetSelectors[i] != newTestUpgradeSelector) {
                selectorsToReplaceWithNewFacet[replaceIndex++] = allNewFacetSelectors[i];
            }
        }

        // Prepare the diamondCut array
        // It will contain one entry for 'Add' and one for 'Replace'
        FacetCut[] memory cut = new FacetCut[](2);

        // First cut: Add the brand new function
        cut[0] = FacetCut({
            facetAddress: address(newOrgFacet),
            action: FacetCutAction.Add,
            functionSelectors: selectorsToAddToNewFacet
        });

        // Second cut: Replace all previously existing OrganisationFacet functions
        // to point to the new facet address
        cut[1] = FacetCut({
            facetAddress: address(newOrgFacet),
            action: FacetCutAction.Replace,
            functionSelectors: selectorsToReplaceWithNewFacet
        });

        IDiamondCut diamondCut = IDiamondCut(childDiamondAddress);
        diamondCut.diamondCut(cut, address(0), "");
        console.log("Child Diamond upgraded: OrganisationFacet fully updated to new implementation.");

        vm.stopBroadcast();

        writeAddressesToFile(address(newOrgFacet), "New OrganisationFacet (Consolidated)");
    }

    function revertchilddiamondupgrade(address childDiamondAddress) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get selectors currently associated with the new facet
        IDiamondLoupe loupe = IDiamondLoupe(childDiamondAddress);
        bytes4[] memory newFacetSelectors = loupe.facetFunctionSelectors(0xEFaE0cF4dFacda1F6aA0d7752896716F05A15Fca);
        console.log("Current selectors count for new facet: %s", newFacetSelectors.length);
        for (uint256 i = 0; i < newFacetSelectors.length; i++) {
            console.log("New facet selector %s: %s", i, vm.toString(newFacetSelectors[i]));
        }

        // Original selectors for the old OrganisationFacet
        bytes4[] memory originalSelectors = new bytes4[](40);
        originalSelectors[0] = 0x5b95505b;
        originalSelectors[1] = 0x9f340440;
        originalSelectors[2] = 0x8ec68a67;
        originalSelectors[3] = 0x1943d66d;
        originalSelectors[4] = 0xcfaaa266;
        originalSelectors[5] = 0xdaebf445;
        originalSelectors[6] = 0x2bab59bc;
        originalSelectors[7] = 0x79cfae26;
        originalSelectors[8] = 0xafa4a4aa;
        originalSelectors[9] = 0x5860c6d1;
        originalSelectors[10] = 0xd9466897;
        originalSelectors[11] = 0x9bc350a1;
        originalSelectors[12] = 0x4c3485d2;
        originalSelectors[13] = 0x6e8dff13;
        originalSelectors[14] = 0xbae99048;
        originalSelectors[15] = 0xe1773fe7;
        originalSelectors[16] = 0x10a0ebb0;
        originalSelectors[17] = 0x14e6ec55;
        originalSelectors[18] = 0xa335f157;
        originalSelectors[19] = 0xef99bb2c;
        originalSelectors[20] = 0xe3a88109;
        originalSelectors[21] = 0x6f33fdaf;
        originalSelectors[22] = 0xc9b5901d;
        originalSelectors[23] = 0x2e0308fb;
        originalSelectors[24] = 0xc2e8b10e;
        originalSelectors[25] = 0x67ce7c76;
        originalSelectors[26] = 0x0b8b2ece;
        originalSelectors[27] = 0xc51ee1bc;
        originalSelectors[28] = 0x62691a0b;
        originalSelectors[29] = 0x2ce042b0;
        originalSelectors[30] = 0x3d3902f8;
        originalSelectors[31] = 0x2b385ab6;
        originalSelectors[32] = 0xc202aebc;
        originalSelectors[33] = 0xb6326a23;
        originalSelectors[34] = 0x48adfbdb;
        originalSelectors[35] = 0xd522b0f0;
        originalSelectors[36] = 0x137d66a0;
        originalSelectors[37] = 0xeb3f864b;
        originalSelectors[38] = 0x89fb165a;
        originalSelectors[39] = 0xe5b92207;

        // Prepare FacetCut array
        FacetCut[] memory cut = new FacetCut[](2);

        // Remove all selectors associated with the new facet
        cut[0] =
            FacetCut({facetAddress: address(0), action: FacetCutAction.Remove, functionSelectors: newFacetSelectors});

        // Restore original selectors to the old facet
        cut[1] = FacetCut({
            facetAddress: 0x1fEA3125397dF58aBBBa895353BF104Ac6fd9AEa,
            action: FacetCutAction.Add,
            functionSelectors: originalSelectors
        });

        // Execute diamondCut
        IDiamondCut diamondCut = IDiamondCut(childDiamondAddress);
        (bool success, bytes memory result) = address(diamondCut).call(
            abi.encodeWithSignature("diamondCut((address,uint8,bytes4[])[],address,bytes)", cut, address(0), "")
        );
        if (!success) {
            if (result.length > 0) {
                revert(string(abi.decode(result, (string))));
            } else {
                revert("Diamond revert failed: no reason provided");
            }
        }
        console.log("Successfully reverted OrganisationFacet to original");

        // Verify revert
        address facetAddress = loupe.facetAddress(0x5b95505b);
        require(facetAddress == 0x1fEA3125397dF58aBBBa895353BF104Ac6fd9AEa, "Facet not reverted correctly");
        console.log("Verified old facet address: %s", facetAddress);

        // Confirm new facet selectors are removed
        bytes4[] memory remainingSelectors = loupe.facetFunctionSelectors(0xEFaE0cF4dFacda1F6aA0d7752896716F05A15Fca);
        require(remainingSelectors.length == 0, "New facet selectors not fully removed");
        console.log("Confirmed new facet has no selectors");

        vm.stopBroadcast();
        writeAddressesToFile(0x1fEA3125397dF58aBBBa895353BF104Ac6fd9AEa, "Restored OrganisationFacet");
    }

    function generateSelectors(string memory facetName) internal returns (bytes4[] memory) {
        if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("DiamondCutFacet"))) {
            bytes4[] memory selectors = new bytes4[](1);
            selectors[0] = IDiamondCut.diamondCut.selector; // 0x1f931c1c
            return selectors;
        }
        string[] memory cmd = new string[](3);
        cmd[0] = "node";
        cmd[1] = "scripts/genSelectors.js";
        cmd[2] = facetName;
        return abi.decode(vm.ffi(cmd), (bytes4[]));
    }
}
