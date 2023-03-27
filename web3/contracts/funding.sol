// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract kissanFundContract{
    mapping(address => uint) public contributors;
    address public manager;
    uint public target;
    uint public deadline;
    uint public minContribution;
    uint public noOfContributors;

    struct Request {
        string reason;
        address payable reciver;
        uint amount;
        bool completed;
        mapping(address => bool) voters;
        uint numberOfVoters;
    }

    mapping(uint => Request) public allRequests;
    uint public numberOfRequests;

    constructor(uint _target, uint _deadline, uint _minContribution){
        manager = msg.sender;
        target = _target;
        deadline = block.timestamp + _deadline;
        minContribution = _minContribution;
    }
    
    modifier onlyOwner(){
        require(msg.sender == manager, "Only the owner can call this function");
        _;
    }

    function createRequest(string memory _reason, address _reciver, uint _amount) public onlyOwner {
        Request storage newReq = allRequests[numberOfRequests++];
        newReq.reason = _reason;
        newReq.amount = _amount;
        newReq.reciver = payable(_reciver);
        newReq.numberOfVoters = 0;
    }

    function voteRequest(uint _reqNumber) public {
        require(contributors[msg.sender]>0,"You are not a Contributor, so you cannot vote");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.voters[msg.sender] == false, "You have already voted!!");
        thisRequest.voters[msg.sender] = true;
        thisRequest.numberOfVoters++;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "This FundContract has expired");
        require(msg.value >= minContribution, "Minimum contribution not met");

        if(contributors[msg.sender] == 0){
            noOfContributors++;
        }
        contributors[msg.sender] += msg.value;
    }

    function getRaisedAmount()public view returns(uint){
        return address(this).balance;
    }

    function refund() public payable{
        require(block.timestamp > deadline  &&  getRaisedAmount()<target);
        require(contributors[msg.sender] > 0);

        address payable refunder = payable(msg.sender);
        refunder.transfer(contributors[msg.sender]);
        contributors[msg.sender] = 0;
    }

}