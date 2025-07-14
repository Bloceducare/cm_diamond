// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/interfaces/IDiamondCut.sol";
import "../contracts/facets/DiamondCutFacet.sol";
import "../contracts/facets/DiamondLoupeFacet.sol";
import "../contracts/facets/OwnershipFacet.sol";
import "../contracts/libraries/LibUtils.sol";
import "./../contracts/organisation/facets/OrganisationFacet.sol";
import "../contracts/interfaces/Ichild.sol";
import "../contracts/interfaces/IFactory.sol";
import "../contracts/interfaces/IDiamondCut.sol";
import "../contracts/facets/OrganisationFactoryFacet.sol";
import "../contracts/facets/CreateOrganisationFacet.sol";
import "../contracts/facets/DeployOrgDiamondFacet.sol";
import "../contracts/facets/OrganisationSelectorsFacet.sol";
import "../contracts/facets/OtherSelectorFacets.sol";
import "../lib/forge-std/src//Test.sol";
import "../contracts/Diamond.sol";
import "../contracts/libraries/Error.sol";
import "../contracts/certificates/certificateFactory.sol";
import "../contracts/organisation/libraries/LibOrganisation.sol";

contract DiamondDeployer is Test, IDiamondCut {
    Diamond diamond;
    DiamondCutFacet dCutFacet;
    DiamondLoupeFacet dLoupe;
    OwnershipFacet ownerF;

    DeployOrgDiamondFacet deployOrgDiamondFacet;
    CreateOrganisationFacet deployFacet;
    certificateFactory _certificateFactory;
    OtherSelectorFacets otherSelectorFacets;

    OrganisationSelectorsFacet organisationSelectorFacet;
    OrganisationFactoryFacet orgFacetFactory;
    OrganisationFacet orgF;

    Individual student1;
    Individual[] students;
    Individual[] editstudents;

    Individual mentor;
    Individual[] mentors;
    Individual[] editMentors;

    address[] studentsToEvict;
    address[] rogue_mentors;
    address[] nameCheck;

    address mentorAdd = 0xfd182E53C17BD167ABa87592C5ef6414D25bb9B4;
    address studentAdd = 0x13B109506Ab1b120C82D0d342c5E64401a5B6381;
    address director = 0xA771E1625DD4FAa2Ff0a41FA119Eb9644c9A46C8;

    address public organisationAddress;

    address relayer = vm.envAddress("RELAYER");

    function setUp() public {
        dCutFacet = new DiamondCutFacet();
        dLoupe = new DiamondLoupeFacet();
        ownerF = new OwnershipFacet();

        deployOrgDiamondFacet = new DeployOrgDiamondFacet();
        deployFacet = new CreateOrganisationFacet();
        _certificateFactory = new certificateFactory();

        orgFacetFactory = new OrganisationFactoryFacet();
        otherSelectorFacets = new OtherSelectorFacets();
        organisationSelectorFacet = new OrganisationSelectorsFacet();

        student1._address = address(studentAdd);
        student1._name = "JOHN DOE";
        students.push(student1);

        mentor._address = address(mentorAdd);
        mentor._name = "MR. ABIMS";
        mentors.push(mentor);

        bytes memory initCalldata = abi.encodeWithSelector(
            orgFacetFactory.initializeAll.selector,
            address(_certificateFactory),
            address(deployFacet),
            address(deployOrgDiamondFacet),
            address(organisationSelectorFacet),
            address(otherSelectorFacets)
        );

        FacetCut[] memory cut = new FacetCut[](7);
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
            facetAddress: address(deployOrgDiamondFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("DeployOrgDiamondFacet")
        });
        cut[3] = FacetCut({
            facetAddress: address(deployFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("CreateOrganisationFacet")
        });
        cut[4] = FacetCut({
            facetAddress: address(orgFacetFactory),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OrganisationFactoryFacet")
        });
        cut[5] = FacetCut({
            facetAddress: address(otherSelectorFacets),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OtherSelectorFacets")
        });
        cut[6] = FacetCut({
            facetAddress: address(organisationSelectorFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OrganisationSelectorsFacet")
        });

        diamond = new Diamond(address(this), cut, address(orgFacetFactory), initCalldata);

        orgFacetFactory = OrganisationFactoryFacet(address(diamond));

        console.log("DeployOrgDiamondFacet after setup:", orgFacetFactory.deployOrgDiamondFacet());

        if (orgFacetFactory.deployOrgDiamondFacet() == address(0)) {
            revert Error.INITIALIZATION_FAILED();
        }
    }

    function testInitialization() public {
        assertEq(orgFacetFactory.deployOrgDiamondFacet(), address(deployOrgDiamondFacet));
    }

    function testOrgFactoryCreation() public {
        vm.startPrank(director);

        (address orgAddr, address nftAddr, address mentorsSpokAddr, address certAddr) =
            orgFacetFactory.createorganisation("WEB3BRIDGE", "COHORT 9", "http://test.org", "Abims", relayer);

        address[] memory orgs = orgFacetFactory.getOrganizations();

        console.log("address:", orgs.length);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        console.log("User orgs length:", child);

        organisationAddress = orgAddr;

        assertEq(orgAddr, organisationAddress);

        bool status = ICHILD(child).getOrganizationStatus();

        assertEq(status, true, "Organisation status should be true");

        vm.stopPrank();
    }

    function testStudentRegister() public {
        testOrgFactoryCreation();
        vm.startPrank(director);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).registerStudents(students);

        address[] memory studentsList = ICHILD(child).listStudents();

        bool studentStatus = ICHILD(child).verifyStudent(studentAdd);

        string memory studentName = ICHILD(child).getStudentName(studentAdd);

        assertEq(1, studentsList.length);

        assertEq(true, studentStatus);

        assertEq("JOHN DOE", studentName);

        vm.stopPrank();
    }

    function testGetStudentsNamesArray() public {
        testStudentRegister();

        nameCheck.push(studentAdd);

        nameCheck.push(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        string[] memory studentsName = ICHILD(child).getNameArray(nameCheck);

        assertEq(studentsName[0], "JOHN DOE");

        assertEq(studentsName[1], "UNREGISTERED");

        console.log(studentsName[0]);

        console.log(studentsName[1]);
    }

    function testZ_edit_students_Name() public {
        testStudentRegister();
        vm.startPrank(studentAdd);
        address child = orgFacetFactory.getUserOrganisatons(studentAdd)[0];

        ICHILD(child).requestNameCorrection();

        vm.stopPrank();

        student1._name = "MUSAA";
        student1._address = studentAdd;
        editstudents.push(student1);

        vm.startPrank(director);

        ICHILD(child).editStudentName(editstudents);

        string memory newStudentName = ICHILD(child).getStudentName(studentAdd);

        console.log(newStudentName);

        assertEq("MUSAA", newStudentName);
    }

    function testMentorRegister() public {
        testOrgFactoryCreation();

        vm.startPrank(director);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).registerStaffs(mentors);

        address[] memory studentsList = ICHILD(child).listMentors();

        bool mentorStatus = ICHILD(child).verifyMentor(mentorAdd);

        string memory mentorName = ICHILD(child).getMentorsName(mentorAdd);

        assertEq(2, studentsList.length);

        assertEq(true, mentorStatus);

        assertEq("MR. ABIMS", mentorName);
    }

    function testZ_edit_mentors_Name() public {
        testMentorRegister();

        vm.startPrank(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(mentorAdd)[0];

        ICHILD(child).requestNameCorrection();

        vm.stopPrank();

        mentor._name = "Mr. Abimbola";

        mentor._address = mentorAdd;

        editMentors.push(mentor);

        vm.startPrank(director);

        ICHILD(child).editMentorsName(editMentors);

        string memory newMentorsName = ICHILD(child).getMentorsName(mentorAdd);

        console.log(newMentorsName);

        assertEq("Mr. Abimbola", newMentorsName);
    }

    function test_Revert_MentorIsNotOnDuty() public {
        testMentorRegister();

        vm.startPrank(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        vm.expectRevert(Error.NOT_A_VALID_MODERATOR.selector);
        ICHILD(child).createAttendance("B0202", "http://test.org", "INTRODUCTION TO BLOCKCHAIN");

        vm.stopPrank();
    }

    function testMentorHandOver() public {
        testStudentRegister();

        vm.startPrank(director);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        address mentorOnDuty1 = ICHILD(child).getMentorOnDuty();

        ICHILD(child).mentorHandover(mentorAdd);

        address mentorOnDuty = ICHILD(child).getMentorOnDuty();

        assertEq(mentorOnDuty1, director);

        assertEq(mentorOnDuty, mentorAdd);

        vm.stopPrank();
    }

    function testCreateAttendance() public {
        testMentorHandOver();

        vm.startPrank(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).createAttendance("B0202", "http://test.org", "INTRODUCTION TO BLOCKCHAIN");

        vm.stopPrank();
    }

    function testGetStudentPresent() public {
        testOrgFactoryCreation();

        address child = organisationAddress;

        bytes memory lectureId = "B0202";

        testSignAttendance();

        uint256 studentsPresent = ICHILD(child).getStudentsPresent(lectureId);

        assertEq(studentsPresent, 1);
    }

    function test_Revert_TakeAttendaceBeforeClass() public {
        testCreateAttendance();

        vm.startPrank(studentAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        vm.expectRevert(Error.LECTURE_ID_CLOSED.selector);

        ICHILD(child).signAttendanceWithGas("B0202");

        vm.stopPrank();
    }

    function test_Revert_StudentOpenAttendace() public {
        testCreateAttendance();

        vm.startPrank(studentAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        vm.expectRevert(Error.NOT_A_VALID_MODERATOR.selector);
        ICHILD(child).openAttendance("B0202");

        vm.stopPrank();
    }

    function test_Revert_StudentSignWrongAttendance() public {
        testCreateAttendance();

        vm.startPrank(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).openAttendance("B0202");

        vm.stopPrank();

        vm.startPrank(studentAdd);

        vm.expectRevert(Error.INVALID_LECTURE_ID.selector);
        ICHILD(child).signAttendanceWithGas("B0205");
    }

    function testSignAttendance() public {
        testCreateAttendance();

        vm.startPrank(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).openAttendance("B0202");

        vm.stopPrank();

        vm.startPrank(studentAdd);

        ICHILD(child).signAttendanceWithGas("B0202");

        vm.stopPrank();
    }

    function testStudentsAttendanceData() public {
        testSignAttendance();

        vm.startPrank(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        (uint256 attendace, uint256 totalClasses) = ICHILD(child).getStudentAttendanceRatio(studentAdd);

        uint256[] memory lectures = ICHILD(child).getLectureIds();

        ICHILD.lectureData memory lectureData = ICHILD(child).getLectureData("B0202");

        assertEq(attendace, totalClasses);

        assertEq(lectures.length, 1);

        assertEq(lectureData.topic, "INTRODUCTION TO BLOCKCHAIN");

        assertEq(lectureData.mentorOnDuty, mentorAdd);

        assertEq(lectureData.uri, "http://test.org");

        assertEq(lectureData.attendanceStartTime, 1);

        assertEq(lectureData.studentsPresent, 1);

        assertEq(lectureData.status, true);
    }

    function testEvictStudent() public {
        testSignAttendance();

        vm.startPrank(director);

        studentsToEvict.push(studentAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).evictStudents(studentsToEvict);

        address[] memory studentsList = ICHILD(child).listStudents();

        address[] memory studentOrganizations = orgFacetFactory.getUserOrganisatons(studentAdd);

        bool studentStatus = ICHILD(child).verifyStudent(studentAdd);

        assertEq(0, studentOrganizations.length);

        assertEq(0, studentsList.length);

        assertEq(false, studentStatus);
    }

    function testRemoveMentor() public {
        testMentorRegister();

        vm.startPrank(director);

        rogue_mentors.push(mentorAdd);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).removeMentor(rogue_mentors);

        address[] memory mentorsList = ICHILD(child).listMentors();

        address[] memory mentorsOrganizations = orgFacetFactory.getUserOrganisatons(mentorAdd);

        bool status = ICHILD(child).verifyMentor(mentorAdd);

        assertEq(0, mentorsOrganizations.length);

        assertEq(1, mentorsList.length);

        assertEq(false, status);
    }

    function testCertificateIssuance() public {
        testSignAttendance();

        vm.startPrank(director);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).mintCertificate("http://test.org");
    }

    function testMentorsSpok() public {
        testMentorRegister();

        vm.startPrank(director);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).mintMentorsSpok(mentorAdd, "http://test.org");
    }

    function test_Revert_MentorsSpok() public {
        testSignAttendance();

        vm.startPrank(director);

        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        vm.expectRevert(Error.NOT_A_MENTOR.selector);
        ICHILD(child).mintMentorsSpok(mentorAdd, "http://test.org");
    }

    function testToggleOrganizationStatus() public {
        testOrgFactoryCreation();
        address child = orgFacetFactory.getUserOrganisatons(director)[0];

        ICHILD(child).toggleOrganizationStatus();

        bool toggledStatus = ICHILD(child).getOrganizationStatus();
        assertEq(toggledStatus, false);

        ICHILD(child).toggleOrganizationStatus();

        bool finalStatus = ICHILD(child).getOrganizationStatus();
        assertEq(finalStatus, true);
    }

    function generateSelectors(string memory _facetName) internal returns (bytes4[] memory selectors) {
        string[] memory cmd = new string[](3);
        cmd[0] = "node";
        cmd[1] = "scripts/genSelectors.js";
        cmd[2] = _facetName;
        bytes memory res = vm.ffi(cmd);
        selectors = abi.decode(res, (bytes4[]));
    }

    function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external override {}
}
