/**
 * ROAST Authentication Utilities (Design Stub)
 * This file is for HTML design preview only - NOT for production use.
 * The actual authentication is handled by the Next.js app in /src
 */

// Stub functions for design preview
const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

function showToast(message, type = ToastType.INFO, duration = 5000) {
    console.log(`[Design Preview Toast] ${type}: ${message}`);
    
    // Create visual toast for design preview
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-[90vw] sm:max-w-md';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `
        flex items-start gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${type === ToastType.SUCCESS ? 'bg-green-50 border-green-200 text-green-800' : ''}
        ${type === ToastType.ERROR ? 'bg-red-50 border-red-200 text-red-800' : ''}
        ${type === ToastType.WARNING ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : ''}
        ${type === ToastType.INFO ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
    `.replace(/\s+/g, ' ').trim();
    
    toast.innerHTML = `
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-tight">${message}</p>
            <p class="text-xs opacity-60 mt-1">(Design Preview Only)</p>
        </div>
        <button onclick="this.parentElement.remove()" class="flex-shrink-0 text-current opacity-50 hover:opacity-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    `;
    
    container.appendChild(toast);
    
    if (duration > 0) {
        setTimeout(() => toast.remove(), duration);
    }
    
    return toast;
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Please wait...</span>
        `;
        button.classList.add('cursor-not-allowed', 'opacity-80');
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.classList.remove('cursor-not-allowed', 'opacity-80');
    }
}

function disableForm(form, isDisabled) {
    const inputs = form.querySelectorAll('input, button, select, textarea');
    inputs.forEach(input => {
        input.disabled = isDisabled;
    });
}

function getUserFriendlyError(error) {
    return error.message || 'Something went wrong. Please try again.';
}

// Stub auth functions - these simulate the flow for design preview
async function handleLogin(email, password) {
    console.log('[Design Preview] Login attempt:', email);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('Design preview - use the Next.js app for real authentication', ToastType.INFO);
    return { user: { email } };
}

async function handleSignup(email, password, fullName) {
    console.log('[Design Preview] Signup attempt:', email, fullName);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('Design preview - use the Next.js app for real authentication', ToastType.INFO);
    return { needsEmailConfirmation: true, user: { email } };
}

async function handleForgotPassword(email) {
    console.log('[Design Preview] Password reset attempt:', email);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('Design preview - use the Next.js app for real authentication', ToastType.INFO);
    return {};
}

async function handleGoogleLogin() {
    console.log('[Design Preview] Google login attempt');
    showToast('Design preview - Google OAuth requires the Next.js app', ToastType.INFO);
    return {};
}

async function handleLogout() {
    console.log('[Design Preview] Logout');
    showToast('Logged out (design preview)', ToastType.SUCCESS);
    return true;
}

async function getCurrentUser() {
    return null;
}

async function checkAuthState() {
    return false;
}

// Export for global access
window.ROAST_AUTH = {
    showToast,
    ToastType,
    setButtonLoading,
    disableForm,
    getUserFriendlyError,
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleGoogleLogin,
    handleLogout,
    getCurrentUser,
    checkAuthState,
    getSupabase: () => {
        console.warn('[Design Preview] Supabase not available - use the Next.js app');
        return null;
    }
};

console.log('🔥 ROAST Auth Utilities loaded (Design Preview Mode)');
