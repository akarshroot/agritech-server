// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract kissanFundContract2{

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

    IERC20 token = IERC20(0x8f13012ef2869c33dcB260bcc498C8eC9A593691);
    mapping(uint => Request) public allRequests;
    uint public numberOfRequests;
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

    constructor(address _owner,uint _target, uint _deadline, uint _minContribution){
        DOMAIN_SEPARATOR = hash(EIP712Domain({
            name: "KissanCoinsContract",
            version: '1',
            chainId: 1337,
            verifyingContract: address(this)
        }));
        
        manager = _owner;
        target = _target;
        deadline = block.timestamp + _deadline;
        minContribution = _minContribution;

    }
    

    function hashR(uint256 amount,address sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("Creater(uint256 amount,address receiver)"),
            amount,
            sender
        ));
    }
    function hashVR(uint256 number, address sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("VoteIn(uint256 number,address sender)"),
            number,
            sender
        ));
    }
    function hashTR(uint256 number, address sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("UseReq(uint256 number,address sender)"),
            number,
            sender
        ));
    }


    function verifyR(uint256 amount,address sender, uint8 v, bytes32 r, bytes32 s) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hashR(amount,sender)
        ));
        return ecrecover(digest, v, r, s) == manager;
    }
    function verifyVR(uint256 number,address sender, uint8 v, bytes32 r, bytes32 s) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hashVR(number,sender)
        ));
        return ecrecover(digest, v, r, s) == manager;
    }
    function verifyTR(uint256 number,address sender, uint8 v, bytes32 r, bytes32 s) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hashTR(number,sender)
        ));
        return ecrecover(digest, v, r, s) == manager;
    }

    function Contribute(uint256 _tokenamount,address sender) public returns(bool) {
    //     require(verifyC(_tokenamount,sender , v, r, s), "Invalid signature");
        require(_tokenamount >= minContribution, "Minimum contribution not met");
        token.transferFrom(sender,address(this), _tokenamount);
        if(contributors[sender] == 0){
            noOfContributors++;
        }
        contributors[sender] += _tokenamount;
        return true;
    }
    function GetContractTokenBalance() public view returns(uint256){
        return token.balanceOf(address(this));
    }



    function CreateRequest(string memory reason ,address receiver, uint256 amount, uint8 v, bytes32 r, bytes32 s) public  {
        require(verifyR(amount,receiver, v, r, s), "Invalid signature");
        Request storage newReq = allRequests[numberOfRequests++];
        newReq.reason = reason;
        newReq.amount = amount;
        newReq.receiver = receiver;
        newReq.numberOfVoters = 0;
    }
    function VoteRequest(uint256 _reqNumber,address sender, uint8 v, bytes32 r, bytes32 s) public {
        require(verifyVR(_reqNumber,sender, v, r, s), "Invalid signature");
        require(contributors[sender]>0,"You are not a Contributor, so you cannot vote");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.voters[sender] == false, "You have already voted!!");
        thisRequest.voters[sender] = true;
        thisRequest.numberOfVoters++;
    }
    function TransferToBuy(uint256 _reqNumber,address sender,uint8 v, bytes32 r, bytes32 s) public returns(bool){
        require(verifyTR(_reqNumber,sender, v, r, s), "Invalid signature");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.numberOfVoters >= (noOfContributors/2), "50% or more Votes are not met (Insufficient Votes)");

        token.transfer(thisRequest.receiver,thisRequest.amount);
        thisRequest.completed = true;
        return true;
    }

}