// Common functionality shared across dashboard pages
document.addEventListener("DOMContentLoaded", function () {
    // Check authentication on all dashboard pages
    checkAuth();
    
    // Set up notification bell
    setupNotifications();
});

function checkAuth() {
    const csrftoken = getCookie('csrftoken');
    fetch("http://127.0.0.1:8000/api/users/me/", {
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken || '',
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Not authenticated");
            }
            return response.json();
        })
        .then((user) => {
            updateUserInfo(user);
        })
        .catch((error) => {
            console.error("Auth check failed:", error);
            // Redirect to login if not authenticated
            window.location.href = "user_login.html";
        });
}

function updateUserInfo(user) {
    // Update user name
    document.getElementById("userName").textContent = 
        `${user.first_name || ""} ${user.last_name || user.username}`;

    // Update avatar
    const avatarElement = document.getElementById("userAvatar");
    avatarElement.src = user.profile_image || "https://via.placeholder.com/150";

    // Update last login
    const lastLogin = new Date(user.last_login);
    document.getElementById("lastLogin").textContent = lastLogin.toLocaleString();
}

function setupNotifications() {
    const notificationBell = document.querySelector('.notification-bell');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotificationsBtn = document.getElementById('closeNotifications');
    
    if (notificationBell && notificationPanel) {
        notificationBell.addEventListener('click', function() {
            notificationPanel.classList.toggle('active');
            loadNotifications(); // Load notifications when the bell is clicked
        });
        
        closeNotificationsBtn.addEventListener('click', function() {
            notificationPanel.classList.remove('active');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationBell.contains(event.target) && 
                !notificationPanel.contains(event.target)) {
                notificationPanel.classList.remove('active');
            }
        });
    }
}

function loadNotifications() {
    const csrftoken = getCookie('csrftoken');
    fetch("http://127.0.0.1:8000/api/notifications/", {
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken || '',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load notifications");
        }
        return response.json();
    })
    .then(notifications => {
        const notificationList = document.getElementById('notificationList');
        notificationList.innerHTML = ''; // Clear existing notifications
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-comment"></i>
                </div>
                <div class="notification-content">
                    <p>${notification.message}</p>
                    <span class="notification-time">${formatDate(notification.timestamp)}</span>
                </div>
            `;
            notificationList.appendChild(notificationItem);
        });
    })
    .catch(error => {
        console.error("Error loading notifications:", error);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString(); // Format date as needed
}

function handleLogout() {
    const csrftoken = getCookie('csrftoken');
    fetch("http://127.0.0.1:8000/api/users/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken || '',
        }
    })
        .then(() => {
            console.log("Logout successful");
            window.location.href = "user_login.html";
        })
        .catch((error) => {
            console.error("Logout error:", error);
            showNotification("Logout failed. Please try again.", "error");
        });
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);
    
    // Hide and remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Function to get CSRF cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
} 