// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Chat {
    struct Message {
        address sender;
        uint timestamp;
        string content;
    }

    Message[] public messages;

    function sendMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");
        messages.push(Message(msg.sender, block.timestamp, _content));
    }

    function messageCount() public view returns (uint) {
        return messages.length;
    }

    function getMessage(uint index) public view returns (address sender, uint timestamp, string memory content) {
        require(index < messages.length, "Invalid index");
        Message storage m = messages[index];
        return (m.sender, m.timestamp, m.content);
    }
}