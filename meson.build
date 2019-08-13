project('toyapp')

app_id = get_option('app-id')

install_subdir(
    'template',
    install_dir: 'share/toy',
    strip_directory: true
)

excluded_from_app = []
if app_id == 'com.hack_computer.Fizzics'
  excluded_from_app = [
      'sounds',
  ]
endif

install_subdir(
    join_paths(app_id, 'app'),
    install_dir: 'share/toy/app',
    strip_directory: true,
    exclude_directories: excluded_from_app
)

install_data(
    join_paths(app_id, 'data', 'app.desktop'),
    install_dir: 'share/applications',
    rename: app_id + '.desktop'
)

install_data(
    join_paths(app_id, 'data', 'appdata.xml'),
    install_dir: 'share/appdata',
    rename: app_id + '.appdata.xml'
)

install_data(
    join_paths(app_id, 'data', 'app.icon.png'),
    install_dir: 'share/icons/hicolor/64x64/apps',
    rename: app_id + '.png'
)

install_data(
    join_paths(app_id, 'data', 'splashscreen.jpg'),
    install_dir: 'share/eos-shell-content/splash',
    rename: app_id + '.jpg'
)

if app_id == 'com.hack_computer.HackUnlock'
    install_data(
        join_paths(app_id, 'data', 'app.service'),
        install_dir: 'share/dbus-1/services',
        rename: app_id + '.service'
    )
endif

if app_id == 'com.hack_computer.Fizzics' or app_id == 'com.hack_computer.HackUnlock' or app_id == 'com.hack_computer.OperatingSystemApp' or app_id == 'com.endlessm.Sidetrack'
    install_data(
        join_paths(app_id, 'data', 'metadata.json'),
        install_dir: 'share/toy'
    )
endif

if app_id == 'com.endlessm.LightSpeed' or app_id == 'com.endlessm.Sidetrack' 
    install_data(
        join_paths('common', 'phaser-3.17.0.min.js'),
        install_dir: 'share/toy/app',
        rename: 'phaser.min.js'
    )
endif

if app_id == 'com.endlessm.LightSpeed' or app_id == 'com.endlessm.Sidetrack' 
    install_data(
        join_paths('common', 'pauseToyApp.js'),
        install_dir: 'share/toy/app',
        rename: 'pauseToyApp.js'
    )
endif

data = configuration_data()
data.set('APP_ID', app_id)
runner = configure_file(
    input: 'runner.in',
    output: app_id,
    configuration: data,
    install: true,
    install_dir: 'bin'
)
