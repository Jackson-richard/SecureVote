// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint votedCandidateId;
    }

    address public admin;
    mapping(string => Voter) public voters;
    Candidate[] public candidates;
    uint public candidatesCount;

    event Voted(uint indexed candidateId, string userId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(string[] memory _candidateNames) {
        admin = msg.sender;
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        candidatesCount = _candidateNames.length;
    }

    function vote(uint _candidateId, string memory _userId) public onlyAdmin {
        require(!voters[_userId].hasVoted, "User has already voted.");
        require(_candidateId < candidatesCount, "Invalid candidate.");

        voters[_userId].hasVoted = true;
        voters[_userId].votedCandidateId = _candidateId;

        candidates[_candidateId].voteCount++;

        emit Voted(_candidateId, _userId);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
