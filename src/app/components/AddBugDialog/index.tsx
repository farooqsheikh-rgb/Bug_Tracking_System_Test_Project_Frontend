"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

interface AddBugDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onBugCreated: () => void;
}

export default function AddBugDialog({ open, onClose, projectId, onBugCreated }: AddBugDialogProps) {
  const [type, setType] = useState<'bug' | 'feature'>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProjectMembers = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        credentials: 'include',
      });
      const result = await response.json();
      
      if (result.success) {
        const developers = result.data.filter((user: User) => 
          user.user_type === 'developer'
        );
        setAvailableUsers(developers);
      } else {
        setError('Failed to fetch project members');
      }
    } catch (err) {
      console.error('Error fetching project members:', err);
      setError('Failed to fetch project members');
    }
  }, [projectId]);

  useEffect(() => {
    if (open && projectId) {
      fetchProjectMembers();
    }
  }, [open, projectId, fetchProjectMembers]);

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'image/png' || file.type === 'image/gif') {
        setSelectedFile(file);
      } else {
        setError('Please select a PNG or GIF file');
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'image/png' || file.type === 'image/gif') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please select a PNG or GIF file');
      }
    }
  };

  const handleAddUser = (user: User) => {
    if (!assignedUsers.find(u => u.id === user.id)) {
      setAssignedUsers([...assignedUsers, user]);
    }
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (userId: number) => {
    setAssignedUsers(assignedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !dueDate || assignedUsers.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (dueDate < new Date()) {
      setError('Due date must be today or in the future');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('deadline', dueDate.toISOString());
      formData.append('type', type);
      formData.append('status', 'pending');
      formData.append('project_id', projectId);
      
      if (selectedFile) {
        formData.append('screenshot', selectedFile);
      }

      const createResponse = await fetch('/api/bugs', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const createResult = await createResponse.json();

      if (!createResult.success) {
        throw new Error(createResult.message || 'Failed to create bug');
      }

      const bugId = createResult.data.id;

      if (assignedUsers.length > 0) {
        for (const user of assignedUsers) {
          const assignResponse = await fetch(`/api/bugs/${bugId}/assignee`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId: user.id }),
          });

          const assignResult = await assignResponse.json();
          if (!assignResult.success) {
            console.error(`Failed to assign user ${user.name} to bug:`, assignResult.message);
          }
        }
      }

      setSuccess('Bug created successfully!');
      setTimeout(() => {
        onBugCreated();
        onClose();
        resetForm();
      }, 1500);

    } catch (err) {
      console.error('Error creating bug:', err);
      setError(err instanceof Error ? err.message : 'Failed to create bug');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType('bug');
    setTitle('');
    setDescription('');
    setDueDate(null);
    setSelectedFile(null);
    setAssignedUsers([]);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minHeight: '600px',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 500, fontSize: "27.35px" , color: "#000000"}}>
            Add new
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as 'bug' | 'feature')}
              sx={{ 
                '& .MuiSelect-select': { 
                  py: 0.5,
                  fontWeight: 600,
                  color: type === 'bug' ? '#EC5962' : '#007DFA'
                }
              }}
            >
              <MenuItem value="bug" sx={{ color: '#EC5962', fontWeight: 600 }}>bug</MenuItem>
              <MenuItem value="feature" sx={{ color: '#007DFA', fontWeight: 600 }}>feature</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small">
            <Typography variant="h6">⋯</Typography>
          </IconButton>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3, gap: 2}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
            <Typography sx={{ fontWeight: 400, fontSize: "16.28px" }}>
              Assign to
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {assignedUsers.map((user) => (
                <Avatar
                  key={user.id}
                  sx={{
                    width: 36.35,
                    height: 36.35,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: '#000000',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRemoveUser(user.id)}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              ))}
              <IconButton
                size="small"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                sx={{
                  width: 32,
                  height: 32,
                  border: '1px dashed #D0D5DD',
                  color: '#007DFA',
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            
            {showUserDropdown && (
              <Box sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                backgroundColor: 'white',
                border: '1px solid #D0D5DD',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: 200,
                maxHeight: 200,
                overflow: 'auto',
                mt: 1,
              }}>
                {availableUsers.map((user) => (
                  <Box
                    key={user.id}
                    onClick={() => handleAddUser(user)}
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#F5F5F5' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '12px',
                        backgroundColor: '#000000',
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Add due date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: 150 },
                    placeholder: 'Select date',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Add title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              fontSize: '34.45px',
              fontWeight: 500,
            },
            '& fieldset': {
              border: 'none',
            },
          }}
        />

        <Typography sx={{ fontWeight: 400, fontSize: "16.28px", mb: 1 }}>
          Bug details
        </Typography>
        <TextField
          fullWidth
          rows={4}
          placeholder="Add here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              fontSize: '14.25px',
              fontWeight: 400
            },
          }}
        />

        <Box
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Box sx={{display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 1}}>
            <CloudUploadIcon sx={{ fontSize: 32, color: '#B0BABF', pb: 1 }} />
          <Typography sx={{ color: '#5B6871', mb: 1, fontWeight: 500, fontSize: "17.64px" }}>
            Drop any file here or{' '}
            <span style={{ color: '#007DFA', textDecoration: 'underline', cursor: 'pointer' }}>
              browse
            </span>
          </Typography>
          
          </Box>
          {selectedFile && (
            <Chip
              label={selectedFile.name}
              onDelete={() => setSelectedFile(null)}
              sx={{ mt: 1 }}
            />
          )}
          <input
            id="file-input"
            type="file"
            accept=".png,.gif"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleSubmit}
          // disabled={loading || !title.trim() || !description.trim() || !dueDate}
          sx={{
            width: '133px',
            height: '40px',
            backgroundColor: '#007DFA',
            textTransform: 'none',
            fontWeight: 600,
            color: '#F6F8F9',
            px: 3,
            // '&:disabled': {
            //   backgroundColor: '#E0E0E0',
            //   color: '#9E9E9E',
            // },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
