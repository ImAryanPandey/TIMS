import User from '../models/User.js';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (user.password === password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerMechanic = async (req, res) => {
    try {
        const { name, email, mobile, password, level, picture } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this Email or Mobile already exists' });
        }

        const user = await User.create({
            name,
            email,
            mobile,
            password, 
            role: 'Mechanic', 
            level,
            picture
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};