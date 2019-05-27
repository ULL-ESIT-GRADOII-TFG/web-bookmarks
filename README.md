# Web Bookmarks package

Web Bookmarks is a package that allows you to create web bookmarks, organize them by folders and open those bookmarks directly in your default browser without having to open the browser first.

## Instalation

There are two ways to install a package or plug-in in Atom:

1. Enter `apm install web-bookmarks` on your terminal. Obviously, the Atom package manager, `apm` must be installed:

```
C:\> apm install web-bookmarks
```

2. Open Atom, go to *File > Setiings > Install* and search for the package you wish to install.

![Install web bookmarks](https://user-images.githubusercontent.com/14926224/58275172-55ce7d00-7d8c-11e9-9b54-77bda47b12a9.png)

## Usage


The package has three modes of use:

1. Using the top menu, go to *Packages> Web Bookmarks> Toggle*
2. Using the context menu by right clicking in an open file, go to *Web Bookmarks> Toggle*
3. Through the combination of keys *Alt+Ctrl+O*

Once started, at the top there are two buttons that contain the forms with which we can create bookmarks and folders. 
These elements can be organized by folders and subfolders.

To edit or delete any item from the list is by editing the settings JSON file. To access  this file  go to the menu, in the same way as when the package was activated, but this time with the _Edit/Delete Bookmarks_ option.

The file will be created in the folder where the package is located when installed. The name of the json file is ***atomBookmarks.json***

    ../.atom/packages/Web-bookmarks/atomBookmarks.json

In this file we can change the name, delete or order the bookmarks. Be careful with the quotes and commas, to avoid syntax errors. 
Once the modifications have been made, the file must be saved and for these changes to be visible in the view, you must press the refresh button located in the top right corner.

![web-bookmarks-final](https://user-images.githubusercontent.com/14926224/58324272-50217780-7e1e-11e9-99f7-2cb332f364b6.gif)
