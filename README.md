# hack-toy-apps
Toy apps for Endless Hack

This repository contains the toy apps for the Endless Hack product. They are organized by folders named of the app id.

You can generate the manifest using the generate_manifest script: 

<code>./generate_manifest [app_id]</code>

Then you can build the flatpak of the app and install it:

<code>flatpak-builder --force-clean --install fbuild [app_id].json</code>
