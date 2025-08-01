// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Error {
    error LECTURE_ID_ALREADY_USED();
    error NOT_AUTHORIZED_CALLER();
    error INVALID_LECTURE_ID();
    error LECTURE_ID_CLOSED();
    error ATTENDANCE_COMPILATION_STARTED();
    error ALREADY_SIGNED_ATTENDANCE_FOR_ID();
    error ALREADY_REQUESTED();
    error NOT_A_VALID_STUDENT();
    error NOT_A_VALID_MENTOR();
    error NOT_A_VALID_MODERATOR();
    error UNAUTHORIZED_OPERATION();
    error ALREADY_INITIALIZED();
    error NOT_PERMITTED();
    error LENGTH_MISMATCH();
    error INVALID_ADDRESS();
    error TOKEN_IS_SOUL_BUND();
    error DEPLOY_ORG_DIAMOND_FACET_NOT_INITIALIZED();
    error INVALID_NUMBER_OF_FACETS_RETURNED();
    error NOT_MODERATOR();
    error NOT_ALLOWED_TO_REQUEST_A_NAME_CHANGE();
    error SPOK_ALREADY_MINTED();
    error NOT_A_MENTOR();
    error ATTENDANCE_ALREADY_OPEN();
    error ATTENDANCE_ALREADY_CLOSED();
    error CERTIFICATE_ALREADY_ISSUED();
    error UNAUTHORIZED_CALLER();
    error TEST_ID_ALREADY_USED();
    error INITIALIZATION_FAILED();
    error THREAT_DETECTED();
    error INVALID_MENTOR_ADDRESS();
    error INVALID_STUDENT_ADDRESS();
    error NOT_A_STUDENT();
}
