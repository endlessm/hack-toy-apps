### Build Fizzics on Endless OS

All you need to build Fizzics is:

1. **node**
2. **npm**
3. **command line tool**

<br>**Installing node** _and_ **npm**
> _`wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`_

<br>Run following command to verify the installation
> _`node --version`_

> _`npm --version`_

<br>**Build the game**

Check out the repository:
> _`git clone https://github.com/endlessm/hack-toy-apps`_

<br>Switch to the **Fizzics** directory:
> _`cd hack-toy-apps/com.hack_computer.Fizzics`_

<br>Checkout to the **fizzics_phaser** branch:
> _`git checkout fizzics_phaser`_

<br>Download npm packages:
> _`npm install`_

<br>Update **app** folder
> _`npm run build`_

<br>Switch back to the **hack-toy-apps** directory:
> `cd ..`

<br>Generate the manifest for the Fizzics app:
> _`./generate_manifest com.hack_computer.Fizzics`_

<br>Install the runtime SDK for the toy apps:
> _`flatpak install flathub org.gnome.Sdk//3.30`_

<br>Build the app:
> _`./build-flatpak.sh com.hack_computer.Fizzics`_

<br>Install the flatpak bundle:
> _`flatpak install --bundle com.hack_computer.Fizzics.flatpak`_

<br>**There is an authentication step you need to acknowledge:**
<br>List the installed apps, the one delivered with Hack is the stable version, the one you just created and installed the master version:
> _`flatpak list -d`_

<br>Run the app:
> _`flatpak run com.hack_computer.Fizzics//master`_

<br>Uninstall a flatpak:
> _`flatpak uninstall com.hack_computer.Fizzics//master`_

**_You are now ready to do changes in the repository and re-build the app with. For doing changes you can use a simple editor shipped with Hack called “gedit”._**
