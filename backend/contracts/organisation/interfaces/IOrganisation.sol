// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibOrganisation} from "../libraries/LibOrganisation.sol";

struct Individual {
    address _address;
    string _name;
}

interface IOrganisation {
    function deploy(
        string calldata _organization,
        string calldata _cohort,
        address _moderator,
        string calldata _adminName,
        string calldata _uri
    ) external;

    function initializeContracts(
        address _NftContract,
        address _certificateContract,
        address _spokContract
    ) external;

    function requestNameCorrection() external;

    function editStudentName(Individual[] calldata _studentList) external;

    function editMentorsName(Individual[] calldata _mentorsList) external;

    function createAttendance(
        bytes calldata _lectureId,
        string calldata _uri,
        string calldata _topic
    ) external;

    function mintMentorsSpok(string memory Uri) external;
    function editTopic(
        bytes memory _lectureId,
        string calldata _topic
    ) external;

    function signAttendance(bytes memory _lectureId) external;

    function mentorHandover(address newMentor) external;

    function openAttendance(bytes calldata _lectureId) external;

    function closeAttendance(bytes calldata _lectureId) external;

    function recordResults(uint256 testId, string calldata _resultCid) external;

    function getResultCid() external view returns (string[] memory);

    function evictStudents(address[] calldata studentsToRevoke) external;

    function removeMentor(address[] calldata rouge_mentors) external;

    function getNameArray(
        address[] calldata _students
    ) external view returns (string[] memory);

    function mintCertificate(string memory Uri) external;

    function liststudents() external view returns (address[] memory);

    function VerifyStudent(address _student) external view returns (bool);

    function getStudentName(
        address _student
    ) external view returns (string memory name);

    function getStudentAttendanceRatio(
        address _student
    ) external view returns (uint attendace, uint TotalClasses);

    function getStudentsPresent(
        bytes memory _lectureId
    ) external view returns (uint);

    function listClassesAttended(
        address _student
    ) external view returns (bytes[] memory);

    function getLectureIds() external view returns (bytes[] memory);

    function getLectureData(
        bytes calldata _lectureId
    ) external view returns (LibOrganisation.lectureData memory);

    function listMentors() external view returns (address[] memory);

    function VerifyMentor(address _mentor) external view returns (bool);

    function getMentorsName(
        address _Mentor
    ) external view returns (string memory name);

    function getClassesTaugth(
        address _Mentor
    ) external view returns (bytes[] memory);

    function getMentorOnDuty() external view returns (address);

    function getModerator() external view returns (address);

    function getOrganizationName() external view returns (string memory);

    function getCohortName() external view returns (string memory);

    function getOrganisationImageUri() external view returns (string memory);

    function toggleOrganizationStatus() external;

    function getOrganizationStatus() external view returns (bool);
}
