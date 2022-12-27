const http = require("http");
const path = require("path");
const fs = require("fs");
const usager = require("./liste_usagers");
const Port = process.env.Port || 8000;
const SUCCES = 200;
const ERR_FICHIER_INEXISTANT = 401;
const ERR_SERVEUR = 500;
let nomUsers="";
let loginUsers="";

//Fonction pour lire la page web selectionné
function LirePageWeb(nomFichier, reponse) {
    let pageWeb = path.join(__dirname, "pagesWeb", nomFichier);
    fs.readFile(pageWeb,
        (err, contenu) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    reponse.writeHead(ERR_FICHIER_INEXISTANT, {'Content-Type': 'text/html'});
                    reponse.write('<h1>Page non autorise</h1>');
                    reponse.end();
                } else {
                    reponse.writeHead(ERR_SERVEUR, {'Content-Type': 'text/html'});
                    reponse.write(`<h1>Une erreur du serveur s'est produite</h1>`);
                    reponse.end();
                }
            } else {
                reponse.writeHead(SUCCES, {'Content-Type': 'text/html'});
                contenu = contenu.toString().replace(/_nom_nom/g,nomUsers);
                contenu = contenu.toString().replace(/_login_login/g,loginUsers);
                reponse.write(contenu);               
                reponse.end();
            }
        });
}

function traiterRequete(requete, reponse, parametres) {
    const nom = parametres.get('login');
    const password = parametres.get('pwd');
    let nomLogin = nom;  
    let pswd = password;
    let loginTrouvee = usager.find((use) => use.login === nomLogin);
    let restrictionNormal = "normal";
    let restrictionAdmin = "admin";
    let restrictionRestrint = "restreint";
    if (loginTrouvee) {
        console.log("login = " , nomLogin);
        if (loginTrouvee.pwd === pswd) {
            console.log("password = " , pswd);
            if (loginTrouvee.acces === restrictionNormal) {
                nomUsers = loginTrouvee.nom;
                loginUsers = nom;
                LirePageWeb("pageUsager.html",reponse);
            }else if(loginTrouvee.acces === restrictionAdmin) {
                nomUsers = loginTrouvee.nom;
                loginUsers = nom;
                LirePageWeb("pageAdmin.html",reponse);
            }
            else if(loginTrouvee.acces === restrictionRestrint) {
                nomUsers = loginTrouvee.nom;
                loginUsers = nom;
                LirePageWeb("pageRestreinte.html",reponse);
            }
        }else {
            reponse.writeHead(ERR_SERVEUR, {'Content-Type': 'text/html'});
            reponse.write(`<h1>Mot de passe invalide</h1>`);
            reponse.end();
        }      
    }else{
        reponse.writeHead(ERR_SERVEUR, {'Content-Type': 'text/html'});
        reponse.write(`<h1>Login invalide</h1>`);
        reponse.end();
    }
      
}

//fonction pour lire les donnés du post
function traiterPost(requete,reponse) {
    let postData = "";
    requete.on("data", (donnees)=> {
        postData = postData + donnees;
    });
    requete.on('end', ()=> {
        if (postData === "") {
            console.log('aucun data du formulaire en POST');
        } else {
            const parametres = new URLSearchParams(postData);
            traiterRequete(requete, reponse, parametres);
        }
    });
}

//fonction pour lire les donnees du get
function traiterGet(requete,reponse) {
    const parametres = new URLSearchParams(requete.url.substring(12));
    traiterRequete(requete,reponse,parametres);
}

//fonction vérifiant si ma methode est un post ou get
function traiterPostback(requete, reponse) {
    if (requete.method === 'POST') {
        traiterPost(requete, reponse);
    } else {
        traiterGet(requete, reponse);
    }
}

//Création serveur web
http.createServer( (requete, reponse) => {
    if (requete.url.substring(0,11) === "/acces.html") {
        traiterPostback(requete,reponse);
    }
    else if (requete.url === '/') {
        LirePageWeb("login.html", reponse);

    } else {
        LirePageWeb(requete.url, reponse)
    }
}).listen(Port, ()=>{ console.log(`Service démarré sur ${Port}`)});
