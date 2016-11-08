$(function () {
  /* TODO: need better way to snap chemicals relative to canvas */
  var chemPadding = 80;
  interact('.chem-shape')
    .draggable({
      // enable initial throwing
      inertia: true,
      // keep the element within the area of its parent
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      autoscroll: true,
      onmove: dragMoveListener,
      onend: endMoveListener
    });

  function dragMoveListener (event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = 
      target.style.transform = 
      'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  function endMoveListener (event) {
    var target = event.target;
    var x = target.getAttribute('data-x');
    var y = target.getAttribute('data-y');
    if (target.getAttribute('data-snap')) {
      x = chemPadding;
      y = 488;
    }
    target.style.webkitTransform = 
      target.style.transform = 
      'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  window.dragMoveListener = dragMoveListener;

  interact('#mixing-board').dropzone({
    // only accept elements matching this CSS selector
    accept: '.chem-shape',
    // Require a 25% element overlap for a drop to be possible
    overlap: 0.25,

    // listen for drop-related events:
    ondropactivate: function (event) {
      event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
      dropzoneElement = event.target;

      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
      /* draggableElement.textContent = 'Dragged in'; */
      $('#mixing-board-greeting').hide();
      chemPadding += 60;
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
      $('#mixing-board-greeting').show();
      event.relatedTarget.classList.remove('chem-shape-small');
      event.relatedTarget.removeAttribute('data-snap');
      chemPadding -= 60;
    },
    ondrop: function (event) {
      event.relatedTarget.classList.add('chem-shape-small');
      event.relatedTarget.setAttribute('data-snap', true);
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
      /* event.target.classList.remove('drop-target'); */
    }
  });
});
