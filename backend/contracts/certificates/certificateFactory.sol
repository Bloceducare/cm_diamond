// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SchoolCertificate.sol";
import "./SchoolsNFT.sol";
import "../interfaces/ICERTFACTORY.sol";

contract certificateFactory {
    address public Admin;

    event PackageCreated(
        address indexed certificateAddr, address indexed attendanceAddr, address indexed mentorsSpokAddr, address admin
    );

    constructor() {
        Admin = msg.sender;
    }

    function createCertificateNft(string memory Name, string memory Symbol, address institution)
        public
        returns (address)
    {
        Certificate newCertificateAdd = new Certificate(Name, Symbol, institution);
        return address(newCertificateAdd);
    }

    function createAttendanceNft(string memory Name, string memory Symbol, string memory Uri, address _Admin)
        public
        returns (address)
    {
        SchoolsNFT newSchoolsNFT = new SchoolsNFT(Name, Symbol, Uri, _Admin);
        return address(newSchoolsNFT);
    }

    function createMentorsSpok(string memory Name, string memory Symbol, address institution)
        public
        returns (address)
    {
        Certificate newCertificateAdd = new Certificate(Name, Symbol, institution);
        return address(newCertificateAdd);
    }

    function completePackage(string memory Name, string memory Symbol, string memory Uri, address _Admin)
        external
        returns (address, address, address)
    {
        Certificate certificateAddr = new Certificate(Name, Symbol, _Admin);
        SchoolsNFT attendanceAddr = new SchoolsNFT(Name, Symbol, Uri, _Admin);
        Certificate mentorsSpokAddr = new Certificate(Name, Symbol, _Admin);

        emit PackageCreated(address(certificateAddr), address(attendanceAddr), address(mentorsSpokAddr), _Admin);

        return (address(attendanceAddr), address(certificateAddr), address(mentorsSpokAddr));
    }
}
