const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
    let Voting;
    let voting;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const VotingFactory = await ethers.getContractFactory("Voting");
        voting = await VotingFactory.deploy(["Alice", "Bob", "Charlie"]);
    });

    it("Should initialize with correct candidates", async function () {
        const candidates = await voting.getAllCandidates();
        expect(candidates.length).to.equal(3);
        expect(candidates[0].name).to.equal("Alice");
    });

    it("Should allow admin to vote for a user", async function () {
        await voting.connect(owner).vote(0, "user1");
        const candidates = await voting.getAllCandidates();
        expect(candidates[0].voteCount).to.equal(1n);
    });

    it("Should prevent double voting for same user ID", async function () {
        await voting.connect(owner).vote(0, "user1");
        await expect(
            voting.connect(owner).vote(1, "user1")
        ).to.be.revertedWith("User has already voted.");
    });

    it("Should prevent voting for invalid candidate", async function () {
        await expect(
            voting.connect(owner).vote(99, "user1")
        ).to.be.revertedWith("Invalid candidate.");
    });

    it("Should prevent non-admin from voting", async function () {
        await expect(
            voting.connect(addr1).vote(0, "user2")
        ).to.be.revertedWith("Only admin can perform this action");
    });
});
