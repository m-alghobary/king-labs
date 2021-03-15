// retrieve state from localStorge
export function getState(key) {
	return JSON.parse(window.localStorage.getItem(key));
}

// store state in localStorge
export function saveState(key, state) {
	window.localStorage.setItem(key, JSON.stringify(state));
}
