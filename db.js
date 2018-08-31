const MongoClient = require("mongodb").MongoClient;
const url = 'mongodb://localhost:27017/banknotesDB';

let initBanknotes = {
    500 : 5,
    200 : 5,
    100 : 5,
    50 : 5,
    20 : 5,
    10 : 5
};

module.exports.init = dbInit;
module.exports.update = dbUpdate;
module.exports.reset = resetBanknotes;
module.exports.getBanknotes = dbGetBanknotes;
module.exports.setBanknotes = dbSetBanknotes;

function dbSetBanknotes(banknotes){
    let dbo;
    let currDB;

    return MongoClient.connect(url, { useNewUrlParser: true })
        .then((db) => {
            currDB = db;
            dbo = db.db("banknotesDB");
            return dbo.collection("banknotes").deleteMany({});
        })
        .then(() => {
            let banknotesArray = [];
            for (let banknote in banknotes)
                banknotesArray.push({"Size" : banknote, "Count" : banknotes[banknote]});

            return dbo.collection("banknotes").insertMany(banknotesArray);
        })
        .then(() => currDB.close());
}

function dbInit(){
    return dbSetBanknotes(initBanknotes);
}

function dbGetBanknotes(){
    let dbo;
    let currDB;
    let _banknotes;

    return MongoClient.connect(url, { useNewUrlParser: true })
        .then((db) => {
            currDB = db;
            dbo = db.db("banknotesDB");
            return dbo.collection("banknotes").find({}).toArray();
        })
        .then((banknotes) => {
            _banknotes = banknotes;
            return currDB.close();
        })
        .then(() => _banknotes);
}

function dbUpdate(banknotesUsed){
    dbGetBanknotes()
        .then((banknotes) => {

            let formattedBanknotesObj = {};

            for (let i = 0; i < banknotes.length; i++) {
                formattedBanknotesObj[banknotes[i].Size] = banknotes[i].Count;
            }

            let updatedBanknotes = {};
            let banknotesUsedObj = arrayToObj(banknotesUsed);

            for (let banknote in formattedBanknotesObj)
                updatedBanknotes[banknote] = formattedBanknotesObj[banknote] - banknotesUsedObj[banknote];

            return dbSetBanknotes(updatedBanknotes);
        });
}

function resetBanknotes(){
    return dbInit();
}

function arrayToObj(banknotesArray) {
    let sizes = [500, 200, 100, 50, 20, 10];
    let counts = [0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 6; i++)
        for (let j = 0; j < banknotesArray.length; j++){
            if (sizes[i] === banknotesArray[j])
                counts[i]++;
        }

    let banknotesObj = {};
    sizes.forEach((item, index) => {
        banknotesObj[item] = counts[index];
    });

    return banknotesObj;
}

function objToArray(banknotesObj){
    let banknotesArr = [];

    for (let banknote in banknotesObj){
        for (let i = 0; i < banknotesObj[banknote]; i++){
            banknotesArr.push(+banknote);
        }
    }

    return banknotesArr;
}
//
// let testBanknotes = {
//     500 : 5,
//     200 : 4,
//     100 : 3,
//     50 : 2,
//     20 : 1,
//     10 : 0
// };

//dbUpdate(testBanknotes);
//dbInit();
//dbGetBanknotes().then((b) => console.log(b));