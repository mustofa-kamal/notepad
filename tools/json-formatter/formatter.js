  let editor;
  window.onload = function() {
    const container = document.getElementById('rightDiv');
    const options = {
      mode: 'tree', 
     onError: function(err) {
        document.getElementById('validity').className='error';
        document.getElementById('validity').textContent = 'JSON invalid: ' + err.toString();
      }
    };
    editor = new JSONEditor(container, options);
    editor.set({});
    initResizable();

    //removeButtons();

  };

  

  

  function initResizable() {
    const leftDiv = document.getElementById('leftDiv');
    const rightDiv = document.getElementById('rightDiv');
    const dragBar = document.getElementById('dragBar');
    let isResizing = false;
    let lastX = 0;

    dragBar.addEventListener('mousedown', function(e) {
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
      document.getElementById('validity').className='valid';
      document.getElementById('validity').textContent = "Input cleared - JSON viewer cleared";
    } else {
      try {
        const json = JSON.parse(input);
        editor.set(json);
        document.getElementById('validity').className='valid';
        document.getElementById('validity').textContent = "Valid JSON";
      } catch (e) {
        editor.set({}); // Clear the editor if JSON is invalid
        document.getElementById('validity').className='error';
        document.getElementById('validity').textContent = "Invalid JSON: " + e.message;
        
      }
    }
  }

  function formatJSON() {
    editor.setMode("code");
    tryParseJSON();
    //removeButtons()
  }

  function expandTree() {
    editor.setMode("tree");
    tryParseJSON();
    editor.expandAll();
    //removeButtons();
  }

  function collapseTree() {
    editor.setMode("tree");
    tryParseJSON();
    //removeButtons();
  }




  function removeWhitespace() {
    try {
      editor.setMode("code");
      const input = document.getElementById('jsonInput').value.trim();
      const json = JSON.parse(input);
      editor.updateText(JSON.stringify(json)); 
      document.getElementById('validity').className='valid';
      document.getElementById('validity').textContent = "Whitespace removed - JSON valid";
      //removeButtons();
    } catch (e) {
      document.getElementById('validity').className='error';
      document.getElementById('validity').textContent = "Invalid JSON - Cannot remove whitespace";
      //removeButtons();
    }
    
  
  }

  function expandViewer() {
    // Function to toggle full width for rightDiv or restore
    const leftDiv = document.getElementById('leftDiv');
    const rightDiv = document.getElementById('rightDiv');
    if (leftDiv.style.display === 'none') {
      leftDiv.style.display = 'flex';
      rightDiv.style.width = '50%';
    } else {
      leftDiv.style.display = 'none';
      rightDiv.style.width = '100%';
    }
  }

  function copyJSON() {
    try {
      const json = editor.get();
      const formattedJson = JSON.stringify(json, null, 2); // Ensure it's formatted
      navigator.clipboard.writeText(formattedJson);
      document.getElementById('validity').className='valid';
      document.getElementById('validity').textContent = "JSON copied to clipboard!";
    } catch (e) {
      document.getElementById('validity').className='error';
      document.getElementById('validity').textContent = "Failed to copy JSON";
    }
  }

  function removeButtons(){
    const menu = document.querySelector('.jsoneditor-menu');

        // Find all button elements within this div
        const buttons = menu.querySelectorAll('button');

        // Remove each button found
        buttons.forEach(button => {
          if (button.className !== 'jsoneditor-refresh' && button.className !== 'jsoneditor-next' && button.className !== 'jsoneditor-previous') {
            button.remove();
          }
        });
  }
  