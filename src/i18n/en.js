// en.js
export default {
    // Global Actions
    ACTION: {
        "SUBMIT": "Submit",
        "CONFIRM": "Confirm",
    },
    // Global Fields
    FIELD: {
        "NAME": "Name",
        "PASSWORD": "Password",
    },
    // Backend Error Codes
    ERRORS: {
        "DEFAULT": "An unknown error occurred. Please contact customer support.",
        "AUTH_001": "Invalid account or password.",
        "AUTH_005": "This email is already registered!",
        "LOGIN_FAILED": "Login failed.",
        "EDIT_FAILED": "Edit failed.",
    },
    // Validation Rules
    VALIDATION: {
        "REQUIRED": "Required.",
        "PWD_COMPLEXITY": "Must contain uppercase, lowercase, numbers, and special characters.",
        "EMAIL_FORMAT": "Invalid email format.",
    },
    // Page Content
    PAGE: {
        LOGIN: {
            "TITLE": "Member Login",
            "NO_ACCOUNT_HINT": "Not a member yet?",
            "SIGNUP_LINK": "Sign up now",
            "TYPEEMAIL": "Please enter your email",
            "TYPEPWD": "Please enter your password",
            "OR": "OR"
        },
        REGISTER: {
            "TITLE": "Create Account",
            "SET_PASSWORD": "Set Password",
            "SUBMIT_BTN": "Sign Up",
            "HAS_ACCOUNT_HINT": "Already have an account?",
            "LOGIN_LINK": "Back to Login",
            "REGISTER_SUCCESS": "Registration successful!",
            "TYPENAME": "Please enter your name",
        },
        MEMBER: {
            "TITLE": "Member Center",
            "HELLO": "Hello!",
            "WELCOME_BACK": "Welcome back!",
        }
    }
}