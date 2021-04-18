import { WebGLLights } from './WebGLLights.js';

function WebGLRenderState( extensions, capabilities ) {

	const lights = new WebGLLights( extensions, capabilities );

	const lightsArray = [];
	const shadowsArray = [];

	function init() {

		lightsArray.length = 0;
		shadowsArray.length = 0;

	}

	function pushLight( light ) {

		lightsArray.push( light );

	}

	function pushShadow( shadowLight ) {

		shadowsArray.push( shadowLight );

	}

	function setupLights() {

		lights.setup( lightsArray );

	}

	function setupLightsView( camera ) {

		lights.setupView( lightsArray, camera );

	}

	const state = {
		lightsArray: lightsArray,
		shadowsArray: shadowsArray,

		lights: lights
	};

	return {
		init: init,
		state: state,
		setupLights: setupLights,
		setupLightsView: setupLightsView,

		pushLight: pushLight,
		pushShadow: pushShadow
	};

}

function WebGLRenderStates( extensions, capabilities ) {

	let renderStates = new WeakMap();

	function get( scene, renderCallDepth = 0 ) {

		let renderState;

		if ( renderStates.has( scene ) === false ) {

			renderState = new WebGLRenderState( extensions, capabilities );
			renderStates.set( scene, [ renderState ] );

		} else {

			if ( renderCallDepth >= renderStates.get( scene ).length ) {

				renderState = new WebGLRenderState( extensions, capabilities );
				renderStates.get( scene ).push( renderState );

			} else {

				renderState = renderStates.get( scene )[ renderCallDepth ];

			}

		}

		return renderState;

	}

	function dispose() {

		renderStates = new WeakMap();

	}

	return {
		get: get,
		dispose: dispose
	};

}


export { WebGLRenderStates };
