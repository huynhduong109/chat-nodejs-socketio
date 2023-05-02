const moment = require('moment-timezone');

function formatMessage(user, msgContent) {
    const now = moment().tz('Asia/Ho_Chi_Minh');
    return {
        user,
        msgContent,
        time: now.format('h:mm a')
    }
}

module.exports = formatMessage;