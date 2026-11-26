export default {
async fetch(request, env) {
const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "POST, OPTIONS",
"Access-Control-Allow-Headers": "Content-Type"
};
​if (request.method === "OPTIONS") {
return new Response(null, { headers: corsHeaders });
}
​if (request.method !== "POST") {
return new Response(JSON.stringify({ error: "শুধুমাত্র POST অনুমোদিত" }), {
status: 405,
headers: { ...corsHeaders, "Content-Type": "application/json" }
});
}
​try {
const { sender, senderName, to, subject, message } = await request.json();
const allowedSenders = [
"sales@troplon.2bd.net",
"info@troplon.2bd.net",
"contact@troplon.2bd.net",
"no-reply@troplon.2bd.net"
];
​if (!allowedSenders.includes(sender)) {
return new Response(JSON.stringify({ error: "এই সেন্ডার ব্যবহারের অনুমতি নেই" }), {
status: 400,
headers: { ...corsHeaders, "Content-Type": "application/json" }
});
}
​if (!to || !subject || !message) {
return new Response(JSON.stringify({ error: "সব ঘর পূরণ করুন" }), {
status: 400,
headers: { ...corsHeaders, "Content-Type": "application/json" }
});
}
​const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
method: "POST",
headers: {
"accept": "application/json",
"api-key": env.BREVO_API_KEY,
"content-type": "application/json"
},
body: JSON.stringify({
sender: { name: senderName || "Team", email: sender },
to: [{ email: to }],
subject: subject,
textContent: message
})
});
​const data = await brevoRes.json();
if (!brevoRes.ok) {
return new Response(JSON.stringify({ error: data.message || "Brevo API এরর" }), {
status: brevoRes.status,
headers: { ...corsHeaders, "Content-Type": "application/json" }
});
}
​return new Response(JSON.stringify({ success: true, messageId: data.messageId }), {
status: 200,
headers: { ...corsHeaders, "Content-Type": "application/json" }
});
} catch (error) {
return new Response(JSON.stringify({ error: "সার্ভার এরর ঘটেছে" }), {
status: 500,
headers: { ...corsHeaders, "Content-Type": "application/json" }
});
}
}
};
