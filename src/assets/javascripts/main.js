import Amber from 'amber'

if (document.getElementsByTagName('textarea')) {
  try {
    var editor = new Editor();
    editor.render();
  } catch (error) {
    console.error(error)
  }
}
