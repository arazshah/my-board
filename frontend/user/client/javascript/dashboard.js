// Check authentication status when page loads
document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
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
            loadUserActivity();
            loadUserStats();
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
    
    // Update role badge
    const roleBadge = document.getElementById("userRole");
    if (roleBadge) {
        roleBadge.textContent = user.role;
        roleBadge.className = `role-badge ${user.role}`;
    }
    
    // Update status indicator
    const statusIndicator = document.getElementById("userStatus");
    if (statusIndicator) {
        statusIndicator.textContent = user.status;
        statusIndicator.className = `status-indicator ${user.status}`;
    }
    
    // Update profile completion percentage
    updateProfileCompletion(user);
}

function updateProfileCompletion(user) {
    // Calculate profile completion percentage
    const profileFields = [
        'first_name', 'last_name', 'email', 'bio', 
        'phone_number', 'location', 'website', 'profile_image'
    ];
    
    let completedFields = 0;
    profileFields.forEach(field => {
        if (user[field] && user[field] !== '') {
            completedFields++;
        }
    });
    
    const completionPercentage = Math.round((completedFields / profileFields.length) * 100);
    
    // Update the UI
    const completionElement = document.getElementById("profileCompletion");
    if (completionElement) {
        completionElement.textContent = `${completionPercentage}%`;
        
        // Update progress bar if it exists
        const progressBar = document.getElementById("profileCompletionBar");
        if (progressBar) {
            progressBar.style.width = `${completionPercentage}%`;
            
            // Change color based on completion
            if (completionPercentage < 30) {
                progressBar.className = "progress-bar progress-low";
            } else if (completionPercentage < 70) {
                progressBar.className = "progress-bar progress-medium";
            } else {
                progressBar.className = "progress-bar progress-high";
            }
        }
    }
}

function loadUserActivity() {
    // This would typically fetch from an API
    // For now, we'll use mock data
    const activities = [
        { type: 'login', date: new Date(Date.now() - 1000 * 60 * 5), message: 'You logged in' },
        { type: 'profile', date: new Date(Date.now() - 1000 * 60 * 60 * 2), message: 'You updated your profile' },
        { type: 'post', date: new Date(Date.now() - 1000 * 60 * 60 * 24), message: 'You created a new post' },
        { type: 'comment', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), message: 'You commented on a post' }
    ];
    
    const activityContainer = document.getElementById("recentActivity");
    if (!activityContainer) return;
    
    activityContainer.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.type}`;
        
        const timeAgo = getTimeAgo(activity.date);
        
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}-icon"></div>
            <div class="activity-content">
                <div class="activity-message">${activity.message}</div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        `;
        
        activityContainer.appendChild(activityItem);
    });
}

function loadUserStats() {
    // Mock data for user statistics
    const stats = {
        posts: 12,
        comments: 48,
        likes: 156,
        views: 1243
    };
    
    // Update stats in the UI
    Object.keys(stats).forEach(stat => {
        const element = document.getElementById(`${stat}Count`);
        if (element) {
            element.textContent = stats[stat];
        }
    });
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
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
            window.location.href = "user_login.html";
        })
        .catch((error) => {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        });
}

function handleProfileImageUpload() {
    const fileInput = document.getElementById("editProfileImage");
    fileInput.addEventListener("change", function() {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Preview the image if needed
                // const previewImg = document.getElementById("imagePreview");
                // previewImg.src = e.target.result;
            };
            
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
}

function openEditProfileModal() {
    console.log("Opening edit profile modal");
    // Fetch current user data
    const csrftoken = getCookie('csrftoken');
    fetch("http://127.0.0.1:8000/api/users/me/", {
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken || '',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .then(user => {
            console.log("User data fetched:", user);
            // Populate form with current user data
            document.getElementById("editFirstName").value = user.first_name || '';
            document.getElementById("editLastName").value = user.last_name || '';
            document.getElementById("editBio").value = user.bio || '';
            document.getElementById("editPhone").value = user.phone_number || '';
            document.getElementById("editLocation").value = user.location || '';
            document.getElementById("editWebsite").value = user.website || '';
            
            // Show the modal
            const modal = document.getElementById("editProfileModal");
            if (modal) {
                modal.classList.add("active");
                console.log("Modal activated");
            } else {
                console.error("Modal element not found");
            }
            
            // Set up image upload handler
            handleProfileImageUpload();
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            showNotification("Could not load your profile data. Please try again.", "error");
        });
}

function saveProfile() {
    const formData = new FormData();
    
    // Add text fields
    formData.append('first_name', document.getElementById("editFirstName").value);
    formData.append('last_name', document.getElementById("editLastName").value);
    formData.append('bio', document.getElementById("editBio").value);
    formData.append('phone_number', document.getElementById("editPhone").value);
    formData.append('location', document.getElementById("editLocation").value);
    formData.append('website', document.getElementById("editWebsite").value);
    
    // Add profile image if selected
    const fileInput = document.getElementById("editProfileImage");
    if (fileInput.files && fileInput.files[0]) {
        formData.append('profile_image', fileInput.files[0]);
    }
    
    const csrftoken = getCookie('csrftoken');
    fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "PUT",
        headers: {
            "X-CSRFToken": csrftoken || '',
        },
        body: formData,
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update profile");
            }
            return response.json();
        })
        .then(updatedUser => {
            // Update the UI with new user data
            updateUserInfo(updatedUser);
            
            // Close the modal
            closeEditProfileModal();
            
            // Show success message
            showNotification("Profile updated successfully", "success");
        })
        .catch(error => {
            console.error("Error updating profile:", error);
            showNotification("Failed to update profile. Please try again.", "error");
        });
}

function closeEditProfileModal() {
    const modal = document.getElementById("editProfileModal");
    if (modal) {
        modal.classList.remove("active");
    }
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