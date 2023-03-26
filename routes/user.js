const express = require("express");

const {users} = require("../data/users.json");

const router =express.Router();

/**
 * Route: /users
 * Method: GET
 * description: Get All Users
 * Access: Public
 * Parameter:none
 */

router.get("/", (req,res) => {
    res.status(200).json({ //can't use send for more lines of output
        success: true,
        data: users,
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * description: Get User by ID
 * Access: Public
 * Parameter: id
 */

router.get("/:id", (req,res) => { 
    
    const {id} = req.params;
    const user = users.find((each) => each.id === id);

    if (!user){
      return res.status(404).json({
        success: false,
        Message: "User Not Found",
     });
    }

    return  res.status(200).json({
    success: true,
    Message: "User Found",
    data: user,
    });

});
  

/**
 * Route: /users
 * Method: POST
 * description: Creating a New User
 * Access: Public
 * Parameter: none
 */

router.post("/", (req,res) => {
    const {id, name, surname, email, subscriptionType, subscriptionDate} = req.body;

    const user = users.find((each) => each.id === id);
    if (user){
        return res.status(404).json({
            success: false,
            Message: "User Already Exist",
        });
    }

    users.push({
        id, 
        name, 
        surname, 
        email, 
        subscriptionType, 
        subscriptionDate,
    });
    return res.status(200).json({
        success: true,
        Message: "User Added",
        data: users,
    });
});

/**
 * Route: /users/:id
 * Method: PUT
 * description: Updating a User by ID
 * Access: Public
 * Parameter: id
 */

router.put("/:id",(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id ===id);
    if (!user){
        return res.status(404).json({
            success: false,
            Message: "User Not Found"
        });
    }

    const UpdatedUserData = users.map((each) => {
        if (each.id === id){
            return{ 
            ...each,
            ...data
        };
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        Message: "Updated",
        data: UpdatedUserData,
    });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * description: Deleting a User by ID
 * Access: Public
 * Parameter: id
 */
router.delete("/:id",(req,res) => {
    const {id}= req.params;
    const selectedUser = users.find((each) => each.id === id);
    if (!selectedUser){
           return res.status(404).json({
            success:false,
            messsage: "User Not Found"
        }); 
    }

    const index =users.indexOf(selectedUser);
    users.splice(index,1); 

    const userName= selectedUser.name;
    return res
    .status(200)
    .json({
        success: "true",
        messsage: `Deleted the User: ${userName}`,
        data: users
    });
});



module.exports=router;