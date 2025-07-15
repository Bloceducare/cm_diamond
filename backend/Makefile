-include .env

deployF:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
  --rpc-url ${RPC_URL} \
  --broadcast \
  --sig "deployMainDiamond()" \
	--verify \
	--etherscan-api-key ${ETHERSCAN_API_KEY} \
	--verifier etherscan \
	--verifier-url "https://api-sepolia.basescan.org/api" \
	--account josh_base \
	--sender 0xb9d5b499e3de63810e0d4883c1f0c84bc5f80660

deployLisk:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
	--rpc-url https://rpc.api.lisk.com \
	--etherscan-api-key 123 \
	--broadcast \
  --sig "deployMainDiamond()" \
	--verify \
	--verifier blockscout \
	--verifier-url https://blockscout.lisk.com/api \
	--account w3b-relayer \
	--sender 0x6c798393352588A466FD4B2dAC7EED78aFF92AeF

upgradeLisk:
		forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
		--rpc-url https://rpc.api.lisk.com \
		--etherscan-api-key 123 \
		--broadcast \
  	--sig "upgradeChildDiamond(address)" $(CHILD_DIAMOND) -vvvv \
		--verify \
		--verifier blockscout \
		--verifier-url https://blockscout.lisk.com/api \
		--account w3b-relayer \
		--sender 0x6c798393352588A466FD4B2dAC7EED78aFF92AeF

verifyFD:
		@CONSTRUCTOR_ARGS=$$(cat diamond_args.txt | sed 's/0x//'); \
		forge verify-contract 0xe33C8Ce4f5a1d7C334988934CD722f608DE4F436 contracts/Diamond.sol:Diamond \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--constructor-args "$$CONSTRUCTOR_ARGS" \
		--watch

# Upgrade scripts
upgrade:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
		--broadcast \
		--rpc-url $(RPC_URL) \
		--sig "upgradeMainDiamond(address,address,address,address,address)" $(CHILD_DIAMOND) $(certFactory) $(createOrgFacet) $(deployOrgFacet) $(otherSelectorFacets) -vvvv \
		--verify \
  	--etherscan-api-key ${ETHERSCAN_API_KEY} \
	  --verifier etherscan \
		--verifier-url "https://api-sepolia.basescan.org/api" \
	 	--account josh_base \
	 	--sender 0xb9d5b499e3de63810e0d4883c1f0c84bc5f80660



# Upgrade main diamond only
upgrade-main:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
		--broadcast --rpc-url $(RPC_URL) --sig "upgradeOrganisationSelectorsFacet(address)" $(MAIN_DIAMOND) -vvvv \
		--verify \
  	--etherscan-api-key ${ETHERSCAN_API_KEY} \
	  --verifier etherscan \
		--verifier-url "https://api-sepolia.basescan.org/api" \
	 	--account josh_base \
	 	--sender 0xb9d5b499e3de63810e0d4883c1f0c84bc5f80660

revert-main:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
		--broadcast --rpc-url $(RPC_URL) --sig "revertOrganisationSelectorsFacetUpgrade(address)" $(MAIN_DIAMOND) -vvvv \
		--verify \
  	--etherscan-api-key ${ETHERSCAN_API_KEY} \
	  --verifier etherscan \
		--verifier-url "https://api-sepolia.basescan.org/api" \
	 	--account josh_base \
	 	--sender 0xb9d5b499e3de63810e0d4883c1f0c84bc5f80660

revert-child:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
		--broadcast --rpc-url $(RPC_URL) --sig "revertchilddiamondupgrade(address)" $(CHILD_DIAMOND) -vvvv \
		--verify \
  	--etherscan-api-key ${ETHERSCAN_API_KEY} \
	  --verifier etherscan \
		--verifier-url "https://api-sepolia.basescan.org/api" \
	 	--account josh_base \
	 	--sender 0xb9d5b499e3de63810e0d4883c1f0c84bc5f80660



# Upgrade child diamond only
upgrade-child:
	forge script scripts/DeployDiamondScript.sol:DiamondUpgradeScript \
		--broadcast --rpc-url $(RPC_URL) \
		--sig "upgradeChildDiamond(address)" $(CHILD_DIAMOND) -vvvv \
		--verify \
  	--etherscan-api-key ${ETHERSCAN_API_KEY} \
	  --verifier etherscan \
		--verifier-url "https://api-sepolia.basescan.org/api" \
	 	--account josh_base \
	 	--sender 0xb9d5b499e3de63810e0d4883c1f0c84bc5f80660

verifyDiamondLoupe:
		forge verify-contract 0x638636E89cf5833532EfE21B2bB2CeC905782f71 contracts/facets/DiamondLoupeFacet.sol:DiamondLoupeFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch


verifyDiamondCut:
		forge verify-contract 0xFC8fe6A0C39b239183c9657D013Ac9869ba2882F contracts/facets/DiamondCutFacet.sol:DiamondCutFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch

verifyOwnership:
		forge verify-contract 0xA1F36983447436dbA40023B0caC7c7c7a7e16114 contracts/facets/OwnershipFacet.sol:OwnershipFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch


verifyDeployOrgDiamond:
		forge verify-contract 0x963B545548D89D668d924600Ba505a4b99500efB contracts/facets/DeployOrgDiamondFacet.sol:DeployOrgDiamondFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch

verifyCreateOrganisationFacet:
		forge verify-contract 0xBb0A06bb70eBF396440CA2467C9D25602c0029C9 contracts/facets/CreateOrganisationFacet.sol:CreateOrganisationFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch

	
verifyOtherSelectorFacet:
		forge verify-contract 0x25C23c5EE8a10A1D16Bf3Ea7Cf916FDf16162E78 contracts/facets/OtherSelectorFacets.sol:OtherSelectorFacets \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch 

verifyOrganisationFactoryFacet:
	  forge verify-contract 0xa5471A0Cdce959e96377EBB20db91B5b279acca4 contracts/facets/OrganisationFactoryFacet.sol:OrganisationFactoryFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch

verifyOrganisationSelectorFacet:
		forge verify-contract 0xE862D5d12689E8Fb7Bf228532f23603aF8e9A846 contracts/facets/OrganisationSelectorsFacet.sol:OrganisationSelectorsFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch


verifyOrganisationFacet:
		forge verify-contract 0x9e3850F206EC4d4c2af6D711A7B077Afe0A67AC5 contracts/organisation/facets/OrganisationFacet.sol:OrganisationFacet \
		--chain-id 84532 \
		--etherscan-api-key ${ETHERSCAN_API_KEY} \
		--rpc-url ${RPC_URL} \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--watch


verifyOrgContract:
		@CONSTRUCTOR_ARGS=$$(cat org_args.txt | sed 's/0x//'); \
		forge verify-contract 0x095D55465eaAC519f9B4c7B8c1F2b174aDd88DC5 contracts/organisation/Organisation.sol:Organisation \
		--chain-id 84532 \
		--etherscan-api-key "${ETHERSCAN_API_KEY}" \
		--rpc-url "${RPC_URL}" \
		--verifier-url "https://api-sepolia.basescan.org/api" \
		--compiler-version v0.8.25 \
		--constructor-args "$$CONSTRUCTOR_ARGS" \
		--watch


deploy:
	npx hardhat run scripts/deployAndInit.js --network sepolia 

verifyOrganisationFactory:
	npx hardhat verify --network sepolia --contract contracts/facets/OrganisationFactoryFacet.sol:OrganisationFactoryFacet 0xd91C867f57Bb52F6017c8bB912BE4B5c02c22377

verifyOrganisation:
	npx hardhat verify --network sepolia --contract contracts/facets/organisation/facets/OrganisationFacet.sol:OrganisationFacet 0x095D55465eaAC519f9B4c7B8c1F2b174aDd88DC5

verifyDiamond:
	npx hardhat verify --network sepolia --contract contracts/Diamond.sol:Diamond --constructor-args arguments_original.js 0xe33C8Ce4f5a1d7C334988934CD722f608DE4F436
	



# DiamondLoupeFacet@0x638636E89cf5833532EfE21B2bB2CeC905782f71
#   [721161] → new DiamondCutFacet@0xFC8fe6A0C39b239183c9657D013Ac9869ba2882F
#     └─ ← [Return] 3602 bytes of code
#
#   [378625] → new DiamondLoupeFacet@0x638636E89cf5833532EfE21B2bB2CeC905782f71
#     └─ ← [Return] 1891 bytes of code
#
#   [68923] → new OwnershipFacet@0xA1F36983447436dbA40023B0caC7c7c7a7e16114
#     └─ ← [Return] 344 bytes of code
#
#   [332975] → new DeployOrgDiamondFacet@0x42bcf05e72ff1e67baec624b9f65b9ee21a5bb66
#     └─ ← [Return] 1663 bytes of code
#
#   [1416688] → new CreateOrganisationFacet@0x9E060E47b7e629ac77Da05bB06Dc7e2d6a18D40c
#     └─ ← [Return] 7076 bytes of code
#
#   [2704455] → new certificateFactory@0xcef7E34C31C9F571A9E76B6377D2d7ce5a12E732
#     └─ ← [Return] 13397 bytes of code
#
#   [671310] → new OrganisationFactoryFacet@0xd91C867f57Bb52F6017c8bB912BE4B5c02c22377
#     └─ ← [Return] 3353 bytes of code
#
#   [4679298] → new OtherSelectorFacets@0x1CdA27c61921240598D04Cb17C5f7F8c596Fec88
#     └─ ← [Return] 23369 bytes of code
#
#   [246294] → new OrganisationSelectorsFacet@0xE862D5d12689E8Fb7Bf228532f23603aF8e9A846
#     └─ ← [Return] 1230 bytes of code
#


