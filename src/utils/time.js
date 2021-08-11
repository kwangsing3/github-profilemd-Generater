
function GetCurrentTime() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getUTCDate();
    let month = date_ob.getUTCMonth() + 1;
    let year = date_ob.getUTCFullYear();
    let hour = date_ob.getUTCHours();
    let minu = date_ob.getUTCMinutes();
    let sec = date_ob.getUTCSeconds();
    return "UTF- "+ year + "-" + month + "-" + date + " " + hour +":" + minu +":" + sec;
}

module.exports.GetCurrentTime = GetCurrentTime;