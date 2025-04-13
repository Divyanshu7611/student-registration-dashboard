export const registrationTemplate = (
    userName: string,
    rollNo: string,
    eventName: string,
    qrUrl: string
  ) => {
    return `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Registration Successful 🎉</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You're successfully registered for the event <strong>${eventName}</strong>.</p>
        <p><strong>Roll No:</strong> ${rollNo}</p>
        <p>Please use the QR below during the event check-in:</p>
        <img src="${qrUrl}" alt="QR Code" style="width: 200px; height: 200px; margin-top: 10px;" />
        <p style="margin-top: 20px;">Thank you!<br />Team EventOrg</p>
      </div>
    `;
  };
  