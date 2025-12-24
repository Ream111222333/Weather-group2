//===================Notification=========================//

document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.querySelector(".clear-btn");
    const notificationList = document.querySelector(".notification-list");
    const notificationItems = document.querySelectorAll(".notification-item");
  
    // Check if there are no notifications
    if (notificationItems.length === 0) {
        notificationList.innerHTML = "<p class='empty-message'>No notifications available.</p>";
    }
  
    // Mark notifications as read
    notificationItems.forEach((item) => {
        item.addEventListener("click", () => {
            item.classList.remove("unread");
        });
    });
  
    // Clear all notifications
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            notificationList.innerHTML = "<p class='empty-message'>No notifications available.</p>";
        });
    } else {
        console.error("Clear All button not found.");
    }
  
    // Delete notification one by one
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const notificationItem = event.target.closest(".notification-item");
            if (notificationItem) {
                notificationItem.remove();
                console.log("Notification removed.");
            } else {
                console.log("Notification item not found.");
            }
        });
    });
  });
  
  console.log("link javaScript is Running")
  
  //=============================notication==============================//