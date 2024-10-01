import User from "../../model/user.model.js";
import jwt from "jsonwebtoken"
const secret = process.env.JWT_SECRET || 'default_secret';

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password)
    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Create and return JWT token
        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: '1h',
        });

        return res.status(201).json({ token });
    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create and return JWT token
        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: '1h',
        });

        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}