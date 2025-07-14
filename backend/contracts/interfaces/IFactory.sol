// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
struct Individual {
    address _address;
    string _name;
}

interface IFACTORY {
    function register(Individual[] calldata _individual) external;

    function revoke(address[] calldata _individual) external;

    function completePackage(
        string memory Name,
        string memory Symbol,
        string memory Uri,
        address _Admin
    )
        external
        returns (
            address newCertificateAdd,
            address newSchoolsNFT,
            address newMentorsSpokAdd
        );
}
