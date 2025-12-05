function togglePw() {
  const pw = document.getElementById("pw");
  const eyeOpen = document.getElementById("eye-open");
  const eyeClosed = document.getElementById("eye-closed");

  if (pw.type === "password") {
    pw.type = "text";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  } else {
    pw.type = "password";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  }
}
