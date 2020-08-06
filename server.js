const express = require("express")
const db = require("./database.js")

const server = express()

server.use(express.json())

server.get("/", (req, res) => {
    res.json({message: "Hello, World!"})
})

server.get("/users", (req, res) => {
    const users = db.getUsers()
    res.json(users)
})

server.get("/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    if(user){
        res.json(user)
    } else {
        res.status(404).json({message: "User not found!"})
    }
})

server.post("/api/users", (req, res) => {
    if (req.body.name === undefined || req.body.bio === undefined) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user.",
      });
    } else {
      const newUser = db.createUser({
          name: req.body.name,
          bio: req.body.bio,
      });
      res.status(201).json(newUser)
    }
  });

server.delete("/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)

    if(user) {
    db.deleteUser(req.params.id)
    
    res.status(204).end()
    } else {
        res.status(404).json({
            message: "User not found!"
        })
    }
})

server.put("/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)
    if(req.body.name === undefined || req.body.bio === undefined) {
        res.status(400).json({
            message: "Please provide name and bio for the user!",
        })
    } else if (user) {
        db.updateUser(req.params.id, req.body)
        res.status(200).json({
            name: req.body.name,
            bio: req.body.bio,
        })
    } else{
        res.status(404).json({
            message: "The user with the specified ID does not exist!"
        })
    }
})

server.listen(8080, () =>{
    console.log("Server started on port 8080")
})

