const User = require('../models/User');

const searchUsersByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const users = await User.find({ email: { $regex: email, $options: 'i' } }); 
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found with this email' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { searchUsersByEmail };
