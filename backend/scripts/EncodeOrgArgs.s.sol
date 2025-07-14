// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Script.sol";
import "../contracts/interfaces/IDiamondCut.sol";

contract EncodeOrgArgs is Script {
    function run() external {
        // Owner
        address owner = 0xe33C8Ce4f5a1d7C334988934CD722f608DE4F436;

        // DiamondCut
        FacetCut[] memory cut = new FacetCut[](4);

        // Facet 1: DiamondCutFacet
        bytes4[] memory cutSelectors = new bytes4[](1);
        cutSelectors[0] = bytes4(0x1f931c1c);
        cut[0] = FacetCut({
            facetAddress: 0x638d64f4FFe19BE1605D56dd1E26bF06f451Ee1F,
            action: FacetCutAction.Add,
            functionSelectors: cutSelectors
        });

        // Facet 2: DiamondLoupeFacet
        bytes4[] memory loupeSelectors = new bytes4[](5);
        loupeSelectors[0] = bytes4(0x7a0ed627);
        loupeSelectors[1] = bytes4(0xadfca15e);
        loupeSelectors[2] = bytes4(0x52ef6b2c);
        loupeSelectors[3] = bytes4(0xcdffacc6);
        loupeSelectors[4] = bytes4(0x01ffc9a7);
        cut[1] = FacetCut({
            facetAddress: 0xD7dBb2211EFDf16C35B957D608E7DB84D4C60F56,
            action: FacetCutAction.Add,
            functionSelectors: loupeSelectors
        });

        // Facet 3: OwnershipFacet
        bytes4[] memory ownershipSelectors = new bytes4[](2);
        ownershipSelectors[0] = bytes4(0xf2fde38b);
        ownershipSelectors[1] = bytes4(0x8da5cb5b);
        cut[2] = FacetCut({
            facetAddress: 0xe4bb6242Ee9d364777C7Fccc3F3d078AAea89b59,
            action: FacetCutAction.Add,
            functionSelectors: ownershipSelectors
        });

        // Facet 4: OrganisationFacet
        bytes4[] memory orgSelectors = new bytes4[](40);
        orgSelectors[0] = bytes4(0x5b95505b);
        orgSelectors[1] = bytes4(0x9f340440);
        orgSelectors[2] = bytes4(0x8ec68a67);
        orgSelectors[3] = bytes4(0x1943d66d);
        orgSelectors[4] = bytes4(0xcfaaa266);
        orgSelectors[5] = bytes4(0xdaebf445);
        orgSelectors[6] = bytes4(0x2bab59bc);
        orgSelectors[7] = bytes4(0x79cfae26);
        orgSelectors[8] = bytes4(0xafa4a4aa);
        orgSelectors[9] = bytes4(0x5860c6d1);
        orgSelectors[10] = bytes4(0xd9466897);
        orgSelectors[11] = bytes4(0x9bc350a1);
        orgSelectors[12] = bytes4(0x4c3485d2);
        orgSelectors[13] = bytes4(0x6e8dff13);
        orgSelectors[14] = bytes4(0xbae99048);
        orgSelectors[15] = bytes4(0xe1773fe7);
        orgSelectors[16] = bytes4(0x10a0ebb0);
        orgSelectors[17] = bytes4(0x14e6ec55);
        orgSelectors[18] = bytes4(0xa335f157);
        orgSelectors[19] = bytes4(0xef99bb2c);
        orgSelectors[20] = bytes4(0xe3a88109);
        orgSelectors[21] = bytes4(0x6f33fdaf);
        orgSelectors[22] = bytes4(0xc9b5901d);
        orgSelectors[23] = bytes4(0x2e0308fb);
        orgSelectors[24] = bytes4(0xc2e8b10e);
        orgSelectors[25] = bytes4(0x67ce7c76);
        orgSelectors[26] = bytes4(0x0b8b2ece);
        orgSelectors[27] = bytes4(0xc51ee1bc);
        orgSelectors[28] = bytes4(0x62691a0b);
        orgSelectors[29] = bytes4(0x2ce042b0);
        orgSelectors[30] = bytes4(0x3d3902f8);
        orgSelectors[31] = bytes4(0x2b385ab6);
        orgSelectors[32] = bytes4(0xc202aebc);
        orgSelectors[33] = bytes4(0xb6326a23);
        orgSelectors[34] = bytes4(0x48adfbdb);
        orgSelectors[35] = bytes4(0xd522b0f0);
        orgSelectors[36] = bytes4(0x137d66a0);
        orgSelectors[37] = bytes4(0xeb3f864b);
        orgSelectors[38] = bytes4(0x89fb165a);
        orgSelectors[39] = bytes4(0xe5b92207);
        cut[3] = FacetCut({
            facetAddress: 0x94e23579D3cfd7F36BD42C297D9A894C5B59C54E,
            action: FacetCutAction.Add,
            functionSelectors: orgSelectors
        });

        // Init and Calldata
        address init = 0xe33C8Ce4f5a1d7C334988934CD722f608DE4F436;
        bytes memory initCalldata =
            hex"9f340440000000000000000000000000307a5820c6426613dfa3e3f86070c097df8722b5000000000000000000000000ee34f2f8b449c1cde38fdd2d6fc844a689f2d0490000000000000000000000003eb525b143a5952b8a400443ae0dfd49c68ce86e000000000000000000000000cef7e34c31c9f571a9e76b6377d2d7ce5a12e732";

        // Encode
        bytes memory encodedArgs = abi.encode(owner, cut, init, initCalldata);

        // Log and save
        console.log("Encoded args: %s", vm.toString(encodedArgs));
        vm.writeFile("org_args.txt", vm.toString(encodedArgs));
    }
}
