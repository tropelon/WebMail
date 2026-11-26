// আপনার ব্যাকএন্ড বা Cloudflare Worker-এর URL এখানে বসান
const ENDPOINT_URL = "https://YOUR-WORKER-SUBDOMAIN.workers.dev";

// Brevo-তে আগে থেকে তৈরি থাকা অনুমোদিত সেন্ডার ইমেইলের তালিকা
const ALLOWED_SENDERS = [
  "sales@example.com",
  "info@example.com"
];

const form = document.getElementById("emailForm");
const statusEl = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const sender = document.getElementById("sender").value.trim();
  const senderName = document.getElementById("senderName").value.trim();
  const to = document.getElementById("to").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!ALLOWED_SENDERS.includes(sender)) {
    statusEl.style.color = "crimson";
    statusEl.textContent = "অননুমোদিত প্রেরক ঠিকানা নির্বাচন করা হয়েছে।";
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "পাঠানো হচ্ছে...";
  statusEl.style.color = "#333";
  statusEl.textContent = "";

  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender,
        senderName,
        to,
        subject,
        message
      })
    });

    const result = await response.json();

    if (response.ok) {
      statusEl.style.color = "green";
      statusEl.textContent = "ইমেইল সফলভাবে পাঠানো হয়েছে!";
      form.reset();
    } else {
      statusEl.style.color = "crimson";
      statusEl.textContent = result.error || "ইমেইল পাঠানো যায়নি।";
    }
  } catch (err) {
    statusEl.style.color = "crimson";
    statusEl.textContent = "নেটওয়ার্ক বা সার্ভার সংযোগে সমস্যা হয়েছে।";
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "ইমেইল পাঠান";
  }
});
