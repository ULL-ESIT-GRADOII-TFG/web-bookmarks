'use babel';

import WebBookmarksView from './web-bookmarks-view';
import { CompositeDisposable, Disposable } from 'atom';
import { dirname } from 'path';
var configPath = atom.config.getUserConfigPath();
var ruta = dirname(configPath) + "/packages/web-bookmarks/atomBookmarks.json";

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener(uri => {
        if(uri === 'atom://web-bookmarks') {
          return new WebBookmarksView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'web-bookmarks:toggle': () => this.toggle()
      }),

      atom.commands.add('atom-workspace', {
        'web-bookmarks:edit-bookmarks': () => atom.workspace.open(ruta)
      }),

      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof WebBookmarksView) {
            item.destroy();
          }
        })
      })
    );
  },

  deserializeWebBookmarksView(serialized) {
   //return new WebBookmarksView();
 },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://web-bookmarks');
  }

};
