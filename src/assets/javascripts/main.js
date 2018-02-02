import Amber from 'amber'
import marked from 'marked'

if (document.getElementsByTagName('textarea')) {
  try {
    var editor = new Editor();
    editor.render();
  } catch (error) {
    console.error(error)
  }
}
