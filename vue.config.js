module.exports = {
	transpileDependencies: ['vuetify'],
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				publish: [
					{
						provider: 'github',
						owner: 'm-alghobary',
					},
				],
			},
			preload: 'src/preload.js',
		},
	},
};
