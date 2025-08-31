"use client";
import React from "react";
import {
  Box,
  Typography,
  Divider,
  ClickAwayListener,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface BugActionsDialogProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  userRole: "manager" | "QA" | "developer";
  bugId: number;
  bugType: string; 
  onStatusChange: (bugId: number, newStatus: string) => void;
  onDelete: (bugId: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const BugActionsDialog: React.FC<BugActionsDialogProps> = ({
  open,
  anchorEl,
  onClose,
  userRole,
  bugId,
  bugType,
  onStatusChange,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  if (!open || !anchorEl) return null;

  console.log('BugActionsDialog - User Role:', userRole);
  console.log('BugActionsDialog - Bug Type:', bugType);
  console.log('BugActionsDialog - Bug ID:', bugId);

  const getStatusOptions = () => {
    console.log('Getting status options for bug type:', bugType);
    
    if (bugType?.toLowerCase() === "feature") {
      console.log('Feature status options: new, started, completed');
      return [
        { label: "new", displayLabel: "New", color: "#f44336", bgColor: "#FDF2F2" },
        { label: "started", displayLabel: "In Progress", color: "#2196f3", bgColor: "#EEF3FF" },
        { label: "completed", displayLabel: "Completed", color: "#4caf50", bgColor: "#F0F9F0" },
      ];
    } else {
      console.log('Bug status options: new, started, resolved');
      return [
        { label: "new", displayLabel: "New", color: "#f44336", bgColor: "#FDF2F2" },
        { label: "started", displayLabel: "In Progress", color: "#2196f3", bgColor: "#EEF3FF" },
        { label: "resolved", displayLabel: "Resolved", color: "#4caf50", bgColor: "#F0F9F0" },
      ];
    }
  };

  const statusOptions = getStatusOptions();

  const handleStatusClick = (newStatus: string) => {
    onStatusChange(bugId, newStatus);
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(bugId);
    onClose();
  };

  const getPosition = () => {
    if (!anchorEl) return { top: 0, left: 0 };
    
    const rect = anchorEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
      top: rect.bottom + scrollTop + 8,
      left: rect.right + scrollLeft - 220, 
    };
  };

  const position = getPosition();

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: position.top,
          left: position.left,
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          padding: "16px",
          minWidth: "200px",
          zIndex: 1000,
          border: "1px solid #E0E0E0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "14px",
              color: "#252C32",
            }}
          >
            Change Status
          </Typography>
          <SettingsIcon
            sx={{
              color: "#5B6871",
              fontSize: "18px",
            }}
          />
        </Box>

        {(userRole === "developer" ) && (
          <>
            {statusOptions.map((status) => (
              <Box
                key={status.label}
                onClick={() => !isUpdating && handleStatusClick(status.label)}
                sx={{
                  cursor: isUpdating ? "not-allowed" : "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  backgroundColor: status.bgColor,
                  color: status.color,
                  fontWeight: 500,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: isUpdating ? 0.6 : 1,
                  "&:hover": {
                    backgroundColor: status.bgColor,
                    opacity: isUpdating ? 0.6 : 0.8,
                  },
                  transition: "opacity 0.2s ease",
                }}
              >
                <Typography>{status.displayLabel}</Typography>
                <MoreVertIcon 
                  sx={{ 
                    fontSize: "16px", 
                    color: status.color,
                    opacity: 0.7 
                  }} 
                />
              </Box>
            ))}
            <Divider sx={{ margin: "12px 0" }} />
          </>
        )}

        {(userRole === "manager" || userRole === "QA") && (
          <Box
            onClick={() => !isDeleting && handleDeleteClick()}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: isDeleting ? "not-allowed" : "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              color: "#f44336",
              fontWeight: 500,
              fontSize: "13px",
              opacity: isDeleting ? 0.6 : 1,
              "&:hover": {
                backgroundColor: isDeleting ? "transparent" : "#FDF2F2",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <Typography>
              {isDeleting ? "Deleting..." : "Delete"}
            </Typography>
            <DeleteIcon
              sx={{
                color: "#f44336",
                fontSize: "18px",
              }}
            />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default BugActionsDialog;