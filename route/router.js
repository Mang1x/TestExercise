const express = require('express');
const db = require('../db');
const solver = require('../subSumSolver');

const router = express.Router();

module.exports = router;

router.route('/').get((req, res) => {
    res.sendFile('index.html');
});

router.route('/withdraw/:sum').get((req, res) => {
    db.getBanknotes().then((banknotes) => {
        const sum = req.params.sum;
        let banknoteArray = [];

        for (let banknote in banknotes){
            for (let i = 0; i < banknotes[banknote].Count; i++){
                banknoteArray.push(banknotes[banknote].Size);
            }
        }

        let banknotesSum = banknoteArray.reduce((a, b) => +a + +b, 0);

        let banknoteArrayScaled = banknoteArray.map((item) => item / 10).reverse();
        let sumScaled = sum / 10;

        let subSumPossibilityMatrix = solver.populateMatrix(banknoteArrayScaled, sumScaled);

        if (banknotesSum < sum){
            return res.status(202).json();
        }
        else {
            if (subSumPossibilityMatrix[banknoteArrayScaled.length][sumScaled]){
                let withdrawBanknotes = solver.subSum(banknoteArrayScaled, sumScaled, subSumPossibilityMatrix).map((item) => item * 10);
                db.update(withdrawBanknotes);
                return res.status(200).json(withdrawBanknotes);
            }
            else{
                return res.status(201).json(solver.getMissingBanknotes(banknoteArrayScaled, sumScaled, subSumPossibilityMatrix).map((item) => item * 10));
            }
        }
    }, (err) => {
        res.status(403).json(err);
    });
});

router.route('/reset').get((req, res) => {
    db.reset()
        .then(() => {
            res.status(200).send();
        }, (err) => {
            res.status(403).json(err);
        });
});