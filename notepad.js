
    
        var quill = new Quill('#editor', {
            
            modules: {            
                history: {
                    delay: 1000,
                    maxStack: 100,
                    userOnly: false
                }
            }
        });
        
        quill.root.dataset.placeholder = '  Start typing...';
        quill.focus();
        quill.setSelection(0, 0);

        function undo() {
            quill.history.undo();
        }

        function redo() {
            quill.history.redo();
        }

        function changeTextColor(color) {
            quill.format('color', color);
        }

        // Enhanced font size adjustment functions
        const sizes = ['small', false, 'large', 'huge'];
        function increaseFontSize() {
            let currentSize = quill.getFormat().size || false;
            let currentIndex = sizes.indexOf(currentSize);
            let nextIndex = (currentIndex + 1) % sizes.length;
            quill.format('size', sizes[nextIndex]);
        }

        function decreaseFontSize() {
            let currentSize = quill.getFormat().size || false;
            let currentIndex = sizes.indexOf(currentSize);
            let nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = sizes.length - 1;
            quill.format('size', sizes[nextIndex]);
        }
        function clearEditor() {
            quill.setText(''); // Clears all content from the editor
        }

        function selectAllText() {
            quill.setSelection(0, quill.getLength()); // Selects all text in the editor
        }

        function clearFormat() {
            let range = quill.getSelection();
            if (range) {
                quill.removeFormat(range.index, range.length); // Removes formatting from the selected range
            }
        }
        function applyNumberedList() {
            let range = quill.getSelection();
            if (range) {
                let format = quill.getFormat(range);
                if (format.list === 'ordered') {
                    // Currently ordered, switch to unordered
                    quill.format('list', 'bullet');
                } else if (format.list === 'bullet') {
                    // Currently unordered, remove list formatting
                    quill.format('list', false);
                } else {
                    // No list formatting, switch to ordered
                    quill.format('list', 'ordered');
                }
            }
        }

        function boldText() {
            let range = quill.getSelection();
            if (range) {
                // Check if the selection is already bold
                let format = quill.getFormat(range);
                quill.format('bold', !format.bold); // Toggle bold formatting
            }
        }

        function italicText() {
            let range = quill.getSelection();
            if (range) {
                // Check if the selection is already bold
                let format = quill.getFormat(range);
                quill.format('italic', !format.italic); // Toggle bold formatting
            }
        }

        function changeColor(colr) {        
            let range = quill.getSelection();
            if (range) {
                let format = quill.getFormat(range);
                if (format.color === colr) {
                    quill.format('color', false);
                }
                else {
                    quill.format('color', colr);
                }    
            }
        }

        function underlineText() {
            let range = quill.getSelection();
            if (range) {
                // Check if the selection is already underlined
                let format = quill.getFormat(range);
                quill.format('underline', !format.underline); // Toggle bold formatting
            }
        }

        
        

        
