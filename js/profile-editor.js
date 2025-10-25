// Profile Editor Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProfileEditor();
});

function initializeProfileEditor() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-form');
    
    if (!editProfileBtn || !profileForm) return;
    
    // Load current user data into form
    loadProfileData();
    
    // Edit button click handler
    editProfileBtn.addEventListener('click', function() {
        const isEditing = this.textContent.includes('Edit');
        
        if (isEditing) {
            enableEditingMode();
        } else {
            cancelEditing();
        }
    });
    
    // Form submission handler
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges();
    });
    
    // Bio character counter
    const bioTextarea = document.getElementById('bio');
    if (bioTextarea) {
        addCharacterCounter(bioTextarea);
    }
}

function loadProfileData() {
    const userData = Storage.get('userData', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'Cybersecurity enthusiast passionate about protecting digital communications.'
    });
    
    // Populate form fields
    const fields = {
        'first-name': userData.firstName || '',
        'last-name': userData.lastName || '',
        'email': userData.email || '',
        'phone': userData.phone || '',
        'bio': userData.bio || ''
    };
    
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = fields[fieldId];
        }
    });
    
    // Update profile header
    updateProfileHeader(userData);
    
    // Update bio character counter
    const bioField = document.getElementById('bio');
    if (bioField) {
        updateCharacterCounter(bioField);
    }
}

function updateProfileHeader(userData) {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileName) {
        profileName.textContent = `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`;
    }
    if (profileEmail) {
        profileEmail.textContent = userData.email || 'john.doe@example.com';
    }
}

function enableEditingMode() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const formInputs = profileForm.querySelectorAll('input, textarea');
    const formActions = document.getElementById('form-actions');
    
    // Enable form fields
    formInputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.add('editable');
    });
    
    // Show form actions
    if (formActions) {
        formActions.style.display = 'flex';
    }
    
    // Update button
    editProfileBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    editProfileBtn.classList.remove('btn-primary');
    editProfileBtn.classList.add('btn-outline');
}

function cancelEditing() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const formInputs = profileForm.querySelectorAll('input, textarea');
    const formActions = document.getElementById('form-actions');
    
    // Disable form fields
    formInputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.classList.remove('editable');
    });
    
    // Hide form actions
    if (formActions) {
        formActions.style.display = 'none';
    }
    
    // Update button
    editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
    editProfileBtn.classList.remove('btn-outline');
    editProfileBtn.classList.add('btn-primary');
    
    // Reload original data
    loadProfileData();
}

function saveProfileChanges() {
    const formData = new FormData(document.getElementById('profile-form'));
    const userData = {
        firstName: formData.get('firstName') || '',
        lastName: formData.get('lastName') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        bio: formData.get('bio') || ''
    };
    
    // Validate bio length
    if (userData.bio && userData.bio.length > 200) {
        showNotification('Bio must be 200 characters or less.', 'error');
        return;
    }
    
    // Validate email
    if (userData.email && !isValidEmail(userData.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Save to localStorage
    const existingData = Storage.get('userData', {});
    const updatedData = { ...existingData, ...userData };
    Storage.set('userData', updatedData);
    
    // Update navigation profile info
    if (typeof updateProfileInfo === 'function') {
        updateProfileInfo({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email
        });
    }
    
    // Update profile header
    updateProfileHeader(userData);
    
    // Log activity
    if (typeof logActivity === 'function') {
        logActivity('settings', 'Updated profile information', 'success');
    }
    
    // Exit editing mode
    cancelEditing();
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

function addCharacterCounter(textarea) {
    const maxLength = 200;
    const counter = document.createElement('small');
    counter.className = 'char-count';
    counter.style.display = 'block';
    counter.style.marginTop = '0.5rem';
    counter.style.color = 'var(--text-secondary)';
    
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        updateCharacterCounter(textarea);
    });
    
    // Initial update
    updateCharacterCounter(textarea);
}

function updateCharacterCounter(textarea) {
    const maxLength = 200;
    const counter = textarea.parentNode.querySelector('.char-count');
    if (!counter) return;
    
    const length = textarea.value.length;
    counter.textContent = `${length}/${maxLength} characters`;
    counter.style.color = length > maxLength ? 'var(--error-color)' : 'var(--text-secondary)';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// CSS for editable fields
const style = document.createElement('style');
style.textContent = `
    .profile-form input.editable,
    .profile-form textarea.editable {
        background: var(--input-bg);
        border-color: rgba(0, 212, 255, 0.3);
        cursor: text;
    }
    
    .profile-form input.editable:focus,
    .profile-form textarea.editable:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
    }
    
    .form-actions {
        display: none;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(0, 212, 255, 0.2);
    }
    
    .char-count {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);
