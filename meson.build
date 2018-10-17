project('toyapp')

app_id = get_option('app-id')

install_subdir(
    'template',
    install_dir: 'share/toy',
    strip_directory: true
)

install_subdir(
    join_paths(app_id, 'app'),
    install_dir: 'share/toy/app',
    strip_directory: true
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
    join_paths(app_id, 'data', 'splashscreen.png'),
    install_dir: 'share/eos-shell-content/splash',
    rename: app_id + '.png'
)

data = configuration_data()
data.set('APP_ID', app_id)
runner = configure_file(
    input: 'runner.in',
    output: app_id,
    configuration: data,
    install: true,
    install_dir: 'bin'
)
