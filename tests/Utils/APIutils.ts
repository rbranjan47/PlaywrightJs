class APIutils{
    let logic_token : any;
    constructor(apiContext){

    }

    async getToken(){
         const apiContext = await request.newContext();
            const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
                {
                    data: payLoadBody_Login
                }
            )
            expect(loginResponse.ok()).toBeTruthy();
            expect(loginResponse.status()).toBe(200);
        
            const loginResponseJson = await loginResponse.json();
            console.log(loginResponseJson);
        
            login_token = loginResponseJson.token;
            console.log(login_token);
    }
}