let editor;
window.onload = function () {
  const container = document.getElementById('rightDiv');
  const options = {
    mode: 'tree',
    onError: function (err) {
      document.getElementById('validity').className = 'error';
      document.getElementById('validity').textContent = 'JSON invalid: ' + err.toString();
    }
  };
  editor = new JSONEditor(container, options);
  editor.set({});
  initResizable();
};

function initResizable() {
  const leftDiv = document.getElementById('leftDiv');
  const rightDiv = document.getElementById('rightDiv');
  const dragBar = document.getElementById('dragBar');
  let isResizing = false;
  let lastX = 0;

  dragBar.addEventListener('mousedown', function (e) {
    isResizing = true;
    lastX = e.clientX;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('mouseleave', stopResize);
  });

  function handleMouseMove(e) {
    if (!isResizing) return;
    let dx = e.clientX - lastX;
    let newLeftWidth = parseInt(getComputedStyle(leftDiv).width) + dx;
    let newRightWidth = parseInt(getComputedStyle(rightDiv).width) - dx;

    if (newLeftWidth > 100 && newRightWidth > 100) {
      leftDiv.style.width = newLeftWidth + 'px';
      rightDiv.style.width = newRightWidth + 'px';
      lastX = e.clientX;
    }
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('mouseleave', stopResize);
  }
}

function tryParseJSON() {
  const input = document.getElementById('jsonInput').value.trim();
  if (input === '') {
    editor.set({});
    document.getElementById('validity').className = 'valid';
    document.getElementById('validity').textContent = "Input cleared - JSON viewer cleared";
  } else {
    try {
      const json = JSON.parse(input);
      editor.set(json);
      document.getElementById('validity').className = 'valid';
      document.getElementById('validity').textContent = "Valid JSON";
    } catch (e) {
      editor.set({}); // Clear the editor if JSON is invalid
      document.getElementById('validity').className = 'error';
      document.getElementById('validity').textContent = "Invalid JSON: " + e.message;

    }
  }
}

function formatJSON() {
  editor.setMode("code");
  tryParseJSON();
}

function expandTree() {
  editor.setMode("tree");
  tryParseJSON();
  editor.expandAll();
}

function collapseTree() {
  editor.setMode("tree");
  tryParseJSON();
}

function removeWhitespace() {
  try {
    editor.setMode("text");
    const input = document.getElementById('jsonInput').value.trim();
    const json = JSON.parse(input);
    editor.updateText(JSON.stringify(json));
    document.getElementById('validity').className = 'valid';
    document.getElementById('validity').textContent = "Whitespace removed - JSON valid";
  } catch (e) {
    document.getElementById('validity').className = 'error';
    document.getElementById('validity').textContent = "Invalid JSON - Cannot remove whitespace";
  }
}

function toggleWindow() {
  // Function to toggle full width for rightDiv or restore
  var button = document.getElementById("toggleButton");
  const leftDiv = document.getElementById('leftDiv');
  const rightDiv = document.getElementById('rightDiv');
  if (leftDiv.style.display === 'none') {
    leftDiv.style.display = 'flex';
    rightDiv.style.width = '50%';
    button.style.backgroundImage = "url('../../images/size-up.png')";
    button.title = "Maximize";
  } else {
    leftDiv.style.display = 'none';
    rightDiv.style.width = '100%';
    button.style.backgroundImage = "url('../../images/size-down.png')";
    button.title = "Restore";
  }
}

function copyJSON() {
  try {
    const json = editor.get();
    const space = editor.getMode() === 'text' ? 0 : 2;
    const formattedJson = JSON.stringify(json, null, space);
    document.getElementById("copyJSON").focus();
    navigator.clipboard.writeText(formattedJson);
    document.getElementById('validity').className = 'valid';
    document.getElementById('validity').textContent = "JSON copied to clipboard!";
  } catch (e) {
    document.getElementById('validity').className = 'error';
    document.getElementById('validity').textContent = "Failed to copy JSON";
  }
}

