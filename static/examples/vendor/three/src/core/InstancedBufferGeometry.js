import { BufferGeometry } from './BufferGeometry.js';

function InstancedBufferGeometry() {

	BufferGeometry.call( this );

	this.type = 'InstancedBufferGeometry';
	this.instanceCount = Infinity;

}

InstancedBufferGeometry.prototype = Object.assign( Object.create( BufferGeometry.prototype ), {

	constructor: InstancedBufferGeometry,

	isInstancedBufferGeometry: true,

	copy: function ( source ) {

		BufferGeometry.prototype.copy.call( this, source );

		this.instanceCount = source.instanceCount;

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	toJSON: function () {

		const data = BufferGeometry.prototype.toJSON.call( this );

		data.instanceCount = this.instanceCount;

		data.isInstancedBufferGeometry = true;

		return data;

	}

} );

export { InstancedBufferGeometry };
