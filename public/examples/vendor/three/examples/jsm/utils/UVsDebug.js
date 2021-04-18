import {
	Vector2
} from '../../../build/three.module.js';

/**
 * tool for "unwrapping" and debugging three.js geometries UV mapping
 *
 * Sample usage:
 *	document.body.appendChild( UVsDebug( new THREE.SphereGeometry( 10, 10, 10, 10 ) );
 *
 */

var UVsDebug = function ( geometry, size ) {

	// handles wrapping of uv.x > 1 only

	var abc = 'abc';
	var a = new Vector2();
	var b = new Vector2();

	var uvs = [
		new Vector2(),
		new Vector2(),
		new Vector2()
	];

	var face = [];

	var canvas = document.createElement( 'canvas' );
	var width = size || 1024; // power of 2 required for wrapping
	var height = size || 1024;
	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext( '2d' );
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb( 63, 63, 63 )';
	ctx.textAlign = 'center';

	// paint background white

	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );

	if ( geometry.isGeometry ) {

		console.error( 'THREE.UVsDebug no longer supports Geometry. Use THREE.BufferGeometry instead.' );
		return;

	} else {

		var index = geometry.index;
		var uvAttribute = geometry.attributes.uv;

		if ( index ) {

			// indexed geometry

			for ( var i = 0, il = index.count; i < il; i += 3 ) {

				face[ 0 ] = index.getX( i );
				face[ 1 ] = index.getX( i + 1 );
				face[ 2 ] = index.getX( i + 2 );

				uvs[ 0 ].fromBufferAttribute( uvAttribute, face[ 0 ] );
				uvs[ 1 ].fromBufferAttribute( uvAttribute, face[ 1 ] );
				uvs[ 2 ].fromBufferAttribute( uvAttribute, face[ 2 ] );

				processFace( face, uvs, i / 3 );

			}

		} else {

			// non-indexed geometry

			for ( var i = 0, il = uvAttribute.count; i < il; i += 3 ) {

				face[ 0 ] = i;
				face[ 1 ] = i + 1;
				face[ 2 ] = i + 2;

				uvs[ 0 ].fromBufferAttribute( uvAttribute, face[ 0 ] );
				uvs[ 1 ].fromBufferAttribute( uvAttribute, face[ 1 ] );
				uvs[ 2 ].fromBufferAttribute( uvAttribute, face[ 2 ] );

				processFace( face, uvs, i / 3 );

			}

		}

	}

	return canvas;

	function processFace( face, uvs, index ) {

		// draw contour of face

		ctx.beginPath();

		a.set( 0, 0 );

		for ( var j = 0, jl = uvs.length; j < jl; j ++ ) {

			var uv = uvs[ j ];

			a.x += uv.x;
			a.y += uv.y;

			if ( j === 0 ) {

				ctx.moveTo( uv.x * ( width - 2 ) + 0.5, ( 1 - uv.y ) * ( height - 2 ) + 0.5 );

			} else {

				ctx.lineTo( uv.x * ( width - 2 ) + 0.5, ( 1 - uv.y ) * ( height - 2 ) + 0.5 );

			}

		}

		ctx.closePath();
		ctx.stroke();

		// calculate center of face

		a.divideScalar( uvs.length );

		// label the face number

		ctx.font = '18px Arial';
		ctx.fillStyle = 'rgb( 63, 63, 63 )';
		ctx.fillText( index, a.x * width, ( 1 - a.y ) * height );

		if ( a.x > 0.95 ) {

			// wrap x // 0.95 is arbitrary

			ctx.fillText( index, ( a.x % 1 ) * width, ( 1 - a.y ) * height );

		}

		//

		ctx.font = '12px Arial';
		ctx.fillStyle = 'rgb( 191, 191, 191 )';

		// label uv edge orders

		for ( j = 0, jl = uvs.length; j < jl; j ++ ) {

			var uv = uvs[ j ];
			b.addVectors( a, uv ).divideScalar( 2 );

			var vnum = face[ j ];
			ctx.fillText( abc[ j ] + vnum, b.x * width, ( 1 - b.y ) * height );

			if ( b.x > 0.95 ) {

				// wrap x

				ctx.fillText( abc[ j ] + vnum, ( b.x % 1 ) * width, ( 1 - b.y ) * height );

			}

		}

	}

};

export { UVsDebug };
