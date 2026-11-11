# The walker model

Put a rigged, animated glTF figure here as **`walker.glb`**; the `walker` and `walker-2m` blocks then use it instead of the procedural walker. One file holds everything: mesh, skeleton and all animations. The viewer plays the clip named "walk" (or the first clip that contains "walk"), samples points on the skinned surface every frame (the same points each frame, so KALAM's tracked identity works), scales the figure to 1.75 m and, if the clip walks on the spot, carries it across at 1.3 m/s.

From Sketchfab: on the model's page, **Download 3D Model → glTF → "glb"** (one file). If only the zipped `.gltf` is offered, open it in Blender (File → Import → glTF) and export again as **glTF Binary (.glb)**.

From Mixamo: download the character (FBX, T-pose) and a walk animation (FBX, "without skin" is fine), then build `walker.glb` with Blender:

    blender -b -P apps/viewer/scripts/fbx-to-walker.py -- Character/character.fbx Character/Walking.fbx apps/viewer/public/models/walker.glb

The script moves the walk onto the character, names it "walk", keeps only the base-colour texture (1024 px JPEG; points take their colour from it) and writes one `.glb`. A walk with root motion (Mixamo's default, "In Place" unticked) keeps walking across loops; an in-place walk is carried at 1.3 m/s.

The current `walker.glb` is Mixamo's Ch36 with its "Walking" clip, built this way. The source `.fbx` files stay out of git (`Character/` is ignored).

Check the model's licence on its page before committing it here: a CC Attribution model needs a credit line in the README.

To try another file without copying it here: `?model=<url>`. `?model=none` forces the procedural walker.
