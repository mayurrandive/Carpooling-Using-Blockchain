// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Carpooling {
    struct User {
        uint userID;
        string name;
        string gender;
        string emailAddress;
        string residentialAddress;
        address walletAddress;
        string documentHash; // Hash of the document stored off-chain
    }

    struct Vehicle {
        uint vehicleID;
        string vehicleNumber;
        string Model;
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

    constructor() {
        admin = msg.sender; // Set contract creator as the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

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

    function addUser(
        uint _userID,
        string memory _name,
        string memory _gender,
        string memory _emailAddress,
        string memory _residentialAddress,
        address _walletAddress,
        string memory _documentHash
    ) public onlyAdmin {
        users[_userID] = User(_userID, _name, _gender, _emailAddress, _residentialAddress, _walletAddress, _documentHash);
        numberOfUsers++;
    }

    function deleteUser(uint _userID) public onlyAdmin {
        delete users[_userID];
        numberOfUsers--;
    }

    function addVehicle(
        uint _vehicleID,
        string memory _vehicleNumber,
        string memory _Model,
        uint _yearsOfUse,
        string memory _documentHash
    ) public onlyAdmin {
        vehicles[_vehicleID] = Vehicle(_vehicleID, _vehicleNumber, _Model, _yearsOfUse, _documentHash);
        numberOfVehicles++;
    }

    function deleteVehicle(uint _vehicleID) public onlyAdmin {
        delete vehicles[_vehicleID];
        numberOfVehicles--;
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

    // Function to receive payments for a specific ride
    function payForRide(uint _rideId) public payable {
        require(msg.value == rides[_rideId].fare, "Incorrect fare amount");
        address host = rides[_rideId].host;
        require(host != address(0), "Ride does not exist or host is invalid");

        payable(host).transfer(msg.value); // Transfer the fare to the host
    }

    // Additional functions can be added here
    // ...
}
