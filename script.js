emailjs.init("e9st5T3Biwaiv-BZ1");
const ENDPOINT_URL = "https://floral-block-864d.tropelon.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("teamEmailForm") ||
    document.getElementById("emailForm") ||
    document.querySelector("form");

  if (!form) return;

  const statusEl =
    document.getElementById("statusMessage") ||
    document.getElementById("status") ||
    createStatusElement(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const toInput =
      form.querySelector('[name="to"]') ||
      form.querySelector('[name="email"]') ||
      document.getElementById("to") ||
      document.getElementById("email");

    const subjectInput =
      form.querySelector('[name="subject"]') ||
      document.getElementById("subject");

    const messageInput =
      form.querySelector('[name="message"]') ||
      form.querySelector('[name="body"]') ||
      form.querySelector("textarea") ||
      document.getElementById("message");

    const to = toInput ? toInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!to || !subject || !message) {
      showStatus(statusEl, "অনুগ্রহ করে প্রাপক, বিষয় এবং মেসেজ সবগুলো ঘর পূরণ করুন।", true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    showStatus(statusEl, "ইমেইল পাঠানো হচ্ছে...", false);

    emailjs.send('service_3pzo2cy', 'template_0ktelva', { to_email: to, subject: subject, message: message })
      }
    } catch (error) {
      showStatus(statusEl, "নেটওয়ার্ক বা সার্ভার সংযোগে সমস্যা হয়েছে।", true);
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
  el.style.color = isError ? "#d93025" : "#188038";
}
