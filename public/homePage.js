"use strict";

// Выход из личного кабинета

const logoutButton = new LogoutButton();

logoutButton.action = () => {
	ApiConnector.logout((response) => {
		if (response) {
			location.reload();
		}
	});
}

// Получение информации о пользователе

ApiConnector.current((response) => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

// Обновление курса валют

const ratesBoard = new RatesBoard();

function exchangeRateUpdate(response) {
	if (response.success) {
		ratesBoard.clearTable();
		ratesBoard.fillTable(response.data);
	}
};

function debounceDecoratorNew(func, delay) {
	let timeoutId = null;
	let isThrottled = false;
	return function(...args) {
		if (!isThrottled) {
			isThrottled = true;
			func(...args);
		}
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			timeoutId = null;
			func(...args);
		}, delay);
	}
}

const debouncedExchangeRateUpdate = debounceDecoratorNew(exchangeRateUpdate, 60000);

ApiConnector.getStocks((response) => {
	debouncedExchangeRateUpdate(response);
});

// Операции с деньгами
// Пополнение
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};

// Конвертация валюты

moneyManager.conversionMoneyCallback = (data) => {

	ApiConnector.convertMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};

// Перевод валюты

moneyManager.sendMoneyCallback = (data) => {

	ApiConnector.transferMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};

// Работа с избранными

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});

favoritesWidget.addUserCallback = (data) => {

	ApiConnector.addUserToFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};

favoritesWidget.removeUserCallback = (data) => {

	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
};