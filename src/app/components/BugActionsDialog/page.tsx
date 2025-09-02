"use client";
import React from "react";
import { Box, Typography, Divider, ClickAwayListener } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import deleteImg from "../../../../public/images/deleteimage.png";

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

  const getStatusOptions = () => {
    console.log("Getting status options for bug type:", bugType);

    if (bugType?.toLowerCase() === "feature") {
      console.log("Feature status options: new, started, completed");
      return [
        {
          label: "new",
          displayLabel: "New",
          color: "#EC5962",
          bgColor: "#FDF2F2",
        },
        {
          label: "started",
          displayLabel: "In Progress",
          color: "#3069FE",
          bgColor: "#EEF3FF",
        },
        {
          label: "completed",
          displayLabel: "Completed",
          color: "#00B894",
          bgColor: "#00B89414",
        },
      ];
    } else {
      console.log("Bug status options: new, started, resolved");
      return [
        {
          label: "new",
          displayLabel: "New",
          color: "#EC5962",
          bgColor: "#FDF2F2",
        },
        {
          label: "started",
          displayLabel: "In Progress",
          color: "#3069FE",
          bgColor: "#EEF3FF",
        },
        {
          label: "resolved",
          displayLabel: "Resolved",
          color: "#00B894",
          bgColor: "#00B89414",
        },
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
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    return {
      top: rect.bottom + scrollTop - 16,
      left: rect.right + scrollLeft + 1,
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
          width: "149.45px",
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
              fontWeight: 500,
              fontSize: "8.94px",
              color: "#000000",
            }}
          >
            Change Status
          </Typography>
          <SettingsIcon
            sx={{
              width: "15.33px",
              height: "15.33px",
              color: "#4B5563",
            }}
          />
        </Box>

        {userRole === "developer" && (
          <>
            {statusOptions.map((status) => (
              <Box
                key={status.label}
                onClick={() => !isUpdating && handleStatusClick(status.label)}
                sx={{
                  cursor: isUpdating ? "not-allowed" : "pointer",
                  height: "18.33px",
                  borderRadius: "3.06px",
                  marginBottom: "8px",
                  padding: "3.06px 6.11px",
                  backgroundColor: status.bgColor,
                  color: status.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "fit-content",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "9.17px",
                    lineHeight: "18.33px",
                  }}
                >
                  {status.displayLabel}
                </Typography>
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
              color: "#EB4C42",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "8.94px",
                lineHeight: "15.33px",
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Typography>
            <Box
              sx={{
                width: "13.7px",
                height: "13.7px",
                position: "relative",
              }}
            >
              <Image
                src={deleteImg}
                alt="ManageBug"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default BugActionsDialog;
