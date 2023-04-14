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
    
    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Request {
        string reason;
        address receiver;
        uint amount;
        bool completed;
        mapping(address => bool) voters;
        uint numberOfVoters;
    }
    struct ReqData {
        string reason;
        address receiver;
        uint amount;
    }

    IERC20 token = IERC20(0x1cE8c5Ccf95154C3B5A806f90392B62A1540052e);
    mapping(uint => Request) public allRequests;
    uint public numberOfRequests;

    constructor(address _owner,uint _target, uint _deadline, uint _minContribution){
        DOMAIN_SEPARATOR = hash(EIP712Domain({
            name: "KissanCoins",
            version: '1',
            chainId: block.chainid,
            verifyingContract: address(this)
        }));
        
        manager = _owner;
        target = _target;
        deadline = block.timestamp + _deadline;
        minContribution = _minContribution;

    }
    bytes32 DOMAIN_SEPARATOR;

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes(eip712Domain.name)),
            keccak256(bytes(eip712Domain.version)),
            eip712Domain.chainId,
            eip712Domain.verifyingContract
        ));
    }

    function hash(ReqData memory greeting) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("Greeting(string text,uint deadline)"),
            keccak256(bytes(greeting.text)),
        ));
    }

    function verify(ReqData memory reqdata, uint8 v, bytes32 r, bytes32 s) public view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hash(reqdata)
        ));
        return ecrecover(digest, v, r, s) == manager;
    }

    // function greet(Greeting memory greeting, address sender, uint8 v, bytes32 r, bytes32 s) public {
    //     require(verify(greeting, sender, v, r, s), "Invalid signature");
    //     require(block.timestamp <= greeting.deadline, "Deadline reached");
    //     greetingText = greeting.text;
    //     greetingSender = sender;
    // }



    

    function GetUserTokenBalance() public view returns(uint256){ 
        return token.balanceOf(msg.sender);
    }
    function GetAllowance() public view returns(uint256){
        return token.allowance(msg.sender, address(this));
    }
    function contribute(uint256 _tokenamount, uint8 v, bytes32 r, bytes32 s) public returns(bool) {
        require(verify(greeting, sender, v, r, s), "Invalid signature");
        require(_tokenamount >= minContribution, "Minimum contribution not met");
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



    function createRequest(ReqData memory dataIncomming, address _receiver, uint _amount, uint8 v, bytes32 r, bytes32 s) public  {
        require(verify(greeting, sender, v, r, s), "Invalid signature");
        Request storage newReq = allRequests[numberOfRequests++];
        newReq.reason = dataIncomming.reason;
        newReq.amount = dataIncomming.amount;
        newReq.receiver = dataIncomming.receiver;
        newReq.numberOfVoters = 0;
    }
    function voteRequest(uint _reqNumber) public {
        require(contributors[msg.sender]>0,"You are not a Contributor, so you cannot vote");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.voters[msg.sender] == false, "You have already voted!!");
        thisRequest.voters[msg.sender] = true;
        thisRequest.numberOfVoters++;
    }
    function transferToBuy(uint _reqNumber) public returns(bool){
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.numberOfVoters >= (noOfContributors/2), "50% or more Votes are not met (Insufficient Votes)");

        token.transfer(thisRequest.receiver,thisRequest.amount);
        thisRequest.completed = true;
        return true;
    }

}