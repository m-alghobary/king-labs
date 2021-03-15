import allModules from '../state/modules';
import store from '../state/store';

export default async function runActionInAllModules(actionName, { modules = allModules, modulePrefx = '', flags = {} } = {}) {
	for (const moduleName in modules) {
		const moduleDefinition = modules[moduleName];

		// if the action defined in the module
		if (moduleDefinition.actions && moduleDefinition.actions[actionName]) {
			if (moduleDefinition.namespaced) {
				await store.dispatch(`${modulePrefx}${moduleName}/${actionName}`);
			} else {
				flags.dispatchGlobal = true;
			}
		}

		// if there are nested sub-modules
		if (moduleDefinition.modules) {
			await runActionInAllModules(actionName, {
				modules: moduleDefinition.modules,
				modulePrefx: modulePrefx + moduleName + '/',
				flags,
			});
		}
	}

	// the root module
	if (!modulePrefx && flags.dispatchGlobal) {
		await store.dispatch(actionName);
	}
}
