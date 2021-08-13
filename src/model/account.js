const GetPerLanguage = require("../githubAPI/all-language-stat");
const { GetCurrentTime } = require("../utils/time");


class Account{
    constructor(name){
        this.username = name;
        this.Theme = 0;
    };
    SetTheme = (index) => {
        this.Theme = index;
    };
    GetTheme = () => {
        return this.Theme;
    };
    GetContent(){
        return this.perLanguage;
    };
    async GenerateCard(){
        this.perLanguage = await GetPerLanguage(this.username);
        console.log("GenerateCard done");
    };
}

module.exports = Account;