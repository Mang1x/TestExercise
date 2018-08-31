angular.module("cashMachineSimulator", []).controller("btnCtrl", ($scope, $http) => {

    $scope.reset = function(){
        blockBtns($scope);

        $http.get(`/reset`)
            .then(() => {
                unblockBtns($scope);
            }, () => {
                unblockBtns($scope);
                console.log('reset error');
            });
    };

    $scope.withdraw = function(){
        if (isNaN($scope.withdrawSum)){
            $scope.result = "Некоректний ввід.";
            return;
        }

        if ($scope.withdrawSum % 10 != 0){
            $scope.result = "Сума повинна бути кратна 10.";
            return;
        }

        if ($scope.withdrawSum <= 0){
            $scope.result = "Сума повинна бути > 0.";
            return;
        }


        blockBtns($scope);

        $http.get(`/withdraw/${$scope.withdrawSum}`)
            .then(res => {
                switch (res.status){
                    case 200: {
                        $scope.result = formatOutputOk(res.data);
                        unblockBtns($scope);
                        break;
                    }
                    case 201: {
                        $scope.result = 'Недостатньо банкнот номіналом ' + res.data.join(", ") + ".";
                        unblockBtns($scope);
                        break;
                    }
                    case 202: {
                        $scope.result = 'Недостатньо грошей для видачі.';
                        unblockBtns($scope);
                        break;
                    }
                }
            }, () => {
                unblockBtns($scope);
                console.log('withdraw error');
            });
    };
});

function blockBtns($scope){
    $scope.withdrawDisabled = true;
    $scope.resetDisabled = true;
}

function unblockBtns($scope){
    $scope.withdrawDisabled = false;
    $scope.resetDisabled = false;
}


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function formatOutputOk(banknotesArray){
    let result = "Видано ";
    let words = [];
    let banknotesUnique = banknotesArray.filter(onlyUnique);
    banknotesUnique.forEach((buItem) => {
        let itemCount = 0;
        banknotesArray.forEach((baItem) => {
            if (buItem === baItem)
                itemCount++;
        });

        words.push(buItem + " x " + itemCount);
    });

    return result + words.reverse().join(", ") + ".";
}
