// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreateOrganisationFacet {
    function create_organisation(
        string memory _organisation,
        string memory _cohort,
        string memory _uri,
        string memory _adminName,
        address creator,
        address relayer
    ) external returns (address organisation, address Nft, address mentorsSpok, address certificate);
}
