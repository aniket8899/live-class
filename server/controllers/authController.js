import User from "../model/user.js";
import { generateToken } from "../utils/jwt.js";



export const register = async (req, res,next) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists',
            });
        }
        // Create new user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({ 
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
            message: 'User registered successfully',
        });


    } catch (error) {
        next(error);
    }
};




// Login user

export const login = async (req, res,next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            })
        }

        // Check password match
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
            message: 'User login successfully',
        });


    } catch (error) {
        next(error);
    }
};


//

export const getMe = async (req, res,next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if(!user){
             return res.status(404).json({
                success: false,
                error: 'User not found',
            })
        }
       res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                
            },
            message: 'User get successfully',
        });
    } catch (error) {
         next(error);

    }}