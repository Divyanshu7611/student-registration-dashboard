export const registrationTemplate = (
  userName: string,
  rollNo: string,
  eventName: string,
  qrUrl: string
) => {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`;

  return `
    <div style="font-family: sans-serif; padding: 20px; text-align: center;">
      <img 
        src="https://res.cloudinary.com/dzk5x7rjz/image/upload/v1744756604/RTU_logo_me4bn1.png" 
        alt="RTU Logo" 
        style="width: 120px; margin-bottom: 10px;" 
      />
      <div style="font-size: 14px; margin-bottom: 20px; color: #555;">
        Team Placement Cell, RTU Kota
      </div>

      <h2 style="margin-bottom: 10px;">Placement Cell RTU Kota – Registration Successful 🎉</h2>

      <p>Hello <strong>${userName}</strong>,</p>
      <p>You're successfully registered for the event <strong>${eventName}</strong>.</p>
      <p><strong>Roll No:</strong> ${rollNo}</p>
      <p>Please use the QR code below during event check-in:</p>
      
      <div style="margin: 20px 0;">
        <img 
          src="${qrImageUrl}" 
          alt="QR Code" 
          style="width: 200px; height: 200px; border: 1px solid #ccc;" 
        />
      </div>

      <p style="margin-top: 20px;">Thank you!</p>
      <p style="margin-top: 5px; font-weight: bold;">— Team Placement Cell, RTU Kota</p>
       <p style="margin-top: 4px; font-weight: bold;">— For Any Query Reach 9950156755</p>
    </div>
  `;
};
