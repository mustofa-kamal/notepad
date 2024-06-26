

var quill = new Quill('#editor', {
    modules: {
        history: {
            delay: 1000,
            maxStack: 100,
            userOnly: false
        }
    }
});

quill.focus();
quill.setSelection(0, 0);

function undo() {
    quill.history.undo();
}

function redo() {
    quill.history.redo();
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
function makeList() {
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

function changeColor() {
    let colr = getRandomColor();
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

// Function to print Quill content
function printContent() {
    var editorContent = quill.root.innerHTML; // Get the inner HTML of the editor

    // Create a new window or iframe for printing
    var printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">');
    printWindow.document.write('<link href="notepad.css" rel="stylesheet">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(editorContent); // Write the editor content into the new window
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();

    // Use timeout to ensure all content loads before printing
    setTimeout(function () {
        printWindow.print(); // Trigger the print dialog
        printWindow.close(); // Close the window after printing
    }, 500);
}

// Load the content from local storage initially
const storedContent = localStorage.getItem('quill-content');
if (storedContent) {
    quill.setContents(JSON.parse(storedContent));
}

// Save the content to local storage on change
quill.on('text-change', function () {
    const content = quill.getContents();
    localStorage.setItem('quill-content', JSON.stringify(content));
});

function downloadAsPdf() {
    html2canvas(document.querySelector("#editor")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("download.pdf");
    });
}



function insertDateTime() {
    var now = new Date();
    var dateFormatter = new Intl.DateTimeFormat(navigator.language, {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    var formattedDateTime = dateFormatter.format(now);

    // Get the current selection range
    var range = quill.getSelection(true);
    if (range) {
        quill.insertText(range.index, formattedDateTime);
    }
}

function sendToEmail() {
    var text = quill.getText();  // Gets plain text; use `quill.root.innerHTML` for HTML content
    var subject = encodeURIComponent("Subject for your Email");
    var body = encodeURIComponent(text);
    var mailtoLink = `mailto:someone@gmail.com?subject=${subject}&body=${body}`;

    // Check if the length of the mailto link is too long
    if (mailtoLink.length > 2000) {
        alert('The content is too long to be sent via mailto link. Please shorten the content to under 2000 characters.');
    } else {
        window.location.href = mailtoLink;
    }
}

function copyTextAndOpenMeta() {
    var text = quill.getText(); // Get plain text from Quill editor
    navigator.clipboard.writeText(text).then(function() {
        alert('Text copied to clipboard. You can now paste it into Messanger or Facebook.');


       var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Checks if the user is on a mobile device
        if (/android/i.test(userAgent)) {
            window.open('fb://facewebmodal/f?href=https://www.facebook.com/', '_blank');
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            window.open('fb://profile/', '_blank');
        } else {
            // Fallback for desktop browsers
            window.open('https://www.facebook.com/', '_blank');
        }


    }, function(err) {
        alert('Failed to copy text: ' + err);
    });
}

function shareOnFacebook() {
    var url = "https://www.soheles.com/tools/online-notepad/"; // The URL you want to share
    var mobileFacebookUrl = "fb://facewebmodal/f?href=" + encodeURIComponent(url);
    var desktopFacebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);

    // Check if the user is on a mobile device
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Use the appropriate URL based on the device
    var facebookUrl = isMobile ? mobileFacebookUrl : desktopFacebookUrl;

    // Open the URL
    window.open(facebookUrl, "Facebook Share", "width=600, height=400");
}

function getRandomColor() {
    // Generate random color components
    const getRandomComponent = () => Math.floor(Math.random() * 256);
    let r, g, b, color;
    
    do {
        r = getRandomComponent();
        g = getRandomComponent();
        b = getRandomComponent();
        color = `rgb(${r}, ${g}, ${b})`;
    } while (color === 'rgb(0, 0, 0)' || color === 'rgb(255, 255, 255)');
    
    return color;
}

function changeBackgroundColor() {
    let range = quill.getSelection();
    if (range) {
        let color = getRandomColor();
        let format = quill.getFormat(range);
        if (format.background === color) {
            quill.format('background', false);
        } else {
            quill.format('background', color);
        }
    }
}





















