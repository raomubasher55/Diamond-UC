
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');




//siginup user
const signupUser = async (req, res) => {
    try { 
        // Express validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;
 
        // Check if user already exists
        const isExistUser = await userModel.findOne({});
        if (isExistUser) {
            return res.status(400).json({
                success: false,
                msg: "Only One Account is Allow",
                errors:[{
                    msg: "One One Account is Allow"
                }]
            });
        }


        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // Create new user with default values if not provided
        const user = new userModel({
            username,
            email,
            password: hashPassword,
        });

        const userData = await user.save();

        return res.status(201).json({
            success: true,
            msg: "Your account has been created successfully",
            data: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
}


const gernateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "10h" });
    return token;
}


//loin user
const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ 
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

        const { password, email } = req.body;
        const userData = await userModel.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password or Email"
            });
        }

        const isMatchPassword = await bcrypt.compare(password, userData.password);
        if (!isMatchPassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password or Email"
            });
        }
        
        const accessToken = await gernateAccessToken({ user: userData });

        return res.status(200).json({
            success: true,
            message: "You logined successfully",
            user: userData,
            accessToken: accessToken,
            tokenType: "Bearer"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        })
    }
}

//Profile
const userProfile = async (req, res) => {
    try {   

        const email = req.user.user.email;
        const user = await userModel.findOne({email})
                
        return res.status(200).json({
            success: true,
            message: "User Profile  Data",
            data: user, 
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        })
    }
}

//update Profile
const updateProfile = async (req, res) => {
    try {
        const { name, mobile } = req.body;

        const data = { name, mobile, }

        const user_id = req.user.user._id;
            
        const userData = await userModel.findByIdAndUpdate({ _id: user_id }, {
            $set: data
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "User Data updated successfully",
            data: userData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//logout 
const logout = async (req, res) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not provided"
            });
        }

        const bearer = token.split(" ");
        const bearerToken = bearer[1];

        res.setHeader('Clear-Site-Data', ' "cookies" , "storage"');
        return res.status(200).json({
            success: true,
            message: "You are logged out"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

    const bankDetail = async (req, res) => {
        try {
            console.log(req.body);
            
        const userId = req.user.user._id; // Get the user ID from the request object or another source
    
        // Update the user's bank details
        const user = await userModel.findOneAndUpdate(
            { _id: userId },
            { bankDetails: req.body }, // Assuming req.body contains the bank details
            { new: true, runValidators: true }
        );
    
        if (!user) {
            return res.status(404).json({
            success: false,
            message: "User not found",
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Bank details updated successfully",
            data: user,
        });
        } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
        }
    };
  


    const transitionPlan = async (userId, nextPlanId) => {
        try {
            // Find the user
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            // Check if the current plan is completed
            const currentPlan = await planModel.findById(user.currentPlan);
            if (!currentPlan || currentPlan.status !== 'completed') {
                throw new Error('Current plan is not completed');
            }
    
            // Update current plan to completed
            await planModel.findByIdAndUpdate(user.currentPlan, { status: 'completed' });
    
            // Update user to next plan
            user.currentPlan = nextPlanId;
            await user.save();
    
            // Set next plan to active
            await planModel.findByIdAndUpdate(nextPlanId, { status: 'active' });
    
            return { success: true, msg: 'Plan updated successfully' };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };
    
    

module.exports = {
    signupUser,
    loginUser,
    userProfile,
    updateProfile,
    logout,
    bankDetail,
    transitionPlan
}   