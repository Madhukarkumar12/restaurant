import { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto"; 
import cloudinary from "../utils/cloudinary.ts";
import { generateVerificationCode } from "../utils/generateVerificationCode.ts";
import { generateToken } from "../utils/generateToken.ts";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.ts";

export const signup = async (req: Request, res: Response):Promise<void> => {
    try {
        const { fullname, email, password, contact, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
                res.status(400).json({
                success: false,
                message: "User already exist with this email"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken =  generateVerificationCode();
        console.log(verificationToken);

        let yes = false;
        if(role==="admin"){
             yes = true;
        }

        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            admin:yes
        })
        generateToken(res,user);

        await sendVerificationEmail(email, verificationToken);

        const userWithoutPassword = await User.findOne({ email }).select("-password");
           res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
};

export const login = async (req: Request, res: Response):Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
                res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
            return;
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
                res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
            return;
        }
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();

        // send user without passowrd
        const userWithoutPassword = await User.findOne({ email }).select("-password");
            res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { verificationCode } = req.body;

        // Find the user with the provided verification code and valid expiration time
        const user = await User.findOne({ 
            verificationToken: verificationCode, 
            verificationTokenExpiresAt: { $gt: Date.now() }
        }).select("-password");

        // Check if user exists
        if (!user) {
               res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
            return;
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.fullname);

        // Respond with success
            res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (_: Request, res: Response):Promise<void>=> {
    try {
            res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
};
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
            return; // Important to stop execution
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email with reset link
        await sendPasswordResetEmail(
            user.email,
            `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req: Request, res: Response):Promise<void> =>  {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
                res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
            return;
        }
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);

          res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;

        const updatedData: any = { fullname, email, address, city, country };

        // Optional: Upload profile picture if provided
        console.log("updated Data:",updatedData);
        if (profilePicture) {
            const cloudResponse = await cloudinary.uploader.upload(profilePicture);
            updatedData.profilePicture = cloudResponse.secure_url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
