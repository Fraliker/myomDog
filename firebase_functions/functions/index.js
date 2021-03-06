let functions = require('firebase-functions');
let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.reactToInvite = functions.database.ref('/userData/{user_id}/invitation/{identify}').onWrite(event => {
    let eventData = event.data.val();
    let dog_id = eventData.dog_id;
    let receiver = event.params.user_id;
    let sender = eventData.sender;
    console.log('dog_id: '+dog_id+' receiver: '+receiver+' sender: '+sender);
    getToken(receiver).then((token) => {
        getUsername(sender).then((username)=>{
            let sendername = username;
            getDogname(dog_id).then((dog)=>{
                let dogname = dog;
                let message = sendername+' and '+dogname+' invited you';
                console.log(message);
                if(token!==null) console.log(token);
                let payload = {
                    notification: {
                        title: 'invite push notification',
                        body: message,
                        sound: 'default',
                        badge: '1'
                    },
                    data: {
                        sender: sender,
                        message: dog_id
                    }
                };
                return admin.messaging().sendToDevice(token, payload).then((response) =>{
                    console.log("pushed notification");
        }).catch((err)=> {
            console.log(err);
        })
            });
        });
        
    });
/*
    getToken(receiver).then((token) => {
        console.log(sendername, dogname);
        let message = ' invited you';
        if(token!==null) console.log(token);
        let payload = {
            notification: {
                title: 'invite push notification',
                body: message,
                sound: 'default',
                badge: '1'
            },
            data: {
                sender: sender,
                message: dog_id
            }
        };

        return admin.messaging().sendToDevice(token, payload).then((response) =>{
            console.log("pushed notification");
        }).catch((err)=> {
            console.log(err);
        })
    });
*/
});

function getToken(user){
    let dbRef = admin.database().ref('userData/'+user);
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            resolve(data.pushToken);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}

function getUsername(user){
    let dbRef = admin.database().ref('userData/'+user);
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            resolve(data.name);
        }, (err) => {
            reject(err);
        });
    });
    return defer; 
}

function getDogname(dog){
    let dbRef = admin.database().ref('dogData/'+dog);
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            resolve(data.name);
        }, (err) => {
            reject(err);
        });
    });
    return defer; 
}

exports.notifyFoodTime = functions.database.ref('dogData').onWrite(event =>{
    console.log("dogData event Invoked");
});