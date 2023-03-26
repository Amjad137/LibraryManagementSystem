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

/**
 * Route: /subscription/:id
 * Method: GET
 * description: Get user subscription details by id
 * Access: Public
 * Parameter: none
 */

router.get("/subscription/:id",(req,res) => {
    const {id}=req.params;
    const existingUser = users.find((each) => each.id === id);
    if (!existingUser){
        return res
                .status(404)
                .json({
                    success: "false",
                    messsage: "User ID not Found"
                });
    }

    const dateInDays= (data= "") => {
        let date;
        if (data ===""){
            date=new Date();
        }else {
            date = new Date(data);
        }
        const days= Math.floor(date/(1000*60*60*24));
        return days;
    };

    const subscriptionType =(days) => {
        if (existingUser.subscriptionType === "Basic"){
            days=days + 90;
        }else if (existingUser.subscriptionType === "Standard"){
            days=days + 180;
        }else if (existingUser.subscriptionType === "Premium"){
            days=days + 365;
        }
        return days;
    };

    let returnDate= dateInDays(existingUser.returnDate);
    let currentDate =dateInDays();
    let subscriptionDate = dateInDays(existingUser.subscriptionDate);
    let varDaysLeftForExpiration = subscriptionType(subscriptionDate);

    const data={
        ...existingUser,
        isSubscriptionExpired: varDaysLeftForExpiration <= currentDate,
        daysLeftForExpiration: 
            varDaysLeftForExpiration <= currentDate
            ? 0
            :varDaysLeftForExpiration-currentDate,
        fine:
            returnDate < currentDate
                ? subscriptionDate <= currentDate
                    ?100 //if subscriptionexpired then 100/- charge
                    :50
                :0,
    };
    return res      
            .status(200)
            .json({
                success: "true",
                messsage: "Fetched the Data",
                data: data
            });
});

module.exports=router;