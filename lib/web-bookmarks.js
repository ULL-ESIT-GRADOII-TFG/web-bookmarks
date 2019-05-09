'use babel';

import RaulBookmarksView from './raul-bookmarks-view';
import { CompositeDisposable, Disposable } from 'atom';
import { dirname } from 'path';
var configPath = atom.config.getUserConfigPath();
var ruta = dirname(configPath) + "/packages/raul-bookmarks/atomBookmarks.json";

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener(uri => {
        if(uri === 'atom://raul-bookmarks') {
          return new RaulBookmarksView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'raul-bookmarks:toggle': () => this.toggle()
      }),

      atom.commands.add('atom-workspace', {
        'raul-bookmarks:edit-bookmarks': () => atom.workspace.open(ruta)
      }),

      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof RaulBookmarksView) {
            item.destroy();
          }
        })
      })
    );
  },

  deserializeRaulBookmarksView(serialized) {
   //return new RaulBookmarksView();
 },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://raul-bookmarks');
  }

};
