// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OrganisationFacet} from "../organisation/facets/OrganisationFacet.sol";

contract OrganisationSelectorsFacet {
    function getOrganisationSelectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](46);

        selectors[0] = OrganisationFacet.deploy.selector;
        selectors[1] = OrganisationFacet.initializeContracts.selector;
        selectors[2] = OrganisationFacet.registerStudents.selector;
        selectors[3] = OrganisationFacet.registerStaffs.selector;
        selectors[4] = OrganisationFacet.TransferOwnership.selector;
        selectors[5] = OrganisationFacet.requestNameCorrection.selector;
        selectors[6] = OrganisationFacet.editStudentName.selector;
        selectors[7] = OrganisationFacet.editMentorsName.selector;
        selectors[8] = OrganisationFacet.createAttendance.selector;
        selectors[9] = OrganisationFacet.openAttendance.selector;
        selectors[10] = OrganisationFacet.closeAttendance.selector;
        selectors[11] = OrganisationFacet.signAttendance.selector;
        selectors[12] = OrganisationFacet.mintMentorsSpok.selector;
        selectors[13] = OrganisationFacet.editTopic.selector;
        selectors[14] = OrganisationFacet.mentorHandover.selector;
        selectors[15] = OrganisationFacet.recordResults.selector;
        selectors[16] = OrganisationFacet.getResultCid.selector;
        selectors[17] = OrganisationFacet.evictStudents.selector;
        selectors[18] = OrganisationFacet.removeMentor.selector;
        selectors[19] = OrganisationFacet.getNameArray.selector;
        selectors[20] = OrganisationFacet.mintCertificate.selector;
        selectors[21] = OrganisationFacet.listStudents.selector;
        selectors[22] = OrganisationFacet.verifyStudent.selector;
        selectors[23] = OrganisationFacet.getStudentName.selector;
        selectors[24] = OrganisationFacet.getStudentAttendanceRatio.selector;
        selectors[25] = OrganisationFacet.getStudentsPresent.selector;
        selectors[26] = OrganisationFacet.listClassesAttended.selector;
        selectors[27] = OrganisationFacet.getLectureIds.selector;
        selectors[28] = OrganisationFacet.getLectureData.selector;
        selectors[29] = OrganisationFacet.listMentors.selector;
        selectors[30] = OrganisationFacet.verifyMentor.selector;
        selectors[31] = OrganisationFacet.getMentorsName.selector;
        selectors[32] = OrganisationFacet.getClassesTaugth.selector;
        selectors[33] = OrganisationFacet.getMentorOnDuty.selector;
        selectors[34] = OrganisationFacet.getModerator.selector;
        selectors[35] = OrganisationFacet.getOrganizationName.selector;
        selectors[36] = OrganisationFacet.getCohortName.selector;
        selectors[37] = OrganisationFacet.getOrganisationImageUri.selector;
        selectors[38] = OrganisationFacet.toggleOrganizationStatus.selector;
        selectors[39] = OrganisationFacet.getOrganizationStatus.selector;
        selectors[40] = OrganisationFacet.signAttendanceWithGas.selector;
        selectors[41] = OrganisationFacet.createGaslessAttendance.selector;
        selectors[42] = OrganisationFacet.openAttendanceGasless.selector;
        selectors[43] = OrganisationFacet.closeAttendanceGasless.selector;
        selectors[44] = OrganisationFacet.recordResultsGasless.selector;
        selectors[45] = OrganisationFacet.mentorHandoverGasless.selector;

        return selectors;
    }
}
