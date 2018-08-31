module.exports.populateMatrix = populateMatrix;
module.exports.subSum = subSum;
module.exports.getMaxSum = getMaxSum;
module.exports.getMissingBanknotes = getMissingBanknotes;

function populateMatrix(values, sum){
    let M = matrixArray(values.length + 1, sum + 1);

    for (let i = 0; i < values.length; i++)
        M[i][0] = true;

    for (let i = 1; i < sum; i++)
        M[0][i] = false;

    for (let i = 1; i <= values.length; i++)
        for (let j = 0; j <= sum; j++)
            if(j - values[i-1] >= 0)
                M[i][j] = (M[i-1][j] || values[i-1] === j || M[i-1][j - values[i-1]]);
            else
                M[i][j] = (M[i-1][j] || values[i-1] === j);

    return M;
}

function subSum(values, sum, matrix){
    let res = [];
    let M = matrix;
    let sumLeft = sum;
    let currI = values.length, currJ = sumLeft;

    while (currJ > 0) {
        if (M[currI-1][currJ] === false){
            res.push(values[currI-1]);
            sumLeft -= values[currI-1];
            currJ = sumLeft;
        }
        else
            currI--;

    }

    return res;

}

function matrixArray(rows,columns){
    var arr = new Array();
    for(var i=0; i<rows; i++){
        arr[i] = new Array();
        for(var j=0; j<columns; j++){
            arr[i][j] = false;
        }
    }
    return arr;
}

function getMaxSum(values, sum, matrix){
    let i = sum;
    while (!matrix[values.length][i]){
        i--;
    }
    return i * 10;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getMissingBanknotes(values, sum, matrix){
    let nominals = [500, 200, 100, 50, 20, 10];
    let fullX = [];
    for (let i = 0; i < 6; i++)
        for (let j = 0; j < 5; j++)
            fullX.push(nominals[i] / 10);

    let newSum = sum - getMaxSum(values, sum, matrix) / 10;
    let newM = populateMatrix(fullX, newSum);

    return subSum(fullX, newSum, newM).filter(onlyUnique);

}

