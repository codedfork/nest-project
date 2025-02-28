// src/common/enums/api-response-messages.enum.ts

export enum ApiResponseMessages {
    // Success Messages
    SUCCESS = 'Request was successful.',
    CREATED = 'Resource was created successfully.',
    UPDATED = 'Resource was updated successfully.',
    DELETED = 'Resource was deleted successfully.',
    FETCHED = 'Resources fetched successfully.',
    
    // Error Messages
    BAD_REQUEST = 'The request is invalid.',
    UNAUTHORIZED = 'You are not authorized to access this resource.',
    AUTHENTICATED = 'You are authenticated successfully.',
    FORBIDDEN = 'You do not have permission to perform this action.',
    NOT_FOUND = 'The requested resource could not be found.',
    INTERNAL_SERVER_ERROR = 'An unexpected error occurred. Please try again later.',
    VALIDATION_ERROR = 'Input validation failed.',
    
    // Custom or specific error messages
    USER_NOT_FOUND = 'User not found.',
    INVALID_CREDENTIALS = 'The credentials provided are invalid.',
    EMAIL_ALREADY_EXISTS = 'An account with this email already exists.',
    RESOURCE_ALREADY_EXISTS = 'Resource already exists.',
    
    // Info Messages
    PENDING = 'The request is being processed.',
    IN_PROGRESS = 'The task is in progress.',
    NO_CONTENT = 'No content available.',
  }
  