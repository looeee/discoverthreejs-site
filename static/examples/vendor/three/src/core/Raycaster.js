import { Ray } from '../math/Ray.js';
import { Layers } from './Layers.js';

function Raycaster( origin, direction, near = 0, far = Infinity ) {

	this.ray = new Ray( origin, direction );
	// direction is assumed to be normalized (for accurate distance calculations)

	this.near = near;
	this.far = far;
	this.camera = null;
	this.layers = new Layers();

	this.params = {
		Mesh: {},
		Line: { threshold: 1 },
		LOD: {},
		Points: { threshold: 1 },
		Sprite: {}
	};

	Object.defineProperties( this.params, {
		PointCloud: {
			get: function () {

				console.warn( 'THREE.Raycaster: params.PointCloud has been renamed to params.Points.' );
				return this.Points;

			}
		}
	} );

}

function ascSort( a, b ) {

	return a.distance - b.distance;

}

function intersectObject( object, raycaster, intersects, recursive ) {

	if ( object.layers.test( raycaster.layers ) ) {

		object.raycast( raycaster, intersects );

	}

	if ( recursive === true ) {

		const children = object.children;

		for ( let i = 0, l = children.length; i < l; i ++ ) {

			intersectObject( children[ i ], raycaster, intersects, true );

		}

	}

}

Object.assign( Raycaster.prototype, {

	set: function ( origin, direction ) {

		// direction is assumed to be normalized (for accurate distance calculations)

		this.ray.set( origin, direction );

	},

	setFromCamera: function ( coords, camera ) {

		if ( camera && camera.isPerspectiveCamera ) {

			this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
			this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();
			this.camera = camera;

		} else if ( camera && camera.isOrthographicCamera ) {

			this.ray.origin.set( coords.x, coords.y, ( camera.near + camera.far ) / ( camera.near - camera.far ) ).unproject( camera ); // set origin in plane of camera
			this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );
			this.camera = camera;

		} else {

			console.error( 'THREE.Raycaster: Unsupported camera type: ' + camera.type );

		}

	},

	intersectObject: function ( object, recursive = false, intersects = [] ) {

		intersectObject( object, this, intersects, recursive );

		intersects.sort( ascSort );

		return intersects;

	},

	intersectObjects: function ( objects, recursive = false, intersects = [] ) {

		for ( let i = 0, l = objects.length; i < l; i ++ ) {

			intersectObject( objects[ i ], this, intersects, recursive );

		}

		intersects.sort( ascSort );

		return intersects;

	}

} );


export { Raycaster };
