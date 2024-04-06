///////////////////////////////////////////////////
// APPROACH ONE: files downloaded to your computer
///////////////////////////////////////////////////
import { Camera, Material, Texture } from "./build/three.module.js";
import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";
///////////////////////////////////////////////////
// APPROACH TWO: Get the files from a CDN
///////////////////////////////////////////////////
import { Camera, Material, Texture } from "https://cdn.skypack.dev@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev@0.132.2/examples/jsm/controls/OrbitControls.js";
///////////////////////////////////////////////////
// APPROACH THREE: Install the three.js NPM Package
///////////////////////////////////////////////////
import { Camera, Material, Texture } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
