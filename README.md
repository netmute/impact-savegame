# Simple savegame plugin for ImpactJS

This plugin uses the localStorage API to provide persistent storage for your savegame data.

## Usage

Initialize a new savegame handler with a version number of 1. If there is an existing savegame, it will be loaded.

    savegame = new ig.Savegame(1);

Versions are useful if you decide to change the savegame format later. If you raise the version number, the savegame handler will reset the players savegame if uses an older version.

### Save and retrieve data

Store the value 1 at key 'level':

    savegame.set('level', 1);

Get the value of key 'level':

    savegame.get('level');

Remove the key 'level':

    savegame.remove('level');

Clear all keys (This essentially deletes the savegame):

    savegame.clear();

You can also store entire objects:

    savegame.set('player', { name: 'simon', level: 2 });

Get the stored object:

    var player = savegame.get('player');
    console.log(player.name, player.level);
