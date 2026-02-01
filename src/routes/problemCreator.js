const express = require('express');


const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");

// create
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolveByUser/user",userMiddleware,solvedAllProblembyUser);
// featch
// update
// delete


module.exports = problemRouter;