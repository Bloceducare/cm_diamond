// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IFactory.sol";

interface ICHILD {
    struct lectureData {
        address mentorOnDuty;
        string topic;
        string uri;
        uint256 attendanceStartTime;
        uint256 studentsPresent;
        bool status;
    }

    function toggleOrganizationStatus() external;

    function getOrganizationStatus() external view returns (bool);

    function registerStudents(Individual[] calldata _studentList) external;

    function revoke(address[] calldata _individual) external;

    function listStudents() external view returns (address[] memory);

    function verifyStudent(address _student) external view returns (bool);

    function getStudentName(address _student) external view returns (string memory name);

    function registerStaffs(Individual[] calldata staffList) external;

    function listMentors() external view returns (address[] memory);

    function verifyMentor(address _mentor) external view returns (bool);

    function getMentorsName(address _Mentor) external view returns (string memory name);

    function createAttendance(bytes calldata _lectureId, string calldata _uri, string calldata _topic) external;

    function deploy(
        string memory _organization,
        string memory _cohort,
        address _moderator,
        string memory _adminName,
        string memory _uri
    ) external;

    function getStudentsPresent(bytes memory _lectureId) external view returns (uint256);

    function editStudentName(Individual[] memory _studentList) external;

    function editMentorsName(Individual[] memory _mentorsList) external;

    function mentorHandover(address newMentor) external;

    function getMentorOnDuty() external view returns (address);

    function signAttendanceWithGas(bytes calldata _lectureId) external;

    function openAttendance(bytes calldata _lectureId) external;

    function getNameArray(address[] calldata _students) external view returns (string[] memory);

    function getStudentAttendanceRatio(address _student)
        external
        view
        returns (uint256 attendace, uint256 TotalClasses);

    function listClassesAttended(address _student) external view returns (uint256[] memory);

    function getLectureIds() external view returns (uint256[] memory);

    function getLectureData(bytes calldata _lectureId) external view returns (lectureData memory);

    function requestNameCorrection() external;

    function evictStudents(address[] calldata studentsToRevoke) external;

    function removeMentor(address[] calldata rouge_mentors) external;

    function mintCertificate(string memory Uri) external;

    function mintMentorsSpok(address mentor, string memory uri) external;

    function RequestNameCorrection() external;
}
