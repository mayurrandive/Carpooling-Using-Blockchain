// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Carpooling {
    enum UserStatus { Pending, Approved, Rejected }

    struct User {
        uint userID;
        string name;
        string gender;
        string emailAddress;
        string residentialAddress;
        address walletAddress;
        string documentHash; // Hash of the document stored off-chain
        UserStatus status;
    }

    struct Vehicle {
        uint vehicleID;
        string vehicleNumber;
        string model;
        uint yearsOfUse;
        string documentHash; // Hash of the vehicle's document
    }

    struct Ride {
        uint rideId;
        string origin;
        string destination;
        uint departureTime;
        uint fare;
        uint seats;
        address host; // Address of the ride host
    }

    mapping(uint => User) public users;
    mapping(uint => Vehicle) public vehicles;
    mapping(uint => Ride) public rides;
    mapping(uint => mapping(address => bool)) public rideBookings; // Maps rideId to a mapping of user addresses who have booked

    uint public numberOfUsers;
    uint public numberOfVehicles;
    uint public nextRideId = 0;

    address public admin;

    event UserApproved(uint userID);
    event UserRejected(uint userID);
    event RideCreated(
        uint rideId,
        string origin,
        string destination,
        uint departureTime,
        uint fare,
        uint seats
    );
    event RideBooked(
        uint rideId,
        address passenger
    );

    constructor() {
        admin = msg.sender; // Set contract creator as the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addUser(
        uint _userID,
        string memory _name,
        string memory _gender,
        string memory _emailAddress,
        string memory _residentialAddress,
        address _walletAddress,
        string memory _documentHash
    ) public onlyAdmin {
        users[_userID] = User(_userID, _name, _gender, _emailAddress, _residentialAddress, _walletAddress, _documentHash, UserStatus.Pending);
        numberOfUsers++;
    }

    function approveUser(uint _userID) public onlyAdmin {
        require(users[_userID].walletAddress != address(0), "User does not exist");
        require(users[_userID].status == UserStatus.Pending, "User already processed");

        users[_userID].status = UserStatus.Approved;
        emit UserApproved(_userID);
    }

    function rejectUser(uint _userID) public onlyAdmin {
        require(users[_userID].walletAddress != address(0), "User does not exist");
        require(users[_userID].status == UserStatus.Pending, "User already processed");

        users[_userID].status = UserStatus.Rejected;
        emit UserRejected(_userID);
    }

    function createRide(
        string memory _origin,
        string memory _destination,
        uint _departureTime,
        uint _fare,
        uint _seats
    ) public {
        uint currentRideId = nextRideId;
        rides[currentRideId] = Ride(currentRideId, _origin, _destination, _departureTime, _fare, _seats, msg.sender);
        emit RideCreated(currentRideId, _origin, _destination, _departureTime, _fare, _seats);
        nextRideId++;
    }

    function bookRide(uint _rideId) public {
        require(rides[_rideId].seats > 0, "No available seats");
        require(!rideBookings[_rideId][msg.sender], "Already booked");

        rideBookings[_rideId][msg.sender] = true;
        rides[_rideId].seats--;
        emit RideBooked(_rideId, msg.sender);
    }

    
}
