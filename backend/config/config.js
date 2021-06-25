module.exports = {

    mongoConnectionString : process.env.MONGO ,
    webPort : process.env.PORT || 3000,
    session_secret : process.env.SESSION_SECRET || 'ayyagari'
}