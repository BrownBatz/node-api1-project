const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json()); // middleware runs for every request, will parse all the data from json

const port = 5000;

let users = [
    {
        id: shortid.generate(),
        name: "Example Man",
        bio: "This is the first example man",
    }
];

// get all users
server.get('/api/users', (req, res) => {
    if (users){
        res.status(200).json(users);
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved"});
    }
});

// get users with specified ID
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;


    const foundItem = users.find(user => {
        console.log(user); 
        return (user.id === id);
    });

    if (foundItem){
        res.status(200).json(foundItem)
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist", id: id})
    }
});

// create a user // with the request body
server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    if (userInfo.name && userInfo.bio){
        console.log(userInfo);

        userInfo.id = shortid.generate();
        users.push(userInfo);
        res.status(200).json({ successMessage: "The new user has been added"})
    } else {
        res.status(400).json({ errorMessage: "Please provide a valid name and bio for the user"})
    }
});

// delete a user with a specified ID // returns the deleted user
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    const found = users.find(user => user.id === id);

    if (found){
        users = users.filter(user => user.id != id);
        res.status(200).json(users);
    } else {
        res.status(404).json({ errorMessage: "the user specified could not be found with that id" })
    }
});

// Updates the user with a specified ID // using data from the request body. Will return the modified user.
server.patch('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    let found = users.find(user => user.id === id);

    if (found) {
        Object.assign(found, changes);
        res.status(200).json(found);
    } else {
        res.status(404).json({ errorMessage: "Object was not found" });
    }
});

server.listen(port, ()=> {
    console.log(`server listening on port ${port}`);
})