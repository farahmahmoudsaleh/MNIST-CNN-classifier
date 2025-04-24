// Canvas setup
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        if (e.type === 'touchstart') {
            isDrawing = true;
            lastX = touchX;
            lastY = touchY;
        } else if (isDrawing) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(touchX, touchY);
            ctx.stroke();
            
            lastX = touchX;
            lastY = touchY;
        }
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
});

// Tab functionality
function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Deactivate all tabs
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // Show the selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activate the clicked tab
    event.currentTarget.classList.add('active');
    
    // Clear previous results
    hideResults();
}

// Canvas related functions
function clearCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hideResults();
}

function predictDrawing() {
    // Get image data from canvas
    const canvas = document.getElementById('canvas');
    const imageData = canvas.toDataURL('image/png').split(',')[1];
    predict(imageData);
}

// Image upload functions
function previewImage(input) {
    const preview = document.getElementById('preview');
    const predictBtn = document.getElementById('predictUploadBtn');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            predictBtn.disabled = false;
            hideResults();
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

function predictUpload() {
    const preview = document.getElementById('preview');
    const imageData = preview.src.split(',')[1];
    predict(imageData);
}

// Prediction and results functions
function predict(imageData) {
    // Show loading state
    document.getElementById('prediction').textContent = "...";
    document.getElementById('confidence').textContent = "Processing...";
    document.getElementById('prediction-container').style.display = 'block';
    
    // Send to server for prediction
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({image: imageData})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
            hideResults();
            return;
        }
        
        document.getElementById('prediction').textContent = data.digit;
        document.getElementById('confidence').textContent = 
            `Confidence: ${(data.confidence * 100).toFixed(1)}%`;
        document.getElementById('prediction-container').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error communicating with the server');
        hideResults();
    });
}

function hideResults() {
    document.getElementById('prediction-container').style.display = 'none';
}