const bcrypt = require('bcryptjs');
const User = require("../Schema/User");
const Organization = require('../Schema/Organization');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Attempt to find a user or organization by the username
        const account = await User.findOne({ username }) || await Organization.findOne({ username });

        if (!account) {
            return res.status(401).json({ errorMsg: "Account not found or not verified" });
        }

        // Asynchronously compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ errorMsg: "Password is incorrect" });
        }

        // Login successful, return a success message
        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ errorMsg: 'Error logging in user', details: error.message });
    }
};

module.exports = loginUser;
