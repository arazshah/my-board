document.addEventListener("DOMContentLoaded", function () {
    // Load user profile data
    loadUserProfile();
    
    // Load user stats
    loadUserStats();
    
    // Set up edit profile button
    setupEditProfileButton();
});

function loadUserProfile() {
    const csrftoken = getCookie('csrftoken');
    fetch("http://127.0.0.1:8000/api/users/me/", {
        credentials: "include",
        headers: {
            "X-CSRFToken": csrftoken || '',
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load profile");
            }
            return response.json();
        })
        .then((user) => {
            updateProfileInfo(user);
            calculateProfileCompletion(user);
        })
        .catch((error) => {
            console.error("Error loading profile:", error);
            showNotification("Failed to load profile data", "error");
        });
}

function updateProfileInfo(user) {
    // Update profile image
    const profileImage = document.getElementById("profileImage");
    if (profileImage) {
        profileImage.src = user.profile_image || "https://via.placeholder.com/150";
    }
    
    // Update profile details
    document.getElementById("profileUsername").textContent = user.username || "Not set";
    document.getElementById("profileFullName").textContent = 
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Not set";
    document.getElementById("profileEmail").textContent = user.email || "Not set";
    document.getElementById("profileBio").textContent = user.bio || "No bio provided";
    document.getElementById("profilePhone").textContent = user.phone_number || "Not provided";
    document.getElementById("profileLocation").textContent = user.location || "Not provided";
    
    // Update website with link if provided
    const websiteElement = document.getElementById("profileWebsite");
    if (websiteElement) {
        if (user.website) {
            websiteElement.textContent = user.website;
            websiteElement.href = user.website.startsWith('http') ? user.website : `https://${user.website}`;
        } else {
            websiteElement.textContent = "Not provided";
            websiteElement.removeAttribute("href");
        }
    }
    
    // Update join date
    const joinDateElement = document.getElementById("profileJoined");
    if (joinDateElement) {
        const joinDate = new Date(user.date_joined);
        joinDateElement.textContent = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Update role badge
    const roleBadgeElement = document.getElementById("roleBadge");
    if (roleBadgeElement) {
        roleBadgeElement.textContent = user.role || "User";
        roleBadgeElement.className = `role-badge ${user.role || "user"}`;
    }
    
    // Update status indicator
    const statusIndicatorElement = document.getElementById("statusIndicator");
    if (statusIndicatorElement) {
        statusIndicatorElement.textContent = user.status || "Active";
        statusIndicatorElement.className = `status-indicator ${user.status || "active"}`;
    }
}

function calculateProfileCompletion(user) {
    if (!user) return;
    
    const fields = [
        { name: 'profile_image', value: user.profile_image },
        { name: 'first_name', value: user.first_name },
        { name: 'last_name', value: user.last_name },
        { name: 'bio', value: user.bio },
        { name: 'phone_number', value: user.phone_number },
        { name: 'location', value: user.location },
        { name: 'website', value: user.website }
    ];
    
    const completedFields = fields.filter(field => field.value && field.value.trim && field.value.trim() !== '').length;
    const completionPercentage = Math.round((completedFields / fields.length) * 100);
    
    // Update completion bar
    const completionBar = document.getElementById("profileCompletionBar");
    const completionText = document.getElementById("profileCompletion");
    
    if (completionBar && completionText) {
        completionBar.style.width = `${completionPercentage}%`;
        completionText.textContent = `${completionPercentage}%`;
        
        // Update completion class
        completionBar.className = 'progress-bar';
        if (completionPercentage < 40) {
            completionBar.classList.add('progress-low');
        } else if (completionPercentage < 70) {
            completionBar.classList.add('progress-medium');
        } else {
            completionBar.classList.add('progress-high');
        }
    }
}

function loadUserStats() {
    // This would normally fetch from an API, but we'll use mock data for now
    const mockStats = {
        posts: 12,
        comments: 48,
        likes: 156,
        views: 1243
    };
    
    // Update stats in the UI
    const postsCount = document.getElementById("postsCount");
    const commentsCount = document.getElementById("commentsCount");
    const likesCount = document.getElementById("likesCount");
    const viewsCount = document.getElementById("viewsCount");
    
    if (postsCount) postsCount.textContent = mockStats.posts;
    if (commentsCount) commentsCount.textContent = mockStats.comments;
    if (likesCount) likesCount.textContent = mockStats.likes;
    if (viewsCount) viewsCount.textContent = mockStats.views;
}

function setupEditProfileButton() {
    const editProfileBtn = document.getElementById("editProfileBtn");
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", openEditProfileModal);
    }
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

function handleProfileImageUpload() {
    const fileInput = document.getElementById("editProfileImage");
    if (!fileInput) return;
    
    fileInput.addEventListener("change", function() {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Preview the image if needed
                const previewImg = document.getElementById("imagePreview");
                if (previewImg) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = "block";
                }
            };
            
            reader.readAsDataURL(fileInput.files[0]);
        }
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
    if (fileInput && fileInput.files && fileInput.files[0]) {
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
            updateProfileInfo(updatedUser);
            calculateProfileCompletion(updatedUser);
            
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

// Function to format date in a readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
} 