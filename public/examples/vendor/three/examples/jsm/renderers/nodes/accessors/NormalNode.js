import Node from '../core/Node.js';
import AttributeNode from '../core/AttributeNode.js';
import VaryNode from '../core/VaryNode.js';
import ModelNode from '../accessors/ModelNode.js';
import CameraNode from '../accessors/CameraNode.js';
import OperatorNode from '../math/OperatorNode.js';
import MathNode from '../math/MathNode.js';

class NormalNode extends Node {

	static LOCAL = 'local';
	static WORLD = 'world';
	static VIEW = 'view';

	constructor( scope = NormalNode.LOCAL ) {

		super( 'vec3' );

		this.scope = scope;

	}

	generate( builder, output ) {

		const type = this.getType( builder );
		const nodeData = builder.getDataFromNode( this, builder.shaderStage );
		const scope = this.scope;

		let localNormalNode = nodeData.localNormalNode;

		if ( localNormalNode === undefined ) {

			localNormalNode = new AttributeNode( 'normal', 'vec3' );

			nodeData.localNormalNode = localNormalNode;

		}

		let outputNode = localNormalNode;

		if ( scope === NormalNode.VIEW ) {

			let viewNormalNode = nodeData.viewNormalNode;

			if ( viewNormalNode === undefined ) {

				const unnormalizedWNNode = new OperatorNode( '*', new ModelNode( ModelNode.NORMAL ), localNormalNode );
				const vertexNormalNode = new MathNode( MathNode.NORMALIZE, unnormalizedWNNode );

				viewNormalNode = new MathNode( MathNode.NORMALIZE, new VaryNode( vertexNormalNode ) );

				nodeData.viewNormalNode = viewNormalNode;

			}

			outputNode = viewNormalNode;

		} else if ( scope === NormalNode.WORLD ) {

			let worldNormalNode = nodeData.worldNormalNode;

			if ( worldNormalNode === undefined ) {

				const vertexNormalNode = new MathNode( MathNode.INVERSE_TRANSFORM_DIRETION, new NormalNode( NormalNode.VIEW ), new CameraNode( CameraNode.VIEW ) );

				worldNormalNode = new VaryNode( vertexNormalNode );

				nodeData.worldNormalNode = worldNormalNode;

			}

			outputNode = worldNormalNode;

		}

		const normalSnipped = outputNode.build( builder, type );

		return builder.format( normalSnipped, type, output );

	}

}

export default NormalNode;
