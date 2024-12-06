import AuthModel from '../models/AuthModel.js';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcryptjs';

export const register = async (req, res) => {
    const { username , email, password } = req.body;
    try {
        const user = await AuthModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bycrypt.hash(password, 12);

        const newUser = new AuthModel({ username, email, password: hashedPassword });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AuthModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}import AuthModel from '../models/AuthModel.js';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcryptjs';

export const register = async (req, res) => {
    const { username , email, password } = req.body;
    try {
        const user = await AuthModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bycrypt.hash(password, 12);

        const newUser = new AuthModel({ username, email, password: hashedPassword });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AuthModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}