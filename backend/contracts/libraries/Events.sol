// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Events {
    event staffsRegistered(uint256 noOfStaffs);
    event nameChangeRequested(address changer);
    event StaffNamesChanged(uint256 noOfStaffs);
    event studentsRegistered(uint256 noOfStudents);
    event studentNamesChanged(uint256 noOfStudents);
    event attendanceCreated(bytes indexed lectureId, string indexed uri, string topic, address indexed staff);
    event topicEditted(bytes Id, string oldTopic, string newTopic);
    event AttendanceSigned(bytes Id, address signer);
    event Handover(address oldMentor, address newMentor);
    event attendanceOpened(bytes Id, address mentor);
    event attendanceClosed(bytes Id, address mentor);
    event studentsEvicted(uint256 noOfStudents);
    event mentorsRemoved(uint256 noOfStaffs);
    event newResultUpdated(uint256 testId, address mentor);
    event DebugLog(address indexed sender, uint256 orgLength, address organisationAddress, uint256 arrayLength);
}
