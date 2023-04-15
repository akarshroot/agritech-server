// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract kissanFundContract{
    mapping(address => uint) public contributors;
    address public manager;
    uint public target;
    uint public deadline;
    uint public minContribution;
    uint public noOfContributors;


    struct Request {
        string reason;
        address receiver;
        uint amount;
        bool completed;
        mapping(address => bool) voters;
        uint numberOfVoters;
    }


    IERC20 token = IERC20(0xA9A470ad353967297F48A95D745390dECC53Ec35);
    mapping(uint => Request) public allRequests;
    uint public numberOfRequests;

    constructor(uint _target, uint _deadline, uint _minContribution){
        manager = msg.sender;
        target = _target;
        deadline = block.timestamp + _deadline;
        minContribution = _minContribution;
    }
  
    modifier OnlyOwner(){
        require(msg.sender == manager, "Only the owner can call this function");
        _;
    }

    function GetUserTokenBalance() public view returns(uint256){ 
        return token.balanceOf(msg.sender);// balancdOf function is already declared in ERC20 token function
    }
    // function Approvetokens(uint256 _tokenamount) public returns(bool){
    //     bool ans = token.approve(address(this), _tokenamount);
    //     return ans;
    // }
    function GetAllowance() public view returns(uint256){
        return token.allowance(msg.sender, address(this));
    }
    function contribute(uint256 _tokenamount) public returns(bool) {
        require(_tokenamount >= minContribution, "Minimum contribution not met");
        // require(_tokenamount > GetAllowance(), "Please approve tokens before transferring");
        token.transferFrom(msg.sender,address(this), _tokenamount);

        if(contributors[msg.sender] == 0){
            noOfContributors++;
        }
        contributors[msg.sender] += _tokenamount;
        return true;
    }
    function GetContractTokenBalance() public view returns(uint256){
        return token.balanceOf(address(this));
    }



    function createRequest(string memory _reason, address _receiver, uint _amount) public OnlyOwner {
        Request storage newReq = allRequests[numberOfRequests++];
        newReq.reason = _reason;
        newReq.amount = _amount;
        newReq.receiver = _receiver;
        newReq.numberOfVoters = 0;
    }
    function voteRequest(uint _reqNumber) public {
        require(contributors[msg.sender]>0,"You are not a Contributor, so you cannot vote");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.voters[msg.sender] == false, "You have already voted!!");
        thisRequest.voters[msg.sender] = true;
        thisRequest.numberOfVoters++;
    }
    function transferToBuy(uint _reqNumber) public OnlyOwner returns(bool){
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.numberOfVoters >= (noOfContributors/2), "50% or more Votes are not met (Insufficient Votes)");

        token.transfer(thisRequest.receiver,thisRequest.amount);
        thisRequest.completed = true;
        return true;
    }

}