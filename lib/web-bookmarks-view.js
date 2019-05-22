'use babel';

var shell = require("electron").shell;
$ = jQuery = require("jquery");
var fs = require("fs");
import { dirname } from 'path';
var configPath = atom.config.getUserConfigPath();
var ruta = dirname(configPath) + "/packages/web-bookmarks/atomBookmarks.json";
var jsonpatch = require('jsonpatch');

var savebookmarks = "";
var prefix = "folder";
var subfolders = [];
var subpos = "";

export default class WebBookmarksView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('web-bookmarks');
    this.element.id = 'web-bookmarks';

    // Create message element
    const message = document.createElement('div');
    message.innerHTML = `
      <div id="container">
        <h1>Bookmaks <a><i id="icon-refresh" class="fa fa-repeat icon-refresh"></i></a></h1>
        <button id="btn-form-bookmark" class="collapsible">Añadir bookmark</button>
        <div class="content">
          <form id="form-add">
            <div class="campos">
              <label for="bookmark">Nombre</label>
              <input id="bookmark" class="native-key-bindings boxsize" type="text" placeholder="Introduzca el nombre del marcador" name="bookmark" required>
            </div>
            <div class="campos">
              <label for="url">Url</label>
              <input id="url" class="native-key-bindings boxsize" type="text" placeholder="Introduzca la url" name="url" required>
            </div>
            <div class="campos">
              <label for="myfolders">Añadir a carpeta</label>
              <select id="myfolders" class="native-key-bindings custom-select" name="myfolders">
                <option value="" selected>Eligir carpeta</option>
              </select>
            </div>

            <button class="btn-add" type="submit">Añadir</button>
          </form>
        </div>

        <button id="btn-form-folder" class="collapsible btn-form-folder">Añadir carpeta</button>
        <div class="content">
          <form id="form-add-folder">
            <div class="campos">
              <label for="folder">Nombre</label>
              <input id="folder" class="native-key-bindings boxsize" type="text" placeholder="Introduzca el nombre de la carpeta" name="folder" required>
            </div>
            <div class="campos">
              <label for="myfolders-form-folder">Añadir a carpeta</label>
              <select id="myfolders-form-folder" class="native-key-bindings custom-select" name="myfolders-form-folder">
                <option value="" selected>Eligir carpeta</option>
              </select>
            </div>

            <button class="btn-add" type="submit">Añadir</button>
          </form>
        </div>
        <hr>
      </div>
      <div id="btns-creados">

      </div>
    `;
    message.classList.add('message');
    this.element.appendChild(message);

    this.myBookmarks(this);
  }

  myBookmarks(element) {

    $(document).ready(function () {
      if($('#web-bookmarks').is(':visible')) {
        element.refreshBookmarks(element);

        document.getElementById("form-add").onsubmit = function() {element.newBookmark()};
        document.getElementById("form-add-folder").onsubmit = function() {element.newFolder()};

        $('#btns-creados').click(function(e){
          if((e.target.tagName == 'BUTTON') && (e.target.value)){
            var id = e.target.id;
            var value = e.target.value;
            element.openUrl(value);
          }
        });

        $('#icon-refresh').click(function(e){
           element.refreshBookmarks(element);
        });
      }
      else {
        setTimeout(element.myBookmarks(element), 50);
      }

    });
  }

  loadBookmarks() {
    var readbookmarks = "";

    try {
      readbookmarks = fs.readFileSync(ruta, "UTF8");
      savebookmarks = JSON.parse(readbookmarks);
    } catch (err) {
      var json = JSON.parse('{}');
      var datos = JSON.stringify(json, null, '\t');
      fs.writeFileSync(ruta, datos);

      savebookmarks = json;
    }
  }

  changeHeight() {
    var changeDim = document.getElementById("container").getElementsByClassName("collapsible");
    for (var i = 0; i < changeDim.length; i++) {
      changeDim[i].addEventListener("click", function() {
        document.getElementById("btns-creados").style.height = $('#web-bookmarks').height() - $('#container').height() - 27 + "px";
      });
    }
  }

  expandBtns() {
    var coll = document.getElementsByClassName("collapsible");
    var listener = function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
      if((this.id == "btn-form-bookmark") && (this.classList.contains("active")) && (document.getElementById("btn-form-folder").classList.contains("active"))){
        document.getElementById("btn-form-folder").classList.toggle("active");
        var content = document.getElementById("btn-form-folder").nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        }
      }
      else if((this.id == "btn-form-folder") && (this.classList.contains("active")) && (document.getElementById("btn-form-bookmark").classList.contains("active"))){
        document.getElementById("btn-form-bookmark").classList.toggle("active");
        var content = document.getElementById("btn-form-bookmark").nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        }
      }
    };

    for (var i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", listener, false);
    }
  }

  loadSelectFolder(thisbookmarks) {
    for (var i in thisbookmarks) {
      if(typeof thisbookmarks[i] === 'object') {
        var newoptionfolder = document.createElement('option');
        newoptionfolder.textContent = i;
        newoptionfolder.value = i;
        document.getElementById('myfolders').appendChild(newoptionfolder);
				var newoptionfolder1 = document.createElement('option');
        newoptionfolder1.textContent = i;
        newoptionfolder1.value = i;
        document.getElementById('myfolders-form-folder').appendChild(newoptionfolder1);
				this.loadSelectFolder(thisbookmarks[i]);
      }
    }
  }

  createButtons(element) {
    for (var i in savebookmarks) {
      if(typeof savebookmarks[i] === 'object'){
        var folder = i;
        element.newFolderButton(folder, "btns-creados");
        element.loopBookmarks(folder, savebookmarks[i], prefix + folder);
      }
      else {
        var bookmark = i;
        var url = savebookmarks[i];
        element.newButton(bookmark, url, "btns-creados");
      }
    }
  }

  newBookmark() {
    var bookmark = document.getElementById("bookmark").value;
    var url = document.getElementById("url").value;
    var folder = "";

    if(document.getElementById("myfolders").options.length > 0) {
      folder = document.getElementById("myfolders").value;
    }

    if(folder) {
      this.insertElement(folder, false);
      this.newButton(bookmark, url, prefix + folder);
    }
    else {
      this.newButton(bookmark, url, "btns-creados");
      savebookmarks[bookmark] = url;
    }

    var datos1 = JSON.stringify(savebookmarks, null, '\t');
    fs.writeFile(ruta, datos1, function(err) {
      if (err)
        return console.error(err);
    });

    $('#bookmark').val('');
    $('#url').val('');
    $('#myfolders').val('');
    this.hideContent(document.getElementById("btn-form-bookmark"));
    document.getElementById("btns-creados").style.height = $('#web-bookmarks').height() - $('#container').height() - 27 + "px";
  }

  newFolder() {
    var folder = document.getElementById("folder").value;
    var fatherfolder = "";

    if(document.getElementById("myfolders-form-folder").options.length > 0) {
      fatherfolder = document.getElementById("myfolders-form-folder").value;
    }

    if(fatherfolder) {
      this.insertElement(fatherfolder, true);
      this.newFolderButton(folder, prefix + fatherfolder);
    }
    else {
      this.newFolderButton(folder, "btns-creados");
      savebookmarks[folder] = {};
    }

    var datos1 = JSON.stringify(savebookmarks, null, '\t');
    fs.writeFile(ruta, datos1, function(err) {
      if (err)
        return console.error(err);
    });

    var newoptionfolder = document.createElement('option');
    newoptionfolder.textContent = folder;
    newoptionfolder.value = folder;
    document.getElementById('myfolders').appendChild(newoptionfolder);
		var newoptionfolder1 = document.createElement('option');
		newoptionfolder1.textContent = folder;
		newoptionfolder1.value = folder;
		document.getElementById('myfolders-form-folder').appendChild(newoptionfolder1);

    this.addEventFolder(document.getElementById(folder));

    $('#folder').val('');
    $('#myfolders-form-folder').val('');
    this.hideContent(document.getElementById("btn-form-folder"));
    document.getElementById("btns-creados").style.height = $('#web-bookmarks').height() - $('#container').height() - 27 + "px";
  }

  newButton(mybookmark, myurl, classbutton) {
    var iconfolder = document.createElement('i');
    iconfolder.classList.add('fa');
    iconfolder.classList.add('fa-link');
    iconfolder.classList.add('icons-folders');
    var newbookmark = document.createElement('button');
    newbookmark.textContent = mybookmark;
    newbookmark.classList.add('btns-creados');
    newbookmark.id = mybookmark;
    newbookmark.value = myurl;
    document.getElementById(classbutton).appendChild(newbookmark);
    document.getElementById(mybookmark).appendChild(iconfolder);
  }

  newFolderButton(myfolder, father) {
    var divhide = document.createElement('div');
    divhide.classList.add('content');
    var idfolder = prefix + myfolder;
    divhide.id = idfolder;
    var iconfolder = document.createElement('i');
    iconfolder.classList.add('fa');
    iconfolder.classList.add('fa-folder');
    iconfolder.classList.add('icons-folders');
    var newfolder = document.createElement('button');
    newfolder.textContent = myfolder;
    newfolder.classList.add('collapsible');
    newfolder.classList.add('btns-creados');
    newfolder.id = myfolder;
    document.getElementById(father).appendChild(newfolder);
    document.getElementById(father).appendChild(divhide);
    document.getElementById(myfolder).appendChild(iconfolder);
  }

  loopBookmarks (folder, folderbookmarks, father) {
  	for (var i in folderbookmarks) {
        if(typeof folderbookmarks[i] === 'object'){
          this.newFolderButton(i, prefix + folder);
          this.loopBookmarks(i, folderbookmarks[i], prefix + i);
        }
        else {
          var bookmark = i;
          var url = folderbookmarks[i];
          this.newButton(bookmark, url, father);
        }
    }
  }

  insertElement(fatherfolder, isfolder) {
    for (var i in savebookmarks) {
      subfolders = [];
      if((typeof savebookmarks[i] === 'object') && (i === fatherfolder)){
        if(isfolder){
          var pos = "/" + fatherfolder + "/" + document.getElementById("folder").value;
          var thepath = [
            {"op": "add", "path": pos, "value": {}}
          ];
          savebookmarks = jsonpatch.apply_patch(savebookmarks, thepath);
        }
        else {
          var pos = "/" + fatherfolder + "/" + document.getElementById("bookmark").value;
          var thepath = [
            {"op": "add", "path": pos, "value": document.getElementById("url").value}
          ];
          savebookmarks = jsonpatch.apply_patch(savebookmarks, thepath);
        }
        subpos = "";
        subfolders = [];
        return;
      }
      else if(typeof savebookmarks[i] === 'object') {
        subfolders.push(i);
        thisbookmarks = savebookmarks[i];
        this.recorre(thisbookmarks, fatherfolder);
        if(subfolders.length > 0) {
          if(isfolder){
            var pos = subpos + "/" + document.getElementById("folder").value;
            var thepath = [
              {"op": "add", "path": pos, "value": {}}
            ];
            savebookmarks = jsonpatch.apply_patch(savebookmarks, thepath);
          }
          else{
            var pos = subpos + "/" + document.getElementById("bookmark").value;
            var thepath = [
              {"op": "add", "path": pos, "value": document.getElementById("url").value}
            ];
            savebookmarks = jsonpatch.apply_patch(savebookmarks, thepath);
          }
          subpos = "";
          subfolders = [];
          return;
        }
      }
    }
  }

	recorre(bookmarksfolder, fatherfolder) {
	  for(var i in bookmarksfolder) {
      if(subpos){
        return;
      }
	    if((typeof bookmarksfolder[i] === 'object') && (i === fatherfolder)){
	    	subfolders.push(i);
        subpos = "/" + subfolders[0];
        for (var j = 1; j < subfolders.length; j++) {
        	subpos = subpos + "/" + subfolders[j];
        }
				return;
        subfolders.pop();
	    }
	    else if(typeof bookmarksfolder[i] === 'object') {
	    	subfolders.push(i);
	    	thisbookmarks = bookmarksfolder[i];
	    	this.recorre(thisbookmarks, fatherfolder);
	    }
	  }
	  subfolders.pop();
	}

  addEventFolder(elementevent) {
    elementevent.addEventListener("click", function() {
      document.getElementById("btns-creados").style.height = $('#web-bookmarks').height() - $('#container').height() - 27 + "px";
    });

    elementevent.addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  hideContent(elementtoggle) {
    elementtoggle.classList.toggle("active");
    var content = elementtoggle.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    }
  }

  refreshBookmarks(element) {
    element.cleanData();
    element.loadBookmarks();
    element.createButtons(element);
    element.loadSelectFolder(savebookmarks);
    element.expandBtns();
    element.changeHeight();
    document.getElementById("btns-creados").style.height = $('#web-bookmarks').height() - $('#container').height() - 27 + "px";
  }

  cleanData() {
    $('#bookmark').val('');
    $('#url').val('');
    $('#myfolders').find("option:gt(0)").remove();
    $('#folder').val('');
    $('#myfolders-form-folder').find("option:gt(0)").remove();
    $("#btns-creados").empty();
    var old_element = document.getElementsByClassName("collapsible");
    for (var i = 0; i < old_element.length; i++) {
      var new_element = old_element[i].cloneNode(true);
      old_element[i].parentNode.replaceChild(new_element, old_element[i]);
    }
  }

  openUrl(link) {
    shell.openExternal(link);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    // return {
    //   deserializer: 'web-bookmarks/WebBookmarksView'
    // };
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'Web Bookmarks'
  }

  getURI() {
    return 'atom://web-bookmarks'
  }

  getDefaultLocation() {
    return 'right'
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom']
  }

}
