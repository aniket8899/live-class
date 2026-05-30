import express from "express";
import {body,validationResult} from "express-validator";
import { getMe,login,register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";  

const router = express.Router();

//validation middleware

const handleValidationErrors = (req, res, next) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message: errors.array()[0].msg,

        })
    } 

    next();
}

// post   /api/auth/register
router.post('/register', [
    body('name')
    .trim()
    .isLength({min:2,max:50})
    .withMessage('Name must be between 2 and 50 characters'),


     body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('please a valid email '),
    body('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters'),
    
],
handleValidationErrors,
register); 


//POST /api/auth/login

router.post('/login', [
   


     body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('please a valid email '),
    body('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters'),
    
],
handleValidationErrors,
login); 



//GET /api/auth/me
router.get('/me', protect,   getMe);

export default router;
