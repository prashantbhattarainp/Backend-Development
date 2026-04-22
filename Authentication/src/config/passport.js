const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {
                        const email = profile.emails?.[0]?.value;
                        user = await User.findOne({ email });

                        if (user) {
                            user.googleId = profile.id;
                            user.isVerified = true;
                            await user.save();
                        } else {
                            user = await User.create({
                                name: profile.displayName || 'Google User',
                                email,
                                googleId: profile.id,
                                isVerified: true,
                            });
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.log("Google Auth Disable")
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;