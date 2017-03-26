'use strict';
const app = angular.module('notificationApp', ['ngMaterial','ui.router', 'ngMessages']);

app.factory('socket', () => {
	const socket = io.connect('http://localhost:3000');
	return socket;
});

app.config( function($stateProvider){	

	$stateProvider
		.state('home',{
			url: '/home',
			templateUrl: 'home.html',

		})
		.state('create', {
			url: '/create',
			templateUrl: 'create.html'
		})
		.state('view', {
			url: '/view',
			templateUrl: 'view.html'
		});

});
app.controller('pollingController', ($scope, $http, socket) => {

	$scope.pollData = [];
	$scope.formData = {};
	$scope.voteData = {};
	$scope.hiddenrows = [];

	getPollData();
	

	function getPollData()
	{
		$http.get("polls").success( function(response){
			$scope.pollData = response.data;
		});
	}

	$scope.updateVote = function(index) {
		let data = {
			'id': $scope.pollData[index].id,
			'option': $scope.pollData[index].option
		};

		$http.put("/polls", data).success((response) => {
			if(response.responseCode === 0){
				$scope.hiddenrows.push(index);				
			}
			else
			{
				console.log("error");
			}
		});
	}

	$scope.submitPoll = function(ev){
		let data = {
			"question": $scope.formData.pollQuestion,
			"polls": [
				{"option": $scope.formData.pollOption1, "vote": 0},
				{"option": $scope.formData.pollOption2, "vote": 0},
				{"option": $scope.formData.pollOption3, "vote": 0}]
		};

		let message = {"title": "", "message": ""};

		$http.post('/poll', data).success((response) =>{
			if(response.responseCode === 0)
			{
				message.title = "Success!";
				message.message = "Poll is successfully created";

				data[0] = response.data.generated_keys[0];
				$scope.pollData.push(data);				
			}
			else
			{
				message.title = "Error";
				message.message = "There is some error happened creating poll";
			}
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.querySelector("#popupContainer")))
				.clickOutsideToClose(false)
				.title(message.title)
				.textContent(message.message)
				.ok("Got it")
				.targetEvent(ev));
		});
	}

	socket.on('changeFeed' ,(data) => {
		for(let pollCounter = 0; pollCounter < $scope.pollData.length; pollCounter++ )
		{
			if($scope.pollData[pollCounter].id == data.id)
			{
				$scope.pollData[pollCounter].polls = data.polls;
				$scope.$apply();
			}
		}
	});

})
