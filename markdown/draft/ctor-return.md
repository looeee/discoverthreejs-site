#### Custom Return Values in Class Constructors



We'll use this pattern in {{< link path="/book/first-steps/organizing-with-group/" title="" >}}, for example, where we use a class to create a group of three.js meshes. Once the class has done its work there we don't need to use the class structure anymore, we just want the group of meshes so we can add them to our scene.

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
class MeshGroup {
  constructor() {
    this.group = new Group();

    this.createGeometries();
    this.createMaterials();
    this.createMeshes();

    return this.group;
  }

}
{{< /code >}}