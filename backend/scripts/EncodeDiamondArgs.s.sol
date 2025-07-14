// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Script.sol";
import "../contracts/interfaces/IDiamondCut.sol";

contract EncodeDiamondArgs is Script {
    function run() external {
        // Owner
        address owner = 0xb9D5b499E3De63810e0d4883c1f0c84bc5f80660;

        // DiamondCut
        FacetCut[] memory cut = new FacetCut[](7);

        // Facet 1: DiamondLoupeFacet
        bytes4[] memory loupeSelectors = new bytes4[](5);
        loupeSelectors[0] = bytes4(0xcdffacc6);
        loupeSelectors[1] = bytes4(0x52ef6b2c);
        loupeSelectors[2] = bytes4(0xadfca15e);
        loupeSelectors[3] = bytes4(0x7a0ed627);
        loupeSelectors[4] = bytes4(0x01ffc9a7);
        cut[0] = FacetCut({
            facetAddress: 0x638636E89cf5833532EfE21B2bB2CeC905782f71,
            action: FacetCutAction.Add,
            functionSelectors: loupeSelectors
        });

        // Facet 2: OwnershipFacet
        bytes4[] memory ownershipSelectors = new bytes4[](2);
        ownershipSelectors[0] = bytes4(0x8da5cb5b);
        ownershipSelectors[1] = bytes4(0xf2fde38b);
        cut[1] = FacetCut({
            facetAddress: 0xA1F36983447436dbA40023B0caC7c7c7a7e16114,
            action: FacetCutAction.Add,
            functionSelectors: ownershipSelectors
        });

        // Facet 3: DeployOrgDiamondFacet
        bytes4[] memory deployOrgSelectors = new bytes4[](2);
        deployOrgSelectors[0] = bytes4(0xc089abfe);
        deployOrgSelectors[1] = bytes4(0x96cfe8c2);
        cut[2] = FacetCut({
            facetAddress: 0x42Bcf05E72ff1E67BaeC624B9f65b9EE21a5bB66,
            action: FacetCutAction.Add,
            functionSelectors: deployOrgSelectors
        });

        // Facet 4: CreateOrganisationFacet
        bytes4[] memory createOrgSelectors = new bytes4[](1);
        createOrgSelectors[0] = bytes4(0x4f247db0);
        cut[3] = FacetCut({
            facetAddress: 0x9E060E47b7e629ac77Da05bB06Dc7e2d6a18D40c,
            action: FacetCutAction.Add,
            functionSelectors: createOrgSelectors
        });

        // Facet 5: OrganisationFactoryFacet
        bytes4[] memory orgFactorySelectors = new bytes4[](7);
        orgFactorySelectors[0] = bytes4(0x3b49aaa7);
        orgFactorySelectors[1] = bytes4(0x8369493d);
        orgFactorySelectors[2] = bytes4(0x9754a3a8);
        orgFactorySelectors[3] = bytes4(0x1495d75b);
        orgFactorySelectors[4] = bytes4(0x96711d23);
        orgFactorySelectors[5] = bytes4(0xc88a2d6a);
        orgFactorySelectors[6] = bytes4(0x05f203d9);
        cut[4] = FacetCut({
            facetAddress: 0xd91C867f57Bb52F6017c8bB912BE4B5c02c22377,
            action: FacetCutAction.Add,
            functionSelectors: orgFactorySelectors
        });

        // Facet 6: OtherSelectorFacets
        bytes4[] memory otherSelectors = new bytes4[](3);
        otherSelectors[0] = bytes4(0x041991cc);
        otherSelectors[1] = bytes4(0x7d7e3c0a);
        otherSelectors[2] = bytes4(0x33341b66);
        cut[5] = FacetCut({
            facetAddress: 0x1CdA27c61921240598D04Cb17C5f7F8c596Fec88,
            action: FacetCutAction.Add,
            functionSelectors: otherSelectors
        });

        // Facet 7: OrganisationSelectorsFacet
        bytes4[] memory orgSelectors = new bytes4[](1);
        orgSelectors[0] = bytes4(0xd77f6bfb);
        cut[6] = FacetCut({
            facetAddress: 0xE862D5d12689E8Fb7Bf228532f23603aF8e9A846,
            action: FacetCutAction.Add,
            functionSelectors: orgSelectors
        });

        // Init and Calldata
        address init = 0xd91C867f57Bb52F6017c8bB912BE4B5c02c22377;
        bytes memory initCalldata =
            hex"96711d23000000000000000000000000cef7e34c31c9f571a9e76b6377d2d7ce5a12e7320000000000000000000000009e060e47b7e629ac77da05bb06dc7e2d6a18d40c00000000000000000000000042bcf05e72ff1e67baec624b9f65b9ee21a5bb66000000000000000000000000e862d5d12689e8fb7bf228532f23603af8e9a8460000000000000000000000001cda27c61921240598d04cb17c5f7f8c596fec88";

        // Encode
        bytes memory encodedArgs = abi.encode(owner, cut, init, initCalldata);

        // Log and save
        console.log("Encoded args: %s", vm.toString(encodedArgs));
        vm.writeFile("diamond_args.txt", vm.toString(encodedArgs));
    }
}
