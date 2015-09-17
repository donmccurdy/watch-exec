# watch-exec

Run a specified command when any files in the target directory change.

## Installation

```
$ npm install -g watch-exec
```

## Usage

```
$ watch-exec -c [command] -w [path]
```

## Notifications

To use the `--notify` flag for desktop notifications when the command completes or fails, you will need to have Growl notifications available to NodeJS.

* Mac OS X (Darwin): `brew install terminal-notifier`
* Ubuntu (Linux): `sudo apt-get install libnotify-bin`
* Windows:
	1. Download and install [Growl for Windows](http://www.growlforwindows.com/gfw/default.aspx).
	2. Download [growlnotify](http://www.growlforwindows.com/gfw/help/growlnotify.aspx) and (*important*) unpack it to a folder in your path.

> If these instructions are not working correctly, check the [installation steps for *node-growl*](https://github.com/tj/node-growl#installation), which is used internally by *watch-exec*.

Thanks to [@naholyr](https://twitter.com/naholyr) for adding support for notifications!
