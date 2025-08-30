# Bug Actions Dialog Implementation

## Overview
This document describes the implementation of the bug actions dialog that appears when clicking the three vertical dots (actions button) on any bug row in the project bugs listing page.

## Features

### Role-Based Access Control
- **Developer Role**: Can see and change bug status (New, In Progress, Resolved)
- **Manager/QA Role**: Can see and delete bugs

### Status Options (for Developers)
- **New**: Red color, represents newly created bugs
- **In Progress**: Blue color, represents bugs being worked on
- **Resolved**: Green color, represents completed bugs

### Delete Option (for Managers/QA)
- **Delete**: Red color with trash icon, allows deletion of bugs

## Implementation Details

### Frontend Components

#### 1. BugActionsDialog Component
- **Location**: `src/app/components/BugActionsDialog/page.tsx`
- **Props**:
  - `open`: Boolean to control dialog visibility
  - `anchorEl`: HTML element to position the dialog
  - `userRole`: User's role (manager, qa, developer)
  - `bugId`: ID of the selected bug
  - `currentStatus`: Current status of the bug
  - `onStatusChange`: Callback for status updates
  - `onDelete`: Callback for bug deletion
  - `isUpdating`: Boolean for loading state during status update
  - `isDeleting`: Boolean for loading state during deletion

#### 2. Main Page Integration
- **Location**: `src/app/projects/[id]/page.tsx`
- **Features**:
  - Role selector dropdown for testing
  - Action button click handlers
  - API integration for status updates and deletions
  - Loading states and error handling

### API Routes

#### 1. Update Bug Status
- **Route**: `PATCH /api/bugs/[bugId]/status`
- **Backend Endpoint**: `PATCH /api/v1/bugs/:bugId/status`
- **Required Body**: `{ status: string }`
- **Authentication**: Bearer token required

#### 2. Delete Bug
- **Route**: `DELETE /api/bugs/[bugId]`
- **Backend Endpoint**: `DELETE /api/v1/bugs/:bugId`
- **Authentication**: Bearer token required

## Backend Integration

### Status Update API
```typescript
// Frontend call
const response = await fetch(`/api/bugs/${bugId}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ status: newStatus })
});

// Backend endpoint: PATCH /api/v1/bugs/:bugId/status
// Required role: developer
// Allowed statuses: new, started, resolved (for bugs)
```

### Delete Bug API
```typescript
// Frontend call
const response = await fetch(`/api/bugs/${bugId}`, {
  method: 'DELETE',
  credentials: 'include',
});

// Backend endpoint: DELETE /api/v1/bugs/:bugId
// Required role: QA
```

## Usage

### For Developers
1. Click the three vertical dots on any bug row
2. Select a new status from the dropdown
3. The bug status will be updated in real-time
4. Loading state is shown during the update

### For Managers/QA
1. Click the three vertical dots on any bug row
2. Click the "Delete" option
3. The bug will be removed from the list
4. Loading state is shown during deletion

## Styling

### Dialog Design
- White background with rounded corners
- Subtle shadow for depth
- Positioned relative to the action button
- Responsive design with proper spacing

### Status Colors
- **New**: Red (#f44336) with light red background (#FDF2F2)
- **In Progress**: Blue (#2196f3) with light blue background (#EEF3FF)
- **Resolved**: Green (#4caf50) with light green background (#F0F9F0)

### Interactive States
- Hover effects on clickable elements
- Disabled states during loading
- Visual feedback for user actions

## Error Handling

### Frontend
- API call failures show alert messages
- Loading states prevent multiple simultaneous operations
- Graceful fallbacks for network issues

### Backend
- Proper HTTP status codes
- Detailed error messages
- Role-based access control validation

## Testing

### Role Testing
- Use the role selector dropdown in the header
- Test different permissions for each role
- Verify correct options are shown/hidden

### API Testing
- Test with valid and invalid bug IDs
- Test with different user roles
- Verify proper error handling

## Future Enhancements

### Potential Improvements
- Toast notifications instead of alerts
- Confirmation dialogs for destructive actions
- Bulk operations for multiple bugs
- Status change history tracking
- Real-time updates via WebSocket

### Additional Features
- Bug assignment functionality
- Comment system integration
- File attachment support
- Priority management
- Due date setting
