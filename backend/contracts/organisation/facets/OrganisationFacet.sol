// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../interfaces/IFactory.sol";
import {LibOrganisation} from "../libraries/LibOrganisation.sol";
import "../../libraries/Error.sol";
import "../../libraries/LibUtils.sol";
import "../../certificates/certificateFactory.sol";

contract OrganisationFacet {
    function deploy(
        string memory _organization,
        string memory _cohort,
        address _moderator,
        string memory _adminName,
        string memory _uri
    ) external {
        LibOrganisation.deploy(_organization, _cohort, _moderator, _adminName, _uri);
    }

    function initializeContracts(
        address _NftContract,
        address _certificateContract,
        address _spokContract,
        address _certificateFactory,
        address _relayer
    ) external {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();
        org.NftContract = _NftContract;
        org.certificateContract = _certificateContract;
        org.spokContract = _spokContract;
        org.relayer = _relayer;
    }

    function registerStudents(Individual[] calldata _studentList) external {
        LibOrganisation.registerStudents(_studentList);
    }

    function registerStaffs(Individual[] calldata staffList) external {
        LibOrganisation.registerStaffs(staffList);
    }

    function TransferOwnership(address newModerator) external {
        LibOrganisation.TransferOwnership(newModerator);
    }

    function requestNameCorrection() external {
        LibOrganisation.requestNameCorrection();
    }

    function editStudentName(Individual[] calldata _studentList) external {
        LibOrganisation.editStudentName(_studentList);
    }

    function editMentorsName(Individual[] calldata _mentorsList) external {
        LibOrganisation.editMentorsName(_mentorsList);
    }

    function createAttendance(bytes calldata _lectureId, string calldata _uri, string calldata _topic) external {
        LibOrganisation.createAttendance(_lectureId, _uri, _topic);
    }

    function openAttendance(bytes calldata _lectureId) external {
        LibOrganisation.openAttendance(_lectureId);
    }

    function closeAttendance(bytes calldata _lectureId) external {
        LibOrganisation.closeAttendance(_lectureId);
    }

    function signAttendance(address _student, bytes memory _lectureId) external {
        LibOrganisation.signAttendance(_student, _lectureId);
    }

    function signAttendanceWithGas(bytes memory _lectureId) external {
        LibOrganisation.signAttendanceWithGas(_lectureId);
    }

    // @dev: Function to mint spok
    function mintMentorsSpok(address _menotorsAddress, string memory Uri) external {
        LibOrganisation.mintMentorsSpok(_menotorsAddress, Uri);
    }

    function editTopic(bytes memory _lectureId, string calldata _topic) external {
        LibOrganisation.editTopic(_lectureId, _topic);
    }

    function mentorHandover(address newMentor) external {
        LibOrganisation.mentorHandover(newMentor);
    }

    function recordResults(uint256 testId, string calldata _resultCid) external {
        LibOrganisation.recordResults(testId, _resultCid);
    }

    function getResultCid() external view returns (string[] memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.resultCid;
    }

    function evictStudents(address[] calldata studentsToRevoke) external {
        LibOrganisation.evictStudents(studentsToRevoke);
    }

    function removeMentor(address[] calldata rouge_mentors) external {
        LibOrganisation.removeMentor(rouge_mentors);
    }

    function getNameArray(address[] calldata _students) external view returns (string[] memory) {
        return LibOrganisation.getNameArray(_students);
    }

    function mintCertificate(string memory Uri) external {
        LibOrganisation.mintCertificate(Uri);
    }

    //VIEW FUNCTIONS
    function listStudents() external view returns (address[] memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.students;
    }

    function verifyStudent(address _student) external view returns (bool) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.isStudent[_student];
    }

    function getStudentName(address _student) external view returns (string memory name) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        if (org.isStudent[_student] == false) revert Error.NOT_A_VALID_STUDENT();
        return org.studentsData[_student]._name;
    }

    function getStudentAttendanceRatio(address _student)
        external
        view
        returns (uint256 attendace, uint256 TotalClasses)
    {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();
        if (org.isStudent[_student] == false) revert Error.NOT_A_VALID_STUDENT();
        attendace = org.studentsTotalAttendance[_student];
        TotalClasses = org.LectureIdCollection.length;
    }

    function getStudentsPresent(bytes memory _lectureId) external view returns (uint256) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.lectureInstance[_lectureId].studentsPresent;
    }

    function listClassesAttended(address _student) external view returns (bytes[] memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        if (org.isStudent[_student] == false) revert Error.NOT_A_VALID_STUDENT();
        return org.classesAttended[_student];
    }

    function getLectureIds() external view returns (bytes[] memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.LectureIdCollection;
    }

    function getLectureData(bytes calldata _lectureId) external view returns (LibOrganisation.lectureData memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        if (org.lectureIdUsed[_lectureId] == false) {
            revert Error.INVALID_LECTURE_ID();
        }
        return org.lectureInstance[_lectureId];
    }

    function listMentors() external view returns (address[] memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.mentors;
    }

    function verifyMentor(address _mentor) external view returns (bool) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.isStaff[_mentor];
    }

    function getMentorsName(address _Mentor) external view returns (string memory name) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        if (org.isStaff[_Mentor] == false) revert Error.NOT_A_VALID_MODERATOR();
        return org.mentorsData[_Mentor]._name;
    }

    function getClassesTaugth(address _Mentor) external view returns (bytes[] memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        if (org.isStaff[_Mentor] == false) revert Error.NOT_A_VALID_MODERATOR();
        return org.moderatorsTopic[_Mentor];
    }

    function getMentorOnDuty() external view returns (address) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.mentorOnDuty;
    }

    function getModerator() external view returns (address) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.moderator;
    }

    function getOrganizationName() external view returns (string memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.organization;
    }

    function getCohortName() external view returns (string memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.cohort;
    }

    function getOrganisationImageUri() external view returns (string memory) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.organisationImageUri;
    }

    function toggleOrganizationStatus() external {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        org.isOngoing = !org.isOngoing;
    }

    function getOrganizationStatus() external view returns (bool) {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();

        return org.isOngoing;
    }
}
