"use strict";

const userForm = new UserForm();

userForm.loginFormCallback = (data) => {

	ApiConnector.login(data, (response) => {
		if (response.success) {
			location.reload();
		} else {
			userForm.setLoginErrorMessage(response.error);
		}
	});
};

userForm.registerFormCallback = (data) => {
	console.log('data', data);

	ApiConnector.register(data, (response) => {
		console.log(response);
		if (response.success) {
			location.reload();
		} else {
			userForm.setRegisterErrorMessage(response.error);
		}
	});
};