import express from "express";
import { body, validationResult } from "express-validator";
import { getSession, createSession, leaveSession, endSession, listSession, joinSession } from "../controllers/sessionControllera.js";
import { protect } from "../middleware/auth.js";
import { get } from "mongoose";

const router = express.Router();

//validation middleware

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,

        })
    }

    next();
}

router.use(protect);

// GET   /api/session/list
router.get('/list', listSession);

// POST   /api/session/create
router.post('/create', createSession);

// POST   /api/session/join
router.post('/join', [
    body('roomId')
        .trim()
        .notEmpty()
        .withMessage('roomId required'),
],
    handleValidationErrors,
    joinSession
);


// GET   /api/session/:roomId
router.get('/:roomId', getSession);

// POST   /api/session/end
router.post('/end/:sessionId', endSession);






//POST /api/auth/login

router.post('/leave',
    [
        body('roomId')
            .trim()
            .notEmpty()
            .withMessage('roomId required'),
    ],
    handleValidationErrors,
    leaveSession);




export default router;
