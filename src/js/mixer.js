$(function () {
  /* TODO: fix location of chemicals that get dragged out */
  var chemShapeSize = 60;
  var fullSizeShape = 210;
  var workspace = document.getElementById('workspace');
  var mixBoard= document.getElementById('mixing-board');
  var mixGreet = document.getElementById('mixing-board-greeting');
  var mixedChems = [];
  var availChems = [];
  
  var fe = newChemical('Fe');
  moveElement(fe, fullSizeShape*(availChems.length-1)+10,0);
  var cl = newChemical('Cl');
  moveElement(cl, fullSizeShape*(availChems.length-1)+10,0);

  // convert rgb to hex (Eric Petrucelli)
  // http://stackoverflow.com/questions/1740700/
  // how-to-get-hex-color-value-rather-than-rgb-value
  function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);

    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  // updates mixed chemicals positions when chemicals are added/removed
  function updateChemPadding() {
    var chemColors = []
    var mixingBoard = mixBoard.getBoundingClientRect();
    var mixBoardPos = mixBoard.getBoundingClientRect().left - 50;
    var i;
    for (i = 0; i < mixedChems.length; i++) {
      var x = mixBoardPos + chemShapeSize*(i + 1);
      var y = mixingBoard.bottom - (chemShapeSize + 5);
      moveElement(mixedChems[i], x, y);
      chemColors.push(rgb2hex(mixedChems[i].style.backgroundColor));
    }
    if (mixedChems.length) {
      // update mixboard background color
      var last = mixedChems.length - 1;
      mixBoard.style.backgroundColor = '#' + rybColorMixer.mix(chemColors);
    }
  }

  window.onresize = updateChemPadding;

  // add chemical to mixed chem array
  function addChem(target) {
    console.log('chemical added, ' + mixedChems.length + ' in queue.');
    if (!mixedChems.length) {
      mixBoard.classList.add('compound');
      mixGreet.setAttribute('hidden', true);
    }
    if (!containsChem(target, mixedChems)) {
      mixedChems.push(target);
    }
  }

  // remove chemical from mixed chem array
  function removeChem(target) {
    console.log('chemical removed, ' + mixedChems.length + ' left.');
    var index = mixedChems.indexOf(target);
    if (index > -1) {
      mixedChems.splice(index,1);
    }
    // clear mixboard background if empty
    if (mixedChems.length < 1) {
      mixBoard.style.backgroundColor = 'transparent';
      mixBoard.classList.remove('compound');
      mixGreet.removeAttribute('hidden');
    }
  }

  // searches for a chemical in the mixed chem array
  function containsChem(target, arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] == target) {
        return true;
      }
    }
    return false;
  }

  // create new chemical
  function newChemical(chem) {
    var chemShape = document.createElement('div');
    var randomColor = '#'+(Math.random()*0xffffff<<0).toString(16);
    chemShape.classList.add('chem-shape');
    chemShape.textContent = chem;
    chemShape.style.backgroundColor = randomColor;
    document.getElementById('workspace').appendChild(chemShape);
    availChems.push(chemShape);
    return chemShape;
  }

  // move a draggable element
  function moveElement(target, x, y) {
    // translate the element
    target.style.webkitTransform = 
      target.style.transform = 
      'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // initialize draggable class
  interact('.chem-shape')
    .draggable({
      // enable initial throwing
      inertia: true,
      // keep the element within the area of its parent
      restrict: {
        /* restriction: 'parent', */
        restriction: workspace.getBoundingClientRect(),
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      autoscroll: false,
      onmove: function dragMoveListener (event) {
        var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        moveElement(target, x, y);
      },
      onend: function endMoveListener (event) {
        var target = event.target;
        var currShape = target.getBoundingClientRect();
        var mixingBoard = mixBoard.getBoundingClientRect();
        // resize shape to full size if outside of the mixing area
        if ((currShape.right < mixingBoard.left || 
            currShape.left > mixingBoard.right ||
            currShape.bottom < mixingBoard.top || 
            currShape.top > mixingBoard.bottom) 
            && target.getAttribute('data-mixed')) {
          target.classList.remove('chem-shape-small');
          target.removeAttribute('data-mixed');
        }
        updateChemPadding();
      }
    });

  // initialize dropzone class
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
      addChem(draggableElement);
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      var draggableElement = event.relatedTarget
      removeChem(draggableElement);
    },
    ondrop: function (event) {
      var draggableElement = event.relatedTarget
      event.relatedTarget.classList.add('chem-shape-small');
      event.relatedTarget.setAttribute('data-mixed', true);
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
    }
  });
});
