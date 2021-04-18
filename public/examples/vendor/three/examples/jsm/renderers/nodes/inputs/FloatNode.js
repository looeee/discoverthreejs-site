import InputNode from '../core/InputNode.js';

class FloatNode extends InputNode {

	constructor( value = 0 ) {

		super( 'float' );

		this.value = value;

	}

}

FloatNode.prototype.isFloatNode = true;

export default FloatNode;
