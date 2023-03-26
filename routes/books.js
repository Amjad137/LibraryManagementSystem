const express = require("express");

const {books}= require("../data/books.json");
const {users} = require("../data/users.json");
const { route } = require("./user");

const router = express.Router();




/**
 * Route: /
 * Method: GET
 * description: Get All Books
 * Access: Public
 * Parameter:none
 */
router.get("/",(req,res) => {
    res.status(200).json({
        message: "HIII"
    });
});

/**
 * Route: /:id
 * Method: GET
 * description: Get a Book by ID
 * Access: Public
 * Parameter:id
 */

router.get("/:id", (req,res) => {
    const {id} = req.params;
    const selectedBook = books.find((each) => each.id === id);
    if (!selectedBook){
        return res
                .status(404)
                .json({
                    success: "false",
                    message: "Book not Found"
                });
    }

    return res
            .status(200)
            .json({
                success: "true",
                message: "Book Found",
                data : selectedBook
            });
});

/**
 * Route: /issued
 * Method: GET
 * description: Get all issued Books
 * Access: Public
 * Parameter:none
 */

router.get("/issued/allbooks", (req,res) => {
    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks=[];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
        // each >> belongs to the users.json
        // book >> belongs to the books.json
        
        book.issuedTo = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if (!usersWithIssuedBooks){
        return res
                .status(404)
                .json({
                    success: "false",
                    message: "No Books are Issued Yet"
                });
    }
    return res
            .status(200)
            .json({
                success: "true",
                check : "test",
                message: "Issued Books Found",
                data: issuedBooks
            });
});

/**
 * Route: /
 * Method: POST
 * description: Add a New Book
 * Access: Public
 * Parameter:none
 */
router.post("/", (req,res) => {
    const {data} =req.body;

    if (!data) {
        return res.status(404).json({
            success: "false",
            message: "No Data is Provided to Add the Book"

        });
    }

    const checkBook = books.find((each) => each.id===data.id);
    if (checkBook) {
        return res
                .status(404)
                .json({
                    success: "false",
                    message: "Book Already Exist"
                });
    }

    const addBook ={...books,data};
    return res
            .status(200)
            .json({
                success: "true",
                message: "Book Added",
                data: addBook
            });
});

/**
 * Route: /:id
 * Method: PUT
 * description: Updating an Existing Book by Their ID
 * Access: Public
 * Parameter:id
 */
router.put("/:id",(req,res) => {
    const {id} = req.params;
    const existingBook = books.find((each) => each.id === id);
    if (!existingBook){
        return res
                .status(404)
                .json({
                    success: "false",
                    message: "Book not Found"
                });
    }
    const {data} = req.body;


    const updatedBooks=books.map((each) => {
        if (each.id===id){
            return {...each,...data};
        }
        return each; //else statement
    });

    return res
            .status(200)
            .json({
                success: "True",
                message: "Books Updated",
                data: updatedBooks
            });
});

module.exports=router;