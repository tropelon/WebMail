emailjs.init("e9st5T3Biwaiv-BZ1");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm") ||
               document.getElementById("teamEmailForm") ||
               document.getElementById("emailForm") ||
               document.querySelector("form");

  if (!form) return;

  const statusEl = document.getElementById("statusMessage") ||
                   document.getElementById("status") ||
                   createStatusElement(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senderSelect = form.querySelector('[name="sender"]') || form.querySelector('select');
    const senderNameInput = form.querySelector('[name="senderName"]') || form.getElementById("senderName");
    const toInput = form.querySelector('[name="to"]') || form.querySelector('[name="email"]') || form.getElementById("to") || form.getElementById("email");
    const subjectInput = form.querySelector('[name="subject"]') || form.getElementById("subject");
    const messageInput = form.querySelector('[name="message"]') || form.querySelector('[name="body"]') || form.querySelector("textarea") || form.getElementById("message");

    const sender = senderSelect ? senderSelect.value : "";
    const senderName = senderNameInput ? senderNameInput.value.trim() : "";
    const to = toInput ? toInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!sender || !to || !subject || !message) {
      showStatus(statusEl, "অনুগ্রহ করে প্রেরক, বিষয় এবং মেসেজ সবগুলো ঘর পূরণ করুন!", true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    showStatus(statusEl, "ইমেইল পাঠানো হচ্ছে...", false);

    try {
      await emailjs.send("service_3pzo2cy", "template_0ktelva", {
        from_email: sender,
        from_name: senderName,
        to_email: to,
        subject: subject,
        message: message,
      });

      showStatus(statusEl, "ইমেইল সফলভাবে পাঠানো হয়েছে!", false);
      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      showStatus(statusEl, "ইমেইল পাঠাতে সমস্যা হয়েছে। কনসোল বা সেটিংস যাচাই করুন!", true);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

function createStatusElement(form) {
  const div = document.createElement("div");
  div.id = "statusMessage";
  div.style.marginTop = "10px";
  form.appendChild(div);
  return div;
}

function showStatus(el, text, isError) {
  el.textContent = text;
  el.style.color = isError ? "#d93025" : "#2e7d32";
}
