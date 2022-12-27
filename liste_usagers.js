module.exports = [
    {nom: 'Bob Larue', login: 'larueb', pwd: 'bobo1234', acces: 'normal'},
    {nom: 'Paul Larue', login: 'laruep', pwd: 'paul9911', acces: 'admin'},
    {nom: 'Lucie Labelle', login: 'labellel', pwd: 'lucie.911', acces: 'restreint'},
    {nom: 'Luc Morin', login: 'morinl', pwd: 'mallo1234', acces: 'normal'},
    {nom: 'Fred Pellerin', login: 'pellef', pwd: 'pell9911', acces: 'admin'},
    {nom: 'Sophie Levesque', login: 'levesqs', pwd: 'sophie.911', acces: 'restreint'}
];

function LireUsagerNormal(reponse) {
    let pageWeb = path.join(__dirname, "pagesWeb", "pageUsager");
    let login = "larueb";
    let login2 =  "morinl";
    let pass = "bobo1234";
    let pass2 = "mallo1234";
    let accountLogin = usager.find((compte)=> compte.login === login);
    let accountLogin2 = usager.find((compte)=> compte.login === login2);
    let accountPwd = usager.find((compte)=> compte.pwd === pass);
    let accountPwd2 = usager.find((compte)=> compte.pwd === pass2);
    if (accountLogin2.login === login2) {
        console.log(accountLogin);
        if (accountPwd.pwd === pass) {
            LirePageWeb(pageWeb,reponse);
        }else {
            reponse.writeHead(ERR_SERVEUR, {'Content-Type': 'text/html'});
            reponse.write(`<h1>Mot de passe invalide</h1>`);
            reponse.end();
        }
    }else {
        reponse.writeHead(ERR_SERVEUR, {'Content-Type': 'text/html'});
        reponse.write(`<h1>Login invalide</h1>`);
        reponse.end();
    }
    
}



