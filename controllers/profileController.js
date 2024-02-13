const _ = require('lodash');
const { Profile } = require('../models/profile')

module.exports.getProfile = async (req, res) => {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId })
    return res.status(200).send(profile);
}

module.exports.setProfile = async (req, res) => {
    console.log('set profile');
    const userId = req.user._id;
    const userProfile = _.pick(req.body, ["user","phone", "address1", "address2", "city", "state", "postcode", "country"]);
    console.log("Profile",userProfile);
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
        await Profile.updateOne({ user: userId }, userProfile);
        console.log('updt profile');
    }
    else {
        profile = new Profile(userProfile);
        await profile.save();
        console.log('set new profile');
    }
    return res.status(200).send("Update Successfully")
}