// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "../../interfaces/IFactory.sol";
import "../../interfaces/INFT.sol";
import "../../libraries/Error.sol";
import "../../libraries/Events.sol";
import "../../certificates/SchoolCertificate.sol";

library LibOrganisation {
    struct Organisation {
        bool isOngoing;
        /**
         * ============================================================ *
         * --------------------- ORGANIZATION RECORD------------------- *
         * ============================================================ *
         */
        string organization;
        string cohort;
        string certificateURI;
        address organisationFactory;
        address NftContract;
        address certificateContract;
        bool certificateIssued;
        string organisationImageUri;
        address spokContract;
        string spokURI;
        bool spokMinted;
        mapping(address => bool) requestNameCorrection;
        /**
         * ============================================================ *
         * --------------------- ATTENDANCE RECORD--------------------- *
         * ============================================================ *
         */
        bytes[] LectureIdCollection;
        mapping(bytes => lectureData) lectureInstance;
        mapping(bytes => bool) lectureIdUsed;
        /**
         * ============================================================ *
         * --------------------- STUDENTS RECORD------------------- *
         * ============================================================ *
         */
        address[] students;
        mapping(address => Individual) studentsData;
        mapping(address => uint256) indexInStudentsArray;
        mapping(address => uint256) studentsTotalAttendance;
        mapping(address => bool) isStudent;
        mapping(address => bytes[]) classesAttended;
        mapping(address => mapping(bytes => bool)) individualAttendanceRecord;
        string[] resultCid;
        mapping(uint256 => bool) testIdUsed;
        /**
         * ============================================================ *
         * --------------------- STAFFS RECORD------------------------- *
         * ============================================================ *
         */
        address moderator;
        address mentorOnDuty;
        address[] mentors;
        mapping(address => uint256) indexInMentorsArray;
        mapping(address => bytes[]) moderatorsTopic;
        mapping(address => bool) isStaff;
        mapping(address => Individual) mentorsData;
        address relayer;
    }

    struct lectureData {
        address mentorOnDuty;
        string topic;
        string uri;
        uint256 attendanceStartTime;
        uint256 studentsPresent;
        bool status;
    }

    // MODIFIERS

    function onlyModerator() private view {
        Organisation storage org = orgStorage();

        if (msg.sender != org.moderator) {
            revert Error.NOT_A_VALID_MODERATOR();
        }
    }

    function onlyMentorOnDuty() private view {
        Organisation storage org = orgStorage();

        if (msg.sender != org.mentorOnDuty) {
            revert Error.NOT_A_VALID_MODERATOR();
        }
    }

    function onlyStudents() private view {
        Organisation storage org = orgStorage();
        if (org.isStudent[msg.sender] == false) {
            revert Error.NOT_A_VALID_STUDENT();
        }
    }

    function onlyStudentOrStaff() private view {
        Organisation storage org = orgStorage();

        if (!(org.isStudent[msg.sender] == true || msg.sender == org.moderator || org.isStaff[msg.sender] == true)) {
            revert Error.NOT_ALLOWED_TO_REQUEST_A_NAME_CHANGE();
        }
    }

    function onlyStaff() private view {
        Organisation storage org = orgStorage();

        if (!(msg.sender == org.moderator || org.isStaff[msg.sender])) {
            revert Error.NOT_MODERATOR();
        }
    }

    function deploy(
        string memory _organization,
        string memory _cohort,
        address _moderator,
        string memory _adminName,
        string memory _uri
    ) internal {
        LibOrganisation.Organisation storage org = LibOrganisation.orgStorage();
        org.moderator = _moderator;
        org.organization = _organization;
        org.cohort = _cohort;
        org.organisationFactory = msg.sender;
        org.mentorOnDuty = _moderator;
        org.indexInMentorsArray[_moderator] = org.mentors.length;
        org.mentors.push(_moderator);
        org.isStaff[_moderator] = true;
        org.mentorsData[_moderator]._address = _moderator;
        org.mentorsData[_moderator]._name = _adminName;
        org.organisationImageUri = _uri;
        org.isOngoing = true;
    }

    function registerStaffs(Individual[] calldata staffList) internal {
        Organisation storage org = orgStorage();

        onlyModerator();
        uint256 staffLength = staffList.length;
        for (uint256 i; i < staffLength; i++) {
            if (org.isStaff[staffList[i]._address] == false && org.isStudent[staffList[i]._address] == false) {
                org.mentorsData[staffList[i]._address] = staffList[i];
                org.isStaff[staffList[i]._address] = true;
                org.indexInMentorsArray[staffList[i]._address] = org.mentors.length;
                org.mentors.push(staffList[i]._address);
            }
        }
        IFACTORY(org.organisationFactory).register(staffList);
        emit Events.staffsRegistered(staffList.length);
    }

    function TransferOwnership(address newModerator) internal {
        Organisation storage org = orgStorage();

        onlyModerator();
        assert(newModerator != address(0));
        org.moderator = newModerator;
    }

    function registerStudents(Individual[] calldata _studentList) internal {
        Organisation storage org = orgStorage();

        onlyModerator();
        uint256 studentLength = _studentList.length;
        for (uint256 i; i < studentLength; i++) {
            if (org.isStudent[_studentList[i]._address] == false && org.isStaff[_studentList[i]._address] == false) {
                org.studentsData[_studentList[i]._address] = _studentList[i];
                org.indexInStudentsArray[_studentList[i]._address] = org.students.length;
                org.students.push(_studentList[i]._address);
                org.isStudent[_studentList[i]._address] = true;
            }
        }
        IFACTORY(org.organisationFactory).register(_studentList);
        emit Events.studentsRegistered(_studentList.length);
    }

    function requestNameCorrection() internal {
        Organisation storage org = orgStorage();

        onlyStudentOrStaff();

        if (org.requestNameCorrection[msg.sender] == true) {
            revert Error.ALREADY_REQUESTED();
        }

        org.requestNameCorrection[msg.sender] = true;

        emit Events.nameChangeRequested(msg.sender);
    }

    function editStudentName(Individual[] calldata _studentList) internal {
        Organisation storage org = orgStorage();

        onlyStudentOrStaff();

        uint256 studentLength = _studentList.length;

        for (uint256 i; i < studentLength; i++) {
            if (org.requestNameCorrection[_studentList[i]._address] == true) {
                org.studentsData[_studentList[i]._address] = _studentList[i];

                org.requestNameCorrection[_studentList[i]._address] = false;
            }
        }
        emit Events.studentNamesChanged(_studentList.length);
    }

    function editMentorsName(Individual[] calldata _mentorsList) internal {
        Organisation storage org = orgStorage();

        onlyStudentOrStaff();

        uint256 MentorsLength = _mentorsList.length;

        for (uint256 i; i < MentorsLength; i++) {
            if (org.requestNameCorrection[_mentorsList[i]._address] == true) {
                org.mentorsData[_mentorsList[i]._address] = _mentorsList[i];
                org.requestNameCorrection[_mentorsList[i]._address] = false;
            }
        }
        emit Events.StaffNamesChanged(_mentorsList.length);
    }

    function createAttendance(bytes calldata _lectureId, string calldata _uri, string calldata _topic) internal {
        Organisation storage org = orgStorage();

        onlyMentorOnDuty();
        if (org.lectureIdUsed[_lectureId] == true) {
            revert Error.LECTURE_ID_ALREADY_USED();
        }
        org.lectureIdUsed[_lectureId] = true;

        org.LectureIdCollection.push(_lectureId);

        org.lectureInstance[_lectureId].uri = _uri;

        org.lectureInstance[_lectureId].topic = _topic;

        org.lectureInstance[_lectureId].mentorOnDuty = msg.sender;

        org.moderatorsTopic[msg.sender].push(_lectureId);

        INFT(org.NftContract).setDayUri(_lectureId, _uri);

        emit Events.attendanceCreated(_lectureId, _uri, _topic, msg.sender);
    }

    function mintMentorsSpok(address mentor, string memory uri) internal {
        Organisation storage org = orgStorage();
        onlyModerator();

        if (org.spokMinted) {
            revert Error.SPOK_ALREADY_MINTED();
        }

        if (!isMentor(mentor, org.mentors)) {
            revert Error.NOT_A_MENTOR();
        }

        Certificate(org.spokContract).safeMint(mentor, uri);
        org.spokURI = uri;
        org.spokMinted = true;
    }

    function isMentor(address _mentor, address[] memory mentors) internal pure returns (bool) {
        for (uint256 i = 0; i < mentors.length; i++) {
            if (mentors[i] == _mentor) return true;
        }
        return false;
    }

    function editTopic(bytes memory _lectureId, string calldata _topic) internal {
        Organisation storage org = orgStorage();

        if (msg.sender != org.lectureInstance[_lectureId].mentorOnDuty) {
            revert Error.UNAUTHORIZED_CALLER();
        }
        if (org.lectureInstance[_lectureId].attendanceStartTime != 0) {
            revert Error.ATTENDANCE_COMPILATION_STARTED();
        }
        string memory oldTopic = org.lectureInstance[_lectureId].topic;
        org.lectureInstance[_lectureId].topic = _topic;
        emit Events.topicEditted(_lectureId, oldTopic, _topic);
    }

    function signAttendance(address student, bytes memory lectureId) internal {
        Organisation storage org = orgStorage();
        require(msg.sender == org.relayer, "THREAT_DETECTED");
        require(student != address(0), "INVALID_STUDENT_ADDRESS");
        require(org.isStudent[student], "NOT_A_STUDENT");

        if (org.lectureIdUsed[lectureId] == false) {
            revert Error.INVALID_LECTURE_ID();
        }
        if (org.lectureInstance[lectureId].status == false) {
            revert Error.LECTURE_ID_CLOSED();
        }
        if (org.individualAttendanceRecord[student][lectureId] == true) {
            revert Error.ALREADY_SIGNED_ATTENDANCE_FOR_ID();
        }
        if (org.lectureInstance[lectureId].attendanceStartTime == 0) {
            org.lectureInstance[lectureId].attendanceStartTime = block.timestamp;
        }

        org.individualAttendanceRecord[student][lectureId] = true;
        org.studentsTotalAttendance[student] = org.studentsTotalAttendance[student] + 1;
        org.lectureInstance[lectureId].studentsPresent = org.lectureInstance[lectureId].studentsPresent + 1;
        org.classesAttended[student].push(lectureId);

        INFT(org.NftContract).mint(student, lectureId, 1);
        emit Events.AttendanceSigned(lectureId, student);
    }

    function signAttendanceWithGas(bytes memory _lectureId) internal {
        Organisation storage org = orgStorage();
        onlyStudents();
        if (org.lectureIdUsed[_lectureId] == false) {
            revert Error.INVALID_LECTURE_ID();
        }
        if (org.lectureInstance[_lectureId].status == false) {
            revert Error.LECTURE_ID_CLOSED();
        }
        if (org.individualAttendanceRecord[msg.sender][_lectureId] == true) {
            revert Error.ALREADY_SIGNED_ATTENDANCE_FOR_ID();
        }
        if (org.lectureInstance[_lectureId].attendanceStartTime == 0) {
            org.lectureInstance[_lectureId].attendanceStartTime = block.timestamp;
        }
        org.individualAttendanceRecord[msg.sender][_lectureId] = true;
        org.studentsTotalAttendance[msg.sender] = org.studentsTotalAttendance[msg.sender] + 1;
        org.lectureInstance[_lectureId].studentsPresent = org.lectureInstance[_lectureId].studentsPresent + 1;
        org.classesAttended[msg.sender].push(_lectureId);

        INFT(org.NftContract).mint(msg.sender, _lectureId, 1);
        emit Events.AttendanceSigned(_lectureId, msg.sender);
    }

    function mentorHandover(address newMentor) internal {
        Organisation storage org = orgStorage();

        if (msg.sender != org.mentorOnDuty && msg.sender != org.moderator) {
            revert Error.UNAUTHORIZED_CALLER();
        }
        org.mentorOnDuty = newMentor;
        emit Events.Handover(msg.sender, newMentor);
    }

    function openAttendance(bytes calldata _lectureId) internal {
        Organisation storage org = orgStorage();

        onlyMentorOnDuty();
        if (org.lectureIdUsed[_lectureId] == false) {
            revert Error.INVALID_LECTURE_ID();
        }
        if (org.lectureInstance[_lectureId].status == true) {
            revert Error.ATTENDANCE_ALREADY_OPEN();
        }
        if (msg.sender != org.lectureInstance[_lectureId].mentorOnDuty) {
            revert Error.UNAUTHORIZED_CALLER();
        }

        org.lectureInstance[_lectureId].status = true;
        emit Events.attendanceOpened(_lectureId, msg.sender);
    }

    function closeAttendance(bytes calldata _lectureId) internal {
        Organisation storage org = orgStorage();

        onlyMentorOnDuty();

        if (!org.lectureIdUsed[_lectureId]) {
            revert Error.INVALID_LECTURE_ID();
        }

        if (!org.lectureInstance[_lectureId].status) {
            revert Error.ATTENDANCE_ALREADY_CLOSED();
        }

        if (msg.sender != org.lectureInstance[_lectureId].mentorOnDuty) {
            revert Error.UNAUTHORIZED_CALLER();
        }

        org.lectureInstance[_lectureId].status = false;

        emit Events.attendanceClosed(_lectureId, msg.sender);
    }

    function recordResults(uint256 testId, string calldata _resultCid) internal {
        Organisation storage org = orgStorage();

        onlyMentorOnDuty();
        if (org.testIdUsed[testId]) {
            revert Error.TEST_ID_ALREADY_USED();
        }
        org.testIdUsed[testId] = true;
        org.resultCid.push(_resultCid);
        emit Events.newResultUpdated(testId, msg.sender);
    }

    function evictStudents(address[] calldata studentsToRevoke) internal {
        Organisation storage org = orgStorage();

        onlyModerator();
        uint256 studentsToRevokeList = studentsToRevoke.length;
        for (uint256 i; i < studentsToRevokeList; i++) {
            delete org.studentsData[studentsToRevoke[i]];

            org.students[org.indexInStudentsArray[studentsToRevoke[i]]] = org.students[org.students.length - 1];
            org.students.pop();
            org.isStudent[studentsToRevoke[i]] = false;
        }

        IFACTORY(org.organisationFactory).revoke(studentsToRevoke);
        emit Events.studentsEvicted(studentsToRevoke.length);
    }

    function removeMentor(address[] calldata rouge_mentors) internal {
        Organisation storage org = orgStorage();

        onlyModerator();
        uint256 mentorsRouge = rouge_mentors.length;
        for (uint256 i; i < mentorsRouge; i++) {
            delete org.mentorsData[rouge_mentors[i]];
            org.mentors[org.indexInMentorsArray[rouge_mentors[i]]] = org.mentors[org.mentors.length - 1];
            org.mentors.pop();
            org.isStaff[rouge_mentors[i]] = false;
        }
        IFACTORY(org.organisationFactory).revoke(rouge_mentors);
        emit Events.mentorsRemoved(rouge_mentors.length);
    }

    function getNameArray(address[] calldata _students) internal view returns (string[] memory) {
        Organisation storage org = orgStorage();

        string[] memory Names = new string[](_students.length);
        string memory emptyName;
        for (uint256 i = 0; i < _students.length; i++) {
            if (
                keccak256(abi.encodePacked(org.studentsData[_students[i]]._name))
                    == keccak256(abi.encodePacked(emptyName))
            ) {
                Names[i] = "UNREGISTERED";
            } else {
                Names[i] = org.studentsData[_students[i]]._name;
            }
        }
        return Names;
    }

    function mintCertificate(string memory Uri) internal {
        Organisation storage org = orgStorage();

        onlyModerator();

        if (org.certificateIssued) {
            revert Error.CERTIFICATE_ALREADY_ISSUED();
        }
        INFT(org.certificateContract).batchMintTokens(org.students, Uri);

        org.certificateURI = Uri;

        org.certificateIssued = true;
    }

    bytes32 constant ORGANISATION_STORAGE_POSITION = keccak256("lib.organisation.storage");

    function orgStorage() internal pure returns (Organisation storage org) {
        bytes32 position = ORGANISATION_STORAGE_POSITION;
        assembly {
            org.slot := position
        }
    }
}
