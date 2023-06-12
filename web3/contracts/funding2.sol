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
    uint public nonRefundedAmount = 0;
    address[] public contributorsArray;

    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Request {
        address receiver;
        uint amount;
        bool completed;
        mapping(address => bool) voters;
        uint numberOfVoters;
    }

    IERC20 token = IERC20(0x1F26A75215E616B604023627985E15b5a5732De3);
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
        deadline = _deadline;
        minContribution = _minContribution;

    }

    function hashR(uint256 amount,address receiver) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("CreateRequest(uint256 amount,address receiver)"),
            amount,
            receiver
        ));
    }
    function hashVR(uint256 number) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("VoteRequest(uint256 number)"),
            number
        ));
    }
    function hashTR(uint256 number) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("TransferToBuy(uint256 number)"),
            number
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
    function getVoterVR(uint256 number, uint8 v, bytes32 r, bytes32 s) internal view returns (address) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hashVR(number)
        ));
        return ecrecover(digest, v, r, s);
    }
    function verifyTR(uint256 number, uint8 v, bytes32 r, bytes32 s) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hashTR(number)
        ));
        return ecrecover(digest, v, r, s) == manager;
    }

    function Contribute(uint256 _tokenamount,address sender) public returns(bool) {
        require(block.timestamp < deadline,"This contract has expired");
        require(_tokenamount >= minContribution, "Minimum contribution not met");
        token.transferFrom(sender,address(this), _tokenamount);
        if(contributors[sender] == 0){
            contributorsArray.push(sender);
            noOfContributors++;
        }
        contributors[sender] += _tokenamount;
        return true;
    }
    function GetContractTokenBalance() public view returns(uint256){
        return token.balanceOf(address(this));
    }

    function CreateRequest(address receiver, uint256 amount, uint8 v, bytes32 r, bytes32 s) public  {
        require(block.timestamp < deadline,"This contract has expired");
        require(verifyR(amount,receiver, v, r, s), "Invalid signature");
        Request storage newReq = allRequests[numberOfRequests++];
        newReq.amount = amount;
        newReq.receiver = receiver;
        newReq.numberOfVoters = 0;
    }
    function VoteRequest(uint256 _reqNumber, uint8 v, bytes32 r, bytes32 s) public {
        require(block.timestamp < deadline,"This contract has expired");
        address sender = getVoterVR(_reqNumber, v, r, s);
        require(contributors[sender]>0,"You are not a Contributor, so you cannot vote or you have an invalid Signature");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.voters[sender] == false, "You have already voted!!");
        thisRequest.voters[sender] = true;
        thisRequest.numberOfVoters++;
    }
    function TransferToBuy(uint256 _reqNumber,uint8 v, bytes32 r, bytes32 s) public returns(bool){
        require(verifyTR(_reqNumber, v, r, s), "Invalid signature");
        Request storage thisRequest = allRequests[_reqNumber];
        require(thisRequest.numberOfVoters >= (noOfContributors/2), "50% or more Votes are not met (Insufficient Votes)");

        token.transfer(thisRequest.receiver,thisRequest.amount);
        thisRequest.completed = true;
        return true;
    }

    function refund(uint256 feeAmount) public{
        for(uint i=0;i<contributorsArray.length;i++){
            address receiver = contributorsArray[i];
            uint amountToSend = contributors[receiver];
            if(amountToSend>=feeAmount){
                token.transfer(receiver,amountToSend-feeAmount);
                contributors[receiver] = 0;
                noOfContributors--;
            }
        }
        token.transfer(msg.sender,GetContractTokenBalance());
    }

}