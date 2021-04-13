Until recently if you wanted to allow a user to upload a model _and associated textures_ with a three.js loader, using either a traditional file upload form, or a drag and drop interface, then you would have run into trouble.

The loaders are set up to look in the same folder as the model for textures. Some of them allow you to set a separate folder for textures. However, until the introduction of the URL transform, none of them allowed you to use textures that had passed in via web interface, since these textures do not reside anywhere on the disk.

To get around this you would need to set up some complex backend stuff, uploading the textures to the server and then loading them from there. Later versions of my loader did this, but it was not ideal since loading models took considerable longer.

`LoadingManager.setURLModifier` to the rescue! This was introduced in three.js r89 and allows you to use a set of uploaded textures.