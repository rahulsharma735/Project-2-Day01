const {getLanguageById,submitBatch,submitToken} = require("../utils/ProblemUtility");
const Problem = require('../models/problem');

const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreater} = req.body;

    try{
        for(const {language,completeCode} of referenceSolution){

            // source_code:
            // language_id:
            // stdin:
            // expectedOutput: 

            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));


            const submitResult = await submitBatch(submissions);
            // console.log(submitResult);
            

            const resultToken = submitResult.map((value)=>value.token);
            //["nmbvfge4e5r6htfbgcvxe45fr","hgjvh65876ry5trgt6gvcbd4rtv","jkhgfdd2d345678k9u8jgyhtrgrvtedew34"];

            const testResult = await submitToken(resultToken);

            for(const test  of testResult){
              if(test.status_id!=3){
                return res.status(400).send("Error Occured");
              }
            }


        }

        // we can store it in our database.
        const userProblem =  await Problem.create({
          ...req.body,
          problemCreater: req.result._id
        });

        res.status(201).send("Prolem saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
}


const updateProblem = async (req,res)=>{
  const {id} = req.params;


  const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreater} = req.body;

  try{
    if(!id){
      return res.status(404).send("Missing Id");
    }
    
    const DsaProblem = await Problem.findById(id);

    if(!DsaProblem){
      return res.status(404).send("Id is not Present in server");
    }

    for(const {language,completeCode} of referenceSolution){

            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));


            const submitResult = await submitBatch(submissions);
            // console.log(submitResult);
            

            const resultToken = submitResult.map((value)=>value.token);
            //["nmbvfge4e5r6htfbgcvxe45fr","hgjvh65876ry5trgt6gvcbd4rtv","jkhgfdd2d345678k9u8jgyhtrgrvtedew34"];

            const testResult = await submitToken(resultToken);

            for(const test  of testResult){
              if(test.status_id!=3){
                return res.status(400).send("Error Occured");
              }
            }


        }

    const newProblem =  await Problem.findByIdAndUpdate(id, {...req.body},{runValidators:true, new:true});

    res.status(200).send(newProblem);
  }
  catch(err){
    res.status(500).send("Error :" +err);
  }
}

const deleteProblem = async (req,res)=>{
  const {id} = req.params;
  try{
    if(!id){
      return res.status(404).send("Missing Id");
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if(!deleteProblem){
      return res.status(404).send("Problem is missing");
    }

    res.status(200).send("Successfully Deleted");

  }
  catch(err){
    res.status(500).send("Error :"+err);
  }
}

const getProblemById = async (req, res)=>{
  const {id} = req.params;

  try{
    if(!id)
      return res.status(400).send("Id is missing");

    const getProblem = await Problem.findById(id);

    if(!getProblem){
      res.status().send("Problem is missing");
    }

    
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById};

/*
const  submissions= [
    {
      "language_id": 46,
      "source_code": "echo hello from Bash",
      "stdin":23,
      

    },
    {
      "language_id": 71,
      "source_code": "print(\"hello from Python\")"
    },
    {
      "language_id": 72,
      "source_code": "puts(\"hello from Ruby\")"
    }
  ]

*/

