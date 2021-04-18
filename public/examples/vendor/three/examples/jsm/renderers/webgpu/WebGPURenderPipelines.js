import { GPUPrimitiveTopology, GPUIndexFormat, GPUTextureFormat, GPUCompareFunction, GPUFrontFace, GPUCullMode, GPUVertexFormat, GPUBlendFactor, GPUBlendOperation, BlendColorFactor, OneMinusBlendColorFactor, GPUColorWriteFlags, GPUStencilOperation, GPUInputStepMode } from './constants.js';
import {
	FrontSide, BackSide, DoubleSide,
	NeverDepth, AlwaysDepth, LessDepth, LessEqualDepth, EqualDepth, GreaterEqualDepth, GreaterDepth, NotEqualDepth,
	NeverStencilFunc, AlwaysStencilFunc, LessStencilFunc, LessEqualStencilFunc, EqualStencilFunc, GreaterEqualStencilFunc, GreaterStencilFunc, NotEqualStencilFunc,
	KeepStencilOp, ZeroStencilOp, ReplaceStencilOp, InvertStencilOp, IncrementStencilOp, DecrementStencilOp, IncrementWrapStencilOp, DecrementWrapStencilOp,
	NoBlending, NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, CustomBlending,
	AddEquation, SubtractEquation, ReverseSubtractEquation, MinEquation, MaxEquation,
	ZeroFactor, OneFactor, SrcColorFactor, OneMinusSrcColorFactor, SrcAlphaFactor, OneMinusSrcAlphaFactor, DstAlphaFactor, OneMinusDstAlphaFactor, DstColorFactor, OneMinusDstColorFactor, SrcAlphaSaturateFactor
} from 'three';

class WebGPURenderPipelines {

	constructor( renderer, properties, device, glslang, sampleCount, nodes ) {

		this.renderer = renderer;
		this.properties = properties;
		this.device = device;
		this.glslang = glslang;
		this.sampleCount = sampleCount;
		this.nodes = nodes;

		this.pipelines = new WeakMap();
		this.shaderAttributes = new WeakMap();

		this.shaderModules = {
			vertex: new Map(),
			fragment: new Map()
		};

	}

	get( object ) {

		// @TODO: Avoid a 1:1 relationship between pipelines and objects. It's necessary
		// to check various conditions in order to request an appropriate pipeline.
		//
		// - material's version and node configuration
		// - environment map (material)
		// - fog and environment (scene)
		// - output encoding (renderer)
		// - light state
		// - clipping planes
		//
		// The renderer needs to manage multiple pipelines per object so
		// GPUDevice.createRenderPipeline() is only called when no pipeline exists for the
		// current configuration.

		let pipeline = this.pipelines.get( object );

		if ( pipeline === undefined ) {

			const device = this.device;
			const properties = this.properties;

			const material = object.material;

			// get shader

			const nodeBuilder = this.nodes.get( object );

			// shader modules

			const glslang = this.glslang;

			let moduleVertex = this.shaderModules.vertex.get( nodeBuilder.vertexShader );

			if ( moduleVertex === undefined ) {

				const byteCodeVertex = glslang.compileGLSL( nodeBuilder.vertexShader, 'vertex' );

				moduleVertex = {
					module: device.createShaderModule( { code: byteCodeVertex } ),
					entryPoint: 'main'
				};

				this.shaderModules.vertex.set( nodeBuilder.vertexShader, moduleVertex );

			}

			let moduleFragment = this.shaderModules.fragment.get( nodeBuilder.fragmentShader );

			if ( moduleFragment === undefined ) {

				const byteCodeFragment = glslang.compileGLSL( nodeBuilder.fragmentShader, 'fragment' );

				moduleFragment = {
					module: device.createShaderModule( { code: byteCodeFragment } ),
					entryPoint: 'main'
				};

				this.shaderModules.fragment.set( nodeBuilder.fragmentShader, moduleFragment );

			}

			// dispose material

			const materialProperties = properties.get( material );

			if ( materialProperties.disposeCallback === undefined ) {

				const disposeCallback = onMaterialDispose.bind( this );
				materialProperties.disposeCallback = disposeCallback;

				material.addEventListener( 'dispose', disposeCallback );

			}

			// determine shader attributes

			const shaderAttributes = this._parseShaderAttributes( nodeBuilder.vertexShader );

			// vertex buffers

			const vertexBuffers = [];
			const geometry = object.geometry;

			for ( const attribute of shaderAttributes ) {

				const name = attribute.name;
				const geometryAttribute = geometry.getAttribute( name );
				const stepMode = ( geometryAttribute !== undefined && geometryAttribute.isInstancedBufferAttribute ) ? GPUInputStepMode.Instance : GPUInputStepMode.Vertex;

				vertexBuffers.push( {
					arrayStride: attribute.arrayStride,
					attributes: [ { shaderLocation: attribute.slot, offset: 0, format: attribute.format } ],
					stepMode: stepMode
				} );

			}

			//

			let alphaBlend = {};
			let colorBlend = {};

			if ( material.transparent === true && material.blending !== NoBlending ) {

				alphaBlend = this._getAlphaBlend( material );
				colorBlend = this._getColorBlend( material );

			}

			//

			let stencilFront = {};

			if ( material.stencilWrite === true ) {

				stencilFront = {
					compare: this._getStencilCompare( material ),
					failOp: this._getStencilOperation( material.stencilFail ),
					depthFailOp: this._getStencilOperation( material.stencilZFail ),
					passOp: this._getStencilOperation( material.stencilZPass )
				};

			}

			// pipeline

			const primitiveState = this._getPrimitiveState( object, material );
			const colorWriteMask = this._getColorWriteMask( material );
			const depthCompare = this._getDepthCompare( material );
			const colorFormat = this._getColorFormat( this.renderer );
			const depthStencilFormat = this._getDepthStencilFormat( this.renderer );

			pipeline = device.createRenderPipeline( {
				vertex: Object.assign( {}, moduleVertex, { buffers: vertexBuffers } ),
				fragment: Object.assign( {}, moduleFragment, { targets: [ {
					format: colorFormat,
					blend: {
						alpha: alphaBlend,
						color: colorBlend
					},
					writeMask: colorWriteMask
				} ] } ),
				primitive: primitiveState,
				depthStencil: {
					format: depthStencilFormat,
					depthWriteEnabled: material.depthWrite,
					depthCompare: depthCompare,
					stencilFront: stencilFront,
					stencilBack: {}, // three.js does not provide an API to configure the back function (gl.stencilFuncSeparate() was never used)
					stencilReadMask: material.stencilFuncMask,
					stencilWriteMask: material.stencilWriteMask
				},
				multisample: {
					count: this.sampleCount
				}
			} );

			this.pipelines.set( object, pipeline );
			this.shaderAttributes.set( pipeline, shaderAttributes );

		}

		return pipeline;

	}

	getShaderAttributes( pipeline ) {

		return this.shaderAttributes.get( pipeline );

	}

	dispose() {

		this.pipelines = new WeakMap();
		this.shaderAttributes = new WeakMap();
		this.shaderModules = {
			vertex: new Map(),
			fragment: new Map()
		};

	}

	_getArrayStride( type ) {

		// @TODO: This code is GLSL specific. We need to update when we switch to WGSL.

		if ( type === 'float' ) return 4;
		if ( type === 'vec2' ) return 8;
		if ( type === 'vec3' ) return 12;
		if ( type === 'vec4' ) return 16;

		if ( type === 'int' ) return 4;
		if ( type === 'ivec2' ) return 8;
		if ( type === 'ivec3' ) return 12;
		if ( type === 'ivec4' ) return 16;

		if ( type === 'uint' ) return 4;
		if ( type === 'uvec2' ) return 8;
		if ( type === 'uvec3' ) return 12;
		if ( type === 'uvec4' ) return 16;

		console.error( 'THREE.WebGPURenderer: Shader variable type not supported yet.', type );

	}

	_getAlphaBlend( material ) {

		const blending = material.blending;
		const premultipliedAlpha = material.premultipliedAlpha;

		let alphaBlend = undefined;

		switch ( blending ) {

			case NormalBlending:

				if ( premultipliedAlpha === false ) {

					alphaBlend = {
						srcFactor: GPUBlendFactor.One,
						dstFactor: GPUBlendFactor.OneMinusSrcAlpha,
						operation: GPUBlendOperation.Add
					};

				}

				break;

			case AdditiveBlending:
				// no alphaBlend settings
				break;

			case SubtractiveBlending:

				if ( premultipliedAlpha === true ) {

					alphaBlend = {
						srcFactor: GPUBlendFactor.OneMinusSrcColor,
						dstFactor: GPUBlendFactor.OneMinusSrcAlpha,
						operation: GPUBlendOperation.Add
					};

				}

				break;

			case MultiplyBlending:
				if ( premultipliedAlpha === true ) {

					alphaBlend = {
						srcFactor: GPUBlendFactor.Zero,
						dstFactor: GPUBlendFactor.SrcAlpha,
						operation: GPUBlendOperation.Add
					};

				}

				break;

			case CustomBlending:

				const blendSrcAlpha = material.blendSrcAlpha;
				const blendDstAlpha = material.blendDstAlpha;
				const blendEquationAlpha = material.blendEquationAlpha;

				if ( blendSrcAlpha !== null && blendDstAlpha !== null && blendEquationAlpha !== null ) {

					alphaBlend = {
						srcFactor: this._getBlendFactor( blendSrcAlpha ),
						dstFactor: this._getBlendFactor( blendDstAlpha ),
						operation: this._getBlendOperation( blendEquationAlpha )
					};

				}

				break;

			default:
				console.error( 'THREE.WebGPURenderer: Blending not supported.', blending );

		}

		return alphaBlend;

	}

	_getBlendFactor( blend ) {

		let blendFactor;

		switch ( blend ) {

			case ZeroFactor:
				blendFactor = GPUBlendFactor.Zero;
				break;

			case OneFactor:
				blendFactor = GPUBlendFactor.One;
				break;

			case SrcColorFactor:
				blendFactor = GPUBlendFactor.SrcColor;
				break;

			case OneMinusSrcColorFactor:
				blendFactor = GPUBlendFactor.OneMinusSrcColor;
				break;

			case SrcAlphaFactor:
				blendFactor = GPUBlendFactor.SrcAlpha;
				break;

			case OneMinusSrcAlphaFactor:
				blendFactor = GPUBlendFactor.OneMinusSrcAlpha;
				break;

			case DstColorFactor:
				blendFactor = GPUBlendFactor.DstColor;
				break;

			case OneMinusDstColorFactor:
				blendFactor = GPUBlendFactor.OneMinusDstColor;
				break;

			case DstAlphaFactor:
				blendFactor = GPUBlendFactor.DstAlpha;
				break;

			case OneMinusDstAlphaFactor:
				blendFactor = GPUBlendFactor.OneMinusDstAlpha;
				break;

			case SrcAlphaSaturateFactor:
				blendFactor = GPUBlendFactor.SrcAlphaSaturated;
				break;

			case BlendColorFactor:
				blendFactor = GPUBlendFactor.BlendColor;
				break;

			case OneMinusBlendColorFactor:
				blendFactor = GPUBlendFactor.OneMinusBlendColor;
				break;


			default:
				console.error( 'THREE.WebGPURenderer: Blend factor not supported.', blend );

		}

		return blendFactor;

	}

	_getBlendOperation( blendEquation ) {

		let blendOperation;

		switch ( blendEquation ) {

			case AddEquation:
				blendOperation = GPUBlendOperation.Add;
				break;

			case SubtractEquation:
				blendOperation = GPUBlendOperation.Subtract;
				break;

			case ReverseSubtractEquation:
				blendOperation = GPUBlendOperation.ReverseSubtract;
				break;

			case MinEquation:
				blendOperation = GPUBlendOperation.Min;
				break;

			case MaxEquation:
				blendOperation = GPUBlendOperation.Max;
				break;

			default:
				console.error( 'THREE.WebGPURenderer: Blend equation not supported.', blendEquation );

		}

		return blendOperation;

	}

	_getColorBlend( material ) {

		const blending = material.blending;
		const premultipliedAlpha = material.premultipliedAlpha;

		const colorBlend = {
			srcFactor: null,
			dstFactor: null,
			operation: null
		};

		switch ( blending ) {

			case NormalBlending:

				colorBlend.srcFactor = ( premultipliedAlpha === true ) ? GPUBlendFactor.One : GPUBlendFactor.SrcAlpha;
				colorBlend.dstFactor = GPUBlendFactor.OneMinusSrcAlpha;
				colorBlend.operation = GPUBlendOperation.Add;
				break;

			case AdditiveBlending:
				colorBlend.srcFactor = ( premultipliedAlpha === true ) ? GPUBlendFactor.One : GPUBlendFactor.SrcAlpha;
				colorBlend.operation = GPUBlendOperation.Add;
				break;

			case SubtractiveBlending:
				colorBlend.srcFactor = GPUBlendFactor.Zero;
				colorBlend.dstFactor = ( premultipliedAlpha === true ) ? GPUBlendFactor.Zero : GPUBlendFactor.OneMinusSrcColor;
				colorBlend.operation = GPUBlendOperation.Add;
				break;

			case MultiplyBlending:
				colorBlend.srcFactor = GPUBlendFactor.Zero;
				colorBlend.dstFactor = GPUBlendFactor.SrcColor;
				colorBlend.operation = GPUBlendOperation.Add;
				break;

			case CustomBlending:
				colorBlend.srcFactor = this._getBlendFactor( material.blendSrc );
				colorBlend.dstFactor = this._getBlendFactor( material.blendDst );
				colorBlend.operation = this._getBlendOperation( material.blendEquation );
				break;

			default:
				console.error( 'THREE.WebGPURenderer: Blending not supported.', blending );

		}

		return colorBlend;

	}

	_getColorFormat( renderer ) {

		let format;

		const renderTarget = renderer.getRenderTarget();

		if ( renderTarget !== null ) {

			const renderTargetProperties = this.properties.get( renderTarget );
			format = renderTargetProperties.colorTextureFormat;

		} else {

			format = GPUTextureFormat.BRGA8Unorm; // default swap chain format

		}

		return format;

	}

	_getColorWriteMask( material ) {

		return ( material.colorWrite === true ) ? GPUColorWriteFlags.All : GPUColorWriteFlags.None;

	}

	_getDepthCompare( material ) {

		let depthCompare;

		if ( material.depthTest === false ) {

			depthCompare = GPUCompareFunction.Always;

		} else {

			const depthFunc = material.depthFunc;

			switch ( depthFunc ) {

				case NeverDepth:
					depthCompare = GPUCompareFunction.Never;
					break;

				case AlwaysDepth:
					depthCompare = GPUCompareFunction.Always;
					break;

				case LessDepth:
					depthCompare = GPUCompareFunction.Less;
					break;

				case LessEqualDepth:
					depthCompare = GPUCompareFunction.LessEqual;
					break;

				case EqualDepth:
					depthCompare = GPUCompareFunction.Equal;
					break;

				case GreaterEqualDepth:
					depthCompare = GPUCompareFunction.GreaterEqual;
					break;

				case GreaterDepth:
					depthCompare = GPUCompareFunction.Greater;
					break;

				case NotEqualDepth:
					depthCompare = GPUCompareFunction.NotEqual;
					break;

				default:
					console.error( 'THREE.WebGPURenderer: Invalid depth function.', depthFunc );

			}

		}

		return depthCompare;

	}

	_getDepthStencilFormat( renderer ) {

		let format;

		const renderTarget = renderer.getRenderTarget();

		if ( renderTarget !== null ) {

			const renderTargetProperties = this.properties.get( renderTarget );
			format = renderTargetProperties.depthTextureFormat;

		} else {

			format = GPUTextureFormat.Depth24PlusStencil8;

		}

		return format;

	}

	_getPrimitiveState( object, material ) {

		const descriptor = {};

		descriptor.topology = this._getPrimitiveTopology( object );

		if ( object.isLine === true && object.isLineSegments !== true ) {

			const geometry = object.geometry;
			const count = ( geometry.index ) ? geometry.index.count : geometry.attributes.position.count;
			descriptor.stripIndexFormat = ( count > 65535 ) ? GPUIndexFormat.Uint32 : GPUIndexFormat.Uint16; // define data type for primitive restart value

		}

		switch ( material.side ) {

			case FrontSide:
				descriptor.frontFace = GPUFrontFace.CCW;
				descriptor.cullMode = GPUCullMode.Back;
				break;

			case BackSide:
				descriptor.frontFace = GPUFrontFace.CW;
				descriptor.cullMode = GPUCullMode.Back;
				break;

			case DoubleSide:
				descriptor.frontFace = GPUFrontFace.CCW;
				descriptor.cullMode = GPUCullMode.None;
				break;

			default:
				console.error( 'THREE.WebGPURenderer: Unknown Material.side value.', material.side );
				break;

		}

		return descriptor;

	}

	_getPrimitiveTopology( object ) {

		if ( object.isMesh ) return GPUPrimitiveTopology.TriangleList;
		else if ( object.isPoints ) return GPUPrimitiveTopology.PointList;
		else if ( object.isLineSegments ) return GPUPrimitiveTopology.LineList;
		else if ( object.isLine ) return GPUPrimitiveTopology.LineStrip;

	}

	_getStencilCompare( material ) {

		let stencilCompare;

		const stencilFunc = material.stencilFunc;

		switch ( stencilFunc ) {

			case NeverStencilFunc:
				stencilCompare = GPUCompareFunction.Never;
				break;

			case AlwaysStencilFunc:
				stencilCompare = GPUCompareFunction.Always;
				break;

			case LessStencilFunc:
				stencilCompare = GPUCompareFunction.Less;
				break;

			case LessEqualStencilFunc:
				stencilCompare = GPUCompareFunction.LessEqual;
				break;

			case EqualStencilFunc:
				stencilCompare = GPUCompareFunction.Equal;
				break;

			case GreaterEqualStencilFunc:
				stencilCompare = GPUCompareFunction.GreaterEqual;
				break;

			case GreaterStencilFunc:
				stencilCompare = GPUCompareFunction.Greater;
				break;

			case NotEqualStencilFunc:
				stencilCompare = GPUCompareFunction.NotEqual;
				break;

			default:
				console.error( 'THREE.WebGPURenderer: Invalid stencil function.', stencilFunc );

		}

		return stencilCompare;

	}

	_getStencilOperation( op ) {

		let stencilOperation;

		switch ( op ) {

			case KeepStencilOp:
				stencilOperation = GPUStencilOperation.Keep;
				break;

			case ZeroStencilOp:
				stencilOperation = GPUStencilOperation.Zero;
				break;

			case ReplaceStencilOp:
				stencilOperation = GPUStencilOperation.Replace;
				break;

			case InvertStencilOp:
				stencilOperation = GPUStencilOperation.Invert;
				break;

			case IncrementStencilOp:
				stencilOperation = GPUStencilOperation.IncrementClamp;
				break;

			case DecrementStencilOp:
				stencilOperation = GPUStencilOperation.DecrementClamp;
				break;

			case IncrementWrapStencilOp:
				stencilOperation = GPUStencilOperation.IncrementWrap;
				break;

			case DecrementWrapStencilOp:
				stencilOperation = GPUStencilOperation.DecrementWrap;
				break;

			default:
				console.error( 'THREE.WebGPURenderer: Invalid stencil operation.', stencilOperation );

		}

		return stencilOperation;

	}

	_getVertexFormat( type ) {

		// @TODO: This code is GLSL specific. We need to update when we switch to WGSL.

		if ( type === 'float' ) return GPUVertexFormat.Float32;
		if ( type === 'vec2' ) return GPUVertexFormat.Float32x2;
		if ( type === 'vec3' ) return GPUVertexFormat.Float32x3;
		if ( type === 'vec4' ) return GPUVertexFormat.Float32x4;

		if ( type === 'int' ) return GPUVertexFormat.Sint32;
		if ( type === 'ivec2' ) return GPUVertexFormat.Sint32x2;
		if ( type === 'ivec3' ) return GPUVertexFormat.Sint32x3;
		if ( type === 'ivec4' ) return GPUVertexFormat.Sint32x4;

		if ( type === 'uint' ) return GPUVertexFormat.Uint32;
		if ( type === 'uvec2' ) return GPUVertexFormat.Uint32x2;
		if ( type === 'uvec3' ) return GPUVertexFormat.Uint32x3;
		if ( type === 'uvec4' ) return GPUVertexFormat.Uint32x4;

		console.error( 'THREE.WebGPURenderer: Shader variable type not supported yet.', type );

	}

	_parseShaderAttributes( shader ) {

		// find "layout (location = num) in type name" in vertex shader

		const regex = /\s*layout\s*\(\s*location\s*=\s*(?<location>[0-9]+)\s*\)\s*in\s+(?<type>\w+)\s+(?<name>\w+)\s*;/gmi;
		let shaderAttribute = null;

		const attributes = [];

		while ( shaderAttribute = regex.exec( shader ) ) {

			const shaderLocation = parseInt( shaderAttribute.groups.location );
			const arrayStride = this._getArrayStride( shaderAttribute.groups.type );
			const vertexFormat = this._getVertexFormat( shaderAttribute.groups.type );

			attributes.push( {
				name: shaderAttribute.groups.name,
				arrayStride: arrayStride,
				slot: shaderLocation,
				format: vertexFormat
			} );

		}

		// the sort ensures to setup vertex buffers in the correct order

		return attributes.sort( function ( a, b ) {

			return a.slot - b.slot;

		} );

	}

}

function onMaterialDispose( event ) {

	const properties = this.properties;

	const material = event.target;
	const materialProperties = properties.get( material );

	material.removeEventListener( 'dispose', materialProperties.disposeCallback );

	properties.remove( material );

	// @TODO: still needed remove nodes, bindings and pipeline

}

export default WebGPURenderPipelines;
