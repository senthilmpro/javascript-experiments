class AuthManager {
    constructor(accessToken){
        this.accessToken = accessToken;
    }

    get getAccessHeader() {
        if(this.accessToken){
            return "Bearer "+ this.accessToken;
        }
        
    }

    getAccessToken(){
        // do somelogic here
        return this.accessToken;
    }
}

const accessToken = "this-is-access-token";
const accessObject = new AuthManager(accessToken);


