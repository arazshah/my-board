let users = [];
let filteredUsers = [];
let currentUserId = null;
      let currentPage = 1;
      const usersPerPage = 10;
let selectedUsers = new Set();

      document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();

        // Add event listeners
    document.getElementById("searchInput").addEventListener("input", searchUsers);
    document.getElementById("statusFilter").addEventListener("change", filterUsers);
    document.getElementById("roleFilter").addEventListener("change", filterUsers);
});

function fetchUsers() {
    showLoadingMessage();
    
    fetch("http://127.0.0.1:8000/api/users/users/", {
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("You don't have permission to access this resource");
                }
                throw new Error("Failed to fetch users");
            }
            return response.json();
        })
        .then((data) => {
            users = data;
            filteredUsers = users;
            renderUsers();
            updatePagination();
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            showErrorMessage(error.message);
        });
}

function showLoadingMessage() {
    const tableBody = document.getElementById("usersTableBody");
    tableBody.innerHTML = `<tr><td colspan="8" class="loading-message">Loading users...</td></tr>`;
}

function showErrorMessage(message) {
    const tableBody = document.getElementById("usersTableBody");
    tableBody.innerHTML = `<tr><td colspan="8" class="error-message">${message}</td></tr>`;
}

      function renderUsers() {
        const tableBody = document.getElementById("usersTableBody");
        tableBody.innerHTML = "";
    selectedUsers.clear();
    updateBulkDeleteButton();

        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const paginatedUsers = filteredUsers.slice(start, end);

        if (paginatedUsers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="empty-message">No users found</td></tr>`;
          return;
        }

        paginatedUsers.forEach((user) => {
          const row = document.createElement("tr");
        const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString() : 'Never';
        const joinDate = new Date(user.date_joined).toLocaleDateString();

          row.innerHTML = `
            <td><input type="checkbox" class="user-select" data-id="${user.id}" onchange="toggleUserSelection(${user.id})"></td>
            <td>
                <div class="user-info-cell">
                    <img src="${user.profile_image || 'https://via.placeholder.com/40'}" alt="${user.username}" class="user-avatar-small">
                            <div>
                        <div class="user-name">${user.first_name} ${user.last_name}</div>
                        <div class="user-username">@${user.username}</div>
                            </div>
                        </div>
                    </td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role}">${user.role}</span></td>
            <td><span class="badge badge-${user.status}">${user.status}</span></td>
            <td>${lastLogin}</td>
            <td>${joinDate}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="editUser(${user.id})" title="Edit User">
                                <span class="icon-edit"></span>
                            </button>
                <button class="btn-icon btn-danger" onclick="deleteUser(${user.id})" title="Delete User">
                                <span class="icon-delete"></span>
                            </button>
                    </td>
                `;

          tableBody.appendChild(row);
        });
      }

      function updatePagination() {
        const totalUsers = filteredUsers.length;
        const totalPages = Math.ceil(totalUsers / usersPerPage);

    document.getElementById("startRange").textContent = totalUsers === 0 ? 0 : (currentPage - 1) * usersPerPage + 1;
    document.getElementById("endRange").textContent = Math.min(currentPage * usersPerPage, totalUsers);
        document.getElementById("totalUsers").textContent = totalUsers;

    // Update pagination controls
    const paginationControls = document.getElementById("paginationControls");
    paginationControls.innerHTML = "";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = `pagination-btn ${currentPage === 1 ? "disabled" : ""}`;
    prevBtn.innerHTML = `<span class="icon-prev"></span>`;
        prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
              renderUsers();
              updatePagination();
        }
    };
    paginationControls.appendChild(prevBtn);

    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
          const firstBtn = document.createElement("button");
        firstBtn.className = "pagination-btn";
        firstBtn.textContent = "1";
        firstBtn.onclick = () => {
            currentPage = 1;
            renderUsers();
            updatePagination();
        };
        paginationControls.appendChild(firstBtn);

        if (startPage > 2) {
            const ellipsis = document.createElement("span");
            ellipsis.className = "pagination-ellipsis";
            ellipsis.textContent = "...";
            paginationControls.appendChild(ellipsis);
        }
          }

          for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement("button");
        btn.className = `pagination-btn ${i === currentPage ? "active" : ""}`;
            btn.textContent = i;
        btn.onclick = () => {
              currentPage = i;
              renderUsers();
              updatePagination();
        };
        paginationControls.appendChild(btn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement("span");
            ellipsis.className = "pagination-ellipsis";
            ellipsis.textContent = "...";
            paginationControls.appendChild(ellipsis);
          }

            const lastBtn = document.createElement("button");
        lastBtn.className = "pagination-btn";
            lastBtn.textContent = totalPages;
        lastBtn.onclick = () => {
              currentPage = totalPages;
              renderUsers();
              updatePagination();
        };
        paginationControls.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = `pagination-btn ${currentPage === totalPages ? "disabled" : ""}`;
    nextBtn.innerHTML = `<span class="icon-next"></span>`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderUsers();
            updatePagination();
        }
    };
    paginationControls.appendChild(nextBtn);
}

function searchUsers() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
    if (searchTerm.length > 0) {
        // Use backend search if available
        fetch(`http://127.0.0.1:8000/api/users/users/?search=${encodeURIComponent(searchTerm)}`, {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                filteredUsers = data;
                currentPage = 1;
                renderUsers();
                updatePagination();
            })
            .catch((error) => {
                console.error("Error searching users:", error);
                // Fallback to client-side filtering
                filterUsers();
            });
    } else {
        // Reset to all users with current filters
        filterUsers();
    }
}

function filterUsers() {
    const roleFilter = document.getElementById("roleFilter").value;
        const statusFilter = document.getElementById("statusFilter").value;
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();

    // Build query parameters
    let queryParams = [];
    if (roleFilter !== "all") queryParams.push(`role=${roleFilter}`);
    if (statusFilter !== "all") queryParams.push(`status=${statusFilter}`);
    if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    // Fetch filtered users from backend
    fetch(`http://127.0.0.1:8000/api/users/users/${queryString}`, {
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            filteredUsers = data;
            currentPage = 1;
            renderUsers();
            updatePagination();
        })
        .catch((error) => {
            console.error("Error filtering users:", error);
            // Fallback to client-side filtering
        filteredUsers = users.filter((user) => {
                const matchesRole = roleFilter === "all" || user.role === roleFilter;
                const matchesStatus = statusFilter === "all" || user.status === statusFilter;
                const matchesSearch = !searchTerm || 
                    user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
                    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm);
                
                return matchesRole && matchesStatus && matchesSearch;
        });

        currentPage = 1;
        renderUsers();
        updatePagination();
        });
}

      function openAddUserModal() {
        document.getElementById("modalTitle").textContent = "Add New User";
        document.getElementById("userForm").reset();
        document.getElementById("passwordGroup").style.display = "block";
        currentUserId = null;
        document.getElementById("userModal").classList.add("active");
      }

      function editUser(userId) {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        document.getElementById("modalTitle").textContent = "Edit User";
    document.getElementById("firstName").value = user.first_name || "";
    document.getElementById("lastName").value = user.last_name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("username").value = user.username || "";
    document.getElementById("role").value = user.role || "user";
    document.getElementById("status").value = user.status || "active";
    document.getElementById("passwordGroup").style.display = "block";
        document.getElementById("password").required = false;

        currentUserId = userId;
        document.getElementById("userModal").classList.add("active");
      }

      function saveUser() {
        const form = document.getElementById("userForm");
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const userData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
          email: document.getElementById("email").value,
          username: document.getElementById("username").value,
          role: document.getElementById("role").value,
          status: document.getElementById("status").value,
        };

    const password = document.getElementById("password").value;
    if (password) {
        userData.password = password;
    }

        if (currentUserId === null) {
          // Add new user
        fetch("http://127.0.0.1:8000/api/users/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(formatErrorMessages(data));
                    });
                }
                return response.json();
            })
            .then((data) => {
                users.push(data);
                filterUsers(); // Refresh with current filters
                closeModal();
                showToast("User added successfully");
            })
            .catch((error) => {
                console.error("Error adding user:", error);
                showToast(error.message || "Error adding user", "error");
            });
        } else {
          // Update existing user
        fetch(`http://127.0.0.1:8000/api/users/users/${currentUserId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(formatErrorMessages(data));
                    });
                }
                return response.json();
            })
            .then((data) => {
          const index = users.findIndex((u) => u.id === currentUserId);
          if (index !== -1) {
                    users[index] = data;
                }
                filterUsers(); // Refresh with current filters
                closeModal();
                showToast("User updated successfully");
            })
            .catch((error) => {
                console.error("Error updating user:", error);
                showToast(error.message || "Error updating user", "error");
            });
    }
}

function formatErrorMessages(errors) {
    if (typeof errors === 'string') return errors;
    
    let messages = [];
    for (const [field, errorList] of Object.entries(errors)) {
        if (Array.isArray(errorList)) {
            messages.push(`${field}: ${errorList.join(', ')}`);
        } else if (typeof errorList === 'string') {
            messages.push(`${field}: ${errorList}`);
        }
    }
    return messages.join('\n');
}

function deleteUser(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    document.getElementById("deleteUserName").textContent = `${user.first_name || ''} ${user.last_name || ''} (${user.username})`;
    currentUserId = userId;
    document.getElementById("deleteModal").classList.add("active");
}

function confirmDelete() {
    if (currentUserId === null) return;

    fetch(`http://127.0.0.1:8000/api/users/users/${currentUserId}/`, {
        method: "DELETE",
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            users = users.filter((u) => u.id !== currentUserId);
            filterUsers(); // Refresh with current filters
            closeDeleteModal();
            showToast("User deleted successfully");
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
            showToast("Error deleting user", "error");
        });
}

function toggleUserSelection(userId) {
    if (selectedUsers.has(userId)) {
        selectedUsers.delete(userId);
    } else {
        selectedUsers.add(userId);
    }
    updateBulkDeleteButton();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById("selectAll");
    const checkboxes = document.querySelectorAll(".user-select");
    
    if (selectAllCheckbox.checked) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            selectedUsers.add(parseInt(checkbox.dataset.id));
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            selectedUsers.delete(parseInt(checkbox.dataset.id));
        });
    }
    
    updateBulkDeleteButton();
}

function updateBulkDeleteButton() {
    const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
    bulkDeleteBtn.disabled = selectedUsers.size === 0;
}

function openBulkDeleteModal() {
    if (selectedUsers.size === 0) return;
    
    document.getElementById("selectedCount").textContent = selectedUsers.size;
    document.getElementById("bulkDeleteModal").classList.add("active");
}

function confirmBulkDelete() {
    if (selectedUsers.size === 0) return;
    
    fetch("http://127.0.0.1:8000/api/users/users/bulk_delete/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: Array.from(selectedUsers) }),
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete users");
            }
            return response.json();
        })
        .then((data) => {
            users = users.filter(user => !selectedUsers.has(user.id));
            selectedUsers.clear();
            filterUsers(); // Refresh with current filters
            closeBulkDeleteModal();
            showToast(data.message || "Users deleted successfully");
        })
        .catch((error) => {
            console.error("Error deleting users:", error);
            showToast("Error deleting users", "error");
        });
}

      function closeModal() {
        document.getElementById("userModal").classList.remove("active");
      }

      function closeDeleteModal() {
        document.getElementById("deleteModal").classList.remove("active");
      }

function closeBulkDeleteModal() {
    document.getElementById("bulkDeleteModal").classList.remove("active");
}

function showToast(message, type = "success") {
    const toast = document.getElementById("statusToast");
    const toastMessage = document.getElementById("toastMessage");
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        closeToast();
    }, 5000);
}

function closeToast() {
    const toast = document.getElementById("statusToast");
    toast.classList.remove("show");
}

function handleLogout() {
    fetch("http://127.0.0.1:8000/api/users/logout/", {
        method: "POST",
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Logout failed");
            }
            window.location.href = "../../../index.html";
        })
        .catch((error) => {
            console.error("Logout error:", error);
            showToast("Logout failed. Please try again.", "error");
        });
}