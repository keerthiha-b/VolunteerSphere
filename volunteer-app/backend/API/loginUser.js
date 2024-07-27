const bcrypt = require('bcryptjs');
const User = require("../Schema/User");
const Organization = require('../Schema/Organization');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Attempt to find a user or organization by the username
        const user_account = await User.findOne({ username });
        const org_account = await Organization.findOne({ username });
        const account = user_account || org_account;

        if (!account) {
            return res.status(401).json({ errorMsg: "Account not found or not verified" });
        }

        // Asynchronously compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ errorMsg: "Password is incorrect" });
        }

        // Determine user type
        const userType = user_account ? 'user' : 'org';
        const name = userType === 'user' ? `${account.first_name} ${account.last_name}` : account.organization_name;
        const email = account.email;

        // Log the response for debugging
        console.log('Response:', { message: 'Logged in successfully', userType, name, email });

        // Login successful, return a success message along with userType, name, and email
        res.status(200).json({ 
            message: 'Logged in successfully', 
            userType, 
            name, 
            email 
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ errorMsg: 'Error logging in user', details: error.message });
    }
};

module.exports = loginUser;
